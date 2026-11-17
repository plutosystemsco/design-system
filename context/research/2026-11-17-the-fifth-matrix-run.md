# The fifth matrix run: the suite's own faults fixed, the items' faults in view

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a researcher
- **Question:** Run 5 is the first with `020c`, `022p`, `022q`, `022r` and `022s`. What did they fix? What still stands between `release/0.13.0` and a green run? And what does it say for `022q`'s criteria 6 and 8?
- **Stands on:** [the fourth matrix run](2026-11-16-the-fourth-matrix-run.md), cited as *run 4's memo*; [the first speech verdicts](2026-11-16-the-first-speech-verdicts.md), cited as *the speech memo*, by section and by its §10 rows; [`022q`](../specifications/022q-the-speech-suites-own-faults.md), [`022r`](../specifications/022r-the-search-fields-repeated-count-is-a-change.md) and [`022s`](../specifications/022s-the-emptied-tag-list-has-a-line-nvda-can-speak.md).
- **What it blocks:** `022q`'s landing notes (criteria 6 and 8); the `mutate` dispatch (`022q` criterion 7); the small changes and specifications in §7.

## How to read this memo

- **READ:** a job log of run [43974619830](https://github.com/plutosystemsco/design-system/actions/runs/43974619830) (`matrix`, push of `fd18383`), read 2026-11-17 through the GitHub connector; or a file of this repository at `b01e754`. `fd18383`'s code is identical to `b01e754`'s, which only moved two spec files.
  - The 16 failed jobs' last 400 lines came as one file. Four reader logs were cut before their `list` lines, so 1,000 to 1,400 lines were fetched for them: NVDA ff 1 and 3, VO chr 3, VO wk 2.
  - The file lacked `browsers (webkit, 1)`, `(webkit, 2)` and `gate`; each was fetched alone. So were two passing shards, for their times: NVDA chr 3 and VO wk 4.
  - The job list gave each job's created, started and completed times.
  - The artifacts could not be downloaded: this machine's network refuses their blob host. So no `phrases.json`, no passing test's phrases, and no VoiceOver recording was read.
- **EXECUTED:** run in this session's Linux container. Playwright 1.64.1's WebKit, against the main checkout's `build/` (built 2026-11-16 23:34, after `b01e754`, with a clean tree), with `E2E_PREBUILT=1`. No reader runs here.
- **INFERRED:** our reasoning.

Terms, as in the speech memo. A _pair_ is one reader with one browser: VO wk, VO chr, NVDA chr (N-chr), NVDA ff (N-ff). A _window_ is one named capture of phrases. A _walk_ is a run of `next()` steps. A _follow-on X0_ is an X0 a rule returns because another rule did not hold, such as "L3: L1 does not hold".

## 1. The run in one view

- **READ:** 45 jobs. 26 succeeded and 19 failed: `perf`; `browsers (webkit, 1)`, `(webkit, 2)` and `(webkit, 6)`; five of six NVDA shards (all but chromium 3); nine of ten VoiceOver shards (all but webkit 4); `gate`.
- **READ:** all eight Chromium and all eight Firefox browser shards passed. Run 4's two Chromium failures, `upgrade.spec.ts` 020b at 320 and `keyboard.spec.ts:500`, fail nowhere. INFERRED: `020c` and `022p` fixed them.
- **READ:** the three WebKit shards each failed on one flaky test, and nothing else. `failOnFlakyTests` is on in CI (`playwright.config.ts:22`, `022` decision 18).
- **READ:** 33 screen-reader tests failed across the four pairs, against run 4's 82. Nine more were flaky. Nine were not run.
- **READ:** no screen-reader test failed on an O2 fault, an O2 X0, or any of `022q`'s new harness X0s.

## 2. Browsers and perf (question 1)

### WebKit shards 1, 2 and 6

| Shard | Test | Project | Error | First attempt, then |
|---|---|---|---|---|
| 1 | `bar-glass.spec.ts:283`, `/` at 1440, at rest and on hover | `webkit-light` | "hovering Dark theme": `button[theme-toggle] background rgba(233, 229, 219, 0.173)` | passed on retry: 1 flaky, 478 passed |
| 2 | `doors.spec.ts:618`, 017 criterion 13: under reduced motion, Replay plays nothing | `webkit-light` | `expect(running).toBe(0)`, received 8 (line 626) | passed on retry: 1 flaky, 470 passed |
| 6 | the same test | `webkit-dark` | received 1 | passed on retry: 1 flaky, 469 passed |

- **READ:** each shard's summary is "1 flaky", then "playwright exited with code 1". No WebKit test failed both attempts.
- **Is it new since run 4?** Neither test failed in run 4 (READ, run 4's memo §1: all 16 WebKit and Firefox shards passed).
  - **READ:** `git diff c5cdd65 fd18383` touches neither test, nor `bar.svelte`, the theme toggle, the motion page or `replay.svelte`. So the code under both is run 4's.
  - **READ:** the bar-glass test was flaky once before, at 1440 in `webkit-light` (the first matrix run memo, run 2: `bar-glass.spec.ts:279`, the same test before its lines moved).
  - **READ:** no earlier memo names the motion test.
- **The bar-glass hover.** READ: the test hovers each control, waits 250 ms, then reads every computed background. The theme toggle is a ghost button with `transition-[color,background-color,…]` (`button.svelte:10`). EXECUTED: 0 failures in 36 runs (the three pages at 1440, 12 times each, `webkit-light`). INFERRED: on a loaded runner the hover's background transition was still under way at 250 ms. An alpha of 0.173 is a colour mid-fade. A test fault, timing-shaped.
- **The motion page under reduced motion.** EXECUTED: the test failed 1 time in 20 here (`webkit-light` and `webkit-dark`, 10 each), "Received: 8" at line 626. So it is reproducible, not only a CI runner's load. INFERRED: 8 is every specimen dot of one Replay. Under reduced motion `replay.svelte` reads `--motion-micro` as 0 and plays nothing, for the reveal. The entrance re-keys its specimen, and its CSS animations then rely on the reduced-motion tokens. Which button and which animations ran is not yet seen. Kind: unknown, the site page or the test.

### perf

| Page | Budget | Median CLS, run 5 | Run 4 |
|---|---|---|---|
| `/start/` (landing) | ≤ 0.02 | 0.048 | 0.048 on CI |
| `/components/native-select/` (component) | ≤ 0.022 | 0.088 | 0.088 |
| `/changelog/` (leaf) | ≤ 0.02 | 0.083 (one run 0.108) | 0.086 |

- **READ:** `perf.spec.ts:350`, three tests failed both attempts, all on CLS. 23 passed. No LCP, transfer or `.wasm` check failed.
- **INFERRED:** the same three pages and figures as run 4. Not new. Run 4's memo traced them to text reflowing as the web fonts swap in; its next steps, `024g` and `024h`, have not landed.

## 3. Speech, per pair (question 2)

### 3.1 Every failed test

Rules are `tests/sr/rules.ts`'s. Counts are attempts that faulted, of attempts made. Kinds: **I** item; **R** rule; **T** test; **H** harness or runner; **U** unknown.

| Test | N-chr | N-ff | VO chr | VO wk | Rule, as printed | Kind |
|---|---|---|---|---|---|---|
| code-block: copy | fail, L3, 3/3 | fail, L3, 3/3 | flaky, L3, 1/2 | pass | L3: "Copied" was read twice within phrase 1 | I (§3.3) |
| error-summary: the insertion | pass | fail, L3 ×3, 3/3 | pass | flaky, "VoiceOver not running", 1/2 | L3 within one entry | R (§3.3) |
| error-summary: the second submit, unchanged | fail, 3/3 | fail, 3/3 | fail, 3/3 | fail, 3/3 | L1 for the title and each message; L3's follow-on X0 | I (§3.5) |
| settings: a save with an empty name | pass | fail, L3, 3/3 | pass | pass | L3 within one entry | R |
| sign-in: an empty submit | pass | fail, L3 ×2, 3/3 | pass | pass | L3 within one entry | R |
| sign-up: an empty submit | pass | fail, L3 ×2, 3/3 | pass | pass | L3 within one entry | R |
| chart: from before the figure | pass | pass | fail, C2 ×2, 1/1 | fail, C1, 1/1 | C2: "Visitors 412", "Visitors 538" spoken; C1: "Show as table" not spoken after the one before | T; H (§3.3) |
| dropdown-menu: Escape in the sub-menu | pass | pass | fail, timeout, 3/3 | pass | none: "Test timeout of 300000ms exceeded" | T (§3.3) |
| search-field S1, the count | pass | pass | fail, 3/3 | pass | L1 "3 results"; L2, L3 follow-on X0s | I (§3.5) |
| search-field S2, the count again | pass | pass | fail, 3/3 | flaky, 1/2 | L1 "3 results" in the second window | I (§3.5) |
| search-field S3, Clear | pass | pass | pass | fail, 3/3 | F1 "Search projects" | U |
| pagination P2 | pass | pass | fail, 3/3 | flaky, 2/3 | F1 "Page 12" | U |
| pagination P3 | fail, 3/3 | pass | fail, 3/3 | fail, 3/3 | F1 "Previous page" | U |
| app-shell: the skip link | pass | flaky, "Unable to focus", 1/2 | fail, 3/3 | fail, 3/3 | F1 "Projects" | U |
| marketing-bar: the skip link | pass | pass | not run | fail, 3/3 | F1 "Marketing bar" | U |
| composer: Stop moves focus | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Message" | U |
| page-states: the loading status | pass | pass | not run | fail, 3/3 | L1 "Loading projects" | U |
| spinner: the label changes | pass | pass | fail, 3/3 | pass | L1 "Loading runs"; L2 follow-on X0 | U |
| toast S4, repeat | pass | pass | fail, 3/3 | pass | L4: not spoken again on the second trigger | U |
| toast S8, after the title | pass | pass | fail, 3/3 | fail, 3/3 | B1; its follow-on X0 | U |
| toast S10, both channels | pass | pass | fail, 3/3 | fail, 3/3 | L1 "Success: Record A saved" | U |
| tooltip T1, focusing the trigger | pass | fail, 3/3 | pass | pass | T1: the tooltip's text not spoken | U |
| app-shell at 360: the page behind | pass | pass | pass | flaky, "VoiceOver not running", 1/2 | none: test timeout | H |
| toast S1 | pass | pass | pass | flaky, "VoiceOver not running", 1/2 | none: test timeout | H |
| marketing-bar: opening the sheet | pass | flaky, "Unable to focus", 1/2 | not run | pass | none | H |
| sign-in: a summary link | flaky, "Unable to focus", 1/2 | pass | pass | pass | none | H |

- **READ, per pair.** N-chr: 3 failed, 1 flaky, 0 not run. N-ff: 7 failed, 2 flaky. VO chr: 13 failed, 1 flaky, 9 not run. VO wk: 10 failed, 5 flaky. 33 failed and 9 flaky in all.
- **READ, by rule, among the 33 failed tests.** F1: 10. L1: 10 (S1 and S2 among them). L3 within one entry: 6. B1: 2. C1: 1. C2: 1. L4: 1. T1: 1. A timeout with no rule: 1 (dropdown-menu).
- **INFERRED, by kind, among the 33.** Item 8: error-summary's second submit ×4, code-block ×2, S1 and S2 under VO chr. Rule 4: L3 within one entry under N-ff. Test 2: C2 under VO chr, the dropdown-menu hang. Runner 1: the chart's Quick Note under VO wk. Unknown 18.
- **READ, not run:** in VO chr 2, the 40-minute deadline stopped 9 tests: marker, marketing-bar's four, message-log's two, message, and page-states. VO wk ran all 87.

### 3.2 Criterion 6: the speech memo's 18 rule-or-harness rows

`022q` criterion 6: none of these rows fails in any pair for the reason the speech memo gives.

| # | Row (the speech memo §10) | Run 4 pairs | Run 5 | For the memo's reason? |
|---|---|---|---|---|
| 1 | alert-dialog: page behind | all four | pass in all four | no |
| 2 | app-shell at 360: page behind | all four | pass N-chr, N-ff, VO chr; VO wk flaky ("VoiceOver not running", 5.1 min), then pass | no |
| 3 | dialog: page behind | all four | pass in all four | no |
| 4 | marketing-bar: page behind | N-chr, N-ff | pass N-chr, N-ff, VO wk; not run in VO chr | no |
| 5 | product-home at 360: page behind | all four | pass in all four | no |
| 6 | settings' delete confirm: page behind | all four | pass in all four | no |
| 7 | sheet: page behind | N-chr, N-ff | pass in all four | no |
| 8 | sidebar at 360: page behind | all four | pass in all four | no |
| 9 | app-shell at 360: opening speaks its name | N-chr, N-ff | pass in all four | no |
| 10 | chart: from before the figure | all four | pass N-chr, N-ff; **fail VO chr and VO wk** | **no: two new reasons** (§3.3) |
| 11 | pagination P1 | VO wk, VO chr | pass in all four | no |
| 12 | pagination P2 | N-ff | pass in N-ff | no |
| 13 | pagination P3 | N-ff | pass in N-ff | no |
| 14 | sign-up: a resend's status | N-chr, N-ff | pass in all four | no |
| 15 | toast S1 | VO wk | VO wk flaky ("VoiceOver not running"), then pass | no |
| 16 | toast S3 | all four | pass in all four | no |
| 17 | toast S6 | all four | pass in all four | no |
| 18 | tooltip T2 | N-chr, N-ff | pass in all four | no |

- **READ:** the 18 rows held 51 failed runs in run 4. In run 5 they hold 2 failed tests, both the chart under VoiceOver, and 2 flaky ones, both a VoiceOver that stopped.
- **READ:** patch 6's witness, the sheet's O2 test, passes unpatched in all four pairs. INFERRED: so `022q` criterion 7's patch 6 can now be proven.
- **The chart's new reasons.**
  - **VO chr, READ:** C1 held: the walk spoke the figure's name, the 14 ticks, "Show as table", then "Day". C2 faulted on steps 22 and 24: "Visitors 412 column 2 of 2" and "Visitors 538 column 2 of 2". Those are the table's cells, which VoiceOver reads with their column header. The tooltip's texts are the same words (`chart.sr.ts`, `TOOLTIPS`). INFERRED: the 25 steps `022q` decision 6 gave C1 now reach the table's rows, and C2 reads all of them. A test fault: C2 should read only the steps before the table.
  - **VO wk, READ:** the walk spoke the ticks to "Sat", then "Quick Note New Quick Note dialog" for every step after. C1 then failed, and C2 returned its follow-on X0. Run 4's VO wk chart walk ended in the same macOS window (the speech memo §6). INFERRED: Quick Note is macOS's default bottom-right hot corner. VoiceOver can move the mouse pointer with its cursor, and the chart's x-axis ends at the bottom right. A runner fault, not the suite's rule.
  - **READ:** the chart test took 3.5 min (VO chr) and 4.0 min (VO wk), one attempt each, inside its 7-minute timeout.

### 3.3 New faults

**L3 within one entry (`022q` decision 7) faults two kinds of real speech.**

- **code-block, READ:** NVDA said "Copied. Copied. Copy code" in both browsers, every attempt. VO chr said "Copied button main. Copied. Copy code. …" once, then passed. VO wk passed.
- **READ:** the copy button's `aria-label` becomes "Copied" for two seconds, and its status region says "Copied" too (`code-block-copy-button.svelte:70` and `:84`).
- **INFERRED:** NVDA speaks the focused button's new name, then the status. A person hears "Copied" twice. Run 4's two NVDA captures split the two; `022q`'s one capture joins them, and the new L3 form sees it. **Kind: item.** This is the test patch 7 witnesses (`022q` decision 7). Unpatched, it now fails under NVDA, so patch 7 cannot be proven there until the item says "Copied" once.
- **Error summaries under NVDA with Firefox, READ:** "list. Enter a project name, 1 of 3. Enter a project name, link, same page. Enter the owner's email address, 2 of 3. …". Each message is said as a list item, then as its link. It faults error-summary's insertion, and the empty submits of settings, sign-in and sign-up. NVDA with Chromium says "list item, 1 of 3. Enter a project name, link, same page", once (READ).
- **READ:** each message is a plain `<li><a>` (`error-summary.svelte:161–168`).
- **READ:** VoiceOver doubles them too: "There is a problem Enter a project name Enter a project name …" (VO chr, error-summary's first submit). L3 does not fault it there. Its within-entry form needs a part boundary, ". ", between the two, and VoiceOver's phrase has none.
- **INFERRED:** Firefox gives the list item a text of its own, which NVDA reads before the link. The item cannot change that without dropping the list. **Kind: rule.** It needs a ruling: is a list item's text read before its only link a double read? The rule also treats the two readers unequally.

**The dropdown-menu hang, VO chr.**

- **READ:** each attempt waited the whole 5-minute test timeout at `dropdown-menu.sr.ts:64`, `waitFor` of the sub-menu after ArrowRight. Then "Tearing down "screenReader" exceeded the test timeout". Each attempt took 10.0 min; three took 30.
- **READ:** VO wk passed it in 1.4 min; both NVDA pairs passed it.
- **INFERRED:** the sub-menu never opened, so ArrowRight did not reach the sub-trigger. Why is not seen. The test's `waitFor` has no timeout of its own, and the test records no fact that the sub-trigger had focus. **Kind: test.** Its 30 minutes are why VO chr 2 hit its deadline (§4).

**Harness and runner, all covered by a retry.**

- **"VoiceOver not running", READ:** 4 attempts in VO wk, each a 5-minute timeout, in `navigateVoiceOverToWebContent` (guidepup's `lastSpokenPhrase`). App-shell's O2, error-summary's insertion and toast S1 passed on retry. Toast S8's retry #1 was one; S8 failed its other attempts on B1. 20 minutes of VO wk's time.
- **"Unable to focus the application window", READ:** 3 attempts under NVDA ("Nightly" twice in N-ff 1, "Google Chrome For Testing" once in N-chr 3). guidepup's `navigateToWebContent()` threw inside `Sr.open` (`sr.ts:67`). All three passed on retry.
- **"Unable to send keys: to application: VoiceOver", READ:** once, VO chr's composer Stop, retry #1, 15 s.
- **READ:** run 4's "VoiceOver cannot be started" did not recur.

### 3.4 The X0s, by message

- **READ:** every X0 printed is a follow-on X0. Counted per attempt, de-duplicated across the re-fetched logs: "L3: L1 does not hold" 47; "L2: L1 does not hold, so the reader's silence before proves nothing" 6; "B1: "Success: Project created" was not spoken, so nothing comes after" 2; "C2: C1 does not hold" 1.
- **READ, none printed:**
  - "steps: NVDA+Space spoke neither "focus mode" nor "browse mode"";
  - "NVDA said "focus mode", and the second NVDA+Space did not say "browse mode"";
  - "open: the cover took no click …", or the URL-moved X0;
  - "steps: the overlay closed before the walk, so it judges nothing".
- **INFERRED:** every walk got past `022q` decisions 2 and 3, and every overlay stayed open. Where guidepup's helper threw "Unable to focus", it threw before the cover's check could run (READ, `sr.ts:65–70`), and the retry passed.

### 3.5 S2, T3 and the error summary

**S2 (search field), after `022r`:**

| Pair | S2 | S1 | Phrases, READ |
|---|---|---|---|
| N-chr | pass | pass | not printed (passing) |
| N-ff | pass | pass | not printed |
| VO wk | flaky: attempt 1 failed, retry passed | pass | attempt 1: first "s. 3 results. des. …", second "i. desi" |
| VO chr | fail, 3/3 | **fail, 3/3** | S2: first "s. 3 results. …", second "i. desi", every attempt. S1: "s. des. …" or "es. …", no count |

- **READ:** `022r` asked the next run to show S2 in every pair. Both NVDA pairs now hear the repeat. Run 4 heard it in no pair.
- **READ:** S1 under VO chr passed in run 4 (the speech memo §10 has no S1 row). It fails now.
- **INFERRED:** `022r` added a clear 1,000 ms after each count. VO chr spoke the typed letters, then nothing. A count emptied a second after it lands may be gone before VoiceOver in Chromium reads it. That fits S1's new failure and S2's. **Kind: item**, a regression signal for `022r` under VO chr. `022r`'s "Not settled" says to tune the gap if S2 fails; here the hold looks short, not the gap.
- **READ:** VO chr's item text for the search field is `""` in every window. WebKit's reads "des Search projects search text field". So Chromium's item text gives no evidence for this item.

**T3 (tag), after `022s`:** pass in all four pairs, first attempt (READ: N-chr 3, N-ff 3, VO chr 5, VO wk 5). Run 4 failed it in both NVDA pairs. What each reader said is not printed: passing tests print no phrases. `022s`'s "Not settled" questions (the name said twice, an item counted) wait for the `phrases.json` in `sr-*-3` and `sr-voiceover-*-5`.

**The error-summary rows:**

| Test | N-chr | N-ff | VO chr | VO wk |
|---|---|---|---|---|
| the insertion | pass | fail, L3 within one entry | pass | flaky ("VoiceOver not running") |
| the second submit, unchanged | fail: "section" | fail: "section" | fail: "There is a problem and 1 more item group. You are currently on a heading level 2." | fail: "You are currently on a heading level 2." (or as VO chr) |
| each link moves focus | pass | pass | pass | pass |

- **READ:** run 5 is the first in which VoiceOver reached the second submit. It fails there too. VoiceOver names the focused group and its heading, and reads no message again.
- **INFERRED:** the speech memo's item fault holds in all four pairs, not only NVDA's. `022t` is its fix. It is built on the `lane-i-attempt` branch (`035aec2`), not in this run.

### 3.6 NVDA's browse-mode step

- **READ:** no phrase with "focus mode" or "browse mode" is in any log. The step records them under `steps: browse mode` in `phrases.json` (`sr.ts:288`). Passing tests print no phrases, and every NVDA walk passed.
- **INFERRED:** every NVDA walk heard one of the two. Hearing neither, or "focus mode" and then no "browse mode", records an X0 (`sr.ts:289–302`), and none was printed. Which one NVDA said is in the artifacts, not the logs.

### 3.7 What item text showed

- **READ:** every VoiceOver window printed has its "item text" beside it, as `022q` decision 8 requires.
- **READ:** in each F1 failure under VoiceOver, the item text names the target: "Projects heading level 1" (app-shell's skip link), "Marketing bar heading level 1", "Message text entry area", "Page 12 current page button", "Previous page button", "Search projects search text field". The phrases hold the live text ("Page 12 of 12", "Stopped") or the landmark ("main"), then VoiceOver's hint.
- **INFERRED:** VoiceOver's cursor reached the right element every time. Item text says where the cursor is, not what was spoken. So the speech memo's two causes are narrowed, not split: a phrase guidepup's poll missed, or a name VoiceOver did not speak. The run's VoiceOver recordings (`--macos-record`, uploaded under `recordings/`) would tell them apart.

## 4. Shard times (question 3; `022q` criterion 8)

The deadline is the test step's `--global-timeout=2400000`, 40 minutes. "Sum" adds every attempt's time from the `list` lines. The job times are UTC, from the job list.

| Shard | Tests | Failed | Flaky | Passed | Not run | Test time | Sum | First attempts | Job | Waited for a runner |
|---|---|---|---|---|---|---|---|---|---|---|
| N-chr 1 | 32 | 2 | 0 | 30 | 0 | 16.1 | 16.0 | 14.6 | 22:56:17–23:13:43, 17.4 | 0.1 |
| N-chr 2 | 26 | 1 | 0 | 25 | 0 | 11.5 | 11.3 | 10.8 | 22:56:17–23:08:57, 12.7 | 0.1 |
| N-chr 3 | 29 | 0 | 1 | 28 | 0 | 11.8 | 11.7 | 10.9 | 22:56:17–23:09:27, 13.2 | 0.1 |
| N-ff 1 | 32 | 3 | 2 | 27 | 0 | 18.1 | 17.7 | 14.8 | 22:56:17–23:15:41, 19.4 | 0.1 |
| N-ff 2 | 26 | 1 | 0 | 25 | 0 | 12.3 | 12.1 | 11.3 | 22:56:16–23:09:50, 13.6 | 0.0 |
| N-ff 3 | 29 | 3 | 0 | 26 | 0 | 13.7 | 13.4 | 11.0 | 22:56:16–23:11:04, 14.8 | 0.0 |
| VO chr 1 | 19 | 3 | 1 | 15 | 0 | 27.1 | 26.6 | 23.4 | 23:21:56–23:50:20, 28.4 | 25.7 |
| VO chr 2 | 17 | 2 | 0 | 6 | 9 | **40.0, deadline** | 39.1 | 17.2 | 22:56:17–23:37:24, 41.1 | 0.1 |
| VO chr 3 | 19 | 4 | 0 | 15 | 0 | 30.2 | 29.3 | 22.3 | 22:56:17–23:27:50, 31.6 | 0.1 |
| VO chr 4 | 16 | 1 | 0 | 15 | 0 | 18.6 | 18.3 | 16.9 | 23:27:52–23:47:42, 19.8 | 31.6 |
| VO chr 5 | 16 | 3 | 0 | 13 | 0 | 18.0 | 17.4 | 12.7 | 23:37:26–23:56:51, 19.4 | 41.2 |
| VO wk 1 | 19 | 3 | 1 | 15 | 0 | 32.5 | 32.3 | 27.1 | 23:22:29–23:56:21, 33.9 | 26.2 |
| VO wk 2 | 17 | 3 | 1 | 13 | 0 | 25.0 | 24.6 | 19.5 | 22:56:18–23:22:26, 26.1 | 0.1 |
| VO wk 3 | 19 | 2 | 2 | 15 | 0 | 24.6 | 24.3 | 19.4 | 22:56:17–23:21:54, 25.6 | 0.1 |
| VO wk 4 | 16 | 0 | 0 | 16 | 0 | 17.7 | 17.6 | 17.6 | 22:56:18–23:15:19, 19.0 | 0.1 |
| VO wk 5 | 16 | 2 | 1 | 13 | 0 | 22.8 | 22.5 | 15.2 | 23:15:22–23:39:20, 24.0 | 19.1 |

All figures in minutes.

- **READ:** 15 of 16 reader shards ended inside the 40-minute deadline. VO chr 2 did not: "Timed out waiting 2400s for the test suite to run", with 9 tests not run. Its dropdown-menu hang took 30.0 of its 39.1 minutes (§3.3).
- **READ, the splits:** 19, 17, 19, 16 and 16 tests a VoiceOver shard, as `022q` decision 9 measured. Shard 1, with the chart, took 27.1 (VO chr) and 32.5 (VO wk), inside decision 9's 37.4-minute worst case.
- **READ, the waves:** five VoiceOver jobs started at 22:56:17–18. Each of the other five started 2 to 4 s after one of them ended: VO wk 5 at 23:15:22, VO chr 1 at 23:21:56, VO wk 1 at 23:22:29, VO chr 4 at 23:27:52, VO chr 5 at 23:37:26. INFERRED: five macOS slots, as run 4's memo found. The later jobs waited 19.1 to 41.2 minutes.
- **READ, wall time:** the VoiceOver jobs ran from 22:56:17 to 23:56:51, 60.6 minutes. The run ran from `build`'s start, 22:55:34, to `gate`'s end, 23:57:35: 62.0 minutes, below run 4's 80 (`022q` decision 9). INFERRED: without the hang, VO chr 5 would have started about 30 minutes sooner, and the run would have ended sooner by up to that.
- **READ, against `022` criterion 22's 20-minute bar:** all six NVDA shards are under it (11.5 to 18.1). Three VoiceOver shards are: VO chr 4, VO chr 5 and VO wk 4.

**The pace, by pair** (READ, summed from the `list` lines):

| Pair | Tests reached | Minutes | Min per test | Run 4 | First attempts | Retries |
|---|---|---|---|---|---|---|
| N-chr | 87 | 39.6 | 0.46 | 0.67 | 36.3 | 3.3 |
| N-ff | 87 | 43.2 | 0.50 | 0.73 | 37.1 | 6.1 |
| VO chr | 78 | 130.7 | 1.68 | 1.60 | 92.5 | 38.2 |
| VO wk | 87 | 121.3 | 1.39 | 1.69 | 98.8 | 22.5 |

- **INFERRED:** retries fell from about 42% of VoiceOver's time (the speech memo §9) to 29% (VO chr) and 19% (VO wk). VO chr's figure holds the dropdown-menu's 30 minutes. Without it, VO chr took 100.7 minutes for 77 tests, 1.31 a test.

## 5. `gate` (question 4)

- **READ:** `gate (full): fail`, then "browsers is failure", "perf is failure", "voiceover is failure", "nvda is failure". `build`, `checks` and `report` succeeded.
- **INFERRED:** `gate` failed only because four of its needed jobs did. It found no fault of its own. `report` merged the blobs; its ledger-mismatch check is in its artifact, which this memo could not read. No screen-reader line is in `tests/fault-ledger.ts` (READ), so the speech failures are not ledgered.

## 6. `022q`'s criteria from this run

- **Criterion 6: not met.**
  - Clause 1 holds: none of the 18 rows fails for the speech memo's reason (§3.2). The chart still fails under VoiceOver, for two new reasons, to be named in the landing notes: C2 reads the table's cells (VO chr); the walk left for Quick Note (VO wk).
  - Clause 2 fails: VO chr 2 hit its 40-minute deadline, with 9 tests not run (§4).
  - Clause 3 holds as far as the logs show: every printed VoiceOver window has its "item text" (§3.7). Passing tests' `phrases.json` was not read.
- **Criterion 7:** not this run; it needs a `mutate` dispatch. Patch 6 can now be proven (§3.2). Patch 7's witness fails unpatched under NVDA (§3.3), so patch 7 waits for code-block's fix.
- **Criterion 8:** each shard's time and the per-pair counts are §4 and §3.1. The scorecard's run-log row is the landing's, not this memo's.

## 7. What is left (question 5)

| What | Where | Kind | Cause | Next |
|---|---|---|---|---|
| error-summary: the second submit, unchanged | all four pairs | item | the alert does not fire again; NVDA says "section", VoiceOver the group's name (§3.5) | `022t`, built on `lane-i-attempt`; the next run judges it |
| code-block: "Copied" read twice | N-chr, N-ff; VO chr once | item | the button's name and its status both become "Copied" (§3.3) | a small change in lane I: one of the two says it. It unblocks patch 7 (criterion 7) |
| search-field S1 and S2 | VO chr; S2 flaky in VO wk | item | INFERRED: `022r`'s 1,000 ms clear empties the count before VoiceOver in Chromium reads it (§3.5) | a ruling in `022r`'s landing notes, then a small change in lane I: drop the timed clear and keep the keystroke clear, which alone gives S2 its 750 ms gap. Its check: the next run's S1 and S2 in all four pairs |
| L3 within one entry: a list item, then its link | N-ff: error-summary, settings, sign-in, sign-up | rule | NVDA in Firefox says each message as a list item, then as a link; VoiceOver doubles it too, unseen by the rule (§3.3) | a specification in lane E, since it amends `022q` decision 7. A question for the owner, below |
| chart C2 reads the table | VO chr | test | the 25 steps reach the table's cells, which VoiceOver reads with their header (§3.2) | a small change in lane E: C2 reads only the steps before the first header |
| chart walk leaves for Quick Note | VO wk | harness | INFERRED: the pointer reaches macOS's bottom-right hot corner (§3.2) | a small change in lane E: the macOS setup turns the hot corners off; first, read the runner's `com.apple.dock` corner settings in a job step |
| dropdown-menu: the sub-menu hang | VO chr | test | the sub-menu never opened; `waitFor` has no timeout; teardown took 5 more minutes an attempt (§3.3) | a small change in lane E: a 10 s `waitFor`, and a fact that the sub-trigger has focus before ArrowRight. It ends VO chr 2's deadline |
| VO chr 2 past its deadline | VO chr 2 | budget | the hang above | none of its own: the row above, then the next run |
| "VoiceOver not running" | VO wk, 4 attempts, 20 min | harness | VoiceOver stopped inside guidepup's web-content helper | watch one more run; if it recurs, a small change in lane E so the attempt fails at once, not after 5 minutes |
| "Unable to focus the application window" | NVDA, 3 attempts | harness | guidepup's helper could not bring the browser forward | watch; each retry passed |
| A focused element's name not in the log | app-shell and marketing-bar skip links, composer Stop, P2, P3, S3 (VoiceOver) | unknown | item text puts the cursor on the target each time (§3.7) | the owner downloads one VoiceOver `recordings/` artifact (VO wk 1, app-shell's skip link) and listens. That tells a missed poll from an unspoken name. Then a specification |
| A live announcement missing | spinner, page-states, toast S4, S8, S10 (VoiceOver) | unknown | one of two near-simultaneous announcements, as in the speech memo §6; S10 now fails in both VoiceOver pairs | the same recording; page-states also needs `022q`'s deferred client-side navigation |
| P3 under N-chr: "Previouspage, button" | N-chr | unknown | the space before the hidden " page" span is lost (the speech memo §8) | a small change in lane I, once a check that fails first is found |
| tooltip T1 | N-ff | unknown | NVDA said "Deploy, button" and not the tooltip | record whether the tooltip is open after the focus, beside the phrases (out of `022q`'s scope) |
| perf: CLS on `/start/`, `native-select`, `/changelog/` | `perf` | budget | the web fonts' swap, as in run 4 | `024g` (specification, lane T) and `024h` (small change, lane S) |
| motion page: Replay under reduced motion | `webkit-light`, `webkit-dark`, flaky | unknown | EXECUTED: 1 in 20 here, received 8 running animations (§2) | a probe first: log which Replay and each animation's duration. Then a small change in lane S (the page) or lane E (the test) |
| bar-glass: the hover read | `webkit-light`, flaky | test | INFERRED: the toggle's hover transition read mid-fade at 250 ms (§2) | a small change in lane E: wait for the bar's transitions to finish before reading |

**A question for the owner, from the L3 row.** NVDA with Firefox says "Enter a project name, 1 of 3. Enter a project name, link, same page". Is that a double read the rule should fault?

1. **No, recommended.** L3 within one entry skips a repeat that is a list item's text followed by the link it holds. The four tests then judge the items, not Firefox's list. The error summary's markup stays a plain list of links, as `019` chose.
2. Yes. The four tests are ledgered under N-ff until an item change avoids the list item's own text, which would need a specification of `error-summary`.
3. Yes, and the rule also learns VoiceOver's doubled phrase without a ". ", so both readers are judged alike. The four tests and VoiceOver's error summaries then fail until the item changes.

**The owner's answer (2026-11-17): 3.** It is a double read, and the rule also learns VoiceOver's doubled phrase, so both readers are judged alike. The four tests and VoiceOver's error summaries fail until the item changes. Two specifications follow: `022z`, L3 learns VoiceOver's doubled phrase (lane E), and `019b`, the error summary's messages are read once (lane I).

## 8. What this memo did not see

- Every artifact: `phrases.json`, `faults.json`, the merged report and its ledger check, the VoiceOver recordings. The blob host is refused here.
- The phrases of passing tests, so T3's words, S2's repeat under NVDA, and NVDA's browse-mode announcement.
- The 9 tests VO chr 2 did not run, so marker, marketing-bar, message-log, message and page-states under VO chr.
- Any speech: no reader runs here. Every speech claim is READ from the logs.
- Firefox locally, which this container has no build of. The WebKit repeats ran on this container's Linux, not CI's runner.

## 9. Run 6

Run 6 is [43974717942](https://github.com/plutosystemsco/design-system/actions/runs/43974717942), a push of `b01e754`. Its code is run 5's. So what changes between the two is chance, or the runners.

- **READ:** the job list; the logs of every failed job, read 2026-11-17 through the GitHub connector, each at 1,500 to 2,000 lines so the `list` lines were in; the tails of `browsers (webkit, 1)`, `(webkit, 2)`, `(webkit, 6)`, `voiceover (webkit, 4)` and `nvda (chromium, 3)`; the list of `matrix.yml` runs.
- **Not read:** the artifacts. Their blob host is still refused here.

### 9.1 Jobs

- **READ:** 45 jobs. 28 succeeded and 17 failed: `checks`, `perf`, five NVDA shards (all but chromium 3), nine VoiceOver shards (all but webkit 4), `gate`.
- **READ:** against run 5's 19, WebKit shards 1, 2 and 6 now pass, and `checks` now fails. Every other failed job is run 5's.
- **READ, `checks`:** one unit test failed: "the streaming budget (decision 20) › a 2,000-line stream in 50 chunks … 4 ms or less per chunk, p95" (`tests/unit/highlight-session.test.ts:297`); 1,906 passed. It passed in run 5 on the same code.
  - **INFERRED:** a wall-clock budget missed on a loaded runner. A timing flake, new in run 6.
- **READ, `gate`:** "checks is failure", "perf is failure", "voiceover is failure", "nvda is failure". `browsers` is no longer named.
- **READ, the overlap:** run 6 was created 38 s after run 5 (22:56:10 against 22:55:32). Its first VoiceOver job started at 23:39:22, 2 s after run 5's VO wk 5 ended. Each of the next four started 2 to 4 s after a VoiceOver job of either run ended.
  - **INFERRED:** both runs shared the same five macOS slots. Run 6's VoiceOver jobs waited 42.6 to 87.9 minutes. The run took 116.1 minutes, `build`'s start to `gate`'s end, against run 5's 62.0.

### 9.2 Browsers and perf

- **READ, WebKit 1, 2 and 6:** 479, 471 and 470 passed, no flaky test. Run 5 had 1 flaky in each, beside 478, 470 and 469.
- **READ:** so the bar-glass hover (`bar-glass.spec.ts:283`) and the motion page's Replay under reduced motion (`doors.spec.ts:618`) passed first time.
- **READ:** all 24 browser shards succeeded. **INFERRED:** with `failOnFlakyTests` on, no other browser test flaked either.
- **READ, perf:** the same three tests failed both attempts, on CLS only; 23 passed.

| Page | Budget | Median CLS, run 6 | Run 5 |
|---|---|---|---|
| `/start/` | ≤ 0.02 | 0.048 | 0.048 |
| `/components/native-select/` | ≤ 0.022 | 0.088 (one run 0.109) | 0.088 |
| `/changelog/` | ≤ 0.02 | 0.083 (one run 0.108) | 0.083 (one run 0.108) |

### 9.3 Speech, per pair

**READ, the counts:**

| Pair | Failed | Flaky | Not run | Run 5 |
|---|---|---|---|---|
| N-chr | 3 | 0 | 0 | 3, 1, 0 |
| N-ff | 7 | 0 | 0 | 7, 2, 0 |
| VO chr | 12 | 2 | 9 | 13, 1, 9 |
| VO wk | 11 | 4 | 0 | 10, 5, 0 |
| All | 33 | 6 | 9 | 33, 9, 9 |

**The named faults:**

- **error-summary's second submit, READ:** fails 3/3 in all four pairs again. NVDA says "section". VoiceOver names the heading or the group. Repeats.
- **code-block's "Copied", READ:** NVDA says "Copied. Copied. Copy code" in both browsers, 3/3. Repeats. VO chr passed first time; its one run 5 fault did not recur.
- **search-field S1 and S2, READ:**
  - VO chr S2 fails 3/3: first "s. 3 results. …" or "s. des. …", second "i. desi". Repeats.
  - VO chr S1 failed once, then passed. It was 3/3 in run 5; now a flake.
  - VO wk S1 and S2 both passed first time. S2 was flaky in run 5.
- **The four L3 faults under N-ff, READ:** error-summary's insertion, settings, sign-in and sign-up fail 3/3, each message said as a list item, then as its link. Repeats.
- **Chart C2, READ:** VO chr's walk reads the table's cells, "Visitors 412" and "Visitors 538". C2 faults. Repeats.
- **The dropdown-menu hang, READ:** VO chr, three attempts of 10.0 minutes, "waitFor: Test ended". Repeats. NVDA and VO wk pass it.
- **The Quick Note escape, READ:** not seen. No phrase holds "Quick Note".
  - **READ, new:** VO wk's chart walk spoke the ticks to "Sun", then "image" for its last nine steps. It never reached "Show as table". C1 faults; C2 returns its follow-on X0.
  - **INFERRED:** VoiceOver's cursor stopped on the plot's image in WebKit. A new way for the same walk to fail; the cause is not seen.
- **"VoiceOver not running", READ:** three attempts, all in VO wk 3, each about 5 minutes: P3 attempt 1, and the delete confirm's opening and its page behind. The two settings tests passed on retry. None of run 5's four tests met it again.
  - **READ, new:** P3's retry #1 threw "VoiceOver cannot be started" (`spawnSync /usr/bin/osascript ETIMEDOUT`), run 4's error, in 13.8 s.
- **"Unable to focus the application window", READ:** in no log. Run 5's three attempts, all passed on retry, are flakes.
- **The unknown rows, READ:** every run 5 failure repeats, with the same rule and pairs:
  - F1: app-shell's skip link (VO chr, VO wk), marketing-bar's skip link (VO wk), composer Stop (VO chr, VO wk), P2 (VO chr; VO wk flaky again), P3 (N-chr "Previouspage", VO chr, VO wk), S3 (VO wk);
  - L1, L4, B1: spinner (VO chr), page-states (VO wk), toast S4 (VO chr), S8 and S10 (VO chr, VO wk);
  - T1: tooltip (N-ff).
  - **READ:** run 5's flaky N-ff app-shell skip link and marketing-bar sheet, and N-chr's sign-in summary link, passed first time.

**New in run 6, READ:**

- chat, "a send: the composer's status says Response complete": VO wk fails 3/3, VO chr once then passes. L1, "Response complete" was not spoken whole. Kind: unknown.
- dialog, "opening speaks the dialog's title": VO wk once, then passes. The overlay's name "Rename project" was not spoken; the phrase is the trigger's. Kind: unknown.

**`022q`'s checks, READ:** no O2 fault, no O2 X0, none of `022q`'s new harness X0s. Every X0 printed is a follow-on X0, as in run 5.

### 9.4 Shard times

The deadline is 40 minutes. "Test" is Playwright's own figure; "Job" and "Waited" come from the job list. All in minutes.

| Shard | Tests | Failed | Flaky | Not run | Test | Run 5 | Job | Waited |
|---|---|---|---|---|---|---|---|---|
| N-chr 1 | 32 | 2 | 0 | 0 | 15.5 | 16.1 | 16.9 | 0.0 |
| N-chr 2 | 26 | 1 | 0 | 0 | 10.6 | 11.5 | 11.9 | 0.0 |
| N-chr 3 | 29 | 0 | 0 | 0 | 11.2 | 11.8 | 12.4 | 0.0 |
| N-ff 1 | 32 | 3 | 0 | 0 | 17.5 | 18.1 | 18.7 | 0.0 |
| N-ff 2 | 26 | 1 | 0 | 0 | 12.6 | 12.3 | 13.9 | 0.0 |
| N-ff 3 | 29 | 3 | 0 | 0 | 14.5 | 13.7 | 15.7 | 0.0 |
| VO chr 1 | 19 | 3 | 1 | 0 | 25.8 | 27.1 | 26.9 | 87.9 |
| VO chr 2 | 17 | 2 | 0 | 9 | **40.0, deadline** | 40.0, deadline | 41.4 | 68.6 |
| VO chr 3 | 19 | 3 | 1 | 0 | 27.0 | 30.2 | 28.3 | 59.6 |
| VO chr 4 | 16 | 1 | 0 | 0 | 18.2 | 18.6 | 19.3 | 59.9 |
| VO chr 5 | 16 | 3 | 0 | 0 | 16.3 | 18.0 | 17.5 | 51.0 |
| VO wk 1 | 19 | 4 | 1 | 0 | 27.9 | 32.5 | 28.9 | 53.6 |
| VO wk 2 | 17 | 3 | 0 | 0 | 25.2 | 25.0 | 26.7 | 79.2 |
| VO wk 3 | 19 | 2 | 3 | 0 | 38.0 | 24.6 | 39.2 | 60.1 |
| VO wk 4 | 16 | 0 | 0 | 0 | 16.8 | 17.7 | 18.0 | 82.6 |
| VO wk 5 | 16 | 2 | 0 | 0 | 15.9 | 22.8 | 17.2 | 42.6 |

- **READ:** 15 of 16 shards ended inside the deadline. VO chr 2 did not, again: "Timed out waiting 2400s", 9 tests not run. The dropdown-menu hang took 30.0 of its minutes.
- **READ:** VO wk 3 ended at 38.0, 2 minutes short. Its three "VoiceOver not running" attempts took about 15 of them.
- **READ:** all six NVDA shards are under `022` criterion 22's 20-minute bar. Four VoiceOver shards are: VO chr 4, VO chr 5, VO wk 4, VO wk 5.

### 9.5 Run 5's §7 rows in run 6

| Row (§7) | Run 6 |
|---|---|
| error-summary: the second submit | repeats, all four pairs |
| code-block: "Copied" read twice | repeats under NVDA; VO chr's fault: flake (passed in run 6) |
| search-field S1 and S2 | S2 under VO chr repeats; S1 under VO chr: flake (failed once, passed on retry); S2 under VO wk: flake (passed in run 6) |
| L3: a list item, then its link | repeats, N-ff, all four tests |
| chart C2 reads the table | repeats, VO chr |
| chart walk leaves for Quick Note | flake (passed in run 6): no Quick Note; the VO wk walk fails a new way, on "image" (new in run 6) |
| dropdown-menu: the sub-menu hang | repeats, VO chr |
| VO chr 2 past its deadline | repeats |
| "VoiceOver not running" | repeats, in three other tests (VO wk 3); "VoiceOver cannot be started" once: new in run 6 |
| "Unable to focus the application window" | flake (passed in run 6): not seen |
| A focused element's name not in the log | repeats, every test and pair |
| A live announcement missing | repeats, every test and pair |
| P3 under N-chr: "Previouspage" | repeats |
| tooltip T1 | repeats, N-ff |
| perf: CLS on three pages | repeats, the same values |
| motion page: Replay under reduced motion | flake (passed in run 6) |
| bar-glass: the hover read | flake (passed in run 6) |
| `checks`: the streaming budget | new in run 6 |
| chat: "Response complete" (VO wk; VO chr flaky) | new in run 6 |
| dialog: opening, VO wk, flaky | new in run 6 |
| the two runs share five macOS slots; 116 minutes | new in run 6 |

### 9.6 `022q`'s criteria 6 to 8

- **Criterion 6: not met.** Clause 1 holds, as in run 5: no row fails for the speech memo's reason (READ). Row 10, the chart, still fails under VoiceOver, for reasons the landing notes must name: C2 reads the table (VO chr, as in run 5); the walk stops on "image" (VO wk, new). The other 17 rows pass in every pair that ran them; row 6 needed a retry under VO wk ("VoiceOver not running"), and row 4 did not run under VO chr (READ). Clause 2 fails: VO chr 2 hit its deadline again (READ). Clause 3 holds as far as the logs show: all 87 VoiceOver windows printed have their "item text" beside them (READ); no `phrases.json` was read.
- **Criterion 7: not yet run.** All six `matrix.yml` runs are pushes; none is a `workflow_dispatch`, so no `mutate` dispatch exists since `022q` landed (READ).
- **Criterion 8: not met.** The shard times (§9.4, §4) and the per-pair counts (§9.3, §3.1) are ready (READ). The landing notes do not yet record them, and the scorecard's run-log row is not written (READ, `022q`'s Landing notes).
