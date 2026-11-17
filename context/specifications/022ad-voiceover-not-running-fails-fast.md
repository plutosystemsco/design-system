# 022ad — "VoiceOver not running" fails fast

- **Status:** built 2026-11-17; reviewed (`reviews/022ad-voiceover-not-running-fails-fast-pr-2026-11-17.md`, lands); findings 1 to 4 taken by the design lead's rulings. Lane E (the speech harness).
- **Date:** 2026-11-17
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It changes how `Sr.open()` calls guidepup's web-content helper, and no item. No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022q` (`open()`'s cover), `022aa` (bounded waits).
- **Found by:** [the seventh matrix run](../research/2026-11-17-the-seventh-matrix-run.md), §3.6, §3.8 and §5; [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), §3.3 and §9.3–9.4. The roadmap's `022ad` row.

Terms. The _helper_ is `navigateToWebContent()`, which `@guidepup/playwright` 0.21.0 adds to the reader: it moves VoiceOver's cursor into the page. An _attempt_ is one run of a test, its retries counted apart. A _stall_ is a call that has not ended when its bound is up.

## The defect

**Where it hit (READ, the two memos).** Every case is VoiceOver with WebKit, inside `Sr.open()`, before the test's first window.

| Run | Test (attempt) | Time | Outcome |
|---|---|---|---|
| 5 | app-shell at 360, the page behind; error-summary's insertion; toast S1; toast S8 (retry 1) | 5-minute timeout each, 20 min in all | three passed on retry; S8 failed on B1 |
| 6 | pagination P3 (attempt 1); settings' delete confirm, its opening and its page behind | about 5 min each, about 15 of VO wk 3's 38.0 | the settings tests passed on retry; P3's retry 1 threw "VoiceOver cannot be started" in 13.8 s |
| 7 | spinner, the label changes | 5.1 min | passed on retry |
| 7 | chart, from before the figure | 7.1 min: "Test timeout of 420000ms exceeded", then "Error: VoiceOver not running" at `navigateVoiceOverToWebContent.js:23` | lost: the file runs once (`retries: 0`) |

Nine attempts, about 50 minutes. "VoiceOver cannot be started" (runs 4, 6 and 7, 11.7 to 13.8 s, `spawnSync /usr/bin/osascript ETIMEDOUT`) is a different error, already fast. It is out of scope.

**What guidepup does (READ, `node_modules/@guidepup`).**

- The helper's VoiceOver path (`playwright/lib/navigateVoiceOverToWebContent.js`) first calls `openItemChooser`. It is a `while` loop with no bound: press Control, Escape, then VO-I, read `lastSpokenPhrase()`, and go round until the phrase holds "item chooser". Line 23 is that read. The next step, `selectWebContentItem`, is bounded (10 attempts, then a named error).
- "VoiceOver not running" is guidepup's own state, not a probe of the process. `VoiceOver.js` throws it from every command when `#started` is false or `#stopping` is true. `stop()` sets `#stopping`.
- So the error comes late because nothing ends the loop but the test's timeout. **INFERRED** from the order in run 7's log, and from each attempt ending seconds after its timeout: the loop spun (VoiceOver answered, but never said "item chooser") until Playwright timed the test out. Teardown's `stop()` then set `#stopping`, and the loop's next read threw. The error names the teardown, not the cause.
- So a check that VoiceOver is running before the helper would pass, and fix nothing. Why the chooser does not open is not seen.

## The fix

All in `tests/sr/sr.ts`, with one line in `fixtures.ts` and the chart's timeout in `chart.sr.ts`. guidepup is not changed.

1. **The helper is bounded.** `open()` races it against `HELPER_MS`, 60 s. A normal helper is a few VoiceOver commands (INFERRED: about 10 s), so 60 s is six times that. A stall, or a throw of "VoiceOver not running", does not end the call. Any other error (NVDA's "Unable to focus the application window", say) is thrown on, as before.
2. **Under VoiceOver, one restart.** `stop()`, then wait for the stalled helper to end, then `start()` with the fixture's own `screenReaderStartOptions` (`capture: true`), then the helper once more, bounded again. The restart is bounded by `RESTART_MS`, 60 s.
   - **Safe:** `stop()`'s flag makes the loop's next call throw, so the stalled helper ends, and removes its marker, before VoiceOver starts again. Nothing else holds VoiceOver. The test has heard nothing yet, so no window is lost.
   - **Cheap:** it is what each test's fixture does already. A successful start is not timed in the logs. A whole VO wk attempt, start, page, helper, a 6 s window and stop, can take 31.3 s (run 7, the change review §4), so a start takes less. The failed starts took 11.7 to 13.8 s.
   - **Worth it:** in six of the nine attempts, the test passed on its retry, a fresh start. INFERRED: a retry also gets a new browser, so a restart alone may not cure every case. Either way the attempt ends within 3 minutes, named.
   - **A start left pending.** A `start()` still pending when the restart's bound fires is left to the worker's replacement and the next test's start, so it does not reach another result (the change review, finding 3).
   - **Recorded.** Every restart is the window `open: restart`, in `phrases.json`, and a `[sr]` line in the job's log: its outcome, and the times of the stall, the restart and the second helper.
   - **The evidence is kept** (the change review, finding 1). Before `stop()` drops guidepup's logs, the spoken-phrase and item-text logs are read, each bounded by `LOG_MS`, 5 s. Their last 10 distinct entries are the windows `open: stalled` and `open: stalled: item text`. They show what VoiceOver said in place of "Item Chooser".
3. **Else X0, by name.** `open: navigateToWebContent() did not end within 60 s` (or `threw "VoiceOver not running" after N s`), then `, and again after VoiceOver was restarted: …`, or `; VoiceOver's restart failed: …` or `… did not end within 60 s`. Under VoiceOver it ends `; VoiceOver last said "…" in the stall`. It goes through `judge()`, so `faults.json` carries it. NVDA and Orca get the bound and no restart: they have not stalled.

**The chart's single attempt.** Its walk takes 4.2 to 5.8 minutes. A recovered restart costs about 85 s (the 60 s bound, a restart, a helper) before it. So its timeout goes from 7 to 8 minutes (the change review, finding 2, option (a)), and a 5.8-minute walk still fits after a restart. Shard 1 ran 29.5 of its 40 minutes in run 7. The worst case, two stalls and a restart, ends at about 3 minutes with an X0 naming the cause, where run 7 lost all 7.1 minutes to a timeout.

Nothing in `src/` or `static/` changes.

## The check

`tests/unit/sr-harness.test.ts`, "022ad". The fake reader's helper can hang until `stop()` (as guidepup's loop does), speaking as it spins; hang through `stop()`; throw "VoiceOver not running" after a delay; or throw another error. Its `stop()` can hang or throw, and its `start()` can fail. The bounds are 50 ms here.

- It hangs, and the restarted helper ends: one restart, with the fixture's options, and no fault.
- It hangs twice: X0 within 2 s, naming both stalls. Throws twice: X0 naming the throw.
- The restart's `start()` fails, or its `stop()` never ends or throws: X0, within the bound, naming the restart; no `start()` after a failed `stop()`.
- The stalled helper does not end on `stop()`: no `start()`, X0 naming the restart's bound (finding 4).
- What the stall said is kept: `open: stalled` and its item text hold the last distinct phrases, the X0 ends with the last one, and the `[sr]` line times the stall, the restart and the second helper (finding 1).
- NVDA: X0 at the bound, no restart, the cover lifted.
- Another error is thrown on; a helper that ends is called once; the bounds are 60 s and fit in the 5-minute timeout.

## Landing notes

Run in this worktree on `db8fb65`, Bun 1.4.4. The site built once; browser runs are `E2E_PREBUILT=1 E2E_PORT=4262`.

**Failing first (EXECUTED).** The new tests, with only `HELPER_MS` and `RESTART_MS` exported and `open()` unchanged: 7 of 10 failed. Five waited out bun's 5 s test timeout, as `open()` waits on the helper with no end. The two "VoiceOver not running" cases received guidepup's bare error, `Received: "VoiceOver not running"`, and no X0. The other three passed (thrown-on error, a helper that ends, the constants).

**After (EXECUTED).**

- `sr-harness.test.ts`: 31 of 31 pass.
- The dry speech run, `SR_DRY=1 bun run test:sr --project=chromium`: 87 of 87 (1.2 min); `--project=webkit`: 87 of 87 (1.8 min). A dry run calls no helper, so nothing changes there.
- `--list --shard=k/5`, `SR_READER=voiceover`, `webkit`: 19, 17, 19, 16 and 16 tests.

**The gate (EXECUTED).** `bun run check`, 2436 files, 0 errors. `bun run lint`, clean. `bun test ./tests/unit`, 1987 pass, 0 fail. The dry speech run in both browsers, as above. Nothing under `src/` or `static/` changed.

**Not run here.** No reader runs in this container. For the next matrix run, in the VoiceOver logs:

- no attempt should end "Test timeout … exceeded" then "VoiceOver not running";
- a stall shows as a `[sr] … VoiceOver was restarted` line, and the test going on; or as an X0 starting `open: navigateToWebContent()`, about 1 to 3 minutes into the attempt;
- the WebKit chart walk should run. The memo then says whether it still stops on "image".

**The scorecard:** no row moves (a harness change).

**After the change review (EXECUTED).** The same worktree, uncommitted, Playwright 1.64.1.

- **The design lead's rulings (2026-11-17):**
  - finding 1, keep the evidence, with one harness test seen failing first;
  - finding 2, option (a), the chart's timeout to 8 minutes. This amends `022q` decision 6's 7 minutes;
  - finding 3, the sentence in "The fix" 2;
  - finding 4, the two harness tests.
  - Leave note 5 and nit 6, but correct the start-time citation (done, "Cheap").
- **Failing first, finding 1.** The new test ran before the code: `open: stalled` was `undefined` (`Expected - 4, Received + 1`). Finding 4's two tests passed before the code too. They pin behaviour the review probed, not a change.
- **After.**
  - `sr-harness.test.ts`: 34 of 34 pass.
  - `bun test ./tests/unit`, run twice, output kept: 1990 pass, 0 fail each. Note 5's unnamed failure did not recur.
  - `bun run check`: 2436 files, 0 errors. `bun run lint`: clean.
  - The dry speech run: `chromium` 87 of 87 (1.3 min); `webkit` 87 of 87 (1.6 min).
  - `--list --shard=k/5`, `SR_READER=voiceover`, `webkit`: 19, 17, 19, 16 and 16 tests.
- **For the next matrix run, added.** A stall's `phrases.json` holds `open: stalled`: what VoiceOver said instead of "Item Chooser". Its last phrase is in the X0 and on the `[sr]` line, with the three times. The chart's attempt may now run up to 8 minutes.

### The re-check (2026-11-17)

Lands. The 5 s log reads stay bounded when guidepup's log call hangs mid-stall (the reviewer's probe: a stuck `osascript` ends at 130 s with each cause named; the worst case is 190 s). Left as facts for the next memo: a "did not end within 5 s" log read may be a slow but healthy capture, so the stall's evidence can be missing then; the `[sr]` line does not time the log reads. `022q` decision 6 now points here for the chart's 8 minutes.

