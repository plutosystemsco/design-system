# 022a — Escape closes only the sub-menu

- **Status:** landed on `release/0.13.0` 2026-11-16, with `022a`, `022e` and `024e` in one merge. The change review (`reviews/022ae-024e-lane-i-small-changes-pr-2026-11-16.md`) said land; its findings are dispositioned there. Its four ledger lines are removed. Lane I.
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

## Landing notes

Built 2026-11-16 by a lane-I builder, after `024e` in the same worktree, one commit. The owner was asleep; no question was asked.

### Why Escape closed the whole menu

bits-ui 2.20.2 routes Escape through one escape layer per open menu level. With every level at its default `escapeKeydownBehavior`, `"defer-otherwise-close"`, the **first** layer registered, the root menu's content, is the one responsible (`use-escape-layer.svelte.js`, `isResponsibleEscapeLayer`), so the root closed, and focus went to the trigger. The sub-content's own Escape handler, which closes the submenu alone, never ran.

### The fix

`dropdown-menu-sub-content.svelte` gives the sub-content `escapeKeydownBehavior="close"` by default, so its layer is the topmost `"close"` layer and takes Escape: bits-ui calls the sub-content's `onEscapeKeydown`, then closes that submenu alone. The item's handler calls the app's own `onEscapeKeydown` first; unless that prevents the default, it moves focus to the sub-trigger (the element whose `aria-controls` names the open sub-content), as ArrowLeft's handler does. A second Escape is the root menu's, and returns focus to the trigger. Prior art: the WAI-ARIA APG menu pattern ("Escape: close the menu that contains focus and return focus to the element … from which the menu was opened"), and Radix's and bits-ui's own ArrowLeft handling. The prop is re-declared with a doc comment, as `align` and `alignOffset` are, for its Kuiper default (rule V8: one block); its type is bits-ui's. An app that passes `escapeKeydownBehavior="defer-otherwise-close"` gets the old behaviour. No prop is added or removed. The changelog's 0.13.0 entry has a `dropdown-menu` bullet saying that Escape's behaviour changes (the spec review's ask).

### Seen failing first, on the build of `1a116a4`

The new keyboard test, `keyboard.spec.ts` "behaviours › 022a. Escape in the sub-menu closes it alone: the menu stays open with focus on Invite users; Escape again returns to the trigger", written first: failed in `chromium-light`, `firefox-light` and `webkit-light`, each at the same line: `expect(locator('[data-slot="dropdown-menu-content"]')).toBeVisible()` after the sub-menu's Escape, "element(s) not found": the whole menu had closed. The SR test's O3s line failed in `022`'s dry runs in all three engines (above).

### After the fix

- The keyboard test passes in all six projects (6 of 6).
- **The SR dry run** (`SR_DRY=1 E2E_PREBUILT=1 bun --bun playwright test -c playwright.sr.config.ts dropdown-menu`), with the four ledger lines removed: **9 passed**, 0 failed: the three tests in `webkit`, `chromium` and `firefox`, O3s's focus fact among them. A dry run judges no speech; the readers confirm O3s in the next `matrix` run.
- **The ledger:** the four `022a` lines (VoiceOver with WebKit and Chromium, NVDA with Chromium and Firefox) and their shared `SUB_MENU_ESCAPE` record are removed from `tests/fault-ledger.ts`.
- `keyboard.spec.ts`, `primitives.spec.ts`, `navigation.spec.ts` and `button-group.spec.ts` (every spec that opens `dropdown-menu`'s page or its sub-menu), in all six projects, 4 workers, under load (about 20 to 40 on 10 cores): **1,099 passed**, 5 failed. The four Firefox walks that failed are `022d`'s and `022e`'s ledgered lines, failing as their lines say. Of the 5 failures, 2 were `primitives.spec.ts` load timeouts in `firefox-dark` (`goto` and `evaluate` at 30 s), which passed on a re-run with 2 workers; 3 were `message-log`'s keyboard-scroll tests in WebKit ("End scrolls the log's region…", "Enter on the log's button…"), which failed again in WebKit on the re-run and pass in Chromium and Firefox. `message-log`'s page has no menu, no code block and no sidebar, so none of this build's three changes reaches it. **A finding for lane I's triage:** it is not in `macos-webkit.ts`'s record and not ledgered; it should be checked on Linux WebKit in the next `matrix` run before it is ledgered or recorded.
- **The cost:** the cost unit test named `dropdown-menu` and `app-shell` size-stale (app-shell installs `dropdown-menu`). `bun run cost --sizes-only` rewrote their hashes; their sizes and output hashes are unchanged, since neither measured app renders a submenu. Only the catalogue moved, 373,795 → 373,791 B of JS.
- `static/r/` and `static/v0.13.0/r/` regenerated by the build (`dropdown-menu.json`); the thumbnails' manifest rewritten with `--hash-only` (6 hashes; no picture changed).
- **The scorecard** is not re-run for this change alone; it follows the batch's re-run, as `024e`'s does.

### The merge (2026-11-16)

Landed with `022a`, `022e` and `024e` in one merge. Its conflicts, figures and the one test it broke are in [`024e`'s Landing notes](024e-empty-code-loads-no-grammar.md), "The merge".
