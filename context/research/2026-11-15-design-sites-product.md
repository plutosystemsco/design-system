# Four design-system sites, page by page, against Pluto's

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request, for the owner. The owner says the big sites are "way above ours right now".
- **Question:** What, exactly, makes GitHub Primer, Shopify Polaris, the GOV.UK Design System and Apple's Human Interface Guidelines look and read better than Pluto's design site? Which gaps should Pluto close first?
- **What would answer it:** screenshots of the same eight page types on each site and on Pluto, at a desktop and a phone width; computed type and layout sizes; a close reading of how each page is built and written.
- **What it blocks:** nothing. It informs whichever specification next touches the site's templates (`015`, `017`).

`2026-11-14-the-design-site.md` §3 surveyed these sites' structure; this memo looks at craft. The same-day `2026-11-15-prior-art-*.md` memos read the source repositories; this one reads the live pages.

## In short

- **The four sites are not better designed, screen for screen, than Pluto's best pages.** Pluto's home and its Brand colour page hold their own (`pluto-home-1440-light.png`, `pluto-brand-colour-full-1440-light.png`). The gap is elsewhere.
- **They show more, and they show it first.** Every reference page has a picture, a live specimen or a pictured do and don't. Most Pluto leaf pages are text only. A component page opens on an install card, and the first live example sits below the fold on a phone.
- **They go deeper per component.** Primer's Button runs to three tabs. GOV.UK's Error message page runs to about 1,250 words (EXECUTED). Pluto's Button has one paragraph and six bullets of usage.
- **They never leave you lost.** All four keep a section tree on every leaf page, and on the phone. Pluto's phone menu lists four words.
- **They show signs of life.** Dated change logs, research notes, feedback links, status per platform. Pluto shows "Since 0.2.0".
- **Pluto carries tells of an unfinished site:** a literal `<account>` in every install command, a copy button drawn over a command, and API tables whose "What it does" column is mostly empty.
- **The ranked gaps are in §8.**

## How to read this memo

Every claim carries a label.

- **EXECUTED:** captured or measured in this research on 2026-11-15, with Bun 1.4.4 driving the Chromium of the repository's Playwright 1.64.1, on macOS. Widths 1440 × 900 (scale 1) and 390 × 844 (scale 2, touch). Reduced motion was on. Computed styles were read from the first long paragraph and the first headings in `<main>`.
- **READ:** a page or a file says so. Pluto files are this working tree on `release/0.12.0` at `0ebd728`, with uncommitted `017` work.
- **INFERRED:** reasoning from the above.

**Shots** are in `context/research/2026-11-15-design-sites/`, named `<site>-<page>[-full]-<width>-<theme>.png`. A `-full` shot is the whole page, cut at 9,000 px. Some `pluto-` shots were made by other agents sharing the folder; this memo uses them as found.

**Terms.** A **leaf** is any page below a section's landing. A **rail** is the right-hand "On this page" column. A **specimen** is a live rendering of a component. A **do-and-don't pair** is two side-by-side figures, one right and one wrong.

## 1. What was captured

| Site | Pages used | Shots | Notes (EXECUTED) |
|---|---|---|---|
| Primer | `primer.style`, `/product/components/…`, `/product/getting-started/…`, `/accessibility/` | 25 | Ignores the system's dark setting. Dark appears only after the header toggle, then persists. |
| Polaris | `shopify.dev/docs/api/polaris`, `…/app-home/latest/web-components/…`, `/docs/apps/design/…`, `/docs/apps/build/accessibility` | 22 | `polaris.shopify.com` and `polaris-react.shopify.com` both redirect to `shopify.dev/docs/api/polaris`. Follows the system's dark setting. |
| GOV.UK | `design-system.service.gov.uk` | 21 | No dark theme. Analytics cookies were rejected. |
| Apple HIG | `developer.apple.com/design/human-interface-guidelines` | 24 | Never reaches network idle; capture waited for `load`. Follows the system's dark setting. |
| Pluto | `localhost:5199` | 17 new, others reused | Dev server. |

No site blocked headless browsing. None needed a sign-in. Polaris's licence restricts reuse, so Polaris is described in principle only.

## 2. Measured type and layout (EXECUTED)

| Site | Body on a leaf | H1 on a leaf | H2 | Text column | Columns at 1440 |
|---|---|---|---|---|---|
| Primer | Mona Sans 16/24 (18/27 on guides) | 40/48, weight 460 | 24–28, 600–700 | 728 px | left nav 300 · content · rail |
| Polaris | Inter 14/20 on components, 16/24 on guides | 32/40, 600 | 24/28, 600 | 742–810 px | floating left nav 284 · content · rail |
| GOV.UK | GDS Transport 19/25 | 48/50, 700 | 36/40, 700 | 720 px | left nav 290 · content |
| Apple | SF Pro Text 17/25 | 48/52, 700 | 32/36, 700 | 740 px | left nav 200 · content · rail |
| Pluto | Geist 16/24, lede 18/28 | Plex Sans 56/59, 600 | 28/34, 600 | 690 px (leaf), 864 (component) | content · rail; no left nav |

- GOV.UK sets the largest body of the set, 19 px, and its pages read the most easily (`govuk-error-message-full-1440-light.png`).
- Apple's lede under the H1 is one large sentence; a component's whole definition fits in it ("A button initiates an instantaneous action.", `apple-button-1440-light.png`).
- Pluto's H1 to H2 step is 2.0×; GOV.UK's is 1.33× and Apple's 1.5×. Pluto's section heads read small under a poster-sized title (INFERRED).
- Pluto's component index sets every description at 13.5 px (`pluto-components-1440-light.png`).

## 3. GitHub Primer

- **Typography.** One family, Mona Sans, at weights 440–700. H2s carry a hairline rule.
- **Layout.** Three columns at 1440: a sectioned left nav with its own search, the content, and a deep rail that lists every example by name (`primer-button-1440-light.png`).
- **Navigation.** The phone sheet holds the top sections and the whole section tree, with the search field (`primer-phone-nav-390-light.png`). The home page is two cards: build, or create for the brand (`primer-home-1440-light.png`).
- **Component anatomy** (`primer-button-full-1440-light.png`):
  - Tabs: Overview, Guidelines, Accessibility.
  - Status cards per implementation, React, Rails and Figma, each "Ready" with its links.
  - Twelve named examples. Each has a live preview, Copy, Reset and Open in StackBlitz, and code folded behind "Show full code". A props table closes the page.
  - Guidelines: an anatomy figure with labelled parts, then pictured do-and-don't pairs with green and red tags (`primer-button-guidelines-full-1440-light.png`).
  - Accessibility: built-in features, implementation requirements, then **how to test the component**, split into integration tests and component tests (`primer-button-a11y-full-1440-light.png`).
- **Writing.** The content page states voice as four contrasts (clear but not cold, and so on), then a "Top 10 rules" list for the hurried reader, then topic guidance with do-and-don't text pairs: dates, error messages, labels, links (`primer-content-full-1440-light.png`). READ.
- **Accessibility.** A section of its own: a card hub, then checklists, tools, and design topics such as focus management and alt text (`primer-accessibility-1440-light.png`).
- **Search.** Scoped per section ("Search Product UI"). Results show the path, the title and the summary, with each match highlighted, and a count (`primer-search-1440-light.png`).
- **Polish.** "Give feedback" sits in the header on every page. The status pill per platform.

## 4. Shopify Polaris (ideas in principle only)

- **Typography.** Inter, small and dense: 14 px body on component pages. A reference tool, not a reading room.
- **Layout.** The left nav floats as a panel, with a version switcher at its top. The current page's own sections nest under it in the tree (`polaris-button-1440-light.png`).
- **Navigation.** Polaris is one product inside Shopify's developer portal. The phone sheet shows the whole portal (`polaris-phone-nav-390-light.png`). Design guidance lives apart, under Apps › Design (`polaris-visual-1440-light.png`).
- **Component anatomy** (`polaris-button-full-1440-light.png`, `polaris-modal-1440-light.png`):
  - A two-sentence description beside a box of named **use cases**.
  - A **live preview with a property panel**: change a field, and the preview and its code change.
  - Reference, then examples (preview beside code), best practices and limitations.
  - Page tools: copy the page as Markdown, ask an assistant about this page.
- **Writing.** The Messages and feedback page puts text left and a figure right. Each kind of message, from success to critical, gets pictured pairs captioned with the rule (`polaris-content-full-1440-light.png`).
- **Accessibility.** One long page by topic: testing tools, principles, keyboard, page structure, media, colour, dynamic content, touch. It warns that following it does not guarantee an accessible app (`polaris-accessibility-1440-light.png`).
- **Search.** Command-K opens a portal-wide palette with tabs per surface, a version picker, a breadcrumb per result and a key hint footer (`polaris-search-1440-light.png`).
- **Polish.** In dark, the specimen stays light, because the admin it imitates is light (`polaris-button-1440-dark.png`).

## 5. GOV.UK Design System

- **Typography.** The largest and plainest: 19 px body, bold 48 and 36 px heads. Every link underlined.
- **Layout.** Two columns, no rail. The left nav lists every sibling, and the current page expands to its sub-pages (`govuk-button-1440-light.png`).
- **Navigation.** On a phone the search box stays in the header, always visible. "Menu" opens the six sections as expandable rows (`govuk-phone-nav-390-light.png`, `govuk-button-390-light.png`).
- **Component anatomy** (`govuk-button-full-1440-light.png`, `govuk-date-input-1440-light.png`):
  1. The example, first, in a resizable frame, with "Open this example in a new tab" and HTML and Nunjucks tabs.
  2. When to use, when not to use, how it works.
  3. Variants, each a sentence of when, then its example.
  4. **Research on this component**: what testing showed.
  5. **Recent changes**: a dated table, with a link to the full history.
  6. **Help improve this page**: the GitHub discussion for the component. Then "Need help?" with a contact.
- **Examples use real content.** "When was your passport issued?" with "For example, 27 3 2007", not a placeholder.
- **Writing.** Every sentence is an instruction. The Error message page lists words to avoid ("forbidden", "please", "sorry", "valid"), pairs labels with their messages, and ends "Read the message out loud" (`govuk-error-message-full-1440-light.png`). READ.
- **Accessibility.** The landing is thin (`govuk-accessibility-full-1440-light.png`). Its one strong line: using the system does not by itself make a service accessible. The weight sits in each component's page.
- **Search.** An accessible autocomplete in the header. Each result names its section: "Dates, in Patterns" (`govuk-search-1440-light.png`).
- **Polish.** The yellow focus ring; a dated "What's new" on the home page (`govuk-home-1440-light.png`).

## 6. Apple Human Interface Guidelines

- **Typography.** SF Pro, 17/25 body; bold heads; a large one-sentence lede.
- **Layout.** Centred, about 1,000 px wide with a narrow left tree, a 740 px column and a rail headed by **supported platforms** icons (`apple-button-1440-light.png`).
- **Colour per collection.** Every page in a collection opens on a large figure in that collection's colour: green fundamentals, yellow foundations, red components (`apple-home-1440-light.png`, `apple-components-1440-light.png`). Component figures are drawn with dimension lines. Each is redrawn for dark (`apple-button-1440-dark.png`). INFERRED: this is Pluto's four doors, carried onto every leaf.
- **Navigation.** The phone navigator is the full tree, with the filter, current page highlighted (`apple-phone-nav-390-light.png`).
- **Component anatomy** (`apple-button-full-1440-light.png`, `apple-sheets-1440-light.png`): figure; overview; anatomy; best practices; then style, content and role; platform considerations; resources; and a **dated change log** on every page.
- **Writing.** The best prose of the four. Each paragraph opens on a bold rule, so a skim reads the rules alone. Paired screens show a tone shift (`apple-writing-full-1440-light.png`).
- **Accessibility.** Organised by people: vision, hearing, mobility, speech, cognitive. Each has an icon banner, **tables of minimums per platform** (text size, control size, contrast), and wrong-and-right figure pairs marked ✕ and ✓ (`apple-accessibility-full-1440-light.png`).
- **Search.** The left "Filter" prunes the tree in place and highlights the match (`apple-search-1440-light.png`).
- **Polish.** A Light, Dark, Auto switch in the footer.

## 7. Pluto, set beside them

What Pluto does well, and should keep (from the shots):

- The home page's poster type and four doors are more distinctive than any reference home (`pluto-home-1440-light.png`).
- The Brand colour page, four full-bleed bands with measured contrast, is the single best page in this study (`pluto-brand-colour-full-1440-light.png`).
- Light and dark per example frame, install from two sources, and "Files you own" have no equal on the four sites (`pluto-button-1440-light.png`).
- The Foundations accessibility page is honest about what is not checked (`pluto-foundations-accessibility-full-1440-light.png`).

Why the others still feel "way above" (INFERRED from the side-by-sides):

1. **Pictures.** The voice page, the accessibility page and the Start landing have no figure at all (`pluto-brand-voice-full-1440-light.png`, `pluto-start-full-1440-light.png`). The component index is a ruled text list of 75 rows (`pluto-components-full-1440-light.png`). Primer, Polaris and Apple show a picture on every card.
2. **The first screen.** On Pluto's Button page at 1440, the install card fills the first screen and the first specimen starts near y = 800. At 390, the Examples heading sits at y = 779, so no specimen shows (`pluto-button-390-light.png`). GOV.UK's example starts at y = 290; Apple's figure at 284 (EXECUTED).
3. **The lede.** Pluto's Button lede is a specification: "the surface's one blue primary, a bordered secondary, ghost, destructive or link, at 48 or 32 px…". At 390 it wraps to four lines. Apple's is eight words.
4. **Specimen sheets, not scenes.** Pluto's examples repeat "Save changes" in a grid (`pluto-button-full-1440-light.png`). GOV.UK's examples are real questions. Pluto's Dialog example shows two trigger buttons in a large empty frame (`pluto-dialog-1440-light.png`).
5. **Depth.** Button's usage is one paragraph and three text dos and don'ts (READ, `src/routes/(site)/components/button/+page.svelte`). No anatomy, pictured pair, test steps or research.
6. **Wayfinding.** Leaves have no left nav. The phone sheet lists the four doors and nothing else (`pluto-phone-nav-390-light.png`). INFERRED: going from Button to Dialog on a phone takes a door, a scroll down 75 rows, then the row.
7. **Width used.** Brand leaves have no rail. At 1440 the 690 px column leaves about 470 px of empty canvas on the right (`pluto-brand-voice-full-1440-light.png`).
8. **Unfinished tells** (EXECUTED):
   - `<account>` appears literally in every install command (`pluto-home-1440-light.png`, `pluto-start-full-1440-light.png`).
   - On Install, the copy button is drawn over the first command's text (`pluto-start-install-1440-light.png`).
   - Dialog's API has ten tables; most rows have an empty "What it does" (`pluto-dialog-full-1440-light.png`).
9. **Search noise.** The palette matches a summary by substring (READ, `src/lib/site/search.ts`, line 15). "dia" returns Item, Highlighter and Is mobile, through "media" and "Meridian" (`pluto-search-1440-light.png`). No match is highlighted.
10. **No signs of life per page.** No dated changes, no research, no feedback link on any component page.

## 8. Gaps for Pluto

Ranked by visible impact over cost. Each names the page and file, what the reference does in our words, and a proposal. None is a decision; each would go through a specification.

1. **Remove the unfinished tells.** *Pages:* home, Start, Install, every component. *Files:* `src/lib/site/page/snippet.svelte` and `command.svelte` (the overlap); `src/lib/site/page/api-table.svelte`; the site origin in `src/lib/site/site.ts`. *Reference:* none of the four shows a placeholder or an empty cell. *Proposal:* reserve the copy button's width inside the code block's padding, so text cannot run under it. Hide the "What it does" column when a table has no descriptions, and fill descriptions from each prop's doc comment where they exist. Ask the owner for `<account>`, or show the command with a named variable and one line saying where its value comes from. *Cost:* small.

2. **Put a picture on every component card.** *Page:* `/components/`. *File:* `src/routes/(site)/components/+page.svelte`. *Reference:* Primer, Polaris and Apple show a small rendering or a drawn figure above each name. *Proposal:* a card grid, each card holding a thumbnail of the item's first example in light, generated at build from its `/view/…` page by the repository's Playwright, served as an image with fixed dimensions. Keep the filter and the group headings. Measure the page against `015` decision 23's budgets. *Cost:* medium.

3. **Show the thing first on a component page.** *Pages:* all 75. *Files:* `src/lib/site/page/component.svelte`, `facts.svelte`. *Reference:* GOV.UK opens on the example; Apple on a figure and an eight-word definition. *Proposal:* order the header as title, a one-sentence plain definition, then the first example frame, then the install and facts as a slim strip. Keep the registry description as the second paragraph. Add a short `summary` to each page's props so the lede is written, not generated. *Cost:* small to medium (75 sentences to write).

4. **A section tree on leaves and on the phone.** *Pages:* every leaf; the phone menu. *Files:* `src/lib/site/chrome/bar.svelte` (the sheet), `src/lib/site/page/leaf.svelte`, `component.svelte`, `src/lib/site/sitemap.ts`. *Reference:* all four keep the current section's tree in view, and the phone menu holds it too, with a filter (Primer, Apple). *Proposal:* the phone sheet opens with the current door expanded, its pages and groups listed from `sitemap.ts`, and the other three doors below. On desktop leaves, the rail's "In Actions" list grows into the whole door's tree for Components and Foundations. *Cost:* medium.

5. **Pictured do and don't, and an anatomy figure.** *Pages:* component pages, starting with the ten most used. *Files:* `src/lib/site/page/usage.svelte`, the item pages under `src/routes/(site)/components/`. *Reference:* Primer, Polaris and Apple pair a right and a wrong figure, each with a one-line caption. Primer and Apple label a component's parts. *Proposal:* let each Do and Don't take an optional small live example file, as examples already are (`015` decision 13), rendered side by side in productive mode. Draw an anatomy figure to measure, as `017` decision 3 already does for the brand. Write examples as real scenes, not repeated labels. *Cost:* medium to large; it is mostly writing.

6. **Changes, and a way to say something.** *Pages:* every component and leaf. *Files:* `src/lib/site/page/component.svelte`, `src/lib/site/changelog.ts`. *Reference:* GOV.UK ends each component with a dated "Recent changes" table and a "Help improve this page" link. Apple ends every page with a dated change log. *Proposal:* a "Changes" section generated from `CHANGELOG.md` entries that name the item, newest three shown. Then one line: suggest a change on GitHub, with the page's path filled in. *Cost:* small to medium.

7. **Accessibility guidance a builder can act on.** *Pages:* `/foundations/accessibility/` and each component's Accessibility section. *Files:* `src/routes/(site)/foundations/accessibility/+page.svelte`, `src/lib/site/page/component.svelte`. *Reference:* Primer gives each component "how to test", as steps. Apple sorts guidance by people (vision, hearing, mobility, cognition) and gives tables of minimum sizes and contrast. GOV.UK says plainly what the system cannot do for you. *Proposal:* add "Your part" to the Foundations page (what an app must still do), a table of minimums read from the token file (target heights, contrast pairs), and on each component a short "Test it" list: keys to press, and what a screen reader should announce. *Cost:* medium.

8. **Voice with specimens.** *Page:* `/brand/voice/`. *File:* `src/routes/(site)/brand/voice/+page.svelte`. *Reference:* GOV.UK lists words to avoid and pairs labels with messages; Primer leads with a short list for the hurried; Apple shows two screens in two tones. *Proposal:* render each of the five rules as a before and after built from Pluto's own Alert, Empty and Button, and add a short list of words Pluto does not use. Use the empty right column at 1440 for the specimens. *Cost:* medium.

9. **Search that finds what was meant.** *Files:* `src/lib/site/search.ts`, `src/lib/site/chrome/search-palette.svelte`. *Reference:* Primer highlights each match and shows its path; GOV.UK names the section of each result. *Proposal:* match the summary at word starts, not inside words; highlight the matched text; add anchor entries for each component's Usage and Accessibility, through `015` decision 18's hook. *Cost:* small.

10. **A figure in the door's colour on every leaf.** *Files:* `src/lib/site/page/leaf.svelte`, `src/lib/site/brand/page.svelte`. *Reference:* Apple opens every page on a measured figure in its collection's colour. *Proposal:* a figure slot atop Start, Brand and Foundations leaves, in the door's field. It meets `015` decision 5 (quiet pages carry no field), so it is a question for the design lead. *Cost:* large.

## Sources

Live pages, read and captured on 2026-11-15. The exact URLs are in §1 and in each shot's name.

- Primer: [primer.style](https://primer.style/), including Button's [guidelines](https://primer.style/product/components/button/guidelines/) and [accessibility](https://primer.style/product/components/button/accessibility/) tabs and [Content](https://primer.style/product/getting-started/foundations/content/).
- Polaris: [shopify.dev/docs/api/polaris](https://shopify.dev/docs/api/polaris), [web components](https://shopify.dev/docs/api/app-home/latest/web-components), [app design guidelines](https://shopify.dev/docs/apps/design).
- GOV.UK: [design-system.service.gov.uk](https://design-system.service.gov.uk/), including [Error message](https://design-system.service.gov.uk/components/error-message/).
- Apple: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), including [Writing](https://developer.apple.com/design/human-interface-guidelines/writing) and [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility).

Local: the files named in §8; `src/lib/site/search.ts`; `src/routes/(site)/components/button/+page.svelte`; `015` decisions 5, 10, 13, 17, 18 and 23; `017` decision 3.
