# Prior art: Shopify Polaris

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** the design lead's researcher
- **Question:** What can Pluto learn from Polaris about content and voice, the docs site, tokens, patterns and governance?
- **What it blocks:** nothing. It informs later work on the voice page (`017`), the component page (`015`) and the registry's metadata.

## The licence comes first

Polaris's `LICENSE.md` grants its rights only for software that integrates with Shopify. Pluto does not. So Pluto may read Polaris and learn from it, and may reuse nothing: no code, no text, not even a close paraphrase. This memo quotes nothing. Every idea is described at the level of principle, in our own words. **Nothing here is reusable text.** A builder who writes Pluto copy writes it fresh from Pluto's own sources (`prior_art/README.md`, the `shopify-polaris` row).

## How to read this memo

Every claim carries a label.

- **READ:** a source says so. All sources were read on 2026-11-15, in the clone at commit `3f7954a`.
- **INFERRED:** our reasoning.

Two path prefixes keep citations short.

- `P/` is `context/prior_art/shopify-polaris/`.
- `S/` is `P/polaris.shopify.com/content/`, the docs site's pages.

Terms of art.

- **Content guidelines:** rules for the words inside a component, such as a button's label.
- **Lifecycle stage:** a named state a component is in, such as stable or deprecated, with rules for entering it.
- **Codemod:** a script that rewrites a codebase's source to follow an interface change.
- **Specialty token:** a token reserved for one concept, such as navigation, and used nowhere else.

## Summary

- **Polaris ties words to parts.** Each component page carries its own content guidelines, beside best practices and accessibility. Pluto's do and don't lists mix code advice and word advice (READ, §1, §2).
- **Polaris folded its voice pages into one.** Six old content pages, voice and tone and actionable language among them, now redirect to one short fundamentals page. The detail lives in mechanics (grammar, numbers, dates) and in error-message anatomy. Pluto has the short page and lacks those two (READ, §1).
- **The docs site and Pluto's are close kin.** Both generate the props table from source, build a static search index fetched on first open, and index every token. Polaris adds a per-example line on when to choose it and a status badge (READ, §2).
- **Tokens follow one name grammar.** A colour name is built as element, then role, then prominence, then state. Specialty tokens are fenced off. Pluto's names are shadcn's, and its tokens page does not state the grammar (READ, §3).
- **Governance is staged and tooled.** Five lifecycle stages each have entry rules. Releases come with codemods that leave a marked comment where a human must decide. Pluto has "since" and a careful changelog, but no status field and no machine-readable list of renames (READ, §5).

## 1. Content and voice

### What Polaris does

- **One fundamentals page** sets four principles: words are part of the design, keep it lean, sound like the reader, and lead to action. It sets a reading-level target and tells the writer to start instructions with a verb (READ, `S/content/fundamentals.mdx`).
- **Voice and tone is no longer its own page.** The site's redirects send six old pages to fundamentals, among them voice and tone, actionable language and help content (READ, `P/polaris.shopify.com/redirects.js`, lines 123–150). The fundamentals page plays tone down and puts plain, human speech first (READ, `S/content/fundamentals.mdx`).
- **Mechanics are long and specific.** The grammar page runs to about 1,380 lines. It covers capitals, links, lists, numbers, dates, times, currency, units, pronouns, each punctuation mark, and spelling. Nearly every rule is a paired do and don't (READ, `S/content/grammar-and-mechanics.mdx`).
- **Error messages have an anatomy.** An optional heading states the effect. A body says how to fix it. An optional action offers a one-step fix. Severity maps to colour. Worked pairs cover several surfaces: a form with several errors, a banner, a toast, and errors with no fix (READ, `S/content/error-messages.mdx`).
- **Naming has its own page.** It weighs descriptive names against evocative ones, sets rules for capitals and acronyms, and covers names for components and icons (READ, `S/content/naming.mdx`).
- **Inclusive language and alt text** each have a page (READ, `S/content/inclusive-language.mdx`, `S/content/alternative-text.mdx`).

### Pluto's state

- The voice page has one section on warmth and five writing rules. Each rule has a "more" and a "less" (READ, `src/routes/(site)/brand/voice/+page.svelte`).
- The rules are R23 and R24, which review holds, not the lint (READ, `context/decisions.md`, "Two writing and furniture rules join the checklist").
- Pluto has no page for mechanics, error anatomy, naming, inclusive language or alt text. The accessibility foundation page does not mention alt text (READ, a search of `src/routes/(site)/foundations/accessibility/+page.svelte`).

## 2. The docs site

### What Polaris does

- **A component page has a fixed order.** Lede, examples, props, best practices, content guidelines, related components, accessibility (READ, `S/components/actions/button.mdx`).
- **Each example declares a title and a sentence on when to choose it** in the page's front matter. The sentence is about choosing the variant, not describing it (READ, the `examples` list in the same file).
- **The props table is generated** from the TypeScript source by a script (READ, `P/polaris.shopify.com/scripts/get-props/src/get-props.ts`).
- **Status shows on the page and in search.** A page's front matter may carry a status. A banner states it and names the replacement (READ, `S/components/deprecated/toast.mdx`; `P/polaris.shopify.com/src/components/StatusBanner/StatusBanner.tsx`). Deprecated parts sit in their own nav group (READ, `S/components/deprecated/`).
- **Search is static.** A build script writes one JSON index of components, tokens, icons, foundations and patterns. The browser fetches it on first open and matches it with a fuzzy library. Results are grouped by kind, with a cap per kind. A token's name weighs most (READ, `P/polaris.shopify.com/scripts/gen-search-index.ts`; `P/polaris.shopify.com/src/utils/search.ts`).
- **Page keywords are authored but unread.** Most pages list search synonyms in front matter. The index reads them only for icons (READ, the two files above; `grep keywords` over `src/` and `scripts/`). INFERRED: the keyword lists outlived the search that used them.

### Pluto's state

- The page order is examples, usage, API, accessibility, files you own, related (READ, `src/lib/site/page/component.svelte`, `SECTIONS`).
- Usage is a "when" paragraph, then do and don't lists (READ, `src/lib/site/page/usage.svelte`). The lists mix code and words. Button's are mostly about words. Field's are mostly about props and ids, with one line on error text (READ, `src/routes/(site)/components/button/+page.svelte`; `src/routes/(site)/components/field/+page.svelte`).
- Each example has a title and a one-sentence `intro` (READ, `src/lib/site/shown-source.ts`, `ExampleMeta`).
- The API table is read from the item's source at build time (READ, `src/lib/site/api.server.ts`).
- Search is a prerendered index, fetched on first open, with token anchors (READ, `context/specifications/015-the-design-site.md`, decision 18; `src/lib/site/search/sources/tokens.ts`). It has no per-page synonyms (READ, a search of `src/lib/site/search/`).
- The registry's metadata carries `since`, `group` and `modes`, and no status (READ, `registry.json`).

## 3. Tokens

### What Polaris does

- **One prefix, one grammar.** Every token is the prefix, a group, then a name. A colour name is element, then optional role, prominence and state. A specialty token adds its concept in front (READ, `P/polaris-tokens/polaris-tokens-structure.md`).
- **State is a suffix.** Hover, active, selected and disabled are appended to the base name. Focus reuses hover plus a focus border (READ, `S/design/colors/color-tokens.mdx`).
- **Specialty tokens are fenced.** They are for their one concept only (READ, same file).
- **The size scale is numbered by a base unit.** Step 100 is 4 px. Steps between, such as 025 or 150, slot in without renaming (READ, `P/polaris-tokens/src/size.ts`; `P/polaris-tokens/src/themes/base/space.ts`).
- **A description lives with the token.** About 190 colour tokens carry one in the source (READ, `P/polaris-tokens/src/themes/base/color.ts`, 1,220 lines). The site's token table shows a preview, the value, the description and a copy button (READ, `P/polaris.shopify.com/src/components/TokenList/TokenList.tsx`).
- **A lint holds the tokens.** It groups its rules by token family: colour, space, motion, z-index and others (READ, `P/stylelint-polaris/index.js`).

### Pluto's state

- One JSON file holds primitives, light and dark themes, and groups for spacing, type, motion and more (READ, `tokens/pluto.tokens.json`).
- Role names are shadcn's: a surface and its `-foreground`, plus specialty families such as `sidebar-*` (READ, same file).
- A role's job is written in the site, not the token file. A test fails when a role has no words (READ, `src/lib/site/foundations/words.ts`).
- The literal lint, with a profile per item, already holds "tokens are the one source" (READ, `scripts/lint-literals.ts`).

## 4. Patterns

### What Polaris does

- A pattern is a goal, not a part. Each one has variants. Each variant says how it helps the reader, when to use it, which components it uses, a live preview, and things worth knowing (READ, `S/patterns/date-picking/`; `S/patterns/variant.md.template`).

### Pluto's state

- Pluto has no patterns door. Its closest kin are the `blocks` and `compositions` groups, 17 items in all (READ, `registry.json`). A block page shows a viewer in place of example frames (READ, `src/lib/site/page/component.svelte`, the `preview` prop).

## 5. Governance

### What Polaris does

- **Five lifecycle stages:** alpha, beta, stable, legacy, deprecated. Each stage lists what a part must meet to enter it, and what a user may expect while it is there (READ, `S/getting-started/components-lifecycle.mdx`).
- **Leaving is slow and announced.** A legacy or deprecated part needs a named replacement, a removal date at least a month out, warnings in use, and migration paths, manual and automatic (READ, same file).
- **Codemods per release.** A migrator holds one transform per change, named by version and kind (READ, `P/polaris-migrator/src/migrations/`). Where a transform cannot decide, it leaves a marked comment. The version guide shows how to find them and finish by hand (READ, `S/version-guides/migrating-from-v11-to-v12.mdx`; `P/polaris-migrator/src/utilities/constants.ts`).
- **The end state.** The React library is archived. Every page of the site now carries a banner saying the docs are a snapshot, and where to go instead (READ, `P/polaris-react/README.md`; `P/polaris.shopify.com/src/components/DeprecationBanner/DeprecationBanner.tsx`).

### Pluto's state

- The changelog marks each interface change and spells out the manual steps. In 0.12.0 that is a dozen removed variables, listed by hand (READ, `CHANGELOG.md`).
- The constitution forbids breaking an installed app silently (READ, `context/constitution.md`, §6).
- An app owns its copy, so there is no package to deprecate at run time (READ, §3, §4.1).

## 6. Ideas for Pluto, ranked by value over cost

All are principles to write fresh. None needs Polaris text.

1. **A "Words" list on each component that holds text** (high value, medium cost). Split Usage into how to use the part and what to write in it: its label, its error, its empty text. Each line points back to the voice rule it serves. R23 then lives where the builder is looking. Touches `015` decision 17, `src/lib/site/page/usage.svelte`, `component.svelte` and the pages of items that hold copy.
2. **An error-message anatomy on the voice page** (high value, low cost). Name the parts of a Pluto error: what happened, what to do, and an optional action. Map them onto Pluto's own error surfaces: `field`, `error-summary`, `alert` and `page-states`. Touches `017`'s voice page and `src/routes/(site)/brand/voice/+page.svelte`.
3. **State the token name grammar** (medium value, low cost). The tokens page says how a Pluto role name is built: a surface, its `-foreground`, its `-fill` or `-text` forms, and specialty families fenced to their part. Touches `src/routes/(site)/foundations/tokens/+page.svelte` and `src/lib/site/foundations/words.ts`.
4. **A short mechanics table** (medium value, medium cost). Numbers, units, dates, times, capitals for product names, and the punctuation Pluto allows. Some are settled in practice, such as sentence case and a space before a unit. Under the Brand pages' "settled only" rule, the rest go to the owner as questions. Touches `017` and the voice page; perhaps `decisions.md`.
5. **A status in registry metadata, at least "deprecated"** (medium value, medium cost). Beside `since`, an item may carry a status, a replacement and the release it leaves in. The page, search results and the changelog show it. Touches `registry.json`, `scripts/build-registry.ts`, `src/lib/site/page/facts.svelte`, `src/lib/site/search/sources/pages.ts`. Needs a specification, and perhaps an owner decision on the stage names.
6. **Example intros that say when, not what** (medium value, low cost). Each `intro` answers "when would I choose this one?". Touches `src/lib/site/examples/` and the `ExampleMeta` comment in `shown-source.ts`.
7. **A machine-readable list of renames and removals per release** (value grows with releases, higher cost). Today the changelog lists removed variables in prose. A data file could list them, and a checker could report each line in an app that still uses one. It reports and never edits, since the app owns its code. Touches `CHANGELOG.md`, `scripts/` and `/start/install/`. INFERRED: a script shipped to apps may brush §3's "not a CLI"; ask the owner first.
8. **Alt text and inclusive language on the accessibility page** (medium value, medium cost). Pluto has an `avatar`, `imagery` guidance and product icons, and no alt-text rule. Touches `src/routes/(site)/foundations/accessibility/+page.svelte`. The word list needs the owner.
9. **Goal-first block pages** (lower value, medium cost). A block or composition page opens with the job it does, when to use it, and the parts it is made of. Touches the block and composition pages under `src/routes/(site)/components/`.

## 7. Things to avoid

- **Reusing anything.** No text, no example pair, no structure copied line by line. The licence forbids it (READ, `P/LICENSE.md`).
- **A sprawling grammar.** A guide of some 1,400 lines of paired examples is hard to keep true. INFERRED: a short table that review can hold beats a reference nobody re-reads.
- **Voice split over several pages.** Polaris merged six content pages into one (READ, §1). INFERRED: keep Pluto's voice on one page, and push detail into the parts.
- **Metadata nothing reads.** Polaris's page keywords are written and ignored (READ, §2). INFERRED: add synonyms to search only with a test that the index uses them.
- **Stages tied to adoption.** Polaris's beta needs production use. Pluto's §4.2 says adoption is never a criterion (READ, `S/getting-started/components-lifecycle.mdx`; `context/constitution.md`). Package-style promises, such as breaking changes allowed in a minor release, also fit poorly when an app owns its copy (INFERRED).
- **Tools that edit app code unasked.** A codemod suits a package. Pluto's app owns its source. INFERRED: a checker reports; the app decides.
- **A state-token explosion.** Polaris's colour file runs to 1,220 lines, with dozens of fill variants per role (READ, §3). INFERRED: Pluto's smaller shadcn role set is easier to hold to AA in both themes.
