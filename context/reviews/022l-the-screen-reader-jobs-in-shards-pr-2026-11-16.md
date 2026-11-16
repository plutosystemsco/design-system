# Review of 022l — The screen-reader jobs in shards (built), and E7 folded into 022f

Reviews two built changes, uncommitted in the working tree of `release/0.13.0` at `0933f1b`:

- **Change A, `022l`:** [`specifications/022l-the-screen-reader-jobs-in-shards.md`](../specifications/022l-the-screen-reader-jobs-in-shards.md), with its [spec review](022l-the-screen-reader-jobs-in-shards-spec-2026-11-16.md) (dispositioned) and its research, §3 of [the third matrix run](../research/2026-11-16-the-third-matrix-run.md).
- **Change B, E7 folded into `022f`:** [`specifications/022f-the-code-editors-budgets-in-firefox.md`](../specifications/022f-the-code-editors-budgets-in-firefox.md), its Status line and its Landing notes, "The owner's ruling".

This reviewer wrote neither change, nor either specification (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** `git diff` against `0933f1b`.
  - Change A: `.github/workflows/matrix.yml` (the `voiceover` and `nvda` jobs), `playwright.sr.config.ts` (the CI reporter), `tests/unit/workflow.test.ts` (three `022l:` tests and the job-count test), and the six files in `tests/fixtures/ci/`.
  - Change B: `tests/fault-ledger.ts`, and `022f`'s Status and Landing notes.
  - Read beside them: `scripts/ci/workflow.ts`, `qualify.ts`, `gate.ts`, `report.ts`, `scripts/site/release-check.ts`, `tests/ledger.ts`, `tests/sr/mutations/derive.ts`, `tests/e2e/code.spec.ts` (E7), `playwright.config.ts`, `node_modules/playwright` 1.64.1 (`lib/runner/index.js`), `node_modules/@guidepup/setup` 0.29.2 (`lib/commands/setup/macOS/setup.js`, `updateTccDb.js`).
- **Re-ran:** no file was written but this one. Scratch work lived in the session's scratchpad.
  - `bun test tests/unit/workflow.test.ts tests/unit/release-check.test.ts tests/unit/gate.test.ts tests/unit/fault-ledger.test.ts` → **64 pass, 0 fail**, 378 expects, exit 0. By file: workflow 24, release-check 13, gate 17, fault-ledger 10. EXECUTED.
  - `bun run check` → 2429 files, 0 errors, 0 warnings, exit 0. `bun run lint` → "All matched files use Prettier code style!", exit 0. EXECUTED.
  - `SR_DRY=1 E2E_PREBUILT=1 bun --bun playwright test -c playwright.sr.config.ts --project=<p> --shard=<n>/3 --list`, for `chromium`, `webkit` and `firefox` → **32 tests in 14 files, 26 in 9, 29 in 9**, in each project. EXECUTED; no reader started.
  - `SR_DRY=1 E2E_PREBUILT=1 bun run test:sr --project=webkit --shard=2/3 --global-timeout=2400000 --list` → bun echoes `bun --bun playwright test -c playwright.sr.config.ts "--project=webkit" "--shard=2/3" "--global-timeout=2400000" --list`, and lists 26 tests in 9 files. So both flags reach Playwright through the script. EXECUTED.
  - The new `workflow.test.ts` against a scratch copy of the `0933f1b` tree → **20 pass, 4 fail**: the three `022l:` tests and the job-count test. EXECUTED.
  - `release-check.test.ts` and `gate.test.ts` in that scratch tree with the new `matrix.yml` and the old fixtures → **27 pass, 3 fail**: "a green run on attempt 2 qualifies", "a green run qualifies", "a green run through gh: passes". With the new fixtures → **30 pass, 0 fail**. EXECUTED.
  - A scratch script compared each fixture with its `0933f1b` version → each holds 41 jobs; every new job equals its source job in every field but `name` and the id; each reader shard carries its pair's old conclusion; ids are unique; `total_count` reads 41 in the two `api-run-jobs` files; nothing else at the top level changed. EXECUTED.
  - The release check's `qualify` over each refusal case, with the new names and fixtures → each refusal gives only its own reasons, and none says "is missing" or "is not in matrix.yml". EXECUTED (listed under criterion 2).
  - A scratch Playwright 1.64.1 suite, no browser, `--global-timeout=2000`, reporters `blob` and `list`, one hanging test → exit 1; "Timed out waiting 2s for the test suite to run"; "1 passed", "1 interrupted", "1 did not run"; the blob `report-x-1.zip` was written. EXECUTED.
  - A scratch Playwright suite with `retries: 1` and `failOnFlakyTests: true`, each test marked `test.fail()` → fails on both attempts: exit 0. Fails first, would pass on retry: exit 0, and no retry runs. Passes first, fails on retry: "1 flaky", exit 1. Passes on both: "Expected to fail, but passed", exit 1. EXECUTED.
  - `ledgerCheck(LEDGER)` → not ok, "holds 6 open faults", one line per project. `mismatch` on E7's line with CI's WebKit text, `expect(received).toBeLessThanOrEqual(expected)`, "Expected: <= 12", "Received: 53", colour codes included → null, so it matches. On "Test timeout of 180000ms exceeded." → a mismatch. EXECUTED.
  - Not run: no browser test, and no timing test. Another agent's WebKit probes share this 4-core machine. E7 is a timing test, so its local outcome would say nothing.

## Acceptance criteria against evidence

### Change A, `022l`

1. `workflow.test.ts` holds the listed assertions, each seen failing first on `0933f1b` — **met.** EXECUTED: the four tests that hold them fail on `0933f1b`'s tree and pass on the change. They assert both matrices' keys as `["browser", "shard"]` and `shard` as `[1, 2, 3]`; `timeout-minutes: 45`; `--shard=${{ matrix.shard }}/3` and `--global-timeout=2400000` in both test steps; both blob names and both artifact names with the shard; the `if: ${{ failure() }}` step right after `bun run sr:setup --macos-record`, holding `TCC.db` and `/usr/bin/osascript`; `nvda`'s one set-up step exactly `bun run sr:setup`; 41 names, 6 `voiceover (` and 6 `nvda (`, `voiceover (webkit, 1)` and `nvda (firefox, 3)` among them. The four pairs are held by the existing `readerPairs` test (`workflow.test.ts:235`). The NVDA and pairs assertions are guards: they cannot fail on `0933f1b`, and the criterion's "each" can only mean the assertions that change. INFERRED.
2. `release-check.test.ts` passes at 41 names; its three green tests fail first on the 33-name fixtures; each refusal still fails for its own reason alone; `fault-ledger.test.ts` and `gate.test.ts` pass — **met.** EXECUTED: 13, 10 and 17 pass. The three green tests fail on the old fixtures and pass on the new ones. The refusal reasons, with the new names: a failed run, "conclusion is failure; job browsers (webkit, 3) is failure; job gate is failure" (the red fixture's own failed jobs); a pull-request run, "event is pull_request, not push" alone; another commit, "headSha is …" alone; a skipped job, "browsers (chromium, 1) is skipped" alone; a mutation run, its event, its title and its 26 skipped jobs, which a mutation run skips by design. None names a missing job or a job not in `matrix.yml`.
3. A unit test holds the CI reporters to `blob` and `list` — **met.** EXECUTED: "022l: in CI the screen-reader suite reports to blob and list" passes, and fails on `0933f1b`. It matches the config's text, not its value. A reformat would fail it falsely; a wrong reporter cannot pass it. INFERRED.
4. The next `matrix` push run: 12 reader jobs inside 45 minutes, 348 records, four folders of 28 files, each shard's "Running N tests" — **not met yet; it cannot be run here.** It needs a push, and agents never push. READ, `runner/index.js:1183–1187`: in a shard, the line reads "Running 32 tests using 1 worker, shard 1 of 3", and in a coloured log the words are split by colour codes (finding 3).
5. The landing notes record each shard's time, counts, and each VoiceOver set-up's outcome and attempt — **not met yet.** It waits on criterion 4's run.
6. The scorecard is re-run, with a row in its run log — **not met yet.** It is a landing step.

### Change B, E7 in `022f`

`022f` is a small change with one check: "E7 … failing today with `toBeLessThanOrEqual`. When the fix lands, its ledger lines … are removed, or the run turns red." This change widens the ledger, not the fix. So the checks are the ledger's.

1. E7's line is in all six projects — **met.** READ: `tests/fault-ledger.ts` maps one line over `chromium-light` to `webkit-dark`. EXECUTED: `fault-ledger.test.ts` passes, so E7's title is listed in each of the six projects. `ledgerCheck` reports six open faults, one per project.
2. E7's CI error matches the line's `expect` — **met.** EXECUTED: `mismatch` returns null for CI's WebKit text, 53 against 12, with Playwright's colour codes. Every E7 budget is a `toBeLessThanOrEqual` (`code.spec.ts:1543–1548`), so a miss in any of them matches. READ.
3. The release check still reads the ledger — **met.** EXECUTED: `ledgerCheck` refuses and prints six lines. `release-check.test.ts` passes.
4. The 022f notes state the risk — **partly met.** The conclusion is right: a ledgered E7 that meets its budgets turns the run red. The mechanism is not: a ledgered test whose first attempt fails is never retried (finding 4).

## Findings, most severe first

No High and no Medium finding. Every finding is a write-in.

1. **Low (A): the TCC step reads only osascript's rows, which may not hold the cause** (`.github/workflows/matrix.yml:206–211`; decision 5).
   READ, `setup.js:53–70`: with `--ci`, a failed user-database write throws; a failed system-database write is swallowed. So when the set-up reaches the Do Not Disturb script and fails with -2700, the user rows are known to be written. The system rows may be missing. The step reads both, so it can show a missing system row. That holds.
   But guidepup writes `kTCCServicePostEvent` and `kTCCServiceAccessibility` for twelve clients (`updateTccDb.js:56–68`): `sshd`, `bash`, `zsh`, `osascript`, Terminal, GitHub's provisioner and hosted-compute agent, and others. INFERRED: macOS checks the responsible process, which on a hosted runner is most likely the agent at the top of the process chain, not `/usr/bin/osascript`. So osascript's rows can read "allowed" while the refusal stands.
   Also READ, `updateTccDb.js:146–149`: on Darwin 27 and later, guidepup finds the user database under `/private/var/containers/Data/ProtectedSystem/`, not under `$HOME`. `macos-26` is Darwin 25, so `$HOME` is right today.
   Failure: a runner that refuses keystrokes because the agent's row is missing → the step prints osascript's rows granted → the log names no cause.
   Fix: drop the client filter, and print every client for the two services: `SELECT client, service, auth_value, auth_reason, last_modified FROM access WHERE service IN ('kTCCServicePostEvent', 'kTCCServiceAccessibility') ORDER BY service, client;`. Use `sudo -n`, as guidepup does, so a password prompt fails at once. Add TCC's own record of the refusal, which names the responsible process: `log show --last 15m --style compact --predicate 'subsystem == "com.apple.TCC"' | tail -n 200 || true`. Add a comment that the `$HOME` path holds below Darwin 27. `workflow.test.ts:275` then asserts `TCC.db` and `kTCCServicePostEvent` in place of `/usr/bin/osascript`.

2. **Low (A): decision 8's figures are not yet in the landing notes** (`022l` Landing notes; `scripts/ci/gate.ts:13–15`).
   Decision 8 says `gate.ts`'s and `022`'s concurrency figures are corrected in this change's landing notes. The notes hold only the owner's ruling. READ.
   INFERRED: with five macOS slots, one VoiceOver shard can wait for another to end, up to 45 minutes. A push run's worst case then nears build plus 90 minutes plus `report`, which is about the 95 minutes `gate`'s mirror waits. `gate.ts`'s comment already says a slow first run makes the mirror fail, and a re-run reads the finished run.
   Write-in for the landing notes: "`gate.ts`'s comment and `022`'s concurrency notes say 30 jobs against 20 slots, and macOS using 2 of its 5. From `022l`, 38 jobs follow `build`, six of them on macOS's five slots, so one VoiceOver shard may wait for another. A push run can then near the 95 minutes `gate`'s mirror waits; a same-repository pull request's gate is re-run if it times out first."

3. **Low (A): criterion 4's log string differs from Playwright's** (`022l` criterion 4).
   READ, `runner/index.js:1183–1187`: a shard prints "Running 32 tests using 1 worker, shard 1 of 3". "Running" and "tests using" are dimmed on their own, so the raw log has colour codes between the words. A plain search of the raw log for "Running 32 tests using 1 worker" can miss.
   Write-in for criterion 4: "each shard's log, as GitHub shows it, says 'Running 32 tests using 1 worker, shard 1 of 3', and 26 and 29 for shards 2 and 3."

4. **Low (B): the risk note misstates how retries treat a ledgered test** (`022f` Landing notes, line 33).
   The note says "one that passes on retry is flaky, which CI also fails". EXECUTED, scratch suite: a ledgered test whose first attempt fails is expected, and it is not retried. Only a first attempt that passes is retried. Then a passing retry is "Expected to fail, but passed", and a failing retry is flaky; both exit 1 under `failOnFlakyTests`. So the retry never rescues it. The run is red exactly when E7's first attempt meets every budget, in either Chromium project.
   The note's reading of a red run also needs its signature. A `ledger-mismatch` on E7, such as a test timeout, is a different failure (EXECUTED, `mismatch`).
   Fix text: "A ledgered test is retried only when its first attempt passes. So E7 turns the run red whenever its first attempt meets every budget: 'Expected to fail, but passed' if the retry passes too, flaky if it fails, and CI fails both. A red run whose only failure is E7 in `chromium-*`, passing unexpectedly or flaky, reads as this fault meeting its budget on a faster runner. A `ledger-mismatch` on E7 is not that reading; it is a new failure."

5. **Low (B): the new finding drops Firefox's first-colour miss, and the check still names two projects** (`tests/fault-ledger.ts:38–39`; `022f` "The check", line 23; Landing notes, line 34).
   READ, `022f` "The defect": in the confirmation runs, Firefox's first colour was over 250 ms in both projects. The new finding names only keystroke times. The `expect` is the same for both, so the ledger works. Only the record is narrower than the evidence.
   "The check" still reads "E7 in `firefox-light` and `firefox-dark`". The "Seen here" line carries no label.
   Write-ins: the finding reads "On CI's two-core runners the editor's keystroke times miss 013's budgets in every engine, and Firefox's first colour misses too; the budgets were set on a quiet machine." The check reads "E7 in all six projects (the owner's ruling, 2026-11-16), failing with `toBeLessThanOrEqual`." The last note begins "EXECUTED, 2026-11-16:".

### What holds

- **YAML and expressions.** EXECUTED: Python's `yaml.safe_load` and `scripts/ci/workflow.ts` both parse the file. `${{ failure() }}`, `${{ matrix.shard }}` and the blob and artifact names are well formed. Names expand in key order to `voiceover (webkit, 1)` through `nvda (firefox, 3)`, the form GitHub gives `browsers (chromium, 1)`.
- **The TCC step is sound bash.** READ: GitHub runs it with `bash -e`; each path is double-quoted; the SQL's single quotes sit inside double quotes; `|| true` keeps a refused read from failing the step. It runs only after a failed step. The steps after it are skipped, and the upload still runs (`always()`). It also runs after an earlier failure, such as the ffmpeg hash; there it is harmless.
- **The deadline.** EXECUTED: `--global-timeout` stops the run, marks what it did not reach, writes the blob, and exits 1. Teardown is cut short too, which an ephemeral runner does not mind. READ, run 3: a reader job's steps before its tests took about 1.4 minutes. INFERRED: 40 of 45 minutes leaves room for them and for the blob.
- **The split.** EXECUTED: 32, 26 and 29 in every project, as decision 1 says.
- **`report.ts`, `gate.ts`, `release-check.ts` and the mutation path need no change.** READ: `report` copies every `sr-*/blob-report/*.zip`, and the new names are unique per shard. `merge-reports` salts each blob's ids by its index (`runner/index.js:8313–8320`). `report.ts` groups speech logs by reader and browser from the records' tags (`report.ts:72–84`, `207–216`), so a pair's shards share a folder. `gate.ts` reads `needs.voiceover` and `needs.nvda`, which aggregate the matrix. The release check takes its names from the file. `verdict` reports "did not run" for an expected test whose shard is lost (`derive.ts:239–240`).
- **The fixtures.** EXECUTED: every other field kept; the red fixture's `nvda (firefox)` failure is carried to its three shards.
- **The ledger's semantics.** EXECUTED: `test.fail()` with one CI retry behaves as finding 4 says. E7's line matches CI's error.

## Constitution checks

- §4.1 source, not a package: untouched. Workflow, tests and the ledger only.
- §4.3 tokens are the one source: untouched. No item or style changes.
- §4.4 accessible and proven: Change A serves it. Speech verdicts exist only once the reader jobs finish. A shard stopped by its deadline still fails its job. Change B ledgers a performance budget, not an accessibility check; the tag waits for the ledger to empty, and the release check refuses until it does (EXECUTED).
- §4.5 every input pinned: no new input. `--shard` and `--global-timeout` are flags of the pinned Playwright 1.64.1.
- §4.6 dependencies named: none added.
- §5 the pipeline: Change A has research, a reviewed and dispositioned specification, tests seen failing first, and code. Change B is the owner's ruling in a small change's landing notes, as `AGENTS.md` asks. Both builds sit uncommitted in the one main working tree, not in worktrees of their own as `AGENTS.md` asks. Landing them as two commits keeps each review on its own diff. The scorecard re-run is criterion 6, still to do.
- §6 never: nothing committed or pushed. No prior art copied. No item's interface changes, so no migration note is owed.

## Verdict

- **Change A, `022l`:** Lands for criteria 1 to 3, with findings 1 to 3 as write-ins; criteria 4 to 6 wait on the next push run and the landing.
- **Change B, E7 in `022f`:** Lands, with findings 4 and 5 as write-ins to its notes and its ledger line.

## Disposition
