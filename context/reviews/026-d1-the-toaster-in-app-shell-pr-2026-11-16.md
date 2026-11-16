# Review of 026 D1: the toaster mounts in `app-shell` (the built change)

Reviews deferred step D1 of [`specifications/026-toast.md`](../specifications/026-toast.md): its text under "Deferred steps", and its Landing notes, "D1, landed (2026-11-16)". This reviewer wrote neither the specification nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** in review. **Land after two small fixes** (findings 1 and 2). Finding 3 is a line in the Landing notes. Findings 4 to 7 are follow-ups and notes.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** the worktree `.claude/worktrees/agent-a5820eca287a63f81`, branch `worktree-agent-a5820eca287a63f81`: `git show f0cb2b4` on base `1a116a4`. 24 files, +494 −103. Besides the spec, the four largest diffs are `toast.spec.ts`, `report.json`, `toast-site.test.ts` and the two built `app-shell.json` files.
- **Read:** `AGENTS.md`; the constitution; `026`'s D1 text, decisions 23, 25 and 26, and the Landing notes; `026`'s change review, its section "D1, the deferred `app-shell` edit"; `025` decision 15 and criterion 7; `scripts/cost/budgets.ts`, `run.ts`, `settings.ts`; `tests/unit/cost.test.ts`; SvelteKit 3.1.0's `client.js` (the link handler, `popstate`, `hashchange`).
- **Re-ran:** Bun 1.4.4. The machine was loaded by other builds: load average 21 to 116 on 10 cores. The worktree was not edited, and `git status` was clean before and after. The site was served from the worktree's `build/`, with `E2E_PREBUILT=1`. No source file is newer than that build, and `diff -rq build/r static/r` is empty.
  - `bun run check` → **0 errors, 0 warnings**, 2,378 files.
  - `bun test tests/unit/toast-site.test.ts tests/unit/sr-items.test.ts tests/unit/blocks.test.ts tests/unit/cost.test.ts tests/unit/registry.test.ts` → **204 pass, 0 fail**. This includes `025` criterion 7, which walks `budgets.json`'s history up to `f0cb2b4`.
  - `E2E_PORT=5741`, `toast.spec.ts`, `--grep " (44|61|64h|74)\. "`, in `chromium-light` and `firefox-light` → **16 passed**. That is test 44 ×3, 61, 64h and 74 ×3, in each engine.
  - `E2E_PORT=5742`, `axe.spec.ts` and `theme.spec.ts`, `--grep app-shell`, in `chromium-light`, `chromium-dark` and `firefox-light` → **95 passed, 1 failed on time**. The failure was `/components/app-shell/` at 360 in Firefox, a 30 s timeout at load average 116. Run again alone (`E2E_PORT=5743`), it passed. The new view `/view/app-shell/toast/` passes axe in all three projects. Every shell view also passes, at 360, 768 and 1280, with the sheet open and with the account menu open.
  - `E2E_PORT=5748`, `blocks.spec.ts`, `--grep "app-shell|skip|shell"`, in `chromium-light` and `firefox-light` → **22 passed**.
  - `E2E_PORT=5747 SR_DRY=1`, `tests/sr/app-shell.sr.ts`, in WebKit, Chromium and Firefox → **15 passed**. That is A1 and the shell's four tests in each engine. "The skip link moves focus to main, and its heading is spoken" passes with the toaster after the skip link.
  - **The installed app, by hand.** The built registry was served on port 5745. Into fresh copies of the smoke fixtures `kit3` (SvelteKit 3, `#lib`) and `kit2` (SvelteKit 2, `$lib`), I ran `bun install --frozen-lockfile`, `shadcn-svelte add app-shell -y -o`, `vite build` and `svelte-check`. In both apps, `toast` (6 files) and `status` installed, the build wrote the site, and `svelte-check` found 0 errors in 777 and 779 files. The prerendered `app-shell.html` holds the skip link, then `toaster-status`, then `toaster-alert`, then `<header`.
  - **Probes** (scratch scripts, not committed; Playwright against the preview on 5745 and `vite dev` on 5746). They covered hydration messages, hash links, Tab order, and whether the toast paints above the header. Their results are in section 1.
  - `bun scripts/bench/kuiper.ts --rev 1a116a4` and `--rev f0cb2b4`: see finding 4.
  - **Not run:** the full smoke suite (its dev server takes a random port, outside 57xx–58xx; the by-hand install above covers D1's part of it). Also not run: WebKit, the perf project, `upgrade.spec.ts`, the release check, `breadth.ts`, `site.ts` and `depth.ts`. The builder ran the browser ones; the scorecard ones are discussed in finding 4.

## Verdict

**Land after two small fixes.** D1 is built as written. The four layout edits are word for word, and so are the changelog bullets.

The shell does what the spec asks:

- It mounts one toaster straight after the skip link.
- Its announcers are rendered on the server and kept through hydration.
- Its hooks age toasts only on real navigations.
- The skip link still works with the toaster after it.

The installed app builds under both SvelteKit 3 and 2. The cost raise follows `025`'s rule to the byte, and its record passes the ruling check.

Two things to fix first:

- The changelog tells an app that moved the layout to add "the import", but there are two (finding 1).
- The `app-shell` page never mentions the toaster it now mounts (finding 2).

## 1. The shell

### Does an app that installs `app-shell` get toasts with no further step?

**Yes, within the shell's routes.** EXECUTED: the by-hand install. `add app-shell` brings `toast`, `status`, `button` and `spinner`. The layout imports `toast` and `Toaster` and wires the two hooks. A `toast()` call from any page under that layout shows and is spoken. Nothing else is needed for toasts to work.

Two caveats. Both are by design, and neither is D1's to change:

- **Where the layout sits.** The block installs its layout at `src/routes/app-shell/+layout.svelte`. That is a nested layout until the app moves it to `src/routes/`, which the layout's comment and the page's setup list ask for. Until then, a route outside `/app-shell` has no toaster. A toast raised there waits in the queue (decision 17) and shows when the shell next mounts. The changelog's "Mount `<Toaster />` once, in the root layout (`app-shell` does)" is true once the app does its existing setup step.
- **WCAG 2.2.1.** The shipped `<Toaster />` is unbound, so timed toasts are on and no setting exists. Decision 23 leaves the binding to the app, with a comment showing how. The changelog and the guide also say so. An app that ships the shell unchanged and raises timed toasts must keep each message on the page too, or bind `timers`. Finding 2 asks the `app-shell` page to say this as well.

### The navigation hooks

**Right.** READ, SvelteKit 3.1.0's `client.js`:

- **A same-page hash link** (lines 3191–3233) sets `hash_navigating`, updates the URL and returns before `navigate()`. So neither `beforeNavigate` nor `afterNavigate` runs.
- **Back and Forward between hash entries** take the `shallow` branch of the `popstate` handler (lines 3362–3383), which returns before `navigate()`.
- **A link with `target="_blank"`** returns before `beforeNavigate` (line 3149).

EXECUTED, the probe, in Chromium and Firefox. On `/view/app-shell/toast/`, Save raised a success. I then clicked `#activity`, clicked `#members` and pressed Back. One toast was still showing.

Two edge cases also fall out of the queue's own rules (READ, `toast-queue.ts` lines 789–806):

- **Hydration.** `afterNavigate` runs once at hydration, and also when the layout mounts on entry from another layout. In both cases `navigated()` without a pending `navigating()` returns early.
- **A cancelled navigation.** A `beforeNavigate` that another handler cancels leaves a hold that releases itself after `NAV_RELEASE_MS`, 3 s.

Neither can age a toast wrongly.

### The skip link, with the toaster after it

**Works.** EXECUTED:

- **Test 64h** passes in Chromium and Firefox. The skip link, then Enter, puts focus on `main#main`. The toast stays visible, not aside, with no count line, and leaves after its 6 s. This is the case finding 1 of `026`'s change review fixed.
- **The probe's Tab order**, in both engines: Tab 1 is `app-shell-skip-link` and Tab 2 is the header's home link. The empty toaster adds no Tab stop.
- **The screen-reader dry run's skip-link test** passes in all three engines.
- **Smoke test 6b** (READ) still requires the skip link to be the first tag in `body`. It now also requires the two announcers between the skip link and `<header`. My install showed that order.

### Server rendering and hydration

**Clean.** EXECUTED:

- **Test 44** reads the prerendered HTML of `/view/app-shell/` (the shipped layout) and `/view/app-shell/toast/`. Each has exactly one `toaster-status` and one `toaster-alert`, both empty, and no region.
- **Under `vite dev`,** in Chromium, on `/view/app-shell/`, `/toast/` and `/sidebar/`, there was no console error and no hydration or mismatch message. The announcer node present at `DOMContentLoaded` is the same node after hydration, so Svelte adopted it and did not replace it.
- **The production preview** showed no console errors or warnings in Chromium or Firefox.

### Paint

EXECUTED, the probe. In each of the four views and widths I tried, the toast is the topmost element at its corners and its centre. At 1440 on the shipped layout it sits at 16 px, over the non-sticky header's row, as test 61 expects. At 1440 under the sidebar's sticky header it sits at 88 px. At 390 it spans the width at 16 px. When it covers the Menu button and that button has keyboard focus, the stack steps aside (decision 9, tested by `026`'s 64-series).

## 2. The installed app, and the extensionless import

**Smoke's `blocks-add` does install `toast` and build** (READ). It runs `add` for all seven blocks, `app-shell` among them, into two apps: `kit3` with `#lib` and `kit2` with `$lib`. Then it builds, runs `svelte-check` and lints. Test 2 now expects `toast: 6` and 236 dependency files of 266. Test 6b checks the announcers' place. I reproduced the `app-shell` half by hand (see "Re-ran"). The builder's full run reports 151 pass.

**npm is not covered, and it does not need to be for this import.** The smoke installs with Bun only, and `040` ("installs by npm and pnpm") is not built. But `index.ts`'s `import toast from "./toast"` is resolved by Vite and TypeScript, not by the package manager:

- Vite's default `resolve.extensions` tries `.mjs`, `.js`, `.mts`, then `.ts`, and never `.svelte`. The folder has no `toast.js`, so `./toast` is `toast.ts`.
- The apps' TypeScript uses `"moduleResolution": "bundler"`.
- The kit3 app's `#lib/*` subpath patterns only reach the item's folder.

A different manager could matter only by installing a different Vite or TypeScript where no lock pins them. `040` will prove that when it lands. `026`'s finding 10 offered two fixes: map `.js` to `.ts` in the API reader, or prove the install builds. D1 delivers the second. The first stays open as a follow-up; it would make `toast` import like every other item.

## 3. The cost raise

**The figure.** EXECUTED: `firstBudget("js", 85167)` returns **89,500**. That is 85,167 plus `max(5%, 1,000 B)` = 4,258.35, rounded up to the 100 B step. It is the same rule and the same function that wrote `app-shell`'s first budget: 75,267 then gave 79,100. Every other metric is within its budget: `css` 6,013 of 6,500, `lazy` 256 of 1,300, `hydrateMs` 79.9 of 95 and `interactionMs` 78.6 of 110. So only `js` is raised, as decision 25 says. The run is not noisy and is on the release machine, though sizes are held from any run.

**The record.** `{ metric: "js", from: 79100, to: 89500, date: "2026-11-16", ruling: "context/specifications/026-toast.md#landing-notes" }`. This matches the `Raised` type in `budgets.ts` field for field. `025` criterion 7's test (`checkRulings`) passes on the branch's history:

- The rise has a record with that metric and both numbers.
- `readSpec` strips the anchor and finds the file.
- The file's `## Landing notes` section names `` `app-shell` ``.

There is no JSON Schema file for `budgets.json`; the TypeScript type and that test are the schema, and both hold. The Landing notes give the item, the metric, both numbers and the reason ("`app-shell` now mounts `toast`"), as `025` criterion 7 and decision 25 ask.

**The ruling.** Decision 25 specified this raise in advance. The design lead's acceptance is recorded in the Landing notes. No `interactionMs` rises, so no owner paragraph is needed. The anchor `#landing-notes` points at the section, not the D1 entry. Leave it: records are append-only, and the check reads them across commits, so a changed record would fail criterion 7.

## Findings

### 1. Low. The changelog says "the import", and there are two

- **The defect.** Decision 26's `app-shell` bullet, copied word for word, says: "If you moved the layout into your routes, add the import and the three lines by hand (the upgrade guide shows them)." D1 adds **two** imports (`$app/navigation` and the toast's), two hook lines and `<Toaster />`. The guide's new step has it right: "add the two imports, the two navigation lines and `<Toaster />` after `<AppShellSkipLink />`". An app that adds only the toast import gets "`beforeNavigate` is not defined" from `svelte-check`, so the slip is caught, but the changelog is the migration note an app follows (constitution §6).
- **Fix.** In `CHANGELOG.md` and in decision 26's quoted bullet, write "add the two imports and the three lines by hand". Test 38's `app-shell` half can add "the two imports" to its phrase list. One line in each file.

### 2. Low. The `app-shell` page does not mention the toaster

- **The defect.** `src/routes/(site)/components/app-shell/+page.svelte` describes the shell's accessibility in order: "A skip link … first in `body`", then landmarks, header, account menu and footer. It now omits the part that comes right after the skip link. Its setup list has no word on `timers`. An adopter who reads the shell's page, not the toast's, learns about neither the toaster nor the WCAG 2.2.1 obligation. The obligation is only in the layout's comment and the changelog. D1's step list did not name this page, so this is a gap in the step, not in the build.
- **Fix.** Two bullets.
  - In accessibility, after the skip link: "Right after the skip link, the toaster's two hidden announcers, present from the first render. Toasts show at the top end; F8 moves focus to them and back. See `toast`."
  - In setup: "To meet WCAG 2.2.1, bind the toaster's `timers` to a setting the person can reach before the first toast, as the layout's comment shows, or keep every timed message on the page too."
  - The page's other checks (axe, the twin, `toast-site.test.ts`'s phrase tests) are unaffected. One page, so it can go on this branch, or follow as a small change.

### 3. Low. One deviation is unrecorded

- **The defect.** D1 asks for "the same four edits" in `src/lib/preview/app-shell-view.svelte`. The preview copy has the imports, the two hook lines and `<Toaster />`. But its comment is one line ("026 decision 23: the shipped layout's toaster and its two lines"), not D1's eight-line comment. The `import type { Snippet }` line also became `import { onMount, type Snippet }` for the window hook.
- **Assessment.** Right: the copy never ships, and `toast-site.test.ts` pins the code lines in both files. But the Landing notes say "the same edits".
- **Fix.** Add a deviation 7 to "D1, landed": "The preview copy's comment points at decision 23 instead of repeating the layout's; the copy never ships."

### 4. Process. The scorecard was not run; it does not move

- **The defect.** `AGENTS.md` asks for the scorecard after each specification lands, and the change review cites its movement. The builder skipped it, since D1 is a deferred step and adds no part. That reasoning holds for `breadth.ts` and `depth.ts`.
- **Evidence.** EXECUTED: `kuiper.ts --rev 1a116a4` against `--rev f0cb2b4`. The two JSON files differ in one count: **`interfaceChangeMarks` 14 → 15**, the new `app-shell` bullet. Row 11, change communication, already scores 3 and holds. No other count moves. `site.ts` was not run. The change adds JS only to the shell's own views, which the site templates do not count (`024`; the Landing notes' perf run, 26 of 26). So rows 6 to 8 have no input that moves. **The total holds at 36; row 15 holds at 2.**
- **Fix.** At the merge, add a run-log row to `context/research/benchmark-scorecard.md`, or a line in "D1, landed", citing this: "`kuiper.ts`: interface marks 14 → 15; no row moves."

### 5. Follow-up for `025`. A `--raise` path for `bun run cost`

- **The defect.** Deviation 6 is right about the tool. `--budget <item>` refuses an item that has a budget ("a budget rises only by a ruling"), and `--tighten` only lowers. So the one sanctioned rise, which decision 25 specified, had to be computed and typed by hand. A hand-typed record can carry a wrong `from`, a rounded figure, or a ruling link that does not resolve. Criterion 7 catches some of these, but only after the fact.
- **Proposal** (for `025`'s follow-ups, kind _small change_, since it adds a flag and no interface an app sees): `bun run cost --raise <item>[,<item>] --ruling <spec path>#<anchor>`. It writes `budgets.json` only.
  - It refuses an item with no budget (use `--budget`), and an item whose report entry is stale against the tree (its `hash` or `runtimeHash` differs): measure first.
  - For each metric whose figure is over its budget, it sets the budget to `firstBudget(metric, figure)` and appends `{ metric, from, to, date: today, ruling }`. `interactionMs` is capped at the 200 ms ceiling unless the ruling has the owner's paragraph (criterion 7's rule).
  - It holds runtime metrics only from a quiet run on the release machine, as `overBudget` does. Sizes rise from any run.
  - It touches no metric within its budget, and exits non-zero with "nothing to raise" when none is over.
  - It checks the ruling before writing: the file exists and its Landing notes name `` `<item>` ``. Export `landingNotes` from `budgets.ts` and reuse it.
  - It prints one line per raise, "`app-shell` js: 79,100 → 89,500 (85,167 measured)", for the Landing notes.
  - Tests in `cost.test.ts`, beside the `checkRulings` fixtures: a rise written; nothing over; a stale entry refused; a ruling that does not name the item refused; a noisy runtime refused; the result passes `checkRulings`.

### 6. Note. Deviations 1 to 6

1. **The view renders the shipped example page.** Right. The shipped layout's links are `#overview`, `#activity` and `#members`, and the prerender fails a page that links an id it lacks (`handleMissingId`). The site cannot relax that for one route, and turning the route's prerender off would take it out of the tested static build. Rendering the shipped page is what `/view/app-shell/` already does, so the view is the shipped layout and page plus one button. The button sits above the page's `h1`. That breaks no rule (axe passes, and no test reads heading order there). A1, 44, 61, 64h and 74 read only the button, the toaster and the skip link. `blocks.test.ts` names the file in its exception set. The view is in no sitemap, as for `013`'s and `020`'s test views.
2. **In `TEST_VIEWS`.** Right; axe and the theme check now cover it (EXECUTED).
3. **The guide's `sonner` steps.** Right, and consistent with the changelog's wording.
4. **Test 74 carries `item: app-shell`.** Right: it judges the shell's DOM order. Tests 44's shell cases, 61 and 64h judge the toast's behaviour and carry `toast`.
5. **`registry.test.ts`'s dependency set, 57 → 58.** Right; `app-shell` is the first item to name `toast`.
6. **No `--raise`.** Right; see finding 5.

### 7. Note. The window hook ships on the public site

`window.kuiperToast` is set in the preview copy, which renders the site's five non-shipped shell views. Those are public pages. It is harmless: it exposes the same `toast` any script on the page could import, and it is not in the shipped layout, which `toast-site.test.ts` checks. The spec asked for it. No change.

## Merge notes for `release/0.13.0`

`release/0.13.0` is now at **`7577051`**, not `62eda90`. `022b`, `022c` and `022d` merged after `62eda90`. Since this branch's base `1a116a4`, the release has changed 23 files. Only one of them is a file D1 also changes: `src/lib/site/thumbnails/manifest.json`. `027b` (branch `worktree-agent-ad07a920cc7526ca7`, merged with `62eda90`) and `022a`/`024e` (branch `worktree-agent-a3f878ca5d391520b`) are also near landing. The ledger files land one build at a time (`AGENTS.md`). Whichever lands second regenerates what is listed below.

1. **The thumbnails manifest** (conflicts). The release rewrote every hash (`024c`'s and `022b`–`d`'s stage files feed the hash). Take the release's `manifest.json` and pictures. Then, on the merged tree's build, run `bun scripts/site/thumbnails.ts --no-build app-shell`, then `toast`. The builder found the pictures byte-identical (an empty toaster draws nothing), so expect only the two hashes to move. If they come out identical again, `--hash-only` is enough. Then run `bun test tests/unit/thumbnails.test.ts`. If `027b` has landed first, its three new pictures and hashes are in the manifest already; keep them.
2. **`CHANGELOG.md`** (conflicts with `027b`, and maybe `022a`/`024e`). `027b` puts its `pagination`, `search-field` and `tag` bullets straight after the `toast` bullet. D1 puts the `app-shell` bullet in the same place, and test 38's `app-shell` half requires it **immediately** after `toast` (`lines.indexOf(shell) === lines.indexOf(b) + 1`). So the merged order is `toast`, `app-shell`, `pagination`, `search-field`, `tag`. Keep D1's edited `toast` bullet, with "(`app-shell` does)" and "if you do not use `app-shell`"; `027b` did not touch that line. Then run `toast-site.test.ts` and `027b`'s `component-data.test.ts`, which reads the changelog by item.
3. **`registry.json` and `static/r/…/index.json`, both copies.** `027b` adds three items; D1 adds `"toast"` to `app-shell`'s dependencies. The text likely merges clean. Then run `bun run build:registry` and confirm `static/r` and `static/v0.13.0/r` have no diff left. Then run `registry.test.ts`: `deps.size` is 58 (`027b` names no new dependency), and `UI_COUNT` is `027b`'s 64.
4. **`scripts/cost/budgets.json`.** `027b` appends three items at the end; D1 edits `app-shell` in the middle. It should merge clean. Do not change D1's `raised` record: it is append-only, and criterion 7 compares it across commits.
5. **`scripts/cost/report.json`** (conflicts with `027b` and `022a`/`024e`). Both add a run to `runs`, and both rewrite `floor`. Keep every run and every item entry. For `floor`, keep the later run's. Then run `bun test tests/unit/cost.test.ts`. **If `022a` has landed** (it edits `dropdown-menu-sub-content.svelte`, a dependency of `app-shell`), `app-shell`'s size entry goes stale. Re-measure with `bun run cost --only app-shell`. The new `js` must stay at or under 89,500. If it does, keep the budget and the record as they are; never edit a record to a new figure. If it does not, that needs a second ruling and a second record.
6. **`tests/e2e/pages.ts`, `tests/sr/items.ts`, `tests/unit/registry.test.ts`.** `027b` edits each, in other hunks (`ITEMS`, its `ITEMS_027B` lists, three `SR_ITEMS` lines after `toast`, and the `GROUPS`). Expect clean merges. Confirm `app-shell: ["live", "focus", "overlay"]` survives. Then run `sr-items.test.ts`, and `mutations.test.ts`: A1 hears `toast:polite`, which no patch targets, so `027b`'s re-derived `expected.json` should not move.
7. **After the merge:**
   - `bun run check`;
   - the unit suite;
   - `toast.spec.ts` and `blocks.spec.ts` in Chromium and Firefox;
   - `axe.spec.ts --grep app-shell`;
   - the screen-reader dry run of `app-shell.sr.ts`;
   - `bun run test:smoke`, for its counts (266 with `027b`, which adds nothing to the seven blocks' dependencies);
   - the scorecard line of finding 4.
