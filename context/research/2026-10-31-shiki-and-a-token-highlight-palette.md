# Shiki and a token highlight palette

- **Status:** complete
- **Date:** 2026-10-31
- **Owner:** Clay Gendron (research executed by an agent, Claude, sub-agent of the orchestrating session)
- **Question:** Can a `code-block` item highlight code with Shiki so that every colour comes from our tokens in both themes, passes WCAG 2.2 AA as text on its ground, and the same palette can also drive a CodeMirror 6 editor? Another memo covers CodeMirror; this one provides the palette and the slot list it will map to.
- **What it blocks:** specification `004` (the code block: its code and its token data); through it, `wasi-python-dev`'s home page (the install snippet, the output panel, and code in the later chat pane).

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-10-31, macOS (Darwin 25.5.0, arm64), Bun 1.3.14. `bun pm view` ran at 23:06 UTC.
- **READ**: a source says so. Each source was read on 2026-10-31. Paths in the prior-art clone are relative to `context/prior_art/shadcn-svelte/`, at commit `6149e14`. Paths in the first app are relative to `/Users/claygendron/Git/Repos/wasi-python-dev/context/`, read only. Shiki's own source was read in the scratch installs named below.
- **INFERRED**: our reasoning.

Scratch work lives in the session scratchpad, folder `research-shiki/`: `view/` (the registry queries), `s4/` (shiki 4.5.0 plus the CodeMirror packages; `render.ts`, `cmp.ts`, `custom.ts`, `hs.ts`, `lezer2.ts`, `bundle/`), `s3/` (shiki 3.23.0; `render3.ts`, `bundle/`), `stock/` (copies of the stock files the lint ran on), and `scripts/` (`lines.ts`, `contrast-table.ts`, `lint-stock.ts`). Nothing was written to this repository except this memo. No package was installed into it.

This memo builds on the primitives memo ([`2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md`](2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md), §1.3, §3, §4 and §6.2), which already found what the stock `code-block` is, its lint counts, and the shiki versions as of that date. It does not repeat those.

Terms of art used below.

- **Shiki.** A syntax highlighter that runs TextMate grammars (the grammar files VS Code uses) and emits HTML or tokens.
- **Scope.** The dotted name a TextMate grammar gives a piece of text, such as `keyword.control.import.python`. A theme colours text by scope.
- **Slot.** In this memo, one of the CSS variables Shiki's CSS-variables theme writes, such as `--shiki-token-keyword`. A theme maps many scopes onto one slot.
- **Engine.** The regular-expression matcher Shiki runs grammars with. **Oniguruma** is the original, compiled to WebAssembly (WASM). The **JavaScript regex engine** translates each grammar pattern to a native JavaScript regular expression, so no WASM is loaded.
- **Lezer.** CodeMirror 6's parser system. **Tags** (`@lezer/highlight` `tags`) are its equivalent of scopes: `keyword`, `string`, `function(variableName)`. A **HighlightStyle** maps tags to CSS.
- **Ground.** The surface a component sits on; its background token.
- **ANSI** and **SGR.** Terminal escape codes that set text colour and weight, such as `ESC[31m` for red. Shiki treats them as a language named `ansi`.
- **Text-safe.** A colour that reaches 4.5:1 on its ground, so WCAG 2.2 SC 1.4.3 allows it for text.

## In short

- **Yes, with the CSS-variables theme.** Shiki's `createCssVariablesTheme` writes every token colour as `style="color:var(--shiki-token-keyword)"`, nothing else (EXECUTED, §3.1). It exists in both 3.23.0 and 4.5.0, the function bodies differ only in formatting, and the rendered HTML for a Python and an ANSI sample is byte-identical between the two (EXECUTED, §1 and §3). A hand-made theme object may also use `var()` colours and add `font-style` or `font-weight` per scope (EXECUTED, §3.4).
- **The palette needs five text tokens we already have, and no new hue.** On the `muted` ground every candidate passes AA in both themes: `foreground` 15.00 / 12.83, `muted-foreground` 6.79 / 6.13, `primary` 4.90 / 5.22, `success` 5.23 / 6.55, `destructive` 4.71 / 5.53 (EXECUTED, §4.1). `input` fails text at 3.27 / 3.31. Amber fails light text at 1.61.
- **Fourteen slots, 32 ANSI variables.** The theme uses `--shiki-foreground`, `--shiki-background`, eleven `--shiki-token-*` and three diff slots, plus 16 ANSI colours and a `-dim` variant of each (READ and EXECUTED, §3.2). For Python, 34% of tokens land in `punctuation`, 16% in `keyword`, 16% in `foreground`, 12% in `constant`, 11% in `string-expression`, 9% in `function`, 1% in `comment`; `token-string` gets none (EXECUTED over the 29 examples, §3.3).
- **Bundle cost.** Core plus the JavaScript engine (ANSI included) is 55.9 KB gzipped; plus Python, bash and JSON, 70.6 KB (284.6 KB minified). The Oniguruma engine with its inlined WASM is 284.3 KB gzipped. ANSI costs nothing extra: its parser is inside core (EXECUTED, §3.5). Highlighting can run at build time, so a static snippet ships no Shiki at all (READ and INFERRED, §3.6).
- **Shiki 4.5.0 is the version to test against** and `^4.5.0` the range to name (INFERRED, §1.4). 3.x ended at 3.23.0 two days before 4.0.0; 4.0 only dropped Node 18 and deleted deprecated names.
- **The stock files fail our rules on 21 points by the lint and 12 more in their maia CSS**, mostly `cn-` markers, three `style` attributes, `outline-none`, a `dark:` variant, the `ring-[3px] ring-ring/50` halo, tints and off-ladder sizes (EXECUTED, §2.3). Two rules the lint cannot see matter more: the `bg-muted` line tints vanish on a `muted` ground, and `bg-destructive/10` is forbidden inside one (§2.4).
- **One palette for two engines works through a neutral set of CSS properties** (`--code-*`) that Shiki's theme and CodeMirror's HighlightStyle both read; the two engines disagree on where decorators, operators, builtin types, docstrings and `self` land, so the mapping table in §5.2 is per engine (EXECUTED for both, §5).

## 1. Shiki, the versions

EXECUTED: `bun pm view shiki`, `bun pm view shiki time`, `bun pm view shiki versions`, `bun pm view shiki@3.23.0`, from a scratch folder with its own `package.json`.

| Version | Published | Licence | `peerDependencies` | `engines` | Dependencies |
|---|---|---|---|---|---|
| 4.5.0 (latest) | 2026-10-01 | MIT | none | `node >=20` | `@shikijs/core`, `langs`, `types`, `themes`, `engine-oniguruma`, `engine-javascript` (all 4.5.0), `@shikijs/vscode-textmate ^10.0.2`, `@types/hast ^3.0.5` |
| 3.23.0 (newest 3.x) | 2026-02-25 | MIT | none | none | the same set at 3.23.0, `@types/hast ^3.0.4` |

The 4.x line: 4.0.0 on 2026-02-27, 4.0.1, 4.0.2 (March), 4.1.0 (May), 4.2.0 (June), 4.3.0, 4.3.1 (June, July), 4.4.0 to 4.4.3 (July, August), 4.5.0 (October). No 3.x release followed 4.0.0 (EXECUTED: the `versions` list). INFERRED: the 3.x line is closed.

### 1.1 What 4.x changed

READ, 2026-10-31: the v4 blog post (`shiki.style/blog/v4`), the migration guide (`shiki.style/guide/migrate`) and the GitHub releases page.

- **4.0.0:** "drops support for Node.js 18 and remove deprecated APIs." The removed names are two typos (`createdBundledHighlighter`, `CreatedBundledHighlighterOptions`), a `theme` option on a Vitepress plugin, and a misspelt CSS class. The migration guide: "v4.0 only drops support for Node.js 18 and remove deprecated APIs."
- **4.0.2:** the `ansi` language works with multiple themes.
- **4.2.0:** new `@shikijs/stream` and `@shikijs/magic-move` packages. **4.3.0:** a Svelte renderer in `@shikijs/stream`. **4.3.1:** a `type` field on `ThemedToken`.
- **4.5.0:** the JavaScript engine reuses each pattern's last search within a line (a performance change); `codeToANSI` takes a colour level; WASM memory disposal fixes.
- Nothing in 4.x touched `createCssVariablesTheme` or the theme format.

What 3.0 had changed (READ: `shiki.style/blog/v3`): the engines left core (`shiki/engine/javascript`, `shiki/engine/oniguruma`), WASM stopped being a hard requirement, `loadWasm` became `engine`, `getHighlighter` became `createHighlighter`. The stock `highlighter.ts` already uses that 3.x shape, so it is also the 4.x shape (INFERRED).

### 1.2 `createCssVariablesTheme` in both lines

EXECUTED: the function is exported from `@shikijs/core/dist/index.mjs` in both installs, re-exported by `shiki/core`. A `diff` of the two bodies (whitespace stripped) shows only formatting and one comment. Rendering the sudoku example (`random/25-sudoku.py`) and an ANSI string with the same theme name in both versions produced byte-identical HTML (`s3/py3.html` against `s4/py4.html`, `ansi3.html` against `ansi4.html`).

READ (`shiki.style/guide/theme-colors`, "CSS Variables Theme"): the theme "is not included by default and must be registered explicitly"; its options are `name` (`'css-variables'`), `variablePrefix` (`'--shiki-'`), `variableDefaults` (`{}`) and `fontStyle` (`true`); it "is provided mainly for easier migration" and is "a lot less granular than most of the other themes". The page recommends building a theme by hand or using colour replacements for finer control. §3.4 shows the hand-made route works with our variables.

### 1.3 The JavaScript engine and the Python grammar

EXECUTED: `shiki/engine/javascript` exports `createJavaScriptRegexEngine`, `createJavaScriptRawEngine` and `defaultJavaScriptRegexConstructor` in 4.5.0. The Python grammar holds 352 regular-expression patterns; every one compiles under the engine in strict mode (`forgiving: false`), so Python needs no forgiving fallback. The bash and JSON grammars were not checked the same way. `@shikijs/langs-precompiled` exists at 4.5.0 and was not tested.

### 1.4 Which version `004` should pin (INFERRED)

`001` decision 4: a package a registry item names gets a caret range at the tested version. The stock items name `^3.20.0`, which resolves to 3.23.0 today and can never reach 4.x. Pinning our item there means starting on a closed line. Nothing we use differs between 3.23.0 and 4.5.0 (§1.2), and 4.x is eight months and twelve releases old. **Test against 4.5.0 and name `^4.5.0`.** The `engines` field (`node >=20`) is advisory; Bun does not enforce it, and the app's bundler runs on Bun (EXECUTED: the scratch install of 4.5.0 gave no warning).

## 2. How the stock pieces work

READ, all paths under `docs/src/lib/registry/`. Described, not copied.

### 2.1 `lib/highlighter.ts` (132 lines)

- Lines 1 to 7 import `createHighlighterCore` from `shiki/core` and `createJavaScriptRegexEngine` from `shiki/engine/javascript`. Line 45 creates the engine with `forgiving: true`.
- Lines 10 to 25 list fourteen languages as lazy imports of `shiki/langs/<name>.mjs`: bash (as `shellscript`), css, diff, html, javascript, json, jsx, markdown, python, sql, svelte, tsx, typescript, yaml. Lines 27 to 37 give aliases (`py`, `sh`, `zsh`, `ts`, `yml`, and so on).
- Line 43 loads two themes, `github-light` and `github-dark`. Lines 105 to 112 tokenize with `themes: { light, dark }` and `defaultColor: false`, so each token carries a `--shiki-light` and a `--shiki-dark` variable instead of a colour.
- Lines 75 to 83 turn each token into `{ content, style, class }`: `style` is the token's `htmlStyle` object joined into a string, and `class` is the literal `text-(--shiki-light) dark:text-(--shiki-dark)`. That is where the `dark:` variant and the inline style come from.
- Lines 54 to 56 treat `ansi` as a language that needs no grammar. Lines 116 to 117 tokenize ANSI line by line, because ANSI has no grammar state to carry across lines (the comment at lines 114 to 115 says so).
- Lines 89 to 125, `loadHighlighter`, load a language on first use and return a `highlight(code, state)` function that also returns the grammar state after the last line, for streaming. Lines 128 to 132, `highlightCode`, is the one-shot form the docs use for server rendering.

### 2.2 `hooks/use-highlighted-code.svelte.ts` (98 lines)

- Line 23 takes two getters, `value()` and `language()`. Lines 29 to 44 load the highlighter in an `$effect`, cancelled when the language changes.
- Lines 55 to 91 compute the lines in a `$derived`. Until the highlighter loads, each line is a plain string (line 63). Then only the lines after the last complete newline are tokenized, continuing from the saved grammar state (lines 72 to 83); the last, unfinished line is tokenized on every change (lines 87 to 90). A trailing newline is dropped (line 58).

### 2.3 `ui/code-block/` (nine files)

- **`code-block.svelte`** (47 lines): the root `<div data-slot="code-block">` with `data-variant` (`default`, `destructive`) and `data-size` (`default`, `sm`) attributes; its classes are `cn-` markers plus `relative flex w-full min-w-0 flex-col overflow-hidden`. The look lives in the maia CSS (next list).
- **`code-block-header.svelte`**, **`-title.svelte`**, **`-actions.svelte`**, **`-footer.svelte`** (20 to 23 lines each): flex rows carrying `cn-` markers. `actions` (line 17) becomes absolute, hidden until hover, focus-within or a coarse pointer, when it is a direct child of the root.
- **`code-block-copy-button.svelte`** (69 lines): a `button` at `variant="ghost" size="icon-xs"`, `aria-label` "Copy" or "Copied", writes to `navigator.clipboard` and resets after 2 s (lines 23 to 32); a polite `sr-only` live region announces "Copied" (line 69). Its icons are `IconPlaceholder`s that `add` maps to `CheckIcon` and `CopyIcon`.
- **`code-block-content.svelte`** (61 lines): a `<pre data-slot="code-block-content" dir="ltr" tabindex={0}>` (lines 49 to 55) with a `style` attribute setting `counter-reset: line {startLine - 1}` (line 56). Props: `code`, `wrap`, `lineNumbers`, `startLine`. A `code` string with `lineNumbers` is split into lines (lines 25 to 27). Classes: `overflow-auto font-mono outline-none`, `scroll-fade-x scrollbar-thin`, and under `data-wrap` `whitespace-pre-wrap wrap-break-word`. The `<code>` inside is a grid (`grid-cols-[auto_1fr]` when numbered).
- **`code-block-line.svelte`** (72 lines): a `<span data-slot="code-block-line">` whose `before` pseudo-element prints `counter(line)` (so numbers are not copied; `/ ''` makes them silent to screen readers) and whose `after` prints a `+` or `−` marker. Variants `default`, `added`, `removed`, `highlighted`. A token is rendered as `<span style={token.style} class={token.class}>` (line 62). An empty line holds a newline so copying keeps blank lines (lines 49 and 59).
- **`index.ts`**, **`meta.json`**: exports, and `registryDependencies: ["use-highlighted-code"]`.

The look, in `styles/style-maia.css` lines 1689 to 1740: `rounded-xl text-sm` (`sm`: `text-xs rounded-lg`); a focus halo on the root when the `pre` has focus (`ring-[3px] ring-ring/50`, `border-ring`); the default variant `border border-input text-foreground dark:bg-input/30`; the destructive variant `border-destructive/30 text-destructive dark:border-destructive/40`; header and footer `px-4 pt-4` / `pb-4` in `text-muted-foreground`; the title `font-sans text-sm font-medium`; floating action buttons get `bg-background ring-1 ring-foreground/10`; content `px-4 py-4 leading-relaxed`, tighter under a header; line numbers `min-w-6 text-end text-muted-foreground`; `highlighted` and `added` lines `bg-muted`; `removed` lines `bg-destructive/10` with a `text-destructive` marker.

The doc (`docs/content/components/code-block.md`): a `code` string renders as one text node and streams cheaply (line 109); line numbers and markers are left out of a selection (line 110); "It highlights without WASM" (line 112); `tabindex={0}` so the content scrolls by keyboard, `tabindex={-1}` removes the stop (line 499); `highlightCode` "returns plain data, so you can call it in a `load` function. Shiki then stays out of the client bundle" (line 401); "ANSI colors do not carry from one line to the next" (line 397).

### 2.4 What fails our rules

EXECUTED: `lintText` from `scripts/lint-literals.ts` (its CLI takes no file arguments; it lints the registry's own items, so a scratch script imported the function) on scratch copies of the eleven files, and on the maia CSS block as text.

| File | Count | Findings |
|---|---|---|
| `code-block.svelte` | 3 | `cn-` markers |
| `code-block-header`, `-title`, `-actions`, `-footer`, `-copy-button` | 1 each | `cn-` marker |
| `code-block-content.svelte` | 4 | `style=` (the counter reset), `outline-none`, two `cn-` markers |
| `code-block-line.svelte` | 7 | `style=` and `.style` (the token style), five `cn-` markers |
| `highlighter.ts` | 2 | a `style` object key; `dark:text-(--shiki-dark)` |
| `use-highlighted-code.svelte.ts` | 0 | |
| maia CSS, lines 1689 to 1740 | 12 | `ring-[3px]`, `ring-ring/50`, `dark:bg-input/30`, `border-destructive/30`, `dark:border-destructive/40`, `me-1.5` ×2, `size-3.5`, `ring-1`, `ring-foreground/10`, `leading-relaxed`, `pt-1.5` |

Total 21 in the files, 12 in the CSS. The `002` checklist rules the lint cannot see (`002` lines 248 to 297), INFERRED from the reading above:

- **R2, focus.** The halo is drawn on the root through `has-[…]:ring-*`. Our recipe is the `:focus-visible` outline on the `pre` itself (`001` decision 13); `outline-none` goes.
- **R5 and R21, sizes.** The copy button is `icon-xs`, under 24 px; `002` has `size-8` and `size-12` only. The title's `size-3.5` icon is off the ladder.
- **R7 and R8, the ground.** `001` decision 8 names "code grounds" among the allowed `muted` insets. But the stock's `highlighted` and `added` lines are `bg-muted`: on a `muted` ground they vanish. And `removed` lines are `bg-destructive/10`, which R7 forbids on or inside `muted`. On a `card` ground both stock tints are allowed (`bg-destructive/10` over `card` is a sanctioned pair, `001` decision 12). §6 lays out the options.
- **R9, radius.** `rounded-xl` and `rounded-lg` become the one `rounded`.
- **R12, `dark:`.** The token class `dark:text-(--shiki-dark)` exists only because the stock theme is two literal palettes. One variable palette that switches with `.dark` removes it.
- **R13, type.** `leading-relaxed` is not on the token scale; the lint calls it "line height".
- **R15, icons.** `IconPlaceholder` becomes `phosphor-svelte`'s `CopyIcon` and `CheckIcon`.
- **R19.** Diff lines already carry `+` and `−` beside their tint.
- **R20.** Every root keeps its `data-slot`; a highlighted token has none.
- **The two `style` attributes.** The counter reset and the per-token colour. The primitives memo left "a CSS variable set from a token through `style`" to `002` (§3, "chart"). §3.7 shows a way that needs no `style` at all.

## 3. The CSS-variables theme, executed

EXECUTED in `s4/` with shiki 4.5.0, `createHighlighterCore`, `createJavaScriptRegexEngine({ forgiving: true })`, and `createCssVariablesTheme({ name: "pluto-vars" })`. Languages loaded from `shiki/langs/python.mjs`, `shellscript.mjs` and `json.mjs`. Samples: `random/25-sudoku.py`; `pip install wasi-python` plus a second shell line; a JSON object shaped like a run result; and a string with SGR codes 31, 1;31, 32, 33, 34, 35, 36, 90, 2 and 41.

### 3.1 The HTML shape

`codeToHtml` wraps the code in `<pre class="shiki pluto-vars" style="background-color:var(--shiki-background);color:var(--shiki-foreground)" tabindex="0"><code>`, one `<span class="line">` per line, and one `<span style="color:var(--shiki-token-keyword)">` per token. A token's `style` carries only `color`, plus `font-weight:bold`, `font-style:italic` or `background-color:var(--shiki-ansi-red)` when a scope or an SGR code asks for one. No class on a token, no hex anywhere. With `codeToTokens`, which the stock hook uses, each token is `{ content, offset, color: "var(--shiki-token-keyword)", fontStyle: 0 }`; `fontStyle` is a bit field (bold 2, italic 1, underline 4), and `htmlStyle` is absent. `htmlStyle` appears only with the `themes` (dual) option, as `{ "--shiki-light": …, "--shiki-dark": … }`. So a single-theme item builds its style from `color` and `fontStyle`, or from the exported `getTokenStyleObject(token)`, which returned `{ color: "var(--shiki-token-keyword)" }` for a keyword.

How the variables survive: a loaded theme's `settings` hold placeholder colours `#00000001`, `#00000002`, … in place of the `var()` strings (EXECUTED: `getTheme("pluto-vars").settings`), and the output holds the strings again. INFERRED: Shiki maps non-hex colours to placeholders and back through its colour-replacement table; that is a general mechanism, which §3.4 confirms for a hand-made theme.

### 3.2 The full variable list

READ: `@shikijs/core/dist/index.mjs`, `createCssVariablesTheme`, from line 1239 in the 4.5.0 build; confirmed against the docs page.

| Group | Variables |
|---|---|
| Base | `--shiki-foreground`, `--shiki-background` |
| Tokens | `--shiki-token-constant`, `-string`, `-comment`, `-keyword`, `-parameter`, `-function`, `-string-expression`, `-punctuation`, `-link` |
| Diff | `--shiki-token-inserted`, `-deleted`, `-changed` (the docs page omits these three; the source has them) |
| ANSI | `--shiki-ansi-black`, `-red`, `-green`, `-yellow`, `-blue`, `-magenta`, `-cyan`, `-white`, and `--shiki-ansi-bright-<each>` |
| ANSI dim | `-dim` appended to any of the 16 when SGR 2 is set, such as `--shiki-ansi-green-dim` (EXECUTED; READ `dimColor` in the ANSI tokenizer: "adds … the -dim postfix to a CSS variable") |

Shiki defines none of these; the page's CSS must. `variablePrefix` changes `--shiki-` to anything; the `token-` and `ansi-` infixes are fixed by the function (EXECUTED with `--code-`: tokens came out as `var(--code-token-keyword)`). `fontStyle: true` adds italic, bold or underline only for markdown scopes (`emphasis`, `strong`, headings, links); every Python, bash and JSON token rendered with `fontStyle: 0`.

Which scopes feed each slot, for the languages we need (READ, the same source):

- `token-keyword`: `keyword` (which in Python includes every operator, `keyword.operator.*`), `storage.type` (`def`, `class`), `storage.modifier`, JSON property names (`support.type.property-name.json`), the `f` prefix and `!r` of an f-string.
- `token-function`: `entity.name.function`, `entity.name.type` (a class name), `support.function` (builtins), `meta.function-call` (a called name), decorators.
- `token-constant`: `constant.numeric`, `constant.language` (`None`, `True`), `support` (builtin types `str`, `int`), f-string `{` `}` placeholders.
- `token-string-expression`: `string.quoted`, `string.interpolated`; `token-string`: bare `string` and bash's unquoted arguments.
- `token-comment`: `comment` and `string.quoted.docstring.multi`.
- `token-parameter`: `variable.parameter.function` (`self`, `qty`).
- `token-punctuation`: separators and brackets **inside call arguments and dict literals** only (`punctuation.separator`, `punctuation.definition.arguments`, `meta.function-call.arguments`). A `(` that opens a `def`'s parameter list is `foreground`. INFERRED: with two colours for the slots, a line such as `def ok(i, d):` shows `(` in one colour and `,` in another; if `punctuation` and `foreground` share a token, nothing odd shows.

### 3.3 Where the samples' tokens land

EXECUTED: `codeToTokens`, counting non-blank tokens.

| Slot | 29 Python examples (3,925 tokens) | bash (2 lines) | JSON (7 lines) | What landed there |
|---|---|---|---|---|
| `token-punctuation` | 1,343 (34.2%) | 0 | 9 | `(`, `)`, `,`, `.`, `[` inside calls; JSON `:` `,` |
| `token-keyword` | 647 (16.5%) | 0 | 5 | `import`, `as`, `for`, `=`, `*`, `-`, `f`, `:,.2f`; JSON keys |
| `foreground` | 613 (15.6%) | 6 | 12 | names, `[`, `]`, `(` outside calls; JSON `{` `}` `[]` |
| `token-constant` | 475 (12.1%) | 0 | 3 | numbers, `None`, `True`, `str`, `__version__`; JSON `0`, `null` |
| `token-string-expression` | 430 (11.0%) | 1 | 1 | every quoted string |
| `token-function` | 361 (9.2%) | 2 | 0 | `print`, `DataFrame`, `groupby`, `linspace`; bash `pip`, `python` |
| `token-comment` | 45 (1.1%) | 0 | 0 | `#` comments, docstrings |
| `token-parameter` | 11 (0.3%) | 0 | 0 | `self`, `n`, `row` |
| `token-string` | 0 | 5 | 0 | bash `install`, `wasi-python`, `-m` |

ANSI sample: SGR 31 gave `color:var(--shiki-ansi-red)`; 1;31 added `font-weight:bold`; 90 gave `--shiki-ansi-bright-black`; 2;32 gave `--shiki-ansi-green-dim`; 41 gave `background-color:var(--shiki-ansi-red)` with `color:var(--shiki-foreground)`; unstyled text is `foreground`.

### 3.4 A hand-made theme with our names and font styles

EXECUTED (`s4/custom.ts`): a plain theme object (`name`, `type`, `colors`, `tokenColors`) whose colours are `var(--code-fg)`, `var(--code-keyword)` and so on, with `fontStyle: "italic"` on comments and `"bold"` on function names, loaded beside the generated one. Output: `<span style="color:var(--code-comment);font-style:italic"># note</span>`, `<span style="color:var(--code-fg);font-weight:bold"> print</span>`, and `keyword.operator` sent to `var(--code-fg)` so `*` and `=` stopped being keywords. ANSI with `terminal.ansiRed: var(--code-ansi-red)` gave `var(--code-ansi-red)` and `var(--code-ansi-red-dim)`. So the variable names, the scope grouping and the font styles are all ours to set, in one object of about 30 lines; `createCssVariablesTheme` is a convenience, not a requirement (INFERRED from the two runs).

### 3.5 Bundle cost

EXECUTED: `bun build <entry>.ts --target=browser --minify --outdir …`, then `gzip -9`. One output file each. Each entry creates a highlighter and renders one line, so nothing is tree-shaken away that the item would need.

| Bundle | 4.5.0 minified | 4.5.0 gzipped | 3.23.0 minified | 3.23.0 gzipped |
|---|---|---|---|---|
| core + JS engine + CSS-variables theme, no grammar (ANSI only) | 170,249 | 55,964 | 169,660 | 55,639 |
| + Python | 240,330 | 64,799 | 239,741 | 64,443 |
| + Python + bash + JSON (a) | 284,598 | 70,614 | 284,009 | 70,269 |
| (b) = (a) + ANSI | same as (a) | same | same | same |
| (a) with `github-light` + `github-dark` instead of the variables theme | 303,227 | 73,082 | 302,638 | 72,746 |
| (a) with the Oniguruma engine, WASM inlined | 855,287 | 284,259 | 855,084 | 284,066 |

ANSI adds nothing: its parser (`ansi-sequence-parser`) is compiled into `@shikijs/core` (EXECUTED: one `#region` in the core build). The grammars are the weight: `python.mjs` is 77,130 bytes raw, `shellscript.mjs` 45,421, `json.mjs` 3,193. `onig.wasm` alone is 466,610 bytes (148,262 gzipped). The variables theme saves 18.6 KB minified, 2.5 KB gzipped, against the two GitHub themes. The two shiki lines differ by under 600 bytes.

### 3.6 Build time or run time

READ (`code-block.md` lines 399 to 431): `highlightCode` is async and returns plain data, for a `load` function. Our preview app and `wasi-python-dev` build with `@sveltejs/adapter-static` (`001` decision 3). INFERRED:

- **Static code, such as the install snippet**, highlights at prerender. The page ships the token data (an array of `{ content, color }` per line) and zero Shiki bytes. The `code-block` item renders tokens it is given; it need not import Shiki at all.
- **Run output is dynamic.** A client that highlights it needs core plus the engine: 55.9 KB gzipped for ANSI alone, 70.6 KB with the three grammars. But run output is text, and CPython colours tracebacks only for a terminal (READ, 2026-10-31, `docs.python.org/3/using/cmdline.html`, "Controlling color": colour is on by default "in certain situations such as when displaying tracebacks"; `TERM=dumb`, `NO_COLOR` and `PYTHON_COLORS=0` turn it off; `PYTHON_COLORS` is new in 3.13). The sandbox gives the program no terminal, so its stderr carries no escape codes unless the program writes them itself (INFERRED). A plain `<pre>` with no highlighter is the likely answer for the output panel, with the ANSI path as an option for programs that print colour.
- **Code in the chat pane** streams. The stock hook's incremental path (§2.2) is built for that and needs the client bundle.

### 3.7 Passing the lint without a `style` attribute (INFERRED)

The lint flags every `style=` (§2.4). The header comment of `scripts/lint-literals.ts` says "the CSS-variable form `-(--token)` is always allowed". So an item can turn each slot into a class instead of a style: `var(--code-keyword)` becomes `text-(--code-keyword)`, which Tailwind compiles to `color: var(--code-keyword)`. The item would hold a literal table of the fourteen class strings, so Tailwind's scanner sees them. Font styles map the same way (`italic`, `font-medium`). The counter reset for line numbers can move to CSS as well (a `[counter-reset:line]` arbitrary property holds no length or colour, which the lint allows), with `startLine` set as a CSS variable or a `style` the lint would still flag; `004` decides that one case. Not tested here.

## 4. The palette, computed

### 4.1 Every candidate on every ground

EXECUTED: `contrastRatio` from `scripts/contrast.ts` over the primitives in `tokens/pluto.tokens.json`, truncated, never rounded up. AA for text is 4.5; for non-text, 3.

Light theme:

| Text | `muted` (wash `#EAEAE7`) | `card` (raised `#FFFFFF`) | `background` (paper `#F7F7F4`) |
|---|---|---|---|
| `ink` `#14161C` (`foreground`) | **15.00** | **18.08** | **16.84** |
| `ink-soft` `#4A4F5C` (`muted-foreground`) | **6.79** | **8.18** | **7.63** |
| `blue` `#2456E6` (`primary`) | **4.90** | **5.91** | **5.51** |
| `red-text` `#C42A1F` (`destructive`) | **4.71** | **5.67** | **5.29** |
| `green-text` `#136E3E` (`success`) | **5.23** | **6.31** | **5.87** |
| `line-input` `#7C808B` (`input`) | 3.27 non-text only | 3.94 non-text only | 3.67 non-text only |
| `red` `#E23A2E` (fill) | 3.57 non-text only | 4.30 non-text only | 4.01 non-text only |
| `green` `#1E9E56` (fill) | 2.86 fails | 3.45 non-text only | 3.21 non-text only |
| `amber` `#F0AE12` | 1.61 fails | 1.95 fails | 1.81 fails |

Dark theme:

| Text | `muted` (ink-wash `#2B2D32`) | `card` (ink-raised `#1E2129`) | `background` (ink `#14161C`) |
|---|---|---|---|
| `paper` `#F7F7F4` (`foreground`) | **12.83** | **14.99** | **16.84** |
| `paper-soft` `#A9ADB8` (`muted-foreground`) | **6.13** | **7.17** | **8.05** |
| `blue-lifted` `#7A9BFF` (`primary`) | **5.22** | **6.10** | **6.85** |
| `red-lifted` `#FF7D73` (`destructive`) | **5.53** | **6.46** | **7.26** |
| `green-lifted` `#4CC982` (`success`) | **6.55** | **7.65** | **8.59** |
| `paper-line-input` `#787C8A` (`input`) | 3.31 non-text only | 3.86 non-text only | 4.34 non-text only |
| `amber` `#F0AE12` | 7.06 | 8.25 | 9.27 |

Bold is 4.5 or better. Every semantic text token passes on every ground in both themes. `input` never reaches text. Amber passes arithmetically in dark but the brand forbids it as text (v2 §03, `001` decision 8: `caution` is "Never text"). The tightest pair is `primary` on light `muted`, 4.90; `destructive` on light `muted`, 4.71, is already a `001` contrast row.

Between text colours the ratios are small: `ink` against `blue` 3.05, `ink` against `ink-soft` 2.20, `paper` against `blue-lifted` 2.45 (EXECUTED). INFERRED: WCAG sets no minimum between two text colours, but these numbers say the palette is quiet, as v2 wants.

### 4.2 The mapping (INFERRED)

Five semantic tokens, nothing new. Every colour is text-safe on `muted`, `card` and `background` in both themes (§4.1).

| Shiki slot | Token | Light / dark | Why |
|---|---|---|---|
| `foreground` | `foreground` | `ink` / `paper` | the body of the code |
| `background` | the ground (`muted` or `card`, §6) | | |
| `token-keyword` | `primary` | `blue` / `blue-lifted` | the one brand accent; 16.5% of Python tokens, so it stays readable, not loud. If a hand-made theme sends `keyword.operator` to `foreground` (§3.4), it drops to about 6% |
| `token-string`, `token-string-expression` | `success` | `green-text` / `green-lifted` | the one other text-safe hue; strings are 11% |
| `token-constant` | `foreground` | | option A: numbers and `None` in ink, so `destructive` keeps meaning error. Option B: `destructive` (`red-text` / `red-lifted`, 4.71 / 5.53), the usual third hue, at the cost of red meaning two things on one page |
| `token-function` | `foreground`, weight `medium` | | a name defined or called; told apart by weight, not colour |
| `token-parameter` | `foreground` | | 0.3% of tokens; a colour of its own buys nothing |
| `token-comment` | `muted-foreground` | `ink-soft` / `paper-soft` | recedes; optional italic |
| `token-punctuation` | `foreground` | | the same token as `foreground`, because Shiki colours only the punctuation inside calls (§3.2) |
| `token-link` | `primary`, underlined | | as links elsewhere |
| `token-inserted` | `success` | | diff `+` lines |
| `token-deleted` | `destructive` | | diff `−` lines |
| `token-changed` | `primary` | | amber would be the convention, and amber is never text |

What tells apart two slots that share a colour: in the generated theme, **nothing** (every code token has `fontStyle: 0`, §3.2). In a hand-made theme, **weight or italic** (§3.4). A `function` in `font-medium` and a `comment` in italic cost no colour. Two cautions, not measured here: JetBrains Mono keeps one advance width across weights because it is monospaced by design, so medium names do not shift columns (INFERRED, not measured); and whether `@fontsource-variable/jetbrains-mono` as `001` installs it includes the italic face was not checked (§9).

Does a reader who cannot see colour still read the code? Yes (INFERRED). Highlighting adds nothing the characters do not already say; a keyword is a keyword with or without blue. `001`'s rule that state is never told by colour alone (`002` R19) concerns state, not syntax. The one place colour does carry state is a diff, and there the stock `+` and `−` markers already cover it (§2.3). If the output panel colours all of stderr red, that is state: it needs a label such as "stderr" beside the colour.

### 4.3 The ANSI sixteen (INFERRED, from §4.1)

The brief for this memo says the app's output panel shows stderr in red; that statement was not found in the app's `context/` (EXECUTED: grep of its memos, specifications and reviews), so it is taken as the orchestrating session's intent, not a settled app decision.

| ANSI | Token | What is lost |
|---|---|---|
| black, white | `foreground` | black on ink and white on paper would vanish; both become the body colour |
| bright-black | `muted-foreground` | nothing: dim grey is what it means |
| red, bright-red | `destructive` | nothing |
| green, bright-green | `success` | nothing |
| blue, bright-blue | `primary` | nothing |
| yellow, bright-yellow | `foreground` or `muted-foreground` | the warning hue; amber is never text and fails at 1.61 |
| magenta, bright-magenta | `primary` | its identity: merges with blue |
| cyan, bright-cyan | `primary` or `success` | its identity: merges with blue or green |
| every `-dim` | `muted-foreground` | the per-colour dimming; Shiki halves a hex colour's alpha, but a variable gets a new name, so we choose one quiet colour |
| a background code (SGR 40 to 47) | `background-color` is set to the same variable | a red background needs `destructive-foreground` text; the theme sets `foreground`. Not solved by variables alone |

So of sixteen, nine keep their meaning, two become body text, and yellow, magenta and cyan lose theirs. For the app this matters little: its stderr carries no escape codes (§3.6), and a program that prints colour is the visitor's own.

## 5. One palette for two engines

### 5.1 The Lezer side

READ: `@lezer/highlight` 1.2.5, `dist/index.js` line 475 onward, the `tags` object; and `@lezer/python` 1.1.19, `src/highlight.js`, the `styleTags` call (`dist/index.js` line 266). `@codemirror/lang-python` 6.2.1 adds no style tags of its own (EXECUTED: grep).

The `tags` keys: `comment lineComment blockComment docComment name variableName typeName tagName propertyName attributeName className labelName namespace macroName literal string docString character attributeValue number integer float bool regexp escape color url keyword self null atom unit modifier operatorKeyword controlKeyword definitionKeyword moduleKeyword operator derefOperator arithmeticOperator logicOperator bitwiseOperator compareOperator updateOperator definitionOperator typeOperator controlOperator punctuation separator bracket angleBracket squareBracket paren brace content heading heading1…6 contentSeparator list quote emphasis strong link monospace strikethrough inserted deleted changed invalid meta documentMeta annotation processingInstruction`, plus the modifiers `definition`, `constant`, `function`, `standard`, `local`, `special` (EXECUTED: listed from the install).

The Python grammar's map, in brief: control words to `controlKeyword`; `in not and or is del` to `operatorKeyword`; `from def class global nonlocal lambda` to `definitionKeyword`; `import` to `moduleKeyword`; `with as print` to `keyword`; `Boolean` to `bool`, `None` to `null`; names to `variableName`, a called name to `function(variableName)`, a defined function to `function(definition(variableName))`, a class name to `definition(className)`; attributes to `propertyName`, a called method to `function(propertyName)`; `Comment` to `lineComment`; `Number`; `String`; an f-string to `special(string)`; `Escape`; each operator family to its own operator tag (`arithmeticOperator`, `compareOperator`, `definitionOperator` for `=`, `derefOperator` for `.`); `@` to `meta`; `( )` to `paren`, `[ ]` to `squareBracket`, `{ }` to `brace`, `, ;` to `separator`; `*`, `**`, `async` and f-string format specs to `modifier`.

EXECUTED (`s4/lezer2.ts`): `@lezer/python`'s parser with `highlightTree` over the same 29 examples, 4,659 highlighted spans. By share: `variableName` 19.8%, `paren` 18.8%, `separator` 9.3%, `number` 6.1%, `string` 5.8%, `derefOperator` 5.2%, `squareBracket` 4.8%, `function(variableName)` 4.2%, `brace` 4.0%, `definitionOperator` 4.0%, `function(propertyName)` 3.6%, `arithmeticOperator` 2.5%, `special(string)` 2.3%, `controlKeyword` 1.5%, `propertyName` 1.3%, `operatorKeyword` 1.1%, `moduleKeyword` 1.0%, format-spec `modifier` 1.0%, `lineComment` 1.0%, `definitionKeyword` 0.8%, then `compareOperator`, `keyword`, `escape`, `bool`, `function(definition(variableName))`, `null`, `bitwiseOperator`, `meta`, `definition(className)`, `punctuation` under 0.5% each.

### 5.2 Where the same Python constructs land, engine by engine

EXECUTED for both engines on one snippet with a decorator, a class, a docstring, annotated parameters, a method call, an f-string and a comment; checked against the 29-example counts.

| Construct | Shiki slot | Lezer tag |
|---|---|---|
| `import`, `for`, `return`, `def`, `class` | `keyword` | `moduleKeyword`, `controlKeyword`, `definitionKeyword` |
| `as` | `keyword` | `keyword` |
| `in`, `not`, `and` | `keyword` | `operatorKeyword` |
| `=`, `*`, `//`, `!=`, `.` | `keyword` (`keyword.operator.*`) | `definitionOperator`, `arithmeticOperator`, `compareOperator`, `derefOperator` |
| `@dataclass` | `function` (the whole decorator) | `meta` for `@`, `variableName` for the name |
| `class Item` | `function` | `definition(className)` |
| `def total` | `function` | `function(definition(variableName))` |
| `print(`, `range(` | `function` | `function(variableName)` |
| `df.groupby(` | `function` for `groupby` | `function(propertyName)` |
| `self.price` | `foreground` | `propertyName` |
| `self`, `qty` as parameters | `parameter` | `variableName` (no parameter tag in the Python grammar) |
| `str`, `int`, `float` annotations | `constant` (`support.type`) | `variableName` |
| `9`, `3.5e3` | `constant` | `number` |
| `None`, `True` | `constant` | `null`, `bool` |
| `"x"` | `string-expression` | `string` |
| `"""Doc."""` docstring | `comment` | `string` |
| `f"…"` | `string-expression`; the `f` and `!r` are `keyword`; `{` `}` are `constant` | `special(string)`; `!r` and `:.2f` are `modifier`; `{` `}` are `brace` |
| `# comment` | `comment` | `lineComment` |
| `(` `,` inside a call | `punctuation` | `paren`, `separator` |
| `(` of a `def`, `[`, `]` | `foreground` | `paren`, `squareBracket` |
| a plain name | `foreground` | `variableName` |

INFERRED: the two engines agree on keywords, strings, numbers, comments and called names. They disagree on operators (Shiki colours them as keywords; Lezer gives them their own tags), decorators, builtin types, docstrings and `self`. A hand-made Shiki theme can move operators to `foreground` and docstrings to `comment`-or-`string` to match whichever side `004` prefers (§3.4); CodeMirror's HighlightStyle can do the same from its side.

### 5.3 A neutral set of properties (INFERRED)

Define, in the generated CSS from tokens, one set of custom properties that neither engine owns:

| Property | Token | Shiki (theme) | CodeMirror (HighlightStyle tags) |
|---|---|---|---|
| `--code-foreground` | `foreground` | `editor.foreground`; `variable`, `punctuation`, `parameter` scopes | `variableName`, `propertyName`, `operator`, `paren`, `bracket`, `brace`, `separator`, `punctuation`, `meta` |
| `--code-background` | the ground | `editor.background` | the editor's `.cm-editor` background |
| `--code-keyword` | `primary` | `keyword`, `storage.type`, `storage.modifier` (operators optional) | `keyword`, `controlKeyword`, `definitionKeyword`, `moduleKeyword`, `operatorKeyword`, `modifier` |
| `--code-string` | `success` | `string`, `string.quoted`, `string.interpolated` | `string`, `special(string)`, `escape`, `regexp` |
| `--code-constant` | `foreground` or `destructive` | `constant.numeric`, `constant.language`, `support.type` | `number`, `bool`, `null`, `atom`, `typeName` |
| `--code-function` | `foreground` (weight) | `entity.name.function`, `entity.name.type`, `support.function`, `meta.function-call` | `function(variableName)`, `function(propertyName)`, `definition(variableName)`, `definition(className)`, `className` |
| `--code-comment` | `muted-foreground` | `comment`, docstrings | `comment`, `lineComment`, `blockComment`, `docComment`, `docString` |
| `--code-link` | `primary` | `markup.underline.link` | `link`, `url` |
| `--code-inserted`, `--code-deleted`, `--code-changed` | `success`, `destructive`, `primary` | `markup.inserted`, `markup.deleted`, `markup.changed` | `inserted`, `deleted`, `changed` |
| `--code-ansi-<name>` ×16 and `--code-ansi-<name>-dim` ×16 | §4.3 | `terminal.ansi*` | not used by an editor |

Then one token change moves both engines. If `004` keeps `createCssVariablesTheme`, set `variablePrefix: "--code-"` and accept Shiki's `--code-token-keyword` spelling; if it writes the theme object (§3.4), the names are exactly these. The property values are themselves `var(--primary)` and the like, so `build-tokens` emits them in `:root` once and the `.dark` switch carries through (INFERRED from how `src/app.css` lines 10 to 123 already work).

## 6. The groove and the ground

READ: `001` decision 13 and `src/app.css` lines 241 to 245: `groove` is `border-top: var(--line-width) solid var(--groove-line)` plus `box-shadow: inset 0 var(--line-width) 0 var(--groove-light)`; in dark, `groove-light` is `clear`. The stock chrome is `border border-input` all round, `dark:bg-input/30`, no line between header and code (§2.3). INFERRED options, no decision:

| Ground | Border | Header to code | Line tints | Trade-offs |
|---|---|---|---|---|
| **`muted`** (wash / ink-wash) | none, or `border-border` hairline | `groove` | `highlighted` and `added` cannot be `bg-muted` (invisible); `removed` cannot be `bg-destructive/10` (R7). Needs another device: a left `border-l-(length:--focus-width) border-primary` marker, or `card` as the inset for a highlighted line | the v2 "code ground" look `001` decision 8 names; tightest pair `primary` 4.90; v2 specifies the groove's white line "on paper grounds", so on wash it is untested |
| **`card`** (raised / ink-raised) | `border-border` hairline (`card` draws its edge that way, primitives memo §3) | `groove` | the stock tints work as they stand: `bg-muted` for highlighted and added, `bg-destructive/10` for removed, both sanctioned on `card` | more room: `primary` 5.91; a code block inside a card then sits white on white, told apart only by the hairline |
| **`background`** (paper / ink) | `border-border` | `groove` | as `card` | the block disappears into the page; reads as a plain `<pre>` with a line |

Header and footer carry `text-muted-foreground` in stock; both pass on every ground (6.79 and up). The destructive variant's `text-destructive` on `muted` passes at 4.71 light, 5.53 dark. Focus is the `pre`'s own `:focus-visible` outline (`001` decision 13), 2 px `ring` outside the box, so the ground does not matter to it.

## 7. Line numbers and long lines

EXECUTED (`scripts/lines.ts`) over the 29 examples (`tabs/` 4, `random/` 25) and their 29 `expected/*.stdout.txt`.

| Measure | Code | Expected output |
|---|---|---|
| Lines per file: min / median / max | 9 / 19 / 25 | 3 / 8 / 1,163 (the SVG example) |
| Total lines | 524 | |
| Longest line (characters) | 98 (`random/05-regex-fuzzy.py`) | 159 (`16-yaml-toml-json.stdout.txt`) |
| Longest line per file: min / median / max | 65 / 87 / 98 | |
| Files with a line over 80 characters | 23 of 29 | |
| Lines over 80 / over 100 | 46 / 0 | |
| Bytes per output: min / median / max | | 147 / 238 / 29,149 |

INFERRED for the specification: a block that shows a whole example needs 25 lines and 98 columns. At `text-sm` (13.5 px, line height 1.6) that is 540 px tall; at `text-xs` (12 px, 1.5) 450 px. The advance width of JetBrains Mono was not measured; at a typical 0.6 em, 98 columns are about 794 px at `text-sm` and 706 px at `text-xs`, before padding and a two-digit line-number gutter. So the install snippet fits anywhere; an example block scrolls horizontally on a narrow screen or wraps; and the output panel needs a maximum height with scroll, since one example prints 1,163 lines.

## 8. Recommendation (INFERRED)

This commits us to nothing. It is what the findings point to.

1. **Shiki 4.5.0, named `^4.5.0`**, with the JavaScript engine and the Python, bash and JSON grammars loaded lazily, as the stock `highlighter.ts` does (§1, §3.5).
2. **One hand-made theme object** with `var(--code-*)` colours (§3.4), not `createCssVariablesTheme`: it costs about 30 lines, gives our own property names, lets operators be `foreground`, and adds italic comments and medium function names, which is the only way two same-coloured slots are told apart.
3. **The palette of §4.2, option A**: `foreground`, `muted-foreground`, `primary`, `success`; `destructive` only for deleted lines and ANSI red. Two accents and two neutrals keep red meaning error.
4. **The `--code-*` properties of §5.3**, emitted by `build-tokens`, read by both engines.
5. **Tokens as classes, not `style`** (§3.7), so the item passes the lint as it stands and `dark:` disappears.
6. **Prerender the static snippets**; give the output panel a plain `<pre>` and leave the ANSI path for programs that print colour (§3.6). Load Shiki in the client only where code streams.
7. **Ground: `card` with a `border-border` hairline and the `groove` under the header** is the easier ground for diff and highlighted lines; `muted` is the v2 look and needs a marker device for those lines (§6). The owner's call.

## 9. What is still unknown

- **Whether `@fontsource-variable/jetbrains-mono` as installed includes an italic face**, and whether its medium weight keeps column alignment in practice. Both only matter if `004` uses weight or italic to tell slots apart.
- **The bash and JSON grammars under the strict JavaScript engine.** Only Python was checked; `forgiving: true` covers the rest at the cost of silent misses.
- **The exact mechanism** by which Shiki keeps `var()` strings through its placeholder colours. Observed, not read to its source; a `colorReplacements` option of our own was not tested against it.
- **The class-per-slot rendering** of §3.7: whether Tailwind's scanner picks the fourteen literal classes out of a lookup table in a `.ts` file, and whether `cn` merges `text-(--code-keyword)` with a line's own classes as expected.
- **Whether the app colours all of stderr red.** The brief says so; the app's `context/` does not record it.
- **The groove's white line on `wash`.** v2 specifies it on paper; on the muted ground it was not rendered or measured.
- **CodeMirror itself**: its bundle, its Svelte wrapping, its keyboard escape and how a HighlightStyle takes these properties. The CodeMirror memo's.

**In one line:** Shiki 4.5.0's variables theme writes every token colour as `var()` and nothing else, the same in 3.23.0; four of our text tokens (`foreground`, `muted-foreground`, `primary`, `success`, with `destructive` for deletions) pass AA on `muted`, `card` and `background` in both themes with no new hue; a hand-made theme of thirty lines gives the slots our own `--code-*` names and font styles that CodeMirror's tags can share; and a prerendered snippet ships no Shiki at all, while a client that highlights Python, bash and JSON pays 70.6 KB gzipped.
