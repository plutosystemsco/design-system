# The third matrix run: what 022i to 022k fixed, and what is left

- **Status:** complete
- **Date:** 2026-11-16
- **Author:** the design lead
- **Question:** Run 3 is the first `matrix` run with `022i`, `022j` and `022k`. Did they fix what they set out to, and what still stands between `release/0.13.0` and a green run?
- **Stands on:** [the first matrix run](2026-11-16-the-first-matrix-run.md), whose groups are cited by number.
- **What it blocks:** the next small changes, and the rulings below.

## How to read this memo

- **READ:** a job log of run [43908608319](https://github.com/plutosystemsco/design-system/actions/runs/43908608319), on `0933f1b`, read 2026-11-16 through the GitHub connector.
- **INFERRED:** our reasoning.

## 1. What the three changes fixed

- **The smoke test (group 10): fixed.** READ: `checks` passed, every step.
- **VoiceOver's ffmpeg (group 11): fixed.** READ: in both `voiceover` jobs, `bun install.js` ran, and the hash check printed "node_modules/ffmpeg-static/ffmpeg: OK".
- **E4 (group 1): fixed.** READ: it fails in no project.
- **E6 (group 3): fixed in Chromium, not in WebKit.** READ: it passes in both Chromium projects. In both WebKit projects it fails as before: "python after the edits", an editor line 51 the block lacks. The cursor wait passed first, so the race `022k` closes is not WebKit's cause. INFERRED: in WebKit, an Enter in an editor without `defaultKeymap` adds two line breaks however long the test waits. Whether `CodeEditor`'s own default setup is exposed decides whether this is a fault in the item or in the test fixture. It needs a WebKit probe, which this session's container cannot run.

## 2. What is left

| Group | Projects in run 3 | Kind | What it needs |
|---|---|---|---|
| E7, the editor's budgets (2) | `chromium-*`, `webkit-*` (Firefox ledgered) | budget | A ruling on CI's figures. Python's keystroke p95 reads 12.9 to 22 ms in Chromium and up to 53 ms in WebKit, against 12 ms |
| perf: 3 pages' CLS (8) | `perf` | budget or item | A ruling, or a probe of the shift on Linux |
| `upgrade.spec.ts` 020b at 320 (7) | `chromium-*`; flaky at 390 in `firefox-dark` | item (site page) | A probe on the runner: the two `pluto:field-…` tokens are 2 px too wide |
| E6 in WebKit (3) | `webkit-*` | unknown | A WebKit probe (§1) |
| toast 64a, 64c, 64d (5) | `webkit-*` | test or engine | A WebKit probe |
| pagination 15a, 18; search-field 28 (6) | `webkit-*` | test | Branch on platform, not engine |
| chat L1 (9) | `webkit-*` | item or engine | A WebKit probe: 410 where 413 |
| `bar-glass.spec.ts:140`, the bar's text at 4.5:1 | `webkit-light`, 2 pages | new | A WebKit probe. READ: it failed on `/components/` and `/components/button/` at 1440 |
| `compositions.spec.ts:604` keyboard walk | `webkit-light`, flaky | new | READ: "hidden under the bar: -825.8125 ≤ 72", walking back. INFERRED: a scroll still running when the focus is read |
| `keyboard.spec.ts:500`, code-editor's three stops | `chromium-dark`, flaky | new | Watch |
| **The screen-reader jobs** | `voiceover` and `nvda`, all four | harness | See §3 |

## 3. The screen-reader jobs run out of time

- READ: `voiceover (chromium)` finished its setup in 32 s and started 87 tests on one worker at 16:34. The job's 60-minute limit cancelled it at 17:33. Nothing was printed in between: the reporter prints at the end.
- READ: both `nvda` jobs were cancelled at the same limit. In run 1, `nvda (chromium)` finished in 58 of its 60 minutes, with 21 failures retried twice each.
- READ: `voiceover (webkit)` failed in setup, at an AppleScript that opens Control Center to turn on Do Not Disturb: error -2700. `voiceover (chromium)`'s identical setup passed on another runner. INFERRED: a flaky step in `guidepup setup` on `macos-26`.
- INFERRED: 87 tests at about 40 s each, with failures run three times, do not fit in 60 minutes on one worker. No speech verdict can be read until they do. The ways out are a longer limit, shards (the repository is public, so runner minutes cost nothing), fewer retries, or a shorter suite. Each changes `022`'s decisions, so the choice is a specification's, not a small change's.

## 4. What this memo did not see

The per-test results of the screen-reader jobs: the cancelled jobs printed none. The error lines of the `upgrade`, `perf`, `bar-glass` and `keyboard` failures beyond their summaries. Run 2's two NVDA jobs, which this memo did not read.
