# 011 — The brand

- **Status:** built, reviewed and released in `v0.11.0` with `009` to `012` (2026-11-07). Change review: [`../reviews/011-the-brand-pr-2026-11-07.md`](../reviews/011-the-brand-pr-2026-11-07.md) (0 High, 1 Medium, 6 Low, all fixed or answered). Its specification review is [`../reviews/011-the-brand-spec-2026-11-06.md`](../reviews/011-the-brand-spec-2026-11-06.md) (2 High, 9 Medium, 8 Low, each answered below).
- **Date:** 2026-11-06; revised 2026-11-07 after review.
- **Author:** the design lead
- **Kind:** new values for the colour primitives and four theme roles; one new primitive; new tokens and utilities in `pluto-theme` (fields, glass, a poster step, a spring ease); new values for the lockup; one new expressive-only item, `liquid-glass`; two lint rules; preview sections and tests. No new package.
- **Depends on:** [`009`](./009-expressive-mode-and-the-brand-slots.md) and [`010`](./010-the-stage-compositions.md), _built, uncommitted, never released_: the owner ships `009` to `012` together as 0.11.0 (`decisions.md`, "One release, 0.11.0", 2026-11-07). Against `v0.8.0` (`6fbdf99`), every visible change is listed under decision 12.
- **Research it stands on:**
  - [`../research/2026-11-06-from-beige-computing-to-liquid-glass.md`](../research/2026-11-06-from-beige-computing-to-liquid-glass.md) (the light memo: the canvas, the surfaces, the glass recipe, measured);
  - [`../research/2026-11-01-how-the-four-colours-are-tuned.md`](../research/2026-11-01-how-the-four-colours-are-tuned.md) and its JSON (the colour memo: Deep Field);
  - [`../research/2026-11-01-the-identity-options.md`](../research/2026-11-01-the-identity-options.md) (K3's and J4's wording);
  - [`../research/2026-11-06-phosphor-icons-and-the-product-icon-tile.md`](../research/2026-11-06-phosphor-icons-and-the-product-icon-tile.md) (the field legends only).
- **Design calls:** `../decisions.md`: "The identity: the owner's first answers", "The identity: round two answered" (2026-11-06), and "One release, 0.11.0, and the calls of the `011` and `012` spec reviews" (2026-11-07).

## Intent

The owner has chosen the identity. `009` built the slots; this specification fills them.

After it lands, an app that installs `pluto-theme` gets the Pluto brand: Deep Field's four colours on a warm off-white canvas and a warm graphite, flat product screens, the closer lockup, and the tools an expressive page needs to be on brand: flat colour fields, liquid glass, a poster headline for launches, and a spring for the dots.

`012` then rebuilds `010`'s compositions on these tools and removes the stage. This specification changes no composition.

**Terms of art.**

- The **canvas** is the page's ground: `background`.
- **Graphite** is the dark theme's canvas, a warm near-black.
- A **colour field** is a flat area of one brand colour that holds text: the four colours' owned moment (question C2).
- **Liquid glass** is a translucent, blurred panel with a lit rim, laid over a field or the canvas (question I9).
- A **lens** is an SVG displacement filter that bends what the glass shows.
- A **specular rim** is the bright spot on the glass's edge where light catches it; here it follows the pointer.
- A **spring** ease is a timing curve with a small overshoot, as a physical spring settles (question J4).
- `linear()` is the CSS easing function that draws a curve through listed points.

**Not here:** any change to a composition (`012`); the product icons (G5, their own specification); a signature device (F, left out); a change to the faces (D1, kept).

## Decisions

### 1. Scope

| Item or file | Change |
|---|---|
| `tokens/pluto.tokens.json` | primitives (decision 2); dark `background`, `sidebar` (decision 3); light `elevation-line`, `elevation-shadow`, `groove-light` (decision 4); `expressive.radius.pill` removed (decision 5); `mark` (decision 7); `expressive.field`, `expressive.glass`, `expressive.display.steps.poster`, `expressive.motion.spring`, `expressive.motion.light` (decisions 6, 8, 9, 10); `contrast.field`, `contrast.glass`, `contrast.forbidden` (decision 11) |
| `scripts/tokens.ts` | validates the new shapes (each written below); `pill` leaves the validator; `display.steps` takes four steps |
| `scripts/build-tokens.ts` | emits them (decisions 5 to 10) |
| `scripts/contrast.ts` | the `field` and `glass` sets: a theme-aware composite over a field |
| `scripts/lint-literals.ts` | L22's list grows; L23 (decision 10); L24 (decision 8) |
| `registry.json` | one new item, `liquid-glass` |
| `four-dot` | the lockup's mark scales (decision 7); the dots take the spring (decision 10) |
| comments and preview copy | every "pill" said of an expressive action (the review's finding 16 lists them: `cta-band.svelte`, `stage-hero.svelte`, `marketing-bar.svelte`, the `cta-band`, `stage` and `pluto-theme` item pages, the `stage` composition view) is corrected |
| the preview | the `pluto-theme` page's sections (decision 13); a page for `liquid-glass` |
| `package.json` | 0.11.0; no new package |

### 2. The primitives

Every value is measured on the new grounds with `contrast.ts`'s own arithmetic (EXECUTED by the design lead, 2026-11-07, `contrastTable` over a copy of the token file; re-measured by the reviewer).

| Primitive | `v0.8.0` | 0.11.0 | From |
|---|---|---|---|
| `ink` | `#14161C` | `#0B0F17` | Deep Field's ink |
| `ink-soft` | `#4A4F5C` | `#505661` | Deep Field's `inkSoft` |
| `paper` | `#F7F7F4` | `#F3F0E8` | the light memo's W2: warm, still neutral (OKLCH C 0.011) |
| `raised` | `#FFFFFF` | `#FFFFFF` | unchanged |
| `wash` | `#EAEAE7` | `#E9E5DB` | the light memo's `sunk` |
| `line` | `#14161C1A` | `#0B0F171A` | ink at 10%, as today; on the canvas `#DCDAD3`. _Why not the memo's opaque `#D9D3C6`:_ an alpha line reads the same on the canvas, `raised` and `wash`; an opaque one is tuned to one ground. |
| `line-input` | `#7C808B` | `#857E70` | the light memo's input edge |
| `blue` | `#2456E6` | `#2D48D4` | Deep Field |
| `red` | `#E23A2E` | `#C92035` | Deep Field |
| `amber` | `#F0AE12` | `#F19E20` | Deep Field; the owner: "keep it as is, no adjustments" |
| `green` | `#1E9E56` | `#008058` | Deep Field |
| `red-text` | `#C42A1F` | `#C11E31` | Deep Field's `#C81F34`, darkened (below) |
| `green-text` | `#136E3E` | `#007351` | Deep Field's `#007651`, darkened (below) |
| `amber-text` | `#85600B` | `#915B00` | Deep Field |
| `cyan-text` | `#1B709B` | `#1A6C97` | darkened (below) |
| `ink-raised` | `#1E2129` | `#221F19` | the light memo's dark `raised` |
| `ink-wash` | `#2B2D32` | `#2C2821` | a warm wash a step above `ink-raised`, for dark `muted` and `accent` |
| `paper-soft` | `#A9ADB8` | `#A39D90` | the light memo's dark `muted` |
| `paper-line` | `#F7F7F41A` | `#F3F0E81A` | paper at 10%, as today |
| `paper-line-input` | `#787C8A` | `#7A7366` | the light memo's dark input edge |
| `blue-lifted` | `#7A9BFF` | `#93B0FF` | Deep Field |
| `red-lifted` | `#FF7D73` | `#FF9491` | Deep Field |
| `green-lifted` | `#4CC982` | `#60C498` | Deep Field |
| `ink-shadow`, `ink-scrim`, `ink-scrim-deep` | ink at 16%, 50%, 60% | `#0B0F1729`, `#0B0F1780`, `#0B0F1799` | follows `ink` |
| **`graphite`** (new) | — | `#16140F` | the light memo's D1 |

The other syntax primitives (`orange-*`, `purple-*`, `teal-*`, `cyan-lifted`) keep their values.

- **Why three text tones move** (`decisions.md`, 2026-11-07). At Deep Field's own values, `red-text` on its 10% tint over the canvas measures 4.26 and `green-text` 4.34, and green on `muted` 4.49. `#C11E31` and `#007351` pass every row (red on its tint over the canvas 4.50, green 4.51; EXECUTED). `cyan-text` at `#1B709B` reads 4.35 as the property slot on the new `muted`; `#1A6C97` passes. Each is a passing value as close to the old one as was found, not a proven optimum.
- **Why `graphite` is new.** Deep Field separates the text's ink (`#0B0F17`, cool) from the dark ground (`#16140F`, warm). `ink` stays the foreground that sits on light fills (`primary-foreground` on lifted blue, and so on).

**Contrast, as `contrastTable` computes it** (EXECUTED): 100 rows in the two themes; 98 pass; the two recorded exceptions remain, `chart-3` on `background` (1.91) and on `card` (2.17), amber series labelled directly. The 114 code-slot rows of `007` pass; the tightest is `number` (orange) on light `muted` at 4.50. The six scrim rows pass.

| Pair | Light | Dark |
|---|---|---|
| `foreground` on `background` | 16.84 | 16.16 |
| `muted-foreground` on `background` | 6.48 | 6.82 |
| `primary` on `background` | 6.16 | 8.67 |
| `input` on `background` / `card` / `muted` (3:1) | 3.53 / 4.02 / 3.20 | 3.91 / 3.49 / 3.12 |

### 3. The theme roles

- **Dark `background` and `sidebar`:** `ink` → `graphite`.
- Every other role keeps its primitive.
- The light theme's `mark-1` … `mark-4` are the new four. The dark theme's stay `paper` (`008`). Under `data-mode="expressive"` in the dark theme, `--mark-1` … `--mark-4` take the lifted four (`blue-lifted`, `red-lifted`, `amber`, `green-lifted`): a plain rule on `.dark [data-mode="expressive"], [data-mode="expressive"].dark`, emitted with the mode rule (decisions.md, 2026-11-07). After it, `.dark [data-mode="productive"], [data-mode="productive"].dark` sets the four back to `paper`, so a productive island inside an expressive page stays productive (`009` decision 7).
- **The stage of `009`.** Its named slots follow the new primitives; its 21 rows re-measure, all pass (EXECUTED by the reviewer). Its literal slots keep the old palette. `012` removes the stage before release, so none of this ships.

### 4. Flat product screens (I5)

The owner chose I5 for every product screen: "hairlines and flat fields, no shadow, no glass".

- **`shadow-elevation`** is `0 0 0 var(--line-width) var(--elevation-line), 0 0.75rem 2rem 0 var(--elevation-shadow)` (READ, `build-tokens.ts`). In the light theme, `elevation-shadow` → `clear` and `elevation-line` → `line-input`. The second layer stays, transparent, so the utility's shape is unchanged in both themes. _Why `line-input`:_ with no shadow, an overlay is told from the page by its edge alone; the dark theme already does this. It measures 3.53 on the canvas and 4.02 on white.
- **The groove.** The light theme's `groove-light` → `clear`, as the dark theme's already is. `groove`, `groove-s` and `groove-b` then draw the hairline alone. They are used 31 times in item files; none changes its markup.
- **No item's markup changes.**

### 5. Exact shape in expressive mode (H1)

The owner chose H1: "one 8 px case radius; round only for dot shapes." `009` decision 7 made actions pills under `data-mode="expressive"`.

- `[data-mode="expressive"]` sets `--radius-action: var(--radius)`, as productive does. The rule stays, so a later decision can move a value into the mode.
- `expressive.radius.pill` leaves the token file and the validator; `--radius-pill` is no longer emitted. Only the mode rule read it (READ, grep, 2026-11-06).
- `--radius-stage` (14 px) is H1's one exception until `012` removes the rim that reads it, in the same release.

### 6. Colour fields

Four fields, one per brand colour, in the mark's order.

**Tokens.** `expressive.field`:

```json
"field": {
  "light": { "field-1": ["blue", "raised"], "field-2": ["red", "raised"], "field-3": ["amber", "ink"], "field-4": ["green", "raised"] },
  "dark":  { "field-1": ["blue-lifted", "graphite"], "field-2": ["red-lifted", "graphite"], "field-3": ["amber", "graphite"], "field-4": ["green-lifted", "graphite"] }
}
```

Each pair is `[fill, legend]`, both primitives. Emitted as `--field-N` and `--field-N-foreground` in `css[":root"]` and `.dark`.

**Theme copies.** So that what a field holds can get the theme's roles back, the build also emits, in `:root` and `.dark`, `--surface-foreground`, `--surface-muted-foreground`, `--surface-card-foreground`, `--surface-primary`, `--surface-ring` and `--surface-border`: each the theme's own value of the role. A field never sets them.

**`field-1` … `field-4`**, each an `@utility`:

- `background-color: var(--field-N); color: var(--field-N-foreground)`;
- `--foreground`, `--muted-foreground`, `--card-foreground`, `--primary` and `--ring` → `var(--field-N-foreground)`; `--border` → the legend at 24%, as `color-mix(in srgb, var(--field-N-foreground) 24%, transparent)`.
- _Why `--primary` and `--ring`:_ a link in a field's prose and a focus ring drawn on the field must be the legend, the only colour measured on it. The ring on a field then measures as the legend does: 7.02, 5.61, 8.81, 4.96 in light; 8.45 to 8.67 in dark (EXECUTED).

**`surface-plain`**, an `@utility`: re-declares `--foreground`, `--muted-foreground`, `--card-foreground`, `--primary`, `--ring` and `--border` from the `--surface-*` copies. Every opaque surface a field holds carries it: a card, a console, a panel. The `glass` utility includes it (decision 8). _Why a utility and not a rule on `bg-card`:_ the cascade cannot tell an opaque card from a transparent wrapper; the item that paints the ground knows.

**What a field may hold** (review rule R25, decision 12): headings, prose and figures in the field's roles; opaque surfaces carrying `surface-plain`; glass. A control sits on a surface or on glass, never directly on the field. `012` adds the check that makes this a test.

Fields are expressive only (L22). **A field never shares an element with `.dark`:** `.dark` is an unlayered rule and would beat the layered field on the same element (the lesson of `surface-ink`, `build-tokens.ts`). The theme is set on `html` or a wrapper. R25 says so.

### 7. The lockup (E6)

| Token | `v0.8.0` | 0.11.0 |
|---|---|---|
| `mark.dot` | 0.30 | 0.30 (N1: the mark is unchanged) |
| `mark.gap` | 0.08 | 0.08 |
| `mark.lockupScale` (new) | — | 0.87 |
| `mark.rise` | 0.38 | 0.36 |
| `mark.lockupGap` | 0.16 | 0.10 |

- The lockup sets its mark at `0.87em` of the word (`--mark-lockup-size: calc(var(--mark-lockup-scale) * 1em)`): dots of 0.261 em and a gap of 0.07 em of the word, N1's proportion.
- The lift stays `--mark-lift: calc(var(--mark-rise) + var(--mark-dot) + var(--mark-gap))`, in the mark's own em: 0.74 × 0.87 = 0.644 em of the word. The mark's top is 0.644 + 0.261 = 0.905 em above the baseline: the exhibit's E6 (`RISEN.E6`, top 0.90 em; EXECUTED by the reviewer).
- `--mark-lockup-gap` is the flex gap, in the word's em: 0.10.
- The standalone mark is unchanged.
- **The footer endorsement** (`app-shell-footer`, `008`) uses `--mark-lockup-gap` and `--mark-lift` on an unscaled mark. It follows the lockup: its gap goes from 0.16 to 0.10 em and its top from 1.06 to 1.04 em. _Why follow:_ the endorsement is the same signature at a smaller size; two spacings for one signature is the drift N1 guards against. Decision 12 lists it.

### 8. Liquid glass (I9, expressive pages only)

**Tokens.** `expressive.glass`, per theme (the light memo §6.4):

```json
"glass": {
  "light": { "tint": "#F3F0E8DB", "rim": "#FFFFFFCC", "edge": "#0B0F1714", "fallback": "#FBFAF6", "light": "#FFFFFF8C", "shadow": ["#0B0F170F", "#0B0F1747"] },
  "dark":  { "tint": "#16140FD6", "rim": "#FFFFFF1F", "edge": "#FFFFFF14", "fallback": "ink-raised", "light": "#FFFFFF33", "shadow": ["#00000000", "#000000B3"] },
  "blur": 16,
  "lens": { "frequency": [0.008, 0.012], "blur": 6, "scale": 28, "seed": 7 }
}
```

- Emitted per theme as `--glass-tint`, `--glass-rim`, `--glass-edge`, `--glass-fallback`, `--glass-light`, and `--glass-shadow: 0 1px 0 <shadow[0]>, 0 16px 32px -16px <shadow[1]>`; and once as `--glass-blur: 16px`, `--glass-lens-frequency`, `--glass-lens-blur`, `--glass-lens-scale`, `--glass-lens-seed` (unitless).
- `expressive.motion.light`: 600 (ms), emitted as `--motion-light`: how long the rim stays lit after the pointer stops. It joins the reduced-motion block at `0ms`.
- The tint is the memo's decimal alpha as a byte (86% → `DB`, 84% → `D6`). `contrast.ts` composites by the byte; its figures stand (decision 11).

**`glass`**, an `@utility`, which includes `surface-plain`:

- `position: relative; isolation: isolate; background-color: var(--glass-tint); -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur)); border: var(--line-width) solid var(--glass-edge); border-radius: var(--radius); box-shadow: inset 0 1px 0 var(--glass-rim), var(--glass-shadow)`.
- **The specular rim**, its `&::after`: `content: ""; position: absolute; inset: calc(-1 * var(--line-width)); padding: var(--line-width); border-radius: inherit; pointer-events: none; background: radial-gradient(160px circle at var(--glass-x, 50%) var(--glass-y, 0%), var(--glass-light), transparent 70%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); opacity: var(--glass-lit, 0); transition: opacity var(--motion-reveal) var(--ease-standard)`. The mask keeps only the border ring, so the light falls on the glass's edge and never on its text. The prefixed pair comes first and the standard `mask` last: Firefox reads `-webkit-mask` as `mask`, so the reverse order undoes the mask (EXECUTED by the reviewer in Chromium, WebKit and Firefox). _Why:_ the owner chose "a rim highlight that moves only with the pointer" (I9); an area glow over the face measured 1.74 to 2.90 on text (review finding 2, EXECUTED).
- **The opaque fallback.** Plain rules, printed after the utility: `.glass { background-color: var(--glass-fallback); -webkit-backdrop-filter: none; backdrop-filter: none }` under `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` and under `@media (prefers-reduced-transparency: reduce)`; under `@media (forced-colors: active)` the same plus `border-color: CanvasText`. A plain rule after an `@utility` wins (EXECUTED by the reviewer, Tailwind 4.3.3).
- **The lens rule** is wrapped so no preference can lose to it: `@media (prefers-reduced-transparency: no-preference) and (prefers-reduced-motion: no-preference) and (forced-colors: none) { :root[data-glass-lens] .glass { backdrop-filter: url(#pluto-glass-lens) blur(var(--glass-blur)) } }`. A browser that does not know `prefers-reduced-transparency` fails `no-preference`, the safe side.
- **The radius is the case radius**, 8 px. H1: no pill glass.

**What glass may hold.** Text in `foreground`, `muted-foreground` and `primary` (the roles `surface-plain` restores). Red, green and amber text never sit on glass (3.70; memo §6.4). A glass element never has a glass ancestor (decisions.md, 2026-11-07). Dark glass never lies over a light-theme ground, a `paper` or `raised` surface, or an image: muted text there measures 4.39 over paper and 4.21 over white (EXECUTED, the spec reviews). In the dark theme every field is a lifted fill, and dark glass over it is measured (decision 11).

**`liquid-glass`**, a new `registry:ui` item; `meta.modes: ["expressive"]`; `meta.since: "0.11.0"`; group `foundation`; `registryDependencies: ["pluto-theme", "read-token"]`. Two exports:

- **`pointerLight`**, a Svelte attachment (`{@attach pointerLight}`). On `pointermove` it sets `--glass-x`, `--glass-y` (percent of the element's box) and `--glass-lit: 1` with `element.style.setProperty`; `readDuration("motion-light")` after the last move it sets `--glass-lit: 0`. Under `prefers-reduced-motion: reduce`, read on mount and on change, it sets nothing. _Why J2 holds:_ the rim moves only while the visitor's pointer does.
- **`GlassLens`**, a component rendered once per page. It renders `<svg width="0" height="0" aria-hidden="true" focusable="false" class="pointer-events-none absolute">` holding one filter, `id="pluto-glass-lens"`: `feTurbulence` (fractal noise; base frequency, one octave and seed from the `--glass-lens-*` tokens), `feGaussianBlur` (`--glass-lens-blur`), `feDisplacementMap` (`--glass-lens-scale`, channels R and G). It reads the tokens with `readToken` on mount, so the filter is client-rendered. On mount it sets `data-glass-lens` on `document.documentElement` when the browser exposes `navigator.userAgentData` (a Chromium engine), and removes it on destroy. Every preference is the cascade's (above). _Why Chromium only:_ WebKit draws a `url()` backdrop filter wrongly (the light memo §3.5); the frosted glass passes everywhere without it.

**L24, the one style write.** The literal lint flags `.style` and `style:` (READ, `lint-literals.ts`). L24 allows exactly `.style.setProperty("--glass-` in `liquid-glass`'s `pointer-light.ts`, and nothing else. `literals.test.ts` gains a passing sample there and a failing sample in any other file.

### 9. The poster step (K3)

A fourth display step, for launch moments only (K3: "reserved for launches and campaigns").

```json
"poster": { "minPx": 56, "vw": 12, "maxPx": 160, "lineHeight": 0.9, "tracking": -0.05, "weight": 600 }
```

- `@utility type-poster`, built as `009`'s steps are. `display`, `section` and `proof` keep their values.
- L22 adds `type-poster`.

### 10. The spring (J4, the dots only)

**Token** `expressive.motion.spring`: `{ "dampingRatio": 0.65, "settle": 0.002, "samples": 32 }`.

**`--ease-spring`**, emitted by the build as a `linear()` function: the step response of a damped spring, x(t) = 1 − e^(−ζωt)(cos(ω_d t) + (ζ / √(1 − ζ²)) sin(ω_d t)), with ζ the damping ratio, ω_d = ω√(1 − ζ²), and ωT = ln(1 / settle) / ζ ≈ 9.56. Sampled at 33 evenly spaced times from 0 to T, each value rounded to four decimals, the last set to exactly 1. Its maximum is 1.068 (EXECUTED by the reviewer).

**Where it is used.**

- **The entrance** splits into two keyframes per dot, with the same duration, delay and fill: `pluto-mark-dock` (the transform only, `animation-timing-function: var(--ease-spring)`) and `pluto-mark-fade` (the opacity only, `var(--ease-entrance)`). Written as longhands, so an engine without `linear()` falls back to the initial `ease` for the dock instead of dropping the animation. _Why two:_ an animation has one timing function, and colour and light never bounce (J4's wording).
- **The reveal** (a transition) lists `transition-property: opacity, transform` and `transition-timing-function: var(--ease-entrance), var(--ease-spring)`.
- Durations are unchanged (`--motion-entrance` 900 ms; `--motion-micro` 200 ms). The reduced-motion rule (`animation: none`, durations 0) is unchanged.

**L23, springs are for dots.** The text `ease-spring` fails in any file of an item other than `four-dot` and `pluto-theme`. A later dot-made item joins the list by a specification.

**Browser support** (READ, MDN, `linear()` easing function, read 2026-11-06): Chromium 113, Firefox 112, Safari 17.2. An older engine runs the dock on `ease`; the reveal's whole timing list is then invalid at computed-value time, so both of its entries fall back to `ease`.

### 11. Contrast rows

Shapes:

```json
"field": [{ "theme": "light", "field": "field-1" }, …],
"glass": [{ "theme": "light", "text": "foreground", "over": "background" }, …]
```

- **`field` set:** for each theme and field, the legend on the fill (text, 4.5) and the legend as a ring on the fill (non-text, 3). Measured (EXECUTED, the spec review): light 7.02, 5.61, 8.81, 4.96; dark 8.67 (field-1), 8.67 (field-2), 8.45 (field-3, amber `#F19E20`), 8.62 (field-4).
- **`glass` set,** composite rows read against the theme's tint: `text` ∈ {`foreground`, `muted-foreground`, `primary`} (the `--surface-*` values), `over` ∈ {`background`, `field-1` … `field-4`, `foreground`} in light (18 rows) and {`background`, `field-1` … `field-4`} in dark (15 rows), minimum 4.5. Lowest, by the byte (EXECUTED by the reviewer): light 12.43, 4.78, 4.55; dark 12.06, 5.09, 6.47.
- **Glass, lit.** No text sits under the rim (decision 8), so the lit rim adds no text row. The criterion checks the mask instead.
- **Glass fallback:** `foreground`, `muted-foreground` and `primary` on `--glass-fallback`, both themes, 4.5 (light 18.36, 7.06, 6.72; dark 14.42, 6.08, 7.74; EXECUTED, the spec reviews).
- **Ring on glass:** `--surface-ring` on the glass over each ground, 3:1 (non-text).
- **The forbidden rows** (`001` decision 8) keep their pairs as a rule (decisions.md, 2026-11-07). The light row, now 4.08, is the measured witness and must stay below 4.5. The two dark rows (4.62, 4.65) move to a `ruleOnly` list that the test reads without a ratio.

### 12. What changes against `v0.8.0`, and the review rules

**Visible changes for an installed app that updates `pluto-theme` or `four-dot`** (the changelog's 0.11.0 entry lists each):

1. every colour of decision 2, in both themes, and the dark ground;
2. overlays in the light theme lose their shadow and gain an input-strength edge (decision 4);
3. grooves lose their white highlight line in the light theme (decision 4);
4. the lockup's mark is 87% of its old size, closer to the word and lower; the footer endorsement's spacing follows (decision 7);
5. the mark's dots overshoot slightly as they land (decision 10).

No prop, slot, export or class name of a shipped (`v0.8.0`) item changes.

**R25, fields and glass** (joins `002` decision 9's checklist): fields and glass only in an expressive item; a field holds text in its roles, `surface-plain` surfaces and glass, never a control directly; glass never inside glass; glass text in `foreground`, `muted-foreground` and `primary` only; a field never on the element that carries `.dark`; dark glass never over a light-theme ground, `paper`, `raised` or an image.

### 13. The preview

- The `pluto-theme` page's swatches follow the token file.
- Its "Expressive mode" section gains: the four fields, each with a heading, a paragraph with a link, and a `Card` carrying `surface-plain`; glass over the canvas and over each field, with `pointerLight` and the lens; a `type-poster` line; the mark entering with the spring (a button replays it).
- `liquid-glass` gets its page. The registry grows from 74 to 75 items.
- The identity exhibit (`/identity`) is research and keeps its own values.

### 14. The documents

- `CHANGELOG.md`: the 0.9.0 and 0.10.0 entries fold into one 0.11.0 entry (decisions.md, 2026-11-07), which lists decision 12's five changes. `meta.since` reads `"0.11.0"` on every item `009` and `010` added. `static/v0.9.0/` and `static/v0.10.0/` are deleted.
- R25 joins `002` decision 9's checklist.
- `context/handoff.md`, replaced at release.

## Acceptance criteria

1. The token file validates with decisions 6, 8, 9 and 10's shapes; `bun run build:tokens` emits decision 2's values, `graphite`, and every variable of decisions 6, 8, 9 and 10 into `pluto-theme`'s `css`; `--radius-pill` is not emitted; a unit test reads each from the emitted `src/app.css`. (unit)
2. `contrastTable`: 98 pass and exactly the two recorded exceptions; the 114 code-slot rows pass, tightest `number` on light `muted` at 4.50; the six scrim rows pass. (unit)
3. The `field` set's 16 rows, the `glass` set's 33 rows, the fallback's 6 rows and the ring-on-glass rows pass their minimums; the forbidden light row is below 4.5 and the two dark pairs sit in `ruleOnly`. (unit)
4. Light theme, on an open `popover`, `dropdown-menu` and `dialog` content: the first `box-shadow` layer's colour is `#857E70` and the second layer's alpha is 0. A `groove-b` element's box-shadow colour has alpha 0. (e2e)
5. The lockup at 100 px: the mark's dots measure 26.1 px (±0.5); from the right edge of a `Range` over the word's text node to the mark's left edge is 10 px (±0.5); the mark's top sits 90.5 px (±1) above the baseline. The standalone mark's dots measure 0.30 em. The footer endorsement's gap is 0.10 em of its text. (e2e)
6. `--ease-spring` is a `linear()` of 33 points, maximum above 1.06, last point 1; a unit test recomputes it from the token. At load, each of the four dots runs two animations, `pluto-mark-dock` with timing `linear(…)` and `pluto-mark-fade` with `--ease-entrance`'s curve; under reduced motion none; after a client navigation none. The reveal's computed `transition-timing-function` lists the entrance curve, then `linear(…)`. (unit and e2e)
7. `rounded-action` measures 8 px under `data-mode="expressive"`. L22 fails `type-poster`, `field-1` … `field-4`, `surface-plain` and `glass` in a productive item and passes them in an expressive-only item; L23 fails `ease-spring` outside `four-dot` and `pluto-theme`; L24 passes its one allowance and fails the same call elsewhere. The registry lints with zero violations and zero exceptions. (unit)
8. `type-poster` computes to 160 px at 1440 px wide and 56 px at 390 px. (e2e)
9. Glass: the computed backdrop filter is `blur(16px)` without the lens attribute. With `data-glass-lens` set in Chromium it includes `url(`. With the attribute set and reduced transparency emulated through a CDP session (`Emulation.setEmulatedMedia`, feature `prefers-reduced-transparency: reduce`), it is `none` and the background is the fallback. Under `forcedColors: "active"` it is `none` and the border colour is a system colour. Under reduced motion it has no `url(`. (e2e)
10. `pointerLight`: a pointer move over a glass sets `--glass-lit` to 1 and `--glass-x` / `--glass-y` to the pointer's position; `--motion-light` after the last move `--glass-lit` reads 0; under reduced motion a move sets nothing. The `::after`'s computed `mask` (or `-webkit-mask`) is not `none`. (e2e)
11. Inside each of `field-1` … `field-4`, both themes: `text-foreground`, `text-muted-foreground`, `text-primary` and the focus ring compute to `--field-N-foreground`; a `Card` carrying `surface-plain` inside the field, and a glass inside it, compute their title, description and `text-primary` to the theme's own values. (e2e)
12. In the dark theme under `data-mode="expressive"`, the mark's dots compute to the lifted four; outside it, and inside a `data-mode="productive"` island within it, to paper. (e2e)
13. The `pluto-theme` and `liquid-glass` pages pass axe in both themes; text on glass is evidenced by criterion 3's rows, since axe reads text over a backdrop filter as incomplete. (e2e)
14. The changelog's 0.11.0 entry names decision 12's five changes; no 0.9.0 or 0.10.0 entry remains; R25 is in `002`'s checklist; `meta.since` is `"0.11.0"` on the eleven items. (unit)
15. `bun run test`, `bun run check` and `bun run lint` pass. Expectations change only in these groups, each by the decision named:
    - `contrast.test.ts`: every pinned ratio and hex that decision 2 moves, the stage figures and veil hex, the scrim rows, the navigation pairs, `004`'s "still measures" rows, the tint hexes (decision 2); the forbidden test (decision 11); the code slots' tightest row (decision 2);
    - `tokens.test.ts`: the mark geometry (decision 7), the `ink-*` hexes (decision 2), the light elevation and groove roles (decision 4), the expressive shapes (decisions 5, 6, 8, 9, 10);
    - `generated.test.ts`: `--radius-pill` (decision 5), the variable list (decisions 6, 8, 9, 10), the colour fixtures `009` criterion 2 pinned from `v0.8.0` (decision 2);
    - `expressive.spec.ts`: "a pill under `data-mode=expressive`" (decision 5); ink and blue on the stage (decision 2);
    - `four-dot.spec.ts`: the lockup's geometry and the colour constants (decisions 2, 7); the animation counts (decision 10);
    - `pages.ts`'s page grounds and `code.spec.ts`'s ink surface (decision 2);
    - `registry.test.ts` and `literals.test.ts`: the item count 74 → 75, the file counts, the L22 list, L23 and L24 (decisions 8, 10);
    - `generated.test.ts`'s mark keyframes and motion utilities: `pluto-mark-dock` and the new `pluto-mark-fade`, `mark-entrance`'s two animations, `mark-reveal`'s timing list (decision 10); and the new plain rules: the glass fallbacks, the wrapped lens rule, the expressive and productive mark rules (decisions 3, 8);
    - the `meta.since` and changelog checks (decision 14).
    (all suites)

## Build checkpoints

1. After decisions 2, 3, 4 and 5: the design lead looks at five productive pages (`button`, `card`, `dialog`, `code-block`, `app-shell`'s view) in both themes before the builder goes on.
2. After decisions 6 to 10 and the preview section: the design lead looks at the `pluto-theme` page's expressive section and the lockup, in both themes.

## Risks

- **Every productive screen changes colour.** That is the owner's decision. Checkpoint 1 is the guard; the contrast table is the proof.
- **The lens is engine-specific.** It is off unless the engine is Chromium and every preference allows it; the frosted glass passes alone.
- **`.glass` and `.surface-plain` are global class names**, like `.veil` (`009`). An app with its own gains the theme's rule when it updates.
- **A field's roles reach every descendant.** A surface that forgets `surface-plain` draws the legend on its own ground. `012`'s ground check is the guard for the compositions; R25 is the guard for apps.
- **L22 reads comments.** `glass` is an English word; a productive item's comment that says it fails, as `bloom` did. Accepted; none today (READ, grep).

## Review dispositions

From [`../reviews/011-the-brand-spec-2026-11-06.md`](../reviews/011-the-brand-spec-2026-11-06.md).

1. **Fixed.** Fields set their roles and the theme emits `--surface-*` copies; `surface-plain` restores them, and `glass` includes it (decision 6). `--primary` and `--ring` join the field's roles. Criterion 11.
2. **Fixed.** The specular is masked to the rim (decision 8); criterion 10 checks the mask. The dark `--glass-light` is 20% on the rim alone, where no text sits.
3. **Fixed.** The endorsement follows the lockup; decision 7 says why, and decision 12 lists it. Criterion 5.
4. **Fixed.** The lens rule sits inside a `no-preference … forced-colors: none` media query; `GlassLens` checks the engine only. Criterion 9 uses a CDP session and asserts a system colour under forced colours.
5. **Fixed.** L24, one counted allowance (decision 8; criterion 7).
6. **Fixed.** Criterion 4 reads the box-shadow's two layers.
7. **Fixed.** Two keyframes, longhand timing, the reveal's two-item list, the corrected fallback (decision 10); criterion 6 and the `four-dot.spec.ts` counts.
8. **Fixed.** Light `groove-light` → `clear` (decision 4; decisions.md, 2026-11-07).
9. **Fixed.** The ban stays by rule; the dark pairs move to `ruleOnly` (decision 11; decisions.md).
10. **Fixed.** Criterion 15 names the groups.
11. **Fixed.** `expressive.glass.lens` and `expressive.motion.light` are tokens, read through `read-token` (decision 8).
12. **Fixed.** Decision 3 states what the stage's rows do; `012` removes the stage in the same release.
13. **Fixed.** 4.96; dark field-3 8.45; the alpha-byte glass figures recorded (decision 11).
14. **Fixed.** The tones are recorded in `decisions.md`; the reviewer's lighter `#C11E31` and `#007351` are adopted and re-measured (EXECUTED), and the text says "a passing value as close as was found".
15. **Fixed.** Every shape is written (decisions 6, 8, 9, 10, 11).
16. **Fixed.** The "pill" lines are in decision 1's scope; `--radius-stage` is named as the one exception until `012`.
17. **Fixed.** R25's wording names light-theme grounds, `paper`, `raised` and images.
18. **Fixed.** Criterion 5 measures from a `Range`.
19. **Fixed.** (a) the prefixed `@supports`; (b) the SVG's form; (c) the `pluto-theme` and `read-token` dependencies; (d) accepted, in Risks; (e) explained in decision 2; (f) criterion 14.

**After the reviewer's verification** (2026-11-07): finding 2's mask order (prefixed first) for Firefox; finding 7's fallback clause; finding 10's `generated.test.ts` group; finding 13's four figures and attributions; N1 (a field never shares an element with `.dark`, in decision 6 and R25); N2 (the productive island resets the marks, decision 3, criterion 12). All applied with the reviewer's fix text.

## Landing notes

- **Built** in the working tree on top of `6fbdf99`, uncommitted, by the owner's ruling. The version moved to 0.11.0 at the build's start; `static/v0.9.0/` and `static/v0.10.0/` are deleted (decisions.md, "One release, 0.11.0").
- **Tests first.** Phase A: the unit suite ran red against the old tokens (159 failures) before the token change; its e2e edits were written first but not run red (recorded at checkpoint 1). Phase B: unit 104 and e2e 64 failures before any code. The change review's finding 3 fix went red first (8 failures).
- **Checkpoints 1 and 2** are recorded in `decisions.md` (2026-11-07), with every deviation and its call.
- **Deviations** beyond the checkpoint records:
  - **Both entrance animations fall back to `ease`** in an engine without `linear()`, the dock and the fade alike; neither is dropped and nothing bounces (EXECUTED by the builder, invalid `--ease-spring` on the dots). This replaces decision 10's "An older engine runs the dock on `ease`" (change review finding 2).
  - **`--primary-foreground` is a field role**, `var(--field-N)`, so a filled primary element on a field is the field's colour on the legend: the legend pair reversed, already measured (change review finding 3). **`--surface-primary-foreground`** joins the theme copies, and `surface-plain` (so `glass`) restores it; the review did not name this, and without it a filled primary in a card on a field would be the field's colour on blue.
  - **R25 and the `pluto-theme` page** say the theme is set on `html` or a wrapper outside the expressive subtree (change review finding 4).
  - **The changelog** names the new global class names and says to update `four-dot` with `pluto-theme` (finding 5); `liquid-glass` needs Svelte 5.29 or later for attachments, stated in its description, its page and the changelog; the repo pins 5.57.3 (finding 6).
  - **The forced-colours border assertion** is removed from `brand.spec.ts`: Chromium forces every border to a system colour, so it could not fail; `generated.test.ts` pins `border-color: CanvasText` (finding 7).
  - **`normaliseValue`** in `tests/helpers/css.ts` drops whitespace inside parentheses, so the smoke comparison reads prettier's wrapped `linear(` (finding 1).
- **Test groups criterion 15 did not name**, each moved by the decision given: `blocks.spec.ts` A2 (decision 4); the primitive count 34 → 35 and `007`'s nine-primitive test, the `syntax-amber` hexes (decision 2); `previews.test.ts` and `registry.test.ts`'s item and `registry:ui` counts (74 → 75, 56 → 57); `pages.ts` and `axe.spec.ts`'s `ITEMS_011` / `PAGES_011`; `four-dot.spec.ts`'s navigation count 4 → 8, the reduced-motion and shipped-shell counts reading both keyframe names, the endorsement's top; `generated.test.ts`'s reduced-motion block, `009`'s utility order, `MOVED_011`, and finding 3's role assertions; `brand.spec.ts` criterion 11's planted `Button`.
- **Figures, as `contrast.ts` computes them:** 98 of 100 theme rows pass with the two recorded exceptions; 114 of 114 code-slot rows, tightest 4.50; 6 scrim rows, lowest 3.74; fields light 7.02, 5.61, 8.81, 4.96, dark 8.67, 8.67, 8.45, 8.62; glass lowest light 12.43, 4.78, 4.55, dark 12.06, 5.09, 6.47; fallback light 18.36, 7.06, 6.72, dark 14.42, 6.08, 7.74; eleven ring-on-glass rows, each at least 3:1; the forbidden light row 4.08.
- **Final runs** (the builder, after the review's fixes): unit 939 pass; `check` 0 errors; `lint` clean; the literal lint 0 violations, 1 counted allowance (L24); e2e `brand`, `four-dot`, `axe` 620 passed in both projects; the full e2e before the fixes 1844 passed, 4 skipped (criterion 4's light-only checks in the dark project); smoke 109 pass, 0 fail.
- **Watched at `012`'s checkpoint:** dark glass on the graphite canvas is told from the ground by its edge alone.
- **The lens is removed** (decisions.md, "Frost only: the lens is removed", 2026-11-07). After `012`'s scroll measurements the owner ruled "Frost only, no lens". Decision 8's `GlassLens`, the `expressive.glass.lens` tokens, the `--glass-lens-*` variables, the lens rule and `data-glass-lens` are gone, removed in `012`'s build before release; criterion 9's lens parts are superseded. Glass is frosted (`blur(16px)`) and lit at the rim, the same in every engine.
