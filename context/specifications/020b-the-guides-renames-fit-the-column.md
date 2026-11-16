# 020b — The guide's renames fit the column

- **Status:** Built on its branch; the change review's fixes applied (`reviews/020b-the-guides-renames-fit-the-column-pr-2026-11-15.md`); awaiting the merge.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, on one page). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `020`'s checkpoint (criterion 24), by the design lead, 2026-11-15. It is recorded in `020`'s Landing notes when this lands.

## The defect

The upgrade guide at `/changelog/0.13.0/upgrade/` shows its renames as a five-column table: old name, new name, who sees it, what to do, and the release the old name works until. Two of those columns hold whole sentences. Measured on `44cec73` against the live tree:

| Width | Table | Column | Overflow |
|---|---|---|---|
| 1440 | 1,053 px | 608 px | 445 px, scrolled sideways |
| 390 | 1,053 px | 358 px | 695 px, scrolled sideways |

At 1440 the "Who sees it" text is cut mid-word at the column's edge, and "What to do" and "works until" are off-screen. That page exists to be read in order, step by step, and its most important column is the one a reader can't see.

## The fix

Each rename becomes one block, in the same order, inside the text column (`src/routes/(site)/changelog/0.13.0/upgrade/+page.svelte`, the `{#each section.renames}` loop):

- **Its line:** `old` → `new`, both in code, then the kind and "works until 0.14.0" (or "removed in 0.13.0"), all on one line that wraps.
- **Who sees it:** the existing `seenBy` text, as a paragraph.
- **What to do:** the existing `todo` text, as a paragraph.

The blocks form a description list (`<dl>`, one `<div>` per rename, with `<dt>` for the line and `<dd>` for the two paragraphs) under the existing heading. Rows are separated by the page's own spacing, not by rules. No data changes: `renames.ts` and `0.13.0.ts` are untouched, and the Markdown twin keeps its table, since Markdown readers scroll freely.

No item changes, and no token or class is added beyond the page's existing utilities.

## The check

An e2e test in `tests/e2e/upgrade.spec.ts`, "the guide fits its column":

1. At 1440, 390 and 320, in light and dark, every element in the guide's main column has `scrollWidth <= clientWidth + 1`, and the page has no horizontal scroll.
2. Every rename's old and new names, its "who sees it" text and its "what to do" text are visible without scrolling sideways. Each is read through `checkVisibility()` and its bounding box lies within the column.
3. `020`'s test 17 (no `add` before step 1, in document order, page and twin) still passes unchanged.

**Seen failing first:** on `44cec73`, assertion 1 fails at all three widths, naming the table (1,053 px). The output goes in the Landing notes.

The axe scan of the page, its Markdown twin test and the perf budget must stay green.

## Landing notes

Built on its branch from `release/0.13.0` at `082f65c`. The guide, its data and the test file are the same there as at `44cec73`.

### Seen failing first

The test went in first, with the page unchanged. All 6 cases failed: 1440, 390 and 320, in light and dark. Assertion 1 named the table's scroller, 1,053 px wide, at every width:

```
Error: in the 608 px column
+   "div[data-slot=table-container] \"Old name New name Who sees it Wh…\": 1053 > 608",
Error: in the 358 px column
+   "div[data-slot=table-container] \"Old name New name Who sees it Wh…\": 1053 > 358",
Error: in the 288 px column
+   "div[data-slot=table-container] \"Old name New name Who sees it Wh…\": 1053 > 288",
```

Assertion 2 failed too, at every width. Of the 76 parts it reads (19 renames, four parts each), it found 38 unread at 1440, 47 at 390 and 52 at 320. At 1440 these were every "who sees it" and every "what to do". At 390 and 320 some new names were cut as well, such as `kuiper:field-set`. The page itself never scrolled sideways: the table's own container did.

### The fix

In `src/routes/(site)/changelog/0.13.0/upgrade/+page.svelte`, the `{#each section.renames}` loop is now a `<dl>` with one `<div>` per rename, in the same order:

- **`<dt>`:** `old` → `new`, both in code, then, muted, the kind and its end: "works until 0.14.0", "removed in 0.13.0", or, for the two site pages, "always redirects". All on one line that wraps at the paragraphs' measure.
- **`<dd>`:** two paragraphs, "**Who sees it.**" and "**What to do.**", each followed by the existing text. The lead-in is the page's own `<strong>` pattern ("What does not keep working.").
- **Spacing:** `gap-8` between renames and `gap-2` inside one. These are the page's utilities. There are no rules between blocks.

Nothing else on the page changed. `renames.ts` and `0.13.0.ts` are untouched.

### Rulings during the build

1. **The twin keeps its table through a hidden copy.** The twin is made from the built page's `<main>` (`scripts/site/markdown.ts`), so a `<dl>` alone would turn its table into `**term**: text` lines. To keep the table as the spec says, the old table stays on the page as `<table hidden>`, a plain table with no classes (after the review; see below). It is not drawn and not in the accessibility tree, and it renders from the same rows, so it cannot disagree with the list. The `<dl>` carries `data-md="skip"`. **The built twin is byte-identical** to the one before the change (`cmp`). A new case, "the Markdown twin keeps the table, and only the table", checks this. `markdown.ts` was not changed: that would touch every page.
2. **What assertion 1 reads.** Read literally ("every element has `scrollWidth <= clientWidth + 1`"), it also fails, at 1440 only, on step 2's paragraph: 532 > 528. The code span `-o` breaks after its hyphen. The theme's `box-decoration-clone` padding on the broken span's first piece then overhangs the 33 rem measure by 4 px. It stays inside the 608 px column, and nothing is cut or scrolled. So the test checks the two things the spec is after. First, an element that clips or scrolls holds no more than its own width. Second, every other element stays inside the column. A code block's inside is not counted, since it keeps its own focusable, named scroller (015 criterion 26). The literal run's output is kept with the screenshots (see below).
3. **The names on the `<dt>` line are `inline-block` and `max-w-full`, and the line has `wrap-anywhere`.** These are existing utilities, and `wrap-anywhere` is the site's precedent for code (`/start/install/`). As plain inline code, `kuiper-design-system` broke at its hyphen at 320 and overhung the column by 4 px. As a block, each name moves whole to the next line, and only a name longer than the column breaks.
4. **020 test 2 now reads the list.** Its selector changed from `[data-section="020"] table code` to `[data-section="020"] dl dt code`. Otherwise it would read the hidden copy and pass whatever the reader sees. 020's test 17 is unchanged and passes.
5. **The end of the line.** The spec gives "works until 0.14.0" or "removed in 0.13.0". The two site pages say "always redirects", after the table's "Redirects, always" (reworded by the review). Their old addresses are not removed.

### Checks

- **`upgrade.spec.ts`** (light and dark): 28 passed: 020's 10 cases, 020b's 3 widths and its twin case, each in both projects (20 + 6 + 2).
- **axe on the guide**, at every width the suite uses, light and dark: 6 passed.
- **`build-output.spec.ts`**, the twins' tests among them: 27 passed. Its config runs this spec in the light project only.
- **Perf** (`--project=perf --no-deps`): 5 passed. The guide has no budget of its own. Every budget page is as at `020a`: Button 373 kB of 382, home 300, components 348, code-block 347, Brand colour 295. The guide's HTML is 96,151 bytes (12,345 gzipped).
- **Unit:** 1,256 pass, 2 skip, 4 fail, of 1,262, with the machine's load average between 70 and 140. All four failures are timing tests on code this change does not touch:
  - two `thumbnails.test.ts` mutation cases, past bun's 5 s timeout. Run alone with `--timeout 60000`, that file passes 10 of 10.
  - the highlighter's streaming and first-pass budgets. These still fail alone under the same load, as in `020a`'s notes.
  - The stray-`pluto` test failed once, on scratch logs left in the tree. It passes once they are removed.
- **check:** 0 errors, 0 warnings, 2,190 files. **lint:** clean.

### Screenshots

Light and dark at 1440, 390 and 320, before (`before-*`) and after (`after-*`), each as a viewport shot at the section's start (`*-view.png`) and as the whole section (`*-section.png`). They are in the build's scratch folder, `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/020b/`, with `after-dark-320-last-renames.png`, the failing-first output (`failing-first.scratch.txt`, and the literal reading's run, `failing-first-literal.txt`), and the twin before the change (`twin-before.md`). They are not kept in the repository.

### The change review's fixes

The review (`reviews/020b-the-guides-renames-fit-the-column-pr-2026-11-15.md`) said land. Its two Low findings and its nit were made in a second commit on the branch.

1. **(Low) The hidden copy is a plain `<table>`** (finding 1). It was the `Table` item, whose rows and cells render their own `data-slot` and default classes. It is now `<table hidden>` with `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">` and `<td>`, as `api-table.svelte` writes one. The `Table` import is gone. **The twin is still byte-identical** to `twin-before.md` (`cmp`).

   | The guide's HTML | Bytes | gzip -6 | gzip -9 |
   | --- | ---: | ---: | ---: |
   | Before the fix (`fc15211`) | 96,151 | 12,482 | 12,341 |
   | After | 77,951 | 10,815 | 10,742 |
   | Change | −18,200 (−18.9%) | −1,667 | −1,599 |

   The hidden copy fell from 27,870 B (the review's figure) to 9,305 B. The `<dl>` is 13,981 B (13,558 B before), larger by finding 2's class on each `<dt>`.

2. **(Low) The `<dt>` keeps the measure** (finding 2). It has `max-w-(--site-measure)`, the existing utility. At 1440 the line now wraps with the paragraphs below it, at 528 px. At 390 and 320 the column is narrower than the measure, so nothing changes there. Seen in `fixed-{light,dark}-{1440,390,320}-view.png` in the scratch folder.
3. **(Nit) "always redirects"** (finding 3). The two site pages' line reads "site page, always redirects", like the other lines' kind and then a verb phrase. The twin's column keeps "Redirects, always", so the twin is unchanged.

After the fixes:

- `upgrade.spec.ts` and `build-output.spec.ts`, light and dark: **55 passed** (14 + 14 + 27).
- axe on the guide, light and dark: **6 passed**.
- `bun run check`: 0 errors, 0 warnings, 2,190 files.
- No test changed.

### Findings for later

- **Inline code broken at a hyphen overhangs its line by about 4 px** in Chromium. The theme's `box-decoration-clone` pads every piece, and line breaking does not count that padding. It shows on this page at 1440 (`-o` in step 2) and could show on any page. It is a theme matter (`src/app.css` is generated), not this page's.
- **For the design lead:** `020`'s Landing notes record this defect when it lands, as the spec's "Found by" line says.
