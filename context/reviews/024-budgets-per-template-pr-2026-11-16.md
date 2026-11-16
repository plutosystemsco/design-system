# Review of 024 — Budgets per template (the built change)

Reviews [`specifications/024-budgets-per-template.md`](../specifications/024-budgets-per-template.md). This reviewer wrote neither the specification nor the code.

- **Date:** 2026-11-16
- **Status:** in review. **Land after fixes.** Findings 1 and 2 must be fixed on the branch before the merge. Finding 3 needs a guard or a recorded tag blocker, either one. Finding 4 lands as the design lead proposes, with two conditions. Findings 5 to 12 are rulings to record, write-ins or merge work.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** the worktree `.claude/worktrees/agent-ad45a1bd5202112f6`, branch `worktree-agent-ad45a1bd5202112f6`: `git diff 874c5da 14d6444` (`35c37e4` the build, `14d6444` the scorecard). 5 files, +1,114 −90: `tests/e2e/budgets.ts` (new), `tests/e2e/perf.spec.ts` (rewritten), `tests/unit/budgets.test.ts` (new), the spec, the scorecard's run log. `release/0.13.0` has since moved to `a6fc673` (`026`, `021`). `perf.spec.ts` is unchanged there, so the merge is clean (READ, `git diff 874c5da a6fc673 -- tests/e2e/perf.spec.ts` is empty).
- **Re-ran:** Bun, 2026-11-16, load average 20 to 46 on 10 cores. The worktree was not edited. `git status` was clean before and after, at `14d6444`.
  - `bun run check` (worktree) → **0 errors, 0 warnings**, 2,232 files.
  - `bun test tests/unit/budgets.test.ts` (worktree) → **50 pass, 0 fail**, 220 `expect()` calls.
  - **The perf project, once:** `bun --bun playwright test --project=perf --no-deps` against the worktree's own `playwright.config.ts`, through a scratch config that spreads it and changes only the web server's port, 4173 to 5741 (this session runs on 57xx ports). The web server built the site. → **29 passed** (1 server check, 8 transfer tests, 20 paint tests), **7.9 minutes** with the build; the file's own tests **7.5 minutes**. Every probe's transfer equals the landing notes' figure to 0.1 kB. One probe did not behave as the landing notes say (finding 2).
  - **A probe of my own**, `scratchpad/024-pr/probe.ts`: one unthrottled load each of eleven pages against the worktree's `build/`, served as `perf.spec.ts` serves it (gzip, `.wasm` too), port 5761. It lists each `.wasm` request by frame and the main frame's largest files. Figures below.
  - Not run: the 27-minute sweep (as briefed), the light and dark projects, smoke. `024` changes no file they read.

## Verdict

**Land after fixes.** The harness is sound and well made. Every page is now checked, the budgets are derived and never typed, the unit test checks the arithmetic against a second copy of it, and the CI path reports LCP without gating it, as `022` Q1 requires. The perf project passed on my run, and its transfer figures reproduce to 0.1 kB.

Two things must change first. Four pages sit in `component-live` only because their example frames load tree-sitter, so their 330 kB main frames have an 840 kB budget (finding 1). And the sweep, which replaces the every-run tests, gates transfer on the throttled load. On my run the theme page's throttled load skipped tree-sitter and read 607 kB, not 760 (finding 2).

## Acceptance criteria against evidence

1. **Every page has one template** — met. EXECUTED: the unit file passes, 50 of 50; every `SITEMAP` page maps to one template and its route imports that template's layout. READ: `templateOf` throws at module load on 0 or 2 matches, so a new page that fits no rule fails the whole perf file loudly.
2. **Budgets are derived and ruled** — met, with one arithmetic slip in a ruled margin (finding 6). EXECUTED: the unit test checks `budgetOf` against its own copy of decision 4 for every template.
3. **Transfer, every page** — met. EXECUTED: 8 of 8 transfer tests pass. READ: (a) is credible. Of the two mutations in (b), the second is exact; the first was twice its stated size (finding 7).
4. **Bytes and the throttle** — met as coded, **not as the landing notes report it**. EXECUTED: on my run, `kuiper-theme` read 607 kB throttled with 0 `.wasm` in all three runs, against 760 kB unthrottled with 2. The landing notes say the throttled and unthrottled figures agreed on all 106 pages, the live pages included. The test passed, because a live page may read lower (finding 2).
5. **Paint, the probes** — met. READ: the `home` mutation in the landing notes (budget 550, received 784). EXECUTED: 20 of 20 pass.
6. **CI without a runner figure** — met for what it states. READ: `lcpBudget` and its four unit tests; the e2e annotations in the landing notes. Nothing ends the `null` state (finding 3).
7. **`.wasm`** — met. EXECUTED: `024 decision 7` passes (`content-encoding: gzip`). READ: the mutation that took out `code-editor` and `live-console`.
8. **The sweep** — met by the landing notes (107 passed, 26.7 min). Not re-run, as briefed. READ: it gates transfer on the throttled median (finding 2).
9. **The old budgets are gone** — met. EXECUTED: the unit file's three checks pass.
10. **The suites** — met for check and the perf project. EXECUTED: 7.5 minutes for the file's own tests under load, against the 8-minute target. The margin is thin (finding 11).
11. **The scorecard** — met. READ: the run-log row at `35c37e4`, 32 in total, row 8 at 4. Button reads 374 kB and 888 ms there, and 374.2 kB and 900 to 932 ms on my run.

## Findings, most severe first

1. **High. Four pages are in `component-live` for bytes the budget never counts** (`budgets.ts:86–96`, `:117`; checkpoint ruling 1).
   `live-console`, `stage-card`, `stage-hero` and `product-home` fetch tree-sitter only inside their example iframes. Transfer counts the main frame only (decision 5; `perf.spec.ts:142`). So their counted weight has no tree-sitter in it, yet they take the template whose budget exists for tree-sitter.
   Evidence (EXECUTED, the probe):

   | Page | Main frame | Iframes | `.wasm` |
   |---|---|---|---|
   | `live-console` | 327.3 kB | 1 | child: runtime 82.6, Python 67.9 |
   | `stage-card` | 327.6 | 1 | child: runtime, Bash 181.8, Python |
   | `stage-hero` | 328.0 | 1 | child: runtime, Python |
   | `product-home` | 331.4 | 1 | child: runtime, Bash, Python |

   Failure: each of the four can grow by about 510 kB (840 − 330) and pass. Under `component`, where their weight belongs, they would have about 115 kB.
   The spec caused this, not the builder. Decision 5 ties two things to one list: "may fetch `.wasm`" and "is in `component-live`". The sweep found pages that need the first and not the second.
   Fix: split the list.
   - `WASM_ALLOWED`: all nine pages. The `.wasm` check in `expectWithin` and the transfer test reads it.
   - `LIVE_HIGHLIGHT`: only the pages whose **main frame** loads tree-sitter. Today that is `code-editor`, `code-languages`, `highlighter`, `use-highlighted-code` and `kuiper-theme`. The template rule reads it.
   - The unit test requires `LIVE_HIGHLIGHT` ⊆ `WASM_ALLOWED`.
   The four pages then join `component`. No budget moves, because `component`'s heaviest page is still `sidebar`, 403.8 kB. Record it as a change to ruling 1.

2. **Medium. The sweep gates transfer on the throttled load, and a throttled load can skip tree-sitter** (`perf.spec.ts:359–388`; deviation 5; criterion 4; the landing notes, "Criterion 4").
   On my run, `/components/kuiper-theme/` read **607 kB with 0 `.wasm`** in all three throttled loads, against **760 kB with 2** unthrottled. `networkidle` fired before the editor asked for its highlighter. This is the case the spec review predicted (its finding 12). The paint test passed, because on a live page the throttled figure may be lower (`:337–343`). That rule is right for the paint test. But under `PERF_SWEEP=1` the sweep replaces the transfer tests (deviation 5). Its `expectWithin` then gates transfer on the throttled median (`:230–233`) and never compares it with the unthrottled load it has already made (`:364`).
   Failure: in the sweep before a tag, the theme page can grow by about 233 kB (840 − 607) and pass. Spec decision 6 and criterion 4 both say that where the two figures differ, the unthrottled one is the budget's.
   Fix:
   - In the sweep, gate transfer on `free.transfer`, the unthrottled load.
   - Make the same criterion-4 assertion as the paint test.
   - In the paint test, when a live page reads lower throttled, add an annotation saying so, so a report shows it.
   - Correct the landing notes. The two figures agreed on the builder's runs, not on every run. On this machine the theme page splits both ways.
   - Also record that the theme page's LCP was measured with tree-sitter in one sweep and without it in this run.

3. **Medium. Nothing ends the CI `null` path** (`budgets.ts:58`, `:179`; decision 8; build step 7).
   `ci: null` is valid forever. The unit test accepts it (`budgets.test.ts:237`). The paint test then adds an `lcp-not-gated` annotation, and nothing reads it as a failure. Once `022`'s three green runs exist, the figures sit in `report.json` and nothing asks for them. So the spec's "from then on, LCP gates on CI" depends on someone remembering step 7.
   The CLS and transfer halves are safe. On CI they still gate, through soft expects that fail the test (READ, `:231–236`; the landing notes' `CI=1` transfer mutation).
   Fix, either of these (recommended first):
   - **A guard in `scripts/site/release-check.ts`,** which already exits 1 while a placeholder stands (`SITE_ORIGIN`'s `<account>`). It would also exit 1 while any `TEMPLATES[id].ci` is `null`, naming the templates and "024 build step 7". The tag then waits for the re-base. `022` already makes the tag wait for green runs, so this adds only the reading of three of them. It is one import and a loop, outside the spec's three files, so record it as a ruling.
   - Or a line in `roadmap.md` §2's 0.13.0 notes: "`024` step 7 (the runner's LCP figures) blocks the tag."

4. **Medium. `component`'s CLS budget of 0.108 is above the web's "good" line, and `030` is next** (`budgets.ts:242`; ruling 5).
   `label` measures 0.09 in every run (EXECUTED: 0.09, 0.09, 0.09 on my run too) and `native-select` 0.087. Every other component page is at or under 0.018. So one real shift lifts the ceiling on 66 other pages from 0.02 to 0.108. 0.108 is above 0.1, Core Web Vitals' "good" threshold for CLS (READ, web.dev's CLS page; not re-fetched here).
   `030` adds a status line and a cost figure near the top of every component page. That is the kind of change that shifts layout, and under 0.108 a shift of up to 0.1 would pass.
   The design lead's path is acceptable: accept 0.108 now, file the shift as small change `024c` in lane S, and re-base after it. Two conditions:
   - **`024c` and its re-base land before `030`.** Write it into `roadmap.md` §3 beside "`024` before `030`".
   - **Record in ruling 5 that 0.108 is above 0.1,** so the budget is not read as a target.
   The alternative is a per-page allowance for `label` and `native-select` that names `024c`, with `component` held at 0.02. That keeps the guard on the other 66 pages, but it is a new mechanism the spec does not have. I would not build it for a budget meant to last one change.

5. **Medium (a ruling, not a code change). The theme page and the highlighter page load tree-sitter because of defects, not because their items need it** (checkpoint ruling 1; findings for other lanes, 3).
   - **`kuiper-theme`.** Decision 5 says the list "names the pages whose item's job is live highlighting". The theme item's job is not that. Its "An ink surface" example (`src/lib/site/examples/kuiper-theme/surface.svelte:14`, `:44`) mounts a live `CodeEditor` to show the editor's ground on the surface. On load that costs the 117.7 kB CodeMirror chunk and 150.5 kB of tree-sitter (EXECUTED, the probe). That is a third of the page. Its 760 kB sets `component-live`'s budget at 840, which leaves `code-editor` 84 kB of headroom, `highlighter` 298 and `use-highlighted-code` 400. So the defect should be fixed, and 840 kB is not a reason to keep it. The fix is a small change: the editor highlights, or mounts, when it comes into view or takes focus. The page would then fall to about 490 to 610 kB, which is still `HEAVY`. That would lift `component-heavy` from `chart`'s 530 kB, so the page may need a one-page template of its own, as `index` has. Decide that at the re-base, with its measurement.
   - **`highlighter`.** Its example says "Nothing here moves until you press Start" and "Python's grammar loads on first use" (`examples/highlighter/variants.svelte:5`, `:25–26`). That is false. `CodeBlock.Content` is given `language="python"` and an empty `code`. `useHighlightedCode` calls `loadHighlighter(lang)` whenever the language is set, even for empty code (`hooks/use-highlighted-code.svelte.ts:39–55`). The probe saw the runtime and the Python grammar fetched on load, 150.5 kB of the page's 542. Without them the page is about 392 kB, inside `component`. The fix is a small change: in the example, or in the hook (load nothing for empty code; lane I, since that is an item).
   Fix for 024: in ruling 1, mark both pages as "in `LIVE_HIGHLIGHT` pending a small change". File the two changes. Their re-base is a fall, which needs no ruling.

6. **Low. `brand`'s local LCP margin is 20% by the rule, not 15%** (`budgets.ts:289`; ruling 4).
   `/brand/imagery/` ran 772, 780 and 888 ms. (888 − 772) ÷ 772 = 15.03%. Rounded up to 5%, that is 20%. The comment and ruling 4 say 15.0% and 15%. With 20%, `brand`'s LCP budget is 788 × 1.2 = 945.6, so 950 ms, not 910. The other three widenings check out (EXECUTED, over the landing notes' table): `/brand/` 14.2% → 15; `marketing-footer` 10.9%, `empty` 10.1% and `error-summary` 10.1% → 15.
   Fix: set `margin: 0.2` and correct ruling 4. Or keep 15% as an explicit ruling that says why. Either way, the rule and the figure should agree.

7. **Low. Mutation 1 of criterion 3(b) was about twice its stated size** (the landing notes, "Criterion 3 (b)", item 1).
   The string was put in `component.svelte`'s markup. So it ships twice: in the prerendered HTML and in the component's JS. The notes' own figures show it. The lightest page went 325.6 → 508.5 kB (+182.9), `chart` 479.9 → 662.3 (+182.4), and the theme page 760 → 943 (+183). Each grew by 2 × 90.4 kB, not 90.4. That is why all 68 `component` pages failed. The notes explain the result as an effect of sizing, which is not the reason.
   The mutation still proves that a template-wide addition fails all three templates. It does not show the budgets are tight to 10 kB. Mutation 2 does that for Button exactly (+81.2 kB, failing at 455.3 against 445).
   Fix: correct the text to "about 182 kB as counted: the string ships in the HTML and the JS". Re-running at half the size is optional.

8. **Low. Deviation 4 (the largest files, not the files that grew) is right; the spec text should follow it.**
   There is no per-file baseline, so "the files that grew" cannot be computed. Six largest files plus the page's total is the most a failure can say alone. The sweep's `perf-sweep.json` already keeps each page's ten largest files. A diff against the last sweep's file names what grew.
   Fix: amend decision 6's "and the files that grew" to "and its six largest files". Say in the landing notes that a failure is read against the last sweep's `perf-sweep.json`, and keep that file (from the build sweep) in the scratchpad record or the landing notes.

9. **Low. Deviation 5 (the sweep replaces the every-run tests) is right, except for finding 2.**
   The sweep checks transfer, CLS, LCP and `.wasm` on every page, so it is a superset of the paint tests and covers every page the transfer tests do. It also loads each page unthrottled once. Finding 2's fix makes it check that load as well. Running both under `PERF_SWEEP=1` would add about 7 minutes and check nothing new.

10. **Low. Deviation 6 (soft expects, not serial) fails properly.**
    `expect.soft` records the failure and marks the test failed at its end (Playwright's documented behaviour; READ). The landing notes' mutations, each a soft-expect failure, show red tests. Without `mode: "serial"`, a failed template no longer skips the rest. After a failure Playwright starts a new worker. The `unthrottled` map is then empty, and a paint test loads its probe again (`:323–326`). That costs time but never gives a wrong pass.
    On CI, `retries: 1` and `failOnFlakyTests` (`022`) treat a slow first try as red, as decision 8 intends.

11. **Low. Test titles carry the budget, and differ on CI.**
    `024 transfer: component: every page ≤ 445 kB, 0 .wasm` and `… LCP ≤ 1270 ms` change their names at every re-base. On CI the paint test's title reads "LCP ≤ reported ms". `022`'s fault ledger and its merged report key on test titles, so a re-base renames every perf test in that history.
    Fix: name tests by template and page (`024 transfer: component`, `024 paint: component: /components/button/`), and put the figures in the annotation, which already holds them. Or accept it, and say in the landing notes that re-bases rename tests.
    Related: the file's own tests took 7.5 minutes on my run, under load, against the 8-minute target. Criterion 10 holds, with little room. A further probe or two would pass it.

12. **Low. `component`'s 445 kB is not so loose that it stops guarding. No new template for `sidebar`.**
    `sidebar` (403.8 kB) is 28 kB above the next page (`dropdown-menu`, 375.4). Its excess is its own prerendered HTML: 43.0 kB gzipped, against Button's 26.6 (EXECUTED, the probe). That is the page's content, not a leak.
    What the budget guards:
    - A change that adds weight to every component page fails at 41.2 kB, `sidebar`'s headroom. That is the guard `030` and every later spec is held to (`roadmap.md` §4).
    - A change to one ordinary page fails at 70 to 120 kB. That is loose, but `025`'s per-item cost budgets cover what an item costs an app.
    Taking `sidebar` out would tighten the template-wide guard to about 40 kB on `dropdown-menu`. That only matters if template-wide drift turns out to be the failure mode. The spec's precedent is a separate list for pages over the 500 kB line (decision 3), and `sidebar` is far under it. A per-page budget would be a new mechanism.
    Recommendation: no change now. Revisit at the re-base after `024b`, when every figure falls by about 11.6 kB.

## The deviations, in short

1. Nine live pages — **overturn in part** (findings 1 and 5): five in `LIVE_HIGHLIGHT`, all nine in `WASM_ALLOWED`.
2. A local LCP margin per template — **accept**. It is how the owner's Q2 answer has to be held. Fix `brand` (finding 6).
3. The CLS page is a probe — **accept**. It is the right call, and the unit test holds it.
4. The largest files, not the files that grew — **accept**, and amend the spec text (finding 8).
5. The sweep replaces the every-run tests — **accept, after finding 2**.
6. No serial mode, soft expects — **accept** (finding 10).
7. A paint test reuses the transfer test's unthrottled figure — **accept**. It is a real second load, from earlier in the same run, and it falls back to a load of its own.
8. Transfer to 0.1 kB — **accept**.
9. The build sweep on a scratch config — **accept**. The gate sweep ran on the real config (107 passed), and its transfer figures matched to 0.1 kB.

## The tests

- **Failing first** is credible. The unit file failed to load before its module, then 39 of 42 failed on a stub. The 3 that passed did so vacuously, and the notes say so. Criterion 3(a) named seven pages over Button's old 380 kB, and its figures match the sweep table. The mutations for criteria 5, 6 and 7 each failed at a stated figure and were restored. Criterion 6 was seen three ways: annotations on a pass, a transfer failure under `CI=1`, and LCP gating once a figure was set.
- **"Throttled transfer equals unthrottled"** is a real check on a non-live page. It compares two separate loads, made under different profiles, and it would catch a page whose bytes depend on timing. On a live page it is one-sided by design. My run shows the side it allows happens (finding 2).
- **The CI `null` path** is safe for transfer and CLS, and is not gated for LCP, as `022` Q1 rules. It needs an end (finding 3).

## Constitution checks

- §4.1 source, not a package: unaffected; the change is tests only. READ.
- §4.3 tokens are the one source: unaffected. READ.
- §4.4 accessibility: unaffected. A layout shift is a quality defect, filed as `024c` (finding 4). READ.
- §4.5, §4.6 pins and dependencies: no new dependency. READ, `bun.lock` not in the diff.
- §5 how we work: the research, spec, review, tests and code are all present, and the checkpoint's rulings are recorded in the landing notes. **The checkpoint was walked by the builder under delegation, not by the design lead.** The design lead's confirmation of rulings 1 to 7 goes in the landing notes before the merge, with findings 1, 4, 5 and 6 applied to them. The scorecard was re-run (row 8 at 4, total 32). READ.
- §6 never: no commit asked of me and none made; no prior art copied; no installed app touched. READ.

## Merge notes

- **The overlap with `022`.** `perf.spec.ts:24` imports `{ expect, test, type Browser }` from `@playwright/test`. After `022`, `test` and `expect` come from `tests/test.ts`, and `Browser` stays a type-only import from `@playwright/test`:
  ```ts
  import { expect, test } from "../test.ts";
  import type { Browser } from "@playwright/test";
  ```
  Check that `022`'s "no spec imports `test` from `@playwright/test`" unit test allows a type-only import, or import `Browser` through `tests/test.ts`. `budgets.ts` imports nothing from Playwright, so the unit suite is unaffected. `022` renames `light` and `dark` to `chromium-*`. `perf`'s `testMatch` is unchanged and `--no-deps` still applies, so nothing else moves.
- **Re-measuring after `026`, `021`, `022` and `025`.** The figures in `budgets.ts` are `874c5da`'s. Rule: **no re-base at each merge.** After each merge, run the perf project (every-run tests, about 8 minutes) on the merged tree and record any failure.
  - `026` adds `/components/toast/` to `component` and about 0.6 kB to every page. The tightest headroom is `brand`'s 30.4 kB, so it fits.
  - `021` changes no built CSS ("byte-identical") and no page in `SITEMAP`.
  - `025` adds `scripts/cost/` and no page.
  - `022` changes the import line and the CI job.
  A rise is a ruling. Only a failure prompts one, and none is expected.
- **How `024b`'s fall is applied.** Decision 4 says a template "more than 20% over its heaviest page's median tightens to the new figure" at a re-base. `024b` takes about 11.6 kB off every page, roughly 3 to 4%. Read literally, the 20% trigger never fires, and the 11.6 kB stays as headroom on every template, with nobody having ruled it. `024b`'s own spec says "No budget changes", and so does nothing.
  Fix: after `024b` (and `024c`, and the two small changes of finding 5, if they come soon), run one sweep and re-base all eight templates from it. Each figure that falls takes its new value, with no ruling. Its `ruling` names that re-base's landing note. Write in decision 4 that the 20% figure is when a re-base **must** happen, and that every re-base takes every fall. This re-base should come before `030`, so `030`'s stated cost meets the real headroom.
- **Order:** this branch's fixes (findings 1, 2, 6, 7 and the text), then the merge of `release/0.13.0` at `a6fc673` or later, then one perf run on the merged tree, then the landing. The re-base comes after `024b`, `024c` and the finding 5 changes, all lane S, one at a time, and before `030`.

## Disposition

None yet.
