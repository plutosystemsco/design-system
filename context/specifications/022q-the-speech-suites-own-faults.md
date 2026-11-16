# 022q — The speech suite's own faults

- **Status:** written 2026-11-16; waits for its specification review.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** a change to `022`'s screen-reader rules, fixture and tests, and to the reader jobs' shard count (lane E): `tests/sr/rules.ts`, `tests/sr/fixtures.ts`, the `.sr.ts` files named below, `tests/unit/sr-rules.test.ts`, `.github/workflows/matrix.yml`, and the CI fixtures that list the job names. No item, token or dependency changes. A specification, not a small change, because it changes rules `022` decided (decisions 12 to 15) and the owner chose to fix the suite before anything else (2026-11-16).
- **Depends on:** `022`, `022l`.
- **Research it stands on:** [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md), cited as *the memo*, by section; [the fourth matrix run](../research/2026-11-16-the-fourth-matrix-run.md).
- **Not in scope:** the memo's item faults (§7), built as the small changes `022r`, `022s` and `022t` in lane I; its unsettled cases (§8), which this change helps settle but does not fix.

## Intent

Run 4 gave the first speech verdicts: 82 failed runs over 33 tests. *The memo* traces 51 of them to the suite itself: a rule's preconditions, a helper that changes the page, wording the normalisation does not absorb, tests that expect the wrong thing, and a capture that logs one phrase twice. This change fixes those, so that a failed speech test means the item failed. It also gives VoiceOver the shards its pace needs, and it records where VoiceOver's cursor was beside each window, so the 23 unknown runs can be read next time.

## Decisions

### 1. O2 reads its preconditions from the opening and the walk together (*the memo* §2)

O2 still faults only if the sentinel is spoken in the steps. Its preconditions change:

- **The overlay's name** may be spoken in the `open` window or in the steps. The name is spoken when a modal opens; a forward walk from the first tabbable element never meets the title again (reason 1). `O2` takes the `open` window's phrases as a new argument.
- **Inside texts are found by DOM containment.** `Sr.steps()` records the visible texts of elements inside the overlay, whatever the page behind shows, except the trigger's own accessible name. One of them must be spoken in the `open` window or the steps. The old rule dropped any text the page also shows, which left alert-dialog and the delete confirm one text, the button the walk starts from (reason 2). The trigger's name stays excluded, so a reader that never left the trigger still meets no precondition: that was the old filter's purpose (`022` Q9).
- **A walk that stops at the overlay's end is contained.** The three-distinct-phrases precondition becomes: at least two distinct phrases across the `open` window and the steps, and the last step's phrase holds an inside text. A contained reader repeats the overlay's last element (reason 3); a reader that never moved speaks one phrase and fails the precondition.

### 2. The walk starts in browse mode (*the memo* §2, reason 4)

`Sr.steps()` asks the reader to leave focus mode before its first `next()`. Under NVDA this is guidepup's own exit from focus mode; under VoiceOver it does nothing. In the dialog, NVDA was in focus mode in the Name field, and its ten Down Arrows re-read the field's value.

### 3. The NVDA helper's click cannot leave the page (*the memo* §3)

guidepup's `navigateToWebContent()` clicks the centre of `<body>` under NVDA and presses Tab and Escape. `Sr.open()` covers the viewport with a transparent test element for the helper's duration, so the click lands on nothing the page owns, and removes it after. Then it checks that the URL is the one it opened; if not, the test fails as X0, "the reader's helper left the page". The cover is test code, injected, like O2's sentinel.

### 4. Tooltip T2 opens the tooltip by its own focus (*the memo* §3)

The helper's Tab and Escape can close the example's tooltip before the test acts. T2 blurs first and focuses the trigger, as T1 does, so the tooltip it judges is one the test opened.

### 5. The normalisation drops every comma; a test may name a reader's spoken form (*the memo* §4)

- `normalise()` drops every comma, not only a final mark. NVDA joins speech chunks with commas ("Previous, page, button").
- A text a rule looks for may be a list of spoken forms, any one of which counts, where a reader says a symbol or key aloud: "ada@example.com" or "ada at example dot com"; "F8" or "F 8". Each test that needs it lists its forms beside the text. No rule guesses a spoken form.

### 6. Four tests expect what the items do (*the memo* §5)

- **toast S3** expects the example's whole text, title, description and hint, which `026` decision 10 orders.
- **toast S6** judges the window in which focus returns: the first Escape, after F8 and Tab, which is when the action toast closes.
- **pagination P2** removes the status's text from a phrase, not the phrase, before F1 reads, so a phrase that also holds the focus announcement is still read.
- **chart C1** takes 25 steps, enough for the name, `004`'s fourteen tick labels, the caption and a header.

### 7. One capture per window (*the memo* §6)

`Sr.listen()` makes one guidepup capture for the action and its wait, not two. VoiceOver's second capture logged its stale last phrase as new after 0.6 s, which faulted P1 and toast S1 on L3. NVDA's logged an empty phrase.

### 8. Where the cursor was, beside each window (*the memo* §6, §8)

After each window, `Sr.listen()` and `Sr.steps()` also record guidepup's `itemTextLog()`, under the window's name with "item text" appended, in the test's `phrases.json`. It is evidence, not judged. It says where VoiceOver's or NVDA's cursor was, so a missing focus announcement can be told from a missing poll.

### 9. Five VoiceOver shards a browser; NVDA keeps three (*the memo* §9)

`voiceover`'s matrix becomes `shard: [1, 2, 3, 4, 5]` and its test step `--shard=${{ matrix.shard }}/5`. `nvda` keeps three. *The memo* measured VoiceOver at 1.6 minutes a test with retries and 0.9 without, so five shards of 17 or 18 tests take about 15 to 28 minutes. The job list grows from 41 to 45, and the CI fixtures take the 45 names. VoiceOver's ten jobs on five macOS slots run in two rounds; `022l`'s landing notes on concurrency apply, with ten in place of six.

### 10. Nothing else changes

Not the items, the other rules, the windows' lengths, retries, the ledger or the mutation sets' expectations, except that patch 6's witness (the sheet's O2 test) can now pass unpatched, as `022` decision 15 needs.

## Acceptance criteria

1. `sr-rules.test.ts` holds, each case seen failing first on today's `rules.ts`: O2 passes a contained walk whose name is only in the `open` window; O2 passes a walk that repeats the overlay's last element; O2 still returns X0 for a walk of one phrase that holds no inside text, and for one that spoke only the trigger's name; O2 still faults when the sentinel is spoken; `normalise` drops inner commas; a spoken-form list matches any of its forms. (unit)
2. `workflow.test.ts` and the CI fixtures hold 45 jobs, 10 `voiceover` with `shard: [1, 2, 3, 4, 5]` and `--shard=${{ matrix.shard }}/5`, 6 `nvda`; seen failing first on today's workflow. `release-check.test.ts` and `gate.test.ts` pass. (unit)
3. The dry screen-reader run (`SR_DRY=1`) passes every changed test's steps and facts in `chromium` and `webkit`, and shows the cover removed and the URL unchanged after `open`. (dry)
4. `mutations.test.ts` and `sr-static.test.ts` pass. (unit)
5. In the next `matrix` push run: none of the 18 rule-or-harness rows of *the memo*'s closing table fails in any pair for the reason the memo gives; every reader shard ends inside its limit; each `phrases.json` holds an "item text" entry beside each window. A row that still fails names its new reason in the landing notes. (CI)
6. The landing notes record each shard's time, the per-pair counts, and the scorecard's run-log row.

## Landing notes

(To be filled when it lands.)
