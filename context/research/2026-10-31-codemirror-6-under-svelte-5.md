# CodeMirror 6 under Svelte 5: the editor as a registry item

- **Status:** complete
- **Date:** 2026-10-31
- **Author:** the design lead
- **Question:** How does a CodeMirror 6 Python editor become a registry item of ours (`registry:ui`, source an app copies in), wrapped for Svelte 5, themed only through our tokens, accessible by keyboard and screen reader, prerender-safe, and how much does it weigh?
- **What it blocks:** specification `004`, code and data.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-31, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. Browser checks ran in Playwright 1.64.1's Chrome Headless Shell 156.0.8078.4 (`chromium-1248`), the build the repository's `@playwright/test` pins.
- **READ**: a source says so. Each source was read on 2026-10-31. Paths such as `@codemirror/view/dist/index.js` are files in the scratch install, at the versions of section 1.
- **INFERRED**: our reasoning.

Scratch work was done in a folder outside this repository, and was not kept: `app/` (the SvelteKit project at the pinned versions, with `src/lib/code-editor/` the scratch component and theme, `src/lib/variants/` the measured variants, `build-all.sh`, `measure.ts`, `perpkg.ts`, `probe2.ts` and `probe3.ts`), `view-*.json` (the npm metadata), `lint-scratch.ts`, `lint-samples.ts`, and `prior-art/` (the studied package, read only). Nothing was written to this repository except this memo.

Terms of art used below.

- **CodeMirror 6.** A code editor built from small packages. Its two cores are `@codemirror/state` (the document, selection and configuration as immutable values) and `@codemirror/view` (the DOM, input handling and drawing).
- **Extension.** A value that adds behaviour or configuration to an editor state: a keymap, a gutter, a theme, a language.
- **Facet.** A typed configuration slot that several extensions can write to; the state combines the values. `EditorView.contentAttributes` and `EditorState.readOnly` are facets.
- **Compartment.** A labelled region of the configuration that can be swapped at run time with one transaction, without rebuilding the state.
- **Lezer.** CodeMirror's parser system. `@lezer/python` is the Python grammar; `@lezer/highlight` assigns **highlight tags** (`keyword`, `string`, ...) to syntax nodes and maps tags to CSS classes.
- **style-mod.** The tiny library CodeMirror uses to turn a theme object into a `<style>` element with generated class names (`ͼ1`, `ͼ5`, ...).
- **Tab focus mode.** CodeMirror's state in which a Tab key press is not handled by the editor, so the browser moves focus instead.
- **Prerender.** SvelteKit rendering a page to HTML at build time. **Hydration** is the client script taking that HTML over.
- **Mod.** CodeMirror's name for the platform's primary modifier: Cmd on macOS, Ctrl elsewhere.

## In short

- **Nine packages, all MIT, all current.** Editing with undo, line numbers, Python highlighting, bracket matching and indentation need `@codemirror/state`, `view`, `commands`, `language`, `lang-python` and `autocomplete` (for `closeBrackets`), plus the Lezer and style-mod packages they depend on. `codemirror`'s `basicSetup` adds the search panel, autocompletion, folding and the lint keymap (section 1).
- **The editor costs about 126 KB gzip over an empty page**, 372 KB minified, for the minimal set (a); 128 KB for the set with brackets and indentation (b); 159 KB for `basicSetup` (c). The core view alone is 66 KB gzip (section 2, EXECUTED).
- **Prerender works.** Importing `@codemirror/view` at module scope on the server throws nothing; the view and document guards are in its source. A page holding the component prerendered to HTML with a `<pre>` of the document and no editor DOM; hydration replaced the `<pre>` with the editor (section 3, EXECUTED).
- **Tab is not bound by default, so there is no keyboard trap.** With `indentWithTab`, Escape then Tab leaves within 2 seconds; Shift-Alt-m on a Mac (Ctrl-m elsewhere) toggles it permanently (section 4, EXECUTED). The focused element is a `contenteditable` `role="textbox"` with `aria-multiline`; `aria-label` and `aria-describedby` go in through `EditorView.contentAttributes`.
- **Every colour, family and size in a theme object can be a `var(--…)`**; style-mod writes them to the sheet as given, and the computed values resolve from our tokens in light and in `.dark` (section 5, EXECUTED). Our focus recipe replaces the default dotted outline. The lint passes the theme file, but it also passes `"13px"` and `"4px 0"` in such a file, so sizes in a theme are review's.
- **Mod-Enter fires a handler through `Prec.highest(keymap.of(...))`**, and the default `insertBlankLine` on the same key is suppressed. `view.setState` resets with no history; a dispatch keeps it (section 6, EXECUTED).
- **axe flags the scroller** (`scrollable-region-focusable`) unless the content element carries `tabindex="0"`; with it, axe reports nothing on the editor (section 4.4, EXECUTED).

## 1. The packages

**EXECUTED**: `bun pm view <pkg> --json` and `bun pm view <pkg> time --json`. Every package is MIT.

| Package | Version | Published | Depends on (runtime) |
|---|---|---|---|
| `codemirror` | 6.0.2 | 2025-06-19 | the seven `@codemirror/*` below (`^6`) |
| `@codemirror/state` | 6.7.6 | 2026-09-22 | `@marijn/find-cluster-break` |
| `@codemirror/view` | 6.43.15 | 2026-10-19 | `state`, `style-mod`, `crelt`, `w3c-keyname` |
| `@codemirror/commands` | 6.11.1 | 2026-09-15 | `state`, `view`, `language`, `@lezer/common` |
| `@codemirror/language` | 6.13.1 | 2026-10-07 | `state`, `view`, `@lezer/common`, `@lezer/lr`, `@lezer/highlight`, `style-mod`, `@codemirror/streamparser` |
| `@codemirror/lang-python` | 6.2.1 | 2025-05-14 | `state`, `language`, `autocomplete`, `@lezer/common`, `@lezer/python` |
| `@codemirror/autocomplete` | 6.20.4 | 2026-10-19 | `state`, `view`, `language`, `@lezer/common` |
| `@codemirror/search` | 6.7.2 | 2026-08-31 | `state`, `view`, `crelt` |
| `@codemirror/lint` | 6.9.7 | 2026-06-09 | `state`, `view`, `crelt` |
| `@lezer/highlight` | 1.2.5 | 2026-09-28 | `@lezer/common` |
| `@lezer/python` | 1.1.19 | 2026-05-28 | `@lezer/common`, `@lezer/lr`, `@lezer/highlight` |
| `style-mod` | 4.1.4 | 2026-09-18 | none |

Transitive, also MIT: `@lezer/common` 1.5.5 (2026-10-30), `@lezer/lr` 1.4.12 (2026-10-30), `@codemirror/streamparser` 6.0.0 (2026-10-07), `crelt` 1.0.7, `w3c-keyname` 2.2.8, `@marijn/find-cluster-break` 1.0.4. `bun install` of the twelve resolved 78 packages with no peer warnings (EXECUTED).

**What each need pulls in** (READ: the exports of each `dist/index.js`; INFERRED on grouping).

| Need | Extension | Package |
|---|---|---|
| Editing, selection, the DOM | `EditorState`, `EditorView` | `state`, `view` |
| Undo and redo | `history()`, `historyKeymap` | `commands` |
| Cursor movement, Enter with indentation, Mod-/ comment | `defaultKeymap` | `commands` |
| Line numbers | `lineNumbers()` | `view` |
| Python syntax tree and highlighting | `python()` or `pythonLanguage`; `syntaxHighlighting(HighlightStyle.define(...))`; `tags` | `lang-python`, `language`, `@lezer/highlight` |
| Bracket matching | `bracketMatching()` | `language` |
| Auto-closing brackets and quotes | `closeBrackets()`, `closeBracketsKeymap` | `autocomplete` |
| Re-indent on `else:`, `)` | `indentOnInput()` | `language` |
| Mod-Enter | `Prec.highest(keymap.of([...]))` | `state`, `view` |
| Drawn selection, active line, placeholder | `drawSelection()`, `highlightActiveLine()`, `highlightActiveLineGutter()`, `placeholder()` | `view` |

Two things to know. `python()` wires two completion sources (`localCompletionSource`, `globalCompletion`) into the language; `pythonLanguage` alone does not, and saves 4.6 KB gzip (READ: `@codemirror/lang-python/dist/index.js` lines 301 to 308; section 2). Completion is inert without `autocompletion()`, so `python()` costs bytes for nothing unless `004` wants completion. And `closeBrackets` lives in `@codemirror/autocomplete`, so that package is in the bundle either way (READ: `codemirror/dist/index.js` imports).

**What `basicSetup` adds that we would not want** (READ: `codemirror/dist/index.js`, the `basicSetup` array): `foldGutter()` and `foldKeymap`; `autocompletion()` and `completionKeymap`; `highlightSelectionMatches()` and `searchKeymap` (the search panel, with its own `crelt`-built DOM and literal-coloured panel theme); `lintKeymap`; `rectangularSelection()` and `crosshairCursor()`; `dropCursor()`; `EditorState.allowMultipleSelections`; and `defaultHighlightStyle` as a fallback, whose colours are hex literals (READ: `@codemirror/language/dist/index.js` lines 1805 to 1845). The package's own comment says it "does not allow customization" and expects you to copy its array and adjust (READ: same file). The cost is section 2's row c minus row b: 97 KB minified, 31 KB gzip.

## 2. Weight, measured

**EXECUTED.** A scratch SvelteKit project at the repository's versions (Svelte 5.57.3, SvelteKit 3.1.0, Vite 8.3.5, Tailwind 4.3.3, `@sveltejs/adapter-static` 4.0.0, `export const prerender = true`), one route, built with `bun --bun vite build` seven times with a Vite alias selecting the variant. Sizes are of every file under `build/_app/immutable/`, as Vite minified them; gzip is `Bun.gzipSync` at its default level. Vite's own report agrees (page chunk a: "363.08 kB │ gzip: 123.28 kB").

Each variant holds the scratch component (section 3), the theme (section 5) and the 25-line Sudoku example as the document.

| Variant | Extensions beyond the component's own | All client JS, minified | gzip | Over the baseline, minified | gzip |
|---|---|---|---|---|---|
| none | a plain page with the example in a `<pre>` | 82,328 | 32,519 | 0 | 0 |
| a | `python()`, `history()`, `defaultKeymap`, `historyKeymap`, `lineNumbers()` | 454,043 | 158,943 | 371,715 | 126,424 |
| a2 | a, with `pythonLanguage` instead of `python()` | 441,373 | 154,313 | 359,045 | 121,794 |
| b | a + `closeBrackets()` and its keymap, `bracketMatching()`, `indentOnInput()` | 460,176 | 160,825 | 377,848 | 128,306 |
| d | b + `drawSelection()`, `highlightActiveLine()`, `highlightActiveLineGutter()`, `highlightSpecialChars()` | 472,320 | 164,655 | 389,992 | 132,136 |
| c | `basicSetup` + `python()` | 556,840 | 191,951 | 474,512 | 159,432 |

The page chunk (`nodes/2.*.js`) carries nearly all of it: a 363,080 / 123,286; b 369,213 / 125,168; d 381,357 / 129,000; c 465,877 / 156,295; none 975 / 555. The Svelte runtime chunk grew from 32,140 to 41,747 bytes between none and a, because the component uses `$bindable`, effects and `onMount`; that growth is inside "over the baseline".

**Each package alone**, its `dist/index.js` minified by `Bun.build` with every import external (EXECUTED, `perpkg.ts`). An upper bound per package; the bundle tree-shakes about 60 KB off the sum.

| Package | Minified | gzip |
|---|---|---|
| `@codemirror/view` | 202,104 | 66,229 |
| `@codemirror/state` | 47,983 | 16,074 |
| `@codemirror/autocomplete` | 38,886 | 13,945 |
| `@lezer/python` (the parser tables) | 38,054 | 16,658 |
| `@codemirror/language` | 37,384 | 13,680 |
| `@codemirror/commands` | 30,185 | 9,909 |
| `@lezer/common` | 28,230 | 9,931 |
| `@lezer/lr` | 27,312 | 9,222 |
| `@codemirror/search` | 21,511 | 7,302 |
| `@codemirror/lint` | 16,639 | 6,570 |
| `@codemirror/lang-python` | 7,491 | 3,080 |
| `@lezer/highlight` | 7,442 | 3,090 |
| `@marijn/find-cluster-break` | 2,367 | 1,239 |
| `style-mod` | 2,245 | 1,227 |
| `w3c-keyname` | 1,516 | 847 |
| `codemirror` | 1,102 | 539 |
| `crelt` | 639 | 372 |

INFERRED: the floor is the view, about 66 KB gzip; no choice of extensions moves it. Whatever `004` picks between a and d lands between 122 and 132 KB gzip. The whole editor is one route's chunk, loaded only on the home page.

## 3. Svelte 5 wrapping

**EXECUTED**: the scratch component `app/src/lib/code-editor/code-editor.svelte` (129 lines) built, prerendered and ran. The decisions it makes, and what each run showed.

**Where the view lives.** The `EditorView` is created in `onMount` and destroyed in its return function (`view.destroy()`). *Why not `$effect`:* an effect re-runs when anything it reads changes; a view must be created once. `onMount` runs only in the browser, so the server never touches `EditorView`. The host is a `<div bind:this>`; the view is appended to it (`parent`).

**Two-way `value`.** `value = $bindable("")`. Editor to parent: an `EditorView.updateListener` sets `value = update.state.doc.toString()` when `update.docChanged`. Parent to editor: a `$effect` reads `value`, compares it with `view.state.doc.toString()`, and dispatches a whole-document replacement only when they differ. After an edit the listener has already made them equal, so the effect dispatches nothing: no loop, no flags. EXECUTED: the bound value equalled the document at start, after typing, after a reset, after a replacement and after undo.

**`readonly` and `disabled`.** One compartment holds `EditorState.readOnly.of(readonly || disabled)` and `EditorView.editable.of(!disabled)`; a `$effect` reconfigures it. EXECUTED: `readonly` sets `aria-readonly="true"`, keeps `contenteditable="true"`, keeps the editor a tab stop, and typing changes nothing. `disabled` sets `contenteditable="false"`; the editor is then skipped by Tab.

**Language and extra extensions.** The component binds no language. It takes `extensions: Extension` (the language, keymaps, gutters, anything), held in a compartment and reconfigured by a `$effect` when the prop changes. EXECUTED: a `$derived` array toggling `EditorView.lineWrapping` reconfigured live (section 6). *Why:* the component stays at the floor of section 2; the app, or a `python` preset file beside the component, adds the rest.

**Run key.** `Prec.highest(keymap.of([{ key: "Mod-Enter", run }, { key: "Ctrl-Enter", run }]))`, where `run` calls `onrun(doc)` and returns `true`. Section 6 has the measurements.

**Methods.** `export function focus()` calls `view.focus()`; `reset(text)` calls `view.setState(makeState(text))`; `replace(text)` sets `value`. A parent reaches them through `bind:this`. EXECUTED: a button calling `focus()` put focus on the content element.

**Attributes.** `label` (required) and `describedby` go into `EditorView.contentAttributes` with `tabindex="0"` (section 4.4), in a compartment.

**On the server.** Importing `@codemirror/view` at module scope throws nothing: the source guards `navigator` and `document` (READ: `@codemirror/view/dist/index.js` lines 6 and 7: `typeof navigator != "undefined" ? navigator : {...}`, `typeof document != "undefined" ? document : {...}`). EXECUTED: all seven builds prerendered the page ("Wrote site to build"); the HTML held `<pre data-slot="code-editor-fallback" aria-label="Python example">` with the example text and no `cm-editor`; after hydration the `<pre>` was gone and the editor present.

**What should render on the server.** INFERRED, three options.

| Option | For | Against |
|---|---|---|
| A `<pre>` of the document, swapped on mount | The code is in the HTML: readable before and without JavaScript, indexable, no layout jump if sized like the editor | Un-highlighted unless the sibling Shiki memo's highlighter runs at prerender too; a flash of plain text on slow hydration |
| Nothing (an empty host) | Simplest | A blank box in the prerendered page; the content arrives only with 126 KB of script |
| A `<textarea>` with the document | Editable with no JavaScript; a native form control with native focus, selection and screen-reader behaviour | Not highlighted; no line numbers; its height and font must match the editor's or the swap jumps; the home page cannot run code without JavaScript anyway, so "editable" buys little |

The scratch component takes the first. The second is what the studied prior art does for the browser branch (section 7). The `<textarea>` is the honest no-JavaScript fallback; the home page's run button needs JavaScript regardless, so the `<pre>` carries the same value at less complexity (INFERRED).

## 4. Keyboard and screen reader

### 4.1 Tab, and the way out

READ, `codemirror.net/examples/tab/` (fetched 2026-10-31): CodeMirror leaves Tab unbound by default so that its default setup meets the W3C "no keyboard trap" criterion; it calls this an intentional decision. If you bind Tab, "please start by making sure you mention one of these escape hatches somewhere in your documentation." The two escape hatches: Escape then Tab, and the `toggleTabFocusMode` command, bound to Ctrl-m (Shift-Alt-m on macOS) in `defaultKeymap`.

READ, the mechanism: `handlers.keydown` sets `tabFocusMode = Date.now() + 2000` on Escape (`@codemirror/view/dist/index.js` lines 5001 to 5002); the input handler lets a Tab through while the mode is on or the deadline has not passed, and any other non-modifier key ends a temporary mode (lines 4652 to 4655); `view.setTabFocusMode()` toggles, sets or times it (lines 8777 to 8784). `indentWithTab` is `{ key: "Tab", run: indentMore, shift: indentLess }` (`@codemirror/commands/dist/index.js` line 1824). `defaultKeymap` binds Escape to `simplifySelection` and Mod-Enter to `insertBlankLine` (lines 1805 and 1806).

**EXECUTED**, the probe page: a button, editor 1 without `indentWithTab`, a button, editor 2 with it, a button.

| Action | Result |
|---|---|
| Tab from the button before editor 1 | focus on editor 1's `.cm-content` |
| Tab again | focus on the next button; the document unchanged |
| Tab from the button before editor 2 | focus on editor 2 |
| Tab in editor 2 | focus stays; two spaces inserted (`indentMore`) |
| Escape, then Tab | focus on the button after editor 2 |
| Shift-Tab from that button | focus back on editor 2; Shift-Tab again also passed through, because the 2-second window from the Escape was still open |
| Escape, wait 2.1 s, Tab | focus stays in editor 2 (the window closed) |
| Escape, type `x`, Tab | focus stays (another key ended the mode) |
| Shift-Alt-m, then Tab | focus leaves; a later Tab from inside also leaves (the mode is on); Shift-Alt-m again, Tab indents |
| Ctrl-m, then Tab | focus stays: on a Mac the binding is Shift-Alt-m, so Ctrl-m is not it |

INFERRED for `004`: binding Tab is a choice, not a default. Without it, SC 2.1.2 (no keyboard trap) is met by construction and the only cost is that Tab does not indent; `defaultKeymap`'s Mod-] and Mod-[ still do. With it, the "Escape, then Tab" instruction must be visible text beside the editor and in `aria-describedby`, and the two-second window is a detail users will not guess.

### 4.2 Name, role, value (SC 4.1.2)

READ, `@codemirror/view/dist/index.js` lines 8338 to 8353: the content element gets `role="textbox"`, `aria-multiline="true"`, `contenteditable`, `spellcheck="false"`, `autocorrect="off"`, `autocapitalize="off"`, `translate="no"`, and `aria-readonly="true"` when the state is read-only; then `attrsFromFacet(this, contentAttributes, ...)` merges the facet's values. EXECUTED, editor 1's content attributes: all of those, plus our `aria-label="Python example"`, `aria-describedby="hint"`, `tabindex="0"`, `data-language="python"` (from the language) and `aria-placeholder="Type Python here"` (from `placeholder()`). The outer `.cm-editor` carries only classes; the gutters have `aria-hidden="true"`; the scroller has `tabindex="-1"`.

**An accessible name** is `EditorView.contentAttributes.of({ "aria-label": ... })` or `{ "aria-labelledby": id }`. **Instructions** are `{ "aria-describedby": id }` pointing at visible text such as "Ctrl Enter runs the example. Press Escape, then Tab, to leave the editor." Both are plain facet values, so a compartment can change them (EXECUTED).

### 4.3 Announcements

READ: `EditorView.announce` is a state effect; its strings are added to a visually hidden `div.cm-announced` with `aria-live="polite"` inside the editor (lines 7968 to 7972, 8367 to 8376, 9061 to 9068). The doc comment aims it at "effects that are visually obvious but may not be noticed by screen reader users." EXECUTED: the region exists, `aria-live="polite"`, `position: fixed`. INFERRED: a run's start and end belong to the page's own status region, not to the editor's; the editor announces editor things, such as "Reset to the NumPy example" on Reset, with `view.dispatch({ effects: EditorView.announce.of("...") })`.

### 4.4 Focus visible (SC 2.4.7), and axe

READ: the base theme sets `"&.cm-focused": { outline: "1px dotted #212121" }` and `.cm-content { outline: "none" }` (lines 6874 to 6883 and 6909). EXECUTED: our theme's `"&.cm-focused": { outline: "var(--focus-width) solid var(--color-ring)", outlineOffset: "var(--focus-offset)" }` won: the focused editor computed `outline: 2px solid rgb(36, 86, 230)`, offset 2 px; `rgb(122, 155, 255)` under `.dark`; the content element's outline stayed `none`, so there is one ring, around the whole editor including the gutter. The dotted rule is still in the sheet; the theme's rule has equal specificity and comes later.

**axe** (`@axe-core/playwright` 4.14.0, the tags the repository's `tests/e2e/axe.spec.ts` uses). EXECUTED on the editor alone: with `tabindex="0"` on `.cm-content`, no violation (the only finding was `color-contrast` on the scratch page's placeholder colours, which are not ours). With the attribute removed, `scrollable-region-focusable` (serious) on `.cm-scroller`: axe wants a scrollable region to be reachable by keyboard and does not count `contenteditable` as making it so. INFERRED: `004` adds `tabindex: "0"` through `contentAttributes` when the editor is not disabled, as the scratch component does; the repository's axe test then needs no exclusion.

SC references: 2.1.1 (keyboard): every editing command has a key; 2.1.2 (no keyboard trap): 4.1; 2.4.7 (focus visible): 4.4; 4.1.2 (name, role, value): 4.2.

## 5. Theming through tokens

### 5.1 How a `var(--…)` reaches the sheet

`EditorView.theme({...})` and `HighlightStyle.define([...])` take plain CSS values as strings. style-mod writes them unchanged. EXECUTED, the emitted `<style>` (one element, 8,121 characters) held 27 rules containing `var(--`, among them:

- `.ͼ5 {color: var(--color-foreground); background-color: var(--color-muted); font-size: var(--text-sm); border-radius: var(--radius);}`
- `.ͼ5.cm-focused {outline: var(--focus-width) solid var(--color-ring); outline-offset: var(--focus-offset);}`
- `.ͼ5 .cm-scroller {font-family: var(--font-mono); line-height: var(--text-sm--line-height); scrollbar-color: var(--color-border) transparent; scrollbar-width: thin;}`
- `.ͼ6 {color: var(--code-keyword);}` and one class per highlight rule.

Computed values resolved from the page's custom properties: background `rgb(234, 234, 231)` (`#eaeae7`, our `muted`), font `"JetBrains Mono", ui-monospace, monospace`, line height 21.6 px (13.5 px × 1.6), gutters `rgb(74, 79, 92)` on `muted` with a 1 px `border` line, cursor 2 px in `foreground`, drawn selection `rgb(199, 212, 255)`, matching brackets `rgb(207, 230, 216)` with a 1 px outline, a keyword span `rgb(122, 31, 162)`. Adding `.dark` to `<html>` flipped background, text and ring without touching the editor (EXECUTED). So the theme is written once; the tokens switch it.

Two cautions, EXECUTED. A theme object is a JavaScript object: the first scratch draft had two `".cm-scroller"` keys and the second silently replaced the first, leaving `font-family: monospace`. And `EditorView.theme(spec, { dark: true })` is not needed: the base theme's `&light` and `&dark` rules carry hex literals (lines 6921 to 7050), but our theme's rules on the same selectors override them; what the base theme leaves un-themed is listed next.

### 5.2 The parts that need a colour

READ, the base theme (`@codemirror/view/dist/index.js` lines 6870 to 7105) and `@codemirror/language` (lines 1848 to 1849). Each of these has a literal default we must cover.

| Part | Selector | Default to replace |
|---|---|---|
| Content ground and text | `&` | none set; inherits |
| Focus outline | `&.cm-focused` | `1px dotted #212121` |
| Caret | `.cm-content { caretColor }`, `.cm-cursor { borderLeftColor }` | `black`, `1.2px solid black` |
| Gutter ground, text, line | `.cm-gutters` | `#f5f5f5`, `#6c6c6c`, `#ddd` |
| Active line | `.cm-activeLine` | `#cceeff44` |
| Active gutter line | `.cm-activeLineGutter` | `#e2f2ff` |
| Drawn selection (`drawSelection`) | `&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground` and `.cm-selectionBackground` (unfocused) | `#d7d4f0`, `#d9d9d9` |
| Native selection | `.cm-content ::selection` | the browser's; with `drawSelection` it is forced `transparent !important` (lines 9693 to 9710), so only the drawn layer shows |
| Matching and non-matching brackets | `&.cm-focused .cm-matchingBracket`, `.cm-nonmatchingBracket` | `#328c8252`, `#bb555544` |
| Placeholder | `.cm-placeholder` | `#888` |
| Special characters | `.cm-specialChar` | `red` |
| Scrollbars | `.cm-scroller { scrollbarColor, scrollbarWidth }` | the browser's |
| Panels, search dialog, fold gutter, tooltips | `.cm-panels`, `.cm-dialog`, ... | `#f5f5f5`, `#ddd`; only if `004` adds those extensions |

The scratch theme covers every row but the last, using `--color-foreground`, `--color-muted`, `--color-muted-foreground`, `--color-border`, `--color-ring`, `--color-destructive`, `--focus-width`, `--focus-offset`, `--line-width`, `--radius`, `--spacing`, `--text-sm`, `--text-sm--line-height`, `--font-mono`, and four editor-only slots: `--code-active-line`, `--code-selection`, `--code-bracket-match`, `--code-bracket-mismatch`. INFERRED: those four and the highlight slots below are the Shiki memo's palette to define; this memo only shows they are consumed as plain variables. The cursor is drawn at `--focus-width` (2 px) rather than CodeMirror's 1.2 px; whether that reads as a cursor or a bar is a design call. `004` keeps the browser's native caret, so the question does not arise (`004` decision 9).

### 5.3 What the Python grammar emits

READ: `@lezer/python/dist/index.js` lines 266 to 298, the `styleTags` call.

| Syntax | Tag |
|---|---|
| `for while if elif else try except finally return raise break continue with pass assert await yield match case` | `controlKeyword` |
| `in not and or is del` | `operatorKeyword` |
| `from def class global nonlocal lambda` | `definitionKeyword` |
| `import` | `moduleKeyword` |
| `with as print` | `keyword` |
| `async`, `*`, `**`, format conversion and spec | `modifier` |
| `True`, `False` | `bool` |
| `None` | `null` |
| a variable | `variableName` |
| a called name `f(...)` | `function(variableName)` |
| a defined function's name | `function(definition(variableName))` |
| a defined class's name | `definition(className)` |
| an attribute `.x` | `propertyName`; called, `function(propertyName)` |
| `# ...` | `lineComment` |
| a number | `number` |
| a string; an f-string | `string`; `special(string)` |
| `\n` and other escapes | `escape` |
| `+=` and friends | `updateOperator` |
| `+ - * / // % @` | `arithmeticOperator` |
| `& | ^ ~ << >>` | `bitwiseOperator` |
| `== != < > <= >=` | `compareOperator` |
| `=` | `definitionOperator` |
| `...` | `punctuation` |
| `@` of a decorator | `meta` |
| `( )`, `[ ]`, `{ }` | `paren`, `squareBracket`, `brace` |
| `.` | `derefOperator` |
| `,` `;` | `separator` |

Not emitted by this grammar: `typeName`, `self`, `atom`, `namespace`, `labelName`, `regexp`. `self` is a `variableName`; a type annotation `x: int` is a `variableName` too (INFERRED from the table: no node maps to `typeName`). `@lezer/highlight`'s parent tags apply: `controlKeyword` and the others are children of `keyword`, `lineComment` of `comment`, `arithmeticOperator` of `operator`, `paren` of `punctuation`; a rule on the parent catches the children, and a rule on a child wins over the parent's (READ: `@lezer/highlight` `tags` definitions and `HighlightStyle` precedence, by design; EXECUTED: the `keyword` rule coloured `import`, a `moduleKeyword`).

### 5.4 A mapping onto neutral slots

INFERRED. The sibling memo, [`2026-10-31-shiki-and-a-token-highlight-palette.md`](2026-10-31-shiki-and-a-token-highlight-palette.md) §5.3, defines the neutral set: `--code-foreground`, `--code-background`, `--code-keyword`, `--code-string`, `--code-constant`, `--code-function`, `--code-comment`, `--code-link`, `--code-inserted`, `--code-deleted`, `--code-changed`, and the ANSI sixteen. Its table already names the Lezer tags each takes. Read against section 5.3's grammar table, the editor's `HighlightStyle` becomes eight rules:

| Property (Shiki memo §5.3) | Highlight tags the Python grammar emits | Note |
|---|---|---|
| `--code-keyword` | `keyword` (one rule covers `controlKeyword`, `definitionKeyword`, `moduleKeyword`, `operatorKeyword`), `modifier` | `meta` (the decorator `@`) could join it, or stay on the foreground as the Shiki memo has it |
| `--code-string` | `string`, `special(string)`, `escape` | the scratch theme gave `escape` its own slot; the Shiki memo folds it into string, which keeps the set small |
| `--code-constant` | `number`, `bool`, `null`, `atom`, `typeName` | the Python grammar never emits `typeName` (5.3), so in Python this is numbers, `True`, `False`, `None` |
| `--code-function` | `function(variableName)`, `function(propertyName)`, `function(definition(variableName))`, `definition(className)`, `className` | the Shiki memo also lists `definition(variableName)`, so an assigned name would take the function colour; INFERRED that is a weight rather than a hue there |
| `--code-comment` | `comment` (covers `lineComment`) | |
| `--code-link` | `link`, `url` | not emitted by the Python grammar |
| `--code-foreground` | `variableName`, `propertyName`, `operator` (covers arithmetic, bitwise, compare, update, definition, deref), `punctuation` (covers `paren`, `squareBracket`, `brace`), `separator`, `meta` | the editor's `&` colour; no rule needed unless a parent rule would otherwise catch them |
| `--color-destructive` | `invalid` | |

Four more properties are the editor's alone, with no Shiki counterpart: `--code-active-line`, `--code-selection`, `--code-bracket-match`, `--code-bracket-mismatch` (5.2). INFERRED: they belong in the same generated block, since the first three are tints of ground or `primary` that must pass over `muted` in both themes.

Five colours carry a Python example: keyword, string, comment, constant, function. The Shiki memo assigns them `primary`, `success`, `muted-foreground`, `foreground` or `destructive`, and `foreground` with weight, and has measured them on `muted` (its §4.1). The scratch theme's eleven slots were a wider draft; the Shiki memo's eight are enough for Python, and `HighlightStyle` maps either way.

### 5.5 Where the theme lives, and the lint

READ: `scripts/lint-literals.ts` lints every path listed under an item's `files` in `registry.json`, whatever the extension (`itemFiles`, lines 231 to 238); the registry today lists 31 `.ts` files, so a `code-editor-theme.ts` beside the component is scanned (EXECUTED: `grep -c '\.ts"' registry.json`).

EXECUTED: the repository's `lintText` on the scratch `code-editor.svelte` and `code-editor-theme.ts` reported 0 findings for each. Then on sample lines a theme might hold:

| Sample | Lint |
|---|---|
| `outline: "1px dotted #212121"` | flagged: hex colour |
| `backgroundColor: "rgb(1 2 3)"` | flagged: colour function |
| `"outline"` (the word, quoted) | flagged: outline (L4) |
| `outline: "var(--focus-width) solid var(--color-ring)"` | passes |
| `padding: "4px 0"`, `fontSize: "13px"`, `minHeight: "200px"` | pass |
| `color: "red"`, `fontFamily: "monospace"`, `borderLeft: "1.2px solid black"` | pass |
| `animation: "steps(1) cm-blink 1.2s infinite"` | passes |

Why: the lint's class tokeniser keeps a trailing colon on an object key (`outline:` splits into a variant and an empty utility, so L4 never fires) and only inspects tokens that start with a letter, so `4px` and `13px` are never looked at; named colours are checked only in arbitrary class values and SVG paint attributes. INFERRED: a theme object is the first registry file whose values are CSS, not classes. The lint catches hex and colour functions in it and nothing else. `004` either adds a rule for theme files (a length or a named colour inside a quoted CSS value) or puts the theme under review, as R3 and R7 are. Also READ: CodeMirror itself writes `style="tab-size: 4; flex-basis: …"` on `.cm-content` at run time (line 8347); that is not in our files, so the lint cannot see it and it holds no colour or size of ours.

## 6. Behaviour a home page needs

INFERRED: a sandbox's home page wants one editor under a row of example tabs, every example editable, one run and one result, the editor bundled. The toolbar has Run, Reset and a "Ctrl Enter" hint (READ: the primitives memo of 2026-10-28, §1.2).

- **The examples.** EXECUTED over a sample corpus of 29 short Python scripts for a code sandbox, not kept in this repository: 9 to 25 lines (the four tab examples 22 to 24; the Sudoku example 25); the longest line 98 characters (the fuzzy-regex example), 17 files have a line over 90. At `text-sm` (13.5 px) in JetBrains Mono the 92-character Sudoku line needed 766 px against a 640 px editor (scroll width versus client width, gutter 37 px included), so a 640 px editor scrolls horizontally on most examples; INFERRED, at about 8.1 px per character a 98-character line fits from about 850 px of content width.
- **Height.** EXECUTED: with no height set, the editor is as tall as its document: 26 lines × 21.6 px + 24 px padding = 585 px for Sudoku, 542 px for the 24-line Pandas example. INFERRED: a fixed height from the ladder (`h-96`, 384 px, about 16 lines) with the editor scrolling inside avoids the page jumping on tab change; a growing height shows every example whole. `.cm-scroller` has `overflow: auto` on both axes, so the editor scrolls itself; `scroll-area` is not needed and would double the scrollbars.
- **Wrapping.** EXECUTED: `EditorView.lineWrapping` reconfigured live; scroll width equalled client width and the editor grew from 542 to 607 px. INFERRED: wrapped code breaks Python's visual indentation; horizontal scroll is the usual choice, with the wrap left to a reader on a phone if `004` wants it. `004` sets no `lineWrapping` by default (`004` decision 9).
- **Line numbers.** `lineNumbers()` renders `.cm-lineNumbers .cm-gutterElement` right-aligned, default `padding: 0 3px 0 5px; min-width: 20px` (READ: lines 7037 to 7042). The theme sets the padding in `--spacing` steps. INFERRED: `code-block`'s numbers share the font, size, line height and `muted-foreground`; the two match when both read the same tokens.
- **Mod-Enter.** EXECUTED: `Prec.highest(keymap.of([{ key: "Mod-Enter", run }, { key: "Ctrl-Enter", run }]))`. On the Mac browser Meta-Enter fired the handler and the document's line count did not change (the default `insertBlankLine` was suppressed); Control-Enter did not fire until `Ctrl-Enter` was bound too. INFERRED: the hint must read "⌘ Enter" on a Mac and "Ctrl Enter" elsewhere, or both keys are bound as here and the hint says "Ctrl Enter" everywhere; a `kbd` that reads `navigator.platform` at mount is a client-only detail.
- **Reset and the tabs.** EXECUTED: `view.setState(EditorState.create({ doc }))` replaced the document and Mod-z then changed nothing (history gone); setting `value` dispatched a replacement and Mod-z restored the previous text. INFERRED: a tab change is a reset (new state), so a visitor cannot undo into another tab's example; Reset is the same call. A `tabs` panel that unmounts its content destroys the view with it; the app keeps each tab's text in its own state if edits must survive a tab change. One editor under the tab list, re-set on change, is simpler and is what "one editor" asks for.
- **A run in flight.** `readonly` sets `EditorState.readOnly` and `aria-readonly="true"` while keeping focus and selection working (EXECUTED). INFERRED: that, not `disabled`, is the state while the runner works, so focus does not jump when the result arrives.
- **Motion.** READ: the base theme's only animation is the cursor blink, `steps(1) cm-blink 1.2s infinite` on the focused cursor layer (lines 6952 to 6953). EXECUTED: under `prefers-reduced-motion: reduce` with `app.css`'s rule (`animation-duration: 0.01ms !important; animation-iteration-count: 1 !important`) the computed duration was 1e-05 s and the count 1: a steady cursor. Nothing else moves.

## 7. Prior art, described

**`svelte-codemirror-editor` 2.1.0** (MIT, published 2025-10-10, peers `codemirror ^6.0.0` and `svelte ^5.0.0`; EXECUTED `bun pm view`; READ `package/dist/CodeMirror.svelte`, 419 lines, from the tarball in the scratch `prior-art/`). It is one Svelte 5 component with `$bindable` `value` and about twenty boolean props, one per `basicSetup` feature.

What it does: it imports every feature package at the top, including `@codemirror/search`, `lint` and `autocomplete`, so the bundle pays for them whether or not a prop turns them on (lines 106 to 139). It creates the view in `onMount` and destroys it in `onDestroy` (lines 198 to 202). Editor to parent goes through a custom `dispatch` that calls `view.update` and then a change handler debounced by 300 ms unless `nodebounce` is set (lines 196, 204 to 217). Parent to editor calls `view.setState` with a fresh state on every `value` change (lines 235 to 251), guarded by two boolean flags and a "first update" flag against loops (lines 180 to 183, 241 to 250). Any prop change reconfigures the whole extension set with `StateEffect.reconfigure` (lines 220 to 233). `useTab` defaults to `true`, binding Tab (lines 148, 282). Its stylesheet sets `.cm-focused { outline: none }` (lines 367 to 369). On the server it renders a `<pre class="cm-editor">` of the value under a "Loading editor..." spinner with literal colours (lines 353 to 364, 380 to 392).

To learn from: `$bindable` `value` with `untrack` around the sync; the server branch's idea of a `<pre>` holding the value. To avoid: `setState` on every parent change, which also drops the history and selection, so a parent that echoes the value back (as a bound value does) would reset the editor after every edit if the flags slipped; the debounce, which makes a bound value lag 300 ms behind the editor; unconditional imports; Tab bound by default with no visible way out; and a removed focus outline, which fails SC 2.4.7. The scratch component of section 3 compares document strings instead of flags, dispatches a change rather than a new state, imports only `state` and `view`, binds no Tab, and keeps our outline.

## 8. Recommendation

INFERRED. This commits us to nothing; it is what the findings point to.

1. **Item `code-editor` (`registry:ui`)**, two files: `code-editor.svelte` (the wrapper of section 3: `onMount` view, `$bindable` `value` synced by comparison, `readonly`, `disabled`, `label`, `describedby`, `extensions`, `onrun`, `focus()`, `reset()`) and `code-editor-theme.ts` (the theme and highlight style of section 5, every value a `var(--…)`). Dependencies named and pinned: `@codemirror/state` 6.7.6, `@codemirror/view` 6.43.15, `@codemirror/language` 6.13.1, `@lezer/highlight` 1.2.5. The item itself binds no language.
2. **A preset file, `code-editor-python.ts`**, either in the same item or a sibling item, exporting variant b or d's extension array plus `@codemirror/lang-python` 6.2.1 (`pythonLanguage`, not `python()`, unless completion is wanted), `@codemirror/commands` 6.11.1 and `@codemirror/autocomplete` 6.20.4 for `closeBrackets`. About 128 to 132 KB gzip on the one route that uses it.
3. **No `basicSetup`, no `indentWithTab`.** Tab leaves the editor; Mod-] indents. If an app binds Tab to indent, the "Escape, then Tab" text goes beside the editor and into `aria-describedby`.
4. **`tabindex="0"`, `aria-label`, `aria-describedby`** through `contentAttributes`; `Ctrl-Enter` bound beside `Mod-Enter`; `readonly` during a run; `reset()` on tab change and Reset; a fixed ladder height with internal scroll, or a growing height; `004` decision 9 takes the growing height.
5. **The palette** is the Shiki memo's neutral set (`--code-foreground`, `-background`, `-keyword`, `-string`, `-constant`, `-function`, `-comment`, `-link`, and the diff and ANSI slots), plus four editor-only properties: `--code-active-line`, `--code-selection`, `--code-bracket-match`, `--code-bracket-mismatch`. All defined once in the generated CSS from tokens, consumed by both the editor's `HighlightStyle` and `code-block`.
6. **The lint** gains a rule for CSS values in a theme file (a length, or a named colour, inside a quoted value), or `004`'s checklist assigns theme files to review.
7. **A prerendered `<pre>` fallback** inside the component, swapped on mount.

## 9. What this memo does not settle

- **The colours.** Answered by `004`: no drawn selection, so the selection is the browser's own; the active line is an opaque `card` step; a matching bracket takes an `input` outline and a mismatch `destructive` (`004` decisions 5 and 9).
- **Hydration on a slow device.** The `<pre>` to editor swap was seen only in headless Chromium on a desktop machine; its length on a phone was not measured.
- **Firefox and Safari.** This release checks Chromium only (decisions.md, "After the public-readiness review"). CodeMirror special-cases Firefox 153's selection styling (READ, line 9692), so the engines differ.
- **A real screen reader.** No screen reader has been run; the tests prove the DOM contract (same entry).
- **Touch.** CodeMirror draws selection handles on touch; their colour (`currentColor`) and size were not reviewed. No touch device is among this release's checks.
- **Completion.** Answered: none; the preset uses `pythonLanguage`, not `python()` (`004` decision 9).
- **Whether `shadcn-svelte add` installs `@codemirror/*` at the pinned versions.** Answered: `004`'s smoke test installs the editor and finds each package at its pinned range in the app (`tests/smoke/code-add.test.ts`).
- **The exact line metrics.** The editor and `code-block` read the same font, size and line-height tokens; whether their line numbers align pixel for pixel is not measured.

**In one line:** CodeMirror 6 wraps in a 130-line Svelte 5 component created in `onMount`, costs 126 to 132 KB gzip on one route, prerenders to a `<pre>`, takes every colour and size from `var(--…)` tokens through style-mod, leaves Tab unbound so there is no trap, and needs a `tabindex="0"` on its content and a palette the Shiki memo must supply.
