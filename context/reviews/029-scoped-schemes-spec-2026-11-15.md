# Review of 029 — Scoped schemes

Reviews [`specifications/029-scoped-schemes.md`](../specifications/029-scoped-schemes.md).

- **Date:** 2026-11-15
- **Status:** dispositioned; fit to build, with five Low write-ins (R1 to R5, "Re-review, 2026-11-15" below). The first verdict, revise, is kept below as it was written.
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted, 2026-11-15 (556 lines). I checked it against these:
  - the constitution, `AGENTS.md`, `reviews/README.md`, `roadmap.md` (rows `029`, `031`, `031a`, `031b`; §3's waves; §6 Q4);
  - the memo `research/2026-11-15-scoped-schemes-and-contrast.md`, with its §9;
  - `020` (decisions 5 and 12, test 9), `021` (decisions 6, 7 and 11, the counts), `023` (decisions 10 and 14), `024` (the headroom table), `019a` decision 3, and the owner's entries in `git show beeb67e:context/decisions.md`;
  - the tree on `release/0.13.0`: `src/app.css`, `src/lib/registry/ui/alert/alert.svelte`, `lib/read-token.ts`, `ui/theme/theme-script.svelte`, `scripts/lint-literals.ts`, `src/lib/site/example-theme-script.svelte`, `src/lib/preview/block-viewer.svelte`, `src/routes/(site)/components/+page.svelte`, `vite.config.ts`, `tests/smoke/fixtures/*/package.json`, `static/v0.11.0/` and `static/v0.12.0/r/styles/maia/pluto-theme.json`, and the existing `build/` output;
  - `node_modules`: shadcn-svelte 1.7.1 (`dist/index.mjs`), `@tailwindcss/node` 4.3.3, Lightning CSS 1.33.0, Vite 8.3.5 (`dist/node/chunks/node.js`).
- **Re-ran:** I changed nothing in the repository but this file. I ran no repository build. Every probe is mine, in `…/scratchpad/029-review/`, written without reading the author's probes first.
  - `cli-probe.mjs`: shadcn-svelte 1.7.1's own CSS merge (`Ds`, from a scratch copy of `dist/` with one export added). An app that installed v0.12.0's `pluto-theme`, then a draft 0.13.0 item shaped per decisions 1 to 7. The three 0.12.0 descendant rules **survive**, with their hexes. A second `add` is **not** byte-identical: `@property --ink-ground` appears once after one add and twice after two. With the `@property` key removed, both the upgrade and a fresh install are byte-identical on the second add. `--color-background: var(--background)` is written from `cssVars.theme`, and the CLI's `--background: var(--background)` self-reference is added beside it (EXECUTED; findings 2 and 3).
  - `minify-probe.mjs`: Tailwind 4.3.3's `compile` and `optimize`, then Lightning CSS with Vite 8's default client targets. After Tailwind: 9 `light-dark(` kept, `@supports not (color:light-dark(#000, #fff))` kept, and Tailwind adds `@layer properties{@supports (…){:root,:host{--ink-ground:#16140f}}}`. After Vite's minify: **1** `light-dark(` left (the `@supports` condition), 28 `--lightningcss-light/dark` references; `:root{--background:var(--lightningcss-light,#f3f0e8)var(--lightningcss-dark,#16140f);…}` (EXECUTED; finding 1).
  - `engines-probe.mjs` and its dark-page twin, Chromium, Firefox and WebKit on Playwright 1.64.1, a light system. Four stylesheets: the spec's shape; the same after Vite's minify; after Vite's minify with `Features.LightDark` excluded; the spec's shape plus the three stale rules. Readings below, the same in all three engines (EXECUTED).
  - `layer-probe.mjs`: `kuiper.css`'s unlayered scope rule against a layered `bg-card`, three engines (EXECUTED; finding 5).
  - `tints-check.ts`, under Bun, with `scripts/contrast.ts`'s `compositeTenths` and `contrastRatio` (EXECUTED).
  - A gzip estimate of the colour blocks from v0.12.0's item (EXECUTED; finding 9).
  - `grep` over the tree; `build/_app/immutable/assets/0.Dh62Kh94.css`, read (READ).
  - [web-features explorer, `light-dark`](https://web-platform-dx.github.io/web-features-explorer/features/light-dark/), read 2026-11-15: Baseline newly available 2024-05-13, widely available expected 2026-11-13; Chrome and Edge 123, Firefox 120, Safari 17.5 (CITED).

## What holds

Each claim below was checked against its evidence, and stands.

- **Nesting, three deep, in all three engines.** The spec's shape gave a dark scope `rgb(243, 240, 232)` on `rgb(22, 20, 15)`, a light scope in it `rgb(11, 15, 23)` on `rgb(243, 240, 232)`, and `--code-text` right at each level (EXECUTED, case A).
- **The field-role trap is real, and the fix works.** A dark scope inside a light `field-1`, with the seven roles restored, read `rgb(243, 240, 232)` on `rgb(22, 20, 15)` (EXECUTED, case A). The `.dark` alias in the same place read the same.
- **The specificity claim.** On `class="dark" data-scheme="light"`, `color-scheme` computed `light`, with light text on the light ground (EXECUTED). `html[data-scheme]` and `html [data-scheme]` are (0,1,1); `:root` and `.dark` are (0,1,0).
- **`@property --ink-ground`.** Ink read the dark `background` on a light page and in a light scope, and the dark `card` in a dark scope (EXECUTED, case A). Its install path is the problem (finding 3), not its behaviour.
- **The CLI's colour check.** `xs` treats a value as a colour only if it starts with `hsl`, `rgb`, `#` or `oklch`, or contains `--color-`. `vs` writes `--<name>: var(--<name>)` otherwise (READ). Putting `color-<name>: var(--<name>)` in `cssVars.theme` is the right fix: `_s` writes it first, and `vs` then finds the declaration and adds no `--color-` line of its own. It survives an upgrade: `_s` replaces declarations, and the second add is byte-identical once `@property` is gone (EXECUTED).
- **The selector-list rule.** `ps` and `hs` use `rule.selectors.includes(":root" | ".dark")`. PostCSS splits selectors with `list.comma`, which keeps `:where(…)` and `:is(…)` whole (READ).
- **The fallback's condition** is right. Tailwind's `optimize` and Lightning CSS both keep `@supports not (color: light-dark(#000, #fff))` (EXECUTED). Neither evaluates or strips it.
- **`readToken`'s parse.** Over all 256 alphas of `#0b0f17xx`, the computed `color` parsed by decision 10's step 4 gave back the token's hex with 0 failures, in all three engines. `oklch(…)` and `color-mix(in oklab, …)` compute to `oklch(…)` and `oklab(…)`, which step 4 returns as text, as it says. No Kuiper colour variable uses those forms: the only `color-mix` in `src/app.css` is the fields' `in srgb` border (EXECUTED; READ).
- **The tints.** Over `card`: 5.10, 5.09 (light), 5.21, 5.19 (dark). Over `background`: 4.50, 4.51, 5.90, 5.93. The solid tints are `#F9E9EA`, `#E6F1EE`, `#4E3631`, `#2E4032`. All as the table says (EXECUTED).
- **The counts.** `dark:` in `src/lib/registry/`: 2, both in `alert.svelte` (lines 10 and 12). `SANCTIONED_TINTS` holds exactly the four (`lint-literals.ts:137`). 48 primitives, so 52 with four more (EXECUTED, grep; READ).
- **Baseline.** `light-dark()` as cited (CITED, above). Safari 16.4 to 17.4 is the gap the fallback covers.
- **The weight.** My estimate is +0.73 kB gzipped against the spec's +0.76 (EXECUTED). It fits every template's headroom in `024`'s table once `024` lands (the smallest is `/` at 307 against 340 kB). The spec already says to stop and ask if `024` has not landed.
- **The CSP hash.** `020` and `029` both change `THEME_SCRIPT` in 0.13.0, so an app updates the hash once (READ, `020` decision 5 and guide step 5).

## Findings table

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | Vite 8's default CSS minify lowers every `light-dark()`. In the site's build and in every Vite 8 app, scopes do nothing, in all three engines | decisions 1, 2, 6; T10–T14, T17; Risks |
| 2 | High | An upgraded app keeps 0.12.0's three descendant rules, with their hexes. In a light scope on a dark page its mark vanishes (1.00:1) | decision 4; T3, T17 |
| 3 | Medium | `@property` in an item's `css` is not idempotent under CLI 1.7.1. Every `add` writes another copy, so T17's byte-identical check cannot pass | decisions 3, 7; T17; line 72 |
| 4 | Medium | Two site head scripts write only `.dark`. Under `color-scheme: light dark`, a light example frame or block view follows a dark system | decisions 1, 5, 14; Scope |
| 5 | Medium | `kuiper.css`'s scope rule is unlayered, so it beats any layered utility on the same element. That contradicts "its `:where()` already gives it no weight" and `021` decision 11 | decision 13 |
| 6 | Medium | The alias and the attribute read differently inside an ink surface. T11's "gives T10's readings" fails for a dark level inside ink | decisions 2, 3, 4; T10, T11 |
| 7 | Low | "The emulated fallback reproduces every reading": the recorded probe's fallback mark differs from the modern one. Decision 6.4's private copies are unprobed | line 68; decision 6 |
| 8 | Low | `readToken("mark-1")` returned `#2D48D4` in an installed 0.12.0 app, not `#2d48d4`. The case changes | decision 10 |
| 9 | Low | Q1's split: the fallback is all of the +0.76 kB, not "about half" | Q1; decision 6 |
| 10 | Low | 0.15.0's removal is an interface change, so it cannot be a small change. Its list misses the site's `dark:` uses, `.dark .site-thumb` and a second CSP hash change | decision 4 |
| 11 | Low | A `.dark` subtree now paints `background-color` and `color`. The guide lists `.dark` under "keeps working" without saying so | decisions 2, 17 |
| 12 | Low | Write-ins: the fallback's root `color-scheme` with scripts off; Firefox 120 to 127; thumbnails; T17 from v0.11.0 | decision 6; Risks; build order |

## Findings, most severe first

1. **Vite's own minifier undoes `light-dark()` in a production build** (decisions 1, 2 and 6; T10 to T14 and T17; Risks, lines 522 to 530; `vite.config.ts`; Vite 8.3.5 `node.js:34661`, `:30866–30873`, `:731–737`).
   - Vite 8's client `build.cssMinify` defaults to `!!minify`, which is Lightning CSS (`node.js:34661`). Its `minifyCSS` calls Lightning CSS with `targets: convertTargets(build.cssTarget)` and no `exclude`. The default target is "baseline-widely-available": `chrome111`, `edge111`, `firefox114`, `safari16.4`, `ios16.4`. None of those has `light-dark()`, so Lightning CSS lowers every pair into its space-toggle form: `var(--lightningcss-light, a) var(--lightningcss-dark, b)` (EXECUTED, `minify-probe.mjs`).
   - That form has `var()` inside a custom property, so it is substituted on `:root` and inherits as one colour. **The derived-variable trap comes back, for every variable.** Only rules that redeclare, here the restated `.dark` block and `.surface-ink`, still switch.
   - The site already runs this pass today. `build/_app/immutable/assets/0.Dh62Kh94.css` holds `--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light` on `:root`, and LayerChart's CSS holds lowered pairs (READ). The memo and the spec checked Tailwind's `optimize` only (memo §3, "No polyfill"; spec line 70).
   - Failure: the spec's shape after Vite's minify, a light system. A `data-scheme="dark"` section reads `rgb(11, 15, 23)` text on `rgb(243, 240, 232)`: light, as if the attribute were absent. Its code line reads the light ink. A dark scope inside `field-1` reads `rgb(11, 15, 23)` on `rgb(243, 240, 232)`. Chromium, Firefox and WebKit agree. With `exclude: Features.LightDark`, every reading returns to case A's (EXECUTED, `engines-probe.mjs`, cases B and B2). The smoke apps are on Vite 8.3.5 (READ, `tests/smoke/fixtures/kit2`, `kit3-node`). T17 as written still passes on the lowered CSS: it looks only for `.bg-destructive-tint` and the `@supports not` block, and both survive.
   - Fix:
     - Decide, in the spec, how a Vite app keeps the pairs. The probe-backed option: `css: { lightningcss: { exclude: Features.LightDark } }` in `vite.config.ts`. Vite spreads `config.css.lightningcss` into its minify call (`node.js:30867`). It needs `lightningcss` as a named, pinned devDependency of the site (§4.6), or the constant written as a number with a comment. Raising `build.cssTarget` to Safari 17.5 also works, but it changes what else gets lowered for the browsers the fallback serves.
     - Add a step to the upgrade guide and `/start/install/`, with the exact config line. Without it, an app's production build has no scopes and nothing warns it (constitution §6).
     - T17: the app's built CSS keeps `light-dark(` in `:root`'s colour declarations, and holds no `--lightningcss-light` inside a token declaration.
     - T10 to T14 run against the built preview, so they catch it in the site. Say so, so the builder does not "fix" it by testing `vite dev`.
     - `kuiper.css` users meet the same pass under `postcss-preset-env` and similar tools. One sentence in its header.

2. **Upgrading leaves 0.12.0's descendant rules in the app, with hexes** (decision 4, lines 176 to 183; T3, line 456; T17, line 470; `static/v0.12.0/r/styles/maia/pluto-theme.json`, `css`).
   - v0.11.0 and v0.12.0 both ship `.dark .surface-ink { --background: var(--card) }`, `.dark [data-mode="expressive"], [data-mode="expressive"].dark { --mark-1: #93B0FF; … }` and `.dark [data-mode="productive"], [data-mode="productive"].dark { --mark-1: #F3F0E8; … }` (READ). The CLI never removes a rule (memo §5). Decision 4 handles the stale `.dark` *variables*, but not these *rules*. After `add`, all three are still in the app's CSS, unchanged (EXECUTED, `cli-probe.mjs`, `cli-out/app-upgraded-2.css` lines 599, 608 and 614).
   - At (0,2,0) they match anything under `html.dark`, which the head script keeps writing until 0.15.0.
   - Failure: an upgraded app, a dark page, a `data-scheme="light"` section with a productive four-dot mark. The dots read `rgb(243, 240, 232)` on `rgb(243, 240, 232)`: **1.00:1**, so the mark is gone. An expressive mark reads `#93B0FF` on paper: 1.86:1, below 1.4.11's 3:1. An ink surface in that section reads `card`, not `background`. Chromium, Firefox and WebKit agree (EXECUTED, case C on a dark page; `tints-check.ts` for the ratios). T3 reads the item, so it passes. T17 reads only `.dark`'s variables, so it passes too.
   - Fix: decision 4's own reasoning applies ("asking each app to delete its `.dark` block could fail silently"). Keep the three exact selector strings in `css` until 0.15.0, each restating the new values: the ink `--background` pair, and the four mark pairs per mode. Then the CLI overwrites each hex with a pair that is right in every scope. T3 exempts those three selector strings, by exact text, until 0.15.0. Decision 4's 0.15.0 list removes them, and its guide says to delete them. T17 adds: no colour variable in any rule of the upgraded `app.css`, outside the fallback, holds a bare hex that differs from `:root`'s pair.

3. **`@property` cannot be installed idempotently by CLI 1.7.1** (decision 3, line 151; decision 7, line 220; T17; line 72's "READ, function `ws`").
   - In `ws`, a `@property` key goes to `Es(root, "@property --ink-ground", decls)`. `Es` looks for `e.type === "rule" && e.selector === t`. The first add creates a *rule* whose selector text starts with `@property`. Printed, it reads as an at-rule. Re-parsed on the next add, it *is* an at-rule, so `Es` does not find it, and appends another (READ; EXECUTED: 1 copy after one add, 2 after two). No item uses `@property` today (grep, every `static/*/r/styles/maia/*.json`), so nothing has met this before.
   - Failure: decision 7's "A second `add kuiper-theme` leaves the app's CSS byte-identical" and T17's last clause fail. Each update adds five lines to the app's CSS. They are harmless at run time.
   - Fix: drop the registration. The probe-backed property only needs "the nearest scope's scheme as a hex". Each scope can write that directly: `:root { --ink-ground: #16140f }`; `html[data-scheme="dark"], html :is([data-scheme="dark"], .dark):not(.surface-ink) { --ink-ground: #221f19 }` and the light twin; `@media (prefers-color-scheme: dark) { html:not([data-scheme], .dark) { --ink-ground: #221f19 } }` for scripts off (no `:root` in an at-rule). The ink surface inherits it. That also works in Firefox 120 to 127, which have `light-dark()` but not `@property`; there, today's design paints ink as `card` everywhere (INFERRED, from substitution). It needs no fallback part either. Probe it in three engines before the spec says EXECUTED. If the registration stays, T17 must allow the duplicate, and the spec must say each update grows the file.

4. **The site's frames still switch with the class alone** (decisions 1 and 5; decision 14; Scope, line 434; `src/lib/site/example-theme-script.svelte:8`; `src/lib/preview/block-viewer.svelte:33–40`).
   - The example frames' head script runs `classList.toggle("dark", t === "dark")`. The block viewer copies the parent's `dark` class onto its frame's `<html>`. Neither writes `data-scheme` or `color-scheme`. Under decision 1's `:root { color-scheme: light dark }`, a frame without `.dark` follows the reader's system. That is the same fault decision 5 and guide step 1 name for an old `theme` script (READ).
   - Failure: a reader with a dark system opens a component page. The "light" example frame and a light block view render dark. `015`'s frames exist to show each scheme exactly, so the page shows the wrong one. Criterion 15 checks only the theme page's new example.
   - Fix: add both files to Scope and decision 14. Each writes `data-scheme` always, and the class while the alias lives. Add a test: with `colorScheme: "dark"`, a `?theme=light` frame's `<html>` computes `color-scheme: light`, and its body reads the light `background`. The same holds in an app that sets `.dark` itself, without the `theme` item. Add a guide step: "If your app toggles `.dark` itself, also set `data-scheme` on `<html>` for both schemes."

5. **`kuiper.css`'s unlayered scope rule wins over any layered style** (decision 13, item 4, line 294).
   - "Unlayered here, since `kuiper.css` holds no `@layer` (its `:where()` already gives it no weight)." Specificity is only compared within a layer. An unlayered normal declaration beats every layered one, whatever its specificity. Tailwind 4 puts every utility in `@layer utilities`.
   - Failure: an app uses `kuiper.css` with Tailwind and writes `<section data-scheme="dark" class="bg-card">`. The section reads `rgb(22, 20, 15)`, the scope's `background`, not `card`, in all three engines (EXECUTED, `layer-probe.mjs`). The seven restorations beat a layered field utility on the same element in the same way. Separately, `021` decision 11 says the file "holds nothing else … No rule but these three blocks … a variables file that carried rules would style an app that asked only for values". Decision 13 adds three rule blocks, one of which sets `color` and `background-color`, without saying it amends that.
   - Fix: wrap the scope rule in a named layer in `kuiper.css`, for example `@layer kuiper.scope { … }`. A layered rule loses to everything unlayered, and to later layers, so it carries no weight in both kinds of app. Then say in decision 13 that it amends `021` decision 11, and why. Or leave the `color` and `background-color` part out of `kuiper.css`, and document that a non-Tailwind app sets them on its scopes. Either way, `021`'s T9 changes with it.

6. **Inside an ink surface, `data-scheme="dark"` and `.dark` differ** (decision 2, lines 113 to 131; decision 3; decision 4; T10, T11, lines 463 and 464).
   - The scope rule restores seven roles. The alias restates every variable. So wherever an ancestor redeclares a variable outside the seven, the two differ. The ink surface redeclares `--background`.
   - Failure: an ink surface inside a dark scope on a light page. A `data-scheme="dark"` section in it reads `rgb(34, 31, 25)`, the ink ground. A `class="dark"` section reads `rgb(22, 20, 15)`, the dark `background`. A light scope in the same place reads the light `background`. So the attribute is asymmetric: light-in-ink resets the ground, dark-in-ink keeps it (EXECUTED, case A, `darkScopeInInk` and `aliasInInk`, all three engines). If T10's nest puts a dark level inside its ink sample, T11 fails as written. The same split happens for an app's override of, say, `--card` on a wrapper: the alias blocks it inside, the attribute lets it through.
   - Fix: decide the rule and test it. Recommended: add `--background` to the restored roles, from a `--surface-background: var(--background)` copy on `:root`. Then every scope starts on its own scheme's ground, both directions, as the alias does. `.surface-ink`'s unlayered `--background` still wins on the ink element itself, and fields do not reset `--background`, so nothing else moves. T10 then nests a dark level inside ink and expects the dark `background`. Otherwise, state that a dark scope inside ink keeps the ink ground, and limit T11 to nests with no override between levels.

7. **One measurement claims more than its recorded probe shows** (line 68; decision 6, item 4).
   - Line 68 says the emulated fallback "reproduces every reading". In the author's `probe-out.txt`, the fallback runs read `mark` as `rgb(243, 240, 232)`, where the modern runs read `rgb(147, 176, 255)`. That probe had no `--_mark-*` copies. Decision 6.4's design for the marks has not been run; memo §9 labels it INFERRED.
   - Fix: run decision 6.4's copies in the emulated fallback, or relabel the claim INFERRED for the marks. T12 already covers the marks in the build.

8. **`readToken`'s case changes** (decision 10, line 263).
   - "`readToken("mark-1")` returns `#2d48d4` on a light page before and after this change." v0.12.0's item ships `"mark-1": "#2D48D4"`, upper case (READ, `static/v0.12.0/r/styles/maia/pluto-theme.json`; the current `static/r/` item too). `getPropertyValue` returns the text as written, so an installed app read `#2D48D4`. Only this repository's `src/app.css` is lower case.
   - Fix: "returns lower-case hex; an installed app read upper case before". Add that to the `read-token` changelog bullet and guide step 7. A case-sensitive comparison in an app changes.

9. **The fallback is the whole weight, not half** (Q1, line 536; decision 6, line 213).
   - From v0.12.0's colour blocks: today 1,281 bytes gzipped. With pairs, the restated alias and the two hex sets, 2,012: +0.73 kB. With pairs and the alias but no fallback, 1,143: −0.14 kB (EXECUTED, an estimate). The restated `.dark` block compresses to almost nothing, and pairs are shorter than two blocks.
   - Fix: Q1 says "The fallback is all of this specification's added weight, about 0.8 kB per page; without it the colour CSS is slightly smaller than today." The builder's measurement (decision 18) gives the real split.

10. **0.15.0's removal, as planned** (decision 4, line 183).
    - "By a small change that `029`'s landing adds to the roadmap." Removing `.dark`, its variant and the class write changes an interface. `AGENTS.md` and constitution §5 define a small change as one that "changes no interface". It needs a specification, short as it may be, with its own changelog bullet and guide.
    - The list misses three things. The site's 12 `dark:` uses and `.dark .site-thumb` (`site.css:256`) depend on `<html>` carrying the class, and the index's first-row pictures are chosen by that rule (`beeb67e` decisions, line 96). Dropping the class write changes `THEME_SCRIPT` again, so CSP hashes change in 0.15.0 too. And finding 2's three legacy selectors go then.
    - Fix: say "a specification in 0.15.0", and add those three to its list.

11. **The alias now paints** (decision 2's scope list; decision 17, "What keeps working until 0.15.0").
    - `.dark` is in the scope rule, so every `.dark` subtree gains `background-color: var(--background)` and `color: var(--foreground)`, in `@layer base`. In 0.12.0 a `.dark` wrapper set variables and painted nothing. The changelog bullet says so for "a scope". The guide lists `.dark` as something that "keeps working", which a reader takes as unchanged.
    - Failure: an app's `<div class="dark">` around a transparent overlay, or over an image, now paints a dark ground.
    - Fix: a guide step: "A `.dark` or `data-scheme` element now paints its scheme's ground and text colour. Add `bg-transparent` where it must not."

12. **Write-ins.**
    - Decision 6: with scripts off, an older Safari on a dark system gets `:root`'s `color-scheme: light dark` with the light hex set. Form controls and scrollbars then draw dark on a light page. Add `color-scheme: light` to the fallback's root light set for `html:root:not([data-scheme], .dark)` (INFERRED).
    - Risks: name Firefox 120 to 127, where `light-dark()` works but `@property` does not. That is moot if finding 3's fix is taken.
    - Build order, step 8: `src/app.css` changes, and the thumbnail manifest hashes it for every item (`020`, build step 5). So every thumbnail is regenerated, and `color-scheme`'s change can move pixels in the dark ones. Say so, and record the count.
    - T17 "the same from `/v0.11.0/r`": v0.11.0 ships the same three descendant rules (READ). Finding 2's assertion applies to it too.
    - The stale text the author flags in `roadmap.md` (§6 Q4, row `029`'s "the owner's four questions") is for the design lead, as the spec says.

## The open questions, judged

- **Q1, when the fallback goes. Option 1 is right,** with two edits. First, finding 9's figure: the fallback is the whole cost. Second, the trigger should name both floors that lower CSS for Safari 16.4: Tailwind's `optimize` targets, and Vite's default `build.cssTarget` (finding 1). The fallback is worth keeping exactly as long as a build in the install path still targets an engine without `light-dark()`. Removing it changes the supported browsers, so it is a changelog entry, and per finding 10 not a small change.
- **Q2, the tints' ground. Option 1, over `card`, is right.** The figures are as stated (EXECUTED). It raises the floor from 4.50 to 5.09, and a tinted alert reads as a tinted card, like `default`. The cost is small. On the paper page a light tint is 1.03:1 (destructive) and 1.01:1 (success) against the page. The `border-destructive` and `border-success` edges carry the boundary, as they do today. Option 3 would leave the depth rule broken, which the owner's ruling forbids.

## The author's notes, judged

- **`data-scheme` → `data-thumb-scheme` on the index's thumbnails: agree.** Left as it is, each `<img>` becomes a scope and gains a ground and `color-scheme`. `scripts/site/thumbnails.ts` uses Playwright's `colorScheme`, not the attribute, so only `+page.svelte:167` and `site.spec.ts` lines 819 and 836 change (READ).
- **`021`'s counts: agree.** 48 + 4 = 52 primitives and 61 + 2 = 63 roles. `021`'s T2 and criteria 2 and 17 and the bench move with them. The contrast count is pinned in the build, as it says.
- **Lane-I order with `028`: agree.** `028` is "system-colour rules on every interactive item" (row `028`). Alert is not interactive, and `read-token` is a lib file. Forced colours discard author backgrounds, so the order changes no reading. The design lead orders them, after `023`, as the spec says.

## Acceptance criteria, as written: can each be checked?

1. One value per colour — checkable (unit). READ.
2. The alias — T11 fails as written if T10 nests a dark level in ink (finding 6).
3. No descendant rules — checkable. It needs finding 2's exemption if the legacy selectors are restated.
4. No `dark:` in items — checkable; 2 → 0 (EXECUTED count).
5. The fallback — checkable by emulation. It proves nothing about a build that lowers `light-dark()` (finding 1).
6. The CLI — **cannot pass** while `@property` is in `css` (finding 3). T17 cannot see lowered pairs or stale rules (findings 1 and 2).
7. The tints — checkable; the figures hold (EXECUTED).
8. `readToken` — checkable; the parse holds over 256 alphas (EXECUTED). The "before" value is wrong in an installed app (finding 8).
9. Nesting — checkable on the preview server. It fails until finding 1 is fixed (EXECUTED, case B).
10. Portals and ink — checkable. Ink's rule depends on finding 3's fix.
11. The head script — checkable. The site's frame scripts are not covered (finding 4).
12. `kuiper.css` — checkable once decision 13 is amended (finding 5).
13. The counts — checkable.
14. The `var()` test — checkable. With finding 3's fix, `--ink-ground` is still declared in `css`.
15. The site — checkable. It needs finding 4's frame test.
16. to 20. — checkable as written.

## Constitution checks

- §4.1 source, not a package: kept. Nothing reaches back at run time.
- §4.3 tokens are the one source: kept. Every pair is today's two hexes. The new tints are composited from primitives, and the validator holds them to it. `--ink-ground` is written by the generator from roles.
- §4.4 accessible and proven: at risk until findings 1 and 2 are fixed. One empties every scope in a production build; the other puts a mark at 1.00:1 in an upgraded app. Both are measured, in three engines.
- §4.5 and §4.6 pinned and named: finding 1's fix needs `lightningcss` named and pinned if the site imports `Features`.
- §5 small change: the 0.15.0 removal is not one (finding 10).
- §6 never break an installed app silently: findings 1, 2 and 4 are each a silent break in an app that follows the guide as written. Each needs its guide step and its smoke assertion.
- Prior art: studied, not copied. The spec cites behaviour, not code.

## Verdict

Does not land yet: revise. Findings 1 to 6 stand. Vite's minifier lowers the pairs in every production build. Upgraded apps keep three stale descendant rules. `@property` cannot be installed idempotently. The site's frame scripts write only the class. `kuiper.css`'s scope rule is unlayered. The alias and the attribute differ inside ink. Findings 1 to 3 change the design: the build config, the legacy selectors and the ink ground. The rest are text and tests. The core model holds in all three engines: pairs on `:root`, the attribute at (0,1,1), the scope rule with seven restorations, the fallback's condition, `readToken`'s probe and parse, and the solid tints over `card`.

## Disposition

The author answered all 12 findings in the specification's "Review" table, and in memo §10. Each answer was checked again, with new probes. The results are in "Re-review, 2026-11-15" below: findings 1 to 9, 11 and 12 are fixed, and finding 10 is fixed with one count corrected against this review. Verdict as it stands: fit to build, with write-ins R1 to R5.

## Re-review, 2026-11-15

- **Reviewed:** the specification as revised ("Revised after review", 917 lines), memo §10, and the author's probes in `…/scratchpad/029-rev/` (`engines.mjs` and its output, `cli.mjs`, `vite/`, `layer.mjs`). The roadmap's stale Q4 text is fixed (READ, `roadmap.md` §6 Q4).
- **Re-ran:** I changed nothing in the repository but this file, and ran no repository build. My new probes are in `…/scratchpad/029-review/vite/` and `…/029-review/rev/`.
  - `vite/`: two real **Vite 8.3.5** production builds (`vite build`, the repository's binary) of a scratch app with `@tailwindcss/vite` 4.3.3. One uses defaults. The other uses the guide's line exactly as written: `import { Features } from "lightningcss"` and `css: { lightningcss: { exclude: Features.LightDark } }`. Both built cleanly. Defaults: 1 `light-dark(` left (the `@supports` condition) and 30 `--lightningcss-*`, with `:root{--background:var(--lightningcss-light,#f3f0e8)var(--lightningcss-dark,#16140f)`. Excluded: 10 `light-dark(`, **0** `--lightningcss-*`, `:root{--background:light-dark(#f3f0e8,#16140f)`, and `@supports not` kept (EXECUTED).
  - `vite/read.mjs`: both built stylesheets in Chromium, Firefox and WebKit, with the system light and dark.
    - **Excluded:** the dark scope read `rgb(243, 240, 232)` on `rgb(22, 20, 15)`. Its code line and its `bg-card` were dark. A light scope inside `field-1` was light. Ink in the dark scope was `card`. A dark scope inside ink read `rgb(22, 20, 15)`, the same as `.dark` there. A bare `.dark` painted. All six runs gave the same readings.
    - **Defaults:** the dark scope read light, and a dark scope inside ink read the *light* `background` (EXECUTED).
  - `Features.LightDark` is `1048576` in Lightning CSS 1.33.0, and in the 1.32.0 copy nested under `@tailwindcss/node`. Vite 8.3.5 depends on `lightningcss ^1.33.0`, and `bun.lock` resolves 1.33.0 (EXECUTED; READ).
  - `rev/cli.mjs`: the author's merge of the revised item, re-run into my folder, over apps installed at v0.11.0 and v0.12.0. A second `add` is byte-identical from both versions and fresh. The legacy rules hold pairs. From v0.12.0, 0 stale hexes remain. From v0.11.0, only `--syntax-amber`, `-purple`, `-teal` and `-cyan` remain in `.dark` (EXECUTED).
  - `rev/upgraded-engines.mjs`: those two upgraded `app.css` files, compiled by Tailwind 4.3.3 and read in three engines. The page was `class="dark" data-scheme="dark"`, with a light scope holding a productive mark, an expressive mark with a productive island, and ink with a dark scope inside it. Result: **0 mismatches** from both versions in all three engines, in the modern path. The emulated fallback was not judged here, because the author's CLI item abridges its fallback block on purpose. `029-rev/engines.mjs` covers the full fallback: 24 runs, 0 mismatches (READ, its output) (EXECUTED).
  - `rev/layer-order.mjs`: `@layer kuiper.scope;` first, three import orders, three engines.
    - `kuiper.css` before Tailwind's layer statement: `bg-card` wins (`rgb(34, 31, 25)`).
    - After it: the scope rule wins (`rgb(22, 20, 15)`).
    - The statement at the top of the first sheet, with `kuiper.css` last: `bg-card` wins.
    - An unlayered app rule wins in every order (EXECUTED).
  - `rev/alias-marks.mjs`: marks inside an expressive stage, three engines (EXECUTED; R1).
  - `grep`: no Kuiper file sets `--color-surface-100`, `-300` or `-content`. LayerChart's dist holds `var(--color-surface-100, light-dark(white, black))` 9 times, plus a literal `white` and `black` once each. The only rule in `src/app.css` that sets `--background` on a non-root element is `.dark .surface-ink`. The site's `dark:` *variant* uses number 10; the other `dark:` hits are object keys (EXECUTED).

### Each finding, against the revision

1. **Vite's minifier — fixed.** Decision 8, the guide's step 2, T17's build half (with its mutation), T23, and "tests run on the production preview" close it. My real Vite 8.3.5 build with the guide's exact line keeps every pair, writes no switch, and reads right in three engines (EXECUTED). Pinning `lightningcss` 1.33.0 matches what Vite already resolves, so it adds no second copy. An app on Vite 8 can apply the line as written: `lightningcss` is a dependency of Vite, so it is already in the tree, and the guide says to add it directly, which pnpm needs. The numeric form is right for 1.32.0 and 1.33.0. See R2 for the evidence for npm and pnpm.
2. **Legacy descendant rules — fixed.** They are restated by exact text, with pairs (decision 4's table), and the fallback restates them too (decision 6.4 and 6.5). T2 holds their values, and T3 exempts them by text. T17 checks every rule. Upgraded apps from v0.11.0 and v0.12.0 read 0 mismatches in three engines (EXECUTED). The note that a reformatted selector gets appended, and wins by order, matches `Es`'s exact-text lookup (READ).
3. **`@property` — fixed.** The design now uses a hex `--ink-ground` per scope, with a `prefers-color-scheme` rule on `html:not([data-scheme], .dark)` for scripts off. The second add is byte-identical, fresh and from both versions (EXECUTED). The specificities hold. Light after dark on one element: (0,1,1) against (0,1,1) on the root, and (0,2,1) against (0,2,1) below it, so the attribute wins by order. The fallback's `html:root:not([data-scheme], .dark)` is (0,2,1) and beats the media rule. It also works where `@property` does not.
4. **Frame scripts — fixed.** Decision 15 and T22 cover both scripts. The example script writes `data-scheme` always, as `light` unless `?theme=dark`, so a frame never follows the system, as its comment intends. The block viewer copies the attribute and watches it. Views also run `ThemeScript`, which writes the attribute itself (READ, `(view)/+layout.svelte`). Thumbnails come from Playwright's `colorScheme` and the frame's `?theme=` (READ, `thumbnails.ts`, `frame.svelte:57`), so they are unaffected. The site sets no CSP, so the frame script's new bytes need no hash (READ, `static/_headers`). Guide step 3 covers apps that toggle `.dark` themselves.
5. **`kuiper.css` layering — fixed.** It uses `@layer kuiper.scope;` first, the rule inside it, the header's import-order sentence, and an explicit amendment of `021` decision 11 with T9 rewritten. My three orders behave exactly as decision 14 says (EXECUTED). Imported after Tailwind's layer statement, it still wins; that order is documented, not prevented, which is acceptable for a plain-CSS file.
6. **Alias and attribute inside ink — fixed**, by the eighth restoration. The only non-root rule in the tree that sets `--background` is the ink rule, so nothing else moves (grep). The production build reads the dark `background` for both forms inside ink (EXECUTED). It forms no cycle: `--surface-background` is declared only on `:root`, on `.dark` (where an unlayered `--background` also sits) and in the fallback sets. But marks inside an expressive stage still differ between the two forms; see R1.
7. **The fallback claim — fixed.** It is withdrawn, and decision 6.5 is now probed (`029-rev/engines.mjs`, 12 fallback runs, 0 mismatches; READ, its output and source, which carries the `--_mark-*` copies and the legacy selectors).
8. **`readToken`'s case — fixed.** Decision 11, the bullet, guide step 10, T9's upper-case stub and T19's lower case cover it.
9. **The weight split — fixed.** Decision 19 and Q1 say +0.73 kB, all of it the fallback.
10. **The 0.15.0 removal — fixed.** It is now a specification of its own, and its list adds the site's uses, `.dark .site-thumb`, the frame scripts, the legacy selectors and the second CSP hash change. **The count is the author's, not mine:** the site has 10 `dark:` variant uses. This review's "12" counted object keys such as `dark: string` (EXECUTED). Line 350 can drop "the review counted 12".
11. **`.dark` paints — fixed.** Decision 2, the bullet, guide step 7, Risks and T11's bare-`.dark` case cover it.
12. **Write-ins — fixed.** Decision 6.3 covers the fallback root's `color-scheme`; its ink ground was found and fixed by probe. Firefox 120 to 127 is moot now. Thumbnail regeneration is in decision 15, build step 9 and criterion 16. v0.11.0 is in T17, and its dead names are in guide step 5 (see R4).

### The author's two new findings, judged

- **LayerChart's literal white and black: agree, and it should not wait.** Kuiper sets none of `--color-surface-100`, `-300` or `-content` (grep). So LayerChart's `light-dark(white, black)` fallbacks, and one literal `white` and one `black`, reach the page. That is a §4.3 gap in the `chart` item, and it already exists today. But decision 8 makes it worse in one place. Today Vite lowers those fallbacks, so they work in Safari 16.4 to 17.4. With the exclusion they stay native, and there they are invalid, so the halos lose their fill (INFERRED, from substitution; decision 8 says the same). R3 asks for the order.
- **v0.11.0's four dead `--syntax-*` names: agree that they are dead.** They were removed in 0.12.0 (CHANGELOG line 13). No 0.13.0 item reads them, and T17's assertion rightly covers only what the item declares. The guide's wording should match `020`'s, though; see R4.

### Remaining findings

All five are Low write-ins, each with its fix text. None changes the design.

- **R1. Inside an expressive stage, `.dark` and the attribute give different marks** (decision 4, "restates every key of `cssVars.light`"; T11; guide step 6).
  - The alias restates the productive `--mark-*` pairs, so a `.dark` part inside `data-mode="expressive"` shows paper dots, as in 0.12.0. `data-scheme="dark"` and `class="surface-ink"` alone inherit the stage's pairs and show the lifted dots.
  - Measured on a light page in an expressive stage, the same in all three engines (EXECUTED, `rev/alias-marks.mjs`): `data-scheme="dark"` and `surface-ink` read `rgb(147, 176, 255)`; `.dark` and `dark surface-ink` read `rgb(243, 240, 232)`.
  - Decision 3 says this in passing ("A `.dark` element inside an expressive stage restates the productive marks"). But T11 asserts that `class="dark surface-ink"` reads as `class="surface-ink"`, and guide step 6 presents the swap as a pure rename. Both colours pass 3:1 on ink, so nothing fails contrast. An app that follows step 6 sees its dots change colour.
  - Fix: T11 adds the case and expects the difference. Guide step 6 gains one sentence: "Inside an expressive stage, a part you move from `.dark` to `data-scheme` or `surface-ink` shows the lifted dots, as the stage does; `.dark` showed paper."
- **R2. The Vite line under npm and pnpm is argued, not tested** (decision 8; guide step 2; criterion 6, "under Bun"; constitution §4.5).
  - The spec gives pnpm as the reason for the explicit dependency. But T17 runs under Bun only, and no smoke app installs with npm or pnpm today (roadmap row `040`).
  - Fix:
    - Give the guide's step for all three managers: `bun add -d`, `npm i -D` and `pnpm add -D` `lightningcss@<Vite's version>`.
    - In the landing notes, add a note to row `040`: its npm and pnpm apps carry guide step 2 and T17's build assertion.
    - T17 also checks that the app's `Features.LightDark` equals `1048576`, the value Vite's copy reads, so a version skew between the two copies would show.
- **R3. Land the chart fix before the tag** (decision 8, "a finding for the design lead"; Risks).
  - With the exclusion, LayerChart's halos lose their fill in Safari 16.4 to 17.4. That is a regression this specification introduces, in a browser range its own fallback exists to serve.
  - Fix: say that the `chart` small change, which maps `--color-surface-100`, `-300` and `-content` to roles, is queued in lane I for 0.13.0, before the tag. Mapped to roles, the fallbacks are never used, and the pairs then come from the theme's own fallback. If it slips, the 0.13.0 changelog names the gap.
- **R4. Guide step 5 contradicts `020`'s order for v0.11.0 apps** (decision 18, step 5).
  - "It may delete them" names four names. `020`'s guide tells an app coming from 0.11.0 to apply 0.12.0's notes first. Those notes delete these four, and also the removed `--code-*` names and their `@theme inline` lines (CHANGELOG line 32). The `--code-*` names are `var()`s, not hexes, so the author's scan does not see them. An app that kept one, say `text-code-builtin`, reads the light colour inside a dark `data-scheme` part.
  - Fix: step 5 says "If you came from 0.11.0 and skipped 0.12.0's deletions, make them now (0.12.0's changelog lists them)". It need not list four of them.
- **R5. Two stale lines.**
  - Header line 48 still says the roadmap's Q4 text "is stale (noted for the design lead)". It has been fixed; say so, or drop the sentence.
  - Line 350's "the review counted 12" should go, per finding 10 above.

### Verdict after re-review

Fit to build. Findings 1 to 12 are fixed, each probed again where the design changed:
- a real Vite 8.3.5 build with the guide's exact line;
- upgraded apps from v0.11.0 and v0.12.0, 0 mismatches in three engines and byte-identical on the second add;
- the hex ink ground;
- the layer order;
- the eighth restoration inside ink;
- the frame scripts.

R1 to R5 are Low write-ins with their fix text, and need no further spec review. Q1 and Q2 wait on the owner; the recommended options stand.
