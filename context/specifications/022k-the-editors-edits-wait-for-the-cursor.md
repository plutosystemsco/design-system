# 022k — The editor's scripted edits wait for the cursor

- **Status:** built 2026-11-16; waits for its change review. Lane E (a test only).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one test). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the first `matrix` run, group 3 (`research/2026-11-16-the-first-matrix-run.md`): `code.spec.ts` E6 at full height fails in `chromium-*` and `webkit-*`.

## The defect

E6's scripted edits click into the full-height editor, press `ControlOrMeta+End` at once, and type. Sometimes the click's own selection lands after the key. The cursor then stays where the click put it, and the typed text goes in the wrong place. EXECUTED in this session's Linux container, by probe: the Svelte specimen's cursor stayed at 552 of 960 after the key, and the Markdown specimen's at 328 of 586. The editor's text then ends in a newline, which the block drops by design (`use-highlighted-code.svelte.ts`: "A trailing newline would render as an extra empty line"). So one editor line has no block line, and the poll times out. A lone Enter at the end inserts one line, as it should: the item is right.

The race is lost more often on a slower machine. INFERRED: that is why the two-core CI runners and this container fail it, and the machine that wrote the test did not.

## The fix

The test presses `ControlOrMeta+End` until the editor's cursor is at the end of its text, inside `expect(…).toPass()`, for at most 10 s, and only then types. It reads the cursor through the view the test already uses (`window.agreement.view('full')`). Nothing in the item changes.

## The check

E6 at full height, seen failing first in this container on `e24a04b` (before and after the lane-I merge; `024e`'s Landing notes, "The merge"), passes after the fix: 6 of 6 in `chromium-light` and `chromium-dark`, three repeats each. The next `matrix` run shows it in `webkit-*`.

## Landing notes

- **The scorecard:** no row moves (the run log's row for `022i`, `022j` and `022k`).
