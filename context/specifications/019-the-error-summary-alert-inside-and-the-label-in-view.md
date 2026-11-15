# 019 — The error summary: the alert inside, the label in view

- **Status:** landed, 2026-11-15, as `8377ffb` on `release/0.12.0`. Change review: [`../reviews/019-the-error-summary-pr-2026-11-15.md`](../reviews/019-the-error-summary-pr-2026-11-15.md) (1 Medium, 6 Low, all fixed; see "After the change review"). Criterion 19 passed: the owner listened with VoiceOver on macOS by hand on 2026-11-15 (`decisions.md`, "`019`'s VoiceOver listen passed"); the scripted run was blocked by guidepup's need for Full Disk Access and moves to CI in `022`. Revised twice after its specification review, 2026-11-15. Every finding is answered under "Review".
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** a fix to one registry item, `error-summary`, which has shipped since 0.3.0. Its page and its keyboard example change with it. Two more items change: `app-shell`'s sticky header declares itself, so the page's scroll padding allows for it (decision 7); and `pluto-theme`'s sticky-bar rule becomes a default that an app's own padding beats (decision 5). Two site lines change: the site's own padding, and the token rows that worked around it (decision 8). **Interface changes:** `error-summary` and `app-shell`, each with a bullet in the 0.12.0 changelog entry; `pluto-theme`'s change joins its existing bullet (decision 11). One dev-only package, for the screen-reader check (decision 12).
- **Depends on:** `018` (the site polish, [`018-site-polish.md`](./018-site-polish.md)), built first. It reworks the site bar and the component page, and adds the thumbnails. This specification's browser checks read the bar as `018` leaves it. Through `015` and `017`, the site itself. [`003`](./003-the-first-blocks.md) decision 9 is the item's original contract; this specification amends it in decisions 1, 4 and 6. [`006`](./006-the-app-shell-and-the-chat-pane.md) made the app shell's header; decision 7 amends it.
- **Ships with:** `013` to `018`, in the one 0.12.0 release and its one changelog entry.
- **Blocks:** the `v0.12.0` tag. The order before the tag is the follow-up commit, `018`, this specification, then the tag (`decisions.md`, "Four calls from the site-polish synthesis", 2026-11-15).
- **Design call:** `../decisions.md`, 2026-11-15, "Four calls from the site-polish synthesis", first bullet. The owner: the fix lands before the tag, as its own small specification, with a changelog interface line. The revision follows the design lead's rulings on the review's findings (under "Review").
- **Research it stands on:**
  - [`../research/2026-11-15-prior-art-govuk.md`](../research/2026-11-15-prior-art-govuk.md), §2 and idea 1: GOV.UK's error summary, and the two fixes Pluto lacks.
  - [`../research/2026-11-15-site-polish-synthesis.md`](../research/2026-11-15-site-polish-synthesis.md), §3 item 1 and §5 question 1.
  - **GOV.UK Frontend**, MIT, `context/prior_art/alphagov-govuk-frontend` at `a11bd33` (READ, 2026-11-15): `packages/govuk-frontend/src/govuk/components/error-summary/error-summary.mjs` (focus on the root at load, line 24; the label or legend scrolled, then `focus({ preventScroll: true })`, lines 84–88; the legend rule, lines 113–151), `template.njk` (`role="alert"` on a child, lines 7–9), `error-summary.puppeteer.test.js` (lines 182–216), and `common/index.mjs`'s `setFocus` (lines 43–74).
  - **The GOV.UK Design System**, `context/prior_art/alphagov-govuk-design-system` at `5f31aa7` (READ, 2026-11-15): `src/components/error-summary/changelog.yml` (2.4.0, 3.0.0, 3.3.0, 4.0.1, 4.4.0) and `index.md` (lines 43–53). Its written guidance is Crown copyright. It is studied, not quoted. No code or wording is taken from either project.
  - The specification review, [`../reviews/019-the-error-summary-spec-2026-11-15.md`](../reviews/019-the-error-summary-spec-2026-11-15.md), whose own measurements are cited as **EXECUTED (review)**.
- **Measurements made for this specification** are labelled **EXECUTED (019)**. They ran on 2026-11-15 in Chromium, from this repository's Playwright 1.64.1, by a scratch script outside the tree. They used synthetic pages loaded with `setContent`, and a dev server already running on the working tree (uncommitted 0.12.0 work, before `018`). Nothing in the repository was written.

## Intent

The error summary is the box a failed submit puts at the top of a form. It is Pluto's most screen-reader-sensitive item. It has two faults, shipped since 0.3.0.

1. **The alert is on the focused element.** `role="alert"` sits on the item's root (`error-summary.svelte`, line 57). The form also moves focus to that root. So the live announcement and the focus move compete over one element. GOV.UK had the same structure and moved the role to a child, because JAWS did not read the whole summary (READ, `changelog.yml`, 4.4.0; `template.njk` lines 7–9).
2. **A link focuses the field but not its question.** `focusField` calls `field.focus()` (line 42). The browser decides where the field lands. The label can stay under a sticky bar.

The research found a third fault, in the same function:

3. **A link to a radio group does nothing.** A radio group's id is on a `div` with `role="radiogroup"` and no `tabindex`. `focus()` on it does nothing, and the link has already cancelled its own navigation (EXECUTED (019), below).

This specification fixes all three. It changes no prop, export or class name. It must not make anything worse on a page that has a sticky bar but has not declared it, which is how the review found the first draft (decision 5).

**Terms of art.**

- A **live region** is an element whose changes a screen reader announces without focus moving there. `role="alert"` makes one that interrupts.
- A **sticky bar** is a bar that stays at the top of the viewport as the page scrolls. A bar is **declared** when the page's `scroll-padding-top` allows for it.
- `scroll-padding-top` on the page's root element shrinks the area the browser scrolls things into. Anything scrolled into view, by a link, by focus or by script, then stops below that line.
- The **question** of a field is the text that says what to enter: its label, or, for a set of radios or checkboxes, the set's legend.
- An element is **clear** when its box lies inside the visual viewport (for an element taller than the viewport, its top edge does), and the topmost element at its centre is the element itself, inside it, or holds it. So nothing, such as a sticky bar, covers it.

## What the research found

- **The faults are real in this tree** (EXECUTED (019)).
  - On the design site at 1440×900 and at 390×844, the page's `scroll-padding-top` is 72 px. The site bar's box is 88 px tall. Its glass panel ends at 80 px.
  - On the error-summary page's keyboard example, the page was scrolled so that "Owner email"'s label sat under the bar (label top 46.7 px, input top 84.3 px). Following the summary's "Enter the owner's email address" link focused the input. Nothing moved: the label stayed at 46.7 px, under the glass. The same held at 390 (46.4 px). No hash joined the address.
  - On the radio-group page, the group is a `div`, `role="radiogroup"`, with an id and no `tabindex`. `focus()` on it leaves focus where it was. Its radios carry `tabindex` 0, −1 and −1; the checked one holds the 0. Each radio's `labels` holds its one label.
  - On a synthetic page with a 72 px declared sticky bar and a field 1500 px below the summary, today's `focus()` put the label wherever Chromium centred the field (452 px at 1440×900, 424 px at 390×844). Scrolling the label into view first, then focusing with `preventScroll`, put the label at 72 px at both widths. A link to the radio group's id moved focus nowhere today; resolved to the group's tabbable radio, it focused that radio with the legend at 72 px.
  - `focus()` on an element whose top sat at 46, 10 or −30 px, under that padding, scrolled it to 72 px.
  - The settings block has no sticky bar; its page's `scroll-padding-top` is `auto`. `labels` finds "Name" and "Email address" for its two inputs.
- **The first draft's order fails in two places** (EXECUTED (review), a 64 px sticky bar):
  - With no `scroll-padding-top` and the field in view, `scrollIntoView({ block: "start" })` then `focus()` moved the label from 582 px to 0 and the focused input to 18 px, under the bar. Today's `focus()` leaves both visible.
  - Under `scroll-behavior: smooth`, with padding and a far field, the label ended at 453 px, not 64: `focus()` started its own scroll while the smooth one ran. With `focus({ preventScroll: true })` it landed at 64 px.
- **The app shell's sticky header is not declared** (READ, `app-shell-header.svelte`). With a sidebar the header is always sticky, 64 px tall, and sets no padding. Its `sticky` prop's comment asks the app to set `scroll-padding-top`, for the no-sidebar case only.
- **What GOV.UK does** (READ, the files in the header).
  - The summary is rendered with the page. Its root takes focus on load. Script adds `tabindex="-1"` before it focuses, and removes it on blur (`setFocus`; `changelog.yml` 4.0.1).
  - `role="alert"` is on a child that holds the title and the body. The template says why: a role on the focused element races the focus move, and content is missed. The root has no name: `aria-labelledby` was removed with the role move, for JAWS (4.4.0).
  - So GOV.UK keeps a live role. It is inside, not on the element that takes focus.
  - A link scrolls the label or legend into view, then focuses the input with `preventScroll`. This also makes NVDA read the label (`error-summary.mjs`, lines 56–60 and 84–88; `changelog.yml` 2.4.0).
  - The legend is used for a radio or a checkbox in a fieldset. For other inputs in a fieldset it is used only if the input stays in the upper half of the viewport (lines 113–145; 3.3.0, after inputs in large fieldsets ended off screen).
  - The guidance links a radio or checkbox question to its first option (`index.md`, line 53).
  - The tests check three things after a link: focus is on the input, the label or legend is at the top, and the address has no hash (`error-summary.puppeteer.test.js`, lines 182–216). The hash was fixed in 3.0.0, because it stopped the summary taking focus after the next submit.

## Decisions

### 1. The alert moves inside; the root keeps focus

- The root (`data-slot="error-summary"`, the element `ref` binds) carries **no role**. It keeps `tabindex="-1"`.
- A new inner element, `<div data-slot="error-summary-content">`, holds the title, the message and the list. It carries `role="alert"` while `announce` is true, and no role otherwise.
- The icon stays outside it, `aria-hidden` as before.
- `announce` keeps its name, its type and its default (`true`). It now sets the inner element's role. Its doc comment says so.
- A `role` an app passes still lands on the root, as `{...restProps}` does today. It is not supported: it would put a role back on the focused element. The item's page says not to pass one.
- *Why inside, not removed:* the owner's ruling took the synthesis's fix, "the alert on an inner node" (§3 item 1). The live role also covers two cases where focus alone says nothing: an app that forgets to move focus, and a second failed submit whose errors differ while focus is already in the summary.
- **The timing is not GOV.UK's, and the spec says so.** GOV.UK's tested case is a summary rendered with the page and focused on load. A role present at load is generally not announced (INFERRED, with the review), so there focus does the speaking, and the inner role covers later changes only. The 4.4.0 JAWS fix was found in that setting. Pluto inserts the summary by script and focuses it in the same moment, so the alert fires as the focus lands. The structure is GOV.UK's; the timing is not. So GOV.UK's evidence supports the structure. It does not show what Pluto's summary sounds like. Decision 12's check is the evidence for that.
- *Why not GOV.UK's script-managed `tabindex`:* apps call `ref.focus()` today and rely on the attribute. Removing it would be a second interface change for no gain. A mouse click inside the box focuses the root, but draws no ring, since `:focus-visible` does not match a click.

### 2. The heading is read first, and the root has no name

- The heading is the first child of the alert. So the announcement begins with the title: "There is a problem", then the message, then the links.
- The root gets no `aria-label` and no `aria-labelledby`. GOV.UK removed its `aria-labelledby` because JAWS then read the name alone (READ, 4.4.0).
- The heading stays a real heading at `level`, so a reader moving by heading finds the summary again (`003` decision 9).

### 3. Focus when the summary appears: unchanged

- The form moves focus to the root after every failed submit, as `003` decision 9 set. The five components that compose the item already do. Nothing in them changes.
- Chromium's `focus()` scrolls the root clear of the page's `scroll-padding-top` (EXECUTED (019)). So a summary under a sticky bar comes out from under it once the page declares its bar (decisions 5, 7 and 8).

### 4. A link moves only what it must, then focuses the control

On a click on a link (Enter on a link fires one):

1. Find the element with the link's id. If there is none, do nothing, and let the browser follow the fragment, as today.
2. Resolve the **control** (decision 6). If none is found, do the same.
3. Cancel the click's default, so no hash joins the address.
4. Find the control's **question** (decision 6).
5. **If the question and the control are both clear, focus the control with `focus({ preventScroll: true })`, and stop.** Nothing moves.
6. Otherwise call `question.scrollIntoView({ block: "start", behavior: "instant" })`, then `control.focus({ preventScroll: true })`.
7. **Then, if the control is not clear,** call `control.scrollIntoView({ block: "center", behavior: "instant" })`.

- *Why step 5:* a field already in view, with its question, stays where the reader left it. Today's `focus()` does the same. The first draft moved it, and on a page with an undeclared bar it moved it under the bar (EXECUTED (review)).
- *Why the question first, in step 6:* left to itself the browser places the control and leaves its label wherever it falls (EXECUTED (019)). The question lands at the top of the visible area, below any bar the page declares.
- *Why `behavior: "instant"` and `preventScroll`:* under `scroll-behavior: smooth`, a plain `focus()` started its own scroll during the smooth one and won (EXECUTED (review)). One instant jump, then a focus that does not scroll, lands where step 6 says. The jump is also right under reduced motion. GOV.UK uses `preventScroll` for the same reason (READ, lines 84–88).
- *Why step 7:* it is the guard against an undeclared bar. On such a page, step 6 puts the question at y = 0, under the bar, and the control may follow it there. Centring the control brings it out. It also covers a long set of radios whose control ends below the view, GOV.UK's 3.3.0 fault, with no extra rule.
- *Why "clear" uses `elementFromPoint`:* it asks the page what is on top, without the item knowing which bars exist. That is no computed offset (decision 5): nothing is measured or subtracted.

### 5. The offset is the page's `scroll-padding-top`: no token, no computed offset

- The item adds no offset of its own. `scrollIntoView` stops below the page's `scroll-padding-top`.
- That is already the system's rule for sticky bars. A bar marked `data-sticky-bar` sets it from `--size-bar` (`009` decision 6, WCAG 2.4.11). The marketing bar marks itself. After decision 7, so does the app shell's header.
- **The theme's rule becomes a default.** Today `pluto-theme` emits `html:has([data-sticky-bar]) { scroll-padding-top: var(--size-bar) }` unlayered, at specificity (0,1,1) (READ, `src/app.css` line 641; `scripts/build-tokens.ts` line 485). It beats an app's own `html { scroll-padding-top }`, any rule in a layer, and a `scroll-pt-*` utility on `<html>` (READ, the review's re-check, R1). It now emits `@layer base { :where(html:has([data-sticky-bar])) { scroll-padding-top: var(--size-bar); } }`.
  - `:where` gives it no specificity, and the base layer is the lowest the app's stylesheet uses. So any value an app sets wins: unlayered, in `@layer base` on `html`, in `@layer components`, or as a `scroll-pt-*` class.
  - With no value set, the default holds. The marketing bar and `/view/product-home/` keep 72 px.
  - *Why:* a bar the page declares by attribute should get room by default, and an app that knows its own bar's height should be able to say so without fighting the theme. This also makes decision 7 safe for apps that already followed the docs.
  - **The old rule must be deleted by hand.** The shadcn CLI adds the new rule to an app's stylesheet but never deletes one the new theme lacks (as the 0.12.0 entry already says of variables). Until the app deletes the old unlayered `html:has([data-sticky-bar])` rule, it still overrides the app's own value. The changelog says so (decision 11).
- *Why not `scroll-margin-top` from a token on the question:* the item does not own the label or the legend, and their margin would have to equal whatever bar the page has. One value, on the page, covers links, Tab focus and fragments alike.
- *Why not a computed offset:* the item would have to find every sticky or fixed element that overlaps the question. It would guess, and repeat what the page already declares.
- **On a page with an undeclared sticky bar,** the focused control is never left under it (decision 4, steps 5 and 7). The question may be: step 6 puts it at the top, and step 7 then centres the control, with the question just above it in a short field. The changelog and the item's page tell an app with a sticky header to declare it (decision 11).

### 6. Radios, checkboxes and groups

**The control.**

- An element is **focusable** here when it is an enabled `input` (not hidden), `select`, `textarea` or `button`, an `a[href]`, or has `tabindex` 0 or more.
- If the element with the link's id is focusable, it is the control.
- Otherwise, if it holds a `[tabindex="0"]` descendant, it is a **group**, and that descendant is the control: a radio group's current radio, the checked one or the first. This holds whatever the group's own `tabindex`, so a container an app gave `tabindex="-1"` still reaches its radios.
- Otherwise, if it holds a focusable descendant, the first one is the control.
- Otherwise, if it has `tabindex="-1"`, it is the control itself (a radio that is not the current one, for example).
- So a link may name a radio group's id, which is the `Field.Set`'s `id` (`field-set.svelte`), or its first radio. Before, the group's id did nothing (EXECUTED (019)). A checkbox question links to its first checkbox: the checkboxes have no group element.

**The question.**

1. If the control is a radio or a checkbox (`input[type=radio]`, `input[type=checkbox]`, `role="radio"` or `role="checkbox"`) inside a `fieldset` with a legend, it is that fieldset's own legend (its `:scope > legend`).
2. Otherwise the control's first label, `control.labels?.[0]`, which covers `for` and a wrapping label. `labels` is undefined on an element that cannot be labelled, such as a `div` with `role="checkbox"`; the guard skips it.
3. Otherwise the element its `aria-labelledby` names first.
4. Otherwise the control itself.

- *Why not GOV.UK's half-viewport rule for text inputs in a fieldset:* Pluto's sets are often sections, not questions. The settings form's "Profile" set holds Name and Email address. A text control's own label is always its question here. The legend is used only where the options' labels are not the question: radios and checkboxes.
- *What if a long set pushes the control out of view:* step 7 of decision 4 brings the control in.

### 7. The app shell's sticky header declares itself

- `app-shell-header.svelte` adds `data-sticky-bar` to its `<header>` whenever it is sticky: with a sidebar (always), or with `sticky`. Not otherwise.
- The theme's rule then sets the page's `scroll-padding-top` to `--size-bar`, 72 px. The header is 64 px, so anchors, focus and the summary's questions stop 8 px below it.
- The `sticky` prop's doc comment, the block's `STICKY` comment in `blocks/app-shell/+layout.svelte`, and the `app-shell` page's bullet drop the instruction to add `html { scroll-padding-top: 4rem }`. They say the header now declares itself.
- *Why the attribute, not a rule of the header's own:* it is the system's one way to declare a bar (`009` decision 6). A second rule would be a second source.
- **What it changes for an installed app** (decision 11): an app that added nothing now gets 72 px while the header is sticky. An app that followed the docs and added `html { scroll-padding-top: 4rem }`, or any value of its own, keeps it: the theme's rule is now a default (decision 5). The line is no longer needed for the theme's 72 px, and an app may keep it to pin its own value.
- *Why in this specification:* without it, the system's own shell is a page with an undeclared bar. The `settings` block inside a shell with a sidebar would have its questions land under the header (EXECUTED (review), the same geometry). The design lead's ruling on finding 1 puts it here.
- No site page renders a sticky app-shell header inline: the `app-shell` page shows it in a viewer's frame, and the Start page's use is a code sample (READ, `start/your-product/+page.server.ts`). Even if one did, decision 8's site rule, in `@layer components`, would beat the theme's layered default.

### 8. The site: the bar's room is the padding

The design site's bar floats in a room taller than itself: 88 px, with the 72 px glass panel 8 px down (`site.css`, `--site-bar-room`; `chrome/bar.svelte`). It is marked `data-sticky-bar`, so the theme pads the page by 72 px. Anything scrolled to the top then sits 8 px under the glass. That includes this item's questions and the focused summary (EXECUTED (019)).

- The site bar **keeps `data-sticky-bar`**. In `site.css`, inside `@layer components`, the site sets its own value: `html:has([data-slot="site-bar"]) { scroll-padding-top: var(--site-bar-room); }`.
- *Why keep the attribute:* it is the simpler of the two. With the theme's rule a layered default (decision 5), a rule in `@layer components` beats it, and `site.css` must sit wholly in that layer anyway (`015` criterion 28). So the site overrides the value the system's way, as any app now can. Dropping the attribute would have changed `bar.svelte` and the test that finds the bar by it (`navigation.spec.ts`, line 940), for no gain. The first revision dropped it only because the theme's rule was then unlayered and could not be beaten.
- *Why this is the site's, not the theme's:* the theme's default is right for the system's bars, which are `--size-bar` tall or less. Only the site's bar floats in a larger room.
- The token tables' rows on `/foundations/tokens/` drop `scroll-mt-(--site-bar-room)`. It worked around the same 8 px. Kept, a row's fragment would land 176 px down.
- A composition page shows its bar inside a frame, so its own page is unaffected. `/view/product-home/` keeps 72 px (`compositions.spec.ts`, unchanged).

### 9. The look does not change

- The new element is `col-start-2 row-span-2 grid gap-1`. The icon already spans two rows (`alert.svelte`, `*:[svg]:row-span-2`). Spanning both, the content keeps the alert's 4 px between the title and the body, with no empty row below. The body keeps its `grid gap-2`.
- *Why not `display: contents` on the new element:* an element so displayed has dropped its role from the accessibility tree in some browsers. A role must not depend on that.
- Criterion 12 holds the box's height and the title's and first link's positions to their values before the change.

### 10. The item's page and its keyboard example

**The keyboard example** (`src/lib/site/examples/error-summary/keyboard.svelte`) gains a radio question after the two inputs:

- a `Field.Set` with `id="project-visibility"`, a `Field.Legend variant="label"` "Who can see it", and a radio group of "Only me", "My team" and "Everyone", each radio with an id and a `Field.Label`;
- no option checked at first; an empty submit adds "Choose who can see the project", linked to `project-visibility`;
- its intro: "Submit the form empty: the summary is inserted, its content announced as an alert, and takes focus. Each link focuses its field, and brings the field's label into view if it is not. The last one goes to the radio group's first radio, below its legend."

**The page** (`src/routes/(site)/components/error-summary/+page.svelte`):

- The When paragraph's states: "Announced: inserted by a failed submit, its content carrying `role="alert"`, and focused, as the Keyboard example shows."
- The Accessibility list's first bullet: `role="alert"` is on the summary's content, not on the root that takes focus, and only when a submit in this page inserted it. Do not pass `role` to the summary.
- A bullet: the root has `tabindex="-1"`, no role and no name. The heading is read first.
- The link bullet: a link focuses its field. If the field or its label is out of view or covered, it first brings the label to the top of the page, or a radio or checkbox's legend. No hash joins the address. A page with a sticky header declares it, with `data-sticky-bar` or its own `scroll-padding-top`, so the label stops below it.
- A bullet: a link to a radio group's id focuses its checked radio, or its first. Link a checkbox question to its first checkbox.
- A bullet, the known gap: "Heard with VoiceOver on macOS. NVDA and JAWS are not tested."
- The Dos and Don'ts keep their count and words.
- `018`'s "Changed in 0.12.0" line will show on this page, and on `app-shell`'s, from decision 11's bullets.

### 11. The interface changes, and the changelog bullets

The 0.12.0 entry gains two bullets, after `kbd`'s:

> - `error-summary`: **interface change.** `role="alert"` moves from the summary's root to a new inner element, `data-slot="error-summary-content"`. The title, the message and the list move inside it, so a class passed to the root that targeted its children (`*:…`, `[&>h2]:…`) must now target that element. The root, the element `ref` binds and the form focuses, has no role; it keeps `tabindex="-1"`. Do not pass it a `role`. `announce` sets the inner element's role and still defaults to true. Code or tests that found the alert on the root, or expected `getByRole("alert")` to be the focused element, should look for `[data-slot="error-summary-content"]`. A link still focuses its field, and leaves the page where it is when the field and its label are already in view and uncovered. Otherwise it first scrolls the label to the top, or the fieldset's legend for a radio or a checkbox, and never leaves the field under a sticky bar. If your page has a sticky header, set `scroll-padding-top` on `html` to its height, as a bar marked `data-sticky-bar` does; otherwise the label can land under the header. A link to a radio group's id now focuses its checked radio, or its first; before, it did nothing. No hash joins the address, as before. No prop, export or class name changes, and the box looks the same. `sign-in`, `sign-up` and `settings` install it: update it with `add error-summary`.
> - `app-shell`: **interface change.** While the header is sticky (with a sidebar, or with `sticky`), it carries `data-sticky-bar`, so `pluto-theme` gives the page a default `scroll-padding-top` of `--size-bar`, 72 px. Anchors, focus and the error summary's links stop below the 64 px header. The line the docs asked for, `html { scroll-padding-top: 4rem }`, is no longer needed; if you added it, or any value of your own, it wins over the theme's default once the old theme rule is deleted (see `pluto-theme`). Update with `add app-shell`.

The existing `pluto-theme` bullet gains, at its end:

> The rule a bar marked `data-sticky-bar` brings is now a default: it sits in `@layer base`, as `:where(html:has([data-sticky-bar]))`, so an app's own `scroll-padding-top` wins over it, in any layer or as a `scroll-pt-*` class on `html`. With none set, the page still gets `--size-bar`. After updating, delete the old unlayered `html:has([data-sticky-bar]) { scroll-padding-top: var(--size-bar); }` from your stylesheet: the CLI does not remove it, and while it stays it overrides your own value.

- The site's changes (decision 8) are not registry items and get no bullet.
- `registry.json`'s descriptions stay: both are still true.
- `static/r/` and `static/v0.12.0/r/` are regenerated. `tests/fixtures/static-r-amendments.json` gains the `error-summary`, `app-shell` and `pluto-theme` entries the regenerated files need, each citing the 2026-11-15 decision and this specification. Each entry must be used (`registry-comments.test.ts`).
- **Thumbnails.** `018` decision 13 hashes, for each item, its files, its registry dependencies' files, `src/app.css` and the script. Decision 5 changes `src/app.css`, which `build:tokens` writes. So **every item's** hash changes, and the script regenerates all their images: two per item, as `018` lands them (150 at `018`'s count). The pictures themselves change only where an item's look does, and none does. This is the 1–2 minute run `018` names. `018`'s author is told its decision 13 should name four items for the error summary alone; the theme change here widens it to all.

### 12. The screen-reader check, automated where it can be

- **The tool:** `@guidepup/guidepup`, which starts and drives VoiceOver on macOS and returns the phrases it spoke. MIT. A `devDependency` at exactly `0.40.0`, the latest release, published 2026-11-01 (READ, the npm registry, 2026-11-15), pinned by `bun.lock`. It ships in no item. Its licence and version are recorded here and in the Landing notes; `package.json` and `bun.lock` hold the pin.
- **The script:** `scripts/a11y/voiceover-error-summary.ts`. It is not part of `bun run test`, since it needs macOS, VoiceOver and a visible browser. It opens the error-summary page in a headed Chromium through Playwright, with VoiceOver running. It submits the keyboard example empty, then submits it again unchanged, then follows each link. It writes the spoken-phrase log of each step to stdout.
- **The pass rule, for the insertion and the second submit:**
  - the title is spoken at least once;
  - every error message is spoken at least once;
  - nothing is cut off: each of those phrases is spoken whole;
  - the title is not read twice in a row.
- **No agent changes system settings, or starts the script.** The script needs VoiceOver's "Allow VoiceOver to be controlled with AppleScript" and accessibility permission for the terminal, which are settings on the owner's machine; guidepup's own setup changes them. The script also takes over the machine's speech. So:
  - the builder writes the script and adds the package, and does not run either;
  - **the owner** enables the two settings and starts the script, or instead listens for one minute at the checkpoint, with the same pass rule;
  - the design lead records the log, or what the owner heard.
- **The log, or the listen, is recorded** in `decisions.md` and the Landing notes.
- **If it fails,** the build stops. The design lead asks the owner: (a) keep the inner alert, as GOV.UK does, and record the reading (recommended if only the double reading fails); or (b) drop the live role and rely on focus alone, which makes `announce` do nothing (a further interface change).
- **NVDA and JAWS are not tested.** They need Windows. This is recorded as a known gap, on the item's page (decision 10) and under Risks. It is not a claim that they work.

### 13. Build order, and the fit with `018`

- **After `018`.** `018` reworks the site bar and the component page's layout, and adds the thumbnails. The browser checks here read the bar's height and the question's position live, and pin no pixel figure from today's layout.
- Decision 8 applies to the bar `018` leaves, whatever its room. If `018` changes `--site-bar-room`, the rule follows it. If `018` already gives the site its own `scroll-padding-top`, decision 8's rule is skipped, and criterion 13 still checks it.
- The version stays 0.12.0. The tag follows this specification's change review.

## Design

### The item

`error-summary.svelte`. Sketched here; the builder writes the code.

- **Module script.** `titleFor` is unchanged. Three private helpers, not exported:
  - `controlOf(element)`: decision 6's control.
  - `questionOf(control)`: decision 6's question.
  - `isClear(element)`: the term of art. The box against `visualViewport` (falling back to the window), and `document.elementFromPoint` at the box's centre.
- **Instance script.** `focusField(event, id)` becomes decision 4's seven steps.
- **Markup.**
  - `Alert`, as now, but `role={null}` always.
  - The icon.
  - `<div data-slot="error-summary-content" role={announce ? "alert" : null} class="col-start-2 row-span-2 grid gap-1">`, holding the heading (classes as now, less `col-start-2`) and the body (`grid gap-2`, less `col-start-2`).
- **The comment above the markup** says: the form inserts the summary with `announce` and moves focus to its root; the alert role is on the content, so the focus move and the announcement do not compete; an app rendering a server's errors passes `announce={false}` and moves focus itself. No internal document is cited (`registry-comments.test.ts`).
- `index.ts` is unchanged. The item's files stay two.

### The theme

- `scripts/build-tokens.ts`: the `html:has([data-sticky-bar])` entry (line 485) moves into the emitted `@layer base` block as `:where(html:has([data-sticky-bar]))`, with its `009` comment and the new reason. `bun run build:tokens` rewrites `src/app.css`, `registry.json`'s `pluto-theme` and the registry JSON.

### The app shell

- `app-shell-header.svelte`: `data-sticky-bar={sidebar || sticky ? "" : undefined}` on the `<header>`; the `sticky` doc comment and the markup comment say the header declares itself.
- `blocks/app-shell/+layout.svelte`: the `STICKY` comment.
- `src/routes/(site)/components/app-shell/+page.svelte`: the bullet about `scroll-padding-top`.

### The site

- `src/lib/site/site.css`: decision 8's rule, inside `@layer components`, with a one-line comment.
- `src/routes/(site)/foundations/tokens/+page.svelte`: drop `scroll-mt-(--site-bar-room)` from its two row templates.

## Scope

**In:**

- `src/lib/registry/ui/error-summary/error-summary.svelte`.
- `app-shell-header.svelte`, the app-shell layout's comment and the `app-shell` page (decision 7).
- The keyboard example and the error-summary page (decision 10).
- Decision 8's three site files.
- `CHANGELOG.md`: decision 11's two bullets.
- `static/r/`, `static/v0.12.0/r/`, regenerated; `tests/fixtures/static-r-amendments.json`.
- `scripts/build-tokens.ts`'s sticky-bar rule, and what `build:tokens` writes from it (decision 5).
- Every item's thumbnails, and the manifest (decision 11).
- `@guidepup/guidepup` in `package.json` and `bun.lock`, and the VoiceOver script (decision 12).
- The tests in criterion 17's list.

**Out:**

- The five composing components (`sign-in-form`, `sign-up-form`, `sign-up-verify`, `settings-form`, `settings-delete`): their focus calls stay. Their links already name focusable inputs.
- Every other item, and every other theme rule.
- Moving focus from inside the item on mount (`003` decision 9's reason stands).
- Error wordings, a form-errors guide (GOV.UK memo, ideas 2 and 5).
- NVDA and JAWS (decision 12). The VoiceOver script in any automated suite.

## Acceptance criteria

Every browser check runs in both theme projects, light and dark. **Sizes** are 1440×900 and 390×844. On the site, "the bar's bottom" is the bottom of `[data-slot="site-bar"]`'s box. **Lands** means: the question's top is within 1 px of the bar's bottom, or the page is at its maximum scroll and the question is clear. **Clear** is the term of art; a test checks it with `elementFromPoint` at the element's centre and its box against the viewport.

1. **The roles.** On the error-summary page, after an empty submit of the keyboard example:
   - the root is focused, has `tabindex="-1"`, and no `role`, `aria-label` or `aria-labelledby`;
   - it holds exactly 1 `[data-slot="error-summary-content"]`, with `role="alert"`, holding the heading and the 3 links; the icon is outside it, `aria-hidden="true"`;
   - the root's ARIA snapshot (`toMatchAriaSnapshot`) is: an `alert` holding `heading "There is a problem" [level=2]`, then a list of 3 links, "Enter a project name", "Enter the owner's email address", "Choose who can see the project".

   In the raw prerendered HTML, the 3 specimens hold 0 elements with a `role` attribute. (e2e)
2. **A field already in view.** At both sizes, after the empty submit, for each of the 3 links (focused, then Enter): the test first records whether its question and control are clear. Afterwards focus is on the control (the third: "Only me", `role="radio"`); the question and the control are clear; the address is unchanged, with no hash. If both were clear before, `window.scrollY` is unchanged. If not, the question lands. (e2e)
3. **From under the bar.** At both sizes, with the page scrolled so that "Owner email"'s label is not clear (its top above the bar's bottom) and its input is: a click dispatched on its link makes the label land, and leaves the label and the input clear. The same for the third link with the legend "Who can see it" under the bar: the legend lands, and "Only me" is focused and clear. (e2e)
4. **The radio link.** The third link names `project-visibility`, the radio group's id, and focuses "Only me". This fails on the current code. (e2e, in criteria 2 and 3)
5. **An undeclared bar.** On the frameless example view `/example/error-summary/keyboard/`, the test injects, outside the app's root, a 64 px sticky bar with no `scroll-padding-top`. At both sizes:
   - with the fields pushed 1600 px below the summary (an injected style), each link leaves its control focused and clear;
   - with the fields in view, a link whose question and control are clear leaves `window.scrollY` unchanged;
   - with the page scrolled so that "Owner email"'s label is under the bar and its input clear, the link leaves the input focused and clear.

   These are regression guards: they pass on the current code and must keep passing. (e2e)
6. **Smooth scrolling.** On the same view, with the injected bar marked `data-sticky-bar`, `html { scroll-behavior: smooth }` injected and the fields pushed 1600 px down: after each text link, and 1.2 s, the label's top is within 1 px of 72 px, and the label and the input are clear. (e2e)
7. **The app shell, and the default.** On `/view/app-shell/sidebar/`, the header carries `data-sticky-bar` and the page's `scroll-padding-top` is 72 px. On `/view/app-shell/`, which is not sticky, the header has no `data-sticky-bar` and the padding is `auto`. `blocks.spec.ts`'s A1b still passes. On `/view/app-shell/sidebar/`, each of 4 injected app values wins over the default, measured as the page's `scroll-padding-top`: an unlayered `html { scroll-padding-top: 4rem }` (64 px); the same in `@layer base` (64 px); the same in `@layer components` (64 px); and `html { scroll-padding-top: 6rem }` in `@layer utilities`, where a `scroll-pt-24` class would sit (96 px; an injected class would not be compiled). (e2e)
8. **The blocks.** In `blocks.spec.ts`, every check that read `role="alert"` on the summary reads it on its `[data-slot="error-summary-content"]` (tests 1, 28, 30, 31; lines 74, 740, 772, 790), and the root has none. Test 4 finds no role on either. Tests 2, 5, 8 and 15 still focus their fields. (e2e)
9. **axe.** After the empty submit, axe reports 0 violations on the error-summary page at both sizes. (e2e)
10. **The keyboard.** The example's stops are 4: `input:Project name`, `input:Owner email`, `radio:Only me`, `button:Create project`, each with the ring unclipped. The behaviour test: Enter on Create project focuses the root, whose content has the alert role; Tab reaches the first link; Enter focuses Project name. (e2e)
11. **No hash, ever.** In criteria 2, 3, 5 and 6, `location.hash` is empty and the address is unchanged after every link. (e2e)
12. **The look.** At 1440×900, for each of the 3 specimens: its height, and the title's and first link's top offsets from the root's top, equal the values measured before the change, ± 0.5 px. The builder measures them in build step 1 and writes them into the Landing notes. (e2e)
13. **The site's padding.** On the error-summary page and on `/`, the page's `scroll-padding-top` equals the site bar's height. The site bar still carries `data-sticky-bar`. `/view/product-home/` still reads 72 px. On `/foundations/tokens/`, opening a row's fragment puts the row's top within 1 px of the bar's bottom. (e2e)
14. **The changelog.** The 0.12.0 entry holds exactly 1 `error-summary` bullet and 1 `app-shell` bullet, each marked `**interface change.**`, and still exactly 1 `pluto-theme` bullet. The `error-summary` bullet names `error-summary-content`, `announce`, `scroll-padding-top`, `data-sticky-bar` and `add error-summary`. The `app-shell` bullet names `data-sticky-bar`, `scroll-padding-top` and `add app-shell`. The `pluto-theme` bullet ends with decision 11's sentences, naming `@layer base`, `:where(html:has([data-sticky-bar]))` and `scroll-pt-*`, and telling the app to delete the old rule. `registry.test.ts` checks the 11 names. (unit)
14a. **The emission.** `generated.test.ts`: the theme's `css` holds `:where(html:has([data-sticky-bar]))` inside `@layer base`, with `scroll-padding-top: var(--size-bar)`, and no top-level `html:has([data-sticky-bar])`. `src/app.css` agrees. `bun run build:tokens`, run twice, changes 0 files the second time. (unit)
15. **The registry.** `registry-comments.test.ts` passes: 0 citations in either item's comments, and every amendment in the fixture used. `blocks.test.ts`'s voice check passes over `error-summary`'s 2 files. `registry.json`'s `error-summary` and `app-shell` entries are unchanged; its `pluto-theme` entry changes only in that rule. The fixture gains entries for `error-summary`, `app-shell` and `pluto-theme`. (unit)
16. **The thumbnails.** `thumbnails.test.ts` passes. Every item's hash differs from the manifest `018` landed, since `src/app.css` changed, and every item's two images are regenerated. (unit)
17. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass; `bun run check` 0 errors; `bun run lint` clean; the literal lint 0 violations and 1 allowance (L24). Expectations change only in:
    - `primitives.spec.ts`: E1 (no role anywhere in the specimens) and E2 (the role on the content; the root's none);
    - `keyboard.spec.ts`: the error-summary stops and behaviour test (criterion 10);
    - `blocks.spec.ts`: criterion 8's tests;
    - `generated.test.ts`: the sticky-bar pin (criterion 14a);
    - `registry.test.ts`: criterion 14;
    - `thumbnails.test.ts`: criterion 16 (the manifest, not the test);
    - new: criteria 1 to 7, 9, 11, 12 and 13.

    (all suites)
18. **Tests first, and the checkpoint.** Criteria 1, 2, 3, 4, 6, 7, 10, 13 and 14a are written first and seen failing on the current code; the failure counts go into the Landing notes. Criterion 5 is written first and seen passing. It is then run once against the first draft's link order (always scroll the question to the top, then a plain `focus()`, no step 5 or 7), on a scratch copy of the item, and seen failing; the review's probe put the focused input at 18 px under a 64 px bar with that order. The copy is then discarded. The result goes into the Landing notes. At the checkpoint the design lead looks at the example in both themes at both sizes: the insertion, each link, the radio link, and the box beside a specimen; and at the app shell with a sidebar. (checkpoint)
19. **The screen-reader check.** Decision 12's script runs, or the owner listens, and the pass rule holds for the insertion and the second submit. The phrase log, or what was heard, is in `decisions.md` and the Landing notes. NVDA and JAWS are recorded as not tested. (checkpoint)

## Build order

1. Measure criterion 12's figures on the current code. Write them into the Landing notes.
2. **Tests first.** Write criteria 1 to 14a's checks and criterion 17's changed expectations. Run them. Record which fail and which pass. Run criterion 5 once against the first draft's order, and record that it fails (criterion 18).
3. The item (decisions 1, 2, 4, 6, 9), and the theme's rule (decision 5), then `build:tokens`.
4. The app shell (decision 7).
5. The site (decision 8).
6. The example and the pages (decision 10).
7. **Checkpoint** (criterion 18). Then the screen-reader check (criterion 19): the owner enables VoiceOver's control and starts the script, or listens (decision 12). Stop if it fails.
8. The changelog, the registry build, the amendments fixture, the thumbnails (decision 11).
9. Every suite, the lints and `check`.
10. The change review. Then the tag.

## Risks

- **NVDA and JAWS are not tested,** and JAWS is where GOV.UK's failure was found. Windows is not available here. The role's place rests on GOV.UK's structure; the speech rests on VoiceOver alone (decision 12).
- **The timing differs from GOV.UK's** (decision 1). The alert fires as the focus lands. VoiceOver may read the summary twice. The pass rule allows a double reading only if the title is not read twice in a row; anything worse goes to the owner (decision 12).
- **Firefox and Safari are not run by the suites.** `behavior: "instant"`, `preventScroll` and `visualViewport` are in all three engines' current releases (INFERRED; not run). The VoiceOver check runs Chromium.
- **An undeclared sticky bar can still cover the question,** though never the focused control (decision 5). A tall question above a short field is the case: step 7 centres the field, and the question may stay under the bar. The changelog tells apps to declare their bar.
- **"Clear" samples one point.** A control half covered at its edge, with its centre uncovered, counts as clear. The control is then partly visible, which WCAG 2.4.11 allows.
- **A cover that takes no pointer events reads as clear.** `elementFromPoint` skips an element with `pointer-events: none`. So a sticky overlay drawn that way, such as a fade mask, or a bar whose room is `pointer-events-none` with only its panel `auto`, does not count as covering. On the site only the room's transparent 8 px strip is skipped, which covers nothing. An app's opaque bar drawn with `pointer-events: none` would hide a field that "clear" calls clear; such a bar also lets clicks through to what it hides, so it is unlikely.
- **A control that cannot be hit-tested** (`pointer-events: none`, or covered by a transparent sibling of its own field) reads as covered. Step 7 then centres it: a needless move, not a hidden field. `input-otp`'s real input is the case to watch at the checkpoint.
- **A checked radio far down a long list.** Step 7 brings the radio in; the legend may then leave the view. No test covers it; the example's group is short.
- **`018` edits the same bar and owns the thumbnails.** This specification builds after `018` lands and applies to its version (decision 13).
- **An app that updates but keeps the old theme rule** still has it override its own value (decision 5). The CLI does not delete it. The `pluto-theme` and `app-shell` lines tell the app to delete it.

## Review

From [`../reviews/019-the-error-summary-spec-2026-11-15.md`](../reviews/019-the-error-summary-spec-2026-11-15.md). The design lead ruled on each finding; this revision applies the rulings.

1. **Accepted, both parts (High).**
   - Decision 4 gains step 5 (a link moves nothing when the question and the control are clear) and step 7 (if the focused control is not clear after the scroll, it is centred with `block: "center"`). "Clear" is a term of art: inside the visual viewport, and the topmost element at its centre is it, inside it or holds it.
   - Decision 7 is new: the app shell's sticky header carries `data-sticky-bar`, so the theme pads the page. It is an interface change to `app-shell`, with its own changelog bullet (decision 11), its tests (criterion 7) and its two thumbnails (criterion 16).
   - Criterion 5 tests a sticky bar with no padding. Criterion 2 tests a field already in view: nothing moves.
   - The Risks line is replaced: an undeclared bar can cover the question, never the focused control.
2. **Accepted (Medium).** Decision 4, step 6: `scrollIntoView({ block: "start", behavior: "instant" })`, then `focus({ preventScroll: true })`. Criterion 6 is the smooth-scroll case.
3. **Accepted (Medium).** Decision 1 states that GOV.UK's tested case is a summary focused on load, and that Pluto's is inserted and focused at once. Decision 12 makes the check automated where possible: `@guidepup/guidepup`, dev-only and pinned, logs what VoiceOver speaks; if it cannot be enabled without the owner, the owner listens for a minute at the checkpoint. The pass rule: the title and every error spoken at least once, nothing cut off, the title not read twice in a row. NVDA and JAWS are recorded as untested on this platform, a known gap, on the page and under Risks. R2 later made the owner, not an agent, the one who enables VoiceOver's control.
4. **Accepted (Medium).** Decision 11 regenerates the thumbnails of `error-summary`, `sign-in`, `sign-up` and `settings`, and of `app-shell`, which decision 7 changes: 10 images and the manifest. Criterion 16 checks them; criterion 17 lists `thumbnails.test.ts`. Decision 13 adds the hedge for a change to `--site-bar-room`. `018` is being revised to say four items for the error summary. R1's theme change later widened this to every item (the re-check, below).
5. **Accepted (Low).** Decision 6: `control.labels?.[0]`; focusable means `tabindex` 0 or more, or a native control; an element holding a `[tabindex="0"]` descendant is a group, whatever its own `tabindex`.
6. **Accepted (Low).** Decision 11's bullet says the title and the list moved inside the new element, and what that means for classes on the root's children. It tells an app with a sticky header to set `scroll-padding-top`. It says a link leaves the page alone when the field is in view and uncovered. It says not to pass a `role` (decision 1).
7. **Accepted (Low).** Criteria 2, 3, 5 and 6 check the control is clear, not only inside the viewport. "Lands" allows a page at its maximum scroll. Criteria 5 and 6 add the no-padding and smooth cases.

### The re-check (2026-11-15)

The design lead accepted all four remaining findings.

- **R1, accepted (Medium).** Decision 5: the theme's rule becomes a default, `@layer base { :where(html:has([data-sticky-bar])) { … } }`, so an app's own value wins in any layer or as a utility. It is a `pluto-theme` change: its sentences join the existing `pluto-theme` bullet (decision 11), and they tell the app to delete the old unlayered rule, which the CLI does not remove. Criterion 7 tests four app values winning; criterion 14a tests the emission; criterion 15 adds the `pluto-theme` amendment. The `app-shell` bullet drops the remedy that only worked unlayered.
  - **The site, revisited (decision 8).** The site bar now **keeps** `data-sticky-bar`, and `site.css` sets its 88 px in `@layer components`, which beats the layered default. That is simpler: `bar.svelte` and `navigation.spec.ts` no longer change. The first revision dropped the attribute only because the old rule could not be beaten.
  - **A knock-on, not in the finding.** `src/app.css` changes, and `018`'s manifest hashes it for every item, so every item's thumbnails are regenerated, not five (decision 11, criterion 16).
- **R2, accepted (Medium).** Decision 12 says no agent changes system settings or starts the script. The owner enables VoiceOver's AppleScript control and the terminal's accessibility permission and starts the script, or listens for one minute. Guidepup is MIT, pinned at exactly `0.40.0`.
- **R3, accepted (Low).** Risks names a cover drawn with `pointer-events: none`, which "clear" does not see.
- **R4, accepted (Low).** Criterion 18 and build step 2 run criterion 5 once against the first draft's order, on a scratch copy, to show it fails. The result goes into the Landing notes.

## Landing notes

- **Built** in the working tree over `ea1f9bd` (`018`), uncommitted, at 0.12.0.
- **Criterion 12's figures, before the change** (build step 1, EXECUTED, 1440 × 900, the same in both themes): the three specimens are 98.78, 107.59 and 109.19 px tall; each title's top is 13 px below the root's top; the first link's top is 42.59 px below it in the second specimen and 72.19 px in the third (the first has no link). `error-summary.spec.ts` criterion 12 pins them, ± 0.5 px.
- **Tests first, seen failing** (build step 2, on `ea1f9bd`'s code):
  - unit: 3 failures: criterion 14's two changelog checks and criterion 14a's emission check.
  - e2e, the new `error-summary.spec.ts` with the changed `primitives`, `keyboard` and `blocks` tests, both themes: 34 failed, 26 passed. Failing: criteria 1 (the roles), 2, 3, 4, 6, 7, 10 (the stops and the behaviour), 13, and `blocks.spec.ts` 1, 4, 28, 30 and 31, `primitives.spec.ts` E2. Passing, as they should: criterion 5 (12 tests, the regression guards), 9 (axe), 12 (the look), the raw-HTML check of criterion 1 and E1 (no live role in the specimens before either), and `blocks.spec.ts` 2 and 3.
  - Criterion 6 was also run on the old item with the test's final setup: the label ended at 352.6 px (1440) and 324.6 px (390), not 72.
  - **Criterion 5 against the first draft's order** (criterion 18, R4): on a scratch change to the item (the question scrolled to the top, then a plain `focus()`, no step 5 or 7), all 12 of criterion 5's tests failed. With the fields 1600 px down, the focused control was not clear under the 64 px bar; with the fields in view, the first link scrolled the page by 228 px where nothing should move; with Owner email's label under the bar, the input was left covered. The scratch change was then reverted; the item's diff against `ea1f9bd` was empty before the build went on.
- **The checkpoint** (criterion 18) was the design lead's, in both themes at 1440 and 390 px. It saw:
  - the summary landing just under the site bar after a failed submit (its top at 88.1 px, the bar's bottom at 88.0);
  - Owner email's link from under the bar putting its label at 88.0 px (390) and 87.9 px (1440), with the field focused;
  - the radio link focusing "Only me";
  - `/view/app-shell/sidebar/`'s header carrying `data-sticky-bar`, with the page's padding at 72 px.
  The deviations below were accepted there.
- **The screen-reader check** (criterion 19): the script is `scripts/a11y/voiceover-error-summary.ts`. It is written and not run: no agent changes the two macOS settings it needs or starts it (decision 12). The owner has not yet listened (`decisions.md`, "`019`'s VoiceOver listen waits for the owner"). The owner's log, or what the owner heard, goes here and in `decisions.md`. NVDA and JAWS are not tested.
- **`@guidepup/guidepup`** is a `devDependency` at exactly `0.40.0`, MIT (its `package.json`, READ), pinned by `bun.lock`. It ships in no item.
- **Deviations.**
  - **The icon's role.** Criterion 1's raw-HTML check and `primitives.spec.ts` E1 count roles outside aria-hidden content. Phosphor's `WarningCircle` renders `role="img"` on its `aria-hidden` `svg`, which is outside the accessibility tree; read literally, "0 elements with a role" could never hold. No live role is in any specimen.
  - **Room in the example view.** Criteria 5 and 6 inject `main { padding-bottom: 2000px }` on `/example/error-summary/keyboard/`. Without it the page cannot scroll a label under the bar or up to 72 px.
  - **Criteria 3 and 5 put the question's centre under the bar,** 20 px above the bar's bottom on the site and its top at 40 px under the 64 px bar. "Clear" samples the centre, and the site bar's last 8 px are its room, which takes no pointer.
  - **`deps.test.ts`** gains a `PACKAGES_019` block for guidepup, as `017` added one. Criterion 17 did not list it.
  - **`registry.test.ts`'s name check** reads `data-slot="error-summary-content"`, the form decision 11's bullet uses, not the bare name in backticks.
- **Thumbnails** (decision 11, criterion 16): `bun scripts/site/thumbnails.ts` rebuilt the site and wrote 150 images, 644 kB, in 166 s. Every item's hash moved (75 of 75). 146 images are byte-identical to `018`'s. Four differ in bytes and not to the eye: `pluto-theme` and `sidebar`, light and dark. A second run reproduced them exactly.
- **`static/r`**: `error-summary`, `app-shell` and `pluto-theme` are regenerated, in `static/r/` and `static/v0.12.0/r/`. `tests/fixtures/static-r-amendments.json` gains 12 entries (6 for `error-summary`, 4 for `app-shell`, 2 for `pluto-theme`), each citing the 2026-11-15 decision and this specification's decisions, and each used. `registry.json` changes only in the sticky-bar rule.
- **Found, not 019's:** `highlight-session.test.ts`'s streaming budget (013 decision 20, p95 ≤ 4 ms per chunk) is timing-sensitive under load. It failed once in the full `bun run test` (p95 above 4 ms), and on three runs alone read 2.95, 2.91 and 4.22 ms. 019 changes nothing it measures.
- **`keyboard.spec.ts`'s fixture total** moves 73 → 74 stops with the radio question. It is part of the keyboard group criterion 17 names.
- **Suites** (2026-11-15, the last runs). `bun run test` was run whole once and stopped at its unit stage on the timing flake above. Each suite was then run on its own:
  - `bun run test:unit`: 1206 pass, 0 fail, 35 files (`thumbnails.test.ts` and `registry-comments.test.ts` among them);
  - `bun run test:e2e`: 2738 passed, 11 skipped, 0 failed, axe and the keyboard walk in both themes. The perf project's 5 budgets passed. The medians the change review logged (3 runs each, under load; replacing the budgets this line first gave as figures): `/` 307 kB and LCP 884 ms; `/components/` 355 kB and 2,756 ms; `/components/button/` 380 kB and 1,032 ms; `/components/code-block/` 354 kB and 1,104 ms; `/brand/colour/` 302 kB and 872 ms; CLS 0.005 or less and no `.wasm` on each;
  - `bun run test:smoke`: 132 pass, 0 fail;
  - `bun run check`: 0 errors and 0 warnings;
  - `bun run lint`: clean;
  - the literal lint: 0 violations, 1 allowance (L24);
  - `bun scripts/site/release-check.ts`: exit 0;
  - `bun run build:tokens` twice: 0 changes the second time;
  - `static/v0.11.0/` is untouched.
- **After the change review** ([`../reviews/019-the-error-summary-pr-2026-11-15.md`](../reviews/019-the-error-summary-pr-2026-11-15.md): lands once finding 1 is settled; 1 Medium, 6 Low). Each was fixed as the design lead ruled:
  1. **The page's screen-reader line** now reads "Not yet heard with a screen reader. NVDA and JAWS are not tested.", until the owner's listen is recorded. A unit check in `registry.test.ts` fails if the page claims "Heard with VoiceOver" while `decisions.md` holds no entry naming `019` and VoiceOver whose body says the pass rule held. It was seen failing with the old line in place, then passing with the new one. When the listen is recorded, the line goes back to "Heard with VoiceOver on macOS", and the check then requires the record.
  2. **The perf figures** in "Suites" are now the review's logged medians, not the budgets. The perf project, run alone after these fixes, 3 runs each, medians: `/` 307 kB and LCP 868 ms; `/components/` 355 kB and 2,752 ms; `/components/button/` 380 kB and 1,044 ms; `/components/code-block/` 354 kB and 1,096 ms; `/brand/colour/` 302 kB and 860 ms; 5 of 5 pass.
  3. **The `error-summary` bullet** now says to delete the old theme rule first (see `pluto-theme`), then set `scroll-padding-top`, as the other two bullets do.
  4. **Button at its budget:** recorded, not changed. `/components/button/` transfers 380 kB against a 380 kB budget, with no margin. 019 adds nothing to the page, but any change before the tag that adds a byte to every component page fails it.
  5. **`015`'s disc checks** (`doors.spec.ts`, each disc at most 40% and 160 px) now wait for the page's finite animations to finish (`settled`) before measuring, so a disc is never measured mid-spring. The review saw them fail under load (158.5 against 156.5 px at 390; 166.2 against 160.5 at 768 and 1023) and pass idle. They pass in both projects after the change.
  6. **`013`'s streaming budget** (`highlight-session.test.ts`) now runs one untimed stream as a warm-up, then three timed streams, and holds the best of the three p95s to 4 ms. It stays a unit test; it was not moved to the perf project. Run alone three times afterwards: best 3.12, 2.99 and 2.93 ms, with single-stream p95s of 2.93 to 5.28 ms.
  7. **The four thumbnails' byte changes have a real input.** With the site's new scroll-padding rule (decision 8) removed, the script redrew `pluto-theme` and `sidebar`, light and dark, byte-identical to `018`'s. With the rule restored, it redrew them byte-identical to this build's. So the cause is decision 8's 88 px padding, not antialiasing or load. Most likely it shifts where the script's `scrollIntoViewIfNeeded` leaves the page, and so where a sticky element or a sub-pixel offset falls inside the stage. The output is deterministic, so the script needs no perceptual comparison; the hash already names `site.css` as an input. `error-summary`'s pair was redrawn once more, because its page's line changed (the hash reads the page), and came out byte-identical.

