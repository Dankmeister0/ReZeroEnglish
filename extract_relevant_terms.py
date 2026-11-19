#!/usr/bin/env python3
"""Extract the glossary entries that occur in Japanese chapter text.

The default output is headerless TSV for concise chapter-specific terminology
context without spending tokens on unrelated terms.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class GlossaryEntry:
    japanese: str
    english: str


def load_glossary(path: Path) -> list[GlossaryEntry]:
    """Read a two-column Japanese-to-English TSV, preserving its row order."""
    entries: list[GlossaryEntry] = []
    seen: set[tuple[str, str]] = set()

    try:
        with path.open("r", encoding="utf-8-sig", newline="") as glossary_file:
            reader = csv.reader(glossary_file, delimiter="\t")
            for line_number, row in enumerate(reader, start=1):
                if not row or not any(cell.strip() for cell in row):
                    continue
                if row[0].lstrip().startswith("#"):
                    continue
                if len(row) < 2:
                    raise ValueError(f"line {line_number} has no English translation")

                japanese = row[0].strip()
                english = "\t".join(row[1:]).strip()
                if not japanese or not english:
                    raise ValueError(f"line {line_number} has an empty Japanese or English term")

                entry = GlossaryEntry(japanese, english)
                if (entry.japanese, entry.english) not in seen:
                    entries.append(entry)
                    seen.add((entry.japanese, entry.english))
    except OSError as error:
        raise ValueError(f"could not read glossary '{path}': {error.strerror or error}") from error

    if not entries:
        raise ValueError(f"glossary '{path}' contains no entries")
    return entries


def extract_relevant_entries(text: str, glossary: list[GlossaryEntry]) -> list[GlossaryEntry]:
    """Return glossary entries found in text, ordered by their first appearance.

    At a given position, the longest matching Japanese term wins. This avoids
    including a shorter entry solely because it is contained in a larger one
    (for example, a name nested inside a longer place or character name).
    The same glossary pair is emitted only once.
    """
    entries_by_first_character: dict[str, list[GlossaryEntry]] = defaultdict(list)
    for entry in glossary:
        entries_by_first_character[entry.japanese[0]].append(entry)

    for candidates in entries_by_first_character.values():
        candidates.sort(key=lambda entry: len(entry.japanese), reverse=True)

    matches: list[GlossaryEntry] = []
    emitted: set[tuple[str, str]] = set()
    position = 0
    while position < len(text):
        match = next(
            (
                entry
                for entry in entries_by_first_character.get(text[position], [])
                if text.startswith(entry.japanese, position)
            ),
            None,
        )
        if match is None:
            position += 1
            continue

        pair = (match.japanese, match.english)
        if pair not in emitted:
            matches.append(match)
            emitted.add(pair)
        position += len(match.japanese)

    return matches


def read_chapter_text(chapter_path: str | None, inline_text: str | None) -> str:
    if inline_text is not None:
        return inline_text
    if chapter_path in (None, "-"):
        return sys.stdin.read()

    try:
        return Path(chapter_path).read_text(encoding="utf-8-sig")
    except OSError as error:
        raise ValueError(f"could not read chapter text '{chapter_path}': {error.strerror or error}") from error


def write_entries(entries: list[GlossaryEntry], output_format: str) -> None:
    if output_format == "json":
        print(
            json.dumps(
                [{"jp": entry.japanese, "en": entry.english} for entry in entries],
                ensure_ascii=False,
                indent=2,
            )
        )
        return

    writer = csv.writer(sys.stdout, delimiter="\t", lineterminator="\n")
    writer.writerows((entry.japanese, entry.english) for entry in entries)


def configure_utf8_output() -> None:
    """Keep Japanese output valid on Windows terminals using a legacy code page."""
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract glossary.tsv entries that occur in Japanese chapter text."
    )
    parser.add_argument(
        "chapter",
        nargs="?",
        help="UTF-8 Japanese chapter file. Use '-' or omit it to read standard input.",
    )
    parser.add_argument(
        "--text",
        help="Japanese chapter text supplied directly instead of through a file or standard input.",
    )
    parser.add_argument(
        "--glossary",
        type=Path,
        default=Path(__file__).with_name("glossary.tsv"),
        help="Path to the Japanese-to-English glossary TSV (default: glossary.tsv next to this script).",
    )
    parser.add_argument(
        "--format",
        choices=("tsv", "json"),
        default="tsv",
        help="Output format (default: tsv).",
    )
    arguments = parser.parse_args()
    if arguments.text is not None and arguments.chapter is not None:
        parser.error("use either a chapter file/standard input or --text, not both")
    return arguments


def main() -> int:
    configure_utf8_output()
    arguments = parse_arguments()
    try:
        glossary = load_glossary(arguments.glossary)
        chapter_text = read_chapter_text(arguments.chapter, arguments.text)
    except ValueError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2

    write_entries(extract_relevant_entries(chapter_text, glossary), arguments.format)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
