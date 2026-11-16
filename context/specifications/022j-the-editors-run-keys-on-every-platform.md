# 022j — The editor's run keys, tested on every platform

- **Status:** open, 2026-11-16. Lane E (a test only).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one test). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the first `matrix` run, group 1 (`research/2026-11-16-the-first-matrix-run.md`): `code.spec.ts` E4 fails in all six projects.

## The defect

E4 presses `Control+Enter`, then `Meta+Enter`, and expects the example to have run twice. `code-editor` binds `Mod-Enter` and `Ctrl-Enter` (`code-editor.svelte:82–83`). CodeMirror reads `Mod` as Cmd on macOS and as Ctrl elsewhere. So on Linux and Windows the two run keys are one key, Ctrl+Enter, and `Meta+Enter` (the Super or Windows key) runs nothing. The test holds on macOS only. The item is right: its doc comment says "Ctrl Enter (and Cmd Enter)".

## The fix

The second press is `ControlOrMeta+Enter`, which Playwright sends as Cmd+Enter on macOS and as Ctrl+Enter elsewhere. That is the `Mod-Enter` binding on every platform. The first press stays `Control+Enter`, the binding beside it. On macOS the test is unchanged in what it presses. Elsewhere it checks that `Mod-Enter` runs, which it could not before.

## The check

E4, seen failing first in this session's Linux container ("Ran 1 time" where "Ran 2 times"), passes after the fix in `chromium-light` and `chromium-dark`, and in every project in the next `matrix` run.
