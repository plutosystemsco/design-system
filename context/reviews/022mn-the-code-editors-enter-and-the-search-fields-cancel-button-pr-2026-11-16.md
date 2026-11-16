# Review of 022m and 022n — the code editor's Enter, and the search field's cancel button

- **Date:** 2026-11-16
- **Status:** in review
- **Reviewer:** a reviewer; not the author
- **Reviewed:** the uncommitted diff in the worktree `lane-i-webkit`, on `0933f1b`: [022m](../specifications/022m-the-code-editor-binds-enter.md) and [022n](../specifications/022n-the-search-field-hides-webkits-cancel-button.md), with [WebKit on Linux](../research/2026-11-16-webkit-on-linux.md) §2.2 and §4.
- **Re-ran:** all with `E2E_PREBUILT=1`, one worker, `chromium-light` and `webkit-light`, on the builder's build and again after a rebuild.
  - `022m`'s two tests, E4, both E6 tests and 28 → 12 of 12 passed.
  - `code.spec.ts` and `search-field.spec.ts` whole, without E7 → 104 of 104 passed.
  - `axe.spec.ts` and `theme.spec.ts` on `/view/code-agreement/` → 4 of 4 passed.
  - A mutation: the Enter keymap removed and the class put back to `appearance-none`, then a rebuild. `022m` check 1 failed in `webkit-light`, 3 of 3 cases ("Received + 1" line each). 28 failed in `webkit-light` on "the bare input's cancel button shows". `chromium-light` passed both. The sources were then restored. The hashes of `git diff` and `git status` match the ones taken before.
  - A probe of the site's States example, in both builds (`0933f1b` from the main checkout, and this change). Enter, Shift+Enter, End, Enter on the read-only and the disabled editor. At `0933f1b`: 2 lines → 2 in both engines. With this change: 2 lines → 5 in both engines, in both editors.
  - A scratch CodeMirror page (the pinned `@codemirror/view` 6.43.15, `state`, `commands` 6.11.1), in Chromium and WebKit. See findings 1 to 3.
  - `bun run cost --only code-editor,search-field` → exit 0, but the run was "noisy": the floor was 254.3 ms against 128. Its figures are not held, and `report.json` was restored byte for byte.
  - `bun run check` → 0 errors, 0 warnings. `bun run lint` → clean. `bun scripts/lint-literals.ts` → 0 literals, 1 allowance. `bun test` on `registry`, `cost`, `thumbnails` and `blocks` → 198 passed, 0 failed.
  - Not run: E7, Firefox, `webkit-dark`, macOS Safari.
- **A step the reviewer should not have taken:** to try finding 1's fix in the real item, the reviewer edited `code-editor.svelte` in the worktree and rebuilt. The test run that followed was refused by the permission system. The file was restored from a copy, the site rebuilt, and the diff and status hashes checked against the ones taken before. The fix stands on the scratch page's evidence alone.

## Acceptance criteria against evidence

### 022m

1. Check 1, new and seen failing first — met. EXECUTED: it fails in `webkit-light`, 3 of 3 cases, with the keymap removed. It passes with the keymap. `chromium-light` passes both ways.
2. Check 2, E6 at full height passes in both projects — met. EXECUTED: both E6 tests pass. The "failing first" run is READ, from the landing notes and the memo §4.
3. Check 3, a setup's own Enter still wins — met. EXECUTED: it passes. Its mutation (`Prec.highest`) is READ, from the landing notes.
4. "No new dependency" — met. READ: `registry.json` lets the build infer the item's packages. Before and after, `static/r/styles/maia/code-editor.json` lists the same six `devDependencies`. Only their order changes: `@codemirror/commands` moves first. That package was already required through `code-editor-python.ts`, one of the item's files.
5. "`insertNewline` returns `false` on a read-only state, so `readonly` is unchanged" — **not met.** READ: `insertNewline` has no read-only check (`@codemirror/commands/dist/index.js:1496`). EXECUTED: the probe above. See finding 1.
6. "No prop, slot or class changes" — met. READ: the diff.
7. "No other test counts its editors" — met. READ: C5 counts the 26 live blocks, and E6 counts the 44 texts from the fixtures. Neither counts editors. EXECUTED: C5, E5, E6, axe and the theme check pass on the view with the third editor.
8. E7 and the new keymap — no measurable cost. EXECUTED: on the scratch page, a letter's keydown takes 3.7 to 4.1 µs with or without the Enter keymap (three rounds of 20,000 events). The budget is 12 ms. The cost harness could not separate it: the run was noisy.

### 022n

1. 28 in `webkit-light` fails first and passes after; `chromium-light` passes both — met. EXECUTED: the mutation above, and the pass on the built change.
2. The class is Tailwind's `hidden` — met. EXECUTED: the built CSS holds `.\[\&\:\:-webkit-search-cancel-button\]\:hidden::-webkit-search-cancel-button{display:none}`.
3. The test's reference is `display: none` — met. READ: the diff. Its title still holds. Assertion 1 proves the bare input draws a glyph that the item does not. Assertion 3 proves the item draws what the reference draws.
4. No affordance lost — met. READ: the item's own Clear button shows while the field has text and is editable, and returns focus to the input. EXECUTED (by the memo): Chromium already hid the native glyph under `appearance: none`, so nothing changes there. INFERRED: macOS Safari loses only the glyph it had already lost.
5. Tokens only — met. EXECUTED: `lint-literals` found 0 literals.
6. The changelog folds the fix into the item's one bullet — met. EXECUTED: `registry.test.ts` passes.

### Ledger files

- `report.json` — plausible. READ: `code-editor` JS grows 273 B (brotli 212), and every package entry shifts by a few bytes. `search-field` grows 6 B of JS and 5 B of CSS. INFERRED: both changes are minifier-scale. The file is regenerated at landing anyway.
- The thumbnails manifest — plausible. READ: only the hashes of `code-editor`, `code-languages` (which depends on it) and `search-field` change.

## Findings, most severe first

1. **High. Enter and Shift+Enter now edit read-only and disabled editors** (`src/lib/registry/ui/code-editor/code-editor.svelte:91-95`). `insertNewline` never checks `state.readOnly`. `defaultKeymap`'s `insertNewlineAndIndent` returns `false` on a read-only state, so the key falls through to the item's binding.
   Failure: the site's States example (`pythonSetup()`, `readonly`). Focus it and press Enter, Shift+Enter, End, Enter → 2 lines become 5, in Chromium and WebKit. The disabled example does the same after a click. At `0933f1b` both stay at 2. So "typing changes nothing" breaks for every app that shows a read-only or disabled editor, in every browser, with or without `pythonSetup()`.
   Fix: bind a guarded command, `const newline: Command = (view) => !view.state.readOnly && insertNewline(view);`, as `{ key: "Enter", run: newline, shift: newline }`. `readonly` and `disabled` both set `EditorState.readOnly` (`editableOf`). Returning `false` leaves the key to the browser. On a read-only state, CodeMirror ignores the DOM change the browser makes (`@codemirror/view` `DOMChange`, near line 4204), as before the change. EXECUTED on the scratch page: with the guard, read-only editors stay unchanged in both engines, with and without `defaultKeymap`, and an editable one still gains exactly one line. Add a check that is seen failing on this build: Enter and Shift+Enter on the read-only and disabled examples leave the document unchanged. It could extend E4, which types only `zzz`. In the specification, strike "It returns `false` on a read-only state" and record the defect in the landing notes.

2. **Medium. The changelog says an editor "behaves as before"; for some apps it does not** (`CHANGELOG.md:31`). The item now handles Enter at keydown in every browser, not only in Linux WebKit.
   Failure (EXECUTED on the scratch page, Chromium and WebKit). An app passes `EditorView.domEventHandlers({ keydown })` and watches for Enter without binding it. Before, its handler ran. Now the keymap handles the key first and stops the event, so the handler never runs. A `keydown` listener on the editor's root sees `defaultPrevented` true where it saw false. Constitution §6 asks that no installed app breaks silently.
   Fix: keep the bullet's "no interface change, no prop changes". Replace "so an editor built on them behaves as before" with: "In every browser, the editor now handles Enter's keydown itself and prevents its default. An app that watched Enter in its own `domEventHandlers`, or relied on the browser's default, binds Enter in a keymap of its own, which still wins. Read-only and disabled editors still ignore Enter." The last sentence holds only once finding 1 is fixed.

3. **Low. An app's own lowest-precedence Enter is shadowed** (`code-editor.svelte:91`). Bindings at the same precedence run in the order they appear. The item's keymap comes before `extra.of(extensions)`.
   Failure (EXECUTED, by reading the facet order with the pinned `@codemirror/state`): with `Prec.lowest(keymap.of([{ key: "Enter", … }]))` in `extensions`, the order is "item > app". The item's `insertNewline` runs and the app's handler never does. Before the change, the app's handler ran.
   Fix: put the `Prec.lowest` keymap after `extra.of(extensions)` in `makeState`. The order then reads "app > item", and the comment's "an app's still wins" holds at every precedence.

4. **Low. The component page does not name the key the item now binds** (`src/routes/(site)/components/code-editor/+page.svelte`, the accessibility list). The page names Tab, `Mod-]`, `Mod-[` and Ctrl or Cmd Enter.
   Fix: add one item: "Enter and Shift Enter insert a line break. A setup's own binding, such as `pythonSetup()`'s indenting Enter, takes precedence. A read-only editor ignores them."

`022n` has no findings.

## Constitution checks

- §4.1 source, not a package: met. No run-time reach back. READ.
- §4.3 tokens are the one source: met. Neither change adds a colour or a size. EXECUTED: `lint-literals`.
- §4.4 accessible, proven in three engines: partly. Chromium and Linux WebKit were run. Firefox and `webkit-dark` were not, and the next `matrix` run covers them, as both specifications say. Finding 1 breaks the read-only state, which the page offers for keeping focus while a run is in flight.
- §4.5 and §4.6 pinned and named dependencies: met. There is no new package. The item's list is unchanged apart from its order. READ.
- §5 the small-change track: both checks were seen failing first (EXECUTED, by the mutation), and the reviewer did not write the changes. `022m` stays a small change only if finding 2's changelog text goes in. Its keyboard behaviour changes for apps in every browser, though no prop or type does. The scorecard is not re-run per change; both specifications defer it to the batch's re-run when these land.
- §6 never: nothing was committed or pushed, and no prior art was copied. "Break an installed app silently": finding 1 breaks one, and finding 2 is not yet said.

## Verdict

- **022m:** Does not land yet: finding 1 (High: Enter edits read-only and disabled editors) and finding 2 (Medium: the changelog hides a keydown change) stand. Findings 3 and 4 are write-ins.
- **022n:** Lands.

## Disposition
