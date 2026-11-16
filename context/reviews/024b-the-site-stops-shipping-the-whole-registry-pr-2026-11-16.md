# Review of 024b — The site stops shipping the whole registry (the built change)

Reviews [`specifications/024b-the-site-stops-shipping-the-whole-registry.md`](../specifications/024b-the-site-stops-shipping-the-whole-registry.md), a small change, and its memo [`research/2026-11-16-registry-in-the-client.md`](../research/2026-11-16-registry-in-the-client.md). This reviewer wrote neither the spec nor the code (constitution §5).

- **Date:** 2026-11-16
- **Status:** **Land after fixes.** Findings 1 and 2 belong on the branch before the merge. Findings 3 and 4 are small, and are best done on the branch too. Findings 5 and 6 are notes.
- **Reviewer:** a reviewer; not the author.
- **Reviewed:** `git show 03a0e6b` in the worktree `.claude/worktrees/agent-ac6d89a532056c4a0`, branch `worktree-agent-ac6d89a532056c4a0`, one commit directly on `release/0.13.0` at `467a0e8`. 12 files, +938 −81.
- **Re-ran:** Bun 1.4.4, 2026-11-16, on a load average of 8 to 21. I did not edit the worktree. `git status` was clean before and after. Ports 5783 to 5786; I did not use 5199.
  - `bun run check`: **0 errors, 0 warnings**, 2,358 files.
  - `bun test` on `generated`, `build-registry`, `registry`, `sitemap` and `rename`: **276 pass, 0 fail**.
  - `bun --bun prettier --check` on the nine changed code and fixture files: clean.
  - `build-output.spec.ts`, `search.spec.ts`, `nav.spec.ts` and `navigation.spec.ts`, chromium-light, `E2E_PORT=5783`, after a fresh `bun run build` through the web server: **85 passed**. Check A was among them.
  - The perf project, `--no-deps`, `E2E_PREBUILT=1 E2E_PORT=5784`, on that build: **25 passed** in 5.9 min.
  - Probes of my own, in a copy of `03a0e6b` made with `git archive` (`scratchpad/copy/`, sharing the worktree's `node_modules`):
    - two bootstrap experiments (finding 1);
    - one build with two mutations, checked by the real check A (`GIT_DIR` set read-only to the worktree's git dir, `E2E_PREBUILT=1 E2E_PORT=5786`);
    - check A's logic in `scratchpad/tools/check_a.py`, with bare-key probes added (finding 3).
  - Not run: the full unit and e2e suites, chromium-dark, the other engines, smoke, the release check and the scorecard script. The builder ran them; this change is in JS that every engine runs the same way.

## Verdict

**Land after fixes.** The change does what the spec says, and the bytes are real. In my fresh build the shared chunk is `chunks/FQEAJQDQ.js`: 15,613 B raw and 5,262 B at gzip 6. That is the builder's figure to the byte. My perf run reads 11.4 kB off every probe page. Button reads 363.8 kB, as the builder's does. No browser chunk reaches `registry.json` or the whole `package.json`. Every server reader still gets its full registry. My own mutation, `registry.json` imported into a single route, was caught by check A.

Two things should change first:

- **The generator depends on its own output** (finding 1). If `listed-items.ts` is missing or will not parse, `bun run build:registry` crashes, and so do `vite dev`, `vite build` and `bun run check`. The one command the ledger rule names cannot repair the file.
- **The Landing notes' kuiper-theme figure is wrong** (finding 2). `025` took nothing off that page. The 596.5 kB reading was a throttled load that stopped before tree-sitter.

I accept the small-change kind. No interface changes for an app, and `registry.json` and `static/r/` stay byte-identical. The one process effect is the new ledger file, which is recorded at landing.

## The spec's checks against evidence

- **A. No browser chunk holds a registry-only value.** Met.
  - EXECUTED: passes on my fresh build, 0 of 412 sentinels over 756 files.
  - The builder saw it fail first (409 of 412 in `1jtC5dVS.js`) and ran two mutations.
  - My mutation build (below) failed it, naming both mutated routes.
- **B. The list is generated, and stays in step.** Met.
  - EXECUTED: passes.
  - It compares byte for byte with `siteItemsModule(registry.json)`. So a skipped `build:registry`, a hand edit or a prettier change fails here, by file.
  - The builder's mutation 3 saw it fail.
- **C. The writer.** Met.
  - EXECUTED: passes.
  - It proves the four fields, the dropped deprecated entry, and that an unchanged file is not rewritten (its mtime is kept).
  - It does not prove that `buildRegistry()` calls the writer. If that call were lost, B would catch it at the next new item, but its message would point the reader at `build:registry`, which would not help. That is acceptable.
- **The bytes.** Met, for transfer. My unthrottled figures equal the builder's "after" column on every probe:

  | Probe | kB | Probe | kB |
  |---|---:|---|---:|
  | `/` | 290.2 | `/components/button/` | 363.8 |
  | `/components/` | 339.2 | `/components/label/` | 323.3 |
  | `/start/` | 290.0 | `/components/code-editor/` | 645.6 |
  | `/brand/` | 275.9 | `/components/chart/` | 469.6 |
  | `/components/sidebar/` | 393.7 | `/changelog/` | 324.1 |
  | **`/components/kuiper-theme/`** | **749.5** | `/brand/downloads/` | 289.0 |

  The LCP medians sit inside the builder's ranges: Button 896 ms, `/components/` 2,428 ms, `/brand/` 824 ms, `/components/kuiper-theme/` 1,316 ms.

## Correctness

**Browser-side code reaches neither `registry.json` nor the whole `package.json`.** READ and EXECUTED.

- `src/` still holds four static imports of `registry.json`:
  - `start/install.ts`, which only `start/+page.server.ts` imports;
  - `start/modes/+page.server.ts`;
  - `start/theme/+page.server.ts`.
- The other readers use `readFileSync`: `component-data.server.ts`, `examples/read-token/data.server.ts`, `(site)/+page.server.ts` and `components/+layout.server.ts`. All of them are server code.
- `site.ts` now reads `{ version }`. The fresh build's chunks hold no `devDependencies` and no `scripts:`.
- The nav, footer, all-pages and prev-next components read `SITEMAP`, which now comes from `LISTED_ITEMS`.
- The command palette imports `doors.ts` and `site.ts`. It fetches `/search.json` the first time it opens (`chrome/search-palette.svelte:34–39`), so the index is not in a chunk.
- The search index is built on the server from `SITEMAP` (`search/sources/pages.ts`). It reads `summary`, which is `description`, and `LISTED_ITEMS` keeps that field. `llms.txt` reads the same field.
- `search.spec.ts`, `nav.spec.ts` and `navigation.spec.ts` pass.

**Server-only importers still get their full data.** READ. Every server caller passes its own parsed array to `listedItems(...)`:

- `component-data.server.ts:65`
- `start/install.ts:16`
- `start/modes/+page.server.ts:10`
- `components/+layout.server.ts:33`

The only callers without an argument are `doors.ts` (the count), `sitemap.ts` and `registry.test.ts`. None of them reads more than the four fields. `svelte-check` is clean. The scripts (`lint-literals.ts`, `thumbnails.ts`) import only `isListed`, and apply it to their own registry.

**`pluto-theme`'s exclusion is right.** READ, at `467a0e8`:

- `sitemap.ts:56` already read `listedItems(registry.items)`, and `doors.ts:35` counted `listedItems()`. Both dropped the alias, so the browser never used its entry: 79 pages, "79 parts".
- The browser's mentions of `pluto-theme` come from `redirects.ts` and `search/aliases.ts`, not from the registry.
- The CLI's index still holds 80 entries (`registry.test.ts`, "index toHaveLength(80)").

**The bootstrap cycle is not sound when the file is bad.** See finding 1.

## Findings

### 1. The generator imports its own output, so the ledger file's repair command cannot repair it (should fix)

**Evidence.** EXECUTED, in the `git archive` copy of `03a0e6b`:

- I deleted `src/lib/site/listed-items.ts` and ran `bun scripts/build-registry.ts`. It exited 1 with `error: Cannot find module './listed-items.ts' from '…/src/lib/site/items.ts'`, and wrote nothing.
- I wrote the file as an unresolved merge (both sides between `<<<<<<<`, `=======` and `>>>>>>>` markers). It exited 1 with `error: Unexpected <<` at `listed-items.ts:1:1`.

READ: the chain is `scripts/build-registry.ts:28` → `items.ts:13` → `listed-items.ts`. `vite.config.ts:6` imports `registry-watch.ts`, which imports `build-registry.ts`. So the same missing or broken file also stops:

- `vite dev`, `vite build` and `bun run build`;
- `bun run check`, because `svelte-check --config ./vite.config.ts` loads the config;
- all of `generated.test.ts`, the token cases too, because it imports `siteItemsModule`.

The spec's "the file must exist … It always does, because it is committed" holds on a fresh clone. It does not hold in the case the ledger rule exists for, a merge conflict that someone resolves badly. "Take either side" works, because either side is valid TypeScript. But the rule's second half, "then `bun run build:registry`", only works if the first half was done exactly right. A generator should be able to rebuild its output from its input alone.

**Fix.**

- Move `isListed` (and `Deprecation`) into a leaf module that imports nothing, for example `src/lib/site/listed.ts`. `items.ts` re-exports both, so no reader changes. `scripts/build-registry.ts` imports from the leaf. `lint-literals.ts` and `thumbnails.ts` may stay as they are, or move too.
- Add one unit case that walks `scripts/build-registry.ts`'s local imports and expects `src/lib/site/listed-items.ts` not to be among them. `Bun.Transpiler#scanImports` does this, and so does `thumbnail-hash.ts`'s `localGraph`.
- See it fail first, on today's tree.
- Then the deleted-file experiment above should end with the file rewritten.

### 2. The Landing notes misattribute the kuiper-theme figure: `025` did not take 153 kB off the page (should fix)

The notes say: "on `467a0e8` … every probe's transfer reads as in the after column, but `/components/kuiper-theme/`, 596.5 kB: `025` took 153 kB off that page, not this change."

**Evidence.**

- READ: between `506cfc1` and `467a0e8`, `025` changed one file under `src/`, `src/lib/site/thumbnails/manifest.json`, and that file holds hashes only. It did not touch `vite.config.ts`. Its `package.json` change is the Bun pin and a `cost` script; its `tsconfig.json` change is two excludes. Nothing it changed reaches a page.
- EXECUTED: my perf run on `03a0e6b`, which sits on `467a0e8` and so includes `025`, reads **749.5 kB with 2 `.wasm`**. That held on the unthrottled load and on all three throttled loads (`perf /components/kuiper-theme/: 749.5, 749.5, 749.5; wasm 2, 2, 2`). That is the notes' own "after" figure.
- 749.5 − 596.5 = 153.0 kB. That is the tree-sitter runtime and the Python grammar: 150.5 kB per `024d`, plus their requests.
- The 596.5 reading is the case `024`'s change review recorded as finding 2: 607 kB with 0 `.wasm`. Under the throttle, `networkidle` fires before the ink-surface editor asks for its highlighter. The notes' own load average for that run was 20 to 32.

Nothing else is going on. `024d`'s 462.1 kB is measured against the same 760.9 kB page, before `024b`, so the two changes stack: about 450 kB once both land (INFERRED).

**Fix.**

- Replace the sentence with: "`/components/kuiper-theme/` reads 749.5 kB unthrottled with 2 `.wasm`, as after. One throttled reading of 596.5 kB stopped before tree-sitter (0 `.wasm`; `024`'s review, finding 2). `025` changed no page."
- In the perf table, say which figure each column is. The transfer tests gate on the unthrottled load.

### 3. Check A's key sentinels depend on how the bundler writes JSON; use the bare key names (fix on the branch, small)

**Evidence.** EXECUTED, in the mutation build:

- `(site)/changelog/+page.svelte` imported `registry.json` and rendered `registry.items.length`. The real check A failed: `nodes/40.C_wLu8Y1.js: 409 of 412`. Those are all 365 paths, all 41 hashes, and the unquoted keys `registryDependencies:`, `devDependencies:` and `cssVars:`.
- `(site)/brand/+page.svelte` imported the CLI's index, `static/r/styles/maia/index.json`, and rendered three titles. Option (d) in the memo is a plausible future "slimming". Check A failed: `nodes/30.0JLQ_4qf.js: 43 of 412`. Those are 41 hashes and the **quoted** forms `"registryDependencies"` and `"devDependencies"`, with no unquoted form and no path.
- So one bundler writes object keys both ways, depending on the JSON's shape. Each form caught one mutation.
- A third form is possible: Vite's `json.stringify` writes a large file as `JSON.parse("…")` with escaped quotes (`\"registryDependencies\"`), and neither sentinel would match it.
- The bare words `registryDependencies`, `devDependencies` and `cssVars` occur in **0 of 756** files of the clean build. They would catch every form.

File paths and stock hashes do not depend on the form. The main failure, any import of `registry.json`, always carries all 365 paths, because tree-shaking stops at root fields (memo §5). So check A is robust for the defect it was written for.

It is blind to the fields that have no sentinel: `author`, `type`, `meta.since`, `meta.modes` and the theme item's `css`. A later slim module that grows `author` or `css` would pass. The one `author` value, `Pluto Systems <https://github.com/plutosystemsco/design-system>`, occurs in 0 built files today.

**Fix.**

- Make the three key sentinels the bare names. This loses nothing and drops three entries.
- Add the `author` value (or values) as a sentinel.
- In the test's comment, say that the scan reads only `_app/immutable/**/*.js`. Data that a server load sends through the HTML or `__data.json` is outside it. The components index's `meta.stock` is the known case (spec, "For later").
- Say in the failure message that a hard-coded registry file path in a page's source also trips the check. A docs page that quotes `src/lib/registry/ui/button/button.svelte` in a client component would read as a registry leak.

### 4. `listedItems<T>()` with no argument lets a caller type away the narrowing (fix on the branch, small)

**Evidence.** READ, `items.ts:29–33`. The signature is `listedItems<T extends object = ListedItem>(items: readonly T[] = LISTED_ITEMS as unknown as readonly T[])`. So `listedItems<{ files: ItemFile[] }>()` type-checks, and at run time returns objects with no `files`.

Before this change the same cast existed, but the data was all there. Now the data is truly missing. The memo's "its type is the guard" holds only while nobody names `T`.

**Fix.** Use overloads. No caller changes, as the call sites above show.

```ts
export function listedItems(): ListedItem[];
export function listedItems<T extends object>(items: readonly T[]): T[];
```

### 5. The ledger file is formatted and stable (note)

- **Formatted.** EXECUTED:
  - `prettier --check` passes on `listed-items.ts`, which `.prettierignore` does not exclude, so `bun run lint` covers it;
  - B asserts that the file equals prettier's output;
  - the config is resolved for the repository's own path, so a temporary root formats the same way.
- **Stable.** EXECUTED:
  - the e2e web server's `bun run build` rewrote `static/r/` at 03:04:58, but left `listed-items.ts` at its 02:35 mtime, and `git status` stayed clean;
  - in the `git archive` copy, a full `bun run build` left the file byte-identical (`cmp`).
- **Deterministic.** READ: registry order, `JSON.stringify` and a pinned prettier.
- **The conflict rule.** "Take either side, then `bun run build:registry`" is sound once finding 1 is fixed. Until then, the rule should say to take one side whole (`git checkout --ours` or `--theirs` on the file) before running the build.
- **The dev loop does not loop.** READ: `registry-watch.ts` does not watch `src/lib/site/`, and the writer skips an unchanged file.

### 6. Smaller notes

- **The alias test.** `registry.test.ts`'s "020 test 5: listedItems() returns the 79 items, without pluto-theme" now reads a list the generator has already filtered. It no longer shows `listedItems` dropping a deprecated entry. C does show the generator dropping one, and `withListedItems` still runs on every full registry in the e2e and unit files. A one-line comment in the test would say so. No change is needed.
- **`--out static`.** An explicit `--out static` skips writing the list, because the condition reads whether the flag was given, not where it points. This matches the spec's wording. Nobody passes it today.
- **For later, not this change.** `start/install.ts` holds the whole registry. It is safe only because no browser module imports it, and only check A would notice if one did. Renaming it `install.server.ts` would add SvelteKit's own server-only guard, which fails the build at the import (memo §6).

## The scorecard

READ: the builder added one row. Button went from 375 to 364 kB, with LCP 892 ms. Row 8 holds at 4, and rows 6 and 7 hold. EXECUTED: my perf run reads Button at 363.8 kB unthrottled, with a throttled LCP median of 896 ms. **No row moves.** Row 8's transfer was already under its 500 kB line.

## For the design lead, at landing

- Findings 1 and 2 on the branch. 3 and 4 too, if the builder is still in it.
- Add `src/lib/site/listed-items.ts` to `roadmap.md` §2's ledger list, with the conflict rule (finding 5).
- `tests/fixtures/pluto-allowed.json` moved by one (deviation 1). It moves again whenever a listed description names the company.
