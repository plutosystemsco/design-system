# The first speech verdicts: every screen-reader failure of run 4

- **Status:** complete
- **Date:** 2026-11-16
- **Author:** a researcher
- **Question:** Run 4 is the first `matrix` run in which every screen-reader shard reached its tests. Which of its screen-reader failures are faults in Kuiper's items, which are faults in the tests, the rules or the reader driver, and which cannot yet be told?
- **Stands on:** [the first matrix run](2026-11-16-the-first-matrix-run.md) (group 4) and [the third matrix run](2026-11-16-the-third-matrix-run.md) (§3); `022`'s decisions 10 to 16.
- **What it blocks:** the small changes that empty the screen-reader failures; the mutation run (`022` criterion 15), whose patch 6 witness is an O2 test; and the release check, which needs a green push run (`022` decision 19, criteria 12 to 14).

## How to read this memo

Every claim carries a label.

- **READ:** a job log of run [43938398575](https://github.com/plutosystemsco/design-system/actions/runs/43938398575) (`matrix`, push of `c5cdd65`), read 2026-11-16 through the GitHub connector; or a file of this repository at `c5cdd65`, including guidepup's source in `node_modules` (`@guidepup/guidepup` 0.40.0, `@guidepup/playwright` 0.21.0). The report artifacts could not be downloaded: this machine's network refuses the artifact host. The `list` reporter prints each failure's error and its phrases, so the logs are the source.
- **EXECUTED:** run in this session's Linux container against a fresh `bun run build`. Two kinds of run. The suite's dry mode (`SR_DRY=1`, the pinned Playwright 1.64.1, Chromium and WebKit) runs every page, locator and action and judges only focus and DOM facts. Small probe scripts (Playwright 1.63.0's Chromium) traced DOM writes, focus and clicks. Neither hears speech.
- **INFERRED:** our reasoning.

Terms. A _pair_ is one reader with one browser: VoiceOver with WebKit (VO wk), VoiceOver with Chromium (VO chr), NVDA with Chromium (NVDA chr), NVDA with Firefox (NVDA ff). A _window_ is one named capture of phrases (`tests/sr/fixtures.ts`, `Sr.listen`). A _walk_ is a run of the reader's `next()` steps (`Sr.steps`). A _kind_ is where the fix goes: **item** (Kuiper's item does not do what its pattern or its own specification says), **rule or harness** (a test, a rule in `tests/sr/rules.ts`, the reader driver or the runner's timing), or **unknown**.

## 1. The run

| Shard | Tests | Failed | Flaky | Passed | Not run | Time |
| --- | --- | --- | --- | --- | --- | --- |
| NVDA chr 1 | 32 | 7 | 0 | 25 | 0 | 22.7 min |
| NVDA chr 2 | 26 | 7 | 0 | 19 | 0 | 18.1 min |
| NVDA chr 3 | 29 | 7 | 0 | 22 | 0 | 17.6 min |
| NVDA ff 1 | 32 | 7 | 0 | 25 | 0 | 24.7 min |
| NVDA ff 2 | 26 | 7 | 0 | 19 | 0 | 19.8 min |
| NVDA ff 3 | 29 | 8 | 0 | 21 | 0 | 18.6 min |
| VO chr 1 | 32 | 6 | 1 | 11 | 14 | 40.0 min, deadline |
| VO chr 2 | 26 | 6 | 0 | 20 | 0 | 38.9 min |
| VO chr 3 | 29 | 8 | 3 | 18 | 0 | 37.7 min |
| VO wk 1 | 32 | 6 | 0 | 12 | 14 | 40.0 min, deadline |
| VO wk 2 | 26 | 8 | 0 | 17 | 1 | 40.0 min, deadline |
| VO wk 3 | 29 | 5 | 2 | 21 | 1 | 40.0 min, deadline |

- **READ:** every figure above is from each shard's closing summary. Each shard ran one worker with `--global-timeout=2400000`, the 40-minute deadline. `retries` is 2 in CI (`playwright.sr.config.ts`).
- **READ:** 82 test runs failed across the twelve shards: 21 under NVDA chr, 22 under NVDA ff, 20 under VO chr, 19 under VO wk. Six more were flaky. No screen-reader line is in `tests/fault-ledger.ts`.
- **READ:** `voiceover (webkit, 3)` was created at 19:21:36 and started at 20:00:28. It finished at 20:41:27. The other five VoiceOver jobs started at 19:21:39. INFERRED: the account runs at most five macOS jobs at once, so a sixth waits.
- **READ:** no failure printed a spoken sentinel. In all 28 failed O2 runs, the page behind was never reached (§2).

## 2. Family A: "the page behind … is never reached in ten steps"

Eight tests, 28 failed runs. One rule causes them all: O2's preconditions. Containment itself held in every run.

| Test | VO wk | VO chr | NVDA chr | NVDA ff | Precondition that failed |
| --- | --- | --- | --- | --- | --- |
| alert-dialog | fail | fail | fail | fail | VO: no inside text; NVDA: 1 distinct phrase |
| app-shell at 360 | fail | fail | fail | fail | VO: name; NVDA: 1 distinct phrase, on another page (§3) |
| dialog | fail | fail | fail | fail | VO: name; NVDA: 1 distinct phrase |
| marketing-bar | not run | not run | fail | fail | name |
| product-home at 360 | fail | fail | fail | fail | name |
| settings' delete confirm | fail | fail | fail | fail | VO: no inside text; NVDA: 1 distinct phrase |
| sheet | pass | pass | fail | fail | NVDA: name |
| sidebar at 360 | fail | fail | fail | fail | name |

**What the test and rule expect.** READ (`rules.ts:169–196`, `fixtures.ts:123–169`): the test opens the modal from its focused trigger, then takes ten `next()` steps. O2 faults only if the sentinel is spoken. First it returns X0 unless three things hold in the steps: at least three distinct phrases; the overlay's name spoken; and, where the DOM gives texts found only inside the overlay, one of them spoken.

**What the readers did.**

- **READ, VoiceOver:** each walk moves forward from the element that took focus on opening. It reaches the modal's last element in one to five steps and stays there. The dialog walk reads "Cancel button", "Save button", "Close button", then "Close button" seven more times. The alert-dialog walk reads "Delete project button", then "end of Delete pluto-sandbox? … alert dialog", then silence.
- **READ, NVDA:** the same shape. The sheet walk reads "link, Components", "link, Blocks", "link, Changelog", "out of list, button, Close", then "button, Close" six more times. The alert-dialog walk reads "button, Delete project" ten times.
- **READ:** no VoiceOver or NVDA walk spoke a sentinel. Both readers kept the virtual cursor inside every modal, in all four pairs.

**Why each precondition failed.** All four reasons are in the test, not in the items.

1. **The name is behind the walk.** INFERRED: focus lands past the title, on the first tabbable element. A forward walk never meets the title again. The name was spoken in the `open` window, which O2 does not read. This hits dialog, sheet, sidebar, marketing-bar, product-home and app-shell.
2. **The only inside text is where the walk began.** READ: `steps: inside` was `["Cancel"]` for alert-dialog and `["Keep my account"]` for the delete confirm. The action buttons, "Delete project" and "Delete account", carry the trigger's name, so `Sr.steps` drops them as texts the page also shows (`fixtures.ts:150–155`). The walk leaves Cancel on its first step, so no step speaks it.
3. **A contained reader repeats itself.** READ: at the modal's end NVDA repeats the last element, so the walk has one distinct phrase. That is containment, not silence, but O2 asks for three.
4. **NVDA was in focus mode.** READ: in the dialog, focus starts in the Name field, and NVDA's ten steps each read "Dart throws", the field's value. INFERRED: NVDA switched to focus mode in the text field. Its `next()` is Down Arrow (READ, `keyCodeCommands.js:967`), which a single-line field ignores.

**Why sheet passed under VoiceOver.** INFERRED: passing tests print no phrases, so this is not seen. VoiceOver says "end of Sheet pages navigation" as it leaves the sheet's nav. Normalised, that holds "navigation", which is the sheet's title, "Navigation". So the name precondition held by accident.

**Do the items make the page behind inert?** No, and their specification says they need not.

- **EXECUTED:** with each of dialog, alert-dialog and sheet open, every child of `<body>` has `inert` false and no `aria-hidden`. The open element has `aria-modal="true"`.
- **READ:** `005` line 192 says bits-ui sets no `inert`, and "We rely on `aria-modal`". The three content components say the same in their comments (`dialog-content.svelte:36`, `sheet-content.svelte:47`).
- **INFERRED:** run 4 is the first evidence that both readers honour `aria-modal` here. Nothing in it calls for `inert`.

**Kind: rule or harness, all eight.** The fix: O2 reads its precondition from the `open` window and the steps together; it counts a walk that stalls at the overlay's last element as contained; it finds inside texts by DOM containment, not by text; and the test leaves NVDA's focus mode before walking.

**What it blocks besides.** INFERRED: patch 6 makes the sheet non-modal (`022` decision 15). Its witness is `sheet.sr.ts`'s O2 test. Today that test fails on X0 under NVDA even without the patch. The mutation report rejects an expected test that fails only on a set-up error. So patch 6 cannot be proven until this family is fixed.

## 3. Family B: NVDA's web-content helper changes the page

`Sr.open` calls guidepup's `navigateToWebContent()` after the page is ready (`fixtures.ts:73`). Under NVDA it does more than move the reader.

- **READ** (`@guidepup/playwright/lib/navigateNVDAtoWebContent.js`): it presses Escape; it clicks the centre of `<body>`; it presses Tab (`readNextFocusableItem`); it toggles NVDA's mode twice with NVDA+Space; it presses Escape again (`exitFocusMode`); then Ctrl+Home. These are real keys, sent to the operating system. The VoiceOver helper clicks nothing.

**app-shell at 360: "opening speaks its name" and the O2 walk.** NVDA chr and NVDA ff.

- **READ:** the focus window says "Site, navigation landmark, Menu, button". The sheet opened is "Kuiper Design System". The O2 test's inside texts are the docs site's page list ("Kuiper theme", "Geist", …). O1 expects "Sandbox".
- **EXECUTED:** on `/view/app-shell/` at 360 × 700 in Chromium, a click at the body's centre lands on the app-shell page's "Go to the home page" link. The URL becomes `/`. At 1440 the same click lands on `main` and the URL stays.
- **INFERRED:** the helper's click took both NVDA pairs to the docs home page. Its bar has its own "Menu" (`src/lib/site/chrome/bar.svelte:86`), which the test's unexact locator then matched. The skip-link test, at 1440, passed under NVDA.
- **Kind: rule or harness.** The fix: `Sr.open` checks the URL after the helper and loads the page again if it moved, or covers the page during the helper's click.

**tooltip: Escape (T2), NVDA chr and NVDA ff; focusing the trigger (T1), NVDA ff.**

- **READ:** T2 fails on X0, "the tooltip never opened". Its `focus` and `escape` windows are both empty. T1 under NVDA ff hears "Deploy, button" and not the tooltip's text.
- **READ:** the page is the "Open" example, whose tooltip is held open at load (`src/lib/site/examples/tooltip/states.svelte`).
- **EXECUTED:** in Chromium, Tab from the loaded page focuses "Deploy". Escape then closes the tooltip: 0 contents. A blur and a new `focus()` reopen it. The dry run, which has no helper, passes T2 in Chromium and WebKit.
- **INFERRED, T2:** the helper's Tab put focus on Deploy, and its Escape closed the tooltip. The test's `focus()` on a focused trigger then fires nothing, so the tooltip stays closed and the reader says nothing.
- **T2's kind: rule or harness.** The fix: the test blurs first and opens the tooltip by its own focus, as T1 does.
- **T1 under NVDA ff: unknown.** T1 blurs first, and passes under NVDA chr. Why Firefox spoke only the name is not seen: the tooltip may not have reopened, or NVDA may not have read its description.

## 4. Family C: NVDA's wording against the rules' normalisation

`022` decision 12's normalisation drops quotes and one final mark. It keeps commas and symbols. NVDA's speech differs in three ways.

- **READ, commas between speech chunks:** in Firefox NVDA says "Previous, page, button" and "Page, 12, button, current page". "Previous page" is then not a substring.
- **READ, symbols read as words:** NVDA says "We sent a new code to ada at example dot com." The rule wants "ada@example.com".
- **READ, letters split from digits:** NVDA says "Press F 8, or go to Notifications". The rule wants "F8".

Tests: sign-up "a resend's status is spoken" (NVDA chr, NVDA ff; the only cause); pagination P3 (NVDA ff); P2 (NVDA ff, with §5); toast S3 (NVDA pairs, with §5).

**Kind: rule or harness.** The fix: the normalisation drops every comma, and a test states a reader's spoken form of an address or key where it differs.

## 5. Family D: tests that expect the wrong thing

**toast S3, all four pairs.**

- **READ:** every pair spoke the toast whole: `Message deleted. "Launch window moved" is in Trash. Press F8, or go to Notifications, to reach Undo.` The test wants "Message deleted. Press F8, or go to Notifications, to reach Undo" as one substring.
- **READ:** `026` decision 10 says the words are the title, then the description, then the hint. The example has a description (`src/lib/site/examples/toast/action.svelte:23`). The test's text, from `026`'s table, leaves the description out.
- **Kind: rule or harness.** The fix: expect the example's description too, or judge the title and the hint as two texts.

**toast S6, all four pairs.**

- **READ:** the test raises two toasts, waits out its 6 s window, then presses F8, Tab and Escape in one window, and a second Escape in the judged one. In VO wk the first window already says "Raise two button"; the judged window holds only VoiceOver's hints. NVDA logged nothing in either.
- **EXECUTED:** in Chromium, after the 6 s raise window, F8, Tab and Escape put focus on "Raise two" 10 ms after the Escape.
- **INFERRED:** the success toast times out within the raise window, so only the action toast is left. The first Escape closes it, and focus returns then. The second Escape moves nothing, so the judged window has nothing to say. `026` test 51 describes the item's behaviour, and the item does it.
- **Kind: rule or harness.** The fix: judge the window in which focus returns, or press F8 before the success toast times out.

**pagination P2, NVDA ff.**

- **READ:** NVDA ff spoke "Page 12 of 12. list, with 6 items, Page, 12, button, current page" as one phrase. The test drops every phrase holding "of 12" before F1 reads (`pagination.sr.ts:59–62`). That drops the focus announcement too, and F1 returns X0.
- **Kind: rule or harness.** The fix: remove the status text from a phrase, not the phrase.

**chart C1 and C2, all four pairs.**

- **READ:** each walk speaks the figure's name, then the axis labels "0", "100" … "600", "Mon" … "Sat" (or "Sun"). Fifteen steps end before "Show as table". C2 returns X0 because C1 failed. No tooltip text was spoken.
- **READ:** `004` line 272 says a layerchart figure "exposes its tick labels and nothing else". The item's comment says the same (`chart-container.svelte:46–52`). Seven ticks on each axis take 14 steps.
- **Kind: rule or harness.** The fix: C1's walk takes enough steps for the name, the ticks, the caption and a header, about 25. Hiding the ticks would be an item change that `004` did not choose.

## 6. Family E: VoiceOver's capture

guidepup reads VoiceOver by polling its "last phrase" (READ, `@guidepup/guidepup/lib/macOS/VoiceOver/VoiceOverClient.js:176–238`). Each capture first skips a phrase equal to the previous one, for 12 polls of 50 ms. After that, the same phrase still showing is logged as new. After a new phrase, it sleeps for the phrase's reading time before it polls again. `Sr.listen` makes two captures per window, one for the action and one for the rest of the 6 s (`fixtures.ts:83–99`).

**Phrases logged twice.**

- **READ:** VoiceOver's windows often hold one phrase twice: "Page 6 of 12", "Page 6 of 12" (P1, VO wk and VO chr, every attempt); "Success: Project saved.", twice (toast S1, VO wk every attempt; VO chr once, then passed); the summary twice (sign-in's empty submit, VO chr once, then passed). L3 faults each.
- **EXECUTED:** P1's status is written once, "Page 6 of 12" at 9 ms. NVDA heard it once in both browsers (READ).
- **INFERRED:** the second capture logs VoiceOver's stale last phrase once the 0.6 s skip ends. NVDA's second capture logs "" instead, which is why every NVDA window ends in "".
- **Kind: rule or harness,** for P1 and toast S1. The fix: one capture per window, or drop a repeat of the window's last phrase that VoiceOver did not speak again.

**A focused element's name missing.** VO's windows hold the live text, or "main", then VoiceOver's hint ("You are currently on a button…"), and not the name.

- **READ:** composer's Stop (VO wk, VO chr): "Stopped", then the text-area hint; F1 wants "Message". app-shell's skip link (VO wk, VO chr): "main. You are currently on a heading level 1."; F1 wants "Projects". P2 (VO wk, VO chr): "Page 12 of 12", then a hint. P3 (VO wk): "Page 12 of 12. You are currently on a button." search-field S3 (VO wk): two hints.
- **EXECUTED:** the dry run passes each of these tests' focus facts in Chromium and WebKit. Focus lands on the textarea, `main#main`, "Page 12", "Previous page" and the search input.
- **READ:** `026`'s research cites WebKit bug 222190: VoiceOver drops live-region speech that coincides with a focus change.
- **INFERRED:** two causes fit, and the logs cannot tell them apart. guidepup's poll may miss a phrase that VoiceOver replaced during its sleep. Or VoiceOver spoke the live text and dropped the focus announcement, which a person would also miss.
- **Kind: unknown.** The next step: attach `itemTextLog()` beside each window. It says where VoiceOver's cursor is, whatever was spoken.

**A live announcement missing.**

- **READ:** sign-in's valid submit (VO chr): no "Signing in"; the window holds the error summary. The block's stand-in server always refuses after 800 ms (`src/lib/registry/blocks/sign-in/+page.svelte:18–22`). VO wk passed.
- **READ:** spinner (VO chr): both windows say only "You are currently on a main". VO wk passed.
- **READ:** page-states' loading view (VO wk, VO chr): the window holds "Projects web content. … To enter the web area, press Control-Option-Shift-Down Arrow." The action is a full `page.goto`. NVDA passed in both browsers.
- **READ:** toast S4 (VO chr): the second "Success: Project saved" is not logged. VO wk and both NVDA pairs passed.
- **READ:** toast S10: VO chr logged the success, not the error; VO wk logged the error, not the success, then passed on retry. **EXECUTED:** the toaster writes both at 22 ms, clears both at 1,022 ms, and writes the success again at 1,025 ms.
- **READ:** toast S8: VO wk logged "Route" twice and no toast, then the toast and no "Route" on its retries. VO chr logged the toast and no "Route".
- **INFERRED:** in each, one of two near-simultaneous announcements is missing, or the reader was outside web content. That fits bug 222190 and the poll alike.
- **Kind: unknown,** each. The next step is the same `itemTextLog()`, and, for page-states, a client-side navigation in place of `page.goto`.

**Time lost.**

- **READ:** two VO wk attempts hit the 5-minute test timeout (sidebar's first-link focus, then passed; toast S6's first retry). "VoiceOver cannot be started" failed the first test of two VO chr shards, which passed on retry.
- **READ:** VO wk's chart walk ended in "Quick Note New Quick Note dialog": a macOS window, not the page. INFERRED: a stray system gesture on the runner.

## 7. Family F: faults in the items

**search-field S2, "one more letter with the same count is spoken again", all four pairs.**

- **READ:** after "des", then "i", no pair logged "3 results" again. VoiceOver logged the typed "i. desi"; NVDA logged nothing.
- **READ:** `search-field.svelte:81–95` empties the status and writes the count again one animation frame later, so "an unchanged count be heard". `status.svelte` warns that the same text set twice is not announced.
- **EXECUTED:** the status reads "3 results" at 784 ms, "" at 6,789 ms and "3 results" at 6,790 ms. The empty state lasts about 1 ms.
- **INFERRED:** 1 ms is too short for any reader to see a change. The toast clears its announcer 1 s after each message (`toast-queue.ts:116–117`), and NVDA hears its repeat (S4 passed in both NVDA pairs).
- **Kind: item,** `src/lib/registry/ui/search-field/search-field.svelte`. `027` decision 11 promises the repeat. The fix: clear the status a fixed time after the count is spoken, as the toast does, so the next count is a change.

**error-summary, "the second submit, unchanged", NVDA chr and NVDA ff. VoiceOver did not reach it.**

- **READ:** on the second submit NVDA said only "section". On the first it read the title and every message.
- **READ:** the summary's alert role is on its content (`error-summary.svelte:136–144`). An unchanged second submit inserts nothing, so the alert does not fire. The example moves focus to the root, which has no role and no name (`src/lib/site/examples/error-summary/keyboard.svelte`).
- **READ:** `019` decision 12's pass rule covers the second submit: the title and every message spoken again.
- **INFERRED:** VoiceOver reads a focused container's content; NVDA names it. Under NVDA the item keeps its promise only on the first submit.
- **Kind: item,** `src/lib/registry/ui/error-summary/error-summary.svelte`. The fix: the summary renders its alert content anew on each failed submit, so the alert fires again; this may need a prop, and so a specification rather than a small change.

**tag T3, "removing every tag speaks the list's name", NVDA chr and NVDA ff. Both VoiceOver pairs passed.**

- **READ:** NVDA said "blank". `027`'s table expects "Filters, list" from NVDA.
- **EXECUTED:** the dry run's fact holds: focus is on the list named "Filters".
- **INFERRED:** NVDA's browse-mode buffer renders nothing for an empty list, so its focus lands on a blank line. The item's chosen target cannot be spoken by NVDA.
- **Kind: item,** `src/lib/registry/ui/tag/tag-group.svelte`. The fix: give the emptied list content NVDA can render, or move focus to a target that has some.

## 8. Family G: not settled

- **search-field S4, NVDA chr and NVDA ff.** READ: both windows are empty. EXECUTED: the status is written once, "3 results" at 2,081 ms, and no older count is written. The results list re-renders at the same moment. INFERRED: NVDA may drop the update while it refreshes its buffer. Unknown.
- **toast S9, NVDA chr and NVDA ff.** READ: NVDA spoke the trigger as focus returned, "Delete project, button, expanded, opens dialog", and never the success. EXECUTED: the success is written at 1,242 ms, after `026`'s 1 s modal hold. Unknown: the hold may be too short for NVDA, or NVDA drops it for another reason.
- **pagination P2 under NVDA chr.** READ: NVDA said "list, with 6 items, 1, button, Page 1", as if on the first page. EXECUTED: the dry run's fact holds, focus on "Page 12". Unknown.
- **pagination P3 under NVDA chr.** READ: NVDA said "Previouspage, button". EXECUTED: Chromium's own accessibility tree names the button "Previous page". INFERRED: NVDA reads the button's text in Chromium, and the space that opens the hidden " page" span (`pagination.svelte:193–195`) is lost. A person would hear one word. Unknown; a space outside the hidden span would likely fix it.

## 9. VoiceOver's pace, and the shard count

| Pair | Tests reached | Minutes, all shards | Min per test | Min per test, first attempts only | Minutes of retries |
| --- | --- | --- | --- | --- | --- |
| NVDA chr | 87 | 58.4 | 0.67 | 0.42 | 21.0 |
| NVDA ff | 87 | 63.1 | 0.73 | 0.44 | 22.8 |
| VO chr | 73 | 116.6 | 1.60 | 0.87 | 49.3 |
| VO wk | 71 | 120.0 | 1.69 | 0.93 | 51.0 |

- **READ:** the figures are summed from each test's printed time. A passing test's median is 43 s under VoiceOver and 22 to 24 s under NVDA.
- **READ:** VoiceOver's walks cost 1.8 to 3.0 minutes an attempt; NVDA's cost about 0.65. Walks and their retries took 46 to 47 minutes of each VoiceOver browser's time. INFERRED: each VoiceOver `next()` is a capture that waits for a stable phrase, about 10 to 14 s a step.
- **READ, not reached by VoiceOver:** 14 tests in shard 1 of each browser (dialog's Escape; dropdown-menu's three; error-summary's three; live-console's two; marker; marketing-bar's four), sheet's Escape in VO wk 2 and tooltip's Escape in VO wk 3. That is 30 runs: 14 in VO chr, 16 in VO wk. Five items were heard in neither VoiceOver browser: dropdown-menu, error-summary, live-console, marker and marketing-bar. `022` criterion 13 needs all 28.
- **Should VoiceOver have more shards?** Yes, but shards alone do not fix the pace.
  - INFERRED: at this run's pace, 87 tests take 139 to 147 minutes a browser. Under `022` criterion 22's 20-minute bar, that is 7 or 8 shards a browser, 15 macOS jobs. At five at a time, they run in three or four waves.
  - INFERRED: retries take about 42% of VoiceOver's time. Families A, D and E cause most of them. With those fixed, first attempts alone take about 76 to 81 minutes a browser, which is 4 or 5 shards.
  - INFERRED: NVDA's three shards are enough: 17.6 to 24.7 minutes with retries, about 12 to 15 without.
  - So: fix the harness families first, then set VoiceOver to five shards a browser and re-measure. That changes `022l`'s three-shard figure, so it is the workflow's small change, after the fixes.

## 10. Every failing test

Kind: **R/H** is rule or harness; **I** is item; **U** is unknown. Pairs: wk, chr are VoiceOver's; N-chr, N-ff are NVDA's.

| Test | Pairs | Kind | Fix, in one sentence |
| --- | --- | --- | --- |
| alert-dialog: page behind, ten steps | wk, chr, N-chr, N-ff | R/H | O2 reads its precondition from the open window and the steps, and counts a stalled walk as contained. |
| app-shell at 360: page behind | wk, chr, N-chr, N-ff | R/H | As above, and `Sr.open` reloads a page the NVDA helper's click moved. |
| dialog: page behind | wk, chr, N-chr, N-ff | R/H | As above, and the walk leaves NVDA's focus mode first. |
| marketing-bar: page behind | N-chr, N-ff | R/H | O2 reads the overlay's name from the open window. |
| product-home at 360: page behind | wk, chr, N-chr, N-ff | R/H | O2 reads the overlay's name from the open window. |
| settings' delete confirm: page behind | wk, chr, N-chr, N-ff | R/H | `Sr.steps` finds inside texts by DOM containment, not by text. |
| sheet: page behind | N-chr, N-ff | R/H | O2 reads the overlay's name from the open window. |
| sidebar at 360: page behind | wk, chr, N-chr, N-ff | R/H | O2 reads the overlay's name from the open window. |
| app-shell at 360: opening speaks its name | N-chr, N-ff | R/H | `Sr.open` checks the URL after `navigateToWebContent()` and loads the page again if it moved. |
| app-shell: the skip link | wk, chr | U | Attach VoiceOver's item text to tell a lost phrase from an unspoken name. |
| chart: from before the figure | wk, chr, N-chr, N-ff | R/H | C1's walk takes about 25 steps, room for the 14 tick labels `004` accepts. |
| composer: Stop moves focus | wk, chr | U | Attach VoiceOver's item text to tell a lost phrase from an unspoken name. |
| error-summary: the second submit | N-chr, N-ff | I | The summary renders its alert anew on each failed submit, so it is announced again. |
| page-states: the loading status | wk, chr | U | Navigate client-side in the window, and attach VoiceOver's item text. |
| pagination P1 | wk, chr | R/H | One capture per window, so VoiceOver's stale last phrase is not logged twice. |
| pagination P2 | N-ff | R/H | Remove the status text from a phrase, not the whole phrase, and drop commas in the normalisation. |
| pagination P2 | wk, chr, N-chr | U | Attach the readers' item text; focus is right in the DOM. |
| pagination P3 | N-ff | R/H | The normalisation drops commas. |
| pagination P3 | wk, N-chr | U | Attach VoiceOver's item text; probe NVDA's "Previouspage" with the space outside the hidden span. |
| search-field S2 | wk, chr, N-chr, N-ff | I | Clear the status a fixed time after a count, as the toast does, so an unchanged count is a change. |
| search-field S3 | wk | U | Attach VoiceOver's item text. |
| search-field S4 | N-chr, N-ff | U | Log the NVDA buffer's refresh beside the window; the DOM writes the right count once. |
| sign-in: a valid submit | chr | U | Attach VoiceOver's item text; the refusal at 800 ms replaces "Signing in". |
| sign-up: a resend's status | N-chr, N-ff | R/H | Expect NVDA's spoken form of the address, or judge the sentence without it. |
| spinner: the label changes | chr | U | Attach VoiceOver's item text. |
| tag T3: the emptied list | N-chr, N-ff | I | Give the emptied list content NVDA renders, or a focus target with content. |
| toast S1 | wk | R/H | One capture per window, so the stale last phrase is not logged twice. |
| toast S3 | wk, chr, N-chr, N-ff | R/H | Expect the example's description, and drop NVDA's "F 8" split in the normalisation. |
| toast S4 | chr | U | Attach VoiceOver's item text. |
| toast S6 | wk, chr, N-chr, N-ff | R/H | Judge the window in which the first Escape returns focus. |
| toast S8 | wk, chr | U | Attach VoiceOver's item text; VoiceOver logs the title or the toast, never both. |
| toast S9 | N-chr, N-ff | U | Probe a longer modal hold under NVDA; the DOM writes the success at 1,242 ms. |
| toast S10 | chr | U | Attach VoiceOver's item text; VoiceOver logs one of the two announcements. |
| tooltip: focusing the trigger | N-ff | U | Record whether the tooltip is open after the focus, beside the phrases. |
| tooltip: Escape | N-chr, N-ff | R/H | Blur first and open the tooltip by the test's own focus, as T1 does. |

- **Counts by row:** 18 rule or harness, 3 item, 14 unknown; 35 rows for 33 tests, two of them split by pair.
- **Counts by failed run:** 51 rule or harness, 8 item, 23 unknown; 82 in all.
- **INFERRED:** none of the eight O2 tests is a fault in Kuiper's modals. The three item faults are search-field, error-summary under NVDA, and tag under NVDA.

## 11. What this memo did not see

- The phrases of passing tests: `list` prints only failures. So sheet's VoiceOver pass is inferred, not seen.
- VoiceOver on the 16 tests it never reached, so error-summary's second submit and marketing-bar's walk under VoiceOver.
- Firefox: this container has no Firefox build, so no probe ran there.
- Any speech: no reader runs here. Every speech claim is READ from the logs.
