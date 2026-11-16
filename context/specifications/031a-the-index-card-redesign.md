# 031a — The index card redesign

- **Status:** Ready to build, first in lane T in wave 3, after `029`. Its reviewer found it ready on the third look, with a cross-check that `031a`, `031b` and `031` agree ([`../reviews/031a-the-index-card-redesign-spec-2026-11-15.md`](../reviews/031a-the-index-card-redesign-spec-2026-11-15.md), "Third look"). The owner answered Q1 to Q5 on 2026-11-15, Q1 changed to B the same evening (Landing notes). Not built. History:
  - The spec review, [`../reviews/031a-the-index-card-redesign-spec-2026-11-15.md`](../reviews/031a-the-index-card-redesign-spec-2026-11-15.md), said **revise**. Its first re-check said **ready**, with R1 to R4. Its second re-check, after the owner's answers, said **revise**, with S1 to S6 and ten items for card B. All are answered under "Review response".
  - The owner answered Q1 to Q5 (Landing notes). Q1 changed the same day from A to **B, the matted well**. Q2 chose a **public role**, which this spec had not recommended. Q5 chose to **restrict the pairs**.
  - The design lead ruled on the second re-check's findings under the owner's overnight delegation (Landing notes, "The design lead's rulings"). No question is open.
- **Date:** 2026-11-15
- **Author:** the spec author for `031a`, for the design lead
- **Kind:** a feature in lane T and lane S.
  - **Lane T:** one public colour role, two primitives, one utility and the contrast file's rows.
  - **Lane S:** the Components index, redrawn as card B; the thumbnail script; every thumbnail.
  - **Interface changes:** additive only.
    - `kuiper-theme` gains the role `--sunken`, its utility `bg-sunken`, and the utility `surface-sunken` (decision 1b).
    - The token files gain two primitives and one role per scheme. The contrast file gains `sunken`'s allowed rows and a `restricted` block (decision 1a).
    - No existing name, value or default changes. An installed app is unaffected until it adds `kuiper-theme` again.
  - One changelog bullet (decision 11). No dependency.
- **Lanes:**
  - **T, first:** the primitives, the role, `surface-sunken`, the contrast rows, the validator's new key, and what `build:tokens` writes from them. It queues after `029` and before `031b` and `031` (Knock-ons).
  - **S:** `src/routes/(site)/components/+page.svelte`, `scripts/site/thumbnails.ts`, `src/lib/site/thumbnails/`, and the site's contrast tables and tokens page.
  - **I, by test only:** a new literal-lint rule over item files (test 12). No item's source changes.
  - **Overlap with `030`:** `030` is also lane S, in wave 2. It touches the component pages, `scripts/status/`, `package.json`'s `build` and the release check. It does not touch `/components/` or the thumbnail script (READ, `030`). The two share no file.
- **Written against the renamed and scoped tree.** `020` merged at `44cec73`, so the tree reads `kuiper`: `kuiper-theme`, `tokens/kuiper.tokens.json`. `029` lands before this. So every colour is one `light-dark()` pair, a scheme is set by `data-scheme`, and the index's pictures carry `data-thumb-scheme` (`029` decision 15).
  - The picture forecasts ran on the main tree's existing `build/`, the 0.12.0 site, with `pluto-theme` in place of `kuiper-theme`. No colour it paints is renamed.
- **Depends on:**
  - `029`: the pairs, `data-scheme`, `data-thumb-scheme`, the fallback, decision 7's rule that every colour key gets a utility, and the `--surface-*` copies.
  - `021`: the DTCG files and `$description`.
  - `024`: the `index` template's budget.
  - It honours `019a` decision 3 (transparency signifies depth), `011` decision 6 (fields and `surface-plain`), and `028`'s finding that forced colours paint a transparent border in Chromium and Firefox.
- **Blocks:**
  - **`031b`:** it extends `surface-sunken` and the capture rule, adds `sunken-line`, and writes two disabled rows into the `restricted` block (decision 1b; Knock-ons).
  - **`031`:** it adds `sunken`'s rows under `more` and re-derives three light swatches (Knock-ons).
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `031a`, depends on `029`. The owner's Q2 answer grows the row's lanes from S to T and S; the roadmap entry is the design lead's to update.
  - Scorecard rows 6 and 7: held. Row 4, theming: held (one role added).
- **Research it stands on:**
  - [`../research/2026-11-15-index-cards.md`](../research/2026-11-15-index-cards.md), cited as *the memo*, by section. Its §2 Spectrum row is corrected here (review finding 8). Its §6 byte figures are replaced by the pipeline's (decision 9).
  - Its exhibit, [`../research/2026-11-15-index-cards/`](../research/2026-11-15-index-cards/): the mock-ups, `probe.ts`, `probe-bytes.json` and `colour.py`.
  - *The review*, and its probes in the session scratchpad, `031a-review/`.
  - *The revision probe*, in the session scratchpad, `031a-rev/`:
    - `thumbs.ts`: the real thumbnail script with decision 7, at the old 300 px shown width;
    - `thumbs-b.ts`: the same at B's 275 px, and its output, `out-b/`;
    - `analyse.py` and `analyse-b.py`;
    - `views-*.png`: the forms of a view's picture;
    - `b-exhibit.html` and `b-1440-light.png` / `b-1440-dark.png`: card B with the revised pictures.
  - The prior art on recessed grounds (READ):
    - Primer's `adr-010-color-contrast.md`, `colorContrast.config.ts` and `bgColor.json5`;
    - Carbon's `src/pages/elements/color/usage.mdx`.
  - Other specs:
    - `018` decision 13; `029` decisions 6, 7, 10 and 15;
    - `031` decisions 6 and 13 and its rule for new grounds;
    - `031b` decisions 3 and 11;
    - `001` decision 8 and `011` decisions 6 and 11;
    - `019a` decision 3; `024`'s `index` row; `028` decision 2.

## The problem, in the owner's words

The owner found the Components index card's "thumbnail on the page's own paper, inside a white card on that paper, reads as background on background, and white examples sit white on white" (the owner, 2026-11-15; roadmap row `031a`).

Measured, that is exactly what the build does (*the memo* §1; the review, "What holds"; EXECUTED):

- On `/components/` the picture's ground is `background` in both schemes: `rgb(243, 240, 232)` in light and `rgb(22, 20, 15)` in dark.
- The tile is `card`, on a `background` page. So the picture is a window back onto the page.
- A white example, such as Card or Collapsible, meets the tile's white at the stage's edge.
- The ground is in the picture's pixels. The thumbnail script fills each picture with its capture root's ground (READ, `scripts/site/thumbnails.ts`).

So the fix is a new ground for the stage, and new pictures. The owner asked that the new ground be a public role, so apps can use it too (Q2).

## Terms

- **Stage:** the area of a tile that a picture sits on.
- **Mat:** card B's white (light) or `card` (dark) frame, 8 px wide, around the stage.
- **Ground:** the flat colour of a surface.
- **ΔE:** CIEDE2000 colour difference. It is computed from sRGB hex, through CIELAB (D65), with the exact CIE constants.
- **Neutral grounds:** the colour roles an item may paint as a surface. In each scheme they resolve to three values:
  - paper or graphite: `background`, `sidebar`;
  - raised or ink-raised: `card`, `popover`, `secondary`, `raised`, and `code-background` in light;
  - wash or ink-wash: `muted`, `accent`, `sidebar-accent`, and `code-background` in dark.
- **Pair:** a foreground or a line, and the ground it sits on, as the contrast file lists them.
- **Context:** a scheme (light or dark) at a contrast (standard or `more`, `031`).
- **Restricted pair:** a pair the contrast file names as not allowed, in every context. A lint and a browser test keep it out of every item and every site page.
- **Well:** an element painted with `surface-sunken`.
- **View:** a block's or composition's first view, photographed as a page (`018` decision 13). There are 17.
- **Frame median:** the per-channel median of a picture's outer 4 px.
- **Shown width:** the width at which the index displays a 480 × 300 picture.

## What the research found

- **No reference shows a preview on the page's own ground inside a card of another colour** (*the memo* §2, READ; colours EXECUTED from the screenshots):
  - **Atlassian's index** tints its stage `#F8F8F8` below a white card, with a `#DDDEDD` edge.
  - **Carbon** draws its pictures straight onto white tiles. It draws white surfaces `#F3F3F3`.
  - **Spectrum's page** is `#F7F7F7`, and its white cards sit on it with a soft shadow, at ΔE 1.60 (1.07:1). In dark, `#111111` on `#000000`, ΔE 2.96. (Corrected, review finding 8.)
  - **Radix** shows the example on the page's ground with a 1 px edge.
- **`muted` hides parts of six examples** (*the memo* §3; confirmed by the review): the tabs' pill strip, a skeleton row, every avatar fallback, the table's footer, the empty state's media and, in dark, the message's code block.
- **A ground below the page separates the stage:** `#DCD7CA` in light and `#0B0A07` in dark. It is at least ΔE 2.74 from every neutral ground (*the memo* §4).
- **As a public ground, light `#DCD7CA` fails many of the system's pairs.** Measured at standard contrast (EXECUTED; the review, finding 2 and S1):

  | Pair on `sunken` | Kind | Light | Dark | Floor |
  |---|---|---|---|---|
  | `destructive` | text | **4.18** | 9.33 | 4.5 |
  | `success` | text | **4.09** | 9.28 | 4.5 |
  | `caution-text` | text | **3.99** | 14.20 | 4.5 |
  | `input` | non-text | **2.80** | 4.22 | 3 |
  | `caution` (fill) | non-text | **1.40** | 14.20 | 3 |
  | `chart-3` | non-text | **1.40** | 14.20 | 3 |
  | `destructive-fill`, `chart-2` | non-text | 3.91 | 9.33 | 3 |
  | `success-fill`, `chart-4` | non-text | 3.46 | 9.28 | 3 |
  | `chart-1` | non-text | 4.89 | 9.33 | 3 |
  | `chart-5` | non-text | 5.14 | 7.34 | 3 |
  | `foreground` | text | 13.35 | 17.38 | 4.5 |
  | `muted-foreground` | text | 5.14 | 7.34 | 4.5 |
  | `primary` | text | 4.89 | 9.33 | 4.5 |
  | `ring` | non-text | 4.89 | 9.33 | 3 |

- **Under `031`'s high contrast, in light, more fail** (the review, S1, EXECUTED):
  - `primary` text: `blue-more` `#2236C3` reads 6.13, against 7.
  - `muted-foreground`: `ink-soft-more` `#444A55` reads 6.20, against 7.
  - `input` and the lines: `line-more` `#6D6659` reads 3.96, against 4.5.
  - The reused `red` reads 3.91, `green-text` 4.09 and `yellow-text` 3.99 as non-text, against 4.5.
  - Dark passes everything, at 6.09 or more.
- **`031b`'s disabled roles fail its own floors on light `sunken`:** `disabled-foreground` reads 2.76 (floor 3:1), and `disabled-edge` 1.39 (floor 1.5:1) (`031b`'s re-check, R3).
- **How the references treat a recessed ground** (READ unless marked):
  - **Primer's** `bgColor-inset` ("Inset background for recessed content areas like wells or sunken panels") equals `bgColor.muted` in light. Its contrast check runs every status text on it.
  - **Carbon** keeps text tokens the same on every layer, "because they have enough contrast not to need a change with each layer". It changes tokens by context where a layer needs it.
  - **Atlassian's** `elevation.surface.sunken` is light enough that its text passes (RECALLED).
  - **No reference restricts which text sits on a neutral ground.**
- **Kuiper's own contrast file does restrict pairs.** Every coloured ground lists only the foregrounds allowed on it. Until `029` it held a `forbidden` block, "no state tint on muted" (`001` decision 8), measured in light and kept "by rule" in dark (`011` decision 11).

## Decisions

### 1. `sunken`: a public role (the owner, Q2)

- **Two primitives join the base file:** `paper-sunken` `#DCD7CA` and `ink-sunken` `#0B0A07`. Each has its `$description` and `$extensions["co.plutosystems.kuiper"]: { "since": "0.13.0" }`.
- **The role `sunken` joins both scheme files,** aliasing them.
  - Its CSS name is `--sunken`, and its utility `bg-sunken` (`029` decision 7).
  - `kuiper-theme` writes `--sunken: light-dark(#dcd7ca, #0b0a07)` on `:root`, and the fallback's two hex sets each gain one line (`029` decision 6).
  - `kuiper.css` carries it, as a role. Its header gives `surface-sunken`'s declarations to copy (decision 1b; S6).
- **Its `$description`,** equal in both scheme files: "The ground below the page, for a well or an inset region. Paint it with surface-sunken. On it, set text in foreground, muted-foreground or primary. Set status messages, controls, badges and charts on a surface-plain card inside the well."
- **The order of grounds:**
  - Light: `sunken` (OKLCH L 0.880) < `muted` (0.922) < `background` (0.955) < `card` (1.000).
  - Dark: `sunken` (0.145) < `background` (0.192) < `card` (0.241) < `muted` (0.279).
- **The counts** move by two primitives and one role per scheme. `contrastPairs` counts the allowed rows only; restricted rows are counted by test 4, and the bench gains no key. The count tests and the bench are updated in this build, and the landing notes record each.
- **The DTCG paths are additions,** so `kuiper.removed.json` gains nothing (`021` decision 10).
- **No private site variable.** `--sunken` is in `src/app.css`, which every route loads, the view routes included.

### 1a. What may sit on `sunken`: the allowed and the restricted pairs (the owner, Q5; the design lead, S1)

**Allowed on `sunken`,** in every context. These are the contrast file's rows for the ground:

- **Text:** `foreground`, `muted-foreground`, `primary`.
- **Non-text:** `ring`.
- **Lines:** `sunken-line` (`031b`; its decorative floor is 1.1:1).

**Restricted on `sunken`,** in every context. These are the `restricted` block's rows. Each row has a kind (`text` or `nonText`, the contrast file's own spelling), a floor and a reason.

| Pair | Kind | Floor | Light, standard | Reason |
|---|---|---|---|---|
| `destructive` | `text` | 4.5 | 4.18, measured | status text: on a `surface-plain` card |
| `success` | `text` | 4.5 | 4.09, measured | status text |
| `caution-text` | `text` | 4.5 | 3.99, measured | status text |
| `input` | `nonText` | 3 | 2.80, measured | control edge: controls go on a card |
| `caution` | `nonText` | 3 | 1.40, measured | status fill |
| `destructive-fill` | `nonText` | 3 | by rule (3.91; under `more` 3.91 against 4.5) | status fill |
| `success-fill` | `nonText` | 3 | by rule (3.46; under `more` 4.09 against 4.5) | status fill |
| `chart-1` to `chart-5` | `nonText` | 3 | `chart-3` 1.40, measured; the rest by rule | charts go on a card |
| `disabled-foreground` | `text` (disabled; `031b`'s floor) | 3 | 2.76, measured | `031b`'s floor |
| `disabled-edge` | `nonText` (disabled; `031b`'s floor) | 1.5 | 1.39, measured | `031b`'s floor |

How the block works:

- **Measured** means the pair fails its floor in that context, and the row records the ratio.
- **By rule** means the pair passes there but is restricted anyway. An item cannot change its colours by scheme or by contrast, so a pair restricted in one context is restricted in all. Dark is by rule throughout.
- `031` adds each row's `more` readings when it lands. `031b` writes the two disabled rows when its roles land, since they do not exist at `031a`'s landing.
- **The block is a ground's contract, a new key with a new purpose.** It passes `029`'s T8 ("No `tints` or `forbidden` key remains") by its letter. Its purpose is not the retired tint rule (S1 "What holds").

*Why restrict, and not darken or lighten.* The routes were compared in the previous revision, with figures:

- **(b) Lightening `sunken` until every pair passes** brings it within ΔE 1.68 of `muted`.
- **(c) Darkening the status roles** shifts the brand's status colours by ΔE 2 to 3.5. It also moves `029`'s tints and `031`'s swatches.
- **(c′) Darkening them inside the well only** needs four more primitives and more `031` swatches.

The owner chose (a), restrict (Q5). The design lead extended it to the status fills and the charts (S1), for the same reason as the text: an item cannot change by context.

*Is it honest under §4.4?*

- Every item meets AA, and tests 12 and 13 prove it.
- A ground that lists the foregrounds allowed on it is the contrast file's contract for every coloured ground.
- It departs from the references, which let every text sit on their recessed ground. This spec says so.

*What it means for an app:* charts, status badges, status messages and controls go on a `surface-plain` card inside a well, or on `card` or `background`. A well holds text, links, focus rings and dividers.

### 1b. `surface-sunken`: one declaration list, written by two specifications (S2, S6)

`kuiper-theme` gains one utility, `surface-sunken`, in the `surface-*` family. Its full declaration list, in order, once `031b` has landed:

```css
@utility surface-sunken {
  /* 031a: surface-plain's restorations, generated from SURFACE_ROLES (011 decision 6) */
  --foreground: var(--surface-foreground);
  --muted-foreground: var(--surface-muted-foreground);
  --card-foreground: var(--surface-card-foreground);
  --primary: var(--surface-primary);
  --ring: var(--surface-ring);
  --primary-foreground: var(--surface-primary-foreground);
  /* 031a: the ground and its text */
  background-color: var(--sunken);
  color: var(--foreground);
  /* 031b: the ground and the lines inside the well */
  --background: var(--sunken);
  --border: var(--sunken-line);
  --groove-line: var(--sunken-line);
  --sidebar-border: var(--sunken-line);
}
```

**Who writes which lines:**

- **`031a` writes the restorations and the two paint lines.** The restorations come from the same `SURFACE_ROLES` list that writes `surface-plain`, less the roles the well sets itself (`border` now; after `031b`, also `background`, `groove-line` and `sidebar-border`). So the two cannot drift, and no role is written twice.
  - Until `031b` lands, that list includes `border`, so `031a`'s utility also writes `--border: var(--surface-border)`.
  - A well inside a field then gets the theme's text, not the field's legend (S2). Without the restorations, white on light `sunken` reads 1.44:1, and the dark legend on dark `sunken` 1.08:1.
- **`031b` writes the four line and ground lines**, after the restorations, so each wins over any restoration of the same name.
  - `031b` replaces `031a`'s `--border` restoration with `--border: var(--sunken-line)`.
  - `031b` extends `surface-plain` to restore `--background`, `--groove-line` and `--sidebar-border` too.
  - Those three are not added to `surface-sunken`'s restorations, since `031b` sets them to the well's own values just after.
- **A card inside a well takes `surface-plain`.** That restores the page's `--background`, `--border`, `--groove-line` and `--sidebar-border`, so a divider on the card reads as it does on any card. Without it, a dark divider on a card in a well reads 1.02:1 (`031b`'s re-check, R1). The role's words say "on a `surface-plain` card".

**Other rules for the utility:**

- **In items, `sunken` is painted only through `surface-sunken`** (test 12). Apps may use `bg-sunken`, but the role's words point to `surface-sunken`.
- **`kuiper.css` carries no utilities** (`021` decision 11). So its header comment, and the role's row on `/foundations/tokens/`, give the declaration list above to copy, for apps without Tailwind (S6).
- **Test 1 asserts the list, and its order.**

### 2. The stage's ground differs from every neutral ground by at least ΔE 2.5: a regression guard

**The rule.** In each scheme, `sunken` is at least ΔE 2.5 from every neutral ground, and its relative luminance is below `background`'s.

**The margins** (EXECUTED, `colour.py`, exact CIE constants; reproduced by the review):

| Scheme | `sunken` against | ΔE | Contrast |
|---|---|---|---|
| light | `background` | 5.92 | 1.26 |
| light | `card` (and every raised role) | 10.46 | 1.44 |
| light | `muted` (and every wash role) | 3.41 | 1.14 |
| dark | `background` | 2.74 | 1.08 |
| dark | `card` (and every raised role) | 6.36 | 1.21 |
| dark | `muted` (and every wash role) | 9.20 | 1.35 |

**Where each edge falls in card B** (the review's second re-check, item 5):

- **From `md`, the stage meets only the mat,** on all four sides: ΔE 10.46 in light and 6.36 in dark.
- **The tile's outline is the mat against the page,** all round: ΔE 4.92 in light and 3.69 in dark.
- B therefore has no edge drawn by stage against page. A's weak dark top edge (2.74) is gone.
- **Below `md`, the row's picture box sits on the page:** ΔE 5.92 in light and 2.74 in dark. That is now the only place the thin dark step shows.

**What the floor is, and is not:**

- **It is a regression guard.** A later token change cannot bring the stage onto a ground an example paints.
- **It is not a proof of visibility.**
  - In dark, the system's own smallest step is `card` to `muted`, ΔE 2.96. The page step, 2.74, is below it.
  - The dark stage and page sit at about 0.24 and 0.56 cd/m², where CIEDE2000 is not validated.
  - `#0B0A07` lies below code 16, so limited-range video crushes it.
  - So the checkpoint looks at the phone rows in dark on a dim LCD (criterion 10).

**Rendered** (EXECUTED, the revision probe at B's width): the frame median sits within ΔE 1.11 (light) and 0.69 (dark) of `sunken` in every picture, and at least ΔE 6.13 and 2.94 from the page.

**The 3:1 non-text rule does not apply to the stage itself.** It is not a control. The tile is a link, named by its title. The pictures are decorative.

### 3. The card: B, the matted well (the owner, Q1)

**The anatomy, from `md`.** The tile is 293 px wide at 1440 and above (measured, the review). Its 1 px border and 8 px mat leave a 275 px stage.

| Part | Today (`018`) | B |
|---|---|---|
| Tile (`a[data-slot="component-tile"]`) | `card` fill, one radius, 1 px `border` hairline (10% alpha), `md:py-0` | `card` fill (the mat), one radius, **1 px transparent border**, **`md:p-2`** (8 px) |
| Stage (`span`, new `data-slot="tile-stage"`) | `background`, square corners from `md`, 1 px hairline below | **`sunken`**, **the one radius** (`md:rounded`), `overflow-hidden` so the picture is clipped to it, **no border** |
| Picture | 480 × 300 WebP on `background`, shown 291 × 182 at 1440 | 480 × 300 WebP **on `sunken`**, **shown 275 × 172 at 1440** (scale 0.573) |
| Words | `md:p-4` | **`md:px-2 md:pt-3 md:pb-2`**: 16 px from the tile's edge, aligned with the stage's inner content |
| Grid | 2 columns at `md`, 3 from `lg`, `gap-4` | unchanged |

**Measured tile widths** (the review, EXECUTED):

| Viewport | Tile | Stage (tile − 18) |
|---|---|---|
| 768 | 345 | 327 |
| 1023 | 463 | 445 |
| 1024 (three columns start) | 218 | 200 |
| 1180 | 266 | 248 |
| 1280 | 297 | 279 |
| 1440 and above | 293 | 275 |

- **The corners are not concentric.** The stage's 8 px radius sits 8 px inside the tile's 8 px radius. Under the one-radius rule, that is accepted. The exhibit shows it (`b-1440-*.png`), and the checkpoint looks at it.
- *Why B:* the owner's choice ("I like this structure"). It frames each picture with the mat on all four sides, so the stage never meets the page from `md`.

### 4. Below `md`: one row form

- Each row keeps `018`'s shape: a 96 × 60 picture at its start, the words beside it, and the groove between rows.
- The picture's box takes `sunken`, the one radius and a 1 px transparent border.

### 5. Edges and depth

- **No visible edge on the tile or the stage.** The grounds draw them (decision 2).
- **A 1 px transparent border sits on two boxes:** the tile from `md`, and the row's picture box below `md`. The inset stage has none.
- **Under forced colours** (Chromium and Firefox), the transparent borders are painted, so the tile and the row's box are outlined. The mat and the stage both become `Canvas`; the picture keeps its own ground. WebKit paints none, and `028` does not run there.
- **Nothing is translucent,** at rest or hovered. The 10% hairline goes. A fully transparent border is allowed by `019a` decision 3.

### 6. How white examples stay visible, and what a well carries

- **The stage differs from every surface an example can paint,** by decision 2's margins.
- **Examples are not changed.** Their own fills and edges are photographed as they are. The share of pixels within ΔE 1 of `card` runs from 4.31% to 54.75% (the review).
- **Wash-filled parts stay visible:** ΔE 3.41 above the stage in light, 9.20 in dark.
- **Restricted pairs inside the pictures.** A picture may show `destructive` text, a chart or an `input` edge, drawn on the example's own field or panel. The picture is decorative, so WCAG does not bind it. Test 13 checks live markup; on the index, the stage holds only an image.
- **`avatar-group`'s `border-background` cut-out.** Inside a well, `031b`'s `--background: var(--sunken)` makes the cut-out match the well, so no paper ring shows. The capture rule carries the same line, so the pictures match.
- `site.css`'s `.site-thumb` rule is unchanged. Its box takes `bg-sunken` from the stage.

### 7. The pictures: the stage repainted, two colours split, views drawn as a window, the floor at B's width

**Four changes to `scripts/site/thumbnails.ts`.**

1. **One style rule, on the example stage only.** Before photographing an example, the script adds:

   ```css
   [data-slot="frame-stage"] {
     background-color: var(--sunken) !important;  /* 031a */
     --background: var(--sunken);                  /* 031b */
     --border: var(--sunken-line);                 /* 031b */
     --groove-line: var(--sunken-line);            /* 031b */
     --sidebar-border: var(--sunken-line);         /* 031b */
   }
   ```

   - It never touches `html` or `body`, so a view's own page keeps its ground.
   - `031a` writes the first line. `031b` adds the other four (`031b` decision 11).
   - It holds no colour literal.
2. **Two colours, where today there is one.**
   - **The trim colour** stays as today: the capture root's own computed ground. For an example, that is `sunken`. For a view or an open overlay, it is the page's.
   - **The canvas fill** is always the resolved `--sunken`. The script resolves it once per scheme, before the loop, from a probe element on `/components/`. It stops with an error naming the scheme if the read fails.
3. **A view is drawn as a window of its own page.**
   - The trimmed content is centred, and a rectangle of the view's own ground is drawn behind it.
   - The rectangle extends 16 px past the content on each side, and is kept at least 8 px inside the picture's edge.
   - Its corners take the one radius at the shown scale: **`--radius` × 480 / shown width**, which is 14 px at B's 275 px (review item 4).
   - **The window is drawn for views only.** Examples and open overlays get none.
4. **The 9 px floor is measured at B's shown width at 1440** (review item 3).
   - `SHOWN` becomes `275 / 480`, from `300 / 480`. So the picture's smallest text is at least 9 px as the 1440 tile shows it.
   - The script reads the shown width from one constant, named for decision 3. A later change to the tile changes it there.
   - **Forecast** (the revision probe, `thumbs-b.ts`, EXECUTED, 148 pictures): 42 of 148 `text-sizes.json` entries change, and the least is still 9.00.
   - Pictures near the floor are drawn larger, so their crops are tighter. Card's "Rerun" and `chat`'s "No m…" lose more of their right edge (`b-1440-light.png`). The checkpoint names each.
   - Frame medians are unchanged: at most ΔE 1.11 and 0.69 from `sunken`.
   - The views keep their page: the least share is 6.7% (`name-strip`, light). The longest stage-coloured run across a view's middle lines is 13 px.

**A finding older than this spec, carried to `034`.** At three columns below 1280 the stage is narrower than 275 px: 200 px at 1024 and 248 px at 1180. A picture at the floor then shows its smallest text at about 6.5 px at 1024 (9 × 200 / 275). Today's tiles already show it at about 6 px there (`018`'s `SHOWN` assumed 300 px). `031a` keeps the floor at 1440. The narrow three-column range is `034`'s to fix, by a later column break or a smaller-text rule, and is recorded in its row.

**What was compared** (EXECUTED; `views-light.png`, `views-dark.png`):

- the draft's `html, body` rule, which repaints views;
- trim only, which gives paper slabs;
- the window, which is chosen;
- the whole 800 × 500 frame, which puts 14 px text at about 4.6 px. Rejected.

**Every pair is regenerated, once per wave.** `028`, `029`, `031b`, `031` and this spec each stale every picture. So the pictures are a ledger: each landing records its own stale count, and the pictures are made once, at the wave's last landing.

### 8. The index's markup

In `src/routes/(site)/components/+page.svelte`:

- **The tile:**
  - `md:border-border` becomes `md:border-transparent`;
  - `md:py-0` becomes `md:p-2`.
- **The stage `span`:**
  - `border-border bg-background` becomes `border-transparent bg-sunken`;
  - `md:rounded-none` is removed, so the stage keeps `rounded`, the one radius, at every width;
  - `md:border-b` is removed, and `md:border-0` stays;
  - it gains `data-slot="tile-stage"`.

  The stage holds only an image, so it uses the bare utility. The site is not an item, so test 12 does not bind it; test 13 does.
- **The words `span`:** `md:p-4` becomes `md:px-2 md:pt-3 md:pb-2`.
- **Unchanged:** the pictures, the first row's CSS background, `data-thumb-scheme`, the lazy loading and the `<noscript>` picture.

### 9. The budget

- **The `index` template:** 395 kB transfer, 3,060 ms LCP, 0.02 CLS (`024`). It was measured at 355 kB and 2,776 ms.
- **The pictures, measured with the real script:**

  | Run | Before | After | Change | Light | Dark | Per picture |
  |---|---|---|---|---|---|---|
  | The review's run, the draft's rule (150) | 656,730 B | 665,940 B | +1.40% | +1.12% | +1.70% | −12.4% to +23.1% |
  | Decision 7 at 300 px shown (148) | 647,178 B | 657,266 B | +1.56% | +1.48% | +1.64% | −5.7% to +23.1% |
  | **Decision 7 at B's 275 px (148)** | 647,178 B | 653,900 B | **+1.04%** | +0.85% | +1.24% | −26.6% (`name-strip`, dark) to +33.7% (`tabs`, dark) |

  - The last row is the forecast. The builder's run is the record.
  - The probe's build predates `kuiper-theme`, so the theme item's pair is absent.
- **The role on every page:** under 0.1 kB gzipped (INFERRED). B adds two padding classes.
- The builder re-measures `index` under `024`'s profile at the checkpoint. If it exceeds its budget, the design lead rules.

### 10. The component pages' own stages are not changed (the owner, Q4)

- The example frames keep `bg-background` until `034`.
- `034` can move them with `surface-sunken`. Test 13 then checks that no example puts a restricted pair on the stage.
- `034` also inherits the three-column floor finding (decision 7).

### 11. Interface and changelog

- **`kuiper-theme`'s bullet:** "Adds `--sunken`, a ground below the page for a well or an inset region (`bg-sunken`, `surface-sunken`). On it, set text in foreground, muted-foreground or primary. Set status messages, controls, badges and charts on a surface-plain card inside the well. Run `add kuiper-theme` again to receive it."
- **The token files:** two primitives and one role per scheme, as additions. The contrast file gains `sunken`'s rows and the `restricted` block.
- **Migration:** none.
- **The site:** the index's change is listed under the site's own changes for the release.

## Knock-ons, for the other specifications to follow

**Lane T order: `031a`, then `031b`, then `031`.**

**`031` (high contrast).** By its own rule, a new public ground comes with its rows (`031` decision 6). So `031` must:

1. Add `sunken` to its `more` rows for every **allowed** pair: `foreground`, `muted-foreground` and `primary` at 7:1; `ring` at 4.5:1; `sunken-line` as one of its line rows.
2. **Re-derive three light swatches** that fail on `sunken`, and send each to the owner before it lands. `031` has derived them exactly, by its rules 1 to 7 (`031` decision 5); the review's estimates are in brackets:

   | Swatch | Today | On `sunken` | `031`'s derived value | On `sunken` |
   |---|---|---|---|---|
   | `ink-soft-more` | `#444A55` | 6.20 | `#3D424D` (`#3C424D`) | 7.01 |
   | `line-more` | `#6D6659` | 3.96 | `#645D50` (`#645D50`) | 4.53 |
   | `blue-more` | `#2236C3` | 6.13 | `#1D2AB8` (`#1C2AB8`) | 7.04 |

   Each darkening also raises that swatch's ratio on every other ground.
3. **Add the `more` readings to every `restricted` row.** The rows stay restricted, and get no `-more` value on `sunken`. The status fills and charts fail 4.5:1 there in light: `red` 3.91, `green-text` 4.09, `yellow-text` 3.99. They are recorded as measured.
4. **Dark needs nothing new.** Every dark `-more` swatch passes on `#0B0A07`, at 6.09 or more.

**`031b` (transparency signifies depth).** As its decision 11 now reads, `031b` must:

1. Add the public role `sunken-line` (`#C7C3B8`, `#22211E`; 1.23:1 on `sunken`), with the contrast row `[sunken-line, sunken]` at its decorative floor of 1.1:1.
2. Write its four lines into `surface-sunken`, after `031a`'s restorations, replacing `031a`'s `--border` restoration (decision 1b). The same four go into the capture rule (decision 7).
3. Extend `surface-plain` to restore `--background`, `--groove-line` and `--sidebar-border`, so a `surface-plain` card inside a well reads as a card (`031b`'s re-check, R1).
4. Write two rows into `031a`'s `restricted` block, when its disabled roles land: `disabled-foreground` (2.76, floor 3:1) and `disabled-edge` (1.39, floor 1.5:1), restricted in every context. Tests 12 and 13 read the block, so they cover both rows with no change of their own.
5. Revise its order sentence: `031a` first, not "before or after".

## Scope

**In:**

- the two primitives, the role, `surface-sunken` (`031a`'s lines), and what `build:tokens` writes (`src/app.css`, `registry.json`, `static/r/`, `kuiper.css` with its header's copyable list, the DTCG files);
- the contrast file's `sunken` rows and `restricted` block;
- `scripts/tokens.ts`'s contrast types and validator: the new key, each row's kind and floor, measured and by-rule readings (S5);
- `scripts/contrast.ts`: reading the block, and `deltaE2000`;
- the site's contrast tables (`src/lib/site/foundations/tables.ts`), which follow the file (`029` decision 10): `sunken`'s allowed rows, and its restricted rows marked as such;
- the role's row on `/foundations/tokens/` and in the search index, with `surface-sunken`'s declarations to copy;
- one literal-lint rule (test 12);
- `src/routes/(site)/components/+page.svelte`;
- `scripts/site/thumbnails.ts`;
- every picture, `manifest.json` and `text-sizes.json`, once per wave;
- `CHANGELOG.md`'s one bullet;
- the tests below.

**Out:**

- any item's source;
- the component pages' frames, and the three-column floor (`034`);
- `sunken-line`, the four line and ground redeclarations, `surface-plain`'s extension, and the disabled rows (`031b`);
- the `more` rows and swatches (`031`).

## Tests to write first

Each is written before the change and seen failing for the reason given. E2E tests run against the production preview, in `022`'s three engines. Forced-colours readings run in Chromium and Firefox. A test that passes today is proven by mutation.

| # | Name | File | Asserts | Fails today because |
|---|---|---|---|---|
| 1 | `sunken` is a role, and `surface-sunken` is its list | `tests/unit/tokens-dtcg.test.ts` | The primitives `paper-sunken` `#DCD7CA` and `ink-sunken` `#0B0A07`; `role.sunken` in both scheme files with equal `$description`; `--sunken: light-dark(#dcd7ca, #0b0a07)` on `:root` and in the fallback; `color-sunken` in `cssVars.theme`; `kuiper.css` carries the role, and its header holds `surface-sunken`'s list. `surface-sunken`'s declarations are, in order: `surface-plain`'s restorations, generated from `SURFACE_ROLES` less the roles the well sets itself (decision 1b); `background-color: var(--sunken)`; `color: var(--foreground)`; and, once `031b` has landed, its four lines, last | no such tokens |
| 2 | ΔE is computed right | `tests/unit/contrast.test.ts` | `deltaE2000` reproduces Sharma, Wu and Dalal's (2005) 34 pairs to 4 decimal places. `deltaE2000("#F3F0E8", "#E9E5DB")` is 2.51 and `deltaE2000("#0B0A07", "#221F19")` is 6.36 | no function |
| 3 | `sunken` differs from every neutral ground | `tests/unit/index-stage.test.ts` (new) | In each scheme: ΔE ≥ 2.5 from every neutral ground, and darker than `background`. The message calls the floor a regression guard. *Mutation:* `ink-sunken` set to `#16140F` fails | no role |
| 4 | `sunken`'s pairs | `tests/unit/contrast.test.ts` | The allowed rows pass in every context present, at their kind's floor. The `restricted` block holds decision 1a's rows, each with its kind and floor. Every measured reading equals the computed ratio and stays below its floor. A measured row that starts to pass fails the test, so the block cannot go stale. The validator rejects a row with no kind | no rows |
| 5 | B's grounds, edges and geometry | `tests/e2e/index-cards.spec.ts` (new) | On `/components/`, light and dark, by computed `background-color`. At 1440: ΔE(stage, tile) ≥ 2.5; ΔE(tile, page) ≥ 2.5 (4.92 and 3.69). The stage's box is inset 8 px (± 0.5) from the tile's padding box (the inside of its 1 px border) on the left, top and right, and its `border-radius` equals `--radius`. At 390: ΔE(row picture box, page) ≥ 2.5. It covers the first row's tiles and the six of Surfaces | the stage is `background`; no inset |
| 6 | every picture's frame is `sunken` | same | Each displayed picture's frame median is within ΔE 1.5 of `--sunken` resolved, and at least ΔE 2.5 from `background`, in each scheme (forecast: at most 1.11 and 0.69; at least 6.13 and 2.94). *Mutation:* today's picture fails | today's frames are on the page |
| 6a | a view keeps its own page | same | For each of the 17 views, in each scheme: **share**, at least 5% of pixels within ΔE 1.5 of `background` (forecast least 6.7%); **run**, along the middle row and middle column, between the first and last pixel that is not `sunken`, no run over 16 px within ΔE 1.5 of `sunken` (forecast at most 13 px). *Mutations:* the draft's `html, body` rule fails the share on 16 of 34 pictures and the run on 14 | passes today; proven by the mutations |
| 7 | white examples stay visible | same | `card`, `utils`, `collapsible`, `input` and `skeleton`: at least 2% of pixels within ΔE 1 of `card`, and the frame median at least ΔE 2.5 from `card` | passes today; mutation: Card on `card` fails |
| 8 | solid, and edged under forced colours | same | No tile, mat or stage has a background or border colour with alpha strictly between 0 and 1. This is read at rest, and with the tile hovered across its padding, at both widths, in both schemes. Under forced colours, each tile at 1440 and each row box at 390 paints a 1 px edge; the inset stage paints none | the tile's border is the 10% hairline |
| 9 | the pictures are fresh | `tests/unit/thumbnails.test.ts` (existing) | "each recomputed hash equals the manifest's"; and no `text-sizes.json` entry is below 9, now measured at 275 px | stale until the wave's last landing |
| 10 | the budget holds | `tests/e2e/perf.spec.ts` (existing) | `index` within 395 kB, 3,060 ms and 0.02 | a guard |
| 11 | *withdrawn* | — | — | — |
| 12 | items paint `sunken` only through `surface-sunken`, and put nothing restricted in a well | `scripts/lint-literals.ts`, a new rule; `tests/unit/lint-literals.test.ts` | See below the table | no rule |
| 13 | no restricted pair is rendered on `sunken`, and text in a well reaches its floor | `tests/e2e/sunken-pairs.spec.ts` (new) | See below the table | passes today; proven by the mutations |

**Test 12 in full** (S4).

- **Every form of `sunken` outside `surface-sunken` fails in an item file:**
  - `bg-sunken`, with any variant prefix (`hover:`, `dark:`, `data-[…]:`, `md:` and the rest);
  - `from-`, `via-`, `to-`, `fill-`, `stroke-`, `border-`, `text-`, `ring-`, `outline-` and `shadow-sunken`;
  - the variable forms `bg-(--sunken)` and `bg-[var(--sunken)]`;
  - `var(--sunken)` in a quoted string of a `.ts` file, as L17 and L21 already read.

  `kuiper-theme`'s own files are exempt.
- **The restricted classes are derived from the `restricted` block.** For each restricted role, the rule takes its text, fill, border, stroke and chart forms. So `031b`'s two disabled rows join by themselves.
- **The restricted items are derived from the registry.** An item is restricted if its own files, or its registry dependencies' files, hold any restricted class. Today that includes:
  - `badge`, `button` (`border-input`), `toggle`, `tabs`, `input-group`, `code-block`, `live-console`, `sidebar`, `stage-card` and `chart`;
  - every form control.

  A new item joins by itself.
- **Inside an element carrying `surface-sunken`,** in the same file, a restricted class, or a restricted item's component, fails.
- **Fixtures:** one file per form, and one per restricted item kind. Each fails, naming the rule and the class or item.

**Test 13 in full** (S2, S3).

- **Where it runs:** every item example page and every site page in the sitemap, light and dark, standard and `more` (once `031` lands), at 1280 and 390.
- **What it measures:**
  - **Text:** each text element whose ground computes to `--sunken`. Its ground is its own painted background if it has one, else its nearest painted ancestor's. Its colour must not be a restricted role's. It must also reach its pair's floor: 4.5:1 at standard, 7:1 under `more`. That catches field legend text in a well that lacks the restorations (S2).
  - **Borders:** each element with a visible border, measured against the nearest painted ground *outside* the element. An `Input`'s own fill is white, and its edge meets the well. The border colour must not be a restricted role's.
  - **Fills and charts:** each element whose background or SVG fill or stroke is a restricted role, measured against the ground outside it.
- **The mutations that test 12 cannot see.** Each is a fixture whose own file holds no restricted class:
  - `<div class="surface-sunken"><Badge variant="destructive">`;
  - `<div class="surface-sunken"><Input>`;
  - a field (`field-2`) holding `<div class="bg-sunken">` with text, which fails the text floor.

  These live in separate fixture files. Each fails, naming the element and the pair.
- **What it does not see.** It checks only the states the examples render. Today it finds only the index stages, which hold images, so it reports the ground elements it checked.
- **False positives.** One example would be an icon in `destructive`, which reads 4.18 and passes 3:1 as non-text. Such a case is resolved by moving the element onto a `surface-plain` card, never by an exemption.

Axe's colour-contrast check, run on every page in every scheme (`022`, `030`), also catches restricted text in light.

## Acceptance criteria

1. `sunken` exists as decision 1 says, in both schemes, as one pair, with its primitives and words. `kuiper.css` carries it, with the copyable list in its header. The counts are updated and recorded (test 1).
2. `surface-sunken` holds decision 1b's list in order: `031a`'s lines now, and `031b`'s once it lands (test 1).
3. In each scheme, `sunken` is at least ΔE 2.5 from every neutral ground, and darker than `background` (test 3).
4. The contrast file lists `sunken`'s allowed rows, which pass, and its `restricted` block, with a kind, floor and reading per row. The validator, the site's contrast tables and the tokens page read them (test 4).
5. **The index is card B.** From `md`, the tile is a mat with `md:p-2`, and the stage has the one radius, inset 8 px.
   - At 1440, the stage differs from the mat, and the mat from the page, by at least ΔE 2.5 each.
   - Below `md`, each row's picture box is on `sunken`, at least ΔE 2.5 from the page (test 5).
6. No item paints `sunken` except through `surface-sunken`. No item or site page renders a restricted pair on it, and text in a well reaches its floor (tests 12 and 13).
7. Every picture's frame median is within ΔE 1.5 of `sunken`, and at least 2.5 from the page. Every view keeps its own page. White examples hold their white (tests 6, 6a and 7).
8. No tile, mat or stage is translucent. The tile and the row box are outlined under forced colours (test 8).
9. The pictures are regenerated once, at the wave's last landing. No picture sets text below 9 px at 275 px shown (test 9).
10. **The checkpoint.**
    - The design lead looks at the index at 1440, 1024, 768 and 390, in both schemes and under forced colours.
    - The phone rows in dark are also looked at on an LCD at low brightness. If the 390 picture box reads weak in dark, the design lead may move `ink-sunken` to `#080705` (ΔE 3.34 to the page), recorded in the landing notes.
    - The design lead looks at the non-concentric corners, and the crops near the floor: Card's "Rerun" and `chat`'s "No m…".
    - The builder lists every picture that changed in a way other than its ground, every view's window (`name-strip` named), and the 42 or so pictures re-fitted at 275 px.
    - A ruling goes in the landing notes.
11. The `index` template is within its budget, and the figure is recorded (test 10).
12. `CHANGELOG.md` holds decision 11's bullet. `kuiper.removed.json` is unchanged.
13. The benchmark scorecard is re-run after landing, and its movement recorded.
14. Unit, `check`, `lint`, the literal lint, the release check, e2e in every project and smoke all pass.

## Build order

1. Tests 1 to 4 and 12 are written, and seen failing.
2. **The token edit,** in lane T after `029` and before `031b` and `031`:
   - the primitives, the role and its words;
   - `surface-sunken` (`031a`'s lines);
   - the contrast rows, the `restricted` block, and the validator's types;
   - the lint rule;
   - `kuiper.css`'s header;
   - then `bun run build:tokens`.

   Tests 1 to 4 and 12 pass. The count tests are updated.
3. Tests 5 to 8 are seen failing, and tests 6a and 13 are proven by their mutations.
4. Decision 8's markup and decision 7's four script changes. The site's contrast tables and the tokens page.
5. The pictures are made once, at the wave's last landing. Test 9 passes, and the figures are recorded.
6. Tests 5 to 8 pass. Tests 10 and 13 and the full suites run.
7. The checkpoint (criterion 10).
8. The changelog bullet, the scorecard re-run and the landing notes.

## Risks

- **A public ground with restricted pairs is a rule apps can break.**
  - The system's own items cannot break it (tests 12 and 13).
  - An app can: by setting a chart, a status badge or an error directly in a well. That fails AA in light, or under high contrast.
  - The role's words, `/foundations/tokens/`, `kuiper.css`'s header and the changelog all say to use a `surface-plain` card inside the well.
- **Dark is the narrow margin, now only below `md`.** There, the row's picture box sits on the page at ΔE 2.74. From `md`, the mat carries every edge (decision 2). The fallback is the design lead's: `#080705` (criterion 10).
- **Pictures near the floor crop tighter at 275 px** (decision 7). The checkpoint names them.
- **The three-column range keeps a floor gap** of about 6.5 px at 1024. It predates this spec, and is carried to `034`.
- **`031` re-derives three swatches the owner has seen,** and they go back to the owner.
- **Pictures are a ledger.** Several specs in the wave stale every picture, so they are made once.
- **The index and the component pages show examples on different grounds** until `034`.

## Open questions for the owner

None. Q1 to Q5 are answered (Landing notes). The second re-check's findings were ruled by the design lead under the owner's overnight delegation.

## Review response

The review, [`../reviews/031a-the-index-card-redesign-spec-2026-11-15.md`](../reviews/031a-the-index-card-redesign-spec-2026-11-15.md).

### The first review

1. **High, views repainted.** Accepted. The rule now covers the stage only. The colours are split. Views are drawn as a window (decision 7). Test 6a guards it.
2. **High, a public `sunken` fails AA.** Accepted. Then the owner chose a public role (Q2), and the finding became a requirement. It is met by restricting the pairs (decision 1a; Q5).
3. **High, high contrast.** Accepted. With the public role, `031` is touched. Knock-ons give its rows and three swatches.
4. **Medium, test 6 under WebP.** Accepted. Test 6 now reads the frame median.
5. **Medium, test 5 sampled content.** Accepted. Test 5 reads computed colours.
6. **Medium, the dark floor.** Accepted. The floor is a regression guard; the checkpoint uses a dim LCD. B now carries the edges from `md`.
7. **Low, bytes.** Accepted. All real-script runs are quoted (decision 9).
8. **Low, Spectrum.** Accepted, and corrected.
9. **Low, write-ins.** Accepted.

### The first re-check (R1 to R4)

- **R1:** applied, then made moot. The role lives in `src/app.css` on every route. The fill is still read once per scheme from `/components/`.
- **R2:** applied. Test 6a has its run check. `name-strip` is named at the checkpoint.
- **R3:** applied. The window is drawn for views only.
- **R4:** applied, and widened. The role has its own row on the tokens page and in search.

### The second re-check (S1 to S6, and card B)

- **S1, High: five more failing pairs under `031`.** Accepted, as the design lead ruled. The status fills, `caution` and every chart colour are restricted on `sunken` in every context, like the text (decision 1a). The allowed set is `foreground`, `muted-foreground`, `primary`, `ring` and `sunken-line`. `031` re-derives three swatches, not two: `ink-soft-more`, `line-more` and `blue-more` (Knock-ons). Risks say three.
- **S2, Medium: `surface-sunken` and fields.** Accepted.
  - `surface-sunken` writes `surface-plain`'s restorations first, then `background-color: var(--sunken)` and `color: var(--foreground)`. Then come `031b`'s four lines.
  - One combined list says which spec writes which line (decision 1b). Test 1 asserts the order.
  - Test 13 checks the text floor in a well, with a field fixture.
- **S3, Medium: test 13's grounds and mutations.** Accepted.
  - Text is read against its own ground, else its nearest painted ancestor's. Borders and fills are read against the ground outside the element.
  - The two fixtures, a destructive `Badge` and an `Input`, each inside `surface-sunken`, are in separate files. A field fixture is added for S2.
  - The test's words state what it cannot see, and that false positives move onto a card.
- **S4, Medium: test 12's list.** Accepted.
  - The restricted items are derived from the registry, through dependencies.
  - The restricted classes are derived from the `restricted` block.
  - Every prefixed, variable and gradient form of `sunken` is caught.
- **S5, Low: the block's shape.** Accepted.
  - Each row has a kind and a floor, with measured or by-rule readings per context.
  - `scripts/tokens.ts`'s types and validator, and the site's contrast tables, are in Scope.
  - `contrastPairs` counts allowed rows only.
  - The block is called a ground's contract, not a rename that "keeps" `029`'s check.
- **S6, Low: `kuiper.css`.** Accepted. Its header, and the tokens page, give `surface-sunken`'s list to copy.
- **Card B, items 1 to 10.** Each applied:
  1. Decision 3 is B: `md:p-2`, `md:rounded` on the stage with `overflow-hidden`, words `md:px-2 md:pt-3 md:pb-2`. The non-concentric corners are noted.
  2. The picture box is 275 × 172 at 1440 (scale 0.573), and 200 wide at 1024.
  3. **The floor:** `SHOWN = 275 / 480`, as the design lead ruled. The forecast was regenerated with the real script: 42 of 148 text sizes change, the least is 9.00, and bytes are +1.04%. The gap at 1024 (about 6.5 px) predates `031a`, and is carried to `034` as a finding.
  4. The window's radius is `--radius` × 480 / shown width, 14 px.
  5. The edges are given per side (decision 2). B removes A's weak dark top edge.
  6. Decisions 5 and 8 are updated. Test 8 adds a hover reading across the padding.
  7. Test 5 reads stage against mat, mat against page, and the inset geometry at 1440; and stage against page at 390.
  8. Tests 6, 6a and 7 are re-measured on the B forecast: they hold.
  9. Bytes: +1.04% on the B forecast (decision 9).
  10. The words are changed in decision 2, decision 3, Risks, criteria 5 and 10, Q1 (now answered), and the Kind and Status lines.

### `031b`'s re-check, carried here

- **R1:** a card inside a well takes `surface-plain`. `031b` extends `surface-plain` to restore `--background`, `--groove-line` and `--sidebar-border`. The role's words say "on a `surface-plain` card". The combined list (decision 1b) matches `031b`'s.
- **R3:** `disabled-foreground` (2.76) and `disabled-edge` (1.39) are restricted on `sunken` in every context. `031b` writes the rows when its roles land, and tests 12 and 13 read them from the block.

## Landing notes

### Owner answers, 2026-11-15

- **Q1:** A, the sunken band. **Changed the same day to B, the matted well.** The owner, sending `png/b-1440-light.png`: "I like this structure". The card is a white mat; the sunken stage is set into it with its own radius.
- **Q2:** **Public role**. This is not the recommended option.
- **Q3:** #0B0A07.
- **Q4:** leave the component pages' stages until 034.
- **Q5** (asked after Q2's answer): **restrict the pairs**, the recommended option. The four pairs that fail on light `sunken` (`destructive` 4.18, `success` 4.09, `caution-text` 3.99, the `input` edge 2.80) are listed as restricted in both schemes and guarded by tests 12 and 13. No public colour changes.

What the answers changed:

- **Q2** makes `sunken` a public role, in the token file, `cssVars`, `kuiper-theme` and `kuiper.css`.
- **Q5**'s restriction holds §4.4 for every item (decision 1a).
- **Q1's switch to B** rewrites decisions 2, 3, 5, 7 and 8, tests 5 and 8, criteria 5 and 10, and Risks.
- **Q3 and Q4** confirm the decisions as drafted.

### The design lead's rulings on the second re-check, 2026-11-15 (the owner's overnight delegation)

1. **S1:** the status fills and chart colours are restricted on `sunken` too, in every scheme and contrast, with `caution`'s fill. The allowed set is `foreground`, `muted-foreground` and `primary` text, `ring`, and the line roles. Under high contrast, `031` re-derives `ink-soft-more`, `line-more` and `blue-more`. Charts and status badges live on `card` and `background`, not in wells.
2. **S2:** `surface-sunken` restores the field roles as `surface-plain` does, then sets `background-color: var(--sunken)` and `color: var(--foreground)`. There is one combined declaration list with `031b`, saying who writes which lines.
3. **S3:** test 13 measures text against the element's own ground, and borders against the ground outside the element. The two mutation fixtures go in separate files.
4. **S4:** test 12 derives its control list from the registry, and catches prefixed and variable forms.
5. **S5 and S6:** as written. `kuiper.css`'s header and the tokens page give `surface-sunken`'s declarations to copy.
6. **B:** the reviewer's items 1 to 10. The 9 px floor is set at B's 1440 shown width, 275 px, and the forecast was regenerated. The 1024 gap (about 6 px) predates `031a`, and is a finding carried to `034`.

`031b`'s re-check added two more: cards in a well take `surface-plain` (R1), and the two disabled pairs are restricted (R3).
