# Review of 001 — Tokens and the registry (the built change)

Reviews [`specifications/001-tokens-and-the-registry.md`](../specifications/001-tokens-and-the-registry.md).

- **Status:** dispositioned; lands
- **Date:** 2026-10-27
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted working tree on 2026-10-27 (nothing committed yet). Three tracked files had changed: `.gitignore`, which is the change's, and `context/decisions.md` and `context/handoff.md`, which are not under review.
- **Re-ran:** under Bun 1.3.14, in this order, in the repository unless said otherwise. No `node` or `npx` was used.
  - `bun install --frozen-lockfile` → exit 0, "Checked 86 installs across 137 packages (no changes)".
  - `bun run check` → exit 0. `COMPLETED 400 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`. Two "failed to load config" lines name `context/prior_art/shadcn-svelte/{docs,repro}/vite.config.ts`; they are noise. `tsc --listFilesOnly` gives 380 program files plus 15 `.svelte` files, so no prior-art file is counted.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!".
  - `bun run build:tokens`, twice → exit 0 both times, "no changes" both times. SHA-256 before, between and after: `registry.json` `801c725b…4cdb`, `src/app.css` `b1d9223b…00a1`, unchanged. The mtimes did not move either.
  - `bun run build:registry` (after deleting `static/r` and `static/v0.1.0`) → exit 0. 7 files in `static/r/styles/maia/`, 7 in `static/v0.1.0/r/styles/maia/`, `diff -r` identical.
  - `bun run build` (after deleting `build/`) → exit 0. `build/r/styles/maia/` 7, `build/v0.1.0/r/styles/maia/` 7, prerendered `index.html` files 7 (`/` and the 6 items).
  - `bun run test:unit` → exit 0. 209 pass, 0 fail, 1133 `expect()` calls, 8 files.
  - `bun run test:e2e` → exit 0. 130 passed in 35.4 s (5 files × 2 projects). No retries are configured, and none were reported.
  - `bun run test:smoke` → exit 0. 22 pass, 0 fail, 115 `expect()` calls, 2 files, 16.8 s.
  - `bun run dev` (after deleting `static/r` and `static/v0.1.0`) → `GET /r/styles/maia/index.json` answered 200 after 2 s. A JSON array of 6 items, in registry order. The server was then stopped.
  - `bun.lock` queried for the 19 packages of decision 4 → 19 of 19 resolve to the table's versions. `@types/node` arrives transitively at 26.6.5.
  - A clean copy: the files git does not ignore (minus `context/`), copied to a scratch folder outside the repository. There, `bun install --frozen-lockfile` exit 0; `check` 0 errors, 0 warnings; `lint` exit 0; `test:unit` 209 pass; `bun run dev` with no `static/` served 6 items after 3 s; `bun run build` exit 0 with 7, 7 and 7. The two generated files kept the same SHA-256. The copy was deleted.
  - `git status` after every suite → only the three changes that were there before (`.gitignore`, `context/decisions.md`, `context/handoff.md`). The tests wrote nothing tracked.
  - Probes, all in a scratch folder outside the repository:
    - 16 candidate lines through `lintText` from `scripts/lint-literals.ts` → 12 pass that a §4.3 lint should flag (finding 1).
    - Chromium (Playwright 1.64.1) on a blank page → `document.fonts.check('16px "NoSuchFontXyz"')` is `true` (finding 2). On the built `pluto-theme` page, `document.fonts` holds the three families with status `loaded`. So the fonts work today; only the test is blind.
    - A planted `static/r/styles/maia/stale.json`, then `bun run build:registry` → the file survived in both `r/` and `v0.1.0/r/` (finding 3). It was removed afterwards; both folders are back to 7 files.
    - Fixture B with `skipLibCheck: false`, before any `add` → `svelte-check` errors in `node_modules/vite/dist/node/index.d.ts` ("Cannot find type definition file for 'node'"). The setting hides a fixture problem, not an item problem.
    - `prettier --no-config` on `wrangler.jsonc` → it adds a trailing comma after the `assets` object, which `JSON.parse` rejects.
    - The prerendered `/` → the theme toggle ships `aria-pressed="false"` whatever the theme.

## Acceptance criteria against evidence

1. **Install** — met. EXECUTED: `--frozen-lockfile` exit 0, here and in the clean copy. `deps.test.ts` passes, and my own `bun.lock` query gives 19 of 19. `packageManager`, `engines` and no `.nvmrc`: 3 of 3.
2. **Checks** — met. EXECUTED: `check` 0 errors and 0 warnings; `lint` exit 0.
3. **Tokens** — met. EXECUTED: two runs, identical hashes and mtimes. `tokens.test.ts` checks 22 primitives, 45 names per theme, no raw hex in a theme. READ: every primitive is used and appears once.
4. **Contrast** — met. EXECUTED (`contrast.test.ts`). READ: the test holds decision 12's 100 rows and 8 tint hexes as literal expected data, so it does not compare the arithmetic with itself.
5. **Generated files** — met. EXECUTED (`generated.test.ts`). It also checks `src/app.css` for nested `:root` and `.dark`, which goes beyond the criterion.
6. **Registry source** — met. EXECUTED (`registry.test.ts`).
7. **Registry build** — met. EXECUTED: 7 and 7, byte-identical, both by the script and by the test's temporary build. The count holds only on a fresh output folder (finding 3).
8. **Site build** — met. EXECUTED: 7, 7 and 7 `index.html`.
9. **Dev server** — met. EXECUTED: 200, 6 items, from an empty `static/` both here and in the clean copy.
10. **Preview pages** — met. EXECUTED (`previews.test.ts`; existence only, as the criterion asks).
11. **No literals** — met as counted (0 in 4 files; 16 of 16 bad; 0 of 10 good). EXECUTED. But the lint lets through literals the spec says it flags (finding 1).
12. **Named dependencies** — met. EXECUTED (`deps.test.ts`, which builds the registry and reads the 5 names from the built items).
13. **`cn`** — met. EXECUTED (`utils.test.ts`).
14. **axe** — met. EXECUTED: 14 scans, 0 violations, each with at least one pass.
15. **Themes** — met. EXECUTED: 14 of 14.
16. **The mark** — met. EXECUTED: 10 per project and 4 names per project. READ: in the dark project the mono check cannot fail, because every mark token and the text are paper (finding 7). The light project covers it.
17. **Tokens in the browser** — met as counted. EXECUTED. Three of the six font checks prove nothing (finding 2).
18. **Keyboard** — met. EXECUTED: 8 stops in order, then no ninth; the outline at 8 of 8; Enter; Space and Enter; the lockup link. The outline check retries (judged in finding 6).
19. **Smoke** — met. EXECUTED: 10 of 10 in each of 2 apps.
20. **Dev loop** — met. EXECUTED: 2 tests covering 3 files. READ: it does not test debounce or overlap; the code was read for those (§ "Scripts" below).
21. **Test files** — met. EXECUTED: the three suites, each exit 0, run one after another as `bun run test` chains them. INFERRED: the chain itself exits 0. The clean copy reran unit, check, lint, dev and build, but not the browser or smoke suites.
22. **Deploy config** — met. EXECUTED (`registry.test.ts`, 3 assertions).
23. **Changelog** — met. EXECUTED (`registry.test.ts`, 6 of 6 names in the `0.1.0` entry).
24. **Released** — tag `v0.1.0`. INFERRED: the smoke apps are the evidence that an install works.

## Findings, most severe first

There is no High. No item breaks an app that installs it. Both smoke apps install, re-install byte-identically, build and type-check. I found no wrong value in the token file, the contrast table or the generated CSS.

1. **The literal lint lets through literals the spec says it flags** (`scripts/lint-literals.ts:90`, `:146`, `:148`, `:159`). Medium: criterion 11 claims constitution §4.3 is enforced, and it is not, for these forms. Each line below passed `lintText` with the real rules (EXECUTED):
   - `[margin:13px]` and `[color:red]`. An arbitrary *property* holding a length or a colour. `utilityOf` returns a string that starts with `[`, and line 146 returns early.
   - `bg-[red]` and `bg-[color-mix(in_srgb,red,blue)]`. An arbitrary value holding a named colour. Only hex, the listed colour functions and lengths are tested; `color-mix(` matches none of them.
   - `bg-black/[.5]`. A flagged palette colour (`black`) with an arbitrary opacity. The colour regex allows only `/\d+` after the name.
   - `<span {...{ style: "margin: 13px" }}>` and `el.style.margin = "13px"`. A style set without the literal `style=` that line 90 looks for.

   Failure: a `002` restyle writes `class="[padding:13px]"` or `bg-[white]` into an item. `literals.test.ts` stays green, and the literal ships to every app that installs the item.
   Fix: in `classViolation`, lint the inside of any `[...]`, including a whole-token arbitrary property. Flag CSS named colours there; the list can be read from a pinned source, or kept as the CSS Color 4 keywords plus `transparent` and `currentcolor`, which are allowed. Accept `/<n>`, `/[...]` and `/(--token)` after a palette colour. Flag the word `style` used as an object key or as a property access in a `.svelte` or `.ts` item file. Add one bad sample for each, and recount criterion 11.

2. **`document.fonts.check` is true for a font that does not exist, so "has loaded" proves nothing** (`tests/e2e/tokens.spec.ts:102–108`). Medium: three of criterion 17's six font checks are vacuous. The other three read only the declared `font-family`, which stays "Geist Variable, …" even when no face is loaded.
   Failure: a token or build change drops the `@import "@fontsource-variable/geist"` (or the package fails to bundle). Text falls back to `system-ui`. All 6 font checks still pass, in both projects. EXECUTED: on a blank page, `check('16px "NoSuchFontXyz"')` returned `true`.
   Fix: after `document.fonts.ready`, assert that `[...document.fonts]` holds a face with `family === "<name>"` and `status === "loaded"`. Or assert that `await document.fonts.load('16px "<name>"')` returns at least one face. Amend decision 25 and criterion 17, which prescribe `check`.

3. **`build-registry` never clears its output, so a removed or renamed item keeps being served and deployed** (`scripts/build-registry.ts:32`, `:62`). Medium: `shadcn-svelte registry build` writes files but deletes none (READ: `packages/cli/src/commands/registry/build.ts:72–86`, `:184–186`, in the prior-art clone). The versioned copy is cleared, but it is then copied from the uncleared `latest`.
   Failure: EXECUTED. A planted `static/r/styles/maia/stale.json` survived `bun run build:registry`, in `r/` and in `v0.1.0/r/`. In practice: `002` renames an item. The old `<name>.json` stays in the git-ignored `static/r/`. `vite build` copies it into `build/`, and a deploy serves it. `add <old-name>` still installs the outdated source. Criteria 7 and 8 would then count 8. The tests cannot see this, because `registry.test.ts` and `deps.test.ts` build into fresh temporary folders.
   Fix: `rmSync(latest, { recursive: true, force: true })` before spawning the CLI. Better, build into a temporary folder and swap it in only when the CLI exits 0, so a failed build leaves the last good registry in place for the dev server. Add a test that plants a stray file in the `--out` folder and expects it gone.

4. **Spec amendments the build needed and did not record.** Low. Each is necessary and harmless. Fix text, for the specification's next amendment:
   - Decision 26: "`.prettierrc` also holds an override, `*.jsonc` → `trailingComma: "none"`. Without it, prettier's default adds a trailing comma to `wrangler.jsonc`, which `JSON.parse` rejects (criterion 22)." EXECUTED, above.
   - Decision 25, fixture file list: "and `src/routes/+layout.ts` with `export const prerender = true`. `adapter-static` fails a build whose routes are not prerenderable."
   - Decision 25, fixtures: "A's `tsconfig.json` sets `include: ["src", "*.ts"]`, for decision 2's reason: after assertion 9's build, `svelte-check` would otherwise scan `build/`. B's sets `skipLibCheck: true`, as Kit 2's own template does. Without it, Vite 8's types fail for want of `@types/node`, before any `add`." EXECUTED, above.
   - Decision 25, `tokens.spec.ts`: "motion tokens are compared as durations, not strings. The production minifier writes `900ms` as `.9s` and `0ms` as `0s`." READ: the built CSS holds `--motion-entrance:.9s`.
   - Smoke assertion 4: "values are compared as a CSS parser reads them: hex case and quote style are normalised. Prettier lowercases our `src/app.css`; the CLI writes the registry's uppercase." This one follows from "parsed maps" already. It is optional.
   - `dev-loop.test.ts`: "links each entry of `node_modules`, not the folder. Kit 3 generates `node_modules/$app`, which must stay in the copy." Optional; it is an implementation detail.

5. **The lint's catalogue misses colour utilities and literal motion that Tailwind 4 has** (`scripts/lint-literals.ts`, `COLOUR_UTILITIES`). Low: these are outside the spec's list, so the build meets the spec. EXECUTED: `inset-shadow-red-500`, `text-shadow-black` and `duration-300` pass. `text-lg` and `tracking-tight` also pass; decision 11 leaves those to `002`.
   Fix: add `inset-shadow`, `inset-ring`, `text-shadow` and `drop-shadow` to the colour utilities. Add a rule for `duration-<n>` and `delay-<n>`, which are motion literals; the token form `duration-(--motion-micro)` stays allowed. Amend decision 25's list.

6. **The keyboard outline check retries for every stop, though only the toggle animates** (`tests/e2e/keyboard.spec.ts:20–28`). Low. `toHaveCSS` polls for up to 5 s. The reason is real: the toggle carries `transition`, which animates `outline-color` over 200 ms from `currentColor` (the foreground, high contrast). It hides no defect today. But at the other 7 stops, an outline that appeared seconds late would pass.
   Fix: read the three values once at each stop. For the toggle only, first wait for `transitionend` or `getAnimations()` to finish. Or give the toggle `transition-colors` without `outline-color`.

7. **The mono-tone check cannot fail in the dark project** (`tests/e2e/four-dot.spec.ts:95–106`). Low. In dark, `mark-1` to `mark-4` and `foreground` are all paper. A broken `tone="mono"` would still compute paper dots. The light project does catch it.
   Fix: give the mono fixture a colour that is not a mark colour in either theme, such as `text-primary`. Or skip the assertion's claim in dark and say why.

8. **The prerendered toggle says "not pressed" in the dark theme until hydration** (`src/lib/preview/theme-toggle.svelte:26`). Low; preview app only. The head script sets `.dark` before paint, but the server renders `aria-pressed="false"` (EXECUTED). Until hydration, a screen reader hears the wrong state, and pressing the button does nothing. The tests wait for `data-ready`, which is fair hygiene, but it is also why no test sees this.
   Fix: render the button without `aria-pressed` (or `disabled`) until mounted, or have the head script set a `data-theme` on `<html>` that the server markup does not contradict.

9. **`hexToRgb` reads only six-digit hex, but the minifier shortens hex** (`tests/e2e/pages.ts:29–32`). Low. The built CSS already holds `--card:#fff` and `--groove-light:#0000`. If `ring` ever became a shortenable colour, `#fff` would read as `rgb(0, 15, 255)`. The keyboard test would then fail falsely, not pass falsely.
   Fix: let the browser convert. Set the value as a probe element's `color` and read its computed `color`.

10. **A failed start-up build does not stop the dev server** (`scripts/registry-watch.ts:88`). Low. `run` catches and logs, so `vite dev` listens with a stale registry or none. A missing CLI binary then shows up only as the smoke test's generic 60 s timeout.
    Fix: let the start-up call (`now`) rethrow, so `vite dev` fails with the CLI's message. Keep catching for watch-time rebuilds.

11. **The lint flags `space-x-reverse` and `space-y-reverse`** (`scripts/lint-literals.ts:82`). Low; a false positive. They carry no size.
    Fix: allow `reverse` for `space-x` and `space-y`, and add it as a good sample.

## Constitution checks

- **§4.1 source, not a package:** holds. READ: the built items carry source text and a `$UTILS$` placeholder. Their imports are the app's own alias (smoke assertion 3), `svelte/elements`, `cn`, and relative paths. The font packages and `shadcn-svelte/tailwind.css` are build-time imports pinned by the app's lock. Nothing reaches back to this repository at run time. No item depends on `src/lib/preview/`.
- **§4.2 driven by need:** holds. Criterion 24 is the release, tag `v0.1.0`.
- **§4.3 tokens are the one source:**
  - The item files hold no hex, colour function, length, `style` or `<style>`. EXECUTED: my own grep and the lint.
  - The four geometry tokens appear only as `-(--token)` classes: `size-(--mark-dot)`, `gap-(--mark-gap)`, `gap-(--mark-lockup-gap)` and `-translate-y-(--mark-lift)`, where the lift adds in the rise. READ.
  - `src/app.css` is purely generated. EXECUTED: byte-equal to a fresh run. No theme value is a raw hex, and each hex appears once. EXECUTED.
  - The lint's enforcement has holes (finding 1). The preview pages carry three `style` attributes with literals (`font-size: 100px`, `font-size: 20px`, `width: 0; height: 0`). Decision 24 exempts preview pages, and every colour they show comes from a token variable or a server load. READ.
- **§4.4 accessible by default:**
  - Contrast: 98 of 100 pairs pass, plus the 2 recorded exceptions. EXECUTED.
  - axe: 0 violations in 14 scans. EXECUTED.
  - Keyboard: 8 stops with a solid 2 px ring at each. EXECUTED.
  - `FourDot` is `aria-hidden="true"` without a label, and `role="img"` with an `aria-label` when labelled. `Lockup` with `href` renders an `<a>` with `href`, `target`, `rel` and `aria-label` (default "Pluto Systems", which contains the visible "pluto"). Without `href` it renders a `<span>`, where a screen reader hears "pluto" and the mark is hidden. READ and EXECUTED (the name checks).
  - Reduced motion leaves the dark ground dark. EXECUTED (`tokens.spec.ts`, and smoke assertions 7 and 8).
  - Svelte 5: both components use `$props()` with a rest spread. `Lockup` uses `$derived` and a snippet. Neither uses `$bindable`; neither needs a `ref`. READ.
- **§4.5 every input pinned:** holds. EXECUTED: the root `bun.lock` resolves 19 of 19. Both fixtures have a committed-to-be `bun.lock`, installed with `--frozen-lockfile`; neither names `shadcn-svelte`, `cn` or a font, in `package.json` or in the lock. READ: the CLI runs from the local install, never `bunx pkg@version`.
- **§4.6 dependencies named and pinned:** holds. READ: the built `pluto-theme` has `devDependencies: ["shadcn-svelte@^1.7.1"]`, and `utils` has `cn@^0.5.0`. The font items name their packages. EXECUTED: smoke assertion 6 sees all 5 arrive in both apps.
- **§6 never:**
  - No commit or push. READ: `git log` still ends at `634ab09`.
  - No copying. READ: `src/lib/utils.ts` against the clone's `docs/src/lib/registry/lib/utils.ts` and `docs/content/migration/svelte-5.md`. The interface is the same, as decision 20 requires. The text differs: `unknown`, not `any`; no lint-disable comments; our own doc comments; our own layout. The one line that matches, `WithElementRef`'s, is the type expression itself, which the interface fixes. Nothing in the clone resembles the four-dot components. They follow the Pluto Systems design book.
  - No silent break. READ and EXECUTED: a second `add` leaves an app's CSS byte-identical (smoke assertion 7). `CHANGELOG.md` has the `0.1.0` entry and says how interface changes will be marked.
- **Decision 1, Bun everywhere:** holds. READ: every package script that starts a tool says `bun --bun`. `build-registry.ts` and every smoke spawn put `--bun` in the child's argv, with `process.execPath` first. Nothing spawns `node` or `npx` (grep). EXECUTED: the CLI prints the "unsupported runtime" warning in each run, which shows it ran under Bun.
- **The spec review's Disposition:** each promised fix is in the code. READ:
  - 1: `html:root`, the nested-selector test, and smoke assertions 7 and 8.
  - 3: tints at 0.1 and 0.2, composited in integer tenths.
  - 4: `context/` in `.prettierignore`; both outputs formatted through prettier's API.
  - 5: `shadcn-svelte` named on `pluto-theme`; fixtures without it; smoke assertions 6 and 9.
  - 7: the 3 forbidden pairs.
  - 12: wrangler and changelog checks in `registry.test.ts`.
  - 13: build into a temporary folder; the watcher builds at start; `webServer` builds first; the dev loop runs on a copy.
  - 14: committed fixtures, `--frozen-lockfile`, a one-line `app.css`.
  - 15: the `-(--token)` form; the palette read from `theme.css`; weights and `leading-none` as tokens.
  - 16: no `overflow` anywhere in the preview; swatch text beside the chip.
  - 17: `trailingSlash = "always"`.
  - 18: data only from `+page.server.ts`; `tsconfig` `include`.
  - 19: no `.nvmrc`.
  - The others (2, 6, 8, 9, 10, 11) are specification text or token values, and the tokens match.

### Scripts, read for failure modes

- `build-tokens.ts`: a token file with a bad key fails in `validateTokens` with the key named (tested). A registry with no `pluto-theme` or font item throws. It writes each file only when its formatted text changes. That stops the watcher looping on its own write. INFERRED from the code; consistent with the dev-loop run.
- `registry-watch.ts`: the debounce is a 200 ms timer reset by each change. Runs never overlap: `running ??= drain()` starts at most one drain, and a drain loops while `pending` is set. A change during a run is picked up when the run ends, without a fresh debounce; that is harmless. A token change sets `pendingTokens`, which is OR-ed in, so it is never lost to a later plain change. READ. Start-up failure: finding 10.
- `build-registry.ts`: a non-zero CLI exit throws with the CLI's output, and the versioned copy is skipped. Stale output: finding 3.
- `lint-literals.ts`: findings 1, 5 and 11.

## Verdict

Does not land yet: three Medium findings stand. The literal lint lets through arbitrary properties, named colours, arbitrary opacities and indirect `style` (1). Three of the font checks are vacuous (2). `build-registry` leaves stale items in the served and deployed registry (3). Everything else holds. All 23 countable criteria reproduce at the claimed counts, and no item breaks an app that installs it.

## Disposition

Answered by the builder, 2026-10-27. Re-run afterwards under Bun: `check` 0 errors 0 warnings; `lint` exit 0; `build:tokens` twice, no changes, same SHA-256; `build` 7, 7 and 7; `bun run test` exit 0 (unit 223 pass, browser 130 passed, smoke 22 pass).

1. Fixed: `scripts/lint-literals.ts` now flags whole-token arbitrary properties holding a literal (`[margin:13px]`, `[color:red]`), CSS Color 4 named colours and `color-mix(`, `light-dark(`, `device-cmyk(` inside any `[...]`, palette colours with any opacity (`/50`, `/[.5]`, `/(--x)`), and indirect style (`style` as an object key, `.style` access, `setAttribute("style")`). Seven bad samples were added to `tests/unit/literals.test.ts`. The spec's decision 25 list and criterion 11 now say 27 bad and 12 good samples.
2. Fixed: `tests/e2e/tokens.spec.ts` replaces `document.fonts.check` with a search of `document.fonts`, after `ready`, for a face of the family with `status === "loaded"`. The same test asserts that an undeclared family has no loaded face, so the check is shown to fail. Decision 25 and criterion 17 are amended.
3. Fixed: `scripts/build-registry.ts` builds into a fresh temporary folder inside `<out>` and swaps it in only when the CLI exits 0, then clears and recopies the versioned folder. `tests/unit/registry.test.ts` plants a `stale.json` in both folders before its build and asserts that neither survives (seen failing first: 2 fails). Planting one in `static/` and running `build:registry` also leaves 7 and 7. Decision 18 and criterion 7 are amended; the count is still 7.
4. Fixed: all six amendments are in the spec. The `*.jsonc` override is in decision 26. The fixtures' `+layout.ts`, A's `include` and B's `skipLibCheck` are in decision 25. `tokens.spec.ts` compares motion as durations. Smoke assertion 4 normalises hex case and quotes. The dev-loop copy links each `node_modules` entry and touches `registry.json` by rewriting the same bytes. The Status line says "amended again 2026-10-27 after the change review".
5. Fixed: `inset-shadow`, `inset-ring`, `text-shadow` and `drop-shadow` join the colour utilities. A literal `duration-<n>` or `delay-<n>` is flagged, and the token form is allowed. There are 4 more bad samples (`inset-shadow-red-500`, `text-shadow-black`, `duration-300`, `delay-150`) and 1 more good sample (`duration-(--motion-micro)`). Decision 25 is amended. `text-lg` and `tracking-tight` stay with `002`, as decision 11 says.
6. Fixed: `tests/e2e/keyboard.spec.ts` reads the outline once at each stop. For the theme toggle alone, it first awaits `getAnimations()` to finish. Decision 25 is amended.
7. Fixed: the mono fixture on the four-dot page is `text-primary` (blue-lifted in dark, not paper). `four-dot.spec.ts` also asserts that the mark's colour is not paper, so a broken mono tone fails in both themes. Decisions 24 and 25 are amended.
8. Fixed: `src/lib/preview/theme-toggle.svelte` renders `aria-pressed` only once it has hydrated, and the prerendered button carries none (checked in `build/index.html`). This is simpler than a head-script attribute; axe stays at 0 and the keyboard spec is green. Decision 24 is amended.
9. Fixed: `hexToRgb` in `tests/e2e/pages.ts` reads #rgb, #rgba, #rrggbb and #rrggbbaa, and throws on anything else.
10. Fixed: `scripts/registry-watch.ts` lets the start-up build reject, so `vite dev` stops with the build's own error. Checked with a broken `registry.json` in a scratch copy: exit 1, "error when starting dev server: SyntaxError: JSON Parse error". Watch-time rebuilds still log and keep the last good registry. Decision 23 is amended.
11. Fixed: `reverse` is allowed on `space-x` and `space-y`, and `space-x-reverse` is a good sample.

### Addendum by the design lead, 2026-10-27

After the Disposition, the design lead re-ran the suites. The smoke pair (`bun test ./tests/smoke`) failed in 3 of its first 6 runs, each time with a `beforeAll` hook hitting its own timeout (70 s or 90 s) rather than the poll's 60 s error. Each file passed alone. That pattern means one `fetch` in `waitFor200` hung on a connection the dev server accepted and never answered. No server log survived, because teardown deletes the scratch folder.

Change made by the design lead in `tests/smoke/process.ts` (and the two call sites): every request in `waitFor200` carries `AbortSignal.timeout(2000)`; the poll throws at once if the dev server process has exited; every error carries the server's stdout and stderr. No assertion or count changed. After the change, 8 of 8 pair runs passed, and 13 consecutive runs have passed since the last failure. **The root cause was not found; the harness starts the server cleanly in every full run since.** If it recurs, the error now carries the log. Recorded in the specification's landing notes.

After the disposition: lands.
