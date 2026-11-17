# The eighth matrix run: the run-7 batch heard

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a researcher
- **Question:** Run 8 is the first with `020d`, `019b`, `032c`, `022ab` and `022aa`. What does it say for `019b` criterion 11 and `022t` criterion 14? Did `022aa`'s 10 s bounds hold under real readers? What is fixed, what is new, and what is left?
- **Stands on:** [the seventh matrix run](2026-11-17-the-seventh-matrix-run.md), cited as *run 7's memo*; the specifications [`019b`](../specifications/019b-the-error-summarys-messages-are-read-once.md), [`022t`](../specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md), [`022aa`](../specifications/022aa-no-screen-reader-wait-without-a-bound.md), [`022ab`](../specifications/022ab-the-streaming-budget-measured-off-the-wall-clock.md), [`032c`](../specifications/032c-no-test-only-reaches-ci.md) and [`020d`](../specifications/020d-0-12-0-was-never-released.md).
- **What it blocks:** the landing notes of `019b` (criterion 11; decisions 6 and 7), `022t` (criterion 14) and `022ab`; the owner's answer in §11; the rows in §10.

## How to read this memo

- **READ:** a job log or the job list of run [44078599146](https://github.com/plutosystemsco/design-system/actions/runs/44078599146) (`matrix`, push of `db8fb65`), read 2026-11-17 through the GitHub connector; or a file of this repository at `db8fb65`.
  - The 16 failed jobs' logs came whole, as one file. `gate` came alone.
  - Fetched alone, also whole: `build`, `checks`, VO wk 4 (the one passing reader shard), and the eight Chromium browser shards.
  - Not read: the Firefox and WebKit browser shards' logs. All 16 succeeded (the job list).
- **Not read:** the artifacts. They cannot be downloaded here. So no `phrases.json`, no merged report, no recording.
- **INFERRED:** our reasoning.

Terms, as in *run 7's memo*. A _pair_ is one reader with one browser: N-chr, N-ff, VO chr, VO wk. A _window_ is one named capture of phrases. A _follow-on X0_ is an X0 a rule returns because another rule did not hold.

**What the run carries (READ, `git log 7ec5488..db8fb65`).** `020d` (`6482736`), `019b` (`331dd9d`), `032c`, `022ab` and `022aa` (`89a0de7`), and the context commit `db8fb65`. The error summary's links now sit straight in a `div` with `data-slot="error-summary-links"`, inside the `role="alert"` content node, after the `h2` title (`error-summary.svelte:153–185`).

## 1. Jobs (question 1)

- **READ:** 45 jobs. 28 succeeded and 17 failed: `perf`; all six NVDA shards; nine of ten VoiceOver shards (all but webkit 4); `gate`.
- **READ, against run 7's 15:** NVDA chr 1 and NVDA chr 3 now fail. Every other failed job is run 7's. No failed job of run 7 passes.
- **READ, `gate`:** "gate (full): fail", then "perf is failure", "voiceover is failure", "nvda is failure". `build`, `checks`, `browsers` and `report` succeeded.
- **READ, the run list:** eight `matrix` runs, all pushes. Run 8 was created at 11:57:04. Run 7 had ended at 05:00:00. No other run overlapped it.
- **READ, wall time:** `build` started 11:57:07; `gate` ended 12:59:15. **62.1 minutes**, against run 7's 55.8.
- **INFERRED:** the 6.3 extra minutes are on the critical path, VO wk 1 then VO wk 3 (§9). VO wk 1 lost 5.0 minutes to one "VoiceOver not running" attempt.

## 2. `019b` criterion 11 (question 2)

Criterion 11: in this run, the five tests pass **L1 for the title and every message, and L3 for every message**, in every pair that reaches them. The title's L3 is not part of it.

### 2.1 The verdict, per test and pair

| Test | N-chr | N-ff | VO chr | VO wk |
|---|---|---|---|---|
| error-summary: the insertion | **fail, 3/3:** L1 title; L3 each message | fail, 3/3: the same | fail, 3/3: L3 each message | pass, first attempt |
| error-summary: the second submit, unchanged | **fail, 3/3:** L1 title; L3 each message | fail, 3/3: the same | fail, 3/3: L3 each message; the title's L3 in attempt 2 | pass, first attempt |
| settings: a save with an empty name | **fail, 3/3:** L1 title; L3 "Enter your name" | fail, 3/3: the same | fail, 3/3: L3 "Enter your name" | pass, first attempt |
| sign-in: an empty submit | **fail, 3/3:** L1 title; L3 both messages | fail, 3/3: the same | fail, 3/3: L3 both messages | pass, first attempt |
| sign-up: an empty submit | **fail, 3/3:** L1 title; L3 both messages | fail, 3/3: the same | fail, 3/3: L3 both; attempt 2 L1 "Enter a password" | pass, first attempt |
| the three link tests (error-summary, settings, sign-in) | pass | pass | pass | pass |

- **READ:** every pair reached every test. Each ran to its `judge`. The only X0s are follow-ons: "L3: L1 does not hold" and "L2: L1 does not hold …" (NVDA), and "L3: L1 does not hold" (VO chr, sign-up attempt 2).
- **READ:** N-chr passed all five in run 7. It fails all five now. That is the two new failed jobs.
- **Verdict: criterion 11 is not met.** It holds in VO wk only. Under NVDA, in both browsers, the title is not spoken and every message is read twice. Under VO chr, every message is still read twice.

### 2.2 NVDA: the title gone, each message doubled

- **READ, the insertion, N-chr and N-ff, all six attempts alike:** "section. alert, Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address Choose who can see the project Choose who can see the project. Enter a project name, link, same page. Enter the owner's email address, link, same page. Choose who can see the project, link, same page".
- **READ, sign-in:** "section. alert, Enter your email address Enter your email address Enter your password Enter your password. Enter your email address, link, same page. Enter your password, link, same page". Settings and sign-up have the same shape.
- **READ:** "There is a problem" is in no NVDA phrase of the five tests. Each message is said three times: twice in the alert's text, once as its link.
- **READ, run 7 on the list markup:** N-ff said "section. alert. There is a problem, heading, level 2. list. Enter a project name, 1 of 3. Enter a project name, link, same page. …". N-chr passed.
- **INFERRED:** the change is `019b`'s. It is the only change in this run that touches these five tests, and the phrase differs exactly at the summary.
- **INFERRED, the mechanism, to be checked by research:** the pattern fits NVDA's own way of reading an alert, not the browser.
  - NVDA speaks an alert as its role, then a text it gathers from the alert's children, then each focusable descendant ("…, link, same page").
  - As we recall NVDA's source (`Dialog.getDialogText`, in `source/NVDAObjects/behaviors.py`; not read here), that text takes static text, labels and links. It skips a heading. For a link it adds the link's name, then the link's text. It does not descend into a list.
  - That predicts both runs. On the list, the gathered text was empty, and NVDA read the content another way, title first. On the bare links, the text is each link twice, and the title is skipped.
  - Both browsers give the same phrase. That also points at NVDA, not at Chromium's or Firefox's tree.
- **READ:** `019b`'s changelog bullet says NVDA reads each message once (decision 6). Its page says "The links are not in a list, so each message is read once" (decision 7). This run refutes both for NVDA.

### 2.3 VO chr: the double was not the list

- **READ, the insertion, all three attempts:** "There is a problem Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address Choose who can see the project Choose who can see the project", then "You are currently on a heading level 2.".
- **READ:** run 7's VO chr phrase on the list markup was the same, word for word (*run 7's memo* §3.3).
- **READ:** sign-in, sign-up and settings repeat the shape. Sign-up's attempt 2 window stops after "Enter your email address Enter your email address": L1 for "Enter a password", with a follow-on X0.
- **INFERRED:** removing the list changed nothing under VO chr. Criterion 11 says what follows: "Under VO chr it shows that *the memo*'s §2 inference was wrong: Chromium's tree has no wrapper left". The double is the link itself, read as its name and then its text. NVDA's new double has the same shape. One research memo can take both.

### 2.4 VO wk

- **READ:** all five tests and the three link tests pass, first attempt, as in run 7. Passing tests print no phrases.
- **INFERRED:** whether VoiceOver in WebKit reads each message once is still unseen. The owner's download of `sr-voiceover-webkit-2`, `-3` and `-4` would show it (*run 7's memo* §5).

### 2.5 The title under VO chr (`019c`'s row, not `019b`'s)

- **READ:** the title faults L3 "within phrase 1" in 1 of 15 VO chr attempts: the second submit's attempt 2. Its second window: "There is a problem and 3 more items group. There is a problem Enter a project name …".
- **READ, run 7:** 4 of 15: 2 of 3 insertion attempts, 1 of 3 second-submit attempts, 1 of 3 settings attempts, with "… and 1 more item group".
- **INFERRED:** the root now has four items, the title and three links, where it had the title and a list. So the group's count moved from 1 to 3. The fault itself remains: the focused root's name lands in the alert's phrase. It is rarer here, 1 of 15 against 4 of 15. That is too few attempts to call it better.

### 2.6 What `019b` says follows

- Decisions 6 and 7: the bullet and the page sentence are amended with the finding.
- Criterion 11: a research memo opens with the phrases. The markup is not changed again by guess.
- Open question 3 (a), answered: `019b` stays landed if a VoiceOver pair still doubles a message. Its reason was "NVDA with Firefox reads once whatever VoiceOver does". This run refutes that reason. §11 asks again.
- Decision 9, INFERRED: the insertion test still fails unpatched under N-ff and VO chr, and now N-chr too. So patches 4 and 7b cannot be proven in those three pairs. VO wk passes unpatched, so it is the only pair where they can.

## 3. `022t` criterion 14, re-judged (question 3)

Criterion 14: the unchanged second submit passes L1 and L3 under both NVDA pairs and each VoiceOver pair that reaches it. The insertion and the three blocks' summary tests pass as before. "Reaches" means the test ran to its `judge` and `faults.json` holds no X0.

| Pair | Run 8 | Run 7 | The windows, READ |
|---|---|---|---|
| N-chr | **fail, 3/3:** L1 title; L3 each message; follow-on X0 | pass | first and second windows identical, the phrase in §2.2 |
| N-ff | fail, 3/3: the same | fail, L3 | first and second identical |
| VO chr | fail, 3/3: L3 each message; title L3 in attempt 2 | fail, L3; L1 lost in 2 attempts | both windows re-read the alert whole, all three attempts |
| VO wk | **pass**, first attempt | pass | not printed |

- **READ:** in every failing pair, the second window repeats the first. So the unchanged second submit is announced again in all four pairs. `022t`'s mechanism works.
- **READ:** VO chr's second window kept its L1 in all three attempts. Run 7 lost it in two.
- **INFERRED, "reaches":** the NVDA pairs' faults hold a follow-on X0, "L3: L1 does not hold". By criterion 14's letter they did not reach it. Either way they are not a pass.
- **Verdict: criterion 14 is not met.** It holds in VO wk only, where run 7 held it in N-chr and VO wk. Its "as before" clause fails too: the insertion and the blocks fail in N-chr, N-ff and VO chr.
- **INFERRED:** the cause is the summary's content, not the re-announcement. `022t` needs no change. It is judged again after the fix for §2.2 and §2.3.

## 4. `022aa` under real readers (question 4)

### 4.1 The strings

Searched in all 16 reader logs (the 15 failed shards and VO wk 4), READ:

| String | Hits | Where |
|---|---|---|
| "within 10 s" | 1 | VO chr 2, the dropdown's sub-menu test, attempt 1 |
| "Timeout 10000ms" | 0 | — |
| "navigationTimeout" | 0 | — |
| "30000ms" | 0 | — |
| "was not … within" (`appears()`'s X0) | 0 | — |
| "focus was on" (`appears()`'s X0) | 0 | — |

- **READ, the one hit:** "the sub-menu did not open within 10 s of ArrowRight; focus before it was on div[data-slot="dropdown-menu-item"] "Sign out", and after the wait on div[data-slot="dropdown-menu-item"] "Sign out"". The retry passed in 1.5 minutes.
- **READ:** that message is `022x`'s own bounded wait (`dropdown-menu.sr.ts:100`, `waitFor({ timeout: 10_000 })`, message at `:116`). `022aa` left it unchanged. It is not `appears()`.
- **READ, `checks`:** the `022aa` unit tests pass, among them "actionTimeout, navigationTimeout and expect.timeout are set and finite (CI)". The two other "within 10 s" lines in `checks` are unrelated smoke tests.

### 4.2 Did a 10 s bound fail a test?

- **READ: no test failed on a `022aa` bound,** on the macOS or the Windows runners. No `appears()` timed out. No action hit `actionTimeout`. No navigation hit `navigationTimeout`.
- **READ:** every fault in the reader logs is a rule fault, a follow-on X0, `022x`'s sub-menu X0 (once), or a harness error: "VoiceOver not running" (twice) and "Unable to send keys" (once).
- **INFERRED, the sub-menu:** focus stayed on "Sign out" through the whole wait. The menu did not open at all, so a longer bound would not have helped. The bound named the cause in 10 s, as `022x` meant it to.
- **INFERRED: the bounds held under real readers.**

### 4.3 Faster or slower?

- **READ:** the two "VoiceOver not running" attempts still ran to the 5-minute test timeout (chat, 5.0 minutes; spinner, 5.1). That wait is inside guidepup's `navigateVoiceOverToWebContent`. `022aa` does not bound it, as *run 7's memo* predicted. `022ad` does.
- **INFERRED:** no shard's time moved because of `022aa`. Each shard's change has another cause (§9): N-chr's three shards rose by 0.8 to 1.5 minutes from the five summary tests now running three attempts each; VO wk 1 rose by 5.2 from chat's stalled attempt.

## 5. `022ab`: the streaming budget (question 5)

- **READ, the printed figure:** `stream: best p95 2.88 ms per chunk, of 5 streams: 3.07, 2.88, 2.91, 2.89, 2.92`.
- **READ:** "the streaming budget (decision 20) > a 2,000-line stream in 50 chunks through one session: 5 ms or less per chunk, p95, the best of 5 to 15 streams after a warm-up" passed, in 565 ms.
- **READ:** five streams were enough; no extra stream ran. Every stream was under 5 ms; the worst was 3.07.
- **READ, the specimens:** "timings, CPU: first pass 0.63 s, warm 12.0 ms; wall: 0.65 s, 11.9 ms". The test passed (760 ms).
- **READ, `checks`:** `bun test ./tests/unit`: 1977 pass, 0 fail, across 69 files. `svelte-check`: 0 errors, 0 warnings. Prettier: clean. `lint-literals`: 0 literals, 1 allowance. Smoke: 151 pass, 0 fail.
- **Passed at 5 ms.** The figure, 2.88, is also under the old 4 ms. Run 7's was 2.90.

## 6. `032c` (question 6)

- **READ:** no reader, browser or perf log holds "forbidOnly" or "focused with". No run stopped on a committed `.only`.
- **READ, `checks`:** the four `032c` tests pass: both configs forbid `.only` in CI, and no file under `tests/` focuses a test.
- **READ:** `playwright.config.ts:21` and `playwright.sr.config.ts:38` read `forbidOnly: CI`.
- **Invisible, as it should be.**

## 7. `020d` and app-shell A3 (question 7)

- **READ, `build`:** `build:tokens: no changes`. The prerender wrote the site. "markdown: 110 twins in 395 ms". It also prints 110 "404 GET /…/index.md" lines. **INFERRED:** they are the prerender asking for the twins before `markdown.ts` writes them, one per page.
- **READ, `checks`:** every `020d` test passes: the guard (test 11), the helper (test 8), the fold (test 15), "no token says 0.12.0" in all three folders (test 7), and the guide (test 10, five cases). "released snapshots > every static/v<x>/ is a tag's, or the current version's" passes. `changelog-page.test.ts` passes.
- **READ, the tags:** `checks` fetches the remote's tags. They are `v0.1.0` to `v0.11.0`. There is no `v0.12.0`.
- **READ, a branch:** the same fetch lists `release/0.12.0` as a remote branch. `020d` decision 13 speaks of tags only.
- **READ, smoke:** 151 pass. Among them `017` criterion 12, "the install guide is true", in kit 2 and kit 3.
- **READ, browsers:** the eight Chromium shards end "N passed", with no failure and no flaky line: 488, 488, 487, 487, 487, 487, 476 (11 skipped) and 372 (115 skipped). `failOnFlakyTests` is on in CI (`playwright.config.ts:24`).
- **INFERRED:** the changelog, guide and site tests (`upgrade.spec.ts`, `site.spec.ts`) passed in all three engines. The dot reporter names no passing test, and the Firefox and WebKit logs were not read. But every browser shard succeeded, and a flaky test fails one.
- **App-shell A3, INFERRED: it passed.** It runs in every browser shard, and all 24 succeeded. `db8fb65` has letters in its hash, so the footer reads a commit, as `019b`'s landing notes predicted. `024i` is still needed for the next all-digit hash.
- **READ, `019b` criterion 4, printed in two Chromium shards:** links 128, 198 and 200 px, each equal to its `Range`; the box 322 px at 1440 and 280 px at 390. These are `019b`'s recorded figures.
- **READ, perf:** `/changelog/` reads CLS 0.082 and LCP about 1.0 s, at 333.1 kB. Run 7 read 0.083.

## 8. Everything else in run 7's closing table (question 8)

### 8.1 The counts

| Pair | Failed | Flaky | Not run | Run 7 |
|---|---|---|---|---|
| N-chr | 6 | 0 | 0 | 1, 0, 0 |
| N-ff | 6 | 1 | 0 | 6, 0, 0 |
| VO chr | 16 | 2 | 0 | 15, 2, 0 |
| VO wk | 9 | 4 | 0 | 8, 3, 0 |
| All | 37 | 7 | 0 | 30, 5, 0 |

- **READ:** every shard ran every test. Failed plus flaky plus passed equals each shard's count.

### 8.2 Every failed or flaky test

Kinds: **I** item; **T** test; **H** harness or runner; **U** unknown.

| Test | N-chr | N-ff | VO chr | VO wk | Rule, as printed | Kind | Against run 7 |
|---|---|---|---|---|---|---|---|
| the five error-summary tests | fail, 3/3 each | fail, 3/3 each | fail, 3/3 each | pass | §2 | I | N-chr new |
| pagination P2 | pass | pass | fail, 3/3 | flaky, 1/2 | F1 "Page 12" | U | the same |
| pagination P3 | fail, 3/3 | pass | fail, 3/3 | fail, 3/3 | F1 "Previous page"; N-chr "Previouspage, button" | U | VO back to failing |
| app-shell: the skip link | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Projects" | U | the same |
| marketing-bar: the skip link | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Marketing bar" | U | the same |
| composer: Stop moves focus | pass | pass | fail, 3/3 | fail, 3/3 | F1 "Message" | U | the same |
| search-field S2 | pass | pass | fail, 3/3 | pass | L1 "3 results" | U | the same |
| search-field S3, Clear | pass | pass | pass | fail, 3/3 | F1 "Search projects" | U | the same |
| page-states: the loading status | pass | pass | fail, 3/3 | fail, 3/3 | L1 "Loading projects" | U | the same |
| spinner: the label changes | pass | pass | fail, 3/3 | flaky, "VoiceOver not running" | L1 "Loading runs" | U; H | the same |
| toast S4, repeat | pass | pass | fail, 3/3 | pass | L4 | U | the same |
| toast S8, after the title | pass | **flaky, 1/2** | fail, 3/3 | fail, 3/3 | B1 "Route"; VO chr follow-on X0 | U | N-ff new |
| toast S10, both channels | pass | pass | fail, 3/3 | fail, 3/3 | L1, one of the two toasts | U | the same |
| tooltip T1 | pass | fail, 3/3 | pass | pass | T1, "Deploy, button" | U | the same |
| chart: from before the figure | pass | pass | pass | fail, 1/1 | C1 "Show as table"; follow-on X0 for C2 | U | was a timeout |
| chat: Response complete | pass | pass | **flaky, 1/2** | **flaky, 2/3** | L1; then "VoiceOver not running" | U; H | new |
| dropdown: Escape in the sub-menu | pass | pass | **flaky, 1/2** | pass | X0, `022x`'s sub-menu wait | U | new |
| product-home: the sheet's Escape at 360 | pass | pass | pass | **flaky, 1/2** | none: "Unable to send keys" | H | new |

### 8.3 Run 7's rows, one by one

- **search-field S2 under VO chr, READ: still failing, 3/3.** First windows: "des. 3 results. …", "s. des. 3 results. …", "es. 3 results. …". Second window, every attempt: "i. desi". Item text `""`, as before. S1 now passes first time; run 7 had it flaky.
- **"VoiceOver not running", READ: twice, both VO wk, both in `navigateVoiceOverToWebContent.js:23`.** Chat's retry #1 ran 5.0 minutes. Spinner's attempt 1 ran 5.1 minutes (VO wk 4). Both passed on a later attempt. It has now hit runs 5, 6, 7 and 8.
- **"VoiceOver cannot be started", READ:** in no log. Tag T3 passes in all four pairs.
- **New harness error, READ:** VO wk 3, product-home's attempt 1, 11.7 s: "Error: Unable to send keys: to application: VoiceOver", caused by "System Events got an error: Connection is invalid. (-609)". The retry passed.
- **The WebKit chart walk, READ: it ran, for the first time since the corners were turned off.** It failed C1 after 3.6 minutes, with no timeout. Its 25 steps: the figure's name, "Visitors per weekday, last week", the y ticks 0 to 600, the days Mon to Sun, then "image" nine times. "Show as table" was never reached.
  - **READ:** no phrase holds "Quick Note". All ten VoiceOver logs show the bottom-right corner moved from 14 to 1, and the other three set to 1.
  - **INFERRED:** the hot-corner fix (`022y`) now shows on the walk too. The walk stays in the page. It stops on the plot's images, as runs 5 and 6 saw, and the step budget runs out there. Whether the nine are the seven bars and two other marks, or one mark read again, is not shown: each item text is "image".
- **code-block, READ:** "copy: the outcome is spoken whole, and not twice in a row" passes first time in all four pairs (N-chr 0.2, N-ff 0.3, VO chr 0.5, VO wk 0.6 minutes).
- **chat, READ: flaky in both VoiceOver pairs.** VO chr attempt 1: L1 "Response complete", the window holding the reply but not the status. VO wk: attempt 1 L1; retry #1 "VoiceOver not running" at the 5-minute timeout; retry #2 passed. Run 7 passed it in both. "Latest reply moves focus" passes everywhere.
- **toast S6, READ:** passes in all four pairs, first attempt. Run 7 had it flaky under VO wk.
- **perf's CLS, READ:** the same three tests fail both attempts, on CLS only; 23 pass. `/start/` 0.048 (≤ 0.02), `/components/native-select/` 0.088 (≤ 0.022), `/changelog/` 0.082 (≤ 0.02). Run 7: 0.048, 0.088, 0.083.
- **The title read twice, VO chr:** §2.5.
- **VO wk's summary tests:** pass, phrases unseen (§2.4).
- **The second submit's lost L1, VO chr:** held in all three attempts (§3).
- **The focused element's name missing** (app-shell and marketing-bar skip links, composer Stop, P2, P3, S3): the same phrases as run 7. The item text still names the target ("Projects heading level 1", "Previous page button").
- **A live announcement missing** (spinner, S4, page-states, S8, S10): the same rules as run 7.
- **P3 under N-chr:** still "Page 12 of 12. Previouspage, button". P3 under VO chr and VO wk fails again, 3/3. *Run 7's memo* called its pass there chance; this run agrees.
- **tooltip T1 under N-ff:** still "Deploy, button".
- **The streaming budget:** landed and passing (§5).
- **bar-glass's annotation:** not seen; the WebKit browser logs were not read this run.
- **`.only` and unbounded waits:** landed (§4, §6).

## 9. Shard times (question 9)

"Test" is Playwright's figure. "Job" and "Waited" come from the job list (start minus creation). All in minutes. The deadline is 40.

| Shard | Tests | Failed | Flaky | Not run | Test | Run 7 | Job | Waited |
|---|---|---|---|---|---|---|---|---|
| N-chr 1 | 32 | 2 | 0 | 0 | 15.4 | 14.6 | 16.9 | 0.0 |
| N-chr 2 | 26 | 2 | 0 | 0 | 11.9 | 11.0 | 13.2 | 0.0 |
| N-chr 3 | 29 | 2 | 0 | 0 | 12.9 | 11.4 | 14.2 | 0.0 |
| N-ff 1 | 32 | 2 | 0 | 0 | 16.0 | 16.5 | 17.0 | 0.0 |
| N-ff 2 | 26 | 1 | 0 | 0 | 11.0 | 12.5 | 12.1 | 0.0 |
| N-ff 3 | 29 | 3 | 1 | 0 | 14.9 | 14.1 | 16.1 | 0.0 |
| VO chr 1 | 19 | 2 | 1 | 0 | 23.9 | 25.7 | 24.9 | 0.0 |
| VO chr 2 | 17 | 4 | 1 | 0 | 23.6 | 25.7 | 24.7 | 0.0 |
| VO chr 3 | 19 | 4 | 0 | 0 | 24.9 | 26.2 | 26.0 | 0.0 |
| VO chr 4 | 16 | 3 | 0 | 0 | 21.9 | 19.2 | 23.3 | 25.0 |
| VO chr 5 | 16 | 3 | 0 | 0 | 17.3 | 16.4 | 18.6 | 26.1 |
| VO wk 1 | 19 | 3 | 1 | 0 | **34.7** | 29.5 | 36.0 | 0.1 |
| VO wk 2 | 17 | 2 | 0 | 0 | 19.3 | 18.4 | 20.4 | 23.0 |
| VO wk 3 | 19 | 2 | 2 | 0 | 23.7 | 22.1 | 24.9 | 36.0 |
| VO wk 4 | 16 | 0 | 1 | 0 | 21.7 | 21.5 | 22.9 | 0.1 |
| VO wk 5 | 16 | 2 | 0 | 0 | 15.0 | 15.3 | 16.4 | 24.8 |

- **READ: all 16 reader shards ended inside the 40-minute deadline.** No "Timed out waiting". `022q` criterion 6's second clause holds again.
- **READ, the longest:** VO wk 1, 34.7, 5.3 minutes from the deadline. Chat took 6.8 minutes of it over three attempts (1.0, 5.0, 0.8), the 5.0 being "VoiceOver not running". The chart took 3.6, against run 7's 7.1-minute timeout.
- **INFERRED:** without chat's stalled attempt, VO wk 1 would have been about 30 minutes, near run 7's.
- **READ, the waves:** five VoiceOver jobs started at 11:57:44–46 (VO chr 1, 2, 3; VO wk 1, 4). Each of the other five started 1 to 3 s after one of them ended: VO wk 2 at 12:20:40, VO wk 5 at 12:22:28, VO chr 4 at 12:22:44, VO chr 5 at 12:23:47, VO wk 3 at 12:33:45. **INFERRED:** five macOS slots, as in runs 6 and 7.
- **INFERRED, the critical path:** VO wk 1 then VO wk 3, 36.0 + 24.9 minutes, ending 12:58:42. In run 7 it was VO chr 2 then VO chr 3.
- **READ, against `022` criterion 22's 20-minute bar:** all six NVDA shards are under it (11.0 to 16.0). Three VoiceOver shards are: VO chr 5, VO wk 2, VO wk 5. Run 7 had four.
- **Per pair, the sum of Playwright's figures (READ):** N-chr 40.2 (run 7: 37.0); N-ff 41.9 (43.1); VO chr 111.6 (113.2); VO wk 114.4 (106.8).
- **INFERRED, N-chr's rise:** the five summary tests passed once each in run 7. Now each runs three attempts of about 0.3 to 0.4 minutes.

## 10. What is left (question 10)

Marks:
- **built:** a small change built and reviewed, not landed. `017a` (the tokens page's "Copied"), `019d` (a long message wraps at 320 px), `024i` (an all-digit hash), `022ad` ("VoiceOver not running" fails fast, with a restart and kept evidence; the chart's timeout raised to 8 minutes).
- **queued:** `022ac` (the search count under VO chr, research), `019c` (the title under VO chr), `032d` (browser waits and helpers).

| What | Where | Kind | Next | Addressed by |
|---|---|---|---|---|
| NVDA skips the title and reads each message twice in the alert | N-chr and N-ff: the five summary tests (10 tests) | item | A research memo first: read NVDA's alert text code (`Dialog.getDialogText`), and probe a `role="alert"` holding a heading, a `p` and links, under NVDA in CI. The markup is not changed by guess. The owner answers §11 first | — |
| VO chr reads each message twice, with no list | VO chr: the five summary tests | item | The same memo. Criterion 11 records that *the memo*'s §2 inference was wrong | — |
| `019b`'s bullet and page sentence say NVDA reads once | `CHANGELOG.md`, the item's page | item | Amend both with this run's finding (decisions 6 and 7), once §11 is answered. Run id and each pair's result go in `019b`'s landing notes | — |
| `022t` criterion 14 not met | N-chr, N-ff, VO chr | item | Record in `022t`'s landing notes: the re-announcement works in all four pairs; the summary's content fails. Judge again after the rows above | — |
| The title read twice in one phrase | VO chr: second submit 1/15 attempts | item | `019c`'s research. The group's count now reads "3 more items" | **queued** `019c` |
| VO wk's summary tests pass, phrases unseen | VO wk | unknown | The owner downloads `sr-voiceover-webkit-2`, `-3` and `-4` | — |
| Patches 4 and 7b unprovable | N-chr, N-ff, VO chr | test | Record in `019b`'s decision 9 notes. Only VO wk can prove them now | — |
| search-field S2 | VO chr | unknown | `022ac`'s research. S1 passed this run | **queued** `022ac` |
| "VoiceOver not running" in guidepup's web-content helper | VO wk: chat 5.0 min, spinner 5.1 min | harness | Land `022ad` | **built** `022ad` |
| The chart's WebKit walk ends in nine "image" steps | VO wk | unknown | Research: what the nine images are in WebKit's tree, and whether 25 steps can reach "Show as table". No change by guess | no: `022ad`'s 8-minute timeout was not needed (3.6 min) |
| "Unable to send keys … Connection is invalid (-609)" | VO wk: product-home, once, retried | harness | Watch. If it recurs, take it into `022ad`'s restart path | — |
| The sub-menu did not open within 10 s | VO chr: dropdown, once, retried | unknown | Watch. The bound named the cause, as designed | — |
| chat's "Response complete" | VO chr and VO wk, flaky | unknown | Watch. VO wk's 5-minute attempt is the "VoiceOver not running" row | partly: **built** `022ad` |
| A focused element's name not in the log | app-shell and marketing-bar skip links, composer Stop, P2, P3 (VO chr, VO wk); S3 (VO wk) | unknown | The owner downloads one VoiceOver `recordings/` artifact and listens (*run 7's memo* §5) | — |
| A live announcement missing | spinner, S4 (VO chr); page-states, S8, S10 (VO chr, VO wk) | unknown | The same recording. page-states also needs `022q`'s deferred client-side navigation | — |
| toast S8 under N-ff, flaky | N-ff | unknown | Watch. New this run | — |
| P3 under N-chr: "Previouspage, button" | N-chr | unknown | A small change in lane I, once a check that fails first is found | — |
| tooltip T1 | N-ff | unknown | Record whether the tooltip is open after the focus | — |
| perf: CLS on `/start/`, `native-select`, `/changelog/` | `perf` | budget | `024g` (lane T) and `024h` (lane S) | — |
| An all-digit hash reads as "no commit" | none this run: A3 passed on `db8fb65` | build | Land `024i` | **built** `024i` |
| A long message overflows at 320 px | none this run | item | Land `019d`. It styles `019b`'s links box, so §11's answer decides its base | **built** `019d` |
| The tokens page's "Copied" said twice | none this run: no speech test covers it | item | Land `017a` | **built** `017a` |
| Fixed waits and copied helpers in the browser tests | none this run: all 24 browser shards passed | test | Write `032d`'s specification | **queued** `032d` |
| A `release/0.12.0` branch on the remote | `origin` | record | The owner decides whether to delete it. `020d` decision 13 covers tags only | — |
| bar-glass's annotation not visible | WebKit browser shards | test | The owner reads the merged report's annotations, or a change prints them in CI's log | — |

**Fixed in this run (READ):** `020d` whole (build, unit, smoke, browsers); app-shell A3 on a hash with letters; the streaming budget at 5 ms (`022ab`), printing 2.88; `.only` guarded (`032c`); no wait unbounded (`022aa`); the WebKit chart walk ran with no Quick Note (`022y`, now on the walk); VO chr's second-submit L1. Passed where run 7 had them flaky, with no change that touched them: search-field S1 (VO chr), toast S6 (VO wk), tag T3 (VO chr).

**New in this run (READ):** N-chr fails the five summary tests; NVDA drops the title in both browsers; chat flaky in both VoiceOver pairs; the dropdown's sub-menu X0 once (VO chr); toast S8 flaky under N-ff; "Unable to send keys" once (VO wk); the chart's C1 fault on the image steps.

## 11. A question for the owner: does `019b` stay landed?

Open question 3 (a) kept `019b` landed if a VoiceOver pair still doubled a message, because NVDA with Firefox would read once. This run shows NVDA reading each message twice and dropping the title, in both browsers. The question is new. The owner's delegation lets the design lead choose among these options.

- **(a) Revert `019b`'s markup to the list now (recommended).** A small change back to a state with evidence. Run 7 shows it: N-chr passes all five tests, and NVDA speaks the title in both browsers. N-ff returns to its list double. VO chr is the same either way (§2.3). VO wk passed on both. Then the research memo (§10) finds markup that NVDA and VO chr each read once. `019d` is rebuilt on the list, or waits.
- **(b) Keep `019b` landed, and research first.** NVDA users keep losing the title in the announcement until the research lands. The criterion stays failing in three pairs.
- **(c) A third markup now,** such as a `p` around each link (`019b` open question 1 (c)). A guess, against criterion 11's rule that the markup is not changed again by guess.

## 12. What this memo did not see

- Every artifact: `phrases.json`, `faults.json`, the merged report, the recordings. So no phrase of a passing test, no annotation, no VO wk error-summary phrase.
- The Firefox and WebKit browser shards' logs. The job list says each succeeded.
- NVDA's source. §2.2's mechanism is from memory and must be read before it is relied on.
- Any speech. No reader runs here.
