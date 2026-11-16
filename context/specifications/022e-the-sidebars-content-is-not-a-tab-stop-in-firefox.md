# 022e — The sidebar's content is not a Tab stop in Firefox, when it holds a focusable item

- **Status:** Open. Ledgered in `tests/fault-ledger.ts`. Lane I, queued behind `023` (`roadmap.md` §3, "Cross-lane landings"). The design lead ruled the fix's trade-off on 2026-11-15 (`022`'s review, finding 8): keep keyboard scrolling.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one item). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `keyboard.spec.ts`, "block views at 1280 › /view/app-shell/sidebar-icon/: 12 stops in order, each with the ring, then out of the document", in `firefox-light` and `firefox-dark`: stop 5 is the sidebar's content `div` ("workspace Overview Activity Members settings Preferences Profile Notifications"), not `a:Overview`.

## The defect

Firefox makes a scroll container that overflows a Tab stop of its own, even when everything inside it is focusable. Chromium makes a scroller focusable only when it holds no focusable element. `sidebar`'s content (`src/lib/registry/ui/sidebar/sidebar-content.svelte`, `overflow-auto`) overflows in the icon sidebar, so in Firefox a keyboard user meets an extra stop with no name of its own before the first link. An installed app's sidebar does the same.

## The ruling: keep keyboard scrolling

`tabindex="-1"` removes the extra stop, and with it the only keyboard way to scroll the box when nothing inside it can take focus. An installed app may put plain text there. So the box gives up its stop **only when it holds a focusable element**; otherwise it stays focusable, as Firefox and Chromium both make it.

The precedent: WCAG 2.1.1 (Keyboard) requires scrollable content to be reachable by keyboard; axe's `scrollable-region-focusable` reports a scroll region with no focusable content that cannot take focus; and Chromium's focusable-scroller rule makes a scroller focusable only when it has no focusable child.

## The fix

In `sidebar-content.svelte`, after mount and whenever its children change (a `MutationObserver` on the subtree), set `tabindex="-1"` on the content's scroll box when it contains an element that matches the tabbable selector, and remove the attribute when it does not. An app that sets its own `tabindex` keeps it. No prop, slot or class changes; the changelog notes the behaviour.

## The check

1. The sidebar-icon walk in `firefox-light` and `firefox-dark`, failing today. When the fix lands, its ledger lines (`change: "022e"`) are removed, or the run turns red. The Chromium and WebKit walks must pass unchanged.
2. A new test in every browser project: a sidebar whose content holds only text and overflows is still one Tab stop, and the arrow keys scroll it; axe finds no `scrollable-region-focusable`. Written first and seen failing against a fix that sets `tabindex="-1"` unconditionally.
