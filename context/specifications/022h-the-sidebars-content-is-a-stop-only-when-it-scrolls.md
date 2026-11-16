# 022h — The sidebar's content is a Tab stop only when it scrolls

- **Status:** open. Queued in lane I after the re-base sweep that follows `024b` to `024e`. Not on 0.13.0's critical path.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022e`. Lane I: `src/lib/registry/ui/sidebar/sidebar-content.svelte`.
- **Found by:** the change review of `022a`, `022e` and `024e`, findings 3 and 4 (`reviews/022ae-024e-lane-i-small-changes-pr-2026-11-16.md`).

## The defect

Since `022e`, `SidebarContent` takes `tabindex="0"` whenever it holds no Tab stop. It does so whether or not it scrolls.

- **A box that does not scroll is still a stop.** A sidebar that shows only "No projects yet", or nothing while it loads, gives a keyboard user an extra stop with no name and nothing to do.
- **A hidden element still counts as a stop.** The box reads its contents with `querySelector`, which matches the DOM, not what is drawn. In the icon sidebar, `SidebarMenuSubButton`, `SidebarInput`, `SidebarGroupAction` and `SidebarMenuAction` are `display: none`. A box that held only those, plus text, would take `tabindex="-1"` and lose its keyboard scroll. No Kuiper view does this today.

## The fix

The box takes `tabindex="0"` only when it holds no stop **and** it overflows (`scrollHeight > clientHeight`). A `ResizeObserver` on the box re-reads the overflow, beside the `MutationObserver` that re-reads the contents. A box that neither holds a stop nor scrolls has no `tabindex`. The comment above `TABBABLE` says it matches the DOM, not what is drawn. Hidden elements are not filtered: that would need a layout read at every mutation, for a case no view has.

No prop, slot or class changes. The changelog's `sidebar` bullet says what an installed app sees.

## The check

1. A new test in every browser project, written first and seen failing on `022e`'s item: a sidebar whose content holds one short line of text and does not overflow is not a Tab stop, and axe finds no `scrollable-region-focusable`.
2. `022e`'s test, a text-only box that overflows, still passes: one Tab stop, arrow keys scroll it, axe clean.
3. The sidebar-icon walk and N5 pass unchanged.
4. `bun run cost --sizes-only` for `sidebar` and `app-shell`; the runtime figures at the tag's cost run.
