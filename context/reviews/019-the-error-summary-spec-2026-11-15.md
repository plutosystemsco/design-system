# Review of 019 — The error summary: the alert inside, the label in view

Reviews [`specifications/019-the-error-summary-alert-inside-and-the-label-in-view.md`](../specifications/019-the-error-summary-alert-inside-and-the-label-in-view.md).

- **Date:** 2026-11-15
- **Status:** in review; does not land yet
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (266 lines). It was checked against these:
  - the constitution and `AGENTS.md`;
  - `decisions.md`, "Four calls from the site-polish synthesis" (2026-11-15);
  - `research/2026-11-15-prior-art-govuk.md`;
  - GOV.UK Frontend at `a11bd33`: `error-summary.mjs`, `template.njk` and `common/index.mjs`'s `setFocus`, studied, not copied;
  - `018-site-polish.md`, decisions 10 and 13;
  - the tree at `4822ae5` plus its uncommitted work.

  In the tree I read:
  - `error-summary.svelte`, `alert.svelte`, `field-set.svelte`, `field-legend.svelte`, `radio-group.svelte` and `radio-group-item.svelte`;
  - `app-shell-header.svelte`;
  - `src/lib/site/chrome/bar.svelte`, `site.css` and `foundations/tokens/+page.svelte`;
  - the e2e and unit tests that read the summary.
- **Re-ran:** nothing in the repository was written but this file. One scratch script (`…/scratchpad/review-019/probe.ts`) loaded synthetic pages in Chromium through this repository's Playwright. Each page had a 64 px sticky header, a link, a label and an input. It compared today's `focus()`, the specification's `scrollIntoView({ block: "start" })` then `focus()`, and GOV.UK's `focus({ preventScroll: true })`. The figures are the label's and the input's top, in px, after 1.2 s (EXECUTED):

  | Page | Today's `focus()` | The spec's order | With `preventScroll` |
  |---|---|---|---|
  | Field in view, no `scroll-padding-top` | label 582, input 600 | **label 0, input 18** | — |
  | Field in view, `scroll-padding-top: 64px` | — | label 64, input 82 | — |
  | Far field, padding, `scroll-behavior: auto` | — | label 64, input 82 | — |
  | Far field, padding, `scroll-behavior: smooth` | — | **label 453, input 471** | label 64, input 82 |

  The registry graph was read: `sign-in`, `sign-up` and `settings` depend on `error-summary`.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | On a page with a sticky bar and no `scroll-padding-top`, a link now hides both the question and the focused field under the bar, including when the field was already in view. Today it leaves them visible. The system's own app shell is such a page unless the app follows a comment | decisions 4 and 5; Risks |
| 2 | Medium | `focus()` right after `scrollIntoView` undoes the scroll under `scroll-behavior: smooth`, which decision 4 invites; GOV.UK uses `preventScroll` for this | decision 4 |
| 3 | Medium | GOV.UK's evidence is for a summary focused on page load, where the alert does not fire. Pluto inserts the summary and moves focus at once, so the double-reading risk is larger than the spec says, and one VoiceOver listen is the only check | decisions 1 and 3; Risks; criterion 13 |
| 4 | Medium | `018` decision 13's thumbnails go stale for four items, not one, and 019 neither regenerates them nor lists `thumbnails.test.ts` | decision 11; Scope; criterion 12 |
| 5 | Low | The control and question rules: `labels` is undefined on a non-labelable control, and "any element with a `tabindex`" takes a `tabindex="-1"` group as the control | decision 6 |
| 6 | Low | The interface wording omits the moved children, a call to action for sticky bars, and the always-scroll behaviour | decision 10 |
| 7 | Low | Criteria gaps: the focused field is not checked unobscured; "within 1 px of the bar" fails where the page cannot scroll that far; no smooth-scroll case | criteria 2 to 4 |

## Findings, most severe first

1. **A link now puts the question and the field under any sticky bar the page has not declared** (decision 4, steps 4 and 5; decision 5; Risks, last bullet) — the item always calls `scrollIntoView({ block: "start" })` on the question, and adds no offset. On a page without `scroll-padding-top`, "start" is y = 0, under the bar.
   - Failure (EXECUTED, the table above): a 64 px sticky bar, no padding, the field already in view. Today the label stays at 582 px and the input at 600 px, both visible. With the specified order the label goes to 0 px and the **focused input to 18 px, wholly under the bar**. That is a WCAG 2.4.11 (Focus Not Obscured, AA) failure that the item itself causes.
   - Risks says such an app gets the question under its bar "as it gets every focused element today". That holds only for a field out of view. For one in view, today's `focus()` does not move it, and the item now moves it under the bar.
   - This is not only other people's apps. `app-shell-header.svelte` makes its header sticky whenever there is a sidebar, and sets no padding. Its doc comment asks the app to set `scroll-padding-top`, and only in the no-sidebar case. So `settings` inside an app shell with a sidebar, as installed today, breaks on update.
   - Fix (any one of these closes it; the first is the smallest):
     - After step 5, check the control. If `document.elementFromPoint` at the control's centre does not hit the control or a descendant, call `control.scrollIntoView({ block: "center" })`. This is no computed offset, so decision 5's reasoning stands, and the field is never left under an undeclared bar.
     - Or skip step 4 when the question and the control are both fully inside the viewport. That keeps today's behaviour in view, but still leaves the out-of-view case under the bar, so pair it with the first.
     - And either way: give the app shell's sticky header `data-sticky-bar`, or a scroll-padding rule of its own (an item change, in or after this specification). At the least, the changelog and the `app-shell` page must say to declare the padding.
   - Add a criterion on a synthetic page or view with a sticky bar and no padding: after each link, the focused control is unobscured (an `elementFromPoint` hit).
2. **Plain `focus()` after the scroll fights a smooth scroll** (decision 4: "Why plain `focus()`, not `preventScroll`", and "The scroll takes the page's own scroll behaviour").
   - Failure (EXECUTED): with `html { scroll-behavior: smooth }`, which an app sets with Tailwind's `scroll-smooth`, the field far down and padding 64 px, the label ends at 453 px, not 64 px. `scrollIntoView` starts an animated scroll. `focus()` runs while the control is still off screen and starts its own centring scroll, which wins.
   - GOV.UK calls `focus({ preventScroll: true })` for exactly this ordering (`error-summary.mjs`, lines 84–85). With it, the label lands at 64 px.
   - The decision's EXECUTED evidence ("a control already in view is not scrolled again") was taken with instant scrolling only.
   - Fix: `question.scrollIntoView({ block: "start", behavior: "instant" })`, then `control.focus()`. Instant overrides the page's smooth behaviour for this one jump, which also suits reduced motion. Then the in-view and out-of-view reasoning of decision 4 holds as written. Or use GOV.UK's `preventScroll` with finding 1's visibility check. Add the smooth case to the criteria (finding 7).
3. **The alert evidence is borrowed from a different timing** (decision 1, "Why inside, not removed"; decision 3; Risks, "A double reading on insertion"; criterion 13).
   - GOV.UK renders the summary on the server and focuses its root on page load (`error-summary.mjs`, line 24). A `role="alert"` present at load is not announced, so in GOV.UK's tested case focus does the announcing, and the inner role only covers dynamic changes. The 4.4.0 JAWS fix was found in that setting.
   - Pluto's summary is inserted by script and focused at the same moment, so the alert fires and the focus lands together. The structure is the same; the timing is not. So "Pluto … follows the structure that was tested" carries less weight than decision 1 gives it.
   - The only check is one VoiceOver listen. NVDA and JAWS, where the original failure was, are never heard.
   - The stop rule "read twice, or not at all" is good, but it is not specific enough to judge. A partial reading (the title alone, the links cut off) is the actual GOV.UK failure mode.
   - Fix:
     - Say in decision 1 that GOV.UK's case is a summary present at load, and that Pluto's is inserted.
     - Make criterion 13's listen record three things for the insertion: is the title spoken, is each link spoken, and is anything spoken twice. Pass means everything spoken at least once and nothing cut off. Twice is recorded, and it goes to the owner under Risks' option (a) or (b).
     - Name the readers not heard, NVDA and JAWS, in the changelog line's caveat or on the page.
4. **The thumbnails go stale for four items, and 019 does not regenerate them** (decision 11; Scope; criterion 12; `018` decision 13).
   - `018`'s manifest hashes "every file the item and its registry dependencies list, followed through" (`018-site-polish.md`, lines 254–259). `sign-in`, `sign-up` and `settings` depend on `error-summary` (READ, `registry.json`). Changing `error-summary.svelte` therefore stales 4 items, 8 images.
   - `018` decision 13 says only "`019` changes `error-summary`, so it regenerates that item's two images", and 019 says nothing.
   - Failure: after 019's build, `thumbnails.test.ts` fails on the three blocks and on `error-summary`, unless the builder improvises. Criterion 12's list of changed expectations does not name it.
   - Fix:
     - Scope: run `bun scripts/site/thumbnails.ts` for `error-summary`, `sign-in`, `sign-up` and `settings`, and commit the 8 images and the manifest.
     - Build order: do this after step 5.
     - Criterion 12: `thumbnails.test.ts` passes, with the 4 hashes changed.
     - Tell `018`'s author that the line in decision 13 should read four items.
     - Decision 11's "If `018` already gives the site its own `scroll-padding-top`" is the right hedge. Add the same for the bar's room, if `018` changes `--site-bar-room`.
5. **The control and question rules need two guards** (decision 6).
   - `control.labels[0]` throws when `labels` is undefined, which it is for any non-labelable element: a `div` with `role="radio"` or `role="checkbox"`, or an element found only through its `tabindex`. Fix: `control.labels?.[0]`.
   - "Any element with a `tabindex`" counts as focusable. So a group container an app gives `tabindex="-1"` becomes the control, and its radios are never reached. Fix: treat `tabindex` ≥ 0 and native focusables as controls. Treat an element whose `tabindex` is −1 as a group when it holds a `[tabindex="0"]` descendant.
   - Otherwise the rules fit the system's markup (READ):
     - `Field.Set`'s `id` lands on the `role="radiogroup"` `div`, not the `fieldset`;
     - `Field.Legend` is a `legend` that is a direct child of the `fieldset`;
     - bits-ui radios are `button`s with roving `tabindex`, so `[tabindex="0"]` finds the checked radio or the first;
     - a `button`'s `labels` holds its `Field.Label`.
6. **The interface wording leaves out three things an installed app needs** (decision 10).
   - The title and the body move one level down, into the new element. A `class` passed to the root with a child variant (`*:…`, `[&>h2]:…`) no longer reaches them.
   - The always-scroll behaviour is a change even for a field in view, and an app with its own sticky header must declare `scroll-padding-top`, or its fields land under the header (finding 1). The line names `scroll-padding-top`, but only as a condition, not as an action.
   - The root still takes any `role` an app passes. Say whether that is supported.
   - Fix: add "The title and the list are now inside `error-summary-content`, so classes that targeted the root's children must target it. If your page has a sticky header, set `scroll-padding-top` on `html` to its height, as `data-sticky-bar` does; otherwise a link brings the field under it." Adjust the wording to finding 1's chosen fix.
7. **Gaps in criteria 2 to 4** (the acceptance criteria).
   - They check that the label is clear and the input is "inside the viewport", not that the input is unobscured. Add the `elementFromPoint` test for the input as well as the question.
   - "Its top within 1 px of the bar's bottom" fails, through no fault, if the page cannot scroll that far. Add "or the page is at its maximum scroll".
   - Add a smooth-scroll case (finding 2) and a no-padding sticky-bar case (finding 1), on synthetic pages or a view.
   - The rest can fail on today's code, as criterion 13 requires:
     - criteria 1, 2, 3, 4, 7 and 9 fail today (the role is on the root; an in-view field does not move; the radio link does nothing; the padding is 72, not 88);
     - criteria 6 and 8 are regression guards that pass today, which is right for them;
     - criterion 5's list matches every test that reads the role (`blocks.spec.ts` lines 74, 740, 772, 790; `keyboard.spec.ts` 1182; `primitives.spec.ts` 807; READ).

## What holds

- The ruling is honoured: one small specification, before the tag, after `018`, with a changelog interface line.
- Decision 7 is sound:
  - the site's bar room (88 px, with the glass ending at 80 px, `site.css` line 11) is not the theme's `--size-bar`;
  - a layered rule cannot beat the theme's unlayered `html:has([data-sticky-bar])`, so dropping the attribute is the right move;
  - no other code keys on the attribute but `navigation.spec.ts`, which the specification changes.
- Decision 8's layout holds. The icon spans two rows, so the content must span both or an empty 4 px row appears. A spanning item adds no height, and the gap moves inside the content.
- Decision 6's legend rule (the fieldset's own `:scope > legend`) is tighter than GOV.UK's first descendant legend.
- No code is copied from GOV.UK. The citations are to files read.

## Constitution checks

- §4.3 tokens: met. No literal is added; `--site-bar-room` is the site's own variable.
- §4.4 accessible by default: **not yet**. Finding 1 can leave a focused field under a sticky bar (WCAG 2.4.11). Finding 3's evidence is thin for the live region.
- §4.6 dependencies: none added.
- §6 never break an installed app silently: the change is marked **interface change**, but the line omits finding 6's points. Finding 1 changes behaviour for app-shell apps without saying so.
- §6 never copy prior art: met.

## Verdict

Does not land yet: findings 1 (a focused field under an undeclared sticky bar), 2 (smooth scrolling undoes the scroll), 3 (the alert's evidence and its checkpoint) and 4 (four items' thumbnails go stale, unplanned) stand.

## Disposition

<to be filled in after the author answers>

## Re-check (2026-11-15)

I read the revised specification (349 lines) and its "Review" section, against the same files as the first pass, plus the following:
- `app-shell-header.svelte`, and the app shell's layout (the document scrolls, `min-h-svh`, so the page's `scroll-padding-top` governs);
- the theme's rule as emitted (`src/app.css`: `html:has([data-sticky-bar])`, unlayered, specificity (0,1,1)).

Nothing in the repository was written but this file.

**The first-pass findings:**

1. **Closed, with remaining finding R1.** The seven-step algorithm closes it. Step 5 leaves a clear field alone, step 6 brings the question in, and step 7 brings the focused control out from under an undeclared bar. My probe's in-view case keeps today's 582 / 600 px under step 5. Its no-padding far case is caught by step 7. The definition of "clear" is sound for the purpose: it uses the visual viewport and the topmost element at the centre. Criterion 5 and the app shell's attribute cover the rest.
2. **Closed.** Step 6 calls `scrollIntoView({ block: "start", behavior: "instant" })`, then `focus({ preventScroll: true })`, and criterion 6 tests the smooth case. That is the order that gave 64 px in my probe.
3. **Closed, with remaining finding R2.** The difference in timing is stated. The pass rule is specific. NVDA and JAWS are named as untested.
4. **Closed.** Five items lose their thumbnails: the four this finding named, plus `app-shell`. That makes 10 images, and criterion 16 counts them exactly.
5. **Closed.** The specification adopts the `labels?.[0]` guard and the rule that an element is focusable when its `tabindex` is 0 or more.
6. **Closed.** Both bullets say what an installed app must do.
7. **Closed.** "Clear" and "lands" are defined, and the criteria cover the missing cases.

**Remaining findings:**

- **R1. Medium: the theme's rule overrides the padding an app sets itself, and the changelog's remedy fails in the common layered case** (decision 7; the `app-shell` bullet).
  - `html:has([data-sticky-bar])` is unlayered, at (0,1,1). It beats the app's own `html { scroll-padding-top }`, which the docs told apps to add.
  - It also beats any layered rule whatever its selector: one in `@layer base`, or a `scroll-pt-*` utility on `<html>`.
  - So the remedy "set your value on `html:has([data-sticky-bar])`" works only if the app writes it unlayered, and after the theme's rule. Otherwise an app whose header is taller than 72 px, or that added room below it, silently gets 72 px. For the documented 4rem it is harmless.
  - **Fix (recommended):** make the theme's rule a default, not an override: `@layer base { :where(html:has([data-sticky-bar])) { scroll-padding-top: var(--size-bar); } }`. Any value an app sets, in any layer or as a utility, then wins. With no value set, the default holds, so the marketing bar and `/view/product-home/` keep 72 px.
    - This is a `pluto-theme` change. Move "the theme's `data-sticky-bar` rule" from Out to In.
    - It needs one changelog sentence ("an app's own `scroll-padding-top` now wins over the bar's default").
    - `generated.test.ts`'s pin of the rule changes, and criterion 17 lists it.
    - The site's rule (decision 8) is unaffected, since the site drops the attribute.
  - **If the override is kept instead:** the remedy must say to write the rule outside any `@layer`, after the theme's CSS.
- **R2. Medium: no agent may enable VoiceOver's AppleScript control** (decision 12, "Setting it up"; criterion 19).
  - The text says "if the builder cannot enable them on this machine without the owner", which implies the builder may try. VoiceOver's "Allow VoiceOver to be controlled with AppleScript", and accessibility permission for a terminal, are system settings on the owner's machine. Guidepup's setup changes them, and on recent macOS may need further system changes.
  - **Fix:** "The builder does not change system settings. The owner enables VoiceOver's AppleScript control and the terminal's accessibility permission, and runs the script, or listens for a minute at the checkpoint with the same pass rule. The design lead records what was heard."
  - Also say that the script is started only by the owner, since it takes over the machine's speech.
  - Record guidepup's licence in the dependency's line.
- **R3. Low: a cover that takes no pointer events reads as clear.** `elementFromPoint` skips an element with `pointer-events: none`. So a sticky overlay drawn that way (a fade mask, or a bar whose room is `pointer-events-none` with only its panel `auto`, as the site's is) does not count as covering.
  - The site's case is harmless: only its transparent 8 px strip is skipped.
  - Fix: add a line to Risks, beside the reverse case it already names.
- **R4. Low: criterion 5 is a guard that is never seen to fail.** It passes on today's code by design, which is right for a regression guard. But nothing then shows it can catch the fault it guards against.
  - Fix: in build step 2, also run criterion 5 once against the first draft's order: always scroll, no step 7. Record that it fails (in my probe, that order put the focused input at 18 px under a 64 px bar). Then restore. Note it in the Landing notes, as `013`'s builder did for its session tests.

Nothing else new.
- The app shell's attribute is right: its document scrolls, so the page's padding governs, and no site page renders a sticky shell header inline.
- The thumbnail count is right.
- Criteria 1, 2, 3, 4, 6, 7, 10 and 13 can fail on today's code.

**Verdict as it stands after the re-check (2026-11-15):** does not land yet: R1 (the theme's rule should yield to an app's own padding, or the remedy must say "unlayered") and R2 (the owner, not an agent, enables VoiceOver control) stand; both are small text or rule changes, and R3 and R4 are write-ins.
