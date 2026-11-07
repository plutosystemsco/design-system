# 012 — The compositions, on brand

- **Status:** built, reviewed and released in `v0.11.0` with `009` to `012` (2026-11-07). Change review: [`../reviews/012-the-compositions-on-brand-pr-2026-11-07.md`](../reviews/012-the-compositions-on-brand-pr-2026-11-07.md) (0 High, 2 Medium, 3 Low, all fixed). Its specification review is [`../reviews/012-the-compositions-on-brand-spec-2026-11-06.md`](../reviews/012-the-compositions-on-brand-spec-2026-11-06.md) (2 High, 8 Medium, 8 Low, each answered below).
- **Date:** 2026-11-06; revised 2026-11-07 after review.
- **Author:** the design lead
- **Kind:** changes to `010`'s nine composition items and its block; removal of `009`'s stage and light tokens and utilities, which the chosen identity does not use; preview and tests.
- **Depends on:** [`011`](./011-the-brand.md) (fields, `surface-plain`, glass, `type-poster`, `liquid-glass`). Built after it, in the same 0.11.0 release.
- **Research it stands on:** the light memo, [`../research/2026-11-06-from-beige-computing-to-liquid-glass.md`](../research/2026-11-06-from-beige-computing-to-liquid-glass.md) (§6.4, §7: I5 and I9); the product-site memo and the brands memo of 2026-11-01, as `010` cites them.
- **Design calls:** `../decisions.md`: "The identity: round two answered" (2026-11-06); "One release, 0.11.0, and the calls of the `011` and `012` spec reviews" (2026-11-07).

## Intent

`010` built a product's home page for a dark stage lit by bloom and rim. The owner chose otherwise: a warm canvas, flat colour fields, and liquid glass on expressive pages. No bloom, no rim, no stage.

This specification rebuilds the same sections on `011`'s tools, so a developer composes an expressive page that is on brand from registry items alone, with zero literal values and zero lint exceptions, as `010` required.

`009` and `010` were never released: the owner ships `009` to `012` as one 0.11.0 (decisions.md, 2026-11-07). Their interfaces change here without an interface-change note for any installed app.

**Terms of art** are `009`'s and `011`'s. A section's **ground** is what it is painted on: the canvas, or one of the four fields.

**Not here:** a new composition; product icons; a signature device; a change to any productive item.

## Decisions

### 1. What is removed, and every user of it

| Removed | Was |
|---|---|
| tokens `expressive.stage`, `expressive.light`, `expressive.radius.stage`, `expressive.blur.veil` | `009` decisions 3, 4, 6 |
| variables `--stage`, `--stage-*`, `--bloom-*`, `--rim-*`, `--energized-*`, `--veil`, `--radius-stage`, `--blur-veil` | the same |
| utilities and rules `surface-stage`, `bloom`, `rim`, `energized`, `veil` | `009` decisions 3, 4 |
| `contrast.stage` (pairs and the `overTheme` composites) | `009` decision 3 |
| L22's entries for the five | `009` decision 9 |
| `stage-hero`'s `lit` prop | `010` decision 5 |
| `static/v0.9.0/`, `static/v0.10.0/` | never published (decisions.md, 2026-11-07) |

**Every user, and what happens to it** (the review's grep, EXECUTED):

- the nine compositions and the block: decisions 2 to 7;
- `scripts/tokens.ts` (`StagePair`, the stage validation, `radius.stage`, `blur.veil`) and `scripts/contrast.ts` (`stageHex`, `stageTable`): removed. `011`'s glass rows bring their own theme-aware composite; the `composite` row kind lives on there;
- `scripts/build-tokens.ts`: the emitters and rules for the removed names;
- `src/routes/(site)/items/pluto-theme/+page.server.ts` and its page: the stage table and the stage demonstrations go; `011` decision 13 adds their replacements;
- `tests/e2e/keyboard.spec.ts`'s ring helper: reads `--ring` where the element sits (fields and glass set it), not `.surface-stage`;
- the identity exhibit's `class="bloom"` (`motion-demo.svelte`, `specimens/stage-hero.svelte`), which today also receives the theme's utility: the exhibit gets a local class with the same rule in its own style, so the owner's research record renders as before;
- `011` decision 3's `--stage-mark-N` and its stage remarks: gone with the stage.

`009` and `010` are records and are not edited. This specification retires `009`'s criteria 8 and 11, the stage rows of criterion 4, and in part criteria 1 (the variable list), 5 (L22's list) and 12 (the read-token dot inside a stage); and `010`'s criterion on `data-lit`. Their tests change as criterion 10 lists.

`009`'s display steps, motion and size variables, `--size-hero-fill`, `--gutter-stage`, the sticky-bar rule, `action-press`, the mode rule and `read-token` stay.

### 2. `stage`: an expressive section on a ground

- Props: `010` decision 2's, plus `ground: "canvas" | "field-1" | "field-2" | "field-3" | "field-4"` (default `"canvas"`).
- The class comes from a literal map: `{ canvas: "bg-background text-foreground", "field-1": "field-1", "field-2": "field-2", "field-3": "field-3", "field-4": "field-4" }`. _Why a map:_ Tailwind emits a utility only for a class written out in a scanned file; a template string would leave the field uncoloured in an installed app and escape L22 (review finding 9).
- Root: `data-mode="expressive"`, `overflow-x-clip`, the ground's class, and the inner column of `010`. The `dark surface-stage` classes go.
- **It follows the page's theme.** `stage` never carries `.dark`, and its item page says a stage is never placed under a `.dark` ancestor other than `html`. The owner chose graphite as the dark canvas and lifted fields in dark; there is no separate night ground.
- **What a field-ground stage may hold** is `011`'s rule: text in the field's roles, `surface-plain` surfaces, glass. Its item page says so.
- The name stays: renaming nine items costs more than the word. "Stage" now means an expressive section.

### 3. `stage-hero`: words on glass, the object on a field

- Props: `010` decision 5's, less `lit`, plus `field: "field-1" | "field-2" | "field-3" | "field-4" = "field-1"` (the ground of the object; strings, so the app's file holds the class) and `poster = false` (the title takes `type-poster`; K3, launches only).
- **From `lg`:** a twelve-column grid with a column gap of `--gutter-stage` (`lg:gap-x-(--gutter-stage)`), both children in row 1 (`lg:row-start-1`). The field (the `field-N` class from a literal map, the case radius, no position of its own) spans columns 5 to 12 and is a subgrid of those eight columns (`lg:grid lg:grid-cols-subgrid`). The object takes the field's last five, which are the hero's columns 8 to 12, centred vertically, inset from the field's edges by `p-(--gutter-stage)` on every side. The words sit in a `glass` panel over columns 1 to 7, `p-(--gutter-stage)`, carrying `pointerLight`. So the panel overlaps the field by three columns, and the object starts after the gap that follows column 7: it is clear of the panel by `--gutter-stage` (16 to 56 px).
- **The object's columns** are then about 369, 461 and 454 px wide at 1024, 1280 and 1440 (the reviewer's arithmetic with the gutter as the gap), less the field's inset at the end edge. `010`'s shell card's install line, about 485 px, scrolls inside its card at those widths, as a `code-block` line already does on a phone; the card's code region is a scroll container reachable by keyboard (`004`). Accepted and recorded.
- **Below `lg`:** the glass panel, then the field with the object, stacked in DOM order. The panel overlaps the field's top by `--gutter-stage` (a negative top margin on the field); the panel is above it by `glass`'s own `position: relative` and the field's lack of one.
- **Without an object:** no field and no glass, and the words sit on the stage's ground. A `stage-hero` without an object goes only in a canvas stage; its item page says so, and the ground check (criterion 6) holds it.
- The title is `type-display` (or `type-poster`, with `break-words` and `hyphens-auto`) in `text-foreground`; the description `text-muted-foreground`; the actions as `010`, in `action-press`. On glass these are the theme's roles (`surface-plain`), measured over every field (`011` decision 11).
- **The object is opaque:** cards carrying `surface-plain`, figures, images. Text directly on the field uses the field's roles.
- `fill`, `underBar` and `strip` keep `010`'s meanings; the strip sits below the grid, on the stage's ground.
- `registryDependencies` gains `liquid-glass`.

### 4. `marketing-bar`: a floating glass bar

- Root: `<header data-sticky-bar data-mode="expressive" class="sticky top-0 z-10 h-(--size-bar)">`. Inside, `mx-auto max-w-7xl px-(--gutter-stage) py-2 h-full`, holding one `glass` panel the full height of that box, carrying `pointerLight`. The `dark surface-stage veil` classes and the bottom border go.
- **Its text is `foreground` and `primary` only.** The links take `text-foreground` (they were `text-muted-foreground`). _Why_ (review finding 3): the bar floats over the whole page, including images an app places, and muted text on dark glass over white measures 4.22; `foreground` there measures 10.00.
- **It follows the page's theme** and never carries `.dark`; its item page says so; criterion 4 checks it has no `.dark` ancestor but `html`.
- **Passing over the hero's glass** is allowed: R25 forbids nesting, not passing (decisions.md, 2026-11-07). The rows prove it: `foreground` and `primary` on the bar's tint over the hero's tint over each field, both themes (`glassOverGlass`, 4.5).
- Under `data-mode="expressive"` in dark, the bar's mark is the lifted four (`011` decision 3).
- Skip link, nav, actions, the `md` sheet and `overlay` keep `010` decision 4.
- _Why floating and capped at `max-w-7xl`:_ the I9 board drew the bar as an inset glass panel; a full-bleed band would need a radius of 0 beside 8 px glass, and the cap keeps the blurred area at most 1280 px wide.
- `registryDependencies` gains `liquid-glass`.

### 5. `stage-card` and `live-console`: flat surfaces

- `stage-card`: `rim overflow-hidden energized` becomes `surface-plain overflow-hidden rounded-lg border bg-card`.
- `live-console`: `energized` and `rim` become `surface-plain rounded-lg border bg-card`. It stays `data-mode="productive"`.
- **Busy:** a new `@utility busy-edge` in `pluto-theme`: `transition: box-shadow var(--motion-busy) var(--ease-standard)`; on `&[data-busy]`, `box-shadow: inset 0 0 0 calc(2 * var(--line-width)) var(--primary)`. Both surfaces carry it. The edge is drawn inside the card, against the card's own ground. _Why inside:_ an outer border in `--primary` vanishes on `field-1` (review finding 13). _Why a utility:_ the literal lint's L3 bans `ring-*` classes (READ, `lint-literals.ts`). I5's "a run answers with a border change" holds. `busy-edge` joins L22's list: it is expressive volume, and `live-console`'s root is productive inside but its item is expressive-only (`010`), so the lint allows it there.
- No box-shadow at rest.

### 6. `proof-band`, `name-strip`, `cta-band`, `marketing-footer`

- No change to their markup. With no ground of their own, they take their section's roles.
- `proof-band` and `name-strip` hold no control and may sit on a field.
- `cta-band` and `marketing-footer` hold controls: they go on the canvas. Their item pages say so, and the ground check holds them.
- `marketing-footer`'s root gains `data-mode="expressive"`, so in dark its mark is the lifted four, as the bar's is (`011` decision 3; decisions.md, 2026-11-07).

### 7. `product-home`

1. `marketing-bar`, `overlay`.
2. `<main id="main" tabindex="-1">`:
   1. a canvas `stage` holding `stage-hero` (`underBar`, `field="field-1"`), whose object is `010`'s two `stage-card`s, and whose strip is the `name-strip`;
   2. a `stage` on `field-3` holding the titled `proof-band`;
   3. a canvas `stage` holding a `field-4` panel (the case radius, `p-(--gutter-stage)`) that holds the `live-console`;
   4. a canvas `stage` holding the `cta-band`.
3. `marketing-footer`.

- `GlassLens` is rendered once, in the block's page. `product-home`'s `registryDependencies` gain `liquid-glass`.
- **The four colours** appear as blue (hero), amber (proof) and green (console): three owned moments, one colour each (C2). Red stays the product's status colour, as `008` keeps brand red apart from error red.
- Sample copy is `010` decision 9's, unchanged.

### 8. The preview

- Every composition's item page and view follow. `stage` gets a view of its five grounds; `stage-hero` a view with `poster`.
- The `pluto-theme` page's "Expressive mode" section loses the stage, bloom, rim, energized and veil demonstrations (`011` decision 13 adds their replacements).
- `read-token`'s canvas paints its four dots on the page and inside a `.dark` subtree, instead of inside a stage.

### 9. The documents

- `CHANGELOG.md`: the one 0.11.0 entry (`011` decision 14) describes the compositions as this specification leaves them; nothing of the stage appears.
- `meta.since` is `"0.11.0"` on the ten items `010` added (`011` decision 14).

## Acceptance criteria

1. None of these appears in `src/app.css`, `registry.json`, `static/r/` or `src/lib/registry/`: the variable prefixes `--stage-` and `--stage:`, `--bloom-`, `--rim-`, `--energized-`, `--veil:`, `--radius-stage`, `--blur-veil`; the selectors `.surface-stage` and `.veil`; and, read as class tokens through the lint's tokeniser, `bloom`, `rim`, `energized`, `veil` and `surface-stage`. `static/v0.9.0/` and `static/v0.10.0/` do not exist. (unit)
2. `stage` with each `ground`, both themes: the background is `--background` or `--field-N`; `text-muted-foreground` inside computes to `--muted-foreground` or `--field-N-foreground`; the root carries `data-mode="expressive"`. (e2e)
3. `stage-hero` at 1024, 1280 and 1440 px: the glass panel's box overlaps the field's box horizontally by at least 20% of the field's width, and the object's box does not intersect the panel's. At 390 px the panel precedes the field in the DOM and overlaps its top. Without `object` there is neither field nor glass. With `poster`, the title computes `type-poster`'s size, and at 320 px its `scrollWidth` does not exceed its `clientWidth`. (e2e)
4. In the dark theme, the mark's dots in `marketing-bar` and `marketing-footer` compute to the lifted four. `marketing-bar`: its glass panel's backdrop filter includes `blur(16px)`, its radius is 8 px, its width at 1920 px is at most 1280 px; the bar stays at the top after a scroll of 2000 px; a focused link below it is not hidden (WCAG 2.4.11); the bar has no `.dark` ancestor but `html`; its links compute `--foreground`. (e2e)
5. `stage-card` and `live-console`: no box-shadow at rest; while a run is pending, the computed `box-shadow` is an inset `--primary` edge of twice the line width; after it, none. L22 fails `busy-edge` in a productive item. (unit and e2e)
6. **The ground check.** On `product-home` and every composition view, both themes, at 1440 and 390 px: for every focusable element, the nearest ancestor that is a field (`field-N`), a `surface-plain` surface or a glass is not a field. (e2e)
7. `product-home` renders decision 7's order; its fields are `field-1`, `field-3` and `field-4`; `html` carries `data-glass-lens` in Chromium; the `GlassLens` SVG is `aria-hidden` and has no tab stop. (e2e)
8. Every composition's view and `product-home` pass axe in both themes; text on glass is evidenced by `011`'s glass rows and decision 4's `glassOverGlass` rows, since axe reads text over a backdrop filter as incomplete. `PRODUCT_HOME_STOPS_WIDE` and `PRODUCT_HOME_STOPS_NARROW` hold exactly. (unit and e2e)
9. The literal lint reports zero violations and zero exceptions over every composition and the block; `stage-hero`, `marketing-bar` and `product-home` declare `liquid-glass`, and `compositions-add.test.ts` finds `.field-1` in the installed app's built CSS. (unit and smoke)
10. `bun run test`, `bun run check` and `bun run lint` pass. Expectations change only in these groups:
    - `compositions.spec.ts`: the bar's links from `--stage-muted` to `--foreground` (decision 4); `010`'s `data-lit` test, removed (decision 1); the busy glow, now the inset ring (decision 5);
    - `expressive.spec.ts`: the read-token dot inside a stage, now inside a `.dark` subtree, reading paper (decision 8); the stage and light tests, removed (decision 1);
    - `generated.test.ts`: the variable list loses the removed names (decision 1);
    - `literals.test.ts`: L22's samples that use `bloom`, `rim`, `veil`, `energized` and `surface-stage` (the class-object sample, `hover:bloom`, `!veil`, the app-folder case) move to tokens L22 still holds (decision 1);
    - `contrast.test.ts`: the stage table, removed; `glassOverGlass`, added (decisions 1, 4);
    - `registry.test.ts`: the dependency table (decisions 3, 4, 7);
    - the views list, `pages.ts`, the 320 px reflow count, and the axe and keyboard page lists, for the two new views (decision 8);
    - `keyboard.spec.ts`'s ring helper (decision 1);
    - `tokens.test.ts`: the `stage`, `light`, `radius.stage` and `blur.veil` keys and the twelve-entry stage test, removed (decision 1);
    - `generated.test.ts`: "009's rules and utilities", the removed rules and utilities taken out of it and `busy-edge` added (decisions 1, 5).
    (all suites)

## Build checkpoints

1. After decisions 2, 3 and 4: the design lead looks at `/view/product-home/` at 1440, 1024 and 390 px, light and dark, and at `/identity/light/`, before the builder goes on. With the lens on in Chromium, the builder records the scroll frame time.

## Risks

- **A field's roles reach every descendant.** A surface without `surface-plain` draws the legend on its own ground. Criterion 6 and R25 are the guards.
- **Two backdrop filters at once** (the bar and the hero's panel), and three where the bar passes over the panel. The bar is capped at 1280 px wide; checkpoint 1 records the cost.
- **An app's image under the bar in dark.** The bar's text is `foreground` and `primary` only; `primary` (lifted blue) on dark glass over white is in `glassOverGlass`'s sibling rows if the build finds it needed, and the item page tells an app that dark glass over a light image is the app's to measure.

## Review dispositions

From [`../reviews/012-the-compositions-on-brand-spec-2026-11-06.md`](../reviews/012-the-compositions-on-brand-spec-2026-11-06.md).

1. **Fixed.** `011` emits the theme copies and `surface-plain`; `glass` includes it; `stage-card` and `live-console` carry it (decision 5). Criterion 2 and `011` criterion 11.
2. **Fixed.** The object takes the field's last five of eight subgrid columns, clear of the panel by the column gap, `--gutter-stage`; the wording is corrected and the shell line's scroll at desktop widths is recorded (decision 3; the reviewer's verification). Criterion 3 checks the boxes do not intersect at three widths.
3. **Fixed.** The bar's links are `foreground`; the bar and `stage` never carry `.dark` (decisions 2, 4); criterion 4.
4. **Fixed.** R25 means nesting (decisions.md, 2026-11-07); `glassOverGlass` rows (decision 4).
5. **Fixed.** `cta-band` and `marketing-footer` on the canvas; an object-less hero only in a canvas stage; the ground check, criterion 6. `011` sets the field's `--ring` to the legend.
6. **Fixed.** Decision 1 lists every user; criterion 1 names exact prefixes, selectors and class tokens, and its scope.
7. **Fixed.** Criterion 10 names each changed expectation, including the two groups the verification found.
8. **Fixed.** The owner chose one release, 0.11.0 (decisions.md, 2026-11-07); the snapshots are deleted.
9. **Fixed.** String props and literal maps (decisions 2, 3); criterion 9's smoke check.
10. **Fixed.** `liquid-glass` declared by the three (decisions 3, 4, 7); criterion 9.
11. **Fixed.** Padding, row and stacking written (decision 3).
12. **Fixed.** The bar is capped at `max-w-7xl` and loses its border (decision 4); checkpoint 1 records the frame time.
13. **Fixed.** The busy state is an inset edge inside the card, drawn by a theme utility, `busy-edge`, since L3 bans `ring-*` (decision 5; the reviewer's verification).
14. **Fixed.** Criterion 8 names the two stop counts and the SVG.
15. **Fixed.** `011` decision 11 adds the fallback and ring rows; criterion 8 says what evidences glass text.
16. **Fixed.** Criterion 2 checks the roles.
17. **Fixed.** The poster title breaks and hyphenates; criterion 3 checks it at 320 px.
18. **Fixed.** In dark, expressive marks are the lifted four (`011` decision 3; decisions.md, 2026-11-07); the bar and the footer carry `data-mode="expressive"`; criterion 4 checks both.

## Landing notes

- **Built** in the working tree on top of `011`, uncommitted. Tests first in each phase: Phase A unit 12 failures and two files that could not load, e2e 52 failures; Phase B unit 7, e2e 10, smoke 4; the lens removal unit 4, e2e 6.
- **The checkpoint** is recorded in `decisions.md` ("After the `012` build's checkpoint", 2026-11-07), with Phase A's accepted deviations: decisions 5 to 8 pulled forward where Phase A needed them; `border border-border`, since a bare `border` draws ink in this theme; "rim" reworded to "edge" in `liquid-glass`'s comment and description, which criterion 1's tokeniser reads; six registry descriptions reworded; 20 `glassOverGlass` rows with the canvas case; two figures `contrast.ts` rounds differently (light primary 5.98 over `field-2`, 6.16 over the canvas); the 2000 px scroll at 390 × 640; the poster view without an object; `data-ground` on `stage`.
- **The lens is removed** (decisions.md, "Frost only: the lens is removed", 2026-11-07). The checkpoint first took the lens off the sticky bar; the scroll still ran 13 of 100 frames over 20 ms while the hero's lensed panel was on screen (headless Chromium), against none without the lens. The owner ruled "Frost only, no lens". Decision 7's `GlassLens` and criterion 7's lens parts are superseded; every glass computes exactly `blur(16px)`.
- **Phase B deviations:** L24's allowance in an installed app, where no registry names a file's owner, through an optional `owners` map on `lintFiles`; the smoke check reads `.field-1`, `.field-3`, `.field-4`, `.glass`, `.surface-plain` and `.busy-edge` in the installed app's CSS; the changelog test requires the composition names and forbids the stage's and the lens's; the composition views carry no glass demonstrations beyond the hero's and the bar's.
- **Test groups criterion 10 did not name:** `brand.spec.ts` criterion 11's planted button (it cloned the removed `stage-button`); `registry.test.ts`'s dependency list (56 → 57) and changelog checks; `generated.test.ts`'s criterion 1 block and `busy-edge` shape; `compositions-add.test.ts`'s `liquid-glass` files, L24 owners and check 4b; `literals.test.ts`'s file count (324 → 323); the lint's `lintFiles` signature.
- **The change review's fixes** are recorded in its disposition.
