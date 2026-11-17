# 022z — L3 learns VoiceOver's doubled phrase

- **Status:** draft, for its specification review.
- **Date:** 2026-11-17
- **Author:** the design lead
- **Kind:** specification, lane E. A change to one screen-reader rule, L3, in `tests/sr/rules.ts`, and to its unit tests. No item, token, dependency, test file or workflow changes. A specification, not a small change, because it amends a rule `022q` decided (decision 7, "L3 within one entry"), and the owner chose the change from options.
- **Depends on:** `022q` (landed at `9af3248`), which made L3's within-one-entry case and the VoiceOver join. Nothing else. `019b` depends on this.
- **Research it stands on:** [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), cited as *run 5's memo*, §3.3 and §7, and the owner's answer at the end of §7. [The error summary's list, read twice](../research/2026-11-17-the-error-summary-list-double-read.md), cited as *the list memo*, §1 and §2.
- **The owner's ruling (2026-11-17),** from three options (*run 5's memo* §7): option 3. NVDA with Firefox reading each message as a list item, then as its link, is a double read. The rule also learns VoiceOver's doubled phrase, which has no ". " between the parts, so both readers are judged alike. The four tests (error-summary, settings, sign-in, sign-up) and VoiceOver's error summaries fail until the item changes. They are not ledgered.

## Intent

L3 says a message is not read twice. `022q` taught it one case inside a single log entry: the message whole twice, with a part boundary between. guidepup joins one capture's parts with ". ", so that case finds NVDA's double read.

VoiceOver doubles the error summary's messages inside one part: "There is a problem Enter a project name Enter a project name …" (*run 5's memo* §3.3). There is no ". " between the two, so L3 passes it. The owner ruled that both readers are judged alike. This change lets L3 find a message said twice in one phrase with no separator, without faulting a message that is only said once.

**Terms of art.**

- A **phrase** is one log entry: what guidepup logs for one capture. A **part** is a piece of a phrase between two ". ".
- A **place** is where the normalised message starts and ends in the normalised phrase.
- A **whole-word place** is a place with no letter or digit just before it or just after it.
- A **long message** has 3 words or more once normalised (`normalise`, split on its single spaces).
- A **dry run** is the speech suite with `SR_DRY=1`: it drives every step and checks DOM facts, and judges no rule (`022`).

## Decisions

### 1. L3 within one entry, amended

`022q` decision 7's within-one-entry case becomes two cases. One entry faults L3 when it holds the message, in any spoken form, at two whole-word places that do not overlap, and either:

1. **a part boundary lies between them** (a "." in the normalised text between the first place's end and the second's start), as `022q` built; or
2. **the message is long** (3 words or more), with or without anything between.

Everything else in L3 stays: its precondition (L1 holds, else X0), the adjacent-phrases case, and its fault messages ("… was read twice within phrase N"). `normalise` and `joinCaptures` do not change.

- *Why one phrase, not the window:* two adjacent phrases already fault L3. The gap is inside one phrase.
- *Why "two places that do not overlap":* the message is said twice only if two copies fit side by side. A message such as "go back go" is not said twice in "go back go back go": its two places share a word.
- *Why anything may lie between, for a long message:* VoiceOver says the list item, then its link, with nothing between. NVDA says the list item, its place ("1 of 3") and then the link. Run 5 shows both (*run 5's memo* §3.3). A rule that asks for nothing between, or for one thing between, would judge one reader and miss the other.

### 2. The guard against false faults: whole words, and 3 words for the case with no separator

**Whole-word places, in both cases.** A place counts only if no letter or digit touches either end (Unicode letters and digits, after `normalise`). So "Saved" is not found inside "unsaved", and "Enter a password" is not found inside "Reenter a password".

- This also tightens `022q`'s case 1. Today "Saved. 2 unsaved changes" faults L3 for "Saved", which is said once. After this change it does not.
- No run-5 fault depends on a part-word match: "Copied. Copied" and NVDA with Firefox's error summaries are whole words (*run 5's memo* §3.3).

**A minimum of 3 words, for case 2 only.** A short message keeps `022q`'s rule: twice only with a part boundary between.

- *Why a minimum:* with no separator, a short message's words can come from two sources in one phrase, and still be one reading of the message. VoiceOver runs several elements into one phrase with no break: a name, its role, a nearby name, a hint. A one- or two-word message ("Copied", "Saved", "3 results") is the size of a button's name or a state word. A run of 3 or more words, the whole message, side by side twice, is very unlikely to come from anything but the message read twice (INFERRED).
- *Why 3, by the suite's messages* (READ, every `.sr.ts` file that calls L3):

  | Message | Words | Case 2 applies |
  |---|---|---|
  | "There is a problem" | 4 | yes |
  | "Enter a project name", "Enter the owner's email address", "Choose who can see the project" | 4, 5, 6 | yes |
  | "Enter your name", "Enter your password", "Enter a password" | 3 | yes |
  | "Enter your email address" | 4 | yes |
  | "Page 6 of 12" (pagination P1) | 4 | yes |
  | "Success: Project saved" (toast S1, app-shell A1) | 3 | yes |
  | "Could not copy" (code-block, where the write is refused) | 3 | yes |
  | "3 results" (search-field S1) | 2 | no |
  | "Copied" (code-block) | 1 | no |

  Every message the ruling names has 3 words or more. So 3 is the most the minimum can be, and still judge the error summaries.
- *Why not whole-message matching alone, with no minimum:* whole words keep a short message from matching inside a longer word. They do not keep it from matching twice in one phrase from two sources. The minimum does that, for the case that has no separator to show two readings.
- *Why words, not characters:* `normalise` already gives single-spaced words. A count of characters would treat "3 results" (9) and "Enter your name" (15) by a number with no meaning for speech.
- *What the minimum costs:* a short message said twice with no separator is not caught. VoiceOver saying "Copied Copied" in one part would pass. NVDA's separator still catches "Copied. Copied" (run 5). The cost is written into the rule's comment and the unit tests (criterion 2).
- **A message that holds a repeated word** is not a double read, and is not found as one. "Page 12 of 12" holds "12" twice, but the message holds itself once. The rule matches the whole message, never a word in it.
- **Spoken forms:** each form is judged by its own word count. Case 2 needs both places to be long.

### 3. The fixtures: the memo's phrases, and what is constructed

- **Quoted, verbatim up to the memo's ellipsis** (*run 5's memo* §3.3):
  - VoiceOver with Chromium: "There is a problem Enter a project name Enter a project name".
  - NVDA with Firefox: "list. Enter a project name, 1 of 3. Enter a project name, link, same page. Enter the owner's email address, 2 of 3."
  - NVDA with Chromium: "list item, 1 of 3. Enter a project name, link, same page".
- **Constructed, and labelled so in the test:** VoiceOver's phrase carried on to all three messages, "There is a problem Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address Choose who can see the project Choose who can see the project"; and the blocks' phrases in the same shape, for "Enter your name" and "Enter a password". *Run 5's memo* quotes no further VoiceOver phrase: passing tests print none, and the artifacts were not read.

### 4. What this does to the next speech run, stated in advance

The next `matrix` push run that carries this change, and not `019b`, judges the error summaries' markup as it is today. Per pair:

| Test (file: title) | NVDA chr | NVDA ff | VO chr | VO wk |
|---|---|---|---|---|
| `error-summary.sr.ts`: "the insertion: the title and every message spoken whole, none twice in a row, none before" | pass | fail, L3 (as run 5) | **newly fails, L3** | **newly fails, L3** |
| `error-summary.sr.ts`: "the second submit, unchanged: spoken whole again, none twice in a row" | see below | see below | see below | see below |
| `settings.sr.ts`: "a save with an empty name: the summary's title and message spoken whole, none twice in a row" | pass | fail, L3 | **newly fails, L3** | **newly fails, L3** |
| `sign-in.sr.ts`: "an empty submit: the summary's title and messages spoken whole, none twice in a row" | pass | fail, L3 | **newly fails, L3** | **newly fails, L3** |
| `sign-up.sr.ts`: "an empty submit: the summary's title and messages spoken whole, none twice in a row" | pass | fail, L3 | **newly fails, L3** | **newly fails, L3** |

- **Each new failure** prints "L3: "<message>" was read twice within phrase N", for each of the summary's messages, and none for its title.
- **VO chr is firm.** Its phrase is quoted (decision 3).
- **VO wk is inferred.** No VO wk phrase was printed: its tests passed in run 5. The markup is the same in both browsers, so the same double read is expected. If a VO wk test passes, its `phrases.json` is read and recorded in the landing notes. A pass there is evidence about WebKit for `019b`, not a fault of this rule.
- **The second submit.** Without `022t` it fails L1 in every pair, as in run 5. With `022t` its alert is new each time, the first submit's shape, so it is expected to fail as the insertion does: L3 under NVDA with Firefox and both VoiceOver pairs, and pass under NVDA with Chromium.
- **NVDA: no new failure.** NVDA with Firefox already fails the four tests on `022q`'s case 1. NVDA with Chromium reads each message once (*run 5's memo* §3.3).
- **No other test newly fails L3** in any pair. Three tests judge a long message under VoiceOver and are watched: pagination P1 ("Page 6 of 12"), toast S1 and app-shell A1 ("Success: Project saved"). VoiceOver repeated both messages in run 4, as two phrases, which the join now drops (`022q` decision 7). A repeat inside one part is not dropped. If one of the three newly faults, its phrase is recorded. A message said twice in one VoiceOver part is a finding about the item, for a lane-I change. A stale repeat the join misses is a finding about the join, for a lane-E small change. Neither is ledgered without the design lead's ruling.
- **Not ledgered** (the owner, 2026-11-17). The failures above stand until `019b` lands. `tests/fault-ledger.ts` does not change.

### 5. The mutation sets (`022` decision 15)

- **`expected.json` does not change,** in either set. It is derived from each test's declared rules, its `hears` and the patch table (`tests/sr/mutations/derive.ts`), none of which this changes. `mutations.test.ts` passes unchanged.
- **Patch 7** (`main`, `code-block`, the status rendered twice; witness: code-block's copy test). Its message, "Copied", is one word. Case 2 does not apply, so this change does nothing for patch 7.
  - Under NVDA, patch 7 still cannot be proven: the test fails unpatched, "Copied. Copied", the item's own double read (*run 5's memo* §3.3). It waits for code-block's small change in lane I.
  - Under VoiceOver, `022q` decision 7's stated risk stands: VoiceOver may log the two identical "Copied" once, and the minimum keeps "Copied Copied" from faulting. If the next `mutate` dispatch shows it, `022` decision 15's four steps follow, the `double-read` set included.
- **Patch 4** (`main`, `error-summary`, no alert role on the content; expected L1). Its entries stand. INFERRED: with no alert, VoiceOver reads only the focused root, as on run 5's second submit ("There is a problem and 1 more item group …"), so L1 still faults, not L3.
- **The `double-read` set, patch 7b** (the alert back on the root; expected L3 in five tests × four pairs; witness: the insertion test).
  - **Until `019b` lands, 7b proves nothing in three pairs.** Its witness fails L3 unpatched under NVDA with Firefox (run 5), and, after this change, under both VoiceOver pairs. A patch is proven only by a witness that passes unpatched. So no `double-read` dispatch is run between this change and `019b`. If one is run, its 7b result is recorded as not provable in those pairs, with the run id.
  - **After `019b`, a gain.** 7b gives the reader two alerts, root and content. If VoiceOver reads the title twice in one part ("There is a problem There is a problem …"), `022q`'s rule missed it. Case 2 finds it: the title has 4 words. So this change makes 7b provable under VoiceOver where `022q` doubted it.
- **Patch 6 and the others** are not touched: their faults are not L3.

### 6. `022q`'s text this supersedes

`022q` is a landed record and is not edited. Read these sentences in their new form.

- Decision 7, "L3 also faults when one entry holds the message whole twice, in two of its parts." Now: "… whole twice, at two whole-word places that do not overlap, with a part boundary between them or, for a message of 3 words or more, with or without one (`022z`)."
- Decision 5, "L3 faults if two adjacent phrases each hold any form, or if one entry holds a form whole in two of its parts (decision 7)." The same amendment applies.
- The build record's "What changed, by finding", item 2. The same.

## Design

- `tests/sr/rules.ts`:
  - A new exported constant, `L3_MIN_WORDS = 3`, with a comment giving decision 2's reason in one sentence.
  - `heldTwice(entry, message)`: each place is kept only if it is whole-word. A place records whether its form is long. Two non-overlapping places fault when a "." lies between them, or when both are long.
  - The comments above `heldTwice` and `L3` say both cases, the minimum and its cost. They cite no internal document beyond the decision numbers the file already uses.
- `tests/unit/sr-rules.test.ts`: a new `describe` block, "022z: L3 learns VoiceOver's doubled phrase", with criterion 1's and 2's cases. The existing case `L3(["Copied Copied"], "Copied")` → `[]` stays: it is now the minimum's guard.

## Scope

- **In:** `tests/sr/rules.ts` (`heldTwice`, `L3`'s comment, the constant); `tests/unit/sr-rules.test.ts`.
- **Out:**
  - Every `.sr.ts` file, and every other rule.
  - `normalise` and `joinCaptures`.
  - The items. The error summary's markup is `019b`. Code-block's "Copied" twice is its own small change in lane I (*run 5's memo* §7).
  - The ledger, `expected.json`, the workflow.

## Acceptance criteria

1. **Seen failing first,** in `sr-rules.test.ts`, on today's `rules.ts` (`b01e754`), then passing (unit):
   - VoiceOver's quoted phrase faults L3 for "Enter a project name";
   - the constructed VoiceOver phrase faults L3 for each of the three messages;
   - the constructed blocks' phrases fault L3 for "Enter your name" and for "Enter a password";
   - "Saved. 2 unsaved changes" does not fault L3 for "Saved" (today it does).
2. **Guards, passing before and after** (unit):
   - VoiceOver's quoted phrase does not fault L3 for "There is a problem";
   - NVDA with Firefox's quoted phrase faults L3 for "Enter a project name"; NVDA with Chromium's does not;
   - `022q`'s three: "Copied. Copied" faults; "Copy, button. Copied" and "Copied Copied" do not;
   - "Page 12 of 12 current page button" does not fault for "Page 12 of 12";
   - "3 results 3 results" does not fault for "3 results" (below the minimum);
   - "Enter a password Reenter a password" does not fault for "Enter a password" (not whole words);
   - "go back go back go" does not fault for "go back go" (the places overlap);
   - "Success: Project saved. You are currently on a button." does not fault for "Success: Project saved".
   - Every existing case in `sr-rules.test.ts` passes unchanged.
   - **Proven by mutation:** with `L3_MIN_WORDS` set to 1, the "3 results" and "Copied Copied" guards fail; with the whole-word test removed, the "Reenter" guard and criterion 1's "unsaved" case fail. The landing notes record both.
3. **The other unit files** pass: `sr-harness.test.ts`, `mutations.test.ts`, `sr-static.test.ts`, `release-check.test.ts`, `gate.test.ts`, `workflow.test.ts`. `bun run check`: 0 errors. `bun run lint`: clean. (unit)
4. **The dry run,** `SR_DRY=1 bun run test:sr`, in `chromium` and `webkit`: every test passes, 87 of 87 in each. A dry run judges no rule, so this shows the change moves no step or fact. (dry)
5. **The next `matrix` push run** shows decision 4's table: the four tests, and the second submit as decision 4 says, fail L3 "within phrase" under VO chr; the same under VO wk, or its passing phrases are recorded; no test newly fails under NVDA; no other test newly fails L3 in any pair, or its phrase is recorded and ruled as decision 4 says. The run id and each pair's result are in the landing notes. (CI)
6. **The mutation sets:** the landing notes record decision 5's statement, and the outcome of the next `mutate` dispatch for patch 7 under VoiceOver, or why none was run. No `double-read` dispatch runs before `019b` lands. (CI)
7. **The scorecard** is re-run after landing, and its run log has a row. No row is expected to move: row 3 (h) waits for a green run with speech verdicts.

## Prototype, for the spec review

EXECUTED on 2026-11-17, in a scratch folder outside the repository, with Bun 1.4.4. Nothing in the repository was written.

- A copy of today's `rules.ts`, and a copy with decision 1 and 2 built into `heldTwice` (whole-word places; a minimum of 3 words for the case with no separator).
- A scratch test file with criterion 1's 4 cases and criterion 2's new guards (12 tests in all):
  - on today's copy: **4 fail, 8 pass**; the 4 are criterion 1's;
  - on the prototype: **12 pass**.
- `tests/unit/sr-rules.test.ts`, pointed at the prototype: **57 of 57 pass**, 116 expects.
- Criterion 2's two mutations, on the prototype: the minimum set to 1 fails 2 tests ("Copied Copied" and "3 results 3 results"); the whole-word test removed fails 2 ("Saved. 2 unsaved changes" and "Reenter a password").

## Open questions

None for the owner. The ruling sets the rule's aim. The minimum and the whole-word test are the design lead's, and the spec review may challenge them.

## Landing notes

To be filled in when it lands.
