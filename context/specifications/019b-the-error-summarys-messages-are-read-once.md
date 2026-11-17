# 019b — The error summary's messages are read once

- **Status:** reverted 2026-11-17 by `019e` ("Reverted, 2026-11-17", under Landing notes). Landed as `331dd9d`. Built 2026-11-17 on `6482736` (`release/0.13.0`, `7ec5488`, with `022t` and `022z`, plus `020d`), in the `lane-i-019b` worktree, after run 7 ([44014551614](https://github.com/plutosystemsco/design-system/actions/runs/44014551614)), its required run. Fit to build after the spec review's re-check (2026-11-17; its write-in under criterion 11 made by the design lead). The review (`reviews/019b-the-error-summarys-messages-are-read-once-spec-2026-11-17.md`) raised 3 Medium and 4 Low findings; each is answered under "Review".
- **Date:** 2026-11-17
- **Author:** the design lead
- **Kind:** specification, lane I. A change to one item's rendered markup, `error-summary`: its links leave the list. An interface change, since an app's class or test that targets the list must change (decision 6). Three blocks install the item (`sign-in`, `sign-up`, `settings`) and change with it, with no change to their own source. No prop, token or dependency changes. A specification, not a small change: it changes an interface, and the owner is asked about the count (open question 2).
- **Depends on:**
  - `022t` (the same item and lane): its `{#key attempt}` block, built on `lane-i-attempt` and not yet on `release/0.13.0`. This builds on `022t`'s item and after it lands, one build at a time (roadmap §2, "Lanes").
  - `022z` (lane E): L3's new case. It lands first, so the next run judges this change with the rule the owner chose.
  - **One `matrix` push run that carries `022t` and `022z` and not `019b`.** This builds only after that run. It is the only CI evidence that `022z`'s rule catches VoiceOver's double on the list markup, and so criterion 11's seen-failing. Its run id and the four tests' VoiceOver results go in the landing notes. It is also `022z`'s criterion 5.
  - `019`, whose guarantees this keeps (decision 5).
- **Research it stands on:** [the error summary's list, read twice](../research/2026-11-17-the-error-summary-list-double-read.md), cited as *the memo*, by section; [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), cited as *run 5's memo*, §3.3 and §7; [`019`](./019-the-error-summary-alert-inside-and-the-label-in-view.md); `022t` (`.claude/worktrees/lane-i-attempt/context/specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md`).
- **The owner's ruling (2026-11-17),** from three options (*run 5's memo* §7): a message read as a list item and then as its link is a double read; L3 learns VoiceOver's doubled phrase (`022z`); the four tests and VoiceOver's error summaries fail until the item changes, and are not ledgered. This specification is that item change.

## Intent

The error summary is the box a failed submit puts at the top of a form. Each message is a link to its field, and each link sits alone in a list item.

When the summary appears, NVDA with Firefox reads each message twice: "Enter a project name, 1 of 3. Enter a project name, link, same page". VoiceOver with Chromium does too: "There is a problem Enter a project name Enter a project name …" (*run 5's memo* §3.3). The cause is the list item. Firefox names a list item with the text inside it, so it has its link's text. NVDA's alert announcement speaks every list item, then every link (*the memo* §1). VoiceOver, it seems, reads the item's group, then the link (*the memo* §2).

This change takes the links out of the list. Each message is then one link, read once. The box looks the same. The count NVDA gave, "1 of 3", goes with the list.

**Terms of art.**

- The **root**, the **content node** and an **alert event** are as `022t` defines them. The root is `data-slot="error-summary"`; the content node is `data-slot="error-summary-content"`, which carries `role="alert"`.
- The **body** is the `grid gap-2` box inside the content node that holds the message and the links.
- The **links box** is the new element that holds the links (decision 1).
- A **wrapper** is an element between the alert and a link that the accessibility tree keeps.
- A **dry run** is the speech suite with `SR_DRY=1` (`022`).

## Decisions

### 1. The links sit straight in a box, not in a list

The `<ul class="grid gap-1">`, its `<li>`s, and nothing else, are replaced:

```svelte
<div data-slot="error-summary-links" class="grid justify-items-start gap-1">
  {#each errors as error (error.id)}
    <a …as today…>{error.message}</a>
  {/each}
</div>
```

- Each link keeps its `href`, its classes (`inline-flex min-h-6 items-center underline underline-offset-4`), its `onclick` and its text. `focusField` does not change.
- The links box is rendered only when `errors` is not empty, as the list is today.
- It sits inside `022t`'s `{#key attempt}` block, where the list sits now.
- *Why this option* (*the memo* §5, option 7):
  - NVDA's alert walk speaks list items, lists, headings and focusable elements (*the memo* §1, READ). With no list item, it speaks each link once.
  - Chromium's tree has no wrapper between the alert and each link (*the memo* §4, EXECUTED). A wrapper per link is what VoiceOver seems to read first (*the memo* §2, INFERRED).
  - It adds no `role` attribute. `019`'s raw-HTML check holds, and axe finds nothing (*the memo* §4, EXECUTED).
- *Why not a `p` or a `div` per link* (options 2 and 3): each keeps a wrapper per link in Chromium's tree, a `paragraph` or a `generic`. VoiceOver may still read it before the link (*the memo* §4).
- *Why not `role="none"` on the list and its items* (option 6): it gives the same tree, but adds 4 role attributes for 3 errors to the markup, and fails `019`'s raw-HTML check, which would have to learn that `none` is not a live role. Plain elements say the same with less.
  - *What option 6 would keep:* the `ul` and `li` elements, so an app's `[&_ul]` or `[&_li]` class would still match. Option 7 makes that an interface change (decision 6). Nothing in this repository depends on it (READ, the spec review's grep of `src/`, `tests/` and `scripts/`: no selector targets the summary's `ul` or `li`, no block passes it a `class`, no test finds it by `getByRole("list")` or `"listitem"`; the cost interaction targets `[data-slot=error-summary] a`, which still matches). So the choice stands, and the migration note carries the cost.
- *Why not `role="none"` on the items only* (options 4 and 5): axe fails, on `list` or `aria-required-children` (*the memo* §4, EXECUTED).

### 2. `justify-items-start`: each link keeps its own width

- A grid stretches its children. Without `justify-items-start`, each link spans the whole row, 322 px at 1440 in both engines, against 128 to 200 px today (*the memo* §4, EXECUTED). The focus ring would run the width of the box, and so would the click target.
- With it, each link is as wide as today, ± 0.1 px (*the memo* §4, EXECUTED).
- *Why on the box, not `justify-self-start` on each link:* one class, where the layout is decided.

### 3. `data-slot="error-summary-links"`

- The links box carries `data-slot="error-summary-links"`, as the item's other parts carry theirs.
- *Why:* an app's class or test that targeted the list needs a stable thing to target instead (decision 6). Tests read it too (criterion 1).
- It is additive. No prop is added.

### 4. What is lost, and what is not

- **Lost: the count.** NVDA says "1 of 3" today, as a list item's place, and in browse mode a reader hears "list, 3 items". Only a list item has a place, so every markup that reads each message once loses it (*the memo* §4). The count is useful: it tells a person how much is left. Saying it in words is open question 2. This specification does not add words.
- **Kept:** the title first, then the message, then the links, in the same order. Each link's name, role, target and keyboard stop. The heading, for a reader moving by heading.
- **JAWS** is not tested in this project. INFERRED: it reads an alert as its text, so the words it hears do not change (*the memo* §4).

### 5. `019`'s and `022t`'s guarantees stay

- **The alert inside** (`019` decision 1): `role="alert"` stays on the content node, the root has no role and no name, and the heading is the alert's first child.
- **The label in view** (`019` decisions 4 to 6): `focusField`, `controlOf`, `questionOf` and `isClear` do not change. Each link still focuses its control, brings its question into view only if needed, and adds no hash.
- **The look** (`019` decision 9, criterion 12): the box's height, the title's and the first link's offsets do not move. *The memo* measured them unchanged, to the hundredth of a pixel (§4, EXECUTED). Each link's width is held too (criterion 4).
- **`022t`'s mechanism:** the links box is inside the keyed content node, so a new `attempt` renders it anew with the rest. `022t`'s criterion 1 counts "the 3 links" by role; it still finds 3.
- **The keyboard** (`019` criterion 10): the example's stops are the same. The links are not stops until the summary has focus, as today.

### 6. The interface change, and the changelog

The 0.13.0 entry is unreleased. `error-summary` shipped in 0.3.0. One bullet, after `022t`'s:

> - `error-summary`: **interface change.** The links are no longer in a list. Each sits straight in a new box, `data-slot="error-summary-links"`, so that NVDA reads each message once. Before, NVDA with Firefox, and VoiceOver with Chrome, read each one as a list item and again as its link. A reader no longer says how many errors there are ("1 of 3"). A class passed to the summary, or a rule of your own, that targeted its list (`ul`, `li`, `[&_ul]`, `[&_li]`) must now target `[data-slot=error-summary-links]` or its links. A test that found the errors by `ul`, `li`, `getByRole("list")` or `getByRole("listitem")` should find them as links. The box looks the same. No prop, export or class name changes. `sign-in`, `sign-up` and `settings` install it: update it with `add error-summary`.

- The bullet claims one reading for NVDA, which is READ in its source (*the memo* §1). For VoiceOver it is INFERRED until criterion 11's run. If that run shows VoiceOver reading each message once, the landing adds "and VoiceOver" to the bullet's first sentence. If it shows a double, the bullet and the page's sentence (decision 7) are amended with the finding.
- The upgrade guide gains no section. The bullet holds the migration note, as `019`'s structural change did (`019` decision 11).
- `registry.json`'s description stays: "a link to each invalid field" is still true.

### 7. The item's page and comments

- **The header comment** above the markup gains one sentence: the links are not in a list, so a reader reads each message once.
- **The page's "What Kuiper provides"** link bullet gains two sentences: "The links are not in a list, so each message is read once. A reader does not say how many there are." If criterion 11 shows a VoiceOver double of a message, the first sentence is amended with the finding (decision 6).
- The line "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." stays as it is. `registry.test.ts` holds it until `030` generates the status (`022t` decision 9).
- The Dos and Don'ts keep their count and words.

### 8. The five blocks

- `sign-in-form`, `sign-up-form`, `sign-up-verify`, `settings-form` and `settings-delete` do not change. None styles or queries the list (READ, `022t`'s build: no class on any `<ErrorSummary>`).
- Their summaries change with the item. Their e2e checks (`blocks.spec.ts`) and speech tests are judged again (criteria 7 and 11).

### 9. The mutation patches

- `tests/sr/mutations/main/4-error-summary.patch` and `tests/sr/mutations/double-read/7b-error-summary.patch` edit the `role` lines of the root and the content node. The list's lines are about 15 below the nearer of them (lines 154 and 169 in `022t`'s build), outside their 3 lines of context. Decision 7's header sentence is above both hunks, and moves them down a line.
- EXECUTED by the spec review, on a scratch copy of `022t`'s item with this change: `git apply --check` of each patch, alone and with its whole set, exits 0 with stderr empty, also with the header sentence on a line of its own (a one-line offset). `mutations.test.ts`: 29 pass. So the builder does not re-make them. If `git apply --check` fails on the built item all the same, they are re-made by `022t` decision 11's procedure. Their `expected.json` entries do not change.
- **The window before this lands** (`022z` decision 5). From `022z`'s landing to this one, the insertion test fails L3 unpatched under NVDA with Firefox, VO chr and VO wk. It is the witness of patch 4 (`main`) and of patch 7b (`double-read`), so neither proves anything in those pairs. In that window:
  - no `double-read` dispatch is run;
  - a `main` dispatch is read for its other patches only, and its patch 4 result is recorded in `022z`'s landing notes as not provable in those three pairs, with the run id;
  - `expected.json` and `notProvable` are not touched.
- **After this lands, stated in advance** (`022` decision 15): the five error-summary tests should pass unpatched under every pair (criterion 11). Then the insertion test passes unpatched again under NVDA with Firefox and both VoiceOver pairs, and patches 4 and 7b can be proven there. The first `main` dispatch and the first `double-read` dispatch after this lands each record, in this specification's landing notes with the run id, patch 4 and patch 7b, in turn, as provable again under NVDA with Firefox, VO chr and VO wk, or which pair still is not.

### 10. Cost and the generated files

- `scripts/cost/report.json` and `budgets.json` are ledger files. The landing takes the base's copies and runs `bun run cost --sizes-only` for `error-summary`, `sign-in`, `sign-up` and `settings`. INFERRED: the item's JS changes by a few bytes; it stays under its 12,900 B budget (`022t`'s build: 11,872 B). No budget changes.
- The item is interactive, so its change review runs `bun run cost --only error-summary`, as `022t`'s did.
- The build regenerates `error-summary.json` in `static/r/styles/maia/` and in `static/v0.13.0/r/styles/maia/`, and nothing else there (EXECUTED by the spec review). The blocks' files do not change: their own source does not. `registry.json` does not change.
- The thumbnails' manifest is rewritten with `--hash-only`. Four hashes move, `error-summary`, `sign-in`, `sign-up` and `settings`, since a block's hash includes its dependencies' files (EXECUTED by the spec review, `thumbnails.test.ts`). No picture should change (decision 5, the look).

## Design

`error-summary.svelte`, on `022t`'s item:

- In the body, `{#if errors.length > 0}` holds the links box of decision 1 in place of the `<ul>`. The `{#each}` block and each `<a>` move up one level, unchanged.
- The header comment's new sentence (decision 7).
- Nothing in either script block changes. `index.ts` does not change.

## Scope

- **In:**
  - `src/lib/registry/ui/error-summary/error-summary.svelte`: the links box, the header comment.
  - `src/routes/(site)/components/error-summary/+page.svelte`: the link bullet's two sentences.
  - Tests: `tests/e2e/error-summary.spec.ts` (criteria 1 to 6); `tests/unit/registry.test.ts` (criteria 8 and 9); the two mutation patches, only if `git apply --check` fails.
  - Ledger files: `CHANGELOG.md`, `error-summary.json` under `static/r/` and `static/v0.13.0/r/`, `scripts/cost/report.json`, the thumbnails' manifest.
- **Out:**
  - The five blocks' source (decision 8).
  - The count in words (open question 2), and any new prop.
  - The speech tests and their rules (`022z` is the rule).
  - The keyboard example and the variants example: they pass `errors` and do not see the list.
  - The page's "NVDA and JAWS are not tested" line, which `030` replaces.
  - Code-block's "Copied" twice, and every other item.

## Acceptance criteria

Every check is written before the code. **Seen failing** means run on `022t`'s item, the base this builds on, and failing there. **Guard** means passing before and after, proven by the mutation it names; the landing notes record it. Browser checks run in `chromium-light` and `webkit-light` here, and in every engine project in CI. Sizes are `019`'s, 1440 × 900 and 390 × 844.

1. **No list.** `error-summary.spec.ts`, on the keyboard example after an empty submit: the summary holds 0 `ul`, 0 `li`, and 0 elements with the role `list` or `listitem`; `[data-slot="error-summary-links"]` holds exactly 3 children, each an `a`, in the errors' order. **Seen failing:** today there is no links box, and 1 `ul` and 3 `li`. (e2e)
2. **The tree.** `019` criterion 1's snapshot becomes `alert` holding `heading "There is a problem" [level=2]` and the 3 links, with no `list` or `listitem`. Its other checks (no role or name on the root, the alert on the content node, the aria-hidden icon) do not change. **Seen failing:** today's snapshot has the list. (e2e)
3. **No wrapper, in Chromium's tree.** In `chromium` only, on `/example/error-summary/keyboard/` after an empty submit, from `Accessibility.getFullAXTree`, as `tag.spec.ts` reads it. Each of the 3 links inside `[data-testid="keyboard-fixture"]`, found by its DOM node (the AX node's `backendDOMNodeId`, not its name), has the `alert` as its nearest ancestor that is not ignored. *Why the example view and the DOM node:* the component page also holds the specimens, two of whose links share the example's names and, with no alert, sit under a `generic` (EXECUTED by the spec review). **Seen failing:** today it is a `listitem`. **Proven by mutation:** a `<p>` around each link fails it, with a `paragraph`. This is the check that tells decision 1 from options 2 and 3. (e2e)
4. **The look.** `019` criterion 12's test passes unchanged: each specimen's height, and its title's and first link's offsets, ± 0.5 px. Also, at both sizes, on the keyboard example: each link's width equals the width of a `Range` over its own text, ± 0.5 px, and is less than the links box's width. The check is self-relative, so it holds in every engine and with any font; a fixed figure moves with both (the spec review: 128 to 200 px in Chromium, 128.1 to 198.1 in WebKit, 132.05 to 206.17 without the web font). The builder records the base's figures in the landing notes, as a record, not as the test. **Guard,** passing before and after (EXECUTED by the spec review: equal to 0.01 px in Chromium and WebKit), proven by mutation: without `justify-items-start`, it fails (322 px against 132.05). (e2e)
5. **The raw HTML.** `019`'s test "the raw prerendered HTML: the 3 specimens hold 0 elements with a role" passes unchanged. **Guard**, proven by mutation: `role="none"` on the links box fails it. (e2e)
6. **axe.** `019` criterion 9's test, at both sizes, and `TEST_VIEWS` through `axe.spec.ts` (`022t`'s `/view/error-summary-attempt/` among them, at 1280), in both themes: 0 violations. (e2e)
7. **Nothing else moves.** `019`'s and `022t`'s tests in `error-summary.spec.ts` pass, apart from criterion 2's snapshot. So do the item's and the three blocks' tests in `blocks.spec.ts`, `primitives.spec.ts`, `keyboard.spec.ts` (the example's 4 stops), `theme` and `viewer`. `022t`'s criterion 1 still finds "the 3 links". (e2e)
8. **The changelog** holds decision 6's bullet in the 0.13.0 entry, once, marked an interface change, naming `error-summary-links` and `add error-summary`. A new check in `registry.test.ts`, **seen failing** on today's changelog. (unit)
9. **The registry and the docs.** `registry.test.ts`, `registry-comments.test.ts` and `blocks.test.ts` pass. A new `registry.test.ts` check, **seen failing** on today's files: the page's "What Kuiper provides" holds "each message is read once", and the item's header comment says the links are not in a list. `blocks.test.ts`'s voice check finds 0 banned words in the item's files. `mutations.test.ts` passes, each patch applying (decision 9). `thumbnails.test.ts` passes. (unit)
10. **The dry run.** `SR_DRY=1`, in `chromium` and `webkit`: `error-summary.sr.ts`, `sign-in.sr.ts`, `sign-up.sr.ts` and `settings.sr.ts` pass, `022t`'s two facts among them. (dry)
11. **The next CI speech run.** In the first `matrix` push run carrying this change, `022t` and `022z`, the five tests below pass **L1 for the title and every message, and L3 for every message**, in every pair that reaches them. The title's L3 is not part of this outcome; its risk is named below.

    | Test | NVDA chr | NVDA ff | VO chr | VO wk |
    |---|---|---|---|---|
    | error-summary: the insertion | pass | **pass** (fails today) | **pass** (fails under `022z`) | **pass** |
    | error-summary: the second submit, unchanged | pass | pass | pass | pass |
    | settings: a save with an empty name | pass | **pass** | **pass** | **pass** |
    | sign-in: an empty submit | pass | **pass** | **pass** | **pass** |
    | sign-up: an empty submit | pass | **pass** | **pass** | **pass** |
    | the three link tests (error-summary, settings, sign-in) | pass | pass | pass | pass |

    "Pass" in the table is this outcome, not the test's CI verdict: a title fault under L3 keeps that test red in CI while this criterion holds, and is the lane-I finding named below (the spec review's re-check, write-in).

    - **Seen failing:** the run named under "Depends on", with `022z` and without this change, in which the four tests fail L3 for their messages under VO chr (`022z` criterion 5), and under NVDA with Firefox as in run 5.
    - The second submit's row is `022t` criterion 14's outcome too. "Reaches", and "a pair that does not reach it is not a pass", are `022t` criterion 14's. The landing notes name each pair's result and the run id.
    - INFERRED, NVDA with Chromium's phrase changes from "list item, 1 of 3. Enter a project name, link, same page" to the link alone. Passing tests print no phrases. Where the phrases are wanted, the owner downloads the run's `sr-*` artifacts, since this environment cannot fetch them (*run 5's memo*, "How to read").
    - **The title's risk, stated in advance.** Under VoiceOver the title may fault L3 "within phrase" after this change. The cause would not be the list. The first submit both raises the alert and moves focus to the root, and VoiceOver reads the focused root as "There is a problem and 1 more item group" (*run 5's memo* §3.5). If that reading falls in the alert's own part, the title is said twice in one phrase, and `022z`'s rule faults it (EXECUTED by the spec review on `022z`'s prototype: "… Choose who can see the project There is a problem and 3 more items group" faults the title). That is `019` decision 1's design, the alert inside and focus on the root, which this change does not touch. A title fault is recorded with its phrase as a finding about the alert and the focus move, for lane I. It opens research with the phrases, and the markup is not changed by guess. This change stays landed (open question 3).
    - **If a VoiceOver pair still doubles a message,** that is a finding to fix, not a limit to record (constitution §4.4). A research memo opens with the phrases, and the markup is not changed again by guess. Under VO chr it shows that *the memo*'s §2 inference was wrong: Chromium's tree has no wrapper left (criterion 3). Under VO wk it shows only that the list was not the cause in Chromium's tree: WebKit's tree cannot be read here (*the memo* §6), so a VO wk double does not show which element VoiceOver read. Whether this change stays landed is open question 3.
    (CI)
12. **The gates.** `bun run check`: 0 errors. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in item files. The whole unit suite passes. `bun scripts/site/release-check.ts --before-ci` exits 0. `cost.test.ts` passes with fresh sizes for the four entries; the change review's `bun run cost --only error-summary` is recorded. (unit, cost)
13. **The checkpoint.** The design lead looks at the keyboard example in both themes, at both sizes: the insertion, the focus ring on each link, each link followed, and a specimen beside it. (checkpoint)
14. **The scorecard** is re-run after landing, and its run log has a row. Row 3 (h) can move only with a green speech run. (measure)

## Open questions

**Answered, 2026-11-17.** 1 (a), the links straight in a box: the owner. 2 (a), the count is lost now, and 3 (a), `019b` stays landed if a VoiceOver pair still doubles a message: the owner left both to the design lead ("you are in charge of delivering value"; "be a good steward of the project"), who ruled so. The title already says there are errors and each link names its field, so a spoken count is a feature, not a fix: it is not queued, and returns only if a speech run shows readers need it. NVDA with Firefox is fixed either way, so a VoiceOver double opens research, not a revert. *(Superseded: `019b` was reverted by `019e`, 2026-11-17.)*

For the owner. The specification takes the recommended option in each.

1. **The markup.** Which way out of the list?
   - **(a) The links straight in a box, no list (recommended).** One read in NVDA's walk, no wrapper in Chromium's tree, no role attribute, axe clean, the look unchanged (*the memo* §5).
   - (b) The list kept in the markup, with `role="none"` on it and its items. The same tree, but 4 role attributes for 3 errors, and `019`'s raw-HTML check must learn that `none` is not a live role.
   - (c) A `p` around each link. Plain markup, but a wrapper per link stays, which VoiceOver may still read first.
2. **The count, "1 of 3".** Every option in question 1 loses it.
   - **(a) Lose it now (recommended).** The title and the links say what to fix. Each link is still a stop, so Tab finds them all. A count in words can follow, additive, once there is evidence it is missed.
   - (b) Say it in words in a later specification: an optional count in the title, or a number at the start of each link, as Canada.ca's WET does (*the memo* §3). Either changes text the app writes or its tests see, so it needs its own specification.
   - (c) Keep the list, and the double read, until (b) is built. The four tests and VoiceOver's summaries keep failing, which blocks 0.13.0's green run.
3. **If criterion 11 fails in a VoiceOver pair, or the title faults L3 there, does `019b` stay landed?** Asked now, so the answer is ready before the run.
   - **(a) Keep it landed (recommended).** NVDA with Firefox reads once whatever VoiceOver does (*the memo* §1, READ). A title fault comes from the alert and the focus move, which this change does not touch, so reverting would not fix it. Record the run, open the research, and leave the row failing until it passes.
   - (b) Revert it, and go back to the list's double read under every reader that has it.

## Review

The spec review, 2026-11-17, raised 7 findings (3 Medium, 4 Low). Each is answered above.

1. **Medium,** criterion 11 could fail on the title for a cause it did not name, and its failure clause sent the research the wrong way. Criterion 11 now judges L1 for the title and every message, and L3 for every message. It names the title's risk in advance, with its real cause: the alert and the focus move on the same submit (`019` decision 1), not the list. A title fault is recorded as a lane-I finding with its phrase, opens research, and changes no markup by guess. A VO wk double is read only as "the list was not the cause in Chromium's tree". Open question 3 now covers a title fault too.
2. **Medium,** "or in the same push" removed the run that shows the change is needed, and the window left out patch 4. "Depends on" now requires one `matrix` push run with `022t` and `022z` and without this change; its run id and the four tests' VoiceOver results are criterion 11's seen-failing. Decision 9 states the window for both sets: no `double-read` dispatch, and no `main` dispatch read for patch 4. It adds that the first dispatch of each set after this lands records 4 and 7b as provable again under NVDA with Firefox, VO chr and VO wk.
3. **Medium,** criterion 4 pinned widths that move by engine and font. It is now self-relative: each link's width equals a `Range` over its own text, ± 0.5 px, and is less than the box's width. The base's figures go in the landing notes as a record.
4. **Low,** criterion 3 named no page, and failed on the specimens. It runs on `/example/error-summary/keyboard/` and finds the links by DOM node inside `[data-testid="keyboard-fixture"]`.
5. **Low,** decision 1 left out option 6's one advantage, and decision 9 missed the header sentence. Decision 1 says option 6 would keep an app's `[&_ul]` class matching, and cites the grep that shows nothing here depends on it. Decision 9 says the header sentence moves both hunks a line, and that the patches still apply (EXECUTED by the review), so they are not re-made.
6. **Low,** the bullet and the page claimed more than is known for VoiceOver. The bullet says NVDA reads each message once, and names "VoiceOver with Chrome" for the double. Decisions 6 and 7 say how the bullet and the page change with criterion 11's VoiceOver result.
7. **Low,** decision 10 named the wrong generated files. It now names `error-summary.json` in the two `static/` folders, and keeps the cost sizes and the thumbnails' hashes at four. Scope follows.

## Landing notes

Built 2026-11-17 by the lane-I builder, in `.claude/worktrees/lane-i-019b` (branch `lane-i-019b`, at `6482736`). Not committed. It waits for its change review. *(Superseded: `019b` was reverted by `019e`, 2026-11-17.)*

### The seen-failing run (criterion 11, "Depends on")

- **Run 7**, [44014551614](https://github.com/plutosystemsco/design-system/actions/runs/44014551614), a `matrix` push of `7ec5488`, carries `022t` and `022z` and not `019b` ([the seventh run's memo](../research/2026-11-17-the-seventh-matrix-run.md), cited as *run 7's memo*, "What the run carries"). It is the run this change waited for.
- **The four tests, READ in *run 7's memo* §3.3:**

  | Test | VO chr | VO wk | NVDA ff | NVDA chr |
  |---|---|---|---|---|
  | error-summary: the insertion | L3 within phrase, all three messages, 3/3 | pass | L3 within phrase, 3/3 | pass |
  | settings: a save with an empty name | L3, "Enter your name", 3/3 | pass | L3, 3/3 | pass |
  | sign-in: an empty submit | L3, both messages, 3/3 | pass | L3, 3/3 | pass |
  | sign-up: an empty submit | L3, both messages, 2/3; attempt 1 L1 | pass | L3, 3/3 | pass |

  - VO chr's phrase, the insertion: "There is a problem Enter a project name Enter a project name Enter the owner's email address Enter the owner's email address Choose who can see the project Choose who can see the project". NVDA with Firefox: "list. Enter a project name, 1 of 3. Enter a project name, link, same page. …".
  - So criterion 11's seen-failing holds under VO chr and NVDA with Firefox. `022z` criterion 5 is met (*run 7's memo* §3.3).
  - **VO wk passed all four** on the list markup, first attempt. `022z` expected them to fail. Passing tests print no phrases, so it is not known whether VoiceOver in WebKit reads each message once or doubles it in a way L3 does not see. The owner downloads `sr-voiceover-webkit-2`, `-3` and `-4` for their `phrases.json` entries (*run 7's memo* §3.3, §5). VO wk is therefore no seen-failing pair for this change.
  - **The title's risk** (criterion 11) was seen in run 7 under VO chr: the title faults L3 "within phrase 1" in 2 of 3 insertion attempts, 1 of 3 second-submit attempts and 1 of 3 settings attempts. The phrase is "There is a problem and 1 more item group. There is a problem Enter …". As criterion 11 states in advance, it is a lane-I finding about the alert and the focus move (`019` decision 1). This change does not touch it.
- **`022t` criterion 14** cannot be judged before this change lands (*run 7's memo* §3.2). It is judged in the first `matrix` push run carrying `019b`, from criterion 11's second-submit row.

### The change

- `error-summary.svelte`: the `<ul class="grid gap-1">` and its `<li>`s are replaced by `<div data-slot="error-summary-links" class="grid justify-items-start gap-1">`, inside `022t`'s `{#key attempt}` block. Each `<a>` keeps its `href`, classes, `onclick` and text. `focusField` and both script blocks are unchanged. The header comment gains, on a line of its own: "The links are not in a list, so a reader reads each message once."
- The page's link bullet gains: "The links are not in a list, so each message is read once. A reader does not say how many there are." The "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." line stays.
- `CHANGELOG.md`: decision 6's bullet, in the 0.13.0 entry's first part, directly after `022t`'s blocks bullet. It ends with `020d`'s pointer, " See also `error-summary` under "Also since 0.11.0", below.", which `020d`'s test 16 requires on every first-part `error-summary` bullet. Otherwise it is decision 6's words. "And VoiceOver" is not added (decision 6): that waits for criterion 11's run.

### Seen failing first, on the base (`6482736`, the item with the list)

Run in `chromium-light` and `webkit-light` on a fresh build of the base, then again on the built change.

| Check | Base | Built |
|---|---|---|
| 1. no list (new test) | fails both engines: `ul` count 1, wanted 0 | passes |
| 2. the tree (019 criterion 1's snapshot) | fails both engines: received `list > listitem > link` | passes |
| 3. no wrapper, CDP (new test, Chromium) | fails: each link's nearest kept ancestor is `listitem` | passes: `alert` for all 3 |
| 4. the width (new test, both sizes) | guard: passes | passes |
| 5. the raw HTML (019's test) | guard: passes | passes |
| 8. the changelog bullet (new unit test) | fails: 0 bullets | passes |
| 9. the page sentence and the header comment (2 new unit tests) | fail | pass |

### The guards, proven by mutation

A scratch spec, deleted after the run, applied each mutation on the built change, under `test.fail()`.

- **Criterion 3:** a `<p>` around each link. The nearest kept ancestors are `paragraph`, `paragraph`, `paragraph`. The check fails (Chromium).
- **Criterion 4:** `justify-items: stretch` on the links box. Each link is 322 px wide against a `Range` of 128, 198 and 200 px (Chromium), or 128.13, 197.09 and 198.10 (WebKit). The check fails in both.
- **Criterion 5:** `role="none"` on the links box in the fetched HTML. The specimens hold 2 role attributes. The check fails in both engines.

### Criterion 4's figures, as a record (not the test)

At 1440 and at 390, the same on the base and the built change:

- Chromium: links 128, 198 and 200 px; each `Range` the same. The box (the `ul` on the base, the links box after) is 322 px at 1440 and 280 px at 390.
- WebKit: links 128.14, 197.09 and 198.11 px; `Range`s 128.13, 197.09 and 198.10. The box is 322 and 280 px.

`019` criterion 12's test (each specimen's height and offsets) passes unchanged in both engines.

### The mutation patches (decision 9)

- `git apply --check` on the built item: each of the 11 patches alone, and each set (`main`, `double-read`) whole, exits 0 with stderr empty. Patches 4 and 7b were not re-made.
- `mutations.test.ts`: 29 pass. `expected.json` and `notProvable` are untouched.

### Ledgers

- `bun run build`: only `static/r/styles/maia/error-summary.json` and `static/v0.13.0/r/styles/maia/error-summary.json` change. `registry.json` and the blocks' files do not.
- `bun run cost --sizes-only`: 4 entries size-stale (`error-summary`, `sign-in`, `sign-up`, `settings`), and the `_catalogue` app, which holds every item, rebuilt with them. Runtime figures kept. `error-summary`: JS 11,872 → 11,875 B, CSS 891 → 906 B (`justify-items-start`), brotli JS 10,672 → 10,655 B. It stays under its 12,900 B budget. No budget changes. The change review runs `bun run cost --only error-summary` (decision 10).
- `bun scripts/site/thumbnails.ts --hash-only`: exactly 4 hashes move: `error-summary`, `sign-in`, `sign-up` and `settings`.

### The gate

- `bun run check`: 0 errors, 0 warnings.
- `bun run lint`: clean.
- `bun scripts/lint-literals.ts`: 0 literals in item files.
- `bun test ./tests/unit`: 1,963 pass, 0 fail. It includes `020d`'s guard and split tests (`never-released.test.ts` 18, `changelog-page.test.ts` 10), `registry.test.ts`, `registry-comments.test.ts` 17, `blocks.test.ts` 38 (0 banned words), `mutations.test.ts` 29, `thumbnails.test.ts` 10, `cost.test.ts` 40, and `engine-only.test.ts`.
- `bun scripts/site/release-check.ts --before-ci`: exits 0.
- e2e, `chromium-light` and `webkit-light`:
  - `error-summary.spec.ts`: every test passes; criterion 3 skips in WebKit, as listed.
  - `blocks.spec.ts`: everything passes except app-shell A3, in both engines. A3 is not this change's fault. The worktree's commit, `6482736`, has a short hash made only of digits, and the footer reads an all-digit version name as "no commit" (`vite.config.ts`, lines 27 to 34; `build/_app/version.json` reads `"6482736"`). So no `dd code` is rendered. It fails on any build of this commit, and stops failing once the change is committed under a hash with a letter in it.
  - axe and keyboard, the error-summary tests: 24 pass, in both themes. That is axe at 360, 768 and 1280 on the component page, `/view/error-summary-attempt/` at 1280, the keyboard fixture's 4 stops and the Enter behaviour.
  - `019`'s axe test (criterion 9) passes in `chromium-dark` and `webkit-dark` too.
  - The error-summary, sign-in, sign-up and settings tests in `primitives.spec.ts`, `theme.spec.ts` and `viewer.spec.ts`: 68 pass.
- The dry runs (`SR_DRY=1`), `chromium` and `webkit`: `error-summary.sr.ts`, `sign-in.sr.ts`, `sign-up.sr.ts` and `settings.sr.ts`, 30 pass. `022t`'s two facts are among them.
- Not run here: the full e2e suite, and the Firefox projects. CI runs them.

### Deviations

- **`tests/e2e/engine-only.ts`** gains one entry, outside Scope's list. Criterion 3 runs in Chromium only, and `022` decision 3 allows that only through `onlyIn`, with an `ENGINE_ONLY` entry. Its reason is "CDP: Accessibility.getFullAXTree", and its ruling is this specification. The count per helper moves from 2 `onlyIn` calls to 3; the other counts do not change (`notIn` 4, `onlyProjects` 4, `adaptsIn` 12).
- **Criterion 4's box on the base.** A guard must pass before and after, and the base has no links box. So the test measures against `[data-slot="error-summary-links"]`, or else the link's `ul`, the box it replaces. A comment says so. The fallback can go once the base is history.
- **The cost run** rebuilt `_catalogue` beside the four entries named in decision 10. It is size-stale whenever an item changes.

### The change review (2026-11-17)

`reviews/019b-the-error-summarys-messages-are-read-once-pr-2026-11-17.md`: lands. The design lead wrote in finding 3 (VO wk kept in decision 9's record) and finding 4 (the migration note names an app's own rule and a test by `ul` or `li`). Findings 1 and 2 are not this change's: the all-digit commit hash that fails app-shell A3, and a long unbreakable message overflowing at 320 px, both queued as small changes. Criterion 12: six `cost --only error-summary` runs were all noisy (hydrate 46.7 to 74.6 ms on the change, 39.3 and 46.1 on the base, against 53), so it is not held here; the tag's cost run on the release machine holds or clears it. The review's full unit run had one failure, the streaming p95 (3 of 3 alone), beside the builder's clean run. Criterion 4's fallback to the old `ul` stays until the next change to this item, which drops it. *(Superseded: `019b` was reverted by `019e`, 2026-11-17.)*

### Waiting on others

*Moot: `019b` was reverted by `019e` (2026-11-17). Decision 9's record and criteria 11 to 14 below are closed unrun.*

- **Criterion 11:** the first `matrix` push run carrying this change, `022t` and `022z`. Record its run id here, with each pair's result for the five tests and the link tests, and `022t` criterion 14's result. If VoiceOver reads each message once, add "and VoiceOver" to the bullet's first sentence (decision 6). If it doubles one, amend the bullet and the page sentence with the finding (decisions 6 and 7), and open research (open question 3: it stays landed).
- **Decision 9:** the first `main` dispatch and the first `double-read` dispatch after this lands record here whether patches 4 and 7b are provable again under NVDA with Firefox, VO chr and VO wk, as decision 9 says. Run 7 shows the witness passing unpatched under VO wk already (*run 7's memo* §3.3, INFERRED there), so VO wk is expected to be provable; the dispatch records it either way (the change review's finding 3, the design lead's ruling).
- **Criterion 12:** the change review's `bun run cost --only error-summary`.
- **Criterion 13:** the design lead's checkpoint, on the keyboard example in both themes at both sizes.
- **Criterion 14:** the scorecard, re-run after landing.

### Reverted, 2026-11-17

- **The run-8 evidence** ([the eighth matrix run](../research/2026-11-17-the-eighth-matrix-run.md), run [44078599146](https://github.com/plutosystemsco/design-system/actions/runs/44078599146), a `matrix` push of `db8fb65`, the first with this change). Criterion 11 is not met (§2.1).
  - **NVDA, both browsers,** the five summary tests, 3 of 3 each: the title is never spoken, and each message is said three times, twice in the alert's text and once as its link (§2.2). N-chr passed all five in run 7, on the list; it fails all five now.
  - **VO chr** doubles each message as before. Its phrase is run 7's, word for word, so the list was not the cause there (§2.3). *The memo*'s §2 inference was wrong.
  - **VO wk** passed, as in run 7 (§2.4).
  - So decisions 6 and 7's "each message is read once" is refuted for NVDA. Open question 3 (a)'s reason, "NVDA with Firefox reads once whatever VoiceOver does", is refuted too (§2.6).
  - `022t` criterion 14 is not met in this run either (§3). The re-announcement works in all four pairs; the summary's content fails.
- **The ruling.** The design lead, under the owner's delegation, chose *run 8's memo* §11 option (a): revert to the list markup now. It returns to run 7's state, with evidence: N-chr passes, NVDA speaks the title in both browsers, and N-ff's list double returns. Research then finds markup that every reader reads once. The markup is not changed again by guess.
- **`019e`** ([`019e-the-error-summarys-list-returns.md`](./019e-the-error-summarys-list-returns.md)), a small change in lane I, is the revert. The item, its page, the bullet and the tests return to their `6482736` content; `022t`'s `{#key attempt}` stays. This specification and its reviews stay as the record. "Waiting on others", above, is closed by it: criterion 11 was judged by run 8, and decisions 6 and 7's amendments are moot, since the bullet and the sentence are gone.
