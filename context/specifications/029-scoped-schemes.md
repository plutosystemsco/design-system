# 029 — Scoped schemes

- **Status:** Ready to build after `021` and `023`: owner answers recorded, re-review approved, all applied. The specification review ([`../reviews/029-scoped-schemes-spec-2026-11-15.md`](../reviews/029-scoped-schemes-spec-2026-11-15.md)) asked for revision; its 12 findings are answered in the text. Its re-review found the specification fit to build, with five Low write-ins, R1 to R5, all applied. Each is listed under "Review". The owner answered Q1 and Q2 on 2026-11-15, each with the recommended option; the answers are in decisions 6 and 10 and under "Landing notes". Not built.
- **Date:** 2026-11-15
- **Author:** the spec author for `029`, for the design lead
- **Kind:** a feature in lane T (tokens), then lane I (existing items: `alert`, `read-token`). **Interface changes:**
  - the shape of every colour variable in `kuiper-theme`;
  - the root's `color-scheme`;
  - a new attribute, `data-scheme`;
  - `.dark` becomes an alias, and a `.dark` subtree now paints its ground and text;
  - the ink surface and the mode's marks no longer need `.dark`;
  - the `theme` item's head script and store write `data-scheme`, so `THEME_SCRIPT` changes value;
  - `readToken` returns a colour resolved where it is read, in lower case;
  - `alert`'s two tinted variants paint solid tints;
  - an app on Vite 8 adds one line to its Vite config (decision 8).

  It adds two colour roles (`destructive-tint`, `success-tint`), four primitives and two private variables (`--surface-background`, `--ink-ground`). It adds one dependency, for the site only: `lightningcss`, named and pinned as a devDependency, at the version already in `bun.lock` through Vite (1.33.0; decision 8). Each change has a changelog bullet and a step in the upgrade guide (decisions 17 and 18).
- **Lanes:** T first (`tokens/`, `scripts/build-tokens.ts`, `scripts/tokens.ts`, `src/app.css`, `kuiper-theme`, `theme`). Then I (`alert`, `read-token`), after `023` (`roadmap.md` §3, "Cross-lane landings"). Edits outside those lanes:
  - the literal lint's tint table (decision 9);
  - `vite.config.ts` and `package.json`'s devDependencies (decision 8);
  - the site's docs, examples, two frame head scripts and one attribute on the Components index (decision 15), which are lane S.
- **Written against the names `020` and `021` leave.** `020` renames the code names. So this specification says `kuiper-theme`, the `kuiper` registry, `kuiper:` context keys, the storage key `kuiper-theme`, `readStoredTheme` in `theme/stored.ts`, `scripts/bench/kuiper.ts`, and the upgrade guide at `/changelog/0.13.0/upgrade/` (`020` decisions 3, 5, 12, 13).
  - `021` reshapes the token source. The tokens here are **a DTCG 2025.10 resolver set under `tokens/`**: a base file `kuiper.tokens.json`, the scheme files `kuiper.light.tokens.json` and `kuiper.dark.tokens.json`, and `kuiper.resolver.json`, with one modifier, `scheme`. Beside them sit `kuiper.contrast.json` and `kuiper.removed.json`. Kuiper's extension data sits under **the vendor key `co.plutosystems.kuiper`** (`021` decisions 2, 4 and 7).
  - The build still lowers these files to today's `Tokens` object (`021` decision 3). So the generator below reads `tokens.themes`, `tokens.primitives` and `tokens.expressiveDarkMarks`.
  - Where `020` or `021` lands a name this specification does not foresee, theirs wins, and the builder notes it in the landing notes. The measurements below were taken on today's tree, which still says `pluto`.
- **Depends on:**
  - `021`, for the token files and `kuiper.css`, which this changes.
  - `023`: this specification's `alert` edit waits for `023`'s lane-I work, and `023`'s `var()` test must see the new variables.
  - `020`, for the names, the head script's carry-over and the guide.
  - Softly, `022`: its Firefox and WebKit projects run this specification's three-engine tests. If `022` has not landed, those tests launch the three engines themselves (T10).
- **Ships with:** 0.13.0, wave 2 (`roadmap.md` §3).
- **Blocks:** `031` (high contrast takes this attribute pattern and this generator), `031a` (the index card's grounds), `031b` (the depth audit; this removes the only translucent tint in an item).
- **Ranked by:** [`../roadmap.md`](../roadmap.md) §2, 0.13.0, row `029`: "Option B: `light-dark()` tokens with a hex fallback, `data-scheme` on any element, `dark:` banned in items, `readToken` returns a resolved colour, alert's tints as tokens." It moves scorecard row 4, theming, from 2 to 3.
- **Design call: the owner's rulings this carries.** They are binding. Quoted from the retired `decisions.md` at `beeb67e` (`context/README.md`), in its entries of 2026-11-15:
  - "**Light and dark scoped to any part of a page.** **The owner:** 'what should we do? we have lots to study from.'" The design lead's recommendation then, which the memo confirmed: "Each colour token holds both its values in one variable, with CSS `light-dark()`. An attribute on any element sets `color-scheme`, so any subtree can be light or dark. Registry items stop using Tailwind's `dark:` variant; a test forbids it. Every difference between schemes lives in the tokens."
  - The memo's five corrections, recorded under the same entry:
    - "**Contrast is set on `<html>` only,** never on a subtree."
    - "**The scope rule also sets `color` and `background-color`,** in `@layer base`, because inherited `color` does not follow the scope."
    - "**Portals still need routing,** since `light-dark()` does nothing for an overlay mounted under `<body>`."
    - "**`readToken` must return a resolved colour,** which is an interface change."
    - "**Browsers without `light-dark()` get a generated fallback,** and `dark:` is banned only in `src/lib/registry/`, not on the site."
  - "**The roadmap's questions (2026-11-15)** … **The scoped-schemes questions take the memo's answers:**
    - `light-dark()` with a generated fallback for older Safari;
    - `.dark` kept as an alias for two minor releases;
    - high-contrast colours as new shades of the brand's hues, measured to 7:1 and approved by the owner;
    - non-text elements reach 4.5:1 in high contrast."

    The last two are `031`'s. They bind this specification only in decision 16, which leaves room for them. So the roadmap's scoped-schemes questions are answered.
  - "**A high-contrast scheme.** **The owner:** 'yes to high contrast theme.'" That is `031`.
  - "**Transparency always signifies depth.** … Everything inside a layer is on that layer's level. It never lets the colour behind it show through." (the owner, 2026-11-15; `019a` decision 3). This ruling makes alert's tints solid (decision 10).
  - "**The old `pluto` names keep working for one release** after `020`'s rename." That sets `020`'s alias term (0.14.0). This specification's `.dark` alias has its own term, two minor releases, from the ruling above.
  - "Constitution §6: … From 1.0, nothing is removed without a deprecation in an earlier minor release." Every interface change has a migration note (the owner, 2026-11-15).
- **Research it stands on:**
  - [`../research/2026-11-15-scoped-schemes-and-contrast.md`](../research/2026-11-15-scoped-schemes-and-contrast.md), cited as *scoped* §n, with its §9 and §10 corrections, appended for this specification.
  - [`../specifications/021-tokens-for-everyone.md`](021-tokens-for-everyone.md) decisions 2, 7 and 11: the files, the resolver, `kuiper.css`. Decision 7 leaves `029` free: "`029`, scoped schemes, changes the CSS, not the tokens … Nothing here constrains how `029` emits." Decision 14 here amends decision 11.
  - [`../specifications/023-prop-doc-comments.md`](023-prop-doc-comments.md) decisions 10 and 14: the `var()` test and the lane-I order.
  - [`../specifications/019a-the-fonts-own-spacing-the-glass-bar-and-depth.md`](019a-the-fonts-own-spacing-the-glass-bar-and-depth.md) decision 3: the depth rule.
  - [`../specifications/001-tokens-and-the-registry.md`](001-tokens-and-the-registry.md) decision 14 and its rule: no rule nested in an at-rule of the theme's `css` uses the selector `:root` or `.dark`, because the CLI writes the palette into it.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md) row 4.
  - The specification review and its probes, cited as **EXECUTED (review)** and **READ (review)**.
- **Measurements made for this specification** are labelled **EXECUTED (029)**. They are read-only greps over the working tree and probes in the session scratchpad, on 2026-11-15, under `/private/tmp/claude-501/-Users-claygendron-Git-Repos-design-system/7b613866-3b2d-4829-bdd1-f2b35ebc0fd1/scratchpad/`:
  - `029/probe.mjs`, `probe2.mjs`, with output in `probe-out.txt`: the first draft's shape, in three engines.
  - `029-rev/engines.mjs`, with output in `engines-out.txt`: the revised shape, modern and emulated fallback, light and dark systems, a page with no scheme and a dark page. 24 runs, 18 readings each, Chromium, Firefox and WebKit on the repository's Playwright 1.64.1.
  - `029-rev/cli.mjs`, with output in `cli-out/`: the shadcn-svelte 1.7.1 merge over the revised item, from apps installed at v0.11.0 and v0.12.0. It uses the reviewer's scratch export of the CLI's merge function.
  - `029-rev/vite/`: two production builds of a scratch app with Vite 8.3.5, one with Lightning CSS's `LightDark` lowering excluded and one without.
  - `029-rev/layer.mjs`: `kuiper.css`'s layered scope rule against layered and unlayered styles, in three engines.
  - `029/tw.mjs` and `029/tints.ts`: a Tailwind 4.3.3 `compile()`, and the tint colours from `scripts/contrast.ts`.
  - Web facts are **CITED**, read on 2026-11-15. The builder pins every count again on the tree `021` and `023` leave.

## Intent

Today a part of a page can be dark, but not light. `class="dark"` makes a subtree dark, and the ink surface uses it. Nothing makes a subtree light inside a dark page. Three things leak through:

- Tailwind's `dark:` variant, which reads any `.dark` ancestor;
- three `.dark …` descendant rules in the theme;
- every derived variable, such as `--code-text`, which is fixed where it is declared.

`015` gave up and showed each example in its own framed document (*scoped* §1).

This specification lets any element take either scheme, nested to any depth, in both directions. Each colour variable holds both its values in one `light-dark()`. An attribute, `data-scheme="light"` or `"dark"`, sets the element's `color-scheme`. The browser then picks each colour where it is painted. Nothing is declared twice, so nothing derived goes stale.

It also does four things that depend on it:

- It keeps `.dark` working for two minor releases, in apps updated from older versions too.
- It gives browsers without `light-dark()` a generated hex fallback.
- It removes `dark:` from items, so alert's tints become tokens.
- It makes `readToken` return a colour a canvas can use.

And it makes sure a production build keeps the pairs. Vite 8's default minifier would otherwise lower them, which removes scoping (decision 8).

**Terms of art.**

- A **scheme** is light or dark. A **scope** is an element whose subtree takes a scheme of its own: one with `data-scheme`, the alias `.dark`, or the ink surface.
- **`light-dark(a, b)`** is a CSS colour function. It gives `a` or `b` by the **used colour scheme** of the element that paints with it. That is the element's `color-scheme`, inherited, or the reader's system preference when that is `light dark`.
- A **pair** is a colour variable's value written as `light-dark(<light>, <dark>)`.
- The **derived-variable trap**: a `var()` inside a custom property is substituted where it is declared, so a copy declared on `:root` keeps `:root`'s value everywhere (*scoped*, "Terms"). With pairs, the copy holds the whole pair, so it stays right in every scope (*scoped* §3, EXECUTED).
- **Lowering** is a build tool rewriting a newer CSS feature into an older form. Lightning CSS lowers `light-dark(a, b)` into `var(--lightningcss-light, a) var(--lightningcss-dark, b)`, with the two switches set where `color-scheme` is declared. In a custom property that form falls into the trap.
- The **fallback** is the CSS that browsers without `light-dark()` use: today's hex values, per scheme, under `@supports not (color: light-dark(#000, #fff))`.
- A **legacy selector** is one of the three `.dark …` selectors that v0.11.0 and v0.12.0 ship, which an installed app keeps after any update (decision 4).
- **Baseline**: the web-features project's mark for a feature supported in every major engine. "Widely available" means 30 months after that.

## The problem, counted

All counts EXECUTED (029), on today's tree.

- **`dark:` in `src/lib/registry/`: 2 uses, in 1 file.** `ui/alert/alert.svelte` line 10, `dark:bg-destructive/20`, and line 12, `dark:bg-success/20`.
  - No other item file holds a `dark:` variant, `@variant dark`, `:is(.dark` or `[.dark_&]`.
  - The literal lint already forbids `dark:` (L2) and translucent tints (L1), except for exactly four classes in `SANCTIONED_TINTS` (`scripts/lint-literals.ts`): `bg-destructive/10`, `bg-success/10`, and their two `dark:` twins.
  - Those four are the only alpha state tints in any item.
- **`.dark …` rules in the theme: 3.**
  - `.dark .surface-ink`;
  - `.dark [data-mode="expressive"]`, with its `[data-mode="expressive"].dark` twin;
  - `.dark [data-mode="productive"]`, with its twin.

  Each depends on an ancestor, not on the nearest scope. v0.11.0 and v0.12.0 ship all three, with hexes, and the CLI never removes a rule (READ (review), `static/v0.1x.0/r/styles/maia/pluto-theme.json`).
- **Colours are written twice.** `src/app.css` declares 145 variables in `:root` and 98 in `.dark`. The 16 `--code-*` slots and the 7 `--surface-*` copies are repeated in `.dark` only to escape the trap (`build-tokens.ts`, its comments on the code slots and on `brandTheme`).
- **No light island is possible.** There is no `.light` rule, no `data-scheme` and no `light-dark()`. The bench's `theming` block reads `lightDarkFn` 0, `dataScheme` 0 and `lightReset` 0.
- **`readToken` reads raw text.** It returns `getPropertyValue("--x")`. Once a token is a pair, that text is `light-dark(#2d48d4, #f3f0e8)`. Chromium and WebKit reject it as a canvas `fillStyle`, and Firefox paints the light value inside a dark scope (*scoped* §3, EXECUTED). Its documented use, the canvas mark on the `read-token` page, would break.
- **The site switches its frames with the class alone.**
  - `src/lib/site/example-theme-script.svelte` toggles `dark` from the frame's address.
  - `src/lib/preview/block-viewer.svelte` copies the parent's `dark` class onto its frame.

  Under a root of `color-scheme: light dark`, a frame without `.dark` would follow a dark system (READ (review)).
- **The site uses `dark:` for content, not colour: 10 uses in 5 files.** These are `dark:hidden`, `dark:inline`, `dark:block` and `dark:grid`, in four examples of the theme page and on the Components index. There is also one `.dark .site-thumb` rule in `site.css`. All of them stay (decision 9).
- **One name collides.** The Components index puts `data-scheme="light" | "dark"` on each thumbnail `<img>`. That is `src/routes/(site)/components/+page.svelte`, read by `tests/e2e/site.spec.ts` lines 819 and 836. Under this specification, that attribute makes the image a scope. It is renamed (decision 15).

## What this specification measured, beyond the memo

### The model, in three engines

- **The revised shape is right in all three engines: 0 mismatches in 24 runs** (EXECUTED (029), `029-rev/engines.mjs`). The runs cover Chromium, Firefox and WebKit, modern and emulated fallback, light and dark systems, and a page with no scheme and one with `class="dark" data-scheme="dark"`. Each reading was checked against the expected token. They include:
  - a light scope on a dark page (text `rgb(11, 15, 23)` on `rgb(243, 240, 232)`);
  - its productive mark (`rgb(45, 72, 212)`), with the legacy selectors present;
  - an expressive mark three deep;
  - a productive island inside an expressive stage in a dark scope (`rgb(243, 240, 232)`);
  - ink at four depths;
  - a dark scope inside ink, by the attribute and by the alias (both `rgb(243, 240, 232)` on `rgb(22, 20, 15)`);
  - a dark scope inside a field.
- **A scope inside a field read the field's legend in the first draft, a contrast failure** (EXECUTED (029), `029/probe.mjs`). A dark scope inside a light `field-1` showed text `rgb(22, 20, 15)` on `rgb(22, 20, 15)`, 1:1, in all three engines.
  - A field resets `--foreground` to `var(--field-1-foreground)`, which is itself a pair, and the dark scope resolves it to the dark legend.
  - The memo's "Field utilities, which reset roles, keep working" (*scoped* §4, INFERRED) is incomplete.
  - **The fix:** the scope rule restores the roles a field resets, from the `--surface-*` copies (decision 2).
- **The ink surface needs no registered property** (EXECUTED (029), `029-rev/engines.mjs`). Each scope writes its own scheme's ink ground as a hex, and the ink surface inherits its parent's. Ink read the dark `background` on a light page, in a light scope and in a light scope inside a dark one. It read the dark `card` on a dark page and in a dark scope. With scripts off it followed the system. This holds in the fallback too (decision 3).

### Builds, the CLI and layers

- **Vite 8's production build lowers every pair** (EXECUTED (029), `029-rev/vite/`; EXECUTED (review), `minify-probe.mjs`).
  - Built with Vite 8.3.5's defaults, `:root { --background: light-dark(#f3f0e8, #16140f) }` became `--background: var(--lightningcss-light, #f3f0e8) var(--lightningcss-dark, #16140f)`.
  - `html [data-scheme="dark"]` gained `--lightningcss-light: ; --lightningcss-dark: initial`.
  - In that form the trap returns, and the reviewer measured a `data-scheme="dark"` section reading light in all three engines.
  - Built with `css: { lightningcss: { exclude: 1048576 } }`, which is `Features.LightDark` in Lightning CSS 1.33.0 (READ, `node_modules/lightningcss/node/flags.js`), every pair was kept and no `--lightningcss-*` variable was written. The `@supports not (…)` condition survived both builds.
  - Vite 8's default `build.cssTarget` is "baseline-widely-available": `chrome111`, `edge111`, `firefox114`, `safari16.4`, `ios16.4`. None of these has `light-dark()` (READ (review), Vite 8.3.5 `dist/node/chunks/node.js`).
- **The site's build already lowers today** (READ (review), `build/_app/immutable/assets/0.Dh62Kh94.css`). `:root` holds `--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light`.
  - Three LayerChart stylesheets hold lowered pairs (EXECUTED (029), `build/_app/immutable/assets/chart.*.css`, `Labels.*.css`, `Path.*.css`). Each is the fallback of a `var(--color-surface-100, light-dark(white, black))` or `var(--color-surface-300, …)` that Kuiper never sets.
- **The CLI does not see a pair as a colour** (READ, `node_modules/shadcn-svelte/dist/index.mjs`, 1.7.1, function `xs`).
  - It treats a value as a colour only if it starts with `hsl`, `rgb`, `#` or `oklch`, or contains `--color-`.
  - For any other value it writes `--<name>: var(--<name>)` into `@theme inline`, not `--color-<name>: var(--<name>)`, so no `bg-background` utility would exist.
  - The self-reference is harmless: Tailwind 4.3.3 emits it in `@layer theme`, where the unlayered `:root` value wins (EXECUTED (029), `029/tw.mjs`). The fix is decision 7.
- **The CLI matches `:root` and `.dark` as whole selector-list items, and an item's other rules by exact selector text** (READ, functions `ps`, `hs` and `Es`).
  - A list item such as `:where([data-scheme="dark"], .dark)` is not written into.
  - A rule whose selector text equals an installed one has its declarations replaced in place.
- **Restating the three legacy selectors overwrites their hexes** (EXECUTED (029), `029-rev/cli.mjs`). After one `add`, the upgraded app's `.dark .surface-ink` and both `.dark [data-mode=…]` rules held the pairs, whether the app was installed at v0.11.0 or at v0.12.0.
  - A second `add` left the CSS byte-identical, from both versions and in a fresh app.
  - No variable the 0.13.0 item declares held a stale hex outside the fallback.
  - An app from v0.11.0 keeps four dead `.dark` hexes, `--syntax-amber`, `--syntax-purple`, `--syntax-teal` and `--syntax-cyan`. Those names were removed in 0.12.0, so nothing reads them.
- **`@property` cannot be installed twice** (READ and EXECUTED (review), `cli-probe.mjs`). The CLI writes a `@property` key as a rule whose selector text starts with `@property`. On the next `add` it reads that rule back as an at-rule, does not find it, and appends another copy. The first draft's `@property --ink-ground` is dropped (decision 3).
- **A named layer gives `kuiper.css`'s scope rule no weight only if it comes first** (EXECUTED (029), `029-rev/layer.mjs`, three engines).
  - An unlayered app rule always beat the `@layer kuiper.scope` rule.
  - A layered utility (`@layer utilities { .bg-card }`) beat it when `kuiper.css` was imported first, or when `@layer kuiper.scope;` was declared first.
  - Imported after Tailwind's layer statement, the scope rule won.

### Support, readings and weight

- **Support** (CITED, [web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/light-dark/)). `light-dark()` has been Baseline since 2024-05-13, and is expected to be widely available from 2026-11-13: Chrome 123, Edge 123, Firefox 120, Safari 17.5. Tailwind 4.3.3 targets Safari 16.4 (*scoped* §3, READ), and so does Vite 8's default (above). Safari 16.4 to 17.4 is the gap the fallback covers.
- **What the engines return for a resolved colour** (EXECUTED (029)).
  - `getComputedStyle(probe).color` for a hex token is `rgb(45, 72, 212)`.
  - For an eight-digit hex it is `rgba(11, 15, 23, 0.1)`.
  - For a `color-mix(in srgb, …)` it is `color(srgb 1 1 1 / 0.24)`.
  - A canvas round trip is not exact: `rgba(11, 15, 23, 0.1)` painted and read back is `#0a14141a` in Chromium and WebKit and `#0913131a` in Firefox.
  - Parsing the computed text gave back every one of 256 alphas exactly (EXECUTED (review)).
- **A probe element works out of the layout** (EXECUTED (029)). A `display: none` span appended to a canvas inside a dark scope computed the dark colour in all three engines.
- **The tints, solid** (EXECUTED (029), `scripts/contrast.ts`'s `compositeTenths` and `contrastRatio`; EXECUTED (review)). Destructive and success text on its tint, at today's alphas (10% light, 20% dark):

  | Scheme | Role | Over `background` | Ratio | Over `card` | Ratio |
  |---|---|---|---|---|---|
  | light | destructive | `#EEDBD6` | 4.50 | `#F9E9EA` | 5.10 |
  | light | success | `#DBE4D9` | 4.51 | `#E6F1EE` | 5.09 |
  | dark | destructive | `#452E29` | 5.90 | `#4E3631` | 5.21 |
  | dark | success | `#25372A` | 5.93 | `#2E4032` | 5.19 |

- **The weight is all the fallback** (EXECUTED (review), from v0.12.0's colour blocks). Today the colour CSS is 1,281 bytes gzipped.
  - With pairs, the restated alias and the fallback's two hex sets, it is 2,012: **+0.73 kB per page**.
  - With pairs and the alias but no fallback, it is 1,143: −0.14 kB.
  - The restated `.dark` block compresses to almost nothing, and one pair is shorter than two declarations.
  - The builder measures the real figure (decision 19).

## Decisions

### 1. One variable per colour, as a pair, on `:root`

- **Every colour variable the theme declares is written once, in `:root`.** Its value is `light-dark(<light>, <dark>)`, both lower-case hex, read from the two scheme contexts of the resolver (`021` decision 7). A colour that is the same in both schemes is written as its one hex, as `--groove-light: #00000000` is. That covers:
  - the 61 roles and the two new tints (decision 10);
  - the four fields and their legends;
  - the glass's colours;
  - the mark's four.
- **A value that holds colours but is not a colour** carries a pair at each colour. Today there is one: `--glass-shadow: 0 1px 0 light-dark(#0b0f170f, #00000000), 0 16px 32px -16px light-dark(#0b0f1747, #000000b3)`. `light-dark()` takes colours only (*scoped* §3, EXECUTED), so each pair goes inside, at its colour.
- **The derived copies are declared once, in `:root`.** These are the 16 `--code-*` slots (`var(--syntax-*)`), the 7 `--surface-*` copies (`var(--<role>)`), and a new eighth copy, `--surface-background: var(--background)` (decision 2).
  - They are no longer repeated for the dark scheme. Each copy holds the whole pair, so it resolves where it is painted (*scoped* §3; EXECUTED (029)).
  - The comments in `build-tokens.ts` that explain the repetition are rewritten to say why it is gone.
  - `--surface-background` is not in `SURFACE_ROLES`. So `surface-plain` and `glass` do not reset `--background`; only the scope rule reads it.
- **`:root` sets `color-scheme: light dark`.** It was `light`. A page with no `data-scheme` on `<html>` follows the reader's system, before any script and with scripts off.
  - That closes the 2026-11-14 placeholder memo, the need a docs app named (*scoped* §4, "A gain it did not claim").
  - With scripts on, the head script writes the attribute before first paint (decision 5). So nothing else changes for a page that has the `theme` item.
- *Why:* it is the owner's ruling, and it removes the trap at its root. The scope rule then redeclares no token (decision 2).
- **It holds only if the build keeps the pairs.** Decision 8 makes sure it does.

### 2. `data-scheme` on any element, and how it composes with `color-scheme`

- **The attribute is `data-scheme`, with two values, `light` and `dark`.**
  - They are exactly the resolver's scheme context names, `THEMES` in `scripts/tokens.ts` (`021` decision 7: "Each scheme context's name is a scheme name, and so a `data-scheme` value").
  - Any other value matches no rule and does nothing.
  - There is no `system` value. A subtree that wants the system writes `color-scheme: light dark` itself, which works (*scoped* §3, EXECUTED).
- **It works on any element, `<html>` included, nested to any depth.** The nearest scope wins, because `color-scheme` inherits.
- **The scheme rules, unlayered:**

  ```css
  html[data-scheme="light"], html [data-scheme="light"] { color-scheme: light; }
  html[data-scheme="dark"], html [data-scheme="dark"] { color-scheme: dark; }
  ```

  At specificity (0,1,1) they beat `:root` and `.dark` (0,1,0) on the same element, in any source order. So **the attribute wins over the class** on an element that carries both (EXECUTED (review)). An app's CSS may put the CLI's rules and the theme's in any order; these do not depend on it.
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
      --background: var(--surface-background);
      color: var(--foreground);
      background-color: var(--background);
    }
  }
  ```

  - **`color` and `background-color`:** an inherited `color` keeps the parent's resolved value. A scope that did not set it would show the page's text colour on its own ground (*scoped* §3, EXECUTED; the owner's ruling above).
  - **The first seven restorations** are the roles a field resets (`SURFACE_ROLES` in `build-tokens.ts`). Restoring them from the `--surface-*` copies is what `surface-plain` already does. Without it, a scope inside a field reads 1:1 (EXECUTED (029), above). Outside a field, each copy equals its role, so nothing changes.
  - **The eighth, `--background`,** gives every scope its own scheme's ground, whatever an ancestor set. An ancestor that sets `--background` is the ink surface. Without this restoration, a dark scope inside ink kept the ink ground, while `.dark` and a light scope in the same place reset it (EXECUTED (review), finding 6). With it, the attribute and the alias read the same inside ink (EXECUTED (029), `029-rev/engines.mjs`). `.surface-ink`'s own unlayered `--background` still wins on the ink element itself, and no field resets `--background`.
  - **The cost of the restorations:** an app's own override of one of these eight variables on a wrapper does not reach inside a nested scope. The alias already behaves this way, since it restates every variable. The guide says so (decision 18).
  - **`@layer base` and `:where()`** give the rule no weight: any utility on the same element, such as `bg-card` or `bg-transparent`, wins (*scoped* §4). On `<html>`, the unlayered `:root` and `.dark` declarations win over the restorations, so the root never refers to itself.
  - **Why `.dark` and `.surface-ink` are in the list:** they are scopes too (decisions 3 and 4). The list sits inside `:where()`, so the CLI does not read `.dark` as the selector (READ, above).
  - **So a `.dark` element now paints.** In 0.12.0 a `.dark` wrapper set variables and painted nothing. Now it paints its ground and its text colour, like any scope. The changelog and the guide say so (decisions 17 and 18).
- **No token is redeclared on a scope.** That is the point of decision 1. The only declarations on a scope are:
  - the eight restorations, which read copies;
  - `color` and `background-color`;
  - `color-scheme`;
  - `--ink-ground` (decision 3).
- **How it composes with an app's own `color-scheme`.**
  - `light-dark()` reads the used scheme, so an element an app gives `color-scheme: dark` already resolves dark colours.
  - That element does not get the scope rule: no `color`, no ground and no restorations. The documented way is the attribute.
  - An app's own `color-scheme` on a `data-scheme` element wins or loses by the usual cascade. The theme's rules are unlayered, at (0,1,1).
- **Portals are not scoped by the attribute.** See decision 12.

### 3. The mode's marks and the ink surface, without descendant rules

- **The mode's marks become pairs on the mode element.**

  ```css
  [data-mode="productive"] { --radius-action: var(--radius);
    --mark-1: light-dark(#2d48d4, #f3f0e8); /* … to --mark-4 */ }
  [data-mode="expressive"] { --radius-action: var(--radius);
    --mark-1: light-dark(#2d48d4, #93b0ff); /* … to --mark-4: the lifted four */ }
  ```

  - The light values are the light `mark-n` roles. The dark values are the dark `mark-n` roles (productive) and `tokens.expressiveDarkMarks` (expressive), as `021` decision 6 lowers them.
  - A dark scope inside an expressive stage now shows the lifted dots, which `.dark` never could.
  - These rules print after the `.dark` block. So `[data-mode="expressive"]` on a `.dark` element still wins, as the twin selector did.
  - A `.dark` element inside an expressive stage restates the productive marks (decision 4), as in 0.12.0.
- **The ink surface is a dark scope of its own.** `.surface-ink` sets `color-scheme: dark`, so `class="surface-ink"` alone is enough. `class="dark surface-ink"` keeps working while the alias does.
- **Its ground follows its page's scheme: each scope writes its own ink ground as a hex.**

  ```css
  :root { --ink-ground: #16140f; }
  @media (prefers-color-scheme: dark) {
    html:not([data-scheme], .dark) { --ink-ground: #221f19; }
  }
  html:is([data-scheme="dark"], .dark),
  html :is([data-scheme="dark"], .dark):not(.surface-ink) { --ink-ground: #221f19; }
  html[data-scheme="light"],
  html [data-scheme="light"]:not(.surface-ink) { --ink-ground: #16140f; }
  .surface-ink {
    color-scheme: dark;
    --background: light-dark(#f3f0e8, var(--ink-ground));
    --code-background: var(--background);
    --code-active-line: var(--muted);
    background-color: var(--background);
    color: var(--foreground);
  }
  ```

  - `--ink-ground` is the dark `background` in a light scope and the dark `card` in a dark one. A root with no attribute and no class follows the system through the media query; that is a page with scripts off.
  - The ink surface never declares `--ink-ground`, so it inherits its parent scope's hex. That keeps `007`'s rule, "Ink on a light page, `card` on a dark one", at any depth (EXECUTED (029), `029-rev/engines.mjs`).
  - The light rule prints after the dark one, so the attribute wins over the class on one element, as in decision 2.
  - No selector here is `:root` or `.dark` as a list item, inside an at-rule or out (001 decision 14).
  - The hexes are the dark `background` and dark `card` roles, written by the generator. `--ink-ground` is private: it is not a token, not in DTCG, and not in `kuiper.css`. Its name says what it is, with no prefix, as with `--surface-*`.
  - **Why not a registered property, as the first draft had:** the CLI appends another `@property` copy on every `add` (READ and EXECUTED (review)). A plain hex per scope gives the same readings. It needs no `@property` support, so it also works in Firefox 120 to 127, which have `light-dark()` but not `@property`.
  - **`--background`'s light arm is the light `background` role,** so a light scope nested inside an ink surface is light again (EXECUTED (029)).
  - `.surface-ink` prints after the `.dark` block, as today. So on `class="dark surface-ink"` its `--background` wins by source order.
- The theme's own `.dark .surface-ink` rule is no longer needed. For installed apps it stays until 0.15.0, restated (decision 4).

### 4. `.dark`: an alias of `data-scheme="dark"` for two minor releases

The owner's ruling: "`.dark` kept as an alias for two minor releases." So **`.dark` works in 0.13.0 and 0.14.0, and goes in 0.15.0.**

What the alias is in 0.13.0 and 0.14.0:

- **`.dark` restates every variable the 0.12.0 `.dark` block held, with the same pair `:root` holds,** and `color-scheme: dark`.
  - In the item, `cssVars.dark` holds every key of `cssVars.light` but `radius`, each with the same value. `css[".dark"]` holds the fields, the glass and the `--surface-*` copies, as pairs.
  - *Why restate the same values:* an app updated from 0.12.0 still has `.dark { --background: #16140f; … }`. The CLI replaces or adds declarations, and never removes one (*scoped* §5, READ). Left there, those hexes would beat the pairs under `.dark` and break a light scope inside it. Restated, the CLI overwrites every one.
  - The alternative, asking each app to delete its `.dark` block, could fail silently (constitution §6).
- **The three legacy selectors are restated too, by their exact text, with pairs.** An installed app keeps them (READ (review)). At (0,2,0) under `html.dark`, which the head script writes until 0.15.0, they would paint a productive mark at 1.00:1 and an expressive one at 1.86:1 in a light scope on a dark page (EXECUTED (review), finding 2). So `css` keeps three keys, each holding the value its new rule holds, so that in a modern engine it changes nothing:

  | Selector, exactly as v0.11.0 and v0.12.0 ship it | Declarations, from 0.13.0 |
  |---|---|
  | `.dark .surface-ink` | `--background: light-dark(<light background>, var(--ink-ground))`, as `.surface-ink` |
  | `.dark [data-mode="expressive"], [data-mode="expressive"].dark` | `--mark-1` to `--mark-4`, the expressive pairs, as `[data-mode="expressive"]` |
  | `.dark [data-mode="productive"], [data-mode="productive"].dark` | `--mark-1` to `--mark-4`, the productive pairs, as `[data-mode="productive"]` |

  - The CLI finds each by its exact text and replaces its hexes with the pairs (EXECUTED (029), `029-rev/cli.mjs`, from v0.11.0 and from v0.12.0).
  - If an app has reformatted one of these selectors, the CLI appends the rule instead. It comes later, at equal weight, so it wins.
  - The fallback restates the same three selectors (decision 6), so an older engine is not left with an invalid pair at (0,2,0).
  - T3 exempts these three strings, by exact text, until 0.15.0.
- **`.dark` is a scope** (decision 2's list), with the `.dark { color-scheme: dark }` the theme already writes. So it now paints (decision 2).
- **The head script, the store and the site's frame scripts write the class on `<html>`** for the dark scheme, as well as the attribute (decisions 5 and 15).
  - So an app's own `dark:` classes keep working, since the CLI's variant is `&:is(.dark *)` and the CLI never rewrites an app's variant (*scoped* §5).
  - They follow the page, not a scope (decision 9).
- **`src/app.css` keeps `@custom-variant dark (&:is(.dark *));`.** It is the preview of an installed app's CSS, and the CLI writes exactly that line.

**What goes in 0.15.0, by a specification of its own.** Removing the alias changes an interface, so it is not a small change (constitution §5). `029`'s landing adds it to the roadmap as a 0.15.0 row. Its list:

- `cssVars.dark`, `css[".dark"]`, and `.dark` in the scope rule, the ink rules and the fallback's selectors;
- the three legacy selectors, in the item and in the fallback, and a guide step telling apps to delete them, with the dead `.dark` block;
- the class write in the head script, the store, `example-theme-script.svelte` and `block-viewer.svelte`, which changes `THEME_SCRIPT` again, so a CSP hash changes in 0.15.0 too;
- the custom variant line, and the guide's replacement for an app's own `dark:` variant;
- the site's own `dark:` uses (10 in 5 files) and `.dark .site-thumb` (`site.css:256`). The index's first-row pictures are chosen by that rule (`beeb67e` decisions, "The index's first row loads without script"). Each moves to a `data-scheme`-based selector;
- its own changelog bullet and guide, at `/changelog/0.15.0/upgrade/`.

### 5. The head script and the store

The head script keeps `020` decision 5's steps for the choice: read `kuiper-theme`, carry `pluto-theme` over once, validate, else the system. It changes only what it writes:

```js
var root = document.documentElement;
root.setAttribute("data-scheme", dark ? "dark" : "light");
root.classList.toggle("dark", dark); // the alias, until 0.15.0
```

- **The attribute is always written: the scheme in force,** chosen or from the system.
  - *Why always, not only for a stored choice (the memo's form):* a browser without `light-dark()` has only the fallback, and the fallback keys on the attribute or the class (decision 6). Once the class goes in 0.15.0, a page following a dark system would read light there. Written always, the attribute carries it.
  - Scripts off, there is no attribute, and `:root`'s `light dark` follows the system (decision 1).
- **The store's effect writes both**, the attribute and the class, from `theme.resolved`, as it writes the class today. Its `storage` listener and `MediaQuery` are unchanged. So a change of the system's scheme still updates both while no choice is stored.
- **`THEME_SCRIPT` changes value.** `020` changes it too, in the same release. An app that allows the script by a CSP hash updates the hash once, for 0.13.0. An app that passes `nonce` does nothing.
- `ThemeToggle`, `THEME_KEY`, `readStoredTheme` and the types do not change.
- **An app that toggles `.dark` itself,** without the `theme` item, must also set `data-scheme` on `<html>`, for both schemes. Otherwise, under `light dark`, its "light" follows a dark system. The guide says so (decision 18, step 3).

### 6. The hex fallback

The owner's ruling: "`light-dark()` with a generated fallback for older Safari."

- **The condition is `@supports not (color: light-dark(#000, #fff))`.** In such an engine every pair is invalid at computed-value time (*scoped* §3, INFERRED). So the fallback must win over `:root`, `.dark` and the legacy selectors on every element where it applies. Lightning CSS and Tailwind keep the condition (EXECUTED (029) and (review)).
- **Its contents are 0.12.0's model, generated, and extended to the attribute and the nest:**
  1. **The dark set**, at (0,2,1) on the root and (0,1,1) below it: `html:root:is(.dark, [data-scheme="dark"]), html :is(.dark, [data-scheme="dark"], .surface-ink)`. Every scheme variable as its dark hex, with the 16 `--code-*` copies and the 8 `--surface-*` copies redeclared, as 0.12.0 did.
  2. **The light set**, after it: `html:root, html [data-scheme="light"]`. The same names as light hexes, and the copies.
     - On the root it loses to the dark set by specificity.
     - On a subtree that carries both the class and `data-scheme="light"`, it wins by order, so the attribute wins, as in decision 2.
  3. **The root's scheme with scripts off:** `html:root:not([data-scheme], .dark) { color-scheme: light; --ink-ground: #16140f; }`. An older Safari with scripts off reads the light set. So its form controls, scrollbars and ink ground must be light too, not follow a dark system from `:root`'s `light dark`. The first probe of this found ink reading `card` on that light page (EXECUTED (029), fixed and run again).
  4. **The ink surface:** `html .surface-ink, .dark .surface-ink { --background: var(--ink-ground); }`, printed after the sets. The second selector matches the legacy one, which would otherwise hold an invalid pair at (0,2,0). The ink ground itself needs no fallback: its rules are hexes (decision 3).
  5. **The mode's marks, through private copies.**
     - Each set also declares `--_mark-productive-1` to `-4` and `--_mark-expressive-1` to `-4` for its scheme.
     - Then `[data-mode="productive"], .dark [data-mode="productive"], [data-mode="productive"].dark { --mark-n: var(--_mark-productive-n) }`, with its expressive twin.
     - Each copy is substituted on the mode element, from the nearest scope's set, so the dots are right at any depth.
     - The legacy selectors are listed so the fallback wins over their pairs at (0,2,0), by order.
     - A descendant selector cannot find the nearest scope. Inside a light scope in a dark one, a `.dark [data-mode]` rule would paint the light blue on a dark ground, about 2.6:1, below 3:1.
  6. **`--glass-shadow`** as each scheme's hex shadow.
- **It is right at every depth tried.** In the emulated fallback, every reading matched the modern one: the marks three deep, ink at four depths, the field case, and a dark page with a light scope (EXECUTED (029), `029-rev/engines.mjs`, 12 fallback runs, 0 mismatches). The first draft's probe had no mark copies and read the fallback marks wrong; that claim was withdrawn (review finding 7).
- **No `:root` or `.dark` is a selector-list item** in any of it. The selectors use `html:root`, `:is(.dark, …)` and the legacy compound selectors (001 decision 14; READ, above). `generated.test.ts`'s check is sharpened to read selector lists with PostCSS's `list.comma` (T6).
- **The fallback does not offer following the system with scripts off.** That would need a third hex set under `prefers-color-scheme`. An older Safari with scripts off reads light, as every browser does today, with a light `color-scheme` (item 3).
- **It is all of this specification's added weight,** about +0.73 kB gzipped per page (EXECUTED (review), an estimate; decision 19). Without it, the colour CSS is slightly smaller than today.
- **When it goes: the owner's answer to Q1** (2026-11-15). The fallback is removed by a specification in the minor release after both Tailwind's `optimize` targets and Vite's default `build.cssTarget` reach Safari 17.5. Until then, a build on the install path still targets an engine without `light-dark()`. Removing it changes the supported browsers, so it is a changelog entry and a specification, not a small change.
- **It is tested by emulation in all three engines** (T12). Every installed engine supports `light-dark()`. So the test renames the function in the served CSS; the declarations are then invalid, and the `@supports not` block applies.

### 7. What the CLI writes, and the colour utilities

- **`cssVars.theme` holds `color-<name>: var(--<name>)` for every colour variable in `cssVars.light`,** not only the code slots. The CLI's own colour check misses a pair (READ, above).
  - Today `appCss` writes these lines into `src/app.css` only (`colourTheme`). They move into the item, so an app gets them from `add`. `src/app.css` is unchanged by the move.
  - The CLI writes the item's `color-*` lines first. Its own pass then finds them and adds no `--color-` line of its own. It does add `--<name>: var(--<name>)` for each pair, which is harmless (READ and EXECUTED (review); EXECUTED (029)).
- **The theme's `css` holds no `@property`** (decision 3).
- **A second `add kuiper-theme` leaves the app's CSS byte-identical,** from v0.11.0, from v0.12.0 and fresh (EXECUTED (029), `029-rev/cli.mjs`). That is 001 decision 25's smoke check, unchanged, and T17.

### 8. Production builds keep the pairs

Vite 8's default CSS minifier, Lightning CSS, lowers every pair for its default targets, and that brings back the trap (EXECUTED (029) and (review), above). Without this decision, scopes work under `vite dev` and do nothing in a production build, in the site and in every Vite 8 app.

- **The site excludes the lowering**, in `vite.config.ts`:

  ```ts
  import { Features } from "lightningcss";
  // 029 decision 8: keep light-dark() as written. Lowered, a pair inside a
  // custom property is fixed where it is declared, and data-scheme does
  // nothing. Browsers without light-dark() take the theme's own fallback.
  export default defineConfig({ css: { lightningcss: { exclude: Features.LightDark } }, … });
  ```

  - Vite spreads `css.lightningcss` into its minify call (READ (review), Vite 8.3.5 `node.js:30867`). A production build with it kept every pair and wrote no `--lightningcss-*` variable (EXECUTED (029), `029-rev/vite/`).
  - **`lightningcss` becomes a named, pinned devDependency of the site,** at 1.33.0, the version already resolved through Vite in `bun.lock` (constitution §4.6). It is not an item dependency; no installed app receives it from `add`.
  - *Why not raise `build.cssTarget` to Safari 17.5:* that also stops lowering everything else for the browsers the fallback serves. Excluding one feature changes only that feature.
- **What else in the site's build changes** (EXECUTED (029), above). LayerChart's three fallback pairs, `var(--color-surface-100, light-dark(white, black))` and the like, stay native too. An older Safari then drops those declarations, and LayerChart's marker and label halos lose their fill there. Kuiper sets none of `--color-surface-100`, `-300` or `-content`. So today LayerChart's own white and black reach the page, against constitution §4.3. With the exclusion, that gap becomes a regression in Safari 16.4 to 17.4, the range the fallback exists to serve. **It is fixed by [`029a`](029a-the-charts-surfaces-from-roles.md),** a small change in the `chart` item that maps LayerChart's `--color-surface-*` to roles. It is queued in lane I for 0.13.0, before the tag. If it slips, the 0.13.0 changelog names the gap.
- **Every app on Vite 8 needs the same line.** The guide's step (decision 18, step 2) and `/start/install/` give it for each manager: `bun add -d`, `npm i -D` or `pnpm add -D` `lightningcss@<the version Vite uses>`. Under pnpm a transitive package cannot be imported, so the explicit dependency matters. Roadmap row `040` (installs by npm and pnpm) carries this step and T17's build assertion into its npm and pnpm smoke apps (Landing notes). An app that cannot add it writes the flag's number, `1048576`, with the comment above. T17 builds a smoke app for production and checks that the pairs survive.
- **Any build tool that lowers `light-dark()`** has the same effect: Lightning CSS directly, `postcss-preset-env`, and others. `kuiper.css`'s header and the theme page say so in one sentence each.
- **The tests run on a production build.** T10 to T14 run against the preview server, which Playwright's `webServer` starts with `bun run build && vite preview`. A test that passes under `vite dev` proves nothing here, and the builder must not move these tests there. T23 reads the site's built CSS directly.

### 9. `dark:` is banned in items, and what replaces each use

The owner's ruling: "Registry items stop using Tailwind's `dark:` variant; a test forbids it", "banned only in `src/lib/registry/`, not on the site."

- **The count is 2 uses, in 1 file.** Each is replaced:

  | File, line | Today | Becomes |
  |---|---|---|
  | `ui/alert/alert.svelte:10` | `bg-destructive/10 … dark:bg-destructive/20` | `bg-destructive-tint` |
  | `ui/alert/alert.svelte:12` | `bg-success/10 … dark:bg-success/20` | `bg-success-tint` |

  Everything else in the two class strings stays.
- **A unit test forbids it** (T4). Over every file `itemFiles()` lists (`scripts/lint-literals.ts`), it finds none of these:
  - a `dark:` variant in a class;
  - `@variant dark` or `@custom-variant`;
  - `:is(.dark`, or `.dark ` in a selector;
  - `[.dark_&]`.

  It does not read the theme item's generated CSS, which T3 covers, or the site.
- **The literal lint loses its carve-outs.** `SANCTIONED_TINTS` becomes empty. So L1 forbids every translucent tint on a token colour in an item, and L2 forbids every `dark:`. `literals.test.ts` changes with it. This also helps `031b`: after this, no item paints an alpha state tint.
- **No scheme-keyed descendant rule in the theme** (T3). No selector in `kuiper-theme`'s `css`, outside the fallback and the three legacy selectors of decision 4, has `.dark` or `[data-scheme…]` followed by a combinator. Today there are 3, and those are the three legacy selectors (*scoped* §1).
- **The site keeps `dark:`** (10 uses in 5 files) and `.dark .site-thumb`. Its pages are one-scheme documents, and its frames stay (`015`). `dark:` there swaps content, which no token can do (*scoped* §4). They move in 0.15.0 (decision 4).
- **An app's own `dark:`** keeps working while `<html>` carries `.dark` (decision 4). It reads an ancestor, not the nearest scope, so inside a light scope on a dark page it still matches. The guide says so, and says to use tokens for scheme differences (decision 18).

### 10. Alert's tints become tokens, and solid

- **Two roles join each scheme file:** `role.destructive-tint` and `role.success-tint`. Their CSS names are `--destructive-tint` and `--success-tint`, and their utilities are `bg-destructive-tint` and `bg-success-tint`.
- **They are solid.** Each is its role composited over `card`, at today's alpha: 10% in light, 20% in dark.
  - *Why solid:* the owner's depth rule. An alert is on its layer's level, so "it never lets the colour behind it show through" (`019a` decision 3). Today's `/10` lets the card or page show through.
  - *Why over `card`:* the `default` alert is `bg-card`, so a tinted alert is that card, tinted. It also raises the lowest ratio from 4.50 to 5.09 (table above).
  - On the paper page, a light-scheme tinted alert is now slightly lighter than before: 1.03:1 (destructive) and 1.01:1 (success) against the page. Its `border-destructive` or `border-success` edge carries the boundary, as it does today (EXECUTED (review)).
  - **The owner's answer to Q2** (2026-11-15): solid over `card`, lowest contrast 5.09. The review agreed.
- **Four primitives join the base file.** Each is a `color` with its `$description` and `$extensions["co.plutosystems.kuiper"]`: `{ "since": "0.13.0", "composite": { "of": "<primitive>", "over": "<primitive>", "alpha": <tenths> } }`.

  | Primitive | Value | Composite of | Over | Alpha | Ratio with its text |
  |---|---|---|---|---|---|
  | `red-tint` | `#F9E9EA` | `red-text` | `raised` | 0.1 | 5.10 |
  | `green-tint` | `#E6F1EE` | `green-text` | `raised` | 0.1 | 5.09 |
  | `red-tint-lifted` | `#4E3631` | `red-lifted` | `ink-raised` | 0.2 | 5.21 |
  | `green-tint-lifted` | `#2E4032` | `green-lifted` | `ink-raised` | 0.2 | 5.19 |

  - The light roles alias the first two; the dark roles alias the last two.
  - The validator gains one rule: a primitive with a `composite` equals `compositeTenths(of, over, alpha)`, and its alpha is whole tenths (the existing tint rule). So the value cannot drift from its roles.
  - The DTCG paths are additions, so `kuiper.removed.json` gains nothing (`021` decision 10).
- **Each role's `$description`** says what it is for and how it is made. For example: "The ground of a destructive alert: destructive at 10% over card in light, 20% in dark, made solid." It is equal in both scheme files (`021` criterion 4).
- **The contrast file changes.**
  - `[destructive, destructive-tint]` and `[success, success-tint]` join the text pairs.
  - The four `tints` rows and the three `forbidden` rows retire. No item draws an alpha state tint any more, so "no state tint on muted" (001 decision 8) has nothing left to guard.
  - `scripts/contrast.ts` loses `forbiddenRows` and the tint branch of `contrastTable`, and the site's contrast tables follow.
  - The builder pins the new pair count.
- **`021`'s counts move:** 52 primitives (48 + 4) and 63 roles per scheme (61 + 2). `021`'s T2, criterion 2 and criterion 17, and the bench's `primitives`, `rolesPerTheme` and `contrastPairs`, are updated in this build. The landing notes record each.

### 11. `readToken` resolves a colour where it is read

The owner's ruling: "`readToken` must return a resolved colour, which is an interface change."

- **The signature stays:** `readToken(name: string, element?: Element): string`.
- **A colour comes back resolved, as lower-case hex:** `#rrggbb`, or `#rrggbbaa` when alpha is below 1.
  - `readToken("mark-1")` returns `#2d48d4` on a light page, and `#f3f0e8` inside a dark scope.
  - **The case changes in an installed app.** The item has always shipped upper-case hexes, such as `"mark-1": "#2D48D4"`, and `getPropertyValue` returns text as written. So an installed app read `#2D48D4` before. Only this repository's `src/app.css` is lower case (READ (review)). A canvas does not care; a case-sensitive comparison in an app changes. The changelog bullet and the guide say so.
- **How:**
  1. Read the variable's computed text on `element`, or on `<html>` when none is given, as today. Empty means a misspelling: warn in development and return `""`, as today.
  2. If `CSS.supports("color", text)` is false, or `CSS` is not there, return the text, as today. Durations, curves, numbers and font stacks take this path, so `readDuration`, `readEase` and `tween` are unchanged.
  3. Otherwise, append a probe to `element`: a `<span hidden>` with `color: var(--<name>)`. Read its computed `color`, and remove it in the same call. The probe inherits `element`'s scheme, and it works on a canvas or out of the layout (EXECUTED (029)).
  4. Parse the result's numbers: three channels and an optional alpha.
     - When the text names `srgb`, the channels are 0 to 1; otherwise 0 to 255.
     - Each channel rounds to a byte, and alpha is `round(a × 255)`.
     - These are the only forms the three engines give for Kuiper's colours (EXECUTED (029); 256 alphas exact, EXECUTED (review)).
     - Any other form, such as `oklch(…)`, returns the engine's text, which a canvas still accepts.
     - No canvas is used to normalise, because it loses precision at low alpha (EXECUTED (029)).
- **The probe's one style write** is `probe.style.setProperty("color", \`var(--${name})\`)`, and its value is a token reference.
  - The literal lint gains **L25, one counted allowance** for that exact write in `read-token.ts`, as L24 allows the pointer light's (`scripts/lint-literals.ts`).
  - The parser is written without the text of a colour function, so the lint's `COLOUR_FUNCTION` rule has nothing to match.
- **Side effects, documented in the doc comment:** an app's `MutationObserver` on `element`'s children sees one span added and removed. Nothing is laid out or painted between the two.
- **What else changes:**
  - A value that holds colours but is not one comes back as its text, now with `light-dark()` inside. Today only `--glass-shadow` is such a value.
  - An app reading `getComputedStyle(el).getPropertyValue("--x")` itself now gets the pair. The guide points it to `readToken`.
- **The `read-token` page** reads inside `data-scheme="dark"`, not `.dark`. It repaints when `<html>`'s `data-scheme` or `class` changes. Its words say that a canvas repaints only when told, and that an app watching a scope must repaint when the scope changes.

### 12. Portals

`light-dark()` does nothing for an overlay mounted under `<body>`: it opens in the page's scheme (the owner's ruling above). No item changes for this. Every Kuiper overlay's content takes `portalProps`, passed to Bits UI's `Portal`, whose `to` names the mount point (READ, e.g. `ui/popover/popover-content.svelte`, `popover-portal.svelte`).

The documented pattern, on the theme page and in the guide:

- for one overlay, `portalProps={{ to: scopeElement }}`;
- for a whole scoped region, Bits UI's `BitsConfig`, with `defaultPortalTo` set to an element inside the scope (*scoped* §4; the 2026-11-01 ink memo §2.3).

T13 proves both. It also proves that an unrouted overlay opens in the page's scheme, as documented.

### 13. The DTCG files

The token source is `021`'s: the resolver set, unchanged in shape. This specification adds only the four primitives, the two roles per scheme file and their words (decision 10).

- The resolver, its modifier and its contexts do not change.
- The CSS is still made by `build-tokens.ts` from the lowering. A role's two values come from the `light` and `dark` contexts.
- A role's single-value form (decision 1) is used when its two primitives' hexes are equal.
- A test holds that every `data-scheme` value the CSS emits is a `THEMES` value and a context of `scheme` (T1).
- The private variables (`--surface-background`, `--ink-ground`, `--_mark-*`) are generated, and are not tokens.

### 14. `kuiper.css`, and the amendment to `021` decision 11

`021` decision 11 publishes `kuiper.css`, the tokens as plain variables. It says the file "holds nothing else … No rule but these three blocks", "a variables file that carried rules would style an app that asked only for values", and "`029` changes both at once".

**This decision amends `021` decision 11.** `kuiper.css` now carries the scheme switch as well as the values. *Why:* without it, `data-scheme` does nothing in a stack without the theme item, and a scope there shows the page's text on its own ground. The switch is the least behaviour that makes the values correct in a scope.

Its blocks become:

1. a layer statement, `@layer kuiper.scope;`, first;
2. `:root { … }`, with the pairs, the copies once, and `color-scheme: light dark`;
3. `.dark { … }`, the alias, restating the pairs, then `color-scheme: dark` (until 0.15.0);
4. the two `data-scheme` rules of decision 2;
5. the scope rule of decision 2, inside `@layer kuiper.scope { … }`;
6. the fallback of decision 6, without the ink and mode parts, which are the theme item's;
7. the reduced-motion block, unchanged.

- **Why a named layer.** An unlayered rule beats every layered one, whatever its specificity. Unlayered, the scope rule would beat a Tailwind app's `bg-card` on the same element (EXECUTED (review), `layer-probe.mjs`). In a layer, it loses to every unlayered rule, and to every layer declared after it (EXECUTED (029), `029-rev/layer.mjs`). Layer order is set where a layer is first declared.
- **So the header says:** "Import this file before any stylesheet that declares layers, such as Tailwind's, or put `@layer kuiper.scope;` at the top of your first stylesheet. Imported after them, its scope rule wins over their utilities." It also says that a build which lowers `light-dark()` must exclude that (decision 8).
- `--shadow-elevation`'s repeat in `.dark` (`021` decision 11) goes: its `var(--elevation-line)` now holds the pair.
- `--ink-ground` and the legacy selectors are not in `kuiper.css`; the ink surface and the mode are theme rules.
- `021`'s T9 is rewritten to this list. Its "top level is exactly `:root`, `.dark` and one `@media`" becomes these seven blocks. "Every declaration is a custom property or `color-scheme`" gains the scope rule's `color` and `background-color`. "It holds none of … `@layer`" allows exactly `kuiper.scope`.

### 15. The site

- **The theme page gains an example, "A part of the page in the other scheme".** It shows a light card on a dark ground, a dark card on a light ground, and a three-deep nest. Each holds a button, a field, an input, a code line, an alert and the mark. It lives in `src/lib/site/examples/kuiper-theme/`, and its page frame shows it in both schemes, like every example.
- **`surface.svelte`** writes `class="surface-ink"`. **The `read-token` example** follows decision 11.
- **The two frame scripts write the attribute** (review finding 4):
  - `src/lib/site/example-theme-script.svelte` sets `data-scheme` from `?theme=` (`light` unless it is `dark`), and the class while the alias lives.
  - `src/lib/preview/block-viewer.svelte`'s `copyTheme` copies `data-scheme` and the class onto its frame's `<html>`. Its observer watches both attributes.

  Without this, a light frame follows a dark system under `:root`'s `light dark`, and `015`'s frames show the wrong scheme. T22 tests both.
- **`/start/light-and-dark/`, `/start/theme/` and `/start/install/`** are rewritten where they say `.dark` turns on the dark theme. They cover:
  - the attribute, the alias and its term;
  - the scope rule, and that a scope paints;
  - portals and `readToken`;
  - that the root follows the system with scripts off;
  - the Vite line (decision 8).

  `/start/theme/`'s count of `.dark` variables reads the restated block.
- **The Components index's thumbnails** carry `data-thumb-scheme` in place of `data-scheme`, with `site.spec.ts` lines 819 and 836 updated. A thumbnail is not a scope. `scripts/site/thumbnails.ts` uses Playwright's `colorScheme`, not the attribute, so nothing else changes (READ (review)). This is lane S's file. It lands with this specification, after any lane-S build in flight. `031a` redraws the card later.
- **Every thumbnail is regenerated.** `src/app.css` changes, and the thumbnail manifest hashes it for every item (`020`, build step 5). The new `color-scheme` can move pixels in the dark pictures, such as scrollbars and form controls. The builder records the count regenerated and any picture that changed visibly.
- **The site's `dark:` uses stay until 0.15.0** (decision 9).

### 16. Room for `031`, high contrast

The owner's rulings bind `031`, not this specification: "high-contrast colours as new shades of the brand's hues, measured to 7:1 and approved by the owner; non-text elements reach 4.5:1 in high contrast", set on `<html>` only.

This specification leaves `031` one way in. `031` adds two blocks on `<html>`, `html[data-contrast="more"]` and `@media (prefers-contrast: more) { html:not([data-contrast="standard"]) { … } }`. They redeclare roles as `light-dark(<hc light>, <hc dark>)` (*scoped* §6, option B).

- On `<html>`, the copies declared on `:root` substitute the winning value, so they follow without being repeated (*scoped* §4). The eight restorations read those copies, so a scope keeps high contrast.
- **Three things `031` must handle, said here so it is not surprised:**
  - While the alias lives, a `.dark` subtree, and the legacy selectors, restate the standard pairs (decision 4), which would hide high contrast inside them. `031` restates its overrides for those selectors, or lands after 0.15.0's removal.
  - The fallback has no contrast set.
  - Decision 8's exclusion applies to its blocks too.
- The generator keeps one function per output block, so `031` adds blocks without reshaping these.

### 17. Interface changes, and the changelog

One bullet per item in the 0.13.0 entry. Each is marked `**interface change.**`, and each links its guide section.

- **`kuiper-theme`:**
  - every colour variable is a `light-dark()` pair, and `getPropertyValue` on one now returns its pair;
  - `:root` is `color-scheme: light dark`, so a page with scripts off follows the system;
  - `data-scheme="light" | "dark"` makes any element a scope, which paints its ground and text and restores eight variables;
  - `.dark` is an alias until 0.15.0, and a `.dark` element now paints too;
  - `surface-ink` works without `.dark`;
  - the mode's marks follow the nearest scope;
  - `--glass-shadow` holds pairs;
  - new: `--destructive-tint`, `--success-tint` and their utilities;
  - a hex fallback for browsers without `light-dark()`;
  - a Vite 8 app must exclude Lightning CSS's `light-dark()` lowering, or scopes do nothing in production.
- **`theme`:** the head script and the store write `data-scheme` on `<html>`, and `.dark` until 0.15.0. `THEME_SCRIPT` changes value, so a CSP hash changes, once for 0.13.0 with `020`'s change.
- **`read-token`:** `readToken` returns a colour resolved where it is read, as lower-case hex. Installed apps read upper case before. `--glass-shadow` reads as text, with pairs inside.
- **`alert`:** the destructive and success variants paint solid tints, `bg-destructive-tint` and `bg-success-tint`, in place of a translucent tint and a `dark:` class.
- **Tokens:** four primitives and two roles per scheme, from 0.13.0; the contrast file's `tints` and `forbidden` retire; `kuiper.css` gains the scheme switch, in a named layer, and the fallback.

`registry.test.ts` checks that the bullets name these (T18).

### 18. The upgrade guide's section

`029` appends one section to `src/lib/site/upgrade/0.13.0.ts`, rendered at `/changelog/0.13.0/upgrade/` (`020` decision 12). Its title is **"`029`: light and dark on any element."** Its steps, in order:

1. **Update `kuiper-theme` and `theme` together:** `add kuiper-theme theme`, then `alert` and `read-token` if the app has them. *Why together:* an old head script removes `.dark` for an explicit "light" and writes no attribute. Under the new root's `light dark`, that page would follow a dark system.
2. **On Vite 8, keep `light-dark()` in your production build.** Add `lightningcss` as a devDependency, at the version your Vite uses: `bun add -d lightningcss@<version>`, `npm i -D lightningcss@<version>` or `pnpm add -D lightningcss@<version>`. The guide shows the version Vite 8.3.5 resolves, 1.33.0. Then set `css: { lightningcss: { exclude: Features.LightDark } }` in `vite.config.ts`, with `import { Features } from "lightningcss"`, or the number `1048576` if you cannot add it. Without this, `data-scheme` works in `vite dev` and does nothing in production, and nothing warns you. Another tool that lowers `light-dark()` needs the same.
3. **If your app sets `.dark` itself,** without the `theme` item, also set `data-scheme` on `<html>`, `"light"` or `"dark"`, every time you set or clear the class.
4. **If the app allows the head script by a CSP hash, update it,** once, with `020`'s step.
5. **Nothing this release adds to your CSS needs deleting yet.** The update overwrites every stale colour in your `.dark` block and in three old `.dark …` rules. They go in 0.15.0. If you came from 0.11.0 and skipped 0.12.0's deletions, make them now, in `020`'s order: 0.12.0's notes first, then this page. 0.12.0's changelog lists them, including the removed `--code-*` names and their `@theme inline` lines. A kept `--code-*` name reads the light colour inside a dark `data-scheme` part.
6. **Make a part of the page light or dark with `data-scheme`.** Replace `class="dark"` on a subtree with `data-scheme="dark"`, and `class="dark surface-ink"` with `class="surface-ink"`. The guide gives a `grep` command for `class="dark` and `"dark surface-ink"`. Both old forms work until 0.15.0. Inside an expressive stage, a part you move from `.dark` to `data-scheme` or `surface-ink` shows the lifted dots, as the stage does; `.dark` showed paper.
7. **A `.dark` or `data-scheme` element now paints its scheme's ground and text colour.** In 0.12.0 a `.dark` wrapper painted nothing. Add `bg-transparent` where it must not paint, such as a wrapper over an image or around an overlay.
8. **Your own `dark:` classes keep working until 0.15.0.** They follow the page, not a scope: inside a light part of a dark page they still apply. For a colour that differs by scheme, use a token. The 0.15.0 guide gives the new `@custom-variant dark` line.
9. **Overlays opened inside a scoped part** open in the page's scheme unless routed. Use `portalProps={{ to }}`, or `BitsConfig defaultPortalTo`.
10. **Scripts that read colours:** use `readToken`, which resolves, and returns lower-case hex where it returned the hex as written (upper case in an installed app). Your own `getPropertyValue("--x")` now returns `light-dark(…)`.
11. **An override on a wrapper of `--foreground`, `--muted-foreground`, `--card-foreground`, `--primary`, `--ring`, `--primary-foreground`, `--border` or `--background`** does not reach inside a nested `data-scheme` or `.dark` element. Set it on the scope, or inside it.
12. **With scripts off, pages now follow the reader's system.** A page that must stay light sets `data-scheme="light"` on `<html>` in its markup.

Then two lists:

- **What keeps working until 0.15.0:** `.dark`, now painting; `class="dark surface-ink"`; an app's own `dark:`.
- **What did not change:** every variable's name, every utility, `THEME_KEY`, `ThemeToggle`, and the theme store's interface.

### 19. Weight

A change that adds weight to every page states its cost (`024` decision 5). **This one is about +0.73 kB gzipped per page, on every template, and all of it is the fallback** (EXECUTED (review), an estimate). Without the fallback, the colour CSS is 0.14 kB smaller than today.

- The builder measures the built CSS before and after.
- The landing notes give the real figure per template against `024`'s headroom. The smallest headroom in `024`'s table is `/`, at 307 against 340 kB (READ (review)).
- If `024` has not landed, or the figure does not fit, the builder stops and asks for a ruling (`024`).

## Design

### The emitted shape, in `src/app.css`

An excerpt. The values are today's; the names are `020`'s.

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
  --surface-background: var(--background);
  --glass-shadow: 0 1px 0 light-dark(#0b0f170f, #00000000), 0 16px 32px -16px light-dark(#0b0f1747, #000000b3);
  --ink-ground: #16140f;
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

html[data-scheme="light"], html [data-scheme="light"] { color-scheme: light; }
html[data-scheme="dark"], html [data-scheme="dark"] { color-scheme: dark; }

@media (prefers-color-scheme: dark) {
  html:not([data-scheme], .dark) { --ink-ground: #221f19; }
}
html:is([data-scheme="dark"], .dark),
html :is([data-scheme="dark"], .dark):not(.surface-ink) { --ink-ground: #221f19; }
html[data-scheme="light"],
html [data-scheme="light"]:not(.surface-ink) { --ink-ground: #16140f; }

.surface-ink { color-scheme: dark; --background: light-dark(#f3f0e8, var(--ink-ground)); /* … */ }
.dark .surface-ink { --background: light-dark(#f3f0e8, var(--ink-ground)); } /* legacy, until 0.15.0 */
[data-mode="productive"] { --radius-action: var(--radius); --mark-1: light-dark(#2d48d4, #f3f0e8); /* … */ }
[data-mode="expressive"] { --radius-action: var(--radius); --mark-1: light-dark(#2d48d4, #93b0ff); /* … */ }
.dark [data-mode="expressive"], [data-mode="expressive"].dark { --mark-1: light-dark(#2d48d4, #93b0ff); /* … legacy */ }
.dark [data-mode="productive"], [data-mode="productive"].dark { --mark-1: light-dark(#2d48d4, #f3f0e8); /* … legacy */ }

@supports not (color: light-dark(#000, #fff)) {
  html:root:is(.dark, [data-scheme="dark"]),
  html :is(.dark, [data-scheme="dark"], .surface-ink) { --background: #16140f; /* … dark hexes, copies, --_mark-* … */ }
  html:root, html [data-scheme="light"] { --background: #f3f0e8; /* … light hexes, copies, --_mark-* … */ }
  html:root:not([data-scheme], .dark) { color-scheme: light; --ink-ground: #16140f; }
  html .surface-ink, .dark .surface-ink { --background: var(--ink-ground); }
  [data-mode="productive"], .dark [data-mode="productive"], [data-mode="productive"].dark { --mark-1: var(--_mark-productive-1); /* … */ }
  [data-mode="expressive"], .dark [data-mode="expressive"], [data-mode="expressive"].dark { --mark-1: var(--_mark-expressive-1); /* … */ }
}

@layer base {
  :where([data-scheme="light"], [data-scheme="dark"], .dark, .surface-ink) {
    --foreground: var(--surface-foreground);
    /* … the other six from the field's roles … */
    --background: var(--surface-background);
    color: var(--foreground);
    background-color: var(--background);
  }
  body { @apply bg-background text-foreground; }
  /* … as today … */
}
```

The print order matters in three places:

- the `.dark` block, then `.surface-ink`, then `.dark .surface-ink`;
- the `[data-mode]` rules after `.dark`;
- in the fallback, the dark set before the light set.

### The generator, in outline

`build-tokens.ts` gains one helper, `pair(light, dark)`. It returns one hex when the two are equal, and `light-dark(l, d)` otherwise. Every scheme value passes through it.

- `themeCssVars` builds `light` from it. `dark` becomes the same map, less `radius`, while the alias lives. `theme` gains every `color-<name>`.
- `themeCss` builds these blocks: `:root`, `.dark` (the alias), the two scheme rules, the ink rules, `.surface-ink`, the mode rules, the three legacy selectors, `@supports not (…)`, and the scope rule in `@layer base`. Each is its own function, so `031` can add one, and the 0.15.0 removal deletes whole functions.
- `appCss` stops building `colourTheme`, which now comes from the item.
- `kuiper.css`'s writer reads the same functions (decision 14).

## Scope

**In:**

- **Scripts:**
  - `scripts/build-tokens.ts`;
  - `scripts/tokens.ts`: any new lowering fields, and the composite rule in the validator;
  - `scripts/contrast.ts`: the tints and forbidden rows retired.
- **Tokens:**
  - `tokens/kuiper.tokens.json`: four primitives;
  - `kuiper.light.tokens.json` and `kuiper.dark.tokens.json`: two roles each;
  - `kuiper.contrast.json`: the pairs.
- **Generated:** `src/app.css`; `registry.json`'s `kuiper-theme` (`cssVars`, `css`); `kuiper.css` and the flattened files; `static/r/`; the thumbnails.
- **Items:**
  - `src/lib/registry/ui/theme/theme-script.svelte` and `theme.svelte.ts`;
  - `src/lib/registry/ui/alert/alert.svelte` (lane I, after `023`);
  - `src/lib/registry/lib/read-token.ts` (lane I).
- **The build:** `vite.config.ts` (decision 8); `package.json` and `bun.lock`, for `lightningcss` as a devDependency at 1.33.0.
- **The lint:** `scripts/lint-literals.ts`, with `SANCTIONED_TINTS` emptied and L25 added.
- **The site:**
  - the theme page's new example; `surface.svelte`; the `read-token` example;
  - `src/lib/site/example-theme-script.svelte` and `src/lib/preview/block-viewer.svelte`;
  - `/start/light-and-dark/`, `/start/theme/` and `/start/install/`;
  - the site's contrast tables, which lose the tint rows;
  - the Components index's attribute, and `site.spec.ts`.
- **Ledgers and words:** `src/lib/site/upgrade/0.13.0.ts` (a ledger file); `CHANGELOG.md`; the stage and marketing-bar comments that say "never carries `.dark`" (they now name `data-scheme`).
- **A test view,** `src/routes/(view)/view/scoped-schemes/`, kept out of the sitemap like the other views.
- **The tests below.**

**Out:**

- High contrast (`031`); the forced-colours pass (`028`); the depth audit and its lint (`031b`); the index card redesign (`031a`).
- Removing the alias (a 0.15.0 specification, decision 4) and the fallback (a later specification, decision 6, by the owner's answer to Q1).
- Mapping LayerChart's surface variables to roles: that is [`029a`](029a-the-charts-surfaces-from-roles.md), a small change in lane I, before the 0.13.0 tag (decision 8).
- A `dark:` variant that follows the nearest scope. Style queries and `if()` are not Baseline (*scoped* §3, option E).
- The site's frames, which stay one-scheme documents.
- Any change to a token's value. Every pair is today's two hexes.
- Overlay items' source. Decision 12 is a pattern, not a change.

## Tests to write first

Each test is written before the change and seen failing for the reason given.

- E2E tests run in `chromium-*`, `firefox-*` and `webkit-*` (`022` decision 2).
- They run against the production preview, never `vite dev` (decision 8).
- Until `022` lands, the three-engine tests launch the three engines themselves (T10's note).
- A test that passes today is proven by mutation, and the landing notes say which.

| # | Name | File | Asserts | Fails today because |
|---|---|---|---|---|
| T1 | each colour is one value or a pair | `tests/unit/scoped-schemes.test.ts` | For every colour variable in `kuiper-theme`'s `cssVars.light` and `css[":root"]`: its value is `light-dark(<light hex>, <dark hex>)` matching the two scheme contexts, or one hex when they are equal. `--glass-shadow` holds a pair at each colour. `:root` declares the code slots and the eight `--surface-*` copies once, and sets `color-scheme: light dark`. Every `data-scheme` value in the CSS is a `THEMES` value and a context of `scheme`. No key starts with `@property` | values are hexes; `color-scheme: light` |
| T2 | the alias restates | same | `cssVars.dark`'s keys are `cssVars.light`'s less `radius`, each value equal. Every name the v0.12.0 theme's `.dark` block declared (read from `static/v0.12.0/r/styles/maia/pluto-theme.json`) is declared in 0.13.0's `.dark`, with `:root`'s value. `.dark` sets `color-scheme: dark`. The three legacy selector strings exist in `css`, byte-equal to v0.12.0's keys, each holding exactly the values decision 4's table gives | dark values differ from light; the legacy rules hold hexes |
| T3 | no scheme-keyed descendant rule | same | Outside `@supports not (color: light-dark(#000, #fff))`, and outside the three legacy selector strings (exempt by exact text until 0.15.0), no selector in `kuiper-theme`'s `css` has `.dark` or `[data-scheme` followed by a combinator. None compounds `.dark` with another selector | today the 3 rules are hex rules, not the exempt pairs (T2 holds their values) |
| T4 | no `dark:` in items | `tests/unit/no-dark-variant.test.ts` | Over `itemFiles()`: 0 `dark:` variants in classes, 0 `@variant dark`, 0 `@custom-variant`, 0 `:is(.dark`, 0 `[.dark_&]`, 0 `.dark ` in a selector. *Also:* the count reads 2 on a fixture copy of today's `alert.svelte` | 2, in `alert.svelte` |
| T5 | the fallback is the hex sets | `tests/unit/scoped-schemes.test.ts` | The `@supports not (…)` block exists once. Its dark set holds every scheme variable as its dark hex, and its light set as its light hex, matching the token file. Both redeclare the 16 code slots and 8 surface copies. The `--_mark-*` copies equal each scheme's productive and expressive marks. The root rule sets `color-scheme: light` and `--ink-ground`. The ink and mode rules list the legacy selectors. Selectors are decision 6's | no block |
| T6 | no `:root` or `.dark` item in an at-rule | `tests/unit/generated.test.ts` (001's check, sharpened) | Read with PostCSS `list.comma`, no selector-list item of a rule nested in an at-rule of `kuiper-theme`'s `css` is exactly `:root` or `.dark`. *Mutation:* a fallback selector `html:root, .dark` fails | passes today; proven by mutation |
| T7 | the CLI gets every utility | `tests/unit/scoped-schemes.test.ts` | `cssVars.theme` holds `color-<name>: var(--<name>)` for every colour key of `cssVars.light` | only the 16 code slots |
| T8 | the tints are tokens | `tests/unit/tokens-dtcg.test.ts` and `contrast.test.ts` | The four primitives exist, each equal to `compositeTenths(of, over, alpha)`. `role.destructive-tint` and `role.success-tint` alias them in both scheme files, with equal `$description`. The contrast pairs `[destructive, destructive-tint]` and `[success, success-tint]` pass in both schemes, at 5.10, 5.09, 5.21 and 5.19. No `tints` or `forbidden` key remains | no such tokens |
| T9 | `readToken` resolves | `tests/unit/read-token.test.ts` | With a stub `CSS.supports`, and a stub probe whose computed colour is `rgb(45, 72, 212)`, `rgba(11, 15, 23, 0.1)`, `color(srgb 1 1 1 / 0.24)` or `color(srgb 0.0862745 0.0784314 0.0588235 / 0.24)`, `readToken` returns `#2d48d4`, `#0b0f171a`, `#ffffff3d` and `#16140f3d`, and removes the probe. With a stub whose raw text is `#2D48D4`, it returns `#2d48d4`. A non-colour (`600ms`) returns its text and appends nothing. With no `CSS`, it returns the text | returns the raw text |
| T10 | nested schemes, in all three engines | `tests/e2e/scoped-schemes.spec.ts` | On `/view/scoped-schemes/`, a sampler is shown at the page level and in a nest of opposite, page and opposite schemes, three deep. The sampler: text; a `bg-card` card; muted text; a primary button; an input border; a code line's text, keyword and ground; destructive and success alerts; the four-dot mark, productive and in `data-mode="expressive"`, with a productive island inside the expressive one; `field-1` with an opposite scope inside it; an ink surface with a dark and a light scope inside it; a glass panel. Run with the system light and dark, and on a page with `data-scheme="dark"` on `<html>`. Each sample's computed `color`, `background-color`, `border-*-color` and `fill` at each level equals the same sample at the page level of a page in that level's scheme. A dark scope inside ink reads the dark `background`. axe reports 0 violations. *Note:* until `022` lands, the file runs one test per engine through Playwright's `chromium`, `firefox` and `webkit` launchers, against the same preview server | `data-scheme` does nothing: level 1 reads the page's scheme |
| T11 | the alias reads the same | same | The fixture with `?alias=1`, which writes `class="dark"` for each dark level, gives T10's readings, the levels inside ink included. `class="dark surface-ink"` reads as `class="surface-ink"`, except inside an expressive stage. There, by design (decision 3), `.dark` and `dark surface-ink` show the productive dots, `rgb(243, 240, 232)`, while `data-scheme="dark"` and `surface-ink` show the lifted ones, `rgb(147, 176, 255)` (EXECUTED (review), `alias-marks.mjs`); the test expects that difference. A `.dark` element with no classes paints the dark `background` and `foreground` | a light level inside `.dark` reads dark; a bare `.dark` paints nothing |
| T12 | the fallback, emulated | same | With `page.route` rewriting every `light-dark(` in the served CSS to `light-dark-x(`, the `@supports not` block applies. The test checks that `<html>`'s `--background` no longer starts with `light-dark(`. Then T10's readings hold at every level, marks and ink included. With scripts off and a dark system, `<html>` computes `color-scheme: light` and ink reads the dark `background` | no fallback, and no scope |
| T13 | portals follow when routed | same | In a dark scope on a light page, a popover with `portalProps={{ to }}` set to the scope's element, and a dropdown menu under `BitsConfig defaultPortalTo`, open with the dark `popover` and `popover-foreground`. An unrouted popover opens with the light ones | no scope |
| T14 | the ink ground | same | Ink's `background-color` is the dark `background` on a light page, in a light scope, and in a light scope inside a dark one. It is the dark `card` on a dark page and in a dark scope inside a light one. With scripts off, it follows the system. A light scope inside ink reads light, and a dark scope inside ink reads the dark `background` | a dark scope gives `background`, not `card` |
| T15 | the head script and the store | `tests/e2e/theme.spec.ts` | With modules aborted (`020` test 9's method): a stored `light` on a dark system gives `data-scheme="light"`, no `.dark`, and a light body. A stored `dark` on a light system gives `data-scheme="dark"` and `.dark`. No choice gives the system's scheme in both. `020` test 9's carry-over cases still pass. With modules on, toggling writes both, and a change of the emulated system writes both while no choice is stored | no attribute |
| T16 | scripts off follow the system | same | `javaScriptEnabled: false`, system dark: `body`'s background is the dark `background`. System light: the light one | light in both |
| T17 | an upgraded app, built for production | `tests/smoke/upgrade.test.ts` | From an app installed at `/v0.11.0/r` and from one at `/v0.12.0/r` (`pluto-theme`, `theme`, `alert`, `read-token`), each set up per guide step 2, then `add kuiper-theme theme alert read-token` from `/r`. **The source:** in every rule of `app.css` outside the fallback, no variable the 0.13.0 item declares holds a bare hex that differs from `:root`'s value, except `--ink-ground` in its rules. The three legacy selectors hold pairs. `@theme inline` holds `--color-<name>` for every colour, the two tints included. No `@property` is present. A second `add` leaves `app.css` byte-identical. **The build:** the app builds with `vite build`. The built CSS's `:root` colour declarations hold `light-dark(`. No custom-property declaration holds `--lightningcss-light`. The built CSS holds `.bg-destructive-tint` and the `@supports not` block. The app's `Features.LightDark`, imported from its own `lightningcss`, equals `1048576`, the value Vite's copy reads, so a version skew between the two copies shows. *Also:* the same app built without step 2's line holds `--lightningcss-light` in `--background`, so the assertion is known to bite | `.dark` and the legacy rules keep hexes; no tint utility |
| T18 | the changelog and the guide | `tests/unit/registry.test.ts`, `tests/e2e/upgrade.spec.ts` | The 0.13.0 entry holds decision 17's five bullets, each marked interface change. Together they name `data-scheme`, `light-dark()`, `.dark`, `0.15.0`, `THEME_SCRIPT`, `readToken`, "lower-case", `bg-destructive-tint` and `Features.LightDark`. The guide holds decision 18's section, its twelve steps in order, after `020`'s | no such text |
| T19 | `readToken` in the browser | `tests/e2e/expressive.spec.ts` (its `read-token` tests rewritten) | On the `read-token` page, for every colour role, in both schemes: `readToken(role)` on `<html>`, and `readToken(role, el)` inside an opposite `data-scheme` subtree, equal the token file's hex for that scheme, in lower case. The canvas inside `data-scheme="dark"` on a light page paints `rgb(243, 240, 232)`, is labelled with `#f3f0e8` four times, and repaints when the toggle is pressed | the page has no `data-scheme` subtree; a light page reads the light marks there |
| T20 | the alert's tints, solid | `tests/e2e/alert.spec.ts` (or the item's existing spec) | The destructive and success alerts' `background-color` equals the tint token's hex, with alpha 1, on the page and on a card, in both schemes | translucent: alpha 0.1 or 0.2 |
| T21 | the lint | `tests/unit/literals.test.ts` | `bg-destructive/10` and `dark:bg-success/20` in a fixture item fail L1 and L2. L25 allows exactly `probe.style.setProperty("color", …)` in `read-token.ts`, and the report counts 2 allowances | the four tints pass |
| T22 | the frames write the scheme | `tests/e2e/frames.spec.ts` (or the example and block specs) | With the system dark, a `?theme=light` example frame's `<html>` carries `data-scheme="light"`, computes `color-scheme: light`, and its body reads the light `background`. `?theme=dark` gives `data-scheme="dark"`, `.dark` and the dark one. A block view on a light page under a dark system shows its frame light. Toggling the page's theme changes the frame's `data-scheme` and class | the frames write no `data-scheme` |
| T23 | the site's build keeps the pairs | `tests/e2e/build-output.spec.ts` | In `build/_app/immutable/assets/*.css`, the theme's `:root` colour declarations hold `light-dark(`. No custom-property declaration of the theme holds `--lightningcss-light`. `vite.config.ts` excludes `Features.LightDark`. `lightningcss` is a pinned devDependency. *Mutation:* without the exclusion the test fails | today's build lowers `color-scheme`'s switch; after the change without decision 8, every pair |

## Acceptance criteria

1. **One value per colour.** T1 passes. `src/app.css` declares no colour in `.dark` that differs from `:root`'s. (unit)
2. **The alias.** T2 and T11 pass, the levels inside ink included. (unit, e2e)
3. **No descendant scheme rules, but the legacy three.** T3 passes. The bench's `theming.lightDarkFn` is above 0, and `dataScheme` is at least 4. (unit, bench)
4. **No `dark:` in items.** T4 and T21 pass. The count is 0, from 2. `bun run lint:literals` reports 0 violations and 2 allowances (L24, L25). (unit)
5. **The fallback.** T5 and T12 pass, in all three engines. (unit, e2e)
6. **The CLI.** T6, T7 and T17 pass under Bun, from v0.11.0 and v0.12.0. (unit, smoke)
7. **Production builds.** T17's build half and T23 pass. (smoke, e2e)
8. **The tints.** T8 and T20 pass. `alert.svelte`'s destructive and success strings hold `bg-destructive-tint` and `bg-success-tint` and no `/` modifier. (unit, e2e)
9. **`readToken`.** T9 and T19 pass in all three engines. (unit, e2e)
10. **Nesting.** T10 passes in Chromium, Firefox and WebKit, with the system light and dark, and on a dark page: 0 mismatched readings, 0 axe violations. (e2e)
11. **Portals and ink.** T13 and T14 pass in all three engines. (e2e)
12. **The head scripts.** T15, T16 and T22 pass. `020`'s tests 9 and 10 still pass. (e2e, unit)
13. **`kuiper.css`.** `021`'s T9, rewritten to decision 14's seven blocks, passes. Every declaration it shares with `src/app.css` has the same value. Its header holds decision 14's import-order sentence and decision 8's lowering sentence. (unit)
14. **The counts.** There are 52 primitives and 63 roles per scheme in the DTCG files. `021`'s T2 and criteria 2 and 17 are updated to them. The new contrast pair count is pinned in the test and in the landing notes. (unit, bench)
15. **The `var()` test.** `023`'s test 6 passes with `--destructive-tint`, `--success-tint`, `--surface-background`, `--ink-ground` and the `--_mark-*` copies defined. (unit)
16. **The site.**
    - The theme page's new example renders in both schemes at 1440 and 390 with 0 axe violations.
    - `/start/light-and-dark/`, `/start/theme/` and `/start/install/` name `data-scheme`, and `/start/install/` gives the Vite line.
    - No thumbnail carries `data-scheme`, and `site.spec.ts` passes.
    - The landing notes give the count of regenerated thumbnails. (e2e)
17. **The changelog and the guide.** T18 passes. (unit, e2e)
18. **Weight.** The landing notes give the built site stylesheet's gzipped size before and after, per template. It fits `024`'s headroom, and `perf.spec.ts`'s transfer budgets pass. (e2e, perf)
19. **The suites.** `bun run test:unit`, `bun run test:e2e:engines` and `bun run test:smoke` pass. `bun run check` reports 0 errors, and `bun run lint` is clean. Expectations change only in the tests named here, `021`'s counts and the contrast tables. (all)
20. **Tests first, and the checkpoint.** T1 to T5, T7 to T22, and T23's mutation are seen failing before the change, and T6 by mutation. At the checkpoint, the design lead looks at the test view and at the theme page's new example. That is in Chromium, Firefox and WebKit, in both schemes, at 1440 and 390, on the production preview. The design lead also looks at the tinted alerts on the page and on a card, and at a sample of regenerated dark thumbnails. Rulings go into the landing notes. (checkpoint)
21. **The scorecard.** The loop runs (`roadmap.md` §4). Row 4 moves 2 → 3. The change review cites it. (bench)

## Build order

1. **Confirm the tree.** Check that `020`, `021` and `023` have landed, and whether `022`, `024` and `028` have. Re-pin every count here. Note any name `020` or `021` chose differently.
2. **Tests first.** Write T1 to T23 and the fixture view. Run them. Record what fails and why.
3. **The build.** Add `lightningcss` 1.33.0 as a devDependency, and the exclusion in `vite.config.ts`. T23's config half goes green.
4. **Tokens.** Add the four primitives, the two roles, their words, the composite rule and the contrast file. T8 goes green.
5. **The generator.** Write `pair()`, the blocks, the alias, the legacy selectors, the ink rules, the fallback, the scope rule, `cssVars.theme` and `kuiper.css`. T1 to T3, T5 to T7 and `021`'s T9 go green. Run `bun run build:tokens` twice: the second run writes nothing.
6. **The theme item.** The head script and the store. T15 and T16 go green.
7. **Checkpoint, part one** (lane T done): the test view in three engines, on the production preview. T10 to T14 and T23.
8. **Lane I, after `023`'s landing:** `alert`, then `read-token`, then the lint. T4, T9 and T19 to T21 go green.
9. **The site:** the example, the docs pages, the two frame scripts (T22), and the index's attribute. Regenerate the thumbnails, and record the count.
10. **The ledger:** the guide section, the changelog, `static/r/`. T17 and T18 go green.
11. **Weight.** Measure, and compare with `024`'s headroom (decision 19).
12. **Checkpoint, part two** (criterion 20).
13. **The suites, then the scorecard loop** (criteria 19 and 21). Add the 0.15.0 alias-removal row to the roadmap (decision 4).

## Predicted scorecard movement

- **Row 4, theming: 2 → 3.** (b) "Any subtree takes either scheme, both directions" goes from – to ✓, joining (a) and (e). The evidence is T10 in three engines on a production build, and the bench's `lightDarkFn` and `dataScheme` above 0. (c), a contrast scheme, is `031`'s, and it makes 4.
- **Row 5, tokens: held at `021`'s 4.** The new tokens carry descriptions and `since`.
- **Row 8, page weight: held**, if the +0.73 kB fits `024`'s budgets (decision 19).
- **Row 11, change communication: held.** The guide grows by one section.
- **Row 3, accessibility evidence: no new criterion.** T10's axe runs add scoped states the matrix did not cover before.

## Risks

- **The fallback cannot be tested natively here.** Every installed engine has `light-dark()`. T12 emulates it, which proves the CSS but not an old Safari's bugs. The checkpoint may add one run on a real Safari 17.4 if one can be reached. If not, the landing notes say the fallback was proven by emulation only.
- **A build tool that lowers `light-dark()` silently removes scoping.** Decision 8 covers Vite 8's default. Another toolchain is the app's to configure, and the guide says how. T17 and T23 catch it in the smoke app and in the site.
- **The exclusion keeps LayerChart's own pairs native.** An older Safari drops those declarations (decision 8). `029a` maps them to roles before the tag. If it slips, the 0.13.0 changelog names the gap.
- **The CLI may change.** If a later CLI recognises `light-dark()`, it writes `--color-*` itself, equal to what the item gives, which does no harm. If a later CLI starts deleting rules, the legacy selectors simply go early. The smoke test pins 1.7.1's behaviour.
- **A mixed install.** `kuiper-theme` from 0.13.0 with `theme` from 0.12.0 makes an explicit light choice follow a dark system (decision 1). So does an app that toggles `.dark` itself. The guide's steps 1 and 3 say what to do. A smoke case checks the guide's order, not the mix.
- **Eight variables are restored on every scope.** An app that overrides one of them on a wrapper loses it inside a nested scope (decision 2). The alias already did this, for every variable. It is documented, and no Kuiper item does it.
- **`.dark` now paints.** An app's bare `.dark` wrapper gains a ground (decision 2). Guide step 7 says how to undo it.
- **The alias doubles `.dark`'s bytes until 0.15.0.** It compresses to almost nothing (decision 19).
- **Firefox 120 to 127** have `light-dark()` but not `@property`. Since decision 3 now uses no `@property`, nothing here depends on it.
- **`031` and the alias.** Decision 16 names the clash, so `031` plans for it.
- **Lane order.** `028` (forced colours) is also lane I, in wave 2. The design lead orders `028` and `029`'s alert edit, both after `023`. Alert is not interactive, and forced colours discard author backgrounds, so the order changes no reading (READ (review)).

## Open questions for the owner

None. The owner answered Q1 and Q2 on 2026-11-15, each with the recommended option. The answers are in decisions 6 and 10 and under "Landing notes".

## Review

The specification review ([`../reviews/029-scoped-schemes-spec-2026-11-15.md`](../reviews/029-scoped-schemes-spec-2026-11-15.md)) asked for revision. Each finding is answered below. Each fix that changes the design was probed again (EXECUTED (029), `029-rev/`).

| # | Severity | Finding | Answer |
|---|---|---|---|
| 1 | High | Vite 8's default minify lowers every pair, so scopes do nothing in production | Decision 8: the site excludes `Features.LightDark`, with `lightningcss` 1.33.0 named and pinned. The guide's step 2 and `/start/install/` give apps the line. T17 builds the smoke app for production, and T23 reads the site's built CSS. T10 to T14 run on the preview. Q1's trigger names Vite's `build.cssTarget`. LayerChart's pairs are recorded as a finding. Probed with a real Vite 8.3.5 build |
| 2 | High | Upgraded apps keep the three legacy descendant rules with hexes, so a mark reads 1.00:1 and 1.86:1 | Decision 4: the three exact selectors are restated with pairs until 0.15.0, and the fallback restates them too (decision 6). T2 holds their values, and T3 exempts them by exact text. T17 checks every rule of an upgraded `app.css`, from v0.11.0 and v0.12.0. Probed with the CLI merge and in three engines |
| 3 | Medium | `@property` is not idempotent under CLI 1.7.1 | Decision 3: no `@property`. Each scope writes `--ink-ground` as a hex, with a media query for scripts off. T1 forbids a `@property` key, and T17 checks byte identity. Probed in three engines and with the CLI merge |
| 4 | Medium | The site's two frame scripts write only `.dark` | Decision 15: both write `data-scheme`, and the class while the alias lives. T22 tests them. The guide's step 3 covers an app that toggles `.dark` itself, and decision 5 says so too |
| 5 | Medium | `kuiper.css`'s unlayered scope rule beats layered utilities | Decision 14: the rule is in `@layer kuiper.scope`, declared first. The header states the import order, and the decision explicitly amends `021` decision 11. Probed in three engines |
| 6 | Medium | The alias and the attribute differ inside ink | Decision 2: an eighth restoration, `--background` from `--surface-background`. T10 nests a dark level in ink, and T11 must match it. Probed: both read the dark `background` |
| 7 | Low | The fallback claim was wider than its probe | Decision 6.5's copies are now probed: 12 fallback runs, 0 mismatches. The original claim is withdrawn in "What this specification measured" and in memo §10 |
| 8 | Low | `readToken`'s case changes | Decision 11, decision 17's bullet, guide step 10 and T9 now say that installed apps read upper case before |
| 9 | Low | The fallback is the whole weight | Decision 19 and Q1: +0.73 kB, all the fallback; −0.14 kB without it |
| 10 | Low | The 0.15.0 removal is an interface change, and its list was short | Decision 4: a 0.15.0 specification, whose list adds the site's `dark:` uses, `.dark .site-thumb`, the frame scripts, the legacy selectors and a second CSP hash change |
| 11 | Low | A `.dark` subtree now paints | Decision 2 says so, as do decision 17's bullet, guide step 7, Risks and T11 |
| 12 | Low | Write-ins | The fallback root's `color-scheme` is decision 6.3; its ink ground was found and fixed by probe. Firefox 120 to 127 is in Risks, now moot. Every thumbnail regenerates (decision 15, build step 9, criterion 16). T17 runs from v0.11.0, whose four dead `--syntax-*` names are in guide step 5 |

The three author's notes (the thumbnail attribute, `021`'s counts, and the lane-I order with `028`) were agreed by the reviewer, and stand.

**The re-review (2026-11-15)** found the specification fit to build, with five Low write-ins. Each is applied:

| # | Write-in | Answer |
|---|---|---|
| R1 | Inside an expressive stage, `.dark` shows paper dots and `data-scheme` or `surface-ink` lifted ones | T11 adds the case and expects the difference; guide step 6 says the dots change colour |
| R2 | The Vite line under npm and pnpm is argued, not tested | Decision 8 and guide step 2 give the command for bun, npm and pnpm; T17 asserts `Features.LightDark` is `1048576`; a note for row `040` is in the landing notes |
| R3 | Land the chart fix before the tag | [`029a`](029a-the-charts-surfaces-from-roles.md), a small change in lane I for 0.13.0, before the tag; decision 8, Scope and Risks name it; the changelog names the gap if it slips |
| R4 | Guide step 5 contradicts `020`'s order for v0.11.0 apps | Step 5 now says to make 0.12.0's deletions, the removed `--code-*` names included, in `020`'s order |
| R5 | Two stale lines | The roadmap sentence and "the review counted 12" are gone; the count is 10 |

## Landing notes

Not landed.

### The owner's rulings this stands on (2026-11-15)

These are quoted in the header's "Design call", from `decisions.md` at `beeb67e`:

- the scoped-schemes recommendation and the memo's five corrections;
- "`light-dark()` with a generated fallback for older Safari" (decisions 1, 6 and 8);
- "`.dark` kept as an alias for two minor releases" (decision 4: it works in 0.13.0 and 0.14.0, and goes in 0.15.0 by a specification);
- the two high-contrast answers (`031`'s; decision 16);
- "transparency always signifies depth" (decision 10).

### The owner's answers (2026-11-15)

The two questions the specification put to the owner, answered on 2026-11-15, after the re-review. Each took the recommended option.

- **Q1, when the hex fallback goes:** the fallback is removed by a specification in the minor release after both Tailwind's `optimize` targets and Vite's default `build.cssTarget` reach Safari 17.5. Applied in decision 6. The roadmap gains that row when the two targets move.
- **Q2, the ground of alert's tints:** solid over `card`, lowest contrast 5.09. Applied in decision 10: the four primitives `red-tint`, `green-tint`, `red-tint-lifted` and `green-tint-lifted` are composited over `raised` and `ink-raised`.

### Notes for later rows

- **Roadmap row `040`, installs by npm and pnpm:** its npm and pnpm smoke apps carry this guide's step 2 (`npm i -D` and `pnpm add -D lightningcss@<Vite's version>`, and the Vite line) and T17's build assertion: the built `:root` keeps `light-dark(`, no token declaration holds `--lightningcss-light`, and `Features.LightDark` is `1048576`.
- **`029a`, the chart's surfaces from roles:** queued in lane I for 0.13.0, before the tag (decision 8).
