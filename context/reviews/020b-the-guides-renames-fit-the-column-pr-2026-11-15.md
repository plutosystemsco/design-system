# Review of 020b — The guide's renames fit the column (the built change)

Reviews [`specifications/020b-the-guides-renames-fit-the-column.md`](../specifications/020b-the-guides-renames-fit-the-column.md), as the builder wrote its Landing notes on its branch. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-15
- **Status:** reviewed. Land. No finding blocks the merge. Findings 1 and 2 are small write-ins, best made before the merge. Finding 3 is a wording nit. Findings 4 and 5 are notes.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** commit `fc15211` on `worktree-agent-aacc10a87cae31325`, over `082f65c` (release/0.13.0). Its worktree is `.claude/worktrees/agent-aacc10a87cae31325`. The diff is 3 files: the guide (`src/routes/(site)/changelog/0.13.0/upgrade/+page.svelte`), `tests/e2e/upgrade.spec.ts`, and the specification.
- **Re-ran:** Bun, 2026-11-15, with the machine's load average between 86 and 125. Nothing was written but this file. The worktree's `git status` was clean after every run. Scratch work is in the session scratchpad, `review-020b/`.
  - **The build.** `bun run build` in the worktree → exit 0, 103 twins. The guide's HTML is 96,151 B, the builder's figure. Its twin is **byte-identical** to the builder's `twin-before.md` (`cmp`).
  - **e2e,** through a scratch Playwright config that serves the worktree's `build/` with `vite preview` on **5741** (5199 untouched), light and dark projects:
    - `upgrade.spec.ts` and `build-output.spec.ts` → **55 passed** (58 s): `upgrade.spec.ts` 14 light and 14 dark (020's 10 cases, 020b's 3 widths and its twin case, in both), and `build-output.spec.ts` 27, light only by the config.
    - `axe.spec.ts`, filtered to the guide → **6 passed** (360, 768 and 1280, light and dark).
  - `bun run check` → 2,190 files, **0 errors, 0 warnings**.
  - `prettier --check` on the 3 changed files → clean.
  - **Not run by me:** the unit suite, smoke and perf. Their figures are the builder's. This change touches no unit-tested code and no budget page.
  - **Benchmark:** `bun scripts/bench/kuiper.ts --rev fc15211` and `--rev 082f65c`, against the worktree's build. Every count is equal. Only the timestamps and `rev` differ. **No scorecard row moves.** The twin, which the bench reads, is unchanged, and row 11 (change communication) scores the guide's existence, not its layout.

## The check against evidence

1. **Nothing in the column scrolls sideways; the page has no horizontal scroll** — met, as the builder narrowed it (ruling 2, accepted below). EXECUTED: passes at 1440, 390 and 320, light and dark.
2. **Every rename's names and its two texts read in the column** — met. EXECUTED: passes at all six. A probe found all 38 names on the `<dt>` lines as one box each at every width: no name is broken.
3. **020's test 17 unchanged and green** — met. EXECUTED, in both projects.
4. **Seen failing first** — met, and the check has teeth. EXECUTED, a mutation: a scratch copy of the 020b cases, with a route that serves the guide with the table un-hidden and the list hidden (the base's layout). It fails at every width. The table's scroller is named (2,407 > 608, > 358, > 288; wider than the base's 1,053, since the copy dropped the cells' `whitespace-normal`), and **38, 47 and 52 parts are unread** at 1440, 390 and 320. Those are the builder's failing-first counts exactly.
5. **axe, the twin test and the perf budget stay green** — axe and the twin test met (EXECUTED). Perf: the builder's figures; the guide has no budget.

### The page, read at 320 in dark

I read the builder's after-shots at 320, 390 and 1440, both schemes, and the last renames at 320 dark. The list reads well:

- Each rename is one block, separated by 32 px, with 8 px inside it. The grouping is clear without rules.
- The names are code. The kind and its end are muted. The two lead-ins are bold. The eye finds old → new, then who, then what.
- At 320 the long site paths (`/components/pluto-theme/` → `/components/kuiper-theme/`) move whole to the next line. None breaks mid-name.
- Before, at 1440, "Who sees it" was cut mid-word at the column's edge and two columns were off-screen. Now nothing is hidden.

## The builder's rulings

1. **The hidden copy of the table** — accepted, with finding 1's write-in.
   - **Why it is needed.** The twin is read from the built page's `<main>` (`scripts/site/markdown.ts` → `src/lib/site/markdown.ts`). The converter writes a `<dl>` as `**term**: text` lines, and its `inline()` runs the `<dd>`'s two paragraphs together. So the `<dl>` alone could not keep the table the spec asks for.
   - **Semantics.** `hidden` is right. EXECUTED: the copy computes `display: none`, so it is not drawn, not in the accessibility tree, not in find-in-page, and has no tab stop (`Table.Root` without `label` sets no `tabindex`; 0 focusable nodes inside). The converter does not treat `hidden` as a skip, so it reads the copy.
   - **Drift.** Both copies loop over the same `section.renames`, with the same key and the same `text` snippet, in one component. Their membership and order cannot differ. Only the last column differs, by design: `until()` writes "0.14.0", "Redirects, always" or "Now"; `line()` writes "works until 0.14.0", "redirects, always" or "removed in 0.13.0". Both read the same two fields. The new twin case guards the other side: if a later `markdown.ts` began skipping `hidden`, the twin would lose its table and the case would fail.
   - **Precedent.** The repository has no twin-only DOM. Every `data-md="skip"` is page-only content (theme switches, the rail, the swatches' and API table's phone labels). The one twin-only mechanism is **`data-md-label`** (015 decision 7): an attribute on a code block, which `markdown.ts` writes out as a line only the twin has. And 015 says "a twin is the page by construction". The copy bends that: the twin is now read from an element the page never shows. Its content still cannot disagree with the page, so this is a bend, not a break.
   - **The alternatives, weighed.**
     - **`markdown.ts` renders a `<dl data-md="table">` as a table.** It is possible, and `data-md-label` is precedent for the converter reading a twin attribute. But the `<dl>`'s parts do not map to columns: the `<dt>` holds two names plus "kind, works until …", and each `<dd>` paragraph starts with a lead-in. The page would need cell markers and skipped lead-ins, and the converter a new mode with its own fixtures (015 criterion 19). That is a converter feature, not a small change on one page. It is worth building only if a second page needs a twin form unlike its page.
     - **One `<table>`, styled as blocks.** `api-table.svelte` stacks its rows on a phone with grid classes, and its "Default" label is `md:hidden data-md="skip"`. This keeps one copy. But the spec names a `<dl>`, the table semantics then rest on display changes across three engines (§4.4), and the lead-ins and line endings would need several skipped spans. It is not cleaner here.
     - **Let the twin read the `<dl>`.** It drops the spec's "the twin keeps its table", which needs the design lead's ruling, and the converter's output for a `<dd>` with two paragraphs is poor.
   - So the builder's copy is the smallest mechanism that meets the spec. Finding 1 halves its weight.
2. **The narrowed assertion 1** — accepted.
   - EXECUTED, a literal probe at 1440: the only elements whose `scrollWidth` passes `clientWidth + 1` are step 2's `<li>` and `<p>`, 532 > 528. The `-o` in `ls … -o` breaks after its hyphen, and its first piece ends 4 px past the paragraph's right edge, inside the 608 px column. The builder's literal run on the base shows the same two rows beside the table. So the literal reading fails on a pre-existing theme effect that nobody can see and that this spec did not touch.
   - The narrowed check keeps both of the spec's aims. A scroller holds no more than its width, and everything else stays inside the column. EXECUTED: it still names the table (item 4 above).
   - Recording it as a ruling in the Landing notes is the right place (AGENTS.md).
3. **`inline-block max-w-full` names, with `wrap-anywhere`** — accepted.
   - EXECUTED, a counterfactual at 320, with the two classes removed from the names: `kuiper-design-system` breaks into 2 pieces and its first overhangs the column by **4 px**. `kuiper-mark-dock` and `kuiper-mark-fade` break too, inside the column. With the classes, every name is one box at 1440, 390 and 320.
   - `wrap-anywhere` is the site's own utility for code (`/start/install/`, `/start/theme/`, the home page's list, the API table's type cell). With `max-w-full`, it breaks a name only when the name is wider than the column, and no name is today.
4. **020's test 2 now reads `dl dt code`** — accepted. With the old selector, `allTextContents()` reads the hidden copy too. So test 2 would pass even if the visible list lost a name. The new selector reads what the reader sees.
5. **"redirects, always" for the two site pages** — accepted in substance. "removed in 0.13.0" would be false: the old addresses redirect. The wording is finding 3.

## Findings, most severe first

1. **Low. The hidden copy carries 15.5 kB of class strings nobody sees.** (`+page.svelte:127–150`)
   - **The defect.** The copy uses the `Table` component. Each `Table.Row` and `Table.Cell` still renders its own `data-slot` and its default classes (a row's class string alone is about 230 characters). The builder removed the per-cell classes the page added, not these.
   - **EXECUTED.** The hidden `<div>` is **27,870 B** of the page's 96,151 B: twice the visible `<dl>` (13,558 B). Class and `data-slot` attributes are 15,524 B of it. The page is 12,537 B gzipped (Node's default level).
   - **Fix.** Write the copy as a plain `<table>` with `<thead>`, `<tbody>`, `<tr>`, `<th scope="col">` and `<td>`, as `api-table.svelte` does. Then drop the `Table` import, which nothing else on the page uses. EXECUTED, simulated: with the class and `data-slot` attributes stripped from the copy, `htmlToMarkdown` gives a **byte-identical twin**, the copy falls to **12,346 B**, and the page to **11,613 B gzipped (−924 B)**. The twin case re-checks it. No test needs to change.
2. **Low. At 1440 the `<dt>` line runs past the paragraphs' measure.** (`+page.svelte:115`)
   - **The defect.** `site.css` gives `p`, `dd` and `li` the 33 rem measure (018 decision 9). A `<dt>` keeps the whole column. EXECUTED: at 1440 the `<dd>` paragraphs are 528 px wide, and the `<dt>` is 608. Its text reaches 607 px, 79 px past the paragraphs below it. It shows in `after-*-1440-view.png`: "context key, across items, works until 0.14.0" ends to the right of every paragraph's edge, so each block has a ragged right edge.
   - **Fix.** `max-w-(--site-measure)` on the `<dt>`, the existing utility `api-table.svelte` uses. The line then wraps with its paragraphs. At 390 and 320 the column is narrower than the measure, so nothing changes there. The 020b test still applies unchanged.
3. **Nit. "site page, redirects, always" reads as three clauses.** Other lines read "theme item, works until 0.14.0": a kind, then a verb phrase. The table's "Redirects, always" was a cell value. In a line, **"site page, always redirects"** reads as the others do. It is one string in `line()`. Optional.
4. **Note. The arrow is read aloud.** The accessibility tree of a `<dt>` is code, "→", code, text. VoiceOver says "right arrow". The table's "Old name" and "New name" headers are gone, and the arrow is a common and clear stand-in. No change is needed.
5. **Note, for the roadmap (the builder's finding, confirmed).** Inline code broken at a hyphen overhangs its line box by about 4 px in Chromium. The theme's `box-decoration-clone` pads every piece, and line breaking does not count that padding. EXECUTED: step 2's `-o` at 1440 is 4 px past its paragraph. It is the theme's matter (`src/app.css` is generated), not this page's.

## Deviations

1. **The hidden table** — accepted (ruling 1, finding 1).
2. **Assertion 1, narrowed** — accepted (ruling 2).
3. **A fourth 020b case, the twin** — accepted. The spec asked that the twin test stay green. This case pins the table's header, every row's names, and the absence of the list's "Who sees it." lead-in.
4. **020 test 2's selector** — accepted (ruling 4). The spec says 020's tests stay unchanged. This one had to change, or it would read the hidden copy and test nothing.

## Constitution checks

- **§4.1 Source, not a package:** holds. Nothing an app installs changed. The diff touches no file under `src/lib/registry/`, `static/` or `tokens/`.
- **§4.3 Tokens are the one source:** holds. No colour or size was added. The new classes (`gap-8`, `gap-2`, `mt-2`, `inline-block`, `max-w-full`, `wrap-anywhere`, `text-muted-foreground`) are existing utilities.
- **§4.4 Accessibility:** axe passes on the guide at three widths in both schemes. The `<dl>` groups each `<dt>` and `<dd>` in a `<div>`, which HTML allows.
- **§4.5 and §4.6, pinned and named dependencies:** hold. `package.json` and `bun.lock` are unchanged.
- **§5, a small change:** holds. One page, its test file and its specification. No interface or data change: `renames.ts` and `0.13.0.ts` are untouched. The check was seen failing first, and I reproduced the counts by mutation.
- **§5, the scorecard:** run, above. No row moves.
- **§6, never commit without the owner:** the commit is on the build branch, as briefed. Nothing is merged or pushed.

## Verdict

**Land.** The change does what the spec asks:

- The renames read in the column at every width, in both schemes.
- No name breaks mid-word at 320.
- The twin is byte-identical.
- The check fails on the old layout with the builder's own counts.
- All five rulings are sound.

Findings 1 and 2 are write-ins of a few lines each, best made before the merge. Finding 1 halves the hidden copy's weight, and the twin case re-checks it. Finding 2 aligns the `<dt>` with its paragraphs. Neither needs a new test. Finding 3 is optional wording. Finding 5 goes to the roadmap as a theme matter.
