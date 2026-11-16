# 028 — Forced colours

- **Status:** Ready to build: owner answers recorded, review approved with changes, all applied (2026-11-15). The review, [`../reviews/028-forced-colours-spec-2026-11-15.md`](../reviews/028-forced-colours-spec-2026-11-15.md), raised 16 findings (1 High, 7 Medium, 8 Low); each is answered under "Review". The owner answered Q1 to Q4 on 2026-11-15 (Landing notes). It builds after `023`, `026`, `027a` and `027b`, as the roadmap orders.
- **Date:** 2026-11-15
- **Author:** the spec author for `028`, for the design lead
- **Kind:** forced-colours rules in existing items' source (lane I), two literal-lint rules, two unit tests and one browser check per item. **Interface changes:** none. No prop, slot, export or default changes. Every added class sits under the `forced-colors:` variant, so no rule outside the mode changes (criterion 9). No token and no dependency is added. Each item whose source changes gets one changelog bullet (decision 18). Constitution §4.3 gains one clause at landing, and `AGENTS.md` one sentence, both given verbatim in decision 12 (the owner, Q1).
- **Lane:** I, existing items (`roadmap.md` §2, "Lanes"). It also adds `scripts/lint-literals.ts` rules and their unit tests, and test files under `tests/e2e/forced/` and `tests/unit/`. It moves four earlier tests onto `notIn` or `onlyProjects` (decision 15, lane E), whose skip data lives in `tests/e2e/engine-only.ts`.
- **Written against the renamed tree.** `020` (the Kuiper rename) lands first, so every name here is the new one: the `kuiper` registry, `kuiper-theme`, `kuiper:` context keys, `scripts/bench/kuiper.ts`, the guide at `/changelog/0.13.0/upgrade/`. The audit ran on today's tree, which still reads `pluto`; no item, slot or class it names is renamed by `020` (`020`, Kind).
- **Depends on:** `023` (prop doc comments), landed: it touches nearly every item's source and lane I queues behind it (`023` decision 14). `026` (toast), `027a` (link, button group, progress) and `027b` (pagination, search field, tag), landed: their seven items are held to the check on arrival, and `027a`'s progress bar is changed by it (decision 10). `022` (the test matrix) gives the Firefox and WebKit projects and `tests/e2e/engines.ts`, where `notIn` lives (decision 15); if `022` has not landed, the check runs in the Chromium projects and joins the others when it does. Ranked in [`roadmap.md`](../roadmap.md) §2, 0.13.0, row `028`, wave 2, lane I.
- **Blocks:** `030` (the accessibility status) reads this check's per-item results. `031` (high contrast) is a different mode (`prefers-contrast: more`) and needs this spec only for its order in the roadmap.
- **Research it stands on:** [`research/2026-11-15-forced-colours.md`](../research/2026-11-15-forced-colours.md), cited as *the memo*, by section, with its correction of 2026-11-15 (cited as *the memo*, "Correction"): the engines' behaviour, measured; the references; the audit of 46 items, re-run with states driven. Also [`019a`](./019a-the-fonts-own-spacing-the-glass-bar-and-depth.md) decision 3 (transparency signifies depth), [`022`](./022-the-test-matrix.md) decisions 1 to 3, 13a and 16, [`026`](./026-toast.md) decisions 13 and 14 and test 68, [`027`](./027-batch-a.md) decision 8 ("`028` replaces it with system colours"), tests 24, 40 and 48, [`029`](./029-scoped-schemes.md)'s lanes and decision 9, the [Material memo](../research/2026-11-15-prior-art-material.md) idea 1, `030`'s memo ([`research/2026-11-15-accessibility-status.md`](../research/2026-11-15-accessibility-status.md)) §1.1, and the benchmark scorecard's row 3, criterion (e). The review's probes are in the session scratchpad, `028-review/`, and are cited as *the review*.

## Intent

**Forced colours** is a mode in which the browser replaces a page's colours with a short palette the user chose. Windows calls it a contrast theme. Chromium, Edge and Firefox honour it. Under it, every fill becomes the user's `Canvas` colour, every text and border their `CanvasText`, and every shadow disappears (*the memo* §1.2).

The constitution promises every item meets WCAG 2.2 AA "under forced colours" (§4.4). Today one rule in the theme handles the glass, and no item has a rule (scorecard row 3). The audit shows what that costs. Of 46 interactive items, 30 fail under forced colours. A switch vanishes. No radio looks selected. A pressed toggle looks unpressed. The active tab and the current sidebar row cannot be told apart. An invalid field looks valid. Six overlays lose their only edge (*the memo* §4.2 and "Correction"). Focus is fine everywhere: the theme draws it with an outline, which the mode keeps.

This specification writes one rule set, by role, from **system colours** (CSS keywords whose value is the user's palette). It applies the set to every item that breaks. It adds a check per item that turns forced colours on in Chromium and Firefox, and asserts that focus, state and edges are still drawn.

## What the research found

- **The engines differ, and WebKit does not repaint.** Under Playwright's emulation, Chromium and Firefox force colours, drop shadows and paint transparent borders. WebKit emulates the media query, so rules written under it apply, but it repaints nothing (*the memo* §1.2, EXECUTED; confirmed by painted pixels in *the review*). No Safari platform has the mode; macOS's "Increase contrast" is `prefers-contrast: more` (§1.1).
- **Four engine facts shape the rules** (EXECUTED, §1.2, *the review*):
  - an author's system colour is kept, so a rule may set `Highlight` and it holds;
  - a transparent border is painted, so a reserved "current" edge shows on every row; `Canvas` hides it;
  - opacity is kept, so `disabled:opacity-50` halves the system's `GrayText`;
  - the media query adds nothing to specificity, so a bare `forced-colors:` class loses to a state class such as `data-unchecked:bg-card` (*the review*, finding 1).
- **The emulated palettes are not contrast themes** (§1.3). Chromium's `SelectedItem` is 1.5:1 on its light `Canvas`. Firefox's `Highlight` is 2.9:1, and it paints an "on" `<button>` in `ButtonFace`, 1.2:1 on `Canvas`. A check must assert drawing and difference, not ratios, and must not count a `ButtonFace` change as drawn.
- **The audit** (§4.2, re-run with states driven at 1280 and 390, "Correction"): 46 items, Chromium, light and dark. 20 fail in their own source. 10 fail only through an item they compose. 16 pass. By kind, in own source: focus 0; state shown only by fill or colour 7; invalid shown only by border colour 5; edge drawn only by a fill 1; overlay edge drawn only by a shadow 6; disabled by opacity 12 seen (17 by source); icons 0.
- **The references** (§2). Carbon has a forced-colours mixin in 33 style files, GOV.UK rules in 8 components, Material in 35 stylesheets; Radix Themes has none. Microsoft's own guidance gives the roles: `Highlight` for selected and pressed, `GrayText` for disabled only, 2 px borders for transitory surfaces. Carbon's popover takes a 1 px outline. None renders its components under the mode in a test.
- **The literal lint lets system colours through everywhere** (§4.3, EXECUTED): `bg-[Canvas]` passes outside any variant. It rejects `font-semibold`: the token file holds weights 400, 500 and 700 (*the review*, finding 2).

## Decisions

### 1. Which items: every interactive item, and the two fill graphics

- **Interactive** means the item renders a focusable or operable element, by its own markup or through an item it composes. Today 46 of 75 items (*the memo* §4.1). At `028`'s landing, 52: the 46, `026`'s `toast`, `027a`'s `link` and `button-group`, and `027b`'s `pagination`, `search-field` and `tag`.
- **Two display items join:** `meter` and `027a`'s `progress`. Their meaning is a fill, and the mode erases it, in Chromium and Firefox both (*the memo*, "Correction").
- **So the check covers 54 of the 82 items at landing.** The other 28 are named in one list, `EXCLUDED`, each with its reason (decision 13). Test 1 derives the numbers from the tree; the decision does not pin them.
- *Why not every item:* the display items read in passing are legible. Badges and alerts carry words and shapes (§4.2). `skeleton`'s bars vanish, but they are decorative, and `status` announces the wait. The roadmap row says "every interactive item".

### 2. The rule set, by role, and the specificity rule

The table is the whole palette an item may use under forced colours. Nothing else is set.

| Role | System colour | Where |
|---|---|---|
| Ground and text | left to the engine (`Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `Field`, `FieldText`, `LinkText`) | everything not below |
| Focus | left to the engine: the theme's `:focus-visible` outline, forced to `Highlight` (Chromium) or `CanvasText` (Firefox) | decision 3 |
| Selected, checked, pressed, on | **`Highlight`** fill, **`HighlightText`** for the text and marks on it | decision 4 |
| A mark on the ground (a thumb at rest, a caret, a fill) | `CanvasText`; `ButtonText` inside a `<button>` | decision 5 |
| A selected mark on the ground (a radio's dot) | `Highlight` | decision 5 |
| Current, in a set of links | the edge it already reserves, drawn in `Highlight`, with weight 700 (`font-bold`) | decision 6 |
| Where input goes next (the OTP's active slot) | a `Highlight` edge | decision 8 |
| A reserved edge that must not show | `Canvas` | decision 6 |
| A control's edge | a border, its colour left to the engine | decision 7 |
| Invalid | the control's border, widened to `--focus-width` | decision 8 |
| Disabled | `GrayText` for text, edges and marks, at full opacity | decision 9 |
| A layer above content | a border of `--focus-width` on a transitory layer, colour left to the engine (the owner, Q2) | decision 10 |
| Icons | `currentColor`, always | decision 11 |

**The specificity rule.** A forced-colours class carries the same state variant as the class it overrides. The media query adds nothing to specificity. So `forced-colors:bg-[ButtonText]` (0,1,0) loses to `data-unchecked:bg-card` (0,2,0), and `forced-colors:opacity-100` loses to `disabled:opacity-50` (EXECUTED in all three engines, *the review*). The fix is stacked: `forced-colors:data-unchecked:bg-[ButtonText]`, `forced-colors:disabled:opacity-100`. A bare class overrides only a bare class. The site already writes it this way: `forced-colors:aria-pressed:bg-[SelectedItem]` (READ, `src/lib/site/page/theme-switch.svelte:34`). Test 8 enforces it in source, and assertion G in the browser.

- *Why `Highlight`, not `SelectedItem`, for selected:* CSS Color 4 names `SelectedItem` for "a selected checkbox", and Carbon follows it. But Chromium's emulated `SelectedItem` sits at 1.5:1 on its light `Canvas`, so a selected fill would be invisible in the engine the check runs most (*the memo* §1.3). Microsoft names `Highlight` for UI that is "selected, interacted with (hover, pressed), or in progress"; Spectrum's menu guidance does the same; MDN describes `Highlight` as the "background of selected items" (§1.1, §2; *the review*). On Windows both resolve to the theme's highlight (INFERRED).
- *Why the engine keeps the ground, text and edges:* Primer's rule, "lightly adjusted" only (§2). An item sets a system colour only where the engine's default loses meaning.
- *Why no `forced-color-adjust: none`:* it keeps the brand's colours against the user's choice. MDN says it "should not be used to prevent user choices being respected" (READ, *the memo* §1.2's source). Decision 12 forbids it in items.
- **Alpha.** The system colours are the user's. `028` adds no alpha to them. Some palettes carry their own: Chromium's emulated `Highlight` is 80% opaque, WebKit's 60% (*the review*). The fill sits on the control's own `Canvas` ground, so nothing behind the layer shows through, and `019a` decision 3 holds.

### 3. Focus: the theme's outline, unchanged, and required

- The theme draws focus with `outline: var(--focus-width) solid var(--ring)` on `:focus-visible`. Three containers draw it with the `focus-ring` utility (READ, `src/app.css`; `scripts/lint-literals.ts` L15). The mode keeps outlines and forces their colour. Every one of 730 readable focus readings changed at least 263 pixels (*the memo* §4.2).
- So nothing changes. The check holds it: every focusable element in an item's examples shows a focus indicator under forced colours (decision 13, assertion A).
- The literal lint already forbids `ring-*`, `outline-*` and `shadow-*` classes in items (L3 to L5), so focus cannot drift to a box-shadow.

### 4. Selected, checked, pressed and on: a `Highlight` fill

Under `forced-colors:`, the element whose fill means the state takes `bg-[Highlight]`, and its text and marks take `text-[HighlightText]`, each stacked on the state's own variant (decision 2):

- `toggle`, and `toggle-group`'s items: `forced-colors:data-[state=on]:bg-[Highlight]`, `forced-colors:data-[state=on]:text-[HighlightText]`;
- `tabs`' trigger: `forced-colors:data-active:bg-[Highlight]`, `forced-colors:data-active:text-[HighlightText]`, in both variants;
- `checkbox`: `forced-colors:data-checked:bg-[Highlight]` and `forced-colors:data-[state=indeterminate]:bg-[Highlight]`, with `text-[HighlightText]` on the same two variants (its check and minus are `currentColor`, so they follow);
- `switch`'s track: `forced-colors:data-checked:bg-[Highlight]`;
- `027b`'s `tag` when pressed, and `026`'s and `027`'s other items if the check finds a fill-only state there.

A fill is not the only sign where a shape already exists: the checkbox's check, the switch's thumb position, the tag's check. A tab and a toggle have only the fill, as Windows' own controls do.

### 5. Marks drawn as filled boxes

A **mark** is a small element drawn by its background: a dot, a thumb, a caret, a bar's fill. The mode turns it into `Canvas` on `Canvas`.

- **`radio-group`'s dot:** `forced-colors:bg-[Highlight]`. The dot's `bg-primary` is bare, so a bare twin overrides it.
- **`switch`'s thumb:** `forced-colors:data-unchecked:bg-[ButtonText]` at rest and `forced-colors:data-checked:bg-[HighlightText]` on the `Highlight` track. Its rest and on classes are `data-unchecked:bg-card` and `data-checked:bg-primary-foreground`; the twins match them. The thumb's position still moves.
- **`input-otp`'s fake caret:** `forced-colors:bg-[CanvasText]`.
- **`meter`'s and `progress`'s fills:** `forced-colors:` arbitrary pseudo-element variants (`[&::-webkit-meter-optimum-value]`, the two other meter values, `[&::-moz-meter-bar]`, `[&::-webkit-progress-value]`, `[&::-moz-progress-bar]`) set to `bg-[CanvasText]`; their tracks to `bg-[Canvas]` with a 1 px edge (decision 7). Each vendor pseudo-element rule compiles to its own rule under the media query (EXECUTED, *the review*). With these roles, both elements read `0,0,0` at 10% and `255,255,255` at 90% in Chromium and Firefox (EXECUTED, *the review*). `meter`'s normal look stays in the theme. Utilities outrank the theme's `components` layer, so the item's classes win under the mode.

### 6. Current: the reserved edge, drawn only where current

- `sidebar`'s default-variant menu rows reserve a 2 px start border, `border-transparent` unless `aria-[current=page]` (READ, `sidebar-menu-button.svelte:11`). The mode paints every one (*the memo* §4.2). So:
  - the default variant takes `forced-colors:border-s-[Canvas]`, which the engine keeps and which matches the ground;
  - the current row takes `forced-colors:aria-[current=page]:border-s-[Highlight]` and `forced-colors:aria-[current=page]:font-bold`, stacked on the variant its normal mark uses.
- **The outline variant is left alone.** Its rows draw `border border-input border-s-(length:--focus-width)` at rest (`sidebar-menu-button.svelte:18`). That start edge is part of the box, not a reserved space. So `border-s-[Canvas]` sits in the default variant's classes only, and the outline variant's current row takes `forced-colors:aria-[current=page]:border-s-[Highlight]` and `font-bold`. D reads the outline rows' four edges.
- This is the site's own rule for its navigation, "marked by weight and a start border" (READ, `src/lib/site/chrome/side-nav.svelte:68–69`), now in an item. Weight 700 is a token weight (`font-bold`); `027b`'s pagination marks its current page the same way (`027` decision 13).
- `027b`'s `pagination`: if its other pages reserve a transparent border, they take `Canvas` the same way.
- `tabs`' line variant reserves a 2 px bottom edge, transparent unless active. It takes `forced-colors:group-data-[variant=line]/tabs-list:border-b-[Canvas]`, and its active trigger the stacked `Highlight` edge, beside decision 4's fill.
- **The general rule:** a border that exists only to hold space for a state takes `Canvas` under forced colours, never `transparent`.

### 7. A control's edge

- A control whose edge is drawn only by its fill gets a 1 px border under forced colours: `forced-colors:border`, its colour left to the engine. Today that is `switch`'s track alone (*the memo* §4.2), and `meter`'s and `progress`'s tracks.
- **The switch's geometry holds by its travel, not its padding.** The track keeps `p-1`. With a 1 px edge on each side, the thumb's on position moves back by the two edges: `forced-colors:data-checked:translate-x-[calc(8*var(--spacing)-2*var(--line-width))]`, which passes the literal lint (EXECUTED, *the review*). Padding forms fail it (`p-[calc(var(--space-1)-var(--line-width))]` is "spacing off the ladder"; `p-[3px]` an "arbitrary value"). Vertically, the 24 px thumb is centred in the 30 px padding box. Assertion D2 checks that the thumb's box lies inside the track's padding box, on and off.
- Controls that already have a border (`input`, `checkbox`, `radio-group`'s ring, `tabs`' transparent border) keep it. The mode paints them.

### 8. Invalid: a wider edge; where input goes next: a `Highlight` edge

- Five items mark invalid only with `aria-invalid:border-destructive`: `checkbox`, `input`, `textarea`, `native-select` and `input-group`. `input-otp` does the same on its slots (READ, `input-otp.svelte:45`). Two blocks reach those states, `sign-in` and `sign-up`, after an empty submit (*the memo*, "Correction"). The mode forces the colour away.
- Under forced colours each takes a border of `--focus-width` (2 px) when invalid: `forced-colors:aria-invalid:border-(length:--focus-width)`, and `input-otp`'s and `input-group`'s `has-[…]` forms of it, each on the same variant as its `border-destructive` class. `radio-group`'s group form (`group-aria-[invalid=true]/radio-group:`) takes the same twin.
- The field's error message still shows, so the information was never lost (*the memo* §4.2). The wider edge marks *which* control. GOV.UK marks an error the same way, with a thick border that the mode keeps (READ, *the memo* §2).
- *Why width and not a dashed style:* a 2 px edge differs from the 1 px resting edge in every palette; a dash on a 48 px field is easy to miss (INFERRED). Focus stays distinct: it is an outline, offset outside the border.
- **`input-otp`'s active slot** is where the next digit goes. It is not focusable (the hidden input is), so its edge stands in for focus. It takes `forced-colors:data-[active=true]:border-[Highlight]`. Microsoft names `Highlight` for UI "in progress", and Chromium draws focus in `Highlight`. So in an invalid code, an invalid slot has a wide edge and the active slot a `Highlight` edge, and the two differ.

### 9. Disabled: `GrayText`, at full opacity

- Twelve items faded a disabled control in the audit (*the memo* §4.2). By source, 17 fade one with `opacity-50`: the twelve, and `sidebar`'s menu buttons, `dropdown-menu`'s items, `input-group`'s addon, and `field`'s and `label`'s labels beside a disabled control (READ, grep).
- Under forced colours, each such class gets a stacked twin on the **same** variant (decision 2): `forced-colors:disabled:opacity-100`, `forced-colors:aria-disabled:opacity-100`, `forced-colors:data-disabled:opacity-100`, `forced-colors:has-disabled:opacity-100`, `forced-colors:has-[select:disabled]:opacity-100`, `forced-colors:group-has-disabled/field:opacity-100`, `forced-colors:group-data-[disabled=true]/field:opacity-100`, `forced-colors:group-data-[disabled=true]/input-group:opacity-100`, `forced-colors:peer-disabled:opacity-100`, and so on. Test 8 lists them from source, so none is missed.
- On the same variants, the faded element takes `text-[GrayText]`, its border, where it has one, `border-[GrayText]`, and a mark inside it (a radio's dot, a switch's thumb) `bg-[GrayText]`.
- This is a convention, not a WCAG failure: disabled controls are exempt from contrast (*the memo* §3, kind 6). Microsoft reserves `GrayText` for exactly this, and Material and Carbon apply it (§1.1, §2). Full opacity is the only way the user's chosen `GrayText` reaches the screen as chosen. **The owner ruled it in scope, across the 17 items (Q3, 2026-11-15).**
- `field` and `label` are display items, not in the check's 54. Their twins are checked through `input`'s and `checkbox`'s cases, whose examples show a disabled field with its label (assertion E).

### 10. Layers above content draw an edge

- Six overlays draw their edge with `shadow-elevation` alone, and say so in their comments: `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu` and `tooltip` (with `dropdown-menu`'s sub-content). The mode removes the shadow.
- **Each transitory layer's content element takes a `--focus-width` (2 px) border under forced colours**, `forced-colors:border-(length:--focus-width)`, its colour left to the engine. So does `026`'s `toast`, whose 1 px transparent border the mode already paints (`026` decision 13): its twin widens it under the mode only. `026` is written and built with its 1 px edge; **the toast takes this 2 px edge when `028` lands**, as an existing item in lane I, and `026` test 68 ("at least 1 px") still passes.
- *Why 2 px:* Microsoft is the only guidance written for this mode, and it says "We recommend using 2px borders for transitory surfaces such as flyouts and dialogs" (READ, *the memo* §1.1). Under the mode every field and button already has a 1 px `CanvasText` edge, so a 1 px layer edge reads like one more control. Carbon chooses 1 px for its popover, a transparent outline the mode paints (READ, `components/popover/_popover.scss:225`). **The owner chose 2 px, for the six overlays and the toast (Q2, 2026-11-15).**
- **The glass bar is unchanged.** It is not transitory: it stays on screen. Its theme rule keeps its 1 px `CanvasText` border (READ, `src/app.css`).
- **The scrim is left alone.** The mode keeps its alpha over `Canvas`, so the page behind a modal dims (*the memo* §4.2). That is still depth, and `019a` decision 3 holds: only layers above content are translucent.
- **`027a`'s `progress`:** its `forced-color-adjust-none` is removed and replaced by decisions 5 and 7, as `027` decision 8 promised.

### 11. Icons: `currentColor`, always

- Every icon in today's items paints with `currentColor` and follows the forced text colour (304 readings, *the memo* §4.2).
- Two engine facts make it a rule. An inline SVG's explicit `fill` is kept, not forced, in Chromium and Firefox. A colour class on the `<svg>` element itself is kept in Chromium, which gives `<svg>` `forced-color-adjust: preserve-parent-color` (*the memo* §1.2, EXECUTED; confirmed by *the review*). Either would leave a brand colour on the user's `Canvas`, perhaps at 2:1.
- **So:** in an item, an icon takes its colour from an ancestor's text colour. No `text-*`, `fill-*` or `stroke-*` colour class sits on an `<svg>` or an icon component. A meaning carried by an icon's colour is also carried by its shape or by words, as `026` decision 14 does for the toast's kinds.
- `chart`'s series fills are explicit SVG fills, kept by both engines. Telling series apart without colour is `038`'s question; `chart` is checked here only for its one control, "Show as table".

### 12. The lint: system colours only under the mode

Two rules join the literal lint (`scripts/lint-literals.ts`), numbered after the last one at landing (L25 and L26 if none has been added):

- **L25, a system colour outside the mode.** A class whose arbitrary value names a system colour (any keyword of CSS Color 4's list, case-insensitive, including the deprecated ones such as `WindowText`) fails unless its variants include `forced-colors`, and unless the keyword is one of decision 2's: `Highlight`, `HighlightText`, `CanvasText`, `ButtonText`, `GrayText`, `Canvas`. Today `bg-[Canvas]` passes anywhere (*the memo* §4.3). Only item files are linted, so the site's `SelectedItem` and swatches are untouched.
- **L26, `forced-color-adjust-none`** fails in any item file. `027a`'s one use is removed by decision 10.
- **Not linted:** a reserved transparent border (decision 6) and an icon's colour class (decision 11) are judged by the check, which sees what the class does. The specificity rule (decision 2) is held by test 8, which reads class strings as the lint does.
- Both rules report like the others and are counted in the lint's totals. No allowance is added. Every class in this specification passes today's rules (EXECUTED, *the review*), `font-bold` included.
- **The constitution, amended at landing (the owner, Q1, 2026-11-15).** §4.3 says a colour in a component comes from a token. L25 allows six keywords under the mode. The owner ruled that §4.3 gains one clause, noted in its Status line, that `AGENTS.md` mirrors it, and that L25 enforces it. The builder applies these three texts verbatim at landing, in the landing commit; the constitution is not edited before then.
  - **§4.3, as amended** (the second sentence is new): "3. **Tokens are the one source.** A colour or size in a component comes from a token, never a literal. Under forced colours, an item may name the system colours of `028` decision 2 (`Highlight`, `HighlightText`, `CanvasText`, `ButtonText`, `GrayText` and `Canvas`); they are the user's palette, not design colours."
  - **Appended to the constitution's Status line:** " Amended 2026-11-15 (`028`, the owner's answer to Q1): §4.3, under forced colours an item may name six system colours, the user's palette, not design colours."
  - **`AGENTS.md`'s rule, as amended:** "- **Tokens are the one source** of every colour and size. Under forced colours, an item may name `028`'s six system colours, which are the user's palette (constitution §4.3)."

### 13. The check: one test per item, from data

- **A table, `tests/e2e/forced/cases.ts`,** has one entry per checked item (decision 1). An entry names:
  - the page or view to open, and the viewports (1280, and 390 where the item changes shape there, such as a sidebar or bar that becomes a sheet);
  - which stages to read (default: every `[data-slot="frame-stage"]`);
  - **the states to drive before reading:** the flips (a selector and the attribute that changes), the forms to submit empty, the menus, sheets and dialogs to open, the rows to select. A composite's case drives every state its view can reach through the items it composes (decision 14);
  - the static states to compare (a selector, and the peer selector without the state);
  - its controls' edge selectors, and its marks;
  - its `roles` list for G.
  `EXCLUDED` names every other item with its reason.
- **`tests/e2e/forced/items.spec.ts`** turns `forcedColors: "active"` on with `page.emulateMedia` (`022` decision 3's engine-neutral API), sets reduced motion, and generates two tests per case:
  - **"<item> under forced colours: focus, state and edges are drawn"**, assertions A to F;
  - **"<item> under forced colours: its rules compute"**, assertion G.
- **Declared, not pushed.** Each generated test declares `item: <name>` and `check: "forced-colors"` in its details, `test(title, { annotation: [...] }, fn)`, so they appear in Playwright's listing. An annotation pushed at run time does not (`030`'s memo §1.1). `030` reads them. `022` decision 13a names the two keys. `028` declares no Playwright tags, only these annotations; a tag added later takes a leading `@`, as `022`'s `@reader-voiceover` does.
- **Changed pixels** are counted between two screenshots of the same clip. A pixel changes when its three channels differ by **more than 150 in sum**. Firefox's `ButtonFace` on white `Canvas` differs by 62 and does not count. The weakest real mark measured, Firefox's `Highlight` on white, differs by 306, and its `GrayText` by 438 (*the review*, finding 4). This is a "drawn" threshold, not a palette ratio. Screenshots are decoded in the page, as `bar-glass.spec.ts` does, so no package is added.
- **The assertions:**
  - **A. Focus.** Each focusable element in the stages, focused with `focusVisible`: changed pixels in its box plus 8 px are at least its own perimeter in CSS pixels (a 1 px ring all round). And its computed `outline-style` is not `none`, or the item's case names the container that draws the ring (`input-group`, `input-otp`, `code-block`).
  - **B. State.** Each declared state, driven by a click or a key: the attribute changes, and at least 32 pixels change inside the control's box plus 3 px. The audit's failures changed 0; its smallest passing change was 50, a checkbox's check (*the memo* §4.2).
  - **C. Static states.** Each declared `aria-current`, `data-active` or `aria-invalid` element differs from its peer in at least one of: border width, border style, font weight, text decoration, or a background that is a declared system colour. Colours the mode forces are not compared. A background equal to `Canvas`, at any alpha, counts as the ground.
  - **D. Edges.** Each declared control, and each opened layer's content element, has a border at least 1 px wide on every side, of a style other than `none` or `hidden`, whose computed colour differs from its ground. A layer's border is at least the width decision 10 gives.
  - **D2. The switch's geometry.** On and off, the thumb's border box lies inside the track's padding box.
  - **E. Disabled.** Each disabled element in the stages, and each label of a disabled field, has an effective opacity of 1 (the product along its ancestors). Its text colour equals the computed `GrayText`. Its border colour, where its border is wider than 0, equals `GrayText`. Each declared mark inside it has a background equal to `GrayText`.
  - **F. Icons.** Each painted shape of each `<svg>` in the stages has a `fill` or `stroke` equal to its `<svg>`'s parent's computed `color`, or equal to a computed system colour of decision 2.
  - **G. Rules compute.** For each entry of the case's `roles` list, the computed property equals the computed value of the system colour decision 2 gives it: on a pressed `toggle`, `background-color` equals `Highlight`'s; on `radio-group`'s dot, `Highlight`'s; on a disabled `switch`, `opacity` is 1 and the thumb's background `GrayText`'s; and so on. **Each disabled form in the item's source has a role**, so a missed variant fails G as well as E. **The reference colour is read beside the element:** a probe element is inserted as the element's sibling, given the keyword, read, and removed. Once `029` adds `data-scheme`, Chromium resolves `Highlight` differently inside a dark scope (`rgba(55, 0, 110, 0.8)` against `rgba(5, 0, 73, 0.8)`, EXECUTED, *the review*), and a probe on `body` would fail a correct rule.
- **No ratio is asserted.** The emulated palettes are not contrast themes (*the memo* §1.3). The user's palette owns contrast. The check owns that something is drawn, in its role, and differs.
- **A derived list holds the table honest.** `tests/status/interactive.ts` derives the interactive items from source (decision 13a), and `tests/unit/forced-items.test.ts` imports the derivation from it: an item is interactive if a file it lists renders a native control, a link, `tabindex` of 0 or more, `contenteditable` or a bits-ui `Trigger`, `Item` or `Root` of an operable primitive, or if one of its `registryDependencies` is interactive. Each is in `cases.ts`; `meter` and `progress` are there; every other item is in `EXCLUDED` with a reason. A case whose item depends on an item with `roles` declares at least one driven state, or gives a reason why its view reaches none. So a new interactive item, or a composite that reaches no state, fails the unit suite until it has a case.

### 13a. What `030` imports: one module, `tests/status/interactive.ts`

`030` builds the accessibility status from `028`'s results, and imports three things from `028` as data, not prose (`030` decision 3). So they live in a module, not inside a test. `028` lands first, so it creates the module; `030` imports from it and does not move it.

- **The interactive set.** `interactiveItems(registry)` returns the items decision 13's rule derives from source: 52 at landing. `FORCED_CHECKED` is that set plus `meter` and `progress`: 54 at landing (decision 1). `030` uses the first as its keyboard set and the second as its forced-colours set.
- **The forced-colours projects.** `FORCED_PROJECTS = { draw: ["chromium-light", "chromium-dark", "firefox-light"], compute: ["chromium-light", "chromium-dark", "firefox-light", "webkit-light"] }`, as decision 15 gives them. `items.spec.ts` reads it to decide where each generated test runs, so the spec file and `030` cannot disagree.
- **The WebKit gap, marked.** `FORCED_WEBKIT_GAP = { gap: "no-user", reason: "no Safari platform has a forced-colours mode; Kuiper's rules are checked to compute there" }`. Every WebKit entry decision 15 adds to `ENGINE_ONLY` (`tests/e2e/engine-only.ts`), through `notIn` or `onlyProjects`, carries it, with `030`'s `shown` sentence: "Forced colours are not drawn in WebKit: no Safari platform has a forced-colours mode. Kuiper's rules are checked to compute there." `030` reads a `no-user` entry as a declared gap, not a fault (`030` decision 5). `030` says only a design lead's ruling may set the mark; that ruling is recorded in `028`'s landing notes. `ENGINE_ONLY`'s optional `gap` and `shown` fields are `030`'s (its decision 5), in `tests/e2e/engine-only.ts`. `028` lands first, so it adds the two optional fields with its first marked entry; `030` then reads them.
- `cases.ts` and `EXCLUDED` stay in `tests/e2e/forced/`. The module holds the derivation and the configuration, not the per-item cases.

### 14. Composite items are fixed at their source

- Ten items fail only through an item they compose (*the memo* §4.2 and "Correction"):
  - `breadcrumb` and `theme`, through `dropdown-menu`;
  - `error-summary`, through `radio-group` and `input`;
  - `live-console` and `product-home`, through `tabs`;
  - `settings`, through `radio-group` and `alert-dialog`;
  - `sign-in` and `sign-up`, through `input` and `input-group`, after an empty submit;
  - `app-shell` and `marketing-bar`, through `sheet`, at 390.
- Nothing in their own source changes. Their tests pass once the source item is fixed. They stay in the table, so a composite that overrides a fixed class (by `class` or `cn`) is caught.
- Each composite's case drives what its view can reach (decision 13): `sign-in`, `sign-up` and `settings` submit empty; `app-shell` opens its sheet at 390 and its account menu, and reads its sidebar's current row; `marketing-bar` opens its sheet at 390; `table` selects a row.

### 15. Engines: Chromium and Firefox draw; WebKit computes; `notIn` counts the gap

- **Projects.** Assertions A to F (the draw test) run in `chromium-light`, `chromium-dark` and `firefox-light`. Assertion G (the compute test) runs in those and in `webkit-light`. These are `FORCED_PROJECTS` (decision 13a).
  - Chromium's dark forced palette differs from its light one (black `Canvas`), so both run.
  - Firefox's forced palette ignores the scheme (*the memo* §1.3), so `firefox-dark` repeats `firefox-light`.
  - WebKit's system colours are the same in light and dark (EXECUTED, *the memo* §1.2's probe), so `webkit-dark` repeats `webkit-light` for G.
- **`onlyProjects`, for project-level skips.** `onlyIn` and `notIn` name engines, not projects. A third declared helper, `onlyProjects(projects, reason)`, sits beside them in `022`'s `tests/e2e/engines.ts` (`030`'s re-review, R1). It runs a test only in the named projects and skips it elsewhere with a reason per skipped project. Each call is listed, with its skipped projects and reasons, in `ENGINE_ONLY`, whose data lives in its own import-free file, `tests/e2e/engine-only.ts` (`030`'s re-review, R7). `028` uses it three times:
  - **the draw test:** `onlyProjects(FORCED_PROJECTS.draw, …)`. It skips `firefox-dark` ("Firefox: its forced palette ignores the scheme; firefox-light covers it"), and `webkit-light` and `webkit-dark` with `FORCED_WEBKIT_GAP`'s reason and its `gap: "no-user"` mark;
  - **the compute test:** `onlyProjects(FORCED_PROJECTS.compute, …)`. It skips `firefox-dark` (the same reason) and `webkit-dark` ("WebKit: its system colours do not follow the scheme; webkit-light covers it");
  - **`018`'s `tests/e2e/forced-colors.spec.ts`:** its light-only skip at line 11 becomes `onlyProjects(["chromium-light", "firefox-light", "webkit-light"], "light schemes only")`, as `022` (which owns `tests/e2e/engine-only.ts`) and `030` settled it. It skips the dark projects only. It still runs in `webkit-light`: WebKit's inability to draw the mode is declared once, by `028`'s own `no-user` gap on its draw test, not by narrowing this skip.
- **Who adds `onlyProjects`.** Whichever of `022`, `030` or `028` builds first adds it, with its listing; `028` adds it if neither has.
- **WebKit's gap, stated.** WebKit emulates the media query, so Kuiper's forced rules apply there. It repaints nothing: it forces no colour, drops no shadow and paints no transparent border (EXECUTED, *the memo* §1.2; *the review*). So A to F would test the normal look, not the mode. They do not run in `webkit-*`. G does: it proves Kuiper's rules apply there. No Safari platform has a forced-colours mode (§1.1), so no Safari user meets the gap.
- **`notIn`, and where it lives.** `022`'s `onlyIn(engine, reason)` takes one engine, so it cannot say "everywhere but WebKit". `notIn(engine, reason)` sits beside it in `022`'s `tests/e2e/engines.ts`. It skips in that engine with the reason, and each call is listed in `ENGINE_ONLY` (data in `tests/e2e/engine-only.ts`), which `022`'s `tests/unit/fault-ledger.test.ts` holds in step with the calls.
- **Who adds it first.** The design lead asks `022`'s builder to add `notIn` with `onlyIn`, so `026` and `027` use it from birth (recorded in `022`'s landing notes). `022` is not yet built, and it is one function and its listing. If `022` lands without it, the first of `026`, `027a`, `027b` and `028` to land after `022` adds it, as a lane-E edit.
- **One reason, one vocabulary.** Every forced-colours test that asserts what the mode paints skips WebKit through `notIn("webkit", …)` with `FORCED_WEBKIT_GAP`'s reason and its `gap: "no-user"` mark (decision 13a). Engine-level skips use `notIn`; project-level ones use `onlyProjects` (above), with the same reason and mark for WebKit. At `028`'s landing, these move onto `notIn`, and any ledger line or engine-list line they carried is retired:
  - `026` test 68 ("forced colours draw the edge, and the icons differ"), whose transparent border WebKit leaves unpainted (EXECUTED, *the review*);
  - `027` tests 24 and 40, and test 48's forced-colours half, whose "not emulated" lines have no form under `onlyIn`.
- **What `030` reads.** Every WebKit skip, through `notIn` or `onlyProjects`, carries the `no-user` mark (decision 13a). `firefox-dark` and `webkit-dark` are not in `FORCED_PROJECTS`, so they are not required cells. `030` reads neither as a partial result or a fault, but as **"not applicable in this engine"**. Carbon reads a skipped test as "Partially tested" (`030`'s memo, line 79); Kuiper's status will not, because the reason says the engine has no such mode or repeats another project.
- **Not seen by any engine:** a real Windows contrast theme, an edited palette, Edge. **The owner ruled no CI run for now (Q4, 2026-11-15):** before 1.0, a person runs this check by hand in Edge on Windows with the Aquatic and Desert contrast themes, and the result is recorded in `030`'s report as evidence.

### 16. Failing first, and proven where nothing fails

- On today's tree, the check fails for the 30 failing items (*the memo* §4.2 and "Correction"), in `chromium-light` and `chromium-dark`. Those failures are its first proof. The landing notes list each failing assertion per item.
- **Two kinds fail nowhere today:** focus and icons. Their assertions are proven by mutation, run once and recorded in the landing notes, not committed:
  - the theme's `:focus-visible` outline replaced by `outline: none; box-shadow: 0 0 0 2px var(--ring)` fails A for every item. This was already seen on three items in Chromium and Firefox (*the review*).
  - `text-primary` added to one `<svg>` in `alert` (an icon on an `alert` inside `error-summary`'s example) fails F in Chromium.
- The 16 items that pass today are proven by those two mutations plus one more: `switch`'s new `forced-colors:` classes removed after the build fails B, D and G for `switch` and its composites, and for nothing else.
- **Test 8 is proven against this specification's first draft:** its bare `forced-colors:bg-[ButtonText]` thumb and twelve bare `forced-colors:opacity-100` twins, applied to a scratch copy, fail test 8 thirteen times.

### 17. New items from `026`, `027a` and `027b`

- They land before `028`, each born with its own forced-colours care: `toast`'s painted border and distinct icons (`026` test 68), pagination's bold current page, the tag's check, the progress fill (`027` tests 24, 40, 48).
- `028` adds a case for each. Where the check finds a fault in one, `028` fixes it under decisions 2 to 11, as it does an older item: by then they are existing items in lane I. Their own tests stay, on `notIn` for WebKit (decision 15). `027`'s test 48 ("the 10% and 90% pixels differ") still holds once decision 10 replaces `forced-color-adjust-none`.

### 18. The changelog, and no interface change

- **No interface change.** Classes added under `forced-colors:` change no rule outside the mode. Criterion 9 proves it on the compiled CSS.
- **The 0.13.0 entry gains one bullet per changed item:** "`switch`: drawn under forced colours (system colours for the track, the thumb and the on state); no interface change." About 24 bullets: the 20 own-fault items, `meter`, `progress`, `field` and `label` and `toast`.
- **No section in the upgrade guide.** It holds interface changes (`020` decision 12).
- **`static/r/` is regenerated** at landing, as a ledger file (`roadmap.md` §2). Thumbnails are regenerated; their images are byte-equal to those of the same tree with the `forced-colors:` classes stripped (criterion 9).

### 19. Lane I, its order, and what it shares

`029` builds in the same wave: first in lane T (every colour variable, `data-scheme`), then in lane I (`alert`'s tints, `029` decision 9). `028`'s criteria no longer depend on which lands first: criterion 9 compares compiled CSS on one tree, and G reads its reference colour in the element's own scope.

| With | Order | Shared files |
|---|---|---|
| `023` | `023` first | nearly every item; `028` adds classes beside `023`'s comments |
| `022`'s engine-fault small changes in lane I | in landing order; any that touches a file `028` changes lands first, and `028` rebases | possibly |
| `029`'s lane-T landing | either order. Nothing in `028` reads a token value; G's in-scope probe follows `data-scheme` if it has landed | none |
| `029`'s `alert` edit (lane I) | lane I serialises them; `028` first when both are ready, as wave 2 lists, otherwise landing order | none: `alert` has no forced-colours fault |
| `031b`'s depth lint (lane I, S) | `028` first | `028` adds no alpha of its own. `Highlight` fills are the user's system colours, which some palettes make translucent (decision 2). So `031b`'s runtime depth check runs outside forced colours, or exempts system colours; its static lint already sees no alpha class in `028`'s rules |
| `025`'s cost report | refreshed at landing | every changed item's size hash; each figure may grow by a few bytes of CSS |

### 20. Weight

- **CSS.** About 90 `forced-colors:` classes across 24 items (the stacked forms add some). Tailwind emits each once into the site's one stylesheet, about 5 kB raw and about 1 kB gzipped on every page (INFERRED, at about 60 bytes per rule). The builder measures it.
- **The page's own source.** A component page shows its item's files ("Files you own"). Each changed item's page grows by its new classes, a few hundred bytes gzipped (INFERRED).
- **`024`'s rule** applies: the builder states the cost per template, measured, in the landing notes, and it must fit the headroom `024` sets.

### 21. The site is not changed

- The site's own forced-colours rules stay: `018`'s `forced-colors.spec.ts` (its light-only skip moved onto `onlyProjects`, decision 15), the nav's start border, search's `Mark`, the swatches' `forced-color-adjust-none`, and the theme switch's `SelectedItem`.
- The theme switch's `SelectedItem` is 1.5:1 on Chromium's emulated light `Canvas` (*the memo* §1.3). Bringing it to decision 2's `Highlight` is a small change in lane S, recorded as a follow-up in the landing notes.

## Design

### Per-item fixes

From the audit (*the memo* §4.2 and "Correction") and the source. Every class sits under `forced-colors:` and is **stacked on the variant of the class it overrides** (decision 2). Classes are what the builder starts from; the check, not the class list, is the criterion.

| Item | Fault, seen | Fix (decision) |
|---|---|---|
| `switch` | track and thumb vanish; on and off identical | track `border` (7); `data-checked:bg-[Highlight]` (4); thumb `data-unchecked:bg-[ButtonText]`, `data-checked:bg-[HighlightText]`, `data-checked:translate-x-[calc(8*var(--spacing)-2*var(--line-width))]` (5, 7); `data-disabled:opacity-100`, track `data-disabled:border-[GrayText]`, thumb `data-disabled:bg-[GrayText]` (9) |
| `radio-group` | no radio looks selected | dot `bg-[Highlight]` (bare, as its `bg-primary` is) (5); `group-aria-[invalid=true]/radio-group:border-(length:--focus-width)` (8); `disabled:opacity-100 disabled:text-[GrayText] disabled:border-[GrayText]`, dot `GrayText` under the item's disabled state (9) |
| `toggle` | pressed and unpressed identical | `data-[state=on]:bg-[Highlight] data-[state=on]:text-[HighlightText]` (4); `disabled:` twins (9) |
| `toggle-group` | the same, per item | the same, on its items (4, 9) |
| `tabs` | the active trigger cannot be told apart, both variants | `data-active:bg-[Highlight] data-active:text-[HighlightText]` (4); the line variant's reserved bottom edge `Canvas`, active `Highlight` (6); `disabled:` twins (9) |
| `checkbox` | invalid looks valid; disabled faded | `data-checked:` and `data-[state=indeterminate]:` `bg-[Highlight]` and `text-[HighlightText]` (4); `aria-invalid:border-(length:--focus-width)` (8); `disabled:` and `group-has-disabled/field:` twins (9) |
| `input`, `textarea` | invalid looks valid; disabled faded | `aria-invalid:border-(length:--focus-width)` (8); `disabled:` twins (9) |
| `native-select` | the same | its `aria-invalid` form of 8; `has-[select:disabled]:` twins (9) |
| `input-group` | invalid looks valid; the addon fades | its `has-[[aria-invalid=true]]` form of 8; `group-data-[disabled=true]/input-group:` twins (9) |
| `input-otp` | active slot and fake caret lost; invalid by colour; disabled faded | active slot `data-[active=true]:border-[Highlight]` (8); caret `bg-[CanvasText]` (5); its `has-[input[aria-invalid=true]]` form of 8's width; `has-disabled:` twins (9) |
| `sidebar` | every row carries the current mark | default variant `border-s-[Canvas]`; current `aria-[current=page]:border-s-[Highlight] aria-[current=page]:font-bold`, both variants (6); `disabled:` and `aria-disabled:` twins on its menu and sub buttons (9) |
| `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu` (and its sub-content), `tooltip` | no edge | `border-(length:--focus-width)` on the content element (10, Q2); `dropdown-menu`'s items' `data-disabled:` twins (9) |
| `button` | disabled faded | `disabled:` and `aria-disabled:` twins (9) |
| `accordion` | disabled faded | the trigger's `disabled:` twins (9) |
| `meter` | the track vanishes in Chromium; the bar vanishes in Firefox | track `border bg-[Canvas]` (7); fill pseudo-elements `bg-[CanvasText]` (5) |
| `progress` (`027a`) | kept in brand colours by `forced-color-adjust-none` | that class removed (10); track and fill as `meter`'s (5, 7) |
| `field`, `label` | a disabled control's label fades | their `group-data-[disabled=true]/field:`, `group-data-[disabled=true]:` and `peer-disabled:` twins (9) |
| `toast` (`026`) | none found yet; its 1 px edge reads as a control's | `border-(length:--focus-width)` (10; the owner, Q2) |
| `breadcrumb`, `theme`, `error-summary`, `live-console`, `product-home`, `settings`, `sign-in`, `sign-up`, `app-shell`, `marketing-bar` | inherited | none in their own source (14) |

### Files

- **Changed, lane I:** the source of the 20 own-fault items above, `meter`, `field`, `label`, `026`'s `toast` (its 2 px edge, Q2) and `027a`'s `progress`; their `registry.json` entries' content and `static/r/` regenerated at landing.
- **New, tests:** `tests/status/interactive.ts` (the interactive derivation, `FORCED_CHECKED`, `FORCED_PROJECTS` and `FORCED_WEBKIT_GAP`, decision 13a), `tests/e2e/forced/cases.ts`, `tests/e2e/forced/items.spec.ts`, `tests/e2e/forced/pixels.ts` (the in-page decoder and the pixel diff), `tests/unit/forced-items.test.ts`, `tests/unit/forced-twins.test.ts`, `tests/unit/forced-css.test.ts`.
- **Changed, tests and scripts:** `scripts/lint-literals.ts` (L25, L26) and `tests/unit/literals.test.ts`; `tests/e2e/engines.ts` (`notIn` and `onlyProjects`, if no earlier spec added them) and `tests/e2e/engine-only.ts` (their entries, with the WebKit gap mark); `tests/e2e/forced-colors.spec.ts`, `026`'s and `027`'s spec files (onto `notIn`, decision 15).
- **Changed, ledgers:** `CHANGELOG.md` (decision 18), `static/r/`, thumbnails; `tests/fault-ledger.ts` (lines retired, decision 15).

## Scope

**In:**

- Decisions 1 to 21.
- Every item in decision 1, checked, with its reachable states driven; every fault the check finds in them, fixed in their own source.
- `tests/status/interactive.ts`, the module `030` imports: the interactive set, the checked set, the forced-colours projects and the WebKit gap mark (decision 13a).

**Out:**

- Hover. The mode drops `hover:bg-accent`; hover is not a WCAG requirement (*the memo* §7).
- Ratios against a palette (decision 13).
- The site's chrome (decision 21).
- `chart`'s series colours (`038`); `skeleton` (decision 1).
- A forced-colours view on each component page, as Spectrum promises (*the memo* §2). That is page-standard work (`032`).
- High contrast (`031`). It is `prefers-contrast: more`, a different signal, with Kuiper's own colours.

## Tests written first

Each is written and seen failing before the code it checks. The landing notes say how each failed.

1. **`tests/unit/forced-items.test.ts`: "every interactive item has a forced-colours case".** Imports `interactiveItems` and `FORCED_CHECKED` from `tests/status/interactive.ts` (decision 13a). `FORCED_CHECKED` equals the interactive set plus `meter` and `progress`, and equals the names in `cases.ts`. Every WebKit entry of a forced-colours test in `ENGINE_ONLY` (`tests/e2e/engine-only.ts`) carries `FORCED_WEBKIT_GAP`, and the draw and compute tests' `onlyProjects` lists equal `FORCED_PROJECTS`. Each interactive item is in `cases.ts`; `meter` and `progress` are; every other item is in `EXCLUDED` with a non-empty reason; no name is in both. A case whose item depends on an item with `roles` declares a driven state or a reason. On today's tree it derives the 46 of *the memo* §4.1 (the builder pins the count on the tree `023` leaves). Fails today: no module.
2. **`tests/unit/literals.test.ts`: "L25: a system colour only under forced colours, and only from the role list".** `forced-colors:bg-[Highlight]`, `forced-colors:data-unchecked:bg-[ButtonText]`, `forced-colors:disabled:text-[GrayText]` pass. `bg-[Canvas]`, `hover:text-[CanvasText]`, `forced-colors:bg-[SelectedItem]`, `forced-colors:text-[WindowText]` and `forced-colors:bg-[Mark]` fail L25. Fails today: all pass (*the memo* §4.3).
3. **`tests/unit/literals.test.ts`: "L26: no forced-color-adjust-none in an item".** Fails in an item file; the same class in a site file is not linted. Fails today: it passes.
4. **`tests/e2e/forced/items.spec.ts`, "<item> under forced colours: focus, state and edges are drawn"**, one per checked item. Seen failing today in `chromium-light` and `chromium-dark` for the 30 failing items, each with the assertion *the memo* predicts:
   - B for `switch`, `radio-group`, `toggle`, `toggle-group`, `tabs`, `input-otp`, `error-summary`, `live-console`, `product-home`, `settings`;
   - C for `sidebar`, the invalid five, `error-summary`, `sign-in` and `sign-up`;
   - D for `switch`, the six overlays, `breadcrumb`, `theme`, `settings`, and `app-shell` and `marketing-bar` at 390;
   - E for the twelve.
   Passing today for the 16 others, which decision 16's mutations then fail.
5. **`tests/e2e/forced/items.spec.ts`, "<item> under forced colours: its rules compute"**, one per item with a `roles` list. Fails today for every such item: no rule exists.
6. **`tests/unit/forced-css.test.ts`: "nothing changes outside the mode".** For each changed item, its class candidates are compiled twice with Tailwind's `compile` from `@tailwindcss/node`, the compiler the pinned `@tailwindcss/vite` 4.3.3 already brings (as the review's probe did): once as they are, and once with every `forced-colors:` token removed. Every rule outside `@media (forced-colors: active)` is identical between the two. It does not depend on what else has landed, so `029`'s lane-T landing cannot make it red. As a second check, `items.spec.ts` photographs each changed item's stages with forced colours off, on the same tree, with and without the `forced-colors:` tokens stripped from the DOM: identical. Fails first on a scratch class that leaks (`hover:bg-[Highlight]` beside its forced form). If the builder judges the transitive import unsafe, `@tailwindcss/node` is named in `package.json` at `bun.lock`'s version, which is a dev dependency and needs the design lead's ruling.
7. **`022`'s `tests/unit/fault-ledger.test.ts`, extended:** it already holds `ENGINE_ONLY` and the `onlyIn` calls in step (`022` test 7). It now holds every `notIn` and `onlyProjects` call too, with its reasons, read from `tests/e2e/engine-only.ts`, including the moved tests of decision 15. Fails today: neither helper exists.
8. **`tests/unit/forced-twins.test.ts`: "a forced-colours class carries the variant it overrides".** Reads every checked item's class strings with the lint's `classTokens`, as the lint does. Two rules:
   - for each `forced-colors:` class setting a property (background, text colour, border colour or width, opacity, font weight, translate), every non-forced class in the same string that sets that property under a state variant has a forced twin on the same variant (variant order ignored);
   - every `<variant>:opacity-50` in a checked item, or in `field` or `label`, has `forced-colors:<variant>:opacity-100`.
   Seen failing on a scratch copy of the first draft's classes: the switch thumb's bare `bg-[ButtonText]` beside `data-unchecked:bg-card`, and the twelve bare `opacity-100` twins (decision 16). Fails today: no module.

## Acceptance criteria

1. **The list.** Test 1 passes: every interactive item has a case, and `EXCLUDED` holds every other item with a reason. 54 of 82 items are checked at landing, 28 excluded (decision 1); the landing notes give the counts from the tree. (unit)
2. **Drawn, in Chromium.** Test 4 passes for every checked item in `chromium-light` and `chromium-dark`, with every case's states driven. (e2e)
3. **Drawn, in Firefox.** Test 4 passes for every checked item in `firefox-light`, at the 150 threshold, or the failure is in `022`'s fault ledger with a small change. (e2e, CI)
4. **The rules compute.** Test 5 passes in `chromium-light`, `chromium-dark`, `firefox-light` and `webkit-light`, with every reference colour read beside its element. (e2e)
5. **WebKit's gap is counted.** Test 4 is skipped in `webkit-*` and `firefox-dark`, and test 5 in `webkit-dark` and `firefox-dark`, through `onlyProjects`, with decision 15's reasons. `018`'s `forced-colors.spec.ts` runs through `onlyProjects(["chromium-light", "firefox-light", "webkit-light"], "light schemes only")`; `026` test 68 and `027` tests 24, 40 and 48's forced half skip WebKit through `notIn`. They are listed in `ENGINE_ONLY`, test 7 passes, and no ledger or engine-list line remains for them. (unit, e2e)
6. **The lint.** Tests 2 and 3 pass. The literal lint reports 0 violations over every item; its totals change only by L25 and L26 existing. `027a`'s `forced-color-adjust-none` is gone. Constitution §4.3, its Status line and `AGENTS.md` carry decision 12's three texts verbatim. (unit, lint, review)
7. **Twins.** Test 8 passes. (unit)
8. **Icons.** No `text-*`, `fill-*` or `stroke-*` colour class sits on an `<svg>` or an icon component in any item (decision 11). (review; test 4's F)
9. **Nothing changes outside the mode.** Test 6 passes for every changed item, both its compiled-CSS comparison and its same-tree screenshots in `chromium-light` and `chromium-dark`. Regenerated thumbnails are byte-equal to those of the same tree with the `forced-colors:` tokens stripped. (unit, e2e)
10. **Proven where nothing failed.** Decision 16's three mutations, and test 8's draft-classes proof, were run; each failed what it should and nothing else; the landing notes give the runs. (checkpoint)
11. **Composites.** `breadcrumb`, `theme`, `error-summary`, `live-console`, `product-home`, `settings`, `sign-in`, `sign-up`, `app-shell` and `marketing-bar` pass test 4, with their reachable states driven, and no change to their own source. (e2e)
12. **The new items.** `toast`, `link`, `button-group`, `progress`, `pagination`, `search-field` and `tag` pass test 4; `026` test 68 and `027` tests 24, 40 and 48 still pass, in Chromium and Firefox. (e2e)
13. **Declared for the status.** Every generated test in `items.spec.ts` declares `item` and `check: "forced-colors"` in its details, and they appear in `playwright test --list --reporter=json`. Every skip carries a reason. (unit, review)
14. **The changelog.** One bullet per changed item, in decision 18's form; no upgrade-guide section. (unit: `registry.test.ts`'s changelog checks)
15. **Weight.** The landing notes give the CSS and per-page cost, measured, per template, within `024`'s headroom. `025`'s report is refreshed; no item exceeds its budget. (perf, cost run)
16. **The suites.** `bun run test:unit`, `bun run test:e2e`, `bun run test:smoke`, `bun run check`, `bun run lint`, the literal lint and the release check pass. (all)
17. **The checkpoint.** The design lead looks at every changed item under forced colours in Chromium, light and dark, at 1440: the switch on and off, a selected radio, a pressed toggle, the active tab in both variants, the current sidebar row in both variants, an invalid field, an invalid OTP with its active slot, a disabled control, each overlay open, the meter and the progress bar. And at least `switch`, `radio-group`, `tabs`, `meter` and `dialog` in Firefox, and `sign-in` after an empty submit and `app-shell`'s sheet at 390. (checkpoint)
18. **The scorecard.** `kuiper.ts --rev` is run; criterion (e) of row 3 is marked; the run log has a row; the change review cites it. (measure)

## Build order

1. **Confirm the tree.** `023`, `026`, `027a` and `027b` landed; whether `022` has, and whether it carries `notIn`; whether `029`'s lane-T landing has. Pin the derived count of interactive items. Re-run the audit's readings, with states driven, through test 4, and compare with *the memo* §4.2 and "Correction". A difference is recorded, and the table follows the tree.
2. **Tests first.** Write tests 1 to 8. See 1, 2, 3, 5, 7 and 8 fail, 6 fail on its scratch leak, and 4 fail for the 30 items.
3. **The lint.** L25 and L26, until tests 2 and 3 pass. Run the literal lint over the tree: it must report `027a`'s `forced-color-adjust-none` and nothing else. Decision 12's three texts go into the constitution and `AGENTS.md` in the landing commit.
4. **The items,** in the order of the fixes table, until tests 4, 5, 6 and 8 pass in Chromium.
5. **Checkpoint** (criterion 17).
6. **Firefox,** `test:e2e:engines` locally. A fault seen only in Firefox is fixed here if it is in an item `028` changes, or ledgered with a small change otherwise (`022` decision 16).
7. **`notIn` and `onlyProjects`.** Add them, and their entries in `tests/e2e/engine-only.ts`, if no earlier spec did. Move `018`'s, `026`'s and `027`'s forced-colours tests onto them; retire their lines.
8. **The mutations** of decision 16. Recorded.
9. **Ledgers,** in landing order: `registry.json`, the changelog, `static/r/`, thumbnails; `025`'s report.
10. **The change review,** then the landing, then the scorecard (criterion 18).

## Predicted scorecard movement

- **Row 3, accessibility evidence, criterion (e) "forced-colours rules across the interactive components": – → ✓.** Kuiper would have system-colour rules in 24 items and a rendered check over all 54 checked items. Carbon earns (e) with its mixin in 30 of 91 style folders and GOV.UK with 8 of 43 components (scorecard row 3); none renders its components under the mode in a test (*the memo* §2).
- **The row's score.** Today's count is 2, (a) and (g): score 1. `022`'s recorded screen-reader run adds (h) in wave 1, for 3: still 1. `028` adds (e), for 4: **score 2** (anchors: 4–5 → 2). If `028` lands before `022`'s run is recorded, the count is 3 and the score stays 1 until it is.
- **`kuiper.ts`'s `forcedColorsRulesItems`** goes from 0 to about 24 files.
- **Rows 1 to 14 total:** +1 on row 3. No other row moves. `030` then publishes the per-item result, for (d).

## Risks

- **The emulation is not Windows.** The check reads the engines' own palettes (*the memo* §5). A real contrast theme could show a fault none of them does, such as a `Highlight` fill that matches a theme's `Canvas`. The owner accepted this until the manual Edge run before 1.0 (Q4).
- **Firefox differs in degree.** It paints `<button>` grounds `ButtonFace`, a light grey, so today's switch thumb and pressed toggle show at about 1.2:1 there (*the memo*, "Correction"). The 150 threshold keeps that from passing B. A Firefox-only fault may be ledgered under criterion 3; a ledgered line blocks the tag (`022` Q3).
- **Pixel thresholds.** A 32-pixel state change at a 150 channel sum, and a perimeter-sized focus change, separate the readings measured. A smaller control could sit near them. Each case may raise its own threshold, never lower it, and says why.
- **A missed variant.** A state class added to an item later, with no forced twin, would lose the cascade again. Test 8 fails it in the unit suite, before any browser runs.
- **bits-ui markup.** A state the check drives through bits-ui could move to another element in a bits-ui update. The case's selectors are the place to fix it.
- **Weight.** If `024`'s component headroom is spent by `023`, about 1 kB more per page needs a ruling (`024`).

## Open questions for the owner

None. The owner answered Q1 to Q4 on 2026-11-15; the questions and answers are in the Landing notes, and each answer is in the decision it shapes (decisions 9, 10, 12 and 15).

## Review

The review, [`../reviews/028-forced-colours-spec-2026-11-15.md`](../reviews/028-forced-colours-spec-2026-11-15.md) (2026-11-15), approved with changes: 16 findings, 1 High, 7 Medium, 8 Low. Each is answered here.

1. **Accepted (High).** The specificity rule is stated in decision 2. Every fix in decisions 4 to 10 and the fixes table is stacked on the variant of the class it overrides. Test 8 checks it in source and would have caught the first draft's switch thumb and twelve disabled twins. G has a role for each disabled form.
2. **Accepted (Medium).** `font-bold` (700, a token weight) replaces weight 600, in decisions 2 and 6 and the table, as `027`'s pagination does.
3. **Accepted (Low).** The switch keeps `p-1` and shortens its travel with `translate-x-[calc(8*var(--spacing)-2*var(--line-width))]`, which passes the lint (decision 7). D2 checks the thumb lies inside the track's padding box.
4. **Accepted (Medium).** A pixel counts as changed above a 150 channel sum, for A and B (decision 13). The memo's correction records Firefox's 1.2:1 thumb and toggle.
5. **Accepted (Medium).** Each case drives its reachable states (decision 13). The 20 passes were re-audited with forms submitted, sheets and menus opened, at 1280 and 390. Four were false: `sign-in`, `sign-up`, `app-shell` and `marketing-bar` (*the memo*, "Correction"). They join decision 14, test 4 and criterion 11. Test 1 requires a driven state or a reason.
6. **Accepted (Medium).** Criterion 9 is now a compiled-CSS comparison on one tree (test 6), with same-tree screenshots as the second check. G reads its reference colour from a probe beside the element. Decision 19 orders `028` against `029`'s lane-T landing and its `alert` edit.
7. **Accepted (Medium).** `notIn` sits in `022`'s `tests/e2e/engines.ts`. The design lead asks `022`'s builder to add it; failing that, the first of `026`, `027a`, `027b` and `028` to land after `022` adds it. `018`'s `forced-colors.spec.ts`, `026` test 68 and `027` tests 24, 40 and 48 move onto it with one reason (decision 15). The WebKit wording is corrected: it emulates the media query and repaints nothing.
8. **Accepted (Medium).** Q1's option 1 now amends §4.3 itself, noted in the Status line, with `AGENTS.md` mirroring it. L25's allowance waits on the answer (decision 12).
9. **Accepted (Low).** Decision 2 and decision 19 no longer call `Highlight` fills opaque. `028` adds no alpha; `031b`'s runtime check runs outside the mode or exempts system colours.
10. **Accepted (Low).** E also checks a disabled element's border colour and declared marks (decision 13).
11. **Accepted (Low).** `border-s-[Canvas]` goes on the default variant only; the outline variant keeps its start edge, and D reads it (decision 6).
12. **Accepted (Low).** The OTP's active slot takes a `Highlight` edge; invalid keeps the width (decision 8).
13. **Accepted (Low).** Q2 cites Microsoft's 2 px and Carbon's 1 px, and no longer ties the bar to the overlays. Decision 10 now carries the 2 px recommendation for the overlays and the toast, with the bar unchanged. It remains the owner's call.
14. **Accepted (Low).** 82 items at landing, 54 checked, 28 excluded; test 1 derives the numbers. The path is `src/lib/site/chrome/side-nav.svelte:68–69`.
15. **Accepted (Low).** `item` and `check` are declared in each generated test's details. The `notIn` and `firefox-dark` skips carry reasons `030` reads as "not applicable in this engine" (decision 15, criterion 13).
16. **Accepted (Low).** The memo's correction records that Firefox's meter vanishes too. The design does not change; decisions 5 and 7 fix both engines.

## Landing notes

Not yet landed.

### The owner's answers (2026-11-15)

The questions were asked with options, the recommended one first. The owner chose the recommended option each time.

- **Q1. May an item name a system colour under forced colours, given constitution §4.3?** Option 1: amend §4.3 with one clause, noted in its Status line; `AGENTS.md` mirrors it; L25 enforces it. The exact texts are in decision 12. The builder applies them verbatim at landing; the constitution is not edited before then. The options not taken: system-colour roles as tokens; every forced-colours rule in the theme.
- **Q2. How wide is a transitory layer's edge under forced colours?** Option 1: 2 px (`--focus-width`) on the six overlays (`dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip`) and on `toast`. The glass bar is unchanged, at 1 px. `026`'s toast is built with its 1 px edge and takes the 2 px edge under forced colours when `028` lands (decision 10). Not taken: 1 px everywhere.
- **Q3. Disabled controls under forced colours: `GrayText` at full opacity?** Option 1: yes, across the 17 items (decision 9). Not taken: the engine's `GrayText` at half opacity.
- **Q4. Should a real Windows contrast theme be checked?** Option 1: not now. Chromium and Firefox emulation gate every run. Before 1.0, a person runs the check by hand in Edge on Windows with the Aquatic and Desert contrast themes, and the result is recorded in `030`'s report as evidence (decision 15). Not taken: a CI job on `022`'s Windows runner; never.

Also recorded from `030`'s re-review (R1, R7), 2026-11-15: project-level skips go through `onlyProjects(projects, reason)` in `022`'s `tests/e2e/engines.ts`, and `ENGINE_ONLY`'s data lives in `tests/e2e/engine-only.ts` (decision 15).
