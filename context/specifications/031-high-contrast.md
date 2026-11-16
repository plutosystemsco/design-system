# 031 — High contrast

- **Status:** Ready to build, in wave 3 after `029`, `028`, `031a` and `031b`'s token edit. The specification review's 9 findings are answered ("Review response"), and its re-check found it ready (R1 and R2 applied). The owner answered Q2 to Q5 on 2026-11-15. Q1, the swatches, was ruled by the design lead under the owner's overnight delegation after the re-derivation on a public `sunken` (Landing notes). `031a`'s reviewer checked the three lane-T specs agree, 2026-11-15. Not built.
- **Date:** 2026-11-15
- **Author:** the spec author for `031`, for the design lead
- **Kind:** a feature in lane T (tokens, the theme item, the `theme` item). **Interface changes**, all additive; nothing is renamed or removed:
  - `kuiper-theme` gains a high-contrast block on `<html>`, keyed on a new attribute, `data-contrast`, and on `prefers-contrast: more`;
  - under high contrast, `.glass` paints solid, with no backdrop filter;
  - the `theme` item gains a `contrast` store, `CONTRAST_KEY`, `ContrastToggle` and two types, and its head script writes `data-contrast`, so `THEME_SCRIPT` changes value;
  - the token source gains 25 primitives, two override files and two resolver contexts;
  - `kuiper.css` gains the high-contrast block.

  No role is added; no role's standard value changes. It adds no dependency. Each change has a changelog bullet and a step in the upgrade guide (decisions 17 and 18).
- **Lanes:** T (`tokens/`, `scripts/build-tokens.ts`, `scripts/tokens.ts`, `scripts/contrast.ts`, `src/app.css`, `kuiper-theme`, `theme`). Edits outside lane T, each named in Scope: the site bar and the frame scripts (lane S), the axe suite's high-contrast project (lane E), the docs pages and the Brand colour page (lane S).
- **The order in lane T** (decision 20): the order in lane T is `031a`, then `031b`'s token edit, then this; `031a`'s `sunken` is a public ground. **`031` covers `031b`'s public roles; `031b` owes no high-contrast pairs.** `sunken`, `031b`'s solid hairline, its `sunken-line` and its three disabled roles are on the tree this builds on, and this specification says what each becomes under high contrast.
- **Written against the tree `020`, `021`, `029`, `031a` and `031b` leave.**
  - `020` has landed: `kuiper-theme`, `kuiper:` keys, the storage key `kuiper-theme`, `tokens/kuiper.tokens.json`, the guide at `/changelog/0.13.0/upgrade/`.
  - `021` makes the token source a DTCG 2025.10 resolver set under `tokens/`: `kuiper.tokens.json`, `kuiper.light.tokens.json`, `kuiper.dark.tokens.json`, `kuiper.resolver.json` with one modifier, `scheme`, and `kuiper.contrast.json`. Its build lowers them to the `Tokens` object.
  - `029` makes every colour a `light-dark()` pair on `:root`, adds `data-scheme` on any element, keeps `.dark` as an alias until 0.15.0, adds the hex fallback under `@supports not (color: light-dark(#000, #fff))`, the solid tints and `--ink-ground`, and writes `data-scheme` from the head script.
  - `031a` (the owner's answers) adds a public role, `sunken`: `paper-sunken` `#DCD7CA` in light, `ink-sunken` `#0B0A07` in dark. The contrast file gains its allowed rows and a `restricted` block. Restricted on `sunken`, in both schemes and every context: `destructive`, `success` and `caution-text` as text; the `input` edge; and, by the design lead's ruling on `031a`'s second re-check (S1), the status fills (`destructive-fill`, `success-fill`, and the `caution` fill) and the five chart colours (`031a` decisions 1 and 1a); and `031b`'s `disabled-foreground` and `disabled-edge`, which `031b` writes into the block. So the rows on `sunken` are `foreground`, `muted-foreground` and `primary` text, the `ring`, and the line roles.
  - `031b` makes `line` and `paper-line` solid, makes the fields' edge solid, and adds the roles `disabled`, `disabled-foreground` and `disabled-edge` with four composite primitives. It also adds a public `sunken-line`, `#C7C3B8` and `#22211E` (`031a`, Knock-ons). Its disabled roles have no text or non-text rows in `kuiper.contrast.json` (their two pairs on `sunken` are in the `restricted` block), held to `031b`'s own targets, the same in every context (decision 6). Its light hairline (`#DCDAD3` in its draft) is provisional. **The figures here used `031b`'s draft values. No swatch depends on the hairline: the line roles' high-contrast values come from `line-input` and `paper-line-input`. The derivation re-runs from the token file once `031b` lands, and the landing notes give the figures.**
  - The measurements ran on today's tree with `029`'s, `031a`'s and `031b`'s values laid over it from the files in `tree.draft.json`. The builder re-pins every count. Where an earlier specification lands a name this does not foresee, theirs wins, and the landing notes say so.
- **Depends on:** `029` (its pairs, its generator's one-function-per-block shape, its fallback, its head script; decision 16 there leaves this one way in). `031a`'s and `031b`'s lane-T parts (decision 20). `028` (forced colours is a different mode; this must not disturb its rules, decision 15). `021` (the resolver and `kuiper.css`). `024` (the weight rule, decision 16). Softly `022` (three-engine projects) and `030` (the report picks up this spec's tagged checks).
- **Ships with:** 0.13.0, wave 3 (`roadmap.md` §3). The roadmap calls it "the first spec to slip to 0.14.0 if the lane runs long"; the owner answered Q5, "0.13.0", so `THEME_SCRIPT` changes once between tags.
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `031`: "`prefers-contrast: more` and a hand setting on `<html>`; text at 7:1; its own primitives, approved by the owner." It moves scorecard row 3 (f), and row 4 from 3 to 4.
- **Design call: the owner's rulings this carries.** Binding. Quoted from the retired `decisions.md` at `beeb67e` (`context/README.md`), entry "Accessibility status, a high-contrast scheme, and scoped schemes", and the roadmap's §6 Q4:
  - "**A high-contrast scheme.** **The owner:** 'yes to high contrast theme.'"
  - It "follows `prefers-contrast: more` and can be set by hand."
  - "**Contrast is set on `<html>` only,** never on a subtree."
  - "High-contrast colours as new shades of the brand's hues, measured to 7:1 and approved by the owner."
  - "Non-text elements reach 4.5:1 in high contrast."
  - "**Transparency always signifies depth.** … Everything inside a layer is on that layer's level" (`019a` decision 3). Decision 9 applies it to the glass.
- **Research it stands on:**
  - [`../research/2026-11-15-high-contrast.md`](../research/2026-11-15-high-contrast.md), cited as *hc* §n, with its §6 to §9 corrections: after the review, after `031b`'s review, after `031a` made `sunken` public, and after `031a`'s S1. Its folder, [`../research/2026-11-15-high-contrast/`](../research/2026-11-15-high-contrast/), holds the exhibit, the derivation (`palette.ts`, `tree.draft.json`, `more.draft.json`, output `palette.json`) and the engine probe.
  - [`../research/2026-11-15-scoped-schemes-and-contrast.md`](../research/2026-11-15-scoped-schemes-and-contrast.md), cited as *scoped* §n, with §§9–11.
  - [`029-scoped-schemes.md`](029-scoped-schemes.md) decisions 1–8, 14 and 16; [`031b-transparency-signifies-depth.md`](031b-transparency-signifies-depth.md) decisions 7 to 9 and 11; [`031a-the-index-card-redesign.md`](031a-the-index-card-redesign.md) decisions 1, 1a and 3, and its Knock-ons; [`028-forced-colours.md`](028-forced-colours.md); [`021-tokens-for-everyone.md`](021-tokens-for-everyone.md) decisions 2, 7, 11 and 12; [`024-budgets-per-template.md`](024-budgets-per-template.md) decision 5.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md) rows 3 and 4.
- **Measurements** are labelled **EXECUTED (031)**: the derivation, the three-engine probe (`engines.mjs`), the forced-colours media probe (`forced-mq.mjs`), the tint probe (`tint-probe2.ts`) and the weight (`bytes.ts`), all in the research folder, run on 2026-11-15 on the repository's Playwright 1.64.1 and Bun 1.4.4. Every ratio is `scripts/contrast.ts`'s own `contrastRatio`: WCAG 2.2, truncated to two decimals. The review's probes (in the session scratchpad's `031-review/`) are cited as **EXECUTED (review)**.

## Intent

Some readers need stronger contrast than WCAG AA's 4.5:1. They ask for it in their operating system. macOS's "Increase contrast" matches `prefers-contrast: more`, and a Windows contrast theme can match it beside forced colours (*hc* §2). Today Kuiper ignores the request. Of its 38 text pairs per scheme (the contrast file's 33, `029`'s two tint pairs, and `031a`'s three on `sunken`), 23 in light and 10 in dark are below 7:1 (EXECUTED (031)).

This specification adds a high-contrast form of each scheme. It is Kuiper's own colours, not the system's. Text reaches 7:1 on every ground it sits on (WCAG 1.4.6, AAA). Inputs, lines, focus and edges reach 4.5:1. The page follows the reader's setting, and the reader can set it by hand, on the site and in any app with the `theme` item.

It is a second axis beside the scheme. The scheme is light or dark, and any element can take either (`029`). The contrast is standard or more, and only the whole page takes it.

**Terms of art.**

- **High contrast** (in code, `more`): Kuiper's high-contrast colours, in force on the whole page. **Standard** is today's colours.
- **Forced colours**: the browser's mode that replaces every author colour with the user's palette (`028`). A different mode, with no Kuiper colours at all.
- **The axis**: the attribute `data-contrast` on `<html>`, and the media query `prefers-contrast: more`.
- **An HC pair**: a colour variable's value under high contrast, `light-dark(<HC light>, <HC dark>)`.
- **A swatch**: one proposed high-contrast primitive.
- **A row**: one pair the contrast rules measure, a foreground role on a ground role, with its target.
- **The binding row**: of a swatch's rows, the one closest to its target.

## The problem, counted

All EXECUTED (031), on the tree with `029`'s, `031a`'s and `031b`'s values; the review reproduced each figure that predates `sunken` (EXECUTED (review)).

- **No high contrast.** No `prefers-contrast` rule, no contrast attribute, no store (*scoped* §1; the bench's `theming.prefersContrast` reads 0).
- **Below 7:1 text, light: 23 of 38.** `primary` on `sunken` 4.88; `muted-foreground` on `sunken` 5.13; `muted-foreground` on `muted` 5.86; `primary` on `muted` 5.58; `destructive` on `muted` 4.77; `success` on `muted` 4.67; `caution-text` on `muted` 4.55; `destructive` on its tint 5.10; `success` on its tint 5.09; and 14 more between 5.03 and 6.48.
- **Below 7:1 text, dark: 10 of 38.** `muted-foreground` on `muted` 5.43; `primary`, `destructive` and `success` on `muted`, 6.87 to 6.90; the tints 5.19 and 5.21.
- **Below 4.5:1 non-text.** Light: `input` 3.20 to 4.02; `chart-3` 1.76 and 2.01 (an exception today); `chart-4` and `success-fill` 4.36. Dark: `input` 3.12 to 3.91. Every line role (`border`, `sidebar-border`, `groove-line`, and `sunken-line` on `sunken`), solid after `031b` but quiet: 1.11 to 1.48. An overlay's edge under the scrim: 3.59 to 4.29 (light), 3.74 to 4.02 (dark).
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
- **Who writes it.** In an app with the `theme` item, the head script and the store own the attribute (decision 4); markup cannot set it there. In an app without the `theme` item, the app's markup or its own script may. So the way to hold a page at standard contrast depends on which it is (decision 4, "Holding a page at standard").
- **It is honoured on `<html>` alone.** The owner's ruling. And the mechanism needs it: a high-contrast block redeclares roles, because `light-dark()` holds two values, not four (*scoped* §4). Redeclared on a subtree, every copy declared on `:root` (`--surface-*`, `--code-*`) would keep the standard pair: the derived-variable trap. On `<html>`, the copies and the high-contrast roles sit on the same element, so the copies substitute the high-contrast pair (EXECUTED (031); EXECUTED (review): the attribute on a subtree changed nothing, in three engines).
- **No rule reads `data-contrast` on any other element.** T4 holds it.
- *Why a second attribute, not a third and fourth `data-scheme` value:* the scheme can be set on any subtree; the contrast cannot. Folding them into one attribute would offer `data-scheme="dark-more"` on a subtree, which cannot work. Spectrum models the same two axes in its data (*hc* §1).

### 2. How it composes with `light-dark()`

`light-dark()` takes only two values, so the contrast cannot be a third arm. It is a choice of **which pair** each variable holds. The scheme then picks the arm, where each colour is painted, as `029` does.

- **The block, in the theme's CSS and in `kuiper.css`:**

  ```css
  @supports (color: light-dark(#000, #fff)) {
    html[data-contrast="more"],
    html[data-contrast="more"] .dark {
      --muted-foreground: light-dark(#444a55, #b9b3a5);
      --primary: light-dark(#2236c3, #95b2ff);
      /* … the 32 variables of decision 6, each an HC pair … */
    }
    @media (prefers-contrast: more) {
      html:not([data-contrast="standard"]),
      html:not([data-contrast="standard"]) .dark {
        /* … the same 32 declarations … */
      }
    }
  }
  ```

- **Specificity.** `html[data-contrast="more"]` and `html:not([data-contrast="standard"])` are (0,1,1). They beat `:root` and `.dark` (0,1,0) on `<html>`, in any source order.
- **Every scope follows without a rule of its own.** A `data-scheme` element redeclares no token (`029` decision 2). It inherits the root's HC pairs and picks its arm. The scope rule's eight restorations read the `--surface-*` copies, which hold HC pairs on `<html>`. So a scope inside a field reads high contrast too (EXECUTED (031); EXECUTED (review)).
- **The `.dark` alias needs its own list item, until 0.15.0.** `.dark` restates every standard pair (`029` decision 4). Without a rule, a `.dark` subtree on a high-contrast page would read standard colours. So each rule lists `… .dark` too, at (0,2,1), which beats `.dark`. The review deleted that item from a built block and saw every engine read the alias at standard values (EXECUTED (review)).
- **This depends on `.dark`'s copies being `var()`s.** `.dark` restates the 8 `--surface-*` copies (and `029` keeps the 16 `--code-*` copies on `:root` only). Each must be written as `var(--<role>)`, as `src/app.css` does today, not as a literal pair. A literal pair on `.dark` would hold the standard colours, and a scope inside a `.dark` alias would restore standard `primary` and `muted-foreground` (INFERRED; the review's mutation shows how sensitive this path is). T4 asserts that every copy `.dark` declares is a `var()`.
- **The three legacy selectors need nothing.** They set only the mode's marks and the ink ground (`029` decision 4), and high contrast changes neither (decision 6).
- **The ink surface needs nothing.** It sets only `--background` and the code ground, from the grounds, which high contrast does not change. Its text inherits the root's HC pairs and reads their dark arm.
- **The mode's marks do not change.** They are the logotype's dots, which WCAG 1.4.6 exempts.
- **Why inside `@supports (color: light-dark(#000, #fff))`:** in an engine without `light-dark()` every HC pair is invalid. The `… .dark` item at (0,2,1) would beat the fallback's `html :is(.dark, …)` at (0,1,1), and a `.dark` subtree there would lose its colours. Inside the condition, an older engine ignores the block and uses decision 3's hex sets.
- **It survives the builds that matter.** Three Vite 8.3.5 production builds (no minify; `029`'s `Features.LightDark` exclusion; defaults) each kept the positive `@supports` once, with the `@media` nested inside, and its pairs unlowered. Read in three engines, 66 runs, 0 mismatches (EXECUTED (review)).
- **No `:root` or `.dark` is a selector-list item inside any at-rule** (001 decision 14). shadcn-svelte 1.7.1 writes `@supports … { @media … { … } }` as nested at-rules, and a second and third `add` are byte-identical (EXECUTED (review)).
- **The media rule repeats the attribute rule.** Two selectors cannot share one rule across a media query. Gzip removes the repeat almost entirely (decision 16).

### 3. The fallback carries high contrast too

`029`'s fallback serves Safari 16.4 to 17.4, which have `prefers-contrast` (Safari 14.1) but not `light-dark()` (*hc* §2). Without a high-contrast set there, the setting would show "more" and change nothing. So the fallback gains two hex sets, printed after `029`'s two:

```css
@supports not (color: light-dark(#000, #fff)) {
  /* … 029's dark set, light set, root rule, ink and mode rules … */
  html:root[data-contrast="more"]:is(.dark, [data-scheme="dark"]),
  html[data-contrast="more"] :is(.dark, [data-scheme="dark"], .surface-ink) {
    /* the 32 variables as dark HC hexes, then the 8 --surface-* and 16 --code-* copies */
  }
  html:root[data-contrast="more"],
  html[data-contrast="more"] [data-scheme="light"] {
    /* the 32 variables as light HC hexes, then the copies */
  }
}
```

- **Specificity** mirrors `029` decision 6: the dark HC set is (0,3,1) on the root and (0,2,1) below it, so it beats `029`'s dark set; the light HC set (0,2,1) beats `029`'s light set, and loses to the dark HC set on a dark root. A light scope inside a dark one reads light HC by order.
- **The copies are redeclared,** because in the fallback every value is a hex, and a copy is fixed where it is declared (`029` decision 6.1).
- **It keys on the attribute alone.** With scripts on, the head script always writes it (decision 4). With scripts off, `029`'s fallback reads light and standard; this keeps that. An older Safari with scripts off and Increase contrast on reads standard, at AA.
- **Weight:** 0.42 kB gzipped (EXECUTED (review)). It goes with `029`'s fallback, by the same trigger (`029` Q1).
- Proven by emulation, as `029`'s is (T6), and in the review's built fallback (EXECUTED (review)).

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
  - **It overwrites any `data-contrast` the server rendered.** That is deliberate: the reader's setting wins over the page's markup in an app with the `theme` item.
  - **`THEME_SCRIPT` changes value.** `020` has already changed it in this cycle, and `029` changes it too. An app compares tags, so if all three ship in 0.13.0 it updates a CSP hash once (Q5; decision 18's one hash step). An app that passes `nonce` does nothing.
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
- **Holding a page at standard contrast** (the review's finding 2):
  - **In an app with the `theme` item:** call `contrast.set("standard")`. That stores the choice, and the head script reads it on the next load. Markup cannot do it there: the head script and the store overwrite it.
  - **For a screenshot or a capture:** set the capture tool's emulation, such as Playwright's `contrast: "no-preference"`. No app change is needed.
  - **In an app without the `theme` item:** put `data-contrast="standard"` on `<html>` in the markup. Nothing overwrites it.
  - T7 tests all three, including that a server-rendered `standard` is overwritten in an app with the `theme` item.

### 5. The high-contrast primitives

The owner's ruling: "new shades of the brand's hues, measured to 7:1 and approved by the owner." The proposal is 25 swatches, re-derived after the review on the tree `029` and `031b` leave. They are shown, each beside its source, in the exhibit: [`swatches.png`](../research/2026-11-15-high-contrast/swatches.png), [`in-use.png`](../research/2026-11-15-high-contrast/in-use.png) and [`swatches.html`](../research/2026-11-15-high-contrast/swatches.html). **Q1 asks the owner to approve them.**

**Where each swatch's grounds and lines come from.** Not from a list in the derivation. Every row a swatch must pass is read from the files:

- the contrast file's `text`, `nonText`, `field`, `glass`, `glassOverGlass` and `scrim` rows, as `021` carries them, with `029`'s two tint pairs and `031a`'s allowed rows on `sunken`;
- less the contrast file's `restricted` block (`031a`): a restricted pair is not a row, in any context, so no swatch is derived against it;
- the contrast file's new `more` section (decision 13): its added line rows, the glass edge's grounds and the code rows.

A swatch is derived against every row it appears in, as a foreground or as a ground (white on `blue-more` binds `blue-more` as much as `blue-more` on wash does). **A role cannot slip past:** T16 holds that every role of both scheme files is in a row, or listed in the `more` section's `exempt` with its reason. The re-derivation's first run caught one, light `elevation-line`, in no row; three rows now hold it (*hc* §6).

**How each is made** (*hc* §3 and §6). These are the rules T2 depends on, named so its exact hexes reproduce:

1. It starts from the primitive its role uses today.
2. It moves in OKLCH lightness alone, in steps of exactly 0.001 from the source's L: darker in light, lighter in dark.
3. At each L, chroma starts at the source's C and falls in steps of 0.001 until every linear sRGB channel is within [−1e-6, 1 + 1e-6]. The hue is the source's, exactly.
4. Channels are gamma-encoded, clamped to [0, 1] and rounded half up to bytes (`Math.round`).
5. The first L whose hex meets every row is the swatch: the least change that passes.
6. The swatches are derived in decision 5's table order; then the whole list again, until a pass changes nothing (a tint moves with its text).
7. A swatch whose result equals its source, or another primitive's hex, is not new: the role takes that primitive.

**Targets:** 7:1 for text; 4.5:1 for non-text and for an overlay's edge under the scrim.

**A primitive that already passes is reused, not replaced.** The grounds, the marks, `ink` and `paper` stay. So do light `chart-1`, `chart-2`, `chart-5` and `destructive-fill`, and dark `caution-text`, `scrim`, every dark chart and both dark fills. Light `chart-3`, `chart-4` and `success-fill` move to existing primitives that pass 4.5:1 (decision 7). Each such role lists its candidates in order, and the first that passes its rows is taken.

**The swatches** (EXECUTED (031); the full rows, on every ground, are in the exhibit and in `palette.json`):

| Scheme | Name | From | Hex | Binding row | Before → after |
|---|---|---|---|---|---|
| light | `ink-soft-more` | `ink-soft` `#505661` | `#3D424D` | `muted-foreground` on `sunken` | 5.13 → 7.01 |
| light | `blue-more` | `blue` `#2D48D4` | `#1D2AB8` | `primary` on `sunken` | 4.88 → 7.04 |
| light | `red-more` | `red-text` `#C11E31` | `#99011F` | `destructive` on `muted` | 4.77 → 7.01 |
| light | `green-more` | `green-text` `#007351` | `#01553B` | `success` on `muted` | 4.67 → 7.06 |
| light | `yellow-more` | `yellow-text` `#806200` | `#5E4701` | `caution-text` on `muted` | 4.55 → 7.02 |
| light | `line-more` | `line-input` `#857E70` | `#645D50` | `sunken-line` on `sunken` | 1.22 → 4.53 |
| light | `red-tint-more` | `red-more` at 10% over raised | `#F5E6E9` | `destructive` on it | 5.10 → 7.30 |
| light | `green-tint-more` | `green-more` at 10% over raised | `#E6EEEB` | `success` on it | 5.09 → 7.52 |
| dark | `paper-soft-more` | `paper-soft` `#A39D90` | `#B9B3A5` | `muted-foreground` on `muted` | 5.43 → 7.01 |
| dark | `blue-lifted-more` | `blue-lifted` `#93B0FF` | `#95B2FF` | `primary` on `muted` | 6.90 → 7.04 |
| dark | `red-lifted-more` | `red-lifted` `#FF9491` | `#FFA29E` | `destructive` on its tint | 5.21 → 7.01 |
| dark | `green-lifted-more` | `green-lifted` `#60C498` | `#69CDA0` | `success` on its tint | 5.19 → 7.01 |
| dark | `paper-line-more` | `paper-line-input` `#7A7366` | `#958E80` | `input` on `muted` | 3.12 → 4.50 |
| dark | `red-tint-lifted-more` | `red-lifted-more` at 10% over ink-raised | `#382C26` | `destructive` on it | 5.21 → 7.01 |
| dark | `green-tint-lifted-more` | `green-lifted-more` at 10% over ink-raised | `#293027` | `success` on it | 5.19 → 7.01 |
| light | `code-violet-more` | `code-violet` `#7032B9` | `#6B2BB3` | on the active line | 6.47 → 7.03 |
| light | `code-blue-more` | `code-blue` `#3350CB` | `#2943BD` | on the active line | 5.85 → 7.00 |
| light | `code-green-more` | `code-green` `#007150` | `#015C41` | on the active line | 5.30 → 7.06 |
| light | `code-yellow-more` | `code-yellow` `#6C5A00` | `#5F4F02` | on the active line | 5.94 → 7.07 |
| light | `code-orange-more` | `code-orange` `#A34D15` | `#863A01` | on the active line | 5.08 → 7.04 |
| light | `code-plum-more` | `code-plum` `#922F6E` | `#8B2968` | on the active line | 6.46 → 7.05 |
| light | `code-red-more` | `code-red` `#B81C2E` | `#A50021` | on the active line | 5.68 → 7.03 |
| light | `code-grey-more` | `code-grey` `#636972` | `#4C515A` | on the active line | 4.86 → 7.00 |
| dark | `code-red-lifted-more` | `code-red-lifted` `#FC8D8A` | `#FF9692` | on the code ground | 6.50 → 7.00 |
| dark | `code-grey-lifted-more` | `code-grey-lifted` `#9EA4AE` | `#AEB4BE` | on the code ground | 5.84 → 7.03 |

- **Three swatches changed when `sunken` became public** (*hc* §8). Each now binds on `sunken`, and each reads higher than before on every other ground:
  - `ink-soft-more` `#444A55` → `#3D424D`: `muted-foreground` on `sunken`, 6.20 → 7.01;
  - `blue-more` `#2236C3` → `#1D2AB8`: `primary` on `sunken`, 6.13 → 7.04;
  - `line-more` `#6D6659` → `#645D50`: `sunken-line` on `sunken`, 3.95 → 4.53.

  `031a`'s second re-check estimated `#3C424D`, `#1C2AB8` and `#645D50`. The derivation's exact values, by rules 1 to 7, are `#3D424D`, `#1D2AB8` and `#645D50`: each the least change that passes, so the first two sit one step lighter in one channel than the estimates. Each keeps its hue (decision 5's hue rule) and passes on every other ground. Every dark swatch already passes on `#0B0A07` (the lowest, `paper-line-more`, 6.08). The other 22 swatches are unchanged.
- **Earlier, one hex changed after the review:** `red-lifted-more` is `#FFA29E`, not the first draft's `#FFA29F`. Rule 4's half-up rounding gives it, and the reviewer derived the same from the prose (*hc* §6).
- **Fifteen are the brand's four hues and its neutrals** (with the four tints). Ten are Meridian's code hues (decision 11). Dark needs no new yellow: `yellow-lifted` is already 10.51 on ink-wash.
- **The light set reads as the same brand, darker.** Of the hues, the largest move is yellow, OKLCH L 0.512 to 0.411, then green (0.492 to 0.398), red (0.524 to 0.432) and blue (0.479 to 0.397). The neutral line moves most of all, 0.595 to 0.481. **The dark set barely moves:** blue by L 0.005.
- **Light yellow text reads olive-brown.** `yellow-more` `#5E4701` (the caution text) and `yellow-text` `#806200` (the third chart series) keep the brand's yellow hue within 0.4°. But at L 0.41 to 0.51 a yellow hue no longer reads as yellow. The brand's yellow fills (`caution`, field-3, the third dot) do not change. Q1 says so.
- **Dark `syntax-blue` aliases `blue-lifted-more`:** its own derivation gave the same hex, and primitive hexes must be unique (`021` decision 12; rule 7).
- **The names** end in `-more`, after the attribute's value, so a reader can find every high-contrast primitive by one suffix.
- **In the base file,** each is a `color` token in the `primitive` group, with a `$description` and `$extensions["co.plutosystems.kuiper"]`:
  - `"since": "0.13.0"` (or the release it lands in);
  - `"derived": { "from": "<primitive>", "target": 7 | 4.5, "direction": "darker" | "lighter" }`, or, for the four tints, `029`'s `"composite": { "of", "over", "alpha" }`. The rows it was derived against are not copied into the token: they are the contrast file's, and T2 reads them there;
  - if the owner adjusts a swatch by hand (Q1's second option), `"adjusted": "<the owner's words>"` beside `derived`.
- **The derivation lives in `scripts/contrast.ts`,** as `deriveForContrast(source, rows, target, direction)`, beside `contrastRatio`, with rules 1 to 7. That keeps "one home for the arithmetic" (`tests/unit/colour.test.ts`). The OKLCH conversion it needs moves there from `tests/helpers/colour.ts`, which then imports it.
- **The hue rule, for 8-bit hexes.** The derivation keeps hue exactly; rounding to bytes moves it, more as chroma falls. Rounded, `code-grey-more` moves 3.95°, `ink-soft-more` 3.36°, `line-more` 1.58°, `paper-line-more` 1.56° and `paper-soft-more` 1.37° (*hc* §8). So the tolerance scales with chroma: **`max(1°, atan(0.0025 / C))`, C the swatch's own OKLCH chroma.**
  - *The constant's basis* (the re-check's R2): rounding a colour to 8-bit sRGB moves it at most **0.0021** in the OKLab a–b plane, measured over 120,871 in-gamut samples (EXECUTED (review), `quant.py`; median 0.0006, 99.9th percentile 0.0018). 0.0025 clears that worst case, so a correct derivation cannot fail the rule by rounding alone. 0.002 would have failed about one colour in a thousand.
  - That is 1° at C ≥ 0.143, 6.5° at C = 0.022, 8.8° at C = 0.016. Every swatch is within it, using at most half its tolerance (EXECUTED (031)). A high-chroma swatch moved by 5° fails it (T2's mutation).

### 6. Which roles change, and to what

**Light: 28 roles change. Dark: 18.** Every other role keeps its standard primitive in high contrast.

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
| `border`, `sidebar-border`, `groove-line` | `line` (solid after `031b`, `#DCDAD3`) → `line-more` | `paper-line` (`#37342E`) → `paper-line-more` |
| `sunken-line` (`031b`) | `paper-sunken-line` (`#C7C3B8`) → `line-more` | `ink-sunken-line` (`#22211E`) → `paper-line-more` |
| `chart-3` | `yellow` → `yellow-text` | unchanged |
| `chart-4`, `success-fill` | `green` → `green-text` | unchanged |
| `scrim` | `ink-scrim` → `ink-scrim-deep` | unchanged (already `ink-scrim-deep`) |
| `syntax-violet`, `-blue`, `-green`, `-yellow`, `-orange`, `-plum`, `-red`, `-grey` | `code-<hue>` → `code-<hue>-more` | `syntax-blue` → `blue-lifted-more`; `syntax-red`, `syntax-grey` → `code-<hue>-lifted-more`; the others unchanged |

**Beside the roles,** four more variables change, which are not roles:

- `--field-2` and `--field-4`, light only: `red` → `red-more`, `green` → `green-more` (decision 12);
- `--glass-tint` and `--glass-edge`, both schemes (decision 9).

So each high-contrast block declares **32 variables**, as HC pairs: 28 roles, two fields and two glass variables (EXECUTED (031)).

**What does not change, and why:**

- **The grounds:** `background`, `card`, `popover`, `secondary`, `muted`, `accent`, `sidebar`, `sidebar-accent`, `raised`, `sunken`, `syntax-ground`, `syntax-active-line`. Keeping them keeps the brand's paper and graphite, and keeps `--ink-ground` and the ink surface untouched. Primer keeps its grounds too (*hc* §1).
- **`foreground` and every `*-foreground` on a fill:** ink and paper already pass 7:1 everywhere (lowest: ink on wash 15.24; paper on ink-wash 12.87).
- **The marks** (decision 2).
- **`caution`,** the yellow fill: ink on it is 9.53.
- **`destructive-fill`, light `chart-1`, `chart-2` and `chart-5`, and the dark charts and fills:** already 4.5:1 or more on every ground they may sit on.
- **`031b`'s disabled roles: `disabled`, `disabled-foreground`, `disabled-edge`.** `031b`'s three disabled roles keep their standard values under high contrast; no `-more` value is made for them. They are exempt from this specification's targets (WCAG 1.4.3 and 1.4.11) and are listed in the contrast file's `more` section as `exempt`. `031b` holds them to its own targets, the same in every context: `disabled-foreground` at 3:1 or more on `disabled`, `card` and `background`, and `disabled-edge` at 1.5:1 or more on `background` and `card`. `031b`'s check runs in both `-more` contexts too, and passes there whenever it passes at standard.
  - *Why:* high contrast is for reading what a reader can act on. A disabled control should stay visibly quieter than an enabled one, and under high contrast the enabled ones grow stronger, so the difference widens.
  - The owner confirmed the exemption with Q4's answer.

**A new public ground must come with its rows.** Any specification that adds a role used as a ground adds, to the contrast file, a row for each foreground and line that may sit on it. T3 and T16 then run those rows under `more`, and if a `-more` swatch fails on the new ground, `palette.ts` re-derives it, and the changed swatch goes to the owner before it lands.

**`sunken` is the first such ground** (`031a`, by the owner's answer). The rule applies to it in full:

- **Its allowed rows join the `more` rows,** read from the contrast file through `tree.draft.json`, not typed in: `foreground`, `muted-foreground` and `primary` as text, at 7:1; the `ring` at 4.5:1; and the line row of the next bullet.
- **`031b`'s `sunken-line` is a line role on `sunken`.** Under `more` it takes the re-derived `line-more` in light and `paper-line-more` in dark, with the line row `[sunken-line, sunken]` at 4.5:1.
- **Every restricted pair stays restricted under `more`,** read from the contrast file's `restricted` block: `destructive`, `success` and `caution-text` as text; the `input` edge; the status fills, `caution`'s included; the five chart colours; and `031b`'s `disabled-foreground` and `disabled-edge`, on `sunken`, in both schemes. They are restricted in every context, by the design lead's ruling on `031a`'s S1: an item cannot change by contrast mode any more than by scheme. No `-more` row is made for them, and no swatch is derived against them. For information only, under high contrast light reads `destructive` 6.14, `success` 6.18, `caution-text` 6.14, `input` 4.53, `destructive-fill` and `chart-2` 3.90, `success-fill` and `chart-4` 4.09, `chart-3` 3.98; dark passes every one (EXECUTED (031)). `031a`'s tests 12 and 13 keep them out of every item and page.
- **Three light swatches change for it** (decision 5). Dark needs nothing new.

**220 pairs measured, 0 below target** (EXECUTED (031)), 105 light and 115 dark: 38 text and 37 non-text rows per scheme (the contrast file's 21 non-text, the `ring` on `sunken`, 12 line rows and 3 glass-edge rows), 4 field, 3 glass and 3 scrim rows, and 20 light and 30 dark code rows. Every role of both schemes is in a row or exempt (T16).

**Once shipped, a variable stays in the block** (the review's finding 8). The CLI replaces and adds declarations, but never removes one (`029` decision 4). So if a later change made an override redundant and the generator dropped it, an installed app would keep the old declaration, holding its old pair. The rule:

- the contrast file's `more` section holds `shipped`, the list of variable names the block has carried in any release, committed at this specification's landing with these 32;
- the generator writes the union of `shipped` and the computed list; a shipped variable that no longer differs holds its standard pair;
- a name leaves `shipped` only by a release that removes it, with a guide step telling apps to delete it;
- T4 holds that every name in `shipped` is declared in the block.

### 7. Non-text: lines, charts and the scrim at 4.5:1

- **`input` and `elevation-line`** take the neutral `-more` swatch: 5.17 on wash in light, now that `line-more` binds on `sunken`, and 4.50 on ink-wash in dark.
- **`border`, `sidebar-border`, `groove-line` and `sunken-line` take the same swatch.** After `031b` they are solid but quiet, 1.11 to 1.48 with its draft hairline, which WCAG allows for a decorative line. Under the owner's 4.5:1 ruling they rise too, as Primer's borders do in its high-contrast themes (*hc* §1). After `031b`, this changes only their colour, not their kind. **The owner confirmed it (Q4): all lines to 4.5:1.**
  - Twelve rows join the `more` section, so each line role is measured on each ground it sits on: `border` on `background`, `card` and `muted`; `sidebar-border` on `sidebar` and `sidebar-accent`; `groove-line` on `background`, `card` and `muted`; `elevation-line` on `background`, `card` and `muted`; `sunken-line` on `sunken`.
- **Charts.** A chart colour is non-text, so it needs 4.5:1, not 7:1. Light `chart-3` (yellow, 1.76 today, an exception) takes `yellow-text`, 5.03; light `chart-4` (green, 4.36) takes `green-text`, 5.16. The others pass as they are. Charts and status fills are restricted on `sunken` in every context (decision 6), so they are not measured there.
  - **The light yellow exception does not carry into high contrast.** The contrast file's `exceptions` apply to the standard contexts only (decision 13).
  - **Chart distinctness falls in light, for one reader.** The closest pair of the five series under deuteranopia goes from **7.0** ΔE at standard (chart-2 against chart-4) to **4.1** (chart-2 against `yellow-text`). Under protanopia it is 6.8 in both. Dark is unchanged: 4.8 under deuteranopia, 3.1 under protanopia (EXECUTED (031); EXECUTED (review)). A reader who asked for more gets less, in this one respect. The book's rule that a yellow series is labelled directly carries the meaning, and `038`, the data palette, re-measures the charts under both contrasts.
  - *Why it is not lower:* had charts been allowed on `sunken`, they would have had to reach 4.5:1 there, which takes the darker text swatches and drops the figure to 3.0 (EXECUTED (031), *hc* §8). The S1 ruling restricts them there, so 4.1 holds.
  - **T3 pins 4.1 as a floor:** a later change, `038`'s included, may not lower it.
- **`success-fill`** takes `green-text` (5.16). No item paints text on a fill role (EXECUTED (031), grep: the destructive button paints `bg-destructive`, a text role).
- **The scrim** deepens, in light only, to `ink-scrim-deep`, which dark already uses. An overlay's edge under it then reads 5.02 to 5.84 in light and 5.41 to 5.81 in dark. The scrim stays translucent: it is a layer above content, which the depth rule allows. The contrast file's six `scrim` rows take a target of 4.5 under `more`.

### 8. The focus ring

- **Its colour is `--ring`,** which takes the high-contrast `primary`: 7.04 or more on every light ground, `sunken` included, and 7.04 or more on every dark one. Inside a field, the ring is the field's legend: **7.02 or more** (light field-1, white on the brand blue, which keeps its fill; decision 12).
- **Its width and offset do not change:** 2 px and 2 px (`focus` in the base file). A 2 px solid outline, offset from the control, at 4.5:1 or more, already meets WCAG 2.4.13 (AAA, focus appearance). The token stays one value in every context, so the resolver's base set needs no override.
- **No dotted style.** Carbon turns its focus outline dotted under `prefers-contrast` (*hc* §1). A dotted line paints half the pixels of a solid one, which lowers the indicator's area. Kuiper keeps it solid.

### 9. The glass under high contrast: solid

The owner's depth rule: transparency signifies depth, so only a layer above content is translucent. The glass is such a layer (the bar, `/brand/` panels). The rule says where translucency may appear; it does not require a layer to be translucent. The question is whether the glass stays translucent when the reader has asked for more contrast. **This specification makes it solid, and the owner confirmed it (Q2): solid glass with a 4.5:1 edge.** It overrides "glass everywhere" (`019a`) in this one mode.

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
- **Under high contrast, both are 10% over `card`.** At 20% in dark, the red text must lighten to `#FFD2CF` to clear 7:1 on its own tint, and the green to `#BBE6D3`. Those no longer read as red and green. At 10%, the lift is small (`#FFA29E`, `#69CDA0`), and the tint is still 1.21:1 from the card (EXECUTED (031), `tint-probe2.ts`). The alert's edge, `border-destructive` or `border-success`, carries the boundary, as it does today.
- The four tint swatches carry `029`'s `composite` extension, so the validator recomputes them (decision 5).

### 11. Code: Meridian at 7:1

- Code is text, so the ruling's 7:1 applies to it. The owner's Meridian palette is not the brand's four hues. But each code hue moves the same way, in lightness alone, so each keeps its hue and its place in the palette.
- **Light: 8 of 10 code hues move** (decision 5's table); `code-navy` and `code-ink` already pass. **Dark: 3 move;** the other 7 pass.
- **The code rows** are in the `more` section, read from the files: each syntax role on `syntax-ground` and `syntax-active-line`, and in dark on `background` too, as `tests/unit/contrast.test.ts` measures today.
- The 16 `--code-*` slots follow, since they are copies of `--syntax-*` on `<html>` (decision 2).
- The existing distinctness test ("no two coloured roles under ΔE 5.0") runs on the high-contrast contexts too, and its figure is pinned (T3).

### 12. The fields

- A field's legend is text on the field's fill, so it needs 7:1.
- **Only light `field-2` and `field-4` fall short:** 5.61 and 4.96 today. Under high contrast their fills take `red-more` and `green-more`: 8.82 and 8.88.
- **Every other field keeps its fill:** light `field-1` 7.02 and `field-3` 9.53; dark 8.67, 8.67, 13.2 and 8.62 (EXECUTED (031), the adopted fills; EXECUTED (review)). So the brand's blue and yellow fields, and every dark field, look the same in high contrast.
- **Light field-1 is the closest pass of any field, 0.02 above target.** A change that lowers it, such as an adjustment at Q1 to `blue`'s neighbours, is caught by T3.
- **After `031b`, no alpha line is left.** `031b` decision 8 makes the field's edge the legend at 24% over the field's own fill, so it is solid. It is a decorative edge drawn on the field's level, and high contrast does not change it.

### 13. The resolver: two contexts, two override files, and the `more` section

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

- **The override files restate, whole, only the tokens high contrast changes.** `kuiper.light-more.tokens.json` holds 28 `role` tokens, 2 `field` tokens and 2 `glass` tokens. `kuiper.dark-more.tokens.json` holds 18 roles and 2 glass tokens. Each token keeps its scheme file's `$type` and `$description`; only `$value` differs. They rely on the Resolver module's stated rule, the last occurrence of a token wins, token by token (`021` decision 2).
- *Why contexts, not a second `contrast` modifier:*
  - Each context is complete: a tool that flattens `dark-more` gets every token, with no alias that reaches across modifiers.
  - A second modifier would need per-scheme high-contrast values reachable from one `more` file. That means a `role-more` group in each scheme file, present in the standard contexts too, doubling the roles every reader sees (`021` decision 7's second way).
  - Primer does the same: an override file per scheme (*hc* §1). It is the Resolver module's own example.
- **The cost:** `scheme` now has contexts that are not `data-scheme` values. So the rule becomes: every context name is a `THEMES` value, or a `THEMES` value followed by `-more`. `029`'s T1 still holds unchanged. `scripts/tokens.ts` gains `CONTRASTS = ["standard", "more"]`.
- **The flattened files** (`021` decision 13) gain two: `kuiper.light-more.json` and `kuiper.dark-more.json`, published beside the others at `/r/tokens/`.
- **The lowering** (`021` decision 3) adds one top-level field to `Tokens`: `more: { light: Record<role, primitive>, dark: Record<role, primitive>, field: { light, dark }, glass: { light, dark } }`, the partial maps. Nothing else in the object changes. `Theme` stays `"light" | "dark"`.
- **The validator** gains these rules:
  - an override file's token paths are a subset of its scheme file's, in the same order;
  - each restates `$type` and `$description` equal to the scheme file's;
  - each colour aliases a primitive, as a role does;
  - each `-more` primitive's `derived` record is complete, and its OKLCH hue is within `max(1°, atan(0.0025 / C))` of its source's (decision 5's hue rule);
  - a primitive with `composite` equals `compositeTenths(of, over, alpha)` (`029`'s rule, unchanged).
- **The contrast file gains a `more` section.** Its draft is [`more.draft.json`](../research/2026-11-15-high-contrast/more.draft.json):
  - `text: 7`, `nonText: 4.5`, `scrim: 4.5`: the targets;
  - `nonTextAdded`: the twelve line rows of decision 7;
  - `glassEdge`: the grounds the glass edge is measured on;
  - `code`: the syntax roles and their grounds per scheme (decision 11);
  - `exempt`: each role in no row, with its reason (the four marks, the two clear roles, `raised` as `card`'s twin, and `031b`'s three disabled roles, held by `031b`'s own check);
  - `shipped`: the variables the block has carried (decision 6).

  `contrastTable(tokens, theme, contrast)` takes the contrast as a third argument, defaulting to `standard`. Under `more` it uses the high-contrast maps and targets, applies no `exceptions`, adds the section's rows, and leaves out every pair in the contrast file's `restricted` block (`031a`), which holds in all four contexts. The site's contrast tables, the bench and `deriveForContrast`'s callers read it. Nothing in a script lists a ground.
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

A change that adds weight to every page states it (`024` decision 5). **About +1.0 to +1.4 kB gzipped per page, on every template** (an estimate):

| Part | Gzipped per page |
|---|---|
| The high-contrast block, attribute and media rules (decision 2) | 0.42 kB (EXECUTED (031); EXECUTED (review)) |
| The fallback's two sets (decision 3) | 0.42 kB (EXECUTED (review)) |
| The glass rule (decision 9) | 0.03 kB (EXECUTED (review)) |
| The head script's added lines, inline in every page | about 0.1 kB (INFERRED, about 250 B raw) |
| The site bar's `ContrastToggle`, the store and the icon, on every page | about 0.3 to 0.5 kB (INFERRED, from `ThemeToggle`'s size) |

- The smallest headroom in `024`'s table is `/`, 307 against 340 kB. After `029`'s +0.73 kB, this fits every template.
- The builder measures the built site before and after, and the landing notes give the figure per template (`024`). If it does not fit, the builder stops and asks for a ruling.

### 17. The site

- **The setting, in the bar** (the owner's answer to Q3). `ContrastToggle` sits beside `ThemeToggle` in `src/lib/site/chrome/bar.svelte`.
  - **From 360 px wide, both toggles are `icon`, 48 px.** The bar has 66 px to spare at 360 and 96 at 390; a second toggle and its gap need 52 (EXECUTED (review), `bar.mjs`).
  - **Below 360 px, both toggles are `icon-sm`, 32 px.** At 320, the WCAG 1.4.10 reflow width, the bar has 26 px to spare. Shrinking `ThemeToggle` frees 16 px; the contrast toggle and its gap need 36. So 6 px remain (INFERRED, from the review's measurement). Each is still above WCAG 2.5.8's 24 px target, and both stay one press away.
  - The 360 px threshold is declared once, as the site's own breakpoint in `site.css` (`@theme { --breakpoint-xs: 22.5rem; }`), so the markup reads `xs:` and holds no literal width.
  - *Why not move it into the Menu sheet below `md`:* that hides a control a reader needs at the widths where reading is hardest, behind a second press. Shrinking keeps it in reach.
  - T10 checks 320, 360, 390 and 1440: no horizontal overflow, and the toggle reachable and operable at each.
- **The frames carry the contrast.** `src/lib/site/example-theme-script.svelte` writes `data-contrast` from `?contrast=` when present, else from `kuiper-contrast` and the system, with decision 4's logic. It listens for `storage`, so a frame follows the bar's toggle at once. `src/lib/preview/block-viewer.svelte`'s `copyTheme` copies `data-contrast` with `data-scheme`, and its observer watches it. Without this, a page in high contrast would show its examples standard. **The thumbnails stay standard:** they are pictures of the catalogue, not the reader's page, and decorative (`alt=""`).
- **The theme page** (`/components/kuiper-theme/`) gains an example, "More contrast": the `029` sampler in a frame with `?contrast=more`, in both schemes.
- **`/start/light-and-dark/`** gains a section, "More contrast". It covers:
  - what it is, and how it differs from forced colours;
  - the attribute, the media query and the toggle;
  - that it is set on `<html>` only;
  - how to hold a page at standard (decision 4);
  - the table of roles that change (decision 6), generated from the token files.
- **`/foundations/colour/`'s contrast tables** gain the two high-contrast contexts, from `contrastTable(…, "more")`.
- **`/brand/colour/`** gains a section, "More contrast": the 15 brand and neutral swatches (decision 5's first fifteen rows), each beside its source, with its ratio. Generated from the token files, with the page's `source` comments, as the page's other claims are.
- **`/foundations/accessibility/`** says what Kuiper supports: two schemes, each at two contrasts, and forced colours honoured.
- **`read-token`'s example** repaints when `data-contrast` changes, as it does for `data-scheme`.

### 18. Interface changes, the changelog and the guide

**The 0.13.0 changelog** (or the release it lands in) gains one bullet per item, each marked `**interface change.**`, each linking its guide section:

- **`kuiper-theme`:** a high-contrast form of each scheme, under `prefers-contrast: more` or `data-contrast="more"` on `<html>`; text at 7:1 and edges and lines at 4.5:1; the glass becomes solid; nothing changes at standard contrast.
- **`theme`:** the head script writes `data-contrast`, so `THEME_SCRIPT` changes value; new: `contrast`, `CONTRAST_KEY`, `ContrastToggle`, `ContrastPreference`, `ResolvedContrast`.
- **Tokens:** 25 primitives; `kuiper.light-more.tokens.json`, `kuiper.dark-more.tokens.json`; the contexts `light-more` and `dark-more`; two flattened files; `kuiper.css`'s high-contrast block.

**The CSP hash: one step, in `020`'s section.** `020`'s, `029`'s and this specification's guide sections would each tell an app to update its hash. If all three ship in 0.13.0, the step is written once, in `020`'s section, naming the three changes to `THEME_SCRIPT`: the rename, `data-scheme`, and `data-contrast`. `029`'s and this section point to it. If this slips to 0.14.0 (Q5), the 0.14.0 guide carries its own hash step.

**The upgrade guide's section, "`031`: more contrast,"** at `/changelog/0.13.0/upgrade/`. Its steps:

1. **Update `kuiper-theme` and `theme` together:** `add kuiper-theme theme`. If you allow the head script by a CSP hash, see `020`'s hash step: update it once for this release.
2. **Readers who ask for more contrast now get it.** With the theme item alone, the page follows `prefers-contrast: more`. Nothing else is needed.
3. **To let readers choose,** add `<ContrastToggle />` beside `<ThemeToggle />`, or build a menu from `contrast.set`.
4. **To hold a page at standard contrast,** do it only for a reason, such as a brand screenshot: a reader asked for more. With the `theme` item, call `contrast.set("standard")`; markup is overwritten. For a capture, set the tool's emulation (Playwright: `contrast: "no-preference"`). Without the `theme` item, set `data-contrast="standard"` on `<html>` in the markup.
5. **Your own colours do not follow.** A colour from a role does. A literal colour, or an app's own token, stays as it was. Use roles.
6. **Set `data-contrast` on `<html>` only.** A subtree with it changes nothing.

**For the 0.15.0 alias removal** (`029` decision 4's list): the two `… .dark` selector items in decision 2's block, and `.dark` in decision 3's sets, go with the alias. `029`'s landing adds them to that row's list.

### 19. What `031` does not do

- **No contrast on a subtree.** By ruling, and by mechanism (decision 1).
- **No `less` and no `custom`.**
- **No change to standard contrast:** every standard value, every role's standard primitive and every standard ratio stays as `029` and `031b` leave it.
- **No change to the disabled roles** (decision 6).
- **No density or type change.** Larger text is the reader's zoom; WCAG 1.4.6 is met by colour.
- **No forced-colours change** (`028`).
- **No high-contrast row for a restricted pair** on `sunken` (decision 6).

### 20. The order in lane T, with `031a` and `031b`

- **The order in lane T is `031a`, then `031b`'s token edit, then this; `031a`'s `sunken` is a public ground.** `031a`'s Knock-ons name the same order, and `031b`'s author has aligned with it.
- **`031` covers `031b`'s public roles; `031b` owes no high-contrast pairs.** This specification carries:
  - its solid `line` and `paper-line`: the line roles' high-contrast values are this specification's `-more` neutrals, measured on every ground they sit on (decision 7). They do not depend on the hairline's standard value, so `031b` may still change it (its light value is provisional);
  - its `sunken-line`: `line-more` in light and `paper-line-more` in dark, with the row `[sunken-line, sunken]` at 4.5:1 (decision 6);
  - its three disabled roles: kept at their standard values, exempt from this specification's targets, held to `031b`'s own targets by `031b`'s own check, which runs in the `-more` contexts too (decision 6).
- **This specification carries `031a`'s `sunken` too:** its allowed rows under `more`, its restricted pairs kept restricted, and the three swatches re-derived for it (decisions 5 and 6).
- **When `031a` and `031b` land,** `palette.ts` re-runs from the token file before this builds. If a swatch changes, it goes back to whoever rules Q1.

## Design

### The emitted shape, in `src/app.css`

An excerpt, after `029`'s blocks. Values are the proposed swatches, lower case as the generator writes them.

```css
@supports (color: light-dark(#000, #fff)) {
  html[data-contrast="more"],
  html[data-contrast="more"] .dark {
    --muted-foreground: light-dark(#3d424d, #b9b3a5);
    --primary: light-dark(#1d2ab8, #95b2ff);
    --ring: light-dark(#1d2ab8, #95b2ff);
    --destructive: light-dark(#99011f, #ffa29e);
    --success: light-dark(#01553b, #69cda0);
    --caution-text: light-dark(#5e4701, #f8d874);
    --input: light-dark(#645d50, #958e80);
    --border: light-dark(#645d50, #958e80);
    --sunken-line: light-dark(#645d50, #958e80);
    --chart-3: light-dark(#806200, #f8d874);
    --scrim: #0b0f1799;
    --destructive-tint: light-dark(#f5e6e9, #382c26);
    --syntax-grey: light-dark(#4c515a, #aeb4be);
    --field-2: light-dark(#99011f, #ff9491);
    --glass-tint: light-dark(#fbfaf6, #221f19);
    --glass-edge: light-dark(#645d50, #958e80);
    /* … 32 in all … */
  }
  @media (prefers-contrast: more) {
    html:not([data-contrast="standard"]),
    html:not([data-contrast="standard"]) .dark { /* … the same 32 … */ }
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
- **The list of variables** is the union of two lists: every variable whose HC pair differs from its standard pair, computed; and the `more` section's `shipped`, committed. A shipped variable that no longer differs is written with its standard pair (decision 6). So a later change can add to the block, never silently drop from it.
- `kuiper.css`'s writer calls the same functions (decision 14).

## Scope

**In:**

- **Tokens:** 25 primitives in `tokens/kuiper.tokens.json`; `tokens/kuiper.light-more.tokens.json` and `tokens/kuiper.dark-more.tokens.json`; two contexts in `kuiper.resolver.json`; the `more` section of `kuiper.contrast.json`.
- **Scripts:** `scripts/tokens.ts` (`CONTRASTS`, the lowering's `more`, the validator); `scripts/contrast.ts` (`deriveForContrast`, the OKLCH conversion moved from `tests/helpers/colour.ts`, `contrastTable`'s third argument, the scrim rows' target); `scripts/build-tokens.ts` (decision 2's, 3's and 9's blocks, `shipped`, `kuiper.css`, the flattened files); `scripts/bench/kuiper.ts` (`theming.dataContrast`; `contrastPairs` counted across four contexts, noted in the run log).
- **Generated:** `src/app.css`; `registry.json`'s `kuiper-theme` and `theme`; `kuiper.css` and the flattened files; `static/r/`.
- **Items:** `src/lib/registry/ui/theme/theme-script.svelte`, `contrast.svelte.ts` (new), `contrast-toggle.svelte` (new), `index.ts`; the `theme` item's `files` in `registry.json`.
- **The site (lane S):** the bar and `site.css`'s one breakpoint; the two frame scripts; the theme page's example; `/start/light-and-dark/`; `/foundations/colour/`, `/foundations/accessibility/`, `/brand/colour/`; the `read-token` example; a test view, `src/routes/(view)/view/high-contrast/`, out of the sitemap.
- **The harness (lane E):** one Playwright project, `axe-more`, in `playwright.config.ts` (T8).
- **Ledgers:** `CHANGELOG.md`; `src/lib/site/upgrade/0.13.0.ts`, including the merged hash step in `020`'s section.
- **The tests below.**

**Out:**

- Contrast on a subtree; `less`; `custom` (decision 19).
- The data palette's re-measure under both contrasts (`038`), held to T3's floor.
- Any change to a standard value, to `031a`'s restricted pairs, and to `031b`'s disabled roles.
- A Windows run by hand: `028`'s manual Edge run before 1.0 adds high contrast to its checklist (landing note), nothing more here.

## Tests to write first

Each test is written before the change and seen failing for the reason given. E2E tests run in `chromium-*`, `firefox-*` and `webkit-*` (`022`), on the production preview (`029` decision 8). A test that passes today is proven by mutation, and the landing notes say which.

| # | Name | File | Asserts | Fails today because |
|---|---|---|---|---|
| T1 | the resolver's contrast contexts | `tests/unit/tokens-dtcg.test.ts` | `scheme` has contexts `light`, `dark`, `light-more`, `dark-more`. Each `<s>-more` lists `<s>`'s file then `kuiper.<s>-more.tokens.json`. Every context name is a `THEMES` value or one followed by `-more`. Each override file's paths are a subset of its scheme file's, in order, each with equal `$type` and `$description`. Light holds 28 roles, 2 fields, 2 glass; dark 18 roles, 2 glass (counts re-pinned on the landing tree). The removed record is unchanged | no contexts, no files |
| T2 | the swatches are derived, and approved | same | The 25 primitives exist with `since` and `derived` (or `composite`). For each with `derived` and no `adjusted`, `deriveForContrast(from, rows, target, direction)`, with the rows read from the contrast file, returns a hex within 1 per channel of its own, and the stored hex meets every row. Each hue is within `max(1°, atan(0.0025 / C))` of its source's. Each `adjusted` swatch meets its rows and the same hue rule. Every primitive hex is unique. Each tint equals `compositeTenths(of, over, 0.1)`. *Mutation:* `blue-more` moved 5° in hue at the same L fails the hue rule | no primitives |
| T3 | every row at its target | `tests/unit/contrast.test.ts` | `contrastTable(tokens, theme, "more")` for both schemes: every text row at 7 or more, every non-text and line row at 4.5 or more, every scrim row at 4.5, no row an exception. `sunken`'s allowed rows are present, read from the contrast file. **No row names a pair in the `restricted` block, and the block holds in all four contexts.** **`031b`'s own disabled check runs in both `-more` contexts and passes as it does at standard.** Fields, the solid glass, the glass edge and every code row at their targets. The code distinctness test holds under `more`, its closest pair printed. **The light chart pair under deuteranopia is at least 4.1 ΔE under `more`: a floor.** Light field-1 is at least 7.0 | no `more` |
| T4 | the block's shape | `tests/unit/high-contrast.test.ts` | In `kuiper-theme`'s `css`: one `@supports (color: light-dark(#000, #fff))` key, holding exactly the two rules of decision 2 with their exact selector lists, and inside it one `@media (prefers-contrast: more)` holding the same declarations. The declared names are the union of the computed set (32 today) and the `more` section's `shipped`, each an HC pair matching the two `-more` contexts, or the standard pair for a shipped name that no longer differs. No selector reads `[data-contrast` except directly on `html`. No `:root` or `.dark` is a list item inside an at-rule (001 decision 14, PostCSS `list.comma`). **Every `--surface-*` and `--code-*` copy that `.dark` declares is a `var()`.** The glass rule exists twice, as decision 9 gives it. `029`'s T3 still passes. *Mutation:* a shipped name removed from the computed set is still declared | no block |
| T5 | the fallback's sets | same | Inside `@supports not (…)`, after `029`'s sets, two rules with decision 3's selectors. The dark one holds every name of T4 as its dark HC hex, and the 8 surface and 16 code copies; the light one the same in light | no sets |
| T6 | the axis in three engines | `tests/e2e/high-contrast.spec.ts` | On `/view/high-contrast/`, `029`'s sampler at the page and three deep (opposite, page, opposite), in a `.dark` alias and a light scope inside it, inside a field, inside ink, and a glass panel. For each case of: `contrast: "more"` with no attribute and scripts off; `data-contrast="standard"` with `contrast: "more"`; `data-contrast="more"` with no preference; the attribute on a subtree only (changes nothing); each on a light and a dark root. Every sample's computed `color`, `background-color` and `border-*-color` equals the token file's value for its scheme at that contrast. The glass's `background-color` has alpha 1 and `backdrop-filter` is `none` under high contrast. *Also:* with every `light-dark(` renamed in the served CSS (`029`'s T12 method), the same readings hold where the attribute is set | no axis: every case reads standard |
| T7 | the head script, the store, the toggle and the opt-out | `tests/e2e/theme.spec.ts`, `tests/unit/registry.test.ts` | With modules aborted (`020` test 9's method): stored `more` on a no-preference system gives `data-contrast="more"`; stored `standard` with `contrast: "more"` gives `standard`; no key follows the system; a stored `banana` follows the system. **A server-rendered `data-contrast="standard"`, with `contrast: "more"` and no key, becomes `more`** (decision 4: the reader wins). With modules on: `ContrastToggle` is a button named "More contrast", `aria-pressed` follows `contrast.resolved`, Enter and Space toggle it, and toggling writes the attribute and the key. `contrast.set("standard")` holds standard across a reload with `contrast: "more"`. A change of the emulated `contrast` writes the attribute while no key is stored. A `storage` event from another page updates it. A page without the theme item's script, with `data-contrast="standard"` in markup and `contrast: "more"`, reads standard. `THEME_SCRIPT` holds `kuiper-contrast` and `data-contrast`. `theme`'s `index.ts` exports the four names | no attribute, no exports |
| T8 | the pages at AAA | `tests/e2e/axe.spec.ts`, new project `axe-more` | Every page in `SITEMAP`, at 1280, in both schemes, with `contrast: "more"`: axe with `color-contrast-enhanced` (WCAG 1.4.6) enabled reports 0 violations. Each check is tagged by item and check, as `030` tags, so its report shows it. Run in Chromium; the component pages also in Firefox and WebKit | standard colours fail 1.4.6 on many pages |
| T9 | beside forced colours | `tests/e2e/forced/*.spec.ts` (`028`'s check) | `028`'s per-item check, run again with `forcedColors: "active"` and `contrast: "more"` together, in Chromium and Firefox: every result equals the forced-only run | passes today; proven by mutation: a high-contrast rule that sets `outline-style: dotted` on `:focus-visible` changes Firefox's result |
| T10 | the site's setting and frames | `tests/e2e/site.spec.ts`, `tests/e2e/frames.spec.ts` | The bar holds `ContrastToggle` beside `ThemeToggle` at **320, 360, 390 and 1440**. At each: `document.documentElement.scrollWidth` equals the viewport width (no horizontal overflow), the toggle is visible, not clipped by the bar, and pressing it sets `data-contrast="more"`. Below 360 both toggles are 32 px; from 360, 48 px. Every example frame on the page reads `data-contrast="more"` within one second, without reload. A frame with `?contrast=more` reads high contrast on a standard page. A block view copies the attribute | no toggle; frames write no contrast |
| T11 | `kuiper.css` | `tests/unit/tokens-dtcg.test.ts` (`021`'s T9, as `029` rewrote it) | Eight blocks, in decision 14's order. Every declaration it shares with `src/app.css` has the same value. The header holds decision 14's sentence | seven blocks |
| T12 | the CLI and a production build | `tests/smoke/upgrade.test.ts` (`029`'s T17) | After `add kuiper-theme theme` from 0.12.0 and fresh, `app.css` holds the `@supports` block with its nested `@media`, written as nested at-rules. A second `add` is byte-identical. The app's production build (with `029`'s Vite line) keeps `@supports (color: light-dark(`, `prefers-contrast: more` and the HC pairs unlowered | no block |
| T13 | the site's build keeps the block | `tests/e2e/build-output.spec.ts` (`029`'s T23) | The built CSS holds the `@supports (color: light-dark(#000, #fff))` block, its `@media (prefers-contrast: more)`, and HC pairs with `light-dark(` intact | no block |
| T14 | the changelog and the guide | `tests/unit/registry.test.ts`, `tests/e2e/upgrade.spec.ts` | The entry holds decision 18's three bullets, marked interface change, naming `data-contrast`, `prefers-contrast`, `THEME_SCRIPT`, `ContrastToggle` and `kuiper.light-more.tokens.json`. The guide holds the section's six steps, in order. `020`'s section holds one hash step naming the three `THEME_SCRIPT` changes, and no other section holds a hash step | no text |
| T15 | the docs show it | `tests/e2e/docs.spec.ts` (or the pages' specs) | `/start/light-and-dark/` has a "More contrast" section whose role table equals the override files. `/foundations/colour/` shows four contrast tables. `/brand/colour/` shows the 15 brand and neutral swatches with ratios equal to `contrastRatio`'s. The theme page's "More contrast" example renders in both schemes with 0 axe violations | no such content |
| T16 | no role slips past | `tests/unit/contrast.test.ts` | Every role of both scheme files appears in a row of the contrast file (standard or `more`), as foreground, ground or scrim, or is in the `more` section's `exempt` with a non-empty reason. Every name in `exempt` is a role. *Mutation:* a new role added to both scheme files with no row fails, naming it; so does a new ground with no rows | no `more` section |

## Acceptance criteria

1. **The tokens.** T1 and T2 pass. The DTCG files hold the tree's primitive count plus 25 (85 on today's plan: 48, `029`'s 4, `031a`'s 2, `031b`'s 6, and 25) and four contexts; the roles per scheme are unchanged by this specification. The landing notes pin each from the tree. (unit)
2. **The ratios.** T3 and T16 pass: 0 rows below target in either high-contrast context, and every role in a row or exempt. The landing notes give the pinned row count (220 on the draft tree) and the chart floor. (unit)
3. **The CSS.** T4, T5 and T11 pass. `029`'s T1 to T7 still pass unchanged. (unit)
4. **The axis.** T6 passes in Chromium, Firefox and WebKit, modern and emulated fallback: 0 mismatched readings. (e2e)
5. **The setting.** T7 and T10 pass. `020`'s tests 9 and 10 and `029`'s T15 and T16 still pass. (e2e, unit)
6. **AAA on every page.** T8 passes: 0 `color-contrast-enhanced` violations under high contrast. Each fault it finds is fixed before landing: in a token, by this build; in an item's classes, by a small change in lane I, landed first. (e2e)
7. **Forced colours undisturbed.** T9 passes. (e2e)
8. **The CLI and builds.** T12 and T13 pass. (smoke, e2e)
9. **Standard contrast unchanged.** With no attribute and no preference, every value `029`'s T10 reads is unchanged, and the standard rows of `contrast.test.ts` are unchanged. (e2e, unit)
10. **The changelog, the guide and the docs.** T14 and T15 pass. (unit, e2e)
11. **Weight.** The landing notes give the built site stylesheet and the bar's chunk, gzipped, before and after, per template. They fit `024`'s headroom, and `perf.spec.ts`'s budgets pass. (perf)
12. **The swatches are the owner's.** Q1 is answered on the re-derived exhibit, and the landing notes record the answer and any adjusted swatch. (owner)
13. **The suites.** `bun run test:unit`, `bun run test:e2e:engines` and `bun run test:smoke` pass; `bun run check` reports 0 errors; `bun run lint` is clean, the literal lint included. (all)
14. **Tests first, and the checkpoint.** T1 to T8 and T10 to T16 are seen failing first, and T9 by mutation. At the checkpoint, the design lead looks at the test view, the theme page's example, `/brand/colour/` and the bar, in both schemes at both contrasts, at 1440, 390 and 320, in three engines, on the production preview, at a dense page (the sidebar, a table) for the heavier lines, and at a well painted `sunken`. Rulings go into the landing notes. (checkpoint)
15. **The scorecard.** The loop runs (`roadmap.md` §4). Row 4 moves 3 → 4 and row 3 gains (f). The change review cites it. (bench)

## Build order

1. **Confirm the tree.** `020`, `021`, `028`, `029`, `031a`'s and `031b`'s token edits have landed (decision 20). Re-run `palette.ts`, now reading the landed contrast file and scheme files in place of the drafts. The swatches must come out as the owner approved them, or the owner sees the difference before Q1 is taken as answered. Re-pin every count.
2. **Tests first.** T1 to T16 and the test view. Run them; record what fails and why.
3. **Tokens.** The primitives, the override files, the contexts, the contrast file's `more` section with `shipped`. `deriveForContrast` and the validator. T1 to T3 and T16 go green.
4. **The generator.** The three blocks, the fallback sets, `kuiper.css`, the flattened files. T4, T5, T11 go green. A second `build:tokens` writes nothing.
5. **The theme item.** The head script, the store, the toggle. T7 goes green.
6. **Checkpoint, part one:** the test view, three engines, both contrasts. T6, T12, T13.
7. **The site:** the bar and its breakpoint, the frames, the docs, the Brand colour page. T10, T15.
8. **AAA.** The `axe-more` project. Fix what it finds (criterion 6). T8. Then T9.
9. **The ledger:** the changelog, the guide with the merged hash step, `static/r/`. T14.
10. **Weight**, against `024` (decision 16).
11. **Checkpoint, part two** (criterion 14).
12. **The suites, then the scorecard loop** (criteria 13 and 15). Add decision 18's two items to the 0.15.0 alias-removal row.

## Predicted scorecard movement

- **Row 4, theming: 3 → 4.** (c) "A contrast scheme" goes from – to ✓, joining `029`'s (a), (b) and (e): a count of 4. Evidence: T6 in three engines on a production build, and the bench's `theming.prefersContrast` and `dataContrast` above 0. Kuiper then ties Material, Primer and Radix, and is the only one of them that follows `prefers-contrast` with its own colours (*hc* §1).
- **Row 3, accessibility evidence: (f) ✓.** "A high- or increased-contrast scheme." With `028`'s (e), `022`'s (h) and `030`'s (d), the row reaches 3, as the roadmap plans. T8's AAA scan, tagged per item, also adds evidence to (a) and (g).
- **Row 5, tokens: held at 4.** The new primitives carry descriptions, `since` and their derivation; two more flattened outputs.
- **Row 8, page weight: held,** if decision 16's figure fits `024`'s budgets.
- **Row 11, change communication: held.** One more guide section; one hash step fewer.

## Risks

- **The swatches are the owner's call, and they gate the build.** The spec, the tests and the generator do not depend on the exact hexes: T2 re-derives them from the contrast file's rows, and an adjusted swatch carries its reason. So a change at Q1 changes data, not design.
- **`031b`'s light hairline is provisional.** Its review may make it darker, or redeclare it on `031a`'s stage ground. The line swatches do not depend on it, and the disabled roles keep their values, so a change should move no swatch. `palette.ts` re-runs from the token file when `031b` lands, and the landing notes record the run.
- **AAA may find faults in items.** Any text drawn with an opacity, a placeholder colour, or a literal will show in T8. Each is a finding to fix (constitution §4.4); the number is unknown until the scan runs. If it is large, the design lead may split the fixes into small changes before this lands.
- **Lines get heavier.** Every line becomes 4.5:1. Dense pages (the sidebar, tables) will look busier in high contrast. That is what the reader asked for, and Primer does the same, but Q4 lets the owner keep dividers lighter.
- **The chart pair under deuteranopia falls to 4.1 ΔE in light** (decision 7). Labels carry the meaning; T3 holds 4.1 as a floor; `038` re-measures. It holds while charts stay restricted on `sunken`: allowing them there would drop it to 3.0.
- **`sunken` is a public ground with restricted pairs** (`031a`). High contrast keeps them restricted; `031a`'s tests guard them in every context. An app that breaks it with status text reads about 6.1 in light high contrast; with a status fill or a chart colour, 3.90 to 4.09.
- **The bar at 320 px has 6 px to spare** with both toggles at 32 px (decision 17). A later item in the bar breaks it; T10 catches it at 320.
- **A real Windows contrast theme** may match `less` or `custom`, not `more`. Then forced colours alone apply, which is `028`'s domain and correct.
- **Slipping to 0.14.0** changes `THEME_SCRIPT` between a second pair of tags, so CSP-hash apps update twice (Q5).
- **The alias doubles two selector items until 0.15.0.** It compresses to almost nothing.
- *Closed by the review:* "a positive `@supports` could be rewritten by a minifier". Three Vite 8.3.5 builds kept it, with its nested `@media` and unlowered pairs, and three engines read it right (EXECUTED (review)). T12 and T13 keep it closed.

## Open questions for the owner

Recommended option first. Q2 to Q5 are answered (Landing notes). Q1 waits on the re-derived exhibit; the design lead rules it overnight, by the owner's delegation.

**Q1. Do you approve the high-contrast swatches?** The 25 swatches of decision 5, re-derived on the tree `031a`, `029` and `031b` leave, with `sunken` a public ground. They are shown beside their sources in [`swatches.png`](../research/2026-11-15-high-contrast/swatches.png), and in use, with a well painted `sunken`, in [`in-use.png`](../research/2026-11-15-high-contrast/in-use.png) (live: [`swatches.html`](../research/2026-11-15-high-contrast/swatches.html)). Each keeps its hue and moves in lightness alone, the least that reaches 7:1 for text and 4.5:1 for lines and edges, on every ground the contrast rules put it on, `sunken` included. 220 pairs, 0 below target; every hue within its tolerance.

What changed since the last exhibit, and why:
- **Three light swatches darken, because `sunken` is now a public ground,** and each must reach its target there:
  - `ink-soft-more` `#444A55` → `#3D424D` (muted text on `sunken`, 6.20 → 7.01);
  - `blue-more` `#2236C3` → `#1D2AB8` (the primary blue, the link and the focus ring on `sunken`, 6.13 → 7.04);
  - `line-more` `#6D6659` → `#645D50` (every line, including `sunken-line` on `sunken`, 3.95 → 4.53).

  Each now reads higher on every other ground too. The other 22 swatches, and the whole dark set, are unchanged.
- **What `031a` restricts on `sunken` stays restricted under high contrast,** in every context: the status text, the `input` edge, the status fills (`caution`'s included), the chart colours, and `031b`'s two disabled pairs. No swatch is derived for them. So on a well the measured pairs are `foreground`, `muted-foreground` and `primary` text, the `ring`, and the lines.

What you will notice:
- **Light yellow text still turns olive-brown.** The caution text becomes `yellow-more` `#5E4701` and the third chart series `yellow-text` `#806200`. Both keep the brand's yellow hue within 0.4°, but at this darkness a yellow no longer reads as yellow. The yellow fills (caution, field-3, the third dot) do not change.
- **Light charts still get closer for one reader:** under deuteranopia the closest pair falls from 7.0 to 4.1 ΔE, and 4.1 stays a floor (T3). Series are labelled directly, so no meaning rests on colour alone.
- **The light primary blue is darker,** `#1D2AB8`: links, the primary button and the focus ring.
- **Every line becomes a 4.5:1 line,** in a well too (your Q4 answer).
- **The dark set barely changes.**

Options:
1. **Approve all 25 as derived.** *Recommended.* They are the smallest change that meets your targets on every ground, `sunken` included, and they read as the same brand.
2. **Approve with named changes.** Name any swatch to adjust, for example "a yellower `yellow-more`". The changed swatch still must reach its target and keep its hue; it carries your words in the token file, and T2 checks it.
3. **Allow the hue to move too.** Derive again letting hue shift up to a set number of degrees, for brighter colours at the same contrast, such as a light caution text that reads more yellow. The exhibit is redrawn and put to you again.

**Q2. Does the glass stay translucent under high contrast?** *Answered:* "Solid glass with a 4.5:1 edge." (Option 1.) Applied in decision 9.
1. **No: it becomes solid,** with a 4.5:1 edge, as under reduced transparency. *Recommended.*
2. **Yes: it stays translucent,** with the 4.5:1 edge only.
3. **Solid for the bar only;** the `/brand/` panels stay translucent.

**Q3. Where does the reader set it on the site?** *Answered:* "A toggle beside the theme toggle: 48 px from 360 px wide, both 32 px below." (Option 1.) Applied in decision 17.
1. **A "More contrast" toggle beside the theme toggle in the bar, at every width:** 48 px from 360 px wide, and both toggles 32 px below that, so the bar fits at 320. *Recommended.*
2. **A "Display" menu** holding scheme and contrast, replacing the theme toggle.
3. **Only on `/start/light-and-dark/`.**

**Q4. Do dividers rise to 4.5:1, or only control edges?** *Answered:* "All lines to 4.5:1. Disabled controls stay exempt, as WCAG allows." (Option 1.) Applied in decisions 6 and 7.
1. **All lines: `border`, `sidebar-border`, `groove-line`, `sunken-line`, `input`, `elevation-line`, the glass edge.** *Recommended.* Disabled controls are exempt, as WCAG allows. They keep their values, so they stay quieter than enabled ones.
2. **Control edges only** (`input`, `ring`, the glass edge).
3. **Dividers at 3:1,** with one more swatch per scheme.

**Q5. Which release?** *Answered:* "0.13.0." (Option 1.)
1. **0.13.0, wave 3, as the roadmap places it.** *Recommended.* `THEME_SCRIPT` changes once between tags.
2. **0.14.0.**

## Review response

The specification review ([`../reviews/031-high-contrast-spec-2026-11-15.md`](../reviews/031-high-contrast-spec-2026-11-15.md)) asked for revision. Each finding is answered below. The swatches were re-derived and the exhibit redrawn (*hc* §6).

| # | Severity | Finding | Answer |
|---|---|---|---|
| 1 | High | `031a`'s `sunken` and `031b`'s roles land first; `031` names neither; on `sunken` its swatches fail | **The order is fixed** (decision 20): `029`, then `031b`'s token edit, then `031`, which carries `031b`'s roles. `031` covers `031b`'s public roles, and `031b` owes no pairs. Its solid line takes the `-more` neutrals (decision 7); its disabled roles keep their standard values, exempt here, held to `031b`'s own targets by `031b`'s own check, run under `more` too (decision 6; after `031b`'s review, its disabled pairs stay out of the contrast file). The derivation used `031b`'s draft values, on which no swatch depends, and re-runs from the token file when `031b` lands. **`sunken` is not a ground here:** following `031a`'s own review (pending the owner), it would be a private site variable, which needs no pair and carries no text: the stage holds only `<img alt="">` and the `.site-thumb` picture (READ, verified). The rule for any new public ground is decision 6's: it comes with its rows, and the swatches re-derive before landing. **Nothing typed:** `palette.ts` and `deriveForContrast` read every ground and line from the contrast file and its `more` section; T16 fails any role in no row; its first run caught light `elevation-line`. Decision 12's "one alpha line" is gone. Counts re-pinned then: 210 rows; 81 primitives. (Since superseded: `031a` made `sunken` public after the owner's answers; see below.) Q1 now goes to the owner on the re-derived exhibit |
| 2 | Medium | The markup opt-out is overwritten by the head script and the store | Decision 4, "Holding a page at standard", and guide step 4: with the `theme` item, `contrast.set("standard")`; for a capture, the tool's emulation; markup only without the `theme` item. The overwrite is stated as deliberate. Decision 1 says who writes the attribute. T7 tests all three, and the overwrite |
| 3 | Medium | The validator's 1° hue rule rejects `line-more` and `paper-line-more` | Decision 5's hue rule: `max(1°, atan(0.002 / C))`, C the swatch's own chroma; since the re-check's R2, `0.0025`, with its basis. Every swatch passes (EXECUTED); decision 13's validator and T2 use it, `adjusted` swatches included. T2's mutation is a 5° move at high chroma |
| 4 | Medium | The toggle overflows the bar at 320 px | Decision 17: 48 px from 360 px, both toggles 32 px below it (6 px to spare at 320, from the review's measurement), one site breakpoint in `site.css`. T10 checks 320, 360, 390 and 1440 for overflow and reach. Q3's option 1 says so |
| 5 | Low | `palette.json`'s field rows measured fills the design does not adopt | Regenerated with decision 12's fills: light 7.02, 8.82, 9.53, 8.88; dark 8.67, 8.67, 13.2, 8.62. Decision 8 now says 7.02; decision 12 names light field-1 as the closest pass, and T3 holds it |
| 6 | Low | Wrong or mixed figures | Corrected: the largest move is yellow (L 0.512 → 0.411), then green, then red (decision 5); the chart drop is 7.0 → 4.1 under deuteranopia, with protanopia 6.8 in both (decision 7); the probe ran 27 judged and 6 printed (*hc* §6); `palette.json`'s job strings are now generated from the roles each swatch takes; the fallback is 0.42 kB (decisions 3 and 16) |
| 7 | Low | Q1 should say what the owner will notice | Q1 and the exhibit's notice now name the olive-brown light yellow text and chart series, and the 7.0 → 4.1 ΔE chart drop. T3 pins 4.1 as a floor `038` may not lower. (It still holds after `sunken`: charts are restricted there; see below.) |
| 8 | Low | A computed variable list can shrink, but the CLI never removes | Decision 6 and the generator: the `more` section's `shipped` list; the block declares its union with the computed list; a shipped variable that no longer differs holds its standard pair until a release removes it with a guide step. T4 holds it, with a mutation |
| 9 | Low | Write-ins | **`.dark`'s copies:** decision 2 states the dependency; T4 asserts every copy `.dark` declares is a `var()`. **Tie-breaking:** decision 5's rules 1 to 7 name the step, the chroma search, the gamut tolerance, half-up rounding and the pass order; `red-lifted-more` is now `#FFA29E`, the reviewer's own result; T2 also accepts 1 per channel. **The minifier risk:** closed by the review's three Vite builds (decision 2, Risks). **One hash step:** decision 18 merges it into `020`'s section; T14 checks there is only one |

The review's agreements stand: the mechanism, the CLI, the builds, the weight, forced colours, and its read of Q2 to Q5.

**The re-check (2026-11-15)** found the specification ready, with two Low write-ins. Both are applied:

| # | Write-in | Answer |
|---|---|---|
| R1 | Keeping the disabled roles at their values reads the owner's 4.5:1 ruling; put it to the owner | Q4 now says "Disabled controls are exempt, as WCAG allows. They keep their values, so they stay quieter than enabled ones." The owner's answer to Q4 confirms it, verbatim, in the Landing notes; decision 6 cites it |
| R2 | Give the hue constant's basis, or use 0.0025 | The constant is now 0.0025, above the measured 0.0021 worst case of 8-bit rounding (decision 5, with the basis). Decision 13's validator, T2, and `palette.ts` use it |

**After the owner's answers, and `031a`'s change (2026-11-15).** The owner made `sunken` a public role, with four restricted pairs, and set the lane-T order `031a`, `031b`, `031`. By decision 6's rule, its allowed rows join the `more` rows, read from the contrast file; its restricted pairs stay restricted, with no `more` row. `031a`'s second re-check (S1) found that the status fills and chart colours fail on light `sunken` too; the design lead's ruling restricts them there, in every context. So exactly three light swatches re-derive (`ink-soft-more`, `blue-more`, `line-more`), the charts keep their earlier roles, and the light chart floor stays 4.1 (decisions 5 to 7; *hc* §§8 and 9). `031b`'s `sunken-line` takes the line swatches, and its disabled roles keep their values under its own targets (decision 6, in `031b`'s author's words). The exhibit is redrawn, and Q1 rewritten.

## Landing notes

### From `021`'s change review (2026-11-16)

`021`'s change review ([`../reviews/021-tokens-for-everyone-pr-2026-11-15.md`](../reviews/021-tokens-for-everyone-pr-2026-11-15.md), finding 4) ran the resolver with an added `light-more` context naming a missing file: `readTokens()` ignores it and passes. So this build must:

- extend `contextFiles`, `readTokenFiles` and `publishedFiles` (`scripts/tokens.ts`) to read and validate the two `-more` contexts;
- apply the scheme-file group rules only to the light and dark files;
- add a test that a context naming a missing file fails.

Decision 7's "no test needs changing" was about the second-modifier route, which this spec did not take; with extra contexts, T1 and `refs()` read the new files.

Not landed.

### Owner answers, 2026-11-15

- **Q2:** Solid glass with a 4.5:1 edge.
- **Q3:** A toggle beside the theme toggle: 48 px from 360 px wide, both 32 px below.
- **Q4:** All lines to 4.5:1. Disabled controls stay exempt, as WCAG allows.
- **Q5:** 0.13.0.

The owner chose these from options put by the design lead: each answer is the option labelled "(Recommended)".

**Q1, the swatches: a design lead's ruling, 2026-11-15, under the owner's overnight delegation.** The owner's words: "work autonomously and do not ask questions. Use sound judgment and precedence to move forward." The ruling is option 1: approve all 25 swatches as derived. The basis:

- 220 pairs measured, 0 below target. Every hue is within its tolerance.
- Only three light swatches changed from the set the owner was first shown (`ink-soft-more` `#3D424D`, `blue-more` `#1D2AB8`, `line-more` `#645D50`). Each moved in lightness alone, to the least step that reaches its target on `sunken`.
- The design lead read `in-use.png` in all four contexts. The well, its divider, the link and the muted text read clearly. The olive-brown light yellow and the 4.1 ΔE chart floor are as the owner was told.

The owner sees this in the morning status. Option 2 (named changes) stays open to the owner until `031` builds in wave 3.

### The owner's rulings this stands on (2026-11-15)

From `decisions.md` at `beeb67e` and `roadmap.md` §6 Q4, quoted in the header: a high-contrast scheme; it follows `prefers-contrast: more` and can be set by hand; contrast on `<html>` only; new shades of the brand's hues at 7:1, approved by the owner; non-text at 4.5:1; transparency signifies depth.

### Notes for later rows

- **`038`, the data palette:** re-measure the chart series under both contrasts; the light high-contrast closest pair under deuteranopia is 4.1 ΔE, now a floor in T3 (decision 7). It holds while charts stay restricted on `sunken`.
- **`031a`:** lands first in lane T, with `sunken`'s rows and `restricted` block in the contrast file, the status fills and charts included (S1); this specification reads them (decisions 6 and 20).
- **`031b`:** lands second; this specification covers its public roles, `sunken-line` included, and `031b` owes no pairs (decision 20). Its disabled check runs in the `-more` contexts too. When it lands, `palette.ts` re-runs from the token file.
- **The 0.15.0 alias removal:** decision 18's two items.
- **`028`'s manual Edge run before 1.0:** add one pass with Kuiper's high contrast set by hand, under the Aquatic theme.
