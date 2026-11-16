# 022m — The code editor binds Enter

- **Status:** built 2026-11-16; its change review (`reviews/022mn-the-code-editors-enter-and-the-search-fields-cancel-button-pr-2026-11-16.md`) did not land it, for findings 1 and 2; all four findings are fixed in the worktree, and it waits for the review's disposition. Lane I.
- **Date:** 2026-11-16
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`, `022k`.
- **Found by:** the third `matrix` run, `code.spec.ts` E6 at full height in `webkit-*`, explained by [WebKit on Linux](../research/2026-11-16-webkit-on-linux.md), §4.

## The defect

`code-editor`'s default is `extensions = []`. Its own keymap binds only `Mod-Enter` and `Ctrl-Enter`, the run keys (READ, `code-editor.svelte`). So an editor given no setup, or a setup with no Enter binding, leaves Enter to the browser. At a line's end the browser writes two `\n` into the content, since a lone trailing newline would not render. CodeMirror's DOM reader drops the extra one only under `browser.chrome` (READ, `@codemirror/view` 6.43.15, near line 4313). Linux WebKit writes the same two, and CodeMirror keeps both (EXECUTED by the memo, 3 of 3; and by the new check below).

An app that renders `CodeEditor` without a setup that binds Enter gets two lines per Enter at a line's end in GNOME Web and other Linux WebKit browsers. `pythonSetup()` binds Enter through `defaultKeymap`, so its users are not exposed (EXECUTED by the memo). The agreement view's editors are such a setup (`lineNumbers`, `history`, `closeBrackets`, `bracketMatching`, no `defaultKeymap`), so E6's typed Enter leaves a trailing newline the block does not render, and E6 fails in WebKit.

## The fix

`code-editor.svelte` adds one keymap to its state, at `Prec.lowest` and after `extra.of(extensions)`: `{ key: "Enter", run: newline, shift: newline }`, where `newline` is `(view) => !view.state.readOnly && insertNewline(view)`, with `insertNewline` from `@codemirror/commands`. Every editable editor then handles the key itself, so the browser writes nothing. At the lowest precedence, a setup's own Enter (`pythonSetup()`'s `insertNewlineAndIndent`) and an app's keymap still win. Placed after the app's extensions, an app's own `Prec.lowest` Enter wins too, since bindings of one precedence run in the order they appear (the change review's finding 3).

- **`insertNewline`, not `insertNewlineAndIndent`** (INFERRED): the browser's line break carried no indent, so the bare editor keeps that behaviour and needs no language's indent service.
- **The read-only guard** (the change review's finding 1): `insertNewline` does not check `state.readOnly` (READ, `@codemirror/commands/dist/index.js:1496`). `readonly` and `disabled` both set `EditorState.readOnly`. On a read-only state `newline` returns `false`, so the key goes on to the browser, and CodeMirror ignores the DOM change there, as before.
- **Enter's keydown, in every browser:** the item now takes Enter's keydown and prevents its default in every browser, not only in Linux WebKit. An app's own `domEventHandlers` keydown for Enter no longer runs, and a listener on the root sees `defaultPrevented` (the change review's finding 2, EXECUTED there). No prop or type changes, so it stays a small change; the changelog says so, with the remedy: bind Enter in a keymap of the app's own, which still wins.
- **Shift+Enter too, a builder's ruling** (EXECUTED): `defaultKeymap` binds both, CodeMirror's comment names Shift+Enter, and the new check showed Shift+Enter doubles as well in Linux WebKit.
- **No new dependency** (EXECUTED): `@codemirror/commands` is already in the item's built `devDependencies` (`static/r/styles/maia/code-editor.json`), through `code-editor-python.ts`.
- No prop, slot or class changes. The changelog's 0.13.0 entry has a `code-editor` bullet, in the change review's words for the keydown. The component page's accessibility list gains one item: Enter and Shift Enter insert a line break, a setup's own binding takes precedence, and a read-only editor ignores them (finding 4).

## The check

1. **New, seen failing first:** `code.spec.ts`, "the code editor › 022m. with no extensions, Enter at the end of a line and of the text, and Shift+Enter, each add exactly one line". A third editor on `/view/code-agreement/` (`data-editor="bare"`, the text `first\nlast`, no `extensions` prop), read through `agreement.view('bare')`. Three cases: Enter at the end of line 1, Enter at the end of the text, Shift+Enter at the end of line 1. Each place is read from the text as it stands; after the edit and two frames, the text must equal the old text with one `\n` at that place.
2. **E6 at full height**, failing first in `webkit-light`, passes there and in `chromium-light`.
3. **New, written after the fix, proven by mutation:** "the code editor › 022m. a setup's own Enter still wins: in the Python example, Enter after a colon indents the new line". On the code editor's page, `if x:` then Enter then `y`; the bound value's last line must be `y` after one or more spaces.
4. **New, from the change review's finding 1, seen failing first on the first build:** "the code editor › 022m. read-only and disabled: Enter, Shift+Enter, and End then Enter leave the document unchanged". On the code editor's States example (`pythonSetup()`), the read-only editor focused and the disabled one clicked; the four keys pressed; after two frames, each editor's lines must equal what they were.

## Landing notes

Built 2026-11-16 by a lane-I builder, in the worktree `lane-i-webkit` at `0933f1b`, before `022n` in the same worktree. Not committed. Runs used `E2E_PREBUILT=1`, one worker, a rebuild after each source change, on 4 cores shared with other agents (load average 8 to 10).

### The fixture

The test view gains one editor and one branch of `agreement.view`. It is a test surface (`013` decision 21), not a site page; no other test counts its editors (READ, `code.spec.ts`; `blocks.test.ts`'s view guard passes).

### Seen failing first (EXECUTED)

- **Check 1**, on the unchanged item with the fixture built: `webkit-light` failed, 3 of 3 cases. End of a line: `first\n\n\nlast` where `first\n\nlast` was expected. End of the text: two trailing newlines where one was. Shift+Enter: one line too many. `chromium-light` passed, 3 of 3 cases. (The check's first draft had the two Enter cases only; both failed. Shift+Enter was added, and seen failing, before the fix.)
- **Check 2**, E6 at full height on the unchanged item: failed in `webkit-light` on "python after the edits" (editor line 51 has no block line), as in CI; passed in `chromium-light`.

### After the fix (EXECUTED)

- Checks 1 and 2: 4 of 4 passed (`chromium-light` and `webkit-light`).
- Check 3: passed in both projects. **The mutation:** `Prec.lowest` changed to `Prec.highest` and the site rebuilt. Check 3 failed in both projects ("Received string: \"y\"", no indent), while check 1 still passed. Restored, it passes. The indent unit in the example is two spaces, so the check asks for one or more.
- `code.spec.ts` and `search-field.spec.ts`, whole, in `chromium-light` and `webkit-light`: 104 of 106 passed. The two failures are E7, the budgets, in both projects. E7 also fails 3 of 3 at `0933f1b` on this machine, on the same assertion (Python's keystroke p95 over 12 ms), so `022m` does not cause it. It is `022f`'s fault. The figures are in `022n`'s landing notes, which hold the joint run.
- **E7 and the new keymap** (INFERRED; for the change review): every keydown now meets one more keymap, which looks up Enter only, and the view holds one more small editor. The comparison could not separate any cost from the load. The change review should time E7, or run `bun run cost --only code-editor`, on a quiet machine.
- **The ledger:** no line names E6 or the new tests (READ, `tests/fault-ledger.ts` at `0933f1b`: only `022f`'s E7 lines). The memo's §8 asked for an E6 line until the item binds Enter; none was added, and none is needed now.
- **The cost:** the cost unit test named `code-editor`, `code-languages` and `search-field` size-stale. `bun run cost --sizes-only` rewrote them: `code-editor` 130,841 → 131,114 B of JS (brotli 111,729 → 111,941), CSS unchanged; `code-languages` its input hash only, sizes unchanged. Runtime figures are kept. `code-editor` is an interactive item, so its change review runs `bun run cost --only code-editor` (`025`'s ruling (b)).
- `static/r/` and `static/v0.13.0/r/` regenerated by the build (`code-editor.json`). The thumbnails' manifest rewritten with `--hash-only` (`code-editor`, `code-languages`; no picture changed).
- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals. `registry`, `cost` and `thumbnails` unit tests: 160 passed, 0 failed.
- **The scorecard** is not re-run for this change alone; it follows the batch's re-run when these land.

### The change review's findings (2026-11-16)

The review found four. All four are fixed; the review file is not edited.

1. **High: Enter and Shift+Enter edited read-only and disabled editors.** The first build's note "It returns `false` on a read-only state" was wrong; it is struck above. `pythonSetup()`'s `insertNewlineAndIndent` returns `false` on a read-only state, so the key fell through to the item's `insertNewline`, which has no check. Fixed by the guarded `newline`. Check 4 holds it.
2. **Medium: the changelog said an editor built on a setup "behaves as before".** Replaced with the review's text: the editor handles Enter's keydown itself in every browser, an app that watched Enter binds it in a keymap of its own, and read-only and disabled editors still ignore it.
3. **Low: an app's own lowest-precedence Enter was shadowed.** The keymap moves after `extra.of(extensions)`. No browser check holds the order; the review read it from the facet order (EXECUTED there), and the comment in the source names it.
4. **Low: the component page did not name the key.** One item added to its accessibility list, in the review's words.

**Seen failing first (EXECUTED):** check 4, on the first build (unguarded, keymap before the extensions), failed in `chromium-light` and `webkit-light`: the read-only and the disabled editor each gained 3 lines ("Received + 3"), 2 of 2 editors in both projects.

**After the fixes (EXECUTED),** rebuilt, one worker, `chromium-light` and `webkit-light`: the three `022m` tests, E4 and both E6 tests, **12 of 12 passed.** Check 1 still passes, so an editable editor still gains exactly one line.

- `bun run check`: 0 errors, 0 warnings. `bun run lint`: clean. `bun scripts/lint-literals.ts`: 0 literals, 1 allowance.
- **The cost:** the cost unit test named `code-editor` and `code-languages` size-stale again. `bun run cost --sizes-only` rewrote them: `code-editor` 131,114 → 131,134 B of JS since the first build (brotli 111,941 → 111,892); from `0933f1b`, 130,841 → 131,134 (brotli 111,729 → 111,892). CSS unchanged. `code-languages` unchanged in size. The thumbnails' manifest rewritten with `--hash-only` (2 hashes; no picture changed).
- `registry`, `cost`, `thumbnails` and `blocks` unit tests: 198 passed, 0 failed. The whole unit suite, before the cost and thumbnail rewrite: 4 failed, those two and `highlight-session.test.ts`'s two timing budgets. That file failed its streaming budget in 1 of 3 later runs alone. This change touches no highlighter source.

### Not settled

- macOS Safari was not run (the memo's §9). The fix holds there whether or not the Mac port doubles the Enter, since the keymap now takes the key (INFERRED).
- `webkit-dark` and Firefox were not run here (no Firefox build in this container); the next `matrix` run shows them.
