# 022d — The section nav is not a Tab stop in Firefox

- **Status:** Built on its branch, awaiting the change review. Its 2 ledger lines are removed. Lane S.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in the site's layout). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `keyboard.spec.ts`, "at 1280 × 900 › the Components landing: Tab visits its 201 stops (193 before the merge with `release/0.13.0`) in order, each with the ring unclipped", in `firefox-light`: stop 9 is `nav:Components pages`, not `a:Components`.

## The defect

Firefox makes a scroll container that overflows a Tab stop of its own, even when everything inside it is focusable; Chromium does not when the container holds a focusable element. The site's section nav (`src/routes/(site)/+layout.svelte`, the `overflow-y-auto` box around the left navigation) overflows on the Components landing, so in Firefox a keyboard user meets one extra stop before its first link. The walk's stop list is the design's; Firefox adds to it.

## The fix

`tabindex="-1"` on that scroll box. Every item in it is a link, so it still scrolls by keyboard as focus moves through them, in every engine. Nothing else changes.

## The check

The Components landing's walk in `firefox-light` and `firefox-dark`, failing today. When the fix lands, its ledger lines (`change: "022d"`) are removed, or the run turns red. The Chromium and WebKit walks must pass unchanged.

## Landing notes

Built on its branch after `022b` and `022c`, from `release/0.13.0` at `70336f4` (2026-11-16).

### Seen failing first

On `70336f4`, with the site built and the ledger in place, the Components landing's walk ran in `firefox-light` and `firefox-dark`. Both failed as their lines say, so the ledger marked them `expected`:

```
Error: stop 9
expect(received).toBe(expected) // Object.is equality
```

with `nav:Components pages` received where `a:Components` was expected.

### The fix

`tabindex="-1"` on the section nav's scroll box. That box is the `<nav>` itself: `+layout.svelte` passes its `overflow-y-auto` class to `SideNav`, so the attribute goes on the `<nav>` in `src/lib/site/chrome/side-nav.svelte`, with a comment saying why. The nav holds only links, and on component pages the filter, so focus moving through them still scrolls it in every engine. Nothing else changes.

### Rulings during the build

1. **On the `<nav>` in `side-nav.svelte`, not in `+layout.svelte`.** The stub names the layout's box; the box is the component's root, and the layout cannot set the attribute without a new prop. The menu sheet's copy of the nav gets the attribute too. There the sheet scrolls, not the nav, so the attribute changes nothing for Tab. `tabindex="-1"` keeps the element out of the Tab order and focusable only by script, the site's precedent for `<main id="main">`.

### Checks

- **`keyboard.spec.ts`**, all six projects: the Components landing's walk passed in all six, Firefox's two included (201 stops). **776 passed, 4 failed.** The 4 are macOS WebKit's (`webkit-light` and `webkit-dark`): "End scrolls the log's region to its end…" and "Enter on the log's button returns to the end…". They fail the same way with this change taken out and the site rebuilt (3 of the 4 failed in that run; the fourth passes or fails by turns), so they are not this change's. They are not in `tests/e2e/macos-webkit.ts`; see the findings. `022e`'s two lines failed as their lines say.
- **`nav.spec.ts`, `navigation.spec.ts` and `forced-colors.spec.ts`**, all six projects: **261 passed, 27 skipped** (`forced-colors` runs in the light projects only), 0 failed.
- **axe** on `/start/`, `/components/`, `/components/button/` and `/components/hero/`, at 360, 768 and 1280, all six projects: **71 passed, 1 failed**: `/components/` at 360 in `firefox-light`, which passed when run alone (8.5 s). At 360 the section nav is hidden, so this change cannot reach it; it was the machine's load.

### The gate, for `022b`, `022c` and `022d`

On the tree with all three changes, the machine's load average between 35 and 99:

- **`bun run check`:** 0 errors, 0 warnings, 2,359 files. **lint:** clean.
- **Unit** (`bun test ./tests/unit --timeout 120000`): **1,674 pass, 2 skip, 0 fail**, of 1,676. An earlier run, before the thumbnail manifest was rewritten, failed "each recomputed hash equals the manifest's" and the streaming budget; the first was real and is fixed (below), the second is timing and passed on the re-run.
- **Thumbnails.** The site's layout is in every example item's hash, through `side-nav.svelte`, so 62 of 80 hashes moved, and the manifest was rewritten with `thumbnails.ts --hash-only`. Each of the three commits rewrites the hashes its own change moved (`022b` 62, `022c` 17, `022d` 62). Then, on a fresh build of the three, `bun scripts/site/thumbnails.ts --no-build` made **158 pictures in 182 s, and `git status` showed none changed**, as in `024b`.
- **`release-check --before-ci`:** exit 0. It skips the ledger, the matrix run, the runner's LCP figures and the cost run, and names each.
- **The full release check:** exit 1, as it must be. **The ledger holds 8 open faults, down from 27 by these 19 lines** (`022b` 1, `022c` 16, `022d` 2): `022a`'s 4, `022e`'s 2 and `022f`'s 2 remain. GitHub has no `matrix` run for HEAD ("workflow matrix.yml not found on the default branch"), 9 page templates have no runner LCP figure, and the cost run waits on the release machine.
- **The touched specs in all six projects:** `forced-colors.spec.ts` (`022b`), `viewer.spec.ts` and `compositions.spec.ts` (`022c`), `keyboard.spec.ts`, `nav.spec.ts` and `navigation.spec.ts` (`022d`), as each change's Checks say.
- **The scorecard** is the design lead's to re-run when these land (AGENTS.md). These three change no registry item; it was not re-run here.

### Findings for later

- **macOS WebKit's message-log tests.** `keyboard.spec.ts`'s two message-log tests fail in local macOS WebKit before and after this change: after ArrowUp the region is still at its end, and the "Scroll to end" button is not visible. `tests/e2e/macos-webkit.ts` does not list them. Linux WebKit in push B's run will show whether they are a platform default (and join that list) or a fault (and get a ledger line).
