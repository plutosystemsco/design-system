# How systems separate brand, modes and products

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead's researcher
- **Question:** How do mature design systems separate foundations, brand, modes (productive and expressive) and product themes? How do they do it in tokens, type, motion, light and elevation, layout and enforcement? What should Pluto's layers look like?
- **What it blocks:** specification `009` (expressive mode) and the identity option boards.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result. This memo has no such claim; it is a study.
- **READ:** a source says so. Each web source was read on 2026-11-01 and is linked. Local sources are this repository's files at `v0.8.0`, cited by path.
- **INFERRED:** our reasoning.

The owner changed the brief today. The only design constraint is "we need to compete with Google". The design book's laws and ban list no longer bind. They are prior art to weigh. The constitution's engineering rules still hold: tokens are the one source, WCAG 2.2 AA, full keyboard use, reduced motion, source not package (READ, the owner, via the coordinator, 2026-11-01).

Terms of art.

- **Token tier:** one layer of a token hierarchy. A lower tier holds raw values. A higher tier gives them a role.
- **Reference token:** a raw value with no role, such as a hex colour. Also called a *global* or *primitive* token.
- **System token:** a role, such as "primary" or "surface", that points at a reference token. Also called an *alias* or *semantic* token.
- **Component token:** a value one component reads, such as a button's fill, that points at a system token.
- **Mode:** a set of rules for how loud a region may be, over one set of tokens. *Productive* is for tasks. *Expressive* is for persuading and storytelling.
- **Theme:** a set of values for the same token names, such as light and dark.
- **Inline theme:** a theme applied to one region of a page, not the whole page.
- **Brand ramp:** a fixed number of shades of one brand colour, from darkest to lightest, that the system maps onto its roles.
- **Spring:** motion defined by stiffness and damping, not by a duration and a curve. *Damping ratio* 1.0 settles with no overshoot. Below 1.0 it overshoots and settles.
- **Fluid type:** a size that grows with the viewport between a minimum and a maximum, in CSS with `clamp()`.
- **Lint profile:** the set of lint rules, and their allowances, that applies to one kind of file.

## In short

- **One token hierarchy; values move, names stay** (READ, §1–§3). Material has three tiers, Fluent two. Carbon: "tokens are universal and never change across themes".
- **Brand enters at the bottom tier** (READ, §1, §3). Fluent's colour layer is one function of a 16-step brand ramp, `generateColorTokens(brand)`. Material derives every role from a seed.
- **Expressive is additive, on the same tiers** (READ, §1, §2). Material 3 Expressive adds 15 emphasized type styles and an `expressive()` spring scheme. Carbon has expressive type up to 92 px and expressive easing curves.
- **Mode is regional, not per product** (READ, §2). Carbon mixes the sets as "moments" in both directions.
- **A parallel visual language did not last** (READ, §5). Spectrum's "Express" sub-theme is deprecated.
- **Brand assets need a tamer in-product form** (READ, §5). Atlassian's brand shapes "overpowered the rest of the UI".
- **Enforcement is graded by context, not by mode** (READ, §6). Carbon's lint has strict, recommended and light-touch presets. The 2025.10 Resolver module models theme and brand as *modifiers*.
- **For Pluto** (INFERRED, §7): one token file, five layers; mode scoped by `data-mode` on a section; one lint with a profile per registry item; product themes as a brand ramp plus asset slots, contrast-checked in every combination.

## 1. Material 3 and Material 3 Expressive

### 1.1 Tiers

- Material Web exposes three tiers as CSS custom properties. Reference tokens (`--md-ref-*`) hold values such as a "hex color, pixel size, or font family name". System tokens (`--md-sys-*`) hold roles for colour, type, shape and motion, such as `--md-sys-color-primary`. Component tokens, such as `--md-filled-button-container-color`, point at system tokens (READ, [Material Web theming](https://github.com/material-components/material-web/blob/main/docs/theming/README.md)).
- Material Web "is in maintenance mode pending new maintainers" (READ, [material-web README](https://github.com/material-components/material-web)). INFERRED: Expressive has no official web build; we studied the Compose source.

### 1.2 Colour

- Material's colour library defines HCT, "a new color space (hue, chrome, tone) based on CAM16 x L\*". Schemes are made "from a single color or a core palette" (READ, [material-color-utilities](https://github.com/material-foundation/material-color-utilities)).
- INFERRED: brand enters as one seed. Roles are computed, so contrast is a property of the generator, not of each pairing a designer picks.

### 1.3 Type

- Compose's `Typography` holds 15 baseline styles (display, headline, title, body, label; each large, medium, small). Each has an emphasized twin, such as `displayLargeEmphasized`. "The emphasized versions of the baseline styles add dynamism and personality." They have "pragmatic uses, such as creating clearer division of content" (READ, [Typography.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Typography.kt)).
- INFERRED: expressive type is a parallel set of named styles, not a different scale. A component picks a role; the mode picks which twin.

### 1.4 Shape

- `MaterialShapes` holds 35 normalized polygons (Circle, Pill, Cookie9Sided, Burst, Clover4Leaf, Heart and more) "that can be used at various components as they are, or as part of a Morph" (READ, [MaterialShapes.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt)).
- INFERRED: shape became a brand asset with a closed list. Morphing is allowed only between members of that list.

### 1.5 Motion

- "The standard scheme is Material's basic motion scheme for utilitarian UI elements and recurring interactions." "The expressive scheme is Material's recommended motion scheme for prominent UI elements and hero interactions" (READ, [MotionScheme.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MotionScheme.kt)).
- Each scheme has six springs. *Spatial* springs are for motion that "may change the shape or bounds of the component". *Effects* springs are for motion that does "not change the shape or bounds", such as colour and opacity. Each comes in fast, default and slow (READ, same source).
- The values (READ, [StandardMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt), [ExpressiveMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)):

| Spring | Standard (stiffness / damping) | Expressive |
|---|---|---|
| Fast spatial | 1400 / 0.9 | 800 / 0.6 |
| Default spatial | 700 / 0.9 | 380 / 0.8 |
| Slow spatial | 300 / 0.9 | 200 / 0.8 |
| Effects (fast, default, slow) | 3800, 1600, 800 / 1.0 | identical |

- INFERRED: the two schemes differ only in spatial springs. Colour and opacity never bounce in either. Expressive is softer and bouncier, not longer everywhere.

### 1.6 The research, and its limits

- Google calls Material 3 Expressive its most researched update: 46 studies, over 18,000 participants. Key elements were spotted "up to four times faster". It also warns expressive design is "not a one-size-fits-all solution", that removing text labels hurt usability, and that "no amount of expressive design will beat basic functionality" (READ, [Google Design, expressive research](https://design.google/library/expressive-material-design-google-research)).

## 2. IBM Carbon

### 2.1 Two type sets

- Productive styles end in `-01` on a 14 px base. Expressive styles end in `-02` on a 16 px base. Productive headings are fixed. Expressive adds `fluid-heading-03` to `-06` and `fluid-display-01` to `-04`. `fluid-display-04` is 92 px with a 102 px line height. The largest productive heading, `heading-07`, is 54 px. "Fluid display styles should never go inside a container" (READ, [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)).
- The sets mix as "moments": IBM.com uses productive type in its search and filters; products use expressive type on home pages and headers not "restricted to a container, card, or data table". Within one region, keep one set, or it may "jumble the hierarchy" (READ, [Carbon style strategies](https://carbondesignsystem.com/elements/typography/style-strategies/)).
- INFERRED: Carbon's 92 px ceiling matches the product site lab's 92 px headline. A mature system already ships that size, gated by context.

### 2.2 Two motion styles

- Productive motion gives "efficiency and responsiveness". Expressive motion is "enthusiastic, vibrant, and highly visible", for opening a page or a primary action, and to be used sparingly (READ, [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/)).
- Each of three curves (standard, entrance, exit) has a productive and an expressive form. Productive standard is `cubic-bezier(0.2, 0, 0.38, 0.9)`; expressive standard is `cubic-bezier(0.4, 0.14, 0.3, 1)`. Durations are one shared list: 70, 110, 150, 240, 400 and 700 ms (READ, same source).
- INFERRED: the mode changes the curve. The duration follows the size of the change, in both modes.

### 2.3 Themes, inline themes and layers

- Four themes: White, Gray 10, Gray 90, Gray 100. "Tokens are universal and never change across themes." "Roles cannot be changed between themes." Changing token values "will result in a new theme" (READ, [Carbon themes](https://carbondesignsystem.com/elements/themes/overview/)).
- "Inline theming is used when a section of a UI needs to be a different theme from the rest of the page", "only … for major shifts in color, like high contrast moments", by wrapping the section in a Theme component. (READ, [Carbon colour usage](https://carbondesignsystem.com/elements/color/usage/)).
- INFERRED: Pluto's `surface-ink` is already an inline theme. A stage is a second one, darker still.

### 2.4 One grid, two sites

- The 2x Grid builds every column, margin and padding from an 8 px "mini unit". It has 4, 8 and 16 columns at 320, 672, 1056, 1312 and 1584 px (READ, [Carbon 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)).
- Carbon for IBM.com is "built with foundations from IBM Design Language and Carbon Design System". It uses Carbon's elements and core components as "the basis", and adds sections such as Lead space, CTA block and Feature section, plus "Expressive styling" guidance (READ, [Carbon for IBM.com](https://www.ibm.com/standards/carbon/)).
- INFERRED: the marketing layer is a composition layer on the same foundations. It is not a fork. That is the shape the product site memo's "compositions" layer describes.

## 3. Fluent 2

- Fluent has two tiers. "Global tokens are context-agnostic and store raw values." "Alias tokens … add semantic meaning to the stored values." Tokens support "light, dark, high-contrast, and branded elements" (READ, [Fluent 2 design tokens](https://fluent2.microsoft.design/design-tokens)).
- `BrandVariants` is a record of 16 shades, keyed 10 to 160. The library ships four ramps: `brandWeb`, `brandTeams`, `brandOffice` and `brandTeamsV21` (READ, [brandColors.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/brandColors.ts)).
- Every brand-coloured alias is a slot in that ramp. `colorBrandBackground: brand[80]`, its hover `brand[70]`, pressed `brand[40]`. The light colour layer is one function: `generateColorTokens = (brand: BrandVariants): ColorTokens` (READ, [lightColor.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/alias/lightColor.ts)).
- "Color is key to the immediate brand recognition of our suite of products." "Avoid overusing brand colors or using them on large surfaces." The page shows product colours only as images (READ, [Fluent 2 colour](https://fluent2.microsoft.design/color)).
- INFERRED: this is how Word blue, Excel green and PowerPoint orange can share one system. A product supplies a ramp. Roles, components and contrast logic do not change. We could not read per-app ramps in source, so this is the mechanism, not Microsoft's confirmed practice.
- Elevation: shadows 2, 4, 8, 16, 28 and 64 px blur, each a key shadow plus an ambient one. On coloured surfaces, "brand shadow" opacity is computed from luminosity, such as `Round(42 − 0.116 × luminosity)`. Dark mode raises key-shadow opacity from 14% to 28% (READ, [Fluent 2 elevation](https://fluent2.microsoft.design/elevation)).
- Motion: eight durations, 50 to 500 ms, and nine curves (READ, [durations.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/durations.ts), [curves.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/curves.ts)). No expressive scheme is named (READ, [Fluent 2 motion](https://fluent2.microsoft.design/motion)).

## 4. Vercel Geist

- One heading scale, `text-heading-72` down to `text-heading-14`, "to introduce pages or sections". Copy styles 24 and 20 are "for hero areas on marketing pages"; 18 is "mainly for marketing, big quotes"; 14 is "the most commonly used" (READ, [Geist typography](https://vercel.com/geist/typography)).
- Ten colour scales of ten steps. Steps 100–300 are backgrounds, 400–600 borders, 700–800 high-contrast fills, 900–1000 text. P3 colours are used where supported (READ, [Geist colours](https://vercel.com/geist/colors)).
- INFERRED: Geist has no declared mode. Marketing reach comes from the top of one long scale and a few marketing-only copy styles. That is the lightest way to separate the two; it relies on discipline, not lint.

## 5. Atlassian, Spectrum, Apple and Polaris

- **Atlassian.** Themes include light, dark and high contrast, and non-colour themes: density, reduced motion and custom type (READ, [Atlassian design tokens](https://atlassian.design/foundations/tokens/design-tokens)). The 2024 visual system appeared at Team '24 and began "translating into our products" (READ, [Atlassian, our journey](https://www.atlassian.com/blog/company-news/our-journey-to-a-reimagined-visual-system), 29 July 2024). The brand's geometric shapes were "striking in marketing" but "overpowered the rest of the UI"; the team made lighter, outlined "product expressions of the same icons" (READ, [Atlassian icon system](https://www.atlassian.com/blog/how-we-build/behind-the-screens-building-atlassians-new-icon-system), 9 September 2025).
- **Spectrum.** Spectrum CSS has contexts `.spectrum` (Spectrum 2), `.spectrum--legacy` and `.spectrum--express`. Express is "a variant of the standard visual language", marked deprecated: "This visual language will be deprecated in Spectrum 2". (READ, [Spectrum CSS README](https://raw.githubusercontent.com/adobe/spectrum-css/main/README.md)).
- **Apple.** Liquid Glass "reflects and refracts its surroundings". Controls are made of it and form a separate functional layer above apps, bringing "greater focus to content" (READ, [Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/), 9 June 2025). We could not read the HIG materials page; it renders client-side.
- **Polaris.** `stylelint-polaris` is "Collection of Stylelint configs and rules that promote Polaris Design System adoption and coverage" (READ, [stylelint-polaris README](https://raw.githubusercontent.com/Shopify/polaris/main/stylelint-polaris/README.md)). We did not find a documented marketing and admin split.
- INFERRED: Spectrum is the warning. An expressive *product* sub-theme, with its own visual language, was folded back. Expressive *regions* over one language (Carbon, Material) have lasted.

## 6. Enforcement

- **Atlassian.** `ensure-design-token-usage` flags hard-coded colours, legacy theme imports and hard-coded spacing. Its `domains` option chooses `color`, `spacing` or `shape`. An `exceptions` list eases migration (READ, [ensure-design-token-usage](https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage/usage)).
- **Carbon.** `stylelint-plugin-carbon-tokens` has `theme-use`, `layout-use`, `type-use`, `motion-duration-use` and `motion-easing-use`. Presets grade them: *strict* and *recommended* error; *light-touch* warns. `acceptValues` lists values that pass (READ, [plugin README](https://raw.githubusercontent.com/carbon-design-system/stylelint-plugin-carbon-tokens/main/README.md)).
- **Design Tokens Format Module 2025.10.** Dated 28 October 2025 and "considered stable"; a Community Group report, not a W3C Standard. Types include `color`, `dimension`, `duration`, `cubicBezier`, `shadow`, `gradient`, `transition` and `typography`. Aliases are `{group.token}`. Groups can `$extends` another group (READ, [DTCG format 2025.10](https://www.designtokens.org/tr/2025.10/format/)).
- **Resolver Module 2025.10.** It "describes a method to work with design tokens in multiple contexts". *Sets* merge in order. *Modifiers* hold named *contexts*, such as a `theme` modifier with `light`, `dark` and high-contrast contexts, or a brand modifier with `brandA` and `brandB`. If two modifiers set one token, array order decides, which the spec calls "non-orthogonal" (READ, [DTCG resolver 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)).
- INFERRED: the industry grades enforcement by *where* code lives (Carbon's presets, Atlassian's domains). No system we read lints by *mode*. That would be Pluto's own step.

## 7. For Pluto (INFERRED)

### 7.1 Five layers in one token file

`tokens/pluto.tokens.json` already has `primitives` and `themes.light/dark` (READ, `tokens/pluto.tokens.json`). The layers map onto it.

1. **Foundations.** Spacing ladder, grid, radius, focus, breakpoints, contrast rules, reduced motion. Shared and strict. Mostly today's groups.
2. **Brand.** Pluto's reference values: the primitives, the typefaces, the mark colours, a brand ramp, shape set, motion signature. A new `brand` group holds the ramp and names the assets. Today's primitives move under it, with their names kept.
3. **Modes.** A `modes` group with `productive` and `expressive` contexts. Each defines the same role names: `type.display`, `type.section`, `motion.spatial.default`, `light.rim`, `radius.action`. Productive values equal today's, so no installed screen changes. Expressive adds the lab's needs (fluid display to 92 px, section to 56 px, proof numbers to 96 px, bloom, rim, energized glow, pill radius, 600 and 900 ms).
4. **Compositions.** Registry blocks: hero, stage section, proof band, live console, name strip, call-to-action band, marketing footer. They hold no values, only roles.
5. **Product themes.** A `products` group. Each product supplies a ramp and asset slots (§7.4).

This mirrors the Resolver module: brand and theme as modifiers, mode as a third modifier (READ, §6). The build should emit the DTCG shape as well as CSS, so tools can read it. It need not adopt the resolver file format yet.

### 7.2 How to scope a mode

Three options.

- **A `data-mode="expressive"` attribute on a section.** Recommended. It sets the mode's custom properties for that subtree. A Tailwind custom variant, written like today's `dark` variant (`@custom-variant dark (&:is(.dark *))`, READ, `src/app.css`), lets a class respond to the mode. `data-mode="productive"` inside it resets, so the live console inside a stage stays productive.
- **A class, like `.dark`.** Works the same. But a class reads as styling; an attribute reads as state a component can query. Classes also invite ad hoc overrides.
- **A separate token file per mode.** Rejected. It splits the one source, and a page needs both modes at once.

Surface and mode are separate axes. `surface-ink` and a new `surface-stage` choose the ground. `data-mode` chooses the volume. A stage is nearly always expressive, but a productive console can sit on it.

### 7.3 Lint profiles

Keep one lint, `scripts/lint-literals.ts`. Add profiles.

- **Universal rules stay universal.** Literal colours, lengths, durations, `<style>` blocks, off-ladder spacing, palette classes. These are what "tokens are the one source" means. They bind every profile.
- **Volume rules move into profiles.** L1 (tints), L5 (shadows), L6 (backdrops), L8 (type cap), L10 (animations), L11 (`rounded-full`) become profile rules. The *productive* profile keeps today's settings. The *expressive* profile allows the named expressive utilities, still only from tokens.
- **The profile is declared per registry item.** Today the lint reads files from `registry.json` and allowlists by file name (READ, `scripts/lint-literals.ts`). A per-item field, such as `meta.modes: ["productive"]`, would choose the profile. Whether shadcn-svelte's item schema accepts `meta` must be checked. A directory convention is the fallback.
- **New rules.** An expressive class in a productive-only item fails. A mark colour outside the brand items fails (L19 already does this for syntax colours). A typeface not in `type.families` fails. A component states which modes it supports, and a test renders it in each.
- **Exceptions are counted.** Carbon grades by preset and Polaris measures coverage (READ, §6). Pluto's release criterion is zero exceptions on the reference hero (READ, the product site memo).

### 7.4 Product themes without a second source

- **A product supplies data, not CSS.** A brand ramp (Fluent's model, READ §3) or a seed the build expands (Material's, READ §1.2). Plus asset slots: logo, motif, optional typeface. The `logo` snippet from `008` is already the first slot (READ, `one-system-many-products` §3).
- **It lives in the same file.** `products.<name>` in `pluto.tokens.json`, or a file the build merges under the same schema. The build emits `[data-product="<name>"]` blocks.
- **Roles take product slots, through the system.** `primary` maps to a ramp step, not a hex. A product can never set a role directly.
- **The build checks every combination.** Theme × mode × product, against the token build's contrast pairs (READ, `tokens/pluto.tokens.json`, `contrast`). A ramp that fails AA fails the build.
- **A motif is an asset, not a token.** It is an SVG or a shape from the brand's closed list, placed by compositions in named slots.
- **Pluto's own signature stays fixed.** Mark colours, the four dots and the endorsement are not product-overridable. That is what makes two product themes "clearly Pluto's".

### 7.5 What today's rules should become

| Today | Becomes |
|---|---|
| One accent per surface | Productive profile only. Expressive allows the brand set together, as Google uses its four. |
| No gradients | Light tokens (bloom, rim, energized) in expressive. Free-form gradient literals stay banned everywhere. |
| L5, one shadow | A small elevation ramp in both modes; expressive adds rim and glow, derived from the ground (Fluent's brand-shadow idea). |
| L6, no backdrops | One floating-bar material, token-defined, both modes. |
| L8, cap at `text-5xl` (44 px) | Productive keeps 44 px. Expressive adds fluid display, section and proof steps up to about 96 px (Carbon ships 92 px). |
| L10, listed animations; 200 ms responses; one entrance per page | Motion tokens: effects and spatial, per mode. Responses stay fast in both. Expressive gets softer spatial easing and 600–900 ms reveals. One ambient motion per page, by a named utility. Reduced motion stops all. |
| L11, `rounded-full` allowlisted | A `radius.action` role: 8 px productive, pill expressive. |
| One fixed content width | A grid token set with full-bleed sections, used by compositions. |

CSS cannot run a spring. `linear()` can approximate any curve with many points, and has been in every browser since December 2023 (READ, [MDN `linear()`](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear)). The token build could sample a spring into a `linear()` string and a duration. Then the motion signature is physical, in tokens, with no JS.

## 8. Risks

- **Expressive leaks into productive.** Without the per-item profile, a big headline lands in a settings page. The new rule in §7.3 is the guard.
- **Combinatorial contrast.** Two themes × two modes × N products × M surfaces grows fast. The check must be generated, not hand-listed.
- **Non-orthogonal layers.** If a product and a mode both set one token, order decides (READ, §6). The rule should be: products set only brand slots; modes set only mode roles; no overlap.
- **A brand that is someone else's.** Today's typefaces are IBM's, Vercel's and JetBrains' (READ, product site memo). Loud mode amplifies whatever identity exists. Slots without a commissioned identity risk a loud generic site.
- **Copying a look.** The owner rejected a ribbon as "a knockoff of Stripe" (READ, product site memo). Studying Material's springs or Carbon's 92 px is architecture. A lit hero that resembles a competitor's is not.
- **Expressive harms tasks.** Google's own research says it can (READ, §1.6). The productive profile protects the apps.
- **Upgrade breakage.** Moving primitives under `brand` must keep every emitted CSS name, or installed apps break silently (READ, constitution §6, via the product site memo).

## 9. Questions for the owner

Each to be recorded in `decisions.md` once answered.

1. **How is a mode scoped?** (a) A `data-mode` attribute on a section, recommended; (b) a class; (c) a separate token file.
2. **What may a product theme set?** (a) A brand ramp and asset slots, contrast-checked, recommended; (b) asset slots only, as today; (c) any system token.
3. **How is the brand ramp made?** (a) Generated from one seed per product by the token build, recommended; (b) hand-picked 16 steps per product.
4. **Where does a lint profile come from?** (a) A per-item field in `registry.json`, recommended; (b) the item's directory; (c) a comment in each file.
5. **Does expressive ship before the commissioned identity?** (a) Yes: layers, tokens and compositions now, with today's assets in the brand slots, recommended; (b) wait for the identity.

## Sources

All read 2026-11-01.

- [Material Web, theming](https://github.com/material-components/material-web/blob/main/docs/theming/README.md); [Material Web README](https://github.com/material-components/material-web)
- [material-color-utilities](https://github.com/material-foundation/material-color-utilities)
- AndroidX Compose Material 3: [Typography.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Typography.kt), [MaterialShapes.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialShapes.kt), [MotionScheme.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MotionScheme.kt), [StandardMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/StandardMotionTokens.kt), [ExpressiveMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt)
- [Google Design, expressive Material research](https://design.google/library/expressive-material-design-google-research)
- Carbon: [type sets](https://carbondesignsystem.com/elements/typography/type-sets/), [style strategies](https://carbondesignsystem.com/elements/typography/style-strategies/), [motion](https://carbondesignsystem.com/elements/motion/overview/), [themes](https://carbondesignsystem.com/elements/themes/overview/), [colour usage](https://carbondesignsystem.com/elements/color/usage/), [2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/), [Carbon for IBM.com](https://www.ibm.com/standards/carbon/), [stylelint-plugin-carbon-tokens](https://raw.githubusercontent.com/carbon-design-system/stylelint-plugin-carbon-tokens/main/README.md)
- Fluent: [design tokens](https://fluent2.microsoft.design/design-tokens), [colour](https://fluent2.microsoft.design/color), [elevation](https://fluent2.microsoft.design/elevation), [motion](https://fluent2.microsoft.design/motion), [brandColors.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/brandColors.ts), [lightColor.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/alias/lightColor.ts), [durations.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/durations.ts), [curves.ts](https://raw.githubusercontent.com/microsoft/fluentui/master/packages/tokens/src/global/curves.ts)
- Geist: [typography](https://vercel.com/geist/typography), [colours](https://vercel.com/geist/colors), [materials](https://vercel.com/geist/materials)
- Atlassian: [design tokens](https://atlassian.design/foundations/tokens/design-tokens), [ensure-design-token-usage](https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage/usage), [our journey to a reimagined visual system](https://www.atlassian.com/blog/company-news/our-journey-to-a-reimagined-visual-system), [building the new icon system](https://www.atlassian.com/blog/how-we-build/behind-the-screens-building-atlassians-new-icon-system)
- [Spectrum CSS README](https://raw.githubusercontent.com/adobe/spectrum-css/main/README.md)
- [Apple Newsroom, Liquid Glass](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [stylelint-polaris README](https://raw.githubusercontent.com/Shopify/polaris/main/stylelint-polaris/README.md)
- DTCG: [Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/), [Resolver Module 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)
- [MDN, `linear()`](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear)
- This repository at `v0.8.0`: `tokens/pluto.tokens.json`, `src/app.css`, `scripts/lint-literals.ts`, `registry.json`, `context/decisions.md`, `context/research/2026-11-01-what-a-product-site-needs-to-compete.md`, `context/research/2026-11-01-one-system-many-products.md`.
