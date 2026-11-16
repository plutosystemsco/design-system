# 022e — The sidebar's content is not a Tab stop in Firefox

- **Status:** Open. Ledgered in `tests/fault-ledger.ts`. Lane I, queued behind `023` (`roadmap.md` §3, "Cross-lane landings").
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one item). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `keyboard.spec.ts`, "block views at 1280 › /view/app-shell/sidebar-icon/: 12 stops in order, each with the ring, then out of the document", in `firefox-light`: stop 5 is the sidebar's content `div` ("workspace Overview Activity Members settings Preferences Profile Notifications"), not `a:Overview`.

## The defect

Firefox makes a scroll container that overflows a Tab stop of its own, even when everything inside it is focusable; Chromium does not when the container holds a focusable element. `sidebar`'s content (`src/lib/registry/ui/sidebar/sidebar-content.svelte`, `overflow-auto`) overflows in the icon sidebar, so in Firefox a keyboard user meets an extra stop with no name of its own before the first link. An installed app's sidebar does the same.

## The fix

`tabindex="-1"` on the content's scroll box. Its items are links and buttons, so it still scrolls by keyboard as focus moves through them, in every engine. No prop, slot or class changes; the changelog notes the attribute.

## The check

The sidebar-icon walk in `firefox-light` and `firefox-dark`, failing today. When the fix lands, its ledger lines (`change: "022e"`) are removed, or the run turns red. The Chromium and WebKit walks must pass unchanged.
