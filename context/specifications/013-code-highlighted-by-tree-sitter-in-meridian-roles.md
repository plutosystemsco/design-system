# 013 — Code highlighted by tree-sitter, in Meridian's roles

- **Status:** built and reviewed, 2026-11-15, committed on `release/0.12.0` as `4822ae5` over `b91b79d` (`014`). Change review: [`../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-pr-2026-11-15.md`](../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-pr-2026-11-15.md) (0 High, 0 Medium, 6 Low, all dealt with). Revised 2026-11-14 after its specification review, [`../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-spec-2026-11-14.md`](../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-spec-2026-11-14.md) (5 High, 14 Medium, 9 Low; each answered in its Disposition and under "Review dispositions" below), and reviewed twice more before the build. Decision 20's Python editor bar was reset at checkpoint 2 (`decisions.md`). Not tagged: `v0.12.0` follows the change reviews of `015` and `017`.
- **Date:** 2026-11-14
- **Author:** the design lead
- **Kind:** the highlighting engine of `highlighter`, `use-highlighted-code`, `code-block` and `code-editor` moves from Shiki and CodeMirror's Lezer and legacy modes to tree-sitter, with queries this system writes. Shiki stays as the fallback. The `code` map becomes Meridian's roles, with Tombaugh's colours as new tokens. `code-languages` changes its job. The workbench is removed; its specimens and the reference become test fixtures. Tests. Part of the shared 0.12.0 release. **Interface change** for installed apps (decision 17).
- **Depends on:** [`014`](./014-the-white-light-mode-code-ground.md), the white light-mode code ground, **landed** and change-reviewed: 013 is built on its commit on `release/0.12.0` (decision 9). Through it, `v0.11.0` (`8cb06ba`), which holds every item this specification changes: [`004`](./004-code-and-data.md) (the code items), [`007`](./007-the-full-highlight-palette-and-the-ink-surface.md) (the twenty-one slots, `code-languages`, the ink surface), [`011`](./011-the-brand.md) (the grounds). The workbench this specification removes is in the working tree and was never released.
- **Ships with:** `014` (landed), `016` (the brand yellow), `015` and `017` (the design site, in two parts), as one release, 0.12.0, with one changelog entry (`decisions.md`, "One release, 0.12.0, for the white ground and tree-sitter"; "A public design site, the workbench dropped, and properties under Meridian"). Each specification is committed to the `release/0.12.0` branch when it lands; 013's build starts from `014`'s commit there.
- **Blocks:** the selection token, which `014` decision 3 leaves to "`013`, or a later palette specification"; 013 does not add it (decision 23).
- **Research it stands on:**
  - [`../research/2026-11-14-how-to-highlight-code-accurately.md`](../research/2026-11-14-how-to-highlight-code-accurately.md) (the accuracy memo) and its data [`../research/2026-11-14-highlighting-reference.json`](../research/2026-11-14-highlighting-reference.json) (the reference);
  - [`../research/2026-11-14-meridian-the-owners-syntax-theme-guide.md`](../research/2026-11-14-meridian-the-owners-syntax-theme-guide.md) (Meridian, the owner's guide, cited as the source of the roles);
  - [`../research/2026-11-14-meridian-and-tombaugh.json`](../research/2026-11-14-meridian-and-tombaugh.json), candidate `tombaugh` (the swatches decision 11 ships);
  - [`../research/2026-10-31-shiki-and-a-token-highlight-palette.md`](../research/2026-10-31-shiki-and-a-token-highlight-palette.md) and [`../research/2026-10-31-codemirror-6-under-svelte-5.md`](../research/2026-10-31-codemirror-6-under-svelte-5.md) (why the current stack was chosen).
- **Design calls:** `../decisions.md`, 2026-11-14: "A public design site, the workbench dropped, and properties under Meridian"; "One release, 0.12.0, for the white ground and tree-sitter"; "Tombaugh, a number role, the white ground first, and docstrings as strings"; "Code takes Meridian's roles"; "Code is highlighted by tree-sitter, in blocks and the editor"; "A code-palette workbench" (its three proposed rules).
- **Measurements made for this specification** are labelled **EXECUTED (013)**. They ran on 2026-11-14 on macOS (Darwin 25.5.0, arm64) with Bun 1.4.4 and Node 22.14.0, in a scratch folder outside this repository, with packages installed there by `bun add --ignore-scripts`. Colour figures used this repository's `src/lib/workbench/palette.ts` (`oklch`, `fromOklch`, `contrastRatio`, `deltaE`), imported by absolute path. **Sizes are in kB, 1,000 bytes;** gzip at level 9.

## Intent

The owner asked for code highlighted "to 100% accuracy". The accuracy memo measured the ways to do it against a hand-labelled reference. Its best candidate, **c2**, was each grammar's own stock queries with about 190 patterns of ours appended so they win: 96.6% on the workbench specimens and 95.5% on held-out samples. Shiki stalls near 88% however many theme rules it is given. The editor scores 73.5%, and agrees with the code block on 74.2% of characters. The owner ruled: tree-sitter, at prerender and in the browser, with Shiki where no grammar is usable, and the editor in the same change.

**This specification does not ship c2.** Prior art is studied, never copied (constitution §6), so every query here is written fresh, with no stock base. Fresh queries have not been measured. The memo's figures are the evidence that tree-sitter can reach these levels; the bars of decision 19 are targets inferred from them, confirmed or reset at checkpoint 1.

The owner then gave Meridian, a syntax theme of their own, and ruled that code takes its roles: colour carries meaning, not syntax; one lightness per mode; red is rare. Later rulings settled the rest: no bold and no italic; a `number` role of its own; Tombaugh's colours, with numbers yellow and constants orange; the white light ground first (`014`); docstrings as strings; and Meridian's split of properties.

So this specification does three things at once, because each needs the others.

1. **One engine labels code.** tree-sitter parses it; our own queries name each node's role. The block, the hook and the editor ask the same session for the same code, so they colour it the same way by construction.
2. **The roles are Meridian's**, with `number`, `link` and three diff roles beside them. The twenty-one slots of `007` become sixteen entries. The capture names in our queries *are* the role names.
3. **The colours are Tombaugh's,** measured on `014`'s white light ground and Pluto's dark ground.

**Terms of art.**

- A **role** is one colour role and one `--code-<role>` custom property. It replaces `007`'s *slot*. The **body** is the `text` role.
- A **grammar** is a tree-sitter parser, shipped as a **WASM** (WebAssembly) file. **`web-tree-sitter`** is tree-sitter's runtime for JavaScript: a WASM file and a JavaScript module.
- A **query** (a `.scm` file) matches patterns of syntax-tree nodes and **captures** them under a name, such as `@keyword`. An **injection** parses part of a file with another grammar (a `<script>` inside HTML). **Locals** mark which names are local variables.
- A **session** is the highlighter's state for one changing document: its tree, and how to update it after edits.
- An **`ERROR` node** is what tree-sitter builds around text it cannot parse, such as an unclosed bracket.
- **Prerender** is SvelteKit rendering a page to HTML at build time (`001` decision 3).
- A **decoration** is CodeMirror's way to add a class to a range of the document without changing its text. A **view plugin** is CodeMirror's per-view object that sees each committed update.
- **Lezer** is CodeMirror 6's parser system. A **legacy mode** is a CodeMirror 5 tokenizer run through `StreamLanguage`.
- **ΔE** is OKLab distance × 100 (`deltaE`).
- The **held-out set** is the reference's ten gallery samples, labelled before any highlighter ran on them and never used to tune anything.

**Not here:** every background (`014` owns the light code ground and active line; the dark grounds and the page never change); the selection token; semantic highlighting from a language server; any language beyond today's twenty-six; folding; a Web Worker for parsing; the public design site (`015`); Firefox, Safari and screen readers (decision 23).

## Decisions

Each decision gives its reason. The owner has answered every question asked of this specification; none is open. The build waits on `014`'s landing (decision 9).

### 1. Scope

| Item or file | Change |
|---|---|
| `highlighter` (`registry:lib`) | Rewritten: tree-sitter engine, Shiki fallback, our queries, the language table. 1 file becomes 29 (decision 5). Its `meta.stock` goes (decision 5). |
| `use-highlighted-code` (`registry:hook`) | Same signature; streams through a session (decision 15). |
| `code-block` (`registry:ui`) | No prop changes. Its body takes `text-code-text`; its tokens carry role classes, never `font-medium`; it marks when its highlighting has settled (decision 15). |
| `code-editor` (`registry:ui`) | Colour comes from the highlighter through a view plugin; `codeTheme`'s text and caret, and the prerendered fallback `pre`, read `--code-text`; Lezer keeps structure only (decision 16). Gains `highlighter` as a registry dependency. |
| `code-languages` (`registry:lib`) | Its languages keep their Lezer support whole and take our colour (decision 16). |
| `pluto-theme` (`registry:theme`) | The `code` map becomes the roles; four `syntax-*` theme roles and nine primitives go, ten roles and twenty primitives arrive (decision 12). |
| `scripts/build-tokens.ts`, `scripts/tokens.ts` | Emit the new map. |
| `scripts/lint-literals.ts` | L19's names follow decision 12; `.scm` item files are read (decision 6). |
| `scripts/convert-reference.ts` (new) | Converts the reference to roles (decision 19). |
| The workbench | Removed; what tests need moves to `tests/` (decision 18). |
| Item pages | `highlighter`, `code-block`, `code-editor`, `code-languages`, `use-highlighted-code`, `pluto-theme` updated (decision 18 lists the users of the removed names). One test view added, `/view/code-agreement/` (decision 21). The public site, `015`, will absorb the six item pages; 013 designs none of that. |
| Tests | Decision 21, with every expectation that changes named. |

`stage-card`, `live-console`, `chat` and `product-home` change no file. They render `code-block` with `language`, so they inherit the engine (decision 20 says what that costs).

### 2. The engine: `web-tree-sitter` at prerender and in the browser

tree-sitter runs through `web-tree-sitter` 0.27.2 in both places. The Node bindings (`tree-sitter` on npm) are not used.

- **Why one runtime.** The owner's reason for tree-sitter everywhere is "a block looks the same static or live". One runtime and one set of WASM grammars makes prerender and browser agree by construction. Criterion 6 measures it anyway.
- **Why not the Node bindings at prerender.** Each grammar package's `install` script is `node-gyp-build` (READ, every grammar's `package.json`). Bun blocks it unless the package is trusted (EXECUTED (013): "Blocked 19 postinstalls"). An app would need `trustedDependencies` for twenty packages, a C toolchain where no prebuild fits, and a second engine whose behaviour we would have to prove equal.
- **What the runtime gives** (EXECUTED (013)): `Parser`, `Language`, `Query`, `Tree`, `Edit` and `Node` are exported; `Query.captures(node, { startIndex, endIndex })` limits a query to a range; `Tree.edit(new Edit({...}))` and `parser.parse(text, oldTree)` re-parse incrementally; `tree.getChangedRanges(oldTree)` names what moved. **Node offsets are UTF-16 code units**: in `s = "é😀x"` the string node runs from 4 to 10, which is its JavaScript length. CodeMirror's positions are UTF-16 code units too.
- **Every grammar loads.** The memo ran 18; the other four of the 21 (C, C++, PHP, Kotlin) were loaded and parsed here: ABI 15, 14, 15, 14 (EXECUTED (013)).
- **Our highlighter, not tree-sitter-highlight.** The runtime has no highlighter. Ours follows tree-sitter-highlight's rules as the memo read them (§4.3): the last pattern that matches a node wins; the innermost highlighted node wins each character; an injected language paints over its host and leaves unpainted characters to it; a pattern marked `(#is-not? local)` is skipped for a name that resolves to a local definition. Text predicates (`#eq?`, `#match?`, `#any-of?` and their negations) are the runtime's own. **An unknown predicate compiles** in `web-tree-sitter` and is listed in the query's `predicates` (the review, EXECUTED), so the check is our own: the engine throws on a predicate it does not implement, and `queries.test.ts` asserts none appears. About 300 lines with injections and locals.

### 3. The grammars, named and pinned

Versions read with `bun pm view` on 2026-11-14; WASM sizes measured on the installed packages (EXECUTED (013)). Every grammar is MIT (READ, each package's licence; the memo's §6.4; the review's `npm view`).

| Languages | Package | Version | WASM file | Raw kB | Gzipped kB |
|---|---|---|---|---|---|
| runtime | `web-tree-sitter` | 0.27.2 | `web-tree-sitter.wasm` (+ JS module) | 211 | 83 (+ 32 JS) |
| typescript, tsx | `tree-sitter-typescript` | 0.23.2 | `tree-sitter-typescript.wasm`, `tree-sitter-tsx.wasm` | 1,414 / 1,446 | 133 / 136 |
| javascript, jsx | `tree-sitter-javascript` | 0.25.0 | `tree-sitter-javascript.wasm` | 412 | 49 |
| python | `tree-sitter-python` | 0.25.0 | `tree-sitter-python.wasm` | 458 | 64 |
| rust | `tree-sitter-rust` | 0.24.0 | `tree-sitter-rust.wasm` | 1,103 | 114 |
| go | `tree-sitter-go` | 0.25.0 | `tree-sitter-go.wasm` | 217 | 38 |
| java | `tree-sitter-java` | 0.23.5 | `tree-sitter-java.wasm` | 415 | 50 |
| csharp | `tree-sitter-c-sharp` | 0.23.5 | `tree-sitter-c_sharp.wasm` | 5,351 | 315 |
| ruby | `tree-sitter-ruby` | 0.23.1 | `tree-sitter-ruby.wasm` | 2,106 | 162 |
| html | `tree-sitter-html` | 0.23.2 | `tree-sitter-html.wasm` | 18 | 7 |
| css | `tree-sitter-css` | 0.25.0 | `tree-sitter-css.wasm` | 129 | 21 |
| bash | `tree-sitter-bash` | 0.25.1 | `tree-sitter-bash.wasm` | 1,358 | 177 |
| json | `tree-sitter-json` | 0.24.8 | `tree-sitter-json.wasm` | 6 | 2 |
| yaml | `@tree-sitter-grammars/tree-sitter-yaml` | 0.7.1 | `tree-sitter-yaml.wasm` | 189 | 34 |
| toml | `@tree-sitter-grammars/tree-sitter-toml` | 0.7.0 | `tree-sitter-toml.wasm` | 24 | 7 |
| svelte | `@tree-sitter-grammars/tree-sitter-svelte` | 1.0.2 | `tree-sitter-svelte.wasm` | 45 | 13 |
| c | `tree-sitter-c` | 0.24.1 | `tree-sitter-c.wasm` | 626 | 72 |
| cpp | `tree-sitter-cpp` | 0.23.4 | `tree-sitter-cpp.wasm` | 3,435 | 274 |
| php | `tree-sitter-php` | 0.24.2 | `tree-sitter-php.wasm` | 1,058 | 105 |
| kotlin | `@tree-sitter-grammars/tree-sitter-kotlin` | 1.1.0 | `tree-sitter-kotlin.wasm` | 3,441 | 294 |

**21 languages through 19 grammar packages, 20 grammar WASM files, and the runtime: 20 packages.** `jsx` is the JavaScript grammar; `tsx` is the TypeScript package's second WASM. In all, the 20 grammar files and the runtime are **23,462 kB raw, about 2,150 kB gzipped** (the sum of the table).

- **The specifiers.** `001` decision 4 gives a caret at the tested version. For a `0.x` package a caret admits patches only, which is right: a grammar's minor may rename node types our queries name. **The two `1.x` grammars, Svelte and Kotlin, take a tilde** (`~1.0.2`, `~1.1.0`), for the same reason: a deliberate exception to `001` decision 4. `bun.lock` pins every exact version either way.
- **Not used, though installed:** `tree-sitter-php_only.wasm` (we parse PHP with its HTML host); YAML's two schema WASM files.
- **What the packages drag in** (EXECUTED (013)): each depends on `node-addon-api` and `node-gyp-build`; `tree-sitter-typescript` pulls its own `tree-sitter-javascript` 0.23 and `tree-sitter-cpp` its own `tree-sitter-c` 0.23, neither loaded; Bun installs the optional peer `tree-sitter` (2.7 MB), never loaded; **the Kotlin grammar lists `npm-check-updates` (5.3 MB) as a runtime dependency**, a packaging slip of that project. The scratch install is **347 MB** on disk (C# alone 65 MB), because grammar packages carry their C sources and native prebuilds.
- **Why Kotlin stays** despite the slip: it is one of the 26 languages `007` serves and has a first-party WASM on npm, the owner's test for "usable". An app that does not want it trims it (decision 5).
- **SQL is not among them.** Its only WASM is a third-party rebuild inside `tree-sitter-wasm` (121 MB unpacked; memo §6.5). Shiki colours SQL with no new dependency. SQL falls back (decision 4).

### 4. The fallback: Shiki, and every failure falls back

**Markdown, diff, SQL, Swift and Dockerfile highlight through Shiki** (`shiki` ^4.5.0). They are the five the memo found without a first-party WASM on npm (§6.2).

- **Shiki keeps all 26 languages in its lazy list.** A language whose tree-sitter row an app removes, or whose tree-sitter path fails, falls back to Shiki instead of going plain. A Shiki language costs nothing until a block names it (`004` decision 6).
- **The Shiki theme is rewritten by role** from Meridian's TextMate column, plus the three rules the workbench proposed and the memo's further fifteen (b2, §4.2) where they still apply under the roles. Every colour in it is `var(--code-<role>)`. The engine stays strict (`forgiving: false`).
- **Resolution, for a language name:** the alias table gives its id; a tree-sitter row whose runtime, grammar and queries load gives tree-sitter; else a Shiki row gives Shiki; else `null` (plain), as today.
- **No failure throws.** Any failure on the tree-sitter path, on the server or in the browser, logs one `console.warn` naming the language and the cause, and that language falls back to Shiki for the life of the page or process: the runtime or a grammar that cannot be resolved (a package pruned from a deployment), fetched (a network error), compiled or instantiated, and a query that fails to compile (a node type the installed grammar lacks). *Why:* an installed app's drift or deployment never blanks its code or fails a request, and the warning says why it looks different. `highlight.test.ts` covers each of the five causes (decision 21).

### 5. Shipping through the registry

Nothing an app installs reaches back to this repository (constitution §4.1). The WASM files are not registry files: shadcn-svelte writes every file it adds as UTF-8 text (memo §6.5, READ), and a binary would arrive corrupted.

**The files of `highlighter`** (29, every one text):

| Repository path (under `src/lib/registry/lib/`) | Target (under `$LIB$/`) | Holds |
|---|---|---|
| `highlighter.ts` | `highlighter.ts` | The public interface (decision 15). Its path does not move, so an app's `$lib/highlighter` import keeps working. |
| `highlight/roles.ts` | `highlight/roles.ts` | The roles, their classes and `tokenClass`. |
| `highlight/languages.ts` | `highlight/languages.ts` | The table of 26: id, aliases, engine, and for the 21 the grammar's loaders and their ordered query files (decision 6). |
| `highlight/tree-sitter.ts` | `highlight/tree-sitter.ts` | Runtime loading, the highlighter of decision 2, sessions, injections, locals. |
| `highlight/shiki.ts` | `highlight/shiki.ts` | The fallback: the theme by role, fences, and a Shiki session. |
| `highlight/queries/*.scm` | `highlight/queries/*.scm` | 21 highlight queries and 3 locals queries (decision 6). |

Each file in `registry.json` carries its `target`, which the CLI resolves against the lib path (READ, the review). Relative imports join the files. The smoke test proves the layout lands (criterion 21).

**The packages are the item's `dependencies`,** not its `devDependencies`. The 20 packages of decision 3 and `shiki`: **21 names**, each pinned in this repository's `package.json` and `bun.lock`. *Why `dependencies`:* the server path reads the grammars from `node_modules` when a `load` runs, and an app that deploys with `bun install --production` (or `npm ci --omit=dev`) keeps only `dependencies`. The CLI installs both fields (READ, the review); the loaders are dynamic imports the CLI cannot detect, so the item declares them either way. `shiki` moves to `dependencies` with them, since its fallback runs on the same path. `code-languages` keeps `devDependencies`: the editor runs only in the browser.

**How the WASM loads in the browser.** Each row of `languages.ts` holds `() => import("tree-sitter-python/tree-sitter-python.wasm?url")`, and the runtime `() => import("web-tree-sitter/web-tree-sitter.wasm?url")`. Vite's `?url` import makes the file an asset of the app's own build. The runtime starts with `Parser.init({ locateFile: () => runtimeUrl })`, so it never guesses its own path, which breaks under Vite's dependency pre-bundling.

- EXECUTED (013), Vite 8.3.5, this repository's pinned version: dynamic `?url` imports of `tree-sitter-json` and `tree-sitter-python` and a static one of the runtime built to one hashed asset per WASM, at the package's exact byte size (5,596; 457,883; 210,688); a `.scm` imported with `?raw` was inlined into a chunk of its own. The grammar packages have no `exports` field, so a deep path resolves; `web-tree-sitter` exports `./web-tree-sitter.wasm` (READ).
- Vite warned about a direct `eval` inside `web-tree-sitter.js` and stubbed its Node imports. Neither fails a build. Decision 23 records what the `eval` means for a Content Security Policy.
- **Every grammar ships in every client build.** A bundler cannot know which language a block will name at run time, so all 20 grammar files and the runtime are emitted for any app that adds `highlighter` (and so `code-block` or `code-editor`): about 23.5 MB raw, 2.15 MB gzipped, in its deploy. **A page fetches only what it shows:** the runtime on the first tree-sitter block, each grammar and its queries on the first block in that language. A page whose blocks all arrive as prerendered `lines` fetches none (criterion 12). The item page states the deploy weight.

**The import graph keeps the engine off pages that do not need it.** `web-tree-sitter`, `shiki`, `node:module` and `node:fs/promises` are imported only by `await import()`, inside the branch that uses them; no file of the item imports any of them statically. *Why:* every page with a block imports the hook, which imports `highlighter.ts`; a static import would make SvelteKit modulepreload the runtime's 155 kB module on every such page, and a static `node:` import would leave a browser stub. Criterion 12 counts `modulepreload` links.

**How the WASM loads at prerender and on a server.** The server branch reads each file from the app's own `node_modules`: `createRequire(import.meta.url).resolve("tree-sitter-python/tree-sitter-python.wasm")`, read into bytes and passed to `Language.load`; the runtime gets `locateFile` with the resolved path of `web-tree-sitter/web-tree-sitter.wasm`. *Why resolve, not `?url`:* on the server a `?url` import is a public URL path, not a file. *Why `createRequire` from `import.meta.url`:* it walks up from wherever the module runs (the source under `vite dev`, a chunk under `.svelte-kit/output/server/` in a build, `build/server/` under `adapter-node`) to the app's `node_modules`, where `dependencies` are present in every supported deployment.

- **Where this holds:** prerender under any adapter (the build runs where the packages are installed), and request-time rendering under `adapter-node` or any server with the app's `node_modules`. A server without them (an edge runtime, or a bundler that traces files and misses a resolved `.wasm`) takes decision 4's fallback: one warning, then Shiki. It never fails the request.
- **Which branch runs.** `import.meta.env.SSR` when Vite defines it, which Vite replaces with a constant so the client drops the server branch. Where it is undefined, as under `bun test`, the branch is the server's when `globalThis.document` is undefined.
- **The queries** load with `?raw` in both branches: Vite inlines the text into a module.
- **`bun test` has no `?url` or `?raw`.** A preload, `tests/helpers/vite-imports.ts`, listed under `[test] preload` in `bunfig.toml`, registers a Bun plugin that loads a `?raw` import as the file's text and resolves a `?url` import to the file's path. Types for both come from `vite/client`, which SvelteKit's `types/index.d.ts` references (READ).

**An app that wants only some languages** deletes their rows from `highlight/languages.ts` and removes their packages (`bun remove tree-sitter-kotlin …`). Those languages then fall back to Shiki, which still holds all 26 at no install cost, and their WASM leaves the deploy. The item page lists each grammar's disk and gzipped cost. Re-adding `highlighter` restores the rows, as re-adding any item restores its source; the page says so. *Why one item, not 19:* the table must name each grammar in a static string for Vite to bundle it, so an uninstalled grammar cannot appear in it; discovering installed grammars needs `import.meta.glob`, which does not run under `bun test`; and nineteen more items would need nineteen more pages (constitution §2.3) for what a table row expresses.

**`meta.stock` goes from `highlighter`.** After this change nothing of shadcn-svelte's stock `highlighter` is left, so the item is ours; the count of `004`'s stock-derived items in `registry.test.ts` goes from 8 to 7. `use-highlighted-code` keeps its `meta.stock`: its signature, result shape and streaming contract are still stock's.

### 6. The queries, written fresh, and how the builder proves it

The queries are this system's own source: plain `.scm` text. **They are written fresh against each grammar's `src/node-types.json`** (READ: shipped in every package's `src/`) and this specification's role map (decision 13). The grammars' own `queries/*.scm` are prior art: they may be read, and never copied (constitution §6). The Landing notes list every stock query file studied, with its package, version and licence.

- **Files (24).** Highlights (21): `javascript`, `jsx`, `typescript`, `typescript-assertion`, `python`, `rust`, `go`, `java`, `c-sharp`, `ruby`, `html`, `css`, `bash`, `json`, `yaml`, `toml`, `svelte`, `c`, `cpp`, `php`, `kotlin`. Locals (3): `ruby.locals`, `javascript.locals`, `typescript.locals`. *Why locals for these three:* a bare Ruby name is a method call unless it was assigned, and the memo's Ruby rose from 80.9% to 86.9% with locals; JavaScript and TypeScript ran with locals in the measured c2. *Why `typescript-assertion`:* `(type_assertion)` compiles against the TypeScript grammar and fails against TSX (the review, EXECUTED), so the one TypeScript-only construct lives in a file TSX does not load.
- **Each language's ordered file list,** in `languages.ts`. Later files win under last-wins.

  | Language | Grammar | Files, in order |
  |---|---|---|
  | javascript | javascript | `javascript`, `javascript.locals` |
  | jsx | javascript | `javascript`, `jsx`, `javascript.locals` |
  | typescript | typescript | `typescript`, `typescript-assertion`, `typescript.locals` |
  | tsx | tsx | `typescript`, `jsx`, `typescript.locals` |
  | ruby | ruby | `ruby`, `ruby.locals` |
  | each of the other 16 | its own | its own file |

  `typescript.scm` is written for the TypeScript grammar's node types, which include JavaScript's; it does not load `javascript.scm`. That gives **27 (file, grammar) pairs**: 9 in the first four rows, 2 for Ruby, 16 for the rest.
- **Capture names are role names.** A capture is one of `@text`, `@comment`, `@keyword`, `@function`, `@type`, `@string`, `@number`, `@constant`, `@meta`, `@special`, `@link`, `@inserted`, `@deleted`, `@changed`; or `@local.scope`, `@local.definition`, `@local.reference` in a locals file. `@text` paints the body on purpose, so a later pattern can return a node to the body. No capture-to-role map exists to drift from the queries.
- **Each file opens with a comment** naming the grammar, the version its `node-types.json` was read at, and "written for the Pluto design system; not derived from the grammar's own queries".
- **The proof, `tests/unit/queries.test.ts`:**
  1. Every one of the 27 (file, grammar) pairs compiles (`new Query(language, text)` throws on an unknown node type or field).
  2. Every capture name is in the list above, and every predicate is one the engine implements (decision 2).
  3. **No copied run.** Each of our files and each `queries/*.scm` file in every installed grammar package (and the nested copies of decision 3) is normalised: comments removed, whitespace collapsed, every capture name replaced by `@_`. No run of 6 or more consecutive normalised lines of ours appears in any stock file.
  4. **No copied pattern beyond the trivial.** Split into top-level patterns, at most 15% of our patterns equal a stock pattern after normalisation, and every one that does is *trivial*: one node, one capture, at most a single `#eq?` or `#any-of?` with a word list a grammar fixes (`(comment) @_`, `["if" "else"] @_`). *Why allow those:* they state a fact of the grammar, not anyone's expression of it.
  5. The counts (our patterns per file, matches found by rules 3 and 4) are printed, and the Landing notes record them.
  6. **From checkpoint 1 on,** every query file's SHA-256 equals `tests/fixtures/highlight/query-lock.json`'s, or the lock lists the change with its reason and both sets' figures (decision 19).

  The check cannot see other projects' queries (Neovim's, Helix's, Zed's), which are not installed; the writing rule above, and the review, cover them. The literal lint reads `.scm` item files with its text rules and finds no colour: a query holds roles.

### 7. The roles

Meridian's seven coloured roles, comment and text are adopted (`decisions.md`, "Code takes Meridian's roles"). **`number` is a role of its own,** at the owner's word ("can we create a number role?"). Three things the guide does not cover keep roles of their own. Every role is a text role except the two grounds, which are `014`'s.

| Role | What it colours (decision 13 has the full map) | Style |
|---|---|---|
| `text` | Variables, parameters, fields and member access, object-literal keys, modules and namespaces, operators, punctuation | none (no class) |
| `comment` | Comments and their markers, shebangs | upright, colour alone |
| `keyword` | Control flow, declarations, modifiers, word operators, `self`/`this`/`super`, HTML tag names, CSS property names and at-rules, Markdown marks | |
| `function` | Function and method definitions and calls, built-in functions, JSON keys | |
| `type` | Classes, structs, enums, interfaces, traits, generics, built-in types, constructor calls, CSS selectors | |
| `string` | String and character literals, include paths, docstrings | |
| `number` | Numeric literals, whole: prefixes, suffixes, separators, exponents, and a unit attached to the number (`px`, `%`, `rem`); CSS colour literals; TOML date-times | |
| `constant` | Booleans, `null`/`None`/`nil`, ALL_CAPS names, enum members, Ruby symbols, CSS keyword values | |
| `meta` | Decorators, annotations, attributes, macros, preprocessor directives, lifetimes, HTML attributes, CSS pseudo-classes and custom properties, shell variables | |
| `special` | Escapes, regular expressions, interpolation delimiters, HTML entities, HTML's bare `<` | |
| `link` | Markdown links and URLs | underlined; colour of `function` |
| `inserted`, `deleted`, `changed` | A diff's added, removed and changed lines | colours of `string`, `special`, `function` |
| `background` | The code ground: `syntax-ground`, as `014` ships it | |
| `active-line` | The editor's active line and the block's emphasised line: `syntax-active-line`, as `014` ships it | |

**Sixteen entries in the `code` map** (from twenty-one): fourteen text roles and two grounds.

- **Properties follow Meridian's split,** by the owner's ruling on this specification's review: fields and member access are `text`; JSON keys are `function`; HTML attributes are `meta`; CSS property names are `keyword` (`decisions.md`, "A public design site, the workbench dropped, and properties under Meridian"). It supersedes the earlier "properties in the body colour" wherever they differ.
- **No bold, no italic.** The owner: "no italized comment either". Every token is regular weight and upright; comments recede by colour alone. **This departs from Meridian's guide,** whose one styled role is italic comments. It also removes `007`'s bold: `font-medium` on a function definition and on a Markdown heading goes from the highlighter's output. `001` installs only the upright JetBrains Mono, so an italic would have been synthesised anyway (`004` decision 6).
- **Why CSS keyword values are `constant`, not `text`.** Today's theme leaves `flex` and `bold` in the body (`007` decision 5). Meridian names "CSS values" among its constants, and a keyword value is what the role holds elsewhere: a fixed word the language defines, like `true` or `None`. Its number neighbour (`0.75rem`) stays `number`, so `font: bold 0.75rem` shows a word and a figure in two colours, as `True` and `3` do in Python.
- **Why `link` keeps a role, underlined.** This is the design lead's call; no owner ruling covers it (an earlier draft wrongly cited one). A link is the one token whose meaning is "this goes somewhere"; the underline says so without a second colour, and it is the one non-colour signal a link has (§4.4: colour is never the only signal). A role of its own keeps the underline on links alone. It takes `function`'s colour: Meridian chose blue for functions because "blue is the colour of links and actions". The underline is the only style in the palette, against Meridian's rule that comments are the only styled role; with comments upright, links take that one place.
- **Why three diff roles.** A diff is a language where colour *is* the meaning of a whole line. Keeping `inserted`, `deleted` and `changed` as roles lets the diff be retuned without moving strings or specials. They take green, red and blue. **Red is rare** holds everywhere but a diff's removed lines, where red means what Meridian reserves it for, "look closer".
- **`invalid` is not a role.** The `invalid` slot and its class go. Only HTML's bare `<` takes `special` (decision 13, and the review's finding 3).
- **The body is Tombaugh's ink**, `text` (decision 11), not the page's `foreground`. Every surface that draws code reads it: `code-block`'s default variant becomes `text-code-text`, and `codeTheme`'s `color` and `caretColor` become `var(--code-text)` (decisions 15 and 16).

### 8. The palette: Tombaugh, with numbers yellow and constants orange

**The owner:** "tombaugh, but swap the colors for constants and numbers, numbers should be yellow" (`decisions.md`, "Tombaugh, a number role, the white ground first, and docstrings as strings"), and then a yellower yellow with more contrast on white and dark (`decisions.md`, "A yellower yellow, in code and in the brand"). The brand's own yellow, which the same entry also moves, is `pluto-theme`'s primitives and not this specification's. Tombaugh is the one palette shipped. **Meridian is a cited source,** the guide whose roles, rules and lightness plan Tombaugh keeps; it is not a shipped option.

**What Tombaugh is** (candidate `tombaugh`; its swatches are the source of decision 11's values):

- Meridian's roles and lightness plan, with blue (function), green (string) and red (special) taking the Pluto mark colour's hue and moving halfway to its chroma.
- Tuned for contrast at the owner's word: one lightness shift per mode, light 0.03 darker and dark 0.02 lighter, and comments raised to AA.
- **Numbers yellow** (`tombaugh-yellow`, `#6C5A00` light and `#E5CD72` dark, OKLCH hue 95; the dark softened by the owner from `#F1CA00` so it sits with Tombaugh's other dark colours), **constants Pluto's orange** (`tombaugh-orange`, hue 48). In light mode a dark yellow reads golden; the owner's entry names that as the cost of contrast on white.

**Known trade-offs** (EXECUTED (013), and reproduced by the review: `deltaE`, and the Machado 2009 matrices the workbench used for its colour-vision views):

- **Dark function and type are ΔE 5.2 apart; dark function and keyword 7.1.** Meridian lifts navy to the other hues' lightness in dark by design, and the move toward the brand blue brings function nearer both. Meridian's own figures are 5.7 and 9.7.
- **Dark constant and special are ΔE 6.8 apart** (orange at 48°, red at 22°, one lightness).
- **Numbers and constants are no longer a near pair for typical vision:** ΔE 10.8 light and 11.0 dark (were 7.8 and 8.5). **Re-measured under full colour-vision deficiency** (EXECUTED, `#6C5A00` and `#E5CD72`): under deuteranopia 5.4 light and 5.1 dark (were 0.5 and 4.0), so the deuteranopia limit is gone; **under protanopia, 0.5 light** (was 3.8) and 9.5 dark. For a reader with protanopia, light-mode yellow and orange are one colour now. **A known limit, accepted:** numbers are digits and constants are words (`3`, `0x2A` against `True`, `None`, `MAX_LINES`), so shape tells them apart, as the owner's ruling says, and §4.4's "colour is never the only signal" is met by that shape. The item page says so.
- **Other pairs under full deficiency,** which the new yellow does not touch and which were there before: light constant and special at ΔE 2.0 under deuteranopia; dark function and keyword at 2.5 (deuteranopia) and 0.8 (protanopia). Each pair differs in shape too (a word against a literal; a call against a keyword's position). Recorded, not gated.
- **The dark yellow sits with the others by chroma, not by lightness.** Softened to `#E5CD72`, its chroma is 0.115, inside the other dark roles' 0.07 to 0.14 (it was 0.174). Its OKLCH lightness is 0.850, still above the others' 0.757 to 0.798 (it was 0.847), and it reads 9.28 on the dark ground, the only dark role above 8. The owner chose it for contrast; it stays inside Meridian's 6.5 to 9.5 range on the ground, so the plan's limit holds even where its evenness does not.

**The guard.** At checkpoint 1 (decision 22) the design lead reads, at 13.5 px in both themes, the dark function beside the dark keyword and type on the gallery's TypeScript, Python and Rust; the dark constant beside the dark special; numbers beside constants under a protanopia simulation; and the dark yellow beside the other dark roles, for glare. If one cannot be told apart where it matters, the design lead brings it to the owner with a measured proposal. Nothing changes without the owner's word: the palette is the owner's.

### 9. The light ground is white, from `014`, which lands first

The owner ruled that the white light ground lands first (`decisions.md`), and that `014` and 013 ship as one release, 0.12.0, with `014` built and change-reviewed first. **013 is built on `014` as landed.**

`014` (landed) adds two code-only theme roles and points the map's grounds at them: `syntax-ground` (light `raised`, `#FFFFFF`; dark `ink-wash`, `#2C2821`) and `syntax-active-line` (light `paper`, `#F3F0E8`; dark `ink-raised`, `#221F19`). It edges every block and editor with the hairline, gives the editor's root `bg-code-background` in place of `bg-muted`, withdraws the `class="bg-muted"` escape, and adds `scrollbar-code` (`014` decisions 1, 4, 5, 7).

- **Every light colour is gated on `014`'s grounds,** read from the token file: the code ground (white: lowest comment 5.53, then constant 5.78; number 6.77) and the active line (`#F3F0E8`: lowest comment 4.86, then constant 5.08; number 5.94) (EXECUTED (013); `014` decision 14 measured the same).
- **The requirement, if `014` changes before it lands:** every 013 colour, comments included, reaches 4.5:1 on the light code ground and active line `014` ships. The contrast test reads both from the token file, so whatever lands is measured. If a role falls under 4.5 there, 013 does not land until the two specifications agree a change, and the owner hears of it.
- **No code text sits on light `muted`.** On `wash` Tombaugh's comment reads 4.40 and its number 4.41 (EXECUTED). `014` removes the two places code met it (the editor's root, the `bg-muted` escape). 013 holds the line with two checks: a unit check that neither `code-block`'s nor `code-editor`'s files hold `bg-muted`, and an e2e reading of the prerendered editor root's background with scripts off, which must equal the code ground (criterion 13).
- **Dark keeps its ground**, `#2C2821`, and its active line, `#221F19`. The page canvas never changes.
- **The figures both specifications use:** 14 text roles; 10 `syntax-*` colour roles beside `014`'s 2 grounds; 70 AA rows on `014`'s grounds (28 light on two grounds, 42 dark on three); 60 theme names per theme. Light code never sits on the page canvas, so the light page is not a third light ground. `014` decision 14 carries the same figures.

### 10. Comments recede by colour, at AA

Meridian sets comments "at about 4:1, deliberately below the token colors", within 3.8 to 6:1. The owner's tuning of Tombaugh **raised comments to AA**, which the constitution's §4.4 requires of text and axe checks on every page. So comments are at 4.5:1 or more on every code ground: light `#636972`, 5.53 on white and 4.86 on the active line; dark `#9EA4AE`, 5.84 on `#2C2821`.

They still recede: they are grey (chroma 0.016) among eight hues; in dark every coloured role is 6.5 or more against the comment's 5.84; in light the comment sits at the bottom of the band, under constant. **Meridian's 3.8 floor is not used, and neither is its 6:1 ceiling:** the dark comment reads 6.55 on the active line and 7.33 inside an ink surface on `graphite` (EXECUTED), still below every coloured role on those grounds. The contrast test prints those two rows.

### 11. The values

**The one-lightness plan.** Each mode shares one lightness band for the coloured roles: light OKLCH lightness 0.471 to 0.521, navy 0.371 as Meridian's designed outlier; dark 0.757 to 0.798, navy lifted to the band, and the owner's yellow at 0.850 above it (decision 8) (EXECUTED (013)). Hue and chroma carry the difference between roles.

**Dark, on `#2C2821`.** Meridian's dark range is 6.5 to 9.5:1. Tombaugh meets it whole: lowest special 6.50, exactly at the floor; highest number **9.28**, under the 9.5 limit by 0.22. Off the ground the yellow runs higher: **10.41 on the dark active line** and **11.66 on `graphite`**, the ground inside an ink surface on a light page (`007` decision 8); constant reads 9.41 on `graphite`. Accepted, as the earlier 9.68 was, but no longer "just over": the range guards the ground a block normally sits on, and above 9.5 the risk is glare, not legibility. The owner chose this yellow for contrast on dark; checkpoint 1 reads it for glare on the active line and in the ink surface (decision 8's guard). The contrast test records both as named rows.

**The values** (from the `tombaugh` swatches; EXECUTED (013), reproduced by the review; ratio on light `syntax-ground` / `syntax-active-line`, then dark `syntax-ground` / `syntax-active-line` / `graphite`):

| Role | Swatch | Light | On ground / line | Dark | On ground / line / `graphite` |
|---|---|---|---|---|---|
| `keyword` | `tombaugh-keyword` | `#7032B9` | 7.37 / 6.47 | `#C4A4FE` | 7.04 / 7.89 / 8.84 |
| `function`, `link`, `changed` | `tombaugh-function` | `#3350CB` | 6.66 / 5.85 | `#91AEFD` | 6.75 / 7.57 / 8.48 |
| `type` | `tombaugh-type` | `#243B7A` | 10.59 / 9.30 | `#A8C0D8` (was `#9FB1DD`) | 7.81 / 8.76 / 9.81 (was 6.84 / 7.67 / 8.59) |
| `string`, `inserted` | `tombaugh-string` | `#007150` | 6.03 / 5.30 | `#5CC89A` | 7.10 / 7.96 / 8.92 |
| `number` | `tombaugh-yellow` | `#6C5A00` | 6.77 / 5.94 | `#E5CD72` | 9.28 / **10.41** / **11.66** |
| `constant` | `tombaugh-orange` | `#A34D15` | 5.78 / 5.08 | `#FFA373` | 7.49 / 8.40 / 9.41 |
| `meta` | `tombaugh-meta` | `#922F6E` | 7.35 / 6.46 | `#EB9BC8` | 7.01 / 7.86 / 8.81 |
| `special`, `deleted` | `tombaugh-special` | `#B81C2E` | 6.47 / 5.68 | `#FC8D8A` | 6.50 / 7.28 / 8.16 |
| `comment` | `tombaugh-comment` | `#636972` | 5.53 / 4.86 | `#9EA4AE` | 5.84 / 6.55 / 7.33 |
| `text` | `tombaugh-text` | `#25292F` | 14.61 / 12.83 | `#D9DFE8` | 10.93 / 12.26 / 13.73 |

These are measured values to start from; the contrast test (criterion 3) is the proof, computed from the token file.

**Amended 2026-11-15, after `017`:** dark `type` moves from `#9FB1DD` to `#A8C0D8`, at the owner's word (`decisions.md`, "Dark type is `#A8C0D8`, and the site's temporary address"). It now stands ΔE 8.8 from dark `function` (was 5.2), 10.9 from `keyword`, 10.8 from `text` and 8.5 from `comment`, and measures 7.81:1 on the dark ground, inside 6.5 to 9.5. Light `type` is unchanged.

### 12. The tokens

All counts here are **deltas over `014`'s landed token file**. The absolute figures below are derived from `014` as drafted (55 theme roles, 35 primitives, 21 map entries) and the current file; build step 1 re-derives them from the file `014` lands and writes them into the Landing notes.

**Primitives: +20, −9.** One pair per Tombaugh colour, `code-<hue>` (light) and `code-<hue>-lifted` (dark): `violet`, `blue`, `navy`, `green`, `yellow`, `orange`, `plum`, `red`, `grey`, `ink`. *Why a `code-` prefix:* `blue-lifted`, `green-lifted`, `red-lifted`, `red-text`, `green-text` and `orange-text` are, or were, the brand's and `007`'s; code's colours are their own. No Tombaugh value equals an existing primitive (READ). Removed: `amber-text`, `orange-text`, `orange-lifted`, `purple-text`, `purple-lifted`, `teal-text`, `teal-lifted`, `cyan-text`, `cyan-lifted`, each named only by a `syntax-*` role (the review, EXECUTED). **35 → 46.**

**Theme roles: +9, −4.** `syntax-amber`, `syntax-purple`, `syntax-teal` and `syntax-cyan` go. `syntax-orange` keeps its name and points at `code-orange` / `code-orange-lifted`. Nine are added: `syntax-violet`, `syntax-blue`, `syntax-navy`, `syntax-green`, `syntax-yellow`, `syntax-plum`, `syntax-red`, `syntax-grey`, `syntax-ink`. With `014`'s `syntax-ground` and `syntax-active-line`, a theme holds **twelve `syntax-*` roles**; **55 → 60 names per theme.** `004` decision 5's rule holds: every `code` value names a theme role.

**The `code` map, sixteen entries, in this order:** `text: syntax-ink`, `comment: syntax-grey`, `keyword: syntax-violet`, `function: syntax-blue`, `type: syntax-navy`, `string: syntax-green`, `number: syntax-yellow`, `constant: syntax-orange`, `meta: syntax-plum`, `special: syntax-red`, `link: syntax-blue`, `inserted: syntax-green`, `deleted: syntax-red`, `changed: syntax-blue`, `background: syntax-ground`, `active-line: syntax-active-line`. The last two are `014`'s, unchanged here.

**Emission** (`007` decision 4's rules): `cssVars.light` and `cssVars.dark` each carry 16 `--code-<role>: var(--<theme role>)`; `cssVars.theme` carries 16 `--color-code-<role>`. The `.surface-ink` rules are unchanged. An app's `@theme inline` gets 16 by-product lines from the CLI's updater (`004` decision 5).

**Classes.** `roleClasses` holds thirteen literal classes, every text role but `text`: `text-code-comment`, `text-code-keyword`, `text-code-function`, `text-code-type`, `text-code-string`, `text-code-number`, `text-code-constant`, `text-code-meta`, `text-code-special`, `text-code-link`, `text-code-inserted`, `text-code-deleted`, `text-code-changed`. `link`'s class list also holds `underline`. A body token carries no class; its colour comes from the surface, which reads `text-code-text` (decision 7).

**The lint, L19,** keeps its rule, with the one pattern `014` decision 9 writes out for 0.12.0, adopted here as written:

```ts
const SYNTAX_COLOUR =
  /syntax-(?:orange|amber|purple|teal|cyan|violet|blue|navy|green|yellow|plum|red|grey|ink|ground|active-line)\b/g;
```

It keeps the four names 013 removes (`amber`, `purple`, `teal`, `cyan`), so a stale one left in an item is still caught; it holds 013's nine new colours, `orange`, and `014`'s two grounds; the trailing `\b` stops `syntax-redo` from matching. 013 does not narrow it. Its samples move to the new names: the same 3 bad and 1 good of `007`, beside `014`'s 3.

**Contrast rows,** in `contrast.test.ts`, computed from the token file, on `014`'s grounds (light: `syntax-ground`, `syntax-active-line`; dark: `syntax-ground`, `syntax-active-line`, `background`):

- **AA rows:** 14 text roles × 5 grounds: **70 rows at 4.5 or more**, comments included. Light: 28; dark: 42. They replace `014`'s 95 code-slot rows.
- **Meridian's range rows:** the 8 coloured roles and the 4 that share their colours (`link`, `inserted`, `deleted`, `changed`) on the dark `syntax-ground`: **12 rows between 6.5 and 9.5**. On light `syntax-ground` and `syntax-active-line`: **24 rows at 15 or less.**
- **Named rows:** the dark `number` on the dark active line (10.41) and on `graphite` (11.66); the dark `comment` on `syntax-active-line` (6.55) and on `graphite` (7.33), printed against Meridian's 6:1 ceiling.
- **Distinctness:** no two of the eight coloured roles under ΔE 5.0 in either theme, and the dark `function`–`keyword` pair at ΔE 7.0 or more. They sit under the measured 5.2 and 7.1 by a margin, so the test guards against a later edit collapsing a pair, not against the owner's choice. The number–constant figures under deuteranopia and protanopia are printed, not gated (decision 8). The yellow is ΔE 11.0 from the constant in dark and 10.8 in light; light's closest pair is now constant and special, 9.2.

### 13. The capture → role map

The map follows Meridian's role-mapping table, the owner's rulings where Meridian is silent, and the owner's split of properties. **Where Meridian and the accuracy memo's labelling guide differ, Meridian wins,** because the owner adopted its organisation whole; the conflicts are listed after the tables. Our queries implement every row. The converted reference (decision 19) is labelled by the same rows, **except the rows marked "known loss"**: there syntax cannot see what the code is, the query does its best, and the reference keeps its label.

**Every language.**

| Construct | Role |
|---|---|
| Variables, parameters, keyword arguments (`frozen=True`), fields declared or read, member access (`frame.seq`, `self.name`), object-literal and hash keys, operators, punctuation, brackets | `text` |
| Modules, packages and namespaces, in imports and as qualifiers (`fmt.`, `std::collections::`, `java.util.`, `asyncio.`, `System.Text.`) | `text`; only the type at the end of a path (`HashMap`) is `type` |
| Keywords, storage words, modifiers, word operators (`and`, `in`, `is`, `not`, `new`, `typeof`, `instanceof`) | `keyword` |
| `self`, `cls`, `this`, `super` (a TypeScript `this:` parameter included) | `keyword` |
| Function and method definitions and calls, a method passed as a value (`Body.parse`), getters and setters at their definition | `function` |
| Built-in functions (`print`, `len`, `range`, `parseInt`, `setInterval`, Go's `make`, SQL's `COUNT`, CSS's `var()` and `calc()`, Svelte's `$state`, Ruby's `puts` and `attr_reader`, shell builtins and commands) | `function` |
| Classes, structs, enums, interfaces, traits, type parameters, built-in types, names in type positions (annotations, return types, generic arguments, `extends`, `implements`, casts, `typeof`) | `type` |
| Constructor calls: the class in `new X()`; a capitalised callee where the language's convention makes capitals a type (below) | `type` |
| String and character literals, with their quotes and prefixes (`r"`, `f"`, `$"`, backticks); include paths (`<stdio.h>`) | `string` |
| A docstring, quotes included | `string` |
| Numbers, whole: prefix, suffix, separators, exponent, sign where the grammar includes it, a unit attached to the number (`0x2A`, `3j`, `2_500`, `30_000L`, `0.75rem`, `4%`, `16px`) | `number` |
| `true`, `false`, `null`, `None`, `nil`, `undefined`, `iota`, `...` | `constant` |
| An identifier matching `^[A-Z][A-Z0-9_]+$` **in a reference or assignment position** (`MAX_LINES`, `x = DEBUG`) | `constant`. Never a definition (`class API:`, `def API():`), a type position or a callee (`API()`), which keep their own role. The pattern is placed after the general identifier patterns and names those positions, so last-wins cannot reach a definition. |
| Enum members and variants | `constant` |
| Decorators and annotations, marker and name (`@dataclass`, `@Override`); Rust attributes' `#` and name; C#'s attribute name; their brackets are `text`, their arguments are labelled as code | `meta` |
| Macros where the grammar marks one (`println!`, `write!`; C's name at its `#define`), preprocessor directives (`#include`, `#if`), Rust lifetimes (`'a`) | `meta` |
| Escape sequences; interpolation delimiters (`${` `}`, Python's and C#'s braces with their format specs `:<8`, `!r`, Ruby's `#{` `}`, the shell's `$(` `)` and `$((` `))`); HTML entities | `special` |
| Regular-expression literals, whole | `special` |
| Comments, with their markers; doc comments; shebangs; C#'s XML doc tags inside a doc comment | `comment` |
| **An `ERROR` node** (text the grammar cannot parse) | **no role of its own.** Its children keep theirs; text no child claims is `text`. |

*Why `ERROR` paints nothing* (the review's finding 3): code in the editor is incomplete between keystrokes, and a streamed reply until its last chunk. A role on `ERROR` would turn `def parse(` or `const x = {` red until it closed, on the two live paths the owner asked tree-sitter for, against "red is rare … never marks anything you see on every line". The reference holds one invalid character in 16,284 (HTML's bare `<`), which takes its own row below.

**Language cases.**

| Language | Construct | Role |
|---|---|---|
| JSON | Keys, with their quotes | `function` |
| YAML, TOML | Keys | `text` (Meridian's `@property` rule gives `function` to JSON alone) |
| YAML | Plain scalars | `string`; a number is `number`, a boolean or `null` `constant` |
| YAML | Anchors and aliases with `&` and `*`; the merge key `<<` | `meta`; `keyword` |
| TOML | Table names (`[server]`, `[[bin]]`) with their brackets | `type`; date-times are `number` |
| CSS | Property names (`color`), media features | `keyword` |
| CSS | At-rules (`@media`, `@keyframes`) | `keyword` |
| CSS | Element, class and id selectors with their `.` and `#`; keyframe selectors `from` and `to` | `type` |
| CSS | Pseudo-classes and pseudo-elements with their colons (`:hover`, `::before`) | `meta` |
| CSS | Custom properties (`--board-gap`), also inside `var()` | `meta` |
| CSS | Keyword values (`flex`, `bold`, `auto`) | `constant` (decision 7) |
| CSS | Numbers with their units (`0.75rem`, `4%`), colour literals (`#c4581b`) | `number` |
| HTML, Svelte, JSX | Element tag names; the angle brackets | `keyword`; `text` |
| HTML, Svelte, JSX | Components (a capitalised tag: `<Button>`) | `type` |
| HTML, Svelte, JSX | Attribute names; attribute values | `meta`; `string` |
| HTML | `<!DOCTYPE html>` | `meta` |
| HTML | A bare `<` the grammar parses as an error (`(ERROR "<")` or the grammar's equivalent) | `special`, the one error case |
| Svelte, JSX | Expression braces `{` `}`; Svelte's block marks `{#if}`, `{:else}`, `{/if}` | `text`; the `#if`, `:else`, `/if` words `keyword` |
| Svelte | Runes (`$state`, `$props`, `$derived`) | `function` |
| Shell | A command's name (`curl`, `pip`) and builtins (`set`, `echo`, `cd`, `exit`) | `function` |
| Shell | A command's bare arguments and flags (`install plutosystems`, `--upgrade`), case patterns, loop words; a bare `0` in `exit 0` | `text` (the owner's ruling) |
| Shell | Quoted strings and heredocs | `string` |
| Shell | Parameter expansions, whole (`$HOME`, `${#failed[@]}`, `$?`, `$1`) | `meta` |
| Shell | An assignment's name (`DEST=`) | `text` |
| Python | `str`, `int`, `float`, `bool`, `bytes`, `bytearray`, `complex`, `dict`, `list`, `set`, `frozenset`, `tuple`, `object`, `type`, `memoryview`, wherever they stand, a call included (`float(x)`, `default_factory=tuple`) | `type` (Meridian: built-in types, constructor calls) |
| Python | Every other name in the 3.13 built-in functions table (`print`, `len`, `range`, `enumerate`, `zip`, `sorted`, `isinstance`) | `function`; `super` is `keyword` |
| Python | A capitalised callee (`Body(...)`, `Release(...)`) | `type` (PEP 8 names classes in CapWords) |
| JavaScript, TypeScript | A capitalised callee without `new` (`Number(x)`, `Error("x")`) | `type` |
| JavaScript, TypeScript | Global objects that are not classes (`console`, `Math`, `JSON`, `document`, `window`) | `text`, as namespaces; their methods `function` |
| JavaScript, TypeScript | A lowercase `const` binding | `text` (Meridian: "don't color every const declaration yellow") |
| Java, Kotlin | A capitalised receiver or callee (`Kind.DWARF`'s `Kind`, `String.join`'s `String`, `Release(...)` in Kotlin) | `type` (methods are lowerCamel by convention) |
| Rust | `Some`, `None`, `Ok`, `Err` (a word list); the last segment of `Type::Variant` when both segments are capitalised | `constant` |
| Rust | Other capitalised callees (`Point(1, 2)`); `Self` | `type` |
| Ruby | Symbols (`:ok`), with the colon | `constant` |
| Ruby | A capitalised constant that names a class or module (`Ledger.new`, `Float()`) | `type` |
| Ruby | A bare name resolved by locals as a local variable; any other bare name | `text`; `function` (a method call) |
| Go | Every call, capitalised or not | `function`. **Known loss:** a type conversion (`Celsius(x)`) is a `type` to a language server; the query reads a call; the reference keeps `type`. |
| Go | Composite-literal types (`Release{...}`), `new(T)` and `make([]T, n)` arguments, type positions | `type` |
| C# | Every invocation (`Start()`, `WriteLine()`) | `function` |
| C# | The type in `new X()` and target-typed `new()`, type positions, base lists, generic arguments, `typeof` | `type` |
| C# | A class used as a static receiver (`Console.` in `Console.WriteLine`, `Math.` in `Math.Max`) | `type`. **Known loss:** syntax cannot tell a class from a namespace in a member access, so the query reads `text`; the reference keeps `type`. A namespace qualifier (`System.Text.`) is `text` by the modules row, a ruling. |
| C, C++ | A function-like macro call (`MAX(a, b)`) | `function`: the grammar parses it as a call and does not mark a macro; the ALL_CAPS rule never reaches a callee. The name at its `#define` is `meta`. |
| PHP | `$variables` | `text`; `$this` is `keyword` |

**Go and C# without semantic tokens.** Meridian says these two need a language server to tell a call from a constructor, because their methods are capitalised too. We use syntax alone, and never capitalisation, in both. C# loses almost nothing for calls (a constructor is always `new X(…)` or `new(…)`); it loses the static receiver. Go loses type conversions. *Why not capitalisation:* it would colour every exported Go function and every C# method as a type, a wrong answer on most lines. The two losses are counted against the queries, not hidden by the reference.

**Where Meridian, or the owner, overrules the memo's labelling guide** (each a deliberate change of label, carried into decision 19's conversion):

1. Properties: the guide's `property` slot. Fields, member access and keys outside JSON become `text`; JSON keys `function`; HTML attributes `meta`; CSS property names `keyword`; CSS custom properties, shell expansions and YAML anchors `meta` (Meridian's map, and the owner's split).
2. Built-ins: the guide's `builtin` slot. Built-in functions `function`, built-in types `type`, global objects `text`.
3. Tags: the guide's `tag` slot. HTML tag names `keyword`, CSS selectors `type` (pseudo-classes `meta`), components `type`. TOML tables follow CSS selectors to `type`, a call of ours: Meridian is silent, and a table header names a structure.
4. `self`: the guide's `self` slot becomes `keyword`.
5. Decorators and marked macros: `meta`. The guide called a macro a `function`.
6. Escapes: `special`, and **regular expressions move from `string` to `special`** (the guide's rule 15 is overruled). JSX and Svelte braces, which the guide counted as interpolation marks, become `text`: they are not inside a string, and on every line of a Svelte file they would make red common.
7. Numbers keep a role of their own, `number`, by the owner's word; units attached to a number join it, as the guide had them. CSS keyword values become `constant`, which the guide left in the body.
8. Namespaces and module qualifiers move from `type` to `text` ("modules stay plain"). A class used as a receiver stays `type`.
9. Constants: lowercase real constants (Go `const maxLines`, a lowercase Java `static final`) move to `text`; only ALL_CAPS names, enum members and language constants are `constant`.
10. A doctype moves from `keyword` to `meta`. Invalid text other than HTML's bare `<` has no role (the reference holds none).

**Where the owner's earlier rulings and Meridian meet.** None conflict. Bare shell arguments and flags stay in the body; the `number` role covers a whole literal; a docstring is a string, which the owner confirmed ("as GitHub and VS Code colour it").

### 14. Embedded languages

Injections are a table in `highlight/tree-sitter.ts`, not a query file. *Why code:* choosing the language needs a little logic (an attribute's value), and the table is ours, written fresh.

| Host | Region | Language |
|---|---|---|
| HTML | `<script>` contents | `typescript` when `lang="ts"`; else `javascript` |
| HTML | `<style>` contents | `css` |
| Svelte | `<script>` contents | `typescript` when `lang="ts"`, else `javascript` |
| Svelte | `<style>` contents | `css` (the memo found Svelte's stock rules sent it to JavaScript; §6.3) |
| Svelte | An expression in `{…}`, an attribute value in braces, a block's condition (`{#if a}`), an `{#each}`'s list and its key (`(item.id)`) | the script's language, as an **expression** |
| Svelte | An `{#each}`'s item and index (`as item, i`), `{:then value}`, `{:catch error}`, the binding after `then` or `catch` in an `{#await}` head, `{#snippet name(a, b)}`'s parameters | the script's language, as a **binding pattern**: parsed as the pattern of `let <text> = 0`, and only the pattern's ranges are painted |
| PHP | Text outside `<?php … ?>` | `html` |
| Rust | A macro's token tree (`println!("{}", x)`) | `rust`, re-parsed as an expression list where it parses; else left to the host |
| Markdown (Shiki) | A fenced block | the fence's language (below) |

*Why binding patterns apart* (the review's finding 21): parsed as one expression, `item (item.id)` is a call and `item` turns `function`.

**How Svelte 1.0.2's raw text is split** (the review's finding 35, EXECUTED there): the grammar does not separate an each's key, or `then`, from the text around it.

- **An `{#each}`:** the grammar gives two raw texts, the list (`"items "`) and the parameter (`"item, i (item.id)"`), key included. In the parameter, a trailing balanced `( … )` is the key, injected as an expression; the text before it is the binding pattern.
- **An `{#await}` head** is one raw text (`"p then value"`). It is split at the first `then` or `catch` that stands as a word outside brackets and strings: the left part is an expression, the word is `keyword`, the right part a binding pattern. A head with neither word is all expression.
- **A snippet's parameters** (`"a, b"`) are one binding pattern.

A split that fails (unbalanced brackets in a half-typed head) leaves the raw text `text` until it parses, never red.

**Markdown fences.** Markdown is Shiki's; its fenced blocks are not. The Shiki session finds fences with `chat-text.svelte`'s rule exactly: an opener is a line of exactly three backticks followed by any info, empty included (`^```([^`]*)$`); the info's first word is the language; a closer is a bare fence; an unclosed fence runs to the end. It replaces those lines with the fence language's highlighting. The fence lines themselves are `keyword`. A fence with no language, or one the table does not know, is `string`, as inline code is. *Why chat-text's rule:* the chat pane splits fences by it, so a fence the chat shows as a block is the fence the highlighter colours.

**Injected grammars load asynchronously, and colour converges** (the review's finding 2). A host's injections can name any grammar, and Markdown's fences any of the 26.

- **`highlightCode`** parses, collects every language its injections and fences need, awaits each one's load, and only then highlights. A prerendered block is complete.
- **A session** paints what it can at once, starts loading every injected or fenced language its text needs, and **fires `onChange` when one arrives**, after which its `lines()` and `ranges()` include it. `session.settled` is `true` when nothing is loading. The hook and the editor's plugin repaint on `onChange`. A fence typed later starts its own load and repaints the same way.
- **`code-block` says when it has settled:** `CodeBlockContent` sets `data-highlight="pending"` while its session loads anything, and `"settled"` whenever nothing is loading: once its session has nothing left to load, and always for prerendered `lines`, plain `code` with no `language`, and `children`. The agreement tests wait for `"settled"`, so they compare the final colours, not the first paint.
- *Why not make `loadHighlighter` wait for every grammar a host could inject:* an HTML block would load TypeScript (133 kB) in case a script said `lang="ts"`. Loading what the text names costs only what it needs.

**Each injected language is one more grammar to load:** an HTML block loads JavaScript and CSS, a Svelte block TypeScript and CSS. The item page says so.

**Not injected:** regular expressions (the whole literal is `special`), JSDoc (the comment is `comment`), GitHub Actions' `${{ }}` in YAML (it stays in the string), tagged templates (`sql\`…\``, `html\`…\``; they stay strings), and the language inside a diff (a diff's context lines are the body, guide rule 20).

### 15. The interface

**`highlighter.ts` exports:**

| Export | 0.11.0 | 0.12.0 |
|---|---|---|
| `highlightCode(code, language)` | `Promise<HighlightedLine[] \| null>` | **unchanged** signature and `null` for an unknown language. It now awaits every injected and fenced grammar the text needs (decision 14). |
| `HighlightedLine`, `HighlightedToken` | `string \| { content, class }[]` | **unchanged**. `class` holds role classes. |
| `loadHighlighter(language)` | `Promise<{ highlight(code, state?) → { lines, state } } \| null>` | `Promise<Highlighter \| null>`. **Changed:** `Highlighter` is `{ id, engine: "tree-sitter" \| "shiki", highlight(code): Promise<HighlightedLine[]>, session(code): HighlightSession }`. No Shiki grammar state is passed in or out. |
| `HighlightSession` | — | **New:** `{ update(code: string, changes: HighlightChange[]): void; lines(): HighlightedLine[]; ranges(from, to): HighlightRange[]; onChange(listener: () => void): () => void; readonly settled: boolean; dispose(): void }`. A `HighlightChange` is `{ fromA, toA, fromB, toB }` in UTF-16 offsets (old document, then new), the shape of CodeMirror's `iterChanges`; `code` is the new document; one call applies every change and parses once. A `HighlightRange` is `{ from, to, role }`. |
| `Highlighter` type | derived from `loadHighlighter` | **Changed** as above. |
| `tokenClass(token)` | takes a Shiki token `{ color, fontStyle }` | **Changed:** `tokenClass(role: CodeRole): string`. Returns the role's classes, `""` for `text`. Never `font-medium`. |
| `tokenClasses` | a record keyed by `var(--code-*)` | **Removed**; `roleClasses: Record<CodeRole, string>` replaces it. |
| `codeTheme` | the Shiki theme | **Renamed** `shikiTheme`; rewritten by role. |
| `CODE_ROLES`, `CodeRole` | — | **New:** the fourteen text roles, in decision 12's order. |
| `highlightLanguages`, `findHighlightLanguage(name)` | — | **New:** the table of 26 (`id`, `aliases`, `engine`) and its lookup. |

**How a session updates.** For each change, in ascending order, one tree-sitter `Edit`: `startIndex = fromB`; `oldEndIndex = fromB + (toA − fromA)`; `newEndIndex = toB`. The start point is `fromB`'s row and column in the new text, which equals the tree's own at that moment (every earlier change is already applied). The old-end point is the start point advanced by the rows and columns of the replaced old text, `old.slice(fromA, toA)`, which the session takes from its own copy of the previous text. The new-end point is `toB`'s in the new text. Then one `parse(code, tree)`.

**What is re-queried after an update.** By default, `lines()` and `ranges()` re-query only what moved: `tree.getChangedRanges(oldTree)` and the edited ranges, merged and extended to whole lines; every other line's tokens are reused. Some edits change a role where no syntax moved (the review's finding 32), so the session widens the re-query in three cases:

| Case | Example | Re-query |
|---|---|---|
| A locals language (Ruby, JavaScript, TypeScript, and JSX and TSX through them) | `count = 0` added at line 10 turns a bare `count` at line 400 from a call (`function`) into a local (`text`) | the whole of every `@local.scope` that encloses a changed range, its resolved locals recomputed. For Ruby's top-level scope that is the whole document. |
| An injected region whose text changed | an edit inside an HTML `<script>`, a Svelte expression, a Markdown fence | that whole region |
| An injection's host node or language selector changed | a Svelte `<script>`'s `lang` set to `"ts"`; an HTML `<script>` added or removed; a Markdown fence's info changed from `python` to `bash` | Svelte's script `lang`: **the whole document**, since every expression and pattern takes the script's language. Any other selector or host node: that whole region. |

**Injected trees across edits.** Each injected region keeps its own tree, keyed by its host node. A region whose text changed and whose language did not is re-parsed incrementally, with the edits that fall inside it mapped into its own offsets; a region that is new, or whose language changed, is parsed whole; a region whose host node is gone is dropped. Injected regions are small (a script, a style, a fence), so the whole-region re-query costs little.

**Locals across a window.** `ranges(from, to)` runs the locals query over the outermost `@local.scope` nodes that intersect the window, not the window alone, so a local defined above the window is still known inside it. The resolved locals are cached per scope and dropped when a changed range touches the scope, which is the same rule as the re-query above. Only the highlight query is limited to the window. **A window's ranges equal the whole document's ranges clipped to that window,** which `highlight-session.test.ts` checks.

**`useHighlightedCode(value, language)`** keeps its signature and its `{ current }` result, and gains `settled`. It opens a session on first load. When the new text starts with the old, it passes one change for the appended range (`fromA = toA = fromB = old length`, `toB = new length`), so streamed code re-parses incrementally and re-queries only the tail. A text that does not extend the old one is passed as one whole-document change. It repaints on `onChange`. Plain strings until the highlighter arrives, as today.

**`code-block`'s props do not change.** `CodeBlockContent` still takes `code`, `lines`, `language`, `lineNumbers`, `wrap`, `tabindex`; `CodeBlockLine` still takes `code` as a string or `{ content, class }[]`. What changes:

- **The body colour.** The root's default variant becomes `text-code-text` (was `text-foreground`), so every body token takes Tombaugh's ink, `#25292F` light and `#D9DFE8` dark, not the page's. The `destructive` variant keeps `text-destructive`.
- The classes (role classes, no `font-medium`), the colours (decision 11), and the `data-highlight` attribute (decision 14).
- Line numbers keep `muted-foreground`: they are chrome, not a token.

**`code-editor`** loses `codeHighlight`, `pythonLanguageConfigured` and `pythonRoles` from its exports and gains `codeHighlighting(language)` (decision 16). `pythonSetup()` keeps its name and return type.

**`code-languages`**: `codeLanguages`, `findLanguage` and `loadLanguage(name): Promise<LanguageSupport | null>` keep their signatures (decision 16).

### 16. The editor

**How CodeMirror shows tree-sitter's colours.** A new file, `code-editor-highlighting.ts`, exports `codeHighlighting(language: string): Extension`. It is **one view plugin, at `Prec.highest`**, and nothing else. *Why a view plugin, not a state field* (the review's finding 5): a state field has no view to dispatch from when a load resolves, and its `update` runs for transactions that may never be applied (a filtered or replaced transaction), while a tree-sitter `Tree` is mutable WASM state. A view plugin sees only what the view committed.

1. **Load.** The plugin's constructor calls `loadHighlighter(language)`. Until it resolves, the editor shows plain text, as the prerendered fallback does.
2. **Open.** When the load resolves, the plugin opens `highlighter.session(view.state.doc.toString())`: **the document as it is then**, not as it was when the load began. It subscribes to `onChange`, and dispatches an empty transaction (`view.dispatch({})`) so the view redraws once. If the plugin was destroyed first, it disposes the session at once.
3. **Edit.** In `update(update)`, when `update.docChanged`, it collects `update.changes.iterChanges` into one list of `{ fromA, toA, fromB, toB }` and calls `session.update(update.state.doc.toString(), changes)`. `update.changes` composes every transaction the view committed since the last update, so only committed changes reach the tree, and one update parses once.
4. **Paint.** `decorations` are `Decoration.mark({ class })` over `view.visibleRanges` from `session.ranges(from, to)`, rebuilt when the document, the viewport or the session (its `onChange`) changes. The classes are `roleClasses`, the same literals the block renders. At `Prec.highest` the plugin's span is innermost, so its class decides the colour (`007` review finding 1).
5. **Dispose.** `destroy()` unsubscribes and disposes the session.

**The fallback languages** get a Shiki session with the same interface. It keeps each line's tokens and end state. After an edit it re-tokenises from the first changed line and stops at the first later line whose end state equals the cached one, compared by `a.getInternalStack()?.equals(b.getInternalStack())`. Shiki 4.5.0's `GrammarState` has no `equals`; its stack is reached through `getInternalStack()`, marked `@internal`, and vscode-textmate's `StateStack.equals` is public (READ, the review). It relies on an internal method of a pinned version, so `highlight-session.test.ts` guards it. Only if that test fails on a future Shiki does the session fall back to re-tokenising the visible lines plus 50 and marking the rest stale, with the change recorded.

**Block and editor colour the same code the same way** because both ask the same kind of session for the same ranges and render the same classes. Criterion 7 measures it, including off-screen edits.

**What happens to Lezer.**

- **Lezer and the legacy modes keep structure and behaviour, and lose colour.** Indentation on Enter and on input, bracket matching and closing, comment toggling, HTML's tag auto-closing, Markdown's list continuation: all stay Lezer's (or a legacy mode's). No `syntaxHighlighting` is installed, so they paint nothing. *Why keep them:* these are behaviour a typist relies on, and Lezer's are mature for eighteen languages; rewriting them as tree-sitter queries for twenty-one is a specification of its own. Folding is not offered today and is not added.
- **`loadLanguage` keeps a language's support whole:** `new LanguageSupport(loaded.language, [loaded.support, codeHighlighting(id)])`, where `loaded` is what `description.load()` returns. *Why* (the review's finding 19): a `LanguageSupport`'s `support` holds behaviour as well as structure; rebuilt from `language` alone, HTML would stop closing tags. L1 checks one behaviour.
- **Python** loads `new LanguageSupport(pythonLanguage, [codeHighlighting("python")])` in `code-languages` (in place of `pythonLanguageConfigured`). `@codemirror/lang-python` stays, for structure.
- **`pythonLanguageConfigured`, its `styleTags`, and `pythonRoles`** go: the Python query tells decorators, annotations, `self`, built-ins and docstrings.
- **`codeHighlight`** (the `HighlightStyle`) goes. **`@lezer/highlight`** is then imported by no file of ours, so `code-editor` stops naming it (it stays installed as a dependency of the Lezer packages).
- **The prerendered fallback `pre`** (`code-editor.svelte`) takes `text-code-text`, so its text is the colour it will have once mounted, on the ground `014` gives the root.
- **Inline code** (`014` decision 15, `decisions.md`, "Inline code takes the code ground too"). `014` shipped it into `pluto-theme`'s `@layer base` as utilities, not raw `var()`, with a selector that excludes code inside a `pre` and inside a heading (READ, `scripts/build-tokens.ts` and `src/app.css` as `014` landed them): `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code) { @apply rounded border border-border bg-code-background px-1 text-code-foreground box-decoration-clone; }` and `a code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code) { @apply text-code-link; }`. 013 keeps both selectors exactly as shipped. 013 changes one class in the first rule, **`text-code-foreground` → `text-code-text`**, since `--code-foreground` and its utility go. The second rule keeps `text-code-link`, which 013 keeps. `014` criterion 15's exact `@apply` string moves with it (decision 21).
- **`codeTheme`, the chrome,** changes in two values: `&`'s `color` and `.cm-content`'s `caretColor` become `var(--code-text)` (were `var(--code-foreground)`, which this specification removes). `014` changes `.cm-scroller`'s `scrollbarColor`. Nothing else in it changes.
- **`pythonSetup()`** becomes: line numbers, history, the keys, `pythonLanguage` (structure), `codeHighlighting("python")`, bracket closing and matching, indent on input, the active line.

**Two parsers per keystroke.** Lezer for structure, tree-sitter for colour. Lezer is incremental and already ran; the cost added is tree-sitter's.

**Performance on a long document while typing** (EXECUTED (013), `web-tree-sitter` 0.27.2 in Bun 1.4.4, not a browser): a 5,501-line, 194,500-character Python file parses in full in 41 ms (54 ms in Node 22). A query over a 3,000-character window takes 2.4 ms; over the whole file 29 ms. Fifty single-character inserts, each an `Edit`, an incremental re-parse and a window query, average **1.2 ms**, the slowest 17.6 ms (the first, as the engine warms). So the editor parses on the main thread, and only the visible window is queried for highlights. *Why no Web Worker:* at these figures a worker's round trip would cost more than it saves, and it would need a second copy of every grammar. Decision 20 sets the budget; reset at checkpoint 2, see decisions.md ("After the `013` build's checkpoint 2").

**Keyboard and accessibility do not regress** (constitution §4.4). Decorations add classes to spans; they add no element a keyboard can reach, change no role, name or `tabindex`, and bind no key. Tab still leaves the editor; Control-Enter and Meta-Enter still run; `readonly` and `disabled` behave as today. `code.spec.ts` E1 to E5 keep their behaviour checks, the keyboard fixtures keep their stop counts, and axe scans every code page in both themes (criteria 14 and 15).

### 17. What changes for an installed app, the version and the changelog

**One release, 0.12.0,** shared with `014` and `015` (`decisions.md`, "One release, 0.12.0, for the white ground and tree-sitter"), settled the same way in both specifications:

- **The version moves to 0.12.0 at the start of `014`'s build,** before its first registry build, so the dev server and `bun run build` write `static/v0.12.0/` and never rebuild the released `static/v0.11.0/` (`decisions.md`, "After the `009` build's checkpoint"). 013 is built on that tree, already at 0.12.0, and **does no bump of its own**.
- **The release holds five specifications, built in this order:** `014` (landed), then 013, then `016` (the brand yellow), then `015`, then `017` (the design site's two parts). Each is committed to `release/0.12.0` when it lands, and the next builds from that commit.
- **The tag comes once, after the change reviews of all five.** Until then the 0.12.0 entry is dated "unreleased".
- No item is new, so no `meta.since` changes.

**One shared 0.12.0 entry, one bullet per item,** merged by `014` decision 12's rules. `014` writes the entry first. 013 fills the places `014` marks `{013: …}`, never a second entry. An item's bullet is marked **interface change** when either specification changes its interface. `014` owns the code ground, the active line, the hairline edge and `scrollbar-code`; 013 owns the syntax roles, their colours, the engine and the editor. **In a shared bullet, 013's sentences come first, then `014`'s.** 013's `pluto-theme` sentences point to `014`'s for the two grounds, and `014`'s scoped sentence ("the code-ground change itself renames and removes nothing; every rename and removal in this bullet is the code map's") follows them. Every bullet names an item; what is not about one item goes in the summary line or the update paragraph.

**013's sentences in that entry** (each in the place `014` decision 12 marks; the date is the tag's):

> *Summary line, before `014`'s:* Code is highlighted by tree-sitter with this system's own queries, in code blocks and in the editor alike, and coloured in Tombaugh, the owner's palette after the guide Meridian: keywords violet, functions blue, types navy, strings green, numbers yellow, constants orange, meta plum, specials red, comments grey and upright. Every colour reads 4.5:1 or more on the code ground and the active line in both themes, and dark colours sit between 6.5 and 9.5 on the dark code ground. Numbers and constants are close in light mode for a reader with protanopia; numbers are digits and constants words.
>
> - `pluto-theme`, *first:* The code map is Meridian's roles. `--code-text` replaces `--code-foreground`, and code's body is now its own ink (`#25292F` light, `#D9DFE8` dark), not the page's foreground. `--code-meta` and `--code-special` are new. `--code-escape`, `--code-builtin`, `--code-tag`, `--code-property`, `--code-decorator`, `--code-self` and `--code-invalid` are removed, with their `text-code-*` utilities. `--code-comment`, `--code-keyword`, `--code-function`, `--code-type`, `--code-string`, `--code-number`, `--code-constant`, `--code-link`, `--code-inserted`, `--code-deleted` and `--code-changed` keep their names and take new colours. The theme roles `syntax-amber`, `syntax-purple`, `syntax-teal` and `syntax-cyan` are removed; `syntax-orange` takes a new colour; `syntax-violet`, `syntax-blue`, `syntax-navy`, `syntax-green`, `syntax-yellow`, `syntax-plum`, `syntax-red`, `syntax-grey` and `syntax-ink` are new. The code ground and the active line are as the sentences that follow set them.
> - `highlighter`: **interface change.** tree-sitter (`web-tree-sitter` and 19 grammar packages, now `dependencies` of the item) highlights 21 languages at prerender and in the browser; Shiki highlights Markdown, diff, SQL, Swift and Dockerfile, and any language whose grammar is removed or fails to load. `highlightCode` and the `HighlightedLine` type are unchanged; `highlightCode` now waits for any grammar the code embeds. `loadHighlighter` returns a highlighter whose `highlight(code)` is asynchronous and whose `session(code)` updates incrementally (`update(code, changes)`, `onChange`, `settled`), and takes no grammar state. `tokenClass` takes a role; `tokenClasses` is replaced by `roleClasses`; `codeTheme` is renamed `shikiTheme`. Tokens are never bold. The packages take about 350 MB on disk, and every client build carries their 20 grammar files and the runtime, about 23.5 MB raw (2.15 MB gzipped); a page fetches only the runtime and the grammars it shows. To keep fewer languages, delete their rows in `highlight/languages.ts` and remove their packages; they fall back to Shiki.
> - `code-block`, *first:* Its body text takes `--code-text`, and its tokens the new role classes. `CodeBlockContent` sets `data-highlight` to `"pending"` or `"settled"`.
> - `code-editor`, *first:* Colour comes from the highlighter, through `codeHighlighting(language)`, so the editor colours code exactly as the code block does. Its text, its caret and its prerendered text take `--code-text`. `codeHighlight`, `pythonLanguageConfigured` and `pythonRoles` are removed; `pythonSetup()` is unchanged in use. The item now depends on `highlighter`.
> - `code-languages`: each language keeps CodeMirror's indentation, brackets and behaviour, and takes its colour from the highlighter. Its exports are unchanged.
> - `use-highlighted-code`: no signature change; its result gains `settled`.
>
> *Update paragraph, before `014`'s:* Any `add` from `v0.12.0` updates `pluto-theme`, since every item names it, so update the code items with it: `add pluto-theme highlighter use-highlighted-code code-block code-editor` (and `code-languages` if you have it), then `bun install`. Otherwise an older highlighter paints half in the old palette and half in the new. The CLI never deletes a variable the new theme lacks, so after updating, delete these lines from your stylesheet: in `:root` and in `.dark`, `--code-foreground`, `--code-escape`, `--code-builtin`, `--code-tag`, `--code-property`, `--code-decorator`, `--code-self`, `--code-invalid`, `--syntax-amber`, `--syntax-purple`, `--syntax-teal` and `--syntax-cyan`; in `@theme inline`, the `--color-` form of each and the CLI's derived `--code-…: var(--code-…)` line for each removed `--code-*` name. Until they go, `text-code-builtin` and the other removed classes still compile, in their old colours.

The item pages say the same, and the smoke test runs it (criterion 21).

### 18. The workbench is removed; its specimens and the reference become fixtures

The owner dropped the workbench from 0.12.0 (`decisions.md`, "A public design site, the workbench dropped, and properties under Meridian"). It was never released. `014` decision 10 leaves the workbench alone and to this specification, so 013 removes it.

| What | Fate |
|---|---|
| `src/routes/(workbench)/` (the `/workbench/code/` route and its layout) | Removed. |
| `src/lib/workbench/specimens.ts` | **Moved** to `tests/fixtures/highlight/specimens.ts`, its content unchanged, so each specimen's SHA-256 in the reference still matches. |
| `src/lib/workbench/palette.ts` | **Removed, with its copies of the arithmetic,** so each formula exists once. `contrastRatio`, `deltaE` and `mix` have one home, `scripts/contrast.ts` (`014` decision 8 puts `deltaE` and `mix` there), and every test imports them from it. Only what `scripts/contrast.ts` lacks moves to `tests/helpers/colour.ts`: `oklch`, `fromOklch`, and the colour-vision matrices from the page (Machado 2009), for decision 8's deuteranopia figure. Slots, palettes, swatches, export and import, and token patches go. |
| `src/lib/workbench/rules.server.ts` | Removed. Its three rules are now patterns of our queries and of the Shiki fallback theme; its unit cases move to `highlight.test.ts`. |
| `candidates.server.ts`, `baseline.server.ts`, `code-pane.svelte`, `colour-field.svelte` | Removed; nothing tests them once the page is gone. |
| `tests/unit/workbench.test.ts` | Removed. Its arithmetic check is moot once the copies are gone. `tests/unit/colour.test.ts` checks the helper: `oklch` and `fromOklch` round-trip the 20 Tombaugh hexes, and the deuteranopia and protanopia matrices reproduce the number–constant figures of decision 8. Its specimen-coverage check moves to `highlight-accuracy.test.ts`: the specimens put every one of the 14 text roles on screen. |
| The reference, `research/2026-11-14-highlighting-reference.json` | Stays in `research/`, unedited, as the record. The converter reads it and writes the fixture under `tests/fixtures/highlight/` (decision 19). |
| `research/2026-11-14-meridian-and-tombaugh.json` | Stays; `contrast.test.ts` reads the `tombaugh` swatches from it, as `014` criterion 5 does. |
| The research memos that cite the workbench | Stand as the record. |

**Other users of the removed names** (READ, a grep for `code-foreground` and the removed slot names over the tree as `014` landed it): `src/lib/preview/install-command.svelte` (`text-code-foreground`, since `014`), `src/routes/(site)/items/pluto-theme/+page.svelte` (`text-code-foreground` and the removed slot classes in its slot table) and `src/routes/(site)/items/highlighter/+page.svelte` (the slot table) move to `text-code-text` and the roles; `scripts/build-tokens.ts` (the inline-code rule, decision 16) and `src/app.css` (regenerated); `scripts/lint-literals.ts` (L19's names); the workbench's `code-pane.svelte` and `rules.server.ts`, removed with it; the tests of decision 21, `contrast.test.ts`'s inline-chip group among them. Build step 1 greps again and moves any reader the grep finds.

**The public site, `015`, will absorb** the six item pages this specification changes, and `/view/code-agreement/` stays a test view outside it. 013 designs none of the site.

### 19. The reference becomes a test

The reference labels 18 workbench specimens and 10 held-out samples in the old 19 slots. The converter derives the test fixture from it.

**The converter, `scripts/convert-reference.ts`,** reads the reference and two inputs of ours, and writes `tests/fixtures/highlight/roles.json` in the reference's span format (`[line, startColumn, endColumn, role]`), carrying the source's SHA-256 and each specimen's code SHA-256.

1. **The mechanical map,** only for (language, old slot) pairs with one role, listed in full:
   - Every language: `foreground`→`text`; `comment`→`comment`; `string`→`string`; `number`→`number`; `function`→`function`; `self`→`keyword`; `decorator`→`meta`; `invalid`→`special`; `link`→`link`; `inserted`, `deleted`, `changed` → themselves.
   - `keyword`→`keyword`, `escape`→`special`, `builtin`→`function`, `type`→`type`, `constant`→`constant`: in every language, **except** the spans rule 2 lists, which the hand list overrides.
   - `property`: JSON → `function`; Bash → `meta`; Python, TypeScript, JavaScript, Rust, Go, Java, C#, Ruby, SQL, TOML → `text`.
   - `tag`: TOML → `type`.
   - **No other pair is mechanical.** `property` in HTML, Svelte, TSX, YAML and CSS, and `tag` in HTML, Svelte, TSX and CSS, are labelled span by span in the hand list.
2. **The hand list, `tests/fixtures/highlight/roles-hand.json`,** holds every span the map does not decide or must override: specimen, line, columns, old slot, new role, and the row of decision 13 that decides it. **The hand list always overrides the map.** It covers, by construction:
   - `property` in HTML (attributes `meta`; an inline script's object keys `text`), in Svelte (attributes `meta`; script fields `text`; CSS properties `keyword`), in TSX (JSX attributes `meta`; interface fields `text`), in YAML (keys `text`; anchors and aliases `meta`), in CSS (property names `keyword`; custom properties `meta`); getters at their definition, in any language (`function`);
   - `tag` in HTML, Svelte and TSX (elements `keyword`; components `type`; an inline style's selectors `type`), and in CSS (selectors `type`; pseudo-classes `meta`);
   - `builtin` that is a Python built-in type (`type`) or a JavaScript global object (`text`);
   - `type` that is a module, package or qualifier (`text`), never a class used as a receiver;
   - `function` that is a marked macro (`meta`); `escape` that is a JSX or Svelte brace (`text`); `string` that is a regular expression (`special`); `constant` that is a lowercase real constant (`text`); `foreground` that is a CSS keyword value (`constant`); `keyword` that is a doctype (`meta`).
3. **Known losses are not applied.** Decision 13's two "known loss" rows (C#'s static receivers, Go's conversions) change no label: the held-out C# sample's `Console` stays `type`. Only rulings move labels.
4. **Before it is frozen,** the converter prints, for every (language, old slot) pair present in either set, the distinct texts of its spans and the rule that covers it. The design lead reads that printout at build step 2; a pair the printout shows with mixed roles moves to the hand list. The printout is kept in the Landing notes.
5. **Order.** The hand list is written, and the fixture generated and its SHA-256 recorded, **before any query of ours exists** (build step 2), for both sets. Each hand change cites a row of decision 13, never a highlighter's output. `convert-reference.test.ts` re-runs the converter and checks the fixture is byte-identical, so it is provably the reference plus the hand list.

**The held-out set is guarded mechanically** (the review's finding 12):

- `highlight-accuracy.test.ts` scores the held-out set **only when `PLUTO_HELDOUT=1` is set.** Otherwise it skips that set and prints that it skipped.
- `PLUTO_HELDOUT` also gates the samples on screen: unless it is set at build time, the ten held-out samples render **plain** (no `language`) on the `highlighter` page, on `/view/code-agreement/`, and in the `code-languages` select, and `highlight.test.ts`'s "2 roles" check, C5, E6 and L1 run on the other 16 gallery samples.
- **At checkpoint 1 the design lead, not the builder,** sets `PLUTO_HELDOUT=1`, runs the test, and records the figure. Then, in the tree, the design lead:
  1. **deletes the gate code**, every read of `PLUTO_HELDOUT` in `src/` and `tests/`, so every build, test run, smoke run and deploy (the preview, and `015`'s public site) colours and scores all 26 samples with no variable to forget;
  2. **writes the lock,** `tests/fixtures/highlight/query-lock.json`: the SHA-256 of each of the 24 query files at that moment, the held-out figures, and an empty list of later changes.
- **The lock is mechanical, not trust.** `queries.test.ts` hashes every query file and compares it with the lock. A file whose hash differs fails the suite unless the lock's list of changes names it, with its new hash, its reason, and both sets' figures after the change. So no query can move after the held-out set has been seen without the change, and what it did to both sets, being written down where the change reviewer reads it. The reviewer re-derives the hashes from the diff and re-runs both sets.
- **What stays unseen, and what cannot.** After checkpoint 1 the held-out labels have been scored, so they are no longer unseen; what the lock guarantees is that no tuning against them is silent. Before checkpoint 1 they are unseen by mechanism: the gate keeps them plain on screen and unscored.
- **After that, any query change re-scores both sets,** and the Landing notes list each changed file's new SHA-256 with both figures. The change reviewer re-derives the hashes from the diff: a query that differs from its recorded hash with no listed change fails the review.

**The test, `tests/unit/highlight-accuracy.test.ts`,** highlights each specimen with `highlightCode`, builds a role per character, and compares non-whitespace characters with the fixture (the memo's scoring, §4.1). It fails if a specimen's code SHA-256 differs from the fixture's.

**The bars are INFERRED targets,** not measurements. The memo's 96.6% and 95.5% were c2, stock queries with ours appended (Intent); nothing measured fresh queries. Its worst tree-sitter languages were HTML 93.0% on the workbench set and C# 89.1% held-out; Shiki with all rules (b2) scored Markdown 95.1%, diff 98.0%, SQL 67.2%. SQL, Markdown and diff now run on Shiki: on the memo's figures that costs the workbench set about one point (INFERRED). The roles merge several old slots (built-ins with functions, escapes with specials, decorators with macros), which can only help; they split others by syntax, which tree-sitter sees; the two known losses count against the queries.

| Set | Bar |
|---|---|
| Workbench, all 18 | **94.0%** |
| Held-out, all 10 | **92.0%** |
| Workbench, the 15 tree-sitter languages | **95.0%** |
| Held-out, the 9 tree-sitter languages | **93.5%** |
| Each tree-sitter language, workbench | **90.0%** |
| Each tree-sitter language, held-out | **85.0%** |
| Shiki fallbacks, workbench | Markdown **90.0%**, diff **90.0%**, SQL **75.0%** (SQL's columns become `text`, which Shiki already leaves unscoped) |

*Why not 96%:* the bar must survive the conversion and a grammar patch, and still fail anything near Shiki as shipped (83.1%). **The workbench-set bars are confirmed or reset at checkpoint 1, before the held-out set is scored:** if fresh queries land under a bar there, the design lead records the measured figure, the reason, and the new bar in `decisions.md`, then scores the held-out set against its own bars, unchanged. No bar moves after that.

### 20. Performance and size budgets

| Budget | Limit | Measured (EXECUTED (013) unless cited) | Checked by |
|---|---|---|---|
| The runtime, as the browser fetches it | ≤ **125 kB** gzipped, WASM and JS chunk together | 83 kB WASM + 32 kB JS, unminified | criterion 18 |
| Each of the 20 grammar WASM assets | ≤ its decision 3 figure + 5%, and ≤ **320 kB** gzipped | 2 to 315 kB | criterion 18 |
| Each language's query chunk | ≤ **6 kB** gzipped | — | criterion 18 |
| A prerendered page whose blocks get `lines` | **0** tree-sitter, `.wasm` or Shiki assets referenced, and 0 `modulepreload` links to them | as today for Shiki | criterion 12 |
| The 18 workbench specimens, a fresh process | ≤ **1.5 s** first pass, ≤ **50 ms** warm. "Fresh" is a `Bun.spawn`ed subprocess, so no module is cached. | memo: 0.39 s, 10 ms (tree-sitter alone); Shiki's TypeScript alone 0.95 s. The mixed first pass (tree-sitter plus Shiki for SQL, Markdown and diff) is unmeasured; build step 3 measures it and records it, and the budget holds. | criterion 19 |
| A 2,000-line stream in 50 chunks through the hook's session, in Bun | ≤ **5 ms** per chunk, p95 (reset by `022ab` from 4 ms, see Landing notes) | — | criterion 19 |
| The editor, a 5,000-line Python document in Chromium | first colour ≤ **250 ms** after the grammar loads; over 200 typed characters, **in-page** time from a transaction's dispatch to the end of the view's update, p95 ≤ **12 ms** (reset at checkpoint 2 from 8 ms, see decisions.md) and max ≤ **50 ms** | 41 ms full parse; 1.2 ms mean, 17.6 ms max per edit, in Bun; 8.7 to 10.4 ms p95 in Chromium at checkpoint 2 | criterion 19 |
| The editor, a 2,000-line Ruby document (locals) | in-page p95 ≤ **16 ms** per keystroke | — | criterion 19 |
| The editor, a 2,000-line Markdown document (Shiki) | in-page p95 ≤ **16 ms** per keystroke | — | criterion 19 |
| The site's `bun run build` | no budget; recorded against 0.11.0's | — | Landing notes |

*How the editor is timed* (the review's finding 9): an update listener records `performance.now()` when a transaction is dispatched and when the view's update ends, in the page. The Event Timing API's `processingEnd − startTime` for each `keydown` is recorded beside it. The time to the next animation frame, which waits 0 to 16.7 ms whatever the editor does, is recorded too and not gated.

**What this costs pages that highlight in the browser today.** `stage-card` (`product-home`'s shell and Python cards), `live-console` and `chat` highlight with the hook in the browser. They now fetch the runtime (about 115 kB) and each grammar shown (Bash 177 kB, Python 64 kB), once, where Shiki's were 52 kB of core and 5 to 8 kB per language (memo §6.1). That is the owner's choice of one engine everywhere (memo §8, option 1). A composition that knows its code at build time can pass prerendered `lines` and fetch nothing; changing the compositions to do so is out of scope.

### 21. The tests

`003`'s pattern: each check is written first and seen failing. `bun test` for unit and smoke, Playwright for the browser, `--bun` wherever a tool starts.

**New unit files** (`tests/unit/`):

- `highlight.test.ts`:
  - the table: 26 ids, 21 `tree-sitter` and 5 `shiki`, with today's aliases; `null` for an unknown name;
  - the samples: each gallery sample highlights with at least 2 distinct roles besides `text` (diff: 2 of `inserted`, `deleted`, `comment`); 16 samples until `PLUTO_HELDOUT` is set, 26 after (decision 19);
  - **the five fallbacks** (decision 4): a removed row, a resolver that throws, a fetch that fails, a grammar that fails to instantiate, a query that fails to compile; each falls back to Shiki with one warning and no throw;
  - **the owner's rulings, 4 cases:** `pip install --upgrade x` (`pip` `function`, the rest `text`); `0x2A`, `3j`, `2_500`, `30_000L` each one `number` span; `font: bold 0.75rem` (`bold` `constant`, `0.75rem` one `number` span); a docstring `string`;
  - **Meridian's cases, 13:** `Body` in `-> Body | None` is `type`; a JSON key is `function` with its quotes; an HTML attribute is `meta`; a CSS property is `keyword`; a CSS selector is `type`; `:hover` is `meta`; `$HOME` is `meta`; `MAX_LINES` is `constant`; `self` is `keyword`; `this` is `keyword`; `print` is `function`; `str` is `type`; `fmt.` is `text`;
  - **the ALL_CAPS limits, 3 cases:** `class API:` keeps `type`; `API()` keeps `type`; C's `MAX(a, b)` is `function`;
  - **errors, 9 cases:** an unclosed call, an unclosed object or dict, and an unclosed string, in Python, TypeScript and Bash; each has 0 `special` characters outside escapes;
  - **Svelte, 2 cases:** `{#each items as item, i (item.id)}` gives `item` and `i` `text`, `items` and the key `item.id` as expressions, `as` `keyword`; `{#await p then value}` gives `p` as an expression, `then` `keyword`, `value` `text`;
  - **the carried fault:** an apostrophe inside a TypeScript `//` comment leaves the following lines right;
  - 0 `font-medium` in any output; `highlightCode` on the Markdown specimen and sample colours their fences in their own language;
  - the first-pass and warm timings of decision 20, in a spawned subprocess.
- `highlight-session.test.ts`: **500 random edits in each of four languages,** Python, Ruby (locals), Svelte (injections) and Markdown (the Shiki session, with a fence): inserts, deletes, replacements, several changes in one call, edits inside surrogate pairs. After each, the session's `ranges(0, length)` equal a fresh session's on the same text, **over the whole document, not a window**. Plus: the Shiki stack-equality guard; a session opened while a fence's grammar loads fires `onChange` once and then equals `highlightCode`'s output; the streaming budget of decision 20.
- `highlight-accuracy.test.ts`: decision 19's bars; the held-out set only under `PLUTO_HELDOUT=1`; the specimens cover the 14 text roles; per-specimen figures printed.
- `queries.test.ts`: decision 6's six checks over the 27 pairs, the lock among them.
- `convert-reference.test.ts`: the converter re-run gives a byte-identical fixture; every (language, old slot) pair present in either set is covered by the map or by the hand list; every hand change cites a row; no known-loss row is applied.
- `colour.test.ts`: `oklch` and `fromOklch` round-trip the 20 Tombaugh hexes; the deuteranopia and protanopia matrices give decision 8's number–constant figures (deuteranopia 5.4 light and 5.1 dark; protanopia 0.5 light and 9.5 dark); `deltaE` and `mix` are imported from `scripts/contrast.ts`, and no file under `tests/` defines them.
- `code-items.test.ts`: `code-block`'s and `code-editor`'s files hold no `bg-muted`; `code-block.svelte`'s default variant holds `text-code-text` and not `text-foreground`; `code-editor-theme.ts` holds `var(--code-text)` twice; **the dropped name in any form** (`code-foreground` as a utility such as `text-code-foreground`, as `--code-foreground` or as `--color-code-foreground`) appears 0 times in any item file, in `pluto-theme`'s emitted `css` and `cssVars`, and in `src/app.css`; `pluto-theme`'s `css` holds `code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)` with exactly `@apply rounded border border-border bg-code-background px-1 text-code-text box-decoration-clone` and `a code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)` with `@apply text-code-link`; no file of the item imports `web-tree-sitter`, `shiki` or a `node:` module statically.

**Expectations that change in existing files, by name** (the review's finding 15):

- `tokens.test.ts`: names per theme 55 → 60; primitives 35 → 46; "the 9 primitives of `007` decision 3" (lines 26–30) becomes "the 20 `code-*` primitives of `013` decision 12"; the `syntax-*` test becomes 12 roles (10 colours, `014`'s 2 grounds); the `code` map 21 → 16 entries in decision 12's order.
- `contrast.test.ts`: `014`'s 95 code-slot rows become decision 12's 70 AA rows, 12 range rows, 24 cap rows, the named rows and the distinctness floors; "the 19 text slots resolve to 10 families" (lines 463–500) becomes "the 14 text roles resolve to 10 Tombaugh colours", with the swatch list; `014`'s Tombaugh group (its criterion 5) reads `number` and `constant` from `tombaugh-yellow` and `tombaugh-orange`.
- `generated.test.ts`: 16 `code-*` in `light`, 16 in `dark`, 16 `color-code-*`; 12 `syntax-*` per theme block; none of the 4 removed names. **The v0.8.0 custom-properties guard** (lines 815–850) gains two lists, built like `MOVED_011`: `REMOVED_013` (in `:root` and `.dark`: the eight removed `--code-*` names, `--code-foreground` among them, and the four removed `--syntax-*`; in `@theme inline`, the `--color-` form of each) and `MOVED_013` (the eleven kept `--code-*` names and `--syntax-orange`, each with its 0.12.0 value). Nothing else in the guard changes; it still enforces constitution §6.
- `generated.test.ts` (`014` criterion 15): the inline-code rule's exact `@apply` string reads `text-code-text` in place of `text-code-foreground`; its selector and nothing else in it changes.
- `contrast.test.ts`, `014`'s inline-chip group ("the chip's own text: code-foreground …"): it reads `code-text` and Tombaugh's ink, `#25292F` on white and `#D9DFE8` on `#2C2821`, with the ratios of decision 11 (14.61 and 10.93) in place of 19.17 and 12.87.
- `literals.test.ts`: L19's names and samples; `.scm` item files read; 0 violations.
- `registry.test.ts`: 75 items; `static/v0.11.0/` still matches its tag; `highlighter` with 29 files at their targets, 21 `dependencies` at decision 3's specifiers, no `devDependencies`, no `meta.stock`; `004`'s stock-derived count 8 → 7; `code-editor` naming `highlighter` and not `@lezer/highlight`; `highlighter.json` holding `forgiving: false` once; the one shared 0.12.0 entry holds 013's lines in its item bullets, with one `pluto-theme` bullet.
- `deps.test.ts`: the 20 new packages at decision 3's specifiers; `shiki` unchanged.
- `previews.test.ts`: unchanged (no item is new).
- `workbench.test.ts`: removed (decision 18).

**Browser** (`tests/e2e/`, `light` and `dark` projects):

- **A new test view, `/view/code-agreement/`,** holds the 26 gallery samples twice (once from prerendered `lines`, once from `code` and `language` through the hook), the 18 specimens as blocks, a full-height specimen editor, and a 20-line-tall editor on a 2,000-line Ruby file. It is added to `pages.ts`'s views, so axe and `theme.spec.ts` scan it (2 more theme checks; 1 more axe scan per width it is listed at, at 1280 only). **It is not in the keyboard walk's view list:** it is a test surface of 70 `pre` stops (26 × 2 + 18) and two editors, each component already walked on its item page. The keyboard walk's counts are otherwise unchanged.
- `code.spec.ts`:
  - **C1, the server path:** the `code-block` page's raw HTML holds role-class spans, 0 `style` attributes and 0 `font-medium` in its blocks, every block `data-highlight="settled"`, 0 references to tree-sitter, `.wasm` or Shiki assets, and 0 `modulepreload` links to them; the site's built client chunks hold 0 `node:` imports.
  - **C2, the roles in the browser:** on the page's Python block, 7 roles compute their token's colour (`keyword`, `string`, `number`, `constant`, `function`, `type`, `comment`); **a body token computes `--code-text`'s colour**; every token computes weight 400 and `font-style: normal`; `=` carries no class.
  - **C3, C4:** unchanged but for `014`'s readings.
  - **C5, prerender against the browser:** on `/view/code-agreement/`, after every live block reports `"settled"`, each gallery sample's role class per non-whitespace character is identical in both copies (16 before checkpoint 1, 26 after). **The late-grammar run:** in one more run, `page.route` holds back the response for Python's `.wasm` until the test releases it. The Markdown sample's live copy is then asserted `data-highlight="pending"` with its `python` fence plain; the test releases the route; the copy turns `"settled"` and its classes equal the prerendered copy's, fence included.
  - **E1 to E5:** unchanged in behaviour. **E3** reads the five role readings on the class sample through the new roles (`print` `function`, `self` `keyword`, the docstring `string`, `str` `type`, `@dataclass` `meta`), the mechanism (the role span is innermost), and **`.cm-content` computing `--code-text`'s colour, with `caret-color` the same**.
  - **E6, block against editor:** each specimen and gallery sample set in the full-height editor and compared with its block after both settle: the role class per non-whitespace character agrees. Then a scripted sequence on three of them (type a line, delete a range, paste a block, type a new fence in Markdown), after which the editor agrees with a fresh block of the edited text. Then **the windowed case:** in the 20-line editor on the 2,000-line Ruby file, scrolled to line 1,000, the visible lines agree with the block; then 50 edits are made at lines 10 to 40 by dispatch, off-screen, the editor is scrolled back to line 1,000, and the visible lines agree with a fresh block of the edited text.
  - **E7, the budget:** decision 20's editor figures, timed in the page.
  - **L1:** 26 of 26 languages load in the `code-languages` fixture with at least 2 distinct role colours besides the body's (diff: inserted and deleted); 16 before checkpoint 1. **One behaviour check:** in HTML, typing `<div>` inserts `</div>`.
  - **S1, S2:** S1 unchanged in its readings but for `014`'s; S2 reads 26 blocks with role classes and the 16-row role table (14 roles, the two grounds).
  - **The editor before mount:** with scripts off, the `code-editor` page's prerendered root computes the code ground's background, and its fallback `pre` computes `--code-text`'s colour.
- `axe.spec.ts`: 0 violations on every scan in both themes, the new view included. `keyboard.spec.ts`, `theme.spec.ts`, `primitives.spec.ts`: unchanged counts but for the new view's two theme checks.

**Smoke** (`tests/smoke/code-add.test.ts`): its existing checks at the new counts, plus:

- the 29 `highlighter` files land at their targets; the app's `package.json` holds the 21 names under `dependencies`;
- the scratch app's prerendered page (a `CodeBlock` with `lines` from `highlightCode` in its `load`, and a live `CodeBlock` with `code` and `language="python"`) holds role-class spans;
- **then the dev server is stopped,** and the app's `vite build`, its prerender and `svelte-check` still pass with this repository unreachable;
- the client build holds **21 `.wasm` files** (20 grammars and the runtime);
- **a Playwright check on the built app's page** counts its `.wasm` requests: the runtime and Python's grammar, and no others;
- **request time, in production,** in a third scratch app, `kit3-node` (`tests/smoke/fixtures/kit3-node/`): the `kit3` fixture with `@sveltejs/adapter-node` 6.0.2 (exact, read with `bun pm view` on 2026-11-14; its peer is `@sveltejs/kit` `^3.0.0-next.0`) in place of `adapter-static`, and **its own `bun.lock`**, committed with the fixture and pinning `adapter-node` and every other package, so its `bun install --frozen-lockfile` resolves what was tested (constitution §4.5); and one route with `export const prerender = false` whose `load` calls `highlightCode("def parse(line: str) -> Body | None:\n    return None\n", "python")` on every request. The app is built, then reinstalled with `bun install --production`, then served with `bun build/index.js`. The response holds `Body` in a `text-code-type` span, which only tree-sitter gives (Shiki leaves it plain; the memo §5.4), and the server logs 0 highlighter warnings. **A control run** deletes `node_modules/tree-sitter-python` and serves again: the response is 200, `Body` is no longer `type` (Shiki), and the server logs exactly 1 warning. *Why this design:* the `load` runs per request after a production-only install, so the check fails if the grammars were `devDependencies` (no tree-sitter `Body`, one warning) or if a missing grammar threw (a 500);
- **the upgrade case:** a second scratch app installs `pluto-theme`, `code-block` and `code-editor` from `v0.11.0`, then adds the five code items from `v0.12.0`; its `app.css` then holds exactly the old lines the changelog lists, no more and no fewer;
- our lint, L19 included, finds 0 violations in the added files.

### 22. Build order and the checkpoints

One builder, starting from `014`'s commit on `release/0.12.0`. Tests go with each step and are seen failing first. When 013 lands it is committed to the same branch, and `016` builds from it.

1. **Tokens** (decisions 10 to 12), on a tree `014` has already moved to 0.12.0: primitives, roles, the map, `build-tokens`, `src/app.css`, the contrast rows, L19, the v0.8.0 guard's lists. No version bump. The absolute counts are re-derived from `014`'s landed file and written into the Landing notes.
2. **The reference converted, and the workbench moved** (decisions 18, 19): the fixtures under `tests/fixtures/highlight/`, the colour helper, the converter and its printout, the hand list, the fixture and its SHA-256. No query exists yet. The workbench route and files are removed.
3. **The engine and the queries** (decisions 2 to 6, 13, 14): packages installed and pinned; the `highlight/` files; the 24 queries, written against the workbench set alone; the test preload; `highlight.test.ts`, `queries.test.ts`, `highlight-session.test.ts`, the accuracy test on the workbench set. The mixed first pass of decision 20 is measured and recorded.
4. **The block and the hook** (decision 15), the `highlighter` and `code-block` pages, `/view/code-agreement/` with the ten held-out samples plain, C1, C2, C5, S2.
   - **Checkpoint 1, after step 4.** The builder stops and reports. The design lead looks, in the browser, at the `highlighter` gallery and `/view/code-agreement/` at 1280 px, native size and 2×, in both themes, and reads: decision 8's guard; comments receding by colour alone; red rare on every screen; JSON keys blue and HTML attributes plum; most of each screen in the body colour, the body in Tombaugh's ink. The design lead reads the converter's printout and the hand list, confirms or resets the workbench-set bars (decision 19), **then sets `PLUTO_HELDOUT=1`, scores the held-out set for the first time, records its figures, deletes the gate code, and writes `query-lock.json`** (decision 19).
5. **The editor** (decision 16): `code-editor-highlighting.ts`, `codeTheme`'s two values, `pythonSetup`, `code-languages`, E1 to E7, L1.
   - **Checkpoint 2, after step 5.** The design lead types in the editor on the 5,000-line document, on a Svelte file and on a Markdown file with a new fence, in both themes, and reads E6 and E7's figures.
6. **Registry, pages, smoke** (decisions 5, 17, 21); 013's lines added to the shared 0.12.0 entry; the full suites; the development walk over every page in both themes.

The tag `v0.12.0` follows the change reviews of `014`, 013, `016`, `015` and `017` (decision 17); the version is already 0.12.0 from `014`'s build.

**If time runs short,** nothing is deferrable but E7's Markdown figure, which may be recorded as measured without a pass if the Shiki session falls back to the visible-lines rule (decision 16).

### 23. Limits, and what this release does not cover

- **The selection token is not added.** `014` decision 3 measured a light `#E4E7F9` and a dark `#393A3E` on which Tombaugh passes AA (lowest light comment 4.50, dark 4.53), and leaves the token to "`013`, or a later palette specification", asking the owner about dark. The owner's ruling keeps surfaces out of 013, so a later palette specification adds it. The editor and the block keep the browser's selection, unmeasured, as since `004`.
- **Numbers and constants under protanopia** are one colour in light mode (ΔE 0.5); under deuteranopia they now differ (5.4 light, 5.1 dark). Shape tells digits from words (decision 8).
- **The dark yellow's glare.** It reads 10.41 on the dark active line and 11.66 inside an ink surface, over Meridian's 9.5; on the code ground it is 9.28 (decision 11).
- **A Content Security Policy.** `web-tree-sitter` compiles WebAssembly, and Vite reports a direct `eval` in its JavaScript (EXECUTED (013)). An app with a strict CSP needs `'wasm-unsafe-eval'`, and may need more if that `eval` runs; whether it runs in the browser path was not measured. The item page says so.
- **npm and pnpm.** The grammar packages' install scripts (`node-gyp-build`) are blocked by Bun and by pnpm 10's defaults. npm runs them; with a prebuild for the platform they do nothing harmful, and without one they try to compile C. This system's apps use Bun (constitution §4.5).
- **A server without the app's `node_modules`** falls back to Shiki on the server (decision 5).
- **Semantic highlighting** is out: imported names, members used without `this`, constants by reference and printf verbs stay as syntax sees them (memo §5.6). C#'s static receivers and Go's conversions are the two counted losses (decision 13).
- **Firefox, Safari, iOS Safari and screen readers** are not checked by this release (`decisions.md`, "After the public-readiness review").

## Design

```
tokens/pluto.tokens.json   (over 014's: syntax-ground, syntax-active-line; code.background/active-line)
  primitives  −9  +20   code-violet code-violet-lifted … code-ink code-ink-lifted        (35 → 46)
  themes      −4 syntax-amber purple teal cyan · syntax-orange re-pointed
              +9 syntax-violet blue navy green yellow plum red grey ink                (55 → 60)
  code        text comment keyword function type string number constant meta special link
              inserted deleted changed · background: syntax-ground · active-line: syntax-active-line   — 16
                     ── build-tokens ──►  --code-<role> ×16 in :root and .dark · --color-code-<role> ×16

src/lib/registry/lib/
  highlighter.ts               highlightCode (awaits injections) · loadHighlighter → { highlight, session } · tokenClass(role)
  highlight/roles.ts           CODE_ROLES · roleClasses (13 literal classes; link + underline)
  highlight/languages.ts       26 rows: id, aliases, engine; 21 × { wasm: () => import("…wasm?url"), path, files[] }
  highlight/tree-sitter.ts     await import("web-tree-sitter") · Parser.init({ locateFile }) · Language.load(url | bytes)
                               last-wins, innermost, ERROR paints nothing · injections (html, svelte expressions
                               and patterns, php, rust macros) · locals over enclosing scopes · sessions:
                               update(code, changes[]) → Edits → one parse → re-query changed ranges · onChange
  highlight/shiki.ts           await import("shiki") · shikiTheme by role · chat-text's fences · stack-equal sessions
  highlight/queries/*.scm      21 highlights + 3 locals, captures named for roles, written fresh

                browser:  import("tree-sitter-x/x.wasm?url") → asset of the app's build → Language.load(url)
   prerender / server:    createRequire(import.meta.url).resolve("tree-sitter-x/x.wasm") → bytes → Language.load
             any fault:   one console.warn → Shiki
            bun test:     tests/helpers/vite-imports.ts preload: ?raw → text, ?url → path

one kind of session, three readers:
  code-block (lines | code+language; data-highlight) ─┐
  use-highlighted-code (streaming; settled)           ├─► session.ranges(from, to) → roleClasses
  code-editor codeHighlighting(lang)                  ┘      → <span class="text-code-…">  (body: text-code-text)
     ViewPlugin at Prec.highest: load → session(view.state.doc) → update.changes → decorations over visibleRanges
     Lezer / legacy modes keep indentation, brackets and behaviour; no syntaxHighlighting

tests/fixtures/highlight/   specimens.ts (moved) · roles.json (converted) · roles-hand.json
tests/helpers/              colour.ts (oklch, fromOklch, CVD; deltaE and mix stay in scripts/contrast.ts) · vite-imports.ts
```

## Scope

**In** (the work to *built*):

- The token file over `014`'s (decision 12), `scripts/tokens.ts`, `scripts/build-tokens.ts`, `src/app.css`; L19's names; `.scm` reading in the lint.
- `highlighter` (29 files), `use-highlighted-code`, `code-block`'s body and attribute, `code-editor` (5 files: `code-editor-highlighting.ts` new), `code-languages`; their `registry.json` entries.
- `scripts/convert-reference.ts`, the fixtures and helpers of decision 18, `bunfig.toml`'s preload.
- Removing the workbench (decision 18); the six item pages; `/view/code-agreement/`.
- Tests (decision 21); `package.json`'s 20 packages; `bun.lock`; 013's lines in the shared 0.12.0 changelog entry.

**The step to *done*** is the shared release (constitution §2 and §4.2): the criteria met here, the change reviewed, the tag `v0.12.0` with `014` and `015`.

**Out:**

- Every background and the selection token (`014`, and a later palette specification).
- Semantic highlighting; a language server; new languages; folding; a parsing worker; regex, JSDoc and tagged-template injections.
- Changes to `stage-card`, `live-console`, `chat` or `product-home` (decision 20).
- The public design site (`015`), beyond noting the pages it will absorb.
- Firefox, Safari, iOS Safari, screen readers.

## Acceptance criteria

Each is a count, checked by the command named. Every command runs under Bun. Criteria 1 to 23 make `013` *built*; criterion 24 makes it *done*.

1. **Install.** On a clean clone, `bun install --frozen-lockfile` exits 0. `deps.test.ts` finds the 20 packages of decision 3 at their specifiers (18 carets, 2 tildes) with `bun.lock`'s exact versions, `shiki` at `^4.5.0`, and **0** package of any item unpinned.
2. **Checks.** `bun run check` reports 0 errors and 0 warnings; `bun run lint` exits 0; `bun scripts/lint-literals.ts` exits 0 with 0 violations, L19 flagging its bad samples and 0 good.
3. **Tokens and contrast.** `build:tokens` run twice changes 0 files the second time. `tokens.test.ts`: 60 theme names in each theme, 46 primitives, 12 `syntax-*` roles, the `code` map 16 of 16 in order with `background: syntax-ground` and `active-line: syntax-active-line` (each figure as re-derived from `014`'s landed file and recorded). `contrast.test.ts`: 70 of 70 AA rows at 4.5 or more (28 light, 42 dark); 12 of 12 dark range rows between 6.5 and 9.5; 24 of 24 light rows at 15 or less; the 4 named rows printed; 0 coloured pairs under ΔE 5.0, the dark function–keyword pair at 7.0 or more; the number–constant deuteranopia and protanopia figures printed. `generated.test.ts`: 16 / 16 / 16, 12 `syntax-*` per block, 0 removed names; the v0.8.0 guard passes with `REMOVED_013` and `MOVED_013`.
4. **Accuracy, workbench set.** `highlight-accuracy.test.ts`: 18 of 18 specimens scored, SHA-256 matching; overall at 94.0% or more; the 15 tree-sitter languages at 95.0% or more; 15 of 15 each at 90.0% or more; Markdown and diff each at 90.0% or more, SQL at 75.0% or more (or the bars as reset at checkpoint 1 and recorded in `decisions.md`).
5. **Accuracy, held-out set.** The same test under `PLUTO_HELDOUT=1`: 10 of 10 scored; overall at 92.0% or more; the 9 tree-sitter languages at 93.5% or more; 9 of 9 each at 85.0% or more. Before checkpoint 1, without the variable, it skips the set and says so. In the reviewed tree there is no gate: 0 reads of `PLUTO_HELDOUT` under `src/` and `tests/`. `queries.test.ts` passes against `query-lock.json`: every query file's hash equals the lock's, or the lock lists the change with its reason and both sets' figures. The Landing notes hold the first held-out figure, taken by the design lead at checkpoint 1.
6. **Prerender agrees with the browser.** `code.spec.ts` C5 in 2 of 2 themes: 26 of 26 gallery samples, every live copy `"settled"`, identical role classes on every non-whitespace character; in the late-grammar run, the Markdown copy reads `"pending"` while Python's `.wasm` is held, then `"settled"` with the prerendered copy's classes, fence included.
7. **The block agrees with the editor.** `code.spec.ts` E6 in 2 of 2 themes: 44 of 44 texts agree on 100% of non-whitespace characters; 3 of 3 edited texts and the new Markdown fence agree after the scripted edits; the windowed Ruby case agrees at line 1,000 before and after 50 off-screen edits.
8. **Incremental is exact.** `highlight-session.test.ts`: 500 of 500 random edits in each of Python, Ruby, Svelte and Markdown (2,000 in all) leave the session's whole-document ranges equal to a fresh session's, and one random window's ranges equal the whole-document result clipped to it; the 3 widened re-query cases (a Ruby local defined above, a Svelte `lang="ts"` switch, a Markdown fence's language changed) re-colour as a fresh session does; the Shiki stack-equality guard passes; a late fence grammar fires `onChange` once and converges to `highlightCode`'s output.
9. **All 26 languages highlight.** `highlight.test.ts`: 26 ids, 21 through tree-sitter and 5 (Markdown, diff, SQL, Swift, Dockerfile) through Shiki; 26 of 26 gallery samples with at least 2 roles besides `text`; 5 of 5 failure causes fall back to Shiki with 1 warning each and 0 throws. `code.spec.ts` S2: 26 of 26 blocks with role classes. L1: 26 of 26 in the editor, and HTML's tag closes.
10. **The rulings, Meridian's cases and the edges.** `highlight.test.ts`: the 4 owner-ruling cases, the 13 Meridian cases, the 3 ALL_CAPS cases, the 9 error cases with 0 `special` outside escapes, the 2 Svelte cases and the carried comment fault, all pass; 0 `font-medium` in any output.
11. **The queries are ours.** `queries.test.ts`: 27 of 27 (file, grammar) pairs compile; 0 capture names outside the list; 0 unimplemented predicates; 0 runs of 6 or more normalised lines shared with any stock query file; at most 15% of our patterns equal a stock pattern, every one trivial; the counts and the studied stock files, with versions and licences, in the Landing notes.
12. **No engine where none is needed.** `code.spec.ts` C1 in 2 of 2 themes: the `code-block` page's raw HTML with role-class spans, 0 `style` attributes and 0 `font-medium` in its blocks, every block `"settled"`, 0 references to tree-sitter, `.wasm` or Shiki assets and 0 `modulepreload` links to them; the built client chunks hold 0 `node:` imports. `code-items.test.ts`: 0 static imports of `web-tree-sitter`, `shiki` or `node:` in the item's files.
13. **No code on light `muted`.** `code-items.test.ts`: 0 `bg-muted` in `code-block`'s and `code-editor`'s files. `code.spec.ts`: with scripts off, the prerendered editor root computes the code ground and its fallback `pre` the `--code-text` colour, in 2 of 2 themes.
14. **axe.** `axe.spec.ts` reports 0 violations on every scan in both themes, colour contrast included, `/view/code-agreement/` among them.
15. **Keyboard.** `keyboard.spec.ts` in 2 of 2 themes at 0.11.0's counts as `014` leaves them: every catalogue stop, every fixture stop with its ring unclipped, every behaviour; `code.spec.ts` E1, E2 and E4 pass in 2 of 2 themes.
16. **The roles in the browser.** `code.spec.ts` C2 and E3 in 2 of 2 themes: 7 of 7 block roles and 5 of 5 editor roles compute their token's colour; a block's body token, the editor's `.cm-content` and its `caret-color` compute `--code-text`'s colour; every token computes weight 400 and `font-style: normal`; the role span is innermost. `code-items.test.ts`: `text-code-text` in `code-block`'s default variant, `var(--code-text)` twice in `codeTheme`; 0 occurrences of `code-foreground` in any form (utility, `--code-foreground`, `--color-code-foreground`) in any item file, `pluto-theme`'s `css` and `cssVars`, or `src/app.css`; the inline-code rule's `@apply` holding `text-code-text`, and its link rule `text-code-link`. In the browser, an inline `code` on the `pluto-theme` page computes `--code-text`'s colour, and one inside a link `--code-link`'s, in 2 of 2 themes.
17. **The reference conversion.** `convert-reference.test.ts`: the fixture byte-identical on a re-run; every (language, old slot) pair present in either set covered by the map or the hand list; every hand change citing a row of decision 13; 0 known-loss rows applied (the held-out C# `Console` is `type`); the printout and the hand list's count per specimen in the Landing notes.
18. **Sizes.** A test over the site's built client (`registry.test.ts`'s build step): the runtime's WASM and chunk at 125 kB gzipped or less; 20 of 20 grammar WASM assets within decision 20's limits; every query chunk at 6 kB gzipped or less.
19. **Times.** `highlight.test.ts`: the 18 specimens in a spawned subprocess at 1.5 s or less first pass and 50 ms or less warm, the mixed figure recorded. `highlight-session.test.ts`: the 2,000-line stream at 5 ms or less per chunk, p95 (reset by `022ab` from 4 ms, see Landing notes). `code.spec.ts` E7 in Chromium, timed in the page: the 5,000-line Python document's first colour at 250 ms or less after its grammar loads; 200 keystrokes with p95 at 12 ms or less (reset at checkpoint 2, see decisions.md) and none over 50 ms; the Ruby and Markdown documents' p95 at 16 ms or less; the Event Timing and next-frame figures recorded.
20. **Registry.** `registry.test.ts`: 75 items; `highlighter` with 29 files at their targets, 21 `dependencies`, no `devDependencies` and no `meta.stock`; 7 stock-derived `004` items; `code-editor` naming `highlighter` and not `@lezer/highlight`; `bun run build:registry` writes byte-identical `static/r/` and versioned files; every built file parses and none holds `#lib`.
21. **An installed app, offline from here.** `code-add.test.ts` in 3 of 3 scratch apps (`kit3`, `kit2` and `kit3-node`, each with its own `bun.lock`): `add` exits 0; the expected files land, the 29 of `highlighter` at their targets; `package.json` holds the 21 names under `dependencies`; with this repository's dev server **stopped**, `vite build`, prerender and `svelte-check` pass with 0 errors; the prerendered page holds role-class spans; the client build holds 21 `.wasm` files; the built page requests 2 (the runtime and Python's); in `kit3-node`, after `bun install --production`, a request-time `load` gives tree-sitter's `Body` as `type` with 0 warnings, and with Python's package deleted returns 200 with Shiki's colours and 1 warning; the upgrade app's `app.css` holds exactly the changelog's listed old lines; our lint finds 0 violations in the added files.
22. **The workbench is gone, its fixtures kept.** `src/routes/(workbench)/` and `src/lib/workbench/` are absent; `tests/fixtures/highlight/specimens.ts` holds the 18 specimens with their reference SHA-256s matching; `colour.test.ts` passes, and `deltaE`, `mix` and `contrastRatio` are defined only in `scripts/contrast.ts`; `tests/unit/workbench.test.ts` is absent.
23. **Suites, documents, checkpoints and walk.** On a clean clone, `bun run test` exits 0: unit, browser in both projects and smoke, with only decision 21's named expectations changed. `CHANGELOG.md` holds one 0.12.0 entry, with one bullet per item, `pluto-theme`'s marked **interface change** and holding both specifications' lines, every removed name listed; `registry.test.ts` checks the one entry, the one `pluto-theme` bullet and the listed names. `package.json` reads 0.12.0, `static/v0.11.0/` matches its tag, and `static/v0.12.0/` is the versioned output. The Landing notes record both checkpoints with the design lead's readings, decision 8's guard, the re-derived token counts, and the development walk over every page in both themes with 0 page errors and 0 console errors or warnings.
24. **Released.** The change is reviewed, the review is cited in the Landing notes, and `v0.12.0` is tagged once, after the change reviews of `014`, 013, `016`, `015` and `017`, carrying all five.

## Risks

- **The editor's incremental path** is the riskiest part. A wrong `Edit`, or a tree fed a change the view never committed, leaves a tree that no longer matches the text, and colours drift until a reload. The view plugin sees only committed updates; criterion 8 runs 2,000 random edits across four kinds of session and compares whole documents; E6 checks off-screen edits through a scrolled window.
- **Fresh queries are unmeasured.** The bars stand on c2, which this specification may not copy. Checkpoint 1 confirms or resets the workbench-set bars before the held-out set is scored.
- **The browser path in an app's own Vite dev server.** Vite pre-bundles dependencies in development. Passing `locateFile` from a `?url` import avoids the path guess in a build (EXECUTED (013)); the dev server is checked by the development walk, not by a measured dev run here. Any failure falls back to Shiki with a warning.
- **Grammar drift.** A patch release of a grammar may still rename a node. The compile check and the fallback keep it visible and never blank.
- **Two parsers in the editor.** E7 is the guard; its Python bar was reset at checkpoint 2, see decisions.md. No worker.
- **A document that is mostly syntax errors re-parses in full.** 5,000 lines of Python with the line breaks stripped cost about 230 ms a keystroke (the design lead, at checkpoint 2). Not a gate. A later specification may bound the parse with `web-tree-sitter`'s progress callback.
- **Weight.** About 350 MB of grammar packages in every app that adds a code item, and 23.5 MB raw (2.15 MB gzipped) of WASM in its deploy. It is the owner's accepted cost (memo §7), now measured higher; the trimming path is documented.
- **Shiki's internal stack.** The session's convergence test uses an `@internal` method of a pinned Shiki; a unit test guards it.

## Review dispositions

From [`../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-spec-2026-11-14.md`](../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-spec-2026-11-14.md). Each finding is answered in full in that review's Disposition; in short:

1. **Fixed.** The body reads `--code-text` in the block and the editor; C2, E3 and `code-items.test.ts` check it; the changelog says so (decisions 7, 15, 16, 17).
2. **Fixed.** `highlightCode` awaits injected and fenced grammars; sessions fire `onChange` and report `settled`; blocks carry `data-highlight`; C5 and E6 wait for it (decisions 14, 15).
3. **Fixed.** `ERROR` paints nothing; only HTML's bare `<` is `special`; 9 error cases (decision 13).
4. **Fixed.** The packages are `dependencies`; every tree-sitter failure falls back with one warning; 5 failure cases and a production-install smoke check (decisions 4, 5).
5. **Fixed.** A view plugin owns the session; multi-change updates; old-end points from the old text; locals over enclosing scopes; 2,000 random edits in four languages and a windowed E6 (decisions 15, 16).
6. **Fixed by the owner's ruling** (Meridian's split); the link underline is the design lead's stated call (decision 7).
7. **Fixed.** 35 → 46 primitives, 55 → 60 roles, 28 light and 42 dark AA rows, 20 WASM files, 13 Meridian cases; counts as deltas over `014`, re-derived at build step 1 (decision 12).
8. **Fixed.** 21 `.wasm` files in the build, 2 requested by the page; the deploy weight stated (decisions 5, 21).
9. **Fixed.** E7 is timed in the page; the next frame is recorded, not gated (decision 20).
10. **Fixed.** The map lists only single-role pairs; the hand list overrides; doctype added; every pair counted (decision 19).
11. **Fixed.** The two rows are "known loss"; the reference keeps its labels (decisions 13, 19).
12. **Fixed.** `PLUTO_HELDOUT` gates scoring and display; the design lead scores at checkpoint 1 and records query hashes; the reviewer re-derives them (decision 19).
13. **Fixed.** The Intent says c2 was stock plus ours; the bars are INFERRED targets, confirmed or reset at checkpoint 1 (decision 19).
14. **Fixed.** Ordered file lists; `typescript-assertion` for the TS-only node; 27 pairs compiled (decision 6).
15. **Fixed.** Every changed expectation is named, with `REMOVED_013` and `MOVED_013`; the new view's effect on each suite is stated (decision 21).
16. **Fixed.** The changelog lists the lines to delete and says any `add` pulls the theme; a smoke upgrade case checks the list (decisions 17, 21).
17. **Fixed by the owner's ruling:** one release, 0.12.0, shared with `014`; the version moves at the start of `014`'s build, 013 does no bump, the tag follows the change reviews of 013 and `015`, and one entry holds one bullet per item (decision 17).
18. **Fixed.** No code on light `muted`, with a unit grep and a scripts-off reading (decision 9, criterion 13).
19. **Fixed.** `loadLanguage` keeps `support`; L1 checks HTML's tag closing (decision 16).
20. **Fixed.** The 6:1 ceiling is named and not used; its two rows printed (decision 10).
21. **Fixed.** Svelte expressions and binding patterns are injected apart; 1 case (decision 14).
22. **Fixed.** `getInternalStack()?.equals(...)`, guarded by a test (decision 16).
23. **Fixed.** `meta.stock` goes from `highlighter`; the count becomes 7 (decision 5).
24. **Fixed.** Dynamic imports only; C1 counts `modulepreload` links; a static-import check (decision 5).
25. **Fixed.** ALL_CAPS only in reference and assignment positions; C's macro call is `function`, with the reason (decision 13).
26. **Fixed.** A spawned subprocess; the mixed first pass measured at step 3; kB = 1,000 bytes (decision 20, header).
27. **Fixed.** `chat-text`'s rule exactly (decision 14).
28. **Fixed.** Sessions re-query changed ranges only; a streaming budget (decisions 15, 20).

**Second pass** (findings 29 to 39, the same review):

29. **Fixed.** `syntax-line` is `syntax-active-line` throughout, as `014` names it (13 occurrences).
30. **Fixed.** L19 is `014` decision 9's pattern, quoted as written, with its reasons (decision 12).
31. **Fixed.** A third smoke app on `adapter-node` 6.0.2 highlights per request after `bun install --production`; tree-sitter's `Body` as `type` proves the grammar loaded, and a control run with Python's package deleted returns 200 on Shiki with 1 warning (decision 21; criterion 21).
32. **Fixed.** Three widened re-query cases (locals scopes, changed injected regions, changed language selectors, Svelte's script `lang` re-querying the whole document); injected trees kept per region; window-versus-whole and three targeted tests (decision 15; criterion 8).
33. **Fixed.** At checkpoint 1 the gate code is deleted and `query-lock.json` is written; `queries.test.ts` fails on any unlisted query change (decisions 6, 19; criterion 5).
34. **Fixed.** 013's sentences go first in each shared bullet, by `014` decision 12; `pluto-theme`'s point to `014`'s for the grounds; the two item-less bullets moved to the summary line and the update paragraph (decision 17).
35. **Fixed.** The each parameter's trailing `( … )` is the key; an `{#await}` head splits at `then` or `catch`; a second Svelte case (decision 14).
36. **Fixed.** The fallback `pre` takes `text-code-text`; the scripts-off check reads its colour (decision 16; criterion 13).
37. **Fixed.** `"settled"` whenever nothing is loading, plain blocks included (decision 14).
38. **Fixed.** C5's late-grammar run holds Python's `.wasm` with `page.route` and asserts `"pending"`, then `"settled"` and equal classes (decision 21; criterion 6).
39. **Fixed.** The stale `014` references are corrected; `deltaE`, `mix` and `contrastRatio` live only in `scripts/contrast.ts`, and the workbench's copies go with it; the view's stops are 70 (decision 18).

Also folded in, from `014`'s second review: the tag comes once, after the change reviews of 013 and `015` (decision 17; criterion 24).

The constitution notes: the studied stock query files are listed in the Landing notes (criterion 11); the changelog now names the body colour, the stale lines and `onChange` (decision 17).

## Landing notes

- **Built** in the working tree on `release/0.12.0` over `b91b79d`, uncommitted. No version bump: `package.json` was already 0.12.0. `static/v0.11.0/` is untouched; the registry build wrote `static/r/` and `static/v0.12.0/`. No tag is made.
- **Token counts, re-derived from `014`'s landed file:** primitives 35 → **46**; names per theme 55 → **60**; `syntax-*` roles 7 → **12** (10 colours, `014`'s 2 grounds); the `code` map 21 → **16**. `build:tokens` run twice changes 0 files the second time.
- **The queries were written by seven delegated agents**, one per language family, under a brief that bound them to this specification: fresh from each grammar's `src/node-types.json` and parsed examples, **no grammar's `queries/` file and no other project's queries opened**, no held-out sample read, captures named for roles only. Every file opens with its grammar, the version read and "written for the Pluto design system; not derived from the grammar's own queries". **Stock query files studied: none were read.** `queries.test.ts` compared ours mechanically with the 52 stock `.scm` files installed, from these packages (all MIT): `tree-sitter-bash` 0.25.1, `tree-sitter-c` 0.24.1 (and the 0.23 copy under `tree-sitter-cpp`), `tree-sitter-c-sharp` 0.23.5, `tree-sitter-cpp` 0.23.4, `tree-sitter-css` 0.25.0, `tree-sitter-go` 0.25.0, `tree-sitter-html` 0.23.2, `tree-sitter-java` 0.23.5, `tree-sitter-javascript` 0.25.0 (and the 0.23 copy under `tree-sitter-typescript`), `tree-sitter-json` 0.24.8, `tree-sitter-php` 0.24.2, `tree-sitter-python` 0.25.0, `tree-sitter-ruby` 0.23.1, `tree-sitter-rust` 0.24.0, `tree-sitter-typescript` 0.23.2, `@tree-sitter-grammars/tree-sitter-svelte` 1.0.2, `-toml` 0.7.0, `-yaml` 0.7.1 (Kotlin ships none).
- **The counts (criterion 11):** 480 patterns in 24 files; 18 equal a stock pattern after normalisation (3.8%), every one trivial; 0 runs of 6 normalised lines shared. Per file (patterns, equal): javascript 29, 0; jsx 7, 0; javascript.locals 9, 0; typescript 43, 2; typescript-assertion 1, 0; typescript.locals 8, 0; python 39, 2; rust 38, 3; go 15, 1; java 26, 2; c-sharp 28, 2; ruby 22, 1; ruby.locals 7, 0; html 11, 0; css 18, 0; bash 24, 1; json 8, 2; yaml 14, 1; toml 6, 0; svelte 13, 0; c 20, 0; cpp 26, 0; php 38, 0; kotlin 30, 1. `json.scm` is the builder's own, the worked example of the brief.
- **Tests first, seen failing.**
  - Step 1, tokens: 35 failures in `tokens`, `contrast` and `generated` before the token change. The `.scm` lint sample and the renamed L19 samples passed red (the lint already read any text; the pattern was already `014`'s).
  - Step 2: `convert-reference.test.ts` failed to load with no fixture, and passed once the converter wrote it. `colour.test.ts` was written after its helper (made in step 1 for the contrast test's CVD print), so its round-trip and CVD checks passed on first run; its "one home" check finds `palette.ts` beside `scripts/contrast.ts` in the pre-removal tree.
  - Step 3, before any query (24 empty files): accuracy 40.3% (2 fail); `highlight.test.ts` 23 fail. Passing red: the table, the five fallbacks (each verified: one warning naming its cause, Shiki output, no throw), 0 `font-medium`, the 9 error cases and the Svelte `{#await}` case (vacuous, nothing painted), the timings. `deps.test.ts` 2 fail (the registry side, step 6). `queries.test.ts` failed its header check.
  - `highlight-session.test.ts` was written after the engine; its random-edit groups passed first time, so they were mutation-checked: a line cache that marks no line dirty fails Python, Ruby and Svelte. A wrong `Edit` (`oldEndIndex` or `startIndex` off) did not fail them on these texts: `web-tree-sitter`'s re-parse still matched a fresh one.
  - `code-items.test.ts`: the two editor checks failed until step 5; its static-import check passed red (the old highlighter imported Shiki by `import type` only).
  - Browser: C1 to C5, S2, E1 to E7, L1, C6 and the scripts-off check were written as the code landed; their first-run failures were test faults (a quoted regex, body text without a span, lines outside CodeMirror's viewport, a code sample's text matching the `node:` check, block titles matching `font-medium`, the view's missing `<title>`), each fixed. E1, E2, E4, L1 and the scripts-off check passed first run.
- **Checkpoint 1** (`decisions.md`, "After the `013` build's checkpoint 1 (2026-11-15)"). The design lead read the gallery and the view at 1280 px, native and 2×, in both themes, confirmed the workbench bars (98.4%), scored the held-out set for the first time, **97.7%** (Python 100.0, JavaScript 100.0, TypeScript 98.0, Bash 97.1, SQL 88.5, Go 98.4, Rust 98.5, Java 97.9, C# 98.0, Ruby 98.5), deleted the `PLUTO_HELDOUT` gate and wrote `tests/fixtures/highlight/query-lock.json`. Decision 8's guard: the dark yellow reads without glare; dark constant and special separate (ΔE 6.8); **dark function and type (ΔE 5.2) went to the owner, nothing changed.**
- **The held-out exposure.** Two query-writing agents briefly saw five held-out lines: the first comment lines of the JavaScript and TypeScript samples, two field lines of the TypeScript sample (`fuel: number;`, `ok: boolean;`), and the last line of the Ruby sample. Nothing was written from them. The agent that saw the JavaScript and TypeScript lines wrote those languages' queries; the one that saw the Ruby line (the C, C++ and PHP agent) wrote no Ruby file. The queries name node types and language conventions, never a sample's identifiers. Recorded at checkpoint 1; the held-out figure stands.
- **The fixture, corrected at checkpoint 1 to decision 13's rows** (TOML table headers with their brackets are `type`; Ruby's `Float()` is `type`): 14 hand entries added, none removed (295 → 309). `roles.json` `bc4e6a57969c86c03bc172c991671e181d2f7836eef87f94961132cb5e55e0e6` → `a9eab0f6cf4c236f9badaf541a6dd148edc587d5326fa9e01bfe2bee9d905d98`; `roles-hand.json` `a6dd64bc9d0a6702396f2c5bbaadab1c2fe7327c72ac06f4392e9f64c25a73e4` → `96b773391777c720048d8be05d0e05b6d97099057712f2e44da3a21728f2b2b6`. Before: workbench 98.4% (TOML 96.2, Ruby 98.9), held-out 97.7%. After: workbench **98.6%** (TOML 100.0, Ruby 99.5), held-out 97.7%. No query file changed; `query-lock.json`'s change list is empty.
- **The hand list's count per specimen** (309): held-out csharp 4, go 4, java 3, javascript 1, python 1, rust 11; workbench csharp 7, css 36, go 8, html 61, java 11, python 10, ruby 2, rust 16, svelte 53, toml 13, tsx 31, typescript 4, yaml 33.
- **The converter's printout** (`bun scripts/convert-reference.ts --print` prints it whole, with every span's text): every (language, old slot) pair is the mechanical map's, but these, which the hand list decides in whole or in part: csharp constant (lowercase-constants) and type (modules); css foreground (css-keyword-values), property (css-properties, css-custom-properties) and tag (css-selectors, css-pseudo); go constant (lowercase-constants) and type (modules); html builtin (js-globals), foreground and keyword (doctype), property (markup-attributes; fields for the inline script's keys) and tag (markup-tags); java type (modules); javascript builtin (js-globals); python builtin (python-built-in-types) and type (modules); ruby builtin (ruby-classes) and string (regular-expressions); rust function and type (macros, lifetimes; modules); svelte builtin (js-globals), escape (braces), foreground (css-keyword-values), property (css-properties, markup-attributes, fields) and tag (markup-tags, css-selectors); toml foreground (toml-tables); tsx escape (braces), property (markup-attributes, fields) and tag (markup-tags); typescript builtin (js-globals), property (function-definitions: `get size()`) and string (regular-expressions); yaml property (yaml-anchors, yaml-keys). No known-loss row is applied: the held-out C# `Console` stays `type`.
- **Accuracy, final:** workbench **98.6%** (typescript 100.0, tsx 100.0, python 100.0, rust 99.6, go 97.5, java 99.5, csharp 100.0, ruby 99.5, svelte 99.5, html 99.4, css 98.9, sql 85.8, bash 99.2, yaml 100.0, json 98.8, toml 100.0, markdown 99.4, diff 90.6); held-out **97.7%**. What is left is what syntax cannot see: printf verbs and Rust's `{}` inside strings, Go's iota constants where read, Ruby's `attr_reader` methods by name, `&amp;` inside an HTML attribute value, CSS's `rem/1.6` and a container query's `40rem`.
- **Timings.** The 18 specimens in a fresh process: first pass 0.56 s, warm 13.7 ms (tree-sitter and Shiki mixed). The 2,000-line stream: p95 2.6 ms per chunk. E7 in Chromium: first colour 41 to 45 ms; Python, 5,000 lines, p95 8.7 to 10.4 ms, max 29 to 31 ms; Ruby, 2,000 lines, p95 6.8 to 7.9 ms; Markdown, 2,000 lines, p95 1.5 to 2.0 ms; the next frame 17 to 49 ms p95 (recorded, not gated).
- **Sizes** (gzip level 9, the built client): the runtime 83.4 kB WASM + 19.8 kB JS = 103.2 kB; every grammar within its figure + 5% and 320 kB (C# 312.3, Kotlin 294.1); every query chunk under 3 kB.
- **Checkpoint 2** (`decisions.md`, "After the `013` build's checkpoint 2 (2026-11-15)"). The design lead typed on the 5,000-line Python document in both themes, on Svelte and on Markdown with a new python fence: colour followed every keystroke, nothing over 50 ms, 9.9 to 10.4 ms per transaction on the dev server. **E7's Python bar was reset from 8 ms to 12 ms**; the 50 ms max, the 250 ms first colour and Ruby's and Markdown's 16 ms stand. No worker.
- **Deviations.**
  - **E7's Python bar was reset from 8 ms to 12 ms** at checkpoint 2 (`decisions.md`, "After the `013` build's checkpoint 2 (2026-11-15)"): 200 keystrokes in 5,000 lines measured 8.7 to 10.6 ms p95, about 5 ms of it tree-sitter-python's incremental re-parse. The 50 ms max, the 250 ms first colour and Ruby's and Markdown's 16 ms stand; no worker. Decision 20's table, criterion 19 and Risks say so.
  - **The stream's budget was reset from 4 ms to 5 ms** by `022ab` (the design lead, 2026-11-17, the change review's option A: `reviews/032c-022ab-022aa-three-harness-fixes-pr-2026-11-17.md`, finding 2). CI's `checks` job, with the old test (the best of three streams' p95s) on identical code: run 5 read 2.91, 2.89 and 2.96 ms; run 6 read 4.15, 4.02 and 4.08 ms. Neither runner was loaded; run 6's was about 1.3 times slower. That is over the 3.5 ms trigger the ruling set, so the bar moves, as E7's did at checkpoint 2. `013`'s own source reads 3.54 to 3.78 ms on the `022ab` builder's machine, so the code has not slowed; this section's 2.6 ms was a faster machine. A 4 ms chunk was a quarter of a 16.7 ms frame; 5 ms is under a third. The test judges the best of 5 to 15 whole streams (`022ab`). At 5 ms, planted in each update after `session.lines()`: an 8 ms stall in every 7th update fails (best 10.24 to 10.40 ms of 15 streams); 2 ms in every chunk fails (5.11 to 5.64); 1 ms in every chunk passes (4.54 to 4.80), so a regression of 1 ms a chunk is under the bar on that machine.
  - **The specimens were restored from a copy.** A `git mv -k` skipped the untracked `specimens.ts` and the next step deleted it; it was restored from the `014` change reviewer's scratch copy, byte-identical to the source in the site build's source map, and all 18 reference SHA-256s match. Accepted at checkpoint 1.
  - **Test expectations this specification did not name:** `tokens.test.ts`'s 011 palette list drops `amber-text` and `cyan-text`, and its expressive group's counts move 35/55 → 46/60; `contrast.test.ts`'s inline chip: `code-link` moves to 6.66 and 6.75 and becomes the tied lowest; `blocks.test.ts` admits the agreement view; `literals.test.ts` counts 352 item files; in the browser, S1's ink-surface keyword reads Tombaugh's dark violet (`#C4A4FE`), I1 and I4 read `--code-text` in place of `--code-foreground`, and `tokens.spec.ts` pairs `text-code-keyword` with `--syntax-violet` in place of `--primary`. The first three were accepted at checkpoint 1. The other smoke files follow the highlighter's growth: `blocks-add` and `compositions-add` place a library file at its `target` (`src/lib/highlight/…`), and `blocks-add` counts 259 files (the highlighter's 29); `registry-add` counts 16 derived code lines. C6 compares each grammar's size with decision 3's figure at that table's precision, whole kB (TOML measures 7.356 against 7).
  - **The PHP injection** (decision 14) was missing from the first engine; it parses every text node outside `<?php … ?>` together, by HTML, over those ranges alone.
  - **A session's re-query** is exact but not literally decision 15's: in a locals language it re-queries from the change to the document's end (a reference resolves only to a definition before it), not the whole enclosing scope; locals are computed per tree over the whole document and cached by tree, not per scope; an injected region's tree is kept by its text and re-parsed whole when its text changes. The line cache is kept only once `lines()` is read, so the editor, which reads `ranges()`, skips it. When tree-sitter reports the whole document changed after an edit that undoes a parse error at the end (a streamed chunk that closes a string; a root that turns to `ERROR` and back), the unchanged top-level nodes before the edit are kept: the stream's p95 went from 7.8 to 2.6 ms. 2,000 random edits in four languages hold every one of these to a fresh session's result, whole document, window and lines.
  - **The parse input is chunked** (8 kB per read): about 10% faster than a string.
  - **`build-registry.ts` drops a devDependency the item also names as a dependency.** The CLI lists every import, the highlighter's dynamic ones included, under `devDependencies`; left there, an app's `add` would move `web-tree-sitter` and `shiki` to its devDependencies and a production install would lose them.
  - **The sizes check (criterion 18) is C6 in the browser suite**, not in `registry.test.ts`: it reads the site's built client, which only the browser suite builds.
  - **The literal lint's string pattern** cannot span a template literal's `${`, so the highlighter's files use concatenation where they had templates; the lint is unchanged.
  - **The changelog's `code-editor` bullet** now reads "No prop or slot changes": `014`'s "No prop, slot or export changes" stopped being true when 013 removed three exports.
  - **`highlight-session.test.ts`'s late-fence case and the fallback cases run in fresh processes** (`tests/helpers/late-fence.ts`, `fallbacks.ts`, `timings.ts`), since a failure falls back for the life of the process.
- **The development walk** (a dev server of the builder's own on port 5288, warmed once so Vite optimised its dependencies): 121 paths (every page, every view, the composition views and `/view/code-agreement/`) in both themes at 1280 px, 242 loads, **0 page errors and 0 console errors or warnings**, no block left `pending`. The design lead's long-running server on 5199 needs a restart: it predates the new packages, and its optimiser now answers "504 Outdated Optimize Dep".
- **Suites** (2026-11-15, the last runs): `bun run test:unit` **1,019 pass, 0 fail** (18 files); `bun run check` 0 errors, 0 warnings; `bun run lint` clean; the literal lint 0 violations, 1 allowance (L24); `bun run build:tokens` twice, 0 changes the second time; `bun run test:e2e` **2,004 passed, 4 skipped, 0 failed** (both themes, axe and the keyboard walk included); `bun run test:smoke` **122 pass, 0 fail** (the code smoke in `kit3`, `kit2`, the upgrade app and `kit3-node`: 77 files land, 21 names under `dependencies`, builds with the registry stopped, 21 `.wasm` files, 2 requested, tree-sitter's `Body` as `type` after `bun install --production` with 0 warnings, and with Python's package deleted 200 with Shiki's colours and 1 warning).
- **The change review** is [`../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-pr-2026-11-15.md`](../reviews/013-code-highlighted-by-tree-sitter-in-meridian-roles-pr-2026-11-15.md): lands, 6 Low findings.
  1. `build-registry.ts`'s name parser dropped the last character of a bare spec (`shiki` → `shik`): fixed as `packageName`, with `tests/unit/build-registry.test.ts` (a bare name, a scoped name with and without a version, `name@^1.2.3`, and the rule over a file). The rebuilt `static/r/` and `static/v0.12.0/` are byte-identical.
  2. `query-lock.json`'s workbench figure reads 98.6, with a note that the converter's correction moved it with no query change; the hashes stand.
  3. Item comments that cite "013 decision N" and the workbench are left: `015`'s citation rule rewords each at its build.
  4. E7's reset is in the Deviations list.
  5. The changelog's repeated seam sentence in the `pluto-theme` bullet is removed.
  6. The changelog's `code-editor` bullet says the editor shows plain text until the highlighter loads.
  Re-run after the fixes: unit, check, lint and the literal lint (below); the registry output did not change, so smoke was not re-run.
- **Found, not fixed.** Two Svelte-and-HTML labels where the reference and the rows differ by a few characters (`lang` in `<script lang="ts">` is `text` in the reference, `meta` by the rows). A document that is mostly syntax errors re-parses in full (see Risks). In Bun, `web-tree-sitter` loads a URL given on the browser path as a file path, so the "fetch fails" fallback case fails as a missing file there.
