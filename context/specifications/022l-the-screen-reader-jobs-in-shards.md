# 022l — The screen-reader jobs in shards

- **Status:** written 2026-11-16; waits for its specification review.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** a change to `022`'s workflow decisions (lane E): `.github/workflows/matrix.yml`, and the tests that read it. No item, token or dependency changes. It is a specification, not a small change, because it replaces `022` decisions on the reader jobs, and the owner chose it from options.
- **Depends on:** `022`, `022i`.
- **Research it stands on:** [the third matrix run](../research/2026-11-16-the-third-matrix-run.md), §3; [the first matrix run](../research/2026-11-16-the-first-matrix-run.md), group 4; `022`'s decisions 7, 10 and 18 and its tests 3 and 13 (`022-the-test-matrix.md`).

## Intent

Every screen-reader job in run 3 hit its 60-minute limit and was cancelled, so no speech verdict came out. The suite is 87 tests, run one at a time on one worker, each failing test run three times. This change splits each reader job into shards, as the browser jobs are split, so each shard finishes well inside its limit and the run gives a verdict for every reader and browser pair.

## Decisions

1. **Three shards per reader and browser pair.** `voiceover` and `nvda` each gain a matrix key, `shard: [1, 2, 3]`, beside `browser`. Each job runs `bun run test:sr --project=<browser> --shard=<n>/3`. *Why three:* run 1's `nvda (chromium)` took 58 minutes for all 87 tests with 21 of them retried twice. A third of that is about 20 minutes of tests, plus about 3 of set-up. *Why not more:* each shard repeats the reader's set-up, and the set-up itself has failed once on `macos-26` (decision 4).
2. **The owner's ruling.** Asked whether to shard, raise the limit or drop retries (2026-11-16), the owner chose shards. The repository is public, so the extra runner minutes cost nothing. Retries stay at 2 (`022` decision 18).
3. **Each shard has a limit of 45 minutes.** Twice the estimate, so a shard with many retries still reports. The limit is revisited after two green runs, as `022` decision 7 does for the browser shards.
4. **The macOS set-up runs again once if it fails.** In run 3, `voiceover (webkit)`'s `guidepup setup --ci --macos-record` failed at an AppleScript that opens Control Center (error -2700), while the same step passed on the other runner. With six VoiceOver jobs, a one-off failure of that step would fail more runs. The step becomes `bun run sr:setup --macos-record || bun run sr:setup --macos-record`. A second failure fails the job. NVDA's set-up is unchanged: it has not failed.
5. **Names follow the matrix.** Each shard's blob is `report-<reader>-<browser>-<n>.zip`, and its artifact `sr-<reader>-<browser>-<n>`. `report` already downloads `sr-*` and copies every `blob-report/*.zip`, so it merges the shards with no change. Its speech logs group by reader and browser (`scripts/ci/report.ts`), so a pair's shards land in one folder.
6. **The job list grows from 33 to 41.** `voiceover` and `nvda` expand to six jobs each. `scripts/ci/workflow.ts` expands matrices, so the release check's expected list and `gate` follow the file. `readerPairs` reads only the `browser` key, so the four reader and browser pairs do not change.
7. **Nothing else changes.** Not the suite, its 87 tests, its retries, its reporter, nor the ledger.

## Scope

In: the two reader jobs in `matrix.yml`; `tests/unit/workflow.test.ts`'s expectations of their names, matrices, commands and limits. Out: the suite's speed (a later change may shorten slow tests); `report.ts`, `gate.ts` and `release-check.ts`, which need no edit; the NVDA failures of run 1, which a green run of this change lets us read.

## Acceptance criteria

1. `workflow.test.ts` holds: both reader jobs have `shard: [1, 2, 3]`, `timeout-minutes: 45`, and a test step with `--shard=${{ matrix.shard }}/3`; their blob and artifact names carry the shard; `voiceover`'s set-up step runs twice on failure; `jobNames` gives 41 names, 6 `voiceover` and 6 `nvda`; `readerPairs` still gives the four pairs. Each assertion is seen failing first on `0933f1b`'s workflow. (unit)
2. `release-check.test.ts` and `fault-ledger.test.ts` pass unchanged. (unit)
3. In the next `matrix` push run, all 12 reader jobs finish inside 45 minutes, none cancelled, and `report` merges 12 reader blobs. (CI)
4. The landing notes record each shard's time and its pass, fail and flaky counts.

## Landing notes

(To be filled when it lands.)
