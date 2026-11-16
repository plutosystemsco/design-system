# The transparency audit

- **Status:** complete. A memo: it commits us to nothing. [`031b`](../specifications/031b-transparency-signifies-depth.md) stands on it.
- **Date:** 2026-11-15
- **Author:** the spec author for `031b`, for the design lead
- **Question:** where does Kuiper let the colour behind a thing show through, and which of those places are a layer above other content?
- **Tree:** the source at `dad6f76` (`v0.12.0`; no source file has changed since, only `context/`). The runtime half read the main tree's `build/`, written at 16:10 on 2026-11-15, right after `dad6f76`. So every name here is a `pluto` name; `020` renames none of the classes, slots or roles it cites.

Each claim is labelled **EXECUTED** (run and seen), **READ** (a source says so) or **INFERRED** (our reasoning).

## 1. Method

- **Static** (EXECUTED, `grep` over `src/lib/registry/`, `src/lib/site/`, `src/routes/(site)/`, `src/app.css`, `site.css`, `scripts/build-tokens.ts` and `tokens/pluto.tokens.json`). Searched for Tailwind `/NN` alpha modifiers on colour utilities; `rgba`, `hsla`, eight- and four-digit hex, `oklab(… / a)`, `color-mix(… transparent)`; `backdrop-*` and the `glass` utility; `opacity-*`; shadow utilities; and every use of a role whose value has alpha.
- **Generated CSS** (EXECUTED): every `.css` file under `build/_app/immutable/assets/`, searched for rules holding `color-mix(… transparent)`, alpha hex, `backdrop-filter` and `opacity`.
- **Runtime** (EXECUTED): a Playwright probe, `probe.ts`, in the session scratchpad (`031b/`), against a static server over `build/` on port 4391, Chromium 1248, 1440 × 900.
  - 102 pages: `/`, every page under `/start/`, `/brand/`, `/foundations/`, `/changelog/` and `/components/`. Both schemes, so 204 visits. Every example iframe was read too.
  - On every component page, each control in each example stage was hovered, then focused by keyboard modality, and the whole document read after each. Each popup trigger in a stage was opened, the controls inside its content hovered, and the page read.
  - Each element and its `::before` and `::after` were read for: a background, border, outline, text, `fill` or `stroke` colour with alpha strictly between 0 and 1 (019a's `/ alpha` parser, extended to compound values); a colour with alpha inside `box-shadow` or `background-image`; `backdrop-filter`; `opacity` below 1; `filter`; `mix-blend-mode`; `fill-opacity` and `stroke-opacity`.
  - Each finding records its nearest layer ancestor: a `.glass` element, a `position: fixed` element, or an overlay slot (`*-overlay`, `*-content` of dialog, sheet, alert dialog, popover, tooltip and dropdown menu).
  - 14,051 raw findings, deduplicated by element signature, property and value into 188 distinct ones. `analyze.ts` classifies them; `classified.md` holds every row. Seven minutes with five workers.
- **Checks on the method** (EXECUTED): `tabs-check.ts` re-read the tabs triggers 700 ms after focus; `chart-check.ts` hovered each of the 37 charts' plots.

## 2. The counts

### 2.1 Runtime, by class (EXECUTED)

| Class | Distinct | Where | Verdict |
|---|---|---|---|
| Glass, the layer's own paint (tint, edge, rim, shadow, blur, the `::after` light) | 50 | the site bar on all 102 pages; the band's glass on `/start/`, `/foundations/` and `/components/`; `/brand/colour/`; `/brand/surfaces/`; `liquid-glass`'s and `pluto-theme`'s glass examples; `marketing-bar`; `stage-hero` | a layer |
| The scrim | 3 | `dialog-overlay`, `sheet-overlay`, `alert-dialog-overlay` (0.5 light, 0.6 dark) | a layer |
| An overlay surface | 0 | dialog, sheet, alert dialog, popover, tooltip and dropdown-menu contents, opened | solid already |
| A shadow off a layer | 0 | — | — |
| A backdrop filter off a layer | 0 | — | — |
| Opacity 0, a hidden element | 1 | `sidebar-group-label`, collapsed to icons | not translucent |
| Motion, read mid-transition | 9 | `tabs-trigger`'s fill and edge 120 ms after focus; `tooltip-content`'s entrance (0.998) | motion. Solid 700 ms later (`tabs-check.ts`) |
| **An alpha fill on the page** | 5 | `alert` and `error-summary` (through `alert`): the `/10` tint; the `border` role's swatch on `/foundations/tokens/`, `/foundations/colour/` and `pluto-theme`'s contrast example; the `bg-scrim` specimen on `pluto-theme`'s elevation example | violation |
| **A hairline on the page** (the 10% `border`, `sidebar-border` or `groove-line`) | 102 | 28 item attributions and 41 site-chrome elements. Every one of the 102 pages has at least one: the frame, the footer, the prev and next links, inline `code`, the code block, the API table | violation |
| **A hairline inside a layer** | 4 | `dropdown-menu-separator` in the open menu; `kbd` inside `tooltip-content`; a code block and inline `code` inside the band's glass on `/start/` and `/components/` | violation |
| **Disabled by opacity** | 14 | `accordion`, `button`, `checkbox`, `input`, `input-otp`, `native-select` (its wrapper), `radio-group`, `switch`, `tabs`, `textarea`, `toggle`, `toggle-group`, and the labels: `field`'s `field-label`, `label` | violation, or a ruling |
| Text, SVG paint, `filter`, `mix-blend-mode` | 0 | — | — |

### 2.2 Static, in source (EXECUTED)

| Class | Items | Site | Note |
|---|---|---|---|
| Alpha modifier on a colour utility | 4 tokens, 1 file: `alert.svelte` lines 10 and 12, `bg-destructive/10`, `bg-success/10`, `dark:bg-destructive/20`, `dark:bg-success/20` | 0 | the literal lint's `SANCTIONED_TINTS`; `029` decision 10 replaces them |
| `rgba`, alpha hex, `oklab(/ a)`, `color-mix(transparent)` in markup | 0 | 0 | L1 (hex) and the colour-function rule already forbid them in items |
| `backdrop-*` utility | 0 (L6 forbids it) | 0 | |
| `glass` utility | 3 items: `liquid-glass` (defines it), `marketing-bar`, `stage-hero` | 7 files: `chrome/bar.svelte`, `page/band.svelte`, `brand/colour/+page.svelte`, `brand/surfaces/+page.svelte`, `examples/liquid-glass/variants.svelte` (two panels), `examples/pluto-theme/glass.svelte`, `examples/pluto-theme/fields.svelte` | L22 limits it to expressive items |
| `opacity-50` on a disabled state | 25 tokens in 20 files of 16 items: `accordion`, `button` (2), `checkbox` (2), `dropdown-menu` (3 files), `field` (2 files), `input`, `input-group` (addon), `input-otp`, `label` (2), `native-select`, `radio-group`, `sidebar` (2 files, 4), `switch`, `tabs`, `textarea`, `toggle`. `toggle-group` inherits `toggle`'s | 0 | `028` decision 9 counts 17, counting `field` and `label` apart |
| `opacity-0` / `opacity-100` | `sidebar-menu-action` (4, a reveal on hover and focus), `sidebar-group-label` (1, collapsed, with `transition-[margin,opacity]`) | `brand/replay.svelte` (a Web Animations keyframe) | 0 or 1 at rest |
| `shadow-*` | `shadow-elevation` in 7 files, each an overlay surface: `dialog-content`, `sheet-content`, `alert-dialog-content`, `popover-content`, `dropdown-menu-content`, `dropdown-menu-sub-content`, `chart-tooltip` | `examples/pluto-theme/elevation.svelte` (its specimen) | L5 allows only this one |
| `bg-scrim` | 3 overlay files | `examples/pluto-theme/elevation.svelte` (its specimen) | |
| A hairline role in a class (`border-border`, `stroke-border`, `border-groove-line`, …) | 28 uses in 20 files | 42 uses in 31 files | |
| The `groove`, `groove-s` and `groove-b` utilities (drawn in `groove-line`) | 25 uses in 16 files | 47 uses in 22 files | |
| Elsewhere | `code-editor-theme.ts:46` (`var(--border)`); the theme's base rule for inline `code` (`border-border`) | — | |

### 2.3 Tokens with alpha (READ, `tokens/pluto.tokens.json`, `src/app.css`)

| Token | Light | Dark | Used by |
|---|---|---|---|
| primitive `line` | `#0B0F171A` (10%) | — | roles `border`, `sidebar-border`, `groove-line` |
| primitive `paper-line` | — | `#F3F0E81A` (10%) | the same roles, dark |
| primitive `ink-scrim`, `ink-scrim-deep` | `#0B0F1780` (50%) | `#0B0F1799` (60%) | role `scrim` |
| primitive `ink-shadow` | `#0B0F1729` (16%) | — | nothing (`002` decision 7's light shadow; `elevation-shadow` now points at `clear`) |
| primitive `clear` | `#00000000` | `#00000000` | `groove-light`, `elevation-shadow`: fully transparent |
| `glass.tint`, `rim`, `edge`, `light`, `shadow` | `#F3F0E8DB`, `#FFFFFFCC`, `#0B0F1714`, `#FFFFFF8C`, two shadows | `#16140FD6`, `#FFFFFF1F`, `#FFFFFF14`, `#FFFFFF33`, two shadows | the `glass` utility |
| the `field-1` to `field-4` utilities' `--border` | `color-mix(in srgb, var(--field-N-foreground) 24%, transparent)` | the same | written by `scripts/build-tokens.ts:521`. No hairline was drawn on a field in any example (runtime: 0) |
| `--shadow-elevation` | a solid ring (`elevation-line`), then a drop in `elevation-shadow` (`clear`) | the same | so no productive item casts a visible shadow |

### 2.4 Generated CSS (EXECUTED)

The built site CSS holds **76 rules with a translucent `color-mix`**. By source:

- 5 from the theme: `.field-1` to `.field-4` and `.!field-2`;
- 4 from `alert`: the sanctioned tints;
- 21 from LayerChart's own stylesheet (`lc-*`): grid and axis lines (10%, 50%), the highlight area (5%), line (20%) and shadow (20%), the brush, the tooltip container and its header, and the debug frames. The chart item overrides the axis, grid and rule lines with `stroke-border`; the highlight rules are not overridden. Hovering all 37 charts drew none of them translucent (`chart-check.ts`);
- about 46 from **candidate strings Tailwind found in `context/` and `tests/`**: `.bg-black/80`, `.bg-popover/70`, `.text-sidebar-foreground/70`, `.supports-backdrop-filter:backdrop-blur-xs` and others. For example, `bg-popover/70` appears in four research memos, `002`, and `tests/unit/literals.test.ts`, and nowhere in `src/`. Tailwind's automatic source detection reads every file not ignored by git (INFERRED, from where the strings are and are not). No page uses them. **Removed by `020a`** ([`../specifications/020a-the-sites-css-reads-only-code.md`](../specifications/020a-the-sites-css-reads-only-code.md)), which adds `@source not` rules for `context/` and `tests/` to `src/app.css`, before `031b` lands.
- Preflight's `::placeholder` colour, `color-mix(in oklab, currentcolor 50%, transparent)`. Every item that draws a placeholder overrides it: `input` and `textarea` set `placeholder:text-muted-foreground`, `composer` and `app-shell`'s sidebar draw theirs through them, and `code-editor-theme.ts:65` sets `.cm-placeholder` to `var(--muted-foreground)`. So does the site's search field (`search-palette.svelte:187`) (READ).

## 3. Solid replacements, measured (EXECUTED, `scripts/contrast.ts`'s `compositeTenths` and `contrastRatio`)

### 3.1 The hairline

Today's 10% line, on each of a scheme's three grounds, and a solid line composited over each candidate ground, read on all three.

| Scheme | Solid, composited over | Hex | On `background` | On `card` | On `muted` |
|---|---|---|---|---|---|
| light | today, 10% on its own ground | — | 1.22 | 1.23 | 1.22 |
| light | `background` (paper) | `#DCDAD3` | 1.22 | 1.39 | 1.11 |
| light | `card` (raised) | `#E7E7E8` | 1.08 | 1.23 | 1.01 |
| light | `muted` (wash) | `#D3D0C7` | 1.35 | 1.54 | 1.22 |
| dark | today, 10% on its own ground | — | 1.28 | 1.32 | 1.33 |
| dark | `background` (graphite) | `#2C2A25` | 1.28 | 1.14 | 1.02 |
| dark | `card` (ink-raised) | `#37342E` | 1.48 | 1.32 | 1.18 |
| dark | `muted` (ink-wash) | `#403C35` | 1.67 | 1.49 | 1.33 |

INFERRED: the line composited over the scheme's **middle ground by lightness** stays within 0.17 of today's ratio on every ground. That is `background` in light (`#DCDAD3`) and `card` in dark (`#37342E`). Composited over `card` in light, it almost vanishes on `muted` (1.01); over `background` in dark, the same (1.02).

### 3.2 Disabled

What `opacity-50` draws today, and the solid colours that reproduce it on the middle ground.

| Colour | Light | Reads on bg / card / muted | Dark | Reads on bg / card / muted |
|---|---|---|---|---|
| text and marks: `foreground` at 0.5 | `#7F8080` | 3.47 / 3.96 / 3.14 | `#8B8881` | 5.20 / 4.64 / 4.14 |
| an edge: `input` at 0.5 | `#BCB7AC` | 1.75 / 1.99 / 1.58 | `#4E4940` | 2.06 / 1.83 / 1.64 |
| a fill: `muted` | `#E9E5DB` | 1.10 on paper | `#2C2821` | 1.25 on graphite |

Today a disabled primary button's label, white at 50% over blue at 50% over paper, reads **1.69:1** on its own fill. With the solid roles, a disabled filled control's label reads 3.14:1 (light) and 4.14:1 (dark) on `muted`. Disabled controls are exempt from contrast (WCAG 1.4.3); this is legibility, not conformance.

## 4. The references (READ, the clones under `context/prior_art/`)

- **Primer** (`primer-primitives` at `4773648`): `fgColor.disabled`, `bgColor.disabled` and `borderColor.disabled` are solid steps of the neutral scale (`src/tokens/functional/color/fgColor.json5:136`, `bgColor.json5:166`). Its `rules` field reads: "MUST use for disabled state text. Pair with bgColor.disabled."
- **Carbon** (`carbon` at `fa75d78`): `border-disabled` and `button-disabled` are solid (`gray.30`); `text-disabled` and `icon-disabled` are `gray.100` at alpha 0.25 (`packages/themes/tokens/themes/white/theme.tokens.json:766, 871, 1033`).
- Neither fades a whole control with `opacity`. Both name disabled colours as roles.

## 5. What this does not cover

- Firefox and WebKit were not run. Their computed colour syntax differs (`color(srgb …)`); 019a's parser reads the `/ a` of any syntax (READ, `bar-glass.spec.ts`).
- Viewport 390 was not run; the mobile sheet of `sidebar` and `marketing-bar` was not opened.
- Forced colours were not emulated. `028` notes the engines' emulated `Highlight` carries alpha (`028` decision 2).
- The seven items `026` and `027` add do not exist in this tree.

## Corrections (2026-11-15, after `031b`'s specification review)

The review ([`../reviews/031b-transparency-signifies-depth-spec-2026-11-15.md`](../reviews/031b-transparency-signifies-depth-spec-2026-11-15.md)) re-read four claims. Its probes are in the session scratchpad, `031b-review/`.

- **§2.4, `bg-popover/70`.** It is in three `context/` files, not in `tests/unit/literals.test.ts`, at `dad6f76` or later. Every leaked translucent class is in `context/`; none is found only in `tests/` (EXECUTED (review)). The built CSS also holds `.shimmer`, from `shadcn-svelte/tailwind.css`, emitted because the word is in site prose. Its colour uses relative colour syntax with a computed alpha (EXECUTED (review)).
- **§3.1, the hairline's ground.** The table composites the line over its ground. A border paints over its own element's fill, and 1,416 of 2,020 drawn hairlines sampled on nine pages sit on an opaque fill of their own (EXECUTED (review), `filled.mjs`). Measured over the element: light white fills against the page go from 1.09 to 1.23; dark `ink-wash` fills from 1.68 / 1.34 to 1.48 / 1.18; dark dividers on graphite from 1.29 to 1.48 (EXECUTED (review), `lines.py`). On `031a`'s stage ground, `#DCD7CA`, the solid light line reads 1.03, against today's 1.23.
- **§4, the references.**
  - Primer's disabled primary button keeps its hue: `button.primary.bgColor.disabled` is `#95D8A6`, with a white label at alpha 0.8 (`src/tokens/component/button.json5:266–284, 572–576`). Its `fgColor`, `bgColor` and `borderColor.disabled` are neutral and solid, as §4 says.
  - Carbon's `button-disabled` is in `packages/themes/tokens/themes/white/button.tokens.json:83`, not `theme.tokens.json`. It is solid gray 30 in white, and gray 50 at alpha 0.3 in g100 (`g100/button.tokens.json:83–89`).
  - Both keep a filled button's fill visible, about 1.7:1 on white (EXECUTED (review)).
- **The names.** `020` merged at `44cec73`. The token file is now `tokens/kuiper.tokens.json`, and `/components/pluto-theme/` is `/components/kuiper-theme/`. The review diffed `dad6f76` against it: only names changed, and no class, slot, role or alpha value an item or page draws (EXECUTED (review)). So §2's counts hold for the renamed tree.
