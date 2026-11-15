# Prior art: Material 3, through Material Web

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request
- **Question:** What can Pluto learn from Material Web's token tiers, theming, component states, docs and tests? What should it leave alone?
- **What it blocks:** nothing. It feeds later specifications. It commits us to nothing.

## How to read this memo

Every claim carries a label.

- **READ:** a file says so. Material paths are inside the clone `context/prior_art/material-components-material-web/` (Apache-2.0, commit `37aa14b`, 2026-11-10), written here as `mw/…`. Pluto paths are from the repository root. All read on 2026-11-15.
- **INFERRED:** our reasoning from what we read.

[`2026-11-01-how-systems-separate-brand-modes-and-products.md`](./2026-11-01-how-systems-separate-brand-modes-and-products.md) §1 covers Material at a high level. This memo reads the web code.

Terms. A *custom property* is a CSS variable (`--name`). A *state layer* is a see-through overlay of the content colour that marks hover, focus or press. A *ripple* is the animated circle a press draws on that layer. *Forced colours* is the operating-system mode, such as Windows High Contrast, where the browser swaps every colour for a short system palette. A *harness* is a test helper that drives one component the way a user would.

## Summary

- **Material has three token tiers, and its third tier is large.** About 50 component token files; the filled button alone has 42 tokens. Pluto's two tiers plus a few mode slots fit a system whose apps own their source better.
- **Material handles forced colours everywhere. Pluto handles it once.** 35 of Material's stylesheets have a `forced-colors` rule; Pluto's one is for glass. Pluto marks checked and disabled with fills and opacity, which that mode repaints or weakens. This is the best value for cost here.
- **Material tests that every token a stylesheet reads is defined and used.** 39 test files use one helper. Pluto's lint catches literals, not a `var(--…)` that names nothing. Cheap to close.
- **Material's docs give each component a theming table: the tokens it reads.** Pluto builds its API table from source; the same could build a "Tokens it reads" section.
- **Avoid the state layer, the ripple, runtime seed colour and the shadow-DOM plumbing.** Each breaks a recorded Pluto rule (no tints on insets; no product accent) or solves a shadow-DOM problem Pluto lacks. Material Web is also "in maintenance mode".

## 1. Token tiers

### What Material does

- **Three tiers in Sass, exposed as custom properties.** Reference tokens are raw tonal steps such as `neutral90` and `error40` (READ, `mw/tokens/_md-ref-palette.scss`). System tokens are roles such as `primary`, `on-primary`, `surface-container-high` (READ, `mw/tokens/_md-sys-color.scss`). Component tokens point at system tokens: the filled button's `container-color` is the system `primary` (READ, `mw/tokens/versions/v0_192/_md-comp-filled-button.scss`).
- **The tiers are generated, then curated.** Files under `versions/` are generated from Material 3 `v0.192`. A hand-written wrapper per component allow-lists, removes, renames and adds tokens (READ, `mw/tokens/_md-comp-filled-button.scss`; `mw/tokens/internal/_validate.scss`). The versions folder "may introduce breaking changes at any point across minor and patch updates" (READ, `mw/tokens/versions/README.md`).
- **The fallback chain.** Each component token becomes a public property that falls back to the system property, which falls back to a literal value (READ, `mw/tokens/_md-comp-filled-button.scss` and `mw/tokens/_md-sys-color.scss`, the loops that wrap values in `var()`). Inside the component, `:host` copies each public property into a private one prefixed `--_`. The styles read only the private one (READ, `mw/button/internal/_filled-button.scss`, `mw/button/internal/_shared.scss`). INFERRED: the public surface stays narrow, and internal rules can change freely.
- **Naming grammar.** `--md-{component}-{state?}-{part}-{property}`, for example the hover label text colour of the filled button. The Sass name keeps `comp`; the CSS name drops it (READ, `mw/tokens/_md-comp-filled-button.scss`). Content colours pair with grounds by an `on-` prefix (READ, `mw/docs/theming/color.md`).
- **The labs direction drops shadow DOM.** `labs/gb` (2026) styles plain elements with classes in cascade layers, and state rules swap local properties (READ, `mw/labs/gb/components/button/button.scss`). Labs is "not recommended for production" (READ, `mw/labs/README.md`).

### Pluto's state

- Two tiers. `primitives` hold hexes. `themes.light` and `themes.dark` map shadcn role names onto them. Content pairs with ground by a `-foreground` suffix (READ, `tokens/pluto.tokens.json`).
- There is no per-component tier. A few mode-level slots act like one: `--radius-action`, `--size-action`, `--press-scale`. Expressive mode resets them (READ, `src/app.css`; `src/lib/registry/ui/button/button.svelte`, which reads `--radius-action` with `--radius` as fallback).
- INFERRED: Pluto's slots already play the role of Material's component tokens where a mode needs to move a value. An app that wants anything else edits its own copy of the source.

## 2. Theming

### What Material does

- **Colour roles from a tonal palette.** 49 system colour roles, including six surface-container steps, plus `inverse-*`, `*-fixed` and `scrim` (READ, `mw/tokens/_md-sys-color.scss`, the supported list). The latest token set also ships medium-contrast and high-contrast schemes, for both light and dark (READ, `mw/tokens/versions/latest/sass/_md-sys-color__high-contrast.scss`, `…__dark__high-contrast.scss`, `…__medium-contrast.scss`).
- **Dynamic colour.** The catalog, an Eleventy site, builds every role from one source colour with `material-color-utilities` and writes them onto the document. Sliders pick hue, chroma and tone (READ, `mw/catalog/src/utils/material-color-helpers.ts`, `mw/catalog/src/components/hct-slider.ts`).
- **How a theme is applied.** Set system properties on `:root`, or component properties on any selector. Palette and motion tokens are not settable (READ, `mw/docs/theming/README.md`).
- **Typescale and shape.** 15 typescale roles, each a bundle of font, size, line height, weight and tracking (READ, `mw/docs/theming/typography.md`). The labs Tailwind file turns each bundle into one utility, `typescale-<role>`, and resets Tailwind's default colours, fonts and text sizes to `initial` so only Material's remain (READ, `mw/labs/gb/styles/tailwind.scss`). Shape is a corner ladder from none (0) up to full (9999 px) (READ, `mw/tokens/versions/v0_192/_md-sys-shape.scss`).

### Pluto's state

- 61 roles per theme, with fixed brand values. The tests prove contrast pair by pair (READ, `tests/unit/tokens.test.ts`, "both themes name the same 61 tokens"; `tests/unit/contrast.test.ts`).
- No high-contrast scheme. `prefers-contrast` appears nowhere in `src/app.css`, `scripts/` or `tokens/` (READ, grep).
- No product accent colour, by the owner's ruling: "identity only" (READ, `context/specifications/008-product-identity.md`, Intent and "Not here").
- One radius, 8 px (READ, `tokens/pluto.tokens.json`, `radius.case`). Expressive display steps are already bundled utilities, such as `type-poster` (READ, `scripts/lint-literals.ts`, L22's list). INFERRED: Pluto already does what Material's typescale utility does.
- Pluto keeps Tailwind's default palette available and lints it out of item files rather than resetting it (READ, `tests/unit/literals.test.ts`, "reads the palette from tailwindcss/theme.css").

## 3. Components

### What Material does

- **States as tokens.** Each component has hover, focus, pressed and disabled tokens (READ, `mw/tokens/_md-comp-filled-button.scss`). State-layer opacity is 0.08 for hover and 0.12 for focus and press (READ, `mw/tokens/versions/v0_192/_md-sys-state.scss`).
- **State layer and ripple.** A hover overlay and a radial press gradient from the pointer, driven by a scripted state machine; hidden under forced colours (READ, `mw/ripple/internal/_ripple.scss`, `ripple.ts`).
- **Disabled and soft-disabled.** Disabled uses its own colour tokens and an opacity. Under forced colours it switches to the system colour `GrayText` at full opacity (READ, `mw/button/internal/_shared.scss`). *Soft-disabled* keeps a button focusable, sets `aria-disabled` and swallows clicks. The docs point to the ARIA guidance on focusable disabled controls in toolbars (READ, `mw/button/internal/button.ts`; `mw/docs/components/button.md`, "Focusable and disabled").
- **Focus ring.** A separate element, tied to its control by `for`. It shows on `focusin` only when the control matches `:focus-visible`, and hides on pointer-down (READ, `mw/focus/internal/focus-ring.ts`). It draws outward by 2 px, or inward for controls whose container would clip it. It animates from 8 px down to 3 px, and the animation stops under reduced motion (READ, `mw/focus/internal/_focus-ring.scss`; `mw/tokens/_md-comp-focus-ring.scss`).
- **Elevation.** One number from 0 to 5 drives two shadows by `clamp()` arithmetic (READ, `mw/elevation/internal/_elevation.scss`). Pluto's product screens are flat, so this has no use here (READ, `decisions.md`, "I5 with I9").
- **Motion tokens.** 16 durations (`short1` to `extra-long4`) and 10 easings (READ, `mw/tokens/versions/v0_192/_md-sys-motion.scss`).
- **Forced colours.** 35 component stylesheets have a `forced-colors` rule. One example: a checked checkbox's fill becomes `CanvasText`, and a disabled one becomes `GrayText` (READ, grep; `mw/checkbox/internal/_checkbox.scss`).
- **Form association.** Shadow-DOM controls join forms through mixins for `ElementInternals`, form association, submission and constraint validation. ARIA set on the host is passed through to the inner control (READ, `mw/button/internal/button.ts`; `mw/labs/behaviors/`). To match native validation, validators build a throwaway native `<input>` and copy its result (READ, `mw/labs/behaviors/validators/checkbox-validator.ts`).

### Pluto's state

- **States** are opaque steps, not overlays. Hover moves a border to `foreground` or fills `accent`. Pressed shifts down 1 px (expressive mode scales instead). Disabled is `opacity-50` (READ, `src/lib/registry/ui/button/button.svelte`; `src/app.css`, `--press-scale`). `busy` already behaves like soft-disabled: the button stays focusable and ignores clicks (READ, `button.svelte`).
- **No translucent tints on insets.** The `muted` rule bans state tints on `muted` and `accent` (READ, `context/specifications/001-tokens-and-the-registry.md`, decision 8). Line emphasis is "never a tint" (READ, `context/decisions.md`, the `004` design calls).
- **Focus** is one rule: a 2 px solid outline in `ring`, offset 2 px, on `:focus-visible` (READ, `001` decision 13; `src/app.css`, `@utility focus-ring`). Tests check that the ring is not clipped (READ, `tests/e2e/keyboard.spec.ts`).
- **Forced colours** has one rule, for `.glass` (READ, `src/app.css`, the `forced-colors` media query). The checkbox's checked state is `bg-primary`, and its disabled state is `opacity-50` (READ, `src/lib/registry/ui/checkbox/checkbox.svelte`). INFERRED: under forced colours the browser replaces that fill with a system colour, and the 50% opacity still fades the system colours. Checked then rests on the check icon alone, and disabled is a faded control rather than the system's `GrayText` signal.
- **Motion** tokens are named by purpose: press, slide, busy, reveal, fill. Reduced motion sets them all to 0 ms (READ, `scripts/build-tokens.ts`, `themeCss`).
- **Forms.** Components are native elements or bits-ui parts in the light DOM, so forms work natively (READ, `button.svelte`; INFERRED).

## 4. Docs

### What Material does

- **One Markdown file per component, read by three renderers.** Marker comments (`catalog-only-start`, `no-catalog-start`, `external-only-start`) choose what GitHub, the internal site and the public catalog each show. Each page has a freshness record with an owner and a review date (READ, `mw/docs/components/button.md`).
- **Sections:** hero, interactive demo, types, usage, accessibility, each variant, theming, API (READ, same file).
- **Theming tables.** Each variant lists its main component tokens and their default system tokens, then links to the full token file (READ, same file, "Elevated button tokens").
- **Generated API tables.** A Lit analyzer reads each element's properties and writes the tables into the Markdown, between markers that stop the formatter (READ, `mw/scripts/analyzer/update-docs.ts`; the `mdformat off` comments in `button.md`).

### Pluto's state

- One renderer, the design site. Sections: Examples, Usage, API, Accessibility, Files you own, Related (READ, `src/lib/site/page/component.svelte`). The API is read from source, since "a hand-written table would drift" (READ, `src/lib/site/api.server.ts`).
- No page says which tokens a component reads (READ, `src/lib/site/component-data.server.ts`, `ComponentData` has no such field).

## 5. Testing

### What Material does

- **Runner.** web-test-runner with Jasmine, in Playwright's Chromium. Firefox and WebKit are commented out (READ, `mw/web-test-runner.config.js`).
- **Harnesses.** A base `Harness` simulates mouse, keyboard, touch, hover and focus on a component's inner control; each component subclass finds that control (READ, `mw/testing/harness.ts`, `mw/button/harness.ts`).
- **States without a user.** A transform rewrites `:hover` and 12 other pseudo-classes into classes, so a state renders without a user (READ, `mw/testing/transform-pseudo-classes.ts`). A template builder renders each variant in eight shared states, Default to Soft disabled (READ, `mw/testing/templates.ts`).
- **Token tests.** One helper fails when a stylesheet reads a private property that nothing defines, or defines one that nothing reads (READ, `mw/testing/tokens.ts`). 39 test files call it (READ, grep).

### Pluto's state

- Playwright end-to-end tests on real pages, in light and dark Chromium projects (READ, `playwright.config.ts`). Also axe, contrast arithmetic, a literals lint, and smoke tests that run the real `add` command (READ, `tests/`; `001` decision 25).
- No test checks that every `var(--…)` in an item names a defined variable (READ, `tests/unit/tokens.test.ts` and `scripts/lint-literals.ts` hold no such rule).
- No test walks each variant through hover, pressed and focus to measure its colours. Hover appears only in passing (READ, grep of `tests/e2e`).

## Ideas for Pluto, ranked by value over cost

1. **A forced-colours pass over every interactive item.** *Adapt.* Give each stateful control a forced-colours rule that uses system colours: `GrayText` for disabled, `CanvasText` or `Highlight` for checked and selected fills, and a `CanvasText` border where a fill marked the edge. *Why:* constitution §4.4 promises accessible by default, and that mode repaints fills and leaves opacity fading system colours (INFERRED, §3). *Touches:* a new specification; `src/lib/registry/ui/{button,checkbox,switch,radio-group,toggle,toggle-group,tabs}`; perhaps a shared rule in `scripts/build-tokens.ts`; a Playwright check with `forcedColors: "active"` in `tests/e2e/`.
2. **An undefined-variable test.** *Adapt.* Every `var(--x)` in a registry item file must name a variable that `pluto-theme` defines or that the same file sets. *Why:* a misspelled slot with a fallback fails silently (INFERRED). One more parse in an existing test. *Touches:* `tests/unit/literals.test.ts` or a sibling, and `scripts/lint-literals.ts`.
3. **A "Tokens it reads" section on each component page.** *Adapt.* At build time, list the roles and slots an item's class strings and `var()` calls use, the way `api.server.ts` lists props. *Why:* Material's theming tables, without a component tier; it shows what a token change moves. *Touches:* `src/lib/site/component-data.server.ts`, `src/lib/site/page/component.svelte` (`SECTIONS`), and a site specification after `017`.
4. **A states matrix test.** *Adapt.* For each variant, in both themes, drive rest, hover, focus-visible, pressed, disabled, busy and invalid with Playwright. Measure each state's text and boundary contrast against its ground. *Why:* Pluto proves token pairs, not what a hovered or pressed control paints. Material's state list is the checklist. *Touches:* `tests/e2e/`, `tests/helpers/colour.ts`, perhaps `contrast` in `tokens/pluto.tokens.json`.
5. **A focusable-disabled option, when a need appears.** *Adapt.* Generalise what `busy` already does into an opt-in for controls in toolbars and menus. *Why:* the ARIA guidance Material cites favours focusable disabled items in toolbars. Constitution §4.2 says add it only when an app needs it. *Touches:* `button.svelte`, `toggle`, and the Button page's Accessibility notes.
6. **A high-contrast scheme under `prefers-contrast: more`.** *Adapt the idea, not the generator.* Strengthen `border`, `input`, `muted-foreground` and `groove-line` in each theme. *Why:* Material ships medium and high contrast for both themes. Pluto's hairlines sit at 10% alpha (READ, `tokens/pluto.tokens.json`, `line`). *Cost:* new theme rows, a larger contrast table, and the `html:root` rule for nested media queries (`001` decision 14). This is the owner's call. Options: (a) one high-contrast override of a few roles, recommended; (b) full high-contrast light and dark themes; (c) no change.
7. **An inward focus ring, when a clipped row needs one.** *Adapt, later.* Material draws it inside the box for lists and tabs. Pluto's "ring unclipped" tests will show where. *Touches:* `src/app.css` utilities, `scripts/build-tokens.ts`.

## Things to avoid

- **A component-token tier for every item.** Material's tier is generated by a pipeline we don't have, and its own folder warns of breaking changes in patch releases (READ, `mw/tokens/versions/README.md`). In Pluto an app owns its source and changes a class instead (constitution §3). Pluto's few mode slots are enough (INFERRED).
- **Translucent state layers and the ripple.** They break the `muted` rule and the "never a tint" calls (READ, `001` decision 8; `decisions.md`). The ripple also brings a scripted state machine (READ, `mw/ripple/internal/ripple.ts`).
- **Runtime seed colour.** The owner ruled out per-product colour (READ, `008`). Pluto's contrast is proven pair by pair, not left to a generator (INFERRED).
- **The animated focus ring and numbered motion ladders.** The ring's animation runs about 600 ms (READ, `mw/tokens/_md-comp-focus-ring.scss`), three times Pluto's 200 ms micro-motion budget (READ, `001` decision 14). Names like `short1` say nothing about use; Pluto's purpose names do (INFERRED).
- **Shadow-DOM plumbing.** ARIA delegation, form mixins and throwaway validators exist because Material's controls live in shadow roots (READ, `mw/button/internal/button.ts`). Pluto needs none of it (INFERRED).
- **Resetting Tailwind's palette app-wide.** The labs file sets `--color-*` to `initial` (READ, `mw/labs/gb/styles/tailwind.scss`). In Pluto, `pluto-theme`'s CSS lands in the app's own stylesheet, so the reset would break the app's own code. The item-file lint is the right scope (INFERRED).
- **Treating Material Web as a live model.** Its README says it is "in maintenance mode pending new maintainers" (READ, `mw/README.md`). Its newer direction is in labs and is not for production (READ, `mw/labs/README.md`).

## What this memo did not do

It ran, built and installed nothing. The forced-colours effect on Pluto is inferred, not seen; idea 1's specification would check it first. No code was copied.
