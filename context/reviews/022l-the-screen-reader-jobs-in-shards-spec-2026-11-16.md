# Review of 022l — The screen-reader jobs in shards

Reviews [`specifications/022l-the-screen-reader-jobs-in-shards.md`](../specifications/022l-the-screen-reader-jobs-in-shards.md) before it is built. Its research is §3 of [the third matrix run](../research/2026-11-16-the-third-matrix-run.md) and group 4 of [the first matrix run](../research/2026-11-16-the-first-matrix-run.md). This reviewer wrote neither the specification nor its research (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; fit to build
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (37 lines, untracked), on `release/0.13.0` at `0933f1b`. Checked against:
  - `022` decisions 7, 10, 14, 15, 18 and 19, its tests 3 and 13, its concurrency notes (lines 705, 854) and landing note 10;
  - `.github/workflows/matrix.yml`, `playwright.sr.config.ts`, `package.json`'s `test:sr` and `sr:setup`;
  - `scripts/ci/workflow.ts`, `report.ts`, `gate.ts`, `qualify.ts`, `scripts/site/release-check.ts`;
  - `tests/unit/workflow.test.ts`, `release-check.test.ts`, `gate.test.ts`, `tests/fixtures/ci/*.json`;
  - `tests/sr/fixtures.ts` (the mutation ledger), `tests/sr/mutations/derive.ts` (`verdict`);
  - `node_modules/@guidepup/playwright` 0.21.0, `node_modules/@guidepup/setup` 0.29.2 (macOS set-up), `node_modules/playwright` 1.64.1 (`lib/runner/index.js`: test groups, sharding, merge);
  - `030`'s use of the workflow (`030-the-accessibility-status.md`, lines 18, 196, 211).
- **Re-ran:** nothing in the repository was written but this file.
  - `bun test tests/unit/workflow.test.ts tests/unit/release-check.test.ts tests/unit/gate.test.ts` at `0933f1b` → **51 pass, 0 fail**, 337 expects. EXECUTED.
  - The same three files against a scratch copy of `matrix.yml` with only `shard: [1, 2, 3]` added to both reader matrices → **47 pass, 4 fail**: `workflow.test.ts`'s "expanded job names" (expected by the specification), and three `release-check.test.ts` tests (finding 1). EXECUTED. The scratch copy is deleted.
  - `SR_DRY=1 bun --bun playwright test -c playwright.sr.config.ts --list --project=chromium` → "Total: 87 tests in 32 files"; the same for `webkit` and `firefox`. With `--shard=1/3`, `2/3`, `3/3` → **32 tests in 14 files, 26 in 9, 29 in 9**. EXECUTED; no reader was started.
  - The scratch parse of the sharded workflow: `jobNames` → 41, the reader jobs named `voiceover (webkit, 1)` to `nvda (firefox, 3)`; `readerPairs` → the same four pairs. EXECUTED.
  - Through the GitHub connector, read 2026-11-16: the jobs and steps of run [43881168194](https://github.com/plutosystemsco/design-system/actions/runs/43881168194) (run 1) and run [43908608319](https://github.com/plutosystemsco/design-system/actions/runs/43908608319) (run 3), and the log tails of `nvda (chromium)` in run 1 and both `voiceover` jobs in run 3. READ.

## Acceptance criteria against evidence

A specification review asks whether each criterion is countable, and whether together they prove the intent.

1. `workflow.test.ts`'s new assertions, seen failing first on `0933f1b` — countable, **mostly sufficient.** INFERRED: each named assertion fails today; the job-name count does (EXECUTED, 33 not 41). It leaves the matrix key order and NVDA's set-up unasserted (finding 8), and has no guard on a long shard (finding 3).
2. `release-check.test.ts` and `fault-ledger.test.ts` pass unchanged — **wrong.** EXECUTED: three `release-check.test.ts` tests fail once the matrix gains its shard key (finding 1).
3. The next push run: 12 reader jobs inside 45 minutes, none cancelled, 12 blobs merged — countable, **not sufficient.** Twelve blobs can merge while a shard ran no test; the intent's "a verdict for every reader and browser pair" is not counted (finding 4).
4. The landing notes record each shard's time and counts — countable, **source unnamed.** The merged report records no shard (finding 6).

## Findings, most severe first

1. **High: `release-check.test.ts` does not pass unchanged; its fixtures carry the old job names** (`tests/fixtures/ci/gh-run-view-green.json`, and `-red`, `-mutation`, `-skipped`; the specification's criterion 2, scope, decision 6).
   The release check compares a run's job names with the file's list exactly (`scripts/ci/qualify.ts:46–52`). Each `gh-run-view-*.json` fixture holds 33 jobs, with `voiceover (webkit)`, `voiceover (chromium)`, `nvda (chromium)` and `nvda (firefox)` (READ).
   Failure: EXECUTED. With only the two shard keys added, "a green run on attempt 2 qualifies", "a green run qualifies" and "a green run through gh: passes" fail. The reason given is twelve "job voiceover (webkit, 1) is missing"-style lines and four "is not in matrix.yml" lines. The four "refused" tests still pass, but each is now refused for two reasons, so none isolates its own condition any more.
   Fix: put the four `gh-run-view-*.json` fixtures in scope. Each gets 41 jobs, the twelve reader jobs named as `jobNames` gives them (`voiceover (webkit, 1)` to `nvda (firefox, 3)`). Rewrite criterion 2: "`release-check.test.ts` passes with the fixtures at 41 names. Its three green tests are seen failing first against the 33-name fixtures. `fault-ledger.test.ts` and `gate.test.ts` pass unchanged." Say what happens to `api-run-jobs-green.json` and `-red.json`. They also hold 33 names. `gate.test.ts` reads only the `gate` job from them, so they pass either way. Either update them for fidelity or say they stay. In decision 6, say that the expected list follows the file, but the fixtures do not.

2. **Medium: decision 4's retry rests on a misread cause, and sharding triples the step it guards** (`matrix.yml:199`; decision 4).
   READ, run 3's `voiceover (webkit)` log: the set-up step ran from 16:33:31 to 16:36:54, 3 min 23 s. It ended with "System Events got an error: osascript is not allowed to send keystrokes. (-2700)". That is a permission the runner did not grant. It is not a flaky Control Center script.
   READ, `@guidepup/setup` 0.29.2: `enableDoNotDisturb` already retries 5 times (`macOS/enableDoNotDisturb.js`). Each try is a 30-second loop that re-runs the script every 0.2 s (`macOS/runAppleScript.js`). So that runner had already retried for over three minutes with the same error.
   The `||` retry is safe. GitHub's `bash -e` lets `a || b` continue past `a`'s failure. The TCC writes are upserts (`updateTccDb.js:216`, `ON CONFLICT DO UPDATE`). `defaults write` is idempotent. The DND script reads the checkbox before it clicks. Each attempt starts its own recording and stops it in a `finally`. So the retry leaves no half-set state that the tool's own loop does not already leave. But nothing shows that it helps. INFERRED: a second run on the same runner writes the same permission rows and most likely meets the same refusal, three and a half minutes later.
   With shards, a run has six macOS set-ups, not two. One of the two set-ups that reached this step has failed: run 3's (runs 1 and 2 failed earlier, on ENOENT). INFERRED: at a failure rate of 1 in 2, all six would pass about 1 run in 64. At 1 in 10, about 1 run in 2. The failed job also uploaded no recording ("No files were found"), so `--macos-record` gave nothing to diagnose.
   Fix: restate the cause as READ, with the log line. Keep the `||` only as a cheap guard, and call it unproven. Name the real recovery: "Re-run failed jobs" gets a fresh runner, and the release check accepts an attempt above 1, printing it (`022` decision 18). Add an `if: failure()` step after the set-up that prints the user and system TCC rows for `/usr/bin/osascript` (`kTCCServicePostEvent`, `kTCCServiceAccessibility`), so that the next failure names its cause. Criterion 4 should also record each of the six set-ups' outcome and attempts. If the design lead wants fewer macOS set-ups per run, ask the owner, recommended option first: (a) three VoiceOver shards with re-runs as the recovery; (b) two VoiceOver shards at a higher limit; (c) wait for one VoiceOver run's timings before choosing.

3. **Medium: the 45-minute estimate is one pair's, and a shard that overruns still gives no evidence** (decisions 1 and 3; `playwright.sr.config.ts:35–39`).
   The estimate holds for NVDA with Chromium. READ, run 1: `nvda (chromium)`'s test step ran 58.0 min (14:01:27 to 14:59:31), after 70 s of set-up, with "66 passed" and "21 failed". EXECUTED, the split: run 1's 21 failures fall 7, 7 and 7 across the three shards. Counting attempts (a failure runs three times), the shards carry 46, 40 and 43 of the 129 attempts. INFERRED: that is about 20.7, 18.0 and 19.3 minutes of tests, plus about 1.2 of set-up. So decision 1's "about 20" is sound there, and 45 is about twice it.
   No other pair has a figure. READ, run 3: `voiceover (chromium)` printed "Running 87 tests using 1 worker" at 16:34:36 and nothing more until it was cancelled at 17:33:27. `nvda (firefox)` did not finish in run 1 or run 3. A test may run 5 minutes (`timeout: 5 * 60_000`) and retries twice. So one hung test can cost 15 minutes, and three in one shard pass 45.
   A cancelled job's blob reporter never writes its blob. In run 3 the cancelled job uploaded no `blob-report/`, and `report` had nothing of it. So a long shard repeats run 3 for its files.
   Fix: give Playwright its own deadline under the job's. Add `--global-timeout=2400000` (40 minutes; READ, `playwright/lib/program.js:197`) to both reader test steps. A long shard then stops itself, marks the tests it did not reach, and writes its blob, so `report` merges what ran and the job still fails. Add the flag to criterion 1. In decision 1, say that the estimate is NVDA with Chromium's, and that VoiceOver's pace is unmeasured. Consider the `list` reporter beside `blob` in CI, in place of `dot`. It prints each test's time as the test ends, so even a cancelled log shows the pace. That changes decision 7's "nor its reporter"; say so if taken.

4. **Medium: criterion 3 does not count the verdict the intent promises** (criterion 3).
   "`report` merges 12 reader blobs" holds even if a shard ran no test. READ: Playwright passes a shard that selects no test (`runner/index.js:6666`, the `!testRun.config.config.shard` exemption). A wrong `--shard` value or project filter would therefore go green and empty.
   Fix: criterion 3 adds three counts. The merged `report.json` holds 87 screen-reader records for each of the four pairs, 348 in all. `matrix-report/sr-logs/` holds four folders of 28 files each, as `022` criterion 13 has it. Each shard's log says "Running 32 tests", "Running 26 tests" and "Running 29 tests using 1 worker" for shards 1, 2 and 3.

5. **Low: the specification does not say how Playwright splits this suite** (decisions 1 and 5).
   READ: `withGuidepup` sets `workers: 1` and `fullyParallel: false` (`@guidepup/playwright/lib/withGuidepup.js:7–8`, `screenReaderConfig.js:14,19`). No file in `tests/sr/` calls `describe.configure`. So Playwright makes one test group per file (`runner/index.js:2379–2453`). It hands whole files to shards by their first test's position in the count (`filterForShard`, lines 2462–2487). `--shard` works with this config.
   Write-in for decision 1: "With `fullyParallel` off, as `withGuidepup` sets it, Playwright splits by file. At 87 tests: shard 1 is `alert-dialog` to `marketing-bar`, 14 files, 32 tests; shard 2 is `message-log` to `sheet`, 9 files, 26 tests; shard 3 is `sidebar` to `tooltip`, 9 files, 29 tests. No shard passes a third by more than the largest file, `toast.sr.ts` at 10 tests. A new test file moves the boundaries. `fullyParallel` stays off: one worker gains nothing from it."

6. **Low: criterion 4 names no source for per-shard counts** (criterion 4).
   READ: the merged report records no shard (`022` landing note 10). `report.ts`'s summary groups by reader and browser (`report.ts:98–105`), so its rows sum a pair's three shards.
   Write-in: "Each shard's time comes from its job's step times. Its pass, fail and flaky counts come from the closing lines of its job's `dot` report."

7. **Low: the concurrency figures in `022` and `gate.ts` go stale** (`gate.ts:13–15`; `022` lines 705 and 854).
   They say 30 jobs against 20 slots, and macOS using 2 of its 5. READ, run 3: all 30 jobs after `build` started at 16:33:13–14, so the 20-slot limit did not bind. After this change, 38 jobs follow `build`, six of them on macOS against the five `022` records. INFERRED: one VoiceOver shard may wait about one shard's length, about 25 minutes. That is still inside the 95 minutes that `gate`'s mirror waits.
   Write-in: decision 6 states this. Either correct `gate.ts`'s comment (and add it to scope) or have the landing notes say that `022`'s figures are superseded.

8. **Low: criterion 1 leaves the job-name order and NVDA's set-up unasserted** (criterion 1; `workflow.ts:108–126`).
   Job names follow the order of the matrix keys. `browser` then `shard` gives `voiceover (webkit, 1)`, which matches `browsers (chromium, 1)`. The release check and its fixtures (finding 1) depend on that spelling. Decision 4 says NVDA's set-up is unchanged, but no assertion holds it.
   Write-in for criterion 1: "Both reader matrices' keys are `["browser", "shard"]`. `jobNames` contains `voiceover (webkit, 1)` and `nvda (firefox, 3)`. `nvda`'s set-up step is exactly `bun run sr:setup`." READ: the existing `022i` test (`workflow.test.ts:197–200`) finds the set-up with `startsWith("bun run sr:setup")`, so it keeps passing with the `||` line.

9. **Low: the scorecard and the owner's answer have no place** (criteria; decision 2).
   `AGENTS.md` asks for a scorecard re-run after each specification lands, and the change review cites its movement. `AGENTS.md` also puts the owner's answers in the landing notes.
   Write-in: a criterion 5, "the scorecard's run log gets a row for `022l`; no row is expected to move". Decision 2's ruling, with its date, is also copied into the landing notes.

### What holds

- `--shard` works under `withGuidepup`: one worker, file-level groups, an even split by count (EXECUTED, finding 5).
- Decision 6's arithmetic: 41 jobs, 6 `voiceover` and 6 `nvda`, and the four pairs unchanged (EXECUTED).
- `report.ts` needs no edit. `report` copies every `blob-report/*.zip` from `sr-*` (`matrix.yml:287–294`), and the names stay unique per shard. `merge-reports` keeps each blob's projects and tests apart (`mergeProjects: false`, `mergeTestCases: false`; `runner/index.js:8183–8185`). The speech logs group by `<reader>-<browser>/<item>` from the merged records (`report.ts:207–216`), so a pair's three shards land in one folder (READ).
- Mutation runs need no edit. The expected failures are ledgered per test, by reader and pair (`tests/sr/fixtures.ts:256–274`). `verdict` reports "did not run" for any expected test whose shard is missing (`derive.ts:239–240`), so a lost shard fails the comparison loudly (READ).
- `gate.ts` needs no edit. `needs.voiceover` and `needs.nvda` are matrix aggregates. The mutation table names jobs, not matrix entries (`gate.ts:28–29`), and the mirror reads only `gate` (READ).
- `030` reads only `readerPairs` (`030` line 196), which does not change (EXECUTED).

## Constitution checks

- §4.1 source, not a package: untouched. Workflow and tests only.
- §4.3 tokens are the one source: untouched. No item or style changes.
- §4.4 accessible and proven: this change serves it. The suite gets a verdict at all only if its jobs finish. Findings 2 to 4 are where that guarantee still lacks evidence. A failing check still fails the build: a shard stopped by `--global-timeout` fails its job (finding 3).
- §4.5 every input pinned: no new input. `--global-timeout` is a flag of the pinned Playwright 1.64.1.
- §4.6 dependencies named: none added.
- §5 the pipeline: research exists and is labelled. It is a specification, not a small change, for a stated reason. The owner's ruling is recorded (finding 9 asks for a copy in the landing notes).
- §6 never: nothing committed or pushed. No prior art copied.

## Verdict

Does not land yet: finding 1 (criterion 2 is wrong; the release check's fixtures must carry the 41 names), and findings 2 to 4 (the set-up retry rests on a misread cause, a long shard still yields no evidence, and criterion 3 does not count each pair's 87 tests).

## Disposition

By the design lead, the author, 2026-11-16. Each finding is fixed in the specification.

1. **Fixed.** The six `tests/fixtures/ci/` files are in scope at 41 names; criterion 2 is rewritten as given; decision 7 says the fixtures do not follow the file.
2. **Fixed.** Decision 5 states the cause from the log, drops the in-job retry (it meets the same permission), names "Re-run failed jobs" as the recovery, and adds the `if: failure()` TCC step. On the question for the owner, the design lead takes option (a), the owner's own choice of shards; two runs with more than one set-up failure reopen it.
3. **Fixed.** Decision 3 adds `--global-timeout=2400000`; decision 1 says the estimate is NVDA with Chromium's alone; decision 4 takes the `list` reporter in CI, which changes the reporter, as decision 9 now says.
4. **Fixed.** Criterion 4 counts 348 records, four folders of 28 files, and each shard's "Running N tests".
5. **Fixed.** Decision 1 takes the write-in on how the suite splits.
6. **Fixed.** Criterion 5 names the step times and the closing `list` lines as the source.
7. **Fixed.** Decision 8.
8. **Fixed.** Criterion 1 pins the key order and NVDA's set-up step.
9. **Fixed.** Criterion 6, and the owner's ruling in the landing notes.

Closing verdict: fit to build.
