# 018 — Site polish: a map on every page, the part first, and the details finished

- **Status:** built, awaiting its change review (2026-11-15). Was a draft, revised after its specification review ([`../reviews/018-site-polish-spec-2026-11-15.md`](../reviews/018-site-polish-spec-2026-11-15.md); 6 Medium, 10 Low, each answered under "Review").
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** changes to the design site only:
  - a left navigation on every page but home, and a phone menu with depth;
  - the component page reordered so the part comes first;
  - an "Updated" fact on every component page, and a "Suggest a change" link on every page;
  - previous and next, "Copy page" and "View as Markdown";
  - search that matches at word starts, highlights, groups and acts;
  - the type finished: the measure, one heading step, smoothing;
  - the glass bar made opaque on productive pages once they scroll;
  - a changelog page that scans;
  - the Foundations Type and Colour pages as specimens;
  - a picture of every component on the Components index;
  - forced-colours checks for every new surface;
  - tests, and one sentence in the 0.12.0 changelog entry.

  **No registry item, token or theme changes. `static/r/` is unchanged.**
- **Depends on:** [`015`](./015-the-design-site.md) and [`017`](./017-the-design-site-start-brand-and-foundations.md), committed to `release/0.12.0` (`017` at `4c5c782`). Also the follow-up commit that `decisions.md` names: `kbd` on the code ground, dark `type` `#A8C0D8`, and the site's address. This build starts on that commit.
- **Ships with:** 0.12.0. The order before the tag is the follow-up commit, then `018`, then `019` (the `error-summary` fix), then the tag (`decisions.md`, "Four calls from the site-polish synthesis").
- **Research it stands on:** [`../research/2026-11-15-site-polish-synthesis.md`](../research/2026-11-15-site-polish-synthesis.md), and the memos it merges:
  - `2026-11-15-design-sites-{product,developer,enterprise}.md`, with their shots in [`../research/2026-11-15-design-sites/`](../research/2026-11-15-design-sites/);
  - the eight `2026-11-15-prior-art-*.md`.
- **Design calls** in `../decisions.md`, all of 2026-11-15:
  - "Every page but home has a left navigation";
  - "No status mark, and items gain prop doc comments";
  - "Four calls from the site-polish synthesis", with its "Updated" ruling;
  - "Accessibility status, a high-contrast scheme, and scoped schemes", for what this specification leaves room for and does not build.

  Also `015`'s and `017`'s rulings, as amended at their checkpoints, and the writing and furniture rules R23 and R24.
- **Figures** marked EXECUTED were measured by the design lead on 2026-11-15:
  - against a build of `4c5c782`, made in a scratch folder outside the repository and served gzipped;
  - with Bun 1.4.4 and the repository's pinned Playwright 1.64.1 (Chromium);
  - under `015` decision 23's profile where a budget is concerned.

  Figures marked EXECUTED (review) are the reviewer's. Nothing in the repository was changed to take any of them.

## Intent

The owner, beside the reference sites: "One clear thing we need is a left navigation bar when not on the home page."

Three teardowns found the same gap. The reference sites are not better designed screen for screen than Pluto's best pages. But they do three things Pluto's site does not:

- they put the part first;
- they keep a map of the whole system on every page;
- they finish the small details.

The site is not yet published, so its first public version should carry these.

This specification polishes what `015` and `017` built. It adds no section, no item and no colour. After it lands:

- a reader moves from any page to any other in its section in one click, on a desktop or a phone;
- a component page shows a working example within the first screen;
- every component page says when it was last updated;
- every page says how to suggest a change;
- search finds what was meant;
- the Components index shows every part as a picture.

**Terms of art** are `015`'s and `017`'s: door, landing, leaf, field, band, frame, twin. Also:

- The **left navigation**, or **nav**, is the column at the left of every page but home that lists the current door's pages.
- **CPL** is characters per line: a paragraph's characters divided by its rendered lines.
- A **thumbnail** is a small committed image of a component's first example.
- **Stale** describes a thumbnail whose sources have changed since it was made.

**Not here**, each with where it goes (per the synthesis):

- prop doc comments, live do-and-don't examples, anatomy figures, keyboard tables and realistic example scenes: a component-depth specification after the tag;
- the accessibility status, high contrast, and the forced-colours pass over registry items: one specification, first in 0.13.0;
- the `error-summary` fix: `019`;
- not scheduled:
  - the home page's live parts;
  - search hits inside page sections;
  - a short install command;
  - a 14 px `text-sm`;
  - line numbers and file tabs in frames;
  - a props playground;
  - the changelog grouped by kind.

## Decisions

### 1. A left navigation on every page but home, from `sitemap.ts`

The owner's decision, specified.

- **What it lists.** The current door's pages, in one order that every consumer reads: `navOrder(door)`, in `src/lib/site/sitemap.ts`.
  - **Start:** the landing, then the five guides, in `sitemap.ts` order.
  - **Components:** the landing, then the 75 pages under their 11 groups, in `GROUPS` order, each group in registry order.
  - **Brand:** the landing, then the nine pages.
  - **Foundations:** the landing, then the seven pages.
  - **The changelog** has no door. Its nav lists the four landings and the changelog.
  - **The 404** has no nav. It is not a page in `sitemap.ts`.
- **The current page** is marked three ways:
  - `aria-current="page"`;
  - weight 600;
  - a `border-inline-start` of `--focus-width` (2 px) in `--foreground`.

  The mark is a border, not a background or a `box-shadow`, so it shows in forced colours too (decision 15). It is never the door's colour (`015` decision 5).
- **The Components filter.** On a Components page other than the landing, the nav opens with a "Filter components" field. It narrows the links as the reader types, hides any group with no match, and announces the count in a polite live region. On `/components/` the nav has no filter: the landing's own filter, over its tiles, is the page's one filter (decision 13).
- **Group labels** are text with `id`s that their lists name (`aria-labelledby`). They are not headings, so the page's heading outline does not change.
- **Landmarks.** The nav is a `nav` element labelled "<Door> pages" ("Components pages", or "Site pages" on the changelog). Every `nav` on a page has a distinct label:

  | `nav` | Label |
  |---|---|
  | the bar's | "Site" |
  | the breadcrumb | "Where this page is" (amended after the change review: the Breadcrumb and Sidebar pages show a breadcrumb example named "Breadcrumb") |
  | the left nav | "<Door> pages" |
  | previous and next | "Pages before and after" |

  The rail stays an `aside` named "On this page". The footer's groups keep their names.
- **Order in the page.** The nav comes in the DOM after the bar and before `<main>`, matching the visual order (WCAG 1.3.2, 2.4.3). "Skip to content" bypasses it (2.4.1). On a component page that is about 77 tab stops; the filter, the nav's first stop, shortcuts them.
- **Placement at `lg` (1024 px) and wider:**
  - a sticky column at the start, `var(--container-3xs)` (256 px) wide, below the bar;
  - it scrolls inside itself, up to the viewport's height less the bar's room;
  - on load it sets **its own `scrollTop`** so the current link is inside its box. It never calls `scrollIntoView`, which would also scroll the window.
- **On a landing,** the band stays full-bleed at the top, and the nav begins beside the landing's content, below the band.
- **On a Brand page,** from `lg`, a full-bleed slot (a band, as on Colour) runs from the content column's start edge to the viewport's end edge. So it never runs under the nav.
  - Below `lg` it is full-bleed, as today.
  - The owner's ruling puts the nav on every page but home, so there is no fallback that hides it.
  - The design lead judges the look at checkpoint 1. A different geometry needs a ruling recorded in `decisions.md`, and criterion 22 then follows it.
- **Below `lg`,** the nav is not shown; it moves into the menu (decision 2).
- **The right rail** keeps "On this page" only, and shows from `xl` (1280 px). Below `xl`, "On this page" is the disclosure under the title; today that disclosure shows only below `lg`. The rail's "In <group>" list is removed, since the nav replaces it.
- **The Markdown twin** skips the nav (`data-md="skip"`).
- _Why `lg` for the nav and `xl` for the rail:_ at 1440, a 256 px nav and a 256 px rail leave 720 px for content. At 1024 both would leave about 400 px, too narrow for a frame. So the rail gives way first.
- **Its cost** is decision 14's.

### 2. The phone menu, with depth

The bar's sheet. Today it holds four door names (`pluto-phone-nav-390-light.png`).

- **Below `md` (768 px)** the sheet holds a `nav` labelled "All pages":
  - the four doors, each a `collapsible` disclosure with its dot and name, and the changelog as a link;
  - the current door open, listing its pages as decision 1's nav does;
  - in Components, its 11 groups, each a disclosure, with the current group open;
  - the current page marked as in decision 1.
- **A door's disclosure is a button, not a link.** It has `aria-expanded` and controls its list. The door's landing is the first link inside the list. So a reader who presses "Components" opens the list and does not leave the page.
- **From `md` to `lg`,** the bar shows the door links. The menu button then opens the current door's pages alone, in a `nav` labelled "<Door> pages", and the button is named "<Door> pages". On the home page and the 404, which have no door, the button is not shown there.
- **Following a link closes the sheet.**
- **Search and the theme toggle stay in the bar at every width,** so the sheet does not repeat them.

### 3. The part comes first on a component page

Today the first example frame starts below the first screen at both widths (EXECUTED):

| Page | At 1440 × 900 | At 390 × 844 |
|---|---|---|
| Button | y = 764 | y = 1011 |
| Dialog | y = 807 | y = 1047 |
| Alert | y = 736 | y = 1004 |

Above it sit the title, the description, the "On this page" disclosure, and the facts card. The card's install tabs wrap the command to two or three lines.

- **The new order:**
  1. the breadcrumb;
  2. the title, still `type-section`;
  3. the registry's description;
  4. **the facts line**;
  5. **the page tools** (decision 6);
  6. "On this page" (below `xl`);
  7. **Examples**;
  8. **Install**;
  9. Usage, API, Accessibility, Files you own, Related.
- **The facts line** is a single `dl` row in `text-sm`: Since, Updated (decision 4), Modes, and Based on where the item has `meta.stock`. It keeps room for one more entry, the accessibility status, which a later specification adds without a layout change.
- **Install** is a section of its own, after Examples. It holds:
  - today's two install tabs;
  - the block note;
  - the one SvelteKit 2 line, which leaves the frames (decision 7).

  "Install" joins `SECTIONS` and the rail.
- **Target:** on every component page with an example frame, the first frame starts above y = 450 at 1440 × 900, and above y = 844 at 390 × 844. On a block or composition page the same holds for the viewer.
- **The title keeps its size.** With the facts card moved, the order alone puts the frame near y = 400 at 1440 (INFERRED from today's offsets). The brand's display step on the title stays.
- This amends `015` decision 10's section order.

### 4. "Updated", on every component page

The owner's ruling: "Just have Updated X.Y.Z so it is the same for everything" (`decisions.md`, under "Four calls from the site-polish synthesis").

The facts line holds one **"Updated 0.x.y"** entry on every one of the 75 component pages. It has the same label everywhere, and it is a link to that release's anchor on `/changelog/` (`#v0-12-0`). "Since" stays as it is.

- **The version** is the newest release whose `CHANGELOG.md` entry has a bullet whose head names the item. The head is the text before the bullet's first colon, holding the item's name as a code span. If no bullet names the item, the version is its `meta.since`, the release it arrived in.
- **Measured** (EXECUTED, a parse of `CHANGELOG.md` against `registry.json`):
  - 73 of 75 items are named at a bullet's head;
  - `name-strip` and `cta-band` are named only inside 0.11.0's group bullet, so they take their `since`, 0.11.0;
  - for 52 items the version equals `since`, so the item has not changed since it arrived. For 23 it is later.
- **Examples:**

  | Item | Since | Updated | Why |
  |---|---|---|---|
  | `pluto-theme` | 0.1.0 | 0.12.0 | changed |
  | `button` | 0.2.0 | 0.11.0 | changed |
  | `tooltip` | 0.2.0 | 0.2.0 | never changed: the release it arrived in |
  | `name-strip` | 0.11.0 | 0.11.0 | no bullet head names it: its `since` |
- **When `019` lands,** `error-summary` reads 0.12.0 by the same rule, with no hand edit.
- **It is computed at prerender,** in `component-data.server.ts`, with `changelog.ts`'s parser, and it is in the Markdown twin.
- This amends 2026-11-14's "a changelog page only".

### 5. "Suggest a change", on every page

The owner's ruling. One link, **"Suggest a change on GitHub"**, in the footer, so it is on every page the site serves, the 404 included.

- **Where it goes:** `https://github.com/plutosystemsco/design-system/issues/new`, with two query parameters (READ, [GitHub Docs, creating an issue from a URL query](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query), 2026-11-15):
  - `title`: "Suggestion: <page title>";
  - `body`: "Page: <`SITE_ORIGIN`><path>", then a blank line.

  Issues are enabled on the repository (the coordinator, 2026-11-15). Criterion 23 checks the link once more, after the deploy.
- **The path** is read in the browser on the 404, since its address is unknown, and from the route everywhere else.
- **There are no per-component discussions** (the owner's ruling).
- _Why the footer:_ one place makes it every page's. The footer sits outside `<main>`, so the twins do not carry it.
- **The wording** names where the link goes (R23), where the ruling said "Suggest a change".

### 6. Page tools; previous and next

**The page tools** sit under the facts line on a component page, and under the summary on a leaf or Brand page. Both are `data-md="skip"`.

- **"Copy page"** is a `button`, `variant="ghost"`, `size="sm"`.
  - It writes the page's twin (`<path>index.md`) to the clipboard **without losing the click's user activation**. In the click handler it calls `navigator.clipboard.write([new ClipboardItem({ "text/plain": blobPromise })])`, where `blobPromise` is the twin's fetch, turned into a `text/plain` blob.
  - It also prefetches the twin on `pointerenter` and `focus`, so the promise usually resolves at once.
  - On success, its name becomes "Copied", and so does a polite live region.
  - On failure, it says "Couldn't copy. Open the Markdown instead."
- **"View as Markdown"** is a link to the twin.

Every page has had a twin since `015` decision 19, but no page pointed to it.

**Previous and next** sit at the foot of `<main>` on every leaf, component and Brand page, in a `nav` labelled "Pages before and after".

- They follow `navOrder` within the door. A page's previous is the page above it in the nav, so the first page's previous is its landing. The last page has no next.
- Each link names its page, for example "Previous: Tooltip".
- They are `data-md="skip"`.

### 7. The details left unfinished

Checked against the tree on 2026-11-15:

- **The copy button over a command: already fixed.** No code text's box meets its copy button's box (EXECUTED) on:
  - `/start/install/` (6 blocks), at 1440 and 390;
  - the Button page, at 390;
  - the home page, at 1440 and 390.

  `snippet.svelte` has a header row, and `command.svelte` pads its wrapped text clear of the button. A test keeps it so (criterion 9).
- **The literal `<account>`: already fixed** by the follow-up commit (`src/lib/site/site.ts`).
- **The SvelteKit 2 line under every frame.** Today Button shows it four times (`frame.svelte`, line 219). It leaves the frames and appears once per page, in Install (decision 3).
- **The empty "What it does" column** (the owner's ruling).
  - Of the 262 API tables on the 75 pages, 175 have no text in that column, and 262 of their 1,283 rows have some (EXECUTED).
  - A table whose column is empty in every row leaves the column out, header and cells. On a phone, its stacked rows lose the empty line too.
  - The column returns on its own when the doc comments land.

### 8. Search that finds what was meant

Today "dia" returns, in order: Dialog, Alert dialog, Item, Popover, Highlighter, Is mobile and `--scrim` (EXECUTED). The last five match inside words in their summaries ("media", "Meridian"), because `search.ts` line 15 matches a summary by substring.

- **Matching.** A summary matches only where a word starts with the query. The ranks are:
  1. a title that starts with the query;
  2. a word in the title that starts with it;
  3. an alias that starts with it;
  4. a summary word that starts with it.
- **Aliases.** An optional `aliases` list on a page entry, in `src/lib/site/search/aliases.ts`: names other systems use that this system's titles do not already match.
  - The list is exactly: `modal` (Dialog), `popup` (Popover), `loader` (Spinner), `drawer` (Sheet). (`select` for Native select was dropped at checkpoint 2: it starts a word of that title.)
  - A result matched by an alias shows "Also called <alias>".
  - No alias may start a word of any title.
  - No alias names a part this system lacks, or another item. So there is no "toast": the system has none, and Alert is not one. And no "toggle" for Switch: Toggle is its own item.
  - `search.test.ts` checks the list against a fixture copy, and each target against `SITEMAP`.
  - The index stays within `015`'s 30 kB.
- **Highlight.** The matched text in the title, the alias line and the summary is wrapped in `<mark>`. It is styled from the theme's roles, and weight 600 in every mode, so colour is not the only signal. In forced colours it takes `Mark` and `MarkText` (decision 15).
- **Groups.** Results are grouped under their door's dot and name, in the doors' order. Each group is a `role="group"` in the listbox, with a label.
  - Entries with no door ("Home", "Changelog") come last, under "Site".
  - The arrow keys move through every option, across the groups.
- **The key legend** sits at the palette's foot, set with the `kbd` item, each key with a spoken name ("Up and down arrows: move", "Enter: open", "Escape: close"). The input's `aria-describedby` points at it, so a screen reader reads the keys once. On a component result it adds the copy key, named "Command C" on macOS and "Control C" elsewhere.
- **Copy the add command.** On `keydown`, the palette checks two things: a component result is active, and nothing is selected in the field (`selectionStart === selectionEnd`). If both hold, Command-C (Control-C) does three things in the same handler:
  - calls `preventDefault()`;
  - writes that item's site install command (`addCommand(name)`) to the clipboard;
  - says "Copied the command for Button" in the live region.

  With text selected, the key copies the text, as usual.
- **The result count** stays in the live region.
- **Files:** `search.ts`, `search/types.ts`, `search/aliases.ts` (new), `search/sources/pages.ts`, `chrome/search-palette.svelte`.

### 9. Type: the measure, one heading step, smoothing

- **The measure.** `015` decision 5 meant body text at about 65 characters a line, through `max-w-prose`. But Geist runs narrower than `ch`, so the column holds too many. At today's 690 px column (EXECUTED):

  | Page | CPL |
  |---|---|
  | Button | 71 |
  | the changelog | 73 to 90 |
  | Voice | 84 |
  | Install | 74 to 99 |

  - **Prose takes a new measure,** `--site-measure: 33rem` (528 px), in `site.css`. Prose here means `p`, list items, and `dd` in running text. 33 rem is a measured value, like `doors.ts`'s ratios; Tailwind's container scale has no step there.
  - **At 528 px** the medians are Button 63.7, the changelog 67.5 and Install 60.3, inside the target of 58 to 70 (EXECUTED (review), Geist 400 at 16/1.6). At 576 px (36 rem), Button and the changelog run 70.3 and 72.7, over the target.
  - **Tables, frames, code blocks and figures** keep the full column.
- **One h3.** On component pages h2 is 28 px and h3 is 16 px Geist, the body size (EXECUTED, on Button). On Foundations, h3 is `text-lg` (18 px). Every `h3` the site sets takes one style, `site-h3`, in `site.css`:
  - IBM Plex Sans 600;
  - `text-xl` (20 px);
  - line height 1.3;
  - tracking `--tracking-section`.

  h2 stays at 28 px.
- **Smoothing.** Today `-webkit-font-smoothing` computes `auto` on every page (EXECUTED). The site's `body` takes `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`, in `@layer components`.
  - Before-and-after shots at 1440 of Button, Type and Install, in both themes, go in the landing notes.
  - Whether `pluto-theme` should carry it for apps is a later question.
- **`text-sm` stays 13.5 px.** It is a token every app receives, so moving it is a theme change, not this one.

### 10. The glass bar, on productive pages once they scroll

Today the bar's ground is the canvas at 86%, with a 16 px blur (`rgba(243, 240, 232, 0.86)`, EXECUTED). On component pages an example's buttons show through behind the lockup as they scroll under it (`pluto-copy-1440-light.png`).

- **On a productive page,** where `<main>`'s content carries `data-mode="productive"` (component pages, leaves, the changelog):
  - at the top of the page the bar is the glass, unchanged;
  - once the page has scrolled, the bar's panel carries `data-scrolled`, and its ground becomes `--glass-fallback`, the glass's own opaque token (`#FBFAF6` in light, `#221F19` in dark). Nothing behind it shows.
  - Its edge, rim and shadow stay, so it is the same floating panel.
  - Its text, `foreground` and `primary`, is already measured on that ground (`contrast.ts`, `glassFallbackRows`).
- **On an expressive page** (home, the four landings, the Brand pages), the bar keeps its glass while scrolling.
  - There, glass passing over a field is the brand's own showcase (I9; `017` decision 5's "the bar's glass passes over the bands as the page scrolls").
  - Those pages hold no example frames under the bar.
- **How it is set:**
  - `data-scrolled` comes from an `IntersectionObserver` on a sentinel at the page's top, not from a scroll listener, and only when the page's mode is productive.
  - The ground change is a utility on the panel, `data-scrolled:bg-(--glass-fallback)`, so it beats `glass`'s own background in the utilities layer.
  - It transitions over `--motion-micro`, which reads 0 under reduced motion.
- _Why the fallback token, not a new tint:_ it adds no colour, and it is already the glass's opaque form under reduced transparency and forced colours (`011` decision 8).

### 11. A changelog to scan

`CHANGELOG.md`'s format does not change. The page renders it so it can be scanned:

- **The date.** Each release's heading holds its version alone ("0.12.0"). Under it, a line of its own gives the date as written ("2026-11-07"), in a `<time>`, or "Unreleased".
- **Linked names.** In a bullet's head (decision 4), each code span that names an item becomes a link to its page. It is still set as code.
- **The mark.** A bullet's bold "**interface change.**" is shown as the `badge` item, `variant="default"`, which is its outlined variant. It reads "Interface change". The text stays in the page, so find-in-page and the twin still read it. The badge has no `outline` variant, and this specification adds none (review finding 9).
- **The rail's version list** stays.
- **Its test.** `015` criterion 22 compares the page's text with the file's. `changelog-page.test.ts` gains the two rewrites as named exceptions: a heading's " — <date>" becomes the date line, and "interface change." becomes "Interface change". Every other character must match.

### 12. Foundations as specimens

**Type** (`/foundations/type/`):

- **Families:** each face shows its name and a sample sentence set in that face, at 24 px, beside its job and its variable. The table's facts stay.
- **The text scale:** each step shows a sample line set at that step's size and leading, beside its utility, size and leading.
- **Display steps:** each step shows the word "Pluto" at the step's current size (its clamp), beside its minimum, maximum and leading. `017`'s ladder figure follows.
- Every row keeps its `data-*-row` attribute, so `017`'s checks still read it.

**Colour** (`/foundations/colour/`):

- Each role's row shows two swatches of 56 px, one light and one dark, each painted in its theme's value, with the value under it.
- A `-foreground` role's swatch shows "Aa" in that role on its paired surface (`card-foreground` on `card`, and so on), with the pair's measured ratio from `contrastTable` beside it.
- **Every swatch, the 56 px ones and today's 16 px chips (`swatch.svelte`), is data, like an image.** It carries `forced-color-adjust: none` and a 1 px border in `--border`, so it keeps its colour and its edge in forced colours (decision 15).
- The contrast tables below stay. Rows keep `data-role-row`.

Both:

- **Files:** `routes/(site)/foundations/type/+page.svelte`, `colour/+page.svelte`, `src/lib/site/foundations/` (a new `specimen.svelte`, and `swatch.svelte`).
- **No literal colour:** every swatch reads its value from the token file at prerender, as today.

### 13. A picture of every component on the index

Today the Components index is 75 rows of text (`pluto-components-full-1440-light.png`).

**The layout:**

- From `md`, each group is a grid of tiles, 2 columns at `md` and 3 from `lg` (beside the nav).
- A tile is one link. It holds a 16 : 10 thumbnail on the canvas and the item's title, with the description, modes and since below.
- Tiles are flat: a hairline edge, no shadow, the one radius.
- Below `md`, today's rows stay, each with a 96 × 60 thumbnail at its start.
- The filter, its live region and the group headings stay. The filter is the page's only one (decision 1).

**The thumbnails are committed images,** because Workers Builds is not assumed to run Chromium.

- **Which example.** "First" is the first example the page renders. One exported function, `exampleOrder(item)` in `src/lib/site/examples.ts`, gives each item's example ids in page order. Both the item's route (which passes its examples in that order) and the script read it. Blocks and compositions take their first view, from `BLOCK_VIEWS` and `COMPOSITION_VIEWS`. A test checks that each built page's first `[data-slot="frame-stage"]` (or viewer) carries the id `exampleOrder` names first. The `data-example` attribute it reads is new on the frame.
- **How they are made.** `bun scripts/site/thumbnails.ts`, using the repository's Playwright:
  1. builds the site, and serves `build/` itself;
  2. opens each component page twice, light and dark, by the browser's colour scheme;
  3. photographs the first 800 × 500 CSS px of the page's first example stage;
  4. scales the picture to 480 × 300, on the stage's own ground;
  5. encodes it as WebP at quality 0.8, in Chromium (`canvas.toBlob`);
  6. writes `src/lib/site/thumbnails/<item>-light.webp` and `-dark.webp`, and the manifest.
- **Prototype** (EXECUTED, from the example views of 56 items): 112 images, 393 kB in all, median 2.3 kB, largest 11.8 kB, in 66 s.
- **How they are served.** They are imported with `import.meta.glob(…, { query: "?url", import: "default", eager: true })`. So Vite fingerprints them under `/_app/immutable/`, and `_headers` caches them for a year.
- **Each `<img>`:**
  - has fixed `width` and `height`, so nothing shifts as it loads;
  - has `loading="lazy"` and `decoding="async"`;
  - has `alt=""`, because the tile's link is named by its title;
  - comes in two, one per scheme. The other scheme's image is `display: none` under the site's own `dark:` variant, so it is never fetched.

**Staleness.** `src/lib/site/thumbnails/manifest.json` records, per item, a SHA-256 over every source that can change the picture:

- **the example, with its imports:** the first example file, or the block's or composition's first view file. Then its local import graph, walked transitively with `node:fs`, as `examples.test.ts` already walks it for the theme module. Relative imports, `#lib/…` imports and `scripts/…` imports are followed; package imports are not.
- **the item:** every file the item and its registry dependencies list, followed through, from `registry.json`;
- **the stage:** `src/lib/site/page/frame.svelte` and `src/lib/site/site.css`, plus the block viewer's files for a block (`src/lib/preview/block-viewer.svelte` and the files it imports);
- **the theme:** `src/app.css`;
- **the fonts:** the resolved versions, in `bun.lock`, of `@fontsource-variable/geist`, `@fontsource-variable/ibm-plex-sans` and `@fontsource-variable/jetbrains-mono`;
- **the renderer:** the resolved version of `@playwright/test`, which pins its Chromium;
- **the script itself.**

`tests/unit/thumbnails.test.ts` recomputes each hash from source with `node:fs`, and fails on any item whose hash differs or whose two images are missing. Its message names each stale item and its two files, and the script to run.

- So a change to an item, its example's helpers, the frame, a token, a font, the browser or the crop cannot ship with an old picture.
- Regenerating takes the script's one to two minutes.
- **`019` regenerates every pair** (corrected after the change review). `019` changes `src/app.css`, which every item's hash reads, so all 150 images go stale and its builder runs the script and commits them. Its `error-summary` change alone would stale four items' pairs: `error-summary`, `sign-in`, `sign-up` and `settings`, which bring it.
- The test holds the hash, not the pixels: the manifest could be edited by hand to match new sources without new pictures. For committed images that is accepted.
- **A theme change regenerates nearly all of them.** 70 items bring `pluto-theme`, so a change to it stales almost every picture. That is the cost of a true picture.
- **Repository weight:** about 150 images and 400 kB, under `src/lib/site/thumbnails/`.

### 14. Budgets

Measured on `4c5c782` under `015` decision 23's profile, the medians of 3 runs (EXECUTED):

| Page | Today | Budget today | Budget after `018` |
|---|---|---|---|
| `/components/button/` | 370 kB, LCP 1,028 ms | 370 kB | **380 kB** (ruled at checkpoint 1; was 375) |
| `/components/` | 318 kB, LCP 1,040 ms | 320 kB | **at most 400 kB, set at checkpoint 2** |
| `/` | 304 kB, LCP 924 ms | 355 kB | 355 kB |
| `/components/code-block/` | 343 kB, LCP 1,056 ms | 360 kB | 360 kB |
| `/brand/colour/` | 291 kB, LCP 880 ms | 347 kB | 347 kB |

LCP and CLS budgets are unchanged, but for one: **`/components/`'s LCP is 2,988 ms, ruled at checkpoint 2** (measured 2.7 s; it was 1,138). A first-row picture is the largest paint (see the landing notes).

**Button: 370 to 375 kB,** re-derived for the nav's data as well as its HTML (review finding 15). The page is at its budget today. The additions:

| What | Cost | How it was found |
|---|---|---|
| The nav's markup: 75 links and 11 labels | 1.26 kB | EXECUTED: the built page with that markup inserted, gzipped, against the page without it |
| The nav's data | 0 kB | Already loaded. The Button page loads today a 16.3 kB chunk (gzipped) holding every registry item's title, description and group, and the 1.6 kB sitemap chunk (EXECUTED: `EGTzZcUv.js` and `D13jAz4W.js` in the build, both referenced by `components/button/index.html`). The nav and the phone sheet read those. |
| The nav's and the sheet's script | about 1–1.5 kB | INFERRED: two small components, no new dependency |
| The page tools, the facts line, previous and next | about 1 kB | INFERRED |
| **Total** | **about 3.5–4 kB** | |

This is a cost every component page now pays, not the Button page's own weight.

- At checkpoint 1 the builder measures Button A/B in the same tree.
- If it comes in under 373 kB, the budget tightens to the measured median plus 2 kB.
- If it is over 375 kB, the first remedy is a nav rendered on the server and not hydrated, whose filter reads the DOM. If it is still over, the design lead rules, as for `015`.

**`/components/`: 320 kB, raised to at most 400 kB.** The first screen's tiles load their thumbnails. With lazy loading, Chromium also fetches images within its look-ahead distance, which is larger on slow connections, so more than the visible tiles load (INFERRED). At the prototype's median of 2.3 kB a tile, 30 tiles would be about 70 kB. At checkpoint 2 the builder measures the page under the throttled profile, and its budget becomes the median plus 10%, at most 400 kB.

**The other budgets:**

- The home page has no nav. Its changes (search, the footer link) fit in its margin.
- 0 `.wasm` requests on every budget page still holds.

### 15. Forced colours on the site's new surfaces

The forced-colours pass over registry items waits for its own specification (first in 0.13.0). But this specification adds site CSS, and each new surface must keep its meaning when the system repaints the page (review finding 3). Under `forced-colors: active` the browser replaces author colours, so these rules hold:

| Surface | In forced colours |
|---|---|
| The nav's and the sheet's current mark | a `border-inline-start`, which forced colours paint in `CanvasText`; weight 600 too |
| The phone sheet's disclosures | the `collapsible` buttons, outlined in `ButtonText` by the system |
| The search `<mark>` | `Mark` and `MarkText`, set under `@media (forced-colors: active)`; weight 600 in every mode |
| The Colour swatches and chips | `forced-color-adjust: none`, and a 1 px border; they keep their token colour, since they are data |
| The changelog's badge | the `badge` item's border, which the system paints visible |
| The page tools | a button and a link with visible text, in system colours |
| The bar | already its opaque fallback under forced colours (`011` decision 8) |
| The tiles | their hairline edge, painted by the system |

`tests/e2e/forced-colors.spec.ts` (new) runs each of these with `forcedColors: "active"`, in the light project (criterion 21).

### 16. Tests

`003`'s pattern: each check is written first and seen failing. Following `015` decision 24:

- unit tests read source with `node:fs`;
- every check of `build/` lives in `build-output.spec.ts`;
- `bun run test`'s order (unit, then e2e after the build, then smoke) is unchanged.

| File | What changes |
|---|---|
| `tests/e2e/pages.ts` | `NAV_STOPS(door)`, read from `navOrder`. `COMPONENTS_STOPS` and the leaf walks gain the nav; `BAR_STOPS` and `HOME_STOPS` are unchanged. |
| `tests/e2e/nav.spec.ts` (new) | Decisions 1, 2 and 6, and the band geometry beside the nav. |
| `tests/e2e/forced-colors.spec.ts` (new) | Decision 15. |
| `tests/e2e/site.spec.ts` | Decisions 3, 4, 5, 7, 9, 10, 12 and 13. |
| `tests/e2e/search.spec.ts` | Decision 8, in the browser. |
| `tests/e2e/keyboard.spec.ts` | The new walks; the 34 fixtures are unchanged. |
| `tests/e2e/perf.spec.ts` | Decision 14's budgets. |
| `tests/e2e/build-output.spec.ts` | Twins hold no nav, page tools, or previous and next. Every page carries the footer link. Each first stage's `data-example` matches `exampleOrder`. |
| `tests/unit/search.test.ts` | Decision 8's matching, and the aliases against their fixture. |
| `tests/unit/changelog-page.test.ts` | Decision 11's two named rewrites. |
| `tests/unit/component-data.test.ts` (new) | Decision 4's versions. |
| `tests/unit/thumbnails.test.ts` (new) | Decision 13's staleness. |
| `tests/unit/sitemap.test.ts` | `navOrder` covers every entry of its door, each once. |

### 17. The name: the Kuiper Design System

Added during the build (`decisions.md`, "The Kuiper Design System", 2026-11-15). In 0.12.0 the system and its site take the name **Kuiper Design System**, and nothing else changes:

- `SITE_NAME` in `src/lib/site/site.ts` becomes "Kuiper Design System". So every page's title reads "<Page> | Kuiper Design System", the home page's the name alone; the header lockup's link, `llms.txt`'s heading, the twins and the footer's "Suggest a change" title follow it.
- No code identifier, registry item, file or token is renamed: the `pluto` registry, `pluto-theme`, the `pluto:` context keys and the token file keep their names until 0.13.0, which renames them with a migration guide. The header lockup's drawing and `SITE_ORIGIN` are unchanged.
- The home page's headline reads "Design / with / Kuiper" in its three lines, with no full stop,, in place of "Build / with / Pluto." (the owner, `decisions.md`, under "The Kuiper Design System").
- One line in the 0.12.0 changelog entry says so.

## Design

### Where the files go

```
src/lib/site/
  sitemap.ts                  navOrder(door)
  examples.ts                 exampleOrder(item)
  chrome/side-nav.svelte      new: the left nav (decision 1)
  chrome/bar.svelte           the sheet with depth (decision 2); data-scrolled (decision 10)
  chrome/rail.svelte          "On this page" only, from xl
  chrome/footer.svelte        "Suggest a change on GitHub" (decision 5)
  chrome/search-palette.svelte  groups, marks, legend, copy (decision 8)
  page/component.svelte       the new order; the Install section (decision 3)
  page/facts.svelte           the facts line, with Updated
  page/page-tools.svelte      new: Copy page, View as Markdown (decision 6)
  page/prev-next.svelte       new (decision 6)
  page/frame.svelte           the SvelteKit 2 line removed; data-example (decisions 7, 13)
  page/api-table.svelte       the empty column left out (decision 7)
  page/leaf.svelte, brand.svelte, landing.svelte   the nav's grid
  component-data.server.ts    updated (decision 4)
  search.ts, search/aliases.ts, search/types.ts
  site.css                    --site-measure, site-h3, smoothing, forced colours
  foundations/specimen.svelte new; foundations/swatch.svelte (decision 12)
  thumbnails/                 150 images and manifest.json (decision 13)
src/routes/(site)/changelog/+page.svelte    decision 11
src/routes/(site)/components/+page.svelte   decision 13
src/routes/(site)/foundations/{type,colour}/+page.svelte   decision 12
scripts/site/thumbnails.ts   new
```

### A component page at 1440, after

```
[bar: glass at the top; opaque once a productive page scrolls]
┌ nav: Components pages ┐  ● Components / Actions
│ Filter components     │  Button
│ Foundation            │  Starts an action…  (the registry's description)
│  …                    │  Since 0.2.0  Updated 0.11.0  Modes productive, expressive
│ Actions               │  [Copy page] View as Markdown
│ ▌Button               │  Examples
│  Tooltip              │  ┌ Variants ─────────── [Light|Dark] ┐   ← y < 450
│  …                    │  │ live example                      │
└───────────────────────┘  Install · Usage · API · …              On this page (xl)
                           Previous: Toggle group   Next: Tooltip
[footer … Suggest a change on GitHub]
```

## Scope

**In:**

- the site's chrome, templates and pages named under "Where the files go";
- the thumbnails script, its 150 images and its manifest;
- the tests of decision 16;
- one sentence in the 0.12.0 entry's site paragraph: the left navigation, the part first, "Updated", "Suggest a change", search, and pictures of every component.

**Out:**

- any registry item, token or theme change, and any change to `static/r/`;
- every deferral under the Intent's "Not here".

## Acceptance criteria

Each is a count, checked by the test or command named. Criteria 1 to 23 make `018` *built*; criterion 24 makes it *done*.

1. **Checks.**
   - `bun install --frozen-lockfile` exits 0.
   - `bun run check` reports 0 errors and 0 warnings.
   - `bun run lint` exits 0.
   - `deps.test.ts` finds no package added.
   - `bun run build:registry` leaves `static/` byte-identical.
2. **The nav's order.** `sitemap.test.ts`:
   - `navOrder` for each door lists the landing, then every entry of that door, each once: Start 6, Components 76, Brand 10, Foundations 8;
   - the changelog's list holds the four landings and the changelog.
3. **The nav, at `lg`.** `nav.spec.ts`, both projects, at 1024 and 1440:
   - on 101 of 101 pages but home (every sitemap entry but `/`), one `nav` labelled "<Door> pages" (or "Site pages") holds `navOrder`'s links, in order;
   - it comes after the bar and before `<main>` in the DOM;
   - exactly 1 link carries `aria-current="page"`, the page's own. It has weight 600 and a 2 px start border computing `--foreground`.
   - **Its own scroll, not the window's:** on `/components/settings/` at 1024 × 700, after load, `window.scrollY` is 0, and the current link lies inside the nav's box.
   - On `/components/button/`, typing "dia" in the nav's filter leaves 2 links (Dialog, Alert dialog), hides the groups without a match, and the live region reads "2 components".
   - On `/components/`, the nav has 0 filter fields, and the page has exactly 1.
   - axe's `landmark-unique` passes on every page.
   - Below 1024 the nav is not visible.
4. **The rail.** `nav.spec.ts`:
   - at 1280 and 1440, the rail holds "On this page" only, with 0 "In …" lists;
   - at 1024 there is no rail, and the "On this page" disclosure shows.
5. **The phone sheet.** `nav.spec.ts`, both projects:
   - **At 390, on Button:** "Menu" opens a `nav` labelled "All pages", with 4 door disclosures and the changelog link. Each door is a button with `aria-expanded`, not a link, and its landing is its list's first link. Components is open, with its 11 groups as disclosures; Actions is open, and Button is marked current. Following Tooltip closes the sheet and lands on `/components/tooltip/`.
   - **At 768, on Button:** the bar shows the 4 door links. The menu button is named "Components pages", and it opens a `nav` of that name holding Components' pages alone.
   - **At 768, on the home page:** there is no menu button.
   - axe finds 0 violations with the sheet open, at both widths.
6. **The part first.** `site.spec.ts`, both projects:
   - on every component page with an example frame (58), the first frame's top is under 450 px at 1440 × 900, and under 844 px at 390 × 844;
   - on the 17 block and composition pages, the same holds for the viewer;
   - `<main>`'s sections are in decision 3's order, and the rail lists Install.
7. **Updated.** `component-data.test.ts`:
   - 75 of 75 items have an "Updated" version;
   - for the 73 named at a bullet's head, it is the newest such release; `name-strip` and `cta-band` take 0.11.0;
   - **a changed item:** `pluto-theme` reads 0.12.0, and `button` 0.11.0;
   - **a never-changed item:** `tooltip` reads 0.2.0, its `since`.

   `site.spec.ts`:
   - 75 of 75 pages show exactly one "Updated <version>", with that label on every page, and 0 pages show "Changed in";
   - the link goes to `/changelog/#v<…>`, and the target exists;
   - "Since" is unchanged;
   - the 4 named items show their versions and links: `#v0-12-0`, `#v0-11-0`, `#v0-2-0` and `#v0-11-0`.
8. **Suggest a change.**
   - `build-output.spec.ts`: every built HTML page (every sitemap page, and the 404) holds exactly 1 footer link named "Suggest a change on GitHub". Its address is `https://github.com/plutosystemsco/design-system/issues/new`, with a `title` of "Suggestion: <the page's title>" and a `body` that begins with "Page: " followed by `SITE_ORIGIN` and the page's path.
   - `site.spec.ts`: the 404's body names the unknown address.
9. **The details.** `site.spec.ts`:
   - on Button, 0 frames hold the SvelteKit 2 line, and the Install section holds it once;
   - on every page, at 390 and 1440, no code text's box meets its copy button's box;
   - on the 75 pages, an API table with no description in any row has 3 columns; every other table has 4, and every row with a description shows it.
10. **Page tools, previous and next.** `nav.spec.ts`, both projects, with clipboard permissions granted:
    - on Button, "Copy page" puts the twin's exact text on the clipboard, and its name becomes "Copied";
    - it still does so with the twin's request delayed by 1 s (`page.route`), which proves the copy is written inside the click, through `ClipboardItem`;
    - "View as Markdown" resolves to the twin;
    - on every leaf, component and Brand page, previous and next follow `navOrder`, in a `nav` labelled "Pages before and after". The first page's previous is its landing, and the last page has no next.

    `build-output.spec.ts`: 0 twins hold the page tools, or previous and next.
11. **Search.**
    - `search.test.ts`:
      - "dia" returns Dialog and Alert dialog, and 0 entries matched only inside a word;
      - "modal" returns Dialog, with the alias "modal";
      - the aliases equal their fixture list of 4;
      - each alias's target is in `SITEMAP`;
      - no alias starts a word of any title;
      - the index is at most 30 kB gzipped.
    - `search.spec.ts`, both projects:
      - results sit under door groups, in the doors' order;
      - every match is in a `<mark>` of weight 600;
      - the input's `aria-describedby` names the legend, whose keys have spoken names, 3 of them, or 4 on a component result;
      - with Button active and nothing selected, Command-C (Control-C) puts Button's site install command on the clipboard, and the live region reads "Copied the command for Button";
      - with text selected, it copies the text;
      - axe finds 0 violations with results showing.
12. **The measure.** `site.spec.ts`, at 1440: on Button, Install and the changelog, the median CPL is between 58 and 70. It is read over the `p`, `li` and `dd` elements of 160 characters or more in `<main>`, outside tables, frames and code. Tables and frames keep the full column width.
13. **One h3.** `site.spec.ts`: on every page at 1440, every `h3` in `<main>` outside example frames computes IBM Plex Sans, weight 600, 20 px.
14. **Smoothing.** `site.spec.ts`: the body computes `-webkit-font-smoothing: antialiased` on every page. The before-and-after shots are in the landing notes.
15. **The bar.** `site.spec.ts`, both projects:
    - **Productive:** at the top of Button the panel's ground has alpha below 1. After scrolling 400 px it is fully opaque, and equals `--glass-fallback`.
    - **Expressive:** on `/brand/colour/`, scrolled until a band is under the bar, the panel's ground still has alpha below 1, and `data-scrolled` is absent. The same holds on `/components/` with its band under the bar.
    - Under reduced motion the change has no transition.
16. **The changelog.** `changelog-page.test.ts`:
    - every release is a heading holding its version alone, followed by its date line;
    - every item code span in a bullet's head is a link to its page;
    - every "interface change." is a `badge` of `variant="default"` reading "Interface change";
    - the text otherwise equals the file's, by decision 11's two named rewrites.

    `static/r/badge.json` is unchanged (criterion 1).
17. **Specimens.** `site.spec.ts`:
    - on Type, each family's sample computes its own face, each scale step's sample its size, and each display step's sample a size within its clamp;
    - on Colour, each role row shows 2 swatches of at least 56 px, computing the token file's light and dark values, and each `-foreground` swatch shows its ratio;
    - `017`'s token-page checks pass unchanged.
18. **Thumbnails.** `thumbnails.test.ts`:
    - 75 of 75 items have 2 images, each a WebP of 480 × 300 and at most 20 kB;
    - each recomputed hash equals the manifest's;
    - the hash's inputs include the example's transitive local imports, `frame.svelte`, `site.css`, `src/app.css`, the three font packages' locked versions and `@playwright/test`'s;
    - mutation case: changing a byte in `src/lib/site/examples/code-editor/example.ts`, which the first example imports (`./example`), in a copy of the tree, stales `code-editor`'s pair, and the message names both files.

    `build-output.spec.ts`: on 75 of 75 pages, the first stage's `data-example` (or the viewer's view) is the one `exampleOrder` names first.

    `site.spec.ts`, both projects, on `/components/`:
    - 75 tiles (rows below `md`);
    - each image has width, height, `alt=""` and `loading="lazy"`;
    - 0 requests for the other scheme's images;
    - the filter still narrows the tiles and announces the count;
    - CLS is at most 0.02.
19. **Budgets.** `perf.spec.ts`: decision 14's budgets, as set or tightened at the checkpoints, with 0 `.wasm` requests on each budget page. The landing notes record Button's A/B figures, and name the nav's data cost.
20. **Suites, walk, checkpoints.**
    - `bun run test` exits 0 on a clean clone.
    - axe finds 0 violations on every page at 360, 768 and 1280, in both projects, and no page scrolls sideways at 360 or 390 (`015` criteria 7 and 9, over the new templates).
    - The landing notes record:
      - both checkpoints' rulings;
      - the smoothing shots;
      - the development walk over every page in both themes, at 1440, 1024 and 390, with 0 page errors and 0 console errors or warnings.
21. **Forced colours.** `forced-colors.spec.ts`, with `forcedColors: "active"`:
    - **The nav and the sheet:** on Button at 1440, the nav's current link computes a non-zero `border-inline-start-width`, in a colour different from the canvas. The same holds in the sheet at 390.
    - **Search:** each `<mark>` computes a background other than the page's `Canvas`, or weight 600 (decision 8 asks both).
    - **Swatches:** on Colour, every swatch and chip computes the token file's background, and a 1 px border.
    - **The changelog badge:** it computes a visible border.
    - **The page tools:** "Copy page" and "View as Markdown" compute a text colour different from their ground.
    - **The bar:** its panel's ground is opaque.
    - axe finds 0 violations on Button, Colour and the changelog in this mode.
22. **Brand bands beside the nav.** `nav.spec.ts`, both projects, on `/brand/colour/`:
    - at 1024, 1280 and 1440, each of the 4 bands' start edge is at or after the nav's end edge, its end edge is the viewport's, and no band paints under the nav;
    - below `lg` (at 390 and 768), each band spans the viewport;
    - the design lead's ruling on the look, from checkpoint 1, is in the landing notes. A different geometry, if ruled, replaces this criterion's first line.
23. **The name** (decision 17). `site.spec.ts`: every page's title is "<Page> | Kuiper Design System" (the home page's the name alone), and the header lockup's link is named "Kuiper Design System". `build-output.spec.ts`: `llms.txt` opens "# Kuiper Design System". `registry-comments.test.ts`: the 0.12.0 entry holds the name's line. `static/r/` is unchanged (criterion 1).
24. **Done.**
    - The change is reviewed, its review is cited in the landing notes, and the change is committed to `release/0.12.0`.
    - After the deploy, the design lead opens one "Suggest a change" link and records that GitHub shows a prefilled new-issue form.
    - The tag waits for `019`.

## Build order

One builder, on the follow-up commit. Tests are written first and seen failing.

1. **The map:**
   - `navOrder`, the nav, the sheet and the rail (decisions 1 and 2);
   - the page tools, and previous and next (decision 6);
   - the footer link (decision 5);
   - the forced-colours rules for these (decision 15).

   Criteria 2 to 5, 8, 10, 21 (its nav part) and 22.
   - **Checkpoint 1.** The design lead looks at Button, Dialog, a Start guide, Foundations Type, Brand Colour (its bands beside the nav), the Components landing and the changelog. Each at 1440, 1280, 1024, 768 and 390, in both themes, with the sheet open at 390 and 768. Rulings go to `decisions.md`. The builder measures Button A/B, and its budget is set (decision 14).
2. **The page:**
   - the component order, the facts line and Install (decision 3);
   - "Updated" (decision 4);
   - the details (decision 7);
   - search (decision 8);
   - type (decision 9);
   - the bar (decision 10);
   - the changelog (decision 11).

   Criteria 6, 7, 9, 11 to 16, and 21.
3. **The pictures:**
   - the Foundations specimens (decision 12);
   - `exampleOrder`, the thumbnails script, the images, the manifest and the index (decision 13).

   Criteria 17 and 18.
   - **Checkpoint 2.** The design lead looks at the index at 1440, 768 and 390 in both themes, opens ten thumbnails beside their pages, and reads Type and Colour, also in forced colours. The builder measures `/components/`, and its budget is set.
4. **The suites, the walk, and the changelog sentence.** Criteria 1, 19 and 20.

**If time runs short,** decision 13's index grid may ship before its thumbnails' look is ruled. Nothing else is deferred.

## Risks

- **Brand bands beside the nav.** A band that runs from the content's edge, not the viewport's, may read as less bold. The owner's every-page ruling stands, so checkpoint 1 judges the look within it, and criterion 22 fixes the geometry ruled.
- **Thumbnail upkeep.** A change to `pluto-theme`, a font, the frame or Playwright stales most of the 150 images. The test names them, and the script takes one to two minutes, but it is a chore every such change now carries. `019` is its first: eight images.
- **The keyboard walks grow.** A component page gains about 77 stops (the filter and the links) before its content. "Skip to content" bypasses them. The nav stays before `<main>`, so the focus order follows what a sighted reader sees.
- **The clipboard.** "Copy page" and search's copy need the Clipboard API on a secure origin. The deployed site is HTTPS, and `localhost` counts as secure. Firefox and Safari are not checked by this release; a failure is said in words (decisions 6 and 8).

## For the owner

Nothing waits on the owner.

- **"Updated 0.x.y"** follows the owner's ruling, on all 75 pages.
- **The link reads "Suggest a change on GitHub",** which names where it goes, where the ruling said "Suggest a change". It is cheap to change back.

## Review

From [`../reviews/018-site-polish-spec-2026-11-15.md`](../reviews/018-site-polish-spec-2026-11-15.md) (6 Medium, 10 Low).

1. **Medium, the measure misses its target.** Fixed. `--site-measure` is 33 rem (528 px). There, Button reads 63.7, the changelog 67.5 and Install 60.3 (EXECUTED (review)). Criterion 12 names those three pages and reads `p`, `li` and `dd` of 160 characters or more. Voice is dropped from it, since it has no qualifying paragraph (decision 9).
2. **Medium, the thumbnail hash misses sources.** Fixed (decision 13). The hash now also covers:
   - the example's (or view's) transitive local imports;
   - the frame's and the block viewer's files, and `site.css`;
   - the three font packages' locked versions;
   - `@playwright/test`'s locked version.

   "First" is `exampleOrder(item)`, read by the route and the script alike, and checked against each built page. `019` regenerates eight images (error-summary, sign-in, sign-up and settings, in two schemes), and the test names them. Criterion 18 adds a mutation case.
3. **Medium, forced colours on the new surfaces.** Fixed (new decision 15; criterion 21):
   - the nav's mark is a `border-inline-start`;
   - `<mark>` takes `Mark` and `MarkText`, and weight 600 always;
   - swatches and chips carry `forced-color-adjust: none` and a border;
   - one Playwright group checks the nav, the sheet, search, the swatches, the badge, the page tools and the bar.
4. **Medium, "Changed in" equals "Since" on 52 pages.** Resolved by the owner's ruling: "Just have Updated X.Y.Z so it is the same for everything." Every page shows one "Updated 0.x.y": the newest release whose bullet changed the item, else the release it arrived in, linked to its entry. "Since" is unchanged. Criterion 7 tests a changed item (`pluto-theme`, `button`) and a never-changed one (`tooltip`, `name-strip`) (decision 4).
5. **Medium, the opaque bar on expressive pages.** Fixed. The bar turns opaque on scroll on productive pages only. Home, the landings and the Brand pages keep the glass over their bands. Criterion 15 checks both (decision 10).
6. **Medium, the Brand bands' fallback and test.** Fixed. The hide-the-nav fallback is struck, since it would break the owner's every-page ruling. Criterion 22 fixes the bands' edges beside the nav at 1024, 1280 and 1440 in both themes, and full-bleed below `lg`. The design lead judges the look at checkpoint 1 (decision 1).
7. **Low, ⌘C in the palette.** Taken (decision 8):
   - the legend is the input's `aria-describedby`, with spoken key names;
   - the key is handled on `keydown`, with the selection check, `preventDefault()`, and the write in the same handler.
8. **Low, 77 stops, and the landmarks.** Taken (decision 1). The nav stays before `<main>`. Every `nav` has a distinct label ("Site", "Breadcrumb", "<Door> pages", "Pages before and after", "All pages"), and criterion 3 runs `landmark-unique`.
9. **Low, no `outline` badge.** Taken. `variant="default"`, the outlined one; `badge` is untouched (decision 11; criterion 16).
10. **Low, two filters on `/components/`.** Taken. The nav omits its filter on the landing, and criterion 3 runs the "dia" check on Button.
11. **Low, the nav's scroll on load.** Taken. The nav sets its own `scrollTop` and never calls `scrollIntoView`. Criterion 3 checks that `window.scrollY` is 0 on `/components/settings/` at 1024 × 700.
12. **Low, the phone sheet's semantics.** Taken (decision 2; criterion 5):
    - a door's disclosure is a button, and its landing is the first link inside;
    - from `md` to `lg` the menu button is named "<Door> pages", and criterion 5 adds a 768 px case;
    - search and the theme stay in the bar.
13. **Low, the aliases.** Taken. The redundant ones are dropped (popover, spinner, dropdown), and so are the untrue ones ("toast" on Alert, "toggle" on Switch). The list is five aliases, tested against a fixture and against `SITEMAP` (decision 8).
14. **Low, "Copy page" after a fetch.** Taken. The click writes a `ClipboardItem` whose data is the fetch's promise, and the twin is prefetched on hover and focus. Criterion 10 tests it with the request delayed by 1 s (decision 6).
15. **Low, what the Button budget counts.** Taken. The nav's data costs nothing new: the Button page already loads every registry item's title and group, in a 16.3 kB chunk, and the sitemap (EXECUTED). The derivation is in decision 14's table, with the A/B at checkpoint 1. The first remedy if over is a nav that is not hydrated.
16. **Low, the issue link's target.** Taken. Issues are confirmed enabled (the coordinator, 2026-11-15), and criterion 23 checks one link after the deploy.

## Landing notes

### Step 1 and decisions 3 to 6, to checkpoint 1 (2026-11-15)

- **Built:** `navOrder`; the left nav (`chrome/side-nav.svelte`), in the layout's two-column grid from `lg` (a landing's band spans both columns through a subgrid); the phone sheet with depth (`chrome/all-pages.svelte`, loaded when the menu first opens) and the md–lg door sheet; the rail from `xl`, "On this page" only; the component page's new order, the facts line with "Updated" (`changelog.ts`'s `updatedIn`), the Install section with the one SvelteKit 2 line; the page tools (`copy-page.ts`, with the re-check's `writeText` fallback) and previous and next; "Suggest a change on GitHub" in the footer; `data-example` on each frame.
- **Tests first:** `sitemap.test.ts`'s `navOrder` block (3 failed), `component-data.test.ts` (failed to load), `copy-page.test.ts` (failed to load), then `nav.spec.ts`, `forced-colors.spec.ts` and the 018 blocks of `site.spec.ts` and `build-output.spec.ts`, which failed against the first build (7 of 29, then 3 of 8, among them real faults: the twins are not served by the preview server, and the 404's footer read the home page's entry).
- **Changed in 015's tests:** `FOOTER_STOPS` gains the link; `NAV_STOPS(door)` joins `COMPONENTS_STOPS`; two keyboard walks start at `main` or allow for the nav's 77 stops; `code.spec.ts` I4 finds the install line in the Install section; `examples.test.ts` checks the SvelteKit 2 line once per page, in Install (decision 7).
- **The part first:** the header is tighter (top padding, the description at `text-base`, the facts line and page tools in one wrapping row), and a block's or composition's note sits under its viewer. Button's first frame starts at y = 419 at 1440 × 900 and 487 at 390 × 844; every component page passes criterion 6.
- **A layout shift, found and fixed:** on `/components/code-block/` the facts line wrapped to two lines in the fallback font and one in Geist, so CLS was 0.089. The facts' gap is now `gap-x-4`, and component pages preload Geist's latin file. CLS 0.003.
- **The forced-colours theme switch:** axe found the pressed Light | Dark button at 1.13:1 in forced colours. It now takes `SelectedItem` and `SelectedItemText` there.
- **Budgets at checkpoint 1** (3 runs, medians): `/components/button/` **378 kB** (A: 369 kB before 018, the follow-up commit's run), LCP 992 ms, CLS 0; `/components/` 321 kB (budget 320 until checkpoint 2); `/` 306 kB; `/components/code-block/` 352 kB, CLS 0.003; `/brand/colour/` 298 kB. Button's 9 kB: the HTML +3 kB (the nav's 76 links, the facts line, the page tools, previous and next), the layout's code +2.5 kB (the nav, the door sheet, the footer link), the page tools and previous and next +2.4 kB, the rest the new chunk boundaries. The phone sheet is loaded on first open (−3 kB). The nav's data is the sitemap and registry chunks already loaded, as decision 14 found.
- **Ruled at checkpoint 1** (`decisions.md`, "018 checkpoint 1, the design lead's rulings"): the nav, the component-first page and the Brand bands beside the nav are accepted as built; **Button's budget is 380 kB** (option (a): the measured 378 plus 2), in decision 14's table and `perf.spec.ts`; the page tools take one quiet treatment, each with a leading icon, Copy page saying "Copied" in its status region; the Components filter gains a leading search icon and a placeholder; the phone "On this page" takes the site's chevron.

### Steps 2 and 3, to checkpoint 2 (2026-11-15)

- **Built:** the checkpoint 1 rulings (Button 380 kB; the page tools' one quiet treatment with leading icons, "Copied" said in the status region; a search icon and a placeholder on both Components filters; the phone "On this page" with the site's chevron); decision 7 (the empty description column left out); decision 8 (search, by a second builder on the same tree: word-start ranks, the five aliases against a fixture, marks, groups, the key legend, the copy key); decision 9 (`--site-measure: 33rem` on `p`, `li` and `dd` in `<main>`, with tables, figures, frames, code, glass and `data-wide` grids keeping the column; `site-h3`; smoothing on the body); decision 10 (the bar's `data-scrolled`, from an observer, on productive pages only); decisions 11 and 12 (the changelog page and the Foundations specimens, by a third builder: `changelogPage`, the date line, linked names, the badge; `specimen.svelte`, 56 px swatches with "Aa" and the ratio, every swatch `forced-color-adjust: none` with a hairline); decision 13 (`exampleOrder` and `firstStage` in `src/lib/site/example-order.ts`, the hash in `scripts/site/thumbnail-hash.ts`, `scripts/site/thumbnails.ts`, 150 images and the manifest, the index's tiles); decision 17, the name.
- **Deviations:**
  - `exampleOrder` lives in `src/lib/site/example-order.ts`, not `examples.ts`, which the example views load in the browser; a unit test holds each route's examples in its order.
  - The thumbnails photograph each example's stage on its component page at 1,000 px (where the stage is wider than 800 px), not the example view: the `theme` item's examples have no view. Blocks and compositions take their first view alone, at 800 × 500.
  - The pictures load through an `IntersectionObserver` (a 200 px margin), and their `src` is set then; `loading="lazy"` stays on each. Native lazy loading alone fetched most of the 75 on the throttled profile. They are imported `?no-inline`: Vite inlined the small ones into the page's script (138 kB).
  - The Type samples are `text-2xl` (28 px): the token file has no 24 px step.
  - Criterion 17's browser checks are in `tests/e2e/specimens.spec.ts`, not `site.spec.ts` (the two builders worked on the tree at once).
  - The lockup link is named "pluto, Kuiper Design System": axe's `label-content-name-mismatch` requires the visible word in the name (WCAG 2.5.3).
  - `command.svelte` takes `wrap-anywhere!`: with the site's real address the long `REGISTRY_URL=…` word set the code's min-content and ran under the copy button at 390 px.
  - The measure test counts lines by gaps of half a line, not distinct rect tops: an inline code chip sits higher than its text.
- **Measured:** CPL at 1440 (median, p, li, dd of 160+ characters): Button 65.7, Install 62.0, the changelog 61.2. Thumbnails: 150 images, 592 kB, largest 11.6 kB, in 141 s.

### Checkpoint 2 and the finish (2026-11-15)

- **Ruled at checkpoint 2** (`decisions.md`, "018 checkpoint 2, the design lead's rulings"), and done:
  - **The pictures fill their tile.** The script crops to the content's box (every painted element in the stage, or in the open overlay), centres what is painted on the stage's ground with even padding, and scales it to fill, at most 2×. No text is set below 9 px as the tile shows it (480 px shown at about 300); `text-sizes.json` records each picture's smallest shown text and `thumbnails.test.ts` holds it (written first, seen failing). `example-order.ts`'s `THUMB_STATE` photographs dialog, alert-dialog, sheet, popover and dropdown-menu open and tooltip by hover; an open overlay is fitted whole where the floor allows, else its foot (the actions) is kept, a sheet its top. The three font items show "Aa" and a line in their own face, in one box trimmed to the cap height and the baseline, so all three sit alike. The hash covers `example-order.ts` and `thumbnail-hash.ts` too. 150 images, 644 kB, in 165 s. There is no `select`, `hover-card`, `command` or `context-menu` item; `native-select` cannot be shown open.
  - **LCP on the index:** the first row (3 tiles) is a CSS background chosen by the theme's class (`.site-thumb`), loaded with the page, `aria-hidden`; the other 72 keep the observer. Measured 359 kB, LCP 2,716 ms; **the budget is 395 kB and 2,988 ms** (ruled).
  - **The bar on landings** turns opaque once the band has scrolled out from under it, and keeps its glass over the band; `site.spec.ts` checks the four landings.
  - **`select` is dropped** from the aliases (4 now); the alias test checks every title.
  - **The lockup's name** stays "pluto, Kuiper Design System" until the owner approves a Kuiper lockup.
- **The home headline** reads "Design / with / Kuiper", with no full stop (the owner). It fits with no sideways scroll at 360, 390, 768, 1,024 and 1,440 in both themes (151, 249, 332 and 432 px tall, three lines), and `doors.spec.ts`'s map check passes.
- **The changelog's site paragraph** gains decision 12's scope sentence (the left navigation, the part first, "Updated", "Suggest a change", search, pictures of every component) and the headline.

### Figures (2026-11-15)

- `bun run test`, the final full run, exit 0: unit 1,193 pass; e2e in all three projects (light, dark, perf) 2,689 passed, 11 skipped, 0 failed, in 12.2 minutes; smoke 132 pass. After the headline changed, `site`, `doors`, `axe`, `keyboard` and `build-output` in both projects: 1,279 passed.
- `check` 0 errors, 0 warnings; lint clean; the literal lint 0 violations, 1 allowance; the release check exits 0; `static/` unchanged.
- **Perf medians** (3 runs, 0 `.wasm`): `/` 307 kB, LCP 892 ms, CLS 0.005; `/components/` 354 kB, 2,700 ms, 0 (budget 395 kB, 2,988 ms); `/components/button/` 380 kB, 1,028 ms, 0 (budget 380 kB); `/components/code-block/` 354 kB, 1,072 ms, 0.003; `/brand/colour/` 302 kB, 860 ms, 0.001.
- **Button A/B:** 369 kB before 018, 378 at checkpoint 1, 380 at the end; the nav's data costs nothing new (decision 14).
- **CPL** at 1440: Button 65.7, Install 62.0, the changelog 61.2.
- **The development walk** on 5301, every page (102) at 1,440, 1,024 and 390 in both themes, 612 loads: 0 page errors, 0 console errors or warnings, 0 sideways scroll.
- **Shots**, in the build's scratchpad: the smoothing before and after (Button, Type and Install at 1440, both themes, `smooth/`); forced colours (`cp2/forced-*.png`); checkpoint 1 (`cp1/`) and 2 (`cp2/`, `cp2b/`).

### After the change review (2026-11-15)

The review is [`../reviews/018-site-polish-pr-2026-11-15.md`](../reviews/018-site-polish-pr-2026-11-15.md). Each finding, as ruled and answered:

1. **Search shows the best match first** (Medium). `groupHits` now orders the groups by their best match, then by the doors' order, so the first option, the active one, is the best. `search.test.ts` checks "colour", "type", "motion", "token" and "theme" (written first: 5 failed), and `search.spec.ts` checks that Enter opens a best match for each, and the groups' order against `groupHits`.
2. **The photographed page is in the hash** (Medium). `thumbnailInputs` now reads, for an example item, its route's files (`+page.svelte`, `+page.server.ts`, `+page.ts`) with their local imports, so an example's `data.server.ts` too; `component.svelte` and the site layout, each with its local imports; and for a view, its route group's layout. Four mutation tests (written first: 4 failed) prove that the template and the layout each stale every example item, Button's route Button alone, and `font-geist`'s `data.server.ts` `font-geist` alone. The manifest's format is unchanged; `bun scripts/site/thumbnails.ts --hash-only` rewrote the hashes, and the pictures stand.
3. **The delayed Copy page test can fail** (Low). An init script spies on `navigator.clipboard.write` and makes `writeText` throw; the test asserts one `ClipboardItem` was written within 900 ms of the click, before the 1 s twin arrived, and that `writeText` never ran.
4. **Button sits at 380 of 380** (Low). The margin is 0: the first thing 0.13.0 must win back, 2 kB or more, before any component page gains a byte (the page tools' icons, or previous and next as plain links). The budget is left as ruled.
5. **`019` regenerates every pair** (Low). Decision 13 says so: `019` changes `src/app.css`, which every hash reads; its `error-summary` change alone would stale four items' pairs. Decision 13 also says the test holds the hash, not the pixels.
6. **The index's LCP** (Low, deferred). The largest paint is a first-row picture, a CSS background found only after the stylesheet: 2.7 s, against the 2,988 ms ruled at checkpoint 2. Decision 14's table now says so. A preload from the head script, or `fetchpriority="high"`, is deferred to 0.13.0.
7. **The index without scripts** (Low). Each of the 72 lazy tiles holds its light picture in a `<noscript>`, decorative (`alt=""`); `build-output.spec.ts` counts 72, each with a `src`.
8. **The forced-colours swatch check** (Low). Each swatch carries its own `data-value`, and the check compares the computed ground with that token value, with its alpha where the token has one, and asserts an alpha above 0 and a 1 px border whose colour shows.
9. **The breadcrumb's label** (Low). Renamed "Breadcrumb", it collided on the Breadcrumb and Sidebar pages, whose examples hold a breadcrumb of that name: axe's `landmark-unique` failed there in both projects, and N5's landmark check. So the site's breadcrumb keeps "Where this page is", and decision 1's table is amended to say so, the review's other option.
10. **`013`'s E6 under load** (Low). It now polls until the editor has rendered every line (30 s), not at one moment, so a loaded machine does not fail it and skip the `perf` project.
- **Figures after the review** (the full `bun run test`, exit 0): unit 1,202 pass; e2e in all three projects 2,700 passed, 11 skipped, 0 failed, in 12.8 minutes; smoke 132 pass. `check` 0 and 0; lint clean; the literal lint 0, 1 allowance; the release check 0; `static/` unchanged. Perf medians: `/` 307 kB, 872 ms; `/components/` 355 kB, 2,768 ms; `/components/button/` 380 kB, 1,048 ms; `/components/code-block/` 354 kB, 1,080 ms; `/brand/colour/` 302 kB, 868 ms; 0 `.wasm`. The keyboard walk reads a link's name without its `<noscript>` (finding 7's markup is not text while scripts run). The manifest was rewritten with `--hash-only` after the template and breadcrumb edits joined its inputs; no picture changed.

