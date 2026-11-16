# Review of 024e, 022a and 022e — lane I's three small changes (the built changes)

Reviews three small changes, each with its own specification:

- [`024e`](../specifications/024e-empty-code-loads-no-grammar.md), empty code loads no grammar;
- [`022a`](../specifications/022a-escape-closes-only-the-sub-menu.md), Escape closes only the sub-menu;
- [`022e`](../specifications/022e-the-sidebars-content-is-not-a-tab-stop-in-firefox.md), the sidebar's content is not a Tab stop in Firefox, when it holds a focusable item.

This reviewer wrote none of the specifications and none of the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** dispositioned; all three land.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** branch `worktree-agent-a3f878ca5d391520b`, from `1a116a4`: `c93e994` (`024e`), `a22da47` (`022a`), `be7003d` (`022e`). Source touched: `use-highlighted-code.svelte.ts`, `dropdown-menu-sub-content.svelte`, `sidebar-content.svelte`, `tests/fault-ledger.ts`, `tests/e2e/budgets.ts`, three e2e specs, the cost report, the thumbnails manifest and `static/r/`.
- **Re-ran:** Bun 1.4.4, Linux, 4 cores (Intel Xeon, 2.1 GHz), in a worktree of the branch. `git status` was clean before and after.
  - `bun run build` → exit 0. The build changed no tracked file, so the committed `static/r/` is the build's output.
  - `bun run check` → **0 errors, 0 warnings**, 2,377 files.
  - `bun run lint` → clean.
  - `bun test ./tests/unit --timeout 120000` → **1,800 pass, 2 skip, 0 fail** (the skips are `registry-comments`' 0.12.0 release guard, which skips once `package.json` reads 0.13.0). The builder's 1,801 counts one skip as a pass, or ran on another tree.
  - `playwright test -g "022a|022e|024e|N5|sidebar-icon"`, `chromium-light` and `chromium-dark` → **24 passed**, 0 failed.
  - **The three fixes reverted, the tests kept** (`git checkout 1a116a4 --` the three source files, rebuilt, `chromium-light`): the 024e, 022a and 022e tests → **3 failed**, each on the fault its specification names (".wasm requests on load", the menu content "not found", the `tabindex` and axe facts). The fixes restored → they pass. So each check catches its defect.
  - `bun run cost --only sidebar` → exit 0, but **noisy**: floor hydration 230.5 ms against the instrument's 121.9 (finding 1). The report it wrote was discarded (`git checkout -- scripts/cost/report.json`).
  - `git merge --no-commit` onto `release/0.13.0` at `48c85ca`, then aborted: three conflicts, in `tests/fault-ledger.ts`, `scripts/cost/report.json` and `src/lib/site/thumbnails/manifest.json`. `tests/e2e/budgets.ts` merges clean.
- **Not re-run:** Firefox and WebKit, and the screen-reader dry run. This machine has only Chromium, and its Playwright pin (1.64.1) expects a newer Chromium build, so the browser runs used the pre-installed Chromium 153 through a scratch config. The engine evidence for `022e`, a Firefox fault, is the builder's (finding 2). The perf project was not run: its figures are only comparable on one machine, and the re-base sweep re-measures every template.

## Acceptance criteria against evidence

### 024e

1. A test of the hook, seen failing first: no grammar for empty code, the grammar once for non-empty code — **met.** EXECUTED: `code.spec.ts` "024e. on load the highlighter page fetches no .wasm; Start fetches the runtime and Python's grammar once each" fails on the reverted hook and passes on the fix, in Chromium. The builder's notes record it failing first in all three engines.
2. `highlighter` leaves `LIVE_HIGHLIGHT` and `WASM_ALLOWED`; the page joins `component` and passes — **met, READ.** `budgets.ts` lists `code-editor` and `code-languages` only. The builder's perf run: 532.1 kB with 2 `.wasm` → 359.3 kB with 0. Not re-measured here.
3. The re-base records the move; a fall needs no ruling — **met, READ.** `component-live`'s LCP falls 1,260 → 1,010 ms, forced by the unit test that a template's figures are its own pages. That is a fall, so `024` decision 4 needs no ruling.

The builder's extra call, `use-highlighted-code`'s page also leaving `LIVE_HIGHLIGHT`, is sound. Decision 5 names the pages whose main frame loads tree-sitter on load, and that page no longer does (READ, the builder's 429.1 → 323.7 kB). **Accepted.**

### 022a

1. The four ledger lines for O3s are removed — **met, READ** (`fault-ledger.ts`'s diff). The SR dry run's 9 passes are the builder's; the readers confirm O3s at the next `matrix` run.
2. A keyboard test, seen failing first, in all six projects — **met in Chromium, EXECUTED;** the other four projects are READ from the builder's notes.

The fix sets `escapeKeydownBehavior="close"` on the sub-content. That makes its escape layer the one bits-ui hands Escape to. Its handler calls the app's `onEscapeKeydown` first, then focuses the element whose `aria-controls` names the sub-content. The handler is placed after the spread, so an app's handler cannot replace it; it is called from inside it. INFERRED, by reading: nested sub-menus also close one level at a time, since every sub-content sets `"close"` and the topmost layer is responsible.

### 022e

1. The Firefox walk's ledger lines are removed; the Chromium and WebKit walks pass unchanged — **met in Chromium, EXECUTED** (the sidebar-icon walk, both schemes). Firefox and WebKit are READ (finding 2).
2. A text-only, overflowing sidebar is one Tab stop, scrolls by arrow keys, and gives axe no `scrollable-region-focusable`; seen failing against an unconditional `-1` — **met.** EXECUTED: it fails on the unchanged item in Chromium, on axe. READ: the builder's run against an unconditional `-1`.

The builder's call, `tabindex="0"` rather than no attribute for a text-only box, is right. The builder showed WebKit never makes a scroller focusable, and axe reads the DOM, not the engine's rule. **Accepted** (with finding 3). The N5 change, absent → `-1`, keeps N5's meaning, "no stop of its own". **Accepted.**

## Findings, most severe first

1. **Medium: `sidebar`'s runtime figures are not re-measured on the instrument** (`scripts/cost/report.json`). The handoff asks this review to run `bun run cost --only sidebar`. On this machine the run is noisy: floor hydration 230.5 ms against the instrument's 121.9. It reads hydration 141.6 ms (budget 79) and interaction 145.8 ms (budget 145), both "not held". Scaled by the floor, hydration is about 75 ms, under 79, but that is not evidence.
   Failure: if the observer's first read costs more than the 12.6 ms of headroom on the instrument, the tag's cost run fails on `sidebar`.
   Fix: none before the merge. `025`'s ruling QA enforces a runtime figure's freshness at the tag, and the tag procedure's `bun run cost --full` on the instrument machine measures `sidebar` again. The merge keeps the builder's sizes and the existing runtime figures.
2. **Medium: the Firefox fix has no reviewer's run in Firefox.** `022e` fixes a Firefox fault, and `022a`'s O3s is a reader fact. Neither was re-run by this review (see "Not re-run").
   Failure: if the fix does not hold in Firefox, the sidebar-icon walk fails there.
   Fix: none needed before the merge. The ledger lines are removed, so a `matrix` run that does not see the fix turns red (`022` decision 16). Push B's run is the evidence.
3. **Low: a text-only box that does not overflow, or an empty one, is now a Tab stop with no name** (`sidebar-content.svelte:70`). An app whose sidebar shows only "No projects yet" gains an extra stop. The builder named it, with `code-block`'s `pre` as precedent.
   Fix: read the overflow too, with a `ResizeObserver` beside the `MutationObserver`, and set `tabindex="0"` only when the box both holds no stop and scrolls. A small change in lane I, not this merge.
4. **Low: elements hidden by CSS still count as stops** (`sidebar-content.svelte:4–15`). In the icon sidebar, `SidebarMenuSubButton`, `SidebarInput`, `SidebarGroupAction` and `SidebarMenuAction` are `display: none` (`group-data-[collapsible=icon]:hidden`), but `querySelector` still matches them. A box that held only those, plus text, would take `-1` and lose its keyboard scroll. No Kuiper view does this. The icon shell always shows menu buttons.
   Fix: none now. The comment above `TABBABLE` could say it matches the DOM, not what is drawn. Fold that into finding 3's change.
5. **Low: `022a` changes a prop's default, which the "small change" kind excludes** ("changes no interface", `context/README.md`). `DropdownMenuSubContent`'s `escapeKeydownBehavior` defaults to `"close"`, where bits-ui's default was used before. The changelog's bullet says so, in bold, and names the value that restores the old behaviour. So constitution §6 ("says so in its changelog") is met.
   Fix: none. The change moves the item to the WAI-ARIA pattern, and an app opts out with one prop. The upgrade guide lists interface changes that need an app to act. This needs none.

## Constitution checks

- §4.1 source, not a package: nothing reaches back to the repository at run time. Met.
- §4.3 tokens are the one source: no colour or size is added. Met.
- §4.4 accessible by default: each change moves an item toward WCAG 2.1.1 or the WAI-ARIA menu pattern. Met in Chromium; Firefox and WebKit at the `matrix` run (finding 2).
- §4.5 and §4.6, pinned and named: no dependency is added. `bun.lock` is unchanged. Met.
- §6: no code is copied. Prior art is cited (the APG menu pattern, axe's rule, Chromium's focusable-scroller rule). Each changed item's interface or behaviour change is in the changelog. Met.

## Verdict

Lands: `024e`, `022a` and `022e` each meet their criteria; two findings wait on evidence the tag and the `matrix` run supply, and three are low.

## Disposition

By the design lead, 2026-11-16. The builder's session had ended.

1. **Not fixed now.** The tag's cost run measures `sidebar` on the instrument. The merge takes the release's `report.json` and rewrites the changed items' sizes with `bun run cost --sizes-only` (the ledger rule, `roadmap.md` §2).
2. **Not fixed now.** Push B's `matrix` run is the evidence. The ledger makes a miss visible.
3. **Queued** as a lane I small change, `022h`, after the re-base sweep (`022g` is held for `022`'s Test 57). Not in 0.13.0's critical path.
4. **Folded into `022h`.**
5. **Answered** above. No guide section.

Closing verdict: lands.
