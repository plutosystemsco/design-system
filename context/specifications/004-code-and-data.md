# 004 — Code and data

- **Status:** built, reviewed and released as `v0.4.0` (`b3d2a8e`); the specification review is [`../reviews/004-code-and-data-spec-2026-10-31.md`](../reviews/004-code-and-data-spec-2026-10-31.md) (16 findings, all fixed before build) and the change review [`../reviews/004-code-and-data-pr-2026-10-31.md`](../reviews/004-code-and-data-pr-2026-10-31.md) (9 findings, all fixed)
- **Date:** 2026-10-31
- **Author:** the design lead
- **Kind:** ten registry items (`code-block`, `code-editor`, `highlighter`, `use-highlighted-code`, `chart`, `meter`, `popover`, `accordion`, `toggle`, `toggle-group`); twelve code tokens, a scrollbar utility and the meter's rules added to `pluto-theme`; two lint rules; tests; the 0.4.0 release
- **Depends on:** [`003`](./003-the-first-blocks.md), *built* (`fb942f8`, `v0.3.0`), and through it [`002`](./002-the-primitives-forms-surfaces-and-feedback.md) (`7857ea4`, `v0.2.0`) and [`001`](./001-tokens-and-the-registry.md) (`33e94de`, `v0.1.0`).
- **Blocks:** `005`, which reuses `popover`'s chrome and the `scrollbar` utility; `006`'s chat pane, which uses `code-block` at size `sm`; `007`, which grows the `--code-*` map.
- **Research it stands on:**
  - [`../research/2026-10-31-shiki-and-a-token-highlight-palette.md`](../research/2026-10-31-shiki-and-a-token-highlight-palette.md) (the Shiki memo)
  - [`../research/2026-10-31-codemirror-6-under-svelte-5.md`](../research/2026-10-31-codemirror-6-under-svelte-5.md) (the editor memo)
  - [`../research/2026-10-31-the-data-items-chart-popover-accordion-toggles-scroll-area-and-a-meter.md`](../research/2026-10-31-the-data-items-chart-popover-accordion-toggles-scroll-area-and-a-meter.md) (the data memo)
  - [`../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md`](../research/2026-10-28-the-primitives-the-blocks-and-the-home-page-need.md) (the primitives memo), §1, §6.2, §6.3
- **Design calls:** `../decisions.md`, "The design calls for `004`, code and data" (2026-10-31).

## Intent

An app's page that is an editor, a run and its result needs items that show code and data. Nothing in the registry yet shows either. This specification adds the items that do, so that such a page can be built from the registry alone (constitution §4.2).

Four things are new ground, and three memos were run for them.

1. **A highlight palette that is tokens.** Shiki's theme can write every token colour as a CSS variable and nothing else, and a hand-made theme of thirty lines gives those variables our own names (Shiki memo §3). Four text tokens we already hold pass WCAG AA on every code ground in both themes, with no new hue (§4). So the palette is twelve `--code-*` properties emitted by `build-tokens`, read by Shiki in `code-block` and by CodeMirror in `code-editor`, and one token change moves both (§5).
2. **An editor of our own.** CodeMirror 6 wraps in a small Svelte 5 component, prerenders to a `<pre>`, takes every colour and size through `var()`, and leaves Tab unbound so there is no keyboard trap (editor memo §3 to §5). It costs about 130 KB gzipped on the one route that uses it (§2).
3. **A chart that needs no `style`.** layerchart paints a series from a Tailwind token class or a `var()` prop, so the stock item's injected stylesheet goes (data memo §2.3). The library leaves a chart's data invisible to keyboard and screen-reader users, so every figure here carries a name and a table (§3).
4. **A fuel meter.** Fuel is a sandbox's budget of instructions for one run. The native `<meter>` takes our tokens in Chromium and WebKit and is exposed as a meter with its text (data memo §6). It is the right role: a measurement in a range, not progress.

The six stock items (`code-block` with its hook and library, `chart`, `popover`, `accordion`, `toggle`, `toggle-group`) are installed and restyled by `002`'s procedure and checklist. `scroll-area` is not served: its hover-only 10 px scrollbar fails our 24 px target rule and hides from touch and keyboard users, and a native scroll box with two token properties does what it was listed for (data memo §4.5). A `scrollbar` utility replaces it.

**Not here:** the `ansi` language and its 32 colour variables (decision 21); overlays, the sidebar and the chat primitives (`005`); the app shell and the chat pane (`006`); any block; deployment.

**Terms of art.** A *slot* is one of the twelve `--code-*` properties a highlight colour comes from. A *mark* is a chart's shape for a datum. A *series* is one set of marks sharing a key. *Prerender* is SvelteKit rendering a page to HTML at build time, which this site does and an app may (`001` decision 3). A *compartment* is CodeMirror's unit of reconfigurable state.

## Decisions

Each decision gives its reason. A reviewer checks the reason as much as the rule.

### 1. Scope: ten items, the theme's additions, two lint rules, and nothing else

| Item | Type | From | Group |
|---|---|---|---|
| `code-block` | `registry:ui` | stock, restyled | `code` |
| `code-editor` | `registry:ui` | ours | `code` |
| `highlighter` | `registry:lib` | stock, restyled | `code` |
| `use-highlighted-code` | `registry:hook` | stock, restyled | `code` |
| `chart` | `registry:ui` | stock, restyled | `data` |
| `meter` | `registry:ui` | ours | `data` |
| `popover` | `registry:ui` | stock, restyled | `surfaces` |
| `accordion` | `registry:ui` | stock, restyled | `surfaces` |
| `toggle` | `registry:ui` | stock, restyled | `actions` |
| `toggle-group` | `registry:ui` | stock, restyled | `actions` |

- **Why these ten:** the split decision named `code-block`, the palette, the editor, `chart`, `popover`, `accordion`, `toggle`, `toggle-group` and `scroll-area` for `004` (decisions.md, 2026-10-28). The hook and the library come with `code-block` (primitives memo §3.3). The meter is the one need with no stock item that is a data display (primitives memo §6.2); it belongs with the chart.
- **Why `scroll-area` is dropped**, not restyled (data memo §4.5): bits-ui's scrollbar mounts on hover only, is 10 px wide with an 8 px thumb, and its viewport has no `tabindex`. That fails R21 (24 px targets), hides the control from touch and keyboard users, and relies on Chromium's focusable-scroller behaviour. A native `overflow-auto` box with `scrollbar-color` and `scrollbar-width` from tokens and `tabindex="0"` scrolled by keyboard and drew a 3.27:1 thumb. Decision 5 adds the utility; `table` (`002`) and `code-block` (decision 8) already scroll this way. Recorded in decisions.md.
- **Why no `ansi`:** CPython colours tracebacks only for a terminal, and a program run in a sandbox has none (Shiki memo §3.6). So program output in a code block needs no highlighter. Decision 21 states the limit.
- **Nothing in `001`, `002` or `003` changes** except `pluto-theme` (additive, decision 5) and the lint (additive, decision 15). No existing item's file is edited.

### 2. The packages, named and pinned

Versions read with `bun pm view` on 2026-10-31 (Shiki memo §1, editor memo §1, data memo §2.1; all EXECUTED). `001` decision 4's two rules apply: a package an item names gets a caret range at the tested version, and the item names the same range.

| Package | `bun.lock` | Specifier | Licence | Named by |
|---|---|---|---|---|
| `shiki` | 4.5.0 | `^4.5.0` | MIT | `highlighter` |
| `@codemirror/state` | 6.7.6 | `^6.7.6` | MIT | `code-editor` |
| `@codemirror/view` | 6.43.15 | `^6.43.15` | MIT | `code-editor` |
| `@codemirror/language` | 6.13.1 | `^6.13.1` | MIT | `code-editor` |
| `@codemirror/commands` | 6.11.1 | `^6.11.1` | MIT | `code-editor` |
| `@codemirror/autocomplete` | 6.20.4 | `^6.20.4` | MIT | `code-editor` |
| `@codemirror/lang-python` | 6.2.1 | `^6.2.1` | MIT | `code-editor` |
| `@lezer/highlight` | 1.2.5 | `^1.2.5` | MIT | `code-editor` |
| `layerchart` | 2.9.2 | `^2.9.2` | MIT | `chart` |

`package.json` then names **32 packages**: the 23 of `002` and these 9. `bits-ui`, `@internationalized/date`, `tailwind-variants` and `phosphor-svelte` are already held; `popover`, `accordion`, `toggle` and `toggle-group` name the first two; `toggle`, `toggle-group` and `code-block` name the third (stock `code-block.svelte` and `code-block-line.svelte` define their variants with `tv`, and decision 8 keeps them; review finding 3); `code-block` and `accordion` name the fourth, by `build`'s detection. The `tailwind-variants` items become **11**: `002`'s 8 and these 3.

- **Why shiki 4, not the stock `^3.20.0`** (Shiki memo §1.4): the 3.x line closed at 3.23.0 two days before 4.0.0; 4.0 only dropped Node 18 and two misspelt names; the CSS-variables output is byte-identical between the two. A caret on 3.x can never leave a closed line. Bun ignores the advisory `engines` field.
- **Why `@codemirror/autocomplete` though completion is off:** `closeBrackets` lives there, and `@codemirror/lang-python` depends on it (editor memo §1). Naming it pins what is installed anyway.
- **Why not `codemirror`** (the meta-package): its `basicSetup` adds the search panel, folding, completion and the lint gutter, 31 KB gzipped we do not want, with hex-literal colours, and "does not allow customization" (editor memo §1).
- **Why `pythonLanguage`, not `python()`:** `python()` wires two completion sources that are inert without `autocompletion()`, 4.6 KB for nothing (editor memo §1). Completion is not included (decision 21); it is one import.
- **The specifiers are set after the install, in `002` decision 2's order:** `bun add -d <name>@<exact>`, then the caret in `package.json`, then `bun install`, then a check that `bun.lock` still resolves the exact version.

### 3. The install procedure and provenance

`002` decision 4 is followed as written, with these parameters.

1. Snapshot the working tree (`git ls-files -co --exclude-standard`, SHA-256 each file) into a temporary folder. `003` is committed and tagged; the snapshot is taken all the same.
2. One run: `bun --bun node_modules/.bin/shadcn-svelte add code-block chart popover accordion toggle toggle-group -y`. No `-o`. `code-block` pulls `use-highlighted-code`, `highlighter` and `button`; `toggle-group` pulls `toggle`. If the CLI asks to overwrite `button` or any other existing file, the answer is **no**.
3. Compare against the snapshot. Allowed differences: new files under `src/lib/registry/ui/<name>/` for the six, `src/lib/registry/hooks/use-highlighted-code.svelte.ts`, `src/lib/registry/lib/highlighter.ts`, and `package.json` and `bun.lock`. Anything else is restored.
4. Pin the packages (decision 2). The CLI will have written stock's ranges (`shiki@^3.20.0`, `layerchart@^2.0.0`); step 4 replaces them.
5. Record provenance: each of the **8** stock-derived items (`code-block`, `use-highlighted-code`, `highlighter`, `chart`, `popover`, `accordion`, `toggle`, `toggle-group`) carries `meta.stock` with the five fields of `002` decision 5, `cli` `1.7.1`, the install date, and the SHA-256 of `curl -s https://shadcn-svelte.com/registry/styles/maia/<item>.json`. The Landing notes record which of the 8 live JSON files differ from the clone's `docs/static/registry/styles/maia/<item>.json` at `6149e14`.
6. Restyle by `002` decision 9's checklist (R1 to R22) and this specification's item decisions. Extensionless `#lib` imports, as before.
7. List each item in `registry.json` (decision 4).

`code-editor` and `meter` are written from scratch and carry no `meta.stock`.

### 4. The registry entries

**Order and groups.** Two groups are added, `code` and `data`, after `forms` and before `blocks`. `toggle` and `toggle-group` join `actions` after `kbd`; `popover` and `accordion` join `surfaces` after `avatar`.

| # | Group | Items |
|---|---|---|
| 1–6 | `foundation` | `pluto-theme`, `font-geist`, `font-heading-ibm-plex-sans`, `font-jetbrains-mono`, `utils`, `four-dot` |
| 7–11 | `actions` | `button`, `tooltip`, `kbd`, **`toggle`**, **`toggle-group`** |
| 12–20 | `surfaces` | `card`, `separator`, `item`, `table`, `tabs`, `collapsible`, `avatar`, **`popover`**, **`accordion`** |
| 21–28 | `feedback` | `alert`, `alert-dialog`, `badge`, `empty`, `skeleton`, `spinner`, `status`, `error-summary` |
| 29–38 | `forms` | `label`, `field`, `input`, `textarea`, `input-group`, `native-select`, `checkbox`, `radio-group`, `switch`, `input-otp` |
| 39–42 | **`code`** | **`code-block`**, **`code-editor`**, **`highlighter`**, **`use-highlighted-code`** |
| 43–44 | **`data`** | **`chart`**, **`meter`** |
| 45–49 | `blocks` | `hero`, `sign-in`, `sign-up`, `page-states`, `settings` |

**49 items.** Types: 1 `registry:theme`, 3 `registry:font`, 2 `registry:lib`, 1 `registry:hook`, 37 `registry:ui`, 5 `registry:block`. Eight groups; the catalogue's headings are "Code" and "Data" (decision 16).

- *Why two groups, not one `data`:* a reader looking for "how do I show code" and one looking for "how do I show a number" are different readers. Four code items are enough for a group of their own.
- *Why `toggle` is an action and `popover` a surface:* a toggle is a button; a popover is a panel, like a card. `accordion` is a surface that discloses, as `collapsible` is.

**Each new item** has `title`, a one-sentence `description`, `001`'s `author`, `meta.since` `"0.4.0"`, `meta.group`, and for the 8 stock-derived items `meta.stock`. The titles and descriptions are shipped copy:

| Item | `title` | `description` |
|---|---|---|
| `toggle` | Toggle | A two-state button that says whether it is pressed, inverted when it is. |
| `toggle-group` | Toggle group | A row of toggles, one stop for the row, moved by the arrow keys, for one choice or several. |
| `popover` | Popover | A small dialog anchored to its button, raised by the elevation shadow, that returns focus when it closes. |
| `accordion` | Accordion | Headings that each open a section, divided by grooves, moved by the arrow keys. |
| `code-block` | Code block | Code, output or a diff on the muted inset, highlighted from the code tokens, with line numbers, a copy button and a header divided by the groove. |
| `code-editor` | Code editor | A CodeMirror 6 editor themed from the tokens, with line numbers and Python, that prerenders as plain code and leaves Tab unbound. |
| `highlighter` | Highlighter | Shiki with the JavaScript engine and a theme whose every colour is a code token, for the server or the browser. |
| `use-highlighted-code` | Use highlighted code | A hook that highlights a changing string line by line as it grows. |
| `chart` | Chart | A figure for layerchart with a name and a table of its data, series coloured by token classes, and a tooltip on the elevation shadow. |
| `meter` | Meter | A measurement within a known range, as the native meter on the muted track with a primary fill, its numbers written beside it. |

**Every new item names `utils` and `pluto-theme`** (`002` decision 6), then each item it imports.

| Item | Files | `registryDependencies` beyond `utils`, `pluto-theme` | Packages detected |
|---|---|---|---|
| `toggle` | 2 (`toggle.svelte`, `index.ts`) | | `bits-ui`, `@internationalized/date`, `tailwind-variants` |
| `toggle-group` | 3 | `toggle` | `bits-ui`, `@internationalized/date`, `tailwind-variants` |
| `popover` | 9 (`popover`, `-trigger`, `-content`, `-portal`, `-close`, `-header`, `-title`, `-description`, `index.ts`) | | `bits-ui`, `@internationalized/date` |
| `accordion` | 5 (`accordion`, `-item`, `-trigger`, `-content`, `index.ts`) | | `bits-ui`, `@internationalized/date`, `phosphor-svelte` |
| `code-block` | 9 (`code-block`, `-header`, `-title`, `-actions`, `-footer`, `-copy-button`, `-content`, `-line`, `index.ts`) | `use-highlighted-code`, `button`, `status` | `tailwind-variants`, `phosphor-svelte` |
| `code-editor` | 4 (`code-editor.svelte`, `code-editor-theme.ts`, `code-editor-python.ts`, `index.ts`) | | the 7 CodeMirror and Lezer packages of decision 2 |
| `highlighter` | 1 (`highlighter.ts`) | | `shiki` |
| `use-highlighted-code` | 1 (`use-highlighted-code.svelte.ts`) | `highlighter` | |
| `chart` | 4 (`chart-container.svelte`, `chart-tooltip.svelte`, `chart-utils.ts`, `index.ts`) | | `layerchart` |
| `meter` | 2 (`meter.svelte`, `index.ts`) | | |

- **40 new files.** The registry's item files become **193** (`003`'s 153 + 40). `chart` loses stock's `chart-style.svelte` (decision 10); `code-block` keeps all eight stock components (decision 8).
- **The distinct registry dependency names become 27**: `003`'s 24 and `use-highlighted-code`, `highlighter`, `toggle`. (`button` and `status` are already among the 24.) Each names an item here.
- *Why `code-block` depends on `status`:* its copy button announces "Copied" through a live region that exists before it changes (decision 8; `003` decision 8's rule).
- **Targets.** `registry:ui` files install under `<name>/`. The hook installs to `$HOOKS$/use-highlighted-code.svelte.ts` and the library to `$LIB$/highlighter.ts`, as stock does (primitives memo §3.3); `registry.json`'s `aliases` already name `hooks` and `lib`.

### 5. The theme's additions: twelve code tokens, a scrollbar utility, the meter's rules

`pluto-theme` grows, additively (its interface does not change; `002` decision 25's reading of semver). `build-tokens` emits each from the token file.

**The code tokens.** The token file gains a `code` key: a map from slot to the semantic colour it takes. Every value is one of the 48 semantic colour names, never a primitive, so the theme switch carries through.

| Slot | Semantic colour | Why |
|---|---|---|
| `foreground` | `foreground` | the body of the code |
| `background` | `muted` | the code ground (decision 8; `001` decision 8 names code grounds among the `muted` insets) |
| `keyword` | `primary` | the one brand accent; 16% of Python tokens (Shiki memo §3.3) |
| `string` | `success` | the one other text-safe hue; strings are 11% |
| `constant` | `foreground` | numbers, `None`, `True`: ink. *Why not `destructive`:* red then means both "a number" and "an error" on one page. The Shiki memo's option A (§4.2) |
| `function` | `foreground` | a defined or called name; told apart by weight (decision 6), not colour |
| `comment` | `muted-foreground` | recedes |
| `link` | `primary` | as links elsewhere; underlined by the theme |
| `inserted` | `success` | a diff's `+` lines |
| `deleted` | `destructive` | a diff's `−` lines |
| `changed` | `primary` | amber would be the convention, and amber is never text (`001` decision 8) |
| `active-line` | `card` | the editor's active line and the code block's emphasised line: an opaque raised step on the inset, not a tint (decision 8) |

**Twelve slots.** Every text slot passes 4.5:1 on `muted`, `card` and `background` in both themes (Shiki memo §4.1, EXECUTED): `foreground` 15.00 / 12.83 on `muted`, `muted-foreground` 6.79 / 6.13, `primary` 4.90 / 5.22, `success` 5.23 / 6.55, `destructive` 4.71 / 5.53. `card` on `muted` is 1.2:1 and carries no information alone (decision 8 pairs it with a marker).

**How they are emitted** (`001` decision 15's rules):

- `cssVars.light` gains `--code-<slot>: var(--<semantic>)` for the twelve. *Why `light` only:* the value is a reference, not a colour; `:root` cascades into `.dark`, and `.dark` redefines the referenced variable. A copy in `cssVars.dark` would say the same thing twice.
- `cssVars.theme` gains `--color-code-<slot>: var(--code-<slot>)` for the twelve. Tailwind then makes `text-code-keyword`, `bg-code-active-line` and the rest real utilities. *Why utilities, not `text-(--code-keyword)`:* the item's class table (decision 7) reads as ordinary token classes, and the lint's colour list can hold them.
- **A by-product in every app** (review finding 13): the CLI's theme updater derives a `@theme inline` variable from every `cssVars.light` key, and a value with no `#`, colour function or `--color-` is not a colour to it, so an app's `@theme inline` gains twelve lines `--code-<slot>: var(--code-<slot>)` beside our `--color-code-<slot>`. They are harmless: the unlayered `:root` definition wins, and `--code-` is no Tailwind namespace. The smoke test checks `--color-code-keyword: var(--code-keyword)` appears exactly once in the app's `app.css` and that a second `add pluto-theme` leaves the file byte-identical (decision 17).
- **The `code` map is separate from `themes`.** `tokens.test.ts`'s "48 semantic names per theme" is unchanged; it checks the map has 12 entries, each naming one of those 48. `generated.test.ts` checks the 12 variables and 12 utilities are emitted.
- **How `@theme inline` names reach a `var()` at run time** (review finding 4). `001` decision 15 says Tailwind inlines `@theme inline` values and does not emit them as variables. The whole truth: Tailwind 4 emits an inline theme variable into `@layer theme` **when its name appears in a scanned source file** (the review EXECUTED this with the pinned 4.3.3 compiler). So `var(--text-sm)` in `code-editor-theme.ts` resolves because that file is under `src/` and scanned; an app that narrows its sources with `@source` and leaves the editor folder out would get an undefined `font-size`. Decision 9 therefore reads `:root` names wherever one exists and names the five `@theme inline` variables it still reads, with the condition. Recorded in decisions.md as a correction to `001` decision 15's wording; `002` decision 3's curve stays written out, since nothing then referenced `--ease-entrance`.

**The scrollbar utility.** `css` gains `@utility scrollbar { scrollbar-color: var(--input) var(--muted); scrollbar-width: thin; }`. The thumb `input` on the track `muted` measures 3.27:1 light and 3.31 dark (data memo §4.5, EXECUTED), above the 3:1 a control needs. Used by `code-block` (decision 8); offered to apps in place of `scroll-area` (decision 1) with the pattern `overflow-auto scrollbar` plus `tabindex="0"` and a label, as `table`'s region does (`002` decision 19). Support: Chromium 121+, Firefox, Safari 18.2+ (data memo, INFERRED). This release checks it in Chromium only (decision 21).

**The meter's rules.** `css` gains, in `@layer components`, scoped to `[data-slot="meter"]`: `appearance: none`, `background: var(--muted)`, and the pseudo-elements `::-webkit-meter-bar` (`var(--muted)`), `::-webkit-meter-optimum-value`, `::-webkit-meter-suboptimum-value`, `::-webkit-meter-even-less-good-value` and `::-moz-meter-bar` (all `var(--primary)`). No radius: the meter has square ends (decision 14). *Why in the theme, not the component:* a Svelte `<style>` block is banned in items (`001` decision 25), and pseudo-elements cannot be classes. *Why all three WebKit value states take `primary`:* the meter carries no `low`, `high` or `optimum` (decision 14), so only `optimum-value` renders; the other two are set so that an app that adds them gets no browser green or yellow. Both engines honoured these rules (data memo §6.2, EXECUTED).

### 6. The palette as a theme: one hand-made theme object for Shiki

`highlighter.ts` holds a Shiki theme object of about thirty lines (Shiki memo §3.4, EXECUTED), not `createCssVariablesTheme`. Every colour in it is `var(--code-<slot>)`.

| Scope group | Slot | Font |
|---|---|---|
| `keyword`, `storage.type`, `storage.modifier` | `keyword` | |
| `keyword.operator` | `foreground` | *Why:* Shiki's grammar calls every Python operator a keyword, so `=`, `*` and `.` would be blue; the Lezer grammar gives them their own tags. Sending them to the foreground makes the two engines agree (Shiki memo §5.2) and drops keyword colour from 16% to about 6% of tokens |
| `string`, `string.quoted`, `string.interpolated` | `string` | |
| `string.quoted.docstring` | `comment` | a docstring reads as a comment, as Shiki's generated theme has it |
| `constant.numeric`, `constant.language`, `support.type` | `constant` | |
| `entity.name.function`, `entity.name.type`, `support.function`, `meta.function-call` | `function` | **bold** in the theme, rendered as `font-medium` (decision 7). *Why weight:* `function` and `foreground` share a colour; weight is what tells them apart. JetBrains Mono is monospaced across weights, so columns hold |
| `comment` | `comment` | no italic. *Why:* `001` installs only the upright face of JetBrains Mono (`@fontsource-variable/jetbrains-mono`'s `index.css`; EXECUTED by this author, 2026-10-31: `wght-italic.css` exists in the package but is not imported). Italic would be synthesised, which the design book would call a fake |
| `variable`, `variable.parameter`, `punctuation` | `foreground` | one colour for the body; Shiki colours only the punctuation inside calls (Shiki memo §3.2), so a separate slot would make `(` two colours on one line |
| `markup.underline.link` | `link` | underlined |
| `markup.inserted`, `markup.deleted`, `markup.changed` | `inserted`, `deleted`, `changed` | |
| `editor.foreground`, `editor.background` | `foreground`, `background` | |

No `terminal.ansi*` colours (decision 21). The theme is loaded with `createHighlighterCore`, `createJavaScriptRegexEngine({ forgiving: true })` (stock's choice; only the Python grammar was proven strict-clean, Shiki memo §1.3), and the stock list of fourteen lazily imported grammars with their aliases (Shiki memo §2.1). *Why keep the list:* a grammar costs nothing until it is loaded; Python is 65 KB gzipped on its own and bash and JSON 6 KB more (§3.5).

### 7. `highlighter` and `use-highlighted-code`: tokens as classes

- **A token renders as a class, never a `style`.** `highlighter.ts` exports `tokenClass(token)`: it maps the token's colour `var(--code-<slot>)` to the literal class `text-code-<slot>` through a table of **eleven** class strings (every slot but `foreground`), adds `font-medium` when the token's `fontStyle` has the bold bit, and `underline` for the underline bit. **A token in the `foreground` slot carries no class** (review finding 11): the `pre` is already `text-foreground`, and about half of Python's tokens are foreground, so a class on each would double the HTML for nothing. The table is literal so Tailwind's scanner sees every class. The hook returns `{ content, class }` per token, `class` empty for a foreground token; stock's `style` and `dark:text-(--shiki-dark)` go (Shiki memo §2.4, R12; the lint's `style=` and `.style` rules).
  - *Why a class and not `style="color:var(--code-keyword)"`:* the lint bans `style` in items (`001` decision 25), and nothing here needs it. The Shiki memo left this untested (§3.7); build step 3 proves it, and the checkpoint sees it.
  - *Risk:* `cn` merges `text-code-keyword` with a line's own `text-*` classes. A line sets no text colour of its own (decision 8), so there is nothing to merge.
- **`highlightCode(code, lang)`** stays the one-shot form for a server `load` (stock, Shiki memo §2.1). The preview's `code-block` page uses it at prerender, as an app's static snippet can, so those pages ship no Shiki (§3.6). **`loadHighlighter`** stays for the hook's incremental path.
- **The hook** is stock's logic unchanged (Shiki memo §2.2): lazy load in an `$effect`, lines tokenised from the last complete newline with the saved grammar state, plain strings until the highlighter arrives. Its output type changes to `{ content, class }`.
- Both files are `001`-style TypeScript. The hook imports `#lib/registry/lib/highlighter` extensionless; `code-block-content.svelte` imports the hook as `#lib/registry/hooks/use-highlighted-code.svelte.js`, the form this repository uses for a `.svelte.ts` module (`field-label.svelte` imports `./field-context.svelte.js`; review finding 10), which the "0 `/index.js"`" check does not touch. `highlighter.ts` imports from `shiki/core`, `shiki/engine/javascript` and `shiki/langs/<name>.mjs`.

### 8. `code-block`

The stock eight components, restyled; the look moves from maia's CSS into the components' classes.

- **Ground: `muted`, no outer border.** The root is `bg-muted text-foreground rounded overflow-hidden`, and **it draws the focus ring for its `pre`** (review finding 1): `has-[[data-slot=code-block-content]:focus-visible]:focus-ring` on the root and `focus-visible:focus-ring-none` on the `pre`, the recipe `input-group` uses (`002` decision 8). *Why:* `001`'s ring is 2 px at a 2 px offset; a ring on the `pre` would be clipped by the root's `overflow-hidden` on three sides. Decision 15 adds `code-block.svelte` to the `focus-ring` allowlist and `code-block-content.svelte` to the `focus-ring-none` allowlist; the keyboard test reads the outlined ancestor, as it does for `input-group`. *Why `muted`:* `001` decision 8 names "code grounds" among the four allowed insets, and the editor shares the ground (decision 9), so an editor and its output read as one surface. A code block inside a card or a chat message is an inset in a surface, which is what `muted` is for (R8). The tightest text pair, `primary` on `muted`, measures 4.90 (Shiki memo §4.1). *Why no border:* an inset is told by its ground; a hairline around a tint adds the line the design book does not want. The Shiki memo's `card` option (§6) was weighed and refused: a white block in a white card is told only by a hairline, and the `muted` look is the design book's.
- **The groove divides header and footer from the code.** `CodeBlockContent` carries `groove` when a header precedes it; `CodeBlockFooter` carries `groove`. The design book specifies the groove's white line on paper grounds; on wash it is a 1 px `raised` line under a 10% ink hairline, and the build's visual pass confirms it reads as a groove, not a ridge (Landing notes). In dark the groove is the plain hairline (`001` decision 13).
- **Header, title, actions, footer.** `CodeBlockHeader`: `flex items-center justify-between gap-2 px-4 py-2 text-muted-foreground` (`sm`: `px-3 py-1`). `CodeBlockTitle`: `font-sans text-sm font-medium`; an icon passed in is `size-4` and `aria-hidden`. `CodeBlockActions`: a flex row of controls; **always visible**, never hidden until hover. *Why:* a control that appears on hover is unreachable on touch and invisible until a keyboard user lands on it; the design book's honest pixels prefers one small visible button. `CodeBlockFooter`: as the header, with `groove`.
- **Sizes:** `default` is `text-sm`, content `px-4 py-3`; `sm` is `text-xs`, content `px-3 py-2`. Line height is the token's (1.6 and 1.5); `leading-relaxed` goes (R13).
- **Variants:** `default` and `destructive`. `destructive` sets `text-destructive` on the root (4.71 on light `muted`, 5.53 dark) and its tokens are not highlighted. **Rule:** a destructive block is state told by colour, so an app gives it a visible label in the header or beside it, such as "Error output". The item page says so (R19).
- **The content** is `<pre data-slot="code-block-content" tabindex={0} class="overflow-auto scrollbar focus-visible:focus-ring-none">` holding `<code>`. `tabindex` defaults to `0` and an app passes `-1` to remove the stop (stock; the doc's rule). Focus is the ring the root draws (above); stock's `outline-none` and its translucent halo go (R2). `wrap` sets `whitespace-pre-wrap wrap-break-word`. The `pre` is the one scroll container, with the `scrollbar` utility (decision 5).
- **Line numbers** by CSS counter, as stock: the line's `before` pseudo-element prints `counter(line)` with `/ ''`, so numbers are neither copied nor read. The counter is reset on the `<code>` by the arbitrary property `[counter-reset:line]`, which holds no length or colour, so the lint accepts it. **`startLine` is dropped**: it needed a `style` attribute. Numbering that starts on another line is not offered.
- **Line emphasis without a tint.** `CodeBlockLine` variants `default`, `highlighted`, `added`, `removed`. The three emphasised variants set `bg-code-active-line` (the opaque `card` step, decision 5) and a left marker `border-l-(length:--focus-width)` in `primary`, `success` or `destructive`. `added` and `removed` print `+` and `−` in the marker's colour through the `after` pseudo-element, as stock does. *Why:* stock's `bg-muted` would vanish on a `muted` ground and `bg-destructive/10` is forbidden inside one (R7; Shiki memo §2.4). An opaque raised line with a marker is shape and position, not tint (R19).
- **The copy button** is a `Button` `variant="ghost" size="icon-sm"` (32 px, R21) with `aria-label` "Copy code", which becomes "Copied" for two seconds; icons `Copy` and `Check` from `phosphor-svelte`, `aria-hidden`. It writes with `navigator.clipboard.writeText` and announces "Copied" through a `Status` region rendered beside it, present from the first render (`003` decision 8's rule). Its `code` prop is the text copied, which is the block's `code`.
- **Props on the root** `code-block.svelte`: `variant`, `size`, `class`. On `CodeBlockContent`: `code` (a string; the component highlights it with the hook when `language` is given), `lines` (pre-highlighted lines from `highlightCode`, for prerendered code), `language`, `lineNumbers`, `wrap`, `tabindex`. Exactly one of `code` with `language`, or `lines`, drives the highlight; a `code` with no `language` renders plain.
- **Preview page** (decision 16): the install snippet in bash (prerendered through `+page.server.ts` and `highlightCode`, so the page proves the server path), a 25-line Python example with line numbers and a copy button (a sudoku example, quoted as a string in the page), a diff with one added and one removed line, a `destructive` block labelled "Error output", `sm`, and `wrap`. **Keyboard fixture:** 2 stops: the Python block's copy button (in its header, which precedes the content in the DOM; review finding 9), then its `pre`, whose ring is drawn by the root. Enter on the copy button sets the status text to "Copied".

### 9. `code-editor`

Ours, four files. The editor memo's scratch component is the model (§3), described there, written fresh here.

- **`code-editor.svelte`.** The `EditorView` is created in `onMount` on a host `<div>` and destroyed in its return. *Why `onMount`:* a view is created once; an effect re-runs. Props:
  - `value = $bindable("")`. Editor to parent through `EditorView.updateListener` on `docChanged`; parent to editor through an `$effect` that compares `value` with the document and dispatches a whole-document change only when they differ. No flags, no debounce (editor memo §3, EXECUTED).
  - `label` (required): the accessible name, as `aria-label` through `EditorView.contentAttributes`. `describedby`: an id for `aria-describedby`.
  - `readonly`, `disabled`: one compartment holding `EditorState.readOnly` and `EditorView.editable`. `readonly` keeps the stop and sets `aria-readonly`; `disabled` sets `contenteditable="false"` and leaves the tab order.
  - `extensions: Extension` (default `[]`): the language and keymaps, in a compartment, reconfigured when the prop changes.
  - `onrun?: (doc: string) => void`: bound to `Mod-Enter` **and** `Ctrl-Enter` through `Prec.highest(keymap.of(...))`, so the default `insertBlankLine` is suppressed and the key works on every platform (editor memo §6, EXECUTED: Control-Enter on a Mac did not fire until bound beside `Mod-Enter`).
  - Methods through `bind:this`: `focus()`, `reset(text)` (a new state, so history is cleared), and `getView()` for an app that needs more.
  - `contentAttributes` always carries `tabindex="0"`. *Why:* axe reports `scrollable-region-focusable` on the scroller without it, and with it nothing (editor memo §4.4, EXECUTED).
  - **On the server it renders `<pre data-slot="code-editor-fallback" aria-label={label}>` with `value`**, swapped for the editor on mount. *Why:* the code is in the HTML before any script, and running code needs JavaScript anyway, so a `<textarea>` buys nothing (editor memo §3). The `pre` is `font-mono text-sm py-3 ps-8 overflow-x-auto`, the Tailwind equivalents of the editor's own type and padding (review finding 15); CodeMirror's generated classes cannot be copied. The gutter is about 36 px wide, so `ps-8` (32 px) leaves a shift of a few pixels at hydration, accepted.
  - The root is `<div data-slot="code-editor" class="bg-muted rounded">`. **No `overflow-hidden`** (review finding 1): the editor's focus ring sits outside `.cm-editor`, which fills the root, and a clip would hide it on all four sides. The theme rounds `&` and `.cm-scroller` instead.
- **`code-editor-theme.ts`** exports `codeTheme` (`EditorView.theme`) and `codeHighlight` (`syntaxHighlighting(HighlightStyle.define(...))`). **Every value is a `var()`, and it reads a `:root` name wherever one exists** (review finding 4): colours from `--code-<slot>`, `--muted-foreground`, `--border`, `--input`, `--destructive`, `--ring`, `--muted`; sizes from `--focus-width`, `--focus-offset`, `--line-width`, `--radius`. **Five names live only in `@theme inline`** and are read all the same: `--spacing`, `--text-sm`, `--text-sm--line-height`, `--font-mono`, `--font-weight-medium`. They resolve because Tailwind emits an inline theme variable whose name appears in a scanned source file (decision 5), and this file is under `src/`. The item page says so, for an app that narrows its `@source`. No `px`, no `em`, no hex, no named colour (decision 15's new rule checks). The rows of the editor memo's table (§5.2) are each covered:

  | Part | Value |
  |---|---|
  | `&` | `color: var(--code-foreground)`, `background-color: var(--code-background)`, `border-radius: var(--radius)` |
  | `&.cm-focused` | `outline: var(--focus-width) solid var(--ring)`, `outline-offset: var(--focus-offset)`: `001`'s recipe (R2) |
  | `.cm-content` | `caret-color: var(--code-foreground)`, `padding: calc(var(--spacing) * 3) 0`; the native caret, not `drawSelection` |
  | `.cm-scroller` | `font-family: var(--font-mono)`, `font-size: var(--text-sm)`, `line-height: var(--text-sm--line-height)`, `border-radius: var(--radius)`, `scrollbar-color: var(--input) var(--muted)`, `scrollbar-width: thin` |
  | `.cm-gutters` | `background-color: var(--code-background)`, `color: var(--muted-foreground)`, `border-right: var(--line-width) solid var(--border)` |
  | `.cm-lineNumbers .cm-gutterElement` | `padding: 0 calc(var(--spacing) * 2) 0 calc(var(--spacing) * 3)` |
  | `.cm-activeLine`, `.cm-activeLineGutter` | `background-color: var(--code-active-line)` |
  | `&.cm-focused .cm-matchingBracket` | `outline: var(--line-width) solid var(--input)` |
  | `&.cm-focused .cm-nonmatchingBracket` | `color: var(--destructive)`, `text-decoration: underline wavy` |
  | `.cm-placeholder` | `color: var(--muted-foreground)` |
  | `.cm-specialChar` | `color: var(--destructive)` |

  - **Selection is the browser's own.** No `drawSelection`. *Why:* a drawn selection needs a translucent tint of `primary` that no token holds and R6 forbids; the native selection colour is the platform's, not a literal of ours, and it keeps text readable by the platform's design. The caret is native for the same reason.
  - The `HighlightStyle` rules, from the editor memo §5.4: `tags.keyword` and `tags.modifier` → `--code-keyword`; `tags.string`, `tags.special(tags.string)`, `tags.escape` → `--code-string`; `tags.number`, `tags.bool`, `tags.null`, `tags.atom` → `--code-constant`; `tags.function(tags.variableName)`, `tags.function(tags.propertyName)`, `tags.function(tags.definition(tags.variableName))`, `tags.definition(tags.className)` → `--code-function` with `font-weight: var(--font-weight-medium)`; `tags.comment` → `--code-comment`; `tags.link`, `tags.url` → `--code-link`, underlined; `tags.invalid` → `--destructive`. Operators, brackets, separators, names and `meta` take the `&` colour. So the editor and the code block colour the same Python the same way (Shiki memo §5.2, with decision 6's operator rule).
- **`code-editor-python.ts`** exports `pythonSetup(): Extension[]`: `lineNumbers()`, `history()`, `keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap])`, `pythonLanguage`, `closeBrackets()`, `bracketMatching()`, `indentOnInput()`, `highlightActiveLine()`, `highlightActiveLineGutter()`, `codeHighlight`. About 130 KB gzipped with the component (editor memo §2, variant b plus the active-line pair; EXECUTED at 128 to 132 KB). *Why a preset file in the item:* Python is the language this release serves; an app for another language writes its own preset and ignores this file.
- **Tab is not bound.** No `indentWithTab`. Tab leaves the editor; `Mod-]` and `Mod-[` indent (`defaultKeymap`). *Why:* SC 2.1.2 is met by construction (editor memo §4.1; CodeMirror's own documented reason). The item page says "Tab leaves the editor" and shows the `describedby` pattern. An app that binds Tab owes its users the "Escape, then Tab" text beside the editor and in `aria-describedby`; the page says that too.
- **Height.** None set: the editor grows with its document. An app caps it with a class such as `max-h-96` or `max-h-(--…)` in its own page (app pages are not under our lint) when it wants an inner scroll. Not `max-h-sm`: Tailwind's container scale is width-only, and `max-h-sm` generates no CSS (review finding 8, EXECUTED by the reviewer with 4.3.3); decision 15 notes it for L7. *Why:* the 29 examples run 9 to 25 lines (editor memo §6); showing one whole avoids a scroll inside a scroll. Long lines scroll horizontally in `.cm-scroller`; no `lineWrapping` by default, since wrapping breaks Python's indentation.
- **Motion.** The cursor blink is CodeMirror's only animation, and `001`'s reduced-motion rule stops it (editor memo §6, EXECUTED).
- **Preview page**: the editor with `pythonSetup()` holding a 20-line Python example, a "Run" button whose handler (and `onrun`) counts runs into a `Status`, a "Reset" button, a visible hint "Ctrl Enter runs the example. Tab leaves the editor." wired by `describedby`; a `readonly` editor; a `disabled` editor; the prerendered `<pre>` is what the raw HTML holds. **Keyboard fixture:** 3 stops: a button "Before", the editor's content (`role="textbox"`), a button "After". Tab from "Before" lands in the editor and Tab again on "After" (no trap); Control-Enter in the editor increments the run count and inserts no line.

### 10. `chart`

Four files: stock's minus `chart-style.svelte`. "We do not wrap LayerChart" (stock's doc): an app composes layerchart's components inside ours.

- **`ChartContainer`** renders `<figure data-slot="chart" aria-labelledby={captionId} class="text-xs …">` holding a `div` (`aspect-video`) for the chart and a `<figcaption id={captionId}>` with `label` (`text-sm text-muted-foreground`), with the layerchart overrides as arbitrary variants: `[&_.lc-axis-tick-label]:fill-muted-foreground` (8.18 on light `card`, 7.17 dark; data memo §2.7), `[&_.lc-rule]:stroke-border`, `[&_.lc-rect]:stroke-0` (against layerchart's literal `stroke="black" stroke-width="1"`, data memo §2.3), `[&_.lc-text]:text-xs`. Props: `label` (required; the figure's caption and name), `captionHidden` (renders the caption `sr-only`), `config: ChartConfig`, `table?: Snippet`, `id`. When `table` is given, the chart is followed by `<details>` with a `<summary>` "Show as table" (the `003` caret, right when closed and down when open) holding the snippet. *Why a visible caption, not `aria-label`* (review finding 12): an `aria-label` names the figure for no sighted reader; the WAI tutorial's `figure` with a `figcaption` is the one placement that serves both (data memo §3.2). *Why a required name and a table:* a layerchart figure exposes its tick labels and nothing else; its marks are invisible to assistive technology and its tooltip is pointer-only (data memo §3.1, EXECUTED). The table is also the only content a prerender shows, since layerchart draws nothing on the server (§2.5). A `details` serves sighted keyboard users and screen readers alike (§3.4).
- **Colours by token class or `var()` prop, never by `style`** (data memo §2.3, EXECUTED in Chromium): a mark takes `class="fill-chart-1"` or `fill="var(--chart-1)"`; the simplified charts take `series: [{ color: "var(--chart-1)" }]`. `ChartConfig` keeps `label` and `icon` per key and adds `swatch?: string`, a token class such as `bg-chart-1` for the tooltip's indicator; stock's `color` and `theme` fields, the tooltip's `color` prop (it wrote a `style`) and the injected stylesheet go. The item page shows both routes.
- **`ChartTooltip`**: stock's logic reading `useChart()` and layerchart's context, less the colour fallbacks; the panel is `bg-popover text-popover-foreground shadow-elevation rounded px-3 py-2 text-xs min-w-24 grid gap-2`; the indicator is a `size-2 rounded` `div` carrying the series' `swatch` class, `aria-hidden`, **rendered only when the key has a `swatch`** (review finding 12), so no empty square. No `style`, no `shadow-xl`, no `border-[1.5px]`. The tooltip is layerchart's pointer affordance; the table is the keyboard path.
- **`chart-utils.ts`**: `ChartConfig`, `getPayloadConfigFromPayload`, the context pair; `THEMES` goes with the stylesheet.
- **No motion.** Our components pass no `motion`; a figure appears complete. An app that tweens on a data change must read `prefers-reduced-motion` itself and stay within 200 ms (data memo §2.6; `001` decision 14). The item page says so.
- **Series are told by mark or label, not colour alone.** No two chart colours differ from each other by 3:1 (`chart-1` against `chart-2` is 1.37; data memo §3.3). The rule, on the item page: one series per figure where the data allows; otherwise bars against a line, or `Labels` on the marks; and a light figure that uses `chart-3` labels that series directly (`001` decision 12's exception). A legend alone is not enough (SC 1.4.1).
- **Preview page**: one bar chart (visitors per weekday, one series, `fill-chart-1`, with `Axis`, a tooltip and a table of seven rows) and one line chart (two series, bars for one and a `Spline` for the other, `stroke-chart-2`, labelled). Each in a `card`. Both are empty boxes in the raw HTML and drawn after hydration; the test checks the table is in the raw HTML. **Keyboard fixture:** 1 stop: the bar chart's "Show as table" summary; Enter shows the table.
- **The weight:** about 125 KB gzipped on a two-chart page (data memo §2.4). An app loads `chart` only on the routes that draw one, such as an admin page.

### 11. `popover`

Nine files, stock's parts restyled.

- **Chrome** (`002` decisions 3, 7, 8; data memo §5): `PopoverContent` is `z-50 w-3xs rounded bg-popover text-popover-foreground shadow-elevation p-4 grid gap-4 text-sm data-open:animate-enter data-closed:animate-exit`. No `border`: `shadow-elevation` already draws the hairline as a spread shadow, and a border would draw it twice (data memo §5.1). No `outline-hidden`: focus inside is the global ring. Stock's ten `tw-animate-css` classes, `ring-foreground/5`, `shadow-2xl`, `rounded-2xl`, `duration-100` and `w-72` go. `w-3xs` is 256 px, on the container scale L7 allows; an app overrides with `class`.
- **The elevation seen** (data memo §5.2, EXECUTED): in light, the shadow is visible on `card` and on the page; in dark, only the `elevation-line` hairline shows, as `002` decision 7 intends. This is the check `002` decision 28 left to `004`; `primitives.spec.ts` reads the computed `box-shadow` on the open popover in both themes (decision 17).
- **Role, and a name that is required.** bits-ui names the trigger `aria-haspopup="dialog"` and gives the content no role (data memo §4.1). `PopoverContent` sets `role="dialog"`, and **every popover has a name** (review finding 5): `aria-labelledby` the `PopoverTitle`'s id when one is rendered inside it (through a context the content provides and the title consumes), else the `label` prop as `aria-label`; the item page says one of the two is mandatory, and `svelte-check` cannot enforce it, so the test opens every preview popover under axe (`aria-dialog-name`). *Why:* the trigger promises a dialog; the content keeps the promise, and a dialog without a name is announced as "dialog" and nothing else. `PopoverTitle` renders a heading with `level` (default 2), `font-heading font-bold text-base`, as `CardTitle` does (R17). `PopoverDescription` is `text-muted-foreground`.
- **Behaviour is bits-ui's**: focus moves to the first tabbable inside on open, loops within, and returns to the trigger on Escape or outside click; `aria-expanded` and `aria-controls` on the trigger (data memo §4.1, EXECUTED). `sideOffset={4}` kept (`002` decision 19's one number). The exit fade plays while bits-ui keeps the node (`002` decision 3).
- **Preview page**: three popovers: on a "Fuel" button holding a title, two sentences and a link; one with a form (two inputs and a button) named by `label`; one aligned `start` holding one sentence, named by `label`. axe scans the page with each of the three open (decision 17). **Keyboard fixture:** 1 stop: the trigger. Enter opens the dialog with focus on its first stop; Escape closes it and returns focus to the trigger.

### 12. `accordion`

Five files.

- **Wiring bits-ui leaves out** (data memo §4.2): `AccordionItem` makes one id with `$props.id()` and shares it by context; `AccordionTrigger` sets `aria-controls` to it and `AccordionContent` sets `id`, `role="region"` and `aria-labelledby` the trigger's own id. *Why:* APG's accordion asks for `aria-controls`; a `region` lets a reader jump from panel to panel. Six panels or fewer is the rule for `region`, and the item page says so.
- **Heading level** is `AccordionTrigger`'s `level` prop, default 3, rendered by bits-ui as `role="heading" aria-level` (stock). The trigger's text is `font-heading font-bold text-base` (R17), `h-12` tall, `py-0`, `text-start`, with `gap-4`.
- **The caret shows the state by shape** (`003`'s rule for `details`): one `CaretRight` from `phosphor-svelte`, `size-4`, `aria-hidden`, `rotate-90` when the item is open (`group-aria-expanded:rotate-90` on the trigger's group), with the default `transition`. Stock's two swapped icons go.
- **Dividers are grooves.** Every `AccordionItem` after the first carries `groove` (`not-first:groove`); no `bg-muted/50` on the open item (R7; data memo §1.3), no `rounded-2xl`, no `border border-transparent` spacer. `AccordionContent`'s inner `div` is `pb-4 text-sm`; its height variables are bits-ui's inline style, not ours. No animation: stock's `animate-accordion-down` and `-up` go (L10); content appears at once.
- **Keys** are bits-ui's: Enter and Space toggle; Down, Up, Home and End move among the triggers; each trigger is a Tab stop (data memo §4.2).
- **Preview page**: a `single` accordion of three security claims, a `multiple` one, a disabled item. **Keyboard fixture:** 3 stops: the three triggers of the `single` accordion. ArrowDown moves focus; Enter flips `aria-expanded` and shows the region named by its `aria-controls`.

### 13. `toggle` and `toggle-group`

- **`toggle`** is bits-ui's `<button aria-pressed>`. Variants `default` (transparent, `hover:bg-accent`) and `outline` (`border border-input`, `hover:bg-accent`). Sizes `default` `h-12 min-w-12 px-4` and `sm` `h-8 min-w-8 px-3`, `rounded`; stock's `lg`, `h-9`, `h-10`, `pr-2.5` and `rounded-4xl` go (`002` decision 10; R5, R9). **Pressed is inverted**: `data-[state=on]:bg-foreground data-[state=on]:text-background`, the recipe `003`'s viewer presets and the tooltip use (decisions.md, "A pressed preset is inverted"). *Why `data-state`, not `aria-pressed`* (review finding 6): bits-ui sets `data-state="on"` on a toggle and on a group's items in both modes, but a `single` group's items carry `aria-checked`, not `aria-pressed` (data memo §4.3, §4.4), so an `aria-pressed:` variant would leave the checked preset unmarked. *Why inverted:* stock's pressed `bg-muted` measures 1.20:1 against light `card`, a state told by a faint tint (data memo §4.3); inverted is 16.84 and reads as pressed at a glance (R19). `aria-invalid` styling goes: a toggle is never invalid. Icons inside are `size-4`, `aria-hidden`; an icon-only toggle has `aria-label`.
- **`toggle-group`**: bits-ui's `Root` (`role="group"`) and `Item`; `type` `single` or `multiple`; `variant` and `size` shared by context and reused from `toggleVariants`. Items join: the group is `inline-flex rounded`, items lose their inner radii (`first:rounded-s last:rounded-e rounded-none` through the group's data attributes, as stock) and, in `outline`, share borders (`not-first:border-s-0`). **The `spacing` prop is dropped**: it wrote a `style` attribute. An app that wants separate toggles uses `Toggle`s in a flex row. A selected item is inverted, as `toggle`.
  - **The group's role stays `group`.** bits-ui renders `role="group"` with `role="radio"` items in `single` mode, the Radix convention; arrows move focus without selecting, and Space or Enter selects (data memo §4.4, EXECUTED). *Why keep it:* a time-range preset that selects on arrow would fire a query per key press; browse-then-apply is right for the use. The page says the role and the keys.
- **Preview pages**: `toggle`: both variants and sizes, pressed, disabled, icon-only with a label. `toggle-group`: a `single` of time-range presets (an admin page's strip), a `multiple` of text styles with icons, `outline`, `sm`, vertical, disabled. **Keyboard fixtures:** `toggle` 2 stops (two toggles; Space flips the first's `aria-pressed`); `toggle-group` 1 stop (the checked item; ArrowRight moves focus to the next without changing `aria-checked`; Space then checks it).

### 14. `meter`

Ours, two files. A native `<meter data-slot="meter">`.

- **Props:** `value`, `min` (0), `max` (100), `valuetext?` (set as `aria-valuetext`), `class`. No `low`, `high`, `optimum`: a run's fuel is a number, not a warning; the "Stopped: out of fuel" outcome is an `alert`'s (data memo §6.2). Classes `h-2 w-full block rounded-none`; the colours come from decision 5's rules. *Why square ends* (review finding 14): an 8 px bar with the 8 px case radius is a pill, which the design book §05 reserves for dot-derived elements; the design book's lines have square ends.
- **Named by its page**: a `<Label for>` or `aria-label`, both of which the item page shows. The accessible name is required (ARIA 1.2); the test checks the fixture's meter has one.
- **The numbers are written beside it**, by the page that uses it, as "Fuel: 4.81 billion instructions of 30 billion"; the fill is never the only sign (R19). `primary` on `muted` measures 4.90 / 5.22, above a non-text mark's 3:1 (data memo §6.2).
- **Why native, not `role="meter"` on a `div`:** both engines expose `<meter>` as `meter` with its text, and the native element takes its value as an attribute where a `div` needs a `style` width (data memo §6.2, EXECUTED). bits-ui's `Meter` is a `div` with three attributes and would add nothing (§6.1).
- **Preview page**: the fuel meter at 16% with its label and text; one at 0, one full; a `sm` width in a card row. No fixture: a meter is not interactive.
- *A limit:* Firefox's `::-moz-meter-bar` with tokens has not been run (data memo §9), and the smoke apps' `vite build` cannot see it. This release checks the meter in Chromium and WebKit only (decision 21).

### 15. The lint: two rules

`scripts/lint-literals.ts` keeps every rule and gains two.

| # | Rule | Flags | Allows |
|---|---|---|---|
| L20 | injected stylesheet | `<svelte:element this="style"` and `this={"style"}` (or `'style'`), the way stock's `chart-style.svelte` wrote a `<style>` past the `STYLE_BLOCK` pattern (data memo §1.7) | nothing |
| L21 | CSS values in a theme file | in a `.ts` or `.svelte.ts` item file, inside a quoted string: a number followed by a length unit (`px`, `rem`, `em`, `%`, `vh`, `vw`, `ch`, `pt`), or a CSS named colour as a whole word, such as `red`, `black`, `white`, `gray`, `grey` | `0`; `var(--…)`; `calc(…)` whose numbers carry no unit; `transparent` and `currentColor` (the two named values that are not colours of ours); `none`; `inherit`; `solid`, `dotted`, `wavy` and other keywords. The editor memo §5.5 found the lint passing `"13px"` and `"red"` in a theme object; this closes it. The reviewer found 0 hits in the 31 existing item `.ts` files |

- **Samples `literals.test.ts` counts:** 4 new bad (`<svelte:element this="style" />`, `<svelte:element this={"style"} />`, the `.ts` values `fontSize: "13px"` and `color: "red"`, each in a file named `theme.ts`) and 3 new good (`outline: "var(--focus-width) solid var(--ring)"`, `padding: "0 calc(var(--spacing) * 2)"`, `textDecoration: "underline wavy"`, in `theme.ts`). So **68 bad flagged, 0 of 45 good flagged**, and 0 violations across the 193 item files.
- **The allowlists grow** (decision 8; review finding 1): `focus-ring` adds `code-block.svelte`; `focus-ring-none` adds `code-block-content.svelte`. Two more good samples with those file names, and two bad ones with the same classes in `card.svelte`: **70 bad, 0 of 47 good**.
- The arbitrary property `[counter-reset:line]` (decision 8) holds no length or colour and passes `001`'s rule as it stands.
- **A note on L7** (review finding 8): its container keywords (`3xs` to `7xl`) generate CSS for widths only in Tailwind 4.3.3; `max-h-sm` passes the lint and does nothing. No item uses one on a height; review watches for it.

### 16. The preview pages and the catalogue

- **50 site pages**: the catalogue and 49 item pages; with `003`'s 18 views (its Landing notes, deviation 8), **68 prerendered pages** (`003`'s 58 + 10).
- **The catalogue** groups by `meta.group` in decision 4's order under eight `<h2>`s: Foundation, Actions, Surfaces, Feedback, Forms, Code, Data, Blocks. `+page.server.ts`'s `GROUPS` gains the two.
- **Each new item page** has `002` decision 22's five sections: header, variants, states, accessibility, keyboard (where there is a fixture). The `code-block` page has a `+page.server.ts` that highlights its snippets with `highlightCode`, so the page proves the server path and ships no Shiki; the `code-editor` and `chart` pages are hydration-only and the tests read what the raw HTML holds. The `highlighter` and `use-highlighted-code` pages show the hook highlighting a string that grows on a timer started by a button (not on load: nothing moves while a visitor reads, the design book §06), the class table, and the twelve slots as swatches with their names beside them.
- **Scroll containers** (`001` decision 24): `code-block`'s `pre` and the editor's `.cm-scroller` are the items' own behaviour, as `table`'s region is. The preview's Python example has a 98-character line, so the `pre` scrolls at 1280 and Chromium's focusable-scroller behaviour does not add a stop, because the `pre` already has `tabindex="0"`.
- Preview pages stay outside the lint.

### 17. The tests

`003`'s pattern. Each check is written first and seen failing. `bun test` for unit and smoke, Playwright for the browser, `--bun` wherever a tool starts.

**Unit tests**: 9 files in `tests/unit/`.

1. `tokens.test.ts`: `001`'s and `002`'s checks, plus: the `code` map has 12 entries, each value one of the 48 semantic colour names; the 12 slot names are decision 5's.
2. `contrast.test.ts`: unchanged (no new colour). Plus 10 rows: each of the five text slots' colours (`foreground`, `muted-foreground`, `primary`, `success`, `destructive`) on `muted` in each theme measures at least 4.5, with decision 5's numbers.
3. `generated.test.ts`: `002`'s checks, plus: `pluto-theme`'s `cssVars.light` holds the 12 `code-*` variables as `var(--<semantic>)`; `cssVars.theme` holds 12 `color-code-*`; `css` holds `@utility scrollbar` and the `[data-slot="meter"]` rules with the five pseudo-elements; `cssVars.dark` holds no `code-*`.
4. `registry.test.ts`: 49 items in decision 4's order and types (1, 3, 2, 1, 37, 5); 49 of 49 with `meta.group` among 8; 0 dependencies with `local:` or a scheme; 27 of 27 distinct registry dependency names name an item here; 37 of 37 `registry:ui` items have at least 2 files; 34 of 34 stock-derived items (`002`'s 26 and this specification's 8) carry a 5-field `meta.stock`; 10 of 10 new items carry `meta.since` `"0.4.0"` and decision 4's titles; `code-editor` and `meter` carry no `meta.stock`. Built into a temporary folder: 50 files under `r/styles/maia/` and 50 byte-identical under `v0.4.0/`; 0 of 2 stale files survive; 49 of 49 parse; 0 contain `#lib`; every target of the 37 `registry:ui` items starts `<name>/`; the hook's target is `use-highlighted-code.svelte.ts` and the library's `highlighter.ts`; `highlighter` names `shiki@^4.5.0`; `chart` names `layerchart@^2.9.2`; `code-editor` names the 7 packages of decision 2 at their ranges; 11 of 11 `tailwind-variants` items name `^3.3.1` (`002`'s 8, `toggle`, `toggle-group`, `code-block`); 0 of 50 built files contain `$UTILS$.js` or `/index.js"`; `wrangler.jsonc` and `CHANGELOG.md` as before, with decision 18's entry.
5. `previews.test.ts`: 49 of 49 pages.
6. `literals.test.ts`: 193 item files, 0 violations; 70 of 70 bad samples flagged; 0 of 47 good.
7. `deps.test.ts`: 32 packages with their specifiers and lock versions; 18 packages named by items (`002`'s 9 and decision 2's 9); no `tailwind-merge`; no `codemirror`; `packageManager` and `engines` unchanged.
8. `utils.test.ts`: `002`'s 7 cases; case (d) now finds 11 of 11 `tv` importers on `tailwind-variants/lite`.
9. `blocks.test.ts`: unchanged.

**Browser tests**: 9 files in `tests/e2e/`, in the `light` and `dark` projects. `pages.ts` gains the 49-item `ITEMS`, `ITEMS_004` (the 10) and `NEW_PAGES` (their pages).

1. `axe.spec.ts`: `003`'s 220 scans (its Landing table, criterion 13); the 10 new item pages at 360, 768 and 1280 (60); the `popover` page with each of its three popovers open (6): **286 scans, 0 violations.** The `code-editor` page is scanned after hydration (the test waits for `.cm-editor`).
2. `theme.spec.ts`: `001`'s two checks on 50 site pages and 18 views: **136**.
3. `four-dot.spec.ts`, `tokens.spec.ts`: unchanged, plus on the `pluto-theme` page in each theme: an element with `text-code-keyword` computes the colour of `--primary`; one with `bg-code-active-line` computes `--card`; an element with `scrollbar` computes `scrollbar-color` holding `--input`'s and `--muted`'s colours: 3 more per theme.
4. `keyboard.spec.ts`, in both themes:
   - **The catalogue:** 51 stops in order (the lockup, the toggle, the 49 item links), each with the ring; no 52nd.
   - **Item fixtures:** `003`'s 39 stops over 17 items, plus `code-block` 2, `code-editor` 3, `chart` 1, `popover` 1, `accordion` 3, `toggle` 2, `toggle-group` 1: **52 stops over 24 items.** Two stops have their ring drawn by an ancestor, checked as `input-group`'s is: the code block's `pre` (the `data-slot="code-block"` root; decision 8) and the editor's content (the `.cm-editor`; decision 9). Each of the 52 stops' rings is **unclipped**: no ancestor between the stop and `<main>` computes `overflow` hidden or clip unless the stop's rectangle grown by 4 px fits inside it (`003` check 27's rule).
   - **Block views and viewer toolbars:** unchanged (83 over 18; 42 over 5; `003`'s Landing table).
   - **Behaviours:** `003`'s 11, plus 8: Enter on the copy button sets the status text to "Copied" and the button's name; Tab from "Before" lands in the editor and Tab again on "After" with the document unchanged; Control-Enter in the editor raises the run count to 1 and leaves the line count unchanged; Enter on "Show as table" shows a `table` with 7 rows; Enter on the popover trigger opens a `role="dialog"` named by its title with focus on its first stop, and Escape removes it and returns focus to the trigger; ArrowDown in the accordion moves focus to the second trigger, and Enter sets `aria-expanded="true"` and shows the region its `aria-controls` names; Space flips the first toggle's `aria-pressed`; ArrowRight in the toggle group moves focus without changing `aria-checked`, and Space checks the focused item: **19**.
5. `primitives.spec.ts`: `002`'s and `003`'s checks, plus heights: a default toggle, a `sm` toggle and a toggle-group item measure 48, 32 and 48 ± 0.5 px; every new fixture stop is at least 24 × 24 px; the no-loop check covers the 10 new pages (0 infinite animations outside a spinner).
6. `code.spec.ts` (new), in both themes:
   - **C1, the server path.** The raw HTML of the `code-block` page (fetched with `request.get`, parsed without scripts) holds the install snippet's tokens as `<span class="text-code-…">` elements, 0 `style` attributes inside any `data-slot="code-block"` element, and 0 `script` references to a shiki chunk.
   - **C2, the palette in the browser.** On the Python block, a `text-code-keyword` span computes the colour of `--primary`, a `text-code-string` span `--success`, a `text-code-comment` span `--muted-foreground`, a `text-code-function` span `--foreground` with `font-weight` 500; the `pre`'s background computes `--muted`; an operator (`=`) span carries no `text-code-` class at all (decision 7's foreground rule).
   - **C3, the chrome.** The `pre` has `tabindex="0"`, computes `scrollbar-width: thin`, and at 1280 its `scrollWidth` exceeds its `clientWidth` (the 98-character line); focusing it draws the ring on the `data-slot="code-block"` root, the `pre`'s own outline is `none`, and the root's rectangle grown by 4 px is not clipped by any ancestor. The header's following content has the groove's `border-top-width` 1 px in `--groove-line`'s colour. The three emphasised lines compute `background-color` `--card` and a 2 px left border in `--primary`, `--success` and `--destructive`; the `removed` line's `after` content is "−".
   - **C4, the copy button.** Its name is "Copy code", 32 × 32 px; after Enter, the clipboard (granted in the Chromium project) holds the block's code, the name is "Copied", and the status region's text is "Copied"; after 2 s the name is "Copy code" again.
   - **E1, the editor prerendered.** The raw HTML of the `code-editor` page holds `pre[data-slot="code-editor-fallback"]` with the example's first line and 0 `.cm-editor`; after hydration, 0 fallbacks and 3 `.cm-editor`.
   - **E2, name, role, value.** The first editor's content has `role="textbox"`, `aria-multiline="true"`, `tabindex="0"`, `aria-label` "Python example", `aria-describedby` naming the visible hint; the `readonly` editor has `aria-readonly="true"` and `contenteditable="true"`; the `disabled` one `contenteditable="false"`.
   - **E3, the theme from tokens.** The focused `.cm-editor` computes `outline` `2px solid` in `--ring`'s colour, offset 2 px, its content's outline is `none`, and no ancestor up to `<main>` clips its rectangle grown by 4 px (the root has no `overflow-hidden`); the editor's background computes `--muted`, the gutter's text `--muted-foreground`, the active line `--card`, the scroller's font family holds "JetBrains Mono" and its font size 13.5 px; a keyword span computes `--primary`; the emitted CodeMirror `<style>` holds 0 hex colours and 0 `px` values of ours (the base theme's own are excluded by selector).
   - **E4, editing and run.** Typing `x = 1` at the end updates the bound value shown beside the editor; Reset restores the example and Mod-z then changes nothing; Control-Enter and Meta-Enter each raise the run count by 1 with the document unchanged; with the editor `readonly`, typing changes nothing.
   - **H1, the chart.** The raw HTML of the `chart` page holds 2 `figure[data-slot="chart"]`, each with `aria-labelledby` naming its `figcaption`, 0 `svg[role="figure"]`, and 2 `table`s inside `details`; after hydration, each of the 2 figures holds at least 1 `svg[role="figure"]` (layerchart may add a highlight-layer figure; the summary's caret is an `svg` of its own, hence the role in the selector; review finding 7); the bar chart's first `rect` computes `fill` as `--chart-1` and `stroke-width` 0, and the line's `path` `stroke` as `--chart-2`; 0 `style` attributes on elements with a `data-slot` beginning `chart`; the tooltip panel, after a mouse move over a bar, computes a `box-shadow` holding `--elevation-line`'s colour.
   - **M1, the meter.** The `meter` has an accessible name "Fuel", `value` 4.81, `max` 30, `aria-valuetext` "4.81 billion instructions of 30 billion", computes `appearance: none` and `background-color` `--muted`, is 8 px tall; a pixel at 8% of its width (from a screenshot of the element) is `--primary`'s colour and one at 50% is `--muted`'s; the visible text beside it holds "of 30 billion".
   - **P1, elevation on a menu** (`002` decision 28's check). With the "Fuel" popover open, its content computes `box-shadow` beginning `0 0 0 1px` in `--elevation-line`'s colour and, in light, a second layer in `--elevation-shadow`'s colour with 12 px offset and 32 px blur; in dark the second layer is transparent; the content has `role="dialog"` and `aria-labelledby` naming its title; its width is 256 px; `border-width` is 0. Each of the other 2 popovers, opened, has `role="dialog"` and a non-empty `aria-label`.
   - **A1, accordion wiring.** Each of 3 triggers has `aria-controls` naming an element with `role="region"` whose `aria-labelledby` names the trigger; the heading has `aria-level="3"`; the open item's caret is rotated 90° (its `transform` is not `none`) and the closed ones' is not; items 2 and 3 compute the groove's top border and item 1 does not.
   - **T1, pressed state.** A pressed toggle (`data-state="on"`, `aria-pressed="true"`) computes `background-color` `--foreground` and `color` `--background`; an unpressed one is transparent; the `single` group's checked item (`data-state="on"`, `aria-checked="true"`, no `aria-pressed`) likewise, and the group's role is `group`.
   - **Motion.** 0 `animation-iteration-count: infinite` outside a spinner on the 10 new pages (also in `primitives.spec.ts`'s count); the CodeMirror cursor's animation under `prefers-reduced-motion: reduce` (emulated) computes an iteration count of 1.

**Smoke tests**: 5 files in `tests/smoke/`. `001`'s, `002`'s and `003`'s are unchanged and still pass.

- **`code-add.test.ts`** (new), into each of the two scratch apps, against this repository's `vite dev`, with the locked CLI:
  1. `add code-editor code-block chart popover accordion toggle-group meter -y -o` exits 0 with the "unsupported runtime" warning.
  2. **47 files land**: `code-editor` 4, `code-block` 9, `use-highlighted-code` 1, `highlighter` 1, `status` 2, `button` 2, `spinner` 2, `chart` 4, `popover` 9, `accordion` 5, `toggle-group` 3, `toggle` 2, `meter` 2, `utils` 1.
  3. No placeholder is left; imports use the app's alias; the hook sits in the app's hooks folder and the library in its lib folder.
  4. `package.json` holds the 9 packages of decision 2 at their ranges, plus `bits-ui`, `@internationalized/date`, `tailwind-variants` and `phosphor-svelte`; no `codemirror`, no `tailwind-merge`.
  5. After the test writes a prerendered page rendering a `CodeEditor` with `pythonSetup()`, a `CodeBlock` with `lines` from `highlightCode` in its `load`, a `ChartContainer` with a `BarChart` and a table, a closed `Popover`, an `Accordion`, a `ToggleGroup` and a `Meter`, the app's `vite build` exits 0, and the built HTML holds the code block's `text-code-` spans and the editor's fallback `pre`.
  6. `svelte-check` reports 0 errors.
  7. Our lint, with L20 and L21, finds 0 violations in the 47 files.
  8. The app's `app.css` holds `--color-code-keyword: var(--code-keyword)` exactly once, and a second `add pluto-theme -y -o` exits 0 and leaves the file byte-identical (decision 5's by-product; `001`'s smoke check 7).

  8 assertions × 2 apps: **16**.

### 18. The version: 0.4.0, and the changelog

- `package.json`'s `version` becomes **`0.4.0`**: features added, no interface of a landed item changed. `build-registry` writes `static/v0.4.0/`.
- `CHANGELOG.md` gains `## 0.4.0 — <landing date>` above `0.3.0`: one line per new item marked "new"; one line for `pluto-theme`, additive, naming the twelve code tokens, `scrollbar` and the meter rules; one line saying `scroll-area` is not served and why, with the `scrollbar` pattern. `registry.test.ts` checks the entry names 11 of 11 (`pluto-theme` and the 10), and the older entries are unchanged.
- New items carry `meta.since` `"0.4.0"`.

### 19. What a consuming app, `005` and `006` take

- **A consuming app's page with an editor and a run:** `code-editor` with `pythonSetup()`, `readonly` while a run is in flight, `reset()` on a change of example and on Reset, `onrun` for Ctrl Enter, and a visible hint wired by `describedby`; `code-block` with `lines` from `highlightCode` at prerender for an install snippet, and with a plain `code` and no `language` for program output (decision 1: no highlighter is needed), `destructive` with a visible "Error output" label for stderr; `meter` with the fuel numbers beside it and a `popover` on "Fuel" for the note; `accordion` at a `level` matching the page outline. **An admin page:** `chart` with a table per figure, `toggle-group` `single` for the time-range presets.
- **`005`** reuses `popover`'s chrome for `dropdown-menu` and the `scrollbar` utility for the sidebar.
- **`006`** uses `code-block` at `sm` inside chat messages and the hook for streamed code.
- **The `--code-*` slots are the one place a highlight colour lives.** Every slot added joins the same map, as `007`'s do (decision 21).

### 20. Build order

One builder, in this order. Previews and tests go with each step.

1. **Tokens and theme** (decision 5): the `code` map, `scripts/tokens.ts`, `build-tokens.ts`; `tokens.test.ts`, `contrast.test.ts`, `generated.test.ts`. Version to 0.4.0.
2. **The lint** (decision 15) and `literals.test.ts`.
3. **The install** (decision 3), then **`highlighter`, `use-highlighted-code` and `code-block`** (decisions 6 to 8), their pages and `code.spec.ts` C1 to C4.
   - **Checkpoint: a review after step 3.** The builder stops and reports to the design lead: the class-per-token rendering working in the raw HTML (decision 7's untested point), the groove on wash in both themes (screenshots at 360, 768, 1280), the emphasised lines, and C1 to C4 green. *Why here:* the palette and the rendering path are what `code-editor` and every later code surface copy.
4. **`code-editor`** (decision 9), its page, E1 to E4.
5. **`popover`, `accordion`, `toggle`, `toggle-group`** (decisions 11 to 13), their pages, P1, A1, T1.
6. **`chart` and `meter`** (decisions 10 and 14), their pages, H1, M1.
7. **Registry and catalogue** (decisions 4, 16): entries, groups, `registry.test.ts`, `previews.test.ts`, `deps.test.ts`, `utils.test.ts`.
8. **Browser and smoke suites** in full; `CHANGELOG.md`; the development walk (criterion 25).

**If time runs short**, one part may be deferred and recorded as deferred, not dropped: the two-series line chart on the `chart` page (decision 10; the one-series bar chart and its table stay). Nothing else is deferrable: the ten items are the scope.

### 21. Limits, and what lies outside this specification

- **ANSI output** (decision 1): this release has no `ansi` language, no `--code-ansi-*` slots and no `terminal.ansi*` colours. A program's escape codes render as text.
- **`scroll-area`** is not served (decision 1).
- **Firefox and Safari.** This release checks Chromium only, and the meter in WebKit too (editor memo §9, data memo §9). The editor, the meter's Firefox pseudo-elements, `scrollbar-color` and the SVG `fill="var()"` attribute were not run in Firefox or Safari. Firefox, Safari and iOS Safari are outside this release's checks (`decisions.md`, "After the public-readiness review").
- **Screen readers.** No screen reader has been run; the tests prove the DOM contract for the editor's announcements, the meter and the chart's table, as `003` decision 25 states for the blocks. Screen readers are outside this release's checks (`decisions.md`, "After the public-readiness review").
- **Completion in the editor** (`python()` with `autocompletion()`) is not included (`decisions.md`, "The design calls for `004`, code and data"); it is one import and 4.6 KB.
- **`field-sizing`** is settled in `005`: the composer grows by `field-sizing: content` (`decisions.md`, "The design calls for `005`, overlays, navigation and the chat primitives").

## Design

```
tokens/pluto.tokens.json
  code: { foreground, background, keyword, string, constant, function,
          comment, link, inserted, deleted, changed, active-line }   ── build-tokens ──►
      :root  --code-<slot>: var(--<semantic>)          (cssVars.light)
      @theme --color-code-<slot>: var(--code-<slot>)   → text-code-*, bg-code-*
      @utility scrollbar;  [data-slot=meter] rules      (css)

src/lib/registry/
  lib/highlighter.ts            shiki/core + JS engine + the theme object (var(--code-*)) + tokenClass()
  hooks/use-highlighted-code.svelte.ts   lines of { content, class }
  ui/code-block/                bg-muted; groove; pre.scrollbar tabindex=0; lines by class; copy → status
  ui/code-editor/               code-editor.svelte (onMount view, <pre> fallback)
                                code-editor-theme.ts (EditorView.theme + HighlightStyle, all var())
                                code-editor-python.ts (pythonSetup)
  ui/chart/                     <figure aria-label> … <details>table</details>; tooltip on shadow-elevation
  ui/meter/                     <meter data-slot=meter>
  ui/popover/                   role=dialog, shadow-elevation, w-3xs, animate-enter/exit
  ui/accordion/                 aria-controls + region; CaretRight rotate-90; not-first:groove
  ui/toggle/, ui/toggle-group/  data-[state=on]:bg-foreground text-background; h-12 / h-8

one Python line, two engines:
  Shiki  keyword→text-code-keyword   string→text-code-string   print(→text-code-function font-medium   =→(no class: foreground)
  Lezer  tags.keyword→--color-code-keyword   tags.string→--color-code-string   function(variableName)→--color-code-function 500   operator→&
```

**An example composition**, a page with an editor and a run (not built here):

```
Tabs ─ NumPy | Pandas | SciPy | scikit-learn | Shuffle
CodeEditor label="Python example" describedby="hint" bind:value onrun readonly={running}   (bg-muted)
  hint: "Ctrl Enter runs the example. Tab leaves the editor."
Button Run (busy)  Button Reset  Kbd Ctrl Enter
CodeBlock code={stdout} (plain)            CodeBlock variant=destructive  header "Error output"
Item rows … Meter value=4.81 max=30 + "Fuel: 4.81 billion instructions of 30 billion" + Popover "Fuel"
Accordion level=3 … security claims
```

## Scope

**In** (the work to *built*):

- The `code` map in the token file; `scripts/tokens.ts`, `build-tokens.ts`; the emitted variables, utilities and rules; `src/app.css` regenerated.
- The two lint rules and their samples.
- The 40 files of the ten items under `src/lib/registry/`, their 10 entries in `registry.json`, and `meta.stock` on 8.
- 10 item pages (one with a `+page.server.ts`); the catalogue's two groups.
- Tests: 9 unit files (5 updated), 9 browser files (`code.spec.ts` new; `axe`, `theme`, `tokens`, `keyboard`, `primitives` and `pages.ts` updated), 5 smoke files (`code-add.test.ts` new).
- `package.json` version 0.4.0 and 9 packages; `bun.lock`; the `CHANGELOG.md` entry.

**The step to *done*** is the release (constitution §2 and §4.2): the built change is reviewed and tagged `v0.4.0` (criterion 26).

**Out:**

- `scroll-area`; the `ansi` language; `drawSelection`, `indentWithTab`, completion, search, folding and linting in the editor; `startLine` on the code block; chart motion; `low`, `high` and `optimum` on the meter; the `spacing` prop of the toggle group.
- Overlays, the sidebar, the chat primitives (`005`); the app shell and the chat pane (`006`); any block; deployment.
- Any change to a `001`, `002` or `003` item other than the additive `pluto-theme`; any new colour primitive.
- Firefox and Safari checks and a screen-reader pass: outside this release (decision 21).

## Acceptance criteria

Each is a count, checked by the command named. "Clean clone" is `001`'s. Every command runs under Bun. Criteria 1 to 25 make `004` *built*; criterion 26 makes it *done*.

1. **Install.** On a clean clone, `bun install --frozen-lockfile` exits 0. `deps.test.ts` finds 32 packages with decision 2's specifiers and lock versions, 18 named by items, and 3 of 3 Bun checks.
2. **Checks.** `bun run check` reports 0 errors and 0 warnings. `bun run lint` exits 0.
3. **Tokens.** `bun run build:tokens` run twice changes 0 files the second time. `tokens.test.ts` finds the `code` map with 12 of 12 entries naming semantic colours; `contrast.test.ts` passes `002`'s counts plus 10 of 10 slot rows at 4.5 or more; `generated.test.ts` finds 12 `code-*` in `light`, 0 in `dark`, 12 `color-code-*` in `theme`, `@utility scrollbar`, and the meter's 5 pseudo-element rules.
4. **Registry source.** `registry.test.ts`: 49 items in decision 4's order and types (1, 3, 2, 1, 37, 5); 49 of 49 groups among 8; 0 `local:` or scheme dependencies; 27 of 27 dependency names resolve; 37 of 37 `registry:ui` items have 2 or more files; 34 of 34 `meta.stock`; 10 of 10 `since` `"0.4.0"` with decision 4's titles; 2 of 2 own items without `meta.stock`.
5. **Registry build.** `bun run build:registry` writes 50 files to `static/r/styles/maia/` and 50 byte-identical files to `static/v0.4.0/r/styles/maia/`; 0 of 2 stale survive; 49 of 49 parse; 0 contain `#lib`; 37 of 37 `registry:ui` targets start `<name>/`; the hook and library targets as decision 4; `highlighter` names `shiki@^4.5.0`, `chart` `layerchart@^2.9.2`, `code-editor` 7 of 7 ranges; 11 of 11 `tailwind-variants` items at `^3.3.1`; 0 of 50 files with `$UTILS$.js` or `/index.js"`.
6. **Site build.** On a clean clone, `bun run build` exits 0. `build/` holds 50 files under `r/styles/maia/`, 50 under `v0.4.0/r/styles/maia/`, 0 under earlier versions, and 68 prerendered pages.
7. **Dev server.** `GET /r/styles/maia/index.json` answers 200 with 49 items.
8. **Preview pages.** `previews.test.ts` finds 49 of 49.
9. **The lint.** `literals.test.ts` finds 193 item files and 0 violations; 70 of 70 bad samples flagged; 0 of 47 good. `bun scripts/lint-literals.ts` exits 0.
10. **The merge path.** `utils.test.ts` passes 7 of 7, case (d) over 11 of 11 importers.
11. **Blocks.** `blocks.test.ts` passes with `003`'s counts.
12. **axe.** `axe.spec.ts` reports 0 violations across 286 scans.
13. **Themes.** `theme.spec.ts` passes 136 of 136.
14. **Tokens in the browser.** `tokens.spec.ts` passes `002`'s checks plus 3 of 3 per theme; `four-dot.spec.ts` unchanged.
15. **Keyboard.** `keyboard.spec.ts`, in 2 of 2 themes: 51 catalogue stops in order with the ring; 52 fixture stops over 24 items, 52 of 52 rings unclipped; 83 view stops over 18 views; 42 toolbar stops over 5 pages; 19 of 19 behaviours.
16. **Heights, targets, loops.** `primitives.spec.ts` passes `002`'s and `003`'s checks, plus 3 of 3 toggle heights, 0 fixture stops under 24 × 24 px, and 0 loops outside a spinner on 10 new pages.
17. **The code block.** `code.spec.ts` C1 to C4 pass in 2 of 2 themes: the raw HTML with `text-code-` spans and 0 `style` attributes in the block and 0 shiki chunks; 4 of 4 slot colours and the `=` span with no class; the `pre`'s `tabindex`, scrollbar and overflow, the ring on the root unclipped, the groove, 3 of 3 emphasised lines; the copy button's name, size, clipboard, status and reset.
18. **The editor.** `code.spec.ts` E1 to E4 pass in 2 of 2 themes: the fallback `pre` raw and 3 editors hydrated; 3 of 3 attribute sets; the ring unclipped, 5 of 5 computed theme values and 0 literals of ours in the emitted sheet; typing, reset, 2 of 2 run keys, readonly.
19. **The chart.** `code.spec.ts` H1 passes in 2 of 2 themes: 2 figures labelled by their captions and 2 tables raw, 0 `svg[role=figure]`; 2 of 2 figures with a figure `svg` hydrated; `fill` and `stroke` from `--chart-1` and `--chart-2`, `stroke-width` 0; 0 `style` attributes on chart slots; the tooltip's shadow.
20. **The meter.** `code.spec.ts` M1 passes in 2 of 2 themes: the name, 3 attributes, `appearance`, background, height, 2 of 2 pixels, the text.
21. **Popover, accordion, toggles.** `code.spec.ts` P1, A1 and T1 pass in 2 of 2 themes: the two shadow layers (the second transparent in dark), role, label, width, 0 border, and 2 of 2 other popovers named; 3 of 3 triggers wired to regions, level 3, carets, grooves on 2 of 3; inverted pressed colours on the toggle and the checked group item, and the group's role.
22. **Smoke.** `code-add.test.ts` passes 8 of 8 in each of 2 scratch apps (16 of 16), with 47 files landed. `001`'s, `002`'s and `003`'s smoke files still pass.
23. **Test files.** On a clean clone, `bun run test` exits 0, having run 9 unit files, 9 browser files in 2 projects and 5 smoke files.
24. **Release.** `package.json`'s `version` is `0.4.0`. `registry.test.ts` finds the `0.4.0` entry naming 11 of 11, and the three older entries unchanged.
25. **The checkpoint and the walk.** The Landing notes record the design lead's review after build step 3 with its screenshots' findings, and the development walk of 68 pages in 2 themes: 0 of 136 loads with a page error or a console error or warning.
26. **Released:** the change is tagged `v0.4.0` and the Landing notes cite its review.

## Landing notes

- **Built:** 2026-10-31, over `fb942f8` (`003`, `v0.3.0`); committed as `b3d2a8e`, tagged `v0.4.0`. The change review is [`../reviews/004-code-and-data-pr-2026-10-31.md`](../reviews/004-code-and-data-pr-2026-10-31.md): "Does not land yet" on 2 Medium and 7 Low findings; all 9 fixed, three of them by the design lead's calls in `decisions.md` ("The design calls for `004`", "After the change review").

**What the design lead saw, under Bun 1.3.14, 2026-10-31 (EXECUTED by the builders and re-run by the reviewer; the numbers are after the fixes):**

| Check | Result |
|---|---|
| `bun run check` | 1478 files, 0 errors, 0 warnings |
| `bun run lint`, `bun scripts/lint-literals.ts` | exit 0; 0 literals in 193 item files |
| `bun run build:tokens`, twice | the second run changes 0 files |
| `bun run build` | 50 + 50 registry files, 68 prerendered pages; on a clean clone 0 earlier version folders |
| `bun run test`, twice in a row after the fixes | exit 0: unit 442 pass (9 files), browser 870 passed (9 files × 2 projects; 868 before review finding 6 split one test), smoke 68 pass (5 files) |

**Criteria, as counted at landing** (EXECUTED by the builders, re-run by the reviewer at the same numbers):

| # | Count |
|---|---|
| 1 | frozen install exits 0 on a clean copy; `deps.test.ts`: 32 packages, 18 named by items, 3 of 3 Bun checks |
| 2 | 0 errors, 0 warnings; lint exit 0 |
| 3 | second `build:tokens` changes 0 files; `code` map 12 of 12; 10 of 10 slot rows at 4.5 or more; 12 `code-*` in `light`, 0 in `dark`, 12 `color-code-*`, `@utility scrollbar`, 5 pseudo-element rules |
| 4 | 49 items, types 1, 3, 2, 1, 37, 5; 49 of 49 groups among 8; 0 `local:` or scheme; 27 of 27 dependency names; 37 of 37 `registry:ui` with 2 or more files; 34 of 34 `meta.stock`; 10 of 10 `since` `"0.4.0"` with decision 4's titles; 2 of 2 own items without `meta.stock` |
| 5 | 50 + 50 byte-identical; 0 of 2 stale; 49 of 49 parse; 0 `#lib`; 37 of 37 targets; hook and library targets as decision 4; `shiki@^4.5.0`, `layerchart@^2.9.2`, 7 of 7 CodeMirror ranges; 11 of 11 `tailwind-variants`; 0 of 50 with `$UTILS$.js` or `/index.js"` |
| 6 | clean copy: 50, 50, 0 earlier versions, 68 pages |
| 7 | 200 with 49 items |
| 8 | 49 of 49 |
| 9 | 193 files, 0 violations; 70 of 70 bad, 0 of 47 good |
| 10 | 7 of 7; case (d) 11 of 11 |
| 11 | `003`'s counts |
| 12 | 286 scans, 0 violations |
| 13 | 136 of 136 |
| 14 | `002`'s checks plus 3 of 3 per theme; `four-dot` 14 + 14 |
| 15 | 51 catalogue stops; 52 fixture stops over 24 items, 52 of 52 rings unclipped; 83 view stops over 18 views; 42 toolbar stops over 5 pages; 19 behaviours (in 19 tests after review finding 6) |
| 16 | 3 of 3 toggle heights; 0 stops under 24 × 24 over 22 fixtures; 0 loops on 10 pages |
| 17 | C1 to C4 in 2 of 2 themes |
| 18 | E1 to E4 in 2 of 2 themes |
| 19 | H1 in 2 of 2 themes, now with the hover band at `--muted` (review finding 1) |
| 20 | M1 in 2 of 2 themes: 2 of 2 pixels |
| 21 | P1, A1, T1 in 2 of 2 themes; 2 of 2 untitled popovers named |
| 22 | `code-add` 16 of 16, 47 files; `registry-add` 20, `primitives-add` 14, `blocks-add` 16, `dev-loop` passes |
| 23 | 9, 9 and 5 files; exit 0 |
| 24 | `0.4.0`; the changelog's `0.4.0` names 11 of 11 and the `scroll-area` line; the older entries unchanged |
| 25 | notes 1 and 3 |
| 26 | met |

**Notes:**

1. **The checkpoint after build step 3.** The builder stopped with the tokens, the lint, the install, `highlighter`, `use-highlighted-code` and `code-block` built, C1 to C4 green, and 24 screenshots of the `code-block` page at 360, 768 and 1280 in both themes. The design lead's reading: the class-per-token rendering works in the raw prerendered HTML (the install snippet's tokens are `<span class="text-code-…">` and foreground tokens carry no class; 0 `style` attributes in the block; no Shiki chunk referenced); the groove between header and code reads as a cut on the wash in light (the 10% ink hairline over the 1 px white line) and as a hairline in dark; the emphasised line is the opaque `card` step with its 2 px marker, and the diff's `+` and `−` lines keep their columns; with the `pre` focused, the 2 px ring sits outside the rounded root on all four sides at every width. Two calls came out of it, recorded in `decisions.md`: string quotes take the string colour, and ligatures are off on code surfaces (`!=` had drawn as `≠`).
2. **The change review's findings applied.** The chart's hover band is `muted`, drawn behind the marks, and H1 reads it; the editor's fallback is `<pre role="group" aria-label>`; the preview's streaming status works (`timer` is `$state`); the copy button guards a missing `navigator.clipboard` and says "Could not copy" when a write is refused; the editor's two behaviours are two tests; E3 filters the emitted sheet by the theme's own class; the editor page says the caret is the browser's own; the chart's details turns one caret.
3. **The development walk.** The 68 pages on `bun run dev` in both themes, collecting page errors and console errors and warnings: 0 of 136 loads. The dev server's first start once hung after "(ssr) connected" with no listening port for 90 s and came up in 3 s on a retry; the smoke harness started it cleanly in every full run. The cause is not traced in this release; a retry is the remedy.
4. **Provenance.** The 8 stock-derived items carry `meta.stock` dated 2026-10-31. **0 of the 8 live JSON files differ** from the clone's `docs/static/registry/styles/maia/<item>.json` at `6149e14` (EXECUTED by the builder; the fetched copies are the builder's working notes, not kept).
5. **Where the build deviates from the specification, and who allowed it.** Each the least that works; all seen by the review and judged sound.
   1. *Shiki is imported lazily inside `getHighlighter`* (decision 7 says `highlighter.ts` imports from `shiki/core`): a static import put Shiki core into every page that renders a code block, against decision 16's "ships no Shiki" and C1. The builder; the review.
   2. *The function scope is `meta.function-call.generic`* (decision 6): `meta.function-call` wraps the whole call, arguments included. The builder.
   3. *The hook derives `GrammarState` from the highlighter's return type*: a type import of `shiki/core` made `build` name `shiki` on the hook, against decision 4's table. The builder.
   4. *The `code-block` page's snippets live in `snippets.ts`*: SvelteKit allows only load options as exports of `+page.server.ts`, and under Bun that error path crashed the prerender with SIGTRAP. The builder.
   5. *The `ansi` special case is dropped from `getLanguage`* (decisions 1 and 21). The builder.
   6. *The lint's two rules are named `injected stylesheet`, `css length in a theme file` and `css named colour in a theme file`*: the file numbers them L20 and L21, since L15 to L18 were taken by `002`'s change review. The builder.
   7. *The groove under a header is automatic* through `group-has-data-[slot=code-block-header]/code-block:groove`, applied when the block has a header anywhere; *every line carries a transparent left marker* so the emphasised marker shifts no column; *`CodeBlockTitle` inherits the header's colour*. The builder; the review.
   8. *Keyboard stops `pre:*`; clipboard permissions granted in the tests; C1 checks that no referenced chunk holds `codeToHtml`; C2 reads `=` inside its merged span (Shiki merges same-style neighbours); C2's "the `pre`'s background" is the root's; the Python block sits in a `max-w-2xl` column so it scrolls at 1280.* The builder.
   9. *The copy button's prop is `code`* (decision 8), renamed from stock's `value`. The builder.
   10. *Four editors on the editor page*, the fixture's own included; *the disabled editor's `tabindex` is `-1`* (decision 9 said both "always 0" and "leaves the tab order"; the behaviour wins); *no cursor-blink check* (without `drawSelection` CodeMirror draws no cursor layer: the test asserts 0 animations); *matching-bracket rows get `background-color: transparent`* to cancel the base theme's hex tint; *the keymap is ordered `closeBracketsKeymap, defaultKeymap, historyKeymap`*, because a keymap stops at the first handler and `defaultKeymap` would take Backspace first. The builder; the review (finding 9 on the keymap).
   11. *The toggle group's fixture item is its first* (bits-ui parks the row's stop on the first item until a selection moves it); *`TABBABLE` excludes `tabindex="-1"` on every element and includes `summary`*. The builder.
   12. *The accordion page uses three different heading sets*: a `region` is a landmark, and axe's `landmark-unique` failed when two open regions shared a name. *The accordion root drops stock's border and `overflow-hidden`*, so the triggers' rings are not clipped. The builder.
   13. *No `transition` on the accordion trigger, and an explicit `transition-[color,background-color,border-color]` on the toggle*: `transition-colors` animates `outline-color`, so the ring was not there at once (`002` decision 8). The builder.
   14. *`utils.test.ts` case (d) counts type-only imports from `tailwind-variants/lite`* (`toggle-group` needs only `VariantProps`). The builder.
   15. *The `figcaption` is the figure's first child* (decision 10 ordered box, caption, details): Svelte's `a11y_figcaption_index` warns otherwise and `check` must be clean. *The chart page holds exactly 2 figures*, the fixture being the Variants chart. *H1 moves the mouse in steps*, since layerchart's hit layer needs movement. *`chart` also names `phosphor-svelte`* (the caret). *`config` is optional.* *`ChartTooltip` drops `indicator` and `color`*: the line and dashed indicators needed `border-[1.5px]`. *The container overrides more `lc-*` classes than decision 10 lists* (axis ticks, rules, grid lines, the root). The builder; the review.
   16. *`registry-add.test.ts` check 4 now expects the 12 derived `--code-<slot>: var(--code-<slot>)` lines in an app's `@theme inline`* (decision 5's by-product); the old equality failed once the code tokens existed. The builder; the review judged the lines harmless (the unlayered `:root` wins the cascade, `--code-` is no Tailwind namespace).
   17. *The fallback `pre` is a named `group`; the hover band is `muted`; one caret turns on the chart's details.* The design lead, after the change review.
6. **For `005`, `006` and a consuming app.**
   - The twelve `--code-*` tokens are the one place a highlight colour lives; `text-code-*` and `bg-code-*` are utilities. Every slot added joins the same map (decision 21).
   - `scroll-area` is not served. The pattern is `overflow-auto scrollbar` with `tabindex="0"` and a label; the utility is verified in Chromium only (`tokens.spec.ts`); Firefox and Safari are outside this release's checks (decision 21).
   - The editor: `pythonSetup()`, `readonly` while a run is in flight, `reset()` on tab change, `onrun` for Ctrl Enter and ⌘ Enter, a visible hint wired by `describedby`, and `max-h-96` in an app's page if a cap is wanted (`max-h-sm` generates nothing). Tab leaves the editor; the page says so. The prerendered fallback is a named group.
   - The code block: `lines` from `highlightCode` in a `load` for static code (no Shiki in the browser); a plain `code` with no `language` for run output; `destructive` needs a visible label. The copy button says "Copied" or "Could not copy" through its status region.
   - A chart: a hand-composed `Chart` passes `series` so the tooltip has rows, `tooltipContext={{ mode: "band" }}` with `<Highlight area />` before the marks; `bandPadding` on `Chart` gives the band scale without `d3-scale`; a table per figure; one series per figure or marks that differ.
   - `aria-valuetext` on the native `<meter>` passed axe in both themes; no screen reader has been run (decision 21).
   - An app's `@theme inline` gains twelve derived `--code-*` lines from the CLI; they are harmless and `registry-add` counts them.
