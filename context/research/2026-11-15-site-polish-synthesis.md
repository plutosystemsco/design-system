# Site polish: what the teardowns found, ranked for `018`

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** the design lead
- **Question:** Of everything the 2026-11-15 memos found, what belongs in `018`, the site-polish specification that ships before the `v0.12.0` tag? What waits, what belongs to the registry instead, and what must the owner decide?
- **What would answer it:** the three site teardowns and the eight prior-art memos, merged and de-duplicated; the owner's 2026-11-15 rulings; the working tree as committed at `4c5c782`.
- **What it blocks:** specification `018`.

## In short

- **Fixed by the owner:** a left navigation on every page but home, from `sitemap.ts`; "On this page" alone in the right rail; the navigation in the menu below desktop; the empty API column hidden; no status mark (§1).
- **The teardowns agree.** The reference sites are not better designed screen for screen. They put the component first, keep a map of the system on every page, and finish small details.
- **Proposed `018`, in order:**
  1. the left navigation and the phone menu;
  2. the first example above the fold;
  3. the unfinished details;
  4. search;
  5. previous and next, and "Copy page";
  6. the measure and the heading step;
  7. the glass bar;
  8. a scannable changelog;
  9. after a cut line: Foundations specimens, and a picture grid for the components.
- **Deferred:** component depth, the accessibility status, the home page's live parts, section search, and a type-token change.
- **Registry findings go elsewhere.** The `error-summary` faults are urgent.
- **Four owner questions** (§5).

## How to read this memo

- **READ:** a memo, a decision or a file says so. Memos are cited by short name: *product* (`2026-11-15-design-sites-product.md`), *developer* (`…-developer.md`), *enterprise* (`…-enterprise.md`), and *Carbon*, *GOV.UK*, *Material*, *Polaris*, *Primer*, *Radix*, *Spectrum*, *Svelte* (`2026-11-15-prior-art-*.md`).
- **EXECUTED:** run in this research, on 2026-11-15, against the working tree.
- **INFERRED:** the design lead's reasoning.
- **Shots** are in [`2026-11-15-design-sites/`](./2026-11-15-design-sites/). **Costs:** S under a day; M a few days; L a week or more, or mostly writing. A memo's EXECUTED figure is reported as theirs.

## 1. Fixed by the owner

From `decisions.md`, 2026-11-15 (READ):

- **A left navigation on every page but `/`.** It shows the current door's pages, generated from `sitemap.ts`, with the current page marked, and the changelog under the site's own links. The right rail keeps "On this page" only. Below desktop it folds into the menu. This is `018` decision 1.
- **The empty "What it does" column is hidden.** The prop doc comments that fill it are their own specification, after `018`, and do not hold the tag.
- **No status mark.**
- **`018` ships before the local tag.**

## 2. Site findings, ranked

Each finding is merged across the memos. The ranking weighs visible effect against cost, and how often the memos raised it.

### In `018`, above the cut line

1. **The left navigation, and a phone menu with depth.**
   - *What:* the owner's decision 1.
     - **The desktop tree:** each door's pages, grouped as its landing groups them. The current page is marked by weight and a 2 px bar in the foreground colour, never the door's colour (`015` decision 5). That marking also survives forced colours. A filter field above Components' 75 reuses the landing's filter.
     - **The phone sheet:** the four doors as disclosures, with the current one open, and search and the theme toggle at its foot.
   - *Evidence:* every reference keeps a tree of 99 to 137 links (*enterprise* §2). Pluto's phone sheet holds four words (`pluto-phone-nav-390-light.png`; against `atlassian-menu-390-light.png`). All three teardowns rank it in their top three.
   - *Files:* a new `src/lib/site/chrome/side-nav.svelte`; the grids of `page/component.svelte`, `leaf.svelte`, `brand.svelte` and `landing.svelte`; `chrome/rail.svelte`, `chrome/bar.svelte` (the sheet) and `sitemap.ts`.
   - *Open for the spec:* where the tree starts on a landing, below its full-bleed band (INFERRED).
   - *Cost:* M.

2. **The component first, above the fold.**
   - *What:* reorder the component header as title, a short lede, the first example frame, then install and the facts as a slim strip. Step the title down from 56 px.
   - *Target:* the first frame starts above y = 450 at 1440 × 900, and inside the first screen at 390 × 844.
   - *Evidence:* Button's first example starts near y = 790 at 1440; at 390 none is in view. The references: y = 266–400 (*developer* §3, *product* §7; `pluto-button-390-light.png`).
   - *Files:* `page/component.svelte`, `facts.svelte`, `install.svelte`.
   - *Open for the spec:* a written one-line lede per item (*product* gap 3): 75 sentences.
   - *Cost:* S, plus M if the ledes are written.

3. **The unfinished details.**
   - *What:*
     - **The copy button drawn over its command.** On `/start/install/` the first command runs under the icon (`pluto-install-full-1440-light.png`). The button needs its own ground, or a header row.
     - **The SvelteKit 2 note repeated under every frame,** four times on Button. Show it once per page.
     - **The empty API column** (owner-fixed).
     - **The literal `<account>`,** flagged by both teardowns, is already fixed (`src/lib/site/site.ts:14`, EXECUTED).
   - *Evidence:* *developer* gap 1, §4, §5; *product* gap 1.
   - *Files:* `page/snippet.svelte`, `command.svelte`, `frame.svelte`, `api-table.svelte`.
   - *Cost:* S.

4. **Search that finds what was meant.**
   - *What:*
     - match the summary at word starts. Today it is a substring match (`src/lib/site/search.ts:15`, EXECUTED), so "dia" finds Item, Highlighter and Is mobile through "media" and "Meridian";
     - highlight the matched text with `<mark>`;
     - group results by door, with its dot;
     - a key legend (arrows, Enter, Esc) set in the `kbd` item;
     - on a component result, an action that copies its `add` command;
     - optionally, aliases (modal, toast, dropdown), matched after the title and shown when they matched, inside `015`'s 30 kB.
   - *Evidence:* `pluto-search-1440-light.png` against `atlassian-search-1440-light.png` and `shadcn-search-1440-dark.png`; *developer* gap 5, *enterprise* gap 7, *product* gap 9, *GOV.UK* 3.
   - *Files:* `search.ts`, `chrome/search-palette.svelte`, `search/types.ts`, `search/sources/pages.ts`, `tests/unit/search.test.ts`.
   - *Cost:* S–M.

5. **Previous and next; "Copy page" and "View as Markdown".**
   - *What:*
     - a previous and next pair at the foot of every leaf and component page, in `sitemap.ts` order;
     - under the title, "Copy page", which copies the twin's text, and a "Markdown" link.

     Every page has a twin (`015` decision 19), but nothing points to it.
   - *Evidence:* shadcn, Radix, Geist and Material end pages this way or offer the twin (*developer* gap 4; *enterprise* gaps 4, 10).
   - *Files:* `page/component.svelte`, `leaf.svelte`, `brand.svelte`.
   - *Cost:* S.

6. **Type: measure, a heading step, smoothing.**
   - *What:*
     - **The measure.** `max-w-prose` was meant as 65 characters (`015` decision 5), but Geist runs narrower than `ch`. The measured median is 78 characters, with lines up to 95 (*enterprise* §2, EXECUTED by them). Narrow the prose column to about 576 px and check the characters per line by test.
     - **The heading step.** On component pages h2 is 28 px and h3 is 16 px, the body size. The other templates set h3 in Plex at 18 px. Use one h3 everywhere: Plex 600 at about 20 px.
     - **Smoothing.** Set `-webkit-font-smoothing: antialiased` on the site's body, in `@layer components`, and keep before-and-after shots at 13.5 px.
   - *Evidence:* *enterprise* gap 9; *developer* §2 and gap 7; `pluto-type-1440-light.png`.
   - *Files:* `site.css`, the `heading` snippets in `component.svelte` and `leaf.svelte`.
   - *Not here:* moving the 13.5 px `text-sm` token to 14, which every app would receive.
   - *Cost:* S.

7. **The glass bar over scrolling content.**
   - *What:* once the page scrolls, raise the bar's ground until nothing behind it competes with the lockup. Keep the glass at rest at the top. Measure the result over the busiest frame, as `015` measured the bar's text.
   - *Evidence:* "Save changes" sits behind "pluto" (`pluto-copy-1440-light.png`). The references use opaque or 85% bars (*enterprise* gap 5, *developer* §3).
   - *Files:* `chrome/bar.svelte`, `site.css`.
   - *Note:* this tunes `015` decision 5's glass; it does not replace it.
   - *Cost:* S.

8. **A scannable changelog.**
   - *What:*
     - each release's date as a line of its own;
     - item names linked to their pages;
     - "interface change" shown as a `badge`, not bold text.

   - *Evidence:* *developer* §9 and gap 8; `pluto-changelog-1440-dark.png` against `radix-changelog-1440-dark.png`.
   - *Files:* `changelog.ts`, the changelog page, its test. `015` criterion 22 compares the page's text with the file's, so the badge needs care.
   - *Cost:* S.

### In `018`, below the cut line

These build last, and are cut if the budgets or the schedule break.

9. **Foundations as specimens.**
   - *What:*
     - **Type:** each face's name set in that face, and a sample line at every `text-*` and display step beside its numbers. `brand/ladder-figure.svelte` may serve.
     - **Colour:** each role as a swatch of 48 px or more, light and dark side by side, with its contrast on the swatch.
   - *Evidence:* *enterprise* §5.5 and gap 3; `pluto-foundations-colour-1440-light.png` against `atlassian-colour-full-1440-light.png` and `carbon-colour-full-1440-light.png`.
   - *Files:* `routes/(site)/foundations/type/+page.svelte`, `colour/+page.svelte`, `src/lib/site/foundations/`.
   - *Cost:* M.

10. **Pictures on the components index.**
    - *What:* a card grid, beside today's rows, with the filter and groups kept. Each card holds a thumbnail of the item's first example, in light and dark, at fixed dimensions.
    - *How (INFERRED):* committed images made by a script with the repository's Playwright, since Workers Builds is not assumed to run Chromium. A unit test checks each item has one, with a recorded hash matching its example's source. A live grid would hydrate 75 examples on one page.
    - *Evidence:* `pluto-components-full-1440-light.png` against `atlassian-components-1440-light.png` and `material-components-…`; *product* gap 2, *enterprise* gap 6.
    - *Files:* `routes/(site)/components/+page.svelte`, a new `scripts/site/thumbnails.ts`, `static/`.
    - *Cost:* M, and it must meet `015` decision 23's budget for `/components/`.

### Waiting on the owner

11. **A "changed in" fact.** For example "Changed in 0.12.0", from the changelog, beside "Since". The owner ruled "a changelog page only", with no per-item release history (2026-11-14). Question 2. *Cost:* S.
12. **A feedback link.** GOV.UK and Carbon link a GitHub discussion; Atlassian asks "Was this page helpful?"; Pluto has nothing (*product* gap 6, *GOV.UK* §4, *enterprise* gap 10). A static site has nowhere to send a yes or no. Question 3. *Cost:* S.

### Deferred, with where each goes

- **Component depth**, a specification after `018`, with the prop doc comments the owner already placed there:
  - do and don't as live example files (*product* gap 5) and anatomy figures;
  - real scenes, not repeated "Save changes" (*product* §7, *Carbon* 7);
  - keyboard tables from data the tests also read (*Svelte* 1);
  - a "Test it" list (*product* gap 7);
  - error wordings on form items (*GOV.UK* 2, *Polaris* 1).

  *Cost:* L, mostly writing.
- **The accessibility status:** its own specification (§4).
- **The home page's live parts** (*developer* gap 6). The owner liked the home page; ask later (INFERRED).
- **Search hits on sections**, through `015` decision 18's hook.
- **The short install command,** read from `components.json`: untested with shadcn-svelte 1.7.1; research first.
- **A door-coloured figure on every leaf** (*product* gap 10, *enterprise* gap 8). It conflicts with `015` decision 5.
- **Brand writing:** voice specimens, an action-label list, an error anatomy (*product* gap 8, *Carbon* 4, *Polaris* 2).
- **A props playground** and a variant matrix (*enterprise* gap 11, *Radix* 1).
- **The changelog grouped by kind, and a feed** (*GOV.UK* 4), which changes `CHANGELOG.md`'s convention.
- **Line numbers and file tabs** in the site's frames (*developer* §5). Low.
- **Not ranked:** the dark theme's three warm steps. They are the owner's I5 ruling, and they pass contrast.

## 3. Registry findings: not `018`

`018` changes no registry item, so `static/r/` is unchanged. These go elsewhere.

1. **`error-summary`: two faults. Urgent.**
   - `role="alert"` sits on the summary's root (`src/lib/registry/ui/error-summary/error-summary.svelte:57`, EXECUTED). GOV.UK moved theirs to an inner element because JAWS did not read the whole summary (*GOV.UK* §2, READ there).
   - `focusField` calls `field.focus()` (lines 38–42, EXECUTED). The browser scrolls the field, so its label or legend can sit above the viewport or under a sticky bar. GOV.UK scrolls the label into view and adds no hash to the address.
   - The item has been released since 0.3.0 (EXECUTED, `registry.json`). It is Pluto's most screen-reader-sensitive behaviour.
   - *Where it goes:* a small specification of its own, with tests: the alert on an inner node; after a link, the field focused and its label at the top, clear of a sticky bar; no hash added. It changes the item's markup and behaviour, so it needs a changelog line.
   - *Urgency:* high. The timing is question 1.
2. **Forced colours across interactive items** (*Material* idea 1; *Primer* idea 7). Each stateful control needs system-colour rules, and a Playwright check with `forcedColors: "active"`. It belongs with the high-contrast specification, since both are contrast modes. *Urgency:* medium.
3. **A test that every `var()` exists** (*Material* idea 2). Each `var(--x)` in an item file must name a variable that the theme or the same file defines. *Cost:* S. It folds into the next specification that touches items, the prop doc comments one. *Urgency:* low.
4. **axe across themes and states** (*Svelte* idea 2; *Material* idea 4).
   - axe already runs every site page in both projects. But other-theme example views are scanned for 5 items only, and no overlay is scanned open. No state is driven: hover, pressed, disabled, invalid.
   - This is the accessibility status's evidence (§4), and belongs with it. *Urgency:* medium.
5. **Governance tools,** each a small specification, none urgent before the next interface change: a removed-names record and token diff (*Primer* 1, *Spectrum* 1); `meta.deprecated` (*Carbon* 6, *Primer* 2); role words in the token file (*Spectrum* 4); a written interface-change rule (*Carbon* 1).
6. **Scoped schemes and high contrast,** already decided in direction. They wait on `research/2026-11-15-scoped-schemes-and-contrast.md`, which does not exist yet (EXECUTED, a listing of `research/`). Then they need their own specification: a theme change every app receives.

## 4. What the accessibility status and high contrast mean for `018`

- **The accessibility status** (READ, 2026-11-15) shows per component what the test run checked: both schemes, keyboard, contrast, forced colours, screen-reader notes. Every check must pass, or the build fails. It reverses `015` decision 10.
  - **It is not `018`'s** (INFERRED). It needs tests tagged by item, forced-colours and open-state checks that do not exist yet (§3, items 2 and 4), and screen-reader notes.
  - **It has an ordering problem.** `bun run test` builds the site before the browser suites run (`015` decision 24), so a page cannot read the report of the run that tests it. The status needs either a committed report of the last full run, or a release step that tests first and then builds.
  - **`018` only leaves room for it:** the facts strip (item 2) keeps a place for a status line.
- **High contrast** is a theme change every app receives, researched with scoped schemes: its own specification. For `018`:
  - the theme toggle keeps two settings;
  - no new site colour is a literal or an opacity tuned to two schemes, so the bar's scrolled ground (item 7) comes from tokens;
  - the left navigation's current mark does not rest on colour.

  If scoped schemes land, they could replace the frames' iframe (`015` decision 12); `018` leaves the frames alone.

## 5. Questions for the owner

Each has the recommended option first.

1. **Does the `error-summary` fix ship before the `v0.12.0` tag?**
   - **(a) Yes, as a small specification after `018`, before the tag** (recommended). It is a known screen-reader failure in a released item. Nothing is published yet, so 0.12.0 can carry the fix at little cost.
   - (b) After the tag, as the first thing in 0.13.0.
2. **May a component page show a "changed in" fact?** For example, "Changed in 0.12.0", linked to that release's changelog entry, beside "Since".
   - **(a) Yes, one generated line, not a history** (recommended). It is the cheapest sign of a living system, and every enterprise reference shows one (*enterprise* gap 4).
   - (b) No. Keep 2026-11-14's "a changelog page only" as it stands.
3. **Should pages carry a feedback link?**
   - **(a) One "Suggest a change" link at the foot of every page.** It opens a new GitHub issue with the page's address filled in (recommended). It is cheap, and asks nothing of a static site.
   - (b) A GitHub discussion per component, as GOV.UK and Carbon have. It is richer, but each discussion needs looking after.
   - (c) None.
4. **When does the accessibility status ship?**
   - **(a) Its own specification after the tag** (recommended). It needs tests tagged per item, forced-colours and open-state checks, and a way to read a test report into a build that runs before the tests (§4).
   - (b) Before the tag, which waits for it.

## Sources

Local, READ on 2026-11-15:

- `context/decisions.md`, its 2026-11-15 entries;
- the three teardowns: `2026-11-15-design-sites-{product,developer,enterprise}.md`;
- the eight memos `2026-11-15-prior-art-{carbon,govuk,material,polaris,primer,radix-themes,spectrum,svelte-design-systems}.md`;
- the shots in `2026-11-15-design-sites/`;
- `src/lib/site/search.ts`, `src/lib/site/site.ts`;
- `src/lib/registry/ui/error-summary/error-summary.svelte`;
- `registry.json`;
- specifications `015` (decisions 5, 10, 12, 18, 19, 22, 23, 24) and `017`.
