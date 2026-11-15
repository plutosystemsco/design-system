# Review of 013 — Code highlighted by tree-sitter, in Meridian's roles

Reviews [`specifications/013-code-highlighted-by-tree-sitter-in-meridian-roles.md`](../specifications/013-code-highlighted-by-tree-sitter-in-meridian-roles.md).

- **Date:** 2026-11-14
- **Status:** dispositioned; fit to build (2026-11-14). All 39 findings are closed after the confirmation of 29 to 33. Two write-ins are recorded under "Confirmation of 29 to 33".
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the specification as drafted (691 lines, untracked). It was checked against the constitution; `decisions.md`, the six entries of 2026-11-14; the accuracy memo and the reference; Meridian, the owner's guide; `meridian-and-tombaugh.json` (candidate `tombaugh`); the two white-ground memos (`014` is not in the tree, so its dependency is reviewed as stated); and the code in the working tree over `8cb06ba`.
- **Re-ran:** nothing in this repository was written except this file. Scratch work was kept in the session's scratch folder (`review-013/`).
  - **Tombaugh's figures** (EXECUTED, `bun`, this repository's `palette.ts` imported by path). Every ratio of decision 11's table reproduces to two decimals: light on white, on `#F3F0E8` and on `wash`; dark on `#2C2821`, `#221F19` and graphite `#16140F`. On `wash`: number 4.41, comment 4.40, string 4.80, constant 4.59. The lightness bands reproduce: light 0.472 to 0.521 with navy 0.371; dark 0.757 to 0.798. ΔE: dark function–keyword 7.122, function–type 5.209, constant–special 6.825; number–constant 7.809 light and 8.509 dark. Dark special on its ground is 6.50, exactly at the range floor.
  - **Decision 11 against the research** (READ). All twenty hex values equal the `tombaugh` swatches. Numbers take `tombaugh-yellow` and constants `tombaugh-orange`, as the owner ruled.
  - **The token file** (EXECUTED, Python over `tokens/pluto.tokens.json`). **35 primitives**, not 34. 53 names per theme. The nine removed primitives are each named once outside `primitives`, by a `syntax-*` role, as decision 12 says. The `code` map holds 21 entries.
  - **npm metadata** (EXECUTED, `npm view`). All 20 packages exist at decision 3's versions, every one MIT. `web-tree-sitter` exports `./web-tree-sitter.wasm`. The Kotlin grammar depends on `npm-check-updates` and peers `tree-sitter` `^0.22.4`; Python's peers `^0.25.0`. Every grammar's `install` script is `node-gyp-build`.
  - **A scratch install** (EXECUTED, Bun 1.4.4, `--ignore-scripts`) of `web-tree-sitter` 0.27.2 and the Python, JSON, C#, Kotlin, TypeScript and Svelte grammars. Raw and gzip-9 sizes: runtime WASM 210,688 / 83,065; runtime JS 155,405 / 31,810; Python 457,883 / 64,341; JSON 5,596 / 2,208; C# 5,350,581 / 315,172; Kotlin 3,441,042 / 294,345. All match decision 3. The C# package alone is 65 MB on disk.
  - **The runtime** (EXECUTED). The exports are `Parser`, `Language`, `Query`, `Tree`, `Edit`, `Node` and others. In `x = "é😀x"` the string node runs from 4 to 10, and its column is 4 to 10, in UTF-16 code units. `Query.captures(node, { startIndex, endIndex })` limits a query to a range. An unknown predicate (`#foo?`) **compiles** and is listed in `predicates`, so decision 2's "an error in our tests" must be the test's own check. `(#is-not? local)` compiles as a refuted property.
  - **Query compatibility** (EXECUTED). `(type_assertion)` compiles against `tree-sitter-typescript.wasm` and **fails against `tree-sitter-tsx.wasm`** ("Bad node name"). `(jsx_element)` does the reverse. Svelte parses `{#each items as item (item.id)}` into `identifier: (svelte_raw_text) parameter: (svelte_raw_text)`.
  - **The reference** (EXECUTED, the reference joined to `specimens.ts` and `code-samples.ts`). Its slots per language, and the text of chosen spans:
    - HTML `property` holds `every` and `board`, the keys of an inline script's object.
    - Svelte `property` holds `station` and `opensAt` (script fields) and `display`, `gap` and `font-weight` (CSS properties) beside the attributes.
    - TSX `property` holds `name`, `health` and `children` (interface fields) beside JSX attributes.
    - YAML `property` holds `&defaults` and `*defaults` beside the keys.
    - Held-out JavaScript holds 28 characters of `property`. Bash holds 106 (workbench) and 37 (held-out).
    - HTML's `doctype` is `keyword`.
    - Held-out C# labels `Console` in `Console.WriteLine(...)` as `type`.
    - Both Markdown texts hold a fenced block: the specimen a `bash` fence, the gallery sample a `python` fence.
  - **The CLI** (READ, `node_modules/shadcn-svelte/dist/index.mjs`, 1.7.1). A file's `target` resolves against the type's path (`registry:lib` → `resolvedPaths.lib`), as decision 5 says. `cssVars` are merged into `:root` and `.dark`, overwriting a name that exists. A name the new theme lacks is never removed. `devDependencies` are installed as such.
  - **Shiki 4.5.0** (READ, `@shikijs/primitive` and `@shikijs/vscode-textmate` type files). `GrammarState` has no `equals`. Its stack is reached through `getInternalStack()`, marked `@internal`. `StateStack.equals` is public in vscode-textmate.
  - **The code** (READ):
    - `code-editor-theme.ts:18,27`: `color` and `caretColor` are `var(--code-foreground)`.
    - `code-block.svelte:13`: the default variant is `text-foreground`.
    - `code-editor.svelte:163`: the root is `bg-muted`.
    - `code-languages.ts:3,98`: imports and returns `pythonLanguageConfigured`. It returns `description.load()` whole.
    - `use-highlighted-code.svelte.ts`: freezes complete lines and re-highlights the last.
    - `chat-text.svelte:25`: an opener is exactly three backticks (`^```([^`]*)$`).
    - `registry.json`: `highlighter` carries `meta.stock`. `code-languages` declares `devDependencies`.
    - Tests: `generated.test.ts:815–850` (the v0.8.0 custom-properties guard), `contrast.test.ts:407–500`, `tokens.test.ts:20–30, 387`, `keyboard.spec.ts:282–287`, `literals.test.ts:246–305`.

## Acceptance criteria against evidence

1. **Install, 20 packages, 18 carets and 2 tildes:** measurable. The versions exist (EXECUTED).
2. **Checks and L19:** measurable (READ, `literals.test.ts:246–305` holds L19's samples).
3. **Tokens and contrast:** not met as written. "45 primitives" should be 46 (finding 7). "The 28 light ones" should be 42 (finding 7). The ratios themselves reproduce (EXECUTED). Every count depends on what `014` adds to the token file (finding 7).
4. **Accuracy, workbench:** measurable. The bars rest on a measurement of a different query set (finding 13). The fixture's labels have defects (findings 10, 11).
5. **Accuracy, held-out:** measurable. Its honesty rests on the builder's discipline alone (finding 12). One held-out label moves toward the highlighter (finding 11).
6. **Prerender agrees with the browser:** not reachable for Markdown under decision 15's synchronous interface (finding 2).
7. **Block agrees with editor:** measurable, but the "every line in view" setup hides the windowing faults it should catch (finding 5).
8. **Incremental is exact:** measurable. It does not name the languages it runs on (finding 5).
9. **All 26 languages:** measurable (INFERRED).
10. **The rulings and Meridian's cases:** "the 12 Meridian cases" counts 12 or 13 from decision 21's list (finding 7).
11. **The queries are ours:** measurable. "Against their pinned grammars" does not say which grammar a shared file meets (finding 14).
12. **No engine where none is needed:** measurable. It depends on an import graph the specification does not fix (finding 24).
13. **axe:** measurable. It is the only check on code that sits on a light `muted` (finding 18).
14. **Keyboard at 0.11.0's counts:** measurable. C5's second gallery and E6's specimen editor are new page content; say whether they add stops (finding 15).
15. **The roles in the browser:** measurable. As drafted, the body would compute the page's `foreground`, not `--code-text`, and nothing checks it (finding 1).
16. **The reference conversion:** not sufficient. "19 of 19 old slots covered" passes while whole (language, slot) pairs have no rule (finding 10).
17. **The workbench:** measurable (READ).
18. **Sizes:** "21 of 21 grammar assets" should be 20 WASM files (finding 7). The unit, KB or KiB, is unstated (finding 26).
19. **Times:** the editor's p95 of 8 ms "transaction to paint", timed to the next animation frame, cannot be met by any build (finding 9). "A fresh process" inside `bun test` is unstated (finding 26).
20. **Registry:** measurable (READ).
21. **An installed app, offline:** "the client build holds one `.wasm` per grammar its live block uses and no others" cannot be met. Vite emits every `?url` import (finding 8).
22. **Test files:** not met as written. Tests the specification does not list must change their expectations (finding 15).
23. **Release, checkpoints, walk:** measurable. The version is in question (finding 17).
24. **Released:** measurable.

## Findings, most severe first

1. **High — The body colour never reaches code, and the editor loses its text colour** (`013:198`, `013:421`, `013:445`, `013:463`).
   Decision 7 says the body is Meridian's ink, `--code-text`, "not the page's `foreground`". Decision 12 removes `--code-foreground`. But no decision moves any surface onto `--code-text`. `code-block.svelte:13` draws the body with `text-foreground`. `code-editor-theme.ts:18,27` sets `color` and `caretColor` to `var(--code-foreground)`. Decision 16 says "`codeTheme`, the chrome, is unchanged".
   Failure: in a block, every body token (most of each screen, by Meridian's rule 1) renders the page's `ink` `#0B0F17`, not `#25292F`. In dark it renders `paper`, not `#D9DFE8`. In the editor, `var(--code-foreground)` is undefined, so text and caret inherit whatever colour surrounds the editor. The contrast rows test a `text` colour no surface shows, so criterion 3 passes on a wrong build. C2 never reads the body.
   Fix: decision 15 says `code-block`'s default variant becomes `text-code-text`. Decision 16 says `codeTheme`'s `color` and `caretColor` become `var(--code-text)`. Decision 1 lists the other users: `pluto-theme/+page.svelte` (`text-code-foreground`) and the workbench's `code-pane.svelte`. The changelog's `code-block` line says the body colour changes. C2 adds: a body token, and the editor's `.cm-content`, compute `--code-text` in both themes.

2. **High — A synchronous `highlight(code)` cannot colour a Markdown fence the same way static and live** (`013:396–399`, `013:410–411`, `013:660`).
   A fence is coloured in its own language "through the same `loadHighlighter`". That load is asynchronous, and a fence may name any of the 26 languages. But `Highlighter.highlight(code)` and `HighlightSession` are synchronous. `HighlightSession` has no way to tell its reader that a grammar has arrived.
   Failure: the gallery's Markdown sample holds a `python` fence; the workbench's Markdown specimen holds a `bash` fence (EXECUTED). `highlightCode` can await the fence grammar, so the prerendered block colours it. The hook and the editor get a session before that grammar loads. They paint the fence plain, and nothing repaints it. C5 and E6 then fail, or pass only by the luck of a cache. Typing a new fence in the editor never colours it. The owner's reason for one engine, "a block looks the same static or live", fails for Markdown.
   Fix: decision 15 settles both cases.
   - Hosts with a fixed set of injected languages (HTML, Svelte, PHP): `loadHighlighter` resolves only once the host's grammar and every grammar it can inject are loaded.
   - Markdown's open set: `HighlightSession` gains `onChange(listener): () => void`, fired when a fence grammar arrives. The hook and the editor's plugin repaint on it. `highlightCode` awaits every fence grammar before it returns.

   The changelog names `onChange`. C5 and E6 each add one Markdown text whose fence language is loaded by nothing else on the page.

3. **High — "Code the grammar marks as an error is `special`" paints red on every line being typed** (`013:306`, `013:185`, `013:419`).
   tree-sitter marks incomplete code with `ERROR` nodes. In the editor, code is incomplete between keystrokes. A streamed reply is incomplete until its last chunk. Under "innermost wins", every character inside an `ERROR` that no inner capture claims takes the `ERROR`'s role.
   Failure: typing `def parse(` in Python, or `const x = {` in TypeScript, can turn the open construct red until it closes. A streamed code block can flash red across its last lines on each chunk. Meridian's rule 3, "red is rare … never marks anything you see on every line", fails on the two live paths the owner asked tree-sitter for. The reference holds one `invalid` character in 16,284 (HTML's bare `<`), so the accuracy bars cannot see this.
   Fix: decision 13 drops the general error row. `special` takes only the error cases the reference names: HTML's bare `<` (`(ERROR "<")` or the grammar's equivalent). Any other `ERROR` paints nothing of its own, so its children keep their roles. `highlight.test.ts` adds: an unclosed call, an unclosed object and an unclosed string in Python, TypeScript and Bash each produce 0 `special` characters outside escapes.

4. **High — The server path reads `devDependencies` from `node_modules` at request time, with no failure path** (`013:137`, `013:145–150`, `013:118`).
   Decision 5 declares the 20 packages as the item's `devDependencies`. On a server it resolves each `.wasm` from the app's `node_modules` when a `load` runs. The memo recommended `dependencies` (§6.5: "as `004` and `007` name `shiki`"). The specification's reason for the other field is that the CLI detects only static imports. That is a reason to declare them, not to declare them as development-only. Decision 4's fallback covers a query that fails to compile. It does not cover a grammar that fails to resolve, fetch or load.
   Failure: an app on `adapter-node` that deploys with `bun install --production` (or `npm ci --omit=dev`) has no grammar packages at run time. The first request whose `load` calls `highlightCode` throws inside `createRequire(...).resolve`, and the page returns 500. That is an installed app broken by an install it did not change.
   Fix:
   - Declare the 20 packages under the item's `dependencies`. The CLI installs both fields (READ), and `bun.lock` pins either way.
   - Decision 4: any failure to resolve, fetch, compile or load the runtime or a grammar, on the server or in the browser, logs one `console.warn` and falls back to Shiki. It never throws.
   - `highlight.test.ts` adds a case with the resolver made to throw.

5. **High — The editor's design cannot be built as written, and its tests cannot see the drift it risks** (`013:429–436`, `013:411`, `013:565`, `013:661–662`).
   This is the riskiest part of the change. Five gaps:
   - (a) A `StateField` has no view. It cannot "dispatch a `StateEffect` … when it resolves". The load must start in a `ViewPlugin`.
   - (b) A tree-sitter `Tree` is mutable WASM state. Mutating it in `StateField.update` drifts whenever a transaction's state is computed but never applied (a filtered or replaced transaction).
   - (c) `update(code, change?)` takes one change. Item 2 applies "each change … as one `Edit`" with one re-parse. The interface cannot express several changes against one final text.
   - (d) `ranges(from, to)` over the visible window. For Ruby, JavaScript and TypeScript, locals must see definitions above the window. A windowed locals query reads a local variable defined off-screen as a method call.
   - (e) The session opened when the grammar resolves must take the document as it is then, not as it was when the load began.

   Failure: (b) and (c) leave a tree that no longer matches the text. Colours then drift until a reload, which is the specification's own top risk. (d) breaks block–editor agreement on any long Ruby file. E6 cannot see (d), because it makes "the editor tall enough that every line is in view". The 500-edit test names no language, so it may never run an injection, a locals language or a Shiki session.
   Fix: rewrite decision 16:
   - A `ViewPlugin` owns the session. It starts the load. On resolve it opens the session with `view.state.doc` at that moment. It applies edits in `update(update)` from `update.changes`, which composes every transaction the view committed. Only committed changes reach the tree.
   - `HighlightSession.update(code, changes)` takes a list of `{ fromA, toA, fromB, toB }` in one call and parses once. Each `Edit` gets its old-end point from the start point plus the extent of the replaced old text.
   - `ranges` runs the locals query over the scopes that enclose the window, not the window.
   - The 500-edit test runs on Python, Ruby (locals), Svelte (injections) and Markdown (the Shiki session, with a fence).
   - E6 adds a 20-line-tall editor scrolled to the middle of a 2,000-line Ruby file. It compares the visible lines with a block.

   The changelog's `HighlightSession` line follows.

6. **Medium — "Properties in the body colour" is read, not ruled; and the link underline cites a ruling that does not exist** (`013:366`, `013:288`, `013:195`; `decisions.md` 2026-11-14 "Code takes Meridian's roles").
   The owner adopted Meridian's role map whole, and in the same entry: "Properties stay in the body, as before." "As before" is the owner's earlier ruling on the `property` slot. That slot held JSON keys, markup attributes, CSS properties and custom properties, and shell variables (READ, the colours memo, §3; `$HOME` was `property`). Meridian's map takes most of these out of the body: JSON keys blue, HTML attributes plum, CSS properties violet, custom properties and shell variables plum. Conflict 1 says the ruling "agrees". It agrees only for members, fields and keys elsewhere.
   Separately, decision 7 says "the owner's ruling lets links keep" the underline. No ruling mentions underline. Meridian says comments are the only styled role.
   Failure: a reviewer holding the task's checklist ("properties in the body colour") cannot pass decision 13 on the record as it stands. JSON is mostly keys, so a JSON block turns mostly blue.
   Fix: ask the owner and record the answer. Options:
   1. (recommended) Meridian's split. Its checklist asks for "JSON keys are blue and HTML attributes plum", and the owner adopted the map whole.
   2. The whole old `property` slot stays in the body.

   In the same question, ask whether links keep an underline (recommended: yes, the one non-colour signal a link has), or take colour alone.

7. **Medium — Counts that are wrong today, and counts that `014` will move** (`013:261`, `013:657`, `013:664`, `013:672`, `013:263`, `013:548`).
   - Primitives are **35** (EXECUTED; `tokens.test.ts:20–22`). So 35 − 9 + 20 = **46**, not 45, in decision 12, the Design block, `tokens.test.ts` and criterion 3.
   - Criterion 3's "the 28 light ones": 14 roles on 3 grounds are **42** light rows.
   - Criterion 18's "21 of 21 grammar assets": 21 languages use **20** WASM files (JSX shares JavaScript's).
   - Criterion 10's "12 Meridian cases": decision 21's list gives 12 or 13, depending on whether "`self` and `this`" is one case.
   - `014` changes the light code ground. The white-ground memo (§3) says this needs either a role of its own that each theme resolves or a map that names a role per theme. Either changes "53 → 58", "35 → 46" or "16 entries".

   Fix: correct the four. State the token counts as deltas over `014`'s landed file ("+20 primitives −9; +9 theme roles −4"). Add to build step 1: the absolute figures are re-derived from that file and written into the Landing notes.

8. **Medium — Criterion 21 asks the impossible: Vite emits every grammar the table names** (`013:571`, `013:675`, `013:141`).
   The specification's own measurement shows it. A module with dynamic `?url` imports of JSON and Python "built to one hashed asset per WASM" for both. A bundler cannot know which language a block will name at run time, so all 20 grammar files and the runtime land in every client build.
   Failure: a correct build fails "the client build holds one `.wasm` per grammar its live block uses and no others". Unstated cost: every app that adds `code-block` ships about 23 MB raw (2.2 MB gzipped) of WASM in its deploy, whether or not a page uses it (INFERRED, the sum of decision 3's table).
   Fix: criterion 21 checks that the client build holds 21 `.wasm` files (20 grammars and the runtime). A Playwright check on the scratch app's page counts the `.wasm` requests: the runtime plus the grammars its live block uses, and no others. Decision 20 and the item page state the deploy weight.

9. **Medium — E7's per-keystroke budget is measured to the next animation frame, which no build can meet** (`013:531`, `013:566`, `013:673`).
   "`performance.now()` around 200 `page.keyboard.type` keystrokes and the next animation frame" times a key from Playwright's protocol call to the next frame. The wait for the next frame alone is spread evenly between 0 and 16.7 ms at 60 Hz.
   Failure: p95 lands near 16 ms on an editor that does no work at all. Criterion 19 fails on a correct build, or invites a quiet change of method.
   Fix: measure in the page. Two options:
   - The Event Timing API (`PerformanceObserver` for `event`, `processingEnd − startTime` for each `keydown` and `input`).
   - The time from the transaction's dispatch to the end of `view.update`, recorded by an update listener.

   Keep the 8 ms p95 and the 50 ms maximum on that figure. Record the next-frame figure beside it, ungated.

10. **Medium — The conversion's mechanical map contradicts its own hand list, and misses languages** (`013:490–500`, `013:670`).
    Rule 1 claims a map "where an old slot has one role in a language". Its lists break that rule (EXECUTED, the reference):
    - HTML `property` → `meta`, but HTML's `property` holds the inline script's keys `every` and `board`, which decision 13 makes `text`.
    - Svelte `property` → `meta`, but it holds `station`, `opensAt` (`text`) and `display`, `gap`, `font-weight` (`keyword`).
    - YAML and TSX sit in the `text` list and also in rule 2's splits.
    - JavaScript (28 held-out characters) and Bash (143) are in no list.
    - HTML's `doctype` is `keyword` in the reference and `meta` in decision 13. Neither the map nor the split list moves it.

    Which wins when the map and the hand list disagree is unstated. Criterion 16 counts "19 of 19 old slots covered", which passes while JavaScript's `property` has no rule.
    Failure: the fixture labels `every` and `board` `meta` while the HTML query rightly makes them `text`, and the score drops for a right answer. Or the converter throws on JavaScript.
    Fix: the hand list overrides the map. The map's lists are corrected to the pairs that truly have one role:
    - `property`: JSON → `function`; Bash → `meta`; Python, TypeScript, JavaScript, Rust, Go, Java, C#, Ruby, SQL, TOML → `text`.
    - HTML, Svelte, TSX, YAML and CSS go to the hand list.

    Add `keyword` that is a doctype → `meta` to rule 2. Criterion 16 counts every (language, old slot) pair present in either set, each covered by the map or by a hand rule.

11. **Medium — Two rows of decision 13 relabel the reference to what syntax can see** (`013:351–353`, `013:357–362`, `013:282`).
    The guide's rule 3: "A label says what the code is, not what a highlighter can see." Decision 13 says "the converted reference is labelled by the same rows" as the queries. Two rows are limits, not rulings:
    - C#'s "receiver in a member access (`Console.`) → `text`", where the specification itself says "syntax cannot tell a class from a namespace".
    - Go's "type conversion `Celsius(x)` … → `function`", called a "loss".

    Failure: the held-out C# sample's `Console` is `type` in the reference (EXECUTED). Converted by the row, it becomes `text`, and an error is removed from the held-out score by a rule written knowing what the highlighter does. Meridian's own map, with a language server, gives `Console` navy.
    Fix: decision 13 marks these two rows "known loss: the reference keeps its label". The converter does not apply them. C#'s namespace qualifiers (`System.Text.`) still move to `text` under conflict 8, which is a ruling.

12. **Medium — The held-out set is guarded by discipline only** (`013:502`, `013:543`, `013:562`, `013:687`).
    The held-out samples are the gallery's. Before checkpoint 1 the builder renders them on the `highlighter` page (step 4), highlights all 26 in `highlight.test.ts` (step 3), and builds C5 on them. Their labels sit in the research file. "Does not read their per-character diffs" does not stop the builder from seeing a wrong colour on screen and fixing it.
    Failure: held-out tuning that no one can detect afterwards. The figure the owner reads as "generalises" would then mean nothing.
    Fix: make it mechanical.
    - `highlight-accuracy.test.ts` scores the held-out set only when `PLUTO_HELDOUT=1` is set. Before checkpoint 1 it skips, and prints that it skipped.
    - At checkpoint 1 the design lead, not the builder, sets the variable and records the figure.
    - Until then, the gallery's ten held-out samples render plain on the `highlighter` page, behind a development flag.
    - `highlight.test.ts`'s "2 roles" check covers the 16 other samples before the checkpoint and all 26 after.

13. **Medium — The bars stand on a query set this specification forbids** (`013:20`, `013:506–518`).
    The memo's 96.6% and 95.5% are c2: "c1 plus query patterns of ours, appended so they win". That is each grammar's stock queries plus about 190 patterns on top (memo §1, §4.3). Decision 6 writes every query fresh, with no stock base. Nothing measured fresh queries. The memo's c2 files were not kept. The memo also measured locals for Ruby alone, and SQL and Markdown on tree-sitter.
    Failure: the intent and the bars read as measured where they are a target. If fresh queries land at, say, 92% on the workbench set, the rule "a bar may not be lowered after checkpoint 1" and the late-found gap collide.
    Fix: the Intent says c2 was stock plus ours, and that 013's queries are unmeasured. Decision 19 labels the bars INFERRED targets. The workbench-set bars are confirmed or reset at checkpoint 1, before the held-out set is scored, as decision 19 already allows.

14. **Medium — A query file shared by two grammars is compiled against one** (`013:158`, `013:665`).
    `typescript.scm` serves TypeScript and TSX. `jsx.scm` serves JavaScript and TSX. `javascript.locals` and `typescript.locals` may serve TSX. Where TypeScript's and JavaScript's own queries compose is unstated (the stock TypeScript runs its own file, then JavaScript's).
    Failure: `(type_assertion)` compiles against TypeScript and fails against TSX (EXECUTED). A correct `typescript.scm` then fails for TSX at run time. TSX falls back to Shiki with a warning, while criterion 11 passes on "its pinned grammar".
    Fix: decision 6 gives each language's ordered file list (for example, tsx: `typescript`, `jsx`, `typescript.locals`). Criterion 11 compiles every (file, grammar) pair in those lists.

15. **Medium — Expectations that must change, and are not named** (`013:548–554`, `013:676`).
    - `generated.test.ts:815–850`, the v0.8.0 custom-properties guard. It requires every v0.8.0 property in `:root`, `.dark` and `@theme inline` at its value, except those `011` moved. In each block, 013 removes 7 `--code-*` names and 4 `--syntax-*` names, renames `--code-foreground` to `--code-text`, and recolours 11 `--code-*` names and `--syntax-orange`. This is the test that enforces constitution §6, and it must change by a list.
    - `contrast.test.ts:463–500`, "the 19 text slots resolve to 10 families", with its primitive lists.
    - `tokens.test.ts:26–30`, "the 9 primitives of 007 decision 3".
    - `keyboard.spec.ts`, axe and the page lists, if C5's second gallery and E6's specimen editor add stops or views.

    Failure: criterion 22 cannot pass without changing these. The specification permits no such change, so the builder either breaks a criterion or rewrites a guard unreviewed.
    Fix: decision 21 names each change. The v0.8.0 guard gains a `REMOVED_013` and a `MOVED_013` list, built like `MOVED_011`. Say where C5's second gallery and E6's editor live, and what they do to the counts.

16. **Medium — The upgrade path leaves the old properties in an app's stylesheet, and any `add` pulls the new theme** (`013:463`, `013:470`).
    The CLI merges `cssVars` and never deletes a name the new theme lacks (READ). Every item names `pluto-theme` as a registry dependency.
    Failure, two ways:
    - An app at 0.11.0 that adds any new item from `v0.12.0` (a `button`) gets the 0.12.0 theme. The eleven kept `--code-*` names take Tombaugh's colours. The seven removed ones keep their 0.11.0 colours. The app's 0.11.0 highlighter then paints half in one palette and half in the other, with nothing said.
    - An app that upgrades as decision 17 says keeps `--code-builtin`, `--syntax-amber` and the rest in `src/app.css` forever. With them it keeps their `--color-code-*` lines, so `text-code-builtin` still compiles and no build tells it a class is stale.

    Fix: the changelog and the item pages say that any `add` from `v0.12.0` updates `pluto-theme`, so the code items move with it. They list the lines to delete from the app's stylesheet. `code-add.test.ts` adds an upgrade case: install at `v0.11.0`, add the five items from `v0.12.0`, and check which old names remain.

17. **Medium — The release is unstated if `014` lands first** (`013:7`, `013:455`, `013:577`).
    013 "lands after" `014` and is "0.12.0". If `014` is released on its own, it takes 0.12.0, and 013's version, its `static/v0.12.0/` and its changelog heading are wrong.
    Fix: ask the owner, or record from the 2026-11-14 entry ("lands with or before"). Options:
    1. (recommended) one release, 0.12.0, carries `014` and `013`. `014` is built first and not tagged. The 0.12.0 entry holds both.
    2. `014` is 0.12.0, and 013 is 0.13.0.

18. **Medium — The dependency on `014` covers the token grounds only, not every light `muted` code sits on** (`013:221–226`).
    The requirement measures the code ground and the active line from the token file. But code also sits on light `muted` (`wash`) without either token:
    - the editor's root is `bg-muted`, under the prerendered `pre` before mount (`code-editor.svelte:163`);
    - `code-block.svelte`'s comment offers `class="bg-muted"` as an inset, and the `pluto-theme` page shows it.

    Tombaugh's comment (4.40) and number (4.41) fail there (EXECUTED). The completed placeholder memo recommends removing both (§5, §6.1). `014`'s text is not known.
    Failure: if `014` keeps any of them, criterion 3 passes and 013 ships AA failures. axe may miss the prerendered editor, since it scans after mount.
    Fix: decision 9 adds a requirement. No code text sits on light `muted` in any item: no `bg-muted` on `code-block`'s or `code-editor`'s root, and no `bg-muted` inset offered. A unit check greps the two items' files, and e2e reads the prerendered editor's root background with scripts off.

19. **Medium — Wrapping a language's support drops its own extensions** (`013:444`).
    "`loadLanguage` returns `new LanguageSupport(language, [codeHighlighting(id)])`." `description.load()` returns a `LanguageSupport` whose `support` holds behaviour as well as structure: HTML's tag auto-closing, Markdown's list-continuation keymap, CSS and HTML completion sources. Rebuilt from `language` alone, all of it goes.
    Failure: typing `<div>` in the editor's HTML no longer closes the tag. Enter in a Markdown list no longer continues it. "Lezer and the legacy modes keep structure" is false for behaviour a typist relies on, the specification's own reason for keeping Lezer.
    Fix: `new LanguageSupport(loaded.language, [loaded.support, codeHighlighting(id)])`. `code-languages` moves from `pythonLanguageConfigured` to `pythonLanguage` (`code-languages.ts:3`). L1 adds one behaviour check: HTML closes a tag.

20. **Low — Meridian's comment ceiling is silently exceeded** (`013:230–232`).
    Meridian gates comments at 3.8:1 or more, "at most 6:1". The dark comment reads 6.55 on the active line and 7.33 on graphite (EXECUTED). The specification sets aside the floor and says nothing of the ceiling.
    Fix: add "Meridian's 6:1 ceiling is not used either; on the dark active line and in the ink surface comments read 6.55 and 7.33, still below every coloured role there." Print the rows.

21. **Low — Svelte injections need fields, not "expressions in `{…}`"** (`013:393`).
    Svelte gives an `{#each}` an `identifier` and a `parameter` (EXECUTED). Parsed as one TypeScript expression, `item (item.id)` is a call, so `item` turns `function`. The same holds for `{:then value}` and `{#snippet name(a)}`.
    Fix: inject a block's condition and an each's `identifier` as an expression. Inject its parameter as a binding pattern (TypeScript `let` declaration, or plain). Inject the key as an expression. Add one `{#each … (key)}` case to `highlight.test.ts`.

22. **Low — The Shiki session's equality branch can be decided now** (`013:434`).
    Shiki 4.5.0's `GrammarState` has no `equals`. Its stack is reached through `getInternalStack()`, marked `@internal`. vscode-textmate's `StateStack.equals` is public (READ).
    Fix: say the session compares `a.getInternalStack()?.equals(b.getInternalStack())`. It relies on an internal method of a pinned version, and a unit test guards it. The visible-lines rule becomes the documented fallback only if that test fails on a future Shiki.

23. **Low — `highlighter`'s `meta.stock` after a rewrite into 28 files** (`013:51`).
    The item names shadcn-svelte's stock `highlighter` with its sha256. After 013 nothing of the stock item is left. `registry.test.ts:581` counts 8 stock-derived `004` items.
    Fix: say whether `meta.stock` stays as provenance or goes; if it goes, the count becomes 7.

24. **Low — The import graph that keeps prerendered pages free of the engine is unstated** (`013:143`, `013:147`, `013:666`).
    C1 requires 0 references to tree-sitter or Shiki in a `code-block` page's raw HTML. Every block page imports the hook, which imports `highlighter.ts`. Suppose `highlighter.ts` (or `tree-sitter.ts`, statically) imports `web-tree-sitter`. Then SvelteKit modulepreloads its 155 KB module on every page with a block. Likewise, a static `node:module` import survives as a browser stub, whatever `import.meta.env.SSR` removes.
    Fix: decision 5 says `web-tree-sitter`, `shiki` and `node:module` are imported only with `await import()`, inside their branches. C1 also counts `modulepreload` links.

25. **Low — The ALL_CAPS rule and C macro calls** (`013:300`, `013:354`, `013:303`).
    "Placed after the general identifier patterns" under last-wins also overrides class and definition names. `class API:` and `API()` in Python would turn `constant`. A C function-like macro call becomes `constant`, while Meridian sends macros (`@function.macro`) to `meta`.
    Fix: the rule applies to identifiers in reference and assignment position only, never to a definition, a type position or a capitalised callee. Say why a C macro call is `constant` and not `meta`, or make it `meta` where the grammar marks a macro.

26. **Low — Timing and size units** (`013:526–531`, `013:673`).
    - "A fresh process" inside `bun test` needs a spawned subprocess; say so.
    - The 1.5 s first pass now includes Shiki's start for SQL, Markdown and diff. The memo measured 0.95 s for Shiki's TypeScript alone, so the margin is unmeasured.
    - The memo writes the runtime as 81 KB and the specification as 83 KB: KiB against kB.

    Fix: name the subprocess. Measure the mixed first pass at step 3 and record it. State kB = 1,000 bytes.

27. **Low — The fence rule is not `chat-text`'s** (`013:398`).
    The specification says "an opener of three or more backticks with an info string", and calls it the rule `chat-text.svelte` uses. That rule is exactly three backticks, with any info, empty included (`chat-text.svelte:25`).
    Fix: use `chat-text`'s rule as written, or say the difference and why.

28. **Low — The hook re-queries the whole document on every chunk** (`013:419`).
    The 0.11.0 hook tokenises only new lines. A session's `lines()` after each append returns every line. At the specification's own figure, a whole-file query costs 29 ms at 194,500 characters. No streaming budget is set.
    Fix: `lines()` re-queries only `tree.getChangedRanges(old)` plus the appended range, and reuses the rest. Add one budget row: a 2,000-line stream in 50 chunks at 4 ms or less per chunk, in Bun.

## Constitution checks

- **§4.1 source, not a package:** held in design. WASM is an asset of the app's own build. On a server it is read from the app's own `node_modules`, and `locateFile` stops the runtime guessing a path. It holds only if those packages exist at run time (finding 4).
- **§4.2 driven by need:** the owner asked for accurate highlighting and an aligned editor. Nothing depends on an app adopting it.
- **§4.3 tokens are the one source:** held. Every colour is `var(--code-<role>)`; queries hold roles, never colours; L19 keeps the `syntax-*` names inside the theme. The body colour exists as a token but reaches no surface (finding 1).
- **§4.4 accessible by default:** the ratios hold on every ground the token file names (EXECUTED). Two gaps remain: code on light `muted` outside the tokens (finding 18), and the red that `ERROR` paints while typing. The second is a Meridian rule, not WCAG (finding 3). The keyboard is unchanged by decorations (INFERRED).
- **§4.5, §4.6 pinned and named:** every package exists at its version, and every one is MIT (EXECUTED). The tilde exception for the two `1.x` grammars is reasoned. The field the packages are declared in is wrong for the server (finding 4).
- **§6 never copy prior art:** the two-rule check over every installed stock query is a sound guard. It cannot see other projects' queries (Neovim, Helix, Zed), which are not installed. The grammar packages' query files are studied prior art, but nothing records them, with version and licence, in `prior_art/README.md` or the Landing notes. Add one line to the Landing notes.
- **§6 never break an installed app silently:** the changelog names the interface changes. It omits the body colour (finding 1), the stylesheet lines the CLI leaves behind and the theme an unrelated `add` pulls in (finding 16), and `onChange` if adopted (finding 2). The v0.8.0 guard that enforces this rule must change by a list (finding 15).

## Verdict

Does not land yet: findings 1 to 5 (High) and 6 to 19 (Medium) stand. Once fixed, the specification needs a second pass. Findings 2 and 5 rewrite the published interface and the editor's design. Finding 6 needs the owner's answer. Finding 7's counts can be fixed only once `014`'s token file exists.

## Disposition

By the design lead, 2026-11-14. Every finding is fixed in the specification; none is answered without a change. Findings 6 and 17 are fixed by the owner's rulings (`decisions.md`, "A public design site, the workbench dropped, and properties under Meridian"; "One release, 0.12.0, for the white ground and tree-sitter"). Decision numbers are the revised specification's.

1. **Fixed.** `code-block`'s default variant becomes `text-code-text`; `codeTheme`'s `color` and `caretColor` become `var(--code-text)` (decisions 7, 15, 16). The preview pages that used the removed names are listed (decision 18; the workbench's `code-pane.svelte` is removed with the workbench). The changelog's `pluto-theme` and `code-block` lines say the body colour changes. C2 reads a body token, E3 reads `.cm-content` and its caret, and `code-items.test.ts` greps both files (criterion 16).
2. **Fixed.** `highlightCode` awaits every grammar its text's injections and fences need. A session paints at once, loads what its text names, fires `onChange` when a grammar arrives, and reports `settled`; the hook and the editor's plugin repaint on it. `CodeBlockContent` sets `data-highlight="pending" | "settled"`, and C5 and E6 compare only settled blocks. The Markdown sample's fence is a language the agreement view loads nothing else in first. Not adopted: making `loadHighlighter` wait for every grammar a fixed host could inject, which would load TypeScript for every HTML block (decision 14).
3. **Fixed.** The general error row is gone: an `ERROR` node paints nothing and its children keep their roles. Only HTML's bare `<` is `special`. `highlight.test.ts` adds 9 cases (unclosed call, object or dict, and string in Python, TypeScript and Bash), each with 0 `special` outside escapes (decision 13; criterion 10).
4. **Fixed.** The 20 packages and `shiki` are the item's `dependencies`. Every failure on the tree-sitter path (resolve, fetch, compile, instantiate, query) logs one warning and falls back to Shiki, on the server and in the browser, never throwing (decision 4). Where the server path holds is stated (decision 5). `highlight.test.ts` covers the 5 causes, and the smoke test serves the app after `bun install --production` (criteria 9, 21).
5. **Fixed.** (a, b) One view plugin owns the session; it starts the load, and only committed updates reach the tree. (e) It opens the session with `view.state.doc` when the load resolves. (c) `HighlightSession.update(code, changes)` takes every change of an update and parses once; each `Edit`'s old-end point is the start point advanced by the replaced old text, from the session's own copy. (d) `ranges` runs locals over the enclosing scopes, cached per scope. The random-edit test runs 500 edits in each of Python, Ruby, Svelte and Markdown and compares whole documents. E6 adds a 20-line editor on a 2,000-line Ruby file, compared at line 1,000 before and after 50 off-screen edits (decisions 15, 16; criteria 7, 8).
6. **Fixed by the owner's ruling:** Meridian's split. Fields and member access are `text`, JSON keys `function`, HTML attributes `meta`, CSS property names `keyword` (decisions 7, 13). The link underline no longer cites a ruling; it is the design lead's call, with its reason (decision 7).
7. **Fixed.** Primitives 35 → 46; theme names 55 → 60 over `014`'s file; AA rows 70 (28 light on two grounds, 42 dark on three); 20 grammar WASM files; 13 Meridian cases, each listed (decisions 12, 21; criteria 3, 10, 18). Counts are stated as deltas over `014`'s landed file, and build step 1 re-derives the absolute figures into the Landing notes.
8. **Fixed.** Criterion 21 checks 21 `.wasm` files in the client build and 2 requested by the page (the runtime and Python's). Decision 5, the changelog and the item page state the deploy weight: 23.5 MB raw, 2.15 MB gzipped.
9. **Fixed.** E7 times each keystroke in the page, from a transaction's dispatch to the end of the view's update, with the 8 ms p95 and 50 ms maximum on that figure; Event Timing and next-frame figures are recorded and not gated (decision 20).
10. **Fixed.** The hand list overrides the map. The map lists only single-role pairs: `property` in JSON, Bash, and ten languages to `text`; HTML, Svelte, TSX, YAML and CSS `property`, and HTML, Svelte, TSX and CSS `tag`, go to the hand list. The doctype is added. The converter prints every (language, old slot) pair with its texts before it is frozen, and `convert-reference.test.ts` checks every pair present is covered (decision 19; criterion 17).
11. **Fixed.** C#'s static receiver and Go's conversion rows are marked "known loss". The reference keeps its labels, so the held-out `Console` stays `type`. The namespace row stays, as a ruling (decisions 13, 19).
12. **Fixed.** `PLUTO_HELDOUT=1` gates both the held-out score and the ten samples' colour on every page and test; before it is set they render plain. The design lead sets it at checkpoint 1, scores, and records the figure and the 24 query hashes. Every later query change is listed with both figures, and the change reviewer re-derives the hashes from the diff (decision 19; criterion 5).
13. **Fixed.** The Intent says c2 was stock queries plus ours, which this specification may not copy, and that fresh queries are unmeasured. Decision 19 labels the bars INFERRED targets, confirmed or reset at checkpoint 1 before the held-out set is scored.
14. **Fixed.** Each language's ordered file list is in decision 6. The TypeScript-only `type_assertion` lives in `typescript-assertion.scm`, which TSX does not load. Criterion 11 compiles all 27 (file, grammar) pairs.
15. **Fixed.** Decision 21 names every expectation that changes, file by file. The v0.8.0 guard gains `REMOVED_013` and `MOVED_013`. The agreement view's effect on axe, `theme.spec.ts` and the keyboard walk is stated.
16. **Fixed.** The changelog says any `add` from `v0.12.0` updates `pluto-theme`, and lists the lines to delete from an app's stylesheet. The smoke upgrade case installs from `v0.11.0`, adds from `v0.12.0`, and checks that exactly the listed lines remain (decisions 17, 21).
17. **Fixed by the owner's ruling:** one release, 0.12.0. Settled the same way as `014`, after its review: the version moves to 0.12.0 at the start of `014`'s build, so `static/v0.11.0/` is never rebuilt, and 013 does no bump. The tag comes once, after 013's change review. One entry holds one bullet per item, and `pluto-theme`'s bullet holds both parts and is marked **interface change** (decision 17; criteria 23, 24).
18. **Fixed.** Decision 9 requires that no code text sits on light `muted`. `code-items.test.ts` greps the two items for `bg-muted`, and `code.spec.ts` reads the prerendered editor root with scripts off (criterion 13). `014`, as drafted, removes both places code met `wash`.
19. **Fixed.** `loadLanguage` returns `new LanguageSupport(loaded.language, [loaded.support, codeHighlighting(id)])`; Python moves to `pythonLanguage`. L1 checks that HTML closes a tag (decision 16).
20. **Fixed.** Meridian's 6:1 ceiling is named and not used. The dark comment's 6.55 and 7.33 rows are printed (decisions 10, 12).
21. **Fixed.** Svelte expressions (conditions, lists, keys) and binding patterns (each items and indexes, `then`, `catch`, snippet parameters) are injected apart, with one `{#each}` case (decision 14).
22. **Fixed.** The Shiki session compares `getInternalStack()?.equals(...)`, guarded by a test, with the visible-lines rule only as a documented fallback (decision 16).
23. **Fixed.** `meta.stock` goes from `highlighter`; `004`'s stock-derived count becomes 7. `use-highlighted-code` keeps its `meta.stock`, with the reason (decision 5).
24. **Fixed.** `web-tree-sitter`, `shiki` and `node:` modules are imported only through `await import()` inside their branches. C1 counts `modulepreload` links, and `code-items.test.ts` checks for static imports (decision 5; criterion 12).
25. **Fixed.** The ALL_CAPS rule applies to reference and assignment positions only, never to a definition, a type position or a callee. A C macro call is `function`, because the grammar parses a call and marks no macro. Three cases are added (decision 13).
26. **Fixed.** "Fresh" is a `Bun.spawn`ed subprocess. The mixed first pass is measured at build step 3 and recorded. Units are kB = 1,000 bytes (header, decision 20).
27. **Fixed.** Fences use `chat-text.svelte`'s rule exactly: exactly three backticks, any info, empty included (decision 14).
28. **Fixed.** A session re-queries only `getChangedRanges` and the edited ranges, extended to whole lines. A budget is added: a 2,000-line stream in 50 chunks at 4 ms or less per chunk, p95 (decisions 15, 20).

**Constitution notes.** §6, prior art: the studied stock query files, with package, version and licence, go in the Landing notes (decision 6; criterion 11). §6, never break an app silently: the changelog names the body colour, the stale stylesheet lines, the theme any `add` pulls, `onChange` and `settled` (decision 17). The v0.8.0 guard changes only by its two lists.

**Beyond the findings,** from the owner's newest ruling: the workbench is removed in 0.12.0. Its specimens move to `tests/fixtures/highlight/`, its colour arithmetic to `tests/helpers/colour.ts`, and everything else goes (decision 18; criterion 22). The public site, `015`, will absorb the six changed item pages.

**Verdict as it stands:** for a second review; the specification's acceptance criteria are 24.

## Second pass

- **Date:** 2026-11-14
- **Reviewer:** the same reviewer; not the author
- **Reviewed:** the specification as revised (826 lines), read in full. It was checked against:
  - the Disposition above;
  - `decisions.md`, its two newest entries ("A public design site, the workbench dropped, and properties under Meridian"; "One release, 0.12.0, for the white ground and tree-sitter");
  - and, last, `014` as its author left it after its own review's fixes (407 lines).
- **Re-ran:**
  - **The counts** (INFERRED, arithmetic on the revised text). 5 module files + 24 queries = 29 files. The ordered file lists give 9 + 2 + 16 = 27 (file, grammar) pairs. 14 roles × (2 light + 3 dark grounds) = 70 AA rows, 28 light and 42 dark. 35 − 9 + 20 = 46 primitives. 55 − 4 + 9 = 60 theme names. The `syntax-*` roles are 7 − 4 + 9 = 12: 10 colours and `014`'s 2 grounds. Decision 3's table sums to 23,462 kB raw and about 2,150 kB gzipped. All agree with the text.
  - **Svelte's block heads** (EXECUTED, `@tree-sitter-grammars/tree-sitter-svelte` 1.0.2 in the scratch install). `{#each items as item, i (item.id)}` yields two `svelte_raw_text` nodes: `"items "` and `"item, i (item.id)"`. The key sits inside the parameter's text. `{#await p then value}` yields one raw text, `"p then value"`. `{#snippet row(a, b)}` yields `"a, b"`.
  - **The smoke fixture** (READ, `tests/smoke/fixtures/kit3/vite.config.ts`). The scratch app uses `@sveltejs/adapter-static` 4.0.0.
  - **The `code-block` page** (READ, `src/routes/(site)/items/code-block/+page.svelte`). Six of its blocks are plain `code` or `children`; none uses the hook.
  - **The editor's fallback** (READ, `code-editor.svelte:163–172`). The prerendered `pre` sets no text colour.
  - **`src/app.css`** (READ). `@theme inline` holds `--color-code-*` and `--color-syntax-*` lines, so "the `--color-` form of each" in the changelog covers both families.
  - **The name `syntax-line`** (EXECUTED, grep). It appears in 11 lines of 013. `syntax-active-line` appears in none.

### The 28 findings

1. **Closed.** The block's default variant becomes `text-code-text`. `codeTheme`'s `color` and `caretColor` become `var(--code-text)`. C2, E3 and `code-items.test.ts` check all three, and the changelog says so. Residual: the editor's prerendered fallback has no colour of its own (new finding 36).
2. **Closed.** `highlightCode` awaits every grammar the text needs. A session paints at once, fires `onChange` and exposes `settled`. `data-highlight` lets C5 and E6 compare final colours. Declining to preload every grammar a host could inject is reasoned: it would load TypeScript for every HTML block. `highlight(code)` is now asynchronous, and the changelog says so. Two write-ins remain (new findings 37 and 38).
3. **Closed.** `ERROR` has no role of its own, and its children keep theirs. HTML's bare `<` is the one error case. Nine cases check it. The reasoning cites the owner's rule.
4. **Closed in the design; its evidence does not yet prove it.** `dependencies`, the five-cause fallback that never throws, and the statement of where the server path holds are right. The production-install smoke check cannot fail on the scratch app as it stands (new finding 31).
5. **Closed.** One view plugin owns the load, the session and the decorations. It opens on `view.state.doc` at resolve. It applies `update.changes`, so it sees only what the view committed, and parses once per update. I re-derived the `Edit` arithmetic in decision 15. With changes applied in ascending order, the start point is the new text's at `fromB`. The old-end point is the start advanced by `old.slice(fromA, toA)`. The new end is `toB`'s. It is right. The 2,000 random edits compare whole documents. The scrolled Ruby case makes the window and the off-screen edits real. Residual: the re-query reuse of finding 28's fix (new finding 32).
6. **Closed by the owner's ruling.** Meridian's split is in decisions 7 and 13. The underline is now the design lead's stated call, with its reason.
7. **Closed.** Every count is corrected, and the counts are stated as deltas over `014`. The name of `014`'s active-line role has since changed (new finding 29).
8. **Closed.** 21 `.wasm` files are in the build and 2 are requested by the page. The deploy weight is stated.
9. **Closed.** The timing runs in the page, from dispatch to the end of the update. The next-frame figure is recorded and not gated.
10. **Closed.** The map holds only single-role pairs, and the hand list overrides it. The pairs I found are all placed: HTML, Svelte, TSX, YAML and CSS `property`; JavaScript and Bash; the doctype. The printout at step 2 catches a pair I missed. Criterion 17 counts every pair.
11. **Closed.** The two rows are marked "known loss", and the held-out `Console` stays `type`. Criterion 17 checks it.
12. **Closed in the design.** The variable gates both the scoring and what is shown. The design lead scores the held-out set, and the 24 query hashes make a later change visible to the change reviewer. How "set everywhere" is kept is unstated (new finding 33).
13. **Closed.** The Intent and decision 19 say the bars are inferred targets, confirmed or reset before the held-out set is scored.
14. **Closed.** The ordered lists and `typescript-assertion` are given, and criterion 11 compiles 27 pairs.
15. **Closed.** Every changed expectation is named. `REMOVED_013` and `MOVED_013` are defined. The new view's effect on axe, `theme.spec.ts` and the keyboard walk is stated; its stop count reads 88 where its listed content gives 70 (new finding 39).
16. **Closed.** The changelog lists the lines to delete, and the upgrade smoke checks them exactly.
17. **Closed by the owner's ruling.** One release. The version moves at the start of `014`'s build, and 013 does no bump. Both specifications agree.
18. **Closed.** Two checks and `014`'s removal of both places.
19. **Closed.** `support` is kept, and L1 checks HTML's tag closing.
20. **Closed.** The ceiling is named, and the two rows are printed.
21. **Closed in intent.** Expressions and binding patterns are injected apart. The grammar does not split the text the way decision 14 assumes (new finding 35).
22. to 27. **Closed** as the Disposition says. I checked each against the revised text.
28. **Closed for the stream.** The budget is set. The reuse rule it adds is too narrow for locals and injections (new finding 32).

### New findings

29. **Medium — 013 names `syntax-line`; `014` names it `syntax-active-line`** (`013:209`, `:243`, `:263`, `:286`, `:288`, `:294`, `:296`, `:299`, `:300`, `:695`, `:700`, `:756`; `014:48`, `:56`).
    `014` renamed its role. Its decision 1 gives the reason: in this token file `-line` names a hairline.
    Failure: step 1 is built on `014`'s landed file. There, `code.active-line` is `syntax-active-line`. Decision 12's map, criterion 3's "`active-line: syntax-line`" and the contrast rows' grounds then name a role that does not exist. `tokens.test.ts` fails, or the builder renames silently.
    Fix: `syntax-line` → `syntax-active-line` in all eleven lines, the Design block included.

30. **Medium — L19's pattern is not `014`'s, which 013 is to adopt as written** (`013:294`; `014:151–163`, `:231`).
    `014`'s pattern: `/syntax-(?:orange|amber|purple|teal|cyan|violet|blue|navy|green|yellow|plum|red|grey|ink|ground|active-line)\b/g`. 013's differs in three ways:
    - it drops `amber|purple|teal|cyan`;
    - it has `line` for `active-line`;
    - it has no `\b`.

    `014` says 013 "does not narrow it".
    Failure: two specifications set one rule two ways. Built as 013 writes it, L19 stops flagging `text-syntax-amber`. An item file could then keep a removed name and pass the lint. Without `\b`, `syntax-redo` matches.
    Fix: decision 12 quotes `014`'s pattern verbatim. Keep its reason: the four removed names stay in the pattern, so a stale one is still caught.

31. **Medium — The production-install check passes whatever the packages' field** (`013:661`, `:774`; `tests/smoke/fixtures/kit3/vite.config.ts`).
    The scratch app uses `adapter-static`. Its `load` runs at prerender, before any reinstall, so after `bun install --production` nothing reads `node_modules`. Serving the build with `vite preview` needs `vite`, a development dependency the reinstall removes.
    Failure: the check passes with the grammars under `devDependencies` too. Finding 4 is then without evidence, and the case it guards (a request-time `load` in production) is never run.
    Fix: a third scratch app with `@sveltejs/adapter-node` (named and pinned) and one route with `export const prerender = false` whose `load` calls `highlightCode`. Build it, then `bun install --production`, then serve it with `bun build/index.js`. Assert:
    - the response holds role-class spans;
    - a control run, with one grammar's package directory deleted, still returns 200, falls back to Shiki and logs one warning.

32. **Medium — Re-querying only `getChangedRanges` misses changes that move no syntax** (`013:447`, `:449`, `:620`).
    tree-sitter reports where the tree's structure changed. Two kinds of edit change a role elsewhere without that:
    - Locals: in Ruby, adding `count = 0` at line 10 turns a bare `count` at line 400 from a method call (`function`) into a local (`text`). Line 400's nodes do not change.
    - Injections: changing a Svelte `<script>`'s `lang="ts"` re-parses the script in another language. Only the attribute's range changes in the host tree.

    Decision 15's rule reuses every other line's tokens.
    Failure: `lines()` and `ranges(0, length)` keep the old roles. Criterion 8's Ruby and Svelte runs should then fail on a build that follows the specification. If they pass by chance, the hook shows stale colours after any non-append edit. The editor's own window re-queries every update, so it differs from the block there too.
    Fix: decision 15 widens the re-query in two cases:
    - for a locals language, to the whole `@local.scope` that encloses a changed range, as the locals cache already drops it;
    - for an injection host, to the whole injected region, when the region's host node or its language selector (`lang`, a fence's info) changed.

    Say how injected trees are kept across edits: re-parsed whole per update, or incrementally. The random-edit test also compares one random window's `ranges(from, to)` with the whole-document result clipped to that window.

33. **Medium — "From then on the variable is set everywhere" is not a mechanism** (`013:563–564`, `:757–762`).
    After checkpoint 1, criteria 5, 6 and 9 need all 26 samples coloured. That holds only where `PLUTO_HELDOUT=1` is set: every `bun test` and Playwright run, `bun run build`, the smoke runs, the Cloudflare deploy of the preview and of `015`'s public site. The specification names none of them.
    Failure: a clean clone or a deploy without the variable shows ten gallery samples plain on public pages, and C5 runs on 16. The design lead's reading at checkpoint 1 is then unrepeatable by the change reviewer.
    Fix: at checkpoint 1 the design lead lifts the gate in the tree. Either delete the gate code, or commit a flag file the build and tests read. Record the commit in the Landing notes. Criterion 5 adds: no gate code (or the flag set) in the reviewed tree.

34. **Low — The shared changelog entry disagrees with `014` on order and on bullets** (`013:501–514`; `014:196–198`, `:233`).
    - `014` decision 12: "In a shared bullet, `013`'s sentences come first (the code map and the colours), then this specification's." 013 decision 17: `pluto-theme`'s bullet "opens with `014`'s ground and line".
    - `014` says 013's `pluto-theme` part "points to this one for the two grounds". 013's lines do not.
    - Both say "one bullet per item". 013 adds two bullets that name no item: "Any `add` from `v0.12.0` …" and "The colours: …". Criterion 23 checks one bullet per item.

    Fix: follow `014`'s order. Add "The code ground and active line are as `014`'s part below sets them" to 013's `pluto-theme` sentences. Fold "Any `add` …" into `pluto-theme`'s bullet, or into the "what an app does to update" paragraph that `014`'s template provides. Fold "The colours" into the summary line.

35. **Low — Svelte 1.0.2 does not separate an each's key, or `then`, from the text around it** (`013:409–410`, `:616`).
    EXECUTED: the each's `parameter` holds `"item, i (item.id)"`, key included, and an `await` head is one raw text, `"p then value"`.
    Fix: decision 14 says how the text is split. In a parameter, a trailing balanced `( … )` is the key, injected as an expression; the rest is the binding pattern. In an `await_start` raw text, split at the word `then` or `catch` outside brackets: the left part is an expression, the right part a pattern. Add the `{#await p then value}` case to `highlight.test.ts`.

36. **Low — The editor's prerendered fallback shows the page's text colour, then `--code-text`** (`code-editor.svelte:168–172`; `013:651`).
    `014` makes the root's ground match the mounted editor. Nothing gives the fallback `pre` the body colour, so its text changes colour at mount: ink `#0B0F17` to `#25292F` in light, paper to `#D9DFE8` in dark.
    Fix: the fallback `pre` takes `text-code-text` (decision 15 or 16). The scripts-off check reads its colour beside the root's ground.

37. **Low — `data-highlight` on a block with nothing to highlight is unstated** (`013:423`, `:642`).
    C1 requires "every block `"settled"`" on the `code-block` page. Six of that page's blocks are plain `code` or `children` (READ), with no session.
    Fix: "`settled` whenever nothing is loading, including a block with no `language`, plain `code` or `children`."

38. **Low — C5 cannot make the Markdown fence's grammar arrive late** (`013:645`).
    "The Markdown sample's `python` fence is a language nothing else on the view loads first, by the view's order" does not hold. The same view holds the Python gallery sample and the Python specimen, and every block starts its load in the same tick on mount. DOM order does not order the loads. So the browser test never runs the late-grammar path that finding 2 is about. The unit test does.
    Fix: C5 delays Python's `.wasm` with Playwright's `page.route` for one run. It asserts `data-highlight="pending"`, then `"settled"` and the identical classes.

39. **Low — Stale cross-references and a duplicate helper** (`013:249`, `:520`, `:526`, `:640`).
    - "`014` decision 10, which edits the workbench, is overtaken": `014` decision 10 now leaves the workbench alone.
    - "`014`'s review found its decision 14 handing older figures … its author has been told": `014` now carries 14, 70, ten and 60.
    - `014` adds `deltaE` and `mix` to `scripts/contrast.ts`. Decision 18 moves the workbench's own copies to `tests/helpers/colour.ts`, so there are two implementations of one formula. Import those two from `scripts/contrast.ts`, and move only `oklch`, `fromOklch` and the colour-vision matrices.
    - The agreement view's "88 `pre` stops": its listed content (26 × 2 + 18 blocks) gives 70. Give the count that matches the content.

### Owner rulings since the first pass

- **Properties under Meridian:** honoured in decisions 7 and 13, conflict 1, the hand list, and the Meridian cases (JSON key, HTML attribute, CSS property).
- **One 0.12.0 release, bumped at the start of `014`'s build:** honoured in decisions 17 and 22 and criteria 23 and 24. 013 does no bump. `static/v0.11.0/` stays frozen.
- **The workbench dropped, its specimens and reference kept as fixtures:** honoured in decision 18 and criterion 22. The specimens move unchanged, so their SHA-256s hold. The reference stays in `research/`, read by the converter.
- **`015`, the public site:** named in the header, the Scope and decision 18. 013 designs none of it. It is the site whose deploy finding 33 touches.

### Consistency with `014` (checked last; `014` no longer mid-edit)

- **Role names:** `syntax-ground` agrees. `syntax-line` does not; `014` names it `syntax-active-line` (finding 29).
- **L19:** differs (finding 30).
- **Version timing:** agrees. The bump comes at the start of `014`'s build; 013 does none; one tag follows 013's change review.
- **The shared `pluto-theme` bullet:** one bullet, marked interface change, and `014`'s scoped "renames and removes nothing" all agree. The order and the pointer to `014` differ (finding 34).
- **Counts:** agree. Both give 14 text roles, 70 AA rows (28 light on two grounds, 42 dark on three), ten `syntax-*` colours beside two grounds (twelve in all), 60 names from `014`'s 55, and `014`'s 95 code-slot rows replaced. `014`'s Tombaugh group (its criterion 5, also 70 rows: ten colours on seven grounds with the selection) is a different group with the same total, and 013 keeps it.
- **Grounds and items:** agree. The values match: white and `#F3F0E8` in light, `#2C2821` and `#221F19` in dark. Both remove the editor root's `bg-muted` and the escape. The decision numbers 013 cites (1, 3, 4, 5, 7) are `014`'s.

Nothing in `014` is left unconfirmed.

### Verdict after the second pass

Does not land yet: new findings 29 to 33 (Medium) stand. 29 and 30 are a rename and a pattern to copy from `014`. 31 is a smoke app to add. 32 is a reuse rule to widen. 33 is a gate to lift in the tree. None changes a decision's direction or needs the owner. Once they are fixed, a short confirmation of those five, with Lows 34 to 39 taken as write-ins, is enough. A third full review is not needed. Then 013 is fit to build.

## Disposition of the second pass

By the design lead, 2026-11-14. All eleven are fixed in the specification; none is answered without a change. Decision numbers are the specification's.

29. **Fixed.** Every `syntax-line` is now `syntax-active-line`, as `014` decision 1 names it: 13 occurrences, the Design block, decision 12's map, the contrast grounds, the named rows and criterion 3 among them. Only the specification's own disposition line still quotes the old name.
30. **Fixed.** Decision 12 quotes `014` decision 9's pattern verbatim: `/syntax-(?:orange|amber|purple|teal|cyan|violet|blue|navy|green|yellow|plum|red|grey|ink|ground|active-line)\b/g`. It gives the reasons: the four removed names stay so a stale one is still caught, and the `\b` stops `syntax-redo`. It says 013 does not narrow it.
31. **Fixed,** to the reviewer's design. A third smoke app, `kit3-node`, uses `@sveltejs/adapter-node` 6.0.2, pinned exact (read 2026-11-14; peer `@sveltejs/kit` `^3.0.0-next.0`). Its route has `prerender = false`, and its `load` highlights `-> Body | None` per request. It is built, reinstalled with `bun install --production`, and served by `bun build/index.js`. `Body` as `text-code-type` proves tree-sitter ran, since Shiki leaves it plain (memo §5.4). The run also requires 0 warnings. A control run with `tree-sitter-python` deleted returns 200, shows Shiki's colours and logs 1 warning. The check now fails if the grammars were `devDependencies`, or if a missing grammar threw (decision 21; criterion 21).
32. **Fixed.** Decision 15 widens the re-query in three cases, in a table:
    - a locals language: the whole enclosing `@local.scope`, which for Ruby's top level is the whole document;
    - an injected region whose text changed: that region;
    - a changed host node or language selector: that region, except Svelte's script `lang`, which re-queries the whole document because every expression takes the script's language.

    Injected trees are kept per region. A region is re-parsed incrementally when its language holds, and parsed whole when it is new or its language changed. `highlight-session.test.ts` compares a random window's ranges with the whole-document result clipped to it. It adds the three cases: a Ruby local defined above, a Svelte `lang="ts"` switch, and a Markdown fence's language changed (criterion 8).
33. **Fixed,** by the first of the reviewer's two options plus a lock. At checkpoint 1 the design lead scores the held-out set and then deletes every read of `PLUTO_HELDOUT` in `src/` and `tests/`. So every build, test, smoke run and deploy, `015`'s public site included, colours and scores all 26 samples with nothing to set. The design lead also writes `tests/fixtures/highlight/query-lock.json`: the 24 query hashes, the held-out figures, and an empty change list. `queries.test.ts` fails on any query whose hash differs unless the lock lists the change, with its reason and both sets' figures. The specification states the limit plainly: after checkpoint 1 the held-out labels are seen, and the lock makes any tuning against them visible, not impossible (decisions 6, 19; criterion 5).
34. **Fixed.** Decision 17 follows `014` decision 12: in each shared bullet, 013's sentences come first. `pluto-theme`'s sentences end by pointing to `014`'s for the code ground and active line. The two bullets that named no item are moved: "the colours" goes to the summary line, and "any `add` …" to the update paragraph `014`'s template provides.
35. **Fixed.** Decision 14 says how Svelte 1.0.2's raw text is split. In an each's parameter, a trailing balanced `( … )` is the key, as an expression, and the rest is the binding pattern. An `{#await}` head splits at the first word `then` or `catch` outside brackets and strings: an expression on the left, a pattern on the right. A half-typed head stays `text`. `highlight.test.ts` adds the `{#await p then value}` case, so there are now 2 Svelte cases (criterion 10).
36. **Fixed.** The editor's fallback `pre` takes `text-code-text` (decisions 1, 16). The scripts-off check reads its colour beside the root's ground (criterion 13). The changelog's `code-editor` sentence names the prerendered text.
37. **Fixed.** `data-highlight` is `"settled"` whenever nothing is loading. That covers prerendered `lines`, plain `code` with no `language`, and `children` (decision 14).
38. **Fixed.** C5 adds a late-grammar run. `page.route` holds Python's `.wasm` until the test releases it. The Markdown copy reads `"pending"` with its fence plain, then `"settled"` with the prerendered copy's classes (criterion 6). The claim that DOM order delays the load is removed.
39. **Fixed.**
    - The cross-reference to `014` decision 10 now reads that it leaves the workbench to 013.
    - The "its author has been told" sentence now reads that `014` decision 14 carries the same figures.
    - `palette.ts` is removed with its copies of the arithmetic, so `contrastRatio`, `deltaE` and `mix` live only in `scripts/contrast.ts`, where `014` puts the latter two.
    - Only `oklch`, `fromOklch` and the colour-vision matrices move to `tests/helpers/colour.ts`. `colour.test.ts` checks that no file under `tests/` defines the other three (decision 18; criterion 22).
    - The agreement view's stops read 70 (26 × 2 + 18) and two editors.

**Also folded in, from `014`'s second review:** the tag comes once, after the change reviews of 013 and of `015`, the public site in the same release. The version bump stays at the start of `014`'s build (decision 17, build order, criterion 24).

**Verdict as it stands:** for the reviewer's short confirmation of 29 to 33. The acceptance criteria remain 24.

## Confirmation of 29 to 33

- **Date:** 2026-11-14
- **Reviewer:** the same reviewer; not the author
- **Reviewed:** the specification as revised after the second pass, read in its changed parts. Checked against the "Disposition of the second pass" and `014` as it now stands. `014` is being built; no code was read or touched.
- **Re-ran:**
  - **The role name** (EXECUTED, grep). 013 holds no `syntax-line` outside its own disposition line, which quotes the old name. 12 lines hold `syntax-active-line`.
  - **L19** (EXECUTED, grep). 013:299 and 014:157 hold the same string: `/syntax-(?:orange|amber|purple|teal|cyan|violet|blue|navy|green|yellow|plum|red|grey|ink|ground|active-line)\b/g`.
  - **The adapter** (EXECUTED, `npm view`). `@sveltejs/adapter-node` 6.0.2 exists, published 2026-11-10. Its peer is `@sveltejs/kit` `^3.0.0-next.0`, which the kit 3.1.0 fixture meets.
  - **The changelog** (READ). The 0.12.0 entry holds six bullets, one per item. `pluto-theme`, `code-block` and `code-editor` read "*first:*", ahead of `014`'s sentences.

29. **Closed.** `syntax-active-line` is used throughout, as `014` decision 1 names it.
30. **Closed.** The pattern is `014` decision 9's, verbatim. The reasons for keeping the four removed names and the `\b` are stated.
31. **Closed.** `kit3-node` runs `highlightCode` in a per-request `load` after `bun install --production` and is served by `bun build/index.js`. It fails in both ways it should:
    - grammars declared as `devDependencies` give a Shiki-plain `Body` and one warning;
    - a throw gives a 500.

    `Body` as `type` is a sound marker that tree-sitter ran: Shiki scopes it `meta.function.python` alone (memo §5.4). The control run, with the Python grammar deleted, proves the fallback. Two write-ins:
    - criterion 21 still reads "in 2 of 2 scratch apps", and there are now three: `kit3`, the upgrade app and `kit3-node`;
    - `kit3-node` needs its own `bun.lock` with `adapter-node` pinned, as `kit3` has one (§4.5).
32. **Closed.** Each widened case names its trigger and its re-query:
    - a locals scope, re-queried whole;
    - an injected region whose text changed;
    - a changed host node or language selector, with Svelte's script `lang` re-querying the whole document.

    Injected trees are kept per region, re-parsed incrementally or whole by a stated rule. Criterion 8 adds the window-against-whole comparison and the three targeted cases. For Ruby, and likely JavaScript's `program`, the top-level scope is the whole document, so most edits there re-query everything. Decision 20's Ruby editor budget (16 ms p95) covers that cost.
33. **Closed.** At checkpoint 1 the design lead deletes every read of `PLUTO_HELDOUT`, so nothing remains to set in any build, test or deploy, `015`'s included. `query-lock.json` then makes any later query change fail `queries.test.ts` unless the lock lists it with both sets' figures. Criterion 5 checks for 0 reads in the reviewed tree. The stated limit is honest: from then on, tuning against the held-out labels is visible, not impossible.

**34 to 39, skimmed: closed.**

- The bullet order follows `014` decision 12, with one bullet per item.
- Svelte's raw text is split by a stated rule, with a second test case.
- The editor's fallback takes `text-code-text`, and the scripts-off check reads it.
- `"settled"` covers plain blocks.
- C5's late-grammar run holds Python's `.wasm` with `page.route`.
- The cross-references are corrected. `deltaE` and `mix` live once, in `scripts/contrast.ts`, as `014` decision 8 puts them, and `colour.test.ts` checks that no copy exists under `tests/`. The view's stops read 70.

**Folded in:** the tag follows the change reviews of 013 and `015`. That matches `014` decisions 13 and 14 and its criterion 9, and the version bump stays at the start of `014`'s build in both.

**Against `014` as it stands:** the role names, the L19 pattern, the version timing, the one tag, the shared bullets' order, and the counts (14 roles, 70 rows, ten `syntax-*` colours beside two grounds, 60 names) agree.

### Verdict

Fit to build. Every finding is closed. The two write-ins under 31 (the scratch-app count in criterion 21, and `kit3-node`'s lockfile) change no decision and can be fixed in the text before step 6.
