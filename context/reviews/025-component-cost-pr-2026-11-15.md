# Review of 025 — Component cost (the built change)

Reviews [`specifications/025-component-cost.md`](../specifications/025-component-cost.md). This reviewer wrote neither the specification nor the code.

- **Date:** 2026-11-16
- **Status:** in review. **Land after fixes.** Findings 1, 3 and 4 must be fixed on the branch before the merge. Finding 2 needs the design lead's ruling, and one owner question, before `023` lands. Finding 5 is fixed before the tag. Findings 6 to 13 are write-ins.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** the worktree `.claude/worktrees/agent-ab497f279ce348dbc`, branch `worktree-agent-ab497f279ce348dbc`: `git diff 44cec73 9827fca` (`c213a0d` the build, `9827fca` the scorecard). 100 files, +8,677 −65. Read: AGENTS.md, the constitution, `roadmap.md` §3 ("`025`, component cost") and §4, the specification with its landing notes (22 deviations, the figures, the owner's 8 answers), its spec review and re-review, and every file under `scripts/cost/` except the 63 fixtures, which were sampled (`button`, `utils`, `_floor`, `_theme-floor`). Also read for the merge: `release/0.13.0` at `a30ffa7` and then `ba8694d` (`021` landed while I worked), `026` decision 25 and its landing notes (D3), `027` decision 15, `023` decision 14 and Q5, and `022`'s branch (`2d9e852`): its `release-check.ts`, `headers.test.ts` and `matrix.yml`.
- **Re-ran:** Bun 1.4.4, 2026-11-16, 00:47 to 01:05. The one-minute load average read 8 to 17 on 10 cores, lower than the build saw. The worktree was not edited; `git status` was clean before and after. Runs that write `report.json` ran in `git archive` copies in the session scratchpad (`r025/` at `9827fca`; `merged/` at `ba8694d` with this branch's `scripts/cost/`, tests, `tsconfig.json`, `package.json` and `release-check.ts` diff applied), with `node_modules` linked and the harness's port range narrowed to 5700–5899. Never 5199.
  - `bun run check` (worktree) → **0 errors**, 0 warnings, 2,199 files, 15 s.
  - `bun test tests/unit/cost.test.ts` (worktree) → **33 pass**, 0 fail, 3,123 `expect()` calls, 0.38 s.
  - `bun test ./tests/smoke/cost.test.ts --timeout 300000` (`r025/`), **with every outbound connection but localhost denied** by a `sandbox-exec` profile (checked: `curl https://example.com` under it fails at connect) → **11 pass**, 0 fail, 112 s. A/A hydration −0.9 ms (launches −3.9 to 1.2); no-op click 44.5 ms; calibration 82.9 ms; load 10.2; one offline `add` 2,467 ms.
  - `bun scripts/cost/run.ts --only button,dialog,separator` (`r025/`, same sandbox) → exit 0, 263 s (about 150 s of it the load wait). Load median 8.9. Floor hydration **116 ms** (committed 128, −9.4%); no-op 44.3 ms (committed 41.9, +5.7%); calibration 78.2 ms; not noisy; 0 figures over budget. Sizes **byte-equal** to the committed report for all three (`button` 9,960 B JS, `dialog` 25,457, `separator` 6,953). Hydration: `button` 20.6 ms (committed 14.7; spread 15.4 to 22.2, committed 9.1 to 34.1), `dialog` 25.4 (26.3), `separator` 10.1 (8.2). Response: `button` 44.0 ms (42.1), `dialog` 93.4 (99.9).
  - `bun test tests/unit/cost.test.ts` (`merged/`) → 29 pass, **4 fail**: criteria 1 (two tests), 4 and 11, all for `link`, `button-group`, `progress` and `toast`. **Criterion 5 passes:** none of the 71 measured items is stale after `020a`, `020b`, `027a`, `026` and `021`.
  - `bun scripts/cost/run.ts --guard` (`merged/`) → **exit 2**: "static/r differs from a fresh registry build in 8 file(s): tokens/kuiper.css, …". Finding 1.
  - `bun scripts/build-registry.ts --out <tmp>` (`merged/`) → writes only `r/styles/maia/` (81 files) and `v0.13.0/r/styles/maia/` (81).
  - READ: `@sveltejs/kit` 3.1.0, `src/runtime/client/client.js:497–500`: `default_layout_loader = _app.nodes[0]; default_error_loader = _app.nodes[1]; … await Promise.all([default_layout_loader(), default_error_loader()])`. Deviation 6 is right.

## Verdict

**Land after fixes.** Does not land yet: findings 1, 3 and 4.

The measurement is sound. The floor comparison, the floor page beside the fixture, the error node in the initial set, the blocks, the instrument and the offline install all hold up, and I reproduced the sizes byte for byte on another day at another load. Three defects go first. The registry guard refuses every run on today's `release/0.13.0` (finding 1). The release check skips itself on an ambient `NODE_ENV` (finding 3). `--full --only` writes a run marked full (finding 4).

The larger question is the staleness gate (finding 2). It works as the owner's Q3 answer says. But it puts a 35-to-55-minute run on about five more 0.13.0 landings, and the tag's run overwrites every one of those figures. I recommend keeping sizes fresh at each landing, because sizes are deterministic and cheap. Runtime freshness would then move to the tag, where the release check already demands it. That needs the owner's answer, asked below.

## Acceptance criteria against evidence

1. **Fixtures and routes** — met at `9827fca`. EXECUTED: 76 items, 5 floor, 8 blocks, 63 fixtures, 71 measured. Not met on today's release (`link`, `button-group`, `progress`, `toast`): merge work, see "Merge notes".
2. **Interactions** — met. EXECUTED (unit); the smoke test matched the four items' targets. The `app-shell` and `chart` corrections are reasoned in the landing notes (finding 9).
3. **The cost app's packages** — met. EXECUTED (unit). The frozen install ran offline from the warm cache, under the sandbox.
4. **The report's shape** — met. EXECUTED.
5. **Fresh** — met. EXECUTED, in the worktree and on the merged tree.
6. **Within budget** — met. EXECUTED. My cached run at load 8.9 also held every figure.
7. **Rulings** — met. EXECUTED (unit). The name match is loose (finding 12).
8. **The breakdown** — met. EXECUTED (unit).
9. **Statistics** — met, with deviation 5. READ: the median of the Walsh averages of `[1, 2, 3, 10]`, each pair once and each value with itself, is 2.75. The criterion's text still says 2.5 (finding 13).
10. **The facts strings** — met. EXECUTED (unit).
11. **The catalogue** — met. EXECUTED: 362.6 kB against 1,051.3 kB.
12. **Two full runs** — met as recorded. READ: 1 figure over before the re-measure, 0 after. Both runs were at load 42 to 82. I did not repeat them, by the brief.
13. **The gate fails** — met. EXECUTED (unit).
14. **A rise without a ruling fails** — met. EXECUTED (unit).
15. **Determinism, offline** — met. EXECUTED with the network denied. Also reproduced across days (see Re-ran).
16. **The initial set** — met. EXECUTED; the error node is READ in SvelteKit's client.
17. **A/A, no-op, calibration** — met. EXECUTED: −0.9 ms, 44.5 ms, and 82.9 ms inside [50, 110.5].
18. **A stale build cannot leak** — met. EXECUTED.
19. **The guard; fixtures type-check** — met at `9827fca`. EXECUTED. But the guard is wrong on today's release (finding 1). Its smoke test still passes there, for the wrong reason.
20. **The suites** — partly re-run: `check` 0 errors; the cost unit and smoke files pass. I did not re-run the full `test:unit`, `test:e2e` or `test:smoke`. The landing notes' counts are READ.
21. **The scorecard** — met. READ: row 15 Kuiper 2 for (b) and (d), every reference 0. Rows 1 to 14 hold at 32 of 56; the total of 60 is 34. Movement: row 15, new, 0 → 2; headline held.
22. **An offline `add` is fast** — met. EXECUTED: 2.5 s.

## Measurement validity (brief item 1)

- **The floor comparison** — sound. An item app and the floor app differ by one `add` and one component on the page. Both are built from one template, with one lock, from fresh folders. The paired difference is what an app pays for its first item. Decision 7 says so wherever it is shown.
- **The floor's page, then the fixture** (deviation 2) — right, and required. Without it, the 8 items that never import `cn` would read about −11 kB. With it, the item app is the floor plus one item, as decision 1 defines it. The floor app and the item app use the same wrapper, so the page node is built the same way.
- **Blocks** — one small bias, INFERRED. A block is measured at `/<block>/`, while the floor's figure includes the root page's node (the floor page). The block's route never loads that node. So each block's alone JS is low by that node's gzipped size, a few hundred bytes. That is inside the 1 kB size margin. Write it in the landing notes; no fix is needed.
- **The error node in the initial set** (deviation 6) — right. READ in SvelteKit 3.1.0's client. Both apps load it, so it cancels in the difference. It matters only for the absolute floor figures.
- **Hodges–Lehmann** (deviation 5) — right, and unused. Fix the criterion's text (finding 13).
- **The margins** (Q6) — workable. Sizes are deterministic: run 2 repeated run 1 for 70 of 71 items, and I repeated three more. So a size budget's margin covers real growth, not noise. The 1 kB minimum lets a sub-kilobyte item grow several times over (`read-token`: 0.2 kB, budget 1.3 kB). That is the owner's Q6 answer, so it stays. The 5% on an item that pulls `bits-ui` lets its own code double unseen; the breakdown shows it.
- **Hydration and response at load 40 to 165** — meaningful, and they will not flap on a quiet machine. I ran at load 8.9, the quietest this review saw. All three items stayed within budget, the instrument stayed in band, and the spreads narrowed: `button` from a 25 ms range to 7. Hydration did not fall with the load; `button` read 6 ms higher. So the busy-machine budgets are loose but honest. Two gaps remain, findings 5 and 6. A hydration figure is held in a noisy run, so a cached run at load 100 to 165, the load this machine saw tonight, can fail on noise (finding 5). And the instrument band is two-sided, so a truly quiet tag run can be called noisy (finding 6).
- **"Run on a quiet machine, then `--tighten`"** — not quite enough. Three facts are missing from the procedure:
  - The run must be `--full`, because the release check wants every item from one run.
  - If that run's floor reads under 108.8 ms (128 − 15%), it is noisy. The prototype's quietest run read 109.2. A noisy run gets no runtime `--tighten`, and the release check refuses it. A second full run is then needed after `--budget instrument` (finding 6).
  - `--tighten` lowers a budget only when its headroom is over twice its margin. From my figures, `button`'s hydration budget (31) and `dialog`'s response budget (117) would stay as they are. A quiet run gives a quiet instrument, not tighter budgets.

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | The registry guard compares all of `static/r/` with `build-registry`'s output. Since `021`, `static/r/tokens/` holds 8 files that `build-tokens` writes, so every `bun run cost` exits 2 on today's release, and its advice ("run `bun run build:registry`") does not fix it | `scripts/cost/build.ts:108–133` |
| 2 | High (process) | Staleness tax. The unit test fails on any stale runtime hash. Every item's hash covers the theme item, `utils`, the cost app and four harness files, so about five more 0.13.0 landings each pay a full run. The tag's run then replaces all of their figures | `hash.ts:79–99`; `tests/unit/cost.test.ts:343–372`; landing notes, merge note 5 |
| 3 | Medium | The release check's cost step passes, silently, whenever `NODE_ENV=test` is set. That is an ambient variable, not a request | `scripts/cost/release.ts:67–72` |
| 4 | Medium | `--full --only <items>` writes a run marked `full: true` that measured only those items. `--budget instrument` and `--tighten` both trust it | `scripts/cost/run.ts:279`, `:168`, `:241–242` |
| 5 | Medium | A noisy run's hydration is still held to its budget. A cached run at load 100 or more can fail on noise, and the builder cannot raise the budget without a ruling | `scripts/cost/budgets.ts:108–131`; decision 12 |
| 6 | Medium | The instrument band is two-sided. Busy-machine values (floor 128 ms) can make a quiet tag run "noisy" (floor under 108.8), and the release procedure then needs a second full run | `scripts/cost/run.ts:139–155` |
| 7 | Low | The release check never holds the figures to their budgets. It relies on `bun run test` having run | `scripts/cost/release.ts:13–59` |
| 8 | Low | The add limit, 30 s twice, guards a missing `OFFLINE_ENV` only by its timing. Criterion 22's lone 10 s add can flake above load 100 | `build.ts:428–435`; `settings.ts` |
| 9 | Low | Interaction targets. `app-shell`'s phone menu times a sheet at 390 px, not the shell's own work. `chart`'s target is a layerchart class | `interactions.ts:306–314`, `chart` entry |
| 10 | Low | The two new files, `items.ts` and `budgets.ts`, are well placed. `items.ts` is in the size hash, so a refactor of it is a full run | `hash.ts:97` |
| 11 | Low | `runs` only grows: unreferenced runs (run 1 now) stay forever. The instrument mixes floor trials from 390 px blocks with 1280 px ones | `run.ts:512`; `runtime.ts:388–396` |
| 12 | Low | The ruling check matches the item by substring: `button`'s ruling passes on notes that name only `button-group` | `budgets.ts:227` |
| 13 | Low | Criterion 9's text still says Hodges–Lehmann of `[1, 2, 3, 10]` is 2.5; the test and deviation 5 say 2.75 | spec, criterion 9 |

## Findings, most severe first

1. **The registry guard refuses every run on today's release** (`scripts/cost/build.ts:108–133`). The guard walks every file under `static/r/` and under a fresh `build-registry --out`, and fails on any file missing from either side. `021` (landed as `ba8694d`) added `static/r/tokens/`, 8 files, written by `scripts/build-tokens.ts`, not by `build-registry`.
   Failure: EXECUTED on `ba8694d` plus this branch. `bun scripts/cost/run.ts --guard` exits 2, naming the 8 token files. `measure()` runs the guard first, so `bun run cost`, `--budget` and `--tighten` all exit 2. The message says to run `bun run build:registry`, which cannot help. Criterion 19's smoke test still passes, because it expects exit 2 anyway.
   Fix: compare only the folder `build-registry` owns and the harness serves: `walk(path.join(fresh, "styles"))` against `walk(path.join(staticR, "styles"))`. Add a smoke check that the guard passes on the real tree, so the next new file under `static/r/` is caught here.

2. **The staleness tax** (`hash.ts:79–99`; `tests/unit/cost.test.ts:343–372`; merge note 5).
   - **What is in place.** A per-item hash, yes. Each item has a size hash and a runtime hash, and `bun run cost` rebuilds and re-measures only the stale ones (`run.ts:313–321`). I confirmed it: after 5 landings, none of the 71 items is stale (EXECUTED on the merged tree).
   - **Correction to merge note 5.** `021` does not stale every item. It changed no file under `static/r/styles/` (EXECUTED, `git diff --stat a30ffa7 ba8694d`).
   - **Why the hash is still often global.** Every item's size hash includes the theme item's JSON, `utils`' JSON, every file of the cost app, and `build.ts`, `hash.ts`, `items.ts` and `settings.ts`. Every runtime hash is built on its size hash. So a change to any of those re-measures all 72 runtime figures. `--sizes-only` cannot write the report (deviation 18). The cheapest refresh is therefore the full run: 55 minutes at load 42 to 82, about 35 to 40 at load 9 (INFERRED from my run's 28 s per block over 6 launches, times 73 blocks).
   - **What it costs in 0.13.0** (INFERRED, from the specifications). `023` changes about 65 items' JSON and `utils`, a full run by its own Q5 answer. `028` touches many items' source. `029`, `031a`, `031b` and `031` each change the theme item. That is about five full runs, 3 to 5 hours. Each blocks its landing, and `report.json` behaves as a ledger file: two branches that both run the cost conflict in `floor` and `runs`.
   - **Who uses those figures.** Almost no one. The release check needs one full, quiet run of every item (`release.ts:22–30`). So the tag's run replaces every runtime figure those landings wrote. Their only lasting value is attribution: a rise found at a landing gets its ruling in the specification that caused it.
   - **Precedent.**
     - Primer's `size-limit`, Lighthouse CI's budgets and bundlewatch: the limits are committed, and the figures are measured fresh on each pull request in CI. Nothing measured is committed. GOV.UK posts size changes on pull requests (scorecard row 15).
     - API Extractor's committed `api.md`, and this repository's thumbnail manifest: a generated file is committed, and a test fails when it is stale. That works because regeneration is cheap and deterministic.
     - Sizes here are deterministic (EXECUTED twice, across days), so they fit the committed model. Runtime figures are neither cheap nor deterministic. For them, "fresh" only means "re-sampled", and the tag's run is the one that counts.
   - **Fix, the cleanest design** (recommended):
     - **(a) Sizes fresh at every landing.** The unit test keeps failing on a stale size hash. `--sizes-only` may write the size fields of stale items. It keeps their old runtime figures, and their old `runtimeHash`, so those still read as stale. A full size refresh is the build phase alone: 3 to 6 minutes quiet (decision 17), longer at load.
     - **(b) Runtime fresh at the tag.** The unit test only *warns* on a stale runtime hash, naming the items and the command. The release check already refuses anything but one full, quiet run with equal hashes; that becomes the runtime freshness gate. A builder whose specification changes an interactive item's behaviour runs `bun run cost --only <items>` (minutes) and cites the diff in the change review, as the loop already asks.
     - **(c) An output key for runtime** (the design lead's call; it keeps the hash check). The report stores a SHA-256 over each item app's built client files and the floor's (`outputHash`). The runtime key becomes that, plus the interaction entry, `runtime.ts`, `stats.ts`, `settings.ts`, `_calibrate.svelte` and Playwright's version. The unit test still computes it in seconds from the report and the source. A rebuild that yields the same output carries its runtime figures forward. `023`'s comment-only change then costs builds, not a re-measure. This is `023`'s Q5 option 2 done on outputs, so a stripping rule cannot drift. Theme changes still re-measure everything; (b) is what removes that cost.
     - **(d) When `022`'s CI is live,** the size step moves to CI per pull request (`bun run cost --sizes-only --check`, writing nothing), as `size-limit` runs for Primer. CI pins Bun 1.3.14 and the report used 1.4.4, so this needs one Bun everywhere (owner question QB).
   - (b) narrows the owner's Q3 answer, so it is asked below (QA). (a) and (c) need only the design lead's ruling in the landing notes, and should be built before `023` lands.

3. **The release check steps aside on `NODE_ENV=test`** (`scripts/cost/release.ts:67–72`). The step exits 0 and prints a line whenever the variable is set. Anything that exports it, a shell profile or a CI image, silently skips the cost gate at the tag. The only caller that needs the skip is `headers.test.ts`.
   Fix: use `022`'s pattern. `022` (`2d9e852`) rewrites `release-check.ts` as pure `Check`s, and adds `--before-ci`, which names each step it skips. `headers.test.ts` then calls `addressCheck()` directly, and spawns the script only with `--before-ci`. Fit the cost step as `costCheck(): Check`. Under `--before-ci`, skip it with a named line: "skipped (--before-ci): the cost run, which the tag's full run on the release machine gives (`025` Q3)". Remove the `NODE_ENV` branch. If `025` merges before `022`, use an explicit flag the test passes (`--skip cost`) for now, never an ambient variable. Record it as deviation 21's correction.

4. **`--full --only` writes a run marked full** (`run.ts:279`). `full = flag("--full")` ignores `--only`. So `bun run cost --full --only button` writes `full: true` for a one-item run. `--budget instrument` accepts the newest run if it is full (`:168`), and would take the instrument from two blocks' floor trials (the item's and calibration's). `--tighten` would tighten runtime budgets from it (`:241–242`). The release check catches the mixed runs, but the budgets have moved by then.
   Fix: `const full = flag("--full") && !value("--only")`, or refuse the combination with a message. Add a unit test on the parsed flags.

5. **A noisy run's hydration is held to its budget** (`budgets.ts:108–131`; decision 12). Response time in a noisy run is held only to the 200 ms ceiling. Hydration is held to its budget everywhere. Builders run cached cost runs on this machine at load 40 to 165, with five agents at once. Launch spreads at load 42 were already 25 ms wide for `button` (9.1 to 34.1), against a 31 ms budget. If the run is noisy, a builder can fail an item they did not slow, with no way out but a ruling.
   Fix: hold a hydration figure to its budget when its run is on the release machine and not noisy, as for response time. Otherwise report it with a warning, and let the tag's quiet full run gate it. A narrower option keeps a gate on noisy runs by scaling: budget × (run `floorHydrateMs` / committed `floorHydrateMs`). Either is a ruling in the landing notes; the first has the spec's own precedent.

6. **The instrument band is two-sided** (`run.ts:139–155`). A run is noisy if its floor hydration or no-op click is more than 15% *below* the committed value, as well as above it. The committed values come from a busy run (floor 128 ms). A quieter machine reads lower: 116 ms at load 8.9 (EXECUTED), and 109.2 at the prototype's quietest. Under 108.8, the tag's quiet full run is noisy. The release check refuses it, and `--tighten` skips its runtime. Then `--budget instrument` and a second full run are needed: another 35 minutes.
   Fix: make the band one-sided. Contention only slows a run, so a run is noisy when either figure is more than 15% *above* its committed value. Keep the calibration bound two-sided; it is absolute. Write the tag procedure in the landing notes and in roadmap §4: (1) a quiet machine, plugged in; (2) `bun run cost --full`; (3) `--budget instrument` if the run moved the instrument, then `--tighten`; (4) a second `--full` only if step 2 was noisy; (5) `bun scripts/site/release-check.ts`.

7. **The release check does not hold the budgets** (`release.ts:13–59`). It checks the run's provenance, and leaves budgets to `bun run test`. A tag made without the unit run would pass over a budget. Fix: add `overBudget(report, budgets)` and `missingBudgets(report, budgets)` to `costReleaseProblems`. That is two lines.

8. **The add limit** (`build.ts:428–435`; deviation 9). 30 s twice is a fair line: a busy add took 10 to 18 s, and a missing `OFFLINE_ENV` takes about 72. But it guards the variable only through timing. Criterion 22's lone add, held to 10 s, ran 2.5 s at load 10. At load 100 or more it can cross 10 s and flake the smoke suite. Fix: add a direct unit check that every CLI call goes through `addItem`, with `OFFLINE_ENV` as its only environment (read the source, or export the argument list), and keep the timing as a backstop. Write-in: criterion 22's 10 s holds "at a load under the core count".

9. **The interaction targets** (`interactions.ts`).
   - `app-shell`'s phone menu is a fair choice. The block as installed has no user, so no user menu. But the figure is mostly `sheet`'s own work, at 390 × 844, and its hydration is taken at that viewport too. `030`'s facts line should say "on a phone-width screen" for this entry. Put that in the entry's `note`, which `costFacts` already carries.
   - `chart`'s target, `rect.lc-tooltip-rect`, is layerchart's own class. A layerchart update that renames it fails loudly, as a timeout naming the target, so nothing is silent. Add to the entry's `note`: "the target is layerchart's hover band; re-check it on a layerchart update".

10. **The two new files** (`items.ts`, `budgets.ts`). Both sit in lane E's folder and are well divided. `budgets.ts` decides no figure and is rightly unhashed. `items.ts` is in every size hash (`hash.ts:97`), so tidying it forces a full run. Under finding 2(c), move `items.ts` out of the size hash: what it decides (closures, kinds) already reaches the hash through the served JSON and the fixture list.

11. **The report keeps every run** (`run.ts:512`). Run 1 is referenced by nothing, and each cached run adds one more entry. Fix: drop runs no entry, case or `floor` names, on write. Also, the instrument (`runtime.ts:388–396`) pools floor trials from the 390 px blocks (`app-shell`, `marketing-bar`) with the 1280 px ones. Take it from the 1280 px blocks only.

12. **The ruling check's name match** (`budgets.ts:227`). `notes.includes(item)` lets "`button-group`" stand for `button`, and "`table.1000-rows`" for `table`. Fix: match the name in backticks, `` `\`${item}\`` ``, as the landing notes write names.

13. **Criterion 9's text** (spec, criterion 9). Change "Hodges–Lehmann of `[1, 2, 3, 10]` is 2.5" to "2.75 (the median of the Walsh averages, each pair once and each value with itself)". The test already holds 2.75.

## Brief items 3 and 4, in short

- **`NODE_ENV=test`:** finding 3.
- **30 s twice:** accept, with finding 8's direct check.
- **The interaction targets:** finding 9.
- **The two new files:** accept, with finding 10.
- **Offline install:** proven.
  - The smoke suite ran with every non-local connection denied: the frozen template install from the warm cache, nine adds, eight builds and the runtime blocks. It passed, 11 of 11.
  - `OFFLINE_ENV` sets `npm_config_fetch_retries=0`, and an add took 2.5 s.
  - The only absolute URLs in the served items are `meta.stock.registry` and `$schema`, which the CLI does not fetch.
  - The cost app's lock pins the repository's versions, held by criterion 3.
  - The one network need, a cold Bun cache, is named in the failure message (`build.ts:393–396`).

## Constitution checks

- §4.1 source, not a package: no item changes, and nothing installed reaches back here. Met.
- §4.3 tokens are the one source: no item, token or style changes. Met.
- §4.5 every input pinned: the cost app's own `bun.lock`, held equal to the repository's. Met. Bun itself is recorded, not pinned (decision 13; QB).
- §4.6 dependencies named: none added. Met.
- §5: tests seen failing first (landing notes); the checkpoint held by the builder under delegation; the scorecard re-run, row 15 0 → 2, the headline 32 of 56 held. Met.
- §6: no commit, no push by the reviewer; no prior art copied. `size-limit`, Lighthouse CI and API Extractor are cited as models, not code.

## Merge notes

For merging after `027a`, `026` and `021`, all now on `release/0.13.0` (`ba8694d`). EXECUTED on a scratch copy of `ba8694d` with this branch applied.

1. **Fix finding 1 first.** Without it, every `bun run cost` on the merged tree exits 2.
2. **Nothing existing is stale.** `021` changed no item's JSON, and `026`, `027a`, `020a` and `020b` changed none of the 71 measured items. Criterion 5 passes on the merged tree. No full run is needed for this merge.
3. **Four new items break `bun run test:unit` at the merge** (criteria 1, 4 and 11 fail, EXECUTED). The merge must bring their cost work with it, or the release goes red:
   - `toast`: `026` decision 25 and its D3. `scripts/cost/fixtures/toast.svelte`, `toast.burst.svelte`, `toast.progress.svelte`, and three `interactions.ts` entries (`toast`, `toast.burst`, `toast.progress`; click, `click`, "shows"). 35 entries.
   - `link`, `button-group`, `progress`: `027` decision 15 (moved to `027b`'s B8 by `027a`'s landing note 10, but needed now). Three fixtures, no interactions; they join decision 9's "hydration and size only" list.
   - Counts after the merge: 80 items (5 floor, 8 blocks, 67 fixture files), 75 measured, 3 cases, 35 entries.
4. **One cached run, then first budgets.** `bun run cost` rebuilds only the 4 items, the 2 cases and the catalogue, and measures 6 blocks plus calibration. Expect 5 to 10 minutes at a moderate load (my 3-item run: 263 s, 150 s of it the load wait). Then `bun run cost --budget link,button-group,progress,toast` writes the four first budgets, and `toast`'s two case budgets with it. The landing notes cite the figures and budgets. No `raised` record is needed: `app-shell` does not yet mount `toast` (`026` D1 waits for `023`).
5. **`report.json` and `budgets.json` are ledger files.** Never hand-merge `report.json`. Take the base's copy and re-run `bun run cost`; the cache makes that cheap. Add both files to the ledger list in roadmap §5's "Ledger contention", and to each later spec's landing order, as `031b` already does.
6. **`release-check.ts` with `022`.** `022` rewrites the script into `Check`s with `--before-ci`. Whichever lands second fits the cost step in that shape (finding 3). It is skipped by name under `--before-ci`, and runs at the tag.
7. **The thumbnails' manifest.** As the builder's merge note 2 says: after the ledger lines merge, run `bun scripts/site/thumbnails.ts --hash-only` once.
8. **Correct merge note 5** in the specification: `021` stales nothing. The landings that stale every item in 0.13.0 are `023` (its Q5 answer: one full run), `029`, `031a`, `031b` and `031` (the theme item), and probably `028`. Finding 2 decides what each pays.
9. **The scorecard after the merge.** Row 15 holds at 2. (d) is still `table.1000-rows`. The run log row cites the four new items' figures.

## Questions for the owner

Recommended option first. Until they are answered, the gate stays as built (Q3's answer).

**QA. Where is a runtime figure's freshness enforced?** (Finding 2.)
1. **At the tag.** `bun run test` fails on a stale size and warns on a stale runtime figure. The release check refuses the tag without one full, quiet run of every item. A specification that changes an interactive item's behaviour measures those items and cites them in its change review. About five full runs fewer in 0.13.0.
2. **At every landing, as built.** A full run, 35 to 55 minutes, for every change to the theme, `utils`, a package or the harness. The tag's run replaces those figures.
3. **At the tag only, sizes included.** `bun run test` checks budgets and shape, and warns on any stale hash. Cheapest, but a size rise surfaces at the tag, with no specification to rule on it.

**QB. Pin one Bun everywhere?** (Finding 2(d); decision 13.) The report used Bun 1.4.4, while `022`'s CI and `package.json` say 1.3.14. Gzip bytes follow the Bun build, so CI cannot gate sizes against the report while they differ.
1. **Yes: `packageManager` and CI's `bun-version` name the release machine's Bun**, and the cost run's Bun check becomes a hard check.
2. No: sizes are gated only on the release machine, and CI reports them.
