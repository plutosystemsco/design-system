# Prior art: GitHub Primer

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request, one of the prior-art memos of 2026-11-15.
- **Question:** What can Pluto learn from GitHub's Primer about tokens, accessibility, documentation and governance?
- **What would answer it:** a reading of Primer's token and docs repositories, set against this repository's token file, build, tests and the design site's specifications.
- **What it blocks:** nothing. It informs whichever specification next touches deprecation, token descriptions or the Foundations accessibility page.

## How to read this memo

- **READ:** a file says so, read on 2026-11-15. Primer paths are relative to `prior_art/`: `primer-primitives/` at `47736486` and `primer-design/` at `87f799f2`, both MIT (`prior_art/README.md`). Pluto paths are relative to the repository root.
- **INFERRED:** our reasoning from what we read.

Nothing was run.

Terms of art:

- **DTCG** is the W3C Design Tokens Community Group's draft format. A token is an object with `$value`, `$type`, and optionally `$description`, `$deprecated` and `$extensions`.
- **Style Dictionary** is an open-source tool that builds token JSON into CSS and other outputs.
- **A changeset** is a small file committed with a change. It names the version bump and a changelog line.
- **CVD** is colour vision deficiency. Protanopia and deuteranopia are red-green types; tritanopia is blue-yellow.

## Summary

- Primer keeps three token tiers (base, functional, component) in DTCG JSON5, built by Style Dictionary into 14 themes. A themed token is one `$value` plus a map of per-theme overrides. Pluto's one file, two themes and own build are simpler, and right for its size.
- Primer's best governance device is small: `removed.json` maps every deleted token to its replacement or `null`, and CI fails on an unlisted removal. Pluto's 0.12.0 changelog asks apps to delete a hand-typed list of CSS variables. A removed-names record would make that list generated and complete.
- Primer writes each token's job and pairing rules into the token, for people and for language models. Pluto writes role words in a site file (`src/lib/site/foundations/words.ts`), so an installing app never sees them.
- Primer's contrast policy is a table of pair classes, including the classes that need no ratio. Its high-contrast themes require 7:1 for text. Its colour-blind themes are tested for contrast only. Pluto already measures CVD distinctness for charts and code, which Primer does not.
- Primer's maturity ladder (experimental, alpha, beta, stable) gates on production use, which Pluto's constitution rules out. Its "deprecated" and "removed" stages are worth taking: name the replacement, and give notice before removal.

## 1. Tokens

### What Primer does

- **READ** (`primer-primitives/contributor-docs/adrs/adr-011-design-token-structure.md`): source tokens follow the DTCG draft. `$deprecated` holds the replacement, or `null`. Custom data sits under `$extensions` with an `org.primer.*` key.
- **READ** (`primer-primitives/contributor-docs/adrs/adr-006-naming-design-tokens.md`): three tiers. *Base* tokens are raw values (`base-color-green-5`). *Functional* tokens name a job (`bgColor-inset`). *Component* tokens are for component CSS only (`button-primary-bgColor-rest`). The tiers are folders under `src/tokens/`; there are 27 component files.
- **READ** (`adr-004-token-overrides.md`, `src/preprocessors/themeOverrides.ts`): `$value` is the light value. An `org.primer.overrides` map gives values by theme name, swapped in at build. A missing override falls back to plain light or dark (`scripts/utilities/getFallbackTheme.ts`).
- **READ** (`scripts/themes.config.ts`): 14 themes. Light, dark and dark dimmed; a high-contrast form of each; protanopia-deuteranopia and tritanopia forms of light and dark, each with a high-contrast form.
- **READ** (`package.json`, `src/platforms/`): Style Dictionary builds CSS, a docs JSON, Figma variables, TypeScript types, a Stylelint list, a deprecated-tokens JSON and an LLM guide.
- **READ** (`src/tokens/functional/color/fgColor.json5`, `scripts/buildLlm.ts`): each functional colour has a `$description` and an `org.primer.llm` block: `usage` tags and a `rules` line in RFC-style words ("MUST use for text on any emphasis background"). The build turns these into `DESIGN_TOKENS_SPEC.md`, shipped in the package.
- **READ** (`scripts/validateTokenJson.ts`, `src/schemas/`): every token file is validated against a schema per token type.
- **READ** (`primer-design/content/foundations/primitives/color.mdx`): the token docs embed Storybook stories built from the token output.

### How Pluto compares

- **READ** (`tokens/pluto.tokens.json`): one file. `primitives` are plain hex strings (`ink` is `"#0B0F17"`). `themes.light` and `themes.dark` map shadcn role names to primitive names (`primary` is `"blue"`). Further maps hold `code`, `spacing`, `type`, `motion`, `mark`, `expressive` and `contrast`. It is DTCG-like in spirit, not in keys.
- **READ** (`scripts/build-tokens.ts`): our own 882-line script writes the theme's `cssVars` into `registry.json` and writes `src/app.css`.
- **INFERRED:** primitives, roles and the component-like maps (`code`, `mark`) are Primer's three tiers without the folders. Two themes in one file do not need Style Dictionary.
- **READ** (`src/lib/site/foundations/words.ts`): each role's job is written in `ROLE_WORDS`. A role without words fails `tests/unit/tokens-pages.test.ts`.
- **INFERRED:** that test gives Primer's guarantee that every token is described. Only the place differs: Pluto's words live in the site.

## 2. Accessibility in the tokens

### What Primer does

- **READ** (`primer-primitives/contributor-docs/adrs/adr-010-color-contrast.md`): the policy is a table of pair classes. Text on any ground it may sit on, and placeholder text: 4.5:1. Focus border, the border of an empty control, and states shown together (selected beside unselected): 3:1. Links: 3:1 against surrounding text, or underlined. Disabled text, decorative text and borders, and a control's rest against its hover: none.
- **READ** (`scripts/colorContrast.config.ts`): the test is a list of foreground and background pairs, each tagged text or border. Default themes need 4.5:1 and 3:1; high-contrast themes need 7:1 and 4.5:1. Colour-blind themes reuse the default list.
- **READ** (`scripts/colorContrast.ts`): a translucent colour is composited onto its ground before it is measured.
- **READ** (`.github/workflows/a11y-contrast.yml`): on a pull request that touches tokens, CI posts a table of failures per theme and fails if any check failed.
- **READ** (`src/tokens/functional/color/fgColor.json5`, `fgColor.success`): in both colour-blind families, success turns from green to blue. The light high-contrast value is a custom hex, with an inline comment on why no scale step fitted.
- **READ** (`primer-design/content/ui-patterns/data-visualization.mdx`): Primer says there are no clear rules on contrast between chart colours.
- **INFERRED:** we found no check in Primer that two colours stay distinct under CVD simulation.

### How Pluto compares

- **READ** (`tokens/pluto.tokens.json`, `contrast`): the pairs to measure live in the token file, in classes such as `text`, `tints`, `nonText`, `field`, `glass` and `scrim`. `exceptions` gives each allowed failure its reason. `forbidden` lists combinations never to use, with their measured ratio.
- **READ** (`tests/unit/contrast.test.ts`, `tests/unit/colour.test.ts`): chart series and two code roles are measured for ΔE (a measure of colour difference) under simulated protanopia and deuteranopia.
- **READ** (a search of `tests/unit/`): we found no CVD test of `success` against `destructive`.
- **READ** (`src/app.css`): a `forced-colors` rule, and no `prefers-contrast` rule.
- **INFERRED:** Pluto's model is richer: reasons sit beside exceptions, and distinctness is measured. Primer has two things Pluto lacks: a written policy of pair classes, including those that need no ratio, and high-contrast values.

## 3. The docs

### What Primer does

- **READ** (`primer-design/content/guides/contribute/documentation.mdx`): a component page runs: description, Usage (when to use, best practices, do and don't), Anatomy, Options, Interactions, Accessibility (with "Known issues"), Related.
- **READ** (`content/components/banner.mdx`): its Accessibility section is a set of questions for the designer, such as "Where is a user's focus when the banner appears?"
- **READ** (`src/layouts/react-component-layout.tsx`): under the title sit the package version, a status label and an "accessibility reviewed" label. Props are generated; a deprecated prop is labelled "Deprecated".
- **READ** (`content/foundations/content.mdx`): the UI content guide. Voice: "clear but not cold". Ten top rules, among them active voice, sentence case, no "click here". Errors are specific, never blame, never apologise, never joke. Feedback uses the same verb as the control that caused it. Buttons and labels take no end punctuation; form labels take no colon.
- **READ** (`content/guides/contribute/documentation.mdx`): the docs voice. Imperative mood; no "easy", "simply" or "just"; no positional words ("the list below"); a publishing checklist.
- **READ** (`content/guides/accessibility/`): 15 files, among them descriptive buttons, focus management, announcements and tooltip alternatives.
- **READ** (`content/guides/accessibility/color-considerations.mdx`): it separates a normative requirement (the measured ratio) from a non-normative choice (the hue). Only the default light and dark themes must pass WCAG; dark dimmed may be low in contrast on purpose. It separates a high-contrast *theme* (GitHub's), high-contrast *mode* (an OS signal) and *forced colours* (the OS repaints everything).

### How Pluto compares

- **READ** (`context/specifications/015-the-design-site.md`, decision 10): a component page has a facts card (install, Since, Modes, "Based on"), Examples, Usage with do and don't, a generated API, Accessibility (keyboard, names and roles, limits), generated Files you own and Related. No tabs.
- **INFERRED:** the anatomy matches Primer's, less Anatomy and Options; Pluto's examples carry the options. Pluto generates more of the page.
- **READ** (`context/decisions.md`, the R23 and R24 entry): R23: active names, one name through a flow, errors that direct, empty states that invite. R24: furniture carries information.
- **INFERRED:** Primer's "same verb as the trigger" is R23's "one name through a flow". Its element rules are concrete cases R23 does not yet spell out. Its US spelling is a house choice, not a lesson.

## 4. Governance

### What Primer does

- **READ** (`primer-primitives/RELEASING.md`, `.changeset/config.json`, `.github/workflows/check_for_changeset.yml`): every pull request carries a changeset, checked in CI. A bot keeps a release pull request open. Before it merges, staff smoke-test the candidate in a consuming app.
- **READ** (`src/tokens/removed.json`, `scripts/checkRemovedTokens.ts`): every removed token maps to `null` or its replacement. CI compares token names at the merge base with today's and fails on an unlisted removal.
- **READ** (`src/tokens/component/focus.json5`, `src/platforms/deprecatedJson.ts`): a renamed token stays as an alias with `$deprecated`, and the build lists aliases in their own file.
- **READ** (`.github/workflows/diff-design-tokens.yml`): CI builds base and branch and posts the built-token difference as a comment.
- **READ** (`primer-design/content/guides/component-lifecycle.mdx`): six stages. *Alpha* needs no hard-coded values, tests and an accessibility review. *Beta* needs production use. *Stable* needs a month without breaking changes and a linter steering away from alternatives. *Deprecated* needs docs naming the alternative and a warning on use. *Removed* needs a month's notice and migration paths.
- **READ** (`content/guides/status.mdx`): a status page lists every component's stage and accessibility review.
- **READ** (`src/layouts/react-component-layout.tsx`): a deprecated page says "Please consider using an alternative", naming none. **READ** (`content/deprecated-components/flash.mdx`): a hand-written one names Banner.

### How Pluto compares

- **READ** (`CHANGELOG.md`): one hand-written changelog; an interface change is marked. The 0.12.0 entry ends with 12 variable names an app must delete by hand from three places, because "the CLI never deletes a variable the new theme lacks".
- **READ** (`context/constitution.md`, §6 and §4.2): never break an installed app silently. An app's adoption is never a criterion.
- **READ** (`registry.json`): item `meta` holds `group`, `since`, `modes` and `stock`. No status.
- **INFERRED:** alpha and beta rest on production use, so they have no place here. Deprecation and removal do.

## Ideas for Pluto, ranked by value over cost

1. **A removed-names record, checked against the last tag.** A map in the token file of every CSS variable and utility that leaves `pluto-theme`, to `null` or its replacement. A unit test compares names built at the previous tag with today's and fails on an unlisted removal. The changelog's deletion list is generated. *Why:* one missing name leaves a stale variable in every app; this serves §6. *Touches:* `tokens/pluto.tokens.json`, `scripts/build-tokens.ts`, `tests/unit/`, `CHANGELOG.md`. Cost: low.
2. **Deprecation for items and props, naming the replacement.** A `deprecated` entry in an item's `meta`: the replacement and the release that removes it. The facts card shows it; the generated API marks a deprecated prop. A deprecation without a replacement fails a test. Removal waits at least one release. *Why:* a notice that names nothing fails R23's "errors that direct". *Touches:* `registry.json`, `scripts/build-registry.ts`, `015` decisions 10 and 14. Cost: low.
3. **Role words and pairing rules in the token file.** Move `ROLE_WORDS` into the token file, and add a pairing rule per role ("text on `primary` takes `primary-foreground`"). The token page, `llms.txt` and a comment in the installed `app.css` read it. *Why:* the words reach the app and its agents, not only the site. *Touches:* `tokens/pluto.tokens.json`, `scripts/tokens.ts`, `src/lib/site/foundations/words.ts`, `015` decision 19. Cost: medium.
4. **The contrast policy as pair classes.** On the Foundations accessibility page, a table of every class the token file measures, with its ratio and WCAG basis, plus the classes that need none: disabled, decorative, a control's rest against its hover. Then check one class Pluto may lack: states shown together, at 3:1. *Why:* it makes the `contrast` map readable and explains the absent pairs. *Touches:* `src/routes/(site)/foundations/accessibility/`, the token file's `contrast`. Cost: low.
5. **Status colours under CVD.** Measure `success`, `destructive` and `caution` against each other under protanopia and deuteranopia, as the charts are. Where close, each state names itself in words, as the alert and badge already do. *Why:* Primer adds themes to solve this; Pluto can prove its two themes safe instead. *Touches:* `tests/unit/contrast.test.ts`. Cost: low.
6. **R23 made concrete.** Add element rules to the review checklist and the voice page: no end punctuation on buttons; no colon after a form label; errors say what to do and never blame or apologise; no "click here", "simply" or "the list below". *Why:* reviewers apply R23 by judgement; cases make reviews agree. *Touches:* the R23 entry in `context/decisions.md` (an owner decision), `src/routes/(site)/brand/voice/`. Cost: low.
7. **Theme, mode and forced colours, explained.** One section saying what Pluto supports: two themes, no high-contrast theme, forced colours honoured. *Touches:* `src/routes/(site)/foundations/accessibility/`. Cost: low.
8. **A built-token diff for the change review.** A script printing each CSS variable whose resolved value changed since the last tag, by theme. *Why:* 0.12.0's yellow and code-ground changes were described by hand. *Touches:* `scripts/`, `context/reviews/README.md`. Cost: medium.
9. **High-contrast values, only on need.** A third value set under `prefers-contrast: more`, at Primer's 7:1 text and 4.5:1 edges. *Why:* the one accessibility feature Primer has that Pluto lacks. Cost: high. It needs a placeholder memo and an owner question first (§4.2).

## Things to avoid

- **A theme matrix.** A high-contrast colour-blind theme falls back to plain light or dark, not to high contrast (`getFallbackTheme.ts`), so overrides repeat: `fgColor.muted` lists one value under three high-contrast names. INFERRED: upkeep grows with each theme.
- **Raw values inside overrides.** Primer's light high-contrast success is a hex outside its scale. Pluto's roles name primitives, and its exceptions carry reasons. Keep both.
- **Prose rules apart from tested data.** `DESIGN_TOKENS_GUIDE.md` says never to put muted text on the muted ground, yet `colorContrast.config.ts` requires that pair to pass. INFERRED: prose drifts from data; generate it (idea 3).
- **A maturity ladder gated on adoption.** The constitution rules adoption out.
- **A deprecation notice that names nothing.**
- **Unpinned build inputs.** Primer's docs fetch component metadata from `unpkg.com` with no version (`primer-design/gatsby-node.esm.js`). Pluto's site generates from this repository only.
- **Sending readers to outside contrast checkers.** Primer's docs point to WebAIM. Pluto's figures come from `scripts/contrast.ts`.
- **Staff-only links in public docs.** `015` decision 17 already rules them out.
- **DTCG or Style Dictionary wholesale.** INFERRED: for one file and two themes, renaming every key buys interoperability Pluto does not use, at the cost of the build and its tests. Borrow single keys, such as a description or a deprecation, when a specification needs them.
