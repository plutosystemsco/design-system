# 022j — The editor's run keys, tested on every platform

- **Status:** built 2026-11-16; reviewed (`reviews/022ij-the-matrix-workflow-and-the-run-keys-pr-2026-11-16.md`, land), its findings answered there. Lane E (a test only).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one test). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the first `matrix` run, group 1 (`research/2026-11-16-the-first-matrix-run.md`): `code.spec.ts` E4 fails in all six projects.

## The defect

E4 presses `Control+Enter`, then `Meta+Enter`, and expects the example to have run twice. `code-editor` binds `Mod-Enter` and `Ctrl-Enter` (`code-editor.svelte:82–83`). CodeMirror reads `Mod` as Cmd on macOS and as Ctrl elsewhere. So on Linux and Windows the two run keys are one key, Ctrl+Enter, and `Meta+Enter` (the Super or Windows key) runs nothing. The test holds on macOS only. The item is right: its doc comment says "Ctrl Enter (and Cmd Enter)".

## The fix

1. E4's second press is `ControlOrMeta+Enter`, which Playwright sends as Cmd+Enter on macOS and as Ctrl+Enter elsewhere. On macOS the test is unchanged in what it presses. Elsewhere the two presses are one key, because CodeMirror folds `Mod-Enter` into `Ctrl-Enter`.
2. A new test beside E4 checks each binding on its own, the review's finding 1. Before the page loads, it tells the page it is on a Mac (`navigator.platform` reads `MacIntel`, through `page.addInitScript`), so CodeMirror reads `Mod` as Cmd. It presses `Control+Enter`, then `Meta+Enter`, and expects two runs and no new line. No browser job runs on macOS, so this is how CI checks the Mac binding.

## The check

1. E4, seen failing first in this session's Linux container ("Ran 1 time" where "Ran 2 times"), passes after the fix in `chromium-light` and `chromium-dark`, and in every project in the next `matrix` run.
2. The Mac-platform test, written after its fix, proven by mutation: with `{ key: "Mod-Enter", run }` deleted from `code-editor.svelte` and the site rebuilt, it fails ("Ran 1 time") while E4 still passes. Restored, it passes in `chromium-light` and `chromium-dark`.

## Landing notes

- **The scorecard:** no row moves (the run log's row for `022i`, `022j` and `022k`).
