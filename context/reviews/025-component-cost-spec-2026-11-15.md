# Review of 025 — Component cost

Reviews [`specifications/025-component-cost.md`](../specifications/025-component-cost.md).

- **Date:** 2026-11-15
- **Status:** dispositioned; re-reviewed 2026-11-15 (see "Re-review"). Does not land yet: re-review finding R1
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (387 lines), and its memo, [`research/2026-11-15-component-cost.md`](../research/2026-11-15-component-cost.md) (212 lines). They were checked against these:
  - the constitution (§4.4, §4.5, §4.6, §5), `AGENTS.md`, `reviews/README.md`, `roadmap.md` (row `025`, §3 "`025`, component cost", §4 the loop, §6 Q1) and the scorecard (§1 method, §2 rubric, §8 re-run);
  - the author's prototype, `…/scratchpad/025/scripts/build.ts`, `runtime.ts`, `probe.ts`, `probe2.ts`, its outputs under `…/scratchpad/025/out/` and its built apps under `…/scratchpad/025/apps/`;
  - `tests/smoke/process.ts`, `tests/smoke/fixtures/kit3/` (all files), `tests/smoke/blocks-add.test.ts`, `registry.json`, every built item under `static/r/styles/maia/`, `package.json`, `tsconfig.json`, `.prettierignore`, `.gitignore`, `src/app.css`;
  - the source of `input-group`, `message-log`, `proof-band`, `liquid-glass`, `tooltip`, `theme`, `error-summary`, `sidebar`, `highlighter` (`lib/highlight/languages.ts`, `tree-sitter.ts`) and the 31 items of decision 9's lists, by grep for handlers;
  - `node_modules/shadcn-svelte/dist/index.mjs` (1.7.1, the version `bun.lock` resolves);
  - [`026-toast.md`](../specifications/026-toast.md) decision 25, as revised;
  - [`022-the-test-matrix.md`](../specifications/022-the-test-matrix.md) lines 408 and 676.
- **Re-ran:** nothing in the repository was written but this file; `git status --porcelain` hashed `dbd76da…` before writing. Other sessions changed `context/` files meanwhile (`020`, `022`, `026`, `019a` and their reviews), so the hash after differs; none of those writes is mine. Probes ran in `…/scratchpad/025-review/`, on a free port, never 5199. The machine's one-minute load average read 41.7, then 21.9, on 10 cores, while I worked.
  - The CLI's `add` options (EXECUTED, read in `index.mjs`): `--no-deps-install`, "add dependencies to package.json without running install", exists on `add`, `init` and `update`. A hidden `--no-deps` skips adding as well.
  - A copy of `kit3`, `bun install --frozen-lockfile` (66 packages, 66 ms), `svelte-kit sync`, then `shadcn-svelte add pluto-theme utils -y -o --no-deps-install` against `static/r` served read-only (EXECUTED): exit 0 in 0.66 s. It wrote the theme, three fonts and `utils`, and added five packages to `package.json`: `@fontsource-variable/geist`, `…/ibm-plex-sans`, `…/jetbrains-mono` (each `^5.3.0`), `cn` `^0.5.0` and `shadcn-svelte` `^1.7.1`. Nothing was installed.
  - With exact pins already in `package.json`, `add dialog … --no-deps-install` (EXECUTED) rewrote the three font pins `5.3.0` → `^5.3.0`. With the npm registry pointed at a dead port (`BUN_CONFIG_REGISTRY`, `npm_config_registry`), the same add wrote `"latest"` for all three. So the CLI asks the npm registry about the fonts on every add (finding 9).
  - A second `add separator` over the same tree (EXECUTED): `src/app.css` and `src/lib/utils.ts` kept their SHA-256s. Re-adding the theme is idempotent.
  - The prototype's `dialog` app copied without `node_modules`, `build/` or `.svelte-kit/`, with `node_modules` symlinked to the original, then `sync` and `vite build` (EXECUTED, 3.0 s): the SHA-256 over its JS and CSS files equals the original build's. The template-and-link method works, and the output does not depend on the folder's path.
  - That build's prerendered `index.html` (EXECUTED): 9 `modulepreload` links, 1 stylesheet, and the two `import()`s of `start` and `app`. The 2 JS files outside that set (`nodes/1`, one chunk) are 898 bytes gzipped. The client manifest is at `.svelte-kit/output/client/.vite/manifest.json`.
  - Gzip at level 9 over the same files (EXECUTED): Bun 1.4.4's `node:zlib` and `Bun.gzipSync` give 69,815 bytes of JS and 9,101 of CSS, matching the memo; Python's system zlib gives 69,494 and 9,074. The figure depends on the compressor's build (finding 6).
  - The prototype apps' installed versions (EXECUTED): `bits-ui` 2.21.0 and `cn` 0.5.2, where the repository's lock resolves 2.20.2 and 0.5.0 (finding 17).
  - A bootstrap over the prototype's 8 launch-level differences, `out/rt-8x5.json` (EXECUTED, 20,000–50,000 resamples of 6 launches): A/A `|median| > 3 ms` in 6.2% of runs (4 ms: 1.3%; 5 ms: 0.3%). With the first budget set from one noisy run, the chance of failing it and its re-measure is 0.28% for `dialog`'s hydration, 0.03% for `button`'s, and 0% for the three response times.
  - `gzip -9` of two `.wasm` files (EXECUTED): `tree-sitter-typescript.wasm` 1,413,849 → 132,982 bytes; `web-tree-sitter.wasm` 210,688 → 83,065. The grammars in `node_modules` total 24.3 MB raw.
  - `bun --version` → 1.4.4; `package.json` declares `"packageManager": "bun@1.3.14"` and `"engines": { "bun": ">=1.3.14" }` (EXECUTED).
  - Material Web's size page (READ, fetched [material-web.dev/about/size](https://material-web.dev/about/size/)): a per-component table, "Last updated 2024-06-25", Button 8.1 kB and Dialog 4.7 kB gzipped, no limit named. The memo's Primer files in the scratchpad (`web/primer-root-package.json`, `primer-stress.yml`): `"size": "size-limit"`, `size-limit` 11.2.0, `alert-threshold: '200%'`, `fail-on-alert: false`. React Aria's `perf/README.md` (scratchpad copy) lines 129, 155, 162, 171, 252 and 254 read as the memo quotes them.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | Criterion 3 forbids the three font packages, which no item lists as a dependency. The floor cannot build | decision 2.1; criterion 3 |
| 2 | High | In a full run, the floor is measured once at the start of each launch, minutes before most items. The pairing stops cancelling drift, and the prototype's own data shows it failing already | decisions 5, 11 |
| 3 | Medium | Blocks have no fixture file and cannot carry `data-cost="target"`. Criteria 1 and 2 cannot both hold | decisions 3.4, 8; criteria 1, 2 |
| 4 | Medium | `cn` is charged to every row and to `utils`' row. That is the double count the floor exists to avoid for the theme | decisions 1, 7 |
| 5 | Medium | The click clock starts at `pointerdown`, so it times the harness's press-to-release gap. "The span INP measures" is not accurate | decision 6; terms |
| 6 | Medium | The input hash includes an unpinned Bun, so other machines see every item as stale. It also leaves out the CLI, and its harness scope is vague | decision 12; criterion 5 |
| 7 | Medium | The ruling check compares with the latest `v*` tag. No tag has a `budgets.json` until 0.13.0, so nothing is enforced for the whole release | decision 14; criterion 7 |
| 8 | Medium | Criterion 17's ±3 ms A/A flakes about 1 run in 16 at the measured noise. The gate's flake rate is never stated | criteria 17, 12 |
| 9 | Medium | Every `add` asks the npm registry about the fonts and rewrites `package.json`. The method is neither offline nor fully hashed | decision 3.3 |
| 10 | Medium | The noisy flag reads the load at the end of the build phase, and refuses most runs on a shared machine. It does not guard the unpaired figure that needs it most | decision 11; decision 15 |
| 11 | Medium | WebAssembly is called "already compressed" and assets carry no budget. The highlighter's cost, megabytes of grammars, is invisible | decision 4; decision 14 |
| 12 | Medium | Mixed machines: a cached run by anyone writes runtime figures beside the release machine's, and the report keeps one `machine` line | decisions 11–13, 15 |
| 13 | Medium | `bun run check` covers `scripts/`. The fixtures and the cost app will not type-check in the repository, so criterion 20 fails | Files; criterion 20 |
| 14 | Medium | Row 15 scores Material 3 by material-web.dev. The scorecard's own method scores m3.material.io, and the table is not "for the current release" | memo §7; scorecard §1 |
| 15 | Medium | `026`'s two cases need interactions. `025` gives cases no interaction entry, no report shape, and criterion 2 forbids their targets | decision 10; criterion 2 |
| 16 | Low | `025` and `022` both edit `scripts/site/release-check.ts`; the roadmap says they share no files | decision 15; `022` l. 408 |
| 17 | Low | The memo's figures were built with `bits-ui` 2.21.0 and `cn` 0.5.2, not the lock's versions. Its §3 says "installed from its lock" | memo §3, §4 |
| 18 | Low | Hydration ends at `onMount`, so async work after mount is not counted, and the spec does not say so | decision 5 |
| 19 | Low | Interaction list: `input-group`'s password toggle is the item's own behaviour; `marketing-bar`'s phone viewport breaks the hydration pairing | decision 9 |
| 20 | Low | Write-ins: wrong cross-references and counts, "floor first" against "alternates", the six-launch rationale, `--tighten` on noisy figures, the mtime guard, the catalogue, a class name the site's Tailwind will scan, and the `noisy` field | various |

## Acceptance criteria against evidence

1. Fixtures — not met as drafted: 8 blocks have no fixture file under decision 3.4; the real count is 63 files plus the blocks' routes (finding 3). READ.
2. Interactions — the 31 match decision 9, and 31 + 44 = 75 against `registry.json` (EXECUTED, count). But a block's target cannot be marked without editing its source (finding 3), and cases are not covered (finding 15).
3. Cost app packages — not met as written: fonts excluded (finding 1). The `.gitignore` clause is sound. READ, EXECUTED.
4. Report shape — testable. INFERRED.
5. Fresh — testable, but not portable (finding 6). INFERRED.
6. Within budget — testable. INFERRED.
7. Rulings — testable, but empty until a tag holds the file (finding 7). READ.
8. Breakdown — testable; the plugin's `renderedLength` exists under Vite 8 (prototype output). READ.
9. Statistics — fixed inputs, sound. READ.
10. Facts strings — sound. READ.
11. Catalogue — compares unlike sets (finding 20e). INFERRED.
12. First full run — depends on findings 2, 8, 10. INFERRED.
13, 14. Gate fails; a rise without a ruling — sound. READ.
15. Determinism — supported: the linked rebuild matched byte for byte (EXECUTED). Its "equal the committed report" clause ties a smoke test to `report.json` freshness and to the CLI's network calls (finding 9).
16. Initial set — sound, and the HTML gives the set directly (EXECUTED).
17. A/A and calibration — the ±3 ms bound flakes (finding 8). The calibration bound is too loose to catch finding 5.
18. Stale build — guards the copy filter only (see finding 20g on the site scan). READ.
19. Registry guard — by mtime (finding 20f). READ.
20. Suites — `check` would fail (finding 13). READ.
21. Scorecard — depends on finding 14. READ.

## Findings, most severe first

1. **Criterion 3 forbids the fonts the floor imports** (`025-component-cost.md:57`, `:306`). The three font items carry no `dependencies` or `devDependencies`. Their package is in a `font.dependency` field (`static/r/styles/maia/font-geist.json`: `"dependency": "@fontsource-variable/geist"`). The CLI turns that field into `@import "@fontsource-variable/geist"` in `app.css`, and adds the package (EXECUTED).
   Failure: a cost app built to criterion 3 ("no other package beyond the kit3 fixture's") has no `@fontsource-variable/*`. With `--no-deps-install`, nothing installs them, so the floor's Tailwind build fails on the import. A cost app that lists them fails criterion 3.
   Fix: decision 2.1 and criterion 3 name "every package in an item's `dependencies`, `devDependencies` or `font.dependency`". The test reads all three.

2. **The floor is measured far from most items in its launch** (`:169`, `:86`). Decision 11 measures "3 trials of every app … the floor first" inside each launch. With 77 apps at about 0.5 s a load, one launch runs about 2.5 minutes. The floor's trials sit at one end of it. The prototype had 6 apps a launch, about 15 s, and still shows the fault. In launch 4 (`out/rt-8x5.json`), the floor's median was its lowest, 96.5 ms, against about 110 elsewhere. Every item's difference jumped together in that launch: `separator` 14.6 ms, `button` 45.7, `dialog` 55.3, `dropdown-menu` 46.8, each its launch maximum. The load changed between the floor's trials and the items', and the pairing did not cancel it. Scale the gap tenfold and this becomes the common case.
   Failure: on a busy or thermally drifting machine, items late in a launch read high or low together. Budgets set on such a run bind wrongly, and a later run fails or hides a regression.
   Fix: pair locally. For each item, run its trials in a block with the floor's: floor, item, item, floor, as React Aria's ABBA order does (`perf/README.md` l. 250). Its launch-level difference uses only that block's floor trials. That adds about one floor load per item load, roughly 15 minutes. Or keep one item per short launch: 6 launches × (item + floor). Re-state decision 16's time from the chosen design. Also state that response time is unpaired (finding 10).

3. **Blocks cannot meet criteria 1 and 2** (`:69`, `:111`, `:304`–`:305`). Decision 3.4 says a block's fixture "is that route as installed". So no `scripts/cost/fixtures/sign-in.svelte` exists. Yet criterion 1 wants 71 fixture files (75 less the theme and three fonts), 8 of them blocks. Criterion 2 wants exactly one `data-cost="target"` in each interactive fixture, including `sign-in`, `sign-up`, `settings`, `app-shell` and `chat`. Their routes are item source, which this specification promises not to change (`:6`).
   Fix: criterion 1 counts 63 fixture files plus the 8 blocks, each measured at its installed route, `/<block>/`. `interactions.ts` gives each entry a `target` selector, so blocks name theirs ("the form's submit button"). Criterion 2 checks `data-cost` only in fixture files, and checks that each block's selector matches exactly one element in its prerendered HTML.

4. **`cn` is in every row and in `utils`' row** (`:50`–`:52`, `:100`). The floor installs `utils` and renders nothing, so its build drops `cn`. Every item then pays about 10.9 kB for `cn` (memo §4), and `utils`' own row says the same 10.9 kB. A reader who adds `utils` and `button` counts `cn` twice. Decision 1 moves the theme's 6.0 kB out of every row because "every item needs the theme". The same holds for `cn`: 74 of 75 items need `utils`; only `liquid-glass` does not. The asymmetry decides most of a small item's figure: `separator`'s 18.3 kB is about 60% `cn`.
   Fix: either the floor's page calls `cn` once, `utils`' row is the floor minus a floor that does not, and no item's alone figure holds `cn`; or the specification keeps `cn` per item and drops the `utils` row's separate figure, with the reason. Recommended: the first, as for the theme. Ask the owner (a new Q7). Also correct `:52`. An item's alone figure *does* change when an item it pulls in changes (`dialog` pulls `button`). Write "changes only when it or an item it pulls in changes".

5. **The response clock starts too early, and the INP claim overstates it** (`:30`, `:92`). Playwright's click sends the press and the release as two CDP calls. A `dialog`, a `button`'s `onclick` and most `bits-ui` triggers act on `click`, after the release. Timing from `pointerdown` adds the harness's own gap between the two calls, under 4× and on a loaded machine. That gap is likely part of the memo's "about 15 ms above Event Timing" (memo §5). INP is also not this span. INP ends at the next paint after the event's handlers. This one ends two frames after a DOM state, which may come several frames later. React Aria, the source cited, says plainly that "these scripted interactions do not measure field INP" (`perf/README.md`, "Timing boundaries").
   Fix: each entry names the event that starts its clock: `click` for click-activated items, `pointerdown` for those that act on it (menus, if `bits-ui` opens them there), `keydown` for keys, `pointerover` for hovers. Record the press-to-release gap beside the figure. The terms say "comparable in kind to one INP interaction, not equal to it". Criterion 17 adds a no-op click fixture, whose response time is under a stated bound, such as 20 ms at 4×.

6. **The input hash is not portable, and its scope is vague** (`:176`, `:308`).
   - It hashes the Bun version. Bun is not pinned: `packageManager` says 1.3.14, `engines` `>=1.3.14`, and the prototype ran 1.4.4 (EXECUTED). On any other Bun, criterion 5 calls all 75 items stale, so `bun run test` fails until a 25-minute run. Bun does matter to sizes, because its zlib differs from the system's by about 0.5% (EXECUTED: 69,815 against 69,494).
   - It leaves out the CLI, whose transforms shape every installed file. Its version comes from the repository's `bun.lock` (1.7.1), not the cost app's.
   - "The harness's own source files under `scripts/cost/`" is undefined. If it takes in `fixtures/` or all of `interactions.ts`, one new fixture invalidates every item, and the cache is gone. `_floor.svelte`, which shifts every delta, must be in every item's hash.
   - One hash serves sizes and runtime. So a Playwright bump rebuilds every size.
   - Any change to the cost app's `package.json` or lock invalidates all 75. Any spec that adds a package or bumps one is a full run. The "1 to 5 minutes" claim (`:42`, `:242`) does not hold for such a spec.
   Fix: two hashes. The **size hash** covers the item's closure JSON, its fixture and cases, `_floor.svelte`, every file under `scripts/cost/app/`, the files `build.ts` and `hash.ts`, the CLI's resolved version, and the compressor's identity (`process.versions.zlib`). The **runtime hash** is the size hash plus the item's `interactions.ts` entry (canonically serialised), `runtime.ts`, `stats.ts` and Playwright's version. Bun's version is recorded, not hashed. The unit gate warns, and does not fail, when the local Bun differs from the report's. The release check refuses that mismatch, or `engines` pins Bun exactly. Decision 16 names the inputs that force a full run: the theme, `utils`, `_floor.svelte`, the cost app's packages, the harness, and the tool versions.

7. **The ruling check has nothing to compare with until 0.13.0 is tagged** (`:226`, `:310`). Criterion 7 compares with `budgets.json` "at the latest `v*` tag (when the file exists there)". At `v0.12.0` it does not. So from `025`'s landing to the 0.13.0 tag, `026`–`031` may raise any budget without a record, and the test passes. Two raises between tags also break the check: the records read a→b and b→c, and neither names the tag's number. "Latest" is also unclear on a release branch: by version, or reachable from `HEAD`?
   Fix: walk the file's committed history (`git log --format=%H -- scripts/cost/budgets.json`), plus the working tree against `HEAD`. Each increase between consecutive versions needs a `raised` record with those two numbers. That takes seconds and holds from the first commit. Keep `raised` records append-only. Define "names the owner" in testable terms: the ruling's landing-notes paragraph contains "the owner".

8. **Criterion 17's A/A bound will flake, and the gate's flake rate is unstated** (`:320`). Six-launch medians resampled from the memo's own A/A differences exceed ±3 ms in 6.2% of runs (EXECUTED, bootstrap); on the busier machine it would be worse. Criterion 17 sits in `bun run test:smoke`. Per item, the re-measure rule works: a budget set from one noisy run and then failed twice is 0.28% for a `dialog`-like spread and 0.03% for `button`'s. But 72 hydration figures share launches, and a bad launch hits every item together (finding 2). The run-level rate is unknown and could be several per cent.
   Fix: criterion 17 uses ±5 ms (0.3% at the measured noise), or a Hodges–Lehmann estimate with its Wilcoxon interval containing 0. Criterion 12's landing notes record an A/A run of the whole set, so the false-fail rate per full run is measured, not assumed.

9. **The CLI reaches the network and rewrites `package.json` on every add** (`:68`, `:70`). The fonts' dependency has no version, so the CLI reads it as `latest`. `latest` satisfies no pin, so every `add`, whose closure always holds the theme, asks the package registry. It writes the answer, `^5.3.0` online or `latest` offline, over the cost app's exact pins (EXECUTED, both). It also re-sorts the file and adds any package the template lacks, as a range. The build is unaffected, because `node_modules` is linked. But the harness then needs the network, the item app's tree is not the hashed one, and a gap in criterion 3 shows up only as a silent range.
   Fix: after each `add`, the harness diffs the item app's `package.json` against the template's. A package the template lacks fails the item, naming it (a run-time proof of criterion 3). Then it restores the template's file before building. State that `add` needs the network for the font lookup, or run it with the npm registry pointed at a dead address, which still exits 0 (EXECUTED). Recommended: the dead address, so runs are offline and identical.

10. **The noisy flag is badly placed and ill-suited to this machine** (`:172`, `:236`, `:245`).
    - It reads the one-minute load at the start of the runtime phase, right after four parallel builds. The load decays over about a minute, so an idle machine can read "noisy".
    - It reads only the start and the end, and misses the middle.
    - At load > cores it refuses nearly every run here: I read 41.7 and 21.9 on 10 cores while builders ran.
    - It guards the wrong figure. Paired hydration survived load 13–25 in the prototype. Response time is unpaired (`:93`), so it moves with the machine: overlays moved about 10% (memo §5).
    Fix: wait, up to a stated limit, for the load to fall below the threshold before the runtime phase. Sample the load at every launch, and record the maximum. Add an instrument check that does not depend on the operating system: the floor's own median hydration and the calibration fixture's figure must fall within a band of their committed values, or the run is noisy. State the release procedure: a quiet machine, with nothing else running.

11. **Assets are not "already compressed", and nothing budgets them** (`:77`, `:220`). WebAssembly compresses about tenfold. `tree-sitter-typescript.wasm` is 1,413,849 bytes raw and 132,982 gzipped (EXECUTED). `highlighter` imports grammar `.wasm?url` assets (`lib/highlight/languages.ts:55`). So `highlighter`, `use-highlighted-code`, `code-block`, `stage-card`, `live-console`, `chat` and `product-home` publish multi-megabyte raw asset figures that mean nothing on the wire, with no budget. A grammar that doubles goes unseen.
    Fix: gzip every compressible asset (`.wasm`, `.svg`, `.json`, `.txt`) and leave fonts and images raw. Budget `assets` like `lazy`, or give the reason it is exempt. The facts line says when an item fetches more on demand.

12. **One report holds figures from many machines** (`:172`, `:178`, `:189`). A cached run re-measures only changed items, on whatever machine runs it. The rest keep the release machine's figures, and the report has one `machine` line. Hydration is paired and partly portable. Response time is raw, so a builder's faster or slower laptop writes figures that are not comparable to their neighbours', and that can pass or fail budgets set elsewhere.
    Fix: each item's runtime entry stores the machine and run it was measured on. The release check (Q3, option 1) requires every runtime figure from one `--full` run on the release machine. Between tags, the unit gate checks runtime figures only against budgets, as drafted.

13. **`bun run check` will fail on the new files** (`:255`, `:323`). `tsconfig.json` includes `"scripts"` and excludes only `tests/smoke/fixtures`. The fixtures import their item's installed path (`#lib/components/ui/button`), which does not exist in this repository (no `src/lib/components/`). `scripts/cost/app/` is a SvelteKit app whose `tsconfig` extends a `.svelte-kit` that is never generated here.
    Fix: the Files list adds `tsconfig.json`'s `exclude` of `scripts/cost/app` and `scripts/cost/fixtures`. The fixtures are type-checked where they run instead: the smoke test runs `svelte-check` in one item app, as `blocks-add.test.ts` does. `report.json` and `budgets.json` are written in Prettier's format, or listed in `.prettierignore`, so `bun run lint` stays clean.

14. **Material 3's row-15 score uses another site than the scorecard does** (memo §7; `benchmark-scorecard.md:57`). The scorecard compares "m3.material.io, not the per-platform docs it links to", and Material 3 lost points on row 9 for that. Row 15 gives Material (a) from material-web.dev, a per-platform site. That table is also dated 2024-06-25 on the site against 2025-08-20 in the repository (READ, both). Criterion (a) asks for "the current release".
    Fix: score each system on the site the scorecard names. Material 3 then gets (a) –, with material-web.dev named in the evidence. Or amend §1's method for row 15 in the run log, and mark (a) `?` until the site's table is shown to match the current release. Either way, say which, and re-score every system on the same rule. Row 15's place in the total is undecided, since the roadmap totals rows 1–14. Say whether it joins.

15. **`026` cannot fit its cases into `025` as drafted** (`:161`–`:164`, `:305`; `026-toast.md:469`–`:485`). `026` adds `toast.burst` and `toast.progress`, each with a click and its own end state, "hydration and response time budgeted". In `025`, `interactions.ts` is keyed by item, one entry each. Criterion 2 forbids `data-cost="target"` in any fixture outside the 31. The report's `cases` has no shape. The only case `025` ships, `table.1000-rows`, is hydration only. `026` also gives a `says` verb ("shows"), but `025`'s entry fields (criterion 2: kind, target, state, viewport) have no `says`.
    Fix: key `interactions.ts` by item or `item.case`. Each entry carries `kind`, `target`, `state`, `viewport`, `says`, its clock event (finding 5) and any preparation. Criterion 2 counts entries for cases too. `cases.<case>` takes the item entry's shape: `size`, `hydrate`, `interaction`, `hash` and `runtimeHash`. With these, `026` decision 25 fits as written. Its fixture (a native button, only `toast`'s path and `svelte`) and its end states, with no timer before the first announcer write after hydration (`026` decision 10), are measurable.

16. **`025` and `022` share a file** (`:236`; `022-the-test-matrix.md:408`, `:676`). Both add checks to `scripts/site/release-check.ts`. Roadmap §2's wave table says they share lane E "but not files".
    Fix: `025`'s check lives in `scripts/cost/release.ts`, which `release-check.ts` calls in one line that lands after `022`'s. Or the roadmap records the shared file and the landing order.

17. **The memo's figures are not at the lock's versions** (memo §3, l. 114). The prototype ran `add` without `--no-deps-install`, so the CLI ran `bun add` against npm. The apps hold `bits-ui` 2.21.0 and `cn` 0.5.2, against the lock's 2.20.2 and 0.5.0 (EXECUTED). "Installed from its lock" holds only for `kit3`'s own packages. This is the drift decision 2 exists to stop.
    Fix: the memo's §3 says which versions it built with, and that `--no-deps-install` was not used. The specification's "What the research found" quotes the figures as approximate. The first real budgets come from criterion 12's run, so nothing else moves.

18. **Hydration ends at mount, and async work comes later** (`:28`, `:85`). The mark fires in the root layout's `onMount`, after the children's (confirmed independently in `026-toast.md:342`). It misses work begun on mount: highlighting, a chart's layout, `IntersectionObserver` callbacks (`proof-band`), fetched assets. For `code-block` and its kin, that is most of the cost.
    Fix: one sentence in decision 5 says what the figure leaves out. Optionally, a fixture may set a second mark, `cost:settled`, recorded beside the figure and not budgeted.

19. **Two interaction-list gaps** (`:154`–`:155`).
    - (a) `input-group` is called native, but `input-group-password.svelte:52` toggles a password's visibility, the item's own behaviour. Add `input-group`: click "Show", the input's `type` is `text`. Or say why it is left out.
    - (b) `marketing-bar` runs at 390 × 844. The floor's paired trials run at 1280 × 800, so its hydration difference mixes viewports. Hydration trials use one viewport for item and floor. The interaction's viewport applies to the interaction trial only.
    - (c) `code-block` and `stage-card` time an asynchronous clipboard write, which is browser work. Say so in their entries.

20. **Write-ins.**
    - (a) `:6` "decision 4" should be decision 2. `:6` "two `package.json` scripts" should be one (`:270`).
    - (b) `:169` "the floor first, in an order that alternates by launch" contradicts itself. Say "the order reverses each launch", or replace it with finding 2's blocks.
    - (c) `:170` "React Aria treats fewer than 6 launches as inconclusive". That comes from its Wilcoxon interval: at 5 launches, no interval reaches 95%. It is not a noise finding. The spec uses no interval. Say so, and rest 6 on the memo's §5 stability data.
    - (d) `:227` `--tighten` on runtime figures from one run locks in a lucky low. Tighten sizes freely; tighten runtime only from a `--full` run's figures.
    - (e) `:102` The catalogue's page cannot hold the 8 blocks, which are routes. Its initial JS leaves them out, while `sumOfAlone` keeps them. Compare like with like: leave blocks out of both, or count the catalogue's route chunks.
    - (f) `:71`, `:322` The guard compares mtimes. A checkout sets mtimes arbitrarily, and `static/r` is committed. Build the registry into a temporary folder and compare content, as `tests/unit/generated.test.ts` does. Keep exit code 2.
    - (g) `:321` The site's own Tailwind scans the repository; `src/app.css` has no `@source` limit. So `bg-fuchsia-950` written literally in `tests/smoke/cost.test.ts` adds a rule to the site's CSS. Build the string at run time (`"bg-" + "fuchsia-950"`).
    - (h) `:233` "It writes nothing else in the repository": `--budget` and `--tighten` write `budgets.json`. Say so.
    - (i) The memo's `separator` row (§5): "3.0 … 14.6" with a range of 17.7 should read "−3.1 … 14.6".
    - (j) `:31` Keep "a mid-tier phone" out of public text. React Aria notes that CPU throttling "does not emulate mobile hardware" (`perf/README.md` l. 129). The facts line's "under a 4× slower CPU" is right.
    - (k) React Aria measures warm module caches on fresh instances (l. 252). This spec measures cold contexts. That is defensible, as it is what a person's first click costs, but say it differs.
    - (l) `noisy` is in the `machine` object in the schema (`:190`), while the release check reads it as the run's field. Pick one place.

## Constitution checks

- §4.1 source, not a package: kept. Nothing an app installs changes, and the harness is local.
- §4.3 tokens are the one source: not touched.
- §4.4 accessible by default: not touched. The 200 ms ceiling, made a finding to fix (`:225`), follows §4.4's rule against recorded limits.
- §4.5 every input pinned: intended. Broken in practice by finding 1 (fonts), finding 9 (the CLI's npm lookups) and finding 6 (Bun not pinned). The second lockfile is consistent with `kit3`'s.
- §4.6 dependencies named and pinned: no new dependency (Bun, the locked CLI, Playwright). Held.
- §5 pipeline: research before spec, and the memo is labelled. The checkpoint (build order step 5) is placed before budgets are written, as it should be. The scorecard row is planned at landing.
- §6: no copying; the prototype is the author's own. Nothing committed.
- `AGENTS.md`: bun throughout; harness output stays outside the repository except `report.json`; open questions put the recommended option first.

## The open questions

- **Q1, the device. Agree with option 1.** One figure, under 4×. Drop "mid-tier phone" from public text (finding 20j). Option 3 does not survive finding 12: a per-machine calibration cannot rescue figures mixed across machines.
- **Q2, runtime fails the build. Agree with option 1 only with findings 2, 10 and 12 fixed and Q3 answered option 1.** Hydration, paired within blocks, holds a 25% / 8 ms margin at a measured flake rate of 0.03–0.3% per item after the re-measure. Response time is unpaired and moves with the machine. It is safe to gate only on figures from one quiet release machine. If those fixes do not land, take option 3 for response time (the 200 ms ceiling only) and option 1 for hydration.
- **Q3, where the gate runs. Agree with option 1**, adding that the release check requires every runtime figure from one `--full` run (finding 12).
- **Q4, a large-data case now. Agree with option 1.** It costs one fixture and about 30 s of runtime. It proves decision 10 before `026` adds two cases and `037` adds another, and it meets (d) honestly: a hydration figure held by a budget. Finding 15's case shape must land with it.
- **Q5, a second size figure. Agree with option 1**, if finding 4 is fixed. Otherwise the alone figure overstates every small item by `cn`, and that is the reader's first number.
- **Q6, the margins. Agree with option 1.** Sizes are deterministic, so their margin is headroom, not noise. The hydration margin's 8 ms floor sits about 2.5 standard errors above a `dialog`-like median, which with the re-measure is enough. Restrict `--tighten` on runtime (finding 20d).
- **Missing questions.** Q7: is `cn` in the floor (finding 4)? Recommended: yes. Q8: may `bun run cost` use the network (finding 9)? Recommended: no, by a dead registry address.

## Verdict

Does not land yet: findings 1 and 2 stand (criterion 3 excludes the fonts the floor imports; full-run pairing puts the floor minutes from its items), with the Medium findings 3–15 to answer before the build.

## Disposition

The author answered every finding in the specification's "Review" table, and the memo gained a dated §9. Each answer is checked below, under "Re-review".

## Re-review, 2026-11-15

- **Reviewed:** `context/specifications/025-component-cost.md` as committed at `f9e1c1a` on `release/0.13.0` (477 lines), and the memo's new §9 (`research/2026-11-15-component-cost.md`, lines 214–290). Also the prototype's new `scripts/runtime2.ts` and its outputs `out/rt2.json` and `out/rt3.json`; `026-toast.md` lines 495–502, 737, 781 and 882 as they stand; `scripts/build-registry.ts` (it takes `--out`, line 148).
- **Re-ran:** nothing in the repository was written but this file. Probes ran in `…/scratchpad/025-review/`, on ports 5342 and 5343, never 5199.
  - **The offline `add`** (decision 3.2), on the probe app with exact pins, `add dialog -y -o --no-deps-install`, `BUN_CONFIG_REGISTRY` and `npm_config_registry` at `http://127.0.0.1:9/` (EXECUTED): it exits 0 and writes `"latest"`, as the spec says. But it took **72.1 s and 72.3 s**, against 0.66 s online. Adding `npm_config_fetch_retries=0`: **2.08 s**, same result. The hidden `--no-deps`, with the registry still closed: 0.2 s, `package.json` unchanged, `app.css` byte-identical to the `--no-deps-install` run.
  - **The block design's noise** (decision 11). I re-cut the prototype's raw samples (`out/runtime-1794775089141.json`, 8 launches × 5 rounds) into floor–item–floor–item–floor blocks: three consecutive rounds' floor trials and two of the item's. Then I bootstrapped one block per launch over 6 launches (EXECUTED, 40,000 resamples).
    - The launch-level standard deviation is 6.2–11.3 ms, against 3.2–8.3 ms for the old launch medians.
    - The six-launch median's standard error is 3.4 ms for A/A, and 2.6–4.0 ms for the items.
    - A/A `|median|` exceeds 5 ms in 11.1% of resamples, and 8 ms in 6.2%.
    - The chance of failing a first budget and then its re-measure: `separator` 0.19%, `button` 0.73%, `dialog` 0.36%, `dropdown-menu` 0.02%.
  - **The instrument** (decision 12), from `out/rt2.json` and `out/rt3.json`, taken at load 25 to 36 (EXECUTED, read):
    - the floor's median hydration was 113.0 and 122.5 ms, against §5's 109.2 at load 13 to 25: +3.5% and +12.2%;
    - its launch medians ranged 89.0 to 127.4;
    - the no-op was 41.1 ms in `rt3`, launch medians 37.8 to 45.0. In `rt2` the no-op read **476.9 ms**, which the memo does not mention (R8).

### Each finding, against its answer

| # | Answer checked | Stands? |
|---|---|---|
| 1 | Decision 2.1 and criterion 3 read `font.dependency`, and decision 3.5 proves it at run time | Fixed |
| 2 | Blocks, floor–item–floor–item–floor, seeded shuffle, at the item's viewport. The claim "narrows drift, does not cancel it" is honest and matches §9.3. The cost is fewer item trials per launch, which raises the per-launch noise (R2) | Fixed; R2 follows from it |
| 3 | Decision 8 gives 63 files and 8 blocks at their routes, with targets by role. Criterion 2 checks `data-cost` in files and targets in built pages | Fixed |
| 4 | `cn` is in the floor; `utils` = floor − theme floor; Q7; criterion 8 forbids `package:cn`; the "changes only when…" wording | Fixed |
| 5 | A `start` per entry, the press gap recorded (median 0, at most 4.8 ms, EXECUTED in `rt2`), "comparable in kind", `noopMs` | Fixed |
| 6 | Two hashes, named inputs, the full-run triggers listed, Bun recorded not hashed. But the local zlib *is* hashed, and it comes from the local Bun (R3) | Partly; R3 |
| 7 | The git-history walk, two raises, append-only records, "the owner". Two gaps remain (R4) | Mostly; R4 |
| 8 | ±5 ms, and criterion 12 measures the false-fail rate. Under the new blocks ±5 ms flakes about 11% (R2) | Partly; R2 |
| 9 | Offline by a closed port, `package.json` checked and restored. A closed port is not fast (R1) | Partly; R1 |
| 10 | Wait, sample, instrument check. Workable: the busy runs sit within ±15% of a busy baseline, and a quiet baseline would flag them, which is the intent. The update rule is missing (R5) | Fixed; R5 |
| 11 | Compressible assets gzipped, `assets` budgeted, "on demand" | Fixed |
| 12 | `runs`, a `run` per entry, response time held to its budget only on the release machine, one full run at the tag | Fixed |
| 13 | `tsconfig.json` excludes, criterion 19's `svelte-check` in item apps, Prettier for both files | Fixed |
| 14 | §9.5 scores Material 3 0 on m3.material.io, with material-web.dev in the evidence. Row 15 stays out of the headline (of 56; of 60 beside it). The rubric is unchanged | Fixed |
| 15 | `<item>.<case>` keys, `start` and `says`, the case report shape, counts written as rules. `026` has not yet restated its counts (R7) | Fixed in `025`; R7 |
| 16 | `scripts/cost/release.ts`, one line after `022`'s step, each spec's part named | Fixed |
| 17 | §9.1; "approximate" | Fixed |
| 18 | Decision 5's paragraph; `cost:settled` for eight items | Fixed |
| 19 | `input-group` added (32 entries); `marketing-bar`'s block at its viewport; the clipboard note | Fixed |
| 20 | (a) to (l) each answered; I checked the header, `noisy` in the run, `--tighten`, the content guard (`build:registry --out` exists), the class built at run time, and §9.7 | Fixed |

**The counts.** 32 item entries + 39 without an interaction = 71 measured = 75 − 4 floor items. 71 − 8 blocks = 63 fixture files. With `026`: `toast`, `toast.burst` and `toast.progress` make 35 entries; 76 items, 64 files, 72 measured. These are consistent.

**The no-op as a budget offset.** Keep the budgets on the raw response time, as drafted. It is the wait a person has, and the 200 ms ceiling only means something raw. Subtracting the no-op would make response time a paired figure that travels across machines, like hydration. But the no-op is two animation frames whose phase is random per trial, so the difference adds variance where small items have little signal (2 ms of `button`'s 43). An optional `ownMs` (`ms − noopMs`), recorded and not budgeted, would let a reader see an item's own work. It is not required.

### Remaining findings

1. **R1 — High. A closed registry port is not fast: each offline `add` takes about 72 s** (decision 3.2, "fail fast"). `npm view`'s default retries back off against the closed port (EXECUTED: 72.1 s and 72.3 s, against 2.08 s with `npm_config_fetch_retries=0`).
   Failure: about 73 adds in a full run (template, theme floor, 71 item apps, catalogue, case) at 72 s, four at a time, add about 22 minutes. A cached run adds 72 s per item. Criterion 15's 8 adds plus a template take over 10 minutes, past `test:smoke`'s 300 s per-test timeout (`package.json`).
   Fix: decision 3.2 also sets `npm_config_fetch_retries=0`. Name every variable in one place in `build.ts`. Criterion 15 asserts each `add` finishes under 10 s. The hidden `--no-deps` also avoids every lookup (0.2 s, same files, EXECUTED). But it is undocumented, and it leaves no `package.json` to check, so keep `--no-deps-install` with retries off.
2. **R2 — Medium. Two item trials per block raise the noise, and the flake bars rest on the old design** (decisions 11 and 12; criteria 12 and 17). A launch-level figure is now the mean of 2 item trials minus the median of 3 floor trials. On the prototype's samples that gives an A/A standard error of 3.4 ms over 6 launches. Criterion 17's ±5 ms then fails about 11% of smoke runs on a loaded machine. After the re-measure, an item's false-fail chance is 0.2–0.7%. Across about 72 hydration figures, a loaded full run would have at least one false fail roughly one time in six (INFERRED from the per-item rates). Criterion 12 measures this on the release machine, but sets no bar to pass.
   Fix: either 3 item trials per block (floor, item, floor, item, floor, item, floor: about 7 minutes more per full run), or 8 launches. Criterion 17 runs its A/A with the same block and launches as the harness. Its bound is ±2.5 standard errors of that run's own launch-level A/A values, or ±8 ms. Criterion 12's bar: at most one figure over budget after the re-measure in the second full run. Otherwise the margins or the trial count change by a ruling in the landing notes.
3. **R3 — Medium. The size hash takes the local zlib, which comes with the local Bun** (decision 13; criterion 5). Bun is "recorded, not hashed" so another Bun only warns. But `process.versions.zlib` is Bun's own build (it printed a commit id under 1.4.4, EXECUTED). So whenever two Bun releases carry different zlib builds, criterion 5 calls every item stale, and finding 6 returns. `package.json` still declares 1.3.14 while the machine runs 1.4.4.
   Fix: the unit gate computes the size hash with the zlib named by the report's newest full run, and warns when the local one differs. The release check refuses the mismatch, as for Bun. Or pin Bun exactly and enforce it.
4. **R4 — Low. Two gaps in the ruling walk** (criterion 7).
   - (a) Deleting an item's budget in one commit and adding a higher one in the next is not a "rise between two consecutive versions". Compare each number with the last version in which that key existed.
   - (b) A shallow clone, as `actions/checkout` makes by default once `022`'s CI exists, has one version, and the walk passes with nothing to walk. Fail with a message when `git rev-parse --is-shallow-repository` is true, or `022` checks out with `fetch-depth: 0`. Say whether `instrument` values are numbers the walk holds (see R5).
5. **R5 — Low. The instrument values have no update rule** (decisions 12, 15). A Playwright or Chromium bump can move the floor's hydration by more than 15%, and then every run is noisy until `instrument` changes. Nothing says who writes it, or whether a busy run may.
   Fix: `instrument` is written only from a `--full`, release-machine run, with `--budget instrument`. The landing notes of the spec that moves it say why, and the walk in criterion 7 skips it. Also, a noisy run's response times are held only to the 200 ms ceiling, even on the release machine. Holding them to budget there turns noise into failures that the re-measure must then rescue.
6. **R6 — Low. Two hash write-ins** (decision 13).
   - The run settings (CPU rate, launches, block shape, warm-ups) must live in `runtime.ts` or be hashed. Decision 13 names `runtime.ts` but not `run.ts`, which parses `--full` and could hold them.
   - An entry's `prepare` and `state` are strings, so "canonically serialised" is exact. Say so, rather than allowing functions.
7. **R7 — Low. `026` still counts the old way** (`026-toast.md` lines 502, 737, 882). It says 34 entries, "each of those 34 fixtures holds exactly one `data-cost`", and "72 fixtures". `025` now gives 35 entries, an optional `data-cost`, 64 fixture files and 72 measured items, and `toast`'s entry needs `start: click` (`025` line 473). This is `026`'s to restate. It is listed here so the two land agreeing.
8. **R8 — Low. Two memo write-ins** (§9.4; decision 12, line 208).
   - `rt2.json`'s no-op read 476.9 ms (launch medians 463–520), against `rt3`'s 41.1. Say what was wrong in `rt2`'s floor measure and that `rt3` fixed it, so the 41 ms stands on one clean run.
   - "The floor's launch medians stayed within 96 to 117 ms" is §5's run only. At load 25 to 36 they ranged 89.0 to 127.4. The ±15% claim holds for each run's median, not for single launches. Say which.

### The open questions

- **Q1. Agree, option 1.**
- **Q2. Agree, option 1, given R2.** Hydration is paired and gated everywhere; response time is gated on the release machine; there is a re-measure. With criterion 12's bar, this is the right gate. If the second full run shows more than one false fail after the re-measure, raise the item trials before writing budgets, rather than falling back to option 2.
- **Q3. Agree, option 1.**
- **Q4. Agree, option 1.** One fixture, hydration only, and (d) met honestly by a budget. It proves the case shape before `026` adds two.
- **Q5. Agree, option 1.** With `cn` in the floor, the alone figure no longer inflates small items.
- **Q6. Agree, option 1.** Sizes are deterministic. The hydration margin's 8 ms floor is about 2 to 3 standard errors under the new blocks, enough with the re-measure if R2's bar holds. Tightening runtime only from a quiet full release run is right.
- **Q7. Agree, option 1**, the same rule as the theme.
- **Q8. Agree, option 1**, with R1's `npm_config_fetch_retries=0`. Without it, "offline" costs about 72 s per add.

### Verdict after re-review

Does not land yet: R1 stands. A closed registry port makes each `add` take about 72 s, which breaks the smoke test's timeout and adds about 22 minutes to a full run. The fix is one environment variable, measured here at 2.1 s. R2 and R3 (Medium) are to be answered in the specification before the build. With R1 fixed and R2 and R3 answered, it is fit to build; R4 to R8 may be answered in the build's landing notes.
