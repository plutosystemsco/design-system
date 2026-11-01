# Review of 001 — Tokens and the registry

Reviews [`specifications/001-tokens-and-the-registry.md`](../specifications/001-tokens-and-the-registry.md).

- **Status:** dispositioned; fit to build
- **Date:** 2026-10-27
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-10-27
- **Re-ran:** all of it in a scratch folder outside the repository, under Node 24.9.0 (Homebrew) and Bun 1.3.14. Nothing was written to this repository except this file.
  - A Node script recomputed all 100 rows of decision 12, compositing the tint rows itself → 97 rows agree and 3 disagree (finding 3). The 2 `chart-3` exceptions agree (1.81, 1.95). The 3 reference ratios agree (21.00, 4.54, 4.47).
  - `npm view` on 10 of the 20 packages (kit 3.1.0, svelte-check 4.7.7, adapter-static 4.0.0, vite-plugin-svelte 7.3.1, vitest 5.0.5, prettier-plugin-svelte 4.1.1, @axe-core/playwright 4.14.0, cn 0.5.0, @types/node 24.19.2, typescript 6.0.3), plus kit 2.70.3, adapter-static 3.0.10, @tailwindcss/vite 4.3.3, shadcn-svelte 1.7.1 and @playwright/test 1.64.1 → the engines and peers match the spec. TypeScript's `latest` is 7.0.2. The newest Node 24 is 24.22.1.
  - Imported `shadcn-svelte/schema` 1.7.1 → it exports `registrySchema`, `registryItemSchema` and `registryIndexSchema`, among others.
  - `shadcn-svelte@1.7.1 registry build` on a one-item theme registry → exit 0. It wrote 2 files (`index.json` and the item).
  - The real `add pluto-theme -y -o`, run twice, into a bare app → the second run changed the CSS (finding 1). Then the same with `add child -y -o`, where `child` is an item that depends on `pluto-theme` → the same change. `add -y` without `-o` hung at the stylesheet prompt.
  - Chromium (Playwright-core 1.64.1) measured the cascade before and after → `--background` reads `#F7F7F4` under `.dark` with `reducedMotion: reduce` after the second add. It reads `#14161C` after the first.
  - The proposed fix (`html:root` inside the media query), re-run → the second add left the CSS byte-identical. Dark stays dark, and `--motion-entrance` reads `0ms` under reduce. Plain `html` there reads `900ms`, because it is less specific than `:root`.
  - `prettier@3.9.10 --check .` on the repository as it stands → 5 files flagged, non-zero exit (finding 4).

## Acceptance criteria against evidence

The questions for each criterion:
- Is it countable and checkable as written?
- Does the spec define what it counts?
- Can it be met, given the repository's actual state?

1. **Install** — countable. The 20 packages are defined (decision 4; counted, 20). They can be met: the versions exist, and engines and peers agree with Node 24 (EXECUTED, `npm view`). Bun installs peers, and `@axe-core/playwright`'s peer `playwright-core` arrives through `@playwright/test` (INFERRED).
2. **Checks** — countable, but `bun run lint` cannot exit 0 as specified. `prettier --check .` already fails on 5 tracked Markdown files under `context/` (EXECUTED; finding 4). `svelte-check` with `#lib` under Kit 3 is untested; the spec says so itself (run memo §10) (READ).
3. **Tokens** — countable and defined: 22 primitives and 45 names, recounted from the tables (READ). How "changes 0 files" is measured (hashes, or `git status`) is not stated, but it is easy to choose (INFERRED).
4. **Contrast** — countable and defined. **Not met as written:** with the alpha the spec states (0.1), rows L27, L28 and L30 compute 4.55, 4.86 and 5.46, against 4.51, 4.82 and 5.42 in the table (EXECUTED; finding 3).
5. **Generated files** — countable. It can be met, but only if the generated `registry.json` and `src/app.css` are also prettier-stable or ignored (INFERRED; finding 4).
6. **Registry source** — countable. `registrySchema` is exported (EXECUTED). The 5 distinct dependency names and the 1 `registry:ui` item recount correctly (READ).
7. **Registry build** — countable. `build` writes only `index.json` plus one file per item (EXECUTED; READ `cli/src/commands/registry/build.ts`), so 7 is right. Its precondition (who runs the build before the unit test) is unstated (finding 13).
8. **Site build** — countable. Can be met. The trailing-slash setting that decides the HTML file names is unstated (finding 17) (INFERRED).
9. **Dev server** — countable. `index.json` is an array (READ `registryIndexSchema`). The run memo §6 served `static/r/` (READ).
10. **Preview pages** — countable, but it checks only that 6 files exist (READ). Can be met.
11. **No literals** — countable. The lint's rules contradict one good sample (finding 15) (READ).
12. **Named dependencies** — countable, but it counts 4 packages and misses `shadcn-svelte`, whose CSS `pluto-theme` imports into every app (finding 5) (READ `add-registry-items.ts`; EXECUTED, the import appeared in the app's CSS).
13. **`cn`** — countable. The same three calls were executed in the run memo §9 (READ).
14. **axe** — countable: 14 scans. Can be met if swatch text sits on a ground and no scroll container overflows (finding 16) (INFERRED).
15. **Themes** — countable: 7 × 2 = 14. Can be met (INFERRED).
16. **The mark** — countable. 4 + 2 + 1 + 1 + 1 + 1 = 10 per theme, as stated (READ). The geometry matches the design book's normative CSS (§02: .30, .08, gap .16, translate .76 = .38 + .30 + .08) (READ). The tolerances are reasonable, because every target is a whole pixel at 100 px. Chromium's synthesized baseline for an empty grid item is unmeasured (run memo §10) (INFERRED).
17. **Tokens in the browser** — countable: 9 radius classes plus `rounded-full` = 10; 5; 9; 3 + 3 = 6; 2 (READ). Can be met (INFERRED).
18. **Keyboard** — countable: 8 stops. Fragile. Chromium makes overflowing scroll containers focusable, which would add stops (finding 16) (INFERRED).
19. **Smoke** — countable: 7 × 2 = 14. Assertion 4 has no defined starting CSS (finding 14). Pre-installing `shadcn-svelte` hides finding 5. It never re-adds, so it misses finding 1 (EXECUTED).
20. **Dev loop** — countable: 3 files. The test mutates committed files, and it may run in parallel with the other smoke file (finding 13) (INFERRED).
21. **Test files** — countable. It depends on unstated build-order preconditions (finding 13) (INFERRED).
22. **Deploy config** — countable, but no named test or command checks it. None of the 15 test files covers it (finding 12) (READ).
23. **Changelog** — countable. No named check, as for 22 (finding 12) (READ).
24. **In the app** — **cannot be met in the current state.** This criterion needs an installing app's `svelte-check`, Playwright and axe. No such app exists yet, and none can be built on this registry before this `001` (finding 2) (INFERRED).

## Findings, most severe first

1. **Re-applying `pluto-theme` makes the dark theme light for reduced-motion users** (`001-tokens-and-the-registry.md:472`, `:494`). The `@media (prefers-reduced-motion: reduce) { :root { … } }` rule is found again by the CLI on any later `add`. It then receives all 45 light colours and `radius`.
   Failure (EXECUTED):
   - The CLI's `updateCssVars` runs before `updateCss` (`cli/src/utils/transform-css.ts:30–36`). It writes `cssVars.light` into **every** rule whose selectors include `:root`, through `ast.walkRules`, which descends into at-rules (`cli/src/utils/updaters/update-css-vars.ts:33–38`).
   - The first `add` is clean. Any later `add` of `pluto-theme`, or of any item that depends on it, copies the light values into the media block. That includes `add four-dot` after `add pluto-theme`, which is criterion 24's own sequence, and every `002` component.
   - Theme items skip the "already installed" check (`add-registry-items.ts:125`), so this happens on every such `add`.
   - The media block comes after `.dark`, at equal specificity (0,1,0). Chromium then computes `--background: #F7F7F4` on `<html class="dark">` under `reducedMotion: reduce`.
   - A reduced-motion user who chose dark gets the light palette, silently. Constitution §6 forbids exactly that ("break an installed app silently").

   Fix:
   - Emit the reduced-motion overrides under `html:root` (specificity 0,1,1, and not the literal `:root`). Verified: the second `add` is byte-identical, dark stays dark, and `--motion-entrance` is `0ms` under reduce.
   - Add a unit assertion that no rule nested in an at-rule of `pluto-theme.css` uses the selector `:root` or `.dark`.
   - Add smoke assertion 8: a second `add four-dot -y -o` leaves the app's CSS byte-identical.
   - Add smoke assertion 9, in each app's built CSS: dark plus reduced motion keeps `--background` at ink.
   - Recount criterion 19 as 9 × 2 = 18.

2. **Criterion 24 cannot be met, and the header says "Depends on: nothing"** (`:8`, `:866`, `:905`). 001 cannot land until an installing app has a SvelteKit app with `svelte-check`, Playwright and axe. That app arrives only after this `001`.
   Failure: a builder finishes criteria 1–23, then cannot close 24. `002` (which "depends on" 001) is blocked behind another repository's work. The cycle is: 001 needs an installing app, and that app needs 001.
   Fix: split "built" from "done" (constitution §4.2).
   - 001 lands as **built** on criteria 1–23. The two scratch apps already prove the install path.
   - Criterion 24 moves to the installing app's own specification. That specification installs `pluto-theme` and `four-dot` from `localhost` and cites this registry's version.
   - 001's landing notes record "done" when that commit exists. The Depends-on line names the reverse dependency.

3. **Decision 12's light tint rows were computed at alpha 26/255, not 0.1. Criterion 4's "each ratio equals the table" fails on 3 rows** (`:329`, `:372–375`, `:829`, `:885`).
   Failure (EXECUTED):
   - The spec and the token file say `alpha.light: 0.1`. A test that composites at 0.1 with rounded channels gets the following:
     - L27 `#f2e3df` → 4.55 (table: `#f2e2de`, 4.51);
     - L28 `#f9eae9` → 4.86 (table: 4.82);
     - L29 `#e0e9e2` → 5.08 (table: `#e0e9e1`);
     - L30 `#e7f1ec` → 5.46 (table: `#e7f0eb`, 5.42).
   - With unrounded channels: 4.53, 4.85, 5.09 and 5.45.
   - The table's values are reproduced exactly at alpha 26/255 (0x1A). The dark rows used 51/255, which is exactly 0.2, so they agree.
   - The same quantisation explains `wash`. Ink at 6% over paper is `#E9E9E7`. `#EAEAE7` is ink at 15/255.
   - No pair flips from pass to fail. But the criterion as written fails, and the "thinnest pass, at 4.51" prose (`:340`) is a number from another method.
   Fix: pick one composite rule and state it in decision 12.
   - Either: alpha is quantised as `round(a × 255) / 255`, and channels are rounded after compositing. Then the table stands, and the tint `alpha` in the token file is written as 26/255 and 51/255, or the rule is stated in `contrast.ts`.
   - Or: alpha is exact. Then correct rows L27, L28 and L30, the 4 tint hexes, and the prose.
   - Either way, call `wash` and `ink-wash` "flattened" values and give their derivation exactly.

4. **`bun run lint` cannot exit 0** (`:754`, `:883`). `prettier --check .` already flags 5 tracked files: `context/README.md`, `context/prior_art/README.md`, both research memos, and this specification (EXECUTED, prettier 3.9.10).
   Failure: criterion 2 fails on a clean build. Reformatting the memos would edit research "after the fact", which `context/README.md` forbids.
   - The generated `registry.json` and `src/app.css` are committed and checked too.
   - If `build-tokens` writes `JSON.stringify(…, "\t")`, prettier flags them. If prettier rewrites them, `generated.test.ts` (criterion 5) fails.
   Fix: `.prettierignore` gains `context/`. Then do one of the following:
   - `build-tokens` formats its two outputs through prettier's API before writing, and `generated.test.ts` compares the formatted text;
   - or both generated files go in `.prettierignore`.

5. **`pluto-theme` makes every app import `shadcn-svelte/tailwind.css`, but no item names `shadcn-svelte`** (`:80`, `:515–517`, `:736`, `:893`).
   Failure:
   - `add` merges `shadcnSvelteTailwindCssImport` into the app's CSS whenever an item carries `cssVars` or `css` (`add-registry-items.ts`, after `setupFonts`). EXECUTED: the import appeared.
   - An app that runs the CLI through `bunx shadcn-svelte@1.7.1`, as decision 23 tells apps to, has no `shadcn-svelte` in `node_modules`. Its build then cannot resolve the import (registry memo §6, INFERRED there; INFERRED here).
   - The smoke apps pre-install `shadcn-svelte`, so they hide this. Constitution §4.6 asks the item to name what it needs.
   Fix:
   - Give `pluto-theme` an explicit `"devDependencies": ["shadcn-svelte@^1.7.1"]`. `build` detects packages only from files, and this item has none. `add` installs a theme item's devDependencies (`add-registry-items.ts:146–148`).
   - `deps.test.ts` then counts 5 packages.
   - The scratch apps start **without** `shadcn-svelte` and run the CLI through `bunx`. Assertion 6 checks that `package.json` gained it.

6. **`wash` and `ink-wash` add a fourth ground, which the design book refuses. The spec makes that call itself** (`:197`, `:201`, `:219`).
   Failure:
   - The design book §03: "grounds are paper, raised white, or ink". The spec quotes the restriction and adds a ground anyway, on an INFERRED reading of "no new hues".
   - It also drives the replacement of the owner's proposed green text. `#157A43` fails only on `muted` (4.47) and on its tint (4.40 over paper).
   - The owner accepted the design book and "fix as we go" for contrast failures. A new ground colour is a design-book change, not a contrast fix.
   Fix: put it to the owner before building, with the recommended option first. The options:
   - **(recommended)** accept `wash` and `ink-wash` for component insets only (tab lists, code grounds, skeletons, hover rows), never as section grounds, recorded in `decisions.md`;
   - `muted` is paper, used only on raised surfaces;
   - no `muted` ground.

   Note that `#136E3E` stays necessary whichever option wins, because the tint row fails without it.

7. **State tints on `muted` fail in both themes, but the spec forbids only the destructive tint, and for the wrong reason** (`:340`). EXECUTED:
   - destructive/10 over light `muted` is 4.06;
   - destructive/20 over dark `muted` is 3.96;
   - success/20 over dark `muted` is 4.44;
   - success/10 over light `muted` is 4.58.

   The spec says only that 4.51 is "the thinnest pass", so `002` avoids a destructive tint on `muted`.
   Failure: a `002` alert or badge with `bg-success/20` inside a `muted` tab list fails AA in dark, and nothing in 001 tells `002` not to do it.
   Fix: state "no state tint on `muted`, in either theme", with these four ratios. Add them to the token file as forbidden pairs that the contrast test asserts fail, so a later change that makes them pass is noticed.

8. **Decision 20 misstates where `utils` installs** (`:585`). The CLI special-cases an item named `utils`. It installs at the app's `utils` alias path plus `.ts`, not at the `lib` alias (`cli/src/utils/registry/index.ts:242–246`).
   Failure: none in the scratch apps, where the two coincide (`$lib/utils`). But an app, or this repository, whose `lib` alias is `#lib/registry/lib` would be told the wrong path.
   - For `002`: `add <stock component>` from the official registry would install the official `utils` into this repository's `src/lib/utils.ts`.
   - With `-o`, that overwrites ours.

   Fix: correct the sentence. Add one line to decision 29 warning `002` to add stock components without `-o`, or to restore `utils.ts` afterwards.

9. **The alias-trap reasoning is imprecise** (`:564`). The conclusion is right; the reason is not. `transformAliases` replaces in the order components, ui, hooks, utils, lib, with `replaceAll` (READ `build.ts:228–238`, `constants.ts:7`). So a bare `#lib`, replaced last, rewrites only the `#lib/...` paths no earlier alias matched. For example, `#lib/registry/blocks/x` becomes `$LIB$/registry/blocks/x` and resolves wrongly in apps. It does not rewrite "every other `#lib/...` import".
   Failure: a reader may conclude the order protects them, and add a `blocks` path later.
   Fix: reword. Note that any `#lib/registry/blocks/...` import survives `build` untransformed, which the "no `#lib` in built content" assertion then catches.

10. **The dark-theme state colours sit next to the open owner call on coloured dots** (`:261`, `:264`, `:279–280`). `destructive-fill` and `success-fill` are described as "state dots and fills", and in dark they are lifted red and green on ink. The design book §03 refuses "color dots on dark grounds".
    - The spec's reading is defensible: the design book also sanctions "functional state semantics", and the owner put the dark theme with lifted accents to the spec to confirm.
    - But it decides the dark state dot, which `003`'s run metrics will show, without saying so.
    - Also, the design book's own monochrome-on-dark mark (`.paperdots`) uses `--raised` `#FFFFFF`, while the spec uses `paper` `#F7F7F4`.

    Failure: none today. A future reading of the icon call ("no dots on ink") would contradict 001's dark tokens.
    Fix: one sentence in decision 28 saying 001 decides the state-dot case, and why. Ask both parts together when the icon call is put. Cite the `paper` choice against the design book's `.paperdots`.

11. **The design book does give a display line height** (`:315`). `.ts-display` is `line-height: 1.15` (the design book §04). The spec says the design book gives none, and picks 1.1.
    Fix: use 1.15, or keep 1.1 with a reason.

12. **Criteria 22 and 23 name no check** (`:903–904`). Decision 27 says "the test needs no JSONC parser", but none of the 15 test files includes it.
    Fix: add both checks to `registry.test.ts` (wrangler: 3 assertions; changelog: 6 item names) and say so in criteria 22 and 23.

13. **The test suites' build preconditions are unstated, so they fail on a clean clone** (`:683`, `:702`, `:732`, `:745–747`).
    - `registry.test.ts` needs `static/r/`, which is git-ignored.
    - The smoke test starts bare `vite dev`. That does not run the builds, and the watcher runs only on change, so `index.json` never answers.
    - Playwright's `webServer` must build first.
    - Vitest runs the two smoke files in parallel by default. `dev-loop.test.ts` swaps the committed token file while the other file's `add` is reading the registry. A crash leaves `tokens/`, `registry.json` and `src/app.css` modified.

    Fix:
    - `registry.test.ts` runs `build-registry` into a temporary output.
    - The watcher plugin builds once in `configureServer`, or the smoke test starts `bun run dev`.
    - `webServer.command` is `bun run build && vite preview`.
    - `vitest.smoke.config.ts` sets `fileParallelism: false`.
    - `dev-loop.test.ts` runs on a temporary copy of the repository.

14. **Smoke assertion 4 has no defined starting point, and the scratch apps are unpinned** (`:733–741`).
    - "3 of 3 maps equal" holds only if the scratch app's `src/app.css` starts as exactly `@import "tailwindcss";`, as in this review's run. An `init`-written stock theme would leave extra properties.
    - The apps run `bun install` with no lockfile, so their transitive dependencies drift (§4.5).

    Fix:
    - State the starting `app.css` and the scratch apps' `tsconfig.json`; the CLI refuses without one (EXECUTED: "Failed to find a tsconfig.json file").
    - Commit the two fixtures' `bun.lock` files under `tests/smoke/fixtures/`, or record the drift as accepted.

15. **The literal lint contradicts itself, and the lockup uses keyword sizes** (`:295`, `:694`, `:698`, `:634`).
    - Decision 10's spacing rule allows only multipliers and `auto`, so it flags `gap-(--mark-gap)`, which is one of the 7 good samples.
    - "Tailwind palette colour class" has no defined list.
    - `Lockup` needs `font-bold` and `leading-none`: a weight and a line height that come from no token (§4.3).

    Fix:
    - State that the `-(--token)` form is allowed in spacing utilities.
    - Define the palette list (Tailwind's 22 palettes plus `black` and `white`), and say that `current`, `transparent` and `inherit` are allowed.
    - Add `type.lockup: { weight: 700, lineHeight: 1 }` to the token file, or state that keyword utilities are allowed.

16. **The catalogue's 8 tab stops and its 0 axe violations depend on layout the spec does not fix** (`:661`, `:668`, `:723`).
    - Chromium makes an overflowing scroll container keyboard-focusable. An install command in an `overflow-x: auto` `<pre>` adds a stop, and axe's `scrollable-region-focusable` applies to it.
    - Swatch names written on the swatch fail `color-contrast` on amber or on the translucent `border`.

    Fix: install commands wrap, with no scroll container on the catalogue. Swatch labels sit beside the chip, on the ground.

17. **The trailing slash is unset** (`:660`). Every path is written `/items/<name>/`, but Kit's default is `trailingSlash: 'never'`. Criterion 8's "7 prerendered HTML pages" and the file names then depend on redirects.
    Fix: `export const trailingSlash = 'always'` in `+layout.ts`, so prerender writes `items/<name>/index.html`.

18. **Two smaller builder traps.**
    - **The preview's data loading** (`:668`). If `scripts/tokens.ts` reads the token file with `node:fs`, it must be loaded only from `+page.server.ts`. A `+page.ts` load also runs in the browser on client navigation, which the keyboard test's Enter performs. Say so.
    - **Type-checking the scripts** (`:90`, `:753`). The scripts run under Bun, but only `@types/node` is added. State that the scripts use `node:` APIs only, with no `Bun` globals, and that `tsconfig.json` includes `scripts/` and `tests/`. Otherwise `svelte-check` either errors or never sees them.

19. **`.nvmrc` pins Node 24.9.0, while 24.22.1 is the newest 24.x** (`:44`; EXECUTED `npm view node@24`). The pin records what Homebrew had, not a choice.
    Fix: pin the current 24.x patch and update the run memo's environment line when re-run.

## Constitution checks

- **§4.1 source, not a package:** holds. Items carry source. The font packages and `shadcn-svelte/tailwind.css` are build-time imports, pinned by the app's lock. Nothing reaches back at run time.
- **§4.2 driven by need:** the intent holds. Criterion 24, as placed, deadlocks with the app that installs it (finding 2).
- **§4.3 tokens are the one source:**
  - Holds for colour.
  - The lockup's weight and line height are keyword literals (finding 15).
  - Preview components (`src/lib/preview/`) are exempt from the lint by assertion, not by an argument. The geometry fixture's `font-size: 100px` is a literal. Say why §4.3's "a component" means registry items only, or lint the preview with a small allowlist.
- **§4.4 accessible by default:**
  - Contrast arithmetic is sound: 97 of 100 rows reproduce, and the 3 that do not are higher, not lower.
  - Two holes: the `muted` tint rule (finding 7), and the reduced-motion re-add defect, which breaks the dark theme for exactly the users who asked for less motion (finding 1).
- **§4.5 every input pinned:**
  - The repository holds. The font items cannot pin, and the spec says so; accepted.
  - The smoke fixtures are unpinned (finding 14).
- **§4.6 dependencies named and pinned:** `pluto-theme` does not name `shadcn-svelte` (finding 5).
- **§6 never:**
  - No commits.
  - No copying: `utils` is written to the interface, and the mark follows the Pluto Systems design book.
  - "Break an installed app silently" is violated by finding 1.
- **The owner's decisions:**
  - The type stack, the ladder, the red and green fills, the text-safe red and a public registry all match `decisions.md`.
  - The replaced canvas values are proposals the canvas offered for the spec to confirm or replace. Each replacement has its arithmetic, and it reproduces (EXECUTED).
  - The two calls then open (doc-ID, coloured dots on ink for the icon) are correctly left undecided, with the deciding spec named. Both are settled since: the doc-ID scheme is `PS-<series>-<NNNN>` (`decisions.md`, "The theme mechanism, the doc-ID scheme and the footer's sentence"), and the icon's dots on ink use the lifted primitives (`decisions.md`, "After the public-readiness review").
  - One call goes beyond the owner's grant: the fourth ground (finding 6). The dark state dots lie next to the icon call (finding 10).
- **The design book's rules:**
  - Two radii: applied by mapping every `rounded-*` to 8 px and leaving `rounded-full`. That is correct, and it matches run memo §5.
  - Ladder: applied to spacing utilities in items. Leaving `h-*` and `w-*` free is a defensible reading of the design book §05.
  - Mark geometry: exact.
  - On-ink rule: applied to the mark. The functional exemption is defensible but should be said (finding 10).
  - No gradients or glass: `menuColor: "default"` removes the translucent menus.
  - One accent per surface: preview pages are not brand surfaces; nothing in the items breaks it.
  - Grooves: match the design book's CSS (`border-top` plus a 1 px inset highlight).

## Verdict

Does not land yet: finding 1 (any later `add` turns the dark theme light for reduced-motion users) and finding 2 (criterion 24 cannot be met, and it deadlocks with the app that installs it) are High. Findings 3 to 6 are Medium: the light tint rows do not reproduce at the stated alpha, lint cannot pass, `shadcn-svelte` is not named, and the fourth ground is an owner call.

## Disposition

Answered by the author, 2026-10-27, in the amended specification (Status "draft, amended 2026-10-27 after review"). The amendment also applies the owner's two newer decisions (Bun is the runtime; a fourth ground for `muted`, insets only) and the toolchain memo's findings (`research/2026-10-27-the-toolchain-under-bun.md`).

1. Fixed: the reduced-motion overrides are emitted under `html:root` (decision 14, with the reason, and decision 15's emission list and a new rule: no `:root` or `.dark` inside an at-rule). `generated.test.ts` asserts that rule and the block's two selectors (criterion 5). Smoke assertion 7 checks that a second `add four-dot -y -o` leaves the app's CSS byte-identical; assertion 8 checks the app's media block holds only `html:root` and `*, ::before, ::after` and no colour variable. The "dark stays dark under reduce" check is made in the browser on the preview app (`tokens.spec.ts`, criterion 17) rather than in the scratch apps' built CSS, which have no browser run. Criterion 19 is now 10 × 2 = 20 (assertions 9 and 10 are the build and a new `svelte-check`).
2. Fixed: 001 lands as *built* on criteria 1–23, and criterion 24 no longer waits on another repository. "Done" is never an app's adoption: criterion 24 is the release, met when the change is tagged `v0.1.0` and the Landing notes cite its review (constitution §2 and §4.2; `decisions.md`, "After the public-readiness review"). No owner question was needed for the split: it follows constitution §4.2.
3. Fixed: tints composite at exactly 0.1 (light) and 0.2 (dark), channels rounded half up; the test reads the same decimal and computes in integer tenths so halves are exact (decision 12). Light rows 27–30 corrected to `#F2E3DF` 4.55, `#F9EAE9` 4.86, `#E0E9E2` 5.08, `#E7F1EC` 5.46; dark rows reproduce unchanged. All 100 rows re-verified by script against the amended table. The "thinnest pass" prose now says 4.55; the canvas table's 4.37 is now 4.40. `wash` and `ink-wash` are called flattened values with exact derivations (ink at 15/255 over paper; paper at 0.1 over ink) (decision 7).
4. Fixed: `.prettierignore` gains `context/` with the build and generated paths (decision 26). `build-tokens` formats `registry.json` and `src/app.css` through prettier's API before writing, so both are checked, not ignored, and `generated.test.ts` compares the formatted text (decision 15, criterion 5).
5. Fixed: `pluto-theme` carries `"devDependencies": ["shadcn-svelte@^1.7.1"]` (decision 19; the schema allows it on any item type and `build` keeps it, READ). `package.json`'s specifier becomes `^1.7.1` under the caret rule (decision 4). The scratch apps hold no `shadcn-svelte`; the smoke test runs this repository's locked CLI with the app as working directory, and assertion 6 checks that the app's `package.json` gained it, assertion 9 that its build resolves the import. `deps.test.ts` counts 5 packages (criterion 12); `registry.test.ts` checks the built field (criterion 7).
6. Fixed: put to the owner; the owner's decision (decisions.md, "A fourth ground for `muted`, insets only") is applied as a rule in decision 8 and in decision 29's notes for `002`/`003`, with `muted`, `accent` and `sidebar-accent` limited to component insets. The draft's own INFERRED justification is removed; decision 7 cites the decision.
7. Fixed: "no state tint on `muted`, in either theme" stated in decision 8 and decision 29, with the four ratios (4.06, 3.96, 4.44 fail; 4.58 forbidden by rule). The three failing pairs are `contrast.forbidden` in the token file, and `contrast.test.ts` asserts each still fails at its stated ratio (decision 12, criterion 4).
8. Fixed: decision 20 now says `utils` installs at the app's `utils` alias path plus `.ts` (READ `resolveItemFilePath`), not at the `lib` alias. Decision 29 tells `002` never to run a stock `add` with `-o` here, or to restore `src/lib/utils.ts` afterwards.
9. Fixed: decision 19 rewords the alias reasoning (a bare `#lib`, replaced last, rewrites only paths no earlier alias matched, e.g. `#lib/registry/blocks/x`) and notes that a `#lib/registry/blocks/...` import survives `build`, which the "no `#lib` in built content" assertion catches.
10. Fixed: decision 28 says 001 decides the dark state-dot case and why. The icon call is settled since: the mark's coloured dots on ink use the lifted primitives (`decisions.md`, "After the public-readiness review"). Decision 8 cites the `paper` choice against the design book's `.paperdots` (`raised` `#FFFFFF`), with the reason.
11. Fixed: the display line height is the design book's 1.15 (decision 11 table and prose, and the token-file shape).
12. Fixed: criteria 22 and 23 are checked by `registry.test.ts` (3 wrangler assertions; 6 item names in the changelog); decision 25 and decision 27 say so. Test-file counts are unchanged at 8 unit, 5 browser, 2 smoke.
13. Fixed: `registry.test.ts` builds into a temporary folder via `build-registry --out` (decision 18); the watcher plugin builds once in `configureServer` before the server listens, so any `vite dev` serves a fresh registry and `dev` is just `bun --bun vite dev` (decision 23); `webServer.command` is `bun run build && bun --bun vite preview …`; `dev-loop.test.ts` runs on a temporary copy with its own server and port, so the two smoke files share no state (decision 25, "Build order"). `fileParallelism` no longer applies: Vitest is replaced by `bun test`.
14. Fixed: the scratch apps are committed fixtures under `tests/smoke/fixtures/kit3/` and `kit2/`, with exact versions and committed `bun.lock` files, installed with `--frozen-lockfile`. Their starting `src/app.css` is exactly `@import "tailwindcss";`, and their `tsconfig.json`, `components.json` (with `"style": "maia"`) and file list are stated (decision 25).
15. Fixed: the `-(--token)` form is allowed in spacing utilities (decision 10); the palette list is read from the pinned `tailwindcss/theme.css` rather than hand-copied, with `black`, `white` flagged and `current`, `transparent`, `inherit` allowed. Weights (400, 500, 700) and `leading-none` (1) are now tokens emitted into `@theme inline` (decision 11), so the lockup's `font-bold leading-none` are token classes; the lint flags any other `font-<name>` or `leading-<name>`. Samples are now 16 bad and 10 good (criterion 11).
16. Fixed: no preview page has a scroll container; install commands wrap; swatch labels sit beside the chip on the ground (decision 24). `keyboard.spec.ts` states the catalogue has no other focusable element.
17. Fixed: `+layout.ts` sets `trailingSlash = 'always'` (decision 3); criterion 8 names the 7 `index.html` files.
18. Fixed: token and registry data load only in `+page.server.ts`, with the reason (decision 24, layout in decision 5). Type-checking scope is stated: `tsconfig.json` includes `src`, `scripts`, `tests` and root `*.ts`, excludes the fixtures, and types Bun and `node:` APIs through `@types/bun` (decisions 2, 4, 26). Scripts may use `Bun` globals; `@types/node` is no longer a direct dependency.
19. Fixed (superseded): under the owner's Bun decision there is no `.nvmrc` and no Node engine; `deps.test.ts` asserts that no `.nvmrc` exists (decision 1, criterion 1).

Constitution note on §4.3 and the preview components: answered in decision 24 (§4.3's "a component" is what an app installs; preview pages are display and measurement fixtures; the geometry fixture's 100 px is a measurement setting).

After the disposition: fit to build.
