# Component cost: how the references measure it, how Kuiper can, and row 15

- **Status:** research, for `025`, corrected 2026-11-15 after the specification review (§9) and its re-review (§10) ([`../specifications/025-component-cost.md`](../specifications/025-component-cost.md)). It commits us to nothing.
- **Date:** 2026-11-15
- **Author:** the spec author for `025`
- **Question:** Which reference systems publish or enforce a per-component size or runtime cost, and how? Which way of measuring fits a registry whose items are copied into an app as source? How noisy is a runtime figure, and how many runs does it take? What is row 15's rubric, and how does each system score on it?
- **Feeds:** `025`; the scorecard's proposed row 15 ([`benchmark-scorecard.md`](benchmark-scorecard.md)); `030`'s facts line.

**Labels.** **EXECUTED**: run here on 2026-11-15 and seen. **READ**: a source says so, linked, read 2026-11-15. **INFERRED**: our reasoning.

**Terms.**

- **Gzipped size**: the bytes of a file after gzip compression, the usual stand-in for what crosses the network.
- **Hydration**: the browser running a server-rendered page's script so the page responds to input. In SvelteKit, a prerendered page hydrates when its client entry has loaded and mounted.
- **INP** (Interaction to Next Paint): Chrome's field measure of responsiveness. One interaction's latency runs "from the time the user begins the interaction to the moment the browser is next able to paint a frame" (READ, [web.dev/articles/inp](https://web.dev/articles/inp)). Good is at or below 200 ms; poor is above 500 ms (same source). Only clicks, taps and key presses count.
- **Event Timing**: the browser API behind INP. Its `duration` is "rounded to the nearest 8ms"; entries below 104 ms are hidden unless an observer asks for a lower `durationThreshold`, whose minimum is 16 ms (READ, [MDN, PerformanceEventTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)).
- **CPU throttling**: Chromium's `Emulation.setCPUThrottlingRate`, which slows the page's main thread by a factor. Lighthouse uses "a constant 4x CPU multiplier", which "moves a typical run in the high-end desktop bracket somewhere into the mid-tier mobile bracket" (READ, [Lighthouse, throttling.md](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)).
- **A launch** is one browser process. **A trial** is one page load (and one interaction) inside it.
- **The floor**: an empty app with the theme item and `utils` installed and nothing rendered from them. Every Kuiper item needs both.
- **Alone**: an item's cost when it is the only Kuiper item an app renders, measured over the floor.

## In short

1. **No reference system both publishes and enforces a per-component cost.** Material Web publishes a per-component gzip table and enforces nothing. Primer measures per-export sizes in CI and runtime stress tests on four components, and publishes neither. Spectrum's React Aria has the best runtime method (10,000-row tables, 10,000-option comboboxes, paired launches), run locally only. Carbon, Atlassian, Radix Themes and GOV.UK publish nothing per component. On the proposed row 15, Material scores 1 and every other system 0.
2. **"Primer tracks bundle size with size-limit" is half true.** `size-limit` is configured on two whole-library bundles with no limit and running time off, and no workflow read runs it. The per-export sizes go to a CI job summary.
3. **Every reference measures the library, not the app.** They bundle a component's entry point with its dependencies made external, or with CSS stubbed out. None measures what an app built with its real framework pays, CSS included. For a copy-the-source registry on Tailwind, only an in-app measure is honest: an item's CSS exists only after the app's Tailwind build scans it.
4. **The in-app measure works here, and is deterministic.** Prototype apps built from the smoke test's SvelteKit 3 fixture gave, gzipped, over the floor: `separator` 18.3 kB JS and 0.2 kB CSS; `button` 20.9 and 0.9; `dialog` 37.8 and 1.6; `dropdown-menu` 47.0 and 1.4 (EXECUTED, §4). Two clean builds of `dialog`'s app gave byte-identical files. A rebuild over a stale `build/` folder did not: Tailwind scanned the old output and the CSS grew by 569 bytes.
5. **Most of a small item's figure is shared code.** `separator`'s own file is 1.2 kB before minification; its 18.3 kB is mostly `cn` (10.9 kB gzipped by itself), the Svelte runtime it switches on, and `bits-ui`'s helpers. The four items together cost 56.8 kB JS, 46% of the 123.9 kB their alone figures sum to (EXECUTED, §4).
6. **Runtime is measurable to a few milliseconds with paired launches.** Under a 4× slowdown, with the machine busy: the floor against itself (A/A) differed by a median of 0.9 ms in hydration, with launch-level differences within ±5.6 ms. `button` added 31 ms of hydration; `dialog` 36; `dropdown-menu` 41; `separator` 1, which is noise. Opening `dialog` took 96 ms from input to two frames after it was open; `button`'s click, 43 ms (EXECUTED, §5).
7. **Event Timing alone is too coarse to budget.** It read 32, 80 and 80 ms for those three, in 8 ms steps, and hides anything under 16 ms. The input-to-frames measure that React Aria's suite uses ("opportunity") resolves under 1 ms and runs about 15 ms above Event Timing (EXECUTED, §5; READ, §2.3).
8. **A full run is about 20 minutes on this machine; a typical run after a specification, 1 to 5.** One page load with its interaction took 0.50 s at 4×. Builds took 4 to 20 s each with the machine shared (EXECUTED, §6).

## 1. What the references publish and enforce

### 1.1 Primer (GitHub)

Read from `primer/react` at `998b471` (2026-11-15, the `main` branch), fetched raw from GitHub; not cloned.

- **`size-limit` covers the whole library, unenforced.** The root `package.json` declares `"size": "size-limit"` and two entries, `packages/react/dist/browser.esm.js` and `browser.umd.js`, each with `"webpack": false, "running": false` and no `limit` (READ, [package.json](https://github.com/primer/react/blob/main/package.json)). A check without a `limit` reports and cannot fail. Neither `ci.yml` nor `pull_request.yml` runs `npm run size` (EXECUTED: fetched both, grep for `size-limit` and `npm run size`, 0 hits).
- **Per-export sizes go to a job summary.** `ci.yml`'s `sizes` job runs `packages/react/script/get-export-sizes.cjs` (READ, [ci.yml](https://github.com/primer/react/blob/main/.github/workflows/ci.yml), the `sizes` job). The script bundles each package entry point, then each named export alone, with rolldown; every dependency is external; CSS modules are replaced by an empty object; it minifies with terser and records raw and gzipped sizes. The table is written with `core.summary` to the Actions run page only (READ, [get-export-sizes.cjs](https://github.com/primer/react/blob/main/packages/react/script/get-export-sizes.cjs)). Nothing commits it and nothing fails on it.
- **Runtime stress tests, four components, not gating.** `e2e/components/StressTests.test.ts` runs five stories (ActionList, Pagination, Button twice, TreeView) in Playwright; each story renders 100 iterations and reports the median duration (READ, [StressTests.test.ts](https://github.com/primer/react/blob/main/e2e/components/StressTests.test.ts), [StressTest.tsx](https://github.com/primer/react/blob/main/packages/react/src/utils/StressTest.tsx)). `stress-tests.yml` stores results with `github-action-benchmark`, `alert-threshold: '200%'`, `fail-on-alert: false` (READ, [stress-tests.yml](https://github.com/primer/react/blob/main/.github/workflows/stress-tests.yml)).
- **Large data, by hand.** `PageLayout.performance.stories.tsx` has stories of about 100, 3,000 and 5,000 DOM elements, one a 300-row × 10-column table, for looking at in Storybook (READ, [the file](https://github.com/primer/react/blob/main/packages/react/src/PageLayout/PageLayout.performance.stories.tsx)). No script measures them.
- **The docs show none of it.** Primer's Button page lists status, Storybook, source and Figma links, and no size or performance figure (EXECUTED, fetched [primer.style/product/components/button](https://primer.style/product/components/button/)).

### 1.2 Carbon (IBM)

- No size or performance tooling in the clone at `fa75d78`: no `size-limit`, `bundlesize`, `bundlewatch` or `bundlemon`; `ci.yml`'s only "size" is Node's `--max-old-space-size` (EXECUTED, grep). Its decision records discuss bundle size as a reason for package entry points and pure class exports (READ, `docs/decisions/0004-…`, `0007-…`), not as a measured figure.
- The website names smaller bundles as a migration benefit ("Faster load times due to smaller bundle sizes", READ, `carbon-website` `src/pages/migrating/faq.mdx` line 55) and publishes no per-component figure (EXECUTED, grep of `carbon-website` at `5e9cd1d`; a web search found none).

### 1.3 Spectrum (Adobe)

Two code bases, neither cloned here.

- **React Spectrum and React Aria** (`adobe/react-spectrum` at `360e351`): a `perf/` suite (READ, [perf/README.md](https://github.com/adobe/react-spectrum/blob/main/perf/README.md)). It builds production bundles and runs Chromium through Playwright. Workloads include a 10,000-row virtualized table, a 10,000-option virtualized combobox and select, a 500-option combobox and 500-row tables. It "runs locally, with no CI integration"; results "stay in the git-ignored `perf/.local/` directory". Its method is in §2.3.
- **Spectrum Web Components** (`adobe/spectrum-web-components` at `5b9a9be`, the first-generation packages): 90 `test/benchmark/` files, one or more per component (EXECUTED, the repository tree). Each times creating a fixture until after the next paint, 100 renders per sample, with tachometer; the `browser-tests.yml` workflow runs them for changed packages in Chrome and Firefox and posts a pull-request comment with bytes and confidence intervals against the npm release (READ, `1st-gen/test/benchmark/helpers.ts`, `cli.ts`, `.github/workflows/browser-tests.yml`, `.github/scripts/build-tachometer-comment.js`). The combobox benchmark uses a country list of about 250 options (READ, `1st-gen/packages/combobox/test/index.ts`). Nothing fails on a result, and nothing is published on a docs page (INFERRED from the workflow, which only comments).

### 1.4 Material 3 (Google)

- **A per-component table, published, unenforced.** `scripts/size/update-size.ts` bundles each component with rollup and terser, `node_modules` external, and writes gzip, minified and percent-CSS per component into `docs/size.md` (EXECUTED, read in the clone at `37aa14b`; the file says "Last updated 2025-08-20"). `update-size-on-main.yml` regenerates it on every push to `main` and opens a pull request (READ, the workflow). The same table is published as "Bundle sizes" on the docs site, there dated 2024-06-25, with Button 8.1 kB and Dialog 4.7 kB gzipped (EXECUTED, fetched [material-web.dev/about/size](https://material-web.dev/about/size/)). There is no limit.
- m3.material.io itself shows no size (INFERRED: the scorecard's Button page check found none; not re-checked).

### 1.5 Atlassian, Radix Themes, GOV.UK

- **Atlassian.** The Button page's Code tab lists install, source, npm and a "Bundle" link to the package's `dist` folder on unpkg; no size or performance figure (EXECUTED, fetched [atlassian.design/components/button/code](https://atlassian.design/components/button/code) and `/examples`). Its source is a mirror of a private monorepo, so whether a private check enforces sizes is unknown (`?`).
- **Radix Themes.** No size or performance tooling in the clone at `1faff10` (EXECUTED, grep).
- **GOV.UK Frontend.** `shared/stats` bundles each component's JavaScript with rollup and the visualizer plugin, bundled and minified (READ, `shared/stats/src/index.mjs`). `stats-comment.yml` posts the change in file and module sizes on each pull request, with links to visualisations on the review app (READ, `.github/workflows/stats-comment.yml`, `shared/github-scripts/comments.mjs` lines 90–192). No limit, and nothing on the design system's pages (EXECUTED, grep of `govuk-design-system` at `5f31aa7`).

### 1.6 Outside the seven, for method

- **bits-ui**, Kuiper's own headless layer, at `8aff515`: `bundle-analyzer/` builds each component namespace alone with Vite, Svelte external, and commits `bundle-reports/latest.json` (2025-09-19: Dialog 22.6 kB, Popover 32.8 kB, Tooltip 36.5 kB gzipped). Its README warns the isolated figure overstates a real app's, "due to shared code and dependencies being deduplicated by bundlers". The pull-request workflow is commented out (EXECUTED, read in the clone).
- **size-limit** itself: Brotli by default, Gzip on request; a `limit` makes it "throw an error if the cost exceeds the limit"; an `import` option measures only named exports; a time plugin estimates running time in headless Chrome, throttled by comparing the machine with a low-priced Android phone, and warns its figures "might be unstable" (READ, [github.com/ai/size-limit](https://github.com/ai/size-limit)).

## 2. Ways to measure

### 2.1 Size

| Method | Who | Dependencies | CSS | What it answers |
|---|---|---|---|---|
| Export of the library, deps external | Primer | excluded | stubbed out | what this export adds to the package |
| Component alone, deps external | Material Web | excluded | inside JS (Lit) | the component's own code |
| Component namespace alone, framework external | bits-ui | included | none | import cost, framework not counted |
| Module stats per component | GOV.UK | own modules | separate | change per pull request |
| **The item in an app, over the floor** | none of them | included | the app's Tailwind build | **what an app pays** |

- **Why in-app for Kuiper** (INFERRED). An item is Svelte source plus Tailwind classes. Its CSS does not exist until the app's Tailwind build scans it; its Svelte output depends on the app's compiler; its dependencies are the app's. The library methods would leave out the CSS and either the dependencies or the runtime. The in-app delta includes all three, at the cost of a full build per item.
- **The baseline matters more than the compressor.** Subtracting an empty app charges the theme's 6.0 kB CSS to every item (EXECUTED, §4). Subtracting the floor puts the theme on its own row.
- **Gzip or Brotli.** Brotli is 10–12% smaller on these bundles (EXECUTED, §4). Gzip is what most tools and Kuiper's row-8 transfer figures speak; Brotli can be recorded beside it.
- **Shared code** has two honest figures: alone (an upper bound: everything the item pulls) and with the rest (a lower bound: what removing the item from a full app saves). bits-ui and size-limit publish the first. The bundler's per-module rendered length lets the alone figure be split by source (EXECUTED, §4).

### 2.2 Hydration

- **A mark at mount.** The cost app's root layout sets `performance.mark` in `onMount`, which runs after its children have mounted. Subtracting the navigation's `responseEnd` removes the HTML's own download. The same layout is in the floor and every item app, so the item's figure is its app's time minus the floor's, measured in the same launch (EXECUTED, §5).
- **Tracing** (CDP `Tracing`, or the "Diagnostic traces" of React Aria's suite) attributes main-thread time to script, style and layout. It is the tool to explain a figure, not to gate on (READ, §2.3).

### 2.3 Interaction latency

- **Event Timing**, as INP: quantized to 8 ms, and absent under the threshold (READ, MDN). React Aria's suite records it as supporting data and warns that "missing entries are not zeros" and that "these scripted interactions do not measure field INP" (READ, perf/README.md, "Timing boundaries").
- **Opportunity** (React Aria's primary metric): "Time from the initiating trusted event to two animation-frame callbacks after the expected DOM/focus state is observed. A rendering-opportunity proxy, not proof that pixels were presented." Timing starts "at the trusted browser event timestamp, excluding Playwright's locator/actionability polling" (READ, same).
- **SWC's tachometer** times fixture creation to the next paint, with `requestAnimationFrame` then a `MessageChannel` task (READ, `helpers.ts`), an older and equivalent idea.
- **Hover** (a tooltip, a chart's tooltip) is not an INP interaction. React Aria times pointer navigation from `pointerover` and notes that "hover does not generate an Event Timing interaction" (READ, same).

### 2.4 Variance: how many runs, which statistic

- **React Aria's defaults:** "eight browser launches, five measured trials per arm per launch, and two discarded warmups". "The independent observations are browser launches"; each launch's median trial is compared; the change is the Hodges–Lehmann estimate (the median of pairwise averages) of the launch-level differences, with a Wilcoxon signed-rank interval; "fewer than six launches always produce inconclusive verdicts". Its practical threshold is "the larger of 8 ms or 5% of the base median"; arms alternate order across launches; an A/A run measures noise (READ, perf/README.md, "Trial lifecycle and statistics", "Primary metrics and verdicts").
- **tachometer** samples until its confidence intervals settle, default 50 samples (READ, SWC `cli.ts`).
- **Primer** keeps a median per story and alerts only at 200% (READ, §1.1).
- **What fits a budget** (INFERRED). A budget is one threshold, not an A/B verdict. The median of launch medians is robust to one bad launch. Pairing each item with the floor in the same launch cancels drift (§5 shows the launch medians of the floor moving by 20 ms while paired differences moved by under 6). A figure over budget is re-measured before it fails, as React Aria's `confirm` step re-runs a detected change.

## 3. The prototype

Everything ran outside the repository, in this session's scratchpad (`…/scratchpad/025/`), on a 10-core Apple M1 Pro, macOS 25.5, Bun 1.4.4, the repository's Playwright 1.64.1 (Chromium 156.0.8078.4). The machine was shared with a builder running the test suites: the one-minute load average was 13 to 25 throughout.

- **The registry** was served read-only from the repository's `static/r/` (built 2026-11-15 15:07, the working tree) by a small Bun file server on a free port.
- **Each app** was a copy of `tests/smoke/fixtures/kit3` (SvelteKit 3.1.0, adapter-static, Tailwind 4.3.3, Svelte 5.57.3, Vite 8.3.5), installed from its lock, synced, then `shadcn-svelte add pluto-theme utils <item> -y -o` with the repository's locked CLI against that server. The home page was replaced by a minimal fixture rendering the item; the root layout gained the mount mark; `vite.config.ts` gained a ten-line plugin that writes each client chunk's modules and rendered lengths.
- **Sizes:** every `.js` and `.css` file under `build/`, each gzipped at level 9 and summed. Fonts and other binary files were summed raw.
- **Runtime:** one Bun file server per app; a new browser context per trial; `Emulation.setCPUThrottlingRate` 4 before navigation; 1280 × 800; network unthrottled (the size figure is the network's cost). The interaction was armed before the click: a capture listener took the trusted `pointerdown` timestamp, and a frame loop resolved two frames after the expected state (the dialog open with focus inside, the button's counter updated). Event Timing came from an observer at `durationThreshold: 16`.

## 4. Sizes (EXECUTED)

Gzipped bytes, all client files of a one-page app.

| App | JS | CSS | JS over the floor | CSS over the floor | Fonts (woff2, raw) |
|---|---|---|---|---|---|
| empty app | 32,036 | 1,433 | | | 0 |
| floor (theme and `utils`) | 32,038 | 7,466 | — | — | 323,052 |
| `separator` | 50,316 | 7,635 | 18,278 | 169 | same |
| `button` | 52,922 | 8,415 | 20,884 | 949 | same |
| `dialog` | 69,815 | 9,101 | 37,777 | 1,635 | same |
| `dropdown-menu` | 79,007 | 8,850 | 46,969 | 1,384 | same |
| all four together | 88,837 | 9,813 | 56,799 | 2,347 | same |

- **The theme** adds 6,033 bytes of CSS and 2 of JS to the empty app, plus 17 font files the browser fetches only for the subsets a page uses.
- **Repeatability.** `dialog`'s app, rebuilt twice after deleting `build/`, `.svelte-kit/output` and the stats file, gave the same SHA-256 over its 12 JS and CSS files both times, and the same as its first build: 69,815 bytes of JS and 9,101 of CSS (EXECUTED). So for fixed inputs the build is deterministic, and an input hash can stand in for a rebuild (INFERRED).
- **A trap.** Rebuilt once without that cleaning, the same app gave 79,485 bytes in all, 569 more, with a new CSS hash (EXECUTED). The fixture app has no `.gitignore`, so Tailwind's automatic source detection scanned the previous `build/` and the stats JSON and generated classes for strings it found there (INFERRED, from the CSS change alone). The harness must build in a fresh tree, keep its own files outside the app, and give the app a `.gitignore` for its outputs. Between the two size runs, every app also moved by 43 to 47 bytes of JS; that was the prototype's own layout change (the mount mark), not noise.
- **Brotli** at quality 11: `dialog`'s app JS 61,606 against 69,815 gzipped, 12% less; the floor's 28,779 against 32,038, 10% less.
- **Where `separator`'s 18.3 kB goes.** Rendered lengths before minification, over the floor's: `cn` 43,900; the Svelte runtime's growth 24,798; `svelte-toolbelt` 10,975; `bits-ui` 3,517; `inline-style-parser` 3,243; `separator`'s own file 1,187; `style-to-object` 579; `clsx` 513 (EXECUTED, the module plugin). Bundled alone and minified, `utils`'s `cn` is 26,408 bytes, 10,856 gzipped (EXECUTED, `bun build --minify`). So about 11 kB of every item's alone figure is `cn`.
- **`dialog`'s** largest groups: `bits-ui` 66,295; Svelte's growth 31,624; `cn` 43,900; `tailwind-variants` 27,784; `svelte-toolbelt` 14,198; `tabbable` 11,304; `phosphor-svelte` 10,735; `dialog`'s own files 10,674; `button` 3,753; `spinner` 1,386.
- **Shared code.** The four items' alone JS sums to 123,908 bytes; together they cost 56,799, 46% of it. The alone figure is an upper bound, and a long way above the shared cost for items on `bits-ui`.
- **Build time:** `svelte-kit sync` 2.0–5.6 s, `add` 0.4–2.4 s, `vite build` 3.9–19.5 s per app, one at a time on the loaded machine. `bun install` from the cache: 47–210 ms.

## 5. Runtime (EXECUTED)

8 launches × 5 trials per app, 1 warm-up per launch discarded, apps in alternating order by launch. The floor was served twice (`floor`, `floor~b`) for an A/A check. Milliseconds.

**Hydration**, the mount mark minus `responseEnd`. Over the floor, the median of the 8 launch-level differences:

| App | Delta | Launch-level differences | Range |
|---|---|---|---|
| floor again (A/A) | 0.9 | 0.4, 5.6, −2.0, −3.2, 3.9, 1.7, −3.0, 1.3 | 8.8 |
| `separator` | 1.0 | 3.0 … 14.6 | 17.7 |
| `button` | 31.4 | 26.3 … 45.7 | 19.4 |
| `dialog` | 35.8 | 28.8 … 55.3 | 26.5 |
| `dropdown-menu` | 41.0 | 35.3 … 46.8 | 11.5 |

The floor itself hydrated in a median 109 ms after its HTML arrived; its launch medians ranged 96 to 117. The Hodges–Lehmann estimates matched the medians within 0.3 ms. `button`'s 31 ms against `separator`'s 1 ms is a finding for `025`'s breakdown to explain; the likely cause is `tailwind-variants` or the spinner's icon at module evaluation (INFERRED, both are in `button` and not in `separator`).

**The main interaction**, opportunity and Event Timing:

| App | Opportunity, median | Launch medians | Event Timing, median (8 ms steps) |
|---|---|---|---|
| `button`, click updates a counter | 43.4 | 41.8 – 44.6 | 32 |
| `dialog`, click opens it, focus inside | 95.8 | 94.3 – 114.8 | 80 |
| `dropdown-menu`, click opens it, focus inside | 106.8 | 94.0 – 112.4 | 80 |

- The median of the first 3, 4, 6 and 8 launches for `button` was 43.9, 43.6, 43.4 and 43.7; for `dialog` 104.6, 106.2, 106.2 and 99.9. A busy machine moves an overlay's figure by about 10%.
- **The run:** 288 loads with interactions in 145 s, 0.50 s each.
- **One harness fault, found and fixed:** `page.evaluate` of a string whose last expression is a promise waits for that promise. Arming the interaction that way waited forever for a click it was blocking. The arming expression must end with a plain value.

## 6. What a full run costs (INFERRED, from §4 and §5)

- **Sizes:** 75 items, the empty app, the floor and the whole catalogue, about 78 builds. Preparing one template app (install, sync, floor) once and copying it saves the 2–6 s of install and sync per item. At 6–15 s per build and four at once, about 3 to 6 minutes.
- **Runtime:** 6 launches × (1 warm-up + 3 trials) = 24 loads per app, about 77 apps, at 0.5 s: about 15 minutes; the larger blocks will be slower, so about 18.
- **A full run, about 20 to 25 minutes.** With an input hash per item, a run after a specification rebuilds and re-measures only the items whose inputs changed, plus the floor: 1 to 5 minutes. A change to the theme changes every item's inputs and means a full run.

## 7. Row 15, "Component cost": the rubric

Each criterion is present or absent. The score is the count, 0 to 4. As elsewhere in the scorecard, a criterion that cannot be verified counts as absent and is marked `?`.

- **(a) Per-item size published.** The documentation site shows, for the current release, a size figure for each component (or for each component's entry points): on its page or on one size page.
- **(b) Size budgets enforced.** A per-component limit (or one per package entry point) fails a build, a required check or a release when exceeded. A report without a limit, or an alert that does not fail, is not a budget.
- **(c) Runtime cost published.** The documentation site shows a per-component runtime figure (render, hydration or interaction time) produced by a script, for the current release.
- **(d) Large-data cases.** At least one component is measured by script with 1,000 or more rows, options or items, and that figure is published on the documentation site or held by a budget.

**Why these four** (INFERRED). They separate what a reader can see ((a), (c)) from what the project holds itself to ((b)), and they ask for the case where component cost hurts most ((d)). Measuring without publishing or gating, as Primer, Spectrum and GOV.UK do, helps the maintainers and is invisible to an adopter, so it scores nothing here; the evidence column names it.

### Scores

| | a | b | c | d | Score | Evidence |
|---|---|---|---|---|---|---|
| Kuiper 0.12 | – | – | – | – | 0 | No size or runtime figure on any page; `bench/` scores the site, not items |
| Carbon | – | – | – | – | 0 | §1.2 |
| Material 3 | ✓ | – | – | – | 1 | §1.4: a published gzip table, no limit, no runtime |
| Spectrum 2 | – | – | – | – | 0 | §1.3: the strongest method of all (10,000-row and 10,000-option cases, paired launches), local only; SWC's benchmarks comment on pull requests |
| Atlassian | – | ? | – | ? | 0 | §1.5; a private monorepo |
| Primer | – | – | – | – | 0 | §1.1: sizes in job summaries, no limit, stress tests that alert at 200% and do not fail, 100-item cases |
| Radix Themes | – | – | – | – | 0 | §1.5 |
| GOV.UK | – | – | – | – | 0 | §1.5: size changes on pull requests only |

**Kuiper's path** (INFERRED, from `025`'s design): `025` enforces budgets, (b). `030` puts size and runtime on each page, (a) and (c). A large-data case held by a budget gives (d): with `037`'s combobox at 1,000 options as the roadmap plans, or with `025`'s own case if the owner takes it (`025`, question 4). The roadmap's 1.0 target of 4 for this row is reachable in 0.13.0 or 0.14.0, and no reference is above 1.

## 8. What this means for `025` (INFERRED)

1. Measure in the app, over the floor, with the theme on its own row.
2. Publish the alone figure and a breakdown by source; say plainly that shared code is counted in full.
3. Pin every package the cost app installs with its own lockfile, so a dependency's release cannot move a budget without a commit.
4. Pair each item with the floor in every launch; 6 launches is React Aria's floor for a verdict.
5. Budget the opportunity measure, record Event Timing beside it, and keep INP's 200 ms as a line no budget crosses without a ruling.
6. Re-measure before failing a runtime budget; never re-measure a size.
7. Cache by input hash, so the gate in the ordinary test run costs seconds.
8. Build every app in a fresh tree with a `.gitignore` for its outputs, and keep the harness's files outside it, or Tailwind measures the harness.

No code was copied from prior art. The prototype scripts stay in the scratchpad. Nothing in the repository was changed except this memo and `025`'s specification.

## 9. Correction, 2026-11-15, after the specification review

The review of `025` ([`../reviews/025-component-cost-spec-2026-11-15.md`](../reviews/025-component-cost-spec-2026-11-15.md)) found errors and gaps in this memo. Sections 1 to 8 stand as written; where they disagree with this section, this section holds. Measurements the review made are labelled **EXECUTED (review)**; new runs of the prototype, **EXECUTED (correction)**.

### 9.1 The versions the prototype built with

§3's "installed from its lock" holds only for the `kit3` fixture's own packages. The prototype ran `add` without `--no-deps-install`, so the CLI installed the items' packages from npm. Its apps held `bits-ui` 2.21.0 and `cn` 0.5.2, where the repository's `bun.lock` resolves 2.20.2 and 0.5.0 (EXECUTED (review)). §4's and §5's figures are approximate for that reason. The drift is the one `025` decision 2's own lockfile exists to stop.

### 9.2 What the review ran

- The CLI's `add` turns a font item's `font.dependency` (for example `"dependency": "@fontsource-variable/geist"` in `static/r/styles/maia/font-geist.json`) into an `@import` in `app.css`, and adds the package. The font items list no `dependencies` or `devDependencies` (EXECUTED (review)).
- With exact pins in `package.json`, `add dialog … --no-deps-install` rewrote the three font pins to `^5.3.0`. With the npm registry pointed at a dead port, the same `add` exited 0 and wrote `"latest"` (EXECUTED (review)). So every `add` asks the npm registry about the fonts.
- A copy of the prototype's `dialog` app, with `node_modules` linked to the original's, synced and built, gave the same SHA-256 over its JS and CSS as the original (EXECUTED (review)).
- Gzip at level 9 over the same files: Bun 1.4.4's `node:zlib` gave 69,815 bytes of JS and 9,101 of CSS; Python's system zlib gave 69,494 and 9,074 (EXECUTED (review)). A figure depends on the compressor's build.
- The prerendered `index.html` of `dialog`'s app holds 9 `modulepreload` links, 1 stylesheet and 2 `import()`s; the 2 JS files outside that set are 898 bytes gzipped (EXECUTED (review)).
- Bootstrapping §5's 8 A/A launch differences in sets of 6: the median exceeded ±3 ms in 6.2% of resamples, ±5 ms in 0.3% (EXECUTED (review)).
- `bun --version` gave 1.4.4, while `package.json` declares `packageManager` `bun@1.3.14` and `engines` `>=1.3.14` (EXECUTED (review)).

### 9.3 Pairing the floor near each item

The review read §5's fifth launch (index 4; the review's "launch 4"): the floor's median was its lowest, 96.5 ms, and every item's launch difference was its highest. Re-reading the same samples (EXECUTED (correction), `out/runtime-1794775089141.json` in the scratchpad):

- Within that launch the floor's five trials read 118.5, 96.5, 84.6, 86.0 and 114.3 ms. The noise was in the trials themselves, not only between the floor and the items.
- In the prototype each round of trials ran the floor and the items within about 3 s. Pairing each item trial with the same round's two floor trials (the floor and its A/A copy), then taking the launch median, gave these launch-level differences in hydration:

| App | Pairing | Launch differences | Median | Range |
|---|---|---|---|---|
| `separator` | launch medians (§5) | 3.0, −1.5, 3.4, −3.1, 14.6, 1.1, −2.8, 1.0 | 1.0 | 17.7 |
| `separator` | same round | 1.4, 0.6, 3.6, −0.1, 6.2, 0.7, −0.9, −0.3 | 0.7 | 7.1 |
| `button` | launch medians | … 45.7 … | 31.4 | 19.4 |
| `button` | same round | … 41.6 … | 32.6 | 14.5 |
| `dialog` | launch medians | … 55.3 … | 35.8 | 26.5 |
| `dialog` | same round | … 53.5 … | 34.9 | 23.1 |
| `dropdown-menu` | launch medians | … 46.8 … | 41.0 | 11.5 |
| `dropdown-menu` | same round | … 46.9 … | 41.0 | 9.9 |
| floor A/A | same round | 1.6, 1.6, −1.2, 0.2, 15.8, 2.1, −0.9, 0.4 | 1.0 | 17.0 |

- A simulated floor–item–item–floor block from two consecutive rounds gave medians of 0.5 (A/A), 1.8, 32.5, 34.7 and 41.3 ms, with ranges of 19.3, 13.5, 7.7, 26.0 and 12.5.
- **Reading** (INFERRED). Pairing near the item narrows the outliers that come from drift between the floor and the item, and it is the only way to keep them narrow when a launch lasts minutes. It does not cancel noise inside a launch: the A/A pair's worst launch stayed at 15.8 ms. The median over launches absorbs one bad launch whichever pairing is used: every method put each item's median within 1.5 ms of the others.

### 9.4 The clock's start, the press gap and the no-op click

Two more runs, 6 launches × 3 trials, at one-minute load averages of 25 to 36 (EXECUTED (correction), `scripts/runtime2.ts`, `out/rt2.json`, `out/rt3.json`):

- **The press-to-release gap**, `pointerup` minus `pointerdown` as Playwright's click sends them: median 0 ms for every app; at most 4.8 ms.
- **Starting the clock at `click` instead of `pointerdown`:** `button` 43.7 and 42.9 ms, against 43.4 in §5. `dialog` read 107.7 and `dropdown-menu` (started at `pointerdown`, where `bits-ui`'s menu trigger opens it) 109.1, on a busier machine than §5's.
- **A no-op click** on the floor's heading, ended as soon as the click had been seen: median 41.1 ms (launch medians 37.8 to 45.0). Event Timing reported nothing for it (under 16 ms). So about 41 ms of `button`'s 43 is the measure's own floor: the click's dispatch and two frames under 4×.
- `bits-ui` 2.20.2's dropdown trigger opens the menu on `pointerdown` for a mouse, and on `click` only when `detail` is 0 (READ, `node_modules/bits-ui/dist/bits/menu/menu.svelte.js`, `DropdownMenuTriggerState`). Its tabs, dialog, accordion, collapsible, toggle, checkbox, radio group and switch act on `click` (READ, same folder, grep for handlers).

### 9.5 Row 15, re-scored on the scorecard's own sites

The scorecard scores each system on "its own documentation site and its public source", and for Material 3 that is m3.material.io, "not the per-platform docs it links to" (READ, `benchmark-scorecard.md` §1). §7 gave Material 3 (a) from material-web.dev, a per-platform site, whose table is also older than the repository's (2024-06-25 on the site, 2025-08-20 in the clone). On the scorecard's rule Material 3 scores (a) –, with material-web.dev named in its evidence.

| | a | b | c | d | Score |
|---|---|---|---|---|---|
| Kuiper 0.12 | – | – | – | – | 0 |
| Carbon | – | – | – | – | 0 |
| Material 3 | – | – | – | – | 0 |
| Spectrum 2 | – | – | – | – | 0 |
| Atlassian | – | ? | – | ? | 0 |
| Primer | – | – | – | – | 0 |
| Radix Themes | – | – | – | – | 0 |
| GOV.UK | – | – | – | – | 0 |

The rubric is unchanged. Row 15 is new, so it is kept out of the scorecard's headline total, which stays over rows 1 to 14 and comparable with the first run; a total of 60 is given beside it (INFERRED, the choice `025` decision 17 makes).

### 9.6 Assets compress

§3 and `025`'s first draft counted fonts and "other binary files" raw as "already compressed". WebAssembly is not: `tree-sitter-typescript.wasm` is 1,413,849 bytes raw and 132,982 gzipped; `web-tree-sitter.wasm` 210,688 and 83,065 (EXECUTED (review)). Fonts (woff2) and images are compressed; `.wasm`, `.svg`, `.json` and `.txt` are not.

### 9.7 Smaller corrections

- §5's `separator` row should read "−3.1 … 14.6", range 17.7.
- In short, item 7, and §2.3: the response time is comparable in kind to one INP interaction, not "the span INP measures". INP ends at the next paint after the handlers; this measure ends two frames after a DOM state.
- The terms quote Lighthouse's claim about "the mid-tier mobile bracket". It is Lighthouse's, not ours: React Aria's suite notes that CPU throttling "does not emulate mobile hardware" (READ, `perf/README.md`, "Choose a workload"). Kuiper's public text says "a 4× slower CPU".
- React Aria measures warm module caches on fresh component instances (READ, same, "Trial lifecycle and statistics"). The prototype, and `025`, load each trial in a cold browser context: the cost of a first visit.
- §6's run time, with `025`'s revised blocks (floor, item, floor, item, floor; 6 launches; about 72 items): about 2,160 loads at 0.5 s, about 18 minutes of runtime, and 25 to 30 minutes in all (INFERRED).

## 10. Correction, 2026-11-15, after the re-review

The re-review of `025` (same file, "Re-review, 2026-11-15") found two more errors in §9 and measured the offline `add`. §1 to §9 stand; where they disagree with this section, this section holds.

### 10.1 Blocks with 2 or 3 item trials

The prototype's raw samples (`out/runtime-1794775089141.json`, 8 launches × 5 rounds) were re-cut into blocks and the six- or eight-launch median bootstrapped, 20,000 resamples each (EXECUTED (correction), `scripts/blocks-bootstrap.ts` in the scratchpad). A block's floor trials were consecutive rounds of the floor; its item trials, the same rounds of the item; the A/A "item" was the floor's copy. Hydration, ms:

| Block, launches | A/A standard error | A/A outside ±5 | A/A outside ±8 | Items' standard error |
|---|---|---|---|---|
| FIFIF, 6 | 3.71 | 12.4% | 7.08% | 2.55 – 3.79 |
| FIFIF, 8 | 2.83 | 7.6% | 3.65% | 2.10 – 3.37 |
| FIFIFIF, 6 | 2.46 | 2.8% | 0.54% | 1.48 – 3.19 |
| FIFIFIF, 8 | 2.12 | 1.2% | 0.14% | 1.13 – 2.37 |

- The medians stayed put: A/A −0.1 to 0.5; `separator` 1.2 to 1.6; `button` 29.4 to 32.1; `dialog` 35.2 to 35.8; `dropdown-menu` 41.1 to 41.4.
- The re-review's own bootstrap of FIFIF over 6 launches found an A/A standard error of 3.4 ms and 11.1% outside ±5 ms, and put an item's chance of failing a first budget and then its re-measure at 0.02 to 0.73% (EXECUTED (review)).
- **Reading** (INFERRED). Three item trials per block over 6 launches (42 loads per item) are quieter than two over 8 (40 loads). With them, an A/A bound of ±8 ms fails about one run in 200. The resampling reuses only 8 real launches, from a busy machine, so these are estimates, and criterion 12 of `025` measures the real rate.

### 10.2 The no-op in `rt2`, and the floor's range when the machine is busy

- §9.4 reports the no-op click as 41.1 ms, from `out/rt3.json`. The earlier run, `out/rt2.json`, read **476.9 ms** (launch medians 463 to 520). That run was wrong: the floor's expected state was the expression `true`, already true before the click, so the frame loop resolved before the click with the start time still 0, and the figure was measured from the page's time origin. `rt3` ended the state at `window.__cost.start > 0`, once the click had been seen. The 41 ms figure stands on that one clean run.
- §9's "the floor's launch medians stayed within 96 to 117 ms" holds for §5's run only. In `rt2` and `rt3`, at load 25 to 36, the floor's median hydration was 113.0 and 122.5 ms, against §5's 109.2, and its single launch medians ranged 89.0 to 127.4 (READ, the re-review's reading of the two files). So a ±15% band holds for each run's median, not for single launches.

### 10.3 The offline `add`

With the npm registry pointed at a closed port, `add dialog -y -o --no-deps-install` exited 0 but took 72.1 s and 72.3 s, against 0.66 s online: the lookups were retried with back-off. With `npm_config_fetch_retries=0` as well, it took 2.08 s and wrote the same files. The hidden `--no-deps` skipped the lookups in 0.2 s, left `package.json` unchanged, and wrote an `app.css` byte-identical to the `--no-deps-install` run's (EXECUTED (re-review)).
