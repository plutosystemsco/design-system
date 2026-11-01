# Blocks: how they are declared, installed and previewed

- **Status:** complete
- **Date:** 2026-10-28
- **Author:** the design lead
- **Question:** How do shadcn-svelte blocks work, end to end? What `registry:block` and `registry:page` mean in the schema. Where each kind of file in a block lands on install. Whether a block in our registry can depend on stock primitives by bare name. Which primitives the stock login, sign-up, sidebar, dashboard and OTP blocks compose. How the shadcn-svelte site previews a block. And what this means for a Pluto block.
- **What it blocks:** specification `002`, the primitives (its list must cover what the blocks need), and the blocks specification after it. See `decisions.md`, "Blocks, and they shape `002`" (2026-10-28).

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-28, macOS (Darwin 25.5.0, arm64), Bun 1.3.14, with the repository's locked shadcn-svelte CLI 1.7.1 run as `bun --bun <repo>/node_modules/.bin/shadcn-svelte`.
- **READ**: a source says so. Sources are the prior art clone `context/prior_art/shadcn-svelte` (MIT, commit `6149e14`, the CLI 1.7.1 release), read on 2026-10-28. Paths below start at that clone's root, with line numbers. We read and cite; we copied no code.
- **INFERRED**: our reasoning.

All runs were in a scratch folder outside this repository. Nothing in this repository was written except this memo. The repository's dev server was started once and rebuilt `static/r/` as it always does on start; `registry.json` and `src/lib/registry/` were not touched (EXECUTED: `git status` identical before and after).

Every CLI run under Bun printed "You are currently using an unsupported runtime. Only Node.js v22 or higher is officially supported." That is expected under `--bun` (toolchain memo §7) and is not repeated below.

Terms of art:

- A **registry item** is one installable unit, served as one JSON file (`<name>.json`). It has a `type`, a list of `files` and its dependencies.
- A **block** is a registry item of type `registry:block`: a composed section or page, built from primitives, installed with `add` like any item.
- A **primitive** is a single reusable component of type `registry:ui`, such as `button` or `card`.
- An **alias** is an import path prefix, such as `#lib/components`. The app's `components.json` names five: `components`, `ui`, `hooks`, `utils` and `lib`. The CLI places files under the folder each alias points to.
- A **placeholder** is a token such as `$UI$` that `registry build` writes in place of the registry's own alias, and that `add` replaces with the app's alias.
- A **bare name** is a dependency written as an item name (`"button"`), not a URL.
- The **index** is `index.json`, the registry's list of its items. The CLI fetches it first.

## 1. The schema

### 1.1 What `registry:block` and `registry:page` mean

- READ: an item's `type` and a file's `type` are separate enums. File types are `registry:lib`, `registry:block`, `registry:component`, `registry:ui`, `registry:hook`, `registry:page`, `registry:file`, `registry:theme`, `registry:style`, `registry:item`, `registry:base` and `registry:font` (`packages/cli/src/utils/registry/schema.ts:6-19`). `registry:block` is also listed as the one "complex" item type (`schema.ts:21`). The item `type` is described as "Used to determine the type and target path of the item when resolved for a project" (`schema.ts:27-31`).
- READ: `registry:page` is a **file** type. On install it resolves against `src/routes` when the app uses SvelteKit, and against the `components` alias otherwise (`packages/cli/src/utils/registry/index.ts:222-227`). "Uses SvelteKit" means `@sveltejs/kit` is in the app's `dependencies` or `devDependencies` (`packages/cli/src/utils/project.ts:76-80`; read into the config at `packages/cli/src/utils/config/utils.ts:65`).
- READ: a `registry:block` **item** resolves against the `components` alias, the same as `registry:component` (`index.ts:218-220`). But that folder is used only for the "installed at" message and for creating the folder; each file is placed by its own file type (section 1.2).
- INFERRED: so "block" is a label for the whole item, and "page" is a label for one file in it. A block is a bundle: one or more page files that become routes, plus the components, UI, lib and hook files they use.

### 1.2 Where each file lands

`registry build` gives every file a `target`, then `add` resolves that target against a folder.

**At build** (READ, `packages/cli/src/commands/registry/build.ts:119-139`):

- An item with one file: the target is the file's base name.
- An item with several files: `registry:page`, `registry:ui` and `registry:file` targets are nested as `<item-name>/<base name>`. Every other type (`registry:component`, `registry:lib`, `registry:hook`) gets the bare base name, flat.
- A `target` written in `registry.json` overrides the computed one, because the file's own fields are spread last (`build.ts:138`).
- Import paths are rewritten by plain string replacement: each of the registry's five alias paths becomes its placeholder (`build.ts:228-239`; placeholders `$COMPONENTS$`, `$UI$`, `$HOOKS$`, `$UTILS$`, `$LIB$` at `packages/cli/src/constants.ts:9-17`).

**At install** (READ, `index.ts:206-258`):

| File type in a block | Folder it resolves against | Built target | Lands at, for an app with Kit's usual aliases |
|---|---|---|---|
| `registry:page` | `src/routes` (Kit app) | `<block>/+page.svelte` | `src/routes/<block>/+page.svelte` |
| `registry:component` | `components` alias | `<file>` (flat) | `src/lib/components/<file>` |
| `registry:ui` | `ui` alias | `<block>/<file>` | `src/lib/components/ui/<block>/<file>` |
| `registry:lib` | `lib` alias | `<file>` | `src/lib/<file>` |
| `registry:hook` | `hooks` alias | `<file>` | `src/lib/hooks/<file>` |
| `registry:file` | the **item** type's folder (`components` for a block) | `<block>/<file>` | `src/lib/components/<block>/<file>` |

- READ: `resolveItemFilePath` joins the folder and the target with `path.resolve` (`index.ts:257`). A target that starts with `~/` resolves from the project root instead (`index.ts:238-240`). The item named `utils` always goes to the `utils` alias path (`index.ts:242-246`).
- READ: `add` writes each file at that path after `transformImports` replaces each placeholder with the app's alias (`packages/cli/src/utils/add-registry-items.ts:169-201`; `packages/cli/src/utils/transformers/transform-imports.ts:4-11`).
- **What a page's `target` does.** It is a path under `src/routes`. `probe/+page.svelte` makes the route `/probe`. A target written as `src/routes/probe/+page.svelte` is joined onto `src/routes` and lands at `src/routes/src/routes/probe/+page.svelte` (READ, `index.ts:257`; EXECUTED, section 4). Only `~/src/routes/probe/+page.svelte` names a path from the root.
- INFERRED: the components of a block land **flat** in the app's `components` folder, not in a folder per block. Two blocks that each ship `login-form.svelte` collide. The stock blocks avoid this only by convention (sidebar blocks share `app-sidebar.svelte` and overwrite each other).

### 1.3 `categories`, `meta` and `docs`

- READ: `meta` is "Additional metadata for the registry item", a free record (`schema.ts:89-94`). It is on the base item, so it is kept in `registry.json`, in `index.json` and in the item JSON.
- READ: `docs` is "The documentation for the registry item. This is a markdown string" (`schema.ts:148-151`). `categories` is "an array of strings" (`schema.ts:152-156`). Both are on the **item** schema only (`registryItemCommonSchema`), not on the `registry.json` item schema (`schema.ts:219-237`).
- READ: `registry build` parses `registry.json` with the `registry.json` schema (`build.ts:63`). Zod objects drop unknown keys by default (INFERRED from the run below).
- EXECUTED: an item in our scratch `registry.json` with `categories: ["probe", "authentication"]`, `docs: "..."` and `meta: { iframeHeight: "600px", since: "0.0.0" }` built to JSON with keys `$schema, name, title, type, description, registryDependencies, meta, files`. `meta` survived in the item and in `index.json`. **`categories` and `docs` were dropped.**
- READ: the CLI reads none of the three. A search of `packages/cli/src` for `categories`, `.docs` and `item.meta` finds only the schema lines above.
- INFERRED: with our `registry build`, `meta` is the only place for per-item data our preview site needs (a preview height, a category, a since-version). `categories` and `docs` would need a post-build step to survive.

### 1.4 Can a block in our registry depend on a stock primitive by bare name?

**No.** Every bare name must be in our registry. A stock primitive can be a dependency only as a URL, and then every bare name *it* depends on must also be in our registry.

- READ: `getRegistryUrl` builds one registry URL, `REGISTRY_URL` (or `components.json` `registry`) plus `/styles/<style>` (`index.ts:12-23`). `add` fetches that one index (`add-registry-items.ts:58`).
- READ: `resolveRegistryItems` (`index.ts:99-157`) handles each dependency in this order:
  1. Look the name up in **our** index (`index.ts:109-111`). If found, use it.
  2. Else, if it is a URL, or a relative path (`./`, `../`) and the parent item was itself fetched by URL, fetch it (`index.ts:118-124`).
  3. Else throw. For a top-level item: "Registry item '<name>' does not exist in the registry at '<url>'", plus a hint to point `registry` at `https://shadcn-svelte.com/registry` (`index.ts:132-136`). For a dependency of a URL item: "does not exist in the remote registry at '<origin>', nor is it a valid URL or relative path" (`index.ts:126-130`).
- READ: the recursion passes `parentUrl` only for items fetched by URL (`index.ts:142-150`). It always looks in **our** index first, even for the dependencies of a stock item fetched from shadcn-svelte.com.
- READ: there is no fallback to the default registry. `OFFICIAL_REGISTRY_URL` is `https://shadcn-svelte.com/registry` (`constants.ts:3-5`), not `ui.shadcn-svelte.com`, and it appears in resolution only in that error message.
- READ: `local:<name>` in `registry.json` becomes `./<name>.json` at build (`build.ts:145`, `build.ts:209-215`). But `index.json` is built from the raw items (`build.ts:68-70`), and a relative path resolves only under a URL parent (`index.ts:120`). INFERRED: `local:` is for items installed by URL, not for items installed by name from our index.
- EXECUTED (section 4): a bare `button` failed; a bare `four-dot` from a second registry failed; a URL to our `four-dot` failed on its own bare `utils`; a URL to stock `button` worked, because stock `button` has no registry dependencies; a URL to stock `field` failed on its bare `label`.
- EXECUTED: the live stock registry (`https://shadcn-svelte.com/registry/styles/maia/<name>.json`, fetched 2026-10-28) lists bare names. `field` needs `label`, `separator`. `select` needs `separator`. `sheet` needs `button`. `toggle-group` needs `toggle`. `sidebar` needs `is-mobile`, `input`, `tooltip`, `skeleton`, `separator`, `button`, `sheet`. `button`, `card`, `input`, `label`, `separator`, `avatar`, `breadcrumb`, `collapsible`, `dropdown-menu`, `input-otp`, `table`, `tabs`, `badge`, `checkbox`, `chart`, `drawer`, `tooltip`, `skeleton` list none. No stock item lists `utils`, though every one imports `$UTILS$` (`cn`, `WithElementRef`).
- INFERRED: a block that uses a stock primitive works only if that primitive, and its whole dependency tree, are items in our registry. A URL dependency is possible only for a leaf such as `button`, and it is unpinned: the stock JSON can change under us (constitution §4.5).

## 2. The stock blocks as worked examples

### 2.1 File layout and what each composes

READ: every block below is a folder with a `+page.svelte` and a `components/` folder. Each page imports its components with a relative path, `./components/<file>.svelte`. All paths are under `docs/src/lib/registry/blocks/`.

| Block | Files | Primitives imported | Other imports |
|---|---|---|---|
| `login-01` | page, `components/login-form.svelte` | card, button, field, input (`login-01/components/login-form.svelte:2-5`) | |
| `login-02` | same | button, field, input; `cn`, `WithElementRef` (`login-02/components/login-form.svelte:2-11`) | lucide icon in page (`login-02/+page.svelte:2`); `<img src="/placeholder.svg">` (`login-02/+page.svelte:25-26`) |
| `login-03` | same | card, button, field, input; `cn` (`login-03/components/login-form.svelte:2-12`) | lucide icon (`login-03/+page.svelte:2`) |
| `login-04` | same | card, button, field, input; `cn` (`login-04/components/login-form.svelte:2-12`) | `/placeholder.svg` (`login-04/components/login-form.svelte:83-84`) |
| `login-05` | same | button, field, input; `cn` (`login-05/components/login-form.svelte:2-12`) | lucide icon (line 2) |
| `signup-01` | page, `components/signup-form.svelte` | card, field, button, input (`signup-01/components/signup-form.svelte:2-5`) | |
| `signup-02` | same | field, button, input; `cn` (`signup-02/components/signup-form.svelte:2-5`) | lucide icon, `/placeholder.svg` (`signup-02/+page.svelte:2, 25-26`) |
| `signup-03` | same | card, field, button, input; `cn` (`signup-03/components/signup-form.svelte:2-6`) | lucide icon (`signup-03/+page.svelte:2`) |
| `signup-04` | same | card, field, button, input; `cn` (`signup-04/components/signup-form.svelte:2-6`) | `/placeholder.svg` (`signup-04/components/signup-form.svelte:84-85`) |
| `signup-05` | same | field, button, input; `cn` (`signup-05/components/signup-form.svelte:3-6`) | lucide icon (line 2) |
| `otp-01` | page, `components/otp-form.svelte` | card, field, input-otp, button (`otp-01/components/otp-form.svelte:2-5`) | |
| `sidebar-01` | page; `components/app-sidebar`, `search-form`, `version-switcher` | breadcrumb, sidebar, separator (`sidebar-01/+page.svelte:2-4`); label (`search-form.svelte:4`); dropdown-menu (`version-switcher.svelte:5`) | lucide icons |
| `sidebar-07` | page; `components/app-sidebar`, `nav-main`, `nav-projects`, `nav-user`, `team-switcher` | breadcrumb, sidebar, separator (`sidebar-07/+page.svelte:2-4`); avatar, dropdown-menu (`nav-user.svelte:8-9`); collapsible (`nav-main.svelte:3`); `useSidebar` from sidebar | lucide icons |
| `dashboard-01` | page, `data.ts`; 21 files in `components/` (`.svelte` and `.ts`) | sidebar, button, label, select, dropdown-menu, badge, input, separator, chart, card, toggle-group, tabs, table, drawer, checkbox, avatar; hook `is-mobile` | `@tanstack/svelte-table`, `@tabler/icons-svelte`, `svelte-sonner`, `layerchart`, `d3-shape`, `d3-scale`, `zod`, `@dnd-kit-svelte/svelte`, `@dnd-kit/helpers` |

(The `dashboard-01` row is a count of its imports, EXECUTED with `grep` over the folder.)

INFERRED: the auth and OTP blocks need only **card, field (with label and separator), button, input, input-otp** and `utils`. The app-shell blocks add **sidebar** (with sheet, tooltip, skeleton, the `is-mobile` hook), **breadcrumb, dropdown-menu, avatar, collapsible**. Four blocks show an image from `/placeholder.svg`, a file in the docs site's `static/` that the item does not ship.

### 2.2 How the docs site registers them

- READ: there is no hand-written list of block files. `docs/scripts/registry.ts` crawls `src/lib/registry/blocks/` (`registry.ts:154-176`). A folder becomes one `registry:block` item. Inside it, `+page.svelte`, `data.ts` and `data.json` become `registry:page` files; every other file becomes `registry:component` (`registry.ts:115-152`, the rule at lines 122-130). A single `.svelte` file at the top level (the calendars, `demo-*`) becomes a `registry:block` with one `registry:component` file (`registry.ts:162-173`).
- READ: `registryDependencies` are inferred from imports. An import starting `$lib/registry/ui/<name>/` adds `<name>`; `$lib/registry/lib/` and hook paths add theirs; `$lib/utils.js` is skipped (`registry.ts:234-282`, the rules at lines 254-270).
- READ: `docs/scripts/build-registry.ts` writes a temporary `registry-<style>.json` and runs the CLI's `registry build` into `static/registry/styles/<style>/` (`build-registry.ts:271-324`). Its aliases set `components` to the literal `"./components"` (`build-registry.ts:283-289`). So a page's `./components/login-form.svelte` becomes `$COMPONENTS$/login-form.svelte` and then the app's components alias on install. EXECUTED: the live `login-01.json` page file imports `$COMPONENTS$/login-form.svelte`; its files are `registry:page` `login-01/+page.svelte` and `registry:component` `login-form.svelte`; its `registryDependencies` are `["card","button","field","input"]`.
- READ: `data.ts` is a `registry:page`, so it lands beside `+page.svelte` in `src/routes/dashboard-01/`, and the page's relative `./data.js` import still works (`dashboard-01/+page.svelte:8`; `registry.ts:123`).
- READ: the same script generates `src/__registry__/blocks.ts`, a constant array of every `registry:block` name except `chart-*` (`build-registry.ts:93-108`). It mirrors `static/registry` into `src/__registry__/json` so routes can `import.meta.glob` the built JSON (`build-registry.ts:197-207`).
- READ: block descriptions, preview heights and classes live in a separate TypeScript map, `docs/src/lib/registry/registry-block-meta.ts` (type at lines 3-8: `iframeHeight`, `className`, `description`, `mobile`). Categories live in `registry-categories.ts:1-37` (Sidebar, Login, Signup, OTP, Calendar shown; Dashboard, Authentication hidden). A category page finds its blocks by file-name prefix: `import.meta.glob(".../login-*.json")` and so on (`routes/(app)/(layout)/blocks/[category]/+page.server.ts:5-10`). The registry items' own `categories` and `meta` are not used.

## 3. How the docs site previews a block

READ, all under `docs/src/`:

- **A bare route.** `routes/(view)/view/[view=view]/` renders one block alone. The `(view)` group's layout has no site chrome: only `ModeWatcher` (theme) and a tooltip provider around the children (`routes/(view)/+layout.svelte:1-11`). The page dynamically imports `lib/registry/blocks/<name>/+page.svelte`, or `<name>.svelte` for single-file blocks (`+page.ts:11-24`), and renders it in a `bg-background` div with the block's meta class (`+page.svelte:18-20`). It is prerendered for every name in `blocks.ts` (`+page.ts:7-9`). A param matcher rejects names that are not blocks (`params/view.ts:4-6`, `lib/blocks.ts:6-8`).
- **An iframe on the listing page.** `BlockViewer` (`lib/components/block-viewer.svelte`) wraps one block. Its preview is an `<iframe src="/view/<name>">`, lazy-loaded, its height from `meta.iframeHeight` or 930 px (`lib/components/block-viewer-iframe.svelte:12-20`). Wrapping it in `{#key iframeKey}` lets a refresh button remount it (`block-viewer-toolbar.svelte:84-95`).
  - INFERRED: the iframe gives the block its own document, so its CSS, its `min-h-svh` and its media queries see the iframe's width, not the docs page's.
- **Widths.** The iframe sits in a resizable pane group: one pane at 100%, minimum 30%, a drag handle, and an empty second pane (`block-viewer-view.svelte:16-32`). A toggle group in the toolbar offers Desktop, Tablet and Mobile with values `100`, `60` and `30`, and calls `pane.resize(value)` (`block-viewer-toolbar.svelte:52-70`). So the widths are percentages of the viewer, not device pixel widths. Behind the pane is a dotted grid background (`block-viewer-view.svelte:13-15`).
- **Open alone.** A button opens `/view/<name>` in a new tab (`block-viewer-toolbar.svelte:72-82`).
- **The code.** A Preview/Code tab switch (`block-viewer-toolbar.svelte:35-42`) hides one view and shows the other. The code comes from a prerendered endpoint, `routes/api/block/[block]/+server.ts`. It imports the built item JSON, replaces placeholders with default aliases (`transformImportPaths`, `lib/registry/registry-utils.ts:72-84`), highlights each file, and rewrites each target into an app path (`routes/...` for pages, `components/...` for components: `transformBlockPath`, `registry-utils.ts:14-30`) (`+server.ts:80-105`, `137`). The code view shows a file tree and the selected file with a copy button (`block-viewer-code.svelte:15-51`; tree from `createFileTreeForRegistryItemFiles`, `registry-utils.ts:32`).
  - INFERRED: the code shown is the **built registry JSON**, the exact text `add` would write, not the source file.
- **The install command.** The toolbar shows and copies `shadcn-svelte@latest add <name>` for the reader's package manager (`block-viewer-toolbar.svelte:23-31, 99-111`).
- **Small screens.** Below the `lg` breakpoint the toolbar and iframe are hidden. The viewer shows a light and a dark PNG screenshot instead, or the live component when `meta.mobile` is `"component"` (`block-viewer-view-mobile.svelte:9-39`). The screenshots come from a `build:screenshots` script (`docs/package.json:18`).
- The same `/view/<name>` iframe also backs `component-preview.svelte:48`.

## 4. The experiment

### 4.1 Set-up

All EXECUTED.

- **The app.** `tests/smoke/fixtures/kit3` copied to the scratch folder without `node_modules`, `.svelte-kit` or `build`. `bun install --frozen-lockfile` exited 0 (66 packages). `bun --bun node_modules/.bin/svelte-kit sync` exited 0. Its `components.json` aliases: `components` `#lib/components`, `ui` `#lib/components/ui`, `hooks` `#lib/hooks`, `utils` `#lib/utils`, `lib` `#lib`; style `maia`. The folder was made a throwaway git repository so every write showed in `git status`.
- **Our dev server.** `bun run dev --port 5391 --strictPort` from the repository root printed `[registry] build:registry done` and `VITE v8.3.5 ready`. `GET http://localhost:5391/r/styles/maia/index.json` answered 200. The same path on `127.0.0.1` got no answer (curl code 000): Vite listened on `localhost` only.
- **The flags.** `registry build --help`: `[registry]` (default `./registry.json`), `-c, --cwd`, `-o, --output` (default `./static/r`). The CLI reads each file's `path` relative to the process's working directory (READ, `build.ts:128`), so builds ran from the scratch registry folder, which needed a `package.json` for dependency detection (READ, `deps-resolver.ts:24-25`).
- **Scratch registry "one".** A `registry.json` with our six items copied from the repository (with copies of `four-dot` and `utils.ts`) and our five aliases (`#lib/registry/components`, `#lib/registry/ui`, `#lib/registry/hooks`, `#lib/utils`, `#lib/registry/lib`). Added: `probe-block` and four variants (below). Built into `serve/one/r/styles/maia/`, the layout `scripts/build-registry.ts` writes (`<out>/r/styles/maia/`). Exit 0.
- **Scratch registry "two".** Only `probe-solo` (bare `four-dot`), `probe-url` (our dev server's `four-dot.json` as a URL) and `probe-stock-url` (`https://shadcn-svelte.com/registry/styles/maia/button.json` as a URL). Built into `serve/two/r/styles/maia/`. Exit 0.
- **The server.** A one-line `Bun.serve` that returns `Bun.file(root + pathname)` or 404, on `127.0.0.1:5392`.

`probe-block` had five files:

- `+page.svelte`, `registry:page`, `target: "src/routes/probe/+page.svelte"` (the form this memo set out to test), importing `#lib/registry/components/probe-card.svelte`;
- `probe-card.svelte`, `registry:component`, importing `FourDot` from `#lib/registry/ui/four-dot`, `cn` from `#lib/utils`, and the three files below by their aliases;
- `probe-ui.svelte`, `registry:ui`;
- `probe-data.ts`, `registry:lib`;
- `use-probe.svelte.ts`, `registry:hook`.

Its `registryDependencies` were `["four-dot"]`. Because a bare name resolves only against the serving registry (section 1.4), `four-dot` and its tree (`utils`, `pluto-theme`, three fonts) were put in the same scratch registry. Registry "two" tests the other case.

### 4.2 What the build wrote

EXECUTED, from `serve/one/r/styles/maia/probe-block.json`:

| File | Built target | Imports after build |
|---|---|---|
| page | `src/routes/probe/+page.svelte` (ours kept) | `$COMPONENTS$/probe-card.svelte` |
| `probe-card.svelte` | `probe-card.svelte` | `$UI$/four-dot`, `$UTILS$`, `$UI$/probe-block/probe-ui.svelte`, `$LIB$/probe-data`, `$HOOKS$/use-probe.svelte` |
| `probe-ui.svelte` | `probe-block/probe-ui.svelte` | |
| `probe-data.ts` | `probe-data.ts` | |
| `use-probe.svelte.ts` | `use-probe.svelte.ts` | |

Variants with no target: the page built to `probe-block-default/+page.svelte`. A page importing `./components/probe-card.svelte` kept that relative path unchanged, because our `components` alias is `#lib/registry/components`, not `./components`.

### 4.3 The runs

Each `add` was `REGISTRY_URL=http://127.0.0.1:5392/<one|two>/r bun --bun <repo>/node_modules/.bin/shadcn-svelte add <item> -y -o`, from the scratch app. All EXECUTED.

| Run | Exit | Result |
|---|---|---|
| `add probe-block` (one) | 0 | Installed probe-block, four-dot, utils, pluto-theme, three fonts; "Stylesheet updated at src/app.css"; added `@fontsource-variable/geist`, `ibm-plex-sans`, `jetbrains-mono` `^5.3.0` and `shadcn-svelte ^1.7.1` to `devDependencies` and ran `bun install` |
| `vite build` after it | 0 | `Wrote site to "build"`; pages `build/index.html` and `build/src/routes/probe.html` |
| `add probe-block-tilde` (one) | 0 | Page at `src/routes/probe-tilde/+page.svelte` |
| `add probe-block-default` (one) | 0 | Page at `src/routes/probe-block-default/+page.svelte` |
| `vite build` after both | 0 | Adds `build/probe-tilde.html`, `build/probe-block-default.html` |
| `add probe-block-relative` (one) | 0 | Page at `src/routes/probe-block-relative/+page.svelte`, still importing `./components/probe-card.svelte` |
| `vite build` after it | **1** | `[UNRESOLVED_IMPORT] Could not resolve './components/probe-card.svelte' in src/routes/probe-block-relative/+page.svelte` |
| `add probe-stock` (one; bare `button`) | **1** | `CLI Error: Registry item 'button' does not exist in the registry at 'http://127.0.0.1:5392/one/r/styles/maia'.` plus the hint to set `registry` to `https://shadcn-svelte.com/registry`. No file written |
| `add probe-solo` (two; bare `four-dot`) | **1** | `Registry item 'four-dot' does not exist in the registry at 'http://127.0.0.1:5392/two/r/styles/maia'.` No file written |
| `add probe-url` (two; URL to our `four-dot.json`) | **1** | `Registry item 'utils' does not exist in the remote registry at 'http://localhost:5391', nor is it a valid URL or relative path.` |
| `add probe-stock-url` (two; URL to stock `button.json`) | 0 | `button` from shadcn-svelte.com installed at `src/lib/components/ui/button/{button.svelte,index.ts}`; `tailwind-variants ^3.3.0` added. `vite build` with a route using it: exit 0 |
| `add https://shadcn-svelte.com/registry/styles/maia/field.json` (two) | **1** | `Registry item 'label' does not exist in the remote registry at 'https://shadcn-svelte.com', nor is it a valid URL or relative path.` |

Where every file of `add probe-block` landed (EXECUTED, `git status -uall`):

| Source | Landed at |
|---|---|
| page (`target: src/routes/probe/+page.svelte`) | `src/routes/src/routes/probe/+page.svelte` (route `/src/routes/probe`) |
| `probe-card.svelte` (`registry:component`) | `src/lib/components/probe-card.svelte` |
| `probe-ui.svelte` (`registry:ui`) | `src/lib/components/ui/probe-block/probe-ui.svelte` |
| `probe-data.ts` (`registry:lib`) | `src/lib/probe-data.ts` |
| `use-probe.svelte.ts` (`registry:hook`) | `src/lib/hooks/use-probe.svelte.ts` |
| `four-dot` | `src/lib/components/ui/four-dot/{four-dot.svelte,index.ts,lockup.svelte}` |
| `utils` | `src/lib/utils.ts` |
| `pluto-theme`, fonts | `src/app.css`, `package.json`, `bun.lock` |

The installed `probe-card.svelte` imports `#lib/components/ui/four-dot`, `#lib/utils`, `#lib/components/ui/probe-block/probe-ui.svelte`, `#lib/probe-data` and `#lib/hooks/use-probe.svelte`. The page imports `#lib/components/probe-card.svelte`.

Two more observations (EXECUTED):

- The CLI said "probe-block installed at src/lib/components/probe-block". No such folder was made. The message is built from the item type's folder plus the item name (READ, `add-registry-items.ts:218-220`), not from where the files went.
- The stock `button.svelte` imports `#lib/utils.js` (with the extension). It built because our `utils.ts` was already installed. Stock items need the app's `utils` to export `cn` and `WithElementRef` but do not declare it.

All servers were stopped afterwards; nothing listened on 5391 or 5392 (EXECUTED, `lsof`).

## 5. What this means for us

All INFERRED. Short on purpose; the blocks specification decides.

**The item shape.** A Pluto block should be one `registry:block` item with **one page file plus a components folder**, as the stock blocks are. The page is thin: layout and placement. The components carry the parts an app will reuse (a `sign-in-form`, a `chat-composer`). Reasons: the page installs as a route the app can delete, while the components stay importable; the code view reads as a small tree; and it is the shape every stock block uses. A section that is not a page (a hero, a call to action) can be a single `registry:component` file, like the stock calendars.

**Choices the shape forces.**

- **The page's target.** Either let the build compute `<block>/+page.svelte` (route `/<block>`), or write `~/src/routes/<path>/+page.svelte`. Never `src/routes/...` without `~/`.
- **How the page imports its components.** Our `components` alias is `#lib/registry/components`. Three ways: (a) the page imports `#lib/registry/components/<file>.svelte` and the source lives there, outside the block's folder; (b) set the registry's `components` alias to `"./components"`, as shadcn-svelte does, so a relative import becomes `$COMPONENTS$` (this is a plain `replaceAll` on every file of every item, so the string must appear nowhere else); (c) a build step of our own that rewrites the import. A relative import left as it is breaks the app's build (section 4.3).
- **Name collisions.** Components land flat. Prefix component files with the block's name, or ship them as `registry:file` (which nests under `components/<block>/`), or accept overwrites.
- **Assets.** A block must not reference a file in our `static/` (the stock `/placeholder.svg`). It ships what it shows, or shows nothing that needs a file.

**Dependencies.** Every primitive a block names must be an item in our registry, with its whole tree (`field` brings `label` and `separator`; `sidebar` brings `sheet`, `tooltip`, `skeleton`, `input`, `button`, `separator` and the `is-mobile` hook). So `002` must serve, restyled to our tokens, every primitive the first blocks use. From the stock examples and the first set, that is at least: **button, input, label, field, separator, card, textarea, avatar, scroll-area, skeleton, spinner, badge, dropdown-menu, sidebar** (with **sheet, tooltip, is-mobile**), **breadcrumb**, and **input-otp** if sign-in has a code step. URL dependencies on the stock registry are unpinned and fail on the first bare name inside them, so they are not a way round this.

**The preview.** Our own version of the docs mechanism:

- A bare route, `/view/<block>`, in a route group whose layout has no site chrome: the theme stylesheet, a light/dark switch driven by the parent, nothing else. Prerendered for every block.
- On the block's item page, an iframe of that route, so the block's media queries see the iframe's width.
- Width presets as fixed pixel widths that match our breakpoints (not percentages), plus a drag handle and an "open alone" link.
- Light and dark side by side or switchable, since every block must pass both (constitution §4.4).
- A code view that shows the **built** item JSON's files with app-side paths, which is what `add` writes, and the `add` command for our registry.
- No screenshots. A screenshot rots when tokens change, which is why the previews are live (decisions.md, "Blocks, and they shape `002`").

**Decisions the blocks specification must make.** `003` made each of them.

1. The item shape: page plus components folder, and which blocks are single-file sections (`003` decisions 1 and 2).
2. The page target rule and the page-to-component import rule (a, b or c above). `003` decision 3 lets the build compute the target; decision 2 takes (a).
3. A naming rule that keeps component files from colliding across blocks (`003` decision 2: every component file starts with its block's name).
4. Where block source lives in this repository (`src/lib/registry/blocks/<name>/`, which existed and was empty on this date) and how `registry.json` lists it: by hand, or crawled and inferred from imports as shadcn-svelte does (`003` decisions 2 and 5: by hand).
5. What goes in `meta` (preview height, category, since), since `categories` and `docs` do not survive our build (`003` decision 5).
6. The preview route, its layout, its width presets and how theme is passed into the iframe (`003` decisions 16 and 17).
7. How the smoke test installs a block into the kit3 fixture and proves `vite build` and `svelte-check` pass, as `001` does for `four-dot` (`003` decision 20).
8. Which primitives `002` must contain for the first set, confirmed against the blocks' drafts (decisions.md, "The primitives split in two, and the design calls for `002`"; `002` decision 24).

## Sources

- `context/prior_art/shadcn-svelte` at `6149e14`, MIT, read 2026-10-28: `packages/cli/src/utils/registry/schema.ts`, `packages/cli/src/utils/registry/index.ts`, `packages/cli/src/commands/registry/build.ts`, `packages/cli/src/commands/registry/deps-resolver.ts`, `packages/cli/src/commands/add/index.ts`, `packages/cli/src/utils/add-registry-items.ts`, `packages/cli/src/utils/transformers/transform-imports.ts`, `packages/cli/src/utils/config/utils.ts`, `packages/cli/src/utils/project.ts`, `packages/cli/src/constants.ts`; `docs/scripts/registry.ts`, `docs/scripts/build-registry.ts`, `docs/package.json`; `docs/src/lib/registry/blocks/` (the fourteen blocks named), `registry-block-meta.ts`, `registry-categories.ts`, `registry-utils.ts`; `docs/src/lib/blocks.ts`, `docs/src/params/view.ts`; `docs/src/routes/(view)/`, `docs/src/routes/(app)/(layout)/blocks/`, `docs/src/routes/api/block/[block]/+server.ts`; `docs/src/lib/components/block-viewer*.svelte`, `component-preview.svelte`.
- The live stock registry, `https://shadcn-svelte.com/registry/styles/maia/<name>.json`, fetched 2026-10-28 for `login-01` and the primitives listed in section 1.4.
- This repository: `registry.json`, `scripts/build-registry.ts`, `tests/smoke/fixtures/kit3`, `context/specifications/001-tokens-and-the-registry.md` (decision 1), `context/research/2026-10-27-the-toolchain-under-bun.md`.
