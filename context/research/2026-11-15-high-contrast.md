# High contrast: prior art, engines, and Kuiper's swatches

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** the spec author for `031`, at the design lead's request.
- **Question:** How do the reference systems do high contrast, how is a high-contrast palette measured, which engines honour `prefers-contrast`, and what would Kuiper's high-contrast primitives be?
- **What would answer it:** the prior-art clones, the web-features data, three engines run, and a derivation of the swatches over Kuiper's token file.
- **What it blocks:** [`031`](../specifications/031-high-contrast.md).
- **Stands on:** [scoped schemes and contrast](2026-11-15-scoped-schemes-and-contrast.md) (cited as *scoped* §n), with its §§9–11; [the Primer memo](2026-11-15-prior-art-primer.md); [forced colours](2026-11-15-forced-colours.md).

## How to read this memo

- **READ:** a file says so, read on 2026-11-15. Prior-art paths are under `context/prior_art/`, at the commits in its README.
- **EXECUTED:** run on 2026-11-15, in the session scratchpad and in this memo's folder, on the repository's Playwright 1.64.1 (Chromium, Firefox, WebKit) and Bun 1.4.4. Nothing in the repository was built or changed.
- **CITED:** a web page, read on 2026-11-15.
- **INFERRED:** our reasoning.

Terms. **High contrast** here is Kuiper's own colours, raised to stronger ratios, chosen by `prefers-contrast: more` or by hand. **Forced colours** is a different mode: the browser replaces the page's colours with the user's palette (`028`). A **swatch** is one proposed primitive. **AAA text** is WCAG 1.4.6: 7:1, or 4.5:1 for large text.

## 1. What the references do

**Primer: whole themes, new hue scales, measured in CI.**

- High contrast is a theme name, not a mode: `light-high-contrast`, `dark-high-contrast`, `dark-dimmed-high-contrast`, and colour-blind forms of each (READ, `primer-primitives/scripts/themes.config.ts`, 14 themes).
- Each high-contrast theme reads the base scale file, then an override file: `src/tokens/base/color/light/light.high-contrast.json5` is marked `@extends ./light.json`. It restates eight hue scales and `black`: blue, green, yellow, orange, red, purple, pink, coral. It does not restate the neutrals (READ).
- Roles move by per-theme overrides in `$extensions["org.primer.overrides"]`. `borderColor.default` is `neutral.6` in light and `neutral.10` in every high-contrast theme (READ, `src/tokens/functional/color/borderColor.json5`). `bgColor.default` is `neutral.0` with no high-contrast override, so the page ground does not change (READ, `bgColor.json5`).
- Overlays gain a solid edge: the high-contrast shadow is `overlay.borderColor` at alpha 1, zero offset (READ, `src/tokens/functional/shadow/shadow.json5`, 9 high-contrast entries).
- **How it is measured.** `scripts/colorContrast.config.ts` sets `default: { text: 4.5, border: 3 }` and `highContrast: { text: 7, border: 4.5 }` (READ, lines 20–30). Every high-contrast theme takes the same pair list as the default themes, at the higher ratios (lines 275–298). The `border` class is control edges, such as `control-borderColor-emphasis` on `bgColor-default` and `bgColor-muted` (lines 131–132), and the display colours' emphasis borders. A translucent colour is composited onto its ground first (READ, `scripts/colorContrast.ts`). CI posts a failure table on any token pull request (READ, the Primer memo).
- No `prefers-contrast` rule anywhere (READ, *scoped* §2; EXECUTED again, grep). GitHub's user setting chooses the theme.

**Carbon: high contrast means forced colours, plus a dotted focus.**

- Its `high-contrast-mode` mixin is `forced-colors` (READ, *scoped* §2).
- **A correction to *scoped* §2.** Carbon does read `prefers-contrast`, in its boolean form, in three style files. `utilities/_focus-outline.scss` turns every focus outline `dotted` under `@media screen and (prefers-contrast)` (lines 19, 33, 42, 51). `utilities/_tooltip.scss` line 71 and `components/select/_select.scss` line 175 add a transparent border under `(-ms-high-contrast: active), (prefers-contrast)` (EXECUTED, grep; READ). No colour token changes with it. *Scoped* §2's "None follows `prefers-contrast` with a colour set" still holds.

**Spectrum: contrast is an axis in the data, with no values yet.**

- `packages/design-data/mode-sets/contrast.json` declares modes `regular` and `high`, default `regular`, "Accessibility contrast level" (READ). No token sets `contrast: high` (*scoped* §2, EXECUTED). It is the only reference that models contrast as its own axis beside the scheme.

**GOV.UK: one scheme, built strong.**

- One palette, no high-contrast theme and no `prefers-contrast` rule (EXECUTED, grep of `govuk-frontend/packages`). Text is `black` `#0b0c0c` on white; secondary text `black tint-25` `#484949`; the link `blue shade-10` `#1a65a6` (READ, `src/govuk/settings/_colours-functional.scss`, `_colours-palette--internal.scss`).
- Focus is a yellow fill under black text with a black bar, and a transparent outline so forced colours draw one (READ, `helpers/_focused.scss`). Forced-colours rules sit in 8 components (*scoped*, scorecard row 3).

**Radix Themes: a per-component prop, not a scheme.**

- `highContrast` is a boolean prop on 16 components (EXECUTED, grep of `*.props.tsx`). It swaps the accent to step 12 of the scale: `.rt-high-contrast { background-color: var(--accent-12); color: var(--gray-1) }` (READ, `components/_internal/base-button.css` line 140). No `prefers-contrast`, no contrast theme (EXECUTED, grep).

**What they agree on** (INFERRED). The two systems with a contrast scheme (Primer; Material's generator, *scoped* §2) keep the page ground and raise the hues and the borders. Primer raises borders for control edges to 4.5:1, and all its default borders to a dark neutral. Nobody changes the scheme switch's shape for contrast: Primer makes more themes, Spectrum a second axis. None follows `prefers-contrast` with colours, so following the reader's setting would put Kuiper ahead.

## 2. Engines

- **`prefers-contrast` is Baseline widely available, since 2024-11-30.** Chrome 96, Edge 96, Firefox 101, Safari 14.1 (CITED, [web-features explorer, `prefers-contrast`](https://web-platform-dx.github.io/web-features-explorer/features/prefers-contrast/)). Newly available with Firefox 101, 2022-05-31. So every engine that has `light-dark()` (Safari 17.5, Firefox 120, Chrome 123) has it, and so does the whole of `029`'s fallback range, Safari 16.4 to 17.4 (INFERRED).
- **Values.** `no-preference`, `more`, `less`, `custom`. `custom` "will match the color palette specified by users of `forced-colors: active`" (CITED, [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)).
- **Under forced colours a real engine also matches `more` or `less` when it can tell.** Media Queries 5: with `forced-colors: active`, the user agent "must also match one of `prefers-contrast: more` or `prefers-contrast: less` if it can determine" the palette's contrast, "and `custom` otherwise" (CITED, [Media Queries 5 §12.3](https://drafts.csswg.org/mediaqueries-5/#prefers-contrast)). So a Windows high-contrast theme can switch on both Kuiper's high contrast and `028`'s rules at once (INFERRED).
- **Playwright emulates the two independently.** With `forcedColors: "active"` and `contrast: "no-preference"`, all three engines matched `no-preference` and no other value (EXECUTED, `forced-mq.mjs`, output in the scratchpad's `031/forced-mq-out.txt`). A test that stands for a Windows contrast theme must set both.
- **macOS's "Increase contrast" is `prefers-contrast: more`** (*scoped* §3; `028`'s memo §1.1). Third-party guides say switching it on also reduces transparency (CITED, [AbilityNet, macOS 14](https://mcmw.abilitynet.org.uk/how-to-increase-the-contrast-of-your-display-in-macos-14-sonoma)), and an Apple Community answer says Reduce transparency cannot be turned off while it is on (CITED, [discussions.apple.com 256139784](https://discussions.apple.com/thread/256139784), user-contributed). Apple's own help describes the two settings separately (CITED, [support.apple.com unac089](https://support.apple.com/guide/mac-help/unac089)). Not confirmed by us.
- **The model, in three engines: 0 mismatches in 27 runs** (EXECUTED, [`2026-11-15-high-contrast/engines.mjs`](2026-11-15-high-contrast/engines.mjs), output [`engines-out.txt`](2026-11-15-high-contrast/engines-out.txt)). A fixture held `029`'s shape for one text role and the glass tint: pairs on `:root`, the `.dark` alias restating them, `data-scheme` rules, the scope rule's restoration from a `--surface-*` copy, a field that resets the role, and `029`'s hex fallback. High contrast was two blocks inside `@supports (color: light-dark(#000, #fff))`:

  ```css
  html[data-contrast="more"], html[data-contrast="more"] .dark { /* HC pairs */ }
  @media (prefers-contrast: more) {
    html:not([data-contrast="standard"]), html:not([data-contrast="standard"]) .dark { /* HC pairs */ }
  }
  ```

  and two hex sets in the fallback, keyed on the attribute. Read at six places (the root, a dark scope, a light scope in it, a `.dark` alias, a light scope in that, and a dark scope inside a field):
  - with the system's `more` and no attribute (scripts off), every place read the high-contrast arm of its own scheme;
  - `data-contrast="standard"` beat the system's `more`;
  - `data-contrast="more"` worked with no system preference, on a light and a dark root;
  - the `--surface-*` copy declared on `:root` followed the root's high-contrast value into the nested scope inside the field;
  - in the emulated fallback (every `light-dark(` renamed, so the positive `@supports` is false), the hex sets gave the same readings.
- **Forced colours over it.** With both emulated, Chromium and Firefox painted system colours everywhere; WebKit, which emulates the query but does not repaint (`028`), painted the high-contrast values (EXECUTED, same file). Nothing conflicted.
- **The CLI recurses into nested at-rules.** shadcn-svelte 1.7.1's `Ts` writes an at-rule's object keys that start with `@` as nested at-rules, so `@supports (…) { @media (…) { … } }` in an item's `css` is written as such (READ, `node_modules/shadcn-svelte/dist/index.mjs`, functions `ws` and `Ts`). Not run through the CLI here; `031`'s smoke test does it.

## 3. Kuiper's high-contrast swatches, derived and measured

**How they were made** (EXECUTED, [`2026-11-15-high-contrast/palette.ts`](2026-11-15-high-contrast/palette.ts), output [`palette.json`](2026-11-15-high-contrast/palette.json)). The script imports `contrastRatio`, `compositeTenths` and `compositeAlphaByte` from `scripts/contrast.ts` and reads `tokens/pluto.tokens.json` with `readTokens`, so every ratio is the repository's own arithmetic: WCAG 2.2, truncated to two decimals.

- **The rule.** Each swatch starts from the primitive its role uses today. It moves in OKLCH lightness alone, in steps of 0.001: darker in light, lighter in dark. Hue is kept; chroma is kept where sRGB allows, and reduced only to stay in gamut. The first step whose ratio reaches the target on every ground the role sits on is the swatch. So each is the least change that passes.
- **Targets** (the owner's rulings, `decisions.md` at `beeb67e`): text 7:1; non-text 4.5:1.
- **Grounds do not change.** Light: paper `#F3F0E8`, raised `#FFFFFF`, wash `#E9E5DB`. Dark: graphite `#16140F`, ink-raised `#221F19`, ink-wash `#2C2821`. Each text swatch is measured on all three; wash and ink-wash bind.
- **A text colour on its own tint** is iterated: the tint is the text colour composited over the card, so it moves with it (`029` decision 10).
- **A role whose primitive already passes keeps it.** So the marks, the grounds, `foreground`, light `chart-1`, `chart-2`, `chart-5`, `destructive-fill`, and dark `caution-text` and every dark chart colour, do not change. Light `chart-3`, `chart-4` and `success-fill` move to existing primitives (`yellow-text`, `green-text`) that pass 4.5:1.

**Result: 25 new primitives. 196 pairs across both schemes, 0 below target** (EXECUTED).

| Scheme | Swatch | From | Hex | On the binding ground | Source there |
|---|---|---|---|---|---|
| light | `ink-soft-more` | `ink-soft` `#505661` | `#444A55` | wash 7.08 | 5.86 |
| light | `blue-more` | `blue` `#2D48D4` | `#2236C3` | wash 7.00 | 5.58 |
| light | `red-more` | `red-text` `#C11E31` | `#99011F` | wash 7.01 | 4.77 |
| light | `green-more` | `green-text` `#007351` | `#01553B` | wash 7.06 | 4.67 |
| light | `yellow-more` | `yellow-text` `#806200` | `#5E4701` | wash 7.02 | 4.55 |
| light | `line-more` | `line-input` `#857E70` | `#6D6659` | wash 4.51 | 3.20 |
| light | `red-tint-more` | `red-more` 10% over raised | `#F5E6E9` | `red-more` on it 7.30 | — |
| light | `green-tint-more` | `green-more` 10% over raised | `#E6EEEB` | `green-more` on it 7.52 | — |
| dark | `paper-soft-more` | `paper-soft` `#A39D90` | `#B9B3A5` | ink-wash 7.01 | 5.43 |
| dark | `blue-lifted-more` | `blue-lifted` `#93B0FF` | `#95B2FF` | ink-wash 7.04 | 6.90 |
| dark | `red-lifted-more` | `red-lifted` `#FF9491` | `#FFA29F` | its tint 7.01; ink-wash 7.62 | 6.90 |
| dark | `green-lifted-more` | `green-lifted` `#60C498` | `#69CDA0` | its tint 7.01; ink-wash 7.56 | 6.87 |
| dark | `paper-line-more` | `paper-line-input` `#7A7366` | `#958E80` | ink-wash 4.50 | 3.12 |
| dark | `red-tint-lifted-more` | `red-lifted-more` 10% over ink-raised | `#382C26` | — | — |
| dark | `green-tint-lifted-more` | `green-lifted-more` 10% over ink-raised | `#293027` | — | — |
| light | `code-violet-more` | `code-violet` `#7032B9` | `#6B2BB3` | paper 7.03 | 6.47 |
| light | `code-blue-more` | `code-blue` `#3350CB` | `#2943BD` | paper 7.00 | 5.85 |
| light | `code-green-more` | `code-green` `#007150` | `#015C41` | paper 7.06 | 5.30 |
| light | `code-yellow-more` | `code-yellow` `#6C5A00` | `#5F4F02` | paper 7.07 | 5.94 |
| light | `code-orange-more` | `code-orange` `#A34D15` | `#863A01` | paper 7.04 | 5.08 |
| light | `code-plum-more` | `code-plum` `#922F6E` | `#8B2968` | paper 7.05 | 6.46 |
| light | `code-red-more` | `code-red` `#B81C2E` | `#A50021` | paper 7.03 | 5.68 |
| light | `code-grey-more` | `code-grey` `#636972` | `#4C515A` | paper 7.00 | 4.86 |
| dark | `code-red-lifted-more` | `code-red-lifted` `#FC8D8A` | `#FF9692` | ink-wash 7.00 | 6.50 |
| dark | `code-grey-lifted-more` | `code-grey-lifted` `#9EA4AE` | `#AEB4BE` | ink-wash 7.03 | 5.84 |

- **Dark yellow needs no swatch:** `yellow-lifted` `#F8D874` is already 10.51 on ink-wash (EXECUTED).
- **Dark code blue:** its derivation landed on `#95B2FF`, the same hex as `blue-lifted-more`. The validator requires unique hexes, so dark `syntax-blue` aliases `blue-lifted-more` (EXECUTED: no other duplicate among the 48 primitives and the 25).
- **The dark tints are at 10%, not today's 20%.** At 20% over ink-raised, a red text colour must lighten to `#FFD2CF` to clear 7:1 on its tint, and green to `#BBE6D3`, which no longer read as red and green. At 10% the lift is small (`#FFA29F`, `#69CDA0`), and the tint is still 1.21:1 from the card (EXECUTED, `tint-probe2.ts`). Over graphite instead, the tint is 1.05 from the card, too close to read (EXECUTED).
- **The scrim.** An overlay's edge under the light scrim (`ink-scrim`, 50%) is 3.59 to 4.29 today. With `ink-scrim-deep` (60%, an existing primitive) it is 5.02 to 5.84. The dark edge, `paper-line-more` under `ink-scrim-deep`, is 5.41 to 5.81 (EXECUTED).
- **Fields.** The legend on its fill today: light field-1 7.02, field-2 5.61, field-3 9.53, field-4 4.96; dark 8.67, 8.67, 13.2, 8.62 (EXECUTED). So only light field-2 and field-4 fall short of 7:1. With `red-more` and `green-more` as their fills they read 8.82 and 8.88. Every other field keeps its fill. (The script also tried every fill at its `-more` swatch; the lowest was 8.80, so nothing is gained by moving the ones that pass.)
- **Glass, made solid:** text on `#FBFAF6` (light fallback) at least 8.43; on ink-raised (dark) at least 7.86 (EXECUTED).
- **Chart distinctness falls in light.** The closest pair of the five chart colours, by OKLab ΔE (`deltaE`, `tests/helpers/colour.ts`'s `deltaEUnder`, Machado 2009): standard light, chart-2/chart-5 under protanopia, 6.8; high contrast light, chart-2/chart-3 (red against `yellow-text`) under deuteranopia, **4.1**. Dark is unchanged at 3.1 (EXECUTED). The book's rule that a yellow series is labelled directly, never colour alone, carries the meaning (READ, `/brand/colour/`, "One yellow, never the only signal").

**The exhibit for the owner:** [`2026-11-15-high-contrast/swatches.html`](2026-11-15-high-contrast/swatches.html), with [`swatches.png`](2026-11-15-high-contrast/swatches.png) (every swatch beside its source, with ratios on each ground) and [`in-use.png`](2026-11-15-high-contrast/in-use.png) (the same small screen in light and dark, standard and more contrast). Written by `exhibit.ts` and `shot.mjs` in the same folder (EXECUTED).

## 4. Weight

The high-contrast CSS, generated from `palette.json` in `029`'s shape (EXECUTED, `bytes.ts` in the scratchpad):

| What | Raw | Gzipped alone | Gzipped, added to today's `src/app.css` |
|---|---|---|---|
| The modern blocks: the attribute rule and the media rule, 32 declarations each | 3,153 B | 584 B | **422 B** |
| + the fallback's two hex sets, with their surface and code copies | 7,000 B | 1,151 B | **785 B** |
| + the glass rule (no backdrop filter under high contrast) | 7,230 B | 1,196 B | **809 B** |

The media rule repeats the attribute rule's declarations, so it costs almost nothing gzipped. The fallback costs about as much as the modern blocks. An estimate on today's file; the builder measures the built CSS (INFERRED).

## 5. What this means for Kuiper

- **Contrast as an attribute on `<html>`, beside `data-scheme`, is Spectrum's axis in CSS, with Primer's measurement.** It follows the reader's setting, which no reference does (INFERRED, §1).
- **The swatches are close to their sources.** The largest move is light red, from L 0.524 to 0.432; dark blue moves by 0.005. The light set reads as the same brand, darker; the dark set barely changes (EXECUTED, §3; see `in-use.png`).
- **Borders are the most visible change:** every hairline becomes an opaque line at 4.5:1, as in Primer's high-contrast themes (§1).
- **Two owner questions follow from the evidence:** whether the glass stays translucent under high contrast (macOS may already reduce transparency there, §2), and whether dividers, not only control edges, rise to 4.5:1 (§1, Primer does both).

No code was copied from prior art. Nothing in the repository was built, installed or changed, except this memo and its folder.
