# The data items: chart, popover, accordion, toggles, scroll area, and a meter

- **Status:** complete
- **Date:** 2026-10-31
- **Author:** the design lead
- **Question:** For the data and disclosure items of `004`: what are the stock `chart`, `popover`, `accordion`, `toggle`, `toggle-group` and `scroll-area` made of, what in each must change to meet our rules, what does `layerchart` 2.x cost and how are its colours set without a literal, what accessibility contract does each carry, and what should a fuel meter be?
- **What it blocks:** specification `004`, code and data, released as `v0.4.0`. Its needs are a code-running product's home page (a fuel meter, a popover on "Fuel", a security accordion) and an analytics admin page (charts and time-range presets).

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-31, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chromium (build 1248) and WebKit 27.2 (build 2370); the repository was not touched.
- **READ**: a source says so. Each source was read on 2026-10-31. Paths in the prior-art clone are relative to `context/prior_art/shadcn-svelte/`, at commit `6149e14`. Paths starting `bits-ui/` are relative to `node_modules/bits-ui/dist/` (bits-ui 2.20.2, MIT). Paths starting `layerchart/` are relative to `node_modules/layerchart/dist/` in the scratch project (layerchart 2.9.2, MIT).
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway project outside this repository, not kept: `stock/` (the six items' built maia files), `extract.ts`, `app/` (a SvelteKit project on the repository's pins: Svelte 5.57.3, Vite 8.3.5, Tailwind 4.3.3, adapter-static 4.0.0, bits-ui 2.20.2, layerchart 2.9.2), `app/probe.ts` and `app/aria.ts` (the Playwright runs), `app/shots/` (screenshots), `app-base/` (the same project without layerchart, for the install delta), `view/` (`bun pm view`), `downloads/` (the ARIA 1.2 HTML). Nothing was written to this repository except this memo.

Terms of art.

- **Stock item.** An item from shadcn-svelte's own registry as `add` serves it, built in the maia style (the primitives memo §3.1). This memo lints the built files, as that memo did.
- **The lint.** `scripts/lint-literals.ts`, with `001` decision 25's rules and `002` decision 21's L1 to L18.
- **The ladder.** `001` decision 10's sizes: 4, 8, 12, 16, 24, 32, 48, 64 and 96 px, so the Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16 and 24 (EXECUTED: `tokens.spacing.ladder` read through `scripts/tokens.ts`).
- **Mark.** In a chart, the shape that stands for a datum: a bar, a line, a point.
- **Series.** One set of marks sharing a key and a colour, such as "visitors".
- **Meter.** A display of a value within a known range (ARIA 1.2). Not a progress bar.

## In short

- **The six stock items fail the lint 63 times in 14 of their 27 files**, mostly for the shared focus halo, off-ladder sizes (`h-9`, `w-72`, `w-2.5`, `min-w-32`), `tw-animate-css` classes, a `shadow-2xl`, two `style` attributes and a translucent `ring-foreground/5`. `accordion` and `toggle-group` are small restyles; `toggle` and `scroll-area` take the `002` focus recipe plus sizes; `popover` takes decision 7's elevation; `chart` is a design job (§1 and §2).
- **A chart item can avoid a `style` attribute entirely.** layerchart takes colour as a `fill` or `stroke` prop that becomes an SVG presentation attribute, and as a `class`. In Chromium, both `fill="var(--chart-1)"` and the Tailwind token class `fill-chart-1` painted a bar `#2456E6`, and `stroke="var(--chart-2)"` and `stroke-chart-2` painted a line `#E23A2E` (EXECUTED, §2.3). The stock item's `<style>` injection and its `style="--color-bg: …"` indicator are unneeded, and the first evades the lint (§1.7).
- **layerchart costs about 122 to 136 KB of gzipped JavaScript** on a page with one bar chart and one line chart, over a 40 KB SvelteKit baseline; 31 direct dependencies, 23 of them `d3-*`; 42 packages added to an install; 11 MB on disk (EXECUTED, §2.4). It prerenders without error but draws nothing on the server: the chart appears on hydration (§2.5). It animates only when asked (`motion` prop), and it knows nothing of `prefers-reduced-motion` (§2.6).
- **A chart's SVG is `role="figure"`**, named only when a `title` is given; bars and lines are invisible to assistive technology, the tooltip is pointer-only and portaled to `<body>` with no role, and the legend is a row of `<button>`s with an inline `style="background-color"` swatch (EXECUTED, §3). The stock item adds no name, no table and no keyboard path. Our chart colours do not differ from each other by 3:1 (chart-1 against chart-2 measures 1.37), so a multi-series figure needs direct labels or distinct marks, not a colour legend alone (§3.3).
- **bits-ui's contracts** (§4): `popover` traps and loops focus, moves it to the first tabbable on open, returns it to the trigger on Escape, and names its trigger `aria-haspopup="dialog"` while the content carries no role; `accordion` renders a `role="heading"` with `aria-level` and a `<button aria-expanded>`, moves among triggers by arrow, Home and End, and sets **no `aria-controls`** and no `region`; `toggle` is `<button aria-pressed>`; `toggle-group` single is `role="group"` holding `role="radio"` items with roving tabindex, where arrows move focus but only Space or Enter selects; `scroll-area`'s viewport is an unfocusable `div` whose scrollbar is a 10 px strip with an 8 px thumb that appears on hover, far below R21's 24 px.
- **A native `overflow-auto` box with `scrollbar-color` from tokens and `tabindex="0"`** scrolled by keyboard and drew a `#7C808B` thumb on a `#EAEAE7` track (3.27:1) in Chromium (EXECUTED, §4.5). It meets the need the bits-ui item was listed for.
- **`shadow-elevation` is visible on `card` in light** (the ground 6 px under a panel measured `rgb(230, 231, 232)` against the card's `rgb(254, 254, 254)`) **and dark shows the hairline only** (the panel's edge measured `rgb(120, 124, 138)`, the ground under it unchanged), as `002` decision 7 intends (EXECUTED, §5). `w-72` is off the ladder; `w-3xs` (256 px), `w-xs` (320 px) and `w-sm` (384 px) pass L7 (EXECUTED).
- **A fuel meter is a meter, not a progress bar** (ARIA 1.2 and the APG say so in as many words). The HTML `<meter>` with `appearance: none` and the `::-webkit-meter-*` pseudo-elements took our tokens in both Chromium and WebKit, and both expose it as `meter "Fuel"`; a `<div role="meter">` with `aria-valuetext` is exposed the same way (EXECUTED, §6). A token-only meter is a `bg-muted` track, a `bg-primary` fill (4.90:1 on the track in light, 5.22 in dark) and the numbers written beside it.

## 1. The stock items, file by file

### 1.1 What was done

EXECUTED: `extract.ts` wrote each item's files from `docs/static/registry/styles/maia/<item>.json` into `stock/<item>/`, then `lintText` from `scripts/lint-literals.ts` ran on every file with the rules `loadRules` reads from this repository. Line numbers below are of those extracted files, which match the source files under `docs/src/lib/registry/ui/<item>/` line for line, with maia's classes inlined where the source holds a `cn-*` marker. The maia classes are cited by `docs/src/lib/registry/styles/style-maia.css` line.

### 1.2 The table

| Item | Files | Wraps | Packages (built `devDependencies`) | `registryDependencies` | Lint | Files failing | Off-rule classes the lint cannot see (R-rule) |
|---|---|---|---|---|---|---|---|
| `chart` | 5 | layerchart `Tooltip` (as `TooltipPrimitive.Root`), `getChartContext` | `layerchart@^2.0.0` | none | 20 | 2 of 3 `.svelte` | `bg-background` as a floating panel's ground (R8: a panel is `popover`); `rounded-lg`, `rounded-[2px]` (R9); a `<style>` element built with `<svelte:element this="style">` (§1.7); a `.dark` prefix written into generated CSS (R12) |
| `popover` | 9 | bits-ui `Popover.Root`, `Trigger`, `Content`, `Portal`, `Close` | `bits-ui@^2.20.0`, `@internationalized/date@^3.12.0` | none | 16 | 1 of 7 | `rounded-2xl` (R9); `origin-(--bits-popover-content-transform-origin)` is fine (token form) |
| `accordion` | 5 | bits-ui `Accordion.Root`, `Item`, `Header`, `Trigger`, `Content` | the same two | none | 4 | 3 of 4 | `rounded-2xl` (R9); `border border-transparent` on the trigger (a spacer border, harmless); `hover:underline`; `text-sm font-medium` on a heading (R17: `font-heading font-bold`); `underline-offset-3` (not a size utility, passes) |
| `toggle` | 2 | bits-ui `Toggle.Root` | the same two, `tailwind-variants@^3.3.0` | none | 11 | 1 of 1 | `rounded-4xl` (R9); `aria-invalid:border-destructive` (a toggle is never invalid); `aria-pressed:bg-muted` and `hover:bg-muted` (R8: `muted` as a selected inset; see §4.3) |
| `toggle-group` | 3 | bits-ui `ToggleGroup.Root`, `Item` | the same three | `toggle` | 5 | 2 of 2 | `rounded-l-3xl`, `rounded-r-3xl`, `rounded-t-3xl`, `rounded-b-3xl`, `rounded-none` (R9); `data-[state=on]:bg-muted` (R8, R19) |
| `scroll-area` | 3 | bits-ui `ScrollArea.Root`, `Viewport`, `Scrollbar`, `Thumb`, `Corner` | the same two | none | 8 | 2 of 2 | `rounded-[inherit]` and `transition-[color,box-shadow]` pass (no literal); `border-l-transparent`, `border-t-transparent` (spacers); `bg-border` as the thumb (1.23:1 on paper, `001` decision 12: a decorative hairline colour on a control) |

27 files, 63 lint findings, 14 files failing. `index.ts` and `chart-utils.ts` pass. The `*.ts` lint column of the primitives memo (line 179: 11 + 7 for `chart`) was run on the whole JSON; this run is per file and the counts differ by the same classes being split differently.

### 1.3 The findings, by file

The lint's rule name, then the class.

- `chart/chart-container.svelte` (4): translucent tint `[&_.lc-line]:stroke-border/50` (line 40); spacing `[&_.lc-legend-swatch-button]:gap-1.5` (62); size `[&_.lc-legend-swatch]:size-2.5` and arbitrary `rounded-[2px]` (64).
- `chart/chart-tooltip.svelte` (16): `style=` (146, the indicator's `--color-bg` and `--color-border`); `min-w-32`, `gap-1.5`, `border-border/50`, `px-2.5`, `py-1.5`, `shadow-xl` (109); `gap-1.5` (117, 161); `[&>svg]:h-2.5`, `[&>svg]:w-2.5` (129); `rounded-[2px]` (147); `h-2.5 w-2.5` (148); `border-[1.5px]` (150); `my-0.5` (151).
- `chart/chart-style.svelte` (0): it renders a `<style>` element the lint does not see (§1.7).
- `popover/popover-content.svelte` (16, all on line 26): ten animation classes (`data-open:animate-in`, `fade-in-0`, `zoom-in-95`, four `slide-in-from-*-2` and their `data-closed` twins; `tw-animate-css`, which no item names, primitives memo line 142), `ring-foreground/5`, `ring-1`, `shadow-2xl`, `duration-100`, `w-72`, `outline-hidden`. These are `style-maia.css` lines 927 to 929 plus the source's own `z-50 w-72 … outline-hidden`.
- `accordion/accordion-content.svelte` (2): `data-open:animate-accordion-down`, `data-closed:animate-accordion-up` (16; `style-maia.css` line 16). The keyframes come from `shadcn-svelte/tailwind.css`, which `001` imports.
- `accordion/accordion-item.svelte` (1): `data-open:bg-muted/50` (15).
- `accordion/accordion-trigger.svelte` (1): `outline-none` (22).
- `toggle/toggle.svelte` (11): `focus-visible:ring-ring/50`, `aria-invalid:ring-destructive/20`, `dark:aria-invalid:ring-destructive/40`, `outline-none`, `focus-visible:ring-[3px]` (5); `h-9`, `min-w-9`, `pr-2.5`, `pl-2.5` (12, the default size, `style-maia.css` 1356); `h-10`, `min-w-10` (14, `lg`). The `sm` size `h-8 min-w-8 px-3` is on the ladder.
- `toggle-group/toggle-group.svelte` (2): `style=` (69, `--gap: {spacing}`) and `gap-[--spacing(var(--gap))]` (71). The `spacing` prop is a number of Tailwind steps written into a `style` attribute.
- `toggle-group/toggle-group-item.svelte` (3): `shadow-none`, `pr-2.5`, `pl-2.5` (26).
- `scroll-area/scroll-area.svelte` (4, line 32): `outline-none`, `focus-visible:ring-[3px]`, `focus-visible:ring-ring/50`, `focus-visible:outline-1`.
- `scroll-area/scroll-area-scrollbar.svelte` (4): `data-horizontal:h-2.5`, `data-vertical:w-2.5`, `p-px` (20); `rounded-full` (28, the thumb; not on decision 19's allowlist).

### 1.4 Props and variants (READ)

- `popover`: `Root` binds `open`; `Content` takes `sideOffset` (default 4), `align` (default `center`), `portalProps`, and passes the rest to bits-ui (`popover-content.svelte` lines 7 to 16). `Header`, `Title`, `Description` are plain `div`s with `cn-popover-*` classes: `flex flex-col gap-1 text-sm`, `text-base font-medium`, `text-muted-foreground` (`style-maia.css` 935 to 945). `Title` is a `div`, not a heading, and is not wired to the content by `aria-labelledby`.
- `accordion`: `Root` binds `value`; `Trigger` takes `level` (default 3) and renders bits-ui `Header` with it, plus two `IconPlaceholder`s, `CaretDownIcon` and `CaretUpIcon` for phosphor, swapped by `group-aria-expanded` (`accordion-trigger.svelte` lines 9 to 45). `Content` wraps children in an inner `div` with `pt-0 pb-4` and link styles.
- `toggle`: `toggleVariants` with `variant` `default` | `outline` and `size` `default` | `sm` | `lg` (`toggle.svelte` lines 4 to 21); binds `pressed`.
- `toggle-group`: `Root` takes `type` (bits-ui: `single` | `multiple`), `variant`, `size`, `spacing` (number, default 0) and `orientation`, and shares them by context (`toggle-group.svelte` lines 26 to 54); `Item` reads the context and reuses `toggleVariants`. With `spacing` 0 the items join: inner radii removed, shared borders dropped (`toggle-group-item.svelte` line 26).
- `scroll-area`: `orientation` `vertical` | `horizontal` | `both`, `scrollbarXClasses`, `scrollbarYClasses`, a bindable `viewportRef` (`scroll-area.svelte` lines 6 to 20).
- `chart`: `ChartContainer` takes `config: ChartConfig` and an `id`, sets `data-chart`, `data-slot="chart"`, `aspect-video text-xs`, a list of `[&_.lc-*]` overrides, and renders `ChartStyle` (`chart-container.svelte` lines 9 to 79). `ChartTooltip` takes `hideLabel`, `indicator` (`dot` | `line` | `dashed`), `hideIndicator`, `labelKey`, `label`, `labelFormatter`, `labelClassName`, `formatter` (a snippet), `nameKey`, `color` (`chart-tooltip.svelte` lines 13 to 48).

### 1.5 What the docs pages say (READ: `docs/content/components/<item>.md`)

- `popover.md`: "Displays rich content in a portal, triggered by a button"; examples basic, align, with form (lines 3, 74 to 102).
- `accordion.md`: "A vertically stacked set of interactive headings that each reveal a section of content"; `type="single"` or `"multiple"`; `disabled` per item; borders and a card wrapper are an app's classes (lines 3, 97 to 135).
- `toggle.md`: "A two-state button that can be either on or off"; `variant="outline"`, sizes, disabled (lines 3, 71 to 105).
- `toggle-group.md`: "A set of two-state buttons"; `type="single"`; outline, size, `spacing`, `orientation="vertical"`, disabled (lines 3, 75 to 131).
- `scroll-area.md`: "Augments native scroll functionality for custom, cross-browser styling"; its usage example sets `h-[200px] w-[350px]`, two arbitrary sizes (lines 3, 68).
- `chart.md`: "We do not wrap LayerChart"; an app composes layerchart's own components and brings in `Chart.Container` and `Chart.Tooltip` (lines 38 to 63). Colours go in a `chartConfig` as `color: "var(--chart-1)"` or a `theme: { light, dark }` pair, and marks reference them as `var(--color-KEY)` or the class `fill-(--color-desktop)` (lines 350 to 463). The manual install writes the five `--chart-*` variables in oklch into `:root` and `.dark` (lines 88 to 111); ours already exist (`001` decision 8).

### 1.6 `chart`'s four files in detail (READ)

- **`chart-utils.ts`** exports `THEMES = { light: "", dark: ".dark" }`, the `ChartConfig` type (per key: `label`, `icon`, and either `color` or `theme`), `TooltipPayload` (layerchart's `Tooltip.TooltipSeries`), `getPayloadConfigFromPayload` (finds the config entry for a tooltip row by key, label or a string field of the datum, lines 21 to 54), and the context pair `setChartContext` / `useChart` (lines 56 to 68).
- **`chart-container.svelte`** generates an id `chart-<id>`, sets the context with a getter over `config`, and renders `<ChartStyle id config />` before the children (lines 20 to 79).
- **`chart-style.svelte`** builds one CSS rule per theme, `<prefix> [data-chart=<id>] { --color-<key>: <colour>; … }`, for every config entry with a `color` or `theme`, and renders it inside `<svelte:element this={"style"}>` (lines 10 to 37). So series colours are **CSS variables named `--color-<key>`, set by an injected `<style>` element**, with the dark values under a `.dark` prefix.
- **`chart-tooltip.svelte`** reads the config through `useChart()` and layerchart's `getChartContext()` (`tooltip.series`, `tooltip.data`, `x`), filters rows with a value, formats the label, and renders `TooltipPrimitive.Root variant="none"` holding a `div` panel (`bg-background … shadow-xl`, line 109). The colour indicator is a `div` with `style="--color-bg: {indicatorColor}; --color-border: {indicatorColor};"` and classes `border-(--color-border) bg-(--color-bg)` (lines 145 to 153). `indicatorColor` is `color || item.config?.color || item.color` (line 126).

### 1.7 Two lint blind spots (EXECUTED, INFERRED)

- `chart-style.svelte` lints clean while it injects a stylesheet, because the lint's `STYLE_BLOCK` pattern looks for `<style` and the file writes `<svelte:element this={"style"}>`. A `004` lint rule could flag `this={"style"}` and `this="style"`.
- layerchart's own DOM carries inline styles (`style="background-color: var(--chart-1)"` on each legend swatch, `style:top`/`style:left` on the tooltip; §3.1). The lint reads our files, not a dependency's output, so these are not findings; they are noted because a `style` attribute will appear in the rendered page even when ours has none.

## 2. layerchart 2.x

### 2.1 The package (EXECUTED: `bun pm view layerchart --json`)

| Field | Value |
|---|---|
| Latest | 2.9.2, published 2026-10-30 18:10 UTC (2.9.1 was 2026-10-23; 2.0.0 was 2026-07-01). The primitives memo's 2.9.1 (line 268) is already one patch behind |
| Licence | MIT |
| `peerDependencies` | `svelte ^5.0.0` only |
| `dependencies` | 31: `d3-array`, `d3-chord`, `d3-color`, `d3-contour`, `d3-delaunay`, `d3-dsv`, `d3-force`, `d3-geo`, `d3-geo-polygon`, `d3-geo-voronoi`, `d3-hierarchy`, `d3-interpolate`, `d3-interpolate-path`, `d3-path`, `d3-polygon`, `d3-quadtree`, `d3-random`, `d3-sankey`, `d3-scale`, `d3-scale-chromatic`, `d3-shape`, `d3-tile`, `d3-time` (23 `d3-*`), `@types/d3-contour`, `@dagrejs/dagre`, `memoize`, `runed`, `@layerstack/utils`, `@layerstack/tailwind`, `@layerstack/svelte-state`, `@layerstack/svelte-actions` (the last four are pre-release pins, `2.0.0-next.19`, `2.0.0-next.21`, `0.1.0-next.25`, `1.0.1-next.20`) |
| Developed against | `svelte 5.57.1`, `vite ^8.0.16`, `@sveltejs/kit ^3.0.0` (its `devDependencies`), so our pins are its own |
| Install delta | 102 packages with layerchart against 60 without, the same project otherwise: **42 packages**; 29 `d3-*` folders in `node_modules` (six transitive); `node_modules/layerchart` is 11 MB (`du -sh`); 1,739 files unpacked |

### 2.2 The components a chart needs (READ: `layerchart/components/`)

layerchart has two layers. The **simplified charts** (`charts/BarChart`, `LineChart`, `AreaChart`, `PieChart`, `ScatterChart`, `ArcChart`) take `data`, `x`, `y`, a `series` array and flags `axis`, `grid`, `legend`, `tooltip`, `labels`, `points`, and build the composition for you. The **primitives** are composed by hand inside `Chart`: `Svg` (or `Canvas`, `Html`) as the layer, then `Axis`, `Grid`, `Rule`, `Bars`, `Bar`, `Area`, `Spline`, `Points`, `Labels`, `Highlight`, `Legend`, `Tooltip`, `Bin` (a histogram binner), `Brush`, annotations.

- **`Chart`** (`Chart/Chart.svelte`): the dimensions and contexts; takes `data`, `x`, `y`, `c` (the colour accessor), `xScale`, `yScale`, `cScale`, `cRange`, `padding`, `yNice`, `series`, `seriesLayout` and a `tooltipContext`.
- **`Svg`** (`layers/Svg.svelte` lines 122 to 138): renders `<svg role="figure">`, with an optional `title` prop that becomes a `<title>` child.
- **`Bars`/`Bar`** (`Bar/Bar.shared.svelte.d.ts` lines 38 to 41, `Bars/Bars.base.svelte` lines 26 to 27): `fill`, `stroke` (default `'black'`), `strokeWidth` (default 0), `class`, `rounded`, `motion`. Each bar is a `Rect`; `Rect/Rect.svg.svelte` lines 90 to 120 write `fill={resolvedFill}` and `stroke={resolvedStroke}` as **SVG attributes** and `class={cls('lc-rect', resolvedClass)}`, as a `<rect>` or, when rounded, a `<path>`. The isometric branch uses a `style` object (line 78); the plain one does not.
- **`Spline`** (`Spline/Spline.shared.svelte.d.ts` lines 38 to 47): `stroke?: ColorProp`, `fill?: ColorProp`, `class`, `curve`, `motion`; its `<path>` gets `fill`, `stroke` and `class` attributes (`Path/Path.svg.svelte` lines 136 to 142), and a fallback stylesheet gives an unset stroke `var(--color-surface-content, currentColor)` (lines 184 to 198).
- **`Area`** (`Area/Area.shared.svelte.d.ts` lines 41 to 53): the same props plus `line`.
- **`Axis`** (`Axis/Axis.shared.svelte.d.ts` lines 38 to 102): `placement`, `rule`, `grid`, `format`, `tickLabelProps`; tick labels carry the class `lc-axis-tick-label`.
- **`Legend`** (`Legend.svelte` lines 545 to 563): with `variant="swatches"`, one `<button type="button" class="lc-legend-swatch-button">` per item holding a `div.lc-legend-swatch` with `style:background-color={item.color}` and a label; click toggles the series; the `ramp` variant draws an SVG gradient.
- **`Tooltip`** (`tooltip/Tooltip.svelte`, `TooltipContext.svelte`): modes `bisect-x`, `bisect-y`, `bisect-band`, `band`, `facet`, `bounds`, `voronoi`, `quadtree`, `quadtree-x`, `quadtree-y`, `manual` (`TooltipContext.svelte` lines 346 to 372, 711, 855); `variant` `default` | `invert` | `none` (`Tooltip.svelte` line 101). The hit layer is a `div` with pointer handlers and `onkeydown={() => {}}` (line 928): **no keyboard interaction**. The tooltip is portaled; a comment notes that one shown "programmatically — keyboard navigation, a chart group, `locked`" must follow the chart on scroll (lines 348 to 350), so a programmatic `show` exists for an app to drive.
- **`Bin`** (`Bin/Bin.shared.svelte.d.ts` lines 8 to 40): a 2-D grid binner (cells with `count`, optional `weight`), not a 1-D histogram. A histogram on log buckets is `d3-array`'s `bin` over the data and `Bars` on the result, or an app's own bucketing (INFERRED).

How a series colour is given, in order of resolution (READ: `utils/dataProp.js` lines 103 to 120, `Spline.shared.svelte.d.ts` lines 100 to 104): a `fill`/`stroke` string that `isCSSColor` accepts is used as is; a function returns a colour or a domain value for `cScale`; a plain string names a data field. The simplified charts' `series[].color` is a string placed on the mark's `fill` or `stroke`; the default series is `color: 'var(--color-primary)'` and `cRange={['var(--color-primary, currentColor)']}` (`charts/BarChart/BarChart.shared.svelte.d.ts` line 22, `BarChart.base.svelte` line 89). So the library itself expects CSS variables in presentation attributes.

### 2.3 Colour without a `style` attribute (EXECUTED, Chromium)

The scratch page `/chart` rendered six figures. `probe.ts` read each first mark's attributes and computed style.

| Figure | How colour was given | DOM | Computed |
|---|---|---|---|
| A | `BarChart`, `series: [{ color: "var(--chart-1)" }]`, `legend` | `<path class="lc-rect lc-bar lc-bars-bar" fill="var(--chart-1)" stroke="black" stroke-width="1">`; no `style` | `fill: rgb(36, 86, 230)` = `#2456E6` = `chart-1` |
| B | `Chart` + `Svg title` + `Axis` ×2 + `<Bars class="fill-chart-1" />` | `<rect class="lc-rect lc-bar lc-bars-bar fill-chart-1" stroke="black" stroke-width="0">`; no `fill` attribute, no `style` | `fill: rgb(36, 86, 230)` |
| C | `LineChart`, `series: [{ color: "var(--chart-2)" }]` | `<path class="lc-path" stroke="var(--chart-2)">`; no `style` | `stroke: rgb(226, 58, 46)` = `#E23A2E` = `chart-2` |
| D | `Chart` + `<Spline class="stroke-chart-2" />` | `<path class="lc-path stroke-chart-2">`; no `stroke` attribute | `stroke: rgb(226, 58, 46)` |
| E | as A with `props={{ bars: { motion: "tween" } }}` and `chart-4` | `fill="var(--chart-4)"` | `rgb(30, 158, 86)` = `#1E9E56` |
| F | `BarChart` with no colour | `fill="var(--color-primary, currentColor)"` | `rgb(36, 86, 230)` = `primary` |

Both routes work. **A token class on the mark** (`fill-chart-1`, `stroke-chart-2`; Tailwind 4 generates `fill-*` and `stroke-*` from `--color-*`, which `001` emits for the five chart tokens, `src/app.css` at `v0.3.0` lines 184 to 188) and **a `var()` string in the `fill`/`stroke` prop** both paint the token's colour, with no `style` attribute anywhere in our markup. The class route needs no `ChartConfig` colour and no injected stylesheet; the prop route is what the simplified charts' `series[].color` takes. A screenshot of A (`shots/chart-tooltip.png`) shows blue bars with a thin black outline: the simplified `BarChart` passes `strokeWidth={1}` with the `Bars` default `stroke='black'` (`BarChart.base.svelte` line 140, `Bars.base.svelte` line 27), a literal our wrapper would override with `stroke-card` or `strokeWidth 0` (INFERRED).

The page logged no errors or warnings. The console was watched for both.

### 2.4 The client bundle (EXECUTED)

`probe.ts` loaded each prerendered route in Chromium, recorded every `.js` and `.css` file fetched, and gzipped the files from `build/` (Vite's own minified output, level default).

| Route | Holds | Files | JS, minified | JS, gzipped | Over the baseline (gz) |
|---|---|---|---|---|---|
| `/meter` | HTML only (the baseline: SvelteKit runtime and Svelte) | 14 | 102.9 KB | 40.1 KB | — |
| `/bits` | bits-ui `Accordion`, `Toggle`, `ToggleGroup`, `ScrollArea` | 15 | 166.2 KB | 57.5 KB | +17.4 KB |
| `/popover` | bits-ui `Popover` (floating-ui, focus scope, portal) | 14 | 193.6 KB | 68.7 KB | +28.6 KB |
| `/chart-raw` | `Chart`, `Svg`, `Axis` ×2, `Bars`, `Spline`; `d3-scale` | 42 | 493.0 KB | 162.3 KB | **+122.2 KB** |
| `/chart-simple` | `BarChart`, `LineChart` (tooltip on by default) | 45 | 519.8 KB | 171.3 KB | **+131.2 KB** |
| `/chart` | both of the above plus a legend and a tweened chart | 46 | 531.4 KB | 175.8 KB | +135.7 KB |

The chart routes pull 28 to 32 more chunks than the baseline. For scale, an admin page is seen by its owners alone, so this weight lands on no public visitor; a product home page needs no chart (INFERRED).

### 2.5 Server rendering (EXECUTED)

`vite build` with adapter-static prerendered every route with no error. `build/chart.html` is 6,098 bytes and holds **no `<svg>`, no `<rect>` and no `<path>`**: each chart's container holds only Svelte's hydration comments. layerchart measures its container to size the SVG, so on the server it draws nothing, and the figure appears after hydration. A prerendered admin page therefore shows empty chart boxes until the JavaScript runs; the data table alternative of §3.2 would be the only server-rendered content (INFERRED).

### 2.6 Motion (READ, EXECUTED)

- A mark's `motion` prop takes `'spring'`, `'tween'`, `'none'`, or an object `{ type, ...options }`, per property if wanted (`utils/motion.svelte.d.ts` lines 22 to 48). With the prop undefined, `createMotion` returns a passthrough and no state or effect is created (`utils/motion.svelte.js` lines 95 to 108). The simplified charts pass no default. **Animation is opt-in.**
- EXECUTED: a `MutationObserver` on the bars' `d`, `height` and `y` attributes counted **182 mutations after mount for figure E (`motion: "tween"`) and 0 for figure F (no motion)** over 1.2 s.
- `grep` for `prefers-reduced-motion`, `reducedMotion` and `prefersReducedMotion` across `layerchart/dist` found nothing. A tween's duration is a number in the prop; our `--motion-micro` is a CSS variable the component cannot read. Honouring `001` decision 14 would mean reading `matchMedia("(prefers-reduced-motion: reduce)")` ourselves and passing `motion` undefined (INFERRED). The simpler reading of SC 2.3.3 is that a chart which appears without transition "is not using animation" (§3.5).

### 2.7 Styling hooks (READ)

- layerchart's components carry `lc-*` classes (`lc-axis-tick-label`, `lc-rect`, `lc-path`, `lc-legend-swatch`, `lc-tooltip-container`) and read a few CSS variables with fallbacks: `--color-surface-content` (text and rules; falls back to `currentColor`), `--color-primary`, `--color-surface-100`/`-200`. The package ships `styles/shadcn-svelte.css`, which maps these to `--primary`, `--card-background`, `--card-muted` and `--card-foreground` on `.lc-root-container` and `.lc-tooltip-root` (the whole file is 14 lines); the stock item does not import it and the comment says it is "not typically needed". Our tokens have no `--card-background`; the mapping would be ours to write, or we set the `lc-*` classes from the container as stock does (`chart-container.svelte` lines 38 to 73), which are arbitrary variants the lint accepts.
- EXECUTED: with no overrides, tick labels computed `fill: rgb(20, 22, 28)` (`foreground`, through `currentColor`) and `font-size: 10px` (layerchart's own; stock sets `text-xs`). The stock `[&_.lc-axis-tick-label]:fill-muted-foreground` gives 8.18:1 on light `card` and 7.17:1 on dark (EXECUTED with `scripts/contrast.ts`; `001` decision 12 rows 49 and 50 agree, since `chart-5` is `muted-foreground`'s colour).

## 3. Chart accessibility

### 3.1 What the rendered chart exposes (EXECUTED: Playwright `ariaSnapshot()` in Chromium)

- Figure A (`BarChart` with legend): `figure` with twelve `img` children, one per axis tick label ("0", "10", …, "Mon", …), then `button "Runs"` (the legend), then a second empty `figure` (the highlight layer). **No bar is exposed**, and the figure has no name.
- Figure B (`Svg title="Runs per day"`): `figure "Runs per day"` with the tick `img`s. The `<title>` names the figure; the bars are still absent.
- The tooltip: after a pointer move over a bar, a `div.lc-tooltip-root` appeared as a child of `<body>` with the text "Thu Runs 41", no `role`, and inline `top`/`left` styles. Nothing opens it from the keyboard (§2.2). Playwright's own `hover()` refused the bar because the tooltip's band hit-rectangle (`rect.lc-tooltip-rect`) sits over the marks; a raw mouse move was needed.
- Tab stops on `/chart`: the one legend button, nothing else. A chart with no legend has no stop.

So a layerchart figure, as rendered, is a named or unnamed picture whose data is reachable only by pointer. The stock item adds no name, description, table or keyboard path (READ: §1.6; `chart-container.svelte` sets no ARIA attribute).

### 3.2 What the sources ask for (READ)

- **WAI tutorial, complex images** (`https://www.w3.org/WAI/tutorials/images/complex/`): a chart needs "a short description that identifies the image, and a long description that conveys its essential information", the long one giving "scales, values, relationships and trends". Three placements: an adjacent link, a location in the `alt`, or `<figure role="group">` with a `<figcaption>` that may hold "headings, text, and a data table with a caption". `aria-describedby` "only works for long descriptions that are text-only".
- **WAI-ARIA Graphics Module 1.0** (`https://www.w3.org/TR/graphics-aria-1.0/`): authors "SHOULD use the `graphics-document` role for structured graphics such as charts, maps, diagrams"; `graphics-symbol` for an atomic mark; `img` "defines a single graphic that is perceived as an indivisible whole". It names `graphics-document document` as the ARIA 1.0 fallback. Assistive-technology support for the graphics roles was not checked (§9).
- **SC 1.4.1 Use of Color** (`https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html`): "This criterion requires a visible alternative to color"; techniques G111 (colour and pattern), G14 (the information also in text); series colours that differ in lightness by 3:1 count as a visual distinction, else "an additional visual indicator will be required".
- **SC 1.4.11 Non-text Contrast** (`001` decision 12): marks need 3:1 against their ground; `chart-3` (amber) fails in light at 1.81 and 1.95 and is the recorded exception, so a light figure using it labels that series directly (`001` lines 398 to 400).
- **SC 2.3.3** (§3.5 below) and **SC 1.4.13** (a hover tooltip must be dismissible, hoverable and persistent; `002`'s tooltip decision cites it).
- The APG has no chart pattern; the nearest is the `meter` pattern for a single value (§6).

### 3.3 Our colours, measured (EXECUTED: `scripts/contrast.ts`)

| Pair | Light | Dark |
|---|---|---|
| `chart-1` on `card` | 5.91 | 6.10 |
| `chart-2` on `card` | 4.30 | 6.46 |
| `chart-3` on `card` | 1.95 (exception) | 8.25 |
| `chart-4` on `card` | 3.45 | 7.65 |
| `chart-5` on `card` | 8.18 | 7.17 |
| `chart-1` against `chart-2` | 1.37 | — |
| `chart-1` against `chart-4` | 1.71 | — |
| `chart-2` against `chart-4` | 1.24 | — |
| `chart-1` against `chart-5` | 1.38 | — |
| `muted-foreground` on `card` (tick labels) | 8.18 | 7.17 |

Every series passes 3:1 on `card` except light amber (`001`'s exception). **No two series colours differ from each other by 3:1**, so by SC 1.4.1's own measure a legend that maps colour to series is not enough on its own: a second cue is needed, such as a label on the mark (`Labels`), a distinct mark per series (bars against a line), a pattern fill, or one series per figure (INFERRED from the table and the Understanding text).

### 3.4 The data table alternative (INFERRED)

The WAI tutorial's `figure` plus `figcaption` with a table is the one placement that carries structure. For an admin page, where the data is already a query result, a `<table>` of the same rows beside or under each chart costs nothing to produce, is the only content a prerender would show (§2.5), and gives keyboard and screen-reader users the numbers the tooltip gives pointer users. Whether it is visible, visually hidden (`sr-only`), or behind a toggle ("Show as table") was left to `004`; visually hidden tables are read by screen readers but help no sighted keyboard user, and a toggle serves both. `004` decision 10 chose the toggle: a `details` "Show as table" after the chart.

### 3.5 Motion (READ)

SC 2.3.3 Animation from Interactions (AAA, `https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html`): "applies when a user's interaction initiates non-essential animation"; honouring the reduce-motion setting is one sufficient way (C39, SCR40); "An element which appears instantly without transitioning is not using animation." A chart drawn on load without motion is outside both 2.3.3 and 2.2.2. A chart that re-draws on a filter click with a tween is 2.3.3's case and must be disablable (INFERRED application).

## 4. Each bits-ui item's accessibility contract

READ from bits-ui 2.20.2's source, then EXECUTED on the scratch page `/bits` and `/popover` in Chromium (`probe.ts`, `aria.ts`).

### 4.1 `popover`

| Aspect | READ (`bits-ui/bits/popover/`) | EXECUTED |
|---|---|---|
| Trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` set only while open and the content has an id, `data-state` (`popover.svelte.js` lines 221 to 240); Enter and Space toggle (212 to 220); `openOnHover` exists with open and close delays (153 to 188) | `button "Fuel" [expanded]`; `aria-controls="bits-c1"` = the content's id |
| Content | `tabindex="-1"`, `data-state`, an inline `style` with `pointer-events: auto; contain: layout style` plus six `--bits-popover-*` variables (324 to 340; `components/popover-content.svelte` lines 72 to 76); **no `role`** | confirmed; `contentRole: null`; the ARIA snapshot shows the paragraph, link and button with no dialog container |
| Focus on open | `trapFocus` default `true`, `loop` always on; `onOpenAutoFocus` is called and can `preventDefault` (`popover-content.svelte` lines 23, 47 to 52, 95 to 101) | focus moved to the first tabbable inside, the link "Learn more"; Tab went Close, Learn more, Close: trapped and looping |
| Escape and outside | `onEscapeKeydown` then `handleClose`; `onInteractOutside` closes unless the target is the trigger or the custom anchor (287 to 314) | Escape removed the content from the DOM, `aria-expanded="false"`, and focus returned to the trigger "Fuel" |
| Portal | `Popover.Portal` renders to `body` by default | the content's wrapper was a child of `<body>` |
| Presence | `PresenceManager` keeps the node while `data-closed` transition attributes run, so `animate-exit` can play (33 to 39, 328) | not timed |

INFERRED: the trigger promises a dialog and the content delivers none. APG's non-modal dialog is `role="dialog"` with `aria-labelledby` the title; the stock `PopoverTitle` is a plain `div`. Our item can set `role="dialog"` on `Content` when a `Title` is present and wire the ids, or keep bits-ui's plain content for a popover that holds one sentence (the fuel note), where a dialog role would be heavier than the content. `004` decision 11 chose the dialog for every popover: `role="dialog"`, named by its title when one is rendered, else by a `label` prop.

### 4.2 `accordion`

| Aspect | READ (`bits-ui/bits/accordion/`) | EXECUTED |
|---|---|---|
| Header | a `div` with `role="heading"`, `aria-level={level}`, default level 2 in bits-ui, 3 in stock (`accordion.svelte.js` 291 to 300; `components/accordion-header.svelte` line 11) | `heading "Item one" [level=3]` holding `button "Item one"` |
| Trigger | a `<button type="button">` with `aria-expanded`, `aria-disabled`, `data-state`, `tabindex` (151 to 164); Enter and Space toggle, other keys go to the roving group (141 to 150); **no `aria-controls`** | `aria-expanded="false"`, `aria-controls` null |
| Content | a `div` with `data-state`, `hidden` when closed (or `hidden="until-found"` with `hiddenUntilFound`, which opens the item on the browser's find-in-page `beforematch`), inline `--bits-accordion-content-height/width` for an animation (252 to 277; 190 to 219); **no `role="region"`, no `aria-labelledby`** | `hidden=""`, `style="--bits-accordion-content-height: 0px; …"`, role null |
| Keyboard among triggers | `RovingFocusGroup` over `[data-accordion-trigger]:not([data-disabled])`: Down and Up (vertical), Home, End, looping by default (`internal/roving-focus-group.js` 43 to 83) | ArrowDown: one, two, three, one; End: three; Enter opened the third: contents `closed/hidden, closed/hidden, open/shown` |
| Single and multiple | `single` holds a string and toggles to `""` (so every item can close); `multiple` holds an array (39 to 72) | Tab stops: each of the three triggers is a stop (`tabindex="0"` on all; roving affects arrows, not Tab) |

APG's accordion pattern asks for `aria-controls` on the button and makes `region` optional (it advises against it with more than six panels) (INFERRED: the pattern was not re-read for this memo). INFERRED: our `AccordionTrigger` and `AccordionContent` can share an id from `$props.id()` inside `AccordionItem` and set `aria-controls` and, if wanted, `role="region" aria-labelledby`, by passing `id` and the attribute through bits-ui's `restProps`. Heading level stays a prop; the stock default 3 suits a section under an `h2`. `004` decision 12 does this: `aria-controls`, and a `region` labelled by its trigger.

### 4.3 `toggle`

READ: `<button>` with `aria-pressed="true|false"`, `data-state="on|off"`, `disabled`, toggled on click (`toggle.svelte.js` 18 to 35; `components/toggle.svelte` line 44); a native button, so Space and Enter work without a key handler. EXECUTED: Space set `aria-pressed="true"`, `data-state="on"`; the ARIA snapshot reads `button "Bold"` (Chromium's snapshot does not print the pressed state, but the attribute was read directly).

INFERRED on the visual state: stock's pressed look is `bg-muted`, which measures 1.20:1 against light `card` and 1.12 against light `background`, 1.16 and 1.31 in dark (EXECUTED with `scripts/contrast.ts`). As the only sign of "on", that is state by a faint tint (R19). A pressed toggle needs a second cue: a `border-foreground` edge, inverted `bg-foreground text-background` (the tooltip's recipe, 16.84), or a check icon. R8 allows `muted` as a selected inset, so `bg-muted` may stay alongside the cue. `004` decision 13 chose the inverted pair.

### 4.4 `toggle-group`

| Aspect | READ (`bits-ui/bits/toggle-group/toggle-group.svelte.js`) | EXECUTED |
|---|---|---|
| Root | `role="group"`, `data-orientation`, `data-disabled` (26 to 33); `type` `single` or `multiple`; `rovingFocus` default `true`, `loop` default `true` (`components/toggle-group.svelte` 13 to 26) | `group` in both snapshots |
| Items, `single` | `<button role="radio" aria-checked>`; `aria-pressed` undefined (95 to 100, 142 to 152); roving `tabindex` 0 on the current stop, −1 elsewhere (105 to 112) | `radio "today"`, `radio "7d" [checked]`, …; `tabindex` 0 on the checked item, −1 on the rest |
| Items, `multiple` | `<button aria-pressed>`, no `role` | `button "a"`, `aria-pressed="false"`; also roving (one Tab stop for the group) |
| Keys | Enter and Space toggle; arrows, Home and End move focus through the roving group (126 to 137); selecting an item makes it the tab stop (46 to 54) | from "7d", ArrowRight moved focus to "30d" without selecting it; Space then made "30d" checked and the stop, and "7d" unchecked. Tab stops on the page: one per group |

INFERRED: for a time-range preset, `single` with roving focus is the right shape (one stop, arrows to browse, Space to apply). Two things differ from APG's radio group: the root is `group` rather than `radiogroup`, and arrows move without selecting. Our `Root` can pass `role="radiogroup"` through `restProps` when `type="single"`; arrow-selects would need our own key handler, which is not worth it when selection changes a whole page's query (a user browsing presets should not fire a fetch per arrow press). Selected state needs the same second cue as the toggle (§4.3): a preset strip with only `bg-muted` on the active item tells by a 1.20:1 tint. `004` decision 13 keeps bits-ui's `group` role and its browse-then-select keys, and inverts the checked item.

### 4.5 `scroll-area`

| Aspect | READ (`bits-ui/bits/scroll-area/`) | EXECUTED |
|---|---|---|
| Viewport | a `div` with inline `overflow-x`/`overflow-y: scroll` or `hidden` per enabled scrollbar (`scroll-area.svelte.js` 73 to 81), wrapping a content `div`; a global stylesheet hides the native bar: `scrollbar-width: none !important` and `::-webkit-scrollbar { display: none }` (`components/scroll-area-viewport.svelte` 34 to 43); **no `tabindex`**, no role | `tabindex` null, `overflow: hidden scroll`, `scrollbar-width: none`. Tab still landed on the viewport and two ArrowDowns scrolled it 50 px: Chromium makes an overflowing scroller a focus stop when it has no focusable child (its keyboard-focusable-scrollers behaviour). Other engines were not run |
| Scrollbar | `type` `hover` (default), `scroll`, `auto`, `always`; with `hover` the bar mounts on pointer enter and unmounts after `scrollHideDelay` 600 ms (123 to 160); the thumb is dragged by pointer, with the ratio from viewport and content sizes (124 to 190) | not in the DOM at rest; on hover a 10 × 190 px bar (stock `w-2.5` plus `p-px`) with an 8 × 37 px thumb |
| Native alternative | — | a `div.overflow-auto` with `[scrollbar-color:var(--input)_var(--muted)] [scrollbar-width:thin]` and `tabindex="0"` computed `scrollbar-color: rgb(124, 128, 139) rgb(234, 234, 231)` and `scrollbar-width: thin`, and scrolled 52 px on two ArrowDowns |

Against our rules: the hover-only 10 px bar with an 8 px thumb is a pointer target far under R21's 24 px, and it is invisible until hovered, so touch and keyboard users never see where they are (INFERRED). The native box's thumb `input` on track `muted` measures 3.27:1 in light and 3.31 in dark (EXECUTED), meeting SC 1.4.11 for a control, and the arbitrary properties hold no literal, so the lint accepts them (the `holdsLiteral` test finds no length, hex, colour function or named colour in `var(--input)`); a `@utility` in `pluto-theme` would read better. `scrollbar-color` and `scrollbar-width` computed as set in Chromium (EXECUTED, above); Firefox and Safari were not checked for this memo (§9). The primitives memo already marked `scroll-area` "may be dropped" (line 356).

## 5. Popover's chrome

### 5.1 Stock against ours

Stock `PopoverContent` (§1.3): `bg-popover text-popover-foreground … ring-foreground/5 ring-1 shadow-2xl rounded-2xl p-4 gap-4 text-sm duration-100 w-72`, ten `tw-animate-css` classes, `outline-hidden`, `z-50`. The hairline is a 5% translucent ring and the depth a Tailwind preset shadow.

Ours, by `002` decisions 3, 7 and 8 and the primitives memo line 142: `bg-popover text-popover-foreground border border-elevation-line shadow-elevation rounded p-4 gap-4 text-sm z-50`, entrance `animate-enter` (and `data-closed:animate-exit` if the exit is wanted; bits-ui keeps the node while `data-closed` runs), no outline classes (the global `:focus-visible` rule), a ladder width.

Decision 7's `shadow-elevation` is `0 0 0 var(--line-width) var(--elevation-line), 0 0.75rem 2rem 0 var(--elevation-shadow)`; it already draws the hairline as a spread shadow, so a `border border-elevation-line` on top would draw it twice, once inside the box and once outside (INFERRED from `src/app.css` at `v0.3.0` lines 156 to 158). The scratch panel used both and looked like one edge in the screenshots; decision 7's reasoning ("the edge then sits outside the surface's box") points to the shadow alone. `004` decision 11 takes the shadow alone, with no border.

### 5.2 Elevation seen in Chromium (EXECUTED)

The scratch page `/popover` placed a `bg-popover … shadow-elevation` panel inside a `card` and another on the page ground, in light and dark (`shots/elevation-light.png`, `elevation-dark.png`, `popover-open-light.png`).

- **Light.** The computed shadow was `rgba(20, 22, 28, 0.1) 0 0 0 1px, rgba(20, 22, 28, 0.16) 0 12px 32px 0`. Pixels on the card at the panel's horizontal centre: 6 px under its bottom edge `rgb(230, 231, 232)`, 40 px under `rgb(254, 254, 254)`; the card itself is `#FFFFFF`. The screenshot shows a soft grey plume under and around each panel, darker below than above, and a faint hairline edge; the panel on the white card reads as lifted, the panel on the off-white ground as well. The open popover (anchored under "Fuel", 256 px wide, the link with its blue focus ring) sits over the card with the same plume.
- **Dark.** The computed shadow was `rgb(120, 124, 138) 0 0 0 1px, rgba(0, 0, 0, 0) 0 12px 32px 0`: the second layer is `clear`. The pixel at the panel's top edge was `rgb(120, 124, 138)` = `elevation-line` (`#787C8A`); the card 6 px and 40 px under the panel was `rgb(30, 33, 41)` = `card`, unchanged. The screenshot shows a crisp grey hairline around each panel and no plume, on a ground one step lighter than the page. That is decision 7's "hairline plus the raised ground".

A menu with no scrim is what decision 28 asked `004` to test; the panel on `card` is that case, and in light the edge is the 10% hairline plus a shadow whose nearest pixels sit about 24 levels under white (INFERRED from the sample; a formal contrast of a gradient is not defined).

### 5.3 Widths on the ladder (EXECUTED: `lintText` on each class)

| Class | px | L7 |
|---|---|---|
| `w-64`, `w-72`, `w-80`, `w-96`, `w-48`, `w-56`, `w-40`, `w-32` | 256, 288, 320, 384, 192, 224, 160, 128 | **off the ladder** |
| `w-24`, `w-16`, `w-12`, `w-8` | 96, 64, 48, 32 | ok |
| `w-3xs`, `w-2xs`, `w-xs`, `w-sm`, `max-w-xs`, `max-w-sm` | 256, 288, 320, 384 (Tailwind 4's container scale) | ok (`SIZE_KEYWORDS`) |
| `min-w-48`, `min-w-32` | 192, 128 | off |
| `min-w-24` | 96 | ok |
| `h-2`, `h-1`, `size-4`, `size-6`, `size-16` | 8, 4, 16, 24, 64 | ok |
| `h-10`, `h-2.5`, `w-2.5`, `size-2.5` | 40, 10, 10, 10 | off |

So a popover's width is `w-3xs` (256 px, close to stock's 288) or `w-xs` (320 px), or a `max-w-*` keyword with the content setting the width; a chart tooltip's `min-w-32` becomes `min-w-24` or `min-w-3xs`; the stock legend swatch `size-2.5` becomes `size-3` (12 px, on the ladder) or `size-4`; an icon-sized indicator is `size-2` (8 px).

## 6. A fuel meter

### 6.1 Semantics (READ)

- **WAI-ARIA 1.2, role `meter`** (`https://www.w3.org/TR/wai-aria-1.2/#meter`, extracted from the downloaded HTML): "An element that represents a scalar measurement within a known range, or a fractional value. See related progressbar." "Authors SHOULD NOT use the meter role to indicate progress; the progressbar role exists to address that need." Required: `aria-valuenow`; supported: `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-label`, `aria-labelledby`; defaults 0 and 100; "Accessible Name Required: True"; "Children Presentational: True"; "Related Concepts: `<meter>` in HTML". It notes no ARIA counterpart yet for `low`, `optimum` and `high`.
- **APG meter pattern** (`https://www.w3.org/WAI/ARIA/apg/patterns/meter/`): "A meter is a graphical display of a numeric value that varies within a defined range", with a battery or fuel level as the example; "The meter should not be used to indicate progress, such as loading or percent completion of a task. To communicate progress, use the progressbar role instead." Keyboard: "Not applicable." `aria-valuetext` when "a percentage alone would not be clear"; name by `aria-labelledby` from a visible label, else `aria-label`.
- **MDN `<meter>`** (`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter`): attributes `value`, `min` (0), `max` (1), `low`, `high`, `optimum`; implicit role `meter`, no other role permitted; it is labelable, so `<label for>` names it. WebKit pseudo-elements `::-webkit-meter-bar`, `::-webkit-meter-inner-element`, `::-webkit-meter-optimum-value`, `::-webkit-meter-suboptimum-value`, `::-webkit-meter-even-less-good-value`; Firefox's `::-moz-meter-bar` is not on that page but is documented elsewhere on MDN (not re-read; §9).
- **a11ysupport.io**: `/tech/aria/meter_role` and `/tests/tech__aria__meter_role` returned 404, and the `/tech/aria/` index page held one link and no role list when fetched without JavaScript (EXECUTED: curl). Assistive-technology support for `meter` is therefore **unknown** from that source.
- **bits-ui `Meter`** (`bits-ui/bits/meter/meter.svelte.js` 17 to 28): a `div` with `role="meter"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `data-value`, `data-min`, `data-max`; no `aria-valuetext`, no name, no fill element. It is 29 lines; an app would add the name, the text and the bar.

Fuel used of a cap is a measurement in a known range, so the role is `meter` (READ, both sources). A run panel writes it as "Fuel: 4.81 billion instructions of 30 billion", with a tooltip or popover on "Fuel" (INFERRED: the need as put to this memo).

### 6.2 Styling with tokens (EXECUTED: `/meter` in Chromium and WebKit)

The scratch page held a native `<meter min="0" max="30" value="4.81">` with `appearance: none`, `background: var(--muted)`, `::-webkit-meter-bar { background: var(--muted) }`, `::-webkit-meter-optimum-value { background: var(--primary) }`, `::-moz-meter-bar { background: var(--primary) }`, `border-radius: var(--radius)`, 8 px high (`h-2`), labelled by `<label for="fuel">Fuel</label>`; and a `<div role="meter" aria-valuemin="0" aria-valuemax="30" aria-valuenow="4.81" aria-valuetext="4.81 billion instructions of 30 billion" aria-labelledby>` holding a `bg-muted` track and a `bg-primary` fill (its width an inline percentage, the one `style` a token-only meter cannot avoid unless the fill is a token-stepped class or a CSS variable set by a `style:` directive, which the lint also flags).

| Engine | `<meter>` computed | Pixel in the filled part | Pixel in the empty part | ARIA snapshot |
|---|---|---|---|---|
| Chromium | `appearance: none`, background `rgb(234, 234, 231)` (`muted`), 8 × 384 px, `labels.length` 1 | `rgb(36, 86, 230)` = `primary` | `rgb(234, 234, 231)` | `meter "Fuel": 4.81 billion instructions of 30 billion` |
| WebKit | the same | the same | the same | the same |
| Both, the `div` | — | — | — | `meter "Fuel"` (`aria-valuetext` set; the snapshot format does not print it) |

Both engines honoured `appearance: none` and painted the pseudo-elements with our tokens; the screenshots show a flat 8 px rounded track in `muted` with a `primary` fill at 16% in both, identical to the `div` under it. Firefox was not run. The text beside it ("Fuel: 4.81 billion instructions of 30 billion") says the numbers, so the fill is never the only sign (R19); `primary` on `muted` measures 4.90 (light) and 5.22 (dark) (EXECUTED), above the 3:1 a non-text mark needs.

A `<meter>` lets the lint pass: its value is an attribute, not a style; a `div` meter needs a `style` width. `h-2` is on the ladder. R21 does not apply: a meter is not a pointer target. The amber `caution` colour is not needed: a run near its cap is a number, not a warning; `002`'s `alert` handles the "Stopped: out of fuel" outcome (INFERRED).

## 7. An analytics page's needs mapped to parts (INFERRED)

The general need: an admin page that reports a product's traffic and its runs, filtered by a time range and by any row, beside a home page that shows one run's fuel and a security section.

| Need | Parts | Owner |
|---|---|---|
| Visitors and page views per hour or per day | one `chart` figure per measure, or bars for one and a line for the other so the two series differ by mark, not colour (§3.3); `Axis` with a time scale; a table alternative (§3.4) | `004` gives the figure and table recipe; a consuming app composes |
| Outcomes (ok, error, fuel cap, …) | a horizontal bar chart of categories, one colour, each bar labelled with its count (`Labels`) | a consuming app, on `004`'s recipe |
| Fuel, memory and wall-time histograms on log buckets | an app bins (`d3-array` `bin` with log thresholds, or SQL buckets), `Bars` draws; axis tick format for the log buckets | a consuming app |
| Time-range presets (today, yesterday, 7 d, 30 d, this month, 12 months, custom) | `toggle-group` `single` (§4.4), one Tab stop; a custom range is `native-select`, since this registry serves no `range-calendar` | `004` gives the item; a consuming app the presets |
| Click any row to filter the page | `table` rows as buttons or links with `aria-pressed`/`aria-current`, a visible "Filtered by" chip naming the value, with a remove button (`badge` carries no action; a `button` `secondary sm`, `002` decision 19) | a consuming app; no new item |
| Sources expand to hosts and paths | `collapsible` rows, not `accordion` | `002` already serves it |
| A real-time "now" tile | text, `role="status"` polite | a consuming app |
| A fuel note on a home page | `popover` on "Fuel" (§4.1), or `tooltip` for two sentences without a link | `004` gives `popover` |
| Security detail on a home page | `accordion` with `level` matching the page outline (§4.2) | `004` gives `accordion` |
| Long run output | `code-block`'s own scroll, or a native `overflow-auto` with the scrollbar tokens (§4.5) | `004` decision 1 does not serve `scroll-area` |

## 8. Recommendation (INFERRED)

This committed us to nothing; `004` made the choices (decisions 10 to 14).

1. **Serve `chart` as a container plus a tooltip, colours by token class or `var()` prop, never by an injected `<style>`.** Drop `chart-style.svelte` and the `color`/`theme` half of `ChartConfig`; keep `label` and `icon`. The container sets `[&_.lc-axis-tick-label]:fill-muted-foreground`, `[&_.lc-text]:text-xs`, `[&_.lc-rect]:stroke-0` (against the black stroke), and wraps a `<figure>` with a required `label` (as `aria-label` on the `<svg>` or a visible `<figcaption>`) and a slot or prop for the data table. The tooltip panel is `bg-popover text-popover-foreground border border-elevation-line shadow-elevation rounded px-3 py-2 text-xs min-w-24`, its indicator a `size-2` token-class square per series. Pin `layerchart` 2.9.2 in the item's dependencies.
2. **No chart motion.** Leave `motion` undefined; a figure appears complete. If `004` wants a tween on data change, it reads `prefers-reduced-motion` itself and caps the duration at `--motion-micro`'s 200 ms.
3. **Series by mark or label, not colour alone.** One series per figure where the data allows; otherwise bars against a line, or `Labels` on the marks; amber labelled directly in light (`001`).
4. **`popover`**: decision 7's chrome, `w-3xs` default, `animate-enter`, `sideOffset={4}`; `role="dialog"` with `aria-labelledby` when a `Title` is rendered. **`accordion`**: add `aria-controls`; heading level a prop; `bg-muted` on the open item dropped (R8); icons `CaretDown`/`CaretUp` from `phosphor-svelte` at `size-4`. **`toggle`** and **`toggle-group`**: `h-12`/`h-8` with `min-w-12`/`min-w-8`, `rounded`, pressed state with a second cue; `role="radiogroup"` for `single`. **`scroll-area`**: drop it; give `pluto-theme` a `scrollbar` utility (`scrollbar-color: var(--input) var(--muted); scrollbar-width: thin`) and document `overflow-auto` plus `tabindex="0"` with a label as the pattern (as `002`'s `table` already does).
5. **The fuel meter is a native `<meter>`** item: `appearance-none`, the track `bg-muted`, the fill `primary` through the WebKit and Gecko pseudo-elements in `pluto-theme` CSS (tokens through `var()`), `h-2 rounded w-full`, named by a visible `<label>`, with the numbers written beside it and `aria-valuetext` passed through when an app gives one. A `MeterText` or the `label` prop renders "4.81 billion instructions of 30 billion". bits-ui's `Meter` adds nothing a `<meter>` lacks.

Where `004` differs from these five: neither panel has a border (decision 11, §5.1); the accordion turns one `CaretRight` (decision 12); the toggle group keeps bits-ui's `group` role (decision 13); and the meter has square ends (decision 14).

## 9. What this memo does not settle

- **Assistive-technology support** for `role="meter"`, `<meter>`, the Graphics ARIA roles and `role="figure"` on an SVG. a11ysupport.io could not be read. Chromium's and WebKit's accessibility trees expose the meter correctly. No screen reader has been run; the tests prove the DOM contract. Screen readers are outside this release's checks (`decisions.md`, "After the public-readiness review").
- **Firefox**: `::-moz-meter-bar` with tokens, `scrollbar-color`, and whether an unfocusable scroll viewport is reachable by keyboard. Firefox was not run for this memo, and it is outside this release's checks (the same entry).
- **Safari**: its keyboard-focusable scrollers and its support for `scrollbar-color` were not checked. Safari is outside this release's checks (the same entry).
- **layerchart's canvas layer** (`Canvas` instead of `Svg`) for large series: its colour handling would differ (no classes on canvas). It was not run; `004`'s chart page composes the `Svg` layer only.
- **`fill="var(--chart-1)"` as a presentation attribute** resolved in Chromium. This release checks Chromium only. The class route (`fill-chart-1`) is plain CSS and carries no such doubt.
- **A formal contrast rule for a shadow's edge** in light, where the hairline is 10% ink and the plume a gradient. None is defined. `002` decision 28 asked for the test; §5.2 gives pixel samples, and `004` criterion 21 reads the computed shadow layers in both themes.
- **The live stock registry** against the clone at `6149e14`: answered at build. 0 of the 8 live JSON files differed on 2026-10-31 (`004` Landing notes, item 4).
- **`hidden="until-found"`** on accordion content (find-in-page opens the item): `004` decision 12 does not use it, and its support across engines was not checked.

**In one line:** the six stock items fail the lint 63 times and all take `002`'s recipes, with `popover` taking decision 7's elevation (seen working in both themes) and `scroll-area` better replaced by a native box with scrollbar tokens; layerchart 2.9.2 paints series from token classes or `var()` props with no `style` attribute, costs about 125 KB gzipped on a two-chart page, draws nothing on the server and animates only when asked, and leaves a chart's data invisible to keyboard and screen-reader users, so `004` owes each figure a name and a table; and the fuel meter is a native `<meter>` on `muted` and `primary` with its numbers written beside it.
