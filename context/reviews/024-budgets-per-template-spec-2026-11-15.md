# Review of 024 — Budgets per template

Reviews [`specifications/024-budgets-per-template.md`](../specifications/024-budgets-per-template.md).

- **Date:** 2026-11-15
- **Status:** in review; approve with changes. Does not land yet: findings 1 to 4 stand.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (281 lines). I checked it against these:
  - `AGENTS.md`, the constitution (§5, the small-change rule and checkpoints), `reviews/README.md`, `roadmap.md` (row `024`, §2 wave 1, §3 "`024` before `030`", §4 the loop), the scorecard (row 8's rubric, line 87, and its run table);
  - [`022`](../specifications/022-the-test-matrix.md) decision 8, its config sketch, its CI reporter and retry settings, and Q1 as the owner answered it (option 1); [`025`](../specifications/025-component-cost.md) decision 4 (assets, `.wasm`); [`020`](../specifications/020-the-kuiper-rename.md) on the upgrade guide's route and sitemap place; the audit's P14; `015` decision 23's text (spec line 839); `019a`'s landing notes (line 89).
  - The code: `tests/e2e/perf.spec.ts`, `playwright.config.ts`, `src/lib/site/sitemap.ts`, `src/lib/site/doors.ts`, every `+page.svelte` under `src/routes/(site)/`, `src/app.html`, `src/lib/site/page/frame.svelte`, `src/lib/registry/lib/highlight/{languages,tree-sitter}.ts`, `src/lib/registry/ui/code-editor/`, the examples of `code-editor`, `code-languages`, `highlighter` and `use-highlighted-code`, `scripts/bench/site.ts`, `build/` at `dad6f76`.
- **Re-ran:** nothing in the repository was written except this file. No build, no perf suite, no server. `git status --porcelain` showed one untracked file before I wrote this one (`context/research/2026-11-15-batch-a.md`). That file is not mine. Probes ran in `…/scratchpad/024-review/`.
  - **Page count** (EXECUTED, read from `sitemap.ts` and `registry.json`): 1 home + 4 doors + 75 items + 1 changelog + 21 pages from `017` (7 Foundations, 9 Brand, 5 Start) = **102**. `find src/routes/(site) -name +page.svelte` gives 103, the extra one being `404/`. So the spec's 102 is right.
  - **Layouts** (EXECUTED, a grep tally over each route's imports): 58 import `page/component.svelte`, 8 `preview/block-page.svelte`, 9 `preview/composition-page.svelte`, 13 `page/leaf.svelte`, 9 `brand/page.svelte`. `page/landing.svelte` is imported by `/start/`, `/foundations/` and `/components/`. `/brand/` imports both `page/brand.svelte` and `page/landing.svelte`. Two routes import none of these: the home page and the 404. This matches decision 1's table.
  - **The static estimate, rebuilt independently** (EXECUTED, `static.py`: gzip level 6 over each page's HTML, its `<link href="/_app/…">` files, its `<img>` files and its `import()` targets): theme 484, `code-editor` 387, `code-languages` 385, `chart` 374, `sidebar` 306, `dropdown-menu` 280, `button` 279, `code-block` 253, `font-geist` 232; `/` 224, `/start/` 224, `/changelog/` 207, `/brand/downloads/` 178, `/brand/colour/` 175. All are within 2 to 7 kB of the spec's figures, in the same order. The ranking holds.
  - **`.wasm`** (EXECUTED): `build/` has 21 `.wasm` files, 23.5 MB raw. `web-tree-sitter.wasm` is 210,688 bytes raw and 83,314 gzipped. `tree-sitter-python.wasm` is 457,883 raw and 65,092 gzipped. In `perf.spec.ts`, the harness gzips only files whose type matches `/text|javascript|json|svg/`. So `application/wasm` is served raw (READ, `perf.spec.ts` l. 55–60).
  - **Who loads tree-sitter** (READ): `CodeEditor` colours through `code-editor-highlighting.ts`, which imports `#lib/registry/lib/highlighter`. The grammars are dynamic imports of `*.wasm?url` (`languages.ts` l. 54–55; `tree-sitter.ts` l. 106–128). The `code-editor` page and the `code-languages` page both render a `CodeEditor` in their examples. `use-highlighted-code`'s examples use the hook. The `highlighter` page highlights on a button press (`variants.svelte` l. 53), so it fetches nothing on load (INFERRED). Examples render inline in the main frame unless the reader picks the other scheme (`frame.svelte` l. 49, 180–190).
  - **Figures** (READ, `019a` l. 89): the five medians match the spec's table. Decision 9's arithmetic checks out: 307 × 1.1 → 340; 868 → 960; 2,776 → 3,060; 408 → 450; 1,088 → 1,200.
  - **Prior art** (READ, fetched): web.dev's "Use Lighthouse for performance budgets" gives a budget file whose entry is `"path": "/*"`. It does not say how several patterns resolve. `size-limit`'s README gives each entry its own `path` and `limit`, and says it "throws an error if the cost exceeds the limit". The spec's description of both is right. Its label, INFERRED, can become READ for these two points.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The harness serves `.wasm` raw, and decision 5 counts it toward transfer. The `code-editor` page would read about 1.1 MB, and `component-heavy`'s budget about 1.25 MB, not 650 kB. `025` gzips `.wasm`. `code-languages` very likely fetches `.wasm` as well | decisions 3, 5, 9; criterion 7 |
| 2 | Medium | `--project=perf` runs its `light` and `dark` dependencies locally. Criterion 8's command, the 30-minute sweep and the 6-minute run all leave out the whole browser suite. No per-test timeouts are stated | decision 6; criteria 8, 10 |
| 3 | Medium | The CI re-base reads figures from job logs, from 3 runs, with a 20% margin it never measures. CI runs `retries: 1` with `failOnFlakyTests`, so one slow first try turns the run red | decision 8; Q4 |
| 4 | Medium | The INFERRED figures rest on one offset, +99 kB, taken from two pages of one template. Across templates the offset runs from 82 to 126 kB. The heavy pages' lazy loads are the least known. The headline outcomes ("about 450", "70 kB of headroom") depend on it | research; decision 9; Q1 |
| 5 | Low | Q4's option 3, and decision 8's last bullet, reopen `022` Q1, which the owner has already answered with option 1 | decision 8; Q4 |
| 6 | Low | The layout unit test has no rule for `home`, whose route imports no layout. The leaf mapping's "no door below `/`" is loose. The upgrade guide's layout is not fixed by `020` | decision 2; criterion 1 |
| 7 | Low | Not every rise is listed for the checkpoint. A fall, which needs no ruling, still has to write the `ruling` field | decisions 4, 9 |
| 8 | Low | The new cross-spec rule ("a change that adds weight states its cost") is recorded only in this spec. AGENTS.md says a rule goes into the roadmap, AGENTS.md or the constitution | decision 4; "At landing" |
| 9 | Low | Criterion 3(b)'s 60 kB mutation may not fail `component-heavy`, whose headroom is also about 60 kB | criterion 3 |
| 10 | Low | The 500 kB cap's link to row 8 is overstated. Row 8 reads Button alone, through `site.ts`, and needs LCP ≤ 1.5 s as well | decision 3; decision 9 |
| 11 | Low | The small-change judgment is right, but the reason given is wrong. 024 touches no item or page. What makes it a full spec is the rulings, the new rule and the five ruled budgets it replaces | "Not a small change" |
| 12 | Low | Under the throttle, `networkidle` can fire before a CPU-bound `.wasm` compile asks for its grammar. Criterion 4 checks only the probe pages | decision 6; criterion 4 |
| 13 | Low | Write-ins: the prior art label, the `.wasm` count across frames, and `015` decision 23's "carry no budget" being reversed | various |

## Acceptance criteria against evidence

1. Every page has one template — testable. The mapping fits the sitemap today (EXECUTED, the tally), but `home` needs its own rule (finding 6).
2. Budgets derived and ruled — testable. A fall's `ruling` field is not defined (finding 7). READ.
3. Transfer, every page — (a) is sound: by the static ranking, at least six pages are above Button. (b) depends on the mutation's size (finding 9). INFERRED.
4. Bytes do not depend on the throttle — sound for the probes. It misses the live-highlight pages (finding 12). INFERRED.
5. Paint, the probes — sound. READ.
6. CI without a runner figure — sound, and it fits `022` Q1 option 1. The record it leaves for the re-base is not fixed (finding 3). READ.
7. `.wasm` — testable. What it then counts is wrong (finding 1). READ, EXECUTED.
8. The sweep — the command also runs the dependency projects (finding 2). READ, `playwright.config.ts` l. 31–36.
9. The old budgets are gone — sound. `BUDGETS` and `COLOUR_BUDGET` are the only per-page budgets in `perf.spec.ts` (READ).
10. The suites, under 8 minutes — plausible for the `perf` tests alone. My estimate: a transfer load of about 2 s × 102 ≈ 3.4 min, plus paint at about 6 s × 30 loads ≈ 3 min. The 6 s comes from today's 15 loads in about 1.5 min. Whether the timing includes the dependencies is undefined (finding 2). INFERRED.
11. The scorecard — sound. It is the real check of row 8 (finding 10). READ.

## Findings, most severe first

1. **`.wasm` is counted raw** (`perf.spec.ts:55–60`; spec decisions 5, 3, 9; criterion 7). The harness gzips text types only. `application/wasm` goes out raw. Decision 5 says that on a `LIVE_HIGHLIGHT` page, "the `.wasm` bytes count toward transfer".
   Failure: the `code-editor` page loads `web-tree-sitter.wasm` (206 kB raw) and the Python grammar (447 kB raw) in the main frame, through `CodeEditor`'s highlighter. That adds about 650 kB to its estimated 489, about 1.1 MB in all. It joins `HEAVY`, and `component-heavy`'s budget becomes about 1.25 MB. The theme page and `chart` then sit 650 to 770 kB under their budget, and the template checks nothing. Gzipped, the same two files are 145 kB (EXECUTED). `025` decision 4 gzips `.wasm` for exactly this reason: "the raw figure would mean nothing on the wire". The `code-languages` page also renders a `CodeEditor` (READ), so it very likely fetches `.wasm` too. Decision 5's INFERRED list (`code-editor`, `use-highlighted-code`) leaves it out.
   Fix: in `measure()`'s server, gzip `application/wasm` as `025` does. No page fetches `.wasm` today, so no budget moves. Say so in decision 7. At landing, check that the host compresses `.wasm`, or state the difference. Also do one of these: (a) give the live-highlight pages their own template, `component-live`, apart from `HEAVY`; or (b) keep them in `HEAVY`, and have decision 3 state the gzipped figure they would add. Name `code-languages` as a likely member of `LIVE_HIGHLIGHT`. Decide all of this before the checkpoint rules `HEAVY`, because the answer changes which pages are heavy.

2. **`--project=perf` runs the whole suite first** (`playwright.config.ts:31–36`; criteria 8, 10; decision 6). Locally, the `perf` project has `dependencies: ["light", "dark"]`, and Playwright runs a project's dependencies unless it is given `--no-deps`. `022` keeps that dependency locally (its sketch, l. 497).
   Failure: criterion 8's `PERF_SWEEP=1 bun --bun playwright test --project=perf` first runs about 3,000 light and dark tests. The "about 30 minutes" is then the sweep plus the whole suite. Criterion 10's "the `perf` project's wall time, before and after" has no fixed meaning. The per-template transfer test also has no stated timeout. The default is 30 s; `component` alone is about 71 pages × 2 s. In the sweep, `component` is about 71 × 3 × 6 s ≈ 21 min in one test.
   Fix: give the sweep command `--no-deps`. Define criterion 10's time as the `perf` project's own tests. State each test's `setTimeout`, from the page count: about 5 s a page for transfer and about 20 s a load for the sweep, or one sweep test per page.

3. **The CI re-base has no stated record and no measured noise** (decision 8; `022` l. 474–476). The design lead is to read "the probe pages' LCP lines from the three `perf` job logs". In CI, `022` sets `retries: 1`, `failOnFlakyTests: true` and the `blob` and `dot` reporters. The merged `report.json` keeps annotations; job logs are unstructured text. Three runs of a pooled runner, possibly on different CPU models, give three samples of its noise. The +20% CI margin is chosen, not measured.
   Failure: LCP on a runner varies more than 20% between hosts. A first try over budget and a retry under it is "flaky", and `failOnFlakyTests` fails the run. The tag then waits on noise, and nothing showed the margin was enough.
   Fix: have every CI paint test write each run's LCP as an annotation, gated or not, so `matrix-report`'s `report.json` holds it. The re-base reads that file, not logs. Record the three runs' spread in the landing notes. Require the CI margin to be at least the largest observed spread of a probe's medians, and never below 20%. Note that one retry does not excuse a slow first try.

4. **One offset, from one template, carries the headline numbers** (research table; decision 9; Q1). +99 kB is measured on Button and code-block, two pages of the same layout. The other templates measure +82 and +126. The leaf row borrows the component offset; the landing row borrows the home page's. The heavy pages (theme, `code-editor`, `chart`) are the ones most likely to fetch lazy chunks the HTML does not name. On `code-editor` that is certain (finding 1).
   Failure: if `sidebar` or `dropdown-menu` fetch 30 to 40 kB more at run time than Button does, `component`'s budget moves, and so does Button's "about 70 kB of headroom". Q1's "about 450" and decision 9's "`030` can land" are presented as outcomes, but they are guesses.
   Fix: present the INFERRED column as a range, static + 82 to static + 126, and call the offset a floor for pages with lazy loads. In Q1 and decision 9, say that Button's headroom is known only at the checkpoint. Name the checkpoint as the point where `030`'s stated cost is first compared with it.

5. **Q4 reopens a settled answer** (decision 8, last bullet; Q4 option 3; `022` l. 910). The owner has answered `022` Q1 with option 1: "LCP is reported in CI now, and gates once `024` re-bases the budgets on the runner." 024's Q4 option 3, "Never", and decision 8's "If the owner answers `022` Q1 otherwise" treat that as open. AGENTS.md says an answered question is recorded where it shapes the work.
   Fix: in "Coordinates with" and decision 8, cite the answer. Drop option 3, or mark it as reopening the owner's ruling. Q4 is then only a choice of timing, options 1 or 2. Also state the window: if `022` lands first, its `perf` job must report today's LCP budgets without gating them until 024 re-bases.

6. **The mapping test has two loose ends** (decision 2; criterion 1). (a) The home route imports no layout. "A page whose route imports none of them fails it" would fail `/`. Say that `home` requires `src/routes/(site)/+page.svelte` and no shared layout. (b) "No door below `/`" should be written as `door === null && path !== "/"`. That rule covers the changelog (parent `/`) and `020`'s guide (parent `/changelog/`, `020` l. 283). `020` does not say the guide imports `leaf.svelte`. Criterion 1 will tell, but say here that if it does not, the guide's route is fixed to use it (a small change in `020`'s lane), not a new template. Also state how a route file is found: `src/routes/(site)` + `path` + `+page.svelte`.

7. **Not every rise is listed, and falls are undefined** (decisions 4, 9). Decision 9 lists the index's LCP and Button's transfer as the rises. Code-block's transfer also rises, 360 → about 450. So do Button's LCP (1,157 → about 1,200) and code-block's (1,186 → about 1,200). The checkpoint rules each one, so list every one. Decision 4 says a fall needs no ruling, but also that every change to a figure changes its `ruling` field. Say that a fall's `ruling` names the re-base's landing note, and that criterion 2 accepts it.

8. **The new rule has no home outside this spec** (decision 4; AGENTS.md "A ruling that changes a rule…"). Decision 4 binds every later spec: a change that adds weight states its cost in kB per page and fits the headroom, and a budget rises only by a ruling. P14's amendment was meant for `decisions.md`, which is now retired (audit l. 352). `roadmap.md` l. 167 has the rising rule for `025`'s item budgets only.
   Fix: add to "At landing": `roadmap.md` §4 (or AGENTS.md) gains the two sentences, citing this spec.

9. **Criterion 3(b) may not fail `component-heavy`.** Its budget is about 650 kB over a heaviest page of about 590. The headroom is about 60 kB, the size of the mutation, and rounding up to 5 kB can absorb it. Fix: size each mutation from the recorded budgets, as the largest template headroom it must exceed plus 10 kB, and print the size in the landing notes.

10. **The 500 kB cap and row 8** (decision 3; decision 9, "Row 8 stays at 4"). Row 8 reads only the Button page, through `site.ts`, counting every frame (scorecard l. 87; `site.ts` l. 163). Its score is the mean of transfer and LCP, rounded down. The cap keeps Button's transfer half at 4. The LCP half needs ≤ 1.5 s, which `component`'s local LCP budget (about 1,200 ms) keeps. "The score of every ordinary page" overstates what the scorecard reads. Fix: say "Button's transfer and LCP budgets stay inside row 8's band 4". Keep the 500 kB cap as a policy guard. Criterion 11 remains the check.

11. **Why it is not a small change.** The section says 024 "fails the fourth" test, by setting every page's budget. But 024 edits no item and no page. Its files are tests. Under the letter of the rule it touches neither. The judgment is still right, for three other reasons. It needs five owner answers and checkpoint rulings (constitution §5: a feature's build has a checkpoint). It sets a rule for later specs (finding 8). It replaces five budgets that were each ruled. Fix: give those reasons.

12. **The throttle and `networkidle`** (decision 6; criterion 4). `networkidle` waits for 500 ms with no requests. Under a 4× CPU slowdown, compiling `web-tree-sitter.wasm` before the grammar is requested can leave such a gap (INFERRED). The throttled load would then miss bytes the unthrottled one counts. Criterion 4 checks the probes, which may not include the live-highlight pages. Fix: extend criterion 4 to `LIVE_HIGHLIGHT` pages. State that where the figures differ, the unthrottled one is the budget's.

13. **Write-ins.**
   a. Research, prior art: replace "INFERRED, from general knowledge; not re-read here" with READ, citing web.dev's Lighthouse budgets article (`"path": "/*"`) and `size-limit`'s README (each entry has a `path` and a `limit`; it throws when the limit is exceeded). Keep INFERRED only for how Lighthouse resolves several matching patterns.
   b. Decision 5: say that `measure()` counts `.wasm` requests in every frame and bytes in the main frame only (`perf.spec.ts:105–110`). So the zero rule covers a block's iframes too, as it does today.
   c. Decision 5: say plainly that it reverses `015` decision 23's "which carry no budget" for `code-editor` and `use-highlighted-code`, and that 024's landing notes record the change.

## The open questions

- **Q1, heavy pages:** option 1 is the right choice. Row 8's guard and the regression signal need it. Option 3 delays `030` for an unknown cost. Decide finding 1 first, because it decides which pages are heavy and what the heavy budget means.
- **Q2, margins:** option 1 is the right choice for transfer and CLS. LCP at +10% on the release machine sits at the run-to-run spread the scorecard reports ("under 10% in LCP"). Today's +7.6% on the index and +9% on code-block have held, so it is defensible. The checkpoint should still compare it with the spread the sweep's three runs show, and widen any template whose spread passes 10%. For CI, see finding 3.
- **Q3, how often:** option 1 is the right choice. Option 2 lets a heavy new page land unseen. Option 3 costs 30 minutes a run. Add `--no-deps` (finding 2).
- **Q4, when the runner figures are set:** option 1 is the right choice. It is what the owner's `022` Q1 answer implies. Drop option 3 or mark it as reopening that answer (finding 5).
- **Q5, the 404:** option 1 is the right choice. The 404 is outside `SITEMAP`, holds no example, and imports no template's layout. `build/404.html` exists, so option 2 could be measured if it were ever wanted.

## Constitution checks

- §4.1 source, not a package: unaffected; tests only. READ.
- §4.3 tokens are the one source: unaffected. READ.
- §4.4 accessibility: unaffected; Chromium-only perf is `022`'s settled shape. READ.
- §4.5, §4.6 pins and dependencies: no new dependency. READ.
- §5 how we work: research is inline, which the rule allows for so narrow a question. A full spec, a checkpoint, and a scorecard re-run are all present. The new rule's home is missing (finding 8).
- §6 never: no commit, no copied prior art, no installed app touched. READ.

## Verdict

Does not land yet: approve with changes. Findings 1 (count `.wasm` gzipped and decide the live-highlight pages' template), 2 (`--no-deps` and timeouts), 3 (a structured record and a measured CI margin) and 4 (the offset as a range) stand. Findings 5 to 13 are text fixes. Once they are made, the spec is fit to build without a second full review.

## Disposition

None yet.
