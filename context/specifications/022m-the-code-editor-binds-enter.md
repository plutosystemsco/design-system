# 022m — The code editor binds Enter

- **Status:** built 2026-11-16; waits for its change review. Lane I.
- **Date:** 2026-11-16
- **Author:** a lane-I builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one item). No research memo of its own and no spec review. Its check is seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`, `022k`.
- **Found by:** the third `matrix` run, `code.spec.ts` E6 at full height in `webkit-*`, explained by [WebKit on Linux](../research/2026-11-16-webkit-on-linux.md), §4.

## The defect

`code-editor`'s default is `extensions = []`. Its own keymap binds only `Mod-Enter` and `Ctrl-Enter`, the run keys (READ, `code-editor.svelte`). So an editor given no setup, or a setup with no Enter binding, leaves Enter to the browser. At a line's end the browser writes two `\n` into the content, since a lone trailing newline would not render. CodeMirror's DOM reader drops the extra one only under `browser.chrome` (READ, `@codemirror/view` 6.43.15, near line 4313). Linux WebKit writes the same two, and CodeMirror keeps both (EXECUTED by the memo, 3 of 3; and by the new check below).

An app that renders `CodeEditor` without a setup that binds Enter gets two lines per Enter at a line's end in GNOME Web and other Linux WebKit browsers. `pythonSetup()` binds Enter through `defaultKeymap`, so its users are not exposed (EXECUTED by the memo). The agreement view's editors are such a setup (`lineNumbers`, `history`, `closeBrackets`, `bracketMatching`, no `defaultKeymap`), so E6's typed Enter leaves a trailing newline the block does not render, and E6 fails in WebKit.

## The fix

`code-editor.svelte` adds one keymap to its state, at `Prec.lowest`: `{ key: "Enter", run: insertNewline, shift: insertNewline }`, with `insertNewline` from `@codemirror/commands`. Every editor then handles the key itself, so the browser writes nothing. At the lowest precedence, a setup's own Enter (`pythonSetup()`'s `insertNewlineAndIndent`) and an app's keymap still win.

- **`insertNewline`, not `insertNewlineAndIndent`** (INFERRED): the browser's line break carried no indent, so the bare editor keeps that behaviour and needs no language's indent service. It returns `false` on a read-only state, so `readonly` is unchanged.
- **Shift+Enter too, a builder's ruling** (EXECUTED): `defaultKeymap` binds both, CodeMirror's comment names Shift+Enter, and the new check showed Shift+Enter doubles as well in Linux WebKit.
- **No new dependency** (EXECUTED): `@codemirror/commands` is already in the item's built `devDependencies` (`static/r/styles/maia/code-editor.json`), through `code-editor-python.ts`.
- No prop, slot or class changes. The changelog's 0.13.0 entry has a `code-editor` bullet.

## The check

1. **New, seen failing first:** `code.spec.ts`, "the code editor › 022m. with no extensions, Enter at the end of a line and of the text, and Shift+Enter, each add exactly one line". A third editor on `/view/code-agreement/` (`data-editor="bare"`, the text `first\nlast`, no `extensions` prop), read through `agreement.view('bare')`. Three cases: Enter at the end of line 1, Enter at the end of the text, Shift+Enter at the end of line 1. Each place is read from the text as it stands; after the edit and two frames, the text must equal the old text with one `\n` at that place.
2. **E6 at full height**, failing first in `webkit-light`, passes there and in `chromium-light`.
3. **New, written after the fix, proven by mutation:** "the code editor › 022m. a setup's own Enter still wins: in the Python example, Enter after a colon indents the new line". On the code editor's page, `if x:` then Enter then `y`; the bound value's last line must be `y` after one or more spaces.

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

### Not settled

- macOS Safari was not run (the memo's §9). The fix holds there whether or not the Mac port doubles the Enter, since the keymap now takes the key (INFERRED).
- `webkit-dark` and Firefox were not run here (no Firefox build in this container); the next `matrix` run shows them.
