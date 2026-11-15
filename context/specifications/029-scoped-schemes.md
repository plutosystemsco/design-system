# 029 — Scoped schemes

- **Status:** draft, for specification review. Not built.
- **Date:** 2026-11-15
- **Author:** the spec author for `029`, for the design lead
- **Kind:** a feature in lane T (tokens), then lane I (existing items: `alert`, `read-token`). **Interface changes:** the shape of every colour variable in `kuiper-theme`; the root's `color-scheme`; a new attribute, `data-scheme`; `.dark` becomes an alias; the ink surface and the mode's marks lose their `.dark` rules; the `theme` item's head script and store write `data-scheme`, so `THEME_SCRIPT` changes value; `readToken` returns a colour resolved where it is read; `alert`'s two tinted variants paint solid tints. It adds two colour roles (`destructive-tint`, `success-tint`), four primitives, one private registered property (`--ink-ground`) and no dependency. Each change has a changelog bullet and a step in the upgrade guide (decisions 16 and 17).
- **Lanes:** T first (`tokens/`, `scripts/build-tokens.ts`, `scripts/tokens.ts`, `src/app.css`, `kuiper-theme`, `theme`). Then I (`alert`, `read-token`), after `023` (`roadmap.md` §3, "Cross-lane landings"). Two small edits outside them: the literal lint's tint table (decision 8), and the site's docs, examples and one attribute on the Components index (decision 14), which is lane S.
- **Written against the names `020` and `021` leave.** `020` renames the code names, so this specification says `kuiper-theme`, the `kuiper` registry, `kuiper:` context keys, the storage key `kuiper-theme`, `readStoredTheme` in `theme/stored.ts`, `scripts/bench/kuiper.ts`, and the upgrade guide at `/changelog/0.13.0/upgrade/` (`020` decisions 3, 5, 12, 13). `021` reshapes the token source, so the tokens here are **a DTCG 2025.10 resolver set under `tokens/`**: a base file `kuiper.tokens.json`, the scheme files `kuiper.light.tokens.json` and `kuiper.dark.tokens.json`, `kuiper.resolver.json` with one modifier, `scheme`, and the side files `kuiper.contrast.json` and `kuiper.removed.json`. Kuiper's extension data sits under **the vendor key `co.plutosystems.kuiper`** (`021` decisions 2, 4 and 7). The build still lowers them to today's `Tokens` object (`021` decision 3), so the generator code below reads `tokens.themes`, `tokens.primitives` and `tokens.expressiveDarkMarks`. Where `020` or `021` lands a name this specification does not foresee, theirs wins, and the builder notes it in the landing notes. The measurements below were taken on today's tree, which still says `pluto`.
- **Depends on:** `021` (the token files and `kuiper.css`, which this changes); `023` (its `alert` edit waits for `023`'s lane-I work, and `023`'s `var()` test must see the new variables); `020` (names, the head script's carry-over, the guide). Softly on `022`: its Firefox and WebKit projects run this specification's three-engine tests. If `022` has not landed, those tests launch the three engines themselves (T10).
- **Ships with:** 0.13.0, wave 2 (`roadmap.md` §3).
- **Blocks:** `031` (high contrast takes this attribute pattern and this generator), `031a` (the index card's grounds), `031b` (the depth audit; this removes the only translucent tint in an item).
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `029`: "Option B: `light-dark()` tokens with a hex fallback, `data-scheme` on any element, `dark:` banned in items, `readToken` returns a resolved colour, alert's tints as tokens." It moves scorecard row 4, theming, from 2 to 3.
- **Design call: the owner's rulings this carries.** Binding. Quoted from the retired `decisions.md` at `beeb67e` (`context/README.md`), the entries of 2026-11-15:
  - "**Light and dark scoped to any part of a page.** **The owner:** 'what should we do? we have lots to study from.'" The design lead's recommendation then, which the memo confirmed: "Each colour token holds both its values in one variable, with CSS `light-dark()`. An attribute on any element sets `color-scheme`, so any subtree can be light or dark. Registry items stop using Tailwind's `dark:` variant; a test forbids it. Every difference between schemes lives in the tokens."
  - The memo's five corrections, recorded under the same entry: "**Contrast is set on `<html>` only,** never on a subtree"; "**The scope rule also sets `color` and `background-color`,** in `@layer base`, because inherited `color` does not follow the scope"; "**Portals still need routing,** since `light-dark()` does nothing for an overlay mounted under `<body>`"; "**`readToken` must return a resolved colour,** which is an interface change"; "**Browsers without `light-dark()` get a generated fallback,** and `dark:` is banned only in `src/lib/registry/`, not on the site."
  - "**The roadmap's questions (2026-11-15)** … **The scoped-schemes questions take the memo's answers:** `light-dark()` with a generated fallback for older Safari; `.dark` kept as an alias for two minor releases; high-contrast colours as new shades of the brand's hues, measured to 7:1 and approved by the owner; non-text elements reach 4.5:1 in high contrast." The last two are `031`'s. They bind this specification only in decision 15, which leaves room for them. So `roadmap.md` §6 Q4 and row `029`'s "the owner's four questions" are answered; their text there is stale (noted for the design lead).
  - "**A high-contrast scheme.** **The owner:** 'yes to high contrast theme.'" That is `031`.
  - "**Transparency always signifies depth.** … Everything inside a layer is on that layer's level. It never lets the colour behind it show through." (the owner, 2026-11-15; `019a` decision 3). It decides that alert's tints become solid (decision 9).
  - "**The old `pluto` names keep working for one release** after `020`'s rename" sets `020`'s alias term (0.14.0). This specification's `.dark` alias has its own term, two minor releases, from the ruling above.
- **Research it stands on:**
  - [`../research/2026-11-15-scoped-schemes-and-contrast.md`](../research/2026-11-15-scoped-schemes-and-contrast.md), cited as *scoped* §n, with its §9 corrections, appended for this specification.
  - [`../specifications/021-tokens-for-everyone.md`](021-tokens-for-everyone.md) decisions 2, 7 and 11: the files, the resolver, `kuiper.css`. Decision 7 leaves `029` free: "`029`, scoped schemes, changes the CSS, not the tokens … Nothing here constrains how `029` emits."
  - [`../specifications/023-prop-doc-comments.md`](023-prop-doc-comments.md) decisions 10 and 14: the `var()` test and the lane-I order.
  - [`../specifications/019a-the-fonts-own-spacing-the-glass-bar-and-depth.md`](019a-the-fonts-own-spacing-the-glass-bar-and-depth.md) decision 3: the depth rule.
  - [`../specifications/001-tokens-and-the-registry.md`](001-tokens-and-the-registry.md) decision 14 and its rule: no rule nested in an at-rule of the theme's `css` uses the selector `:root` or `.dark`, because the CLI writes the palette into it.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md) row 4.
- **Measurements made for this specification** are labelled **EXECUTED (029)**. They are read-only greps over the working tree, and probes in the session scratchpad, on 2026-11-15:
  - a three-engine fixture of the emitted shape (`/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/029/probe.mjs` and `probe2.mjs`, output in `probe-out.txt` beside them), on the repository's Playwright 1.64.1: Chromium, Firefox and WebKit;
  - a Tailwind 4.3.3 `compile()` of the CLI's output (`tw.mjs`);
  - the tint colours and their contrast, from `scripts/contrast.ts` (`tints.ts`);
  - a size estimate of the colour blocks, gzipped.
  Web facts are **CITED**, read on 2026-11-15. The builder pins every count again on the tree `021` and `023` leave.

## Intent

Today a part of a page can be dark, but not light. `class="dark"` makes a subtree dark, and the ink surface uses it. Nothing makes a subtree light inside a dark page. Three things leak through: Tailwind's `dark:` variant, which reads any `.dark` ancestor; three `.dark …` descendant rules in the theme; and every derived variable, such as `--code-text`, which is fixed where it is declared. `015` gave up and showed each example in its own framed document (*scoped* §1).

This specification lets any element take either scheme, nested to any depth, in both directions. Each colour variable holds both its values in one `light-dark()`. An attribute, `data-scheme="light"` or `"dark"`, sets the element's `color-scheme`. The browser then picks each colour where it is painted. Nothing is declared twice, so nothing derived goes stale.

It also does four things that depend on it: it keeps `.dark` working for two minor releases; it gives browsers without `light-dark()` a generated hex fallback; it removes `dark:` from items, which means alert's tints become tokens; and it makes `readToken` return a colour a canvas can use.

**Terms of art.**

- A **scheme** is light or dark. A **scope** is an element whose subtree takes a scheme of its own: one with `data-scheme`, the alias `.dark`, or the ink surface.
- **`light-dark(a, b)`** is a CSS colour function. It gives `a` or `b` by the **used colour scheme** of the element that paints with it: its `color-scheme`, inherited, or the reader's system preference when that is `light dark`.
- The **derived-variable trap**: a `var()` inside a custom property is substituted where it is declared, so a copy declared on `:root` keeps `:root`'s value everywhere (*scoped*, "Terms"). With `light-dark()`, the copy holds the whole pair, so it stays right in every scope (*scoped* §3, EXECUTED).
- A **registered** property is one declared with `@property` and a `syntax`. A registered `<color>` property computes to one colour on the element that declares it, and inherits that colour (*scoped* §3).
- The **fallback** is the CSS that browsers without `light-dark()` use: today's hex values, per scheme, under `@supports not (color: light-dark(#000, #fff))`.
- **Baseline**: the web-features project's mark for a feature supported in every major engine. "Widely available" means 30 months after that.

## The problem, counted

All counts EXECUTED (029), on today's tree.

- **`dark:` in `src/lib/registry/`: 2 uses, in 1 file.** `ui/alert/alert.svelte` line 10, `dark:bg-destructive/20`, and line 12, `dark:bg-success/20`. No other item file holds a `dark:` variant, `@variant dark`, `:is(.dark` or `[.dark_&]`. The literal lint already forbids `dark:` (L2) and translucent tints (L1), except for exactly these four: `bg-destructive/10`, `bg-success/10`, and their two `dark:` twins (`scripts/lint-literals.ts`, `SANCTIONED_TINTS`). They are the only alpha state tints in any item.
- **`.dark …` rules in the theme: 3** (`.dark .surface-ink`; `.dark [data-mode="expressive"]` with its `[data-mode="expressive"].dark` twin; `.dark [data-mode="productive"]` with its twin). Each depends on an ancestor, not on the nearest scope.
- **Colours written twice.** `src/app.css` declares 145 variables in `:root` and 98 in `.dark`. The 16 `--code-*` slots and the 7 `--surface-*` copies are repeated in `.dark` only to escape the trap (`build-tokens.ts`, its comments on the code slots and on `brandTheme`).
- **No light island is possible.** No `.light` rule, no `data-scheme`, no `light-dark()` (the bench's `theming` block: `lightDarkFn` 0, `dataScheme` 0, `lightReset` 0).
- **`readToken` reads raw text.** It returns `getPropertyValue("--x")`. Once a token is a `light-dark()` pair, that text is `light-dark(#2d48d4, #f3f0e8)`. Chromium and WebKit reject it as a canvas `fillStyle`, and Firefox paints the light value inside a dark scope (*scoped* §3, EXECUTED). Its documented use, the canvas mark on the `read-token` page, would break.
- **The site uses `dark:` for content, not colour: 10 uses in 5 files** (`dark:hidden`, `dark:inline`, `dark:block`, `dark:grid`; four examples of the theme page, and the Components index), and one `.dark .site-thumb` rule in `site.css`. Those stay (decision 8).
- **One name collides.** The Components index puts `data-scheme="light" | "dark"` on each thumbnail `<img>` (`src/routes/(site)/components/+page.svelte`, read by `tests/e2e/site.spec.ts` lines 819 and 836). Under this specification that attribute makes the image a scope. It is renamed (decision 14).

## What this specification measured, beyond the memo

- **The emitted shape works in all three engines, nested three deep** (EXECUTED (029), `probe.mjs`). On a light page: a dark scope's text `rgb(243, 240, 232)` on `rgb(22, 20, 15)`; a light scope inside it, `rgb(11, 15, 23)` on `rgb(243, 240, 232)`; a dark scope inside that, dark again. `--code-text`, declared once on `:root` as `var(--syntax-ink)`, read the right colour at each level. The `.dark` alias read the same as `data-scheme="dark"`. The expressive mark read the lifted blue in a dark scope. Chromium, Firefox and WebKit gave identical readings, with the system light and dark.
- **A scope inside a field read the field's legend: a contrast failure** (EXECUTED (029)). A field resets `--foreground` to `var(--field-1-foreground)`, which is itself a pair. A dark scope inside a light `field-1` resolved it to the dark legend, `rgb(22, 20, 15)`, on its own dark ground, `rgb(22, 20, 15)`: 1:1, in all three engines. The memo's "Field utilities, which reset roles, keep working" (*scoped* §4, INFERRED) is incomplete. **The fix:** the scope rule restores the seven roles a field resets from the `--surface-*` copies, as `surface-plain` already does. Probed again (`probe2.mjs`): `rgb(243, 240, 232)` on `rgb(22, 20, 15)`, in all three (decision 2).
- **The ink surface can find its page's scheme at any depth** with a registered `<color>` property declared on every scope but the ink surface itself (EXECUTED (029)): ink on a light page `rgb(22, 20, 15)`; in a dark scope `rgb(34, 31, 25)`, the dark `card`; in a light scope inside that, `rgb(22, 20, 15)` again; on a root that follows a dark system, `rgb(34, 31, 25)` (decision 3).
- **The emulated fallback reproduces every reading** (EXECUTED (029)). With every `light-dark(` renamed `light-dark-x(`, the `@supports not` block applied, and the probe's readings matched the modern ones in all three engines, the field case included.
- **The CLI does not see a `light-dark()` value as a colour** (READ, `node_modules/shadcn-svelte/dist/index.mjs`, 1.7.1, function `xs`). It treats a value as a colour only if it starts with `hsl`, `rgb`, `#` or `oklch`, or contains `--color-`. For any other value it writes `--<name>: var(--<name>)` into `@theme inline`, not `--color-<name>: var(--<name>)`. So no `bg-background` utility would exist in an app (decision 7).
- **That self-reference is harmless** (EXECUTED (029), `tw.mjs`). Tailwind 4.3.3 emits `--background: var(--background)` inside `@layer theme`, where the unlayered `:root` value wins. Installed apps already carry 16 such lines today, one per code slot, since `var(--syntax-ink)` is not a colour to that check either (INFERRED from the same function).
- **The CLI matches `:root` and `.dark` as whole selector-list items** (READ, functions `ps` and `hs`: `rule.selectors.includes(".dark")`). So a rule whose selector list holds `:where([data-scheme="dark"], .dark)` is not written into. A list that holds a bare `.dark` item is.
- **The CLI accepts `@property` in an item's `css`** (READ, function `ws`: a `@property` key is written as its own rule). Tailwind 4.3.3 passes it through, and adds its own `@layer properties` fallback for engines without `@property` (EXECUTED (029)). `@property` is Baseline since 2024-07-09: Chrome 85, Firefox 128, Safari 16.4 (CITED, [web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/registered-custom-properties/)). That is inside Tailwind's own floor (*scoped* §3).
- **`light-dark()` is Baseline since 2024-05-13 and is expected to be widely available from 2026-11-13**: Chrome 123, Edge 123, Firefox 120, Safari 17.5 (CITED, [web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/light-dark/)). Tailwind 4.3.3 still targets Safari 16.4 (*scoped* §3, READ). So Safari 16.4 to 17.4 is the gap the fallback covers.
- **What the engines return for a resolved colour** (EXECUTED (029)). `getComputedStyle(probe).color` for a hex token is `rgb(45, 72, 212)`; for an eight-digit hex, `rgba(11, 15, 23, 0.1)`; for a `color-mix(in srgb, …)`, `color(srgb 1 1 1 / 0.24)`. All three engines gave these forms. A canvas round trip is not exact: `rgba(11, 15, 23, 0.1)` painted and read back is `#0a14141a` in Chromium and WebKit and `#0913131a` in Firefox, against the token's `#0b0f171a` (decision 10).
- **A probe element works out of the layout** (EXECUTED (029)). A `display: none` span appended to a canvas inside a dark scope computed the dark colour in all three engines.
- **The tints, solid** (EXECUTED (029), `scripts/contrast.ts`'s `compositeTenths` and `contrastRatio`). Destructive and success text on its tint, at today's alphas (10% light, 20% dark):

  | Scheme | Role | Over `background` | Ratio | Over `card` | Ratio |
  |---|---|---|---|---|---|
  | light | destructive | `#EEDBD6` | 4.50 | `#F9E9EA` | 5.10 |
  | light | success | `#DBE4D9` | 4.51 | `#E6F1EE` | 5.09 |
  | dark | destructive | `#452E29` | 5.90 | `#4E3631` | 5.21 |
  | dark | success | `#25372A` | 5.93 | `#2E4032` | 5.19 |

- **The weight** (EXECUTED (029), an estimate). The two colour blocks are 7,954 bytes, 1,872 gzipped. The new `:root`, the restated `.dark` and the two fallback hex sets are about 17,600 bytes, 2,630 gzipped: about **+0.76 kB gzipped per page**, on every template. The fallback's private copies (decision 6) add a little more. The builder measures the real figure (decision 18).

## Decisions

### 1. One variable per colour, as a `light-dark()` pair, on `:root`

- **Every colour variable the theme declares is written once, in `:root`.** Its value is `light-dark(<light>, <dark>)`, both lower-case hex, read from the two scheme contexts of the resolver (`021` decision 7). A colour that is the same in both schemes is written as its one hex, as `--groove-light: #00000000` is. That covers the 61 roles, the two new tints (decision 9), the four fields and their legends, the glass's colours, and the mark's four.
- **A value that holds colours but is not a colour** carries a pair per colour. Today there is one: `--glass-shadow: 0 1px 0 light-dark(#0b0f170f, #00000000), 0 16px 32px -16px light-dark(#0b0f1747, #000000b3)`. `light-dark()` takes colours only (*scoped* §3, EXECUTED), so the pair goes inside, at each colour.
- **The derived copies are declared once, in `:root`.** The 16 `--code-*` slots (`var(--syntax-*)`) and the 7 `--surface-*` copies (`var(--<role>)`) are no longer repeated for the dark scheme. Each copy holds the whole pair, so it resolves where it is painted (*scoped* §3; EXECUTED (029)). The comments in `build-tokens.ts` that explain the repetition are rewritten to say why it is gone.
- **`:root` sets `color-scheme: light dark`.** It was `light`. A page with no `data-scheme` on `<html>` follows the reader's system, before any script and with scripts off. That closes the 2026-11-14 placeholder memo, the need a docs app named (*scoped* §4, "A gain it did not claim"). With scripts on, the head script writes the attribute before first paint (decision 5), so nothing else changes for a page that has the `theme` item.
- *Why:* it is the owner's ruling, and it removes the trap at its root. The scope rule then redeclares no token (decision 2).

### 2. `data-scheme` on any element, and how it composes with `color-scheme`

- **The attribute is `data-scheme`, with two values, `light` and `dark`.** They are exactly the resolver's scheme context names, `THEMES` in `scripts/tokens.ts` (`021` decision 7: "Each scheme context's name is a scheme name, and so a `data-scheme` value"). Any other value matches no rule and does nothing. There is no `system` value: a subtree that wants the system writes `color-scheme: light dark` itself, which works (*scoped* §3, EXECUTED).
- **It works on any element, `<html>` included, nested to any depth.** The nearest scope wins, because `color-scheme` inherits.
- **The scheme rules, unlayered:**

  ```css
  html[data-scheme="light"], html [data-scheme="light"] { color-scheme: light; }
  html[data-scheme="dark"], html [data-scheme="dark"] { color-scheme: dark; }
  ```

  At specificity (0,1,1) they beat `:root` and `.dark` (0,1,0) on the same element, in any source order. So **the attribute wins over the class** on an element that carries both. An app's CSS may put the CLI's rules and the theme's in any order; these do not depend on it.
- **The scope rule, in `@layer base`:**

  ```css
  @layer base {
    :where([data-scheme="light"], [data-scheme="dark"], .dark, .surface-ink) {
      --foreground: var(--surface-foreground);
      --muted-foreground: var(--surface-muted-foreground);
      --card-foreground: var(--surface-card-foreground);
      --primary: var(--surface-primary);
      --ring: var(--surface-ring);
      --primary-foreground: var(--surface-primary-foreground);
      --border: var(--surface-border);
      color: var(--foreground);
      background-color: var(--background);
    }
  }
  ```

  - **`color` and `background-color`** because an inherited `color` keeps the parent's resolved value: a scope that did not set it would show the page's text colour on its own ground (*scoped* §3, EXECUTED; the owner's ruling above).
  - **The seven roles** are the ones a field resets (`FIELD_ROLES` plus `primary-foreground` and `border`, `SURFACE_ROLES` in `build-tokens.ts`). Restoring them from the `--surface-*` copies is what `surface-plain` already does. Without it, a scope inside a field reads 1:1 (EXECUTED (029), above). Outside a field, each copy equals its role, so nothing changes. The cost: an app's own override of one of those seven roles on a wrapper does not reach inside a nested scope. The guide says so (decision 17).
  - **`@layer base` and `:where()`** give the rule no weight: any utility on the same element, such as `bg-card`, wins (*scoped* §4). On `<html>`, the unlayered `:root` and `.dark` declarations win over the seven restorations, so the root never refers to itself.
  - **Why `.dark` and `.surface-ink` are in the list:** they are scopes too (decisions 3 and 4). The list sits inside `:where()`, so the CLI does not read `.dark` as the selector (READ, above).
- **No token is redeclared on a scope.** That is the point of decision 1. The only declarations on a scope are the seven restorations, `color`, `background-color`, `color-scheme`, and `--ink-ground` (decision 3).
- **How it composes with an app's own `color-scheme`.** `light-dark()` reads the used scheme, so an element an app gives `color-scheme: dark` already resolves dark colours. It does not get the scope rule: no `color`, no ground and no restored roles. The documented way is the attribute. An app's own `color-scheme` on a `data-scheme` element wins or loses by the usual cascade. The theme's rules are unlayered at (0,1,1).
- **Portals are not scoped by the attribute.** See decision 11.

### 3. The mode's marks and the ink surface, without descendant rules

- **The mode's marks become pairs on the mode element.**

  ```css
  [data-mode="productive"] { --radius-action: var(--radius);
    --mark-1: light-dark(#2d48d4, #f3f0e8); /* … to --mark-4 */ }
  [data-mode="expressive"] { --radius-action: var(--radius);
    --mark-1: light-dark(#2d48d4, #93b0ff); /* … to --mark-4: the lifted four */ }
  ```

  The light values are the light `mark-n` roles. The dark values are the dark `mark-n` roles (productive) and `tokens.expressiveDarkMarks` (expressive), as `021` decision 6 lowers them. The four `.dark [data-mode=…]` selectors go. A dark scope inside an expressive stage now shows the lifted dots, which `.dark` never could. These rules print after the `.dark` block, so `[data-mode="expressive"]` on a `.dark` element still wins, as the twin selector did. A `.dark` element inside an expressive stage restates the productive marks (decision 4), as in 0.12.0.
- **The ink surface is a dark scope of its own.** `.surface-ink` sets `color-scheme: dark`, so `class="surface-ink"` alone is enough. `class="dark surface-ink"` keeps working while the alias does.
- **Its ground follows its page's scheme through a registered property:**

  ```css
  @property --ink-ground { syntax: "<color>"; inherits: true; initial-value: #16140f; }
  :root { --ink-ground: light-dark(#16140f, #221f19); }
  :where([data-scheme="light"], [data-scheme="dark"], .dark):not(.surface-ink) {
    --ink-ground: light-dark(#16140f, #221f19);
  }
  .surface-ink {
    color-scheme: dark;
    --background: light-dark(#f3f0e8, var(--ink-ground));
    --code-background: var(--background);
    --code-active-line: var(--muted);
    background-color: var(--background);
    color: var(--foreground);
  }
  ```

  - `--ink-ground` computes to one colour on each scope, in that scope's scheme: dark `background` on a light one, dark `card` on a dark one. The ink surface does not declare it, so it inherits its parent scope's colour. That keeps `007`'s rule, "Ink on a light page, `card` on a dark one", at any depth (EXECUTED (029)).
  - The two values are the dark `background` and dark `card` roles, written by the generator. `--ink-ground` is private. It is not a token, not in DTCG, and not in `kuiper.css`. Its name says what it is; no prefix, as with `--surface-*`.
  - **`--background`'s light arm is the light `background` role,** so a light scope nested inside an ink surface is light again (EXECUTED (029)).
  - `.surface-ink` prints after the `.dark` block, as today, so on `class="dark surface-ink"` its `--background` wins by source order.
- The `.dark .surface-ink` rule goes.

### 4. `.dark`: an alias of `data-scheme="dark"` for two minor releases

The owner's ruling: "`.dark` kept as an alias for two minor releases." So **`.dark` works in 0.13.0 and 0.14.0, and goes in 0.15.0.**

What the alias is in 0.13.0 and 0.14.0:

- **`.dark` restates every variable the 0.12.0 `.dark` block held, with the same pair `:root` holds,** and `color-scheme: dark`. In the item, `cssVars.dark` holds every key of `cssVars.light` but `radius`, each with the same value. `css[".dark"]` holds the fields, the glass and the `--surface-*` copies, as pairs. *Why restate the same values:* an app updated from 0.12.0 still has `.dark { --background: #16140f; … }`. The CLI replaces or adds declarations, and never removes one (*scoped* §5, READ). Left there, those hexes would beat the pairs under `.dark` and break a light scope inside it. Restated, the CLI overwrites every one. The alternative, asking each app to delete its `.dark` block, could fail silently (constitution §6).
- **`.dark` is a scope** (decision 2's list), with the `.dark { color-scheme: dark }` the theme already writes.
- **The head script and the store write the class on `<html>`** for the dark scheme, as well as the attribute (decision 5). So an app's own `dark:` classes keep working, since the CLI's variant is `&:is(.dark *)` and the CLI never rewrites an app's variant (*scoped* §5). They follow the page, not a scope (decision 8).
- **`src/app.css` keeps `@custom-variant dark (&:is(.dark *));`.** It is the preview of an installed app's CSS, and the CLI writes exactly that line.

What goes in 0.15.0, by a small change that `029`'s landing adds to the roadmap: `cssVars.dark`, `css[".dark"]`, `.dark` in the scope list and in the fallback's selectors, the class write in the head script and store, and the custom variant. The 0.15.0 guide tells apps to replace `class="dark"` with `data-scheme="dark"`, to change their own `dark:` variant, and to delete the dead `.dark` block.

### 5. The head script and the store

The head script keeps `020` decision 5's steps for the choice (read `kuiper-theme`; carry `pluto-theme` over once; validate; else the system). It changes only what it writes:

```js
var root = document.documentElement;
root.setAttribute("data-scheme", dark ? "dark" : "light");
root.classList.toggle("dark", dark); // the alias, until 0.15.0
```

- **The attribute is always written: the scheme in force,** chosen or from the system. *Why always, not only for a stored choice (the memo's form):* a browser without `light-dark()` has only the fallback, and the fallback keys on the attribute or the class (decision 6). Once the class goes in 0.15.0, a page following a dark system would read light there. Written always, the attribute carries it. Scripts off, there is no attribute, and `:root`'s `light dark` follows the system (decision 1).
- **The store's effect writes both**, the attribute and the class, from `theme.resolved`, as it writes the class today. Its `storage` listener and `MediaQuery` are unchanged, so a change of the system's scheme still updates them while no choice is stored.
- **`THEME_SCRIPT` changes value.** `020` changes it too, in the same release. An app that allows the script by a CSP hash updates the hash once, for 0.13.0. An app that passes `nonce` does nothing.
- `ThemeToggle`, `THEME_KEY`, `readStoredTheme` and the types do not change.

### 6. The hex fallback

The owner's ruling: "`light-dark()` with a generated fallback for older Safari."

- **The condition:** `@supports not (color: light-dark(#000, #fff))`. In such an engine every pair is invalid at computed-value time (*scoped* §3, INFERRED), so the fallback must win over `:root` and `.dark` on every element where it applies.
- **Its contents are 0.12.0's model, generated, extended to the attribute and the nest:**
  1. Dark set, at (0,2,1) on the root and (0,1,1) below it: `html:root:is(.dark, [data-scheme="dark"]), html :is(.dark, [data-scheme="dark"], .surface-ink)`. Every scheme variable as its dark hex, with the 16 `--code-*` and 7 `--surface-*` copies redeclared, as 0.12.0 did.
  2. Light set, after it: `html:root, html [data-scheme="light"]`. The same names as light hexes, and the copies. On the root it loses to the dark set by specificity. On a subtree that carries both the class and `data-scheme="light"`, it wins by order: the attribute wins, as in decision 2.
  3. The ink ground: `--ink-ground` as the dark `card` on `html :is(.dark, [data-scheme="dark"]):not(.surface-ink)` and on `html:root:is(.dark, [data-scheme="dark"])`; `html .surface-ink { --background: var(--ink-ground); }`, printed after the sets.
  4. The mode's marks, through private copies. Each set also declares `--_mark-productive-1` to `-4` and `--_mark-expressive-1` to `-4` for its scheme. Then `[data-mode="productive"] { --mark-n: var(--_mark-productive-n) }` and the expressive twin. Each copy is substituted on the mode element, from the nearest scope's set, so the dots are right at any depth. (Descendant selectors cannot find the nearest scope. Inside a light scope in a dark one, a `.dark [data-mode]` rule would paint the light blue on a dark ground, about 2.6:1, below 3:1.)
  5. `--glass-shadow` as each scheme's hex shadow.
- **No `:root` or `.dark` as a selector-list item** in any of it. The selectors use `html:root` and `:is(.dark, …)` (001 decision 14; READ, above). `generated.test.ts`'s check is sharpened to read selector lists with PostCSS's `list.comma` (T6).
- **Not offered by the fallback:** following the system with scripts off. That needs a third hex set under `prefers-color-scheme`. An older Safari with scripts off reads light, as every browser does today.
- **The cost** is about +0.76 kB gzipped per page, with the alias restatement (EXECUTED (029), an estimate; decision 18). Most of it goes when the fallback goes. When that is, is Q1.
- **It is tested by emulation in all three engines** (T12). Every installed engine supports `light-dark()`, so the test renames the function in the served CSS. Then the declarations are invalid and the `@supports not` block applies.

### 7. What the CLI writes, and the colour utilities

- **`cssVars.theme` holds `color-<name>: var(--<name>)` for every colour variable in `cssVars.light`,** not only the code slots. The CLI's own colour check misses a pair (READ, above). Today `appCss` writes these lines into `src/app.css` only (`colourTheme`). They move into the item, so an app gets them from `add`. `src/app.css` is unchanged by the move.
- The CLI will also append `--<name>: var(--<name>)` to the app's `@theme inline` for each pair. That is harmless (EXECUTED (029)). The smoke test proves the utilities exist in an installed app (T17).
- **A second `add kuiper-theme` leaves the app's CSS byte-identical** (001 decision 25's smoke check, unchanged).

### 8. `dark:` is banned in items, and what replaces each use

The owner's ruling: "Registry items stop using Tailwind's `dark:` variant; a test forbids it", "banned only in `src/lib/registry/`, not on the site."

- **The count: 2 uses, in 1 file.** Each is replaced:

  | File, line | Today | Becomes |
  |---|---|---|
  | `ui/alert/alert.svelte:10` | `bg-destructive/10 … dark:bg-destructive/20` | `bg-destructive-tint` |
  | `ui/alert/alert.svelte:12` | `bg-success/10 … dark:bg-success/20` | `bg-success-tint` |

  Everything else in the two class strings stays.
- **A unit test forbids it** (T4). Over every file `itemFiles()` lists (`scripts/lint-literals.ts`), it finds no `dark:` variant in a class, no `@variant dark`, no `@custom-variant`, no `:is(.dark`, no `.dark ` in a selector and no `[.dark_&]`. It does not read the theme item's generated CSS, which T3 covers, or the site.
- **The literal lint loses its carve-outs.** `SANCTIONED_TINTS` becomes empty, so L1 forbids every translucent tint on a token colour in an item, and L2 forbids every `dark:`. `literals.test.ts` changes with it. This also helps `031b`: after this, no item paints an alpha state tint.
- **No scheme-keyed descendant rule in the theme** (T3): no selector in `kuiper-theme`'s `css`, outside the fallback, has `.dark` or `[data-scheme…]` followed by a combinator. Today there are 3 (*scoped* §1).
- **The site keeps `dark:`** (10 uses in 5 files) and `.dark .site-thumb`. Its pages are one-scheme documents, and its frames stay (`015`). `dark:` there swaps content, which no token can do (*scoped* §4).
- **An app's own `dark:`** keeps working while `<html>` carries `.dark` (decision 4). It reads an ancestor, not the nearest scope: inside a light scope on a dark page it still matches. The guide says so, and says to use tokens for scheme differences (decision 17).

### 9. Alert's tints become tokens, and solid

- **Two roles join each scheme file:** `role.destructive-tint` and `role.success-tint`. Their CSS names are `--destructive-tint` and `--success-tint`; their utilities `bg-destructive-tint` and `bg-success-tint`.
- **They are solid.** Each is its role composited over `card`, at today's alpha: 10% in light, 20% in dark. *Why solid:* the owner's depth rule. An alert is on its layer's level, so "it never lets the colour behind it show through" (`019a` decision 3). Today's `/10` lets the card or page show through. *Why over `card`:* the `default` alert is `bg-card`, so a tinted alert is that card, tinted. It also raises the lowest ratio from 4.50 to 5.09 (table above). On the page's paper, a light-scheme tinted alert is now slightly lighter than before. Q2 asks the owner to confirm the ground.
- **Four primitives join the base file**, each a `color` with its `$description` and `$extensions["co.plutosystems.kuiper"]`: `{ "since": "0.13.0", "composite": { "of": "<primitive>", "over": "<primitive>", "alpha": <tenths> } }`.

  | Primitive | Value | Composite of | Over | Alpha | Ratio with its text |
  |---|---|---|---|---|---|
  | `red-tint` | `#F9E9EA` | `red-text` | `raised` | 0.1 | 5.10 |
  | `green-tint` | `#E6F1EE` | `green-text` | `raised` | 0.1 | 5.09 |
  | `red-tint-lifted` | `#4E3631` | `red-lifted` | `ink-raised` | 0.2 | 5.21 |
  | `green-tint-lifted` | `#2E4032` | `green-lifted` | `ink-raised` | 0.2 | 5.19 |

  The light roles alias the first two; the dark roles the last two. The validator gains one rule: a primitive with a `composite` equals `compositeTenths(of, over, alpha)`, and its alpha is whole tenths (the existing tint rule). So the value cannot drift from its roles. The DTCG paths are additions, so `kuiper.removed.json` gains nothing (`021` decision 10).
- **Each role's `$description`** says what it is for and how it is made. For example: "The ground of a destructive alert: destructive at 10% over card in light, 20% in dark, made solid." Equal in both scheme files (`021` criterion 4).
- **The contrast file changes.** `[destructive, destructive-tint]` and `[success, success-tint]` join the text pairs. The four `tints` rows and the three `forbidden` rows retire: no item draws an alpha state tint any more, so "no state tint on muted" (001 decision 8) has nothing left to guard. `scripts/contrast.ts` loses `forbiddenRows` and the tint branch of `contrastTable`, and the site's contrast tables follow. The builder pins the new pair count.
- **`021`'s counts move:** 52 primitives (48 + 4) and 63 roles per scheme (61 + 2). `021`'s T2, criterion 2 and criterion 17, and the bench's `primitives`, `rolesPerTheme` and `contrastPairs`, are updated in this build. The landing notes record each.

### 10. `readToken` resolves a colour where it is read

The owner's ruling: "`readToken` must return a resolved colour, which is an interface change."

- **The signature stays:** `readToken(name: string, element?: Element): string`.
- **A colour comes back resolved, as lower-case hex:** `#rrggbb`, or `#rrggbbaa` when alpha is below 1. That is the form the tokens are written in. So `readToken("mark-1")` returns `#2d48d4` on a light page before and after this change, and `#f3f0e8` inside a dark scope. A canvas, a chart or a comparison that worked in 0.12.0 keeps working.
- **How:**
  1. Read the variable's computed text on `element`, or on `<html>` when none is given, as today. Empty means a misspelling: warn in development and return `""`, as today.
  2. If `CSS.supports("color", text)` is false, or `CSS` is not there, return the text, as today. Durations, curves, numbers and font stacks take this path. So `readDuration`, `readEase` and `tween` are unchanged.
  3. Otherwise append a probe, a `<span hidden>` with `color: var(--<name>)`, to `element`, read its computed `color`, and remove it in the same call. The probe inherits `element`'s scheme, and it works on a canvas or out of the layout (EXECUTED (029)).
  4. Parse the result's numbers: three channels and an optional alpha. When the text names `srgb`, the channels are 0 to 1; otherwise 0 to 255. Each channel rounds to a byte, and alpha is `round(a × 255)`. These are the only forms the three engines give for Kuiper's colours (EXECUTED (029)). Any other form returns the engine's text, which a canvas still accepts. No canvas is used to normalise, because it loses precision at low alpha (EXECUTED (029)).
- **The probe's one style write** is `probe.style.setProperty("color", \`var(--${name})\`)`. Its value is a token reference. The literal lint gains **L25, one counted allowance** for that exact write in `read-token.ts`, as L24 allows the pointer light's (`scripts/lint-literals.ts`). The parser is written without the text of a colour function, so the lint's `COLOUR_FUNCTION` rule has nothing to match.
- **Side effects, documented in the doc comment:** an app's `MutationObserver` on `element`'s children sees one span added and removed. Nothing is laid out or painted between the two.
- **What does change:** a value that holds colours but is not one, today only `--glass-shadow`, comes back as its text, now with `light-dark()` inside. An app reading `getComputedStyle(el).getPropertyValue("--x")` itself now gets the pair; the guide points it to `readToken`.
- **The `read-token` page** reads inside `data-scheme="dark"`, not `.dark`. It repaints when `<html>`'s `data-scheme` or `class` changes. Its words say a canvas repaints only when told, and that an app watching a scope must repaint when the scope changes.

### 11. Portals

`light-dark()` does nothing for an overlay mounted under `<body>`: it opens in the page's scheme (the owner's ruling above). No item changes for this. Every Kuiper overlay's content takes `portalProps`, passed to Bits UI's `Portal`, whose `to` names the mount point (READ, e.g. `ui/popover/popover-content.svelte`, `popover-portal.svelte`). The documented pattern, on the theme page and in the guide:

- one overlay: `portalProps={{ to: scopeElement }}`;
- a whole scoped region: Bits UI's `BitsConfig` with `defaultPortalTo` set to an element inside the scope (*scoped* §4; the 2026-11-01 ink memo §2.3).

T13 proves both, and proves that an unrouted overlay opens in the page's scheme, as documented.

### 12. The DTCG files

The token source is `021`'s: the resolver set, unchanged in shape. This specification adds only the four primitives, the two roles per scheme file and their words (decision 9). The resolver, its modifier and its contexts do not change. The CSS is still made by `build-tokens.ts` from the lowering. A role's two values come from the `light` and `dark` contexts. Its single-value form (decision 1) is used when the two primitives' hexes are equal. A test holds that every `data-scheme` value the CSS emits is a `THEMES` value and a context of `scheme` (T1).

### 13. `kuiper.css`

`021` decision 11 publishes `kuiper.css`, the tokens as plain variables, and says "`029` changes both at once". Its blocks become:

1. `:root { … }` with the pairs, the copies once, and `color-scheme: light dark`;
2. `.dark { … }`, the alias, restating the pairs, then `color-scheme: dark` (until 0.15.0);
3. the two `data-scheme` rules of decision 2;
4. the scope rule of decision 2, unlayered here, since `kuiper.css` holds no `@layer` (its `:where()` already gives it no weight);
5. the fallback of decision 6, without the ink and mode parts, which are the theme item's;
6. the reduced-motion block, unchanged.

`--shadow-elevation`'s repeat in `.dark` (`021` decision 11) goes: its `var(--elevation-line)` now holds the pair. `021`'s T9 is rewritten to this list. `--ink-ground` is not in `kuiper.css`; the ink surface is a theme rule.

### 14. The site

- **The theme page gains an example, "A part of the page in the other scheme":** a light card on a dark ground and a dark card on a light ground, then a three-deep nest, each holding a button, a field, an input, a code line, an alert and the mark. It is in `src/lib/site/examples/kuiper-theme/`. Its page frame shows it in both schemes, like every example.
- **`surface.svelte`** writes `class="surface-ink"`. **The `read-token` example** follows decision 10.
- **`/start/light-and-dark/` and `/start/theme/`** are rewritten where they say `.dark` turns on the dark theme: the attribute, the alias and its term, the scope rule, portals, `readToken`, and that the root follows the system with scripts off. `/start/theme/`'s count of `.dark` variables reads the restated block.
- **The Components index's thumbnails** carry `data-thumb-scheme` in place of `data-scheme`, with `site.spec.ts` lines 819 and 836 updated. A thumbnail is not a scope. This is lane S's file. It lands with this specification, after any lane-S build in flight. `031a` redraws the card later.
- **The site's `dark:` uses and its frames stay** (decision 8).

### 15. Room for `031`, high contrast

The owner's rulings bind `031`, not this specification: "high-contrast colours as new shades of the brand's hues, measured to 7:1 and approved by the owner; non-text elements reach 4.5:1 in high contrast", set on `<html>` only. This specification leaves `031` one way in. It adds `html[data-contrast="more"]` and `@media (prefers-contrast: more) { html:not([data-contrast="standard"]) { … } }` blocks that redeclare roles as `light-dark(<hc light>, <hc dark>)` (*scoped* §6, option B).

- On `<html>`, the copies declared on `:root` substitute the winning value, so they follow without being repeated (*scoped* §4).
- **Two things `031` must handle, said here so it is not surprised:**
  - While the alias lives, a `.dark` subtree restates the standard pairs (decision 4), which would hide high contrast inside it. `031` restates its overrides for `.dark`, or lands after 0.15.0's removal.
  - The fallback has no contrast set.
- The generator keeps one function per output block, so `031` adds blocks without reshaping these.

### 16. Interface changes, and the changelog

One bullet per item in the 0.13.0 entry, each marked `**interface change.**`, each linking its guide section:

- **`kuiper-theme`:** every colour variable is a `light-dark()` pair; `:root` is `color-scheme: light dark`, so a page with scripts off follows the system; `data-scheme="light" | "dark"` makes any element a scope; `.dark` is an alias until 0.15.0; `surface-ink` works without `.dark`; the `.dark .surface-ink` and `.dark [data-mode]` rules are gone; a scope sets `color` and `background-color` and restores seven roles; `--glass-shadow` holds pairs; new: `--destructive-tint`, `--success-tint` and their utilities; a hex fallback for browsers without `light-dark()`. `getPropertyValue` on a colour variable now returns its pair.
- **`theme`:** the head script and the store write `data-scheme` on `<html>`, and `.dark` until 0.15.0; `THEME_SCRIPT` changes value, so a CSP hash changes, once for 0.13.0 with `020`'s change.
- **`read-token`:** `readToken` returns a colour resolved where it is read, as hex. `--glass-shadow` reads as text with pairs inside.
- **`alert`:** the destructive and success variants paint solid tints, `bg-destructive-tint` and `bg-success-tint`, in place of a translucent tint and a `dark:` class.
- **Tokens:** four primitives and two roles per scheme, from 0.13.0; the contrast file's `tints` and `forbidden` retire; `kuiper.css` gains the attribute rules and the fallback.

`registry.test.ts` checks the bullets name these (T18).

### 17. The upgrade guide's section

`029` appends one section to `src/lib/site/upgrade/0.13.0.ts`, rendered at `/changelog/0.13.0/upgrade/` (`020` decision 12). Title: **"`029`: light and dark on any element."** Its steps:

1. **Update `kuiper-theme` and `theme` together:** `add kuiper-theme theme`, then `alert` and `read-token` if the app has them. *Why together:* an old head script removes `.dark` for an explicit "light" and writes no attribute, so under the new root's `light dark` that page would follow a dark system.
2. **If the app allows the head script by a CSP hash, update it.** Once, with `020`'s step.
3. **Nothing in your `.dark` block needs deleting yet.** The update overwrites every stale colour in it. It goes in 0.15.0.
4. **Make a part of the page light or dark with `data-scheme`.** Replace `class="dark"` on a subtree with `data-scheme="dark"`, and `class="dark surface-ink"` with `class="surface-ink"`. A `grep` command for `class="dark` and `"dark surface-ink"`. Both old forms work until 0.15.0.
5. **Your own `dark:` classes keep working until 0.15.0.** They follow the page, not a scope: inside a light part of a dark page they still apply. For a colour that differs by scheme, use a token. Before 0.15.0, change your `@custom-variant dark` line (the 0.15.0 guide gives the line).
6. **Overlays opened inside a scoped part** open in the page's scheme unless routed. Use `portalProps={{ to }}`, or `BitsConfig defaultPortalTo`.
7. **Scripts that read colours:** use `readToken`, which resolves. Your own `getPropertyValue("--x")` now returns `light-dark(…)`.
8. **An override of `--foreground`, `--muted-foreground`, `--card-foreground`, `--primary`, `--ring`, `--primary-foreground` or `--border` on a wrapper** does not reach inside a nested `data-scheme` element. Set it on the scope, or inside it.
9. **With scripts off, pages now follow the reader's system.** A page that must stay light sets `data-scheme="light"` on `<html>` in its markup.

Then "What keeps working until 0.15.0": `.dark`, `class="dark surface-ink"`, an app's `dark:`. And "What did not change": every variable's name, every utility, `THEME_KEY`, `ThemeToggle`, the theme store's interface.

### 18. Weight

A change that adds weight to every page states its cost (`024` decision 5). **This one: about +0.76 kB gzipped per page, every template** (EXECUTED (029), an estimate). The site's stylesheet carries the pairs, the restated alias, and the fallback. The builder measures the built CSS before and after, and the landing notes give the real figure per template against `024`'s headroom. Button had 0 kB of headroom before `024`, and `024` predicts 50 to 100 kB. If the figure does not fit a template's headroom, the builder stops and asks for a ruling (`024`).

## Design

### The emitted shape, in `src/app.css`

An excerpt. Values are today's; names are `020`'s.

```css
@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.5rem;
  --background: light-dark(#f3f0e8, #16140f);
  --foreground: light-dark(#0b0f17, #f3f0e8);
  --border: light-dark(#0b0f171a, #f3f0e81a);
  --groove-light: #00000000;
  --destructive-tint: light-dark(#f9e9ea, #4e3631);
  --success-tint: light-dark(#e6f1ee, #2e4032);
  --mark-1: light-dark(#2d48d4, #f3f0e8);
  --code-text: var(--syntax-ink);
  /* … every colour once; the code slots and the surface copies once … */
  --glass-shadow: 0 1px 0 light-dark(#0b0f170f, #00000000), 0 16px 32px -16px light-dark(#0b0f1747, #000000b3);
  --ink-ground: light-dark(#16140f, #221f19);
  color-scheme: light dark;
}

.dark {
  --background: light-dark(#f3f0e8, #16140f);
  /* … the same pairs, restated, until 0.15.0 … */
  color-scheme: dark;
}

@theme inline {
  /* … as today, and now from the item: --color-<name>: var(--<name>) for every colour … */
}

@property --ink-ground { syntax: "<color>"; inherits: true; initial-value: #16140f; }

html[data-scheme="light"], html [data-scheme="light"] { color-scheme: light; }
html[data-scheme="dark"], html [data-scheme="dark"] { color-scheme: dark; }

:where([data-scheme="light"], [data-scheme="dark"], .dark):not(.surface-ink) {
  --ink-ground: light-dark(#16140f, #221f19);
}

.surface-ink { color-scheme: dark; --background: light-dark(#f3f0e8, var(--ink-ground)); /* … */ }
[data-mode="productive"] { --radius-action: var(--radius); --mark-1: light-dark(#2d48d4, #f3f0e8); /* … */ }
[data-mode="expressive"] { --radius-action: var(--radius); --mark-1: light-dark(#2d48d4, #93b0ff); /* … */ }

@supports not (color: light-dark(#000, #fff)) {
  html:root:is(.dark, [data-scheme="dark"]),
  html :is(.dark, [data-scheme="dark"], .surface-ink) { --background: #16140f; /* … dark hexes, copies, --_mark-* … */ }
  html:root, html [data-scheme="light"] { --background: #f3f0e8; /* … light hexes, copies, --_mark-* … */ }
  /* … the ink ground, html .surface-ink, the two mode rules … */
}

@layer base {
  :where([data-scheme="light"], [data-scheme="dark"], .dark, .surface-ink) {
    --foreground: var(--surface-foreground);
    /* … the other six … */
    color: var(--foreground);
    background-color: var(--background);
  }
  body { @apply bg-background text-foreground; }
  /* … as today … */
}
```

The `.dark` block and `.surface-ink` print in that order, as today. The `[data-mode]` rules print after `.dark`.

### The generator, in outline

`build-tokens.ts` gains one helper, `pair(light, dark)`, which returns one hex when the two are equal and `light-dark(l, d)` otherwise. Every scheme value passes through it. `themeCssVars` builds `light` from it. `dark` becomes the same map, less `radius`, while the alias lives. `theme` gains every `color-<name>`. `themeCss` builds `:root`, `.dark` (the alias), `@property --ink-ground`, the two scheme rules, the ink rules, the mode rules, `@supports not (…)` and the scope rule in `@layer base`. Each is its own function, so `031` can add one. `appCss` stops building `colourTheme`, which now comes from the item. `kuiper.css`'s writer reads the same functions (decision 13).

## Scope

**In:**

- `scripts/build-tokens.ts`, `scripts/tokens.ts` (the lowering's new fields if any, the composite rule in the validator), `scripts/contrast.ts` (tints and forbidden rows retired).
- `tokens/kuiper.tokens.json` (four primitives), `kuiper.light.tokens.json` and `kuiper.dark.tokens.json` (two roles each), `kuiper.contrast.json` (the pairs).
- Generated: `src/app.css`, `registry.json`'s `kuiper-theme` (`cssVars`, `css`), `kuiper.css` and the flattened files, `static/r/`.
- `src/lib/registry/ui/theme/theme-script.svelte`, `theme.svelte.ts`.
- `src/lib/registry/ui/alert/alert.svelte` (lane I, after `023`).
- `src/lib/registry/lib/read-token.ts` (lane I).
- `scripts/lint-literals.ts`: `SANCTIONED_TINTS` emptied, L25 added.
- The site: the theme page's new example; `surface.svelte`; the `read-token` example; `/start/light-and-dark/`; `/start/theme/`; the site's contrast tables, which lose the tint rows; the Components index's attribute, and `site.spec.ts`.
- `src/lib/site/upgrade/0.13.0.ts` (a ledger file); `CHANGELOG.md`; the stage and marketing-bar comments that say "never carries `.dark`" (they now name `data-scheme`).
- A test view, `src/routes/(view)/view/scoped-schemes/`, kept out of the sitemap like the other views.
- The tests below.

**Out:**

- High contrast (`031`); the forced-colours pass (`028`); the depth audit and its lint (`031b`); the index card redesign (`031a`).
- Removing the alias (0.15.0, decision 4) and the fallback (Q1).
- A `dark:` variant that follows the nearest scope. Style queries and `if()` are not Baseline (*scoped* §3, option E).
- The site's frames, which stay one-scheme documents.
- Any change to a token's value. Every pair is today's two hexes.
- Overlay items' source (decision 11 is a pattern, not a change).

## Tests to write first

Each is written before the change and seen failing for the reason given. E2E tests run in `chromium-*`, `firefox-*` and `webkit-*` (`022` decision 2). Until `022` lands, the three-engine tests launch the three engines themselves (T10's note). A test that passes today is proven by mutation, and the landing notes say which.

| # | Name | File | Asserts | Fails today because |
|---|---|---|---|---|
| T1 | each colour is one value or a pair | `tests/unit/scoped-schemes.test.ts` | For every colour variable in `kuiper-theme`'s `cssVars.light` and `css[":root"]`: its value is `light-dark(<light hex>, <dark hex>)` matching the two scheme contexts, or one hex when they are equal. `--glass-shadow` holds a pair at each colour. No `--code-*` or `--surface-*` key is in `cssVars.dark`'s non-alias half. `:root` sets `color-scheme: light dark`. Every `data-scheme` value in the CSS is a `THEMES` value and a context of `scheme` | values are hexes; `color-scheme: light` |
| T2 | the alias restates | same | `cssVars.dark`'s keys are `cssVars.light`'s less `radius`, each value equal. Every name the v0.12.0 theme's `.dark` block declared (read from `static/v0.12.0/r/styles/maia/pluto-theme.json`) is declared in 0.13.0's `.dark`, with `:root`'s value. `.dark` sets `color-scheme: dark` | dark values differ from light |
| T3 | no scheme-keyed descendant rule | same | Outside `@supports not (color: light-dark(#000, #fff))`, no selector in `kuiper-theme`'s `css` has `.dark` or `[data-scheme` followed by a combinator, and none compounds `.dark` with another selector | 3 rules (`.dark .surface-ink`, two `.dark [data-mode]`) |
| T4 | no `dark:` in items | `tests/unit/no-dark-variant.test.ts` | Over `itemFiles()`: 0 `dark:` variants in classes, 0 `@variant dark`, 0 `@custom-variant`, 0 `:is(.dark`, 0 `[.dark_&]`, 0 `.dark ` in a selector. *Also:* the count reads 2 on a fixture copy of today's `alert.svelte` | 2, in `alert.svelte` |
| T5 | the fallback is the hex sets | `tests/unit/scoped-schemes.test.ts` | The `@supports not (…)` block exists once. Its dark set holds every scheme variable as its dark hex, and its light set as its light hex, matching the token file. Both redeclare the 16 code slots and 7 surface copies. The `--_mark-*` copies equal the productive and expressive marks of each scheme. Selectors are decision 6's | no block |
| T6 | no `:root` or `.dark` item in an at-rule | `tests/unit/generated.test.ts` (001's check, sharpened) | Read with PostCSS `list.comma`, no selector-list item of a rule nested in an at-rule of `kuiper-theme`'s `css` is exactly `:root` or `.dark`. *Mutation:* a fallback selector `html:root, .dark` fails | passes today; proven by mutation |
| T7 | the CLI gets every utility | `tests/unit/scoped-schemes.test.ts` | `cssVars.theme` holds `color-<name>: var(--<name>)` for every colour key of `cssVars.light` | only the 16 code slots |
| T8 | the tints are tokens | `tests/unit/tokens-dtcg.test.ts` and `contrast.test.ts` | The four primitives exist, each equal to `compositeTenths(of, over, alpha)`. `role.destructive-tint` and `role.success-tint` alias them in both scheme files, with equal `$description`. The contrast pairs `[destructive, destructive-tint]` and `[success, success-tint]` pass in both schemes, at 5.10, 5.09, 5.21 and 5.19. No `tints` or `forbidden` key remains | no such tokens |
| T9 | `readToken` resolves | `tests/unit/read-token.test.ts` | With a stub `CSS.supports` and a stub probe whose computed colour is `rgb(45, 72, 212)`, `rgba(11, 15, 23, 0.1)`, `color(srgb 1 1 1 / 0.24)` or `color(srgb 0.0862745 0.0784314 0.0588235 / 0.24)`, `readToken` returns `#2d48d4`, `#0b0f171a`, `#ffffff3d` and `#16140f3d`, and removes the probe. A non-colour (`600ms`) returns its text and appends nothing. With no `CSS`, the text | returns the raw text |
| T10 | nested schemes, in all three engines | `tests/e2e/scoped-schemes.spec.ts` | On `/view/scoped-schemes/`, a sampler (text; `bg-card` card; muted text; primary button; input border; a code line's text, keyword and ground; destructive and success alerts; the four-dot mark, productive and in `data-mode="expressive"`; `field-1` with an opposite scope inside it; an ink surface; a glass panel) is shown at the page level and in a nest of opposite, page and opposite schemes, three deep. With the system light and dark: each sample's computed `color`, `background-color`, `border-*-color` and `fill` at each level equals the same sample at the page level of a page in that level's scheme. axe reports 0 violations. *Note:* until `022` lands, the file runs one test per engine through Playwright's `chromium`, `firefox` and `webkit` launchers, against the same preview server | `data-scheme` does nothing: level 1 reads the page's scheme |
| T11 | the alias reads the same | same | The fixture with `?alias=1`, which writes `class="dark"` for each dark level, gives T10's readings. `class="dark surface-ink"` reads as `class="surface-ink"` | a light level inside `.dark` reads dark |
| T12 | the fallback, emulated | same | With `page.route` rewriting every `light-dark(` in the served CSS to `light-dark-x(` (so the `@supports not` block applies; the test checks `<html>`'s `--background` no longer starts with `light-dark(`), T10's readings hold at every level, marks included | no fallback, and no scope |
| T13 | portals follow when routed | same | In a dark scope on a light page: a popover with `portalProps={{ to }}` set to the scope's element, and a dropdown menu under `BitsConfig defaultPortalTo`, open with the dark `popover` and `popover-foreground`. An unrouted popover opens with the light ones | no scope |
| T14 | the ink ground | same | Ink's `background-color` is the dark `background` on a light page and in a light scope inside a dark one, and the dark `card` on a dark page and in a dark scope inside a light one. A light scope inside ink reads light | the dark scope gives `background`, not `card` |
| T15 | the head script and the store | `tests/e2e/theme.spec.ts` | Modules aborted (`020` test 9's method): a stored `light` on a dark system gives `data-scheme="light"`, no `.dark`, and a light body. A stored `dark` on a light system gives `data-scheme="dark"` and `.dark`. No choice gives the system's scheme in both. `020` test 9's carry-over cases still pass. With modules on, toggling writes both, and a change of the emulated system writes both while no choice is stored | no attribute |
| T16 | scripts off follow the system | same | `javaScriptEnabled: false`, system dark: `body`'s background is the dark `background`; system light: the light one | light in both |
| T17 | an upgraded app | `tests/smoke/upgrade.test.ts` | An app installed from `/v0.12.0/r` (`kuiper-theme`'s ancestor `pluto-theme`, `theme`, `alert`, `read-token`), then `add kuiper-theme theme alert read-token` from `/r`: in `app.css`, every colour variable in `.dark` equals `:root`'s; `@theme inline` holds `--color-<name>` for every colour, including the two tints; the app builds; the built CSS holds `.bg-destructive-tint` and the `@supports not` block; a second `add` leaves `app.css` byte-identical. The same from `/v0.11.0/r` | `.dark` keeps hexes; no tint utility |
| T18 | the changelog and the guide | `tests/unit/registry.test.ts`, `tests/e2e/upgrade.spec.ts` | The 0.13.0 entry holds decision 16's five bullets, each marked interface change, naming `data-scheme`, `light-dark()`, `.dark`, `0.15.0`, `THEME_SCRIPT`, `readToken`, `bg-destructive-tint`. The guide holds decision 17's section, its nine steps in order, after `020`'s | no such text |
| T19 | `readToken` in the browser | `tests/e2e/expressive.spec.ts` (its `read-token` tests rewritten) | On the `read-token` page, for every colour role, in both schemes: `readToken(role)` on `<html>` and `readToken(role, el)` inside an opposite `data-scheme` subtree equal the token file's hex for that scheme. The canvas inside `data-scheme="dark"` on a light page paints `rgb(243, 240, 232)` and is labelled with `#f3f0e8` four times, and repaints when the toggle is pressed | the page has no `data-scheme` subtree; a light page reads the light marks there |
| T20 | the alert's tints, solid | `tests/e2e/alert.spec.ts` (or the item's existing spec) | The destructive and success alerts' `background-color` equals the tint token's hex, with alpha 1, on the page and on a card, in both schemes | translucent: alpha 0.1 or 0.2 |
| T21 | the lint | `tests/unit/literals.test.ts` | `bg-destructive/10` and `dark:bg-success/20` in a fixture item fail L1 and L2. L25 allows exactly `probe.style.setProperty("color", …)` in `read-token.ts`, and the report counts 2 allowances | the four tints pass |

## Acceptance criteria

1. **One value per colour.** T1 passes. `src/app.css` declares no colour in `.dark` that differs from `:root`'s. (unit)
2. **The alias.** T2 and T11 pass. (unit, e2e)
3. **No descendant scheme rules.** T3 passes. The bench's `theming.lightDarkFn` is above 0, and `dataScheme` is at least 4. (unit, bench)
4. **No `dark:` in items.** T4 and T21 pass. The count is 0, from 2. `bun run lint:literals` reports 0 violations and 2 allowances (L24, L25). (unit)
5. **The fallback.** T5 and T12 pass, in all three engines. (unit, e2e)
6. **The CLI.** T6, T7 and T17 pass under Bun. (unit, smoke)
7. **The tints.** T8 and T20 pass. `alert.svelte`'s destructive and success strings hold `bg-destructive-tint` and `bg-success-tint` and no `/` modifier. (unit, e2e)
8. **`readToken`.** T9 and T19 pass in all three engines. (unit, e2e)
9. **Nesting.** T10 passes in Chromium, Firefox and WebKit, with the system light and with it dark: 0 mismatched readings, 0 axe violations. (e2e)
10. **Portals and ink.** T13 and T14 pass in all three engines. (e2e)
11. **The head script.** T15 and T16 pass. `020`'s tests 9 and 10 still pass. (e2e, unit)
12. **`kuiper.css`.** `021`'s T9, rewritten to decision 13's six blocks, passes. Every declaration it shares with `src/app.css` has the same value. (unit)
13. **The counts.** 52 primitives and 63 roles per scheme in the DTCG files. `021`'s T2 and criteria 2 and 17 are updated to them. The new contrast pair count is pinned in the test and the landing notes. (unit, bench)
14. **The `var()` test.** `023`'s test 6 passes with `--destructive-tint`, `--success-tint`, `--ink-ground` and the `--_mark-*` copies defined. (unit)
15. **The site.** The theme page's new example renders in both schemes at 1440 and 390 with 0 axe violations. `/start/light-and-dark/` and `/start/theme/` name `data-scheme`. No thumbnail carries `data-scheme`. `site.spec.ts` passes. (e2e)
16. **The changelog and the guide.** T18 passes. (unit, e2e)
17. **Weight.** The built site stylesheet's gzipped size before and after is in the landing notes, per template, and fits `024`'s headroom; `perf.spec.ts`'s transfer budgets pass. (e2e, perf)
18. **The suites.** `bun run test:unit`, `bun run test:e2e:engines`, `bun run test:smoke` pass; `bun run check` 0 errors; `bun run lint` clean. Expectations change only in the tests named here, `021`'s counts and the contrast tables. (all)
19. **Tests first, and the checkpoint.** T1 to T5 and T7 to T21 are seen failing before the change, and T6 by mutation. At the checkpoint the design lead looks at the test view and the theme page's new example in Chromium, Firefox and WebKit, in both schemes, at 1440 and 390, and at the tinted alerts on the page and on a card. Rulings go into the landing notes. (checkpoint)
20. **The scorecard.** The loop runs (`roadmap.md` §4). Row 4 moves 2 → 3. The change review cites it. (bench)

## Build order

1. **Confirm the tree.** `020`, `021` and `023` landed; whether `022`, `024` and `028` have. Re-pin every count here. Note any name `020` or `021` chose differently.
2. **Tests first.** Write T1 to T21 and the fixture view. Run them. Record what fails and why.
3. **Tokens.** The four primitives, two roles, their words, the composite rule, the contrast file. T8 to green.
4. **The generator.** `pair()`, the blocks, the alias, the fallback, the scope rule, `cssVars.theme`, `kuiper.css`. T1 to T3, T5 to T7 and `021`'s T9 to green. `bun run build:tokens` twice: the second writes nothing.
5. **The theme item.** The head script and the store. T15 and T16 to green.
6. **Checkpoint, part one** (lane T done): the test view in three engines, T10 to T14.
7. **Lane I, after `023`'s landing:** `alert`, then `read-token`, then the lint. T4, T9, T19 to T21 to green.
8. **The site:** the example, the docs pages, the index's attribute.
9. **The ledger:** the guide section, the changelog, `static/r/`. T17 and T18 to green.
10. **Weight.** Measure, and compare with `024`'s headroom (decision 18).
11. **Checkpoint, part two** (criterion 19).
12. **The suites, then the scorecard loop** (criteria 18 and 20).

## Predicted scorecard movement

- **Row 4, theming: 2 → 3.** (b) "Any subtree takes either scheme, both directions" goes from – to ✓, joining (a) and (e). Evidence: T10 in three engines, and the bench's `lightDarkFn` and `dataScheme` above 0. (c), a contrast scheme, is `031`'s, which makes 4.
- **Row 5, tokens: held at `021`'s 4.** The new tokens carry descriptions and `since`.
- **Row 8, page weight: held**, if the +0.76 kB fits `024`'s budgets (decision 18).
- **Row 11, change communication: held.** The guide grows by one section.
- **Row 3, accessibility evidence: no new criterion.** The axe runs of T10 add scoped states the matrix did not cover before.

## Risks

- **The fallback is untestable natively here.** Every installed engine has `light-dark()`. T12 emulates it, which proves the CSS, not an old Safari's bugs. The checkpoint may add one run on a real Safari 17.4 if one can be reached. If not, the landing notes say the fallback was proven by emulation only.
- **The CLI may change its colour check.** If a later CLI recognises `light-dark()`, it writes `--color-*` itself, which equals what the item gives. No harm. The smoke test pins 1.7.1's behaviour.
- **A mixed install.** `kuiper-theme` from 0.13.0 with `theme` from 0.12.0 makes an explicit light choice follow a dark system (decision 1). The guide's step 1 says to update them together. A smoke case checks the guide's order, not the mix.
- **Seven roles restored on every scope.** An app that overrides one of them on a wrapper loses it inside a nested scope (decision 2). It is documented. No Kuiper item does it.
- **The alias doubles `.dark`'s bytes until 0.15.0.** The estimate is inside decision 18's figure.
- **`031` and the alias.** Decision 15 names the clash, so `031` plans for it.
- **Lane order.** `028` (forced colours) is also lane I and wave 2. The design lead orders `028` and `029`'s alert edit. They touch different lines of `alert.svelte` only if `028` touches alert at all.

## Open questions for the owner

Only questions the rulings above do not settle. Recommended option first.

**Q1. When does the hex fallback go?** It covers Safari 16.4 to 17.4, which Tailwind 4.3.3 still targets. `light-dark()` is expected to be widely available from 2026-11-13 (CITED, above). The fallback costs about half of this specification's +0.76 kB per page.
1. **When Tailwind's own floor reaches Safari 17.5,** by a small change in the next minor release. Below that floor, the rest of the CSS is not promised either, so the fallback buys nothing. *Recommended.*
2. **At 1.0,** in `058`'s interface review, whatever Tailwind targets then.
3. **Keep it,** until an older Safari's share is measured as negligible.

**Q2. Alert's tints: on which ground are they made solid?** The depth rule makes them solid (decision 9). The ground decides how they look and their lowest contrast.
1. **Over `card`,** so a tinted alert is a tinted card, like the default alert. Lowest ratio 5.09. On the paper page, the light tints are a little lighter than today. *Recommended.*
2. **Over `background`.** Today's look on the page, a little darker than today on a card. Lowest ratio 4.50, the AA floor.
3. **Keep them translucent, as tokens** (`light-dark()` of an alpha colour), and leave solidity to `031b`. Today's look everywhere. It breaks the depth rule until `031b` changes it.

## Review

Not yet reviewed.

## Landing notes

Not landed.

### The owner's rulings this stands on (2026-11-15)

Quoted in the header's "Design call", from `decisions.md` at `beeb67e`: the scoped-schemes recommendation and the memo's five corrections; "`light-dark()` with a generated fallback for older Safari" (decisions 1 and 6); "`.dark` kept as an alias for two minor releases" (decision 4: it works in 0.13.0 and 0.14.0 and goes in 0.15.0); the two high-contrast answers (`031`'s; decision 15); and "transparency always signifies depth" (decision 9). The owner's answers to Q1 and Q2 go here.
