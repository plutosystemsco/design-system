# Prior art: IBM Carbon

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** the design lead's researcher
- **Question:** What can Pluto learn from IBM Carbon's tokens, components, guidelines site, motion, type and layout, and governance?
- **What it blocks:** nothing. It feeds later specifications. It commits us to nothing.

## How to read this memo

Every claim carries a label.

- **READ:** a file says so. Carbon paths are relative to `prior_art/carbon-design-system-carbon/` (commit `fa75d78`, 2026-11-13) or `prior_art/carbon-design-system-carbon-website/` (commit `5e9cd1d`, 2026-09-30), both Apache-2.0, read 2026-11-15. Pluto paths are relative to the repository root, on branch `release/0.12.0`.
- **INFERRED:** our reasoning.

This memo has no EXECUTED claims. Nothing was built or run.

An earlier memo read Carbon's public site, `2026-11-01-how-systems-separate-brand-modes-and-products.md` §2. This one reads the source. It does not repeat the type-set and inline-theme quotes found there.

Terms of art.

- **DTCG:** the Design Tokens Community Group format. A token is a JSON object with `$type`, `$value` and `$description`.
- **Resolver:** a DTCG document that lists the token files and says which files a theme combines.
- **Layer token:** a surface colour numbered by how deep it is nested: `layer-01`, `layer-02`, `layer-03`.
- **Contextual token:** an un-numbered name, such as `layer`, that points at the right numbered token for wherever it sits.
- **Zone:** Carbon's word for a region of the page that carries another theme. It is a class.
- **AVT:** Accessibility Verification Testing, IBM's three stages of accessibility checks.
- **ADR:** an architecture decision record. One numbered file per decision.

## Summary

1. **Carbon puts its accessibility test results on its docs pages, generated from the test report.** Playwright tests tagged `@avt-default-state`, `@avt-advanced-states` and `@avt-keyboard-nav` feed a status table on each Accessibility tab. So the page cannot drift from the tests. That answers the drift worry behind `015` decision 10, which left the "Checked" row out (READ, §3.3).
2. **Carbon writes down which change gets which version bump.** A table maps each kind of change, from "prop added" to "the node an `aria-label` reaches moves", to patch, minor or major. Pluto decides "interface change" case by case in each specification (READ, §5.1).
3. **Every Carbon token carries its own description, and a test fails without one.** Pluto writes each role's job in site code, `src/lib/site/foundations/words.ts`, not in the token file (READ, §1.1).
4. **Carbon's motion has three curves in each mode: standard, entrance and exit.** Exit accelerates away. Pluto has one entrance curve, and its fade-out reuses it (READ, §4.3). Carbon's micro-interactions run at 70–150 ms; Pluto's run at 200 ms.
5. **Carbon has a controlled vocabulary of action labels.** Sixty-five verbs, each with its meaning and "use instead of" notes. That is R23 ("copy says what happens") made checkable (READ, §3.5).

## 1. Tokens

### 1.1 What Carbon does

- **Three tiers, in separate packages.** The palette lives in `packages/colors/tokens/colors.tokens.json`. Theme tokens such as `background` and `text-primary` alias it, for example `{gray.80}`. Component tokens such as `button-danger-active` start with their component's name and live in a file named after it (READ, `packages/themes/tokens/README.md:33-49`, `:61-75`).
- **DTCG 2025.10, with a resolver.** `themes.resolver.json` declares one `theme` modifier with four contexts: `white`, `g10`, `g90`, `g100`. Each context lists six files. The palette resolves first (READ, `packages/themes/tokens/themes.resolver.json:13-55`).
- **Names are flat and equal the CSS name.** `layer-accent-active-03` is `$layer-accent-active-03` and `--cds-layer-accent-active-03` (READ, README `:31-40`).
- **Values move; nothing else may.** "Only `$value` differs" between themes (READ, README `:57-59`). A parity test checks that every token is kebab-case, typed and has a non-empty description (READ, `packages/themes/__tests__/theme-parity-test.js:63-77`). It also checks that tokens differ only in value (`:79`). Theme tokens must exist in all four themes; component tokens may skip one (READ, README `:149-154`).
- **Metadata rides in `$extensions`.** Each theme token names its group, the CSS `properties` it is meant for, its interaction `state` and its `layer-set` (READ, README `:128-139`).
- **The white theme has 234 tokens in 13 groups.** Layer has 29. Syntax highlighting has 88. AI has 42 (READ, counted from `packages/themes/tokens/themes/white/theme.tokens.json`).
- **Layering is contextual.** Classes `.cds--layer-one` to `-three` re-point `layer`, `field` and `border-subtle` at their numbered tokens (READ, `packages/styles/scss/_layer.scss:13-27`; `layer/_layer-sets.scss:11-40`). A zone re-emits those contextual tokens. Otherwise a custom property resolved at `:root` keeps its root value inside the zone (READ, `packages/styles/scss/_zone.scss:56-80`).
- **Contrast is prose, not measured.** The v10 metadata writes "4.5:1 AA contrast" as a role (READ, `packages/themes/src/v10/metadata.yml:12-16`). No test in `packages/themes/__tests__` or `packages/colors/__tests__` computes a ratio (READ, by grep).
- **Deprecation lives in the description.** The `layout-01` to `-07` tokens each say "Deprecated layout token … Do not use in new work" (READ, `packages/layout/tokens/layout.tokens.json:335`).

### 1.2 How Pluto compares

- One file, `tokens/pluto.tokens.json`, holds primitives, `themes.light` and `themes.dark`, the code map, size and motion groups, `expressive` and a `contrast` list (READ). That is Carbon's three tiers in one file, without DTCG `$type` or `$description` (READ).
- Pluto **measures** contrast. The token file lists the pairs, and `scripts/contrast.ts` computes WCAG ratios (READ, `tokens/pluto.tokens.json:347`; `scripts/contrast.ts:1-8`). Carbon has no such check in its token packages. Pluto is ahead here (INFERRED).
- Role jobs are written in `src/lib/site/foundations/words.ts:1-5`, and `tests/unit/tokens-pages.test.ts` fails for a role without words (READ). Carbon keeps the same words in the token itself (INFERRED: one source fewer).
- Pluto has two themes and named surfaces (`card`, `popover`, `muted`, `raised`), not numbered layers. `surface-ink` is an inline theme (READ, the token file; `static/r/styles/maia/pluto-theme.json`).

## 2. Components

### 2.1 What Carbon does

- **Variants are a closed list.** `ButtonKinds` has eight. Some join two axes in one string, such as `danger--ghost` (READ, `packages/react/src/components/Button/Button.tsx:15-24`). Sizes are `xs` to `2xl` (`:28`), matching layout size tokens from 24 to 80 px (READ, `packages/layout/tokens/layout.tokens.json`).
- **Mode is a prop.** `isExpressive` applies "only … to the large/default button size" (READ, `Button.tsx:64-66`).
- **Accessibility is enforced by warnings.** An icon with no text and no `iconDescription` logs a console error that names the screen-reader risk (READ, `Button.tsx:172-178`).
- **Tests come in three kinds.** Unit tests use Testing Library (`src/components/Button/__tests__/Button-test.js`). A snapshot fixes the public API (`packages/react/__tests__/PublicAPI-test.js`). Playwright runs visual tests in every theme and accessibility checks per story with IBM's Equal Access checker (READ, `docs/testing.md`; `e2e/components/Button/Button-test.avt.e2e.js:12-40`).
- **Done is a checklist.** Unit coverage of 80% or more, VRT on the default story, AVT on default and complex states, and manual JAWS, VoiceOver and NVDA testing (READ, website `src/pages/contributing/component-checklist/index.mdx`, the Testing table).

### 2.2 How Pluto compares

- `button` has five variants and the sizes 48 and 32 px, built with `tailwind-variants`, plus a `busy` state that keeps focus (READ, `src/lib/registry/ui/button/button.svelte:9-50`; `registry.json`, item `button`). Mode is set on a region (`data-mode`), not by a prop (READ, `015` decision 10; `meta.modes`).
- Pluto's suites are `tests/e2e/axe.spec.ts`, `keyboard.spec.ts`, `theme.spec.ts` and the unit suites (READ, `tests/`). Screen readers are not checked (READ, `015` decision 22).

## 3. The guidelines site

### 3.1 Information architecture

- Thirteen top-level sections: All about Carbon, What's happening, Designing, Developing, Contributing, Migrating, Elements, Guidelines, Components, Patterns, Community assets, Data visualization and Help (READ, `src/data/nav-items.yaml`). Elements holds grid, colour, icons, pictograms, motion, spacing, themes and type.
- Pluto has four doors and a changelog (READ, `015` decision 1).

### 3.2 The component page

- Four tabs, set in front matter: Usage, Style, Code, Accessibility (READ, `src/pages/components/button/usage.mdx:6`).
- **Usage** runs from a live demo through when to use, anatomy, sizes, emphasis, alignment, content and behaviours to a section per variant (READ, `usage.mdx:63-1180`). It is over 1,100 lines for one button.
- **Style** gives a table per variant and per state: element, CSS property, token (READ, `style.mdx:26-60`).
- **Code** links out to four Storybooks and embeds one by iframe (READ, `code.mdx:16-80`).
- **Accessibility** has three headings: what Carbon provides, design recommendations, development considerations (READ, `accessibility.mdx:24`, `:73`, `:94`).
- Pluto has one page with no tabs. Its sections are examples, usage, API, accessibility, files you own and related (READ, `015` decision 10; `src/lib/site/page/component.svelte:155-205`). Examples are files, so the code shown is the code run (READ, `015` decision 13). Pluto has no Style table.

### 3.3 The accessibility status

- The Accessibility tab ends with `<A11yStatus>` (READ, `accessibility.mdx:109`). It imports the Playwright JSON report from `@carbon/react` (READ, `src/components/A11yStatus/A11yStatus.js:18`). For each component it finds the suite, then grades each tag as tested, partial or not tested (READ, `:84-160`).
- Screen-reader status is hand-kept in `src/data/components.json` as `"manual"` per component (READ). A site page lists every component's status (READ, `A11yStatus.js:385-426`).
- Pluto rejected a "Checked" row because "copying it into the page would drift" (READ, `015` decision 10). Carbon's row is not a copy. It is read from the report at build time (INFERRED).

### 3.4 Search and agents

- Search comes from the `gatsby-theme-carbon` package, not in the clone, so it was not studied (READ, `gatsby-config.js:45`).
- Carbon runs an MCP server with four search tools, plus a "carbon-builder" skill that "lazy-load[s]" only the guidance a task needs (READ, `src/pages/developing/carbon-mcp/overview.mdx:93-110`; `token-conservation.mdx:38-45`). Access needs an IBM ID (READ, `onboarding-and-setup.mdx:23`).
- Pluto has its own prerendered search, a Markdown twin of every page and `llms.txt`. They are public and need no service (READ, `015` decisions 18 and 19).

### 3.5 Voice and content

- Content has three pages: overview (voice and tone), writing style and action labels (READ, `src/pages/guidelines/content/`). Writing style covers sentence case, no title case, no all caps, simple present tense, active voice and inclusive language (READ, `writing-style.mdx:29-463`).
- Action labels are data: 65 entries in `src/data/guidelines/glossary.js`. Each has a meaning and a note. Apply "saves changes without closing the dialog"; Back is used "instead of Previous" (READ, `glossary.js:11-13`, `:24-27`).
- ADR 5 asks for realistic example content, not "Section 1 title" or lorem ipsum. A label like "Step" can make a component look clear when its design is not (READ, `docs/decisions/0005-use-realistic-example-content-in-stories.md`).
- Pluto has R23 and R24, sentence case and a Brand voice page (READ, `015` line 240; `src/routes/(site)/brand/voice/`). It has no word list.

## 4. Motion, type and layout

### 4.1 Grid and space

- The grid has 4, 8 and 16 columns at 320, 672, 1056, 1312 and 1584 px. Margins are 0, 16 and 24 px (READ, `packages/grid/scss/_config.scss:39-63`).
- Spacing has 13 steps from 2 to 160 px, each with a description of its use. Fluid spacing is 0, 2, 5 and 10 vw (READ, `layout.tokens.json`).
- Pluto has a 4 px atom and a ladder of nine steps, 4 to 96. Its only fluid gutter is `clamp(16px, 4vw, 56px)`, in expressive (READ, token file `spacing`, `expressive.gutter`). Pluto has no grid token (READ).

### 4.2 Type

- One formula makes 23 sizes, 12 to 156 px. Each step adds 2 px, times one more every four steps (READ, `packages/type/src/scale.ts:8-14`, `:22-44`).
- Named styles pick from the scale. Productive ends `-01` on a 14 px body and expressive ends `-02` on 16 px (READ, `packages/type/src/styles.ts:72-96`). Expressive headings step up at breakpoints (READ, `:197-290`), and the fluid styles interpolate between breakpoints with `calc` on `100vw` (READ, `fluid.ts:103`).
- Pluto has five fixed sizes (12, 13.5, 16, 28, 44) and four expressive display steps on `clamp()`, up to 92, 96 and 160 px (READ, token file `type.scale`, `expressive.display.steps`). INFERRED: Pluto's scale is smaller and named by size. Carbon's is named by job. Both gate the big sizes to expressive.

### 4.3 Motion

- Six durations: fast 70 and 110, moderate 150 and 240, slow 400 and 700 ms. Each has a description of its use (READ, `packages/motion/tokens/motion.tokens.json`).
- Three curves, each in two modes. Standard is productive `0.2, 0, 0.38, 0.9` and expressive `0.4, 0.14, 0.3, 1`. Entrance starts at 0 and decelerates. Exit ends at 1 and accelerates out (READ, same file).
- Duration grows with the size or distance of the change (READ, website `src/pages/elements/motion/overview.mdx:258-264`). The checklist asks whether micro-interactions run in "90–120 ms" (READ, `:335`). Reduced motion needs a static alternative (READ, `:349-357`).
- A spike in the package names motion **surfaces** by intent: disclosure, contextual, expand and invoke. Each is a token that points at a duration and a curve, and none animates under reduced motion (READ, `packages/motion/docs/surfaces.md:1-12`, `:126-130`; `tokens/surfaces.tokens.json:5`, `:68`).
- Pluto's productive motion is 200 ms micro and a 900 ms entrance, on one curve `0.2, 0.7, 0.3, 1` (READ, token file `:242-249`). The fade-out `animate-exit` uses that entrance curve (READ, `scripts/build-tokens.ts:195-197`). Expressive names durations by intent (press 160, slide 220, busy 400, reveal 600, fill 700) and adds a spring (READ, token file `expressive.motion`). INFERRED: Pluto's expressive set is already where Carbon's surfaces spike is heading: names by intent. Pluto's productive set is thinner than Carbon's and slower at the small end.

## 5. Governance

### 5.1 Versioning and changelogs

- Packages are versioned independently (READ, `lerna.json:2`). Release notes are generated from commits (READ, `docs/release.md:190-193`).
- A table maps change to bump: prop added, minor; deprecated, minor; removed, major; type narrowed, major; type widened, minor (READ, `docs/guides/versioning.md:61-71`). Moving the DOM node an `id` or `aria-label` reaches is minor. Moving a `data-testid` is "minor, but ideally major" (READ, `:249-276`). TypeScript types "are not bound to semver" (READ, `:79-82`).
- Pluto has one version for the registry. `CHANGELOG.md` is prose, marking each **interface change** (READ, `CHANGELOG.md:3`). What counts is settled in each specification, for example `007`'s "Additive; not an interface change" (READ, `context/specifications/007-…md:35-36`).

### 5.2 Preview, deprecation and migration

- Preview code is exported with a `preview_` prefix, behind a feature flag or as a documented new prop (READ, `docs/preview-code.md:28-78`). Promotion to stable needs about three months, a consuming project's feedback, usage, style and code tabs, and tests (READ, `:80-140`).
- Statuses are Draft, Preview candidate, Preview and Stable (READ, website `component-checklist/index.mdx`, table under "Definition of done").
- A deprecated prop warns once per component (READ, `packages/react/src/prop-types/deprecate.ts`). The site's deprecations page gives each entry "What to use instead" and "Migration" (READ, website `src/pages/deprecations.mdx:28-46`).
- Pluto has `meta.since` per item (READ, `registry.json`), and its changelog says how to update by hand (READ, `CHANGELOG.md`, 0.12.0 closing paragraph). It has no deprecation path and no preview status (READ, by grep).

### 5.3 Decisions and incidents

- ADRs are numbered, proposed before decided, and kept with a link when superseded (READ, `docs/decisions/README.md`). Postmortems record an incident, its root cause and action items, for example a breaking change shipped in a minor (READ, `docs/postmortems/2019-10-07-content-switcher-breaking-change.md`).
- Pluto has `decisions.md` and `reviews/` (READ, `context/README.md`). It has no record kind for an incident (READ).

## 6. Ideas for Pluto, ranked by value over cost

1. **A written rule for "interface change".** Adapt Carbon's table to what an app owns: a prop, export, slot, class, CSS variable or `data-slot` renamed or removed; a size that changes in pixels; the node an accessible name reaches; a new dependency. Each row says "interface change" or "not", with the changelog line it needs. *Why:* the constitution forbids breaking an app silently (§6), and today each specification decides again. *Touches:* `context/README.md` conventions, `CHANGELOG.md:3`, the review template in `context/reviews/README.md`. Cost: low.
2. **Accessibility status generated from the test report.** Tag Pluto's axe and keyboard tests by item. Read Playwright's JSON report at build time. Show, per item: axe in both themes, keyboard walked, screen reader "not checked". *Why:* it answers `015` decision 10's drift worry, and it tells a reader the truth about screen readers on the page itself. *Touches:* `tests/e2e/axe.spec.ts`, `tests/e2e/keyboard.spec.ts`, `src/lib/site/page/component.svelte`, `015` decision 10. It reverses a recorded decision, so it goes to the owner as a question. Cost: moderate.
3. **Role words in the token file.** Give every role a `description` in `tokens/pluto.tokens.json`. Fail a test when one is missing. The site reads it. *Why:* "tokens are the one source"; today the token's meaning has a second source. *Touches:* the token file, `scripts/tokens.ts`, `src/lib/site/foundations/words.ts`, `tests/unit/tokens-pages.test.ts`. Cost: low to moderate.
4. **An action-label list.** About 20 to 40 verbs Pluto's products use, each with its meaning and the words not to use instead. Publish it on the Voice page; check registry descriptions and examples against it. *Why:* it makes R23 checkable by a reviewer and by search. *Touches:* `017`'s Voice page, `src/routes/(site)/brand/voice/`, the R23 review checklist. Cost: low; it is writing.
5. **An exit curve, and a look at the productive speed.** Add a productive exit that accelerates out, and use it for `animate-exit`. Measure whether 200 ms micro feels slow next to Carbon's 70–150 ms. *Why:* an exit on an entrance curve lingers at the end (INFERRED). *Touches:* the token file `motion`, `scripts/build-tokens.ts:195-197`, `/foundations/motion/`. A research memo first. Cost: low.
6. **A deprecation path for owned source.** `meta.deprecated` names the replacement and the release it goes. The item's page and the changelog say "what to use instead" and "how to move". Removal comes no sooner than the next minor. *Why:* Pluto will retire items; today it can only delete them. *Touches:* `registry.json` meta, `scripts/build-registry.ts`, `src/lib/site/page/facts.svelte`, `CHANGELOG.md`. Cost: moderate.
7. **Realistic example content.** A rule, and a lint, against "Item 1", "Option A" and lorem ipsum in `src/lib/site/examples/`. *Why:* Carbon's reason holds: a placeholder label can do the design's job. *Touches:* the examples, `015` decision 13. Cost: low.
8. **Incident records.** A dated file under `context/reviews/` when an installed app breaks: impact, cause, fix, action. *Why:* it learns from the one failure the constitution names. *Touches:* `context/README.md`. Cost: very low.
9. **Later, on need:** a generated style table per item (element, property, role), and DTCG with a resolver whose two modifiers are theme and mode. Both cost more than they return today.

## 7. Things to avoid

- **More themes than needs.** Carbon's two grey themes double its theme files and tests (READ, §1.1). Each Pluto theme multiplies the measured contrast rows. Add one only when an app needs it (INFERRED; constitution §4.2).
- **Three numbered layers.** Contextual layering solves deep nesting in dense IBM products. It costs 29 layer tokens and a cascade trap Carbon documents in its own comments (READ, `_zone.scss:56-80`). Pluto's named surfaces are enough. If Pluto adds an inline theme, it should re-declare its derived variables inside the region, as Carbon learned (INFERRED).
- **A code tab that leaves the site.** Carbon's code lives in four Storybooks, so the page and the code can disagree (READ, §3.2). Pluto's examples-as-files are stronger.
- **Tabs and very long usage pages.** The usage page for one button runs past 1,100 lines (READ). Pluto's single page, with no tabs, is the right call (READ, `015` decision 10).
- **Guidance that needs private tools or accounts.** Carbon's accessibility guide relies on IBM-only tools and links, and its MCP needs an IBM ID (READ, `docs/guides/accessibility.md`; §3.4). Pluto's checks and its agent access should stay public and runnable here.
