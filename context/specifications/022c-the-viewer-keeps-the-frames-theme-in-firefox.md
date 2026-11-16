# 022c — The viewer keeps the frame's theme in Firefox

- **Status:** Built on its branch, awaiting the change review. Its 16 ledger lines are removed. Lane S.
- **Date:** 2026-11-15
- **Author:** `022`'s builder, for the design lead to open
- **Kind:** small change (AGENTS.md: a fix with no interface change, no new token or dependency, in one site component). No research memo and no spec review. Its check is already seen failing; the built change is reviewed by someone who did not write it (constitution §5).
- **Found by:** `022`'s local engine run, 2026-11-15: `tests/e2e/viewer.spec.ts`, "4. the frame's <html> is dark exactly when the page's is: at load, after the toggle, and back", for all 8 blocks, in `firefox-light`.

## The defect

A block page's viewer (`src/lib/preview/block-viewer.svelte`) copies the page's `dark` class onto its frame's `<html>` on the frame's `load` event, and again whenever the page's class changes. The test makes the frame's own head script choose the other theme (its storage blocked, its system preference inverted), so only the copy can make the two agree.

In Chromium the copy wins. In Firefox the frame keeps its own choice: with the page light, the frame is dark (a probe on `/components/hero/`, 2026-11-15: `frameDark: true`, parent light). The frame's own theme code runs after the viewer's copy there, and nothing copies again. A visitor sees a block in the other theme from the page whenever the frame's own reading differs.

## The fix

The viewer also copies when the frame's view is ready (`body[data-view-ready]`, set by the frame's layout on mount), and observes the frame's `<html>` `class` once it loads, copying back whenever the frame's own code changes it. The page's choice is the only one the frame shows. No prop changes.

## The check

`viewer.spec.ts` test 4, for every block, in `firefox-light` (and the dark projects, once run): failing today on its first poll. When the fix lands, its ledger lines (`change: "022c"`) are removed, or the run turns red.

## Landing notes

Built on its branch after `022b`, from `release/0.13.0` at `70336f4` (2026-11-16).

### Seen failing first

On `70336f4`, with the site built and the ledger in place, test 4 ran for all 8 blocks in `firefox-light` and `firefox-dark`. 13 of the 16 failed as their lines say, so the ledger marked them `expected`. Most failed on the first poll, "at load, the frame's theme is the page's"; `hero` (light), `app-shell` and `chat` (dark) failed on "after toggle 2, the frame's theme is the page's". 3 passed, and the ledger turned each red (`settings` dark, `chat` and `product-home` light): the fault is a race, and the copy sometimes wins.

### The cause, measured

A probe on the fixed build (`/components/hero/`, the test's own inversion, every write of the frame's `dark` class logged with its caller):

| Engine | Order of writes to the frame's `dark` |
| --- | --- |
| Chromium | head script `true` (17 ms, loading); the frame's theme store `true` (383 ms); the viewer's copy `false` at `load` (410 ms) |
| Firefox | head script `true` (1,098 ms, loading); the viewer's copy `false` at `load` (1,343 ms); **the frame's theme store `true` (1,523 ms)**; the viewer's copy `false` again, from the new observer (1,523 ms) |

The frame's theme store (`theme.svelte.ts`) sets the class in an effect when its module first runs. In Firefox that runs after the frame's `load`, so it undid the copy, and nothing copied again until the page's own class changed. Without the observer the frame stayed dark.

### The fix

In `src/lib/preview/block-viewer.svelte`, `watchFrame()` runs on the frame's `load` (and from `onMount` when the frame has already loaded). It copies the theme, as before, and then watches the frame's `<html>` `class` with a `MutationObserver`, copying the page's theme back whenever the frame's own code changes it. Each load disconnects the last frame's observer; unmounting disconnects both. A copy that matches what is there records no mutation, so the two observers cannot loop. No prop changes.

### Rulings during the build

1. **No separate copy at view-ready.** The stub asks for a copy when the frame's view is ready, and for the observer. The observer already catches any change after `load`, including the one at hydration, so a second hook would add nothing. The stub's `body[data-view-ready]` is also set only by the shell views' layout; the other views mark their `<main>`.
2. **The frame's own toggle.** In the shell views a person can press the theme toggle inside the frame. The observer puts the page's theme back at once, and the stored choice then reaches the page by its `storage` event, which copies it in (read from the code; no test presses the frame's own toggle inside the viewer). The page's choice is the only one the frame shows, as the stub says.

### Checks

- **`viewer.spec.ts` test 4**, `firefox-light` and `firefox-dark`, each test 3 times (`--repeat-each=3`): **48 passed, 0 failed.**
- **`viewer.spec.ts`**, all six projects: **234 passed** (39 per project).
- **`compositions.spec.ts`**, all six projects (its item pages show the viewer): **521 passed, 1 failed** on a 30 s timeout under load (load average 99), the 320 px reflow sweep in `firefox-light`, which passed when run alone (10 s). `022`'s notes list the reflow sweeps among the load timeouts.
- **Thumbnails.** Every block's and composition's hash reads the viewer's files, so 17 of 80 hashes moved. The pictures are taken of the views at their own addresses, and the viewer's copy draws nothing, so the manifest was rewritten with `thumbnails.ts --hash-only`. The pictures are checked in `022d`'s notes.
- The gate for all three changes is in `022d`'s notes.
