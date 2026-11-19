#!/usr/bin/env python3
"""Extract missing Re:Zero source chapters to a temporary UTF-8 directory."""

from __future__ import annotations

import argparse
import os
import re
import ssl
import subprocess
import sys
import tempfile
from email.message import Message
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import URLError
from urllib.parse import parse_qs, urljoin, urlsplit
from urllib.request import Request, urlopen


NOVEL_URL = "https://ncode.syosetu.com/n2267be/"
CHAPTERS_DIRECTORY = Path(__file__).resolve().parent / "chapters"
EPISODE_PATH = re.compile(r"/n2267be/([1-9][0-9]*)/?")
CHAPTER_NUMBER = re.compile(r"[1-9][0-9]*")
VOID_TAGS = frozenset({
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
})
SKIPPED_TAGS = frozenset({"script", "style", "noscript", "rt", "rp"})
TITLE_CLASSES = frozenset({
    "p-novel__title", "p-novel__subtitle-episode", "novel_subtitle",
})
SECTION_IDS = {"novel_p": "preface", "novel_honbun": "body", "novel_a": "afterword"}


class TableOfContentsParser(HTMLParser):
    """Collect actual episode and pagination links for this novel only."""

    def __init__(self, page_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_url = page_url
        self.chapters: dict[int, str] = {}
        self.pages: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        href = dict(attrs).get("href")
        if not href:
            return
        address = urlsplit(urljoin(self.page_url, href))
        if address.scheme not in ("http", "https") or address.hostname != "ncode.syosetu.com":
            return

        episode = EPISODE_PATH.fullmatch(address.path)
        if episode is not None:
            number = int(episode[1])
            self.chapters[number] = f"{NOVEL_URL}{number}/"
        elif address.path.rstrip("/") == "/n2267be":
            page_numbers = parse_qs(address.query).get("p", ["1"])
            if len(page_numbers) == 1 and CHAPTER_NUMBER.fullmatch(page_numbers[0]):
                number = int(page_numbers[0])
                self.pages.add(NOVEL_URL if number == 1 else f"{NOVEL_URL}?p={number}")


def discover_chapters() -> dict[int, str]:
    """Follow the paginated index rather than guessing episodes from a total."""
    pending = {NOVEL_URL}
    visited: set[str] = set()
    chapters: dict[int, str] = {}
    while pending:
        page_url = min(pending)
        pending.remove(page_url)
        print(f"Checking table of contents: {page_url}", file=sys.stderr, flush=True)
        parser = TableOfContentsParser(page_url)
        parser.feed(fetch_chapter_html(page_url))
        parser.close()
        if not parser.chapters:
            raise ValueError(f"could not find episode links on {page_url}")
        chapters.update(parser.chapters)
        visited.add(page_url)
        pending.update(parser.pages - visited)
    return chapters


def find_missing_chapters(chapters_directory: Path) -> dict[int, str]:
    """Compare source episodes with regular files, ignoring decimal side stories."""
    existing = {
        int(path.stem)
        for path in chapters_directory.iterdir()
        if path.is_file() and path.suffix.lower() == ".txt"
        and CHAPTER_NUMBER.fullmatch(path.stem)
    }
    chapters = discover_chapters()
    return {number: chapters[number] for number in sorted(chapters.keys() - existing)}


class ChapterParser(HTMLParser):
    """Collect authored sections from current and legacy Narou markup."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.sections: dict[str, list[str]] = {}
        self._depth = 0
        self._section: str | None = None
        self._section_depth = 0
        self._skip_depth: int | None = None
        self._parts: list[str] = []
        self._paragraph: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in VOID_TAGS:
            self._depth += 1
        if self._skip_depth is not None:
            return
        if tag in SKIPPED_TAGS:
            self._skip_depth = self._depth
            return

        if self._section is None:
            attributes = dict(attrs)
            classes = set((attributes.get("class") or "").split())
            if classes & TITLE_CLASSES:
                section = "title"
            elif "p-novel__text--preface" in classes:
                section = "preface"
            elif "p-novel__text--afterword" in classes:
                section = "afterword"
            elif "p-novel__text" in classes:
                section = "body"
            else:
                section = SECTION_IDS.get(attributes.get("id"))
            if section is not None:
                self._section = section
                self._section_depth = self._depth
                self._parts = []
            return

        if tag == "p":
            self._paragraph = []
        elif tag == "br":
            self._append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_TAGS:
            return
        if self._skip_depth is not None:
            if self._depth == self._skip_depth:
                self._skip_depth = None
        elif self._section is not None:
            if tag == "p" and self._paragraph is not None:
                paragraph = "".join(self._paragraph)
                # Narou represents a single empty source line as <p><br></p>.
                self._parts.append(("" if paragraph == "\n" else paragraph) + "\n")
                self._paragraph = None
            if self._depth == self._section_depth:
                text = "".join(self._parts).strip("\r\n")
                self.sections.setdefault(self._section, []).append(text)
                self._section = None
        self._depth -= 1

    def handle_data(self, data: str) -> None:
        if self._section is None or self._skip_depth is not None:
            return
        # Ignore HTML layout whitespace between paragraphs, keeping source indents.
        if self._paragraph is not None or data.strip(" \t\r\n"):
            self._append(data)

    def _append(self, text: str) -> None:
        target = self._paragraph if self._paragraph is not None else self._parts
        target.append(text)


def extract_chapter_text(html: str) -> str:
    """Return the title, preface, narrative, and afterword in source order."""
    parser = ChapterParser()
    parser.feed(html)
    parser.close()
    for required in ("title", "body"):
        if not any(text.strip() for text in parser.sections.get(required, [])):
            raise ValueError(
                f"could not find a nonempty chapter {required}; "
                "check the episode URL or whether Narou's markup has changed"
            )

    title = " ".join(text.strip() for text in parser.sections["title"])
    sections = [title]
    for section in ("preface", "body", "afterword"):
        sections.extend(text for text in parser.sections.get(section, []) if text.strip())
    return "\n\n".join(sections) + "\n"


def fetch_with_windows_tls(request: Request) -> str:
    """Use Windows' native certificate-chain validation via its bundled curl."""
    curl = Path(os.environ.get("SystemRoot", r"C:\Windows")) / "System32" / "curl.exe"
    if not curl.is_file():
        raise OSError(
            "Python certificate verification failed and Windows curl.exe is unavailable"
        )
    command = [
        str(curl), "--disable", "--fail", "--silent", "--show-error",
        "--location", "--max-redirs", "5", "--proto", "=https",
        "--proto-redir", "=https", "--max-time", "30",
        "--write-out", "\n%{content_type}",
    ]
    for name, value in request.header_items():
        command.extend(["--header", f"{name}: {value}"])
    command.extend(["--url", request.full_url])
    try:
        response = subprocess.run(
            command, capture_output=True, timeout=35,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
    except subprocess.TimeoutExpired as error:
        raise OSError(f"Windows HTTPS request timed out: {request.full_url}") from error
    if response.returncode:
        detail = response.stderr.decode("utf-8", errors="replace").strip()
        raise OSError(f"Windows HTTPS request failed: {detail or response.returncode}")

    # curl appends the final response's content type without mixing headers into HTML.
    body, separator, content_type = response.stdout.rpartition(b"\n")
    if not separator:
        raise ValueError("Windows HTTPS response is missing its content type separator")
    headers = Message()
    headers["Content-Type"] = content_type.decode("ascii", errors="replace")
    return body.decode(headers.get_content_charset() or "utf-8")


def fetch_chapter_html(url: str) -> str:
    """Fetch a public Narou page, respecting its declared text encoding."""
    address = urlsplit(url)
    if address.scheme not in ("http", "https") or address.hostname != "ncode.syosetu.com":
        raise ValueError("expected a URL on https://ncode.syosetu.com/")

    # Narou may reject urllib's default Python User-Agent with HTTP 403.
    request = Request(url, headers={
        "User-Agent": "Mozilla/5.0 (compatible; NarouChapterExtractor/1.0)",
        "Accept": "text/html",
        "Accept-Language": "ja,en;q=0.8",
    })
    try:
        with urlopen(request, timeout=30) as response:
            encoding = response.headers.get_content_charset() or "utf-8"
            return response.read().decode(encoding)
    except URLError as error:
        if sys.platform != "win32" or not isinstance(error.reason, ssl.SSLCertVerificationError):
            raise
        return fetch_with_windows_tls(request)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Find Re:Zero episodes missing from chapters/ and extract their Japanese "
            "source text to a new temporary directory. Print its path on success."
        )
    )
    parser.add_argument(
        "--chapters-dir", type=Path, default=CHAPTERS_DIRECTORY,
        help="Directory of existing translations (default: chapters/ beside this script).",
    )
    arguments = parser.parse_args()

    try:
        missing = find_missing_chapters(arguments.chapters_dir)
        if not missing:
            print("No missing chapters found.", file=sys.stderr)
            return 0

        output_directory = Path(tempfile.mkdtemp(prefix="rezero-chapters-"))
        print(f"Temporary directory: {output_directory}", file=sys.stderr, flush=True)
        for index, (number, url) in enumerate(missing.items(), start=1):
            print(
                f"Extracting episode {number} ({index}/{len(missing)})...",
                file=sys.stderr, flush=True,
            )
            text = extract_chapter_text(fetch_chapter_html(url))
            (output_directory / f"{number}.txt").write_text(
                text, encoding="utf-8", newline="\n"
            )
        print(f"Extracted {len(missing)} missing chapter(s).", file=sys.stderr)
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
        print(output_directory)
    except (OSError, ValueError, LookupError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
