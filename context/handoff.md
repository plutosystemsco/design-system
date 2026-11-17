# Handoff

- **Status:** the state of the work, replaced at each release.
- **Date:** 2026-11-16

## State

**Overnight, 2026-11-15 to 16** (the owner delegated decisions to the design lead: "work autonomously and do not ask questions. Use sound judgment and precedence"). Everything is on `release/0.13.0`, which the owner pushed to GitHub on 2026-11-16. Each landing below had a change review by an agent that did not build it, its fixes, a merge commit, and its worktree removed.

Landed on `release/0.13.0`, in order (each spec's Landing notes hold its figures and rulings):

1. `020a` the site's CSS reads only code (−8.7 kB gzipped of CSS on every page). `020b` the upgrade guide's renames fit the column.
2. `027a` link, button group, progress. `026` toast (D2 screen-reader files at `022`'s merge; D3 cost at `025`'s).
3. `021` tokens as DTCG 2025.10, with a resolver and published files; built CSS byte-identical. Row 5: 1 → 4.
4. `023a` API types break only between words. `022` the test matrix: seven projects, the fault ledger, the screen-reader suite, mutation sets, CI (waits on push B).
5. `024` budgets per template (nine templates after `024d`). `025` component cost (budgets for every item; row 15: 0 → 2).
6. `024d` the theme page loads no editor (760.9 → 462 kB). `024b` the site stops shipping the whole registry (−11.4 kB on every page; Button 375 → 364 kB).
7. `023` prop doc comments: every one of 1,127 prop rows described; the API table in three columns. Row 2: 2 → 3.
8. `024c` component headers hold still (CLS 0.09 → 0). `022b`, `022c`, `022d` three Firefox faults (ledger 27 → 8).
9. `027b` pagination, search field, tag. Row 1: 35 of 40, score 4.
10. `026`'s D1: `app-shell` mounts the toaster (its A1 screen-reader file is written).
16. **Run 8, a revert, and four small changes, 2026-11-17, in a cloud session** (`research/2026-11-17-the-eighth-matrix-run.md`). Run 8 held `022aa`'s 10 s bounds on real readers, passed `020d` everywhere and `022ab` at 2.88 ms, but `019b` regressed NVDA (no title; each message three times), and VoiceOver with Chrome still doubled each message. The design lead reverted it (`019e`); `019f` researches markup every reader reads once, and `019d` waits to be rebuilt on the list. Landed together, each reviewed: `019e`; `017a`, the tokens page's "Copied" said once; `022ad`, "VoiceOver not running" fails fast with one restart; `024i`, an all-digit commit hash is still a commit. Queued: `019f`, `019c`, `022ac`, `022ae` (the WebKit chart walk), `019d`, `032d`, and `032b` after the tag.
15. **Run 7, and the batch after it, 2026-11-17, in a cloud session** (`research/2026-11-17-the-seventh-matrix-run.md`). Run 7 had 15 failed jobs (run 6: 17), every reader shard inside its deadline, the dropdown hang gone, code-block's "Copied" fixed, and NVDA speaking the unchanged second submit again; `022z`'s criterion 5 met, so `019b` built. Landed together, each reviewed: `020d`, 0.12.0 was never released (the owner's ruling); `019b`, the error summary's messages read once (no list); `032c`, no `test.only` in CI; `022ab`, the streaming budget judged whole and re-set to 5 ms from CI's figures; `022aa`, every screen-reader wait bounded. Queued from run 7: `022ac` (the search count under VO chr, research), `022ad` ("VoiceOver not running"), `019c` (the title under VO chr, research), `019d` (a long message at 320 px), `024i` (an all-digit commit hash). **For the owner:** check each machine with `git tag -l v0.12.0` before the tag; push `v0.13.0` by name; `020d`'s Q1 (delete `release/0.12.0`) is open; downloading run 7's `sr-voiceover-webkit-2`, `-3` and `-4` artifacts would show why VO wk passed the four error-summary tests.
14. **Runs 5 and 6, the error summary's prop, and a structural review, 2026-11-17, in a cloud session** (`research/2026-11-17-the-fifth-matrix-run.md`, `-structural-review.md`). Runs 5 and 6 (same code) had Chromium and Firefox green and speech failures down from 82 to 33; their memo separates real faults from flakes. Landed together, each reviewed: `022t`, the error summary's `attempt` prop (the owner chose a prop and its name); `022v`, code-block's "Copied" said once; `022w`, the search count clears on a keystroke; `022x`, the dropdown wait bounded, C2 bounded, bar-glass's hover read; `022y`, the macOS hot corners off; `022z`, L3 learns VoiceOver's doubled phrase (the owner: the error summary's list-then-link reading is a double read, both readers judged alike). The next push run is `022z`'s criterion 5 and `019b`'s seen-failing. **Specified and fit to build:** `019b` (the error summary's messages read once; builds after that run), `020d` (0.12.0 was never released, the owner's ruling; after this batch), `032b` (ESLint, the owner's choice; in 0.14.0). The owner delegated choices among a spec's options to the design lead (recorded in the roadmap, §2). The structural review found the code in good order and the record behind; its High, no `forbidOnly`, is queued as `032c`.
13. **The speech suite's own faults and run 4's last browser faults, 2026-11-16, in a cloud session** (`research/2026-11-16-the-fourth-matrix-run.md`, `-the-first-speech-verdicts.md`). Run 4 (`43938398575`, on `c5cdd65`) had WebKit and Firefox green, and gave the first speech verdicts: 82 failed runs, 51 the suite's own. Landed together (the owner), each reviewed: `020c`, the upgrade guide's inline code stays in its column (a page fix, not a test allowance, the change review's finding); `022p`, the keyboard walk waits for the editor's focus; `022q`, the speech suite's rules, harness and five VoiceOver shards (a spec, three reviews, twelve findings closed); `022r`, the search field's repeated count; `022s`, the emptied tag list's name. Run 5 is their evidence: criteria 6 to 8 of `022q` and the S2 and T3 verdicts. Then `022t`, the error summary's `attempt` prop (the owner chose a prop and answered its three questions; a memo, a spec with two re-checks, a change review: lands), which waits on the next speech run. Queued: `022u` (a tag list named by `aria-labelledby`), and the perf CLS on `/components/native-select/` and `/changelog/`, which belongs to `024g` and `024h`.
12. **The matrix's faults, 2026-11-16, in a cloud session** (`research/2026-11-16-the-first-matrix-run.md`, `-the-third-matrix-run.md`, `-webkit-on-linux.md`). Landed, each reviewed: `022i`, `022j`, `022k` (run 3 confirmed them); `022l`, the reader jobs in three shards; `022f` widened to E7 in all six projects (the owner); `022m`, the code editor binds Enter; `022n`, the search field hides WebKit's cancel button; `022o`, six WebKit tests. Run 4 is their evidence. The session's environment, `design-system`, allows `cdn.playwright.dev` and has a setup script that installs the pinned Chromium and WebKit, unproven until a fresh session.
11. **Lane I's three small changes, 2026-11-16, in a cloud session:** `024e` empty code loads no grammar, `022a` Escape closes only the sub-menu, `022e` the sidebar's content is not a Tab stop in Firefox. One change review (`reviews/022ae-024e-lane-i-small-changes-pr-2026-11-16.md`, land), one merge. The ledger falls 8 → 2 (`022f`). The merge found one more wide API table (`023b`).

The scorecard's rows 1–14 read 37 (32 at `020`), row 15 reads 2. Button is about 366 kB under a 445 kB `component` budget. The last gates on the merged trees: `check` 0 errors; unit about 1,850 pass; Chromium e2e green bar load timeouts that pass alone; `release-check --before-ci` exits 0; the full release check refuses only on CI evidence and the 8 ledger lines.

**Specs ready to build next:** `028` forced colours (amended overnight: `code-block` joins it; text on state fills uses the inverted pair with `forced-color-adjust: none`, option A), `029` scoped schemes (then `029a`), `030` the accessibility status (after the re-base sweep), then lane T in order `031a`, `031b`, `031`. **The first `matrix` run** (push B, run 1 on `48c85ca`) failed 19 of 33 jobs; its triage is `research/2026-11-16-the-first-matrix-run.md`, in 11 groups. Groups 1, 3, 10 and 11 are faults in the tests or the workflow, fixed by `022i`, `022j` and `022k`. Groups 2 and 8 are budgets read on a new machine, for a ruling with CI's figures. Groups 4 to 7 and 9 wait for probes. Queued small changes and specs: `022f` (Firefox editor budgets, needs a quiet machine), `022h` (the sidebar's stop only when it scrolls), `023b` (API names break between words), `024f` (example source off first paint, a spec), `024g` (theme font fallbacks, a spec), `024h` (landings' preload), and one re-base sweep now that `024e` has landed, before `030`.

## Waiting on the owner

- **`019`'s VoiceOver listen** passed by hand (`d8d658d`). Its script is retired by `022`: the scripted VoiceOver and NVDA runs are in every `matrix` run (`tests/sr/error-summary.sr.ts`).
- **The release check, from `022`** (the design lead's ruling, 2026-11-15). The full check, `bun scripts/site/release-check.ts`, also needs an empty fault ledger and a green `matrix` push run of HEAD, so it exits 1 until push B's run and the small changes `022a` to `022f`. **A landing gate runs `bun scripts/site/release-check.ts --before-ci`**, which skips those two, names them, and exits 0 when the rest pass. The tag uses the full check.
- **`022`, the test matrix,** is merged (`7edf047`). It waits for **push B**: the first `matrix` run on GitHub, then the owner's mutation dispatch. Agents never push. The ledger holds 2 lines, both `022f`'s; `022a` and `022e` have landed.

0.12.0 was never released (the owner, 2026-11-17; `020d`). The next tag is `v0.13.0`.

- **Rulings made under the overnight delegation, for the owner to confirm or reverse:**
  - `031` Q1: the 25 high-contrast swatches approved as derived (three light swatches darkened for `sunken`).
  - `031a`: card B as the owner chose; the restricted pairs extended to status fills and charts on `sunken`; a well resets its field roles.
  - `031b` Q2's figures: disabled text 3:1 and edge 1.5:1, not the 4.5:1 and 3:1 the question's wording said (the question misstated them).
  - `024`: nine templates, CLS 0.108 accepted until the re-base, `kuiper-theme` its own template; `024d`'s static specimen in place of the live editor.
  - `023`: the three-column API table; three inert props (`FieldLegend.variant`, `ToggleGroupItem.size`, `.variant`) to 048 for deprecation.
  - `028` decision 4 amended (option A) from `022b`'s finding.
  - `027a`/`027b` checkpoints; `026`'s checkpoint and D1's `app-shell` cost raise (JS budget 79.1 → 89.5 kB).
- **`025`'s QA and QB, for the morning status** (`specifications/025-component-cost.md`, "Rulings at landing (2026-11-16)"). The design lead ruled both under the overnight delegation; the owner may reverse either. QA: a runtime figure's freshness is enforced at the tag, not at every landing, which narrows the owner's Q3 answer (`bun run test` holds sizes and budgets and warns on runtime). QB: one Bun everywhere, 1.4.4, in `package.json` and in CI's `setup-bun`.

## Before the 0.13.0 tag: the cost run

`025`'s figures gate the tag (its "Rulings at landing", the tag procedure):

1. A quiet machine, plugged in, nothing else running.
2. `bun run cost --full`.
3. If the run moved the instrument, `bun run cost --budget instrument`; then `bun run cost --tighten`.
4. A second `bun run cost --full` only if step 2's run was noisy.
5. `bun scripts/site/release-check.ts`, without `--before-ci`.

## What this work checks, and what it does not

- Every page is checked in Chromium, in both themes, by the browser suites, axe and the keyboard walk.
- Firefox and WebKit are not yet run, and no screen reader has been run but `019`'s pending listen. From 0.13.0 these are no longer limits: constitution §4.4 requires all three engines and scripted screen-reader checks.
- The glass's Firefox mask order is written to the standard, but it is not run in Firefox.
- **The lane-I merge ran in a cloud session** (2026-11-16): Linux, 4 cores, Chromium only (153, through a scratch browsers path; the pinned Playwright wants 156). Firefox and WebKit come from push B's `matrix` run (the owner's ruling, 2026-11-16). Perf and runtime cost figures are machine-bound and were not re-measured there. `code.spec.ts`'s E4, E6 at full height and E7 fail on that machine before and after the merge; push B's Linux run decides whether they are faults (`024e`'s Landing notes, "The merge").

## Next

The plan is `roadmap.md` (being written now from the inventory, the page standard, the toast memo and the scorecard). Already ruled for 0.13.0 and after (the owner, 2026-11-15):

- the rename of code names to Kuiper, with a migration guide for installed apps;
- lockup mock-ups for the Kuiper name, for the owner's approval;
- the accessibility status from the test report, with the high-contrast scheme, a forced-colours pass, and the full engine and screen-reader matrix;
- light and dark scoped to any subtree with `light-dark()` (`research/2026-11-15-scoped-schemes-and-contrast.md`), its questions to the owner first;
- prop doc comments on every item, so the API tables fill in;
- the component page standard, piloted on `button`, `dialog`, `field`, `dropdown-menu` and `error-summary`;
- a `toast` of Kuiper's own, on `status` (`research/2026-11-15-toasts.md`);
- the token file as conformant DTCG, exported as design variables;
- a functional data palette: eight categorical colours with sequential and diverging scales.

Still open from before: the product icons (G5), whose tile is ruled but not drawn, and a signature device, set aside by the owner.
