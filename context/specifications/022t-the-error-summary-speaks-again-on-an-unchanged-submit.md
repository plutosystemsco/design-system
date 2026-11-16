# 022t — The error summary speaks again on an unchanged submit

- **Status:** drafted; waits for its spec review.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** specification, lane I. An additive interface change to one item, `error-summary`: a new optional prop. Five components in three blocks (`sign-in`, `sign-up`, `settings`) pass it, and so does the item's keyboard example. The item's page changes, and one test view is added. No token and no dependency changes. It is a specification, not a small change, because it adds a prop, and the owner chose that prop from options.
- **Depends on:** `019` (the item's structure: the alert inside, focus on the root); `022` (the speech suite and its mutation sets); `022q` (the speech suite's own faults), which must land first so the next CI run judges this change with its rules. In lane I it builds after `022r` and `022s` land, one build at a time (roadmap §2, "Lanes").
- **Research it stands on:** [the error summary's re-announcement](../research/2026-11-16-error-summary-re-announcement.md), cited as *the memo*, by section; [the first speech verdicts](../research/2026-11-16-the-first-speech-verdicts.md), the error-summary row; [`019`](./019-the-error-summary-alert-inside-and-the-label-in-view.md), decisions 1 to 3 and 12.
- **The owner's choice (2026-11-16):** a prop, from three options (a prop; a rule apps follow; defer to 0.14.0). An optional number, working name `attempt`, that the app raises on each failed submit; the summary re-announces on each new value; the five blocks and the example pass it; additive. Recorded in the `022t` row of `roadmap.md`.

## Intent

The error summary is the box a failed submit puts at the top of a form. `019` promises that a second failed submit, with the same errors, is spoken again: the title and every message. Under NVDA it is not. NVDA says "section" and nothing more (the speech memo).

The cause is that nothing changes (*the memo* §1.3). The errors are the same, so Svelte writes nothing, and no browser fires an alert. Only focus moves, to a root with no role and no name. The item cannot tell an unchanged failed submit from any other update (*the memo* §1.5). Only the app knows a submit failed.

This change gives the app a way to say so. The app raises `attempt` on each failed submit. Each new value renders the summary's content anew, so the browser sees a new alert, exactly as on the first submit. An app that never passes `attempt` keeps today's behaviour.

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
- Its doc comment, in the item's source, so the API table and editors show it (`023`): "Raise it by one on each failed submit. Each new value renders the content anew, so a screen reader announces it again, even when nothing in it changed. Leave it out and the summary is announced only when it appears." The comment cites no internal document (`registry-comments.test.ts`).
- The name is the owner's working name. Open question 1 asks the owner to confirm it. The rest of this specification does not depend on the name.
- *Why a number:* the owner chose one. A counter is what an app already has, or can add in one line. Any change of value counts, so the app need not reason about which value it passes.

### 2. The mechanism: a keyed block around the content node

- The content node, and only it, sits inside `{#key attempt}`. Each new value of `attempt` destroys the content node and creates a new one, in one update.
- The root is not keyed. It stays the same element, so `bind:ref` and the app's `ref.focus()` keep working (*the memo* §4.1, EXECUTED).
- The icon stays outside the content node, as `019` decision 1 placed it, and outside the key.
- *Why this one* (*the memo* §4.5). A new content node is, to every browser, an alert appearing: an alert event in Chromium and Firefox, a new live region in WebKit (*the memo* §2.1, READ). It is what the first submit already does, and NVDA speaks that in both its browsers (the speech memo). So an unchanged second submit becomes, to the browser, a first submit again: an alert node inserted, then focus moved to the root.
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
- **Your part** holds the app's duties: move focus to the root after every failed submit; raise `attempt` by one on each failed submit, in the same update that sets the errors, then move focus, and never while the person types; pass `announce={false}` for a summary in the page at load; do not pass `role`; declare a sticky header; link a checkbox question to its first checkbox; use `titleFor` for the page's title.
- The "dos" list's first line becomes: "Move focus to the summary, and raise `attempt`, after every failed submit."
- The line "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." stays as it is. `registry.test.ts` holds it until `030` generates the status. It is not updated to claim NVDA before a CI run passes.

### 10. A test view for the negative check

- A new test view, `/view/error-summary-attempt/` (`src/routes/(view)/view/error-summary-attempt/+page.svelte`). It is the one place where errors are re-derived on every keystroke, as an app might do. Neither the example nor the blocks do that, so a check on them alone could not catch a mechanism keyed on the errors.
- It holds one form with two fields, "Name" and "Notes", and two summaries:
  - **A**, with `attempt`: its errors are derived with `$derived` from the fields on every keystroke, a new array each time. "Notes" adds an entry that does not depend on its text, so typing in it changes the array and none of its entries.
  - **B**, without `attempt`: the same errors, so the page shows what an app that never passes the prop gets.
  - The form's submit raises A's `attempt` and focuses A's root.
- Every link's target id exists in the page, or the prerender fails (EXECUTED: `prerender_missing_id` in the prototype).
- It joins `TEST_VIEWS` in `tests/e2e/pages.ts`, so axe and the theme check scan it, and the guard in `tests/unit/blocks.test.ts` names it, as `013`, `020` and `026` named theirs. It is not in the sitemap.

### 11. The speech suite

- **No new speech test.** The existing test, "the second submit, unchanged: spoken whole again, none twice in a row" (`tests/sr/error-summary.sr.ts`), is the judge. Its rules (L1, L3) do not change. The suite's test count, and so `022q`'s shard split, does not change.
- **The test records two DOM facts**, so the dry run checks the mechanism: after the second submit, the content node is a new node (`sr.fact`), and focus is on the root (`sr.focused`). The first fails on today's item in a dry run.
- **Why not a speech test per block:** the mechanism is one, in the item. The blocks' e2e checks (criteria 4 and 5) prove each raises `attempt`. Each speech test costs about 1.7 minutes a pair with retries (`022q` decision 9) and moves the shard split.
- **The mutation patches are re-made.** `tests/sr/mutations/main/4-error-summary.patch` and `tests/sr/mutations/double-read/7b-error-summary.patch` edit the lines the key block now wraps, so their context moves. They are regenerated against the new item, with the same effect: patch 4 sets the content's role to `null`; patch 7b puts `role="alert"` back on the root and none on the content. Their witnesses and `expected.json` files do not change.

### 12. The changelog

The 0.13.0 entry is unreleased. `error-summary` shipped in 0.3.0. Two bullets, after the existing ones:

- `error-summary`: a new optional prop, `attempt`; nothing to change. Raise it by one on each failed submit, and the summary's content is rendered anew, so a screen reader announces it again even when the errors are the same. Leave it out and the summary is announced only when it appears, as before. Update with `add error-summary`.
- `sign-in`, `sign-up`, `settings`: no interface change. Each form now raises the summary's `attempt` on every failed submit, so a second failure with the same errors is announced again. Update with `add sign-in`, `add sign-up` or `add settings`; each brings the new `error-summary`.

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
  - Tests: `tests/e2e/error-summary.spec.ts`, `tests/e2e/blocks.spec.ts`, `tests/sr/error-summary.sr.ts` (two facts), the two mutation patches.
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

1. **The second submit inserts a new content node.** `error-summary.spec.ts`, on the keyboard example. After a first empty submit, a `MutationObserver` on the root and a `focusin` listener are installed. On a second, unchanged empty submit: (a) one observer callback sees exactly one content node removed and exactly one added; (b) that callback runs before the root's `focusin`; (c) the old node is disconnected; (d) the new node has `role="alert"`, the heading "There is a problem" and the 3 links; (e) the root is the same element as before, and focused; (f) the root's height is unchanged, ± 0.5 px. **Seen failing:** on today's item no mutation is recorded (*the memo* §1.3, EXECUTED). (e2e)
2. **Typing re-renders nothing, in the example.** After a first empty submit, typing 3 letters into "Project name" records no mutation inside the root, and the content node is the same node. **Guard**, passing before and after, as `019` criterion 5's are: the example's props do not change as the person types, so no mutation of the item fails it. Criterion 3 is the negative check a mutation proves. (e2e)
3. **Re-derived errors re-render nothing; a new attempt does.** On the test view: after a submit, typing 5 letters into "Notes", with `attempt` unchanged, records 0 mutations in summary A and keeps its content node. A second submit then inserts a new content node in A, as criterion 1 (a) to (e) states. In summary B, which has no `attempt`, both submits keep the same content node. **Guard** for the typing, proven by keying the content on `errors`: the check fails (*the memo* §4.1, EXECUTED in the prototype: 10 records). **Seen failing** for A's second submit. (e2e)
4. **Each block's client check speaks again.** `blocks.spec.ts`. Each of these, done twice with the same errors, leaves a new content node with `role="alert"` and the root focused after the second: an empty sign-in; an empty sign-up details step; an empty code step (`/view/sign-up/verify/`); a settings save with an empty name. **Seen failing:** on today's blocks the node is the same (*the memo* §1.4, EXECUTED for three of the four; the code step is the same pattern). (e2e)
5. **Each server path stays one insertion.** `blocks.spec.ts`. Each of these, done twice, adds exactly one content node between the submit and the root's focus, not two: a sign-in the stand-in server refuses; a settings save on `/view/settings/failed/`; a delete on `/view/settings/failed/`. **Guard**, proven by moving one block's `attempt += 1` after its `await tick()`: two insertions, and the check fails. (e2e)
6. **A summary present at load is announced on the first client failure.** On `/view/sign-in/errors/`, whose summary is rendered from props with no role, an empty submit leaves a new content node with `role="alert"`, and the root focused. **Seen failing:** today the node is the same; only its role changes. (e2e)
7. **Nothing else about the item moves.** `019`'s 19 tests in `error-summary.spec.ts`, its raw-HTML test included, pass unchanged. So do the item's tests in `primitives.spec.ts` and `keyboard.spec.ts`. (e2e)
8. **The dry speech run.** `SR_DRY=1`, in `chromium` and `webkit`: `error-summary.sr.ts`, `sign-in.sr.ts`, `sign-up.sr.ts` and `settings.sr.ts` pass. The second-submit test's fact "the content node is new" is **seen failing** in a dry run on today's item. (dry)
9. **The registry and the docs.** `registry.test.ts`, `registry-comments.test.ts` and `blocks.test.ts` pass. The error-summary page's API table lists `attempt` with its description, and the described-props test finds no empty row. The view guard names the new test view. `blocks.test.ts`'s voice check finds 0 banned words in the changed block and item files. `mutations.test.ts` passes with the re-made patches. (unit)
10. **axe.** The test view, at 1280, in both themes, through `TEST_VIEWS`: 0 violations. (e2e)
11. **Cost.** `cost.test.ts` passes with fresh sizes for the four entries. `error-summary`'s JS stays under its 12,900 B budget. The change review's `bun run cost --only error-summary` is recorded in the landing notes. (unit, cost)
12. **The changelog** holds decision 12's two bullets in the 0.13.0 entry, and the changelog tests in `registry.test.ts` pass. (unit)
13. **The gates.** `bun run check`: 0 errors. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in item files. The whole unit suite passes. `bun scripts/site/release-check.ts --before-ci` exits 0. (unit)
14. **The next CI speech run.** In the next `matrix` push run, with `022q` landed:
    - "the second submit, unchanged" passes L1 and L3 under NVDA with Chromium and NVDA with Firefox. That closes the speech memo's error-summary row.
    - In each VoiceOver pair, it passes, or the landing notes say the pair did not reach it.
    - "the insertion" and the three blocks' summary tests pass in every pair that reaches them, as before.
    - A failure is recorded in the landing notes with its phrases and its kind (item, or rule and harness). If NVDA still says only "section", the new node did not raise an alert it speaks; the next step is a probe of the accessibility events in CI's Windows runner, not a change of mechanism by guess. (CI)
15. **The scorecard** is re-run after landing, and its run log has a row. No row is expected to move: row 3 (h) waits for the speech verdicts.

## Open questions

These are for the owner. Neither blocks the spec review: the specification takes the recommended option in each.

1. **The prop's name.** The owner named `attempt` as a working name.
   - **(a) `attempt` (recommended).** It names what the app counts, and reads as the app's own word: `attempt={attempts}`.
   - (b) `submitCount`. Plainer, but a successful submit is not counted, which the name suggests it is.
   - (c) `announceKey`. Says what it does, not when to raise it. An app could pass any value, which invites raising it on other updates.
2. **Should the five components expose the counter?** The blocks keep it inside (decision 7).
   - **(a) No, not now (recommended).** Each block owns every submit path, so it always knows when to raise it. An app that sets the bound `errors` itself, outside a submit, renders from props with `announce={false}`.
   - (b) A bindable `attempt` on each of the five components, so an app that sets their errors by hand can raise it too. Additive; it can come later without a break.

## Landing notes

To be filled when it lands: the spec review and its findings; each check seen failing, with its run; each mutation and its result; the cost figures; the dry run; the CI run's verdicts (criterion 14); the scorecard row; the owner's answers to the open questions.
