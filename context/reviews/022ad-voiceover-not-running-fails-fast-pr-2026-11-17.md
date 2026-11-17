# Review of 022ad — "VoiceOver not running" fails fast (built)

This is the change review of the lane-E small change [`specifications/022ad-voiceover-not-running-fails-fast.md`](../specifications/022ad-voiceover-not-running-fails-fast.md). A small change has no spec review, so this is its only review (constitution §5). The reviewer wrote none of the change, its specification or the memos it rests on.

It rests on [the seventh matrix run](../research/2026-11-17-the-seventh-matrix-run.md), §3.6, §3.8 and §5; [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), §3.3 and §9.3–9.4; and [`022aa`'s change review](032c-022ab-022aa-three-harness-fixes-pr-2026-11-17.md), note 8.

Terms. The _helper_ is `navigateToWebContent()`, guidepup's step that moves VoiceOver into the page. The _loop_ is its `openItemChooser`, a `while` loop that presses VO-I until VoiceOver says "item chooser". A _stall_ is a call still running when its bound is up. _Settled_ is the builder's promise that ends when the first helper ends, either way.

- **Date:** 2026-11-17
- **Status:** dispositioned 2026-11-17 (see Disposition). Lands. Findings 1 to 4 were taken, and the re-check confirms each.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the worktree `.claude/worktrees/lane-e-run8`, branch `lane-e-run8`, at `db8fb65`, uncommitted.
  - `git diff`: 3 files, +308 −10 (`tests/sr/sr.ts`, `tests/sr/fixtures.ts`, `tests/unit/sr-harness.test.ts`).
  - Untracked: the specification, `591ff6f0…`.
  - Read beside them: `@guidepup/playwright` 0.21.0's `navigateVoiceOverToWebContent.js`, `screenReaderTest.js` and `voiceOverTest.js`; `@guidepup/guidepup` 0.40.0's `ScreenReader.js`, `macOS/VoiceOver/VoiceOver.js`, `VoiceOverClient.js`, `start.js`, `terminateVoiceOverProcess.js`, `waitForRunning.js`, `waitForNotRunning.js`, `teardown.js`, `macOS/errors.js` and `constants.js`; `playwright.sr.config.ts`; `tests/sr/chart.sr.ts`; `scripts/ci/report.ts` (what reads `phrases.json`).
  - Run 7's job logs (`44014551614`): VO wk 1, 2, 3 and 4, through the GitHub tools.
- **Before and after:**
  - `git diff | sha256sum` → `5aaf686a…bc7684b`;
  - `git status --porcelain | sha256sum` → `d953b2c1…b1a80c`, 4 entries.
  - The same after every probe and every gate run. This review is the only new file.
  - For the failing-first run, `sr.ts` and `fixtures.ts` were copied to the scratchpad, replaced, and copied back. `sha256sum -c` passed for both. The two probe scripts live in the scratchpad only.

## Re-ran

EXECUTED in this container, Bun 1.4.4, Playwright 1.64.1. Browser runs used `E2E_PREBUILT=1 E2E_PORT=4262` against the worktree's build. Nothing under `src/` changed, so the build is current.

**Failing first.** `sr.ts` and `fixtures.ts` at `HEAD`, with only `HELPER_MS` and `RESTART_MS` added, then `sr-harness.test.ts`: **7 fail, 24 pass**, as the spec says.

- Five waited out bun's 5 s test timeout: the stall recovered by a restart, the stall twice, `start()` failing, `stop()` hanging, and NVDA's stall.
- The two "VoiceOver not running" cases received the bare error, `Received: "VoiceOver not running"`.
- The thrown-on error, the helper that ends, and the constants passed.
- Restored: **31 of 31 pass**. Twenty more runs of the file alone: 0 failures.

**A probe closer to guidepup.** A scratch script drove the built `Sr` with a fake VoiceOver that copies guidepup's state: `#started` and `#stopping` guard every call, and `stop()` waits for the action in flight, then clears the flags. Its helper runs the loop and removes a marker in `finally`. It counted the loops alive at once, calls from an old loop after a restart, and markers left. Bounds 1 s and 2 s. `process.on("unhandledRejection")` listened throughout.

| Case | `open()` | Time | Loops at once | Old-loop calls after restart | Markers left |
|---|---|---|---|---|---|
| stalls, then the restarted helper ends | opened | 1.5 s | 1 | 0 | 0 |
| stalls twice | X0, both named | 2.3 s | 1 | 0 | 0 |
| `stop()` throws a timeout | X0, "restart failed: Timed out waiting…" | 1.2 s | 1 | 0 | 0 |
| `start()` slower than the restart's bound | X0, "restart did not end within 2 s" | 3.0 s | 1 | 0 | 0 |
| NVDA stalls | X0, no restart | 1.0 s | 1 | 0 | 0 |

- **Unhandled rejections: none.** The second helper, still running after an X0, ended at the fixture's `stop()` with "VoiceOver not running", and that was handled.
- A second script: a race's losing branch that later rejects with some other error. Not unhandled either. `Promise.race` subscribes to every branch.

**The gate.**

- `bun run check`: 2436 files, 0 errors, 0 warnings.
- `bun run lint`: clean.
- `bun test ./tests/unit`: **1987 tests, run four times.** Three runs passed every test. The first run had **1 fail**, and its output was not kept, so it is not named. Note 5.
- The dry speech run, `SR_DRY=1 bun run test:sr`: **chromium 87 of 87** (1.4 min); **webkit 87 of 87** (1.9 min).
- `SR_READER=voiceover`, `--project=webkit --list --shard=k/5`: **19, 17, 19, 16 and 16 tests**. Run 7's VoiceOver jobs ran the same counts. So the split is unchanged.

## What was settled

**1. The builder's claim 1 holds (READ).**

- `openItemChooser` is a `while` loop with no count. It goes round until `lastSpokenPhrase()` contains "item chooser". `selectWebContentItem` after it is bounded: 10 attempts, then a named error.
- `VoiceOver.js` throws `ERR_VOICE_OVER_NOT_RUNNING` from every command while `!#started || #stopping`. `stop()` sets `#stopping` first. Nothing in guidepup checks the process for this error.
- Run 7's logs show it. The chart failed at 7.07 min (04:19:00.6 to 04:26:04.7) against its 420 s timeout. The spinner failed at 5.1 min against 300 s. Both raised "VoiceOver not running" at `VoiceOver.js:1104` (`lastSpokenPhrase`'s guard), from `navigateVoiceOverToWebContent.js:23`. So the loop spun until Playwright timed the test out, and teardown's `stop()` made its next read throw, a few seconds later.

**2. The builder's claim 2 holds (READ, then the probe).**

- Can two loops run? Only if `start()` ran while the old loop still lived. `restart()` awaits `stop()`, then `settled`, then `start()`. So `start()` waits for the old helper to end, its `finally` (the marker's removal) included.
- Can `stop()` return while the old loop holds a pending `osascript`? `stop()` calls `VoiceOverClient.stop()`, which awaits every queued and in-flight action (`#waitForAllActions`). Only then does it terminate VoiceOver. A key or a capture in flight ends first. The loop's next call meets `#stopping` or `!#started` and throws. The guard trips at every moment from `stop()`'s first line on, because `#started = false` is set before the `finally` clears `#stopping`.
- What if the old helper hangs outside guidepup's guarded calls, in `macOSActivateId` or a `page.evaluate`? Then `settled` never resolves, `start()` never runs, and the restart's bound fires: X0. No second loop. The fake reader does not test this case (finding 4).
- What if `stop()` throws? `restart()` skips `settled` and `start()`, and the bound returns "restart failed". The loop still ends: `#stopping` was true for the whole attempt.
- Does `start()` after `stop()` in one process re-apply guidepup's settings? Yes. `start()` mounts guidepup's preferences again, and `stop()` unmounts them. It writes `settings` if any are given. VoiceOver's fixture options carry none (`{ capture: true }`). A new `VoiceOverClient` takes `capture` from those options.
- Does it need `@guidepup/setup` again? No. Setup configures the OS once per job (the workflow's `sr:setup` step). And `screenReader` is a test-scoped fixture, so one worker already runs start, stop, start, stop for every test in its shard.
- The restarted helper uses the same singleton. `screenReaderTest`'s `navigateToWebContent` closes over `guidepup.voiceOver`, `page` and the browser's id, and `ScreenReader` forwards `start` and `stop` to that same `voiceOver`.

**3. The race (EXECUTED, the probe).** When the bound wins, the helper's promise is left running. It has two handlers: `bounded`'s `.then` inside the race, and `settled`. Its later "VoiceOver not running" is turned into a reason or swallowed, and any other error is handled by the race's subscription. No rejection went unhandled in any case.

- Leak into the next test: after an X0, the second helper's loop keeps pressing keys until the fixture's `stop()`, a few seconds. That `stop()` ends it. A failed test also gets a fresh worker in Playwright. One case leaves state behind: finding 3.

**4. Time (READ, the config and the logs).**

- The worst case is 60 s for the helper, up to 60 s for the restart, and 60 s for the helper again: **180 s**, plus the fixture's start and the page load.
  - The suite's 5-minute timeout holds it.
  - The chart's 7-minute timeout holds it, ending at about 3.3 minutes with an X0, where run 7 lost 7.1.
- A recovered restart adds about 60 s plus a stop, a start and a helper to a test.
  - The longest normal VO wk tests in run 7 are the "page behind" walks: 3.0 min (alert-dialog), 2.8, 2.0 and 1.9. With a restart they still fit 5 minutes.
  - The chart may not fit: finding 2.
- The shard's 40-minute deadline. Each stall now costs at most about 3.3 minutes an attempt, against 5.1 or 7.1 before.
  - Run 7's VO wk 1 (29.5 min, with the chart's 7.1) gets roomier.
  - Run 6's VO wk 3 lost about 15 of its 38.0 minutes to three stalls. Under this change those three cost at most about 10 minutes, and about 4.5 if each restart recovers.
  - A shard where every test stalls twice on every attempt would still miss 40 minutes (19 × 3 attempts × 3.3 min). Nothing short of failing the shard at once prevents that. Before this change it would have missed by more.
- Is 60 s enough for a normal helper? The logs time whole attempts, not the helper.
  - The shortest whole VO wk attempts in run 7 are 31.3 s (message), 32.8 s (composer's Stop) and 33.6 s (search-field S4). Each holds the fixture's start, a page load, the helper, a 6 s window and the stop.
  - So a normal helper takes well under 30 s, and 60 s is at least twice the most it can take. Probably more, if the spec's "about 10 s" holds. The bound is safe.
  - The spec's "observed starts take about 12 s" cites the failed starts (11.7 to 13.8 s), not successful ones: nit 6.

**5. The tests.** Seen failing first, 7 of 10, as claimed. The fake reader's behaviours against guidepup's:

- "hang" rejects with "VoiceOver not running" only when `stop()` is called. That is the real loop's behaviour, minus the wait for the action in flight. Fair.
- A number: the helper throws "VoiceOver not running" without any `stop()`. In real guidepup that happens only if VoiceOver is already stopped or stopping when the helper runs. Then `restart()`'s `stop()` throws "not running", which it ignores, and `start()` follows. Rare, but the code handles it right. Fair.
- `stopHangs` and `startFails` model a `stop()` stuck on an action in flight, and the known `spawnSync /usr/bin/osascript ETIMEDOUT` start failure. Fair.
- Missing: a helper that does not end on `stop()`, and a `stop()` that throws rather than hangs. Both were probed here and behave (above). Finding 4 asks for them as cases.

**6. The X0's message and the `open: restart` window.**

- They name what happened, how often, and roughly when, and they reach `faults.json`, `phrases.json` and the job log (`[sr] <title>: …`).
- `report.ts` passes `phrases.json` through whole, so the new window key breaks nothing.
- They do not carry what the next memo most needs: finding 1.

## Findings

1. **Medium: the cause of the stall is still unseen, and the change throws away the evidence that would show it.**
   - READ: the spec says "Why the chooser does not open is not seen". Run 7's memo (§3.6, §5) wants the VO wk chart walk seen, and the cause named.
   - READ: the loop's VO-I press runs with `capture: true`. So every answer VoiceOver gives instead of "Item Chooser" lands in the reader's spoken-phrase log, with the item text beside it, for the whole 60 s.
   - `restart()` then calls `stop()`, which drops the old client and its logs. The X0 and the `open: restart` note say "did not end within 60 s" and nothing of what VoiceOver said. The restart's and the second helper's durations are not recorded either.
   - So the next run can see that a stall happened and how it ended, but not why. A third run would be needed to learn it.
   - Fix: before `stop()`, read `spokenPhraseLog()` and `itemTextLog()`. Bound that read too (say 5 s), since the client waits for its action in flight. Record the last few distinct phrases and item texts as a window, `open: stalled`, and append the last phrase to the X0's message. Add how long the restart and the second helper took to the `[sr]` line. Add one harness case: the fake's hanging helper "says" a phrase, and the window holds it.

2. **Low: the WebKit chart may still time out after a recovered restart.**
   - READ: `chart.sr.ts`, 25 VoiceOver steps take 4.2 to 5.8 minutes, inside a 7-minute timeout with no retry. A recovered restart costs about 60 s, plus a stop, a start and a helper: the spec's 85 s.
   - The spec says a walk of up to about 5.5 minutes still fits. So a slow walk after a restart ends in a test timeout again. This time there is no "VoiceOver not running", and the `[sr]` restart line comes before it.
   - The VO wk walk's own time is unknown: it has not run since the corners were fixed (run 7 §3.7).
   - Fix, either:
     - (a) raise the chart's timeout to 8 minutes. VO wk 1 ran 29.5 of its 40 in run 7, with 7.1 of that the chart's timeout.
     - (b) keep 7, and add one line to the spec's "Not run here" list: a restart followed by a test timeout in the chart is this case, not a new stall.

3. **Low: a restart whose bound fires inside `start()` leaves `start()` running past the test.**
   - READ: `start()` can take up to two attempts of terminate, `requestStart` (5 s), `waitForReady` and `waitForRunning` (30 s each), so more than 60 s in a bad case.
   - Suppose the bound fires mid-`start()`. The test fails as X0, and the fixture's `stop()` runs while `#started` is still false. It throws "VoiceOver not running", which `screenReaderTest` swallows. Then `start()` completes: VoiceOver runs with guidepup's preferences mounted and no test to stop it. The probe shows `start()` finishing after the X0.
   - INFERRED, why it does not reach the next test's result: the failed test's worker is replaced. And the next `start()` first terminates any VoiceOver, treating mounted guidepup preferences as a leftover (`#detectUserVoiceOver`, then `terminateVoiceOverProcess`).
   - A `stop()` that hangs has a twin: the fixture's `stop()` then waits on the same stuck action. That is as before this change.
   - Fix (optional): one sentence in the spec saying so. Or let `restart()` remember that a `start()` is still pending, and have the `sr` fixture's teardown await it, with a bound, before guidepup's `stop()`.

4. **Low: two restart paths are probed here but not tested.**
   - (a) The first helper does not end on `stop()`, a stall outside guidepup's guarded calls. `settled` holds, so `start()` never runs, and the restart's bound gives the X0.
   - (b) `stop()` throws rather than hangs, giving "restart failed: …" with no `start()`.
   - Both behave right (the probe above). But they are the cases that prove "no two loops" and "no start on a failed stop".
   - Fix: two `sr-harness.test.ts` cases. For (a), a `FakeReader.ends` value that ignores `stop()`: X0 naming the restart, and `calls` with no `start`. For (b), a `stopFails` error: X0 "restart failed", and no `start`.

5. **Note: one unidentified unit failure in four full runs.**
   - EXECUTED: the first `bun test ./tests/unit` run reported 1986 pass, 1 fail. The next three, one of them beside a dry speech run, reported 1987 pass. `sr-harness.test.ts` alone passed 20 of 20.
   - The first run's output was not kept, so the test is not named. The builder's gate reported 0 fails.
   - Its 022ad cases bound their time at under 2 s against 50 ms bounds, with wide margins, so they are not the likely source.
   - Next: if the builder sees it again, name it in the landing notes.

6. **Nit: two small inaccuracies.**
   - The spec's "Observed starts take about 12 s" cites the failed starts. Run 7's logs bound a successful start only from above: a whole attempt can take 31.3 s. Say so, or drop the figure.
   - `bounded`'s "after 0.0 s" prints for throws under 50 ms, which a unit test shows but CI will not. Harmless.

**Checked, not findings.**

- The cover is lifted on every path (`finally`). Under NVDA, a stall suppresses the "cover took no click" X0, so only the stall's X0 is reported (`!stalled`).
- Any helper error other than "VoiceOver not running" is thrown on unchanged. So NVDA's "Unable to focus the application window" keeps its retry behaviour (the harness case).
- The URL check after the helper still runs after a recovered restart.
- `SrOptions.start` is optional, and `restart()` runs only with it, under VoiceOver. A dry run never calls the helper.
- The scorecard: no row moves (a harness change; READ, the spec). This confirms the spec's "no row moves".

## Constitution checks

- **§4.1 source, not a package; §4.3 tokens; §4.5 and §4.6 pins and dependencies:** met. Tests only. No dependency, token or item changes. guidepup is unchanged.
- **§4.4 accessible by default, and proven:** met. A stall now fails as X0 by name within 3 minutes, or recovers. No rule changes. It makes the VO wk chart walk reachable.
- **§5 a small change:** met. The defect, the fix and the check fit on one page. The check was seen failing first (EXECUTED here, 7 of 10). This is the review by someone who did not write it.
- **§6 never:** met. Nothing committed or pushed, and no prior art copied. guidepup was read in `node_modules`, not copied.

## Verdict

**Lands.** Both of the builder's claims hold against guidepup's source.

- The stall is the unbounded item-chooser loop. "VoiceOver not running" is teardown's flag, not the cause.
- The restart cannot run two loops. `start()` waits for the old helper to end, and `stop()` waits for the action in flight.
- No rejection goes unhandled.
- The worst case, 180 s, fits every timeout, including the chart's 7 minutes.
- 60 s is at least twice the most a normal helper can take, by run 7's shortest attempts.
- The gate is green, apart from the unnamed unit failure in note 5.

Finding 1 is worth taking before the next matrix run. It is a short addition, and without it the next run sees the stall but not its cause. Finding 2 is a one-line choice for the design lead, (a) or (b). Findings 3, 4 and 6 are optional. Note 5 is for the builder.

## Disposition

The design lead ruled on findings 1 to 4, and the builder applied the rulings in the same worktree. This re-check reads the rebuilt diff and the specification's "After the change review" notes. It re-runs what they claim, and probes finding 1 with a hanging log read, as the coordinator asked.

**State.**

- Before and after this re-check:
  - `git diff | sha256sum` → `fe629bbf…1cbf`, 4 files, +464 −16 (`chart.sr.ts` is new to the diff);
  - `git status --porcelain | sha256sum` → `a17402e8…dac9`, 6 entries, this review among them;
  - the specification: `38aa0539…`.
- For the failing-first run, `sr.ts` was copied to the scratchpad, edited, and copied back. `sha256sum -c` passed. The probe scripts live in the scratchpad only. Only this file was edited.

**The rulings, as the specification records them.** Findings 1 and 4 taken as proposed. Finding 2 took option (a), the chart's timeout to 8 minutes. Finding 3 took the spec sentence.

**Re-ran (EXECUTED).**

- `sr-harness.test.ts`: **34 of 34**.
- Finding 1's test, seen failing first. In `toWebContent()`, `stallEvidence()`'s call was replaced with an empty string. Result: 1 fail ("what VoiceOver said in the stall is kept"), 33 pass. Then the file was restored.
- `bun run check`: 2436 files, 0 errors. `bun run lint`: clean.
- `bun test ./tests/unit`: **1990 pass, 0 fail, twice**, with each run's output kept. Note 5 did not recur.
- The dry speech run: **chromium 87 of 87** (1.3 min); **webkit 87 of 87** (1.8 min).
- `SR_READER=voiceover`, webkit, `--list --shard=k/5`: **19, 17, 19, 16 and 16**. The split is unchanged.
- The chart, dry, under a forced `--retries=2`, JSON reporter: the test's timeout reads **480000**.

**Finding 1: closed.** The probe used a guidepup-like reader, like the first one, whose two log calls wait for the action in flight, as `VoiceOverClient` does. It could make either log call hang, reject, or throw at once. Bounds were helper 1 s, restart 1 s and logs 0.3 s.

| Case | `open()` | Time | X0 ends with | `open: stalled` |
|---|---|---|---|---|
| logs answer; the restart recovers | opened | 1.2 s | (no X0; on the `[sr]` line) `; VoiceOver last said "Notification Centre" in the stall` | 3 distinct phrases |
| the spoken-phrase log hangs | X0 | 2.4 s | `; guidepup's spoken-phrase log did not end within 0.3 s` | `[]`; item text kept |
| both logs hang | X0 | 2.7 s | the same | `[]`, `[]` |
| the spoken-phrase log rejects | X0 | 2.1 s | `; guidepup's spoken-phrase log failed: log read failed` | `[]` |
| the action in flight never returns, so both logs and `stop()` wait on it | X0 | 2.6 s | `; VoiceOver's restart did not end within 1 s; guidepup's spoken-phrase log did not end within 0.3 s` | `[]`, `[]` |
| the log call throws synchronously | **threw "sync throw"**, no X0 | 1.0 s | — | — |

- **Yes, the 5 s reads stay bounded when guidepup's log call hangs mid-stall.** Each read is `bounded()`, so it ends at its bound. The restart still runs after a hung read, and the hung promise is left with a handler.
- At full scale, the worst case is 60 + 5 + 5 + 60 + 60 = **190 s**. That fits the suite's 5 minutes and the chart's 8.
- The realistic hang is the last real row: `osascript` stuck in flight. It ends at 60 + 5 + 5 + 60 = 130 s, with every cause named.
- Unhandled rejections: none, in any case.
- The probe's own stand-in for the fixture's `stop()` was still waiting on the stuck action after 1 s. guidepup's fixture does the same, as before this change (finding 3's twin).
- The synchronous throw is not reachable with guidepup 0.40.0 (READ). `VoiceOver.spokenPhraseLog()` and `itemTextLog()` are `async`, so their "not running" guard rejects and never throws. `ScreenReader` returns their promises. So it is a nit (b below).

**Finding 2: closed.** `chart.sr.ts` sets `8 * 60_000`, with the reason in its header (EXECUTED: 480000).

- Shard 1 still fits. By `022q`'s own sum, its other 18 tests at 1.69 minutes take 30.4, plus 8 makes 38.4, inside 40. Run 7's VO wk 1 measured 22.4 without the chart, so about 30.4 in all.
- `022q`'s own text still says 7 minutes, in decision 6 and in its time and check notes: nit (e).

**Finding 3: closed.** "The fix" 2 has the sentence "A start left pending".

**Finding 4: closed.** There are two new cases: "deaf", a helper that does not end on `stop()`, and `stopFails`. They check that no `start()` runs and that the X0 names the restart. They passed before the code too, as the spec says: they pin behaviour the first probe showed.

**Nit 6: closed.** The spec now bounds a start from above (31.3 s for a whole attempt) and names the 11.7 to 13.8 s figures as failed starts.

**Left, all optional:**

- (a) **Low: 5 s may be short for a healthy capture in flight.**
  - READ: guidepup's VO-I capture polls up to `MAX_SPOKEN_PHRASES_POLL_COUNT`, 100 times. Each poll is at least 50 ms plus an `osascript` read, and each new phrase waits its words at 7.5 a second.
  - So a slow but healthy capture can outlast 5 s, and the stall's evidence is then lost as "did not end within 5 s".
  - Either raise `LOG_MS` to 15 s, which makes the worst case 210 s, still inside 5 minutes. Or have the next memo read that message as a capture in flight, not a hang.
- (b) **Nit:** wrap each log call as `Promise.resolve().then(log)`, so that even a synchronous throw becomes a bounded "failed: …".
- (c) **Nit:** the `[sr]` line times the stall, the restart and the second helper, but not the log reads, which can take up to 10 s.
- (d) **Nit:** the bounds test still sums `2 * HELPER_MS + RESTART_MS`, 180 s. With `2 * LOG_MS` it is 190 s. Its "fits" claim holds either way.
- (e) **Nit:** `022q` decision 6 and its notes (lines 51, 69 and 155) still say 7 minutes. Add a one-line pointer there, or in the roadmap's `022q` row, to `022ad`'s amendment.
- (f) **Note:** only the first stall's logs are read. A second stall's phrases are not, so its X0 carries the first stall's last phrase. Enough for the next memo.

**Closing verdict: `022ad` lands.**

- Both of the builder's claims hold against guidepup's source.
- A stalled helper ends in a recovered restart or a named X0 within 190 s, with no unhandled rejection and no second loop.
- What VoiceOver said in place of "Item Chooser" now reaches `phrases.json`, the X0 and the job log. Each log read stays bounded even when guidepup's own call hangs.
- The chart has room for a restart.
- The gate is green, twice for the unit suite.
- Items (a) to (f) are optional.
- For the next matrix run:
  - look for `open: stalled` in a stall's `phrases.json`, and for `[sr] … (stall …, restart …, helper again …)` lines;
  - read "spoken-phrase log did not end within 5 s" as item (a);
  - check whether the WebKit chart walk now runs to its end.

