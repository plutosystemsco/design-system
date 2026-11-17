# 022q — The speech suite's own faults

- **Status:** rewritten 2026-11-16 after its specification review (`reviews/022q-the-speech-suites-own-faults-spec-2026-11-16.md`, 15 findings, 5 High), and again after its re-check (findings 16 to 18). The second re-check, 2026-11-16: fit to build. Built; its change review (`reviews/022q-the-speech-suites-own-faults-pr-2026-11-16.md`) found 2 High and 2 Medium faults in decisions 1, 2 and 7, amended below (marked *amended after the change review*), then 4 Low at its re-check; all twelve closed, dispositioned: lands. Criteria 6 to 8 are read from the next `matrix` run.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** a change to `022`'s screen-reader rules, fixture and tests, and to the VoiceOver jobs' shard count (lane E). No item, token or dependency changes. A specification, not a small change, because it changes rules `022` decided (decisions 12 to 15) and the owner chose to fix the suite before anything else (2026-11-16).
- **Depends on:** `022`, `022l`.
- **Research it stands on:** [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md), cited as *the memo*, by section; [the fourth matrix run](../research/2026-11-16-the-fourth-matrix-run.md); the specification review's readings of guidepup and bits-ui, cited as *the review*.

## Intent

Run 4 gave the first speech verdicts: 82 failed runs over 33 tests. *The memo* traces 51 of them to the suite itself: a rule's preconditions, a helper that changes the page, wording the normalisation does not absorb, tests that expect the wrong thing, and a capture that logs one phrase twice. This change fixes those, so that a failed speech test means the item failed, without letting a leaking overlay or a reader that never moved pass. It also gives VoiceOver the shards its pace needs, and records where VoiceOver's cursor was beside each window, so the unknown runs can be read next time.

## Decisions

### 1. O2: got in, moved, then the sentinel, then the stall (*the memo* §2; *the review* findings 1 to 3)

O2 judges in this order, and stops at the first that decides:

1. **Got in.** The `open` window or a step speaks an inside text. Otherwise X0.
2. **Moved.** `steps()` records the accessible text of the element focused when the walk begins. A step speaks an inside text other than that element's, or the trigger's name. Otherwise X0. *Amended after the change review* (finding 3): the title, the description and texts inside the trigger's name no longer count, since a reader speaks them from the trigger or as the overlay opens. Movement is proven by the steps alone: the `open` window always holds speech once focus lands inside, so it cannot prove a walk.
3. **The sentinel.** If a step speaks the sentinel, O2 faults. A non-modal overlay (mutation patch 6) faults here, before any stall evidence is asked for.
4. **The stall.** Otherwise the last step's phrase must hold an inside text or the trigger's name: the walk ended inside. Otherwise X0. If it holds the trigger's name and no inside text, one `previous()` step after the walk must speak an inside text, or O2 returns X0: inside an alert dialog whose action is named as its trigger is ("Delete project"), the real trigger and the action read the same, and only the element before the action tells them apart (*amended after the change review*, finding 3). The last phrase also proves the stall when it is VoiceOver's boundary of the overlay itself: it begins "end of" and then the overlay's name, and names a dialog (the change review's re-check, finding 9: VoiceOver ends a navigation landmark with "navigation", which is the sheet's title), as the memo's VoiceOver alert-dialog walk ends ("end of Delete pluto-sandbox? … alert dialog"). VoiceOver speaks that only at the end of the container its cursor is in, so a cursor outside never meets it; the title alone, which a phrase on the trigger can hold ("Navigation" in "Open navigation"), does not (the rebuild's conflict, ruled 2026-11-16). "The last step's phrase" is the last non-empty step entry that is not a VoiceOver hint (a phrase beginning "You are currently on").

**Inside texts and overlay texts.** `steps(n, { trigger })` takes the trigger's accessible name. *Overlay texts* are the texts of elements inside the overlay, each its `aria-label` where it has one and else its visible text (the dialog's and sheet's close buttons are named only by `aria-label="Close"`; the build's deviation 1), found by DOM containment: `h1`–`h4`, `[role="heading"]`, `p`, `label`, `button`, `a`, `li`, and the elements the overlay's `aria-labelledby` and `aria-describedby` name. bits-ui renders a dialog's title and description as `div`s, so the old selector missed them (*the review* finding 3). *Inside texts* are the overlay texts less three kinds: the trigger's name; the overlay's own name and description (its `aria-labelledby` and `aria-describedby` texts, the title and description); and any text the trigger's name contains as whole words, compared normalised (so "Name" inside "Rename project" is not excluded; the change review, finding 7). A reader announces the title and the description as the overlay opens (the description: the build's deviation 2; six of eight overlays have one), wherever its cursor stays, and a phrase on the trigger holds every word of the trigger's name: neither proves the cursor went in (*the review* finding 16, the sheet's "Navigation" inside "Open navigation"). The old filter, which dropped any text the page also shows, goes: it left alert-dialog and the delete confirm one text. These stay out of "got in", so a reader that never left the trigger meets no precondition, which was the old filter's purpose (`022` Q9). The trigger's name counts for "moved" and "the stall", with the stall's `previous()` step when it is all the last phrase holds; the title, the description and texts inside the trigger's name count for neither, except as VoiceOver's boundary of the overlay (step 4).

O2 takes the `open` window's phrases as a new argument, and the overlay's name.

### 2. The walk starts in browse mode, by a key NVDA keeps (*the memo* §2; *the review* finding 4)

Under NVDA, `steps()` presses NVDA+Space (guidepup's `toggleBetweenBrowseAndFocusMode`) inside a capture, reads what NVDA announces, and presses it again if that says "focus mode". If it hears neither "focus mode" nor "browse mode", or the second press after "focus mode" does not say "browse mode" (the re-check's finding 10), it records X0 through `Sr.judge()`. `steps()` takes the overlay's name O2 is judged with, as `title`, for its `previous()` decision (finding 11). Then it clears the log. *Amended after the change review* (finding 1): NVDA reports a mode change by a sound, not speech, while `passThroughAudioIndication` is on, its default. The suite starts NVDA with `screenReaderStartOptions.settings.virtualBuffers.passThroughAudioIndication: false`, which guidepup's `start()` merges into the session's `nvda.ini`, so the mode is spoken. guidepup's `exitFocusMode` is a plain Escape, which NVDA passes to the page in browse mode and which closes the overlay; it is not used inside an overlay. Under VoiceOver this step does nothing. A check holds the overlay still open after this step: in a real run it records its own X0 if the overlay closed, so the walk's X0 names the cause (the change review, finding 6); a dry run checks it too.

### 3. The NVDA helper's click lands on a cover (*the memo* §3; *the review* finding 10)

guidepup's `navigateToWebContent()` clicks `body` at its centre under NVDA, then presses Tab and Escape. `Sr.open()` appends a cover to `<body>` for the helper's duration: a `div`, `position: fixed; inset: 0`, the top `z-index`, transparent, `aria-hidden="true"`, no tab stop, with a click listener that records a hit. It removes the cover after. `Sr.open()` fails as X0 if the URL moved or the cover took no click (under NVDA; under VoiceOver the helper clicks nothing, so only the URL is checked). It records that X0 through `Sr.judge()`, so it lands in `faults.json` and fails the test as a rule's X0 does. A dry run calls no helper and lays no cover, so the check never fires there. The helper's Tab still leaves focus on the page's first tab stop: a test that then `focus()`es that same element hears an empty focus window, which tests must avoid by blurring first (decision 4 does so for T2).

### 4. Tooltip T2 opens the tooltip by its own focus (*the memo* §3)

The helper's Tab and Escape can close the example's tooltip, which is held open at load. T2 blurs first and focuses the trigger, as T1 does, so the tooltip it judges is one the test opened.

### 5. The normalisation turns commas into spaces; a rule may take spoken forms (*the memo* §4; *the review* findings 12 and 13)

- `normalise()` replaces every comma with a space before it collapses whitespace. NVDA joins speech chunks with commas ("Previous, page, button"). No rule's text needs a comma: each expected text is normalised the same way.
- **Spoken forms.** A text a rule looks for may be a list of forms, where a reader says a symbol or key aloud. Each test that needs it states its forms; no rule guesses one. Rules that take a list: L1, L2, L3, L4, F1, U1, B1. L1, L4, F1 and B1 pass if any form is spoken whole. L2 and U1 fault if any form is spoken. L3 faults if two adjacent phrases each hold any form, or if one entry holds a form whole in two of its parts (decision 7). The lists added here: toast S3's whole sentence with "F8" and with "F 8"; sign-up's resend sentence with "ada@example.com" and with "ada at example dot com".

### 6. Four tests expect what the items do (*the memo* §5; *the review* findings 7 and 8)

- **toast S3** expects the example's whole text, title, description and hint, which `026` decision 10 orders, as a spoken-form list (decision 5).
- **toast S6** records that the success toast appeared, then waits, for at most 10 seconds, until it is gone, and records that as a fact (the change review, finding 8), then presses F8, Tab and Escape, and judges the window of the Escape that returns focus. The old test judged a second Escape that moved nothing; judging the first without the wait is a race (*the review*, EXECUTED).
- **pagination P2** removes the status's text from a phrase, not the phrase, before F1 reads.
- **chart C1** takes 25 steps, enough for the name, `004`'s fourteen tick labels, the caption and a header. 25 VoiceOver steps take 4.2 to 5.8 minutes (*the review*), past the suite's 5-minute timeout, so its test has its own 7-minute timeout (8 minutes from `022ad`, 2026-11-17, so a VoiceOver restart still leaves room for the walk) and runs once, with no retry (*the review* finding 17; an exception to decision 10). A failed C1 is read from its phrases, which the walk records whole. The step count is updated in `rules.ts`'s C1 comment and the chart file's header.

### 7. Captures, by reader (*the memo* §6; *the review* findings 5 and 6)

- **NVDA:** one capture for the action and its wait. NVDA's client listens during the action, and a second capture cancels speech mid-window.
- **VoiceOver:** two captures, as now: guidepup polls VoiceOver only after an action ends, so one capture would hear only the window's last phrase. The wait capture's first phrase is dropped when, normalised, it equals the action capture's last phrase: that is the stale repeat that faulted P1 and toast S1 on L3. A real VoiceOver repeat at that join is then not counted. *Amended after the change review* (finding 4): guidepup logs one entry per capture, its parts joined; the drop compares parts, not entries, and removes the longest run of parts at the start of the wait capture's first entry that equals, normalised, the run at the end of the action capture's last entry.
- **L3 within one entry** (*amended after the change review*, finding 2). guidepup joins one capture's speech into one log entry, with ". " between parts. Under NVDA's one capture every window is one entry, so L3, which needs two adjacent entries, could never fault. L3 also faults when one entry holds the message whole twice, in two of its parts. This keeps patch 7 and `double-read` provable under NVDA.
- **The mutation set, stated in advance** (`022` decision 15): patch 7's L3 may no longer be provable under the VoiceOver pairs, since within one VoiceOver capture an identical phrase is logged once. If the next `mutate` dispatch shows it, the four steps of `022` decision 15 follow, `double-read` included, and the landing notes record the outcome.

### 8. Where VoiceOver's cursor was, beside each window (*the memo* §6; *the review* finding 9)

Under VoiceOver, `Sr.listen()` and `Sr.steps()` clear guidepup's item-text log at each window's start and record `itemTextLog()` after it, under the window's name with "item text" appended, in the test's `phrases.json`. It is evidence, not judged. Under NVDA, `itemTextLog()` is the spoken log, so nothing is recorded; NVDA's unknown rows (*the memo* §8) are left to a later change.

### 9. Five VoiceOver shards a browser; NVDA keeps three (*the memo* §9; *the review* finding 11)

`voiceover`'s matrix becomes `shard: [1, 2, 3, 4, 5]`, its test step `--shard=${{ matrix.shard }}/5`. `nvda` keeps three.

- **The split** (*the review*, EXECUTED with `--list`): 19, 17, 19, 16 and 16 tests.
- **Time.** At *the memo*'s 1.69 minutes a test with retries, 19 tests take about 32 minutes, inside `022l`'s 40-minute deadline; at 0.93 without retries, about 18. Shard 1 holds the chart test, so it is counted apart: its 18 other tests at 1.69 take 30.4 minutes, and the chart test's worst case is one 7-minute attempt, 37.4 in all, inside 40. With the chart test's old retries it would be three 7-minute attempts and 51.4, which is why decision 6 takes them away. `022` criterion 22's 20-minute bar is not met with retries; it is re-measured after this change, which removes many retries.
- **Wall time.** Ten VoiceOver jobs on five macOS slots run in two waves, about two shard times and two set-ups after `build`, below run 4's 80 minutes. A `mutate` dispatch run at the same time as a push doubles the waves and can pass the 95 minutes `gate`'s mirror waits: the two should not share the macOS slots.
- The job list grows from 41 to 45, and the CI fixtures take the 45 names.

### 10. What does not change

Not the items, the other rules, the windows' lengths, retries or the ledger. The mutation sets' expectations do not change, except as decision 7 states for patch 7. Patch 6's witness, the sheet's O2 test, can now pass unpatched and fault patched, as `022` decision 15 needs. `022`'s decision 12 table (O2's precondition, C1's 15 steps, the normalisation's steps) is left as the record of that decision; a line under it points to `022q`.

## Scope

- **In:** `tests/sr/rules.ts` (O2's arguments and order; `normalise`; the spoken-form type and the rules that take it; C1's comment); `tests/sr/sr.ts`, the `Sr` class moved out of `fixtures.ts` so a unit test can drive it; `tests/unit/sr-harness.test.ts`, that test; `tests/sr/fixtures.ts` (NVDA's start settings; `open`'s cover and checks; `steps`'s browse mode, trigger, overlay and inside texts, and focused-element record; `listen`'s captures and VoiceOver item text); the eight O2 files (the `open` window and the trigger passed to O2); `toast.sr.ts` S3 and S6; `pagination.sr.ts` P2; `chart.sr.ts`; `tooltip.sr.ts` T2; `sign-up.sr.ts`'s resend; `tests/unit/sr-rules.test.ts`; a browser check for the cover (`tests/e2e/sr-cover.spec.ts`, with the cover in `tests/sr/cover.ts`); `tests/fixtures/pluto-allowed.json`'s `pluto-sandbox` count, which the memo's verbatim alert-dialog phrase raises; `.github/workflows/matrix.yml`'s `voiceover` job; `tests/unit/workflow.test.ts`; the six `tests/fixtures/ci/*.json`; a pointer line in `022`'s decision 12.
- **Out:** the items (`022r` to `022t`); *the memo*'s unknown rows; page-states' client-side navigation; tooltip T1 under NVDA with Firefox; window lengths, retries, the ledger.

## Acceptance criteria

1. `sr-rules.test.ts` holds, with *the memo* §2's walks verbatim as fixtures (VoiceOver's dialog and alert-dialog walks, NVDA's sheet and alert-dialog walks): each passes O2, seen failing first on today's `rules.ts`. *The memo* does not quote their `open` windows: each fixture's `open` window is taken from run 4's job log where it prints one, and otherwise constructed from the item's title and first control and labelled constructed in the test. Guards, passing before and after: a walk that enters, speaks two inside texts, then the sentinel, then end-of-document phrases, faults O2; ten copies of the focused element's phrase with a full `open` window return X0; a walk that speaks only the trigger's name returns X0; an `open` window holding only the overlay's title, then ten copies of the trigger's phrase (the sheet's "Navigation", then "Open navigation button"), returns X0; an `open` window holding the title and the description, then ten copies of the trigger's phrase, returns X0, for the sheet and the alert dialog. Also, seen failing first: `normalise` turns inner commas into spaces; a spoken-form list matches any of its forms under L1 and faults under L2; the VoiceOver join drop removes P1's stale repeat. After the change review, seen failing first on the first build: the change review's three sequences (the sheet's whole `open` window with its focused link, then ten "Open navigation button"; the alert dialog's ten copies of its focused button's phrase holding the title; the alert dialog's ten "Delete project, button" with no inside text before it) return X0, and the walk that ends on the dialog's own "Delete project" with "Cancel" before it passes; `L3(["Copied. Copied"], "Copied")` faults; the VoiceOver join drops a stale repeat when the action capture logged two parts and when a hint follows in the wait capture; "Name" counts as an inside text for a trigger named "Rename project". A unit test drives `Sr` with a fake reader and checks the cover's X0, the per-reader captures, the browse-mode step's three outcomes and the still-open X0 (the change review, finding 5). (unit)
2. `workflow.test.ts` and the six CI fixtures hold 45 jobs, 10 `voiceover` with `shard: [1, 2, 3, 4, 5]` and `--shard=${{ matrix.shard }}/5`, 6 `nvda`; seen failing first on today's workflow. `release-check.test.ts` and `gate.test.ts` pass. (unit)
3. A browser check, seen failing first, in all three engines (Chromium and WebKit here, Firefox from CI's matrix): at 360 on `/view/app-shell/`, a `body` click at the centre with the cover in place keeps the URL and records the cover's hit; without the cover the URL becomes `/`. (e2e)
4. The dry screen-reader run (`SR_DRY=1`) passes every changed test's steps and facts in `chromium` and `webkit`, including S6's wait and a check that the overlay is still open after decision 2's step. (dry)
5. `mutations.test.ts` and `sr-static.test.ts` pass. (unit)
6. In the next `matrix` push run: none of *the memo*'s 18 rule-or-harness rows fails in any pair for the reason the memo gives; every reader shard ends inside its limit; each VoiceOver `phrases.json` holds an "item text" entry beside each window. A row that still fails names its new reason in the landing notes. (CI)
7. The next `mutate` dispatch, run apart from a push, shows the sheet's O2 test faulting O2 under patch 6 in all four pairs; patch 7's VoiceOver outcome is recorded (decision 7). Or the landing notes say why it was not run. (CI)
8. The landing notes record each shard's time, the per-pair counts, and the scorecard's run-log row.

## Landing notes

- **The owner's ruling (2026-11-16):** fix the speech suite first, from options; land the batch (`020c`, `022p`, `022q`, `022r`, `022s`) together.
- **The design lead's rulings during the build (2026-11-16):** the overlay's description leaves "got in" (the build's deviation 2); the stall also passes on VoiceOver's boundary of the overlay (the rebuild's conflict), narrowed at the re-check to "end of" the overlay's name in a dialog (finding 9).
- **The re-check's findings 9 to 12** were written in by the design lead, not the builder, and checked by the change reviewer: three new tests seen failing first (3 of 72), then 72 of 72; the eight unit files 165 pass; `check` and lint clean; the dry run 87 of 87 in Chromium and in WebKit.
- **Criteria 6 to 8** wait for the next `matrix` push run and the `mutate` dispatch.

### The build record

The lane-E builder's notes, as written (`.claude/worktrees/lane-e-speech`, not kept).

- **Date:** 2026-11-16
- **Builder:** the lane-E builder; wrote neither the specification nor its review.
- **Worktree:** `.claude/worktrees/lane-e-speech`, branch `lane-e-speech`, from `release/0.13.0` at `c5cdd65`. Nothing committed.
- **Run here:** Linux, 4 cores, Bun 1.4.4, Playwright 1.64.1, Chromium and WebKit from `/opt/pw-browsers`, against a fresh `bun run build` in the worktree. No Firefox build and no screen reader here, so criteria 6 to 8 wait for CI.

#### Seen failing first

All three were run on today's code before any of the change was built.

1. **`tests/unit/sr-rules.test.ts`** (criterion 1):
   - Run as is, the file does not load: `Export named 'insideTexts' not found`.
   - So a scratch copy of the test ran against today's `rules.ts`, with throwing stubs for the three new exports. Result: **14 fail, 28 pass**, of 42. The 14 are:
     - the comma case;
     - the four spoken-form and join cases;
     - the four memo walks;
     - the inside-texts and last-phrase helpers;
     - two rewritten O2 basics;
     - guard 1 (the call shape differs).
   - The guards' "before" verdicts come from today's O2, called in its own shape (`O2(steps, sentinel, name, inside)`) on the same walks:
     - memo VoiceOver dialog → X0, "no step spoke the overlay's name";
     - memo VoiceOver alert-dialog → X0, "2 distinct phrases";
     - memo NVDA sheet → X0, "no step spoke the overlay's name";
     - memo NVDA alert-dialog → X0, "1 distinct phrases";
     - guard 1, the leaking walk → **O2**;
     - guards 2, 3 and 4 → **X0**.
   - So all four memo walks failed first, and all four guards give the same verdict before and after.
2. **`tests/unit/workflow.test.ts`** (criterion 2), with `release-check.test.ts` and `gate.test.ts`: **3 fail, 52 pass**. The three that failed:
   - five shards for VoiceOver;
   - 45 job names;
   - the six fixtures hold the workflow's names. This test is new, added so the fixtures are seen failing too.
3. **`tests/e2e/sr-cover.spec.ts`** (criterion 3), with `cover.ts` as a no-op stub, as today has no cover:
   - "with the cover" fails 2 of 2 (chromium-light, webkit-light). The URL is `/`, not `/view/app-shell/`.
   - "without the cover" passes 2 of 2. That is the defect, reproduced.

#### Gate

| Check | Result |
|---|---|
| `bun run check` | 2431 files, 0 errors, 0 warnings |
| `bun run lint` (the only lint script) | all files pass Prettier |
| `bun run test:unit` | 1876 pass, 2 skip, **1 fail**: `highlight-session.test.ts`'s streaming budget (4 ms a chunk). It is not touched by this change. It failed in both full runs, with the machine shared by other agents (load 3.5 on 4 cores). Run alone it passes, 10 of 10, twice. |
| `mutations`, `sr-static`, `release-check`, `gate`, `workflow`, `sr-rules` | 129 pass, 0 fail, 772 expects |
| cover e2e | 8 of 8: chromium-light, chromium-dark, webkit-light and webkit-dark, both tests each. Firefox is left to CI. |
| dry run, `SR_DRY=1 bun run test:sr --project=chromium` | **87 of 87 pass** (the whole suite, since `fixtures.ts` changes every test) |
| dry run, `--project=webkit` | **87 of 87 pass** |
| `--list --shard=k/5`, VoiceOver, WebKit | 19, 17, 19, 16 and 16 tests; the chart test is in shard 1 |

**Probes: proof that the new dry facts can fail.** Each ran in a throwaway `.sr.ts` file, deleted after.

- **The overlay check.** A sheet closed by Escape before `steps()` fails the dry run, on "the overlay is still open when the walk begins". The check is live.
- **S6's locator.** `[data-slot="toast"][data-kind="success"]` matches the success toast (count 1). The toast is gone after 6,447 ms. One action toast is then left. S6 itself took 7.1 s (Chromium) and 7.3 s (WebKit) dry.
- **The chart's per-file settings.** `test.describe.configure({ retries: 0, timeout: 7 * 60_000 })`, under a forced `--retries=2`: one attempt only, at `timeout=420000`.

#### What the build decided that the specification did not state

1. **An overlay text is an element's `aria-label` where it has one, else its `textContent`.** The dialog's and the sheet's close buttons have no text: they are named only by `aria-label="Close"`. Two memo walks end on "Close button" and "button, Close": VoiceOver's dialog walk and NVDA's sheet walk. Under "visible text" alone, neither would pass the stall check, and criterion 1 requires both to pass. The review's re-check also reads them as ending on "Close".
2. **Overlay texts are 3 characters or more,** the old lower bound. The old 60-character limit and 12-text cap are gone. The old filter, which dropped texts the page behind also shows, is gone, as decision 1 says.
3. **"Moved" leaves out the focused element's own texts.** Those are the inside texts (overlay texts, before the change review) the focused element's text equals or contains, compared normalised. For a link inside a list item, the `li`'s text is the link's own.
4. **"The overlay's own name" is both the name the test passes and the DOM's title** (`aria-labelledby` text, else `aria-label`). Each is left out of the inside texts. They are equal on all eight pages today. Patch 2 removes the title's link, and then only the test's name remains.
5. **Signatures.**
   - O2 is now `O2(open, steps, sentinel, name, overlay)`.
   - `Overlay` is `{ trigger, title, descriptions, texts, focused }`.
   - After the change review, O2 takes a sixth argument, `back`, the `previous()` step's phrases (`sr.back`).
   - `Sr.steps(n, { trigger, name })` fills `sr.overlay`.
   - `rules.ts` gains three pure helpers, unit-tested: `insideTexts`, `lastStepPhrase` and `joinCaptures`.
   - The spoken-form type is `Spoken = string | readonly string[]`. L1 to L4, F1, U1 and B1 take it. B1 reads `then` where its first spoken form falls.
6. **The VoiceOver join** worked on whole log entries in the first build. After the change review it compares parts (see below).
7. **Captures for the other readers.** Orca (the rehearsal) and a dry run keep two captures, with no drop. Decision 7 names only NVDA and VoiceOver.
8. **The cover lives in its own file, `tests/sr/cover.ts`, which imports nothing.** (After the change review, `Sr` moves to its own file too, `tests/sr/sr.ts`, for the same reason; see below.) The e2e check can then import it without `fixtures.ts`. That file's module-level `reader()` throws in CI when `SR_READER` is unset, as it is in the browser jobs.
9. **The window names in `phrases.json`.**
   - Each window gets `<window>: item text` beside it, under VoiceOver only.
   - The walk gets `steps: overlay`, `steps: focused` and, under NVDA, `steps: browse mode`, which holds what NVDA+Space announced.
   - The old `steps: inside` is gone.
   - `scripts/ci/report.ts` passes `phrases.json` through whole, so nothing else reads these names.
10. **The overlay-still-open check** is a `sr.fact`, judged in a dry run. After the change review (finding 6) it also records its own X0 in a real run.
11. **`open`'s X0 under VoiceOver.** Only the URL is checked, as decision 3 says. The test fails at once, through `judge()`.
12. **The S6 title changed.** It is now "S6 Escape: once the success toast is gone, F8, Tab, Escape returns to the trigger, which is spoken". The old title said "Escape twice". No ledger line and no mutation entry names S6. S6's "into" window is F8 and Tab; the judged window is the Escape.
13. **P2** removes the normalised "Page 12 of 12" from each phrase before F1 reads.
14. **`dialog.sr.ts`** gains a `TRIGGER` constant, equal to its title.
15. **Outside the Scope list: `tests/fixtures/pluto-allowed.json`.** Its `pluto-sandbox` count goes from 15 to 17. Criterion 1's verbatim VoiceOver phrase holds the example project's name, so the rename guard (`rename.test.ts`) counts it. The test file uses the literal twice: one constant, and the memo's phrase.
16. **The fixtures' `open` windows are constructed.** Run 4's job logs were not available to this build. Each is built from the item's title and its first control, and labelled "constructed" in the test. The overlay data (texts, title, focused element) was read from the built example pages' DOM, in Chromium.

#### The description leaves "got in" (the design lead's ruling, 2026-11-16)

**The finding.** The build first followed decision 1 as written, so the overlay's `aria-describedby` description counted as an inside text. A reader announces the description on opening, as it does the title, wherever its cursor stays. On that build:

- **The sheet.** An `open` window of "Navigation, dialog, Where to go next.", then ten "Open navigation button" steps, **passed** O2 (`[]`).
- **The alert dialog.** Its title and description, then ten "Delete project, button" steps, also **passed**.

The reader never got in. Six of the eight overlays have a description.

**The ruling, now in decision 1.** The description leaves "got in", as the title does. It still counts for "moved" and the stall.

**Seen failing first.** Three cases were added to `sr-rules.test.ts`:

- the two guards above, each expecting X0;
- the inside-texts case, updated so the description is left out.

On the build before the fix: **3 fail, 41 pass**, of 44.

**The fix.**

- `Overlay` gains `descriptions`, the overlay's `aria-describedby` texts.
- `insideTexts` leaves them out, with the trigger's name and the overlay's name.
- `steps()` reads them from the DOM.

A throwaway dry probe read, in Chromium:

- the alert dialog: descriptions `["Its 412 runs and their logs are deleted. This cannot be undone."]`, inside texts `["Cancel"]`;
- the sheet: descriptions `["Where to go next."]`, inside texts `["Overview", "Components", "Blocks", "Changelog", "Close"]`.

**After the fix:**

- `sr-rules.test.ts`: **44 of 44 pass**, the four memo walks included. Each still gets in through "Cancel", "Cancel", "Overview" or "Components".
- The six named unit files: 131 pass, 0 fail, 774 expects. `rename.test.ts`: 6 of 6.
- `bun run check`: 2431 files, 0 errors, 0 warnings. `bun run lint`: passes.
- The dry run of the eight O2 files: Chromium **32 of 32**, WebKit **32 of 32**.

#### Rebuilt after the change review (2026-11-16)

The change review (`reviews/022q-the-speech-suites-own-faults-pr-2026-11-16.md`) found 2 High, 2 Medium and 4 Low faults. The design lead amended the specification. This rebuild follows it, finding by finding. Tests were written first and run on the first build.

##### Seen failing first, on the first build

- **`sr-rules.test.ts`: 8 fail, 46 pass, of 54.** The eight:
  - L3 within one entry, twice ("Copied. Copied"; toast S3's sentence, which holds its own full stops);
  - the join, twice (a two-part action entry; a hint after the stale phrase in the wait entry);
  - the review's three sequences that never walked, each expecting X0;
  - "Name" staying an inside text for the trigger "Rename project".
- Two new cases passed on the first build, as they should:
  - the walk that ends on the dialog's own "Delete project", with "Cancel" before it (it must pass);
  - a join guard (a wait entry that only begins like the action's).
- **`sr-harness.test.ts`, the new fake-reader test of `Sr`:**
  - As written, it does not load: `tests/sr/sr.ts` did not exist.
  - A scratch copy ran against the first build's `Sr` in `fixtures.ts`. That build fixes the reader at module load, so each run picked it with `SR_READER`. Under `SR_READER=nvda`: **10 fail, 3 pass**, of 13. Under `voiceover`: **10 fail, 3 pass**.
  - Some of those failures are only the reader being fixed per run, which is finding 5 itself. The browse-mode, still-open, back-step and two-part-join cases fail in both runs.

##### What changed, by finding

1. **NVDA's mode is spoken.**
   - Under NVDA only, `fixtures.ts` starts the reader with `{ capture: true, settings: { virtualBuffers: { passThroughAudioIndication: false } } }`.
   - READ, `@guidepup/guidepup` 0.40.0, `lib/windows/NVDA/NVDA.js`, in `start()`:

     ```js
     (0, config_1.createGuidepupConfig)();
     if (options?.settings) {
         (0, config_1.setConfig)(options.settings);
     }
     ```

   - READ, `config/setConfig.js`: `const updatedConfig = (0, deepMerge_1.deepMerge)(config, desiredConfig);`, then `writeFileSync` of `buildIni(updatedConfig)` to the session's `nvda.ini`.
   - READ, `buildIni.js`: a boolean is written `True` or `False`, and a nested object becomes a `[section]`. So the ini gets `[virtualBuffers]` with `passThroughAudioIndication = False`.
   - READ, `@guidepup/playwright` 0.21.0, `screenReaderTest.js`: `await screenReaderPlaywright.start(screenReaderStartOptions);`.
   - VoiceOver gets `{ capture: true }` only. Its `start()` also applies `settings` (`setPreferences(options.settings)`, `VoiceOver.js:374–375`), and an NVDA key there would be written into VoiceOver's own preferences.
   - If the browse-mode step hears neither "focus mode" nor "browse mode", it records X0 through `judge()`.
   - No `.sr.ts` file expects a text holding "mode", so NVDA's spoken automatic mode changes meet no rule.
2. **L3 within one entry.** L3 also faults when one entry holds the message whole twice: two places that do not overlap, with a part boundary (".") between them, compared normalised and over every spoken form.
3. **O2, "moved" and the stall.**
   - "Moved": a step speaks an inside text other than the focused element's, or the trigger's name.
   - The stall: the last step's phrase must hold an inside text or the trigger's name.
   - If it holds the trigger's name and no inside text, `steps()` takes one `previous()` step after the walk, recorded as `<name>: back` and `sr.back`. That step must speak an inside text, else X0.
   - `rules.ts` exports `needsBack()` for that decision. `steps()` calls it with the DOM's title as the overlay's name.
   - The eight O2 files pass `sr.back` as O2's sixth argument.
   - The review's three sequences return X0. Their `previous()` phrase is constructed: the element before the trigger in `<main>` is the first sentinel. The walk ending on the dialog's own "Delete project", with "Cancel" before it, passes.
   - The memo's NVDA alert-dialog walk now needs its `previous()` step. Its fixture adds one, labelled constructed: "button, Cancel".
4. **The VoiceOver join compares parts.** It drops the longest run of parts (split on ". ") at the start of the wait capture's first entry that equals, normalised, the run at the end of the action capture's last entry. What is left of that entry is kept.
5. **`Sr` driven by a fake reader.**
   - `Sr` and `readOverlay` move from `fixtures.ts` to a new file, `tests/sr/sr.ts`. The reader and the dry mode are passed in as `SrOptions`.
   - The move is needed because `fixtures.ts` resolves the reader at module load, and that throws in CI's `checks` job, which has no `SR_READER`. EXECUTED: `CI=1` importing `fixtures.ts` → "SR_READER must be …".
   - `fixtures.ts` re-exports `Sr` and `READY`, so no test file's import changes.
   - `tests/unit/sr-harness.test.ts` is new: 13 cases. A fake page runs the suite's in-page functions by their identity. A fake reader logs one entry for each capture, command or step.
6. **The still-open check** records its own X0 in a real run ("the overlay closed before the walk").
7. **Trigger-name containment is by whole words.**
8. **S6** records "the success toast appeared on the raise". That is read inside the raise action, so the toast's own 6 s cannot run out first. Then S6 waits for the toast to go.

Also: the fake-reader test's alert dialog is titled "Delete this project?", so `pluto-allowed.json` stays at 17.

##### Not built: a conflict in the amended specification (since ruled; see "The boundary ruling, built")

**The memo's VoiceOver alert-dialog walk now returns X0.** Criterion 1 still requires it to pass, so the amended decision 1 contradicts criterion 1.

- The walk: "Delete project button", "end of Delete pluto-sandbox? … alert dialog", then eight empty entries.
- The amended stall counts only inside texts and the trigger's name, and the title is neither. So the last phrase, "end of … alert dialog", no longer counts as ending inside. EXECUTED:

  ```
  X0: the last step's phrase ("end of Delete pluto-sandbox? … alert dialog") holds no inside text and not the trigger's name, so the walk did not end inside
  ```

- The change review's own fix changed only "moved". It inferred that the four memo walks still pass. The amendment changed the stall as well.
- I left the test as criterion 1 states it, so it fails. I did not change the rule.
- Two ways out, for the design lead:
  - (a) The stall also counts the overlay's title and description, as in the first build. "Moved" stays strict, and the `previous()` step is still taken when the last phrase holds only the trigger's name. The review's three sequences still return X0, since each fails at "moved" or at the `previous()` step.
  - (b) Criterion 1 accepts that VoiceOver's "end of … dialog" proves nothing, and expects X0 for that walk.

##### Gate, after the rebuild

| Check | Result |
|---|---|
| `sr-rules.test.ts` | **53 pass, 1 fail**: the VoiceOver alert-dialog memo walk, the conflict above. The other three memo walks pass. |
| `sr-harness.test.ts` | **13 of 13 pass** |
| The six named unit files, with `rename.test.ts` and `sr-harness.test.ts` | **159 pass, 1 fail** (the conflict above), 1132 expects |
| `bun run check` | 2433 files, 0 errors, 0 warnings |
| `bun run lint` | passes |
| cover e2e, chromium-light and webkit-light | **4 of 4 pass** |
| dry run, chromium | **87 of 87 pass** |
| dry run, webkit | **87 of 87 pass** |

#### The boundary ruling, built (2026-11-16)

**The ruling, now in decision 1, step 4.** The last phrase also proves the stall when it is VoiceOver's boundary of the overlay: it begins "end of" (normalised) and holds the overlay's name. The title alone does not prove it. This resolves the conflict above; neither (a) nor (b) was taken.

**Tests, written first.** Two guards were added to `sr-rules.test.ts`, beside the memo walk that already failed:

- a sheet walk that gets in and moves, then ends on "Open navigation button" (title "Navigation"), with no `previous()` inside text, once with no back step and once with the sentinel: X0;
- an alert-dialog walk that ends on "end of main", which is not the overlay's name, with no inside text: X0.

**Seen failing first.** On the rebuild, before the fix: **55 pass, 1 fail**, of 56. The one is the memo's VoiceOver alert-dialog walk. The two guards already gave X0, as they should.

**Probes: proof the guards can fail.** Each ran on a throwaway edit of `isBoundary`, restored after.

- The title alone, without "end of": **2 fail**, the first guard and the change review's sheet guard.
- "end of" alone, without the name: **1 fail**, the "end of main" guard.

**The fix, in `tests/sr/rules.ts`.**

- A new private helper, `isBoundary(phrase, overlay, name)`: the normalised phrase begins "end of " and holds `name` or the DOM's title (deviation 4: both are the overlay's own name).
- `stall()` gains `boundary`. O2 passes the stall on `inside || boundary`.
- `needsBack()` is false on a boundary, so `steps()` takes no `previous()` step after one.
- O2's last X0 message adds "and is not VoiceOver's end of the overlay".

##### Gate, after the boundary ruling

| Check | Result |
|---|---|
| `sr-rules.test.ts` | **56 of 56 pass**, the four memo walks included |
| `sr-harness.test.ts` | **13 of 13 pass** |
| The six named unit files (mutations, sr-static, release-check, gate, workflow, sr-rules) | **143 pass, 0 fail**, 792 expects |
| `rename.test.ts` | **6 of 6 pass** |
| `bun run check` | 2433 files, 0 errors, 0 warnings |
| `bun run lint` | passes |
| dry run, chromium | **87 of 87 pass** |
| dry run, webkit | **87 of 87 pass** |

#### Not done here

- Criteria 6 to 8 are CI: the next push run, the `mutate` dispatch, and the shard times and scorecard row.
- Firefox, for the cover check and the dry run: CI's matrix runs it.
- The benchmark scorecard re-run, which follows landing.

### Criteria 6 to 8, read from runs 5 and 6 (2026-11-17)

Runs 5 (`43974619830`, on `fd18383`) and 6 (`43974717942`, on `b01e754`) carry this change on identical code (`research/2026-11-17-the-fifth-matrix-run.md`, §§1–9).

- **Criterion 6: not met.** None of the speech memo's 18 rule-or-harness rows fails for the memo's reason in either run (16 pass everywhere; the chart fails under VoiceOver for two new reasons, C2 reading the table and, in run 6, the WebKit walk stopping on "image"). Every VoiceOver window printed has its "item text" beside it. But `voiceover (chromium, 2)` hit its 40-minute deadline in both runs, with 9 tests not run, because the dropdown-menu sub-menu wait hung 3 × 10 minutes. `022x` bounds that wait.
- **Criterion 7: not yet run.** No `mutate` dispatch has run since this landed. `022z` and `019b` set a window in which patches 4 and 7b are not provable; the first dispatch after `019b` records them.
- **Criterion 8:** the shard times and per-pair counts are in the memo, §3 and §9.4: NVDA 11.5 to 18.1 minutes, VoiceOver 17.7 to 32.5 (run 5); run 6's VoiceOver jobs waited 43 to 88 minutes for macOS slots because two pushes a minute apart shared them. The scorecard row is the batch's that carries `022x`.

### Criterion 6's second clause, read from run 7 (2026-11-17)

Met in run 7: all 16 reader shards ended inside 40 minutes, the longest VO wk 1 at 29.5; VO chr 2 took 25.7, after `022x` bounded the dropdown wait (`research/2026-11-17-the-seventh-matrix-run.md`).

