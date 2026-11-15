# Prior art: Radix Themes, and what Pluto can learn from it

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request
- **Question:** Radix Themes is the nearest relative of shadcn's lineage. How does it build colour, theming, components and docs? Which of its ideas fit a copy-the-source registry, and which do not?
- **What it blocks:** nothing. It informs later specifications; each idea below names the one it would touch.

## How to read this memo

- **READ:** a file says so. Radix paths are under `context/prior_art/radix-ui-themes/` at `1faff10` (2026-04-11, MIT), read on 2026-11-15. Pluto paths are this repository's working tree on `release/0.12.0`.
- **EXECUTED:** we ran a read-only command, such as a count with `grep`, and saw the result.
- **INFERRED:** our reasoning from the two.

Radix paths are shortened: `themes/` means `packages/radix-ui-themes/src/`. Radix's docs site is not in the clone. The README points to radix-ui.com (`README.md:11`). So the docs section studies the playground and the theme panel, which are.

## Summary

- **Radix gives every colour twelve steps, each with a job, and components name a step, never a hue.** Twelve solid steps and twelve translucent ones per scale. A component reads `--accent-9` or `--gray-a5`, so swapping the accent or the gray is one attribute on an ancestor. Pluto names roles instead (`primary`, `muted`, `border`), which carry the same idea with fewer stops and no hover or pressed steps.
- **The Theme component is a set of data attributes with a React context on top.** Accent, gray, radius, scaling, panel translucency and appearance are props. Each becomes a `data-*` attribute or a class. Nested themes override a subtree. Pluto's `data-mode` and `.dark surface-ink` already work the same way in plain CSS, with no component.
- **Props are data, and the data drives everything.** One "prop definition" object per component gives its types, defaults, enum checks, CSS class names, responsive breakpoints and the playground's matrix pages. Pluto's `tailwind-variants` object is the same kind of data, but only the class names come from it.
- **Radix has no contrast check in its repository, and 26 accents times 6 grays.** Pluto checks every pair it uses in both themes and keeps one accent by the owner's decision. Radix's breadth is the thing not to copy.
- **The ideas worth taking are about docs and layout, not runtime theming.** A variant matrix built from the component's own variant data. A `.light` reset, so a light island can sit in a dark page. A written job for each colour role. Container and section widths as tokens.

## 1. Colour

### What Radix does

- **READ** (`themes/styles/tokens/colors/blue.css`): each colour file imports four sheets from the `@radix-ui/colors` package: light, dark, light alpha and dark alpha. The scale values themselves live in that package, not in this clone. Radix Themes depends on it (`packages/radix-ui-themes/package.json`, `dependencies`).
- **READ** (`themes/styles/tokens/index.css`): 31 colour files load. Six are grays (gray, mauve, slate, sage, olive, sand). Twenty-five are accents.
- **READ** (`themes/styles/tokens/color.css`, "Accent color"): `[data-accent-color='blue']` maps `--accent-1` to `--accent-12` and `--accent-a1` to `--accent-a12` onto the blue steps. It also maps four extras: `contrast`, `surface`, `indicator` and `track`. The gray works the same way under `[data-gray-color]`.
- **EXECUTED** (count of `background-color`, `color` and 1 px inset `box-shadow` values across `themes/components/*.css`): the steps have clear jobs in practice.
  - Steps 1 and 2: page and subtle grounds.
  - Steps a3 to a5: component fills at rest, hover and pressed. `background-color: var(--accent-a3)` alone appears 44 times.
  - Steps a5 to a8: borders, most often a5 to a7.
  - Steps 9 and 10: solid fills and their hover.
  - Steps a11 and 12: text, low and high contrast. `color` uses 12 39 times and a11 30 times.
- **READ** (`themes/components/_internal/base-button.css`, "VARIANTS"): the button variants spend the steps in that order: `soft` is an `a3` fill, `outline` an `a8` hairline, `solid` step 9 with the `contrast` colour on it, all with `a11` text but the last.
- **Alpha steps.** An alpha step is a translucent colour that looks like its solid twin on the default ground. **INFERRED:** it keeps a fill or border right on any ground, which is why components prefer them.
- **READ** (`themes/styles/tokens/color.css`, "Semantic colors"): a few roles sit above the scales, such as `--color-background` and `--color-panel-solid`. In dark mode they become `--gray-1` and `--gray-2`.
- **Light and dark.** **READ** (`colors/blue.css`): dark is not computed here. It is a second hand-tuned scale from the package, swapped in under `.dark` or `.dark-theme`.
- **Text on a solid fill.** **READ** (`colors/*.css`, `--*-contrast`): white on every accent, except yellow, amber, lime, mint and sky. Those take a near-black taken from a gray's step 12.
- **Automatic gray.** **READ** (`themes/helpers/get-matching-gray-color.ts`): with gray set to `auto`, each accent picks a tinted gray. Blues get slate, reds mauve, yellows sand.
- **Contrast.** **EXECUTED** (`grep -rniE "wcag|apca|contrast ratio"` over `packages` and `apps`): no match. The repository holds no contrast check. **INFERRED:** Radix trusts the scale's design, made upstream in `@radix-ui/colors`, and tests nothing here.

### Pluto's state

- **READ** (`tokens/pluto.tokens.json`, `primitives` and `themes`): about 48 named primitives, mapped to shadcn-style roles per theme. There are no numbered scales. `muted` is `wash`, `border` is `line` (`#0B0F171A`, already an alpha colour), and `input` is a solid `line-input`.
- **READ** (`tokens/pluto.tokens.json`, `contrast`): `text`, `nonText` and `tints` list every pair a component draws. `tints` measures text on a 10 % (light) or 20 % (dark) wash of its own colour. `tests/unit/contrast.test.ts` runs them in both themes.
- **READ** (`tokens/pluto.tokens.json`, `themes.light`): `caution-foreground` is ink on the yellow fill. That is Radix's dark-text-on-yellow rule, found independently.
- **READ** (`src/lib/registry/ui/button/button.svelte`): hover changes the border to `foreground`; there is no hover fill step. `src/lib/registry/ui/alert/alert.svelte` uses `bg-destructive/10` and `/20`, which are the tints the contrast table measures.

## 2. The Theme component

### What Radix does

- **READ** (`themes/components/theme.props.tsx`): six theme props. They are `appearance` (inherit, light, dark), `accentColor` (default indigo), `grayColor` (default auto), `panelBackground` (solid or translucent), `radius` (none to full) and `scaling` (90 % to 110 %).
- **READ** (`themes/components/theme.tsx`, `ThemeImpl`): each prop is written as an attribute: `data-accent-color`, `data-gray-color`, `data-radius`, `data-scaling`, `data-panel-background`, `data-has-background`. Appearance becomes a `light` or `dark` class. All styling is CSS keyed on those.
- **Nesting.** **READ** (same file): a `Theme` inside a `Theme` reads the parent's values from context and overrides only what it sets. A nested theme with an explicit appearance paints its own background by default.
- **READ** (`themes/styles/tokens/color.css`): dark variables apply under `.dark` except inside a `.radix-themes` that is `.light`. So a light island inside a dark page works.
- **Radius and scaling.** **READ** (`themes/styles/tokens/radius.css`, `scaling.css`, `space.css`, `typography.css`): six radius steps are multiplied by a `--radius-factor` and by `--scaling`. Every space, font size and line height is multiplied by `--scaling` too.
- **Per-component overrides.** **READ** (`themes/components/_internal/base-button.tsx:58`): a button's `color` prop writes its own `data-accent-color`, so `color="red"` remaps the accent for that one element. `badge.tsx`, `avatar.tsx` and `checkbox.tsx` do the same.
- **Appearance needs help.** **EXECUTED** (`grep prefers-color-scheme` over `themes/`): no match. The playground follows the system through an outside provider (`apps/playground/app/next-theme-provider.tsx`, **READ**).

### Pluto's state, and the comparison

- **READ** (`scripts/build-tokens.ts`, `themeCss`): Pluto writes `:root` and `.dark` blocks. `[data-mode="expressive"]` and `[data-mode="productive"]` set the mode for a subtree, and a productive island inside an expressive one resets. In dark, an expressive subtree lifts the mark's four colours.
- **READ** (same file, `.surface-ink`): `class="dark surface-ink"` makes a dark island on a light page.
- **READ** (`src/lib/registry/ui/theme/`): a head script, a toggle and a store set `.dark` on `html` before paint. There is no Theme component.
- **INFERRED:** Pluto's mode is Radix's `panelBackground` and more. Radix lets any theme turn translucency on. Pluto ties glass, colour fields and poster type to expressive mode (`src/routes/(site)/start/modes/+page.svelte`). That is stricter, and it is a design rule, not a preference.
- **INFERRED:** Pluto has the dark island but not the light one. There is no `.light` reset, and the Tailwind `dark` variant is `&:is(.dark *)` (`scripts/build-tokens.ts:775`). **EXECUTED:** only 2 `dark:` utilities appear in `src/lib/registry/ui`, so almost all theming flows through variables.
- **READ** (`context/decisions.md`, "One system, many products", 2026-11-01): a product sets identity only. A product accent waits for its own specification. Radix's accent and gray props are therefore out of scope today.

## 3. Components

### What Radix does

- **Sizes are numbers, variants are words.** **READ** (`themes/components/_internal/base-button.props.ts`): sizes `1` to `4`, default `2`; seven variants. Card has sizes `1` to `5` and variants `surface`, `classic`, `ghost` (`card.props.tsx`). Badge has `solid`, `soft`, `surface`, `outline` (`badge.props.tsx`).
- **Colour is its own axis.** **READ** (`base-button.props.ts`, `props/color.prop.ts`, `props/high-contrast.prop.ts`): variant, colour and `highContrast` are separate props. Any variant takes any accent. `highContrast` moves the solid to step 12.
- **Prop definitions.** A prop definition is a plain object per prop: its type, values, default, class name and whether it is responsive. **READ** (`themes/props/prop-def.ts`): TypeScript derives the prop types from these objects.
- **READ** (`themes/helpers/extract-props.ts`): at render, `extractProps` applies defaults, rejects unknown values, and turns each styling prop into a class such as `rt-r-size-2`.
- **Responsive props.** **READ** (`themes/helpers/get-responsive-styles.ts`): a value may be an object keyed by breakpoint, `{ initial: '1', md: '3' }`. It becomes `rt-r-size-1 md:rt-r-size-3`. **READ** (`packages/radix-ui-themes/postcss-breakpoints.js`, `themes/styles/breakpoints.css`): a PostCSS plugin copies each rule inside `@breakpoints` into five media queries, 520 px to 1640 px.
- **Layout primitives.** **READ** (`flex.props.tsx`, `section.props.tsx`, `container.css`, `section.css`): `Box`, `Flex`, `Grid`, `Section` and `Container`. Their props are CSS words on the space scale (`gap="3"`, `p="4"`). Arbitrary strings are also allowed, passed as custom properties (`padding.props.ts`). `Container` caps width at 448, 688, 880 or 1136 px. `Section` sets vertical padding from 24 to 80 px.
- **Margin on everything.** **READ** (`base-button.tsx:33`, `box.tsx:27`): buttons, boxes and text all accept margin props.
- **Typography.** **READ** (`text.props.tsx`, `heading.props.tsx`, `typography.css`): `Text` and `Heading` take a size `1` to `9`, each pairing a font size with its own line height and tracking, plus `weight`, `color`, `truncate`, `wrap` and `trim`.
- **Leading trim.** Leading trim removes the space a line height adds above the capitals and below the baseline. **READ** (`props/leading-trim.prop.ts`, `styles/utilities/leading-trim.css`): `trim="both"` adds negative margins through pseudo-elements, from per-font offsets.

### Pluto's state

- **READ** (`src/lib/registry/ui/button/button.svelte`): one `tailwind-variants` object. Five variants (`default`, `secondary`, `ghost`, `destructive`, `link`) and four named sizes (`default` 48 px, `sm` 32 px, two icon sizes). Colour is folded into the variant: `destructive` is a variant, not a colour.
- **READ** (`src/lib/registry/ui/card/card.svelte`): `size` is `default` or `sm`, read as `data-size`.
- **READ** (`registry.json`): 75 items. No layout primitives and no text components. Layout and type are Tailwind utilities from tokens (`spacing.ladder`, `type.scale`, `tracking-section`).
- **READ** (`tokens/pluto.tokens.json`, `expressive.display.steps`): display, section, proof and poster steps with line heights from 0.9 to 1.05. No container widths in the token file (**EXECUTED**, `grep container`).

## 4. Docs and playground

### What Radix does

- **The theme panel.** **READ** (`themes/components/theme-panel.tsx`): a floating panel, open by default, toggled by the T key. The key is ignored while focus is in a text field, menu or listbox (`keyboardInputElement`). It returns focus to where it was.
  - Swatches for every accent and gray are radio inputs in labelled groups. Appearance, radius, scaling and panel background follow.
  - "Copy Theme" copies the `<Theme …>` tag, with only the non-default props.
- **The kitchen sink.** A kitchen sink is a page that shows every option at once. **READ** (`apps/playground/app/(themeable)/sink/button/page.tsx`): the button page loops over `buttonPropDefs.variant.values` and `size.values`. It adds rows for high contrast, gray and disabled. The matrix comes from the same definitions as the component.
- **READ** (`apps/playground/app/(themeable)/layout.tsx`): every sink page sits in a `Theme` with the panel, so a reviewer can re-theme it live.
- **READ** (`apps/playground/tests/visual-regression.spec.ts`): Playwright takes a full-page screenshot of each `/test/*` page and compares it with a stored image.

### Pluto's state

- **READ** (`src/lib/site/page/component.svelte`): each component page has when to use it, dos, don'ts, accessibility and an API table. The page is checked by axe in both themes. **READ** (`src/routes/(site)/components/button/+page.svelte`): the examples are hand-written (`variants`, `states`, `heights`, `keyboard`).
- **READ** (`src/lib/site/page/frame.svelte`): each example has its own Light | Dark switch. The other theme loads in an iframe of the example's own document, because the page's theme is set on `html`.
- **READ** (`src/routes/(site)/start/modes/+page.svelte`, `start/theme/+page.svelte`): the modes and the theme are explained in prose. Nothing lets a reader flip them live across a sample screen.

## 5. Radix Themes against shadcn-svelte

- **READ** (`context/prior_art/shadcn-svelte/docs/src/lib/components/theme-customizer.svelte`, `getThemeCodeOKLCH`): shadcn's customizer builds `:root` and `.dark` blocks of CSS variables for the reader to paste. **READ** (`docs/src/routes/(app)/(layout)/(create)/components/`): the create flow adds pickers for base colour, radius, fonts and presets, then copies the result.
- **INFERRED:** the two differ in where a theme lives. shadcn's theme is text the app owns, and it is fixed at install. Radix's theme is props the app passes to a package at run time. The first fits a copy-the-source registry; the second needs a runtime Pluto does not ship (constitution §3, §4.1).
- **What Radix has that shadcn lacks:** full scales with alpha twins, colour as its own axis, nested themes both ways, a global radius and scale, layout and text primitives, and props as data that drive the docs.
- **What fits a registry:** nested themes as plain CSS, props as data read by the site at build time, the step jobs as documentation, and layout sizes as tokens. The Theme context, responsive object props and a panel that edits a live app all need a runtime.

## Ideas for Pluto, ranked by value over cost

1. **A variant matrix built from the component's own variant data.** *Adapt.* Radix's sink loops over the prop definitions, so a new variant cannot miss its page. Pluto's `tailwind-variants` objects are already exported (`buttonVariants` in `button.svelte`). The site could render every variant by size, in both themes, from that object. axe then covers every combination, not only the hand-picked ones. *Why:* constitution §2.3 asks that every item have a page in both themes. A generated matrix proves it for every variant, at low cost. *Touches:* a new specification. `src/lib/site/page/component.svelte`, `src/lib/site/examples/`, `tests/e2e/site.spec.ts`.
2. **A written job for each colour role, with Radix's steps as the checklist.** *Adapt the vocabulary, not the scale.* For each role, state its job: ground, raised, inset, fill at rest, hover and pressed, subtle and strong border, solid, solid hover, low and high text. Then mark which jobs Pluto fills. *Why:* it shows the gaps in one table. Pluto has no hover or pressed fill (**READ**, `button.svelte` changes the border instead). It has one hairline and one input border. Each gap then gets its own decision, not an ad hoc `color-mix`. *Touches:* `src/routes/(site)/foundations/colour/`, the `contrast` lists in `tokens/pluto.tokens.json` if a role is added.
3. **A `.light` reset, so a light island can sit in a dark page.** *Adopt the idea.* Radix's dark rules skip a subtree marked light. Pluto could print the light variables again under `.light`, after `.dark`, and make the `dark` variant skip `.light` subtrees. *Why:* two uses. An app gets the mirror of `surface-ink`. The site could show both themes side by side without an iframe (`frame.svelte`). **INFERRED:** the cost is small, since only 2 components use `dark:`. The variant change needs a test. *Touches:* `scripts/build-tokens.ts` (`themeCss`, the `@custom-variant`), `src/lib/site/page/frame.svelte`.
4. **Container widths and section padding as tokens.** *Adapt, as tokens and utilities, not components.* *Why:* Pluto's marketing items (`stage`, `cta-band`, `proof-band`) and the site each choose widths today. Named widths make them agree. *Touches:* `tokens/pluto.tokens.json`, `scripts/build-tokens.ts`, the marketing items.
5. **A theme and mode lab on the Start pages.** *Adapt the panel, much smaller.* Two controls, theme and mode, over one sample screen, and a button that copies the attribute line. Keep Radix's keyboard care: labelled radio groups, no shortcut while typing, focus returned. *Why:* readers see what a mode changes, which prose cannot show. Nothing ships to apps. *Touches:* `src/routes/(site)/start/modes/`, `start/light-and-dark/`, spec `017`'s follow-up.
6. **Leading trim for display type.** *Adapt.* Pluto's poster and display steps run at line heights near 0.9, where the space above capitals shows. *Why:* headings line up with what sits beside them. **INFERRED:** the CSS `text-box` property may now do this without pseudo-elements; a placeholder memo on browser support comes first. *Touches:* `expressive.display` in the token file, a `trim` utility in `pluto-theme`.
7. **When a product accent is specified, remap one set of names in a subtree.** *Adopt the mechanism, later.* A `data-accent` rule would remap `primary`, `ring` and their kin, and the contrast table would run once per accent. *Why:* it keeps the future specification small. Nothing is built now (decision of 2026-11-01). *Touches:* the future product-accent specification.

## Things to avoid

- **The breadth of choice.** Twenty-five accents and six grays make `color.css` 1,172 lines (**EXECUTED**, `wc -l`), with no contrast check. Pluto's owner has ruled one accent, and each colour added enters the contrast table.
- **A runtime Theme component.** A context and six props suit a package. Pluto's theme is CSS the app owns, set before paint. A context adds JavaScript and nothing else.
- **A global scaling factor.** At 90 %, Radix shrinks every size, radius and space. **INFERRED:** at that scale Pluto's 32 px small button would drop to about 29 px, under the minimum its own page promises (`components/button/+page.svelte`, "at least 32 px tall").
- **Responsive object props.** Tailwind already gives `md:` variants on any class. A prop-to-class layer duplicates that and needs its own PostCSS plugin (`postcss-breakpoints.js`).
- **Margin props on every component.** **INFERRED:** they put spacing on the child, where the parent's `gap` belongs. They also widen every component's interface.
- **Numbered sizes.** `size="2"` says nothing to a reader. Pluto's `default` and `sm` name their use.
- **The `classic` variant's recipe.** **READ** (`base-button.css`): stacked gradients, inset shadows and filters such as `brightness(0.92)`. Those are literal values outside any token, which constitution §4.3 forbids.

## What this memo did not do

- It did not read `@radix-ui/colors`, where the scales are made. It is not in the clone.
- It did not read Radix's docs site, which lives in another repository.
- It ran nothing but `grep`, `wc` and `git log`.
