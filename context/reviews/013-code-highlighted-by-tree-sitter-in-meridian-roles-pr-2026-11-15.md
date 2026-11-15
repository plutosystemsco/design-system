# Review of 013 — Code highlighted by tree-sitter, in Meridian's roles (the built change)

Reviews [`specifications/013-code-highlighted-by-tree-sitter-in-meridian-roles.md`](../specifications/013-code-highlighted-by-tree-sitter-in-meridian-roles.md). This reviewer wrote neither the specification nor the code. A separate reviewer reviewed the specification, [`013-…-spec-2026-11-14.md`](./013-code-highlighted-by-tree-sitter-in-meridian-roles-spec-2026-11-14.md). This reviewer reviewed `014`, on which 013 builds.

- **Date:** 2026-11-15
- **Status:** in review; lands, with six Low write-ins
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the working tree on `b91b79d` (`014`, branch `release/0.12.0`), uncommitted. 013's part:
  - the tracked diff, 57 files, +3213 −1980;
  - the untracked `scripts/convert-reference.ts`, `src/lib/registry/lib/highlight/` (4 modules and 24 `.scm` queries), `code-editor-highlighting.ts`, `/view/code-agreement/`, `tests/fixtures/` (the specimens, `roles.json`, `roles-hand.json`, `query-lock.json`, the `kit3-node` app), six test helpers and seven new unit tests.

  Not 013's, and not reviewed: the specifications and reviews of `015`, `016` and `017`; `decisions.md`, read as rulings, chiefly "After the `013` build's checkpoint 1" and "checkpoint 2" (2026-11-15) and "A yellower yellow" (2026-11-14); and the untracked research.
- **Re-ran:** Bun 1.4.4, on this machine, 2026-11-15. Nothing in the repository was written but this file. The design lead's dev server on 5199 was not touched. Scratch work is in `…/scratchpad/review-013-pr/`.
  - `bun run test:unit` → exit 0: **1,019 pass, 0 fail**, 7,024 `expect()` calls, 18 files. The timings helper printed: first pass 0.50 s, warm 13.0 ms.
  - `bun run check` → exit 0: `COMPLETED 1826 FILES 0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS`.
  - `bun run lint` → exit 0, "All matched files use Prettier code style!".
  - `bun scripts/lint-literals.ts` → exit 0: "0 literal(s) in registry item files; 1 allowance(s)" (L24).
  - `bun run test:e2e`, the full suite in both projects → exit 0: **2,004 passed, 4 skipped, 0 failed**, 3.5 m. It includes `axe` 542, `keyboard` 238 and `code` 72. The 4 skipped are `011`'s light-only checks, skipped by design.
    - E7 printed in light: first colour 42 ms; Python p95 9.40 ms, max 28.90 ms; Ruby p95 7.10 ms; Markdown p95 1.60 ms; next frame 18.5 ms p95.
    - E7 printed in dark: 41 ms; 9.00 ms, max 29.50 ms; 7.20 ms; 1.60 ms; next frame 17.9 ms p95.
  - `bun run test:smoke` → exit 0: **122 pass, 0 fail**, 6,694 `expect()` calls, 7 files, 144 s.
  - **The build is idempotent.** `git diff --stat` was the same before the e2e run (whose `bun run build` runs `build:tokens` and `build:registry`), after it, and after smoke.
  - **The snapshots.** `static/v0.11.0/` → 0 differences from its tag, 0 untracked. `static/r` and `static/v0.12.0/r` are identical (`diff -rq`), 76 files each, for the 75 items of `registry.json`.
  - **`bun install --frozen-lockfile --ignore-scripts`**, in a scratch copy of `package.json`, `bun.lock` and `bunfig.toml` → exit 0, 284 packages. It reported "Blocked 19 postinstalls", the grammars' `node-gyp-build`, as decision 2 expects.
  - **The query lock, re-derived** (Python `hashlib`, outside the test): the SHA-256 of each of the 24 files under `highlight/queries/` equals `query-lock.json`'s. None differs, and none is missing or extra. `changes` is empty.
  - **Accuracy, both sets**, `bun test tests/unit/highlight-accuracy.test.ts` → 7 pass.
    - **Workbench 98.6%:** typescript 100.0, tsx 100.0, python 100.0, rust 99.6, go 97.5, java 99.5, csharp 100.0, ruby 99.5, svelte 99.5, html 99.4, css 98.9, sql 85.8, bash 99.2, yaml 100.0, json 98.8, toml 100.0, markdown 99.4, diff 90.6.
    - **Held-out 97.7%:** python 100.0, javascript 100.0, typescript 98.0, bash 97.1, sql 88.5, go 98.4, rust 98.5, java 97.9, csharp 98.0, ruby 98.5.

    The held-out describe block runs unconditionally.
  - `PLUTO_HELDOUT` under `src/`, `tests/`, `scripts/`, `package.json` and `bunfig.toml` → 0 reads. `src/lib/workbench/`, `src/routes/(workbench)/` and `tests/unit/workbench.test.ts` are absent.
  - **The printed figures, re-run:**
    - `queries.test.ts`: 480 patterns, 18 equal a stock pattern (3.8%), all trivial, 52 stock files compared.
    - `contrast.test.ts`: dark number 10.41 on the active line and 11.66 on graphite; dark comment 6.55 and 7.33; closest pairs light constant–special ΔE 9.2 and dark function–type 5.2; number–constant light 10.8, deuteranopia 5.4, protanopia 0.5; dark 11.0, 5.1, 9.5.
    - `convert-reference.test.ts`: 309 hand entries.
    - `highlight-session.test.ts`: the stream at p95 3.17 ms.
  - **Read:**
    - `scripts/build-registry.ts`, and the `dependencies` and `devDependencies` of all 75 built items;
    - `code-editor-highlighting.ts`, `code-editor-python.ts`, `code-languages.ts`, `use-highlighted-code.svelte.ts`, `highlighter.ts`, and the session and `ranges()` code of `highlight/tree-sitter.ts` and `highlight/shiki.ts`;
    - `CHANGELOG.md`; the registry descriptions; `tests/e2e/code.spec.ts` E7 and the accuracy, query, code-items and generated tests.

    I ran the registry rule's name parser on five specs.

## Acceptance criteria against evidence

1. **Install** — met. EXECUTED: the frozen install exits 0. `deps.test.ts` passes: 20 packages (18 carets; `~1.0.2` and `~1.1.0` for Svelte and Kotlin), `shiki` `^4.5.0`, and `web-tree-sitter` `^0.27.2`.
2. **Checks** — met. EXECUTED (above). `literals.test.ts` holds L19 as `014` decision 9 wrote it, and reads `.scm` files.
3. **Tokens and contrast** — met. EXECUTED:
   - `tokens.test.ts`: 60 names, 46 primitives, 12 `syntax-*` roles, 16 map entries ending `syntax-ground` and `syntax-active-line`.
   - `contrast.test.ts`: 70 AA rows; the range, cap and named rows; the CVD figures printed (above).
   - `generated.test.ts`: `REMOVED_013` and `MOVED_013`.
   - READ: the token diff matches decision 11's table, the owner's later yellow included (`#6C5A00` and `#E5CD72`).
4. **Accuracy, workbench** — met. EXECUTED: 98.6% against 94.0. The 15 tree-sitter languages are each at 97.5 or more against 90.0. Markdown 99.4 and diff 90.6 against 90.0; SQL 85.8 against 75.0. All 18 SHA-256s match.
5. **Accuracy, held-out; the lock** — met. EXECUTED: 97.7% against 92.0, with each tree-sitter language at 97.1 or more. 0 `PLUTO_HELDOUT` reads. The lock is re-derived and matches. The Landing notes hold the design lead's first figure. The lock's own `workbench` figure is stale (finding 2).
6. **Prerender agrees with the browser** — met. EXECUTED: C5 in both projects, the late-grammar run included.
7. **The block agrees with the editor** — met. EXECUTED: E6 in both projects.
8. **Incremental is exact** — met. EXECUTED: `highlight-session.test.ts` passes, with 2,000 random edits, the three widened cases, the Shiki guard and the late fence. The Landing notes record that the random-edit groups passed first time and were mutation-checked instead. A wrong `Edit` offset did not fail them, because the re-parse still matched. That is honest, and the window and whole-document comparisons still guard the colour.
9. **All 26 languages** — met. EXECUTED: `highlight.test.ts` passes, and so do S2 and L1 in both projects.
10. **The rulings and edges** — met. EXECUTED: `highlight.test.ts` passes.
11. **The queries are ours** — met. EXECUTED: 27 compiles, 0 runs of 6, 3.8% equal and all trivial. The studied stock files are listed: none read, 52 compared mechanically. Each file opens with its required header (the test's header check).
12. **No engine where none is needed** — met. EXECUTED: C1 in both projects. `code-items.test.ts` finds 0 static imports of `web-tree-sitter`, `shiki` or `node:`. READ: every engine import in `highlight/` is `await import()`.
13. **No code on light `muted`** — met. EXECUTED: `code-items.test.ts`, and the scripts-off check in both projects.
14. **axe** — met. EXECUTED: 542 scans with 0 violations, `/view/code-agreement/` among them.
15. **Keyboard** — met. EXECUTED: `keyboard.spec.ts` 238 passes; E1, E2 and E4 pass.
16. **The roles in the browser** — met. EXECUTED: C2, E3, I1 and I4 in both projects, and `code-items.test.ts`.
    - The inline rule is keyed by `014`'s built selector `code:not(pre code, :is(h1, …, h6) code)` and holds `text-code-text`.
    - `install-command.svelte` reads `text-code-text`.
    - READ: `code-foreground` appears nowhere under `src/`, `static/r/` or `registry.json`.
17. **The reference conversion** — met. EXECUTED: `convert-reference.test.ts` passes. The fixture is re-run byte-identical, 309 hand entries, and 0 known-loss rows. The converter was corrected at checkpoint 1 (TOML brackets, Ruby `Float()`), with both hashes recorded.
18. **Sizes** — met, in C6 of the browser suite, not in `registry.test.ts`. That is a recorded deviation, and sound, because only the browser suite builds the site's client. EXECUTED: C6 passes in both projects. The Landing notes' runtime figure is 103.2 kB against 125.
19. **Times** — met. EXECUTED:
    - first pass 0.50 s and warm 13.0 ms, against 1.5 s and 50 ms;
    - the stream at p95 3.17 ms, against 4;
    - E7: first colour 41 to 42 ms, against 250;
    - Python p95 9.0 to 9.4 ms against 12, max 29.5 against 50;
    - Ruby 7.2 and Markdown 1.6, against 16.

    The 12 ms bar is checkpoint 2's reset. `code.spec.ts:1437` asserts 12, and its message prints the measured p95. Where the reset is recorded is finding 4.
20. **Registry** — met. EXECUTED:
    - `registry.test.ts`: 75 items, and `highlighter` with 29 files, 21 `dependencies`, no `devDependencies` and no `meta.stock`;
    - `code-editor` names `highlighter`, not `@lezer/highlight`;
    - the build is byte-identical (above).

    READ: the `highlighter` description is rewritten, as checkpoint 1 asked.
21. **An installed app, offline** — met. EXECUTED: `code-add.test.ts` within smoke's 122 passes. That covers `kit3`, `kit2`, `kit3-node`, the upgrade app, the stopped server, the 21 `.wasm` files with 2 requested, the production install, and the fallback with Python deleted.
22. **The workbench is gone, its fixtures kept** — met. EXECUTED: the paths are absent, the 18 SHA-256s match, and `colour.test.ts` passes. READ: `deltaE`, `mix` and `contrastRatio` are defined only in `scripts/contrast.ts` among the code tools. The identity exhibit's `light-case.svelte` keeps a local `mix` of its own, which predates 013 and is no copy of the tool.
23. **Suites, documents, checkpoints and walk** — met. EXECUTED: unit, e2e and smoke as above. `package.json` reads 0.12.0, `static/v0.11.0/` matches its tag, and `static/v0.12.0/` is the output.
    - READ: the one 0.12.0 entry has one bullet per item; `pluto-theme`'s is marked **interface change** and lists every removed name (finding 5 for its wording).
    - READ: the Landing notes record both checkpoints, decision 8's guard, the re-derived counts, and the builder's walk (121 paths, 242 loads, 0 errors).
24. **Released** — not yet, and not this review's to meet: the tag follows the change reviews of `014`, 013, `016`, `015` and `017`.

## The points asked

- **The query hashes:** 24 of 24 equal the lock (EXECUTED, outside the test).
- **Both accuracy sets:** 98.6% and 97.7% (EXECUTED). Held-out runs every time.
- **`PLUTO_HELDOUT`:** 0 reads. The workbench is fully gone: no route, no library, no test. The only mentions left are comments, the fixtures' provenance, and the specimens' file (finding 3).
- **The devDependency rule** (`build-registry.ts:74–94`) is correct for every item today.
  - Only `highlighter` has `dependencies`, so the rule changes that one item and leaves the other 74 as the CLI wrote them.
  - Its name parser is wrong for a spec without a version (finding 1). No item has one now.
  - It has no unit test of its own; only `registry.test.ts`'s "no `devDependencies`" on `highlighter` covers it.
- **`pythonSetup`:** its name and return type hold. It pairs Lezer's `pythonLanguage` with `codeHighlighting("python")` and drops `pythonLanguageConfigured`, `pythonRoles` and `codeHighlight`. The changelog's `code-editor` bullet marks it **interface change** and gives the replacement for each removed export, as checkpoint 2 asked.
  - One visible change goes unsaid: until the highlighter loads, a mounted editor shows plain text (finding 6).
- **The editor's view plugin** (`code-editor-highlighting.ts`): sound.
  - One `session.update` per view update, with `update.changes` composed across the committed transactions, so one parse per update.
  - Marks are built from `view.visibleRanges` only, from `ranges(from, to)`. That function clips to the window and returns sorted, non-overlapping ranges (`paintRanges`), so `RangeSetBuilder`'s ordering holds.
  - `onChange` fires only after a promise (`#load`'s `.then`), so the plugin's `dispatch({})` can never run inside an update.
  - A session opened late is opened on the current document. `destroy` disposes the session.
  - The cost of note: `update.state.doc.toString()` builds the whole text on every keystroke. It is inside the measured 9 to 10 ms.
- **`static/r` and `static/v0.12.0`:** regenerated, identical to each other, and stable under a rebuild.
- **E7 at 12 ms:** asserted, and met with margin (9.0 to 9.4). Recorded in the Landing notes' "Checkpoint 2" bullet, but not in their "Deviations" list (finding 4).
  - The Event Timing count printed beside it, 185 and 200 of 200 keydown events over 16 ms, is not a defect. Event Timing's duration runs to the next paint, which in headless Chromium is about one 16.7 ms frame. The in-page cost and the 50 ms max are the guards.

## Findings, most severe first

None is High or Medium. Each is a write-in, with its fix.

1. **The devDependency rule's name parser drops a character from a bare name** (`scripts/build-registry.ts:76`) — `name = spec.slice(0, spec.lastIndexOf("@") || undefined)`. For an unscoped spec with no version, `lastIndexOf` returns −1, which is truthy, so the slice drops the last character.
   Failure (EXECUTED): `"web-tree-sitter"` → `"web-tree-sitte"` and `"shiki"` → `"shik"`. A versioned or scoped spec parses correctly. With a bare name on either side the pair no longer matches, so the devDependency stays. A later production install would lose the package, the very failure the rule exists to prevent. No item has a bare spec today.
   Fix: `const at = spec.lastIndexOf("@"); return at > 0 ? spec.slice(0, at) : spec;`. Add a unit test of `dropShadowedDevDependencies` on a fixture folder, with bare, versioned and scoped specs.
2. **The lock's figures are stale** (`tests/fixtures/highlight/query-lock.json`) — it records `workbench.overall` 98.4, the figure at locking. The fixture correction at checkpoint 1 moved it to 98.6 with no query change, so `changes` is rightly empty, but a reader takes the stale figure as current.
   Fix: either add `"fixtureCorrected": { "roles.json": "a9eab0f6…", "workbench": 98.6, "heldout": 97.7 }`, or name the figures "at lock time".
3. **New item comments cite internal documents and the removed workbench.**
   - `highlight/shiki.ts` ("The fallback (013 decisions 4 and 14)", "the rules the workbench and the accuracy memo found", "The workbench's three rules") and six other new `(013 decision N)` citations ship in `static/r/`.
   - The design lead's call of 2026-11-14 ("No published item file cites an internal document, from 0.12.0") gives the rewording to `015`, so this is not 013's defect. But 013 adds seven citations to the list, and "the workbench" names a tool an installer never saw.

   Fix: reword the seven now ("the owner's ruling", "measured against a reference", no numbers), or name them in the Landing notes for `015`'s enumeration.
4. **E7's reset is in the Landing notes, but not in their list of deviations** — `decisions.md` (checkpoint 2) says it is "Recorded as a deviation in 013's Landing notes". It appears in the "Checkpoint 2" bullet. Decision 20's table and criterion 19 were edited in place to 12 ms, each with "(reset at checkpoint 2, see decisions.md)".
   Fix: add a line to "Deviations": "E7's Python bar, 8 → 12 ms p95 (checkpoint 2); decision 20 and criterion 19 read 12 ms since."
5. **The `pluto-theme` bullet repeats itself at the seam** (`CHANGELOG.md`) — "The code ground and the active line are as the sentences that follow set them. The code ground and the active line have theme roles of their own…". The first sentence is a joint left over from merging the two parts.
   Fix: delete it. The next sentence says it.
6. **The editor's first colour now arrives after a fetch, and the changelog does not say so** (`CHANGELOG.md`, `code-editor`) — before, Lezer coloured the editor synchronously on mount. Now `codeHighlighting` shows plain text until the runtime and the grammar load. That is about 115 kB plus the grammar, once per page; E7 measures 41 ms after a warm load. The prerendered fallback is plain too, so the page stays plain a moment longer.
   Fix: add to the `code-editor` bullet: "Once mounted, it shows plain text until the highlighter has loaded its language, as the prerendered fallback does; then it colours."

## Constitution checks

- §4.1 source, not a package: met. The engine is an item's own source, and the grammars are named dependencies. Criterion 21 proves the installed app builds and prerenders with this repository's server stopped.
- §4.3 tokens are the one source: met. The literal lint reports 0 violations over the item files, `.scm` included. Every Shiki theme colour is `var(--code-<role>)`. The editor's marks are role classes.
- §4.4 accessible by default: met.
  - axe passes 542 scans in both themes, and the keyboard walk 238.
  - The 70 AA rows pass, comments included.
  - The light number–constant pair measures ΔE 0.5 under protanopia. The changelog says so, and the two are told by shape (digits against words). Syntax colour is not the only carrier of meaning (WCAG 1.4.1), so this is no failure.
- §4.5 every input pinned: met. `bun.lock` resolves every new package. A frozen install exits 0.
- §4.6 dependencies named and pinned: met. `highlighter` names its 21 runtime `dependencies`. Decision 23 records the grammars' `node-gyp-build` install scripts and the Kotlin package's stray `npm-check-updates`.
- §6 never break an installed app silently: met.
  - Four items are marked **interface change**: `pluto-theme`, `code-block`, `code-editor` and `highlighter`. `code-languages` and `use-highlighted-code` change no export.
  - Every removed `--code-*`, `syntax-*` and `text-code-*` name is listed, with the lines to delete by hand.
  - The editor's removed exports have replacements.
  - The `highlighter` bullet gives the disk and bundle cost and `wasm-unsafe-eval`.
  - Findings 5 and 6 are wording.
- §6 never copy prior art: met as far as a test can show. No stock query file was read (Landing notes). 0 shared runs. The 18 equal patterns are trivial.

## Regressions looked for

- **`014`'s ground and edge:** C2, C3, E3, G1 to G4, I1 to I5 and S1 pass in both projects, reading the new colours.
- **The compositions:** `compositions`, `on-brand` and `expressive` pass. `stage-card`, `live-console` and `chat` change no file and fetch the engine in the browser, as decision 20 states.
- **The snapshots:** `static/v0.11.0/` is untouched.

## Verdict

Lands: every criterion 013 owns (1 to 23) is met on evidence I re-ran, and the six findings are Low write-ins; criterion 24 is the release's.

## Disposition

<to be filled in after the builder and the author answer>
