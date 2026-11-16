# 031a — The index card redesign

- **Status:** Draft, for spec review. It waits on the owner's answers to Q1 to Q4 (end). The decisions below assume the recommended answer to each; each answer that differs changes the decision it names, and nothing else.
- **Date:** 2026-11-15
- **Author:** the spec author for `031a`, for the design lead
- **Kind:** a site change in lane S (the Components index, the thumbnail script, every thumbnail), with one addition in lane T (one colour role and two primitives). **Interface changes:** `kuiper-theme` gains one role, `--sunken`, with its utility `bg-sunken`, and the token files gain two primitives and one role per scheme. It is additive: no name, value or default changes, and an installed app is unaffected until it adds `kuiper-theme` again. One changelog bullet (decision 11). No dependency is added.
- **Lanes:** S, for `src/routes/(site)/components/+page.svelte`, `src/lib/site/site.css` (no rule changes; see decision 6), `scripts/site/thumbnails.ts` and `src/lib/site/thumbnails/`. T, for the token files and what `build:tokens` writes from them. The T edit is small and queues in lane T after `029` and before `031` (Q2, decision 1).
- **Written against the renamed and scoped tree.** `020` (the Kuiper rename) and `029` (scoped schemes) land first. So the theme item is `kuiper-theme`, the token files are `tokens/kuiper.*` in `021`'s DTCG shape, every colour is one `light-dark()` pair, a scheme is set by `data-scheme`, and the index's pictures carry `data-thumb-scheme` (`029` decision 15). Today's tree still reads `pluto`; every measurement below was taken on it, and no colour it reads is renamed.
- **Depends on:** `029` (the pairs, `data-scheme`, `data-thumb-scheme`, and its own regeneration of every picture, which this one follows). `021` (the DTCG files and `$description`). `024` (the `index` template's budget). It honours `019a` decision 3 (transparency signifies depth) and `028`'s finding that forced colours paint a transparent border.
- **Blocks:** nothing. `031` (high contrast) must give `sunken` a high-contrast pair; landing `031a`'s token edit first lets `031` cover it with the other roles.
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `031a`, lane S, depends on `029`. Scorecard rows 6 and 7: held.
- **Research it stands on:** [`../research/2026-11-15-index-cards.md`](../research/2026-11-15-index-cards.md), cited as *the memo*, by section. Its exhibit, [`../research/2026-11-15-index-cards/`](../research/2026-11-15-index-cards/), holds the mock-ups, their PNGs in both schemes, `probe.ts` (the ground probe), `probe-bytes.json` and `colour.py` (CIEDE2000 and WCAG contrast). Also `018` decision 13 and its landing notes (the index tiles and thumbnails as built), `029` decisions 10 and 15, `019a` decision 3, `024`'s `index` row, `028` decision 2.

## The problem, in the owner's words

The owner found the Components index card's "thumbnail on the page's own paper, inside a white card on that paper, reads as background on background, and white examples sit white on white" (the owner, 2026-11-15; roadmap row `031a`).

Measured, it is exactly that (*the memo* §1, EXECUTED). On `/components/` the picture's ground is `background` in both schemes: `rgb(243, 240, 232)` and `rgb(22, 20, 15)`. Its tile is `card`, on a `background` page. The picture is a window back onto the page. A white example, such as Card or Collapsible, meets the tile's white at the stage's edge. And the ground is in the picture's pixels: the thumbnail script fills each picture with its capture root's ground (READ, `scripts/site/thumbnails.ts`). So the fix is a new ground for the stage, and new pictures.

## Terms

- **Stage:** the area of a tile a picture sits on.
- **Ground:** the flat colour of a surface.
- **ΔE:** CIEDE2000 colour difference, computed from sRGB hex through CIELAB (D65).
- **Neutral grounds:** the colour roles an item may paint as a surface. In each scheme they resolve to three values: paper or graphite (`background`, `sidebar`), raised or ink-raised (`card`, `popover`, `secondary`, `raised`, light `code-background`), and wash or ink-wash (`muted`, `accent`, `sidebar-accent`, dark `code-background`) (*the memo* §3).

## What the research found

- **No reference shows a preview on the page's own ground inside a card of another colour.** Atlassian's index tints its stage `#F8F8F8` below a white card. Carbon draws its pictures straight onto white tiles, and draws white surfaces grey so they never meet the tile. Spectrum lifts a white card above a `#F2F2F2` page. Radix shows the example on the page's ground with a 1 px edge and no card (*the memo* §2, READ; colours EXECUTED from the screenshots).
- **The references fix white on white by moving a ground, not the example.** Kuiper's pictures are photographs of the real item, so only the ground may move (*the memo* §2, INFERRED).
- **`muted` is the only existing role that differs from both page and card, and it hides parts of six examples.** Items paint `muted` and `accent` themselves. On a `muted` stage the tabs' pill strip, the second skeleton row, every avatar fallback, the table's footer and, in dark, the message's code block disappear (*the memo* §3, EXECUTED; `png/grounds-1440-light.png` and `-dark.png`).
- **A new ground below the page works in both schemes:** `#DCD7CA` and `#0B0A07`, at least ΔE 2.74 from every neutral ground (*the memo* §4, EXECUTED).
- **Bytes barely move:** −1.1% in light and +1.3% in dark over 16 first examples. A transparent picture would cost about a third more (*the memo* §6, EXECUTED).

## Decisions

### 1. A new role, `sunken`: the ground below the page

- **The role:** `role.sunken` in both scheme files. CSS name `--sunken`; utility `bg-sunken` (through `029` decision 7's `color-sunken` entry in `cssVars.theme`).
- **Two primitives join the base file:** `paper-sunken` `#DCD7CA` and `ink-sunken` `#0B0A07`. The light role aliases the first, the dark role the second. So `kuiper-theme` writes `--sunken: light-dark(#dcd7ca, #0b0a07)` on `:root`, and the fallback's two hex sets each gain one line (`029` decision 6).
- **Its `$description`,** equal in both scheme files (`021` criterion 4): "The ground below the page, for a stage an example sits on or a well cut into a surface. Darker than the page in both schemes."
- **Its place in the order of grounds.** Light: `sunken` (OKLCH L 0.880) < `muted` (0.922) < `background` (0.955) < `card` (1.000). Dark: `sunken` (0.145) < `background` (0.192) < `card` (0.241) < `muted` (0.279). The values continue the system's own steps on the same warm hue (*the memo* §4).
- **Two contrast pairs join the contrast file:** `[foreground, sunken]` and `[muted-foreground, sunken]`, at 13.35 and 5.14 in light, 17.38 and 7.34 in dark (EXECUTED).
- **The counts move** by two primitives and one role per scheme, from wherever `029` and any earlier landing leave them. `021`'s and `029`'s count tests and the bench's `primitives`, `rolesPerTheme` and `contrastPairs` are updated in this build, and the landing notes record each, as `029` decision 10 did.
- **The DTCG paths are additions,** so `kuiper.removed.json` gains nothing (`021` decision 10). `kuiper.css` carries the role (`029` decision 14).
- *Why a new role:* every existing neutral ground is a fill some item paints, so any of them as a stage hides part of some picture (*the memo* §3). *Why below the page:* a stage is a well, and the example rises out of it. In dark, a stage lifted above `muted` (`#353129`) would leave every dark card and input in a picture darker than its ground, like a hole (*the memo* §4; Q3). Atlassian names the same ground "sunken", darker than its default surface in both schemes (RECALLED).
- *Why public, not private to the site:* the site's colours come from tokens (constitution §4.3), and a ground below the page is useful to an app as well: a drop zone, an inset well, a preview. Q2 offers the alternatives.

### 2. The stage differs from the page and the card by at least ΔE 2.5, in every scheme

**The rule.** In each scheme, `sunken` is at least ΔE 2.5 from every neutral ground, and its relative luminance is below `background`'s. The floor is the smallest step the system already draws between two grounds: `background` to `muted` in light, ΔE 2.51.

**Measured** (EXECUTED, `colour.py`):

| Scheme | `sunken` against | ΔE | Contrast |
|---|---|---|---|
| light | `background` | 5.92 | 1.26 |
| light | `card` (and every raised role) | 10.46 | 1.44 |
| light | `muted` (and every wash role) | 3.41 | 1.14 |
| dark | `background` | 2.74 | 1.08 |
| dark | `card` (and every raised role) | 6.35 | 1.21 |
| dark | `muted` (and every wash role) | 9.20 | 1.35 |

**Rendered** (EXECUTED, read from the exhibit's `png/a-1440-*.png`): after WebP the picture's ground reads `#DCD8C9` and `#0C0A08`. Stage to page: ΔE 6.13 and 2.94. Stage to card: ΔE 10.80 and 6.44. WebP moves the ground by under ΔE 1, so a test allows ΔE 1 between a picture's ground and `--sunken` (test 6).

**The 3:1 non-text rule does not apply to the stage.** A stage is not a control. The tile is a link, found and named by its title text. The pictures are decorative (`alt=""`, or `aria-hidden` on the first row). Atlassian's own stage sits at 1.06:1 to its card (*the memo* §2).

### 3. The card: A, the sunken band (Q1)

Three cards were drawn (*the memo* §5): A, a sunken band across the top of the card; B, a matted well set into the card; C, no card, a sunken stage on the page with the words below. This decision is A. Its anatomy, from `md`:

| Part | Today (`018`) | A |
|---|---|---|
| Tile (`a[data-slot="component-tile"]`) | `card` fill, one radius, 1 px `border` hairline (10% alpha) | `card` fill, one radius, **1 px transparent border** (decision 5) |
| Stage (`span`, new `data-slot="tile-stage"`) | `background`, 1 px `border` hairline below | **`sunken`**, full bleed across the top, 16 : 10, **no hairline** |
| Picture | 480 × 300 WebP on `background` | 480 × 300 WebP **on `sunken`** (decision 7) |
| Words | title (`font-medium`, underlined on hover), description, modes and since, `p-4` | unchanged |
| Grid | 2 columns at `md`, 3 from `lg`, `gap-4` | unchanged |

- *Why A:* it changes the fewest things. It keeps `018`'s tile, so its link, its target, its hover and its tests stand. It gives three grounds that each differ (page, card, stage), and it matches the closest reference, Atlassian's components index (*the memo* §2).
- *If Q1 is B:* the tile gains `p-2`; the stage takes the one radius and sits inside it; the words take `px-2 pt-3 pb-2`. Everything else stands.
- *If Q1 is C:* the tile loses its fill and its padding. The stage takes the one radius and the transparent border; the words sit below it on the page, `pt-3`; the grid's row gap becomes `gap-y-8`. Decision 2's "against card" rows then guard only the examples, not a tile.

### 4. Below `md`: one row form for every option

- Each row keeps `018`'s shape: a 96 × 60 picture at its start, the words beside it, the groove between rows.
- The picture's box takes `sunken`, the one radius and a 1 px transparent border, in place of the hairline and `background` (exhibit `png/a-390-light.png` and `-dark.png`).

### 5. Edges and depth

- **No visible edge on the tile or the stage.** The grounds draw the shapes: in light the card is ΔE 4.93 from the page and the stage 10.46 from the card; in dark 3.69 and 6.35.
- **Both carry a 1 px transparent border.** Forced colours paint a transparent border in the user's text colour (`028`, "the engines differ"), so the tile is outlined in that mode, where every ground is replaced.
- **Nothing is translucent.** The 10% hairline (`border-border`) goes. A fully transparent border is allowed by `019a` decision 3. So the tile meets `031b`'s rule before `031b` lands.
- The picture is an image, so forced colours leave it as it is.

### 6. How white examples stay visible

- **The stage differs from every surface an example can paint,** by decision 2's floor: from white (`card`, `popover`, `secondary`, `raised`, light `code-background`) by ΔE 10.46 in light, and from the dark raised roles by 6.35.
- **Examples are not changed.** Their own fills and edges are photographed as they are. Card's white panel, Utils' white code rows and Collapsible's white trigger now sit on `#DCD7CA` (exhibit `png/a-1440-light.png`).
- **Wash-filled parts stay visible too.** The tabs strip, skeleton bars and avatar fallbacks are `muted`, ΔE 3.41 above the stage in light and 9.20 in dark (exhibit `png/grounds-1440-*.png`).
- **One edge reads lower on the new ground.** An input's edge (`input`, `#857E70`) is 2.80:1 on light `sunken`, against 3.54:1 on paper. It reads 4.03:1 against the input's own white fill, so the control is still drawn whole. The picture is decorative; the item itself, on its own page, is unchanged (*the memo* §4).
- `site.css`'s `.site-thumb` rule, which chooses the first row's picture in CSS, is unchanged (`029` decision 15 has already moved its selector). Its box takes `bg-sunken` from the stage, so the ground shows before the picture paints.

### 7. The pictures: photographed on `sunken`, every pair regenerated

- **One change to `scripts/site/thumbnails.ts`.** Before photographing, the script adds one style rule to the page:

  ```css
  html, body, [data-slot="frame-stage"] { background-color: var(--sunken) !important; }
  ```

  - It reads the token by name, so the script holds no colour literal.
  - `!important` beats `frame-stage`'s `bg-background` utility. The rule exists only in the photographed page, never in the site.
  - The script's existing steps then follow by themselves: it reads the capture root's ground (now `sunken`), fills the canvas with it, trims it and centres the rest.
- **What an example or a view paints itself keeps its colour.** A view whose own markup paints the page's ground across its frame (a whole page) is drawn by the existing fit as a page inset on the `sunken` canvas: the fit always leaves at least 12 px of the ground around the content (`PAD`). So every picture's corners are `sunken`, and test 6 holds that.
- **Every pair is regenerated.** The script and `src/app.css` are both in every item's hash (`018` decision 13), so every picture goes stale. The builder runs `bun scripts/site/thumbnails.ts` and records the count, the total bytes, the time and any picture that changed in a way other than its ground.
- **`text-sizes.json` is regenerated with them.** No text size should move; the 9 px floor (`018` landing notes) still holds.
- *Why not a transparent picture, with the ground in CSS:* about a third more bytes (+29% light, +38% dark) on the page with the tightest LCP budget, and no saving in upkeep, since every theme change regenerates the pictures anyway (*the memo* §6).

### 8. The index's markup

In `src/routes/(site)/components/+page.svelte`, for A:

- the tile: `md:border-border` becomes `md:border-transparent`;
- the stage `span`: `border-border bg-background` becomes `border-transparent bg-sunken`; `md:border-b` is removed; it gains `data-slot="tile-stage"`;
- the pictures, the first row's CSS background, `data-thumb-scheme`, the lazy loading and the `<noscript>` picture are unchanged.

### 9. The budget

- **The `index` template: 395 kB transfer, 3,060 ms LCP, 0.02 CLS** (`024`). Measured at `024`: 355 kB and 2,776 ms.
- **Predicted change: under 1 kB.**
  - The pictures: the probe's per-picture change runs from −3.9% to +7.6%, and −1.1% light, +1.3% dark in total (*the memo* §6). The first screen's pictures are a few tens of kB, so the change is under 1 kB either way (INFERRED).
  - The role: one pair on `:root`, two hexes in the fallback, one utility in the index's CSS. Under 0.1 kB gzipped on every page (INFERRED from `029` decision 19's per-role weight).
  - The markup: two class names change length. Nothing measurable.
- **The builder measures it** under `024`'s profile at the checkpoint, and records the figure. If the index exceeds its budget, the design lead rules; the budget is not raised by this specification.
- **Repository weight:** today 150 pictures, 656,730 B (EXECUTED). Predicted within ±2%.

### 10. The component pages' own stages are not changed (Q4)

The example frames on each component page keep `bg-background`. So the index shows an example on `sunken`, and its page shows it on the paper. The frames are lane S's, ranked under `034` (the part first), which redraws the frame. *Why not now:* it changes every component page's look and every frame test, which the owner did not ask for and `034` will reopen.

### 11. Interface and changelog

- **`kuiper-theme`'s bullet:** "Adds `--sunken`, the ground below the page, for a stage or a well (`bg-sunken`). Run `add kuiper-theme` again to receive it." Nothing to migrate.
- **The token files:** two primitives and one role per scheme, as additions (decision 1).
- **The site:** no interface. The index's change is listed under the site's own changes for the release.

## Scope

**In:** the token files' two primitives and one role, and what `build:tokens` writes from them (`src/app.css`, `registry.json`, `static/r/`, `kuiper.css`, the DTCG files, the contrast file); `scripts/contrast.ts` (a `deltaE2000` function); `src/routes/(site)/components/+page.svelte`; `scripts/site/thumbnails.ts`; every picture, `manifest.json` and `text-sizes.json` under `src/lib/site/thumbnails/`; `CHANGELOG.md`'s one bullet; the tests below.

**Out:** any item's source; the component pages' frames (decision 10); `site.css` rules; the forced-colours rules of items (`028`); the depth lint (`031b`); high-contrast values (`031`).

## Tests to write first

Each is written before the change and seen failing for the reason given. E2E tests run against the production preview in `022`'s three engines; forced-colours readings run where `028` runs them (Chromium and Firefox). A test that passes today is proven by mutation, and the landing notes say which.

| # | Name | File | Asserts | Fails today because |
|---|---|---|---|---|
| 1 | `sunken` is a role | `tests/unit/tokens-dtcg.test.ts` | `paper-sunken` is `#DCD7CA` and `ink-sunken` `#0B0A07` in the base file. `role.sunken` aliases them in the light and dark scheme files, with equal `$description`. `kuiper-theme` declares `--sunken: light-dark(#dcd7ca, #0b0a07)` on `:root`, the fallback's sets hold each hex, and `cssVars.theme` holds `color-sunken` | no such tokens |
| 2 | ΔE is computed right | `tests/unit/contrast.test.ts` | `deltaE2000` reproduces Sharma, Wu and Dalal's (2005) 34 published test pairs to 4 decimal places, and `deltaE2000("#F3F0E8", "#E9E5DB")` is 2.51 to 2 places | no function |
| 3 | the stage differs from every neutral ground | `tests/unit/index-stage.test.ts` (new) | Read from the token files, in each scheme: `deltaE2000(sunken, r) >= 2.5` for every `r` in `background`, `sidebar`, `card`, `popover`, `secondary`, `raised`, `muted`, `accent`, `sidebar-accent`, `code-background`; and `relativeLuminance(sunken) < relativeLuminance(background)`. *Mutation:* dark `sunken` set to `#16140F` fails, naming `background` and `sidebar` | no role |
| 4 | text on `sunken` passes | `tests/unit/contrast.test.ts` | The pairs `[foreground, sunken]` and `[muted-foreground, sunken]` are in the contrast file and pass in both schemes, at 13.35, 5.14, 17.38 and 7.34 | no pairs |
| 5 | the stage differs from the page and the card, in pixels | `tests/e2e/index-cards.spec.ts` (new) | On `/components/` at 1440 and 390, light and dark: the first row's tiles and the six of the Surfaces group are scrolled into view and their pictures awaited. In a screenshot: the stage's ground is the pixel 12 px inside its top-left corner (clear of the radius); the card's is the pixel 12 px inside the tile's bottom-right corner; the page's is the pixel 8 px left of the grid. Asserted: ΔE(stage, page) ≥ 2.5 at both widths; ΔE(stage, card) ≥ 2.5 at 1440. The message names the tile, the width, the scheme and the three colours | stage is the page: ΔE 0 in both schemes |
| 6 | every picture's ground is the stage's | same | For every tile, in each scheme, the picture that scheme displays is drawn to a canvas in the page. Its four corner pixels are each within ΔE 1.0 of the stage element's computed `background-color`, and that equals `--sunken` resolved. *Mutation:* one picture replaced by today's fails, naming it | pictures are on paper and graphite: ΔE 6.1 and 2.9 from `sunken` |
| 7 | white examples stay visible | same | The pictures of `card`, `utils`, `collapsible`, `input` and `skeleton`, in each scheme: at least 2% of their pixels lie within ΔE 1 of `card`, and their corners are at least ΔE 2.5 from `card` | passes today (paper is ΔE 4.93 from white); proven by mutation: Card's picture photographed on `card` fails |
| 8 | solid, and edged under forced colours | same | Every tile and stage, at rest and with the tile hovered, at 1440 and 390, in both schemes: no background or border colour with alpha strictly between 0 and 1 (`019a` test 5's reader). With `forcedColors: "active"`, each tile at 1440 and each stage at 390 paints a 1 px edge whose colour differs from the page's | the tile's border is the 10% hairline (the forced half passes today; mutation: `border-0` fails it) |
| 9 | the pictures are fresh | `tests/unit/thumbnails.test.ts` (existing) | "each recomputed hash equals the manifest's" | fails after decisions 1 and 7 until the pictures are made again: every item is stale |
| 10 | the budget holds | `tests/e2e/perf.spec.ts` (existing) | The `index` template within 395 kB, 3,060 ms and 0.02 | a guard; it passes today |

## Acceptance criteria

1. `sunken` exists as decision 1 says, in both schemes, as one pair, with its primitives, its `$description` and its two contrast pairs. The counts are updated and recorded (tests 1, 4).
2. In each scheme, `sunken` is at least ΔE 2.5 from every neutral ground and darker than `background` (test 3).
3. On `/components/`, from `md`, each tile is the card the owner chose in Q1, with the stage on `sunken`. Below `md`, each row's picture box is on `sunken` (decisions 3, 4; test 5).
4. In a screenshot, at 1440 and 390, in both schemes, the stage is at least ΔE 2.5 from the page, and at 1440 from the card (test 5).
5. Every picture's corners are within ΔE 1 of `--sunken`, in both schemes (test 6). White examples hold their white, distinct from the ground (test 7).
6. No tile or stage has a translucent colour; each is outlined under forced colours (test 8).
7. Every pair is regenerated. The manifest and `text-sizes.json` match; no picture sets text below 9 px. The landing notes record the count, bytes and time (test 9).
8. The `index` template is within 395 kB, 3,060 ms and 0.02, and the measured figure is recorded (test 10).
9. `CHANGELOG.md` holds decision 11's bullet. `kuiper.removed.json` is unchanged.
10. **The checkpoint:** the design lead looks at the index at 1440, 768 and 390, in both schemes and under forced colours, and compares ten pictures with their pages. A ruling there goes in the landing notes.
11. The benchmark scorecard is re-run after landing, and its movement recorded (rows 6 and 7 are expected to hold).
12. Unit, `check`, `lint`, the literal lint, the release check, e2e in every project and smoke pass.

## Build order

1. Tests 1 to 4, seen failing.
2. The token edit, in lane T after `029`: the two primitives, the role, its words, the contrast pairs; `bun run build:tokens`. Tests 1 to 4 pass. The count tests are updated.
3. Tests 5 to 8, seen failing on today's index.
4. Decision 8's markup; decision 7's one rule in the script.
5. `bun scripts/site/thumbnails.ts`. Test 9 passes again. Record the figures.
6. Tests 5 to 8 pass. Test 10 and the full suites run.
7. The checkpoint (criterion 10).
8. The changelog bullet; the scorecard re-run; the landing notes.

## Risks

- **Dark is the narrow margin.** Stage to page is ΔE 2.74 by token and 2.94 rendered. On a dim or poorly calibrated screen a near-black step reads smaller. The checkpoint looks at it; Q3 offers the lifted alternative, which is wider but inverts the depth.
- **A third full regeneration in 0.13.0.** `020` and `029` each regenerate every picture. If `031a` lands right after `029`, the builder may run the script once for both, as long as `029`'s landing notes record their own count first.
- **The index and the page now show an example on different grounds** (decision 10), until `034` decides the frame.
- **A lane-T edit from a lane-S row.** It is two primitives and one role, queued in lane T after `029`. If lane T is held by `031`, the token edit waits, and the rest of `031a` waits with it, since its pictures need the role.

## Open questions for the owner

Each has options, the recommended one first.

**Q1. Which card?** See the exhibit, `png/a-1440-light.png`, `png/b-1440-light.png`, `png/c-1440-dark.png`, and each in the other scheme.

- **A, the sunken band (recommended).** Today's card, with the stage's ground below the page and the hairlines gone. Three distinct grounds; the least churn; closest to Atlassian's index.
- **B, the matted well.** The card becomes a mat round a rounded stage. It frames each picture most, and nests most: a well in a card on a page.
- **C, the open stage.** No card: a rounded sunken stage on the page, the words below it. Two grounds only, the calmest grid; closest to Spectrum's home page. The tile's extent is drawn by the stage alone.

**Q2. Which ground?**

- **A new public role, `sunken` (recommended).** It differs from every ground an item paints, and an app can use it for a well or a drop zone. It adds two primitives and one role, a lane-T edit.
- **`muted`, no new token.** It differs from page and card, but parts of six examples vanish into it: the tabs strip, skeleton bars, avatar fallbacks, the table footer, the empty state's media and, in dark, the message's code (`png/grounds-1440-*.png`).
- **The same two values as a private site variable,** written by the generator like `029`'s `--ink-ground`, not in `kuiper.css` or the DTCG files. The site keeps the look; apps do not get the role.

**Q3. In dark, below the page or above it?**

- **Below the page, `#0B0A07` (recommended).** The stage is a well in both schemes, and dark cards and inputs rise out of it. Stage to page ΔE 2.74.
- **Above `muted`, `#353129`.** Stage to page ΔE 9.42, plainly visible on any screen; but every dark card and input in a picture sits darker than its ground, like a hole, and the scheme's depth runs the other way from light.

**Q4. The component pages' own example stages?**

- **Leave them on the page's ground until `034` redraws the frame (recommended).** The owner's words named the index; `034` reopens the frame anyway.
- **Move them to `sunken` in `031a`.** The index and the pages then agree, at the cost of every component page's look and its frame tests changing in this row.

## Review

Not yet reviewed.

## Landing notes

None yet.
