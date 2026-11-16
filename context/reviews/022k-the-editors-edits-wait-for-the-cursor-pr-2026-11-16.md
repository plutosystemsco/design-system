# Review of 022k — the editor's scripted edits wait for the cursor (the built change)

Reviews the small change [`022k`](../specifications/022k-the-editors-edits-wait-for-the-cursor.md), E6's scripted edits in `tests/e2e/code.spec.ts`. Its research is group 3 of [the first matrix run](../research/2026-11-16-the-first-matrix-run.md). A last section re-checks three fixes made after [the 022i and 022j change review](022ij-the-matrix-workflow-and-the-run-keys-pr-2026-11-16.md). This reviewer wrote none of the specifications and none of the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree on `release/0.13.0` at `e24a04b`. For `022k`: the hunk at `tests/e2e/code.spec.ts:1366–1375` (+10 −1). For the re-check: the `022j.` test (`code.spec.ts:1054–1076`), the two `022i:` tests (`tests/unit/workflow.test.ts:164–200`) and the hash step (`.github/workflows/matrix.yml:196–198`). `bun.lock` is unchanged.
- **Re-ran:** Bun 1.4.4, Linux, 4 cores, Chromium 153 from the scratch browsers path, `E2E_PREBUILT=1` on `build/`. Mutations and probes ran in a detached worktree of `e24a04b` with the working-tree changes copied in, now removed.
  - E6 at full height, as changed, `chromium-light` and `chromium-dark`, `--repeat-each=3` → **6 passed**, exit 0.
  - E6 with the `022k` hunk reverted to the single press → **6 failed**, exit 1: "python after the edits" three times, "svelte after the edits" three times.
  - The whole of `code.spec.ts` in `chromium-light` → **39 passed, 1 failed**. The failure is E7's Python p95, 23.7 ms over 12 ms: run 1's group 2, not this change.
  - An event log of the unfixed edits (window listeners, and a wrapper on the view's `update`), finding 1. And a probe of which editors bind `Ctrl-End`.
  - The changed E6 with a count of presses → 1 or 2 presses for each of 18 edits. Press once, then `expect.poll` on the same condition → **6 passed** (finding 2).
  - The changed E6 with `ControlOrMeta+Home` in the loop, a cursor that never reaches the end → **failed** at the `toPass`, after 10 s, "Expected: true, Received: false".
  - `bun test tests/unit/workflow.test.ts` → **21 pass, 0 fail**, 283 expects. The re-check's own runs are in its section.
  - `bun --bun prettier --check` on the three changed files, and `bun run lint` → clean, exit 0. `svelte-check` in the worktree: no error in either changed test file (its other errors are the worktree's missing route types).
- **Not re-run:** GitHub Actions, Firefox, WebKit and macOS. The specification's last check, E6 in `webkit-*`, is the next `matrix` run.

## Acceptance criteria against evidence

A small change states its check, not counted criteria. Its claims are taken one at a time.

1. The defect is real: E6's edits fail at full height — **met, EXECUTED.** Unfixed, 6 of 6 fail here, at "after the edits". The polled line is the editor's extra last line, which the block lacks.
2. The cause: the click's own selection lands after `ControlOrMeta+End`, and the typed text goes where the click put it — **not met** (finding 1).
   - EXECUTED: the click's selection (`select.pointer`) is in the state 14 to 15 ms before the End keydown, for each of the three specimens.
   - EXECUTED: the agreement page's editor binds no `Ctrl-End`. The End keydown reaches the window with `defaultPrevented` false. On the code-editor page, whose editor has `pythonSetup()`'s `defaultKeymap`, it is true. READ: the page's `base` is `lineNumbers`, `history`, `closeBrackets` and `bracketMatching` (`src/routes/(view)/view/code-agreement/+page.svelte:20–25`). `code-editor.svelte:80–85` binds only the two run keys.
   - EXECUTED: so the key is the browser's own caret move. CodeMirror reads it from the DOM 5 to 17 ms later, as a `select` update. Unfixed, the Enter keydown came 6.5 ms before that read. The document then gained two characters, and its tail became `…3j)\nvalue = 1\n`. The text went in at the end. The Enter, read while the state lagged, gave two line breaks.
   - EXECUTED: the unfixed edits pass when the test waits 300 ms after the press. Nothing in the click overrides the key. The lag is the whole defect.
3. The fix presses until the cursor is at the end, then types; nothing in the item changes — **met, READ and EXECUTED.** The loop reads `state.selection.main.head === state.doc.length` through `window.agreement.view('full')`. It polls the same state the next key is read against, so it closes the real race too. No file under `src/` changes.
4. The loop cannot hide an editor that never reaches the end — **met, EXECUTED.** With Home pressed in place of End, the `toPass` fails after 10 s. Its message names no specimen (finding 3).
5. The check: 6 of 6 after the fix, in `chromium-light` and `chromium-dark`, three repeats each — **met, EXECUTED.** Seen failing first — **met, EXECUTED**, 6 of 6 failing with the hunk reverted.
6. The check in `webkit-*` — **not yet met: it has not run.** INFERRED: Linux WebKit also moves the caret itself on Ctrl+End, so the same wait applies.
7. No other test in `code.spec.ts` clicks and then presses a key the same way — **met, READ and EXECUTED.**
   - E4 and the `022j.` test focus the editor and do not click. Their editor has `defaultKeymap`, so CodeMirror runs the move inside the keydown, before the next key.
   - L1 (`code.spec.ts:713–717`) clicks, presses `ControlOrMeta+End` and Enter, and types `<div>`. It has the same shape, but its fixture has `defaultKeymap` (`src/lib/site/examples/code-languages/variants.svelte:37`). Its check, `toContainText("<div></div>")`, does not depend on where the text goes.
   - The windowed E6 case presses no keys; it dispatches. E7 sets its selection by `dispatch` and focuses by `v.focus()`, then types. Neither moves the caret through the browser.
8. Scorecard — **met, READ.** The run log's row for `022i`, `022j` and `022k` says no row moves. No item, page, token or rendered text changes. INFERRED: right.

## Findings, most severe first

1. **Medium: the recorded cause is not what a fresh probe shows** (`022k`, "The defect"; `code.spec.ts:1366–1367`).
   The specification labels as EXECUTED that the click's selection can land after the key. The probe shows the click's selection lands first. The real lag is CodeMirror reading the browser's own caret move, because this editor binds no `Ctrl-End`. "The typed text goes in the wrong place" is also not what was seen: it went in at the end, with an extra line break. And here the race is lost 6 times of 6, not "sometimes".
   Failure: a later reader trusts the record. They look for a late pointer selection, or add a wait after the click, which does not help. They do not see that an editor with `defaultKeymap` (E4, L1) is not exposed.
   Fix: in "The defect", replace the first three sentences with: "E6's scripted edits click into the full-height editor, press `ControlOrMeta+End` and type at once. The agreement page's editor binds no `Ctrl-End` (its `base` has no `defaultKeymap`), so the browser moves the caret itself, and CodeMirror reads the move from the DOM 5 to 17 ms later. The first typed key, an Enter, arrives before that read. EXECUTED here, by an event log: the click's selection is in the state 14 ms before the key; the Enter's keydown comes 6.5 ms before CodeMirror reads the move; the Enter then adds two line breaks, so the text ends in a newline." Keep the trailing-newline sentence and the probe's figures (552 of 960, 328 of 586): they are the state read straight after the key. In the INFERRED sentence, say this container loses the race 6 of 6. Replace the code comment with: "022k: this editor binds no Ctrl-End, so the browser moves the caret, and CodeMirror reads the move a few milliseconds later. Type only once the editor's own cursor is at the end." Add a landing note that group 3's mechanism in the research memo is corrected here; the memo is not edited, and the run-2 memo can record it.
2. **Low: the loop presses again where waiting is enough** (`code.spec.ts:1368–1375`).
   The second press is a no-op once the caret is at the end, so it does no harm. But a press dropped by the editor would now pass unseen. EXECUTED: one press, then `expect.poll` on the same condition, passes 6 of 6.
   Fix (optional): `await page.keyboard.press("ControlOrMeta+End");` then `await expect.poll(() => page.evaluate(…), { message: \`${id}: the cursor at the end\`, timeout: 10_000 }).toBe(true);`. Say in "The fix" that the test waits for the editor to read the move. If the loop stays, say why a second press is wanted.
3. **Low: the loop's failure names no specimen** (`code.spec.ts:1370–1374`).
   EXECUTED: with the cursor held from the end, the report reads only "Expected: true, Received: false".
   Fix: `expect(await page.evaluate(…), \`${id}: the cursor at the end after Ctrl+End\`).toBe(true);`, or finding 2's `message`.
4. **Low: a note for the item, not a fault in this change** (`022k`, "The defect", last sentence).
   INFERRED: an editor built from `CodeEditor` without `defaultKeymap` leaves caret keys to the browser. An Enter pressed within a few milliseconds of such a move adds two line breaks, as here. That is faster than a person types. It is not shown to reach a user, so no ledger line is owed. The specification's "the item is right" holds for a lone Enter, which is what it tested.
   Fix: add one sentence to "The defect": "An editor with `defaultKeymap` (`pythonSetup()`, the languages fixture) moves the caret inside the keydown and is not exposed; E4 and L1 are such editors."

## Constitution checks

- §4.1 source, not a package: no installed file changes. Met.
- §4.3 tokens are the one source: no colour or size. Met.
- §4.4 accessible by default, and proven: E6 is a check of the editor's colours against the block's. It runs again on Linux. Met.
- §4.5 every input pinned: `bun.lock` unchanged. Met.
- §4.6 dependencies named and pinned: none added. Met.
- §5, the small-change kind: one test, no interface, no token, no dependency. Its check was seen failing first (EXECUTED here, too). Met. Its research claim is corrected by finding 1.
- §6: nothing committed or pushed; no code copied; no interface change, so no changelog line. Met.

## Verdict

Does not land yet: finding 1 stands, a correction to the specification's recorded cause and the code comment; the test change itself is sound, and findings 2 to 4 are write-ins.

## The 022ij review's fixes, re-checked

- **Finding 1, closed.** EXECUTED, by cutting one binding at a time out of the served chunk (`page.route` on `C1P29TFK.js`), in `chromium-light`. Unmutated, the `022j.` test and E4 pass. With `Mod-Enter` cut, `022j.` fails ("Ran 1 time" for `/Ran 2 times/`) and E4 passes. With `Ctrl-Enter` cut, `022j.` fails ("Ran 0 times" for `/Ran 1 time\b/`) and E4 passes. INFERRED, not run: the `Navigator.prototype.platform` getter also takes in Firefox and WebKit.
- **Finding 4, closed, with one gap.** EXECUTED: on `e24a04b`'s workflow both new tests fail (2 fail, 19 pass). On the change, 21 pass. With only the hash step removed, or moved after `sr:setup`, the voiceover test fails (1 fail, 20 pass). The gap: the `checks` test does not assert the `.svelte-kit/output/server/manifest.js` check, which the finding named and the test-jobs test beside it does (`workflow.test.ts:151`). Fix: add `x.includes("test -f .svelte-kit/output/server/manifest.js")` to its `findIndex`. Its hash pattern takes any 64 hex digits, so a wrong hash passes the unit test; the step itself then fails closed.
- **Finding 7, closed.** EXECUTED: the exact line from `matrix.yml`, under `bash -e`, with Perl `shasum` 6.04 (the Digest::SHA script that macOS ships as `/usr/bin/shasum`). The darwin-arm64 binary, fetched again here by `install.js` (45,568,216 bytes, Mach-O arm64) → "OK", exit 0. The Linux binary in its place, one byte changed, or no file → exit 1. One space in place of two → "no properly formatted SHA checksum lines found", exit 1. So `-c` reads the two-space line from standard input, and the pipeline's status is `shasum`'s, with no `pipefail` needed. INFERRED, not run on `macos-26`: the image has `shasum`, as every macOS does, and is arm64; an x64 runner would fail here, closed.

## Disposition

By the design lead, the author, 2026-11-16.

1. **Fixed.** "The defect" and the code comment take this review's mechanism and wording. The research memo had not landed, so its group 3 is corrected in place, and `022k`'s landing notes say so.
2. **Fixed.** One press, then `expect.poll` on the editor's cursor. "The fix" says a dropped press now fails the wait.
3. **Fixed.** The poll's message names the specimen: "`${id}`: the cursor at the end".
4. **Fixed.** "The defect" names the editors that are not exposed, and why no ledger line is owed.
- **The 022ij re-check's gap (finding 4):** fixed. The `checks` test also asserts the server manifest's `test -f`.

After the fixes: E6 at full height, E4 and the Mac-platform test, `chromium-light` and `chromium-dark`, three repeats each, 18 passed; `workflow.test.ts` 21 pass.

Closing verdict: lands.
