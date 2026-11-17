# Review of 019b — The error summary's messages are read once

Reviews [`specifications/019b-the-error-summarys-messages-are-read-once.md`](../specifications/019b-the-error-summarys-messages-are-read-once.md) before it is built. Its research is [the error summary's list, read twice](../research/2026-11-17-the-error-summary-list-double-read.md) (*the memo*) and [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md) (*run 5's memo*), §3.3 and §7 with the owner's answer. This reviewer wrote neither the specification nor its research (constitution §5).

- **Date:** 2026-11-17
- **Status:** dispositioned; fit to build (see the re-check's closing verdict)
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (192 lines, untracked), with its Open questions answered (1 (a), 2 (a), 3 (a)). Checked against:
  - the item as `022t` builds it, in `.claude/worktrees/lane-i-attempt/` (`release/0.13.0` plus `022t`, at `71cb067`; read, not edited): `error-summary.svelte`, the item's page, both examples, the five components, `/view/error-summary-attempt/`;
  - `tests/e2e/error-summary.spec.ts` (`019`'s criteria 1, 9 and 12; `022t`'s criteria), `tag.spec.ts`'s AX-tree reader, `blocks.spec.ts`, `primitives.spec.ts`, `keyboard.spec.ts`, `tests/smoke/`, `scripts/cost/`;
  - `tests/sr/mutations/` (patches 4 and 7b as `022t` regenerated them), `tests/unit/mutations.test.ts`;
  - `019`'s specification (decisions 1, 9 and 11; criteria 1, 9 and 12); `022t`'s specification; `CHANGELOG.md`; `registry.json`; `src/lib/site/listed-items.ts`;
  - the companion specification `022z`.
- **Re-ran:** nothing in the repository or the worktree was written but this file. The worktree's tree (no `.git`, `node_modules` linked) was copied into the session's scratch folder and made a scratch git repository. Decision 1's markup and decision 7's header sentence were written into its item. It was served by `vite dev` (Vite 8.3.5), and driven by Playwright 1.64.1 in Chromium and WebKit from `/opt/pw-browsers`, with axe-core through `@axe-core/playwright`. Firefox is not installed. The dev server did not load the Geist web font, so absolute widths here differ from *the memo*'s built page; every comparison below is base against change in the same setup. EXECUTED:
  - **The look, both engines, at 1440 × 900, 390 × 844 and 320 × 700,** keyboard example after an empty submit: the summary's height (135.59 px), each link's width, height, top and left offsets, all **identical** to the base. Widths 132.05, 204.7 and 206.17 px, each inside a 322, 280 or 210 px row.
  - **The focus ring,** Tab from the root to the first link: `solid 2px`, offset 2 px, the link's own width, no clipping ancestor. Identical to the base.
  - **Long messages,** three links rewritten to 86 to 95 characters, one an unbreakable hyphenated token: identical heights, widths and wrapping to the base in both engines at all three sizes. At 320 the token overflows its row by 5 px in the base and in the change alike; the page does not scroll sideways.
  - **Screenshots:** 18 pairs (focused link, its ring with margin, the long-message summary; 2 engines × 3 sizes) are **byte-identical**, base against change.
  - **`019` criterion 12's specimens** at 1440: [98.78, 13, –], [107.59, 13, 42.59], [109.19, 13, 72.19], identical in both.
  - **The raw HTML,** the page's SSR fetched and loaded with scripts off: 3 specimens, **0 role attributes**, 2 links boxes.
  - **axe,** `019`'s six tags, on the component page after the empty submit, 1440 and 390, light and dark, both engines: **0 violations** each.
  - **Playwright's snapshot,** both engines: `alert` > `heading "There is a problem" [level=2]`, then the 3 links; no `list`.
  - **Chromium's tree** (`Accessibility.getFullAXTree`): each of the example's links has the `alert` as its nearest node not ignored, through two ignored nodes. The base: `listitem`. The specimens' links (no alert): `generic`.
  - **Criterion 3, 4 and 5's mutations,** Chromium: without `justify-items-start`, the links are 322, 280 and 210 px at the three sizes (and 480 px in the specimens); a `<p>` around each link gives a `paragraph`; `role="none"` on the links box gives 2 roles in the raw HTML. axe stays at 0 under all three.
  - **Self-relative widths:** each link's width equals a `Range` over its text, to 0.01 px, in both engines.
  - **The patches:** `git apply --check` of `main/4-error-summary.patch` and `double-read/7b-error-summary.patch` on the changed item: exit 0, stderr empty, alone and with each whole set. Also with the header sentence on a line of its own, a one-line offset: exit 0, stderr empty. `mutations.test.ts`: 29 pass.
  - **Unit tests on the changed copy:** `registry`, `registry-comments`, `blocks`, `mutations` and `thumbnails`: 201 pass, 2 fail. The fails are the thumbnail hashes (error-summary, sign-in, sign-up, settings: decision 10 regenerates them) and "a released snapshot exists" (the scratch repository has no tags).
  - **The registry build** (the dev server's plugin) rewrote 2 files: `error-summary.json` under `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/`.

## What the brief asked, in short

1. **Removing the list is the least change to what a reader meets.** Option 7 gives the tree option 6 gives, with no role attribute (EXECUTED). It is not the least change to the interface: option 6 keeps the `ul` and `li` elements, so an app's `[&_ul]` class would still match. Nothing in the repository depends on that (point 3), so the choice stands; the trade-off should be said (finding 5).
2. **`019`'s guarantees hold, and the look does not move.** EXECUTED, above: raw HTML 0 roles, axe 0, the specimens' figures, the example's widths, the ring, and 320 px wrapping, all identical in both engines.
3. **The interface-change note is right.** READ, grep of `src/`, `tests/`, `scripts/`: no `[&_ul]`, `[&_li]` or `ul`/`li` selector targets the summary; no block passes it a `class`; no test finds it by `getByRole("list")` or `"listitem"`. The only dependent is `019` criterion 1's snapshot, which criterion 2 rewrites. The cost interaction targets `[data-slot=error-summary] a`, which still matches.
4. **The five components need no edit: true.** READ: each passes `bind:ref`, `announce`, `attempt`, `errors` and `message`, or fewer; none passes `class` or styles a child. **Patches 4 and 7b still apply** (EXECUTED, above).
5. **The criteria are testable and seen failing where they say.** Criteria 1, 2 and 3 fail on the base (EXECUTED: `ul`, `listitem`). Criteria 4 and 5's guards fail under their mutations (EXECUTED). Criterion 4 is pinned to figures that move by engine (finding 3). Criterion 3 needs its page named (finding 4).
6. **The order `022t`, `022z`, `019b` is right, but "or in the same push" undoes it, and the no-dispatch window covers only 7b** (finding 2).

## Acceptance criteria against evidence

1. No list — countable; **seen failing holds** (EXECUTED: 1 `ul`, 3 `li` on the base; 0 and a links box of 3 `a` after).
2. The tree — countable; **seen failing holds** (EXECUTED, the snapshots above).
3. No wrapper in Chromium's tree — countable on the example; **seen failing holds** (`listitem`); its mutation fails it (`paragraph`). On the component page the specimens' links share the example's names and sit under `generic` (finding 4).
4. The look — `019` criterion 12 passes unchanged (EXECUTED). The width check's guard fails under its mutation (EXECUTED), but pinned base figures cannot hold across engines (finding 3).
5. The raw HTML — a guard; its mutation fails it (EXECUTED: 2 roles).
6. axe — countable; 0 before and after (EXECUTED, the component page; `/view/error-summary-attempt/` was not run here).
7. Nothing else moves — countable. READ: no test in `blocks`, `primitives`, `keyboard`, smoke or cost reads the list. `022t`'s criterion 1 counts links by role (`error-summary.spec.ts:636`).
8. The changelog — countable; seen failing on today's file. The bullet overstates VoiceOver (finding 6).
9. Registry and docs — countable; seen failing on today's files. EXECUTED: the existing unit checks pass on the changed item, but for the hashes decision 10 regenerates.
10. The dry run — countable.
11. The next CI speech run — an outcome per pair, but the title's risk under `022z` is not named, and its failure clause names one cause (finding 1).
12. The gates — countable.
13. The checkpoint — countable.
14. The scorecard — countable.

## Findings, most severe first

1. **Medium: criterion 11 may fail on the title, for a cause the specification does not name, and its failure clause would send the research the wrong way** (criterion 11; Open question 3's answer).
   - READ, *run 5's memo* §3.5: focused, the root is read by VoiceOver as "There is a problem and 1 more item group". The first submit, and with `022t` every submit, both inserts the alert and moves focus to the root.
   - READ, §3.3: the VO chr phrase quoted is cut at "…", so whether that reading shares the alert's part is not seen. Run 5's pass of the insertion test under VO chr rules out the two with a ". " between; it does not rule out one part.
   - EXECUTED, on `022z`'s prototype rule: "There is a problem Enter a project name Enter the owner's email address Choose who can see the project There is a problem and 3 more items group" faults L3 for the title. Today's rule passes it.
   - So after this change, VO chr or VO wk may fail the four tests on the title alone. Criterion 11 reads any VoiceOver double as "the cause is not the list item, and *the memo*'s §2 inference is wrong". For the title that is the wrong conclusion. The cause would be `019` decision 1's alert-and-focus design, which this change does not touch.
   - The clause also reaches past the evidence for VO wk: WebKit's tree cannot be read here (*the memo* §6), so a VO wk double does not show which element VoiceOver read.
   - Fix: criterion 11 names the title risk in advance. A title fault "within phrase" is recorded with its phrase as a finding about the alert and the focus move, not about the list. It opens research with the phrases, and the markup is not changed by guess. Extend Open question 3's answer to say `019b` stays landed then too. For a message doubled under VO wk, say only that the list was not its cause in Chromium's tree.

2. **Medium: "or in the same push" removes the run that shows the change is needed, and the no-dispatch window leaves out patch 4** ("Depends on"; decision 9).
   - The order is right: `022t` first (same item and lane, one build at a time), `022z` before this, so VoiceOver's double is judged.
   - But "`022z` … lands first, or in the same push" allows no run with `022z` and without this change. That run is the only CI evidence that `022z`'s rule catches VoiceOver's double on the list markup. Without it, criterion 11's "fails under `022z`" column is never seen, and a pass under VoiceOver cannot be told from a rule that never fires there. It also makes `022z`'s own criterion 5 unobservable (its review, finding 3).
   - READ, `table.ts:49–60` and `main/expected.json`: patch 4's witness is the insertion test, the same as 7b's, over the same five tests. Between `022z` and this change that test fails unpatched under N-ff and both VoiceOver pairs, so patch 4 proves nothing there either (`022z`'s review, finding 2). After this change it can be proven again: a gain decision 9 leaves out.
   - Fix: depend on at least one `matrix` push run that carries `022t` and `022z` and not `019b`. Its run id and the four tests' VoiceOver results go in the landing notes as criterion 11's seen-failing. State the window for both sets: from `022z`'s landing to this one, no `double-read` dispatch, and no `main` dispatch read for patch 4. Decision 9 adds that the first dispatch of each set after this lands records 7b and patch 4 as provable again under N-ff, VO chr and VO wk.

3. **Medium: criterion 4 pins widths that differ by engine, and Firefox's cannot be measured here** (criterion 4).
   - READ, *the memo* §4: the base widths are 128, 198 and 200 px in Chromium, and 128.1, 197.1 and 198.1 px in WebKit. Two differ by more than the ± 0.5 px allowed.
   - EXECUTED: on a dev server without the web font, the same links are 132.05, 204.7 and 206.17 px. The figure moves with the font as well.
   - The criterion runs "in every engine project in CI". Firefox has no build on this machine (*the memo*, "How to read"), so the builder cannot measure its base. A figure taken in one engine fails in another, for no fault of the change.
   - Fix: make the check self-relative. At both sizes, each link's width equals the width of a `Range` over its own text, ± 0.5 px, and is less than the links box's width. EXECUTED: equal to 0.01 px in Chromium and WebKit; the mutation without `justify-items-start` fails it (322 against 132.05). Keep the base figures in the landing notes as a record, not as the test.

4. **Low: criterion 3 does not say which page, and on the component page it fails for the specimens** (criterion 3).
   - EXECUTED: the component page holds the keyboard example and the specimens. Two of the specimens' links have the example's names ("Enter a project name", "Enter the owner's email address"). With no alert, their nearest node not ignored is a `generic`.
   - Fix: run it on `/example/error-summary/keyboard/`, or find the links by their DOM node inside `[data-testid="keyboard-fixture"]` (the CDP node's `backendDOMNodeId`).

5. **Low: decision 1 leaves out option 6's one advantage, and decision 9 misses the header sentence above both hunks** (decisions 1 and 9).
   - Option 6 keeps the `ul` and `li` elements, so an app's `[&_ul]` class still matches; option 7 makes it an interface change. Say so beside "Plain elements say the same with less", with the grep that shows nothing here depends on it.
   - Decision 9 says the edit is "about 15 lines below" the patches' lines. Decision 7's header sentence is above both. EXECUTED: the patches still apply with a one-line offset, stderr empty. Say that, so the builder does not regenerate them needlessly.

6. **Low: the changelog bullet and the page claim more than is known for VoiceOver** (decisions 6 and 7).
   - "Before, NVDA with Firefox, and VoiceOver, read each one as a list item and again as its link." VoiceOver's double is seen in Chromium only (*run 5's memo* §3.3); WebKit's is unseen (*the memo* §2).
   - "So a screen reader reads each message once" is READ for NVDA and INFERRED for VoiceOver until criterion 11's run.
   - Fix: "NVDA with Firefox, and VoiceOver with Chrome," in the bullet. If criterion 11 shows a VoiceOver double, the page's new sentence is amended with the finding.

7. **Low: decision 10 names the wrong generated files** (decision 10; Scope).
   - "The build regenerates `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/` for the same four." EXECUTED: the registry build rewrote only `error-summary.json` in each. The blocks' files did not change; in `022t` they changed because their own source did.
   - The thumbnails' manifest does move four hashes: error-summary, sign-in, sign-up and settings (EXECUTED, `thumbnails.test.ts`).
   - Fix: "for `error-summary`"; keep the cost sizes and the thumbnails' hashes at four.

## Constitution checks

- §4.3 tokens: met. One utility class is added; no colour or size literal.
- §4.4 accessible by default, and proven: met for the look, axe and the tree (EXECUTED). The speech proof waits on criterion 11, which findings 1 and 2 must make decisive.
- §4.5, §4.6: no dependency.
- §5 the pipeline: the research exists and is labelled; the owner's answers are recorded in the specification. Criterion 14 re-runs the scorecard.
- §6 never: an interface change with a changelog bullet and a migration note an app can follow (decision 6). Nothing copied; GOV.UK, NHS.UK and WET were studied in *the memo* only.

## Verdict

Does not land yet: findings 1 to 3 (Medium). Criterion 11 does not name the title's risk under `022z`; "or in the same push" removes the run that shows the change is needed, and patch 4's window is unstated; and criterion 4 pins widths that move by engine. The markup itself is sound: EXECUTED, it removes the wrapper in Chromium's tree, keeps axe and the raw-HTML check clean, looks pixel-identical in both engines down to 320 px, and leaves patches 4 and 7b applying.

## Disposition

The specification was revised on 2026-11-17 to answer all seven findings, with a "Review" section that maps each to its fix. This re-check reads the revision (212 lines, untracked) against each finding and against the revised `022z`. Nothing in the repository or the worktree was written but this file. Nothing new was run in a browser: the readings below are READ against the revision, and against the EXECUTED probes above. `022z`'s revised rule was re-run in the scratch folder for its own re-check, and its results bear on finding 1.

**A correction to this review.** "Reviewed" says the Open questions are answered (1 (a), 2 (a), 3 (a)). They are, at the top of that section; the revision keeps the answers and widens question 3 to cover a title fault. Nothing in the findings rested on them being open.

**Each finding:**

1. **Closed.** Criterion 11 now judges L1 for the title and every message, and L3 for every message. It names the title's risk in advance with its real cause, the alert and the focus move of `019` decision 1, and quotes this review's EXECUTED shape. A title fault is a lane-I finding with its phrase, opens research, and changes no markup by guess. A VO wk double is read only as "the list was not the cause in Chromium's tree". Open question 3 (a) covers a title fault too. EXECUTED, `022z`'s revised prototype: the alert-and-focus shape still faults the title, so the risk stands as stated.
2. **Closed.** "Depends on" drops "or in the same push" and requires one `matrix` push run with `022t` and `022z` and without this change, as criterion 11's seen-failing. It matches `022z` decision 4 and criterion 5. Decision 9 states the window for both sets, in the same words as `022z` decision 5, and records 4 and 7b as provable again after landing. The order `022t`, `022z`, that run, then `019b` is right.
3. **Closed.** Criterion 4 is self-relative: each link's width equals a `Range` over its own text, ± 0.5 px, and is less than the links box's width. EXECUTED above: equal to 0.01 px in Chromium and WebKit, and 322 against 132.05 px without `justify-items-start`. The base figures are a record only.
4. **Closed.** Criterion 3 runs on `/example/error-summary/keyboard/` and finds the links by DOM node inside the fixture.
5. **Closed.** Decision 1 names option 6's advantage and the grep; decision 9 names the header sentence's offset and the EXECUTED `git apply --check`.
6. **Closed.** The bullet claims one reading for NVDA and names "VoiceOver with Chrome" for the double. Decisions 6 and 7 say how the bullet and the page change with criterion 11's VoiceOver result.
7. **Closed.** Decision 10 and Scope name `error-summary.json` in the two `static/` folders, and keep four for the cost sizes and the thumbnails' hashes.

**One write-in, not blocking.** Criterion 11's table says "pass" for every cell, but its outcome leaves the title's L3 out. A title fault would leave that test failing in CI, and its row failing in the release check, while criterion 11 holds. Open question 3 (a) says so in effect ("leave the row failing until it passes"). A sentence under the table saying "pass" means the rules named, and that a title fault keeps the test red, would stop a reader taking the table for green.

## Closing verdict

Fit to build. All seven findings are closed. EXECUTED: the markup removes the wrapper in Chromium's tree, keeps axe and the raw-HTML check clean, looks pixel-identical in both engines down to 320 px, and leaves patches 4 and 7b applying. It builds after the `matrix` push run that carries `022t` and `022z` and not this change.
