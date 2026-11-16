# 023b — API names break between words

- **Status:** open. Queued in lane S. Not on 0.13.0's critical path.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one component of the site). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `023a`. Lane S: `src/lib/site/page/api-table.svelte`.
- **Found by:** the merge of `022a`, `022e` and `024e` into `release/0.13.0`, 2026-11-16. `api-table.spec.ts`, "at 1440 › on every component page, no API table scrolls sideways", failed on `/components/dropdown-menu/ DropdownMenuSubContent: 628`.

## The defect

The API table's Name cell holds the prop's name in `<code>`, with no break opportunity. `022a` re-declares `escapeKeydownBehavior` on `DropdownMenuSubContent`, for its Kuiper default. That name is 21 characters of monospace. At 1440 px it widens the Name column until the table is 628 px in a 606 px text column, so the table scrolls sideways.

`023a` made type names break only between words. Prop names have no such rule, and any later re-declared prop with a long name does the same.

## The fix

The Name cell offers a break between the words of a camelCase name: a `<wbr>` before each capital that follows a lower-case letter or a digit. A name breaks only when its column needs it. The text, its accessible name and what a reader copies do not change. Then `WIDE_AT_1440`'s entry for `DropdownMenuSubContent`, added at the merge, is removed.

## The check

1. `api-table.spec.ts`'s sideways test with `WIDE_AT_1440` emptied: seen failing first, at 1440, on `DropdownMenuSubContent`. It passes after the fix at 1440, 1024 and 390.
2. `api-table.spec.ts`'s accessible-name test, every Name cell's name equal to its text, passes unchanged.
3. Page budgets: the `component` template's transfer moves by bytes, not kB. The perf project stays green.
