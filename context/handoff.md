# Handoff

- **Status:** the state of the work, replaced at each release.
- **Date:** 2026-11-16

## State

**Overnight, 2026-11-15 to 16** (the owner delegated decisions to the design lead: "work autonomously and do not ask questions. Use sound judgment and precedence"). Everything is on `release/0.13.0`, local only; nothing is pushed. Each landing below had a change review by an agent that did not build it, its fixes, a merge commit, and its worktree removed.

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

The scorecard's rows 1–14 read 37 (32 at `020`), row 15 reads 2. Button is about 366 kB under a 445 kB `component` budget. The last gates on the merged trees: `check` 0 errors; unit about 1,850 pass; Chromium e2e green bar load timeouts that pass alone; `release-check --before-ci` exits 0; the full release check refuses only on CI evidence and the 8 ledger lines.

**Still building when the night ended** (worktrees in `.claude/worktrees/`, not merged):

- `024e`, `022a`, `022e`, three lane-I small changes: built and committed on `worktree-agent-a3f878ca5d391520b` (`c93e994`, `a22da47`, `be7003d`, from `1a116a4`), each seen failing first, gate green. They wait for one change review, then a merge with the release (expect conflicts in the ledger, the thumbnails manifest, `budgets.ts` and the cost report). The reviewer checks the builder's four calls: `use-highlighted-code` also leaves the live template (component-live LCP falls to 1,010 ms); a text-only sidebar box gets `tabindex="0"`; N5 now expects `-1`; and runs `bun run cost --only sidebar`. With them the highlighter page falls 532 → 359 kB and the ledger to 2 lines (`022f`).

**Specs ready to build next:** `028` forced colours (amended overnight: `code-block` joins it; text on state fills uses the inverted pair with `forced-color-adjust: none`, option A), `029` scoped schemes (then `029a`), `030` the accessibility status (after the re-base sweep), then lane T in order `031a`, `031b`, `031`. Queued small changes and specs: `022f` (Firefox editor budgets, needs a quiet machine), `024f` (example source off first paint, a spec), `024g` (theme font fallbacks, a spec), `024h` (landings' preload), and one re-base sweep after `024e` lands, before `030`.

## Waiting on the owner

- **`019`'s VoiceOver listen** passed by hand (`d8d658d`). Its script is retired by `022`: the scripted VoiceOver and NVDA runs are in every `matrix` run (`tests/sr/error-summary.sr.ts`).
- **The release check, from `022`** (the design lead's ruling, 2026-11-15). The full check, `bun scripts/site/release-check.ts`, also needs an empty fault ledger and a green `matrix` push run of HEAD, so it exits 1 until push B's run and the small changes `022a` to `022f`. **A landing gate runs `bun scripts/site/release-check.ts --before-ci`**, which skips those two, names them, and exits 0 when the rest pass. The tag uses the full check.
- **`022`, the test matrix,** is merged (`7edf047`). It waits for **push B**: the first `matrix` run on GitHub, then the owner's mutation dispatch. Agents never push. The ledger holds 8 lines (`022a` 4, `022e` 2, `022f` 2); `022a` and `022e` are built on a branch.

The order to the tag: `019`'s fixes, its commit, the owner's listen, then the local `v0.12.0` tag.

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
