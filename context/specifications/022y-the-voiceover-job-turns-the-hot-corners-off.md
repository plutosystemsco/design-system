# 022y — The VoiceOver job turns the hot corners off

- **Status:** built 2026-11-17; reviewed (`reviews/022xy-the-fifth-runs-test-faults-and-hot-corners-pr-2026-11-17.md`, lands), its finding 4 fixed. Lane E (the workflow only).
- **Date:** 2026-11-17
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It adds one step to `matrix.yml`'s `voiceover` job, and no item. No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`, `022l`.
- **Found by:** [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), cited as *the memo*: §3.2 (the chart under VoiceOver with WebKit) and §7's Quick Note row.

Terms. A _hot corner_ is a screen corner that runs a macOS action when the pointer reaches it. The Dock keeps them as `wvous-tl-corner`, `-tr-`, `-bl-` and `-br-` in `com.apple.dock`; 1 means no action, the "–" System Settings writes.

## The defect

Under VoiceOver with WebKit, the chart's walk spoke the ticks to "Sat", then "Quick Note New Quick Note dialog" for every step after. C1 failed, and C2 returned its follow-on X0. Run 4's walk ended in the same window (the memo §3.2). READ.

Quick Note is macOS's default bottom-right hot corner. VoiceOver can move the pointer with its cursor, and the chart's x-axis ends at the bottom right. So the pointer reached the corner, and macOS opened Quick Note. INFERRED: the runner's corner settings were never read. A runner fault, not the suite's rule.

## The fix

In the `voiceover` job, after the set-up and its `failure()` step and before the reader's install and the tests, one step:

1. prints the runner's corners: `defaults read com.apple.dock | grep wvous || true`;
2. sets each of the four to 1: `defaults write com.apple.dock wvous-tl-corner -int 1`, and the same for `tr`, `bl` and `br`;
3. restarts the Dock so it reads them: `killall Dock || true`;
4. prints the corners again, so the log shows what took effect.

The step stays out of 022i's fetch, hash and set-up run and away from 022l's set-up check, which both read steps by position. The job list stays at 45; no step is named, and the CI fixtures hold job names only, so they do not change. NVDA's job is untouched.

## The check

A unit test in `tests/unit/workflow.test.ts` finds the step and holds its seven lines, in order. It also checks that the step is unconditional, comes before `test:sr`, comes after the set-up's `failure()` step, and is not in `nvda`. The next run shows the runner's corners in the log, and the chart's walk under VO wk should end in the page, not Quick Note.

## Landing notes

Run in this container on `71cb067`.

- **Failing first (EXECUTED).** `bun test tests/unit/workflow.test.ts`: 25 pass, 1 fail, the new test, "Expected: >= 0, Received: -1": no step reads `com.apple.dock`.
- **After (EXECUTED).** 26 of 26 pass, among them the 45 job names and the six CI fixtures, unchanged.
- The gate is `022x`'s, run with this change in the same worktree.
- Not run here: this container has no macOS. The `defaults` and `killall` lines are macOS's own commands. Whether the runner's corners were set, and to what, is for the next run's log. INFERRED.
- **The scorecard:** no row moves; a fix to the CI runner's set-up. Confirmed by the change review.
- **The change review's finding 4 (EXECUTED).** As first built, the step wrote 0, a value System Settings never writes, and printed the corners only before. The unit test now holds `-int 1` for the four corners and a second read after `killall Dock`: seen failing first (25 pass, 1 fail), then 26 of 26 after the step changed. Still not run on macOS; the next run's log shows the corners before and after.
