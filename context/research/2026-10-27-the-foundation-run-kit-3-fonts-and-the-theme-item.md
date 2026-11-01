# The foundation run: SvelteKit 3, font items and the theme item

- **Status:** complete
- **Date:** 2026-10-27
- **Author:** the design lead
- **Question:** What specification `001` needs that [the first memo](2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md) does not record. Which versions are current. Whether shadcn-svelte 1.7.1 works with the current SvelteKit. How a `registry:font` item installs. How a `registry:theme` item can carry non-colour tokens. Which proposed colours pass WCAG 2.2 AA.
- **What it blocks:** specification `001`.

## How to read this memo

Every claim carries a label, as in the first memo.

- **EXECUTED**: we ran it and saw the result, on 2026-10-27, macOS, Bun 1.3.14, Node 22.14.0 (the default `node`) and Node 24.9.0 (a second install).
- **READ**: a source says so. Paths that start `cli/` mean `context/prior_art/shadcn-svelte/packages/cli/` at commit `6149e14`. Paths that start `docs/` mean `context/prior_art/shadcn-svelte/docs/`.
- **INFERRED**: our reasoning.

All runs were in scratch projects outside this repository. Nothing was written to this repository except this memo.

The run built a registry project with six items (`pluto-theme`, three font items, `utils`, `four-dot`), served it, and ran the real `add` into scratch apps. We call it **the run** below.

## 1. Versions on 2026-10-27

EXECUTED: `npm view <pkg> version license` and `npm view <pkg> peerDependencies engines`.

| Package | Latest | Licence | Note |
|---|---|---|---|
| `shadcn-svelte` | 1.7.1 | MIT | depends on `cn ^0.3.0`, `postcss`, `commander`, `node-fetch-native` |
| `bits-ui` | 2.20.2 | MIT | peer `svelte ^5.33.0` |
| `cn` | 0.5.0 | MIT | "Drop-in replacement for clsx + tailwind-merge", repository `shadcn-ui/cn`, published 2026-10-16; engines `node >=22` |
| `@fontsource-variable/geist` | 5.3.0 | OFL-1.1 | |
| `@fontsource-variable/ibm-plex-sans` | 5.3.0 | OFL-1.1 | |
| `@fontsource-variable/jetbrains-mono` | 5.3.0 | OFL-1.1 | |
| `@sveltejs/kit` | 3.1.0 (2026-10-14); 3.0.0 was 2026-10-01; last 2.x is 2.70.3 (2026-08-18) | MIT | 3.1.0: peers `vite ^8.0.12`, `svelte ^5.57.1`, `typescript ^6.0.0`, `@sveltejs/vite-plugin-svelte ^7.0.0`; engines `node >=22.17`. 2.70.3: engines `node >=18.13`, peers allow vite 8 and TypeScript 6 |
| `svelte` | 5.57.3 | MIT | |
| `tailwindcss`, `@tailwindcss/vite` | 4.3.3 | MIT | `@tailwindcss/vite` peer `vite ^5.2.0 \|\| ^6 \|\| ^7 \|\| ^8` |
| `vite` | 8.3.5 | MIT | engines `^20.19.0 \|\| >=22.12.0` |
| `@sveltejs/vite-plugin-svelte` | 7.3.1 | MIT | |
| `@sveltejs/adapter-static` | 4.0.0 (for Kit 3); 3.0.10 (for Kit 2) | MIT | |
| `@sveltejs/adapter-cloudflare` | 8.0.1 | MIT | peer `wrangler ^4.118.0` |
| `typescript` | 7.0.2 latest; 6.0.3 latest 6.x | Apache-2.0 | Kit 3.1.0 and `svelte-check` 4.7.7 both accept only `^6` (and `^5` for svelte-check), not 7 |
| `svelte-check` | 4.7.7 | MIT | |
| `@playwright/test` | 1.64.1 | Apache-2.0 | |
| `@axe-core/playwright` | 4.14.0 (2026-10-15) | MPL-2.0 | depends on `axe-core ~4.14.0`; engines `node >=22.12.0` |
| `vitest` | 5.0.5 | MIT | engines `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` |
| `mode-watcher` | 1.1.0 (last modified 2025-06-28) | MIT | |
| `tw-animate-css` | 1.4.0 | MIT | |
| `prettier` | 3.9.10 | MIT | |
| `prettier-plugin-svelte` | 4.1.1 | MIT | |
| `@types/node` | 24.19.2 latest 24.x | MIT | |
| `wrangler` | 4.154.0 | MIT OR Apache-2.0 | |

## 2. SvelteKit 3 changed three things the CLI meets

1. **`svelte.config.js` is no longer read.** Kit 3.1.0 throws `config_file_unsupported` if the file exists: "Please pass configuration via the `sveltekit(...)` plugin in your Vite config" (EXECUTED; READ `@sveltejs/kit/src/exports/vite/index.js`). The adapter goes in `sveltekit({ adapter: adapter() })`.
2. **`$lib` is removed.** Importing `$lib/...` errors with `module_removed_lib` unless the app re-adds `$lib` through the deprecated `alias` option (READ: `removed_modules` in the same file; `config_option_removed_files_lib` says "Use `#lib` instead of `$lib`"). `#lib` is a Node subpath import declared in the app's `package.json` `imports` field (INFERRED from the message and the run below).
3. **`tsconfig.json` extends `$app/tsconfig`**, a generated package at `node_modules/$app`, whose `paths` is `{}` (EXECUTED: `svelte-kit sync` printed `tsconfig_extends_missing` with the expected shape; the file read back with empty `paths`).

What that does to `shadcn-svelte add` 1.7.1:

- With `$lib` aliases in `components.json` and no `alias` option, `add` stops: "Invalid import alias found: ("components": "$lib/components")" (EXECUTED).
- With the deprecated `alias: { '$lib': 'src/lib' }`, `add` works, and Kit warns `config_option_deprecated_alias` (EXECUTED).
- **With `#lib`, `add` works without any deprecated option** (EXECUTED). The app's `package.json` held `"imports": { "#lib": "./src/lib", "#lib/*": "./src/lib/*" }`, and `components.json` held `#lib/...` aliases. The installed `four-dot.svelte` read `import { cn } from "#lib/utils"`, and `vite build` passed. The CLI resolves `#`-prefixed aliases through the package's import map (READ: `resolveImportAlias` in `cli/src/utils/resolve-imports.ts`).
- In the registry project, `registry.json` `aliases` set to `#lib/...` made `build` write `$UTILS$` for `#lib/utils` (EXECUTED).

Kit 2.70.3 with `$lib` also works, with one trap: Kit 2.70.3 writes `$lib` into `.svelte-kit/tsconfig.json` only when `src/lib` exists (READ: `write_tsconfig.js` line 215). On a fresh app with no `src/lib`, `add` failed with the same alias error; after `mkdir src/lib` and `svelte-kit sync`, it succeeded and `vite build` passed (EXECUTED).

INFERRED: what a registry serves does not depend on the registry project's Kit version. `build` turns aliases into placeholders, and `add` turns placeholders into the app's aliases. An app on Kit 2 with `$lib` and an app on Kit 3 with `#lib` both installed the same items.

## 3. `bunx` runs the CLI under Node, and the CLI uses Bun to install

- The stack traces from `bunx shadcn-svelte@1.7.1` show `node:internal/process/task_queues` (EXECUTED). The CLI runs under the `node` on `PATH`. This answers an unknown in the first memo (its last section, "Whether `bunx` runs the CLI under Node").
- The CLI printed "Installing dependencies with bun..." (EXECUTED). It detected Bun from the app's lockfile.
- With the default Node 22.14.0, Kit 3.1.0's `engines` (`>=22.17`) is not met. We ran Kit 3 under Node 24.9.0. Kit 2.70.3, Vite 8.3.5 and the CLI ran under 22.14.0 (EXECUTED).

## 4. `registry:font` items

READ: `registryItemFontSchema` in `cli/src/utils/registry/schema.ts`; `setupFonts` in `cli/src/utils/fonts.ts`; `addRegistryItems` in `cli/src/utils/add-registry-items.ts`.

- One item carries **one** font: the `font` field is a single object with `family`, `provider` (the literal `"google"`), `import`, `variable`, and optional `weight`, `subsets`, `selector`, `dependency`. A `registry:font` item without `font` fails the item schema (READ: the discriminated union).
- `import` is not used by `add` (READ: a grep for its use found none outside the schema).
- On install, for each font item: the package `font.dependency` (or `@fontsource-variable/<name>` derived from the item's name with `font-` and `font-heading-` stripped) is added to the app's **devDependencies**, an `@import "<package>"` is added, and `--<variable>: <family>` is written into `@theme inline`.
- Each non-heading font also gets `@layer base { <selector> { @apply <variable-as-class> } }`, where the selector defaults to `html`. `--font-heading` is skipped. **So two non-heading fonts with no selector would both be applied to `html`.**
- `dependency` doubles as the `@import` specifier. INFERRED: it cannot carry a version, so the CLI installs the font package at its latest version with a caret.
- shadcn-svelte's own maia registry has `font-geist` (`--font-sans`), `font-heading-ibm-plex-sans` (`--font-heading`) and `font-jetbrains-mono` (`--font-mono`), each with `files: []` and an explicit `dependency` (READ: `docs/static/registry/styles/maia/`).
- Components may write the class `cn-font-heading`. On install it becomes `font-heading` if the app's CSS defines `--font-heading:` or a font item being installed sets that variable, and is removed otherwise (READ: `cli/src/utils/transformers/transform-font.ts`, `cli/src/utils/font-markers.ts`).

What the run did (EXECUTED). Three font items, the mono one with `selector: "code, kbd, samp, pre"`, installed as a dependency of `pluto-theme`:

- `package.json` gained `@fontsource-variable/geist`, `ibm-plex-sans` and `jetbrains-mono`, each `^5.3.0`, under devDependencies.
- `app.css` gained three `@import`s, the three `--font-*` entries in `@theme inline`, `html { @apply font-sans; }` and `code, kbd, samp, pre { @apply font-mono; }`.
- The built CSS held 17 `@font-face` rules.

## 5. What a `registry:theme` item can carry

READ: `cli/src/utils/updaters/update-css-vars.ts`, `cli/src/utils/updaters/update-css.ts`.

- `cssVars.light` goes into `:root` and `cssVars.dark` into `.dark`. Every colour value (one that starts `#`, `rgb`, `hsl` or `oklch`) also gets `--color-<name>: var(--<name>)` in `@theme inline`. A non-colour value gets `--<name>: var(--<name>)` there, unless that name already exists.
- `radius` in `light` makes the CLI add `--radius-sm` to `--radius-4xl` as multiples of `--radius` (0.6 to 2.6), **but only those not already present**. `--radius-xs` is never derived.
- `cssVars.theme` is written into `@theme inline` first, and overwrites existing entries.
- **In `css`, the children of an at-rule are always treated as rules**, except under `@utility` and `@keyframes`. So declarations cannot be put directly inside `@theme` through `css`. EXECUTED: `"@theme static": { "--spacing": "0.25rem" }` failed with `CssSyntaxError: Unknown word 0.25rem`.
- `css[":root"]` and `css[".dark"]` merge into the existing rules (EXECUTED). `@media (prefers-reduced-motion: reduce)` with a `:root` rule inside, `@utility groove { ... }` and `@layer base` rules were all written as given (EXECUTED).

What Tailwind 4.3.3 did with the result (EXECUTED: `vite build`, then reading the CSS):

- Values in `@theme inline` are inlined into the utilities and **not emitted as CSS variables**. `.text-5xl` read `font-size:2.75rem`, and no `--text-5xl` variable existed. INFERRED: any token a component reads with `var()` must be in `:root`, not only in `@theme inline`.
- Variables in `:root` were emitted, and `size-(--mark-dot)` compiled to `width:var(--mark-dot)`.
- With `--radius-xs` to `--radius-4xl` all set to `var(--radius)`, `.rounded-xl` and `.rounded-xs` compiled to `border-radius:var(--radius)`. **The bare `.rounded` class stayed at `.25rem`.** Adding `--radius: 0.5rem` to `@theme inline` made `.rounded` compile to `.5rem`. `.rounded-full` stayed `2147483647px`.
- `--default-transition-duration: 200ms` in `@theme inline` made `.transition` use `var(--tw-duration,.2s)`.

## 6. Other behaviour of `build` and `add`

- **A one-file `registry:ui` item installs flat.** With only `four-dot.svelte`, it landed at `src/lib/components/ui/four-dot.svelte`. With a second file, `index.ts`, both landed in `ui/four-dot/` (EXECUTED; READ: the `singleFile` branch in `cli/src/commands/registry/build.ts`).
- **The dependency range is copied verbatim from the registry project's `package.json`.** With `"cn": "0.5.0"` there, the built `utils` item named `cn@0.5.0`, and the app's `package.json` got `"cn": "0.5.0"` (EXECUTED). The dependency landed in devDependencies because it was a devDependency in the registry project (EXECUTED; READ: `deps-resolver.ts`).
- Bare-name registry dependencies resolved transitively: adding `four-dot` fetched `index.json`, `four-dot.json`, `utils.json`, `pluto-theme.json`, then the three font items (EXECUTED: the server's request log).
- The `add` wrote `@import "shadcn-svelte/tailwind.css"` into the app's CSS (EXECUTED), as the first memo found. The scratch app had `shadcn-svelte` installed, so its build passed. INFERRED: an app without `shadcn-svelte` in its dependencies would fail to build after `add`.
- `shadcn-svelte/schema` exports `registrySchema` and `registryItemSchema`. Importing them from the installed package parsed our `registry.json` (6 items) and all 6 built items, with no separate `zod` install (EXECUTED).
- **The SvelteKit dev server serves `static/r/` at `/r/`.** `curl http://localhost:5199/r/styles/maia/index.json` answered `200 application/json` (EXECUTED). `vite build` copied `static/r/styles/maia/` into `build/r/styles/maia/` (7 files) beside the prerendered pages (EXECUTED).

## 7. Stock maia components and the tokens they read

READ: the built maia items in `docs/static/registry/styles/maia/` for button, badge, input, card, tabs, table, alert, accordion, skeleton, scroll-area, code-block and field.

- `text-destructive` is used as text on `bg-destructive/10` (and `dark:bg-destructive/20`) in button, badge, alert, field and code-block. INFERRED: `--destructive` must be a text-safe red.
- `focus-visible:ring-ring/50` (button, badge, input, tabs, scroll-area) draws focus at 50% alpha.
- `bg-input/30` fills inputs, outline buttons and badges with 30% of `--input`.
- `bg-muted` is used by skeleton, tabs, table and code-block.
- The 1.7.x `utils` item re-exports `cn` from the `cn` package (`cn@^0.5.0`, a devDependency) and declares four type helpers: `WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild` and `WithElementRef`. Stock components import these names from the `utils` alias.
- `menuColor: "default-translucent"` (which the brand's earlier website used) inlines `bg-popover/70` and `before:backdrop-blur-2xl` into menus at install (READ: `TRANSLUCENT_CLASSES` in `cli/src/utils/transformers/transform-menu.ts`). INFERRED: that is the frosted glass the design book §09 bans.

## 8. Contrast of the proposed colours

EXECUTED: a Node script in a scratch project implementing WCAG 2.2 relative luminance (sRGB channels linearised at the 0.04045 threshold; L = 0.2126 R + 0.7152 G + 0.0722 B; ratio (L1 + 0.05) / (L2 + 0.05)), with alpha composited over the ground before measuring. Ratios are truncated to two decimals, never rounded up.

Two derived neutrals were computed for `--muted`: ink at 6% over paper is `#EAEAE7`; paper at 10% over ink is `#2B2D32`.

Failures found among the proposed colours (drafted from the design book's tokens before `001`):

| Proposal | Failing pair | Ratio | Needed |
|---|---|---|---|
| text-safe green `#157A43` | on `#EAEAE7` (muted) | 4.47 | 4.5 |
| text-safe green `#157A43` | on its own 10% tint over white (stock `bg-destructive/10` pattern) | 4.37 | 4.5 |
| input border `#878B96` | on `#EAEAE7` (muted) | 2.82 | 3 |
| dark input border `#656A79` | on `#1E2129` (raised) | 2.98 | 3 |
| dark input border `#656A79` | on `#2B2D32` (dark muted) | 2.55 | 3 |
| dark red `#FF6E63` | on its own 20% tint over `#1E2129` (stock `dark:bg-destructive/20`) | 4.32 | 4.5 |

Same-hue replacements, found by scaling the channels toward black (light) or white (dark) and taking a value with a small margin:

| Replaces | With | Its tightest pair |
|---|---|---|
| `#157A43` | `#136E3E` | 4.54 on its 10% tint over muted; 5.08 on its tint over paper |
| `#878B96` | `#7C808B` | 3.27 on muted |
| `#656A79` | `#787C8A` | 3.31 on dark muted |
| `#FF6E63` | `#FF7D73` | 4.60 on its 20% tint over raised |

Confirmed as proposed: `#C42A1F` (tightest 4.51, on its 10% tint over paper), `#7A9BFF`, `#4CC982`, `#1E2129`, `#A9ADB8`.

Two more findings:

- Stock `ring-ring/50` composited over the ground measures 2.22 (light) and 2.65 (dark), under the 3:1 a focus indicator needs (WCAG 2.2 SC 1.4.11).
- Amber `#F0AE12` as a chart mark measures 1.81 on paper and 1.95 on white. It passes on ink (9.27).

The full table of 100 pairs is in specification `001`.

## 9. How `cn` 0.5.0 merges our names

EXECUTED: `cn(...)` from `cn` 0.5.0, under Node 24.9.0.

| Call | Result |
|---|---|
| `cn("text-display", "text-foreground")` | `"text-foreground"`: the unknown size name was read as a colour and dropped |
| `cn("text-5xl", "text-foreground")` | `"text-5xl text-foreground"` |
| `cn("text-sm", "text-destructive")` | `"text-sm text-destructive"` |
| `cn("p-2", "p-4")` | `"p-4"` |
| `cn("bg-primary", "bg-destructive")` | `"bg-destructive"` |
| `cn("text-success", "text-destructive")` | `"text-destructive"` |
| `cn("bg-mark-1", "bg-mark-2")` | `"bg-mark-2"` |
| `cn("rounded-lg", "rounded-full")` | `"rounded-full"` |
| `cn("tracking-tight", "tracking-mark")` | `"tracking-tight tracking-mark"`: an unknown tracking name is not merged |

INFERRED: size tokens should reuse Tailwind's own size names. Custom colour names merge correctly. Custom tracking names do not merge, so a component should never set two tracking classes on one element.

## 10. What this memo does not settle

- **Whether `svelte-check` 4.7.7 type-checks a Kit 3 project that uses `#lib` and `$app/tsconfig`.** Answered by the toolchain memo of the same day (§4): extensionless `#lib/...` imports fail until `imports` gives fallback targets. `001` decision 2 takes that fix, and `bun run check` reports 0 errors (`001` criterion 2).
- **Whether Playwright 1.64.1's bundled Chromium measures the four-dot geometry precisely.** Answered: `001`'s `four-dot.spec.ts` measures the dot sizes, gaps, width and rise in Chromium and passes 20 of 20 (`001` criterion 16).
- **The status of the W3C Design Tokens Community Group format.** Not read for this memo. The token file is plain JSON of this repository's own shape (`001` decision 6).
- **Whether adapter-static 4.0.0 empties `build/` before writing.** Not checked. The registry is generated into `static/`, which `vite build` copies into `build/` (`001` decision 18), so nothing depends on it.
