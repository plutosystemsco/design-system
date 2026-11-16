# The fourth matrix run: the browsers nearly green, and the first speech verdicts

- **Status:** complete
- **Date:** 2026-11-16
- **Author:** the design lead
- **Question:** Run 4 is the first with `022l` to `022o`. What did they fix, and what still stands between `release/0.13.0` and a green run?
- **Stands on:** [the third matrix run](2026-11-16-the-third-matrix-run.md), [WebKit on Linux](2026-11-16-webkit-on-linux.md), and [the first speech verdicts](2026-11-16-the-first-speech-verdicts.md), which covers the screen-reader jobs in full.
- **What it blocks:** the next small changes and specifications below.

## How to read this memo

- **READ:** a job log of run [43938398575](https://github.com/plutosystemsco/design-system/actions/runs/43938398575), on `c5cdd65`, read 2026-11-16 through the GitHub connector.
- **EXECUTED:** run in this session's Linux container, now with Chromium 156 and WebKit for the pinned Playwright 1.64.1 (`/opt/pw-browsers`).
- **INFERRED:** our reasoning.

## 1. What the batch fixed

- **WebKit and Firefox pass.** READ: all 16 of their browser shards pass. E6, toast 64, pagination 15a and 18, search-field 28, chat L1, bar-glass and the keyboard walk fail nowhere. E7 fails only as its ledger lines expect, in all six projects.
- **The reader jobs report.** READ: all 12 shards ended with a verdict, none cancelled. NVDA's took 18 to 26 minutes. VoiceOver's took 37.7 to 41.5, and the 40-minute deadline stopped two of them with 14 tests not run. Each wrote its blob, as `022l` decision 3 intends. The sixth VoiceOver job queued for 39 minutes for a macOS slot.

## 2. What is left

| What | Where | Kind | Cause | Next |
|---|---|---|---|---|
| `upgrade.spec.ts` 020b at 320 | `chromium-*` | site page | EXECUTED on Chromium 156, 6 of 6: inline `code` in a rename's "What to do" (`pluto:field-set`, `pluto:field-label`) breaks after its hyphen, and its first fragment runs 2 px past the 288 px column first. Chromium 153 did not show it | A small change in lane S: inline code in the guide may break anywhere |
| `keyboard.spec.ts:500`, code-editor's three stops | `chromium-light`, 1 run in 3 | test | EXECUTED, 3 of 6 on Chromium 156: the ring is read on `.cm-editor` two frames after focus, and CodeMirror sometimes marks it focused later | A small change in lane E: wait until `.cm-editor` is `cm-focused` |
| perf: CLS on `/components/native-select/` and `/changelog/` | `perf` | site | EXECUTED: 0.088 and 0.086 under the perf project's throttling, every run; `/start/` 0.005 here, 0.048 on CI. A layout-shift probe of `/changelog/` names text reflowing as the web fonts swap in, up to 30 px. Unthrottled, `native-select` does not shift | `024g` (fallback faces matched to the fonts' metrics) and `024h` (preloads), with a leaf-template preload; Linux's fallback fonts differ more than macOS's |
| The screen-reader verdicts | all four pairs | mostly the suite | 82 failed runs: 51 rule or harness, 8 item, 23 unknown (the speech memo, closing table) | Its families A to E in lane E; its three item faults in lane I |
| VoiceOver's pace | both VoiceOver pairs | harness | 1.6 minutes a test with retries, about twice NVDA's (the speech memo) | Five shards a VoiceOver browser, after the suite's faults are fixed |
| E7 | all six | ledgered (`022f`) | budgets set on a quiet machine | The tag's quiet-machine run |

## 3. What this memo did not see

The `report` job's merged summary and its ledger-mismatch check, whose artifact this session cannot download. Firefox locally, which this container has no build of.
