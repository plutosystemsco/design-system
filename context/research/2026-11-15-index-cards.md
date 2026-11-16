# The Components index card

- **Status:** complete. It stands behind [`../specifications/031a-the-index-card-redesign.md`](../specifications/031a-the-index-card-redesign.md).
- **Date:** 2026-11-15
- **Author:** the spec author for `031a`
- **Question:** How do the reference systems frame a component's preview, and what ground should Kuiper's index picture sit on, so that it is not the page's ground and a white example is not white on white?
- **The exhibit:** [`2026-11-15-index-cards/index.html`](2026-11-15-index-cards/index.html). Open it from disk. Its PNGs are in [`2026-11-15-index-cards/png/`](2026-11-15-index-cards/png/); `render.ts` beside it makes them again. The pictures in it are real first examples from the 0.12.0 build, photographed on each candidate ground by `probe.ts`.
- **Written against** the post-`020` names (`kuiper-theme`, `tokens/kuiper.*`) and the post-`029` theme (one `light-dark()` pair per role, `data-scheme`, the index's `data-thumb-scheme`). The live index photographed below is today's 0.12.0 build, which still reads `pluto`.

## How to read this memo

- **EXECUTED:** run and seen on 2026-11-15, in Chromium from this repository's Playwright, against the main tree's existing `build/`.
- **READ:** a source says so: a screenshot in [`2026-11-15-design-sites/`](2026-11-15-design-sites/) (pixels sampled from it are EXECUTED), or a file in `context/prior_art/`.
- **RECALLED:** known from a reference system's public documentation, not re-read in this session.
- **INFERRED:** our reasoning.

Terms.

- **Stage:** the area a preview sits on.
- **Ground:** the flat colour of a surface.
- **ΔE:** CIEDE2000 colour difference. About 1 is the smallest difference most people see side by side; 2 to 3 is plainly visible on large areas (INFERRED, the usual reading).
- **Contrast:** the WCAG ratio.

## In short

- **Today the picture's ground is the page's ground.** On `/components/`, the stage reads `rgb(243, 240, 232)` in light and `rgb(22, 20, 15)` in dark: exactly `background`. It sits in a `card` tile on a `background` page (EXECUTED, `png/now-foundation-1440-light.png`). That is the owner's "background on background".
- **No reference shows a preview on the page's own ground inside a card of another colour.** Atlassian tints its stage below its card; Carbon draws previews straight onto its tile; Spectrum puts its stage on a card above a tinted page; Radix uses the page's ground and an edge, with no card (READ, measured below).
- **The obvious ground, `muted`, hides parts of six examples.** `muted` and `accent` are fills that items paint: the tabs strip, skeleton bars, the avatar fallback, the table footer, the empty state's media, and the message's code in dark. On a `muted` stage they vanish (EXECUTED, `png/grounds-1440-light.png`).
- **So a new role is needed: `sunken`,** a ground below the page in both schemes. `#DCD7CA` in light and `#0B0A07` in dark. It differs from every neutral ground an item paints by ΔE 2.74 or more (EXECUTED, table in §4).
- **Bytes barely move.** The same 16 first examples encode to −1.1% in light and +1.3% in dark on `sunken` against today's ground. A transparent picture would cost +29% and +38% (EXECUTED, `probe-bytes.json`).
- **Three cards are drawn:** A, a sunken band across the top of the card; B, a matted well set into the card; C, no card, a sunken stage on the page with the words below.

## 1. Kuiper's index today

Photographed at 1440 and 390, in light and dark, from the 0.12.0 build (EXECUTED):

- `png/now-foundation-1440-light.png`, `png/now-foundation-1440-dark.png`
- `png/now-foundation-390-light.png`, `png/now-foundation-390-dark.png`
- `png/now-surfaces-1440-light.png`: Card, Utils and Collapsible, white on paper inside white.
- `png/now-forms-1440-dark.png`: the forms in dark, the stage the page's own near-black.

What the computed styles say (EXECUTED):

| | Light | Dark |
|---|---|---|
| Page (`body`) | `rgb(243, 240, 232)` = `background` | `rgb(22, 20, 15)` = `background` |
| Tile | `rgb(255, 255, 255)` = `card` | `rgb(34, 31, 25)` = `card` |
| Tile edge | `rgba(11, 15, 23, 0.1)` = `border`, 10% alpha | `rgba(243, 240, 232, 0.1)` |
| Stage | `rgb(243, 240, 232)` = `background` | `rgb(22, 20, 15)` = `background` |

- The tile is a white island whose top is a window back onto the page. So the eye reads the picture as "the page showing through" (INFERRED).
- White examples sit on paper, in a white tile. In light, `card` and `background` differ by ΔE 4.93 and 1.14:1. The example's white meets the tile's white at the stage's edge (EXECUTED; `png/now-surfaces-1440-light.png`, Card and Collapsible).
- The tile edge is the 10% hairline. `031b` will forbid alpha edges outside a layer; the tile is not a layer (`019a` decision 3).
- Below `md`, each row's 96 × 60 picture sits in a box with the same hairline and the page's ground (`png/now-foundation-390-light.png`).
- **How the ground gets into the picture.** `scripts/site/thumbnails.ts` reads the capture root's computed `background-color` (`frame-stage`'s `bg-background`, or `body` for a block or composition), fills the 480 × 300 canvas with it, and trims that colour from the edges before centring (READ). So the picture carries the page's ground in its pixels. Changing the tile's CSS alone cannot change it; the pictures must be made again.

## 2. How the references frame a preview

| System | Page | Card or tile | Stage | Edge | Padding | White on white |
|---|---|---|---|---|---|---|
| **Atlassian**, components index | `#FFFFFF` | `#FFFFFF`, about 8 px radius | `#F8F8F8` band across the top, full bleed | 1 px `#DDDEDD` round the card; none between stage and words | the stage is full bleed; the words about 16 px | the stage is tinted below the card (ΔE 1.4, 1.06:1). Its pictures are grey wireframe drawings |
| **Atlassian**, example on a page | `#FFFFFF` light, `#1F1F21` dark | — | a checkerboard of `#FFFFFF` and `#F8F8F8`, **the same in dark** | 1 px | about 12 px | the checkerboard shows any white edge; the example stays light in the dark site |
| **Carbon**, components overview | the overview's layer, `#F4F4F4` | `$white-0` tiles, square, no radius, 4 across | none: the picture is drawn on the tile | 1 px `$gray-20` rules between tiles, no outer border | the picture centred; the name 16 px (`$spacing-05`) from the top left | the pictures are SVG drawings. White surfaces are drawn `#F3F3F3`/`#F4F4F4` (`Tile.svg`, `Text input.svg`), so they never meet the tile's white. Hover fills the tile `#e5e5e5` |
| **Spectrum**, example on a page | `#F2F2F2` light, `#000000` dark | `#FFFFFF` / `#111111`, a large radius, no edge, no shadow | the card's own ground | none | generous, about 64 px | the card is lifted above a tinted page (ΔE 2.6 light, 3.0 dark). The home page's preview boxes are tinted, rounded, with the words below on the page and no card |
| **Radix Themes**, example on a page | `#FFFFFF` / `#111113` | — | the page's own ground | 1 px `#E0E1E6` | about 16 px | the edge alone separates it. The code below is tinted `#F7F9FF` / `#141726` |

Sources, each READ, the colours EXECUTED by sampling the screenshot:

- Atlassian: `2026-11-15-design-sites/atlassian-components-1440-light.png`, `atlassian-button-1440-light.png`, `atlassian-button-1440-dark.png`.
- Carbon: `carbon-components-1440-light.png`, `carbon-button-1440-light.png`; the overview's source, `context/prior_art/carbon-design-system-carbon-website/src/components/ComponentOverview/component-overview.scss`, `ComponentOverview.js` and `images/*.svg`.
- Spectrum: `spectrum-button-1440-light.png`, `spectrum-button-1440-dark.png`, `spectrum-home-full-1440-light.png`.
- Radix Themes: `radix-button-1440-light.png`, `radix-button-1440-dark.png`, `radix-components-1440-dark.png` (the playground: examples bare on the page). The `radix-ui-themes` clone holds the library and a playground, not the docs site; its `color.css` names `--color-background`, `--color-panel-solid` and `--color-surface` (READ).

What the references agree on (INFERRED from the table):

1. **A preview never sits on the ground of the card around it.** Either the card has no ground of its own (Radix, Spectrum's home, Carbon's tiles with drawings), or the stage is tinted below it (Atlassian).
2. **When there is a card, the stage is the darker of the two in light.** Atlassian's stage is below its card. Spectrum lifts the card above a darker page instead. Atlassian's token set names the ground "sunken" (`elevation.surface.sunken`), darker than the default surface in both its light and dark themes (RECALLED).
3. **White on white is solved by changing a ground, not the example.** Carbon can redraw the example grey because its pictures are drawings. Kuiper's are photographs of the real item, so only the ground may move (INFERRED).
4. **Edges are light or absent.** Only Atlassian edges its index card; nobody edges the stage itself.

## 3. Why not an existing role

Every neutral ground role in Kuiper resolves to one of three values per scheme (READ, `src/app.css`):

| Value | Light roles | Dark value | Dark roles |
|---|---|---|---|
| paper `#F3F0E8` | `background`, `sidebar` | graphite `#16140F` | `background`, `sidebar` |
| raised `#FFFFFF` | `card`, `popover`, `secondary`, `raised`, `code-background` | ink-raised `#221F19` | `card`, `popover`, `secondary`, `raised` |
| wash `#E9E5DB` | `muted`, `accent`, `sidebar-accent` | ink-wash `#2C2821` | `muted`, `accent`, `sidebar-accent`, `code-background` |

- A stage must differ from the page and the card, so in each scheme the only existing candidate is wash or ink-wash: `muted`.
- But items paint `muted` and `accent` themselves: 8 item files use `bg-muted` and 8 use `bg-accent` (EXECUTED, by search of `src/lib/registry/`). Among them are `tabs-list`, `skeleton`, `avatar-fallback`, `table-footer`, `table-row`'s selected state, `empty-media` and `message-content`.
- **Photographed on `muted`, those parts disappear** (EXECUTED, `probe.ts`, `png/grounds-1440-light.png` and `-dark.png`): the pill strip of the tabs, the lower skeleton row, all three avatar fallbacks, the table's footer row, and in dark the message's code block.
- So no existing role works. A new role is proposed.

## 4. The proposed ground: `sunken`

**Below the page, in both schemes.** In light the order of grounds is `sunken` < `muted` < `background` < `card`. In dark it is `sunken` < `background` < `card` < `muted`. A stage is a well cut into the page, and the example rises out of it, as Atlassian's sunken surface does (RECALLED).

- **Light: `#DCD7CA`,** OKLCH L 0.880, C 0.018, h 89. It continues the step from raised (L 1.000) to paper (0.955) to wash (0.922), on the same warm hue.
- **Dark: `#0B0A07`,** OKLCH L 0.145, C 0.007, h 93. One step below graphite (L 0.192).
- Two primitives would carry them: `paper-sunken` and `ink-sunken`.

Measured against every neutral ground (EXECUTED, the exhibit's `colour.py`, CIEDE2000 and WCAG):

| Scheme | Against | ΔE | Contrast |
|---|---|---|---|
| light | `background` (paper) | 5.92 | 1.26 |
| light | `card` (raised) | 10.46 | 1.44 |
| light | `muted` (wash) | 3.41 | 1.14 |
| dark | `background` (graphite) | 2.74 | 1.08 |
| dark | `card` (ink-raised) | 6.35 | 1.21 |
| dark | `muted` (ink-wash) | 9.20 | 1.35 |

- **The floor is ΔE 2.5,** the smallest step the system already draws between two grounds: `background` to `muted` in light, ΔE 2.51. Every pair above clears it. The weakest is dark `sunken` on dark `background`, 2.74.
- **Rendered, the pixels agree** (EXECUTED, read from `png/a-1440-*.png`): the picture's ground reads `#DCD8C9` and `#0C0A08` after WebP. Stage to page is ΔE 6.13 in light and 2.94 in dark. Stage to card is 10.80 and 6.44. WebP moves the ground by about one step per channel, ΔE under 1.
- **Text on it passes:** `foreground` 13.35:1 and 17.38:1, `muted-foreground` 5.14:1 and 7.34:1.
- **One edge reads lower on it.** An input's 3:1 edge (`input`, `#857E70`) is 2.80:1 on light `sunken`, against 3.54:1 on paper. The input's edge still reads 4.03:1 against its own white fill, so the control is still drawn. The pictures are decorative (`alt=""`), so WCAG 1.4.11 does not bind them; the honest picture is the point (INFERRED).
- **The 3:1 boundary rule does not bind the stage either.** A tile's stage is not a control, and the tile, a link, is named and found by its title text. Atlassian's stage is 1.06:1 to its card (EXECUTED, above).
- **The dark alternative, lifted above `muted`** (`#353129`): ΔE 9.42 from the page, but every dark card and input in a picture would sit darker than its ground, like a hole. Not drawn further (EXECUTED for the numbers; INFERRED for the look).

## 5. The three cards

Each is drawn with Kuiper's roles only, written as `029` writes them, plus the proposed `--sunken`. Spacing is in multiples of `--spacing`, and every corner takes the one radius. Each is shown at 1440 in both schemes; the phone form is shared.

- **A, the sunken band** (`png/a-1440-light.png`, `png/a-1440-dark.png`). Today's tile, with the stage's ground changed to `sunken` and the hairline under it removed. The card keeps `card`. Three grounds, each distinct: page, card, stage. Closest to Atlassian's index.
- **B, the matted well** (`png/b-1440-light.png`, `-dark.png`). The card is a mat 2 spacing units wide; the stage is set into it, with the one radius. It frames each picture most strongly. It is also the most nested: a well in a card on a page.
- **C, the open stage** (`png/c-1440-light.png`, `-dark.png`). No card. A `sunken` stage with the one radius sits on the page, with the words below on the page itself. Two grounds only. Closest to Spectrum's home page. The link's extent is drawn by the stage alone.
- **Below `md`, all three share one row** (`png/a-390-light.png`, `-dark.png`): the 96 × 60 picture on `sunken` with the one radius and no visible edge; the groove between rows stays.
- **Today, for comparison:** `png/today-1440-*.png` and `png/today-390-*.png`.

In all three, the tile and the stage have **no visible edge**. They carry a transparent 1 px border, which forced colours paints (`028`'s finding), so the tile is still outlined in that mode. A transparent edge is allowed by the depth rule (`019a` decision 3: "alpha below 1 (but fully transparent)").

## 6. Bytes

The probe photographed 16 first examples (accordion, alert, avatar, badge, button, card, code-block, empty, input, item, message, skeleton, switch, table, tabs, utils) on four grounds, and encoded each as the thumbnail script does: 480 × 300, content centred, WebP at quality 0.8 in Chromium (EXECUTED, `probe.ts`, `probe-bytes.json`).

| Ground | Light, 16 pictures | Against today | Dark, 16 pictures | Against today |
|---|---|---|---|---|
| `background` (today) | 68,858 B | — | 64,842 B | — |
| `muted` | 68,072 B | −1.1% | 61,964 B | −4.4% |
| `sunken` | 68,112 B | −1.1% | 65,692 B | +1.3% |
| transparent (alpha WebP) | 89,094 B | +29% | 89,738 B | +38% |

- Per picture on `sunken`, the change runs from −3.9% (`empty`, light) to +7.6% (`skeleton`, light, 1,342 to 1,444 B).
- The probe is not the real pipeline: it skips the overlay states, the font specimens and the 9 px text floor. Its figures are for comparing grounds, not for the budget. The builder measures the real run.
- **A transparent picture was considered and rejected.** It would let CSS choose the ground without new pictures. It costs about a third more bytes on the page with the tightest LCP budget. And every theme change regenerates the pictures anyway, because the manifest hashes `src/app.css` (`018` decision 13).
- Today's 150 pictures weigh 656,730 B, median 3,982 B (EXECUTED, from `src/lib/site/thumbnails/`).

## 7. Open points for the specification

- The ground: the new role (recommended) or `muted` with its losses.
- The card: A, B or C.
- Whether the component pages' own example stages move to `sunken` too. They are lane S's frames, ranked under `034`; this memo has not drawn them.
- A new role is a lane-T edit, though `031a` is a lane-S row. `031` (high contrast) must give `sunken` its own pair.
