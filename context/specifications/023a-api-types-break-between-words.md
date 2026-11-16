# 023a — API types break between words

- **Status:** Built on its branch; awaiting the change review. The review should weigh finding 1 of the Landing notes before the merge.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one site file). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `027a`'s change review, finding 2 ([`../reviews/027a-batch-a-quiet-items-pr-2026-11-15.md`](../reviews/027a-batch-a-quiet-items-pr-2026-11-15.md)).

## The defect

The API table's Type cell carries `wrap-anywhere` (`src/lib/site/page/api-table.svelte`, the second `<td>` of each row). `overflow-wrap: anywhere` lets the browser break a word at any letter and, unlike `break-word`, counts those break points when it sizes the column. In an auto-layout table the Type column then shrinks to its narrowest letter, and short type names break mid-word on wide screens: "strin/g", "Butt/onGr/oupV/aria/nt" on the link, button group and progress pages at 1440 (the review's screenshots, `scratchpad/review-027a/`).

Button and Meter don't show it today only because their other columns happen to be narrower. `023` describes every prop of every item, which adds a wide "What it does" column to every table, so the defect would spread to every component page.

## The fix

Replace `wrap-anywhere` on the Type cell with `break-words` (`overflow-wrap: break-word`). A long union still wraps rather than overflowing, but only where the column cannot hold a whole word, and the column is sized to its longest word.

No item changes. No token or class is added.

## The check

An e2e test in the API table's existing spec (or `tests/e2e/api-table.spec.ts` if none holds it), "type names break only between words":

1. On `/components/button-group/`, `/components/link/`, `/components/progress/`, `/components/button/` and `/components/meter/`, at 1440 and 390, light and dark: for every Type cell's `<code>`, each line box (read with `Range.getClientRects()` over its text) starts at a word boundary. Concretely, no rect boundary falls between two letters of `[A-Za-z0-9]`.
2. No API table scrolls sideways at 390 (`scrollWidth <= clientWidth + 1` on its scroller), so the fix does not trade breaking for overflow.

**Seen failing first:** on the tree with `027a` landed, assertion 1 fails at 1440 on the three new pages, naming at least `ButtonGroupVariant`. The output goes in the Landing notes.

The axe scans and the perf budgets must stay green.

## Landing notes

Built on its branch from `release/0.13.0` at `6caa796`. The machine's load average was 70 to 90. Browser runs served the worktree's `build/` with `vite preview` on **5723**, through a scratch Playwright config with the repository's projects. 5199 was not used.

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

1. **(Medium) At 1440 the fix trades breaking for overflow on 14 of 266 tables.** With `break-words` the Type column is as wide as its longest word, as the spec says. Where the four columns' longest words and their padding sum past the 606 px text column, the table scrolls inside its region. Assertion 2 reads only 390, where rows stack and nothing can overflow, so it does not see this. The tables, as `scrollWidth > clientWidth` at 1440:

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
