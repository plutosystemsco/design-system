# 007 — The full highlight palette and the ink surface

- **Status:** draft, 2026-11-01, amended the same day after its specification review ([`../reviews/007-the-full-highlight-palette-and-the-ink-surface-spec-2026-11-01.md`](../reviews/007-the-full-highlight-palette-and-the-ink-surface-spec-2026-11-01.md), 11 findings, all fixed here), fit to build once `006` is built
- **Date:** 2026-11-01
- **Owner:** Clay Gendron (written by an agent, Claude, the orchestrating session, as design lead under the owner's delegation of 2026-10-27)
- **Kind:** the `code` map grown from twelve slots to twenty-one, with five new text-safe hue pairs; both engines' mappings across twenty-six languages; one new registry item (`code-languages`); the ink surface as two rules in `pluto-theme`; one class change in `code-block`; tests; the 0.7.0 release
- **Depends on:** [`006`](./006-the-app-shell-and-the-chat-pane.md) and [`005`](./005-overlays-navigation-and-the-chat-primitives.md), *draft* (the surface fixture opens `005`'s dialog and dropdown menu), and through them [`004`](./004-code-and-data.md) (`b3d2a8e`, `v0.4.0`), whose code items this specification changes.
- **Blocks:** `wasi-python-dev`'s restyle to the book (its note of 2026-11-01 asks for items 1 and 2 of its four in a tagged release: the fuller highlighting and a sanctioned ink surface under which the editor, the code blocks, the tabs, the meter and the popover pass axe).
- **Research it stands on:**
  - [`../research/2026-11-01-a-fuller-python-palette-within-the-books-rules.md`](../research/2026-11-01-a-fuller-python-palette-within-the-books-rules.md) (the palette memo)
  - [`../research/2026-11-01-an-ink-surface-inside-a-light-page.md`](../research/2026-11-01-an-ink-surface-inside-a-light-page.md) (the ink memo)
  - [`../research/2026-10-31-shiki-and-a-token-highlight-palette.md`](../research/2026-10-31-shiki-and-a-token-highlight-palette.md) and [`../research/2026-10-31-codemirror-6-under-svelte-5.md`](../research/2026-10-31-codemirror-6-under-svelte-5.md) (`004`'s memos), for the two engines' mechanics
- **Design calls:** `../decisions.md`, "Syntax highlighting is a function, outside the colour budget" (2026-11-01, the owner's ruling and its "every major language" bullet) and "The design calls for `007`" (2026-11-01).

## Intent

`004` coloured three things: keywords, strings, comments. The first app, restyling itself to the book, found most of a Python file left in the body colour and asked for more. The owner ruled: "full syntax highlighting as a dev would expect from something like PyCharm or VS Code. This in no way impacts how colors and accents are used, this is a functional feature", and then "full coverage of all major coding languages" (decisions.md). So this specification does two things the book's §03 budget never governed, and one thing the app needs around them.

1. **A full palette is about twenty roles in eight hue families**, not a colour per scope (palette memo §1: VS Code's Dark Modern colours 18 foregrounds, PyCharm's Darcula 13, both in about eight families). The `code` map grows to twenty-one slots. Every slot is a *role* that holds in any language (a type name, a key, a decorator), so one theme colours every grammar. Five hue families join the five text colours the tokens hold: orange, purple, teal, cyan, and the brand's amber made text-safe. Every text slot passes 4.5:1 on all six code grounds in both themes (memo §3.3, EXECUTED).
2. **Both engines map every role across the major languages.** Shiki's bundled grammars cover all twenty-six; the memo proved every sample lands its roles in the right slots (§6.4, EXECUTED). CodeMirror has first-class grammars for eighteen, Svelte from one third-party package, and eight only as legacy modes. The Python grammar is taught the four roles it lacks through `styleTags`, and a small view plugin tells `self`, the built-ins and docstrings, which no tag can (§4.2). One new item, `code-languages`, lets an editor open any of the twenty-six on demand.
3. **An ink surface is sanctioned.** A `.dark` subtree inside a light page already gets every colour but the code slots, which are substituted at `:root` and inherit light (ink memo §1, EXECUTED). Repeating the references in `.dark` fixes that; one plain rule beside `dark` puts the code ground flush with the surface; `BitsConfig` brings the overlays inside. about 0.6 KB of built CSS (538 bytes measured with twelve slots; the twenty-one add a little), axe at 0 in both page themes (§3.4).

**Not here:** italic (the installed face is upright only, `004` decision 6); `operator`, `punctuation`, `parameter`, `regexp` and `docstring` as slots of their own (memo §3.1 says why each reads as another); `ansi`; a one-class `surface-ink` that re-declares the dark set (V1, +1.7 KB and emitted only when scanned); the design book's own text (the owner's; §03 gains one line, decisions.md).

**Terms of art.** A *slot* is one `--code-<name>` custom property: a role a theme colours. A *scope* is the dotted name a TextMate grammar gives a span of text; Shiki colours by scope. A *tag* is `@lezer/highlight`'s equivalent; CodeMirror colours by tag through a `HighlightStyle`. A *ground* is the surface code sits on; the six code grounds are light and dark `muted`, `card` and `background`. *Text-safe* is 4.5:1 or better on its ground. A *legacy mode* is a CodeMirror 5 tokenizer run through `StreamLanguage`: no syntax tree, coarser tags. *The surface* is an element with `class="dark surface-ink"`: the dark theme's tokens on an ink ground inside any page. A *portal* is bits-ui rendering an overlay under `document.body` instead of beside its trigger.

## Decisions

### 1. Scope: the palette, the languages, one item, the surface, one class, and nothing else

- The token file: nine primitives, five semantic pairs, nine new `code` entries. `build-tokens` emits the slots into both theme blocks (decision 4).
- `highlighter.ts`: the theme object rewritten by role (decision 5); the lazy list grown from 14 to 26 languages; the strict engine.
- `code-editor`: `code-editor-theme.ts`'s `HighlightStyle` rewritten by role; `code-editor-python.ts` gains the configured language and the roles plugin (decision 6); its seven dependency ranges are unchanged (`@lezer/highlight` is already one of them).
- `code-languages`: new, `registry:lib`, one file, three packages (decision 7).
- `pluto-theme`: `cssVars.dark` gains the 21 references; `css` gains the two surface rules (decision 8). Additive; not an interface change.
- `code-block`: the root reads `bg-code-background` instead of `bg-muted` (decision 8). The two are the same colour everywhere but inside a surface; not an interface change.
- The lint: one rule, L19 (decision 3).
- Item pages: `code-languages` new; `highlighter`, `code-editor`, `code-block` and `pluto-theme` grown (decision 9). The samples live in one preview module.
- Tests, the changelog, version 0.7.0.

**Out:** everything in "Not here" above; any change to `005`'s or `006`'s items beyond what the surface fixture composes; Firefox, Safari and a screen reader (decision 14).

### 2. The twenty-one slots

The `code` map, in this order. A slot is a role, so one theme covers every grammar (palette memo §3.1). The twelve of `004` keep their names; `constant` and `function` change colour.

| Slot | Role | Family | New |
|---|---|---|---|
| `foreground` | the body: names, parameters, keyword arguments, operators, punctuation, brackets | ink | |
| `background` | the code ground | `muted`, or the surface (decision 8) | |
| `comment` | comments, docstrings, diff headers, Markdown quotes | ink-soft | |
| `keyword` | keywords, storage words, word operators (`and`, `in`, `new`, `typeof`), Markdown marks, preprocessor directives | blue | |
| `constant` | `True`, `None`, `null`, `undefined`, symbols, enum members, `UPPER_CASE` names | blue | colour |
| `string` | strings, regexps, inline code, YAML scalars | green | |
| `number` | numbers, units, colours, dates | orange | yes |
| `escape` | escapes, f-string braces and specs, `${ }`, `#{ }`, JSX braces, HTML entities | orange | yes |
| `function` | definitions (medium weight), calls, methods, macros, preprocessor functions | amber | colour |
| `builtin` | built-in functions, kernel functions, magic names, CSS functions | purple | yes |
| `type` | classes, interfaces, namespaces, primitive types, Rust lifetimes | teal | yes |
| `tag` | HTML tags, CSS selectors, components, TOML tables | teal | yes |
| `property` | keys, attributes, fields, object members, shell and PHP `$variables` | cyan | yes |
| `decorator` | decorators, annotations, attributes (`#[derive]`, `[Obsolete]`, `@Override`) | purple | yes |
| `self` | `self`, `cls`, `this`, `super`, Swift's `$0` | purple | yes |
| `link` | links; underlined | blue | |
| `invalid` | invalid text | red | yes |
| `inserted`, `deleted`, `changed` | diff lines | green, red, blue | |
| `active-line` | the editor's active line and the block's emphasised line | `card`, or `muted` in a surface | |

*Why `constant` leaves ink for blue:* both editors colour language constants with the keywords (memo §1.3); `004` kept them ink to spare the one accent, which the ruling lifts. *Why `function` leaves ink for amber:* VS Code's function family is yellow and brown; in our palette that is amber. Weight still marks a definition; a call is now told by colour too, so the `font-medium` on every call goes (memo §5). *Why `invalid` is a slot:* the editor read `--destructive` directly, the one highlight colour outside the map (`004` decision 9); now the map is the one place. *Why `operator` and `punctuation` are not slots:* both editors leave them in the body, and brackets alone are a fifth of all tokens; a class on each would double the HTML for nothing (§3.1).

### 3. The values: nine primitives, five semantic pairs, one lint rule

**The primitives.** Derived like the tokens were (memo §3.2, EXECUTED): hue and saturation fixed, lightness searched to the first value that passes 4.7 on the hardest ground (`muted`), so each keeps headroom over 4.5. Cyan was derived at 4.5 and sits at 4.52 and 4.53.

| Primitive | Hex | Primitive | Hex |
|---|---|---|---|
| `amber-text` | `#85600B` | `orange-text` | `#A44F12` |
| `orange-lifted` | `#E7792A` | `purple-text` | `#903ACE` |
| `purple-lifted` | `#B780DF` | `teal-text` | `#15717A` |
| `teal-lifted` | `#20A6B3` | `cyan-text` | `#1B709B` |
| `cyan-lifted` | `#269DD8` | | |

The dark `function` colour is the brand's own `amber`, `#F0AE12`, which already passes on every dark ground. `amber-text` is an ochre, not a yellow: the lightest colour of amber's hue and saturation that passes 4.7 on light `muted` (§3.5; at 4.5 it would be `#8A6309`). `001` decision 8's "amber is never text" stays for surfaces and copy; a function name in a code block is a functional colour under the ruling.

**The semantic pairs.** `004` decision 5 requires every `code` value to name one of the semantic colours, so the theme switch carries through `.dark`. That rule stays; `themes.light` and `themes.dark` gain five names each, **48 becomes 53**:

| Semantic name | Light | Dark |
|---|---|---|
| `syntax-orange` | `orange-text` | `orange-lifted` |
| `syntax-amber` | `amber-text` | `amber` |
| `syntax-purple` | `purple-text` | `purple-lifted` |
| `syntax-teal` | `teal-text` | `teal-lifted` |
| `syntax-cyan` | `cyan-text` | `cyan-lifted` |

The `code` map then reads: `number: syntax-orange`, `escape: syntax-orange`, `function: syntax-amber`, `builtin: syntax-purple`, `decorator: syntax-purple`, `self: syntax-purple`, `type: syntax-teal`, `tag: syntax-teal`, `property: syntax-cyan`, `constant: primary`, `invalid: destructive`; the rest as `004` has them. *Why a `syntax-` prefix:* the five are reached only through the `code` slots; the prefix says so to a reader of `app.css`.

**The contrast table** (memo §3.3, EXECUTED; every text slot on every ground, light and dark `muted` / `card` / `background`):

| Family | Light | on `muted` / `card` / `background` | Dark | on `muted` / `card` / `background` |
|---|---|---|---|---|
| ink (`foreground`) | `#14161C` | 15.00 / 18.08 / 16.84 | `#F7F7F4` | 12.83 / 14.99 / 16.84 |
| ink-soft (`comment`) | `#4A4F5C` | 6.79 / 8.18 / 7.63 | `#A9ADB8` | 6.13 / 7.17 / 8.05 |
| blue (`keyword`, `constant`, `link`, `changed`) | `#2456E6` | 4.90 / 5.91 / 5.51 | `#7A9BFF` | 5.22 / 6.10 / 6.85 |
| green (`string`, `inserted`) | `#136E3E` | 5.23 / 6.31 / 5.87 | `#4CC982` | 6.55 / 7.65 / 8.59 |
| red (`invalid`, `deleted`) | `#C42A1F` | 4.71 / 5.67 / 5.29 | `#FF7D73` | 5.53 / 6.46 / 7.26 |
| orange (`number`, `escape`) | `#A44F12` | 4.70 / 5.66 / 5.27 | `#E7792A` | 4.70 / 5.49 / 6.17 |
| amber (`function`) | `#85600B` | 4.74 / 5.71 / 5.32 | `#F0AE12` | 7.06 / 8.25 / 9.27 |
| purple (`builtin`, `decorator`, `self`) | `#903ACE` | 4.73 / 5.70 / 5.31 | `#B780DF` | 4.70 / 5.49 / 6.17 |
| teal (`type`, `tag`) | `#15717A` | 4.74 / 5.71 / 5.32 | `#20A6B3` | 4.70 / 5.49 / 6.17 |
| cyan (`property`) | `#1B709B` | 4.53 / 5.47 / 5.09 | `#269DD8` | 4.52 / 5.28 / 5.93 |

`contrast.test.ts` proves it: **114 rows**, 19 text slots × 2 themes × 3 grounds, each at 4.5 or more, computed from the token file, never from this table.

**The pair to watch.** Teal and cyan are 15° apart and blue and cyan 25°; the memo's renders (§5.3) read them apart at 2×, and the checkpoint (decision 13) judges them at native size. **If the checkpoint cannot tell a key from a type at 13.5 px, `property` moves to a magenta pair** derived the same way at 320° (the memo's thresholds `#BA2E8B` / `#DB6DB6`, re-derived at 4.7), and the five pairs stay five. The Landing notes record which.

**The lint, L19.** A text rule, not a class rule: any occurrence of `syntax-(orange|amber|purple|teal|cyan)` in an item file is a violation. *Why a text rule:* Tailwind 4.3.3 also emits `text-(--syntax-orange)` and `text-(--color-syntax-orange)` (review finding 6, EXECUTED), the lint's variable form is otherwise always allowed, and a `.ts` theme string may write `var(--syntax-teal)`; no item has a legitimate use of the five names, since they are reached only through the `code` slots. The emission in `build-tokens.ts` is not an item file. *Why at all:* the ruling puts code colour outside the budget, not five new accents inside it. Samples: 3 bad (`text-syntax-orange`, `text-(--syntax-orange)`, the `.ts` string `color: "var(--syntax-teal)"`), 1 good (`text-code-number`): **74 bad, 49 good** on `006`'s numbers. `text-code-*` and `bg-code-*` stay allowed, as `004` decision 5 made them. L1 already flags `bg-syntax-orange/10` as a tint once the five names are in `themes.light`.

### 4. The emission: every slot in both theme blocks

- `cssVars.light` **and** `cssVars.dark` carry `--code-<slot>: var(--<semantic>)` for the 21. *Why both now:* a `var()` inside a custom property is substituted on the element that declares it. Declared on `:root` only, the slot computes to the light colour there and that colour inherits into a `.dark` subtree, so the editor was a light wash box inside an ink panel and the block's tokens failed axe 13 times (ink memo §1.2, §4, EXECUTED). Repeated in `.dark`, the slot is re-substituted on the subtree's root with the dark semantic values (§3.3, EXECUTED). `004` decision 5's "saying the same thing twice" is corrected: a subtree is where it is not. When `dark` is on `<html>` nothing changes.
- `cssVars.theme` carries `--color-code-<slot>: var(--code-<slot>)` for the 21, so `text-code-number`, `bg-code-background` and the rest are utilities. The lint's colour list holds the 21.
- The by-product `004` recorded stays: an app's `@theme inline` gains 21 derived `--code-<slot>: var(--code-<slot>)` lines from the CLI's updater, which derives from the union of the keys (ink memo §3.3, READ). `registry-add.test.ts` counts 21 (today 12).
- `generated.test.ts`: 21 `code-*` in `light`, **21 in `dark`**, 21 `color-code-*` in `theme`; the 5 `syntax-*` names in each theme block.

### 5. The Shiki theme, by role, over twenty-six languages

`highlighter.ts`'s theme object is rewritten from the palette memo's §4.1, which was proven over every sample (EXECUTED). About 28 rules. Each row's deeper selector beats a shallower one, which is how a role escapes its parent's rule.

| Slot | Scope families |
|---|---|
| `comment` | `comment`, `punctuation.definition.comment`, `string.quoted.docstring` and its quotes, `markup.quote`, `meta.diff.header`, `meta.diff.index` |
| `string` | `string` and `string punctuation.definition.string` (`004`'s checkpoint call: quotes take the string colour), `string.regexp`, `markup.inline.raw`, `string.other.link.title`, `storage.type.string.python` (the `f` prefix), `entity.name.tag.doctype` |
| `escape` | `constant.character.escape`, `constant.character.format.placeholder`, `constant.other.placeholder`, `storage.type.format`, `punctuation.section.embedded`, `punctuation.definition.template-expression`, `punctuation.definition.interpolation`, `constant.character.entity` |
| `number` | `constant.numeric`, `keyword.other.unit`, `constant.other.color`, `constant.other.time`, `constant.other.date` |
| `constant` | `constant.language`, `variable.other.constant`, `variable.other.enummember`, `constant.other.symbol`, `support.constant`; `support.constant.property-value` and `.font-name` back to the body |
| `keyword` | `keyword`, `storage`, `keyword.control`, `keyword.other`, the word operators (`keyword.operator.expression`, `.new`, `.delete`, `.logical.python`, `.sizeof`, `.cast`), `keyword.control.directive`, `punctuation.section.embedded.begin.php`, `meta.diff.range`, `punctuation.definition.heading`, `punctuation.definition.list.begin.markdown`; the symbol operators (`keyword.operator`, `storage.type.function.arrow`) back to the body |
| `function` | `entity.name.function`, `meta.function-call.generic`, `support.function.macro`, `entity.name.function.macro`, `entity.name.function.preprocessor`; **bold** under `meta.function`, `meta.function.definition`, `meta.method.declaration`, `entity.name.function.definition` |
| `builtin` | `support.function` (covers `.builtin`, `.kernel`, `.construct`, `.misc`), `support.variable.magic`, `support.variable` |
| `type` | `entity.name.type`, `entity.name.class`, `entity.name.namespace`, `entity.name.scope-resolution`, `entity.other.inherited-class`, `support.type`, `support.class`, `entity.name.package`, the primitives (`storage.type.primitive`, `storage.type.built-in`, `support.type.primitive`, `keyword.type`, Go's `storage.type.numeric` family, `storage.type.sql`, the Java, C#, Kotlin, Swift and PHP `storage.type` forms), Rust lifetimes |
| `tag` | `entity.name.tag`, CSS class, id and pseudo selectors, `support.class.component`, `entity.name.section.toml`; `punctuation.definition.tag` back to the body |
| `property` | `entity.other.attribute-name`, `support.type.property-name`, `meta.object-literal.key`, `meta.attribute.python`, `variable.other.property`, `variable.object.property`, `variable.other.object`, `variable.other.member`, `variable.other.readwrite.instance`, `entity.name.variable.field`, `entity.name.tag.yaml`, `variable.other.key.toml`, the shell variables, `variable.other.php`, `variable.css` |
| `decorator` | `meta.decorator`, `entity.name.function.decorator`, `punctuation.definition.decorator`, `meta.attribute.rust`, `storage.type.annotation`, `meta.attribute.cs`, `meta.attribute.php`, `storage.modifier.attribute`, `meta.annotation` |
| `self` | `variable.language`, `variable.parameter.function.language.special.self` |
| `link` | `markup.underline.link`, `string.other.link.destination`; underlined |
| `invalid` | `invalid`, `invalid.illegal`, `invalid.deprecated` |
| `inserted`, `deleted`, `changed` | `markup.inserted`, `.deleted`, `.changed` |
| bold, no colour | `markup.heading`, `entity.name.section.markdown`, `markup.bold` |
| the body | `variable`, `variable.parameter` (keyword arguments included), `punctuation`, `meta.brace`, the symbol operators |

- `tokenClasses` grows to **20** entries, every slot but `foreground`; `tokenClass` is unchanged (bold bit → `font-medium`, underline bit → `underline`). A foreground token still carries no class.
- **The lazy list grows from 14 to 26**: python, javascript, typescript, tsx, jsx, html, css, json, yaml, toml, markdown, shellscript (as `bash`), sql, go, rust, java, c, cpp, csharp, ruby, php, kotlin, swift, svelte, diff, docker; with the memo's aliases (`py`, `js`, `cjs`, `mjs`, `ts`, `cts`, `mts`, `yml`, `md`, `sh`, `shell`, `shellscript`, `zsh`, `rs`, `c++`, `c#`, `cs`, `rb`, `kt`, `kts`, `dockerfile`). 245 KB gzipped in all, loaded one at a time on first use; nothing until a block names a language (`004` decision 6).
- **The engine is strict**: `createJavaScriptRegexEngine({ forgiving: false })`. All 26 grammars compile under it (memo §6.1, EXECUTED), which closes the Shiki memo's §9 question.
- **The HTML barely moves.** Over the app's 29 files the classed share of runs goes from 49.7% to 53.4% and the rendered HTML shrinks by 2%, since calls lose their `font-medium` (memo §7, EXECUTED).

### 6. The editor: twenty-one rules, a configured Python, and the roles plugin

- **`code-editor-theme.ts`**: `codeHighlight` rewritten from memo §4.1's Lezer column. `comment` (`tags.comment`, `docString`, `quote`, `contentSeparator`, `documentMeta`); `string` (`string`, `special(string)`, `regexp`, `character`, `attributeValue`, `monospace`); `escape` (`escape`, `special(brace)`); `number` (`number`, `unit`, `color`); `constant` (`bool`, `null`, `atom`, `constant(variableName)`, `literal`); `keyword` (`keyword`, `modifier`, `processingInstruction`, `list`); `function` (`function(variableName)`, `function(propertyName)`, `macroName`; medium weight on `function(definition(variableName))` and `function(definition(propertyName))`); `builtin` (`standard(variableName)`, `standard(propertyName)`); `type` (`typeName`, `standard(typeName)`, `className`, `definition(className)`, `namespace`); `tag` (`tagName` and its forms); `property` (`propertyName`, `definition(propertyName)`, `attributeName`, `special(variableName)`, `labelName`); `decorator` (`annotation`, `meta`); `self` (`self`); `link` (`link`, `url`, underlined); `invalid` (`tags.invalid` → `var(--code-invalid)`); `inserted`, `deleted`, `changed`; `heading` and `strong` at medium weight with no colour. Operators, brackets, separators, names and `local(variableName)` take the `&` colour. Every value is a `var()`; the five `@theme inline` names stay as `004` decision 9 has them. The chrome (`codeTheme`) is unchanged.
- **`code-editor-python.ts`** exports `pythonLanguageConfigured`: `pythonLanguage.configure({ props: [styleTags({ "Decorator/VariableName": tags.annotation, "Decorator/MemberExpression/PropertyName": tags.annotation, "TypeDef/VariableName": tags.typeName, "TypeDef/MemberExpression/PropertyName": tags.typeName, "ParamList/VariableName": tags.local(tags.variableName), "FormatReplacement/{ FormatReplacement/}": tags.special(tags.brace) })] })` (memo §4.2, EXECUTED on the class sample), and `pythonSetup()` uses it in place of the bare `pythonLanguage`. The added rules **combine** with the grammar's own (`styleTags` props combine; review finding 11, EXECUTED by the reviewer): `CallExpression/VariableName` and `FunctionDefinition/VariableName` keep their tags, and a `{` outside an f-string keeps `brace`.
- **The roles plugin**, `pythonRoles`, in the same file: a `ViewPlugin` with `Decoration.mark` over the visible ranges, walked with `syntaxTree(state).iterate({ from, to, enter })` from `@codemirror/language` (no import from `@lezer/common`; the node's `name`, `from`, `to` and `node.parent` are enough). It marks a `VariableName`, callee or bare, whose text is `self` or `cls` with the class `text-code-self`; a `VariableName`, callee or bare, whose text is in the Python built-ins list with `text-code-builtin`; and a `String` that is the first statement of a `Script`, `ClassDefinition` body or `FunctionDefinition` body with `text-code-comment`. *Why a plugin:* none of the three is a node of its own, and `styleTags` matches ancestry, not siblings or position (memo §4.2). *Why classes:* the three utilities already exist, so the editor and the block paint one colour from one place; the literals in this `.ts` file put the classes in Tailwind's scan. **The plugin is wrapped in `Prec.highest`** in `pythonSetup()`. *Why:* the highlighter runs at `Prec.high`, and CodeMirror renders overlapping marks as nested spans with the highest-precedence mark innermost, where the inherited `color` is decided; at default precedence the plugin's span would be the outer one and `print` would read amber (review finding 1, READ in `@codemirror/view`'s `ensureMarks`). About sixty lines. The built-ins list is the 71 names of Python 3.13's `builtins` module that are functions or types, written out as a sorted array with a comment naming the source and version. Keyword arguments stay in the body on both engines (decision 2).
- **Dependencies.** Unchanged: `@lezer/highlight@^1.2.5` is already one of `code-editor`'s seven ranges (`004` decision 2). The rule it carries: a `HighlightStyle` and the grammars it colours must share one `@lezer/highlight` instance, or modified tags mismatch by id and `function(variableName)` from one copy reads as `special(brace)` in another (memo §4.3, EXECUTED). The item page says so for an app that installs language packages, and decision 7's smoke check reads the lock.
- `invalid` reads `--code-invalid`, not `--destructive`; `.cm-specialChar` and the nonmatching bracket keep `--destructive`, since those are the chrome's.

### 7. `code-languages`: any of the twenty-six, on demand

A new `registry:lib` item, one file `src/lib/registry/lib/code-languages.ts`, group `code`, `since` `0.7.0`, own (no `meta.stock`).

- **Exports.** `codeLanguages`: a table of the 26, each with its Shiki id, its aliases, its `kind` (`lezer`, `svelte` or `legacy`) and its `dataName`, the name `@codemirror/language-data` gives it. The names differ from the ids in four cases: `docker` → `Dockerfile`, `shellscript` → `Shell`, `cpp` → `C++`, `csharp` → `C#`; the rest equal the id, case aside (review finding 2, EXECUTED: `matchLanguageName` returns null for `svelte` and `docker` under either flag and for `shellscript` strictly). `loadLanguage(name: string): Promise<LanguageSupport | null>`: resolves the id or alias through the table, returns `null` for one it does not know, and otherwise loads by kind. **Three routes:** `python` returns `new LanguageSupport(pythonLanguageConfigured)` from `code-editor-python.ts`, so the editor's Python is the configured one everywhere, with the roles plugin in `pythonSetup()`'s hands; `svelte` is its own dynamic `import("@replit/codemirror-lang-svelte")`, since `language-data` has no Svelte; every other id goes to `LanguageDescription.matchLanguageName(languages, dataName, false)` (strict, not fuzzy: fuzzy matching would map unknown names by substring, against "returns `null`"), then `description.load()`, one dynamic `import()` per language, cached by the description (memo §6.2, READ). The item has `registryDependencies` `utils`, `pluto-theme`, `code-editor`.
- **Dependencies.** `@codemirror/language-data@^6.5.2`, `@codemirror/language@^6.13.1` and `@replit/codemirror-lang-svelte@^6.0.0`, each imported by the file so the CLI's import detection names it in the built JSON, and each pinned in `package.json` and `bun.lock` (`deps.test.ts` requires it). `language-data` depends on every `@codemirror/lang-*` package and `@codemirror/legacy-modes`, so installing the item installs them all: about two megabytes unpacked on disk (a READ figure; the item page repeats it). In the bundle each language is its own chunk, loaded when `loadLanguage` is first called for it (how Vite splits a dynamic `import()`; not counted, review finding 7). The page also says the Svelte package is four years old. An app that edits one language does not install this item: `pythonSetup()` alone is `004` decision 9's preset and stays.
- **What each language gets.** Eighteen have a Lezer grammar and the full palette; Svelte comes from `@replit/codemirror-lang-svelte` 6.0.0 (2022, 190 KB unpacked; `$props()` and `$state()` parse as calls, memo §8); eight come as legacy modes (Shell, TOML, diff, Dockerfile, Ruby, Swift, Kotlin, C#): keywords, strings, numbers, comments and little more, no bracket matching by syntax (memo §6.4). The item page's table says which is which, and the known gaps: Lezer's YAML leaves plain scalars untagged; Lezer's CSS tags selectors as `className`, so they land in `type` while Shiki puts them in `tag`; the memo's per-language notes.
- **How an app uses it.** `extensions={[...baseSetup(), support]}` on `code-editor`, where `support` is awaited from `loadLanguage`; the page shows the pattern with a `select` (`002`'s `native-select`) and an `$effect` that reconfigures. `pythonSetup()` is not a model for other languages' keymaps; the page shows a `baseSetup()` of line numbers, history, the default keys, bracket closing and matching, indent on input, the active line and `codeHighlight`, written in the page, not the item.
- **The kinds, as the page's table shows them.** Lezer: Python, JavaScript, JSX, TypeScript, TSX, HTML, CSS, JSON, YAML, Markdown, SQL, Go, Rust, Java, C, C++, PHP, plus Svelte through `@replit`; legacy: Shell, TOML, diff, Dockerfile, Ruby, Swift, Kotlin, C#. The gaps column holds the memo's per-language notes.
- **One `@lezer/highlight`.** The smoke test reads the scratch app's `bun.lock` after `add code-languages` and finds one `@lezer/highlight` entry (decision 10).

### 8. The ink surface: two rules, one contract

The ink memo's V4 (§3.4, EXECUTED: right in both page themes, axe 0 × 4, +538 bytes built, +41 gzipped).

- **`pluto-theme`'s `css` gains two plain rules**, after the utilities:
  ```css
  .surface-ink {
    --code-background: var(--background);
    --code-active-line: var(--muted);
    background-color: var(--background);
    color: var(--foreground);
  }
  .dark .surface-ink {
    --background: var(--card);
  }
  ```
  *Why plain rules, not `@utility`:* an `@utility` lives in `@layer utilities`; the CLI writes `.dark` unlayered; on one element the unlayered declaration wins whatever the order, so a utility could never override `--code-background` beside `dark` (memo §3.5, READ and EXECUTED). *Why `--code-active-line: var(--muted)`:* `card` is the surface's own ground on a dark page, so the active line would vanish; `muted` is one step above the ground in both pages (§3.2). *Why `.dark .surface-ink` sets `card`:* on a dark page an ink surface on an ink page is invisible (§1.4); `card` is the raised step. On a light page the element matches `.dark` and `.surface-ink` but no ancestor is `.dark`, so the rule does not fire and the surface is ink. *Why top-level selectors are safe in `css`:* `001` decision 15 forbids `:root` and `.dark` nested inside an at-rule; the CLI matches `.dark` exactly and copies these verbatim (§3.5). **The first rule wins by source order**: `.dark` and `.surface-ink` have equal specificity on one element, so `.surface-ink` must come later in the sheet. It does in the preview, because `build-tokens` prints `css` after the theme blocks, and in an installed app, because the CLI applies `cssVars` before `css` and appends a plain rule at the end (review finding 10, READ). An app that hand-moves the rule above `.dark` loses the override silently; the item page says so, and the smoke asserts the order (decision 10). The second rule, `.dark .surface-ink`, wins by specificity and needs no order.
- **The contract, as the item page states it:** an ink surface is `class="dark surface-ink"` on any element. Inside it every token is the dark theme's; the code ground and the editor's ground equal the surface; the surface is ink on a light page and `card` on a dark one; set `--background` on the surface to move all three. The `muted` insets keep their tint inside it (tabs, skeleton, meter track, hover and selected rows, the scroll box, a code block inside a card). `color-scheme` is `dark`, so native controls and scrollbars draw dark. Inside the surface the `dark:` variant applies, so an alert there takes its `/20` tint as on a dark page (ink memo §1.3); the `@custom-variant dark` is not widened, and no `surface-ink:` variant exists.
- **`code-block`'s root reads `bg-code-background`.** `muted` and the slot are one colour everywhere except inside a surface, where the block goes flush like the editor (§3.1). A block that should stay an inset inside a surface (one inside a card or a message) passes `class="bg-muted"`, which `cn` lets win. The item page says so.
- **Overlays.** bits-ui portals an overlay to `body`, so a popover opened inside the surface paints in the page's theme: white on a light page (§2.1). The fix needs no item change: **`<BitsConfig defaultPortalTo={node}>`** around the surface's content, where `node` is the surface element or a `display: contents` child of it, brings every bits-ui overlay inside with the same position to the pixel, focus inside and Escape returning focus (§2.2, EXECUTED for popover and tooltip). **Modal overlays are the page's**: a `dialog` or `sheet` opened from inside the surface passes `portalProps={{ to: "body" }}` and takes the page's theme and the page's scrim. *Why:* a modal belongs to the page, not to the panel its trigger sits in; a dark dialog over a light page would be the wrong hello. The surface's fixture (decision 9) proves both. The surface must carry no `transform`, `filter` or `contain`, or a portalled overlay inside it is clipped or re-anchored (§2.2, INFERRED); the page says so.
- **What stays in the app:** the panel's own chrome (`rounded border border-border p-4`), `BitsConfig`, and the `portalProps` on its modals. The app's `design.spec.ts` test 3 (ink memo §1.5) is satisfied by the contract as written.

### 9. The item pages and the samples

- **`src/lib/preview/code-samples.ts`** holds the 26 samples, nine to fifteen lines each, one per language, written fresh for the preview from the memo's list of what each exercises (a definition, a call, a type, a decorator or attribute where the language has one, a string with an escape or an interpolation, a number, a constant, a comment, keys or attributes for data and markup). The class sample stands for Python (a module docstring, a decorated dataclass with annotated fields, a `@property`, two methods with `self`, an f-string with `!r` and `:.2f`, a `print` with `None` and `True`). The samples are data, outside the lint.
- **`highlighter`** gains "Twenty-six languages": every sample as a `code-block` with its `lines` prerendered in a new `+page.server.ts` through `highlightCode`, in a two-column grid, each titled by its language. The page's slot table grows to 21 rows. *Why here:* this page is the theme's.
- **`code-languages`** (new): the install snippet; the editor with a `native-select` of the 26, loading the chosen language through `loadLanguage` and the class sample's language's text swapped in with `reset()`; the table of kinds and gaps; the install cost; the one-copy note. **Keyboard fixture:** 2 stops, the select and the editor's content.
- **`code-editor`**: the Python example becomes the class sample, so `self`, the built-ins, the decorator, the annotations and the docstring are on the page; the text says the roles plugin tells three things no tag can.
- **`code-block`**: unchanged in structure; its sudoku example now shows numbers, built-ins (`str`, `print`), constants and comments by the new rules; it holds no decorator or annotation, so C2 reads those on the editor page. Its text drops "told by weight, not colour".
- **`pluto-theme`** gains "An ink surface": a `section class="dark surface-ink rounded border border-border p-6"` holding a `code-editor` with `pythonSetup()`, a `code-block` with a header and a copy button, a pill (default) tab strip, a `meter`, a `popover` and a `dropdown-menu` under `BitsConfig`, and a `dialog` with `portalProps={{ to: "body" }}`; a paragraph with the contract; the surface's reading of the groove, the ring and the scrollbar (ink memo §6) in one sentence each. *Why the pill strip:* it sits on `bg-muted`, which is the inset S1 reads inside the surface; the `line` variant has no ground (ink memo §1.3). **Keyboard fixture:** the surface's **7 stops** in DOM order: the editor's content, the block's copy button, the block's `pre`, the active tab, the popover's trigger, the menu's trigger, the dialog's trigger. The surface is the one place a `dark` class appears in a preview page; the page says why.
- **Copy** follows R23 and R24.

### 10. The tests

- **Unit.** `tokens.test.ts`: 53 names per theme, both naming the same 53; 9 new primitives; the `code` map 21 of 21, each naming a semantic name, in decision 2's order. `contrast.test.ts`: `002`'s counts plus 114 slot rows at 4.5 or more; the ten text families cover ink, ink-soft, blue, green, red, orange, amber, purple, teal, cyan. `generated.test.ts`: decision 4's counts, the two surface rules present once each and `.surface-ink {` after `.dark {`. `literals.test.ts`: 72 bad, 49 good; the L19 samples. `registry.test.ts`: 63 items, the `code-languages` entry with decision 7's three dependencies, `code-editor`'s 7 ranges unchanged, `highlighter`'s 26 languages read from the built JSON, and `highlighter.json`'s content holding `forgiving: false` once and `forgiving: true` never (a source check belongs here, not in a browser test; review finding 8). `tokens.test.ts`'s primitives 25 → 34; `contrast.test.ts`'s `SLOT_ROWS` 10 → 114. `previews.test.ts`: 63 of 63. `deps.test.ts`: `@codemirror/language-data` and `@replit/codemirror-lang-svelte` pinned; 34 packages (`006`'s 32 + 2).
- **Browser**, in both projects. `code.spec.ts`: C2 reads the slot colours of a keyword, a string, a number, a built-in, a constant and a comment on the block page's sudoku example (6 slots), the `=` span with no class, and `font-medium` on the `def`'s name and on no call; E3 reads, on the editor page's class sample, `print` in the `builtin` colour at normal weight, `self` in the `self` colour, the docstring in the `comment` colour, `str` in the `type` colour, `dataclass` after `@` in the `decorator` colour (5 role readings), **the mechanism** (the span carrying `text-code-builtin` on `print` has no child span, so its class decides the colour; review finding 1), and "0 literals of ours" over the emitted sheet as before. New **L1** (`code-languages`): for each of the 26, choose it in the select, wait for `.cm-content` to hold the sample, and read at least 2 distinct computed token colours other than the body's (the legacy eight: at least 1; diff: inserted and deleted). New **S1** (the surface, `pluto-theme` page): on a light page the surface computes `rgb(20, 22, 28)`, `.cm-editor`, `.cm-gutters` and the block's root the same, the active line `rgb(43, 45, 50)`, the block's keyword `rgb(122, 155, 255)`, the pill tab strip and the meter's track `rgb(43, 45, 50)` (8 readings); with the popover open its content is inside the surface with the dark `popover` colour, and with the dialog open its content is under `body` with the light `popover` colour; on a dark page the surface computes `rgb(30, 33, 41)` and the editor the same. **S2**: `highlighter`'s gallery holds 26 blocks, each with at least 2 distinct `text-code-*` classes (diff: 2 of `inserted`, `deleted`, `comment`). `axe.spec.ts`: the new page at 360, 768 and 1280; the `pluto-theme` page at 1280 with the surface's popover open and again with its dialog open, in both themes. `theme.spec.ts`: the new page. `keyboard.spec.ts`: the two fixtures. `primitives.spec.ts`: heights and loops on the new page.
- **Smoke.** `code-add.test.ts` grows: `add code-languages` in both scratch apps; `bun.lock` holds one `@lezer/highlight`; `app.css` holds `.surface-ink {` once and `.dark .surface-ink {` once; the `.dark` rule holds 21 `--code-` lines; the `@theme inline` by-product is 21 lines; the index of `.dark {` is less than the index of `.surface-ink {`; a second `add pluto-theme` leaves the file byte-identical (this is the CLI order question of ink memo §7, settled by running it); `add code-languages` lands `@replit/codemirror-lang-svelte` and `@codemirror/language-data` in the app's `package.json`. No chunk count: Vite emits a chunk for every dynamic import whatever the page loads, all named `index-<hash>.js`, and the smoke runs no browser (review finding 7).

### 11. The version: 0.7.0, and the changelog

`package.json` `0.7.0`. The entry names the palette (21 slots, five families, every value text-safe on every ground), the 26 languages, `code-languages`, the surface contract, the `code-block` ground class, and the correction to `004`'s emission. Not an interface change: no prop, export or class name changes; `code-block`'s ground is the same colour outside a surface; `codeHighlight` and `codeTheme` keep their names.

### 12. What the app and later specifications take

- **The app's restyle:** `add pluto-theme code-block code-editor highlighter use-highlighted-code` from the 0.7.0 tag rewrites its `--code-*` block (21 lines in `:root` and in `.dark`) and the two surface rules; the run panel is `class="dark surface-ink"` with `BitsConfig` around its content and `portalProps={{ to: "body" }}` on any modal; its own `.slab` line is not needed. Its test 3's expectations hold under the contract.
- **A chat message's code block** (`006`) is an inset in a message, not a surface: nothing changes there.
- **`ansi`**, if ever: adds to the same map (`004` decision 21).
- **The design book §03** gains the ruling's line (the owner's, in the book's repository).

### 13. Build order

1. Tokens: primitives, pairs, the map; `build-tokens` emitting both blocks and the two rules; `src/app.css`; the unit tests of decision 10; the lint rule and its samples.
2. `highlighter.ts`: the theme, the classes, the languages, the strict engine; `code-samples.ts`; the `highlighter` page's gallery and `+page.server.ts`; S2.
3. `code-block`'s root class; the `pluto-theme` page's surface section; S1 and its axe scans. **Checkpoint**: stop and report with screenshots of the gallery (light and dark, 1280, native size and 2×) and the surface in both page themes with the popover and the dialog open. The design lead judges teal against cyan and blue against cyan (decision 3's pair) and the surface's reading.
4. The editor: the highlight, the configured Python, the roles plugin, the dependencies; the `code-editor` page's class sample; E3.
5. `code-languages`: the item, its page, L1; `registry.json`; the catalogue.
6. Full suites; smoke; the changelog; the development walk over every page in both themes.

### 14. Calls this specification leaves to others

- **Firefox and Safari** over the surface and the new colours: `004` decision 21's placeholder memo widens.
- **A screen reader** over the surface: `003`'s placeholder.
- **The roles plugin's built-ins list** tracks a Python version; the comment names it, and a later Python moves it.
- **Keyword arguments, `parameter` and `docstring` as slots** of their own: one row everywhere each, if an app asks.
- **Perceptual spacing in OKLCH**: the values are set by relative luminance to one target (memo §8); a later specification may re-derive them if the checkpoint's eye disagrees with the arithmetic beyond decision 3's one swap.

## Design

```
tokens/pluto.tokens.json
  primitives + 9       amber-text orange-text orange-lifted purple-text purple-lifted
                       teal-text teal-lifted cyan-text cyan-lifted
  themes.light/dark + 5   syntax-orange syntax-amber syntax-purple syntax-teal syntax-cyan   (48 → 53)
  code: 21 slots → semantic names                                        ── build-tokens ──►
      :root  --code-<slot>: var(--<semantic>)   ×21     (cssVars.light)
      .dark  --code-<slot>: var(--<semantic>)   ×21     (cssVars.dark)   ← new: a subtree re-substitutes
      @theme --color-code-<slot>                ×21     → text-code-*, bg-code-*
      .surface-ink { --code-background: var(--background); --code-active-line: var(--muted); background-color; color }
      .dark .surface-ink { --background: var(--card) }

one line, two engines, one palette:
  @dataclass(order=True)  class Item:  name: str  def total(self) -> float:  return len(items)
  Shiki   decorator        keyword type   type       function(bold) self  type   keyword builtin
  Lezer   annotation→dec.  keyword cls.   TypeDef→type  fn(def)(bold) plugin→self TypeDef→type keyword plugin→builtin

src/lib/registry/
  lib/highlighter.ts          theme by role (28 rules), tokenClasses ×20, 26 languages, strict engine
  lib/code-languages.ts       codeLanguages (id, aliases, kind, dataName), loadLanguage(name):
                              python → the configured one · svelte → @replit · the rest → language-data (strict match)
  ui/code-editor/             code-editor-theme.ts (HighlightStyle ×21, invalid → --code-invalid)
                              code-editor-python.ts (pythonLanguageConfigured, Prec.highest(pythonRoles), pythonSetup)
  ui/code-block/code-block.svelte   root bg-code-background (was bg-muted)

an app's ink panel:
  <section class="dark surface-ink rounded border border-border p-6" bind:this={node}>
    <BitsConfig defaultPortalTo={node}>  editor · code block · tabs · meter · popover · menu </BitsConfig>
    <Dialog.Root> … <Dialog.Content portalProps={{ to: "body" }} />   (the page's theme and scrim)
  </section>
```

## Scope

**In** (the work to *built*):

- The token file (9 primitives, 5 pairs, 21 slots); `build-tokens.ts`; `src/app.css`; the L19 rule and 2 samples.
- `highlighter.ts`, `code-editor-theme.ts`, `code-editor-python.ts`, `code-block.svelte`; the new `code-languages.ts`; `registry.json` (1 new entry; `pluto-theme`'s `cssVars.dark` and `css`).
- `src/lib/preview/code-samples.ts`; 1 new item page; 4 pages grown; 1 new `+page.server.ts`.
- Tests: 7 unit files updated; `code.spec.ts`, `axe`, `theme`, `keyboard`, `primitives`, `pages.ts` updated; `code-add.test.ts` grown.
- `package.json` 0.7.0 and 2 packages; `bun.lock`; the changelog.

**The step to *done*** is in `wasi-python-dev`: its restyle installs from the 0.7.0 tag, its run panel is the surface, and its `design.spec.ts` and axe pass.

**Out:** the "Not here" list; the design book's text; any `005` or `006` item; Firefox, Safari, a screen reader.

## Acceptance criteria

Each is a count, checked by the command named. Criteria 1 to 19 make `007` *built*; criterion 20 makes it *done*. Every count that cites `006` stands on `006`'s predicted landing numbers (items, item files, pages, scans, theme checks, stops, lint samples, dependency names, packages) and is corrected to `006`'s Landing notes before this builds; the counts derived here alone (the token file's, the contrast rows, the 26 languages, the fixtures) are not.

1. **Install.** `bun install --frozen-lockfile` exits 0 on a clean clone. `deps.test.ts`: 34 packages; `@codemirror/language-data` and `@replit/codemirror-lang-svelte` pinned.
2. **Checks.** `bun run check` 0 errors, 0 warnings; `bun run lint` exit 0.
3. **Tokens.** `build:tokens` twice changes 0 files the second time. `tokens.test.ts`: 53 names per theme, the same 53; 9 new primitives; the `code` map 21 of 21 in decision 2's order. `tokens.test.ts`: 34 primitives. `contrast.test.ts`: 114 of 114 rows at 4.5 or more; 10 families. `generated.test.ts`: 21 `code-*` in `light`, 21 in `dark`, 21 `color-code-*`, 5 `syntax-*` per theme block, `.surface-ink` and `.dark .surface-ink` once each, `.surface-ink {` after `.dark {`.
4. **The lint.** `literals.test.ts`: 74 of 74 bad flagged, 0 of 49 good; 0 violations over the item files (`006`'s 300 + 1). L19 flags `text-syntax-orange`, `text-(--syntax-orange)` and the `.ts` string.
5. **Registry source.** `registry.test.ts`: 63 items; `code-languages` with decision 7's 3 dependencies; `code-editor` with its 7 ranges; 45 dependency names resolve (`006`'s 43 + 2); `since` `0.7.0` on 1; `highlighter.json` with `forgiving: false` once and `forgiving: true` never.
6. **Registry build.** `build:registry` writes 64 + 64 byte-identical files; `highlighter.json` names 26 languages; `pluto-theme.json`'s `cssVars.dark` holds 21 `code-` keys and its `css` the two rules.
7. **Site build.** `bun run build` exits 0 with 92 prerendered pages; the `highlighter` page's HTML holds 26 blocks with `text-code-` spans and 0 `style` attributes and references 0 Shiki chunks.
8. **Preview pages.** `previews.test.ts` 63 of 63.
9. **axe.** `axe.spec.ts` 0 violations over `006`'s scans + 6 (the new page) + 4 (the surface open, two overlays, two themes).
10. **Themes.** `theme.spec.ts` `006`'s count + 2.
11. **Keyboard.** `keyboard.spec.ts`, 2 of 2 themes: `006`'s catalogue stops + 1; the 2 new fixtures (2 and 7 stops) with rings unclipped.
12. **The block.** C1 to C4 in 2 of 2 themes with C2's 6 slot colours on the sudoku example, the `=` with no class, `font-medium` on the definition and 0 calls.
13. **The editor.** E1 to E4 in 2 of 2 themes with E3's 5 role readings, the mechanism check and 0 literals.
14. **The languages.** L1: 26 of 26 languages load in the editor with the required distinct colours; S2: 26 of 26 blocks in the gallery.
15. **The surface.** S1 in 2 of 2 page themes: the 8 light-page readings, the 2 overlay placements, the 2 dark-page readings.
16. **Strict engine.** Criterion 5's `registry.test.ts` check on `highlighter.json`, and the gallery's 26 languages tokenised at prerender (criterion 7) as the proof that every grammar compiles under it.
17. **Smoke.** `code-add.test.ts` passes its grown checks in 2 of 2 scratch apps: `code-languages` lands with its 2 new packages in the app's `package.json`; 1 `@lezer/highlight` in the lock; the two rules once each, `.surface-ink {` after `.dark {`; 21 `.dark` lines; 21 by-product lines; second `add pluto-theme` byte-identical.
18. **Test files.** `bun run test` exits 0 on a clean clone.
19. **Release and the walk.** `package.json` `0.7.0`; the changelog entry names the six things of decision 11; the Landing notes record the checkpoint's judgement of decision 3's pair and the development walk with 0 page or console errors.
20. **In the app (done).** `wasi-python-dev` installs from the `v0.7.0` tag, its run panel is `dark surface-ink`, and its `design.spec.ts` and axe pass. The Landing notes cite its commit.

## Landing notes

*Pending.*
