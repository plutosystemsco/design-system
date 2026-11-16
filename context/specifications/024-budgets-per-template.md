# 024 — Budgets per template

- **Status:** Built; change-reviewed (`reviews/024-budgets-per-template-pr-2026-11-16.md`, land after fixes); the design lead's rulings at landing and the review's fixes applied; `release/0.13.0` at `4a0bdde` merged in and the perf project re-run on the merged tree (Landing notes). Awaiting the landing. Build step 7, the CI runner's LCP figures, is still open, and the release check holds the tag on it. The owner answered Q1 to Q5 on 2026-11-15, each with the recommended option.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** test harness, the perf suite only. Two new files and one rewritten file, all under `tests/` (see "Files"). **Interface changes:** none for an installed app. No registry item, token, page or dependency changes. **Not a small change,** although the roadmap calls it one (next section but one).
- **Depends on:** `020` (the Kuiper rename), landed first, so the theme item's page is `/components/kuiper-theme/` and the upgrade guide `/changelog/0.13.0/upgrade/` exists. Ranked in [`roadmap.md`](../roadmap.md) §2, 0.13.0, row `024`, wave 1. It must land before `030` (§2, "`024` before `030`").
- **Coordinates with:** [`022`](./022-the-test-matrix.md) decision 8. **The owner answered `022` Q1 with option 1** (`022`'s landing notes, 2026-11-15): "LCP is reported in CI now, and gates once `024` re-bases the budgets on the runner. Transfer budgets gate from the first run." Decision 8 below is that re-base. `022` also moves every spec file's `test` import, `perf.spec.ts`'s too. [`025`](./025-component-cost.md) decision 4 gzips `.wasm`; decision 7 does the same.
- **Research it stands on:** the short note below. Also [the older-rules audit](../research/2026-11-15-older-rules-audit.md) P14, where the rule was first written; [`015`](./015-the-design-site.md) decision 23 (the profile); and [the benchmark scorecard](../research/benchmark-scorecard.md) row 8.

## Terms

- **Transfer:** the bytes a page loads over the network, as sent (gzipped where the file compresses). It counts the main frame only, and leaves out iframes and the search index (`015` decision 23).
- **LCP**, largest contentful paint: when the page's biggest text or picture is drawn.
- **CLS**, cumulative layout shift: how far the page jumps while it loads.
- **Template:** a family of pages built on the same layout, or sharing one cost. Its pages share most of their bytes.
- **Headroom:** a template's budget minus a page's measured median.
- **Probe page:** a page measured under the full throttle on every run, to stand for its template's paint.
- **Sweep:** a load of every page in the sitemap.

## The defect

The perf suite budgets five pages by hand. The site has 102 (103 after `020`).

- **Button has 0 kB of headroom.** It transfers 380 kB against a 380 kB budget, in every run since `018` (EXECUTED, `019a`'s landing notes). Any byte added to every component page fails it. `030` adds a status line and a cost figure to every component page. So `030` would break the build on arrival (`roadmap.md` §2).
- **The budget keeps being re-ruled.** Button's went 360 → 365 → 370 → 375 → 380 kB in one day, each by a ruling (audit P14).
- **97 pages have no budget at all.** Only `/`, `/components/`, `/components/button/`, `/components/code-block/` and `/brand/colour/` are measured (READ, `tests/e2e/perf.spec.ts`).
- **Button is not the heaviest component page.** A static estimate (below) puts at least six component pages above it. One of them, the theme item's page, is roughly 190 to 240 kB heavier. None of them is checked.

## Not a small change

AGENTS.md and constitution §5 define a small change as a fix that changes no interface, adds no token and no dependency, and touches one item or one page.

By the letter, 024 meets all four. Its files are tests. It edits no item and no page. It is still a full specification, for three reasons:

- **It needs owner answers and checkpoint rulings.** Five questions below, and a checkpoint that rules the heavy and live lists, every figure and every rise (constitution §5: a feature's build has a checkpoint).
- **It sets a rule for later specifications.** A change that adds weight to every page of a template states its cost. A budget rises only by a ruling. That rule goes into `roadmap.md` §4 at landing (decision 4).
- **It replaces five budgets that were each ruled.** Replacing a ruling is not a fix.

So it carries its research inside, and it had a spec review. At landing, the design lead corrects the roadmap row's "Small change".

## What the research found

Short, because the question is narrow.

- **The rule already exists, as a proposal.** Audit P14: "A budget is set per page template (component, block, landing, Brand), from the heaviest measured page of that template plus a stated margin. A change that adds weight to every page states its cost in its specification. LCP and CLS budgets stay per template. A budget rises only by a ruling recorded with its measurement" (READ). It was meant for `decisions.md`, which is now retired.
- **The site has six layouts, plus the home page** (READ, `src/routes/(site)/`, `src/lib/site/page/`, `src/lib/preview/`; EXECUTED (review), a tally of each route's imports):

  | Layout | Pages today |
  |---|---|
  | `(site)/+page.svelte`, the home page, which imports no shared layout | 1 |
  | `landing.svelte`, with no index of parts | 3: `/start/`, `/brand/` (which also imports `page/brand.svelte`), `/foundations/` |
  | `landing.svelte` with the parts grid and its thumbnails | 1: `/components/` |
  | `component.svelte`, directly (58), through `block-page.svelte` (8 blocks) or through `composition-page.svelte` (9 compositions) | 75 |
  | `leaf.svelte` | 13: the changelog, five Start pages, seven Foundations pages |
  | `brand/page.svelte` | 9 Brand pages |

  The 404 is not in `SITEMAP` and imports none of these. The `/view/` and `/example/` routes are frames, loaded in iframes, and are not counted.
- **Only five pages are measured.** The latest medians, 3 runs each, under the profile (EXECUTED, `019a`'s landing notes, the tree committed as `dad6f76`; CLS from `019`'s change review, the last run that logged it):

  | Page | Transfer | Budget today | LCP | Budget today | CLS |
  |---|---|---|---|---|---|
  | `/` | 307 kB | 355 | 868 ms | 1,027 | 0.005 |
  | `/components/` | 355 kB | 395 | 2,776 ms | 2,988 | 0 |
  | `/components/button/` | **380 kB** | **380** | 1,040 ms | 1,157 | 0 |
  | `/components/code-block/` | 354 kB | 360 | 1,088 ms | 1,186 | 0.003 |
  | `/brand/colour/` | 302 kB | 347 | 864 ms | 984 | 0.001 |

- **A static estimate ranks the other 97** (EXECUTED (024), a read-only script over `build/` at `dad6f76`, not committed; rebuilt independently by the review, which found every figure within 2 to 7 kB and the same order). For each page it sums the gzipped HTML, the JavaScript and CSS the HTML preloads, the preloaded fonts and the `<img>` files. It cannot see what loads at run time: fonts named only in CSS, lazy chunks, `.wasm`.

  So it reads low, by an **offset** that differs by template: +82 kB on the home page, +99 on both measured component pages, +126 on `/brand/colour/`. On `/components/` it reads high, since it counts both schemes' thumbnails. **It ranks pages. It does not set budgets.** Below, every INFERRED figure is a range, static + 82 to static + 126. For a page with lazy loads of its own, the range is a floor.

  | Component page | Static | Measured, or INFERRED |
  |---|---|---|
  | the theme item (`pluto-theme`, `kuiper-theme` after `020`) | 491 kB | 573 to 617 kB |
  | `code-editor` | 390 | 472 to 516, plus its `.wasm`, gzipped (decision 5) |
  | `code-languages` | 388 | 470 to 514, plus its `.wasm`, gzipped |
  | `chart` | 377 | 459 to 503 |
  | `sidebar` | 309 | 391 to 435 |
  | `dropdown-menu` | 282 | 364 to 408 |
  | `button` | 281 | **380, measured** |
  | `code-block` | 255 | 354, measured |
  | the median of the 75 | 243 | 325 to 369 |
  | the lightest (`font-geist`) | 233 | 315 to 359 |

  The other templates' heaviest pages by the static estimate: landings, `/start/` 224 (306 to 350); leaves, `/changelog/` 208 (290 to 334; its HTML grows every release); Brand, `/brand/downloads/` 183 (265 to 309), just above `/brand/colour/` at 176, which measures 302. These differ by a few kB, so the sweep decides.
- **Three pages fetch `.wasm` on load** (READ (review)). `CodeEditor` colours through the highlighter, which loads `web-tree-sitter.wasm` and a grammar as dynamic imports (`languages.ts` l. 54–55; `tree-sitter.ts` l. 106–128). The `code-editor` and `code-languages` pages both render a `CodeEditor` in their examples. `use-highlighted-code`'s examples run the hook. The `highlighter` page highlights on a button press, so it fetches nothing on load (INFERRED).
- **The harness serves `.wasm` raw** (READ, `perf.spec.ts` l. 55–60: it gzips only types matching `/text|javascript|json|svg/`). `web-tree-sitter.wasm` is 206 kB raw and 81 kB gzipped; the Python grammar 447 kB raw and 64 kB gzipped (EXECUTED (review)). Raw, the `code-editor` page would read about 1.1 MB. `025` decision 4 gzips `.wasm`, because "the raw figure would mean nothing on the wire".
- **One budget from the very heaviest page would be loose.** If the component template took the theme page's figure plus 10%, 635 to 680 kB, an ordinary page could grow by about 300 kB and pass.
- **Row 8 reads Button alone** (READ, scorecard l. 87; `scripts/bench/site.ts`). It loads `/components/button/` through `site.ts`, counting every frame. Its score is the mean of a transfer score (4 at ≤ 500 kB) and an LCP score (4 at ≤ 1.5 s), rounded down.
- **Bytes do not depend on the throttle, on most pages.** The site preloads on hover only (`data-sveltekit-preload-data="hover"`; READ, `src/app.html`), and the suite never hovers. So an unthrottled load should fetch the same files (INFERRED). One exception is likely: `networkidle` waits for 500 ms with no requests. Under the 4× CPU slowdown, compiling `web-tree-sitter.wasm` before the grammar is requested can leave such a gap, and the throttled load would stop early (INFERRED (review)). Criterion 4 checks both.
- **The cost of a run.** Today the `perf` project's 15 loads take about 1.5 minutes: about 6 s a throttled load. An unthrottled load is about 2 s. So a transfer sweep of 102 pages is about 3.4 minutes, and paint on about ten probes, 3 loads each, about 3 minutes. A full throttled sweep, 306 loads, is about 31 minutes (INFERRED, from those rates).
- **`--project=perf` runs the whole suite first.** Locally, the `perf` project depends on the light and dark projects, and Playwright runs a project's dependencies unless given `--no-deps` (READ, `playwright.config.ts` l. 31–36; `022` keeps that locally).
- **CI retries once and fails flaky tests** (READ, `022`'s config sketch: `retries: CI ? 1 : 0`, `failOnFlakyTests: CI`, the `blob` and `dot` reporters). A first try over budget with a passing retry is flaky, and fails the run.
- **Prior art.** web.dev's "Use Lighthouse for performance budgets" gives a budget file whose entries match pages by path pattern (`"path": "/*"`). `size-limit`'s README gives each entry its own `path` and `limit`, and it "throws an error if the cost exceeds the limit" (READ (review), both fetched). Both budget a family, not one page. How Lighthouse resolves several matching patterns is not stated (INFERRED). Studied, not copied.

## Decisions

### 1. Eight templates (nine from `024d`)

Every page in `SITEMAP` belongs to exactly one template.

_Amended at `024d`: nine templates. The ninth, `kuiper-theme`, holds `/components/kuiper-theme/` alone; see the landing notes, "After `024d`"._

| Template | Pages | Mapping |
|---|---|---|
| `home` | `/` | `path === "/"` |
| `index` | `/components/` | `path === "/components/"` |
| `landing` | `/start/`, `/brand/`, `/foundations/` | `parent === "/" && door !== null`, not the index |
| `component` | every `/components/<name>/` page not in `LIVE_HIGHLIGHT` or `HEAVY` | `door === "components" && parent === "/components/"` |
| `component-live` | the pages in `LIVE_HIGHLIGHT` (decision 5) | listed by name |
| `component-heavy` | the pages in `HEAVY` (decision 3) | listed by name |
| `leaf` | the changelog, its upgrade guides, the Start and Foundations pages | `door === null && path !== "/"`, or (`door` is `start` or `foundations` and `parent` is that door's landing) |
| `brand` | the nine Brand pages | `door === "brand" && parent === "/brand/"` |

- **Why `index` is its own template:** its LCP is a thumbnail, at 2.8 s. The other landings paint text, near 0.9 s (EXECUTED, the table above). One LCP budget for both would be useless for three of them.
- **Why blocks and compositions are not their own template:** P14 proposed one. But their pages are `component.svelte` pages, and their views are iframes, which transfer leaves out. The static estimate puts them among the lightest component pages (234 to 256 kB). Their own row would add a budget with no different weight.
- **Why the live pages are their own template:** their extra weight is one known thing, the tree-sitter runtime and a grammar. Mixed into `component-heavy`, it would set that template's budget and leave the theme page and `chart` far under it. Apart, each budget stays close to its pages.
- **The 404 has no budget** unless Q5 says otherwise. It is not in `SITEMAP`, and holds no example.

### 2. How a page maps, and how a new page is assigned

`templateOf(page: SitePage)` in `tests/e2e/budgets.ts` reads the page's `path`, `door` and `parent`, as in decision 1's table, then `LIVE_HIGHLIGHT` and `HEAVY` for component pages. It reads nothing else. So:

- **A new page is assigned by its sitemap entry, with no edit to the budgets.** `026`'s `/components/toast/` and `027`'s six item pages join `component`. `020`'s `/changelog/0.13.0/upgrade/` (the owner's place for it, `020` Q4) has `door` null and parent `/changelog/`, so it joins **`leaf`**. Each is checked from its first run.
- **The mapping is checked against the code.** A unit test finds each page's route at `src/routes/(site)` + `path` + `+page.svelte`, and requires:
  - `home`: the file is `src/routes/(site)/+page.svelte`, and it imports none of the shared layouts below;
  - `index` and `landing`: `page/landing.svelte`;
  - `component`, `component-live` and `component-heavy`: `page/component.svelte`, `preview/block-page.svelte` or `preview/composition-page.svelte`;
  - `leaf`: `page/leaf.svelte`;
  - `brand`: `brand/page.svelte`.

  A page whose route imports none of its template's layouts fails.
- **If the upgrade guide does not use `leaf.svelte`,** `020` does not say it must. Criterion 1 will tell. The fix is then a small change to the guide's route, in `020`'s lane, so it uses `leaf.svelte`. It is not a new template.
- **A new template is a decision of the spec that makes it.** That spec adds a row to `TEMPLATES`, with its measurement and margin. Until then, the unit test fails.
- **A new page that is too heavy fails.** Its builder slims it, or asks the design lead for a ruling: a place in `HEAVY` or a raised budget, each recorded with its measurement.

### 3. Heavy component pages have a template of their own

**The component template's budget may not pass 500 kB.** This is a policy guard. It keeps Button's transfer budget inside row 8's band 4 (≤ 500 kB). Button's LCP half needs ≤ 1.5 s, which `component`'s local LCP budget (about 1,200 ms) keeps. Row 8 reads Button alone, through `site.ts`; criterion 11 is its real check.

- **`LIVE_HIGHLIGHT` is ruled first** (decision 5), because the live pages are heavy for a different reason. `HEAVY` is then ruled on the pages that remain.
- At the build's checkpoint, the sweep (decision 6) gives every component page's median. A page goes in `HEAVY` if it alone would push `component`'s budget past 500 kB: if its median × 1.1 is over 500 (a median over about 455 kB).
- By the static estimate that is two pages: the theme item (573 to 617 kB) and `chart` (459 to 503 kB, at the line's edge). The sweep decides. The design lead rules the list, and the landing notes record it.
- After that, `HEAVY` changes only by a ruling with its measurement. A page that grows past `component`'s budget fails. It never moves on its own.
- `component-heavy` has one budget, from its heaviest page plus the margin, like any template: 635 to 680 kB by the estimate.

This is Q1.

### 4. Each budget is its heaviest page plus a stated margin

For each template, `budgets.ts` records the measured figures and a `ruling`. The budget is computed from them, never typed.

- **Transfer:** the heaviest page's median × (1 + 10%), rounded up to 5 kB.
- **LCP:** the slowest page's median × (1 + 10%) on the release machine, rounded up to 10 ms. On a CI runner the margin is measured (decision 8), never under 20%.
- **CLS:** the worst page's median × 1.2, but never under 0.02 (`017` checkpoint 1's rule, READ, `perf.spec.ts`).

The margins are Q2.

**The `ruling` field** says where the figures were recorded. Every change to a figure changes it.

- **A rise** needs a ruling recorded with its measurement (audit P14). Its `ruling` names the landing note that records the ruling and who gave it.
- **A fall** needs no ruling. A re-base **must** happen when a template's budget is more than 20% over its heaviest page's median (`015` decision 23's rule). **Every re-base takes every fall**, in every template, whether or not that template passed the 20% line: each figure that falls takes its new value. Its `ruling` names that re-base's landing note, for example `"024 landing notes, re-base 2026-12-01"`. Criterion 2 accepts both. (Amended at landing, 2026-11-16, from the change review's merge note on `024b`: read literally, the old text let a fall under 20%, such as `024b`'s 11.6 kB, stay as headroom no one had ruled.)

**A change that adds weight to every page of a template states its cost in its specification**, in kB per page. It must fit the template's headroom, or ask for a ruling. `030` is the first. Its stated cost is first compared with real headroom at this spec's checkpoint.

**This rule binds later specifications, so it is written into `roadmap.md` §4 at landing.** The line, exactly:

> **Page budgets (`024`).** Every site page is held to its template's transfer, LCP and CLS budgets, each from the template's heaviest or slowest page plus a stated margin (`tests/e2e/budgets.ts`). A specification that adds weight to every page of a template states the cost in kB per page; it must fit the template's headroom or ask for a ruling. A budget rises only by a ruling recorded with its measurement, and falls at a re-base without one. Before each tag, the sweep runs: `PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps`.

### 5. `.wasm` stays at zero, except where it is the point

No page fetches a `.wasm` file, as today, except the pages in `LIVE_HIGHLIGHT`.

- **What is counted.** `measure()` counts `.wasm` requests in every frame, and counts bytes in the main frame only (READ, `perf.spec.ts` l. 105–110). So the zero rule covers a block's iframes too, as it does today. On a listed page, the `.wasm` bytes, gzipped (decision 7), count toward transfer.
- **The list** names the pages whose item's job is live highlighting, and which fetch `.wasm` on load. The likely members are `code-editor`, `code-languages` and `use-highlighted-code` (READ (review): each renders a `CodeEditor` or runs the hook in its examples). `highlighter` highlights on a button press, so it should stay out (INFERRED). The sweep records which pages fetch `.wasm`. The design lead rules the list to those whose item highlights live, before ruling `HEAVY` (decision 3). Any other page that fetches one fails.
- **Split at landing (2026-11-16, the change review's finding 1).** Two lists, not one. `WASM_ALLOWED` names every page that may fetch `.wasm`, in any frame; the `.wasm` check reads it. `LIVE_HIGHLIGHT`, the template's list, names only the pages whose **main frame** loads tree-sitter, so only pages whose counted bytes hold the runtime take `component-live`. `LIVE_HIGHLIGHT` is within `WASM_ALLOWED`.
- **`component-live`** has one budget from its heaviest page plus the margin. By the estimate, `code-editor` with the runtime and the Python grammar gzipped (about 145 kB) is 617 to 661 kB, so the budget is 680 to 730 kB.
- **This reverses `015` decision 23,** which said the live-highlighting pages "carry no budget". From this spec they do. The landing notes record the change.

### 6. What runs, and when

**Every run of the `perf` project** (`bun --bun playwright test --project=perf --no-deps` to run it alone):

1. **Transfer, every page.** One load of each page in `SITEMAP`, cold, at 1280 × 900, with the network and CPU unthrottled. One test per template: `024 transfer: <template>`. It fails if any page is over, and its message lists every page over with its figure and its six largest files. A failure is read against the last sweep's `perf-sweep.json`, which keeps each page's ten largest files, to see what grew. (Amended at landing: the harness keeps no per-file baseline, so "the files that grew" cannot be computed in a test. Test names carry no figures, so a re-base renames no test; the figures are in the annotations.) Each test's timeout is `30_000 + 5_000 × pages` ms (`component`: about 71 pages, about 6 minutes). About 3.4 minutes in all (INFERRED).
2. **Paint, the probe pages.** Each probe page, 3 cold loads under `015` decision 23's full profile, as today. One test per probe page: `024 paint: <template>: <page>`. It checks the medians, with a timeout of 180,000 ms, as today. It also checks criterion 4. About 3 minutes in all (INFERRED).

**The probe pages.** For each template: its heaviest page and its slowest page at the last sweep (often one page). Every `LIVE_HIGHLIGHT` page is a probe. `component` always probes `/components/button/` too, the page the scorecard reads. So the probes start at about ten to twelve pages, against five today.

The `perf` project's own tests then take about 6.5 minutes, against about 1.5 today.

**On demand, the sweep:** `PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps`. Every page, 3 loads each, under the full profile. One test per page, each with a timeout of 180,000 ms, so no one test runs for twenty minutes. It writes `test-results/perf-sweep.json` (every run of every page) and prints a `perf <path>: [...]` line for each, as today. It fails if any page is over its template's transfer, LCP or CLS budget. About 31 minutes (INFERRED). It runs:

- at this spec's build, to set every figure;
- at every re-base, and whenever a ruling raises a budget;
- in the measurement loop before each tag (`roadmap.md` §4, step 1), so a page that became slow without being a probe is caught.

This split is Q3.

### 7. The old budgets go; `.wasm` is served gzipped

`BUDGETS` and `COLOUR_BUDGET` leave `perf.spec.ts`. The five pages they covered are still measured: in the transfer sweep, and as probes where the sweep picks them.

`measure()` keeps its profile and its counting rules, with three changes:

- **It gains `throttle: false`,** for the transfer sweep.
- **It returns each response's URL and size,** so a failure can name what grew.
- **The test server gzips `application/wasm`,** as `025` decision 4 does. No budgeted page fetches `.wasm` today (EXECUTED, `019a`'s runs: 0 on each), so no figure moves. At landing, the builder checks whether the host (Cloudflare) compresses `.wasm`. If it does not, the landing notes state the difference for the live pages: the budget measures the wire as this harness serves it.

### 8. CI re-bases LCP; transfer and CLS gate from the first run

This is the owner's answer to `022` Q1 (option 1). Bytes do not depend on the machine. Paint does. So:

- **Transfer** gates on every machine, from the first run (`022` decision 8).
- **CLS** gates on every machine. It does not depend on speed at these values (INFERRED; the landing notes record the runner's first figures).
- **LCP** has two figures per template in `budgets.ts`: `local`, measured on the release machine, and `ci`, measured on `022`'s `perf` runner (`ubuntu-24.04`). The test reads `process.env.CI` to choose.
- **Every paint test records its LCP as an annotation,** on every machine, gated or not: `{ type: "lcp", description: <JSON of page, template, the three runs, the median, the budget or null, and whether it gated> }`. On CI, `022`'s merged `report.json` keeps it. The re-base reads that file, not job logs.
- **Until a runner figure exists, `ci` is `null`.** On CI the paint test then adds a second annotation, "LCP reported, not gated: no runner figure (024 decision 8)", and asserts nothing about LCP. It still asserts CLS and transfer.
- **The window before 024.** If `022` lands first, its `perf` job runs today's five budgets and reports their LCP without gating it (`022` decision 8). 024 replaces that with this decision's `null` path.
- **The re-base.** After `022`'s first three green runs, the design lead reads each probe's three medians from the three runs' `report.json`. The landing notes record them and their **spread**: for each probe, (largest median − smallest) ÷ smallest. Each template's `ci` figure is the median of its slowest probe's three medians. **The CI margin is the largest spread observed on any probe, rounded up to 5%, and never under 20%.** It enters `budgets.ts` with a `ruling` naming the landing note. From then on, LCP gates on CI.
- **One retry does not excuse a slow first try.** CI retries a failed test once, and `failOnFlakyTests` fails the run when a retry passes. That is intended: a first try over budget is a real result. The margin must cover the runner's noise. If noise later turns a run red, the remedy is a re-base with a new spread and a ruling, never a change to the retry rule.

When the re-base happens relative to `024`'s landing is Q4.

### 9. The figures today, and the budgets they would give

Firm figures are measured. INFERRED figures are ranges (the research note), and stand until the sweep replaces them. The budgets apply decision 4's margins. **Every outcome below is known only at the checkpoint.**

| Template | Pages | Heaviest page (transfer) | Transfer budget | Today's budget on these pages | Slowest measured (LCP) | LCP budget, local | CLS budget |
|---|---|---|---|---|---|---|---|
| `home` | 1 | `/`, **307 kB** | **340 kB** | 355 | **868 ms** | **960 ms** | 0.02 |
| `index` | 1 | `/components/`, **355 kB** | **395 kB** | 395 | **2,776 ms** | **3,060 ms** | 0.02 |
| `landing` | 3 | `/start/`, 306 to 350 kB | 340 to 385 kB | none | not measured | from the sweep | 0.02 |
| `component` | about 70 | `sidebar`, 391 to 435 kB; Button 380 measured | 430 to 480 kB | 380 (Button), 360 (code-block), none on 73 | code-block **1,088 ms**, Button **1,040 ms**; others not measured | 1,200 ms if code-block stays slowest | 0.02 |
| `component-live` | about 3 | `code-editor`, 617 to 661 kB with its `.wasm` gzipped | 680 to 730 kB | none | not measured | from the sweep | 0.02 |
| `component-heavy` | about 2 | the theme item, 573 to 617 kB | 635 to 680 kB | none | not measured | from the sweep | 0.02 |
| `leaf` | 13 | `/changelog/`, 290 to 334 kB | 320 to 370 kB | none | not measured | from the sweep | 0.02 |
| `brand` | 9 | `/brand/colour/` **302 kB**, or `/brand/downloads/` at 265 to 309 | 335 to 340 kB | 347 (Colour) | Colour **864 ms** | 960 ms | 0.02 |

**Every rise, for the checkpoint to rule** (each a page that has a budget today):

| Page | Figure | Today | Would be |
|---|---|---|---|
| `/components/button/` | transfer | 380 kB | 430 to 480 kB |
| `/components/code-block/` | transfer | 360 kB | 430 to 480 kB |
| `/components/button/` | LCP, local | 1,157 ms | about 1,200 ms |
| `/components/code-block/` | LCP, local | 1,186 ms | about 1,200 ms |
| `/components/` | LCP, local | 2,988 ms | 3,060 ms |

The sweep may add rises (a slower component page, say) or remove them. The checkpoint rules the list as the sweep gives it.

**The falls, which need no ruling:** `/` transfer 355 → 340 kB and LCP 1,027 → 960 ms; `/brand/colour/` transfer 347 → 335 to 340 kB and LCP 984 → 960 ms.

What this gives, if the sweep confirms the estimate:

- **Button gains 50 to 100 kB of headroom** (380 against 430 to 480). `030`'s stated cost is compared with the real figure at the checkpoint.
- **Every page is checked.** 102 pages today, against 5.
- **Button's transfer and LCP budgets stay inside row 8's band 4** (≤ 500 kB and ≤ 1.5 s).

## Acceptance criteria

Each check is written first and seen failing. The landing notes say how each failed.

1. **Every page has one template.** `tests/unit/budgets.test.ts`: every `SITEMAP` page maps to exactly one of the eight (nine from `024d`); each route imports its template's layout, and `home`'s route is `(site)/+page.svelte` with none (decision 2); `HEAVY` and `LIVE_HIGHLIGHT` name only component pages in `SITEMAP`, and no page is in both. Fails today: no module. (unit)
2. **Budgets are derived and ruled.** The same file: each template's budgets equal decision 4's arithmetic on its recorded figures; each has a non-empty `ruling`, for a rise or a fall; `component`'s transfer budget is at most 500 kB; `ci` is `null` or a figure with a CI margin of at least 20%. A hand-typed budget that disagrees with its figures fails. (unit)
3. **Transfer, every page.** `perf.spec.ts`, `024 transfer: <template>`, one per template. Seen failing two ways. (a) Today's defect: with `component` set to Button's 380 kB, it fails and names every heavier page (INFERRED: at least six). (b) Mutations, sized from the recorded budgets. An incompressible string whose gzipped size is the largest headroom of `component`, `component-live` and `component-heavy`, plus 10 kB, added to `component.svelte`, fails all three, naming their pages. A string of that page's headroom plus 10 kB, added to one ordinary page, fails `component`, naming that page alone. The landing notes print each size. Each mutation is reverted. (e2e, perf)
4. **Bytes and the throttle.** On every probe page, every `LIVE_HIGHLIGHT` page included, the throttled transfer median is compared with the unthrottled figure. On a page without `.wasm`, they agree within 2 kB; if they do not, the transfer sweep is throttled instead, and the landing notes give the new run time. On a live page the throttled figure may be lower, if `networkidle` fires before the grammar is asked for; the unthrottled figure is then the budget's, and the landing notes record both. (e2e, perf)
5. **Paint, the probes.** `024 paint: <template>: <page>`. Seen failing by setting one template's `local` LCP figure to 500 ms, then restored. Each paint test carries its `lcp` annotation. (e2e, perf)
6. **CI without a runner figure.** With `CI=1` and `ci: null`, the paint test passes, carries both annotations, and still fails on a CLS or transfer over budget. With a `ci` figure set, LCP gates. A unit test covers the choice (`lcpBudget(template, env)`); the e2e run shows the annotations. (unit; e2e)
7. **`.wasm`.** A page outside `LIVE_HIGHLIGHT` that fetches a `.wasm` file, in any frame, fails its template's transfer test. Seen failing by removing `code-editor` from the list. The server sends `.wasm` with `content-encoding: gzip`. (e2e, perf)
8. **The sweep.** `PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps` measures every page 3 times, one test per page, writes `test-results/perf-sweep.json` with each run, and fails on any page over any budget. Its figures are the landing notes' table: every page, its template, its medians. (e2e, perf)
9. **The old budgets are gone.** `perf.spec.ts` has no per-page budget. `/components/button/` is a `component` probe. (unit, reads the file)
10. **The suites.** Unit, `check`, `lint`, e2e with `perf`, and smoke pass. The landing notes record the time of the `perf` project's own tests (`--project=perf --no-deps`), before and after. The target is under 8 minutes on the release machine. (all)
11. **The scorecard.** `scripts/bench/` is re-run per `roadmap.md` §4 (`pluto.ts`, and `site.ts --only pluto`). Row 8 stays at 4. The change review cites the run log row.

## Files

| File | Change |
|---|---|
| `tests/e2e/budgets.ts` | New. `TEMPLATES` (figures, probes, ruling), `MARGIN`, `HEAVY`, `LIVE_HIGHLIGHT`, `templateOf()`, `budgetOf()`, `lcpBudget()`. Imports `sitemap.ts`, never `@playwright/test`, so the unit suite can import it |
| `tests/e2e/perf.spec.ts` | The two old budget blocks go. The transfer tests, the paint tests and the sweep join. `measure()` gains `throttle` and the per-response list. The server gzips `.wasm` |
| `tests/unit/budgets.test.ts` | New (criteria 1, 2, 6 and 9) |

Nothing else. Not `playwright.config.ts` (lane E, `022`'s), not `sitemap.ts`, not any route.

**Lanes.** The roadmap gives `024` lane S, perf only. Its files are tests alone. `022` moves the `test` import of every spec file, `perf.spec.ts` included. Whichever lands second takes the other's import line. That is the one overlap.

**At landing, `context/` only:** this spec's landing notes (every page's figures, the rulings, the `HEAVY` and `LIVE_HIGHLIGHT` lists, the reversal of `015` decision 23's "carry no budget", the host's `.wasm` compression); `roadmap.md`, row `024`'s kind and decision 4's line in §4; the scorecard's run log.

## The build, in order

1. Write criteria 1, 2, 6 and 9's unit tests and `budgets.ts`'s types. See them fail.
2. Gzip `.wasm` in the server. Write the transfer sweep and `PERF_SWEEP`. Run the full sweep on the release machine, with `--no-deps`. Record every page.
3. **Checkpoint.** The design lead rules, in this order: `LIVE_HIGHLIGHT`; then `HEAVY`; then the probes, every figure, and every rise in decision 9's list as the sweep gives it. `030`'s stated cost is compared with `component`'s real headroom. The owner's answers to Q1 to Q3 apply. The landing notes record each.
4. Fill `budgets.ts`. Run criterion 3(a) against Button's old figure, then the mutations of 3(b), 5 and 7. See each fail, then revert.
5. Remove the old budgets. Run every suite. Record the times.
6. Re-run the scorecard. Hand to the change review.
7. **After `022`'s first three green runs** (decision 8): the runner's LCP figures, their spread and the CI margin, with a ruling. When this happens is Q4.

## Risks

- **The sweep may change the picture.** The live and heavy lists, the slowest pages and every INFERRED range above come from a static estimate. A page may fetch far more at run time than its HTML names. The checkpoint exists for this.
- **The changelog grows every release.** Its HTML is already 39 kB gzipped. `leaf`'s budget will need re-ruling every few releases. A split changelog would end that; it is not this spec's.
- **The probes may not be the slowest pages on CI.** They are picked on the release machine. The sweep before each tag is the backstop.
- **Small templates are loose for their lighter members.** `component-heavy` holds about two pages. `025`'s per-item budgets cover what each item costs an app; this budget covers the page.
- **The runner's noise is unknown until it is measured.** Three runs give three samples. A margin from them may prove too small; decision 8's remedy is a re-base, not a retry.
- **The perf project gets slower,** from about 1.5 minutes to about 6.5 (INFERRED). Criterion 10 measures it.

## Open questions for the owner

Recommended option first. Each answer goes in the landing notes.

**Q1. What do the heavy component pages get?** The theme item's page is 573 to 617 kB (INFERRED). One budget from it would allow 635 to 680 kB on every component page. The live-highlight pages have their own template either way (decision 5).
1. **A `component-heavy` template, for pages listed by ruling** (decision 3). `component` stays at or under 500 kB, as a guard for Button's row 8 band. Button's budget rises from 380 to 430 to 480 kB, known at the checkpoint.
2. **One component budget, from the heaviest non-live page plus the margin,** 635 to 680 kB. Simplest, and nearest the roadmap's words. It gives up the 500 kB guard and most of the regression signal.
3. **Slim the heavy pages first,** each as a small change, so one budget fits. Their cost is unknown, and it delays `030`.

**Q2. What margins?**
1. **Transfer +10%; LCP +10% on the release machine, and on CI the measured spread, never under 20% (decision 8); CLS max(× 1.2, 0.02).** `018`'s ruling for the index used +10% (READ, `perf.spec.ts`), and the scorecard reports runs within 10% in LCP. The checkpoint widens any template whose sweep shows a spread over 10%.
2. **+20% everywhere,** `015` and `017`'s rule. More headroom, and less signal.
3. **A fixed headroom in kB per template,** such as 40 kB. A change's stated cost is then compared with a known number. It suits small templates badly.

**Q3. How often is each page measured?**
1. **Transfer on every page every run, unthrottled; paint on probe pages every run; the full throttled sweep at re-base and before each tag** (decision 6). About 6.5 minutes of `perf` tests a run.
2. **Probe pages only every run; every page only in the sweep.** About 3 minutes a run, but a heavy new page can land unseen until the tag.
3. **Every page under the full profile every run.** About 31 minutes a run.

**Q4. When are the runner's LCP figures set?** Your answer to `022` Q1 settles that they are set, and that LCP then gates. This asks only when.
1. **After `024` lands.** CI reports LCP until `022`'s first three green runs, then the re-base is `024`'s second checkpoint, in its own landing notes. `030` waits only for the transfer budgets, which gate at once.
2. **Before `024` lands.** `024` waits for `022`'s first green runs. `030` waits with it.

**Q5. Does the 404 get a budget?**
1. **No.** It is not in the sitemap and holds no example.
2. **Yes, as a `leaf` page,** measured at `/404.html`.

## Review

The spec review, [`../reviews/024-budgets-per-template-spec-2026-11-15.md`](../reviews/024-budgets-per-template-spec-2026-11-15.md), approved with changes. Each finding, and what changed:

1. **Accepted (High). `.wasm` raw.** The server gzips `.wasm`, as `025` does; no figure moves (decision 7). The live pages get their own template, `component-live`, ruled before `HEAVY` (decisions 1, 3, 5). `code-languages` is named a likely member. `component-heavy` is restated at 635 to 680 kB, and `component-live` given at 680 to 730 kB (decision 9). The landing checks the host's compression.
2. **Accepted (Medium). `--no-deps` and timeouts.** Every perf command has `--no-deps` (decisions 4, 6; criteria 8, 10). Each test's timeout is stated, the sweep is one test per page, and the timings are corrected: about 6.5 minutes a run, about 31 for the sweep (decision 6).
3. **Accepted (Medium). The CI record and margin.** Every paint test writes an `lcp` annotation, which `report.json` keeps; the re-base reads it. The spread is recorded, and the CI margin is the largest spread, never under 20%. One retry does not excuse a slow first try (decision 8; criteria 2, 5, 6).
4. **Accepted (Medium). One offset.** Every INFERRED figure is a range, static + 82 to + 126, a floor for pages with lazy loads (research; decision 9). Button's headroom, Q1's figures and `030`'s fit are known only at the checkpoint (decision 4; build step 3).
5. **Accepted (Low). `022` Q1 is answered.** Cited in "Coordinates with" and decision 8. Q4's option 3 is dropped; Q4 is timing only. The window before 024 is stated.
6. **Accepted (Low). The mapping.** Each template has an exact rule, `home`'s included (no shared layout). "No door below `/`" is `door === null && path !== "/"`. The route file's path is stated. The upgrade guide is `leaf`; if its route does not use `leaf.svelte`, that is a small change in `020`'s lane (decision 2).
7. **Accepted (Low). Rises and falls.** Every rise is listed for the checkpoint, code-block's transfer and the Button and code-block LCPs included. A fall's `ruling` names the re-base's landing note, and criterion 2 accepts it (decisions 4, 9).
8. **Accepted (Low). The rule's home.** Decision 4 gives the exact line for `roadmap.md` §4, added at landing.
9. **Accepted (Low). The mutation's size.** Criterion 3(b) sizes each mutation from the recorded headroom plus 10 kB, gzipped, and prints it.
10. **Accepted (Low). Row 8.** Restated: Button alone, through `site.ts`, with transfer ≤ 500 kB and LCP ≤ 1.5 s. The 500 kB cap is a policy guard; criterion 11 is the check (research; decisions 3, 9).
11. **Accepted (Low). The small-change reason.** "Not a small change" now gives the real reasons: owner answers and checkpoint rulings, a rule for later specs, and five ruled budgets replaced.
12. **Accepted (Low). The throttle and `networkidle`.** Criterion 4 covers the live pages, and every live page is a probe. Where the figures differ, the unthrottled one is the budget's (decision 6; criterion 4).
13. **Accepted (Low). Write-ins.** (a) The prior art is READ (review), with the two sources; INFERRED only for resolving several patterns. (b) Decision 5 says `.wasm` requests are counted in every frame and bytes in the main frame only. (c) Decision 5 says it reverses `015` decision 23's "carry no budget", and the landing notes record it.

## Landing notes

**The owner's answers (the owner, 2026-11-15).** The owner accepted the recommended option for every question:

- **Q1:** heavy component pages get a `component-heavy` template listed by ruling, and pages that highlight code live get `component-live`. `component` stays capped at 500 kB.
- **Q2:** transfer +10%. LCP +10% locally; on CI, the observed spread, never under 20%. CLS max(× 1.2, 0.02).
- **Q3:** every run checks transfer on every page and paint on the probe pages (about 6.5 minutes). The full throttled sweep (about 31 minutes) runs at re-base and before each tag.
- **Q4:** CI's LCP figures are set after `024` lands, from `022`'s first three green runs. `030` waits only on transfer.
- **Q5:** the 404 page carries no budget.

The owner was told that Button's transfer budget rises from 380 kB to about 430–480 kB at the checkpoint. It rose to 445 kB (ruling 6 below).

### The build

- **Built** 2026-11-16 by a builder, in its own worktree, on `release/0.13.0` at `874c5da` (after `020a`, `020b` and `027a`), and committed on the build branch as "024: budgets per template" (commit in the report). Not yet change-reviewed. **The checkpoint (build step 3) was not walked by the design lead:** the owner and the design lead were away, and the owner had delegated the decisions. The builder ruled each item below as the spec orders it, and records every ruling, so the design lead can confirm or overturn it before the landing. That is the first thing to do.
- **What was built.** Exactly the spec's three files.
  - `tests/e2e/budgets.ts` (new): `TEMPLATE_IDS`, `TEMPLATES` (figures, `ci`, probes, layouts, ruling), `MARGIN`, `LIVE_HIGHLIGHT`, `HEAVY`, `templatesMatching()`, `templateOf()`, `pagesOf()`, `budgetOf()`, `lcpBudget()`. It imports `sitemap.ts` and never `@playwright/test`.
  - `tests/e2e/perf.spec.ts` (rewritten): `BUDGETS` and `COLOUR_BUDGET` are gone. One `024 transfer: <template>` test per template, one `024 paint: <template>: <page>` test per probe, and under `PERF_SWEEP=1` one `024 sweep: <template>: <page>` test per page, writing `test-results/perf-sweep.json`. `measure()` gained `throttle` and the per-response list. The server gzips `application/wasm`; a test (`024 decision 7`) checks the header.
  - `tests/unit/budgets.test.ts` (new): criteria 1, 2, 6 and 9, 50 tests.
  - Nothing else in code. Not `playwright.config.ts`, not `sitemap.ts`, not any route. No edit is needed in `022`'s config: the perf project's `testMatch` already takes the file.

### Tests first, each seen failing

- **Step 1, the unit file before its module** (criteria 1, 2, 6, 9): `bun test tests/unit/budgets.test.ts` failed to load, "Cannot find module '../e2e/budgets.ts'": 0 pass, 1 fail, 1 error. With `budgets.ts` holding its types and functions that throw: **42 tests, 3 pass, 39 fail.** The 3 that passed hold vacuously on a stub: the two list checks over the empty `HEAVY` and `LIVE_HIGHLIGHT`, and "budgets.ts never imports `@playwright/test`". Criterion 9's two file checks failed against the old `perf.spec.ts`, which still held `BUDGETS`. The file grew to 50 tests at the checkpoint (the widened LCP margin, and the CLS page as a probe; deviations 2 and 3).
- **Criterion 3 (a), today's defect.** `component` set to Button's old budget, 380 kB (a median of 345), with `HEAVY` and `LIVE_HIGHLIGHT` empty: `024 transfer: component` **failed, naming seven pages** (the spec inferred at least six): `kuiper-theme` 760 kB, `code-editor` 655.8, `code-languages` 653.6, `highlighter` 542, `chart` 479.9, `use-highlighted-code` 439.3, `sidebar` 403.8. `dropdown-menu` (375.4) is not among them: Button now measures 374.2, and the static estimate's ranking of the two was within its error.
- **Criterion 3 (b), two mutations, each built and reverted.** Each string is base64 of random bytes, inserted as a hidden element; the sizes are its own gzipped bytes (level 6).
  1. **In `component.svelte`: 92,575 B gzipped (90.4 kB; 122,180 characters).** The largest template headroom of the three is `component-live`'s, 840 − 760 = 80 kB (`component` 41.2, `component-heavy` 50.1), plus 10. All three tests failed: `component` named 68 of its 68 pages (the lightest then at 508.5 kB), `component-live` 1 of 9 (`kuiper-theme`, 943 kB), `component-heavy` 1 of 1 (`chart`, 662.3 kB). **Corrected at landing (the change review's finding 7):** the mutation counted about 182 kB, not 90.4. The string sat in `component.svelte`'s markup, so it shipped twice, in the prerendered HTML and in the component's JS: every page grew by about 2 × 90.4 kB (the lightest 325.6 → 508.5, `chart` 479.9 → 662.3, the theme page 760 → 943). That is why every `component` page failed. It still shows that a template-wide addition fails all three templates; it does not show the budgets tight to 10 kB. Mutation 2 does that for Button exactly.
  2. **In Button's route: 83,121 B gzipped (81.2 kB; 109,692 characters).** Button's headroom is 445 − 374.2 = 70.8 kB, plus 10. `component` failed, naming Button alone, at 455.3 kB. The string reached the route's JS chunk, not its HTML (the page renders its snippets, not loose children), and still counted once.
- **Criterion 5.** `home`'s local LCP figure set to 500 ms (budget 550): `024 paint: home: /` failed, "LCP (local), expected ≤ 550, received 784". Restored.
- **Criterion 6, e2e.** With `CI=1` and `ci: null`, `024 paint: home: /` passed and carried both annotations, read from the JSON reporter: `lcp` `{"page":"/","template":"home","runs":[780,784,780],"median":780,"budget":null,"gated":false}` and `lcp-not-gated` "LCP reported, not gated: no runner figure (024 decision 8)". With `CI=1` and `home`'s transfer figure set to 250 kB (budget 275), it failed on transfer (300.8 kB). With `CI=1` and a runner figure of 500 ms at a 20% margin, LCP gated at 600 ms and the test failed (792 ms). Each restored. The unit half is four tests.
- **Criterion 7.** `code-editor` and `live-console` taken out of `LIVE_HIGHLIGHT`: `024 transfer: component` failed, its `.wasm` list naming both ("2 .wasm, not in LIVE_HIGHLIGHT"). `live-console` fetches its `.wasm` only in its example frames, so the rule is seen to count every frame. Restored. The server's `content-encoding: gzip` on `.wasm` is checked by `024 decision 7` on every run.
- After the last mutation, `git status` showed only this spec's three files, and the site was rebuilt clean before the gate runs.

### The sweep (criterion 8)

`PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps` (on a scratch config without the web server, against a build of this tree), 2026-11-15 23:48 to 2026-11-16 00:16 EST: **27.7 minutes, 106 pages, 3 throttled loads each and one unthrottled.** The machine's load average rose from 25 to 102 on 10 cores during it (other agents' builds). 102 passed and 5 failed against the provisional budgets the build carried before the checkpoint (`kuiper-theme` LCP, `label` and `native-select` CLS, `sidebar` and `/changelog/` transfer); the figures below set the real ones. Each page's medians and its three LCP runs:

| Page | Template | Transfer, kB | LCP, ms (3 runs) | CLS | `.wasm` |
|---|---|---|---|---|---|
| `/` | home | 300.8 | 780 (780, 780, 788) | 0.005 | 0 |
| `/components/` | index | 349.5 | 2472 (2472, 2412, 2488) | 0 | 0 |
| `/start/` | landing | 300.7 | 840 (832, 844, 840) | 0 | 0 |
| `/brand/` | landing | 286.4 | 944 (964, 844, 944) | 0 | 0 |
| `/foundations/` | landing | 282.4 | 828 (832, 828, 816) | 0 | 0 |
| `/components/sidebar/` | component | 403.8 | 1104 (1168, 1104, 1088) | 0 | 0 |
| `/components/dropdown-menu/` | component | 375.4 | 948 (944, 948, 976) | 0 | 0 |
| `/components/button/` | component | 374.2 | 924 (924, 912, 932) | 0 | 0 |
| `/components/field/` | component | 369.2 | 1028 (1028, 1028, 1032) | 0 | 0 |
| `/components/button-group/` | component | 369.1 | 920 (912, 992, 920) | 0 | 0 |
| `/components/theme/` | component | 360.3 | 924 (916, 932, 924) | 0 | 0 |
| `/components/breadcrumb/` | component | 359.2 | 892 (900, 892, 888) | 0.003 | 0 |
| `/components/composer/` | component | 357.8 | 956 (992, 956, 952) | 0 | 0 |
| `/components/popover/` | component | 356.7 | 900 (924, 900, 900) | 0 | 0 |
| `/components/tooltip/` | component | 352.4 | 896 (900, 892, 896) | 0 | 0 |
| `/components/message-log/` | component | 351.1 | 940 (940, 940, 936) | 0 | 0 |
| `/components/error-summary/` | component | 350.5 | 920 (872, 920, 960) | 0 | 0 |
| `/components/input-otp/` | component | 348.6 | 924 (900, 952, 924) | 0 | 0 |
| `/components/app-shell/` | component | 348.6 | 1052 (1056, 1052, 1020) | 0 | 0 |
| `/components/code-block/` | component | 348 | 984 (948, 988, 984) | 0.003 | 0 |
| `/components/input-group/` | component | 345.2 | 972 (912, 972, 972) | 0 | 0 |
| `/components/progress/` | component | 344.5 | 936 (936, 944, 928) | 0 | 0 |
| `/components/radio-group/` | component | 344.1 | 936 (912, 936, 952) | 0 | 0 |
| `/components/toggle-group/` | component | 343.6 | 924 (924, 924, 928) | 0 | 0 |
| `/components/sheet/` | component | 343.4 | 940 (948, 936, 940) | 0 | 0 |
| `/components/dialog/` | component | 342.4 | 924 (924, 948, 924) | 0 | 0 |
| `/components/native-select/` | component | 341.5 | 872 (872, 884, 860) | 0.087 | 0 |
| `/components/alert/` | component | 341.1 | 912 (904, 912, 916) | 0 | 0 |
| `/components/checkbox/` | component | 340.9 | 896 (896, 892, 900) | 0 | 0 |
| `/components/accordion/` | component | 340.5 | 924 (924, 924, 952) | 0 | 0 |
| `/components/read-token/` | component | 339.8 | 960 (940, 968, 960) | 0.005 | 0 |
| `/components/link/` | component | 339.8 | 908 (928, 900, 908) | 0 | 0 |
| `/components/switch/` | component | 339.3 | 888 (892, 884, 888) | 0 | 0 |
| `/components/item/` | component | 338.4 | 924 (920, 924, 940) | 0 | 0 |
| `/components/input/` | component | 337.7 | 908 (852, 912, 908) | 0 | 0 |
| `/components/table/` | component | 337.4 | 896 (880, 896, 900) | 0 | 0 |
| `/components/four-dot/` | component | 337.2 | 952 (952, 920, 968) | 0 | 0 |
| `/components/sign-up/` | component | 337.1 | 928 (928, 928, 956) | 0 | 0 |
| `/components/textarea/` | component | 336.7 | 892 (932, 876, 892) | 0 | 0 |
| `/components/alert-dialog/` | component | 336.2 | 884 (884, 904, 872) | 0 | 0 |
| `/components/chat/` | component | 335.9 | 916 (932, 908, 916) | 0 | 0 |
| `/components/settings/` | component | 335.2 | 928 (928, 924, 952) | 0 | 0 |
| `/components/tabs/` | component | 334 | 896 (896, 916, 884) | 0.004 | 0 |
| `/components/meter/` | component | 334 | 900 (908, 900, 856) | 0 | 0 |
| `/components/label/` | component | 333.6 | 884 (892, 884, 868) | 0.09 | 0 |
| `/components/toggle/` | component | 333.4 | 880 (928, 860, 880) | 0.004 | 0 |
| `/components/message/` | component | 333.3 | 888 (888, 884, 932) | 0 | 0 |
| `/components/page-states/` | component | 332.5 | 916 (924, 904, 916) | 0 | 0 |
| `/components/badge/` | component | 331.9 | 864 (864, 844, 904) | 0 | 0 |
| `/components/collapsible/` | component | 331.7 | 892 (904, 872, 892) | 0 | 0 |
| `/components/sign-in/` | component | 331.7 | 888 (944, 868, 888) | 0 | 0 |
| `/components/marker/` | component | 331.2 | 880 (872, 880, 884) | 0 | 0 |
| `/components/card/` | component | 331.1 | 880 (840, 896, 880) | 0 | 0 |
| `/components/hero/` | component | 330 | 884 (868, 888, 884) | 0 | 0 |
| `/components/empty/` | component | 329.8 | 884 (884, 956, 868) | 0.018 | 0 |
| `/components/avatar/` | component | 329.2 | 884 (868, 884, 916) | 0 | 0 |
| `/components/status/` | component | 328.9 | 884 (884, 892, 848) | 0 | 0 |
| `/components/liquid-glass/` | component | 328.5 | 884 (880, 884, 896) | 0 | 0 |
| `/components/separator/` | component | 328.2 | 880 (880, 868, 892) | 0 | 0 |
| `/components/marketing-bar/` | component | 327.8 | 876 (872, 876, 880) | 0 | 0 |
| `/components/utils/` | component | 327.6 | 872 (872, 868, 872) | 0 | 0 |
| `/components/stage/` | component | 327.4 | 900 (900, 924, 868) | 0 | 0 |
| `/components/spinner/` | component | 327 | 868 (900, 864, 868) | 0.004 | 0 |
| `/components/kbd/` | component | 326.9 | 884 (908, 884, 880) | 0 | 0 |
| `/components/marketing-footer/` | component | 326.9 | 880 (880, 936, 844) | 0 | 0 |
| `/components/proof-band/` | component | 326.8 | 896 (896, 892, 932) | 0 | 0 |
| `/components/is-mobile/` | component | 326.3 | 876 (880, 868, 876) | 0 | 0 |
| `/components/cta-band/` | component | 326.3 | 896 (900, 896, 896) | 0 | 0 |
| `/components/name-strip/` | component | 326.2 | 884 (884, 888, 880) | 0 | 0 |
| `/components/font-heading-ibm-plex-sans/` | component | 326 | 864 (864, 852, 868) | 0.005 | 0 |
| `/components/skeleton/` | component | 326 | 864 (852, 864, 884) | 0 | 0 |
| `/components/font-jetbrains-mono/` | component | 325.7 | 864 (872, 856, 864) | 0.004 | 0 |
| `/components/font-geist/` | component | 325.6 | 876 (880, 864, 876) | 0 | 0 |
| `/components/kuiper-theme/` | component-live | 760 | 1352 (1376, 1316, 1352) | 0.004 | 2 |
| `/components/code-editor/` | component-live | 655.8 | 912 (912, 904, 916) | 0.003 | 2 |
| `/components/code-languages/` | component-live | 653.6 | 904 (928, 904, 888) | 0 | 2 |
| `/components/highlighter/` | component-live | 542 | 1140 (1116, 1140, 1164) | 0 | 2 |
| `/components/use-highlighted-code/` | component-live | 439.3 | 932 (964, 904, 932) | 0 | 2 |
| `/components/product-home/` | component-live | 331.4 | 924 (928, 924, 924) | 0 | 3 |
| `/components/stage-hero/` | component-live | 328 | 900 (900, 896, 908) | 0 | 2 |
| `/components/stage-card/` | component-live | 327.6 | 928 (880, 936, 928) | 0 | 3 |
| `/components/live-console/` | component-live | 327.3 | 892 (912, 892, 892) | 0 | 2 |
| `/components/chart/` | component-heavy | 479.9 | 912 (884, 912, 928) | 0 | 0 |
| `/changelog/` | leaf | 332.3 | 1008 (1008, 996, 1052) | 0.001 | 0 |
| `/changelog/0.13.0/upgrade/` | leaf | 317.6 | 812 (776, 832, 812) | 0 | 0 |
| `/foundations/code/` | leaf | 315.2 | 808 (832, 796, 808) | 0 | 0 |
| `/start/install/` | leaf | 313.9 | 800 (800, 808, 788) | 0 | 0 |
| `/start/light-and-dark/` | leaf | 310.3 | 788 (788, 776, 792) | 0 | 0 |
| `/start/your-product/` | leaf | 310.3 | 780 (788, 780, 776) | 0 | 0 |
| `/foundations/tokens/` | leaf | 308.1 | 860 (864, 856, 860) | 0.001 | 0 |
| `/foundations/colour/` | leaf | 305.7 | 876 (876, 888, 848) | 0 | 0 |
| `/foundations/type/` | leaf | 299.3 | 820 (820, 836, 772) | 0 | 0 |
| `/foundations/motion/` | leaf | 296.2 | 768 (768, 792, 764) | 0 | 0 |
| `/start/theme/` | leaf | 295.4 | 772 (772, 776, 756) | 0.001 | 0 |
| `/foundations/space-and-shape/` | leaf | 295.3 | 792 (760, 832, 792) | 0 | 0 |
| `/start/modes/` | leaf | 294.9 | 772 (768, 772, 792) | 0 | 0 |
| `/foundations/accessibility/` | leaf | 294.4 | 772 (772, 772, 768) | 0 | 0 |
| `/brand/downloads/` | brand | 299.6 | 776 (776, 760, 776) | 0 | 0 |
| `/brand/mark/` | brand | 299.1 | 772 (772, 748, 812) | 0 | 0 |
| `/brand/imagery/` | brand | 297.4 | 780 (772, 780, 888) | 0.012 | 0 |
| `/brand/type/` | brand | 297.3 | 788 (796, 768, 788) | 0 | 0 |
| `/brand/colour/` | brand | 296.1 | 780 (780, 768, 780) | 0.001 | 0 |
| `/brand/surfaces/` | brand | 295.6 | 776 (776, 776, 760) | 0 | 0 |
| `/brand/motion/` | brand | 294.6 | 776 (776, 780, 760) | 0 | 0 |
| `/brand/voice/` | brand | 294.3 | 772 (780, 772, 772) | 0 | 0 |
| `/brand/products/` | brand | 293.9 | 768 (772, 764, 768) | 0 | 0 |

**Criterion 4, bytes and the throttle.** On the builder's two sweeps, the throttled median equalled the unthrottled figure to 0.1 kB on all 106 pages, the live pages included. **Corrected at landing (the change review's finding 2): that held on these runs, not on every run.** On the reviewer's run, `/components/kuiper-theme/` read 607 kB with 0 `.wasm` in all three throttled loads, against 760 kB with 2 unthrottled: `networkidle` fired before the editor asked for its highlighter. On this machine the theme page splits both ways. Its LCP (1,352 ms, the `component-live` figure) was measured with tree-sitter in the build sweep, and without it on the reviewer's run. So transfer gates on the unthrottled load everywhere, in the sweep too, and the sweep makes the paint test's throttle comparison (2 kB, or for a live page, never higher than unthrottled). A paint or sweep test whose live page reads lower throttled adds a `throttled-lower` annotation, so a report shows it.

### The checkpoint's rulings

Ruled by the builder under the owner's delegation (2026-11-16), in the spec's order. The design lead confirms or overturns each.

1. **`LIVE_HIGHLIGHT`: nine pages, not the three inferred.** *Replaced at landing: split into `WASM_ALLOWED` (nine) and `LIVE_HIGHLIGHT` (five), see "Rulings at landing" 1.* The sweep found nine pages that fetch `.wasm` on load, each two files (`web-tree-sitter.wasm` and the Python grammar; `stage-card` and `product-home` three):
   - the four whose item highlights: `code-editor`, `code-languages`, `use-highlighted-code`, and **`highlighter`**, which fetches both files on load (the spec inferred that it waits for a button press);
   - **`live-console`**, whose job is streaming code through the highlighter, and **`stage-card`, `stage-hero`, `product-home`**, which hold a live console. These four fetch `.wasm` in their example frames only; their main frames are 327 to 331 kB;
   - **`kuiper-theme`**, whose "An ink surface" example mounts a `CodeEditor` to show the editor's ground on the surface.
   Each highlights code live on load, which is decision 5's test. Leaving any out would fail the build on code outside this lane. Decision 5's "as today" was written knowing only the five budgeted pages, which fetch none.
2. **`HEAVY`: `chart` alone.** With the live list ruled first, `chart` is the only page left whose median × 1.1 passes 500 kB (479.9 → 527.9). The theme page, the heaviest by far (760 kB), is a live page.
3. **The probes: 20 pages** (16 after the split at landing: `component-live` probes its five). Each template's heaviest and slowest page; Button; every live page; and `label`, whose CLS sets `component`'s (deviation 3). `home` `/`; `index` `/components/`; `landing` `/start/`, `/brand/`; `component` `sidebar`, `button`, `label`; `component-live` its nine; `component-heavy` `chart`; `leaf` `/changelog/`; `brand` `/brand/downloads/`, `/brand/type/`.
4. **The figures and budgets.** Q2's margins. Q2 also says the checkpoint widens a template whose sweep spread passes 10%: `landing` (14.2%, `/brand/`), `component` (10.9%, `marketing-footer`) and `brand` (15.03%, `imagery`) take a wider local LCP margin, the spread rounded up to 5%: 15%, 15% and, **corrected at landing (the change review's finding 6), 20% for `brand`**, not the 15% first written.

   | Template | Pages | Heaviest page | Measured | Transfer budget | Headroom | Slowest page, LCP | LCP margin | LCP budget | Worst CLS | CLS budget |
   |---|---|---|---|---|---|---|---|---|---|---|
   | `home` | 1 | `/` | 300.8 kB | **335 kB** | 34.2 | `/`, 780 ms | 10% | **860 ms** | 0.005 | 0.02 |
   | `index` | 1 | `/components/` | 349.5 | **385** | 35.5 | `/components/`, 2,472 | 10% | **2,720** | 0 | 0.02 |
   | `landing` | 3 | `/start/` | 300.7 | **335** | 34.3 | `/brand/`, 944 | 15% | **1,090** | 0 | 0.02 |
   | `component` | 68 | `sidebar` | 403.8 | **445** | 41.2 (Button 70.8) | `sidebar`, 1,104 | 15% | **1,270** | 0.09 (`label`) | **0.108** |
   | `component-live` | 9 | `kuiper-theme` | 760 | **840** | 80.0 | `kuiper-theme`, 1,352 | 10% | **1,490** | 0.004 | 0.02 |
   | `component-heavy` | 1 | `chart` | 479.9 | **530** | 50.1 | `chart`, 912 | 10% | **1,010** | 0 | 0.02 |
   | `leaf` | 14 | `/changelog/` | 332.3 | **370** | 37.7 | `/changelog/`, 1,008 | 10% | **1,110** | 0.001 | 0.02 |
   | `brand` | 9 | `/brand/downloads/` | 299.6 | **330** | 30.4 | `/brand/type/`, 788 | 20% | **950** | 0.012 | 0.02 |

   `component`'s transfer budget is under the 500 kB cap. Every `ci` figure is `null` until the re-base (Q4).
5. **`component`'s CLS is 0.108** (above Core Web Vitals' 0.1 "good" line; accepted until `024c`, "Rulings at landing" 3), from `label` (0.09 in all three runs; `native-select` 0.087). It is decision 4's arithmetic on the worst page. It is also a real shift, so it is a finding (below), and the figure falls to the floor at the re-base after its fix.
6. **Every rise** (each a page with a budget before):

   | Page | Figure | Before | After |
   |---|---|---|---|
   | `/components/button/` | transfer | 382 kB (`020`'s ruling) | 445 kB |
   | `/components/code-block/` | transfer | 360 kB | 445 kB |
   | `/components/button/` | LCP, local | 1,157 ms | 1,270 ms |
   | `/components/code-block/` | LCP, local | 1,186 ms | 1,270 ms |
   | `/components/button/`, `/components/code-block/` | CLS | 0.02 | 0.108 |

   **The falls,** which need no ruling: `/` transfer 355 → 335 kB, LCP 1,027 → 860 ms; `/components/` transfer 395 → 385 kB, LCP 2,988 → 2,720 ms (decision 9 expected a rise; this machine measured it faster); `/brand/colour/` transfer 347 → 330 kB, LCP 984 → 950 ms.
7. **`030`'s stated cost fits.** `030` decision 14 states 2.6 to 2.8 kB per component page. Button has 70.8 kB of headroom; the tightest `component` page, `sidebar`, 41.2. `026`'s toast (about 0.6 kB on every page) fits every template; the tightest is `brand`, 30.4 kB.

**This reverses `015` decision 23**, which said the live-highlighting pages "carry no budget". From `024` they carry `component-live`'s.

**The host.** Cloudflare compresses `application/wasm` by default, with Zstandard, Brotli or gzip by plan (READ, developers.cloudflare.com/speed/optimization/content/compression/, 2026-11-16). So the harness's gzip figure is the wire figure or above it.

### Deviations, each with its reason

1. **Nine live pages, so `component-live` is loose for its lighter members** (ruling 1). *Overturned in part at landing: the four live-console pages join `component` ("Rulings at landing" 1).* The four live-console pages sit near 330 kB under an 840 kB budget, and `use-highlighted-code` at 439. The spec's Risks accept this for small templates. If the theme page stops fetching tree-sitter (finding 3), `component-live`'s budget falls to about 725 kB at the next re-base.
2. **A local LCP margin per template** (`figures.lcp.margin`). Q2 widens a template whose spread passes 10%, and a constant could not hold that. `MARGIN.lcp` stays 10%, the default and the floor. The unit test checks each margin is at least 10% and a multiple of 5%, and the arithmetic uses it.
3. **The CLS figure's page is a probe** when it sets the budget above the 0.02 floor (`label`). The spec's probes are the heaviest and slowest pages, which would leave the one page that sets `component`'s CLS unchecked between sweeps. A unit test requires it.
4. **A failure lists each page's six largest files,** not "the files that grew". The harness keeps no per-file baseline to compare with.
5. **Under `PERF_SWEEP=1`, the sweep replaces the every-run tests** (it checks everything they check, on every page), and each sweep page also takes one unthrottled load, recorded in `perf-sweep.json`, so criterion 4 is answered for every page.
6. **No serial mode; soft expects.** The old file ran `mode: "serial"`, where one failure skips every later test. The project still runs in one worker, in order (`fullyParallel: false`). A failing template no longer hides the others, and a test reports transfer, CLS, LCP and `.wasm` together.
7. **A paint test reuses its probe's unthrottled figure** from the transfer test of the same run, and loads it only when run alone. It saved about a minute.
8. **Transfer is kept to 0.1 kB,** not whole kB, so a figure and its headroom are exact to the tenth.
9. **The spec's step 2 sweep ran on a scratch Playwright config without the web server,** to measure an already built tree without rebuilding it. The gate runs used the real command and config.

### Findings for other lanes

1. **A layout shift on two component pages (lane S, a small change).** `label` 0.09 and `native-select` 0.087, the same in every run; every other component page is at or under 0.018. Unthrottled, `native-select` shows one shift of 0.087 at 312 ms: the page-tools row and the section below move up 25.6 px, and one header line moves from x = 307 to x = 640, as if a header line wraps before hydration and not after. `label` shows none unthrottled, so it is timing-dependent. After the fix, the re-base lowers `component`'s CLS to the floor, without a ruling.
2. **`024b`** (queued): `registry.json` in the shared chunk adds about 0.6–0.9 kB to every page per new item. `024`'s headroom is measured with it; `024b`'s fall needs no ruling.
3. **The theme page fetches tree-sitter** (about 150 kB gzipped) for one example. Highlighting it on demand would move it out of `LIVE_HIGHLIGHT`, by ruling, with its measurement.
4. **`022`:** the one overlap is `perf.spec.ts`'s `test` import line; whichever lands second takes the other's. No project change is needed in `playwright.config.ts`. **Build step 7 is still open:** after `022`'s first three green runs, the runner's LCP figures, their spread and the CI margin go into each template's `ci`, with a ruling (Q4).

### The checks

2026-11-16, the machine at a load average of 9 to 102 on 10 cores, from other agents' builds.

- `bun run check`: 0 errors, 0 warnings (2,233 files). `bun run lint`: clean.
- `bun test tests/unit/budgets.test.ts`: **50 pass, 0 fail.**
- `bun run test:unit`: **1,333 pass, 8 fail, 1,343 tests across 41 files.** All 8 are timing tests under this load, in three files this spec does not touch: five thumbnail-hash tests (`thumbnails.test.ts`, 6.5 to 37 s against a 5 s limit), two tree-sitter query tests (`queries.test.ts`, 5.6 and 11.9 s), and `highlight-session.test.ts`'s 4 ms p95, flaky under load as the handoff records. Re-run alone with `--timeout 120000`: 28 of 28 pass.
- **The perf project, the real command and config:** `bun --bun playwright test --project=perf --no-deps`: **29 passed** (1 server check, 8 transfer tests over 106 pages, 20 paint tests), 7.9 minutes with the web server's build. **The project's own tests (criterion 10): 6.2 minutes** (371 s, the sum of the tests' durations), under the 8-minute target. Before, the old file's 5 tests took **1.0 minute** (63.7 s, on the same build). A first run without deviation 7's reuse took 8.0 minutes (482.6 s) on the scratch config.
- **The sweep, the real command and config:** `PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps`: **107 passed** (106 pages and the server check), 26.7 minutes with the build, load 12 to 52. Every page's transfer equals the first sweep's to 0.1 kB. Its LCP medians sit within −11.4% (`/brand/`, 836 against 944 ms) and +4.3% (`input-otp`, 964 against 924) of the first sweep's. Button: 374.2 kB, LCP 880 ms, CLS 0.
- `bun scripts/site/release-check.ts`: exits 0.
- **Not run:** the `light` and `dark` browser projects and the smoke suite. `024` changes no file they read: both projects ignore `perf.spec.ts` (`testIgnore: /perf/`), and `budgets.ts` is imported only by `perf.spec.ts` and the unit test.

### The scorecard (criterion 11)

Re-run per `roadmap.md` §4 on this build (run-log row of 2026-11-16 at `35c37e4`). `kuiper.ts --rev 35c37e4`: every count equals the base `874c5da`'s (`024` changes tests only). `site.ts --only kuiper`, 3 runs: Button **374 kB** (main frame 374), 87 requests, **LCP 888 ms**, CLS 0; the part at 572 (1440) and 661 (390), 79 nav links, search and theme present. **Row 8 holds at 4** (≤ 500 kB and ≤ 1.5 s), as decision 3's cap and `component`'s 1,270 ms LCP budget keep it. Rows 1 to 14 hold: 3 2 1 2 1 4 2 4 3 3 3 0 1 3, total 32. `breadth.ts` and `depth.ts` not run: no item and no page changed.

### Rulings at landing (2026-11-16)

The change review ([`../reviews/024-budgets-per-template-pr-2026-11-16.md`](../reviews/024-budgets-per-template-pr-2026-11-16.md)) said "land after fixes". The design lead ruled on it, confirming or replacing the builder's checkpoint rulings 1 to 5, and the builder applied the rest as the review wrote them, in the commit "024: the review's fixes".

1. **The list is split (finding 1; replaces ruling 1).**
   - `WASM_ALLOWED`, all nine pages, is for the `.wasm` check.
   - `LIVE_HIGHLIGHT`, the pages whose main frame loads tree-sitter, is for the template: `code-editor`, `code-languages`, `highlighter`, `use-highlighted-code`, `kuiper-theme`.
   - `live-console`, `stage-card`, `stage-hero` and `product-home` join `component`. They count no `.wasm` bytes (transfer is the main frame), so their 327 to 331 kB now has `component`'s 445 kB budget, not 840. No budget moves: `sidebar` (403.8 kB, 1,104 ms) still sets `component`'s transfer and LCP, and the four pages' LCP spreads are under 15% (the widest, `stage-card`, 6.4%). `kuiper-theme` still sets `component-live`'s.
   - A unit test requires `LIVE_HIGHLIGHT` within `WASM_ALLOWED`, and `HEAVY` outside it.
2. **`kuiper-theme` and `highlighter` are in `LIVE_HIGHLIGHT` pending `024d` and `024e` (finding 5).** Each loads tree-sitter because of a defect, not because its item needs it. The two small changes are written: [`024d`](./024d-the-theme-page-loads-no-editor.md) (the theme page's ink-surface `CodeEditor` mounts on load; the theme item's examples) and [`024e`](./024e-empty-code-loads-no-grammar.md) (`useHighlightedCode` loads its grammar for empty code; lane I). Their re-bases are falls and need no ruling. Where `kuiper-theme` then belongs (`HEAVY`, or a one-page template) is ruled with its measurement in `024d`.
3. **`component`'s CLS budget of 0.108 is accepted now (finding 4; confirms ruling 5).** It is **above Core Web Vitals' 0.1 "good" line**, so it is not a target. The shift is small change [`024c`](./024c-component-headers-hold-still.md) (the `label` and `native-select` headers re-wrap after hydration; lane S). `roadmap.md` §3 now says that `024b`, `024c`, `024d` and `024e`, then one re-base sweep, land before `030`; the 0.13.0 table has rows for `024c`, `024d` and `024e` beside `024b`.
4. **The tag waits for the runner's LCP figures (finding 3).** `scripts/site/release-check.ts` exits 1 while any template's `ci` is `null`, naming the templates and "024 build step 7". It is a CI-evidence check, so `--before-ci` skips it and names the skip, as `022`'s checks do. It uses the shape of `022`'s release check (a `Check` per step, `addressCheck`, `SKIPPED_BEFORE_CI`, the `import.meta.main` shell); **`022` has not landed, so its merge folds the two files together**: `ciLcpCheck` joins its CI-evidence steps after the matrix step, and its skip line joins `SKIPPED_BEFORE_CI`. Four unit tests in `budgets.test.ts` cover it. This is one file outside the spec's three, by this ruling.
5. **Decision 4 is amended (the merge note on `024b`).** A 20% gap is when a re-base **must** happen. Every re-base takes every fall, with no ruling, and the `ruling` field names that re-base's landing note.
6. **`brand`'s local LCP margin is 20% (finding 6).** 15.03%, rounded up to 5%, is 20%: the budget is 950 ms, not 910. It is a rise of 40 ms over the figure first written, by this ruling; `brand`'s `ruling` field names it.
7. **The checkpoint's rulings 2 (`HEAVY` is `chart`), 3 (the probes, now 16) and 4 (the other figures and margins) stand.**

### The review's fixes

- **Finding 1:** `WASM_ALLOWED` and the narrowed `LIVE_HIGHLIGHT` in `budgets.ts`; the transfer test, the paint test and the sweep read `WASM_ALLOWED` for the `.wasm` rule. `component-live` probes its five pages.
- **Finding 2:** one shared `expectWithin(template, page, runs, free)` for the paint test and the sweep. It gates transfer on the unthrottled load, CLS and LCP on the throttled medians, `.wasm` on every load, and makes criterion 4's comparison. A live page that reads lower throttled gets a `throttled-lower` annotation. The criterion 4 text above is corrected.
- **Finding 3:** the release check (ruling 4).
- **Finding 6:** `brand`'s margin, 20%, with its ruling.
- **Finding 7:** mutation 1's size is corrected above (about 182 kB as counted).
- **Finding 8:** decision 6 says "its six largest files", and that a failure is read against the last sweep's `perf-sweep.json`. **The build sweep's `perf-sweep.json` was not kept:** it went with the scratch files before the first commit. Its medians are the table above; its ten-largest-files lists are lost. The re-base sweep's file is to be kept in the scratchpad record.
- **Finding 11:** test titles name the template and page only: `024 transfer: <template>`, `024 paint: <template>: <page>`, `024 sweep: <template>: <page>`. The budgets go in a `budget` annotation beside the `lcp` one. A unit test reads every title in `perf.spec.ts` and fails on a figure in one.
- **Tests for the fixes.** The four release-check tests were written before `ciLcpCheck` existed and failed to load ("Export named 'ciLcpCheck' not found"). The `WASM_ALLOWED` and title tests were written with their code and proven by mutation: with `chart` added to `WASM_ALLOWED` and a `≤ ${lcp.ms} ms` put back in the paint test's title, both failed (54 pass, 2 fail), then passed once reverted.

### The merge of `release/0.13.0` (2026-11-16)

`release/0.13.0` at `4a0bdde` (`021`, `023a`, `026` and the context since `874c5da`) merged in with a merge commit, "024: merge release/0.13.0". Two conflicts, both ledgers: `roadmap.md`'s `024b` row (the release's written row kept, this branch's `024c`, `024d` and `024e` rows after it) and the scorecard's run log (both sides' rows kept, the release's first). `perf.spec.ts` and `budgets.ts` merged without conflict. No budget was re-based (the change review's merge note): the perf project ran once on the merged tree to see that every page still fits.

`bun --bun playwright test --project=perf --no-deps`, the real config and command, 2026-11-16 01:48 to 01:54 EST, load 13 to 28 on 10 cores: **25 passed** (1 server check, 8 transfer tests over 107 pages, 16 paint tests), 6.2 minutes with the web server's build; the tests' own time **4.4 minutes** (267 s). The toast's page, `/components/toast/`, joined `component` from its sitemap entry with no edit, at 383.5 kB. Every page grew by about 0.7 to 1.2 kB (`026`'s toast on every page, and `021`'s ledgers), as `026` stated.

| Template | Pages | Heaviest page | Measured | Budget | Headroom | Probes' LCP medians (budget) | CLS (budget) |
|---|---|---|---|---|---|---|---|
| `home` | 1 | `/` | 301.5 kB | 335 | 33.5 | 772 (860) | 0.005 (0.02) |
| `index` | 1 | `/components/` | 350.5 | 385 | 34.5 | 2,476 (2,720) | 0 (0.02) |
| `landing` | 3 | `/start/` | 301.4 | 335 | 33.6 | 832, 812 (1,090) | 0 (0.02) |
| `component` | 73 | `sidebar` | 405.0 | 445 | 40.0 (Button 375.2: 69.8) | 1,068, 876, 848 (1,270) | 0.09 on `label` (0.108) |
| `component-live` | 5 | `kuiper-theme` | 760.8 | 840 | 79.2 | 872 to 1,308 (1,490) | 0.004 (0.02) |
| `component-heavy` | 1 | `chart` | 480.9 | 530 | 49.1 | 884 (1,010) | 0 (0.02) |
| `leaf` | 14 | `/changelog/` | 335.4 | 370 | 34.6 | 1,016 (1,110) | 0.001 (0.02) |
| `brand` | 9 | `/brand/downloads/` | 300.4 | 330 | 29.6 | 760, 756 (950) | 0 (0.02) |

The four live-console pages, now in `component`, measure 328.4 to 332.4 kB. Every probe's throttled transfer equalled its unthrottled figure, `kuiper-theme`'s included (760.8 kB both ways on this run).

**The checks on the merged tree:** `bun run check` 0 errors, 0 warnings; `bun run lint` clean; `bun test tests/unit/budgets.test.ts` 56 pass, 0 fail; `bun scripts/site/release-check.ts` exits **1**, naming the eight templates with no runner LCP figure and "024 build step 7", as ruled; `bun scripts/site/release-check.ts --before-ci` exits **0** and names the skip.

### The merge of `release/0.13.0` after `022` (2026-11-16)

`release/0.13.0` at `9884f65` (`022`, the test matrix, and the thumbnail hashes after it) merged in with a merge commit, "024: merge release/0.13.0 (after 022)". Two conflicts, both folds:

- **`scripts/site/release-check.ts`.** `022`'s file is kept whole: its `Check` shape, the ledger and matrix steps, and the room it left for `025`. `ciLcpCheck` is check 4, after the matrix step; its skip line is the third in `022`'s one `SKIPPED_BEFORE_CI` list. The order is the matrix, then `024`'s runner figures, then `025`'s cost step when it lands (the comment says so).
- **`tests/e2e/perf.spec.ts`.** This branch's file is kept. `test` and `expect` come from `../test.ts`, and `import type { Browser } from "@playwright/test"` stays. `022`'s `expectLcp` is not carried over: `lcpBudget`'s `null` path (decision 8) does its job. `budgets.ts` is not a spec file, so `matrix.test.ts`'s import ban does not read it.

`bun install --frozen-lockfile` installed `022`'s pinned packages. Then: `bun run check` 0 errors, 0 warnings (2,343 files); lint clean; `budgets.test.ts` 56 pass, `matrix.test.ts` 13, `headers.test.ts` 8, `release-check.test.ts` 13, all 0 fail. `release-check.ts` exits **1**: the fault ledger's 27 open faults, no qualifying matrix run (GitHub has no `matrix.yml` run yet), and the eight templates with no runner LCP figure. `--before-ci` exits **0** and names its three skips.

The perf project once, Chromium (`E2E_PORT=5284 bun --bun playwright test --project=perf --no-deps`): **25 passed**, 6.1 minutes with the build, load 6 to 19. Heaviest pages: `/` 301.6 kB (budget 335), `/components/` 350.6 (385), `/start/` 301.5 (335), `sidebar` 405.1 (445; Button 375.2, toast 383.6), `kuiper-theme` 760.9 (840), `chart` 481.0 (530), `/changelog/` 335.5 (370), `/brand/downloads/` 300.4 (330).

### After `024d` (2026-11-16)

[`024d`](./024d-the-theme-page-loads-no-editor.md) replaced the theme page's live ink-surface editor with a still specimen. `/components/kuiper-theme/` measures **462.1 kB** with 0 `.wasm` (760.9 kB and 2 before; −298.8 kB). Its LCP is **1,348 ms** (1,348, 1,332, 1,348), the 1,352 it had with the editor, so the editor never set it. Its CLS is 0.004. Where each figure went (`024d`'s landing notes give the measurements and the ruling):

- **The page leaves `LIVE_HIGHLIGHT` and `WASM_ALLOWED` and gets a template of its own, `kuiper-theme`** (the design lead's ruling, 2026-11-16; `024d`'s landing notes; first named `theme`, renamed at `024d`'s change review, finding 1, since `theme` is an item's name). **Decision 1 is amended: nine templates.** `kuiper-theme` is one page, as `home` and `index` are, and is named after it. Its figures are its own: 462.1 kB, 1,348 ms, 0.004. Its budgets are **510 kB, 1,490 ms, 0.02**. The page cannot sit in `component` (over 455 kB, decision 3). In `component-heavy` its LCP would have raised `chart`'s budget from 1,010 to 1,490 ms, unguarding `chart` by about 480 ms. The builder had first put it in `HEAVY` with that rise; the design lead did not confirm it.
- **`component-live` falls, with no ruling** (decision 4). Its new heaviest page is `code-editor`, its slowest `highlighter` and its worst CLS `code-editor`, at the medians of the same build sweep: 655.8 kB, 1,140 ms and 0.003. Budgets: 840 → **725 kB**, 1,490 → **1,260 ms**, CLS 0.02 (the floor). This is not the re-base: no page was re-measured for it. The unit test that a template's figures are its own pages forced it. The re-base sweep after `024b`, `024c`, `024d` and `024e` re-measures every template.
- **`component-heavy` is unchanged**: `chart`'s 479.9 kB, 912 ms and 0, so 530 kB, 1,010 ms and 0.02. Its probe is `chart` alone.
- **A finding for the re-base sweep:** the theme page's LCP is its first paint, the header's lead paragraph. Its HTML is 1.43 MB raw, 87.5 kB gzipped, about 3 times `chart`'s gzipped. **The paint waits for the document's gzipped bytes through the throttled network, not for parsing** (corrected at `024d`'s change review, finding 2): parsing costs about 40 ms; the gzipped document as built (91.5 kB) ends its response at about 1,075 ms and paints at 1,308 to 1,344, and without the examples' source lines (50.3 kB) at about 505 and 1,156 to 1,176. The examples' source panels are 44% of the gzipped document, the data after `</main>` 21%, the tables 9%. The figures and the levers are in `024d`'s landing notes.
- **`030`'s per-page cost must fit `kuiper-theme`'s headroom too:** 510 − 462.1 = **47.9 kB**, as well as `component`'s. The theme page is a component page, so the status line and the cost figure land on it.
