# 022l — The screen-reader jobs in shards

- **Status:** written 2026-11-16; reviewed (`reviews/022l-the-screen-reader-jobs-in-shards-spec-2026-11-16.md`), every finding fixed here (Review). Fit to build once the review's disposition is written.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** a change to `022`'s workflow decisions (lane E): `.github/workflows/matrix.yml`, `playwright.sr.config.ts`'s CI reporter, and the tests and fixtures that read the workflow. No item, token or dependency changes. It is a specification, not a small change, because it replaces `022` decisions on the reader jobs, and the owner chose it from options.
- **Depends on:** `022`, `022i`.
- **Research it stands on:** [the third matrix run](../research/2026-11-16-the-third-matrix-run.md), §3; [the first matrix run](../research/2026-11-16-the-first-matrix-run.md), group 4; `022`'s decisions 7, 10, 14 and 18 and its tests 3 and 13 (`022-the-test-matrix.md`); the spec review's readings of run 1 and run 3 and of `@guidepup` (cited as *the review*).

## Intent

Every screen-reader job in run 3 hit its 60-minute limit and was cancelled, so no speech verdict came out. The suite is 87 tests, run one at a time on one worker, each failing test run three times. This change splits each reader job into shards, as the browser jobs are split, so each shard reports inside its limit and the run gives a verdict for every reader and browser pair.

## Decisions

1. **Three shards per reader and browser pair.** `voiceover` and `nvda` each gain a matrix key, `shard: [1, 2, 3]`, after `browser`, so jobs are named `voiceover (webkit, 1)` to `nvda (firefox, 3)`. Each job runs `bun run test:sr --project=<browser> --shard=<n>/3`.
   - *How it splits.* With `fullyParallel` off, as `withGuidepup` sets it (one worker), Playwright splits by file (*the review*, READ). At 87 tests: shard 1 is `alert-dialog` to `marketing-bar`, 14 files, 32 tests; shard 2 is `message-log` to `sheet`, 9 files, 26 tests; shard 3 is `sidebar` to `tooltip`, 9 files, 29 tests (*the review*, EXECUTED with `SR_DRY=1 --list`). No shard passes a third by more than the largest file, `toast.sr.ts` at 10 tests. A new test file moves the boundaries. `fullyParallel` stays off: one worker gains nothing from it.
   - *Why three.* Run 1's `nvda (chromium)` ran its tests in 58.0 minutes, 66 passed and 21 failed, each failure three times. Those 21 fall 7, 7 and 7 across the shards, so the shards come to about 20.7, 18.0 and 19.3 minutes, plus about 1.2 of set-up (*the review*). That is the one pair with a figure. VoiceOver's pace is unmeasured: run 3's `voiceover (chromium)` printed nothing for 59 minutes. NVDA with Firefox has never finished.
2. **The owner's ruling.** Asked whether to shard, raise the limit or drop retries (2026-11-16), the owner chose shards. The repository is public, so the extra runner minutes cost nothing. Retries stay at 2 (`022` decision 18).
3. **A deadline inside the job's limit.** Each reader job has `timeout-minutes: 45`. Its test step also passes `--global-timeout=2400000`, 40 minutes, to Playwright. A shard that runs long then stops itself, marks the tests it did not reach, and writes its blob, so `report` merges what ran and the job still fails. A cancelled job writes nothing, which is run 3's hole. One hung test costs up to 15 minutes (a 5-minute timeout, three attempts), so 40 holds about one hang in a 20-minute shard. The limits are revisited after two green runs, as `022` decision 7 does for the browser shards.
4. **The CI reporter lists each test.** `playwright.sr.config.ts`'s CI reporters become `blob` and `list`, not `blob` and `dot`. `list` prints each test and its time as it ends, so even a cancelled shard's log shows its pace. This changes the suite's reporter, and only in CI.
5. **The macOS set-up, and what recovers it.** READ, run 3's `voiceover (webkit)` log: its set-up ran 3 min 23 s and ended "System Events got an error: osascript is not allowed to send keystrokes. (-2700)". READ, `@guidepup/setup` 0.29.2: that step already retries five times, each a 30-second loop (*the review*). So the runner lacked a permission; it was not a flaky script. `voiceover (chromium)`'s identical step passed on another runner.
   - **The recovery is a re-run.** "Re-run failed jobs" gets a fresh runner. The release check accepts an attempt above 1 and prints it (`022` decision 18).
   - **The step is not retried in the job.** A second try on the same runner meets the same permission.
   - **A failed set-up names its cause.** A step after it, `if: failure()`, prints the user and system TCC rows for `/usr/bin/osascript` (`kTCCServicePostEvent`, `kTCCServiceAccessibility`). TCC is macOS's permission database.
   - Sharding takes macOS set-ups from 2 to 6 a run, so a runner without the permission is met more often. *The review* offered the owner three ways (three shards with re-runs, two shards at a higher limit, or one VoiceOver run's timings first). The design lead takes the first, the owner's own choice; the landing notes record each set-up's outcome, and two runs with more than one set-up failure each reopen the choice.
   - NVDA's set-up is unchanged: it has not failed.
6. **Names follow the matrix.** Each shard's blob is `report-<reader>-<browser>-<n>.zip`, and its artifact `sr-<reader>-<browser>-<n>`. `report` already downloads `sr-*` and copies every `blob-report/*.zip`, so it merges the shards with no change. Its speech logs group by reader and browser (`scripts/ci/report.ts`), so a pair's shards land in one folder.
7. **The job list grows from 33 to 41.** `voiceover` and `nvda` expand to six jobs each. `scripts/ci/workflow.ts` expands matrices, so the release check's expected list and `gate` follow the file. The test fixtures do not follow it: the four `tests/fixtures/ci/gh-run-view-*.json` files are rewritten with the 41 names. `api-run-jobs-green.json` and `-red.json` are rewritten too, for fidelity, though `gate.test.ts` reads only their `gate` job. `readerPairs` reads only the `browser` key, so the four reader and browser pairs do not change.
8. **Concurrency.** In run 3 all 30 jobs started at once. With 41, the six VoiceOver jobs exceed the five macOS slots `022` records, so one may wait. `gate`'s wait covers it. `gate.ts`'s and `022`'s stated figures are updated in this change's landing notes, not in their files.
9. **Nothing else changes.** Not the suite's 87 tests, its retries, nor the ledger.

## Scope

In: the two reader jobs in `matrix.yml`; the CI reporter in `playwright.sr.config.ts`; `tests/unit/workflow.test.ts`'s expectations; the six fixtures in `tests/fixtures/ci/`. Out: the suite's speed; `report.ts`, `gate.ts` and `release-check.ts`, which need no edit; the NVDA failures of run 1, which a green run of this change lets us read.

## Acceptance criteria

1. `workflow.test.ts` holds, each assertion seen failing first on `0933f1b`'s workflow: both reader jobs' matrices are `browser` then `shard: [1, 2, 3]`; both have `timeout-minutes: 45`; both test steps pass `--shard=${{ matrix.shard }}/3` and `--global-timeout=2400000`; their blob and artifact names carry the shard; `voiceover` has an `if: failure()` step after its set-up that reads the TCC rows; `nvda`'s set-up step is exactly `bun run sr:setup`; `jobNames` gives 41 names, 6 `voiceover` and 6 `nvda`, `voiceover (webkit, 1)` among them; `readerPairs` still gives the four pairs. (unit)
2. `release-check.test.ts` passes with its fixtures at 41 names; its three green tests are seen failing first against the 33-name fixtures, and each refusal test still fails for its own reason alone. `fault-ledger.test.ts` and `gate.test.ts` pass. (unit)
3. A unit test holds `playwright.sr.config.ts`'s CI reporters to `blob` and `list`. (unit)
4. In the next `matrix` push run: all 12 reader jobs end inside 45 minutes, none cancelled; the merged `report.json` holds 87 screen-reader records for each of the four pairs, 348 in all; `matrix-report/sr-logs/` holds four folders of 28 files each (`022` criterion 13); each shard's log says "Running 32 tests", "Running 26 tests" and "Running 29 tests using 1 worker" for shards 1, 2 and 3. (CI)
5. The landing notes record, from each job's step times and its closing `list` lines: each shard's test time and its pass, fail and flaky counts, and each VoiceOver set-up's outcome and attempt.
6. The scorecard is re-run and its run log has a row; no row is expected to move until speech verdicts exist.

## Review

The spec review, 2026-11-16, raised 9 findings (1 High, 3 Medium, 5 Low). Each is fixed above: 1 in decision 7, scope and criterion 2; 2 in decision 5 and criterion 5; 3 in decisions 1 and 3, decision 4 and criterion 1; 4 in criterion 4; 5 in decision 1; 6 in criterion 5; 7 in decision 8; 8 in criterion 1; 9 in criterion 6 and the landing notes.

## Landing notes

- **The owner's ruling (2026-11-16):** shards, from three options (shards; a longer limit; fewer retries). Decision 2.
