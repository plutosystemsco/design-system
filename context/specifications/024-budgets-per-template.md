# 024 — Budgets per template

- **Status:** Draft, 2026-11-15. Not reviewed. It needs a spec review (see "Not a small change") and the owner's answers to Q1 to Q5. Not built.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** test harness, the perf suite only. Two new files and one rewritten file, all under `tests/` (see "Files"). **Interface changes:** none for an installed app. No registry item, token, page or dependency changes. **Not a small change,** although the roadmap calls it one (next section).
- **Depends on:** `020` (the Kuiper rename), landed first, so the theme item's page is `/components/kuiper-theme/` and the upgrade guide `/changelog/0.13.0/upgrade/` exists. Ranked in [`roadmap.md`](../roadmap.md) §2, 0.13.0, row `024`, wave 1. It must land before `030` (§2, "`024` before `030`").
- **Coordinates with:** [`022`](./022-the-test-matrix.md) decision 8 and its Q1 (the LCP budgets on CI runners); `022`'s Files list moves every spec file's `test` import, `perf.spec.ts`'s too.
- **Research it stands on:** the short note below. Also [the older-rules audit](../research/2026-11-15-older-rules-audit.md) P14, where the rule was first written; [`015`](./015-the-design-site.md) decision 23 (the profile); and [the benchmark scorecard](../research/benchmark-scorecard.md) row 8.

## Terms

- **Transfer:** the bytes a page loads over the network, as sent (gzipped where the file is text). It counts the main frame only, and leaves out iframes and the search index (`015` decision 23).
- **LCP**, largest contentful paint: when the page's biggest text or picture is drawn.
- **CLS**, cumulative layout shift: how far the page jumps while it loads.
- **Template:** a family of pages built on the same layout. Its pages share most of their bytes.
- **Probe page:** a page measured under the full throttle on every run, to stand for its template's paint.
- **Sweep:** one load of every page in the sitemap.

## The defect

The perf suite budgets five pages by hand. The site has 102 (103 after `020`).

- **Button has 0 kB of headroom.** It transfers 380 kB against a 380 kB budget, in every run since `018` (EXECUTED, `019a`'s landing notes). Any byte added to every component page fails it. `030` adds a status line and a cost figure to every component page. So `030` would break the build on arrival (`roadmap.md` §2).
- **The budget keeps being re-ruled.** Button's went 360 → 365 → 370 → 375 → 380 kB in one day, each by a ruling (audit P14).
- **97 pages have no budget at all.** Only `/`, `/components/`, `/components/button/`, `/components/code-block/` and `/brand/colour/` are measured (READ, `tests/e2e/perf.spec.ts`).
- **Button is not the heaviest component page.** A static estimate (below) puts at least six component pages above it. One of them, the theme item's page, is about 210 kB heavier. None of them is checked.

## Not a small change

AGENTS.md and constitution §5 define a small change as a fix that changes no interface, adds no token and no dependency, and touches one item or one page.

This spec meets the first three. It fails the fourth. It sets the budget of every page on the site, in seven families. It rewrites the perf harness: a new mapping from page to template, a sweep, and probe pages. It also needs rulings: which pages count as heavy, the margins, and how CI re-bases LCP.

So it is written as a full specification, with its research inside. **It needs a spec review** by someone who did not write it, before it is built. At landing, the design lead corrects the roadmap row's "Small change".

## What the research found

Short, because the question is narrow.

- **The rule already exists, as a proposal.** Audit P14: "A budget is set per page template (component, block, landing, Brand), from the heaviest measured page of that template plus a stated margin. A change that adds weight to every page states its cost in its specification. LCP and CLS budgets stay per template. A budget rises only by a ruling recorded with its measurement" (READ).
- **The site has six layouts, plus the home page** (READ, `src/routes/(site)/`, `src/lib/site/page/`, `src/lib/preview/`):

  | Layout | Pages today |
  |---|---|
  | `(site)/+page.svelte`, the home page | 1 |
  | `landing.svelte`, with no index of parts | 3: `/start/`, `/brand/`, `/foundations/` |
  | `landing.svelte` with the parts grid and its thumbnails | 1: `/components/` |
  | `component.svelte`, directly (58), through `block-page.svelte` (8 blocks) or through `composition-page.svelte` (9 compositions) | 75 |
  | `leaf.svelte` | 13: the changelog, five Start pages, seven Foundations pages |
  | `brand/page.svelte` | 9 Brand pages |

  The 404 is not in `SITEMAP`. The `/view/` and `/example/` routes are frames, loaded in iframes, and are not counted.
- **Only five pages are measured.** The latest medians, 3 runs each, under the profile (EXECUTED, `019a`'s landing notes, the tree committed as `dad6f76`; CLS from `019`'s change review, the last run that logged it):

  | Page | Transfer | Budget today | LCP | Budget today | CLS |
  |---|---|---|---|---|---|
  | `/` | 307 kB | 355 | 868 ms | 1,027 | 0.005 |
  | `/components/` | 355 kB | 395 | 2,776 ms | 2,988 | 0 |
  | `/components/button/` | **380 kB** | **380** | 1,040 ms | 1,157 | 0 |
  | `/components/code-block/` | 354 kB | 360 | 1,088 ms | 1,186 | 0.003 |
  | `/brand/colour/` | 302 kB | 347 | 864 ms | 984 | 0.001 |

- **A static estimate ranks the other 97** (EXECUTED (024), a read-only script over `build/` at `dad6f76`; not committed). For each page it sums the gzipped HTML, the JavaScript and CSS the HTML preloads, the preloaded fonts and the `<img>` files. It cannot see what loads at run time: fonts named only in CSS, lazy chunks, `.wasm`. So it reads low by a fairly steady amount: +99 kB on both measured component pages, +82 on the home page, +126 on `/brand/colour/`. On `/components/` it reads high, since it counts both schemes' thumbnails. **It ranks pages. It does not set budgets.**

  | Component page | Static | Measured, or INFERRED (static + 99) |
  |---|---|---|
  | the theme item (`pluto-theme`, `kuiper-theme` after `020`) | 491 kB | about 590 kB |
  | `code-editor` | 390 | about 489, plus any `.wasm` |
  | `code-languages` | 388 | about 487 |
  | `chart` | 377 | about 476 |
  | `sidebar` | 309 | about 408 |
  | `dropdown-menu` | 282 | about 381 |
  | `button` | 281 | **380, measured** |
  | `code-block` | 255 | 354, measured |
  | the median of the 75 | 243 | about 342 |
  | the lightest (`font-geist`) | 233 | about 332 |

  The other templates' heaviest pages by the static estimate: landings, `/start/` 224; leaves, `/changelog/` 208 (its HTML grows every release); Brand, `/brand/downloads/` 183, just above `/brand/colour/` at 176. These differ by a few kB, so the sweep decides.
- **Some pages may fetch `.wasm`.** `015` decision 23 kept live highlighting off the budgeted pages and said it "is shown on the `use-highlighted-code` and `code-editor` pages, which carry no budget" (READ). Every page's preloaded chunks name `.wasm` files, so the static estimate cannot tell which pages fetch them (EXECUTED (024)). The sweep records it.
- **One budget from the very heaviest page would be loose.** If the component template took the theme page's figure plus 10%, about 650 kB, an ordinary page could grow by about 300 kB and pass. Button could pass 500 kB, and the scorecard's row 8 would fall from 4 to 3 (transfer 4 is ≤ 500 kB; READ, scorecard §2, row 8). The roadmap says row 8 is "held".
- **Bytes do not depend on the throttle.** The site preloads on hover only (`data-sveltekit-preload-data="hover"`; READ, `src/app.html`), and the suite never hovers. So an unthrottled load should fetch the same files (INFERRED; criterion 4 proves it).
- **The cost of a full throttled sweep.** About 300 loads at about 5 to 6 s each: some 30 minutes (INFERRED, from the profile: 380 kB at 1.6 Mbps is about 2 s, plus 87 requests at 150 ms round trips, plus the idle waits). Too slow for every run. An unthrottled sweep of transfer is about 2 s a page: some 3 to 4 minutes (INFERRED).
- **Prior art.** Lighthouse CI's budget file matches budgets to pages by path pattern, and `size-limit` sets one budget per bundle (INFERRED, from general knowledge; not re-read here; the review should check). Both set a budget per family, not per page. Studied, not copied.

## Decisions

### 1. Seven templates

Every page in `SITEMAP` belongs to exactly one template.

| Template | Pages | Mapping |
|---|---|---|
| `home` | `/` | the path is `/` |
| `index` | `/components/` | the path is `/components/` |
| `landing` | `/start/`, `/brand/`, `/foundations/` | any other page whose parent is `/` and which has a door |
| `component` | every `/components/<name>/` page not in `HEAVY` | door `components`, below the landing |
| `component-heavy` | the pages in `HEAVY` (decision 3) | listed by name |
| `leaf` | the changelog, its upgrade guides, the Start and Foundations pages | door `start` or `foundations` below the landing, or no door below `/` |
| `brand` | the nine Brand pages | door `brand`, below the landing |

- **Why `index` is its own template:** its LCP is a thumbnail, at 2.8 s. The other landings paint text, near 0.9 s (EXECUTED, the table above). One LCP budget for both would be useless for three of them.
- **Why blocks and compositions are not their own template:** P14 proposed one. But their pages are `component.svelte` pages, and their views are iframes, which transfer leaves out. The static estimate puts them among the lightest component pages (234 to 256 kB). Their own row would add a budget with no different weight.
- **The 404 has no budget** unless Q5 says otherwise. It is not in `SITEMAP`, and holds no example.

### 2. How a page maps, and how a new page is assigned

`templateOf(page: SitePage)` in `tests/e2e/budgets.ts` reads the page's `path`, `door` and `parent`, as in decision 1's table. It reads nothing else. So:

- **A new page is assigned by its sitemap entry, with no edit to the budgets.** `026`'s `/components/toast/` and `027`'s six item pages join `component`. `020`'s `/changelog/0.13.0/upgrade/` joins `leaf`. Each is checked from its first run.
- **The mapping is checked against the code.** A unit test reads each page's route file and requires the layout its template names: `component.svelte`, `block-page.svelte` or `composition-page.svelte` for `component` and `component-heavy`; `leaf.svelte`; `brand/page.svelte`; `landing.svelte` for `landing` and `index`. A page whose route imports none of them fails it.
- **A new template is a decision of the spec that makes it.** That spec adds a row to `TEMPLATES`, with its measurement and margin. Until then, the unit test fails.
- **A new page that is too heavy fails.** Its builder slims it, or asks the design lead for a ruling: a place in `HEAVY` or a raised budget, each recorded with its measurement.

### 3. Heavy component pages have a template of their own

The component template's budget may not pass **500 kB**, the scorecard's band for a 4 on row 8. That keeps Button's score, and the score of every ordinary page, out of reach of one heavy item.

- At the build's checkpoint, the sweep (decision 6) gives every component page's median. A page goes in `HEAVY` if it alone would push `component`'s budget past 500 kB, so if its median × 1.1 is over 500 (a median over about 455 kB).
- By the static estimate that is four pages: the theme item, `code-editor`, `code-languages` and `chart`. Pages that fetch `.wasm` (decision 5) are likely to join them. The sweep decides. The design lead rules the list, and the landing notes record it.
- After that, `HEAVY` changes only by a ruling with its measurement. A page that grows past `component`'s budget fails. It never moves on its own.
- `component-heavy` has one budget, from its heaviest page plus the margin, like any template.

This is Q1.

### 4. Each budget is its heaviest page plus a stated margin

For each template, `budgets.ts` records the measured figures and the ruling. The budget is computed from them, never typed.

- **Transfer:** the heaviest page's median × (1 + 10%), rounded up to 5 kB.
- **LCP:** the slowest page's median × (1 + 10%) on the release machine, and × (1 + 20%) on a CI runner (decision 8), rounded up to 10 ms.
- **CLS:** the worst page's median × 1.2, but never under 0.02 (`017` checkpoint 1's rule, READ, `perf.spec.ts`).

The margins are Q2.

**A budget rises only by a ruling, recorded with its measurement** (audit P14). Changing a figure in `budgets.ts` changes its `ruling` field, which names the landing note that records it. A budget falls without a ruling: at a re-base, a template whose budget is more than 20% over its heaviest page's median tightens to the new figure (`015` decision 23's rule).

**A change that adds weight to every page of a template states the cost in its specification**, in kB per page. It must fit the template's headroom, or ask for a ruling. `030` is the first.

### 5. `.wasm` stays at zero, except where it is the point

No page fetches a `.wasm` file, as today, except the pages in `LIVE_HIGHLIGHT`. That list names the pages whose item's job is live highlighting. By `015` decision 23 that is `code-editor` and `use-highlighted-code` (INFERRED until the sweep). The sweep records which pages fetch `.wasm`. The design lead rules the list to those whose item highlights live. Any other page that fetches one fails. On a listed page the `.wasm` bytes count toward transfer.

### 6. What runs, and when

**Every run of the `perf` project:**

1. **Transfer, every page.** One load of each page in `SITEMAP`, cold, at 1280 × 900, with the network and CPU unthrottled. One test per template: `024 transfer: <template>: every page ≤ N kB, 0 .wasm`. It fails if any page is over, and its message lists every page over with its figure. About 3 to 4 minutes (INFERRED).
2. **Paint, the probe pages.** Each probe page, 3 cold loads under `015` decision 23's full profile, as today. One test per probe page: `024 paint: <template>: <page>: LCP ≤ X ms, CLS ≤ Y`. It checks the medians. It also checks that the throttled transfer median equals the unthrottled sweep's figure within 2 kB (criterion 4).

**The probe pages.** For each template: its heaviest page and its slowest page at the last sweep (often one page). `component` always probes `/components/button/` too, the page the scorecard reads. So the probes start at about ten pages, against five today. The paint tests take about 3 minutes (INFERRED).

**On demand, `PERF_SWEEP=1`:** every page, 3 loads each, under the full profile. It writes `test-results/perf-sweep.json` (every run of every page) and prints a `perf <path>: [...]` line for each, as today. It fails if any page is over its template's transfer, LCP or CLS budget. About 30 minutes (INFERRED). It runs:

- at this spec's build, to set every figure;
- at every re-base, and whenever a ruling raises a budget;
- in the measurement loop before each tag (`roadmap.md` §4, step 1), so a page that became slow without being a probe is caught.

This split is Q3.

### 7. The old budgets go

`BUDGETS` and `COLOUR_BUDGET` leave `perf.spec.ts`. The five pages they covered are still measured: in the transfer sweep, and as probes where the sweep picks them. `measure()` keeps its profile and its counting rules. It gains one option, `throttle: false`, for the transfer sweep, and returns each response's URL and size so a failure can name what grew.

### 8. CI re-bases LCP; transfer and CLS gate from the first run

Bytes do not depend on the machine. Paint does. So:

- **Transfer** gates on every machine, from the first run (`022` decision 8).
- **CLS** gates on every machine. It does not depend on speed at these values (INFERRED; the landing notes record the runner's first figures).
- **LCP** has two figures per template in `budgets.ts`: `local`, measured on the release machine, and `ci`, measured on `022`'s `perf` runner (`ubuntu-24.04`). The test reads `process.env.CI` to choose.
- **Until a runner figure exists, `ci` is `null`.** On CI the paint test then records the LCP as an annotation, "LCP reported, not gated: no runner figure (024 decision 8)", and asserts nothing about it. It still asserts CLS and transfer. This is `022` Q1, option 1.
- **The re-base.** After `022`'s first three green runs, the design lead reads the probe pages' LCP lines from the three `perf` job logs. Each template's `ci` figure is the median of the three runs' medians for its slowest probe. It enters `budgets.ts` with the 20% CI margin and a `ruling` naming the landing note. From then on, LCP gates on CI.
- **If the owner answers `022` Q1 otherwise:** option 2 uses the same mechanism at `022`'s first run; option 3 leaves `ci` at `null` for good, and the release check runs `perf` locally before each tag.

When this happens relative to `024`'s landing is Q4.

### 9. The figures today, and the budgets they would give

Firm figures are measured. INFERRED figures are the static estimate plus its offset, and stand until the sweep replaces them. The budgets apply decision 4's margins.

| Template | Pages | Heaviest page (transfer) | Transfer budget | Today's budget on these pages | Slowest measured (LCP) | LCP budget, local | CLS budget |
|---|---|---|---|---|---|---|---|
| `home` | 1 | `/`, **307 kB** | **340 kB** | 355 | **868 ms** | **960 ms** | 0.02 |
| `index` | 1 | `/components/`, **355 kB** | **395 kB** | 395 | **2,776 ms** | **3,060 ms** (a rise from 2,988: needs the checkpoint's ruling) | 0.02 |
| `landing` | 3 | `/start/`, about 306 kB (INFERRED) | about 340 kB | none | not measured | from the sweep | 0.02 |
| `component` | about 71 | `sidebar`, about 408 kB (INFERRED); Button 380 measured | about 450 kB | 380 (Button), 360 (code-block), none on 73 | Button **1,040 ms**, code-block **1,088 ms**; others not measured | about 1,200 ms if code-block stays slowest | 0.02 |
| `component-heavy` | about 4 | the theme item, about 590 kB (INFERRED), more if a `.wasm` page joins | about 650 kB | none | not measured | from the sweep | 0.02 |
| `leaf` | 13 | `/changelog/`, about 307 kB (INFERRED, the component offset) | about 340 kB | none | not measured | from the sweep | 0.02 |
| `brand` | 9 | `/brand/downloads/` or `/brand/colour/` (**302 kB**), within a few kB | about 340 kB | 347 (Colour) | Colour **864 ms** | about 960 ms | 0.02 |

What this gives:

- **Button gains about 70 kB of headroom** (380 against about 450), and every ordinary component page about 40 kB or more. `030` can land if its stated cost fits.
- **Every page is checked.** 102 pages today, against 5.
- **Row 8 stays at 4.** No ordinary component page may pass 500 kB.
- **Two budgets fall:** the home page's (355 → 340) and Brand's (347 → about 340). One rises: the index's LCP, by the margin's arithmetic on a slower run. And Button's transfer budget rises from 380 to about 450. That rise is the point of this spec, and the checkpoint's ruling records it.

## Acceptance criteria

Each check is written first and seen failing. The landing notes say how each failed.

1. **Every page has one template.** `tests/unit/budgets.test.ts`: every `SITEMAP` page maps to exactly one of the seven; each route imports its template's layout (decision 2); `HEAVY` and `LIVE_HIGHLIGHT` name only component pages in `SITEMAP`. Fails today: no module. (unit)
2. **Budgets are derived and ruled.** The same file: each template's budgets equal decision 4's arithmetic on its recorded figures; each has a `ruling`; `component`'s transfer budget is at most 500 kB; `ci` is a number or `null`. A hand-typed budget that disagrees with its figures fails. (unit)
3. **Transfer, every page.** `perf.spec.ts`, `024 transfer: <template>`, one per template. Seen failing two ways. (a) Today's defect: with `component` set to Button's 380 kB, it fails and names every heavier page (INFERRED: at least six). (b) A mutation: a 60 kB incompressible string added to `component.svelte` fails `component` and `component-heavy`, naming their pages. Added to one ordinary page instead, it fails naming that page alone. Each mutation is reverted. (e2e, perf)
4. **Bytes do not depend on the throttle.** On every probe page, the throttled transfer median equals the unthrottled figure within 2 kB. If it does not, the transfer sweep is throttled instead, and the landing notes give the new run time. (e2e, perf)
5. **Paint, the probes.** `024 paint: <template>: <page>`. Seen failing by setting one template's `local` LCP figure to 500 ms, then restored. (e2e, perf)
6. **CI without a runner figure.** With `CI=1` and `ci: null`, the paint test passes, carries the annotation, and still fails on a CLS or transfer over budget. With a `ci` figure set, LCP gates. A unit test covers the choice (`lcpBudget(template, env)`); the e2e run shows the annotation. (unit; e2e)
7. **`.wasm`.** A page outside `LIVE_HIGHLIGHT` that fetches a `.wasm` file fails its template's transfer test. Seen failing by removing `code-editor` from the list, if the sweep shows it fetches one; otherwise by a test page that does. (e2e, perf)
8. **The sweep.** `PERF_SWEEP=1 bun --bun playwright test --project=perf` measures every page 3 times, writes `test-results/perf-sweep.json` with each run, and fails on any page over any budget. Its figures are the landing notes' table: every page, its template, its medians. (e2e, perf)
9. **The old budgets are gone.** `perf.spec.ts` has no per-page budget. `/components/button/` is a `component` probe. (unit, reads the file)
10. **The suites.** Unit, `check`, `lint`, e2e with `perf`, and smoke pass. The landing notes record the `perf` project's wall time, before and after. The target is under 8 minutes on the release machine.
11. **The scorecard.** `scripts/bench/` is re-run per `roadmap.md` §4 (`pluto.ts`, and `site.ts --only pluto`). Row 8 stays at 4. The change review cites the run log row.

## Files

| File | Change |
|---|---|
| `tests/e2e/budgets.ts` | New. `TEMPLATES` (figures, probes, ruling), `MARGIN`, `HEAVY`, `LIVE_HIGHLIGHT`, `templateOf()`, `budgetOf()`, `lcpBudget()`. Imports `sitemap.ts`, never `@playwright/test`, so the unit suite can import it |
| `tests/e2e/perf.spec.ts` | The two old budget blocks go. The transfer tests, the paint tests and the sweep join. `measure()` gains `throttle` and the per-response list |
| `tests/unit/budgets.test.ts` | New (criteria 1, 2, 6 and 9) |

Nothing else. Not `playwright.config.ts` (lane E, `022`'s), not `sitemap.ts`, not any route.

**Lanes.** The roadmap gives `024` lane S, perf only. Its files are tests alone. `022` moves the `test` import of every spec file, `perf.spec.ts` included. Whichever lands second takes the other's import line. That is the one overlap.

**At landing, `context/` only:** this spec's landing notes (every page's figures, the rulings, the `HEAVY` and `LIVE_HIGHLIGHT` lists); `roadmap.md`, row `024`'s kind and §4 step 1's sweep; the scorecard's run log.

## The build, in order

1. Write criteria 1, 2, 6 and 9's unit tests and `budgets.ts`'s types. See them fail.
2. Write the transfer sweep and `PERF_SWEEP`. Run the full sweep on the release machine. Record every page.
3. **Checkpoint.** The design lead rules `HEAVY`, `LIVE_HIGHLIGHT`, the probes, every figure and each rise, with the owner's answers to Q1 to Q3. The landing notes record them.
4. Fill `budgets.ts`. Run criterion 3(a) against Button's old figure, then the mutations of 3(b), 5 and 7. See each fail, then revert.
5. Remove the old budgets. Run every suite. Record the times.
6. Re-run the scorecard. Hand to the change review.
7. **After `022`'s first three green runs** (decision 8): the runner's LCP figures, with a ruling. When this happens is Q4.

## Risks

- **The sweep may change the picture.** The heavy list, the slowest pages and every INFERRED figure above come from a static estimate. A page may fetch far more at run time than its HTML names. The checkpoint exists for this.
- **The changelog grows every release.** Its HTML is already 39 kB gzipped. `leaf`'s budget will need re-ruling every few releases. A split changelog would end that; it is not this spec's.
- **The probes may not be the slowest pages on CI.** They are picked on the release machine. The sweep before each tag is the backstop.
- **`component-heavy` is loose for its lighter members.** `chart` at about 476 kB would sit under a budget of about 650. `025`'s per-item budgets cover what each item costs an app; this budget covers the page.
- **The perf project gets slower,** from about 1.5 minutes to about 6 (INFERRED). Criterion 10 measures it.

## Open questions for the owner

Recommended option first. Each answer goes in the landing notes.

**Q1. What do the heavy component pages get?** The theme item's page is about 590 kB (INFERRED). One budget from it would allow 650 kB on every component page.
1. **A `component-heavy` template, for pages listed by ruling** (decision 3). `component` stays at or under 500 kB, so row 8 holds. Button's budget rises from 380 to about 450 kB.
2. **One component budget, from the heaviest page plus the margin,** about 650 kB. Simplest, and the roadmap's words. It gives up row 8's guard and most of the regression signal.
3. **Slim the heavy pages first,** each as a small change, so one budget fits. Their cost is unknown, and it delays `030`.

**Q2. What margins?**
1. **Transfer +10%; LCP +10% on the release machine and +20% on CI; CLS max(× 1.2, 0.02).** `018`'s ruling for the index used +10% (READ, `perf.spec.ts`). CI runners are noisier.
2. **+20% everywhere,** `015` and `017`'s rule. More headroom, and less signal.
3. **A fixed headroom in kB per template,** such as 40 kB. A change's stated cost is then compared with a known number. It suits small templates badly.

**Q3. How often is each page measured?**
1. **Transfer on every page every run, unthrottled; paint on probe pages every run; the full throttled sweep at re-base and before each tag** (decision 6). About 6 minutes a run.
2. **Probe pages only every run; every page only in the sweep.** About 3 minutes a run, but a heavy new page can land unseen until the tag.
3. **Every page under the full profile every run.** About 30 minutes a run.

**Q4. When are the runner's LCP figures set?**
1. **After `024` lands.** CI reports LCP until `022`'s first three green runs, then the re-base is `024`'s second checkpoint, in its own landing notes. `030` waits only for the transfer budgets, which gate at once.
2. **Before `024` lands.** `024` waits for `022`'s first green runs. `030` waits with it.
3. **Never.** LCP stays out of CI (`022` Q1, option 3). The release check runs `perf` locally before each tag.

**Q5. Does the 404 get a budget?**
1. **No.** It is not in the sitemap and holds no example.
2. **Yes, as a `leaf` page,** measured at `/404.html`.

## Review

None yet.

## Landing notes

None yet.
