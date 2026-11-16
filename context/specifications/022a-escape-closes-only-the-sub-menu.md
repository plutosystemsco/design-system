# 022a — Escape closes only the sub-menu

- **Status:** Open. Ledgered in `tests/fault-ledger.ts` (four lines, one per reader and browser pair). Queued in lane I behind `023` (`roadmap.md` §3, "Cross-lane landings").
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one item). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s screen-reader suite, `tests/sr/dropdown-menu.sr.ts`, "Escape in the sub-menu speaks its parent item, which has focus" (rule O3s, `022` decision 12). Seen in the dry run in Chromium, WebKit and Firefox on 2026-11-15, and by a probe in all three.

## The defect

In `dropdown-menu`, open the menu, move to "Invite users", and press ArrowRight to open its sub-menu. Escape then closes **the whole menu**, and focus goes to the trigger, "Account". ArrowLeft does return focus to "Invite users".

The WAI-ARIA menu pattern says Escape "closes the menu that contains focus and returns focus to the element … from which the menu was opened": for a sub-menu, its parent item. `022`'s rule O3s holds the item to that. A keyboard or screen-reader user who opens a sub-menu by mistake loses their place in the parent menu.

The page's own words ("Escape closes and returns focus to the trigger") describe the top menu only; they do not change.

## The fix

In `src/lib/registry/ui/dropdown-menu/dropdown-menu-sub-content.svelte`, handle Escape on the sub-content: prevent bits-ui's default (which dismisses the whole menu tree) and close the sub-menu alone, returning focus to its sub-trigger, as ArrowLeft already does. An app's own `onEscapeKeydown` is still called first. No prop is added and none changes.

## The check

`tests/sr/dropdown-menu.sr.ts`'s O3s test, under all four pairs. It fails today, on its focus fact in every engine. When the fix lands:

1. the four ledger lines for this test, `change: "022a"`, are removed from `tests/fault-ledger.ts`, or the run turns red (`022` decision 16);
2. a keyboard test joins `tests/e2e/keyboard.spec.ts`: open the sub-menu, Escape, the sub-menu is gone, the menu is open, and focus is on "Invite users", in all six browser projects. It is written first and seen failing on today's item.
