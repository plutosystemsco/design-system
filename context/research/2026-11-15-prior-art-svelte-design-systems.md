# Prior art: Svelte design systems

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request, for the owner.
- **Question:** The owner asked about "other svelte [design] systems". Which open-source design systems and component libraries built in Svelte are strongest today, and what can Pluto learn from them?
- **What would answer it:** a survey of current candidates checked on GitHub; shallow clones of the best few, read for tokens, idiom, accessibility, docs and distribution; ideas ranked by value over cost.
- **What it blocks:** nothing. It may seed later specifications.

## How to read this memo

- **READ:** a source says so. Clones are cited by path under `context/prior_art/`, at the commits in [`../prior_art/README.md`](../prior_art/README.md). Stars, pushes, releases and licences came from the GitHub API on 2026-11-15. Web pages were read the same day and are linked.
- **EXECUTED:** run and seen here. Only `git clone --depth 1` and API queries were run. Nothing was installed, built or served.
- **INFERRED:** reasoning from the above.

Terms:

- **Headless:** a library that ships behaviour, focus and ARIA attributes (the roles and states a screen reader reads), but no styles.
- **`child` snippet:** Bits UI's way to let the caller render the element. The part hands its merged attributes to a snippet, and the caller spreads them on its own element. Ark calls it `asChild`; Skeleton calls it `element`.
- **Attachment:** Svelte 5's `{@attach}`, a function run when an element mounts. It can travel inside a spread of props, under a key made by `createAttachmentKey`.
- **Builder:** Melt's name for a class that holds a widget's state and hands out attribute objects to spread.
- **Copy-the-source:** the shadcn model. An app pulls an item's files into its tree and owns them.

## Summary

- **Bits UI is still the right base, and the best-kept Svelte 5 headless layer.** It released 2.21.0 on 2026-11-11, and its tests are deep browser behaviour tests (READ). Pluto gains nothing by moving to Melt, Ark or Zag. It gains by documenting more of what Bits UI already exposes.
- **The strongest accessibility habit is one source for behaviour, both rendered and tested.** Ark draws its keyboard tables from structured data (READ). Stack Overflow's Stacks runs axe over every variant in light, dark and two high-contrast modes (READ). Pluto writes its keyboard notes by hand. Its axe suite scans pages at three widths, but no theme loop was found in it (READ, a grep).
- **Tailwind 4 theming has converged on CSS variables, scoped by attribute, with paired foregrounds.** Skeleton and daisyUI also put both modes in one variable with `light-dark()`, so any subtree can set its own scheme (READ). Pluto's `.dark` class cannot do that. Specification 015 had to route round it (READ).
- **The best docs sites now serve agents too.** Bits UI, Skeleton and Stacks serve `llms.txt` and Markdown twins, as Pluto already does (READ). Ark adds an MCP server. shadcn-svelte-extras adds an agents page (READ).
- **No public company ships a copy-the-source Svelte system.** Stack Overflow's Stacks is the one live company system with a Svelte 5 package. It is a package over a global stylesheet (READ). Appwrite's Pink is archived (READ). The registry model is community-led, so Pluto's position is unusual and worth keeping (INFERRED).

## The landscape

"Native" means written in runes (`$props`, `$state`, snippets), not only running under Svelte 5 (READ, GitHub, 2026-11-15).

| Rank | Project | Stars | Last release | Svelte 5 | Licence | Strength |
|---|---|---|---|---|---|---|
| 1 | [Bits UI](https://github.com/huntabyte/bits-ui) | 3,664 | 2.21.0, 2026-11-11 | Native | MIT | Pluto's headless layer; deep behaviour tests. **Cloned.** |
| 2 | [Ark UI](https://github.com/chakra-ui/ark) (Svelte) | 5,471 (all frameworks) | `@ark-ui/svelte` 5.25.1, 2026-11-02 | Native | MIT | Axe in unit tests, keyboard tables from data, an MCP server. **Cloned.** |
| 3 | [Skeleton](https://github.com/skeletonlabs/skeleton) | 6,090 | 5.0.4, 2026-11-08 | Native | MIT | The fullest Tailwind 4 theme system; theme generator. **Cloned.** |
| 4 | [Stacks](https://github.com/StackExchange/Stacks) (Stack Overflow) | 681 | `stacks-svelte` 1.0.4, 2026-09-28 | Native | MIT | A company system: ADRs, axe across four colour modes, brand and copy guides. **Cloned.** |
| 5 | [shadcn-svelte-extras](https://github.com/ieedan/shadcn-svelte-extras) | 611 | none on GitHub; pushed 2026-11-04 | Native | MIT | A third-party copy-the-source registry. **Cloned.** |
| 6 | [Melt](https://github.com/melt-ui/next-gen) | 332 | 0.44.0, 2026-01-04; pushed 2026-11-10 | Native | MIT | Runes builders over native `<dialog>` and popover. **Cloned.** |
| 7 | [Carbon Components Svelte](https://github.com/carbon-design-system/carbon-components-svelte) | 2,926 | 0.114.1, 2026-11-14 | Runs on 5; Svelte 4 syntax (`export let`, `src/Button/Button.svelte`) | Apache-2.0 | IBM's port; docs by `sveld`; Playwright axe. |
| 8 | [Flowbite-Svelte](https://github.com/themesberg/flowbite-svelte) | 2,792 | 1.33.1, 2026-04-07 | Native, Tailwind 4 | MIT | Breadth; quiet since June. |
| 9 | [SMUI](https://github.com/hperrin/svelte-material-ui) | 3,444 | packages at 9.0.6 | Native | Apache-2.0 | Material for Svelte. |
| 10 | [LayerChart](https://github.com/techniq/layerchart) | 1,371 | 2.10.1, 2026-11-12 | Native | MIT | Charts; Pluto already uses it. |
| 11 | [Svelte UX](https://github.com/techniq/svelte-ux) | 1,129 | 1.0.11, 2026-08-20 | 2.0 still `next` | MIT | App toolkit. |
| 12 | [daisyUI](https://github.com/saadeghi/daisyui) | 42,846 | 5.8.1, 2026-11-15 | Not Svelte (CSS) | MIT | Tailwind 4 theme plugin; nestable `data-theme` ([docs](https://daisyui.com/docs/themes/)). |
| 13 | [`sv`](https://github.com/sveltejs/cli) | 513 | 1.4.0, 2026-11-14 | n/a | MIT | Community add-ons edit an app's files ([docs](https://svelte.dev/docs/cli/community/llms.txt)). |
| — | [Melt UI](https://github.com/melt-ui/melt-ui) classic | 4,199 | 0.86.6, 2025-03-28 | Store era | MIT | Superseded by Melt. |
| — | [Park UI](https://github.com/chakra-ui/park-ui) | 2,384 | 2024-11-22 | **None**: react, solid, vue only | MIT | Out. |
| — | [svelte-headlessui](https://github.com/rgossiaux/svelte-headlessui) | 1,791 | pushed 2024-03 | No | MIT | Stale. |
| — | [Sveltestrap](https://github.com/bestguy/sveltestrap), [Attractions](https://github.com/illright/attractions) | 1,293; 1,018 | — | No | MIT | Archived. |
| — | [Appwrite Pink](https://github.com/appwrite/pink) | 522 | — | — | MIT | Company system; archived 2026. |
| — | [designsystemet-svelte](https://github.com/ensolabs/designsystemet-svelte) | 0 | pushed 2026-11-05 | Native | none detected | Wrappers for Norway's public-sector system. |

**Why the cut fell here** (INFERRED). Each clone is native Svelte 5, was pushed this month, and teaches something distinct:

- Bits UI is Pluto's base.
- Ark is the most rigorous on accessibility.
- Skeleton is the fullest on Tailwind 4 theming.
- Stacks is the only live company system.
- shadcn-svelte-extras is the only mature third-party registry.
- Melt shows the native-platform path.

Carbon and Material are already cloned at their source, and Carbon's port is still in Svelte 4 syntax. Flowbite-Svelte is a styled package with nothing distinctive for a registry.

Scores for the clones, 1 (weak) to 3 (strong) (INFERRED from what follows):

| | Tokens and theming | Accessibility | Docs site | Svelte 5 idiom | Registry relevance |
|---|---|---|---|---|---|
| Bits UI | 1 (headless) | 3 | 3 | 3 | 3 |
| Ark UI | 1 (headless) | 3 | 3 | 2 | 2 |
| Skeleton | 3 | 2 | 3 | 2 | 1 |
| Stacks | 3 | 3 | 2 | 2 | 1 |
| shadcn-svelte-extras | 1 | 1 | 2 | 3 | 3 |
| Melt | 1 (headless) | 2 | 2 | 3 | 2 |

## The cloned systems

### Bits UI

- **Theming.** None by design: "almost zero styles" (READ, `huntabyte-bits-ui/docs/content/styling.md`). State shows as data attributes. Some parts set CSS variables, such as a nested dialog's depth (READ, `docs/src/lib/content/api-reference/dialog.api.ts`).
- **Idiom.** Each part is a thin component over a state class in a `.svelte.ts` file. `ref` is `$bindable` and ids come from `$props.id()`. Props are merged, then rendered as the default element or through `child` (READ, `packages/bits-ui/src/lib/bits/dialog/components/dialog-trigger.svelte`). Refs ride in the spread as attachments (READ, `bits/tabs/tabs.svelte.ts`). `BitsConfig` sets defaults, such as the portal target and locale, for a subtree (READ, `docs/content/utilities/bits-config.md`).
- **Accessibility.** Vitest runs in browser mode on Playwright (READ, `tests/vite.config.ts`). The dialog suite alone has 51 cases (EXECUTED, a count of `it(` in `tests/src/tests/dialog/dialog.browser.test.ts`). They cover focus trap and return, Escape, outside click, nesting, portals, shadow roots and `aria-describedby`. No axe was found (READ, a grep). The rigour is in behaviour, not scans.
- **Docs.** Each page is mdsx (Markdown with Svelte): a preview, then Overview, Key Features, Architecture, Structure and behaviour guides (READ, `docs/content/components/dialog.md`). API tables are hand-written schemas typed against the package's prop types, so a missing prop fails the type check. They list props, data attributes and CSS variables (READ, `dialog.api.ts`; `docs/src/lib/content/utils.ts`). Every page has an `llms.txt` twin and a "Copy Markdown" button (READ, `docs/content/llms.md`). Demos open in StackBlitz (READ).
- **Distribution.** An npm package.

### Ark UI (Svelte)

- **Theming.** None. Park UI was its styled layer and dropped Svelte (READ).
- **Idiom.** Runes over Zag machines. An `Ark` factory renders any tag through `as`. `asChild` hands the caller a props-merging function, and the ref is set by an attachment key (READ, `chakra-ui-ark/packages/svelte/src/lib/components/factory/factory.svelte`). Each component also has a `use-*.svelte.ts` hook and a `RootProvider` part, so state can be built outside the tree (READ, `components/dialog/`).
- **Accessibility.** Unit tests render the docs' own example files and assert no axe violations (READ, `components/accordion/accordion.test.ts` imports `./examples/basic.svelte`; `src/setup-test.ts`). 30 component pages end in an Accessibility section (EXECUTED, a count over `website/src/content/pages/components/`). Each links its WAI-ARIA pattern and renders a keyboard table from `@zag-js/docs` data (READ, `website/src/components/key-bindings-table.tsx`).
- **Docs.** Anatomy, many examples, guides, generated Props and Context tables, then Accessibility (READ, `dialog.mdx`, `scripts/src/generate-types.ts`). Scripts guard the docs: `check-anatomy.ts` keeps four frameworks in step, and `check-llms-size.ts` keeps `llms-full.txt` under the host's limit (READ). `TONE_OF_VOICE.md` sets the writing (READ).
- **Distribution.** A package, plus `@ark-ui/mcp`. That MCP server lets an agent list components and fetch examples, props and styling hooks (READ, `packages/mcp/README.md`).

### Skeleton

- **Theming.** The fullest Tailwind 4 theme system found.
  - A theme is one CSS file scoped to `[data-theme="name"]`. It holds spacing, a text-scaling factor, 64 typography variables (base, heading, anchor), radii and eleven-step OKLCH scales (READ, `skeletonlabs-skeleton/packages/skeleton/src/themes/cerberus.css`; EXECUTED, a count).
  - Each shade names its contrast colour, such as `--color-primary-contrast-500` (READ, `src/base/theme.css`).
  - **Colour pairings** hold both modes in one variable: `--color-primary-50-950` is `light-dark()` of shades 50 and 950 (READ, `theme.css` line 341). `color-scheme` follows Tailwind's `dark` variant (READ, `src/base/globals.css`).
  - Class components such as `btn` and `preset-filled-*` are `@utility` rules that read only theme variables (READ, `src/utilities/buttons.css`, `presets.css`).
  - The theme generator asks whether each shade's contrast colour is light or dark. It computes no ratio (READ, `sites/themes.skeleton.dev/src/lib/components/generator/Controls/ControlsColorsContrast.svelte`).
- **Idiom.** Runes over Zag. The caller's snippet is `element` (READ, `packages/skeleton-svelte/src/components/dialog/anatomy/trigger.svelte`). A `RootContext` part passes the machine's API to `children` (READ).
- **Accessibility.** It inherits Zag's ARIA. Its 29 test files check rendering. No axe was found (READ, `packages/skeleton-svelte/test/`).
- **Docs.** Astro. Pages switch between React and Svelte. The preview frame cycles backdrops and flips left-to-right and right-to-left, and opens in StackBlitz (READ, `sites/skeleton.dev/src/components/ui/preview.svelte`). Prop tables are generated from TypeScript interfaces (READ, `packages/docs/src/generate.ts`). It serves `llms.txt`, per-framework files and `.md` twins (READ, `sites/skeleton.dev/src/pages/`). Design pages teach palette, contrast and pairings (READ, `content/docs/design/colors.mdx`).
- **Distribution.** Packages. The CLI's one command, `migrate`, rewrites an app's code between majors (READ, `packages/cli/src/commands/migrate/index.ts`).

### Stacks (Stack Overflow)

- **Theming.** A Less build generates four colour sets: light, dark and a high-contrast version of each (READ, `stackexchange-stacks/packages/stacks-classic/lib/exports/color.less`). A mixin adds `forced-colors` rules (READ, `exports/mixins.less`). Components use **pseudo-private custom properties**, `--_xx-…` variables set at the top of a component and changed by variants, states and modes. This flattens the cascade (READ, `adrs/0001-pseudo-private-custom-properties.md`).
- **Idiom.** Plain: `$props()` and named snippets such as `header`, `body` and `footer`. There is no `child` composition, and its actions still use `use:` (READ, `packages/stacks-svelte/src/components/Modal/Modal.svelte`, README). An ADR forbids hard-coded text. Each built-in string is an `i18n*` prop with an English default (READ, `adrs/stacks-svelte/0001-localization.md`).
- **Accessibility.** The clearest policy found. ADR 0004 sets WCAG 2.2 AA everywhere and AAA contrast in high contrast. It puts axe in each component's tests (READ, `adrs/0004-accessibility-testing-strategy.md`). Its test helpers generate each variant in light and dark, each with and without high contrast. Under high contrast they switch on axe's `color-contrast-enhanced` rule (READ, `lib/test/a11y-test-utils.ts`, `test-utils.ts`). There are 35 axe files and 34 visual files, with screenshots for Chromium, Firefox and WebKit (EXECUTED, a count).
- **Docs.** SvelteKit with mdsvex. Each page's frontmatter links its Figma frame and its Svelte story, and gives an `updated` date (READ, `packages/stacks-docs/CLAUDE.md`). The same site holds `brand/` (colour balance by audience, logo, motion, "avoid" figures) and `copy/` (voice, naming) (READ). It serves `llms.txt`, `llms-full.txt` and `search.json` (READ). The Svelte components live apart, in Storybook (READ).
- **Distribution.** Packages: a global stylesheet, and Svelte components that need it.

### shadcn-svelte-extras

- **Theming and idiom.** Inherited from shadcn-svelte on Bits UI, in runes (READ).
- **Accessibility.** No test suite was found (READ, the repository listing).
- **Docs.** Short pages: Demo, Installation, Usage, variants, API (READ, `ieedan-shadcn-svelte-extras/content/components/copy-button.md`). The API is hand-written, typed against the props, with a `forwardTo` link to the primitive (READ, `src/lib/docs/api-reference/api-reference.ts`). Pluto already has that row (READ, `src/lib/site/api.server.ts` line 29). The install control picks an installer (jsrepo or shadcn-svelte) and one of four package managers (READ, `src/lib/components/ui/add/add.svelte.ts`). An agents page explains `.md` twins and the jsrepo MCP (READ, `content/agents.md`).
- **Distribution.** Copy-the-source, two ways. One `jsrepo.config.ts` declares every item. Custom outputs write both a jsrepo registry and a shadcn-svelte `registry.json`. Files marked `example`, `doc` or `test` are dropped from the shadcn output (READ, `.jsrepo/outputs/registry-json.ts`).

### Melt

- **Idiom.** The most runes-native. A builder is a class with `$derived` props and a `Synced` value for controlled or uncontrolled state (READ, `melt-ui-next-gen/packages/melt/src/lib/Synced.svelte.ts`). Getters such as `trigger` return attribute objects to spread, with refs as attachments (READ, `builders/Dialog.svelte.ts`). The dialog drives a native `<dialog>` with `showModal()`. Popovers use `popover="manual"` with Floating UI (READ, `Popover.svelte.ts`). Component wrappers are generated from the builders (READ, `scripts/generate-components.ts`).
- **Accessibility.** Browser specs with screenshots cover five builders (READ, `builders/tests/`). The roadmap still lists Dialog as unchecked (READ, `ROADMAP.md`).
- **Docs.** Starlight. Builder and Component tabs, then an API table generated by ts-morph into `api.json` (READ, `docs/src/content/docs/components/tabs.mdx`, `scripts/generate-api.ts`).
- **Distribution.** A 0.x package.

## Ideas for Pluto

Ranked by value over cost (INFERRED, from the READ facts above).

1. **Make keyboard behaviour data that the page and the test both read.**
   - What: each interactive item declares its keys, roles and focus moves once. The Accessibility section renders a table from it, and `tests/e2e/keyboard.spec.ts` walks it.
   - Why: Ark's tables come from data. Specification 015 declined a "Checked" row because a copy of the tests "would drift". One source can't drift.
   - Touches: `src/lib/site/page/component.svelte` (its hand-written keyboard `<li>`s), `component-data.server.ts`, `keyboard.spec.ts`. A new specification.
2. **Run axe in both themes and every open state.**
   - What: loop `tests/e2e/axe.spec.ts` over light and dark, for the views and the overlay cases it already opens.
   - Why: Stacks scans each variant in each mode. §4.4 promises AA "in both themes". `contrast.test.ts` checks token pairs, not composed pages.
   - Cost: low. The checks exist; the runs multiply.
   - Touches: `axe.spec.ts` and 015's criterion 7.
3. **Add styling hooks to the API table.**
   - What: list each part's data attributes, its own and those passed through from Bits UI, and any CSS variables it reads.
   - Why: Bits UI documents both per part. An app that owns the source styles by these hooks, and today it learns them only by reading the file.
   - Touches: `src/lib/site/api.server.ts`, `api-table.svelte`, 015's decision 14.
4. **Name the WAI-ARIA pattern each interactive item follows.**
   - What: link it from the top of the Accessibility section, as Ark does.
   - Why: it costs a line, and it tells a reviewer what "correct" means.
   - Touches: the same section, and 017's accessibility page.
5. **Research scoped schemes before the next theme change.**
   - What: a memo on `light-dark()` with `color-scheme`, scoped by attribute, as Skeleton's pairings and daisyUI's nestable `data-theme` do.
   - Why: 015 found that Tailwind's `dark:` variant and three `.dark …` rules leak into any light island ("Why a document, not a light-scoped subtree"). Scoped schemes would let a light card sit in a dark page.
   - Cost: high. It changes `pluto-theme` and every installed app, so it needs an owner decision.
   - Touches: `tokens/pluto.tokens.json`, the theme build, `src/app.css`.
6. **Choose a policy on built-in English text.**
   - What: either make the strings props with English defaults, as Stacks does, or state that apps edit their copy.
   - Why: items hard-code accessible names: "Close" (`dialog-content.svelte`, `sheet-content.svelte`), "Toggle sidebar", "Scroll to end", "Menu" (READ, a grep of `src/lib/registry/ui`). Copy-the-source makes this less urgent, but a prop survives a reinstall.
   - When: only once an app needs a second language (§4.2).
7. **Offer the install command for other package managers.**
   - What: a switch on the install panel, like shadcn-svelte-extras's.
   - Why: `addCommand` prints `bunx --bun shadcn-svelte@1.7.1` only (READ, `src/lib/site/site.ts`).
   - When: only if a Pluto app doesn't use bun.
   - Touches: `install.svelte`, `site.ts`.
8. **Add a direction switch to the example frame,** as Skeleton's preview has. Only when an app needs a right-to-left language.
9. **Give agents more than Markdown.**
   - What: an agents page costs one page. It says how to point an agent at `/llms.txt`, the twins and the registry. An MCP server like `@ark-ui/mcp` is a service that answers at run time.
   - Why the split: the page is cheap. The server sits close to §3's "Not a CLI".
   - The server needs a recorded decision.
10. **Write a migration note per breaking change.**
    - What: name the files and lines an app edits.
    - Why: Skeleton ships codemods. Pluto can't run code in an app, but §6 already asks the changelog to name interface changes. A note per item is the source-model codemod.
    - Touches: `CHANGELOG.md` conventions.

## Things to avoid

- **Don't swap the headless layer.** Melt is incomplete, with Dialog still unchecked. Ark spreads its effort over four frameworks. A swap would touch every item for no user gain (INFERRED).
- **Don't run a second registry toolchain.** shadcn-svelte-extras keeps two formats in step with custom code. Two formats double what §2.2 must prove (INFERRED).
- **Don't let a theme tool outrun the tokens.** Skeleton's generator lets anyone pick colours with no ratio check. Any tool Pluto shows must run `scripts/contrast.ts` on its output (INFERRED).
- **Don't split component docs from the guidelines.** Stacks keeps its Svelte components in a separate Storybook. Pluto's one site, with a page per item, is better (INFERRED).
- **Don't copy Carbon Svelte's idiom.** It still uses `export let` and slots under Svelte 5. Pluto's items stay in runes and snippets (INFERRED).
- **Don't name every CSS property as a token.** Skeleton's theme sets 64 typography variables, many of them `inherit`. Pluto's tokens name jobs. Keep them that way (INFERRED).
