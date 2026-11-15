# Review of 015 — The design site (the built change)

Reviews [`specifications/015-the-design-site.md`](../specifications/015-the-design-site.md). This reviewer wrote neither the specification nor the code, and did not review the specification ([`015-the-design-site-spec-2026-11-14.md`](./015-the-design-site-spec-2026-11-14.md) is another reviewer's).

- **Date:** 2026-11-15
- **Status:** in review; does not land yet. Two Medium findings block (017's hooks), one Medium is for a fix or a ruling, and ten Low are write-ins.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `c8185c9` (`016`, branch `release/0.12.0`), uncommitted.
  - The tracked diff: 237 files, +1,121 −23,676. It removes `(identity)`, `src/lib/identity/`, every `/items/` page and the preview furniture. It rewords 18 registry source files (comments only), with their 12 `static/r/` and 12 `static/v0.12.0/` files. It migrates 21 test files, and changes `package.json`, `bun.lock`, `playwright.config.ts`, `vite.config.ts`, `wrangler.jsonc`, `.prettierignore`, `CHANGELOG.md` and `decisions.md`.
  - The untracked files: 375, about 21,300 lines. They are `src/lib/site/` (the chrome, the four templates, 157 example files, the generators), the `(site)` landings, components, changelog, 404 and endpoints, `(example)`, `scripts/site/`, `static/_headers`, 10 new test files and their fixtures, and the 015 specification with its specification review.
  - Read as rulings, not reviewed: `decisions.md`'s 015 entries (checkpoints 0, 1 and 2, "The Button page's transfer budget is 365 kB", "The design site's review calls…", "Commits per specification, and the site's worker name"). Not 015's: the `017` specification and review, and the design-site research.
- **Re-ran:** Bun 1.4.4, 2026-11-15. Nothing in the repository was written but this file. Scratch work is in `…/scratchpad/review-015/`. My own servers used port 5320; Playwright's `webServer` used its configured 4173.
  - `bun test tests/unit` → **1,112 pass, 0 fail**, 9,165 `expect()` calls, 29 files. `examples: 157 files for 58 items`.
  - `bun run check` → `COMPLETED 1992 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → "All matched files use Prettier code style!".
  - `bun scripts/lint-literals.ts` → "0 literal(s) in registry item files; 1 allowance(s)" (L24).
  - `bun scripts/site/citations.ts` → 1 match, `chat`'s `await sleep(700);`, the fixture's one `kept` line.
  - `bun run test:e2e`, all three projects → exit 0: **2,355 passed, 4 skipped, 0 failed**, 7.5 m. It includes `axe` 714, `keyboard` 246, `theme` 244, `doors` 60, `site` 32, `frames` 20, `build-output` 17, `search` 12 and `perf` 4.
  - `bun run test:smoke` → exit 0: **126 pass, 0 fail**, 6,731 `expect()` calls, 8 files, 156 s.
  - `bun install --frozen-lockfile --dry-run` → exit 0. `bun scripts/site/release-check.ts` → exit 1, naming the `<account>` placeholder, as designed.
  - **Idempotence:** `git diff --stat`, `git status --porcelain` and the SHA-1 of every file under `static/r` and `static/v0.12.0` were the same before the e2e build and after it and smoke.
  - One run of mine is void: I ran `registry-comments.test.ts` while smoke was rebuilding `static/r/`, and it failed on a missing file. Re-run alone, after smoke: 7 pass, 0 fail. It ran, not skipped (`git rev-parse --is-shallow-repository` prints `false`).
  - **My own probes**, with Playwright on a `Bun.serve` of `build/` that answers unknown paths with `404.html` and status 404: the frame's theme under a stored choice, a system flip and a storage event; the scripts an example view loads, and its weight; the 404 at six depths in both themes; the landmarks and headings of six pages at 1440 and 390; Control-K, repeated.
  - **My own scripts** over `static/r/` against the base, and over every text file in `build/` outside `r/`, `v*/` and `_app/`.

## Acceptance criteria against evidence

1. **Install and checks** — met. EXECUTED: the frozen install, `check`, `lint` and the literal lint (above). `deps.test.ts` passes. The six exhibit packages are in 0 of `package.json`, `bun.lock` and `node_modules`. `bun.lock`'s diff is 18 deletions, those six only.
2. **One list of pages** — met. EXECUTED: `sitemap.test.ts` (81 tagged `"015"`, 0 duplicates); `build-output.spec.ts`, both directions.
3. **The URLs** — met. EXECUTED: 75 of 75 `build/components/<name>/index.html`; no `items/`, `identity/`, `workbench/` or `_redirects` in `build/`. The two source folders are gone. `previews.test.ts` passes.
4. **No old address** — met. EXECUTED: my grep finds 0 `/items/` in `src/`, `tests/`, `scripts/`, `registry.json` and the configs, and 0 in `build/` outside the old snapshots.
5. **The name** — met. EXECUTED: `four-dot.spec.ts` and `site.spec.ts`, both projects.
6. **One theme script** — met. EXECUTED: `theme.spec.ts`, both projects. My probe: an example view holds 0 scripts that name the storage key. Its 174 chunks hold no `storage` listener. The three that contain the string "pluto-theme" hold it as a route or a link, not the store.
7. **axe** — met. EXECUTED: 486 page scans (81 × 3 widths × 2 projects), the five example views at 1280 in both, and every view. 0 violations.
8. **Keyboard** — met. EXECUTED: `keyboard.spec.ts`, 123 tests per project. `HOME_STOPS`, `COMPONENTS_STOPS` and `FOOTER_STOPS` are built from `SITEMAP`, not literals.
9. **No sideways scroll** — met. EXECUTED: `site.spec.ts` at 360 and 390, both projects.
10. **The doors** — met. EXECUTED: `doors.spec.ts`, both projects.
11. **The red door** — met for 015's 81 pages. EXECUTED: `doors.spec.ts`. But the check reads every page in the list, which 017 will break (finding 1).
12. **The landings and the mark** — met. EXECUTED: `doors.spec.ts`. READ: the Brand band's lockup is `tone="mono"`, `aria-hidden`, beside an `sr-only` "Brand".
13. **Examples are files** — met.
    - EXECUTED: `examples.test.ts` (157 files for 58 items; 10 fixtures in `tests/fixtures/shown-source/`). `site.spec.ts` passes: 58 framed pages, 17 viewers, 14 sentences, 0 "amber".
    - My grep of the 75 component twins: 0 `$lib` outside the SvelteKit 2 line, and 0 `#lib/registry/`. On every page, the count of `svelte` fences equals the count of SvelteKit 2 lines. READ: `frame.svelte` prints the line under every shown source.
14. **Either theme, in a frame** — met. EXECUTED: `frames.spec.ts`, both projects. My probe went further, on `/components/dialog/` in both projects:
    - with the page's choice stored, I picked the other theme;
    - I flipped the system both ways (the page held its stored choice);
    - I dispatched a `storage` event in the frame.

    After each, the frame's `<html>` and its `main` kept the pick (`dark` / `rgb(22, 20, 15)`, and `""` / `rgb(243, 240, 232)`), with 1 iframe and 0 page errors.
15. **API** — met. EXECUTED: `api.test.ts`; `site.spec.ts` (75 API sections).
16. **Files you own** — met. EXECUTED: `files-you-own.test.ts`.
17. **The paths are true** — met. EXECUTED: `site-add.test.ts`, in smoke.
18. **Install from the site, then offline** — met. EXECUTED: `site-add.test.ts`; `viewer.spec.ts`.
19. **Markdown twins** — met. EXECUTED: `markdown.test.ts` (12 pairs, 24 fixture files) and the five `build-output.spec.ts` checks. Three Low points on what a twin reads like (findings 7, 8 and 9).
20. **`llms.txt`** — met. EXECUTED: `build-output.spec.ts`. READ: an H1, a blockquote with the install command, 4 door sections, "Registry" and "Optional", and 81 twin links.
21. **Search** — met. EXECUTED: `search.test.ts`, `build-output.spec.ts` and `search.spec.ts`. `build/search.json`: 81 entries, 81 distinct paths, 0 anchors, 4.6 kB gzipped. One Low (finding 10).
22. **The changelog page** — met. EXECUTED: `changelog-page.test.ts`.
23. **The 404, at any depth** — met.
    - EXECUTED: `site.spec.ts` and `build-output.spec.ts`.
    - My probe, in both themes, at `/nope/`, `/components/nope/`, `/a/b/c/`, `/nope/deep/`, `/components/button/x/y/` and `/foo.html`. Each answered 404 and painted the theme's canvas (graphite under a dark system). Each showed 1 bar, 1 footer and, after hydration, the search buttons. No sub-request failed, and no console error was logged.
    - READ: `build/404.html` loads `/_app/` only, holds the five section links, no field, and `noindex`.
24. **Worker, headers and crawlers** — met.
    - READ: `wrangler.jsonc` names `pluto-systems-design`, `./build`, `auto-trailing-slash` and `404-page`. `vite.config.ts` sets `paths.relative: false`.
    - EXECUTED: `headers.test.ts`. `build/_headers` equals `static/_headers`: 5 rules, the `workers.dev` host rule last.
    - READ: `robots.txt` allows all and names the sitemap. `sitemap.xml` lists 81 `<loc>`s, none under `/view/` or `/example/`.
25. **Budgets** — met, as ruled. EXECUTED: `perf.spec.ts`, 3 runs each, medians:
    - `/`: 298 kB, LCP 856 ms, CLS 0.005, against 355, 1,027 and 0.02;
    - `/components/`: 311 kB, 952 ms, 0.001, against 320, 1,138 and 0.02;
    - `/components/button/`: 361 kB, 912 ms, 0, against 365 as ruled, 1,157 and 0.02;
    - `/components/code-block/`: 335 kB, 916 ms, 0.002, against 360, 1,186 and 0.02.

    Each page made 0 `.wasm` requests. These are the builder's figures to the kilobyte.
26. **Overflow regions** — met. EXECUTED: `site.spec.ts`.
27. **Reduced motion and the door transition** — met. EXECUTED: `doors.spec.ts`. The transition was kept at checkpoint 1, so both sentences stand.
28. **Tokens are the one source** — met. EXECUTED: `site-literals.test.ts`. READ: no site component has a `<style>` block, and `doors.ts`'s three constants are unitless.
29. **Public** — met.
    - EXECUTED: `build-output.spec.ts`.
    - My wider scan read every HTML page's text and its `title`, `aria-label`, `alt` and `content` attributes: the 81 pages, every `/view/` and `/example/` page, and the 404. It also read the 81 twins, `llms.txt`, `robots.txt`, `sitemap.xml`, `search.json` and the 234 `__data.json` files. It found 0 matches of the criterion's words, its patterns and the one git author. The changelog is held to its two exemptions. The only hit is `chat`'s kept `sleep(700)` in its page data, which is code.
    - One Low (finding 11): the changelog says "the owner's palette".
30. **Suites, documents, checkpoints and walk** — met.
    - EXECUTED: the three suites pass. `registry-comments.test.ts` ran, and passed both checks against `c8185c9db96c17f9064fc0085357da14af7fc12c`.
    - READ: the 0.12.0 entry names exactly the fixture's 12 items, and the test checks it. The paragraph is present (finding 12). The landing notes record the checkpoints, the example count, the budgets and the walk: 324 loads, 81 × 2 themes × 2 widths.
31. **Released** — not yet, as expected. It waits on this review, the commit and the tag. The release check exits 1 until `<account>` is filled.

## The points asked

- **Public check (criterion 29):** clean (above). Outside 015's scope, but public: the `product-home` block's sample command, `pip install git+https://github.com/ClayGendron/vfs`, is shown in that page's code. It is a real repository's address, held in code since `010`, so it is not a citation. Recorded, not a finding.
- **The citation rewording:** confirmed by my own script.
  - I parsed each of the 76 `static/r/**/*.json` files at the base and now, applied the fixture's 37 rewordings to the base's decoded `content`, and deep-compared. Result: 0 differences, 0 files added or removed. 12 files changed raw, and each rewording applied exactly once.
  - READ: the 18 source files' diff is comment lines only, 42 + / 43 −.
  - The 37th entry, the correction, is true: `code-editor-theme.ts` reads `--spacing`, `--text-sm`, `--text-sm--line-height` and `--font-mono`, four names that live only in `@theme inline`.
  - `static/r` equals `static/v0.12.0/r` (`diff -rq`). `static/v0.11.0` has 0 differences from its tag.
  - `query-lock.json` gains one change entry for `php.scm`, with the figures unchanged.
- **The theme switch in the other-theme frame (`?theme=`):** it holds (criterion 14). The `(example)` layout imports no theme module. Its head script reads `location.search` only. No Svelte file in `(example)` reads `searchParams`.
- **The 404:** confirmed at six depths, both themes (criterion 23).
- **Budgets:** confirmed; 0 `.wasm`; Button at 365 kB as ruled. Not budgeted: an example view weighs about twice the Button page (finding 3).
- **Search:** one entry per page. The hook is as decision 18 names it. `search/sources/pages.ts` imports only `sitemap.ts`. `buildIndex` takes page entries, then anchors, and keeps each path once. The endpoint's glob and the unit test's `readdirSync` read the same folder.
- **Twins, `llms.txt`, `sitemap.xml`, `robots.txt`, `_headers`, `wrangler.jsonc`:** as criteria 19, 20 and 24. The host rule `https://pluto-systems-design.:account.workers.dev/*` has its placeholder as a whole host label.
- **Shown code:** `#lib` only, with the SvelteKit 2 line (criterion 13). No example imports `$lib`.
  - Examples that need repository-only modules (`scripts/tokens.ts`, `#lib/preview/code-samples`) reach them through `data.server.ts` or a sibling `.ts` file.
  - So 15 shown sources (`pluto-theme` 11, `code-editor` 3, `code-languages` 1) import a sibling an app does not have: `./data.server`, `./example`, `./samples` or `./surface-code`. That is sample data, and decision 13 allows it. Recorded, not a finding.
- **Accessibility:** axe and the walks pass in both themes. The landmarks and headings, read at 1440 and 390:
  - Every page has one banner (the lockup alone, as ruled), a "Site" navigation, one `main` (`#main`, the skip link's target) and one contentinfo, with five named footer navigations.
  - A component page reads: `h1` the title; a breadcrumb navigation named "Where this page is"; a named install region; `h2` Examples, Usage, API, Accessibility, Files you own and Related, with `h3`s for each example, "Do" and "Don't", "It brings" and "Brought by"; then, from `lg`, the rail as a complementary landmark named "On this page".
  - The home page reads `h1` "Build with Pluto.", `h2` "What one command gives you" with three `h3`s, then four `h2` section indexes.
  - The changelog has one `h2` per release. The 404 has one `h1` and a "Sections" navigation.
  - Example views carry hidden `h1` to `h3`, so an example's own headings start at `h4`, as on its page. The outline makes sense.
- **Removed pieces:** `/identity/` is gone from `src/`, `scripts/`, the configs, `app.css` and the build. Its one trace is a dead exclusion in a test (finding 13). The `/items/` move is complete (criterion 4). The six packages are gone.
- **Prose:** I read the usage, do and don't, and accessibility prose of all 75 pages, extracted to one file (2,394 lines).
  - **R24:** 0 arrows, 0 middle-dot strings, 0 all-caps words (the only capitals are code constants such as `LINKS` and `MESSAGES`), and no eyebrows.
  - **R23:** the names are active ("Copy code" becomes "Copied"). Errors direct ("Clear the filter to see all 75.").
  - **Voice (decision 17):** short sentences, about the work, sentence case. Two spellings of quotes are mixed (“Show as table” beside "Copy code"); that is cosmetic.
  - **Claims checked against item source,** 24 in all, 0 untrue:
    - button: 48 and 32 px; busy;
    - toggle: 48 and 32 px;
    - cta-band and stage-hero: actions 52 px (`--size-action` 3.25rem);
    - proof-band and live-console: 700 ms (`--motion-fill`);
    - code-block's copy button: 32 px, two seconds, "Copied" and "Could not copy";
    - code-block: fourteen `--code-*` text roles;
    - alert-dialog: focus on Cancel;
    - separator: `role="none"`;
    - the lockup's default name, "Pluto Systems";
    - liquid-glass: a 16 px blur;
    - input-otp: a static caret;
    - table: a primary start edge;
    - product-home: fields 1, 3 and 4;
    - message-log: `scroll-pb-24`;
    - accordion: heading level 3;
    - app-shell: a 64 px row, "Skip to main content";
    - marketing-bar: "Skip to content";
    - input: 48 px;
    - hero: both calls to action at 48 px;
    - code-editor: four `@theme inline` names;
    - four-dot: paper in dark, on product screens only (the checkpoint 2 fix).

    The one sentence I found untrue is the template's, on every page (finding 6).
  - Several "when" texts run past decision 10's "two or three sentences" (`pluto-theme`, `app-shell`, `chart`, `dialog`, `dropdown-menu`). That is the accepted deviation that moved prose-only sections into Usage. Recorded, not a finding.
- **The changelog's 0.12.0 entry:** the paragraph and the 12 items' lines are present. Two wording points (findings 4 and 12).
- **017's hooks:**
  - These exist as 015 names them: the nine test files, `search/sources/` with `pages.ts`, the leaf and Brand templates, and `sitemap.ts`, whose `spec` type admits `"017"`.
  - The counts that 017 inherits read `SITEMAP`, filtered by `spec` where they are 015's: `sitemap.test.ts`, `search.test.ts`, `HOME_STOPS` and `FOOTER_STOPS`. So do the twin, `llms.txt`, sitemap, search and public checks.
  - `perf.spec.ts` keeps `measure` and `BUDGETS` in module scope, so an appended `describe` can use them.
  - Two of the nine files cannot take 017's additions without an edit to a line 015 wrote (findings 1 and 2).

## Findings, most severe first

1. **Medium. The red-door check reads every page, so 017's Colour page will fail it** (`tests/e2e/doors.spec.ts:211` and `:235`).
   - `for (const p of PAGES.filter((p) => p !== "/"))` reads `PAGES`, which is `SITEMAP.map(…)` (`tests/e2e/pages.ts:218`). It then asserts `expect(red).toEqual(["/components/"])`.
   - 017's `/brand/colour/` is "four full-bleed fields, one per colour" (017 decision 5). 015's own decision 6.2 says the same. Its red band carries `field-2`. Once 017 appends its 21 entries, this test fails, and 017 "edits no line that 015 wrote".
   - Decision 24 already gives the rule: "filtered by `spec` where a test is 015's alone".
   - The same loop at `:55` ("round elements carrying a field appear on 1 page") also reads every page. It holds only if no 017 page draws a round element with a field class. That is likely, but nothing in 015 checks it.

   Fix: iterate `SITEMAP.filter((p) => p.spec === "015" && p.path !== "/")` at `:211`. Do the same at `:55`, or say in 015's landing notes that 017's pages join that check on purpose.
2. **Medium. The package check names an exact set, so 017's two packages will fail it** (`tests/unit/deps.test.ts:108–113`).
   - "name exactly the 54 packages" asserts `PACKAGES` has length 54. It also asserts that `Object.keys(pkg.devDependencies)` equals `PACKAGES` exactly.
   - 017 adds `fontkit` and `wawoff2` to `devDependencies` and "appends a `describe` for the two packages" (017 decision 9, criterion 1). An appended block cannot make an exact-set test pass. Pushing to `PACKAGES` at collection time breaks the length check instead.
   - 015 rewrote these lines (60 → 54), so they are 015's.

   Fix: make the set check open to later blocks, in this release. For example, export a `LATER: string[]` that a later `describe` pushes into before the tests run. Or let the check assert that every devDependency is pinned by some block's list. Keep the "0 of the six" check as it is.
3. **Medium. An example view loads every example on the site: about 690 kB gzipped to show one** (`src/lib/site/examples.ts:15–18`, `import.meta.glob(…, { eager: true })`).
   - EXECUTED on my server: `/example/button/variants/?theme=dark` made 186 requests, 2,027 kB raw, about 688 kB gzipped. `/components/button/` itself is 75 requests and about 352 kB.
   - So the first switch to the other theme fetches about twice the page it sits in. Meanwhile the frame is held invisible until `data-view-ready` (`frame.svelte`).
   - Under decision 23's profile (1.6 Mbps), that is several seconds of an empty frame. No criterion covers it: the budgets exclude iframes, and the landing notes describe the glob without its cost.
   - The pages themselves are fine; each imports only its own examples.

   Fix: a lazy glob (`eager: false`) awaited in the example route's `load` or the page, so a view loads one example. Or rule the cost acceptable in `decisions.md`.
4. **Low. Two bullets say "interface change" and then "no interface change"** (`CHANGELOG.md:13`, `:14`). The `code-editor` and `highlighter` bullets open with `013`'s **interface change.** and now end with "Comments reworded to drop internal references; no interface change." Read whole, each contradicts itself, as `016`'s "No name changes." did in its review. The line is decision 26's own wording, so the fix scopes it rather than drops it.
   Fix, on those two bullets only: "The comments are also reworded to drop internal references; that changes no interface."
5. **Low. The in-page search can drop the first keys typed after Control-K** (`src/lib/site/chrome/search.svelte`, `search-palette.svelte`). EXECUTED: on `/nope/deep/`, 8 tries of Control-K and an immediate "butt". In 1 the input stayed empty: the combobox was in the page before focus reached it. With a 300 ms pause, 3 of 3 pages gave 15 results. `search.spec.ts` waits for focus before typing, so it does not see this.
   Fix: focus the input in the dialog's `onOpenAutoFocus`. Or buffer keys typed between the shortcut and the focus.
6. **Low. Every component page says it is walked by keyboard, and most are not** (`src/lib/site/page/component.svelte:192`). "Every page here is checked in Chromium, by axe in both themes and by a keyboard walk." Axe does cover every page. The keyboard walks cover the bar on three pages, the two landings, 34 item fixtures and the behaviour tests, not each page.
   Fix: "Every page here is checked in Chromium by axe, in both themes; the keyboard behaviour of its examples is walked by the tests. Firefox, Safari and screen readers are not checked yet." Or name the walk only where the item has a fixture.
7. **Low. A twin's two install commands carry no labels** (`src/lib/site/page/install.svelte:24`, the tab list is `data-md="skip"`). In `components/button/index.md` two `bash` fences follow the description, with nothing to say which is the site's and which is GitHub's. The page says so in its tabs.
   Fix: keep the tab names in the twin. For example, render each panel's command after a short `From this site:` / `From GitHub:` line that is hidden on the page.
8. **Low. The API twin reads "Default`"default"`"** (`src/lib/site/page/api-table.svelte:64`). The phone label "Default " sits in a span that is `md:sr-only`. The converter keeps it and drops its space, so every default cell in every twin is prefixed. A screen reader at `md` and wider also hears "Default" twice, once from the column header.
   Fix: mark the span `data-md="skip"`. On wide screens, hide it from assistive technology too (`aria-hidden` from `md`), since the header names the column.
9. **Low. The block pages' file views fence their code with no language** (`src/lib/preview/block-page.svelte:69`). That `<pre>` has no `data-language`, so `markdown.ts:300` writes a bare fence. There are 29 bare fences on the 8 block pages (`app-shell` 9, `page-states` 5, `chat` 3, `hero` 3, `settings` 3, `sign-up` 3, `sign-in` 2, `product-home` 1). Decision 19 keeps code blocks "fenced, with their language".
   Fix: set `data-language` from the file's extension (`svelte`, `ts`).
10. **Low. `brand.svelte` sets no `<title>`, where `leaf.svelte` does** (`src/lib/site/page/brand.svelte`). The Brand landing gets its title from `landing.svelte`. Each of 017's nine Brand pages must add its own `<svelte:head>`, or criterion 5 fails for it. It is caught by a test, but it is the one template that leaves it to the page.
    Fix: when `title` is given, render `<svelte:head><title>{pageTitle(title)}</title></svelte:head>`, as `leaf.svelte` does.
11. **Low. The public changelog names "the owner"** (`CHANGELOG.md:7`, `013`'s summary line, shown on `/changelog/` and its twin). "coloured in Tombaugh, the owner's palette after the guide Meridian". A reader of the public site does not know who the owner is. Decision 17 says no page cites a person. Criterion 29 checks git author names only, so it passes.
    Fix: "coloured in Tombaugh, this system's palette after the guide Meridian".
12. **Low. The site paragraph does not say where the site lives** (`CHANGELOG.md:9`). Decision 26 asks for "its name, where it lives, installing from its `/r/` path or from GitHub, and that every page has a Markdown twin". The paragraph has all of these but the address. The address is `SITE_ORIGIN`, still a placeholder.
    Fix, at the tag, once `<account>` is filled (the release check already gates it): name the address in the paragraph, for example "at `https://pluto-systems-design.<account>.workers.dev`".
13. **Low. A dead exclusion of `src/lib/identity/` remains** (`tests/unit/registry.test.ts:1830`, in `016`'s amber check). The folder is gone, so the filter does nothing, and the test's title still says "but the identity record". 015 owns the removal.
    Fix: drop the filter and the title's clause.

## Constitution checks

- **§3, one public design site:** met. The site teaches building with the system and the brand. It sells nothing. The `product-home` page shows a sample product, as its block always has.
- **§4.1, source, not a package:** met. EXECUTED: `site-add.test.ts` installs from the site's `/v0.12.0/r`, stops the server, and builds and checks the app. The files hold 0 references to the local origin, the site's host or GitHub's raw host. The registry changes are comments only.
- **§4.3, tokens are the one source:** met. The literal lint reports 0. `site-literals.test.ts` covers `src/lib/site/`, `(site)` and `(example)`. No site file has a `<style>` block.
- **§4.4, accessible by default:** met on what is checked. That is axe on 486 page scans and every view, the keyboard walks, focus kept clear of the sticky bar, and reduced motion. Finding 6 is about saying so accurately. Firefox, Safari and screen readers remain unchecked, as recorded.
- **§4.5 and §4.6, pinned and named dependencies:** met. Six packages are removed and none is added. The frozen install passes.
- **§6, never break an installed app silently:** met. No interface changes. The 12 items whose comments changed are named in the changelog (finding 4 is wording).
- **AGENTS.md, all knowledge in `context/`:** met. The rulings are in `decisions.md`, and the deviations are in the landing notes.

## Regressions looked for

- **`static/r/` and the snapshots:** unchanged but for the recorded rewordings. `v0.11.0` is untouched. The build is idempotent.
- **013's and 016's required page text:** the 14 sentences of `item-page-sentences.json` are on their pages. "Amber" is on 0 component pages.
- **The highlighter at prerender:** 0 `.wasm` on the four budget pages, and 0 on the six example views I opened (`code-block`, `button` and `chart`, two each).
- **The block viewer, the views and the compositions:** `viewer`, `blocks`, `compositions`, `expressive`, `on-brand` and `four-dot` pass in both projects.
- **The theme:** one head script per page; the frames hold no theme module.
- **The development server note** (landing notes, "Seen while building"): an older dev server can rewrite `static/r/` with a stale `build-registry`. Smoke also rewrites `static/r/` while it runs (my void run, above). Running unit tests beside smoke is unsafe. That is a property of the suites, not of this change.

## Verdict

Does not land yet.

All of criteria 1 to 30 are met on evidence I re-ran, and criterion 31 waits on the release as it should. The prose is accurate on every claim I checked but one.

What blocks is 015's promise to 017. Decision 2 says 017 appends `describe` blocks to nine of 015's test files and edits no line of 015's. Two of those files cannot take 017's pages and packages without such an edit (findings 1 and 2). Each fix is a few lines in a test.

Finding 3 is a real cost the switch carries. It should be fixed or ruled before the commit. Findings 4 to 13 are Low write-ins.

Once 1 and 2 are fixed, and 3 is fixed or ruled, this lands.

## Disposition

<to be filled in after the builder and the author answer>
