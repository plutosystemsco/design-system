# 022q — The speech suite's own faults

- **Status:** rewritten 2026-11-16 after its specification review (`reviews/022q-the-speech-suites-own-faults-spec-2026-11-16.md`, 15 findings, 5 High), and again after its re-check (findings 16 to 18). The second re-check, 2026-11-16: fit to build. In build (lane E).
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
2. **Moved.** `steps()` records the accessible text of the element focused when the walk begins. A step speaks an overlay text other than that element's. Otherwise X0. Movement is proven by the steps alone: the `open` window always holds speech once focus lands inside, so it cannot prove a walk.
3. **The sentinel.** If a step speaks the sentinel, O2 faults. A non-modal overlay (mutation patch 6) faults here, before any stall evidence is asked for.
4. **The stall.** Otherwise the last step's phrase must hold an overlay text: the walk ended inside. Otherwise X0. "The last step's phrase" is the last non-empty step entry that is not a VoiceOver hint (a phrase beginning "You are currently on").

**Inside texts and overlay texts.** `steps(n, { trigger })` takes the trigger's accessible name. *Overlay texts* are the visible texts of elements inside the overlay found by DOM containment: `h1`–`h4`, `[role="heading"]`, `p`, `label`, `button`, `a`, `li`, and the elements the overlay's `aria-labelledby` and `aria-describedby` name. bits-ui renders a dialog's title and description as `div`s, so the old selector missed them (*the review* finding 3). *Inside texts* are the overlay texts less three kinds: the trigger's name; the overlay's own name (its `aria-labelledby` text, the title); and any text the trigger's name contains, compared normalised. A reader announces the title as the overlay opens, wherever its cursor stays, and a phrase on the trigger holds every word of the trigger's name: neither proves the cursor went in (*the review* finding 16, the sheet's "Navigation" inside "Open navigation"). The old filter, which dropped any text the page also shows, goes: it left alert-dialog and the delete confirm one text. These stay out of "got in", so a reader that never left the trigger meets no precondition, which was the old filter's purpose (`022` Q9). It counts for "moved" and "the stall": a forward walk cannot reach the real trigger from inside without passing the first sentinel, which sits before it in `<main>`.

O2 takes the `open` window's phrases as a new argument, and the overlay's name.

### 2. The walk starts in browse mode, by a key NVDA keeps (*the memo* §2; *the review* finding 4)

Under NVDA, `steps()` presses NVDA+Space (guidepup's `toggleBetweenBrowseAndFocusMode`) inside a capture, reads what NVDA announces, and presses it again if that says "focus mode". Then it clears the log. guidepup's `exitFocusMode` is a plain Escape, which NVDA passes to the page in browse mode and which closes the overlay; it is not used inside an overlay. Under VoiceOver this step does nothing. A dry check holds the overlay still open after this step.

### 3. The NVDA helper's click lands on a cover (*the memo* §3; *the review* finding 10)

guidepup's `navigateToWebContent()` clicks `body` at its centre under NVDA, then presses Tab and Escape. `Sr.open()` appends a cover to `<body>` for the helper's duration: a `div`, `position: fixed; inset: 0`, the top `z-index`, transparent, `aria-hidden="true"`, no tab stop, with a click listener that records a hit. It removes the cover after. `Sr.open()` fails as X0 if the URL moved or the cover took no click (under NVDA; under VoiceOver the helper clicks nothing, so only the URL is checked). It records that X0 through `Sr.judge()`, so it lands in `faults.json` and fails the test as a rule's X0 does. A dry run calls no helper and lays no cover, so the check never fires there. The helper's Tab still leaves focus on the page's first tab stop: a test that then `focus()`es that same element hears an empty focus window, which tests must avoid by blurring first (decision 4 does so for T2).

### 4. Tooltip T2 opens the tooltip by its own focus (*the memo* §3)

The helper's Tab and Escape can close the example's tooltip, which is held open at load. T2 blurs first and focuses the trigger, as T1 does, so the tooltip it judges is one the test opened.

### 5. The normalisation turns commas into spaces; a rule may take spoken forms (*the memo* §4; *the review* findings 12 and 13)

- `normalise()` replaces every comma with a space before it collapses whitespace. NVDA joins speech chunks with commas ("Previous, page, button"). No rule's text needs a comma: each expected text is normalised the same way.
- **Spoken forms.** A text a rule looks for may be a list of forms, where a reader says a symbol or key aloud. Each test that needs it states its forms; no rule guesses one. Rules that take a list: L1, L2, L3, L4, F1, U1, B1. L1, L4, F1 and B1 pass if any form is spoken whole. L2 and U1 fault if any form is spoken. L3 faults if two adjacent phrases each hold any form. The lists added here: toast S3's whole sentence with "F8" and with "F 8"; sign-up's resend sentence with "ada@example.com" and with "ada at example dot com".

### 6. Four tests expect what the items do (*the memo* §5; *the review* findings 7 and 8)

- **toast S3** expects the example's whole text, title, description and hint, which `026` decision 10 orders, as a spoken-form list (decision 5).
- **toast S6** waits, for at most 10 seconds, until the success toast is gone, and records that as a fact, then presses F8, Tab and Escape, and judges the window of the Escape that returns focus. The old test judged a second Escape that moved nothing; judging the first without the wait is a race (*the review*, EXECUTED).
- **pagination P2** removes the status's text from a phrase, not the phrase, before F1 reads.
- **chart C1** takes 25 steps, enough for the name, `004`'s fourteen tick labels, the caption and a header. 25 VoiceOver steps take 4.2 to 5.8 minutes (*the review*), past the suite's 5-minute timeout, so its test has its own 7-minute timeout and runs once, with no retry (*the review* finding 17; an exception to decision 10). A failed C1 is read from its phrases, which the walk records whole. The step count is updated in `rules.ts`'s C1 comment and the chart file's header.

### 7. Captures, by reader (*the memo* §6; *the review* findings 5 and 6)

- **NVDA:** one capture for the action and its wait. NVDA's client listens during the action, and a second capture cancels speech mid-window.
- **VoiceOver:** two captures, as now: guidepup polls VoiceOver only after an action ends, so one capture would hear only the window's last phrase. The wait capture's first phrase is dropped when, normalised, it equals the action capture's last phrase: that is the stale repeat that faulted P1 and toast S1 on L3. A real VoiceOver repeat at that join is then not counted.
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

- **In:** `tests/sr/rules.ts` (O2's arguments and order; `normalise`; the spoken-form type and the rules that take it; C1's comment); `tests/sr/fixtures.ts` (`open`'s cover and checks; `steps`'s browse mode, trigger, overlay and inside texts, and focused-element record; `listen`'s captures and VoiceOver item text); the eight O2 files (the `open` window and the trigger passed to O2); `toast.sr.ts` S3 and S6; `pagination.sr.ts` P2; `chart.sr.ts`; `tooltip.sr.ts` T2; `sign-up.sr.ts`'s resend; `tests/unit/sr-rules.test.ts`; a browser check for the cover; `.github/workflows/matrix.yml`'s `voiceover` job; `tests/unit/workflow.test.ts`; the six `tests/fixtures/ci/*.json`; a pointer line in `022`'s decision 12.
- **Out:** the items (`022r` to `022t`); *the memo*'s unknown rows; page-states' client-side navigation; tooltip T1 under NVDA with Firefox; window lengths, retries, the ledger.

## Acceptance criteria

1. `sr-rules.test.ts` holds, with *the memo* §2's walks verbatim as fixtures (VoiceOver's dialog and alert-dialog walks, NVDA's sheet and alert-dialog walks): each passes O2, seen failing first on today's `rules.ts`. *The memo* does not quote their `open` windows: each fixture's `open` window is taken from run 4's job log where it prints one, and otherwise constructed from the item's title and first control and labelled constructed in the test. Guards, passing before and after: a walk that enters, speaks two inside texts, then the sentinel, then end-of-document phrases, faults O2; ten copies of the focused element's phrase with a full `open` window return X0; a walk that speaks only the trigger's name returns X0; an `open` window holding only the overlay's title, then ten copies of the trigger's phrase (the sheet's "Navigation", then "Open navigation button"), returns X0. Also, seen failing first: `normalise` turns inner commas into spaces; a spoken-form list matches any of its forms under L1 and faults under L2; the VoiceOver join drop removes P1's stale repeat. (unit)
2. `workflow.test.ts` and the six CI fixtures hold 45 jobs, 10 `voiceover` with `shard: [1, 2, 3, 4, 5]` and `--shard=${{ matrix.shard }}/5`, 6 `nvda`; seen failing first on today's workflow. `release-check.test.ts` and `gate.test.ts` pass. (unit)
3. A browser check, seen failing first, in all three engines (Chromium and WebKit here, Firefox from CI's matrix): at 360 on `/view/app-shell/`, a `body` click at the centre with the cover in place keeps the URL and records the cover's hit; without the cover the URL becomes `/`. (e2e)
4. The dry screen-reader run (`SR_DRY=1`) passes every changed test's steps and facts in `chromium` and `webkit`, including S6's wait and a check that the overlay is still open after decision 2's step. (dry)
5. `mutations.test.ts` and `sr-static.test.ts` pass. (unit)
6. In the next `matrix` push run: none of *the memo*'s 18 rule-or-harness rows fails in any pair for the reason the memo gives; every reader shard ends inside its limit; each VoiceOver `phrases.json` holds an "item text" entry beside each window. A row that still fails names its new reason in the landing notes. (CI)
7. The next `mutate` dispatch, run apart from a push, shows the sheet's O2 test faulting O2 under patch 6 in all four pairs; patch 7's VoiceOver outcome is recorded (decision 7). Or the landing notes say why it was not run. (CI)
8. The landing notes record each shard's time, the per-pair counts, and the scorecard's run-log row.

## Landing notes

(To be filled when it lands.)
