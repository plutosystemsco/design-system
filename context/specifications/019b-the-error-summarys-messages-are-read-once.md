# 019b — The error summary's messages are read once

- **Status:** draft, for its specification review.
- **Date:** 2026-11-17
- **Author:** the design lead
- **Kind:** specification, lane I. A change to one item's rendered markup, `error-summary`: its links leave the list. An interface change, since an app's class or test that targets the list must change (decision 6). Three blocks install the item (`sign-in`, `sign-up`, `settings`) and change with it, with no change to their own source. No prop, token or dependency changes. A specification, not a small change: it changes an interface, and the owner is asked about the count (open question 2).
- **Depends on:**
  - `022t` (the same item and lane): its `{#key attempt}` block, built on `lane-i-attempt` and not yet on `release/0.13.0`. This builds on `022t`'s item and after it lands, one build at a time (roadmap §2, "Lanes").
  - `022z` (lane E): L3's new case. It lands first, or in the same push, so the next run judges this change with the rule the owner chose.
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

> - `error-summary`: **interface change.** The links are no longer in a list. Each sits straight in a new box, `data-slot="error-summary-links"`, so a screen reader reads each message once. Before, NVDA with Firefox, and VoiceOver, read each one as a list item and again as its link. A reader no longer says how many errors there are ("1 of 3"). A class passed to the summary that targeted its list (`[&_ul]`, `[&_li]`) must now target `[data-slot=error-summary-links]` or its links. A test that found the errors by `getByRole("list")` or `getByRole("listitem")` should find them as links. The box looks the same. No prop, export or class name changes. `sign-in`, `sign-up` and `settings` install it: update it with `add error-summary`.

- The upgrade guide gains no section. The bullet holds the migration note, as `019`'s structural change did (`019` decision 11).
- `registry.json`'s description stays: "a link to each invalid field" is still true.

### 7. The item's page and comments

- **The header comment** above the markup gains one sentence: the links are not in a list, so a reader reads each message once.
- **The page's "What Kuiper provides"** link bullet gains two sentences: "The links are not in a list, so each message is read once. A reader does not say how many there are."
- The line "Heard with VoiceOver on macOS. NVDA and JAWS are not tested." stays as it is. `registry.test.ts` holds it until `030` generates the status (`022t` decision 9).
- The Dos and Don'ts keep their count and words.

### 8. The five blocks

- `sign-in-form`, `sign-up-form`, `sign-up-verify`, `settings-form` and `settings-delete` do not change. None styles or queries the list (READ, `022t`'s build: no class on any `<ErrorSummary>`).
- Their summaries change with the item. Their e2e checks (`blocks.spec.ts`) and speech tests are judged again (criteria 7 and 11).

### 9. The mutation patches

- `tests/sr/mutations/main/4-error-summary.patch` and `tests/sr/mutations/double-read/7b-error-summary.patch` edit the `role` lines of the root and the content node. This change edits lines about 15 below the nearer of them (lines 154 and 169 in `022t`'s build), outside their 3 lines of context. So both should still apply (INFERRED).
- `mutations.test.ts` runs `git apply --check` on each. If either fails, it is re-made by `022t` decision 11's procedure. Their `expected.json` entries do not change.
- **What they prove changes, stated in advance** (`022` decision 15, with `022z` decision 5): with the list gone, the five error-summary tests should pass unpatched under every pair (criterion 11). Then patch 7b's witness, the insertion test, passes unpatched again under NVDA with Firefox and both VoiceOver pairs, and 7b can be proven there. The first `double-read` dispatch after this lands records it.

### 10. Cost and the generated files

- `scripts/cost/report.json` and `budgets.json` are ledger files. The landing takes the base's copies and runs `bun run cost --sizes-only` for `error-summary`, `sign-in`, `sign-up` and `settings`. INFERRED: the item's JS changes by a few bytes; it stays under its 12,900 B budget (`022t`'s build: 11,872 B). No budget changes.
- The item is interactive, so its change review runs `bun run cost --only error-summary`, as `022t`'s did.
- The build regenerates `static/r/styles/maia/` and `static/v0.13.0/r/styles/maia/` for the same four. `registry.json` does not change.
- The thumbnails' manifest is rewritten with `--hash-only` for the four moved hashes. No picture should change (decision 5, the look).

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
  - Ledger files: `CHANGELOG.md`, `static/r/`, `static/v0.13.0/r/`, `scripts/cost/report.json`, the thumbnails' manifest.
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
3. **No wrapper, in Chromium's tree.** In `chromium` only, from `Accessibility.getFullAXTree`, as `tag.spec.ts` reads it: each link's nearest ancestor that is not ignored is the `alert`. **Seen failing:** today it is a `listitem`. **Proven by mutation:** a `<p>` around each link fails it, with a `paragraph`. This is the check that tells decision 1 from options 2 and 3. (e2e)
4. **The look.** `019` criterion 12's test passes unchanged: each specimen's height, and its title's and first link's offsets, ± 0.5 px. Also, at both sizes, each link's width on the keyboard example equals its width measured on the base, ± 0.5 px; the builder measures them first and writes them into the landing notes. **Guard**, proven by mutation: without `justify-items-start`, the widths fail (*the memo* §4: 322 px against 128 to 200). (e2e)
5. **The raw HTML.** `019`'s test "the raw prerendered HTML: the 3 specimens hold 0 elements with a role" passes unchanged. **Guard**, proven by mutation: `role="none"` on the links box fails it. (e2e)
6. **axe.** `019` criterion 9's test, at both sizes, and `TEST_VIEWS` through `axe.spec.ts` (`022t`'s `/view/error-summary-attempt/` among them, at 1280), in both themes: 0 violations. (e2e)
7. **Nothing else moves.** `019`'s and `022t`'s tests in `error-summary.spec.ts` pass, apart from criterion 2's snapshot. So do the item's and the three blocks' tests in `blocks.spec.ts`, `primitives.spec.ts`, `keyboard.spec.ts` (the example's 4 stops), `theme` and `viewer`. `022t`'s criterion 1 still finds "the 3 links". (e2e)
8. **The changelog** holds decision 6's bullet in the 0.13.0 entry, once, marked an interface change, naming `error-summary-links` and `add error-summary`. A new check in `registry.test.ts`, **seen failing** on today's changelog. (unit)
9. **The registry and the docs.** `registry.test.ts`, `registry-comments.test.ts` and `blocks.test.ts` pass. A new `registry.test.ts` check, **seen failing** on today's files: the page's "What Kuiper provides" holds "each message is read once", and the item's header comment says the links are not in a list. `blocks.test.ts`'s voice check finds 0 banned words in the item's files. `mutations.test.ts` passes, each patch applying (decision 9). `thumbnails.test.ts` passes. (unit)
10. **The dry run.** `SR_DRY=1`, in `chromium` and `webkit`: `error-summary.sr.ts`, `sign-in.sr.ts`, `sign-up.sr.ts` and `settings.sr.ts` pass, `022t`'s two facts among them. (dry)
11. **The next CI speech run.** In the next `matrix` push run carrying this change, `022t` and `022z`:

    | Test | NVDA chr | NVDA ff | VO chr | VO wk |
    |---|---|---|---|---|
    | error-summary: the insertion | pass | **pass** (fails today) | **pass** (fails under `022z`) | **pass** |
    | error-summary: the second submit, unchanged | pass | pass | pass | pass |
    | settings: a save with an empty name | pass | **pass** | **pass** | **pass** |
    | sign-in: an empty submit | pass | **pass** | **pass** | **pass** |
    | sign-up: an empty submit | pass | **pass** | **pass** | **pass** |
    | the three link tests (error-summary, settings, sign-in) | pass | pass | pass | pass |

    - Each pass is L1 and L3 for the title and every message, with `022z`'s rule. The second submit's row is `022t` criterion 14's outcome too.
    - "Reaches", and "a pair that does not reach it is not a pass", are `022t` criterion 14's. The landing notes name each pair's result and the run id.
    - INFERRED, NVDA with Chromium's phrase changes from "list item, 1 of 3. Enter a project name, link, same page" to the link alone. Passing tests print no phrases; the run's `phrases.json`, where it can be read, records it.
    - **If a VoiceOver pair still doubles a message,** the cause is not the list item, and *the memo*'s §2 inference is wrong. That is a finding to fix, not a limit to record (constitution §4.4). A research memo opens with the phrases. The markup is not changed again by guess. Whether this change stays landed meanwhile is open question 3.
    (CI)
12. **The gates.** `bun run check`: 0 errors. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals in item files. The whole unit suite passes. `bun scripts/site/release-check.ts --before-ci` exits 0. `cost.test.ts` passes with fresh sizes for the four entries; the change review's `bun run cost --only error-summary` is recorded. (unit, cost)
13. **The checkpoint.** The design lead looks at the keyboard example in both themes, at both sizes: the insertion, the focus ring on each link, each link followed, and a specimen beside it. (checkpoint)
14. **The scorecard** is re-run after landing, and its run log has a row. Row 3 (h) can move only with a green speech run. (measure)

## Open questions

**Answered, 2026-11-17.** 1 (a), the links straight in a box: the owner. 2 (a), the count is lost now, and 3 (a), `019b` stays landed if a VoiceOver pair still doubles a message: the owner left both to the design lead ("you are in charge of delivering value"; "be a good steward of the project"), who ruled so. The title already says there are errors and each link names its field, so a spoken count is a feature, not a fix: it is not queued, and returns only if a speech run shows readers need it. NVDA with Firefox is fixed either way, so a VoiceOver double opens research, not a revert.

For the owner. The specification takes the recommended option in each.

1. **The markup.** Which way out of the list?
   - **(a) The links straight in a box, no list (recommended).** One read in NVDA's walk, no wrapper in Chromium's tree, no role attribute, axe clean, the look unchanged (*the memo* §5).
   - (b) The list kept in the markup, with `role="none"` on it and its items. The same tree, but 4 role attributes for 3 errors, and `019`'s raw-HTML check must learn that `none` is not a live role.
   - (c) A `p` around each link. Plain markup, but a wrapper per link stays, which VoiceOver may still read first.
2. **The count, "1 of 3".** Every option in question 1 loses it.
   - **(a) Lose it now (recommended).** The title and the links say what to fix. Each link is still a stop, so Tab finds them all. A count in words can follow, additive, once there is evidence it is missed.
   - (b) Say it in words in a later specification: an optional count in the title, or a number at the start of each link, as Canada.ca's WET does (*the memo* §3). Either changes text the app writes or its tests see, so it needs its own specification.
   - (c) Keep the list, and the double read, until (b) is built. The four tests and VoiceOver's summaries keep failing, which blocks 0.13.0's green run.
3. **If criterion 11 fails in a VoiceOver pair, does `019b` stay landed?** Asked now, so the answer is ready before the run.
   - **(a) Keep it landed (recommended).** NVDA with Firefox reads once whatever VoiceOver does (*the memo* §1, READ). Record the run, open the research, and leave the row failing until it passes.
   - (b) Revert it, and go back to the list's double read under every reader that has it.

## Landing notes

To be filled in when it lands.
