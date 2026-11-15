# 024 — Budgets per template

- **Status:** Ready to build after `020`: review approved with changes, all applied; the owner answered Q1 to Q5 on 2026-11-15, each with the recommended option (see Landing notes).
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

### 1. Eight templates

Every page in `SITEMAP` belongs to exactly one template.

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
- **A fall** needs no ruling. At a re-base, a template whose budget is more than 20% over its heaviest page's median tightens to the new figure (`015` decision 23's rule). Its `ruling` names the re-base's landing note, for example `"024 landing notes, re-base 2026-12-01"`. Criterion 2 accepts both.

**A change that adds weight to every page of a template states its cost in its specification**, in kB per page. It must fit the template's headroom, or ask for a ruling. `030` is the first. Its stated cost is first compared with real headroom at this spec's checkpoint.

**This rule binds later specifications, so it is written into `roadmap.md` §4 at landing.** The line, exactly:

> **Page budgets (`024`).** Every site page is held to its template's transfer, LCP and CLS budgets, each from the template's heaviest or slowest page plus a stated margin (`tests/e2e/budgets.ts`). A specification that adds weight to every page of a template states the cost in kB per page; it must fit the template's headroom or ask for a ruling. A budget rises only by a ruling recorded with its measurement, and falls at a re-base without one. Before each tag, the sweep runs: `PERF_SWEEP=1 bun --bun playwright test --project=perf --no-deps`.

### 5. `.wasm` stays at zero, except where it is the point

No page fetches a `.wasm` file, as today, except the pages in `LIVE_HIGHLIGHT`.

- **What is counted.** `measure()` counts `.wasm` requests in every frame, and counts bytes in the main frame only (READ, `perf.spec.ts` l. 105–110). So the zero rule covers a block's iframes too, as it does today. On a listed page, the `.wasm` bytes, gzipped (decision 7), count toward transfer.
- **The list** names the pages whose item's job is live highlighting, and which fetch `.wasm` on load. The likely members are `code-editor`, `code-languages` and `use-highlighted-code` (READ (review): each renders a `CodeEditor` or runs the hook in its examples). `highlighter` highlights on a button press, so it should stay out (INFERRED). The sweep records which pages fetch `.wasm`. The design lead rules the list to those whose item highlights live, before ruling `HEAVY` (decision 3). Any other page that fetches one fails.
- **`component-live`** has one budget from its heaviest page plus the margin. By the estimate, `code-editor` with the runtime and the Python grammar gzipped (about 145 kB) is 617 to 661 kB, so the budget is 680 to 730 kB.
- **This reverses `015` decision 23,** which said the live-highlighting pages "carry no budget". From this spec they do. The landing notes record the change.

### 6. What runs, and when

**Every run of the `perf` project** (`bun --bun playwright test --project=perf --no-deps` to run it alone):

1. **Transfer, every page.** One load of each page in `SITEMAP`, cold, at 1280 × 900, with the network and CPU unthrottled. One test per template: `024 transfer: <template>: every page ≤ N kB, 0 .wasm`. It fails if any page is over, and its message lists every page over with its figure and the files that grew. Each test's timeout is `30_000 + 5_000 × pages` ms (`component`: about 71 pages, about 6 minutes). About 3.4 minutes in all (INFERRED).
2. **Paint, the probe pages.** Each probe page, 3 cold loads under `015` decision 23's full profile, as today. One test per probe page: `024 paint: <template>: <page>: LCP ≤ X ms, CLS ≤ Y`. It checks the medians, with a timeout of 180,000 ms, as today. It also checks criterion 4. About 3 minutes in all (INFERRED).

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

1. **Every page has one template.** `tests/unit/budgets.test.ts`: every `SITEMAP` page maps to exactly one of the eight; each route imports its template's layout, and `home`'s route is `(site)/+page.svelte` with none (decision 2); `HEAVY` and `LIVE_HIGHLIGHT` name only component pages in `SITEMAP`, and no page is in both. Fails today: no module. (unit)
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

The owner was told that Button's transfer budget rises from 380 kB to about 430–480 kB at the checkpoint.

None yet.
