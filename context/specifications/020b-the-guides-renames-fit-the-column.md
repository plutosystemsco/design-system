# 020b — The guide's renames fit the column

- **Status:** Ready to build after `020a`.
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

Not yet landed.
