---
name: rezero-web-novel-translation
description: Add missing official Re:Zero web-novel chapter translations to this reader by extracting source text, filtering its glossary, writing numbered chapter files, and registering them in the reader.
---

# Re:Zero Web Novel Translation

Use this skill from the root of the ReZeroReader repository when the task is to add translations of newly published main-series episodes.

## Extract missing source chapters

Start by running the repository's `extract_narou_chapter.py` once without a URL. The script handles source discovery, comparison with `chapters/`, and extraction automatically, including ignoring decimal side-story identifiers. It saves every missing source episode as `N.txt` in a new system temporary directory, prints progress on standard error, and prints the directory path on standard output. Use the files in that directory as the source chapters to translate.

```powershell
$sourceDir = py .\extract_narou_chapter.py
if ($LASTEXITCODE -ne 0) { throw "Narou chapter extraction failed" }
```

If the command succeeds without printing a directory path, report that no chapters are missing and stop. Otherwise, process the extracted numeric `.txt` files in ascending episode-number order, unless the user specified a narrower range. Each source filename `N.txt` corresponds to the destination `chapters/N.txt`; never overwrite an existing translation.

## Prepare each source chapter

For each missing number `N`, filter the glossary against that exact source file. Replace `N` with the episode number; if the user requested a narrower translation range, use only the requested files from the extracted batch:

```powershell
$sourceFile = Join-Path $sourceDir "N.txt"
py .\extract_relevant_terms.py $sourceFile
Get-Content -Encoding UTF8 -Raw $sourceFile
```

The extractor includes the Japanese title, authored preface and afterword when present, and narrative text. It preserves paragraph lines, blank lines, indentation, and scene breaks, keeps ruby base text without pronunciation annotations, and excludes site navigation, metadata, buttons, recommendations, and comments. It writes UTF-8 files directly so PowerShell redirection cannot change their encoding. If fetching or parsing fails, resolve that error before filtering or translating; do not use an empty or stale source file.

Keep the TSV output in context as the chapter-specific terminology reference. Apply the translation instructions below directly to the extracted Japanese text; do not interpolate the glossary into a separate prompt or emit it in the translation.

## Translate the chapter

Translate from Japanese to English as a Re:Zero literary translator. Convey the source's meaning, tone, and nuance in natural, idiomatic English. Prioritize accuracy over smoothness when they conflict, without becoming stilted or overly literal.

### Register and tone

The web novel's narration and dialogue are conversational, often first-person, and vary in formality by character. Match each character's register rather than flattening everyone into the same voice. Preserve Tappei's wordplay, puns, and self-aware or comedic narration. If a pun cannot be preserved, adapt it rather than dropping the joke, and flag the substitution in a translator's note.

### Honorifics

Preserve Japanese honorific suffixes attached to names in romanized form, such as `-san`, `-sama`, `-kun`, `-chan`, `-dono`, and `-tan`. Do not replace them with English equivalents.

### Character speech quirks

Preserve character's speech patterns whenever they speak. The following are examples of known speech patterns. The list is not exhaustive - apply the same principle to other recurring characters with a recognizable verbal tic.

- Beatrice: archaic, imperious speech; render her sentence-ending `このよ` consistently as “...I suppose.”
- Puck: casual and affectionate; calls Emilia “Lia.”
- Rem: refers to herself in third person (“Rem”); polite, formal, and warm.
- Ram: refers to herself in third person (“Ram”); blunt, dry, and faintly condescending.
- Roswaal: elongated vowels as a speech affectation, such as “the-e-en” and “wha-a-at.”
- Julius: highly formal, courteous diction even under stress.
- Echidna: arch, mocking, philosophical, and verbose.
- Petra: young and earnest, with village-dialect influence that is not exaggerated.

### Terminology

Use the filtered glossary entries from extract_relevant_terms.py. It supplies the standard romanization or translation for terms it contains. For a proper noun, title, or term absent from that glossary, use best judgment and standard Re:Zero conventions, including Hepburn romanization and established wiki conventions when known. Flag a genuinely uncertain rendering in a translator's note so it can be checked later.

### Formatting and title

- Preserve source paragraph breaks and line breaks.
- Render dialogue markers `「」` as English double quotation marks and nested dialogue markers `『』` as single quotation marks.
- Render internal monologue or thought marked distinctly in the source as Markdown italics, for example `*like this*`.
- Preserve emphasis such as bouten or bold with appropriate Markdown bold or italics.
- Make the translated title the first line, with no extra Markdown. Match the source using one of these forms: `Arc # Chapter #: "Title"`, `Arc # Prelude/Interlude/etc: "Title"`, `Re:Zero EX: "Title"`, or `Side Story: "Title"`. Translate `第X章Y` as `Arc X Chapter Y`.

### Translation output

Output only the English translation. If there is a genuine uncertainty, such as ambiguous wordplay, a guessed term, or ambiguous pronoun or referent resolution, append a concise block after the translation:

```text
<notes>
- Brief, specific note
</notes>
```

Omit the `<notes>` block when nothing needs flagging. Do not include other commentary, meta-discussion, restated instructions, or routine translation notes.

## Write and register the translation

Save only the resulting translation to `chapters/N.txt` as UTF-8 text, without a BOM. The file must begin on its first line with the translated title required above, with no code fence or translator commentary before it. Preserve meaningful paragraph breaks, include a `<notes>` block only when the criteria above are genuinely met, and do not add a routine process summary to the chapter.

After adding the new regular source chapters, update `app.js` so every new `N` is included in the reader catalog and can be opened from the library, query-string navigation, Previous/Next controls, and arrow keys. The catalog currently derives regular chapter IDs from a numeric upper bound in `chapterIds` and maps them to the arc ranges in `arcs`.

- Extend that numeric range through the highest newly added regular episode. Do not add decimal local side-story IDs merely because they exist in `chapters/`.
- Put each new episode in the correct arc. Usually this means extending the final active arc's `end`; if the source title establishes a new arc, add a distinct arc entry with its translated name and the appropriate start/end boundaries instead.
- Preserve existing `EXTRA_CHAPTERS_AFTER`, special-story metadata, special collections, and their ordering. Do not convert a regular main-series episode into a special story.
- Do not expose a numbered chapter that has no corresponding translation file. The current numeric upper-bound form is appropriate only when the new translations fill every regular-ID gap through the newest episode. If a deliberately narrowed request leaves an intervening gap, adapt the regular-ID catalog to list the translated IDs rather than rendering broken chapter links.

Run `node --check app.js` after the catalog update. Verify that each new chapter ID is within an arc range and that its file name exactly matches the ID fetched by the reader. For navigation changes, serve the site locally and check the new range boundary in both directions using the Previous/Next buttons and arrow keys.

Before finishing, verify that:

- `chapters/N.txt` is new rather than an overwritten existing translation.
- The first line is a title and the file is not empty or mostly Japanese source text.
- Source paragraphs and scene boundaries are represented in the English output.
- Glossary filtering was run against the extracted Japanese text for each translated episode.
- Each new translation is exposed in the library and reader navigation through the `app.js` catalog update.

Remove temporary source files when they are no longer needed. Do not change existing chapter translations or unrelated reader behavior.
