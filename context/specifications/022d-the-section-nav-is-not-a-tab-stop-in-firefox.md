# 022d — The section nav is not a Tab stop in Firefox

- **Status:** Open. Ledgered in `tests/fault-ledger.ts`. Lane S.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in the site's layout). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `keyboard.spec.ts`, "at 1280 × 900 › the Components landing: Tab visits its 193 stops in order, each with the ring unclipped", in `firefox-light`: stop 9 is `nav:Components pages`, not `a:Components`.

## The defect

Firefox makes a scroll container that overflows a Tab stop of its own, even when everything inside it is focusable; Chromium does not when the container holds a focusable element. The site's section nav (`src/routes/(site)/+layout.svelte`, the `overflow-y-auto` box around the left navigation) overflows on the Components landing, so in Firefox a keyboard user meets one extra stop before its first link. The walk's stop list is the design's; Firefox adds to it.

## The fix

`tabindex="-1"` on that scroll box. Every item in it is a link, so it still scrolls by keyboard as focus moves through them, in every engine. Nothing else changes.

## The check

The Components landing's walk in `firefox-light` and `firefox-dark`, failing today. When the fix lands, its ledger lines (`change: "022d"`) are removed, or the run turns red. The Chromium and WebKit walks must pass unchanged.
