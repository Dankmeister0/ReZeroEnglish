# re:read zero

A lightweight static reader for the translated Re:ZERO web novel in `chapters/`.

## Run it locally

Browsers block chapter loading when an HTML file is opened directly from disk. Start any static web server from this directory instead:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

The reader uses your browser's local storage to remember the current chapter, reading position, theme, and text size. No account or backend is required.

## Fetch missing Japanese source chapters

Run the dependency-free extractor without a URL. It compares every page of the official Re:Zero index with the regular numeric `.txt` files in `chapters/`, ignoring decimal side-story filenames:

```powershell
$sourceDir = py .\extract_narou_chapter.py
if ($LASTEXITCODE -ne 0) { throw "Narou chapter extraction failed" }
```

Missing episodes are downloaded in numeric order to a new system temporary directory as `N.txt`. The directory path is printed to standard output, with progress on standard error. If nothing is missing, no directory is created and no path is printed. Use `--chapters-dir PATH` to check a different translation directory; the default is `chapters/` beside the script, regardless of the working directory.

The extractor preserves paragraph lines and scene breaks, includes any authored preface and afterword, and removes site controls and ruby pronunciation annotations. Fetch or parsing failures return a nonzero exit status; any chapters already extracted remain in the temporary directory shown in the progress output. Temporary files remain available until you remove them after use.

On Windows, if Python cannot verify a server certificate, the extractor retries using Windows' bundled `curl.exe` and native certificate validation. Certificate and hostname verification remain enabled. No additional Python packages are required.

## Extract relevant translation terms

Use the included script to reduce `glossary.tsv` to only the Japanese terms used by one source chapter. The default output is compact, headerless TSV for use as terminology context with the Re:Zero translation skill.

```powershell
# Replace N with a missing episode number saved in $sourceDir.
$sourceFile = Join-Path $sourceDir "N.txt"
py .\extract_relevant_terms.py $sourceFile
```

It also accepts piped text (`Get-Content -Encoding UTF8 $sourceFile -Raw | py .\extract_relevant_terms.py -`) or direct text with `--text`. Add `--format json` when structured output is more useful.
