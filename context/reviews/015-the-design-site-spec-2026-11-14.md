# Review of 015 — The design site: its frame, its components and its machinery

Reviews [`specifications/015-the-design-site.md`](../specifications/015-the-design-site.md). Its sibling, `017`, has its own review: [`017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md`](./017-the-design-site-start-brand-and-foundations-spec-2026-11-14.md). The template asks for one file per review, so there are two. Findings about the boundary between them appear in both, each from its own side.

- **Date:** 2026-11-14
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-14 (640 lines). Checked against:
  - the constitution (§2.3, §3 as amended on 2026-11-14, §4, §6);
  - every 2026-11-14 entry in `decisions.md`;
  - the site memo (`research/2026-11-14-the-design-site.md`) in full, and the `b-map-home-*` screenshots;
  - `013` (final), `014` (landed in the working tree), `016` and its review;
  - the working tree at `ef53f01`, with `014`'s uncommitted changes and the workbench.
- **Re-ran:** nothing in the repository was written except this file and its sibling. Scratch files are in the session's scratch folder (`…/scratchpad/review-015/`).
  - **Counts** (EXECUTED, shell and `bun -e` over the tree):
    - `src/routes/(site)/items/`: 75 pages, 8,136 lines (the spec says 8,134, before `014`'s edits), 177 `data-testid`, 195 sections, 50 titled "Accessibility". All as stated.
    - `tests/e2e/pages.ts`: `ITEMS` 75, `PAGES` 76, `VIEWS` 31, `COMPOSITION_VIEW_LIST` 13, so 44 views today.
    - `keyboard.spec.ts`: `FIXTURE_COUNT` 34, `STOP_COUNT` 73. As stated.
    - `/items/` in `tests/`: 133 occurrences in 14 files (136 for `/items` without the slash). The spec says 140.
    - In `src/`, outside the item pages, only `(site)/+page.svelte` (23). None in `src/lib/` or `scripts/`.
  - **Figures** (EXECUTED, `scripts/contrast.ts`):
    - `deltaE`: `#E2B000`–`#FBBC05` 5.19; `#F19E20`–`#FBBC05` 7.78; blue 15.77, red 8.92, green 12.99; `#C92035`–`#C11E31` 1.76.
    - `contrastRatio`: ink on `#E2B000` 9.53; `#F8D874` on graphite 13.20.
    - Every one matches the spec.
  - **The door labels** (EXECUTED): Chromium through the repository's Playwright 1.64.1, with the repository's `ibm-plex-sans-latin-wght-normal.woff2` at weight 600.

    | Label | 36 px | 56 px |
    |---|---|---|
    | "Components" | 211 px | 328 px |
    | "Foundations" | 207 px | 321 px |
    | "Brand" | 100 px | 156 px |
    | "Start" | 83 px | 129 px |

    `--type-section-size` is `clamp(2.25rem, 4vw, 3.5rem)` (READ, `src/app.css:108`), so the step is 56 px at 1440.
  - **SvelteKit's asset paths** (READ and EXECUTED):
    - `paths.relative` defaults to `true` (`node_modules/@sveltejs/kit/src/core/config/options.js:217`).
    - `vite.config.ts` does not set it.
    - The existing `build/items/button/index.html` loads `../../_app/immutable/…`.
  - **`vite preview` compresses** (READ: `node_modules/vite/dist/node/chunks/node.js:35773ff.` mounts `@polka/compression`, gzip). The spec's "served compressed" holds for the test server.
  - **Cloudflare docs** (READ, 2026-11-14):
    - [Workers Builds troubleshooting](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/#workers-name-requirement): "the specified name for the Worker on the Cloudflare dashboard must match the `name` … If it does not match" the build fails.
    - [Static assets headers](https://developers.cloudflare.com/workers/static-assets/headers/): rules apply to static asset responses, matched on the request URL, in file order.
    - [SSG and custom 404 pages](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/): `404-page` serves "the nearest `404.html`" with status 404.
  - **The code** (READ):
    - `src/lib/registry/ui/theme/{index.ts,theme.svelte.ts}`: `export const theme = new Theme()` at module load. Its constructor runs an `$effect` that toggles `dark` on `<html>`, and a `storage` listener.
    - `src/routes/(view)/+layout.svelte` imports `ThemeScript` from that index.
    - `src/lib/registry/ui/four-dot/*` (`tone="mono"`, `inline-grid grid-cols-2`).
    - `src/lib/registry/ui/code-block/code-block-content.svelte:16` (`tabindex = 0`) and `code-block-copy-button.svelte:3–4` (Phosphor icons).
    - `src/lib/registry/ui/marketing-bar/marketing-bar.svelte:14–38` (8 props; JSDoc cites "008 decision 2", "010 decision 4").
    - `grep -rE "0[0-9][0-9] decision" src/lib/registry`: 23 lines in 8 files.
    - `src/routes/(site)/items/{liquid-glass,pluto-theme}/+page.svelte`: both render `field-N` elements inline. `pluto-theme:44–47` renders all four, red among them.
    - `wrangler.jsonc` (`"name": "pluto-design-system"`); `tests/e2e/keyboard.spec.ts:230–468`; `tests/unit/deps.test.ts`; `scripts/build-registry.ts`.
    - `013` decisions 15, 18 and 20 and its test-view paragraph: it adds `/view/code-agreement/`. A page with a live tree-sitter block fetches the runtime (about 115 kB) and each grammar shown (Bash 177 kB).
    - `016` decisions 5 and 6 (the item pages it edits) and `016`'s review, finding 7.
  - **npm** (EXECUTED, `npm view`): no package is added by 015.

## Acceptance criteria against evidence

1. **Install and checks:** countable. READ.
2. **81 pages in `sitemap.ts`:** 1 + 4 + 75 + 1 = 81. The count is right (INFERRED). A literal 81 breaks when `017` adds 21 (finding 8).
3. **The URLs:** countable. READ.
4. **0 `/items/`:** countable. The baseline is 133, not 140 (finding 13). EXECUTED.
5. **The name:** countable. READ.
6. **One theme script on 81 pages, 44 views, 5 example views:**
   - After `013` there are 45 views (finding 13).
   - The five example views are not named (finding 22).
   - **Not met as written.**
7. **axe, 486 scans:** 81 × 3 × 2 = 486. Correct (INFERRED).
8. **Keyboard:** 34 fixtures and 73 stops, as stated (EXECUTED). `HOME_STOPS` and `COMPONENTS_STOPS` are written against the final markup, so the criterion is countable once that markup exists.
9. **No sideways scroll:** countable. The baseline of 7 pages at 360 and 6 at 390 agrees with `014`'s change review.
10. **The doors:** countable. But a door's name cannot fit its disc at the sizes decision 6 sets, and the size cap here forbids the fix (finding 2).
11. **The red door:** **not met as written.**
    - The `liquid-glass` and `pluto-theme` pages carry fields (finding 6).
    - "0 `svg` icons, 1 control" contradicts the copy button's icon and the code region's tab stop (finding 9).
12. **The landings:** **not met as written.** The Start glass holds three controls, the Foundations glass none, and the Brand glass is unspecified (finding 9).
13. **Examples are files:** ambiguous for the 17 blocks and compositions, which keep the block viewer (finding 22).
14. **Either theme, in a frame:** **not a guarantee.** The frame's own theme module undoes the pick (finding 3).
15. **API:** countable. `marketing-bar` has 8 props (READ). Its JSDoc would publish specification citations (finding 4).
16. **Files you own:** countable.
17. **The paths are true:** countable.
18. **Install from the site, then offline:** countable, and it proves §4.1 for the site's path.
19. **Markdown twins:**
    - "Same number of headings" conflicts with skipped example markup.
    - "0 HTML tags" conflicts with inline code such as `<button>` (finding 21).
20. **`llms.txt`:** countable.
21. **Search:** "81 pages, 75 items" indexes each component twice. The token entries point at a page `015` does not build (finding 10).
22. **The changelog page:** countable.
23. **The 404:**
    - The file-level check passes.
    - The page breaks at any depth (finding 5).
    - "Holds the search button" contradicts decision 18's client-rendered button (finding 5).
24. **Headers and deploy:**
    - Decision 21 lists 5 rules, not 6.
    - The worker's name is not checked (findings 1 and 13).
25. **Budgets:** countable. The budgets themselves are unmeasured under the stated profile (finding 11).
26. **Overflow regions:** countable.
27. **Reduced motion:** "a component page" is not named (finding 20).
28. **Tokens on the site:** countable. It misses unlayered Svelte `<style>` class rules (finding 17).
29. **Public:** countable. It would fail on item JSDoc (finding 4). `review` "as a document" is not mechanical (finding 21).
30. **Suites and documents:** "`static/` byte-identical" conflicts with decision 14 (finding 4).
31. **Released:** the tag list omits `014` (finding 7).

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The owner's worker rename to `pluto-systems-design` is not carried; decision 21 keeps the old name, and a mismatched name fails Workers Builds | decision 21; Kind; criterion 24 |
| 2 | High | A door's name in `type-section` does not fit its disc at any width: "Components" is 328 px in a 190 px disc at 1440, and 211 px in a 156 px disc at 390. The first answer to the Google echo cannot be laid out | decision 5 (Home); decision 6.1; "The home page's doors, measured"; criterion 10 |
| 3 | High | The other-theme frame does not hold its theme: the frame's `theme` singleton re-applies the stored preference on hydration and on every `storage` event | decision 12; criterion 14 |
| 4 | High | Generated API rows publish item JSDoc that cites specifications. Fixing or adding comments changes `static/r/`, which decision 26 and criterion 30 hold byte-identical | decisions 14, 17, 26; criteria 15, 29, 30; Kind |
| 5 | High | The prerendered `404.html` loads `./_app/…`. Served for `/components/nope/`, its CSS and JS resolve under that path and fail. Criterion 23 cannot see it | decisions 21, 5 (404); criterion 23 |
| 6 | High | "No component page carries a field" is false: `liquid-glass` shows glass on `field-1` and `pluto-theme` shows all four fields, red included. Decision 7's first defence and criterion 11 fail | decisions 5, 7.1; criterion 11 |
| 7 | Medium | The build-order reasoning and both owner questions predate "Commits per specification". The tag list omits `014` | decision 3; For the owner; criterion 31 |
| 8 | Medium | The 015/017 boundary is not clean: `017` must edit five of 015's test files, and 015 specifies no leaf-page template for 017 to build on | decision 2; ownership table; criteria 2, 5–9 |
| 9 | Medium | "The glass holds the band's only control" fits only Components. Start has three copy buttons, Foundations none, Brand is unspecified. "0 svg icons" contradicts the copy button's icon | decision 5 (A landing); criteria 11, 12 |
| 10 | Medium | The search index lists each component twice: once from `sitemap.ts` and once from `registry.json`. The token entries point at `017`'s page | decision 18; criterion 21 |
| 11 | Medium | The budgets are unmeasured under their own profile. Site code blocks would pull `013`'s runtime and the Bash grammar unless they prerender `lines`. `perf.spec` under `fullyParallel` in both projects will be noisy | decision 23; criterion 25 |
| 12 | Medium | The rebuild must carry page text that `013` and `016` mandate on item pages. The ownership table omits `016`'s five pages, and no criterion keeps those sentences | ownership table; Build order step 1 |
| 13 | Medium | Counts that are wrong or will be: 44 views (45 after `013`); 140 `/items/` (133); "6 rules" in `_headers` (5) | decisions 1, 21, 24; criteria 6, 24 |
| 14 | Low | Dark glass passes over a light-theme frame on a dark page, which R25 forbids as written | decisions 5, 12 |
| 15 | Low | The `/404.html` `_headers` rule never matches: headers match the request URL, not the file served | decision 21 |
| 16 | Low | The stale figure `016`'s review flagged remains: 57.1 is the yellow dot alone; the four dots together keep 43.6. Checkpoint 0's override is not named variable by variable | decision 5 table; decision 3 |
| 17 | Low | Criterion 28 bans element selectors outside `@layer`, but any Svelte `<style>` rule is unlayered and beats a field's layered legend | decision 5; criterion 28 |
| 18 | Low | The Start glass's middle command ("the fonts it names") is redundant: `add pluto-theme` brings the three font items | decision 5 (Start) |
| 19 | Low | "Types as written" gives `ButtonVariant`, not its values. The table layout for multi-part items is unsaid. Reading a `.svelte` script needs `svelte/compiler`, not the TypeScript parser alone | decision 14 |
| 20 | Low | Criterion 27's "a component page" is unnamed. Spinner and skeleton pages animate by design | criterion 27 |
| 21 | Low | The Markdown and public checks need exact edges: inline code, skipped headings, and the word "review" | criteria 19, 29 |
| 22 | Low | The five example views are unnamed. Blocks and compositions are not covered by "every item has an example file". `live: false` examples have no stated switch behaviour | decisions 12, 13; criteria 6, 7, 13 |
| 23 | Low | `sitemap.xml` at the `workers.dev` origin invites indexing a host that is later dropped without redirects | decisions 4, 20 |

## Findings, most severe first

1. **High: the worker rename is not carried** (`015:411`, decision 21; Kind; criterion 24).
   - **The defect.** `decisions.md`, "Commits per specification, and the site's worker name": "rename it `pluto-systems-design` … `015` carries the rename in `wrangler.jsonc`." Decision 21 says "`wrangler.jsonc` keeps the worker `pluto-design-system`". No criterion reads the name.
   - **Failure.** The site deploys under the old name, against the ruling. If only the file is renamed, Workers Builds fails the build: "the specified name for the Worker on the Cloudflare dashboard must match the `name` … in the Wrangler configuration file" (READ, Cloudflare docs, 2026-11-14). It may instead open a pull request that renames it back.
   - **Fix.**
     - Decision 21 sets `"name": "pluto-systems-design"`.
     - Criterion 24 reads it.
     - `SITE_ORIGIN`'s placeholder becomes `pluto-systems-design.<account>.workers.dev`.
     - Add an owner step before the first push: rename or create the worker `pluto-systems-design` in the dashboard and reconnect Workers Builds to it. A rename in the file alone fails.
     - Owner question 1 then asks only for `<account>`.

2. **High: the door labels do not fit the discs** (`015:191`, `015:195`, `015:526–528`; decision 6.1; criterion 10).
   - **The defect.** Each disc holds "its door's name in `type-section`". At 1440, `type-section` is 56 px and the disc 190 px. "Components" sets 328 px wide and "Foundations" 321 px (EXECUTED). At 390 the disc is at most 156 px (40%), and "Components" at the 36 px floor is 211 px. At 1024 the poster is 123 px, so the disc is about 146 px; the label is about 240 px. The screenshots the owner approved (`b-map-home-*`) set the labels near 22 px, not at `type-section`.
   - **Failure.** The builder must either overflow the disc, wrap a single word, or shrink the type. Criterion 10 caps the disc at the headline's height, so the disc cannot grow. "The discs carry words" is the first and strongest answer to the Google echo, and as written it cannot be laid out.
   - **Fix.**
     - Set the door name in a step that fits, measured: a body step such as `text-xl` 600, the size the prototype used. Or `type-section` only from a stated width at which "Components" fits 80% of the disc's chord at the text's line.
     - Make the line under it `text-sm`.
     - Add to criterion 10: each label's box lies inside its disc's inscribed square, at 390, 1024 and 1440.

3. **High: the other-theme frame reverts to the page's theme** (decision 12, `015:315–334`; criterion 14).
   - **The defect.** The `(example)` layout renders "one ThemeScript". Importing `ThemeScript` from `#lib/registry/ui/theme` loads `theme.svelte.ts`, which runs `export const theme = new Theme()` at module load. The constructor's `$effect` sets `<html>.dark` to the stored or system preference. Its `storage` listener re-reads the preference whenever another same-origin document writes it (READ, `theme.svelte.ts:30–55, 87`).
   - **Failure.**
     - In a light page, the visitor picks Dark. The parent sets `dark` on the frame's `<html>` on `load`. The frame then hydrates, its effect resolves `light`, and it removes the class.
     - Or the visitor toggles the page theme. The `storage` event flips every open frame to the page's theme.
     - Either way the "other theme" shows the same theme. Criterion 14 can pass at the moment it reads the class, depending on whether `load` precedes hydration.
     - The block viewer does not meet this today only because it always copies the page's theme.
   - **Fix.**
     - Pass the pick in the frame's address (`/example/<item>/<example>/?theme=dark`).
     - Have the `(example)` layout render a frame-only head script that reads it. It must not import the theme module's index, so no `Theme` instance exists in the frame.
     - Say what happens to an example that itself imports the theme (the `theme` item's toggle): it shows only inline, with no switch, and the page says why.
     - Criterion 14 then reads the frame's class after `data-view-ready`, after the page's toggle is pressed, and after `emulateMedia({ colorScheme })` flips. The frame keeps the pick in each case.

4. **High: the API table publishes specification citations, and fixing them breaks "`static/` byte-identical"** (decisions 14, 17, 26; criteria 15, 29, 30; Kind "No registry item changes").
   - **The defect.**
     - Decision 14 shows each prop's JSDoc. Item JSDoc cites specifications, for example `marketing-bar`'s "(008 decision 2's shape)" and "(010 decision 4)", and `stage-hero`'s and `proof-band`'s "(010 decision …)". A grep finds 23 such lines in 8 item files.
     - Criterion 29 fails on `/\b0\d\d decision\b/`.
     - Decision 14 also tells the builder to add missing doc comments "in the item's file".
     - Every registry item's JSON embeds its files' text. Any comment edit therefore changes `static/r/` and `static/v0.12.0/r/`. Decision 26 and criterion 30 say these stay byte-identical, and the Kind says no registry item changes.
   - **Failure.** The criteria cannot all pass. A builder will either publish the citations or edit items against three statements of the spec.
   - **Fix.** Choose one and say it.
     - **(a) Recommended:** allow comment-only item edits. Rewrite each cited JSDoc in plain words, and add the missing ones. Regenerate the registry. Replace "byte-identical" with "differs only in comment lines" (a unit test diffs the JSON with comments stripped). Add one 0.12.0 changelog sentence saying item comments changed and no interface did.
     - (b) The generator strips parenthesised specification citations and adds no comments. Props without JSDoc show no description.
     - Either way, criterion 29 runs over the API rows.

5. **High: the 404 page breaks below the root, and its search button is not in the HTML** (decision 21; the 404 in decision 5; criterion 23).
   - **The defect.**
     - SvelteKit writes relative asset paths by default (`paths.relative: true`, READ). The existing build shows `../../_app/…` on `/items/button/`.
     - `build/404.html`, prerendered at the root, will load `./_app/…`.
     - Cloudflare's `404-page` serves that file for the unknown URL itself. For `/components/nope/` the browser fetches `/components/nope/_app/immutable/…`, which itself 404s with HTML.
   - **Failure.**
     - The 404 renders unstyled and does not hydrate.
     - Decision 18's search button is "rendered by the client", so it never appears. Criterion 23's "holds … the search button" cannot hold even for a correct build, because the static HTML has only an empty slot.
     - Criterion 23 checks the file and runs axe on `/404`, so it passes.
   - **Fix.**
     - Set `kit.paths.relative: false` (the site is served at its origin's root, and every iframe and twin is same-origin). Or post-process `404.html` to absolute `/_app/` paths.
     - Add to criterion 23: `site.spec.ts` serves `build/` with a 404 fallback (`vite preview` does not; a ten-line `Bun.serve` that returns `404.html` with status 404 does). It requests `/components/nope/` and `/a/b/c/`, and expects status 404, the canvas background, the four door links, and after hydration the search button.
     - Reword "holds the search button" as "shows it after hydration".

6. **High: two component pages carry fields, red among them** (`015:164`, `015:265`; criterion 11).
   - **The defect.** Decision 7's first defence is "the red field is on one page … No component page carries a field", and criterion 11 counts 0 `field-1` … `field-4` on the 75 component pages. But:
     - `liquid-glass`'s page draws glass "on `field-1`" (`liquid-glass/+page.svelte:33–36`). Glass cannot be shown without a field behind it.
     - `pluto-theme`'s page renders all four fields as swatches (`pluto-theme/+page.svelte:44–47`), including `field-2`, red.
   - **Failure.**
     - Criterion 11 fails on those two pages.
     - Meeting it by deleting the specimens weakens §2.3 for both items.
     - Decision 7's "the red field is on one page" is false.
   - **Fix.**
     - Name the exception: fields may appear inside an example frame on `liquid-glass` and `pluto-theme`, and nowhere else on a component page.
     - Criterion 11 counts fields outside example frames.
     - Decision 7.1 says the red swatch on `pluto-theme` is a labelled specimen of the token, inside a frame, with no error-like content beside it.
     - Or render those examples only as views in the block viewer's iframe. Then they are out of the page's DOM and the criterion stands as written.

7. **Medium: the build-order reasoning and the owner questions are stale** (decision 3, `015:110`; For the owner 1 and 2; criterion 31).
   - **The defect.**
     - Decision 3 says "nothing is committed without the owner's word … so there is no branch to build on". Question 2 asks whether to allow commits to a branch.
     - The owner has since ruled ("Commits per specification…"): each specification is committed to `release/0.12.0` as it lands. `013`'s header already says so.
     - Question 1 asks for the whole address; the owner fixed it as `pluto-systems-design.<account>.workers.dev`.
     - Criterion 31 and the Ships-with line tag after `013`, `015`, `016` and `017`. The ruling names `014` too.
   - **Fix.**
     - Rewrite decision 3's "why not alongside" on the true ground: sequential builds so each sees its own tests fail first, each committed on landing.
     - Drop question 2 and cite the ruling.
     - Narrow question 1 to the account subdomain, plus the dashboard step of finding 1.
     - Add "committed to `release/0.12.0`" to criterion 31's landing notes.
     - Add `014` to the tag lists.

8. **Medium: the 015/017 boundary leaks** (decision 2, `015:101–103`; ownership table row "via the list only").
   - **The defect.** Decision 2 says "017's builder never edits an item page or a shared test file". `017`'s own criteria add tests to:
     - `keyboard.spec.ts` (017 criterion 4);
     - `site.spec.ts` (017 criteria 5, 7, 9);
     - `doors.spec.ts` (017 criteria 8, 13);
     - `site-add.test.ts` (017 criterion 12);
     - `deps.test.ts` (017 criterion 1).

     `sitemap.test.ts` must also change if it pins 81 (015 criterion 2). And 015 lists no template for a quiet leaf page (breadcrumb, title, rail, productive `<main>`) or for an expressive Brand page. `page/` holds only landing and component parts. Yet `017` is "on 015's templates" and may change them only "as a page needs".
   - **Failure.** `017`'s builder either edits 015's files or builds a second chrome.
   - **Fix.**
     - 015 builds `page/leaf.svelte` and uses it for the changelog. Also `page/brand.svelte` (an expressive shell with a quiet header and full-bleed slots), used by the Brand landing below its band.
     - Every count in 015's tests reads `SITEMAP` (or its `spec` tag) instead of a literal: "81 of 81" means "every entry".
     - The ownership table states plainly that `017` appends `describe` blocks to `keyboard`, `site`, `doors`, `site-add` and `deps`. Decision 2's sentence becomes "017 adds tests to named files and changes none of 015's".

9. **Medium: the bands' controls are not what criterion 12 says** (`015:210–214`; criteria 11, 12).
   - **The defect.** Decision 5 says "the glass holds the only control on the band". But:
     - Start's glass holds "the three commands", which are three `code-block`s with three copy buttons.
     - Foundations' glass holds "three facts", so no control.
     - Brand's band has no stated glass content.
     - Every `code-block` region has `tabindex = 0` (`code-block-content.svelte:16`), so each command is two tab stops.
     - The copy button holds Phosphor's `Copy` icon, an `svg`. Criterion 11's "0 `svg` icons … 1 control" on the Components band contradicts the copy button the same criterion requires.
   - **Fix.**
     - Say per band what the glass holds and how many controls, and what counts: buttons and links, or every tab stop.
     - For Start, either one glass with three blocks ("the band's controls are inside its glass"), or one command with the other two below the band.
     - Criterion 11 counts `svg` outside the glass.

10. **Medium: the search index doubles every component, and its token links have no target** (decision 18; criterion 21).
    - **The defect.**
      - The index is built from `sitemap.ts` ("every page") and from `registry.json` ("every item"). The 75 component pages are in both, so "dial" returns Dialog twice.
      - The token entries point "at `/foundations/tokens/#<name>` once `017` lands", but 015 builds before `017` and states no interim target.
    - **Fix.**
      - One entry per page. A component page's entry takes its group and description from the registry.
      - The token entries are `017`'s to add (move them to `017`'s scope and to its inheritance of criterion 21).
      - Criterion 21 then reads "81 entries, each path once".

11. **Medium: the budgets are unmeasured, and the site's code blocks could pull `013`'s engine onto every page** (decision 23; criterion 25).
    - **The defect.**
      - The only figures are unthrottled and taken at `v0.11.0` (238, 288 and 253 kB). Nothing is measured at 1.6 Mbps, 150 ms and 4× CPU, so the LCP line of 2.5 s is a target, not a finding. It should be labelled INFERRED.
      - `013` makes a `code-block` given `code` and `language` fetch the tree-sitter runtime (about 115 kB) and the grammar (Bash 177 kB) in the browser (`013` decision 20, "What this costs").
      - The install command sits in a `code-block` on the home page, on the Start band and on all 75 facts cards. If those blocks highlight Bash live, the home page passes 320 kB.
      - `perf.spec` under the config's `fullyParallel: true` and two projects will throttle CPU on a loaded machine.
    - **Fix.**
      - Every site `code-block` passes prerendered `lines`, or no language. Criterion 25 asserts 0 requests for `.wasm` on the four pages.
      - Measure the four pages under the profile at checkpoint 1 and set each budget at the measurement plus a stated margin.
      - `perf.spec` runs in the `light` project only, `mode: "serial"`, one worker. Record all three runs.

12. **Medium: the rebuild can silently drop text `013` and `016` require** (ownership table, `015:532–545`; Build order step 1).
    - **The defect.**
      - `016` decision 6 edits the copy of `alert`, `badge`, `chart`, `product-home` and `pluto-theme` ("amber" → "yellow"), but the table's 016 column touches no item page.
      - `013` requires sentences on its six pages: "The item page states the deploy weight", "lists each grammar's disk and gzipped cost", "says so" about CSP and the protanopia limit.
      - 015 rebuilds all of these on a new template. No criterion keeps that text.
    - **Fix.**
      - Add `016`'s five pages to the table.
      - Add a criterion: after the rebuild, each sentence `013` and `016` require is present on its `/components/` page. List the sentences in a fixture read by `site.spec.ts`, and say "amber" appears on 0 component pages.

13. **Medium: counts that are, or will be, wrong** (decisions 1, 21, 24; criteria 6, 24).
    - **The defects.**
      - "The 44 block and composition views": `013` adds `/view/code-agreement/` to `pages.ts`'s views, so there are 45 when 015 starts.
      - "The 140 `/items/` occurrences across 14 test files": 133 measured (136 without the trailing slash).
      - "Parses into the 6 rules of decision 21": decision 21 lists 5 blocks.
    - **Fix.** Derive the view count from `pages.ts`, write "every view", correct 140 to the measured figure, and say "5 rules" (or add the sixth one meant).

14. **Low: dark glass over a light frame** (decisions 5, 12).
    - **The defect.** On a dark page, a light-theme example frame scrolls under the bar. R25: "dark glass never over a light-theme ground".
    - **Fix.** Write in: "The bar's text is `foreground` and `primary` only; `012` measured `foreground` on dark glass over white at 10.00. A light frame under the dark bar is accepted on that row." Or give the frame `z-index` below a solid strip.

15. **Low: a dead header rule** (decision 21).
    - **The defect.** `/404.html` matches only a request for `/404.html`, which `auto-trailing-slash` redirects. A 404 served for `/x` matches `/x`.
    - **Fix.** Drop the rule. Put `<meta name="robots" content="noindex">` in the 404 page (criterion 23's "`noindex`" then means the meta tag).

16. **Low: a stale 016 figure, and checkpoint 0's overrides** (`015:140`; decision 3).
    - **The defect.** "57.1 or more in dark" is the yellow dot's figure. `016`'s review measured 43.6 for the four dots over dark glass on the four fields. Checkpoint 0 says "`016`'s yellow values set in the scratch page's own stylesheet" without naming them.
    - **Fix.**
      - Write 43.6.
      - Name the overrides, in both themes: `--mark-3`, `--field-3`, `--chart-3` and `--caution`, plus the dark expressive mark rule's third dot (`.dark [data-mode="expressive"]`). The amber dot otherwise survives in the bar's dark lockup.

17. **Low: unlayered Svelte styles** (decision 5; criterion 28).
    - **The defect.** A Svelte `<style>` block emits scoped, unlayered rules. A `.label { color: … }` there beats `field-N`'s layered legend, the memo's §6.3 failure, without an element selector.
    - **Fix.** Criterion 28: site components carry no `<style>` blocks, or every rule in one sits inside `@layer components`.

18. **Low: the middle command on the Start band** (`015:211`).
    - **The defect.** `pluto-theme` lists the three font items as `registryDependencies` (`001` decision 17), so "the fonts it names" is not a step the smoke apps run.
    - **Fix.** Two commands, `add pluto-theme` then `add button`, or name what the middle one is.

19. **Low: the API generator's edges** (decision 14).
    - **The defect.** "Types as written" renders `variant?: ButtonVariant`, a name the reader cannot use. Multi-file items (`dialog` has ten parts) have no stated table layout. The props of a `.svelte` file are reached through `svelte/compiler`'s `parse`, then TypeScript.
    - **Fix.**
      - Expand `VariantProps<typeof xVariants>` into the keys of `variants`.
      - One table per exported part, in `index.ts`'s order.
      - Name `svelte/compiler` (pinned via `svelte`).

20. **Low: criterion 27's component page.**
    - **Fix.** Name it (`/components/dialog/`, say), and exclude `spinner` and `skeleton` from "0 animations at any time" or say what reduced motion does to them.

21. **Low: exact edges for the Markdown and public checks** (criteria 19, 29).
    - **Fix.**
      - Count headings in `<main>` outside `[data-md="skip"]`.
      - "0 HTML tags outside code spans and fences".
      - Replace "`review` as a document" with literal patterns (`reviews/`, `spec review`, `change review`), and say how a person's name is read (`git log --format=%an`, at test time).

22. **Low: unnamed examples, blocks without example files, and code-only examples** (decisions 12, 13; criteria 6, 7, 13).
    - **Fix.**
      - Name the five example views (the six of criterion 14 less one, or say which).
      - Say whether blocks and compositions have example files or are exempt from criterion 13's "every item".
      - Say that a `live: false` example has no Light/Dark switch.

23. **Low: indexing the temporary origin** (decisions 4, 20).
    - **The defect.** With no redirects, pages indexed at `workers.dev` stay indexed after the domain moves.
    - **Fix.** Either an `X-Robots-Tag: noindex` block keyed on the `workers.dev` host in `_headers` (Cloudflare matches absolute URLs), removed when the DNS is set; or a sentence accepting the duplicate.

## The owner's rulings

- **Direction B, the name, `/components/` with no redirects, `/identity/` removed, the changelog page only, Markdown and `llms.txt`, both install sources:** honoured.
- **The worker rename:** not honoured (finding 1).
- **Commits per specification:** not reflected (finding 7).
- **The yellow** is `016`'s values throughout, and no criterion pins a hex. Only the 57.1 figure remains of `016`'s review finding 7 (finding 16).
- **The phone overflow** left for 015 by the `014` checkpoint is fixed here, with the six pages `014`'s change review counted (decision 13).
- **The Google echo** is answered by six real design moves. The strongest, words on every disc, cannot be laid out as specified (finding 2). With finding 2 fixed, the answer is a design answer, not a hope. Checkpoint 0 is the right place to judge it, on `016`'s yellow.
- **Red as error** is answered by place and content, which is the right axis since hue cannot do it (1.76 ΔE, EXECUTED). The "one page" claim needs finding 6's exception.

## Constitution checks

- **§2.3 every item, both themes:** met by construction: each of the 75 pages renders live in the page's theme, and both browser projects test every page. Decision 12 adds the other theme per example, but as specified it does not hold (finding 3).
  - **Accessibility of the frame:** the switch is a two-item `toggle-group` that keeps focus. It adds one tab stop per frame, outside each keyboard fixture, so the 73 fixture stops are unaffected (READ: a fixture is walked from its own first stop to its own exit). The iframe has a title.
  - **Performance:** a frame loads only on a pick.
  - **Test IDs:** these live in the frame's own document, which page locators do not pierce, so strictness holds.
- **§3:** the site is guidance and brand, and sells nothing. `017`'s product names are naming rules, not offers.
- **§4.1 source, not a package:** serving `/v<version>/r/` from the site is installing, not run time. Criterion 18 proves the installed files name neither origin and build offline. Consistent.
- **§4.3 tokens are the one source:** held for colour (criterion 28). Sizes lean on Tailwind's scale (`max-w-7xl`, `max-w-prose`), which items already use; acceptable, but say so in decision 5. Unlayered Svelte styles are a gap (finding 17).
- **§4.4 accessible by default:** the plan is complete: axe at 3 widths in both themes, keyboard walks, ring on canvas for the discs, a combobox search with no single-key shortcut, reduced motion, and named scroll regions. The 404 at depth is the gap (finding 5).
- **§4.5, §4.6 pinned:** 015 adds no package and removes six. The six are imported only by `(identity)/+layout.svelte` and listed in `deps.test.ts` (READ).
- **§6 never break an installed app silently:** holds once finding 4 is decided. A comment-only change is not an interface change, but it alters what `add` writes, so the changelog should say so.
- **§6 never copy prior art:** the memo studied and described. Nothing is copied.

## Risk

The scope is large for one builder:

- 75 pages rebuilt;
- an example system;
- an API generator;
- a Markdown converter;
- search;
- a frame mechanism;
- the test migration;
- 75 items' worth of usage prose.

It is possible because each part is mechanical and tested. Most likely to go wrong, in order:

1. **The frames** (finding 3). This is new browser behaviour with a theme singleton in the way.
2. **The migration of 177 test IDs and 34 fixtures into example files.** A fixture that straddles two examples breaks its walk.
3. **The API generator against 75 items' prop shapes,** with no fallback.
4. **The usage prose.** 75 × (2–3 sentences + 4–8 do and don't) is drafted by an engineer, and the design lead edits ten. Budget checkpoint 2 for more, or have the reviewer of the change read all 75.
5. **The budgets** (finding 11).

## Verdict

Does not land yet: findings 1 to 6 (High) and 7 to 13 (Medium) stand. Findings 1, 7 and 13 are text fixes. Findings 2, 3, 5 and 6 need a design change with a criterion each. Finding 4 needs one decision between the two options given.

## For the owner

1. **The worker:** rename (or create) `pluto-systems-design` in the Cloudflare dashboard and reconnect Workers Builds to it before the first push of 015. Otherwise the build fails on the name check. Then give the `<account>` part of `pluto-systems-design.<account>.workers.dev`.

## Disposition

(Filled in after the design lead answers.)

## Second review

- **Date:** 2026-11-14
- **Reviewed:**
  - the specification as revised (1,219 lines), with its "Review dispositions";
  - `decisions.md`, "The design site's review calls, taken while the owner was away (2026-11-14)";
  - the working tree as it stands, with `013`'s build in progress (`src/lib/registry/lib/highlight/` is new and untracked).
- **Settled, not raised again:** the citation of `016` decision 5, and the worker's name `pluto-systems-design`.
- **Re-ran** (nothing in the repository was written but the two review files; scratch in `…/scratchpad/review-015/`):
  - **The budget baseline** (EXECUTED). A gzip-serving `Bun.serve` over the existing `build/` (the `014` working tree, not `v0.11.0`). Chromium through the repository's Playwright 1.64.1, 1280 × 900, CDP: 150 ms, 1.6 Mbps down, 750 kbps up, CPU 4×, cache off. Three runs each:

    | Page | Transfer | LCP | CLS | `.wasm` |
    |---|---|---|---|---|
    | `/` | 245 kB | 856–900 ms | 0 | 0 |
    | `/items/button/` | 296 kB | 848–888 ms | 0 | 0 |
    | `/items/code-block/` | 262 kB | 860–880 ms | 0 | 0 |

    Decision 23's figures (238, 288 and 253 kB; 860–872 ms) are reproduced within 3%. The difference is `014`'s tree. **The measured budgets hold.**
  - **The bar over a light frame** (EXECUTED, `compositeAlphaByte` and `contrastRatio`): the dark `--glass-tint` `#16140FD6` over white composites to `#3B3A36`. On it, `foreground` measures 9.99, `primary` 5.36 and `muted-foreground` 4.21. As stated.
  - **The door words between the phone and the desktop** (EXECUTED; the repository's Plex Sans 600 and Geist 400, with decision 5's rules: disc = 2.7 × poster ÷ 2.267 from the two-column layout, 40% of the width below 640, name = 0.12 × disc, line `text-xs` 12 px):

    | Width | Disc | Name | "Components" | "Install, theme, modes" at 12 px |
    |---|---|---|---|---|
    | 390 | 156.0 | 18.7 px | 109.7 | 116.5 |
    | 768 | 109.8 | 13.2 px | 77.2 | **116.5, wider than the disc** |
    | 1024 | 146.4 | 17.6 px | 102.9 | 116.5 |

  - **JSDoc that the API table would show** (EXECUTED: every `/** … */` block in `src/lib/registry/**/*.{svelte,ts}`, matched against criterion 29's patterns and against bare citations):
    - the five lines of decision 14, as listed;
    - `lib/highlight/roles.ts:1` "(013 decision 7)" and `lib/highlight/languages.ts:1` "(013 decisions 3 to 6)". These are new with `013`'s build. The plural is **not** matched by `/\b0\d\d decision\b/`.
    - `ui/stage-hero/stage-hero.svelte:65` "for launches only (K3)", an internal question code.
  - **The six JSON files** (EXECUTED, grep of `static/`): exactly `proof-band`, `stage-hero` and `marketing-bar` under `static/r/` and `static/v0.12.0/r/` embed the five comments. As stated.
  - **`013`'s rule for the code-block page** (READ, `013` criterion 12, C1): the page holds "0 references to tree-sitter, `.wasm` or Shiki assets". Its blocks today take `lines` or plain `code` with no language (READ, `items/code-block/+page.svelte`).
  - **The items that bring `theme`** (EXECUTED, `registry.json` walked through `registryDependencies`): `theme` and `app-shell` only. The root `+layout.svelte` imports `app.css` only (READ). So an `(example)` route that does not import the theme index holds no `Theme` instance.
  - **`shadcn-svelte init`** (READ, `node_modules/shadcn-svelte/dist/index.mjs`):
    - it fetches `/init?preset=…` from the registry's base URL;
    - it prompts for a preset unless one is given;
    - the smoke suites never run it, because `kit3` ships its own `components.json`.

    This bears on `017`, and is recorded in its review.
  - **Cloudflare** (READ, [static assets headers](https://developers.cloudflare.com/workers/static-assets/headers/), 2026-11-14): a placeholder's delimiter "when part of the host, is a period". So a host rule with `:account` is valid.

### The first review's findings, against the revised text

| # | Was | Now | Where it is resolved |
|---|---|---|---|
| 1 | High | **Resolved** | decision 4, decision 21's `wrangler.jsonc`, criterion 24, For the owner 1 |
| 2 | High | **Resolved at 390, 1024 and 1440; open between them** (second-review finding S1) | decision 5's table; criterion 10 |
| 3 | High | **Resolved** | decision 12 (`?theme=`, no theme import, three no-switch kinds); criteria 6, 14 |
| 4 | High | **Resolved in design; the closed list is already stale** (S2) | decisions 14, 26; criteria 15, 29, 30 |
| 5 | High | **Resolved** | decision 21 (`paths.relative: false`); criteria 23, 24 |
| 6 | High | **Resolved** | decisions 5, 7.1; criterion 11 |
| 7 | Medium | **Resolved** | decision 3; Ships with; criterion 31; For the owner |
| 8 | Medium | **Resolved for templates and counts; open for search** (S3) | decision 2; templates table; decision 24; ownership table |
| 9 | Medium | **Resolved** | decision 5's band table; criteria 11, 12 |
| 10 | Medium | **Resolved in 015; moved to 017, where it leaks** (S3) | decision 18; criterion 21 |
| 11 | Medium | **Resolved** (re-measured above) | decision 23; criterion 25 |
| 12 | Medium | **Resolved** | decision 10; criterion 13; ownership table |
| 13 | Medium | **Resolved** | decisions 1, 21, 24; criteria 4, 6, 24 |
| 14 | Low | **Answered**: stands with its measurement (9.99, 5.36, 4.21, re-measured above) | decision 5 (the bar) |
| 15–22 | Low | **Resolved** | decisions 5, 13, 14, 19, 21; criteria 19, 20, 22, 27–29 |
| 23 | Low | **Resolved, with one gap** (S5) | decisions 20, 21 |

### Second-review findings

| # | Severity | Finding | Where |
|---|---|---|---|
| S1 | Medium | Between 640 and 1023 px the hero's layout is unstated. At 768 under the two-column rule the disc is 110 px and the 12 px line is 116.5 px. Criterion 10 checks only 390, 1024 and 1440 | decision 5 (Home); decision 6.3; criterion 10 |
| S2 | Medium | The list of five comment lines is closed, but `013`'s committed tree will hold more citing JSDoc, one of which the pattern misses. `registry-comments.test.ts` pins exactly five lines, names no base commit, and outlives the release | decisions 14, 26; criteria 29, 30 |
| S3 | Medium | `017`'s token entries need `015`'s search endpoint and `search.test.ts`. Neither has an extension point, and "one entry per page, each path once" rejects anchor entries | decisions 2, 18; criterion 21; ownership table |
| S4 | Low | Decision 23 cites a live "highlighted as you type" example on `code-block`'s page. It contradicts criterion 25's 0 `.wasm` and `013`'s C1 | decision 23 |
| S5 | Low | The `workers.dev` `noindex` rule is "deleted in the change that sets the domain", but the `workers.dev` host keeps serving after a custom domain is added | decisions 20, 21 |
| S6 | Low | The three calls taken while the owner was away are recorded, but not put to the owner as questions on return | For the owner; `decisions.md` entry |
| S7 | Low | Two edges of the `?theme=` frame: SvelteKit forbids reading `url.searchParams` during prerender, and no test proves a switched example never imports the theme module | decision 12; criteria 13, 14 |

1. **S1, Medium: the doors between phone and desktop** (decision 5's Home and its measured table; decision 6.3; criterion 10).
   - **The defect.** The spec gives the disc two rules:
     - 40% of the width at 390;
     - the headline's height ÷ 2.267 "at 1024 and 1440".

     It does not say which rule applies from 391 to 1023, or where the 2 × 2 moves beside the headline. Criterion 10's every-corner check runs only at 390, 1024 and 1440. Criteria 7 and 9 run at 768 and 360, but neither checks the words.
   - **Failure** (EXECUTED).
     - If the two-column layout starts at `md` (768), the disc is 109.8 px. "Install, theme, modes" at `text-xs` is 116.5 px, wider than the whole disc.
     - If the phone layout holds to 1023, at 1000 px each disc is 400 px and the 2 × 2 is 907 px tall. The words then pass the doors by a wide margin, against "type is the largest thing in the hero" (decision 6.3).
   - **Fix.**
     - Name the breakpoint: phone layout below `lg` (1024), two columns from `lg`.
     - Cap the phone disc (`min(40%, 240px)`, say) so the 2 × 2 stays at most the headline's width.
     - Run criterion 10's corner check at 360, 390, 768, 1024 and 1440. Add "at every width, the 2 × 2's height is at most twice the headline's height" (or whatever ratio checkpoint 0 rules).

2. **S2, Medium: the five comment lines are a closed list, and the tree has moved** (decision 14's table; decision 26; criteria 29, 30).
   - **The defect.**
     - Decision 14 says "five doc comments cite specifications" and names them. Decision 26 makes `registry-comments.test.ts` require that "in those six [files], the only differences are the five named lines".
     - `013` builds before 015, and its in-progress files already hold citing JSDoc (EXECUTED above): `lib/highlight/roles.ts:1` "(013 decision 7)" and `lib/highlight/languages.ts:1` "(013 decisions 3 to 6)".
     - TypeScript attaches every `/** */` block before a statement to that statement's `jsDoc`. So a header block can reach the API table through the first export.
     - Criterion 29's `/\b0\d\d decision\b/` does not match "013 decisions". The word boundary fails before the "s".
     - `stage-hero.svelte:65` publishes "(K3)", which no pattern catches.
     - The test's base, "the committed `release/0.12.0` tree at `016`", names no ref. The test stays in `tests/unit/` after the tag, so the next release that changes any item fails it.
   - **Failure.**
     - Either the API table publishes `013`'s citations (criterion 29 fails, or passes on the plural).
     - Or the builder rewords them and `registry-comments.test.ts` fails, because they are not among the five.
   - **Fix.**
     - **The list.** Decision 14 states a rule, not a list: at build step 2, on the committed tree, every JSDoc the generator shows is matched against criterion 29's patterns. Each match is reworded. The rewordings are listed in a fixture (`tests/fixtures/reworded-comments.json`: file, line, before, after).
     - **The patterns.** Widen them to `/\b0\d\d decisions?\b/`, `/\(\`?0\d\d\`?\)/` and the identity codes (`/\([A-N]\d+\)/`, `/\bR2\d\b/`).
     - **The test.** `registry-comments.test.ts` reads the fixture. It diffs against a named ref (a lightweight local tag `pre-015`, set by the builder at step 0, or `git merge-base`). It skips, printing why, once `v0.12.0` exists.
     - **The changelog.** Decision 26's changelog lines follow the fixture.

3. **S3, Medium: the search entries `017` adds have nowhere to go** (decision 2; decision 18; criterion 21; ownership table; `017` decision 10).
   - **The defect.**
     - Decision 18 gives `017` "the token entries … at `/foundations/tokens/#<name>`". The index is `src/routes/(site)/search.json/+server.ts`, a 015 file.
     - Criterion 21 asserts "one entry per page, each path once".
     - Decision 2 lists six 015 test files `017` may append to. `search.test.ts` is not among them, and 017 "edits no line 015 wrote".
   - **Failure.** To add the entries, `017` must edit 015's endpoint. To prove them (`017` criterion 3), it must edit or contradict 015's test.
   - **Fix.**
     - 015's endpoint reads its sources from a glob, `src/lib/site/search/*.ts`, each exporting entries. 015 ships `pages.ts`; `017` adds `tokens.ts`.
     - Criterion 21 reads: "the entries without a `#` equal the page list, each once".
     - Add `search.test.ts` to decision 2's list and to the ownership table's append row, as the seventh file.

4. **S4, Low: an example decision 23 should not invite.**
   - **The defect.** "An example of a live block, such as `code-block`'s own 'highlighted as you type', loads the runtime only inside its frame." Inline, an example is in the page, so it would break criterion 25's 0 `.wasm` on `/components/code-block/`, and `013`'s C1 on the same page.
   - **Fix.** Delete the sentence. Say every example on the four budget pages prerenders its `lines`; live highlighting is shown on `use-highlighted-code`'s and `code-editor`'s pages, which carry no budget.

5. **S5, Low: the temporary host outlives its rule** (decisions 20, 21).
   - **The defect.** Adding `design.<domain>` as a custom domain does not switch off `workers.dev`.
   - **Fix.** In the domain change, either keep the host rule (the `workers.dev` copy stays unindexed for good) or set `"workers_dev": false`. Say which in decision 20 and in the `decisions.md` call.

6. **S6, Low: calls made in the owner's absence.**
   - **The defect.** `AGENTS.md`: "Anything waiting on the owner is asked as a question … the recommended one first". The three calls are recorded and open to reversal, but "For the owner" lists only the two hand-off steps.
   - **Fix.** Add a third item: confirm or reverse the three calls (the `noindex` host; the five reworded comments, now a rule per S2; the three colourways). Recommend keeping each.

7. **S7, Low: two edges of the `?theme=` frame** (decision 12).
   - **The defects.**
     - SvelteKit throws if prerendered code reads `url.searchParams`, so the pick must be read only by the raw head script, from `location.search`.
     - Criterion 14 proves the frame holds its theme for six items. Decision 12's no-switch test checks only that each no-switch example is one of three kinds, not the converse.
   - **Fix.**
     - Say that no Svelte code in `(example)` reads `page.url.searchParams`.
     - Add to `examples.test.ts`: every example with a switch has an import graph free of `#lib/registry/ui/theme` (directly, or through `app-shell`'s parts).

### Constitution checks, revised

- **§2.3:** met. The `?theme=` frame now holds its theme by construction (no `Theme` instance), and criterion 14 tests the three ways it could revert.
- **§4.1:** unchanged and consistent.
- **§4.3:** held. `site.css` is layered and there are no `<style>` blocks. The two door ratios are unitless and live in `doors.ts`.
- **§4.4:** held, with S1's widths to cover.
- **§4.5, §4.6:** unchanged. No package added.
- **§6 never break an installed app silently:** held. Comment-only rewording ships with changelog lines and a test, once S2 makes the list follow the tree.

### Verdict, second review

Does not land yet: S1, S2 and S3 (Medium) stand. Each is a text fix: a breakpoint and two more widths; a rule and fixture in place of a closed list; a search extension point and one more file in the boundary list. The six Highs of the first review are resolved, and the measured budgets hold.

## Third review

- **Date:** 2026-11-15
- **Reviewed:**
  - the specification as revised again (1,276 lines), with its "Second review" dispositions;
  - the coordinator's note on the `pre-015` tag.
- **Re-ran** (nothing in the repository written but the two review files; scratch in `…/scratchpad/review-015/`):
  - **Decision 14's five citation patterns, as written, over every file's decoded `content` in `static/r/styles/maia/*.json`** (EXECUTED, `cite.ts`):

    | Pattern | Hits | In comments | In code |
    |---|---|---|---|
    | the number before "decision" or "criterion" | 23 | 23 | 0 |
    | a three-digit number in brackets | 2 | 1 | 1: `await sleep(700);` in the `chat` block's `+page.svelte` |
    | a code in brackets | 3 | 3 | 0 |
    | a bare R or L rule | 1 | 1 | 0 |
    | "spec" before a number | 0 | 0 | 0 |

    - No hex colour, version string or line number matched.
    - **Two citations are missed:**
      - `marketing-bar` line 42–43, "(012" ⏎ "// decision 4)": the citation is split across two comment lines, and every pattern runs one line at a time;
      - `marketing-bar` line 57, "(the 010 build's checkpoint 1)": no pattern names "build" or "checkpoint".
    - **The JSON layout:** the registry JSON has 6,290 physical lines, and each item file's whole `content` is **one** of them. 11 physical lines carry a hit.
  - **JSON escaping** (EXECUTED, grep): `marketing-bar.json` holds the line as `it renders here for \"header\" (008 decision 2's shape)`. The source has `"header"`.
  - **The same patterns over pages** (EXECUTED):
    - over `CHANGELOG.md`, the bare R/L pattern hits 3 lines ("L1 to L21", "L15", "L19");
    - over today's built item pages' text, the bracketed-number pattern hits `chat`'s shown code, `(700)`.
  - **SvelteKit 3.1.0 and `$lib`** (READ, `node_modules/@sveltejs/kit`):
    - `src/exports/vite/index.js:76–80` lists `$lib` among `removed_modules`, with the error `module_removed_lib`;
    - `src/messages/build-errors.js:521–527`: "`$lib` has been removed. Use `#lib` instead … To keep using `$lib`, add `alias: { '$lib': 'src/lib' }`".
  - **What `init` writes** (READ, the locked CLI's `init`, `node_modules/shadcn-svelte/dist/index.mjs`). The lib alias defaults to `libAliasDefault ?? "$lib"`, and `libAliasDefault` is `#lib` whenever `package.json` has `imports["#lib/*"]` (function `Ls`). The smoke fixture `kit3` (SvelteKit 3) has that `imports` field and `#lib` aliases. `kit2` (SvelteKit 2) uses `$lib`.
  - **Unit tests and `build/`** (READ):
    - `package.json`'s `test` runs `test:unit`, then `test:e2e`, whose Playwright `webServer` runs `bun run build`, then `test:smoke`;
    - no unit test today builds the site; `registry.test.ts` and `deps.test.ts` build only the registry, into a temp folder;
    - `build/` is git-ignored, so it is absent on a clean clone when the unit suite starts.
  - **The door cap:** decision 5's rules re-derived. Below 1024 the disc is `min(40%, 160 px)`: 144 px at 360, 160 px from 400 to 1023. From 1024 it is the headline's height ÷ 2.267: 146 px at 1024, 183 px at 1280. The 12 px line is 116.5 px wide (EXECUTED, second review), so it fits every disc from 144 px. The disc shrinks from 160 to 146 px across 1024, a visible step but not a fault. Criterion 10 now checks the cap from 360 to 1023, and corners at six widths.

### The second review's findings, against the revised text

| # | Now | Where |
|---|---|---|
| S1 | **Resolved.** The breakpoint, the cap and six widths are in criterion 10 | decision 5; criterion 10 |
| S2 | **Resolved as a rule; four faults in the new mechanism** (T2, T3, T4, T6) | decisions 14, 26; criteria 29, 30 |
| S3 | **Resolved in design; the unit test cannot run as specified on a clean clone** (T5) | decision 18; criterion 21; decision 2 |
| S4 | **Resolved** | decision 23 |
| S5 | **Resolved.** The rule stays after the domain is set, and the owner is asked | decision 20; For the owner 3 |
| S6 | **Resolved.** Three questions, each with the taken option first | For the owner 3–5 |
| S7 | **Resolved.** The raw head script reads the query; a test bars `searchParams` in `(example)`; the converse import-graph check is in | decision 12; criterion 13 |

### Third-review findings

| # | Severity | Finding | Where |
|---|---|---|---|
| T1 | Medium | The site shows `$lib` imports, an alias SvelteKit 3.1.0 has removed. A reader on the repository's own SvelteKit pastes code that fails to build. *Missed by the first two reviews.* | decisions 13, 15; `017` decision 13 |
| T2 | Medium | The base `pre-015` is a second local tag, against the owner's one-tag ruling. Local tags are not in a clean clone, so criterion 30 fails there. The skip depends on a tag a clone may also lack | decisions 14, 26; criterion 30; Build order step 1 |
| T3 | Medium | The byte check applies source-line rewordings to JSON bytes, where quotes are escaped. Each file's content is one JSON line, so a line-level `kept` skips the whole file | decision 26; decision 14 (`kept`) |
| T4 | Medium | Criterion 29 runs decision 14's patterns over every page. It fails the changelog page, which must reproduce "L15", "L19" and "L1 to L21" (criterion 22), and the `chat` page's shown `sleep(700)`, with no exemption | criteria 22, 29 |
| T5 | Medium | Six unit tests read `build/`, which does not exist when the unit suite starts on a clean clone. And `search.test.ts` cannot import an endpoint that uses `import.meta.glob` under `bun test`. *Missed by the first two reviews.* | criteria 2, 19, 20, 21, 24, 30; `017` criteria 5, 10 |
| T6 | Low | The patterns miss a citation split across two comment lines, and "(the 010 build's checkpoint 1)" | decision 14 |

1. **T1, Medium: `$lib` on a SvelteKit 3 site** (decision 13's `shownSource` map; decision 15's alias map).
   - **The defect.**
     - Every shown source rewrites `#lib/registry/ui/` to `$lib/components/ui/` and so on, "the paths an app made by `shadcn-svelte init` uses".
     - The repository pins SvelteKit 3.1.0, which throws `module_removed_lib` on any `$lib` import unless the app adds an alias (READ above).
     - The locked CLI's `init` writes `#lib` aliases when `package.json` has `imports["#lib/*"]` (READ, `Ls`). That is the subpath-import setup SvelteKit 3 directs apps to, and the one the `kit3` smoke fixture models.
   - **Failure.** A reader on SvelteKit 3 copies an example's imports and the build fails with "`$lib` has been removed". The registry install itself still works, because the CLI rewrites imports from the app's own `components.json`. So the site, not the registry, is wrong.
   - **Fix.**
     - Map to `#lib/components/ui/`, `#lib/components/`, `#lib/hooks/`, `#lib/` and `#lib/utils`: what `init` writes in a SvelteKit 3 app.
     - Add one line under every shown source: "In a SvelteKit 2 app, read `$lib` for `#lib`."
     - `files-you-own.test.ts` and criterion 17 are unaffected, because the physical paths under `src/lib/` are the same.

2. **T2, Medium: the base of the byte check** (decisions 14, 26; criterion 30; Build order step 1).
   - **The defect.**
     - The builder sets a lightweight local tag `pre-015` on `016`'s commit, and `registry-comments.test.ts` reads `git show pre-015:…`. The owner ruled one local tag, `v0.12.0`.
     - A local tag is in no clone. `git push` does not send tags by default, and nothing is pushed until the owner asks. So criterion 30's "on a clean clone, `bun run test` exits 0" fails at the `git show`.
     - The check "skips once `v0.12.0` exists", but that tag is local too. A clone that lacks it runs the check forever, and fails at the next release that changes an item.
   - **Fix** (the coordinator's lean, which I endorse; no reason for a tag was found):
     - Record the base as a full commit hash in the fixture: `reworded-comments.json` gets `"base": "<sha of 016's commit>"`.
     - The test runs `git show <base>:…`. If the commit is absent (a shallow clone), it skips and prints why.
     - Make the second check's skip depend on `package.json`'s version: it runs only while the version is `0.12.0`.
     - Drop `pre-015` from decisions 14 and 26, criterion 30 and Build order step 1.

3. **T3, Medium: the byte check meets JSON escaping** (decision 26; decision 14's `kept`).
   - **The defect.**
     - The fixture records source lines (file, line, before, after). The check "applies each of the fixture's before-to-after rewordings" to the files under `static/r/` and expects byte equality. But those files are JSON: `"header"` in `marketing-bar.svelte:24` is `\"header\"` in `marketing-bar.json` (EXECUTED).
     - Each item file's whole `content` is a single physical JSON line (6,290 lines in all, EXECUTED). So "0 lines in any file under `static/r/` match", and `kept`'s "skips exactly those lines", act on whole files, not lines.
   - **Failure.**
     - The `marketing-bar` rewording finds no match in the raw JSON, so the byte check fails on a correct build.
     - Keeping `chat`'s `sleep(700)` as a line would exempt the whole `+page.svelte` content.
   - **Fix.** Both checks parse each JSON file and work on `files[].content` split into lines.
     - **The rule:** 0 content lines match, except each `kept` entry (item, path, line text).
     - **Nothing else moved:** at the base commit, parse the file, apply each rewording to the matching content line, re-serialise with the CLI's own format (`JSON.stringify(…, null, "\t")` plus the trailing newline, as `build-registry.ts`'s output shows). Or compare the parsed objects deep-equal, and every non-`content` field unchanged.
     - Allow a fixture entry's `before` and `after` to span lines, for T6's split citation.

4. **T4, Medium: the public check rejects the changelog and real code** (criteria 22, 29).
   - **The defect.** Criterion 29 now bans "any citation pattern of decision 14" in "the text of every built page, every twin and every API row". But:
     - `CHANGELOG.md` names lint rules "L1 to L21", "L15" and "L19" (EXECUTED, 3 lines). Criterion 22 requires the changelog page's text to equal the file's.
     - The `chat` block's page shows its source, which holds `sleep(700)` (EXECUTED on today's build).
     - Decision 14's `kept` list exempts item files, not pages.
   - **Failure.** Criteria 22 and 29 cannot both pass. The `chat` page fails criterion 29 on code.
   - **Fix.**
     - Criterion 29 reads the text outside `<pre>` and `<code>`.
     - Bare `R`/`L` codes are banned only in item comments (decision 14), not on pages.
     - Or exempt `/changelog/` from that one pattern, and state that lint rule names in the changelog are public facts of `scripts/lint-literals.ts`.

5. **T5, Medium: unit tests that need a build** (criteria 2, 19, 20, 21, 24, 30; `017` criteria 5, 10).
   - **The defect.** These unit tests read `build/`:
     - `sitemap.test.ts` ("every entry has a built page");
     - `markdown.test.ts` ("after `bun run build`");
     - `search.test.ts` ("every anchor resolves on its built page", the gzipped size);
     - `headers.test.ts` ("`build/_headers` equals it");
     - `017`'s `brand-assets.test.ts` ("in `build/brand/downloads/`") and `tokens-pages.test.ts`.

     `bun run test` runs the unit suite first, and only the e2e `webServer` builds. `build/` is git-ignored. Separately, decision 18's endpoint uses `import.meta.glob`, which does not run under `bun test` (`013` says so of its grammars, in "Why one item, not 19"). So "the index is built from every module in `search/sources/`" cannot be checked by importing the endpoint.
   - **Failure.** On a clean clone the unit suite fails before any build exists, and criterion 30 fails. On a working copy, the tests read whatever stale `build/` is lying there.
   - **Fix.** Pick one and say it in decision 24:
     - **(a) Recommended:** `test` becomes `bun run build && bun run test:unit && bun run test:e2e && bun run test:smoke`, and Playwright's `webServer.command` serves the existing `build/` (`vite preview` alone). One build, read by every suite.
     - (b) Move the build-reading checks into Playwright files that open no page, so they run after the `webServer` build.

     Either way, `search.test.ts` reads `build/search.json`, and finds the source modules with `Bun.Glob` over `src/lib/site/search/sources/`.

6. **T6, Low: two citations the patterns miss** (decision 14).
   - **The defect.** `marketing-bar.svelte:42–43` splits "(012 decision 4)" across two `//` lines. `marketing-bar.svelte:57` says "(the 010 build's checkpoint 1)".
   - **Fix.**
     - Run the patterns over each comment block with line breaks and comment markers collapsed to spaces.
     - Widen the first pattern's tail to `decisions?|criteri(?:on|a)|build|checkpoint|review`.
     - `citations.ts` prints both of today's misses on the current tree; the fixture records them.

### Constitution checks, third review

- **§4.1, §4.3, §4.5, §4.6:** unchanged and held.
- **§4.4:** held; S1's widths are now tested.
- **§6 never break an installed app silently:** held. Comment rewording is listed per item, from the fixture, and checked.
- **The owner's rulings:** the one-tag ruling is not yet honoured (T2). Every other ruling is.

### Verdict, third review

Does not land yet: T1 to T5 (Medium) stand.

- **T2, T3, T4 and T6** are corrections to the comment mechanism's test.
- **T1** is a one-line map change with a reader's note.
- **T5** is one test-script decision.

Every first- and second-review finding is resolved in the decisions and criteria.

## Fourth review

- **Date:** 2026-11-15
- **Reviewed:** the specification as revised again (1,300 lines), with its "Third review" dispositions.
- **Re-ran** (nothing in the repository written but the two review files):
  - **Playwright 1.64.1's runner** (READ, `node_modules/playwright/lib/runner/index.js`):
    - `runAllTestsWithConfig` pushes the `webServer` plugins into `config.plugins` (line 7130);
    - `createGlobalSetupTasks` runs `createPluginSetupTasks` (the `webServer` start) before the global setups and before `createRunTestsTasks` (lines 6509–6523).

    So the server's command, `bun run build && … vite preview`, finishes before any test runs, whether or not a test opens a page. Under `--list` the setup tasks are not run, which does not matter here.
  - **The widened citation patterns** (EXECUTED, decoded `files[].content` of every `static/r/styles/maia/*.json`, line by line and over comment blocks joined into one line):
    - 24 line hits and 26 block hits;
    - **one** hit is code and outside every comment block: `chat`'s `await sleep(700);`, which the fixture's `kept` names;
    - no hex colour, version string, line number or other identifier matched;
    - the split "(012 … decision 4)" and "(the 010 build's checkpoint 1)" are now caught.
  - **Comment markers inside strings,** which a regex block-finder would misread as a comment (EXECUTED): 0 lines today.
  - **`kit2`** (READ): `tests/smoke/fixtures/kit2/` is committed, with its own `bun.lock`. `registry-add.test.ts:80–100` already copies it to scratch, runs `bun install --frozen-lockfile` and `svelte-kit sync`, and `add`s into it.

### The third review's findings, against the revised text

| # | Now | Where it is resolved |
|---|---|---|
| T1 | **Resolved.** `#lib` map; "In a SvelteKit 2 app, read `$lib` for `#lib`" under every shown source; physical paths unchanged | decisions 13, 15; criterion 13 |
| T2 | **Resolved.** No tag; the full hash of `016`'s commit is the fixture's `base`; version-scoped; `release-check.ts` holds the placeholder check outside the suite | decisions 4, 14, 26; criteria 30, 31; Build order step 1 |
| T3 | **Resolved.** Parsed JSON, decoded content lines, `kept` by item, path and line text, deep-equal after rewording, multi-line entries | decision 26 |
| T4 | **Resolved.** Criterion 29 reads `<main>`, twins, API rows and file lists with every `<pre>` and code block removed, and `/changelog/` exempt | criterion 29 |
| T5 | **Resolved.** Every `build/` check is in `build-output.spec.ts`, after the `webServer` build (confirmed above). Unit tests call `buildIndex` and `shownSource` from source | decision 24; criteria 2, 3, 19–21, 24, 29 |
| T6 | **Resolved** (EXECUTED above) | decision 14 |

### The new pieces

- **`build-output.spec.ts` after the build:** sound. The `webServer` plugin's setup precedes every test (READ above). Restricting the file to the `light` project is right, but the mechanism is not named (V3).
- **The pure-function wrappers:** sound.
  - `buildIndex(sources)` and `shownSource(text)` take plain input, so `bun test` can call them.
  - One condition is implied but not written: the modules in `search/sources/` must themselves be importable by Bun, with no `$app/*`, no `?raw` and no glob, or the unit test that imports them fails (V4).
- **The `git show <base>` skip:** sound for a shallow clone. But "skips if the base commit is absent" also silences a mistyped or rebased hash in a full clone (V1).
- **`scripts/site/release-check.ts`:** sound. It keeps the owner's pending answer out of `bun run test`, and criterion 31 runs it before the tag.
- **The `<main>` text with code removed:** sound. Removing `<pre>` and `[data-slot="code-block"]` drops shown sources and commands. Inline `<code>` stays in, which is right for prose. The changelog exemption is wider than its reason (V2).

### Fourth-review findings (all Low, with fix text to write in)

1. **V1, Low: an absent base should fail in a full clone** (decision 26).
   - **The defect.** A wrong hash, an abbreviated one, or a rebase of `release/0.12.0` would make the release-scoped check skip forever, and the test would still pass.
   - **Fix.** Skip only when `git rev-parse --is-shallow-repository` prints `true`; otherwise an absent `base` fails, naming the hash. Criterion 30's landing note records "ran" or "skipped, and why".

2. **V2, Low: narrow the changelog's exemption** (criterion 29).
   - **The defect.** The exemption exists because `CHANGELOG.md` names lint rules. Exempting the whole page would also let "(013 decision 7)" through, if it is ever written into the changelog.
   - **Fix.** On `/changelog/` and its twin, skip only the bare R/L pattern, and read the rest.

3. **V3, Low: name how `build-output.spec.ts` stays in one project** (decision 24).
   - **Fix.** One sentence, matching however `perf.spec.ts` does it: `testIgnore: /build-output|perf/` on the `dark` project in `playwright.config.ts`, or `test.skip(testInfo.project.name !== "light")` at the file's top.

4. **V4, Low: the search sources must load under Bun** (decisions 18, 24).
   - **Fix.** Write in: "A module in `search/sources/` imports no `$app/*`, uses no `?raw` and no `import.meta.glob`, so `search.test.ts` can import it." Also say that `citations.ts` finds comment blocks with a tokenizer (TypeScript's scanner, and Svelte's `parse` for markup comments), not a regular expression, so a `/*` inside a string is never read as a comment (none today, EXECUTED).

### Verdict, fourth review

Fit to build, with V1 to V4 taken as write-ins. Every High and Medium from the four reviews is resolved in the decisions and criteria.
