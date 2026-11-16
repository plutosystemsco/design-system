# Review of 022q — The speech suite's own faults

Reviews [`specifications/022q-the-speech-suites-own-faults.md`](../specifications/022q-the-speech-suites-own-faults.md) before it is built. Its research is [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md) (*the memo*) and [the fourth matrix run](../research/2026-11-16-the-fourth-matrix-run.md). This reviewer wrote neither the specification nor its research (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; does not land yet: new findings 16 and 17 (Medium) stand
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (76 lines, untracked), on `release/0.13.0` at `c5cdd65`. Checked against:
  - `022` decisions 10 to 16, its criteria 13, 15 and 22, and its Q9 rehearsal notes (step 5 of its landing notes);
  - `tests/sr/rules.ts`, `tests/sr/fixtures.ts`, `playwright.sr.config.ts`;
  - the eight O2 files (`alert-dialog`, `app-shell`, `dialog`, `marketing-bar`, `product-home`, `settings`, `sheet`, `sidebar`), `toast.sr.ts`, `pagination.sr.ts`, `chart.sr.ts`, `tooltip.sr.ts`;
  - `tests/unit/sr-rules.test.ts`, `tests/unit/workflow.test.ts`, `tests/sr/mutations/main/6-sheet.patch` and `expected.json`, `tests/fixtures/ci/*.json`;
  - `.github/workflows/matrix.yml` (the `voiceover`, `nvda`, `report` and `gate` jobs);
  - guidepup in `node_modules`: `@guidepup/playwright` 0.21.0 (`navigateNVDAtoWebContent.js`, `navigateVoiceOverToWebContent.js`, `withGuidepup.js`) and `@guidepup/guidepup` 0.40.0 (`windows/NVDA/keyCodeCommands.js`, `NVDA.js`, `NVDAClient.js`, `macOS/VoiceOver/VoiceOverClient.js`, `constants.js`);
  - bits-ui's `dialog-title.svelte` and `dialog-description.svelte`; the examples `alert-dialog/keyboard.svelte`, `toast/keyboard.svelte`, `tooltip/states.svelte`.
- **Re-ran:** nothing in the repository was written but this file.
  - `bun test tests/unit/sr-rules.test.ts tests/unit/workflow.test.ts` → **53 pass, 0 fail**, 381 expects. EXECUTED.
  - `SR_READER=voiceover bun --bun playwright test -c playwright.sr.config.ts --project=webkit --list --shard=k/5`, k = 1 to 5 → **19, 17, 19, 16, 16 tests**. Shard 1 holds `alert-dialog`, `app-shell`, `chart` and `dialog`; shard 5 holds all ten `toast` tests. EXECUTED; no reader started.
  - A scratch Playwright probe (Chromium for Playwright 1.64.1, the existing `build/`, `vite preview` on a spare port, script in the session's scratchpad, since deleted with its server). EXECUTED:
    - `/example/toast/keyboard/`: Raise two, wait, then F8, Tab, Escape. After a **200 ms** wait, focus is on the other toast's **Dismiss**. After 6,000 ms and 6,500 ms it is on **Raise two**.
    - `/view/app-shell/` at 360 × 700: guidepup's `body` focus, click and blur. Without a cover, the URL becomes `/`. With a fixed, transparent, `aria-hidden` div appended to `<body>`, the click reaches the div, Playwright's click does not stall, and the URL stays. The helper's Tab then focuses the skip link.
    - The first Tab from load focuses the trigger itself on `/example/dialog/keyboard/` ("Rename project"), `/example/sheet/keyboard/` ("Open navigation") and `/example/alert-dialog/keyboard/` ("Delete project"), the input on `/example/search-field/filter/`, and "Save" on `/example/toast/raise/`.

## Acceptance criteria against evidence

A specification review asks whether each criterion is countable, and whether together they prove the intent.

1. `sr-rules.test.ts`'s new cases — countable, **not sufficient.** INFERRED: no case is a leaking walk that ends past the overlay (finding 1). No case is a walk that never moved but whose one phrase holds an inside text (finding 2). The "still" cases pass on today's `rules.ts`, so they cannot be seen failing first (finding 15).
2. 45 jobs in `workflow.test.ts` and the CI fixtures — countable and sufficient. READ: `workflow.test.ts:301` counts 41 today; five `tests/fixtures/ci/*.json` files name `voiceover (webkit, 3)`.
3. The dry run passes every changed test — **cannot be met as written, and cannot fail for decision 3.** EXECUTED: S6 judged at the first Escape fails in a dry run, whose windows are 200 ms (finding 8). The dry reader's `navigateToWebContent` does nothing, so "the URL unchanged" holds whatever the cover does (finding 10).
4. `mutations.test.ts` and `sr-static.test.ts` pass — countable. INFERRED: true but weak. Neither shows patch 6 still faults O2, not X0 (finding 1).
5. The next push run — countable, **not sufficient.** It lets a row fail if its new reason is written down. INFERRED: as drafted, the alert-dialog and delete-confirm rows still fail on X0, and the C1 row may time out under VoiceOver (findings 3, 7).
6. Shard times, counts, scorecard row — countable.

## Findings, most severe first

1. **High: a non-modal overlay now gives X0, not O2, so patch 6 cannot be proven** (decision 1, third bullet; `rules.ts:169–196`; `fixtures.ts:123–129`).
   Patch 6 makes the sheet `aria-modal="false"` with `trapFocus={false}` and expects O2 (`mutations/main/expected.json`). A leaking walk goes forward from the sheet's last element to the second sentinel, which `steps()` appends at the end of `<body>`. Nothing follows it. So the last steps speak the sentinel, or repeat it, or speak the end of the document. None of those holds an inside text. Today's code checks every precondition before the sentinel.
   Failure: INFERRED, NVDA under patch 6: "link, Components", "link, Blocks", "link, Changelog", "out of list, button, Close", "sentinel 1a2b3c4d", then end-of-document speech → X0 ("the last step holds no inside text"). The mutation report rejects an expected test that fails on X0 (`022` decision 15). Decision 10's claim is half met: the witness can pass unpatched, but cannot fail patched.
   Fix: in decision 1, order O2's checks. First, the reader got in and moved (finding 2's fix). Then, if the sentinel is spoken in the steps, fault O2. Only when it is not, require the stall evidence: the last non-empty step phrase holds an overlay text. Add to criterion 1: "a walk that enters, speaks two inside texts, then the sentinel, then end-of-document phrases, returns O2". Name patch 6 in criterion 4 or 5: the next `mutate` dispatch shows sheet's O2 test faulting O2 in all four pairs, or the landing notes say why it was not run.

2. **High: a reader that never moved now passes** (decision 1, first and third bullets).
   The distinct count now spans the `open` window and the steps. The `open` window always holds speech once focus lands inside: the title, then the focused element. So a walk of one repeated phrase has two distinct phrases. If that phrase is the focused element, it is an inside text, and the last step holds it. The specification says such a reader "speaks one phrase and fails the precondition". It does not.
   Failure: alert-dialog, a reader whose `next()` does nothing (focus mode, lost keyboard focus). `open`: "Delete pluto-sandbox? alert dialog, Cancel button". Steps: "Cancel button" ten times. Name ✓, inside text ✓, two distinct ✓, last step holds "Cancel" ✓, no sentinel → **pass**, with no walk. That is the shape `022` Q9 closed for Orca.
   Fix: take the proof of movement from the steps alone. `steps()` records the accessible text of the element focused when the walk begins. "Moved" means a step speaks an overlay text (by DOM containment, trigger-named elements included) other than that element's text. "Got in" means the `open` window or a step speaks an inside text other than the trigger's name. Both are needed before the sentinel is judged. Add to criterion 1: "ten copies of the focused element's phrase, with a full `open` window, return X0".

3. **High: as drafted, alert-dialog and the delete confirm still give X0 in all four pairs** (decision 1, second and third bullets; `fixtures.ts:146–148`).
   bits-ui's `Dialog.Title` and `Dialog.Description` render a `div` (`bits-ui/dist/bits/dialog/components/dialog-title.svelte:33`). `steps()` reads only `h1, h2, h3, h4, p, label, button, a, li`. So the alert dialog's title and description are never inside texts. "Delete project" is the trigger's name, which decision 1 excludes. By DOM containment the list is still `["Cancel"]`.
   Failure: VoiceOver's last phrase, "end of Delete pluto-sandbox? … alert dialog" (*the memo* §2), holds no "Cancel" → X0. NVDA's last phrase, "button, Delete project", holds only the excluded name → X0. The settings delete confirm has the same shape ("Keep my account", "Delete account"). Two of criterion 5's rows fail for the memo's reason.
   Fix: inside texts also take `[role="heading"]` and the elements the overlay's `aria-labelledby` and `aria-describedby` name. Then VoiceOver's "end of … dialog" phrase holds the title, and that is the right stall evidence for it. For the last-step check, count every overlay text, the trigger-named action included. The forward walk cannot reach the real trigger from inside without passing a sentinel: the trigger is in `<main>`, after the first sentinel, and the overlay's portal ends before the second. Say how `steps()` learns the trigger: a new argument, say `steps(n, { trigger })`. Add the memo's verbatim alert-dialog walks, both readers, to criterion 1 as passing cases.

4. **High: decision 2's "exit from focus mode" is Escape, which closes the overlay under NVDA's browse mode** (decision 2; `@guidepup/guidepup/lib/windows/NVDA/keyCodeCommands.js:397–402`).
   READ: `exitFocusMode` is a plain Escape. Its own description says it "switches back to browse mode if focus mode was previously switched to automatically". INFERRED: in browse mode NVDA passes Escape to the page. *The memo* §3 shows this already. The helper's final `exitFocusMode` reached the page and closed the tooltip. READ, *the memo* §2: NVDA was in browse mode in the sheet ("link, Components" by Down Arrow).
   Failure: alert-dialog, sheet, sidebar, marketing-bar, app-shell, product-home and the delete confirm under NVDA. `steps()` sends Escape, bits-ui closes the modal, and focus returns to the trigger. The walk then runs on the page behind. It gives X0, or a false O2 fault if it meets a sentinel. Only the dialog, with focus in its Name field, keeps its overlay.
   Fix: under NVDA, reach browse mode with a key NVDA consumes. One way: inside a capture, press `toggleBetweenBrowseAndFocusMode` (NVDA+Space), read the phrase it speaks, and press it again if that says "focus mode". Then clear the log. Add a dry check that the overlay is still open after the step that leaves focus mode. Name `exitFocusMode` as not to be used inside an overlay.

5. **High: one capture per window would hear only the window's last phrase under VoiceOver** (decision 7; `VoiceOverClient.js:131–143`, `174–238`).
   READ: guidepup's VoiceOver client awaits the whole action, then polls "last phrase". It stops after 25 stable polls of 50 ms (`constants.js`). With the action and the 6 s wait in one capture, polling starts at 6 s. Anything VoiceOver said and replaced inside the window is lost. *The memo* §6 shows VoiceOver's windows end in its hint, "You are currently on a button…".
   Failure: any VoiceOver window in which a later phrase follows the judged one. A focus move speaks the name, then the hint ("You are currently on a button…", which holds no name). One capture logs only the hint → F1 faults. O1's title is followed by the focused element; toast S10 holds two announcements. Each loses its first phrase. Only a window whose judged phrase is also its last (P1's "Page 6 of 12", if no hint follows) keeps it. Under NVDA one capture is right. NVDA's client listens during the action (`NVDAClient.js:233–262`), and a second capture's `#stopReading()` cancels speech mid-window.
   Fix: split decision 7 by reader. NVDA: one capture for the action and its wait. VoiceOver: keep the action's capture and the wait's capture, and drop the wait capture's phrase when, normalised, it equals the action capture's last phrase. Say plainly that a real VoiceOver repeat at that join is then not counted. Add a unit case for the drop, using the memo's P1 log.

6. **Medium: after decision 7, L3 under VoiceOver may lose its only way to fire, and the mutation set is said not to change** (decisions 7 and 10; `VoiceOverClient.js:207`).
   READ: within one VoiceOver capture, a phrase equal to the one before is counted as stable and never logged again. So two identical readings inside a capture log once. INFERRED: today patch 7's L3 under VoiceOver can fire through the stale repeat this change removes. That would be proof by artefact.
   Failure: the next `mutate` dispatch fails patch 7's VoiceOver entries. Decision 10 says the expectations do not change, so the report fails with no stated cause.
   Fix: state in advance, per `022` decision 15, that patch 7 may not prove L3 under either VoiceOver pair after this change. Name the four steps that follow, `double-read` included. Drop "the mutation sets' expectations" from decision 10's "nothing else changes", or qualify it.

7. **Medium: C1's 25 steps may not fit VoiceOver's five-minute test timeout** (decision 6, last bullet; `playwright.sr.config.ts:35`; `chart.sr.ts:58`).
   *The memo* §9 infers 10 to 14 s a VoiceOver step. 25 steps take 4.2 to 5.8 minutes before the page opens. The timeout is 5 minutes. Two VO wk attempts already hit it (*the memo* §6). C1's 15 steps are also written into `rules.ts:279` and `022` decision 12's table.
   Failure: chart under VoiceOver ends "Test timeout of 300000ms exceeded" on every attempt, about 15 minutes of shard 1's 40.
   Fix: give the chart test its own `test.setTimeout`, about 10 minutes, and count it in decision 9's figures. Or start the walk at the figure, so fewer steps reach the header. Update the step count in `rules.ts`'s C1 comment and in the chart file's header.

8. **Medium: S6 judged at the first Escape rests on a timing race, and fails the dry run** (decision 6, second bullet; `toast.sr.ts:101–117`).
   The first Escape returns focus only if the success toast has already left. It "leaves after at least 6 s" (`026`). The raise window is 6 s, so the state sits on its edge. EXECUTED: after a 200 ms raise, which is the dry run's window, the first Escape leaves focus on the other toast's Dismiss. After 6,000 ms it is on Raise two. The toast's timer also pauses in a background window.
   Failure: criterion 3's dry run fails S6's focus fact. In CI a slow or paused timer gives F1 "Raise two was not spoken" for a reason the item does not own.
   Fix: make the state certain before F8. Wait until the success toast is gone (a bounded `waitFor` on its absence, recorded as a fact), then judge the Escape that returns focus. Or press F8 at once and judge the second Escape, as `026` test 51 orders. Either works in the dry run.

9. **Medium: `itemTextLog()` says nothing about NVDA's cursor** (decision 8; `@guidepup/guidepup/lib/windows/NVDA/NVDA.js:987–992`).
   READ: under NVDA, `itemTextLog()` returns `spokenPhraseLog()`, and `clearItemTextLog()` clears the spoken log. Under VoiceOver the item-text log is separate. `Sr.listen` clears only the spoken log (`fixtures.ts:88`), so VoiceOver's item texts would pile up across windows.
   Failure: every NVDA "item text" entry copies its window's phrases. *The memo*'s NVDA unknowns (§8: search-field S4, toast S9, P2 and P3 under NVDA chr) gain nothing. Decision 8 says otherwise.
   Fix: say decision 8 is VoiceOver's evidence. Clear the item-text log at each window's start. For NVDA, either record nothing or name another source, such as a `reportCurrentFocus` capture after the window, kept apart from the judged phrases. Criterion 5's "item text entry beside each window" then counts VoiceOver's windows only.

10. **Medium: decision 3 has no check that can fail, and the cover's form is unstated** (decision 3; criterion 3; `navigateNVDAtoWebContent.js:48–72`).
    READ: the helper clicks with Playwright's `page.locator("body").click()`. That click checks that the element at the point is `body` or inside it. EXECUTED: a fixed, transparent, `aria-hidden` div appended to `<body>` takes the click, and the URL stays. A cover outside `<body>` would make the click wait to its timeout. The helper's Tab and its two Escapes still reach the page. EXECUTED: Tab focuses the trigger itself on the dialog, sheet and alert-dialog pages. The tooltip is the only example held open at load (READ, `tooltip/states.svelte:14`), so decision 4 covers the Escape.
    Failure: the dry reader skips `navigateToWebContent`, so the dry run's "URL unchanged" holds with or without the cover. A broken cover is first seen on a Windows runner.
    Fix: define the cover: a `div` appended to `<body>`, `position: fixed; inset: 0`, the top `z-index`, `aria-hidden="true"`, no tab stop, with a click listener that records a hit. `Sr.open` fails as X0 if the URL moved or the cover took no click. Add a browser check, seen failing first: at 360 on `/view/app-shell/`, the helper's `body` click with the cover keeps the URL; without it, the URL becomes `/`. Say in decision 3 that the Tab leaves focus on the first tab stop, and that tests which `focus()` that element get an empty focus window.

11. **Low: decision 9's figures** (decision 9; `matrix.yml:179–224`).
    EXECUTED: five shards hold 19, 17, 19, 16 and 16 tests, not "17 or 18". At *the memo*'s 1.69 minutes a test, 19 tests take 32 minutes with retries, inside the 40-minute deadline. At 0.93 they take 18. `022` criterion 22's 20-minute bar is then missed with retries. Ten jobs on five macOS slots run in two full waves, about two shard times plus two set-ups after `build`. That is below run 4's 80 minutes. A `mutate` dispatch at the same time doubles the waves and can pass the 95 minutes `gate`'s mirror waits.
    Fix: give the measured counts. Say whether `022` criterion 22's 20 minutes binds here, or waits for the re-measure. Add the wall-time estimate, and the note that a dispatch and a push should not share the macOS slots.

12. **Low: dropping commas can join words** (decision 5, first bullet; `rules.ts:62–70`).
    Fix: replace each comma with a space, before whitespace collapses (step 4), and say so in the normalisation's steps. Then "Page,12" reads "page 12". No rule needs a comma: every expected text is normalised the same way (INFERRED, the comma texts in `tests/sr/` are `chart`'s figure name and toast S3's sentence).

13. **Low: spoken-form lists need their semantics per rule** (decision 5, second bullet).
    Fix: name the rules that take a list (L1, L2, L3, L4, F1, B1 at least). Say that L2 and U1 fault if any form is spoken, and L3 if two adjacent phrases each hold any form. Toast S3's list holds the whole sentence twice, "F8" and "F 8". Sign-up's holds the sentence with "ada@example.com" and with "ada at example dot com".

14. **Low: there is no Scope section.** `context/README.md` asks for scope in and out.
    Fix: add one. **In:** `rules.ts` (O2's arguments and order, `normalise`, the list type, C1's comment); `fixtures.ts` (`open`'s cover and checks, `steps`'s browse mode, trigger, inside texts and focused-element record, `listen`'s captures and item text); the eight O2 files (the `open` window and the trigger passed to O2); `toast.sr.ts` S3 and S6; `pagination.sr.ts` P2; `chart.sr.ts`; `tooltip.sr.ts` T2; `sign-up.sr.ts`'s resend; `sr-rules.test.ts`; `matrix.yml`'s `voiceover` job; `workflow.test.ts`; the five `tests/fixtures/ci/*.json`. **Out:** items (`022r` to `022t`), *the memo*'s unknown rows, page-states' client-side navigation, tooltip T1 under NVDA ff, window lengths, retries, the ledger. Say whether `022`'s decision 12 table (O2's precondition, C1's 15 steps, normalisation step 5) gets a pointer to `022q`, or is left as the record.

15. **Low: criterion 1's fixtures and its "seen failing first".**
    Fix: say the "still" cases are guards that pass before and after. Take the new cases' phrases verbatim from *the memo* §2: VoiceOver's dialog and alert-dialog walks, NVDA's sheet and alert-dialog walks. Define "the last step's phrase" as the last non-empty step entry that is not a VoiceOver hint ("You are currently on").

## Constitution checks

- §4.1 source, not a package: met. Only test code and the workflow change; nothing an app installs.
- §4.3 tokens are the one source: not touched. The cover and sentinel are test code with no styles an app sees.
- §4.4 accessible by default, and proven: **at risk.** Findings 1 and 2 weaken O2 both ways: a non-modal overlay escapes as X0, and a stalled reader passes. Finding 5 would blind VoiceOver's live-region rules. The intent, "a failed speech test means the item failed", needs the reverse too: a passing test means the item passed.
- §4.5, §4.6 pins and dependencies: met. No dependency is added; guidepup stays at 0.40.0 and 0.21.0.
- §5 the pipeline: research exists and is labelled. Criterion 6 re-runs the scorecard. The owner's choice (2026-11-16) is cited; it belongs in Landing notes once built.
- §6 never: no commit or push. No prior art copied. No installed app changes.

## Verdict

Does not land yet: findings 1 to 5 (High) stand: O2 must judge the sentinel before the stall, prove movement from the steps alone, and read the dialogs' titles; the walk must reach browse mode without Escape; and VoiceOver's windows must keep two captures. Findings 6 to 10 (Medium) stand too.

## Disposition

The specification was rewritten on 2026-11-16 to answer all fifteen findings. This re-check reads the rewrite (94 lines, untracked) against each finding and against the code read above. Nothing new was run.

1. **Closed.** Decision 1 now orders O2: got in, moved, the sentinel, then the stall. A leaking walk faults at step 3, before any stall evidence. Criterion 1 holds the leaking walk as a guard that faults O2. Criterion 7 asks for the patch 6 dispatch.
2. **Closed, for a reader that never moved.** "Moved" is now read from the steps alone. It needs an overlay text other than the focused element's. Criterion 1 holds ten copies of the focused element's phrase as an X0 guard. Finding 16 is about a reader that never got in, a separate gap.
3. **Closed.** The selector adds `[role="heading"]` and the `aria-labelledby` and `aria-describedby` targets. The trigger-named action counts for "moved" and the stall. `steps(n, { trigger })` names the trigger. INFERRED: the memo's walks now pass. VoiceOver's dialog walk moves from the Name field to Cancel and ends on "Close". VoiceOver's alert-dialog walk moves from Cancel to "Delete project" and ends on "end of Delete pluto-sandbox? …", which holds the title. NVDA's alert-dialog walk ends on "Delete project". A first step that repeats the focused element is harmless, because "moved" looks at any step.
4. **Closed.** NVDA+Space, read back, and pressed again on "focus mode". NVDA keeps that key, so nothing reaches the page. `exitFocusMode` is named as unused inside an overlay. The dry check that the overlay is still open cannot fail, since the dry reader presses nothing. The proof is criterion 6's NVDA rows.
5. **Closed.** Decision 7 now splits by reader. VoiceOver keeps two captures and drops the stale repeat at the join, and criterion 1 has a unit case for that.
6. **Closed.** Decision 7 states patch 7's VoiceOver risk in advance, with `022` decision 15's four steps. Criterion 7 records the outcome. Decision 10 is qualified.
7. **Closed, as asked.** The chart test now has a 10-minute timeout. That raises a new conflict with the shard deadline: finding 17.
8. **Closed.** S6 now waits, bounded, until the success toast is gone. It records that as a fact, then judges the Escape that returns focus. Criterion 4 runs the wait dry. The bound is unnamed: finding 18.
9. **Closed.** Item text is recorded under VoiceOver only, and cleared at each window's start. NVDA records nothing, and decision 8 says so.
10. **Closed.** The cover is now defined, and records its hit. The "no click" X0 applies only under NVDA, which is right: the VoiceOver helper clicks nothing (READ, `navigateVoiceOverToWebContent.js`). Under VoiceOver only the URL check applies. Criterion 3 is a browser check, seen failing first. How a fault in `open` becomes X0, and why it never fires dry, is unstated: finding 18.
11. **Closed.** Decision 9 gives the measured split (19, 17, 19, 16, 16), the 32 and 18 minute figures, criterion 22's bar re-measured, the two waves, and the warning about sharing slots with a dispatch. It leaves out the chart test's new cost: finding 17.
12. **Closed.** Commas become spaces, before whitespace collapses.
13. **Closed, with a slip.** Decision 5 names the rules that take a list and what each does with one. U1 is given a meaning, but it is missing from the list of rules that take one: finding 18.
14. **Closed.** The Scope section is added. It covers all six `tests/fixtures/ci/*.json` files (READ: each names six `voiceover` jobs today) and a pointer line in `022`'s decision 12.
15. **Closed, with one gap.** The memo's walks are named as fixtures. The guards are labelled as passing before and after. "The last step's phrase" is defined. But *the memo* §2 quotes only the steps. "Got in" also reads the `open` window, so the fixtures need those windows too: finding 18.

**New findings from the rewrite**

16. **Medium: the overlay's name, or a text inside the trigger's name, can meet "got in"** (decision 1, step 1, and its texts paragraph).
    The title is now an inside text, through `aria-labelledby`. The `open` window speaks it whenever O1 holds. Only a text *equal* to the trigger's name is left out. So "got in" holds for any reader that announced the title, wherever its cursor went. Substring matching makes this worse.
    Failure: INFERRED, the sheet example. The trigger is "Open navigation" and the title is "Navigation". Take a reader that speaks the title on opening but whose walking cursor stays on the trigger, the shape `022` Q9 closed. `open` holds "Navigation, dialog", so got in passes. Each step's "Open navigation button" holds the overlay text "navigation", which is not the focused link's "Components", so moved passes. No sentinel is spoken. The last step holds "navigation", so the stall passes. The result is a **pass** with the walk never inside. The alert dialog is the same: the title is in `open`, and "Delete project button", repeated from the trigger, meets moved and the stall. Decision 1's "cannot reach the trigger from inside" argument holds only if the reader really got in.
    Fix: in step 1, leave out the overlay's name and every text that the trigger's name holds, compared normalised. Then "got in" must come from a focused or walked element inside: "Components", "Cancel", "Name". Do the same for "moved" and the stall, except for trigger-named elements, which step 1 now guards. Add to criterion 1 a guard that returns X0: an `open` window that holds only the title, then ten copies of the trigger's phrase.

17. **Medium: the chart test's 10-minute timeout does not fit the 40-minute deadline of shard 1** (decisions 6 and 9; `playwright.sr.config.ts:35`).
    EXECUTED (the `--list` above): the chart test is in shard 1, with 18 others, three of them O2 walks. CI retries twice. Decision 9's 32 minutes uses 1.69 minutes for every test. The chart test alone can take three 10-minute attempts.
    Failure: INFERRED. The chart test fails on all three attempts, either honestly or by timeout. Shard 1 then needs about 18 × 1.69 + 3 × 6 to 10 = 48 to 60 minutes. The 40-minute deadline stops it and leaves tests not run, as in run 4. Criterion 6's "every shard ends inside its limit" fails.
    Fix: count the chart test in shard 1's estimate. Then bound it, for instance with a 7-minute timeout (25 × 14 s plus the open) and one retry for this test alone. State that exception to decision 10's "retries do not change". Or move the walk's start to the figure, so fewer steps are needed. Show shard 1's worst case inside 40 minutes.

18. **Low: four write-ins.**
    - Criterion 1: *the memo* gives no `open` windows. Take them from run 4's logs, where each failure prints its windows (READ, `fixtures.ts:222–225`). Or label the fixtures constructed.
    - Decision 3: say how `open` records its X0, for example a fault pushed and judged at once. Say that it never fires in a dry run, whatever `SR_READER` is. Run criterion 3 in Chromium and Firefox, NVDA's two browsers.
    - Decision 6: give S6's bound, longer than `026`'s 6 s minimum plus the exit, for example 10 s.
    - Decision 5: add U1 to the rules that take a list.

**Closing verdict.** Does not land yet: findings 1 to 15 are closed. New findings 16 (Medium: "got in" can be met by the title or by a text inside the trigger's name, which reopens `022` Q9's case) and 17 (Medium: the chart test's timeout and retries can push shard 1 past its 40-minute deadline) stand. Finding 18's write-ins should go in with them.
