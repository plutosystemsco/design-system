# A shadcn-svelte registry, and what Pluto already has

- **Status:** complete
- **Date:** 2026-10-27
- **Author:** the design lead
- **Question:** How a shadcn-svelte registry is built, served and consumed today. How an app develops against it in tandem. What the brand's existing material (its design book and its earlier website) holds that the design system starts from. Which libraries the planned components imply. What layout this repository should take.
- **What it blocks:** the tokens-and-registry specification.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-27, macOS, Node 22.14.0, Bun 1.3.14.
- **READ**: a source says so. The source is named. Every source was read on 2026-10-27.
- **INFERRED**: our reasoning from what was executed or read.

The shadcn-svelte source was read from a shallow clone at `context/prior_art/shadcn-svelte`, commit `6149e14` (2026-10-23). Paths below that start `cli/` mean `context/prior_art/shadcn-svelte/packages/cli/`. Paths that start `docs/` mean `context/prior_art/shadcn-svelte/docs/`.

The brand's own material was read, read only, from its internal repository, which is not published. It holds the Pluto Systems design book (version 2, cited as *v2*, or as *the design book* with a section number; version 1, *v1*, is named only where the two differ), the brand's earlier website, its mockups, its research notes and its decision records. No path into it is given.

Two terms are used throughout.

- A **registry** is a set of JSON files over HTTP. Each **registry item** is one JSON file that carries a component's source text and what it needs.
- The **`add` command** is shadcn-svelte's CLI command that fetches registry items and writes their files into an app.

---

## 1. The registry, as it exists today

### 1.1 Version and status

- The CLI is `shadcn-svelte` **1.7.1**, published to npm on **2026-10-23** (READ: `npm view shadcn-svelte time`; EXECUTED that query). Licence MIT (READ: `LICENSE.md` in the clone).
- 1.7.0 (2026-09-16) changed the `cn` helper the components import, replacing `clsx` + `tailwind-merge` (READ: `cli/CHANGELOG.md`).
- The base primitives are **bits-ui** 2.20.2 on npm, MIT (EXECUTED: `npm view bits-ui`). The docs site's own components depend on `bits-ui ^2.20.0` (READ: `docs/package.json`).
- The CLI requires Svelte 5 and Tailwind v4. Tailwind v3 projects take a legacy path (READ: `cli/src/utils/preconditions.ts`).
- The components are written with Svelte 5 runes (`$props`, `$bindable`, `$state`, `$effect`) (READ: `docs/src/lib/registry/ui/*`, and the same in the earlier website's installed `button`).
- The registry feature is labelled "currently experimental" in the clone's `docs/content/registry/index.md` (READ). The live getting-started page did not show the label (READ: https://shadcn-svelte.com/docs/registry/getting-started). INFERRED: treat the schema as able to change between minor versions, and pin the CLI version.
- The CLI needs Node 20 or later. It warns under Bun or Deno that "Only Node.js v22 or higher is officially supported" (READ: `cli/src/index.ts`, `cli/src/utils/prompt-helpers.ts`). The bin's shebang is `#!/usr/bin/env node` (READ). INFERRED: `bunx shadcn-svelte@1.7.1` runs it under Node unless `--bun` is passed. The foundation memo of the same day confirmed it ([`2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md`](2026-10-27-the-foundation-run-kit-3-fonts-and-the-theme-item.md) §3, EXECUTED there).

### 1.2 `registry.json`

The schema is a zod object in `cli/src/utils/registry/schema.ts` (READ):

- `name`, `homepage`, and `items` (required).
- `aliases` (optional). These are the import paths that `build` rewrites into placeholders such as `$UTILS$` and `$UI$`, so the app's own aliases are put back on install.
- `overrideDependencies` (optional). These npm versions replace the detected ones at build time.
- Each item has `name`, `type`, `title`, `description`, `author`, `files` (each with a `path` and a `type`, and an optional `target`), `dependencies`, `devDependencies`, `registryDependencies` (required in `registry.json`, may be empty), `cssVars`, `css`, `font` and `meta`.

The built item adds `$schema`, `docs` (markdown), `categories`, and each file's `content` and `target` (READ: same file).

### 1.3 Item types

The schema accepts these (READ: `schema.ts`): `registry:lib`, `registry:block`, `registry:component`, `registry:ui`, `registry:hook`, `registry:page`, `registry:file`, `registry:theme`, `registry:style`, `registry:item`, `registry:base` and `registry:font`. It also has two internal types, `registry:example` and `registry:internal`.

Each type is installed in a different place (READ: `getItemAliasDir` in `cli/src/utils/registry/index.ts`):

| Type | Installed at |
|---|---|
| `ui` | the `ui` alias (`$lib/components/ui/<name>/`) |
| `component`, `block` | the `components` alias |
| `lib` | the `lib` alias |
| `hook` | the `hooks` alias |
| `page` | `src/routes/` in SvelteKit |
| `file`, `font`, `base` | the project root, or a `~/`-prefixed target |
| `theme`, `style` | no files; their `cssVars` and `css` are merged into the app's Tailwind CSS file ("`theme`s and `style`s do the same thing", a comment in `cli/src/utils/add-registry-items.ts`) |

- A `registry:base` item may carry a partial `components.json` as `config` (READ: `schema.ts`).
- The registry FAQ shows a file type `registry:utils`. That type is not in the schema; `registry:lib` is the one that exists (READ: `docs/content/registry/faq.md` against `schema.ts`). INFERRED: a docs slip. Use `registry:lib`.
- A file's `content` is a JSON string (READ: `schema.ts`). INFERRED: binary files such as `.woff2` cannot be items. An SVG, being text, can.

### 1.4 Dependencies

- **npm dependencies.** `build` parses every file's imports (acorn and the Svelte compiler) and writes each package it finds as `name@range`. The range comes from the registry project's own `package.json` (READ: `cli/src/commands/registry/deps-resolver.ts`). On install, a dependency the app already satisfies is skipped. One with no range is resolved through the package manager and written with a caret (READ: `cli/src/utils/install-deps.ts`). INFERRED: the app's `bun.lock` pins the exact version, as constitution §4.5 asks. The registry's `package.json` sets the range the app starts from.
- **Registry dependencies.** There are three forms (READ: `resolveRegistryItems` in `cli/src/utils/registry/index.ts`, and `transformLocal` in `cli/src/commands/registry/build.ts`):
  1. A bare name, such as `button`. It is looked up in the index of the registry the app's `components.json` names.
  2. A full URL to another item's JSON, from any registry.
  3. `local:<name>`. `build` rewrites it to `./<name>.json`, resolved relative to the item that names it.
- **A defect found by running it.** We built a two-item registry and ran `add` against it (EXECUTED, §1.9).
  - An item whose dependency was written `local:pluto-theme` installed when added **by URL**.
  - The same item failed when added **by name**, with `Error: unknown scheme`.
  - The cause: `build` rewrites `local:` in the item file but leaves it raw in `index.json`. The resolver then treats `local:pluto-theme` as a URL with the scheme `local:` (READ: `build.ts` lines writing `index.json`; EXECUTED: the index held `"local:pluto-theme"`).
  - With a bare name instead, adding by name worked (EXECUTED).
  - INFERRED: our items should use bare names for our own dependencies once apps point `components.json` at our registry. `local:` is only safe for items added by URL. This is worth reporting upstream.

### 1.5 CSS variables and the Tailwind v4 theme

An item's `cssVars` has three maps (READ: `schema.ts`, `cli/src/utils/updaters/update-css-vars.ts`):

- `light` goes into `:root`.
- `dark` goes into `.dark`.
- `theme` goes into `@theme inline`, for Tailwind v4.

The CLI also adds `@custom-variant dark (&:is(.dark *))` and derives the `--color-*` and `--radius-*` theme entries (READ). An item's `css` field takes arbitrary rules, at-rules, `@layer` and `@utility` blocks (READ: `schema.ts`).

We added a `registry:theme` item to a bare app (EXECUTED). The CLI:

- wrote `--background: #F7F7F4` and `--pluto-blue` into `:root`, and the dark value into `.dark`;
- wrote `--color-pluto-blue` and `--color-background` into `@theme inline`;
- added `@custom-variant dark`;
- added `@import "shadcn-svelte/tailwind.css"`.

INFERRED from that last import: an app installed this way keeps `shadcn-svelte` as a dev dependency, because its CSS is imported at build time. This is a build-time input pinned by `bun.lock`, not a run-time reach-back. It does not break constitution §4.1.

- **Fonts.** A `registry:font` item's schema has `provider: "google"`. The CLI does not fetch from Google: it installs `@fontsource-variable/<name>` from npm and adds an `@import` of it (READ: `cli/src/utils/fonts.ts`). INFERRED: the fonts are self-hosted in the app's build, which constitution §4.6 allows.

### 1.6 The build command

```
shadcn-svelte registry build [registry.json] --cwd <dir> --output <dir>   # default output ./static/r
```

(READ: `cli/src/commands/registry/build.ts`; `docs/content/cli.md`.) It writes `index.json` and one `<name>.json` per item. A file's target is `<item>/<file>` when an item of type `ui`, `page` or `file` has more than one file. There is no `--watch` (READ).

### 1.7 Pointing `add` at a custom registry

There are three ways.

1. **By item URL.** `shadcn-svelte add https://host/r/styles/maia/four-dot.json` (READ: `docs/content/registry/getting-started.md`; EXECUTED). The CLI still fetches the index of the registry that `components.json` names (EXECUTED: the access log showed the index fetched first). A bare-name dependency of the URL item therefore resolves against *that* registry.
2. **By `components.json` `registry`.** The field is a single URL. There is no namespace map (no `@pluto/button`) and no per-registry headers (READ: `componentsJsonSchema` in `schema.ts`; a grep for `registries`, `headers` and `Authorization` found nothing in `cli/src`).
   - **The CLI appends `/styles/<style>` to that URL** (READ: `getRegistryUrl`; `cli/test/utils/registry.test.ts`).
   - `style` must be one of the eight preset styles: `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea`. Any other value is replaced by `nova` with a warning (READ: `cli/src/preset/preset.ts`, `cli/src/utils/config/utils.ts`).
   - So a registry at `https://raw.githubusercontent.com/plutosystemsco/design-system/<tag>/static/r` used with style `maia` must serve `.../static/r/styles/maia/index.json`. We built with `--output static/r/styles/maia`, and both adding by name and adding by URL worked (EXECUTED).
3. **By environment variable.**
   - `REGISTRY_URL` replaces `components.json`'s `registry` and still appends `/styles/<style>`.
   - `COMPONENTS_REGISTRY_URL` replaces the whole URL and appends nothing (READ: `getRegistryUrl` and its tests; EXECUTED: `COMPONENTS_REGISTRY_URL=http://localhost:4173/r/styles/maia` worked).

`init` builds its starting point from `<registry origin>/init?preset=<encoded>`, an endpoint on shadcn-svelte.com (READ: `cli/src/commands/init/index.ts`). INFERRED: an app should run `init` against the official registry, and only then point `components.json` at ours. Serving `/init` ourselves is possible in principle, as a Worker route or a static file, but it is untested (see "What this memo does not settle").

### 1.8 Auth for a private registry

- The docs say the CLI "does not offer a built-in way to add auth". They suggest a `?token=` query parameter, checked by the server, which returns 401 (READ: getting-started page, live and in the clone).
- The CLI sends no custom headers (READ: `fetchRegistry` uses plain `fetch` with an optional proxy).
- **A query token does not survive the CLI's URL resolution.** `new URL("index.json", "https://x/r/styles/maia/?token=abc")` gives `https://x/r/styles/maia/index.json`. A `./button.json` dependency resolved against an item URL that carries `?token=` also loses it (EXECUTED in Node). So the index and every dependency are fetched without the token. INFERRED: the documented scheme works only for single, dependency-free items added by URL.
- INFERRED: a token carried in the **path** (`https://<host>/t/<token>/r`) survives relative resolution, and a Worker can check it. Cloudflare Access service tokens need request headers, which the CLI cannot send. A token in `components.json` would be committed, so it would go in `REGISTRY_URL` instead.

### 1.9 The end-to-end run (EXECUTED)

We ran this in a scratch project outside this repository and committed nothing.

- **The registry.** Two items, built with the CLI at 1.7.1:
  - `pluto-theme` (`registry:theme`, with `cssVars`);
  - `four-dot` (`registry:ui`, two files, depending on `pluto-theme`).

  A small Bun static server served it on `localhost:4173` and logged each request.
- **The app.** A bare app with `svelte`, `tailwindcss`, `@sveltejs/kit` and the CLI, a `components.json` pointing at `http://localhost:4173/r`, style `maia`, and `src/app.css`.
- **What we saw.**
  - The request log showed `/r/styles/maia/index.json`, then `four-dot.json`, then `pluto-theme.json`.
  - The files landed at `src/lib/components/ui/four-dot/`, with `$UTILS$` rewritten to `$lib/utils`.
  - The theme merged as §1.5 describes.
  - `-y` skips the first confirmation but **not** the "Updates to your src/app.css" prompt; `-o` (overwrite) skips it (READ: `add-registry-items.ts`, the `writeStylesheet` condition). INFERRED: a scripted install uses `-y -o`.
  - `local:` failed by name, as §1.4 says.

### 1.10 Updating an installed component

- There is a hidden `update` command (READ: `cli/src/commands/update/index.ts`, `{ hidden: true }`; not in `docs/content/cli.md`). It finds installed items by matching folder names under the `ui`, `components` and `hooks` aliases against the registry index. It then re-fetches them and **overwrites** them, after the prompt "Make sure you have committed your changes before proceeding!".
- `add -o` does the same for named items.
- There is no `diff` command (READ: a grep in `cli/src/commands`).
- INFERRED: the update workflow is to re-add with `-o` in a clean working tree and read `git diff`. The app's maintainer keeps or reverts each hunk. This is why constitution §6 ("a component's change that alters its interface says so in its changelog") matters: the changelog is the only notice an app gets.

### 1.11 Install-time transforms worth knowing

On install, the CLI rewrites:

- alias placeholders, back to the app's aliases (`transform-imports.ts`);
- an `IconPlaceholder` component, into the app's chosen icon library (`transform-icons.ts`; the brand's earlier website chose Phosphor);
- the menu colour and accent (`transform-menu.ts`);
- font tokens (`transform-font.ts`);
- TypeScript into JavaScript for JavaScript projects (`transform-strip-types.ts`).

(READ: `cli/src/utils/transformers/`.)

INFERRED: Pluto items should write icons through the placeholder only if more than one icon library is ever expected. Importing Phosphor directly is simpler, and `build` records the dependency.

### 1.12 Does it support everything asked?

| Need | Supported? |
|---|---|
| `registry.json` schema, item types, npm and registry dependencies | Yes (READ, EXECUTED) |
| CSS variables and the Tailwind v4 `@theme` from an item | Yes (EXECUTED) |
| A build command | Yes, without watch (READ) |
| A custom registry URL | Yes, by item URL, by `components.json` `registry` with the `/styles/<preset>/` path, or by env var (EXECUTED) |
| Namespaces (`@pluto/...`) | **No.** One registry per app config, plus URLs (READ) |
| Auth for a private registry | **Not built in.** Query tokens break on dependencies (EXECUTED); path tokens are untested (INFERRED) |
| Updating installed components | Overwrite only, through hidden `update` or `add -o`. No diff (READ) |
| `local:` dependencies added by name | **Broken in 1.7.1** (EXECUTED) |

---

## 2. Hosting the registry

The registry is static JSON. The CLI parses responses with `response.json()` and ignores `Content-Type` (READ: `fetchRegistry`; INFERRED from how `fetch` behaves). It fetches from Node, so CORS does not apply (INFERRED).

| Option | Public | Private | Notes |
|---|---|---|---|
| **Cloudflare Worker with static assets** on a Pluto Systems domain | Yes | Yes, with a small Worker script checking a path token | Static asset requests "are free and unlimited", and need no Worker code (READ: https://developers.cloudflare.com/workers/static-assets/ and its billing page). It is the platform the brand had already chosen for its website (READ: the brand's site-architecture decision record). The same deploy can carry the preview pages (INFERRED). |
| GitHub raw (`raw.githubusercontent.com/plutosystemsco/design-system/<tag>/...`) | Yes | No practical path, because the CLI cannot send an auth header (READ §1.8) | Built JSON would have to be committed. A tag in the URL pins a version for free (INFERRED). |
| GitHub Pages | Yes | INFERRED: private Pages needs a paid GitHub plan | A second host beside Cloudflare (INFERRED). |

- **Public or private.** Whatever a component's source contains is shipped, compiled, to every visitor of the public site that uses it (INFERRED). A private registry hides little and costs a token scheme the CLI does not support. INFERRED: **public** is simpler, and it fits the design book's law 3, "Transparency is structural" (READ: the design book §01). The owner chose public (decisions.md, "The design book's open calls, answered", 2026-10-27), and the repository was made public on 2026-11-01 (decisions.md, "The registry is served from GitHub, and the repository is public").
- **Versions.** INFERRED: the Worker can keep every release's build at its own path, such as `<host>/v0.1.0/r`, beside a moving `/r`. An app then pins the registry the way it pins npm packages, and an update is a deliberate change of one URL.

## 3. Developing in tandem

- **A local path does not work.** Node 22's `fetch("file:///…")` fails with "not implemented" (EXECUTED), and the CLI fetches everything (READ). There is no local-path mode in `add` (READ).
- **A localhost URL works** (EXECUTED, §1.9). In development, the design system runs its SvelteKit dev server, which serves `static/r/` at `http://localhost:5173/r/...` (READ: getting-started page). Because `build` has no watch, a watcher reruns it on change (INFERRED: a Vite plugin hook or `bun --watch` on a small script).
- **Switching to the published registry needs no file change.**
  - The app's `components.json` holds the published URL (`https://raw.githubusercontent.com/plutosystemsco/design-system/<tag>/static/r`, style `maia`).
  - In development the app's maintainer runs `REGISTRY_URL=http://localhost:5173/r bunx shadcn-svelte@1.7.1 add <item> -y -o` (READ: `getRegistryUrl`).
  - INFERRED: the app gets a script such as `bun run ui:add:local <item>`.
- **A bun workspace is the wrong tool.** A workspace link makes the app import the design system as a package. That is exactly what constitution §3 forbids. It also needs one repository, and an app lives in its own (INFERRED).
- **Testing in an app.** INFERRED sequence:
  1. Add the item to the app from localhost.
  2. Use it on the page it was made for.
  3. Run the app's `svelte-check`, its Playwright page test, and its axe scan.
  4. Commit the installed source in the app.

  An item is done when its criteria are met in this repository, its change is reviewed and the release is tagged (constitution §2 and §4.2); an app's adoption is never a criterion. This repository's smoke suites run the install, `svelte-check` and `vite build` in scratch apps.
- **Stock or Pluto-owned.** An app can keep the official registry in `components.json` and add Pluto items by URL. Or it can point `components.json` at Pluto's registry, in which case every bare-name dependency (`button`, `tabs`) must exist in Pluto's registry (READ §1.4, §1.7).
  - INFERRED: the second model matches constitution §4.1 ("source, not a package") and gives one source.
  - It means Pluto's registry carries its own `button`, `tabs`, `table` and the rest.
  - **Answered:** installing stock shadcn-svelte components (MIT) into this repository with `add`, then restyling them to the tokens, is using a dependency as it is meant to be used, not the "copy code from prior art" that constitution §6 forbids (constitution §4.6; decisions.md, "Named dependencies are allowed", 2026-10-27). The brand's earlier website already held two such installed copies (READ).

## 4. What Pluto already has

### 4.1 The design books: v2 is current, but only proposed

- **v2** is PS-DB-0002, dated 2026-07-26, "status: proposed", "supersedes: Design Book v1.0" (READ). The brand repository's own guide says the same and keeps v1 in place (READ).
- **No acceptance is recorded.** v2 says that once it is accepted, its choices should be captured in a decision record. The brand has only two decision records (READ).
- **The second (accepted) confirms v2's mark geometry**: "dot .30 / gap .08 em" (READ).
- **v1** (READ) is stale on the mark gap (.16 em), the type (all IBM Plex Sans and Plex Mono) and the ground (white).
- **Four open calls** (READ: the design book §10; the brand's list of open questions):
  - the type stack;
  - the spacing base;
  - whether red and green may carry state meaning;
  - a doc-ID scheme.

  A fifth is open too: whether coloured dots may sit on ink for the icon. All five are answered since (see "What this memo does not settle").

The tokens in v2 (READ: its `:root` and §02 to §06):

| Group | v2 value |
|---|---|
| Colour | Ink `#14161C`; Ink Soft `#4A4F5C`; ink hairlines at 8% and 10%; **Paper `#F7F7F4`, the default ground**; Raised `#FFFFFF` for cards, inputs and figures; Charon Blue `#2456E6` (links, primary actions, focus); Tombaugh Red `#E23A2E` (errors, destructive); Sputnik Amber `#F0AE12` (caution, never text); Hydra Green `#1E9E56` (success) |
| Colour rules | Paper and ink make up at least 88% of a surface. One accent per surface. The four colours appear together only in the mark and in data figures, which cycle the four with blue first. No gradients, no tinted section grounds, no coloured dots on dark grounds |
| Type | Headings in IBM Plex Sans 600–700, tracked −2 to −3%. Body in Geist 400–500, measure 60–75 ch, line height 1.6. Labels, code and data in JetBrains Mono 400–500. Scale 44/700/−3% display, 28/700/−2% section, 16/400 body, 13.5 mono code, 12/500/+8% lowercase eyebrow |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 96 px, with nothing off the scale |
| Radius | Two only: the 8 px case radius, and full round for dot-derived shapes |
| Line | "The groove": an ink hairline at 8–10% over a 1 px white line |
| Elevation | Shadows only for menus and dialogs |
| Motion | One entrance per page (the mark's orbit-assemble, at most 900 ms, ease-out). Micro-feedback at most 200 ms. Reduced motion shows the composed end state |
| Mark | 2×2 dots, ⌀ .30 em, gap .08 em; the lockup rises .38 em (a translate of .76 em in a flex row); clearspace of one dot pair; the mark alone below 20 px; order blue, red, amber, green |
| Wordmark | lowercase "pluto". The brand's logo generator (Bun with opentype.js) emits self-contained SVGs from Plex Sans Bold outlines (READ) |

### 4.2 The earlier website's code

**The site's theme stylesheet** is a Tailwind v4 theme (READ).

- The four brand colours are converted to oklch, with their hex values in comments.
- `--primary`, `--ring` and `--destructive` are mapped to blue and red.
- Fonts come from `@fontsource-variable` (Geist, IBM Plex Sans, JetBrains Mono): self-hosted, so they fit constitution §4.6.

But it falls short of v2 in several ways.

- `--background` is white, where v2 makes Paper the ground.
- There is no `--raised` token.
- `--radius` is 0.45 rem (7.2 px).
- `--chart-1…5` are the stock greys.
- The sidebar tokens are stock.
- **The whole `.dark` block is the stock neutral theme, not a brand theme.**
- There are no spacing, motion or groove tokens.

**The site's `components.json`** uses style `maia`, base colour `neutral`, the Phosphor icons, the official registry, and `$lib/...` aliases (READ).

**Its `button` and `input`** are stock maia copies installed by the CLI (READ). They use `rounded-4xl`, which is about 18.7 px at that `--radius`. That breaks v2's two-radii rule. Its `utils.ts` uses the older `clsx` + `tailwind-merge` helper (READ; 1.7.0 changed it, §1.1).

**Its `four-dot.svelte`** is a runes component (READ).

- It still has **`gap: 0.16em`**, which the brand's mark decision and v2 corrected to .08 em.
- It sets em sizes as literals in a `<style>` block.
- It has no lockup.
- It is `aria-hidden` with no text alternative. That is right for decoration, but a lockup used as a home link needs an accessible name (INFERRED).

**Contrast against WCAG 2.2 AA** (EXECUTED: relative-luminance arithmetic in Node):

| Pair | Ratio | Passes? |
|---|---|---|
| Ink on Paper | 16.85 | Yes |
| Ink Soft on Paper | 7.63 | Yes |
| Blue on Paper | 5.51 | Yes |
| White on Blue | 5.92 | Yes |
| Red text on Paper | **4.01** | Fails 4.5 for body text |
| White on Red | **4.30** | Fails 4.5 for body text |
| Green text on Paper | **3.22** | Fails |
| White on Green | **3.45** | Fails |
| Amber on Paper | **1.82** | Fails; v2 already bans amber text |
| Line `#E4E4DE` on Paper | **1.19** | Fails the 3:1 that WCAG asks of an input's border |

INFERRED: the tokens need text-safe variants of red and green for error and success text, and a stronger input border. Otherwise constitution §4.4 and v2's own rule ("inputs keep visible borders") cannot both hold.

### 4.3 Mockups and research

- **The brand's mockups** are 11 page mockups, an index and a mark-tuning page (READ). The orbit-assemble mockup is the "current favorite" entrance (READ: the brand repository's guide).
- **All 13 HTML files load Google Fonts** (EXECUTED: `grep -l fonts.googleapis`), and so do both design books (READ). INFERRED: they are references for look and motion only. Nothing moves across as code.
- **The brand's five 2026-07-26 research memos** (READ: their index and section headings) cover the Macintosh, Braun and Bauhaus, transparency, earned minimalism, and Bell Labs, IBM and Plan 9. They distil into v2's five laws and its ban list.
- Several rules from them bear directly on the planned components (READ: the design book §07, §09):
  - "Real terminal output in real docs is welcome; costume is not." This governs the output pane.
  - The footer carries the build commit hash, build date, doc ID, a source link and the public-benefit-corporation sentence.
  - No glassmorphism.

### 4.4 What moves as is, what needs work, what is missing

**Moves as is**

- The six colour values and names, and their oklch conversions.
- The mark's geometry numbers (the brand's mark decision).
- The type stack, as a proposal (it matches the shipped preset).
- The spacing ladder, as a proposal.
- The motion budget and the ban list, as rules for review.
- Self-hosting fonts through `@fontsource-variable`.
- The `components.json` choices (maia, Phosphor, aliases).
- The logo generator's approach. It is our own code, and its SVG output can become a `registry:file` item.

**Needs work**

- A dark theme drawn from the brand. Today the `.dark` block is stock, and v2's "on ink, everything goes paper-white" rule needs translating into tokens.
- Paper as the ground and Raised for surfaces.
- One `--radius` of 8 px, with the stock `rounded-4xl` classes brought to it.
- Text-safe red and green, and a 3:1 input border.
- The chart tokens set to the four brand colours, blue first. Amber at 1.82:1 needs labels or patterns beside it (INFERRED from WCAG's non-text rule).
- The four-dot gap, plus a lockup component.
- Spacing, motion and groove tokens.
- The newer `cn` helper.
- The open calls of the design book §10, and the acceptance record v2 is owed. **INFERRED: the tokens specification should not fix values the owner has not accepted. It needs the owner to accept v2, or to say which parts stand.** The owner accepted v2 the same day (decisions.md, "Design book v2 is the token source", 2026-10-27).

**Missing for a product home page and an admin page** (INFERRED from what such pages hold; READ: shadcn-svelte's stock list in `docs/src/lib/registry/ui/`)

| Need | Stock base in shadcn-svelte | Pluto work |
|---|---|---|
| Top nav | `navigation-menu`, `sheet` (mobile) | The lockup, a theme toggle (`mode-watcher`, READ: `docs/content/dark-mode/svelte.md`) |
| Hero with tagline | none | Display type, the orbit-assemble entrance with its reduced-motion end state |
| Multi-tab editor | `tabs` (bits-ui) | A new editor component (§5.1), tabs with editable buffers |
| Output pane | `scroll-area` | New: mono, real output, no terminal costume |
| Run metrics (fuel, memory, time) | `card`, `badge`, `item` | New stat tiles, mono figures with units |
| Comparison table | `table` | Cells with source links and notes, horizontal scroll on phones |
| Code block with highlighting and copy | **`code-block`** (with copy button, runtime Shiki through a `use-highlighted-code` hook, READ: `docs/src/lib/registry/ui/code-block/`, `hooks/use-highlighted-code.svelte.ts`) | Tokens for the highlight theme; a build-time variant (§5.2) |
| Security section | `card`, `accordion`, `item` | Layout block |
| Footer | none | New: build hash and date, source link, PBC line |
| Admin charts | **`chart`** on layerchart (READ: `docs/src/lib/registry/ui/chart/`) | Brand chart tokens |
| Admin tables | `table`; `data-table` patterns | Sorting and filtering, if needed |
| Admin stat tiles | `card` | Shared with run metrics |
| Empty, loading and error states | `empty`, `skeleton`, `spinner`, `sonner` | Warm failure copy (the design book §07) |

## 5. Libraries the components imply

Sizes below are minified, then gzip -9 (EXECUTED). Each was a minimal browser entry, bundled with `bun build --minify` from packages installed in a scratch project. They are comparative facts, not budgets. npm versions and licences are from `npm view` (EXECUTED).

### 5.1 The code editor

| Library | Version, licence | Measured size | Notes |
|---|---|---|---|
| **CodeMirror 6** (`@codemirror/view` 6.43.15, `state` 6.7.6, `language` 6.13.1, `commands`, `lang-python` 6.2.1) | MIT | Minimal Python setup (line numbers, history, brackets, highlighting, keymaps): **374,795 B min, 126,004 B gz**. With the `codemirror` `basicSetup`: 470,742 B min, 156,168 B gz | A modular, accessible, contenteditable editor. Handles mobile and IME input. Its themes take CSS variables, so tokens can drive them (INFERRED). A wrapper of our own is a few dozen lines with `$effect` (INFERRED). `svelte-codemirror-editor` 2.1.0 (MIT) exists, but we would not need it |
| Monaco (`monaco-editor` 0.57.0) | MIT | Not bundled. **101.7 MB unpacked** (READ: npm `dist.unpackedSize`) | VS Code's editor: heavy, uses web workers. The usual loader, `@monaco-editor/loader`, "by default … loads monaco sources from CDN" (READ: its README via `npm view`). That breaks constitution §4.6 unless reconfigured. INFERRED: poor on phones, and far beyond "one editor, one run" |
| `prism-code-editor` 5.4.0 | MIT | Core with Python: **6,410 B min, 3,567 B gz** | A textarea under a highlighted overlay. Tiny. Its own extensions add brackets, search and the rest |
| `codejar` 4.3.0 | MIT | 6,043 B min, 2,633 B gz (no highlighter included) | Minimal contenteditable. Highlighting and undo are left to us |

INFERRED: **CodeMirror 6** fits best. It carries real undo, keyboard and screen-reader behaviour, and Python indentation, which constitution §4.4 asks for. It costs about 126 KB gzipped, loaded only on the editor's page or lazily when the editor scrolls into view. `prism-code-editor` is the fallback if that weight proves too much in a consuming app.

### 5.2 Syntax highlighting for static code blocks

- **Shiki** 4.5.0, MIT (EXECUTED: `npm view`). At run time, core with the JavaScript regex engine, Python and one theme measures **247,375 B min, 66,043 B gz** (EXECUTED). Grammars and themes are lazy imports.
- The stock `code-block` uses runtime Shiki with the JavaScript engine and a per-language lazy loader (READ: `docs/src/lib/registry/lib/highlighter.ts`). The docs site depends on `shiki ^3.20.0` (READ: `docs/package.json`); npm's latest is 4.x (EXECUTED). INFERRED: check the major-version change before reusing that hook's shape.
- **At build time** (in a prerendered `load` or a Svelte preprocessor), Shiki ships no client JavaScript. The page gets coloured spans (INFERRED).
- INFERRED: the home page's install-and-run snippet is fixed text, so it is highlighted at build time. The editor highlights itself through CodeMirror's Lezer grammar. Two highlighters then need one palette, so both read the same token variables. Shiki offers a CSS-variables theme for exactly this (INFERRED from Shiki's documentation as remembered; the Shiki memo of 2026-10-31 confirmed it, §1.2 and §3, EXECUTED there).
- `highlight.js` 11.12.0 (BSD-3-Clause) is the older alternative (EXECUTED: `npm view`).

### 5.3 Charts for an admin page

| Library | Version, licence | Unpacked | Notes |
|---|---|---|---|
| **layerchart** | 2.9.1, MIT | 5.35 MB | What shadcn-svelte's `chart` wraps (docs pin `^2.0.0`). Svelte 5 peer, built on d3 modules. Depends on prerelease `@layerstack/*` versions such as `2.0.0-next.19` (EXECUTED: `npm view layerchart dependencies`) |
| uPlot | 1.6.32, MIT | 0.55 MB | Canvas, very small and fast for time series. Not Svelte-native. Canvas needs its own accessible table fallback (INFERRED) |
| Chart.js | 4.6.1, MIT | 6.2 MB | Canvas; a general-purpose library |
| ECharts | 6.1.0, Apache-2.0 | 60.3 MB | Large |
| Unovis (`@unovis/svelte`) | 1.7.1, Apache-2.0 | 0.09 MB wrapper | SVG; depends on `@unovis/ts` |

(Versions, licences and unpacked sizes from EXECUTED `npm view`. The bundled size of layerchart needs a Svelte compile and was not measured here; see "What this memo does not settle".)

INFERRED: **layerchart, through the `chart` item**. It is the path the stock component already takes, and its SVG output can carry the brand's chart tokens and text labels. An admin page is one page behind a login, so its weight matters less than the home page's.

## 6. A recommended repository layout

INFERRED throughout. This shows the shape the build in §1.6 and the tests in constitution §4 imply. It is not a specification.

```
design-system/
  package.json  bun.lock            # shadcn-svelte@1.7.1 pinned; every library pinned
  svelte.config.js  vite.config.ts  # a SvelteKit app: its routes preview every item
  components.json                   # the preview app's own config (style maia)
  registry.json                     # the item list; bare names for our own dependencies
  tokens/
    pluto.tokens.json               # the one source: colour, type, space, radius, motion, light and dark
  scripts/
    build-tokens.ts                 # tokens -> the pluto-theme item's cssVars and css, and src/app.css
    build-registry.ts               # runs `shadcn-svelte registry build --output build/r/styles/maia`,
                                    #   then copies into a versioned path; reruns on change in dev
  src/
    app.css                         # generated from tokens, as an app would receive it
    lib/utils.ts
    lib/registry/
      ui/<name>/                    # registry:ui (button, tabs, table, code-block, chart, ...)
      blocks/<name>/                # registry:block (top-nav, hero, footer, run-metrics, comparison-table)
      lib/  hooks/  files/          # highlighter, editor setup; logo SVGs as registry:file
    routes/
      +layout.svelte                # theme toggle, tokens applied
      +page.svelte                  # the catalogue
      [item]/+page.svelte           # one preview page per item, light and dark, every variant
  tests/
    registry.test.ts                # registry.json parses; every item has a preview page;
                                    #   no colour or size literal in a component (§4.3);
                                    #   every dependency has a range in package.json
    e2e/*.spec.ts                   # Playwright: each preview page in both themes;
                                    #   @axe-core/playwright with zero violations;
                                    #   keyboard paths for each interactive item;
                                    #   a screenshot comparison per item
  wrangler.jsonc                    # static assets only: the prerendered previews and build/r
```

- **Checks.** `svelte-check` and `prettier --check`, as the brand's earlier website already runs (READ). The test files above. A registry smoke test that runs the real `add` against the dev server into a scratch app, as §1.9 did by hand.
- **Contrast.** It is checked twice: by axe on the rendered pages, and by a unit test over the token pairs, using the arithmetic of §4.2.
- **The output path.** It is `build/r/styles/maia`, not `static/r`. The CLI expects the `/styles/<style>/` segment (§1.7). Generated JSON then stays out of git (this repository's `.gitignore` already ignores `build/`, READ).

## Recommendation

This commits us to nothing. The specification decides.

1. **Registry.**
   - Build with `shadcn-svelte@1.7.1` pinned. Use `registry:theme` for the tokens, `registry:ui` and `registry:block` for components, and `registry:file` for the logo SVGs.
   - Emit to `/r/styles/maia/`.
   - Write our own dependencies as bare names, never `local:`. Apps point `components.json` at the Pluto registry, so it is their one source.
   - Update by `add -o` in a clean tree and `git diff`, guided by each item's changelog.
2. **Hosting.**
   - A public registry on a Cloudflare Worker with static assets, beside the preview pages.
   - Each release at a versioned path, with apps pinning one.
   - No token scheme. A private registry would need a path token, never a query token.
3. **Tandem development.**
   - An app keeps the published URL in `components.json`, and installs from `REGISTRY_URL=http://localhost:5173/r` in development.
   - An app installs an item, uses it, and runs its own `svelte-check`, Playwright and axe checks.
4. **Starting material.**
   - Take v2's tokens, but only after the owner accepts v2 or rules on its §10 calls.
   - Fix the dark theme, the radius, the red and green text contrast, the input border, the chart colours and the four-dot gap as the first items.
   - Treat the mockups as visual reference only.
5. **Libraries.**
   - CodeMirror 6 for the editor.
   - Shiki at build time for static code blocks, sharing token variables with CodeMirror's highlight style.
   - layerchart through the `chart` item for an admin page.

In one line: shadcn-svelte 1.7.1's registry does what we need from a public static host, with two traps (the `/styles/<style>/` path and broken `local:` names), no namespaces and no real auth. Pluto's design book v2 is the source, but on this date it is still only proposed.

## What this memo does not settle

- **Whether v2 is accepted.** Answered: the owner accepted it (decisions.md, "Design book v2 is the token source", 2026-10-27). Its four open calls are answered: the type stack, the spacing base and state colour in "The design book's open calls, answered" (2026-10-27), and the doc-ID scheme, `PS-<series>-<NNNN>`, in "The theme mechanism, the doc-ID scheme and the footer's sentence" (2026-11-01). The icon on ink uses the lifted primitives for its dots (decisions.md, "After the public-readiness review").
- **Whether installing stock shadcn-svelte components and restyling them counts as copying prior art.** Answered: it does not (constitution §4.6; decisions.md, "Named dependencies are allowed"). So the registry is one source, and it serves its own `button`, `tabs` and the rest (`001` decision 29).
- **Whether a Pluto registry can serve the `/init?preset=` endpoint.** It does not. Serving `/init` is outside `001`'s scope; an app runs `init` against the official registry, then points `components.json` at this one (§1.7).
- **layerchart's bundled size.** Measured later: about 122 to 136 KB gzipped on a page with one bar chart and one line chart (the data-items memo of 2026-10-31, §2.4, EXECUTED there).
- **CodeMirror's size inside a real app.** Measured in a scratch SvelteKit project at this repository's versions: 126 to 132 KB gzipped on the one route that holds it (the CodeMirror memo of 2026-10-31, §2, EXECUTED there). Phones and screen readers are outside this release's checks (decisions.md, "After the public-readiness review").
- **Whether `bunx` runs the CLI under Node, and how the CLI detects Bun.** Answered: under the `node` on `PATH`, and it detects Bun from the app's lockfile (the foundation memo of 2026-10-27, §3).
- **Shiki 4's CSS-variables theme, and its equivalence with a CodeMirror `HighlightStyle`.** Answered by the Shiki memo of 2026-10-31 (§1.2, §3 and §5): both engines read one set of `--code-*` properties.
- **Cloudflare's static-asset limits.** Not needed. The registry is served from its GitHub tag, and nothing is deployed (decisions.md, "The registry is served from GitHub, and the repository is public").
- **Whether the `local:` defect is known upstream.** No issue search was made. This registry writes its own dependencies as bare names, never `local:` (`001` decision 19; `registry.test.ts` checks it), so the defect does not reach it.
