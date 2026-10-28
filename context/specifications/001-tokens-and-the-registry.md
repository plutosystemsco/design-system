# 001 — Tokens and the registry

- **Status:** **built**, 2026-10-27; committed 2026-10-28 as `33e94de`, tagged `v0.1.0` (see Landing notes). Drafted 2026-10-27; amended 2026-10-27 after review ([`../reviews/001-tokens-and-the-registry-spec-2026-10-27.md`](../reviews/001-tokens-and-the-registry-spec-2026-10-27.md)), amended again 2026-10-27 after the change review ([`../reviews/001-tokens-and-the-registry-pr-2026-10-27.md`](../reviews/001-tokens-and-the-registry-pr-2026-10-27.md)). It lands as **built** when acceptance criteria 1 to 23 hold. It is **done** when `wasi-python-dev`'s home-page specification installs `pluto-theme` and `four-dot` from this registry and passes that app's checks (criterion 24).
- **Date:** 2026-10-27
- **Owner:** Clay Gendron
- **Author:** an agent (Claude), sub-agent of the orchestrating session
- **Kind:** new repository scaffold; the token source; the registry's foundation items
- **Depends on:** nothing in this repository. The reverse edge: `wasi-python-dev`'s home-page specification (its `003`) depends on this one. This one is *done* only when that specification passes criterion 24.
- **Blocks:** `002` the primitives; `003` the blocks; `wasi-python-dev`'s home page, which installs `pluto-theme` and `four-dot` from this registry. `002` may start once 001 is *built*.
- **Research:** [`../research/2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md`](../research/2026-10-27-a-shadcn-svelte-registry-and-what-pluto-already-has.md) (cited as *registry memo*); [`../research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md`](../research/2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md) (cited as *run memo*); [`../research/2026-10-27-the-toolchain-under-bun.md`](../research/2026-10-27-the-toolchain-under-bun.md) (cited as *toolchain memo*); the owner's answers in [`../decisions.md`](../decisions.md); design book v2, `plutosystemshq/pluto-systems-design-book-v2.html` (cited as *v2*)

## Intent

This specification turns an empty repository into a working registry. It builds four things.

1. **A scaffold.** A SvelteKit app run by Bun, with every dependency pinned. Its pages preview the registry's items. It is not a website.
2. **One token file.** It holds every colour and size the brand uses, for light and dark. Scripts turn it into the `pluto-theme` registry item and into the preview app's own CSS.
3. **Six registry items.** `pluto-theme`, three font items, `utils`, and `four-dot` (the mark and its lockup). The dev server serves them at `localhost`, so `wasi-python-dev` can install them while both are being built.
4. **Tests.** Contrast arithmetic, schema checks, a lint against literal colours and sizes, Playwright and axe on every preview page in both themes, keyboard checks, and a smoke test that runs the real `add` into scratch apps.

Deployment is out of scope. The owner runs it. This specification only leaves a `wrangler.jsonc` ready for it.

Terms used throughout.

- **Registry:** a set of JSON files over HTTP. Each **registry item** is one JSON file carrying source text and what it needs (registry memo §1).
- **`add`:** shadcn-svelte's CLI command that fetches items and writes their files into an app.
- **Runtime:** the program that executes JavaScript. Here it is always Bun.
- **`--bun`:** a Bun flag. Most tools' command-line entry points begin `#!/usr/bin/env node`, and Bun honours that line unless `--bun` overrides it (toolchain memo §1).
- **Token:** a named design value, such as a colour or a size.
- **Primitive:** a raw token, a hex value with a brand name such as `ink` or `blue`. Components never use primitives.
- **Semantic token:** a token named for its job, such as `--background` or `--destructive`. Each one points at a primitive, per theme. Components use only these.
- **Text-safe:** a colour that passes 4.5:1 as text on every ground it can sit on.
- **Ground:** a surface text sits on: `background`, `card` or `muted`. `muted` is an inset ground, used only inside components (decision 8).
- **Preview page:** a page of this repository's app that shows one item.
- **Catalogue:** the page listing every item.
- **Scratch app:** a throwaway SvelteKit app, copied by the smoke test from a committed fixture into a temporary folder, that installs items the way a real app would.
- **The run:** the experiment in the run memo, which built these six items in the scratchpad and installed them.
- **Built** and **done:** 001 is *built* when criteria 1 to 23 hold in this repository. It is *done* when criterion 24 holds in `wasi-python-dev` (constitution §4.2: "tested in that app before it is called done").

## Decisions

Each choice, with its reason.

### 1. Bun runs everything

- **Bun 1.3.14** installs packages, runs `scripts/*.ts`, and runs every tool: Vite, SvelteKit, svelte-check, the tests, Playwright, prettier and the shadcn-svelte CLI. There is no Node engine and no `.nvmrc`.
- `package.json` holds `"packageManager": "bun@1.3.14"` and `"engines": { "bun": ">=1.3.14" }`. Neither is enforced: `bun install` ignores `engines`, even an impossible one (toolchain memo §2, EXECUTED). They record intent. `deps.test.ts` checks that they say Bun and that no `node` engine or `.nvmrc` exists (decision 25).
- *Why:* the owner's decision, "Bun is the runtime, not Node" (decisions.md, 2026-10-27). The toolchain memo ran every tool here under Bun 1.3.14 and found no exception: "No tool needed Node in this run" (toolchain memo §10, EXECUTED). Under `--bun`, Bun reports itself as Node 24.3.0, which satisfies every `engines` range in the set (toolchain memo §1).

**How each tool is made to run under Bun.** One rule: **every command that starts a tool says `--bun` where the tool starts.**

- Each package script that runs a tool's bin is written `bun --bun <bin> …`, such as `bun --bun vite build` (the scripts table, under Design). `bun --bun <bin>` also puts a `node` shim first on `PATH`, so the tool's own children run under Bun too (toolchain memo §1, §9, EXECUTED).
- A Bun script or test that spawns a tool puts `--bun` in the child's argv: `Bun.spawn([process.execPath, '--bun', '<path>/node_modules/.bin/<bin>', …])`. A child does not inherit `--bun` as a flag. A child of `bun file.ts` or of `bun test` runs under Node unless its argv says `--bun` (toolchain memo §9, EXECUTED). Every entry point here is Bun, so `process.execPath` is Bun.
- `bun scripts/x.ts` and `bun test` need no flag. They are Bun itself.
- *Why this, not `bunfig.toml` `[run] bun = true`:* that setting covers `bun run` and `bun <bin>`, but not `bunx`, and not the children of `bun file.ts` or `bun test` (toolchain memo §1, §9, EXECUTED). Those places need `--bun` in argv anyway. Writing `--bun` everywhere a tool starts is one rule with no exception, and it is visible in `package.json`, not hidden in a config file. `bunfig.toml` holds only the test ignore pattern (decision 25).

**The CLI runs from the locked local install.** This repository runs `shadcn-svelte` as `bun --bun node_modules/.bin/shadcn-svelte …`, spawned by `scripts/build-registry.ts` and by the smoke test. It never uses `bunx shadcn-svelte@1.7.1` here. *Why:* `bunx pkg@version` ignores the local install and runs a copy from Bun's global cache, which `bun.lock` does not pin (toolchain memo §1, READ and EXECUTED; constitution §4.5).

**The CLI's warning.** Under Bun, every CLI run prints `▲ You are currently using an unsupported runtime. Only Node.js v22 or higher is officially supported. Continue at your own risk.` and continues. Its output was identical to Node's in `registry build` and `add` (toolchain memo §7, EXECUTED: `diff -r` found no difference). We accept the warning. The smoke test asserts it appears, which proves the CLI ran under Bun (decision 25).

**Chromium** for Playwright is installed with `bunx --bun playwright install chromium`. With no version given, `bunx` runs the local `@playwright/test` bin (toolchain memo §6, EXECUTED).

### 2. SvelteKit 3.1.0, with `#lib` in place of `$lib`

- The SvelteKit config lives in `vite.config.ts`, as `sveltekit({ adapter: adapter() })`. There is no `svelte.config.js`; Kit 3 refuses to start if one exists (run memo §2).
- `package.json` holds:
  ```json
  "imports": {
    "#lib": "./src/lib",
    "#lib/*": ["./src/lib/*", "./src/lib/*.ts", "./src/lib/*/index.ts"]
  }
  ```
  Code imports `#lib/...`, without an extension, as the CLI writes it. `$lib` is not used anywhere. No file imports bare `#lib`; that key is kept as the run's apps held it (run memo §2).
- `tsconfig.json` extends `$app/tsconfig` and sets:
  - `"include": ["src", "scripts", "tests", "*.ts"]`: the app, the scripts, the tests and the root config files (`vite.config.ts`, `playwright.config.ts`);
  - `"exclude": ["tests/smoke/fixtures"]`: the scratch apps have their own `tsconfig.json` (decision 25);
  - `"types": ["$app/types", "bun"]`;
  - `"allowImportingTsExtensions": true`, so tests and scripts may import `.ts` paths (decision 25). Kit's base config sets `noEmit`, which this option needs (INFERRED; the `check` criterion proves it).
- *Why the fallback targets:* with `"#lib/*": "./src/lib/*"`, an extensionless `#lib/utils` fails `svelte-check`: "Cannot find module '#lib/utils'". Kit writes `paths: {}` into `$app/tsconfig`, so TypeScript resolves `#lib/*` through `imports` alone, and it adds no `.ts` to an extensionless target. The same error hit a component that `add` had written. With the three targets, `svelte-check` reported 0 errors, `vite build` passed, `registry build` still wrote a clean `$UTILS$`, and `add` into a Kit 3 app with the same `imports` placed its files and passed `svelte-check` and `vite build` (toolchain memo §4, EXECUTED, fix B).
- *Rejected: writing `#lib/utils.js` in our files.* It passes `svelte-check`, but `registry build` turns it into `$UTILS$.js` in an item's source, so the extension travels into every app (toolchain memo §4, EXECUTED, fix A).
- *Limit of the fallbacks:* only Vite and TypeScript read the array. Bun's own resolver does not: under `bun test`, `#lib/utils` fails and `#lib/utils.ts` loads (toolchain memo §4, §5.2, EXECUTED). So tests import `.ts` paths (decision 25).
- *Why `include` and `types`:* without `include`, `svelte-check` scanned `build/` and reported 1344 errors. Without `$app/types` in `types`, Kit warns `tsconfig_invalid` (toolchain memo §3, §4, EXECUTED). `"bun"` gives the scripts and tests the `Bun` global and `bun:test`, through `@types/bun` (decision 4).
- **What a Kit 3 app needs to install from here.** The same `imports` shape, or its own `svelte-check` fails on the CLI's extensionless `#lib/utils`. Decision 23 tells `wasi-python-dev`.
- *Why Kit 3 at all:*
  - Kit 3 is the current major. Starting a new repository on the old one buys a migration.
  - Kit 3 removed `$lib`. shadcn-svelte 1.7.1 resolves `#`-prefixed aliases through `package.json` imports, and `add` and `build` both worked with `#lib` (run memo §2, EXECUTED).
  - Re-adding `$lib` through Kit's `alias` option also works, but that option is deprecated (run memo §2). We do not start on a deprecated path.
  - What the registry serves does not depend on this choice. `build` turns aliases into placeholders, and `add` writes the app's own aliases back. An app on Kit 2 with `$lib` installed the same items (run memo §2). The smoke test keeps proving both (decision 25).
- *Rejected:* SvelteKit 2.70.3. It works with the CLI and with Vite 8. But it is the previous major, and a Kit 2 app must have `src/lib` before `add` will accept `$lib` (run memo §2).

### 3. `@sveltejs/adapter-static` 4.0.0

- Every page is prerendered. `+layout.ts` sets `export const prerender = true` and `export const trailingSlash = 'always'`.
- `vite build` writes the site to `build/`. With `trailingSlash = 'always'`, prerender writes `build/index.html` and `build/items/<name>/index.html`, matching the paths `/items/<name>/` used throughout (decision 24).
- *Why:* the preview pages are prerendered and the registry is static JSON. A static `build/` folder is exactly what a Cloudflare Worker with static assets serves without any Worker code (registry memo §2). `@sveltejs/adapter-cloudflare` 8.0.1 would build a Worker script, which nothing here needs, and it would add `wrangler` as a peer dependency (run memo §1). A Worker can come later, if the registry ever needs private access or redirects (registry memo §1.8).
- *Why `trailingSlash = 'always'`:* Kit's default, `'never'`, would make `/items/<name>/` a redirect to `/items/<name>` and write `items/<name>.html`. The paths in this specification and the page count of criterion 8 would then depend on redirects.

### 4. Dependencies, named and pinned

Versions were read with `npm view` on 2026-10-27 (run memo §1, EXECUTED), except `@types/bun`, which the toolchain memo installed at 1.3.14 (toolchain memo §11, EXECUTED). `bun.lock` pins each to the version below.

Two specifier rules apply in `package.json`.

- **A package a registry item names gets a caret range** at the tested version, such as `^0.5.0`. The item names the same range.
  - *Why:* `build` copies the specifier from our `package.json` into the item verbatim, and `add` writes it into the app's `package.json` (run memo §6, EXECUTED). An exact specifier would make `add` treat an app's newer patch release as unsatisfied and install the older one over it (INFERRED from `install-deps.ts`, registry memo §1.4). The app's own `bun.lock` pins the exact version, as constitution §4.5 asks. `shadcn-svelte` is named by a hand-written item field (decision 19), not detected by `build`; it follows the same rule, so one rule covers every package an item names.
- **Every other package gets an exact version.** These are tools the registry is built and tested with. No app receives them through an item.

All are devDependencies. A SvelteKit app bundles what it imports, and stock items put their packages there too (run memo §6).

| Package | Version in `bun.lock` | Specifier | Licence | Why |
|---|---|---|---|---|
| `shadcn-svelte` | 1.7.1 | `^1.7.1` | MIT | The CLI: `registry build` and `add`. Also `shadcn-svelte/tailwind.css`, which `add` imports into every app's CSS, and `shadcn-svelte/schema`, which the tests parse with (run memo §6). `pluto-theme` names it (decision 19) |
| `@sveltejs/kit` | 3.1.0 | `3.1.0` | MIT | The preview app (decision 2) |
| `@sveltejs/adapter-static` | 4.0.0 | `4.0.0` | MIT | Decision 3 |
| `@sveltejs/vite-plugin-svelte` | 7.3.1 | `7.3.1` | MIT | Kit 3's peer |
| `svelte` | 5.57.3 | `5.57.3` | MIT | Kit 3 needs `^5.57.1` |
| `vite` | 8.3.5 | `8.3.5` | MIT | Kit 3 needs `^8.0.12` |
| `tailwindcss` | 4.3.3 | `4.3.3` | MIT | The CLI requires Tailwind v4 (registry memo §1.1) |
| `@tailwindcss/vite` | 4.3.3 | `4.3.3` | MIT | Tailwind's Vite plugin |
| `typescript` | 6.0.3 | `6.0.3` | Apache-2.0 | Kit 3.1.0 and `svelte-check` 4.7.7 both accept `^6` and not 7.0.2, the latest (run memo §1) |
| `svelte-check` | 4.7.7 | `4.7.7` | MIT | Type checks, as `hq/web` already runs |
| `@types/bun` | 1.3.14 | `1.3.14` | MIT | Types for `Bun.spawn`, `bun:test` and, through `bun-types`, the `node:` modules the scripts and tests import (toolchain memo §11, EXECUTED) |
| `cn` | 0.5.0 | `^0.5.0` | MIT | The class-merging helper the `utils` item re-exports, as shadcn-svelte 1.7.x does (run memo §7) |
| `@fontsource-variable/geist` | 5.3.0 | `^5.3.0` | OFL-1.1 | The body face, self-hosted |
| `@fontsource-variable/ibm-plex-sans` | 5.3.0 | `^5.3.0` | OFL-1.1 | The heading face, self-hosted |
| `@fontsource-variable/jetbrains-mono` | 5.3.0 | `^5.3.0` | OFL-1.1 | The mono face, self-hosted |
| `@playwright/test` | 1.64.1 | `1.64.1` | Apache-2.0 | Browser tests |
| `@axe-core/playwright` | 4.14.0 | `4.14.0` | MPL-2.0 | Accessibility scans. MPL-2.0 is file-level copyleft; it is a test tool and reaches no app (INFERRED) |
| `prettier` | 3.9.10 | `3.9.10` | MIT | `bun run lint`, and the formatting of generated files (decision 15) |
| `prettier-plugin-svelte` | 4.1.1 | `4.1.1` | MIT | Formats `.svelte` files |

That is 19 packages. Anything else in `bun.lock` comes in through these.

Not added, and why:

- `vitest`: the unit and smoke tests run under `bun test` (decision 25).
- `@types/node`: `@types/bun` 1.3.14 depends on `bun-types` 1.3.14, which depends on `@types/node` (READ: both packages' `package.json`, in Bun's install cache, 2026-10-27). `bun.lock` pins the version that arrives.
- `bits-ui`, `tw-animate-css`, an icon library: no 001 item uses them. `002` adds them with the first component that does.
- `mode-watcher`: the preview app switches themes with a few lines of its own (decision 24). `003`'s theme toggle decides whether apps get `mode-watcher`.
- `wrangler`: deployment is owner-run and out of scope. The owner runs it at deploy time.
- `zod`: `shadcn-svelte/schema` parsed without it (run memo §6).

### 5. Repository layout

```
design-system/
  package.json  bun.lock
  bunfig.toml                     [test] pathIgnorePatterns only (decision 25)
  .prettierrc  .prettierignore    decision 26
  vite.config.ts                  sveltekit({ adapter }), tailwindcss(), the registry watcher (decision 23)
  tsconfig.json                   extends $app/tsconfig; include, exclude, types (decision 2)
  components.json                 the preview app's own shadcn-svelte config (decision 21)
  registry.json                   the item list; build-tokens owns four of its items' token fields (decision 15)
  playwright.config.ts            two projects, light and dark; webServer builds first (decision 25)
  wrangler.jsonc                  static assets only (decision 27)
  CHANGELOG.md                    one dated entry per release, naming each item that changed
  tokens/
    pluto.tokens.json             the one source of every colour and size (decision 6)
  scripts/
    tokens.ts                     validates the token file (pure), and reads it from disk; shared by scripts, tests and preview loads
    contrast.ts                   WCAG 2.2 contrast arithmetic (pure); shared by the tests and the pluto-theme preview
    build-tokens.ts               writes pluto-theme's and the font items' token fields into registry.json, and src/app.css, both formatted by prettier
    build-registry.ts             runs the local `shadcn-svelte registry build` under --bun, then makes the versioned copy; takes --out (default static)
    registry-watch.ts             the Vite plugin of decision 23
    lint-literals.ts              the literal lint of decision 25
  src/
    app.html                      sets the theme class before first paint (decision 24)
    app.css                       generated by build-tokens; committed
    lib/
      utils.ts                    the `utils` item's file, and the preview app's own helper
      registry/
        ui/four-dot/              four-dot.svelte, lockup.svelte, index.ts
        lib/  hooks/  components/ blocks/     empty until 002 and 003; each holds a .gitkeep
      preview/                    the preview app's own components; never registry items
    routes/
      +layout.ts                  prerender = true; trailingSlash = 'always'
      +layout.svelte              header with the lockup and the theme toggle
      +page.server.ts             loads registry.json for the catalogue (decision 24)
      +page.svelte                the catalogue
      items/<name>/+page.svelte   one preview page per item, six in all
      items/<name>/+page.server.ts  for pluto-theme and the three font items: loads token data (decision 24)
  static/
    r/  v0.1.0/                   generated by build-registry; git-ignored
  tests/
    unit/                         8 files (decision 25)
    e2e/                          5 files
    smoke/                        2 files
      fixtures/kit3/  fixtures/kit2/   the two scratch apps, with their bun.lock files (decision 25)
```

- `.gitignore` gains `static/r/`, `static/v*/`, `test-results/` and `playwright-report/`.
- *Why this shape:* it is the registry memo's §6 proposal, changed in four places. The registry is generated into `static/`, not `build/` (decision 18). Registry sources sit under `src/lib/registry/`, the CLI's default alias paths (decision 19). Preview-only components get their own folder, so nothing in `registry/` exists only for the preview. The scratch apps are committed fixtures, so their packages are pinned (decision 25).

### 6. The token file is plain JSON of our own shape

`tokens/pluto.tokens.json` has these top-level keys. The Design section gives the shape of each.

| Key | Holds |
|---|---|
| `primitives` | 22 named hex colours |
| `themes.light`, `themes.dark` | 45 semantic colour names, each naming a primitive |
| `radius` | the one case radius, in px |
| `spacing` | the 4 px atom and the nine-step ladder |
| `type` | the three font families and their font items, the five-step scale, the four tracking values, the three weights and the one named line height |
| `motion` | the entrance and micro budgets, and the entrance curve |
| `mark` | the four-dot geometry, in em |
| `line`, `focus` | the hairline width and the focus outline width and offset, in px |
| `contrast` | the pairs the tests check, in both themes, with their minimums, the recorded exceptions and the forbidden pairs |

- A semantic value names a primitive, never a hex. Each hex appears once in the file.
- *Why our own shape, not the W3C Design Tokens Community Group format:*
  - The only reader is our build script. No tool such as Style Dictionary is needed, so none is added.
  - Our two themes are pairs of maps over the same names. The Community Group's core format has no theme or mode construct; modes live in a separate module (INFERRED; its current status was not read today, run memo §10).
  - We need fields the format does not have: which shadcn name a token fills, which pairs must pass contrast, which font item a family becomes.
- `scripts/tokens.ts` validates the file with hand-written checks and fails with the key at fault. It adds no validation library.

### 7. The primitives

All values are sRGB hex. An eight-digit value carries alpha. Ratios are in decision 12.

| Primitive | Hex | Source |
|---|---|---|
| `ink` | `#14161C` | v2 Ink |
| `ink-soft` | `#4A4F5C` | v2 Ink Soft |
| `paper` | `#F7F7F4` | v2 Paper, the default ground |
| `raised` | `#FFFFFF` | v2 Raised: cards, inputs, figures |
| `blue` | `#2456E6` | v2 Charon Blue |
| `red` | `#E23A2E` | v2 Tombaugh Red: fills and dots |
| `amber` | `#F0AE12` | v2 Sputnik Amber: fills only, never text |
| `green` | `#1E9E56` | v2 Hydra Green: fills and dots |
| `red-text` | `#C42A1F` | the owner's text-safe red, **confirmed** |
| `green-text` | `#136E3E` | text-safe green; **replaces the proposed `#157A43`** |
| `wash` | `#EAEAE7` | a flattened tint: ink at alpha 15/255 (about 5.9%, the owner's "6%") over paper. The light `muted` ground, for component insets only (decision 8) |
| `line` | `#14161C1A` | v2's ink hairline at 10% (alpha byte `1A`, 26/255) |
| `line-input` | `#7C808B` | input border; **replaces the proposed `#878B96`** |
| `ink-raised` | `#1E2129` | the canvas's dark raised, **confirmed** |
| `ink-wash` | `#2B2D32` | a flattened tint: paper at alpha 0.1 over ink. The dark `muted` ground, for component insets only (decision 8) |
| `paper-soft` | `#A9ADB8` | the canvas's dark soft text, **confirmed** |
| `paper-line` | `#F7F7F41A` | paper hairline at 10%, the dark mirror of `line` |
| `paper-line-input` | `#787C8A` | dark input border; **replaces the proposed `#656A79`** |
| `blue-lifted` | `#7A9BFF` | the canvas's dark blue, **confirmed** |
| `red-lifted` | `#FF7D73` | dark red; **replaces the proposed `#FF6E63`** |
| `green-lifted` | `#4CC982` | the canvas's dark green, **confirmed** |
| `clear` | `#00000000` | fully transparent; the dark groove's missing highlight (decision 13) |

**What changed from the canvas, and why.** Each replacement keeps the proposal's hue. It scales the channels toward black (light theme) or white (dark theme) to the nearest value that passes with a small margin (run memo §8).

| Proposed | Failed | Replacement | Now |
|---|---|---|---|
| green text `#157A43` | 4.47 on `muted`; 4.40 on its own 10% tint over paper, the pattern stock components use for state text (`bg-destructive/10 text-destructive`, run memo §7) | `#136E3E` | 5.23 on `muted`; 5.08 on its tint over paper |
| input border `#878B96` | 2.82 on `muted`, under the 3:1 an input's boundary needs | `#7C808B` | 3.27 on `muted` |
| dark input border `#656A79` | 2.98 on `card`; 2.55 on `muted` | `#787C8A` | 3.86 on `card`; 3.31 on `muted` |
| dark red `#FF6E63` | 4.32 on its 20% tint over `card` (stock `dark:bg-destructive/20`) | `#FF7D73` | 4.60 |

**`wash` and `ink-wash` are flattened values.** Each is a fixed hex, and the tests use the hex, never the derivation. The derivations, exactly: `wash` is ink composited over paper at alpha 15/255, each channel rounded to the nearest integer (234, 234, 231). Ink at exactly 0.06 would give `#E9E9E7`; the owner's decision fixes `#EAEAE7` (decisions.md, "A fourth ground for `muted`, insets only"). `ink-wash` is paper over ink at alpha 0.1, rounded the same way (43, 45, 50). The fourth ground is the owner's decision, not this specification's (decision 8).

Primitives are not emitted as CSS variables. A component that used `--blue` directly would bypass both the dark theme and the text-safe rule.

### 8. The semantic tokens, and how the shadcn names map onto the brand

The stock shadcn theme defines 31 names (READ: `hq/web/src/routes/layout.css`, as `init` wrote it). Mapping all of them to brand primitives lets a stock component restyle by tokens alone. Fourteen Pluto names are added for the brand's own needs. Each is a CSS variable in `:root` and `.dark`, and Tailwind gets `--color-<name>` for each (decision 15).

| Name | Light | Dark | Role |
|---|---|---|---|
| `background` | `paper` `#F7F7F4` | `ink` `#14161C` | the page ground |
| `foreground` | `ink` | `paper` | all body text; headings are always ink (v2 §03) |
| `card` | `raised` `#FFFFFF` | `ink-raised` `#1E2129` | surfaces on the ground |
| `card-foreground` | `ink` | `paper` | |
| `popover` | `raised` | `ink-raised` | menus, dialogs |
| `popover-foreground` | `ink` | `paper` | |
| `primary` | `blue` `#2456E6` | `blue-lifted` `#7A9BFF` | links, primary actions, focus (v2 §03) |
| `primary-foreground` | `raised` | `ink` | text on a primary fill |
| `secondary` | `raised` | `ink-raised` | secondary actions; `002` gives them a visible border |
| `secondary-foreground` | `ink` | `paper` | |
| `muted` | `wash` `#EAEAE7` | `ink-wash` `#2B2D32` | component insets only: skeletons, tab strips, code grounds. Never a page, section or sidebar ground |
| `muted-foreground` | `ink-soft` `#4A4F5C` | `paper-soft` `#A9ADB8` | secondary text, captions, placeholders |
| `accent` | `wash` | `ink-wash` | component insets only: hover and selected rows |
| `accent-foreground` | `ink` | `paper` | |
| `destructive` | `red-text` `#C42A1F` | `red-lifted` `#FF7D73` | error text and destructive actions. Text-safe, because stock components write it as text (run memo §7) |
| `border` | `line` `#14161C1A` | `paper-line` `#F7F7F41A` | decorative hairlines: cards, separators, table rows |
| `input` | `line-input` `#7C808B` | `paper-line-input` `#787C8A` | the border of a form control; 3:1 on every ground |
| `ring` | `blue` | `blue-lifted` | the focus outline |
| `chart-1` | `blue` | `blue-lifted` | data figures cycle the four, blue first (v2 §03) |
| `chart-2` | `red` `#E23A2E` | `red-lifted` | |
| `chart-3` | `amber` `#F0AE12` | `amber` | see the exception in decision 12 |
| `chart-4` | `green` `#1E9E56` | `green-lifted` `#4CC982` | |
| `chart-5` | `ink-soft` | `paper-soft` | a neutral fifth series; v2 allows no new hue |
| `sidebar` | `paper` | `ink` | a sidebar is a ground, set apart by a groove, not a tint |
| `sidebar-foreground` | `ink` | `paper` | |
| `sidebar-primary` | `blue` | `blue-lifted` | |
| `sidebar-primary-foreground` | `raised` | `ink` | |
| `sidebar-accent` | `wash` | `ink-wash` | hover and selected rows inside the sidebar: an inset, as `accent` |
| `sidebar-accent-foreground` | `ink` | `paper` | |
| `sidebar-border` | `line` | `paper-line` | |
| `sidebar-ring` | `blue` | `blue-lifted` | |
| `destructive-foreground` | `raised` | `ink` | text on a solid `destructive` fill |
| `destructive-fill` | `red` | `red-lifted` | state dots and fills that carry no text |
| `success` | `green-text` `#136E3E` | `green-lifted` | success text |
| `success-foreground` | `raised` | `ink` | text on a solid `success` fill |
| `success-fill` | `green` | `green-lifted` | state dots and fills |
| `caution` | `amber` | `amber` | caution fills. Never text (v2 §03) |
| `caution-foreground` | `ink` | `ink` | text on a caution fill |
| `raised` | `raised` | `ink-raised` | v2's name for the card surface, for blocks that are not cards |
| `mark-1` | `blue` | `paper` | the mark's top-left dot |
| `mark-2` | `red` | `paper` | top-right |
| `mark-3` | `amber` | `paper` | bottom-left |
| `mark-4` | `green` | `paper` | bottom-right |
| `groove-line` | `line` | `paper-line` | the groove's hairline |
| `groove-light` | `raised` | `clear` | the groove's 1 px highlight beneath |

That is 45 names in each theme (31 stock, 14 Pluto), 90 values.

- **The `muted` rule** (decisions.md, "A fourth ground for `muted`, insets only", 2026-10-27). v2 §02 names three grounds: paper, raised white and ink. The owner's decision allows a fourth, the flattened tint, **for component insets only**: skeletons, tab strips, code grounds, hover and selected rows. `muted`, `accent` and `sidebar-accent` are never a page, section or sidebar ground. *Why, as the decision gives it:* a `muted` equal to the card surface makes skeletons and hover rows invisible without extra borders, which adds more lines than v2 wants; a flattened tint adds no hue. The literal lint cannot enforce where a class is used, so review enforces it. This binds `002` and `003` (decision 29).
- **No state tint on `muted`, in either theme.** A component never puts `bg-destructive/10`, `bg-success/10` (light) or `/20` (dark) on or inside a `muted` or `accent` inset. Three of the four cases fail AA: destructive/10 over light `muted` 4.06; destructive/20 over dark `muted` 3.96; success/20 over dark `muted` 4.44. Success/10 over light `muted` measures 4.58 and is forbidden too, so `002` has one rule, not four cases. The token file lists the three failing pairs as forbidden, and the contrast test asserts that each still fails, so a change that makes one pass is noticed (decision 12).
- **Red and green state colours** follow the owner's answer: fills and dots use Tombaugh Red and Hydra Green, and running text uses text-safe variants (decisions.md). State is never told by colour alone; that rule binds the components of `002` and `003`.
- **The dark theme is paper on ink, with lifted accents.** This is the canvas's proposal, confirmed by the arithmetic in decision 12.
- **On ink, the mark goes paper-white.** v2 §03 refuses "colour dots on dark grounds — on ink, everything goes paper-white", and v2 §02 says "all paper on dark". So `mark-1` to `mark-4` are all `paper` in the dark theme. v2's own CSS for the monochrome mark on dark (`.paperdots`) uses `--raised` `#FFFFFF`. We follow v2's words, "paper", which is also the dark theme's one foreground. The two differ by 1.07:1, which no reader sees.
- **How this reads v2's on-ink rule.** We apply it to the mark and to decoration. We do not apply it to functional colour: links, focus, errors and success keep lifted accents in the dark theme, because a dark theme whose errors were paper-white would tell state by nothing at all. That includes state dots (`destructive-fill`, `success-fill`), decided here (decision 28). The owner's open call on coloured dots on ink concerns the icon only. If the owner reads the rule more widely, only the dark values in this table change.

### 9. One radius: 8 px, and every stock radius maps to it

- The token is `radius.case: 8`. It is emitted as `--radius: 0.5rem`.
- `--radius-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl` and `-4xl` are all `var(--radius)`. So `rounded-xs` through `rounded-4xl` all draw 8 px.
- `--radius: 0.5rem` is also written into `@theme inline`, so the bare `rounded` class draws 8 px too. Without it, `rounded` stays at Tailwind's 0.25 rem (run memo §5, EXECUTED).
- `rounded-full` is left alone. It is v2's second radius, for dot-derived shapes.
- *Why:* v2 §05 allows "two radii, total": the 8 px case radius and full round. Stock maia components use `rounded-md` up to `rounded-4xl` (registry memo §4.2). Mapping the whole scale to one value restyles them without editing their classes. The CLI would otherwise derive multiples of `--radius`, from 0.6 to 2.6. It skips any it finds already present, so ours win (run memo §5).
- *Why rem:* sizes in rem follow the reader's chosen root font size (WCAG 2.2 SC 1.4.4). At the default 16 px, 0.5 rem is exactly v2's 8 px.

### 10. Spacing: Tailwind's multiplier is the 4 px atom, and the ladder is enforced by lint

- The token is `spacing.atom: 4` with `spacing.ladder: [4, 8, 12, 16, 24, 32, 48, 64, 96]`, the owner's ladder (decisions.md).
- It is emitted as `--spacing: 0.25rem`. Tailwind multiplies it, so `p-1` is 4 px, `p-2` 8, `p-3` 12, `p-4` 16, `p-6` 24, `p-8` 32, `p-12` 48, `p-16` 64 and `p-24` 96. These are the nine ladder steps.
- The literal lint (decision 25) allows, in every spacing utility of a registry item's files, only:
  - the multipliers 0, 1, 2, 3, 4, 6, 8, 12, 16 and 24;
  - `auto`, for margins;
  - the CSS-variable form `-(--<token>)`, such as `gap-(--mark-gap)`, because the value then comes from a token.
- The spacing utilities are `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `ps`, `pe`, `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`, `ms`, `me`, `gap`, `gap-x`, `gap-y`, `space-x` and `space-y`, with any variant prefix and an optional leading `-`. The lint reads the allowed multipliers from the token file, so the ladder lives in one place.
- *Why not remove Tailwind's other steps from the theme:* stock components use off-ladder steps such as `gap-1.5` and `h-9` (registry memo §4.2). Removing them would make those classes emit nothing, silently. `002` brings each component onto the ladder when it restyles it, and the lint then holds it there. Heights and widths (`h-*`, `w-*`, `size-*`) are sizes, not spacing; v2's ladder governs gaps (v2 §05), so the lint does not restrict them.

### 11. Type: five steps on Tailwind's own names, four tracking values, three weights

| Token | Size | Line height | v2 use |
|---|---|---|---|
| `text-xs` | 12 px (0.75 rem) | 1.5 | eyebrows, captions, ids; mono 500, lowercase |
| `text-sm` | 13.5 px (0.84375 rem) | 1.6 | code, paths, data; mono 400 |
| `text-base` | 16 px (1 rem) | 1.6 | body; Geist 400 |
| `text-2xl` | 28 px (1.75 rem) | 1.2 | section headings; Plex Sans 700 |
| `text-5xl` | 44 px (2.75 rem) | 1.15 | display, one per page; Plex Sans 700 |

| Token | Value | Use |
|---|---|---|
| `tracking-display` | −0.03 em | display |
| `tracking-section` | −0.02 em | section headings |
| `tracking-eyebrow` | 0.08 em | eyebrows |
| `tracking-mark` | −0.04 em | the wordmark in the lockup (v2 §02's `.lockup`) |

| Token | Value | Emitted as | Use |
|---|---|---|---|
| `type.weight.normal` | 400 | `--font-weight-normal: 400` | body, code (v2 §04) |
| `type.weight.medium` | 500 | `--font-weight-medium: 500` | eyebrows (v2 §04) |
| `type.weight.bold` | 700 | `--font-weight-bold: 700` | headings and the wordmark (v2 §04) |
| `type.leading.none` | 1 | `--leading-none: 1` | the lockup's wordmark (decision 22) |

- Sizes and line heights come from v2 §04's scale. The display line height is v2's own: `.ts-display` has `line-height: 1.15` (v2 line 186). v2 gives none for eyebrow or code. We chose 1.5 and 1.6 (INFERRED: open for reading).
- **Weights and the one named line height are tokens.** They are written into `@theme inline` (decision 15), so `font-normal`, `font-medium`, `font-bold` and `leading-none` read our values. Tailwind's defaults are the same numbers. Making them ours puts the lockup's weight and line height under constitution §4.3, and lets the lint flag any weight or line height the token file does not hold (decision 25).
- *Why Tailwind's own names, not names like `text-display`:* `cn` merges classes the way tailwind-merge does. It reads an unknown `text-<name>` as a colour: `cn("text-display", "text-foreground")` returned `"text-foreground"`, dropping the size, while `cn("text-5xl", "text-foreground")` kept both (run memo §9, EXECUTED). Custom tracking names are not merged at all (`cn("tracking-tight", "tracking-mark")` keeps both), so a component never sets two tracking classes on one element. Tailwind's other steps (`text-lg`, `text-3xl`, and so on) stay at their defaults in 001, for the reason given in decision 10. `002` decides whether to remove them.
- The families:

| Variable | Family | Package | Font item |
|---|---|---|---|
| `--font-sans` | `'Geist Variable', system-ui, sans-serif` | `@fontsource-variable/geist` | `font-geist` |
| `--font-heading` | `'IBM Plex Sans Variable', system-ui, sans-serif` | `@fontsource-variable/ibm-plex-sans` | `font-heading-ibm-plex-sans` |
| `--font-mono` | `'JetBrains Mono Variable', ui-monospace, monospace` | `@fontsource-variable/jetbrains-mono` | `font-jetbrains-mono` |

The fallbacks are v2's (`system-ui` and `ui-monospace`).

### 12. Contrast, computed

The arithmetic is WCAG 2.2's relative luminance (run memo §8). Each sRGB channel is linearised (c / 12.92 at or below 0.04045, else ((c + 0.055) / 1.055)^2.4). L = 0.2126 R + 0.7152 G + 0.0722 B. The ratio is (L1 + 0.05) / (L2 + 0.05). Ratios are truncated to two decimals, never rounded up.

**How a colour with alpha is composited.** One rule, for every row and for the test.

- The colour is composited over its ground in sRGB: each channel is `colour × alpha + ground × (1 − alpha)`, then rounded to the nearest integer, halves up. The ratio is computed from the rounded colour, whose hex the tables show.
- **An eight-digit primitive** (`line`, `paper-line`) uses its own alpha byte ÷ 255.
- **A tint row** uses the decimal alpha the token file states: **0.1** in light and **0.2** in dark. These are the alphas of Tailwind's `/10` and `/20` modifiers, which stock components use (`bg-destructive/10`, `dark:bg-destructive/20`; run memo §7).
- **The test computes with the same decimal.** It reads 0.1 or 0.2 from the token file. To keep a half exact, it scales the decimal to tenths, `k = alpha × 10` (1 or 2), and computes each channel as `Math.floor((colour × k + ground × (10 − k)) / 10 + 0.5)`, in integers. Three channels land exactly on a half (the green channel of light rows 27 and 30, and the red channel of the forbidden success/10 over light `muted`); they round up.
- *Why exact decimals:* an earlier draft computed the light tints at alpha 26/255 (the `0x1A` byte), not 0.1, so three of its light tint ratios did not reproduce at the alpha it stated (review finding 3, EXECUTED). Every tint row below was recomputed at exactly 0.1 and 0.2 by this rule (EXECUTED, 2026-10-27, a Bun script in the session scratchpad; integer and floating-point compositing agreed on every channel).

Which pairs, and what they need.

- Text pairs need 4.5:1 (SC 1.4.3).
- Non-text pairs need 3:1 (SC 1.4.11): input borders, the focus ring, state fills, chart marks.
- The "tint" rows check stock components' state pattern: text in a state colour on a 10% (light) or 20% (dark) tint of the same colour, over a ground (run memo §7).
- Not checked, by rule: `border` and the groove are decorative, and WCAG sets no minimum for them (they measure 1.23 light and 1.31 dark on the ground). The mark is a logo, which SC 1.4.3 and 1.4.11 exempt.

The token file's `contrast` key lists these pairs by semantic name, and a unit test recomputes every row from the token file in both themes.

**Two recorded exceptions.** `chart-3` (amber) measures 1.81 on `background` and 1.95 on `card` in the light theme. v2 forbids a new hue, and it fixes the four chart colours. So the exception stands. **Any figure that uses `chart-3` in the light theme labels that series directly** (a text label or a pattern beside the mark), so the series is not told by colour alone. That rule binds the chart work of a later specification. The test asserts exactly these 2 exceptions, so a third cannot slip in.

**Three forbidden pairs.** The token file lists, under `contrast.forbidden`, the state tints on `muted` that fail: destructive/10 over light `muted` (`#E6D7D3`, 4.06), destructive/20 over dark `muted` (`#553D3F`, 3.96), and success/20 over dark `muted` (`#324C42`, 4.44). The test asserts each measures below 4.5 and equals its stated ratio. The rule they enforce is in decision 8: no state tint on `muted`, in either theme.

**What stock components do that fails, for `002`.** Stock `focus-visible:ring-ring/50` measures 2.22 (light) and 2.65 (dark) composited over the ground (run memo §8). `002` restyles every focus style to the solid `ring`. Stock `bg-input/30` fills controls with 30% of the border colour, which is now dark enough to grey them; `002` replaces it. The thinnest tint that passes is destructive/10 over light `background`, at 4.55. State tints on `muted` are forbidden (above).

**Light theme** (50 pairs)

| # | Kind | Pair | Foreground | Background | Ratio | Minimum | Result |
|---|---|---|---|---|---|---|---|
| 1 | text | foreground on background | `#14161C` | `#F7F7F4` | 16.84 | 4.5 | pass |
| 2 | text | card-foreground on card | `#14161C` | `#FFFFFF` | 18.08 | 4.5 | pass |
| 3 | text | popover-foreground on popover | `#14161C` | `#FFFFFF` | 18.08 | 4.5 | pass |
| 4 | text | secondary-foreground on secondary | `#14161C` | `#FFFFFF` | 18.08 | 4.5 | pass |
| 5 | text | foreground on muted | `#14161C` | `#EAEAE7` | 15.00 | 4.5 | pass |
| 6 | text | accent-foreground on accent | `#14161C` | `#EAEAE7` | 15.00 | 4.5 | pass |
| 7 | text | muted-foreground on background | `#4A4F5C` | `#F7F7F4` | 7.63 | 4.5 | pass |
| 8 | text | muted-foreground on card | `#4A4F5C` | `#FFFFFF` | 8.18 | 4.5 | pass |
| 9 | text | muted-foreground on muted | `#4A4F5C` | `#EAEAE7` | 6.79 | 4.5 | pass |
| 10 | text | primary-foreground on primary | `#FFFFFF` | `#2456E6` | 5.91 | 4.5 | pass |
| 11 | text | primary on background | `#2456E6` | `#F7F7F4` | 5.51 | 4.5 | pass |
| 12 | text | primary on card | `#2456E6` | `#FFFFFF` | 5.91 | 4.5 | pass |
| 13 | text | primary on muted | `#2456E6` | `#EAEAE7` | 4.90 | 4.5 | pass |
| 14 | text | destructive on background | `#C42A1F` | `#F7F7F4` | 5.29 | 4.5 | pass |
| 15 | text | destructive on card | `#C42A1F` | `#FFFFFF` | 5.67 | 4.5 | pass |
| 16 | text | destructive on muted | `#C42A1F` | `#EAEAE7` | 4.71 | 4.5 | pass |
| 17 | text | destructive-foreground on destructive | `#FFFFFF` | `#C42A1F` | 5.67 | 4.5 | pass |
| 18 | text | success on background | `#136E3E` | `#F7F7F4` | 5.87 | 4.5 | pass |
| 19 | text | success on card | `#136E3E` | `#FFFFFF` | 6.31 | 4.5 | pass |
| 20 | text | success on muted | `#136E3E` | `#EAEAE7` | 5.23 | 4.5 | pass |
| 21 | text | success-foreground on success | `#FFFFFF` | `#136E3E` | 6.31 | 4.5 | pass |
| 22 | text | caution-foreground on caution | `#14161C` | `#F0AE12` | 9.27 | 4.5 | pass |
| 23 | text | sidebar-foreground on sidebar | `#14161C` | `#F7F7F4` | 16.84 | 4.5 | pass |
| 24 | text | sidebar-primary-foreground on sidebar-primary | `#FFFFFF` | `#2456E6` | 5.91 | 4.5 | pass |
| 25 | text | sidebar-accent-foreground on sidebar-accent | `#14161C` | `#EAEAE7` | 15.00 | 4.5 | pass |
| 26 | text | sidebar-primary on sidebar | `#2456E6` | `#F7F7F4` | 5.51 | 4.5 | pass |
| 27 | text | destructive on destructive/10 over background | `#C42A1F` | `#F2E3DF` | 4.55 | 4.5 | pass |
| 28 | text | destructive on destructive/10 over card | `#C42A1F` | `#F9EAE9` | 4.86 | 4.5 | pass |
| 29 | text | success on success/10 over background | `#136E3E` | `#E0E9E2` | 5.08 | 4.5 | pass |
| 30 | text | success on success/10 over card | `#136E3E` | `#E7F1EC` | 5.46 | 4.5 | pass |
| 31 | non-text | input on background | `#7C808B` | `#F7F7F4` | 3.67 | 3 | pass |
| 32 | non-text | input on card | `#7C808B` | `#FFFFFF` | 3.94 | 3 | pass |
| 33 | non-text | input on muted | `#7C808B` | `#EAEAE7` | 3.27 | 3 | pass |
| 34 | non-text | ring on background | `#2456E6` | `#F7F7F4` | 5.51 | 3 | pass |
| 35 | non-text | ring on card | `#2456E6` | `#FFFFFF` | 5.91 | 3 | pass |
| 36 | non-text | sidebar-ring on sidebar | `#2456E6` | `#F7F7F4` | 5.51 | 3 | pass |
| 37 | non-text | destructive-fill on background | `#E23A2E` | `#F7F7F4` | 4.01 | 3 | pass |
| 38 | non-text | destructive-fill on card | `#E23A2E` | `#FFFFFF` | 4.30 | 3 | pass |
| 39 | non-text | success-fill on background | `#1E9E56` | `#F7F7F4` | 3.21 | 3 | pass |
| 40 | non-text | success-fill on card | `#1E9E56` | `#FFFFFF` | 3.45 | 3 | pass |
| 41 | non-text | chart-1 on background | `#2456E6` | `#F7F7F4` | 5.51 | 3 | pass |
| 42 | non-text | chart-1 on card | `#2456E6` | `#FFFFFF` | 5.91 | 3 | pass |
| 43 | non-text | chart-2 on background | `#E23A2E` | `#F7F7F4` | 4.01 | 3 | pass |
| 44 | non-text | chart-2 on card | `#E23A2E` | `#FFFFFF` | 4.30 | 3 | pass |
| 45 | non-text | chart-3 on background | `#F0AE12` | `#F7F7F4` | 1.81 | 3 | exception |
| 46 | non-text | chart-3 on card | `#F0AE12` | `#FFFFFF` | 1.95 | 3 | exception |
| 47 | non-text | chart-4 on background | `#1E9E56` | `#F7F7F4` | 3.21 | 3 | pass |
| 48 | non-text | chart-4 on card | `#1E9E56` | `#FFFFFF` | 3.45 | 3 | pass |
| 49 | non-text | chart-5 on background | `#4A4F5C` | `#F7F7F4` | 7.63 | 3 | pass |
| 50 | non-text | chart-5 on card | `#4A4F5C` | `#FFFFFF` | 8.18 | 3 | pass |

**Dark theme** (50 pairs)

| # | Kind | Pair | Foreground | Background | Ratio | Minimum | Result |
|---|---|---|---|---|---|---|---|
| 1 | text | foreground on background | `#F7F7F4` | `#14161C` | 16.84 | 4.5 | pass |
| 2 | text | card-foreground on card | `#F7F7F4` | `#1E2129` | 14.99 | 4.5 | pass |
| 3 | text | popover-foreground on popover | `#F7F7F4` | `#1E2129` | 14.99 | 4.5 | pass |
| 4 | text | secondary-foreground on secondary | `#F7F7F4` | `#1E2129` | 14.99 | 4.5 | pass |
| 5 | text | foreground on muted | `#F7F7F4` | `#2B2D32` | 12.83 | 4.5 | pass |
| 6 | text | accent-foreground on accent | `#F7F7F4` | `#2B2D32` | 12.83 | 4.5 | pass |
| 7 | text | muted-foreground on background | `#A9ADB8` | `#14161C` | 8.05 | 4.5 | pass |
| 8 | text | muted-foreground on card | `#A9ADB8` | `#1E2129` | 7.17 | 4.5 | pass |
| 9 | text | muted-foreground on muted | `#A9ADB8` | `#2B2D32` | 6.13 | 4.5 | pass |
| 10 | text | primary-foreground on primary | `#14161C` | `#7A9BFF` | 6.85 | 4.5 | pass |
| 11 | text | primary on background | `#7A9BFF` | `#14161C` | 6.85 | 4.5 | pass |
| 12 | text | primary on card | `#7A9BFF` | `#1E2129` | 6.10 | 4.5 | pass |
| 13 | text | primary on muted | `#7A9BFF` | `#2B2D32` | 5.22 | 4.5 | pass |
| 14 | text | destructive on background | `#FF7D73` | `#14161C` | 7.26 | 4.5 | pass |
| 15 | text | destructive on card | `#FF7D73` | `#1E2129` | 6.46 | 4.5 | pass |
| 16 | text | destructive on muted | `#FF7D73` | `#2B2D32` | 5.53 | 4.5 | pass |
| 17 | text | destructive-foreground on destructive | `#14161C` | `#FF7D73` | 7.26 | 4.5 | pass |
| 18 | text | success on background | `#4CC982` | `#14161C` | 8.59 | 4.5 | pass |
| 19 | text | success on card | `#4CC982` | `#1E2129` | 7.65 | 4.5 | pass |
| 20 | text | success on muted | `#4CC982` | `#2B2D32` | 6.55 | 4.5 | pass |
| 21 | text | success-foreground on success | `#14161C` | `#4CC982` | 8.59 | 4.5 | pass |
| 22 | text | caution-foreground on caution | `#14161C` | `#F0AE12` | 9.27 | 4.5 | pass |
| 23 | text | sidebar-foreground on sidebar | `#F7F7F4` | `#14161C` | 16.84 | 4.5 | pass |
| 24 | text | sidebar-primary-foreground on sidebar-primary | `#14161C` | `#7A9BFF` | 6.85 | 4.5 | pass |
| 25 | text | sidebar-accent-foreground on sidebar-accent | `#F7F7F4` | `#2B2D32` | 12.83 | 4.5 | pass |
| 26 | text | sidebar-primary on sidebar | `#7A9BFF` | `#14161C` | 6.85 | 4.5 | pass |
| 27 | text | destructive on destructive/20 over background | `#FF7D73` | `#432B2D` | 5.19 | 4.5 | pass |
| 28 | text | destructive on destructive/20 over card | `#FF7D73` | `#4B3338` | 4.60 | 4.5 | pass |
| 29 | text | success on success/20 over background | `#4CC982` | `#1F3A30` | 5.85 | 4.5 | pass |
| 30 | text | success on success/20 over card | `#4CC982` | `#27433B` | 5.11 | 4.5 | pass |
| 31 | non-text | input on background | `#787C8A` | `#14161C` | 4.34 | 3 | pass |
| 32 | non-text | input on card | `#787C8A` | `#1E2129` | 3.86 | 3 | pass |
| 33 | non-text | input on muted | `#787C8A` | `#2B2D32` | 3.31 | 3 | pass |
| 34 | non-text | ring on background | `#7A9BFF` | `#14161C` | 6.85 | 3 | pass |
| 35 | non-text | ring on card | `#7A9BFF` | `#1E2129` | 6.10 | 3 | pass |
| 36 | non-text | sidebar-ring on sidebar | `#7A9BFF` | `#14161C` | 6.85 | 3 | pass |
| 37 | non-text | destructive-fill on background | `#FF7D73` | `#14161C` | 7.26 | 3 | pass |
| 38 | non-text | destructive-fill on card | `#FF7D73` | `#1E2129` | 6.46 | 3 | pass |
| 39 | non-text | success-fill on background | `#4CC982` | `#14161C` | 8.59 | 3 | pass |
| 40 | non-text | success-fill on card | `#4CC982` | `#1E2129` | 7.65 | 3 | pass |
| 41 | non-text | chart-1 on background | `#7A9BFF` | `#14161C` | 6.85 | 3 | pass |
| 42 | non-text | chart-1 on card | `#7A9BFF` | `#1E2129` | 6.10 | 3 | pass |
| 43 | non-text | chart-2 on background | `#FF7D73` | `#14161C` | 7.26 | 3 | pass |
| 44 | non-text | chart-2 on card | `#FF7D73` | `#1E2129` | 6.46 | 3 | pass |
| 45 | non-text | chart-3 on background | `#F0AE12` | `#14161C` | 9.27 | 3 | pass |
| 46 | non-text | chart-3 on card | `#F0AE12` | `#1E2129` | 8.25 | 3 | pass |
| 47 | non-text | chart-4 on background | `#4CC982` | `#14161C` | 8.59 | 3 | pass |
| 48 | non-text | chart-4 on card | `#4CC982` | `#1E2129` | 7.65 | 3 | pass |
| 49 | non-text | chart-5 on background | `#A9ADB8` | `#14161C` | 8.05 | 3 | pass |
| 50 | non-text | chart-5 on card | `#A9ADB8` | `#1E2129` | 7.17 | 3 | pass |

### 13. The groove, focus and hairlines

- **The groove** is v2's one line primitive: "a hairline of Ink at 8–10% with a 1 px white line beneath it on paper grounds" (v2 §05). It becomes a Tailwind utility, `groove`: `border-top: var(--line-width) solid var(--groove-line)` and `box-shadow: inset 0 var(--line-width) 0 var(--groove-light)`.
- **In the dark theme the groove is a plain hairline.** v2 specifies the white line only "on paper grounds". On ink, a light line under a light line reads as a ridge, not a groove (INFERRED). So `groove-light` is `clear` in dark.
- **Focus.** `@layer base { :focus-visible { outline: var(--focus-width) solid var(--ring); outline-offset: var(--focus-offset) } }`, with `focus.width: 2` and `focus.offset: 2`. Every focusable element without its own focus style gets a solid ring that passes 3:1 (decision 12). `shadcn-svelte init` writes `* { @apply outline-ring/50 }` into apps; `:focus-visible` is more specific, so our solid ring wins when it matters (INFERRED from CSS specificity).
- **Hairlines and the focus outline stay in px** (`--line-width: 1px`, `--focus-width: 2px`, `--focus-offset: 2px`). A hairline that scaled with the root font size would blur at fractional pixels (INFERRED).
- **`color-scheme`.** `:root` sets `color-scheme: light` and `.dark` sets `color-scheme: dark`, so scrollbars and native controls follow the theme.
- **Elevation** (shadows for menus and dialogs only, v2 §05) is out of scope; `002` adds it with the first menu.

### 14. Motion

| Token | Value | Emitted as |
|---|---|---|
| `motion.entranceMs` | 900 | `--motion-entrance: 900ms` in `:root` |
| `motion.microMs` | 200 | `--motion-micro: 200ms` in `:root`, and `--default-transition-duration: 200ms` in `@theme inline` |
| `motion.easeEntrance` | `[0.2, 0.7, 0.3, 1]` | `--ease-entrance: cubic-bezier(0.2, 0.7, 0.3, 1)` in `@theme inline`, the utility `ease-entrance` |

- These are v2 §06's budgets: one entrance of at most 900 ms, ease-out, and micro-feedback of at most 200 ms. The curve is v2's own cover animation (`dockin`), an ease-out.
- `--default-transition-duration` makes Tailwind's plain `transition` class use 200 ms, not Tailwind's 150 ms (run memo §5).
- **Reduced motion.** Under `@media (prefers-reduced-motion: reduce)`:
  - **`html:root`** sets `--motion-entrance: 0ms` and `--motion-micro: 0ms`.
  - `*, ::before, ::after` get `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: 0.01ms !important` and `scroll-behavior: auto !important`.
  - *Why both:* our own components read the tokens. Third-party animation (stock components, `tw-animate-css`) does not, so the catch-all stops it. 0.01 ms, not 0, still fires `animationend`, and an animation with `forwards` fill lands on its last frame. That is v2's "composed end state, never a blank" (INFERRED).
- **Why `html:root`, never `:root`, inside the media query.** On every `add` of `pluto-theme`, or of any item that depends on it, the CLI writes the 45 light colours and `radius` into every rule whose selector is `:root`, including rules nested in at-rules (READ: `cli/src/utils/updaters/update-css-vars.ts`; review finding 1). Theme items skip the "already installed" check, so this happens on every such `add`. A nested `:root` rule therefore receives the light palette on the second `add`. It comes after `.dark` at equal specificity, so a reduced-motion user who chose dark gets the light palette (review finding 1, EXECUTED in Chromium). `html:root` is not the selector `:root` to the CLI, so it is left alone. Its specificity (0,1,1) beats `:root` (0,1,0), so the motion tokens still read 0 ms under reduce. Plain `html` would lose to `:root` and read 900 ms. With `html:root`, a second `add` left the CSS byte-identical, dark stayed dark, and `--motion-entrance` read `0ms` under reduce (review, EXECUTED).
- The rule, for every later edit of the token CSS: **no rule nested in an at-rule uses the selector `:root` or `.dark`.** `generated.test.ts` asserts it, and the smoke test asserts that a second `add` changes nothing (decision 25).
- The orbit-assemble entrance itself is `003`'s.

### 15. What `build-tokens` emits, and what the CLI derives itself

`bun run build:tokens` reads the token file and writes two things.

**(a) Into `registry.json`**, replacing these fields and leaving everything else as written:

- `pluto-theme`'s `cssVars.light`: the 45 semantic colours (light values) and `radius: 0.5rem`.
- `pluto-theme`'s `cssVars.dark`: the 45 semantic colours (dark values).
- `pluto-theme`'s `cssVars.theme`, for Tailwind's `@theme inline`:
  - `radius` and `radius-xs` to `radius-4xl` (decision 9);
  - `spacing` (decision 10);
  - `text-xs`, `text-sm`, `text-base`, `text-2xl`, `text-5xl`, each with its `--line-height` (decision 11);
  - `tracking-display`, `tracking-section`, `tracking-eyebrow`, `tracking-mark`;
  - `font-weight-normal`, `font-weight-medium`, `font-weight-bold`, `leading-none` (decision 11);
  - `ease-entrance`, `default-transition-duration` (decision 14).
- `pluto-theme`'s `css`:
  - `:root`: `--mark-dot`, `--mark-gap`, `--mark-rise`, `--mark-lockup-gap`, `--mark-lift` (decision 16), `--motion-entrance`, `--motion-micro`, `--line-width`, `--focus-width`, `--focus-offset`, `color-scheme: light`;
  - `.dark`: `color-scheme: dark`;
  - `@media (prefers-reduced-motion: reduce)`: the two rules of decision 14, `html:root` and `*, ::before, ::after`;
  - `@utility groove`;
  - `@layer base`: `body { @apply bg-background text-foreground }`, `h1, h2, h3, h4, h5, h6 { @apply font-heading }`, and the `:focus-visible` rule. The heading rule is ours because the CLI's font setup deliberately skips `--font-heading` (run memo §4), and v2 §04 sets every heading in IBM Plex Sans.
- The `font` object of each of the three font items (decision 17).

`pluto-theme`'s `devDependencies` field, `["shadcn-svelte@^1.7.1"]`, is hand-written in `registry.json`, not emitted (decision 19).

**(b) `src/app.css`**, the preview app's stylesheet. It is the CSS an app would hold after `add pluto-theme`:

- `@import "tailwindcss"`, the three font packages, and `shadcn-svelte/tailwind.css`;
- `@custom-variant dark (&:is(.dark *))`;
- `:root` and `.dark` with the variables above;
- `@theme inline` with `cssVars.theme`, the three `--font-*` entries, and `--color-<name>: var(--<name>)` for each of the 45 colours;
- the `css` rules, and the font items' `@layer base` rules.

**Both outputs are formatted by prettier before they are written.** `build-tokens` passes each file's text through prettier's API (`format`, with the options `resolveConfig` finds for that path), so `prettier --check` passes on them (decision 26). `generated.test.ts` compares the formatted text. `build-tokens` writes a file only when its formatted content changes.

Rules for where a token goes. These come from what the run saw (run memo §5) and from the review.

- **A token a component reads through `var()` goes in `:root`.** Tailwind inlines `@theme inline` values into utilities and does not emit them as variables.
- **A token that should become a Tailwind utility goes in `cssVars.theme`.**
- **Never put declarations directly inside an at-rule in `css`.** The CLI treats an at-rule's children as rules and fails on a declaration.
- **Never use the selector `:root` or `.dark` in a rule nested inside an at-rule in `css`.** The CLI writes the theme's colours into it on every later `add` (decision 14).

What the CLI derives on its own when an app adds `pluto-theme` (registry memo §1.5; run memo §5). `build-tokens` reproduces it in `src/app.css`, so the preview shows what an app gets.

- `--color-<name>: var(--<name>)` in `@theme inline`, for every colour in `light` or `dark`;
- `@custom-variant dark (&:is(.dark *))`;
- `@import "shadcn-svelte/tailwind.css"`;
- the `--radius-sm` to `--radius-4xl` multiples, which it skips here because ours exist;
- for the font items: the `@import`s, the `--font-*` entries and the `@layer base` rules (decision 17).

Both written files are committed. A unit test fails if either differs from a fresh run (decision 25). *Why commit generated files:* a token change then shows in review as the exact CSS an app will receive.

### 16. The mark's geometry as tokens

| Token | Value | v2 / D-0002 |
|---|---|---|
| `--mark-dot` | 0.3 em | dot diameter .30 em |
| `--mark-gap` | 0.08 em | gap .08 em |
| `--mark-rise` | 0.38 em | lockup rise .38 em |
| `--mark-lockup-gap` | 0.16 em | the space between wordmark and mark (v2's `.lockup` gap) |

- em, so the mark scales with the font size it sits in, as v2 specifies ("all values relative to the lockup's font size").
- The lockup's lift is derived, not a fifth value: `--mark-lift: calc(var(--mark-rise) + var(--mark-dot) + var(--mark-gap))`, which is 0.76 em. v2 §02 explains the sum: a flex row aligns the mark by its top-left dot, so the lift adds one row. The `Lockup` applies it as `-translate-y-(--mark-lift)`.
- Clearspace (one dot-pair height) and minimum size (the mark alone below 20 px of lockup height) are usage rules. The four-dot preview page shows both. No component enforces them, because a component cannot know its surroundings.

### 17. Three `registry:font` items

- `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono`, each with `files: []` and one `font` object.
- Each `font` holds `family`, `provider: "google"`, `import`, `variable`, `subsets: ["latin"]` and `dependency` (the package). `font-jetbrains-mono` adds `selector: "code, kbd, samp, pre"`.
- *Why three items, not one "fonts" item:* a `registry:font` item carries exactly one font (run memo §4, READ). One item for all three would have to be a `registry:theme` that hand-writes the `@import`s and dependencies, which is the CLI's job.
- *Why the selector on mono:* the CLI applies each non-heading font to `html` unless a selector says otherwise. Without one, `font-sans` and `font-mono` would both be applied to `html` (run memo §4). With it, body text is Geist and code is JetBrains Mono (run memo §4, EXECUTED).
- *Why these names:* they are the names shadcn-svelte's own maia registry uses for the same three faces (run memo §4). An app that switches from the official registry to ours keeps meaningful names. We set `dependency` explicitly, so the CLI does not derive it from the name.
- `pluto-theme` lists the three as `registryDependencies`. One `add pluto-theme` brings the whole type stack.
- **The font items cannot pin a version.** `dependency` is also the `@import` specifier, so it cannot carry one (run memo §4). The CLI installs the latest release with a caret (`^5.3.0` on 2026-10-27, run memo §4). The app's `bun.lock` pins it. We accept this; it is how the CLI is built.
- `import` is required by the schema and unused by `add`. We set it to the Google Fonts name (`Geist`, `IBM_Plex_Sans`, `JetBrains_Mono`), as the maia items do.

### 18. The registry is generated into `static/`, and deployed from `build/`

- `bun run build:registry` runs `scripts/build-registry.ts`. It spawns the locked local CLI under Bun (decision 1):
  `[process.execPath, '--bun', 'node_modules/.bin/shadcn-svelte', 'registry', 'build', 'registry.json', '--output', '<out>/r/styles/maia']`.
- The CLI writes files but deletes none. So the script builds into a fresh temporary folder inside `<out>`, and only when the CLI exits 0 does it replace `<out>/r/styles/maia/` with it. A removed or renamed item leaves no stale file to be served or deployed, and a failed build leaves the last good registry in place (change review finding 3).
- It then copies `<out>/r/styles/maia/` to `<out>/v<version>/r/styles/maia/`, where `<version>` is `package.json`'s `version`, after clearing that folder.
- `<out>` is `static` by default. `--out <dir>` sets another folder; `registry.test.ts` uses it to build into a temporary folder (decision 25).
- `vite build` copies `static/` into `build/`. **The deployable output therefore holds `build/r/styles/maia/`**, the path the roadmap fixes, and `build/v0.1.0/r/styles/maia/` (run memo §6, EXECUTED for the first).
- *Why `static/`, not `build/` directly:* the SvelteKit dev server serves `static/` and nothing else, and it served `static/r/` at `/r/` (run memo §6, EXECUTED; toolchain memo §3 under Bun). Writing straight into `build/` would leave the dev server with no registry. Generated JSON stays out of git, because `static/r/` and `static/v*/` are ignored.
- *Why `/styles/maia/`:* the CLI appends `/styles/<style>` to the registry URL, and `style` must be one of eight presets (registry memo §1.7). We use `maia`, as `hq/web` does.
- **The versioned path.** An app pins a release by setting its registry to `https://ui.plutosystems.co/v0.1.0/r`. `/r` always holds the latest. An update is then a deliberate change of one URL (registry memo §2).
  - `package.json`'s `version` is `0.1.0` when this specification lands.
  - Each release is a git tag `v<version>`. Keeping older releases' paths on the host after a new deploy is the deployment specification's job: a deploy of one build holds only its own version.

### 19. `registry.json`

- `"$schema": "https://shadcn-svelte.com/schema/registry.json"`, `"name": "pluto"`, `"homepage": "https://ui.plutosystems.co"`.
  - The host is the registry memo's recommendation (§2), on the platform D-0001 already chose. `homepage` is metadata: changing it later changes nothing an app installs.
- `"aliases"`: `components` `#lib/registry/components`, `ui` `#lib/registry/ui`, `hooks` `#lib/registry/hooks`, `utils` `#lib/utils`, `lib` `#lib/registry/lib`.
  - *How `build` uses them:* it replaces each alias string with its placeholder (`$COMPONENTS$`, `$UI$`, `$HOOKS$`, `$UTILS$`, `$LIB$`), in the order components, ui, hooks, utils, lib, each with a plain `replaceAll` (READ: `transformAliases` in `cli/src/commands/registry/build.ts`, `ALIASES` in `cli/src/constants.ts`). The run confirmed `#lib/utils` became `$UTILS$` (run memo §2).
  - *Why `lib` is never bare `#lib`:* replaced last, a bare `#lib` would rewrite every `#lib/...` path that no earlier alias matched. For example, `#lib/registry/blocks/x` would become `$LIB$/registry/blocks/x`, which resolves wrongly in an app. The order does not protect against this; only the aliases do.
  - *A trap for `003`:* no alias covers `#lib/registry/blocks/...`. An import of that form survives `build` untransformed. The "no `#lib` in built content" assertion of `registry.test.ts` catches it. Decision 29 keeps blocks from importing one another.
- **Our own dependencies are bare names** (`"pluto-theme"`, `"utils"`), never `local:`. `local:` fails when an item is added by name, because `build` leaves it raw in `index.json` (registry memo §1.4, EXECUTED). Bare names resolved transitively in the run (run memo §6).
- **Items, in this order:**

| Name | Type | Files | `registryDependencies` | npm packages |
|---|---|---|---|---|
| `pluto-theme` | `registry:theme` | none | `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono` | `shadcn-svelte@^1.7.1`, through a hand-written `devDependencies` |
| `font-geist` | `registry:font` | none | none | `@fontsource-variable/geist`, through `font.dependency` |
| `font-heading-ibm-plex-sans` | `registry:font` | none | none | `@fontsource-variable/ibm-plex-sans` |
| `font-jetbrains-mono` | `registry:font` | none | none | `@fontsource-variable/jetbrains-mono` |
| `utils` | `registry:lib` | `src/lib/utils.ts` | none | `cn`, detected by `build` |
| `four-dot` | `registry:ui` | `src/lib/registry/ui/four-dot/four-dot.svelte`, `lockup.svelte`, `index.ts` | `utils`, `pluto-theme` | none of its own; `shadcn-svelte` through `pluto-theme` |

- **Why `pluto-theme` names `shadcn-svelte`.** Whenever an item carries `cssVars` or `css`, `add` writes `@import "shadcn-svelte/tailwind.css"` into the app's CSS (READ: `cli/src/utils/add-registry-items.ts`, where it merges `shadcnSvelteTailwindCssImport`; EXECUTED in the run and the review). An app that runs the CLI through `bunx`, as `wasi-python-dev` does, has no `shadcn-svelte` in its own `node_modules`, so its build could not resolve that import (run memo §6, INFERRED there). Constitution §4.6 asks the item to name what it needs.
  - *How:* `"devDependencies": ["shadcn-svelte@^1.7.1"]` on `pluto-theme` in `registry.json`. The item schema allows `dependencies` and `devDependencies` on every item type (READ: `cli/src/utils/registry/schema.ts`). `build` keeps an item's own `devDependencies` as written; it adds detected packages only from files, and this item has none (READ: `cli/src/commands/registry/build.ts`). `add` installs a theme item's `devDependencies` like any other item's, and skips a package the app already has at a satisfying version (READ: `add-registry-items.ts`, `install-deps.ts`).
  - *Why the item, not a documented precondition:* a precondition is a step an app can miss, and the failure appears only at its next build. The item field makes `add` do it.
  - The smoke test proves it: its scratch apps start without `shadcn-svelte`, and after `add` their `package.json` holds it and their build passes (decision 25).

`build` never records `svelte` or `@sveltejs/kit`, even when a component imports types from `svelte/elements` (READ: `IGNORE_DEPS` in `cli/src/commands/registry/deps-resolver.ts`). So `four-dot` names no npm package, and `utils` names only `cn`.

- Every item has a `title`, a one-sentence `description`, `author: "Pluto Systems <https://plutosystems.co>"`, and `meta: { "since": "0.1.0" }`.
- **Every `registry:ui` item has at least two files.** A one-file item installs flat (`ui/four-dot.svelte`), not in its own folder (run memo §6, EXECUTED). An `index.ts` that re-exports the components is always the second file.
- **The changelog** (constitution §6). `CHANGELOG.md` gets a dated `## 0.1.0 — <landing date>` entry with one line per item. Later releases add an entry and mark any change to an item's interface as such. `registry.test.ts` checks it (decision 25).

### 20. The `utils` item

- One file, `src/lib/utils.ts`. The CLI special-cases an item named `utils`: it installs the file at the app's `utils` alias path, plus `.ts` when that path has no extension (READ: `resolveItemFilePath` in `cli/src/utils/registry/index.ts`). In an app whose `utils` alias is `#lib/utils` or `$lib/utils`, that is `src/lib/utils.ts`, where stock components import it from. It does not install at the `lib` alias.
- It exports:
  - `cn`, re-exported from the `cn` package;
  - four types, with the names stock components import: `WithoutChild<T>` (T without its `child` prop), `WithoutChildren<T>` (without `children`), `WithoutChildrenOrChild<T>` (without both), `WithElementRef<T, U extends HTMLElement = HTMLElement>` (T plus an optional `ref?: U | null`).
- *Why this shape:* shadcn-svelte 1.7.x's own `utils` has this interface (run memo §7). Stock components installed in `002` import exactly these names, so ours must provide them. We write our own file to that interface. We do not copy theirs.
- *A consequence for this repository:* our `utils` alias is `#lib/utils`, so an `add` of a stock component from the official registry would write the official `utils` over `src/lib/utils.ts` when run with `-o`. Decision 29 tells `002` how to avoid it.

### 21. The preview app's `components.json`

```json
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "tailwind": { "css": "src/app.css", "baseColor": "neutral" },
  "aliases": {
    "components": "#lib/registry/components",
    "utils": "#lib/utils",
    "ui": "#lib/registry/ui",
    "hooks": "#lib/registry/hooks",
    "lib": "#lib/registry/lib"
  },
  "typescript": true,
  "registry": "https://shadcn-svelte.com/registry",
  "style": "maia",
  "iconLibrary": "phosphor",
  "menuColor": "default",
  "menuAccent": "subtle"
}
```

- The aliases equal `registry.json`'s, so a stock component that `002` installs with `add` lands in `src/lib/registry/ui/<name>/`, ready to restyle and publish.
- `registry` points at the official registry, because this repository installs stock components from there (constitution §4.6).
- **`"style": "maia"` is required.** The CLI's default style is `nova`. Without the field, `add` fetched `/r/styles/nova/index.json` and failed with 404 (toolchain memo §7, EXECUTED). The same holds for every app that installs from here (decision 23).
- `iconLibrary: "phosphor"` follows `hq/web`. No icon package is added until an item uses one.
- **`menuColor: "default"`, not `hq/web`'s `"default-translucent"`.** The translucent setting inlines `backdrop-blur-2xl` into every menu (run memo §7). v2 §09 bans glassmorphism.

### 22. The `four-dot` item: the mark and the lockup

Two components, exported from `index.ts` as `FourDot` and `Lockup`.

**`FourDot`**, the mark.

- Four dots in a two-by-two grid, in v2's order: `mark-1` top-left, `mark-2` top-right, `mark-3` bottom-left, `mark-4` bottom-right. Blue, red, amber, green in light; all paper in dark.
- Each dot is `--mark-dot` square and fully round. The grid gap is `--mark-gap`.
- Props:
  - `tone?: "brand" | "mono"`, default `"brand"`. `"mono"` paints every dot `currentColor` (`bg-current`): v2's "all ink, or all paper on dark".
  - `label?: string`. Without it, the root has `aria-hidden="true"`: decoration. With it, the root has `role="img"` and `aria-label={label}`, for a mark that stands alone, such as inside a link.
  - `class?: string`, merged with `cn`, and the remaining attributes spread onto the root `<span>`.
- No prop recolours or reorders a dot. v2 §02: "never recolored, never reordered, never three dots".

**`Lockup`**, the wordmark with the displaced mark.

- The lowercase word "pluto" in `font-heading font-bold tracking-mark leading-none`. All four are token classes: the family, the weight and the line height come from the token file (decision 11). Then `FourDot` (decorative), lifted by `--mark-lift` (0.76 em).
- The row is `inline-flex`, `items-baseline`, gap `--mark-lockup-gap`: v2 §02's reference implementation, expressed in tokens.
- Props:
  - `href?: string`. With it, the root is an `<a>`, and its accessible name is `label`. Without it, the root is a `<span>`, and the name a screen reader hears is the word "pluto".
  - `label?: string`, default `"Pluto Systems"`. It contains the visible word, so speech users can say what they see (SC 2.5.3).
  - `tone`, `class` and the rest, as for `FourDot`.
- The link gets the global focus outline (decision 13). The component sets no focus style of its own.
- Sizes are inherited. An app sets the lockup's size with a text class.

Both are Svelte 5 runes components (`$props`), as stock components are (registry memo §1.1). Neither has a `<style>` block or a `style` attribute. Every colour and size comes from a token class (decision 25).

### 23. The dev loop

- `bun run dev` runs `bun --bun vite dev`. The registry is then at `http://localhost:5173/r/styles/maia/index.json`.
- **A watcher builds and rebuilds.** `scripts/registry-watch.ts` is a Vite plugin, registered in `vite.config.ts`, active only in `serve` mode.
  - **At start**, in its `configureServer` hook, it runs `build:tokens`, then `build:registry`, and awaits both before the server listens. So any `vite dev`, including the one the smoke test starts, serves a fresh registry on a clean clone (review finding 13). If either start-up build fails, `vite dev` stops with the build's own error; a failed rebuild while watching is logged and the last good registry stays served (change review finding 10).
  - It then watches `tokens/`, `registry.json`, `src/lib/registry/` and `src/lib/utils.ts`, through Vite's own file watcher.
  - A change under `tokens/` runs `build:tokens`, then `build:registry`. Any other watched change runs `build:registry` only.
  - Runs are debounced by 200 ms and never overlap; a change during a run queues one more run.
  - `build:tokens` writes a file only when its content changes. So its own write to `registry.json` triggers one registry build and no loop.
  - It runs the builds by calling the functions the two scripts export. `build:registry` spawns the CLI with `--bun` in argv (decision 18).
- *Why a Vite plugin:* the CLI's `build` has no watch mode (registry memo §1.6). Vite already watches files, so this adds no dependency and needs no second terminal. Vite's watcher has not yet been exercised under Bun beyond start-up (toolchain memo §12); `dev-loop.test.ts` is its first test.
- **Installing into `wasi-python-dev` during development.** The app keeps the published URL in its `components.json` and installs from here with
  `REGISTRY_URL=http://localhost:5173/r bunx --bun shadcn-svelte@1.7.1 add <item> -y -o`.
  - The CLI appends `/styles/maia` itself (registry memo §1.7). `-o` is needed, because `-y` alone still prompts before changing the app's CSS (registry memo §1.9).
  - `--bun` runs the CLI under Bun; it must come before the package name (toolchain memo §1, READ).
  - `bunx pkg@version` runs a copy outside the app's `bun.lock`. For the first install there is no other copy. After it, `pluto-theme` has put `shadcn-svelte@^1.7.1` in the app's `devDependencies`, so the app may run its own locked copy with `bun --bun shadcn-svelte add …`. Which it uses is that app's choice.
  - **What the app needs** before its first `add`: `components.json` with `"style": "maia"` (decision 21); and, as a Kit 3 app, the `imports` shape of decision 2, or its `svelte-check` fails on the CLI's extensionless `#lib/utils`.

### 24. The preview app

- **Pages.** `/` is the catalogue. `/items/<name>/` is each item's preview page. That is 7 pages, prerendered as `index.html` files (decision 3).
- **Data.** A page that shows token or registry data loads it in `+page.server.ts`: the catalogue reads `registry.json`; the `pluto-theme` page reads the token file through `scripts/tokens.ts` and computes the contrast table through `scripts/contrast.ts`; each font page reads its family from the token file. *Why the server load:* `scripts/tokens.ts` reads the file with `node:fs`. A `+page.ts` load would also run in the browser on client-side navigation, which the keyboard test's Enter performs. A server load runs at prerender, and the client then fetches its prerendered data. No page reads a hex or a size from anywhere but these loads.
- **The catalogue** shows, for each item, the title, type, description, a link to its preview page, and its install command.
- **The layout** has a `<header>` holding a `Lockup` linked to `/`, labelled "Pluto Systems design system", and the theme toggle. Content sits in `<main>`, and each page has one `<h1>` and a `<title>`.
- **No scroll containers.** No element on any preview page sets `overflow` to `auto` or `scroll`. Install commands wrap (`whitespace-pre-wrap break-all`) instead of scrolling. *Why:* Chromium makes an overflowing scroll container keyboard-focusable, which would add a tab stop the keyboard test does not count, and axe's `scrollable-region-focusable` rule applies to it. The contrast table fits Playwright's default 1280 px viewport and wraps below it.
- **Themes.**
  - An inline script in `src/app.html` sets `class="dark"` on `<html>` before first paint. It uses the stored choice under the `localStorage` key `pluto-preview-theme`, or else `prefers-color-scheme`.
  - The toggle is a `<button type="button">` named "Dark theme", with `aria-pressed` reflecting the state once it has hydrated. The prerendered button carries no `aria-pressed`, because the server cannot know the theme the head script chose (change review finding 8). Pressing it flips the class and stores the choice.
  - *Why our own few lines, not `mode-watcher`:* a preview app needs only this, and the tests drive the theme through `prefers-color-scheme`. `003` decides what apps use.
- **What each preview page shows**, in the current theme:
  - `pluto-theme`: every semantic colour as a swatch chip, with its name and hex written **beside** the chip, on the page ground, in `foreground`. Text never sits on the chip, because amber or a translucent `border` under text would fail axe's `color-contrast`. Then the contrast table of decision 12; the type scale; the spacing ladder as bars; a radius specimen with one box per `rounded` class; the groove; the motion tokens.
  - `font-*`: a specimen in the face, at each scale step that uses it, with its CSS variable and install command.
  - `utils`: three `cn` calls and their results, shown as text.
  - `four-dot`: the mark at five sizes; the mono tone, in `text-primary`, a colour that is no mark colour in the dark theme; the lockup at three sizes; the lockup as a link; the mark alone inside a link, labelled; clearspace and minimum size shown; and a **geometry fixture**: the lockup at `font-size: 100px` in a flex row aligned to the baseline, beside a zero-size inline-block probe, so the probe's bottom edge is the wordmark's baseline. The tests measure against it.
- **Preview pages are app code, not items.** The literal lint does not scan them. Constitution §4.3 governs "a component", meaning what an app installs; the preview pages are fixtures that display and measure those components. The geometry fixture's 100 px is a measurement setting, chosen so every target is a whole pixel. Every colour a preview page shows still comes from a token class or from the loads above.

### 25. The tests

Each acceptance criterion's check is written first and seen failing (constitution §5).

**The test runner is `bun test`**, for the unit and smoke suites. Playwright runs the browser suite.

- *Why `bun test`, not Vitest:* both work under Bun (toolchain memo §5, EXECUTED). `bun test` is Bun's own runner, so it settles the runtime question by construction: there is no Node to fall back to, and no `--bun` to forget on the runner itself. It drops one dependency (`vitest`). It has what these tests use: `describe`, `test`, `test.each`, `expect`, `beforeAll`, `afterAll`, and per-test and per-hook timeouts (toolchain memo §5.2, EXECUTED and READ).
- *Its costs, and how each is met:*
  - A bare `bun test` also loads `*.spec.ts`, and so the Playwright specs, and fails. The scripts always pass a `./` path (`./tests/unit`, `./tests/smoke`), and `bunfig.toml` holds `[test] pathIgnorePatterns = ["tests/e2e/**", "tests/smoke/fixtures/**"]` as a guard (toolchain memo §5.2, EXECUTED).
  - Bun's resolver ignores the `#lib/*` fallbacks. Tests import relative `.ts` paths, such as `../../scripts/contrast.ts` and `../../src/lib/utils.ts`. They never import a `.svelte` file, or a `.ts` that imports one, such as an item's `index.ts`: `bun test` cannot compile Svelte (toolchain memo §5.2, EXECUTED).
  - `bunfig.toml` has no `timeout` key that works. The smoke script passes `--timeout`, and long hooks take their own timeout, such as `beforeAll(fn, 120_000)` (toolchain memo §5.2, EXECUTED).
  - A child of `bun test` runs under Node unless its argv says `--bun`. Every tool a test spawns is spawned as `[process.execPath, '--bun', '<bin>', …]` (decision 1; toolchain memo §9, EXECUTED).
- Test files import from `bun:test`, typed by `@types/bun`.

**Build order.** Every suite runs on a clean clone, with nothing built first.

- The unit tests need no build output. `registry.test.ts` builds into a temporary folder itself; `generated.test.ts` calls `build-tokens`' exported function and compares strings, writing nothing.
- The browser tests' `webServer` builds the site first (below).
- The smoke tests' `vite dev` builds the registry at start (decision 23).
- The two smoke files share no state, so they may run in either order or at once. `registry-add.test.ts` writes nothing in this repository except what its dev server's start-up build rewrites, and that build writes only files whose content is stale (decision 23); `dev-loop.test.ts` works on a temporary copy. Each starts its own dev server on its own free port.

**Unit tests**: `bun test ./tests/unit`, 8 files in `tests/unit/`.

1. `tokens.test.ts`: the token file validates. 45 names in each theme, each naming one of the 22 primitives. Every primitive is `#RRGGBB` or `#RRGGBBAA`. No semantic value is a raw hex.
2. `contrast.test.ts`: the arithmetic reproduces three reference values (black on white 21.00; `#767676` on white 4.54; `#777777` on white 4.47). Then every pair of the token file's `contrast` list, in both themes, meets its minimum, except exactly the 2 recorded exceptions. Each computed ratio, and each of the 8 composited tint hexes, equals decision 12's table; the test holds the table's values as its expected data. Each of the 3 forbidden pairs measures below 4.5 and equals its stated ratio. Tints composite at the token file's decimal alpha by decision 12's rule.
3. `generated.test.ts`: `registry.json`'s `pluto-theme` and three font items, and `src/app.css`, equal what `build-tokens` produces now, prettier-formatted. No rule nested in an at-rule of `pluto-theme`'s `css` uses the selector `:root` or `.dark`; the reduced-motion block holds exactly the selectors `html:root` and `*, ::before, ::after`.
4. `registry.test.ts`:
   - `registry.json` parses with `registrySchema` from `shadcn-svelte/schema`. It holds the 6 items of decision 19, in order, with their types. No registry dependency starts with `local:` or a URL scheme, and each names an item in this registry. Every `registry:ui` item has at least 2 files.
   - In `beforeAll` (timeout 60 s), it plants a `stale.json` in both output folders, then runs `build-registry` with `--out` set to that temporary folder. Then: the stale file survives in neither; 7 files under `<out>/r/styles/maia/` and 7 byte-identical files under `<out>/v0.1.0/r/styles/maia/`; each built item parses with `registryItemSchema`; no built file's content contains `#lib`; `four-dot`'s three targets start `four-dot/`; the built `pluto-theme.json` has `devDependencies` exactly `["shadcn-svelte@^1.7.1"]`.
   - `wrangler.jsonc` parses with `JSON.parse`, has `assets.directory` `"./build"`, and has no `main` key: 3 assertions (decision 27).
   - `CHANGELOG.md` has a `## 0.1.0` entry that names each of the 6 items.
5. `previews.test.ts`: each of the 6 items has `src/routes/items/<name>/+page.svelte`.
6. `literals.test.ts`: the literal lint finds 0 violations in the 4 files that items carry (`utils.ts`, `four-dot.svelte`, `lockup.svelte`, `index.ts`). Then the lint itself is tested: it flags each of 16 bad samples and none of 10 good ones.
7. `deps.test.ts`:
   - Every npm package an item names (built `dependencies` and `devDependencies`, and each font item's `font.dependency`) has a range in `package.json`. That is 5 packages: `shadcn-svelte`, `cn` and the three fonts. Where the item states a range (`shadcn-svelte`, `cn`), `package.json`'s specifier equals it.
   - `package.json` names exactly the 19 packages of decision 4 with their specifiers, and `bun.lock` resolves each to the version there.
   - `packageManager` is `bun@1.3.14`; `engines` is `{ "bun": ">=1.3.14" }`, with no `node` key; no `.nvmrc` exists.
8. `utils.test.ts`: `cn("p-2", "p-4")` is `"p-4"`; `cn("bg-primary", "bg-destructive")` is `"bg-destructive"`; `cn("text-sm", "text-destructive")` keeps both classes.

**The literal lint** (`scripts/lint-literals.ts`, run by test 6) flags, in a registry item's files:

- a hex colour (`#` followed by 3, 4, 6 or 8 hex digits and a word boundary);
- a colour function: `rgb(`, `rgba(`, `hsl(`, `hsla(`, `hwb(`, `lab(`, `lch(`, `oklab(`, `oklch(`, `color(`;
- a Tailwind palette colour class: a colour utility (`bg`, `text`, `border` and its sides, `outline`, `ring`, `ring-offset`, `divide`, `fill`, `stroke`, `accent`, `caret`, `decoration`, `shadow`, `inset-shadow`, `inset-ring`, `text-shadow`, `drop-shadow`, `from`, `via`, `to`, `placeholder`) followed by a palette name and a step, such as `bg-red-500`, or by `black` or `white`, with or without an opacity (`/50`, `/[.5]`, `/(--x)`). The palette names are read from the pinned `node_modules/tailwindcss/theme.css` (every `--color-<palette>-<step>`), so the list is never hand-copied. `current`, `transparent` and `inherit` are allowed;
- an arbitrary value or a whole-token arbitrary property holding a length or a colour, such as `p-[13px]`, `text-[#fff]`, `rounded-[6px]`, `[margin:13px]` or `[color:red]`. A colour there is a hex, a colour function (the list above plus `color-mix(`, `light-dark(` and `device-cmyk(`) or a CSS Color 4 named colour; `transparent` and `currentcolor` are allowed. The CSS-variable form `-(--token)` is allowed;
- a `<style>` block, a `style` attribute, or style set another way: `style` as an object key (`{...{ style: … }}`), a `.style` property access, or `setAttribute("style", …)`;
- a literal `duration-<n>` or `delay-<n>`; the token form `duration-(--motion-micro)` is allowed;
- a spacing utility off the ladder (decision 10). The `-(--token)` form, `auto` on margins, and `reverse` on `space-x` and `space-y` are allowed;
- a `font-<name>` that is neither a family (`sans`, `heading`, `mono`) nor a weight (`normal`, `medium`, `bold`) in the token file;
- a `leading-<name>` that is not in the token file's `type.leading` (`none`).

The 27 bad samples: `#14161C`, `#abc`, `oklch(0.5 0.2 264)`, `rgb(0 0 0)`, `bg-red-500`, `text-white`, `p-[13px]`, `text-[#fff]`, a `<style>` block, `style="margin: 4px"`, `p-5`, `gap-1.5`, `mt-px`, `-mx-7`, `font-black`, `leading-7`, `[margin:13px]`, `[color:red]`, `bg-[red]`, `bg-[color-mix(in_srgb,red,blue)]`, `bg-black/[.5]`, `{...{ style: "margin: 13px" }}`, `el.style.margin = "13px"`, `inset-shadow-red-500`, `text-shadow-black`, `duration-300` and `delay-150`. The 12 good samples: `p-4`, `gap-(--mark-gap)`, `mx-auto`, `bg-mark-1`, `bg-current`, `size-(--mark-dot)`, `font-bold`, `leading-none`, `import { cn } from "#lib/utils"`, `{#each items as item}`, `space-x-reverse` and `duration-(--motion-micro)`. `#lib` and the `{#each}` sample prove that `#lib` and Svelte's block syntax are not read as hex colours.

**Browser tests**: Playwright, `bun --bun playwright test`, 5 files in `tests/e2e/`.

- They run against `vite preview` of the production build. Playwright's `webServer.command` is `bun run build && bun --bun vite preview --port 4173 --strictPort`, so the site is built first and the tests see the prerendered pages a deploy would serve. The config process, the workers and the web server all ran under Bun in the toolchain memo (§6, EXECUTED).
- Chromium is installed with `bunx --bun playwright install chromium`, which fetches the build that `@playwright/test` 1.64.1 pins.
- There are two projects, `light` and `dark`, set by `colorScheme`. Both use Chromium. *Why one engine:* the geometry assertions need one set of font metrics. A later specification may add engines.

1. `axe.spec.ts`: each of the 7 pages, in both projects, scanned by `@axe-core/playwright` with the tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`. 0 violations, across 14 scans.
2. `theme.spec.ts`: on each of the 7 pages, `<html>` has the class `dark` in the dark project and not in the light one. `body`'s background computes to `rgb(247, 247, 244)` in light and `rgb(20, 22, 28)` in dark. 14 checks.
3. `four-dot.spec.ts`, on the geometry fixture at 100 px, in both projects:
   - each of the 4 dots is 30 ± 0.5 px wide and tall;
   - the column gap and the row gap are 8 ± 0.5 px;
   - the mark is 68 ± 1 px wide;
   - the bottom of the lower dots sits 38 ± 1 px above the baseline probe's bottom;
   - the dots' backgrounds, in order, are `rgb(36, 86, 230)`, `rgb(226, 58, 46)`, `rgb(240, 174, 18)`, `rgb(30, 158, 86)` in light, and all `rgb(247, 247, 244)` in dark;
   - the mono mark's dots compute to its `color`, which is not paper, so the check can fail in dark too.
   Accessible names: the decorative mark has `aria-hidden="true"`; the labelled mark is an `img` named "Pluto Systems"; the lockup example is a `link` named "Pluto Systems"; the header's lockup is a `link` named "Pluto Systems design system".
4. `tokens.spec.ts`, on the `pluto-theme` page, in both projects:
   - `rounded`, `rounded-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl` and `-4xl` all compute to an 8 px border radius; `rounded-full` computes to at least 9999 px;
   - `text-xs`, `-sm`, `-base`, `-2xl` and `-5xl` compute to 12, 13.5, 16, 28 and 44 px;
   - `p-1`, `p-2`, `p-3`, `p-4`, `p-6`, `p-8`, `p-12`, `p-16` and `p-24` compute to the 9 ladder steps;
   - after `document.fonts.ready`, `body` computes to a family beginning "Geist Variable", `h1` to "IBM Plex Sans Variable", `code` to "JetBrains Mono Variable", and `document.fonts` holds a face of each of the three families with `status` `"loaded"`, while a family no stylesheet declares has none. (`document.fonts.check` is not used: it is true even for a family that does not exist; change review finding 2.)
   - `--motion-entrance` and `--motion-micro` read 900 ms and 200 ms, and a `transition` element computes `transition-duration: 0.2s`. With `reducedMotion: "reduce"`, they read 0 ms, and the element computes at most `0.00001s`. The tokens are compared as durations, not strings: the production minifier writes `900ms` as `.9s` and `0ms` as `0s`;
   - with `reducedMotion: "reduce"`, `body`'s background still computes to the theme's ground: `rgb(247, 247, 244)` in light and `rgb(20, 22, 28)` in dark. This proves the `html:root` rule of decision 14 changes only motion.
5. `keyboard.spec.ts`, in both projects:
   - On the catalogue, pressing Tab from the top of the page focuses, in order: the header lockup link, the theme toggle, then the 6 item links in registry order. That is 8 stops. The catalogue has no other focusable element and no scroll container (decision 24).
   - At each of the 8 stops, the focused element computes `outline-style: solid`, `outline-width: 2px`, and an `outline-color` equal to `--ring`'s value in that theme, read once. Only for the theme toggle does the test first wait for its running transitions, because its `transition` class fades `outline-color` in over the micro budget.
   - Enter on the first item link loads `/items/pluto-theme/`.
   - Space on the theme toggle flips `aria-pressed` and the `dark` class; Enter flips them back.
   - On the `four-dot` page, Tab reaches the lockup-as-link example, and it shows the same outline.

**Smoke tests**: `bun test ./tests/smoke --timeout 300000`, 2 files in `tests/smoke/`. They need the network, to install the scratch apps' packages from npm.

**The scratch apps are committed fixtures**, so their packages are pinned (constitution §4.5).

- `tests/smoke/fixtures/kit3/` (app **A**) and `tests/smoke/fixtures/kit2/` (app **B**) each hold: `package.json`, `bun.lock`, `tsconfig.json`, `components.json`, `vite.config.ts`, `src/app.html`, `src/app.css`, `src/routes/+layout.svelte` (imports `../app.css`), `src/routes/+page.svelte` (a heading, no imports), `src/routes/+layout.ts` (`export const prerender = true`, because `adapter-static` fails a build whose routes are not prerenderable), and `src/lib/.gitkeep`.
  - **A**: SvelteKit 3.1.0 with `@sveltejs/adapter-static` 4.0.0; the `imports` of decision 2; `tsconfig.json` extends `$app/tsconfig` and sets `include: ["src", "*.ts"]`, for decision 2's reason: after assertion 9's build, `svelte-check` would otherwise scan `build/`; `components.json` aliases `#lib/components`, `#lib/components/ui`, `#lib/hooks`, `#lib/utils`, `#lib`.
  - **B**: SvelteKit 2.70.3 with `@sveltejs/adapter-static` 3.0.10, a `svelte.config.js` (as Kit 2 requires) and `$lib` aliases; `tsconfig.json` extends `./.svelte-kit/tsconfig.json` and sets `skipLibCheck: true`, as Kit 2's own template does: without it, Vite 8's types fail for want of `@types/node` before any `add`; `src/lib` exists, which Kit 2 needs before `add` accepts `$lib` (run memo §2).
  - Both pin, exactly, `svelte` 5.57.3, `vite` 8.3.5, `@sveltejs/vite-plugin-svelte` 7.3.1, `tailwindcss` and `@tailwindcss/vite` 4.3.3, `typescript` 6.0.3 and `svelte-check` 4.7.7. **Neither holds `shadcn-svelte`, `cn` or a font package.**
  - Both `components.json` files name the **published** URL, `"registry": "https://ui.plutosystems.co/r"`, and `"style": "maia"`, so the run proves the `REGISTRY_URL` override an app uses in development.
  - **The starting `src/app.css` is exactly one line, `@import "tailwindcss";`**, as in the review's run. No stock theme is present, so after `add` the app's variables can equal ours exactly.
  - Each `bun.lock` is made once by `bun install` in the fixture folder and committed. The tests never write to the fixtures.
- Bun 1.3.14 has not yet run a Kit 2 app through `add` (toolchain memo §12). App B's run is the first.

1. `registry-add.test.ts`:
   - It starts this repository's `vite dev` (as `[process.execPath, '--bun', 'node_modules/.bin/vite', 'dev', '--port', <free port>, '--strictPort']`) and waits, at most 60 s, for `/r/styles/maia/index.json` to answer 200. The watcher builds the registry before the server listens (decision 23).
   - For each fixture, it copies the fixture's committed files (never a `node_modules/` or `.svelte-kit/` left by making its lockfile) to a temporary folder outside the repository and runs, there, `bun install --frozen-lockfile` and `bun --bun svelte-kit sync`.
   - It runs the CLI from **this repository's locked install**, with the scratch app as the working directory: `Bun.spawn([process.execPath, '--bun', '<repo>/node_modules/.bin/shadcn-svelte', 'add', 'four-dot', '-y', '-o'], { cwd: <app>, env: { …, REGISTRY_URL: 'http://localhost:<port>/r' } })`. *Why from here:* the CLI stays pinned by our `bun.lock`, and the app need not hold `shadcn-svelte`, so assertion 6 can prove that `pluto-theme` brings it. Running the CLI from outside the app is what `bunx` does too: its copy lives in Bun's cache (toolchain memo §1, EXECUTED).
   - It asserts, in each app:
     1. the first `add` exits 0, and its output holds the "unsupported runtime" warning (decision 1), which proves it ran under Bun;
     2. 4 files land: `src/lib/components/ui/four-dot/four-dot.svelte`, `lockup.svelte`, `index.ts`, and `src/lib/utils.ts`;
     3. no placeholder (`$UTILS$`, `$UI$`, `$LIB$`, `$HOOKS$`, `$COMPONENTS$`) is left, and imports use the app's own alias (`#lib/utils` in A, `$lib/utils` in B);
     4. the app's CSS declares, in `:root`, `.dark` and `@theme inline`, the same custom properties with the same values as our `src/app.css`, compared as parsed maps, with hex case and quote style normalised as a CSS parser reads them (prettier lowercases our `src/app.css` and double-quotes its font names; the CLI writes the registry's values as they are): 3 of 3 maps equal;
     5. it holds the 3 font `@import`s and the rules `html { @apply font-sans }` and `code, kbd, samp, pre { @apply font-mono }`;
     6. `package.json`, which held none of them, now holds `shadcn-svelte` at `^1.7.1`, `cn` at `^0.5.0`, and the 3 font packages;
     7. a second `add four-dot -y -o` exits 0 and leaves the app's CSS file byte-identical (decision 14);
     8. the app's `@media (prefers-reduced-motion: reduce)` block holds exactly the selectors `html:root` and `*, ::before, ::after`, and declares none of the 45 colour variables;
     9. after the test writes `src/routes/+page.svelte` to import `FourDot` and `Lockup` from the app's alias and render both, the app's `vite build` (`bun --bun vite build`) exits 0. This proves `shadcn-svelte/tailwind.css` resolves from the app's own install;
     10. the app's `svelte-check` (`bun --bun svelte-check`) reports 0 errors. In A, this proves the `imports` fallbacks of decision 2 type-check the CLI's extensionless `#lib/utils`.
   - `afterAll` stops the dev server and deletes the temporary folders.
2. `dev-loop.test.ts`:
   - It copies this repository's files that git does not ignore (`git ls-files --cached --others --exclude-standard`, so uncommitted work is included) to a temporary folder, links each entry of `node_modules` there to this repository's (not the folder itself, so the `node_modules/$app` that Kit 3 generates stays in the copy), and starts `vite dev` in the copy on its own free port. *Why a copy:* the test changes the token file, and a crash must never leave this repository's committed files modified.
   - Touching `registry.json` (rewriting it with the same bytes) rewrites `static/r/styles/maia/index.json` within 10 s.
   - Changing a value in the token file rewrites `src/app.css` and `static/r/styles/maia/pluto-theme.json` within 10 s.
   - `afterAll` stops the server and deletes the copy.

`bun run test` runs the unit, browser and smoke suites in that order.

### 26. Other checks

- `bun run check` runs `bun --bun svelte-kit sync`, then `bun --bun svelte-check --tsconfig ./tsconfig.json`.
  - **What it type-checks:** every `.ts` and `.svelte` file under `src/`, `scripts/` and `tests/`, and the root `*.ts` config files, as `tsconfig.json`'s `include` says (decision 2). The scratch fixtures are excluded; each is checked inside its own app by smoke assertion 10.
  - Scripts and tests may use Bun's APIs (`Bun.spawn`, `bun:test`) and `node:` modules. `@types/bun` types both (decision 4).
- `bun run lint` runs `bun --bun prettier --check .` over the code this specification adds.
  - `.prettierrc` sets `"plugins": ["prettier-plugin-svelte"]`. It also holds one override, `*.jsonc` → `trailingComma: "none"`: without it, prettier's default adds a trailing comma to `wrangler.jsonc`, which `JSON.parse` rejects (criterion 22).
  - `.prettierignore` lists `context/`, `build/`, `.svelte-kit/`, `static/r/`, `static/v*/`, `node_modules/`, `test-results/`, `playwright-report/` and `bun.lock` (which also matches the fixtures' lockfiles).
  - *Why `context/` is ignored:* research memos are never edited after the fact (`context/README.md`), and five files there already fail `prettier --check` (review finding 4, EXECUTED). Formatting is for code, not for the record.
  - The generated `registry.json` and `src/app.css` are **checked, not ignored**. `build-tokens` formats them through prettier before writing (decision 15), so they pass.

### 27. `wrangler.jsonc`, ready but not deployed

```json
{
  "name": "pluto-design-system",
  "compatibility_date": "2026-10-27",
  "assets": { "directory": "./build" }
}
```

- An assets-only Worker: there is no `main`, so no Worker code runs, and static asset requests are free (registry memo §2).
- It has no comments, so `JSON.parse` reads it, and `registry.test.ts` checks it with no JSONC parser (decision 25).
- Routes, the custom domain and the deploy command are the deployment specification's. The owner runs the deploy.

### 28. Two owner calls this specification does not decide

Both are open from v2 §10. Neither blocks 001.

- **The doc-ID scheme** (v2 names itself PS-DB-0002). v2 §07 puts the doc ID in every page's footer. **`003` needs it**, for the footer block. 001 shows no doc IDs.
- **Coloured dots on ink for the icon.** v2 makes ink the icon's field and refuses coloured dots on dark grounds. **The specification that ships the icon files needs it**: the favicon, app icon and logo SVGs, which the registry memo proposes as `registry:file` items. That is `003` (the top nav and site head) or a later logo-files specification, whichever ships the icon first. 001 ships no icon. In the dark theme, its in-page mark follows v2's written rule and goes all paper (decision 8).
- **What 001 does decide next to the icon call: state dots in the dark theme.** `destructive-fill` and `success-fill` are lifted red and green on ink. v2 §03 refuses "colour dots on dark grounds", but it also sanctions functional state semantics, and a state dot that went paper-white would tell state by nothing. So 001 reads the refusal as covering the mark and decoration, not state (decision 8). `003`'s run metrics will show these dots. When the icon call is put to the owner, both parts are asked together: coloured dots on ink for the icon, and confirmation of lifted state dots on ink. If the owner refuses the second, only the two dark values change.
- Also recorded for that question: v2's monochrome mark on dark (`.paperdots`) uses `raised` `#FFFFFF`, and 001 uses `paper` `#F7F7F4` (decision 8).

Each will be put to the owner with the AskUserQuestion tool, with options and a recommendation, by the specification that needs it.

### 29. Room left for `002` and `003`

- **Layout.** `src/lib/registry/` has `ui/`, `components/`, `hooks/`, `lib/` and `blocks/` folders, matching the aliases. `003`'s blocks import only `#lib/registry/ui/...` and `#lib/utils`, never another block, so the aliases cover every import (decision 19's trap).
- **The restyling approach.** `002` installs each stock component from the official registry into `src/lib/registry/ui/<name>/` (decision 21), with this repository's locked CLI, `bun --bun shadcn-svelte add <name>`, then restyles it to the tokens and to v2. Constitution §4.6 counts that install as using a dependency.
- **Never `-o` on a stock add here.** A stock component depends on the official `utils`, and our `utils` alias is `#lib/utils`, so `add -o` would overwrite our `src/lib/utils.ts` (decision 20). `002` runs those adds without `-o` and declines the overwrite, or restores `src/lib/utils.ts` from git afterwards. `generated.test.ts` does not cover `utils.ts`; `utils.test.ts` and review do.
- **The `muted` rule** (decisions.md, "A fourth ground for `muted`, insets only"). `muted`, `accent` and `sidebar-accent` are for component insets only: skeletons, tab strips, code grounds, hover and selected rows. Never a page, section or sidebar ground. The literal lint cannot see where a class is used, so the review of each `002` and `003` change checks it.
- **No state tint on `muted`, in either theme** (decision 8). An alert or badge with `bg-destructive/10`, `bg-success/10` or their `/20` dark forms never sits inside a `muted` or `accent` inset. Three of the four cases fail AA (decision 12).
- **Tokens already in place for them:** the 31 shadcn names (decision 8), the chart tokens, the sidebar tokens, the state fills, the type scale, the weights and the motion budgets.
- **Known stock classes `002` must replace:** `ring-ring/50` and `outline-ring/50` focus styles; `bg-input/30`; off-ladder spacing; translucent menus (decision 12, decision 21).

## Design

How the pieces fit.

```
tokens/pluto.tokens.json
        │  bun run build:tokens   (scripts/build-tokens.ts, via scripts/tokens.ts; output formatted by prettier)
        ├──────────────► registry.json        pluto-theme.cssVars / .css; the 3 font items' .font
        └──────────────► src/app.css          the CSS an app would hold, for the preview app
registry.json + src/lib/utils.ts + src/lib/registry/**
        │  bun run build:registry (scripts/build-registry.ts → bun --bun node_modules/.bin/shadcn-svelte registry build)
        ├──────────────► static/r/styles/maia/            index.json + 6 item files
        └──────────────► static/v0.1.0/r/styles/maia/     the same 7 files
bun --bun vite dev    ── builds both once, then serves static/ ──►  http://localhost:5173/r/styles/maia/…   (wasi-python-dev installs from here)
bun --bun vite build  ── copies static/ ──►  build/r/styles/maia/…, build/v0.1.0/…, and 7 prerendered pages
```

**The token file's shape**, abridged. Every key below exists; lists are cut short with `…`.

```json
{
  "primitives": { "ink": "#14161C", "paper": "#F7F7F4", "blue": "#2456E6", "line": "#14161C1A", "clear": "#00000000", "…": "…" },
  "themes": {
    "light": { "background": "paper", "foreground": "ink", "destructive": "red-text", "mark-1": "blue", "…": "…" },
    "dark":  { "background": "ink", "foreground": "paper", "destructive": "red-lifted", "mark-1": "paper", "…": "…" }
  },
  "radius": { "case": 8 },
  "spacing": { "atom": 4, "ladder": [4, 8, 12, 16, 24, 32, 48, 64, 96] },
  "type": {
    "families": {
      "sans":    { "variable": "--font-sans", "family": "'Geist Variable', system-ui, sans-serif", "package": "@fontsource-variable/geist", "item": "font-geist", "import": "Geist" },
      "heading": { "variable": "--font-heading", "family": "'IBM Plex Sans Variable', system-ui, sans-serif", "package": "@fontsource-variable/ibm-plex-sans", "item": "font-heading-ibm-plex-sans", "import": "IBM_Plex_Sans" },
      "mono":    { "variable": "--font-mono", "family": "'JetBrains Mono Variable', ui-monospace, monospace", "package": "@fontsource-variable/jetbrains-mono", "item": "font-jetbrains-mono", "import": "JetBrains_Mono", "selector": "code, kbd, samp, pre" }
    },
    "scale": { "xs": { "px": 12, "lineHeight": 1.5 }, "sm": { "px": 13.5, "lineHeight": 1.6 }, "base": { "px": 16, "lineHeight": 1.6 }, "2xl": { "px": 28, "lineHeight": 1.2 }, "5xl": { "px": 44, "lineHeight": 1.15 } },
    "tracking": { "display": -0.03, "section": -0.02, "eyebrow": 0.08, "mark": -0.04 },
    "weight": { "normal": 400, "medium": 500, "bold": 700 },
    "leading": { "none": 1 }
  },
  "motion": { "entranceMs": 900, "microMs": 200, "easeEntrance": [0.2, 0.7, 0.3, 1] },
  "mark": { "dot": 0.3, "gap": 0.08, "rise": 0.38, "lockupGap": 0.16 },
  "line": { "width": 1 },
  "focus": { "width": 2, "offset": 2 },
  "contrast": {
    "text":       [["foreground", "background"], ["muted-foreground", "muted"], "…"],
    "tints":      [{ "text": "destructive", "tint": "destructive", "over": "background", "alpha": { "light": 0.1, "dark": 0.2 } }, "…"],
    "nonText":    [["input", "card"], ["chart-3", "background"], "…"],
    "exceptions": [{ "theme": "light", "pair": ["chart-3", "background"], "why": "amber series are labelled directly (v2 §03; WCAG 1.4.11)" }, "…"],
    "forbidden":  [{ "theme": "light", "text": "destructive", "tint": "destructive", "over": "muted", "alpha": 0.1, "ratio": 4.06, "why": "no state tint on muted (decision 8)" }, "…"]
  }
}
```

Units. Pixel tokens become rem by dividing by 16 (radius, spacing, type sizes), except `line` and `focus`, which stay px (decision 13). em tokens stay em. Millisecond tokens become `ms`. Weights and the named line height are unitless.

**Package scripts.** Each tool starts with `bun --bun` (decision 1). `bun scripts/*.ts` and `bun test` are Bun itself.

| Script | Runs |
|---|---|
| `build:tokens` | `bun scripts/build-tokens.ts` |
| `build:registry` | `bun scripts/build-registry.ts` |
| `dev` | `bun --bun vite dev` (the watcher runs both builds before serving, decision 23) |
| `build` | `bun run build:tokens && bun run build:registry && bun --bun vite build` |
| `preview` | `bun --bun vite preview` |
| `check` | `bun --bun svelte-kit sync && bun --bun svelte-check --tsconfig ./tsconfig.json` |
| `lint` | `bun --bun prettier --check .` |
| `test:unit` | `bun test ./tests/unit` |
| `test:e2e` | `bun --bun playwright test` |
| `test:smoke` | `bun test ./tests/smoke --timeout 300000` |
| `test` | `bun run test:unit && bun run test:e2e && bun run test:smoke` |

## Scope

**In** (the work to *built*):

- The scaffold of decisions 1 to 5: `package.json`, `bun.lock`, `bunfig.toml`, `vite.config.ts`, `tsconfig.json`, `components.json`, `playwright.config.ts`, `.prettierrc`, and the `.gitignore` and `.prettierignore` additions.
- `tokens/pluto.tokens.json`, with the values of decisions 7 to 16.
- `scripts/tokens.ts`, `contrast.ts`, `build-tokens.ts`, `build-registry.ts`, `registry-watch.ts`, `lint-literals.ts`.
- `registry.json` with the 6 items, `src/lib/utils.ts`, and `src/lib/registry/ui/four-dot/` (3 files).
- The generated `src/app.css`.
- The preview app: layout, catalogue, 6 preview pages and their server loads, the theme script and toggle.
- 15 test files: 8 unit, 5 browser, 2 smoke; and the two scratch-app fixtures under `tests/smoke/fixtures/`.
- `wrangler.jsonc` and `CHANGELOG.md`.

**The step to *done*** is `wasi-python-dev`'s work, not this repository's: its home-page specification (its `003`) installs `pluto-theme` and `four-dot` from this registry and passes that app's own checks (constitution §4.2). That specification depends on this one. 001's landing notes record the *built* date when criteria 1 to 23 hold, and later the `wasi-python-dev` commit that makes it *done* (criterion 24).

**Out:**

- Deployment, the domain, and retaining older versioned paths on the host. The owner runs the deploy; a later specification covers it.
- The primitives (`002`) and the blocks (`003`), and their dependencies: `bits-ui`, `tw-animate-css`, an icon package, `mode-watcher`.
- Elevation tokens, the editor and code-block highlight palettes, and the logo SVG files.
- The orbit-assemble entrance (`003`).
- The two owner calls of decision 28.
- A branded CLI (constitution §3).
- Serving `/init` from this registry (registry memo §7).

## Acceptance criteria

Each is a count, checked by the command named. "Clean clone" means a fresh `git clone` with Bun 1.3.14 on `PATH`, after `bun install --frozen-lockfile` and `bunx --bun playwright install chromium`. Every command below runs under Bun (decision 1); none uses a `node` on `PATH`. Criteria 1 to 23 make 001 *built*; criterion 24 makes it *done*.

1. **Install.** On a clean clone, `bun install --frozen-lockfile` exits 0. `deps.test.ts` finds the 19 packages of decision 4 in `package.json` with their specifiers, and `bun.lock` resolves 19 of 19 to the versions there. It finds `packageManager` `bun@1.3.14`, `engines` `{ "bun": ">=1.3.14" }` with no `node` key, and no `.nvmrc`: 3 of 3.
2. **Checks.** `bun run check` reports 0 errors and 0 warnings. `bun run lint` exits 0.
3. **Tokens.** `bun run build:tokens` exits 0. Run twice, the second run changes 0 files: the SHA-256 of `registry.json` and of `src/app.css` are the same before and after it. `tokens.test.ts` finds 45 semantic names in each theme (90 values), each naming one of 22 primitives, and 22 of 22 primitives are 6- or 8-digit hex.
4. **Contrast.** `contrast.test.ts` reproduces 3 of 3 reference ratios, and computes 100 pairs (50 per theme): 98 meet their minimum and exactly 2 are the recorded `chart-3` exceptions. 100 of 100 ratios and 8 of 8 tint hexes equal decision 12's table, with tints composited at alpha 0.1 (light) and 0.2 (dark). 3 of 3 forbidden pairs measure below 4.5, at their stated ratios.
5. **Generated files.** `generated.test.ts` finds `registry.json`'s 4 token-owned items and `src/app.css` equal to a fresh, prettier-formatted `build:tokens` run: 2 of 2 files. 0 rules nested in an at-rule of `pluto-theme`'s `css` use `:root` or `.dark`, and the reduced-motion block holds exactly its 2 selectors.
6. **Registry source.** `registry.test.ts`: `registry.json` parses with `registrySchema`; it holds 6 items with the names, order and types of decision 19; 0 registry dependencies start with `local:` or a scheme; 5 of 5 distinct registry dependency names (`font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono`, `utils`, `pluto-theme`) name items in the registry; 1 of 1 `registry:ui` items has at least 2 files.
7. **Registry build.** `bun run build:registry` exits 0 and writes 7 files to `static/r/styles/maia/` and 7 byte-identical files to `static/v0.1.0/r/styles/maia/`. `registry.test.ts`, building into a temporary folder, finds the same 7 and 7 with 0 of 2 planted stale files surviving, 6 of 6 item files parsing with `registryItemSchema`, 0 built files containing `#lib`, 3 of 3 `four-dot` targets starting `four-dot/`, and `pluto-theme`'s built `devDependencies` equal to `["shadcn-svelte@^1.7.1"]`.
8. **Site build.** `bun run build` exits 0. `build/` holds 7 files under `r/styles/maia/`, 7 under `v0.1.0/r/styles/maia/`, and 7 prerendered pages: `index.html` and `items/<name>/index.html` for each of 6 items.
9. **Dev server.** On a clean clone, with `bun run dev` running, `GET /r/styles/maia/index.json` answers 200 with a JSON array of 6 items.
10. **Preview pages.** `previews.test.ts` finds 6 of 6 preview pages.
11. **No literals.** `literals.test.ts` finds 0 violations in 4 of 4 item files, flags 27 of 27 bad samples and 0 of 12 good samples.
12. **Named dependencies.** `deps.test.ts` finds a range in `package.json` for 5 of 5 packages that items name (`shadcn-svelte`, `cn` and the 3 fonts), equal to the item's range for 2 of 2 that state one.
13. **`cn`.** `utils.test.ts` passes 3 of 3 cases.
14. **axe.** `axe.spec.ts` reports 0 violations across 7 pages in 2 themes: 14 scans.
15. **Themes.** `theme.spec.ts` passes 14 of 14 checks.
16. **The mark.** `four-dot.spec.ts` passes 10 geometry and colour checks in each of 2 themes (4 dot sizes, 2 gaps, the width, the rise, the colour order, the mono tone): 20 of 20. It also passes 4 of 4 accessible-name checks.
17. **Tokens in the browser.** `tokens.spec.ts`, in 2 of 2 themes, finds 10 of 10 radius checks, 5 of 5 type sizes, 9 of 9 spacing steps, 6 of 6 font checks (3 computed families and 3 faces with `status` `"loaded"` in `document.fonts`), 2 of 2 motion states (default and reduced), and 1 of 1 ground unchanged under reduced motion.
18. **Keyboard.** `keyboard.spec.ts`, in 2 of 2 themes, finds the 8 catalogue stops in order, a solid 2 px ring-coloured outline at 8 of 8, navigation by Enter, the toggle flipped by Space and by Enter, and the outline on the lockup link.
19. **Smoke.** `registry-add.test.ts` passes 10 of 10 assertions in each of 2 scratch apps: 20 of 20.
20. **Dev loop.** `dev-loop.test.ts`, on a temporary copy of the repository, sees `index.json` rewritten within 10 s of touching `registry.json`, and `src/app.css` and `pluto-theme.json` rewritten within 10 s of a token change: 3 of 3 files.
21. **Test files.** On a clean clone, `bun run test` exits 0, having run 8 unit files, 5 browser files in 2 projects, and 2 smoke files.
22. **Deploy config.** `registry.test.ts` finds that `wrangler.jsonc` parses with `JSON.parse`, has `assets.directory` `"./build"`, and has no `main` key: 3 of 3.
23. **Changelog.** `registry.test.ts` finds a `0.1.0` entry in `CHANGELOG.md` naming 6 of 6 items.
24. **In the app (done).** `wasi-python-dev`'s home-page specification installs `pluto-theme` and `four-dot` from this registry and passes that app's checks: its `svelte-check`, Playwright and axe. That app holds the commit: 1 of 1. This criterion is checked in `wasi-python-dev`, after 001 is *built*; 001's landing notes cite the commit.

## Landing notes

- **Built:** 2026-10-27. Nothing is committed yet; the owner commits when asked. The change review is [`../reviews/001-tokens-and-the-registry-pr-2026-10-27.md`](../reviews/001-tokens-and-the-registry-pr-2026-10-27.md): "Does not land yet" on three Medium and eight Low findings, every one fixed in its Disposition, then re-verified by the orchestrating session. The specification review is [`../reviews/001-tokens-and-the-registry-spec-2026-10-27.md`](../reviews/001-tokens-and-the-registry-spec-2026-10-27.md).
- **Done:** *pending.* Criterion 24 waits on `wasi-python-dev`'s home-page specification, which installs `pluto-theme` and `four-dot` from this registry. That commit goes here.

**What the orchestrating session saw, under Bun 1.3.14, 2026-10-27 (EXECUTED):**

| Check | Result |
|---|---|
| `bun run check` | 400 files, 0 errors, 0 warnings |
| `bun run lint` | exit 0 |
| `bun run build:tokens` twice | second run changes nothing |
| `bun run build` | 7 registry files, 7 versioned files, 7 prerendered pages |
| `bun test ./tests/unit` | 223 pass, 0 fail, 8 files |
| `bun --bun playwright test` | 130 passed, 5 files in 2 projects |
| `bun test ./tests/smoke` | 22 pass, 0 fail, 2 files |

Criteria 1 to 23 hold at the counts the amended criteria state. Criterion 24 is not met, by design.

**Two things to know:**

1. **An intermittent hang in the smoke harness, root cause not established.** The smoke pair failed in 3 of its first 6 runs with a `beforeAll` hitting its own timeout while polling the dev server, which means one `fetch` hung on an accepted connection. Each file passed alone. The orchestrator gave each poll request a 2 s timeout, made the poll fail at once if the server exits, and put the server log in every error (`tests/smoke/process.ts`). 13 consecutive runs have passed since. If it recurs, the error now carries the log. See the change review's addendum.
2. **Decisions made during the build that the owner delegated or that the spec did not foresee** are recorded: the `muted` ground (decisions.md, "A fourth ground for `muted`, insets only"); Bun as the runtime (decisions.md); and the six deviations the change review judged necessary, now written into decisions 23 to 26.

**For `002`:** this repository's `components.json` points at the official registry, so `add <stock item>` lands in `src/lib/registry/ui/<name>/` for restyling. Never run that `add` with `-o`, or restore `src/lib/utils.ts` afterwards (decision 29). The stock classes to replace are listed in decision 29.
