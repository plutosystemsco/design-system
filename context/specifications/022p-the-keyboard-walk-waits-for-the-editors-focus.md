# 022p — The keyboard walk waits for the editor's focus mark

- **Status:** built 2026-11-16; change review (`reviews/020c-022p-two-test-measures-pr-2026-11-16.md`): lands, finding 4 written in. Lane E (a test only).
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one test helper). Its check is seen failing first. The built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the `matrix` runs 3 and 4: `keyboard.spec.ts:500`, "code-editor: the keyboard fixture holds 3 stops, each the expected element with the ring", flaky in `chromium-*` (`research/2026-11-16-the-fourth-matrix-run.md`, §2).

## The defect

`expectRingOutline` reads the ring on `.cm-editor`, which draws it once CodeMirror marks the editor `cm-focused`. CodeMirror sets the mark from a 10 ms timer after the focus event (`@codemirror/view` 6.43.15, `updateForFocusChange`), which can land after two frames (the change review, finding 4). The helper waits exactly two animation frames for it. EXECUTED in this session, Chromium 156: the test failed 3 of 6 runs, at the textbox stop, reading `outline-style: none` where `solid`. The ring appears; the test read too early.

## The fix

The helper waits for the `cm-focused` mark, one frame at a time, up to 60 frames (about a second), then reads the ring. An editor that is never marked focused still fails the ring check, so a real fault is still caught.

## The check

Seen failing first: 3 of 6 in `chromium-light` and `chromium-dark` on the unchanged helper. After: `code-editor` and `code-languages` fixtures, `--repeat-each=8`, `chromium-light` and `chromium-dark`, 32 of 32.
