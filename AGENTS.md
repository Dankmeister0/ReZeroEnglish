# Repository Guidelines

## Project Structure & Module Organization

This is a dependency-free static reader. `index.html` provides the page structure, `styles.css` the responsive reader and navigation styling, and `app.js` holds chapter metadata, navigation order, local-progress behavior, and UI logic. Source translations live in `chapters/`; preserve their numeric or decimal filenames because the reader uses them as identifiers. `glossary.tsv` is the UTF-8 Japanese-to-English terminology source, and `extract_relevant_terms.py` filters the glossary for a Japanese source chapter. The Re:Zero translation instructions live in `.agents/skills/rezero-web-novel-translation/SKILL.md`.

## Build, Test, and Development Commands

No build step or package manager is required.

- `py -m http.server 8000` — serve the repository locally; open `http://localhost:8000` rather than opening `index.html` directly.
- `node --check app.js` — validate JavaScript syntax after reader changes.
- `py -m py_compile extract_relevant_terms.py` — validate the glossary tool.
- `py .\extract_relevant_terms.py .\chapter-ja.txt` — emit relevant glossary rows as TSV. Use `--format json` for structured output.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, and JavaScript; use four spaces in Python. Keep browser code dependency-free and compatible with direct static hosting. Use `camelCase` for JavaScript functions and variables, `kebab-case` for CSS classes, and descriptive `UPPER_SNAKE_CASE` constants for chapter/collection metadata. Keep text files UTF-8. Do not rename or reformat the chapter corpus wholesale.

## Testing Guidelines

There is no automated test framework yet. Exercise changed reader behavior through the local server at desktop and narrow viewport sizes. For navigation changes, verify each special collection boundary with both Previous/Next buttons and arrow keys. For glossary changes, test a known exact match and an overlapping term; longer matches must suppress nested shorter terms.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so no established message convention can be inferred. Use short, imperative commits such as `Add Arc 3 IF navigation group`. Pull requests should describe user-visible behavior, list validation commands run, link related issues when available, and include screenshots for reader UI changes.

## Translation Data Care

Add glossary entries as one Japanese term and one English rendering separated by a tab. Before translating a new Japanese chapter, filter the glossary with `extract_relevant_terms.py` and provide that subset to the prompt to keep translation context focused.
