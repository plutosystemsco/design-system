# Scoped schemes and a high-contrast scheme

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request.
- **Question:** How should Pluto let any subtree be light or dark, add a high-contrast scheme that follows `prefers-contrast: more` and can be set by hand, and how do the two fit together?
- **What would answer it:** Pluto's token build and items, the prior-art clones, and the three browser engines, run.
- **What it blocks:** the specification that next changes `pluto-theme` or `theme`. It answers the placeholder [the theme with scripts turned off](2026-11-14-the-theme-with-scripts-turned-off.md) in passing (§4).

## How to read this memo

- **READ:** a file says so, read on 2026-11-15. Prior-art paths are under `context/prior_art/`, at the commits in its README.
- **EXECUTED:** run on 2026-11-15. Engine probes used the repository's Playwright 1.64.1: Chromium 156, Firefox 157, WebKit 27.2. Scripts and fixtures were in the session scratchpad, not the repository.
- **CITED:** a web page, read on 2026-11-15.
- **INFERRED:** our reasoning.

Terms. A **scheme** is light or dark. A **scope** is an element whose subtree takes another scheme. `light-dark(a, b)` is a CSS colour function: it gives `a` or `b` by the **used colour scheme** of the element that paints with it. The **derived-variable trap** is this: a `var()` inside a custom property is substituted on the element that declares it, so a copy declared on `:root` keeps `:root`'s value in every subtree (2026-11-01 ink memo §1.2). A **registered** property is one declared with `@property` and a `syntax`.

## 1. What Pluto has

- **The theme is a class.** `.dark` on `<html>`, set before paint by the `theme` item's head script, or by its store (READ, `src/lib/registry/ui/theme/theme-script.svelte`, `theme.svelte.ts`). Preference is `light | dark | system` under the key `pluto-theme`. Not `mode-watcher` (READ, `decisions.md`, 2026-11-01).
- **Colours are written twice.** `:root` holds 145 variables, `.dark` 98 (EXECUTED, awk over `src/app.css`). The token file holds `themes.light` and `themes.dark`, 61 roles each (READ, `tokens/pluto.tokens.json`).
- **The generator works around the trap.** The 16 `--code-*` references and the `--surface-*` copies are repeated in `.dark` so a subtree re-substitutes them (READ, `scripts/build-tokens.ts`, comments at lines 96 and 200–205).
- **The dark variant is `@custom-variant dark (&:is(.dark *))`** (READ, `src/app.css` line 8). It matches any descendant of any `.dark`. It never matches the `.dark` element itself.
- **`dark:` in `src/lib/registry/`: 2 uses, 1 file.** `ui/alert/alert.svelte` lines 10 and 12: `dark:bg-destructive/20`, `dark:bg-success/20` (EXECUTED, grep).
- **`.dark …` rules: 3, all in `pluto-theme`.** `.dark .surface-ink`; `.dark [data-mode="expressive"]` (with `[data-mode="expressive"].dark`); `.dark [data-mode="productive"]` (with its `.dark` twin) (READ, `src/app.css` lines 609–635; `registry.json` lines 462–477).
- **`surface-ink`** is `class="dark surface-ink"`: a plain rule, because a layered utility loses to the unlayered `.dark` on the same element (READ, `decisions.md`, 007 entry).
- **The design site uses `dark:` for content**, not colour: `dark:hidden`, `hidden dark:inline`, `dark:grid` in three examples (READ, `src/lib/site/examples/pluto-theme/code.svelte`, `colours.svelte`, `measured.svelte`).
- **015 routed around scoping.** A light island leaks three ways: the `dark:` variant, the three `.dark …` rules, and portals that mount under `<body>`. So 015 shows each example in its own framed document (READ, `specifications/015-the-design-site.md`, "Why a document, not a light-scoped subtree").
- **No high contrast.** No `prefers-contrast` rule. One `forced-colors` rule, for `.glass` (READ, `src/app.css`).
- **How far today's colours are from 7:1.** In light, 23 of 37 text pairs are below 7:1; in dark, 12 of 37. The lowest are `caution-text` on `muted` (4.55) and the destructive and success tints (4.50, 4.51). Of the 21 non-text pairs, 7 (light) and 3 (dark) are below 4.5:1; `input` is the common one (EXECUTED, `contrastTable` from `scripts/contrast.ts` over the token file).

## 2. What each prior-art system does

**Primer.** A theme is a full set of variables under an attribute selector: `[data-color-mode="dark"][data-dark-theme="…"]`, plus an `auto` form under `prefers-color-scheme` (READ, `primer-primitives/src/platforms/css.ts` lines 28–45). Any element can carry the attributes, so nesting works by redeclaring everything. High contrast is a whole theme name, `light_high_contrast`, one of 14 (READ, `scripts/themes.config.ts`). It needs 7:1 text and 4.5:1 borders (READ, the Primer memo). No `prefers-contrast` rule anywhere (EXECUTED, grep).

**Carbon.** A zone is a class, `.cds--g100`. It redeclares every colour, sets `color-scheme`, and sets its own `background-color` and `color` (READ, `packages/styles/scss/_zone.scss` lines 41–53). It must re-emit its layer tokens, because of the derived-variable trap; the comment cites issue 11138 (READ, lines 55–80). "High contrast mode" in Carbon means `forced-colors` (READ, `utilities/_high-contrast-mode.scss`).

**Spectrum.** Contrast is its own axis in the data: a mode set `contrast` with `regular` and `high`, beside `colorScheme` with `light`, `dark` and `wireframe` (READ, `packages/design-data/mode-sets/`). No token sets `contrast: high` yet (EXECUTED, grep). Axes in data, not in selectors.

**Radix Themes.** `.light` and `.dark` on any `Theme` element; each redeclares its scale (READ, `src/styles/tokens/colors/gray.css`). `color-scheme` is set on the theme element, and on `:root` when the theme is the root one (READ, `src/styles/tokens/color.css` lines 54–65). Eight component stylesheets hold dark-only values. Each is a variable set on the theme root, guarded by `:not(.light, .light-theme)` (READ, e.g. `components/kbd.css` lines 14–19). So components keep no `dark` selector of their own.

**Material web.** The labs styles now emit `--md-sys-color-*: light-dark(light, dark)` when the two differ, with `color-scheme: light dark` on `:root`, inside a cascade layer (READ, `labs/gb/styles/color/md-color-tokens.scss`; `internal/_color-tokens.scss` lines 84–90). Contrast is a number in Material Color Utilities, which the catalog depends on: −1, 0, 0.5 and 1 (READ, `catalog/package.json`; CITED, [MCU `contrast_curve.d.ts`](https://cdn.jsdelivr.net/npm/@material/material-color-utilities@0.4.0/dynamiccolor/contrast_curve.d.ts)). That is a generator, not a stylesheet axis.

**Skeleton.** It writes pairings in `light-dark()`, 140 in `theme.css` (EXECUTED, grep). But `color-scheme` is set on `:root` alone, through `@variant dark` (READ, `packages/skeleton/src/base/globals.css` lines 13–16). Its dark variant is `&:where([data-mode="dark"], [data-mode="dark"] *)` (READ, playground `layout.css`). So a light island inside a dark page still matches `dark:`. Skeleton has the values for scoping, but not the selectors.

**What they agree on.** Every system that nests sets `color-scheme` on the scoped element and redeclares, or resolves, the colours there. None of them uses a descendant `dark` selector in a component. None follows `prefers-contrast` with a colour set.

## 3. Browser facts

- **Support.** `light-dark()`: Chrome 123, Firefox 120, Safari 17.5; Baseline since May 2024 (CITED, [caniuse](https://caniuse.com/mdn-css_types_color_light-dark), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)). Tailwind 4.3.3 targets Safari 16.4, Chrome 111 and Firefox 128 (READ, `node_modules/@tailwindcss/node/dist/index.mjs`, `optimize`). So Safari 16.4 to 17.4 is in Tailwind's range but not in `light-dark()`'s.
- **No polyfill.** Tailwind's `optimize` excludes Lightning CSS's `LightDark` lowering (READ, same file). `light-dark()` reaches the browser unchanged (EXECUTED, `compile` and `optimize` from `@tailwindcss/node` on a test sheet). In an older engine every colour token is invalid at computed-value time (INFERRED).
- **Colours only, in practice.** MDN documents a second form, two `<image>` values (CITED, MDN). `width: light-dark(10px, 20px)` is invalid in all three engines (EXECUTED).
- **It resolves where it paints.** All three engines agreed (EXECUTED, fixture with `:root { --bg: light-dark(…) }`):
  - a copy `--derived: var(--bg)` on `:root` reads dark inside a `color-scheme: dark` subtree. **The derived-variable trap is gone for unregistered properties.**
  - a light scope inside a dark scope reads light. Nesting works.
  - `color-mix()` around a `light-dark()` token resolves per scope.
  - a **registered** `<color>` property computes on its declaring element and inherits that colour. Inside the dark scope it stayed light. Tailwind registers `--tw-gradient-from`, `-via`, `-to` and `--tw-scrollbar-thumb`, `-track` this way (READ, `tailwindcss/dist/lib.mjs`). Those are set on the painting element, so they are safe (INFERRED).
  - **an inherited `color` stays the parent's.** A `<p>` inside the dark scope, with no `color` of its own, kept the light page's text colour. The scope must set `color` itself.
  - `getPropertyValue("--bg")` returns the string `light-dark(rgb(…), rgb(…))`. A canvas given that string: Chromium and WebKit reject it; Firefox paints the light value inside the dark scope.
  - `color-scheme: light dark` on a subtree follows the system.
- **`color-scheme`** inherits, and sets the canvas, scrollbars, form controls and system colours (CITED, [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)).
- **A scoped `dark:` variant.** Tailwind's documented forms are `&:where(.dark, .dark *)` and the `data-theme` twin (CITED, [Tailwind dark mode](https://tailwindcss.com/docs/dark-mode)). The `where` form underlines the light middle of a dark–light–dark nest in all three engines (EXECUTED). A style-query variant, `@container style(--scheme: dark) { @slot }` with each scope setting `--scheme`, was correct in all three (EXECUTED). But style queries are Firefox 151, Safari 18 partial (CITED, [caniuse](https://caniuse.com/css-container-queries-style)). An `@scope (…) to (…)` variant compiles to an empty or wrong rule in Tailwind 4.3.3 (EXECUTED). `if()` is not Baseline (CITED, [MDN `if()`](https://developer.mozilla.org/en-US/docs/Web/CSS/if)).
- **`prefers-contrast`** has `no-preference`, `more`, `less` and `custom`; `custom` matches a forced palette. Baseline since May 2022 (CITED, [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)). Playwright emulates `contrast: "more"` (EXECUTED).
- **`forced-colors: active`** discards author `color`, `background-color`, `border-color`, `outline-color`, SVG `fill` and `stroke`; forces `box-shadow` to none, `color-scheme` to `light dark`, `scrollbar-color` to auto. `prefers-color-scheme` follows the `Canvas` colour (CITED, [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)). So a high-contrast token set does nothing under forced colours. Forced colours need their own pass (INFERRED; Material memo idea 1).
- **WCAG targets.** 1.4.6 (AAA): 7:1 text, 4.5:1 large text (CITED, [Understanding 1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)). There is no AAA non-text criterion; 1.4.11 is 3:1. Primer uses 4.5:1 for borders in high contrast (READ, Primer memo).

## 4. What the working recommendation gets right, and where it is wrong or incomplete

- **Right:** one variable per role with `light-dark()`. The scope rule then sets only `color-scheme`, so it redeclares no token. The trap disappears for `--code-*` and `--surface-*`. Field utilities, which reset roles, keep working (INFERRED from §3).
- **Right:** no `dark:` in items. Only alert's two tints need tokens, e.g. `--destructive-tint: light-dark(<10%>, <20%>)`.
- **Right:** contrast is a second axis.
- **Incomplete: the scope must also set `color`,** and in practice `background-color`, as Carbon's zone does (EXECUTED, §3). Put that rule in `@layer base`, so a utility on the same element, such as `bg-card`, still wins (INFERRED, from the `surface-ink` lesson).
- **Incomplete: portals.** `light-dark()` does nothing for an overlay mounted under `<body>`. It still opens in the page's scheme. The fix stays the ink memo's `BitsConfig defaultPortalTo` (READ, ink memo §2.3).
- **Incomplete: ink on a dark page.** `.dark .surface-ink { --background: var(--card) }` depends on the page's scheme, not the surface's. Inside the surface the scheme is dark, so `light-dark()` cannot see the page. One answer is a registered `<color>` property declared on `:root`, which computes there and inherits as a colour (EXECUTED behaviour, §3; its use here INFERRED).
- **Incomplete: `readToken`.** It returns `light-dark(…)` for a colour, which a canvas cannot use (EXECUTED). Its documented use, the canvas mark, breaks. It needs a resolved-colour read, such as painting `color: var(--x)` on the element and reading the computed `color`. That is an interface change for the changelog (constitution §6).
- **Wrong for contrast: "the same attribute pattern on any element".** A contrast block must redeclare tokens, because `light-dark()` holds only two values. Redeclared on a subtree, the trap returns for every derived variable, as Carbon found. On `<html>` alone the copies sit on the same element and substitute correctly (INFERRED). And contrast is a reader's need, not a composition. So contrast belongs on the root only.
- **Missing: the browser floor.** Safari 16.4 to 17.4 lose every colour. The generator can write a guarded fallback, `@supports not (color: light-dark(#000, #fff))`, holding today's two hex sets (INFERRED). That costs about today's `.dark` block, and the token file stays the one source.
- **Missing: content differences.** `dark:hidden` swaps content, and no token can do that. The ban fits `src/lib/registry/`. The site can keep `dark:`, because its frames are one-scheme documents.
- **A gain it did not claim.** With `color-scheme: light dark` on `:root`, and the attribute written only for a stored choice, a page with scripts off follows the system. That closes the 2026-11-14 placeholder (INFERRED from the `system` scope result, §3).

## 5. What installed apps must change

The shadcn-svelte CLI 1.7.1 merges `cssVars` into `:root` and `.dark`. It replaces or adds declarations and never removes one. It adds `@custom-variant dark (&:is(.dark *))` only when no custom variant exists (READ, `node_modules/shadcn-svelte/dist/index.mjs`, functions `ps`, `hs`, `ms`). So for an app at v0.11.0 (INFERRED):

- **Stale dark hexes.** Re-adding `pluto-theme` leaves the old `.dark { --background: #16140f … }`. Those hexes beat `light-dark()` under `.dark` and break a light scope inside it. Fix: for one release, write the same `light-dark()` values into `cssVars.dark` as well, so the merge overwrites the stale hexes. Or ask the app to delete the block.
- **`theme` and `pluto-theme` must move together.** Under `color-scheme: light dark`, the old script removes `.dark` for an explicit "light", and the page then follows a dark system. The new script must write the light choice too.
- **The app's own `dark:`** keeps working while `<html>` still carries `.dark`. The CLI never rewrites the app's variant.
- **Markup.** `class="dark surface-ink"` keeps working if `.dark` stays an alias of the dark scope.
- **Script.** A `readToken("mark-1")` on a canvas breaks (§4).

## 6. Options

**A. The working recommendation as stated.** `light-dark()` tokens; `[data-scheme]` on any element sets `color-scheme`; no `dark:` in items; contrast on the same attribute pattern.
- *Cost:* the generator, alert, one test. *Apps must:* re-add both items and rename `dark`. *Risks:* §4's gaps; nested contrast falls into the trap; older Safari goes colourless.

**B. Option A, completed (recommended).**
- Tokens use `light-dark()`, with an `@supports not` hex fallback.
- `[data-scheme="light" | "dark"]` on any element sets `color-scheme`, `color` and `background-color`, in `@layer base`. `.dark` stays an alias for a set number of releases.
- `:root` has `color-scheme: light dark`; the head script writes the attribute only for a stored choice.
- Contrast lives only on the root: `html[data-contrast="more"]`, and `@media (prefers-contrast: more)` on `html:not([data-contrast="standard"])`. That `html` form keeps 001 decision 14's rule of no `:root` inside an at-rule. Each value is `light-dark(hcLight, hcDark)`, taken from partial override maps `themes["light-more"]` and `themes["dark-more"]` that fall back to the base roles.
- `readToken` gains a colour read. Portals use `BitsConfig`. Ink on a dark page uses a captured root property. Alert's tints become tokens.
- *Cost:* a medium generator change, a second control in `theme`, new primitives for high contrast, and contrast tables for two more sets.
- *Apps must:* re-add `pluto-theme` and `theme` together. Nothing else, during the alias window.
- *Risks:* the fallback doubles the colour bytes until the floor rises. A high-contrast scope inside a subtree is not offered.

**C. Primer-style named themes.** Four full sets, `[data-theme="light" | "dark" | "light-more" | "dark-more"]`, on any element, with no `light-dark()`.
- *Cost:* about four times the colour bytes; every derived variable re-emitted per block, Carbon's way; `dark:` and the three rules still removed. *Apps must:* the same re-adds. *Risks:* the trap stays a hazard for each new derived token. *Gain:* Safari 16.4 with no fallback.

**D. Today's model, patched, plus a forced-colours pass.** Generate a `.light` reset block, re-emit derived variables, and rewrite the three rules. No high-contrast set.
- *Cost:* low, but each light island needs the whole reset. *Apps must:* re-add `pluto-theme`. *Risks:* no `prefers-contrast`; `dark:` still leaks.

**E. Rejected: a style-query `dark:` variant or `if()` tokens.** Correct under nesting (EXECUTED), but not Baseline (§3). It may suit an app's own `dark:` later.

## 7. Recommendation, ranked

1. **B**, in two specifications. First, scoped schemes, which have a need today: 015's frames, a light card on a dark page, the ink surface. Second, high contrast, once a need is named (constitution §4.2). Do the forced-colours pass, Material memo idea 1, either with the second or before it.
2. **C**, if the owner keeps Safari 16.4 to 17.4 and refuses the fallback.
3. **D**, if neither need is pressing.

**What the first specification decides.** The attribute and its values; the `.dark` alias and its term; the scope rule's layer and declarations; the fallback; ink on a dark page; the tint tokens; the ban's scope; `readToken`'s colour read; the overlay pattern; the head script; the changelog's migration note.

**What tests would prove it.**
- Unit: every colour in `:root` is either one value or `light-dark(light, dark)`, matching the token file. No `dark:` in `src/lib/registry/`. No `.dark ` or `[data-scheme…] ` descendant rule in `pluto-theme`. The fallback equals the two hex sets.
- End to end: a matrix of page {light, dark} × scope {light, dark} × depth 3, over a fixture of every item. Each reading must equal the same item in a one-scheme frame, including `--code-*`, the mark dots and an open popover. axe counts 0.
- Scripts off, with a dark system: the page is dark.
- Smoke: a v0.11.0 app re-adds both items. No stale hex stays, and an explicit light choice on a dark system stays light.
- For contrast: emulate `contrast: "more"` and read the high-contrast values. `data-contrast="standard"` beats the media query; `"more"` works without it. Text pairs reach 7:1, and non-text pairs reach the chosen target, in both sets.

## 8. Questions for the owner

1. **Browser floor.**
   - (a) `light-dark()` with a generated hex fallback until Safari 17.5 is the floor. *Recommended.*
   - (b) Raise the floor to Safari 17.5 now, with no fallback.
   - (c) Keep full redeclaration (option C).
2. **The `.dark` class.**
   - (a) Keep it as an alias of `data-scheme="dark"` for two minor releases, then remove it with a changelog entry. *Recommended.*
   - (b) Keep `.dark` as the only name, and add `.light`.
   - (c) Remove it in this release.
3. **The need for high contrast.**
   - (a) Name the app or the reader group, then specify it after scoped schemes. *Recommended.*
   - (b) Build it now, on the accessibility constraint alone.
   - (c) Forced-colours pass only, for now.
4. **High-contrast colours.**
   - (a) New primitives in the book's hues, measured to 7:1. The owner approves the swatches. *Recommended.*
   - (b) Text roles fall back to ink or paper, so `primary` text becomes ink with an underline.
5. **Non-text target in high contrast.**
   - (a) 4.5:1, as Primer uses. *Recommended.*
   - (b) 3:1, WCAG 1.4.11's minimum.

No code was copied from prior art. Nothing in the repository was built, installed or changed, except this memo.

## 9. Corrections, 2026-11-15 (from `029`'s specification)

Added by the spec author for `029`. Sections 1 to 8 stand as written. Where this section disagrees, it wins. Probes ran in the session scratchpad on the repository's Playwright 1.64.1 (Chromium, Firefox, WebKit) and Tailwind 4.3.3. Nothing in the repository was built or changed but this section.

- **§4 "Field utilities, which reset roles, keep working" (INFERRED) is incomplete.** A scope nested inside a field inherits the field's resets. A dark scope inside a light `field-1` read text `rgb(22, 20, 15)` on `rgb(22, 20, 15)`, 1:1, in all three engines (EXECUTED). A field resets `--foreground` to `var(--field-1-foreground)`, itself a pair, which the dark scope resolves to the dark legend. The fix: the scope rule restores the seven roles a field resets from the `--surface-*` copies, as `surface-plain` does. Text then read `rgb(243, 240, 232)` (EXECUTED).
- **§5 misses the CLI's colour check.** shadcn-svelte 1.7.1 treats a `cssVars` value as a colour only if it starts with `hsl`, `rgb`, `#` or `oklch`, or contains `--color-` (READ, `node_modules/shadcn-svelte/dist/index.mjs`, function `xs`). For a `light-dark()` value it writes `--<name>: var(--<name>)` into `@theme inline`, and no `--color-<name>`, so no `bg-<name>` utility. The item must carry `color-<name>` in `cssVars.theme` itself. The self-reference is harmless: Tailwind 4.3.3 emits it in `@layer theme`, where the unlayered value wins (EXECUTED).
- **The CLI matches `:root` and `.dark` as whole selector-list items** (READ, functions `ps` and `hs`). A list item such as `:where([data-scheme="dark"], .dark)` is not written into. It accepts `@property` in an item's `css` (READ, function `ws`).
- **§3, support, updated.** `light-dark()` is expected to be widely available from 2026-11-13 (CITED, [web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/light-dark/), read 2026-11-15). `@property` is Baseline since 2024-07-09: Chrome 85, Firefox 128, Safari 16.4 (CITED, [web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/registered-custom-properties/)).
- **§4 "Ink on a dark page" works as proposed, at any depth.** A registered `<color>` property, declared on every scope but the ink surface, gave ink `rgb(22, 20, 15)` on a light page, `rgb(34, 31, 25)` in a dark scope, `rgb(22, 20, 15)` in a light scope inside that, and `rgb(34, 31, 25)` on a root following a dark system (EXECUTED).
- **§4 `readToken`: a canvas is not an exact normaliser.** `rgba(11, 15, 23, 0.1)` painted and read back is `#0a14141a` in Chromium and WebKit and `#0913131a` in Firefox (EXECUTED). The computed `color` of a probe is `rgb(…)`, `rgba(…)` or `color(srgb … / a)` for Kuiper's values, in all three engines, and a `display: none` probe inside a canvas computes its scope's colour (EXECUTED). So a resolved read parses the computed text.
- **§6 B's fallback, emulated.** With every `light-dark(` renamed in the served CSS, an `@supports not (color: light-dark(#000, #fff))` block of hex sets reproduced every nested reading in all three engines (EXECUTED). The mode's marks need per-scope private copies there: a descendant rule cannot find the nearest scope, and would paint the light blue on a dark ground inside a light-in-dark nest (INFERRED, about 2.6:1).
