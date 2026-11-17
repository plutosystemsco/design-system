# 022t — The error summary speaks again on an unchanged submit

- **Status:** built; awaits the speech run (criterion 14). The spec review (`reviews/022t-the-error-summary-speaks-again-on-an-unchanged-submit-spec-2026-11-16.md`, two re-checks: fit to build) and the change review (`reviews/022t-the-error-summary-speaks-again-on-an-unchanged-submit-pr-2026-11-16.md`: lands, three Low findings written in) are dispositioned.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** specification, lane I. An additive interface change to one item, `error-summary`: a new optional prop. Five components in three blocks (`sign-in`, `sign-up`, `settings`) pass it, and so does the item's keyboard example. The item's page changes, and one test view is added. No token and no dependency changes. It is a specification, not a small change, because it adds a prop, and the owner chose that prop from options.
- **Depends on:** `019` (the item's structure: the alert inside, focus on the root); `022` (the speech suite and its mutation sets); `022q` (the speech suite's own faults), landed at `9af3248`, so the next CI run judges this change with its rules; it moved the `Sr` class to `tests/sr/sr.ts`. In lane I it builds after `022r` and `022s` land, one build at a time (roadmap §2, "Lanes").
- **Research it stands on:** [the error summary's re-announcement](../research/2026-11-16-error-summary-re-announcement.md), cited as *the memo*, by section; [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md), the error-summary row; [`019`](./019-the-error-summary-alert-inside-and-the-label-in-view.md), decisions 1 to 3 and 12.
- **The owner's choice (2026-11-16):** a prop, from three options (a prop; a rule apps follow; defer to 0.14.0). An optional number, working name `attempt`, that the app raises on each failed submit; the summary re-announces on each new value; the five blocks and the example pass it; additive. Recorded in the `022t` row of `roadmap.md`.

## Intent

The error summary is the box a failed submit puts at the top of a form. `019` promises that a second failed submit, with the same errors, is spoken again: the title and every message. Under NVDA it is not. NVDA says "section" and nothing more (the speech memo).

The cause is that nothing changes (*the memo* §1.3). The errors are the same, so Svelte writes nothing, and no browser fires an alert. Only focus moves, to a root with no role and no name. The item cannot tell an unchanged failed submit from any other update (*the memo* §1.5). Only the app knows a submit failed.

This change gives the app a way to say so. The app raises `attempt` on each failed submit. Each new value renders the summary's content anew, so the browser sees a new alert, as on the first submit. An app that never passes `attempt` keeps today's behaviour.

**Terms of art.**

- A **live region** is an element whose changes a screen reader speaks without focus moving there. `role="alert"` makes an assertive one.
- An **alert event** is the platform event a browser fires when an alert appears. Readers listen for it.
- The **root** is the item's outer element, `data-slot="error-summary"`. It has `tabindex="-1"` and no role. Apps focus it.
- The **content node** is `data-slot="error-summary-content"`. It carries `role="alert"` while `announce` is true, and holds the title, the message and the links.
- An **unchanged failed submit** is a failed submit whose errors are the same as the last one's.
- A **client check** is a form's own validation, before its server is called. A **server path** is a failure the server reports.
- A **test view** is a page under `/view/` that exists only for tests, not a block's view (`013` decision 21).
- A **dry run** is the speech suite with `SR_DRY=1`: it drives every step and checks focus and DOM facts, and hears no speech (`022`).

## Decisions

### 1. The prop: `attempt`

- `attempt?: number` on `ErrorSummary`. Optional, no default value (`undefined`).
- Its doc comment, in the item's source, so the API table and editors show it (`023`), 37 words: "The count of failed submits. Raise it by one on each, and the content renders anew, so a screen reader announces it again even when nothing changed. Without it, only a new or changed summary is announced."
  - It opens with a noun phrase, as `023` decision 5 asks of a data prop, and stays under V4's 40 words (`tests/unit/api-described.test.ts`).
  - Its last sentence is exact: without `attempt`, a summary is announced when it appears or when its text changes (`019` decision 1).
  - It cites no internal document (`registry-comments.test.ts`).
- The name is the owner's working name. Open question 1 asks the owner to confirm it. The rest of this specification does not depend on the name.
- *Why a number:* the owner chose one. A counter is what an app already has, or can add in one line. Any change of value counts, so the app need not reason about which value it passes.

### 2. The mechanism: a keyed block around the content node

- The content node, and only it, sits inside `{#key attempt}`. Each new value of `attempt` destroys the content node and creates a new one, in one update.
- The root is not keyed. It stays the same element, so `bind:ref` and the app's `ref.focus()` keep working (*the memo* §4.1, EXECUTED).
- The icon stays outside the content node, as `019` decision 1 placed it, and outside the key.
- *Why this one* (*the memo* §4.5). A new content node is, to every browser, an alert appearing: an alert event in Chromium and Firefox, a new live region in WebKit (*the memo* §2.1, READ). It is what the first submit already does, and NVDA speaks that in both its browsers (the speech memo). So an unchanged second submit takes the first submit's shape: an alert node inserted, then focus moved to the root.
- **Alike, not identical** (the spec review, finding 2). On the first submit the root is created with its content. On the second the root exists, and only the content node is new. An engine may order its focus and alert events differently in the two cases. The speech evidence is for the first. Criterion 14 is where the second is heard.
- *Why not clear, then write on the next frame* (*the memo* §4.2). A one-frame gap is what no reader heard in search-field S2. A gap long enough to hear collapses the box by about 90 px on every failed submit, and focus lands on an empty root (EXECUTED, prototype).
- *Why not move focus to the summary on each new value* (*the memo* §4.3). Focus on the root is what happens today, and NVDA says "section". Focus moved by the item would duplicate the app's own move, and could take focus while the person has moved on. Focus on the heading or a link inside would make NVDA drop the alert (READ, NVDA's source).
- *Why not key the root, or the children inside the content node* (*the memo* §4.4). Keying the root changes `ref` under the app. Keying the children keeps the old alert node; Chromium then sees a change inside a live region, not a new alert, which departs from the first submit's evidence.

### 3. What re-renders, and what does not

- **Only a change of `attempt`'s value** renders the content anew. A change to `errors`, `message`, `title`, `level` or `announce` updates the content in place, as today.
- **Re-derived errors re-render nothing.** An app may derive a new `errors` array on every keystroke. With `attempt` unchanged, the summary writes nothing for entries that did not change (*the memo* §4.1, EXECUTED: 0 mutation records for 5 letters typed).
- **While the summary is hidden** (no errors and no message), a new value renders nothing. The next insertion is an insertion anyway.
- **`announce` still decides the role.** With `announce={false}`, a new value renders the content anew with no role, so nothing is announced. That is right for a summary rendered from props.
- **A summary in the page at load, then a client failure.** An app renders server errors with `announce={false}` and `attempt` at 0. A failed submit then sets `announce` true and raises `attempt` to 1 in one update. The content node is inserted anew, with its role, so it is announced as an insertion. Today the role is added to the existing node; Chromium fires an alert for a role change too (*the memo* §2.1, READ), but the insertion is the case with speech evidence.

### 4. Focus is the app's, as before

- The item moves no focus when `attempt` changes. The app moves focus to the root after every failed submit, as `019` decision 3 and `003` decision 9 have it.
- The new content node is in place before the app's `await tick()` resolves (*the memo* §4.1, EXECUTED). So the order is the first submit's: the alert, then the focus move.
- If focus were inside the content node when it is rendered anew, focus would fall to the page's body. In every Kuiper path this cannot happen: the app focuses the root right after, and the blocks remove the summary while their server runs, so no link can hold focus at that moment (*the memo* §4.1, INFERRED). The page's "Your part" says to move focus to the root after raising `attempt` (decision 9).
- *Why not restore focus in the item:* it would be a focus move the item makes, which `019` leaves to the app, and it would need a check of its own under every reader. No path needs it.

### 5. The app's part

- Start the counter at 0. Raise it by one on each failed submit: a client check that fails, a server that refuses, a callback that throws.
- Raise it in the same update that sets the errors, before `await tick()` and the focus move.
- Never raise it while the person types, or on a submit that succeeds.

### 6. The keyboard example

- `src/lib/site/examples/error-summary/keyboard.svelte` keeps `let attempt = $state(0)`. Its `submit` raises it when the check fails, before `await tick()`, and passes `{attempt}` to the summary.
- Its intro gains one sentence: submit it again unchanged, and the summary is announced again.
- The variants example renders from props, with `announce={false}`, and does not pass `attempt`.

### 7. The five components

Each keeps its own counter, `let attempt = $state(0)`, and passes `{attempt}` to its summary.

| Component | Block | Where it raises it |
| --- | --- | --- |
| `sign-in-form.svelte` | `sign-in` | in `failed()`, beside `announce = true`, before `await tick()` |
| `sign-up-form.svelte` | `sign-up` | the same |
| `sign-up-verify.svelte` | `sign-up` | the same |
| `settings-form.svelte` | `settings` | the same |
| `settings-delete.svelte` | `settings` | in `confirm()`'s `catch`, beside `message = FAILED`, before `await tick()` |

- `failed()` is called from every failing path in the four forms: the client check, the throwing callback and the server's refusal. So one line covers all three.
- **The server paths stay one insertion.** Each block clears its errors before awaiting its server, so the summary is removed and then inserted again (*the memo* §1.4, EXECUTED). Raising `attempt` in the same update as the new errors means the insertion and the key change share one update: one new content node, not two.
- The counter is not a prop of the components. Open question 2 asks whether it should be.
- `settings-delete` has no `announce` state: its summary uses the item's default, `true`. That does not change.

### 8. The item's comments

- The header comment (`error-summary.svelte`, before `{#if}`) gains a sentence: the form raises `attempt` on each failed submit, and each new value renders the content anew, so an unchanged submit is announced again.
- `announce`'s doc comment does not change.

### 9. The item's page

The accessibility list splits into "What Kuiper provides" and "Your part", as the pages `027` added already do (`search-field`, `tag` and others). The existing sentences are kept, sorted between the two.

- **What Kuiper provides** keeps the item's own facts: the alert on the content, the root's `tabindex="-1"` with no role or name, the heading read first, the links and what they focus, the 24 px targets, the radio-group link. It adds: "Each new `attempt` renders the content anew, so its alert is announced again on an unchanged submit. With `attempt` unchanged, nothing re-renders, however often the errors are re-derived."
- **Your part** holds the app's duties: move focus to the root after every failed submit; raise `attempt` by one on each failed submit, in the same update that sets the errors, then move focus, and never while the person types; pass `announce={false}` for a summary in the page at load; do not pass `role`; declare a sticky header; link a checkbox question to its first checkbox; use `titleFor` for the page's title. And two sentences on `attempt`'s edges:
  - "With `announce={false}`, a new `attempt` renders the content again in silence."
  - "Raise it only on a failed submit, never while focus is inside the summary: a link focused there is lost." The spec review saw it: focus falls from the removed link, with a `focusout` in Chromium and none in WebKit (EXECUTED).
- The "dos" list's first line becomes: "Move focus to the summary, and raise `attempt`, after every failed submit."
- The line "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." stays as it is. `registry.test.ts` holds it until `030` generates the status. It is not updated to claim NVDA before a CI run passes.

### 10. A test view for the negative check

- A new test view, `/view/error-summary-attempt/` (`src/routes/(view)/view/error-summary-attempt/+page.svelte`). It is the one place where errors are re-derived on every keystroke, as an app might do. Neither the example nor the blocks do that, so a check on them alone could not catch a mechanism keyed on the errors.
- It holds one form with two fields, "Name" and "Notes", and two summaries:
  - **A**, with `attempt`: its errors come from one `validate({ name, notes })` inside `$derived`. The call reads every field's value, Notes included, and returns a new array each time. Notes's entry is present whatever its text. So typing in Notes re-runs the derivation and gives a new array whose entries do not change.
  - *Why it must read Notes* (the spec review, finding 4): `$derived` re-runs only when a value it reads changes. An entry written without reading Notes's value re-derives nothing, and the `{#key errors}` mutation could not fail criterion 3 (EXECUTED by the review: 0 records under that mutation).
  - The errors are empty until the first submit: the derivation returns `[]` while a `submitted` flag is false. So neither summary is in the page at load.
  - **B**, without `attempt`: the same errors, so the page shows what an app that never passes the prop gets.
  - The form's submit sets `submitted`, raises A's `attempt`, awaits `tick()`, and focuses A's root.
- Every link's target id exists in the page, or the prerender fails (EXECUTED: `prerender_missing_id` in the prototype).
- It joins `TEST_VIEWS` in `tests/e2e/pages.ts`, so axe and the theme check scan it, and the guard in `tests/unit/blocks.test.ts` names it, as `013`, `020` and `026` named theirs. It is not in the sitemap.

### 11. The speech suite

- **No new speech test.** The existing test, "the second submit, unchanged: spoken whole again, none twice in a row" (`tests/sr/error-summary.sr.ts`), is the judge. Its rules (L1, L3) do not change. The suite's test count, and so `022q`'s shard split, does not change.
- **The test records two DOM facts**, so the dry run checks the mechanism (`Sr.fact` and `Sr.focused`, in `tests/sr/sr.ts` since `022q`; a dry `judge` fails only on these facts):
  - Before the second submit, the test takes an `ElementHandle` of the content node: `const old = await fixture(page).locator('[data-slot="error-summary-content"]').elementHandle()`.
  - After it: `sr.fact("the old content node is disconnected", !(await old.evaluate((n) => n.isConnected)))`.
  - And `sr.focused(fixture(page).locator('[data-slot="error-summary"]'))`.
  - The first fact fails on today's item in a dry run: the node stays connected.
- **Why not a speech test per block:** the mechanism is one, in the item. The blocks' e2e check (criterion 4) proves each raises `attempt`, in order. Each speech test costs about 1.7 minutes a pair with retries (`022q` decision 9) and moves the shard split.
- **The mutation patches are re-made.** `tests/sr/mutations/main/4-error-summary.patch` and `tests/sr/mutations/double-read/7b-error-summary.patch` edit the lines the key block now wraps. Once `{#key attempt}` sits between `<WarningCircle>` and the content `<div>`, neither applies (EXECUTED by the review: "patch does not apply" at line 141). The other nine still apply.
- **The procedure,** for each of the two, after the item's change is final:
  1. Run `bun --bun prettier --write src/lib/registry/ui/error-summary/error-summary.svelte`, so the patch is made against the formatted file.
  2. Stage the built item with `git add` (no commit). `git diff` then compares against it, not against `c5cdd65`.
  3. Make the patch's one edit by hand, inside the key block: patch 4 sets the content's `role` to `null`; patch 7b sets the root's `role` to `"alert"` and the content's to `null`.
  4. Write it with `git diff -- src/lib/registry/ui/error-summary/error-summary.svelte > tests/sr/mutations/<set>/<patch>`.
  5. Restore the file with `git checkout -- src/lib/registry/ui/error-summary/error-summary.svelte`, then unstage it if the build is not yet ready to stage.
  6. Run `bun test tests/unit/mutations.test.ts`: each patch and each set applies, and each `expected.json` is still what `bun tests/sr/mutations/write-expected.ts` derives. Their witnesses, the insertion test, do not change.
- **What the patches make readers do on the second submit changes,** though their text does not. Stated in advance, per `022` decision 15:
  - **Patch 4** (no role on the content). Its derived entries include "the second submit, unchanged" with L1. Today that test fails unpatched, so the entry proves nothing. After this change it should pass unpatched, so under patch 4 its L1 fault becomes provable for the first time. A gain.
  - **Patch 7b** (the role back on the root). Its derived entries include "the second submit, unchanged" with L3, in all four pairs. Under this change, a new subtree is inserted inside an alert root that stays, and then focus lands on that root. In Chromium that is a change inside a live region, not a new alert (*the memo* §4.4). Whether a reader then reads the title twice is not known (INFERRED). So 7b's second-submit entries may not fault L3.
  - If the next `double-read` dispatch shows that, `022` decision 15's steps follow: the landing notes record the pair and the run id, and the entries go to `expected.json`'s `notProvable` list.
  - `notProvable` today names a patch and a pair, not a test (`tests/sr/mutations/derive.ts`, `NotProvable`). Listing 7b for a pair would drop its insertion witness there too. So, before any entry moves, a lane-E small change lets a `notProvable` entry name a test title as well, and only the second-submit entries move. The witness rule is never widened to a whole pair for this. That small change holds three more rules (the re-check, finding 11):
    - **A titled entry never names a patch's witness test, and never exempts the witness rule for its pair.** `mutations.test.ts` refuses both.
    - **It amends `022` decision 15, step 2** ("each naming the pair and the run id"): an entry may also name one test. The small change says so, and gets a roadmap row when it is raised.
    - **A titled test is allowed either outcome.** If 7b's second submit faults L3 on some runs and not on others, removing its entries alone would make every later `double-read` dispatch red when it does fault: `verdict()` reads a failing test with no expected entry as a difference (INFERRED). So, for a titled entry's test and pair, `verdict()` neither requires the fault nor counts it as a difference, and each dispatch's outcome for it is recorded in the landing notes. Every other test keeps today's rules.
    - **Either outcome, and only those two** (the second re-check's finding 13). For a titled entry's test and pair, `verdict()` accepts a pass, or a failure that holds the patch's fault, and nothing else: a failure on another rule, an X0 alone, or a test that did not run stays a difference. Each dispatch writes that test's outcome to the run's job summary, since later dispatches come after `022t` lands.
  - Criterion 14's landing notes name the next `mutate` dispatch of each set, run apart from a push.

### 12. The changelog

The 0.13.0 entry is unreleased. `error-summary` shipped in 0.3.0. Two bullets, after the existing ones:

- `error-summary`: a new optional prop, `attempt`; nothing to change. Raise it by one on each failed submit, and the summary's content is rendered anew, so a screen reader announces it again even when the errors are the same. Leave it out and a summary is announced when it appears or its text changes, as before. Update with `add error-summary`.
- `sign-in`, `sign-up`, `settings`: no interface change. Each form now raises the summary's `attempt` on every failed submit, so a second failure with the same errors is announced again. Update with `add sign-in`, `add sign-up` or `add settings`; each brings the new `error-summary`, which must be overwritten too: a form that keeps its old `error-summary` passes `attempt` as a plain attribute and is not announced again.

The upgrade guide gains no section: nothing is renamed or removed, and no app must act.

### 13. Cost and the generated files

- `scripts/cost/report.json` and `budgets.json` are ledger files. The landing takes the base's copies and runs `bun run cost --sizes-only` for `error-summary`, `sign-in`, `sign-up` and `settings`. No budget changes: the prototype measured `error-summary` at 11,872 B of JS against 12,900 (*the memo* §4.1).
- The item is interactive, so its change review runs `bun run cost --only error-summary`, as `022r`'s did.
- The build regenerates `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/` for the same four. `registry.json` does not change. The thumbnails' manifest is rewritten with `--hash-only` if an example's hash moves; no picture should change.

### 14. `019`'s text this supersedes

`019` is a landed record and is not edited. These sentences describe the item before this change; read them in their new form.

- Decision 3, "The five components that compose the item already do. Nothing in them changes." Now: "The five components move focus to the root after every failed submit, and raise the summary's `attempt` (`022t`)."
- Decision 1, "*Why inside, not removed:* … The live role also covers … a second failed submit whose errors differ". Now also: "and, with `attempt` raised, a second failed submit whose errors are the same (`022t`)."

## Scope

- **In:**
  - `src/lib/registry/ui/error-summary/error-summary.svelte`: the prop, its doc comment, the key block, the header comment.
  - The five components in decision 7.
  - `src/lib/site/examples/error-summary/keyboard.svelte`.
  - `src/routes/(site)/components/error-summary/+page.svelte`.
  - The test view, `src/routes/(view)/view/error-summary-attempt/+page.svelte`; `TEST_VIEWS` in `tests/e2e/pages.ts`; the view guard in `tests/unit/blocks.test.ts`.
  - Tests: `tests/e2e/error-summary.spec.ts`, `tests/e2e/blocks.spec.ts`, `tests/sr/error-summary.sr.ts` (two facts, through `tests/sr/sr.ts`), the two mutation patches, and `tests/unit/registry.test.ts` (criterion 9's page check).
  - Outside lane I, only if the dispatch needs it: the lane-E small change that lets a `notProvable` entry name a test (decision 11).
  - Ledger files: `CHANGELOG.md`, `static/r/`, `static/v0.13.0/r/`, `scripts/cost/report.json`, the thumbnails' manifest if it moves.
- **Out:**
  - A speech test per block (decision 11).
  - The counter as a prop of the five components (open question 2).
  - Focus moved or restored by the item (decision 4).
  - GOV.UK's script-managed `tabindex`, which `019` decision 1 declined.
  - The page's "NVDA and JAWS are not tested" line, which `030` replaces.
  - The variants example, which renders from props.
  - The search field's and the tag list's speech fixes (`022r`, `022s`), and `022u`.

## Acceptance criteria

Every check below is written before the code. A check marked **seen failing** is run on `c5cdd65`'s item, or on the base the build starts from, and fails there. A check marked **guard** passes before and after; it is proven by the mutation it names, which the landing notes record. Browser checks run in `chromium-light` and `webkit-light` here, and in every engine project in CI.

1. **The second submit inserts a new content node.** `error-summary.spec.ts`, on the keyboard example. After a first empty submit, a `MutationObserver` on the root and a `focusin` listener are installed. On a second, unchanged empty submit: (a) one observer callback holds records that, counted in any order, remove exactly one content node and add exactly one (the records arrive added, then removed: EXECUTED by the review); (b) that callback runs before the root's `focusin`; (c) the old node is disconnected; (d) the new node has `role="alert"`, the heading "There is a problem" and the 3 links; (e) the root is the same element as before, and focused; (f) the root's height is unchanged, ± 0.5 px. **Seen failing:** the new test and the new example run on the base's item. The base's item does not know `attempt`, so it spreads it onto the root as an attribute, and the observer sees attribute writes. The check counts only content nodes in `childList` records, so it fails as "no content node added or removed" (*the memo* §1.3). (e2e)
2. **Typing re-renders nothing, in the example.** After a first empty submit, typing 3 letters into "Project name" records no mutation inside the root, and the content node is the same node. **Guard**, passing before and after, as `019` criterion 5's are: the example's props do not change as the person types, so no mutation of the item fails it. Criterion 3 is the negative check a mutation proves. (e2e)
3. **Re-derived errors re-render nothing; a new attempt does.** On the test view: after a submit, typing 5 letters into "Notes", with `attempt` unchanged, records 0 mutations in summary A and keeps its content node. A second submit then inserts a new content node in A, as criterion 1 (a) to (e) states. In summary B, which has no `attempt`, both submits keep the same content node. **Guard** for the typing, proven by keying the content on `errors`: under that mutation the 5 letters record at least 5 mutations in A, and the check fails. A view whose derivation does not read Notes would record 0 there, so this count is what shows the view is not blind (*the memo* §4.1, 10 records in the prototype; the spec review, finding 4). **Seen failing** for A's second submit. (e2e)
4. **Each block's failure is one insertion, before focus.** `blocks.spec.ts`, one ordered count for seven paths. For each path, done twice with the same errors, the test watches the block's **scope**, not the summary root: the form for the four forms, `[data-slot="settings-delete"]` for the delete.
   - *Why the scope* (the re-check, finding 9): the whole item, root included, sits in `{#if errors.length > 0 || message}` (`error-summary.svelte:131`). On a server path the block clears its errors while the server runs, so the old root is removed and a new root, with its content, is added. An observer or a listener on the old root would see none of it, and correct code would count 0.
   - A `MutationObserver` on the scope, with `childList` and `subtree`, counts each added element that is, or holds, `[data-slot="error-summary-content"]`.
   - A `focusin` listener on the scope keeps only events whose target matches `[data-slot="error-summary"]`.
   - It counts from the second submit (or the second confirm) until 500 ms after that `focusin`. In that span: exactly one content node is added; the observer callback that adds it runs before the `focusin`.
   - After the span, the test reads the root and the content node fresh from the scope: the content node has `role="alert"`, and the root is focused.
   - Criteria 1, 3 and 6 keep watching the root: on those paths it stays.
   The paths:
   - client checks: an empty sign-in; an empty sign-up details step; an empty code step (`/view/sign-up/verify/`); a settings save with an empty name;
   - server paths: a sign-in the stand-in server refuses; a settings save on `/view/settings/failed/`; a delete on `/view/settings/failed/`.
   - The span runs past the focus because a late write is flushed after it: `failed()` awaits `tick()` and focuses at once, so a state write after the `tick()` lands in a later microtask (the spec review, finding 1).
   - **Seen failing** for the four client checks: on today's blocks no content node is added (*the memo* §1.4).
   - **Proven by mutation** for all seven: `attempt += 1` moved after `await tick()` in one component's `failed()`, for each of the four forms in turn. Then the client-check path adds its node after the `focusin`, and the server path adds two nodes in the span, one before the `focusin` and one after. Both fail (EXECUTED by the review on sign-in, both engines: `focus-root,add,remove` and `remove,add,focus-root,add,remove`). For `settings-delete`, the same mutation in its `catch`.
5. *Merged into criterion 4* (the spec review, finding 1). The number is kept so that later references hold.
6. **A summary present at load is announced on the first client failure.** On `/view/sign-in/errors/`, whose summary is rendered from props with no role, an empty submit leaves a new content node with `role="alert"`, and the root focused. **Seen failing:** today the node is the same; only its role changes. (e2e)
7. **Nothing else about the item moves.** `019`'s 19 tests in `error-summary.spec.ts`, its raw-HTML test included, pass unchanged. So do the item's tests in `primitives.spec.ts` and `keyboard.spec.ts`. (e2e)
8. **The dry speech run.** `SR_DRY=1`, in `chromium` and `webkit`: `error-summary.sr.ts`, `sign-in.sr.ts`, `sign-up.sr.ts` and `settings.sr.ts` pass. The second-submit test's fact "the old content node is disconnected" (decision 11) is **seen failing** in a dry run on today's item. (dry)
9. **The registry and the docs.** `registry.test.ts`, `registry-comments.test.ts` and `blocks.test.ts` pass. The error-summary page's API table lists `attempt` with its description, and the described-props test finds no empty row. The view guard names the new test view. `blocks.test.ts`'s voice check finds 0 banned words in the changed block and item files. `mutations.test.ts` passes with the re-made patches. A new unit check in `registry.test.ts`, seen failing on today's files, holds three lines: the page's "Your part" group holds "raise `attempt`", "With `announce={false}`, a new `attempt`" and "a link focused there is lost"; and the item's header comment names `attempt`. (unit)
10. **axe.** The test view, at 1280, in both themes, through `TEST_VIEWS`: 0 violations. (e2e)
11. **Cost.** `cost.test.ts` passes with fresh sizes for the four entries. `error-summary`'s JS stays under its 12,900 B budget. The change review's `bun run cost --only error-summary` is recorded in the landing notes. (unit, cost)
12. **The changelog** holds decision 12's two bullets in the 0.13.0 entry, and the changelog tests in `registry.test.ts` pass. (unit)
13. **The gates.** `bun run check`: 0 errors. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in item files. The whole unit suite passes. `bun scripts/site/release-check.ts --before-ci` exits 0. (unit)
14. **The next CI speech run: one outcome.** `022t` is done when, in the next `matrix` push run, "the second submit, unchanged" passes L1 and L3 under NVDA with Chromium and NVDA with Firefox, and in each VoiceOver pair that reaches it. "The insertion" and the three blocks' summary tests pass in every pair that reaches them, as before. Until that run, the Status reads "built; awaits the speech run". (CI)
    - **"Reaches"** (the re-check, finding 10): the test ran to its `judge`, and its `faults.json` holds no X0. A test that times out, stops at the shard deadline or ends on X0 has not reached it.
    - **A pair that does not reach it is not a pass.** The landing notes name the pair and the run. The criterion then holds for the pairs that reached it, and the VoiceOver gap stays open on the release path: the release check still needs the item heard in both VoiceOver browsers (`022` criterion 13, logs for all 28 items in each). This criterion does not close that gap.
    - **Risk 1, stated in advance: VoiceOver may read the summary twice.** Today VoiceOver's second submit is one reading, of the focused root. After this change it is an alert and a focus move, the first submit's shape. The speech memo saw VoiceOver with Chromium read sign-in's first-submit summary twice once, then pass on a retry: an L3 fault. So the second-submit test may flake L3 under VoiceOver. A retry-passed L3 is judged as `022` judges any flaky speech test, the insertion test among them: on a release run it takes a ledger line unless the design lead records it as reader timing, with the phrases (`022`, "Screen-reader suite").
    - **Risk 2, stated in advance: the second submit is not the first.** On the first the root is created with its content; on the second only the content node is new (decision 2). An engine may order its focus and alert events differently, and the speech evidence is for the first.
    - **If it fails, it is a finding to fix, not a limit to record** (constitution §4.4). The error-summary row stays failing in the release check. A research memo opens: a probe of the accessibility events CI's Windows runner sees on the second submit, with the phrases. The mechanism is not changed by guess. Whether `022t` stays landed meanwhile is open question 3.
15. **The scorecard** is re-run after landing, and its run log has a row. No row is expected to move: row 3 (h) waits for the speech verdicts.

## Open questions

These are for the owner. None blocks the re-check: the specification takes the recommended option in each.

**Answered by the owner, 2026-11-16:** 1 (a) `attempt`; 2 (a) no, not now; 3 (a) keep `022t` landed.

1. **The prop's name.** The owner named `attempt` as a working name.
   - **(a) `attempt` (recommended).** It names what the app counts, and reads as the app's own word: `attempt={attempts}`.
   - (b) `submitCount`. Plainer, but a successful submit is not counted, which the name suggests it is.
   - (c) `announceKey`. Says what it does, not when to raise it. An app could pass any value, which invites raising it on other updates.
2. **Should the five components expose the counter?** The blocks keep it inside (decision 7).
   - **(a) No, not now (recommended).** Each block owns every submit path, so it always knows when to raise it. An app that sets the bound `errors` itself, outside a submit, renders from props with `announce={false}`.
   - (b) A bindable `attempt` on each of the five components, so an app that sets their errors by hand can raise it too. Additive; it can come later without a break.
3. **If criterion 14 fails, does `022t` stay landed?** It decides whether 0.13.0 can ship with the error-summary row failing. Asked now, so the answer is ready before the run.
   - **(a) Keep `022t` landed (recommended).** No check shows it does harm: the first submit is unchanged, and an app that never passes `attempt` keeps today's behaviour. Record the run, open the Windows event probe as research, and leave the row failing until it passes.
   - (b) Revert `022t`, and defer the row to 0.14.0.

## Review

The spec review, 2026-11-16, raised 8 findings (1 High, 3 Medium, 4 Low). Each is fixed above:

1. **High,** criterion 5's guard passed under its own mutation, and criterion 4 checked no order. Criteria 4 and 5 are one ordered count, from the submit until 500 ms after the root's `focusin`, with the review's mutation named (criterion 4).
2. **Medium,** criterion 14 was not one outcome. It is now, with VoiceOver's L3 risk and the root's creation stated in advance, and a failure opens research (criterion 14; decision 2, "Alike, not identical"; open question 3).
3. **Medium,** patches 4 and 7b had no regeneration procedure, and 7b's second-submit effect changes. The procedure, and 7b's possible `notProvable` entries per `022` decision 15, are in decision 11.
4. **Medium,** the test view's guard was blind unless the derivation reads Notes. Decision 10 says it reads every field; criterion 3 counts the mutation's records.
5. **Low,** the doc comment opened with an imperative, sat at V4's limit, and its last sentence was wrong. Decision 1 takes the review's 37 words; decision 12's bullet is corrected.
6. **Low,** three test write-ins: criterion 1 counts records in any order and states how the base item fails; decision 11 states how the "new node" fact is taken.
7. **Low,** the page's new text had no check, and two duties were missing. Decision 9 adds them; criterion 9 holds them.
8. **Low,** the owner question on a failed criterion 14 is open question 3.

The re-check, 2026-11-16, closed findings 1 to 8 and raised four more (1 Medium, 3 Low). Each is fixed above:

9. **Medium,** criterion 4 watched the summary root, which the three server paths remove and re-create, so correct code would count 0. It now watches the block's scope with `subtree`, counts added elements that are or hold the content node, and matches the root's `focusin` on the scope (criterion 4).
10. **Low,** "a VoiceOver pair that reaches it" had no definition. "Reaches" is defined, a pair that does not reach it is not a pass, and the release check's VoiceOver need (`022` criterion 13) is named (criterion 14).
11. **Low,** the lane-E small change needed three lines: no titled entry names a witness or exempts the witness rule; it amends `022` decision 15 step 2 and gets a roadmap row; a titled test is allowed either outcome (decision 11).
12. **Low,** criterion 8 now names the dry fact "the old content node is disconnected", as decision 11 does.

The memo is not edited: a memo is not changed after the fact (`README.md`). The review's own EXECUTED readings are cited here as the spec review's.

## Landing notes

- **The owner's answers (2026-11-16):** the prop is `attempt`; the five components keep the counter inside; if criterion 14 fails, `022t` stays landed.
- **The change review's findings, written in by the design lead:**
  1. The blocks' changelog bullet now says the new `error-summary` must be overwritten too: a form that keeps its old one passes `attempt` as a plain attribute and is not announced again (decision 12 and `CHANGELOG.md`).
  2. Criterion 3's summary B keeps its content node from its first appearance, at the first submit, through the second; it does not exist before the first submit, so "both submits" reads from there.
  3. If criterion 14 fails, the three sentences that say a screen reader announces the summary again (the example's intro, the doc comment, the changelog bullet) are changed with the research that follows, as open question 3 (a) keeps `022t` landed.
  4. Criterion 6 also fails when only the five components are reverted (the change review, EXECUTED), as well as with the item reverted.
- **Not built:** decision 11's lane-E small change; its condition, a `double-read` dispatch showing 7b's second-submit entries not faulting L3, has not happened.
- **Waits for CI:** criterion 14 (the next `matrix` push run's speech verdicts) and criterion 15 (the scorecard re-run after it).

### The build record

The lane-I builder's notes, as written (`.claude/worktrees/lane-i-attempt`, not kept).

- **Specification:** `022t`, the error summary speaks again on an unchanged submit (lane I).
- **Date:** 2026-11-16
- **Built by:** the lane-I builder, in the worktree `lane-i-attempt`, from `release/0.13.0` at `b01e754`. Nothing is committed.
- **Engines here:** `chromium-light` and `webkit-light`, browsers from `/opt/pw-browsers`. Firefox is not installed. Every e2e and dry run served the built site on port 4391 (`E2E_PORT`), with `E2E_PREBUILT=1` after its own `bun run build`.

These notes are the raw material for the specification's Landing notes. They are not the Landing notes.

#### Seen failing first

Each check was written first and run on the base's item (`b01e754`). The keyboard example and the test view already passed `attempt`, which the base's item spread onto its root as an attribute.

| Check | Run on | Result |
| --- | --- | --- |
| Criterion 1, the keyboard example's second submit | base item | **Failed**, 2 of 2 engines: `[]` content-node swaps, wanted `[{ added: 1, removed: 1 }]` ("no content node added or removed") |
| Criterion 2, typing in the example (guard) | base item | Passed, 2 of 2 |
| Criterion 3, typing 5 letters in Notes (guard) | base item | Passed, 2 of 2: 0 records in A |
| Criterion 3, A's second submit | base item | **Failed**, 2 of 2: `[]` swaps, as criterion 1 |
| Criterion 4, the four client paths | base blocks | **Failed**, 4 of 4 paths × 2 engines: "one content node added (focus-root)", 0 added |
| Criterion 4, the three server paths | base blocks | Passed, 3 of 3 × 2 engines, as the spec expects |
| Criterion 6, `/view/sign-in/errors/` | base item | **Failed**, 2 of 2: "the old content node is connected" |
| Criterion 7, `019`'s 19 tests, with the new example | base item | Passed, 19 of 19 × 2 engines |
| Criterion 8, the dry fact "the old content node is disconnected" | base item, `SR_DRY=1` | **Failed** in `chromium` and `webkit`: that fact alone; the focus fact held. The other 2 tests passed. |
| Criterion 9, the new `registry.test.ts` checks | today's files | **Failed**, 4 of 4: the three "Your part" lines, and the header comment |
| Criterion 12, the new changelog checks | today's changelog | **Failed**, 2 of 2: 0 bullets |

#### Mutations

| Mutation | Check | Result |
| --- | --- | --- |
| `{#key errors}` in place of `{#key attempt}` | Criterion 3, the typing | **Failed**, both engines: 10 records in A for 5 letters (the guard needs at least 5) |
| `attempt += 1` moved after `await tick()` in `failed()` of `sign-in-form`, `sign-up-form`, `sign-up-verify` and `settings-form`, and in `settings-delete`'s `catch` | Criterion 4, the seven paths | **Failed**, 7 of 7 × 2 engines. Client paths: `focus-root,add` (added after the focusin). Server paths: `add,focus-root,add` (two added) |

Each mutation was restored from a copy, and the restored files were checked by `grep` before the next build.

#### The built change

- 60 of 60 passed in the first run after the build: `error-summary.spec.ts`'s `019` and `022t` describes and `blocks.spec.ts`'s `022t` describe, both engines.
- `{#key attempt}` wraps the content node alone. The root, the icon and `bind:ref` sit outside it.
- `bun run cost --sizes-only`: `error-summary` JS 11,816 → 11,872 B gzipped (brotli 10,507 → 10,672), CSS 891, unchanged. The budget is 12,900. `sign-in` 22,114 → 22,030 B, `sign-up` 29,636 → 29,726 B, `settings` 40,631 → 40,702 B; the catalogue was rewritten too. 4 items were size-stale; 16 runtime-stale figures were kept, as `--sizes-only` does.

#### Patches 4 and 7b

Re-made by decision 11's procedure: `prettier --write`, `git add` of the built item, the one edit by hand inside the key block, `git diff` into the patch, `git checkout --`, then `git reset` to unstage. The index is left clean.

- The base's two patches fail on the built item: "patch failed: … error-summary.svelte:141", "patch does not apply".
- `git apply --check` passes for each of the 11 patches alone, and for each set together (`main`, `double-read`).
- `bun test tests/unit/mutations.test.ts`: 29 pass, 0 fail. Both `expected.json` are unchanged and still derived.

#### Ledger files

Updated one at a time, in this order:

1. `bun run build`: `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/` changed for `error-summary`, `sign-in`, `sign-up` and `settings`, 8 files. `registry.json` did not change.
2. `bun run cost --sizes-only`: `scripts/cost/report.json`. `budgets.json` did not change.
3. `bun scripts/site/thumbnails.ts --hash-only`: "manifest rewritten for 83 items". Four source hashes moved: `error-summary`, `sign-in`, `sign-up` and `settings`. No picture changed. `bun test tests/unit/thumbnails.test.ts`: 10 pass, 0 fail.
4. `CHANGELOG.md`: decision 12's two bullets, after the 0.13.0 entry's last bullet.

#### Gates

| Gate | Result |
| --- | --- |
| `bun run check` | 2,434 files, 0 errors, 0 warnings |
| `bun run lint` | All matched files use Prettier code style (re-run after these notes were written) |
| `bun scripts/lint-literals.ts` | 0 literals in registry item files; 1 allowance (`liquid-glass`, unchanged) |
| `bun test ./tests/unit` | 1,913 pass, 2 skip, 0 fail, across 68 files. `highlight-session.test.ts` passed on the first run. |
| `error-summary.spec.ts` and `blocks.spec.ts`, whole, `chromium-light` and `webkit-light`, `--repeat-each=2` | 324 passed, 0 failed |
| The item's and the blocks' tests in `keyboard`, `primitives`, `axe`, `theme` and `viewer` specs (the test view's axe and theme checks among them), both engines, `--repeat-each=2` | 408 passed, 0 failed |
| Dry speech run, `chromium`: `error-summary`, `sign-in`, `sign-up`, `settings` `.sr.ts` | 15 passed (error-summary 3 of 3) |
| Dry speech run, `webkit`: the same four | 15 passed (error-summary 3 of 3) |
| `bun run cost --only error-summary`, first run | Noisy (floor 201.7 ms against 128 + 15 %). `hydrateMs` 54.8 against 53: reported "over budget, not held". |
| `bun run cost --only error-summary`, second run | Noisy (floor 194.9 ms). 0 over budget: hydrate 35.7 ms (spread 30.8 to 55.2) against 53; the click interaction 38.8 ms (37.1 to 41.1) against 59. Sizes as above. |
| `bun scripts/site/release-check.ts --before-ci` | Exit 0; four checks skipped as `--before-ci` skips them |
| `bun test tests/unit/cost.test.ts`, after the sizes-only report was restored | 40 pass, 0 fail |

The runtime figures are not held. After each `--only` run, `scripts/cost/report.json` was put back to the `--sizes-only` copy, so the ledger holds sizes from this build and the base's runtime figures.

#### Decision 11's lane-E small change

Not built, as briefed. Its condition is not met. It is raised only if a `double-read` dispatch shows 7b's "the second submit, unchanged" entries not faulting L3. No such dispatch has run: it needs CI, after landing.

#### Choices the specification did not state

1. **The test view.**
   - Field ids are `attempt-name` and `attempt-notes`. Notes is a `Textarea`.
   - The messages: "Enter a name" while Name is empty, and "Check your notes before you send them", always there.
   - The derivation reads every field by building `{ name, notes }` inside `$derived`; `validate` returns a new array each call. The `{#key errors}` mutation's 10 records show the view is not blind.
   - The summaries are told apart by `data-testid="summary-a"` and `"summary-b"`, and by their titles, "There is a problem (A)" and "There is a problem (B)", so the page has no two identical headings. No inline field errors are rendered.
2. **Criterion 3's summary B.** B first appears on the first submit. The check takes B's content node after that submit and shows that the same node stays through the typing and the second submit.
3. **Criteria 1, 3 and 6's watch.** A `MutationObserver` on the root with `childList`, `subtree`, `attributes` and `characterData`. A `focusin` listener counts only events whose target is the root. Records still queued when the watch stops are taken with `takeRecords()` and counted.
4. **Criterion 4's mutation, applied in one build.** The spec says "for each of the four forms in turn". The five mutations were applied together, in one build. Each path exercises one component only, so each path's result is what that component's mutation alone gives.
5. **Criterion 12's check.** A new `registry.test.ts` describe holds the two bullets: one each, the blocks bullet right after the item's, the item's bullet not marked an interface change, and each `add` command named.
6. **Criterion 9's header-comment check** reads the first HTML comment after the item's last `</script>`.
7. **The page.**
   - "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." is kept unchanged, as the last line of "What Kuiper provides".
   - The duty reads "On each failed submit, raise `attempt` by one, …", lower case, so it holds criterion 9's "raise `attempt`".
   - `019`'s sentences that named the app's duties moved into "Your part": focus after every failed submit, `role`, the sticky header, the checkbox question, `titleFor`. "Pass `announce={false}` for a summary in the page at load" was added there, from decision 9's list.
8. **The doc comment** is decision 1's 37 words, in a multi-line `/** … */`.
9. **`settings-delete`.** `attempt += 1` sits right after `message = FAILED`, before `text = FAILED` and `await tick()`.
10. **Comments.** Each of the five components and the example says why it keeps the counter, in one comment beside `let attempt = $state(0)`.
11. **The speech test.** The two facts are recorded after the second submit's `sr.after`, before `judge`. The file's header comment says what a dry run now checks.

#### Left for the landing

- The specification's Status line ("built; awaits the speech run") and its Landing notes. The specification is untracked in the main checkout, outside this worktree, so this build did not edit it.
- Criterion 14, the next CI `matrix` push run, and the next `mutate` dispatch of each set.
- Criterion 15, the scorecard re-run.
