# 023a — API types break between words

- **Status:** Ready to build, before `023`.
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

Not yet landed.
