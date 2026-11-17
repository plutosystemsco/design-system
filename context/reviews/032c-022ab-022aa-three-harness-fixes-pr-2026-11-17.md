# Review of 032c, 022ab and 022aa — Three harness fixes (built)

Reviews the built changes for three lane-E small changes:

- [`specifications/032c-no-test-only-reaches-ci.md`](../specifications/032c-no-test-only-reaches-ci.md);
- [`specifications/022ab-the-streaming-budget-measured-off-the-wall-clock.md`](../specifications/022ab-the-streaming-budget-measured-off-the-wall-clock.md);
- [`specifications/022aa-no-screen-reader-wait-without-a-bound.md`](../specifications/022aa-no-screen-reader-wait-without-a-bound.md).

They rest on [the structural review](../research/2026-11-17-structural-review.md), Q1; [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) (*the memo*), §3.3, §4 and §9; and [`022x`'s change review](022xy-the-fifth-runs-test-faults-and-hot-corners-pr-2026-11-17.md), note 6. A small change has no spec review; this is its change review (constitution §5). This reviewer wrote none of the changes, specifications or memos.

Terms. A _focused_ test is one marked `.only`. A _chunk_ is one append of the stream's 50. A _window_ is one `sr.after()` or `sr.before()`. A _bound_ is a wait's timeout. A _busy loop_ is `yes > /dev/null`, one core's worth of load.

- **Date:** 2026-11-17
- **Status:** dispositioned 2026-11-17 (see Disposition). `032c` and `022aa` land. `022ab` lands, with the stream's 5 ms re-set owed before the next matrix run: run 6's own log already meets the design lead's condition for it.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the worktree `.claude/worktrees/lane-e-small`, branch `lane-e-small`, at `7ec5488`, uncommitted.
  - `git diff`: 31 files, +460 −86. Two Playwright configs, `tests/helpers/timings.ts`, 23 files in `tests/sr/`, five in `tests/unit/`.
  - Untracked: the three specifications.
  - Read beside them: `tests/sr/fixtures.ts` (the `sr` fixture's teardown), `sr.ts` whole; `013` decision 20 and its landing notes; Playwright 1.64.1's `locator.waitFor` and `_setupContextOptions` (how `actionTimeout` reaches a wait); `bun-types`' `test.d.ts`; the three `data-view-ready` setters in `src/routes/`.
- **Before and after:**
  - `git diff | sha256sum` → `fbb3f956…02496`;
  - `git status --porcelain | sha256sum` → `12a1eb20…8c2`, 34 entries;
  - the specifications: `d4307f53…` (`032c`), `1c0bdbd6…` (`022ab`), `4da72d35…` (`022aa`).
  - The same after every probe. This review is the only new file.
  - Each file a probe changed was copied to the scratchpad first and copied back: `sha256sum -c` passed for both configs and `highlight-session.test.ts`. Each throwaway spec (`tests/e2e/zz-rev-*`, `tests/sr/zz-rev-*`) was deleted after its run.

## Re-ran

EXECUTED in this container, Bun 1.4.4, Playwright 1.64.1, 4 cores, beside other agents' runs (load average 2 to 16). Browser runs used `E2E_PREBUILT=1 E2E_PORT=4281` against the worktree's build. There is no `src/` change, so the build is current.

One slip, stated so the load figures read right. A busy loop started by a mis-scoped command was orphaned and ran from 04:46 to 04:58. So the "two busy loops" batches below, the dry speech runs and the gate's unit runs had three. That is more load, not less. The same slip ran one batch in the main checkout, at the same commit, with the old tests: it is reported as a "before".

**`032c`.**

- A throwaway `tests/e2e/` spec, one plain test and one `test.only`, `chromium-light`:
  - `CI=1`: **exit 1**, Playwright's code frame on the `test.only` line, no test run. Without a file filter, the whole project: the same, exit 1.
  - No `CI`: **1 passed**, exit 0. `.only` still works locally.
- A throwaway `tests/sr/` spec, `-c playwright.sr.config.ts --project=chromium`:
  - `CI=1`, `SR_READER=voiceover` and `SR_READER=nvda`: **exit 1**, "item focused with '.only' is not allowed due to the 'forbidOnly' option in '../../playwright.sr.config.ts'".
  - `SR_DRY=1`, no `CI`: **1 passed**.
- `matrix.test.ts` with both configs at `7ec5488` → **4 fail, 15 pass**: `032c`'s two and `022aa`'s two. With the built configs → **19 pass**.
- Bun, in a scratch folder, one file with a `test.only`: no `CI`, 2 pass; `CI=1` and `GITHUB_ACTIONS=true`, "error: .only is disabled in CI environments", 1 pass and an error; **`CI=false`, 2 pass**. So Bun's own refusal has an off switch, which the source guard covers. Playwright reads `!!process.env.CI`, so `CI=false` still forbids there.
- The source guard's regex, probed with ten forms (finding 7).

**`022ab`.**

- At rest, each test alone, 3 runs: the stream, each chunk's best of 5, **p95 3.06 to 3.82 ms**; the specimens, CPU 0.79 to 0.83 s first pass and 12.0 to 15.8 ms warm (wall 0.91 to 0.92 s; 13.2 to 18.5 ms).
- **Before, the main checkout's old tests**, three busy loops, 10 runs each: the stream **3 of 10** passed (best p95 3.47 to 7.32 ms); the specimens **3 of 10** (warm 33.5 to 92.4 ms on the wall clock).
- **After, this worktree**, three busy loops, 10 runs each: the stream **10 of 10** (p95 3.31 to 3.85 ms, each with 5 streams); the specimens **10 of 10** (CPU 0.70 to 0.83 s and 8.6 to 14.7 ms; wall 0.92 to 1.19 s and 14.3 to 29.8 ms).
- **Planted in each chunk**, a busy wait after `session.lines()`:
  - 0.5 ms: **1 of 3 passed** (3.71, best of 10); 2 failed (4.15 and 4.02, best of 15).
  - 0.75 ms: **3 of 3 passed** (3.88 to 3.95, best of 5 to 11). The old statistic, logged beside it, read 4.40 to 4.51: it would have failed all three.
  - **8 ms in every 7th update**, counted across the process: **3 of 3 passed**, p95 3.24 to 3.67. Every single stream's p95 read 10.35 to 11.85 ms (finding 1).
  - 20 ms in every 10th update: failed, 22.33. Its stalls land on the same chunks in every stream.
- **`013`'s source on this machine:** `git archive 4822ae5` in the scratchpad (this worktree's `node_modules`), with the new stream test copied in: **3.54 to 3.78 ms**. HEAD reads 3.06 to 3.85. So the stream has not slowed since `013`; this machine reads slower than `013`'s 2.6 ms.
- **The clocks**, in scratch scripts:
  - `process.threadCpuUsage()` advances in steps of 0.3 to 3.7 ms, not a clean 4 ms; the kernel has `CONFIG_TICK_CPU_ACCOUNTING=y`, `HZ=250`, as the spec says.
  - `clock_gettime(CLOCK_THREAD_CPUTIME_ID)` through `bun:ffi`: 0.5 ms busy reads 0.503 ms, 1 ms reads 1.002 ms, 50 ms asleep reads 0.15 ms; 0.45 µs a call. A precise thread clock is to hand (findings 1 and 4).
  - The same clock per chunk, one stream at a time: p95 3.59 to 3.84 at rest, median of five 3.72 to 3.84; under two busy loops, 3.68 to 5.24, median 3.87 to 4.25. The wall-clock single streams beside them read 3.76 to 7.95.
  - The specimens' first pass, a fresh process: main thread 777 to 803 ms, **all threads 1,289 to 1,321 ms**, wall 837 to 879 ms. Twenty warm passes: main thread 8.0 to 23.4 ms against wall 11.7 to 43.6 ms.

**`022aa`.**

- My own grep of `tests/sr/` (not `mutations/`) at `7ec5488`, for every `waitFor*`, `toPass` and `expect.poll`: **24 with no `timeout`**, exactly the spec's list. In the worktree: none; the six left are `appears()`'s own two and the four bespoke bounded waits (`code-block`, `dropdown-menu`'s sub-menu, `toast`'s two, `tooltip`).
- No other wait form in the suite: no `new Promise`, polling loop, `setInterval`, async `evaluate`, or web-first assertion (`grep`).
- A throwaway `tests/sr/` spec, `SR_DRY=1`, `chromium`:
  - a **bare `waitFor()`** under the built config: failed in **10.6 s**, "TimeoutError: waitFor: Timeout 10000ms exceeded". `actionTimeout` alone now bounds it (READ: `locator.waitFor` takes `this._frame._timeout(options)`, the context default that `actionTimeout` sets).
  - `appears()` timing out inside `sr.after()`, then a `click()` on the same missing element: failed in 20.5 s on **"click: Timeout 10000ms exceeded"**. No X0 (finding 5).
- The scan, probed with eleven forms (finding 6).
- `--list --shard=k/5`, `CI=1 SR_READER=voiceover`: **19, 17, 19, 16, 16** in webkit and in chromium; the chart in shard 1, the dropdown menu's three in shard 2, as `022q` decision 9 and `022x`'s review.
- `SR_DRY=1 bun run test:sr --project=chromium` → **87 passed** (1.5 m); `--project=webkit` → **87 passed** (2.3 m). Load average 9 to 16.

**The gate.**

- `bun run check` → 2434 files, 0 errors, 0 warnings.
- `bun run lint` → "All matched files use Prettier code style!".
- `bun test ./tests/unit` at load average 15 → **1950 pass, 2 skip, 0 fail** (stream 3.40 ms; specimens 0.63 s and 14.6 ms of CPU, 1.12 s of wall).
- The same with two more busy loops → **1949 pass, 2 skip, 1 fail**: `thumbnails.test.ts`, "Button's route stales Button alone", 5.62 s against Bun's 5 s default. Not this change's: the file is untouched, and alone it passes 10 of 10 at rest and under two busy loops. The two timing tests passed in that run (3.67 ms; 0.78 s and 11.4 ms).
- `CI=1 … playwright test tests/e2e/upgrade.spec.ts --project=chromium-light --reporter=list` → **16 passed**. The list reporter replaces CI's blob, so no `blob-report/` was written; `forbidOnly`, retries and `failOnFlakyTests` still apply.
- **Scope:** nothing under `src/`, `static/` or `.github/` changed (`git status`).
- Not run: Firefox, any real reader, macOS, Windows.

## Findings

1. **Medium (`022ab`, the stream): each chunk's best hides a stall that lands on different chunks in different streams.**
   - EXECUTED: an 8 ms stall in every 7th update **passed 3 of 3**. Each stream had 7 slow chunks of 50; each stream's p95 read 10.4 to 11.9 ms, nearly three times the budget. The old statistic read 10.35 to 10.80, and fails it.
   - INFERRED, why: 50 is not a multiple of 7, so each stream's stalls fall one chunk later than the last. Over 5 to 15 streams, every chunk gets a clean run, and its best is clean. A stall tied to the session or to the text (the `013` notes' re-parse on a closing string) falls on the same chunks, and still fails: 20 ms in every 10th failed.
   - INFERRED, what real code does this: a cost driven by the process, not the chunk. A garbage-collection pause from an allocation regression is the likely one; a cache shared across sessions is another. A person streaming a reply sees every one of those pauses.
   - EXECUTED, the same at a smaller scale: 0.75 ms planted in every chunk passed 3 of 3 (3.88 to 3.95), where the old statistic read 4.40 to 4.51. The best of each chunk reads 0.3 to 0.8 ms below the best stream's p95 on the same code.
   - So the test now measures each chunk position's steady cost, not decision 20's "≤ 4 ms per chunk, p95". The spec says the budget is not this change's to move. Its statistic moves the budget all the same.
   - Fix: keep each chunk's best, which does cure run 6's flake, and add a second check on what it throws away. Two options, the first preferred:
     - (a) Time each chunk on the main thread's clock as well, `clock_gettime(CLOCK_THREAD_CPUTIME_ID)` through `bun:ffi` (clock 3 on Linux; 16 on macOS). It is precise to the microsecond here, and a waiting thread does not advance it. Hold the median of the streams' CPU-time p95s to a looser ceiling, such as 6 ms. EXECUTED, three runs under two busy loops: that median read 3.87 to 4.25, against 10.8 for the planted stall. Three runs is a probe, not a proof: the builder would need its 10 of 10 under load.
     - (b) Without a new clock: hold the median of the streams' wall-clock p95s to 8 ms. Cheaper, but load moves it too: 7.38 in the gate's run at load average 15, close to the line.
     - Either way, the check is seen failing first with the every-7th stall, and the design lead records the statistic in `022ab`'s landing notes and beside decision 20's row.

2. **Medium (`022ab`, a question for the design lead): the stream's margin is the machine's own spread, so a sub-millisecond regression passes or fails by chance.**
   - EXECUTED: the same code reads 3.06 to 3.85 ms at rest, from process to process. 0.5 ms planted: 1 pass, 2 fails. 0.75 ms planted: 3 passes. Neither is a hidden regression: both are under 4 ms when they pass. But the line sits inside the noise.
   - EXECUTED: `013`'s source reads 3.54 to 3.78 on this machine. So the code is where `013` left it; `013`'s 2.6 ms was a faster machine. CI's runner is unmeasured: run 6's log printed only the failing figure.
   - What the design lead should decide, once the next `checks` log prints the new `stream:` line:
     - **(A, recommended) If CI reads 3.5 ms or more, re-set the stream's budget to 5 ms**, as checkpoint 2 re-set E7's Python bar from 8 to 12 ms: the measured figures, the reason and the new bar recorded in decision 20's table and its landing notes. A 4 ms chunk is a quarter of a 16.7 ms frame, so 5 ms still leaves room. Take it with finding 1's ruling, so both change together.
     - (B) Keep 4 ms, and accept that `checks` may fail on a slow runner with no code change.
     - (C) Make the stream a tripwire against a recorded baseline. This needs a stored figure per runner; not recommended.

3. **Low (`022ab`, the specimens): the first pass in main-thread CPU time cannot see a regression that waits.**
   - EXECUTED: the first pass spends 1,289 to 1,321 ms of CPU across threads, 777 to 803 ms of it on the main thread, in 837 to 879 ms of wall time. About 500 ms runs on JavaScriptCore's compiler and collector threads.
   - INFERRED: a larger grammar whose WASM compiles off the main thread, or a slower file read, adds wall time the main thread spends waiting. Decision 20's first pass is a latency figure, "a fresh process, no module cached", and that is where such a regression would land. The spec says so in its notes; the test does not guard it.
   - Fix: keep CPU time as the judge and add a loose wall-clock ceiling, such as 3 × 1.5 s = 4.5 s. The worst wall figure seen under load is 3.40 s (the spec, load average 12 to 16); 2.80 s here. A gross wait regression still fails; load does not.

4. **Low (`022ab`): the spec's reason for not timing the stream in CPU time holds for `threadCpuUsage()` only.**
   - The spec: "A 3 ms chunk cannot be timed with it". EXECUTED: `clock_gettime(CLOCK_THREAD_CPUTIME_ID)` through `bun:ffi` reads a 0.5 ms busy wait as 0.503 ms. `bun:ffi` is part of Bun, not a dependency.
   - Its CPU time still rises under load (shared caches and cores): single streams read up to 5.24 ms under two busy loops. So it is a better second check (finding 1, option a), not a full replacement.
   - Fix: one sentence in *Why not CPU time*, naming the precise clock and why it was or was not used.
   - Checked, not a finding: the warm pass's quantisation. A 4 ms tick on a reading of about 12 ms can under-read, and the best of five leans low. That is at most about 4 ms of a 50 ms budget, 8%. The planted 3 ms per specimen (54 ms more) still failed in the spec's run.

5. **Low (`022aa`): an `appears()` that times out inside a window loses its X0 if the action then throws.**
   - EXECUTED: `appears()` on a missing element, then `click()` on it, inside `sr.after()`, dry. The test failed on "click: Timeout 10000ms exceeded" after 20.5 s. The fact and the X0 sat in `late`, and `listen()` never reached its `judge()`.
   - READ: no call site does this today. The seven direct calls in a window (`alert`, `chat`, `marker`'s second, `page-states`, `sign-up`'s two, `toast` S9) end their action with the `appears()`. So do the ten `open(page)` and `pressToOpen(page)` helpers, each called as a window's whole action (30 calls, `grep`). So it is latent, but the helper's doc invites a step after it.
   - Fix: in `listen()`, when `capture()` throws and `late` is not empty, push the late faults and attach `faults.json` before rethrowing. One `sr-harness.test.ts` case: a timeout, then a throw, in a window.

6. **Low (`022aa`): the static scan has false positives and misses; none is live.**
   - EXECUTED, false positives: a comment naming a bare `waitFor()`; options passed as a variable (`waitFor(o)`); `expect.poll()` with no `timeout`, which `expect.timeout` (5 s) already bounds; `timeout: 0.5 * 1000`, read as 0.
   - EXECUTED, misses: `timeout` only inside a callback (`waitForFunction(() => window.timeout === 1)`); `timeout: undefined`; a variable that holds 0; the word in a comment (`{ state: "visible" /* no timeout */ }`); `waitForNavigation`, not in its list.
   - EXECUTED: these misses no longer hang. A bare `waitFor()` failed at 10.6 s under the built config, because `actionTimeout` sets the default for `waitFor`, `waitForSelector`, `waitForFunction` and `waitForEvent`, and `navigationTimeout` for `waitForURL` and `waitForLoadState`. Only `toPass()` is still unbounded by default. So the scan's real job is that each wait records why it failed, and that job it does.
   - Fix (optional): say so in the scan's doc and the spec's check ("every wait names its bound"), and strip `//` and `/* */` comments before matching.

7. **Low (`032c`): the source guard misses three real forms, and flags `.only(` in strings and comments.**
   - EXECUTED, missed: Playwright's `test.describe.serial.only` and `test.describe.parallel.only`; Bun's `test.if(c).only` and `skipIf(c).only` (READ: `test.d.ts` types each as a `Test` with `only`); a call split over two lines. Flagged: a string such as `"never commit test.only("` and a comment. The builder met the second already, in its own doc comment.
   - INFERRED: both configs' `forbidOnly` catches the Playwright forms in CI, and Bun refuses `.only` under `CI` unless `CI=false`. The guard is the third net, so this is Low.
   - Fix (optional): `/\b(?:test|it|describe|suite|serial|parallel)\s*\.\s*only\s*[.(]|\)\s*\.\s*only\s*[.(]/`, with two fixture lines.

8. **Note (`022aa`): whether 10 s holds under VoiceOver cannot be read from run 5.**
   - READ: the memo gives minutes per shard and per test (§4: 1.39 to 1.68 a test under VoiceOver, 0.46 to 0.50 under NVDA), not per step. The only step figures it gives are guidepup's: "VoiceOver not running", 5 minutes; "VoiceOver cannot be started", 13.8 s; "Unable to send keys", 15 s. None is a Playwright wait or action, so none meets the new bounds.
   - READ: every ready mark is set on mount (`(view)`, `(shell)` and `(example)` layouts), not after highlighting. The chat reply's wait had 10 s before and passed in runs 5 and 6.
   - INFERRED, most exposed to 10 s: `sr.open()`'s ready mark on a shard's first test, with a cold browser building its tree for VoiceOver; and `page-states`, whose `goto` and ready mark run inside a window. A DOM action (`focus`, `click`, `press` on a locator) returns once the page has it; VoiceOver speaks after. So 10 s for an action, and 30 s for a load from the local preview server, look safe. A cold load in CI was never timed; 30 s is three times the action bound and far above any figure in the memo.
   - Next: in the next matrix run's logs, look for "within 10 s" and "Timeout 10000ms". A wait that is slow but arrives now shows as flaky, by name, on retry, where it once passed slowly or hung for ten minutes.

9. **Nit (`022aa`): the speech config now imports `tests/sr/sr.ts` to read one constant.** At config load that pulls in `@guidepup/guidepup`, `rules.ts`, `cover.ts` and `@playwright/test`'s `expect`. EXECUTED: it loads, under `CI` with both readers and locally (`matrix.test.ts`, the dry runs, the shard lists). Optional: move `WAIT_MS` to a leaf module beside `reader.ts`.

**Checked, not findings.**

- The 24 waits are the spec's 24, not the review's 21 (EXECUTED grep, above). `chat.sr.ts`'s reply wait keeps its 10 s and gains a message.
- `appears()` outside a window fails at once: as X0 in a real run, on the fact in a dry one (READ, `judge()`; and `sr-harness.test.ts`'s cases).
- A timeout is told from a crash by `e.name === "TimeoutError"`, which Playwright sets (EXECUTED: the bare wait's error is a `TimeoutError`).
- `listen()`'s split into `capture()` keeps each reader's captures as they were; the dry reset of `phrases` and the item text simply moved below.
- `forbidOnly: CI` uses each config's own `CI`. The sr config's test checks both readers.
- The scorecard: no row moves (READ, `benchmark-scorecard.md`). Row 3, accessibility evidence, scores what is published and recorded; row 8, page weight and paint, scores the site's budgets, not `013`'s Bun timings. These are fixes to tests. This confirms each spec's "no row should move".

## Constitution checks

- §4.1 source, not a package; §4.3 tokens; §4.5 and §4.6 pins and dependencies: met. Tests and two configs only. No dependency, token or item changes. Finding 1's option (a) uses `bun:ffi`, which ships with Bun.
- §4.4 accessible by default, and proven: met. `032c` closes a hole in the evidence. `022aa` makes a hang fail in 10 s, by name, and keeps every rule as it was. `022ab` touches no accessibility evidence.
- §5 a small change: each has its defect, fix and check on one page. Each check was seen failing first: EXECUTED here for `032c`'s and `022aa`'s config tests, and for both timing tests under load (the old tests in the main checkout). This is the review by someone who did not write them. Finding 1 asks whether `022ab` has changed what a decision-20 budget measures. If so, its ruling belongs in `022ab`'s landing notes and beside decision 20's table.
- §6 never: nothing committed or pushed, no prior art copied.

## Verdict

These were the verdicts on the first build. The closing verdicts end the Disposition.

- **`032c`: lands.** Both configs refuse a focused test in CI, before any test runs, and allow it locally (EXECUTED). Bun's own refusal and the source guard cover the unit suite. Finding 7 is optional.
- **`022ab`: lands once finding 1 is fixed or ruled.** The flake is real and the cure works: 10 of 10 under load, against 3 of 10 before. But each chunk's best passes a stall that puts every stream's p95 at 11 ms. Either add the second check (option a preferred), or have the design lead accept that blind spot in writing. Finding 2 is the design lead's, best decided with finding 1 once CI's figure is read. Finding 3 is a one-line guard worth taking in the same pass; finding 4 is a sentence.
- **`022aa`: lands.** Every wait has a bound and a message, and the config bounds every action and navigation (EXECUTED). Finding 5 is a short change with one unit case, worth taking before the next run. Findings 6 and 9 are optional. Note 8 is for whoever reads the next run.

## Disposition

The design lead ruled on findings 1, 2, 3, 5, 6, 7 and 9, and the builder applied the rulings in the same worktree. This re-check reads the rebuilt diff and the three specifications' "After the change review" notes, and re-runs what they claim.

**State.**

- Before and after this re-check:
  - `git diff | sha256sum` → `68016d44…25d76b`, 31 files, +509 −84;
  - `git status --porcelain | sha256sum` → `8525735b…564af`, 35 entries, this review among them;
  - the specifications: `0a7cdd66…` (`032c`), `ce3c2aa9…` (`022ab`), `8f6ad31d…` (`022aa`).
- Every file a probe changed was copied to the scratchpad first and copied back. `sha256sum -c` passed for `highlight-session.test.ts`, `timings.ts` and `sr.ts`. The one probe file in `tests/sr/` was deleted. No busy loop was left running (`pgrep`). Only this file was edited.

**The rulings, as the specifications record them.**

- Finding 1: judge whole streams. Each stream gets its own p95, and the best must be 4 ms or less, from 5 streams, up to 15 while it is over. No `bun:ffi`.
- Finding 2: the budget stays 4 ms until CI's next `checks` log prints the figure. If CI reads 3.5 ms or more, a later change re-sets it to 5 ms.
- Finding 3: a loose wall-clock ceiling on the first pass, 4.5 s.
- Finding 5: fixed in `listen()`, with a unit case.
- Finding 6 and the nit (9): left.
- Finding 7: the guard extended to `describe.serial.only`, `describe.parallel.only` and `test.if(…).only`. Strings, comments and split calls are left.

**Re-checked (EXECUTED, load average 0.1 to 2.4 unless stated).**

- **Finding 1, fixed.** The moving stall, 8 ms in every 7th update: **3 of 3 failed**, best 10.17 to 10.48 ms of 15 streams. 1 ms in every chunk: **3 of 3 failed** (4.28 to 4.44). 0.5 ms: 2 passed (3.73, 3.79), 1 failed (4.27), as the margin allows (finding 2).
- **The stream under load.**
  - At rest: 3 of 3 passed, 3.36 to 3.82 ms, each within 5 streams.
  - Two busy loops: **10 of 10**, 3.04 to 3.95 ms; nine within 5 streams, one with 6.
  - Four busy loops, one for each core: **5 of 5**, 3.09 to 3.95 ms; one needed 8 streams.
  - So load on its own, even with every core held, did not fail it here. The builder's 1 of 10 came with another agent's WebKit run beside the loops: more runnable threads than cores, for longer than 15 streams last.
- **Finding 2, the log line.** It prints, for example, "stream: best p95 3.51 ms per chunk, of 5 streams: …". The ruling is in `022ab`'s landing notes.
- **Finding 3, the ceiling.** A planted sleep after each specimen of the first pass, at rest: 200 ms passed twice, at 4.44 and 4.48 s of wall time; 250 ms **failed**, at 5.37 s, "Expected: <= 4500". The CPU figure stayed at 0.80 to 0.87 s throughout.
  - So the ceiling catches about 3.6 s of added waiting, which is loose, as ruled. The builder's 200 ms case failed at 4.90 s under load. At rest it passes, so the landing note's "seen failing first" sits on the line. Recording the 250 ms case beside it would make that check hold on a quiet machine.
  - The specimens under two busy loops: 10 of 10. CPU 0.71 to 0.79 s and 10.2 to 18.3 ms; wall 0.80 to 0.91 s.
- **Finding 5, fixed.**
  - `sr-harness.test.ts` → **21 pass**. With the new `catch` taken out of `listen()` → **1 fail**, the new case.
  - The review's dry probe, run again with the JSON reporter: the test still fails on "click: Timeout 10000ms exceeded". Its `faults.json` now holds the X0: "the never element was not visible within 10 s; focus was on <body>".
- **Finding 7, fixed.** The new regex flags all three forms, and `describe.skipIf(c).only` too. It passes `--only` flags and a plain `.only` property. It now also flags a call result's `.only()` method, such as `pick(flags).only()`. That is fail-safe, and no file in `tests/`, `src/` or `scripts/` has one (`grep`). `matrix.test.ts` → 19 pass.
- **The gate.**
  - `bun run check` → 2434 files, 0 errors.
  - `bun run lint` → clean.
  - `bun test ./tests/unit` → **1951 pass, 2 skip, 0 fail** at rest (stream 3.51 ms; specimens 0.80 s and 14.9 ms of CPU, 0.85 s of wall). With two busy loops → **1951 pass, 0 fail** (3.80 ms; 0.76 s, 16.1 ms, 0.89 s).
  - The dry speech run → **87 passed** in chromium (1.1 m) and in webkit (1.4 m).
  - The VoiceOver shards: 19, 17, 19, 16, 16.
  - `upgrade.spec.ts`, `CI=1`, `chromium-light` → 16 passed.
  - Nothing under `src/`, `static/` or `.github/` changed.

**The question put to this re-check: will the ruled statistic still fail CI's `checks` job, as in run 6?**

- READ, the `checks` logs of runs 5 and 6, fetched 2026-11-17 through the GitHub connector. The code is the same in both runs, and so is the old statistic, the best of three streams:
  - run 5 (job 133675642585): "stream: p95 2.91, 2.89, 2.96 ms per chunk; best 2.89". The unit step took 35.96 s.
  - run 6 (job 133675911109): "stream: p95 4.15, 4.02, 4.08 ms per chunk; best 4.02". The unit step took 48.62 s.
  - The specimens, on the wall clock: 0.65 s and 23.9 ms (run 5); 0.80 s and 30.4 ms (run 6).
- INFERRED, what that shows:
  - Within each run, the three streams lie within 0.13 ms of each other. Load scatters streams: here, single streams under load read from 3.5 to 20 ms. So neither runner was loaded the way this container is. CI's `checks` job has its own VM, and Bun runs the unit files one at a time: it is the quiet case.
  - Between the runs, everything is about 1.2 to 1.4 times slower: the stream (4.02 against 2.89), the whole unit step (48.62 s against 35.96 s), and the specimens (0.80 against 0.65 s). That is a slower runner, not a busier one.
  - So the risk is the runner's speed, not load. Five to fifteen whole streams rescue a stream that load slowed. They cannot rescue a machine whose quiet cost is over 4 ms. On run 6's runner, 15 streams would read about 4.0 to 4.15, and the best would pass only if one stream dips below 4.00 by chance. Each chunk's best, the first build, would not have saved it reliably either.
  - One of the two runners seen was this slow. So the next push's `checks` has a real chance of failing on the stream, with no code change, until the budget moves.
- **Ruling 2's condition is already met.** "If CI reads 3.5 ms or more": run 6 read 4.02. Waiting for one more run only risks another red `checks`.
- Recommended to the design lead, as a question with options:
  - **(A, recommended) Make the 5 ms re-set now, before the next push**, in `022ab` or a one-line small change after it. It would record run 5's 2.89 and run 6's 4.02 in decision 20's table and landing notes, as checkpoint 2 did for E7. That leaves 20% over the slowest runner seen; a runner 1.7 times run 5's would read about 4.9.
  - (B) Wait for the next run's figure, as ruled, and accept a possible red `checks`.
- The specimens are no such risk. CI's wall figures, 0.65 to 0.80 s and 24 to 30 ms, are about half their budgets, and a quiet VM's CPU time is lower still.

**Verdicts, closing.**

- **`032c`: lands.** Both configs forbid `.only` in CI (EXECUTED in the first review). The guard now sees the three forms the ruling named. Its one new false positive is fail-safe and not in the tree.
- **`022ab`: lands, with the 5 ms re-set owed before the next matrix run (option A above).**
  - The ruled statistic sees the moving stall and a 1 ms regression. It holds with every core held, and the 4.5 s ceiling catches a gross wait.
  - What it cannot do is pass on a runner like run 6's, which read 4.02 ms quiet. Moving the budget is the design lead's decision, and their own condition for it is met.
  - Record the 250 ms case beside the 200 ms one in the landing notes, so the ceiling's failing-first check holds on a quiet machine.
- **`022aa`: lands.** Finding 5 is fixed and its case was seen failing first. Under the real fixture, the X0 reaches `faults.json` (EXECUTED). Findings 6 and 9 are left by ruling. Note 8 stands for whoever reads the next run: look for "within 10 s" and "Timeout 10000ms".
