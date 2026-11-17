# 022z — L3 learns VoiceOver's doubled phrase

- **Status:** fit to build (the spec review's re-check, 2026-11-17); builds in lane E once `022x` lands, since both edit `tests/sr/rules.ts`. The re-check's write-in for the landing notes: a third mutation, dropping only the hyphen from a word, fails the "Re-enter" guard alone. The review (`reviews/022z-l3-learns-voiceovers-doubled-phrase-spec-2026-11-17.md`) raised 3 Medium and 4 Low findings; each is answered under "Review".
- **Date:** 2026-11-17
- **Author:** the design lead
- **Kind:** specification, lane E. A change to one screen-reader rule, L3, in `tests/sr/rules.ts`, and to its unit tests. No item, token, dependency, test file or workflow changes. A specification, not a small change, because it amends a rule `022q` decided (decision 7, "L3 within one entry"), and the owner chose the change from options.
- **Depends on:** `022q` (landed at `9af3248`), which made L3's within-one-entry case and the VoiceOver join. Nothing else. `019b` depends on this, and on one `matrix` push run that carries this and not `019b` (decision 4).
- **Research it stands on:** [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), cited as *run 5's memo*, §3.3, §3.5 and §7, and the owner's answer at the end of §7. [The error summary's list, read twice](../research/2026-11-17-the-error-summary-list-double-read.md), cited as *the list memo*, §1 and §2.
- **The owner's ruling (2026-11-17),** from three options (*run 5's memo* §7): option 3. NVDA with Firefox reading each message as a list item, then as its link, is a double read. The rule also learns VoiceOver's doubled phrase, which has no ". " between the parts, so both readers are judged alike. The four tests (error-summary, settings, sign-in, sign-up) and VoiceOver's error summaries fail until the item changes. They are not ledgered.
- **The design lead's ruling on review finding 1 (2026-11-17):** drop the 3-word minimum. The review's probe shows it prevents no fault the memos show, and it judges the readers unalike: VoiceOver's "Copied Copied" would pass while NVDA's "Copied. Copied" fails. Keep whole-word matching, and apply it to the adjacent-phrases case too.

## Intent

L3 says a message is not read twice. `022q` taught it one case inside a single log entry: the message whole twice, with a part boundary between. guidepup joins one capture's parts with ". ", so that case finds NVDA's double read.

VoiceOver doubles the error summary's messages inside one part: "There is a problem Enter a project name Enter a project name …" (*run 5's memo* §3.3). There is no ". " between the two, so L3 passes it. The owner ruled that both readers are judged alike. This change lets L3 find a message said twice in one phrase with or without a separator, without faulting a message that is said once.

**Terms of art.**

- A **phrase** is one log entry: what guidepup logs for one capture. A **part** is a piece of a phrase between two ". ".
- A **place** is where the normalised message starts and ends in the normalised phrase.
- A **word character** is a Unicode letter, a digit or a hyphen.
- A **whole-word place** is a place with no word character just before it or just after it.
- A **dry run** is the speech suite with `SR_DRY=1`: it drives every step and checks DOM facts, and judges no rule (`022`).

## Decisions

### 1. L3 within one entry, amended

One entry faults L3 when it holds the message, in any spoken form, at two whole-word places that do not overlap. Anything may lie between the two places, a part boundary or nothing. This replaces `022q`'s condition that a part boundary lie between them.

Everything else in L3 stays: its precondition (L1 holds, else X0), and its fault messages ("… was read twice in a row (phrases N and N+1)", "… was read twice within phrase N"). The adjacent-phrases case gains decision 2's whole-word test. `normalise` and `joinCaptures` do not change.

- *Why one phrase, not the window:* two adjacent phrases already fault L3. The gap is inside one phrase.
- *Why "two places that do not overlap":* the message is said twice only if two copies fit side by side. "go back go" is not said twice in "go back go back go": its two places share a word.
- *Why no separator is needed:* VoiceOver's quoted phrase has the two copies side by side, with nothing between (*run 5's memo* §3.3). NVDA's phrase has a ". " between ("Enter a project name, 1 of 3. Enter a project name, link"), which `022q`'s case already caught. One condition, "two places", judges both. That is the owner's "judged alike".
- *Why words may also lie between:* no quoted phrase needs it. It is kept because VoiceOver may put a role word between two copies ("Enter a project name group Enter a project name") within one part. EXECUTED, the probe below: allowing it adds no fault to any quoted phrase.

### 2. The guard against false faults: whole words, in both cases

A place counts only if no word character touches either end. This holds in the within-entry case and in the adjacent-phrases case. Other rules that use `holds` (U1, and L3's precondition through L1) do not change.

- "Saved" is not found inside "unsaved". So "Saved. 2 unsaved changes" does not fault L3 for "Saved", and neither do the adjacent phrases "Saved", "2 unsaved changes". Today both fault.
- "Enter a password" is not found inside "Reenter a password", nor inside "Re-enter a password". The hyphen is a word character for this reason. No message in the suite starts or ends with a hyphen.
- **A message that holds a repeated word** is not a double read, and is not found as one. "Page 12 of 12" holds "12" twice, but the message holds itself once. The rule matches the whole message, never a word in it.
- **No minimum length** (the design lead's ruling, above). A short message said twice, side by side, faults: "Copied Copied" under VoiceOver faults as "Copied. Copied" under NVDA does. Code-block's "Copied" is a real double read, of kind item (*run 5's memo* §3.3), so this judges the item the same way in both readers.
- **Spoken forms:** each form is matched whole, as today. Two places may be of different forms.
- **The evidence, EXECUTED** (the prototype, below): against every phrase quoted in *the speech memo*, *run 4's memo* and *run 5's memo*, judged for each of the suite's 13 L3 messages wherever L1 holds, the rule changes exactly one verdict: VoiceOver with Chromium's error-summary phrase, for "Enter a project name", from pass to L3. No phrase of a test that passes today gains a fault. The quoted evidence is thin where risk is: passing tests print no phrases (decision 4).

### 3. The fixtures: the memo's phrases, and what is constructed

- **Quoted, verbatim up to the memo's ellipsis** (*run 5's memo* §3.3):
  - VoiceOver with Chromium: "There is a problem Enter a project name Enter a project name". It is cut at "…", and it was printed by the second-submit test's first window, not the insertion test's. The test labels it so.
  - NVDA with Firefox: "list. Enter a project name, 1 of 3. Enter a project name, link, same page. Enter the owner's email address, 2 of 3."
  - NVDA with Chromium: "list item, 1 of 3. Enter a project name, link, same page".
- **Constructed, and labelled so in the test:** VoiceOver's phrase carried on to all three messages, "There is a problem Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address Choose who can see the project Choose who can see the project"; and the blocks' phrases in the same shape, for "Enter your name" and "Enter a password". *Run 5's memo* quotes no further VoiceOver phrase.

### 4. The next speech run, stated in advance

**The run.** The first `matrix` push run that carries this change and not `019b`. `019b` lands only after that run (`019b`, "Depends on"). With `022t` or without, the table holds, except for the second submit.

| Test (file: title) | NVDA chr | NVDA ff | VO chr | VO wk |
|---|---|---|---|---|
| `error-summary.sr.ts`: "the insertion: the title and every message spoken whole, none twice in a row, none before" | pass | fail, L3 (as run 5) | **newly fails, L3** | expected to fail, L3 |
| `settings.sr.ts`: "a save with an empty name: the summary's title and message spoken whole, none twice in a row" | pass | fail, L3 | **newly fails, L3** | expected to fail, L3 |
| `sign-in.sr.ts`: "an empty submit: the summary's title and messages spoken whole, none twice in a row" | pass | fail, L3 | **newly fails, L3** | expected to fail, L3 |
| `sign-up.sr.ts`: "an empty submit: the summary's title and messages spoken whole, none twice in a row" | pass | fail, L3 | **newly fails, L3** | expected to fail, L3 |

- **The outcome that makes `022z` done** is VO chr's column: each of the four tests fails L3 "… was read twice within phrase N", for each of its summary's messages. A failing test prints its phrases in the job log (READ, *run 5's memo* §3.3), so this is read from the log, not from artifacts.
- **If VO chr does not fault them,** the rule does not match real speech. That is a finding: a research memo opens with the phrases, and the Status reads "built; awaits the speech run". The rule is not changed by guess.
- **VO wk is expected, not required.** No VO wk phrase was printed in run 5: its tests passed. The markup is the same in both browsers (INFERRED). Its result is written in the landing notes either way. If a VO wk test passes, its phrases are only in `phrases.json`, which this environment cannot fetch (*run 5's memo*, "How to read"). **The owner downloads** that run's `sr-voiceover-webkit-*` artifacts and gives the design lead the four tests' `phrases.json` entries.
- **The title is expected not to fault** (INFERRED). VoiceOver reads the focused root as "There is a problem and 1 more item group" (*run 5's memo* §3.5). The insertion both raises the alert and moves focus to the root. If that reading falls in the alert's own part, the title is said twice in one phrase, and L3 faults the title. Run 5's VO chr pass of the insertion rules out the two with a ". " between; it does not rule out one part. A title fault "within phrase" is a finding about the alert and the focus move, `019` decision 1's design, for lane I. It is recorded with its phrase, opens research, and is not ledgered. It does not count against this criterion.
- **The second submit.** Without `022t` it fails L1 in every pair, as in run 5. With `022t`, its alert is new each time, so it is expected to fail as the insertion does.
- **NVDA: no new failure** among these four. NVDA with Firefox already fails them on `022q`'s case. NVDA with Chromium reads each message once.
- **Watched, not part of done.** These judge a message under VoiceOver that the new case can now reach:
  - `code-block.sr.ts`, "copy": "Copied". VO wk passed in run 5. If VoiceOver says "Copied" twice in one part, it now faults, as NVDA's "Copied. Copied" does. That is code-block's item fault, already queued for lane I (*run 5's memo* §7).
  - pagination P1 ("Page 6 of 12"), toast S1 and app-shell A1 ("Success: Project saved"). VoiceOver repeated both in run 4 as two phrases, which the join now drops (`022q` decision 7). A repeat inside one part is not dropped.
  - A new fault on any of these is recorded in the landing notes with its phrase. A message said twice in one VoiceOver part is a finding about the item, for lane I. A stale repeat the join misses is a finding about the join, for a lane-E small change.
- **Not ledgered** (the owner, 2026-11-17). `tests/fault-ledger.ts` does not change.

### 5. The mutation sets (`022` decision 15)

- **`expected.json` and `notProvable` do not change,** in either set. `expected.json` is derived from each test's declared rules, its `hears` and the patch table (`tests/sr/mutations/derive.ts`), none of which this changes. `mutations.test.ts` passes unchanged.
- **A patch is proven only by a witness that passes unpatched.**

**The window, from this landing to `019b`'s.** The error summary's insertion test fails L3 unpatched under NVDA with Firefox (since run 5) and, after this change, under VO chr and VO wk. That test is the witness of two patches (READ, `tests/sr/mutations/table.ts`, lines 49–60):

- **Patch 4** (`main`; no alert role on the content; expected L1 in the five error-summary tests × four pairs). It proves nothing in those three pairs in the window. A `main` dispatch would still look matched: patch 4 faults L1, and L3's follow-on X0 is hidden by the unpatched L3 fault.
- **Patch 7b** (`double-read`; `role="alert"` back on the root and off the content, `019`'s old structure; expected L3 in the same five tests). It proves nothing in those three pairs in the window.

**So, in the window:**

- No `double-read` dispatch is run.
- A `main` dispatch is read for its other patches only. Its patch 4 result is recorded in this specification's landing notes, with the run id, as not provable under NVDA with Firefox, VO chr and VO wk. `expected.json` and `notProvable` are not touched for it.
- If a `double-read` dispatch runs anyway, its 7b result is recorded the same way.
- The window closes when `019b` lands. `019b` decision 9 records 4 and 7b as provable again.

**Patch 7** (`main`; code-block's status rendered twice; witness: code-block's copy test).

- Under NVDA it still cannot be proven: the test fails unpatched, "Copied. Copied", the item's own double read. It waits for code-block's small change in lane I.
- Under VoiceOver, `022q` decision 7 feared that VoiceOver logs two identical "Copied" once. With no minimum, "Copied Copied" in one part now faults. So where VoiceOver speaks both, patch 7 becomes provable under VoiceOver, if the unpatched test passes there. VO wk passed it in run 5. The next `main` dispatch records patch 7 under each VoiceOver pair in the landing notes.

**After `019b`, a further gain for 7b.** 7b puts the alert on the root, the element that takes focus. So the alert's reading and the focus move's reading are of the same element, and each may say the title (INFERRED). If both fall in one part ("There is a problem Enter a project name There is a problem Enter a project name"), `022q`'s rule passes it and this rule faults it (EXECUTED, in the review: the title and the message). So 7b may become provable under VoiceOver where `022q` doubted it.

**Patch 6 and the others** are not touched: their faults are not L3.

### 6. `022q`'s text this supersedes

`022q` is a landed record and is not edited. Read these sentences in their new form.

- Decision 7, "L3 also faults when one entry holds the message whole twice, in two of its parts." Now: "… whole twice, at two whole-word places that do not overlap, with or without anything between (`022z`)."
- Decision 5, "L3 faults if two adjacent phrases each hold any form, or if one entry holds a form whole in two of its parts (decision 7)." Now: "… if two adjacent phrases each hold any form at a whole-word place, or if one entry holds a form whole twice (`022z`)."
- The build record's "What changed, by finding", item 2. The same.

## Design

- `tests/sr/rules.ts`:
  - A private `WORD` pattern: a Unicode letter, a digit or a hyphen. A private `holdsWhole(phrase, message)`: the phrase holds a form at a whole-word place.
  - `heldTwice(entry, message)`: two non-overlapping whole-word places, of any forms. The test for a "." between goes.
  - `L3`'s adjacent case uses `holdsWhole` in place of `holds`. `holds` stays for U1.
  - The comments above `heldTwice` and `L3` say the rule, the whole-word test and its hyphen, and why no separator is needed. They cite no internal document beyond the decision numbers the file already uses.
- `tests/unit/sr-rules.test.ts`:
  - A new `describe` block, "022z: L3 learns VoiceOver's doubled phrase", with criterion 1's and 2's cases.
  - The existing case `L3(["Copied Copied"], "Copied")` → `[]`, in "022q, after the change review", becomes `["L3"]`, with a comment citing this decision. It is the one existing expectation that changes.

## Scope

- **In:** `tests/sr/rules.ts` (`heldTwice`, `L3`, the two private helpers, their comments); `tests/unit/sr-rules.test.ts`.
- **Out:**
  - Every `.sr.ts` file, and every other rule.
  - `normalise`, `holds` and `joinCaptures`.
  - The items. The error summary's markup is `019b`. Code-block's "Copied" twice is its own small change in lane I (*run 5's memo* §7).
  - The ledger, `expected.json`, `notProvable`, the workflow.

## Acceptance criteria

1. **Seen failing first,** in `sr-rules.test.ts`, on today's `rules.ts` (`b01e754`), then passing (unit):
   - VoiceOver's quoted phrase faults L3 for "Enter a project name";
   - the constructed VoiceOver phrase faults L3 for each of the three messages;
   - the constructed blocks' phrases fault L3 for "Enter your name" and for "Enter a password";
   - "Copied Copied" faults L3 for "Copied", and "3 results 3 results" for "3 results" (the existing `["Copied Copied"]` case's new expectation);
   - "Saved. 2 unsaved changes" does not fault L3 for "Saved", and neither do the adjacent phrases "Saved", "2 unsaved changes" (today both do).
2. **Guards, passing before and after** (unit):
   - VoiceOver's quoted phrase does not fault L3 for "There is a problem". It is built on a quote cut at "…", and its label says so (decision 4, the title);
   - NVDA with Firefox's quoted phrase faults L3 for "Enter a project name"; NVDA with Chromium's does not;
   - "Copied. Copied" faults; "Copy, button. Copied" does not;
   - the adjacent phrases "Saved", "Saved" fault;
   - "Page 12 of 12 current page button" does not fault for "Page 12 of 12";
   - "Enter a password Reenter a password" and "Enter a password Re-enter a password" do not fault for "Enter a password";
   - "go back go back go" does not fault for "go back go";
   - "Success: Project saved. You are currently on a button." does not fault for "Success: Project saved".
   - Every other existing case in `sr-rules.test.ts` passes unchanged.
   - **Proven by mutation,** each recorded in the landing notes:
     - the whole-word test removed (no character counts as a word character): the two "Saved … unsaved" cases and the "Reenter"/"Re-enter" guard fail;
     - the overlap test mutated, `a.end <= b.start` to `a.start < b.start`: the "go back go" guard fails, alone.
3. **The other unit files** pass: `sr-harness.test.ts`, `sr-items.test.ts` (it imports `RULE_IDS` from `rules.ts`), `mutations.test.ts`, `sr-static.test.ts`, `release-check.test.ts`, `gate.test.ts`, `workflow.test.ts`. `bun run check`: 0 errors. `bun run lint`: clean. (unit)
4. **The dry run,** `SR_DRY=1 bun run test:sr`, in `chromium` and `webkit`: 87 of 87 pass in each. A dry run judges no rule, so this is a smoke check that no step or fact moved. (dry)
5. **The next speech run, one outcome.** In the first `matrix` push run that carries this change and not `019b`, each of decision 4's four tests fails L3 "… was read twice within phrase N" under VO chr, for each of its summary's messages, read from the job log. The run id and VO chr's four results are in the landing notes. If it does not hold, decision 4's finding follows, and the Status reads "built; awaits the speech run". VO wk's four results, and any watched test's new fault, are written in the landing notes as decision 4 says; they do not decide this criterion. (CI)
6. **The mutation sets.** The landing notes hold decision 5's window: each `main` dispatch run in it, with its run id, patch 4 recorded as not provable under NVDA with Firefox, VO chr and VO wk, and patch 7's result under each VoiceOver pair. No `double-read` dispatch runs in the window. (CI)
7. **The scorecard** is re-run after landing, and its run log has a row. No row is expected to move: row 3 (h) waits for a green run with speech verdicts. (measure)

## Prototype, for the re-check

EXECUTED on 2026-11-17, in a scratch folder outside the repository, with Bun 1.4.4. Nothing in the repository was written. Revised after the ruling on finding 1.

- A copy of today's `rules.ts`, and a prototype with decisions 1 and 2: whole-word places (letters, digits and hyphens), in both L3 cases; two non-overlapping places in one entry fault, with no separator needed and no minimum.
- A scratch test file with criterion 1's and 2's new cases, 14 tests:
  - on today's copy: **6 fail, 8 pass**; the 6 are criterion 1's;
  - on the prototype: **14 pass**.
- `tests/unit/sr-rules.test.ts`, pointed at the prototype: **56 pass, 1 fail**. The fail is `L3(["Copied Copied"], "Copied")` → `[]`, whose expectation this change turns to `["L3"]`.
- Criterion 2's mutations, on the prototype: the whole-word test removed fails 3 tests (both "unsaved" cases, and the "Reenter"/"Re-enter" guard); the overlap mutation fails 1 (the "go back go" guard), and `sr-rules.test.ts` keeps its 56.
- **Against the quoted phrases** (the coordinator's request, after the ruling): every quoted string in *the speech memo*, *run 4's memo* and *run 5's memo*, alone and with the other quotes on its line, 261 windows in all, judged for each of the 13 messages wherever L1 holds today: 41 cells. The prototype changes **one verdict**: VoiceOver with Chromium's error-summary phrase, for "Enter a project name", from pass to L3 (it appears twice in the 261 windows, once alone, once with a neighbour). **No new fault on a test that passes today.**

## Open questions

None for the owner. The ruling sets the rule's aim, and the design lead's ruling on finding 1 removes the minimum that departed from it.

## Review

The spec review, 2026-11-17, raised 7 findings (3 Medium, 4 Low). Each is answered above.

1. **Medium,** the 3-word minimum had no evidence and judged the readers unalike. *The design lead's ruling, 2026-11-17:* the minimum is dropped. Decisions 1 and 2 now fault two whole-word places at any length; "Copied Copied" and "3 results 3 results" fault (criterion 1); the existing `["Copied Copied"]` case's expectation changes (Design). The minimum's mutation is gone from criterion 2. The prototype was re-run against every quoted phrase: one verdict changes, the intended one, and no passing test gains a fault (Prototype).
2. **Medium,** patch 4 is unprovable in the same window as 7b, and criterion 6 invited a `main` dispatch inside it. Decision 5 states one window for both, from this landing to `019b`'s: no `double-read` dispatch; a `main` dispatch read for its other patches, with patch 4 recorded as not provable under NVDA with Firefox, VO chr and VO wk, with the run id, in the landing notes; `expected.json` and `notProvable` untouched. Criterion 6 holds it.
3. **Medium,** criterion 5 was not one outcome. It is now: VO chr's four tests fail L3 within phrase for each message, read from the job log, in the first push run with this change and without `019b`. A miss is a finding, with the Status set to wait. VO wk is recorded, not required, and the owner downloads `phrases.json` where an agent cannot (decision 4). `019b` drops "or in the same push" (its review, finding 2).
4. **Low,** the title may fault within phrase under VoiceOver. Decision 4 says the title is expected not to fault, INFERRED, and that a title fault is a finding about the alert and the focus move, for lane I, not ledgered. Criterion 2's title guard is labelled as built on a cut quote; decision 3 says the quote came from the second-submit test's first window.
5. **Low,** 7b was misdescribed as two alerts. Decision 5 now says it puts the one alert on the root, so the alert's and the focus move's readings are of one element; the conclusion stays INFERRED.
6. **Low,** whole words were not applied to the adjacent case, and a hyphen broke a word. Decision 2 applies the whole-word test to both L3 cases, and counts a hyphen as a word character, so "Re-enter" does not match "enter" (criterion 1 and 2's cases).
7. **Low,** three write-ins. Decision 1's reason for allowing a gap no longer cites NVDA's "1 of 3", which a separator already caught; the gap is kept as VoiceOver caution, at no cost in the probe. Criterion 2 names the overlap mutation. Criterion 3 adds `sr-items.test.ts`.

## Landing notes

To be filled in when it lands.
