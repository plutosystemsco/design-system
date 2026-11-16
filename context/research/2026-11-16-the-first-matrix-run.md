# The first matrix run: what failed, and why

<<<<<<< HEAD
- **Status:** complete for run 1. Run 2, on the lane-I merge, is compared in a later memo.
=======
- **Status:** complete for runs 1 and 2 (§4), but run 2's two NVDA jobs, still running when this was written.
>>>>>>> release/0.13.0
- **Date:** 2026-11-16
- **Author:** the design lead
- **Question:** `022`'s `matrix` workflow ran for the first time on GitHub (push B). What failed, and which failures are faults in Kuiper, which are faults in the tests, and which are faults in the workflow?
- **What it blocks:** the small changes that empty the run's failures. The release check needs a green `matrix` push run of HEAD (`022` decision 19).

## How to read this memo

Every claim carries a label.

- **READ:** a job log of run [43881168194](https://github.com/plutosystemsco/design-system/actions/runs/43881168194) says so, read 2026-11-16 through the GitHub connector, or a file of this repository at `e24a04b` says so. The run's report artifact could not be downloaded: this session's network refuses the artifact storage host.
- **EXECUTED:** run in this session's Linux container, Chromium 153.
- **INFERRED:** our reasoning.

The run is on `48c85ca`, before the lane-I merge. A _project_ is one engine and scheme, such as `webkit-dark`. A _shard_ is one eighth of an engine's tests, run on its own runner.

## 1. The run

- **READ:** 33 jobs; 19 failed or were cancelled. `build` and `report` passed, and so did 13 of the 24 browser shards (Chromium 4 of 8, Firefox 6 of 8, WebKit 2 of 8).
- **READ:** `checks` ran the unit tests (1,856 pass, 2 skip, 0 fail), `check`, `lint` and the literal lint, all green, then failed in `test:smoke`.
- **READ:** CI retries a failed browser test once, and `failOnFlakyTests` turns a pass on retry into a failure (`playwright.config.ts`). Every browser failure below failed both times, but one, marked flaky.
- **READ:** the ledger's one fault, `022f` (E7 in both Firefox projects), failed as its lines expect. No other failure is ledgered. None of the WebKit failures is in `tests/e2e/macos-webkit.ts`.

## 2. The failures, grouped by cause

Most widespread first. "Kind" says where the fix goes: **test** (the test assumes something untrue on Linux), **workflow** (`.github/workflows/matrix.yml`), **budget** (a figure measured on another machine), or **item** (Kuiper's source).

| # | Tests | Projects | Error (READ) | Kind and cause |
|---|---|---|---|---|
| 1 | `code.spec.ts` E4, the run keys | all six | "Ran 1 time" where "Ran 2 times" is expected, after `Meta+Enter` | **Test.** READ: the editor binds `Mod-Enter` and `Ctrl-Enter` (`code-editor.svelte:82–83`); on Linux `Mod` is Ctrl, so `Meta+Enter` runs nothing. The test's "2 of 2 run keys" holds on macOS only. EXECUTED: it fails the same way in this container. |
| 2 | `code.spec.ts` E7, the editor's budgets | `chromium-*`, `webkit-*` | Python keystroke p95 over 12 ms: Chromium 12.9 to 22.4, WebKit 23 to 44 | **Budget.** INFERRED: the two-core CI runner is slower than the machine that set 12 ms. Firefox misses it too, and is ledgered (`022f`). |
| 3 | `code.spec.ts` E6 at full height | `chromium-*`, `webkit-*` | "python after the edits" (or "svelte"): an editor line the block lacks, a 15 s poll | **Test.** EXECUTED in this container, by probe and by `022k`'s change review: the test presses `ControlOrMeta+End` and types at once. This editor binds no `Ctrl-End`, so the browser moves the caret, and CodeMirror reads the move 5 to 17 ms later. The first typed Enter arrives before that read and adds two line breaks, so the text ends in a newline, which the block drops. A lone Enter at the end inserts one line, as it should. INFERRED: a race the slower Linux runners lose. |
| 4 | NVDA's screen-reader suite, 21 tests | `nvda` with Chromium; with Firefox, 19 failed before the job was cancelled at its 60-minute limit | e.g. toast S9 "Success: Project deleted was not spoken"; tooltip "the tooltip never opened", every phrase empty. Eight are the same check, "page behind … never reached in ten steps" | **Harness, probably.** INFERRED: 21 tests across 14 items, with empty speech, read as speech capture or timing on the Windows runner, not 21 faults. The Chromium job took 58 of its 60 minutes. |
| 5 | `toast.spec.ts` 64a, 64c, 64d | `webkit-*` | `toBeFocused()` "inactive" after `focus()` then `Shift+Tab` | **Test or engine.** INFERRED: Linux WebKit drops a key pressed just after a script's `focus()`, the `key-after-focus` cause `macos-webkit.ts` records for macOS. If so, it is in WebKit on both platforms, not macOS alone. |
| 6 | `pagination.spec.ts` 15a and 18; `search-field.spec.ts` 28 | `webkit-*` | 15a: "Page 5" where "Page 1"; 18: "Page 12" focused where `body`; 28: the bare input's cancel button shows | **Test.** INFERRED: these tests encode macOS WebKit through `onlyIn("webkit", …)` and `adaptsIn`. Linux WebKit focuses a button on click, as Chromium and Firefox do, and draws no separate cancel button on a bare search input. The tests should branch on platform, not engine. |
| 7 | `upgrade.spec.ts` "020b at 320" | `chromium-*` | two `pluto:field-…` code tokens 290 px wide in a 288 px column | **Item (site page).** INFERRED: Chromium's Linux monospace metrics make two unbreakable tokens 2 px too wide. Firefox and WebKit pass. |
| 8 | `perf.spec.ts` "024 paint": `/start/`, `/components/native-select/`, `/changelog/` | `perf` | CLS 0.048, 0.088 and 0.083, over 0.02 to 0.022, the same on every run | **Budget or item.** INFERRED: a layout shift that the budget machine did not see, likely a font swap on Linux. `024c` fixed `native-select`'s shift on macOS; it returns here. |
| 9 | `chat.spec.ts` L1, the released log | `webkit-light`; `webkit-dark` flaky | `scrollTop` 410 where 413 to 415 | **Item or engine.** INFERRED: while released, a click on the stream button still moves the log 3 to 5 px in WebKit. Scroll anchoring, or a scroll still settling. |
| 10 | `tests/smoke/site-add.test.ts` | `checks` | "build/ is missing: run `bun run build` first" | **Workflow.** READ: the `checks` job neither builds the site nor downloads the `site` artifact (`matrix.yml`, `checks`). |
| 11 | `sr:setup --macos-record` | both `voiceover` jobs | `spawn …/ffmpeg-static/ffmpeg ENOENT` | **Workflow.** READ: the job installs with `--ignore-scripts` (`matrix.yml:183`), which skips the install script that fetches `ffmpeg-static`'s binary; the recording setup needs it. No VoiceOver test ran. |

## 3. What this means for the release check

- **INFERRED:** groups 1, 3, 6, 10 and 11 are faults in the tests or the workflow, not in Kuiper. They are fixed in lane E, without ledger lines: a ledger line records a fault in Kuiper.
- **INFERRED:** groups 2 and 8 are budgets set on one machine and now read on another. `024` decision 4 and `025`'s rulings say a budget rises only by a recorded ruling. CI's figures are the ones the release check reads (`024` build step 7), so the ruling is the design lead's, with these figures.
- **INFERRED:** groups 5, 7 and 9 need a probe each. EXECUTED: group 7 passes in this container's Chromium 153 at 320, 390 and 1440; it fails only on the CI runner, which may measure before the code font has loaded, then a ledger line and a small change if they are faults in Kuiper.
- **INFERRED:** group 4 cannot be judged until VoiceOver runs too (group 11). If NVDA's speech is empty under one runner, the harness is the suspect, not 14 items.
- **What this memo did not see:** the `report` job's log, where ledger mismatches are printed; 19 of the 21 NVDA error lines; anything of NVDA with Firefox but its progress line.
<<<<<<< HEAD
=======

## 4. Run 2, on the lane-I merge

Run [43894126297](https://github.com/plutosystemsco/design-system/actions/runs/43894126297), on `e24a04b`: `024e`, `022a` and `022e` merged, before `022i` to `022k`. READ from its failed jobs' logs, 2026-11-16, with both NVDA jobs still running.

- **Lane I's fixes hold.** READ: the Firefox shards fail only on E4; the sidebar-icon walk, whose `022e` lines left the ledger, passes in both Firefox projects. No `dropdown-menu`, `highlighter` or API-table test fails, and no ledger mismatch is printed.
- **Every run-1 group recurs where it was:** E4 (group 1) in all six projects; E6 (3) and E7 (2) in `chromium-*` and `webkit-*`; `upgrade.spec.ts` 020b at 320 (7) in `chromium-*`; `toast` 64a, 64c, 64d (5), `pagination` 15a and 18 and `search-field` 28 (6), and `chat` L1 (9), in `webkit-*`; perf's 3 (8); the smoke test (10); both `voiceover` setups on ENOENT (11). In run 2, L1 fails in both WebKit projects, not once flaky.
- **New in run 2, all WebKit:**
  - `primitives.spec.ts:426`, "0 infinitely looping animations outside a spinner", failed in `webkit-dark`. INFERRED: a page sweep that a loaded runner can catch mid-animation; it needs its error line, which the summary does not print.
  - Flaky, so failing in CI: `compositions.spec.ts:604`, the keyboard walk at 1440 (`webkit-dark`) and at 320 (`webkit-light`); `bar-glass.spec.ts:279` at 1440 (`webkit-light`).
- **INFERRED:** run 2 adds no fault in Kuiper's items to what run 1 showed. The WebKit shards take 6 to 10 minutes on two cores against Chromium's 4 to 6, and the new failures are timing-shaped. They are watched in run 3 before any is opened.

>>>>>>> release/0.13.0
