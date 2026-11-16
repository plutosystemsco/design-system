# 023a — API types break between words

- **Status:** Built on its branch, with the design lead's ruling at landing (2026-11-16) applied; awaiting the change review.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one site file). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `027a`'s change review, finding 2 ([`../reviews/027a-batch-a-quiet-items-pr-2026-11-15.md`](../reviews/027a-batch-a-quiet-items-pr-2026-11-15.md)).

## The defect

The API table's Type cell carries `wrap-anywhere` (`src/lib/site/page/api-table.svelte`, the second `<td>` of each row). `overflow-wrap: anywhere` lets the browser break a word at any letter and, unlike `break-word`, counts those break points when it sizes the column. In an auto-layout table the Type column then shrinks to its narrowest letter, and short type names break mid-word on wide screens: "strin/g", "Butt/onGr/oupV/aria/nt" on the link, button group and progress pages at 1440 (the review's screenshots, `scratchpad/review-027a/`).

Button and Meter don't show it today only because their other columns happen to be narrower. `023` describes every prop of every item, which adds a wide "What it does" column to every table, so the defect would spread to every component page.

## The fix

Replace `wrap-anywhere` on the Type cell with `break-words` (`overflow-wrap: break-word`), so a word never splits. The column is then sized to its longest unbreakable piece.

So that a long type can still wrap, the API table gives the browser break opportunities at type punctuation. It renders `row.type` as pieces split after each `|`, `<`, `,`, `(`, `&`, `=>` and `.`, and before each `[`, with a `<wbr>` between pieces (before `>` runs too, if that proves needed; it did not). The pieces are text, never `{@html}`. A `<wbr>` adds no text, so the Markdown twin does not change. This is how MUI's and Radix's prop tables let a long union wrap at its tokens, never inside a name. (The rulings at landing, 2026-11-16: the first gave the first six marks, the second added `.` and `[`.)

No item changes. No token is added.

## The check

An e2e test in the API table's existing spec (or `tests/e2e/api-table.spec.ts` if none holds it), "type names break only between words":

1. On `/components/button-group/`, `/components/link/`, `/components/progress/`, `/components/button/` and `/components/meter/`, at 1440 and 390, light and dark: for every Type cell's `<code>`, each line box (read with `Range.getClientRects()` over its text) starts at a word boundary. Concretely, no rect boundary falls between two letters of `[A-Za-z0-9]`.
2. On every component page, at 1440 and 390, light and dark, no API table scrolls sideways (`scrollWidth <= clientWidth + 1` on its scroller), so the fix does not trade breaking for overflow. A table that still overflows at 1440 is recorded with its reason in the Landing notes and named in the test; any other fails. (Extended from 390 and the five pages by the ruling at landing.)

**Seen failing first:** on the tree with `027a` landed, assertion 1 fails at 1440 on the three new pages, naming at least `ButtonGroupVariant`. The output goes in the Landing notes.

The axe scans and the perf budgets must stay green.

## Landing notes

Built on its branch from `release/0.13.0` at `6caa796`. The machine's load average was 70 to 90. Browser runs served the worktree's `build/` with `vite preview` on **5723**, through a scratch Playwright config with the repository's projects. 5199 was not used.

### Rulings at landing (2026-11-16)

The first build (`1238f18`) made only the one-class fix. It removed every mid-word break, but at 1440 **14 of 266 tables then scrolled sideways, where none had before** (finding 1 of the first notes, below). Worst was PopoverContent, whose "What it does" sat wholly out of view. The design lead ruled option (d), neither (a) nor (b) of that finding:

1. **Keep `break-words`**, so words never split.
2. **Break at type punctuation.** In the Type cell, a `<wbr>` after each `|`, `<`, `,`, `(`, `&` and `=>`. Done in `api-table.svelte` as `pieces(row.type)`: `type.split(/(?<=[|<,(&]|=>)/)`, each piece rendered as text, a `<wbr>` between pieces. No `{@html}`. A break before `>` runs was not needed: no overflowing table's widest Type piece ends in one.
3. **Check 2 runs at 1440 and 390, over every component page** (78 pages, 266 tables). Check 1 stays as it was.
4. **A table that still overflows is recorded, with why.** If one identifier is wider than its column, the table's own scroller is the designed fallback.
5. **The Markdown twin must not change.** Checked; see below.

**What the ruling changed, at 1440** (all 78 pages, light and dark the same):

| | Mid-word breaks in Type cells | Tables that scroll sideways |
| --- | ---: | ---: |
| Before `023a` (`wrap-anywhere`) | 279, on 39 pages | 0 |
| The one-class fix (`1238f18`) | 0 | 14 |
| With the `<wbr>` pieces | **0** | **8** |

At 390: 0 tables scroll sideways in all three. Mid-word breaks: 10, 10, then **4**. Each of the 4 is one identifier wider than its cell, which may only break or overflow: `HighlightLanguage` (138 px in a 132 px cell), `ChartConfig` (89 in 83), `TooltipPayload` (114 in 83) and Sidebar's `WithoutChildrenOrChild` (179 in 148). The `<wbr>` pieces fixed the other six, `WithoutChildrenOrChild<ComponentProps<typeof` on Tooltip, Popover, Sheet and Dialog among them.

The six tables the pieces fixed at 1440: TooltipContent, SheetContent, DialogContent, SignInForm, SignUpForm and SettingsForm. Popover's PopoverContent went from 778 px to 608.

**The 8 that still overflow at 1440, and why.** Each column's narrowest width is its longest unbreakable piece. That was measured as a copy of each cell at `width: min-content`, with the headers' own words counted. Those four widths plus 128 px of cell padding come to more than the 606 px column. No column holds a single identifier wider than itself, so this is the sum, not one name:

| Page | Table | Width | The longest pieces: Name, Type, Default, What it does |
| --- | --- | ---: | --- |
| Highlighter | Languages | 677 > 606 | `findHighlightLanguage` 180, `HighlightLanguage[]` 164, header 46, `highlight/queries/` 159 |
| Sidebar | SidebarMenuButton | 665 > 606 | `tooltipContentProps` 164, `WithoutChildrenOrChild<` 196, `"default"` 83, 94 |
| Accordion | AccordionTrigger | 664 > 606 | 75, `AccordionPrimitive.HeaderProps["level"]` 326, 42, 89 |
| Highlighter | Shiki | 653 > 606 | `loadShikiLanguage` 148, `ThemeRegistrationRaw` 172, header 46, 159 |
| Button group | ButtonGroup | 630 > 606 | `orientation` 99, `HTMLDivElement` 123, `"horizontal"` 107, `DropdownMenu.Trigger` 172 |
| Chart | ChartUtils | 626 > 606 | `getPayloadConfigFromPayload` 229, `ChartContextValue)` 156, header 46, 67 |
| Code languages | CodeLanguages | 609 > 606 | `CodeLanguageKind` 140, `LanguageSupport` 132, header 46, 164 |
| Popover | PopoverContent | 608 > 606 | `portalProps` 99, `WithoutChildrenOrChild<` 196, `"center"` 75, 110 |

- **Accordion is the one the Type column drives.** `AccordionPrimitive.HeaderProps["level"]` has no break point the ruling names (`.`, `[` and `"` are not in the list). A `<wbr>` before `[` would bring it to about 594 px. That is a design call outside this ruling, so it is left for the design lead.
- **The other seven** are driven by the Name and "What it does" columns as much as the Type column. Their Type pieces are already single names.
- The test names all 8 in `WIDE_AT_1440`, each with its reason. Any other table that scrolls at 1440, or any table at 390, fails.

**The twin is unchanged.** `cmp` of `build/components/popover/index.md` against the twin built at `1238f18`: identical. `diff -rq` of every file but the HTML, JSON and `_app/`, over all 106 twins: no difference.

**Check 2's new reach was seen to catch the fault.** I removed the pieces (`pieces = (type) => [type]`), rebuilt, and ran check 2 in light. At 1440 it failed, naming the six tables above, TooltipContent (612 > 606) to DialogContent (774 > 606). At 390 it passed. With the pieces restored, it passes at both widths.

**Checks after the ruling:**

- **`api-table.spec.ts`**, light and dark: **24 passed**. That is 20 for check 1 (five pages, two widths, two schemes) and 4 for check 2 (two widths, two schemes, 78 pages each).
- **axe** on the five pages at 360, 768 and 1280, light and dark: **30 passed**, 0 violations.
- **`site.spec.ts`**, criteria 9 and 26, light and dark: **24 passed**.
- **Perf** (`--project=perf --no-deps`): **5 passed**.
- **`bun run check`:** 0 errors, 0 warnings, 2,231 files. **lint:** clean.
- **Screenshots** after the ruling are `wbr-*` in `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/023a/`: the five pages, Popover, Dialog, Sign-up, Chart and Accordion, at 1440 and 390, light and dark. The counts are in `all-wbr.txt`, the column widths in `probe.txt`, and the mutation's run in `check2-mutant.txt`. On Popover and Dialog at 1440, `WithoutChildrenOrChild<` / `ComponentProps<typeof` / `PopoverPortal>>` now wrap at their `<`, and every column is in view. On Button group the last 24 px, the `DropdownMenu.Trigger` in "What it does", still sit behind the table's scroll.

### Rulings at landing (2026-11-16, second)

The design lead ruled on the 8 tables above:

1. **A type also breaks after `.` and before `[`.** Both are token boundaries: namespace access and indexed access. `pieces()` is now `type.split(/(?<=[|<,(&.]|=>)|(?=\[)/)`.
   - With it, at 1440, **7 tables** scroll sideways (all 78 pages, light). Accordion's AccordionTrigger is off the list, and Highlighter's Languages went from 677 px to 661.
   - `WIDE_AT_1440` now names these 7, each with its reason: ButtonGroup (630), PopoverContent (608), Highlighter Languages (661) and Shiki (653), CodeLanguages (609), ChartUtils (626) and SidebarMenuButton (665).
   - At 390, check 2 still finds 0 tables scrolling.
   - The twins are still unchanged: `diff -rq` of the 106 twins against `1238f18`'s build shows no difference.
2. **The 7 are accepted for now.** They overflow because their columns' minimum widths add up, not because of any type name. The table's own scroller is the fallback 015 designed.
   - **Carried to `023` as a finding.** `023` adds a "What it does" column to every table, so it must re-plan the table's layout.
   - **If a ruling is needed then,** two suggestions: less cell padding at that width (the four cells' padding is 128 px of the 606), or stacking the rows below a width, as they already stack below `md`.

After this ruling:

- `api-table.spec.ts`, light and dark: **24 passed**.
- `bun run check`: 0 errors, 0 warnings, 2,231 files. lint: clean.

The notes below are from the first build, at `1238f18`, before the ruling.

### Rulings during the build

1. **The test has its own file, `tests/e2e/api-table.spec.ts`.** No spec file is the API table's own. `site.spec.ts` holds one API-table case (018 criterion 9's column count) among the whole site's checks, so the spec's fallback applies.
2. **`ButtonGroupVariant` is now shown as its union.** `027a`'s review finding 4 was fixed before this build: the Type cells give `"attached" | "spaced"`, not the alias. So the failing-first output names the union, `"att/ached" | "spaced"`, where the spec expected `ButtonGroupVariant`. It is the same prop, `ButtonGroup`'s `variant`.
3. **What a break between letters is.** Each character's box is read with `Range.getClientRects()`. A line starts where a character sits lower than the one before it by more than half its height. It is a fault when the two characters are both `[A-Za-z0-9]` and are neighbours in the text. A space that hangs at a line's end draws no box, so without the neighbour rule `typeof /TooltipPortal` read as a fault.

### Seen failing first

The test went in first, with `api-table.svelte` unchanged. **6 failed, 24 passed** of 30, light and dark. Assertion 1 failed at 1440 on the three new pages, Button group, Link and Progress, in both schemes. It passed at 390, and on Button and Meter at both widths. Assertion 2 passed everywhere. The light run's output (dark is identical):

```
✘ at 1440 › on /components/button-group/
+   "HTML/DivElement | null",
+   "HTMLDivE/lement | null",
+   "HTMLDivEleme/nt | null",
+   "HTMLDivElement | nul/l",
+   "stri/ng",
+   "\"att/ached\" | \"spaced\"",
+   "\"attache/d\" | \"spaced\"",
+   "\"attached\" | \"spa/ced\"",
+   "\"hor/izontal\" | \"vertical\"",
+   "\"horizon/tal\" | \"vertical\"",
+   "\"horizontal\" | \"ver/tical\"",
+   "\"horizontal\" | \"vertica/l\"",
+   "Snip/pet",
+   "stri/ng",
✘ at 1440 › on /components/link/
+   "HTMLA/nchorElement | null",  … "strin/g", "\"defa/ult\" | \"inherit\"", "boole/an",
+   "Parti/al<LinkStrings>", "Partial<Li/nkStrings>", "Partial<LinkStr/ings>", "Snipp/et"   (15 in all)
✘ at 1440 › on /components/progress/
+   "HTMLPro/gressElement | null",
+   "HTMLProgressEl/ement | null",
+   "\"defaul/t\" | \"destructive\"",
+   "\"default\" | \"destru/ctive\"",
  6 failed
  24 passed (28.6s)
```

### The fix

In `src/lib/site/page/api-table.svelte`, the Type cell's `wrap-anywhere` is now `break-words` (`overflow-wrap: break-word`; the built CSS holds `.break-words{overflow-wrap:break-word}`). Nothing else changed.

### Checks

- **`api-table.spec.ts`**, light and dark: **30 passed** (5 pages × 2 widths × assertion 1, and 5 pages × assertion 2, in each scheme).
- **Every component page, once** (a scratch copy of the check over all 78 pages, light and dark; 266 API tables, 1,086 Type cells):
  - **At 1440:** mid-word breaks in a Type cell fall from **279** (on 39 pages) to **0**.
  - **At 390:** 0 tables scroll sideways, before and after. 10 mid-word breaks remain, the same 10 before and after. Each is in a token longer than its cell, so it can only break or overflow, as the spec allows: `WithoutChildrenOrChild<ComponentProps<typeof` (357 px in a 213 px cell) on Tooltip, Popover, Sheet and Dialog; `HighlightLanguage` (138 in 132) on Highlighter; three of Chart's `ChartUtils` signature (in an 83 px cell); two of Sidebar's `SidebarMenuButton` tooltip type.
  - **At 1440, 14 tables now scroll sideways; none did before.** See finding 1.
- **axe** on the five pages at 360, 768 and 1280, light and dark: **30 passed**, 0 violations.
- **`site.spec.ts`**, criteria 9 (no page scrolls sideways, at 360 and 390) and 26 (overflow regions), light and dark: **24 passed**.
- **Perf** (`--project=perf --no-deps`): **5 passed**.
- **`bun run check`:** 0 errors, 0 warnings, 2,231 files. **lint:** clean.
- The benchmark scorecard is re-run when this lands on `release/0.13.0`, not on the branch.

### Screenshots

Each API section, whole, at 1440 and 390, light and dark, before (`before-*`) and after (`after-*`). The five pages, and Popover, Dialog and Sign-up for finding 1. They are in `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/023a/`, with the failing-first run (`failing-first.txt`), the all-pages runs (`all-before.txt`, `all-after.txt`) and one experiment (`exp-B.txt`, below). They are not kept in the repository.

### Findings for the review and the design lead

1. **(Medium) At 1440 the fix trades breaking for overflow on 14 of 266 tables.** _Settled by the ruling at landing, above: 8 remain, each recorded._ With `break-words` the Type column is as wide as its longest word, as the spec says. Where the four columns' longest words and their padding sum past the 606 px text column, the table scrolls inside its region. Assertion 2 reads only 390, where rows stack and nothing can overflow, so it does not see this. The tables, as `scrollWidth > clientWidth` at 1440:

   | Page | Table | Width |
   | --- | --- | ---: |
   | Popover | PopoverContent | 778 > 606 |
   | Dialog | DialogContent | 774 > 606 |
   | Sheet | SheetContent | 770 > 606 |
   | Highlighter | Languages | 677 > 606 |
   | Code languages | CodeLanguages | 674 > 606 |
   | Sidebar | SidebarMenuButton | 665 > 606 |
   | Accordion | AccordionTrigger | 664 > 606 |
   | Highlighter | Shiki | 653 > 606 |
   | Sign-up | SignUpForm | 645 > 606 |
   | Button group | ButtonGroup | 630 > 606 |
   | Chart | ChartUtils | 626 > 606 |
   | Sign-in | SignInForm | 613 > 606 |
   | Tooltip | TooltipContent | 612 > 606 |
   | Settings | SettingsForm | 608 > 606 |

   The worst is PopoverContent (`after-popover-1440-*.png`): the 357 px `WithoutChildrenOrChild<ComponentProps<typeof` holds its column, and "What it does" sits wholly out of view until the reader scrolls. Before, that one type broke mid-word and every column showed. On Button group the last 24 px are cut: the `DropdownMenu.Trigger` code in "What it does" is the column's longest word. The scrolling region is the designed fallback (015 criterion 26: named, focusable, and its test passes). But `023` adds a "What it does" column to every table, so this count will grow.
   - **Tried and dropped:** `wrap-anywhere` on "What it does" too (`exp-B.txt`). It moves the defect: that column shrinks to 33 px on PopoverContent and breaks prose mid-word on 10 pages.
   - **Options, for a follow-up small change:** (a) keep this fix, and accept the inside scroll as 015 designed it; (b) let only long tokens break, for example a `min-width` floor of about 20ch on the Type cell with `wrap-anywhere` kept, so a type of up to 20 characters holds whole and a longer one breaks; (c) add assertion 2 at 1440 in a follow-up and fix what it finds. Recommended: (b), checked with assertion 2 at both widths. This build keeps the spec's one class, as specified.
2. **(Nit) "Default" and its value touch at 390.** On a phone the muted "Default" label sits against its code chip with no space (`after-button-group-390-*.png`). It is the same before the fix, so it is not this change's; noted for `023`, which rewrites these rows.
