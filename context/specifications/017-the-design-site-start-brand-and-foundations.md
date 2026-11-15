# 017 — The design site: Start, Brand and Foundations

- **Status:** built, awaiting its change review (2026-11-15). Was fit to build, by its fourth review ([`../reviews/017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md`](../reviews/017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md), "Fourth review", 2026-11-15), with its write-ins W1 and W2 taken, once `015` is built and committed. Revised 2026-11-14 after its specification review, [`../reviews/017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md`](../reviews/017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md) (3 Medium, 6 Low; each answered under "Review dispositions"), and with `015`'s revision. Revised again after the same file's second review (S1 to S4) and third review (U1, U2), each answered under its own heading in the dispositions.
- **Date:** 2026-11-14
- **Author:** the design lead
- **Kind:** 21 new pages of the public design site, on [`015`](./015-the-design-site.md)'s leaf and Brand templates:
  - five Start guides;
  - nine Brand pages;
  - seven Foundations pages.

  It also adds:
  - the mark and the lockup as SVG downloads, generated from the token file at build;
  - figures of the mark and the type, drawn to measure;
  - the token entries in search, through `015`'s search hook;
  - two pinned development packages;
  - tests: three new unit files, and `describe` blocks appended to nine of `015`'s test files;
  - one sentence in the 0.12.0 changelog entry.

  **No registry item and no token changes.** 017 edits no line that `015` wrote.
- **Depends on,** each built, change-reviewed and committed to `release/0.12.0` first:
  - [`015`](./015-the-design-site.md): the templates, the page list, and the suites that read it;
  - [`016`](./016-the-brand-yellow.md): the yellow the Brand pages show;
  - [`013`](./013-code-highlighted-by-tree-sitter-in-meridian-roles.md): the roles `/foundations/code/` documents;
  - [`014`](./014-the-white-light-mode-code-ground.md).
- **Ships with:** `013`, `014`, `015` and `016`, as 0.12.0. `v0.12.0` is tagged locally once, after the change reviews of `013`, `014`, `015`, `016` and `017`. Nothing is pushed until the owner asks (`decisions.md`, "Commits per specification, and the site's worker name").
- **Research it stands on:** [`../research/2026-11-14-the-design-site.md`](../research/2026-11-14-the-design-site.md) (the site memo):
  - §4.1, what the site must explain to a builder;
  - §4.2, the brand: settled decisions only, and what is open;
  - §5.3, direction C's figures drawn to measure, which direction B keeps for these pages.
- **Design calls** in `../decisions.md`:
  - 2026-11-14: "Commits per specification, and the site's worker name"; "The design site: its name, downloads and the exhibit"; "A yellower yellow, in code and in the brand"; "Code takes Meridian's roles"; "Tombaugh, a number role, the white ground first, and docstrings as strings";
  - 2026-11-07: "Frost only";
  - 2026-11-06: "The identity: the owner's first answers" and "round two answered";
  - 2026-11-01: "One system, many products"; "Two writing and furniture rules join the checklist".

  Also `001` decision 16, on clearspace and the minimum size.
- **Figures** marked EXECUTED were measured by the design lead on 2026-11-14, in a scratch folder outside the repository, with Bun 1.4.4 and the repository's pinned Playwright 1.64.1. Nothing in the repository was changed to take them.

## Intent

`015` builds the site's frame and its component pages. It leaves three doors with a landing each and nothing behind them. This specification fills them.

- **Start** takes a builder from an empty SvelteKit app to a first on-brand screen, and says what owning the source means.
- **Brand** says who Pluto is and how it looks, moves and speaks, from the owner's settled decisions only. It gives the mark and the lockup as files.
- **Foundations** explains the one token file: every role by its job, in both themes, with its measured contrast.

Every number on these pages comes from the token file, `registry.json` or `scripts/contrast.ts`. The words are written in the brand's voice.

**Terms of art** are `015`'s. A **figure drawn to measure** is a drawing whose dimensions are labelled with the token values that set them. A **claim** is a sentence on a Brand page that states how the brand is.

**Not here:**

- product icons, which are settled as a rule (G5) but not drawn;
- a signature device, which the owner set aside;
- the dark expressive version of the lockup as a download (decision 4);
- any change to `015`'s files.

## Decisions

### 1. The 21 pages

Each is appended to `src/lib/site/sitemap.ts`, tagged `spec: "017"`. `015`'s suites read the list, so search, the Markdown twins, `llms.txt`, `sitemap.xml`, axe, the theme check, the overflow check and the public check all cover these pages with no edit to `015`'s lines.

**Start** uses `015`'s `leaf.svelte` (quiet, `data-mode="productive"`):

| Path | Its job | What it holds | Sources |
|---|---|---|---|
| `/start/install/` | Add the first item and know what you own | An empty SvelteKit 3 app with Tailwind; the `imports` block its `package.json` needs for `#lib`; the `components.json` to write, shown in full, with `shadcn-svelte init` as the alternative that writes the same file (decision 13); one sentence for SvelteKit 2 apps (`$lib` for `#lib`, and no `imports` block); `add pluto-theme`; `add button`; the files each step writes; the two registry addresses; pinning a release by its version; updating an item by running `add` again, after reading the changelog for "interface change"; the limits (no CSP shipped, Chromium checked) | `registry.json`, `package.json`, the smoke apps' steps, `CHANGELOG.md` |
| `/start/theme/` | Know what `pluto-theme` writes into your app | Its variables, its utilities, the global class names it adds and how to avoid a clash, the three fonts it brings | `registry.json`'s `pluto-theme`, the token file |
| `/start/light-and-dark/` | Ship both themes | The `theme` item: the head script, the stored choice and its key `pluto-theme`, the toggle; the scripts-off limit (a reader whose system is dark gets light) | `theme`'s source |
| `/start/modes/` | Choose productive or expressive | `data-mode`; what each allows; fields, glass and poster type on expressive pages only; what a field may hold, in plain words; `meta.modes` | `011`, the token file |
| `/start/your-product/` | Put your product's name on the system | A product sets its logo, its name and its copy; the rest is shared; the `logo` snippet, the wordmark fallback, the optional endorsement line | `app-shell-header`, `app-shell-footer` |

**Brand** uses `015`'s `brand.svelte` (owned moments, `data-mode="expressive"`):

| Path | Its job | What it holds |
|---|---|---|
| `/brand/mark/` | Draw the mark right | The four dots in N1's order; the lockup (E6); both drawn to measure (decision 3); clearspace, one dot-pair height; the minimum, the mark alone below 20 px of lockup height; which version goes on which ground, with the four-colour mark never shown on a field, even as a "don't" (decision 4); a logo, exempt from the 3:1 graphic rule |
| `/brand/colour/` | Use the four colours | Four full-bleed bands, one poster word each, values on glass (decision 5); the canvas and graphite; four together only in owned moments (C2); one yellow, never the only signal; brand red kept apart from error red by place, not hue |
| `/brand/type/` | Set type | The three faces and their jobs (D1); the display ladder drawn to measure; `type-poster` for launches only (K3) |
| `/brand/surfaces/` | Shape and light | One 8 px radius, round only for dots (H1); product screens flat (I5); the four fields and what they hold; frosted glass, expressive pages only, opaque under reduced transparency (I9, "Frost only") |
| `/brand/motion/` | Move like Pluto | Motion answers the visitor (J2); springs for the dots only (J4); one entrance per page; the 200 ms reveal. Each is shown live and at rest, with a "Replay" button (decision 7) |
| `/brand/imagery/` | Pick the right picture | The four sanctioned kinds (M1 to M4), each with what it is for; a page picks one |
| `/brand/voice/` | Write like Pluto | Warm and human: the work, not the tool (L3); the writing rules; for each, when to say more and when to say less |
| `/brand/products/` | Name a product | The branded suite: Pluto Docs, Pluto Sheets. Open-source cores keep their names (A4). Identity only per product; the endorsement; the icon tile's rule (G5), with the icons marked as not drawn yet |
| `/brand/downloads/` | Take the mark away | Six SVG files (decision 4), each shown on the grounds it is for |

**Foundations** uses `015`'s `leaf.svelte` (quiet, `data-mode="productive"`):

| Path | Its job | What it holds |
|---|---|---|
| `/foundations/tokens/` | Find any token | Every primitive and every theme role, in both themes: swatch, value, and a copy button on each name; anchors `#<name>`, which search points at (decision 10) |
| `/foundations/colour/` | Pick a colour role by its job | Each role in words, in both themes; the contrast rows from `contrastTable` |
| `/foundations/type/` | Set text in a product | The families, the scale, the tracking and leading; the display steps for expressive pages |
| `/foundations/space-and-shape/` | Space and edge things | The 4 px atom and its ladder; the one radius; the hairline; the focus ring |
| `/foundations/motion/` | Time things | Every duration and ease token; what reduced motion does |
| `/foundations/accessibility/` | Know what is promised | WCAG 2.2 AA in both themes; every interactive item by keyboard; checked in Chromium by axe and a keyboard walk; not checked: Firefox, Safari, iOS Safari, screen readers; no Content Security Policy yet, and why |
| `/foundations/code/` | Read highlighted code | Meridian's roles, and what each colours; Tombaugh's colours in both themes, generated; the white light ground; the languages, and which engine each uses |

- _Why these and no more:_ they are the research's list (memo §7.1), with `015`'s rulings applied: no upgrading page (it is a section of install), and no per-item history.
- _Why Brand is loud and the others quiet:_ a brand page is Pluto speaking for itself, C2's owned moment. A Start or Foundations page is a reference a builder reads while working.

### 2. Settled decisions only, and open things said to be open

- **Every claim is traced.** In a Brand page's `<main>`, every `p`, `li`, `td` and `figcaption` carries one of two attributes:
  - `data-claim` plus a source comment beside it, naming the decision or specification it states;
  - `data-claim="none"`, for copy about the page itself, such as navigation or a caption that only describes a figure.

  Headings are exempt. The comments are not shown, so the page stays public (`015` decision 17). A test counts the unmarked elements (criterion 11).
- **Open, and said plainly:**
  - Product icons: "The tile is set: flat colour, a white glyph (ink on yellow), two products per colour. The icons themselves are not drawn yet."
  - A signature device: the site shows none, and says nothing about one.
- **Not invented:** a clearspace or minimum other than `001` decision 16's; any photography (none exists); any icon.

### 3. Figures drawn to measure

The mark page and the type page each carry a figure, drawn in SVG at prerender from the token file:

- the mark, with its dot, its gap and N1's proportion labelled;
- the lockup, with its scale (0.87), its distance from the word (0.10 em), its rise, and its top (0.90 em above the baseline);
- the display ladder, with each step's minimum, maximum and leading.

Details:

- Each figure reads its numbers from `tokens/pluto.tokens.json` (`mark`, `expressive.display.steps`), so a token change redraws it.
- **The phone layout is its own.** Direction C's drawing put its labels too small to read at 390 px (EXECUTED by the research). Below 640 px, each figure hides its in-figure labels (`display: none`) and lists the dimensions under it, keyed by letter.
- Each figure is `role="img"`, with an accessible name. Its dimensions are also a list in the page, so the Markdown twin carries them.

### 4. The downloads: six SVG files, generated at build

The owner asked for "the four-dot mark and the lockup as SVG, on colour and on paper, generated from the tokens". Read as: a version for paper grounds, and versions for colour grounds. That gives three colourways, each for the mark and for the lockup:

| File | The dots | The word | For |
|---|---|---|---|
| `pluto-mark-colour.svg`, `pluto-lockup-colour.svg` | the four, in the light theme's `mark-1` … `mark-4` | ink | paper, white and other light grounds |
| `pluto-mark-paper.svg`, `pluto-lockup-paper.svg` | all paper | paper | the blue, red and green fields, and dark grounds |
| `pluto-mark-ink.svg`, `pluto-lockup-ink.svg` | all ink | ink | the yellow field, and one-colour print |

- **On colour, one colour.** The four-colour mark never sits directly on a field. Its yellow dot measures 1.00:1 on the yellow field (`016` decision 5). On a field the mark is the field's legend: paper on blue (7.02), red (5.61) and green (4.96); ink on yellow (9.53) (`011`'s and `016`'s rows).
  - The mark page shows "which version goes where" with each file on its own ground. Where it shows what not to do, it says so in words, and draws no four-colour mark on a field.
- **Generated by prerendered endpoints,** `src/routes/(site)/brand/downloads/[file]/+server.ts`, whose `entries()` name the six files. Each endpoint is a thin wrapper over a pure function, `downloadSvg(tokens, file)` in `src/lib/site/brand/downloads.ts`, which the unit test calls directly (`015` decision 24: no unit test reads `build/`). A prerendered endpoint whose path ends in `.svg` is written at that exact path, despite `trailingSlash = "always"` (EXECUTED, SvelteKit 3.1.0). So the files exist in development too.
- **The word is outlined** from IBM Plex Sans at weight 700, the lockup's own face and weight, with the lockup's tracking (`--tracking-mark`, −0.04 em). The dots and their geometry come from the token file's `mark` group and the theme's primitives.
- **Each file** holds a `<title>` "Pluto Systems", `role="img"`, and a `viewBox` tight to the drawing. It has no clearspace padding; the mark page states the clearspace.
- **Two development packages,** at exact versions in `devDependencies`, pinned by `bun.lock` (constitution §4.5, §4.6):
  - `fontkit` 2.0.4 (MIT) reads the font and lays out the word;
  - `wawoff2` 2.0.1 (MIT) first decompresses the WOFF2 file to a TrueType font.
  - _Why both:_ fontkit's `getVariation` fails on a WOFF2 variable font, with a `cmap` error. On the decompressed TrueType font it gives the weight-700 instance. The outlined "pluto" matched the CSS lockup set at 100 px, side by side, by eye (EXECUTED, 2026-11-14, from the repository's `@fontsource-variable/ibm-plex-sans` latin file; 2,077 bytes per lockup file).
- **The lockup's width is pinned by a committed fixture,** `tests/fixtures/lockup-word-width.json`: the width of the CSS lockup's word at 100 px, as Chromium lays it out.
  - `scripts/site/lockup-width.ts` measures it with Playwright and writes the file.
  - The unit test compares the outline with the committed value.
  - `site.spec.ts` checks that the browser's width still equals the committed value, to 0.1 px. If it does not, it fails with "run `bun scripts/site/lockup-width.ts`".

  So the unit suite, which runs first, never reads a value the browser suite has not yet written.
- **The dark expressive lockup** (the lifted four, with a paper word) is not a download. On a dark ground the paper version is the product rule (`008`). The lifted four is for this system's own expressive pages, which draw it live.
- **The download page** shows each file on the grounds it is for, with its "Download" link: a `download` attribute, and the file name as the link's text.

### 5. The Colour page is four bands

This is direction B's colour page, as screenshotted (`b-map-colour-*`): a quiet header, then four full-bleed fields, one per colour, in N1's order.

- Each band has its colour's name in `type-poster`, in the legend.
- Each band has a glass panel holding:
  - its values in light and dark, from the token file;
  - its legend's ratio, from `fieldRows`;
  - one sentence on its job.
- The yellow band's values are `016`'s.
- **The glass text is `foreground` only:** values, ratios and sentences, with no `muted-foreground`. The tightest glass row in the system is muted text on dark glass over `field-3`, at 4.60 (`016` decision 5). The page never sets text on that row.
- The bar's glass passes over the bands as the page scrolls, and its lockup stays on glass (`015` decision 5).
- The bands hold no mark, no control and no icon.

### 6. Token tables are generated

`/foundations/tokens/`, `/foundations/colour/` and `/foundations/code/` render their tables at prerender, from the token file and `scripts/contrast.ts`.

- Each token's name has a copy button. It copies `--<name>` and then says "Copied".
- On a phone each row stacks: the name, then the two swatches with their values.
- _Why:_ the token file is the one source (§4.3). A table copied by hand would drift at the next palette change, as `016` showed: it had to find every place amber was written.

### 7. Live specimens, not pictures

Motion, glass, fields, type and the mark are shown live, built from the registry's items.

- **On the motion page, every specimen rests in place on load.** The page's one entrance is the bar's lockup (`015` decision 8). A specimen moves only when its "Replay" button is pressed: a motion that answers the visitor (J2). Under reduced motion, Replay shows the end state at once.
- **On the imagery page,** each kind is shown with an example made from items: a product screen, a figure, a chart. For "people at work", the page says that Pluto has no photographs yet, and shows none.

### 8. Who writes, and how

017's builder drafts the prose from the decisions and specifications named in each page's claim comments, in the brand's voice (L3) and under the writing rules (R23, R24).

- The design lead edits all nine Brand pages at the checkpoint.
- The change reviewer reads all 21 pages against R23, R24 and "settled only".
- `015`'s public check (its criterion 29, in `build-output.spec.ts`) holds them to the public rule.

### 9. The tests: new files, and blocks appended to `015`'s

017 adds three new unit files of its own, and appends `describe` blocks to nine of `015`'s files. It edits no line `015` wrote. As `015` decision 24 requires, its unit tests read only sources (with `node:fs`) and call pure functions; every check of `build/` is in its `build-output.spec.ts` block, which runs after the e2e stage's build.

| File | Owner | What 017 adds |
|---|---|---|
| `tests/unit/brand-assets.test.ts` | 017, new | criteria 5 to 7, on `downloadSvg`'s output |
| `tests/unit/tokens-pages.test.ts` | 017, new | criterion 10, on the table generators' output |
| `tests/unit/brand-sources.test.ts` | 017, new | criterion 11, on the Brand pages' sources |
| `tests/e2e/build-output.spec.ts` | 015's | a `describe` for the built downloads, token pages, Brand pages' markup and token anchors |
| `tests/unit/deps.test.ts` | 015's | a `describe` for the two packages |
| `tests/e2e/keyboard.spec.ts` | 015's | a `describe` for downloads and the token page |
| `tests/e2e/site.spec.ts` | 015's | `describe` blocks for downloads, figures and the lockup width |
| `tests/e2e/doors.spec.ts` | 015's | `describe` blocks for the Colour page and the motion page |
| `tests/smoke/site-add.test.ts` | 015's | a `describe` that runs the install guide (criterion 12) |
| `tests/e2e/perf.spec.ts` | 015's | a `describe` for `/brand/colour/` (decision 11) |
| `tests/unit/search.test.ts` | 015's | a `describe` for the token anchors from source (decision 10) |
| `tests/unit/sitemap.test.ts` | 015's | a `describe`: 21 entries tagged `"017"` |

`015`'s page counts read `SITEMAP`, so 017's pages join every inherited suite with no edit.

### 10. Search: the token entries, through `015`'s hook

`015` decision 18 builds `/search.json` from every module in `src/lib/site/search/sources/`. 017 adds one module there, `tokens.ts`, and edits no line of `015`'s:

- one **anchor entry** for each theme role and each primitive of the token file, at `/foundations/tokens/#<name>`;
- titled with the name, and summarised with its role in words.

The index stays at most 30 kB gzipped. `search.test.ts` (017's block) checks the entries from source, and `build-output.spec.ts` (017's block) checks they resolve on the built page (criterion 3).

### 11. The budget for the heaviest Brand page

`/brand/colour/`, with four bands, four glass panels and poster type, is measured by `015`'s `perf.spec.ts` method: Chromium, `015` decision 23's profile, the `light` project, serial, 3 runs.

- **Its starting budget is borrowed, and INFERRED:** `015`'s home page budget, as it stands after `015`'s checkpoint 1 (at most 400 kB and LCP at most 1,300 ms, or tighter), with CLS at most 0.05 and 0 `.wasm` requests. Four blurred glass panels over full-bleed fields, under a 4× CPU, are not the home page, so this is a guess until measured.
- **At 017's checkpoint** the builder measures the page with `015`'s script. Its budget becomes the measured median plus 20%, recorded in the landing notes.
- A budget looser than the home page's needs the design lead's ruling, recorded in `decisions.md`, as `015` decision 23 requires.

It is appended to `perf.spec.ts` as a `describe` block.

### 12. The changelog

The 0.12.0 entry's site paragraph (`015` decision 26) gains one sentence: the brand pages, the downloads and the foundation pages. There is no item bullet.

### 13. The install guide's first steps: the file, not the prompt

`/start/install/` shows, in full, the two files an app needs before its first `add`:

1. **The `imports` block of `package.json`**, which gives a SvelteKit 3 app its `#lib` alias. It is `kit3`'s:

   ```json
   "imports": {
     "#lib": "./src/lib",
     "#lib/*": ["./src/lib/*", "./src/lib/*.ts", "./src/lib/*/index.ts"]
   }
   ```
2. **`components.json`**, with `#lib` aliases: `components` `#lib/components`, `ui` `#lib/components/ui`, `hooks` `#lib/hooks`, `utils` `#lib/utils`, `lib` `#lib`; `style` `maia`; and `registry` `<SITE_ORIGIN>/v<version>/r`.

`shadcn-svelte init` is shown beside the second file as the alternative. Once the `imports` block is in place, `init` writes the same aliases, given the answers the page names.

- **Why `#lib`** (third review, U1). SvelteKit 3.1.0, which this repository pins, removes `$lib`: an import of it fails with `module_removed_lib`, "Use `#lib` instead" (READ, `node_modules/@sveltejs/kit`, by the reviewer). The locked CLI's `init` writes `#lib` whenever `package.json` has `imports["#lib/*"]`, and `$lib` otherwise (READ, `node_modules/shadcn-svelte/dist/index.mjs`, its alias default, by the reviewer). `kit3` is exactly that setup. The same map is `015`'s shown sources (`015` decision 13).
- **SvelteKit 2,** in one sentence on the page: "On SvelteKit 2, skip the `imports` block and use `$lib` wherever this guide says `#lib`." `kit2` is that setup.
- **Correction.** This decision's earlier text said `init` writes `$lib` and "never writes" `#lib`, and so that `kit3`'s file teaches a setup no reader has. That was wrong for SvelteKit 3: `kit3`'s aliases are what `init` writes there. Only its `registry`, GitHub's `main`, differs from the page's.
- _Why not run `init` in the test:_ the locked CLI's `init` asks for a preset unless given one, and fetches `/init?preset=…` from the registry's base, `shadcn-svelte.com` by default (READ, by the reviewer). It cannot run offline, and the smoke apps never run it.
- **So the test writes the page's own files into the app,** and proves they work. Criterion 12 copies `kit3` to a scratch folder and writes both blocks over it, after the origin substitution: the `imports` block into its `package.json`, and the `components.json` over its own. Then it runs the guide's `add` steps there and builds. A second run does the same on a scratch copy of `kit2`, with the page's SvelteKit 2 sentence applied (`#lib` read as `$lib`, no `imports` block), so both sentences are proved.

## Scope

**In:**

- the 21 pages and their entries in `sitemap.ts`;
- `src/lib/site/brand/` (the figures, and the downloads' generator);
- the downloads endpoint;
- `scripts/site/lockup-width.ts` and its fixture;
- the token entries in search, as `src/lib/site/search/sources/tokens.ts`;
- the two packages and `bun.lock`;
- the tests of decision 9;
- the changelog sentence.

**Out:**

- any token, theme or item change;
- any change to a line of `015`'s files;
- product icons, a signature device, a dark expressive download, and photography.

## Acceptance criteria

Each is a count, checked by the command or test named. Criteria 1 to 15 make 017 *built*; criterion 16 makes it *done*.

1. **Install and checks.**
   - `bun install --frozen-lockfile` exits 0.
   - `deps.test.ts` (017's block): `fontkit` at `2.0.4` and `wawoff2` at `2.0.1`, exact, in `devDependencies`, matching `bun.lock`.
   - `bun run check` reports 0 errors and 0 warnings; `bun run lint` exits 0.
2. **The pages.** `sitemap.test.ts`: `015`'s block passes unchanged; 017's appended block finds 21 entries tagged `"017"`, and 102 in all. `build-output.spec.ts`: `015`'s check that every entry has a built page holds over 102.
3. **Suites inherited.** `015`'s criteria 5 to 7, 9, 19, 20, 29 and 30's walk hold over every page, with no edit to `015`'s tests:
   - the name and the titles;
   - one theme script per page;
   - axe at 360, 768 and 1280, in both projects (612 scans);
   - no sideways scroll at 360 and 390;
   - a Markdown twin for each page;
   - `llms.txt` linking 102 twins;
   - the public check.

   `015`'s criterion 21 also holds, unchanged: page entries equal the page list, and every anchor resolves. `search.test.ts` (017's block, from source): `buildIndex`, given the 2 modules in `search/sources/`, returns 1 anchor entry for every theme role and every primitive of the token file, each once. `build-output.spec.ts` (017's block): each anchor resolves to an element with that `id` on the built `/foundations/tokens/`, and `build/search.json` is at most 30 kB gzipped.
4. **Keyboard.** `keyboard.spec.ts` (017's block), both projects:
   - on `/brand/downloads/`, Tab reaches the 6 download links in order;
   - on `/foundations/tokens/`, Tab reaches the first 3 copy buttons in order;
   - Enter on the first sets its name to "Copied".
5. **The downloads exist.**
   - `brand-assets.test.ts`: `downloadSvg` returns 6 of 6 files. Each parses as SVG, holds `<title>Pluto Systems</title>`, `role="img"` and a `viewBox`, and is at most 4 kB.
   - `build-output.spec.ts` (017's block): the 6 files are in `build/brand/downloads/`, each equal to `downloadSvg`'s output.
   - `site.spec.ts` (017's block): each link on the page answers 200, with `image/svg+xml`.
6. **The downloads are drawn from the tokens.** `brand-assets.test.ts`, on `downloadSvg`'s output for each of the 6 files:
   - 4 circles whose diameters, gap and positions equal the token file's `mark` geometry, to 0.01 of the unit;
   - their fills: in the colour files, the light theme's `mark-1` … `mark-4` values; in the others, all paper or all ink;
   - in each lockup, 1 path for the word, filled ink or paper.

   Changing `mark.dot` in a copy of the token file changes the generated circles.
7. **The lockup's outline matches the lockup.**
   - `brand-assets.test.ts`: the outlined word's width at 100 px is within 1% of `tests/fixtures/lockup-word-width.json`, which is committed.
   - `site.spec.ts` (017's block): Chromium's width of the CSS lockup's word at 100 px equals the fixture, to 0.1 px. If not, it fails, naming `bun scripts/site/lockup-width.ts`.
8. **No four-colour mark on a field.**
   - `015`'s check (its criterion 12) holds over 102 pages.
   - `doors.spec.ts` (017's block): on `/brand/colour/`, the 4 bands hold 0 marks, 0 controls and 0 `svg`. Every text element in their glass computes `--foreground`.
   - `/brand/mark/` shows 0 four-colour marks with a field as their nearest painted ancestor.
9. **The figures.** `site.spec.ts` (017's block), on `/brand/mark/` and `/brand/type/`:
   - each figure is `role="img"`, with a name;
   - the dimensions listed under it equal the token file's values;
   - at 390 px, 0 of the figure's text elements are rendered (each has `getClientRects().length` 0), and the list carries every dimension.
10. **Generated tables.** `tokens-pages.test.ts`, on the table generators' output from source:
    - the tokens table lists every primitive and every theme role of the token file, each once, with both themes' values;
    - the colour table lists every row of `contrastTable` for both themes, with its ratio;
    - the code table lists every role of the `code` map, with both themes' colours.

    `build-output.spec.ts` (017's block): `/foundations/tokens/`, `/foundations/colour/` and `/foundations/code/` each hold every row of their table, as built.
11. **Settled only.** `build-output.spec.ts` (017's block) over the 9 Brand pages' built HTML, and `brand-sources.test.ts` over their sources:
    - 0 `p`, `li`, `td` or `figcaption` elements in `<main>` lack `data-claim`;
    - every `data-claim` that is not `"none"` has a source comment naming a decision or specification;
    - the products page holds the sentence that the icons are not drawn;
    - 0 pages mention a signature device.
12. **Start is true.** `site-add.test.ts` (017's block) takes the install page's code blocks, in order, from the built page's text. It applies exactly four named substitutions:
    - `bunx --bun shadcn-svelte@1.7.1` becomes the repository's locked CLI binary, as the smoke suites run it;
    - `SITE_ORIGIN` becomes the local server that serves `build/`;
    - the app-creation step becomes a scratch copy of the `kit3` fixture;
    - the `init` block is not run: in its place, the page's two file blocks are written, as text, into the scratch app (the `imports` block into its `package.json`, the `components.json` over its own; decision 13).

    Then:
    - after the substitutions, nothing else in any block's text differs from what the page shows (the test asserts it);
    - each `add` step exits 0, and the app's `vite build` and `svelte-check` pass with 0 errors;
    - the files the page says `add button` writes are the files written, under `src/lib/`, and their imports use `#lib`.

    **A second run** does the same in a scratch copy of `kit2` (SvelteKit 2). The second run applies the four, plus the page's SvelteKit 2 sentence: `#lib` read as `$lib`, and the `imports` block not written. Nothing else differs (fourth review, W1). Each `add` step exits 0, and the app builds with 0 errors.

    **Both runs install from the npm registry or Bun's cache, as the existing smoke suites do. Neither reaches this site's deployment or GitHub** (fourth review, W2).
13. **Motion obeys.** `doors.spec.ts` (017's block), both projects, on `/brand/motion/`:
    - 0 specimen animations run at any time before a Replay is pressed (only the bar's lockup entrance runs, once);
    - "Replay" plays its specimen once;
    - under reduced motion, it plays nothing, and the dots are in place.
14. **Literals.** `015`'s `site-literals.test.ts` holds over the new files: 0 colour literals, 0 arbitrary pixel values, and 0 `<style>` blocks.
15. **Suites, budget, documents, checkpoint and walk.**
    - `bun run test` exits 0.
    - `perf.spec.ts` (017's block): `/brand/colour/` is within decision 11's budget, with 0 `.wasm` requests.
    - `CHANGELOG.md`'s site paragraph holds decision 12's sentence.
    - `static/r/` is byte-identical to `015`'s committed tree.
    - The landing notes record the checkpoint's rulings, and the development walk over the 21 pages in both themes at 1440 and 390, with 0 page errors and 0 console errors or warnings.
16. **Released.**
    - The change is reviewed, the review is cited in the landing notes, and the change is committed to `release/0.12.0`.
    - `v0.12.0` is tagged locally once, after the change reviews of `013`, `014`, `015`, `016` and `017`.

## Build order

One builder, on `release/0.12.0` with `015` committed. Tests first, seen failing.

1. **Foundations:** the generated tables and their pages, and the token entries in search. Criteria 2, 3 (for these pages), 4 (its second part) and 10.
2. **Brand:** the downloads and their generator, the lockup-width fixture, the figures, the Colour bands, and the other pages. Criteria 1, 5 to 9, 11 and 13.
   - **Checkpoint.** The design lead:
     - looks at every Brand page at 1440 and 390, in both themes;
     - opens each download beside the live lockup at 2×;
     - edits the Brand prose against "settled only", R23 and R24.
3. **Start:** the five guides, with their commands run by the smoke app. Criteria 12, 14 and 15.

## Risks

- **Font licence.** The outlined word is IBM Plex Sans, under the SIL Open Font License. Outlining it into a logo file is the font's ordinary use. The download page credits the face.
- **fontkit's variable instance** may differ from the browser's at weight 700 by a hair. Criterion 7 bounds it at 1%.
- **Prose volume.** This is 21 pages of writing. The checkpoint edits the nine Brand pages, and the reviewer reads all 21.

## Review dispositions

From [`../reviews/017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md`](../reviews/017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md).

1. **Medium, the boundary leaks.** Fixed, with `015`'s finding 8:
   - `015` now builds `leaf.svelte` and `brand.svelte`, and 017 uses them;
   - `015`'s counts read `SITEMAP`;
   - decision 9 lists every test file 017 touches: three new files of its own, and `describe` blocks appended to `015`'s (the review's five, and `perf.spec.ts` for decision 11; the second review added `search.test.ts` and `sitemap.test.ts`, for eight; the third review's U2 added `build-output.spec.ts`, for nine), with no line of `015`'s edited.

   The Kind and Scope say so.
2. **Medium, criterion 12 cannot run the shown commands.** Fixed. Exactly three named substitutions: the locked CLI binary, the local server, and the `kit3` fixture. The test asserts that nothing else differs.
3. **Medium, the fixture is read before it is written.** Fixed. The fixture is committed and written by `scripts/site/lockup-width.ts`. The unit test reads the committed value. The browser test checks that the browser still agrees, and names the script if it does not.
4. **Low, the tag list.** Fixed. `014` is added, and the commit to `release/0.12.0` is named.
5. **Low, "settled only" checks only what is marked.** Fixed. Every `p`, `li`, `td` and `figcaption` in a Brand page's `<main>` is marked, with `data-claim="none"` for copy about the page itself. The test counts unmarked elements: 0.
6. **Low, the motion page and the budget.** Fixed. Specimens rest on load and move only on Replay (decision 7, criterion 13). `/brand/colour/` is measured, to `015`'s home budget (decision 11).
7. **Low, two edges.** Fixed. The mark page draws no four-colour mark on a field, even as a "don't" (decisions 1 and 4, criterion 8). Criterion 9 counts rendered text elements, by `getClientRects()`.
8. **Low, the Colour page's dark glass over yellow.** Fixed. The glass text is `foreground` only (decision 5), and criterion 8 checks it.
9. **Low, the token search entries.** Fixed. They are 017's (decision 10), and criterion 3 inherits `015`'s criterion 21 with them.

### Second review

- **S1, Medium, the `init` step.** Fixed. The guide shows `components.json` as the file to write, with `init` as the alternative and its answers named (decision 13). Criterion 12 adds a fourth named substitution: the `init` block is not run, and the page's own `components.json` is written into a scratch copy of `kit3`, which then runs the `add` steps and builds. _Why not the other option (compare with `kit3`'s committed file):_ `kit3`'s file uses `#lib` aliases and a GitHub `registry` that `init` never writes. `init`'s own output depends on a preset fetched from `shadcn-svelte.com`, so "what `init` writes" cannot be proved offline. The page's file is what the test can prove. (The reasoning about `#lib` here was wrong, and is corrected at the third review, U1: on SvelteKit 3, `kit3`'s aliases are what `init` writes. The mechanism stands.)
- **S2, Medium, the token entries cross the boundary.** Fixed with `015`'s S3. `015`'s endpoint globs `src/lib/site/search/sources/`, and 017 adds `tokens.ts` there (decision 10). 017 appends a `describe` to `search.test.ts`: every role and primitive once, each anchor resolving on the built page (criterion 3). Decision 9's table gains the row.
- **S3, Low, criterion 2's counts.** Fixed. 017 appends a `describe` to `sitemap.test.ts` (21 tagged `"017"`, every one built, 102 in all). It is the eighth file in decision 9's table.
- **S4, Low, the Colour page's budget.** Fixed. The borrowed budget is labelled INFERRED. It is measured at 017's checkpoint and set at the median plus 20%. A budget looser than the home page's needs the design lead's ruling (decision 11).

### Third review

- **U1, High, the guide's `components.json` used `$lib`.** Fixed. The page's `components.json` uses `#lib` aliases, and the page shows the `package.json` `imports` block they rely on (`kit3`'s), with one sentence for SvelteKit 2 apps. Decision 13's reasoning is corrected: on SvelteKit 3, `init` writes `#lib` whenever that `imports` map exists, and SvelteKit 3.1.0 has removed `$lib`. The test mechanism stays: criterion 12 writes the page's own blocks into a scratch `kit3`, and a second run proves the SvelteKit 2 sentence on a scratch `kit2`.
- **U2, Medium, unit tests that read `build/`.** Fixed with `015`'s T5. `brand-assets.test.ts` calls `downloadSvg` and `tokens-pages.test.ts` calls the table generators, both from source. Every check of the built downloads, pages and anchors is in 017's `describe` block in `015`'s `build-output.spec.ts`, which runs after the e2e stage's build (decision 9; criteria 2, 3, 5, 10, 11).

### Fourth review

Fit to build, with two write-ins, each taken as worded:

- **W1, Low, the second run adds a substitution.** Written in criterion 12: the second run applies the four, plus the page's SvelteKit 2 sentence (`#lib` read as `$lib`, the `imports` block not written), and nothing else differs.
- **W2, Low, what the smoke runs need.** Written in criterion 12: both runs install from the npm registry or Bun's cache, as the existing smoke suites do, and neither reaches this site's deployment or GitHub.

## Landing notes

### Step 1, Foundations (2026-11-15)

- **Built:** the seven Foundations pages; the generators `src/lib/site/foundations/tables.ts` (`tokenRows`, `codeRows`) and `contrast-rows.server.ts` (`colourRows`); each role's job in words, `words.ts`; the token entries in search, `src/lib/site/search/sources/tokens.ts` (109: 48 primitives, 61 roles).
- **Tests first:** `sitemap.test.ts`'s block (4 tests) and `search.test.ts`'s block (2) failed first. `tokens-pages.test.ts` was written after its generator, so it was seen failing by mutation (a dropped primitive and a swapped theme: 2 of 5 failed). The e2e blocks (`build-output.spec.ts`, `keyboard.spec.ts`) were seen failing by mutation of the built page (2 of 3 failed).
- **Deviations:**
  - A primitive's anchor is `#primitive-<name>`, not `#<name>`: `raised` is both a primitive and a role, and an anchor must be unique. A role's anchor is `#<name>`.
  - A primitive's copy button copies its value. Primitives are not custom properties in an app, so `--<name>` would name nothing. A role's copies `--<name>`, as decided.
  - Two shared pieces in new files: `src/lib/site/foundations/` (the table, swatch and copy-name components) and `src/lib/site/page/snippet.svelte`, a code block in any language. `015`'s `command.svelte` fences its code as `bash`, so the code page and the install guide need their own. No `015` line is edited.
  - `ink-shadow` is a primitive that no theme role reads; the tokens table says so.

### Step 2, Brand (2026-11-15)

- **Built:** the nine Brand pages; `src/lib/site/brand/` (the downloads' generator, the three figures, the Replay specimen, the page wrapper, the facts read at prerender); the downloads endpoint; `scripts/site/lockup-width.ts` and `tests/fixtures/lockup-word-width.json` (225.000 px at 100 px; the outline measures 225.000); `fontkit` 2.0.4 and `wawoff2` 2.0.1, exact.
- **Tests first:** `deps.test.ts`'s block failed first (5 failing, before the install). `brand-assets.test.ts` failed first (6 of 18). `brand-sources.test.ts` failed first (2 of 5). The e2e blocks were written after the pages and seen failing by four mutations: a muted sentence on glass, an unmarked `li`, a specimen that played on load and a figure label shown on a phone. Each was caught (4 failed).
- **Measured:**
  - Each lockup file is 2,079 bytes (its viewBox is cut tight to the word); each mark file 317.
  - The foreground on dark glass over the yellow field, as painted: **10.89:1** (`#F3F0E8` on `#3A3420`; computed 10.90). In light, 15.52:1. The 4.60 row, muted text on that glass, is never set: the glass text is foreground only.
  - `/brand/colour/` (perf, 3 runs): 289 kB, LCP 812 to 828 ms, CLS 0.002, 0 `.wasm`. Its budget is the median plus 20%: **347 kB, 984 ms**, CLS 0.05, inside the home page's 355 kB and 1,027 ms.
- **Deviations:**
  - The claims check reads every `p`, `li`, `td` and `figcaption` in `<main>` outside the breadcrumb's `nav`. The breadcrumb is `015`'s, and its `li`s cannot carry `data-claim` without editing it. It is navigation, which decision 2 marks `none`.
  - A Brand page's summary is set by 017's wrapper (`brand/page.svelte`) with `data-claim="none"`, and `015`'s `brand.svelte` gets the title alone, for the same reason.
  - The downloads page shows each file on fixed light-theme grounds, from the token file, in both themes: a file's colours do not change with the page's theme.
  - The reveal specimen on the motion page is played with the Web Animations API, timed from the tokens: the CSS reveal answers hover only.
  - A source comment's value is `data-claim="settled"`; the comment names the decision.

### The checkpoint (2026-11-15)

Ruled in `decisions.md`, "After the `017` build's checkpoint". The Brand pages and the six downloads are kept, and deviations 1 to 6 above are accepted. The design lead's editor edited seven Brand pages in place (mark, colour, type, surfaces, motion, imagery and voice); their wording is kept as edited. Poster type on the Colour bands stays.

- **Deviation from decision 7, imagery M4:** the three-meter specimen is removed. M4 settled large abstract images made from data, for campaigns, and three meters are a chart, not that. The section now says, as "People at work" does, that Pluto has none drawn yet. No test counted the specimens.
- **Imagery M1:** the search card stays, in a `figure` captioned as this system's own search card as it renders.

### Step 3, Start (2026-11-15)

- **Built:** the five Start guides. The install guide's blocks are data in `src/lib/site/start/install.ts` (`CREATE`, `IMPORTS`, `COMPONENTS`, `INIT`, `ADD_THEME`, `ADD_BUTTON`, and `filesWritten`), so the page and the smoke test read the same strings. `snippet.svelte` gained a `step` prop, written as `data-step`.
- **Tests first:** `sitemap.test.ts`'s Start and 102 tests failed until the five entries existed. `site-add.test.ts`'s block failed first on a real fault: 2 of 9 failed, kit3 and kit2 alike, with `cn`, `tailwind-variants` and `phosphor-svelte` missing. Run unattended, `add … -y` stops at the CLI's question "Updates to your src/app.css are required … Continue?", and leaves without installing the packages. So the guide's two adds carry `-o`, and the page says what `-y` and `-o` do. Then 9 of 9 passed.
- **The two runs:** kit3 takes the page's `imports` block into its `package.json` and the page's `components.json` over its own. kit2 takes the `components.json` with `#lib` read as `$lib`, and no `imports` block. Each add exits 0 and each app builds and type-checks with 0 errors, installing from the npm registry or Bun's cache. The files `add button` writes under `src/lib/` equal the page's list of 5, and they import `#lib`.
- **Deviations:**
  - The guide's adds are `add pluto-theme -y -o` and `add button -y -o`, not `015`'s `addCommand` alone, for the reason above. The Start landing's band shows the same two (below).
  - The app-creation block (`bunx sv create my-app --template minimal --types ts --add tailwindcss --install bun`) is not run, as criterion 12 says. Its flags were read from `sv` 0.16.6 in Bun's cache.
  - The test reads the guide's blocks from the built Markdown twin, which fences each with its language, rather than from the HTML.
- **Changelog:** the site paragraph gains decision 12's sentence: the five guides, the nine brand pages with the downloads, and the seven foundation pages.
- **The one `015` line 017 edits,** authorized by the design lead after step 3: the Start landing's band (`src/routes/(site)/start/+page.server.ts` and `+page.svelte`) now reads its two commands from `install.ts`, `-o` and all, with the sentence on what `-y` and `-o` do. The band and the guide cannot drift. Every component page keeps `015`'s `addCommand` without `-o`: an app that already has a part's files must not have them overwritten silently.
- **Fixed after the first full run:** `/start/install/` scrolled sideways at 360 px (372 px) and failed axe's `landmark-unique` in 6 scans. The fixes: the Start sections are `grid-cols-[minmax(0,1fr)]`, so a code block scrolls inside itself; the file list and the import line wrap anywhere; the `components.json` block's region is named "The components.json file". The 44 checks of those pages then passed.

### Figures (2026-11-15)

- Unit 1,150 pass, 0 fail. `check` 0 errors, 0 warnings. Lint clean. Literal lint 0 violations, 1 allowance.
- The first full `bun run test` found the two faults on `/start/install/` above (8 failed); a second was stopped from the main session partway through e2e.
- **The final full `bun run test`** (after the Start band's change), exit 0: unit 1,150 pass; e2e in all three projects, light, dark and perf, 2,555 passed, 4 skipped, 0 failed, in 8.9 minutes; smoke 131 pass, 0 fail (`site-add.test.ts` 9 of them, both install runs).
- **Perf medians** (3 runs each, 0 `.wasm` requests): `/` 303 kB, 860 ms, CLS 0.005; `/components/` 317 kB, 964 ms, 0.001; `/components/button/` 369 kB (budget 370), 932 ms, 0; `/components/code-block/` 342 kB, 936 ms, 0.002; `/brand/colour/` 290 kB (budget 347), 808 ms, 0.002. The footer's 21 new links add 2 to 3 kB to every page: the Button page has 1 kB left.
- **The development walk** on 5301, over the 21 pages at 1440 and 390 in both themes (84 loads): 0 page errors, 0 console errors or warnings, 0 sideways scroll.
- `static/r/` is byte-identical to `015`'s committed tree (`git status static/r` is clean before and after the run).
- The owner's dev server on 5199 ran throughout; nothing it wrote disturbed a build or a test.

### After the change review (2026-11-15)

The review is [`../reviews/017-the-design-site-start-brand-and-foundations-pr-2026-11-15.md`](../reviews/017-the-design-site-start-brand-and-foundations-pr-2026-11-15.md). Each finding, as answered:

1. **Criterion 8 on 017's pages:** `doors.spec.ts` gains an appended block that runs `015`'s check, "every four-colour mark sits on the canvas, a card or glass, never on a field", over the 21 pages tagged `"017"`.
2. **The mark page's graphic rule:** the claim is now only "The mark is a logo, so the 3:1 rule for graphics doesn't apply to it." Its `data-claim` and source comment stay.
3. **The paper downloads are the brand's paper,** `#F3F0E8`, not white. The mark page says so: on screen a mark on a field takes the field's legend, and the paper downloads are drawn in the brand's paper for the colour fields and dark grounds. The downloads page names the paper's value. **Decision 4's table, as built:** the paper files' dots and word are `paper`, `#F3F0E8`. Measured on the light fields they read 6.17 (blue), 4.93 (red) and 4.36 (green), not the white legend's 7.02, 5.61 and 4.96 that decision 4 quotes.
4. **The changelog** reads "The site also has Start guides, … Brand pages … and Foundations pages …", in place of "Behind its other three doors".
5. **The install check can fail now.** Each run records what it wrote and ran: the `imports` block read back from `package.json`, `components.json` read back, and each command given to the shell. A test per run compares that record with the page's blocks after the four named substitutions (and, for kit2, the SvelteKit 2 sentence), so a fifth difference fails. Seen failing by mutation (below).
6. **The Colour page's CLS budget** is 0.02: max(median × 1.2, 0.02), checkpoint 1's rule.
7. **Raw floats:** `/foundations/motion/` rounds its two percentages (10% and 55%). A scan of the 21 built pages' visible text finds no other long float. The figures' `data-value` attributes, which tests read, keep the token arithmetic as it is.
8. **The install guide's `init`:** it now says that `init` also asks for a preset and fetches it online, so it needs a connection, and the file does not.
9. **From a site teardown, the copy button covered the code** on `/start/install/` (`snippet.svelte`): the button sat over the first line, and a long line ran under it. A snippet now has a header row, the code's name and its copy button, so the button never covers the code at any width. A `site.spec.ts` block checks, at 1440, 390 and 360 px in both projects, that no copy button's box meets its code's text in any of the page's 6 blocks. Seen failing first on the old snippet (blocks 1, 5 and 6 overlapped), then passing. `015`'s `command.svelte` wraps its command, so its padding holds; it is unchanged.
- **Finding 5, seen failing by mutation:** a command run with one trailing space failed both runs' comparisons (2 of 10), then passed when restored.
- **Figures after the review round:** unit 1,150 pass; `check` 0 and 0; lint clean; literal lint 0, 1 allowance. e2e: `doors`, `site` and `build-output` in light and dark, 142 passed; axe on the Start and Foundations pages, 84 passed; the perf project, 5 of 5 within budget (`/brand/colour/` 290 kB, LCP 824 ms, CLS 0.002 against 347 kB, 984 ms and 0.02; `/components/button/` 369 kB against 370). Smoke 132 pass, 0 fail.

