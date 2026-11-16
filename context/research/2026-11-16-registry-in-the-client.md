# The registry in the client

- **Status:** complete. A memo; it commits us to nothing. `024b` stands on it.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Question:** the site's shared client chunk holds `registry.json` whole. What of it does the browser read, what does it cost each page and each new item, and which fix removes the rest?
- **Found by:** `026`'s change review, finding 8 (`reviews/026-toast-pr-2026-11-15.md`); `027a`'s change review, "Page weight" (`reviews/027a-batch-a-quiet-items-pr-2026-11-15.md`); the Landing notes of [`026`](../specifications/026-toast.md) and [`027`](../specifications/027-batch-a.md).

## How it was measured

The tree at `ba8694d` (Merge 021). It was exported with `git archive` into a scratch folder, installed with `bun install --frozen-lockfile`, and built with `bun run build`. Each option was then made in its own copy and built with `bun --bun vite build`. Nothing ran on port 5199.

**The static measure.** For a page, it is the gzipped HTML plus every JS and CSS file the HTML names (module preloads and stylesheets), at gzip levels 6 and 9. Fonts, lazy chunks and iframes are left out. So the totals are lower than the perf project's figures, and only the differences are used. Five pages were read: `/`, `/components/button/`, `/components/`, `/brand/colour/` and `/changelog/`. Each option's difference was the same on all five, within 10 B.

**The per-item measure.** One item's entry was cut out of the built chunk, and the gzipped sizes before and after were compared.

## What was found

### 1. Who imports `registry.json`, and who runs in the browser (READ)

| Module | Import | Runs in the browser |
|---|---|---|
| `src/lib/site/sitemap.ts` l. 10 | `import registry from "…/registry.json"`, whole | **Yes.** The site's root layout imports it, through `(site)/+layout.svelte`, `chrome/side-nav.svelte`, `chrome/footer.svelte`, `chrome/all-pages.svelte`, `page/prev-next.svelte` and about 30 route files |
| `src/lib/site/items.ts` l. 8 | whole, for `listedItems()`'s default argument | **Yes.** Imported by `sitemap.ts` and `doors.ts` |
| `src/lib/site/start/install.ts` l. 6 | whole | No. Only `start/+page.server.ts` and `start/install/+page.server.ts` import it |
| `routes/(site)/start/modes/+page.server.ts`, `start/theme/+page.server.ts` | whole | No (server loads) |
| `routes/(site)/+page.server.ts`, `components/+layout.server.ts` | `readFileSync("registry.json")` | No (server loads) |

**Found beside it:** `src/lib/site/site.ts` l. 11 imports `package.json` whole, to read `version` (l. 16). The browser gets the whole file: scripts, `devDependencies`, every pinned version.

### 2. The fields the browser reads (READ)

- `sitemap.ts` maps each listed item to a page. It reads `name` (the path), `title`, `description` (the page's `summary`) and `meta.group`.
- `items.ts`'s `isListed` reads `meta.deprecated`, to drop the alias.
- `doors.ts` reads only the count: `` `${listedItems().length} parts` ``.
- **No browser code shows a component page's `summary`.** The places that render a `summary` are a leaf or Brand page's own entry, the Start, Brand and Foundations landings listing their own pages, and the home page's doors. A component page's summary is read only on the server: by `llms.txt/+server.ts`, and by `search/sources/pages.ts`, which `search.json/+server.ts` runs at prerender.
- The components index gets its titles, descriptions and facts from `components/+layout.server.ts`, as page data. It does not use the browser's copy.

So the browser needs `name`, `title`, `meta.group` and the listed filter, and `description` only so that `SITEMAP` is one list on both sides. Nothing in the browser reads `files`, `registryDependencies`, `dependencies`, `devDependencies`, `author`, `type`, `cssVars`, `css`, `font`, `meta.since`, `meta.modes` or `meta.stock`.

`registry.json` holds each file's **path**, not its content. The published `static/r/` items hold the content, and the client never imports them. Item sources do reach the browser, legitimately, because the site renders its own components.

### 3. The cost on every page (EXECUTED)

The chunk is `build/_app/immutable/chunks/D1b4t0hR.js`: **92,920 B raw, 16,840 B at gzip 6, 16,754 B at gzip 9.** All five pages preload it. 21 built route and entry files import it.

| Part of the chunk | Raw | gzip 9 |
|---|---:|---:|
| The `registry.json` object | 88,954 | 15,341 |
| The rest (the `package.json` object, the shared code) | 3,966 | 1,730 |

The registry object's raw bytes, by field, summed over its 80 entries:

| Field | Raw bytes | Read in the browser |
|---|---:|---|
| `files` (365 paths) | 29,479 | no |
| `css` (the theme item) | 14,358 | no |
| `meta` | 12,423 | `group` (1,254) and `deprecated` (58) only; `stock` alone is 7,571 |
| `description` | 9,686 | only to fill `summary` |
| `cssVars` (the theme item) | 5,919 | no |
| `author` | 5,760 | no |
| `registryDependencies` | 4,735 | no |
| `type` | 1,484 | no |
| `title` | 1,343 | yes |
| `name` | 1,256 | yes |
| `dependencies`, `devDependencies`, `font` | 1,423 | no |

`package.json` is 3,309 B raw and about 1.1 kB gzipped.

### 4. The cost of each new item (EXECUTED)

Each figure is one entry cut from the built chunk, at gzip 6.

| Item | As `registry.json` ships it | As the slim module ships it |
|---|---:|---:|
| `link` | 94 B | 65 B |
| `button-group` | 79 | 56 |
| `progress` | 53 | 40 |
| `toast` | 144 | 93 |
| `meter` | 58 | 39 |
| `error-summary` | 107 | 79 |
| `dialog` | 167 | 43 |
| `sidebar` | 302 | 69 |
| **Mean of the four newest** | **93** | **60** |
| Mean of all eight | 126 | 57 |

Cut together from the JSON, `027a`'s three items cost 232 B in the registry's shape and 152 B in the slim one. `toast` costs 147 B and 92 B.

**This corrects the finding's slope.** The builds measured about 0.6 to 0.9 kB on every page: `026` for one item, `027a` for three (+942 B on Button: HTML +57, JS +629, CSS +256). The registry entry is only about 0.1 kB of each item's share. The rest comes from three other places: the item's utilities in the site's CSS, its link in the navigation's HTML, and its route in SvelteKit's route table (READ, `build/_app/immutable/entry/app.*.js` lists `"/(site)/components/<name>"` for each item). The registry fix removes a **fixed cost** of about 11.6 kB from every page. It lowers the slope by about a third.

### 5. The options, measured (EXECUTED unless marked)

The saving on every page, at gzip 6, against `ba8694d`:

| Option | What changes | Saved per page | Registry-only fields left in the client |
|---|---|---:|---|
| **(c)** Vite named imports | `import { items } from "registry.json"` | **85 B** | all |
| **(c)** for `package.json` alone | `import { version } from "package.json"` | about 1.0 kB | (not the registry) |
| **(d)** import the CLI's index instead | `static/r/styles/maia/index.json` | 6.6 kB | `author`, `type`, `registryDependencies`, `meta.since`, `meta.modes`, `meta.stock` |
| **(a)** a slim JSON module, `{ name, title, description, meta: { group } }`, listed items only | the two site imports | 10.5 kB | none |
| **(a)** with `package.json` by `{ version }` | as above, plus `site.ts` | 11.5 kB | none |
| **(a)** as a generated `.ts` module, with `{ version }` (the prototype of `024b`) | as above | **11.59 kB** (11,588 to 11,597 B on the five pages) | **none** |
| (a) without `description` | not built | about 3.6 kB more (INFERRED: the data alone is 4.6 kB gzipped with descriptions and 1.0 kB without) | none |
| **(b)** server loads | not built | about the same as (a) on a cold load (INFERRED) | none |

- **(c) does not work for this shape.** Vite's guide: JSON files can be imported directly, and importing "a root field as named exports … helps with tree-shaking" (READ, vite.dev/guide/features.html#json, 2026-11-16). Tree-shaking stops at root fields. `items` is the root field that holds everything, and the bundler keeps every property of each object in the array. It does work for `package.json`, whose `version` is a root field.
- **(d) is the CLI's published file.** Its shape belongs to shadcn-svelte, and it still carries six fields the browser never reads.
- **(a) as built.** The shared chunk drops from 92,920 to 15,613 B raw, and from 16,840 to 5,262 B at gzip 6. A scan of every `.js` file under `build/_app/immutable/` (756 files) finds none of 412 registry-only values. Those values are every `files[].path` (365), every `meta.stock.sha256` (41), and the keys `registryDependencies`, `devDependencies` and `cssVars`, quoted and unquoted. At `ba8694d`, the scan finds 409 of the 412 in that one chunk (the three quoted key forms do not occur). The prototype's `bun test` of `sitemap`, `search` and `previews` passes, 121 of 121, as do `registry.test.ts`'s two "020 test 5" cases. Its `svelte-check` reports 0 errors and 0 warnings over 2,268 files, one more than at `ba8694d` (2,267, also 0). The four changed files pass `prettier --check`. (A first run reported 110 errors, all from a shared `node_modules` that resolved `$app/tsconfig` to another copy's types. With the prototype's own install, the run was clean.)
- **(a) without `description`** would need the browser's `SITEMAP` to differ from the server's, whose `llms.txt` and search read component summaries. That changes `sitemap.ts`'s contract ("Every page the site has, listed once"). It is left for later.
- **(b)** moves the same four fields into a `+layout.server.ts`. A prerendered page inlines its layout's data in its HTML, and in its `__data.json` for client navigation (INFERRED, from SvelteKit's prerender output: `build/components/__data.json` holds the index's layout data). So the bytes stay on every page, uncached, instead of in one immutable chunk the browser keeps. `SITEMAP`, `sitePage`, `navOrder` and `doorPages` are synchronous exports that about 40 modules read, `doors.ts` at module level among them. Each would have to read page data instead, which rewrites their interface. The cold-load saving is no larger than (a)'s.

### 6. Precedent (READ, 2026-11-16)

- **shadcn-svelte's own site** (`context/prior_art/shadcn-svelte/docs`, at `6149e14`). `scripts/build-registry.ts` writes `src/__registry__/blocks.ts`, which holds the block names alone, and `src/__registry__/index.js`, which holds each example's file list. Both begin "This file is autogenerated by scripts/build-registry.ts / Do not edit this file directly." The folder is git-ignored (`.gitignore` l. 105), and `dev:svelte` waits for it (`wait-on src/__registry__/index.js`). The full registry is served as static JSON (`routes/registry/+server.ts` redirects to `/registry/index.json`). Navigation comes from content collections (`velite.config.js`), not the registry. In short: a generated slim module for the client, written by the registry build.
- **Carbon's site** (`context/prior_art/carbon-design-system-carbon-website`, at `5e9cd1d`). Its components import `src/data/components.json` (9,949 B: each component's name and screen-reader testing status), a file the site keeps for itself (`A11yStatus.js`, `ComponentOverview.js`). The navigation is `src/data/nav-items.yaml`, titles and paths only, read by `gatsby-theme-carbon`. In short: the client reads a small file of its own, never the package's metadata.
- **SvelteKit's server-only modules** (svelte.dev/docs/kit/server-only-modules). A module named `*.server.ts`, or under `$lib/server/`, cannot reach the browser: "the build fails even when the public code uses only a safe export", and indirect imports are checked too. That is the guard (b) would use. It is not needed for (a), whose guard is the built-chunk scan.
- **This repository.** `components/+layout.server.ts` already reads `registry.json` on the server, with `readFileSync`, for the index and the facts. `scripts/build-tokens.ts` writes generated files through prettier, and writes one only when its formatted content changes (001 decision 15). `src/app.css` is generated and committed, and `tests/unit/generated.test.ts` asserts that it equals a fresh run. `static/r/` is generated, committed and regenerated at each landing (`roadmap.md` §2, "Ledger file").

### 7. Found beside it, for later

- **The components index's data carries `meta.stock`** (READ, `components/+layout.server.ts` l. 33–37 copies `meta` whole). The index never reads it. It is 41 entries, about 2.0 kB gzipped, in `/components/`'s HTML (22.6 kB gzipped) and again in its `__data.json` (9.5 kB gzipped) (EXECUTED). This is one page, and it could be a later small change. It is not in `024b`.
- **The slope that remains.** The route table, the navigation links and each item's utilities grow with every item. Those costs are the site's structure, not a leak.

## Recommendation

**Option (a): a generated module.** `bun run build:registry` writes it from `registry.json`, with the listed items and the four fields alone. `site.ts` reads `package.json` by `{ version }`. The reasons:

- **It is the largest measured saving:** 11.6 kB on every page, the same as (b) on a cold load, and cached.
- **It changes no interface.** `SITEMAP` and `listedItems()` keep their names, shapes and callers. Server modules keep reading `registry.json` whole.
- **Its type is the guard.** A browser module that reaches for `files` gets a type error from `bun run check`, before any build.
- **It follows the precedent** of shadcn-svelte's site and of this repository's generated, committed and tested files.

It is written up as [`024b`](../specifications/024b-the-site-stops-shipping-the-whole-registry.md).
