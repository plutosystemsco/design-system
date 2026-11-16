# Review of 022t — The error summary speaks again on an unchanged submit

Reviews [`specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md`](../specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md) before it is built. Its research is [the error summary's re-announcement](../research/2026-11-16-error-summary-re-announcement.md) (*the memo*) and the error-summary row of [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md) (*the speech memo*). This reviewer wrote neither the specification nor its research (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (204 lines, untracked), on `release/0.13.0` at `c5cdd65`. Checked against:
  - `src/lib/registry/ui/error-summary/error-summary.svelte`, the item's page, both examples;
  - the five components (`sign-in-form`, `sign-up-form`, `sign-up-verify`, `settings-form`, `settings-delete`) and the views `/view/sign-in/`, `/view/sign-in/errors/`, `/view/sign-up/verify/`, `/view/settings/failed/`;
  - `tests/e2e/error-summary.spec.ts`, `tests/e2e/blocks.spec.ts`, `tests/sr/error-summary.sr.ts`, `tests/sr/fixtures.ts` and, after `022q` landed during this review (`9af3248`), `tests/sr/sr.ts`, whose `fact`, `focused` and dry `judge` behave as before;
  - `tests/sr/mutations/` (`table.ts`, `derive.ts`, patches 4, 5 and 7b, both `expected.json`), `tests/unit/mutations.test.ts`;
  - `023` decision 5 and `tests/unit/api-described.test.ts` (V1 to V7); `scripts/cost/budgets.json` and `report.json`; `tests/unit/blocks.test.ts`'s view guard; `TEST_VIEWS` in `tests/e2e/pages.ts`;
  - Svelte 5.57.3's `blocks/key.js`, `blocks/branches.js` and `tick()` (`runtime.js:507–522`);
  - NVDA's `master`, read 2026-11-16 through raw.githubusercontent.com into the session's scratchpad (GPL 2, read only, nothing copied): `NVDAObjects/IAccessible/__init__.py` (`event_alert`, lines 2025–2050) and `eventHandler.py` (`FocusLossCancellableSpeechCommand`).
- **Re-ran:** nothing in the repository was written but this file. A copy of the tree at `c5cdd65` (no `.git`, `node_modules` linked) was made in the session's scratchpad. The copy was patched as decisions 1, 2, 6 and 7 say, with a scratch test view as decision 10 says, served by `vite dev`, and driven by Playwright 1.64.1 scripts in Chromium and WebKit from `/opt/pw-browsers`. Firefox is not installed. EXECUTED:
  - **Keyboard example, the second unchanged submit, both engines.** One `MutationObserver` callback on the root holds two records: the new content node added, then the old one removed. Nothing else is written in the root. The root is the same element, and focused. The new node has `role="alert"`, the heading and 3 links. The old node is disconnected. The height moves by 0 px.
  - **The order, both engines:** the observer callback, then the root's `focus`, then the next animation frame and the next task. So the insertion and the focus move share one task.
  - **Focus inside the content when the key changes** (a link focused, then `requestSubmit()` from script). The example then refocuses the root. Chromium fires `focusout` on the removed link; WebKit fires none. Focus ends on the root in both.
  - **The five components, each path done twice** (events in order; "new" = a new content node with `role="alert"`, root focused). Sign-in empty: `add,remove,focus`. Sign-in refused: `remove,add,focus`. Sign-in errors view: `add,remove,focus` on the first submit. Sign-up empty, code step empty, settings empty name: `add,remove,focus`. Settings failed save, failed delete: `remove,add,focus`. All new, in both engines.
  - **Criterion 5's named guard mutation** (`attempt += 1` moved after `await tick()` in sign-in's `failed()`). Refused, second time: `remove,add,focus-root,add,remove`. Empty, second time: `focus-root,add,remove`. Both engines. See finding 1.
  - **The test view.** A: errors from `$derived`, one entry for "Notes" that reads its value. Typing 5 letters in Notes: 0 records in A or B, A's node kept. A second submit: a new node in A, B's node kept, A's root focused. With the item keyed on `errors` instead: 10 records in each summary, A's node replaced. With a derivation that does not read Notes: 0 records under `{#key errors}` too. See finding 4.
  - **The mutation patches.** `git apply --check` on the patched copy: 4 and 7b fail ("patch does not apply" at line 141); the other nine pass, patch 5 included.
  - `bun --bun playwright test tests/e2e/error-summary.spec.ts --list --project=chromium-light` on the repository: **19 tests**, as criterion 7 says.
  - The proposed doc comment is **40 words** by `api-described.test.ts`'s `split(" ")`: at V4's limit.

## What the brief asked, in short

1. **A fresh insertion: yes.** EXECUTED, above. The reader-visible change is one content node replaced, inside one task, with its children in it.
2. **The memo's reading of NVDA: right, and READ further.** `event_alert` drops an alert that is an ancestor of the focus, or that has no name, description or children (`__init__.py:2029–2037`). Focus lands on the root, the content's parent, and the node comes with its children. The alert speaks at `Spri.NOW`. Its speech is cancellable on focus loss, but stays valid while the object "never had focus" (`eventHandler.py`, `_checkIfValid`). The content node never takes focus. So a later "section" does not cancel it. One gap stays: on the first submit the root is created too; on the second it exists. The two submits are alike, not identical (finding 2).
3. **The negative check holds, with one write-in.** The test view is the least addition: no unit test mounts a component in a DOM, and the example must not re-derive. Its guard is blind unless the derivation reads Notes (finding 4).
4. **Server-refused repeats: true in all five,** by READ (each clears before it awaits). EXECUTED in three: sign-in, settings' save and settings' delete. The delete's callback rejects at once, and the removal still flushes first. The prop adds no second insertion there. The throw paths and the delete already say the failure twice, once in the summary and once in the form's `Status`. That is today's behaviour, not this change's, and out of scope.
5. **Interface: additive and safe.** Undefined is a constant key: summary B kept its node through typing and two submits. The doc comment and "Your part" are specified, with a wording fault (finding 5). Cost: the memo's 11,872 B is under 12,900. The blocks' measured interaction is the first submit, which this does not change. Apps that pass `attempt` with no alert: with `announce={false}` the content renders anew in silence, and a focused link inside is lost. Decision 3 says the first. The page should say both (finding 7).
6. **Patches 4 and 7b stop applying: yes.** EXECUTED. Regeneration needs a procedure, and 7b's effect on the second submit changes (finding 3).
7. **Criteria:** see the next section. Criterion 5's guard cannot fail (finding 1), and criterion 14 is not one outcome (finding 2).
8. **Open questions:** both are framed with options, the recommended first. One is missing: what follows a failed criterion 14 (finding 2).

## Acceptance criteria against evidence

1. A new content node on the second submit, before focus — countable, **seen failing holds**. EXECUTED: (a) to (f) all hold on the patched copy, in both engines. The observer's two records arrive added-then-removed; the check must not depend on their order (finding 6).
2. Typing re-renders nothing, in the example — countable; a guard no mutation can fail, as the specification says. INFERRED: harmless, since criterion 3 carries the proof.
3. Re-derived errors re-render nothing — countable, **proven only if the view reads Notes**. EXECUTED: 0 records with `attempt`, 10 under `{#key errors}`, and 0 again under `{#key errors}` with a derivation that skips Notes (finding 4).
4. Each block's client check speaks again — countable, seen failing per *the memo* §1.4. EXECUTED with the fix: four new nodes. **Not sufficient:** it checks no order, so a late `attempt` passes it (finding 1).
5. Each server path stays one insertion — **cannot fail for its own mutation.** EXECUTED: with `attempt += 1` after `await tick()`, one node is still added between the submit and the root's focus; the second comes after it (finding 1).
6. A summary present at load is announced on the first client failure — countable. EXECUTED with the fix: `add,remove,focus`, new node with `role="alert"`.
7. Nothing else moves — countable. EXECUTED: 19 tests listed; the look's ± 0.5 px is met (0 px moved).
8. The dry speech run — countable. READ: a dry run fails only on `sr.dom` facts (`tests/sr/sr.ts:353–355`, where `022q` moved `Sr`), so the new fact can be seen failing on today's item. How the fact is taken is unstated (finding 6).
9. Registry and docs — countable. INFERRED: nothing checks the new "Your part" text (finding 7).
10. axe on the test view — countable.
11. Cost — countable. READ: a stale runtime figure for the blocks is named, not failed (`cost.test.ts:388`); the release check holds it.
12. The changelog — countable; the bullet's last sentence is wrong (finding 5).
13. The gates — countable.
14. The next CI speech run — **not one outcome** (finding 2).
15. The scorecard — countable.

## Findings, most severe first

1. **High: criterion 5's guard passes under the mutation that is meant to prove it, and criterion 4 checks no order** (criteria 4 and 5; `sign-in-form.svelte:131–135`).
   `failed()` sets state, awaits `tick()`, then calls `summary?.focus()` at once. A state write after the `tick()` is flushed in a later microtask, so after the focus move. So "exactly one content node between the submit and the root's focus" stays true when `attempt` is raised late.
   Failure: EXECUTED, both engines, `attempt += 1` moved after `await tick()`. A refused sign-in, second time: `remove,add,focus-root,add,remove`. One node before the focus: criterion 5 **passes**. An empty sign-in, second time: `focus-root,add,remove`. The node is new and the root focused: criterion 4 **passes**. The mutated form also inserts the alert twice on its first failure (`add,focus-root,add,remove`). That is the double announcement criterion 5 exists to catch.
   Fix: in criteria 4 and 5, count from the submit until 500 ms after the root's `focusin`. Require exactly one content node added in that span, and its observer callback before the `focusin`, as criterion 1 (b) does. Keep the named mutation; with this wording it fails both criteria (EXECUTED: the late insertion falls inside the span, and after the `focusin`).

2. **Medium: criterion 14 does not say what happens when it fails, and VoiceOver may now fail L3 where it could pass** (criterion 14; decision 2, "exactly as on the first submit"; *the speech memo*, line 150).
   Criterion 14 lands after the merge. Its NVDA bullet is an outcome. Its VoiceOver bullet passes on "did not reach it". Its last bullet records a failure and names the next step. So a reader cannot tell whether `022t` is done when NVDA still says "section". Constitution §4.4 says such a gap is a finding to fix, never a limit to record. Two risks are not stated in advance:
   - INFERRED: today the second submit under VoiceOver is one reading, of the focused root. After this change it is an alert and a focus move, the first submit's shape. *The speech memo* saw VoiceOver read sign-in's first-submit summary twice (VO chr, once, then passed on retry): an L3 fault. So the second-submit test may now flake L3 under VoiceOver.
   - INFERRED: the second submit is not the first. On the first, the root is created with its content; on the second, the root exists and only the content is new. Engines may order the focus and alert events differently. The memo's speech evidence is for the first.
   Fix: state criterion 14 as one outcome. `022t` is done when "the second submit, unchanged" passes L1 and L3 in both NVDA pairs, and in each VoiceOver pair it reaches. Until that run, the Status line reads "built; awaits the speech run". A failure keeps the error-summary row failing in the release check, and opens a research memo (the Windows event probe), not a limit. Name the VoiceOver L3 risk, and say a retry-passed L3 is judged as `022` already judges the insertion test. Add the owner question in finding 8.

3. **Medium: patch 7b's behaviour on the second submit changes, and its regeneration has no procedure** (decision 11; `mutations/table.ts:135–145`; `double-read/expected.json`).
   EXECUTED: 4 and 7b no longer apply once `{#key attempt}` sits between `<WarningCircle>` and the content `<div>`. Prettier's re-indent would move more lines. The other nine patches still apply.
   - READ: 7b's derived entries include "the second submit, unchanged" in all four pairs, with L3. Today 7b's second submit writes nothing: focus lands on an unchanged alert root. INFERRED: under `022t`, a new subtree is inserted inside the alert root, then focus lands on it. In Chromium that is a change inside a live region, not a new alert (*the memo* §4.4). Whether it is read twice is unknown. The specification says the patches keep "the same effect". Their text does; what they make readers do on the second submit does not.
   - READ: patch 4's second-submit entries (L1) become provable for the first time, since that test should now pass unpatched. That is a gain; say so.
   Fix: give the procedure. Make the edit by hand on the new item, inside the key block, after `prettier --write`. Write it with `git diff -- src/lib/registry/ui/error-summary/error-summary.svelte`, then restore the file. Run `mutations.test.ts`. State in advance, per `022` decision 15, that 7b's second-submit entries may not fault L3. Say they go to `notProvable` with the dispatch run that shows it, and that criterion 14's run names the next `mutate` dispatch.

4. **Medium: the test view's guard is blind unless the derivation reads Notes** (decision 10, "Notes adds an entry that does not depend on its text"; criterion 3).
   `$derived` re-runs only when a value it reads changes. An entry that "does not depend on its text" may be written without reading the text. Then typing in Notes re-derives nothing, and the `{#key errors}` mutation cannot fail the check.
   Failure: EXECUTED. With the Notes entry written as `true && { … }`, the view under `{#key errors}` records 0 mutations for 5 letters typed. Criterion 3's guard passes under its own mutation.
   Fix: say the derivation reads every field's value, Notes included. Example: one `validate({ name, notes })` that returns a new array each call, the Notes entry present whatever its text. Also say the errors are empty until the first submit, so neither summary is in the page at load. Add to criterion 3: "the mutation `{#key errors}` records at least 5 mutations in A", so a blind view is seen.

5. **Low: the doc comment breaks `023`'s rules for a data prop, sits at V4's limit, and its last sentence is wrong** (decision 1; decision 12's first bullet).
   - `023` decision 5: "A data prop opens with a noun phrase." The comment opens with an imperative.
   - It is 40 words by the test's count. Any added word fails V4.
   - "Leave it out and the summary is announced only when it appears" is false: a summary whose text changes is announced too (`019` decision 1). The changelog bullet repeats it.
   Fix, 37 words: "The count of failed submits. Raise it by one on each, and the content renders anew, so a screen reader announces it again even when nothing changed. Without it, only a new or changed summary is announced." Changelog: "Leave it out and a summary is announced when it appears or its text changes, as before."

6. **Low: three write-ins for the tests** (criteria 1 and 8; decision 11).
   - Criterion 1 (a): the two records come added-then-removed (EXECUTED). Say the check counts records in the callback, in any order.
   - "Seen failing": if the example passes `{attempt}` before the item knows the prop, the old item spreads it onto the root as an attribute, and the observer sees an attribute write, not "no mutation". Say the failing run is on the base's item, and that it fails as "no content node added or removed".
   - Decision 11's fact "the content node is a new node": say how. For example, take an `ElementHandle` of the content before the second submit, and record `sr.fact("the old content node is disconnected", !(await old.evaluate((n) => n.isConnected)))`.

7. **Low: the page's new text has no check, and leaves out two duties** (decision 9; criterion 9).
   Nothing fails if "Your part" loses the `attempt` sentence or the header comment loses its own. `registry.test.ts` holds this page's lines elsewhere (`019`'s describe).
   Fix: add to criterion 9 a unit check that the page holds "raise `attempt`" in "Your part", and the item's header comment names `attempt`. Add two sentences to "Your part": "With `announce={false}`, a new `attempt` renders the content again in silence." And: "Raise it only on a failed submit, never while focus is inside the summary: a link focused there is lost." EXECUTED: focus falls from a removed link, with `focusout` in Chromium and none in WebKit.

8. **Low: one owner question is missing** (Open questions).
   What follows a failed criterion 14 is the owner's call: it decides whether 0.13.0 ships with the row failing. Add:
   - **(a) Keep `022t` landed (recommended).** No check shows harm. Record the run. Open the Windows event probe as research. The row stays failing until it passes.
   - (b) Revert `022t` and defer the row to 0.14.0.

## Constitution checks

- §4.1 source, not a package: met. The prop is in the item's source; the blocks keep their counters inside.
- §4.3 tokens are the one source: not touched. No colour or size; the key block adds no style (EXECUTED: 0 px).
- §4.4 accessible by default, and proven: **at risk** until findings 1 and 2 are fixed. The order guard cannot fail, and the speech outcome reads as recordable.
- §4.5, §4.6 pins and dependencies: met. No dependency.
- §5 the pipeline: the research exists and is labelled. The owner's choice is recorded in the roadmap's `022t` row. Criterion 15 re-runs the scorecard.
- §6 never: an additive prop, with a changelog bullet; no installed app breaks. Nothing copied; NVDA's source was read only.

## Verdict

Does not land yet: finding 1 (High), criterion 5's guard passing under its own mutation with no order check in criterion 4, and findings 2 to 4 (Medium), criterion 14's outcome, patch 7b's effect and regeneration, and the test view reading Notes.

## Disposition
