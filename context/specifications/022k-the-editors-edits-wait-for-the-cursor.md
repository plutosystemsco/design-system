# 022k — The editor's scripted edits wait for the cursor

- **Status:** built 2026-11-16; reviewed (`reviews/022k-the-editors-edits-wait-for-the-cursor-pr-2026-11-16.md`), its findings fixed. Lane E (a test only).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one test). No research memo and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the first `matrix` run, group 3 (`research/2026-11-16-the-first-matrix-run.md`): `code.spec.ts` E6 at full height fails in `chromium-*` and `webkit-*`.

## The defect

E6's scripted edits click into the full-height editor, press `ControlOrMeta+End` and type at once. The agreement page's editor binds no `Ctrl-End` (its `base` has no `defaultKeymap`), so the browser moves the caret itself, and CodeMirror reads the move from the DOM 5 to 17 ms later. The first typed key, an Enter, arrives before that read. EXECUTED by the change review, by an event log: the click's selection is in the state 14 ms before the key; the Enter's keydown comes 6.5 ms before CodeMirror reads the move; the Enter then adds two line breaks, so the text ends in a newline. Read straight after the key, the editor's cursor is still where the click put it (EXECUTED by probe: the Svelte specimen at 552 of 960, the Markdown specimen at 328 of 586).

The block drops a trailing newline by design (`use-highlighted-code.svelte.ts`: "A trailing newline would render as an extra empty line"). So one editor line has no block line, and the poll times out. A lone Enter at the end inserts one line, as it should.

INFERRED: the race is lost more often on a slower machine. This container loses it 6 times of 6, and the two-core CI runners lose it too; the machine that wrote the test did not. An editor with `defaultKeymap` (`pythonSetup()`, the languages fixture) moves the caret inside the keydown and is not exposed; E4 and L1 are such editors. An editor built from `CodeEditor` without `defaultKeymap` leaves caret keys to the browser. An Enter pressed within a few milliseconds of such a move adds two line breaks, which is faster than a person types, so no ledger line is owed.

## The fix

The test presses `ControlOrMeta+End` once, then waits, for at most 10 s, until the editor's own cursor is at the end of its text, read through the view the test already uses (`window.agreement.view('full')`). Only then does it type. The wait names the specimen when it fails. A press the editor dropped would fail the wait, not pass unseen. Nothing in the item changes.

## The check

E6 at full height, seen failing first in this container on `e24a04b` (before and after the lane-I merge; `024e`'s Landing notes, "The merge"), and by the change review on a copy without the fix (6 of 6 fail), passes after the fix: 6 of 6 in `chromium-light` and `chromium-dark`, three repeats each. With Home pressed in place of End, the wait fails after 10 s (the change review). The next `matrix` run shows it in `webkit-*`.

## Landing notes

- **The scorecard:** no row moves (the run log's row for `022i`, `022j` and `022k`).
- **The cause, corrected at the review.** The first draft said the click's selection landed after the key. The change review's event log showed the browser's own caret move, read late. The research memo's group 3 was corrected before it landed.
