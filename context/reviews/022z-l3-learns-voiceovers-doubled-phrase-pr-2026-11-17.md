# Review of 022z — L3 learns VoiceOver's doubled phrase (built)

Reviews the built change for [`specifications/022z-l3-learns-voiceovers-doubled-phrase.md`](../specifications/022z-l3-learns-voiceovers-doubled-phrase.md), against that specification as reviewed, its [spec review](022z-l3-learns-voiceovers-doubled-phrase-spec-2026-11-17.md) (seven findings closed, fit to build) and its research: [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) (*run 5's memo*), [the error summary's list, read twice](../research/2026-11-17-the-error-summary-list-double-read.md) (*the list memo*) and [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md) (*the speech memo*). This reviewer wrote neither the change, nor the specification, nor its research (constitution §5).

- **Date:** 2026-11-17
- **Status:** dispositioned; lands
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the worktree `.claude/worktrees/lane-e-022z`, branch `lane-e-022z`, at `47c680d` (`release/0.13.0` with `022t`, `022x` and `022y`), uncommitted.
  - `git diff`: 2 files. `tests/sr/rules.ts` (+49 −14) and `tests/unit/sr-rules.test.ts` (+96 −1).
  - Untracked: the specification, whose landing notes are filled in. Against the main checkout's copy, only the Status line and the landing notes differ (READ, `diff`).
  - Read beside them: every `.sr.ts` file that calls L3, for its messages; `tests/sr/mutations/table.ts`, both `expected.json`; `.github/workflows/matrix.yml`'s dispatch inputs; `019b`'s "Depends on" and decision 9 (main checkout, untracked); `src/lib/registry/ui/search-field/search-field.svelte`.
- **Before and after:** `git diff | sha256sum` → `591396ce…ee7966`; `git status --porcelain | sha256sum` → `caecbbc0…84a84c`; the specification → `1a4f989c…72b034a6`. The same after every probe (EXECUTED, `diff` of the two records: identical). `rules.ts` → `a34cd8eb…d98393b` before and after each swap. Each probe copy lived in the session's scratchpad. No file in the repository was written but this one.
- **Re-ran, EXECUTED,** with Bun 1.4.4 and Playwright 1.64.1:
  - `sr-rules.test.ts` with `rules.ts` at `HEAD` (`47c680d`) → **73 pass, 7 fail**, of 80. The 7 are the builder's 7.
  - `sr-rules.test.ts` on the built `rules.ts` → **80 of 80**.
  - The three mutations, each swapped in and restored (table below).
  - The edge cases of the brief, old rule against new, 58 cases in a scratch script (below).
  - A sweep of every quoted phrase in the three memos, old rule against new, in three shapes (below).
  - The gate (below).
  - Not run: any real reader.

## What the brief asked, in short

1. **The code matches decisions 1 and 2.** `wholePlaces` is a sound refactor: the whole-word test is written once, and `holdsWhole` and `heldTwice` read the same places.
2. **Failing first holds.** 73 pass, 7 fail on the old rule; 80 pass on the new.
3. **The three mutations each fail their guard,** as the landing notes say.
4. **No edge case faults a suite message falsely.** For the suite's 13 English messages, the new rule adds a fault only where one reader utterance holds the message twice. Three edges can miss a real double, or fault for a message the suite does not judge: combining marks, scripts written without spaces, and words glued by lost whitespace (findings 2 and 3).
5. **The sweep agrees with the builder's:** 314 windows, 49 cells, 2 cells changed, one verdict.
6. **The window and the next run are stated correctly,** with three gaps in wording or reach (findings 1, 4 and 5).
7. **Scope holds.** Nothing changed under `src/`, `static/`, `tests/sr/mutations/`, the ledger or the workflow.
8. **The gate passes.**

## Acceptance criteria against evidence

1. **Seen failing first, then passing — met.** EXECUTED: on `HEAD`'s `rules.ts`, the 6 criterion-1 cases of the new block fail, and so does the changed `["Copied Copied"]` case. The 8 guards pass. On the built rule, 80 of 80 pass.
   - One case holds two expects. "3 results 3 results" sits after "Copied Copied", so on the old rule its expect never runs. EXECUTED alone: the old rule gives `[]` for it, so it would fail first too.
2. **Guards, and proven by mutation — met.** EXECUTED, see "The mutations". Every other existing case passes unchanged: the one changed expectation is the Design's.
3. **The other unit files, check and lint — met.** EXECUTED: `bun test ./tests/unit` → **1937 pass, 2 skip, 0 fail**, of 1939, across 68 files. `bun run check` → 2434 files, 0 errors, 0 warnings. `bun run lint` → "All matched files use Prettier code style!".
4. **The dry run — met.** EXECUTED: `SR_DRY=1 bun run test:sr --project=chromium`, with a fresh build → **87 passed** (1.5 m). `SR_DRY=1 E2E_PREBUILT=1 bun run test:sr --project=webkit` → **87 passed** (1.4 m). A smoke check: a dry run judges no rule.
5. **The next speech run — not yet run.** The landing notes state it in advance. Findings 4 and 5 touch its wording.
6. **The mutation sets — stated; no dispatch yet.** Finding 1 widens the window to one more patch.
7. **The scorecard — a landing step.** No row is expected to move. There is no movement to cite yet.

## Decisions against the code

1. **L3 within one entry, amended — matches.** READ, `rules.ts:224–227`: `heldTwice` takes the whole-word places of every form and faults when one place ends at or before another starts (`a.end <= b.start`). The test for a "." between is gone. The precondition and both fault messages are unchanged (`rules.ts:238–254`).
   - Two places from equal forms at the same position do not count twice: `a.end <= a.start` cannot hold for a non-empty form. EXECUTED: one "Enter a password" with the forms `["Enter a password", "enter a password"]` gives `[]`.
2. **Whole words, in both cases — matches.** READ, `rules.ts:184–214`:
   - `WORD` is `/[\p{L}\p{Nd}-]/u`. `WORD_BEFORE` and `WORD_AFTER` anchor its source at the end and the start, with the `u` flag.
   - `wholePlaces` scans every occurrence (stepping by one, so overlapping occurrences are all seen) and keeps those with no word character just before or after.
   - `holdsWhole` replaces `holds` in the adjacent case only (`rules.ts:242`). `holds` stays for O2's checks and U1 (`rules.ts:373`, `:375`, `:439`, `:642`).
   - EXECUTED: an astral letter before a form ("𐐀x" for "x") is one code point, and blocks the place. So the code-point claim in the landing notes holds.
3. **The fixtures — match.** The three quotes are verbatim up to the memo's "…" (READ, *run 5's memo* lines 138 and 140). The constructed phrases are labelled CONSTRUCTED. The VO chr quote's label says it is cut and came from the second-submit test's first window.
4. **The next run — stated.** See findings 4 and 5.
5. **The mutation sets — no file changes.** `expected.json`, `notProvable` and `table.ts` are untouched (READ, `git status`). See finding 1.
6. **`022q`'s superseded text — not edited.** Right: `022q` is a landed record.

**`wholePlaces`, the helper beyond the Design.** It is private. It holds the only copy of the whole-word test, so the two L3 cases cannot drift apart. The Design named `WORD` and `holdsWhole`; `holdsWhole` is now one line over `wholePlaces`. The landing notes record the extra helper. Sound.

**Scope.** READ, `git status --porcelain`: ` M tests/sr/rules.ts`, ` M tests/unit/sr-rules.test.ts`, `?? context/specifications/022z-…`. `git diff --stat HEAD -- src static .github tests/sr/mutations tests/fault-ledger.ts` is empty. `022x`'s change to `rules.ts` is at lines 506 onwards (`C1`, `C2`, `inOrderAt`). It does not touch `normalise`, `holds`, `heldTwice`, `L3` or `joinCaptures` (READ, `git diff b01e754 HEAD -- tests/sr/rules.ts`). So "today's `rules.ts`" in criterion 1 is `b01e754`'s L3, as the landing notes say.

## The mutations (EXECUTED)

Each was written to the scratchpad, copied over `rules.ts`, run with `bun test tests/unit/sr-rules.test.ts`, and the built copy put back. `sha256sum` of `rules.ts` matched the built copy after each.

| Mutation | `sr-rules.test.ts` | Fails |
|---|---|---|
| Whole-word test removed: `WORD` is `/[^\s\S]/u`, which matches nothing | 77 pass, 3 fail | "within one entry, a message inside a longer word"; "in adjacent phrases, a message inside a longer word"; the "Reenter"/"Re-enter" guard, at its first expect (line 338) |
| Overlap loosened: `a.end <= b.start` to `a.start < b.start` | 79 pass, 1 fail | the "go back go" guard, alone |
| Hyphen dropped: `WORD` is `/[\p{L}\p{Nd}]/u` | 79 pass, 1 fail | the "Reenter"/"Re-enter" guard, at its "Re-enter" expect (line 341) |

The builder's figures hold.

## The edge cases (EXECUTED)

A scratch script ran 58 windows through the old L3 (`HEAD`) and the new. "Old" and "new" are the verdicts.

| Edge | Window → message | Old | New |
|---|---|---|---|
| Punctuation at word edges | "Copied." → "Copied" | pass | pass |
| | "(Copied) (Copied)" | pass | **L3** |
| | "(Copied)", "(Copied)" (adjacent) | L3 | L3 |
| | "Copied—Copied", "Copied/Copied", "Copied_Copied" | pass | **L3** |
| | "Copied-Copied" | pass | pass |
| Apostrophes | "Don't save. Don't save" | L3 | L3 |
| | "Don’t save Don't save" (curly, straight) | pass | **L3** |
| | "Don't", "Don't" (adjacent) → "Don" | L3 | **pass** |
| | "Enter the owner's email address Enter the owner’s email address" | pass | **L3** |
| Unicode letters | "Gespeichert Gespeichert"; "Привет Привет" | pass | **L3** |
| | "ungespeichert. Gespeichert" → "gespeichert" | L3 | **pass** |
| | "İstanbul İstanbul"; "Café Café" → "Café" | pass | **L3** |
| | "कि कि" → "क" (a base letter inside a syllable) | pass | **L3** (finding 2) |
| | "保存しました保存しました" (no space) | pass | pass (finding 2) |
| An empty message | "Copied Copied" → "" or "." | X0 | X0 |
| A prefix joined by a hyphen | "re-enter re-enter" → "re" | pass | pass |
| | "re-enter", "re-enter" (adjacent) → "re" | L3 | **pass** |
| | "re, re" → "re" | pass | **L3** |
| Numbers | "3 results 3 results" | pass | **L3** |
| | "13 results. 3 results"; "3 results. 23 results" | L3 | **pass** |
| | "Page 6 of 12. Page 6 of 120" | L3 | **pass** |
| | "1.3 results" → "3 results" | pass | pass |
| Glued words | "Page 6 of 12current page", "Page 6 of 12" | L3 | **pass** (finding 3) |
| Run 5's phrases | NVDA "Copied. Copied. Copy code"; VO chr "Copied button main. Copied. Copy code" | L3 | L3 |
| | VO "There is a problem and 1 more item group. You are currently on a heading level 2." → title | pass | pass |

**What this settles for the suite.**

- Every new L3 above is a message said twice. None is a word inside a longer word.
- Every new pass is a message found only inside a longer word, which the old rule took for a copy, or, in two cases, the edges of findings 2 and 3.
- INFERRED, from how guidepup joins a capture (READ, `022q`'s review, finding 2 and finding 4): both readers join separate utterances in one entry with ". ". So the old rule already caught every double across two utterances. The new rule adds only a double inside one utterance. For the suite's 13 messages, that is a real double read, not a false fault.
- No caller passes L3 a list of forms (READ, every `L3(` call in `tests/sr/`). EXECUTED: a form that holds another form twice would fault, `L3(["Page 12 of 12"], ["Page 12 of 12", "12"])` → L3. Not reachable today; noted under "Checked, not findings".

## The quoted-phrase sweep (EXECUTED)

My own extraction, by the landing notes' method: every straight- or curly-double-quoted string in *the speech memo*, *run 4's memo* and *run 5's memo* (main checkout), taken by line. Each string makes one window alone. Each line with two or more makes one more window, its strings as adjacent phrases. Each window is judged for the suite's 13 L3 messages wherever the old L3 does not return X0.

- **314 windows, 49 cells, 2 cells changed, one verdict:** *run 5's memo* line 140, VO chr's "There is a problem Enter a project name Enter a project name …", for "Enter a project name", pass to L3, alone and with its line's ". ". The builder's figures, exactly.
- With *the list memo* and run 1's and run 3's memos added: 356 windows, 55 cells, 3 changed. The third is the same VO chr phrase, quoted again in *the list memo* (line 58).
- **Two harsher shapes,** beyond the method:
  - each line's strings joined with ". " into one entry, as NVDA logs a capture: 56 windows, 17 cells, **1 changed**, the same phrase;
  - each line's strings joined with " " into one part, which no reader is known to do: 5 changed. Each is a message the memo quotes twice as two phrases: "Page 6 of 12" twice (*the speech memo* line 150, VoiceOver's run-4 repeat, which `joinCaptures` drops), and "Copied" twice (*run 5's memo* lines 136, 137 and 267). Each is a double the rule should fault if a reader ever said it in one part.
- **No phrase of a passing test gains a fault.** The evidence stays thin where risk is: passing tests print no phrases.

## Findings, most severe first

1. **Low: patch 9's witness can fall into the window too, and the landing notes read a `main` dispatch for patches 4 and 7 only** (decision 5, "Patch 6 and the others are not touched: their faults are not L3"; landing notes, "The window").
   - READ, `table.ts`: patch 9 (`9-pagination-status.patch`, fault L1) has P1 as its witness, "P1 a page is said: … once, and not before". P1 applies L3 (READ, `pagination.sr.ts:37–42`).
   - Decision 4 watches P1 under VoiceOver, because the new case can now reach it. If VoiceOver says "Page 6 of 12" twice in one part, P1 fails L3 unpatched in that pair. Then patch 9 proves nothing there, yet looks matched: the patch faults L1, and L3's follow-on X0 hides behind the unpatched fault. That is the mechanism the spec review's finding 2 named for patch 4.
   - Patch 6 and the others are safe for a different reason than the one decision 5 gives. What matters is not the patch's fault, but whether its witness applies L3. Besides the insertion test (patches 4 and 7b), only patch 7's witness (code-block) and patch 9's (P1) apply L3 (READ, `table.ts` against each witness's `declared` rules).
   - Fix (landing notes): under "A `main` dispatch in the window", add: "If P1 fails L3 unpatched under a VoiceOver pair in the same run, patch 9 is recorded as not provable there, with the run id, as patch 4 is." No code change.

2. **Low: the word characters leave out combining marks, and the whole-word test cannot see a word in a script written without spaces** (decision 2; `rules.ts:184`).
   - EXECUTED: `L3(["कि कि"], "क")` → L3. The vowel sign is a mark (`\p{M}`), not a letter, so "क" counts as whole inside "कि". The same holds for a Latin letter whose diacritic NFKC cannot compose. The old rule passed it.
   - EXECUTED: in Japanese, `L3(["保存しました保存しました"], "保存しました")` → pass, and a message beside other Japanese text in an adjacent phrase is not found at all, where `holds` found it.
   - No suite message is affected: all 13 are English (READ, the `.sr.ts` files). But the comment says "a Unicode letter", which reads as a promise for any language, and Kuiper is a public product.
   - Fix (small, in this build): `WORD` becomes `/[\p{L}\p{M}\p{Nd}-]/u`, with a unit case for "कि" and its mark. The comment says the whole-word test assumes words are parted by spaces or punctuation. Or, with no code change: the comment and decision 2 say the rule is built for the suite's English messages.

3. **Low: words glued by lost whitespace now hide a double the old adjacent case caught** (decision 2; `rules.ts:242`).
   - READ, *run 5's memo* §7: real speech loses spaces. NVDA with Chromium said "Previouspage, button".
   - EXECUTED: `L3(["Page 6 of 12current page", "Page 6 of 12"], "Page 6 of 12")` → old L3, new pass. L1 still passes, by substring.
   - No quoted phrase shows it (the sweep). It is the price of decision 2, and decision 2 is the right trade: "Saved" in "unsaved" is the likelier shape.
   - Fix (landing notes): name it under "Watched, not part of done": an L3 message found glued to a word is recorded with its phrase, and is a finding about the item's spacing, for lane I. No code change.

4. **Low: the expected outcome names one fault message, and L3 checks the adjacent case first** (decision 4; criterion 5; landing notes, "The next speech run").
   - READ, `rules.ts:241–252`: L3 returns "… was read twice in a row (phrases N and N+1)" before it looks within a phrase. The outcome that makes `022z` done is "… was read twice within phrase N" under VO chr.
   - INFERRED: run 5's VO chr pass of the insertion rules out the adjacent shape for that test there, under a looser match. So "within phrase" is the likely message. But the landing notes do not say what an "in a row" fault for each message would mean for done.
   - Fix (landing notes): say that an L3 fault "in a row" for each message also meets criterion 5, and is recorded with its phrase; or that it does not, and opens research. The first is recommended: both are the double read the owner ruled on.

5. **Low: the window's close is stated more firmly than `019b` states it** (landing notes, "The window …", last item).
   - The landing notes: "`019b` decision 9 records patches 4 and 7b as provable again."
   - READ, `019b` decision 9 (main checkout): the first `main` dispatch and the first `double-read` dispatch after `019b` lands each record patch 4 and patch 7b "as provable again under NVDA with Firefox, VO chr and VO wk, or which pair still is not".
   - Fix (landing notes): "The window closes when `019b` lands. The first dispatch of each set after it records, in `019b`'s landing notes, whether patches 4 and 7b are provable again in each of the three pairs (`019b` decision 9)."

**Checked, not findings.**

- **Forms.** A form that holds another form twice faults (EXECUTED, above). No L3 caller passes forms. If one ever does, decision 2's "a form is matched whole, never a word in it" should name it.
- **Edges that are not word characters.** The boundary is tested even where a form starts or ends with punctuation. EXECUTED: "(required)x (required)" → pass for "(required)". No suite message starts or ends with punctuation after `normalise`.
- **Search-field S1** ("3 results") is one of the 13 messages and is not on the watched list. READ: the search input has no `aria-describedby` to its status (`search-field.svelte`), so VoiceOver has no second path to say the count in one part. A new S1 fault would still be recorded under the general rule for watched tests; adding S1 by name to that list costs a line.
- **The second submit.** With `022t` on this branch, it applies L1 and L3 to the title and each message (READ, `error-summary.sr.ts:57–78`). "Expected to fail as the insertion does" is consistent with decision 4.
- **The insertion's other tests in patch 4's set.** READ, `main/expected.json`: patch 4 expects L1 in 20 cells, the five error-summary tests × four pairs. The landing notes' "not provable under NVDA with Firefox, VO chr and VO wk" covers them.
- **`double-read` dispatches.** The set is chosen per dispatch (READ, `matrix.yml:22–25`), so "no `double-read` dispatch in the window" is a rule an operator can keep. None has run: run 6 is a push of `b01e754` (READ, *run 5's memo* §9), which does not carry this change.
- **The landing notes' gate figures** match mine, except the dry-run times (1.5 and 1.8 m against my 1.5 and 1.4 m), which are machine load.

## Constitution checks

- §4.1 source, not a package; §4.3 tokens; §4.5, §4.6 pins and dependencies: met. Only test code changes. No dependency is added.
- §4.4 accessible by default, and proven: the change makes the proof stricter, and judges both readers by one condition, as the owner ruled. Findings 2 and 3 are limits of the whole-word test that no suite message reaches today.
- §5 the pipeline: research, specification, spec review and tests exist. Every new check was seen failing first (EXECUTED). Each mutation fails its guard (EXECUTED). The scorecard is re-run after landing.
- §6 never: nothing committed or pushed. No prior art copied. No item changes.

## Verdict

**Lands, once the landing notes take findings 1, 4 and 5.** No finding is above Low. The code matches decisions 1 and 2, and `wholePlaces` is a sound refactor. EXECUTED: the rule fails first and passes after, each mutation fails its guard, the gate is green, and the sweep changes one verdict, the intended one. Finding 2's one-line `WORD` change is recommended in this build, or its limit is stated in the comment. Finding 3 is a line in the watched list.

## Disposition

By the design lead, 2026-11-17. All five findings are written into the spec's landing notes ("After the change review"); finding 2 also as a comment on `WORD` in `rules.ts` (no code change). **Closing verdict: lands.**
