# Review of 022z — L3 learns VoiceOver's doubled phrase

Reviews [`specifications/022z-l3-learns-voiceovers-doubled-phrase.md`](../specifications/022z-l3-learns-voiceovers-doubled-phrase.md) before it is built. Its research is [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) (*run 5's memo*), §3.3 and §7 with the owner's answer, and [the error summary's list, read twice](../research/2026-11-17-the-error-summary-list-double-read.md) (*the list memo*). This reviewer wrote neither the specification nor its research (constitution §5).

- **Date:** 2026-11-17
- **Status:** dispositioned; fit to build (see the re-check's closing verdict)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (177 lines, untracked), on `release/0.13.0` at `b01e754`. Checked against:
  - `tests/sr/rules.ts` (`normalise`, `heldTwice`, `L3`, `joinCaptures`) and `tests/unit/sr-rules.test.ts`;
  - every `.sr.ts` file that calls L3, for its messages;
  - `tests/sr/mutations/` (`table.ts`, `derive.ts`, both `expected.json`, patches 4, 7 and 7b), in the main checkout and as `022t` regenerated them in `.claude/worktrees/lane-i-attempt/`;
  - `.github/workflows/matrix.yml` (how a `mutate` dispatch picks its set);
  - `022q`'s specification, decision 7; [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md) (*the speech memo*).
- **Re-ran:** nothing in the repository was written but this file. In the session's scratch folder, with Bun 1.4.4, EXECUTED:
  - a copy of today's `rules.ts`, and a prototype with decisions 1 and 2 built into `heldTwice` (whole-word places; a place is long at 3 words or more; two non-overlapping places fault with a "." between, or both long). The minimum and the whole-word test were switchable by environment variable, for the mutations;
  - `sr-rules.test.ts` pointed at each;
  - a scratch test of criterion 1's 4 cases and criterion 2's 8 new guards;
  - a probe of every phrase quoted in *the speech memo* and *run 5's memo* (43 windows) against every message the suite judges with L3 (13), on today's copy and the prototype;
  - adversarial phrases, built to the shapes the memos describe.

## What the brief asked, in short

1. **"Whole message twice, non-overlapping, whole words, 3 words with no separator": sound against every quoted phrase.** EXECUTED. Of 559 cells (43 windows × 13 messages), 14 are judged (L1 holds). Exactly one changes: VO chr's error-summary phrase, "Enter a project name", from pass to L3. That is the intended change. No test that passes today gains a fault. The quoted evidence is thin where the risk is: passing tests print no phrases, so P1, S1 and A1 under VoiceOver in run 5 are not in it.
2. **New false faults on today's passing tests: none found.** EXECUTED, above. P1's and S1's run-4 repeats, joined by `joinCaptures`, stay clean; S1's two raw entries fault in both, as today.
3. **The 3-word cut-off is arbitrary on its lower side.** EXECUTED: the same probe with the minimum at 1 or at 2 also changes only that one cell. No quoted phrase shows a false fault the minimum prevents. Its one known effect in the suite is on a real double read (finding 1).
4. **Whole-word matching breaks no existing test.** EXECUTED: `sr-rules.test.ts` on the prototype, **57 of 57 pass**, 116 expects. With the minimum at 1, 56 pass: only `L3(["Copied Copied"], "Copied")` → `[]` fails, which is the minimum's own guard.
5. **The mutation statements: mostly right, two gaps.** Patch 7 is untouched by case 2 (READ, one word). 7b's mechanism is misdescribed (finding 5). Patch 4's witness fails unpatched in the same window as 7b's, and the spec does not say so (finding 2). The `double-read` set is chosen per dispatch (READ, `matrix.yml:22–25`), so a set-specific window is buildable.
6. **The next-run outcome is not one outcome** (finding 3).

## Acceptance criteria against evidence

1. Seen failing first — **holds.** EXECUTED: today's copy **4 fail, 8 pass**; the 4 are criterion 1's. The prototype: **12 pass**.
2. Guards — **hold, with one mutation unnamed.** EXECUTED: minimum at 1 fails "3 results 3 results" and "Copied Copied"; the whole-word test removed fails "Reenter" and "Saved. 2 unsaved changes". The "go back go" guard passes on today's code too. Only the overlap test proves it: with `a.end <= b.start` mutated to `a.start < b.start`, it alone fails, and all 57 existing tests still pass (finding 7). The "Page 12 of 12" and "Success: … You are currently on a button." guards hold the message once; no plausible mutation fails them.
3. Other unit files — countable. `sr-items.test.ts` also imports `rules.ts` (`RULE_IDS`) and is not listed (finding 7).
4. The dry run — countable, and cannot fail for this change: a dry run judges no rule (READ, `022`). A smoke check, as the criterion says.
5. The next `matrix` push run — **not one outcome** (finding 3); the title may fault where decision 4 says it does not (finding 4).
6. The mutation sets — countable, **incomplete for patch 4** (finding 2).
7. The scorecard — countable.

## Findings, most severe first

1. **Medium: the 3-word minimum has no evidence behind it, and its one known effect is to judge the two readers unalike, against the owner's ruling** (decision 2; "Open questions": "None for the owner").
   - The ruling (*run 5's memo* §7, option 3): the rule learns VoiceOver's doubled phrase "so both readers are judged alike".
   - The minimum was chosen as the most it can be and still judge the summaries ("So 3 is the most the minimum can be"). That bounds it from above. Nothing bounds it from below. The case for it is INFERRED ("a one- or two-word message is the size of a button's name").
   - EXECUTED: with the minimum at 1, 2 or 3, the probe of every quoted phrase gives the same result: one change, the intended one. The minimum prevents no fault the evidence shows.
   - READ, *run 5's memo* §3.3: code-block's "Copied" is a real double read, "kind: item": the button's new name and its status both say it. NVDA's "Copied. Copied" faults. With the minimum, VoiceOver's "Copied Copied" in one part passes (the spec says so under "What the minimum costs"). That is the one short message in the suite with a known double, and the minimum lets one reader through and not the other.
   - It also keeps patch 7 unprovable under VoiceOver by that path (decision 5 says so).
   - Fix, either:
     - **(a) Drop the minimum (recommended).** Keep whole words and non-overlap. `L3(["Copied Copied"], "Copied")` becomes `["L3"]`, and "3 results 3 results" becomes a fault case. code-block then fails under VoiceOver as it does under NVDA, for the item fault lane I already has queued (*run 5's memo* §7). Criterion 2's minimum mutation is dropped.
     - (b) Keep it, and ask the owner, with options and the recommended first, since it departs from "judged alike". Record the answer in the landing notes.

2. **Medium: patch 4 is unprovable in the same window as 7b, and criterion 6 invites a `main` dispatch inside it** (decision 5; criterion 6).
   - READ, `table.ts:49–60`: patch 4's witness is the same insertion test as 7b's. Its expected entries are the same five tests as 7b's, × four pairs (READ, `main/expected.json`: 20 entries).
   - INFERRED, from the spec's own rule ("A patch is proven only by a witness that passes unpatched"): after this change and before `019b`, the insertion test fails unpatched under N-ff (run 5), VO chr and VO wk. So patch 4 proves nothing there either. Under N-ff that is true already since run 5; this change adds the two VoiceOver pairs.
   - A mutation run would still look matched. Patch 4 faults L1, and L3 returns its follow-on X0, which the unpatched L3 fault hides (READ, `L3`'s precondition; `derive.ts`, `mutationLines`).
   - Criterion 6 asks for "the next `mutate` dispatch for patch 7 under VoiceOver". That is a `main` dispatch. It applies patch 4 too (READ, `matrix.yml:53–54`, every patch in the set).
   - Fix: decision 5 states patch 4's window beside 7b's. A `main` dispatch before `019b` lands is read for patch 7 only, and its patch 4 result is recorded in the landing notes as not provable under N-ff, VO chr and VO wk, with the run id. `expected.json` and `notProvable` do not change for it. Say the same for 7b in place of "recorded as not provable" (where, and that `notProvable` is not touched).

3. **Medium: criterion 5 is not one outcome, depends on files this environment cannot fetch, and `019b` allows a push that makes it unobservable** (decision 4; criterion 5; `019b`'s "Depends on").
   - Criterion 5 passes on "the same under VO wk, or its passing phrases are recorded" and "or its phrase is recorded and ruled". It does not say what makes `022z` done, or what follows if VO chr does not fault.
   - READ, *run 5's memo*, "How to read": the artifacts' blob host is refused here. A passing test's phrases are only in `phrases.json`. So "its passing phrases are recorded" needs the owner, or another machine. The spec does not say who.
   - READ, `019b` "Depends on": "`022z` … lands first, or in the same push". In the same push, no run carries this change without `019b`, and decision 4's table is never seen.
   - Fix: state one outcome. `022z` is done when the next push run that carries it and not `019b` shows the four tests failing L3 "within phrase" under VO chr, for each message. If VO chr does not fault them, that is a finding: the rule does not match real speech, a research memo opens with the phrases, and the Status reads "built; awaits the speech run". VO wk either way is recorded, not required. Name the owner as the one who downloads `phrases.json` where an agent cannot. Ask `019b` to drop "or in the same push" (its review, finding 2).

4. **Low: the title may fault "within phrase" under VoiceOver, so decision 4's "none for its title" is inferred, not firm** (decision 4; criterion 2's first guard).
   - READ, *run 5's memo* §3.3: the quoted VO chr phrase ends in "…". It was printed by the second-submit test's first window, not by the insertion test, which passed.
   - READ, §3.5: on focus, VoiceOver reads the root as "There is a problem and 1 more item group". The first submit both inserts the alert and focuses the root.
   - EXECUTED: if that reading joins the alert's speech in one part ("… Choose who can see the project There is a problem and 3 more items group"), today's rule passes it and the prototype faults the title. With a ". " between, both fault, and run 5's VO chr pass of the insertion test rules that shape out. The one-part shape is not ruled out.
   - Fix: decision 4 says the title is expected not to fault, INFERRED, and that a title fault "within phrase" is recorded with its phrase as a finding about the alert and the focus move, for lane I, not ledgered. Criterion 2's guard keeps its case, labelled as built on a cut quote.

5. **Low: patch 7b is misdescribed** (decision 5, "After `019b`, a gain").
   - "7b gives the reader two alerts, root and content." READ, `double-read/7b-error-summary.patch`, in the main checkout and as `022t` regenerated it: it sets `role="alert"` on the root and `role={null}` on the content. One alert, on the element that takes focus: `019`'s old structure (`table.ts:140`).
   - The conclusion can stand on the right mechanism: the alert's reading and the focus move's reading of the same element may each say the title, possibly in one part. EXECUTED: "There is a problem Enter a project name There is a problem Enter a project name" faults the title and the message on the prototype, and neither today.
   - Fix: reword the mechanism; keep the conclusion as INFERRED.

6. **Low: the whole-word test is not applied to the adjacent-phrases case** (decision 2, "Whole-word places, in both cases"; decision 1, "Everything else in L3 stays").
   - EXECUTED: `L3(["Saved", "2 unsaved changes"], "Saved")` faults on the prototype, as today. The reason decision 2 gives ("'Saved' is not found inside 'unsaved'") holds there too.
   - EXECUTED: "Enter a password Re-enter a password" faults for "Enter a password": a hyphen is not a letter or digit. No form in the suite has such a field.
   - Fix: either apply whole-word matching to L3's adjacent case (`holds` stays as it is for U1 and the others), or say why not. Name the hyphen edge in the rule's comment.

7. **Low: three write-ins.**
   - Decision 1's reason for "anything may lie between" cites NVDA's "1 of 3". NVDA's phrase has a ". " between the two, so case 1 already catches it (EXECUTED: it faults today). Case 2 needs no gap for any quoted phrase. Reword the reason, or keep the gap as VoiceOver-only caution.
   - Criterion 2: name the overlap mutation (`a.end <= b.start` to `a.start < b.start`), which fails "go back go" alone (EXECUTED).
   - Criterion 3: add `sr-items.test.ts`, which imports `RULE_IDS` from `rules.ts`.

## Constitution checks

- §4.3 tokens: not touched.
- §4.4 accessible by default, and proven: the change makes the proof stricter. **At risk** until finding 1 is settled: the minimum leaves one reader's known double read unjudged.
- §4.5, §4.6: no dependency.
- §5 the pipeline: the research exists and is labelled; the owner's ruling is recorded in the specification. Finding 1's departure from it is the owner's to settle if the minimum stays. Criterion 7 re-runs the scorecard.
- §6 never: no item interface changes. Nothing copied.

## Verdict

Does not land yet: findings 1 to 3 (Medium). The minimum departs from the ruling without evidence; patch 4's window is unstated while criterion 6 invites a dispatch inside it; and criterion 5 is not one outcome. The rule's core is sound: EXECUTED, it catches the quoted VoiceOver double and adds no fault to any quoted phrase of a passing test.

## Disposition

The specification was revised on 2026-11-17 to answer all seven findings, with a "Review" section that maps each to its fix. The design lead ruled on finding 1: the minimum is dropped. This re-check reads the revision (192 lines, untracked) against each finding, on `release/0.13.0` at `b01e754`. Nothing in the repository was written but this file.

**Re-ran,** in the session's scratch folder, with Bun 1.4.4. EXECUTED:

- A second prototype, built to the revised Design: a word character is a Unicode letter, a digit or a hyphen; `heldTwice` faults on two non-overlapping whole-word places of any forms, with no separator and no minimum; L3's adjacent case uses a whole-word `holdsWhole`, and `holds` stays for U1.
- `sr-rules.test.ts` against it: **56 pass, 1 fail**. The fail is `L3(["Copied Copied"], "Copied")` → `[]`, the one expectation the Design turns to `["L3"]`. The writer's figure holds.
- Criteria 1 and 2's 14 cases: today's copy **6 fail, 8 pass**, the 6 being criterion 1's; the prototype **14 pass**.
- Criterion 2's mutations: the whole-word test removed fails 3 (both "unsaved" cases and the "Reenter"/"Re-enter" guard); the overlap mutation fails "go back go" alone. `sr-rules.test.ts` stays at 56 under each.
- **My own sweep of the quoted phrases.** Every straight- or curly-quoted string in *the speech memo*, *run 4's memo* and *run 5's memo* was taken by line, alone and with the other quotes on its line: 263 windows. Judged for the suite's 13 L3 messages wherever L1 holds: 43 cells. **Two cells change, both one verdict:** VO chr's error-summary phrase, for "Enter a project name", alone and with its neighbour, from pass to L3. No phrase of a passing test gains a fault. The writer counted 261 windows and 41 cells; the extraction differs by two windows, and the result is the same.
- My first, hand-built probe (43 windows): the same single change.
- Adversarial shapes: code-block's "Copied Copied" and "Copied button Copied" now fault, as NVDA's "Copied. Copied" does; "Saved", "2 unsaved changes" in adjacent entries no longer faults; the alert-and-focus title shape faults, as decision 4 now says it may.

**Each finding:**

1. **Closed.** The ruling is recorded in the header and in decision 2. The minimum is gone from the Design, criterion 1 adds "Copied Copied" and "3 results 3 results" as faults, and the minimum's mutation leaves criterion 2. Both readers are now judged by one condition. The cost is named in decision 4: code-block may newly fail under VoiceOver, for its known item fault. That is watched, recorded and not part of done, which is right.
2. **Closed.** Decision 5 states one window for patches 4 and 7b, with the reason (one witness), and how a `main` dispatch in it is read. `expected.json` and `notProvable` stay untouched. Criterion 6 holds the record. Patch 7 under VoiceOver is now conditional on the unpatched test passing there, which is correct with the minimum gone.
3. **Closed.** Criterion 5 is one outcome: VO chr's four tests fail L3 "within phrase" for each message, read from the job log. A failing test prints its phrases there (READ, *run 5's memo* §3.3), so no artifact is needed for it. A miss is a finding, with the Status set to wait. VO wk is recorded, not required, and the owner downloads its `phrases.json`. `019b` drops "or in the same push" and depends on this run.
4. **Closed.** Decision 4 states the title as expected not to fault, INFERRED, and rules a title fault a lane-I finding that does not count against criterion 5. Decision 3 and criterion 2 label the quote as cut, and from the second-submit test's first window.
5. **Closed.** Decision 5 describes 7b as one alert on the root.
6. **Closed.** The whole-word test applies to both L3 cases, and a hyphen is a word character. EXECUTED above. No L3 message in the suite starts or ends with a hyphen (READ, the `.sr.ts` files).
7. **Closed.** Decision 1's reason for allowing a gap no longer leans on NVDA. Criterion 2 names the overlap mutation. Criterion 3 lists `sr-items.test.ts`.

**One write-in, not blocking.** Criterion 2's "Reenter"/"Re-enter" guard proves the whole-word test, but not the hyphen in it: dropping only the hyphen from the word characters fails just the "Re-enter" half. The landing notes can record that third mutation beside the two named.

## Closing verdict

Fit to build. All seven findings are closed. EXECUTED: the rule catches VoiceOver's quoted double, judges both readers by one condition, and adds no fault to any quoted phrase of a passing test. Its one changed unit expectation is the intended one.
