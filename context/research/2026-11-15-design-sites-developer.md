# Developer design-system sites, side by side with Pluto's

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the owner's request. The owner says the big sites are "way above ours right now".
- **Question:** What exactly do the developer-focused sites closest to Pluto do better, by craft, and what should Pluto's site change first?
- **What would answer it:** each site captured at 1440 × 900 and 390 × 844 in both themes, its computed styles measured, and its shots set beside Pluto's own.
- **Builds on:** [`2026-11-14-the-design-site.md`](./2026-11-14-the-design-site.md), which studied these sites' structure (§3). This memo does not repeat it. It looks at finish: type, density, code, search, dark and motion.

## In short

- **They put the thing first.** On shadcn/ui, Radix, Geist and Bits UI the first live example sits 266–400 px down the page. On Pluto's Button page it starts near 790 px, at the bottom of the first screen. A 56 px title, an 18 px lede and an install card come first (EXECUTED).
- **They give a map of every page.** All five reference sites keep a left rail of 240–290 px listing every component. Pluto has no left rail. Its right rail lists the page's sections and five neighbours (EXECUTED).
- **Their text is drawn crisper.** Vercel, shadcn and Bits UI smooth their text (`antialiased`), and Vercel tracks Geist headings in (−0.06 em at 40 px) and sets font features. Pluto sets Geist with default smoothing and no features (EXECUTED).
- **Their code chrome is finished.** It has line numbers, file tabs, a package-manager switcher, and a copy button on its own ground. On Pluto's Install page the copy icon sits over the scrolling command text (EXECUTED).
- **Their search does more than find.** shadcn groups its results, shows a key-hint footer, and lets ⌘C copy the `add` command from the palette. Radix returns sections inside pages. Pluto lists seven flat results, and four of them are noise for "dia" (EXECUTED).
- **Pluto is ahead on four things.** Each example has its own Light/Dark switch. It has generated Files you own and Related sections, Markdown twins, and a door transition. None of the references has all of these (EXECUTED, READ).
- **Ten gaps follow, ranked.** The top two are small: fix the copy-button overlap, and move the first example above the fold. The third, a left rail, costs more and changes the most.

## How to read this memo

- **EXECUTED:** run and seen on 2026-11-15. The setup was macOS (Darwin 25.5.0, arm64), Bun 1.4.4, and the repository's pinned Playwright Chromium. The live sites were captured that day. Pluto was the dev server at `localhost:5199`, on branch `release/0.12.0` with the uncommitted `017` work.
- **READ:** a source says so: a file in this repository, or a page's own text.
- **INFERRED:** reasoning from the above.

**Terms.**

- **First screen:** what 1440 × 900 shows before scrolling. **Rail:** a fixed column of links beside the content. **Tracking:** letter-spacing.
- **Frame:** Pluto's box around one example (`015`, decision 12). **Palette:** the search dialog opened by ⌘K.
- **Smoothing:** `-webkit-font-smoothing`. In Chromium on macOS, `antialiased` draws thinner, lighter strokes than `auto`.

**Shots.** 130 PNGs in [`2026-11-15-design-sites/`](./2026-11-15-design-sites/), named `<site>-<page>[-full]-<width>-<theme>.png`. A `-full` shot is the whole page, capped at 7,000 px. Other agents share the folder, and no `pluto-` file was overwritten.

Counts: Pluto 26, Geist 20, Radix 22, shadcn/ui 22, shadcn-svelte 12, Bits UI 20, Skeleton 5, Linear 3.

**Measurements.** The scripts read computed styles at 1440 px in both themes: headings, body text, rails, bars, code blocks, tables and transitions. They are kept in the session scratchpad, not in the repository.

## 1. The sites, and why these

- **Vercel Geist:** Pluto's body face, set by its makers.
- **Radix:** the root of the bits-ui and shadcn lineage.
- **shadcn/ui** and **shadcn-svelte:** Pluto's registry builds on the second, which mirrors the first; so it got fewer shots.
- **Bits UI:** the strongest Svelte site found, and the layer under Pluto's overlays. A web search found no comparison of Svelte documentation sites (READ), so the pick rests on the shots: it alone among Svelte sites has a palette with matched text, file tabs and "Copy page" (EXECUTED).
- **Skeleton:** a second Svelte pick, for its version switcher, per-example theme picker and "LLM" menu.
- **Linear brand:** the one brand-led page.

## 2. Typography

Measured at 1440 px, light theme (EXECUTED):

| | Page title | Section heading | Body | Rail text | Smoothing; features |
|---|---|---|---|---|---|
| Geist | Geist 40/48, 600, −2.4 px (−0.06 em) | 24/32, 600, −0.96 px | 16/24, `#4D4D4D` | 14 | antialiased; `calt 0, rlig, ss11` |
| shadcn/ui | Geist 30/36, 600, −0.75 px | 18.75/26.25, 600 | 15/26.25 | 12.8 | antialiased |
| Radix | Untitled Sans 35/40, 500, −0.7 px | 24/30, 500 | 16/24 | 14 | auto |
| Bits UI | Inter 48/48, 600, −0.96 px | 27/40.5, 600 | 16/28 | 14 | antialiased; `calt, rlig` |
| **Pluto** | Plex Sans 56/58.8, 600, −1.96 px | Plex 28/33.6, 600 | Geist 16/24, no tracking | 13.5 | **auto; none** |

- **How Vercel sets Geist** ([`geist-typography-full-1440-light.png`](./2026-11-15-design-sites/geist-typography-full-1440-light.png)). Tracking tightens as size grows: −0.02 em at 20 px, −0.04 at 24, −0.06 at 40 (EXECUTED). Each style is named for its job: a "Label" is one line with a tight line height that sits with icons; "Copy" is several lines with a looser one; each has "Strong" and "Subtle" forms (READ, the page).
- **How Pluto sets it.** Geist is the body face only; headings are Plex Sans by ruling (D1). `text-sm` is 13.5 px, from the token file's `type.sm` (READ, `tokens/pluto.tokens.json`). The rail, tables, frame captions and the components index use it. No features, default smoothing (EXECUTED).
- **The effect** (INFERRED, [`pluto-button-1440-light.png`](./2026-11-15-design-sites/pluto-button-1440-light.png) against [`geist-button-1440-dark.png`](./2026-11-15-design-sites/geist-button-1440-dark.png)). Pluto's small text reads heavier and slightly soft. Its 56 px title is the largest in the set on a page whose working text is 13.5 px; Geist's span is 40 to 14.

## 3. Layout, density, nav and rail

| | Top bar | Left rail | Content column | Right rail | First live example |
|---|---|---|---|---|---|
| Geist | 65 px, flat, hairline | 260 px | about 860 px | none | y ≈ 400 |
| shadcn/ui | 64 px, flat, hairline | about 260 px | 640 px | 216 px, with an ad card | y = 266 |
| Radix | about 48 px, flat | about 290 px | 730 px | 250 px | y ≈ 290 |
| Bits UI | 71 px, 75 % white, blur 12 px | 250 px | 760 px | 220 px | y ≈ 320 |
| **Pluto** | **72 px floating glass, 8 px inset (88 px of room)** | **none** | 864 px | 256 px | **y ≈ 790** |

(EXECUTED. Positions are from the bounding boxes and the shots.)

- **Every reference keeps a full index in a left rail**, so a reader moves from Button to Dialog in one click. Pluto's only rail is on the right: "On this page" and the item's group, five links (READ, `src/lib/site/chrome/rail.svelte`).
- **Pluto's bar is the loud one:** a floating rounded panel, 86 % canvas with a 16 px blur, an inset highlight and a 32 px shadow (EXECUTED). Colour smears through it: blue and red buttons under "Components" in [`pluto-copy-1440-light.png`](./2026-11-15-design-sites/pluto-copy-1440-light.png). Spec `015` chose it (decision 5), so it is noted, not ranked.
- **The components index.** Pluto's 75 rows at 13.5 px are thorough but grey ([`pluto-components-full-1440-light.png`](./2026-11-15-design-sites/pluto-components-full-1440-light.png)). shadcn lists bare names in three columns ([`shadcn-components-full-1440-light.png`](./2026-11-15-design-sites/shadcn-components-full-1440-light.png)); Radix's Playground shows every part live ([`radix-components-full-1440-light.png`](./2026-11-15-design-sites/radix-components-full-1440-light.png)). Pluto's band and filter already beat shadcn's (INFERRED).
- **Home.** shadcn, Bits UI and Skeleton fill the screen under the headline with live interface: cards, charts, forms ([`shadcn-home-1440-dark.png`](./2026-11-15-design-sites/shadcn-home-1440-dark.png), [`bits-home-1440-dark.png`](./2026-11-15-design-sites/bits-home-1440-dark.png)). Pluto's home shows type, four discs, a three-line command and link lists, and no component anywhere ([`pluto-home-full-1440-light.png`](./2026-11-15-design-sites/pluto-home-full-1440-light.png)).

## 4. Component page anatomy

- **Pluto** (READ, `src/lib/site/page/component.svelte`; [`pluto-button-full-1440-light.png`](./2026-11-15-design-sites/pluto-button-full-1440-light.png)): breadcrumb, title, lede; the facts card (install tabs, command, Since, Modes, Based on); Examples; Usage with Do and Don't; API; Accessibility; Files you own; Related.
- **shadcn:** title with "Copy Page" and previous/next arrows; a base switcher; one large preview with its code faded beneath behind "View Code"; Installation (Command or Manual, then pnpm/npm/yarn/bun); Usage; one heading per example ([`shadcn-button-1440-light.png`](./2026-11-15-design-sites/shadcn-button-1440-light.png)).
- **Geist:** a bordered card per variant with a "Show code" row at its foot; "Best practices" (when to use, behaviour, content); previous and next ([`geist-code-expanded-1440-light.png`](./2026-11-15-design-sites/geist-code-expanded-1440-light.png)).
- **Radix:** "View source", "Report an issue", "View as Markdown", "View in Playground" under the title; code always open; an API table with an ⓘ popover per prop ([`radix-button-1440-dark.png`](./2026-11-15-design-sites/radix-button-1440-dark.png)). The Dialog page adds version and size (12.83 kB), anatomy, data-attribute and keyboard tables ([`radix-dialog-full-1440-light.png`](./2026-11-15-design-sites/radix-dialog-full-1440-light.png)).
- **Bits UI:** "Copy Page", then a preview with file tabs and "Expand Code" ([`bits-code-expanded-1440-light.png`](./2026-11-15-design-sites/bits-code-expanded-1440-light.png)).
- **Where Pluto is behind** (EXECUTED unless marked):
  - _The first example is below the fold_ (§3).
  - _No "Copy page" or "View as Markdown."_ Every page has a Markdown twin (`015`, decision 19), but nothing on the page points to it (READ, `component.svelte`, `leaf.svelte`). shadcn, Radix, Bits UI and Skeleton all show one.
  - _No previous and next._ shadcn, Geist and Radix end each page with one.
  - _The API table's "What it does" column is mostly empty._ On Button, one row of eleven has text (`busy`). Spec `015` decision 14 adds no doc comments, so the empty column shows on every page. Radix fills its column through popovers.
  - _Repeated furniture._ Every frame ends with "In a SvelteKit 2 app, read `$lib` for `#lib`" (READ, `frame.svelte`, line 219). Button shows it four times.
  - _The install command wraps to two or three lines_ in the facts card and on the home page. shadcn's is one short line: `pnpm dlx shadcn@latest add button`.
- **Where Pluto is ahead:** the per-example Light/Dark switch (only Skeleton has a per-example theme picker, [`skeleton-button-1440-dark.png`](./2026-11-15-design-sites/skeleton-button-1440-dark.png)); generated Files you own and Related; Since and Based on; and a plain list of what is not checked. No reference ties these together (EXECUTED).

## 5. Code presentation

| | Face, size / line | Line numbers | File name | Copy button | Package managers |
|---|---|---|---|---|---|
| Geist | Geist Mono 13–16 / 20–24 | yes, and linkable lines; highlighted and diff lines | header with a file-type icon | its own square in the header | — |
| shadcn/ui | Geist Mono 14 / 24.5 | yes | header on file blocks | in the header | pnpm, npm, yarn, bun tabs, with a terminal glyph |
| Radix | Söhne Mono 13.3 / 22 | no | file tabs (`index.jsx`, `styles.css`) and a CSS-flavour select | in the tab row | — |
| Bits UI | JetBrains Mono 14 / 20 | no | file tabs | in the tab row | — |
| **Pluto** | JetBrains Mono 13.5 / 21.6 | **no** (the `code-block` item has them; the site's frames and snippets do not) | header on frames (`variants.svelte`); none on snippets | in the header on frames; **floating over the text on snippets** | bun only, by policy |

(EXECUTED.)

- **The copy-button overlap.** On `/start/install/` the first command is 738 px wide in a 688 px box. The button is placed absolutely at the top right with no ground of its own; `pe-12` pads the content, but the padding scrolls away. So "bun" shows through the icon (EXECUTED; READ, `src/lib/site/page/snippet.svelte`).
- **Copy feedback is the same everywhere:** the icon becomes a check. Geist also puts "Copied!" in the button's text. Pluto's button keeps "Copy code"; a live region was not checked (EXECUTED; [`pluto-copy-1440-light.png`](./2026-11-15-design-sites/pluto-copy-1440-light.png), [`geist-copy-1440-dark.png`](./2026-11-15-design-sites/geist-copy-1440-dark.png), [`shadcn-copy-1440-dark.png`](./2026-11-15-design-sites/shadcn-copy-1440-dark.png)).
- **Highlighting:** Tombaugh holds up against all of them ([`pluto-code-expanded-1440-dark.png`](./2026-11-15-design-sites/pluto-code-expanded-1440-dark.png)). No gap (INFERRED).

## 6. The command palette

- **shadcn/ui** ([`shadcn-search-1440-dark.png`](./2026-11-15-design-sites/shadcn-search-1440-dark.png)): a wide field in the bar; results grouped as "Components", then "Search Results" with matched text; a footer of keys, where ⌘C copies the highlighted part's `add` command.
- **Radix** ([`radix-search-1440-dark.png`](./2026-11-15-design-sites/radix-search-1440-dark.png)): `/` opens it; results are sections within pages, each with a breadcrumb such as "Components › Dialog › API Reference › Trigger".
- **Geist** ([`geist-search-1440-dark.png`](./2026-11-15-design-sites/geist-search-1440-dark.png)): a compact grouped list with an Esc chip. **Bits UI** ([`bits-search-1440-dark.png`](./2026-11-15-design-sites/bits-search-1440-dark.png)): matched text highlighted, a category on the right.
- **Pluto** ([`pluto-search-1440-light.png`](./2026-11-15-design-sites/pluto-search-1440-light.png)): "7 results", flat, each with title, door and a description, which is good. But for "dia", Item, Popover, Highlighter and Is mobile rank among the seven, matched inside descriptions. No groups, no key hints, no section hits (EXECUTED). The index holds pages and tokens (READ, `src/lib/site/search/sources/`).

## 7. Dark mode

| | Page | Card | Hairline | Code ground |
|---|---|---|---|---|
| Geist | `#000` | `#0A0A0A` | white 14 % | as the card |
| shadcn/ui | near `#0A0A0A` | — | white 10 % | as the page |
| Bits UI | `#0D0D0D` | 50 % grey | white 10 % | as the card |
| **Pluto** | `#16140F` | `#221F19` | canvas 10 % | `#2C2821` |

(EXECUTED.)

- Pluto's warm graphite is the owner's ruling (I5). Its three steps read as stacked browns ([`pluto-button-1440-dark.png`](./2026-11-15-design-sites/pluto-button-1440-dark.png)); the references use one or two neutral steps and let hairlines separate (INFERRED).
- Contrast is measured and passes (spec `015` decision 5). This is taste, not a defect, and is not ranked.

## 8. Motion and micro-interactions

- **Hover:** the references ease colour over 150 ms; Pluto over 200 ms. Nobody moves on press (EXECUTED).
- **Page transitions:** Pluto's door transition is the only designed one in the set (EXECUTED).
- **Code reveal:** shadcn fades a code teaser under a "View Code" pill; Geist's row flips to "Hide code"; Bits UI's "Expand Code" opens a clipped block. Pluto's `<summary>` names the line count ("Show code, 10 lines"), which none of the others does (EXECUTED).
- **Copy:** at parity (§5).

## 9. Changelog and versioning

- **shadcn/ui:** monthly dated posts, live previews of new parts with their install commands, migration commands, RSS ([`shadcn-changelog-full-1440-light.png`](./2026-11-15-design-sites/shadcn-changelog-full-1440-light.png)).
- **Radix:** a heading per version, its date, short bullets, "Upgrade guide" under majors, a version list in the rail ([`radix-changelog-1440-dark.png`](./2026-11-15-design-sites/radix-changelog-1440-dark.png)).
- **Skeleton:** a version switcher in the bar (v5.0.4).
- **Pluto** ([`pluto-changelog-1440-dark.png`](./2026-11-15-design-sites/pluto-changelog-1440-dark.png)): each release opens with paragraphs of up to 150 words, then a bullet per item. The date sits inside the heading. Item names are code, not links, and "**interface change.**" is bold text, not a mark to scan for. The rail's version list is good (READ, `src/lib/site/changelog.ts`, `CHANGELOG.md`).

## 10. Linear, briefly

One centred column, a "Download brand assets" button first, each asset as a light and dark plate pair, colours as two large named swatches ([`linear-brand-full-1440-dark.png`](./2026-11-15-design-sites/linear-brand-full-1440-dark.png)). Few ideas, held with restraint. The lesson for Pluto's brand pages is the plate pair and the download placed first (INFERRED).

## 11. What makes them feel "way above"

From the side-by-sides (INFERRED):

1. **They reach the specimen faster:** a working component within 300–400 px, against Pluto's ~790.
2. **They show the whole map:** a left rail of every part makes the system feel complete.
3. **Their small text is crisp:** antialiased smoothing, features, tighter tracking.
4. **Their tools feel finished:** no overlap, file tabs, line numbers, a palette that acts as well as finds.
5. **Their home pages prove the product** with live interface before a word is read.
6. **Their chrome is quiet:** flat hairline bars, one or two dark steps.

None of this is about Pluto's brand, which is stronger than any of theirs. It is finish on the reference pages.

## Gaps for Pluto

Ranked by visible impact over cost. Nothing here changes an item's interface; a token change is asked, not proposed.

1. **The copy button sits on the code.**
   - _Where:_ every snippet; worst on `/start/install/` ([`pluto-install-full-1440-light.png`](./2026-11-15-design-sites/pluto-install-full-1440-light.png)). `src/lib/site/page/snippet.svelte`.
   - _Reference:_ the button lives in a header row or on its own square of code ground; text never runs under it.
   - _Proposal:_ give `CodeBlock.Actions` the code ground with a short leading fade, or a header row like the frames'. Test at 390 and 1440 that no glyph lies under the button.
2. **The first example is below the fold.**
   - _Where:_ all 75 component pages. `src/lib/site/page/component.svelte`, `facts.svelte`.
   - _Reference:_ the preview follows the title; install follows the preview.
   - _Proposal:_ order title, lede, first frame, then facts. Drop the title one step (references sit at 30–48 px). Make the facts one row with a one-line scrolling command. Target: the first preview starts above y = 450 at 1440 × 900.
3. **No map of the parts.**
   - _Where:_ component pages and leaves. `component.svelte`, `leaf.svelte`, `src/lib/site/chrome/rail.svelte`.
   - _Reference:_ a sticky left rail of 240–290 px listing every page of the section, grouped, current page marked.
   - _Proposal:_ a left rail from `lg`, from `sitemap.ts`, grouped as the index is, with door dots. "On this page" stays right from `xl`. Below `lg`, the list goes in the Menu sheet.
4. **The Markdown twin is hidden, and pages dead-end.**
   - _Where:_ `component.svelte`, `leaf.svelte`.
   - _Reference:_ "Copy page" or "View as Markdown" under the title; previous and next at the foot.
   - _Proposal:_ a "Copy page" button that copies `index.md`, a "Markdown" link (both skipped in the twin), and a previous/next pair in `sitemap.ts` order.
5. **Search finds, but does not help.**
   - _Where:_ `src/lib/site/chrome/search-palette.svelte`, `src/lib/site/search/`.
   - _Reference:_ grouped results, a key footer, an action on the highlighted result, section hits.
   - _Proposal:_ rank name and prefix matches above description matches; group by door; a footer with ↑↓, ↵, Esc; ⌘C copies a component's `add` command; index `h2` sections.
6. **The home page shows no part.**
   - _Where:_ `/`. `src/routes/(site)/+page.svelte`.
   - _Reference:_ a band of live, working interface under the hero.
   - _Proposal:_ after "What one command gives you", six to eight live examples from the existing example files (a sign-in form, a dialog, a code block, a chart, a message), each linking to its page. They are productive parts, so C2 holds, and no new copy is needed.
7. **Small text is soft.**
   - _Where:_ every page. `src/lib/site/site.css`.
   - _Reference:_ antialiased smoothing and contextual features on body text.
   - _Proposal:_ set `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility` on the site's `body`, in `@layer components`. Compare before and after shots at 13.5 px. Whether `pluto-theme` should carry it for apps is a later question.
8. **The changelog is prose, not a list.**
   - _Where:_ `/changelog/`. `src/lib/site/changelog.ts`, `src/routes/(site)/changelog/+page.svelte`.
   - _Reference:_ a date line per version, short bullets with linked names, an upgrade note, a feed.
   - _Proposal:_ lift the date into a meta line; link each bullet's item name to `/components/<name>/`; render "interface change" as a badge; prerender `/changelog.xml` (Atom).
9. **The API table's empty column, and no keyboard table.**
   - _Where:_ API and Accessibility sections. `src/lib/site/page/api-table.svelte`, `component.svelte`.
   - _Reference:_ every prop says what it does; keys and actions in a table.
   - _Proposal:_ hide "What it does" when every row is empty; render each item's keys as a two-column table with `kbd`.
10. **Long commands and repeated notes.**
    - _Where:_ the facts card, the home hero, every frame's `$lib` note. `install.svelte`, `facts.svelte`, `frame.svelte`.
    - _Reference:_ one short command; setup lives in the install guide.
    - _Proposal:_ show the `$lib` note once, in the facts card. Once Install has written `registry` into `components.json`, default to the short `bunx --bun shadcn-svelte@1.7.1 add button`, with the one-off form beside it. First verify that shadcn-svelte 1.7.1 resolves bare names through that field (INFERRED, untested).

**For the owner** (to record in `decisions.md` once answered): may items gain doc comments, so the API column fills? Decision 14 of `015` says the builder adds none.

- (a) Yes, in 0.13, one commit per group. Recommended: an empty column on 75 pages reads as unfinished.
- (b) No; hide the empty column (gap 9).

## Sources

Captured 2026-11-15: [vercel.com/geist](https://vercel.com/geist/introduction), [radix-ui.com](https://www.radix-ui.com), [ui.shadcn.com](https://ui.shadcn.com), [shadcn-svelte.com](https://www.shadcn-svelte.com), [bits-ui.com](https://bits-ui.com), [skeleton.dev](https://www.skeleton.dev), [linear.app/brand](https://linear.app/brand). The Svelte search returned only lists ([sveltesociety.dev](https://sveltesociety.dev/library), [feedbagel](https://feedbagel.com/post/best-svelte-5-ui-libraries-in-2026)). Nothing was copied; every description is in our own words.
