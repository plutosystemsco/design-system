# Forced colours: how the mode works, what the references do, and what breaks in Kuiper

- **Status:** research memo. Commits us to nothing. Written for [`028`](../specifications/028-forced-colours.md).
- **Date:** 2026-11-15
- **Author:** the spec author for `028`, for the design lead
- **Question:** Under forced colours, which of Kuiper's interactive items lose their focus indicator, their state or their edges, and what rule set and per-item check would close the gap in every engine the matrix runs?
- **What would answer it:** what the engines do under the mode, measured in the pinned Playwright; what the references write; and an audit of every interactive item's page under emulated forced colours.
- **What it blocks:** `028`. `030` reads `028`'s check. `031` (high contrast) is a different mode and does not wait on this memo.

Claims are labelled **EXECUTED** (run and seen, 2026-11-15, Playwright 1.64.1 with its own Chromium 1248, Firefox 1555 and WebKit 2370, on macOS), **READ** (a source, named, read 2026-11-15) or **INFERRED** (our reasoning). The probes and the audit ran from the session scratchpad against the main tree's `build/` (built 2026-11-15 16:10, the working tree after `019a`), served on port 4391. Names in this memo are today's (`pluto`); `028` is written against `020`'s.

## Terms

- **Forced colours.** An operating-system or browser mode in which the browser replaces the page's colours with a short palette the user chose. Windows calls it a **contrast theme**. CSS exposes it as `@media (forced-colors: active)`.
- **System colour.** A CSS colour keyword whose value is the user's palette: `Canvas`, `CanvasText`, `Highlight` and so on.
- **`forced-color-adjust`.** A property that opts an element out of the forcing (`none`), keeps it (`auto`), or inherits the parent's forced text colour (`preserve-parent-color`).
- **Ground.** The colour behind an element: its own background or its nearest painted ancestor's.

## 1. What the mode does

### 1.1 Where it comes from

- **Windows contrast themes** turn it on in Chromium, Edge and Firefox. Windows 11 ships four themes, Aquatic, Desert, Dusk and Night sky, and lets the user edit each colour. Left Alt + Left Shift + Print Screen toggles it (READ, [Microsoft Learn, "Contrast themes"](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/high-contrast-themes), updated 2026-08-29).
- **Microsoft's own rules for the mode:** pages and popups on `Window`; text on `WindowText`; selected, hovered, pressed or in-progress UI on `Highlight` with `HighlightText`; disabled UI in `GrayText`, and `GrayText` for nothing else; "2px borders for transitory surfaces such as flyouts and dialogs"; never hard-code a colour (READ, same page).
- **macOS has no forced-colours mode.** "Increase contrast" is a different signal, `prefers-contrast: more`; it repaints nothing (READ, [MDN, `prefers-contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast); the page itself says the OS mapping is "general knowledge", so this is READ for the media feature and INFERRED for the mapping). So Safari users never see forced colours, and the owner's macOS settings cannot reproduce it (INFERRED).
- **Firefox can force colours on any platform** through its own "override the colours of the page" setting (INFERRED from prior knowledge; not checked in this session).
- `prefers-contrast: custom` matches the palette a forced-colours user chose (READ, MDN `prefers-contrast`). Playwright's emulated forced colours leave `prefers-contrast` at `no-preference` in all three engines (EXECUTED).

### 1.2 What is forced, measured

A probe page set author colours on plain elements, then read computed styles under `forcedColors: "active"`, in light and dark (EXECUTED):

| Property | Chromium | Firefox | WebKit |
|---|---|---|---|
| `@media (forced-colors: active)` matches | yes | yes | **yes** |
| `color`, `background-color`, `border-color` | forced to the palette | forced | **not forced** |
| A background's alpha | kept: `rgba(200,0,0,.3)` → `rgba(255,255,255,.3)` | kept | not forced |
| A transparent border or outline | **painted** in `CanvasText` | painted | stays transparent |
| A 10% hairline border | painted at full `CanvasText` | painted | unchanged |
| `box-shadow`, `text-shadow` | `none` | `none` | kept |
| A gradient `background-image` | `none` | `none` | kept |
| A `url()` background image | kept | kept | kept |
| `opacity` | **kept** (0.5 stays 0.5) | kept | kept |
| A focused element's outline colour | `Highlight` | `CanvasText` | the author's |
| An author system colour (`background: Highlight`) | **kept** | kept | resolved, not forced |
| A disabled `<button>`'s text | `GrayText` | `GrayText` | the author's |
| An inline SVG path's explicit `fill`/`stroke` | **kept** | kept | kept |
| SVG `fill="currentColor"` inside forced text | follows the forced text colour | follows | the author's |
| A colour class on the `<svg>` itself (`color` set on it) | **kept**: the `<svg>` computes `forced-color-adjust: preserve-parent-color` | forced | the author's |
| A `<progress>` with `appearance: none` and pseudo-element fills | track and fill both `Canvas`: **the bar vanishes** | fill drawn in the UA's own colour | unchanged |

Three findings matter most.

1. **WebKit only flips the media query.** Under Playwright's emulation, WebKit matches `forced-colors: active` and applies rules written under it, but forces no colour, drops no shadow and paints no transparent border (EXECUTED). Playwright's docs give no per-engine note for `forcedColors` (READ, [`page.emulateMedia`](https://playwright.dev/docs/api/class-page#page-emulate-media)). Since no Safari platform has the mode (§1.1), WebKit's gap is a test gap, not a user gap (INFERRED). WebKit can still check that Kuiper's own forced-colours rules apply.
2. **MDN's list and the engines disagree on SVG.** MDN lists SVG `fill` and `stroke` as forced (READ, [MDN, `forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)). In both Chromium and Firefox an inline path's explicit fill was kept (EXECUTED). An icon is safe only when it paints with `currentColor` and takes its colour from forced text.
3. **A transparent border is not invisible.** Both engines paint it. So a row that reserves a 2 px transparent border for a "current" mark shows that mark on every row (EXECUTED; see `sidebar`, §4). A border that must stay hidden under forced colours takes the system colour `Canvas`, which the engines keep (EXECUTED: author system colours are kept).

### 1.3 The emulated palettes are not a contrast theme

Playwright's emulation uses each engine's built-in palette, not a Windows theme (EXECUTED):

| Pair, contrast | Chromium light | Chromium dark | Firefox (light and dark alike) |
|---|---|---|---|
| `CanvasText` on `Canvas` | 21:1 | 21:1 | 21:1 |
| `Highlight` on `Canvas` | 11.3:1 (navy at 80% alpha) | 8.7:1 (cyan at 80%) | **2.9:1** |
| `SelectedItem` on `Canvas` | **1.5:1** (pale blue) | 14.1:1 | 2.9:1 |
| `HighlightText` on `Highlight` | 11.3:1 | 8.7:1 | **2.9:1** |
| `GrayText` on `Canvas` | 14.0:1 (a dark red) | 14.0:1 (a green) | 5.2:1 |
| `ButtonFace` on `Canvas` | 1:1 (the same white) | 1:1 | 1.2:1 (grey) |

- Chromium's forced palette follows `colorScheme` (black `Canvas` in dark). Firefox's does not: dark and light give the same light palette (EXECUTED).
- Two consequences (INFERRED):
  - A check must not assert contrast ratios against these palettes. The user's theme owns contrast. A check asserts that something is drawn, in a role, and differs between states.
  - `SelectedItem` as a fill on `Canvas` is invisible in Chromium's light emulation (1.5:1). `Highlight` is visible in both Chromium palettes. Microsoft names `Highlight` for selected and pressed UI (§1.1).

## 2. How the references handle it

Studied in the clones under `context/prior_art/`, never copied.

- **Carbon** (`fa75d78`). A `high-contrast-mode` mixin wraps `@media screen and (-ms-high-contrast: active), (forced-colors: active)` with presets: focus as a `Highlight` outline, a transparent `outline` that the mode paints, and disabled as `GrayText` text and fill (READ, `packages/styles/scss/utilities/_high-contrast-mode.scss`). Used in 33 component style files (EXECUTED, grep). A checked checkbox takes `background-color: SelectedItem` with a `ButtonBorder` edge and a `SelectedItemText` check (READ, `components/checkbox/_checkbox.scss:157–160`, `:354–356`). Tests read compiled CSS for two components' forced-colours border rules; nothing renders under the mode (READ, `components/__tests__/ui-shell-test.js:96–108`).
- **GOV.UK Frontend** (`a11bd33`). Forced-colours rules in 8 components (EXECUTED). Focus is a box-shadow plus a **transparent outline** "which will be set to a visible colour" when colours are forced (READ, `helpers/_focused.scss:20–30`). Checkboxes and radios set that outline to `Highlight` (READ, `checkboxes/_mixin.scss:116`, `radios/_mixin.scss:120`). A tag turns bold, since its colour is gone (READ, `tag/_mixin.scss:81`). No test emulates the mode (EXECUTED, grep for `forcedColors`).
- **Primer** (`primer-design` `87f799f`). Separates its high-contrast *themes* (which it ships), high-contrast *mode* and forced colours (which it does not provide), and says forced colours "should not be overridden to satisfy aesthetic desires", only "lightly adjusted" (READ, `content/guides/accessibility/color-considerations.mdx:113–146`). Primer's component code is not cloned.
- **Spectrum 2** (`b236981`). Menu guidance: "In Windows high contrast mode, menu items should display with default text color. Selected items should have the background and text colors defined for selected text" (READ, `docs/s2-docs/web/rsp/components/menu.md:59–61`). Its foundations promise visual references in the Windows black theme per component (READ, `foundations/inclusivity/inclusive-design.md:68–72`). Component code is not cloned.
- **Radix Themes** (`1faff10`). No `forced-colors` rule (EXECUTED, grep: 0 files).
- **Material Web** (`37aa14b`, beside the brief). 35 stylesheets. A selected switch's track fills with `ButtonText`; an unselected handle is `ButtonText`; disabled takes `GrayText` at full opacity (READ, `switch/internal/_track.scss:108–112`, `_handle.scss:169–172`; the Material memo).

**What we take** (INFERRED): marks and fills set to system colours in the mode only; a drawn edge wherever a shadow was the edge; `GrayText` for disabled at full opacity; `Highlight` for a selected fill. **What we do not take:** GOV.UK's box-shadow focus with a transparent outline (Kuiper's focus is already an outline); Carbon's `-ms-high-contrast` (Legacy Edge is gone). **Where Kuiper can lead:** no reference renders its components under the mode in a test (EXECUTED, above).

## 3. The failure kinds, in general

Each is what the engines do (§1.2), applied to a pattern (INFERRED unless noted):

1. **Focus drawn with `box-shadow`** vanishes. Kuiper draws focus with `outline` in the theme's `:focus-visible` rule, and the literal lint forbids ring, outline and shadow classes in items (READ, `src/app.css` base layer; `scripts/lint-literals.ts` L3–L5). So this kind should not occur, and did not (§4).
2. **State shown only by a fill or a text colour** (pressed, selected, on, current) is lost: every fill becomes `Canvas`, every text `CanvasText`.
3. **A mark drawn as a filled box** (a radio's dot, a switch's thumb, a fake caret, a meter's or progress bar's fill) becomes `Canvas` on `Canvas`.
4. **An edge drawn only by a fill or a shadow** (a switch's track, an overlay on `shadow-elevation`) is lost.
5. **Invalid shown only by a border colour** is lost: every border becomes `CanvasText`.
6. **Disabled by opacity.** The engines keep opacity (EXECUTED), so `GrayText` or `ButtonText` is drawn at half strength. Disabled controls are exempt from WCAG 1.4.3 and 1.4.11, so this is a convention fault, not a failure (READ, WCAG 2.2 SC 1.4.3 "incidental"; Microsoft, §1.1, reserves `GrayText` for it).
7. **Icons as background images or with a colour of their own.** A gradient background image is dropped; an SVG with a colour class on itself keeps that colour in Chromium (EXECUTED).
8. **A transparent placeholder border** shows on every element that reserves it (EXECUTED, §1.2 point 3).

## 4. The audit

### 4.1 Method (EXECUTED)

- **Items.** `registry.json` holds 75 items. **46 are interactive**: they render a focusable or operable element by their own markup or through the items they compose. The other 29 are the theme, three fonts, six libraries and hooks, and 19 display items (`liquid-glass`, `kbd`, `card`, `separator`, `avatar`, `alert`, `badge`, `empty`, `skeleton`, `spinner`, `status`, `label`, `field`, `meter`, `message`, `marker`, `stage`, `proof-band`, `name-strip`).
  - Primitives (31): `button`, `toggle`, `toggle-group`, `tabs`, `collapsible`, `accordion`, `tooltip`, `popover`, `dialog`, `alert-dialog`, `sheet`, `dropdown-menu`, `checkbox`, `radio-group`, `switch`, `input`, `textarea`, `native-select`, `input-otp`, `input-group`, `error-summary`, `breadcrumb`, `table` (a labelled scroll region), `code-block`, `code-editor`, `chart` (its "Show as table" summary), `message-log` (a scroll region), `item` (as a link), `four-dot` (the lockup link), `theme`, `sidebar`.
  - Compositions (7): `composer`, `stage-card`, `stage-hero`, `marketing-bar`, `marketing-footer`, `live-console`, `cta-band`.
  - Blocks (8): `hero`, `sign-in`, `sign-up`, `page-states`, `settings`, `app-shell`, `chat`, `product-home`.
- **Pages.** Each item's page, `/components/<item>/`, inside its example stages (`[data-slot="frame-stage"]`). Compositions and blocks render in iframes, so their `/view/…/` pages were read whole. 92 page loads under forced colours (46 items, light and dark) and 92 with normal colours as the baseline, Chromium at 1280 × 900, reduced motion.
- **What was read, per page, forced and normal:**
  - **Focus:** each focusable element (up to 30 per page), focused with `focusVisible`, photographed before and after; changed pixels counted, and the computed outline and shadow read. 754 forced readings.
  - **State:** each checkbox, switch, unchecked radio, unselected tab and toggle clicked; the control photographed before and after. 138 forced flips.
  - **Static states:** each `aria-current`, `data-active` and `aria-invalid` element compared with a peer of the same slot without the state (border width, style and colour, weight, decoration, background with `Canvas` at any alpha read as "ground", colour, outline, opacity). Disabled elements' effective opacity and colour.
  - **Boundaries:** each control's border (width, style, colour against its ground) and whether a fill drew its edge. 732 forced readings.
  - **Icons:** each SVG's painted fill and stroke against its ground. 304 forced readings.
  - **Overlays:** up to four triggers per page opened; the layer's border read; for a menu, the highlighted item photographed as the highlight moved. 46 forced readings.
- **Pass rules used by the audit:** focus changes at least 40 pixels; a state flip changes at least 20; a peer comparison differs; a control that had an edge keeps a border. The baseline must pass each rule, or the reading is not counted.
- **Checked by eye:** screenshots of `switch`, `radio-group`, `toggle-group`, `tabs`, `button`, `checkbox`, `dropdown-menu`, `dialog`, `popover`, `sheet`, `tooltip`, `sidebar`, `meter`, `input-otp`, and four display items. The tooltip, the sidebar's current row, the meter and the OTP caret were confirmed by a direct probe, because the scripted pass missed them: it opened overlays by click (the tooltip opens on focus), and its first peer comparison counted `Canvas` at alpha 0 and 1 as different.
- **Firefox, by eye:** `switch`, `radio-group`, `toggle-group` and `tabs`. Firefox paints a `<button>` with `ButtonFace`, a light grey, where Chromium's `ButtonFace` is `Canvas`. So the switch's thumb shows faintly in Firefox and not at all in Chromium. The faults differ in degree between engines, not in kind.

### 4.2 Results (EXECUTED, Chromium, light and dark alike)

**46 items checked. 26 fail; 20 pass.** Of the 26, **20 have a fault in their own source**, and **6 fail only through an item they compose**. Every fault below appeared in both schemes.

| Failure kind | Items with it in their own source | Count |
|---|---|---|
| Focus not visible | none: of 754 focus readings, 730 matched `:focus-visible` and changed at least 263 pixels, with the outline forced to `Highlight`. The other 24 failed in the normal baseline too, so they say nothing about the mode: 6 skip links (they move on screen when focused, out of the photographed box), 12 tab panels and 4 code panes inside hidden tabs, and 2 disabled accordion triggers (not focusable) | **0** |
| State shown only by fill or colour | `switch` (on/off), `radio-group` (the dot), `toggle`, `toggle-group`, `tabs` (both variants), `input-otp` (the active slot's border and the fake caret, a `bg-foreground` box), `sidebar` (the current row; see below) | **7** |
| Invalid shown only by border colour | `checkbox`, `input`, `textarea`, `native-select`, `input-group` (and `input-otp`, by its source: `border-destructive` on its slots) | **5** (+1 by source) |
| Edge drawn only by a fill | `switch`: track and thumb both vanish | **1** |
| Overlay edge drawn only by `shadow-elevation` | `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip` | **6** |
| Disabled by opacity | `accordion`, `button`, `checkbox`, `input`, `input-otp`, `native-select`, `radio-group`, `switch`, `tabs`, `textarea`, `toggle`, `toggle-group` | **12** |
| Icons | none: every icon paints with `currentColor` | **0** |
| Menu highlight | none: bits-ui focuses the highlighted item, so its outline shows | **0** |

- **Own-fault items (20):** `switch`, `radio-group`, `toggle`, `toggle-group`, `tabs`, `input-otp`, `sidebar`, `checkbox`, `input`, `textarea`, `native-select`, `input-group`, `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip`, `button`, `accordion`. The last two fail only on disabled opacity.
- **Inherited only (6):** `breadcrumb` and `theme` (their `dropdown-menu`), `error-summary` (its example's `radio-group` and `input`), `live-console` and `product-home` (`tabs`), `settings` (`radio-group`, `alert-dialog`).
- **Passed (20):** `app-shell`, `chart`, `chat`, `code-block`, `code-editor`, `collapsible`, `composer`, `cta-band`, `four-dot`, `hero`, `item`, `marketing-bar`, `marketing-footer`, `message-log`, `page-states`, `sign-in`, `sign-up`, `stage-card`, `stage-hero`, `table`. `app-shell`'s view rendered no sidebar row or open overlay the audit could read; it composes `sidebar`, `sheet` and `dropdown-menu`, so it will inherit their faults when opened (INFERRED).

**The faults, item by item** (classes READ from source):

- **`switch`.** The track is `data-checked:bg-primary data-unchecked:bg-input` with no border; the thumb is `bg-card` or `bg-primary-foreground`. All four become `Canvas`. In Chromium only the "Off" and "On" labels remain.
- **`radio-group`.** The dot is a `size-3 rounded-full bg-primary` box. It becomes `Canvas`. No radio looks selected.
- **`toggle`, `toggle-group`.** On is `data-[state=on]:bg-foreground data-[state=on]:text-background`. Both forced; on and off are pixel-identical (0 changed pixels, against 2,000 to 4,500 normally).
- **`tabs`.** The active trigger differs by its ground and text colour. Every trigger has `border border-transparent`, which the mode paints, so all three look like the same bordered button.
- **`input-otp`.** The active slot is `data-[active=true]:border-ring`, a colour; the fake caret is `h-4 w-(--focus-width) bg-foreground`, which computes `rgb(255, 255, 255)` on white `Canvas`.
- **`sidebar`.** Every menu row has a 2 px start border, transparent unless current. The mode paints all of them, in `LinkText`, so every row carries the current mark.
- **The invalid five.** `aria-invalid:border-destructive` alone. The field's error message still shows, so the information survives; the control's own mark does not.
- **The six overlays.** Each source comment says it: "The elevation draws the edge, so no border" (READ, `dialog-content.svelte:35`, `sheet-content.svelte:39`, `popover-content.svelte:62`, `dropdown-menu-content.svelte:26`). The shadow is forced to `none`. Their `Canvas` ground covers what is beneath, but nothing marks where the layer ends. The scrim keeps its alpha, so the page behind a dialog dims to white or black.
- **Disabled.** `disabled:opacity-50` and its `aria-` and `data-` forms. Chromium already paints a disabled button's text in `GrayText`; the opacity then halves it. A disabled `<input>`'s text stays `FieldText` at half opacity.

**Outside the 46, seen in passing:**

- **`meter`** (a display item, but its meaning is its fill). The track (`--muted`) becomes `Canvas`; the fill shows as a dark bar with no visible extent, so the proportion cannot be read.
- **`027a`'s `progress`.** Same build as `meter`'s (`appearance: none`, pseudo-element fills). Without `forced-color-adjust: none` it vanishes in Chromium (EXECUTED, §1.2). `027` keeps it drawn with `forced-color-adjust-none`, and says `028` replaces that with system colours.
- **`skeleton`**: its bars vanish; it is decorative and announced by `status`. **`badge`, `alert`, `status`, `spinner`, `avatar`, `separator`, `empty`**: legible; badges and alerts carry their meaning in words and icon shapes.
- **`chart`**: its SVG series and axis fills are explicit, so they keep the token colours in both engines (EXECUTED, §1.2). Series told apart by colour alone is `038`'s question.

### 4.3 What the literal lint does with system colours (EXECUTED)

`lintText` over one class each:

| Class | Result |
|---|---|
| `forced-colors:bg-[SelectedItem]`, `forced-colors:text-[GrayText]`, `forced-colors:fill-[CanvasText]` | passes |
| `bg-[Canvas]`, `bg-[ButtonFace]`, outside any variant | **passes** |
| `forced-colors:outline-[Highlight]` | fails L4 (outline) |
| `forced-color-adjust-none` | passes |

System colour words are not in the lint's named-colour list, so they pass everywhere (READ, `scripts/lint-literals.ts`, `NAMED_COLOURS`). Today a system colour could be used as a design colour outside the mode. `027`'s "system-colour allowance" therefore does not need opening; it needs closing everywhere but under `forced-colors:`.

## 5. What the check can and cannot see, per engine

- **Chromium:** everything in §4.1. The forced palette follows the scheme, so dark is a second palette.
- **Firefox:** everything, but one palette for both schemes, and its `Highlight` sits at 2.9:1 on `Canvas` (§1.3). Pixel-difference rules hold; ratio rules would not.
- **WebKit:** the media query matches and Kuiper's own forced rules apply, so a check can read that the declared system colours computed. It cannot see what the forcing does (EXECUTED). Safari has no forced-colours mode (§1.1).
- **Not seen by any engine here:** a real Windows contrast theme's palette, edited colours, and Edge. The emulation is the engine's built-in palette (INFERRED from §1.3: Chromium's light `GrayText` is a dark red, no Windows theme's). A run on a Windows runner with a contrast theme set is possible in `022`'s NVDA job image but not attempted.

## 6. What this suggests (INFERRED)

1. One rule set, by role: `Canvas` and `CanvasText` left to the engine; selected, checked, pressed and on as a `Highlight` fill with `HighlightText`; marks in `CanvasText`, or `ButtonText` inside a button; current as weight plus a drawn edge; invalid as a wider edge; disabled as `GrayText` at full opacity; every layer above content with a drawn edge.
2. Rules live in each item's class strings, under `forced-colors:`, so an app that installs an item gets its rules (constitution §4.1). The theme keeps its one `.glass` rule and the base `:focus-visible` outline, which already passes.
3. The lint admits system colours only under `forced-colors:`, and `forced-color-adjust-none` nowhere in items.
4. A per-item check that asserts drawing and difference, not ratios, in Chromium and Firefox; and that the declared rules computed, in WebKit.

## 7. Limits

- One viewport, 1280 × 900. The phone layouts (the sheet-based sidebar at 390) were not audited.
- Hover is not audited: forced colours drop `hover:bg-accent`, and hover is not a WCAG requirement.
- The audit reads example pages. A state no example shows (an invalid OTP, an open `app-shell` menu) was judged from source.
- No real Windows theme was used (§5).

No code was copied from prior art. Nothing in the repository was changed but this file and `028`'s specification.

## Correction, 2026-11-15 (after `028`'s specification review)

The sections above stand as written. This section corrects and extends them from the review ([`../reviews/028-forced-colours-spec-2026-11-15.md`](../reviews/028-forced-colours-spec-2026-11-15.md); its probes in the session scratchpad, `028-review/`) and from one more probe by the spec author, `028/reaudit.ts` in the same scratchpad. Labels as before.

1. **Specificity (§3, a ninth failure kind).** The media query adds nothing to specificity. A bare `forced-colors:bg-[ButtonText]` (0,1,0) loses to `data-unchecked:bg-card` (0,2,0), and a bare `forced-colors:opacity-100` loses to `disabled:opacity-50`, in all three engines. The same classes stacked on the state's variant (`forced-colors:data-unchecked:bg-[ButtonText]`) win (EXECUTED, the review, compiled with the pinned Tailwind and applied). So **a forced-colours fix that omits the variant of the class it overrides is itself a failure kind.**
2. **The 20 passes of §4.2, re-audited with states driven** (EXECUTED, Chromium, forced, at 1280 and 390): every form in each view submitted empty, every popup trigger opened, stateful elements listed. Four were false passes:
   - `sign-in` and `sign-up`: after an empty submit, their invalid `input`s keep a 1 px `CanvasText` border, as a valid one does (the review found the same). They inherit the invalid kind from `input` and `input-group`.
   - `app-shell` and `marketing-bar`: at 390 each opens a `sheet` whose content has a 0 px border. They inherit the overlay-edge kind from `sheet`.
   - The other 16 reached nothing new. `table`'s selected row keeps a 2 px start border under the mode, a true pass (the review). `composer`'s send button is never disabled (`composer.svelte:129`, the review).
   **Corrected totals: 46 checked; 30 fail, 20 in their own source and 10 only through an item they compose; 16 pass.** The inherited ten: `breadcrumb`, `theme`, `error-summary`, `live-console`, `product-home`, `settings`, `sign-in`, `sign-up`, `app-shell`, `marketing-bar`. §7's first limit (one viewport) is lifted for these 20.
3. **Disabled by opacity, by source** (READ, grep over `src/lib/registry/ui/`). Beyond the twelve the audit saw, five more items fade a disabled control or its label with `opacity-50`: `sidebar` (menu and sub buttons), `dropdown-menu` (items), `input-group` (its addon), `field` and `label` (labels beside a disabled control). No example showed them disabled.
4. **Firefox's grey `ButtonFace` (§4.1).** It differs from white `Canvas` by 62 in channel sum, about 1.2:1. So in Firefox today's switch thumb and pressed toggle "show" only faintly, and a pixel rule at a 60 threshold counts them as drawn: the toggle changed 3,972 pixels on press, the switch 984 (EXECUTED, the review). A threshold above 150 does not count them; Firefox's `Highlight` on white differs by 306 and its `GrayText` by 438 (the review).
5. **Firefox's meter (§4.2, "Outside the 46").** As built, Firefox paints `meter` white at 10% and 90%, so it vanishes there too, not only Chromium's track (EXECUTED, the review). With a `Canvas` track, a 1 px edge and a `CanvasText` fill, both `meter` and `progress` read `0,0,0` at 10% and `255,255,255` at 90% in Chromium and Firefox (EXECUTED, the review).
6. **`Highlight` is translucent in some palettes (§1.3).** Chromium's emulated `Highlight` is `rgba(5, 0, 73, 0.8)` light and `rgba(26, 235, 255, 0.8)` dark. WebKit's is `rgba(128, 188, 254, 0.6)` (EXECUTED, the review; §1.3's composited ratios stand). Inside a `color-scheme: dark` subtree on a light page, Chromium's `Highlight` becomes `rgba(55, 0, 110, 0.8)`, and every other keyword is unchanged (EXECUTED, the review). So a reference colour must be read in the element's own scope.
7. **WebKit, worded exactly (§1.2 point 1).** WebKit emulates the media query, so rules under it apply. It repaints nothing. A 4 px transparent border stays unpainted (EXECUTED, the review, by painted pixels).
8. **The overlay edge's prior art (§2).** Carbon's popover takes a 1 px transparent outline under the mode (READ, the review, `components/popover/_popover.scss:225`, `high-contrast-mode('outline')`). Microsoft recommends 2 px for transitory surfaces (§1.1).
9. **A path (§4.2 cites none, `028` cited it short).** The site's navigation rule is in `src/lib/site/chrome/side-nav.svelte`, its comment at lines 68–69.
10. **Weights.** The token file holds 400, 500 and 700 only; the literal lint rejects `font-semibold` (EXECUTED, the review).
