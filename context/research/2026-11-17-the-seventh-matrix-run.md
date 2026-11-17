# The seventh matrix run: the run-5 batch heard

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a researcher
- **Question:** Run 7 is the first with `022t`, `022v`, `022w`, `022x`, `022y` and `022z`. What did each fix? What does it say for `022z` criterion 5, `022t` criterion 14 and `022q` criterion 6's second clause? What is left?
- **Stands on:** [the fifth matrix run](2026-11-17-the-fifth-matrix-run.md), cited as *run 5's memo*, with its §9 on run 6; the specifications [`022t`](../specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md), [`022v`](../specifications/022v-code-blocks-copied-is-said-once.md), [`022w`](../specifications/022w-the-search-fields-count-clears-only-on-a-keystroke.md), [`022x`](../specifications/022x-the-fifth-runs-three-test-faults.md), [`022y`](../specifications/022y-the-voiceover-job-turns-the-hot-corners-off.md), [`022z`](../specifications/022z-l3-learns-voiceovers-doubled-phrase.md) and [`019b`](../specifications/019b-the-error-summarys-messages-are-read-once.md).
- **What it blocks:** the landing notes of `022t` (criterion 14), `022z` (criteria 5 and 6) and `022q` (criterion 6); `019b`'s build, which waits for this run (its "Depends on"); the rows in §5.

## How to read this memo

- **READ:** a job log or the job list of run [44014551614](https://github.com/plutosystemsco/design-system/actions/runs/44014551614) (`matrix`, push of `7ec5488`), read 2026-11-17 through the GitHub connector; or a file of this repository at `7ec5488`.
  - The 14 failed jobs' logs came whole, as one file.
  - Fetched alone, also whole: `checks`, `gate`, the eight WebKit browser shards, and the three passing reader shards (NVDA chr 1 and 3, VO wk 4).
  - Not read: the Chromium and Firefox browser shards' logs. All 16 succeeded (the job list).
- **Not read:** the artifacts. Their blob host is refused here. So no `phrases.json`, no merged report, no recording.
- **INFERRED:** our reasoning.

Terms, as in *run 5's memo*. A _pair_ is one reader with one browser: N-chr, N-ff, VO chr, VO wk. A _window_ is one named capture of phrases. A _follow-on X0_ is an X0 a rule returns because another rule did not hold.

**What the run carries (READ, `git log b01e754..7ec5488`).** `022t` (`035aec2`), `022x` (`73973b8`), `022y` (`47c680d`), `022v` and `022w` (`ccb4ffe`), `022z` (`cb84f9d`). Not `019b`: the error summary still renders `<ul>` and `<li>` (`error-summary.svelte:169–171`). So this is the run `019b` waits for.

## 1. Jobs (question 1)

- **READ:** 45 jobs. 30 succeeded and 15 failed: `perf`; NVDA ff 1, 2 and 3; NVDA chr 2; nine of ten VoiceOver shards (all but webkit 4); `gate`.
- **READ, against run 6's 17:** `checks` and NVDA chr 1 now pass. Every other failed job is run 6's.
- **READ, against run 5's 19:** WebKit shards 1, 2 and 6 pass, as in run 6. NVDA chr 1 passes.
- **READ, `gate`:** "gate (full): fail", then "perf is failure", "voiceover is failure", "nvda is failure". `build`, `checks`, `browsers` and `report` succeeded.
- **READ, the run list:** seven `matrix` runs, all pushes. Run 7 was created at 04:04:07. Run 6 had ended at 00:52:17. No other run overlapped it.
- **READ, wall time:** `build` started 04:04:10; `gate` ended 05:00:00. **55.8 minutes**, against run 5's 62.0 and run 6's 116.1.
- **INFERRED:** run 7 had the five macOS slots to itself. §4 shows the two waves.

## 2. Browsers and perf (question 2)

### The WebKit flakes

- **READ:** all eight WebKit shards end with "N passed" and "M skipped" and no "flaky" line: 482, 474, 482, 481, 481, 473, 470 and 365 passed. The dot output holds no flaky mark.
- **READ:** `failOnFlakyTests` is on in CI, and all 24 browser shards succeeded.
- **INFERRED:** no browser test flaked in any engine. The bar-glass hover and the motion page's Replay passed first time, as in run 6.

### bar-glass: the "022x: a translucent first read" annotation

- **READ:** no WebKit log holds "022x" or "translucent".
- **READ:** CI's reporters are `blob` and `dot` (`playwright.config.ts:23`). `dot` prints no annotations.
- **INFERRED:** whether the poll forgave a translucent first read is not in the logs. It is in the blob reports and the merged report, which cannot be fetched here. The test passed either way.

### perf

| Page | Budget | Median CLS, run 7 | Run 6 |
|---|---|---|---|
| `/start/` | ≤ 0.02 | 0.048 | 0.048 |
| `/components/native-select/` | ≤ 0.022 | 0.088 | 0.088 (one run 0.109) |
| `/changelog/` | ≤ 0.02 | 0.083 (one run 0.108) | 0.083 (one run 0.108) |

- **READ:** `perf.spec.ts:350`, the same three tests failed both attempts, on CLS only; 23 passed.
- **INFERRED:** not new. `024g` and `024h` have not landed.

### checks: the highlighter's timing tests

- **READ:** `bun test ./tests/unit`: 1937 pass, 2 skip, 0 fail, of 1939. The smoke suite: 151 pass.
- **READ:** "the 18 specimens in a fresh process" passed (715 ms). "The streaming budget (decision 20)" passed (382 ms).
- **READ, the p95 it printed:** `stream: p95 2.90, 2.91, 2.94 ms per chunk; best 2.90`. The budget is 4 ms.
- **READ:** this print is already in `7ec5488`'s test (`highlight-session.test.ts:339–341`), the best of three streams. `022ab`'s unlanded print has another form, "stream: best p95 … of N streams" (the `lane-e-small` worktree's diff).
- **INFERRED:** run 6's `checks` failure was a timing flake. It did not recur on a quieter runner.

## 3. Speech, per reader and browser pair (question 3)

### 3.1 The counts

| Pair | Failed | Flaky | Not run | Run 6 |
|---|---|---|---|---|
| N-chr | 1 | 0 | 0 | 3, 0, 0 |
| N-ff | 6 | 0 | 0 | 7, 0, 0 |
| VO chr | 15 | 2 | 0 | 12, 2, 9 |
| VO wk | 8 | 3 | 0 | 11, 4, 0 |
| All | 30 | 5 | 0 | 33, 6, 9 |

- **READ:** every shard ran every test. VO chr's 9 tests that run 6 never reached all ran.
- **READ:** every X0 printed is a follow-on X0: "L3: L1 does not hold", "L2: L1 does not hold, …", "B1: … was not spoken, so nothing comes after". No O2 fault. No `022x` "the sub-menu did not open" X0.

**Every failed or flaky test.** Kinds: **I** item; **T** test; **H** harness or runner; **U** unknown.

| Test | N-chr | N-ff | VO chr | VO wk | Rule, as printed | Kind |
|---|---|---|---|---|---|---|
| error-summary: the insertion | pass | fail, 3/3 | fail, 3/3 | pass | L3 within phrase 1, each message; under VO chr the title too, 2/3 | I |
| error-summary: the second submit, unchanged | **pass** | fail, 3/3 | fail, 3/3 | **pass** | L3 within phrase 1; VO chr also L1, 2/3 | I |
| settings: a save with an empty name | pass | fail, 3/3 | fail, 3/3 | pass | L3 within phrase 1; VO chr title 1/3 | I |
| sign-in: an empty submit | pass | fail, 3/3 | fail, 3/3 | pass | L3 within phrase 1 | I |
| sign-up: an empty submit | pass | fail, 3/3 | fail, 3/3 | pass | L3 within phrase 1; VO chr L1 once | I |
| pagination P2 | pass | pass | fail, 3/3 | flaky, 2/3 | F1 "Page 12" | U |
| pagination P3 | fail, 3/3 | pass | **pass** | **pass** | F1 "Previous page" ("Previouspage, button") | U |
| app-shell: the skip link | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Projects" | U |
| marketing-bar: the skip link | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Marketing bar" | U |
| composer: Stop moves focus | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Message" | U |
| search-field S1 | pass | pass | flaky, 1/2 | pass | L1 "3 results" | U |
| search-field S2 | pass | pass | fail, 3/3 | pass | L1 "3 results" | U |
| search-field S3, Clear | pass | pass | pass | fail, 3/3 | F1 "Search projects" | U |
| page-states: the loading status | pass | pass | fail, 3/3 | fail, 3/3 | L1 "Loading projects" | U |
| spinner: the label changes | pass | pass | fail, 3/3 | flaky, "VoiceOver not running" | L1 "Loading runs" | U; H |
| toast S4, repeat | pass | pass | fail, 3/3 | pass | L4 | U |
| toast S6, Escape | pass | pass | pass | **flaky, 1/2** | F1 "Raise two" | U |
| toast S8, after the title | pass | pass | fail, 3/3 | fail, 3/3 | B1 "Route" | U |
| toast S10, both channels | pass | pass | fail, 3/3 | fail, 3/3 | L1 "Success: Record A saved" | U |
| tooltip T1 | pass | fail, 3/3 | pass | pass | T1 | U |
| chart: from before the figure | pass | pass | **pass** | fail, 1/1 | none: 7-minute timeout, "VoiceOver not running" | H |
| tag T3, the list | pass | pass | flaky, "VoiceOver cannot be started" | pass | none | H |

- **READ:** marketing-bar's skip link and page-states ran under VO chr for the first time since run 4. They fail as under VO wk.

### 3.2 `022t`: the unchanged second submit (criterion 14)

| Pair | Run 7 | Run 6 | The second window, READ |
|---|---|---|---|
| N-chr | **pass**, first attempt | fail, "section" | not printed (passing) |
| N-ff | fail, 3/3: L3 only | fail, "section" | "section. alert. There is a problem, heading, level 2. list. Enter a project name, 1 of 3. Enter a project name, link, same page. …" |
| VO chr | fail, 3/3: L3; L1 in attempts 2 and 3 | fail, the group's name | attempt 1: the whole alert again, each message doubled |
| VO wk | **pass**, first attempt | fail, the heading | not printed |

- **READ: NVDA now passes L1 in both browsers.** N-chr passes the test. N-ff prints no L1 fault. Its second window speaks the whole alert again, where run 6 heard "section".
- **READ:** N-ff's only faults are "… was read twice within phrase 1", for each of the three messages. That is the list double, `019b`'s cause.
- **READ, VO chr:** attempt 1's second window re-reads the alert whole. Attempt 2's second window stops before "Choose who can see the project"; attempt 3's says "Create project button. There is a problem. You are currently on a heading level 2.", no message. The first window of attempt 3 is cut short too.
- **INFERRED:** the item's mechanism works in all four pairs. A new content node is read as a new alert. VO chr's lost L1 is reader timing: it cuts the first submit as well.
- **Verdict: criterion 14 is not met as written.** It holds in N-chr and VO wk. N-ff and VO chr fail L3, on the list double (`019b`), and VO chr also on the title (§3.3).
- **INFERRED:** criterion 14's other clause, "the insertion and the three blocks' summary tests pass … as before", cannot hold while `022z` is in and `019b` is not. `022z` made them fail on purpose. So the criterion can only be judged in `019b`'s run. `019b` criterion 11 holds the same second-submit row.
- **INFERRED:** `022t`'s "If it fails" research, a probe of the Windows runner's accessibility events, is not needed. NVDA's L1 holds on Windows.

### 3.3 `022z` criterion 5: the four error-summary tests (`019b`'s seen-failing run)

| Test | VO chr: L3 "within phrase" for each message | VO wk | N-ff | N-chr |
|---|---|---|---|---|
| error-summary: the insertion | **yes**, all three messages, 3/3 attempts | pass | yes, 3/3, as before | pass |
| settings: a save with an empty name | **yes**, "Enter your name", 3/3 | pass | yes, 3/3 | pass |
| sign-in: an empty submit | **yes**, both messages, 3/3 | pass | yes, 3/3 | pass |
| sign-up: an empty submit | **yes**, both messages, 2/3; attempt 1 L1 | pass | yes, 3/3 | pass |

- **READ, the VO chr phrases:** "There is a problem Enter your email address Enter your email address Enter your password Enter your password" (sign-in). The insertion's: "There is a problem Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address Choose who can see the project Choose who can see the project". Every message is doubled side by side, as *run 5's memo* §3.3 quoted.
- **READ:** no fault "in a row" was printed. Every L3 fault says "within phrase 1".
- **READ, sign-up's attempt 1:** the window holds "There is a problem" alone, so L1 failed for both messages. Attempts 2 and 3 fault L3 for both.
- **Verdict: criterion 5 is met.** Each of the four fails L3 within phrase under VO chr, for each of its summary's messages. The rule matches real speech.
- **The title, READ:** under VO chr the title faults "within phrase 1" in 2 of 3 insertion attempts, 1 of 3 second-submit attempts and 1 of 3 settings attempts. The phrase is "There is a problem and 1 more item group. There is a problem Enter …": the focused group's name, then the alert, in one entry.
  - **INFERRED:** this is `022z` decision 4's title risk, stated in advance. It is a finding about the alert and the focus move (`019` decision 1), for lane I. It does not count against criterion 5. `019b` names it as a risk and does not address it.
- **VO wk, READ:** all four pass, first attempt, with the second submit and the three link tests. `022z` expected them to fail; it did not require it.
  - **INFERRED:** either VoiceOver in WebKit reads each message once, or it doubles them in a way the rule does not see. Passing tests print no phrases. **The owner downloads** `sr-voiceover-webkit-2`, `-3` and `-4` and gives the design lead the four tests' `phrases.json` entries (`022z` decision 4).
- **N-ff, READ:** the five tests fail as in runs 5 and 6. "list. Enter a project name, 1 of 3. Enter a project name, link, same page. …"
- **So this run is `019b`'s seen-failing run** (`019b` criterion 11): the four tests fail L3 for their messages under VO chr and under N-ff. `019b`'s "Depends on" is met. It can build.
- **`022z`'s watched tests, READ:** code-block's copy, P1, toast S1 and app-shell A1 pass in all four pairs. No new fault.
- **`022z` criterion 6, READ:** no `main` or `double-read` dispatch has run. All seven runs are pushes.
  - **INFERRED, the window:** the insertion test, witness of patches 4 and 7b, fails unpatched under N-ff and VO chr. It passes under N-chr and VO wk. So VO wk is outside the window, against `022z`'s expectation.
  - **INFERRED, patch 7:** its witness, code-block's copy, now passes unpatched in all four pairs. The next `main` dispatch can prove it in all four. Patch 9's witness, P1, passes in all four too.

### 3.4 `022v`: code-block's "Copied" under NVDA

- **READ:** "copy: the outcome is spoken whole, and not twice in a row" passes first time in all four pairs: N-chr 15.7 s, N-ff 15.9 s, VO chr 34.1 s, VO wk 33.7 s.
- **READ:** runs 5 and 6 failed it 3/3 under NVDA in both browsers, "Copied. Copied. Copy code".
- **Fixed.** `017a`, the tokens page's same double, is still queued in lane S.

### 3.5 `022w`: search-field S1 and S2 under VoiceOver

| Pair | S1 | S2 | Run 6 |
|---|---|---|---|
| VO chr | flaky: attempt 1 failed, the retry passed | **fail, 3/3** | S1 flaky; S2 fail, 3/3 |
| VO wk | pass | pass | both pass |

- **READ, VO chr S2:** first window "s. des. You are currently on a text field. …" twice, and "es. 3 results. …" once. Second window "i. desi", every attempt. S1's failed attempt: "s. des. …", no count.
- **READ:** both NVDA pairs pass S1 and S2.
- **Not fixed under VO chr.** The phrases are run 6's.
- **INFERRED:** `022w` removed the timed clear, so the count now stays until the next keystroke. VoiceOver in Chromium still does not speak it inside the window. So the short hold was not the cause. `022w`'s inference is refuted for VO chr. The cause is unknown: a polite status VoiceOver in Chromium drops while the field has focus, or a window that ends too soon.
- **READ, VO wk:** item text is "des Search projects search text field"; VO chr's is `""`, as in run 5. Chromium's item text gives no evidence here.

### 3.6 `022x`: the dropdown, C2 and the WebKit chart walk

- **The dropdown hang, READ:** VO chr's "Escape in the sub-menu speaks its parent item" passes first time, in 1.6 minutes. Runs 5 and 6 spent 30 minutes on it. NVDA and VO wk pass it. **Fixed.**
- **C2, READ:** VO chr's chart test passes first time, in 3.4 minutes. C1 and C2 hold. Runs 5 and 6 faulted C2 on the table's cells. **Fixed.**
- **The WebKit chart walk, READ:** VO wk's chart test failed its only attempt (the file sets `retries: 0`) after 7.1 minutes: "Test timeout of 420000ms exceeded", then "Error: VoiceOver not running", at `navigateVoiceOverToWebContent.js:23`.
  - **INFERRED:** that helper runs in `Sr.open`, before the walk. So the walk never ran. Whether it still stops on "image" after "Sun" is not seen.
- **bar-glass:** §2. It passed; its annotation is not in the logs.

### 3.7 `022y`: the hot corners

- **READ, before, in all ten VoiceOver logs:** one corner is set, `"wvous-br-corner" = 14;`. The other three are not set.
- **READ, after, in all ten:** `"wvous-bl-corner" = 1;`, `"wvous-br-corner" = 1;`, `"wvous-tl-corner" = 1;`, `"wvous-tr-corner" = 1;`.
- **INFERRED:** 14 is Quick Note. That confirms *run 5's memo*'s inference: the runner's bottom-right corner opened Quick Note.
- **READ:** no phrase in any log holds "Quick Note".
- **INFERRED:** the corners are off. But the one walk that met Quick Note, VO wk's chart, did not run (§3.6). So the fix is shown in the log, not yet on the walk.

### 3.8 Since run 6

**Run 6's new rows:**

- **chat, "Response complete", READ:** passes first time in VO wk (50.4 s) and VO chr (50.7 s). Gone. No change touched it (INFERRED: run 6's failure was reader timing).
- **"VoiceOver not running", READ:** 2 attempts, both VO wk. Spinner, 5.1 minutes, then passed on retry. The chart, 7.1 minutes, no retry. Both in `navigateVoiceOverToWebContent`. It has recurred in runs 5, 6 and 7.
- **"VoiceOver cannot be started", READ:** once, VO chr's tag T3, 11.7 s, `spawnSync /usr/bin/osascript ETIMEDOUT`. Its retry passed. Seen in runs 4, 6 and 7.
- **"Unable to focus the application window", READ:** in no log, as in run 6.
- **dialog, opening, READ:** passes in VO wk.

**New in run 7, READ:**

- VO chr's title read twice within one phrase (§3.3).
- VO wk's four error-summary tests pass where `022z` expected L3 (§3.3).
- toast S6 under VO wk: attempt 1 failed F1 "Raise two"; the retry passed. It passed in runs 5 and 6.
- pagination P3 passes under VO chr and VO wk, first attempt. It failed in both in runs 5 and 6. **INFERRED:** no change in this run touched pagination or its test, so this is chance, not a fix.

**Unchanged, READ:** every other unknown row of *run 5's memo* §7 repeats with its rule. P3 under N-chr still says "Previouspage, button". T1 under N-ff still says "Deploy, button". The F1 rows' item text still names the target ("Projects heading level 1", "Page 12 current page button").

## 4. Shard times (question 4; `022q` criterion 6, second clause)

"Test" is Playwright's figure. "Job" and "Waited" come from the job list. All in minutes. The deadline is 40.

| Shard | Tests | Failed | Flaky | Not run | Test | Run 6 | Job | Waited |
|---|---|---|---|---|---|---|---|---|
| N-chr 1 | 32 | 0 | 0 | 0 | 14.6 | 15.5 | 15.9 | 0.0 |
| N-chr 2 | 26 | 1 | 0 | 0 | 11.0 | 10.6 | 12.4 | 0.1 |
| N-chr 3 | 29 | 0 | 0 | 0 | 11.4 | 11.2 | 12.7 | 0.0 |
| N-ff 1 | 32 | 2 | 0 | 0 | 16.5 | 17.5 | 18.0 | 0.0 |
| N-ff 2 | 26 | 1 | 0 | 0 | 12.5 | 12.6 | 13.7 | 0.0 |
| N-ff 3 | 29 | 3 | 0 | 0 | 14.1 | 14.5 | 15.5 | 0.0 |
| VO chr 1 | 19 | 2 | 0 | 0 | 25.7 | 25.8 | 27.0 | 0.0 |
| VO chr 2 | 17 | 4 | 0 | 0 | **25.7** | 40.0, deadline | 26.9 | 0.1 |
| VO chr 3 | 19 | 3 | 1 | 0 | 26.2 | 27.0 | 27.4 | 27.0 |
| VO chr 4 | 16 | 3 | 0 | 0 | 19.2 | 18.2 | 20.1 | 0.0 |
| VO chr 5 | 16 | 3 | 1 | 0 | 16.4 | 16.3 | 17.6 | 27.1 |
| VO wk 1 | 19 | 3 | 0 | 0 | 29.5 | 27.9 | 30.5 | 0.0 |
| VO wk 2 | 17 | 2 | 0 | 0 | 18.4 | 25.2 | 19.6 | 0.0 |
| VO wk 3 | 19 | 1 | 1 | 0 | 22.1 | 38.0 | 23.4 | 30.6 |
| VO wk 4 | 16 | 0 | 1 | 0 | 21.5 | 16.8 | 22.7 | 19.6 |
| VO wk 5 | 16 | 2 | 1 | 0 | 15.3 | 15.9 | 16.6 | 20.2 |

- **READ: all 16 reader shards ended inside the 40-minute deadline.** The longest is VO wk 1, 29.5, with the chart's 7.1-minute timeout in it. No "Timed out waiting 2400s". **`022q` criterion 6's second clause holds in this run.**
- **READ, VO chr 2:** 25.7 against 40.0. The dropdown took 1.6 minutes, not 30.
- **READ, the waves:** five VoiceOver jobs started at 04:04:52–53. Each of the other five started 2 s after one of them ended: VO wk 4 at 04:24:28, VO wk 5 at 04:25:01, VO chr 3 at 04:31:48, VO chr 5 at 04:31:53, VO wk 3 at 04:35:26. **INFERRED:** five macOS slots, as before. The second wave waited 19.6 to 30.6 minutes.
- **INFERRED, the critical path:** VO chr 2 then VO chr 3, 26.9 + 27.4 minutes. The VoiceOver jobs ran 04:04:52 to 04:59:10, 54.3 minutes.
- **READ, against `022` criterion 22's 20-minute bar:** all six NVDA shards are under it (11.0 to 16.5). Four VoiceOver shards are: VO chr 4, VO chr 5, VO wk 2, VO wk 5.

**Per pair, the sum of Playwright's figures (READ):** N-chr 37.0 (run 6: 37.3); N-ff 43.1 (44.6); VO chr 113.2 (127.3, with 9 tests not run); VO wk 106.8 (123.8).

## 5. What is left (question 5)

Marks: **019b** — `019b` addresses the row. **E-built** — a lane-E small change built and not landed addresses it: `032c` (no `.only` in CI), `022ab` (the timing budgets), `022aa` (screen-reader waits bounded at 10 s).

| What | Where | Kind | Next | Addressed by |
|---|---|---|---|---|
| A message read as a list item, then as its link | N-ff and VO chr: the insertion, the second submit, settings, sign-in, sign-up (10 tests) | item | Build `019b` now. This run is its seen-failing run (§3.3). Its run id and the four tests' VO chr and VO wk results go in its landing notes | **019b** |
| `022t` criterion 14 | N-ff, VO chr | item | Judge it in `019b`'s first run. Record in `022t`'s landing notes that NVDA's L1 holds and that its "as before" clause cannot hold until then (§3.2) | **019b** (the L3 part) |
| The title read twice in one phrase | VO chr: insertion 2/3, second submit 1/3, settings 1/3 | item | A lane-I finding, recorded with its phrase in `022z`'s landing notes. A research memo on the group's name and the alert in one entry. Not ledgered (`022z` decision 4) | no: `019b` names it as a risk |
| VO wk's four summary tests pass, phrases unseen | VO wk | unknown | The owner downloads `sr-voiceover-webkit-2`, `-3` and `-4`; their `phrases.json` entries go in `022z`'s landing notes | — |
| The second submit's L1 lost on retries | VO chr, 2 of 3 | unknown, reader timing | Watch in `019b`'s run | — |
| search-field S2 (S1 flaky) | VO chr | unknown | Research before another change: `022w` removed the hold and nothing moved (§3.5). Read VO chr 3's `phrases.json` and its recording | — |
| "VoiceOver not running" in `navigateVoiceOverToWebContent` | VO wk: spinner 5.1 min, the chart 7.1 min | harness | A small change in lane E so `open()` fails fast when guidepup's helper stalls. *Run 5's memo* asked for one if it recurred; it has, twice | no: `022aa` bounds the suite's own waits, not guidepup's helper (INFERRED, `sr.ts:146` in `lane-e-small`) |
| The chart's WebKit walk, unseen | VO wk | harness | The row above. Then the next run shows whether the walk ends in the page now the corners are off | — |
| "VoiceOver cannot be started" | VO chr T3, once, retried | harness | Watch | — |
| A focused element's name not in the log | app-shell and marketing-bar skip links, composer Stop, P2 (VO chr, VO wk); S3 (VO wk); S6 (VO wk, flaky, new) | unknown | The owner downloads one VoiceOver `recordings/` artifact and listens (*run 5's memo* §7) | — |
| A live announcement missing | spinner, S4 (VO chr); page-states, S8, S10 (VO chr, VO wk) | unknown | The same recording. page-states also needs `022q`'s deferred client-side navigation | — |
| P3 under N-chr: "Previouspage, button" | N-chr | unknown | A small change in lane I, once a check that fails first is found | — |
| tooltip T1 | N-ff | unknown | Record whether the tooltip is open after the focus | — |
| perf: CLS on `/start/`, `native-select`, `/changelog/` | `perf` | budget | `024g` (lane T) and `024h` (lane S) | — |
| The streaming budget, a wall-clock flake | `checks` (run 6; passed here, best p95 2.90 ms) | test | Land `022ab`. Its print, "best p95 … of N streams", replaces today's | **E-built** (`022ab`) |
| bar-glass's annotation not visible | WebKit browser shards | test | The owner reads the merged report's annotations, or a change prints them in CI's log | — |
| A committed `.only` would make a shard pass on one test | every Playwright suite | guard | Land `032c`. No row of this run needs it; it keeps the next run's evidence whole | **E-built** (`032c`) |
| An unbounded `waitFor` could hang a shard | `tests/sr/` | guard | Land `022aa`. No wait hung in this run | **E-built** (`022aa`) |

**Fixed in this run (READ):** code-block under NVDA (`022v`); the dropdown hang and C2 under VO chr (`022x`); the second submit under N-chr and VO wk, and its L1 under N-ff (`022t`); VO chr 2's deadline; the hot corners (`022y`, in the log). chat's "Response complete" and P3 under VoiceOver passed with no change that touched them.

## 6. What this memo did not see

- Every artifact: `phrases.json`, `faults.json`, the merged report, the recordings. So no phrase of a passing test, no annotation, no VO wk error-summary phrase.
- The VO wk chart walk, which did not start.
- The Chromium and Firefox browser shards' logs. The job list says each succeeded.
- Any speech. No reader runs here.
