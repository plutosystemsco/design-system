# 027 — Batch A: pagination, search field, button group, tag, link and progress bar

- **Status:** Ready to build after `020`: owner answers recorded, review approved with changes, all applied (2026-11-15). `027b` also waits on `022`, `025` and `026`. The review, [`../reviews/027-batch-a-spec-2026-11-15.md`](../reviews/027-batch-a-spec-2026-11-15.md), raised 22 findings (3 High, 8 Medium, 11 Low). Its re-review approved with changes R1 to R6 (1 Medium, 5 Low). Every one is answered under "Review". The owner answered Q1 to Q7 on 2026-11-15 (Landing notes). **`027a` built and committed on its build branch (2026-11-15), waiting on the design lead's checkpoint and its change review; see the Landing notes. `027b` not built.**
- **Date:** 2026-11-15
- **Author:** the spec author for `027`, for the design lead
- **Kind:** six new registry items (lane N: each item's own folder, examples and page). Some edits fall outside the lane. Each lands after the spec that owns its lane (decision 14):
  - `tests/sr/` gains three items' files and two mutations (lane E, after `022`);
  - `scripts/cost/` gains six fixtures and three interactions in `025`'s verbs (lane E, after `025`);
  - the `meter` page's "when" names `progress` (one sentence, lane S);
  - `roadmap.md` carries rows `027a` and `027b`, final since the owner chose the split (Q1, 2026-11-15). `028` depends on both, `037` and `042` on the split rows, and `027b` on `020`, `022`, `025` and `026` (the coordinator's edit).

  **Interface changes:** none. No existing item's source changes. No token is added or changed. No package is added to the repository: the items' one package, `phosphor-svelte`, is already a package of 17 `ui` items (`026` decision 1's count).
- **Written against the renamed tree.** `020` (the Kuiper rename) lands first, so every name here is the new one: the `kuiper` registry, `kuiper-theme`, the `kuiper:field` and `kuiper:tag-group` context keys, `scripts/bench/kuiper.ts`, and the guide at `/start/upgrade/0.13.0/`. Where today's tree still reads `pluto`, read this spec's `kuiper` in its place.
- **Depends on:**
  - `020`, landed.
  - `022` (the test matrix) before the screen-reader files.
  - `025` (component cost) before the cost fixtures.
  - `023` (prop doc comments) before the described-list check, if its test exists by then.

  The owner chose the split (Q1). These bind each part differently:
  - **`027a`** builds on `020` alone. Its cost fixtures wait for `025`, or move to `027b` (decision 15).
  - **`027b`** builds on `020`, and needs `022` for its screen-reader files, `025` for its cost criterion, and `026` for S4, which uses `026`'s `unspoken` rule.

  None of these blocks an item's own source and page. Ranked in [`roadmap.md`](../roadmap.md) §2, 0.13.0, rows `027a` and `027b`, wave 1, lane N.
- **Research it stands on:** [`research/2026-11-15-batch-a.md`](../research/2026-11-15-batch-a.md) (cited as *the memo*, by section, with its dated corrections of 2026-11-15). Also:
  - [the component inventory](../research/2026-11-15-component-inventory.md) §4.2 and §4.3 (the rank and the batch);
  - [the component page standard](../research/2026-11-15-component-page-standard.md) (*the standard*);
  - [`019a`](./019a-the-fonts-own-spacing-the-glass-bar-and-depth.md) decisions 1 and 3;
  - [`022`](./022-the-test-matrix.md) decisions 11 to 15;
  - [`025`](./025-component-cost.md) decisions 1 to 14;
  - [`026`](./026-toast.md), for the shape of a new item born at the standard;
  - the benchmark scorecard's rows 1, 3 and 15.

  Facts the review ran are labelled **EXECUTED (review)**.
- **Owner's rulings it carries** (2026-11-15, given with the brief and in force):
  1. Every prop gets a doc comment from birth.
  2. Transparency signifies depth. None of these items is a layer above content, so nothing in them is translucent (`019a` decision 3).
  3. Letter spacing is the font's own, 0, everywhere (`019a` decision 1). No item sets a tracking class.
  4. An item with a live region, a focus move or an overlay is checked with a screen reader, by script (constitution §4.4).

  **The owner's answers to Q1 to Q7** (2026-11-15, each the recommended option; recorded in the Landing notes):

  5. Two builds: `027a` (link, button group, progress), then `027b` (pagination, search field, tag). Decision 1, the build order, every criterion's a and b forms.
  6. No indeterminate progress bar now. A runtime `null` renders as 0. Decision 8.
  7. Visited links are opt-in, in the text colour. Decision 7.
  8. A new-tab link gets an icon, visually hidden text and a merged `rel`. Decision 7.
  9. Pagination's end controls are omitted, with the slot kept. Decision 3.
  10. The search count is built in, through `results` and `resultsFor`, for the current query only. Decision 4.
  11. After a tag is removed, focus goes to the next tag control, then the previous. Decision 6.

## Intent

Batch A is the inventory's first batch: cheap parts that every product reaches for (inventory §4.3). Kuiper has none of the six. Teams that adopt it make do:

- they hand-roll a pager;
- they put a magnifier in an `input-group`;
- they copy a badge and add an ×;
- they repeat `underline underline-offset-4` in every item.

This specification adds six items:

- **`pagination`**: a named `nav` of page links, or page buttons for a list paged in place.
- **`search-field`**: a search input with a magnifier, a clear button, Escape to clear, and an optional spoken result count for the current query.
- **`button-group`**: a named group of related buttons, joined or spaced.
- **`tag`**: a label you can remove or press, in a named list that keeps focus when a tag goes.
- **`link`**: the one inline link, always underlined, with standalone, new-tab and visited forms.
- **`progress`**: a native progress bar, the partner of `meter`.

Each is born at the page standard's shape:

- every prop described;
- every part marked with a slot;
- its keyboard and its speech written as rules a test checks;
- its don'ts live and inert.

Five of the six are parts the scorecard counts and Kuiper lacks. With `026`'s toast, row 1 moves from 30 to 35 of 40, and its score from 3 to 4 (decision 17).

**Terms of art.**

- **Link mode** and **button mode**: pagination with an `href` builder renders links; without one, buttons.
- An **end control** is pagination's Previous or Next.
- A **slot** is a `data-slot` attribute that names a part.
- **Settle**: the search field's typing has paused for `SEARCH_FIELD_SETTLE_MS` (750 ms).
- A **pending** count: the app has set `results` to `undefined` because the count for what is typed now has not arrived.
- A **tag control** is a removable tag's remove button or a pressable tag's button.
- A **removable** tag has a separate remove button. A **pressable** tag is itself a toggle button. A **static** tag is neither.
- **Attached** and **spaced**: the button group's two looks.

## What the research found

- **The native elements do the work** (memo §2, §3, §7, READ, ARIA in HTML).
  - `<progress>` is a `progressbar` that takes its value as an attribute.
  - `<input type="search">` is a `searchbox`.
  - `<a href>` is a link, and SvelteKit's router link.
- **bits-ui helps less than the inventory scored** (memo §1, EXECUTED, `bits-ui` 2.20.2).
  - Its Pagination is a `div` of buttons. It has no landmark, no `aria-current` and no link mode, and it adds arrow keys on top of Tab stops.
  - Its Progress fill needs a `style` width, which the literal lint forbids.
  - It has no Link.
- **The references agree on pagination's shape** (memo §2): a named `nav`, real links where pages have URLs, `aria-current="page"`, and Tab only. GOV.UK omits the end controls at the ends instead of disabling them. Carbon's data-table pager moves focus to the other end control when one becomes unavailable.
- **A search field's clear button is a Tab stop while shown** in Carbon and Spectrum, and focus returns to the input after it. Carbon clears on Escape only when the field holds text (memo §3).
- **Primer requires a filter's result count to be announced** through an always-present `role="status"`. The count it means is the count of results the filter returned, not the moment typing paused (memo §3, and its correction). No reference builds it in.
- **A tag's remove button must name the tag** (Primer). Carbon's "Dismiss" does not. Primer and Spectrum remove on Backspace and Delete (memo §5).
- **Buttons in a group are Tab stops** in every reference except Spectrum's note and Primer's opt-in toolbar (memo §4).
- **Every reference underlines links in text**, or holds them to 3:1 against the text. Visited styling is opt-in in Carbon and on by default in GOV.UK (memo §6).
- **No reference has a reduced-motion rule for an indeterminate bar**, and only Carbon handles forced colours (memo §7).
- **The review ran what the memo inferred** (memo, corrections):
  - the progress classes draw in all three engines;
  - Chromium and Firefox clear a search input on Escape, and WebKit does not;
  - a size-container `nav` is 0 px wide as a flex item;
  - a script cannot read a visited link's colour;
  - moving a focused node drops focus to `body`.
- **Three of the six meet `022`'s screen-reader rule**: pagination, search field and tag (memo §8).

## Decisions

### 1. Six items, fourteen files

| Item | Part (Q1) | Files under `src/lib/registry/ui/<item>/` | Lines (INFERRED) | Group |
|---|---|---|---|---|
| `link` | a | `link.svelte`, `index.ts` | about 70 | navigation |
| `button-group` | a | `button-group.svelte`, `index.ts` | about 50 | actions |
| `progress` | a | `progress.svelte`, `index.ts` | about 50 | feedback |
| `pagination` | b | `pagination.svelte`, `pagination-pages.ts` (the page range, pure), `index.ts` | about 230 | navigation |
| `search-field` | b | `search-field.svelte`, `index.ts` | about 170 | forms |
| `tag` | b | `tag-group.svelte`, `tag.svelte`, `index.ts` | about 200 | actions |

Part a is six files and about 170 lines. Part b is eight files and about 600 lines. The whole is about 770 lines.

**`registry.json` entries.** Each entry has:

- type `registry:ui`;
- `meta.since` `0.13.0`;
- `meta.modes` `["productive"]`;
- `meta.group` as above;
- no `meta.stock`, because none is derived from a shadcn-svelte stock item (decisions 3, 5, 7);
- `utils` and `kuiper-theme` among its dependencies.

The build derives `phosphor-svelte@^3.1.1` from the icon imports.

| Item | Title | Description | Further `registryDependencies` | Icons |
|---|---|---|---|---|
| `pagination` | Pagination | A named nav of page links, or page buttons for a list paged in place, with the current page marked and Previous and Next omitted at the ends. | `button`, `status` | `CaretLeft`, `CaretRight` |
| `search-field` | Search field | A search input with a magnifier, a clear button and Escape to clear, that can speak the result count for what is typed now. | `input-group`, `status` | `MagnifyingGlass`, `X` |
| `button-group` | Button group | A named group of related buttons, joined edge to edge or spaced in a row, each its own Tab stop. | `button` | — |
| `tag` | Tag | A short label you can remove or press, in a named list that moves focus to its neighbour when a tag is removed. | `button` | `X`, `Check` |
| `link` | Link | The inline link: always underlined, in the primary colour or the text's, with standalone, new-tab and visited forms. | — | `ArrowSquareOut` |
| `progress` | Progress bar | A task's progress as the native progress bar, on the muted track with a primary fill, its numbers written beside it. | — | — |

*Why these names:* each matches the scorecard's slug for its part (`scripts/bench/targets.ts` lines 209–286): `pagination`, `search-field`, `button-group`, `tag` and `link`. Each hits exactly one part (EXECUTED (review)). `progress` is shadcn-svelte's and bits-ui's name. Its part, "progress / meter", is already counted through `meter`.

### 2. Context keys, strings and composed handlers

- **One context key is set:** `kuiper:tag-group`, set by `TagGroup` and read by `Tag` (decision 6).
- **One context key is read:** `kuiper:field`, by `search-field`. It reaches the input through `input-group`'s `Input`, and it gives the clear button its `aria-controls`, as `InputGroupPassword` reads it.
- **Every built-in English word is a prop.** Each item with words takes `strings`, a partial of its exported `<Item>Strings` type, as `026`'s `ToasterStrings` does. So `052` (translatable strings) finds them in one place.
- **An app's handlers compose with the item's.** They never replace each other.
  - Where an item handles an event that `...rest` may also carry (`search-field`'s `onkeydown` and `oninput`; `pagination`'s `onclick` on a button or link), the item calls the app's handler first.
  - If the app's handler called `preventDefault()`, the item does nothing more.
  - Where an item sets an attribute an app may also pass (`link`'s `rel`), the two are merged as token lists, without duplicates.

### 3. `pagination`

**Anatomy.**

| # | Part | Slot | Required | What it is |
|---|---|---|---|---|
| 1 | Root | `pagination` | yes | A `nav`, named by `strings.label`, "Pagination". It is `w-full min-w-0` and a size container (`@container`). Its row is `flex items-center gap-2`. |
| 2 | Previous slot | `pagination-previous` | yes | A `div` that keeps the Previous control's width on every page (below). |
| 3 | Previous | `pagination-previous-control` | not on page 1 | A link (with `rel="prev"`) or a button. It holds the `CaretLeft` icon (`aria-hidden`), the word "Previous" and a visually hidden " page". |
| 4 | Pages | `pagination-list` | yes | A `ul`, `flex gap-1`. Hidden below the switch width (below). |
| 5 | Page | `pagination-page` | yes | An `li` holding a link or button. A visually hidden "Page " comes before the visible number. The current page has `aria-current="page"`. |
| 6 | Ellipsis | `pagination-ellipsis` | where pages are skipped | An `li`, `aria-hidden="true"`, holding "…". |
| 7 | Page of pages | `pagination-summary` | yes | Plain text, "Page 5 of 12". Shown only below the switch width. |
| 8 | Next slot, Next | `pagination-next`, `pagination-next-control` | as 2 and 3 | The word "Next", a hidden " page", the `CaretRight` icon, and `rel="next"` on a link. |
| 9 | Status | `pagination-status` | button mode | A `Status`, visually hidden, rendered from the first render in button mode. |

**Props.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `page` | `number`, bindable | `1` | The current page, counted from 1. Clamped to 1 to `pages`. In button mode the item sets it when a page is pressed; in link mode your route sets it. |
| `pages` | `number` | required | How many pages there are. With 1 or fewer, nothing renders. |
| `href` | `(page: number) => string` | — | Link mode: the URL of each page. With it, every page and end control is a link. Without it, they are buttons. Choose links whenever a page has a URL. |
| `onpagechange` | `(page: number) => void` | — | Called after a page or end button is pressed, with the new page. Button mode only. |
| `siblings` | `0 \| 1 \| 2` | `1` | Pages shown either side of the current one. The first and last page always show. |
| `size` | `"default" \| "sm"` | `"default"` | Pages 48 px tall, or 32 px for a dense table. Both meet the 24 px target. |
| `strings` | `Partial<PaginationStrings>` | English | Every word it says or shows: `label` "Pagination", `previous` "Previous", `next` "Next", `page` "Page", `endSuffix` " page", `summary` `(page, pages) => "Page 5 of 12"`. |
| `class` | `string` | — | Classes for the `nav`. In a row beside other content, give it the remaining width, such as `flex-1`. |
| `ref` | `HTMLElement \| null`, bindable | `null` | The `nav`. |

`index.ts` exports `Pagination`, `paginationPages`, and the types `PaginationStrings` and `PaginationItem`.

**The page range** (`pagination-pages.ts`, pure). `paginationPages(page, pages, siblings)` returns a list of `{ type: "page", page }` and `{ type: "ellipsis", key }`.

- With `pages` at or below `2 × siblings + 5`, every page shows.
- Above that, the list always holds exactly `2 × siblings + 5` slots, so the row's width does not change as the page moves. With `siblings` 1 and 12 pages:
  - page 1 gives `1 2 3 4 5 … 12`;
  - page 5 gives `1 … 4 5 6 … 12`;
  - page 12 gives `1 … 8 9 10 11 12`.
- An ellipsis never stands for one page: that page is shown instead.
- Written for Kuiper. bits-ui's `getPageItems` (credited there to Melt UI) was studied, not copied. It keeps no fixed slot count (READ (review): 6, 7 and 6 items for pages 1, 5 and 12 of 12).

**Links or buttons.** Both render through `button`'s `buttonVariants`, so a page looks the same either way.

- A page is `variant: "ghost"`. The current page is `variant: "secondary"` with `font-bold`, so its state is a border and a weight, not a colour.
- A page takes `size: "default"` or `"sm"` for its height, with `min-w-12 px-2` or `min-w-8 px-2`. So a page is square at one or two digits and still fits "1000".
- The end controls take `size: "default"` or `"sm"`.
- Numbers are `tabular-nums`.

**The ends.** There is no Previous on page 1 and no Next on the last page (GOV.UK, memo §2; the owner, Q5). A disabled end control is not served: there is nothing to do there. The slot keeps its width: on page 1 it holds the Previous control rendered `invisible` and `inert`. That control is hidden from sight, from the Tab order and from the accessibility tree. So the slot is as wide as the translated word, whatever `strings` says.

**Focus.** This applies in button mode. In link mode the route changes, and the app's navigation sets focus.

- **The guard.** When a press begins (`pointerdown`, or `keydown` of Enter or Space), the item notes whether focus is inside the `nav`. The two rules below act only when it was. WebKit never focuses a button on click, as macOS does not (EXECUTED (re-review), 11 of 11 clicks). So a WebKit click leaves focus where it was, as every other button there does.
- **A pressed page keeps focus.** The `each` is keyed by page number, and the current page always shows. But a keyed `each` may move the pressed node when the range changes, and moving a focused node drops focus to `body` in every engine (EXECUTED (review)). So after `tick()`, if focus is no longer on the control for the page pressed, the item focuses that control by its page number. The re-review saw Svelte 5.57.3 keep the pressed node focused across 11 range changes by Enter, so this is a guard (EXECUTED (re-review)).
- **An end control that vanishes moves focus,** when focus was inside the `nav`. This happens when Next lands on the last page, or Previous on the first. Focus moves:
  - to the new current page's button, while the page list shows;
  - to the remaining end control, while the list is hidden (narrow). Carbon's data-table pager does this, studied, not copied (memo §2).

  With 2 or more pages, the other end control always exists. These are the item's focus moves.

**What it says.** In button mode, one frame after `page` changes, the status reads `strings.summary(page, pages)`: "Page 6 of 12". Focus stays on the pressed control, so without the status a screen-reader user hears nothing of the change. Carbon's PaginationNav does the same (memo §2). In link mode there is no status. The new page's title says it, and putting the page number in the title is the app's part (decision 12).

**Width and the switch.** The `nav` is a size container, so it must have a width of its own. Inline-size containment makes a flex item 0 px wide (EXECUTED (review), all three engines). So:

- the `nav` is `w-full min-w-0`;
- in a row beside other content, such as a table footer's "Showing 1–10 of 120", the app gives it the remaining width (`flex-1`). "Your part" says so, and the `in-a-footer` example shows it.

Below a switch width, the list is `hidden` and the summary shows. At the switch width and up, it is the reverse. The end controls always show, and the hidden copy is `display: none`, so nothing is heard twice. The switch width is set by size and siblings, at the width the full row needs in English. The row rests on two gaps, which the table assumes: `gap-2` across the row (the previous slot, the list or summary, and the next slot) and `gap-1` between pages in the list. The re-review measured the widest row over pages 1 to 12 of 12, in Geist, the same within 2 px in all three engines (EXECUTED (re-review)):

| `size` | `siblings` | Slots | The row needs | The list shows from |
|---|---|---|---|---|
| default | 0 | 5 | 488 px | `@xl` (36 rem, 576 px) |
| default | 1 | 7 | 592 px | `@2xl` (42 rem, 672 px) |
| default | 2 | 9 | 696 px | `@3xl` (48 rem, 768 px) |
| sm | 0 | 5 | 384 px | `@md` (28 rem, 448 px) |
| sm | 1 | 7 | 456 px | `@lg` (32 rem, 512 px) |
| sm | 2 | 9 | 528 px | `@xl` (36 rem, 576 px) |

Every switch clears its row by 48 to 88 px. The narrow row ("Page 12 of 12" between the end controls) is 267 px at the default size and 238 px at `sm`, under 320.

The classes are static strings in a `tv` map, so Tailwind sees them. Test 20a holds the table: no overflow at any container width from 320 to 1440 px. A width that fails moves one step, ruled in the landing notes. Longer translated words may need a wider step; the page tells an app that replaces `strings` to check its row.

**With one page**, nothing renders, not even the `nav` (Primer, memo §2).

**Not bits-ui** (memo §2). Its root, its missing `aria-current`, its button-only pages and its arrow keys would each need overriding.

### 4. `search-field`

**Anatomy.**

| # | Part | Slot | Required | What it is |
|---|---|---|---|---|
| 1 | Group | `input-group`, with `data-search-field` | yes | `input-group`'s root: one border, one focus ring. |
| 2 | Icon | `search-field-icon` | yes | `MagnifyingGlass` in an `inline-start` addon, `aria-hidden`. Clicking it focuses the input, as every addon does. |
| 3 | Input | `input-group-control` | yes | `<input type="search">`, role `searchbox`. WebKit's own cancel button and decoration are hidden by class (`[&::-webkit-search-cancel-button]:appearance-none`, `[&::-webkit-search-decoration]:appearance-none`). |
| 4 | Clear | `search-field-clear` | while the field holds text and is editable | `input-group`'s button: `variant="ghost"`, `size="icon-sm"` (32 px), the `X` icon. It is named `strings.clear`, "Clear search", and its `aria-controls` is the input's id. |
| 5 | Status | `search-field-status` | always | A `Status`, visually hidden, rendered from the first render. |

**Props.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `value` | `string`, bindable | `""` | What is typed. Clear and Escape set it to `""`. |
| `results` | `string \| undefined` | — | The result count for what is typed now, such as "12 results" or "No results". The field speaks it once typing has paused and the count is a string, whichever comes later. `undefined` means the count is on its way: while a server answers a new query, set it to `undefined`, or the field will speak the old count at the pause. Leave it unset to say nothing. |
| `resultsFor` | `string` | — | The query that `results` answers. When given, a count is spoken only while `resultsFor` equals `value`. Use it when results come from a server, so a late answer to an older query is never spoken. |
| `onclear` | `() => void` | — | Called after Clear or Escape empties the field, once `value` is `""`. |
| `strings` | `Partial<SearchFieldStrings>` | English | `clear`, "Clear search": the clear button's name. |
| `class` | `string` | — | Classes for the group. |
| `ref` | `HTMLInputElement \| null`, bindable | `null` | The input. |
| …rest | the input's attributes, except `type` | — | `id`, `name`, `placeholder`, `aria-label`, `autocomplete`, `oninput`, `onkeydown`, `disabled`, `readonly` and the rest reach the input. Your `oninput` and `onkeydown` run first, beside the field's own. Name the field with a `Label for`, a `Field`, or `aria-label`; never by its placeholder. |

`index.ts` exports `SearchField`, `SEARCH_FIELD_SETTLE_MS` (750) and the type `SearchFieldStrings`.

**Clear.** It shows only while `value` is not empty and the input is neither `disabled` nor `readonly`. While shown it is a Tab stop (Carbon, Spectrum, memo §3). Pressing it does four things, in order:

1. it sets the input element's own `value` to `""`, so the DOM and `bind:value` agree before any event (otherwise `bind:value` could read the old text back);
2. it sets `value` to `""`;
3. it dispatches a bubbling `input` event on the input, so an app's `oninput` hears the change, and calls `onclear`;
4. it moves focus to the input.

**Escape.** The handler is the input's `onkeydown`. It runs after the app's own `onkeydown`, and only if that did not call `preventDefault()`.

| The field | Escape does | Then |
|---|---|---|
| holds text, is editable, and no composition is open | what Clear does, without moving focus | `preventDefault()` and `stopPropagation()` |
| empty, `disabled` or `readonly`, or composing (`event.isComposing \|\| event.keyCode === 229`) | nothing | the event goes on: a dialog around it closes, and an input method cancels its composition |

- **Why `stopPropagation()` keeps a dialog open.** Svelte delegates `keydown`. bits-ui's escape layer listens on `document` through Svelte's `on()`, whose wrapper runs delegated handlers first and then skips its own handler once `event.cancelBubble` is set. bits-ui has no other Escape handler (READ (review), `svelte` 5.57.3 `events.js`; `bits-ui` `dist/`). So the handler must stay a plain `onkeydown`. A builder must not move it to a capture listener.
- **Why `keyCode === 229` too.** Safari may fire `compositionend` before the `keydown` that ends a composition, so that `keydown` carries `isComposing: false` with `keyCode` 229. That is the known behaviour for Enter, INFERRED for Escape. Playwright cannot drive a real input method, so it is not run. The guard costs nothing.
- **Why the handler clears the field itself.** Chromium and Firefox clear a search input on Escape. WebKit, as Playwright runs it, does not. `preventDefault()` stops the native clear in all three (EXECUTED (review)). So the handler prevents the native clear and clears the field itself, and all three agree.

**Speaking the count** (the owner, Q6). The count must belong to what is typed now (Primer's rule is about results returned, memo §3).

- Each `input` restarts a 750 ms timer.
- **Without `resultsFor`, only `undefined` means pending.** The field speaks at the later of two moments: the timer firing, and `results` becoming a string. It does not ask whether the app set the string after the last `input`. It could not know: a count derived from `value` that comes out the same string is no change, and Svelte re-runs no effect for it (EXECUTED (re-review), a `$derived` probe in Svelte 5.57.3). So for client-side filtering, where `results` is derived from `value`, the count is spoken at every pause, changed or not. For a server, the app sets `results` to `undefined` as the query changes, and the string when the answer comes.
- **With `resultsFor`, equality decides.** The field speaks at the later of the timer and a `results` string whose `resultsFor` equals `value`. A late answer to an older query never matches, so it is never spoken.
- To speak, the status is set to `""`, then, one frame later, to `results`. So a count is spoken once per pause, even when it has not changed: `status`'s note says one text written twice is not spoken twice, and the empty frame between is the fix it names.
- A count whose `resultsFor` differs from `value` is never written. Without `resultsFor`, staleness is the app's to signal, by `undefined`.
- Clearing the field cancels the timer, and nothing is written.
- *Why 750 ms:* long enough that a word typed at speed is one pause, short enough to answer a pause to read (INFERRED). The checkpoint and the screen-reader run tune it, as `026`'s holds are tuned.

**Disabled and read-only.** Clear is not shown, and Escape passes on. A disabled field keeps `input`'s own `disabled:opacity-50` and the addon's `opacity-50` under a disabled group. That is the existing items' rule, not this item's, and `031b` audits it (decision 13).

**No landmark of its own.** A site search is wrapped by the app in `<search>`; a filter over a list is not (memo §3). The page shows both, and one don't (decision 12).

**Enter** is native: it submits the field's form, if it has one.

### 5. `button-group`

**Anatomy:** one part, `button-group`, a `div` with `role="group"`, `data-orientation` and `data-variant`. Its direct children are buttons: `Button`s, or a `DropdownMenu.Trigger` drawn with `buttonVariants`.

**Props.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `variant` | `"attached" \| "spaced"` | `"attached"` | Attached joins the buttons edge to edge, for a few related actions of equal weight; give it secondary buttons. Spaced sets them in a row with a gap that wraps, and stacks them below 640 px, for a form's actions. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | The direction the buttons run. |
| `aria-label` | `string` | — | What the buttons are for, such as "Text alignment". Or name the group with `aria-labelledby`. Without a name, the grouping is only visual. |
| `class` | `string` | — | Classes for the group. |
| `ref` | `HTMLDivElement \| null`, bindable | `null` | The group. |

**Attached.** The group styles its **direct children** (`*:` variants), whatever their slot. So a `DropdownMenu.Trigger` (`data-slot="dropdown-menu-trigger"`) is joined like a `Button`.

- Every child but the first loses its start border (`*:not-first:border-s-0`, or `border-t-0` when vertical).
- Every child loses its inner corners (`rounded-s-none`, `rounded-e-none`, as its place requires).
- So neighbours share one solid `border-input` edge.
- A child with keyboard focus is `relative z-10`, so its ring is never covered.
- *A known limit, kept:* a hovered later button shows `hover:border-foreground` on three sides, because its start edge is its neighbour's border. Drawing all four would need a −1 px overlap (`-ms-px`). That is a margin off the spacing ladder (`001` decision 10), so the three-sided hover stands. The checkpoint looks at it.

**Spaced.** `flex flex-wrap gap-2`. Below `sm`, `flex-col`, with each button full width.

**Tab to each button.** There is no roving focus: that is a toolbar's, and the toolbar is `042` (memo §4).

**What it holds.**

- Secondary buttons, when attached.
- Icon buttons with names.
- A `DropdownMenu.Trigger` as the group's last button, for "more".
- At most one primary, and only when spaced, first in the reading order.
- Not toggles: a choice of state is a `toggle-group`.
- Not inputs: an input with buttons is an `input-group`.

**No context.** The group styles its children by selector, so `button` does not change (lane I is `023`'s).

### 6. `tag`

**Anatomy.**

| # | Part | Slot | Required | What it is |
|---|---|---|---|---|
| 1 | Group | `tag-group` | for removable tags | A `ul` with an explicit `role="list"`, because WebKit drops list semantics from an unstyled list outside a `nav`. Named by `aria-label` or `aria-labelledby`. `tabindex="-1"`, so it can take focus when it empties. It wraps. |
| 2 | Tag | `tag` | yes | An `li` in a group, a `span` alone. `data-kind` is `removable`, `pressable` or `static`. |
| 3 | Icon | `tag-icon` | no | The app's leading icon, `aria-hidden`. |
| 4 | Label | `tag-label` | yes | The tag's text. |
| 5 | Remove | `tag-remove` | removable | Kuiper's `Button`: `variant="ghost"`, 24 px (`size-6`), the `X` icon. Named `strings.remove(label)`, "Remove Design". Carries `data-tag-control`. |
| 6 | Check | `tag-check` | pressable, while pressed | `Check`, `aria-hidden`: the pressed state as a shape. |

A **pressable** tag is one `<button type="button" aria-pressed data-tag-control>` holding parts 3, 4 and 6.

**Props of `TagGroup`.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `aria-label` | `string` | — | What the tags are, such as "Filters". Or use `aria-labelledby`. Required: a list of tags needs a name. |
| `fallback` | `() => HTMLElement \| null` | — | Where focus goes when no tag control is left, such as the input that adds tags. Without it, the list itself takes focus, and its name is spoken. |
| `class` | `string` | — | Classes for the list. |
| `ref` | `HTMLUListElement \| null`, bindable | `null` | The list. |

**Props of `Tag`.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `label` | `string` | required | The tag's text: three words or fewer. It also names the remove button. |
| `onremove` | `() => void` | — | Makes the tag removable. Called when its remove button is pressed, or when Delete or Backspace is pressed on it. Remove the tag from your list in this call; the group moves focus. Not with `pressed`. |
| `pressed` | `boolean`, bindable | — | Makes the tag pressable: a toggle button, `aria-pressed`, with a check while pressed. Not with `onremove`. |
| `onpressedchange` | `(pressed: boolean) => void` | — | Called after a pressable tag is pressed, with its new state. |
| `icon` | `Snippet` | — | A leading icon. It is hidden from assistive technology; the label says what the tag is. |
| `strings` | `Partial<TagStrings>` | English | `remove`, `(label) => "Remove " + label`: the remove button's name. |
| `class` | `string` | — | Classes for the tag. |

The types make `onremove` and `pressed` exclusive. With neither, a tag is static: text in a tag's shape, such as a filter the person cannot remove. A static label elsewhere is a `badge`.

A group may mix the three kinds. A filter row can hold a fixed static tag beside removable ones.

`index.ts` exports `TagGroup`, `Tag` and the type `TagStrings`.

**Focus after a removal: one index space.** The tag does not remove itself; the app does, from `onremove`.

- Before calling `onremove`, `Tag` tells the group, through `kuiper:tag-group`, the index of its control among the group's tag controls (`[data-tag-control]`, in DOM order) at that moment.
- Static tags have no control and hold no index, so a mix of kinds never confuses the count.
- After the DOM updates (`tick()`), the group re-reads the controls and focuses, in order:
  1. the control now at that index (the next tag that can be acted on);
  2. else the control at the index before it (the previous one);
  3. else `fallback()`'s element, if it returns one;
  4. else the list.
- Next before previous keeps the reading order going (memo §5; the owner, Q7). Primer chooses previous.
- A removable tag outside a group has no neighbours. Its page says to put removable tags in a `TagGroup`.

Example: removable A, static B, removable C. Remove C: its control index is 1 (A is 0). No control is at 1, so the control at 0, A's remove button, takes focus.

**Keys.**

- Tab reaches each tag control. Enter and Space press it.
- On a remove button, Delete and Backspace also remove (Primer, Spectrum).
- No arrow keys. Those belong to batch B's multi-select, whose field holds the tags (`037`).

**The look.**

- A tag is `inline-flex h-8 items-center gap-1 rounded border border-input bg-card px-2 text-sm text-foreground`. A removable tag's end padding shrinks to fit the 24 px button.
- A pressed tag is `border-primary bg-primary text-primary-foreground`, with the check. A hovered pressable tag is `bg-accent`.
- Labels do not truncate.
- No mono type: a tag is something to act on, not a label to read like `badge`.
- The border is `border-input`, never `border-border`'s translucent hairline (ruling 2).

### 7. `link`

**Anatomy:** one part, `link`, an `<a href>`. For a new tab, two parts follow the text: an `ArrowSquareOut` icon (`link-icon`, `aria-hidden`) and a visually hidden `strings.newTab` (`link-new-tab`).

**Props.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `href` | `string` | required | Where it goes. A link always goes somewhere; for an action, use `Button`. |
| `variant` | `"default" \| "inherit"` | `"default"` | The primary colour, or the surrounding text's, for a link inside muted text or a footer. Both are underlined. |
| `standalone` | `boolean` | `false` | A link alone on its line, such as in a list: it gets a 24 px tall target. A link inside a sentence does not need one. |
| `newTab` | `boolean` | `false` | Opens in a new tab, with `rel="noopener noreferrer"`, an icon, and "(opens in a new tab)" for screen readers. Use it rarely: it takes the Back button away. |
| `visited` | `boolean` | `false` | Shows visited links in the text colour, for long lists of documents a person works through. |
| `rel` | `string` | — | Link types of your own, such as `"external"`. With `newTab`, `noopener noreferrer` is merged in. |
| `strings` | `Partial<LinkStrings>` | English | `newTab`, " (opens in a new tab)". |
| `class` | `string` | — | Classes for the link. |
| `ref` | `HTMLAnchorElement \| null`, bindable | `null` | The link. |
| …rest | the anchor's attributes, except `target` while `newTab` | — | `data-sveltekit-*`, `download`, `aria-current` and the rest reach the `<a>`. |

`index.ts` exports `Link`, `linkVariants` and the type `LinkStrings`. `linkVariants` lets prose rendered from Markdown take the same classes on a plain `<a>`.

**The look.**

- `underline underline-offset-4`, always. Hover adds `decoration-2`, a thicker line (GOV.UK, memo §6).
  - `decoration-2` is Tailwind's 2 px step. Like `underline-offset-4`, which `button`'s `link` variant already uses, it is a size the literal lint does not judge. The precedent is recorded here; `050` (the lint reads classes) may rule on both.
- `default` is `text-primary`; `inherit` is `text-current`.
- `standalone` adds `inline-flex min-h-6 items-center`, as `error-summary` and the footers do today.
- `visited` adds `visited:text-foreground` (the owner, Q3). `:visited` allows only colour, which is all it needs.
- Focus is the theme's global `:focus-visible` outline.
- No new token.

**A new tab** is served opt-in, with the icon, the hidden words and a merged `rel` (the owner, Q4).

**No disabled link.** A link that goes nowhere is text (memo §6).

**The ten items' own link classes stay.** Moving them onto `linkVariants` is an edit to existing items, lane I. It is offered to the roadmap as a small change after `023` and this spec, not done here.

### 8. `progress`

**Anatomy:** one part, `progress`, a native `<progress value max>`. Its track and fill are its pseudo-elements.

**Props.**

| Prop | Type | Default | Doc comment |
|---|---|---|---|
| `value` | `number` | required | How much is done, from 0 to `max`. Clamped to that range. `null` or `undefined` from untyped code renders as 0: this bar has no indeterminate form. |
| `max` | `number` | `100` | How much there is to do. |
| `valuetext` | `string` | — | What a reader hears instead of a percentage, such as "3 of 12 files". |
| `variant` | `"default" \| "destructive"` | `"default"` | Destructive when the task stopped on an error. Say so in words beside it; the colour is not the only sign. |
| `class` | `string` | — | Classes for the bar. |
| `ref` | `HTMLProgressElement \| null`, bindable | `null` | The bar. |

The app names it, as it names `meter`: with a `Label for` (a `<progress>` is labelable) or an `aria-label`. `valuetext` becomes `aria-valuetext`. No `aria-valuemax` is set: ARIA in HTML says not to on `<progress>` (memo §7). The item renders `value={clamp(value ?? 0, 0, max)}`, so a `<progress>` without a value, which every engine draws as indeterminate, never appears.

**The look** is `meter`'s: `block h-2 w-full rounded-none appearance-none`, the track `muted`, the fill `primary`, or `destructive` for that variant. It is drawn by the item's own classes, as arbitrary pseudo-element variants:

- `[&::-webkit-progress-bar]:bg-muted`;
- `[&::-webkit-progress-value]:bg-primary`;
- `[&::-moz-progress-bar]:bg-primary`;
- `bg-muted` on the element, for Firefox's track.

*Why not the theme, as `meter`'s rules are:* `004` decision 5 said pseudo-elements cannot be classes. An arbitrary variant is a class, and the lint judges only its utility. A theme edit is lane T, where `021` runs in wave 1 with "built CSS byte-identical" as its criterion.

The review compiled these classes with the pinned Tailwind and Lightning CSS and drew them (EXECUTED (review)):

- the lint reported 0 violations;
- each vendor rule stays its own rule;
- the 10% pixel is `--primary`'s colour and the 90% pixel `--muted`'s, in Chromium, Firefox and WebKit.

Test 48 keeps that proof. The theme fallback stays written only in case a later engine stops drawing them: the rules would move to the theme in a small change in lane T after `021`.

**No indeterminate form** (the owner, Q2). It needs a keyframe outside the lint's three animations, a theme edit and a reduced-motion rule. `spinner` serves an unknown wait today, and `039` (motion tokens) can add it.

**No animation of the fill.** It moves to the new value at once. `039` may ease it.

**Forced colours.** `forced-color-adjust-none`. Without it, Chromium paints the bar white at both ends, so it vanishes, and Firefox repaints it. With it, the bar keeps its colours (EXECUTED (review)). Playwright does not emulate forced colours in WebKit, so the check runs in Chromium and Firefox (test 48). `028` replaces this with system colours when it adds the lint's system-colour allowance.

**Silent by design.** A progress bar is not a live region. The app announces the start, the milestones it chooses and the end through `status`, and the page shows how (decision 12). So `progress` is not in `022`'s set (decision 11).

### 9. Keyboard

The keyboard table for each interactive item. Each row is a test in `tests/e2e/keyboard.spec.ts` (test 53), and the data `032`'s driver will read.

| Item | Key | Where focus is | What happens |
|---|---|---|---|
| pagination | Tab | before it | Previous (if shown), then each page in order, then Next (if shown). The ellipsis, the summary and an empty end slot are not stops |
| pagination | Enter | a page or end link | Follows it |
| pagination | Enter, Space | a page or end button | Shows that page. Focus stays on it; if the control vanished, focus moves to the current page, or, when narrow, to the remaining end control |
| pagination | Arrow keys | any control | Nothing |
| search-field | Tab | the input, with text | The clear button |
| search-field | Escape | the input, with text, editable, not composing | Empties it; focus stays; the event stops |
| search-field | Escape | the input, empty, disabled, read-only or composing (`isComposing`, or `keyCode` 229) | Nothing; the event goes on |
| search-field | Enter, Space | Clear | Empties the field; focus moves to the input |
| button-group | Tab | before it | Each button in order |
| button-group | Arrow keys | a button | Nothing |
| tag | Tab | before a group | Each tag control, in order. Static tags are not stops |
| tag | Enter, Space, Delete, Backspace | a remove button | The tag is removed. Focus moves to the next tag control, the previous one, the fallback, or the list |
| tag | Enter, Space | a pressable tag | It toggles, and `aria-pressed` follows |
| link | Enter | the link | Follows it |

`progress` has no keyboard behaviour.

### 10. Screen-reader behaviour

What each reader should say. This is INFERRED. `022`'s rules match phrases, never whole logs, and the run confirms or corrects the wording.

| Moment | VoiceOver (WebKit, Chromium) | NVDA (Chromium, Firefox) |
|---|---|---|
| Tab to page 5 of 12, current | "Page 5, current page, link" | "Page 5, current page, link" |
| Next pressed, button mode | "Page 6 of 12" | "Page 6 of 12" |
| Next onto the last page, button mode | "Page 12, current page, button" | "Page 12, current page, button" |
| The same, narrow | "Previous page, button" | "Previous page, button" |
| Typing "des", a pause, the count arrives | "3 results" | "3 results" |
| Tab to Clear | "Clear search, button" | "Clear search, button" |
| Clear pressed | "Search projects, search text field" | "Search projects, edit, search" |
| Tab into a named button group | "Text alignment, group", then "Left, button" | "Text alignment, grouping, Left, button" |
| Tab to a remove button | "Remove Design, button" | "Remove Design, button" |
| Design removed | "Remove Research, button" | "Remove Research, button" |
| The last tag removed, no fallback | "Filters, list, 0 items" | "Filters, list" |
| Tab to a pressable tag | "Archived, toggle button, not pressed" | "Archived, toggle button, not pressed" |
| A new-tab link | "Pricing (opens in a new tab), link" | "link, Pricing (opens in a new tab)" |
| A progress bar | "Upload, 3 of 12 files, progress indicator" | "Upload, progress bar, 3 of 12 files" |

Never spoken: the ellipsis; the icons; "Page 6 of 12" in link mode; a count on every keystroke; a count for an older query.

### 11. Which items join `022`'s screen-reader set, and why

`022` decision 11's signals, read against each item as designed (memo §8):

| Item | Signal | Kinds | In `SR_ITEMS` |
|---|---|---|---|
| `pagination` | a `Status` import; `.focus(` when an end control vanishes, or a pressed page lost focus | `live`, `focus` | yes |
| `search-field` | a `Status` import; `.focus(` after Clear | `live`, `focus` | yes |
| `tag` | `.focus(` after a removal; the list's `tabindex="-1"` | `focus` | yes |
| `link` | none | — | no, and no signal makes it a candidate |
| `button-group` | none | — | no |
| `progress` | none: not a live region, by design | — | no |

`sr-items.test.ts` would demand the first three anyway. With `026`, the set goes from 29 to 32.

**The tests, in `tests/sr/`.** There is one file per item, and each test carries `022`'s annotations `item`, `rules` and `hears`. Each part names an element the item renders (`022` decision 12):

- `pagination:status`, the status;
- `pagination:pages`, the `nav`'s controls;
- `search-field:status`, the status;
- `search-field:input`, the input;
- `tag:group`, the list and its controls.

| Test | Page | Action | Rules | `hears` |
|---|---|---|---|---|
| P1 a page is said | `/example/pagination/buttons/` | Activate Next on page 5 | L1 "Page 6 of 12"; L2 not before; L3 | `pagination:status` |
| P2 the end | `/example/pagination/buttons/` | Go to page 11; activate Next | F1 "Page 12" | `pagination:pages` |
| P3 the end, narrow | `/example/pagination/narrow/` | Go to page 11; activate Next | F1 "Previous page" | `pagination:pages` |
| S1 the count | `/example/search-field/filter/` | Type "des"; wait 1.5 s | L1 "3 results"; L2; L3 | `search-field:status` |
| S2 the count again | `/example/search-field/filter/` | Type "des", wait; type "i", wait | L1 "3 results" in the second after window | `search-field:status` |
| S3 Clear | `/example/search-field/filter/` | Type "des"; activate Clear | F1 "Search projects" | `search-field:input` |
| S4 the late count | `/example/search-field/server/` | Type "des"; wait 2 s (the answer comes 400 ms after the pause) | L1 "3 results"; `unspoken` "12 results" (`026`'s rule) | `search-field:status` |
| T1 the next | `/example/tag/removable/` | Activate "Remove Design" (the first of three) | F1 "Remove Research" | `tag:group` |
| T2 the previous | `/example/tag/removable/` | Activate the last tag's remove | F1 the new last tag's "Remove …" | `tag:group` |
| T3 the list | `/example/tag/removable/` | Remove all three | F1 "Filters" | `tag:group` |

**Two mutations join `022`'s `main` set.** Each is in a file no other patch touches.

| Patch | File | Target | What breaks | Fault | Witness |
|---|---|---|---|---|---|
| `pagination-status` | `src/lib/registry/ui/pagination/pagination.svelte` | `pagination:status` | the summary is never written to the status | L1 | P1 |
| `tag-focus` | `src/lib/registry/ui/tag/tag-group.svelte` | `tag:group` | the group no longer moves focus after a removal | F1 | T1 |

`022`'s derivation then expects these failures, under both readers and all four browser pairings:

- for `pagination-status`, exactly P1;
- for `tag-focus`, T1, T2 and T3.

S4's `unspoken` rule is `026`'s, so S4 runs once `026`'s rule is in `rules.ts`. `expected.json` is derived, never hand-written (`022` decision 15).

### 12. The pages and their examples

There are six pages under `/components/<item>/`, from the standard's sections as today's template has them. Each has `when`, `dos`, `donts` and `accessibility` snippets written by the design lead.

Until `032` builds pictured pairs, each pair file renders inside its `dos` or `donts` item with its caption, as `026` decision 22 does. Every pair file has `meta.kind`, `meta.pair` and a caption of 20 words or fewer. A don't also has `meta.breaks`, and renders inside `inert`.

**`pagination`.**

- When: a long list or table split into pages a person moves between.
- When not: a form's steps (use the form's Continue); a feed a person reads to the end (load more in place).
- Examples (`EXAMPLE_ORDER.pagination`):
  - `links`: link mode, page 5 of 12. The stage and the thumbnail.
  - `buttons`: button mode under a table of rows, with its status.
  - `in-a-footer`: "Showing 41–50 of 120" at the start and the pager at the end of a `justify-between` row, the pager `flex-1`.
  - `ends`: pages 1 and 12.
  - `narrow`: button mode in a 320 px card, showing the summary.
  - `small`: `size="sm"` under a dense table.
- Pairs:
  - `urls`. Do: link mode, a URL per page. Don't: buttons for pages that have URLs; `breaks` "No page to share, bookmark or open in a new tab."
  - `steps`. Do: pagination under search results. Don't: pagination for a form's three steps; `breaks` "A form's steps are not pages to jump between. Use Continue."

**`search-field`.**

- When: filtering a list, or the site's search.
- When not: choosing one of a known set as you type (`037`'s combobox).
- Examples:
  - `filter`: filters a list of projects, with `results` derived from `value`. The stage.
  - `server`: results that arrive 400 ms after the pause, with `results` `undefined` meanwhile and `resultsFor` set.
  - `site`: inside `<search>`, with a submit button.
  - `in-a-field`: in a `Field` with a description.
  - `in-a-dialog`: Escape clears, then closes.
  - `disabled`: one disabled field and one read-only field holding text.
- Pairs:
  - `label`. Do: a visible label. Don't: the placeholder alone; `breaks` axe `label`.
  - `landmark`. Do: one `<search>` around the site search. Don't: every filter box in its own `<search>`; `breaks` "Five search landmarks: none says which searches the site."

**`button-group`.**

- When: two or three related actions of equal weight; a form's actions.
- When not: a choice of state (`toggle-group`); more than three actions (a menu, or `042`'s toolbar).
- Examples:
  - `attached`: three secondary buttons. The stage.
  - `with-menu`: two buttons and a "More" menu trigger.
  - `vertical`.
  - `spaced`: Save first, then Cancel.
- Pairs:
  - `weight`. Do: one primary, spaced. Don't: two primaries attached; `breaks` "Two equal next steps, joined: no divider, and no clear choice."
  - `state`. Do: a toggle group for bold, italic and underline. Don't: the same in a button group; `breaks` "It says nothing is pressed. Use a toggle group."

**`tag`.**

- When: filters a person applied and can remove; options a person turns on and off.
- When not: a status to read (`badge`); a link to somewhere (`link`).
- Examples:
  - `removable`: three filters in a group named "Filters". The stage.
  - `pressable`: four filters to press.
  - `mixed`: a static "Owner: me" beside two removable filters.
  - `fallback`: tags with the input that adds them; the input takes focus when the last goes.
  - `static`.
- Pairs:
  - `name`. Do: the item's remove button. Don't: a badge with a bare × button; `breaks` axe `button-name`.
  - `role`. Do: a filter tag. Don't: a tag that navigates; `breaks` "It looks like a filter and goes somewhere. Use a link."

**`link`.**

- When: going somewhere, inside text or in a list.
- When not: doing something (`button`).
- Examples:
  - `inline`: in a paragraph. The stage.
  - `standalone`: a list of links.
  - `new-tab`.
  - `visited`: a list of documents.
  - `inherit`: in muted text and in a footer.
- Pairs:
  - `words`. Do: "Read the pricing guide". Don't: "Click here"; `breaks` "Out of its sentence, 'click here' says nothing."
  - `action`. Do: a button that deletes. Don't: a link that deletes; `breaks` "It does something instead of going somewhere. Use a button."

**`progress`.**

- When: a task with a known amount, such as files uploaded.
- When not: a measurement in a range (`meter`); a wait of unknown length (`spinner`).
- Examples:
  - `upload`: a label, "3 of 12 files" beside it, and a `Status` that says "Uploading 12 files" at the start and "Upload complete" at the end. The stage.
  - `states`: 0, 40%, done, and destructive with "Failed at 40%".
  - `in-a-card`: narrow, named by `aria-label`.
- Pairs:
  - `numbers`. Do: the numbers beside the bar. Don't: the bar alone; `breaks` "The fill is the only sign of how much is done."
  - `unknown`. Do: a spinner for a wait of unknown length. Don't: a bar held at 0; `breaks` "A bar that never moves reads as stuck."

**Accessibility: "What Kuiper provides" and "Your part".** These are bullets on the page today, and become the two blocks when `030` and `032` land.

| Item | Provides | Your part, each a must |
|---|---|---|
| pagination | a named `nav`; links (with `rel="prev"` and `rel="next"`) or buttons; `aria-current`; the names "Page N", "Previous page" and "Next page"; Tab only; focus kept on the pressed page and moved when an end control goes; "Page N of M" spoken in button mode | in link mode, put the page number in the page's title; give each page a URL when it has one; in a row beside other content, give the pager the remaining width (`flex-1`); check the row if you replace `strings`; move focus to the list or table if your app replaces it |
| search-field | `searchbox`; a named Clear, a Tab stop while shown, focus back to the input; Escape clears and stops, or passes on when empty, disabled, read-only or composing; the count spoken once per pause, only for the current query | name it with a label; pass `results`; set it to `undefined` while a server's count is on its way, and pass `resultsFor`; wrap a site search, and only that, in `<search>` |
| button-group | `role="group"`; Tab to each; the focused button's ring never covered | name the group; keep attached groups to secondary buttons and menu triggers; one primary at most |
| tag | a named remove button per tag, 24 px; Delete and Backspace; focus to the next control, the previous, the fallback or the list | name the group; remove the tag in `onremove`, at once; put removable tags in a `TagGroup`; give a `fallback` when an input adds tags |
| link | always underlined; 24 px when standalone; the new tab said and shown; `rel` merged | write link text that makes sense alone; use a button for an action |
| progress | `progressbar`, its value and `valuetext`; the fill 3:1 against the track; drawn under forced colours | name it; write the numbers beside it; announce the start and the end with `status` |

**Search.** `aliases.ts` gains six aliases:

- `pager` → `/components/pagination/`;
- `searchbox` → `/components/search-field/`;
- `chip` and `pill` → `/components/tag/`;
- `hyperlink` and `anchor` → `/components/link/`.

None starts a word of another page's title, as the list's rule requires. "Button set" and "token" would, and are left out. "Progress indicator" is left out too: Carbon uses that name for a stepper, and it would send Carbon's readers to the wrong page. The sitemap gains the six pages.

**The `meter` page** (lane S, one sentence). Its "when" says "use a native `<progress>`". That becomes "use a progress bar", linked to `/components/progress/`. Its don't keeps its sense, with the same link.

### 13. Depth, type and colour

- **Nothing translucent** (ruling 2).
  - Every fill and border these items set is a solid token or fully transparent: `border-input`, never `border-border`.
  - No `opacity` below 1, and no backdrop filter.
  - Pagination omits its end controls, and tags and links have no disabled state, so they need no `disabled:opacity-50`.
  - Two disabled states come from existing items, not from these: a disabled `search-field` keeps `input`'s and the addon's own `opacity-50` (decision 4), and a disabled `Button` inside a `button-group` keeps `button`'s. `031b` audits both. Test 50 runs at rest on the enabled examples. Test 26a checks the disabled field's controls and leaves its inherited opacity to `031b`.
- **Letter spacing 0** (ruling 3): no `tracking-*` class.
- **Contrast**, in both schemes: every text reaches 4.5:1 on its ground. These reach 3:1: every icon, the current page's border, the tag's border, the remove icon, and the progress fill against its track. The review measured the fill at 5.58:1 and destructive at 4.79:1 on `--muted`, and `--input` at 3.5:1 or more on the background and the card (EXECUTED (review)). Tests 23, 39, 43 and 47 hold them.
- **Forced colours**, born, ahead of `028`. The current page keeps its bold weight and border, a pressed tag keeps its check, and the progress fill stays drawn (decision 8). Tests 24 and 48 run under Playwright's `forcedColors` in Chromium and Firefox. WebKit records "not emulated", one line per test in `022`'s engine list. Test 40 checks that the check is drawn.

### 14. Edits outside lane N, and their order

| Edit | Lane | Lands after | Why |
|---|---|---|---|
| `tests/sr/pagination.sr.ts`, `search-field.sr.ts` and `tag.sr.ts`; `SR_ITEMS`; the two patches; `expected.json` | E | `022` (and `026`'s `unspoken` rule, for S4) | Constitution §4.4 (decision 11) |
| `scripts/cost/fixtures/<item>.svelte` for the six; three entries in `interactions.ts`; six first budgets | E | `025` | `025` decision 9 and criterion 2 |
| The `meter` page's sentence | S | — (nothing in wave 1 rewrites that page) | The partner item now exists |
| `roadmap.md`'s rows `027a` and `027b` (`028` on both; `037` and `042` on the split rows; `027b` on `020`, `022`, `025` and `026`) | — | done by the coordinator, final since the owner's answer to Q1 | `028`, `037` and `042` wait for the new items |
| Ledger files: `registry.json`, `CHANGELOG.md`, the sitemap, `example-order.ts`, `aliases.ts`, `static/r/` | ledger | landing order, beside `026` | `roadmap.md` §2, "Ledger file" |

The items, their examples and their pages build at once with everything else in wave 1.

### 15. The cost, in `025`'s terms

**Six fixtures** (`025` decision 8), each rendering its item's plain default form:

- `pagination`: button mode, page 5 of 12, with `onpagechange` updating `[data-cost=state]`. Its Next is `data-cost="target"`.
- `search-field`: `value` "design" and `results` "3 results". The input is `data-cost="target"`.
- `button-group`: attached, three secondary buttons.
- `tag`: a group of three removable tags, removing from an `$state` array. The first remove button is `data-cost="target"`.
- `link`: one inline link in a sentence.
- `progress`: one bar at 40 of 100, named.

**Three interactions** (`025` decision 9), each with `kind`, `start`, `target`, `state`, `says` from decision 9's verbs, and `viewport` 1280 × 800:

| Item | Kind, start | Target | The state that ends it | Says |
|---|---|---|---|---|
| `pagination` | click, `click` | `[data-cost=target]`, Next | `aria-current="page"` is on "Page 6" | selects |
| `search-field` | key Escape, `keydown` | `[data-cost=target]`, the filled input | the input's value is `""` | updates |
| `tag` | click, `click` | `[data-cost=target]`, the first remove button | two tags remain, and focus is on the new first remove button | updates |

`costFacts` then gives "selects in N ms" and "updates in N ms". `025`'s verb list is not amended.

- **No main interaction** for `link` (the browser's work), `button-group` (its buttons are `button`'s) or `progress` (it takes no input). They join `025`'s "hydration and size only" list.
- **No large-data case.** A page range is a fixed number of slots. A long tag list is batch B's multi-select's case.
- **`025`'s counts move** from the base `025` and `026` leave (`025` decision 10):
  - `interactions.ts`: from 35 entries to 38;
  - items: from 76 to 82;
  - fixture files: from 64 to 70;
  - measured items: from 72 to 78.
- **Estimates** (INFERRED, memo, corrections). `cn` is in `025`'s floor, so no item's alone figure holds it:
  - `link`, `button-group` and `progress`: about 0.5 to 2 kB of JS alone, under 0.5 kB of CSS, hydration under 5 ms;
  - `pagination`: about 9 to 12 kB, with `button`;
  - `search-field`: about 12 to 15 kB;
  - `tag`: about 10 to 13 kB;
  - each interaction under 4×: about 40 to 70 ms, most of it `025`'s own two frames, under the 200 ms ceiling.
- **Budgets:** `bun run cost --budget <item>` writes each first budget in this spec's build, and the landing notes cite them (`025` decision 14).
- **Under the split (the owner, Q1):** `027a` lands its three fixtures when `025` has landed. If `027a` is ready first, it lands without them. Its fixtures then join `027b`'s lane-E edit, and its part of criterion 17 moves to `027b`. The landing notes say which happened.

### 16. The changelog

**The 0.13.0 entry gains six bullets** (three per part under the split):

> - `pagination`: new, a `registry:ui`. A `nav` named "Pagination", holding Previous, the pages and Next. Pass `href={(page) => …}` and every page is a link; leave it out and they are buttons, with `bind:page` and `onpagechange`. The current page has `aria-current="page"` and a border; each page is named "Page N". Previous is omitted on the first page and Next on the last, and the row keeps its width. In button mode a hidden status says "Page 6 of 12", focus stays on the page you pressed, and if the control you pressed is gone, focus moves to the current page, or to the other end control when narrow. Below the width the full row needs, "Page 5 of 12" replaces the page list. In a row beside other content, give it `flex-1`. Nothing renders for one page. It depends on `button` and `status`, and on `phosphor-svelte`.
> - `search-field`: new, a `registry:ui`. An `input type="search"` in an `input-group`, with a magnifier and a Clear button that shows while there is text and returns focus to the input. Escape clears a filled field and stops there, so a dialog around it stays open; on an empty, disabled or read-only field it passes on. Pass `results` and the field speaks it once typing pauses for 750 ms and the count is for what is typed now: set `results` to `undefined` while a server's count is on its way, and pass `resultsFor`. Name it with a label. It depends on `input-group` and `status`, and on `phosphor-svelte`.
> - `button-group`: new, a `registry:ui`. A `role="group"` of buttons, `attached` (joined, for secondary buttons and menu triggers) or `spaced` (a wrapping row that stacks below 640 px), horizontal or vertical. Each button is its own Tab stop. Name it with `aria-label`. It depends on `button`.
> - `tag`: new, a `registry:ui`. `Tag` is removable (`onremove`, a 24 px button named "Remove <label>", and Delete or Backspace) or pressable (`bind:pressed`, `aria-pressed`, a check while pressed). `TagGroup` is a named list that moves focus to the next tag control after a removal, then the previous, then `fallback`, then itself. It depends on `button`, and on `phosphor-svelte`.
> - `link`: new, a `registry:ui`. An `<a href>`, always underlined, thicker on hover, in the primary colour or `variant="inherit"`. `standalone` gives a 24 px target; `newTab` merges `noopener noreferrer` into `rel` and adds an icon and "(opens in a new tab)" for screen readers; `visited` shows visited links in the text colour. `linkVariants` styles a plain `<a>`. It depends on `phosphor-svelte`.
> - `progress`: new, a `registry:ui`. A native `<progress>` on the muted track with a primary fill, or a destructive one, as `meter` is drawn. Name it, pass `valuetext`, and write the numbers beside it; announce the start and the end with `status`. No indeterminate form: use `spinner` for a wait of unknown length.

**The upgrade guide** gains no section: no installed item changes.

### 17. The scorecard, predicted

- **Row 1, breadth.** 29 of 40 at the first run (scorecard §4), and 30 with `026`. This spec adds pagination, search, button group, tag and link: **35 of 40, score 3 → 4** (34 or more is 4). Progress adds nothing: "progress / meter" is counted through `meter`. EXECUTED (review): 31 with part a and no `toast`, 32 with `toast` and part a, 35 with all six.
- **Rows 1–14 total:** +1.
- **Row 3, accessibility evidence:** no score moves, but `022`'s screen-reader set grows by three items and ten tests, and the mutation set grows by two.
- **Row 15, cost:** six more measured rows, three with runtime figures.
- **Row 2, guidance depth:** held, since it reads Button and Dialog. Page-standard coverage rises by six pages born with pairs and described props.
- **With the split (the owner, Q1),** `027a` alone reaches 32 of 40 (score 3, held), and `027b` brings it to 35.

## Design

### Pagination, in outline

```svelte
<nav data-slot="pagination" aria-label={s.label} class="@container flex w-full min-w-0 items-center gap-2 …">
  <div data-slot="pagination-previous">
    <!-- on page 1: the control, invisible and inert, holding the width -->
  </div>
  <ul data-slot="pagination-list" class={cn("flex gap-1", switchClasses({ size, siblings }).list)}>
    {#each paginationPages(page, pages, siblings) as item (item.type === "page" ? item.page : item.key)}
      {#if item.type === "page"}<li data-slot="pagination-page">…link or button, aria-current…</li>
      {:else}<li data-slot="pagination-ellipsis" aria-hidden="true">…</li>{/if}
    {/each}
  </ul>
  <p data-slot="pagination-summary" class={switchClasses({ size, siblings }).summary}>{s.summary(page, pages)}</p>
  <div data-slot="pagination-next">…</div>
  {#if buttonMode}<Status data-slot="pagination-status" text={said} />{/if}
</nav>
```

`buttonMode` is fixed at the first render, from whether `href` was given, so the status is present from the start. After a press: `page` is set, `tick()` runs, and focus is restored or moved by decision 3's rules, read against whether the list is shown (`getComputedStyle(list).display`).

### The tag group's context, in outline

```ts
type TagGroupContext = {
  /** Called by a Tag before its onremove: its control's index among [data-tag-control]. */
  removing(index: number): void;
};
// TagGroup, on the next tick after removing(i):
//   const controls = list.querySelectorAll("[data-tag-control]");
//   (controls[i] ?? controls[i - 1] ?? fallback?.() ?? list).focus();
```

A tag reads its index from the group's controls at the moment it is pressed, not from a stored number. So tags the app adds, reorders or mixes need no bookkeeping.

## Scope

**In:**

- `src/lib/registry/ui/{pagination,search-field,button-group,tag,link,progress}/`: the fourteen files of decision 1.
- `registry.json`'s six entries.
- `src/lib/site/examples/<item>/`: the examples and pair files of decision 12.
- `src/routes/(site)/components/<item>/+page.svelte`, six pages.
- The `meter` page's one sentence.
- The ledger files of decision 14.
- Thumbnails: two per item, twelve.
- `tests/sr/` additions (decision 11). `scripts/cost/` additions (decision 15).
- The tests below.

**Out:**

- An indeterminate progress bar (Q2, `039`).
- A `visited` colour token, or visited on by default (Q3).
- Arrow-key focus in a tag group, and tags inside an input (`037`).
- A toolbar with roving focus (`042`).
- Count badges, dots and the page banner (`036`).
- Moving the ten items' link classes onto `linkVariants` (lane I, a small change after `023`).
- A split button as its own item. It has one reference in the matrix, and `button-group` with a menu trigger covers it.
- System colours under forced colours (`028`).
- An amendment to `025`'s verb list (decision 15 uses its verbs).
- The page standard's machinery: anatomy figures, keyboard tables driven as data, pictured pairs (`032`). This spec writes the content those will read.
- Any change to `button`, `input-group`, `input`, `status`, `badge` or `meter`'s source.

## Tests written first

Each test is written and seen failing before the code it checks, and the landing notes say how each failed. Browser tests carry `item` and a `check` annotation (`022` decision 13a). Browser tests run in both schemes, in Chromium locally and in all three engines in CI. Each test is marked with its part, **a** or **b**; tests 1 to 7 and 50 to 53 are written per item, and each item's cases belong to its part.

**Unit, the registry and the site:**

1. **`registry.test.ts`: "batch A's items are registry:ui items".** For each built item, it checks:
   - its name, type `registry:ui`, `meta.since` `0.13.0`, `meta.modes` `["productive"]`, `meta.group` as in decision 1, and no `meta.stock`;
   - `registryDependencies` exactly as in decision 1 (with `utils` and `kuiper-theme`);
   - built packages: exactly `phosphor-svelte@^3.1.1` for the four items with icons, and none for `button-group` and `progress`;
   - its file count: `link` 2, `button-group` 2, `progress` 2, `pagination` 3, `search-field` 2, `tag` 3.

   Part a checks its three items; part b adds its three. Fails today: no entries.
2. **`registry.test.ts`: "the 0.13.0 entry has one bullet per built batch A item".** Each bullet is present and names:
   - `pagination`: `aria-current`, `href`, `onpagechange`, "Page 6 of 12" and `flex-1`;
   - `search-field`: Escape, `results`, `resultsFor` and 750 ms;
   - `button-group`: `attached`, `spaced` and `aria-label`;
   - `tag`: "Remove", Delete and `fallback`;
   - `link`: `newTab`, `noopener` and `linkVariants`;
   - `progress`: `<progress>`, `valuetext` and `spinner`.
3. **`023`'s described-list test: "batch A has 0 empty API rows".** It covers every prop of `Pagination`, `SearchField`, `ButtonGroup`, `TagGroup`, `Tag`, `Link` and `Progress`, and every member of the five `Strings` types. If `023`'s test does not exist at build, the builder writes this check in `registry-comments.test.ts`, and `023` absorbs it.
4. **`literals.test.ts`: "batch A's files are linted, with 0 literals and 0 allowances".** The lint's file list holds each built file, and `FILE_COUNT` moves by 6 for part a and 8 for part b from its count at build start.
5. **`examples.test.ts` and the order test: "each batch A page's examples are in order".** Each pair file has kind, pair and a caption of 20 words or fewer. Each don't has `breaks` and renders inside `inert`.
6. **`breadth.test.ts` (new, beside `scripts/bench/`): "the six names meet REFERENCE_PARTS".**
   - `pagination`, `search-field`, `button-group`, `tag` and `link` each match exactly one part.
   - `progress` matches "progress / meter", which `meter` already holds.
   - Over the working tree's `registry.json`, the hit count is 2 more than at build start after part a, and 3 more again after part b.
7. **`search.test.ts`: "the six aliases lead to their pages".** None starts a word of another page's title.

**Unit, `tests/unit/pagination-pages.test.ts` (b):**

8. **"every page when they fit".** `(3, 7, 1)` gives 1 to 7, with no ellipsis.
9. **"a fixed seven slots above that".** For `pages` 12 and `siblings` 1, every `page` from 1 to 12 gives exactly 7 items.
   - Page 1: `1 2 3 4 5 … 12`.
   - Page 5: `1 … 4 5 6 … 12`.
   - Page 12: `1 … 8 9 10 11 12`.
10. **"an ellipsis never hides one page".** `(4, 8, 1)` shows page 2, not an ellipsis, between 1 and 3.
11. **"siblings change it".** `(10, 20, 2)` gives 9 items: `1 … 8 9 10 11 12 … 20`. `(10, 20, 0)` gives 5 items: `1 … 10 … 20`.
12. **"out of range is clamped".** `(0, 5, 1)` and `(9, 5, 1)` behave as pages 1 and 5. `pages` 1 or 0 gives one page.

**Browser, `tests/e2e/pagination.spec.ts` (b):**

13. **"a named nav in three parts".** On `links`:
    - there is one `navigation` named "Pagination";
    - its children, in order, are the previous slot, the list, the summary and the next slot;
    - the list's exposed items are the pages only, because the ellipsis `li` is `aria-hidden`.

    (`structure`)

    13a. **"in a footer row it has its width".** On `in-a-footer`, at 1440 and 390, in all three engines:
    - the `nav`'s width is above 0;
    - the `nav` and each of its controls has `scrollWidth ≤ clientWidth`;
    - no control's box leaves the row's box.

    Seen failing first on a `nav` without `w-full min-w-0` and `flex-1`. (`layout`)
14. **"link mode renders links".** On page 5 of 12:
    - there are links named "Page 1", "Page 4", "Page 5", "Page 6", "Page 12", "Previous page" and "Next page", each with its `href` from the builder;
    - Previous has `rel="prev"` and Next has `rel="next"`;
    - "Page 5" has `aria-current="page"`;
    - there is no `button` inside.

    (`structure`)
15. **"button mode renders buttons".** On `buttons`:
    - the same names, as buttons with `type="button"`, and no `a`;
    - pressing "Page 6" sets the example's shown page to 6, and `aria-current` moves.

    (`structure`)

    15a. **"focus stays on a pressed page across range changes".** In button mode, these presses are made in turn: page 1 to "5", 5 to "12", 12 to "1", 1 to "4", and 4 to "3".
    - By Enter, in all three engines: after each press, `document.activeElement` is the control for the page pressed.
    - By click, in Chromium and Firefox: the same.
    - By click, in WebKit, which does not focus a button on click: `document.activeElement` after each press is what it was before it. The item does not move focus.

    The re-review saw Svelte keep the node across these moves (EXECUTED (re-review)), so the restore is a guard. The test is kept, and the landing notes say whether it was ever needed. (`focus`)
16. **"the ends are omitted, and the slot keeps its width".**
    - On page 1 there is no "Previous page" in the accessibility tree or the Tab order, and the previous slot's width equals its width on page 2, ± 1 px.
    - With `strings.previous` set to a word twice as long, the same holds.
    - On page 12, the same holds for Next.

    (`layout`)
17. **"the list keeps its width as the page moves".** Over pages 1 to 12, the list's width varies by at most 1 px at each size. (`layout`)
18. **"focus survives the end".** In button mode, on page 11, with focus on Next, press Enter:
    - at 1440, Next is gone, and focus is on "Page 12", which has `aria-current`;
    - in WebKit, a click on Next onto page 12, with focus outside the `nav` before the click, leaves focus where it was;
    - at 320 (`narrow`), Next is gone, and focus is on "Previous page";
    - the same holds for Previous onto page 1, in both widths.

    (`focus`)
19. **"button mode says the page".**
    - The server HTML of `/example/pagination/buttons/` holds one empty `pagination-status`.
    - After Next from page 5, within two frames, it reads "Page 6 of 12".
    - Link mode renders no `pagination-status`.

    (`live`)
20. **"narrow shows the summary".** At the default size with `siblings` 1:
    - in a 640 px container, the list is `display: none`, and the summary reads "Page 5 of 12";
    - in a 700 px container, the reverse;
    - Previous and Next show at both.

    (`layout`)

    20a. **"no overflow at any width".** For both sizes and every `siblings` value, on pages 1, 5 and 12 of 12, in containers from 320 to 1440 px wide in 16 px steps: the `nav`'s `scrollWidth` is at most its `clientWidth`, and so is the list's. Holds decision 3's switch table. (`layout`)
21. **"one page renders nothing".** With `pages` 1, there is no `navigation`. (`structure`)
22. **"Tab only".** With focus on "Page 5", press ArrowRight, ArrowLeft, Home and End: focus is still on "Page 5". (`keyboard`)
23. **"the current page is a shape, and it reaches 3:1".**
    - The current page's border is at least 1 px, and its font weight at least 600.
    - The other pages' border is transparent, and their weight 400 or 500.
    - The border reaches 3:1, and every number 4.5:1, against the ground, in both schemes.

    (`contrast`)
24. **"forced colours keep the current page".** Under `forcedColors: "active"`, in Chromium and Firefox, the current page's weight is still at least 600, and its border is drawn. WebKit records "not emulated". (`forced-colors`)

**Browser, `tests/e2e/search-field.spec.ts` (b):**

25. **"a named searchbox with a hidden icon".**
    - On `filter`, `site` and `in-a-field`: one `searchbox` each, named by its label.
    - The icon is `aria-hidden`.
    - In `in-a-field`, the input's `aria-describedby` holds the field's description.

    (`structure`)
26. **"Clear shows with text, is a stop, and returns focus".**
    - Empty: there is no "Clear search".
    - Type "des": "Clear search" exists, with `aria-controls` set to the input's id, and Tab from the input reaches it.
    - Press it. The input's DOM value and the bound `value` are both `""` when the `input` event fires. The example's list shows every project. `onclear` ran once. Focus is on the input.

    (`focus`)

    26a. **"disabled and read-only fields have no Clear and pass Escape on".** On `disabled`:
    - neither field, though each holds "design", shows "Clear search";
    - Escape on the read-only field leaves its value "design";
    - a `keydown` listener on `document` sees the Escape, not stopped.

    (`keyboard`)
27. **"Escape clears a filled field and stops".** In `in-a-dialog`, in all three engines:
    - type "des" and press Escape: the value is `""`, focus is on the input, and the dialog is still open;
    - press Escape again: the dialog is closed, and focus is on its trigger.

    (`keyboard`)

    27a. **"Escape during composition, and the app's handlers".**
    - A synthetic `keydown` Escape with `isComposing: true` on a filled input leaves its value, and is not stopped. So does one with `isComposing: false` and `keyCode` 229.
    - An app's `onkeydown` and `oninput` passed to the field each run once per event, beside the field's own handling.
    - An app's `onkeydown` that calls `preventDefault()` on Escape keeps the value.

    (`keyboard`)
28. **"WebKit's cancel button is hidden".** In Chromium and WebKit, a screenshot of the filled, focused input's last 40 px:
    - differs from the same input without the class;
    - equals one with `-webkit-appearance: none` on the pseudo-element.

    (`structure`)
29. **"the count waits for the pause, and is written again".** On `filter`, with `page.clock`:
    - type "des": at 749 ms the status is empty; at 750 ms plus one frame, it reads "3 results";
    - type "i" and wait 750 ms: a `MutationObserver` saw the status go to `""`, then "3 results" again, though the count did not change;
    - Clear: the status is not written.

    (`live`)

    29a. **"a late count is spoken once, and a stale one never".** On `server`, with `page.clock`, where the answer comes 400 ms after the pause:
    - type "de", wait for its count "12 results", then type "s";
    - at the pause (750 ms), the status is not written, because `results` is `undefined`;
    - at 1,150 ms, "3 results" arrives, and the status reads "3 results" within two frames;
    - the `MutationObserver` never saw "12 results" after the "s";
    - in a second run, the answer to "de" ("12 results", `resultsFor` "de") arrives after "s" was typed: it is never written.

    Seen failing on a field that speaks at the timer from whatever `results` holds. (`live`)
30. **"the status is in the server HTML, empty".** The raw HTML of `/example/search-field/filter/` holds one empty `search-field-status` with `role="status"`. (`live`)
31. **"one landmark in the site example".** On `site` there is one `search` landmark, holding the field and its submit button. On `filter` there is none. (`structure`)

**Browser, `tests/e2e/button-group.spec.ts` (a):**

32. **"a named group, a stop per button".** On `attached`:
    - there is one `group` named "Text alignment";
    - Tab from before it visits its three buttons in order;
    - ArrowRight on the first button leaves focus there.

    (`keyboard`)
33. **"attached shares one edge".** On `attached`, `with-menu` and `vertical`:
    - each child after the first, the "More" trigger included, has a start border width of 0 (top, when vertical);
    - its start edge meets the previous child's end edge, ± 0.5 px;
    - the outer corners have the radius, and the inner corners 0.

    (`layout`)
34. **"the focused button's ring is never covered".** Focus each child by Tab:
    - its computed `z-index` is 10, and its `position` is `relative`;
    - the pixel 3 px outside its border, at its end edge's middle, has `--ring`'s colour. The ring is a 2 px outline at a 2 px offset.

    (`focus`)
35. **"spaced wraps, then stacks".** On `spaced`:
    - at 1440, there is a gap of at least 8 px between buttons;
    - at 390, `flex-direction` is `column`, and each button is the group's width.

    (`layout`)
36. **"with a menu".** On `with-menu`:
    - the "More" trigger is the group's last button;
    - Enter opens its menu;
    - Escape returns focus to it.

    (`keyboard`)

**Browser, `tests/e2e/tag.spec.ts` (b):**

37. **"a named list of tags".** On `removable`:
    - there is one `list`, with an explicit `role="list"`, named "Filters", of three `listitem`s;
    - each item holds one button named "Remove <label>", at least 24 × 24.

    (`structure`)
38. **"focus goes to the next control, then the previous, then the list".** On `removable`:
    - remove "Design", the first of three: focus is on "Remove Research";
    - remove the last: focus is on the new last tag's remove;
    - remove the remaining one: focus is on the list, named "Filters".

    On `fallback`, removing the last tag focuses the add input. On `mixed` (static "Owner: me" between removable A and C), removing C focuses A's remove button, and removing A then focuses the list. Each case is run by Enter, Space, Delete, Backspace and click. (`focus`)
39. **"tags reach 4.5:1 and their marks 3:1".** In both schemes:
    - label text reaches 4.5:1 on the tag's ground;
    - a pressed tag's text reaches 4.5:1 on `primary`;
    - the border, the remove icon and the check reach 3:1.

    (`contrast`)
40. **"a pressable tag is a toggle with a check".** On `pressable`:
    - there are four buttons with `aria-pressed="false"`;
    - Space on the first: `aria-pressed="true"`, a `tag-check` `svg` inside, and `onpressedchange` ran once with `true`;
    - Space again: `false`, and no check.

    (`keyboard`)
41. **"a static tag has no button".** On `static` and `mixed`, a static tag holds no `button`, no `data-tag-control`, and is not a Tab stop. (`structure`)

**Browser, `tests/e2e/link.spec.ts` (a):**

42. **"always underlined, thicker on hover".** On `inline`, `text-decoration-line` is `underline` at rest, and on hover `text-decoration-thickness` is greater than at rest. (`structure`)
43. **"the primary colour reaches 4.5:1, and inherit takes the text's".**
    - A default link's colour is `--primary`'s, and it reaches 4.5:1 on the background and on the card, in both schemes.
    - On `inherit`, the link's colour equals its parent's.

    (`contrast`)
44. **"standalone is 24 px tall".** On `standalone`, each link's box is at least 24 px tall. (`layout`)
45. **"a new tab is said and safe".** On `new-tab`:
    - `target="_blank"`, and `rel` holds `noopener` and `noreferrer`;
    - with an app's `rel="external"`, `rel` holds all three, each once;
    - the accessible name ends with "(opens in a new tab)";
    - the icon is `aria-hidden`.

    (`structure`)
46. **"visited is opt-in, by its rule".** Browsers report a visited link's computed colour as its unvisited one, so a script cannot read it (EXECUTED (review)). So the test reads the page's stylesheet:
    - walking every rule, nested ones included (`CSSLayerBlockRule`, `CSSMediaRule`, `CSSSupportsRule`), since Tailwind puts it in `@layer utilities`: the `visited` class yields a rule whose selector ends in `:visited` and whose `color` is `var(--foreground)` (or `--color-foreground`);
    - a link without `visited` matches no `:visited` rule from the item.

    The painted colour is not asserted. (`structure`)

**Browser, `tests/e2e/progress.spec.ts` (a):**

47. **"a named progressbar with its text, and no valuemax".** On `upload`:
    - there is one `progressbar` named "Upload", with `value` 3, `max` 12, `aria-valuetext` "3 of 12 files", and no `aria-valuemax`;
    - the fill reaches 3:1 against the track, in both schemes.

    A fixture that passes `value={null}` through an untyped call renders `value="0"`, and does not match `:indeterminate`. (`structure`, `contrast`)
48. **"the classes draw it in every engine".** On `states`, for the 40% bar, from a screenshot of the element, in Chromium, Firefox and WebKit:
    - the pixel at 10% of its width is `--primary`'s colour, and the one at 90% is `--muted`'s, ± 2 per channel;
    - it is 8 px tall;
    - the destructive bar's 10% pixel is `--destructive`'s colour.

    Under `forcedColors: "active"`, in Chromium and Firefox, the 10% and 90% pixels differ. WebKit records "not emulated". (`structure`, `forced-colors`)
49. **"silent by design".** Inside and around the bar there is no `aria-live` and no live role. The example's `Status` reads "Uploading 12 files" after the start, and "Upload complete" at the end. (`live`)

**Browser, for all six (each part for its own items):**

50. **"nothing in batch A is translucent".** On every enabled example of the items, at rest and with each control hovered and focused, no descendant of an example's root has any of these:
    - a background or border colour with alpha strictly between 0 and 1, in any colour syntax, as `019a` criterion 5 reads it;
    - a backdrop filter;
    - opacity below 1.

    (`depth`)
51. **"no letter spacing".** Every text element in the items' examples computes `letter-spacing` as `normal` or `0px`. (`type`)
52. **"axe: 0 violations".** On every example and every do of the pages, in both schemes, at 1440 and 390. Each don't reports exactly the axe rule its `breaks` names, or none when `breaks` is in words. (`axe`)
53. **`keyboard.spec.ts`: decision 9's rows,** each a test on its example. (`keyboard`)

**Unit, `022`'s suite (b):** 54. **`sr-items.test.ts`** passes with `pagination`, `search-field` and `tag` in `SR_ITEMS`, with decision 11's kinds. `link`, `button-group` and `progress` are not candidates.

- Every new test carries `item`, `rules` and `hears`, and each part is declared as an element.
- `mutations.test.ts` derives exactly P1 for `pagination-status`, and T1 to T3 for `tag-focus`, and finds each witness.

**Unit, `025`'s suite:** 55. **`cost.test.ts`** passes with the built items' fixtures, their interaction entries (each `says` among decision 9's verbs, each with `start`, `target`, `state` and `viewport`), and a budget for each.

## Acceptance criteria

Each criterion is marked for the split the owner chose (Q1). **a** binds `027a`, **b** binds `027b`, and **a/b** has a form for each.

1. **a/b. The items.** Each part's files exist, and `registry.json` matches decision 1 for its items. Tests 1 and 4 pass. **a:** `link`, `button-group`, `progress`, six files. **b:** `pagination`, `search-field`, `tag`, eight files. (unit)
2. **a/b. Names and breadth.** Test 6 passes. **a:** 2 more parts hit; 32 of 40 with `026`. **b:** 3 more; 35 of 40. (unit)
3. **b. Pagination's range.** Tests 8 to 12 pass. (unit)
4. **b. Pagination.** Tests 13 to 24, with 13a, 15a and 20a, pass. (e2e)
5. **b. Search field.** Tests 25 to 31, with 26a, 27a and 29a, pass. (e2e)
6. **a. Button group.** Tests 32 to 36 pass. (e2e)
7. **b. Tag.** Tests 37 to 41 pass. (e2e)
8. **a. Link.** Tests 42 to 46 pass. (e2e)
9. **a. Progress.** Tests 47 to 49 pass, test 48 in all three engines. (e2e)
10. **a/b. Depth, type and axe.** Tests 50 to 52 pass for the part's items. (e2e)
11. **a/b. Keyboard.** Test 53 passes for the part's rows. (e2e)
12. **a/b. Described.** Test 3 passes for the part's items. (unit)
13. **a/b. The pages.** Each of the part's pages renders decision 12's examples in order and its two pairs. Tests 5 and 7 pass for its pages and aliases. The "Your part" list holds decision 12's musts. **a** also changes the `meter` page's sentence. (unit, e2e, review)
14. **a/b. The changelog.** Test 2 passes for the part's bullets: **a** three (`link`, `button-group`, `progress`), **b** three. (unit)
15. **a/b. Three engines.** Every test in the part's spec files passes in `chromium-*`, `firefox-*` and `webkit-*`. Otherwise it is in `022`'s fault ledger with a small change, or, for a forced-colours assertion in WebKit, in `022`'s engine list as "not emulated". (CI)
16. **b. Screen readers.** P1 to P3, S1 to S4 and T1 to T3 pass under VoiceOver (WebKit, Chromium) and NVDA (Chromium, Firefox) in a green `matrix` run, whose id is in the landing notes. The mutation run fails exactly the tests `expected.json` derives. Test 54 passes. (CI, unit)
17. **a/b. The cost.** `scripts/cost/` holds decision 15's fixtures and entries for the part's items. Test 55 passes. `bun run cost` reports each item under its first budget, and each response time under 200 ms. The landing notes give the figures and cite the budgets. Under the split, **a**'s fixtures may move to **b**, as decision 15 says. (cost run, unit)
18. **a/b. The suites.** `bun run test:unit`, `bun run test:e2e`, `bun run test:smoke`, `bun run check`, `bun run lint`, the literal lint and the release check pass. Expectations change only in the files this spec names. (all)
19. **a/b. Tests first.** **a:** tests 1 to 7 (for its items), 32 to 36, 42 to 53 (for its items). **b:** tests 1 to 7 (for its items), 8 to 31 with their lettered tests, 37 to 41, 50 to 53 (for its items). Each is seen failing first, and the landing notes give each part's count. (checkpoint)
20. **a/b. The checkpoint.** The design lead walks each built item in both schemes at 1440 and 390.
    - **a:** both button-group looks, with the menu trigger and the hover; the link's hover, new tab and visited list; the progress bar's states.
    - **b:** pagination's ends, footer row, narrow form, focus at the end and status; the search field's Clear, Escape in a dialog, a disabled field, and the count's timing, late and on time; a tag removed by each key, in a mixed group.

    (checkpoint)
21. **a/b. The scorecard.** `breadth.ts`, `kuiper.ts --rev`, `site.ts --only kuiper` and `depth.ts` run, with the cost run. Row 1 reads 32 of 40, score 3, after **a** with `026`; and 35 of 40, score 4, after **b**. The run log has a row per landing, and each change review cites it. (measure)

## Build order

The owner chose two builds (Q1): `027a` is steps A1 to A6, and `027b` is steps B1 to B9. They touch disjoint item folders and may run at once on two builders. `027a` lands first.

**`027a`: link, button group, progress.**

- **A1. Confirm.** Check whether `020` and `023` have landed. Write test 48 and run it in all three engines on a bare `<progress>` with decision 8's classes. The review saw it pass, so this keeps the proof in the suite. Then write tests 1 to 7 for the three items, and see each fail.
- **A2. The three items, their examples and pages.** Write tests 32 to 36 and 42 to 49; see them fail; build until they pass, in Chromium, then with `test:e2e:engines`.
- **A3. Checkpoint a** (criterion 20 a).
- **A4.** Tests 50 to 53 for the three items, and the `meter` page's sentence.
- **A5. The cost fixtures** (lane E), if `025` has landed. Otherwise they move to B8 (decision 15).
- **A6. Ledgers**, in landing order beside `026`: `registry.json`, the changelog's three bullets, the sitemap, the order, the aliases (`hyperlink`, `anchor`), `static/r/`, and six thumbnails. Then the change review, the landing and the scorecard.

**`027b`: pagination, search field, tag.**

- **B1. Confirm.** Check whether `020`, `022`, `023`, `025` and `026` have landed. `027b` depends on `022` (B6), `025` (B8, criterion 17) and `026` (S4's `unspoken` rule); its items and pages may build before them. Write tests 1 to 12 for the three items, and see each fail.
- **B2. `pagination-pages.ts`,** until tests 8 to 12 pass.
- **B3. The three items, their examples and pages.** Write tests 13 to 31 and 37 to 41, with their lettered tests; see them fail; build until they pass.
- **B4. Checkpoint b** (criterion 20 b).
- **B5.** Tests 50 to 53 for the three items.
- **B6. The screen-reader files and mutations** (lane E), once `022` has landed, and S4 once `026`'s `unspoken` rule is in. Test 54.
- **B7. Ledgers**, in landing order: the three bullets, the sitemap, the order, the aliases (`pager`, `searchbox`, `chip`, `pill`), `static/r/`, and six thumbnails.
- **B8. The cost fixtures** (lane E), once `025` has landed, with part a's if A5 moved them. Test 55, and `bun run cost --budget` for each.
- **B9. Owner push** for the `matrix` run and the mutation run (`022`'s plan). Then the change review, the landing and the scorecard.

## Risks

- **The progress classes could stop drawing in a later engine.** Test 48 runs in all three engines on every run, so the theme fallback would be ruled at once.
- **The search count's contract asks something of the app.** Without `resultsFor`, only `undefined` means pending. A server-backed search that keeps the old string while it waits has the old count spoken at the pause. The `server` example passes both `undefined` and `resultsFor`, and "Your part" and the doc comment say so. Test 29a holds the item's half.
- **The count may be chatty.** A count after every pause is right for filtering, but a slow typist may hear it often. The checkpoint and S2 tune `SEARCH_FIELD_SETTLE_MS`; a change is a ruling in the landing notes.
- **Focus after a removal depends on the app removing the tag in the same tick.** An app that removes it later, after a server call, finds focus already moved to a tag that still exists. The page's "Your part" says to remove at once and undo on failure. A tag removed asynchronously is a finding the checkpoint looks for.
- **The switch widths are measured in English.** A translation with longer words for Previous and Next may need a wider step. Test 20a and test 16's long-word case show the English row; "Your part" tells an app that replaces `strings` to check its own.
- **VoiceOver may drop "Page 6 of 12"** while focus stays put, or speak `aria-current` on a button differently. P1 to P3 tell.
- **`decoration-2` and `underline-offset-4` are sizes the lint does not judge.** They are recorded in decision 7 for `050`.
- **Ledger contention with `026`,** which lands through the same files in wave 1. They land one at a time.
- **Six pages of guidance** to write, by the design lead (decision 12). At about 3 hours each, on the standard memo's figures, that is about 18 hours.

## Open questions for the owner

None. The owner answered Q1 to Q7 on 2026-11-15, each with the recommended option. The questions as asked, and the answers, are in the Landing notes.

## Review

Reviewed 2026-11-15: [`../reviews/027-batch-a-spec-2026-11-15.md`](../reviews/027-batch-a-spec-2026-11-15.md). The verdict was "does not land yet", with 3 High, 8 Medium and 11 Low findings. All 22 are taken. They are answered here:

| # | Severity | Answer |
|---|---|---|
| 1 | High | Decision 3: the `nav` is `w-full min-w-0`, and in a row the app gives it `flex-1` ("Your part"). New example `in-a-footer`. Test 13a, at 1440 and 390, in all three engines |
| 2 | High | Decision 3: when the list is hidden, focus moves to the remaining end control (Carbon's data-table pager, studied, not copied). Test 18 runs at 1440 and 320. New screen-reader test P3 |
| 3 | High | Decision 4: the count is spoken at the later of the pause and its arrival, and only if set after the last `input`. `results` is `undefined` while pending, and the new `resultsFor` drops a late answer to an older query. New example `server`. Tests 29a and S4 |
| 4 | Medium | Decision 15: `says` is "selects", "updates" and "updates", from `025` decision 9's verbs, with `start` (`click`, `keydown`, `click`), `target` and `viewport`. `025`'s list is not amended |
| 5 | Medium | Decision 3: focus is restored by page number after `tick()`, if a keyed move dropped it. Test 15a presses across range changes, by Enter and click, in all three engines |
| 6 | Medium | Decision 6: one index space, the group's tag controls (`[data-tag-control]`). Static tags hold no index. New example `mixed`, and its case in test 38 |
| 7 | Medium | Decision 4: no Clear, and Escape passes on, while the field is disabled or read-only. Decision 13 is corrected: the inherited `opacity-50` is the existing items' rule, which `031b` audits. New example `disabled`. Test 26a |
| 8 | Medium | Decision 5: the group styles its direct children, so the `DropdownMenu.Trigger` is joined. Test 33 runs on `with-menu` |
| 9 | Medium | Decision 3: switch widths by size and siblings (`@xl` to `@3xl` at the default size, `@md` to `@xl` at `sm`); `siblings` is `0 \| 1 \| 2`. Test 20a sweeps 320 to 1440 px in 16 px steps |
| 10 | Medium | Decision 1: true sizes, about 170 and 600 lines. The build order splits into A1–A6 and B1–B9: `pagination-pages.ts` is in part b, and part a's cost fixtures wait for `025` or move to part b. Every criterion has an a, b or a/b form. The roadmap edit is named (decision 14) |
| 11 | Medium | Test 46 asserts the compiled `:visited` rule, not a computed colour |
| 12 | Low | Decision 4: Chromium and Firefox clear a search input on Escape, and WebKit does not; the handler prevents the native clear and clears the field itself. The memo is corrected |
| 13 | Low | Test 28 compares screenshots |
| 14 | Low | Test 34 samples 3 px outside the border |
| 15 | Low | Decisions 8 and 13, and tests 24 and 48: forced colours are checked in Chromium and Firefox; WebKit records "not emulated" |
| 16 | Low | Decision 15: from 35 entries to 38, 76 items to 82, 64 fixture files to 70, 72 measured items to 78 |
| 17 | Low | Decision 11: parts name elements: `pagination:pages`, `search-field:input`, `tag:group` |
| 18 | Low | Decision 6: the list has an explicit `role="list"`. Test 37 |
| 19 | Low | Decision 4 says why `stopPropagation()` works, and that the handler must not move to a capture listener. It ignores `isComposing`. Decision 2 composes an app's handlers with the item's. Decision 7 merges `rel`. Tests 27a and 45 |
| 20 | Low | Decision 4: Clear sets the input's own `value` before dispatching `input`. Test 26 checks both values when the event fires |
| 21 | Low | Decision 3: the empty slot holds the control, `invisible` and `inert`, and test 16 has a long-word case. Pages take `min-w-12 px-2` or `min-w-8 px-2`, so four digits fit. Decision 7 records `decoration-2` beside the `underline-offset-4` precedent, for `050` |
| 22 | Low | "Progress indicator" is dropped from the aliases. `rel="prev"` and `rel="next"` are taken (test 14). The attached group's −1 px overlap is declined: `-ms-px` is off the spacing ladder, so the three-sided hover is kept and recorded (decision 5), and the checkpoint looks at it |

**On the open questions,** following the review's notes:

- Q1 recommends the split now that finding 10 is fixed.
- Q2's option 1 now says a runtime `null` renders as 0.
- Q5 and Q6 rest on findings 2 and 3, now fixed.
- Q7's "next" is now defined in mixed groups (finding 6).

### The re-review, 2026-11-15

The re-review approved with changes R1 to R6. All are taken:

| # | Severity | Answer |
|---|---|---|
| R1 | Medium | Decision 4 and `results`' doc comment: without `resultsFor`, only `undefined` means pending, and the field speaks at the later of the pause and `results` being a string. With `resultsFor`, the equality rule stays. So test 29's unchanged count and S2 pass on `filter`, whose count is derived from `value`. The risk is restated |
| R2 | Low | Decision 3: both focus rules act only when focus was inside the `nav` as the press began. Test 15a asserts that a WebKit click moves no focus, and test 18 adds the WebKit click on Next |
| R3 | Low | Decision 3, the anatomy and the outline: `gap-2` across the row and `gap-1` in the list. The switch table carries the re-review's measured row widths |
| R4 | Low | The header and decision 14 name rows `027a` and `027b`, final since the owner chose the split. Q1's option 2 no longer says "as the roadmap lists it". The header and B1 say that `027b` depends on `022`, `025` and `026` (S4 uses `026`'s `unspoken` rule). The roadmap side is the coordinator's |
| R5 | Low | Test 46 walks nested rules (`CSSLayerBlockRule`, `CSSMediaRule`, `CSSSupportsRule`) |
| R6 | Low | Decision 4: Escape passes on while `event.isComposing \|\| event.keyCode === 229`. The 229 case is INFERRED from Safari's known behaviour for Enter, and not run. Test 27a adds the synthetic 229 case. Keyboard table updated |

## Landing notes

`027b` not built. `027a` built; its notes follow.

### 027a: link, button group, progress

- **Built** 2026-11-15 by a builder, in its own worktree, on `release/0.13.0` from `0372323`, and committed on the build branch (commit in the report). Not yet change-reviewed. The design lead's checkpoint (criterion 20 a) has not been walked: the owner and the design lead were away, and the builder went on under the owner's delegation. It is the first thing to do before the landing.
- **What was built.**
  - `src/lib/registry/ui/link/` (`link.svelte`, `index.ts`), `button-group/` (`button-group.svelte`, `index.ts`) and `progress/` (`progress.svelte`, `index.ts`): six files, as decision 1.
  - `registry.json`: the three entries of decision 1, each at the end of its group.
  - `src/lib/site/examples/<item>/`: twelve page examples in decision 12's order, and twelve pair files (`do-<pair>`, `dont-<pair>`).
  - `src/routes/(site)/components/{link,button-group,progress}/+page.svelte`: three pages. Each renders its four pair files in its Do and Don't lists, each don't inside `inert`, with "What Kuiper provides" and "Your part" as bullets.
  - The `meter` page: "use a native `<progress>`" became "use a progress bar", linked to `/components/progress/`, in its "when" and its don't.
  - Ledgers: three changelog bullets (decision 16's words), `EXAMPLE_ORDER`'s three rows, the aliases `hyperlink` and `anchor`, `static/r/` and `static/v0.13.0/r/` regenerated by `bun run build:registry`, six thumbnails (and `meter`'s, regenerated because its route changed; its picture is byte-identical). The sitemap's entries come from `registry.json`, so it needed no edit.
- **Tests first.** Every new check was written before the code it checks, and run red:
  - Unit, tests 1 to 7 for part a: 28 tests across six files. 26 failed. The 2 that passed read only `REFERENCE_PARTS` (test 6's "the list holds 40 parts" and "link and button-group each match exactly one part"), which hold before any item exists; test 6's count, which needs the items, failed.
  - Browser, tests 32 to 36, 42 to 53 and the page side of test 5: 93 tests a scheme, 186 runs in the `light` and `dark` projects, against a build of `0372323` served on its own port. 186 failed, 0 passed. By test: 32, 34, 35, 36 and 42 to 49 twice each (once a scheme); 33 six times (three examples); 50 and 51 twenty-four times (twelve examples); 52 ninety-six times (24 views at two widths); 53 six times; the pair check six times.
  - A1's bare-`<progress>` run was folded into test 48, which ran on the item in all three engines (below), so no separate fixture was written.
- **The checks, at the end** (figures in "The figures" below).
- **Deviations, each with its reason.**
  1. **Registry position.** Each entry ends its group: `button-group` after `toggle-group`, `progress` after `error-summary`, `link` after `is-mobile`. Every earlier item joined its group in place (`003`'s `status`, `004`'s `toggle`), and `registry.test.ts`, the sitemap and the Components index read the registry in group order. So the entries are not appended after `pluto-theme`.
  2. **No `tailwind-variants`.** `linkVariants` is a plain function over static class strings, and the other two items use class maps. Importing `tv` would make `tailwind-variants` a built package of each item, and test 1 asks for none (or `phosphor-svelte` alone).
  3. **`index.ts` exports the house set.** Beside decision 1's names (`Link`, `linkVariants`, `LinkStrings`), each `index.ts` exports `Root`, `Props` and its props and variant types, as `button` and `meter` do. `button-group` exports `ButtonGroup`; `progress` exports `Progress`.
  4. **`progress` adds `border-0`.** Firefox draws a 1 px border on a `<progress>` whose appearance is off, so the bar would be 10 px tall (EXECUTED, Playwright's Firefox, 2026-11-15; Chromium and WebKit draw none). Test 48 holds 8 px in all three.
  5. **Pair files carry a `title`.** Each pair file also has its own example view, a document of its own, and axe needs it titled. `kind`, `pair`, `caption` and `breaks` are as decision 12 says.
  6. **Test 50 leaves `card`'s own edge to `031b`.** The `in-a-card` example uses Kuiper's `card`, whose hairline border is translucent. That is an existing item's rule, which decision 13 leaves to `031b`, as it does the inherited disabled opacity. Test 50 skips an element whose slot is `card`, and checks everything inside it.
  7. **Where two tests live.** Test 6 is `tests/unit/breadth.test.ts`, so `bun run test:unit` runs it; it imports `REFERENCE_PARTS` from `scripts/bench/targets.ts` and edits nothing there. Test 3 is in `registry-comments.test.ts`, as the spec directs while `023`'s test is absent.
  8. **Example links point at this site's pages.** The prerender fails on a link to a page that does not exist, so every example and pair links to a real page here (or, for `new-tab`, to two outside addresses). The `inherit` example's footer is a solid `bg-muted` band, so nothing in it is translucent.
  9. **The attached example, flagged for the checkpoint.** Test 32 and decision 10 name the group "Text alignment" with Left, Center and Right. Alignment reads as a choice of state, which decision 5 gives to `toggle-group` and the `state` pair says so. The example keeps the spec's names and makes each button a one-shot action that aligns a paragraph, with nothing pressed. The design lead may rename the example at the checkpoint; tests 32 and 53 move with it.
  10. **The cost fixtures moved to `027b`** (decision 15): `025` had not landed. Criterion 17's part a moves with them.
  11. **Expectations changed outside the files this spec names** (criterion 18). Three new items move counts that earlier specs wrote as literals: 75 items to 78, 57 `registry:ui` items to 60, 81 and 103 sitemap entries to 84 and 106, 58 framed pages to 61, 72 lazy tiles to 75, 70 items naming the theme to 73, the allowed-name counts in `pluto-allowed.json`, and the lists in `tests/e2e/pages.ts` and `registry.test.ts`'s groups. `examples.test.ts` and `build-output.spec.ts` skip `do-*` and `dont-*` files, as `026` decision 22 allows. `expressive.spec.ts` exempts an attached group's children (above). No assertion was loosened beyond its count.
- **Hooks for other lanes** (none was edited):
  - Lane S: `api.server.ts` maps no `<progress>` element, so the progress page's API table ends "and the props of `HTMLProgressAttributes`". One line in its `ELEMENTS` map (`HTMLProgressAttributes: "progress"`) makes it "every attribute of `<progress>`".
  - Lane E (`022`): the four new spec files map to one item each and carry `item` and `check` annotations; the engine projects need no list of them. WebKit's forced-colours half of test 48 records a run-time annotation, "not emulated", until `022`'s engine list exists.
  - Lane E (`025`): the three fixtures and their budgets, in `027b`'s B8.
- **The checks** (2026-11-15, the machine at a load of 95 to 138 on 10 cores, from other agents' builds):
  - `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. The literal lint: 0 violations, 1 allowance (L24, as before), 359 files.
  - `bun run test:unit`: 1,276 pass and 6 fail on the full run. All 6 are timing. Five are the thumbnail-hash tests, which take 9 to 23 s under this load against a 5 s limit, and pass alone with time (10 of 10); one is `highlight-session.test.ts`'s 4 ms p95, flaky under load as the handoff records, which passes alone (10 of 10). One more failure, "each recomputed hash equals the manifest's", was real: every thumbnail's hash reads `registry.json` and `example-order.ts`, so any new item stales them all. The pictures do not change, so the manifest was rewritten with `thumbnails.ts --hash-only`, as that script provides, and the test passes.
  - Browser, the four new spec files: 540 of 540 in `chromium`, `firefox` and `webkit`, both schemes, on a scratch config with Firefox and WebKit projects (`022`'s projects do not exist yet). Test 48's forced-colours half ran in Chromium and Firefox; WebKit recorded "not emulated".
  - Browser, the full suite (`light`, `dark`): 3,178 passed, 117 skipped, 17 failed, 5 did not run. Of the 17: three were counts already corrected in the test files after the run had loaded them (the 72 lazy tiles, 58 framed pages, 76 nav links: now 75, 61, 79); one was `expressive.spec.ts`'s radius check on the button-group page (below); two were `blocks.spec.ts` A3, which forbids an all-digit build commit, and the base commit `0372323` is all digits (it passes at this build's commit, below); eleven were timeouts (the bar's glass and contrast screenshots, the editor's budget). Re-run alone on two workers, 197 passed, and the glass tests and one sentence check timed out again at 30 s; with a 240 s timeout those passed, 36 of 36.
  - `expressive.spec.ts`, criterion 3, reads every button's top-left corner on each component page and expects the house radius, exempting a button that sets its own radius. An attached group squares its children's inner corners by design (test 33), so the exemption now covers a direct child of an attached `button-group`.
  - `bun run test:smoke`: 137 pass, 2 fail on the full run; both are `dev-loop.test.ts`'s 10 s watchers under load, and pass alone (2 of 2).
  - `scripts/site/release-check.ts`: exits 0.
- **The figures.**
  - **Every page grows by about 0.85 to 0.9 kB gzipped** (EXECUTED, every file a page references, the build of `0372323` against this build): CSS +0.14 kB (33.85 → 33.99 kB: the items' utilities), shared JS +0.67 kB (the chunk that carries `registry.json` for the sitemap, search and nav), HTML +0.05 to 0.1 kB (three nav links). The Components index +1.26 kB (three tiles); the changelog +1.82 kB (three bullets).
  - **The Button page's budget, before and after the merge.** At `9395b46`, on `0372323`, it did not hold: the base was 391,684 B (382.50 kB), already over the 382 kB budget the owner ruled for `020`, and this build 392,599 B (383.40 kB). That build is superseded. **After merging `release/0.13.0` at `421cea7` (`3bc5185`)**, which brings `020a`'s CSS that reads only code (about 9 kB off every page), the budgets hold, measured by the perf project (`--no-deps`, three runs, medians): Button **374 kB of 382** (383,214 B, 374.23 kB exact; LCP 900 ms), home 301 kB of 355 (LCP 784 ms), the Components index 350 kB of 395 (LCP 2,432 ms). No budget was raised. `027a`'s own share is still about 0.9 kB on every component page, so the Button page has about 7.8 kB of headroom left; `026`'s toast will take another 0.9 kB or so. The cheapest lane-S remedy for that steady cost is to stop shipping all of `registry.json` in the shared chunk, since the client needs only names, titles, groups and descriptions.
  - The new pages: `/components/link/`, `/components/button-group/` and `/components/progress/` each render their examples and pairs, and pass axe in both schemes at 360, 768 and 1280.
- **The merge, `3bc5185`.** `release/0.13.0` at `421cea7` (`020a`, `020b`) merged in with a merge commit. The one conflict, `src/lib/site/thumbnails/manifest.json`, was regenerated by `scripts/site/thumbnails.ts` over the merged tree: all 156 pictures came out byte-identical, and only the hashes moved. Re-run after it: `bun run check` 0 errors; `bun run test:unit` 1,285 pass and 3 fail, all timing (a thumbnail-hash test, the 4 ms streaming budget, the specimen timings), each passing alone (`thumbnails.test.ts` and `css-sources.test.ts` 16 of 16 at `--timeout 60000`, `highlight-session.test.ts` 10 of 10, `highlight.test.ts` 43 of 43); the four new spec files in `light` and `dark` with `build-output.spec.ts`, 207 of 207; the perf project as above.
- **A3 at the commit.** Rebuilt at `9395b46`, `blocks.spec.ts` A3 passes in both schemes (2 of 2).
- **The scorecard** (criterion 21 a; run-log row of 2026-11-15 at `9395b46`). Row 1 reads **31 of 40, score 3, held**: `link` and `button group` hit, and `progress` matches the part `meter` holds. The criterion's 32 assumes `026`'s toast, which has not landed; with it, 32. Rows 1 to 14 total 32, unchanged. `site.ts`: Button 383 kB (was 381), LCP 1,020 ms, the part at 572 and 661, 79 nav links: rows 6, 7 and 8 hold. `kuiper.ts`: 79 entries, 60 `registry:ui`, nothing else moved. `depth.ts` was not run, since Button and Dialog did not change. Page-standard coverage rises by three pages born with described props and live pairs. Row 15 (cost) waits for `025` and `027b`'s B8.

### The owner's answers, 2026-11-15

The owner answered all seven questions with the recommended option. The design lead relayed the answers; they are recorded here and carried as rulings 5 to 11 in the header.

| Question | Answer | Where it binds |
|---|---|---|
| Q1. One build, or two? | Two builds: `027a` (link, button group, progress), then `027b` (pagination, search field, tag) | Decision 1; decisions 14 and 15; the build order; every criterion's a and b forms. `roadmap.md` rows `027a` and `027b` are final |
| Q2. An indeterminate progress bar? | Not now. A runtime `null` renders as 0 | Decision 8 |
| Q3. Visited links? | Opt-in, in the text colour | Decision 7; test 46 |
| Q4. A link that opens a new tab? | Served, opt-in: an icon, visually hidden text and a merged `rel` | Decision 7; test 45 |
| Q5. Pagination at the ends? | Omitted, with the slot kept; focus moves as decision 3 says | Decision 3; tests 16 and 18 |
| Q6. Does the search field speak its count? | Yes, built in, through `results` and `resultsFor`, for the current query only | Decision 4; tests 29 and 29a; S1, S2 and S4 |
| Q7. Focus after a tag is removed? | The next tag control, then the previous | Decision 6; test 38; T1 and T2 |

The questions as they were asked, recommended option first:

**Q1. One build, or two?**
1. **Two: `027a` (link, button group, progress, about 170 lines) and `027b` (pagination, search field, tag, about 600 lines).**
   - Part a has no live region, focus move or overlay, so it needs nothing from `022` and can land early in wave 1. Its cost fixtures wait for `025`, or move to part b (decision 15).
   - Part b holds all the focus and speech logic, and waits for `022`'s suite.
   - Their folders are disjoint, so they can run at once on two builders.
   - Each criterion has a form per part.
   - Row 1 reaches 4 only with part b.
   - The roadmap's provisional rows `027a` and `027b` stand: `028` depends on both, and `037` and `042` on `027b`. `027b` depends on `020`, `022`, `025` and `026`.
2. **One build,** as the roadmap first listed it, in one row `027`. One checkpoint, one review and one landing. The whole waits for `022`, `025` and `026` before its screen-reader and cost criteria can pass.

**Q2. Does the progress bar get an indeterminate form?**
1. **Not now.** `spinner` serves an unknown wait. `039`, the motion specification, adds an indeterminate sweep with its keyframe and its reduced-motion rule. Meanwhile a `null` from untyped code renders as 0, so no engine's own indeterminate animation appears (decision 8).
2. Now, with a keyframe added to the theme after `021` lands (lane T), and a static fill under reduced motion.
3. Now, as Radix does: a bar that fakes growth over a set time. It tells the person something untrue.

**Q3. Visited links.**
1. **Opt-in, in the text colour** (`visited`). No new token. Off by default, as Carbon. Proven by its compiled rule (test 46).
2. On by default, as GOV.UK, which needs a visited colour token.
3. No visited state.

**Q4. A link that opens a new tab.**
1. **Served, opt-in and honest:** an icon, a visually hidden "(opens in a new tab)", and `rel="noopener noreferrer"`, merged with the app's `rel`.
2. The same, with the words visible, as GOV.UK asks.
3. Not served, as Primer advises: no `newTab` prop.

**Q5. Pagination at the ends.**
1. **Omitted, with the slot kept,** as GOV.UK. If the pressed control goes, focus moves to the current page, or, when narrow, to the other end control (decision 3).
2. Shown but unavailable (`aria-disabled`, focusable), as Carbon disables them. Nothing moves, but the stop does nothing.

**Q6. Does the search field speak its result count?**
1. **Yes, built in,** through `results` and `resultsFor`: once typing pauses and the count for what is typed now is here (Primer's rule).
2. No: the field stays silent, and the page shows an app's own `Status`. The item leaves `022`'s set for speech, and stays in it for focus.

**Q7. Where does focus go after a tag is removed?**
1. **The next tag control, then the previous,** so the reading order continues. Counted among tag controls only, so mixed groups work (decision 6).
2. The previous control, then the next, as Primer does.
