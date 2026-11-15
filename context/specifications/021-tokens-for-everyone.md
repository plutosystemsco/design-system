# 021 — Tokens for everyone

- **Status:** Ready for owner answers: review approved with changes, all applied. The specification review ([`../reviews/021-tokens-for-everyone-spec-2026-11-15.md`](../reviews/021-tokens-for-everyone-spec-2026-11-15.md)) approved it with changes; all 13 findings are answered in the text, and each is listed under "Review". It waits on the owner's answers to the five open questions at the end. Not built.
- **Date:** 2026-11-15
- **Author:** the design lead
- **Kind:** a feature in lane T (tokens). It changes the token source's shape and adds published files. **No interface change:** every custom property, value, utility and rule an app receives is unchanged, byte for byte (decision 3). It adds no CSS token and no dependency. In the DTCG files, the script constant `EXPRESSIVE_DARK_MARKS` becomes four tokens per scheme, eight in all (decision 6), and the 48 primitives become public DTCG paths (Q5). From 0.13.0 the DTCG paths are an interface, covered by the record (decision 10). It removes one site module, `words.ts`, whose words move into the token files (decision 9).
- **Written against the names `020` leaves.** `020`, the Kuiper rename, lands first ([`roadmap.md`](../roadmap.md) §3). So this specification says `tokens/kuiper.tokens.json`, `kuiper-theme`, the `kuiper` registry and `static/r/styles/maia/kuiper-theme.json`, where the tree today says `pluto`. Wherever `020` chooses a name this specification does not foresee, `020`'s name wins, and the builder notes it in the landing notes.
- **Depends on:** `020`. The baseline for "byte-identical" is the tree at `020`'s landing commit, with every change landed by then, including the letter-spacing change being built now (`019a` decision 1: the four tracking values and the four display steps' tracking at `0`).
- **Ranked:** [`roadmap.md`](../roadmap.md) §2, 0.13.0, wave 1, lane T. Scorecard row 5, Tokens, is Kuiper's second-largest gap: 1 against Primer's 4 ([`benchmark-scorecard.md`](../research/benchmark-scorecard.md) §5). Row 12, design tooling, is the largest; the owner capped it at 2 with "we design in code" (constitution §3).
- **Blocks:** `029` (scoped schemes), `031` (high contrast), `048` (a built-token diff in every change review), `054` (the designer's start).
- **Research it stands on:**
  - [`../research/2026-11-15-dtcg-tokens.md`](../research/2026-11-15-dtcg-tokens.md): the DTCG 2025.10 format, Kuiper's file against it, the names that shipped and went, the prior art and the tools. Cited below as *DTCG* §n.
  - [`../research/benchmark-scorecard.md`](../research/benchmark-scorecard.md) rows 5 and 12, and §6 items 5 and 12.
  - [`../research/2026-11-15-scoped-schemes-and-contrast.md`](../research/2026-11-15-scoped-schemes-and-contrast.md), for what `029` and `031` will need from the files.
  - The prior-art memos for Carbon, Primer and Spectrum, of 2026-11-15.
- **Constitution:** §1 asks for this in so many words: "The tokens and the theme are also published as plain CSS variables and as a W3C Design Tokens (DTCG) file, so any stack can take the brand." §3: "We design in code. The tokens are exported as design variables; no component library is drawn in a design tool." §4.3: tokens are the one source.

## Intent

Kuiper's tokens live in one JSON file of Kuiper's own shape. Only Kuiper's build can read it. The words that say what each colour role is for live in the design site, not in the file. Nothing records a name that was removed. And the only way to take the tokens is the Tailwind theme item.

This specification makes the tokens readable by anyone:

1. The source becomes **DTCG 2025.10**, the Design Tokens Community Group's stable format, which design tools and token tools read.
2. Each role and each code slot carries its job as a `$description`, moved from the site's `words.ts`.
3. A **record** lists every name that shipped and was renamed or removed, with what replaces it. A test keeps it complete.
4. A **plain CSS-variables file**, `kuiper.css`, is published beside the theme item, for any stack that does not use Tailwind.
5. The built CSS does not change by one byte.

**Terms of art.**

- **DTCG**: the W3C Design Tokens Community Group, and its JSON format. Its stable release is **2025.10** (*DTCG* §1.1).
- A **token** is a named, typed value: an object with `$value`. A **group** is an object of tokens and groups. A token's **path** is its group names and its name joined by dots, such as `role.background`.
- An **alias** is a token whose value is another token's path in braces: `"{primitive.paper}"`.
- A **resolver** is a DTCG file that says which token files combine for each **context**. A **modifier** is one choice of contexts, such as the scheme: light or dark (*DTCG* §1.8).
- **Flattened**: one context's files merged into a single token tree.
- **The theme item** is `kuiper-theme`, the registry item an app installs to get Kuiper's CSS.
- **The lowering**: the code that reads the DTCG files and returns today's `Tokens` object, so that the build that writes the CSS is untouched.

## What the research found

- **DTCG 2025.10 is stable and current.** It has three modules: Format, Color and Resolver. No newer version is published; a September 2026 preview draft says not to build on it (*DTCG* §1.1).
- **Its shapes are strict.** A colour is an object: a colour space, components from 0 to 1, an optional alpha, and an optional 6-digit hex. A dimension is `{ value, unit }`, and the unit is `px` or `rem`, nothing else. A file's top level may hold only groups, tokens and `$`-properties (*DTCG* §1.2, §1.6).
- **Modes are the Resolver module's job.** One modifier with a context per scheme is the spec's own example, and Carbon's (*DTCG* §1.8, §4). The Resolver module merges by token: the last occurrence of a path wins. It does not say whether that later token replaces the earlier one whole or merges its properties, so a later file restates a token whole.
- **Kuiper's file, measured** (*DTCG* §2): 48 primitives, 61 roles in each of 2 themes, 16 code slots, 127 contrast rows, 0 DTCG keys. 61 colours, 18 of them translucent (the memo's §2 said 15; corrected in its §8). Every colour survives a round trip to 4-decimal components and back to its exact hex. Some values have no DTCG type: `em` sizes, fluid `clamp()` sizes, and the spring.
- **One token lives in a script.** The four colours of the mark's dots on a dark expressive ground are a constant in `build-tokens.ts` (*DTCG* §2).
- **The history of names is in the tree.** `static/v0.4.0/` to `static/v0.12.0/` hold every shipped theme item. Together with the tags' `src/app.css`, they show 24 names shipped and removed, all in 0.12.0, and none before (*DTCG* §3).
- **The prior art** (*DTCG* §4): Carbon and Primer author DTCG directly. Carbon names the schema in each file, resolves themes through a resolver, and validates against the schemas in its tests. Primer keeps `removed.json`, checked in CI against the base branch, and puts the replacement alias in `$deprecated`. Spectrum records `renamed` and `deprecated` on each token. Radix publishes plain CSS token files beside its full stylesheet.
- **The tools** (*DTCG* §5): Style Dictionary's own docs call 2025.10 support "a work in progress in v5". Terrazzo claims full support, resolvers included. Kuiper needs neither: its build already writes every output, and must keep writing them exactly.

## Decisions

### 1. The format is DTCG 2025.10: Format, Color and Resolver

- Every token file follows the Format and Color modules of 2025.10. The scheme files are combined by a 2025.10 resolver.
- Each token file's first key is `"$schema": "https://www.designtokens.org/schemas/2025.10/format.json"`. The resolver's is `.../2025.10/resolver.json`. Both URLs return the schemas today (*DTCG* §1.1, EXECUTED). They help editors and other tools. Nothing in the build fetches them.
- No draft feature is used. No JSON Pointer `$ref` is used inside a token file: aliases are curly braces only. `$ref` appears only in the resolver, to name files.
- *Why 2025.10:* it is the one stable release, and the two systems that score highest on tokens use it (*DTCG* §4).

### 2. The files

`tokens/` holds six files after this specification:

| File | What | DTCG? |
|---|---|---|
| `kuiper.resolver.json` | Which files make each scheme | Resolver |
| `kuiper.tokens.json` | Every token the same in both schemes: the primitives, sizes, type, motion, the mark, the expressive values, the code map | Format |
| `kuiper.light.tokens.json` | The light scheme: the 61 roles, the four fields, the glass, the expressive mark | Format |
| `kuiper.dark.tokens.json` | The dark scheme: the same paths, dark values | Format |
| `kuiper.contrast.json` | The contrast rules: the pairs, tints, exceptions and forbidden pairs, as today's `contrast` group, unchanged | No: Kuiper's own |
| `kuiper.removed.json` | The record of renamed and removed names (decision 10) | No: Kuiper's own |

- `kuiper.tokens.json` keeps the name `020` gives the token file. So `src/app.css`'s first line, "Generated by scripts/build-tokens.ts from tokens/kuiper.tokens.json", stays true and unchanged (decision 3).
- **The contrast rules leave the token file.** They are a test's rules, not tokens. The format schema forbids a top-level array (*DTCG* §1.2). The rows name roles by their bare names, as today. Their validation is unchanged.
- **The two scheme files and the base file share no top-level group.** The base holds `primitive`, `radius`, `spacing`, `font`, `motion`, `mark`, `line`, `focus`, `elevation`, `expressive` and `code`. Each scheme file holds `role`, `field`, `glass` and `expressive-mark`. So no token path is in both, and no token collides when a context is flattened.
  - *The merge rule this relies on, and the one it avoids.* The Resolver module merges by token: "if a token is declared multiple times, the last occurrence in the array will be the final value" (Resolver §4.1.4, §6.2). What it leaves unsaid is whether a later token replaces the earlier one whole or merges its properties (*DTCG* §1.8). With no shared path, that gap never matters here.
  - **Root `$`-properties do collide.** Both files carry `$schema` and `$description`, and a scheme file carries `$extensions`. In a flattened file the root's `$schema`, `$description` and `$extensions` are the scheme file's: it comes later.
  - `031`'s override files will share the `role` group with the scheme files, on purpose. They rely on the stated rule, token by token, and restate each token whole, so the unstated part does not matter there either (decision 7).
- **The two scheme files hold the same paths in the same order.** Each token in them is whole: `$type`, `$value`, `$description`, `$extensions`. A role's `$description` is written in both; a test holds the two copies equal (criterion 4).
- *Why a resolver set, not one file:* it is the conforming way to carry dark, and it lets `031` add high contrast as a file and two contexts (decision 7). The alternatives are open question 1.

### 3. The same tokens, and the built CSS byte-identical

- **No CSS token is added, removed or renamed.** Every value is the same. The order of every map is the same. The DTCG files are new, so every path in them is new; the only tokens without a counterpart in today's file are the eight `expressive-mark` tokens, which hold the script constant (decision 6).
- **The lowering returns today's object.** `scripts/tokens.ts` keeps `readTokens()` and the `Tokens` type. `readTokens()` now reads the resolver set and the contrast file, validates them (decision 12), and lowers them to the `Tokens` object it returns today. **Two top-level fields are added:** `descriptions` (`{ roles, code }`, decision 9) and `expressiveDarkMarks`, the four primitive names the dark `expressive-mark` group aliases, in the mark's order (decision 6). The light `expressive-mark` four are validated (decision 12) and lowered nowhere. The object, less those two fields, equals the one `020`'s tree returns, key order included (criterion 7).
- **The signature.** `readTokens(root: string = process.cwd()): Tokens`. It reads `tokens/kuiper.resolver.json` under `root`, the token files the resolver names (each `$ref` relative to the resolver's folder), and `tokens/kuiper.contrast.json`. Today's callers that pass `path.join(root, TOKENS_PATH)` (`build-tokens.ts`, `lint-literals.ts`) pass `root`, so the dev loop and the smoke copy still read their own tree. Callers with no argument are unchanged.
- **`build-tokens.ts`'s emission is untouched,** with one exception: the constant `EXPRESSIVE_DARK_MARKS` is deleted, and the mode rule reads `tokens.expressiveDarkMarks` in its place, still through `tokens.primitives` (decision 6). Its four values do not change.
- **So these are byte-identical to `020`'s landing:** `src/app.css`; the `kuiper-theme` item and the three font items in `registry.json`; `static/r/styles/maia/kuiper-theme.json` and its copy under `static/v0.13.0/`. `bun run build:tokens` reports no change to `src/app.css` or `registry.json` (criterion 8).
- **A pure lowering, for the bundle.** `lowerTokens(files)` takes the parsed JSON of the five files and does no I/O. `readTokens()` reads the files and calls it. The search source, which imports the token JSON today, imports the five files and calls `lowerTokens` (decision 14).

### 4. Paths, types and the CSS name of each token

Every token states its own `$type`. No group sets `$type` for its children. *Why:* the spec allows inheritance, but Primer's build passes down only descriptions and extensions (*DTCG* §4), so a token that states its type is read the same by every tool.

| Today's key | File | Path | `$type` | CSS variable |
|---|---|---|---|---|
| `primitives.<name>` | base | `primitive.<name>` | `color` | none: primitives never reach the CSS |
| `themes.light.<role>` | light | `role.<role>` | `color`, an alias of a primitive | `--<role>` |
| `themes.dark.<role>` | dark | `role.<role>` | `color`, an alias of a primitive | `--<role>` |
| `code.<slot>` | base | `code.<slot>` | `color`, an alias of a role | `--code-<slot>` |
| `radius.case` | base | `radius.case` | `dimension`, px | `--radius` |
| `spacing.atom` | base | `spacing.atom` | `dimension`, px | `--spacing` |
| `spacing.ladder[i]` | base | `spacing.ladder.<n>`, n = value ÷ atom: 1, 2, 3, 4, 6, 8, 12, 16, 24 | `dimension`, px | none |
| `type.families.<role>` | base | `font.family.<role>` | `fontFamily`, an array | its `variable`: `--font-sans`, `--font-heading`, `--font-mono` |
| `type.scale.<step>.px` | base | `font.size.<step>` | `dimension`, px | `--text-<step>` |
| `type.scale.<step>.lineHeight` | base | `font.line-height.<step>` | `number` | `--text-<step>--line-height` |
| `type.tracking.<name>` | base | `font.tracking.<name>` | `number`, unit `em` (decision 5) | `--tracking-<name>` |
| `type.weight.<name>` | base | `font.weight.<name>` | `fontWeight` | `--font-weight-<name>` |
| `type.leading.<name>` | base | `font.leading.<name>` | `number` | `--leading-<name>` |
| `motion.entranceMs`, `microMs` | base | `motion.entrance`, `motion.micro` | `duration`, ms | `--motion-entrance`, `--motion-micro` |
| `motion.easeEntrance` | base | `motion.ease-entrance` | `cubicBezier` | `--ease-entrance` |
| `motion.entranceDot`, `entranceStart`, `entranceStagger` | base | `motion.entrance-dot`, `-start`, `-stagger` | `number` | `--motion-entrance-dot`, `-start`, `-stagger` |
| `mark.dot`, `gap`, `rise`, `lockupGap`, `orbit` | base | `mark.dot`, `mark.gap`, `mark.rise`, `mark.lockup-gap`, `mark.orbit` | `number`, unit `em` | `--mark-dot` and so on |
| `mark.lockupScale` | base | `mark.lockup-scale` | `number` | `--mark-lockup-scale` |
| `line.width` | base | `line.width` | `dimension`, px | `--line-width` |
| `focus.width`, `offset` | base | `focus.width`, `focus.offset` | `dimension`, px | `--focus-width`, `--focus-offset` |
| `elevation.y`, `blur` | base | `elevation.y`, `elevation.blur` | `dimension`, aliases `{spacing.ladder.3}` and `{spacing.ladder.8}` | none: inside `--shadow-elevation` |
| `expressive.display.family` | base | `expressive.display.family` | `fontFamily`, alias `{font.family.heading}` | `--font-face-display` |
| `expressive.display.steps.<step>` | base | group `expressive.display.<step>`: `size.min` and `size.max` (`dimension`, px), `size.preferred` (`number`, unit `vw`), `line-height` (`number`), `tracking` (`number`, unit `em`), `weight` (`fontWeight`) | as listed | `size` group: `--type-<step>-size`; `--type-<step>-leading`; `--type-<step>-tracking`; weight none |
| `expressive.motion.<press … fill>`, `light` | base | `expressive.motion.<name>` | `duration`, ms | `--motion-<name>` |
| `expressive.motion.easeStandard` | base | `expressive.motion.ease-standard` | `cubicBezier` | `--ease-standard` |
| `expressive.motion.pressScale` | base | `expressive.motion.press-scale` | `number` | `--press-scale` |
| `expressive.motion.spring` | base | group `expressive.motion.spring`: `damping-ratio`, `settle`, `samples` | `number` | the group: `--ease-spring` |
| `expressive.size.<bar … track>` | base | `expressive.size.bar`, `action`, `action-small`, `track` | `dimension`, px | `--size-bar` and so on |
| `expressive.gutter` | base | group `expressive.gutter`: `min`, `preferred`, `max` | as the display size | the group: `--gutter-stage` |
| `expressive.glass.blur` | base | `expressive.glass-blur` | `dimension`, px | `--glass-blur` |
| `expressive.field.<scheme>.field-n` | scheme | `field.field-n.fill`, `field.field-n.legend` | `color`, aliases | `--field-n`, `--field-n-foreground` |
| `expressive.glass.<scheme>.<part>` | scheme | `glass.tint`, `rim`, `edge`, `fallback`, `light` | `color`: a literal, or an alias | `--glass-<part>` |
| `expressive.glass.<scheme>.shadow` | scheme | group `glass.shadow`: `near`, `far` | `color` | the group: `--glass-shadow` |
| `EXPRESSIVE_DARK_MARKS` (a script constant) | scheme | `expressive-mark.mark-1` to `mark-4` | `color`, aliases | none: in the mode rules |
| `contrast.*` | contrast file | as today | not DTCG | none |

- **The vendor key.** Kuiper's extension data sits under one key, called **the vendor key** here. This specification writes it `io.github.plutosystemsco.kuiper`, the key open question 2 recommends unless Pluto Systems confirms it controls `plutosystems.co`. If the owner answers otherwise, the builder uses that key everywhere this one appears. **Once shipped, the key is permanent.** It is in every published token, and the record has no kind for a changed vendor key.
- **The CSS name is recorded.** Each token, or each group whose tokens make one variable, carries `$extensions["io.github.plutosystemsco.kuiper"].cssVariable`. So a stranger can map a path to the property an app reads without reading Kuiper's build.
- **Every other custom property is derived.** It is a formula of other variables, written by the build: `--mark-lockup-size`, `--mark-lift`, `--radius-action`, `--size-hero-fill`, the seven `--surface-*` copies, `--shadow-elevation` (in `kuiper.css`'s `:root` and `.dark`, decision 11), the eight `--radius-<step>` aliases, and Tailwind's `--color-*`, `--animate-*` and `--default-transition-duration`. A test holds this list (criterion 11).

### 5. The values

- **Colours** are `{ "colorSpace": "srgb", "components": [r, g, b], "hex": "#RRGGBB" }`, with `"alpha": a` only when the colour is translucent. Components and alpha are byte ÷ 255, rounded to 4 decimals. `hex` is always written, in upper case, 6 digits: the spec allows either case (*DTCG* §1.6), and upper case is what `registry.json` holds today.
  - The lowering rebuilds today's string from `hex` and `alpha`: `hex`, then the alpha byte, `round(alpha × 255)`, in upper-case hex, when `alpha` is present. 0 of 61 colours fail that round trip (*DTCG* §2, EXECUTED).
  - The components and `hex` must agree: each component × 255, rounded, equals its hex byte. A test says which colour disagrees, and prints the components to write (criterion 2).
  - *Why both:* the spec requires components; people read hex. A primitive is still unique by its hex and alpha together, as today's rule says.
- **Sizes** are px, as the design book gives them. The build turns them into rem as today, `px ÷ 16`. So the DTCG file says `8 px` where the CSS says `0.5rem`. The two are the same at the default root size, which is the build's rule (`001` decision 9).
- **`em`, `vw` and the spring have no DTCG type.** Each is a `number`, with its unit in `$extensions["io.github.plutosystemsco.kuiper"].unit` (`"em"`, `"vw"`) and the unit also said in its `$description`. A fluid size is a group of `min`, `preferred` and `max`. The spring is its three numbers; the build turns them into `linear()`, as today. *Why:* the format forbids these units (*DTCG* §1.6), and a `dimension` in `rem` would be a different value, since an `em` follows the text it sits in.
  - **This breaks a SHOULD of the format, knowingly.** The format says tools and teams "SHOULD restrict their usage of extension data to optional meta-data that is not crucial to understanding that token's value" (Format §5.2.3). A unit is crucial to the value. No 2025.10 type carries `em` or `vw`, so there is no conforming alternative. A reader that ignores extensions sees a bare number, so the words say the unit.
  - **The 18 tokens are counted.** 13 carry `unit: "em"` (the mark's five, the four tracking values, the four display steps' tracking) and 5 carry `unit: "vw"` (the four display steps' and the gutter's `preferred`). A test holds the count (T2). When a later DTCG release adds these units, each becomes a `dimension`, and the record lists each as a `retyped` token (decision 10).
- **Font stacks** are arrays, most preferred first: `["Geist Variable", "system-ui", "sans-serif"]`. The lowering rebuilds today's string: each name in single quotes if it holds a space, bare if not, joined by `, `. That rule rebuilds all three stacks exactly (criterion 7).
- **A font's build data** (its package, registry item, import name and selector) is in the family token's `$extensions`.
- **The display steps' `tabular`** flag is in the step group's `$extensions`.
- **Durations** are `{ "value": 900, "unit": "ms" }`. **Easings** are four-number arrays. **Weights** are numbers.

### 6. Aliases

- A role is an alias of a primitive, never a literal. A code slot is an alias of a role. These are today's rules (`001`, `004` decision 5), now written in the format's own syntax.
- The elevation's offset and blur are aliases of ladder steps. Today the validator checks that they equal a ladder step. The alias says so instead.
- The display family is an alias of the heading family. The fields and the expressive mark are aliases of primitives. The glass may be a literal or an alias, as today.
- **`EXPRESSIVE_DARK_MARKS` moves into the scheme files.** In dark, `expressive-mark.mark-1` to `mark-4` alias `blue-lifted`, `red-lifted`, `yellow-lifted` and `green-lifted`. In light they alias `blue`, `red`, `yellow` and `green`, the same as the light `mark-1` to `mark-4` roles, so the two files hold the same paths. The light four feed no output. So the validator requires each light `expressive-mark.mark-n` to alias the same primitive as light `role.mark-n` (decision 12), and their `$description` says so, so the copy cannot drift. The lowering puts the dark four in `expressiveDarkMarks` (decision 3), and the build reads them there. The CSS does not change. *Why:* it is a colour that varies by scheme, so it belongs to the scheme, and `031` will need a high-contrast value for it.
- Aliases resolve within one context, after flattening (*DTCG* §1.8). So `code.text` in the base file, `{role.syntax-ink}`, reaches a role defined in the scheme file. Alone, the base file does not resolve; with its scheme, it does.

### 7. How modes are shown, so `029` and `031` are not blocked

The resolver:

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "name": "Kuiper",
  "version": "2025.10",
  "description": "The Kuiper Design System's tokens. The scheme modifier picks light or dark.",
  "sets": {
    "base": {
      "description": "Every token the same in each scheme.",
      "sources": [{ "$ref": "kuiper.tokens.json" }]
    }
  },
  "modifiers": {
    "scheme": {
      "description": "The colour scheme. Its contexts are the values of the theme's scheme switch.",
      "contexts": {
        "light": [{ "$ref": "kuiper.light.tokens.json" }],
        "dark": [{ "$ref": "kuiper.dark.tokens.json" }]
      },
      "default": "light"
    }
  },
  "resolutionOrder": [{ "$ref": "#/sets/base" }, { "$ref": "#/modifiers/scheme" }]
}
```

- **One modifier, `scheme`.** It has one **scheme context** per value of `THEMES`, named by that value: today `light` and `dark`, and nothing else. A test holds that each `THEMES` value names a context and lists that scheme's file (criterion 1). It does not require the contexts to be only those, so it still holds when `031` adds contexts.
- **`029`, scoped schemes,** changes the CSS, not the tokens: `light-dark()` pairs, `data-scheme` on any element. It reads a role's two values from the two scheme contexts. Each scheme context's name is a scheme name, and so a `data-scheme` value. Nothing here constrains how `029` emits.
- **`031`, high contrast, has two ways in, and chooses.**
  - **More contexts on `scheme`.** Each lists its scheme's file, then an override file that restates, whole, only the tokens high contrast changes: for example `"light-high-contrast": [light, light.high-contrast]`. That is the Resolver module's own example (*DTCG* §1.8). The override file shares the `role` group with the scheme file, and relies on the stated rule: the last occurrence of a token wins (decision 2).
  - **A second modifier, `contrast`.** A modifier cannot read another, but aliases resolve after flattening. So a `more` context's file can alias per-scheme tokens and still resolve in each scheme. The scoped-schemes memo keeps contrast on the root, not on `data-scheme`, which this way fits.
  - Context names, and the choice, are `031`'s. Nothing in this specification rules either out, and no test here needs changing for either.
- **Expressive mode is not a modifier.** Its values are on `:root` in both modes. Only the mark's dots differ, and that is a scheme value (decision 6).
- **Each scheme file's top level carries** `$extensions["io.github.plutosystemsco.kuiper"]: { "scheme": "light", "colorScheme": "light" }`. Carbon carries its `color-scheme` the same way (*DTCG* §4).

### 8. A real excerpt

`tokens/kuiper.tokens.json`, the start of three groups (values from today's file; components EXECUTED):

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "$description": "The Kuiper Design System's tokens that are the same in every scheme. The scheme files hold the roles. Read them together through kuiper.resolver.json.",
  "primitive": {
    "$description": "The named colours. Parts never read a primitive; a role names one.",
    "ink": {
      "$type": "color",
      "$value": { "colorSpace": "srgb", "components": [0.0431, 0.0588, 0.0902], "hex": "#0B0F17" },
      "$extensions": { "io.github.plutosystemsco.kuiper": { "since": "0.13.0" } }
    },
    "line": {
      "$type": "color",
      "$value": { "colorSpace": "srgb", "components": [0.0431, 0.0588, 0.0902], "alpha": 0.102, "hex": "#0B0F17" },
      "$extensions": { "io.github.plutosystemsco.kuiper": { "since": "0.13.0" } }
    }
  },
  "spacing": {
    "$description": "The spacing atom and the ladder of steps built from it, in px. The CSS writes them in rem.",
    "atom": {
      "$type": "dimension",
      "$value": { "value": 4, "unit": "px" },
      "$description": "One spacing step. Every ladder step is a whole number of atoms.",
      "$extensions": { "io.github.plutosystemsco.kuiper": { "cssVariable": "--spacing", "since": "0.1.0" } }
    },
    "ladder": {
      "$description": "The steps a layout uses, named by their count of atoms, as Tailwind's spacing classes are.",
      "3": { "$type": "dimension", "$value": { "value": 12, "unit": "px" } },
      "8": { "$type": "dimension", "$value": { "value": 32, "unit": "px" } }
    }
  },
  "mark": {
    "$description": "The mark's geometry, in em of the text it sits in.",
    "dot": {
      "$type": "number",
      "$value": 0.3,
      "$description": "A dot's diameter, in em.",
      "$extensions": { "io.github.plutosystemsco.kuiper": { "unit": "em", "cssVariable": "--mark-dot", "since": "0.1.0" } }
    }
  },
  "code": {
    "$description": "Code's highlight slots. Each names a role, so the scheme switch carries through.",
    "text": {
      "$type": "color",
      "$value": "{role.syntax-ink}",
      "$description": "Everything no other role names: identifiers, punctuation.",
      "$extensions": { "io.github.plutosystemsco.kuiper": { "cssVariable": "--code-text", "since": "0.12.0" } }
    }
  }
}
```

`tokens/kuiper.dark.tokens.json`, its start:

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "$description": "The Kuiper Design System's dark scheme.",
  "$extensions": { "io.github.plutosystemsco.kuiper": { "scheme": "dark", "colorScheme": "dark" } },
  "role": {
    "$description": "The jobs colours do. Parts read roles, never primitives. Each names one primitive in this scheme.",
    "background": {
      "$type": "color",
      "$value": "{primitive.graphite}",
      "$description": "The page's ground.",
      "$extensions": { "io.github.plutosystemsco.kuiper": { "cssVariable": "--background", "since": "0.1.0" } }
    },
    "primary": {
      "$type": "color",
      "$value": "{primitive.blue-lifted}",
      "$description": "The one main action: a primary button, a selected control.",
      "$extensions": { "io.github.plutosystemsco.kuiper": { "cssVariable": "--primary", "since": "0.1.0" } }
    }
  }
}
```

- The excerpt is shortened: in the real file every token carries `since`, and every token with a CSS name carries `cssVariable`. The `since` values above are illustrative; the builder computes each (decision 10).
- The light file is the same, with light values. The full files are the builder's to write from today's file, by a one-off script outside the tree that is then discarded. The new files are the source from then on.

### 9. Descriptions

- **Every role (61) and every code slot (16) has a `$description`,** copied verbatim from `ROLE_WORDS` and `CODE_WORDS` in `src/lib/site/foundations/words.ts`. Verbatim, so this specification changes no word; the voice is the site's, already checked. The backticks in two code words, `keyword` and `constant`, stay: they are plain text in the format.
- **Every group has a `$description`** saying what its tokens are for and, where a unit is not the token's own, the unit. These are new words, written by the builder in the site's voice. The specification review reads them at the checkpoint.
- **Every `number` token with a unit says the unit** in its `$description` (decision 5).
- A primitive needs no `$description`. Its job is to be named by roles; the site writes that sentence from the roles that read it, as today.
- **`words.ts` is deleted.** `tables.ts` reads `tokens.descriptions` from the lowering: a role's words are its light `$description`, a code row's its code slot's. The rows, the search entries and the Markdown twins say exactly what they say today (criterion 12).
- *Why:* scorecard row 5 (c) asks for the description in the token source, and Carbon's test fails a token without one (*DTCG* §4).

### 10. The lifecycle: introduced, deprecated, renamed, removed

Four states, each recorded in one place:

- **Introduced.** Each token carries `since` in its extensions: the first release that shipped its CSS variable, or, for a token with none (a primitive, a ladder step), `0.13.0`, when its DTCG path first ships.
  - The builder computes each `since` once, from the tags' `src/app.css` (`git show v0.X.Y:src/app.css`, read-only) and from `static/v*/`. 0.12.0 is the release being tagged now.
- **Deprecated.** A token kept for a while carries `"$deprecated": "Use {role.x} instead."`: the replacement's path in braces, the way Primer writes it (*DTCG* §4). None is deprecated today. The `kuiper-theme` item's changelog line names each deprecation (constitution §6).
- **Renamed or removed.** `tokens/kuiper.removed.json` lists every name that shipped and is gone:

  ```json
  {
    "$description": "Every name Kuiper shipped and no longer ships, with what replaces it. A custom property's --color- form, and its utilities, go with it.",
    "removed": [
      {
        "name": "--code-foreground",
        "kind": "css-variable",
        "since": "0.4.0",
        "removed": "0.12.0",
        "replacement": "--code-text",
        "by": "013",
        "note": "Code's body text is its own ink, no longer the page's foreground."
      },
      {
        "name": "--syntax-amber",
        "kind": "css-variable",
        "since": "0.7.0",
        "removed": "0.12.0",
        "by": "013",
        "note": "The code palette is Meridian's roles; see --syntax-yellow and --syntax-orange."
      }
    ]
  }
  ```

  - `kind` is `css-variable` or `token` (a DTCG path, from 0.13.0 on).
  - `change` is optional and defaults to `removed`. It may also be `renamed` (with a `replacement`) or `retyped`: a token that keeps its path and changes its `$type`, as the 18 unit-in-extension tokens will when DTCG adds their units (decision 5).
  - `replacement` is present only where one name takes another's job. It must exist now.
  - **Seeded with exactly the 24 names** *DTCG* §3 found: 12 in `:root` and `.dark`, and their 12 `--color-` forms, all removed in 0.12.0 by `013`. The notes come from the 0.12.0 changelog's `pluto-theme` bullet.
  - Primitives renamed before 0.13.0 (`amber` to `yellow`) are not listed. No app could read a primitive then.
- **The record's scope, beside `020`'s `RENAMES`.** `kuiper.removed.json` covers custom properties and DTCG token paths only. `020`'s `RENAMES` (`src/lib/site/upgrade/renames.ts`) covers the other renamed interface names: the item, the storage key, the context keys, the keyframes. Neither repeats the other. If `RENAMES` holds a custom-property row, that name also gets a record entry with `by: "020"`; the builder checks `RENAMES` at `020`'s landing and notes the count (0 expected). `048`, governance, may join the two.
- **A test keeps the record complete** (criterion 13). It reads every shipped theme item under `static/v*/r/styles/maia/`, under either name, `pluto-theme.json` or `kuiper-theme.json`, taking the versions in version order (`0.4.0` before `0.11.0`), not text order. The names an item ships:
  - each `cssVars.light` and `cssVars.dark` key ships as `--<key>` and as `--color-<key>`;
  - each `cssVars.theme` key, and each `--` key anywhere in `css`, ships as itself, once.

  Every name that shipped and is not in today's theme must be in the record. Every name in the record must be absent from today's theme, `src/app.css` and `kuiper.css`. Today the set is exactly 24 (*DTCG* §3; the review's probe, EXECUTED). Read as "each `cssVars` key", the rule would count 32, with eight phantom `--color-color-code-*` names, so the test states the rule as above. So a name can no longer be removed silently. Primer's CI check does this against the base branch (*DTCG* §4); this test does it against every release in the tree, with no git.
- **From 0.13.0, a token path is an interface too.** A DTCG path renamed or removed after 0.13.0 gets a `token` entry. The same test checks them against `static/v*/r/tokens/kuiper.tokens.json` and the scheme files, once a versioned copy exists.

### 11. The plain CSS-variables file

`kuiper.css` is the tokens as custom properties, for any stack: plain CSS, another framework, an email template.

- **It holds the tokens, not the theme's behaviour.** Three blocks, in this order:
  1. `:root { … }`: every custom property `src/app.css` declares in `:root`, in the same order with the same values, then the token-made values `src/app.css` keeps in `@theme inline` (`--spacing`, `--text-<step>` and `--text-<step>--line-height`, `--tracking-<name>`, `--font-weight-<name>`, `--leading-<name>`, `--ease-entrance`, `--shadow-elevation`, `--font-sans`, `--font-heading`, `--font-mono`), then `color-scheme: light`. `--radius`, which both blocks declare, is written once.
  2. `.dark { … }`: every custom property `src/app.css` declares in `.dark`, then `--shadow-elevation` again, then `color-scheme: dark`.
     - **Why `--shadow-elevation` is repeated.** In the theme it lives in `@theme inline`, so Tailwind writes its formula into the utility, and `var(--elevation-line)` resolves on the element that uses it. In `kuiper.css` it is a custom property. A `var()` inside a custom property is substituted where it is declared, and the result inherits. Declared on `:root` alone, a `.dark` subtree inside a light page would inherit the light hairline, `#857e70`, not the dark `#7a7366`. The build already repeats `--code-*` and the `--surface-*` copies in `.dark` for the same reason (`build-tokens.ts`, the comment on the code slots). It is the only `@theme`-made value with a scheme-dependent `var()` in it.
  3. `@media (prefers-reduced-motion: reduce) { html:root { … } }`: the eight motion durations at `0ms` and `--press-scale: 1`, as the theme sets them.
- **It holds nothing else.** No `@import`, `@theme`, `@utility`, `@layer`, `@apply` or `@keyframes`. No `--color-*`, `--animate-*`, `--default-transition-duration` or `--radius-<step>`: those are Tailwind's. No rule but these three blocks. The mode, field, glass, surface and focus rules stay in the theme item. *Why:* an app without Tailwind cannot use them, and a variables file that carried rules would style an app that asked only for values.
- **It loads no font.** `--font-sans` names Geist Variable; the app loads the font. The file's header comment says so, and says which three font packages the theme item uses.
- **`color-scheme` is kept,** so form controls and scrollbars follow the scheme. It is the one property that is not a variable.
- **The dark switch is `.dark`,** as the theme's. `029` changes both at once.
- **Its values are the theme's, byte for byte.** It is written by `build-tokens.ts` from the same functions that write `src/app.css`, and formatted by prettier the same way (lower-case hex). A test compares every declaration with `src/app.css`'s (criterion 9).
- **Its header** is one comment: what it is, the version, the source URL, that it is generated, and that `kuiper-theme` is the way to take it with Tailwind.
- *Why a file beside the theme item, not a registry item:* the registry's `add` writes into a Tailwind stylesheet. A stack without the shadcn CLI needs a file it can copy. Radix publishes `tokens.css` beside its full stylesheet for the same reason (*DTCG* §4).

### 12. Validation

- **By hand, as today.** `validateTokens` becomes a checker of the five files. It throws a `TokenError` naming the file and the path, such as `tokens: kuiper.dark.tokens.json: role.ring: "{primitive.blu-lifted}" names no token`.
- **The format's rules, for the types used:** names match `^[^${}.][^{}.]*$`; every token has `$value` and its own `$type`; no group has `$value`; colour, dimension, duration, cubic Bézier, font family, font weight and number values have the shapes in decision 5 and *DTCG* §1.6; every alias resolves in each context, to a token of the same type, with no cycle; extension keys are only `io.github.plutosystemsco.kuiper`.
- **Hex is upper case, 6 digits.** The validator requires `hex` to match `^#[0-9A-F]{6}$`, stricter than the schema's `^#[0-9a-fA-F]{6}$`. A lower-case hex would change `registry.json`'s `cssVars`, which carry upper case; an 8-digit hex, the old file's habit, is not DTCG.
- **Kuiper's rules, carried over** (today's `validateTokens`): a role aliases a primitive; a code slot aliases a role; each light `expressive-mark.mark-n` aliases the same primitive as light `role.mark-n` (decision 6); the two schemes hold the same paths in the same order; each primitive's hex and alpha are unique; ladder steps are whole atoms, and a step's name is its count of atoms; the entrance's shares fit its budget; tint alphas are whole tenths; the press scale is at most 1; the spring's ratio and settle are below 1; a fluid size's min is below its max; the fields are exactly `field-1` to `field-4`; the contrast rows name roles; and the rest of today's checks, each kept with its reason comment.
- **No schema validator joins the suite.** Carbon validates with Ajv against vendored schemas (*DTCG* §4). Kuiper's checks cover the same rules for the types it uses, without a dependency. Validation against the published schemas, and an independent reader, run once at the checkpoint, outside the tree: open question 4.

### 13. Where the files are published, and their URLs

`bun run build:tokens` writes the published copies. It writes each only when its content changes, as it writes the rest (`001` decision 15).

| Published file | What |
|---|---|
| `kuiper.css` | The plain CSS variables (decision 11) |
| `kuiper.resolver.json`, `kuiper.tokens.json`, `kuiper.light.tokens.json`, `kuiper.dark.tokens.json` | The DTCG source, byte for byte |
| `kuiper.flat-light.tokens.json`, `kuiper.flat-dark.tokens.json` | Each scheme flattened into one standalone DTCG file: the base and that scheme's file, aliases kept, every alias resolving inside the file |
| `kuiper.removed.json` | The record (decision 10) |

- **Folders.** `static/r/tokens/` (the current release) and `static/v<version>/r/tokens/` (this release, kept). Beside `styles/maia/`, which the registry build replaces whole, so the CLI never deletes them (`build-registry.ts`'s swap touches `r/styles/maia/` only, READ). Older versions' folders are never written.
- **URLs,** at 0.13.0:
  - `https://<site>/v0.13.0/r/tokens/kuiper.css`, and the same for each file. `<site>` is `SITE_ORIGIN`, today the workers.dev address, until the owner sets `design.<domain>`. So the URL is `${SITE_REGISTRY}/tokens/kuiper.css`, from `src/lib/site/site.ts`. The site's links are these absolute URLs. Nothing is deployed while 0.13.0 is built, so no test fetches them: T16 checks each link's prefix, then fetches its path from the test server.
  - `https://<site>/r/tokens/kuiper.css`: the current release.
  - `https://raw.githubusercontent.com/plutosystemsco/design-system/v0.13.0/static/r/tokens/kuiper.css`: the same file from the tag, as `GITHUB_REGISTRY` serves the registry.
- **Why the flattened pair:** a tool that cannot read a resolver, such as Style Dictionary today (*DTCG* §5), can still read either scheme whole.
- **Why the contrast rules are not published:** they are a test's rules for Kuiper's own pairs. Publishing them would make them an interface. A later specification may.
- **Served as** `text/css` and `application/json`, the static host's defaults. The format allows `application/json` and requires tools to accept it (*DTCG* §1.2). No header changes.
- **An app copies the file.** It does not link to it at run time. The site says so (constitution §4.1).

### 14. Who reads the files: the changes outside the build

Six places read the token JSON raw today, and two scripts pass a path to `readTokens`. Each changes:

- `scripts/tokens.ts`: `TOKENS_PATH` stays `tokens/kuiper.tokens.json`. New: `RESOLVER_PATH`, the four other paths, `lowerTokens`, the validator, and `readTokens(root)` (decision 3).
- `scripts/build-tokens.ts` and `scripts/lint-literals.ts`: call `readTokens(root)` in place of `readTokens(path.join(root, TOKENS_PATH))`. `lint-literals.ts` changes in that line only.
- `src/lib/site/search/sources/tokens.ts`: imports the five files and calls `lowerTokens`, in place of importing one raw file.
- `src/routes/(site)/foundations/+page.server.ts`: reads its three facts through `readTokens()`.
- `src/lib/site/foundations/tables.ts`: reads `tokens.descriptions` (decision 9).
- `tests/smoke/dev-loop.test.ts`: edits `motion.micro`'s `$value.value` in `kuiper.tokens.json` (250 in place of 200), and still sees `src/app.css` and the theme item rewritten within 10 s.
- `tests/unit/tokens.test.ts` and `generated.test.ts` line 1418: read through `readTokens()` or the new files; each failure-case test is rekeyed to a DTCG path.
- `scripts/bench/kuiper.ts`, as `020` renames it (`020` decision 13). Its token block reads either shape, chosen by the commit it scores:
  - **With `tokens/kuiper.resolver.json` at the commit** (021 and later), each field from the new files: `primitives`, the count of tokens in the base file's `primitive` group; `themes`, the resolver's scheme contexts; `rolesPerTheme`, the light file's `role` tokens; `groups`, the distinct top-level groups across the base and light files (15: 11 + 4); `contrastPairs`, from `kuiper.contrast.json`, counted as today (each array's length, each object's key count: 129); `rolesWithWords`, light roles with a non-empty `$description`; `dtcgValueKeys`, `dtcgTypeKeys` and `descriptionsInFile`, counted over the three token files.
  - **Without it**, the old shape, as `020` leaves the script: `tokens/kuiper.tokens.json`, else `tokens/pluto.tokens.json`, with `words.ts` for the words. So `020`'s test 19 (`kuiper.ts --rev ea1f9bd`) prints the logged counts unchanged.
  - **No count may read 0 silently.** If neither shape is found, or the shape found yields 0 primitives, 0 roles or 0 contrast pairs, the script exits non-zero and names the commit and the missing file. A field whose meaning changed (`groups`: 14 top-level keys in the old file, 15 groups now) is noted in the scorecard's run log when the loop runs.
- The comments that cite `tokens/pluto.tokens.json, <key>` in the brand pages (`<!-- source: … -->`) cite the new path and file. `tests/unit/brand-sources.test.ts`'s `SOURCE` pattern, which names the one file, accepts `tokens/kuiper(\.[a-z]+)?\.tokens\.json` in its place.
- `src/routes/(site)/foundations/tokens/+page.svelte`: its first paragraph is rewritten to name the files, not "one token file", and a new section, **Use the tokens anywhere**, gives the three URL forms for `kuiper.css` and the DTCG files, and one sentence each on what they are for. Its sections list gains it.
- `README.md`'s tokens line names the files.

### 15. The changelog

The 0.13.0 entry gains two bullets:

- `kuiper-theme`: not an interface change. The token source is now DTCG 2025.10, with every role's job in it; the CSS an app gets is unchanged, byte for byte.
- **New:** the tokens are published as plain CSS variables (`kuiper.css`) and as DTCG files, with a record of every removed name, at `/v0.13.0/r/tokens/`. Each is listed with its URL. From 0.13.0 the DTCG token paths, the 48 primitives included, are an interface: a path renamed or removed is listed in `kuiper.removed.json` (constitution §6).

`static/r/` is a ledger file. These folders land at this specification's landing, in landing order ([`roadmap.md`](../roadmap.md) §2, "Lanes").

## Design

### The lowering, step by step

1. Read the resolver, the three token files and the contrast file.
2. Validate each token file alone: names, shapes, `$type` (decision 12).
3. For each context, flatten: the base set, then the context's file. No path appears in both (decision 2).
4. Resolve every alias in each flattened tree. Check types and cycles.
5. Check Kuiper's rules on the resolved trees.
6. Build `Tokens`:
   - `primitives[name]` = the hex string (decision 5);
   - `themes[scheme][role]` = the primitive's name, read from the role's alias;
   - `code[slot]` = the role's name, read from the alias;
   - every number from its `$value.value` or `$value`; `spacing.ladder` sorted by value;
   - `type.families[role]` = the rebuilt string and the extensions' build data;
   - `expressive.display.family` = the family's name, read from its alias;
   - `expressive.field[scheme]`, `expressive.glass[scheme]` from the scheme trees; a glass alias becomes the primitive's name, a literal its hex string, as today;
   - `contrast` = the contrast file;
   - two new top-level fields (decision 3): `expressiveDarkMarks` = the dark `expressive-mark.mark-1` to `mark-4` aliases' primitive names, in that order; `descriptions` = `{ roles, code }`, the `$description` of each.
7. Key order follows the files. A test compares the object, less the two new fields, with `020`'s, structure and key order (criterion 7).

### Byte identity, measured, not hoped for

Before any change, the builder records at `020`'s landing commit:

- `tests/fixtures/021-before/tokens.json`: `JSON.stringify(readTokens(), null, 2)`, then formatted by the repository's prettier, so `bun run lint` passes. Prettier folds short arrays onto one line (the review's probe, EXECUTED), so the fixture's bytes are not `JSON.stringify`'s. T7 therefore compares structure and key order, not bytes: `JSON.stringify(actual)` against `JSON.stringify(JSON.parse(fixture))`. `JSON.parse` keeps key order, and the `Tokens` object has no integer-like keys, so nothing reorders. The ladder is an array, so its order is checked too.
- `tests/fixtures/021-before/words.json`: `ROLE_WORDS` and `CODE_WORDS`, prettier-formatted. T5 compares parsed values.
- `tests/fixtures/021-before/hashes.json`, prettier-formatted, compared as parsed values: the SHA-256 of `src/app.css`, of `static/r/styles/maia/kuiper-theme.json`, and of the `kuiper-theme`, `font-geist`, `font-heading-ibm-plex-sans` and `font-jetbrains-mono` items as `registry.json` holds them, each serialised by `JSON.stringify(item, null, 2)`.

The fixtures are deleted by the first specification that changes a token's value on purpose. That specification says so.

## Scope

**In:**

- `tokens/`: the six files (decision 2); `tokens/pluto.tokens.json`, renamed by `020`, rewritten.
- `scripts/tokens.ts`, `scripts/build-tokens.ts` (the lowering, the validator, `kuiper.css`, the flattened pair, the published copies, `EXPRESSIVE_DARK_MARKS`).
- `scripts/lint-literals.ts`: its one `readTokens` call (decision 14).
- `static/r/tokens/` and `static/v0.13.0/r/tokens/`, generated.
- `src/lib/site/foundations/words.ts` (deleted), `tables.ts`, the search source, the Foundations index load, the tokens page, the brand pages' source comments, and `tests/unit/brand-sources.test.ts`'s `SOURCE` pattern.
- `scripts/bench/kuiper.ts`'s token block (decision 14). It is lane E's file: this one block only.
- `README.md`'s tokens line. `CHANGELOG.md`'s two bullets.
- The tests in the criteria, and the fixtures under `tests/fixtures/021-before/`.

**Out:**

- Any change to a value, a name, or the CSS. A token found wrong is a finding for a later specification.
- The literal sizes still in `build-tokens.ts`: the glass shadow's geometry (`0 1px 0`, `0 16px 32px -16px`), the glass light's `160px circle`, the entrance's `0.4` start scale and four offsets (*DTCG* §2). They are colours or sizes outside the token file, against constitution §4.3. Recorded here as a finding; the design lead ranks a small specification for them.
- Composite tokens (`shadow`, `typography`, `transition`). A composite would be a new token. `--shadow-elevation` stays a formula.
- High contrast (`031`), `light-dark()` and `data-scheme` (`029`), prefixes on the CSS names.
- A design-tool file, a Figma variables export, a plugin (constitution §3, the owner's ruling).
- Publishing the contrast rules (decision 13).
- A JS or TypeScript tokens module. Two targets, CSS and DTCG JSON, are what row 5 (g) asks for.
- `static/v0.4.0/` to `static/v0.12.0/`: read, never written.

## Tests to write first

Each is written before the code and run. The landing notes record which failed and which passed. A check that passes before the change, because nothing has changed yet, is a regression guard; it is proven by mutation (`context/README.md`, step 4).

| # | Test | File | Asserts | Before the change |
|---|---|---|---|---|
| T1 | the files declare 2025.10 | `tests/unit/tokens-dtcg.test.ts` | The three token files' `$schema` is the 2025.10 format URL; the resolver's is the resolver URL, `version` is `"2025.10"`, its one modifier is `scheme`; each `THEMES` value names a context of `scheme` that lists that scheme's file (no test requires the contexts to be only these, so `031` may add more); its default is `light` | fails: no such files |
| T2 | every token conforms | same | Walking each file: every name matches the pattern; every token has `$value` and `$type`; no group has `$value`; every value has its type's shape; each colour's components and alpha equal its hex bytes ÷ 255 at 4 decimals; no `$ref` in a token file; extension keys are only the vendor key; every `hex` matches `^#[0-9A-F]{6}$`. Counts by type equal the numbers the builder writes in (48 + 61 × 2 + 16 + 8 × 2 + 7 × 2 + 4 × 2 colours). Exactly 18 tokens carry a `unit` extension: 13 `em`, 5 `vw` | fails |
| T3 | aliases resolve | same | In each context's flattened tree, every alias resolves, to a token of its own type, with no cycle. Roles alias primitives only; code slots alias roles only; `elevation.y` and `blur` alias ladder steps | fails |
| T4 | the schemes match | same | The light and dark files hold the same token paths in the same order; base and scheme files share no top-level group; each role's `$description` is equal in both | fails |
| T5 | roles and code are described | same | 61 roles and 16 code slots have a `$description` that matches `/^[A-Z].*\.$/` and equals `tests/fixtures/021-before/words.json` verbatim | fails |
| T6 | groups are described | same | Every group has a non-empty `$description`; every `number` token with a `unit` extension names that unit in its `$description` | fails |
| T7 | the lowering returns today's object | `tests/unit/tokens-unchanged.test.ts` | `readTokens()`, less its two new fields `descriptions` and `expressiveDarkMarks`, equals `021-before/tokens.json` in structure and key order: `JSON.stringify(actual)` equals `JSON.stringify(JSON.parse(fixture))`. `expressiveDarkMarks` equals `["blue-lifted", "red-lifted", "yellow-lifted", "green-lifted"]` | passes (guard) for the comparison, fails for `expressiveDarkMarks`: proven by mutation, below |
| T8 | the built CSS is byte-identical | same | The SHA-256 of `src/app.css`, `static/r/styles/maia/kuiper-theme.json` and the four items equal those in `021-before/hashes.json` (read as parsed JSON); a fresh `generateTokenOutputs()` equals the files on disk | passes (guard) |
| T9 | `kuiper.css` is the tokens | `tests/unit/tokens-published.test.ts` | It equals a fresh build. Its top level is exactly `:root`, `.dark` and one `@media (prefers-reduced-motion: reduce)`. Every declaration is a custom property or `color-scheme`. Every property it shares with `src/app.css`'s `:root`, `.dark` or `@theme inline` has the same value, byte for byte. Its `.dark` block declares `--shadow-elevation`, with the same value as its `:root`'s. It holds none of `@import`, `@theme`, `@utility`, `@layer`, `@apply`, `@keyframes`, `--color-`, `--animate-`, `--radius-xs`. Its `:root` count equals `src/app.css`'s `:root` count plus 24 (decision 11's `@theme` names; `--radius` is already in `:root`), and its `.dark` count `src/app.css`'s `.dark` count plus 1; the builder confirms the figures | fails |
| T10 | the DTCG copies | same | `static/r/tokens/` and `static/v<version>/r/tokens/` hold the 8 files of decision 13, and the two folders are identical. The four source copies equal `tokens/` byte for byte. Each flattened file equals a fresh flatten, and every alias in it resolves inside it | fails |
| T11 | CSS names are recorded | same | Every `cssVariable` is unique and declared in `kuiper.css`. Every custom property in `kuiper.css` is named by exactly one `cssVariable` or is in decision 4's derived list | fails |
| T12 | `since` is true | `tests/unit/tokens-lifecycle.test.ts` | Every token has a `since` no later than `package.json`'s version. For each CSS name, `since` equals the first `static/v*/` theme item that ships it, where that is after `v0.4.0`; where it is `v0.4.0`, `since` is `0.4.0` or earlier | fails |
| T13 | the record is complete | same | Decision 10's rule, as worded there (`cssVars.light` and `cssVars.dark` keys as `--<key>` and `--color-<key>`; `cssVars.theme` keys and `css`'s `--` keys as themselves), over every `static/v*/r/styles/maia/{pluto,kuiper}-theme.json`, the versions sorted as versions, not as text: the shipped names absent from today's theme equal the record's `css-variable` names, exactly 24. Each `replacement` exists in today's theme. No record name is in `src/app.css` or `kuiper.css` | fails: no record |
| T14 | deprecations name their replacement | same | Every `$deprecated` string holds a `{path}` that resolves. Today there are 0 | fails: no such files |
| T15 | the validator names the fault | `tests/unit/tokens.test.ts`, rekeyed | Each of today's failure cases, rewritten on the DTCG files, throws a `TokenError` naming the file and path: a role that names a literal; a dark file missing a light path; a 5-digit hex; an 8-digit hex (the old file's habit); a lower-case hex; components that disagree with the hex; a light `expressive-mark.mark-1` that aliases another primitive than light `role.mark-1`; an `em` dimension; an alias to nothing; an alias cycle; a ladder step not a whole atom; the entrance past its budget | fails |
| T16 | the site shows the files | `tests/e2e/tokens-files.spec.ts` | On `/foundations/tokens/`, a section titled "Use the tokens anywhere" links to `kuiper.css`, `kuiper.resolver.json` and the two flattened files. Each `href` starts with `SITE_REGISTRY` and ends `/tokens/<file>`. The test takes each `href`'s path (from `/v<version>/r/tokens/`) and fetches that path from the test server, never the absolute URL: each returns 200, as `text/css` or `application/json`. Each role row's job equals its `$description`. Both themes | fails |
| T17 | an app without Tailwind gets the colours | same | A blank page that loads only `/r/tokens/kuiper.css`: `--background` computes to `#f3f0e8` on `:root`, and to `#16140f` inside `.dark`; `--motion-micro` is `0ms` under `reducedMotion: "reduce"`. **The nested case:** in a light page, an element inside `<div class="dark">` with `box-shadow: var(--shadow-elevation)` computes a hairline of `rgb(122, 115, 102)` (`#7a7366`, dark `paper-line-input`), not `rgb(133, 126, 112)` (`#857e70`, light). Chromium, Firefox and WebKit | fails |

**The mutation proofs for T7 and T8.** On a scratch copy of the new files, the builder changes `primitive.paper`'s components and hex by one step, and, separately, swaps the order of two roles in the dark file. Each change must fail T7 and T8 (and T2 or T4 where they apply). A third mutation, deleting `--shadow-elevation` from the scratch `kuiper.css`'s `.dark` block, must fail T9 and T17's nested case. The copy is then discarded. The results go into the landing notes.

## Acceptance criteria

Every browser check runs in both theme projects. "Byte-identical" means equal SHA-256.

1. **The format.** T1 to T6 pass. The resolver has one modifier, `scheme`, with a context per `THEMES` value (today `light` and `dark`, and no other) and default `light`. (unit)
2. **Every colour.** 48 primitives, 61 roles in each scheme, 16 code slots, 8 field colours and 7 glass colours in each scheme, and the 4 expressive-mark colours in each scheme are `color` tokens; every role and code slot is an alias. T2's type counts hold the exact numbers, written in by the builder from the converted files and checked by the reviewer against this list. (unit)
3. **No unit the format forbids.** No `dimension` has a unit other than `px` or `rem`. The 13 `em` values (the mark's five, the four tracking values, the four display steps' tracking) and the 5 `vw` values (the four display steps' and the gutter's) carry their unit in the extension and in their words. (unit)
4. **The schemes.** T4 passes. (unit)
5. **Descriptions.** T5 and T6 pass. `words.ts` does not exist. (unit)
6. **The lowering.** `readTokens(root)` and `lowerTokens()` return the same object. Each of the six raw readers decision 14 names (the search source, the Foundations index load, the smoke test, `tokens.test.ts`, `generated.test.ts` line 1418, the bench) and the two path-passing scripts (`build-tokens.ts`, `lint-literals.ts`) reads through them. (unit)
7. **Today's object.** T7 passes. (unit)
8. **Byte-identical CSS.** T8 passes. `bun run build:tokens`, run twice, writes 0 files the second time, and the first run writes nothing but the published copies. `git diff` at `020`'s landing commit shows no change to `src/app.css`, the four items in `registry.json`, or `static/r/styles/maia/`. (unit, and the checkpoint)
9. **`kuiper.css`.** T9 passes. (unit)
10. **The published files.** T10 passes. (unit)
11. **CSS names.** T11 passes. (unit)
12. **The site reads the same.** The `/foundations/tokens/` and `/foundations/code/` tables, the search entries for tokens and the Markdown twins of those pages equal their text before the change, but for the tokens page's first paragraph, rewritten, and the new section. T16 passes. (unit, e2e)
13. **The record.** T12, T13 and T14 pass. The record holds exactly 24 entries, plus one per custom-property row in `020`'s `RENAMES`, if any (0 expected). (unit)
14. **The validator.** T15 passes. (unit)
15. **Any stack.** T17 passes in all three engines. (e2e)
16. **The smoke loop.** `dev-loop.test.ts` passes on the new file. (smoke)
17. **The bench.** `bun scripts/bench/kuiper.ts --rev <landing>` reports `primitives` 48, `rolesPerTheme` 61, `themes` `light` and `dark`, `contrastPairs` 129, `groups` 15, `rolesWithWords` 61, `dtcgValueKeys` and `dtcgTypeKeys` above 0, and `descriptionsInFile` at least 77 + the group count. `020`'s test 19 (`kuiper.ts --rev ea1f9bd`) still passes, with the counts its run-log row holds. Run at a commit with neither token shape, the script exits non-zero. (bench)
18. **The changelog.** The 0.13.0 entry holds decision 15's two bullets. The `kuiper-theme` bullet says "not an interface change" and "byte for byte". The new-files bullet names `kuiper.css`, `kuiper.resolver.json`, `kuiper.removed.json` and `/r/tokens/`, and says the DTCG token paths are an interface. `registry.test.ts` checks these names. (unit)
19. **The suites.** `bun run test:unit`, `bun run test:e2e` and `bun run test:smoke` pass; `bun run check` 0 errors; `bun run lint` clean; the literal lint unchanged. Expectations change only in the tests decision 14 names and the new ones. (all)
20. **Tests first, and the checkpoint.** T1 to T6 and T9 to T17 are seen failing before the change. T8, and T7's comparison, pass and are proven by mutation; T7's `expressiveDarkMarks` assertion fails until the lowering exists. At the checkpoint the design lead reads the converted files beside today's, the new group descriptions, `kuiper.css` beside `src/app.css`, and the tokens page in both themes. (checkpoint)
21. **The scorecard.** The loop is run (`roadmap.md` §4). Row 5 is expected to move 1 → 4: (c) descriptions in the source, (d) DTCG, (f) lifecycle, (g) two targets, joining (a), (b) and (e) for 7 of 7. Row 12 is expected to move 0 → 1 on (b), only with the evidence open question 3 asks for: a recorded import, or a cited design tool's documentation. The change review cites the movement. (bench)

## Build order

1. At `020`'s landing commit, record the three fixtures (Design, "Byte identity").
2. **Tests first.** Write T1 to T17, and the rekeyed T15. Run them. Record failures and passes.
3. Convert the file by a one-off script outside the tree, to the five files. Discard the script.
4. The lowering and the validator. Then T1 to T8 and T15 pass.
5. The mutation proofs for T7 and T8.
6. `EXPRESSIVE_DARK_MARKS` deleted; the mode rule reads `tokens.expressiveDarkMarks`.
7. `kuiper.css`, the flattened pair and the copies. T9 to T11.
8. `since` values and the record. T12 to T14.
9. The readers: `tables.ts`, the search source, the index load, `lint-literals.ts`, the smoke test, `brand-sources.test.ts`, the bench (`kuiper.ts`). `words.ts` deleted.
10. The tokens page, the README line, the brand pages' comments. T16, T17.
11. **Checkpoint** (criterion 20).
12. The changelog; `static/r/` at landing.
13. Every suite, the lints and `check`. `020`'s test 19. The open question 3 and 4 checks, as the owner answered.
14. The change review. Then the scorecard loop.

## Risks

- **Half the merge rule is unstated.** The Resolver module says the last occurrence of a token wins; it does not say whether the later token replaces the earlier one whole or merges its properties. No path is in two of these files, so either reading gives the same result (decision 2). `031`'s override files share the `role` group by design and restate each token whole, so either reading holds there too.
- **Resolver support is young.** A tool that cannot read resolvers reads the flattened files (decision 13).
- **`em` and `vw` as numbers.** This breaks the format's SHOULD on extension data (decision 5). A tool that ignores extensions misreads 18 values as unitless. The words say the unit. A later DTCG release may add units; each of the 18 then gets a `retyped` record entry.
- **Descriptions twice.** Each role's words are in two files. T4 fails on any drift.
- **The URL moves once.** When the owner sets `design.<domain>`, the site's URLs change. The GitHub raw URL at the tag does not.
- **The vendor key is permanent.** Once 0.13.0 ships, every published token carries it. Q2 asks the fact first.
- **Lane E.** The bench script (`kuiper.ts` after `020`) and lane E's `022` and `025` may touch `scripts/bench/` at once. This specification edits only its token block, and lands it in landing order.
- **The fixtures are a snapshot.** Any later value change fails T7 and T8. That is their point. The specification that changes a value deletes them, and says so.

## Open questions for the owner

Recommended option first. The answers go in the landing notes.

**Q1. One source file, or a resolver set?**

1. **A resolver set:** a base file, a light file, a dark file and a resolver (decision 2). Conforms to DTCG's Resolver module, which Carbon uses; any resolver-aware tool reads dark; `031` adds high contrast as one file per scheme. Costs: four files, and each role's words written twice, held equal by a test.
2. **One DTCG file, dark in `$extensions`.** One file to read. But only the light values are standard; a tool that does not know Kuiper's key never sees dark. `031` adds a second key to every token.
3. **One standalone file per scheme, no resolver.** Plain DTCG everywhere; but the scheme-free tokens, over 100 of them, are written twice.

**Q2. The vendor key for `$extensions`.** The format recommends a reverse domain name the vendor controls (Format §5.2.3). The key goes on every published token. **Once 0.13.0 ships, it is permanent:** changing it would change every published file, and the record has no kind for it.

First, a fact only you can give: **does Pluto Systems control the domain `plutosystems.co`?** The registry's items named `https://plutosystems.co` as their author until 0.7.0. Commit `bfbd6b6` (0.7.1, "registry author point at this repository") replaced it with the GitHub URL. Nothing current names the domain: only the frozen registry copies up to `static/v0.7.0/`, and one sample, `package co.plutosystems.sandbox;` in `src/lib/preview/code-samples.ts`, which `020` classes as sample content (*DTCG* §8).

1. **If it does not, or you are not sure: `io.github.plutosystemsco.kuiper`.** A namespace the organisation verifiably holds: the `io.github.<org>` form package registries accept for an owner GitHub has verified. The specification is written with this key (decision 4). Recommended.
2. **If it does: `co.plutosystems.kuiper`.** The company's own domain, reversed, with the system's name.
3. **Another domain** you name, reversed, with `.kuiper`.

**Q3. Does a published DTCG file count as "tokens published as design-tool variables" on scorecard row 12 (b)?** The roadmap expects 0 → 1. The scorecard scores evidence, so the answer needs a named tool. None could be cited as importing 2025.10 files (*DTCG* §8):

- **Penpot**'s own guide says its tokens "adhere to the Design Tokens Format Module", "a draft by the W3C DTCG", and imports JSON files and folders from its Tokens panel. But it lists colour values as strings only (hex, RGB, HSL), not the 2025.10 colour object (READ, [help.penpot.app](https://help.penpot.app/user-guide/design-tokens/)). A forum thread says its export is Tokens Studio's format, not 2025.10 (READ, secondary).
- **Figma**'s native variables import and export was announced at Schema 2025. Forum reports from December 2025 say it was still rolling out, with gaps (READ, secondary, [the Figma forum](https://forum.figma.com/ask-the-community-7/native-variable-export-feature-47831)). No Figma help page could be found to cite. By your ruling, Kuiper does not design in Figma.

So:

1. **One import as evidence.** At the checkpoint, the design lead imports `kuiper.flat-light.tokens.json` into Penpot, once, outside the repository, in the same scratch folder as Q4's checks. What it imported, and what it refused, go in the landing notes and the scorecard's evidence. If Penpot rejects the 2025.10 colour objects, (b) is not met, row 12 stays 0, and no second, older-format file is published for it. No design-tool file is kept (constitution §3). Recommended.
2. **Yes, with no tool tried.** The rubric scores the publication. Without a cited tool this is a claim, not evidence; the scorecard would mark it so.
3. **No.** Row 12 stays 0 until `054`, the designer's start.

**Q4. A second reader, to prove conformance?**

The review's probe (EXECUTED, Terrazzo CLI 2.10.0) found that `tz check`, given the resolver, checks only the default context: a broken alias in the dark file passed. It also accepted a `dimension` in `em`, which the format forbids. Given plain files, it caught the dark alias. Ajv 8.17.1 against the published schemas rejected the `em` dimension and accepted the spec's excerpts. `@terrazzo/parser` has no binary; the CLI is `@terrazzo/cli`.

1. **Both, once, at the checkpoint, outside `bun.lock`.** In a scratch folder outside the tree, at exact versions (Ajv 8.17.1 and `@terrazzo/cli` 2.10.0, or the versions current then, named in the landing notes):
   - (a) **Ajv** validates each of the three token files and both flattened files against `https://www.designtokens.org/schemas/2025.10/format.json`, and the resolver against `.../resolver.json`, fetched that day;
   - (b) **`tz check`** runs once on each flattened file, not on the resolver, so the dark scheme is read.

   Both outputs go in the landing notes. Nothing joins `bun.lock`. Recommended: the schemas are the stricter reader, Terrazzo is the independent one, and Kuiper's own validator (decision 12) holds the same rules on every run after.
2. **Ajv in the suite.** Ajv as a pinned dev dependency, the two schemas vendored under `tests/fixtures/`, and a unit test over every file, as Carbon does. Proves schema conformance on every run. Costs a dependency and its updates, and a licence check of the vendored schemas. Not recommended: it repeats, for the types Kuiper uses, what decision 12's validator checks without a dependency, and a token-file change is rare and reviewed.
3. **None.** Kuiper's own validator only.

**Q5. Primitives become public.** The DTCG files carry the 48 primitives, because roles alias them. From 0.13.0 a primitive's path is an interface: renaming one needs a record entry. The CSS still carries none.

1. **Yes, public in DTCG, absent from the CSS.** The alias from role to primitive is what a designer needs to see the palette.
2. **Publish resolved values only.** The published files carry hex values and no primitives; the source keeps them. A primitive stays private, but the published files lose the palette's structure.

## Review

The specification review, [`../reviews/021-tokens-for-everyone-spec-2026-11-15.md`](../reviews/021-tokens-for-everyone-spec-2026-11-15.md), 2026-11-15: approve with changes, 7 Medium and 6 Low. Every finding is applied. The reviewer's own measurements are cited above as the review's probe (EXECUTED).

| # | Finding | Answered in |
|---|---|---|
| 1 | `--shadow-elevation` on `:root` only gives a nested `.dark` the light hairline | Decision 11: repeated in `kuiper.css`'s `.dark`, with the reason; decision 4's derived list; T9 asserts it; T17 gains the nested case; a third mutation proof |
| 2 | T7's byte fixture cannot pass the lint | Design, "Byte identity": fixtures prettier-formatted; T7, T5 and T8 compare parsed structure and key order |
| 3 | The lowering adds `expressiveDarkMarks`, which decision 3 and T7 did not allow | Decision 3 names two new top-level fields; Design step 6 agrees; T7 drops both and asserts the dark four; build-tokens reads `tokens.expressiveDarkMarks` |
| 4 | The bench: `020`'s `kuiper.ts`, the other counts, the `--rev` fallback | Decision 14: each field on the new files, the old shape kept for older commits, a non-zero exit on a missing shape or a zero count; Scope; criterion 17 adds `020`'s test 19 and exact counts |
| 5 | T16 fetched absolute `SITE_ORIGIN` URLs | Decision 13 and T16: the prefix is checked, the path fetched from the test server |
| 6 | Q4's reader proved less than claimed | Q4 rewritten: Ajv against the 2025.10 schemas for every file, plus `tz check` per flattened file, once, outside `bun.lock`; option 2 (Ajv pinned in the suite) argued and not recommended; decision 12 |
| 7 | Q2 rested on a domain dropped at 0.7.1 | Q2 asks the fact first; recommends `io.github.plutosystemsco.kuiper` unless the domain is confirmed; the key's permanence stated in Q2, decision 4 and Risks; the spec is written with the recommended key |
| 8 | `readTokens`'s argument; `lint-literals.ts` | Decision 3 gives `readTokens(root = process.cwd())`; decision 14 and Scope add `lint-literals.ts`; criterion 6 names every reader |
| 9 | The merge wording; the context-name equalities after `031` | Decision 2: token-level last-wins stated, the unstated property merge named, root `$`-properties' collision said; decision 7: "each scheme context", a second `contrast` modifier left open for `031`; T1 and criterion 1 no longer require the contexts to be only `THEMES`; Risks |
| 10 | T13's rule counted 32 | Decision 10 and T13: `cssVars.light` and `.dark` only take `--color-`; versions sorted as versions; exactly 24 |
| 11 | `em` and `vw` in extensions break a SHOULD | Decision 5 names the SHOULD and why it is broken; the 18 tokens counted (T2); a `retyped` record kind (decision 10); Risks |
| 12 | Write-ins | Kind line: 8 new `expressive-mark` tokens and public primitives; decision 6 and 12: the light four checked against `role.mark-n`; decision 9: two code words; criterion 12: the first paragraph; decision 14: `brand-sources.test.ts`'s pattern; decision 12 and T2, T15: upper-case 6-digit hex, two new failure cases; decision 10: the record's scope beside `020`'s `RENAMES`; decision 15 and criterion 18: the DTCG paths are an interface |
| 13 | Q3 needs a source | Q3: Penpot's and Figma's documentation read; neither shows 2025.10 import; option 2 of the draft (one import as evidence) is now recommended, into Penpot; criterion 21 requires the evidence |

The memo's wrong figures are corrected in its §8, dated 2026-11-15: 18 colours carry alpha, not 15; the domain's history; the names rule; the second-modifier reading; Q3's sources.

## Landing notes

Not landed.
