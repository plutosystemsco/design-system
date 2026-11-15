# 015 — The design site: its frame, its components and its machinery

- **Status:** built; its change review's 13 findings answered (2026-11-15), the Button budget ruled 370 kB. Was fit to build, by its fourth review ([`../reviews/015-the-design-site-spec-2026-11-14.md`](../reviews/015-the-design-site-spec-2026-11-14.md), "Fourth review", 2026-11-15), with its write-ins V1 to V4 taken. Revised 2026-11-14 after its specification review, [`../reviews/015-the-design-site-spec-2026-11-14.md`](../reviews/015-the-design-site-spec-2026-11-14.md) (6 High, 7 Medium, 10 Low; each answered under "Review dispositions"). Revised again after the same file's second review (S1 to S7) and third review (T1 to T6), each answered under its own heading in the dispositions.
- **Date:** 2026-11-14
- **Author:** the design lead
- **Kind:** the public design site, "Pluto Systems design", built in this repository's SvelteKit app and served by the Cloudflare worker `pluto-systems-design`. It covers:
  - the information architecture and the chrome;
  - the home page and the four section landings;
  - the 75 component pages, moved to `/components/` and rebuilt;
  - the changelog page and the 404 page;
  - search, a Markdown twin of every page and an `llms.txt` index;
  - installing from the site's own `/r/` path;
  - the worker's new name, its headers and the asset paths;
  - the removal of `/identity/`, and the test migration.

  **No registry item's interface changes.** Every comment in a published item file that cites a specification, a decision or a review code is reworded in plain words (decision 14). The items that hold one change in their comments only, and the changelog names them. The Start, Brand and Foundations leaf pages and the brand downloads are [`017`](./017-the-design-site-start-brand-and-foundations.md), which builds on this one (decision 2).
- **Depends on,** each built, change-reviewed and committed to `release/0.12.0` before this build starts (decision 3):
  - [`014`](./014-the-white-light-mode-code-ground.md), the white light-mode code ground;
  - [`013`](./013-code-highlighted-by-tree-sitter-in-meridian-roles.md), tree-sitter and Tombaugh, which also removes the workbench and adds `/view/code-agreement/`;
  - [`016`](./016-the-brand-yellow.md), the brand yellow: `#E2B000` in light and `#F8D874` in dark for the mark's third dot, `field-3`, `chart-3` and `caution`, and a new `caution-text`. Brand is the yellow door, so this site is designed and measured against those values. This specification changes no token.
- **Ships with:** `013`, `014`, `016` and `017`, as 0.12.0. `v0.12.0` is tagged locally once, after the change reviews of `013`, `014`, `015`, `016` and `017`. Nothing is pushed until the owner asks (`decisions.md`, "Commits per specification, and the site's worker name").
- **Research it stands on:**
  - [`../research/2026-11-14-the-design-site.md`](../research/2026-11-14-the-design-site.md) (the site memo), with its 36 screenshots. Direction B is the `b-map-*` files in [`../research/2026-11-14-the-design-site/`](../research/2026-11-14-the-design-site/).
  - [`../research/2026-11-01-the-identity-options.md`](../research/2026-11-01-the-identity-options.md), for N1's and M4's warning that the mark can read as Google's at a glance.
- **Design calls** in `../decisions.md`, 2026-11-14:
  - "Commits per specification, and the site's worker name";
  - "The design site: its name, downloads and the exhibit";
  - "A public design site, the workbench dropped, and properties under Meridian";
  - "A yellower yellow, in code and in the brand";
  - "The design site's review calls, taken while the owner was away" (open to reversal).

  Also the identity's settled answers of 2026-11-06 and 2026-11-07 (N1, C2, H1, I5, I9, J2, J4, K3, L3, "Frost only"), `011`'s R25, and the writing and furniture rules R23 and R24 ("Two writing and furniture rules join the checklist", 2026-11-01).
- **Figures** marked EXECUTED were measured by the design lead on 2026-11-14:
  - on macOS (Darwin 25.5.0, arm64), with Bun 1.4.4 and the repository's pinned Playwright 1.64.1 (Chromium);
  - against a build of `HEAD` (`ef53f01`, the `v0.11.0` tree), made in a scratch folder outside the repository;
  - with the repository's own IBM Plex Sans and Geist font files.

  Contrast figures use `scripts/contrast.ts` (`contrastRatio`, `compositeAlphaByte`, `deltaE`) on today's glass tokens and `016`'s yellow. Figures marked EXECUTED (review) are the reviewer's. Nothing in the repository was changed to take any of them.

## Intent

The owner asked for "a brand site or a design site that explains how to build with the design system, and explains the pluto system brand". Then: "we need to think bigger and develope something great". The bar is the owner's earlier one: compete with Google.

Today the app is a catalogue: a home page that lists 75 items, a page per item, frameless views, the identity exhibit and the workbench. It has no guide, no brand section, no search and no changelog page.

The owner chose direction B, "the mark is the map". The four dots of the mark become the site's four doors: Start (blue), Components (red), Brand (yellow) and Foundations (green). Each section opens on its colour field. The site speaks in the system's expressive mode: poster type, flat colour fields and frosted glass.

This specification builds the site's frame and its component documentation. After it lands:

- a visitor meets the mark as a map on the home page and walks through one of four doors;
- every one of the 75 items has a page at `/components/<name>/` that shows it live, in either theme, with its code, its API, its files and how to install it;
- an agent reads any page as Markdown, starting from `/llms.txt`;
- an app installs from the site's own versioned registry path or from GitHub, and owns what it installs.

**Terms of art.**

- A **door** is one of the four top-level sections. Its **landing** is the section's first page, at `/start/`, `/components/`, `/brand/` or `/foundations/`. A **leaf** is any other page in a section.
- A **field** is `011`'s flat area of one brand colour, `field-1` to `field-4`. Its **legend** is the text colour measured on it. A **band** is a full-bleed field at the top of a landing.
- An **example** is one live demonstration of an item, written as a file of its own. Its **frame** is the box the page draws around it, with its title, its theme switch and its code.
- A **view** is a frameless page that exists to be shown inside an iframe.
- The **site origin** is the address the site is served from. Until the owner sets `design.<domain>`, it is `https://pluto-systems-design.<account>.workers.dev`. `<account>` is the owner's to give.
- **LCP** is Largest Contentful Paint: when the page's largest text or image is painted. **CLS** is Cumulative Layout Shift.
- A **control** here means a button or a link. A **tab stop** is anything Tab reaches, a code block's scrolling region included.

**Not here:**

- the Start, Brand and Foundations leaf pages, the downloads and the token entries in search (`017`);
- any token change (`016`);
- any change to a registry item's interface;
- a search service;
- a Content Security Policy (decision 25);
- redirects of any kind (the owner: "nothing is published, no need to redirect").

## Decisions

### 1. The information architecture: four doors, a changelog, and one list of pages

Every page the site has is listed once, in `src/lib/site/sitemap.ts`. These all read it:

- the bar, the landings' indexes and the footer;
- search, `llms.txt`, `sitemap.xml` and the Markdown build;
- `tests/e2e/pages.ts` and every test that counts pages.

A page that is not in the list fails a test. An entry without a page fails the prerender.

```
/                                   Home: the mark as the map                      015
/start/                             Start landing, on the blue field               015
  install/  theme/  light-and-dark/  modes/  your-product/                         017
/components/                        Components landing and index, on the red field 015
  <name>/                           75 component pages                             015
/brand/                             Brand landing and overview, on the yellow field 015
  mark/  colour/  type/  surfaces/  motion/  imagery/  voice/  products/  downloads/ 017
/foundations/                       Foundations landing, on the green field        015
  tokens/  colour/  type/  space-and-shape/  motion/  accessibility/  code/        017
/changelog/                         Every release, from CHANGELOG.md               015
/404.html                           Not found                                      015
```

Machine and support paths, none of them in the bar:

| Path | What | Who |
|---|---|---|
| `/r/…`, `/v<version>/r/…` | the registry JSON, as today | kept |
| `/view/…` | every block and composition view in `pages.ts` (45 once `013` adds `/view/code-agreement/`) | kept |
| `/example/<item>/<example>/` | one example, frameless, for the other-theme frame (decision 12) | 015 |
| `<page>/index.md`, `/llms.txt` | the Markdown twins and their index (decision 19) | 015 |
| `/search.json` | the search index (decision 18) | 015 |
| `/sitemap.xml`, `/robots.txt` | for crawlers | 015 |
| `/brand/downloads/<file>.svg` | the mark and lockup (`017`) | 017 |

Each entry in `sitemap.ts` holds:

- its path, title, door, one-sentence summary and parent;
- a `spec` tag, `"015"` or `"017"`, read by tests only and never shown.

`017` appends its 21 entries to the same list.

**Each page's job, in one line.**

| Page | Its job | What it holds |
|---|---|---|
| Home | Say what this is and send the visitor through a door | The headline, the four doors, the first command, what one command gives you, the four section indexes |
| Start landing | Get a builder from an empty SvelteKit app to a first Pluto screen | Two commands, then the Start guides |
| Components landing | Find a part | The count, the filter, all 75 items in their 11 groups |
| Component page | Use one part correctly | Its facts and install, its examples in either theme, when to use it, its API, its accessibility, the files you own, related parts |
| Brand landing | Say who Pluto is and how it looks | What Pluto Systems is, the line "Work runs on data.", the lockup on the field, the brand pages |
| Foundations landing | Explain the one token file | Roles, not values; both themes; the foundation pages |
| Changelog | Say what changed in each release | `CHANGELOG.md`, newest first, with an anchor per release |
| 404 | Get a lost visitor somewhere useful | What happened, search, the four doors |

- _Why one list:_ the research found that a new page joins no suite unless a list names it (memo §2.4). One list makes "every page is tested" true by construction, as `BLOCK_VIEWS` does for views.
- _Why `/components/`:_ the owner's ruling. The label and the URL say the same word.
- _Why the landings hold real content:_ each landing must stand alone before `017` lands. The prerender also fails on a link to a missing page (SvelteKit's default `handleHttpError: "fail"`). So the landings link only to pages that exist, and `017`'s pages join their indexes through the list.
- _Why no "upgrading" page and no per-item history:_ the owner ruled "a changelog page only". How to update an item (run `add` again) is a section of `017`'s install guide.

### 2. Two specifications, `015` and `017`, because the site is too large for one builder

The site is about 102 pages. 75 of them are rebuilt from 8,136 lines of item-page markup, which hold 195 sections and 177 test IDs (EXECUTED (review)). The work also adds a search, a Markdown build, an API generator, an example system and a test migration. And 21 pages of brand and foundations writing. That is two builds.

- **015** (this):
  - every file that exists today, and every test file;
  - the frame, the chrome and **every page template**: landing, component, leaf and Brand (decision 5);
  - home, the four landings, the 75 component pages, the changelog and the 404;
  - search, Markdown, `llms.txt`, `/r/` installs, the worker and its headers;
  - `/identity/`'s removal and the test migration.
- **017:**
  - new pages only, in new folders, on 015's leaf and Brand templates: Start's five guides, Brand's nine pages and the SVG downloads, Foundations' seven pages and their generated token tables;
  - the token entries in search;
  - two pinned development packages;
  - 21 entries appended to the page list;
  - search entries for the token anchors, through decision 18's hook, in a file of its own;
  - new `describe` blocks appended to nine of 015's test files: `keyboard.spec.ts`, `site.spec.ts`, `doors.spec.ts`, `perf.spec.ts`, `build-output.spec.ts`, `site-add.test.ts`, `deps.test.ts`, `search.test.ts` and `sitemap.test.ts`.

  017 edits no line that 015 wrote. 015's counts read the page list, not a literal, so they stand when 017 adds to it (criterion 2).

- _Why this boundary:_ 015 owns everything that moves or breaks; 017 owns only what is new. 017's builder never edits an item page, a template, or an existing test. That keeps 017 from breaking a component page. And 017 is led by writing from the settled decisions, where 015 is led by engineering.
- _Why `017` and not `016`:_ `016` is the yellow token change, numbered first.

### 3. Build order: one specification at a time, each committed as it lands

The owner ruled ("Commits per specification, and the site's worker name"):

- each specification is committed to `release/0.12.0` once its change review passes;
- `v0.12.0` is tagged locally once, after the change reviews of `013`, `014`, `015`, `016` and `017`;
- nothing is pushed until the owner asks.

The order is `014`, `013`, `016`, `015`, `017`. 015's build starts on `release/0.12.0` with `013` and `016` committed.

- _Why not alongside `013` or `016`:_ each build must see its own tests fail before its code (`README.md`, step 4), and its review must read one specification's diff. 015 also shares files with `013` and `016`:
  - the six code item pages and five pages `016` edits;
  - `tests/e2e/pages.ts`, `axe.spec.ts`, `theme.spec.ts`, `code.spec.ts` and `deps.test.ts`;
  - `package.json`, `bun.lock` and `CHANGELOG.md`.

  Two builds in one tree at once would fail both rules.
- _Why after `016`:_ `016` changes the yellow of the Brand door, the third field and the mark. 015's door checks and the glass over the yellow field read `016`'s values. `016` decision 9 asks that 015's first checkpoint in the tree judge the final yellow.
- **Checkpoint 0 runs alongside `013`, outside the tree.** 015's builder builds the home page, the Components landing and the Button page as throwaway pages in the session's scratch folder. They read the repository's built stylesheet and fonts read-only, as the research did. Until `016` lands, the scratch stylesheet sets `016`'s values by name, in both themes:
  - `--mark-3`, `--field-3`, `--chart-3` and `--caution`: `#E2B000` in `:root`, `#F8D874` in `.dark`;
  - `--field-3-foreground`: ink in `:root`, graphite in `.dark`;
  - `--mark-3` inside `.dark [data-mode="expressive"]`: `#F8D874` (otherwise the amber dot survives in the bar's dark lockup).

  The design lead looks at the pages in the browser and rules on the answers to the two risks (decisions 6 and 7) before any file in the repository changes. A ruling goes in `decisions.md`. Checkpoint 1, in the tree on the committed tokens, is where the four colours on big fields are judged for good.
- **File ownership** for the release is the table under "Design".

### 4. The name, the worker and the origin

- **The name.** The site is **"Pluto Systems design"**. The header lockup's accessible name is "Pluto Systems design", which contains the visible word (WCAG 2.5.3). Each page's `<title>` is "<page title> | Pluto Systems design"; the home page's is "Pluto Systems design".
- **The worker.** `wrangler.jsonc`'s `name` becomes `pluto-systems-design`, as the owner ruled. Workers Builds fails a build whose `name` differs from the worker's name in the dashboard (READ, [Cloudflare, Workers Builds troubleshooting](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/#workers-name-requirement), 2026-11-14, by the reviewer). So before the first push of this change, the owner renames or creates the worker in the dashboard and reconnects Workers Builds to it (For the owner, item 1).
- **The origin is one constant,** `SITE_ORIGIN` in `src/lib/site/site.ts`. Its value is `https://pluto-systems-design.<account>.workers.dev`, with the literal placeholder `<account>`, until the owner gives it. It changes in that one place when the owner sets `design.<domain>`. These all read it:
  - install commands;
  - `llms.txt` and `sitemap.xml`;
  - every link in a Markdown twin.

  The smoke and Markdown tests replace it with their local server's address.
- _Why a constant, not the request's origin:_ every page is prerendered, so there is no request. And an install command copied from the page must hold a full address.
- _Why a placeholder is safe:_ nothing is pushed or deployed before the owner asks. Criterion 31's deploy check runs only once `<account>` is filled. `scripts/site/release-check.ts`, run by the design lead before tagging (criterion 31), fails while the placeholder is still there. It is a script, not a test, so a clean clone's `bun run test` never depends on whether the owner has answered.

### 5. The visual system: direction B in this system's own tokens

The site is built from this system's tokens, utilities and items. It adds no colour and no font.

- **Sizes** come from the token file or from Tailwind's own scale where items already use it (`max-w-7xl`, `max-w-prose`, `text-xs` … `text-2xl`). Constitution §4.3 binds items, and the site follows it as far as items do.
- **Two ratios are the site's own,** both unitless, both in `src/lib/site/doors.ts`, both measured below:
  - the disc to the poster step;
  - the door name to the disc.
- **Its CSS is utilities plus one layered stylesheet,** `src/lib/site/site.css`, whose every rule sits inside `@layer components`. No site component has a `<style>` block. Svelte's scoped styles are unlayered and would beat a field's layered legend. That is the memo's §6.3 failure (`a { color: inherit }` beat a field's legend), reached by a class instead of an element (criterion 28).

**The palette.** The canvas `#F3F0E8` and graphite `#16140F`; ink `#0B0F17` and paper; and the four fields:

| Door | Field | Light fill, legend, ratio | Dark fill, legend, ratio |
|---|---|---|---|
| Start | `field-1` | `#2D48D4`, white, 7.02 | `#93B0FF`, graphite, 8.67 |
| Components | `field-2` | `#C92035`, white, 5.61 | `#FF9491`, graphite, 8.67 |
| Brand | `field-3` | `#E2B000`, ink, 9.53 | `#F8D874`, graphite, 13.20 |
| Foundations | `field-4` | `#008058`, white, 4.96 | `#60C498`, graphite, 8.62 |

- The blue, red and green figures are `011`'s rows.
- The yellow figures are `016`'s (its decision 5), and agree with the design lead's own measurement (EXECUTED).
- The site reads every one of these colours from the token file, through the theme. No test of this specification pins a hex.

The canvas is the warm off-white that generated pages often default to. Here it is the owner's ruling (I5), not a default. This site's identity comes from the fields, the mark and the poster type, not from the canvas.

**The mark never sits directly on a field.** On its own field the mark's yellow dot measures 1.00:1. On the blue, red and green fields it falls to 2.46–3.49 in light and about 1.5 in dark (`016` decision 5, EXECUTED (016)). So on this site:

| Where the mark is | What it sits on | Measured |
|---|---|---|
| The bar's lockup, and the dots beside its door links, over any band | the bar's glass | the four dots keep ΔE 18.1 or more from the glass over each field in light (`016` decision 5) and 43.6 or more in dark (EXECUTED by `016`'s review) |
| The Brand band's lockup | the field, as a **one-colour** lockup in the field's legend | ink on `field-3`: 9.53 in light; graphite on it: 13.20 in dark |
| The home page's doors | the canvas or graphite. Each disc is one colour, not the mark | each legend on its disc, as in the table above |
| The breadcrumb's, search's, the 404's and the footer's dots | the canvas, a card or a dialog | the theme's own grounds |

A four-colour mark on a field anywhere else fails criterion 12.

**Type.**

- IBM Plex Sans 600 for display, through `type-poster` (56–160 px), `type-display` (48–92), `type-section` (36–56) and `type-proof` (numbers, tabular).
- Geist for body and interface.
- JetBrains Mono for code, commands, paths and token names only.
- Body text keeps to `max-w-prose` (65 characters).
- Sentence case everywhere: no all-caps, no eyebrow over every heading, no middle-dot meta strings, no arrows in copy (R24).

**Layout.** One wide measure, the bar's (`max-w-7xl`), with `--gutter-stage` (16 to 56 px) at its sides. Everything is left-aligned. A band is full-bleed; its contents keep the measure.

**Modes.**

- `data-mode="expressive"`: the bar, the home page, the landings' bands, the Brand template and the footer.
- `data-mode="productive"`: the `<main>` of a component page, the leaf template and the changelog, and every example frame of a productive item.

So in dark a product's mark inside an example is paper, as an app shows it, and the bar's mark is the lifted four.

**Where the boldness lives, and where pages stay quiet.**

| Loud: an owned moment | Quiet: a reference screen |
|---|---|
| Home: the four doors, the poster headline | Component pages |
| The four landings' bands | Start and Foundations leaves (`017`) |
| The Brand pages (`017`) | The changelog |
| The door transition (decision 9) | The 404 |

A quiet page is the canvas, hairlines and the productive type sizes. It names its door two ways: by the door's dot in the breadcrumb, and by the bar's current-door mark. It carries no field outside an example frame (decision 7). So a component page is a usable reference: nothing competes with the example.

**The templates** (`src/lib/site/page/`), all built and used by 015:

| Template | What it lays out | Used by 015 | Used by 017 |
|---|---|---|---|
| `landing.svelte` | the band, then the landing's content and index | 4 landings | — |
| `component.svelte` | decision 10's sections and the rail | 75 component pages | — |
| `leaf.svelte` | breadcrumb, `type-section` title, summary, the rail ("On this page"), a productive `<main>` at the prose measure | the changelog | Start and Foundations leaves |
| `brand.svelte` | an expressive `<main>` with a quiet header (breadcrumb, `type-display` title, summary), then full-bleed slots that may hold a field, and measure slots | the Brand landing, below its band | the nine Brand pages |

**The pages, one by one.** The wireframes are at 1440 px; the phone layout follows each.

_The bar_ (every page) is a floating glass panel at the wide measure, `--size-bar` tall. It is sticky, marked `data-sticky-bar`, and lit by `pointerLight`. It is site code built from items: `glass`, `Lockup`, `ThemeToggle`, `Button` and `Sheet`.

It holds:

- the skip link;
- the lockup, linking home;
- the four door links, each its name with its dot before it (the dot is `aria-hidden`);
- the search button, with its shortcut shown;
- the theme toggle.

The current door's link carries `aria-current`: `"page"` on its landing, `"true"` on its leaves. It also gets a 2 px underline in the foreground colour, never in the door's colour. Below `md` the door links fold into a sheet behind "Menu".

The bar's text is `foreground` and `primary` only, so it reads over anything that scrolls under it. On a dark page, an example frame showing the light theme scrolls under the dark bar. R25 forbids dark glass over a light-theme ground "as written". Here the bar's text was measured on that ground: `foreground` 9.99 and `primary` 5.36 on dark glass over white (EXECUTED). The bar uses no `muted-foreground`, which would read 4.21 there. On those two rows the pairing is accepted.

- _Why not `marketing-bar`:_ it has no current-page state and no slot for search or the theme. Adding them would change a registry item's interface for this site's need alone (§4.2). A later specification may fold them in when a product needs them.

_Home._

```
[bar]
Build                              (  Start  )   ( Components )
with                               (  Brand  )   ( Foundations )
Pluto.
The tokens, components and brand behind every Pluto Systems product.
Copy in what you need, and own what you copy.
[ REGISTRY_URL=… bunx --bun shadcn-svelte@1.7.1 add pluto-theme -y   Copy ]

What one command gives you
  add button  ->  files you own (generated), and what it brings (generated)

Start            Components         Brand              Foundations
 guides…          groups…            pages…             pages…
[footer]
```

- **The headline** is `type-poster`, three lines, in ink (paper in dark).
- **The doors** are four discs in N1's order (blue, red / yellow, green) and N1's proportion (the gap is 0.267 of the disc).
  - Each disc is `field-N`. It is a link holding its door's name and one line in the legend: "Install, theme, modes", "75 parts", "Mark, colour, voice", "Tokens and rules".
  - The disc is the control's own surface, not a control set on a field, so R25 holds.
  - **Its focus ring is the theme's ring, not the field's.** A field sets `--ring` to its legend, so a white ring outside the disc would vanish on the canvas. The disc draws its 2 px ring outside its edge in `--surface-ring`, the theme's own value: blue on the canvas 6.16, lifted blue on graphite 8.67 (EXECUTED).
  - The map's top aligns with the headline's first cap height. The dots rise beside the words, as they do in the lockup (E6): the hero is the lockup's geometry, grown.
- **Two layouts, split at `lg` (1024 px).** Below 1024 the hero is one column: the headline, the copy, the command, then the four doors in a 2 × 2. From 1024 the doors stand beside the headline. Each layout sizes the disc by its own rule:
  - **below 1024:** the disc is `min(40%` of the viewport's width`, 160 px)`, so the 2 × 2 is at most 363 px tall and wide, and never grows past the words at a tablet's width;
  - **from 1024:** the disc is the headline's three lines (3 × 0.9 × the poster size) divided by 2.267, so the 2 × 2 is exactly the headline's height.
- **The door's words are sized by the disc, not by a type step** (review finding 2). The name is Plex Sans 600 at **0.12 of the disc's diameter**, set with container query units on the disc (`cqi`). The line under it is Geist 400, `text-xs` below 1280 px and `text-sm` from 1280. Measured in Chromium with the repository's fonts, at both sides of each breakpoint (EXECUTED):

  | Width | Layout | Disc | Name size | "Components" width | Least room, any line's corner to the disc's edge |
  |---|---|---|---|---|---|
  | 360 | one column | 144 px (40%) | 17.3 px | 100 px | 10.7 px |
  | 390 | one column | 156 px (40%) | 18.7 px | 108 px | 16.5 px |
  | 768 | one column | 160 px (the cap) | 19.2 px | 111 px | 18.4 px |
  | 1023 | one column | 160 px (the cap) | 19.2 px | 111 px | 18.4 px |
  | 1024 | two columns | 146 px | 17.6 px | 101 px | 11.9 px |
  | 1279 | two columns | 183 px | 21.9 px | 126 px | 24.7 px |
  | 1280 | two columns, `text-sm` line | 183 px | 21.9 px | 126 px | 22.1 px |
  | 1440 | two columns, `text-sm` line | 190 px | 22.9 px | 132 px | 25.5 px |

  - The least room anywhere is 10.7 px, at 360. Criterion 10 asks for 4 px.
  - At 360 the 2 × 2 is 326 px, inside 328 px between the gutters; at 390, 354 inside 358.
  - _Why the cap at 160 px:_ without it, at 1000 px each disc would be 400 px and the 2 × 2 907 px tall, against "type is the largest thing in the hero" (decision 6.3; second review S1). With it, at 768 the 2 × 2 is 363 px under a headline of 249 px.
  - The tightest line from 1024 is "Install, theme, modes". With `text-sm` at 1024 it would keep only 4.4 px, which is why the line is `text-xs` below 1280.
  - The prototype the owner liked set its names near 22 px; at 1440 this is 22.8 px.
  - _Why not `type-section`:_ "Components" at its 56 px step is 328 px wide, in a 190 px disc (EXECUTED (review)).
- **The install line** is a `code-block` with its copy button, given prerendered `lines` (decision 23).
- **"What one command gives you"** shows what `add button` writes into an app and what it brings, generated from `registry.json` (decision 15). It is the system's thesis, shown: source, not a package.
- **The section indexes** list each door's landing and its pages, read from `sitemap.ts`, as hairline rows. No cards.
- **Below 1024 (phone and tablet):** the headline (at 390, `type-poster`'s 56 px floor), the copy, the command (scrolling inside its block), the four doors in a 2 × 2 at the disc rule above, then the indexes stacked.

_A landing._

```
[bar]
███████████████████████████ field-N, full bleed █████████████████████████████
█ Components                                       ┌ glass ──────────────────┐ █
█ 75                                               │ Start with the theme:   │ █
█ parts you can add, each a page                   │ [ add pluto-theme  Copy]│ █
█                                                  └─────────────────────────┘ █
██████████████████████████████████████████████████████████████████████████████
canvas: the landing's own content, then its index
```

The band holds:

- the title, in `type-display`;
- one fact in `type-proof`, where the door has a number;
- one sentence;
- for three doors, a glass panel.

Text in the band is the legend. The glass carries the theme's own roles (R25), and its text is `foreground` and `primary` only. **Every control on a band is inside its glass.** What each band holds:

| Band | Its words | Its glass holds | Controls in the glass | Tab stops in the glass | `svg` outside the glass |
|---|---|---|---|---|---|
| Start | "Start"; "From an empty SvelteKit app to a first Pluto screen." | two `code-block`s in order: `add pluto-theme`, then `add button` (`pluto-theme` brings the three font items itself, `001` decision 17) | 2 copy buttons | 4 (each block's scrolling region and its button) | 0 |
| Components | "Components"; the count from `registry.json` in `type-proof`; "parts you can add, each a page" | one `code-block`: `add pluto-theme`, under "Start with the theme:" | 1 copy button | 2 | 0 |
| Brand | the lockup in the legend, one colour, at `type-display` size; "Pluto Systems is a workspace suite on one governed data layer."; "Work runs on data." | no glass | 0 | 0 | 0 |
| Foundations | "Foundations"; "One token file. Every colour and size comes from it." | three facts generated from the token file: the number of theme roles, the number of primitives, the one radius | 0 | 0 | 0 |

- The Brand band's lockup is the field's legend in all four dots and the word. On the yellow field a four-colour lockup would lose its third dot.
- The Brand band has no glass. The tightest glass row in the system is muted text on dark glass over `field-3`, at 4.60 (`016` decision 5). With no glass on the yellow band, the site never sets text there.
- **Below the band:**
  - Start: the Start guides as rows (017's).
  - Components: a filter field and the eleven groups as headed lists. Each row is the item's title (a link), its description, its modes and its "since". The filter narrows the rows as the visitor types and announces the count in a polite live region. Without scripts every row shows.
  - Brand: the `brand.svelte` template, holding the brand pages as rows (017's), each with one line.
  - Foundations: the foundation pages as rows (017's).
- **Phone:** the band's glass panel stacks below its words.

_A component page_ (decision 10). Quiet.

```
[bar]
● Components / Actions                                       │ On this page
Button                                                        │ Examples
Starts an action. One blue default per surface; …             │ Usage …
┌ facts (flat card) ─────────────────────────────────────┐   │ In Actions
│ [From this site | From GitHub]  [command          Copy] │   │ Tooltip …
│ Since 0.2.0   Modes productive, expressive               │   │
└─────────────────────────────────────────────────────────┘   │
┌ Variants ──────────────────────────── [Light | Dark] ──┐
│   live example                                          │
├─────────────────────────────────────────────────────────┤
│ code                                                    │
└─────────────────────────────────────────────────────────┘
Usage · API · Accessibility · Files you own · Related
```

- The title is `type-section`. The description is the registry's. The facts sit on a flat card (product screens are flat, I5).
- **The rail**, from `lg`: "On this page" (the page's sections) and the group's other items. Below `lg` the rail is gone; the sections are reached by their headings and by a contents disclosure under the title.
- **Phone:** the facts card stacks. The install tabs fill the width, with the command scrolling inside its block. Every frame and every table scrolls inside itself (decision 13), so the page never scrolls sideways.

_The changelog_ uses the leaf template. Each release is an `h2` with its date and an anchor (`#v0-12-0`). Interface changes keep the file's bold marker.

_The 404_ is quiet, on the canvas, with no field.

- It reads "No page here." then "This address doesn't match a page. Search for it, or start from one of the four sections."
- It holds the four door links, each with its dot, and, once scripts run, the search button.
- It carries `<meta name="robots" content="noindex">`.
- Every asset it loads is at an absolute path (decision 21), so it renders at any depth.

_The footer_ is `marketing-footer`, on the canvas, expressive. It holds:

- the lockup and "Work runs on data.";
- one link group per door: its landing and pages, from `sitemap.ts`;
- a group "Registry": the latest `/r/` path, this release's versioned path, the source on GitHub, and `llms.txt`;
- the build facts, as today;
- "Apache-2.0".

**Dark.** Everything follows the theme:

- the fields are the lifted fills, with graphite legends;
- the glass is the dark tint;
- the bar's and the footer's marks are the lifted four.

No element carries `.dark` but `<html>` (R25), except an other-theme frame's own document (decision 12).

### 6. The first risk: four large discs in the mark's colours echo Google

The research warned that four discs at billboard size echo Google's mark (memo §5.2; N1 and M4). The owner kept N1 knowing that it reads close at a glance.

**`016` raises the risk:** the new yellow is nearer Google's logo yellow than amber was.

- By `deltaE` (OKLab × 100), `#E2B000` sits 5.19 from `#FBBC05`, where `#F19E20` sat 7.78 (EXECUTED; `#FBBC05` is the value `decisions.md` measured from memory).
- The blue, red and green sit 15.77, 8.92 and 12.99 from the values commonly given for Google's (also from memory, INFERRED).

So hue is not the answer. These are:

1. **The discs carry words.** Every disc is a labelled door, with its name and one line in the legend, sized to fit at every width (decision 5's table). A logo is a figure without words; a map has names. Google's dots never carry type.
2. **The discs appear at door scale on one page.** Only the home page shows the four together larger than the lockup's own mark.
   - Landings carry one colour each.
   - The Brand colour page (`017`) shows the four as bands: rectangles, not discs.
   - Search, the 404 and the footer use the dots at text size, as bullets.
3. **Type is the largest thing in the hero.**
   - At 1024 px and wider, the 2 × 2 is exactly the headline's height, by construction (decision 5).
   - Below 1024 px the doors sit under the headline, each at most 40% of the width and at most 160 px, so at no width between phone and desktop do they outgrow it.

   The words lead; the map follows.
4. **The map takes the lockup's geometry.** The discs rise beside the headline, with their top at its first cap height, as the mark rises beside "pluto" in E6. Read together, the composition is Pluto's lockup, grown, not a free-standing four-colour figure.
5. **Still, after one entrance.** The most Google-like thing four coloured dots could do is bounce, loop, or move while waiting. The discs play the mark's one entrance on load (decision 8), then stay still. They move again only to answer the visitor: a hover, a focus, a press (J2). No animation repeats; nothing idles.
6. **The canvas and the legends.** The discs sit on the warm canvas or graphite, with Deep Field's measured legends; in dark they are the lifted four. That is the brand's own register. But, as this decision says, it is not a defence on its own.

Each answer is checked (criteria 10 and 11). The design lead judges the whole at checkpoint 0 against the `b-map-home-*` screenshots, in both themes, at 1440 and 390, and again at checkpoint 1 on the committed tokens.

### 7. The second risk: red as the Components colour reads as an error

In light, `destructive-fill` **is** the brand red, `#C92035` (`themes.light`, READ). Error text is `red-text` `#C11E31`, only 1.76 apart by `deltaE` (EXECUTED). So hue cannot keep brand red apart from error red. Place and content do:

1. **The red band is on one page,** the Components landing.
   - No component page carries a field outside an example frame.
   - Two items cannot be shown without fields, and they are the exception. Both show them only inside their example frames:
     - `liquid-glass`: glass needs a field behind it;
     - `pluto-theme`: its fields are its own tokens.

     On `pluto-theme`, the red field is a labelled specimen of `field-2`. Its frame shows the four fields side by side, each named, with no error-like content in that frame.
   - So no destructive button, error alert or invalid field ever sits under a red band.
2. **The red band holds an inventory:**
   - its words are the door's name, the count ("75") and "parts you can add, each a page";
   - it holds no icon outside its glass, and no live example;
   - its one control is the glass panel's copy button.

   An error in this system is words with an icon (`alert`, `status`, `error-summary`). The band is neither.
3. **Errors on the site never use a field.** The 404, an empty search and a failed copy all sit on the canvas, in words, with the `destructive` role and an icon where one is shown.
4. **The door is not red in the bar.** The current door is marked by an underline in the foreground colour, and door names stay in the foreground colour. The red is only the dot.
5. **"Don't" is not red.** A component page's do and don't lists are set in the foreground colour, each headed by its word and an icon (a check, a cross). Red is never the only signal, and here it is no signal at all.
6. **In dark,** the Components field is the lifted coral `#FF9491` with a graphite legend, far from how a dark error looks.

Checked by criterion 11.

### 8. Motion: one entrance per page, springs only for dots

- **Home:** the page's one entrance is the four discs.
  - Each disc docks on `--ease-spring` and fades on `--ease-entrance`, in N1's order.
  - It uses the mark's timings (`--motion-entrance` 900 ms, `--motion-entrance-start`, `--motion-entrance-stagger`) and the theme's `pluto-mark-dock` and `pluto-mark-fade` keyframes, with the disc's own size as its em.
  - The bar's lockup on the home page has no entrance.
- **Every other page:** the bar's lockup plays the entrance once per full load, as today (`006` decision 5). A client-side navigation plays none.
- **Answers:**
  - a disc on hover or focus scales to 1.03 on the spring, over `--motion-micro`, and on press takes `action-press`;
  - the glass edges follow the pointer (`pointerLight`);
  - every other transition is `--motion-micro` or shorter, on `--ease-standard`.
- **Reduced motion:** every duration reads 0 (`pluto-theme`'s rule). The discs and the lockup appear in place, and no view transition runs (decision 9).
- _Why:_ J2 (motion answers the visitor), J4 (springs for the dots only), and §06 of the design book (one entrance per page), as ruled.

### 9. The door opens onto its field

When a visitor follows a door disc on the home page to its landing, the disc grows into the landing's band.

- **How:** a view transition (the browser's View Transitions API, started from SvelteKit's `onNavigate`). The disc and the band share one `view-transition-name`. It runs over `--motion-slide` (220 ms), on `--ease-standard`.
- **When:** only when the browser supports `document.startViewTransition` and `prefers-reduced-motion` is `no-preference`. Otherwise the navigation is plain, and every other navigation is instant.
- _Why:_ it is motion that answers the visitor's own action and shows what changed (J2): the door they chose becomes the room they enter. It is the site's one orchestrated moment.
- **At checkpoint 1 the design lead keeps it or cuts it.** If it reads as a gimmick, it goes, and criterion 27 loses its second sentence.

### 10. The components are rebuilt on one template

Every component page has the same sections, in this order: the when, what, how and who of the best sites (memo §3.3), without tabs.

1. **Header:**
   - the breadcrumb (`breadcrumb` item, with the door's dot first, `aria-hidden`);
   - the title and the registry's description;
   - the facts card: install (decision 16), "Since", "Modes", and "Based on shadcn-svelte's `<name>`" where the item has `meta.stock`.
2. **Examples:** one frame per example (decision 12). Blocks and compositions keep the block viewer (decision 12).
3. **Usage:** when to use it, in two or three sentences; then "Do" and "Don't", two to four short items each (decision 7, point 5).
4. **API:** generated (decision 14).
5. **Accessibility:** the item's keyboard behaviour, its names and roles, and its limits. Today's 50 accessibility sections move here, and items without one get one.
6. **Files you own:** generated (decision 15).
7. **Related:** the items it brings and the items that bring it, generated.

- _Why no tabs:_ tabs hide text from find-in-page and from the Markdown twin, and add a widget to every reference page. A contents rail does the same job without hiding anything.
- _Why no "Checked" row:_ which suites cover which item lives in the tests, and copying it into the page would drift. The Accessibility section links to the Foundations accessibility page (`017`), which says what is checked and what is not.
- **The text `013` and `016` require on item pages moves with it** (review finding 12):
  - `013` requires, on its six pages: the deploy weight; each grammar's disk and gzipped cost; the CSP note; the protanopia limit; and the other sentences its criteria name.
  - `016` reworded the copy of `alert`, `badge`, `chart`, `product-home` and `pluto-theme` ("amber" to "yellow").

  Before the move, 015's builder copies every such sentence, as it stands on the committed tree, into `tests/e2e/fixtures/item-page-sentences.json`, each with the page and the criterion that requires it. After the rebuild, each sentence is on its `/components/` page (criterion 13). "Amber" appears on 0 component pages.

### 11. The pages move from `/items/` to `/components/`, and `/identity/` goes

- `src/routes/(site)/items/` becomes `src/routes/(site)/components/`, with every page rebuilt on decision 10's template. The group keeps its name, `(site)`.
- `src/routes/(site)/+page.svelte` (the catalogue) becomes the home page. The catalogue becomes the Components landing.
- **Removed, with no redirect** (the owner: "nothing is published, no need to redirect"):
  - every `/items/` URL;
  - `src/routes/(identity)/` (16 pages) and `src/lib/identity/`;
  - the six typeface packages only the exhibit imports: `@fontsource-variable/figtree`, `funnel-display`, `funnel-sans`, `instrument-sans` and `geist-mono`, and `@fontsource/ibm-plex-mono`;
  - every exhibit-only rule.

  No `_redirects` file is written.
- `/workbench/code/` is removed by `013` (its decision 18). This specification does not touch it.
- The exhibit's record stays in `context/` and in git history.
- **`src/lib/preview/`** keeps what the views and tests import: `blocks.ts`, `block-viewer.svelte`, `block-page.svelte`, `composition-page.svelte` and their helpers. The page furniture it held (`item-header`, `install-command`, `install-note`, `preview-section`, `specimen`, `eyebrow`) is replaced by `src/lib/site/`, and removed once nothing imports it.

### 12. Both themes on every component page: an example in either theme, in its own document

Constitution §2.3 says every item has a page that shows it in both themes. The page's theme toggle already does that, and both browser projects test every page. This site does more: an example frame has its own **Light | Dark** switch. A visitor sees one example in the other theme without leaving the page.

**How.**

- Every example is a file of its own (decision 13). Each file also has a frameless view at `/example/<item>/<example>/`, under the `(example)` route group, which renders that example alone.
- **The frame's theme travels in its address,** for example `/example/button/variants/?theme=dark`.
  - The `(example)` layout renders its own head script, `src/lib/site/example-theme-script.svelte`. Before first paint, it reads `theme` from `location.search` and sets or clears `dark` on `<html>`, and nothing else.
  - **No Svelte code in `(example)` reads `page.url.searchParams` or `url.searchParams`.** SvelteKit throws when prerendered code reads the query (second review S7). Only the raw head script, which runs in the browser, reads it.
  - The `(example)` layout does **not** import `#lib/registry/ui/theme`. So the frame holds no `Theme` instance: no effect re-applies a stored or system preference on hydration, and no `storage` listener follows the page's toggle (review finding 3, READ `theme.svelte.ts`).
  - The frame's document then stays in the chosen theme until it is replaced.
- **The switch** is a `toggle-group` of two items, "Light" and "Dark".
  - It starts on the page's theme and follows it until the visitor picks; then it holds the pick.
  - When the pick matches the page's theme, the example renders inline, live, in the page.
  - When it differs, the inline example is replaced by a same-origin iframe of the example's view, with `?theme=` set to the pick.
  - The frame is shown once its `body` carries `data-view-ready`, so it never flashes. Its height follows its content (a `ResizeObserver` on the frame's body, read from the page). An example that opens an overlay names a minimum height in its metadata, so the overlay fits inside the frame.
  - Focus stays on the switch. The iframe's title is "<example title>, dark theme" or "…, light theme".
  - If the page's theme then changes to match the pick, the frame goes away and the example is inline again.
- **Examples with no switch:**
  - **An example of an item that brings `theme`** (its `registryDependencies`, followed through, include `theme`): today `theme` and `app-shell`'s parts. Its own toggle changes the page's theme, which a frame cannot hold apart. It shows inline only. The frame says: "This example changes the page's theme, so it shows in the page's theme. Use the theme switch in the bar to see the other."
  - **A code-only example** (`live: false`): there is nothing to theme.
  - **Blocks and compositions** keep the block viewer's iframe, which follows the page's theme as today. The bar's toggle is their switch.

  `examples.test.ts` checks both directions: each example that has no switch is one of these three kinds, and **each example with a switch has an import graph free of `#lib/registry/ui/theme`**, directly or through any registry file it imports (so through `app-shell`'s parts too).

_Why a document, not a light-scoped subtree_ (the research's two options, memo §6.1):

- A light island inside a dark page needs every `.dark` role reset, which a generated class can do. But three more things leak, and a class cannot stop them (READ, `src/app.css` and the items):
  - Tailwind's `dark:` variant is `&:is(.dark *)`. It matches anything under `<html class="dark">`, island or not. `alert` uses it twice.
  - Three `.dark …` descendant rules reach into the island: `.dark .surface-ink` and the two expressive mark rules. The memo's §6.2 met one of them.
  - Overlays portal to `<body>`, outside any island, so they open in the page's theme.
- A frame is a whole document in one theme. Every rule, variant, portal and token read (memo §6.6) resolves as it does in an app.
- Nothing in `pluto-theme` changes. So no installed app is touched, and no third change lands on the theme in a release where `013`, `014` and `016` already change it.
- _Why `/example/`, not `/view/examples/`:_ `blocks.test.ts` pins that no other page sits under `src/routes/(view)/view/`.

The memo's §6.2 mark leak does not arise, because no element on the page carries a light scope. The frame's document carries its example's own `data-mode`, so the dots are right in both themes; criterion 14 reads them.

### 13. Examples are files, so the code shown is the code run

- **Which items have example files:** the 58 items that are not blocks or compositions. The 8 blocks and 9 compositions are shown through their views, as today, and keep them.
- **The file.** Each example is `src/lib/site/examples/<item>/<example>.svelte`. Its module script exports `meta`:
  - `title`;
  - `intro`, one sentence;
  - optionally `frameMinHeight`, and `live: false` for an example that is code only, such as one for `cn`.
- **The page** renders the component and shows its source, read with `?raw`. The source shown is the file with three changes, made by one tested function, `shownSource`:
  - the import paths become those `shadcn-svelte init` writes in a SvelteKit 3 app: `#lib/registry/ui/` becomes `#lib/components/ui/`; `#lib/registry/components/` becomes `#lib/components/`; `#lib/registry/hooks/` becomes `#lib/hooks/`; `#lib/registry/lib/` becomes `#lib/`; and `#lib/utils` stays `#lib/utils`;
  - every `data-testid="…"` attribute is removed;
  - the `meta` export, and any lines between `<!-- site:hide -->` and `<!-- site:show -->`, are removed.
- **Why `#lib`** (third review, T1). This repository pins SvelteKit 3.1.0, which removes `$lib`: any `$lib` import fails with `module_removed_lib`, "Use `#lib` instead" (READ, `node_modules/@sveltejs/kit`, `src/exports/vite/index.js` and `src/messages/build-errors.js`, by the reviewer). SvelteKit 3 apps use a `package.json` `imports` map for `#lib/*`. The locked CLI's `init` writes `#lib` aliases whenever that map is present, and `$lib` otherwise (READ, `node_modules/shadcn-svelte/dist/index.mjs`, by the reviewer). The `kit3` smoke app is that setup; `kit2` is the SvelteKit 2 one.
- **Under every shown source,** one line: "In a SvelteKit 2 app, read `$lib` for `#lib`."
- **Code display.** The first example on a page shows its code open. The rest show it behind a "Show code" `collapsible` that names its line count.
- **Today's test IDs and keyboard fixtures move with their markup** into the example files, unchanged. The page renders them once, inline, so every locator stays strict. A keyboard fixture moves into one example file whole, never split across two.
- **The 390 px overflow is fixed here.** At `v0.11.0`, in both themes, 6 item pages scroll sideways at 390 px and 7 at 360 px (EXECUTED):

  | Page | Width at 390 |
  |---|---|
  | `pluto-theme` | 815 px |
  | `theme` | 629 px |
  | `code-block` | 693 px |
  | `code-editor` | 620 px |
  | `use-highlighted-code` | 580 px |
  | `code-languages` | 620 px |
  | `toggle-group` (at 360 only) | 368 px |

  It predates `014` (`decisions.md`, "After the `014` build's checkpoint"). There are two causes:
  - a `specimen` figure is a column flex box with `items-start`, so a child of `min-w-max` code widens it;
  - wide tables sit in no scroll box.

  In the rebuilt pages, every frame body and every code area is `min-w-0` and scrolls inside itself. Every table sits in a scroll region that is focusable and named (axe's `scrollable-region-focusable`).

### 14. The API table is generated from the item's source

A build-time module, `src/lib/site/api.server.ts`, reads each item's files. It reaches a `.svelte` file's scripts with `svelte/compiler`'s `parse` (pinned through `svelte`), then reads them with TypeScript's parser (`typescript`, pinned).

- **A Svelte component:**
  - the props it destructures from `$props()`, with each default;
  - the members of its props type that the item declares itself, with their JSDoc;
  - inherited props as one closing row: "and every attribute of `<button>`", or "and the props of bits-ui's `Dialog.Content`", named from the type it extends.
- **Types are shown as values a reader can use.** A `VariantProps<typeof xVariants>["key"]` type, directly or through an alias such as `ButtonVariant`, is expanded into the quoted keys of that `tv()` call's `variants.key`: `"default" | "secondary" | "ghost" | "destructive" | "link"`. Any other type is shown as written.
- **A TypeScript file:** its exported functions, classes and types, with their signatures and JSDoc.
- **The layout:**
  - one table per exported part, in the order of the item's `index.ts` (`dialog` has ten);
  - columns: name, type, default, what it does;
  - on a phone each row stacks.
- **A prop with no doc comment** shows its name, type and default, with an empty "what it does". The builder adds no doc comments to items (decision 26).
- **No published item file cites an internal document.** This is a rule, not a list (second review S2): the list of citing lines grows while `013` builds (its new `lib/highlight/roles.ts` and `languages.ts` open with "(013 decision 7)" and "(013 decisions 3 to 6)", EXECUTED (review)).
  - **The rule.** No file under `static/r/` (and so no API row, file view or shown source the site generates from them) matches a **citation pattern**, the list in `src/lib/site/citations.ts`:
    - a three-digit specification number, with or without backticks or a possessive, followed by `decision`, `decisions`, `criterion`, `criteria`, `build`, `checkpoint` or `review`: `` /`?\b\d{3}`?(?:'s)?\s+(?:decisions?|criteri(?:on|a)|build|checkpoint|review)\b/i ``. This catches "(the 010 build's checkpoint 1)" (third review, T6);
    - a three-digit number alone in brackets: `` /\(`?\d{3}`?\)/ ``;
    - an identity or review code in brackets, such as "(K3)" or "(R25)": `/\([A-Z]\d{1,2}\)/`;
    - a review or lint rule named bare, such as "R25" or "L22": `/\b[RL]\d{2}\b/`;
    - "spec" or "specification" followed by a number: `` /\bspec(?:ification)?s?\s+`?\d{3}/i ``.
  - **What the patterns run over** (third review, T3 and T6): the decoded text of each item file, line by line, **and** each comment block joined into one line. A comment block is a run of consecutive `//` lines, one `/* … */` or `/** … */`, or one `<!-- … -->`; joined, its comment markers and line breaks become single spaces. **`citations.ts` finds comment blocks with a tokenizer, not a regular expression** (fourth review, V4): TypeScript's scanner for script and `.ts` text, and `svelte/compiler`'s `parse` for markup comments. So a `/*` inside a string is never read as a comment (there is none today, EXECUTED (review)). So "(012" on one `//` line and "decision 4)" on the next are caught (`marketing-bar.svelte`, lines 42–43).
  - **The enumeration.** At the start of build step 1, on the commit where `016` landed, the builder:
    - runs `bun scripts/site/citations.ts`, which reads every item file and prints each match: the item, the file's path, the line or lines, and the pattern;
    - rewords each in plain words, keeping its meaning, and records it in `tests/fixtures/reworded-comments.json`. Each entry holds the item, the path, `before` and `after`, which may span lines (for a split citation);
    - lists any match that is code, not a comment, under the fixture's `kept`: the item, the path and the exact line text, with its reason. Today there is one: `await sleep(700);` in the `chat` block's page (EXECUTED (review));
    - writes **the base**, the full hash of `016`'s commit, as the fixture's `"base"`. There is no tag: the owner ruled one local tag, `v0.12.0`, and a local tag is in no clone.

    Today's tree holds 23 such lines in 8 files, three bracketed codes such as "(K3)", the split citation and the "build's checkpoint" one in `marketing-bar.svelte`, and `013`'s new ones (EXECUTED (review)). The fixture holds whatever the base holds.
  - **Which comments:** every comment in an item file, not only the ones the API table shows. Every comment ships into the app that installs the item, and a citation of an internal document helps nobody who reads it in their own code.
- _Why generated:_ a hand-written table drifts from the code the visitor installs.
- An item the module cannot read fails its unit test, which names it. There is no hand-written fallback.

### 15. Files you own, and what an item brings

Generated from `registry.json` for each item:

- **Files you own:** each file's target in a SvelteKit 3 app made by `shadcn-svelte init`, through the same alias map as decision 13 (`#lib/components/ui/…` is `src/lib/components/ui/…` on disk, as `$lib/…` is in a SvelteKit 2 app, so the paths hold for both). A `registry:page` file goes at its `target`, under `src/routes/`. A one-line note says: "Paths follow your `components.json`."
- **It brings:** each `registryDependencies` entry, linked to its page, and each npm `dependencies` entry at its specifier.
- **Brought by:** the items whose `registryDependencies` name it.

The smoke test proves the paths. For `button`, `dialog` and `product-home`, the files the CLI writes equal the page's list (criterion 17).

### 16. Install from the site or from GitHub

Every install command is a `code-block` with its copy button, given prerendered `lines`, inside a `tabs` item of two tabs:

- **From this site** (first): `REGISTRY_URL=<SITE_ORIGIN>/v<version>/r bunx --bun shadcn-svelte@1.7.1 add <name> -y`.
- **From GitHub:** today's command, `REGISTRY_URL=https://raw.githubusercontent.com/plutosystemsco/design-system/v<version>/static/r …`.

Both point at a release, by its version. The site already serves `/v<version>/r/` from `static/` (READ, `scripts/build-registry.ts`; EXECUTED, the build holds `v0.4.0` to `v0.11.0`).

**Why this keeps constitution §4.1.** §4.1 says nothing an app installs from here reaches back to this repository at run time. Installing is not run time:

- the CLI fetches JSON on the developer's machine, once, and writes source files into the app;
- those files name neither the site nor GitHub;
- so the app builds, prerenders and serves with both unreachable.

Criterion 18 proves it for the site's path, as the smoke suites already prove it for `/r/` (`013` criterion 21).

**A note on the versioned path before the tag.** Until `v0.12.0` is tagged, every deploy rewrites `/v0.12.0/r/`. So the site's registry paths are not cached as immutable (decision 21).

### 17. The site's own copy: who writes it, and in what voice

- **Generated, so it cannot drift:**
  - every title, description, group, "since", mode, install command, file list, dependency, API row and count, from `registry.json`, the items' source and `package.json`;
  - the changelog page, from `CHANGELOG.md`;
  - every token value, colour and figure, from `tokens/pluto.tokens.json` and `scripts/contrast.ts`;
  - every list of pages, from `sitemap.ts`.

  A colour or a token value never appears in a site file as a literal (criterion 28).
- **Written by hand:** the home and landing copy, each component's usage, do and don't, and the accessibility notes the item lacks.
  - 015's builder drafts them from each item's specification and the decisions behind it.
  - The design lead edits a third of the components' prose at checkpoint 2.
  - The change reviewer reads all 75 against R23 and R24.
- **The voice is the brand's:** L3, warm and human, about the work rather than the tool. The writing rules apply:
  - short sentences, one idea each;
  - sentence case;
  - a term defined the first time it is used;
  - copy says what happens (R23);
  - no arrows, no all-caps, no eyebrow over every heading (R24).

  An action keeps one name through its flow: "Copy" becomes "Copied".
- **Public.** No page cites a specification, a decision, a review, `context/`, or a person (criterion 29). The reasons that matter to a builder are said in the page's own words.

### 18. Search: our own, over a prerendered index

- **The index** is `/search.json`, a prerendered endpoint. It holds two kinds of entry, one type, `SearchEntry`, in `src/lib/site/search/types.ts`:
  - **a page entry:** a path with no `#`; **one per page in `sitemap.ts`**, each path once. A component page's entry takes its title, group and description from `registry.json`; every other entry takes its title, door and summary from `sitemap.ts`;
  - **an anchor entry:** a path with a `#<id>`, pointing at an element with that `id` on a built page, with its own title and summary.
- **The hook.** The endpoint builds the index from every module in `src/lib/site/search/sources/` (an `import.meta.glob`), each exporting `entries(): SearchEntry[]`. The endpoint is a thin wrapper: it passes the modules to a pure function, `buildIndex(sources)` in `search/build-index.ts`, which the unit test calls directly (decision 24). Each source module must load under Bun: no `$app/*`, no `?raw`, no `import.meta.glob`. 015 ships `pages.ts`, the page entries. A later specification registers anchor entries by adding a module there, and edits no line of 015's. `017` adds `tokens.ts`: each theme role and primitive, at `/foundations/tokens/#<name>`.
- **The size.** The index is at most 30 kB gzipped. It is fetched the first time search opens, never before.
- **The palette** is a `dialog` holding an `input` and a list of results, in the combobox pattern:
  - the input is `role="combobox"`, with `aria-controls` and `aria-activedescendant`;
  - each result is `role="option"`, showing its title, its door (the dot and the word) and its summary;
  - ArrowUp and ArrowDown move, Enter opens, Escape closes and returns focus to the button that opened it;
  - a polite live region says "12 results", or "No results for "foo". Try a component's name, or browse the four sections."
- **Opened by** the bar's search button, and by Control-K or Command-K. There is no single-key shortcut (WCAG 2.1.4).
- **Matching** is case-insensitive:
  1. a title that starts with the query;
  2. a word in the title that starts with it;
  3. the summary.

  Ties keep the list's order.
- **With scripts off** there is no search. The bar's search button is rendered by the client into a slot of fixed width, so nothing shifts.
- _Why our own:_ about 100 entries, and about 200 once `017` adds the tokens, need no indexer and no service. The code is ours to test, as the theme mechanism is (`decisions.md`, "The theme mechanism").

### 19. Every page as Markdown, and `llms.txt`

- **The Markdown twin** of a page at `/a/b/` is `/a/b/index.md`; the home page's is `/index.md`. That is `llmstxt.org`'s convention for addresses without a file name (READ, [llmstxt.org](https://llmstxt.org/), 2026-11-14). Each page links:
  - to its twin, with `<link rel="alternate" type="text/markdown">`;
  - to `/llms.txt`, with `<link rel="describedby">`.
- **Twins are made from the built HTML,** after `vite build`, by `scripts/site/markdown.ts`. It reads each page's `<main>` with Bun's built-in `HTMLRewriter` and writes Markdown, so a twin is the page by construction.
  - Building a tree with `HTMLRewriter`, and turning `/items/button/`'s headings, paragraphs and lists into Markdown, took 3.8 ms (EXECUTED).
  - Entities are decoded; the prototype did not.
- **What the converter keeps:**
  - headings, paragraphs and lists;
  - tables, as pipe tables;
  - links, made absolute with `SITE_ORIGIN`;
  - inline code, as code spans: a `<button>` inside it stays text;
  - code blocks, fenced, with their language.
- **Examples:** an example becomes its title, its intro and its shown source, fenced as `svelte`. The example's live markup is marked `data-md="skip"`.
- **What it skips:** anything marked `data-md="skip"` (theme switches, copy buttons, the filter, the rail, live example markup), and everything outside `<main>`.
- **`/llms.txt`** is a prerendered endpoint from `sitemap.ts`, in `llmstxt.org`'s shape:
  - an H1, "Pluto Systems design";
  - a blockquote saying what this is and how to install;
  - one H2 per door, listing its pages as `[title](…/index.md): summary`;
  - an H2 "Registry", with the `/r/` paths;
  - an H2 "Optional", with the changelog.
- _Why from HTML and not from a content model:_ one source, the page. A second renderer of the same content would be a second thing to keep in step.

### 20. `sitemap.xml`, `robots.txt`, and the temporary address

- `/sitemap.xml` is a prerendered endpoint listing every page in `sitemap.ts` at `SITE_ORIGIN`. Views and example views are not listed.
- `/robots.txt` allows everything and names the sitemap.
- **The `workers.dev` host is `noindex`, for good** (decision 21's host rule). The site moves domains with no redirects, so pages indexed at the temporary host would stay as stale duplicates.
  - **When the domain is set, the rule stays** (second review S5). Adding `design.<domain>` as a custom domain does not switch off the `workers.dev` host. It keeps serving the same files. With the rule in place, that copy stays out of search engines, and it stays reachable for the owner's checks.
  - _Why not redirect it to the domain:_ a redirect needs the domain decided first, and a worker script or a redirect rule written for it. _Why not `"workers_dev": false`:_ it removes the address the owner reaches the site by before the DNS is set, and after it.
  - When the domain is set, `SITE_ORIGIN` changes, and `sitemap.xml` and every twin then name the domain.
  - This is a call taken while the owner was away, and open to reversal (`decisions.md`, "The design site's review calls, taken while the owner was away"; For the owner, question 3).

### 21. Deployment on Cloudflare

`wrangler.jsonc` names the worker and states the asset settings it relies on. There is no worker script:

```jsonc
{
  "name": "pluto-systems-design",
  "compatibility_date": "2026-10-27",
  "assets": {
    "directory": "./build",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

- **Absolute asset paths.** `vite.config.ts` sets SvelteKit's `paths.relative` to `false`. By default SvelteKit writes relative asset paths: `/items/button/` loads `../../_app/…` (READ and EXECUTED (review)). `404-page` serves `build/404.html` for any unknown URL, at that URL. With relative paths, `/components/nope/` would fetch `/components/nope/_app/…`, which itself returns the 404 page, so the 404 page would render unstyled and never hydrate. The site is served at its origin's root, and every iframe and twin is same-origin, so absolute paths cost nothing.
- **The 404 page** is prerendered to `build/404.html`: its route sets `trailingSlash = "never"`. `404-page` serves "the nearest `404.html`" with status 404 (READ, [Cloudflare, static site generation](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/), 2026-11-14, by the reviewer).
- **`static/_headers`** has five rules (READ, [Cloudflare, static assets headers](https://developers.cloudflare.com/workers/static-assets/headers/), 2026-11-14):
  - up to 100 rules are allowed;
  - rules match the request's URL, are applied in file order, and combine;
  - a host segment may be a `:placeholder`.

  ```
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
  /_app/immutable/*
    Cache-Control: public, max-age=31536000, immutable
  /view/*
    X-Robots-Tag: noindex
  /example/*
    X-Robots-Tag: noindex
  https://pluto-systems-design.:account.workers.dev/*
    X-Robots-Tag: noindex
  ```

  - The 404 page carries its `noindex` in a `<meta>` tag, since a header rule for `/404.html` would only match a request for that path.
  - The last rule matches any account's `workers.dev` host, so it needs no `<account>`.
- **Caching.** Everything else keeps Cloudflare's default, `public, max-age=0, must-revalidate`, with an ETag (READ, the same page). That includes the registry JSON: correctness comes before speed, since `/v0.12.0/r/` changes with each deploy until the tag, and installs are rare.
- **The Markdown twins' `Content-Type`** comes from Wrangler's reading of the extension (READ, the same page). After the owner's first push, the design lead requests one twin and records its `Content-Type` in the landing notes. If it is not `text/markdown`, a `_headers` rule sets it.
- **The build** runs in Workers CI as today (`WORKERS_CI_COMMIT_SHA`, READ, `vite.config.ts`). `bun run build` gains one step after `vite build`: `bun scripts/site/markdown.ts`.

### 22. Accessibility

- WCAG 2.2 AA in both themes, on every page, at 360, 768 and 1280 px, by axe (constitution §4.4).
- Every page is walked by keyboard:
  - the home page and the Components landing;
  - the bar, on every kind of page;
  - search, and the theme switch on a frame;
  - today's 34 keyboard fixtures, on their new pages.
- Every door, link and control has a visible name that its accessible name contains. The dots on the doors and in the bar are `aria-hidden`; the door's name carries its meaning.
- Every scrolling region is focusable and named. Focus is never hidden under the sticky bar (`data-sticky-bar` sets `scroll-padding-top`).
- Reduced motion, reduced transparency and forced colours are honoured by the theme's own rules (`011`).
- The limits stay as recorded: Firefox, Safari, iOS Safari and screen readers are not checked by this release (`decisions.md`, "After the public-readiness review").

### 23. Performance budgets, measured

**The profile.** Chromium, at 1280 × 900, from a cold cache, with the files served gzipped:

- network throttled through the DevTools protocol to 1.6 Mbps down, 750 kbps up and 150 ms round trip;
- the CPU slowed 4×.

**Measured today** (EXECUTED: the `v0.11.0` build under this profile, 3 runs each, medians):

| Page today | Transfer | LCP | CLS | `.wasm` requests |
|---|---|---|---|---|
| `/` (the catalogue) | 238 kB | 872 ms | 0 | 0 |
| `/items/button/` | 288 kB | 860 ms | 0 | 0 |
| `/items/code-block/` | 253 kB | 868 ms | 0 | 0 |
| `/view/product-home/` (expressive: fields, glass, poster, three faces) | 350 kB | 856 ms | 0 | 0 |
| `/items/product-home/` (the page around that view) | 593 kB | 860 ms | 0.001 | 0 |

The runs agreed within 24 ms. Transfer counts everything loaded until the network is idle, iframes included. The LCP element painted before the web fonts arrived.

**The budgets.** Each is set from the nearest measured page, plus a stated margin. Transfer here excludes iframes and the search index.

| Page | Nearest measured | Transfer | LCP | CLS |
|---|---|---|---|---|
| `/` | `/view/product-home/`, 350 kB | ≤ 400 kB (+14%) | ≤ 1,300 ms (+50%) | ≤ 0.05 |
| `/components/` | the catalogue, 238 kB, plus a band | ≤ 320 kB (+34%) | ≤ 1,300 ms | ≤ 0.05 |
| `/components/button/` | `/items/button/`, 288 kB | ≤ 360 kB (+25%) | ≤ 1,300 ms | ≤ 0.05 |
| `/components/code-block/` | `/items/code-block/`, 253 kB | ≤ 360 kB (+42%) | ≤ 1,300 ms | ≤ 0.05 |

- **At checkpoint 1** the builder measures the four pages with the same script. A budget whose measured median is more than 20% under it tightens to the median plus 20%, recorded in the landing notes. A budget never loosens without the design lead's ruling, recorded in `decisions.md`.
- **No site code block loads the highlighter.** `013` makes a `code-block` given `code` and `language` fetch the tree-sitter runtime (about 115 kB) and the grammar (Bash, 177 kB) in the browser (`013` decision 20). So every code block the site itself renders (install commands, "what one command gives you", shown sources) is given prerendered `lines`, from `highlightCode` in its page's `load`. Criterion 25 counts 0 `.wasm` requests on the four pages.
- **Every example on the four budget pages prerenders its `lines` too** (second review S4). `/components/code-block/` shows no live-highlighting example, as `013`'s C1 already requires of that page (0 references to tree-sitter, `.wasm` or Shiki assets). Live highlighting is shown on the `use-highlighted-code` and `code-editor` pages, which carry no budget.
- **The home page and the landings preload** the latin IBM Plex Sans file, since their poster or display line is the likely LCP element.
- **`perf.spec.ts`** runs in the `light` project only (the `dark` project's `testIgnore: /build-output|perf/`, decision 24), in `mode: "serial"` with one worker, so CPU throttling is not shared with parallel tests. It records all three runs.

### 24. The tests move with the pages

| File | What changes |
|---|---|
| `tests/e2e/pages.ts` | Every item path comes from one helper, `componentPath(name)`. `PAGES` is built from `sitemap.ts`. New: `HOME_STOPS`, `COMPONENTS_STOPS` and `BAR_STOPS`, written against the final markup. |
| `keyboard.spec.ts` | "The catalogue" becomes "the Components landing", with its stops. A new "home" walk. The 34 fixtures (73 stops) run on `/components/<item>/`, counts unchanged. |
| `four-dot.spec.ts`, `keyboard.spec.ts` | The lockup's name: "Pluto Systems design". |
| `viewer.spec.ts` | Both install strings. |
| `axe.spec.ts` | Every page in `PAGES`, at 360, 768 and 1280, in both projects. |
| `theme.spec.ts` | Every page in `PAGES` and every view: one theme script each. The five example views of criterion 6: one example head script, and no `ThemeScript`. |
| `primitives`, `navigation`, `code`, `chat`, `compositions`, `expressive`, `brand` and `tokens` specs | `/items/` paths become `componentPath(…)`. Nothing else. |
| `tests/unit/previews.test.ts` | Pages under `(site)/components/<name>/`. |
| `tests/unit/deps.test.ts` | The six exhibit packages are gone. |
| New, e2e | `site.spec.ts` (overflow, titles, names, the twin links, the 404 at depth, the required sentences); `doors.spec.ts` (decisions 6 to 9); `frames.spec.ts` (decision 12); `search.spec.ts`; `perf.spec.ts`. New fixture: `tests/e2e/fixtures/item-page-sentences.json`. |
| New, unit (source only) | `sitemap.test.ts`, `examples.test.ts`, `api.test.ts`, `files-you-own.test.ts`, `markdown.test.ts` (the converter, on fixture HTML), `search.test.ts` (the index builder and ranking), `changelog-page.test.ts`, `headers.test.ts` (the `static/_headers` file), `site-literals.test.ts`, `registry-comments.test.ts`. New fixture: `tests/fixtures/reworded-comments.json`. |
| New, e2e (the build's output, no page opened) | `build-output.spec.ts`: every check that reads `build/` (criteria 2, 3, 19, 20, 21, 24 and 29's page text). It runs in the `light` project only: `playwright.config.ts` gives the `dark` project `testIgnore: /build-output|perf/` (fourth review, V3). |
| New, smoke | `site-add.test.ts` (decision 16). |

- Every new check is written first and seen failing (`003`'s pattern).
- **`bun run test`'s order** (`package.json`, unchanged): `test:unit`, then `test:e2e`, then `test:smoke`. Playwright's `webServer` runs `bun run build` (which now ends with `scripts/site/markdown.ts`) before any e2e file, then serves `build/` with `vite preview` (READ, `playwright.config.ts`).
- **So no unit test reads `build/`** (third review, T5). On a clean clone, `build/` (git-ignored) does not exist when the unit suite starts. Every check of the build's output is in `build-output.spec.ts`, which runs after the build and opens no page.
- **No unit test imports a module that uses `import.meta.glob` or `$app/*`**, since neither runs under `bun test`. A module with a glob (the search endpoint, `examples.ts`) is a thin wrapper over a pure function: `buildIndex(sources)`, `shownSource(text)`. **A module in `search/sources/` imports no `$app/*`, and uses no `?raw` and no `import.meta.glob`, so `search.test.ts` can import it** (fourth review, V4); it reads what it needs with `node:fs` or plain imports. The unit test calls the pure function, and finds the files it would have globbed with `node:fs` `readdirSync` and `readFileSync`.
- Every count of pages reads `SITEMAP`, filtered by `spec` where a test is 015's alone, never a literal. So `017`'s pages join every suite without an edit to 015's lines.
- `/items/` in `tests/`: 133 occurrences in 14 files today (EXECUTED (review); the first draft said 140). After the move, 0.

### 25. No Content Security Policy in 0.12.0

- `013` found that `web-tree-sitter` needs `'wasm-unsafe-eval'`, and that Vite reports a direct `eval` in it, unmeasured in the browser path (`013` decision 23).
- The theme's head script and the example frames' head script are inline.
- A policy written before those are measured would either break the code pages or allow too much.

So the site ships without one. The Foundations accessibility page (`017`) and the landing notes say so. A later specification adds one, with hashes.

### 26. The changelog: the site, and the reworded comments

The one 0.12.0 entry gains, written last:

- **a short paragraph** about the site: its name, where it lives, installing from its `/r/` path or from GitHub, and that every page has a Markdown twin;
- **one line** in the bullet of each item that the enumeration touched (decision 14): "Comments reworded to drop internal references; no interface change." The list of items is the fixture's, and a test checks that the entry names exactly those items.

**What `static/r/` holds after this build** (review finding 4, second review S2): exactly what `016` leaves, except the reworded comment lines.

- `registry-comments.test.ts` checks two things. **Both parse each `static/r/**/*.json` file and work on its decoded `files[].content`, split into lines** (third review, T3). Each item file's content is one physical JSON line, with its quotes escaped (`\"header\"`), so nothing is matched or replaced in the raw JSON.
  - **The rule:** 0 decoded content lines, and 0 joined comment blocks, match a citation pattern, but for the fixture's `kept` entries, each exempting exactly one decoded line (by item, path and line text). This check runs in every release.
  - **Nothing else moved:** it reads each file at the fixture's `base` with `git show <base>:<path>`, parses it, and applies each of the fixture's rewordings to the matching decoded `content`. The result must deep-equal the file now: every field, and every content line. A file the fixture does not name must deep-equal as it stands.
    - It runs only while `package.json`'s `version` is `0.12.0`. After that it skips, printing why: it guards this change, not later ones.
    - **It skips only in a shallow clone** (fourth review, V1): when `git rev-parse --is-shallow-repository` prints `true`, it skips, printing why. Otherwise an absent `base` (a wrong or abbreviated hash, or a rebased branch) **fails** the test, naming the hash.
  - It is a unit test: it reads `static/r/`, which is committed, never `build/`.
- _Why reword rather than strip in the generator:_ the comments ship to every app that installs those items. And a generator that silently edits what it shows would make the page disagree with the installed file.

## Design

### Where the files go

```
src/lib/site/
  site.ts                 SITE_ORIGIN, the name, the version
  sitemap.ts              the one list of pages (decision 1)
  doors.ts                the four doors: name, field, dot, path, line; the two ratios
  site.css                the site's only stylesheet, inside @layer components
  example-theme-script.svelte   the frame's head script (decision 12)
  chrome/                 bar.svelte, door-link.svelte, footer.svelte, breadcrumb.svelte, rail.svelte, search.svelte
  page/                   landing.svelte, component.svelte, leaf.svelte, brand.svelte,
                          band.svelte, facts.svelte, install.svelte, frame.svelte, theme-switch.svelte,
                          usage.svelte, api-table.svelte, files.svelte, related.svelte
  examples/<item>/<example>.svelte     for 58 items
  examples.ts             the glob, meta, shownSource
  api.server.ts           decision 14
  files.ts                decision 15, the alias map shared with shownSource
  changelog.server.ts     CHANGELOG.md to sections
  search.ts               matching and ranking
src/routes/(site)/
  +layout.svelte          the bar, main, the footer; one ThemeScript
  +page.svelte            home
  start/  components/  brand/  foundations/  changelog/   +page.svelte each
  components/<name>/+page.svelte   75
  404/+page.svelte        trailingSlash "never"
  search.json/  llms.txt/  sitemap.xml/   +server.ts each
src/routes/(example)/
  +layout.svelte          the example head script; no ThemeScript; no chrome
  example/[item]/[example]/+page.svelte   entries from the glob
src/lib/site/citations.ts   the citation patterns (decision 14)
src/lib/site/search/types.ts, search/sources/pages.ts   the index and its hook (decision 18)
src/lib/registry/**   comment lines only, as enumerated (decision 14)
scripts/site/citations.ts   the enumeration
scripts/site/release-check.ts   the placeholder check before the tag
tests/e2e/build-output.spec.ts   every check of build/
tests/fixtures/reworded-comments.json
scripts/site/markdown.ts
static/_headers  static/robots.txt
wrangler.jsonc            name "pluto-systems-design", the asset settings
vite.config.ts            paths.relative false
tests/e2e/fixtures/item-page-sentences.json
```

### The ownership table for 0.12.0

Each specification builds on the one before it, committed to `release/0.12.0`. No two builds hold the tree at once.

| File or area | 014 | 013 | 016 | 015 | 017 |
|---|---|---|---|---|---|
| tokens, `build-tokens.ts`, `src/app.css`, `pluto-theme`, contrast rows | ✓ | ✓ | ✓ | | |
| code items, `highlighter`, `code-languages` | ✓ | ✓ | | | |
| item files holding a citation (as of `016`'s commit) | | | | comment lines only | |
| the six code item pages | ✓ | ✓ | | moves and rebuilds | |
| `alert`, `badge`, `chart`, `product-home`, `pluto-theme` item pages | | | copy | moves and rebuilds, keeping `016`'s copy | |
| every other item page | | | | moves and rebuilds | |
| `(workbench)`, `src/lib/workbench/` | | removes | | | |
| `(identity)`, `src/lib/identity/`, the six exhibit fonts | | | | removes | |
| `src/lib/site/`, its templates, the `(site)` layout, home, landings, changelog, 404 | | | | ✓ | new pages only |
| `tests/e2e/pages.ts`, the `axe`, `keyboard` and `theme` specs | ✓ | ✓ | | ✓ | via the page list |
| `keyboard`, `site`, `doors`, `perf`, `build-output` specs; `site-add`, `deps`, `search`, `sitemap` tests | | | | ✓ | appends `describe` blocks |
| `src/lib/site/search/sources/` | | | | `pages.ts` | adds `tokens.ts` |
| `package.json`, `bun.lock` | version | 20 packages | | 6 removed | 2 added |
| `CHANGELOG.md`, the 0.12.0 entry | ✓ | ✓ | ✓ | a paragraph and the reworded items' lines | one sentence |
| `wrangler.jsonc`, `vite.config.ts`, `static/_headers` | | | | ✓ | |

## Scope

**In** (the work to *built*):

- `src/lib/site/`, its four templates, and the `(site)` and `(example)` route groups;
- the home page, the four landings, the 75 component pages and their example files, the changelog page and the 404 page;
- the search index and palette; the Markdown build; `llms.txt`, `sitemap.xml` and `robots.txt`;
- `static/_headers`, `wrangler.jsonc` (with the worker's new name), `vite.config.ts`'s `paths.relative`, and `package.json`'s build script;
- removing `/items/` and `/identity/`, `src/lib/identity/`, the six exhibit packages, and the page furniture in `src/lib/preview/` that nothing imports;
- the reworded comment lines of decision 14, and their fixture;
- the tests of decision 24; the paragraph, and the reworded items' lines, in the 0.12.0 changelog entry.

**The step to *done*** is the shared release: the criteria met here, the change reviewed and committed to `release/0.12.0`, and `v0.12.0` tagged locally, after the change reviews of `013`, `014`, `015`, `016` and `017`.

**Out:**

- Start, Brand and Foundations leaf pages; the downloads; the figures drawn to measure; the token entries in search (`017`).
- Any token, theme or registry item interface change; the yellow (`016`).
- Doc comments added to items.
- Redirects, a CSP, a search service, and `Accept`-header negotiation for Markdown (that needs a worker script).
- A per-item release history and a launch page (the owner's ruling).
- Product icons and a signature device, which stay open.
- Firefox, Safari, iOS Safari and screen readers.
- Renaming the worker in the Cloudflare dashboard (the owner's step).

## Acceptance criteria

Each is a count, checked by the command or test named. Every command runs under Bun. "Every page" means every entry in `SITEMAP`; with 015 alone that is 81. Criteria 1 to 30 make 015 *built*; criterion 31 makes it *done*.

1. **Install and checks.**
   - On a clean clone, `bun install --frozen-lockfile` exits 0.
   - `deps.test.ts` finds 0 of the six exhibit packages, and no package this specification adds.
   - `bun run check` reports 0 errors and 0 warnings.
   - `bun run lint` exits 0.
   - `bun scripts/lint-literals.ts` exits 0, with 0 violations.
2. **One list of pages.**
   - `sitemap.test.ts`: the entries tagged `"015"` are 81 (home, 4 landings, 75 components, and the changelog), and 0 paths are duplicated.
   - `build-output.spec.ts`: every HTML page in `build/` outside `/view/`, `/example/`, `/r/`, `/v*/` and `404.html` is an entry, and every entry has a built page.
3. **The URLs.**
   - `build-output.spec.ts`, in `build/`: 75 of 75 `components/<name>/index.html`; 0 files under `items/`, `identity/` or `workbench/`; no `_redirects`.
   - `src/routes/(identity)/` and `src/lib/identity/` are absent.
   - `previews.test.ts`: 75 of 75 items have `src/routes/(site)/components/<name>/+page.svelte`.
4. **No old address.** A unit test finds 0 occurrences of `/items/` in `src/`, `tests/` and `scripts/` (133 in `tests/` today).
5. **The name.** `four-dot.spec.ts` and `site.spec.ts`, in both projects:
   - the bar's lockup link is named "Pluto Systems design" on every page;
   - every page's `<title>` ends "| Pluto Systems design", but the home page's, which is exactly "Pluto Systems design";
   - 0 occurrences of "Pluto Systems design system" in `src/routes/` and `src/lib/site/`.
6. **One theme script.** `theme.spec.ts`, both projects:
   - exactly 1 `ThemeScript` on every page and every view in `pages.ts`;
   - on the first example view of each of `button`, `alert`, `dropdown-menu`, `chart` and `code-block`: exactly 1 example head script and 0 `ThemeScript`.
7. **axe.** `axe.spec.ts`: 0 violations on every page at 360, 768 and 1280 px, in both projects (486 scans for 015's 81 pages), and on criterion 6's five example views at 1280, in both.
8. **Keyboard.** `keyboard.spec.ts`, both projects:
   - the home page's `HOME_STOPS` and the Components landing's `COMPONENTS_STOPS`, in order, each with the ring unclipped;
   - the bar's `BAR_STOPS` on three kinds of page: a landing, a component page, and the changelog;
   - the 34 fixtures holding 73 stops, on their `/components/` pages;
   - Enter on the first item row opens `/components/pluto-theme/`.
9. **No sideways scroll.** `site.spec.ts`: `scrollWidth` equals the viewport's width on every page at 360 and at 390 px, in both projects. Today 7 item pages fail at 360 and 6 at 390 (EXECUTED).
10. **The doors, against the Google echo** (decision 6). `doors.spec.ts`, both projects. On `/`:
    - 4 door links, each holding its door's name as visible text and as its accessible name, in N1's order;
    - elements that carry `field-1` … `field-4` and have a radius of half their width appear on 1 page (`/`);
    - at 1024 and 1440 px, the doors' block is no taller than the headline, and its top is within 0.1 em of the headline's first cap height;
    - at 360, 390, 768 and 1023 px, each disc is at most 40% of the viewport's width and at most 160 px, and lies below the headline;
    - at 360, 390, 768, 1024, 1280 and 1440 px, every corner of the name's box and of the line's box lies inside its disc, at least 4 px from its edge;
    - each focused disc's outline computes `--surface-ring` and measures 3:1 or more against the canvas;
    - 2 s after load with no input, `document.getAnimations()` holds 0 running animations.
11. **The red door, against the error reading** (decision 7). `doors.spec.ts`, both projects:
    - outside `/`, `field-2` appears on 1 page (`/components/`, its band);
    - outside example frames, 0 elements carry `field-1` … `field-4` on the 75 component pages, the changelog and the 404;
    - inside frames, fields appear only on `liquid-glass` and `pluto-theme`;
    - the Components band holds 0 `svg` outside its glass, 0 example frames, and 1 control (the copy button, inside the glass);
    - the bar's current-door link computes its text colour and its underline to `--foreground`;
    - the "Do" and "Don't" headings compute to `--foreground` on 75 of 75 pages.
12. **The landings and the mark.** `doors.spec.ts`, both projects:
    - each landing's band carries its field;
    - its text computes to the field's legend, and its glass's text to the theme's own roles (`011` criterion 11's reading);
    - every control on a band is inside its glass, and the counts are decision 5's table: Start 2 controls (4 tab stops), Components 1 (2), Brand 0, Foundations 0;
    - `svg` outside the glass: 0 on each band;
    - the Brand band holds no glass.

    **The mark on fields:**
    - on every page, scrolled to the top and with the bar over each band, every `four-dot` whose dots compute 4 distinct colours has, as its nearest painted ancestor, the canvas, a card or a glass, never an element that carries `field-1` … `field-4`;
    - the Brand band's lockup computes all 4 dots and its word to `--field-3-foreground`.
13. **Examples are files, and nothing required is lost.**
    - `examples.test.ts`:
      - each of the 58 items that are not blocks or compositions has at least 1 example file, and the count of files is printed and recorded;
      - for 10 named examples, `shownSource` gives the expected text;
      - 0 shown sources hold `data-testid`, `#lib/registry/`, `$lib` or `site:hide`, and every shown source is followed by the SvelteKit 2 line;
      - every example with no switch is of decision 12's three kinds;
      - every example with a switch has an import graph free of `#lib/registry/ui/theme`;
      - 0 files under `src/routes/(example)/` read `searchParams`.
    - `site.spec.ts`:
      - 58 of 58 such pages render at least 1 frame, and the first frame's code is open;
      - the 17 block and composition pages render their viewer;
      - every sentence in `item-page-sentences.json` is on its `/components/` page;
      - "amber" is on 0 component pages.
14. **Either theme, in a frame** (decision 12). `frames.spec.ts`, both projects, on `button`, `alert`, `dropdown-menu`, `four-dot`, `chart` and `code-block`:
    - choosing the other theme replaces the inline example with 1 iframe;
    - that iframe's address holds `?theme=` set to the pick;
    - its `<html>` has the chosen class, and its example's ground computes the chosen theme's colour;
    - it is visible only after `data-view-ready`;
    - focus stays on the switch;
    - the frame **keeps the pick** after each of: its hydration, a press of the page's own theme toggle, and `emulateMedia({ colorScheme })` flipping the system theme;
    - choosing back restores the inline example, with 0 iframes;
    - the `alert` frame's background is the light value on a dark page, and the dark value on a light page;
    - the `dropdown-menu` frame's open menu computes the chosen theme's `--popover` and lies within the frame;
    - the `four-dot` frame's dots are the four in light and paper in dark (productive);
    - on the `theme` page, the example has no switch and shows decision 12's sentence.
15. **API.** `api.test.ts`:
    - the module reads every `.svelte` and `.ts` file of every item, with 0 failures;
    - `button`'s table lists `variant` (type `"default" | "secondary" | "ghost" | "destructive" | "link"`, default `"default"`), `size` (default `"default"`) and `busy` (default `false`, with its doc comment);
    - `dialog` has one table per part, in `index.ts`'s order;
    - `marketing-bar`'s table lists its 8 props;
    - 0 API rows match a citation pattern (decision 14).

    `site.spec.ts`: 75 of 75 pages show an API section.
16. **Files you own.** `files-you-own.test.ts`:
    - for 75 of 75 items, the list equals `registry.json`'s files through the alias map;
    - "It brings" and "Brought by" agree with `registryDependencies` in both directions.
17. **The paths are true.** `site-add.test.ts`: for `button`, `dialog` and `product-home`, the files the CLI writes in the `kit3` app equal the page's "Files you own" list.
18. **Install from the site, then offline.** `site-add.test.ts`:
    - `build/` is served on a local port;
    - `add pluto-theme button dialog -y`, with `REGISTRY_URL=http://localhost:<port>/v0.12.0/r`, exits 0;
    - the server is stopped;
    - the app's `vite build` and `svelte-check` pass with 0 errors;
    - the installed files hold 0 occurrences of the local origin, of `SITE_ORIGIN`'s host, and of `raw.githubusercontent.com`.

    `viewer.spec.ts`: each component page shows 2 install commands, the site's first, each string exact, with `SITE_ORIGIN` as configured.
19. **Markdown twins.** `markdown.test.ts`: 12 fixture pages, as HTML strings, convert to their expected Markdown. `build-output.spec.ts`, after the build:
    - every page has `index.md`;
    - each twin holds as many headings as its page's `<main>` has outside `[data-md="skip"]`, with the same text in each;
    - each twin holds 0 HTML tags outside code spans and fences;
    - 75 of 75 component twins hold the shown source of each of their examples, fenced as `svelte`;
    - every page carries `rel="alternate" type="text/markdown"` and `rel="describedby"` links that resolve.
20. **`llms.txt`.** `build-output.spec.ts`:
    - it starts with the H1 "Pluto Systems design" and a blockquote;
    - it holds 4 door sections, "Registry" and "Optional";
    - it links every page's twin exactly once;
    - every link resolves to a built file.
21. **Search.**
    - `search.test.ts`, from source:
      - `buildIndex`, given every module that `readdirSync` finds in `search/sources/` (015 ships 1), returns page entries that equal the page list, each path once (81 for 015);
      - "dial" ranks Dialog first, and "but" ranks Button first.
    - `build-output.spec.ts`, on `build/search.json`:
      - its entries without a `#` equal the page list, each path once;
      - every entry with a `#` points at an element with that `id` on its built page (0 for 015);
      - it is at most 30 kB gzipped.
    - `search.spec.ts`, both projects:
      - no request for `/search.json` is made before the palette opens;
      - Control-K and Command-K open it, with focus in the input;
      - ArrowDown then Enter opens a result;
      - Escape closes it and returns focus;
      - the live region reads the count, and "zzzz" gives the empty message;
      - axe finds 0 violations with it open.
22. **The changelog page.** `changelog-page.test.ts`:
    - every `##` release heading of `CHANGELOG.md` is one section with an id (`v0-12-0` …);
    - the page's text equals the file's, with the Markdown syntax removed.
23. **The 404, at any depth.**
    - `build/404.html` exists, loads every asset from an absolute `/_app/` path, holds the 4 door links, no field, and `<meta name="robots" content="noindex">`.
    - `site.spec.ts` serves `build/` with a small `Bun.serve` that answers unknown paths with `404.html` and status 404, as `404-page` does. It requests `/nope/`, `/components/nope/` and `/a/b/c/`. Each answers 404 and computes the canvas background. Each shows the four door links, and, after hydration, the search button. axe finds 0 violations on `/components/nope/` in both projects.
24. **Worker, headers and crawlers.**
    - `wrangler.jsonc` reads `"name": "pluto-systems-design"`, `./build`, `auto-trailing-slash` and `404-page`.
    - `vite.config.ts` sets `paths.relative: false`.
    - `headers.test.ts`: `static/_headers` parses into decision 21's 5 rules, with fewer than 100 rules and at most 2,000 characters a line.
    - `build-output.spec.ts`: `build/_headers` equals `static/_headers`; `sitemap.xml` lists every page at `SITE_ORIGIN`, none under `/view/` or `/example/`; `robots.txt` names it.
25. **Budgets.** `perf.spec.ts`: Chromium, decision 23's profile, the `light` project, serial, 3 runs each.
    - The median of each of the 4 pages is within its transfer, LCP and CLS budgets, as set or tightened at checkpoint 1.
    - Each page makes 0 `.wasm` requests.
    - All runs are recorded.
26. **Overflow regions.** `site.spec.ts`: on the 7 pages that overflowed at `v0.11.0`, every element that scrolls sideways is focusable and has an accessible name.
27. **Reduced motion and the door transition.** `doors.spec.ts`, both projects:
    - with `reducedMotion: "reduce"`, 0 animations run on `/` and on `/components/dialog/` at any time;
    - following the Start disc starts 0 view transitions.

    Without it, following the Start disc starts 1 view transition, and following a bar link starts 0. (The second sentence is struck if decision 9 is cut at checkpoint 1.) The `spinner` and `skeleton` pages are not counted: their items animate by design, under their own reduced-motion rules.
28. **Tokens are the one source, on the site too.** `site-literals.test.ts`, over `src/lib/site/`, `src/routes/(site)/` and `src/routes/(example)/`:
    - 0 hex, `rgb(`, `hsl(` or `oklch(` colour literals;
    - 0 arbitrary pixel values (`-[12px]`);
    - 0 `<style>` blocks in any `.svelte` file;
    - every rule in `site.css` inside `@layer components`.
29. **Public.** `build-output.spec.ts` (which reads the build, so it is not a unit test), over the site's own words: the text of every built page's `<main>`, every twin, every API row and every file list. 0 matches of:
    - `decisions.md`, `context/`, `reviews/`, `spec review`, `change review` or `specification`;
    - any citation pattern of decision 14;
    - any author name in `git log --format=%an`, read when the test runs.

    **What it does not read,** so that criteria 22 and 29 both pass (third review, T4; fourth review, V2):
    - **On `/changelog/` and its twin, two patterns only.** Every other pattern is read there, so a citation such as "(013 decision 7)" written into the changelog still fails. The two skipped:
      - **the bare R/L rule pattern.** Criterion 22 requires the page to reproduce `CHANGELOG.md` verbatim. The file names lint rules ("L1 to L21", "L15", "L19"), which are public facts of `scripts/lint-literals.ts`.
      - **the literal `context/`.** The file's 0.7.1 entry says "The documents under `context/` are rewritten so each stands alone" (EXECUTED, a grep of `CHANGELOG.md` against criterion 29's list on 2026-11-15: this is its only other hit). `context/` is a folder of this public repository, named in a released entry that is not rewritten.
    - **Code blocks.** Every `<pre>` element and every `[data-slot="code-block"]` element is removed from a page's `<main>` before its text is read; every fenced block is removed from a twin. So an example's shown source, such as `chat`'s `await sleep(700);`, is code, not prose. Inline `<code>` in prose is still read.

    Published item files are held to the same patterns by `registry-comments.test.ts` (decision 26), including their code, line by line, with the fixture's `kept` lines exempt.
30. **Suites, documents, checkpoints and walk.**
    - On a clean clone, `bun run test` exits 0: unit, browser in both projects, and smoke. Only decision 24's named changes are made to existing tests.
    - `registry-comments.test.ts` passes both checks (decision 26), against the fixture's `base` commit. The landing notes record whether the release-scoped check ran or skipped, and why.
    - The 0.12.0 entry's lines for reworded comments name exactly the items in `reworded-comments.json`.
    - `CHANGELOG.md`'s 0.12.0 entry holds decision 26's paragraph.
    - The landing notes record:
      - checkpoints 0, 1 and 2, with the design lead's rulings;
      - the example count;
      - the budgets' figures;
      - the development walk over every page in both themes at 1440 and 390 px, with 0 page errors and 0 console errors or warnings.
31. **Released.**
    - The change is reviewed, the review is cited in the landing notes, and the change is committed to `release/0.12.0`.
    - `v0.12.0` is tagged locally once, after the change reviews of `013`, `014`, `015`, `016` and `017`. Before tagging, the design lead runs `bun scripts/site/release-check.ts`, which exits 0 only when `SITE_ORIGIN` holds no `<account>` placeholder.
    - After the owner's first push, the design lead requests five addresses at `SITE_ORIGIN` and records each status and `Content-Type`:
      - `/` (200);
      - `/components/button/index.md` (200, `text/markdown`);
      - `/llms.txt` (200);
      - `/v0.12.0/r/styles/maia/button.json` (200);
      - an unknown path (404).

## Build order

One builder, on `release/0.12.0` with `013` and `016` committed. Tests go with each step and are seen failing first.

0. **Checkpoint 0, alongside `013`, outside the tree.**
   - Throwaway pages, in the session's scratch folder, reading the built stylesheet and fonts: the home page, the Components landing and the Button page, at 1440 and 390, in both themes.
   - They carry `016`'s values set by name (decision 3).
   - **The design lead** looks in the browser and rules on decisions 6 and 7: the discs' size, rise and words; the red band's content. Rulings go to `decisions.md`.
1. **The frame.** First, on the commit where `016` landed: the citation enumeration, its rewordings, and the fixture with that commit's hash as its `base` (decision 14). Then:
   - `sitemap.ts`, `doors.ts`, `site.css`, the four templates, the bar, the footer and the `(site)` layout;
   - the home page, the four landings, the changelog page and the 404;
   - `wrangler.jsonc`, `vite.config.ts` and `_headers`;
   - the sentence fixture, taken before anything moves; then the move to `/components/`, with today's page content inside the new header;
   - the removal of `/identity/` and the six packages;
   - the test migration of decision 24: paths, names, `pages.ts` and the walks.

   Criteria 1 to 12, 22 to 24 and 27.
   - **Checkpoint 1.** The builder stops and reports. The design lead looks, in the browser, at `/`, the four landings, `/components/button/`, `/components/alert/` and `/components/pluto-theme/`, at 1440, 1024 and 390, in both themes. On the committed tokens, the design lead judges:
     - the entrance, and the stillness after it;
     - the door transition (kept or cut);
     - the doors' words;
     - the red band;
     - the yellow band, with no glass;
     - the bar's current door;
     - a component page with no field, and `pluto-theme`'s framed fields.

     The builder then measures the four budget pages, and the budgets tighten (decision 23).
2. **The components, deepened.**
   - The example files and the frames (decisions 12, 13);
   - the API (14);
   - the files and related items (15);
   - install (16);
   - the usage prose and the accessibility notes (17);
   - the overflow fixes.

   Criteria 13 to 18, 26 and 28.
   - **Checkpoint 2.** The design lead:
     - reads `button`, `dialog`, `code-block`, `chart`, `pluto-theme` and `product-home` at 1440 and 390, in both themes;
     - switches a frame on each, and toggles the page's theme with it open;
     - edits the usage prose of 25 items against R23 and R24.
3. **The machinery.**
   - Search, the Markdown build, `llms.txt`, `sitemap.xml` and `robots.txt`;
   - the budgets, the public check, and the changelog lines;
   - the full suites and the development walk.

   Criteria 19 to 21, 25, 29 and 30.

**If time runs short,** nothing is deferred. The door transition (decision 9) may be cut at checkpoint 1; that is a ruling, not a deferral.

## Risks

- **The frames** are new browser behaviour. Criterion 14 reads the frame's theme after hydration, after the page's toggle, and after a system-theme flip. A frame that still reverts fails there.
- **The fixture migration.** 177 test IDs and 34 keyboard fixtures move into example files. A fixture split across two examples breaks its walk; decision 13 forbids the split, and criterion 8 walks every fixture.
- **The API generator** may meet a prop shape it cannot read. The unit test names the item. The builder then writes a type the module can read in the item (an interface-neutral change, added to decision 14's table and the changelog), or extends the module. There is no hand table.
- **Iframe height and overlays.** An overlay opened inside an other-theme frame can outgrow it. The example's `frameMinHeight` holds it, and criterion 14 checks the menu. A dialog inside a frame fills the frame, not the window: that is the example, in a box.
- **The Markdown converter** sees only the vocabulary the site's components emit. A new component that emits something else fails `build-output.spec.ts`'s "0 HTML tags" check, loudly.
- **The usage prose,** 75 items' worth, is drafted by the builder. Checkpoint 2 edits a third of it, and the change reviewer reads it all.
- **The yellow.** The site is designed on `016`'s values. If `016`'s review moves them, criterion 12's figures move with the token file. The Brand band has no glass, so the narrowest glass row (muted text on dark glass over `field-3`, 4.60) is never set on this site.
- **The Google echo** is answered, not removed. N1 keeps it at mark size, which was the owner's choice, and `016` brings the yellow closer. Decision 6 keeps it from growing at billboard size.

## For the owner

These are hand-off steps, not blockers. The build proceeds without them; criterion 31's deploy check waits on them.

1. **The worker, in the Cloudflare dashboard.** Rename the worker `pluto-design-system` to `pluto-systems-design`, or create it under that name, and reconnect Workers Builds to it, before the first push of this change. Workers Builds fails a build whose `wrangler.jsonc` name differs from the dashboard's (decision 4).
2. **The `<account>` part of `pluto-systems-design.<account>.workers.dev`.** It goes into `SITE_ORIGIN` (decision 4). Until then the constant holds the placeholder, and the release check keeps it from reaching the tag.

Three calls were taken by the design lead while the owner was away (`decisions.md`, "The design site's review calls, taken while the owner was away"). Each is asked here, with the option taken first. The build proceeds on the taken option; a reversal is a small change to the named decision.

3. **The temporary address and search engines** (decision 20).
   - **(a) Taken:** `noindex` on the `workers.dev` host, kept after the domain is set. That copy never competes with the domain in search results, and it stays reachable for checks.
   - (b) Index the `workers.dev` address until the domain is set, then add the `noindex` rule.
   - (c) Once the domain is set, redirect the `workers.dev` host to it (needs the domain first, and a redirect rule or worker script).
4. **Internal references in published item comments** (decisions 14 and 26).
   - **(a) Taken:** every comment in a published item file that cites a specification, a decision or a review code is reworded in plain words in 0.12.0. Apps that update those items get the new comments, and the changelog names the items.
   - (b) Reword only the doc comments the site's API tables show; leave the rest.
   - (c) Leave every comment; the generator hides citations on the site only.
5. **"On colour and on paper" for the downloads** (`017` decision 4).
   - **(a) Taken:** three colourways for the mark and for the lockup: colour (for paper and light grounds), paper (for the blue, red and green fields and dark grounds), ink (for the yellow field and one-colour print).
   - (b) Two: colour and paper only, with no file for the yellow field.
   - (c) Four: add the lifted four with a paper word, for dark expressive pages.

## Review dispositions

From [`../reviews/015-the-design-site-spec-2026-11-14.md`](../reviews/015-the-design-site-spec-2026-11-14.md). The first review's findings are 1 to 23; the second review's are S1 to S7, below them.

1. **High, the worker rename.** Fixed. Decision 4 and decision 21 set `"name": "pluto-systems-design"`; criterion 24 reads it; `SITE_ORIGIN`'s placeholder is `https://pluto-systems-design.<account>.workers.dev`; the dashboard step is For the owner, item 1.
2. **High, door names do not fit their discs.** Fixed, by a design call. The name is 0.12 of the disc's diameter (container query units), and the line is `text-xs` below 1280 and `text-sm` from it. At 390, 1024 and 1440, the least room any line's corner keeps to the disc's edge is 16.5, 11.7 and 25.4 px (EXECUTED; decision 5's table). Criterion 10 checks every corner at all three widths. _Why not grow the discs:_ "type is the largest thing in the hero" is an answer to the Google echo, so the disc stays bounded by the headline, and the words fit the disc instead.
3. **High, the frame reverts.** Fixed. The theme travels as `?theme=`. The `(example)` layout has its own head script and never imports the theme module, so no `Theme` instance exists in the frame. Examples of items that bring `theme` show inline with a sentence. Criterion 14 reads the frame after hydration, the page's toggle and a system flip.
4. **High, JSDoc citations and `static/r/`.** Fixed, by a design call (the coordinator's framing). The five prop doc comments the API table would show are reworded, named line by line in decision 14. No other comment is added or changed. `static/r/` equals what `016` leaves but those five lines in six files, checked by `registry-comments.test.ts`. The changelog says so (decision 26). Criterion 29 runs over the API rows. (Superseded by the second review's S2: the closed list became a rule over every published comment.)
5. **High, the 404 below the root.** Fixed. `paths.relative: false` (decision 21). Criterion 23 serves `build/` with a 404 fallback and requests three depths. "Holds the search button" became "after hydration".
6. **High, fields on two component pages.** Fixed. Decision 7 names the exception: fields inside example frames on `liquid-glass` and `pluto-theme` only. The red swatch is a labelled `field-2` specimen. Criterion 11 counts fields outside frames.
7. **Medium, stale build order and owner questions.** Fixed. Decision 3 now follows "Commits per specification": committed to `release/0.12.0` as each lands, tagged locally once after the five change reviews, nothing pushed. The build-order question is dropped. The address question is narrowed to `<account>`. `014` is in every tag list.
8. **Medium, the 015/017 boundary.** Fixed. 015 builds `leaf.svelte` (used by its changelog) and `brand.svelte` (used by the Brand landing). Every count reads `SITEMAP`. 017 appends `describe` blocks to six named files (the review's five, and `perf.spec.ts` for its one budget) and edits no line of 015's (decision 2; the ownership table).
9. **Medium, the bands' controls.** Fixed. Decision 5's table states each band's glass contents, controls, tab stops and `svg` count. Start has two commands. Criteria 11 and 12 count `svg` outside the glass.
10. **Medium, search doubles components.** Fixed. One entry per page; component entries take the registry's group and description. The token entries move to `017`.
11. **Medium, unmeasured budgets.** Fixed. Measured under the profile (EXECUTED, decision 23's first table). The budgets are set from the nearest measured page plus a stated margin, and tighten at checkpoint 1. Every site code block takes prerendered `lines`. Criterion 25 counts 0 `.wasm`. `perf.spec` runs serially, in one project.
12. **Medium, text `013` and `016` require.** Fixed. The sentence fixture is taken before the move and checked after it. "Amber" is on 0 component pages. `016`'s five pages are in the ownership table.
13. **Medium, counts.** Fixed. Views are "every view in `pages.ts`" (45 after `013`); `/items/` is 133; `_headers` is 5 rules, with the `404.html` rule dropped (finding 15) and the host rule added (finding 23).
14. **Low, dark glass over a light frame.** Stands, with its measurement. The bar's text is `foreground` and `primary` only: 9.99 and 5.36 on dark glass over white (EXECUTED). The bar uses no muted text, which would read 4.21 there.
15. **Low, the dead `/404.html` header.** Fixed. Dropped; the page carries a `noindex` meta tag.
16. **Low, 57.1 and checkpoint 0's overrides.** Fixed. 43.6 for the four dots over dark glass. The overrides are named variable by variable in decision 3. The citation is `016` decision 5: its mark-on-field table sits under its "5. Contrast" heading, as `016`'s own review also says.
17. **Low, unlayered Svelte styles.** Fixed. No `<style>` blocks on the site, and `site.css` sits wholly inside `@layer components` (decision 5, criterion 28).
18. **Low, the Start band's middle command.** Fixed. Two commands; `pluto-theme` brings the fonts.
19. **Low, the API generator's edges.** Fixed. `svelte/compiler` is named; `VariantProps` types are expanded to their keys; there is one table per part, in `index.ts`'s order (decision 14, criterion 15).
20. **Low, criterion 27's page.** Fixed. `/components/dialog/` is named; `spinner` and `skeleton` are excluded, with the reason.
21. **Low, exact edges for the checks.** Fixed. Headings counted outside `[data-md="skip"]`; "0 HTML tags outside code spans and fences"; literal patterns, and names read from `git log --format=%an` (criteria 19, 29).
22. **Low, unnamed examples.** Fixed. The five example views are the first examples of `button`, `alert`, `dropdown-menu`, `chart` and `code-block`. The 58 non-block, non-composition items have example files; blocks and compositions keep their views. A `live: false` example has no switch.
23. **Low, indexing the temporary origin.** Fixed. A `_headers` host rule, `https://pluto-systems-design.:account.workers.dev/*`, sets `noindex` (decision 20). Recorded in `decisions.md` as a call taken while the owner was away. (The second review's S5 keeps the rule after the domain is set.)

### Second review

- **S1, Medium, the doors between phone and desktop.** Fixed. The breakpoint is named: one column below `lg` (1024 px), two columns from it. Below 1024 the disc is `min(40%, 160 px)`; from 1024 it is the headline's height ÷ 2.267. The door words, measured at both sides of each breakpoint (360, 390, 768, 1023, 1024, 1279, 1280, 1440), keep at least 10.7 px to the disc's edge (EXECUTED; decision 5's table). At 768 the disc is 160 px and "Install, theme, modes" fits with 18.4 px to spare. Criterion 10 checks the cap at 360 to 1023, and every corner at 360, 390, 768, 1024, 1280 and 1440.
- **S2, Medium, the closed list of comment lines.** Fixed. Decision 14 is now a rule: no file under `static/r/` matches a citation pattern. The patterns cover three-digit numbers followed by decision, decisions, criterion or criteria; bracketed numbers; bracketed codes like "(K3)"; bare R and L rule codes; and "spec" or "specification" followed by a number. The builder enumerates the matches at the start of step 1 against the tag `pre-015` (`016`'s commit), rewords each, and records them in a fixture. `registry-comments.test.ts` checks the rule, and checks that every other byte of `static/r/` equals `pre-015`'s once the fixture's rewordings are applied. The release-scoped check skips once `v0.12.0` exists. The changelog lines follow the fixture, checked by criterion 30. (The tag `pre-015`, and the skip on `v0.12.0`, were replaced at the third review, T2.)
- **S3, Medium, search entries for 017.** Fixed. Decision 18 names the entry type (page or anchor) and the hook: the endpoint globs `src/lib/site/search/sources/`. 015 ships `pages.ts`; `017` adds `tokens.ts`. Criterion 21 counts page entries against the page list and checks every anchor resolves. `search.test.ts` and `sitemap.test.ts` join decision 2's append list, making eight.
- **S4, Low, a live example on a budget page.** Fixed, by dropping it. Every example on the four budget pages prerenders its `lines`. Live highlighting is shown on `use-highlighted-code` and `code-editor`, which carry no budget (decision 23).
- **S5, Low, the temporary host outlives its rule.** Fixed. The `noindex` rule stays after the domain is set. A custom domain does not switch off `workers.dev`; a redirect needs the domain decided first; `"workers_dev": false` would remove the owner's check address (decision 20). The `decisions.md` call says the same.
- **S6, Low, calls taken in the owner's absence.** Fixed. "For the owner" asks each of the three calls as a question, with options and the taken option first, marked as taken.
- **S7, Low, two edges of the `?theme=` frame.** Fixed. Only the raw head script reads the query, from `location.search`. No Svelte code in `(example)` reads `searchParams`. `examples.test.ts` now also checks the converse: every example with a switch has an import graph free of the theme module (criterion 13).

### Third review

- **T1, Medium, `$lib` on a SvelteKit 3 site.** Fixed. `shownSource` maps to `#lib/components/ui/`, `#lib/components/`, `#lib/hooks/`, `#lib/` and `#lib/utils`, which is what `init` writes in a SvelteKit 3 app with an `imports["#lib/*"]` map. Every shown source carries the line "In a SvelteKit 2 app, read `$lib` for `#lib`." The physical paths under `src/lib/` are unchanged, so "Files you own" and criterion 17 stand (decisions 13, 15; criterion 13). The first draft's claim that `init` writes `$lib` was wrong for the SvelteKit this repository pins.
- **T2, Medium, the base of the byte check.** Fixed. No tag: the fixture records the full hash of `016`'s commit as its `base`. The release-scoped check runs only while `package.json`'s version is `0.12.0`, and skips if the commit is absent. The placeholder check moved out of the test suite into `scripts/site/release-check.ts`, run before the tag (decisions 4, 14, 26; criteria 30, 31; Build order step 1).
- **T3, Medium, JSON escaping and whole-file lines.** Fixed. Both checks parse each JSON file and work on decoded `files[].content`, line by line. `kept` exempts one decoded line by item, path and text. The byte check became a deep-equal of the parsed objects after the rewordings are applied, and fixture entries may span lines (decision 26).
- **T4, Medium, the public check against the changelog and code.** Fixed. Criterion 29 names its scope: the site's own words (page `<main>` text, twins, API rows, file lists). It names what is exempt: `/changelog/` and its twin, which reproduce `CHANGELOG.md` verbatim (criterion 22), and every `<pre>`, code block and fenced block, which are removed before the text is read. Item files are covered, code included, by `registry-comments.test.ts` with its `kept` lines.
- **T5, Medium, unit tests that need a build.** Fixed by the e2e stage. Every check of `build/` moved to `tests/e2e/build-output.spec.ts`, which runs after Playwright's `webServer` has run `bun run build`, opens no page, and runs in one project. `bun run test`'s order is stated: unit, then e2e (build first), then smoke. Unit tests read sources with `node:fs` and call pure functions, never a module that uses `import.meta.glob` (decision 24; criteria 2, 3, 19, 20, 21, 24, 29).
- **T6, Low, two missed citations.** Fixed. The patterns also run over each comment block, joined into one line, which catches the split "(012 … decision 4)". The first pattern's tail adds `build`, `checkpoint` and `review`, which catches "(the 010 build's checkpoint 1)" (decision 14).

### Fourth review

Fit to build, with four write-ins, each taken as worded:

- **V1, Low, an absent base in a full clone.** Written in. The release-scoped check skips only when `git rev-parse --is-shallow-repository` prints `true`. Otherwise an absent `base` fails, naming the hash. The landing notes record "ran" or "skipped, and why" (decision 26; criterion 30).
- **V2, Low, the changelog's exemption.** Written in, narrowed. On `/changelog/` and its twin only the bare R/L pattern is skipped, plus the literal `context/`. A grep of `CHANGELOG.md` against criterion 29's list found that literal in the released 0.7.1 entry, so the narrowing as the review worded it would have failed on a verbatim page. Every other pattern is read there (criterion 29).
- **V3, Low, how `build-output.spec.ts` stays in one project.** Written in: the `dark` project's `testIgnore: /build-output|perf/` in `playwright.config.ts`, which keeps `perf.spec.ts` out of it the same way (decisions 23, 24).
- **V4, Low, Bun-importable sources and a comment tokenizer.** Written in. A module in `search/sources/` imports no `$app/*`, and uses no `?raw` and no `import.meta.glob` (decisions 18, 24). `citations.ts` finds comment blocks with TypeScript's scanner and `svelte/compiler`'s `parse`, not a regular expression (decision 14).

## Landing notes

The builder's notes, filled as the build went. The change review's citation is added when it lands.

### Checkpoint 0

Ruled by the design lead: `decisions.md`, "After the `015` build's checkpoint 0 (2026-11-15)". The discs and the red band are kept. The cap offset lives in `doors.ts`; install commands soft-wrap; "Files you own" shows files only; the frame holds its pick; the dots read `--field-N`; criterion 10's height check allows 0.5 px.

### Step 1, the frame

- **The citation base** is `c8185c9db96c17f9064fc0085357da14af7fc12c` (`016`'s commit), in `tests/fixtures/reworded-comments.json`. The enumeration found 37 matches in 19 files: 36 comment lines, reworded in 36 fixture entries (in `liquid-glass`, `code-editor`, `highlighter`, `code-languages`, `stage`, `stage-card`, `marketing-bar`, `stage-hero`, `proof-band`, `live-console`, `marketing-footer` and `product-home`), and one kept line of code, `chat`'s `await sleep(700);`. On the base, the rule finds 36 lines and 33 joined comment blocks; now 0 and 0.
- **A query file's comment.** One rewording is in `highlight/queries/php.scm`, which `013`'s query lock hashes. `tests/fixtures/highlight/query-lock.json` gains one change entry for it, with its reason and the figures unchanged (98.6 and 97.7): no pattern moved.
- **The sentence fixture**, `tests/e2e/fixtures/item-page-sentences.json`, holds 14 sentences from the committed tree, each with the decision that requires it.
- **Deviations, with reasons:**
  - _The banner holds the lockup alone._ The bar's door links, search and the theme toggle sit in a `nav` named "Site" beside it, inside the same glass panel. `four-dot.spec.ts` counts one link in the banner, and decision 24 changes only its name there.
  - _Tests the decision 24 table does not name, changed only where a file moved or went:_ `registry.test.ts` (the pages' folder), `generated.test.ts` (the install line is now the site's code block, so the check reads `command.svelte` and `code-block`'s classes), `code.spec.ts` I4 (the install line's locator), `identity.spec.ts` 12 (the footer is now `marketing-footer`), `navigation.spec.ts` N5 (a footer group's `nav` is named by `aria-labelledby`, and the site's `main` is now `#main`, the skip link's target) and N6 (the toggle is in the bar, not a `header`), and `four-dot.spec.ts`'s client-side navigation, which now starts from `/components/`, the catalogue's new address.
  - _The footer's Components group_ holds its landing only: its 75 pages are on the landing. The other doors list their pages as `017` adds them.
  - _Criterion 27's count_ is keyframe animations, and transitions of 1 ms or more. Under reduced motion the theme sets every duration to 0.01 ms, so a font swap changing a `ch` width shows as a 0.01 ms transition: no motion.
  - _The discs' accessible names_ hold the name and the line ("Start Install, theme, modes"), as their text reads; criterion 10 checks that each starts with the door's name.
  - _The Brand band's `h1`_ is "Brand", for assistive technology, beside the one-colour lockup, which is `aria-hidden`.
  - _The rail in step 1_ reads the page's `h2`s once scripts run; step 2's template gives it fixed sections.
- **Tests, first failing:** the unit files for step 1 (`sitemap`, `changelog-page`, `headers`, `deps`, `site-literals`, `previews`) before any site code: 81 failed, 76 passed. The new e2e specs (`build-output`, `site`, `doors`) against a build of the base (less the exhibit's routes, whose packages are gone), light project: 37 of 47 failed. After step 1: unit 1,076 pass, 0 fail; `check` 0 errors and 0 warnings; lint clean; literal lint 0 violations, 1 allowance; e2e 2,269 passed, 4 skipped, 10 failed, every one a step-2 check: the "Do" and "Don't" headings, `pluto-theme`'s fields outside an example frame, and the six code and theme pages that still scroll sideways at 360 and 390 (both projects).
- **Budgets at checkpoint 1** (decision 23's profile, 3 runs, medians; component pages before step 2 rebuilds them): `/` 296 kB, LCP 856 ms, CLS 0.005; `/components/` 319 kB, 940 ms, 0.001; `/components/button/` 349 kB, 848 ms, 0.012; `/components/code-block/` 322 kB, 880 ms, 0.010; 0 `.wasm` requests on each.
### Checkpoint 1

Ruled by the design lead: `decisions.md`, "After the `015` build's checkpoint 1 (2026-11-15)". Kept: the entrance and the stillness after it, the door transition, the doors' words, the red and yellow bands, the current-door underline, the quiet component page. Fixed in step 2: the bar's lockup during the door transition (the bar is a view-transition group of its own, painted above the growing door); every band's title block aligned to the top; the 404's frame checked at depth through the build's 404 fallback.

- **Deviation from decision 23, ruled:** each CLS budget is the larger of its median × 1.2 and 0.02, a fifth of the 0.1 "good" threshold. A median plus 20% at the 0.001 scale is noise. The other budgets tighten by decision 23's rule after step 2 re-measures.
- **The 404 under `vite preview`:** preview answers an unknown address with status 404 and SvelteKit's error page (the root `+error.svelte`, outside the `(site)` layout), not `build/404.html`, so it shows no bar, no footer and no theme script (checked with `curl`). The worker's `404-page` serves `build/404.html`; criterion 23's check serves the build that way, at `/nope/`, `/nope/deep/`, `/components/nope/` and `/a/b/c/`, and reads the bar, the footer, the theme and search there.

### Step 2, the components

- **Examples: 157 files for the 58 items** that are not blocks or compositions (`examples.test.ts` prints the count). Ten named shown sources are fixtures in `tests/fixtures/shown-source/`, each read by hand once.
- **How it is built:**
  - each page imports its own example files, so a page loads only its own; the frameless example views glob every example but the theme item's, so a frame never holds the theme module;
  - an item page's server data moved to `src/lib/site/examples/<item>/data.server.ts`, which the page and the example view both load;
  - a frame's code past the first is in a `details` element, not the `collapsible` item, so the code stays in the page for find-in-page and the Markdown twin;
  - a frame's stage becomes a named, focusable region only while its example is wider than the page.
- **Deviations, with reasons:**
  - _Example views and in-page links._ An example cut from its page may link to an id on that page (`#variants`). The prerender's `handleMissingId` lets such a link pass on `/example/…` views only; every other page must still hold the ids it links to.
  - _Example views' headings._ Each view carries the page's headings, visually hidden (the item, "Example", the example's title), so an example's own headings start at `h4`, as on its page.
  - _Code that scrolls is a named region._ A code block that can scroll sideways carries `role="region"` and a name, on the site's commands, the frames' code and the seven overflow pages' examples. Two keyboard fixtures' expected stops change from `pre:*` to `region:*` (`code-block`'s and the ink surface's), and the walks' code-block stop likewise. The counts are unchanged.
  - _More tests outside decision 24's table, changed only where markup moved:_ `registry.test.ts` reads an item page with its example files; `chat.spec.ts` counts the message log's regions inside the live examples, since the page's API tables and shown code are named regions too; `doors.spec.ts` counts `field-2` outside example frames, as criterion 11's third bullet allows fields inside `pluto-theme`'s and `liquid-glass`'s frames.
  - _`code-samples.ts`'s Svelte sample_ imports `#lib/components/ui/meter`, not `$lib/ui/meter` (the `013` checkpoint's call).
  - _Old sections with no live demonstration_ (prose only, or a table of facts) moved into the page's Usage text, keeping their words; required sentences are verbatim.
  - _The `error-summary` specimens_ link to fields of their own, so their links work in the page and in the example view.
  - _The preview furniture is gone:_ `item-header`, `install-command`, `install-note`, `preview-section`, `specimen`, `eyebrow`, and the helpers nothing imports any more (`contrast-table`, `font-page`, `growing-code`, `otp-six`).
- **Tests, first failing:** step 2's unit files (`examples`, `api`, `files-you-own`) before the generator and the examples existed: 6 failed, 6 passed, and `api.test.ts` failed to load. `site-add.test.ts` failed on its first run (its adds lacked `-o`; corrected to criterion 18's one command). The frame, theme and axe checks of example views were written before the example route existed.
- **After step 2:** unit 1,093 pass, 0 fail; `check` 0 errors and 0 warnings; lint clean; literal lint 0 violations, 1 allowance; e2e 2,325 passed, 4 skipped, 2 failed (the message log's region count, then scoped and re-run: 2 passed); smoke `site-add` 4 pass.
- **Budgets re-measured after step 2** (decision 23's profile, 3 runs, medians): `/` 296 kB, LCP 856 ms, CLS 0.005; `/components/` 310 kB, 948 ms, 0.001; `/components/button/` **371 kB** (over its 360 kB budget), 964 ms, 0; `/components/code-block/` 344 kB, 988 ms, 0.002; 0 `.wasm` requests on each. Tightened by decision 23's rule and the CLS ruling: `/` 355 kB, 1,027 ms, 0.02; `/components/` 320 kB (3% under, kept), 1,138 ms, 0.02; `/components/button/` 360 kB pending a ruling, 1,157 ms, 0.02; `/components/code-block/` 360 kB (4% under, kept), 1,186 ms, 0.02.
- **The usage prose and the accessibility notes** for all 75 items were drafted by the builder (with helpers working from one brief) from each item's source and its old page. The design lead edits 25 at checkpoint 2.

### Checkpoint 2

Ruled by the design lead: `decisions.md`, "After the `015` build's checkpoint 2 (2026-11-15)". The template, the block viewer, the frames and the step 2 deviations kept. The design lead's editor rewrote the prose of 25 items in place; their wording is kept.

- **Untrue claims, checked on the other 50:** the seven the editor corrected recur in four places, each fixed: the four-dot mark example (every dot paper-white in dark, true on product screens only), the separator (a highlight line under the groove, removed in 0.11.0), the toggle (its pressed contrast, now 16.84:1 light and 16.16:1 dark against 1.1:1 and 1.25:1 for a muted fill) and the toggle example ("ink on paper", true in light only).
- **The highlighter's required sentence, corrected:** the dark comment reads 5.84:1, so only the eight hues sit between 6.5:1 and 9.5:1. The sentence now reads "The eight hues sit between 6.5:1 and 9.5:1 on the dark code ground, and every role passes 4.5:1; off the ground the dark number reads higher, 10.41:1 on the active line and 11.66:1 inside an ink surface." `item-page-sentences.json` holds it, with the reason.
- **`code-editor-theme.ts`'s comment, corrected:** it named five `@theme inline` names; the file reads four. The change is a 37th entry in `reworded-comments.json`, marked as a correction, and the changelog's `code-editor` bullet says so.
- **The Button page's transfer:** the frame's switch is now two plain pressed buttons (not bits-ui's toggle group), the API table is styled from the table rather than per cell, a component page carries its own registry entry rather than all 75, and an example's code travels once in the page data (as its tokens). 371 kB became 360 kB before step 3, and 361 kB with step 3's search button and twin links. See step 3.

### Step 3, the machinery

- **Search:** `/search.json` (81 page entries, 4.6 kB gzipped), built by `buildIndex` from `search/sources/*.ts`; the palette's code and the index load the first time it opens. Control-K and Command-K open it from the bar's button only.
- **The Markdown build:** `scripts/site/markdown.ts` writes 81 twins after `vite build`, in about 175 ms, with Bun's `HTMLRewriter`. Every page links its twin (`rel="alternate"`) and `/llms.txt` (`rel="describedby"`). The prerender lets a link to `…/index.md` pass, since twins are written after it; `build-output.spec.ts` checks each.
- **`llms.txt`, `sitemap.xml`, `robots.txt`** are prerendered endpoints that read `SITE_ORIGIN`. `robots.txt` is an endpoint, not a file in `static/`, so the address is written once. In `sitemap.xml` the placeholder is escaped (`&lt;account&gt;`).
- **The budgets** run in a project of their own, `perf`, in the light theme, which starts once the light and dark projects have finished, so CPU throttling shares the machine with no other test (decision 23 asked for one worker; Playwright's workers are global). A failure in another project skips it.
- **Tests, first failing:** the step 3 e2e checks (twins, `llms.txt`, the index, crawlers, the public check, search) against a build of the base, light project: 18 of 18 failed. The converter's 12 fixtures and the search unit test were written beside the code and first run green: a process gap, recorded here. The converter's fixtures are byte-exact, so `tests/fixtures/markdown/` joins `.prettierignore`.
- **Words changed by the public check:** the `app-shell` page's "this registry's specifications" became "this design system's".

### The final runs (2026-11-15, before the change review)

- Unit 1,112 pass, 0 fail. `check` 0 errors and 0 warnings. Lint clean. Literal lint 0 violations, 1 allowance. `scripts/site/citations.ts`: 1 match, the kept line.
- e2e 2,353 passed, 4 skipped, 1 failed, 1 did not run: `/components/button/`'s transfer budget (below); the `code-block` budget, after it in the serial `perf` project, did not run (measured by the same script: 333 kB, LCP 912 ms, CLS 0.002).
- Smoke 126 pass, 0 fail, `site-add.test.ts` included (criteria 17 and 18).
- `registry-comments.test.ts`'s release-scoped check **ran** (a full clone; `package.json` reads 0.12.0) and passed against the base `c8185c9db96c17f9064fc0085357da14af7fc12c`.
- **The development walk:** a dev server of the builder's own (port 5301), warmed twice; every page of the list in both themes at 1440 and 390 px: 324 loads, **0 page errors, 0 console errors or warnings**.
- **The budgets' figures** (`perf.spec.ts`, 3 runs each): `/` 298 kB, LCP 840 to 864 ms, CLS 0.005; `/components/` 311 kB, 936 to 948 ms, 0.001; `/components/button/` **361 kB**, 904 to 908 ms, 0; 0 `.wasm` requests. Budgets as tightened: `/` 355 kB, 1,027 ms; `/components/` 320 kB, 1,138 ms; `/components/button/` 365 kB as ruled (below), 1,157 ms; `/components/code-block/` 360 kB, 1,186 ms; every CLS 0.02.
- **`/components/button/` at 361 kB, ruled:** its transfer budget is 365 kB (`decisions.md`, "The Button page's transfer budget is 365 kB", option (b)): the 1 kB over 360 is the search button and the twin links every page now carries. After the cuts above, the floor without moving an example or a section was 361 kB (the page's HTML 22 kB gzipped, fonts 114 kB, CSS 30 kB, the rest scripts). The other budgets stand.
- **The `perf` project re-run with the ruled budget** (3 runs each, medians): `/` 298 kB, LCP 852 ms, CLS 0.005; `/components/` 311 kB, 956 ms, 0.001; `/components/button/` 361 kB, 920 ms, 0; `/components/code-block/` 335 kB, 928 ms, 0.002; 0 `.wasm` requests; 4 of 4 pass.
- **Example count:** 157 files for 58 items.
- **Content-Type of a deployed twin:** not yet measured; after the owner's first push (decision 21, criterion 31).
- **No Content Security Policy** in 0.12.0 (decision 25).

- **Seen while building:** a dev server started before `013` (the design lead's, on 5199) rebuilds `static/r/` on an item edit with the older `build-registry`, which leaves `highlighter`'s shadowed `devDependencies` in. `bun run build:registry` restores it; `registry-comments.test.ts` catches the difference.

### After the change review (2026-11-15)

The review is [`../reviews/015-the-design-site-pr-2026-11-15.md`](../reviews/015-the-design-site-pr-2026-11-15.md). Each finding, as answered:

1. **The red-door loops** read 015's own pages: `doors.spec.ts` builds its `PAGES` from `SITEMAP` entries with `spec === "015"`. 017 checks its Brand pages in its own blocks and edits none of these lines.
2. **The package check grows by appending.** `deps.test.ts` checks the exact set over `PACKAGES` as a later block extends it. 015's own count, 54, is pinned on the first `PACKAGES_015` entries. 017 appends a block that pushes `fontkit` and `wawoff2` onto `PACKAGES`.
3. **An example view loads its own example.** `examples.ts` is a lazy glob; the view's universal load imports one module. Button's variants view, dark: 45 requests, 228 kB (was 186 and about 688 kB). The cost: the chunk graph splits finer, and `/components/button/` rises from 362 kB to 367 kB (85 requests, was 75), 2 kB over its ruled 365. Ruled by the design lead, option (a): the Button budget is 370 kB (`decisions.md`, "The Button page's transfer budget is 365 kB", "Raised again to 370 kB"); `perf.spec.ts` holds it.
4. **The two changelog bullets** now read "Separately, comments reworded to drop internal references".
5. **Keys typed after Control-K are kept.** The search button holds keys typed before the palette's input has focus and hands them over; the palette focuses its input itself on open. A new test holds every script 600 ms and types "butt" at once. Seen failing first (input empty), then passing.
6. **The accessibility sentence** says what is true: axe on every page in both themes; the item's keyboard fixture and its behaviours walked by key.
7. **The twin labels its install commands** "From this site:" and "From GitHub:" (`data-md-label` on the command, written by `markdown.ts`).
8. **"Default" is said once.** The phone label is `md:hidden` and `data-md="skip"`.
9. **The block pages' fences carry their language**, `svelte` or `ts`, from the file's path.
10. **`brand.svelte` sets its `<title>`**, as `leaf.svelte` does.
11. **The changelog says "the Tombaugh palette".**
12. **The site paragraph** is left for the address at the tag.
13. **The dead `src/lib/identity/` exclusion** is gone, and the test's title with it.

Also: an example whose code imports a file beside it (15 do: `pluto-theme` 11, `code-editor` 3, `code-languages` 1; one `pluto-theme` example imports two) now says under its code which file, and that it is this site's sample data. These files are not in the file view, so the line names them without a link.

Figures after: unit 1,112 pass; `check` 0 and 0; lint clean; literal lint 0, 1 allowance; e2e doors, frames, search, build-output, theme and viewer 433 passed, site, build-output and keyboard 295 passed, axe on example views and two item pages 22 passed (both projects); smoke 126 pass; perf `/` 301 kB, `/components/` 314 kB, `/components/code-block/` 340 kB, all within budget; `/components/button/` 367 kB, within the 370 kB ruled after.

After the ruling, once each: the full e2e suite in all three projects (light, dark, perf), 2,357 passed and 4 skipped in 7.7 minutes; smoke 126 pass. Perf medians: `/` 301 kB, LCP 852 ms, CLS 0.005; `/components/` 314 kB, 948 ms, 0.001; `/components/button/` 367 kB, 920 ms, 0; `/components/code-block/` 340 kB, 928 ms, 0.002; 0 `.wasm` requests.
