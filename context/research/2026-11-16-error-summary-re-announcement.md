# The error summary's re-announcement on an unchanged failed submit

- **Status:** complete
- **Date:** 2026-11-16
- **Author:** a researcher
- **Question:** On a second failed submit with the same errors, NVDA says only "section". How does the item announce today, and why is that submit silent? How do readers treat an alert that is removed and inserted again? How do other systems handle a repeat submit? Under the prop the owner chose, `attempt`, which mechanism makes the summary speak again, and what else must change?
- **Stands on:** [the first speech verdicts](2026-11-16-the-first-speech-verdicts.md), the error-summary row (§10 and the "second submit" entry); [`019`](../specifications/019-the-error-summary-alert-inside-and-the-label-in-view.md), decisions 1 to 3 and 12; [the GOV.UK prior-art memo](2026-11-15-prior-art-govuk.md), §2; the `022t` row in [`roadmap.md`](../roadmap.md), which records the owner's choice.
- **What it blocks:** [`022t`](../specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md), and so the error-summary row of the release check's speech evidence (`022` criterion 13).

## How to read this memo

Every claim carries a label.

- **READ:** a source says so. Kuiper's files are read at `c5cdd65` on `release/0.13.0`. Outside sources were read on 2026-11-16, from shallow clones made in this session's scratchpad, not in `context/prior_art/`. Their licences are recorded below, as `prior_art/README.md` would record them; that file is not edited by this memo.
- **EXECUTED:** run in this session's Linux container. The site was built from a copy of `c5cdd65` in the scratchpad, served by `vite preview`, and driven by small Playwright 1.64.1 scripts in Chromium and WebKit. Some runs used a prototype of the item, also in the scratchpad (named where used). Nothing in the repository was written. No screen reader runs here, so no speech is EXECUTED.
- **INFERRED:** our reasoning.

**Sources outside Kuiper, and their licences.**

| Source | Commit read | Licence | Used for |
| --- | --- | --- | --- |
| GOV.UK Frontend, `alphagov/govuk-frontend` | `f0d6e2f` (2026-11-16, package 6.6.0) | MIT (`LICENSE.txt`) | The error summary's script, template and changelog |
| The GOV.UK Design System, `alphagov/govuk-design-system` | `61e6437` (2026-11-16) | MIT for code; guidance is Crown copyright, studied and not quoted | The error summary's guidance, changelog and the validation pattern |
| Canada.ca's Web Experience Toolkit, `wet-boew/wet-boew` | `001b7ba` (2026-11-16) | MIT (`LICENSE`, Crown copyright, Government of Canada) | `src/plugins/formvalid/formvalid.js` |
| Primer's design guidance, `primer/design` | `87f799f` (2025-07-01) | MIT (`LICENSE`) | `content/ui-patterns/forms/overview.mdx` |
| Chromium, `ui/accessibility/ax_event_generator.cc` | `main`, read through raw.githubusercontent.com | BSD-style | When Chromium fires an alert event |
| Firefox, `accessible/generic/DocAccessible.cpp` | `main` of `mozilla-firefox/firefox` | MPL 2.0 | When Firefox fires an alert event |
| WebKit, `Source/WebCore/accessibility/AXObjectCache.cpp` | `main` | BSD and LGPL | When WebKit registers a new live region |
| NVDA, `source/NVDAObjects/IAccessible/__init__.py` | `master` | GPL 2 | What NVDA does with an alert event |

The engine and reader sources are today's branches, not the exact builds CI runs. They explain behaviour; they do not prove what a given build does. Nothing is copied from any of them. Each approach is described in our own words.

**Terms.**

- A **live region** is an element whose changes a screen reader speaks without focus moving there. `role="alert"` makes an assertive one: it interrupts.
- An **alert event** is the platform event a browser fires to say "an alert appeared". Readers listen for it.
- The **content node** is the item's `data-slot="error-summary-content"` element: the one that carries `role="alert"` and holds the title, the message and the links.
- The **root** is the item's outer element, `data-slot="error-summary"`, with `tabindex="-1"` and no role. Apps focus it.
- An **unchanged failed submit** is a failed submit whose errors are the same as the last one's.

## 1. How the item announces today

### 1.1 The structure

- **READ** (`src/lib/registry/ui/error-summary/error-summary.svelte`). The whole item sits in `{#if errors.length > 0 || message}` (line 131). The root has `role={null}` and `tabindex={-1}` (lines 136–137). The content node has `role={announce ? "alert" : null}` (line 144). The links are keyed by id (`{#each errors as error (error.id)}`, line 160).
- **READ** (the item's header comment, lines 123–130). The form inserts the summary with `announce` and moves focus to the root after every failed submit. An app that renders server errors passes `announce={false}` and moves focus itself.
- **READ** (`019` decision 1). The role is on the content, not the focused root, so the focus move and the alert do not compete. The heading is the alert's first child, so it is read first.

### 1.2 When content is inserted

- **EXECUTED.** A probe watched the keyboard example's form with a `MutationObserver` and logged `focusin`. On the first empty submit, in Chromium and WebKit, the form gains the root, its content and the three inline errors in one task. Focus moves to the root 1 to 6 ms later.
- **INFERRED.** So the first submit is an insertion of an element that carries `role="alert"`, followed by a focus move. The readers hear that as an alert (§2).

### 1.3 Why an unchanged second submit is silent

- **EXECUTED.** On the second empty submit, the same probe logged no DOM write at all: no child added or removed, no attribute changed, no text changed. Only focus moved: to the button, then to the root. The content node after the second submit is the same node as before it, in both engines.
- **READ** (Svelte 5.57.3, `{#each}` keyed by id). The example sets `errors` to a new object, so `links` is a new array. Its entries have the same ids and messages. The keyed list keeps its nodes, and Svelte writes no text that has not changed.
- **READ** (the speech memo). On the second submit NVDA said only "section". On the first it read the title and every message. VoiceOver did not reach the test.
- **INFERRED.** Nothing changes in the alert, so no browser fires an alert or a live-region event. What is left is the focus move to a root with no role and no name. NVDA names a focusable element with no role "section" and does not read its content. That is the whole of what NVDA said.

### 1.4 Which block paths are silent

- **EXECUTED.** The same probe, on the block views, asked whether the content node is a new node after a second, unchanged failure:

| Path | New content node? |
| --- | --- |
| Sign in, empty submit twice | no |
| Sign in, errors view (`/view/sign-in/errors/`), empty submit twice | no |
| Sign in, a valid submit the stand-in server refuses, twice | yes |
| Sign up, empty submit twice | no |
| Settings, a save with an empty name, twice | no |
| Settings, failed view, a save the server fails, twice | yes |
| Settings, failed view, a delete that fails, twice | yes |

- **READ** (`sign-in-form.svelte` lines 147–148; `sign-up-form.svelte` 175–176; `sign-up-verify.svelte` 133–134; `settings-form.svelte` 183–184; `settings-delete.svelte` 39). Before each block awaits its server, it clears `errors` and `formError` (or `message`). The summary is then removed, and the server's answer inserts it again.
- **INFERRED.** So the silent paths are the client checks: an empty or malformed field caught before the server is called. Those are the most common repeat. A server refusal is already announced again, by accident of the clearing, not by design. An app that keeps its errors on screen while it waits would be silent there too.

### 1.5 Why the item has no signal of its own

These are the lane-I builder's findings. This memo checked each.

- **The `errors` array's identity changes on every keystroke in apps that re-derive errors.** INFERRED, with an EXECUTED check below: an app may write `const errors = $derived(validate(values))`. Each keystroke then makes a new array. A mechanism keyed on that array would re-announce while the person types. EXECUTED (prototype, §4.1): keying the content on `errors` rendered it anew 5 times for 5 letters typed in an unrelated field.
- **Root focus also comes from a mouse click.** EXECUTED: after a failed submit, a click on the summary's title moves focus to the root, in Chromium and WebKit. The root keeps `tabindex="-1"` (`019` decision 1). So "the root gained focus" does not mean "a submit failed". GOV.UK avoids this by removing `tabindex` on blur (§3.1); Kuiper chose not to (`019` decision 1).
- **A form `submit` listener fires before an async server answer.** READ: each block's `submit` handler awaits `onsubmit`; the stand-in sign-in server refuses after 800 ms (`blocks/sign-in/+page.svelte`). At the `submit` event the outcome is unknown, and the blocks have just cleared the errors. The item also does not own the form: `settings-delete` has none.
- **INFERRED.** Only the app knows that a submit failed. So the app must say so. That is what the owner's prop does.

## 2. How readers treat a re-inserted alert, and identical text

### 2.1 An element with `role="alert"` inserted into the page

- **READ, Chromium.** The event generator adds an alert event when a node is created whose role is an alert. It also adds one when a node's role changes to alert, and when an alert node stops being ignored.
- **READ, Firefox.** When a subtree is created, an accessible whose ARIA role is alert fires an alert event, once the document has loaded. Inserting content inside an existing alert also fires an alert event, on that alert.
- **READ, WebKit.** When an element is added whose role implies a live region, as `alert` does, it is registered as a new live region on Apple's platforms.
- **READ, NVDA.** On an alert event, NVDA first handles any pending focus event. It returns without speaking if the alert is an ancestor of the focus. Otherwise it speaks the alert and its descendants at once, interrupting.
- **READ** (the speech memo). On the first submit, NVDA with Chromium and NVDA with Firefox read the title and every message. That first submit is an insertion (§1.2). So this is direct evidence that an inserted alert content node is spoken by NVDA in both browsers.
- **INFERRED.** The focus is on the root. The content node is the root's child, not its ancestor. So NVDA's "focus inside the alert" rule does not silence it. If an app focused a link or the heading inside the content instead, NVDA would drop the alert.

### 2.2 Removed and inserted again, versus identical text

- **INFERRED.** A new DOM element gets a new accessible object. To the browser, a content node removed and a new one inserted is a creation, so §2.1 applies. It does not matter that its text matches the old one.
- **INFERRED.** Text replaced with identical text changes nothing in the accessibility tree. Chromium's events come from differences between the old and new tree, and there are none. Svelte does not even write it (§1.3).
- **READ** (the speech memo, search-field S2). Emptying a status and writing the same count one frame later, about 1 to 3 ms, was heard by no reader in any of the four pairs.
- **READ** (the speech memo, toast S4). NVDA heard a toast's repeat after about 2 s of empty announcer (`022r` measured it so).
- **INFERRED.** So a gap inside one live region must be long, hundreds of milliseconds at least, to be heard. A new alert node needs no gap: it is a creation, not a change.

### 2.3 Double speech

- **READ** (the speech memo, §2.1 above). VoiceOver reads a focused container's content; NVDA names it.
- **INFERRED.** An alert that fires in the same moment focus lands on the root may be read twice by VoiceOver: once as the alert, once as the focused container. That is the first submit's situation too. `019` accepted it, and its test judges it with L3 ("none read twice in a row"). A mechanism that makes the second submit look exactly like the first adds no new double-speech risk. Any other mechanism brings its own.

### 2.4 Public documentation

- **READ** (Primer's form guidance, "Validation on submit"). It says not to use live regions for form validation, and to move focus instead: to the first link in a summary, or to the first invalid field.
- **INFERRED.** That avoids live-region timing altogether, at the cost of NVDA's alert rule (§2.1): focus inside the summary means the summary's title is not read as an alert.

## 3. How other systems handle a repeat submit with the same errors

### 3.1 GOV.UK

- **READ** (`template.njk` lines 7–9; `error-summary.mjs` lines 18–29). The summary is rendered by the server, with the alert role on a child, not on the element that takes focus. On load, script focuses the root, adding `tabindex="-1"` first.
- **READ** (`common/index.mjs`, `setFocus`). The `tabindex` is removed again on blur. So a later click does not focus the root.
- **READ** (the validation pattern). Validation is on the server. Client-side validation is to be added only for a researched need.
- **READ** (the changelog, 3.0.0). A link once added its field's id to the address, and that stopped the summary taking focus "on any following form submissions". Fixed by not adding the hash.
- **INFERRED.** GOV.UK's repeat submit is a new page. The summary is a new element, focused on load, every time. A repeat is never "unchanged" to the browser. GOV.UK has no client-side repeat to solve, and its one repeat fault was a focus fault.

### 3.2 Canada.ca's Web Experience Toolkit (WET)

- **READ** (`formvalid.js` lines 329–360, 375–378). The form plugin owns the submit. Its "invalid" handler sets a flag on each failed attempt. Then, 100 ms later, the summary is created, or its content replaced only if it differs, and the summary takes focus if the flag is set.
- **READ** (line 337). The summary is a `section` with `tabindex="-1"` and no alert role. It speaks through focus alone.
- **INFERRED.** WET has the per-attempt signal Kuiper's item lacks, because it owns validation. Its repeat relies on focus moving from the submit button to the summary. Under NVDA that is the same "section" Kuiper hears, unless the reader reads the section's content.

### 3.3 Primer

- **READ** (`overview.mdx`, "Validation on submit"). On a failed submit, focus moves to the first link of a summary banner, or to the first invalid field. No live region.
- **INFERRED.** Each attempt moves focus from the submit button to a link or a field, so something is always spoken. What is spoken is one link or one field, not the summary's title and list.

### 3.4 What the three share

- **INFERRED.** Each speaks again because each attempt makes a fresh event: a new page (GOV.UK), a flag the validator sets (WET), or a focus move to a named control (Primer). None infers a repeat from the errors themselves. Kuiper's item, which owns neither the form nor the validation, needs the app to pass that event in. `attempt` is that event.

## 4. The mechanism under a prop

Each option was weighed on four things: whether it fires the event NVDA needs (§2.1), double speech, focus, and timing.

### 4.1 A keyed block around the content node (`{#key attempt}`)

The content node is wrapped in `{#key attempt}`. Each new value destroys the node and creates a new one. The root stays.

- **EXECUTED (prototype).** On the second empty submit, in Chromium and WebKit, one `MutationObserver` callback saw the new content node added to the root and the old one removed. Both happened in the same millisecond, in one task, before focus moved to the root.
- **EXECUTED (prototype).** The root is the same node before and after. So `bind:ref` and the app's `ref.focus()` still work.
- **EXECUTED (prototype).** In a scratch page whose errors are re-derived on every keystroke, typing five letters in an unrelated field, with `attempt` unchanged, wrote nothing in the summary: 0 mutation records, the same content node.
- **EXECUTED (prototype).** Keyed on `errors` instead, the same typing wrote 10 records and replaced the node. So a check of that kind tells the two mechanisms apart.
- **EXECUTED (prototype).** `error-summary.spec.ts` passed 19 of 19 in `chromium-light`. The dry screen-reader run (`SR_DRY=1`, Chromium) of `error-summary.sr.ts` passed 3 of 3. Dry mode judges no speech, and it passes on today's item too.
- **EXECUTED (prototype).** `bun run cost --sizes-only --only error-summary`: JS 11,816 → 11,872 B gzipped (brotli 10,507 → 10,672); CSS 891, unchanged. The budget is 12,900 B.
- **READ** (Svelte 5.57.3, `blocks/key.js`). The key block compares values and maps `NaN` to one value, so `NaN` does not re-render on every run.
- **Event.** A new alert node: an alert event in Chromium and Firefox, a new live region in WebKit (READ, §2.1). It is the event the first submit already gets, which NVDA speaks (READ, §2.1).
- **Double speech.** The same as the first submit's (INFERRED, §2.3). The insertion test already judges it.
- **Focus.** The item moves no focus. Focus stays the app's job, as `019` decision 3 has it. If focus were inside the content when it is replaced, it would fall to the page's body. INFERRED: in every Kuiper path the app focuses the root right after, and the blocks clear the summary while they wait, so a link cannot hold focus at that moment.
- **Timing.** None to tune. The new node is in place before the app's `await tick()` resolves.
- **Look.** No frame shows the box without its content: the removal and the insertion share one task (EXECUTED, above).

### 4.2 Clearing the content, then writing it on the next frame

The content is removed when `attempt` changes and inserted again one animation frame later.

- **EXECUTED (prototype).** On the second submit the box shrank from 135.6 px to 46.0 px with its content gone, for 1.4 ms in Chromium and 3 ms in WebKit. Focus landed on the root while it was empty.
- **Event.** A frame-long gap is what failed in search-field S2, in every pair (READ, §2.2). The new node is still a creation, so it may fire. But nothing is gained over §4.1, and the gap must then be long to be safe.
- **Double speech.** VoiceOver may read an empty focused root, then the alert (INFERRED).
- **Focus.** The app focuses an empty box.
- **Timing.** A gap long enough to be heard is a visible collapse of about 90 px and a layout shift, every failed submit. Tuning it is `022r`'s problem again.

### 4.3 The item moves focus to the root on each new value

The item calls `focus()` on its root when `attempt` changes, as GOV.UK focuses on load.

- **Event.** None. Focus on the root is what happens today, and NVDA says "section" (READ, §1.3). This option alone does not fix the fault.
- **Focus.** It moves focus from the item, duplicating the app's move (`019` decision 3). Under an async server answer, it could take focus while the person has moved on. That is focus theft, and it would happen in every app that passes the prop.
- **Variants.** Focusing the heading or the first link (Primer's way) speaks something. But NVDA then drops the alert, because focus is inside it (READ, §2.1). It changes `019`'s contract, in which the root takes focus and apps call `ref.focus()`.

### 4.4 Two narrower variants, rejected

- **Keying the whole item, root included.** The root would be a new element on each attempt. `ref` would change under the app, and an app's own listeners on the root would be lost. Nothing is gained: the alert is the content node.
- **Keying inside the content node, around its children.** The alert node would stay and its children change. Firefox fires an alert event for that; Chromium treats it as a change inside an assertive live region, a different event (READ, §2.1). It departs from what the first submit does, which is the evidence NVDA speaks.

### 4.5 Recommendation

**Option 4.1: `{#key attempt}` around the content node.** It makes an unchanged second submit look, to every browser, exactly like the first: an alert node inserted, then focus moved to the root. That is the one case with speech evidence. It needs no timer, moves no focus, keeps `ref`, and costs about 56 bytes. With `attempt` unchanged, nothing re-renders, however often the errors are re-derived.

## 5. What else changes

- **The prop's doc comment.** `attempt?: number`, described in the item's source, so the API table and editors show it (`023`). It cites no internal document (`registry-comments.test.ts`).
- **The item's header comment** (lines 123–130). It says the form raises `attempt` on each failed submit, and that each new value renders the content anew.
- **The site page.** The error-summary page has no "Your part" group yet: its accessibility bullets mix what the item does with the app's duties (READ, `components/error-summary/+page.svelte`). Seven other pages already split "What Kuiper provides" from "Your part" (READ, e.g. `search-field`, `tag`). The page gains that split, with "raise `attempt` on each failed submit" among the duties. Its "Heard with VoiceOver …; JAWS … not tested" line must stay: `registry.test.ts` holds it until `030`.
- **The keyboard example** keeps a counter and raises it on each failed submit. Its intro says a second unchanged submit is announced again. The variants example renders from props and does not pass it.
- **The five components in the three blocks.** `sign-in-form`, `sign-up-form`, `sign-up-verify` and `settings-form` raise a counter in their `failed()` helper, beside `announce = true`. `settings-delete` has no such helper: it raises its counter in `confirm()`'s `catch`, before its `tick()`. In the server paths the summary is already removed and inserted (§1.4); raising the counter in the same update gives one insertion, not two (INFERRED, from §4.1's single task).
- **Cost** (`scripts/cost/`). `report.json` and `budgets.json` are ledger files (roadmap §2). The landing regenerates the sizes with `bun run cost --sizes-only` for `error-summary`, `sign-in`, `sign-up` and `settings`. The item is interactive, so its change review runs `bun run cost --only error-summary`, as `022r`'s did. The item stays inside its 12,900 B budget (EXECUTED, §4.1).
- **The registry's generated files.** `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/` regenerate for `error-summary`, `sign-in`, `sign-up` and `settings`. `registry.json` does not change: no file or dependency is added. The thumbnails' manifest is rewritten with `--hash-only` if an example's hash moves.
- **The screen-reader mutation patches.** `tests/sr/mutations/main/4-error-summary.patch` and `double-read/7b-error-summary.patch` edit the lines the key block wraps. Their context moves, so `mutations.test.ts`'s `git apply --check` would fail until they are re-made. Their witnesses do not change.
- **The changelog.** The 0.13.0 entry is unreleased. `error-summary` shipped in 0.3.0, so it gets a bullet: a new optional prop, nothing to change. The three blocks get one bullet: a repeat failure is announced again; update with `add`.

## 6. What this memo did not see

- Any speech. No reader runs here. Whether NVDA speaks the re-inserted node on the second submit is INFERRED from its speaking the first submit's insertion. The next CI speech run is the evidence.
- VoiceOver on this test, in either browser: it was not reached in run 4.
- Firefox: this container has no Firefox build. Firefox's behaviour is READ from its source only.
- JAWS and TalkBack: not in the suite.
- The exact engine builds CI uses: the sources read are today's branches.
