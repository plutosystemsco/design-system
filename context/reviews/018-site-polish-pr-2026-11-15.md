# Review of 018 — Site polish (the built change)

Reviews [`specifications/018-site-polish.md`](../specifications/018-site-polish.md). This reviewer wrote neither the specification nor the code, and did not review the specification ([`018-site-polish-spec-2026-11-15.md`](./018-site-polish-spec-2026-11-15.md) is another reviewer's). This reviewer did review `015`'s and `017`'s built changes.

- **Date:** 2026-11-15
- **Status:** in review; lands once two Medium findings are fixed. Eight Low findings are write-ins.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `cd19d26`, uncommitted.
  - The tracked diff: 61 files, +2,507 −300. It touches the site's chrome, templates and pages, nine test files, `CHANGELOG.md`, `README.md`, `AGENTS.md`, the constitution's name line, `handoff.md` and `decisions.md`.
  - The untracked files: the specification and its review, the nav, the all-pages sheet, the page tools, previous and next, `copy-page.ts`, `example-order.ts`, `search/aliases.ts`, `specimen.svelte`, `scripts/site/thumbnails.ts` and `thumbnail-hash.ts`, and `src/lib/site/thumbnails/` (150 WebP files, the manifest and `text-sizes.json`). Also three new e2e files, three new unit files, and a fixture.
  - Not reviewed: the `019` specification and its review, `context/prior_art/`, and the research memos.
- **Re-ran:** Bun 1.4.4, 2026-11-15. Nothing in the repository was written but this file. Scratch work is in `…/scratchpad/review-018/`. My own server used port 5320; Playwright's `webServer` used its configured 4173. The owner's preview on 5199 was left running.
  - `bun test tests/unit` → **1,193 pass, 0 fail**, 11,402 `expect()` calls, 35 files.
  - `bun run check` → `COMPLETED 2109 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → clean. `bun scripts/lint-literals.ts` → 0 literals, 1 allowance.
  - `bun run test:e2e`, the full run, → **2,683 passed, 11 skipped, 1 failed, 5 did not run**, 9.7 m.
    - The one failure is `013`'s E6 (`code.spec.ts:1241`): "csharp: every line rendered", 36 of 37. That was under load, while my own probes ran beside it.
    - The `perf` project then did not run, since it depends on the other two.
    - Re-run alone (`--project light --project perf --no-deps`), E6 and all 5 budgets pass, 8 of 8. See finding 10.
    - Counts include `nav` 44, `forced-colors` 14 (7 skipped in dark by design), `specimens` 14, `search` 26, `site` 94, `build-output` 25, `keyboard` 250 and `axe` 840.
  - `bun run test:smoke` → exit 0, 132 pass, 0 fail. See "Smoke" below.
  - **No registry changes:** `git diff --stat HEAD -- static src/lib/registry registry.json` is empty. `static/r` and `static/v0.12.0` were byte-identical before and after the build.
  - **My own probes**, with Playwright on a `Bun.serve` of `build/` that serves the twins and answers unknown paths with `404.html`:
    - landmarks, the order of the nav and `<main>`, and the skip link on 7 pages at 1440 and 390;
    - the first-row thumbnails under four theme and script states;
    - the door discs during and after the entrance;
    - Copy page under four clipboard states;
    - the "Suggest a change" link on three pages;
    - the LCP element on `/components/` under the throttled profile.
  - Over a copy of the tree, outside the repository, I mutated the sources 019 will change, and others, to test the thumbnail hash.

## Acceptance criteria against evidence

Where a criterion rests on a passing test, I re-ran it; "met" means that and my own reading of the code.

1. **Checks** — met. `deps.test.ts` finds no package added. `static/` is unchanged.
2. **The nav's order** — met (`sitemap.test.ts`).
3. **The nav at `lg`** — met (`nav.spec.ts`).
   - My probe: on Button, the changelog, Brand Colour, Install and `/components/`, the side `nav` ("<Door> pages", or "Site pages") precedes `<main>` in the DOM.
   - No two `nav`s on a page share a label.
   - The first Tab is "Skip to content". Enter moves focus to `#main`, and the next Tab lands inside `<main>`, past the nav's 77 stops.
   - `side-nav.svelte:54` sets the list's `scrollTop` and never calls `scrollIntoView`.
4. **The rail** — met.
5. **The phone sheet** — met (`nav.spec.ts`, axe with the sheet open).
6. **The part first** — met (`site.spec.ts`).
7. **Updated** — met (`component-data.test.ts`). On the built pages: `kbd` 0.12.0 (the follow-up's interface change), `button` 0.11.0, `tooltip` 0.2.0, `name-strip` 0.11.0. Items whose only 0.12.0 bullet is the comment rewording read 0.12.0, which the rule intends.
8. **Suggest a change** — met. My probe: `/a/b/c/` gives title "Suggestion: Page not found" and body `Page: https://pluto-systems-design.claygendron.workers.dev/a/b/c/`, read in the browser. Button and home give their own titles and paths.
9. **The details** — met.
10. **Page tools, previous and next** — met as tested. But its delayed-fetch test cannot fail on the path it claims to prove (finding 3).
11. **Search** — met as tested. The index is 211 entries, 7.4 kB gzipped, with four aliases. The order of the results is wrong for common queries (finding 1).
12. **The measure** — met (65.7, 62.0 and 61.2, as recorded).
13. **One h3** — met.
14. **Smoothing** — met.
15. **The bar** — met. READ: `productive={nav && !landing && current !== "brand"}`, so the changelog and the leaves turn opaque, and the landings follow the band, as ruled at checkpoint 2.
16. **The changelog** — met.
17. **Specimens** — met, in `specimens.spec.ts` (recorded deviation).
18. **Thumbnails** — met as tested. The hash misses inputs the build's own deviation added (finding 2).
19. **Budgets** — met, as ruled (finding 6). The medians, re-run:
    - `/components/button/`: 380 kB against 380, LCP 988 ms, CLS 0;
    - `/components/`: 354 kB against 395, LCP 2,692 ms against 2,988, CLS 0;
    - `/`: 307 kB;
    - `/components/code-block/`: 354 kB;
    - `/brand/colour/`: 302 kB, CLS budget now 0.02.

    0 `.wasm` on each.
20. **Suites, walk, checkpoints** — met but for E6's one flake (finding 10). axe found 0 violations over every page at three widths in both projects. The landing notes record both checkpoints and the walk.
21. **Forced colours** — met as tested. One assertion is weaker than it reads (finding 8).
22. **Brand bands beside the nav** — met, as ruled at checkpoint 1.
23. **The name** — met. The changelog's line is present, and the code names are unchanged.
24. **Done** — not yet, as expected.

## The points asked

- **Every decision built, or its deviation recorded:** yes, with two gaps.
  - The breadcrumb's `nav` is labelled "Where this page is" (015's label), not "Breadcrumb" as decision 1's table says (finding 9).
  - Decision 13 still says `019` regenerates eight images (finding 5).
  - Every other difference I found is in the landing notes and ruled: `example-order.ts`, photographing on the component page, the observer, `text-2xl` samples, `specimens.spec.ts`, the lockup's name, `wrap-anywhere!`, and the CSS first row.
- **Tests able to fail:** mostly. Three cannot fail as they claim:
  - the delayed Copy page test (finding 3);
  - the swatch colour check in forced colours (finding 8);
  - the thumbnail hash, for the page template (finding 2).
- **Budgets honest:** the figures re-measure to the kilobyte.
  - Button sits at its budget with 0 kB to spare.
  - `/components/` LCP is now 2.7 s, past the 2.5 s "good" line. Its LCP element is the first-row CSS background (finding 6).
- **`static/r` unchanged; no registry item changes:** confirmed.
- **Forced colours:**
  - The nav's mark is `border-inline-start`.
  - `<mark>` takes `Mark`/`MarkText` under `forced-colors:`.
  - The swatches carry `forced-color-adjust: none` and a border.
  - The theme switch takes `SelectedItem`.
  - axe passes on Button, Colour and the changelog in forced colours.
- **Keyboard and landmarks:** see criterion 3.
  - Each page has one banner, then "Site", then the side nav, `<main>` and the footer's five named groups. The breadcrumb and "Pages before and after" sit inside `<main>`.
  - Headings: one `h1` per page, and no skipped rank on the seven pages.
- **The thumbnail pipeline and its staleness hash, against `019`:** it will fail, and pass, correctly for what `019` changes.
  - My mutation over a copy of the tree, baseline 0 stale:
    - a change to `error-summary.svelte` stales exactly `error-summary`, `sign-in`, `sign-up` and `settings`;
    - a change to `src/app.css` stales **75 of 75**.
  - `019`'s decision 11 already plans for all 75. So the test fails until `019` regenerates every pair, and passes once the manifest is rewritten.
  - The hash misses the page template (finding 2), and the manifest can be edited without new images (recorded below).
- **Copy page:** the `ClipboardItem` path is built as decision 6 says (`copy-page.ts`), with a `writeText` fallback.
  - My probe on Button, with the twin delayed 1 s:
    - the normal path says "Copied" and puts the twin on the clipboard;
    - with `ClipboardItem` removed, and with `clipboard.write` rejecting, it also says "Copied", through the fallback;
    - with no clipboard permission, it says "Couldn't copy. Open the Markdown instead."
  - So the failure path works. But see finding 3.
- **Search ranking:** the ranks are right, but the palette groups by door before rank, so the top result is often not the best one (finding 1).
- **The CSS-background first row:** correct in all four cases I ran. At the first animation frame, `.site-thumb` already showed the scheme in force:
  - system light, no choice: light;
  - system light, saved dark: dark;
  - system dark, saved light: light;
  - system dark, scripts off: light, as the page itself is without the head script.

  Only that scheme's three files are fetched. Each span is `aria-hidden="true"`. There is no flash, because the head script sets `.dark` before first paint and the background resolves from it. Without scripts the other 72 tiles show no picture (finding 7).
- **The home page's door discs:** not a fault.
  - At `networkidle` they are still mid-entrance. Measured at 1440 they are 190.1, 193.0, 198.3 and 178.7 px: the spring's overshoot, staggered.
  - 3 s later all four are 190.5 px, with transform `none` and 0 running animations.
  - The same holds at 1024 (146.3), 768 (160.0) and 390 (156.0).
  - The builder's screenshot was taken mid-flight.
- **Smoke:** 132 pass, 0 fail.

## Findings, most severe first

1. **Medium. Search shows the best match after weaker ones, and Enter opens the wrong page** (`src/lib/site/search.ts`, `groupHits`; `chrome/search-palette.svelte:50`, `:122`).
   - The hits are ranked, then regrouped in the fixed order of the doors (Start, Components, Brand, Foundations, Site). `active` starts at 0 over that flat, grouped list.
   - So a title match in a later door sits below summary-only matches in an earlier one. EXECUTED, over the built `search.json` (ranked, then first shown):
     - "colour": ranked Colour (1), Colour (1); shown first Pluto theme (4), Liquid glass (4), Badge (4), Checkbox (4). Enter opens Pluto theme.
     - "type": shown first Pluto theme (4) and Utils (4), before Brand and Foundations Type (1).
     - "motion": shown first Pluto theme (4), before both Motion pages (1).
     - "token": shown first Read token (2), then rank-4 hits, before Tokens (1).
     - "theme": shown first Start's "The theme" (2) and "Light and dark" (4), before Components' Theme (1).
   - "dia", "button" and "install" are unaffected, because their best match is in the first door with results. The tests only try those.

   Fix: order the groups by their best hit's rank, with door order as the tie-break, so the first option is the best match. Add a test: "colour" makes a rank-1 hit the first option, and Enter opens it.
2. **Medium. The thumbnail hash misses the page the pictures are now taken from** (`scripts/site/thumbnail-hash.ts`, `thumbnailInputs`).
   - The recorded deviation photographs each example's stage on its component page, with a 1,000 px viewport. But the hash still names only `frame.svelte`, `site.css` and the example's own import graph.
   - EXECUTED, over a copy of the tree. Appending a line to each of these stales 0 items:
     - `src/lib/site/page/component.svelte`, the template that sizes the stage's column;
     - `src/routes/(site)/+layout.svelte`, the grid;
     - `src/routes/(site)/components/button/+page.svelte`, the route that passes the example its data;
     - `src/lib/site/examples/font-geist/data.server.ts`.
   - By contrast, `pluto-theme/data.server.ts` stales `pluto-theme`, since its example imports the type.
   - A width or padding change in the template changes every picture's crop, and nothing says so. Decision 13 promises that "the frame … or the crop cannot ship with an old picture".

   Fix: add to every item's inputs `component.svelte`, the `(site)` layout, and the item's route `+page.svelte`. Add its `data.server.ts` where one exists. Add a mutation case for the template.
3. **Low. The delayed Copy page test passes through the fallback too, so it cannot prove what it says** (`tests/e2e/nav.spec.ts:278`).
   - Criterion 10 says the 1 s delay "proves the copy is written inside the click, through `ClipboardItem`".
   - With clipboard permissions granted, `writeText` after the fetch also succeeds. EXECUTED: with `ClipboardItem` set to `undefined`, and with `clipboard.write` rejecting, the test's steps still end with "Copied" and the twin on the clipboard.
   - The unit test does hold the path choice (`copy-page.test.ts`).

   Fix: in the e2e test, spy on `navigator.clipboard.write` (an init script) and assert it was called with one `ClipboardItem` before the fetch resolved. Or restate criterion 10 as what the test proves.
4. **Low. Button has no room left** (`tests/e2e/perf.spec.ts`, 380 kB). The median is 380 kB in all three runs, against 380. The next byte any component page gains fails it: a nav link, a footer link, 019's error-summary work. The ruling was "the measured 378 plus 2", but the final figure is 380.
   Fix: record in the landing notes that the margin is 0. Then either take 2 kB back (the page tools' icons, or previous and next as plain links), or re-rule before `019`.
5. **Low. Decision 13 still says `019` regenerates eight images** (`018-site-polish.md`, decision 13, "`019` regenerates eight images"). `019` changes `src/app.css`, which every item's hash reads, so all 150 go stale. My mutation confirms 75 of 75. `019`'s decision 11 already says so and asks for this correction.
   Fix: "`019` changes `src/app.css`, so it regenerates every pair; its `error-summary` change alone would stale four items' pairs".
6. **Low. The index's LCP is the first-row picture, and it lands late** (`routes/(site)/components/+page.svelte`, `.site-thumb`).
   - EXECUTED, under the throttled profile: the LCP entry is the `.site-thumb` span (`font-geist-light…webp`), not the band's `h1`. The median is 2,692 ms, past the 2.5 s "good" threshold. The budget is ruled at 2,988 ms; 015's was 1,138.
   - A CSS background is found only after the stylesheet and the element, so it starts late.
   - The ruling stands. A cheaper path to most of the old LCP: have the head script add `<link rel="preload" as="image">` for the three files of the scheme in force, or set the first row's images at `fetchpriority="high"`.
   - Decision 14's table still says "LCP and CLS budgets are unchanged".

   Fix: try the preload, re-measure, and amend decision 14's table either way.
7. **Low. Without scripts, 72 of 75 tiles have no picture, and their `<img>`s have no `src`** (`routes/(site)/components/+page.svelte`, the observer). EXECUTED, scripts off: 144 `img[data-scheme]`, 0 with a `src`. The text rows all show, as `015` requires. But an `<img>` without `src` is invalid HTML, and `loading="lazy"` does nothing on it.
   Fix: put the light picture in a `<noscript>` per tile, or start each `img` with its scheme's `src` and `loading="lazy"`, letting the observer only swap the scheme.
8. **Low. The forced-colours swatch check accepts any `rgba` background** (`tests/e2e/forced-colors.spec.ts:125`). `expect(values.has(bg) || /rgba/.test(bg))`. A swatch whose colour forced colours had cleared to transparent, `rgba(0, 0, 0, 0)`, passes. So does any white role, since the forced `Canvas` is white and `raised` is `#FFFFFF`.
   Fix: compare each swatch with its own row's token value, allowing `rgba` only for the roles the token file defines with alpha.
9. **Low. The breadcrumb's label differs from decision 1's table** (`chrome/breadcrumb.svelte`, `label="Where this page is"`). The table says "Breadcrumb". The labels are distinct either way, and `landmark-unique` passes.
   Fix: amend the table, or rename. "Breadcrumb" is the conventional name, but changing it moves `015`'s tests.
10. **Low. `013`'s E6 failed once under load** (`tests/e2e/code.spec.ts:1241`). It reported "csharp: every line rendered", 36 of 37, in the full run, while my probes shared the machine. Alone it passes, in 4 s. 018 did not touch the view it reads. But a failure there skips the whole `perf` project, as it did here.
    Fix: none required for 018. Record it as a known flake under load, and consider an `expect.poll` around E6's line count.

Recorded, not findings:
- The manifest can be edited by hand to match new sources without new pictures. The test holds the hash, not the pixels. That is acceptable for committed images, but worth one sentence in decision 13.
- The search `<mark>` outside forced colours is weight 600 on a transparent ground. Weight is its one signal there, as decision 8 allows.

## Constitution checks

- **§3, one public design site:** met. Polish only. The name change is a ruling.
- **§4.1 and §6, source, not a package:** met. No registry item, token or theme change, and `static/r` is byte-identical.
- **§4.3, tokens are the one source:** met. The literal lints pass, and the swatches read the token file.
- **§4.4, accessible by default:** met on what is checked.
  - axe passes over every page at three widths in both themes, and in forced colours on three pages.
  - The nav comes before `<main>`, with the skip link bypassing it, and every label is distinct.
  - Finding 1 is a usability fault for every reader, not only a keyboard one: Enter opens the first option.
- **§4.5 and §4.6:** met. No package is added.

## Regressions looked for

- **`015`'s and `017`'s suites:** pass, apart from E6's flake. That includes the 017 checks on install, tokens, downloads and claims.
- **The home page:** "Design / with / Kuiper" fits at every width. The discs settle equal (above).
- **The registry and the snapshots:** unchanged.

## Verdict

Lands once findings 1 and 2 are fixed.

The build does what the specification and its two checkpoints ask, and every figure I re-measured matches the landing notes. The landmarks, forced colours and the CSS first row are sound. The thumbnail hash behaves correctly for what `019` changes.

What must be fixed first:
- Finding 1: search often puts a weaker match first, and Enter opens it.
- Finding 2: the hash misses the page template the pictures are now taken from.

Each fix is small. Findings 3 to 10 are Low write-ins.

## Disposition

<to be filled in after the builder and the author answer>
