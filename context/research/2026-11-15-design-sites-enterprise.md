# Four enterprise design-system sites, side by side with Pluto's

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the owner's request. The owner says the big sites are "way above ours right now".
- **Question:** What, by craft, makes IBM Carbon, Google Material 3, Adobe Spectrum and the Atlassian Design System feel above Pluto's design site? What should Pluto change first?
- **What would answer it:** the same page types captured on each live site and on Pluto, at 1440 × 900 and 390 × 844; computed type and layout sizes; a close look at each page's anatomy.
- **Builds on:** [`2026-11-14-the-design-site.md`](./2026-11-14-the-design-site.md) §3, which surveyed these sites' structure. The `2026-11-15-prior-art-*.md` memos read their source; this one reads their live pages.
- **What it blocks:** nothing. It informs whichever specification next touches the site's chrome and templates (`015`, `017`).

## In short

- **They let you see the whole system from any page.** Carbon, Atlassian and Spectrum keep a tree of every page on the left: 99 to 137 links. Pluto's component page shows only its own group's siblings, in the right rail. Its phone menu holds four links.
- **Their page headers carry facts and pictures.** A status, a date, tabs, a framework switch, an illustration. Pluto's header is a title and a grey summary, the same on every page.
- **They draw where Pluto tabulates.** Pluto's Type foundation is four tables and no specimen. Its component index is 75 rows of text. Atlassian and Material show each component as a picture.
- **They show a living system.** Carbon dates every page. Atlassian gives each component a changelog tab and asks "Was this page helpful?". Material ends pages with previous and next. Pluto knows these facts but shows none.
- **Pluto already leads in places.** Every example is live and switches theme on its own. The code shown is the file that runs. The API table is generated. The Brand colour page is the boldest colour page in the set. Its code is the most legible.
- **Ranked gaps** are at the end. First: a side tree, a deeper phone menu, specimens on Foundations, header facts with previous and next, and a fix to the glass bar.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** run and seen in this research, on 2026-11-15, on macOS (Darwin 25.5.0, arm64), with Bun 1.4.4, driving the Chromium of the repository's pinned Playwright. Sizes are computed styles read in the page.
- **READ:** seen in a screenshot or a page's text, cited by path.
- **INFERRED:** our reasoning from the two.

**Terms.**

- **Measure:** the width of a text column. **CPL:** characters per line, a paragraph's characters over its rendered lines.
- **Tree:** a side navigation listing every page, in groups that open and close. **Rail:** the right-hand "on this page" column.
- **Playground:** an example whose props are set by controls, its code rewritten to match.

Pluto's terms (door, landing, leaf, field, frame) are `015`'s.

## 1. What was captured

Screenshots are in [`2026-11-15-design-sites/`](./2026-11-15-design-sites/), named `<site>-<page>-<width>-<theme>.png`. A `-full` name is the whole page, cut at 9,000 px.

| Site | Shots | Notes (EXECUTED) |
|---|---|---|
| Carbon | 18 | No dark site: a dark system sets `data-theme="dark"` but paints nothing different, so dark shots were dropped. Its URLs moved under `/building-blocks/…` since 2026-11-14. |
| Material 3 | 20 | The page scrolls inside an element; whole-page shots grew the window to fit it. |
| Spectrum | 20 | Spectrum 2 is the live site (`s2.` redirects to it). It has no component index; `/platforms/rsp`, in its sitemap, returns "Not found". |
| Atlassian | 22 | Full light and dark. |
| Pluto | 2 new | `pluto-type-…`, `pluto-foundations-colour-…`. The rest of the shared `pluto-` set existed and was left alone. |

All four rendered headless. Cookie banners were hidden, never accepted. Each site took 25 to 30 loads. Shots over 150 KB were cut to 256 colours, except Spectrum's two soft-shadow shots.

## 2. Side by side, measured

All at 1440 px, light, on a component or leaf page (EXECUTED).

| | Carbon | Material 3 | Spectrum | Atlassian | Pluto |
|---|---|---|---|---|---|
| Reading face | IBM Plex Sans | Google Sans Text | Adobe Clean Spectrum VF | Atlassian Sans | Geist |
| Display face | IBM Plex **Serif**, weight 300 | Google Sans, 475 | same as reading, 600 | same as reading, 700 | IBM Plex Sans, 600 |
| Page title | 53.6 / 62.8 | 96 / 96 | 40 / 48 | 40 / 44 (component), 48 / 52 (foundation) | 56 / 58.8 (leaf), 86.4 (landing) |
| Section heading (h2) | 32 / 40, weight 400 | 57 / 64 | 28 / 33.6 | 24 / 28 | 28 / 33.6 |
| Sub-heading (h3) | 21.9 / 30.6 | 28 / 36 | 18 / 21.6 | 20 / 24 | **16 / 25.6 Geist** on component pages; 18 / 28 Plex on Foundations colour |
| Body | 16 / 24 | 16 / 24 | 16 / 24 | **14 / 20** | 16 / 24 |
| Prose measure | 525 px | 760 px | 515–643 px | 756 px | 690 px (`max-w-prose`) |
| CPL, range (median) | 54–70 (62) | 60–82 | 60–90 (77) | 82–108 (92) | 56–95 (78) |
| Second size (nav, meta) | 14 | 14–16 | 14 | 14 (rail 12) | **13.5** |
| Left navigation | tree, 256 px, fixed, 116 links, 32 px rows | icon rail, 88 px, 7 links | icon rail 56 px plus a floating tree card 264 px, 137 links | tree, 350 px, sticky, 99–106 links, 32 px rows | **none** |
| Right rail | 247 px | 156 px | 352 px, with "Copy markdown" | 184 px, 12 px links, two levels | 256 px, sections plus the group's siblings |
| Top bar | 48 px, opaque white | none (the rail holds search, theme, pause) | 104 px, transparent | 71 px, white at 85% | 72 px floating glass, 8 px from the top |
| Code | Plex Mono 12 / 16 | none shown | monospace 12 / 19.2, 24 px radius | Atlassian Mono 12.3 | JetBrains Mono 13.5 / 21.6 |
| Focus ring | 1 px inset blue ring (a box shadow) | 2 px inset | 2 px solid blue | 2 px solid blue | 2 px solid primary blue |
| Hover transition | 110 ms | 200–300 ms, an emphasised curve, shapes morph | 200 ms transform | 150 ms, its own curve | 200 ms, Tailwind's default curve |

What the table says (INFERRED):

- **Pluto's body type, focus ring and motion are at parity.**
- **Its heading ladder has a hole.** On a component page h2 is 28 and h3 is 16, the body size. Every reference puts a step of 18 to 28 between them. Pluto also sets h3 two ways on two templates.
- **`max-w-prose` is not 65 characters.** `015` decision 5 says body text "keeps to `max-w-prose` (65 characters)". `ch` is the width of a zero, and Geist's average letter is narrower. The measured median is 78, with lines up to 95. Carbon, the tightest, holds near 62.
- **13.5 px is a size none of them use.** It is Pluto's most common size on a component page (515 elements on Button, mostly code and the rail).
- **Pluto's code is the most readable here.** It is 1.5 px larger than the others' code, with 1.6 leading.

## 3. Site by site

### 3.1 Carbon

![Carbon Button](./2026-11-15-design-sites/carbon-button-1440-light.png)

- **Typography.** A light serif title over a sans body gives the page a voice without colour (READ, `carbon-type-1440-light.png`). Prose holds about 62 CPL, the best measure here (EXECUTED).
- **Layout.** A fixed 256 px tree, a white header panel, then a grey body with a 247 px rail. The header panel is tall: on Button the first content, a note, starts at 790 px (READ, `carbon-button-1440-light.png`).
- **Navigation.** Four top groups, three levels deep. The current page has a grey fill and a 3 px blue bar. A "Find" field filters the tree. On a phone the tree slides in whole, filter included (READ, `carbon-menu-390-light.png`).
- **Component anatomy.** Four tabs: Guidelines, Specifications, Code, Accessibility. The header carries a "Stable" tag, "Last updated Oct 15, 2026", a framework picker, GitHub and Storybook. On scroll the header condenses to a short band holding the title, the tabs and the links (READ, `carbon-code-1440-light.png`). Guidelines carry numbered anatomy figures and do/don't pictures (READ, `carbon-button-full-1440-light.png`).
- **Examples.** One live demo per component, with a theme picker (White, Gray 10, Gray 90, Gray 100) and a variant picker. Everything else is an image (READ, `carbon-code-1440-light.png`).
- **Search.** The header icon opens a field. Results come after Enter, on a page: title, description, and a breadcrumb path (READ, `carbon-search-1440-light.png`).
- **Foundations.** Colour opens with a video, a palette strip, and the layering model drawn twice, light and dark. A Tokens tab switches its table between the four themes (READ, `carbon-colour-full-1440-light.png`, `carbon-colour-tokens-1440-light.png`). The components overview has an "Accessibility status" tab (READ, `carbon-components-1440-light.png`).

### 3.2 Material 3

![Material Buttons](./2026-11-15-design-sites/material-button-1440-light.png)

- **Typography and layout.** A 96 px title in a card beside a bespoke art card (READ, `material-type-1440-light.png`). No tree: an 88 px rail of seven sections, sticky pill tabs, a 760 px column.
- **Navigation.** The phone drawer lists the sections, each with an arrow that opens its pages (READ, `material-menu-390-light.png`). Every page ends with two cards, "Previous" and "Up next" (READ, `material-button-full-1440-light.png`).
- **Component anatomy.** Tabs: Overview, Specs, Guidelines, Accessibility. Overview ends in a table of platforms, each with a status chip.
- **Examples.** Pictures and animations only. No code on the component pages (EXECUTED). A pause control for animations sits in the rail.
- **Search.** A full-width overlay that completes the query as you type, the typed part dark and the rest grey, grouped by section (READ, `material-search-1440-light.png`).
- **Foundations.** Colour is pictures plus a dated "What's new" list: May 2025, Aug 2024 (READ, `material-colour-full-1440-light.png`).

### 3.3 Spectrum

![Spectrum Button](./2026-11-15-design-sites/spectrum-button-1440-light.png)

- **Layout.** The tree sits on a floating white card with a soft shadow beside a 56 px icon rail. The content is another card. The page reads as layered paper (READ, `spectrum-home-1440-light.png`, `spectrum-colour-1440-light.png`).
- **Navigation.** Each group shows its count, "Components 61". The current page gets a black tick. Breadcrumbs sit above the title. On a phone the tree card docks at the bottom of the screen (READ, `spectrum-menu-390-light.png`).
- **Component anatomy.** One scroll. A playground first, then Anatomy, Component options (the props), a States table marking each state "Supported" or "Not supported", Behaviors, Usage, Content standards, Internationalization, Accessibility. A "Code available" chip, plus "Copy markdown" and "Go to RSP" in the rail (READ, `spectrum-button-full-1440-light.png`).
- **Examples.** The playground sets each prop with a select, a switch or a field. The code below rewrites itself, with "Copy code" (READ, `spectrum-code-1440-light.png`). The first live example starts at 466 px (READ).
- **Search.** The header field expands in place. A dropdown counts results, tags each with its platform, and prints its keys: Enter to select, arrows to move (READ, `spectrum-search-1440-light.png`).
- **Foundations.** Each page opens with a frosted-glass illustration; tokens are taught in prose.

### 3.4 Atlassian

![Atlassian Button](./2026-11-15-design-sites/atlassian-button-1440-light.png)

- **Typography and layout.** A 14 px body, the densest here at 92 CPL. A 350 px tree, a 980 px column, a 184 px rail.
- **Navigation.** The tree carries status lozenges ("Caution") beside its entries. The current page is tinted blue with a bar (READ, `atlassian-button-1440-light.png`). The phone menu is the whole tree (READ, `atlassian-menu-390-light.png`).
- **Component anatomy.** Tabs: Examples, Code, Usage, Changelog. Usage holds a numbered parts figure and do/don't pairs (READ, `atlassian-button-usage-1440-light.png`). Every page ends "Was this page helpful? Yes / No" (READ, `atlassian-colour-full-1440-light.png`).
- **Examples.** Many live examples, each on a checkerboard canvas with a toolbar: "Styles", "Copy code", "Edit in code sandbox". Code is open by default (READ, `atlassian-code-1440-light.png`). In the dark site the example canvas stays light (READ, `atlassian-button-1440-dark.png`).
- **Search.** A modal. Results are grouped by section under a coloured letter tile, titled as paths ("Button / Filter button"), with matched words in bold, a status lozenge, and a key legend: arrows, Enter, Esc (READ, `atlassian-search-1440-light.png`).
- **Foundations.** Colour shows its ramps as drawings, neutral ramps light and dark side by side, a role table with coloured chips, and diagrams of how a token name is built (READ, `atlassian-colour-full-1440-light.png`).

## 4. Where Pluto already leads

- **Every example is live in either theme.** Each frame has its own Light/Dark switch (READ, `pluto-button-1440-light.png`). Carbon has one live demo per component, Material none. Atlassian's examples stay light in a dark page.
- **The code shown is the code run.** The first example's code is open, the rest say "Show code, 10 lines" (READ, `pluto-button-full-1440-light.png`). Only Atlassian matches it.
- **A generated API table, "Files you own" and "Related".** None of the four lists what an install writes into an app.
- **The Brand colour page.** Four full-bleed fields, each a poster word, with values and contrast on glass (READ, `pluto-brand-colour-full-1440-light.png`). Nothing in the four is this confident about its own colour.

## 5. What makes them feel "way above"

Named from the side-by-sides (INFERRED from the shots cited).

1. **You can see the whole system from any page.** Compare `atlassian-button-1440-light.png` with `pluto-button-1440-light.png`. Atlassian's tree shows every component and its status. Pluto shows five siblings, on the right, below "On this page".
2. **The phone menu has depth.** `carbon-menu-390-light.png` and `atlassian-menu-390-light.png` show the tree. `material-menu-390-light.png` drills into sections. `pluto-phone-nav-390-light.png` shows four door names on a white sheet that fills the screen.
3. **The page header works.** Carbon's says how stable the component is and when it last changed. Material's and Spectrum's carry art. Pluto's leaf header is the same title, grey line and canvas on every page (`pluto-type-1440-light.png`).
4. **Pictures.** Atlassian's index draws each component as a small grey figure (`atlassian-components-1440-light.png`). Material shows the components themselves. Pluto's index is 75 text rows under a red band (`pluto-components-1440-light.png`).
5. **Specimens, not tables.** Pluto's Type page explains three faces in a table set in Geist. The faces are never shown in themselves, and the text scale is never shown at size (READ, `src/routes/(site)/foundations/type/+page.svelte`).
6. **Signs of a living system.** Dates, statuses, changelogs per component, feedback, previous and next. Pluto has `since`, but not "changed in", not a date, no feedback and no previous or next.
7. **One visible flaw.** Pluto's glass bar lets an example's buttons show through behind the lockup as it scrolls under: "Save changes" sits behind "pluto" (READ, `pluto-copy-1440-light.png`). The four use an opaque or near-opaque bar.

## 6. Gaps for Pluto, ranked by visible impact over cost

Each names the file to change, what the reference does in our words, and a proposal. Nothing here changes a registry item. Sizes come from tokens or Tailwind's scale, as `015` decision 5 requires.

1. **A side tree on component and leaf pages.**
   - **Where:** `src/lib/site/page/component.svelte` and `src/lib/site/page/leaf.svelte` (their grids); a new `src/lib/site/chrome/side-nav.svelte`, fed by `src/lib/site/sitemap.ts`.
   - **The reference:** Carbon and Atlassian keep every page in a left tree, 256–350 px, with 32 px rows and a filter.
   - **Proposal:** from `lg`, a 240 px left column listing the current door's pages, grouped as the landing groups them. Mark the current page with weight and a 2 px bar in `foreground` (never the door's colour, per `015` decision 5). Move "In Actions" out of the rail into the tree; the rail keeps "On this page". Reuse the Components filter's field and logic.
2. **A phone menu with depth.**
   - **Where:** `src/lib/site/chrome/bar.svelte` (its sheet).
   - **The reference:** Material's drawer opens each section; Carbon and Atlassian show the whole tree.
   - **Proposal:** the sheet lists the four doors as disclosures. The current door is open, showing its pages from `sitemap.ts`; Components shows its eleven groups. Put the search button and the theme toggle at the sheet's foot, as Material does.
3. **Foundations drawn as specimens.**
   - **Where:** `src/routes/(site)/foundations/type/+page.svelte`, `src/routes/(site)/foundations/colour/+page.svelte`.
   - **The reference:** Atlassian draws its ramps and token names. Carbon draws light and dark side by side.
   - **Proposal:** on Type, set each family's name in its own face, and print a sample line at every `text-*` step and every display step beside its numbers. `src/lib/site/brand/ladder-figure.svelte` may serve. On Colour, give each role a swatch of 48 px or more, light and dark side by side, with its contrast on the swatch.
4. **Facts in the page header, and previous and next at the foot.**
   - **Where:** `src/lib/site/page/facts.svelte`, `src/lib/site/changelog.ts`, `src/lib/site/page/component.svelte`, `src/lib/site/page/leaf.svelte`.
   - **The reference:** Carbon's status tag and "Last updated"; Atlassian's changelog tab; Material's previous and next cards.
   - **Proposal:** add "Changed in 0.x.y" with its release date, from the changelog, beside "Since". Mark an item new in this release with a `badge`. End every leaf and component page with previous and next links in `sitemap.ts` order.
5. **Fix the bar over scrolling content.**
   - **Where:** `src/lib/site/chrome/bar.svelte`, `src/lib/site/site.css`.
   - **The reference:** Carbon's bar is opaque white; Atlassian's is white at 85%.
   - **Proposal:** once the page scrolls, make the bar's ground opaque enough that nothing behind it competes with the lockup. Measure it as `015` measured the bar's text, over the busiest example frame.
6. **The component index as pictures.**
   - **Where:** `src/routes/(site)/components/+page.svelte`, `src/lib/site/page/landing.svelte`.
   - **The reference:** Atlassian's card per component with a small drawing; Material's live component thumbnails.
   - **Proposal:** a grid view beside today's rows. Each card shows the item's first example, rendered at prerender, scaled and `inert`. Pluto's examples are files, so its thumbnails are real, where Atlassian's are drawings. Hold it to `015`'s performance budget (decision 23).
7. **Search finish.**
   - **Where:** `src/lib/site/chrome/search-palette.svelte`.
   - **The reference:** Atlassian groups results by section, bolds matched words and prints a key legend. Spectrum prints its keys too.
   - **Proposal:** group results under each door's name and dot. Wrap matched text in `<mark>`. Add a footer legend (arrows, Enter, Esc) with the `kbd` item. Show the group as the title's path, for example "Components / Feedback / Alert dialog", rather than a word in the description.
8. **A header that shows something.**
   - **Where:** `src/lib/site/page/leaf.svelte`; the figures in `src/lib/site/brand/`.
   - **The reference:** every reference's foundation pages open with art.
   - **Proposal:** an optional `figure` slot right of the leaf title, filled from the system's own figures: the ladder on Type, a swatch strip on Colour, the mark on The mark. No stock art. A quiet page stays quiet: the figure is drawn in roles, not fields.
9. **A heading step and a true measure.**
   - **Where:** `src/lib/site/page/component.svelte` (its `heading` snippet and its h3s), `src/lib/site/page/leaf.svelte`, `tokens/pluto.tokens.json`.
   - **The reference:** every reference puts 18–22 px between h2 and body. Carbon holds about 62 CPL.
   - **Proposal:** one h3 everywhere, IBM Plex Sans 600 at `text-xl` (20 px). Narrow body prose to `max-w-xl` (576 px). By the measured average letter that is about 65 CPL, the figure `015` meant. Review the 13.5 px secondary size against 14. A token change needs its own specification.
10. **"Copy page" and "Was this helpful?".**
    - **Where:** `src/lib/site/chrome/rail.svelte`.
    - **The reference:** Spectrum's "Copy markdown" in the rail; Atlassian's yes/no at the foot.
    - **Proposal:** the Markdown twin exists (`015` decision 19); put "Copy page as Markdown" in the rail. Feedback needs somewhere to go, which a static site lacks; ask the owner, with a GitHub discussion link, as Carbon has, recommended.
11. **A props playground, for a few items.**
    - **Where:** `src/lib/site/page/frame.svelte`, `src/lib/site/api.server.ts`.
    - **The reference:** Spectrum's playground: a select per union prop, a switch per boolean, the code rewritten as you go.
    - **Proposal:** for items whose API table holds only unions, booleans and strings (button, badge, switch), generate the controls from the table and print the call they make. The most work here, and the strongest page feature in the set.

## 7. Limits

- The capture scripts lived in the session scratchpad, not the repository.
- CPL samples the first three paragraphs of 160 characters or more, so short pages give few samples.
- Pluto was read on the dev server at `localhost:5199`, after networkidle.
