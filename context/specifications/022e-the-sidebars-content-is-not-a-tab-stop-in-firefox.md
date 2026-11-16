# 022e — The sidebar's content is not a Tab stop in Firefox, when it holds a focusable item

- **Status:** landed on `release/0.13.0` 2026-11-16, with `022a`, `022e` and `024e` in one merge. The change review (`reviews/022ae-024e-lane-i-small-changes-pr-2026-11-16.md`) said land; its findings are dispositioned there. Its two ledger lines are removed. Lane I. Its follow-up, finding 3 of the review, is queued as `022h`.
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

## Landing notes

Built 2026-11-16 by a lane-I builder, after `024e` and `022a` in the same worktree, one commit. The owner was asleep; no question was asked.

### The fix

`sidebar-content.svelte` reads its own contents after mount, and again on every change a `MutationObserver` sees in its subtree (children added or removed, and `href`, `disabled`, `type`, `tabindex` and `contenteditable` changing). While the box holds an element that takes a Tab stop (a link, an enabled control, a `summary`, an editable region, or a `tabindex` of 0 or more, each unless a negative `tabindex` removes it), the box has `tabindex="-1"`. Otherwise it has `tabindex="0"`. An app's own `tabindex` wins, since the attribute comes before the spread. Before mount it has none, as before. No prop, slot or class changes. The changelog's 0.13.0 entry has a `sidebar` bullet. Prior art: `table`'s labelled region and `code-block`'s `pre`, which take `tabindex="0"` so a keyboard can scroll them, and axe's `scrollable-region-focusable`.

### A builder's ruling: a text-only box takes `tabindex="0"`, not no attribute

The ruling above says the box "stays focusable, as Firefox and Chromium both make it", and the fix said to remove the attribute. The new check, written first and run on the unchanged item (the build of `1a116a4`), showed that leaving no attribute does not keep it focusable everywhere:

- in `chromium-light` and `firefox-light` the text-only box was a Tab stop and the arrow keys scrolled it, but **axe reported `scrollable-region-focusable`**: axe reads the DOM, not the engine's focusable-scroller rule;
- in `webkit-light` the box was **not a Tab stop at all** ("expect(locator).toBeFocused() failed … Received: inactive"): WebKit has no focusable-scroller rule.

So the box takes `tabindex="0"` when it holds no stop. That keeps the ruling's aim (WCAG 2.1.1: the keyboard can scroll it) in every engine, and clears axe. A text-only box that does not overflow is also a stop; this follows `code-block`'s precedent, whose `pre` is a stop whether or not it scrolls. Reading the overflow too would need a `ResizeObserver` beside the `MutationObserver`; the design lead may ask for it at the change review.

### Seen failing first

1. **The Firefox walk**, `keyboard.spec.ts` "block views at 1280 › /view/app-shell/sidebar-icon/: 12 stops …", in `firefox-light` and `firefox-dark`: failed as its ledger lines said (stop 5, `div:workspace …`) in `022`'s local run, and again in this build's `022a` run, in both projects.
2. **The new test**, "behaviours › 022e. a sidebar whose content holds only text and overflows is one Tab stop, the arrow keys scroll it, and axe finds no scrollable-region-focusable" (on `/components/sidebar/`, its keyboard fixture's rows replaced by sixteen paragraphs of text): on the unchanged item it failed in all three engines, as above. **Against a fix that sets `tabindex="-1"` unconditionally** (built and run as the stub asks) it failed in `chromium-light`, `firefox-light` and `webkit-light` on `expect(content).not.toHaveAttribute("tabindex", "-1")`, "Received: \"-1\"". In the same run the Firefox walk passed, and so reported "Expected to fail, but passed" against its ledger line.

### After the fix

- The new test and the sidebar-icon walk pass in all six projects (12 of 12). The Chromium and WebKit walks pass unchanged.
- **The ledger:** the two `022e` lines (`firefox-light`, `firefox-dark`) are removed from `tests/fault-ledger.ts`.
- **One other test's expectation changes, as the fix requires:** `navigation.spec.ts` N5 read "a scroller with no stop of its own" as `tabindex` absent (`005`). The box holds rows there, so it now reads `tabindex="-1"`, which is still no stop of its own. It failed in all six projects on "Received: \"-1\"" until then.
- `keyboard.spec.ts`, `blocks.spec.ts`, `navigation.spec.ts` and `primitives.spec.ts` (every spec that walks or measures a sidebar) in all six projects, 4 workers, load 40 to 80 on 10 cores: 1,359 passed, 15 failed. Of the 15: N5 in all six (above, fixed in the test); `022d`'s ledgered walk in both Firefox projects, failing as its line says; five load timeouts in `firefox-light` (`blocks` 24 to 26, `primitives`' two 30 s page sweeps); the new test once in `webkit-light`, where an ArrowDown that came with the focus did not scroll (the test now presses ArrowDown until the box moves, at most 10 s); and `message-log`'s two WebKit keyboard-scroll tests (see `022a`'s notes). Re-run with 2 workers in all six projects (N5, the new test, `blocks` 24 to 26, the two `primitives` sweeps, the `message-log` pair): 51 passed, 3 failed, all `message-log` in WebKit, which no change of this build reaches.
- `axe.spec.ts` for the pages that hold a sidebar (`-g "sidebar|app-shell|chat|settings|product-home"`), all six projects: **420 passed**, 0 failed.
- **The cost:** the cost unit test named `sidebar` and `app-shell` size-stale. `bun run cost --sizes-only` rewrote them: `sidebar` 45,467 → 45,687 B of JS (brotli 39,709 → 39,791), `app-shell` 75,267 → 75,531 (63,546 → 63,718); CSS unchanged. The observer and the selector are the +220 B. Runtime figures are kept; `sidebar` is an interactive item, so its change review runs `bun run cost --only sidebar` (`025`'s ruling (b)).
- `static/r/` and `static/v0.13.0/r/` regenerated by the build (`sidebar.json`); the thumbnails' manifest rewritten with `--hash-only` (2 hashes; no picture changed).
- **The scorecard** is not re-run for this change alone; it follows the batch's re-run, as `024e`'s does.

### The merge (2026-11-16)

Landed with `022a`, `022e` and `024e` in one merge. Its conflicts, figures and the one test it broke are in [`024e`'s Landing notes](024e-empty-code-loads-no-grammar.md), "The merge".
