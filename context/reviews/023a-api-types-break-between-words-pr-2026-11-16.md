# Review of 023a — API types break between words (the built change)

Reviews [`specifications/023a-api-types-break-between-words.md`](../specifications/023a-api-types-break-between-words.md), a small change, with its Landing notes and both rounds of the design lead's rulings. This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. **Land after fixes.** Findings 1 and 2 are merge-time fixes to the test, and must be made when the branch lands on `release/0.13.0`. Finding 3 is a one-attribute fix, recommended before the merge. Finding 4 hardens the allow-list. Findings 5 to 7 are for the design lead, or write-ins.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** branch `worktree-agent-a83d4265fec0b981d` (worktree `.claude/worktrees/agent-a83d4265fec0b981d`): `1238f18`, `05076a2` and `d77e7d5` on `6caa796`. The net change is `git diff 6caa796 d77e7d5`: 3 files, +317 / −8 (`api-table.svelte`, the new `tests/e2e/api-table.spec.ts`, and the specification).
- **Re-ran:** Bun, 2026-11-16. The machine's load average went from 10 to 50 during the review. Nothing in the repository was written but this file. The worktree's `git status` was clean before and after. Scratch work is in the session scratchpad, `review-023a/`.
  - **Trees.** `treeA` is a `git clone --shared` of `d77e7d5`. `treeB` is that branch merged onto `a30ffa7`, and `treeE` is the same merge onto `ba8694d`, which `release/0.13.0` reached during this review. `treeC` is the base, `6caa796`. `treeD` holds the mutations and the suggested fix. Each was built with `bun run build` and served with `vite preview` on ports 5771 to 5776. 5199 was not used.
  - `bun run check`, **in the worktree** → 2,231 files, **0 errors, 0 warnings**.
  - `api-table.spec.ts`, `light` and `dark`, at `d77e7d5` → **24 passed**.
  - The same spec on the merge with `a30ffa7` → **2 failed, 22 passed**. On the merge with `ba8694d` → the same 2 failed (findings 1 and 2).
  - **axe** (`axe.spec.ts`, filtered to the pages) on Button group, Link, Progress, Button and Meter, plus Popover and Sidebar, at 360, 768 and 1280, `light` and `dark` → **42 passed**, 0 violations.
  - **Copy and selection**, a scratch spec in Chromium, Firefox and WebKit, at 1440 and 390, on ten pages (Popover, Sidebar, Chart, Highlighter, Accordion, Button group, Link, Progress, Field and Code editor) → **90 passed**. See item 1.
  - **Accessible names:** Chromium's computed name of every Type cell (1,086 on 78 pages), read through CDP, base against change. See finding 3.
  - **The Markdown twins:** `cmp` of all 106 `index.md`, base `6caa796` against `d77e7d5` → **0 differ**.
  - **Mutations:** four, each built and run against `api-table.spec.ts` in `light`. All four are killed. See item 2.
  - **Widths:** overflow and mid-word breaks over all 78 pages at 768, 1024, 1280 and 1440, base against change. The API column's width from 768 to 1920 in 32 px steps. See item 3.
  - **Benchmark:** `bun scripts/bench/kuiper.ts` at the base and at the change. Only `e2eSpecs` moves, 35 → 36. **No scorecard score moves.**
  - **Not run by me:** the perf project, `site.spec.ts`, the unit and smoke suites, and lint. Their figures are the builder's. HTML weight, measured by hand: Button +23 B gzipped, Highlighter +130 B, Field +232 B.

## The change, against the specification

- **The defect is gone.** Mid-word breaks in Type cells, over all 78 pages: 275 → **0** at 1440, 259 → **0** at 1280, 171 → **0** at 1024, 151 → **0** at 768. At 390 the builder's 4 remain. Each is one identifier wider than its cell, which the spec allows.
- **The fix is as ruled.** `break-words` on the Type cell. `pieces()` is `type.split(/(?<=[|<,(&.]|=>)|(?=\[)/)`, as the second ruling gives it. Each piece is rendered as text, and a `<wbr />` goes between pieces. There is no `{@html}`. The built HTML escapes the text (`WithoutChildrenOrChild&lt;<wbr/>ComponentProps&lt;…`).
- **The check is as ruled.** Check 1 covers the five pages, at 1440 and 390, in both schemes. Check 2 covers every page in `COMPONENT_PAGES`, at both widths and in both schemes, with 7 tables named at 1440.
- **Seen failing first.** The builder's `failing-first.txt` shows 6 failed on the three new pages at 1440. My mutation M2 (`wrap-anywhere` restored) reproduces it: the same three pages fail at 1440, with 33 faults.
- **The Landing notes are accurate,** with two exceptions. The claim that a `<wbr>` "adds no text" does not hold for Chromium's accessible name (finding 3). "Every component page" stops being true on the merge (finding 2).

## The review's questions

### 1. `pieces()`

- **Safe for every type in the API data.** All 972 typed rows from `apiTables()`, over every registry item, were split with the shipped regex. Each one's pieces re-join to the exact type, and none is empty. The marks found in types are `" | - ( : ) , ? = > < [ { } ] . ;`. The text is interpolated, never raw.
- **It never splits inside a string literal today.** No cut falls inside quotes in any of the 972 types. No literal in the data holds a split mark. There is no `...` spread and no decimal. `"default"` holds no `.`. `highlight/queries/` is prose in "What it does", not a type. The regex is not quote-aware, though, so a future `"a.b"`, `0.5` or `...rest` would gain a break inside it (finding 6).
- **Copy and paste are unchanged.** For every Type cell on the ten pages, in three engines and at two widths, `Selection.toString()` and `innerText` equal the type exactly, and the type is one of the 972. The whole API section's selection text and `innerText` are byte-equal to the base build's. In Chromium a real keyboard copy (`ControlOrMeta+C`) of the longest Type cell on each page puts the exact type on the clipboard. So does a copy of its whole row. The soft wraps add no newline.
- **Screen-reader output changes in Chromium.** Playwright's `ariaSnapshot()` of each API section is identical to the base. But Chromium's own computed name of the Type cell gains a space at each `<wbr>` that does not already sit next to a space. That is 120 of 1,086 cells, on 38 pages. Finding 3 has the evidence, and a fix that was checked.
- **The Markdown twin is byte-identical.** Checked myself, against the base `6caa796` rather than `1238f18`: 106 of 106 twins are identical. On the merge, the toast's twin holds `(deps: ToastQueueDeps)` and no `wbr`.

### 2. The tests

- **Check 1 is sound for what it claims.** It reads each character's box. It counts a fault only where two neighbouring characters of `[A-Za-z0-9]` sit on different lines. The neighbour rule correctly skips a space that hangs at a line's end.
  - Under `break-words`, the only breaks left are the line-breaking algorithm's own, the `<wbr>`s, and the emergency break of an over-wide word. The emergency break is the one between letters, so the class catches what matters.
  - **Gaps, all small.** `_` and `$` are not in the class (finding 7). A break at a `<wbr>` is allowed by design, so check 1 cannot see a `<wbr>` in the wrong place, such as `0.`/`5` (finding 6). It covers five pages, not the pages where the `<wbr>` does the most work (Popover, Accordion, Chart). Check 2 covers those.
- **Check 2's allow-list is not strict** (finding 4). An entry whose table no longer overflows still passes, and so does one that never did. I added Accordion's AccordionTrigger, which no longer overflows, and Button's Button, which never did: **1 passed**. Nor does it bound an allowed table's width. Under M1, PopoverContent grew from 608 to 778 px and the test did not mention it.
- **The mutations are all killed.** Each was built and then run against `api-table.spec.ts` in `light`:

  | Mutation | Result | What failed |
  | --- | --- | --- |
  | M1: no `<wbr>` (the pieces rendered as plain adjacent text) | **1 failed**, 11 passed | Check 2 at 1440: TooltipContent, AccordionTrigger, SheetContent, DialogContent, SignInForm, SignUpForm and SettingsForm |
  | M2: `wrap-anywhere` restored | **3 failed** | Check 1 at 1440, on Link, Button group and Progress (33 faults) |
  | M3: the first ruling's regex (no `.`, no `[`) | **1 failed** | Check 2 at 1440: AccordionTrigger 664 > 606 |
  | M4: `break-all` | **5 failed** | Check 1 at 1440 on four pages, and at 390 on Button (40 faults) |

  M1 is the brief's mutation. Removing the `<wbr>` is not caught by check 1, and should not be: without it the cell is the one-class fix, which has no mid-word breaks. It is caught by check 2 at 1440, as the builder's `check2-mutant.txt` also shows.
- **Check 2 at 390 is close to vacuous.** Below `md` the rows stack as a grid, so a table cannot overflow there. It costs little and guards the stacking, so keep it. The widths that matter are 1280 and up: the column is 616 px at 1280 and bottoms out at 606 from 1408 up. From 768 to 1248 it is 684 px or wider, and no table overflows. So 1440 is the worst case, and check 2 tests the right width.

### 3. The 7 accepted tables

**The ruling is reasonable. Keep the scroller for now, and carry the issue to `023`.**

- **They overflow on every wide desktop, not only at 1440.** Five of them (ButtonGroup, Languages, Shiki, ChartUtils and SidebarMenuButton) overflow from 1280. The overflow is 2 to 59 px: PopoverContent 2, CodeLanguages 3, ChartUtils 20, ButtonGroup 24, Shiki 47, Languages 55, SidebarMenuButton 59.
- **No change local to this file clears them all.** Each was tried in the browser, at 1440, on the six pages concerned:

  | Change | Tables still wide |
  | --- | ---: |
  | None (as built) | 7 |
  | Cell padding 12 px a side, not 16 | 3 (Languages, Shiki, SidebarMenuButton) |
  | Inner cell padding 8 px, outer edges kept at 16 | 2 (Languages, SidebarMenuButton) |
  | `pieces()` applied to the code spans in "What it does" | 4 (PopoverContent, Shiki, ChartUtils, SidebarMenuButton) |

  Padding changes the look of every table on the site. It belongs to `023`'s re-plan of the layout, as the ruling says. The scroller is 015's designed fallback. It is named and focusable, and axe passes.
- **One visible cost lands now.** On Button group, a page `027a` has just added, the cut hides the end of `DropdownMenu.Trigger` and the word "a" in "each a direct child" (the builder's `wbr-button-group-1440-light.png`). If the design lead wants it gone before `023`: applying `pieces()` to the code spans in "What it does" stays in this file, uses the same function, and clears ButtonGroup, Languages and CodeLanguages. It is optional, and a design call.
- **The toast adds an eighth** (finding 2).

## Findings, most severe first

1. **Medium; must be fixed at the merge. Check 2 fails on `release/0.13.0`, because `026` renamed the module tables' regions.** (`tests/e2e/api-table.spec.ts:131`)
   - **The defect.** `026` (in `a30ffa7`) changed the scroller's `aria-label` to `"{part}, exports"` for a module's table. The test strips only `/, API$/`. So the keys of the four module tables in `WIDE_AT_1440` no longer match: Highlighter's Languages and Shiki, CodeLanguages, and ChartUtils.
   - **Evidence.** The branch merges cleanly onto `a30ffa7` and onto `ba8694d`. On both merges, `api-table.spec.ts` gives **2 failed, 22 passed**. Check 2 fails at 1440 in each scheme, naming `"/components/highlighter/ Languages, exports: 661 > 606"` and the other three.
   - **Fix.** `.replace(/, (API|exports)$/, "")`. On the `ba8694d` merge, with this fix and finding 2's, the spec gives **24 passed** in both schemes.
2. **Medium; at the merge. Check 2 cannot see the toast page, and its ToastQueue table scrolls at 1440.** (`tests/e2e/api-table.spec.ts:118`; `tests/e2e/pages.ts`, `ITEMS`)
   - **The defect.** Check 2 walks `COMPONENT_PAGES`, which is built from `ITEMS`. At `a30ffa7` and at `ba8694d`, `ITEMS` has no `"toast"`, though the comment above `COMPONENT_PAGES` says "The 79 component pages". `COMPONENT_PAGES` has 78 entries; the sitemap has 79 component pages; the one missing is `/components/toast/`. This is `026`'s omission. It reaches the other 8 e2e files that use `COMPONENT_PAGES`, not only this one.
   - **What it hides.** On the merge at 1440, the toast's ToastQueue (`ToastQueue, exports`) is **634 > 606**. Its columns' narrowest widths are `TOAST_PROMISE_GRACE_MS` 188, `(deps: ToastQueueDeps)` 132, the header "Default" 46, and `createToastQueue` in "What it does" 140. With 128 px of padding, that is 634. So it is the same kind as the accepted seven, and no type name causes it. Its other four tables fit. At 390 none overflows.
   - **Fix, at the merge.** Make check 2 walk the sitemap's component pages, so it cannot drift from the site: `SITEMAP.map((p) => p.path).filter((p) => /^\/components\/[^/]+\/$/.test(p))`. Or add `"toast"` to `ITEMS`, but that is `026`'s list, and the other suites would then cover the toast too. Name `"/components/toast/ ToastQueue"` in `WIDE_AT_1440` with its reason, and carry it to `023` with the seven. Checked on the merge: with the toast page walked and not named, check 2 fails with `"/components/toast/ ToastQueue: 634 > 606"`; named, it passes. Tell `026`'s ledger about `ITEMS`.
3. **Low; recommended before the merge. The `<wbr>` changes the Type cell's accessible name in Chromium.** (`src/lib/site/page/api-table.svelte:70`)
   - **The defect.** Chromium's accessible name for an element computed from its contents puts a space at each `<wbr>`, unless one is already there. Over all 78 pages at 1440, **120 of 1,086** Type cells' names change, on 38 pages. Examples:
     - `AccordionPrimitive.HeaderProps["level"]` → `AccordionPrimitive. HeaderProps ["level"]`
     - `(options: TweenOptions): () => void` → `( options: TweenOptions): ( ) => void`
     - `Attachment<HTMLElement>` → `Attachment< HTMLElement>`
     - `{ id: string; message: string }[]` → `{ id: string; message: string } []`

     A screen reader that reads the cell by its name may now pause after a `.`, as at the end of a sentence. The text nodes, the selection, the clipboard and the twin are all unchanged. Playwright's `ariaSnapshot()` does not show the change, because it computes names its own way.
   - **Fix (checked).** Put `aria-hidden="true"` on the `<wbr>`. Also break before `[` only when it does not follow white space, `(?<!\s)(?=\[)`. Without that, Chart's `Snippet<\n [ …` makes a piece that is only white space, which Chromium then drops from the name. With both changes, built at `treeD`:
     - **0 of 1,086** names differ from the base;
     - the 106 twins are byte-identical;
     - copy and selection pass, 90 of 90, in three engines;
     - `api-table.spec.ts` passes, 24;
     - axe passes, 42, on seven pages in three widths and both schemes.

     Firefox's and WebKit's names cannot be read from Playwright, and no screen reader was run. Their selection and copy were checked.
   - **Note it in the Landing notes,** and correct the specification's line "A `<wbr>` adds no text": it adds none to the DOM text, but Chromium's name would gain a space without the attribute.
4. **Low. `WIDE_AT_1440` neither fails on a stale entry nor bounds a table's growth.** (`tests/e2e/api-table.spec.ts:92–106`, `:139`)
   - **Evidence.** With two stale keys added (Accordion's, which no longer overflows, and Button's, which never did), check 2 **passes**. Under M1, PopoverContent grew from 608 to 778 px, and the allow-list hid it. The test's own comment says "Each is named; a new one fails", but a fixed one should fail too, so that the list stays true as `023` changes the tables.
   - **Fix.** Give each entry its measured width, and assert both ways:
     ```ts
     const WIDE_AT_1440: Record<string, { width: number; why: string }> = { … };
     // seen: key → scrollWidth
     for (const [key, { width }] of Object.entries(known))
       expect(seen.get(key), `${key} no longer overflows: remove it`).toBeDefined();
     for (const [key, w] of seen)
       expect(w, key).toBeLessThanOrEqual((known[key]?.width ?? 606) + 8);
     ```
     A small margin (8 px) absorbs font rendering across machines. Seen failing: add a stale key, and remove a listed one.
5. **Low, for the design lead. Breaking after `(` and before `[` strands `()` and `[]`.** (`api-table.svelte:22`)
   - **Evidence.** All 78 pages were scanned for lines that start with `)` or `[]`. At 1440, **11** Type cells break inside `()` or before `[]`, and at 390, **2** do. Examples: `HighlightLanguage` / `[]`, `AppShellLink` / `[]` (three times), `(options: TweenOptions): (` / `) => void`, `(value: (` / `) => string, …`. An array suffix alone on a line is easy to miss. The ruling's purpose for `[` was indexed access (`["level"]`). For `(` it was a parameter list.
   - **Option, tried in the browser on all 78 pages.** Keep `()` and `[]` whole: `(?<=[|<,&.]|=>|\((?!\)))|(?=\[(?!\]))`. The stranded breaks fall from 11 to **1** at 1440 and from 2 to **0** at 390. The same 7 tables overflow, with Languages at 677 px instead of 661, and it is listed anyway. There are 0 mid-word breaks at 1440 and the same 4 at 390. It composes with finding 3's white-space guard: `(?<!\s)(?=\[(?!\]))`. Recommended. It is a ruling, so it goes in the Landing notes.
6. **Nit. The `.` break is not aware of strings or numbers.** (`api-table.svelte:22`)
   - Today nothing is affected (item 1). But `0.5` would break as `0.` / `5`, and check 1 would not see it, because `.` is not a word character. `...rest` would break between its dots, and `"a.b"` inside its quotes.
   - **Fix, optional:** break after `.` only before an identifier, `(?<=\.)(?=[A-Za-z_$])`. Or record the limit in the code comment, so `023` meets it knowingly when it adds types.
7. **Nit. Two small edits.**
   - The code comment breaks mid-sentence: "Each piece is text; a <wbr>" / "// between pieces adds no text". Reflow it. If finding 3 lands, add that the `<wbr>` is hidden so that Chromium's name gains no space.
   - Check 1's word class could be `[\w$]`, so that a break inside `SOME_NAME` or `$state` counts too.

## Merge notes (onto `a30ffa7`, and onto `ba8694d`, where `release/0.13.0` now is)

- **The merge is clean.** No conflicts onto either commit. `026` changed `api-table.svelte` on one line, the region's `aria-label`; `023a` changed the script and the Type cell. Both changes survive the merge. `021` (`a30ffa7..ba8694d`) touches no API-table file, `pages.ts` or `app.css`. The widths are the same at both merges. `bun.lock` is the same on both sides.
- **Before committing the merge:**
  1. Finding 1: `/, (API|exports)$/` in check 2's label.
  2. Finding 2: walk the sitemap's component pages, and name `"/components/toast/ ToastQueue"` (634 px; `TOAST_PROMISE_GRACE_MS` and `createToastQueue` in "What it does") in `WIDE_AT_1440`.
  3. Finding 3, if taken: `aria-hidden="true"` on the `<wbr>`, and `(?<!\s)` before `(?=\[`.
- **Then re-run** `api-table.spec.ts` in `light` and `dark` at the merge. Expect **24 passed**, as I saw at the `ba8694d` merge with fixes 1 and 2. Update the Landing notes' figures: 79 pages; the toast's 5 tables; 8 tables named at 1440.
- **The scorecard,** when it is re-run at the landing: on the branch only `e2eSpecs` moves (35 → 36). No score moves.
- **A note for whoever builds the merge in a scratch tree.** With `node_modules` linked to the main tree's copy, the merged build failed to hydrate on Kuiper theme, Code editor and Code languages: "multiple instances of `@codemirror/state`". With the worktree's `node_modules` (the same `bun.lock`), all 79 pages hydrated. It is an environment effect, not `023a`'s. But a check-2 run that times out on "This page did not load" means this, not a failing table.

## Evidence

All in the session scratchpad, `review-023a/`:

- `check.txt` (`bun run check`); `e2eA.txt` (the branch); `e2eB2.txt` and `e2eE.txt` (the merges, failing); `e2eE-toast.txt` (the toast page, unlisted); `axeA.txt`.
- `copy.txt`, and `treeA/tests/review/copy-a11y.spec.ts` (selection, `innerText`, clipboard and `ariaSnapshot`); `treeA/tests/review/axall.spec.ts` (Chromium names, all pages); `ax2.spec.ts` (the `<wbr>` variants in three engines).
- `mut-M1-no-wbr.txt` to `mut-M4-break-all.txt`, with each mutation's diff (`mut-*.diff`); `stale.txt`.
- `widths.txt` (four widths, base against change); `treeA/tests/review/col.spec.ts`, `exp.spec.ts`, `lines.spec.ts` and `refine.spec.ts` (the layout experiments of item 3 and finding 5).
- `types.json`: the 972 typed rows and their pieces. `benchA.txt` and `benchC.txt`: the benchmark.
- `fixD.txt`: the suggested fix's api-table and axe run.
