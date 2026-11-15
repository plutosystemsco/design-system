# The tokens as DTCG: the format, the prior art and the tools

- **Status:** research memo. It commits us to nothing. Corrected 2026-11-15 after `021`'s specification review: §8 lists each correction; the sections above it are left as written. It stands under [`../specifications/021-tokens-for-everyone.md`](../specifications/021-tokens-for-everyone.md).
- **Date:** 2026-11-15
- **Author:** the design lead
- **Question:** what the W3C Design Tokens Community Group format is today; how far Kuiper's token file is from it; how the reference systems publish tokens; which tools read the format; and whether Kuiper needs any of them.
- **Blocks:** `021`, then `029` (scoped schemes), `031` (high contrast), `048` (a built-token diff in every change review) and `054` (the designer's start).
- **Names.** This memo reads the tree as it stands, so it says `tokens/pluto.tokens.json` and `pluto-theme`. `020` renames them `tokens/kuiper.tokens.json` and `kuiper-theme` before `021` builds.
- **Labels.** **EXECUTED**: run or measured here on 2026-11-15, by read-only commands and scratch scripts outside the tree. **READ**: a source says so, linked, read 2026-11-15. **INFERRED**: our reasoning.

**Terms of art.**

- **DTCG** is the Design Tokens Community Group, a W3C community group. Its **format** is a JSON shape for design tokens that many tools read.
- A **token** is a named value with a type. A **group** is a named object that holds tokens and other groups.
- An **alias** is a token whose value is another token, written `{group.token}`.
- A **resolver** is a DTCG file that says which token files to combine for each **context**, such as light or dark.
- A **mode** here means any set of alternative values chosen at run time: the scheme (light, dark), high contrast, and so on.

## 1. The format today

### 1.1 What is stable

- The stable release is **2025.10**, published 28 October 2025. It has three modules: Format, Color and Resolver. Each calls itself "considered stable", a Final Community Group Report published as a Candidate Recommendation. It is not a W3C Standard (READ, [the 2025.10 reports](https://www.designtokens.org/tr/2025.10/), [the announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)).
- No newer stable version exists. The drafts area holds a "preview draft" of the Format module dated 8 September 2026, still titled 2025.10. It says not to implement or cite it (READ, [the draft](https://www.designtokens.org/tr/drafts/format/)). So 2025.10 is the version to build against.
- JSON Schemas are published. `https://www.designtokens.org/schemas/2025.10/format.json` and `.../resolver.json` both return 200 as `application/json` (EXECUTED, `curl`). The resolver schema bundles the colour, dimension, modifier and other sub-schemas in its `definitions` (EXECUTED, read in a scratch folder). The sub-schema URLs themselves return an HTML page, not JSON (EXECUTED).

### 1.2 Files

- A token file is JSON. Its preferred extension is `.tokens`, and `.tokens.json` is allowed. The preferred media type is `application/design-tokens+json`; `application/json` is allowed, and tools must accept both (READ, Format §4).
- The format schema allows `$schema`, `$type`, `$description`, `$extensions`, `$extends`, `$deprecated` and `$root` at the top of a file. Every other key must be a group or a token: `additionalProperties` is `false` (EXECUTED, the schema). Its own comment says `$schema` "is not part of the official DTCG specification" (EXECUTED).
- So a top-level array, such as Kuiper's `contrast` lists, is not valid there. Data that is not a token goes in `$extensions` or in another file (INFERRED from the schema).

### 1.3 Tokens and groups

- An object with `$value` is a token. An object without one is a group. A group may not hold `$value` (READ, Format §5–6).
- A token may carry `$type`, `$description` (plain text), `$deprecated` and `$extensions`.
- `$type` is optional on the token. Without it, the type comes from the aliased token, else from the nearest group's `$type`. Tools must not guess a type from the value (READ, Format §5.2).
- A group may carry `$description`, `$type` (a default for its children), `$deprecated`, `$extensions` and `$extends`. `$extends` deep-merges another group into this one (READ, Format §6).
- `$root` is a reserved token name inside a group. It gives the group a base value at the path `group.$root`. A group itself is never an alias target (READ, Format §6.2).

### 1.4 Names

- Names are case-sensitive JSON strings. They must not begin with `$` and must not contain `{`, `}` or `.` (READ, Format §5.1). The schema's pattern is `^[^${}.][^{}.]*$` (EXECUTED).
- So Kuiper's names, such as `card-foreground`, `field-1` and `2xl`, are all valid (INFERRED, checked by eye against the pattern).

### 1.5 References

- **Curly braces**, `"{group.token}"`, resolve to the whole target token's `$value`. They cannot reach inside a value (READ, Format §7).
- **JSON Pointer**, `{"$ref": "#/group/token/$value/components/0"}`, reaches a part of a value. Tools must support both forms (READ, Format §7.1–7.3).
- Chains are allowed. A cycle is an error. An alias's type is its target's type (READ).

### 1.6 Types and value shapes

| `$type` | Value | Notes |
|---|---|---|
| `color` | `{ "colorSpace": "srgb", "components": [r, g, b], "alpha": a, "hex": "#rrggbb" }` | Color module. 14 spaces, among them `srgb`, `oklch`, `display-p3`. sRGB components are 0–1. `alpha` is 0–1, default 1. `hex` is optional and **6 digits only**, to avoid clashing with `alpha`; its schema pattern is `^#[0-9a-fA-F]{6}$`, so case is free. A component may be `none` (READ, Color §4; EXECUTED, the bundled schema) |
| `dimension` | `{ "value": 8, "unit": "px" }` | `unit` is **`px` or `rem` only**. `em`, `vw` and `%` are not allowed. `unit` is required even for 0 (READ, Format §8.2; EXECUTED, the schema) |
| `duration` | `{ "value": 200, "unit": "ms" }` | `ms` or `s` |
| `cubicBezier` | `[x1, y1, x2, y2]` | x in [0, 1], y any number |
| `fontFamily` | a string, or an array of strings, most preferred first | |
| `fontWeight` | 1–1000, or a keyword (`normal`, `bold`, …) | |
| `number` | a JSON number | unitless |
| `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography` | composite objects | `shadow` needs `color`, `offsetX`, `offsetY`, `blur`, `spread`, optional `inset`. `typography`'s `lineHeight` is a number, a multiple of `fontSize`; `letterSpacing` is a dimension (READ, Format §9) |

- 2025.10 has no user-defined composite types (READ, secondary: the search summary of the release, not confirmed in the text). It has no fluid or `clamp()` type, no easing curve other than the cubic Bézier, and no string type (READ, Format §8–9: none is listed).

### 1.7 Extensions and deprecation

- `$extensions` holds vendor data under a vendor key. Reverse domain notation is recommended; the example key is `org.example.tool-a`. Tools **must preserve** extension data they do not understand. Extensions should hold metadata that is not essential (READ, Format §5.2.3).
- `$deprecated` is `true`, `false`, or a string that says why. It may sit on a token or a group (READ, Format §5.2.4, §6).

### 1.8 Modes: the Resolver module

- The format itself says nothing about modes. Modes live in the **Resolver** module (READ, [Resolver 2025.10](https://www.designtokens.org/tr/2025.10/resolver/)).
- A resolver file is JSON, named `*.resolver.json` by convention. It requires `version: "2025.10"` and `resolutionOrder`. It may carry `name`, `description`, `sets` and `modifiers` (READ; EXECUTED, the schema's `required`).
- A **set** is a list of `sources`: inline tokens, or `{ "$ref": "file.tokens.json" }`.
- A **modifier** has a `contexts` map, at least two, each a list of sources, and an optional `default` (EXECUTED, the modifier schema: `minProperties: 2`). The spec text once writes `context`; the schema says `contexts` (READ; EXECUTED).
- A modifier cannot refer to another modifier (READ).
- Resolution walks `resolutionOrder`, flattens each set and each chosen context, and lets later entries win. Aliases resolve **after** flattening, so a token in one file may alias a token in another (READ, Resolver §6).
- **The spec does not say how a collision merges.** "The last occurrence … will be the final value" (§4.1.4). It does not say whether a later token replaces the earlier one whole, or merges its properties (READ). So a later file should restate a token in full: its `$type`, `$value` and `$description` (INFERRED).
- The spec's own theme example is one modifier with four contexts: `light`, `lightHighContrast`, `dark`, `darkHighContrast`. A high-contrast context lists the scheme's file, then a file of overrides on top (READ, Resolver example 3).
- The number of resolved outputs is the product of every modifier's context count (READ, §4.1.5.4).

## 2. Kuiper's file against the format

EXECUTED, by a scratch script over `tokens/pluto.tokens.json` as the tree holds it (the builder's letter-spacing change included).

- **Counts.** 48 primitives; 61 roles in each of two themes; 16 code slots; 127 contrast rows (33 text, 4 tints, 21 non-text, 2 exceptions, 3 forbidden, 8 field, 33 glass, 20 glass-over-glass, 6 scrim) (EXECUTED).
- **No DTCG key.** 0 `$value`, 0 `$type`, 0 `$description` (the scorecard's §3, EXECUTED there and confirmed here).
- **Colours are 6- or 8-digit hex strings.** 15 of them carry alpha. Every byte survives a round trip through a 0–1 number rounded to 4 decimals: 0 failures over 61 colours (48 primitives and 13 glass literals) (EXECUTED). So a colour can be written as DTCG components and alpha, and the exact uppercase hex the outputs use can be rebuilt.
- **The outputs depend on that exact string.** `registry.json`'s theme item carries `#F3F0E8` and `#0B0F171A` in upper case. `src/app.css` carries `#f3f0e8` and `#0b0f171a`, lowered by prettier (EXECUTED, `grep`).
- **Values that fit a DTCG type:** sizes in px (radius, the ladder, the type scale, line and focus widths, the bar and action sizes, the glass blur); durations in ms; the two cubic Béziers; the three font stacks; the weights; unitless numbers (line heights, the entrance shares, the press scale, the spring's three numbers).
- **Values that do not:**
  - `em` sizes: the mark's dot, gap, rise, lockup gap and orbit; the four tracking values and the four display steps' tracking. DTCG allows only `px` and `rem`.
  - Fluid sizes: the four display steps and the stage gutter, each `clamp(min, vw, max)`. There is no fluid type, and `vw` is not a unit.
  - The spring: three numbers that `build-tokens.ts` turns into a `linear()` easing. DTCG has no such type.
  - Each font's build data: its package, its registry item, its import name, its selector.
- **Data that is not a token:** the 127 contrast rows, the exceptions and the forbidden pairs. They are rules for a test.
- **A token held in a script.** `EXPRESSIVE_DARK_MARKS`, the four primitives the mark takes on a dark expressive ground, is a constant in `scripts/build-tokens.ts` (lines 48–53), not in the token file (READ, the script).
- **Literal sizes in the script.** The glass shadow's geometry (`0 1px 0`, `0 16px 32px -16px`), the glass light's `160px circle`, and the entrance's start scale `0.4` and four offsets are written in `build-tokens.ts` (READ). They are not tokens today.
- **The words.** Each role's job is in `src/lib/site/foundations/words.ts`: 61 role entries and 16 code entries. Only `tables.ts` imports them, and `scripts/bench/pluto.ts` greps them (EXECUTED, `grep`).
- **Who reads the file raw.** Most code calls `readTokens()`. Four places parse the JSON themselves: the search source (`src/lib/site/search/sources/tokens.ts`, an `import`), the Foundations index's server load, the smoke test that edits a token, and two unit tests (EXECUTED, `grep`).

## 3. The names that shipped and went

EXECUTED, two ways.

1. **Every tag's `src/app.css`.** The custom properties each of `v0.1.0` to `v0.11.0` declares, and the tree's now. No tag removes a name until 0.12.0. 0.12.0 removes 24: 12 names in `:root` and `.dark` (`--code-foreground`, `--code-escape`, `--code-builtin`, `--code-tag`, `--code-property`, `--code-decorator`, `--code-self`, `--code-invalid`, `--syntax-amber`, `--syntax-purple`, `--syntax-teal`, `--syntax-cyan`) and the `--color-` form of each.
2. **Every versioned theme item in `static/`.** `static/v0.4.0/` to `static/v0.12.0/` each hold `pluto-theme.json`. Their names (cssVars' keys, `@theme` keys, and every `--` key in `css`) number 116, 116, 122, 145, 145, 145, 198 and 196. The union, less today's, is 20 names: the 12 above and the 8 `--color-code-*` forms the item declares itself. The 4 `--color-syntax-*` forms are derived by the CLI, not declared, so the item does not list them. 20 + 4 = 24, as in (1).

- `--code-foreground` was renamed `--code-text`; the others were removed, and the 0.12.0 changelog says what replaces each family (READ, `CHANGELOG.md` line 13).
- The stage, veil, bloom, rim, energized and `--radius-pill` names came and went between `v0.8.0` and `v0.11.0`. No tag shipped them (EXECUTED: absent from every tag's `app.css`).
- Primitives were renamed in 0.12.0 (`amber` to `yellow`, `amber-text` to `yellow-text`) and removed (`cyan-*`, `orange-*`, `purple-*`, `teal-*`) (EXECUTED, `git show` of each tag's token file). No app could read a primitive then (READ, `CHANGELOG.md` line 13: "primitives never reach an app").
- So the static folder alone rebuilds the record of every shipped and removed custom property, given the rule that each `cssVars` key also ships as `--color-<key>` (INFERRED from (1) and (2) agreeing).

## 4. How the reference systems publish tokens

Studied in the clones under `context/prior_art/`, at the commits in its README. Read, never copied. Paths are inside each clone.

### Carbon (`fa75d78`, Apache-2.0)

- **DTCG 2025.10 at the source.** `packages/{colors,layout,motion,themes}/tokens/*.tokens.json`, each with `$schema` set to the 2025.10 format schema (READ, `colors/tokens/colors.tokens.json` line 2).
- **Object values.** Colours are `colorSpace`, `components` and `hex` objects; dimensions are `{ value, unit: "rem" }`; durations `{ value, unit: "ms" }` (READ, `colors.tokens.json` 6–10, `layout.tokens.json` 7–11, `motion.tokens.json` 8). A theme's translucent colour borrows a palette colour's space and components by JSON Pointer and sets its own `alpha` (READ, `themes/tokens/themes/white/theme.tokens.json` 37).
- **Modes by a resolver.** `themes/tokens/themes.resolver.json` has one set, the palette, and one modifier, `theme`, whose four contexts each list their files (READ, lines 1–25). Each theme file's top-level `$extensions["com.ibm.carbon"]` carries its `color-scheme` (READ, white/theme.tokens.json 4–22). So a top-level `$extensions` is used in practice.
- **Conformance in the tests.** `packages/test-utils/tokens.js` validates each file against vendored copies of the 2025.10 schemas with Ajv (READ, 10–16, 45–47). A parity test fails a theme token that is not kebab-case, typed and described (READ, the existing *Carbon* memo, `theme-parity-test.js` 63–77).
- **Lifecycle.** `$deprecated: true`, with the replacement only in `$description` (READ, `layout/tokens/layout.tokens.json` 328–363). No record of removed names.
- **Outputs.** Style Dictionary `^5.5.0` with custom formats: JS, `.d.ts`, SCSS and metadata. Sass, not the tokens, writes the CSS variables, as `--cds-<name>` (READ, `themes/package.json` 55, `sd.config.js`, `themes/scss/_config.scss` 8).

### Primer (`4773648`, MIT)

- **DTCG in JSON5.** `src/tokens/{base,functional,component}/**/*.json5`. Colours are objects in `hsl`; dimensions are `{ value, unit: 'px' }` (READ, `base/color/light/light.json5` 9–13, `base/size/size.json5` 5).
- **Modes by files, and an override map.** 14 themes, each its own base file (`light.json5`, `light.high-contrast.json5`, `dark.dimmed.json5`, …). A functional token can carry per-theme overrides in its `$extensions` (the existing *Primer* memo, `org.primer.overrides`). Output selectors are `[data-color-mode]` with `[data-light-theme]` and `[data-dark-theme]` (READ, `src/platforms/css.ts` 37–42).
- **Descriptions** are optional in its schema (READ, `src/schemas/baseToken.ts` 5). `org.primer.llm` holds usage rules (READ, `functional/color/bgColor.json5` 24–27).
- **Lifecycle.** `$deprecated` names the replacement alias, `'{focus.outline-color}'` (READ, `component/focus.json5` 64). `src/tokens/removed.json` maps each removed name to its replacement or `null` (READ, line 84: `"text.primary": "fg.default"`). CI runs `check:removed-tokens` against the base branch on every pull request (READ, `.github/workflows/ci.yml` 36–42).
- **Outputs.** Style Dictionary `^5.0.0`: CSS, JS and TS, Figma variables JSON, docs JSON, fallbacks, a deprecated-tokens list and LLM Markdown. The package ships `dist` and `src/tokens` (READ, `package.json` 83, `scripts/buildTokens.ts` 42–52).

### Spectrum (`b236981`, Apache-2.0)

- **Not DTCG at the source.** The legacy files use `value` without `$`, a schema URL as the type, a UUID per token, and string values such as `"9px"` and `"rgb(0, 0, 0)"` (READ, `packages/tokens/src/layout.json` 4). The newer data is UUID-keyed records with `$ref` aliases (READ, `packages/design-data/tokens/color-aliases.tokens.json` 11–12).
- **DTCG is an export.** A Rust plugin writes it, resolving aliases and writing colours as hex strings on purpose (READ, `sdk/plugins/dtcg/src/lib.rs` 58–61, 363).
- **Modes** are `sets` (light, dark, wireframe; desktop, mobile) in the legacy files, and named axes in the new data, contrast among them as `regular` and `high` (READ, `src/color-palette.json` 11–31, `design-data/mode-sets/contrast.json`).
- **Lifecycle, the richest.** Legacy: `deprecated`, `deprecated_comment`, `renamed`, checked by a test (READ, `packages/tokens/test/checkRenamed.test.js` 16). New: `lifecycle.deprecatedIn`, `replacedBy`, and a planned removal (READ, `color-palette.tokens.json` 12–16, `design-data-spec/spec/evolution.md` 17–20).
- **Outputs.** Style Dictionary `^3.9.2`, the old major (READ, `packages/tokens/package.json` 35–36).

### Radix Themes (`1faff10`, MIT), Material Web (`37aa14b`, Apache-2.0), Skeleton (`86ed0f3`, MIT), GOV.UK Frontend (`a11bd33`, MIT)

- **No token JSON in any of them.**
- **Radix** writes tokens as CSS by hand, scoped `:root, .light, .light-theme` and `.dark`, and publishes `tokens.css` and per-colour files beside its `styles.css` (READ, `src/styles/tokens/colors/gray.css` 9–11, `scripts/build-css.js` 32–45). That is the plain-variables file this memo's question asks about.
- **Material Web** generates Sass maps from an internal tool, with `values-light()` and `values-dark()`, and keeps `$renamed-tokens` and `$unsupported-tokens` maps that warn (READ, `tokens/versions/v0_192/_md-sys-color.scss` 23, 82; `tokens/internal/_validate.scss` 32–42).
- **Skeleton** ships one CSS file per theme, oklch values, pairs joined by `light-dark()` (READ, `src/themes/cerberus.css`, `src/base/theme.css` 341).
- **GOV.UK** emits `--govuk-<name>-colour` from Sass maps, with SassDoc `@deprecated` on old variables and warnings an app can silence (READ, `settings/_colours-functional.scss` 15, `settings/_colours-legacy-functional.scss` 17–19). It has one scheme.

### What the prior art says, together (INFERRED)

1. The two systems that score 3 and 4 on tokens author DTCG directly. The one that exports DTCG (Spectrum) loses aliases on the way out.
2. Carbon's shape is the spec's shape: a palette set, one theme modifier, a context per theme. Primer's per-token override map predates the resolver.
3. A record of removed names checked in CI is Primer's alone. Spectrum's renamed field is the same idea, per token.
4. Every system that writes CSS variables also prefixes them (`--cds-`, `--govuk-`, Primer's own names). Kuiper's names are shadcn's, unprefixed, because the registry's items read them. A plain file must keep them, or the items break.
5. No clone has a Terrazzo config. Only Carbon has Style Dictionary configs, and it resolves the resolver with its own script (READ, the clones; `themes/style-dictionary/resolver.js`).

## 5. Tools that read DTCG

- **Style Dictionary.** Its docs say it has had first-class DTCG support since v4, and that full 2025.10 support "is a work in progress in v5" (READ, [styledictionary.com/info/dtcg](https://styledictionary.com/info/dtcg/)). v5.5.0 added object dimensions (READ, secondary, a dependency-bump note). A November 2025 list post said it did not yet support 2025.10 (READ, secondary, [public-design-tokens-log](https://lists.w3.org/Archives/Public/public-design-tokens-log/2025Nov/0006.html)). Carbon wrote its own resolver step on top (§4).
- **Terrazzo** (formerly Cobalt). Its parser's changelog claims full 2025.10 support, resolvers included, at 2.4.0. Its CSS plugin maps resolver contexts to selectors or media queries (READ, secondary: [the parser changelog on unpkg](https://unpkg.com/@terrazzo/parser@2.4.0/CHANGELOG.md), [the resolvers guide](https://terrazzo.app/docs/guides/resolvers/)). Not run here.
- **Tokens Studio** is named a reference implementation (READ, the announcement).

**Does Kuiper need any of them?** No (INFERRED):

- `build-tokens.ts` already writes every output, and `021` must leave those outputs byte-identical. A second builder would have to reproduce shadcn's `cssVars` shape and prettier's formatting exactly. The existing code already does.
- What is new is small: read DTCG, resolve aliases within a context, flatten two contexts, and write one more CSS file and two flattened JSON files. It uses only the types in §2, and no JSON Pointer.
- A dependency would add an input to pin and a release cycle to track, for a format the tools themselves call a work in progress.
- **One place a tool helps:** as a second reader. If an independent parser reads Kuiper's files without error, that is evidence of conformance that our own validator cannot give. It can run once, from a pinned version, outside the tree, without joining `bun.lock` (the specification's open question 4).
- **The schema, without a validator.** Carbon validates against the schemas with Ajv. Kuiper can name the schema in `$schema` for editors, and check the same rules by hand, as `validateTokens` checks the file today (INFERRED).

## 6. How modes could be shown, for Kuiper

INFERRED, from §1.8 and §4.

| | A. A resolver: a base file, a file per scheme | B. One file, dark in `$extensions` | C. One standalone file per scheme, no resolver |
|---|---|---|---|
| Conforms | Yes: the Resolver module | The light values only; dark is vendor data a tool may ignore | Yes, as two unrelated files |
| A tool reads dark | Yes, if it reads resolvers; else from a flattened file | No, unless it knows Kuiper's key | Yes |
| High contrast (`031`) | A context per scheme that layers an override file on the scheme's file, as the spec's example does | Another key per token | Two more whole files |
| Scoped schemes (`029`) | Unchanged: `029` changes the CSS, and reads the light and dark contexts as `light-dark()` pairs | Same | Same |
| One source | One directory; scheme-free tokens written once | One file | Scheme-free tokens written twice |

- A wins on conformance and on `031`. Its cost is that a role's `$description` is written in each scheme file, because the merge rule is unstated (§1.8). A test can hold the copies equal.
- Two modifiers, scheme × contrast, do not work: a modifier cannot read another, and a high-contrast value differs by scheme (READ, §1.8).
- Expressive mode is not a resolver modifier. Its values are on `:root` in both modes; only the mark's dots in dark change, which is a scheme value (READ, `build-tokens.ts`).
- A resolver-blind tool (Style Dictionary today) needs a flattened file per scheme. The build can write one per context.

## 7. What this leaves open

- The vendor key for `$extensions`. The registry's items named the author `Pluto Systems <https://plutosystems.co>` until 0.7.0 (EXECUTED, `static/v0.7.0/r/styles/maia/*.json`), so `co.plutosystems.kuiper` follows the spec's advice. Only the owner can confirm the domain.
- Whether publishing DTCG counts as "tokens as design-tool variables" on scorecard row 12 (b). No design tool was tried here, by the owner's ruling ("we design in code").
- `em`, fluid and spring values have no DTCG type. They can be `number` tokens with the unit in `$extensions`, which a reader that ignores extensions will misread. That limit belongs to the format, not to Kuiper; it is stated in each such token's `$description`.

## 8. Corrections, 2026-11-15

Added after the specification review of `021` ([`../reviews/021-tokens-for-everyone-spec-2026-11-15.md`](../reviews/021-tokens-for-everyone-spec-2026-11-15.md)), whose probes are cited as **EXECUTED (review)**. The sections above are left as written. Where they disagree with this one, this one holds.

1. **18 colours carry alpha, not 15** (§2). 15 was the count of distinct alpha values. 6 primitives and 12 glass literals are translucent: 18 of 61 (EXECUTED, recounted; EXECUTED (review)). The round trip holds for all 256 byte values, so it cannot fail for any colour (EXECUTED (review)). No colour has an `FF` alpha, and none is written in lower case.
2. **The names rule in §3 needs its scope.** Only `cssVars.light` and `cssVars.dark` keys also ship as `--color-<key>`. Applied to `cssVars.theme` keys as well, the rule counts eight phantom `--color-color-code-*` names, 32 in all, not 24 (EXECUTED (review)). Versions must be sorted as versions: as text, `v0.11.0` sorts before `v0.4.0`.
3. **The domain's history (§7).** `https://plutosystems.co` was the items' author until 0.7.0. Commit `bfbd6b6` (0.7.1, "registry author point at this repository") replaced it with the GitHub URL. Nothing current names the domain; one code sample uses `package co.plutosystems.sandbox;` (READ (review), `src/lib/preview/code-samples.ts`). So whether the company controls the domain is unconfirmed, and `co.plutosystems.kuiper` cannot be recommended on this evidence. A key the organisation verifiably holds is `io.github.plutosystemsco.kuiper` (INFERRED, the `io.github.<org>` form registries accept for GitHub-verified owners).
4. **A second modifier can work (§6).** "Two modifiers, scheme × contrast, do not work" overstates it. A modifier cannot read another, but aliases resolve after flattening (§1.8), so a `contrast` context's file may alias tokens whose values differ by scheme, and still resolve in each scheme. Which way high contrast goes is `031`'s choice.
5. **The merge rule (§1.8, §6).** The Resolver module does state a rule: merging is by token, and the last occurrence wins (§4.1.4, §6.2). Its own example layers a high-contrast file over a scheme file, which must share groups. What it leaves unsaid is only whether the later token replaces the earlier one whole or merges its properties. Root `$`-properties (`$schema`, `$description`, `$extensions`) of two layered files do collide.
6. **`em` and `vw` in extensions (§7)** break a SHOULD: the format asks that extension data be "optional meta-data that is not crucial to understanding that token's value" (READ (review), Format §5.2.3). A unit is crucial. No 2025.10 type carries these units, so it is a known breach, not an oversight.
7. **The second reader (§5).** Terrazzo CLI 2.10.0's `tz check`, given a resolver, checked only the default context: a broken alias in the dark file passed. It accepted a `dimension` in `em`. Given plain files, it caught the dark alias (EXECUTED (review)). `@terrazzo/parser` has no binary; the CLI is `@terrazzo/cli`. Ajv 8.17.1 against the two published schemas rejected the `em` dimension and accepted the specification's excerpts (EXECUTED (review)). So the schemas are the stricter check, and Terrazzo should read flattened files.
8. **Design tools that read DTCG (§7, new).**
   - **Penpot.** Its guide says its tokens "adhere to the Design Tokens Format Module", which it calls "a draft by the W3C DTCG". It imports a JSON file, a ZIP or a folder from the Tokens panel's tools, one set per file. It lists colour values as strings only: hex, RGB, RGBA, hex with alpha, HSL, HSLA. It does not mention the 2025.10 colour object or `$extensions` (READ, [help.penpot.app/user-guide/design-tokens](https://help.penpot.app/user-guide/design-tokens/), 2026-11-15). A forum thread says its export is Tokens Studio's multi-set format, not 2025.10 (READ, secondary, [community.penpot.app](https://community.penpot.app/t/token-export-is-tokens-studio-format-not-dtcg-2025-10/10544)). So a 2025.10 file may not import (INFERRED; not tried).
   - **Figma.** Native variables import and export was announced at Schema 2025. Forum posts from December 2025 report a gradual rollout, an export without descriptions, and a failed import (READ, secondary, [forum.figma.com](https://forum.figma.com/ask-the-community-7/native-variable-export-feature-47831)). No Figma help page was found that states 2025.10 support.
   - So no design tool's own documentation was found that says it imports DTCG 2025.10 files. Scorecard row 12 (b) needs an import tried and recorded, or it is a claim.
9. **The bench (§2).** `scripts/bench/pluto.ts` reads more than the words: `primitives`, `themes`, `rolesPerTheme`, `groups` and `contrastPairs` come from the old file's shape (READ (review), lines 50–61, 152–162). It counts 129 contrast pairs, taking the `forbidden` object's two keys, where §2 counts 127 rows. `020` renames it `kuiper.ts` and gives it a fallback for old commits (READ, `020` decision 13).
