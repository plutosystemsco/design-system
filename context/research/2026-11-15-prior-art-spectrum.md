# Prior art: Adobe Spectrum's design data

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** the design lead's researcher
- **Question:** What can Pluto learn from how Adobe Spectrum keeps its design data: tokens, schemas, validation, distribution, component data and colour?
- **What it blocks:** nothing. It informs a later specification on token change records and release diffs.

## How to read this memo

Every claim carries a label.

- **READ:** a source says so. Spectrum sources are files in the clone `context/prior_art/adobe-spectrum-design-data/` at commit `b2369819` (Apache-2.0), read on 2026-11-15. Paths below are relative to that clone unless they start with `tokens/`, `scripts/`, `src/`, `tests/`, `registry.json` or `CHANGELOG.md`, which are this repository's.
- **EXECUTED:** we ran a read-only count over the clone's JSON and saw the number.
- **INFERRED:** our reasoning.

Terms of art.

- **Design data:** a design system's decisions kept as machine-readable files, not prose. Tokens are one kind; component descriptions are another.
- **Mode set:** Spectrum's name for one axis of variation, such as light and dark. Each axis has a list of modes and a default.
- **Cascade:** Spectrum's rule for choosing one value when several tokens match a context. It is borrowed from CSS's idea of layers and specificity.
- **Name object:** a token's name stored as fields (component, property, state, colour scheme) instead of one hyphenated string.
- **UUID:** a random, permanent identifier. Spectrum gives one to every token row so a rename can be tracked.
- **Semantic diff:** a comparison of two releases that understands tokens, so a rename reads as a rename, not as a deletion plus an addition.
- **Conformance fixture:** an input paired with the output or error a correct tool must give.

## Summary

- **Spectrum's data is built for change over time; Pluto's is built for the present** (READ, `packages/design-data-spec/spec/evolution.md`, `diff.md`). Every Spectrum token row carries a UUID and an optional lifecycle (introduced, deprecated in, replaced by, planned removal). A diff engine classifies each release's changes into six kinds. Pluto's token file has no names for the past, and its changelog's lists of renamed and removed variables are written by hand (READ, `CHANGELOG.md`).
- **Spectrum declares its axes as data** (READ, `packages/design-data/mode-sets/*.json`). Colour scheme (light, dark, wireframe), scale (desktop, mobile) and contrast (regular, high) each have a file with modes and a default. Pluto's two themes are parallel maps that a test keeps equal; its productive and expressive modes are not an axis but an added group (READ, `tokens/pluto.tokens.json`, `tests/unit/tokens.test.ts`).
- **Validation is two layers plus fixtures** (READ, `packages/design-data-spec/README.md`, `rules/rules.yaml`). JSON Schemas check shape. A catalogue of 91 rules, each with a stable id such as `SPEC-001`, checks meaning. 87 of them have a folder of invalid inputs with the expected error (EXECUTED, `ls conformance/invalid`). Pluto's validator is hand-written and its tests are close in spirit, but its rules have no ids and no list (READ, `scripts/tokens.ts`).
- **Component data is rich but mostly ahead of its consumers** (READ, `packages/design-data/components/button.json`, `spec/component-visuals.md`). A Spectrum component file holds options, option constraints, anatomy, states, slots, token bindings, accessibility and the implementations on each platform. Pluto reads each item's API from its own source at build time, which suits a system whose code is the product (READ, `src/lib/site/api.server.ts`).
- **Pluto is ahead on contrast evidence** (READ, `docs/s2-docs/foundations/color/colors.md`; schemas searched, §5). Spectrum's scales come from Adobe's Leonardo tool with a target contrast per step, but the data keeps only the resulting colours, not the ratios. Pluto's token file names every pair it promises, with its exceptions and forbidden pairs, and tests recompute each ratio (READ, `tokens/pluto.tokens.json` `contrast`, `tests/unit/contrast.test.ts`).

## 1. Token data

**What Spectrum does.**

The canonical data is `packages/design-data/tokens/`, eight `.tokens.json` files, each a JSON array of token objects (READ, `packages/design-data/README.md`). The older npm package, `packages/tokens/src/`, is now generated from it and kept for existing consumers (READ, `packages/tokens/README.md`).

Each token has a name object, a `$schema` that names its value type, a value or an alias, and a `uuid` (READ, `spec/token-format.md`). The name fields come from a declared catalogue, one file per field in `packages/design-data/fields/`. Each field says whether it is semantic or a mode-set axis, which vocabulary it draws on, and where it sits when the name is written out as a string (READ, `fields/contrast.json`). The vocabulary itself lives in `packages/design-data/registry/` (READ).

Naming has three layers: which concepts a name holds, which words name them, and how a platform formats them; only the last may differ per platform (READ, `spec/taxonomy.md`).

Tiers show in the file names: a private palette, a semantic palette, role aliases and component tokens (READ, `packages/design-data/README.md`). Palette rows are marked `private` (READ, `color-palette.tokens.json`).

Sets are rows, not nested objects. A colour with light, dark and wireframe values is three rows. They share a `conceptId` and each has its own `uuid` (READ, `spec/token-format.md` "Concept identity"). An alias stores the target's UUID in `$ref`, so it survives a rename (READ, same, "Alias").

Deprecation is a nested `lifecycle` with `deprecatedIn`, `deprecatedComment`, `replacedBy` (one UUID, or several for a split) and `plannedRemoval` (READ, `spec/token-format.md` "Lifecycle and metadata").

Counts (EXECUTED, over `packages/design-data/tokens/*.tokens.json`): 2,523 rows, 1,285 distinct concepts, 715 aliases, 1,115 private rows, 424 with a lifecycle, and only 106 with a description. Light, dark and wireframe each have 496 rows; desktop and mobile each 246; no row sets `contrast: high`. The package README claims 4,166 cascade tokens (READ, `packages/design-data/README.md`). We cannot reconcile the two; the README may count differently or be stale (INFERRED).

**Pluto's state.**

`tokens/pluto.tokens.json` holds 48 primitives (hexes), two theme maps of 61 roles each that name primitives, a code map that names roles, and number groups for radius, spacing, type, motion, mark, focus and elevation (READ). It is a bespoke shape, not DTCG: values are bare strings and numbers, with no `$value` or `$type` (READ). Primitives never reach an app; only roles become CSS variables (READ, `CHANGELOG.md` 0.12.0). That matches Spectrum's `private` flag in spirit (INFERRED).

The expressive mode is a separate `expressive` group, not a second value per role (READ, `tokens/pluto.tokens.json`). A role's meaning in words lives in the site's code, `src/lib/site/foundations/words.ts`, and a test fails if a role has no words (READ). Nothing in the token file records a past name.

## 2. Schemas and validation

**What Spectrum does.**

`packages/design-data-spec/` holds the spec in prose (`spec/`), JSON Schemas (`schemas/`, 22 files: token, mode set, component, anatomy part, accessibility, manifest and more), the rule catalogue (`rules/rules.yaml`) and conformance fixtures (`conformance/`) (READ, its README).

Each rule has an id, a name, a severity (error or warning), a category, the assertion, a message template, a link to the spec section, and the version it arrived in (READ, `rules/rules.yaml`). Examples: alias target exists, alias types match, no alias cycles, UUIDs unique, every mode set's default is one of its modes, a replacement must point at a real token.

Rules have folders, `conformance/invalid/SPEC-NNN/`, each holding a bad input and the expected error (READ, `conformance/invalid/SPEC-001/`). Diffs and generated output have fixtures too (READ, `conformance/diff/`, `conformance/generation/`).

Tightening a rule from warning to error is a major version change (READ, `spec/evolution.md`).

The older package keeps plain unit tests, such as every `renamed` target exists and light and dark values differ (READ, `packages/tokens/test/checkRenamed.test.js`, `checkSetsUnique.js`).

**Pluto's state.**

`scripts/tokens.ts` validates the file by hand and throws an error that names the key at fault (READ, its header). `tests/unit/tokens.test.ts` checks counts, shapes and a set of "rejects" cases, each feeding a bad file to the validator (READ, e.g. "fails with the key at fault", "rejects an elevation off the ladder"). The two themes are kept equal by a test, "both themes name the same 61 tokens" (READ). These are rules in all but name. They are scattered across `describe` blocks and cited to specification decisions, not to a list (INFERRED).

## 3. Distribution and versioning

**What Spectrum does.**

Two npm packages carry the data. `@adobe/spectrum-tokens` (version 15.7.0) is built with Style Dictionary into `dist/json/variables.json` (READ, `packages/tokens/package.json`, `tasks/buildSpectrumTokens.js`). `@adobe/spectrum-design-data` exposes the cascade arrays by path (READ, `packages/design-data/README.md`). Generated output must be byte-identical on every run (READ, `spec/evolution.md`).

Each implementation has a platform manifest that pins a foundation version and states its formatting, such as the CSS prefix `--spectrum-` (READ, `platforms/web-components/manifest.json`). A platform can add its own tokens under `extensions/` and narrow the modes it supports (READ, `platforms/README.md`). A Rust SDK, with DTCG and Figma exporters as plugins, and MCP servers for agents expose the same operations (READ, `sdk/plugins/PLUGINS.md`, `spec/agent-surface.md`).

Versioning is semver with written criteria. Adding a token or changing a value on purpose is minor. Deleting a token or changing its value type is major. A rename first deprecates the old name and makes it an alias of the new one (READ, `packages/tokens/README.md`). A deprecated token stays at least two minor versions (READ, `spec/evolution.md` "Migration windows").

The semantic diff matches tokens across releases by UUID first, then by equal name objects, then by a replacement link. It sorts every token into one of six classes: renamed, deprecated, reverted, added, deleted, updated. Updated tokens get leaf-level change records (READ, `spec/diff.md`). `tools/diff-generator` implements it; `tools/token-changeset-generator` turns its report into a release note with a suggested bump (READ, each README).

**Pluto's state.**

`scripts/build-tokens.ts` writes the theme item's CSS variables into `registry.json` and writes `src/app.css`, formatted, and only when the content changes (READ, its header). An app copies the result through shadcn-svelte's `add` (READ, `AGENTS.md`). That is deterministic output too (INFERRED).

There is no diff between releases. The 0.12.0 changelog lists, by hand, every removed and renamed variable, and tells the reader which lines to delete, because "the CLI never deletes a variable the new theme lacks" (READ, `CHANGELOG.md`). A removed variable is marked **interface change** (READ, same). The rule exists; only the evidence is manual (INFERRED).

## 4. Component data

**What Spectrum does.**

`packages/design-data/components/button.json` holds the description, guideline blocks, options with types and defaults, option constraints, slots, anatomy parts (with what each contains and the states in which it appears), states with their triggers, token bindings, accessibility, and its implementations in React Spectrum and Spectrum Web Components (READ).

Constraints say "when this option has this value, that option must have one of these", at error or advisory severity. The docs use them to grey out impossible combinations; a renderer skips them in a variant matrix (READ, `spec/option-constraints.md` "Consumers"). Accessibility records the role, keyboard intents and the WCAG criteria that apply (READ, `spec/accessibility.md`; `button.json`).

`relationships/` binds components to tokens by UUID. `visuals/` holds renderer-neutral recipes for a few components, still a draft (READ, `spec/component-visuals.md` "Status"). `changelog/<component>.json` is generated per component. It classifies each change as visual, API, documentation or metadata, and derives a component version from them: removal or rename is major, addition is minor, value change is patch (READ, `spec/component-changelog.md`).

**Pluto's state.**

Each registry item carries a description and a `meta` with `since`, `group`, `modes` and the stock item it came from (READ, `registry.json`, item `button`). Its API table is parsed from the component's own Svelte and TypeScript source, so it cannot drift from what an app installs (READ, `src/lib/site/api.server.ts` header). Each page is twinned as Markdown and listed in `llms.txt` (READ, `CHANGELOG.md` 0.12.0). There is no declared anatomy, constraint or accessibility data per item.

## 5. Colour

**What Spectrum does.**

Colours are generated with Leonardo, Adobe's open-source contrast-based colour tool. Designers give key colours and hue ranges and a target contrast ratio for each step (READ, `docs/s2-docs/foundations/color/colors.md`). Scales are indexed by number (`blue-100` … `blue-1600`), and guidance is written against the index, such as the 100 step for a two-tone background (READ, same). The target is WCAG 2.2 AA: 4.5:1 for text, 3:1 for non-text (READ, `docs/s2-docs/foundations/color/grays.md`).

The data keeps the colours, not the targets. No schema or token holds a contrast ratio or a required pair (READ, `grep` over `packages/design-data-spec/schemas/`: contrast appears only as a mode-set field). The `high` contrast mode is declared and used by no row (EXECUTED).

**Pluto's state.**

Pluto has no ramps. It has four brand hues with a hand-tuned "lifted" partner for dark, plus grounds and inks (READ, `tokens/pluto.tokens.json`). Its token file holds the contrast promise as data: text and non-text pairs, recorded exceptions with reasons, forbidden pairs, and sets for fields, glass and the scrim (READ, `contrast` group). `scripts/contrast.ts` computes WCAG ratios, truncated, never rounded up, compositing alpha over its ground (READ, its header). `tests/unit/contrast.test.ts` recomputes every row (READ).

## Ideas for Pluto, ranked by value over cost

1. **A token diff between releases, with a test that the changelog names it.** Adopt the semantic diff's idea, small. A script compares the CSS variables the theme item ships at the last tag with those built now. It reports variables added, removed, and changed in value, per theme. A test fails if a removed variable is missing from the release's changelog bullet, and it can print the "delete these lines" list the 0.12.0 entry wrote by hand. Why: the constitution forbids breaking an app silently (§6), and today the proof is a person's care. Cost: one script, one test, no format change. Touches a new specification, `scripts/` (a new diff script reading `registry.json` at a git tag), `CHANGELOG.md` and `tests/unit/`.

2. **A record of retired names in the token file.** Adapt Spectrum's lifecycle, without UUIDs. A small group maps each retired role or CSS variable to its successor, or to nothing, with the version and a reason. The validator checks that a successor exists, as Spectrum's rename test does. The diff in idea 1 reads it, so a rename is reported as a rename. Optionally the build keeps the old variable for one minor release as `var(--new)`, so an app that updates is not broken. Why: Pluto has about a hundred names; a rename map does what UUIDs do at that size. Touches `tokens/pluto.tokens.json`, `scripts/tokens.ts`, `scripts/build-tokens.ts`, and specification `001`'s successor.

3. **Named validation rules, each with a bad fixture.** Adapt the rule catalogue. Give each check in `scripts/tokens.ts` a short stable id and one line of intent, listed in one place. Each id has at least one "rejects" test. Why: the rules already exist across `tests/unit/tokens.test.ts`; naming them makes an error message point at the rule and its decision, and shows which have no negative test. Cost: low. Touches `scripts/tokens.ts`, `tests/unit/tokens.test.ts`.

4. **Each role's words beside its value.** Spectrum keeps `description` on the token, though few have one. Move `ROLE_WORDS` from `src/lib/site/foundations/words.ts` into the token file, and emit each as a comment in `src/app.css`. Why: the app owns `app.css`; a reader there sees what `--muted` is for without the site. Cost: low. Touches `tokens/pluto.tokens.json`, `scripts/tokens.ts`, `scripts/build-tokens.ts`, `tests/unit/tokens-pages.test.ts`.

5. **Accessibility and option constraints in an item's `meta`.** Adapt Spectrum's per-component accessibility record (role, keyboard actions, WCAG criteria) and its "when this, then that" constraints. The site's Accessibility section and examples read them, and a test checks that every interactive item declares its keys. Why: §4.4 requires keyboard use; today that is shown per page, not declared. Cost: medium, across 75 items. Do it only when a page or test needs it. Touches `registry.json` via `scripts/build-registry.ts`, the component page template.


## Things to avoid

- **A UUID on every row.** Spectrum needs 2,523 rows and 1,285 concept ids to track renames (EXECUTED). Pluto's ~110 names are better served by a rename map (idea 2) (INFERRED).
- **Changing the token format in mid-life.** Spectrum now runs two formats, a generator between them, a round-trip guard and a migration policy for thin names, 6% of which still hold a whole legacy key (READ, `packages/design-data/README.md`). Pick Pluto's shape once, and add fields, not formats (INFERRED).
- **Axes declared before need.** The `high` contrast mode exists with no data (EXECUTED). Pluto adds an axis when an app needs it (constitution §4.2).
- **A data model ahead of its consumers.** Anatomy and states are stubs in the format spec; visual recipes are a draft (READ, `spec/component-format.md`, `spec/component-visuals.md`). Pluto's API read from source is the right default for source, not package (INFERRED).
- **Tool sprawl.** The clone holds 26 tool directories, a Rust SDK, several MCP servers and a sunsetting sync from Token Studio (EXECUTED, `ls tools`; READ, `docs/token-studio-sunset.md`). Pluto has one consumer path and should keep one script per job (INFERRED).
- **Giving up the contrast record for a generator.** A ramp tool can target ratios, but Spectrum's data loses them. If Pluto ever generates colour, the measured pairs stay in the token file (INFERRED).
