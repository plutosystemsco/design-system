# 031b — Transparency signifies depth

- **Status:** Ready to build, in wave 3 after `028`, `029` and `031a`. Its specification review said approve with changes; every finding is answered ("Review response"), the re-check's R1 to R8 are applied as written ("Re-check response"), and the re-check said that makes it fit to build without another look. `031a`'s reviewer checked the three lane-T specs agree, 2026-11-15. The owner answered Q1 to Q3 on 2026-11-15; the design lead ruled Q2's figures under the owner's overnight delegation (Landing notes). Not built.
- **Date:** 2026-11-15
- **Author:** the spec author for `031b`, for the design lead
- **Kind:** a feature in lanes T, I and S, with new lint rules and new tests. **Interface changes:**
  - `kuiper-theme`: the hairline roles `border`, `sidebar-border` and `groove-line` become solid, and so do the primitives `line` and `paper-line` they point at (decision 7);
  - `kuiper-theme`: the four field utilities' `--border` becomes solid, and they also set `--groove-line` and `--sidebar-border` (decision 8);
  - `kuiper-theme`: three new roles, `disabled`, `disabled-foreground` and `disabled-edge`, with their utilities and four primitives (decision 9);
  - `kuiper-theme`: one new role, `sunken-line`, the line on `031a`'s `sunken` ground, with its utilities and two primitives; and `031a`'s `surface-sunken` utility redeclares the three line variables and `--background` (decision 11);
  - 16 items draw their disabled state in those roles, not at half opacity (decision 9);
  - 8 items carry a new attribute, `data-layer`, on their layer's root (decision 2);
  - `surface-plain` also restores `--background`, `--groove-line` and `--sidebar-border`, and `card` takes `surface-plain`, so a card inside a well or a field draws the page's lines and ground (decision 11).

  Each has a changelog bullet and a step in the upgrade guide (decisions 19 and 20). No dependency is added. In all, four public roles are added.
- **Lanes:** T, I and S. T: the token files, `kuiper.contrast.json`, `scripts/build-tokens.ts` and what it writes, including `031a`'s `surface-sunken` utility. I: the items' source. S: the elevation example, the two glass specimens, `031a`'s thumbnail capture rule, and `bar-glass.spec.ts` (decision 22).
- **Written against the renamed and scoped tree.** `020` (the Kuiper rename), `021` (tokens for everyone) and `029` (scoped schemes) land first. So the theme item is `kuiper-theme`, and the registry is `kuiper`. The token files are `021`'s DTCG set: the base file `tokens/kuiper.tokens.json`, the scheme files `kuiper.light.tokens.json` and `kuiper.dark.tokens.json`, and `kuiper.contrast.json`. Extension data sits under the vendor key `co.plutosystems.kuiper`. Every colour variable is one `light-dark()` pair on `:root`, a scheme is set by `data-scheme`, and `alert`'s tints are already solid (`029` decisions 1, 2 and 10). The upgrade guide is at `/changelog/0.13.0/upgrade/`. `020` merged at `44cec73`, so the tree now reads `kuiper`. The audit's runtime half read the `build/` of `dad6f76`, before the rename. The review diffed the two: only names changed (`/components/pluto-theme/` is now `/components/kuiper-theme/`, the keyframes `kuiper-*`), and no class, slot, role or alpha an item or page draws (EXECUTED (review)). So the audit holds for today's tree.
- **Depends on:** `028`, `029` and `031a`. `029`, for the pairs, the composite primitives (decision 10 there), and the removal of the only translucent tint in an item. `028` (forced colours), in lane I: it adds a forced-colours twin to every `opacity-50` this specification removes (decision 10). `031a` (the index card redesign) lands first in lane T: it adds the public role `sunken` and the utility `surface-sunken`, which this extends (decision 11). `022` gives the Firefox and WebKit projects; without it, the runtime test runs in Chromium only. `020a` (the site's CSS reads only code) lands first; its source rule removes the built CSS's leaked rules (decision 14).
- **Blocks:** `031` (high contrast), in lane T. The order is `031a`, then this, then `031` (decision 11). `031` covers this specification's public roles: the solid hairline and `sunken-line` take its line swatches, and the three disabled roles keep their standard values under high contrast. This specification owes no high-contrast pairs.
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `031b`: "Every item and site surface audited against the owner's rule: only a layer above other content (the bar, overlays, the scrim) is translucent; everything inside a layer is solid or unfilled. A lint forbids alpha fills, borders, `backdrop-filter` and container opacity outside the declared layers." Lanes I and S; depends on `029`. Scorecard row 4: held.
- **Research it stands on:**
  - [`../research/2026-11-15-transparency-audit.md`](../research/2026-11-15-transparency-audit.md), cited as *the audit*, by section. Its probe and its 188 classified findings are in the session scratchpad, `031b/` (`probe.ts`, `analyze.ts`, `classified.md`, `findings.json`).
  - [`019a`](019a-the-fonts-own-spacing-the-glass-bar-and-depth.md) decision 3, criterion 5 and its landing notes: the rule, the bar's depth test and its `/ alpha` parser (`tests/e2e/bar-glass.spec.ts`).
  - [`029`](029-scoped-schemes.md) decisions 9 and 10: the tints made solid, and the literal lint's carve-outs removed.
  - [`028`](028-forced-colours.md) decisions 2, 9 and 10, and its lane table: the system colours' alpha, the disabled twins, and the scrim left alone.
  - [`026`](026-toast.md) decisions 8 and 13 and test 66: the toast's solid surface.
  - [`027`](027-batch-a.md) decision 13: the inherited `opacity-50` of `search-field` and `button-group`, left to this specification.
  - [`031a`](031a-the-index-card-redesign.md) decisions 1, 1a, 1b, 5 and 7 and its Knock-ons, as revised after the owner's answers: the public role `sunken` with its restricted pairs, the `surface-sunken` utility, the tile's transparent border, and the capture rule that paints `frame-stage` sunken.
  - [`031`](031-high-contrast.md) decisions 6, 7 and 20: the `more` section of the contrast file, the line rows, the disabled roles kept at their standard values, and the order in lane T.
  - The spec review's probes, in the session scratchpad, `031b-review/` (`lines.py`, `filled.mjs`, `disabled.py`, `order.mjs`, `forced.mjs`, `forced2.mjs`, `layers.mjs`, `ph.mjs`), cited as **EXECUTED (review)**.
  - [`002`](002-the-primitives-forms-surfaces-and-feedback.md) decision 7: elevation is for menus and dialogs only.

## The problem, in the owner's words

**The owner** (2026-11-15, looking at the design site's bar): "transparency always signifies depth … divs in the headers shouldn't have transparency to the color behind it, they are on the same level. The header bar is above everything else and stays in a fixed position, so it is transparent to what is below it."

`019a` applied the rule to the bar alone. Two children of the bar broke it, both with the 10% hairline. The system-wide audit was left to 0.13.0 (`019a` decision 3). This is that audit, and the rule made permanent.

The rule has two halves:

- **A layer may be translucent.** A layer is something painted above other content. Through it you see what lies below.
- **Nothing else may be.** Everything inside a layer sits on that layer's level. Everything on the page sits on the page's level. Neither lets the colour behind it show through.

## What the audit found

The runtime probe read all 102 site pages, in both schemes, at rest, with every control in every example hovered and focused, and with every popup opened (*the audit* §1). The static half read every item and site file and the token file. The counts are distinct findings, by class (*the audit* §2.1, §2.2).

**Allowed, because they are layers:**

- **50** on glass: the site bar on every page, the band's glass on three landings, `/brand/colour/`, `/brand/surfaces/`, the glass examples, `marketing-bar` and `stage-hero`. Each is the glass's own tint, edge, rim, shadow, blur or light.
- **3** scrims: `dialog`, `sheet` and `alert-dialog`'s overlays.
- **0** in an overlay's surface. Every dialog, sheet, alert dialog, popover, tooltip and menu content, opened, is solid already.

**Not translucent:** 1 element at opacity 0 (a collapsed sidebar label: hidden), and 9 readings taken mid-transition (`tabs`' trigger after focus; a tooltip's entrance). All 9 are solid once the transition ends (*the audit* §1).

**Violations:**

| Class | Distinct | Where |
|---|---|---|
| An alpha fill on the page | 5 | `alert` and `error-summary` (the `/10` tint, which `029` removes); three site specimens (the `border` role's swatch, twice, and the `bg-scrim` specimen) |
| The 10% hairline on the page | 102 | 28 item attributions and 41 site-chrome elements. Every one of the 102 pages has one |
| The 10% hairline inside a layer | 4 | the menu's separator, a `kbd` in a tooltip, a code block and inline `code` in the band's glass |
| Disabled by opacity | 14 rendered | 12 items and 2 labels. By source: 25 `opacity-50` classes in 20 files of 16 items |
| A shadow, a backdrop filter or container opacity off a layer | 0 | — |
| Text, SVG paint, `filter`, blend modes | 0 | — |

**Latent, in source and CSS:** the four field utilities' `--border` is 24% of the legend over transparent (no example draws it). The built site CSS holds 76 rules with a translucent colour: 5 from the theme, 4 from `alert`, 21 from LayerChart's own stylesheet, and about 46 from class names Tailwind found in `context/` and `tests/` (*the audit* §2.4). Those 46 are removed by `020a` before this lands (decision 14), which leaves about 30.

So three things carry nearly every violation: one token, the hairline; one habit, disabled by opacity; and the four tints `029` already removes.

## Decisions

### 1. What a layer is

- **A layer is an element painted above other content that is not its own.** Content lies or moves beneath it.
- **Kuiper has four kinds:**
  - **the bar:** a fixed or sticky bar that content scrolls under. The site bar, `marketing-bar`, and `app-shell`'s sticky header;
  - **the overlay surface:** the content of `dialog`, `sheet` and `alert-dialog`; `popover`; `dropdown-menu` and its sub-menu; `tooltip`; `chart`'s tooltip; `toast`;
  - **the scrim:** the veil behind a modal, in `dialog`, `sheet` and `alert-dialog`;
  - **the glass panel:** any element with the `glass` utility (decision 12).
- **The page is the ground floor.** A card, an alert, a table, a code block, a sidebar and a frame are on the page's level. None of them is a layer. `002` decision 7 says the same thing of elevation: "for menus and dialogs only".
- **Everything inside a layer is on that layer's level.** A layer's descendants follow the page's rule (decision 4). Only the layer's root, and its own `::before` and `::after`, may paint translucent.

*Why these four:* each one is drawn over content that is not its own. The owner's bar is the first. Overlays and the scrim are the owner's own examples in the roadmap row.

### 2. How a layer is declared: `data-layer`, and the `glass` class

- **The root of a scrim carries `data-layer="scrim"`.** These are `dialog-overlay`, `sheet-overlay` and `alert-dialog-overlay`.
- **The root of an overlay surface carries `data-layer="surface"`.** These are `dialog-content`, `sheet-content`, `alert-dialog-content`, `popover-content`, `tooltip-content`, `dropdown-menu-content`, `dropdown-menu-sub-content`, `chart-tooltip` and `toast`'s root.
- **That is 12 roots in 8 items.** The attribute is set in the item's own markup, beside its `data-slot`, and passes no prop.
- **A glass panel is declared by its class.** `glass` already says what it is, and L22 already limits it to expressive items. A second attribute would say it twice.
- **A layer that paints nothing translucent needs no declaration.** `app-shell`'s sticky header is a layer, and solid. It gains nothing.
- **The values are exactly `scrim` and `surface`.** The lint fails any other (decision 15).
- **A declared root must be above something, and the test checks it.** Every `[data-layer]` root is out of flow (`position` `fixed`, `absolute` or `sticky`), or its nearest positioned ancestor other than itself is out of flow, paints nothing, and is the item's own wrapper (a bits-ui floating wrapper, a `*-positioner` slot, or LayerChart's tooltip container), named in the case data (test 11). A `relative` root inside a page-level transparent `absolute inset-0` box does not pass. bits-ui's `[data-bits-floating-content-wrapper]` (absolute or fixed, transparent) holds the `popover`, `dropdown-menu` and `tooltip` contents, and the transparent, fixed `dialog-positioner` holds `dialog-content`; both qualify (EXECUTED (review), `layers.mjs`). `chart-tooltip`'s root is a plain `div` of the item's own, inside LayerChart's positioned tooltip container; the builder confirms that container paints nothing, or the check fails it. So the attribute cannot exempt an element on the page's level.

*Why an attribute, not a list kept in a test:*

- The lint can tie a layer's paint to the file that declares the layer (decision 15). A list of slot names would have to be kept in step with every item by hand.
- The runtime test finds the roots in the DOM, with no list to drift (decision 17).
- It is visible in the markup an app owns. An app's own overlay can follow the pattern, and the upgrade guide says how (decision 20).

### 3. What a layer's root may paint

| Kind | May paint translucent | Must be solid |
|---|---|---|
| glass | its tint, its edge, its inset rim, its shadow, its backdrop blur, its `::after` light (`--glass-*`) | everything inside it |
| scrim | its fill, in the `scrim` role | — |
| surface | a shadow, through `shadow-elevation` only | its fill and edge; everything inside it |
| bar (not glass) | nothing, in Kuiper today | everything |

- **An overlay surface stays solid.** The rule allows a layer to be translucent; it does not require it. Kuiper's overlays are solid by choice (`026` decision 8: "Its surface is solid … as `popover` is"). So a surface's root may only cast a shadow.
- **Today `shadow-elevation`'s drop is fully transparent** (`elevation-shadow` is `clear` in both schemes) and its ring is solid. So no productive layer casts a visible shadow. The allowance keeps room for one.

### 4. The rule for everything else: solid or unfilled

Everything that is not a layer's root follows one rule. Nothing on it is **translucent**. Translucent means any of:

- a background, border, outline, text, `fill` or `stroke` colour with alpha strictly between 0 and 1, in any colour syntax (`019a`'s parser: `rgba(…)`, `rgb(… / a)`, `oklab(… / a)`, `oklch(… / a)`, `color(… / a)`). A border or outline counts only where it is drawn: width above 0, style not `none`;
- a colour with such an alpha inside `background-image`;
- a shadow (decision 6);
- a `backdrop-filter` other than `none`;
- `opacity`, `fill-opacity`, `stroke-opacity` or `stop-opacity` strictly between 0 and 1;
- a `filter` holding `opacity()` or `drop-shadow()`;
- a `mix-blend-mode` other than `normal`;
- a `mask-image` with a stop whose alpha is strictly between 0 and 1 (the `scroll-fade*` and `mask-*` utilities fade content this way);
- a `text-decoration-color`, `caret-color`, `column-rule-color` or `accent-color` with such an alpha; and the same colours on `::selection` and `::marker`. None is translucent today (grep); they are read so that none becomes so.

**Relative colour syntax counts.** A value such as `oklch(from currentColor l c h / calc(alpha * .2))` has an alpha that is not the literal 1. In CSS read statically (decision 16), any alpha that is not the literal `1` or `100%`, or `0`, counts as translucent. At run time the engine resolves it, and the computed alpha is read.

**A filled element's translucent border counts, by design.** A border paints over its element's own background (`background-clip: border-box`; nothing in `src/` changes it). So a 10% edge on a white card shows the card, not "the colour behind it". The rule still counts it. It reads computed colour, which is a stricter and simpler proxy than asking what each edge shows through. That is a choice, and this is where it is made.

**Solid** is alpha 1. **Unfilled** is alpha 0, or no paint. Both are allowed. A `border-transparent` is unfilled, so `026`'s and `031a`'s transparent borders pass.

**Opacity 0 hides.** It is not translucent. `sidebar-menu-action`'s reveal on hover (`md:opacity-0`, then `opacity-100`) and the collapsed `sidebar-group-label` pass.

**A placeholder is text.** Every `::placeholder` is solid. Tailwind's preflight sets it to the current colour at 50%. Every item that draws a placeholder overrides that already: through `input` or `textarea`, which set `placeholder:text-muted-foreground`, or through `code-editor`'s `.cm-placeholder`, set to `muted-foreground`. The site's search field sets it too (*the audit* §2.4). The runtime test holds it there (decision 17).

**Exempt:** system colours under forced colours. Some engines' emulated `Highlight` carries its own alpha (`028` decision 2). The runtime test runs outside forced colours.

### 5. Motion is not depth

- An animation or a transition may pass through any opacity or alpha. `019a` already ruled so for the lockup's dots: "That is motion, not depth."
- **A state may not rest translucent.** The rule is read when every finite animation and every CSS transition has finished.
- The audit's nine mid-transition readings show why (*the audit* §2.1). `tabs`' trigger read `rgba(255, 255, 255, 0.137)` 120 ms after focus, and `rgb(255, 255, 255)` 700 ms after.
- So the runtime test's `settled()` waits for `document.getAnimations()`, which holds CSS transitions as well as animations, after each hover, focus and opening (decision 17).
- **Infinite animations are not waited for.** They never finish. Today the only one is `spinner`'s rotation, which paints no alpha. An infinite animation that changes opacity or alpha would rest translucent forever, so the runtime test reads it as it finds it.
- The glass `::after` light the audit read at 0.918 on hover settles to 0 after 1.5 s (EXECUTED (review)). It is motion, and the glass root's own paint besides.

### 6. Shadows

*Why:* a shadow is translucent paint, so decision 4 already places it (INFERRED). The owner said nothing of shadows. The conclusion follows from the rule's letter, and from `002` decision 7 (elevation is for menus and dialogs only). It also fits the rule's sense: a shadow is the other sign of depth, the dark a layer casts on what lies below it.

So:

- **A shadow belongs where depth is: on a layer's root, and nowhere else.** Not inside a layer, and not on the page.
- **A shadow** is a `box-shadow`, `drop-shadow()` or `text-shadow` part whose colour has alpha above 0, and either alpha below 1 or a blur above 0.
- **A solid, unblurred box-shadow is an edge, not a shadow.** It is allowed anywhere. That covers `shadow-elevation`'s ring, `busy-edge`'s inset line and `site.css`'s current-page mark.
- **A fully transparent part casts nothing.** `shadow-elevation`'s drop, in `clear`, is allowed anywhere.
- **The lint:** L5 already allows only `shadow-elevation` in an item. D5 extends L5 to site files. And `shadow-elevation` may appear only in a file that declares `data-layer="surface"` (D4, decision 15).
- **At run time,** `allowed()` recognises "a shadow through `shadow-elevation` only" by value: the element's computed `box-shadow` equals that of a probe given `shadow-elevation`, inserted beside the element and read there (decision 17).
- **The primitive `ink-shadow`** (16% ink, `002` decision 7) is unused: `elevation-shadow` points at `clear`. It stays, a primitive no role names. Decision 7's token test reads roles, not primitives.

### 7. The hairline becomes solid (Q1)

The hairline is the one token behind 106 of the audit's violations. `border`, `sidebar-border` and `groove-line` all point at it, and the `groove` utilities draw it. It is 10% ink in light and 10% paper in dark. On a card, it lets the card show through. On the page, it lets the page show through. That is transparency on one level, which the owner's rule forbids.

- **The primitives keep their names and become solid.** Each is its colour composited at 10% over its scheme's middle ground, by lightness:
  - `line`: `ink` at 0.1 over `paper` (`background`), **`#DCDAD3`**. Today `#0B0F171A`.
  - `paper-line`: `paper` at 0.1 over `ink-raised` (`card`), **`#37342E`**. Today `#F3F0E81A`.
- **Each carries `029` decision 10's composite record.** That is `$extensions["co.plutosystems.kuiper"]` = `{ "since": "0.13.0", "composite": { "of": "ink", "over": "paper", "alpha": 0.1 } }`, and for `paper-line`, `of: "paper"`, `over: "ink-raised"`. `029`'s validator rule then holds the value to `compositeTenths(of, over, alpha)`.
- **The roles follow with no edit.** `--border`, `--sidebar-border` and `--groove-line` become `light-dark(#dcdad3, #37342e)`.
- **Nothing in any item or site file changes for it.** The 28 item uses, the 42 site uses, the 72 `groove` uses, `code-editor`'s gutter and the theme's inline `code` all read the token (*the audit* §2.2).
- *Why the middle ground:* an unfilled divider then reads close to today on every ground of its scheme, and never vanishes. Composited over `card` in light, it would almost vanish on `muted` (1.01). Composited over `background` in dark, the same (1.02) (*the audit* §3.1).
- **What changes, by where the edge sits.** A border paints over its element's own fill (decision 4). So a filled element's 10% edge today composites over the element, not over the ground, and the change differs by context. Of 2,020 drawn hairlines sampled on nine pages, 1,416 sit on an element with an opaque fill of its own (EXECUTED (review), `filled.mjs`). Ratios today and after, against the outside and against the inside where they differ (EXECUTED (review), `lines.py`):

  | Edge | Today | After |
  |---|---|---|
  | light divider on paper | 1.24 | 1.23 |
  | light white card, frame, code block, inline `code`, on paper | 1.09 / 1.24 | **1.23 / 1.40** |
  | light divider on `muted` | 1.24 | 1.11 |
  | light divider on `031a`'s `sunken` (`#DCD7CA`) | 1.23 | 1.03, so `surface-sunken` redeclares it to `sunken-line` (decision 11): 1.22 |
  | dark divider on graphite, the most common rule on the site | 1.29 | **1.48** |
  | dark card on graphite | 1.48 / 1.32 | 1.48 / 1.32 |
  | dark code block, inline `code`, muted box (`ink-wash` fill) | 1.68 / 1.34 | **1.48 / 1.18** |

  The two largest changes: in light, inline `code`, code blocks, cards and frames get a darker edge against the page (1.09 to 1.23). In dark, page rules get stronger (+0.19) and code blocks and inline `code` weaker against their fill (−0.16).
- *Why not `border-input`:* `019a` and `027` swapped single uses to `border-input`, the control edge (3:1 and more). Swapping 142 uses would turn every quiet rule into a control's edge.
- **Where a hairline sits over an image** (`avatar`'s inset ring), it becomes a solid 1 px frame. That is a visible change, and the checkpoint looks at it.
- **A floor, tested:** the solid line reads at least 1.1:1 on each of its scheme's `background`, `card` and `muted`, and `sunken-line` at least 1.1:1 on `sunken` (test 3). A later value cannot let it vanish.
- **Two grounds the token cannot serve,** each handled where it is painted: a field (decision 8) and the glass over a field (decision 12).

*If Q1 is option 2* (the hairline is a sanctioned exception): this decision and decision 8 are void. The rule then reads "no translucent **fill**", the runtime test allows a drawn border whose colour equals the `border` role's, and the lint leaves `border-border` alone. Decisions 9 to 22 stand.

### 8. The fields' hairline becomes solid

- `scripts/build-tokens.ts:521` writes each field utility's `--border` as `color-mix(in srgb, var(--field-N-foreground) 24%, transparent)`.
- It becomes **`color-mix(in srgb, var(--field-N-foreground) 24%, var(--field-N))`**: the same colour, composited over the field's own fill.
- On the field, it paints exactly what it paints today. Off the field, it no longer lets anything through.
- **Each field utility also sets `--groove-line` and `--sidebar-border`** to the same composite. Today they are not reset (`build-tokens.ts:505–526`). With the solid line, a `groove` on a field would turn into a pale line at 3.55 to 5.02:1 in light and a dark one at 5.82 to 8.90:1 in dark (EXECUTED (review)).
- No example draws a hairline on a field today (*the audit* §2.3). The stage rule keeps controls on `surface-plain` or glass. So no picture changes for it. An app can still draw one, and now it reads as the field's own line.

### 9. Disabled: three solid roles, not half opacity (Q2)

**`opacity-50` on a control is container opacity.** A disabled primary button at half opacity lets the page show through itself. It is on the page's level, not above it. So it breaks the rule. A disabled control is drawn in three solid roles instead.

**The roles.** Each joins both scheme files with a `$description`. Its CSS name is `--<role>` and its utilities are the usual ones.

| Role | What it colours | Light | Dark |
|---|---|---|---|
| `disabled` | a disabled control's coloured fill | `wash` (`#E9E5DB`), as `muted` and `accent` | `ink-wash` (`#2C2821`), as `muted` and `accent` |
| `disabled-foreground` | its text, icons and marks | new primitive `ink-half`, `#7F8080` | new primitive `paper-half`, `#8B8881` |
| `disabled-edge` | its edge, and an off switch's track | new primitive `line-input-half`, `#BCB7AC` | new primitive `paper-line-input-half`, `#4E4940` |

- **The four primitives are composites** (`029` decision 10's record): `ink-half` is `ink` at 0.5 over `paper`; `paper-half` is `paper` at 0.5 over `ink-raised`; `line-input-half` is `line-input` at 0.5 over `paper`; `paper-line-input-half` is `paper-line-input` at 0.5 over `ink-raised`. Each is the colour `opacity-50` draws today on the scheme's middle ground (decision 7). So a disabled ghost button looks as it does now.
- *Why `disabled` aliases `wash`:* it adds no new colour. It is its own role, so a later spec can move it alone.
- **Wash is also `accent`,** the fill of a hovered or `aria-expanded` ghost button (`button.svelte:18`), and it reads only 1.10 on paper and 1.26 on a card (EXECUTED (review)). So a disabled filled control is never drawn by its fill alone: **it always carries `disabled-edge`** (`#BCB7AC`: 1.75 on paper, 2.00 on white; `#4E4940` in dark). Every disabled button, filled or not, then shares one edge, and a disabled primary is no fainter than a disabled secondary. A hovered ghost button has no edge, so the two are told apart.
- **Legibility, tested.** WCAG exempts an inactive component from text contrast (SC 1.4.3) and from non-text contrast (SC 1.4.11). So this is a floor Kuiper sets itself, not conformance. `disabled-foreground` reads at least 3:1 on `disabled`, `card` and `background` (test 3). It reads 3.14 on `disabled` in light and 4.14 in dark (*the audit* §3.2). Today a disabled primary button's label reads 1.69:1 on its own faded fill. Primer's disabled text reads 3.07 on its disabled fill; Carbon's 1.73 on white (EXECUTED (review)).
- *Why neutral roles:* they are the simplest solid answer, and the references name disabled colours as roles (*the audit* §4, corrected):
  - **Primer** names `fgColor.disabled`, `bgColor.disabled` and `borderColor.disabled`, solid and neutral. But its disabled primary button keeps its hue: `button.primary.bgColor.disabled` is `#95D8A6`, a pale green, with a white label at alpha 0.8 (`primitives` `button.json5:266–284, 572–576`). That is Q2's option 3 pattern.
  - **Carbon** names `border-disabled` (solid gray 30) and `text-disabled` (gray 100 at alpha 0.25) in `theme.tokens.json`, and `button-disabled` in `white/button.tokens.json:83`: solid gray 30 in the white theme, gray 50 at alpha 0.3 in g100.
  - Both keep a filled button's fill visible, about 1.7:1 on white. Neither fades a whole control with `opacity`.

**The mapping, one rule for every item.** Under each item's own disabled variant (`disabled:`, `aria-disabled:`, `data-disabled:`, `group-has-disabled/field:` and so on):

1. **Text, icons and marks** take `text-disabled-foreground`. A mark drawn as a fill (a radio's dot, a checked box's fill under its check) takes `bg-disabled-foreground` or `bg-disabled`, as the table below says.
2. **An edge** takes `border-disabled-edge`. A fill whose colour is the edge's (`switch`'s off track, `bg-input`) takes `bg-disabled-edge`.
3. **A coloured fill** (`primary`, `destructive`, a checked box, a pressed toggle) takes `bg-disabled`, or `bg-disabled-foreground` where the state must still read against an unpressed twin. A neutral fill (`card`, `secondary`, transparent) stays. A filled control that takes `bg-disabled` also takes `border-disabled-edge`, never `border-disabled`.
4. **The `opacity-50` goes**, and with it `028`'s `forced-colors:<variant>:opacity-100` twin (decision 10).
5. **Every class this adds has its forced twin on the same stack** (decision 10).
6. `cursor-not-allowed` and `pointer-events-none` stay.

The per-item table is in "Design". *If Q2 is option 2* (disabled keeps `opacity-50`, as a state rather than depth): this decision is void; the lint's opacity rule allows exactly `<disabled variant>:opacity-50`, counted as allowances; the runtime test allows opacity 0.5 on a disabled element and its label. *If Q2 is option 3* (a disabled twin per coloured role, Primer's pattern): the table's coloured fills take `primary-disabled`, `destructive-disabled` and so on, each the role composited at 0.5 over the middle ground (light `primary-disabled` `#909CDE`, 2.30 on paper), and the look of every disabled control is kept, solid. The label is solid `disabled-foreground`, not Primer's translucent white.

### 10. Forced colours (`028`)

- `028` decision 9 gives every `<variant>:opacity-50` a stacked twin, `forced-colors:<variant>:opacity-100`, and a `GrayText` text, edge and mark under the same variant.
- **This specification removes each `opacity-50` and its `opacity-100` twin together.** `028`'s `GrayText` twins stay.
- **A bare disabled class is overridden by `028`'s twin; a stacked one is not.** `disabled:text-disabled-foreground` and `forced-colors:disabled:text-[GrayText]` are both (0,2,0), and the forced one sorts later, so it wins. But the stacked classes this adds, such as `disabled:data-checked:bg-disabled` or `disabled:data-[state=on]:bg-disabled-foreground`, are (0,3,0). They outrank `028`'s (0,2,0) state twins, `forced-colors:data-checked:bg-[Highlight]` and `forced-colors:data-[state=on]:bg-[Highlight]`. Under forced colours the author fill is then forced to `Canvas`, and a pressed disabled toggle looks the same as an unpressed one (EXECUTED (review), `forced.mjs` and `forced2.mjs`, Chromium and Firefox).
- **So every class this adds gets a forced twin on the same stack** (`028` decision 2's rule), from `028`'s list of system colours:
  - a state fill (checked, indeterminate, on, pressed, a selected dot) takes `GrayText`, and the text and marks on it `Canvas`: for example `forced-colors:disabled:data-[state=on]:bg-[GrayText] forced-colors:disabled:data-[state=on]:text-[Canvas]`, and `forced-colors:disabled:data-checked:bg-[GrayText] forced-colors:disabled:data-checked:text-[Canvas]`, with the indeterminate and `group-has-disabled/field:` forms;
  - an edge takes `GrayText`: `forced-colors:disabled:data-checked:border-[GrayText]`;
  - a neutral fill takes `Canvas`: `forced-colors:data-disabled:data-unchecked:bg-[Canvas]` on the switch's track; and `forced-colors:data-disabled:data-checked:bg-[GrayText]` for its on track;
  - **a mark on a state fill takes `Canvas` when the fill takes `GrayText`.** The checkbox's check and the toggle's label do already. The switch's thumb needs its own twin on the same stack, `forced-colors:data-disabled:data-checked:bg-[Canvas]`: at (0,3,0) it beats `028`'s (0,2,0) `forced-colors:data-disabled:bg-[GrayText]`. Without it, an on, disabled switch's thumb is `GrayText` on a `GrayText` track and cannot be seen (EXECUTED (re-check), `recheck.mjs` (a): track and thumb both `rgb(96, 0, 0)`);
  - text on a bare variant needs nothing new: `028`'s twin wins already.

  The per-item table writes each one.
- `028`'s test 4 (assertion E: effective opacity 1, text and edges `GrayText`) and test 5 (the rules compute) must still pass for the 16 items. **Three cases join `028`'s case data for E and G:** a disabled, pressed toggle; a disabled, checked checkbox; and an on, disabled switch. G reads the stacked twins' `GrayText` fill, and for the switch, the thumb's `Canvas` fill against the track's `GrayText`.
- `028`'s test 8 has two rules. **Its first rule still runs over the new classes**: every non-forced class that sets a property under a state variant has a forced twin on the same variant. It fails today on every stacked class the draft wrote without a twin. **Only its second rule** ("every `<variant>:opacity-50` … has `forced-colors:<variant>:opacity-100`") is replaced, by "no item holds `opacity-50`", which the lint also holds (decision 15).
- **For `028`'s builder:** `028` alone shows `HighlightText`, not `GrayText`, on a pressed disabled toggle, because its `data-[state=on]` twin sorts after `disabled:` (EXECUTED (review), `order.mjs`). These stacked twins fix that once this lands.
- `028` leaves the scrim's alpha alone under forced colours. That is still a layer (decision 3).

### 11. The order with `031a` and `031`, high contrast, and the sunken ground

**The order in lane T: `031a`, then this specification's token edit, then `031`** (`031a`'s Knock-ons; `031` decision 20). `031a` adds the public role `sunken` and the utility `surface-sunken`. This specification reads `sunken` as a public ground and extends `surface-sunken`. `031` then covers this specification's public roles. **This specification owes no high-contrast pairs.**

**High contrast for the lines.** Under `more`, `border`, `sidebar-border`, `groove-line` and `sunken-line` take `031`'s line swatches (`line-more` and `paper-line-more`, re-derived by `031` where `sunken` needs it), measured to 4.5:1 on each ground they sit on (`031` decision 7 and `031a`'s Knock-ons, item 4). They are `031`'s line rows.

**The disabled roles: one rule, in every context.** A disabled control is exempt from contrast (WCAG SC 1.4.3 for text, SC 1.4.11 for its edge and marks). So:

- **The three disabled roles keep their standard values under high contrast.** No `-more` value is made for them (`031` decision 6). High contrast strengthens the enabled controls, so the gap between enabled and disabled widens.
- **Their pairs are not text or non-text rows of `kuiper.contrast.json`.** `031`'s 7:1 and 4.5:1 do not reach them. The contrast file's `more` section lists them as `exempt`, with that reason.
- **Their targets are this specification's own, and the same in every context** (standard and both `-more` contexts), held by test 3:

  | Pair | Target |
  |---|---|
  | `disabled-foreground` on `disabled`, `card`, `background`, `muted` | 3:1 |
  | `background` (a pressed, disabled toggle's label) on `disabled-foreground` | 3:1 |
  | `disabled-edge` on `background`, `card`, `muted`, `disabled` | 1.5:1 |

  The lowest readings (EXECUTED (re-check), `recheck.py`): `disabled-foreground` 3.14 on `disabled` and `muted` (light) and 4.14 (dark); the toggle's label 3.48 (light) and 5.20 (dark); `disabled-edge` 1.59 on `muted` and `disabled` (light) and 1.64 (dark). (`disabled` and `muted` are both `wash` and `ink-wash`.)
- **Why 1.5:1 for the edge.** It sits below today's half-opacity edge (1.75 on the middle ground) and Carbon's `border-disabled` (gray 30, 1.71 on white), with margin. It sits above the hairline's 1.1, so a disabled control's edge is never drawn at hairline weight. Primer's light `borderColor.disabled` is far stronger, solid neutral 8 at 3.45 on white (`borderColor.json5:119–120`), so this is a choice, not the only reading. A filled disabled control's shape rests on its edge (decision 9).
- **On `sunken`, two disabled pairs fail, so they are restricted.** In light, `disabled-foreground` reads **2.76** on `sunken` and `disabled-edge` **1.39** (EXECUTED (re-check)). `[disabled-foreground, sunken]` and `[disabled-edge, sunken]` join `031a`'s `restricted` block in every context: measured in light (2.76 against 3; 1.39 against 1.5) and by rule in dark, as `input` is there (2.80). A control in a well sits on a `surface-plain` card (below), where every row above holds. `031a`'s lint and browser test keep the restricted pairs out. `031a`'s record lists the two rows (its decision 1a); **this specification writes them into the contrast file**, in its lane-T edit, since the roles land here and the validator rejects a row that names an unknown role. Test 3 reads that they are there.
- **The pressed, disabled toggle's label inside a well.** It is `text-background` on `disabled-foreground`. Inside a bare well, `--background` is `sunken`, and the label reads 2.76 (EXECUTED (re-check)). On a `surface-plain` card inside the well, `--background` is restored, and the label reads 3.48 again. The toggle is a control, so it sits on such a card.
- **Because high contrast changes no ground and no disabled role, the check passes under `more` whenever it passes at standard.** It runs there anyway, so a later change to a ground is caught.
- *This replaces* the previous draft's higher targets under `more` (4.5:1 and 3:1) and its proposed `-more` disabled values, which `031` declined.

**The sunken ground (`031a`).** `031a` makes `sunken` a public role (`#DCD7CA` light, `#0B0A07` dark), painted through `surface-sunken`, with restricted pairs (`031a` decisions 1, 1a and 1b). It is also the index stage's ground while each picture is taken (`031a` decision 7). The solid light line reads **1.03:1** on it; today's 10% line reads 1.23 (EXECUTED (review)). So every unfilled divider in a light well, and in a light thumbnail, would vanish. Darkening `line` to clear 1.1 on `#DCD7CA` would darken every hairline on every other ground. **So the line is redeclared where `sunken` is painted.**

- **A public role, `sunken-line`,** joins both scheme files, with a `$description`: "The line on the sunken ground. surface-sunken sets the line variables to it." It aliases two primitives in the base file, each with its composite record:
  - `paper-sunken-line`: `ink` at 0.1 over `paper-sunken`, **`#C7C3B8`** (1.22 on `sunken`; today's 10% line reads the same);
  - `ink-sunken-line`: `paper` at 0.1 over `ink-sunken`, **`#22211E`** (1.22; today the same).

  `kuiper-theme` writes `--sunken-line: light-dark(#c7c3b8, #22211e)`, with its two fallback lines (`029` decision 6) and its `@theme inline` colour, so `border-sunken-line` and the rest are generated utilities. `kuiper.css` carries it. It is in `cssVars`.
- **The contrast file gains it as a non-text row**, `[sunken-line, sunken]`, of the decorative line kind: floor 1.1:1 at standard. WCAG 1.4.11 does not apply to a decorative divider. Under `more` it is one of `031`'s line rows at 4.5:1.
- **`surface-sunken` redeclares the lines** (`031a` decision 1b). Its full list once this lands, in order; this specification writes the last four lines:

  ```css
  @utility surface-sunken {
    /* 031a: surface-plain's restorations, from SURFACE_ROLES less the four roles the well sets below */
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

  Before this lands, `031a`'s utility also restores `--border: var(--surface-border)`; this specification replaces that line with `--border: var(--sunken-line)`.

  A well painted with `surface-sunken` keeps its dividers. A bare `bg-sunken` is the colour utility `029` decision 7 generates from `--color-sunken`; hand-writing it to carry declarations would collide with that generated rule. So the declarations live on `surface-sunken`. `029`'s T7 still holds, through `color-sunken-line` in `cssVars.theme`. Items paint `sunken` only through `surface-sunken` (`031a`'s lint), and the role's words point apps there.
- **The redeclarations stop at a card.** Custom properties inherit, so without a stop every opaque surface inside the well would take the well's line and ground. In dark, a divider inside a card in a well would be `#22211E` on `#221F19`, **1.02:1**, against 1.32 on any other card; in light, 1.76 on white, against 1.40 elsewhere. `avatar-group`'s cut-out would become a sunken ring on white, one level in (EXECUTED (re-check), `recheck.mjs` (b) and `recheck.py`). Fields have the same problem, and the system already has the mechanism for it:
  1. **`SURFACE_ROLES`** (`scripts/build-tokens.ts:91`) gains `background`, `groove-line` and `sidebar-border` (`border` is there already). So `surface-plain` restores all four from the root's `--surface-*` copies. `029` already declares `--surface-background: var(--background)` on `:root`; the generator emits that copy once. `glass` restores the same roles, as it restores the others.
  2. **`card` takes `surface-plain`**, as `stage-card` and `live-console` already do. The builder lists any other item that paints an opaque ground and is likely to sit in a well, and gives it the same; the landing notes name each.
  3. **`surface-plain` leaves L22's expressive list.** It sets variables only and paints no fill, so it adds no volume, and a productive item such as `card` can carry it. `011` decision 8 put it there; this is the one change to that list.
  4. **`031a`'s role words become "on a `surface-plain` card inside it"**, and the upgrade guide's step 7 says the same. That change is `031a`'s, in its own record.
  5. **Test 3 and the runtime test read a divider inside a `surface-plain` card inside a well:** at least 1.1:1 against the card, in both schemes. It is proven by mutation: without `surface-plain`, the dark divider reads 1.02 and fails.
- **`--background` too, recommended and adopted.** Inside a well, `--background` means "the ground here", and that is `sunken`. So `avatar-group`'s `border-background` cut-out matches the well instead of drawing a paper ring (`031a` decision 6), and any `bg-background` mat inside a well sinks with it. The allowed pairs on `sunken` (`031a` decision 1a: `foreground`, `muted-foreground` and `primary` text) are the ones an item draws on `background`, and `031a`'s lint and browser test keep the restricted pairs out wherever they are drawn. This is not an owner question: `surface-sunken` is new in 0.13.0, so no installed app holds it.
- **The capture rule takes the same declarations.** `031a`'s thumbnail script applies `surface-sunken`'s declarations to `[data-slot="frame-stage"]` while it photographs:

  ```css
  [data-slot="frame-stage"] {
    background-color: var(--sunken) !important;
    --background: var(--sunken);
    --border: var(--sunken-line);
    --groove-line: var(--sunken-line);
    --sidebar-border: var(--sunken-line);
  }
  ```

  A card in a picture then reads 1.22 against the stage, and its white fill still carries it. An `avatar-group` in a picture loses its paper ring.
- **Who writes these lines: this specification.** It lands after `031a` in lane T, so it adds the four declarations to `031a`'s `surface-sunken` and to the capture rule. If the order ever flips, whichever lands second writes them.
- **Test 3's floor reads `sunken-line` on `sunken`,** at least 1.1:1 in each scheme.

**The index tile** (`031a` decision 5) has a transparent border and no hairline, so it meets this rule before this lands.

### 12. Glass resting on a field or the page's own ground (Q3)

- The glass panel is drawn as raised: a shadow, an inset rim and an isolated stack (`app.css`'s `glass` utility). It sits above what is beneath it.
- Some panels have content moving beneath them: the site bar and `marketing-bar`. Others rest over a field that does not move: the band's glass on the landings, `/brand/colour/`'s panels, `stage-hero`'s panel over its object. Two specimens rest on the page's own ground: `kuiper-theme`'s glass example and `/brand/surfaces/`'s.
- **The owner's answer (Q3, option 1, with the addition): a glass panel is always a layer.** A band's field is full bleed under its panel and is not the panel's own content, so decision 1's definition already admits the panel. The panel is drawn raised, with rim, shadow and isolation (`011` decision 8). No rule changes.
- **The addition, adopted:** the two specimens that rest on plain paper, `kuiper-theme`'s glass example and `/brand/surfaces/`'s, move onto a field, so their glass shows what it is for. A site change in lane S; no item changes.
- The owner's sentence ties translucency to being above: "above everything else … so it is transparent to what is below it". "Stays in a fixed position" says why the bar is above everything. The owner answered Q3 with option 1 and its addition (Landing notes).
- **Inside glass over a field, draw a rule on a filled element, not on the glass.** An unfilled divider inside glass over a coloured field reads only 1.00 to 1.13 with the solid line (EXECUTED (review)). None is drawn today. The upgrade guide says so (decision 20).

### 13. The tints and the specimens

- **`alert`'s tints** are `029`'s (decision 10 there): `bg-destructive-tint` and `bg-success-tint`, solid. This specification checks them, in the runtime test, through `alert` and `error-summary`. It changes nothing.
- **The `border` role's swatches** on `/foundations/tokens/`, `/foundations/colour/` and `kuiper-theme`'s contrast example become solid with decision 7. No edit.
- **`kuiper-theme`'s elevation example** (`src/lib/site/examples/kuiper-theme/elevation.svelte`) shows `bg-scrim` and `shadow-elevation` on plain specimens, in the page's flow. A translucent scrim swatch on the page is what the rule forbids, and an attribute must not license it (decision 2). **So each specimen is redrawn as a real layer:** a small box of sample content (a line of text and a rule), with the scrim, and the elevated surface, absolutely positioned over it inside a relatively positioned frame. Each then carries `data-layer="scrim"` or `data-layer="surface"`, and passes test 11's out-of-flow check. No allowance is needed.

### 14. Tailwind reads only the code: `020a`

- Tailwind's automatic source detection reads every file git does not ignore. It finds class names quoted in `context/` and writes rules for them. About 46 of the built CSS's 76 translucent rules come from there, such as `.bg-popover/70` (in three `context/` files) and `.supports-backdrop-filter:backdrop-blur-xs` (*the audit* §2.4, corrected). None of the translucent ones is found only in `tests/` (EXECUTED (review)). No page uses them.
- **They are removed by `020a`** ([`020a-the-sites-css-reads-only-code.md`](020a-the-sites-css-reads-only-code.md), as amended for its build, 2026-11-15), a small change that lands before this specification. `020a`'s site stylesheet imports the generated `src/app.css`, which it leaves as it is, and excludes `context/` and `tests/` from Tailwind's sources. An app's `app.css` is unaffected.
- This specification changes no Tailwind source. Its built-CSS check (decision 16) reads the CSS that `020a` leaves.

### 15. The lint

New rules join the literal lint (`scripts/lint-literals.ts`). They are numbered after the last rule at landing. `028` claims L25 and L26, and `029` also claims L25 for its `read-token` allowance; the builder of whichever lands second renumbers, and the landing notes give the final numbers. Here they are called **D1 to D5**.

- **The depth rules lint site files too.** An item file gets every rule, as now. A site file gets D1 to D5 only. The site files are those `015`'s `tests/unit/site-literals.test.ts` reads: `src/lib/site`, `src/routes/(site)` and `src/routes/(example)`. Prose is not linted: D1 to D5 read class tokens, as the lint's `classTokens` does today.
- **D1, a translucent colour.** A colour utility (any in `COLOUR_UTILITIES`) with an alpha modifier other than `/0` and `/100`, **when its value is a colour**: a token colour, a palette colour, an arbitrary colour (`[#…]`, `[color:…]`), or the variable form on a colour utility (`(--x)`, `(color:--x)`). The modifier may be a number, an arbitrary value (`/[.5]`) or a variable (`/(--a)`). The colour test is L1's (`lint-literals.ts:438–440`), widened. So Tailwind's line-height shorthand, `text-sm/6` and `text-[13px]/5`, passes. After `029`, L1 holds this for token colours in items. D1 widens it to every colour and to site files. A colour literal (`rgba(…)`, alpha hex, `color-mix(…)`) is already forbidden in items by the lint's colour-function and hex rules, and on the site by `site-literals.test.ts`, so D1 does not repeat them.
- **D2, container opacity, and fades.** `opacity-<n>` with 0 < n < 100, `opacity-[…]`, or `[opacity:…]`, under any variant. Also the fading utilities: `shadcn-svelte/tailwind.css`'s `scroll-fade*`, and Tailwind's `mask-*` gradient utilities (decision 4). `opacity-0` and `opacity-100` pass, and so do `transition-opacity` and `transition-[margin,opacity]`, which name a property, not a value. Today it finds the 25 `opacity-50` classes in items, and nothing on the site.
- **D3, a backdrop.** L6 (`backdrop-*`) extended to site files. The `glass` utility is not a `backdrop-*` class, and stays under L22.
- **D4, a layer's paint off its layer.** `bg-scrim` passes only in a file whose markup carries `data-layer="scrim"`. `shadow-elevation` passes only in a file whose markup carries `data-layer="surface"`. A `data-layer` attribute with any value but those two fails.
- **D5, a shadow on the site.** L5 (only `shadow-elevation`, and no `drop-shadow-*`, `inset-shadow-*` or `text-shadow-*`) extended to site files. `shadow-elevation` still passes only as D4 says.
- **No new allowance.** The lint's allowance count is unchanged by this specification. The elevation specimens are real layers (decision 13), so they need none.

### 16. The CSS check, in the theme and in the build

Two tests read CSS rather than classes, because a translucent value can live in a rule no class shows.

- **The theme** (`tests/unit/depth-css.test.ts`). It parses `src/app.css`, `kuiper.css` (`021`), the `kuiper-theme` item's CSS in `registry.json`, and `src/lib/site/site.css` with `lightningcss`, the devDependency `029` adds. A declaration fails if it holds a translucent colour literal (eight- or four-digit hex with alpha neither `00` nor `ff`, `rgba` or `hsla` with alpha below 1, any `/ a` that is not the literal `1`, `100%` or `0`, including relative colour syntax with a computed alpha, or `color-mix(… transparent)`), a `mask-image` with such a stop, a `backdrop-filter` other than `none`, or an `opacity` strictly between 0 and 1 outside `@keyframes`. It passes only in these places:
  - the declarations of `--scrim`, `--color-scrim` and the `--glass-*` custom properties;
  - the `glass` utility, its `::after`, and its fallback blocks;
  - a value whose alpha is 0 (`clear`, `#0000`).

  Today it fails on the four field utilities (decision 8) and on the hairline's declarations (decision 7).
- **The roles** (`tests/unit/tokens-dtcg.test.ts`). In both scheme files, no role resolves to a colour with alpha strictly between 0 and 1, except `scrim`. Today it fails on `border`, `sidebar-border` and `groove-line`, in both schemes.
- **The build** (in `tests/e2e/build-output.spec.ts`, the project that reads the build once, `015` decision 24). Every rule of the built site CSS with a declaration that fails as above has a selector on the theme's allowlist, or is one of these counted exceptions, each reported:
  - **LayerChart's own `lc-*` rules** (21 today). They come from a dependency's stylesheet. `chart`'s class list overrides each one it draws with a solid role (see "Design"), and the runtime test proves it where it is drawn;
  - **preflight's `::placeholder`**, overridden in every item (decision 4);
  - **`.shimmer`**, from `shadcn-svelte/tailwind.css` (imported by `src/app.css`). Its `--_highlight` is `oklch(from currentColor l c h / calc(alpha * .2))`. Tailwind emits it because the word "shimmer" is in site prose (`components/skeleton/+page.svelte:22`, `marker/+page.svelte:22, 33`); no element uses the class (EXECUTED (review)). It stays after `020a`. If `020a` or a later change excludes it (`@source not inline("shimmer")`), the exception goes.

  On today's tree it fails on 76 rules; after `020a`, on about 31 (5 from the theme, 4 from `alert`, 21 LayerChart's, preflight's and `.shimmer`).

### 17. The runtime test, generalising `019a`'s

`019a`'s depth test reads the bar only. This one reads every page.

- **A helper, `tests/e2e/depth.ts`,** holds `019a`'s `translucent()`, generalised:
  - `translucent(target: Page | Frame, scope?: string)` returns every translucent thing (decision 4) under `scope`, or in the whole document, each with its element, property, value and nearest layer root;
  - a layer root is the nearest `[data-layer]` or `.glass` at or above the element;
  - it reads every property decision 4 lists, `::selection` and `::marker` included;
  - `allowed(finding)` applies decision 3's table: the root's own paint, and its `::before` and `::after`, as its kind allows. A surface's shadow is allowed only if its computed `box-shadow` equals a `shadow-elevation` probe's, inserted beside the root and read there (decision 6);
  - `settled(page)` waits for every finite animation and CSS transition, and skips infinite ones (decision 5).
- **`tests/e2e/depth.spec.ts`** holds the cases:
  - **a, every page at rest.** Every sitemap page, at 1440 and 390, in each project. Nothing outside the allowances.
  - **b, each item's examples, driven.** On each component page, each control in each example stage, and in each example iframe, is hovered, then focused from the keyboard; each popup trigger is opened, and the controls inside its content hovered. After each step, `settled()`, then the whole document is read. Nothing outside the allowances. One generated test per item, which declares `item` in its details, as `028`'s do, so `030`'s report can name it.
  - **c, the charts.** Each chart's plot is hovered at its middle, so its highlight renders. Nothing outside the allowances.
  - **d, every layer declares itself, and every declared root is a layer.** Each overlay is opened. Its scrim's root carries `data-layer="scrim"`, and its content's root `data-layer="surface"`. Each `toast` kind's root carries `data-layer="surface"`. And on every page, every `[data-layer]` root is out of flow (`fixed`, `absolute` or `sticky`), or its nearest positioned ancestor other than itself is out of flow, paints nothing, and is the item's own wrapper named in the case data (decision 2).
  - **e, placeholders.** Every `input` and `textarea` with a placeholder in a stage: `getComputedStyle(el, "::placeholder").color` has alpha 1.
  - **f, disabled colours hold.** For each disabled example, at rest and hovered: its text colour equals `disabled-foreground`, its drawn edge `disabled-edge`, and its coloured fill `disabled`, read beside the element as `028` reads system colours. So `hover:` cannot win over `disabled:`.
  - **g, the probes.** On `/components/button/`, children are injected into an example stage, one at a time: a `bg-foreground/50` fill (as `color-mix`), `opacity: 0.5`, `backdrop-filter: blur(2px)`, a `0 2px 4px rgb(0 0 0 / 0.2)` shadow, and a 1 px border at 10% alpha. Each is found exactly once. A `data-layer="scrim"` probe with a translucent fill is not found. A translucent child inside that probe is found.
- **Engines.** a, d, e and g run in every project `022` defines. b, c and f run in the Chromium projects, through `028`'s `onlyProjects`, with the reason "the walk's cost; at-rest coverage in every engine". The audit's walk took seven minutes for 204 visits with five workers (*the audit* §1).
- **Not under forced colours** (decision 4).

### 18. `019a`'s bar test

- `bar-glass.spec.ts` imports `translucent()` from `depth.ts` in place of its own. Its cases, its probe and its pages stay. Its expectation stays: nothing inside the bar's panel is translucent.
- `019a` decision 3 read "no opacity below 1" inside the bar. Decision 4 here allows opacity 0. The bar holds no hidden element after its entrance, so its test still expects none.

### 19. Interface changes, and the changelog

Bullets in the 0.13.0 entry, each marked as an interface change where it is one:

- **`kuiper-theme`** (interface change): "The hairline is solid. `--border`, `--sidebar-border` and `--groove-line` were 10% ink (`#0b0f171a`) in light and 10% paper (`#f3f0e81a`) in dark; they are now `#dcdad3` and `#37342e`, the same line composited over the page in light and the card in dark. The primitives `line` and `paper-line` take those values. The field utilities' `--border` is composited over the field, and they now set `--groove-line` and `--sidebar-border` to the same line. Transparency signifies depth: only a layer above other content lets what is below show through."
- **`kuiper-theme`** (interface change): "Three roles for a disabled control: `disabled`, `disabled-foreground` and `disabled-edge`, with their utilities, and four primitives, `ink-half`, `paper-half`, `line-input-half` and `paper-line-input-half`."
- **`kuiper-theme`** (interface change, additive): "A role for the line on the sunken ground, `sunken-line`, with two primitives, `paper-sunken-line` and `ink-sunken-line`. `surface-sunken` sets `--border`, `--groove-line`, `--sidebar-border` and `--background` inside a well, so its dividers stay visible and its ground reads as the ground." It follows `031a`'s bullet for `sunken` and `surface-sunken`.
- **`kuiper-theme`** (interface change): "`surface-plain` also restores `--background`, `--groove-line` and `--sidebar-border`."
- **`card`** (interface change): "`card` carries `surface-plain`, so inside a field or a well it draws the page's text, lines and ground." One such bullet for each item the builder adds (decision 11).
- **One bullet per disabled item** (interface change): "**`<item>`**: a disabled `<item>` is drawn in `disabled-foreground`, `disabled-edge` and `disabled`, at full opacity, where it was faded to 50%." For `accordion`, `button`, `checkbox`, `dropdown-menu`, `field`, `input`, `input-group`, `input-otp`, `label`, `native-select`, `radio-group`, `sidebar`, `switch`, `tabs`, `textarea` and `toggle`. `toggle-group`'s bullet says it follows `toggle`.
- **One bullet per layer item** (interface change, additive): "**`<item>`**: its `<slot>` carries `data-layer="surface"`" (or `"scrim"`). For `dialog`, `sheet`, `alert-dialog`, `popover`, `tooltip`, `dropdown-menu`, `chart` and `toast`. An item in both lists gets one bullet holding both sentences.
- `registry.test.ts`'s changelog check holds the hex values, the four role names, `data-layer` and "Transparency signifies depth".

### 20. The upgrade guide's section

A section, "Transparency signifies depth", in `/changelog/0.13.0/upgrade/`, after `029`'s:

1. Add `kuiper-theme` again. The hairline and the field borders become solid, and four roles arrive: the three disabled roles and `sunken-line`.
2. If you drew `border-border` over a photo or a coloured ground and relied on it tinting that ground, use a solid colour of your own there.
3. Add the updated items. A disabled control now draws in `disabled-foreground`, `disabled-edge` and `disabled`.
4. In your own components, replace `disabled:opacity-50` with the same three roles: text and icons `text-disabled-foreground`, edges `border-disabled-edge`, coloured fills `bg-disabled` with `border-disabled-edge`. If you write forced-colours rules, give each stacked disabled class a twin on the same stack, as Kuiper's items do.
5. If you built your own overlay on Kuiper's tokens, put `data-layer="surface"` on its root and `data-layer="scrim"` on its veil. Kuiper's lint then allows its shadow and its scrim.
6. Inside glass over a field, draw a rule on a filled element, not on the glass itself. A line on the glass shows almost nothing.
7. Paint a well with `surface-sunken`, not `bg-sunken`, so its dividers use `sunken-line` and its `bg-background` parts match the well. Set controls and status messages on a `surface-plain` card inside it, so they draw the page's lines and ground. Kuiper's `card` carries `surface-plain`.
8. If you run Kuiper's literal lint over your code, it now fails translucent colours, `opacity` between 0 and 100, fades, shadows other than `shadow-elevation`, and a scrim or elevation outside a declared layer.

### 21. Weight

- **The theme** gains four roles. Each is one `light-dark()` declaration, one `@theme inline` line and its utilities where used: under 0.3 kB of CSS (INFERRED, from `029`'s per-role figure).
- **The items** replace one `opacity-50` class with one to three colour classes per disabled variant: about 0.5 kB of CSS across the site (INFERRED).
- The landing notes give the measured CSS per template, within `024`'s headroom, and `025`'s refreshed per-item figures.

### 22. Lanes and order

- **Lane T.** The primitives (the hairline, the disabled four, the sunken line's two), the four roles, the field utilities, `surface-sunken`'s four declarations, the contrast file's line rows, and the theme CSS test. It queues after `031a` and before `031` (decision 11).
- **Lane I, after `028`.** `028` writes the `opacity-100` twins this removes. Two specifications editing the same 25 class strings must not run at once. It also follows `029a` in `chart`'s class list.
- **Lane S.** The elevation example, the two glass specimens moved onto a field (decision 12), `bar-glass.spec.ts`, and the four declarations in `031a`'s capture rule (decision 11). Nothing `020a` touches.
- **The lint** (`scripts/lint-literals.ts`) is shared with `028` and `029`. Its edits land in landing order.
- **Ledgers**, in landing order: `registry.json`, the changelog, the upgrade guide, `static/r/`, and every thumbnail (the hairline changes nearly all of them).
- **The roadmap row** reads lanes I and S and depends on `029`. This specification takes lanes T, I and S and depends on `028`, `029` and `031a`, and it blocks `031`. The row is the design lead's to update.

## Design

### Per-item fixes

Every item not named here changes only through the tokens (decision 7). Class names are given as each item writes its variant today. **Forced twins** (decision 10): a class on a bare variant (`disabled:text-…`, `disabled:border-…`) is already overridden by `028`'s twin on that variant, so it needs none. Every stacked class has its twin written in the row. Where `028`'s test 8 first rule asks for a twin on a bare fill, it is `forced-colors:<variant>:bg-[Canvas]`.

| Item | File | Today | Becomes |
|---|---|---|---|
| `accordion` | `accordion-trigger.svelte` | `disabled:opacity-50` | `disabled:text-disabled-foreground` |
| `button` | `button.svelte` | `disabled:opacity-50 aria-disabled:opacity-50` in `base` | `base`: `disabled:text-disabled-foreground aria-disabled:text-disabled-foreground`. `default` and `destructive`: `disabled:bg-disabled disabled:border-disabled-edge` and their `aria-disabled:` twins. `secondary`: `disabled:border-disabled-edge` and its twin. `ghost`, `link`: text only. So every disabled button with an edge shares one edge (decision 9) |
| `checkbox` | `checkbox.svelte` | `disabled:opacity-50 group-has-disabled/field:opacity-50` | under each of `disabled:` and `group-has-disabled/field:`: `border-disabled-edge`; stacked on `data-checked:` and `data-[state=indeterminate]:`, `bg-disabled border-disabled-edge text-disabled-foreground` (the check and minus are `currentColor`). **Twins**, on each of the four stacks: `forced-colors:<stack>:bg-[GrayText] forced-colors:<stack>:border-[GrayText] forced-colors:<stack>:text-[Canvas]`, for example `forced-colors:disabled:data-checked:bg-[GrayText]` |
| `dropdown-menu` | `-item`, `-checkbox-item`, `-radio-item` | `data-disabled:opacity-50` | `data-disabled:text-disabled-foreground` |
| `dropdown-menu` | `-content`, `-sub-content` | — | `data-layer="surface"` |
| `field` | `field-label.svelte`, `field-title.svelte` | `group-data-[disabled=true]/field:opacity-50` | `group-data-[disabled=true]/field:text-disabled-foreground` (`028`'s twin on the same variant wins) |
| `input` | `input.svelte` | `disabled:opacity-50` | `disabled:bg-disabled disabled:border-disabled-edge disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground` |
| `textarea` | `textarea.svelte` | `disabled:opacity-50` | as `input` |
| `input-group` | `input-group-addon.svelte` | `group-data-[disabled=true]/input-group:opacity-50` | `group-data-[disabled=true]/input-group:text-disabled-foreground` |
| `input-otp` | `input-otp.svelte`, `input-otp-slot.svelte` | `has-disabled:opacity-50` on the root | the root loses it and names its group, `group/input-otp`; each slot: `group-has-disabled/input-otp:bg-disabled`, `…:border-disabled-edge`, `…:text-disabled-foreground`. **Twins:** `forced-colors:group-has-disabled/input-otp:bg-[Canvas]`, `…:border-[GrayText]`, `…:text-[GrayText]` |
| `label` | `label.svelte` | `group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50` | `group-data-[disabled=true]:text-disabled-foreground peer-disabled:text-disabled-foreground` |
| `native-select` | `native-select.svelte` | `has-[select:disabled]:opacity-50` on the wrapper | the wrapper loses it; the `select`: `disabled:bg-disabled disabled:border-disabled-edge disabled:text-disabled-foreground`; the chevron: `group-has-[select:disabled]/native-select:text-disabled-foreground`, **twin** `forced-colors:group-has-[select:disabled]/native-select:text-[GrayText]` |
| `radio-group` | `radio-group-item.svelte` | `disabled:opacity-50` | `disabled:border-disabled-edge`; the dot: `group-disabled/radio-group-item:bg-disabled-foreground`. **Twin:** `forced-colors:group-disabled/radio-group-item:bg-[GrayText]` |
| `sidebar` | `sidebar-menu-button.svelte`, `sidebar-menu-sub-button.svelte` | `disabled:opacity-50 aria-disabled:opacity-50` | `disabled:text-disabled-foreground aria-disabled:text-disabled-foreground` |
| `switch` | `switch.svelte` | `data-disabled:opacity-50` | the track: `data-disabled:data-unchecked:bg-disabled-edge`, `data-disabled:data-checked:bg-disabled-foreground`; the thumb stays `card` in both, so the state still reads by tone and by place. **Twins:** the track, `forced-colors:data-disabled:data-unchecked:bg-[Canvas]` and `forced-colors:data-disabled:data-checked:bg-[GrayText]`; the thumb, `forced-colors:data-disabled:data-checked:bg-[Canvas]`, and otherwise `028`'s `GrayText` |
| `tabs` | `tabs-trigger.svelte` | `disabled:opacity-50` | `disabled:text-disabled-foreground` |
| `toggle` | `toggle.svelte` | `disabled:opacity-50` | `disabled:text-disabled-foreground`; `outline`: `disabled:border-disabled-edge`; pressed, `disabled:data-[state=on]:bg-disabled-foreground disabled:data-[state=on]:text-background`. **Twins:** `forced-colors:disabled:data-[state=on]:bg-[GrayText] forced-colors:disabled:data-[state=on]:text-[Canvas]` |
| `toggle-group` | — | inherits `toggle` | inherits |
| `dialog`, `sheet`, `alert-dialog` | `*-overlay.svelte` | `bg-scrim` | adds `data-layer="scrim"` |
| `dialog`, `sheet`, `alert-dialog` | `*-content.svelte` | `shadow-elevation` | adds `data-layer="surface"` |
| `popover`, `tooltip` | `*-content.svelte` | — | adds `data-layer="surface"` |
| `chart` | `chart-tooltip.svelte` | `shadow-elevation` | adds `data-layer="surface"` |
| `chart` | `chart-container.svelte` | LayerChart's highlight area (5%), line (20%), shadow (20%) and brush (10%) rules are not overridden | its class list sets each one's `--fill-color` or `--stroke-color` to a solid role: the area, shadow and brush `muted`, the line `border`. After `029a`, in the same class list |
| `toast` | its root (`026`) | `shadow-elevation` | adds `data-layer="surface"` |
| `card` | `card.svelte` | inherits every role from its ground | adds `surface-plain` (decision 11) |
| `alert`, `error-summary` | — | `029`'s solid tints | nothing; checked |
| `search-field`, `button-group` (`027`) | — | inherit `input`, the addon, `button` | inherit |

- Every `forced-colors:<variant>:opacity-100` that `028` added beside a removed `opacity-50` is removed with it (decision 10). The `GrayText` twins stay.
- `028`'s test 8 first rule runs over every row. A stacked class without its twin fails it before any browser runs.
- An icon inside a disabled control with a colour class of its own (such as `[&_svg]:text-muted-foreground`) takes `disabled-foreground` under the same variant. The builder lists each one found in the landing notes.

### Per-site-surface fixes

| Surface | Today | Becomes |
|---|---|---|
| every page: the frame, the footer, prev and next, the API table, inline `code`, code blocks, rails, grooves (41 elements, 102 pages) | the 10% hairline | solid, by decision 7. No edit |
| the band's glass (`/start/`, `/foundations/`, `/components/`): a code block and inline `code` inside it | the 10% hairline inside a layer | solid, by decision 7. No edit |
| `/foundations/tokens/`, `/foundations/colour/`, `kuiper-theme`'s contrast example: the `border` swatch | a 10% fill | solid, by decision 7. No edit |
| `kuiper-theme`'s elevation example | `bg-scrim` and `shadow-elevation` on plain specimens, in flow | each redrawn as a real layer, absolutely positioned over a small sample of content, with its `data-layer` (decision 13) |
| `031a`'s thumbnail capture rule | the stage repainted `sunken`; dividers on it vanish with the solid line | it also takes `surface-sunken`'s declarations: the three lines to `sunken-line`, and `--background` to `sunken` (decision 11) |
| the site bar, the bands, `/brand/colour/`, the glass examples over a field | glass | unchanged (Q3, option 1) |
| `kuiper-theme`'s glass example and `/brand/surfaces/`'s glass specimen | glass on plain paper | moved onto a field (Q3's addition, decision 12) |
| the search palette | `dialog` | inherits `dialog` |
| the site's Tailwind sources | `context/` and `tests/` read | fixed by `020a` before this lands (decision 14) |
| `bar-glass.spec.ts` | its own `translucent()` | imports `depth.ts`'s (decision 18) |
| the Components index tile | the 10% hairline | `031a`'s, transparent |

### Files

- **Lane T:** `tokens/kuiper.tokens.json` (`line`, `paper-line`, six primitives), `kuiper.light.tokens.json` and `kuiper.dark.tokens.json` (four roles), `kuiper.contrast.json` (the line rows), `scripts/build-tokens.ts` (the field utilities, `SURFACE_ROLES`, `surface-sunken`'s declarations), and what `build:tokens` writes: `src/app.css`, `kuiper.css`, `registry.json`, `static/r/`.
- **Lane I:** the 25 class strings above, the 12 layer roots, `chart-container.svelte`, and `card.svelte` (with any item the builder adds).
- **Lane S:** the elevation example, `kuiper-theme`'s glass example, `/brand/surfaces/`, `scripts/site/thumbnails.ts` (`031a`'s capture rule), `tests/e2e/bar-glass.spec.ts`.
- **Lint and tests:** `scripts/lint-literals.ts` (D1 to D5, and L22's list); `tests/unit/literals.test.ts`, `tokens-dtcg.test.ts`, `depth-css.test.ts` (new), `contrast.test.ts`, `registry.test.ts`, `028`'s `forced-twins.test.ts` and its forced case data; `tests/e2e/depth.ts` and `depth.spec.ts` (new), `build-output.spec.ts`.
- **Ledgers:** `CHANGELOG.md`, the upgrade guide, every thumbnail.

## Scope

**In:** decisions 1 to 22; the per-item and per-site fixes; the lint rules; the CSS, role and runtime tests.

**Out:**

- The glass tokens' values. They are a layer's paint, and `019a` measured them.
- Overlays made translucent. Allowed, not wanted (decision 3).
- High-contrast values (`031`). This specification owes none; decision 11 states what its roles do under `more`.
- The forced-colours rules themselves (`028`), beyond removing the `opacity-100` twins.
- A depth line in the accessibility status (`030`). Depth is a design rule, not a WCAG check. The tests declare `item`, so `030` can add one later.
- Motion. Decision 5 reads the rule at rest; how things move is `039`'s.

## Tests written first

Each is written and seen failing before the code it checks. The landing notes say how each failed.

1. **`tests/unit/tokens-dtcg.test.ts`: "no role is translucent but the scrim".** In both scheme files, every role resolves to alpha 1 or 0, except `scrim`. *Fails today:* `border`, `sidebar-border` and `groove-line`, in both schemes (six).
2. **`tests/unit/tokens-dtcg.test.ts`: "the hairline, stage-line and disabled primitives are composites".** `line`, `paper-line`, `paper-sunken-line`, `ink-sunken-line`, `ink-half`, `paper-half`, `line-input-half` and `paper-line-input-half` each carry the composite record, and each equals `compositeTenths(of, over, alpha)`: `#DCDAD3`, `#37342E`, `#C7C3B8`, `#22211E`, `#7F8080`, `#8B8881`, `#BCB7AC`, `#4E4940`. `sunken-line` aliases the sunken pair in both scheme files, with its `$description`. `surface-sunken` sets `--background`, `--border`, `--groove-line` and `--sidebar-border` as decision 11 says, and `bg-sunken` sets none of them. The roles `disabled`, `disabled-foreground`, `disabled-edge` and `sunken-line` exist in both scheme files, with a `$description`. *Fails today:* `line` is `#0B0F171A`; the rest do not exist.
3. **`tests/unit/contrast.test.ts`: "the floors".** In both schemes, and in the standard and both `-more` contexts once `031` has landed:
   - the line rows read at least 1.1:1 at standard: `border` on `background`, `card` and `muted`; `sunken-line` on `sunken`; and a divider inside a `surface-plain` card inside a `surface-sunken` well, against the card (the roles resolved as the cascade gives them);
   - `disabled-foreground` at least 3:1 on `disabled`, `card`, `background` and `muted`;
   - `background` at least 3:1 on `disabled-foreground` (the pressed, disabled toggle's label);
   - `disabled-edge` at least 1.5:1 on `background`, `card`, `muted` and `disabled`;
   - `[disabled-foreground, sunken]` and `[disabled-edge, sunken]` are in `031a`'s `restricted` block, in both schemes.

   The disabled pairs are not text or non-text rows of `kuiper.contrast.json`. *Fails today:* `border` cannot be read solid; the rest do not exist. The card-in-a-well row is proven by mutation: with `surface-plain` removed from the card, it reads 1.02 in dark and fails.
4. **`tests/unit/depth-css.test.ts`: "the theme is translucent only in its layers"** (decision 16). *Fails today:* the four field utilities, and the hairline's declarations.
5. **`tests/unit/literals.test.ts`: "D1 to D5".** Fixtures:
   - D1: `bg-foreground/50`, `border-(--x)/20`, `text-sky-300/15`, `bg-foreground/[.5]` and `bg-foreground/(--a)` in an item fail; `bg-accent/0`, `bg-accent/100`, `text-sm/6` and `text-[13px]/5` pass; in a site file, `bg-foreground/50` and `hover:border-border/50` fail.
   - D2: `disabled:opacity-50`, `opacity-[.4]`, `[opacity:0.5]`, `scroll-fade-y` and `mask-b-from-50%` fail, in an item and in a site file; `opacity-0`, `md:opacity-100`, `transition-opacity` and `transition-[margin,opacity]` pass.
   - D3: `backdrop-blur-sm` in a site file fails.
   - D4: `bg-scrim` in a file without `data-layer="scrim"` fails, and with it passes; `shadow-elevation` likewise with `surface`; `data-layer="glass"` fails.
   - D5: `shadow-md` and `drop-shadow-sm` in a site file fail; `shadow-elevation` beside `data-layer="surface"` passes.
   - L22: `surface-plain` in a productive item passes; `glass` and `field-1` still fail.

   *Fails today:* none of D1's site and modifier cases, D2, D3's site case, D4 or D5 exists. `text-sm/6` passes today, and must still pass.
6. **The literal lint over the tree.** After `028` and `029` have landed, `bun run lint:literals` with the new rules reports, before the fix: 25 D2 violations in items; D4 violations in the 10 overlay files (11 once `toast` exists) and the elevation example; nothing else. The builder pins the exact count at step 1.
7. **`tests/e2e/depth.spec.ts`, g, the probes** (decision 17). *Fails today:* `depth.ts` does not exist. Once it does, each probe is seen found, and the layer probe seen allowed.
8. **`depth.spec.ts`, a, "every page at rest".** *Fails today* on all 102 pages, in both schemes: the footer's groove and inline `code` at least.
9. **`depth.spec.ts`, b, "<item>: its examples, driven".** *Fails today* for the 28 hairline attributions, the 14 disabled readings and `alert` (*the audit* §2.1). If `029` has landed, `alert` and `error-summary` pass, and that is recorded.
10. **`depth.spec.ts`, c, the charts.** *Fails today:* the axis and grid lines (the hairline). Whether the highlight draws translucent is recorded; the audit saw none (*the audit* §2.4).
11. **`depth.spec.ts`, d, "every layer declares itself, and every declared root is a layer".** *Fails today:* no root carries `data-layer`. The out-of-flow half is proven by mutation: an in-flow `div` given `data-layer="scrim"` on a scratch page fails it; so does a `relative` root inside a page-level transparent `absolute inset-0` box; so does the elevation example before its redraw.
12. **`depth.spec.ts`, e, placeholders.** Passes today. Proven by mutation: with `input`'s `placeholder:text-muted-foreground` removed on a scratch copy, it fails on preflight's 50%.
13. **`depth.spec.ts`, f, "disabled colours hold".** *Fails today:* no role exists.
14. **`tests/e2e/build-output.spec.ts`: "the built CSS is translucent only in its layers".** *Fails today:* 76 rules; after `020a`, about 31, of which 21 are LayerChart's, 1 preflight's and 1 `.shimmer`. A fixture rule with `oklch(from red l c h / calc(alpha * .5))` and one with a `mask-image` gradient to `transparent` each fail.
15. **`tests/unit/registry.test.ts`: the changelog and the guide** (decisions 19 and 20). *Fails today:* no such text.
16. **`028`'s `tests/unit/forced-twins.test.ts`, second rule, replaced:** "no item holds `opacity-50`, and no `forced-colors:<variant>:opacity-100` remains without an `opacity` to undo". *Fails today:* 25 and 25. **Its first rule is unchanged and runs over the new classes;** it is seen failing on the draft's stacked classes without twins (the toggle's, the checkbox's and the switch's), as the review's probe showed.
17. **`028`'s forced cases, three added:** a disabled, pressed toggle; a disabled, checked checkbox; and an on, disabled switch; for assertions E and G. Under forced colours each has a `GrayText` state fill, read beside the element, and the switch's thumb is `Canvas` against its `GrayText` track. *Fails today:* with the first draft's classes, the toggle's and checkbox's fill is `Canvas` (EXECUTED (review)); without the thumb's twin, the switch's thumb equals its track (EXECUTED (re-check)).

## Acceptance criteria

1. **The tokens.** Tests 1, 2 and 3 pass. `bun run build:tokens`, run twice, changes 0 files the second time. `029`'s validator accepts the eight composites. (unit)
2. **The theme's CSS.** Test 4 passes. (unit)
3. **The lint.** Test 5 passes. Over the tree, the literal lint reports 0 violations, and its allowance count is what `028` and `029` leave it. Site files are linted for D1 to D5. (unit, lint)
4. **No half opacity.** No item file holds `opacity-<n>` with 0 < n < 100. The count is 0, from 25. Test 16 passes. (unit, lint)
5. **The layers declared, and real.** Test 11 passes: 12 roots in 8 items carry `data-layer`, 3 `scrim` and 9 `surface`, and every `[data-layer]` root on every page, the elevation specimens included, is out of flow or in an unpainted out-of-flow wrapper. (e2e)
6. **Every page.** Test 8 passes on every sitemap page, at 1440 and 390, in every project `022` defines. (e2e)
7. **Every item, driven.** Tests 9 and 10 pass for every component page, in the Chromium projects. (e2e)
8. **The probes and placeholders.** Tests 7 and 12 pass, with the mutation recorded. (e2e)
9. **The built CSS.** Test 14 passes. It reports the LayerChart, preflight and `.shimmer` exceptions by count. (e2e, build-output)
10. **Tailwind's sources.** `020a` has landed, as amended: its site stylesheet excludes `context/` and `tests/`, and the built CSS holds no rule for a class found only there. *If `020a` lands narrower* (its file and landing notes do not describe the site stylesheet, or it excludes `context/` alone), this reads "no rule for a class found only in `context/`". Nothing found only in `tests/` is translucent today, so test 14 does not depend on it. (build, review)
11. **Disabled colours.** Test 13 passes for every disabled example, at rest and hovered, in both schemes. (e2e)
12. **Forced colours still hold.** `028`'s tests 4 and 5 pass for the 16 changed items in `chromium-light`, `chromium-dark` and `firefox-light`, with test 17's three cases. `028`'s test 8 passes, both rules. (unit, e2e)
13. **The bar.** `bar-glass.spec.ts` passes, importing `depth.ts`. (e2e)
14. **The changelog and the guide.** Test 15 passes. (unit)
15. **The pictures.** Every thumbnail is regenerated; `thumbnails.test.ts` passes. (unit)
16. **Weight.** The landing notes give the CSS per template, measured, within `024`'s headroom. `025`'s report is refreshed; no item exceeds its budget. (perf, cost run)
17. **The suites.** `bun run test:unit`, `bun run test:e2e`, `bun run test:smoke`, `bun run check`, `bun run lint`, the literal lint and the release check pass. (all)
18. **The checkpoint.** The design lead looks at, in both schemes, at 1440, on the production preview:
    - a card, a table, a code block and the frame, for the solid hairline on white, on the page and on `muted`;
    - inline `code` and a code block in light, whose edge darkens against the page (1.09 to 1.23), and the footer's groove and a page rule in dark, which strengthen (1.29 to 1.48);
    - a code block and inline `code` in dark, whose edge weakens against their fill (1.34 to 1.18);
    - a light thumbnail with dividers (`table`, `separator`, `accordion`) and one with an `avatar-group`, on `sunken`; and a well painted with `surface-sunken` on a page;
    - the two glass specimens on their field;
    - a `card` with a divider and an `avatar-group` inside a `surface-sunken` well, in both schemes;
    - under forced colours, an on, disabled switch;
    - `avatar`'s ring on a photo;
    - every disabled example: a disabled primary, secondary and ghost button side by side with a hovered ghost button, an input with its label, a checkbox checked and not, a radio, a switch on and off, a pressed toggle, a menu's disabled item;
    - an open dialog, menu and tooltip;
    - the redrawn elevation specimens;
    - under forced colours in Chromium: a disabled pressed toggle and a disabled checked checkbox;
    - the glass on a band and on `/brand/colour/`.

    Rulings go into the landing notes. (checkpoint)
19. **The scorecard.** `kuiper.ts --rev` is run; row 4 is held; the run log has a row; the change review cites it. (measure)

## Build order

1. **Confirm the tree.** `020a`, `029`, `028` and, if it has, `029a` landed. **Read `020a`'s file and landing notes:** if they describe the site stylesheet excluding `context/` and `tests/`, criterion 10 reads as written; if not, its fallback applies. `031a` landed, with `sunken`, `surface-sunken`, the two restricted disabled pairs and the `surface-plain` card in its role words. `031` not landed (decision 11). Re-run the audit's probe on a fresh build and compare with *the audit* §2.1. Pin test 6's count.
2. **Tests first.** Write tests 1 to 17. See each fail as stated; prove test 12 and test 11's out-of-flow half by mutation.
3. **Lane T.** The primitives, the roles, the field utilities and `SURFACE_ROLES`, until tests 1 to 4 pass. `build:tokens`. **Finish the disabled primitives here, and do not regenerate any picture, until the owner's morning status has been read** (Landing notes, the ruling on Q2's figures). A raise then costs four values and a test, not a regeneration.
4. **The lint.** D1 to D5 and L22's list, until test 5 passes and the tree reports only test 6's findings.
5. **Lane I.** The per-item table, with its forced twins, until tests 6, 9, 11, 13, 16 and 17 pass, and `028`'s tests still pass.
6. **Lane S.** The elevation example, the capture rule's line declarations and `bar-glass.spec.ts`, until tests 8, 10, 14 and criterion 13 pass. Regenerate one light thumbnail with dividers and look at it before going on.
7. **Checkpoint** (criterion 18).
8. **Firefox and WebKit:** tests 7, 8, 11 and 12 in their projects. A fault seen only there is a small change, ledgered as `022` decision 16 says.
9. **Ledgers,** in landing order: `registry.json`, the changelog, the guide, `static/r/`, thumbnails, `025`'s report.
10. **The change review,** then the landing, then the scorecard (criterion 19).

## Predicted scorecard movement

- **Row 4, theming: held at 3**, as the roadmap predicts. The new roles are a theming gain in kind, but no criterion of row 4 reads disabled roles or hairlines.
- **No other row moves.**
- **The whole-catalogue numbers do not move.** Depth is not one of the page standard's sections or the status's checks.

## Risks

- **The hairline looks different, most where it edges a fill.** In light, inline `code`, code blocks, cards and frames get a darker edge against the page (1.09 to 1.23), on every page. In dark, page rules and the footer's groove get stronger (1.29 to 1.48), and code blocks and inline `code` weaker against their fill (1.34 to 1.18). Unfilled dividers in light barely change. The checkpoint looks at each. If the owner dislikes it, Q1's option 2 restores today's look.
- **A ground the token does not foresee.** The solid line is measured on the scheme's three grounds and the index stage. A later ground (a new private ground, a new field) needs its own redeclaration, as decision 11 does for the stage. Test 3's floor lists the grounds; a new one joins it.
- **The disabled look changes.** A disabled primary button turns from a pale blue to a neutral grey with a grey edge. Primer and Carbon keep a filled button's fill visible, Primer in its own hue (*the audit* §4, corrected). Kuiper's label reads better (3.14:1 from 1.69:1), but the fill reads only 1.10 on paper, so the edge carries the shape. It is a visible change in 16 items. Q2's option 3 keeps the hue, as Primer does.
- **Variant order.** `disabled:` must beat `hover:` and the state variants it stacks with. Tailwind orders variants, not authors. Test 13 reads the colours while hovered, so a loss shows.
- **LayerChart.** Its own rules carry alpha, and an update may add more. Test 14 counts them; test 10 proves the drawn ones solid.
- **The walk's cost.** Test 9 drives every control on every page. In Chromium it took seven minutes with five workers in the audit. It runs in the Chromium projects only.
- **The forced-colours twins.** This adds stacked classes that outrank `028`'s twins unless each has its own (decision 10). `028`'s test 8 first rule and test 17's cases are the guard, and lane I runs them in order.

## Open questions for the owner

All three are answered, each with the recommended option. The questions are kept as they were asked.

**Q1. The hairline: is the 10% `border` line transparency without depth?** (decision 7) *Answered 2026-11-15: option 1 (Landing notes).*

The owner's ruling has already been applied to hairlines once. The two `border-border` hairlines inside the bar broke it, and both were fixed (`019a` decision 3).

1. **Yes: make it solid.** `line` and `paper-line` become the same line composited over the middle ground (`#DCDAD3` light, `#37342E` dark). One token change fixes 106 findings on every page, with no edit in any item or page. The index stage redeclares its own line, so no thumbnail loses its dividers. What changes: in light, the edge of inline `code`, code blocks, cards and frames darkens against the page (1.09 to 1.23); in dark, page rules strengthen (1.29 to 1.48). *Recommended:* it is what the owner's rule says, and it extends `019a`'s ruling to every hairline.
2. **No: a line is not a fill.** The 10% hairline stays as a sanctioned exception. The rule then reads "no translucent fill", and lines that take their ground's colour are allowed. This reverses `019a`'s fix in the bar.
3. **Yes, and use the control edge.** Every hairline takes `border-input`. It is solid and already exists, but it is 3:1 and more, so every quiet rule becomes a control's edge.

**Q2. Disabled by half opacity: is it "container opacity" under the rule?** (decision 9) *Answered 2026-11-15: option 1 (Landing notes).*

1. **Yes: three neutral solid roles.** `disabled`, `disabled-foreground` and `disabled-edge`, like Primer's `fgColor`, `bgColor` and `borderColor.disabled`. A disabled ghost control looks as it does now. A disabled filled control turns grey with a grey edge; its label reads 3.14:1, from 1.69:1. *Recommended:* it keeps the rule without an exception, with the fewest new colours, and the edge keeps every disabled button's shape.
2. **No: disabled is a state, not depth.** `opacity-50` stays, as the rule's one counted exception. The lint and the runtime test allow exactly `<disabled variant>:opacity-50`. Nothing in the 16 items changes.
3. **Yes, and keep the hue: Primer's pattern.** Each coloured role gets a disabled twin (`primary-disabled`, `destructive-disabled`, …), the role composited at 0.5 over the middle ground (light `primary-disabled` `#909CDE`). Primer does this for its primary button: `#95D8A6`, a pale green (`button.json5:572–576`). Every disabled control keeps today's look, solid, with a solid `disabled-foreground` label in place of Primer's translucent white. It costs a role per colour, now and in `031`.

**Q3. Glass that rests on a still field, or on the page's own ground: is it a layer?** (decision 12) *Answered 2026-11-15: option 1, with the addition (Landing notes).*

The owner's sentence ties translucency to being above: "above everything else … so it is transparent to what is below it". "Stays in a fixed position" can be read as why the bar is above everything, or as a second condition.

1. **Yes: glass is always a layer.** A band's field is full bleed under its panel and is not the panel's content, so the panel is above it. The panel is drawn raised, with rim, shadow and isolation (`011` decision 8). Nothing changes. *Recommended:* the panel is above the field whether or not the field moves.
2. **Only where content moves beneath it.** The site bar and `marketing-bar` keep their glass. The bands, `/brand/colour/`, the specimens and `stage-hero` take the solid `--glass-fallback`, which already exists for reduced transparency. **`stage-hero` is an installed item, so repainting its panel is an interface change,** with a changelog bullet and an upgrade step.

**And, with option 1, if the owner wishes:** the two specimens that rest on plain paper (`kuiper-theme`'s glass example and `/brand/surfaces/`) move onto a field, so their glass shows what it is for. This is a presentation choice. It changes no rule.

## Review response

The specification review, [`../reviews/031b-transparency-signifies-depth-spec-2026-11-15.md`](../reviews/031b-transparency-signifies-depth-spec-2026-11-15.md) (approve with changes; findings 1 to 6 must be fixed before it lands). Each finding, and what was done:

1. **High, the forced-colours cascade: accepted.** Decision 10's claim was wrong for the stacked classes. Decision 10 now says which classes `028`'s twins cover (bare variants) and which they do not (stacked, (0,3,0)). Every stacked class has its forced twin on the same stack, from `028`'s system colours, written into the per-item table: `checkbox` (four stacks), `radio-group`'s dot, `switch`'s track, `toggle`'s pressed state, `input-otp`'s slots and `native-select`'s chevron. Test 16 replaces only `028` test 8's second rule; the first still runs over the new classes. Test 17 adds a disabled pressed toggle and a disabled checked checkbox to `028`'s cases for E and G. The `HighlightText` note is passed to `028`'s builder in decision 10.
2. **High, the hairline on `031a`'s stage: accepted.** *Since superseded in form by the owner's answers to `031a` (below).* At the time, `sunken` was a private `--site-sunken`, painted on `frame-stage` only while the pictures were taken. Of the review's two ways, this redeclares the line where the stage is painted: two primitives, `paper-sunken-line` `#C7C3B8` and `ink-sunken-line` `#22211E` (each 1.22 on the stage, as today), write `--site-sunken-line`, and `031a`'s capture rule sets `--border`, `--groove-line` and `--sidebar-border` to it (decision 11). A darker `line` was rejected: clearing 1.1 on `#DCD7CA` would darken every hairline on every other ground. Test 3's floor covers the stage. Whichever of `031a` and this lands second writes the lines; `031a`'s record needs the same sentence, which is `031a`'s author's to add.
3. **Medium, the hairline over its own fill: accepted.** Decision 7's "why" now gives the by-context table from `lines.py` and `filled.mjs`. The "within 0.17" is gone (dark page rules move +0.19). Decision 4 says a filled element's translucent border counts by design, since the rule reads computed colour. The risk names the two largest changes. Criterion 18 adds inline `code` and a code block in light and dark, the footer's groove in dark, and a light thumbnail with dividers.
4. **Medium, Q2's references and the disabled filled control: accepted.** Decision 9's "why" and the memo (Corrections) now read Primer's hued disabled primary (`#95D8A6`, a white label at 0.8 alpha) and Carbon's `button-disabled` in `white/button.tokens.json:83`, gray 30 in white and gray 50 at 0.3 in g100. The filled variants take `disabled:border-disabled-edge`, so every disabled button shares one edge and is told from a hovered ghost button (`accent`, no edge). Q2 option 3 is offered with Primer as its precedent. SC 1.4.11 is cited beside SC 1.4.3.
5. **Medium, the disabled pairs under `031`: accepted.** Decision 11 states the order in lane T (`031a`, this, `031`; `031` decision 20 agrees), keeps the disabled pairs out of the contrast file's text and non-text rows (exempt, SC 1.4.3 and 1.4.11), and names their own targets under `more`: 4.5:1 for `disabled-foreground`, 3:1 for `disabled-edge`. It proposes the values (`#646565` and `#9F9C95`; the edge takes `line-input` and `paper-line-input`) and the hairline's (`031`'s `line-more` and `paper-line-more`). `031` carries them; if `031` lands first, this owes them. Test 3 holds them. *Since aligned with `031` (below):* the disabled roles keep their standard values under `more`, with one set of targets in every context.
6. **Medium, `data-layer` licenses anything: accepted.** Decision 2 makes the definition testable: every `[data-layer]` root is out of flow, or in an unpainted out-of-flow wrapper (bits-ui's wrapper and `dialog-positioner` qualify). Test 11 checks it, with a mutation. The two elevation specimens are redrawn as real layers, absolutely positioned over a sample of content (decision 13), so "No new allowance" stands.
7. **Low, `020a`: accepted in part.** The coordinator confirms `020a` is being built, as amended, to exclude both `context/` and `tests/` through a site-only stylesheet that imports the generated `app.css`; the `020a` on disk is stale. Decision 14 and criterion 10 cite it "as amended for its build, 2026-11-15". The `bg-popover/70` claim is corrected: it is in `context/` only, and no translucent class is found only in `tests/` (decision 14; the memo's Corrections).
8. **Low, the CSS check's exceptions: accepted.** Decision 4 adds `mask-image` stops and relative colour syntax (any alpha not the literal 1). Decision 16 counts `.shimmer` as a third exception, gone if `020a` or a later change excludes it. D2 adds `scroll-fade*` and Tailwind's `mask-*` utilities. Test 14 gains two fixtures.
9. **Low, shadows: accepted.** Decision 6's "why" now says a shadow is translucent paint, so the rule already places it (INFERRED); the owner said nothing of shadows. D5 extends L5 to site files.
10. **Low, the runtime reader: accepted.** Decision 4 adds `text-decoration-color`, `caret-color`, `column-rule-color`, `accent-color`, `::selection` and `::marker`. Decision 5 says infinite animations are skipped (only `spinner`'s, no alpha). Decisions 6 and 17 say `allowed()` matches `shadow-elevation` against a probe read beside the root.
11. **Low, D1's colour test: accepted.** D1 flags a modifier only when the value is a colour, by L1's test, widened. Fixtures: `text-sm/6` and `text-[13px]/5` pass; `bg-foreground/[.5]` and `bg-foreground/(--a)` fail; `transition-opacity` and `transition-[margin,opacity]` pass D2.
12. **Low, grounds the token cannot serve: accepted.** Decision 8: each field utility also sets `--groove-line` and `--sidebar-border`. Decision 12 and the upgrade guide: inside glass over a field, draw a rule on a filled element.
13. **Low, Q1's precedent and names: accepted.** Q1 cites `019a` decision 3 and says option 2 reverses it. Decision 13 and decision 12 say `kuiper-theme`. The header now says the tree reads `kuiper` since `44cec73`, and why the pre-rename build still holds. The memo's stale token path is corrected in its Corrections.

### After the owner's answers and `031a`'s revision, 2026-11-15

- **`031a`'s `sunken` is now public** (the owner, `031a` Q2), with restricted pairs, painted through `surface-sunken`. The lane T order is `031a`, then this, then `031`. So the private `--site-sunken-line` and the generated site stylesheet are gone. In their place: the public role `sunken-line`, aliasing `paper-sunken-line` `#C7C3B8` and `ink-sunken-line` `#22211E`, in the token files, `cssVars`, `kuiper-theme`, `kuiper.css` and the contrast file as a decorative non-text row (decision 11). `surface-sunken` redeclares the three line variables, and `bg-sunken` does not (`029`'s T7). The capture rule takes the same declarations. Test 3 reads `sunken-line` on `sunken`. This specification writes the lines, being second.
- **`--background` in a well: adopted** (`031a`'s Knock-ons, item 5). `surface-sunken` also sets `--background: var(--sunken)`, which closes `avatar-group`'s paper ring. Not an owner question: `surface-sunken` is unreleased.
- **The disabled roles under high contrast: aligned with `031` decision 6.** They keep their standard values, with no `-more` value. Their targets are this specification's, the same in every context: `disabled-foreground` 3:1, and a new `disabled-edge` floor of 1.5:1. The previous draft's 4.5:1 and 3:1 under `more`, and its proposed `-more` disabled values, are withdrawn (decision 11).
- **The header** now counts four public roles, and the changelog has a `sunken-line` bullet.

**Q3, recast as the review suggests.** Option 1 stays recommended. Option 2 names `stage-hero`'s repaint as an interface change. The old option 3, the specimens on a field, is now an addition compatible with option 1, not an alternative.

## Re-check response

The review's re-check, 2026-11-15 (revise; R1 to R3 must be fixed). The owner has delegated decisions overnight, so none is raised as a question.

- **R1 (High), the well's redeclarations leak into cards: fixed as written.** `SURFACE_ROLES` gains `background`, `groove-line` and `sidebar-border`, so `surface-plain` restores them. `card` takes `surface-plain`; the builder names any other item. `surface-plain` leaves L22's expressive list, since `card` is productive and the utility paints nothing. The upgrade guide says to set controls on a `surface-plain` card in a well; `031a`'s role words change the same way, in `031a`'s record. Test 3 and the runtime test read a divider in a `surface-plain` card inside a well, at 1.1:1 or more against the card, with a mutation (decision 11).
- **R2 (High), the on, disabled switch's thumb: fixed as written.** The thumb's twin `forced-colors:data-disabled:data-checked:bg-[Canvas]` is in the table. Decision 10 states the general rule: a mark on a state fill takes `Canvas` when the fill takes `GrayText`. Test 17 adds an on, disabled switch, with G reading the thumb against the track.
- **R3 (Medium), the floors' grounds: fixed as written.** Test 3 reads `disabled-foreground` on `muted` too, `disabled-edge` on `muted` and `disabled` too, and `[background, disabled-foreground]` for the toggle's label. `[disabled-foreground, sunken]` (2.76) and `[disabled-edge, sunken]` (1.39) join `031a`'s `restricted` block. `031a`'s record lists them; this specification writes them into the contrast file when its roles land (decision 11); test 3 reads that they are there. The toggle's label inside a well is handled by R1: on a `surface-plain` card it is back on `background` (3.48). The 1.5:1 floor is anchored: below today's 1.75 and Carbon's 1.71, above the hairline's 1.1; Primer's 3.45 is noted, so it is a choice.
- **R4 (Low), the cost of a raise: added** to the ruling on Q2's figures. The build order finishes lane T's disabled primitives and defers every picture until the morning status is read.
- **R5 (Low), the `bg-sunken` reason: restated as written** (decision 11).
- **R6 (Low), `020a`: kept** "as amended for its build". Build-order step 1 reads `020a`'s file and landing notes, and criterion 10 falls back to `context/` only if `020a` lands narrower.
- **R7 (Low), stale text: fixed.** Decision 9's `disabled` clause, decision 12's "owner chooses", test 5's and step 4's "D1 to D5", and review-response item 5's order.
- **R8 (Low), the wrapper's wording: fixed.** Decision 2 and test 11 read "its nearest positioned ancestor other than itself", which must be the item's own wrapper, named in the case data. The mutation covers a `relative` root in a page-level `absolute inset-0` box.

## Landing notes

Not built.

### Owner answers, 2026-11-15

The owner chose from options put by the design lead. Each option label is quoted, with the option's description as it was shown.

- **Q1:** "Solid (Recommended)". The description: "#DCDAD3 light, #37342E dark, looking the same as today on the page. Sunken regions get their own `sunken-line`. 019a already did this for two hairlines in the bar." Applied in decisions 7 and 11.
- **Q2:** "Yes: neutral solid roles (Recommended)". The description: "Three solid disabled roles (fill, text at 4.5:1, edge at 3:1); filled buttons get the disabled edge so they never look like a bare hover wash." Applied in decision 9 and the per-item table.
- **Q3:** "Yes, always (Recommended)". The description: "Glass is always a layer; nothing changes. Also move the two plain-ground glass specimens on the site onto a field, so the glass has something to show." Applied in decision 12 and the per-site table.

**A design lead's ruling on Q2's figures, 2026-11-15, under the owner's overnight delegation** ("work autonomously and do not ask questions. Use sound judgment and precedence to move forward"). Q2's description, written by the design lead, said "text at 4.5:1, edge at 3:1". Those figures came from the spec review's suggestion for the high-contrast targets. They are not the spec's standard targets, which are `disabled-foreground` at 3:1 or more and `disabled-edge` at 1.5:1 or more. The ruling keeps the spec's targets, for these reasons:

- WCAG 1.4.3 and 1.4.11 exempt inactive controls.
- Primer's disabled text measures 3.07, and its 3:1 floor is the precedent. Carbon's measures 1.73.
- At 4.5:1, disabled text would match `muted-foreground` (5.14 on `sunken`), so a disabled control would no longer read as quieter than an enabled one.

The owner is told of this in the morning status, and may raise the targets with a one-line answer. **What a raise would cost:** at 4.5:1 text and 3:1 edge, `ink-half`, `paper-half`, `line-input-half` and `paper-line-input-half` stop being 0.5 composites, test 2's figures change, decision 9's "a disabled ghost button looks as it does now" goes, and every disabled picture changes. So the build finishes lane T's disabled primitives, and regenerates no picture, until the morning status has been read (build order, step 3). A raise then costs four values and a test.
