# 031 — High contrast

- **Status:** Draft, for specification review. Waiting on the owner for the swatches (Q1) and four smaller questions (Q2 to Q5). Not built.
- **Date:** 2026-11-15
- **Author:** the spec author for `031`, for the design lead
- **Kind:** a feature in lane T (tokens, the theme item, the `theme` item). **Interface changes**, all additive; nothing is renamed or removed:
  - `kuiper-theme` gains a high-contrast block on `<html>`, keyed on a new attribute, `data-contrast`, and on `prefers-contrast: more`;
  - under high contrast, `.glass` paints solid, with no backdrop filter;
  - the `theme` item gains a `contrast` store, `CONTRAST_KEY`, `ContrastToggle` and two types, and its head script writes `data-contrast`, so `THEME_SCRIPT` changes value;
  - the token source gains 25 primitives, two override files and two resolver contexts;
  - `kuiper.css` gains the high-contrast block.

  No token is added to the roles; no role's standard value changes. It adds no dependency. Each change has a changelog bullet and a step in the upgrade guide (decisions 17 and 18).
- **Lanes:** T (`tokens/`, `scripts/build-tokens.ts`, `scripts/tokens.ts`, `scripts/contrast.ts`, `src/app.css`, `kuiper-theme`, `theme`). Edits outside lane T, each named in Scope: the site bar and the frame scripts (lane S), the axe suite's high-contrast project (lane E), the docs pages and the Brand colour page (lane S).
- **Written against the names `020`, `021` and `029` leave.** `020` renames the code names, so this says `kuiper-theme`, `kuiper:` keys, the storage key `kuiper-theme` and the upgrade guide at `/changelog/0.13.0/upgrade/`. `021` makes the token source a DTCG 2025.10 resolver set under `tokens/`: `kuiper.tokens.json`, `kuiper.light.tokens.json`, `kuiper.dark.tokens.json`, `kuiper.resolver.json` with one modifier, `scheme`, and `kuiper.contrast.json`; its build lowers them to the `Tokens` object. `029` makes every colour a `light-dark()` pair on `:root`, adds `data-scheme` on any element, keeps `.dark` as an alias until 0.15.0, adds the hex fallback under `@supports not (color: light-dark(#000, #fff))`, the solid tints and `--ink-ground`, and writes `data-scheme` from the head script. Every rule here is written on that tree. The measurements were taken on today's tree, which still says `pluto`; the builder re-pins them. Where `020`, `021` or `029` lands a name this does not foresee, theirs wins, and the landing notes say so.
- **Depends on:** `029` (its pairs, its generator's one-function-per-block shape, its fallback, its head script; decision 16 there leaves this one way in). `028` (forced colours is a different mode; this spec must not disturb its rules, decision 15). `021` (the resolver and `kuiper.css`). `024` (the weight rule, decision 16). Softly `022` (three-engine projects) and `030` (the report picks up this spec's tagged checks).
- **Ships with:** 0.13.0, wave 3 (`roadmap.md` §3). It is "the first spec to slip to 0.14.0 if the lane runs long". Q5 asks the owner to keep it in 0.13.0, for one reason: `THEME_SCRIPT` then changes once in the release, not twice.
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `031`: "`prefers-contrast: more` and a hand setting on `<html>`; text at 7:1; its own primitives, approved by the owner." It moves scorecard row 3 (f) and row 4 from 3 to 4.
- **Design call: the owner's rulings this carries.** Binding. Quoted from the retired `decisions.md` at `beeb67e` (`context/README.md`), entry "Accessibility status, a high-contrast scheme, and scoped schemes", and the roadmap's §6 Q4:
  - "**A high-contrast scheme.** **The owner:** 'yes to high contrast theme.'"
  - It "follows `prefers-contrast: more` and can be set by hand."
  - "**Contrast is set on `<html>` only,** never on a subtree."
  - "High-contrast colours as new shades of the brand's hues, measured to 7:1 and approved by the owner."
  - "Non-text elements reach 4.5:1 in high contrast."
  - "**Transparency always signifies depth.** … Everything inside a layer is on that layer's level" (`019a` decision 3). Decision 9 applies it to the glass.
- **Research it stands on:**
  - [`../research/2026-11-15-high-contrast.md`](../research/2026-11-15-high-contrast.md), cited as *hc* §n: the references, the engines, the swatches and their derivation, the weight. Its folder, [`../research/2026-11-15-high-contrast/`](../research/2026-11-15-high-contrast/), holds the exhibit, the derivation script, its output and the engine probe.
  - [`../research/2026-11-15-scoped-schemes-and-contrast.md`](../research/2026-11-15-scoped-schemes-and-contrast.md), cited as *scoped* §n, with §§9–11: option B, contrast on the root only, the WCAG targets.
  - [`029-scoped-schemes.md`](029-scoped-schemes.md) decisions 1–8, 14 and 16; [`028-forced-colours.md`](028-forced-colours.md); [`021-tokens-for-everyone.md`](021-tokens-for-everyone.md) decisions 2, 7, 11 and 12; [`024-budgets-per-template.md`](024-budgets-per-template.md) decision 5.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md) rows 3 and 4.
- **Measurements made for this specification** are labelled **EXECUTED (031)**: the derivation (`palette.ts`, output `palette.json`), the three-engine probe (`engines.mjs`, output `engines-out.txt`), the forced-colours media probe (`forced-mq.mjs`), the tint probe (`tint-probe2.ts`) and the weight (`bytes.ts`), all in the research folder, run on 2026-11-15 on the repository's Playwright 1.64.1 and Bun 1.4.4. Every ratio is `scripts/contrast.ts`'s own `contrastRatio`: WCAG 2.2, truncated to two decimals.

## Intent

Some readers need stronger contrast than WCAG AA's 4.5:1. They ask for it in their operating system. macOS's "Increase contrast" matches `prefers-contrast: more`, and a Windows contrast theme can match it beside forced colours (*hc* §2). Today Kuiper ignores the request. Of its 36 text pairs (the contrast file's 33, `029`'s two tint pairs, and ink on the caution fill), 21 in light and 10 in dark are below 7:1 (EXECUTED (031); *scoped* §1 counted 23 and 12 of 37 before `029`'s solid tints).

This specification adds a high-contrast form of each scheme. It is Kuiper's own colours, not the system's. Text reaches 7:1 on every ground it sits on (WCAG 1.4.6, AAA). Inputs, borders, focus and edges reach 4.5:1. The page follows the reader's setting, and the reader can set it by hand, on the site and in any app with the `theme` item.

It is a second axis beside the scheme. The scheme is light or dark, and any element can take either (`029`). The contrast is standard or more, and only the whole page takes it.

**Terms of art.**

- **High contrast** (in code, `more`): Kuiper's high-contrast colours, in force on the whole page. **Standard** is today's colours.
- **Forced colours**: the browser's mode that replaces every author colour with the user's palette (`028`). A different mode, with no Kuiper colours at all.
- **The axis**: the attribute `data-contrast` on `<html>`, and the media query `prefers-contrast: more`.
- **An HC pair**: a colour variable's value under high contrast, `light-dark(<HC light>, <HC dark>)`.
- **A swatch**: one proposed high-contrast primitive.
- **The binding ground**: of the grounds a colour sits on, the one where its ratio is lowest.

## The problem, counted

- **No high contrast.** No `prefers-contrast` rule, no contrast attribute, no store (*scoped* §1; the bench's `theming.prefersContrast` reads 0).
- **Below 7:1 text, light** (EXECUTED (031), `palette.json`, with `029`'s tints): `muted-foreground` on `muted` 5.86; `primary` on `muted` 5.58; `destructive` on `muted` 4.77; `success` on `muted` 4.67; `caution-text` on `muted` 4.55; `destructive` on its tint 5.10; `success` on its tint 5.09; and 14 more between 5.03 and 6.48.
- **Below 7:1 text, dark:** `muted-foreground` on `muted` 5.43; `primary`, `destructive` and `success` on `muted`, 6.87 to 6.90; the tints 5.19 to 5.21.
- **Below 4.5:1 non-text:** light `input` 3.20 to 4.02; light `chart-3` 1.76 and 2.01 (an exception today); light `chart-4` and `success-fill` 4.36; dark `input` 3.12 to 3.91; every `border`, an alpha hairline, about 1.23. An overlay's edge under the scrim is 3.59 to 4.29 (light) and 3.74 to 4.02 (dark).
- **Code** (Meridian): light, 14 of 20 syntax pairs below 7:1, the lowest `syntax-grey` on paper (the active line) at 4.86; dark, 4 of 30, the lowest `syntax-grey` on ink-wash (the code ground) at 5.84.
- **Fields:** light `field-2` and `field-4` legends read 5.61 and 4.96 on their fills.
- **The glass is translucent,** so its text's contrast depends on what scrolls under it.

## Decisions

### 1. A second axis, on `<html>` only: `data-contrast`

- **The attribute is `data-contrast`, on `<html>`, with two values: `more` and `standard`.**
  - `more` is the media query's own keyword. `standard` is plain English for "not more"; `no-preference` would read as "the reader has not chosen", which is what an absent attribute means.
  - There is no `less`: Kuiper has no low-contrast scheme. `custom` is forced colours, which `028` owns (decision 15).
  - Any other value matches no rule and does nothing.
- **No attribute means the system's setting.** `@media (prefers-contrast: more)` applies high contrast to an `<html>` without `data-contrast="standard"`. That is a page with scripts off, or an app without the `theme` item.
- **It is honoured on `<html>` alone.** The owner's ruling. And the mechanism needs it: a high-contrast block redeclares roles, because `light-dark()` holds two values, not four (*scoped* §4). Redeclared on a subtree, every copy declared on `:root` (`--surface-*`, `--code-*`) would keep the standard pair: the derived-variable trap. On `<html>`, the copies and the high-contrast roles sit on the same element, so the copies substitute the high-contrast pair (EXECUTED (031), `engines.mjs`: the `--surface-*` copy followed into a scope inside a field).
- **No rule reads `data-contrast` on any other element.** A test holds it (T4).
- *Why a second attribute, not a third and fourth `data-scheme` value:* the scheme can be set on any subtree; the contrast cannot. Folding them into one attribute would offer `data-scheme="dark-more"` on a subtree, which cannot work. Two attributes keep each rule where it holds. Spectrum models the same two axes in its data (*hc* §1).

### 2. How it composes with `light-dark()`

`light-dark()` takes only two values, so the contrast cannot be a third arm. It is a choice of **which pair** each variable holds. The scheme then picks the arm, where each colour is painted, as `029` does.

- **The block, in the theme's CSS and in `kuiper.css`:**

  ```css
  @supports (color: light-dark(#000, #fff)) {
    html[data-contrast="more"],
    html[data-contrast="more"] .dark {
      --muted-foreground: light-dark(#444a55, #b9b3a5);
      --primary: light-dark(#2236c3, #95b2ff);
      /* … the 31 variables of decision 6, each an HC pair … */
    }
    @media (prefers-contrast: more) {
      html:not([data-contrast="standard"]),
      html:not([data-contrast="standard"]) .dark {
        /* … the same 31 declarations … */
      }
    }
  }
  ```

- **Specificity.** `html[data-contrast="more"]` and `html:not([data-contrast="standard"])` are (0,1,1). They beat `:root` and `.dark` (0,1,0) on `<html>`, in any source order. So the CLI's `:root` and `.dark` blocks, and an app's own, may come before or after.
- **Every scope follows without a rule of its own.** A `data-scheme` element redeclares no token (`029` decision 2). It inherits the root's HC pairs and picks its arm. The scope rule's eight restorations read the `--surface-*` copies, which hold HC pairs on `<html>`. So a scope inside a field reads high contrast too (EXECUTED (031)).
- **The `.dark` alias needs its own list item, until 0.15.0.** `.dark` restates every standard pair (`029` decision 4). Without a rule, a `.dark` subtree on a high-contrast page would read standard colours. So each rule lists `… .dark` too, at (0,2,1), which beats `.dark`. Its `--surface-*` copies, restated on `.dark`, then substitute HC pairs (EXECUTED (031): an alias and a light scope inside it both read high contrast). The 0.15.0 alias removal deletes the two `.dark` list items (decision 18).
- **The three legacy selectors need nothing.** They set only the mode's marks and the ink ground (`029` decision 4), and high contrast changes neither (decision 6).
- **The ink surface needs nothing.** It sets only `--background` and the code ground, from the grounds, which high contrast does not change. Its text inherits the root's HC pairs and reads their dark arm.
- **The mode's marks do not change.** They are the logotype's dots, which WCAG 1.4.6 exempts, and they already pass on their grounds (*hc* §3).
- **Why inside `@supports (color: light-dark(#000, #fff))`:** in an engine without `light-dark()` every HC pair is invalid. The `… .dark` item at (0,2,1) would beat the fallback's `html :is(.dark, …)` at (0,1,1), and a `.dark` subtree there would lose its colours. Inside the condition, an older engine ignores the block and uses decision 3's hex sets. In the emulated fallback, all three engines then read the right values (EXECUTED (031)).
- **No `:root` or `.dark` is a selector-list item inside any at-rule** (001 decision 14). The CLI writes `@supports … { @media … { … } }` as nested at-rules (READ, *hc* §2; T12 runs it).
- **The media rule repeats the attribute rule.** Two selectors cannot share one rule across a media query. Gzip removes the repeat almost entirely: the two together cost 422 B (EXECUTED (031), *hc* §4).

### 3. The fallback carries high contrast too

`029`'s fallback serves Safari 16.4 to 17.4, which have `prefers-contrast` (Safari 14.1) but not `light-dark()` (*hc* §2). Without a high-contrast set there, the setting would show "more" and change nothing. So the fallback gains two hex sets, printed after `029`'s two:

```css
@supports not (color: light-dark(#000, #fff)) {
  /* … 029's dark set, light set, root rule, ink and mode rules … */
  html:root[data-contrast="more"]:is(.dark, [data-scheme="dark"]),
  html[data-contrast="more"] :is(.dark, [data-scheme="dark"], .surface-ink) {
    /* the 31 variables as dark HC hexes, then the 8 --surface-* and 16 --code-* copies */
  }
  html:root[data-contrast="more"],
  html[data-contrast="more"] [data-scheme="light"] {
    /* the 31 variables as light HC hexes, then the copies */
  }
}
```

- **Specificity** mirrors `029` decision 6: the dark HC set is (0,3,1) on the root and (0,2,1) below it, so it beats `029`'s dark set; the light HC set (0,2,1) beats `029`'s light set, and loses to the dark HC set on a dark root. A light scope inside a dark one reads light HC by order.
- **The copies are redeclared,** because in the fallback every value is a hex, and a copy is fixed where it is declared (`029` decision 6.1).
- **It keys on the attribute alone.** With scripts on, the head script always writes it (decision 4). With scripts off, `029`'s fallback reads light and standard; this keeps that. An older Safari with scripts off and Increase contrast on reads standard, at AA.
- **Weight:** about 0.36 kB gzipped (EXECUTED (031), *hc* §4). It goes with `029`'s fallback, by the same trigger (`029` Q1).
- Proven by emulation, as `029`'s is (T6).

### 4. The hand setting: storage, the head script, the store, the toggle

- **The key is `kuiper-contrast`.** Values: `more` or `standard`. No key means the system. It is a key of its own, not a second value in `kuiper-theme`, so the theme store's interface and stored values do not change. There is nothing to carry over from `pluto-`: no earlier version stored a contrast.
- **The head script writes the attribute always, before first paint.** It appends, after `029`'s scheme lines:

  ```js
  var more;
  try {
    var c = localStorage.getItem("kuiper-contrast");
    more = c === "more" || (c !== "standard" && matchMedia("(prefers-contrast: more)").matches);
  } catch (e) {
    more = matchMedia("(prefers-contrast: more)").matches;
  }
  root.setAttribute("data-contrast", more ? "more" : "standard");
  ```

  - A stored value other than `more` or `standard` is ignored, and the system decides, as `020` decision 5 validates the theme.
  - *Why always, not only for a stored choice:* the fallback keys on the attribute (decision 3). A page following a system `more` would otherwise read standard in an older Safari.
  - **`THEME_SCRIPT` changes value.** `020` and `029` change it in 0.13.0 too. If this lands in 0.13.0, an app that allows the script by a CSP hash updates the hash once for the release (Q5). An app that passes `nonce` does nothing.
- **The store: `contrast`, in `src/lib/registry/ui/theme/contrast.svelte.ts`.** The same shape as `theme`:
  - `contrast.preference`: `"more" | "standard" | "system"`;
  - `contrast.resolved`: `"more" | "standard"`, the preference, or the system's while it is `system`, from a `MediaQuery("(prefers-contrast: more)")`;
  - `contrast.set(preference)`: stores it; `system` removes the key;
  - `contrast.toggle()`: chooses the opposite of what is in force;
  - an effect writes `data-contrast` on `<html>` from `resolved`; a `storage` listener re-reads the key, so another tab's choice follows.
  - Exports: `contrast`, `CONTRAST_KEY`, `ContrastPreference`, `ResolvedContrast`.
- **`ContrastToggle`, in `contrast-toggle.svelte`.** One pressed button, as `ThemeToggle` is.
  - Named "More contrast"; `aria-pressed` is true when `more` is in force.
  - Its icon is Phosphor's `CircleHalf`, `aria-hidden`. `phosphor-svelte` is already the `theme` item's dependency.
  - `size`: `icon` (48 px, the default) or `icon-sm` (32 px). It states no pressed value before hydration, with `data-ready` set after, as `ThemeToggle` does.
  - A tri-state control (standard, more, system) is an app's to compose from `dropdown-menu` and `contrast.set`, as for the theme.
- **`theme`'s `index.ts`** exports the four new names beside the existing ones. Nothing existing changes.

### 5. The high-contrast primitives

The owner's ruling: "new shades of the brand's hues, measured to 7:1 and approved by the owner." The proposal is 25 swatches. They are shown, each beside its source, in the exhibit: [`swatches.png`](../research/2026-11-15-high-contrast/swatches.png), [`in-use.png`](../research/2026-11-15-high-contrast/in-use.png) and [`swatches.html`](../research/2026-11-15-high-contrast/swatches.html). **Q1 asks the owner to approve them.**

**How each is made** (*hc* §3):

- It starts from the primitive its role uses today.
- It moves in OKLCH lightness alone: darker in light, lighter in dark. The hue is kept, and the chroma too, unless sRGB cannot hold it.
- It stops at the first step of 0.001 that reaches the target on every ground the role sits on, and on its own tint. So it is the least change that passes.
- **Targets:** 7:1 for text; 4.5:1 for non-text.
- **A primitive that already passes is reused, not replaced.** The grounds, the marks, `ink` and `paper` stay. So do light `chart-1`, `chart-2`, `chart-5`, `destructive-fill`, and dark `caution-text` and the dark charts. Light `chart-3`, `chart-4` and `success-fill` move to existing primitives (decision 7).

**The swatches** (EXECUTED (031)). Each ratio is on the binding ground. The full table, on every ground, is in the exhibit and in `palette.json`.

| Scheme | Name | From | Hex | Ratio now | Ratio before |
|---|---|---|---|---|---|
| light | `ink-soft-more` | `ink-soft` `#505661` | `#444A55` | 7.08 on wash | 5.86 |
| light | `blue-more` | `blue` `#2D48D4` | `#2236C3` | 7.00 on wash | 5.58 |
| light | `red-more` | `red-text` `#C11E31` | `#99011F` | 7.01 on wash | 4.77 |
| light | `green-more` | `green-text` `#007351` | `#01553B` | 7.06 on wash | 4.67 |
| light | `yellow-more` | `yellow-text` `#806200` | `#5E4701` | 7.02 on wash | 4.55 |
| light | `line-more` | `line-input` `#857E70` | `#6D6659` | 4.51 on wash | 3.20 |
| light | `red-tint-more` | `red-more` at 10% over raised | `#F5E6E9` | `red-more` on it 7.30 | 5.10 |
| light | `green-tint-more` | `green-more` at 10% over raised | `#E6EEEB` | `green-more` on it 7.52 | 5.09 |
| dark | `paper-soft-more` | `paper-soft` `#A39D90` | `#B9B3A5` | 7.01 on ink-wash | 5.43 |
| dark | `blue-lifted-more` | `blue-lifted` `#93B0FF` | `#95B2FF` | 7.04 on ink-wash | 6.90 |
| dark | `red-lifted-more` | `red-lifted` `#FF9491` | `#FFA29F` | 7.01 on its tint; 7.62 on ink-wash | 6.90 |
| dark | `green-lifted-more` | `green-lifted` `#60C498` | `#69CDA0` | 7.01 on its tint; 7.56 on ink-wash | 6.87 |
| dark | `paper-line-more` | `paper-line-input` `#7A7366` | `#958E80` | 4.50 on ink-wash | 3.12 |
| dark | `red-tint-lifted-more` | `red-lifted-more` at 10% over ink-raised | `#382C26` | `red-lifted-more` on it 7.01 | 5.21 |
| dark | `green-tint-lifted-more` | `green-lifted-more` at 10% over ink-raised | `#293027` | `green-lifted-more` on it 7.01 | 5.19 |
| light | `code-violet-more` | `code-violet` `#7032B9` | `#6B2BB3` | 7.03 on paper | 6.47 |
| light | `code-blue-more` | `code-blue` `#3350CB` | `#2943BD` | 7.00 on paper | 5.85 |
| light | `code-green-more` | `code-green` `#007150` | `#015C41` | 7.06 on paper | 5.30 |
| light | `code-yellow-more` | `code-yellow` `#6C5A00` | `#5F4F02` | 7.07 on paper | 5.94 |
| light | `code-orange-more` | `code-orange` `#A34D15` | `#863A01` | 7.04 on paper | 5.08 |
| light | `code-plum-more` | `code-plum` `#922F6E` | `#8B2968` | 7.05 on paper | 6.46 |
| light | `code-red-more` | `code-red` `#B81C2E` | `#A50021` | 7.03 on paper | 5.68 |
| light | `code-grey-more` | `code-grey` `#636972` | `#4C515A` | 7.00 on paper | 4.86 |
| dark | `code-red-lifted-more` | `code-red-lifted` `#FC8D8A` | `#FF9692` | 7.00 on ink-wash | 6.50 |
| dark | `code-grey-lifted-more` | `code-grey-lifted` `#9EA4AE` | `#AEB4BE` | 7.03 on ink-wash | 5.84 |

- **Fifteen are the brand's four hues and its neutrals** (with the four tints). Ten are Meridian's code hues (decision 11). Dark needs no new yellow: `yellow-lifted` is already 10.51 on ink-wash.
- **The light set reads as the same brand, darker.** The largest move is red, OKLCH L 0.524 to 0.432. **The dark set barely moves:** blue by L 0.005.
- **Dark `syntax-blue` aliases `blue-lifted-more`:** its own derivation gave the same hex, and primitive hexes must be unique (`021` decision 12).
- **The names** end in `-more`, after the attribute's value, so a reader can find every high-contrast primitive by one suffix.
- **In the base file,** each is a `color` token in the `primitive` group, with a `$description` and `$extensions["co.plutosystems.kuiper"]`:
  - `"since": "0.13.0"` (or the release it lands in);
  - `"derived": { "from": "<primitive>", "target": 7 | 4.5, "grounds": ["<primitive>", …], "direction": "darker" | "lighter" }`, or, for the four tints, `029`'s `"composite": { "of", "over", "alpha" }`.
  - If the owner adjusts a swatch by hand (Q1's second option), it carries `"adjusted": "<the owner's words>"` beside `derived`, and the test then checks its target and hue, not its exact hex (T2).
- **The derivation lives in `scripts/contrast.ts`,** as `deriveForContrast(source, grounds, target, direction)`, beside `contrastRatio`. That keeps "one home for the arithmetic" (`tests/unit/colour.test.ts`). The OKLCH conversion it needs is moved there from `tests/helpers/colour.ts`, which then imports it.

### 6. Which roles change, and to what

**Light: 27 roles change. Dark: 17.** Every other role keeps its standard primitive in high contrast.

| Role | Light standard → HC | Dark standard → HC |
|---|---|---|
| `muted-foreground` | `ink-soft` → `ink-soft-more` | `paper-soft` → `paper-soft-more` |
| `primary`, `ring`, `sidebar-primary`, `sidebar-ring` | `blue` → `blue-more` | `blue-lifted` → `blue-lifted-more` |
| `destructive` | `red-text` → `red-more` | `red-lifted` → `red-lifted-more` |
| `success` | `green-text` → `green-more` | `green-lifted` → `green-lifted-more` |
| `caution-text` | `yellow-text` → `yellow-more` | unchanged |
| `destructive-tint` | `red-tint` → `red-tint-more` | `red-tint-lifted` → `red-tint-lifted-more` |
| `success-tint` | `green-tint` → `green-tint-more` | `green-tint-lifted` → `green-tint-lifted-more` |
| `input`, `elevation-line` | `line-input` → `line-more` | `paper-line-input` → `paper-line-more` |
| `border`, `sidebar-border`, `groove-line` | `line` (10% ink) → `line-more` | `paper-line` (10% paper) → `paper-line-more` |
| `chart-3` | `yellow` → `yellow-text` | unchanged |
| `chart-4`, `success-fill` | `green` → `green-text` | unchanged |
| `scrim` | `ink-scrim` → `ink-scrim-deep` | unchanged (already `ink-scrim-deep`) |
| `syntax-violet`, `-blue`, `-green`, `-yellow`, `-orange`, `-plum`, `-red`, `-grey` | `code-<hue>` → `code-<hue>-more` | `syntax-blue` → `blue-lifted-more`; `syntax-red`, `syntax-grey` → `code-<hue>-lifted-more`; the others unchanged |

**Beside the roles,** four more variables change, which are not roles:

- `--field-2` and `--field-4`, light only: `red` → `red-more`, `green` → `green-more` (decision 12);
- `--glass-tint` and `--glass-edge`, both schemes (decision 9).

So each high-contrast block declares **31 variables**, as HC pairs. A pair whose two arms are equal to the standard pair is not written.

**What does not change, and why:**

- **The grounds:** `background`, `card`, `popover`, `secondary`, `muted`, `accent`, `sidebar`, `raised`, `syntax-ground`, `syntax-active-line`. Keeping them keeps the brand's paper and graphite, and keeps `--ink-ground` and the ink surface untouched. Primer keeps its grounds too (*hc* §1).
- **`foreground` and every `*-foreground` on a fill:** ink and paper already pass 7:1 everywhere (lowest: ink on wash, and paper on ink-wash, both above 12).
- **The marks** (decision 2).
- **`caution`,** the yellow fill: ink on it is 9.53.
- **`destructive-fill`** and the light `chart-1`, `chart-2`, `chart-5`, dark charts: already 4.5:1 or more.

**196 pairs measured, 0 below target** (EXECUTED (031)): every text pair of `kuiper.contrast.json` at 7:1 and every non-text pair at 4.5:1, in both schemes; the two tint pairs; three new `border` rows per scheme; the fields; the solid glass; the glass edge; the scrim; and the code palette.

### 7. Non-text: edges, borders, charts and the scrim at 4.5:1

- **`input` and `elevation-line`** take the neutral `-more` swatch: 4.51 on wash, 4.50 on ink-wash at worst.
- **`border`, `sidebar-border` and `groove-line` become opaque, and take the same swatch.** Today they are 10% ink or paper, about 1.23:1, which WCAG allows for a decorative line. Under the owner's 4.5:1 ruling they rise too, as Primer's borders do in its high-contrast themes (*hc* §1). And an alpha line inside a layer lets the colour behind show through, which the depth rule forbids (decision 9). **Q4** asks the owner to confirm that dividers rise, not only control edges.
  - Three rows join the contrast file's high-contrast set per scheme: `border` on `background`, `card` and `muted`.
- **Charts.** A chart colour is non-text, so it needs 4.5:1, not 7:1. Light `chart-3` (yellow, 1.76 today, an exception) takes `yellow-text`, 5.03; light `chart-4` (green, 4.36) takes `green-text`, 5.16. The others pass as they are.
  - **The light yellow exception does not carry into high contrast.** The contrast file's `exceptions` apply to the standard contexts only (decision 13).
  - **A finding: chart distinctness falls in light.** The closest chart pair under deuteranopia goes from 6.8 to 4.1 ΔE (red against `yellow-text`) (EXECUTED (031), *hc* §3). The book's rule that a yellow series is labelled directly carries the meaning. `038`, the data palette, re-measures the charts under both contrasts; this specification records the figure in the landing notes and changes nothing more.
- **`success-fill`** takes `green-text` (5.16). No item paints text on a fill role (EXECUTED (031), grep: the destructive button paints `bg-destructive`, a text role).
- **The scrim** deepens, in light only, to `ink-scrim-deep`, which dark already uses. An overlay's edge under it then reads 5.02 to 5.84 in light and 5.41 to 5.81 in dark. The scrim stays translucent: it is a layer above content, which the depth rule allows. The contrast file's six `scrim` rows take `min: 4.5` in high contrast.

### 8. The focus ring

- **Its colour is `--ring`,** which takes the high-contrast `primary`: 7.00 or more on every light ground, 7.04 or more on every dark one. Inside a field, the ring is the field's legend, 8.80 or more.
- **Its width and offset do not change:** 2 px and 2 px (`focus` in the base file). A 2 px solid outline, offset from the control, at 4.5:1 or more, already meets WCAG 2.4.13 (AAA, focus appearance). The token stays one value in every context, so the resolver's base set needs no override.
- **No dotted style.** Carbon turns its focus outline dotted under `prefers-contrast` (*hc* §1). A dotted line paints half the pixels of a solid one, which lowers the indicator's area. Kuiper keeps it solid.

### 9. The glass under high contrast: solid

The owner's depth rule: transparency signifies depth, so only a layer above content is translucent. The glass is such a layer (the bar, `/brand/` panels). The question is whether it stays translucent when the reader has asked for more contrast. **This specification makes it solid, and Q2 asks the owner to confirm.**

- **What changes under high contrast:**
  - `--glass-tint` takes the glass's own fallback colour: `#FBFAF6` in light, `ink-raised` in dark. It is opaque. In DTCG it is an alias, `{glass.fallback}`, in each override file.
  - `--glass-edge` takes the neutral `-more` swatch, so the layer's edge reads 4.5:1 or more on every ground. That edge, with the glass's shadow, now carries the depth.
  - A theme rule drops the backdrop filter, as the reduced-transparency rule already does:

    ```css
    html[data-contrast="more"] .glass { -webkit-backdrop-filter: none; backdrop-filter: none; }
    @media (prefers-contrast: more) {
      html:not([data-contrast="standard"]) .glass { -webkit-backdrop-filter: none; backdrop-filter: none; }
    }
    ```

    It sits outside the `@supports` of decision 2, so the fallback engines get it too.
- **What stays:** the rim, the pointer light and the shadow. They are drawn on the glass's own face, not through it.
- *Why solid:*
  - Text on a translucent layer has no fixed ground. What scrolls under the bar sets its contrast, so no ratio can be promised. Solid, the bar's text reads 8.43 or more (light) and 7.86 or more (dark) (EXECUTED (031)).
  - Kuiper already makes the glass solid for `prefers-reduced-transparency`, and macOS's "Increase contrast" is reported to switch reduced transparency on (*hc* §2, CITED).
  - The layer stays a layer: its edge, its shadow and its place above the page still show depth. Only the see-through goes.
- **Forced colours** keep their own glass rule (`src/app.css`); nothing here touches it (decision 15).

### 10. The tints under high contrast: 10% over the card, in both schemes

- `029` makes the tints solid: 10% of the text colour over `card` in light, 20% in dark.
- **Under high contrast, both are 10% over `card`.** At 20% in dark, the red text must lighten to `#FFD2CF` to clear 7:1 on its own tint, and the green to `#BBE6D3`. Those no longer read as red and green. At 10%, the lift is small (`#FFA29F`, `#69CDA0`), and the tint is still 1.21:1 from the card (EXECUTED (031), `tint-probe2.ts`). The alert's edge, `border-destructive` or `border-success`, carries the boundary, as it does today.
- The four tint swatches carry `029`'s `composite` extension, so the validator recomputes them (decision 5).

### 11. Code: Meridian at 7:1

- Code is text, so the ruling's 7:1 applies to it. The owner's Meridian palette is not the brand's four hues. But each code hue moves the same way, in lightness alone, so each keeps its hue and its place in the palette.
- **Light: 8 of 10 code hues move** (decision 5's table); `code-navy` and `code-ink` already pass. **Dark: 3 move;** the other 7 pass.
- **Grounds measured:** light, `syntax-ground` (raised) and `syntax-active-line` (paper); dark, `syntax-ground` (ink-wash), `syntax-active-line` (ink-raised) and `background` (graphite), as `tests/unit/contrast.test.ts` measures today.
- The 16 `--code-*` slots follow, since they are copies of `--syntax-*` on `<html>` (decision 2).
- The existing distinctness test ("no two coloured roles under ΔE 5.0") runs on the high-contrast contexts too, and its figure is pinned (T3).

### 12. The fields

- A field's legend is text on the field's fill, so it needs 7:1.
- **Only light `field-2` and `field-4` fall short:** 5.61 and 4.96 today. Under high contrast their fills take `red-more` and `green-more`: 8.82 and 8.88.
- **Every other field keeps its fill:** light `field-1` 7.02 and `field-3` 9.53; dark 8.62 to 13.2. So the brand's blue and yellow fields, and every dark field, look the same in high contrast.
- A field's `--border` is the utility's own mix of the legend at 24%, inside the field. It is a decorative edge drawn on the field's level, and does not change. **This is the one alpha line left under high contrast.** `031b`'s depth audit rules on it with the rest.

### 13. The resolver: two contexts and two override files

`021` decision 7 leaves `031` two ways in. **This specification takes the first: two more contexts on `scheme`.**

```json
"modifiers": {
  "scheme": {
    "description": "The colour scheme and its contrast. A context named for a scheme is that scheme at standard contrast; <scheme>-more is it at high contrast.",
    "contexts": {
      "light": [{ "$ref": "kuiper.light.tokens.json" }],
      "dark": [{ "$ref": "kuiper.dark.tokens.json" }],
      "light-more": [{ "$ref": "kuiper.light.tokens.json" }, { "$ref": "kuiper.light-more.tokens.json" }],
      "dark-more": [{ "$ref": "kuiper.dark.tokens.json" }, { "$ref": "kuiper.dark-more.tokens.json" }]
    },
    "default": "light"
  }
}
```

- **The override files restate, whole, only the tokens high contrast changes.** `kuiper.light-more.tokens.json` holds 27 `role` tokens, 2 `field` tokens and 2 `glass` tokens. `kuiper.dark-more.tokens.json` holds 17 roles and 2 glass tokens. Each token keeps its scheme file's `$type` and `$description`; only `$value` differs. They rely on the Resolver module's stated rule, the last occurrence of a token wins, token by token (`021` decision 2).
- *Why contexts, not a second `contrast` modifier:*
  - Each context is complete: a tool that flattens `dark-more` gets every token, with no alias that reaches across modifiers.
  - A second modifier would need per-scheme high-contrast values reachable from one `more` file. That means a `role-more` group in each scheme file, present in the standard contexts too, doubling the roles every reader sees (`021` decision 7's second way).
  - Primer does the same: an override file per scheme (*hc* §1). It is the Resolver module's own example.
- **The cost:** `scheme` now has contexts that are not `data-scheme` values. So the rule becomes: every context name is a `THEMES` value, or a `THEMES` value followed by `-more`. `029`'s T1 ("every `data-scheme` value the CSS emits is a `THEMES` value and a context of `scheme`") still holds unchanged. `scripts/tokens.ts` gains `CONTRASTS = ["standard", "more"]`.
- **The flattened files** (`021` decision 13) gain two: `kuiper.light-more.json` and `kuiper.dark-more.json`, published beside the others at `/r/tokens/`.
- **The lowering** (`021` decision 3) adds one top-level field to `Tokens`: `more: { light: Record<role, primitive>, dark: Record<role, primitive>, field: { light, dark }, glass: { light, dark } }`, the partial maps. Nothing else in the object changes, so `021`'s and `029`'s lowering criteria still hold for the standard contexts. `Theme` stays `"light" | "dark"`.
- **The validator** gains these rules:
  - an override file's token paths are a subset of its scheme file's, in the same order;
  - each restates `$type` and `$description` equal to the scheme file's;
  - each colour aliases a primitive, as a role does;
  - each `-more` primitive's `derived` record is complete, and its hue is within 1° of its source's OKLCH hue when the source's chroma is 0.02 or more;
  - a primitive with `composite` equals `compositeTenths(of, over, alpha)` (`029`'s rule, unchanged).
- **The contrast file gains a `more` section:** `{ "text": 7, "nonText": 4.5, "scrim": 4.5, "nonTextAdded": [["border", "background"], ["border", "card"], ["border", "muted"]] }`. `contrastTable(tokens, theme, contrast)` takes the contrast as a third argument, defaulting to `standard`. Under `more` it uses the high-contrast maps and targets, applies no `exceptions`, and adds the `nonTextAdded` rows. The site's contrast tables and the bench read it.
- **The removed-names record** gains nothing: every path is new (`021` decision 10).

### 14. `kuiper.css`

`kuiper.css` carries the values and the least behaviour that makes them right (`029` decision 14). The contrast block is values under a selector, as the `.dark` block is. So it goes in:

1. `@layer kuiper.scope;`
2. `:root { … }`
3. `.dark { … }`
4. the `data-scheme` rules
5. **the high-contrast block of decision 2**
6. the scope rule, in `@layer kuiper.scope`
7. the fallback, **with decision 3's two sets at its end**
8. the reduced-motion block

- The glass rule of decision 9 is not in it: the glass is a theme utility, as in `029`.
- `021`'s T9, as `029` rewrote it, now counts these eight blocks. The header gains one sentence: "Under `prefers-contrast: more`, or `data-contrast="more"` on `<html>`, every colour takes its high-contrast pair."

### 15. Beside forced colours

- **Two signals, one page.** A Windows contrast theme matches `forced-colors: active`, and, by Media Queries 5, also `prefers-contrast: more` (or `less`, or `custom`) (*hc* §2). So both Kuiper's high contrast and `028`'s rules apply at once.
- **They do not conflict.** Forced colours discard every author colour, so the high-contrast pairs do nothing there. Chromium and Firefox painted the system palette with both emulated (EXECUTED (031)). `028`'s rules set system colours under the `forced-colors:` variant; this specification sets no system colour and no rule under `forced-colors`.
- **The glass:** both rules drop the backdrop filter. Forced colours also paint the fallback and a `CanvasText` border, which wins in that mode.
- **WebKit** emulates forced colours without repainting (`028`). There, with both emulated, the high-contrast values show, which is correct: Safari has no forced colours, and on a Mac the signal is `more` alone.
- **Tests must emulate both together** to stand for a Windows theme: Playwright sets them independently (*hc* §2, EXECUTED). T9 runs `028`'s per-item check with `contrast: "more"` added, and expects its results unchanged.

### 16. Weight

A change that adds weight to every page states it (`024` decision 5). **About +1.0 to +1.3 kB gzipped per page, on every template** (an estimate):

| Part | Gzipped per page |
|---|---|
| The high-contrast block, attribute and media rules (decision 2) | 0.42 kB (EXECUTED (031)) |
| The fallback's two sets (decision 3) | 0.36 kB (EXECUTED (031)) |
| The glass rule (decision 9) | 0.02 kB (EXECUTED (031)) |
| The head script's added lines, inline in every page | about 0.1 kB (INFERRED, about 250 B raw) |
| The site bar's `ContrastToggle`, the store and the icon, on every page | about 0.3 to 0.5 kB (INFERRED, from `ThemeToggle`'s size) |

- The smallest headroom in `024`'s table is `/`, 307 against 340 kB. After `029`'s +0.73 kB, this fits every template.
- The builder measures the built site before and after, and the landing notes give the figure per template (`024`). If it does not fit, the builder stops and asks for a ruling.

### 17. The site

- **The setting, in the bar** (Q3). `ContrastToggle` sits beside `ThemeToggle` in `src/lib/site/chrome/bar.svelte`, at the same size, at every width. *Why there:* the scheme's switch is there; a reader who needs more contrast should not have to find a page first.
- **The frames carry the contrast.** `src/lib/site/example-theme-script.svelte` writes `data-contrast` from `?contrast=` when present, else from `kuiper-contrast` and the system, with decision 4's logic. It listens for `storage`, so a frame follows the bar's toggle at once. `src/lib/preview/block-viewer.svelte`'s `copyTheme` copies `data-contrast` with `data-scheme`, and its observer watches it. Without this, a page in high contrast would show its examples standard. The thumbnails stay standard: they are pictures of the catalogue, not the reader's page.
- **The theme page** (`/components/kuiper-theme/`) gains an example, "More contrast": the `029` sampler in a frame with `?contrast=more`, in both schemes.
- **`/start/light-and-dark/`** gains a section, "More contrast". It covers:
  - what it is, and how it differs from forced colours;
  - the attribute, the media query and the toggle;
  - that it is set on `<html>` only;
  - the table of roles that change (decision 6), generated from the token files.
- **`/foundations/colour/`'s contrast tables** gain the two high-contrast contexts, from `contrastTable(…, "more")`.
- **`/brand/colour/`** gains a section, "More contrast": the 15 brand swatches (decision 5's first fifteen rows), each beside its source, with its ratio. Generated from the token files, with the page's `source` comments, as the page's other claims are.
- **`/foundations/accessibility/`** says what Kuiper supports: two schemes, each at two contrasts, and forced colours honoured.
- **`read-token`'s example** repaints when `data-contrast` changes, as it does for `data-scheme`.

### 18. Interface changes, the changelog and the guide

**The 0.13.0 changelog** (or the release it lands in) gains one bullet per item, each marked `**interface change.**`, each linking its guide section:

- **`kuiper-theme`:** a high-contrast form of each scheme, under `prefers-contrast: more` or `data-contrast="more"` on `<html>`, with `data-contrast="standard"` to opt out; text at 7:1 and edges at 4.5:1; borders become opaque; the glass becomes solid; nothing changes at standard contrast.
- **`theme`:** the head script writes `data-contrast`, so `THEME_SCRIPT` changes value; new: `contrast`, `CONTRAST_KEY`, `ContrastToggle`, `ContrastPreference`, `ResolvedContrast`.
- **Tokens:** 25 primitives; `kuiper.light-more.tokens.json`, `kuiper.dark-more.tokens.json`; the contexts `light-more` and `dark-more`; two flattened files; `kuiper.css`'s high-contrast block.

**The upgrade guide's section, "`031`: more contrast,"** at `/changelog/0.13.0/upgrade/`. Its steps:

1. **Update `kuiper-theme` and `theme` together:** `add kuiper-theme theme`.
2. **If you allow the head script by a CSP hash, update it,** once, with `020`'s and `029`'s steps, when this lands in the same release.
3. **Readers who ask for more contrast now get it.** With the theme item alone, the page follows `prefers-contrast: more`. Nothing else is needed.
4. **To let readers choose,** add `<ContrastToggle />` beside `<ThemeToggle />`, or build a menu from `contrast.set`.
5. **To keep a page at standard contrast,** set `data-contrast="standard"` on `<html>` in its markup. Do this only for a reason, such as a brand screenshot: a reader asked for more.
6. **Your own colours do not follow.** A colour from a role does. A literal colour, or an app's own token, stays as it was. Use roles.
7. **Set `data-contrast` on `<html>` only.** A subtree with it changes nothing.

**For the 0.15.0 alias removal** (`029` decision 4's list): the two `… .dark` selector items in decision 2's block, and `.dark` in decision 3's sets, go with the alias. `029`'s landing adds them to that row's list.

### 19. What `031` does not do

- **No contrast on a subtree.** By ruling, and by mechanism (decision 1).
- **No `less` and no `custom`.**
- **No change to standard contrast:** every standard value, every role's standard primitive and every standard ratio stays as `029` leaves it.
- **No density or type change.** Larger text is the reader's zoom; WCAG 1.4.6 is met by colour.
- **No forced-colours change** (`028`).

## Design

### The emitted shape, in `src/app.css`

An excerpt, after `029`'s blocks. Values are the proposed swatches, lower case as the generator writes them.

```css
@supports (color: light-dark(#000, #fff)) {
  html[data-contrast="more"],
  html[data-contrast="more"] .dark {
    --muted-foreground: light-dark(#444a55, #b9b3a5);
    --primary: light-dark(#2236c3, #95b2ff);
    --ring: light-dark(#2236c3, #95b2ff);
    --destructive: light-dark(#99011f, #ffa29f);
    --success: light-dark(#01553b, #69cda0);
    --caution-text: light-dark(#5e4701, #f8d874);
    --input: light-dark(#6d6659, #958e80);
    --border: light-dark(#6d6659, #958e80);
    --chart-3: light-dark(#806200, #f8d874);
    --scrim: #0b0f1799;
    --destructive-tint: light-dark(#f5e6e9, #382c26);
    --syntax-grey: light-dark(#4c515a, #aeb4be);
    --field-2: light-dark(#99011f, #ff9491);
    --glass-tint: light-dark(#fbfaf6, #221f19);
    --glass-edge: light-dark(#6d6659, #958e80);
    /* … 31 in all … */
  }
  @media (prefers-contrast: more) {
    html:not([data-contrast="standard"]),
    html:not([data-contrast="standard"]) .dark { /* … the same 31 … */ }
  }
}
html[data-contrast="more"] .glass { -webkit-backdrop-filter: none; backdrop-filter: none; }
@media (prefers-contrast: more) {
  html:not([data-contrast="standard"]) .glass { -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@supports not (color: light-dark(#000, #fff)) {
  /* … 029's sets … */
  html:root[data-contrast="more"]:is(.dark, [data-scheme="dark"]),
  html[data-contrast="more"] :is(.dark, [data-scheme="dark"], .surface-ink) { /* dark HC hexes, copies */ }
  html:root[data-contrast="more"],
  html[data-contrast="more"] [data-scheme="light"] { /* light HC hexes, copies */ }
}
```

Print order: the high-contrast block after the `data-scheme` rules and the ink and mode rules; the glass rule after the glass utility's other rules; the HC sets last inside the fallback.

### The generator, in outline

- `build-tokens.ts` gains `contrastBlock()`, `contrastFallbackSets()` and `contrastGlassRule()`, one function per block, as `029`'s outline asks. Each reads `tokens.more` and `pair()`.
- The list of variables is computed: every variable whose HC pair differs from its standard pair. It is not typed. So a later change to a standard primitive that makes an override redundant drops it from the CSS, and the validator's subset rule still holds.
- `kuiper.css`'s writer calls the same functions (decision 14).

## Scope

**In:**

- **Tokens:** 25 primitives in `tokens/kuiper.tokens.json`; `tokens/kuiper.light-more.tokens.json` and `tokens/kuiper.dark-more.tokens.json`; two contexts in `kuiper.resolver.json`; the `more` section of `kuiper.contrast.json`.
- **Scripts:** `scripts/tokens.ts` (`CONTRASTS`, the lowering's `more`, the validator); `scripts/contrast.ts` (`deriveForContrast`, the OKLCH conversion moved from `tests/helpers/colour.ts`, `contrastTable`'s third argument, the scrim rows' `min`); `scripts/build-tokens.ts` (decision 2's, 3's and 9's blocks, `kuiper.css`, the flattened files); `scripts/bench/kuiper.ts` (`theming.dataContrast`; `contrastPairs` counted across four contexts, noted in the run log).
- **Generated:** `src/app.css`; `registry.json`'s `kuiper-theme` and `theme`; `kuiper.css` and the flattened files; `static/r/`.
- **Items:** `src/lib/registry/ui/theme/theme-script.svelte`, `contrast.svelte.ts` (new), `contrast-toggle.svelte` (new), `index.ts`; the `theme` item's `files` in `registry.json`.
- **The site (lane S):** the bar; the two frame scripts; the theme page's example; `/start/light-and-dark/`; `/foundations/colour/`, `/foundations/accessibility/`, `/brand/colour/`; the `read-token` example; a test view, `src/routes/(view)/view/high-contrast/`, out of the sitemap.
- **The harness (lane E):** one Playwright project, `axe-more`, in `playwright.config.ts` (T8).
- **Ledgers:** `CHANGELOG.md`; `src/lib/site/upgrade/0.13.0.ts`.
- **The tests below.**

**Out:**

- Contrast on a subtree; `less`; `custom` (decision 19).
- The data palette's re-measure under both contrasts (`038`).
- `031b`'s audit of the field's 24% border (decision 12).
- Any change to a standard value.
- A Windows run by hand: `028`'s manual Edge run before 1.0 adds high contrast to its checklist (landing note), nothing more here.

## Tests to write first

Each test is written before the change and seen failing for the reason given. E2E tests run in `chromium-*`, `firefox-*` and `webkit-*` (`022`), on the production preview (`029` decision 8). A test that passes today is proven by mutation, and the landing notes say which.

| # | Name | File | Asserts | Fails today because |
|---|---|---|---|---|
| T1 | the resolver's contrast contexts | `tests/unit/tokens-dtcg.test.ts` | `scheme` has contexts `light`, `dark`, `light-more`, `dark-more`. Each `<s>-more` lists `<s>`'s file then `kuiper.<s>-more.tokens.json`. Every context name is a `THEMES` value or one followed by `-more`. Each override file's paths are a subset of its scheme file's, in order, each with equal `$type` and `$description`. Light holds 27 roles, 2 fields, 2 glass; dark 17 roles, 2 glass. The removed record is unchanged | no contexts, no files |
| T2 | the swatches are derived, and approved | same | The 25 primitives exist with `since` and `derived` (or `composite`). For each with `derived` and no `adjusted`, `deriveForContrast(from, grounds, target, direction)` returns its exact hex. For each with `adjusted`, it meets its target on its grounds and its hue is within 1°. Every primitive hex is unique. Each tint equals `compositeTenths(of, over, 0.1)` | no primitives |
| T3 | every pair at its target | `tests/unit/contrast.test.ts` | `contrastTable(tokens, theme, "more")` for both schemes: every text row at 7 or more, every non-text row at 4.5 or more, no row an exception, the three `border` rows present. The fields' legends, the solid glass's text, the glass edge, the six scrim rows and every code row at their targets. The code distinctness test holds under `more`, its closest pair printed. The light chart deuteranopia figure, 4.1, is printed and pinned | no `more` |
| T4 | the block's shape | `tests/unit/high-contrast.test.ts` | In `kuiper-theme`'s `css`: one `@supports (color: light-dark(#000, #fff))` key, holding exactly the two rules of decision 2 with their exact selector lists, and inside it one `@media (prefers-contrast: more)` holding the same declarations. The declared names are exactly the computed set (31 today), each an HC pair matching the two `-more` contexts. No selector anywhere reads `[data-contrast` except after `html` with no combinator between. No `:root` or `.dark` is a list item inside an at-rule (001 decision 14, PostCSS `list.comma`). The glass rule exists twice, as decision 9 gives it. `029`'s T3 still passes | no block |
| T5 | the fallback's sets | same | Inside `@supports not (…)`, after `029`'s sets, two rules with decision 3's selectors. The dark one holds every name of T4 as its dark HC hex, and the 8 surface and 16 code copies; the light one the same in light | no sets |
| T6 | the axis in three engines | `tests/e2e/high-contrast.spec.ts` | On `/view/high-contrast/`, `029`'s sampler at the page and three deep (opposite, page, opposite), in a `.dark` alias, inside a field, inside ink, and a glass panel. For each case of: `contrast: "more"` with no attribute and scripts off; `data-contrast="standard"` with `contrast: "more"`; `data-contrast="more"` with no preference; each on a light and a dark root. Every sample's computed `color`, `background-color` and `border-*-color` equals the token file's value for its scheme at that contrast. The glass's `background-color` has alpha 1 and `backdrop-filter` is `none` under high contrast. *Also:* with every `light-dark(` renamed in the served CSS (`029`'s T12 method), the same readings hold where the attribute is set | no axis: every case reads standard |
| T7 | the head script, the store and the toggle | `tests/e2e/theme.spec.ts`, `tests/unit/registry.test.ts` | With modules aborted (`020` test 9's method): stored `more` on a no-preference system gives `data-contrast="more"`; stored `standard` with `contrast: "more"` gives `standard`; no key follows the system; a stored `banana` follows the system. `THEME_SCRIPT` holds `kuiper-contrast` and `data-contrast`. With modules on: `ContrastToggle` is a button named "More contrast", `aria-pressed` follows `contrast.resolved`, Enter and Space toggle it, and toggling writes the attribute and the key. A change of the emulated `contrast` writes the attribute while no key is stored. A `storage` event from another page updates it. `theme`'s `index.ts` exports the four names | no attribute, no exports |
| T8 | the pages at AAA | `tests/e2e/axe.spec.ts`, new project `axe-more` | Every page in `SITEMAP`, at 1280, in both schemes, with `contrast: "more"`: axe with `color-contrast-enhanced` (WCAG 1.4.6) enabled reports 0 violations. Each check is tagged by item and check, as `030` tags, so its report shows it. Run in Chromium; the component pages also in Firefox and WebKit | standard colours fail 1.4.6 on many pages |
| T9 | beside forced colours | `tests/e2e/forced/*.spec.ts` (`028`'s check) | `028`'s per-item check, run again with `forcedColors: "active"` and `contrast: "more"` together, in Chromium and Firefox: every result equals the forced-only run | passes today; proven by mutation: a high-contrast rule that sets `outline-style: dotted` on `:focus-visible` changes Firefox's result |
| T10 | the site's setting and frames | `tests/e2e/site.spec.ts`, `tests/e2e/frames.spec.ts` | The bar holds `ContrastToggle` beside `ThemeToggle` at 1440 and 390. Pressing it sets `<html>`'s `data-contrast="more"`, and every example frame on the page reads `data-contrast="more"` within one second, without reload. A frame with `?contrast=more` reads high contrast on a standard page. A block view copies the attribute | no toggle; frames write no contrast |
| T11 | `kuiper.css` | `tests/unit/tokens-dtcg.test.ts` (`021`'s T9, as `029` rewrote it) | Eight blocks, in decision 14's order. Every declaration it shares with `src/app.css` has the same value. The header holds decision 14's sentence | seven blocks |
| T12 | the CLI and a production build | `tests/smoke/upgrade.test.ts` (`029`'s T17) | After `add kuiper-theme theme` from 0.12.0 and fresh, `app.css` holds the `@supports` block with its nested `@media`, written as nested at-rules. A second `add` is byte-identical. The app's production build (with `029`'s Vite line) keeps `@supports (color: light-dark(`, `prefers-contrast: more` and the HC pairs unlowered | no block |
| T13 | the site's build keeps the block | `tests/e2e/build-output.spec.ts` (`029`'s T23) | The built CSS holds the `@supports (color: light-dark(#000, #fff))` block, its `@media (prefers-contrast: more)`, and HC pairs with `light-dark(` intact | no block |
| T14 | the changelog and the guide | `tests/unit/registry.test.ts`, `tests/e2e/upgrade.spec.ts` | The entry holds decision 18's three bullets, marked interface change, naming `data-contrast`, `prefers-contrast`, `THEME_SCRIPT`, `ContrastToggle` and `kuiper.light-more.tokens.json`. The guide holds the section's seven steps, in order | no text |
| T15 | the docs show it | `tests/e2e/docs.spec.ts` (or the pages' specs) | `/start/light-and-dark/` has a "More contrast" section whose role table equals the override files. `/foundations/colour/` shows four contrast tables. `/brand/colour/` shows the 15 brand swatches with ratios equal to `contrastRatio`'s. The theme page's "More contrast" example renders in both schemes with 0 axe violations | no such content |

## Acceptance criteria

1. **The tokens.** T1 and T2 pass. The DTCG files hold 77 primitives (52 + 25) and four contexts; roles per scheme stay 63. (unit)
2. **The ratios.** T3 passes: 0 rows below target in either high-contrast context. The landing notes give the pinned pair count and the chart figure. (unit)
3. **The CSS.** T4, T5 and T11 pass. `029`'s T1 to T7 still pass unchanged. (unit)
4. **The axis.** T6 passes in Chromium, Firefox and WebKit, modern and emulated fallback: 0 mismatched readings. (e2e)
5. **The setting.** T7 and T10 pass. `020`'s tests 9 and 10 and `029`'s T15 and T16 still pass. (e2e, unit)
6. **AAA on every page.** T8 passes: 0 `color-contrast-enhanced` violations under high contrast. Each fault it finds is fixed before landing: in a token, by this build; in an item's classes, by a small change in lane I, landed first. (e2e)
7. **Forced colours undisturbed.** T9 passes. (e2e)
8. **The CLI and builds.** T12 and T13 pass. (smoke, e2e)
9. **Standard contrast unchanged.** With no attribute and no preference, every value `029`'s T10 reads is unchanged, and the standard rows of `contrast.test.ts` are unchanged. (e2e, unit)
10. **The changelog, the guide and the docs.** T14 and T15 pass. (unit, e2e)
11. **Weight.** The landing notes give the built site stylesheet and the bar's chunk, gzipped, before and after, per template. They fit `024`'s headroom, and `perf.spec.ts`'s budgets pass. (perf)
12. **The swatches are the owner's.** Q1 is answered, and the landing notes record the answer and any adjusted swatch. (owner)
13. **The suites.** `bun run test:unit`, `bun run test:e2e:engines` and `bun run test:smoke` pass; `bun run check` reports 0 errors; `bun run lint` is clean, the literal lint included. (all)
14. **Tests first, and the checkpoint.** T1 to T8 and T10 to T15 are seen failing first, and T9 by mutation. At the checkpoint, the design lead looks at the test view, the theme page's example, `/brand/colour/` and the bar, in both schemes at both contrasts, at 1440 and 390, in three engines, on the production preview. Rulings go into the landing notes. (checkpoint)
15. **The scorecard.** The loop runs (`roadmap.md` §4). Row 4 moves 3 → 4 and row 3 gains (f). The change review cites it. (bench)

## Build order

1. **Confirm the tree.** `020`, `021`, `028` and `029` landed. Re-pin every count, and re-run `palette.ts` on the tree: the swatches must come out the same, or the owner sees the difference before Q1 is taken as answered.
2. **Tests first.** T1 to T15 and the test view. Run them; record what fails and why.
3. **Tokens.** The primitives, the override files, the contexts, the contrast file's `more`. `deriveForContrast` and the validator. T1 to T3 go green.
4. **The generator.** The three blocks, the fallback sets, `kuiper.css`, the flattened files. T4, T5, T11 go green. A second `build:tokens` writes nothing.
5. **The theme item.** The head script, the store, the toggle. T7 goes green.
6. **Checkpoint, part one:** the test view, three engines, both contrasts. T6, T12, T13.
7. **The site:** the bar, the frames, the docs, the Brand colour page. T10, T15.
8. **AAA.** The `axe-more` project. Fix what it finds (criterion 6). T8. Then T9.
9. **The ledger:** the changelog, the guide, `static/r/`. T14.
10. **Weight**, against `024` (decision 16).
11. **Checkpoint, part two** (criterion 14).
12. **The suites, then the scorecard loop** (criteria 13 and 15). Add decision 18's two items to the 0.15.0 alias-removal row.

## Predicted scorecard movement

- **Row 4, theming: 3 → 4.** (c) "A contrast scheme" goes from – to ✓, joining `029`'s (a), (b) and (e): a count of 4. Evidence: T6 in three engines on a production build, and the bench's `theming.prefersContrast` and `dataContrast` above 0. Kuiper then ties Material, Primer and Radix, and is the only one of them that follows `prefers-contrast` with its own colours (*hc* §1).
- **Row 3, accessibility evidence: (f) ✓.** "A high- or increased-contrast scheme." With `028`'s (e), `022`'s (h) and `030`'s (d), the row reaches 3, as the roadmap plans. T8's AAA scan, tagged per item, also adds evidence to (a) and (g): contrast pairs computed and tested at two levels.
- **Row 5, tokens: held at 4.** The new primitives carry descriptions, `since` and their derivation; two more flattened outputs.
- **Row 8, page weight: held,** if decision 16's figure fits `024`'s budgets.
- **Row 11, change communication: held.** One more guide section.

## Risks

- **The swatches are the owner's call, and they gate the build.** The spec, the tests and the generator do not depend on the exact hexes: T2 re-derives them, and an adjusted swatch carries its reason. So a change at Q1 changes data, not design.
- **AAA may find faults in items.** Any text drawn with an opacity, a placeholder colour, or a literal will show in T8. Each is a finding to fix (constitution §4.4); the number is unknown until the scan runs. If it is large, the design lead may split the fixes into small changes before this lands.
- **Borders get heavier.** Every hairline becomes an opaque line at 4.5:1. Dense pages (the sidebar, tables) will look busier in high contrast. That is what the reader asked for, and Primer does the same, but Q4 lets the owner keep dividers lighter.
- **A positive `@supports` could be rewritten by a minifier.** Lightning CSS kept `@supports not (…)` in `029`'s probes; the positive form is unproven in a build. T12 and T13 check it. If a tool drops it, the fallback fix is to move the `.dark` list items into the fallback's own selectors, which `engines.mjs` can probe.
- **The chart pair under deuteranopia falls to 4.1 ΔE in light** (decision 7). Labels carry the meaning; `038` re-measures.
- **A real Windows contrast theme** may match `less` or `custom`, not `more`. Then forced colours alone apply, which is `028`'s domain and correct.
- **Slipping to 0.14.0** changes `THEME_SCRIPT` in a second release, so CSP-hash apps update twice (Q5).
- **The alias doubles two selector items until 0.15.0.** It compresses to almost nothing.

## Open questions for the owner

Recommended option first.

**Q1. Do you approve the high-contrast swatches?** The 25 swatches of decision 5, shown beside their sources in [`swatches.png`](../research/2026-11-15-high-contrast/swatches.png) and in use in [`in-use.png`](../research/2026-11-15-high-contrast/in-use.png) (live: [`swatches.html`](../research/2026-11-15-high-contrast/swatches.html)). Each keeps its hue and moves in lightness alone, the least that reaches 7:1 for text and 4.5:1 for edges.
1. **Approve all 25 as derived.** *Recommended.* They are the smallest change that meets your targets, and they read as the same brand.
2. **Approve with named changes.** Name any swatch to adjust, for example "a warmer `red-more`". The changed swatch still must reach its target; it carries your words in the token file, and T2 checks its target and hue.
3. **Allow the hue to move too.** Derive again letting hue shift up to a set number of degrees, for brighter colours at the same contrast. The exhibit is redrawn and put to you again.

**Q2. Does the glass stay translucent under high contrast?**
1. **No: it becomes solid,** with a 4.5:1 edge, as under reduced transparency. *Recommended.* Text on it then has a fixed ground, and macOS's Increase contrast is reported to reduce transparency already (decision 9).
2. **Yes: it stays translucent,** with the 4.5:1 edge only. The bar's text ratio then depends on what scrolls under it.
3. **Solid for the bar only;** the `/brand/` panels stay translucent.

**Q3. Where does the reader set it on the site?**
1. **A "More contrast" toggle beside the theme toggle in the bar,** at every width. *Recommended.* One press, where the scheme switch already is.
2. **A "Display" menu** in the bar holding scheme (light, dark, system) and contrast (standard, more, system), replacing the theme toggle. It also gives back "system", but takes two presses.
3. **Only on `/start/light-and-dark/`,** with the system's setting followed everywhere else.

**Q4. Do dividers rise to 4.5:1, or only control edges?**
1. **All lines: `border`, `sidebar-border`, `groove-line`, `input`, the glass edge.** *Recommended.* Your 4.5:1 ruling says "non-text elements"; Primer raises all borders in its high-contrast themes; and an opaque line keeps the depth rule.
2. **Control edges only** (`input`, `ring`, the glass edge). Dividers stay 10% alpha lines, about 1.23:1, as WCAG allows for decoration.
3. **Dividers at 3:1,** between the two: a lighter `-more` neutral for them, one more swatch per scheme.

**Q5. Which release?**
1. **0.13.0, wave 3, as the roadmap places it.** *Recommended.* `THEME_SCRIPT` changes once in the release, with `020`'s and `029`'s changes, so an app with a CSP hash updates once.
2. **0.14.0,** if lane T runs long. Apps update the hash again then.

## Review

Not yet reviewed.

## Landing notes

Not landed.

### The owner's rulings this stands on (2026-11-15)

From `decisions.md` at `beeb67e` and `roadmap.md` §6 Q4, quoted in the header: a high-contrast scheme; it follows `prefers-contrast: more` and can be set by hand; contrast on `<html>` only; new shades of the brand's hues at 7:1, approved by the owner; non-text at 4.5:1; transparency signifies depth.

### Notes for later rows

- **`038`, the data palette:** re-measure the chart series under both contrasts; the light high-contrast closest pair under deuteranopia is 4.1 ΔE (decision 7).
- **`031b`, the depth audit:** the field's 24% border is the one alpha line left under high contrast (decision 12).
- **The 0.15.0 alias removal:** decision 18's two items.
- **`028`'s manual Edge run before 1.0:** add one pass with Kuiper's high contrast set by hand, under the Aquatic theme.
