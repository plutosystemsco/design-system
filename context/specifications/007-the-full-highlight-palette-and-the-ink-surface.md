# 007 — The full highlight palette and the ink surface

- **Status:** built, reviewed and released as `v0.7.0` (`011fd75`). Its specification review is [`../reviews/007-the-full-highlight-palette-and-the-ink-surface-spec-2026-11-01.md`](../reviews/007-the-full-highlight-palette-and-the-ink-surface-spec-2026-11-01.md) (11 findings, all fixed here).
- **Date:** 2026-11-01
- **Author:** the design lead
- **Kind:** the `code` map grown from twelve slots to twenty-one, with five new text-safe hue pairs; both engines' mappings across twenty-six languages; one new registry item (`code-languages`); the ink surface as two rules in `pluto-theme`; one class change in `code-block`; tests; the 0.7.0 release
- **Depends on:** [`006`](./006-the-app-shell-and-the-chat-pane.md) (`ab3a400`, `v0.6.0`) and [`005`](./005-overlays-navigation-and-the-chat-primitives.md) (`616b8a0`, `v0.5.0`), _built_ (the surface fixture opens `005`'s dialog and dropdown menu), and through them [`004`](./004-code-and-data.md) (`b3d2a8e`, `v0.4.0`), whose code items this specification changes.
- **Blocks:** nothing.
- **Research it stands on:**
  - [`../research/2026-11-01-a-fuller-python-palette-within-the-books-rules.md`](../research/2026-11-01-a-fuller-python-palette-within-the-books-rules.md) (the palette memo)
  - [`../research/2026-11-01-an-ink-surface-inside-a-light-page.md`](../research/2026-11-01-an-ink-surface-inside-a-light-page.md) (the ink memo)
  - [`../research/2026-10-31-shiki-and-a-token-highlight-palette.md`](../research/2026-10-31-shiki-and-a-token-highlight-palette.md) and [`../research/2026-10-31-codemirror-6-under-svelte-5.md`](../research/2026-10-31-codemirror-6-under-svelte-5.md) (`004`'s memos), for the two engines' mechanics
- **Design calls:** `../decisions.md`, "Syntax highlighting is a function, outside the colour budget" (2026-11-01, the owner's ruling and its "every major language" bullet) and "The design calls for `007`" (2026-11-01).

## Intent

`004` coloured three things: keywords, strings, comments. An app restyling itself to the design book found most of a Python file left in the body colour and asked for more. The owner ruled: "full syntax highlighting as a dev would expect from something like PyCharm or VS Code. This in no way impacts how colors and accents are used, this is a functional feature", and then "full coverage of all major coding languages" (decisions.md). So this specification does two things the design book's §03 budget never governed, and one thing an app needs around them.

1. **A full palette is about twenty roles in eight hue families**, not a colour per scope (palette memo §1: VS Code's Dark Modern colours 18 foregrounds, PyCharm's Darcula 13, both in about eight families). The `code` map grows to twenty-one slots. Every slot is a _role_ that holds in any language (a type name, a key, a decorator), so one theme colours every grammar. Five hue families join the five text colours the tokens hold: orange, purple, teal, cyan, and the brand's amber made text-safe. Every text slot passes 4.5:1 on all six code grounds in both themes (memo §3.3, EXECUTED).
2. **Both engines map every role across the major languages.** Shiki's bundled grammars cover all twenty-six; the memo proved every sample lands its roles in the right slots (§6.4, EXECUTED). CodeMirror has first-class grammars for eighteen, Svelte from one third-party package, and eight only as legacy modes. The Python grammar is taught the four roles it lacks through `styleTags`, and a small view plugin tells `self`, the built-ins and docstrings, which no tag can (§4.2). One new item, `code-languages`, lets an editor open any of the twenty-six on demand.
3. **An ink surface is sanctioned.** A `.dark` subtree inside a light page already gets every colour but the code slots, which are substituted at `:root` and inherit light (ink memo §1, EXECUTED). Repeating the references in `.dark` fixes that; one plain rule beside `dark` puts the code ground flush with the surface; `BitsConfig` brings the overlays inside. The cost is about 0.6 KB of built CSS (538 bytes measured with twelve slots; the twenty-one add a little), axe at 0 in both page themes (§3.4).

**Not here:** italic (the installed face is upright only, `004` decision 6); `operator`, `punctuation`, `parameter`, `regexp` and `docstring` as slots of their own (memo §3.1 says why each reads as another); `ansi`; a one-class `surface-ink` that re-declares the dark set (V1, +1.7 KB and emitted only when scanned); the design book's own text, which this repository does not hold.

**Terms of art.** A _slot_ is one `--code-<name>` custom property: a role a theme colours. A _scope_ is the dotted name a TextMate grammar gives a span of text; Shiki colours by scope. A _tag_ is `@lezer/highlight`'s equivalent; CodeMirror colours by tag through a `HighlightStyle`. A _ground_ is the surface code sits on; the six code grounds are light and dark `muted`, `card` and `background`. _Text-safe_ is 4.5:1 or better on its ground. A _legacy mode_ is a CodeMirror 5 tokenizer run through `StreamLanguage`: no syntax tree, coarser tags. _The surface_ is an element with `class="dark surface-ink"`: the dark theme's tokens on an ink ground inside any page. A _portal_ is bits-ui rendering an overlay under `document.body` instead of beside its trigger.

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

| Slot                             | Role                                                                                                            | Family                               | New    |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------ |
| `foreground`                     | the body: names, parameters, keyword arguments, operators, punctuation, brackets                                | ink                                  |        |
| `background`                     | the code ground                                                                                                 | `muted`, or the surface (decision 8) |        |
| `comment`                        | comments, docstrings, diff headers, Markdown quotes                                                             | ink-soft                             |        |
| `keyword`                        | keywords, storage words, word operators (`and`, `in`, `new`, `typeof`), Markdown marks, preprocessor directives | blue                                 |        |
| `constant`                       | `True`, `None`, `null`, `undefined`, symbols, enum members, `UPPER_CASE` names                                  | blue                                 | colour |
| `string`                         | strings, regexps, inline code, YAML scalars                                                                     | green                                |        |
| `number`                         | numbers, units, colours, dates                                                                                  | orange                               | yes    |
| `escape`                         | escapes, f-string braces and specs, `${ }`, `#{ }`, JSX braces, HTML entities                                   | orange                               | yes    |
| `function`                       | definitions (medium weight), calls, methods, macros, preprocessor functions                                     | amber                                | colour |
| `builtin`                        | built-in functions, kernel functions, magic names, CSS functions                                                | purple                               | yes    |
| `type`                           | classes, interfaces, namespaces, primitive types, Rust lifetimes                                                | teal                                 | yes    |
| `tag`                            | HTML tags, CSS selectors, components, TOML tables                                                               | teal                                 | yes    |
| `property`                       | keys, attributes, fields, object members, shell and PHP `$variables`                                            | cyan                                 | yes    |
| `decorator`                      | decorators, annotations, attributes (`#[derive]`, `[Obsolete]`, `@Override`)                                    | purple                               | yes    |
| `self`                           | `self`, `cls`, `this`, `super`, Swift's `$0`                                                                    | purple                               | yes    |
| `link`                           | links; underlined                                                                                               | blue                                 |        |
| `invalid`                        | invalid text                                                                                                    | red                                  | yes    |
| `inserted`, `deleted`, `changed` | diff lines                                                                                                      | green, red, blue                     |        |
| `active-line`                    | the editor's active line and the block's emphasised line                                                        | `card`, or `muted` in a surface      |        |

_Why `constant` leaves ink for blue:_ both editors colour language constants with the keywords (memo §1.3); `004` kept them ink to spare the one accent, which the ruling lifts. _Why `function` leaves ink for amber:_ VS Code's function family is yellow and brown; in our palette that is amber. Weight still marks a definition; a call is now told by colour too, so the `font-medium` on every call goes (memo §5). _Why `invalid` is a slot:_ the editor read `--destructive` directly, the one highlight colour outside the map (`004` decision 9); now the map is the one place. _Why `operator` and `punctuation` are not slots:_ both editors leave them in the body, and brackets alone are a fifth of all tokens; a class on each would double the HTML for nothing (§3.1).

### 3. The values: nine primitives, five semantic pairs, one lint rule

**The primitives.** Derived like the tokens were (memo §3.2, EXECUTED): hue and saturation fixed, lightness searched to the first value that passes 4.7 on the hardest ground (`muted`), so each keeps headroom over 4.5. Cyan was derived at 4.5 and sits at 4.52 and 4.53.

| Primitive       | Hex       | Primitive     | Hex       |
| --------------- | --------- | ------------- | --------- |
| `amber-text`    | `#85600B` | `orange-text` | `#A44F12` |
| `orange-lifted` | `#E7792A` | `purple-text` | `#903ACE` |
| `purple-lifted` | `#B780DF` | `teal-text`   | `#15717A` |
| `teal-lifted`   | `#20A6B3` | `cyan-text`   | `#1B709B` |
| `cyan-lifted`   | `#269DD8` |               |           |

The dark `function` colour is the brand's own `amber`, `#F0AE12`, which already passes on every dark ground. `amber-text` is an ochre, not a yellow: the lightest colour of amber's hue and saturation that passes 4.7 on light `muted` (§3.5; at 4.5 it would be `#8A6309`). `001` decision 8's "amber is never text" stays for surfaces and copy; a function name in a code block is a functional colour under the ruling.

**The semantic pairs.** `004` decision 5 requires every `code` value to name one of the semantic colours, so the theme switch carries through `.dark`. That rule stays; `themes.light` and `themes.dark` gain five names each, **48 becomes 53**:

| Semantic name   | Light         | Dark            |
| --------------- | ------------- | --------------- |
| `syntax-orange` | `orange-text` | `orange-lifted` |
| `syntax-amber`  | `amber-text`  | `amber`         |
| `syntax-purple` | `purple-text` | `purple-lifted` |
| `syntax-teal`   | `teal-text`   | `teal-lifted`   |
| `syntax-cyan`   | `cyan-text`   | `cyan-lifted`   |

The `code` map then reads: `number: syntax-orange`, `escape: syntax-orange`, `function: syntax-amber`, `builtin: syntax-purple`, `decorator: syntax-purple`, `self: syntax-purple`, `type: syntax-teal`, `tag: syntax-teal`, `property: syntax-cyan`, `constant: primary`, `invalid: destructive`; the rest as `004` has them. _Why a `syntax-` prefix:_ the five are reached only through the `code` slots; the prefix says so to a reader of `app.css`.

**The contrast table** (memo §3.3, EXECUTED; every text slot on every ground, light and dark `muted` / `card` / `background`):

| Family                                          | Light     | on `muted` / `card` / `background` | Dark      | on `muted` / `card` / `background` |
| ----------------------------------------------- | --------- | ---------------------------------- | --------- | ---------------------------------- |
| ink (`foreground`)                              | `#14161C` | 15.00 / 18.08 / 16.84              | `#F7F7F4` | 12.83 / 14.99 / 16.84              |
| ink-soft (`comment`)                            | `#4A4F5C` | 6.79 / 8.18 / 7.63                 | `#A9ADB8` | 6.13 / 7.17 / 8.05                 |
| blue (`keyword`, `constant`, `link`, `changed`) | `#2456E6` | 4.90 / 5.91 / 5.51                 | `#7A9BFF` | 5.22 / 6.10 / 6.85                 |
| green (`string`, `inserted`)                    | `#136E3E` | 5.23 / 6.31 / 5.87                 | `#4CC982` | 6.55 / 7.65 / 8.59                 |
| red (`invalid`, `deleted`)                      | `#C42A1F` | 4.71 / 5.67 / 5.29                 | `#FF7D73` | 5.53 / 6.46 / 7.26                 |
| orange (`number`, `escape`)                     | `#A44F12` | 4.70 / 5.66 / 5.27                 | `#E7792A` | 4.70 / 5.49 / 6.17                 |
| amber (`function`)                              | `#85600B` | 4.74 / 5.71 / 5.32                 | `#F0AE12` | 7.06 / 8.25 / 9.27                 |
| purple (`builtin`, `decorator`, `self`)         | `#903ACE` | 4.73 / 5.70 / 5.31                 | `#B780DF` | 4.70 / 5.49 / 6.17                 |
| teal (`type`, `tag`)                            | `#15717A` | 4.74 / 5.71 / 5.32                 | `#20A6B3` | 4.70 / 5.49 / 6.17                 |
| cyan (`property`)                               | `#1B709B` | 4.53 / 5.47 / 5.09                 | `#269DD8` | 4.52 / 5.28 / 5.93                 |

`contrast.test.ts` proves it: **114 rows**, 19 text slots × 2 themes × 3 grounds, each at 4.5 or more, computed from the token file, never from this table.

**The pair to watch.** Teal and cyan are 15° apart and blue and cyan 25°; the memo's renders (§5.3) read them apart at 2×, and the checkpoint (decision 13) judges them at native size. **If the checkpoint cannot tell a key from a type at 13.5 px, `property` moves to a magenta pair** derived the same way at 320° (the memo's thresholds `#BA2E8B` / `#DB6DB6`, re-derived at 4.7), and the five pairs stay five. The Landing notes record which.

**The lint, L19.** A text rule, not a class rule: any occurrence of `syntax-(orange|amber|purple|teal|cyan)` in an item file is a violation. _Why a text rule:_ Tailwind 4.3.3 also emits `text-(--syntax-orange)` and `text-(--color-syntax-orange)` (review finding 6, EXECUTED), the lint's variable form is otherwise always allowed, and a `.ts` theme string may write `var(--syntax-teal)`; no item has a legitimate use of the five names, since they are reached only through the `code` slots. The emission in `build-tokens.ts` is not an item file. _Why at all:_ the ruling puts code colour outside the budget, not five new accents inside it. Samples: 3 bad (`text-syntax-orange`, `text-(--syntax-orange)`, the `.ts` string `color: "var(--syntax-teal)"`), 1 good (`text-code-number`): **74 bad, 49 good** on `006`'s numbers. `text-code-*` and `bg-code-*` stay allowed, as `004` decision 5 made them. L1 already flags `bg-syntax-orange/10` as a tint once the five names are in `themes.light`.

### 4. The emission: every slot in both theme blocks

- `cssVars.light` **and** `cssVars.dark` carry `--code-<slot>: var(--<semantic>)` for the 21. _Why both now:_ a `var()` inside a custom property is substituted on the element that declares it. Declared on `:root` only, the slot computes to the light colour there and that colour inherits into a `.dark` subtree, so the editor was a light wash box inside an ink panel and the block's tokens failed axe 13 times (ink memo §1.2, §4, EXECUTED). Repeated in `.dark`, the slot is re-substituted on the subtree's root with the dark semantic values (§3.3, EXECUTED). `004` decision 5's "saying the same thing twice" is corrected: a subtree is where it is not. When `dark` is on `<html>` nothing changes.
- `cssVars.theme` carries `--color-code-<slot>: var(--code-<slot>)` for the 21, so `text-code-number`, `bg-code-background` and the rest are utilities. The lint's colour list holds the 21.
- The by-product `004` recorded stays: an app's `@theme inline` gains 21 derived `--code-<slot>: var(--code-<slot>)` lines from the CLI's updater, which derives from the union of the keys (ink memo §3.3, READ). `registry-add.test.ts` counts 21 (today 12).
- `generated.test.ts`: 21 `code-*` in `light`, **21 in `dark`**, 21 `color-code-*` in `theme`; the 5 `syntax-*` names in each theme block.

### 5. The Shiki theme, by role, over twenty-six languages

`highlighter.ts`'s theme object is rewritten from the palette memo's §4.1, which was proven over every sample (EXECUTED). About 28 rules. Each row's deeper selector beats a shallower one, which is how a role escapes its parent's rule.

| Slot                             | Scope families                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `comment`                        | `comment`, `punctuation.definition.comment`, `string.quoted.docstring` and its quotes, `markup.quote`, `meta.diff.header`, `meta.diff.index`                                                                                                                                                                                                                                                                                                |
| `string`                         | `string` and `string punctuation.definition.string` (`004`'s checkpoint call: quotes take the string colour), `string.regexp`, `markup.inline.raw`, `string.other.link.title`, `storage.type.string.python` (the `f` prefix), `entity.name.tag.doctype`                                                                                                                                                                                     |
| `escape`                         | `constant.character.escape`, `constant.character.format.placeholder`, `constant.other.placeholder`, `storage.type.format`, `punctuation.section.embedded`, `punctuation.definition.template-expression`, `punctuation.definition.interpolation`, `constant.character.entity`                                                                                                                                                                |
| `number`                         | `constant.numeric`, `keyword.other.unit`, `constant.other.color`, `constant.other.time`, `constant.other.date`                                                                                                                                                                                                                                                                                                                              |
| `constant`                       | `constant.language`, `variable.other.constant`, `variable.other.enummember`, `constant.other.symbol`, `support.constant`; `support.constant.property-value` and `.font-name` back to the body                                                                                                                                                                                                                                               |
| `keyword`                        | `keyword`, `storage`, `keyword.control`, `keyword.other`, the word operators (`keyword.operator.expression`, `.new`, `.delete`, `.logical.python`, `.sizeof`, `.cast`), `keyword.control.directive`, `punctuation.section.embedded.begin.php`, `meta.diff.range`, `punctuation.definition.heading`, `punctuation.definition.list.begin.markdown`; the symbol operators (`keyword.operator`, `storage.type.function.arrow`) back to the body |
| `function`                       | `entity.name.function`, `meta.function-call.generic`, `support.function.macro`, `entity.name.function.macro`, `entity.name.function.preprocessor`; **bold** under `meta.function`, `meta.function.definition`, `meta.method.declaration`, `entity.name.function.definition`                                                                                                                                                                 |
| `builtin`                        | `support.function` (covers `.builtin`, `.kernel`, `.construct`, `.misc`), `support.variable.magic`, `support.variable`                                                                                                                                                                                                                                                                                                                      |
| `type`                           | `entity.name.type`, `entity.name.class`, `entity.name.namespace`, `entity.name.scope-resolution`, `entity.other.inherited-class`, `support.type`, `support.class`, `entity.name.package`, the primitives (`storage.type.primitive`, `storage.type.built-in`, `support.type.primitive`, `keyword.type`, Go's `storage.type.numeric` family, `storage.type.sql`, the Java, C#, Kotlin, Swift and PHP `storage.type` forms), Rust lifetimes    |
| `tag`                            | `entity.name.tag`, CSS class, id and pseudo selectors, `support.class.component`, `entity.name.section.toml`; `punctuation.definition.tag` back to the body                                                                                                                                                                                                                                                                                 |
| `property`                       | `entity.other.attribute-name`, `support.type.property-name`, `meta.object-literal.key`, `meta.attribute.python`, `variable.other.property`, `variable.object.property`, `variable.other.object`, `variable.other.member`, `variable.other.readwrite.instance`, `entity.name.variable.field`, `entity.name.tag.yaml`, `variable.other.key.toml`, the shell variables, `variable.other.php`, `variable.css`                                   |
| `decorator`                      | `meta.decorator`, `entity.name.function.decorator`, `punctuation.definition.decorator`, `meta.attribute.rust`, `storage.type.annotation`, `meta.attribute.cs`, `meta.attribute.php`, `storage.modifier.attribute`, `meta.annotation`                                                                                                                                                                                                        |
| `self`                           | `variable.language`, `variable.parameter.function.language.special.self`                                                                                                                                                                                                                                                                                                                                                                    |
| `link`                           | `markup.underline.link`, `string.other.link.destination`; underlined                                                                                                                                                                                                                                                                                                                                                                        |
| `invalid`                        | `invalid`, `invalid.illegal`, `invalid.deprecated`                                                                                                                                                                                                                                                                                                                                                                                          |
| `inserted`, `deleted`, `changed` | `markup.inserted`, `.deleted`, `.changed`                                                                                                                                                                                                                                                                                                                                                                                                   |
| bold, no colour                  | `markup.heading`, `entity.name.section.markdown`, `markup.bold`                                                                                                                                                                                                                                                                                                                                                                             |
| the body                         | `variable`, `variable.parameter` (keyword arguments included), `punctuation`, `meta.brace`, the symbol operators                                                                                                                                                                                                                                                                                                                            |

- `tokenClasses` grows to **20** entries, every slot but `foreground`; `tokenClass` is unchanged (bold bit → `font-medium`, underline bit → `underline`). A foreground token still carries no class.
- **The lazy list grows from 14 to 26**: python, javascript, typescript, tsx, jsx, html, css, json, yaml, toml, markdown, shellscript (as `bash`), sql, go, rust, java, c, cpp, csharp, ruby, php, kotlin, swift, svelte, diff, docker; with the memo's aliases (`py`, `js`, `cjs`, `mjs`, `ts`, `cts`, `mts`, `yml`, `md`, `sh`, `shell`, `shellscript`, `zsh`, `rs`, `c++`, `c#`, `cs`, `rb`, `kt`, `kts`, `dockerfile`). 245 KB gzipped in all, loaded one at a time on first use; nothing until a block names a language (`004` decision 6).
- **The engine is strict**: `createJavaScriptRegexEngine({ forgiving: false })`. All 26 grammars compile under it (memo §6.1, EXECUTED), which closes the Shiki memo's §9 question.
- **The HTML barely moves.** Over a sample of 29 Python files the classed share of runs goes from 49.7% to 53.4% and the rendered HTML shrinks by 2%, since calls lose their `font-medium` (memo §7, EXECUTED).

### 6. The editor: twenty-one rules, a configured Python, and the roles plugin

- **`code-editor-theme.ts`**: `codeHighlight` rewritten from memo §4.1's Lezer column. `comment` (`tags.comment`, `docString`, `quote`, `contentSeparator`, `documentMeta`); `string` (`string`, `special(string)`, `regexp`, `character`, `attributeValue`, `monospace`); `escape` (`escape`, `special(brace)`); `number` (`number`, `unit`, `color`); `constant` (`bool`, `null`, `atom`, `constant(variableName)`, `literal`); `keyword` (`keyword`, `modifier`, `processingInstruction`, `list`); `function` (`function(variableName)`, `function(propertyName)`, `macroName`; medium weight on `function(definition(variableName))` and `function(definition(propertyName))`); `builtin` (`standard(variableName)`, `standard(propertyName)`); `type` (`typeName`, `standard(typeName)`, `className`, `definition(className)`, `namespace`); `tag` (`tagName` and its forms); `property` (`propertyName`, `definition(propertyName)`, `attributeName`, `special(variableName)`, `labelName`); `decorator` (`annotation`, `meta`); `self` (`self`); `link` (`link`, `url`, underlined); `invalid` (`tags.invalid` → `var(--code-invalid)`); `inserted`, `deleted`, `changed`; `heading` and `strong` at medium weight with no colour. Operators, brackets, separators, names and `local(variableName)` take the `&` colour. Every value is a `var()`; the five `@theme inline` names stay as `004` decision 9 has them. The chrome (`codeTheme`) is unchanged.
- **`code-editor-python.ts`** exports `pythonLanguageConfigured`: `pythonLanguage.configure({ props: [styleTags({ "Decorator/VariableName": tags.annotation, "Decorator/MemberExpression/PropertyName": tags.annotation, "TypeDef/VariableName": tags.typeName, "TypeDef/MemberExpression/PropertyName": tags.typeName, "ParamList/VariableName": tags.local(tags.variableName), "FormatReplacement/{ FormatReplacement/}": tags.special(tags.brace) })] })` (memo §4.2, EXECUTED on the class sample), and `pythonSetup()` uses it in place of the bare `pythonLanguage`. The added rules **combine** with the grammar's own (`styleTags` props combine; review finding 11, EXECUTED by the reviewer): `CallExpression/VariableName` and `FunctionDefinition/VariableName` keep their tags, and a `{` outside an f-string keeps `brace`.
- **The roles plugin**, `pythonRoles`, in the same file: a `ViewPlugin` with `Decoration.mark` over the visible ranges, walked with `syntaxTree(state).iterate({ from, to, enter })` from `@codemirror/language` (no import from `@lezer/common`; the node's `name`, `from`, `to` and `node.parent` are enough). It marks a `VariableName`, callee or bare, whose text is `self` or `cls` with the class `text-code-self`; a `VariableName`, callee or bare, whose text is in the Python built-ins list with `text-code-builtin`; and a `String` that is the first statement of a `Script`, `ClassDefinition` body or `FunctionDefinition` body with `text-code-comment`. _Why a plugin:_ none of the three is a node of its own, and `styleTags` matches ancestry, not siblings or position (memo §4.2). _Why classes:_ the three utilities already exist, so the editor and the block paint one colour from one place; the literals in this `.ts` file put the classes in Tailwind's scan. **The plugin is wrapped in `Prec.highest`** in `pythonSetup()`. _Why:_ the highlighter runs at `Prec.high`, and CodeMirror renders overlapping marks as nested spans with the highest-precedence mark innermost, where the inherited `color` is decided; at default precedence the plugin's span would be the outer one and `print` would read amber (review finding 1, READ in `@codemirror/view`'s `ensureMarks`). About sixty lines. The built-ins list is the 71 names of Python 3.13's `builtins` module that are functions or types, written out as a sorted array with a comment naming the source and version. Keyword arguments stay in the body on both engines (decision 2).
- **Dependencies.** Unchanged: `@lezer/highlight@^1.2.5` is already one of `code-editor`'s seven ranges (`004` decision 2). The rule it carries: a `HighlightStyle` and the grammars it colours must share one `@lezer/highlight` instance, or modified tags mismatch by id and `function(variableName)` from one copy reads as `special(brace)` in another (memo §4.3, EXECUTED). The item page says so for an app that installs language packages, and decision 7's smoke check reads the lock.
- `invalid` reads `--code-invalid`, not `--destructive`; `.cm-specialChar` and the nonmatching bracket keep `--destructive`, since those are the chrome's.

### 7. `code-languages`: any of the twenty-six, on demand

A new `registry:lib` item, one file `src/lib/registry/lib/code-languages.ts`, group `code`, `since` `0.7.0`, own (no `meta.stock`).

- **Exports.** `codeLanguages`: a table of the 26, each with its Shiki id, its aliases, its `kind` (`lezer`, `svelte` or `legacy`) and its `dataName`, the name `@codemirror/language-data` gives it. The names differ from the ids in four cases: `docker` → `Dockerfile`, `shellscript` → `Shell`, `cpp` → `C++`, `csharp` → `C#`; the rest equal the id, case aside (review finding 2, EXECUTED: `matchLanguageName` returns null for `svelte` and `docker` under either flag and for `shellscript` strictly). `loadLanguage(name: string): Promise<LanguageSupport | null>`: resolves the id or alias through the table, returns `null` for one it does not know, and otherwise loads by kind. **Three routes:** `python` returns `new LanguageSupport(pythonLanguageConfigured)` from `code-editor-python.ts`, so the editor's Python is the configured one everywhere, with the roles plugin in `pythonSetup()`'s hands; `svelte` is its own dynamic `import("@replit/codemirror-lang-svelte")`, since `language-data` has no Svelte; every other id goes to `LanguageDescription.matchLanguageName(languages, dataName, false)` (strict, not fuzzy: fuzzy matching would map unknown names by substring, against "returns `null`"), then `description.load()`, one dynamic `import()` per language, cached by the description (memo §6.2, READ). The item has `registryDependencies` `utils`, `pluto-theme`, `code-editor`.
- **Dependencies.** `@codemirror/language-data@^6.5.2`, `@codemirror/language@^6.13.1` and `@replit/codemirror-lang-svelte@^6.0.0`, each imported by the file so the CLI's import detection names it in the built JSON, and each pinned in `package.json` and `bun.lock` (`deps.test.ts` requires it). `language-data` depends on every `@codemirror/lang-*` package and `@codemirror/legacy-modes`, so installing the item installs them all: about two megabytes unpacked on disk (a READ figure; the item page repeats it). In the bundle each language is its own chunk, loaded when `loadLanguage` is first called for it (how Vite splits a dynamic `import()`; not counted, review finding 7). The page also says the Svelte package dates from 2022. An app that edits one language does not install this item: `pythonSetup()` alone is `004` decision 9's preset and stays.
- **What each language gets.** Eighteen have a Lezer grammar and the full palette; Svelte comes from `@replit/codemirror-lang-svelte` 6.0.0 (2022, 190 KB unpacked; `$props()` and `$state()` parse as calls, memo §8); eight come as legacy modes (Shell, TOML, diff, Dockerfile, Ruby, Swift, Kotlin, C#), which colour keywords, strings, numbers and comments and have no bracket matching by syntax (memo §6.4). The item page's table says which is which, and states each language's limits: Lezer's YAML leaves plain scalars untagged; Lezer's CSS tags selectors as `className`, so they land in `type` while Shiki puts them in `tag`; the memo's per-language notes.
- **How an app uses it.** `extensions={[...baseSetup(), support]}` on `code-editor`, where `support` is awaited from `loadLanguage`; the page shows the pattern with a `select` (`002`'s `native-select`) and an `$effect` that reconfigures. `pythonSetup()` is not a model for other languages' keymaps; the page shows a `baseSetup()` of line numbers, history, the default keys, bracket closing and matching, indent on input, the active line and `codeHighlight`, written in the page, not the item.
- **The kinds, as the page's table shows them.** Lezer: Python, JavaScript, JSX, TypeScript, TSX, HTML, CSS, JSON, YAML, Markdown, SQL, Go, Rust, Java, C, C++, PHP, plus Svelte through `@replit`; legacy: Shell, TOML, diff, Dockerfile, Ruby, Swift, Kotlin, C#. The table's `gaps` column holds the memo's per-language notes.
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
  _Why plain rules, not `@utility`:_ an `@utility` lives in `@layer utilities`; the CLI writes `.dark` unlayered; on one element the unlayered declaration wins whatever the order, so a utility could never override `--code-background` beside `dark` (memo §3.5, READ and EXECUTED). _Why `--code-active-line: var(--muted)`:_ `card` is the surface's own ground on a dark page, so the active line would vanish; `muted` is one step above the ground in both pages (§3.2). _Why `.dark .surface-ink` sets `card`:_ on a dark page an ink surface on an ink page is invisible (§1.4); `card` is the raised step. On a light page the element matches `.dark` and `.surface-ink` but no ancestor is `.dark`, so the rule does not fire and the surface is ink. _Why top-level selectors are safe in `css`:_ `001` decision 15 forbids `:root` and `.dark` nested inside an at-rule; the CLI matches `.dark` exactly and copies these verbatim (§3.5). **The first rule wins by source order**: `.dark` and `.surface-ink` have equal specificity on one element, so `.surface-ink` must come later in the sheet. It does in the preview, because `build-tokens` prints `css` after the theme blocks, and in an installed app, because the CLI applies `cssVars` before `css` and appends a plain rule at the end (review finding 10, READ). An app that hand-moves the rule above `.dark` loses the override silently; the item page says so, and the smoke asserts the order (decision 10). The second rule, `.dark .surface-ink`, wins by specificity and needs no order.
- **The contract, as the item page states it:** an ink surface is `class="dark surface-ink"` on any element. Inside it every token is the dark theme's; the code ground and the editor's ground equal the surface; the surface is ink on a light page and `card` on a dark one; set `--background` on the surface to move all three. The `muted` insets keep their tint inside it (tabs, skeleton, meter track, hover and selected rows, the scroll box, a code block inside a card). `color-scheme` is `dark`, so native controls and scrollbars draw dark. Inside the surface the `dark:` variant applies, so an alert there takes its `/20` tint as on a dark page (ink memo §1.3); the `@custom-variant dark` is not widened, and no `surface-ink:` variant exists.
- **`code-block`'s root reads `bg-code-background`.** `muted` and the slot are one colour everywhere except inside a surface, where the block goes flush like the editor (§3.1). A block that should stay an inset inside a surface (one inside a card or a message) passes `class="bg-muted"`, which `cn` lets win. The item page says so.
- **Overlays.** bits-ui portals an overlay to `body`, so a popover opened inside the surface paints in the page's theme: white on a light page (§2.1). The fix needs no item change: **`<BitsConfig defaultPortalTo={node}>`** around the surface's content, where `node` is the surface element or a `display: contents` child of it, brings every bits-ui overlay inside with the same position to the pixel, focus inside and Escape returning focus (§2.2, EXECUTED for popover and tooltip). **Modal overlays are the page's**: a `dialog` or `sheet` opened from inside the surface passes `portalProps={{ to: "body" }}` and takes the page's theme and the page's scrim. _Why:_ a modal belongs to the page, not to the panel its trigger sits in; a dark dialog over a light page would be the wrong hello. The surface's fixture (decision 9) proves both. The surface must carry no `transform`, `filter` or `contain`, or a portalled overlay inside it is clipped or re-anchored (§2.2, INFERRED); the page says so.
- **What an app supplies:** the panel's own chrome (`rounded border border-border p-4`), `BitsConfig`, and the `portalProps` on its modals.

### 9. The item pages and the samples

- **`src/lib/preview/code-samples.ts`** holds the 26 samples, nine to fifteen lines each, one per language, written fresh for the preview from the memo's list of what each exercises (a definition, a call, a type, a decorator or attribute where the language has one, a string with an escape or an interpolation, a number, a constant, a comment, keys or attributes for data and markup). The class sample stands for Python (a module docstring, a decorated dataclass with annotated fields, a `@property`, two methods with `self`, an f-string with `!r` and `:.2f`, a `print` with `None` and `True`). The samples are data, outside the lint.
- **`highlighter`** gains "Twenty-six languages": every sample as a `code-block` with its `lines` prerendered in a new `+page.server.ts` through `highlightCode`, in a two-column grid, each titled by its language. The page's slot table grows to 21 rows. _Why here:_ this page is the theme's.
- **`code-languages`** (new): the install snippet; the editor with a `native-select` of the 26, loading the chosen language through `loadLanguage` and the class sample's language's text swapped in with `reset()`; the table of kinds and gaps; the install cost; the one-copy note. **Keyboard fixture:** 2 stops, the select and the editor's content.
- **`code-editor`**: the Python example becomes the class sample, so `self`, the built-ins, the decorator, the annotations and the docstring are on the page; the text says the roles plugin tells three things no tag can.
- **`code-block`**: unchanged in structure; its sudoku example now shows numbers, built-ins (`str`, `print`), constants and comments by the new rules; it holds no decorator or annotation, so C2 reads those on the editor page. Its text drops "told by weight, not colour".
- **`pluto-theme`** gains "An ink surface": a `section class="dark surface-ink rounded border border-border p-6"` holding a `code-editor` with `pythonSetup()`, a `code-block` with a header and a copy button, a pill (default) tab strip, a `meter`, a `popover` and a `dropdown-menu` under `BitsConfig`, and a `dialog` with `portalProps={{ to: "body" }}`; a paragraph with the contract; the surface's reading of the groove, the ring and the scrollbar (ink memo §6) in one sentence each. _Why the pill strip:_ it sits on `bg-muted`, which is the inset S1 reads inside the surface; the `line` variant has no ground (ink memo §1.3). **Keyboard fixture:** the surface's **7 stops** in DOM order: the editor's content, the block's copy button, the block's `pre`, the active tab, the popover's trigger, the menu's trigger, the dialog's trigger. The surface is the one place a `dark` class appears in a preview page; the page says why.
- **Copy** follows R23 and R24.

### 10. The tests

- **Unit.** `tokens.test.ts`: 53 names per theme, both naming the same 53; 9 new primitives; the `code` map 21 of 21, each naming a semantic name, in decision 2's order. `contrast.test.ts`: `002`'s counts plus 114 slot rows at 4.5 or more; the ten text families cover ink, ink-soft, blue, green, red, orange, amber, purple, teal, cyan. `generated.test.ts`: decision 4's counts, the two surface rules present once each and `.surface-ink {` after `.dark {`. `literals.test.ts`: 74 bad, 49 good; the L19 samples. `registry.test.ts`: 63 items, the `code-languages` entry with decision 7's three dependencies, `code-editor`'s 7 ranges unchanged, `highlighter`'s 26 languages read from the built JSON, and `highlighter.json`'s content holding `forgiving: false` once and `forgiving: true` never (a source check belongs here, not in a browser test; review finding 8). `tokens.test.ts`'s primitives 25 → 34; `contrast.test.ts`'s `SLOT_ROWS` 10 → 114. `previews.test.ts`: 63 of 63. `deps.test.ts`: `@codemirror/language-data` and `@replit/codemirror-lang-svelte` pinned; 34 packages (`006`'s 32 + 2).
- **Browser**, in both projects. `code.spec.ts`: C2 reads the slot colours of a keyword, a string, a number, a built-in, a constant and a comment on the block page's sudoku example (6 slots), the `=` span with no class, and `font-medium` on the `def`'s name and on no call; E3 reads, on the editor page's class sample, `print` in the `builtin` colour at normal weight, `self` in the `self` colour, the docstring in the `comment` colour, `str` in the `type` colour, `dataclass` after `@` in the `decorator` colour (5 role readings), **the mechanism** (the span carrying `text-code-builtin` on `print` has no child span, so its class decides the colour; review finding 1), and "0 literals of ours" over the emitted sheet as before. New **L1** (`code-languages`): for each of the 26, choose it in the select, wait for `.cm-content` to hold the sample, and read at least 2 distinct computed token colours other than the body's (the legacy eight: at least 1; diff: inserted and deleted). New **S1** (the surface, `pluto-theme` page): on a light page the surface computes `rgb(20, 22, 28)`, `.cm-editor`, `.cm-gutters` and the block's root the same, the active line `rgb(43, 45, 50)`, the block's keyword `rgb(122, 155, 255)`, the pill tab strip and the meter's track `rgb(43, 45, 50)` (8 readings); with the popover open its content is inside the surface with the dark `popover` colour, and with the dialog open its content is under `body` with the light `popover` colour; on a dark page the surface computes `rgb(30, 33, 41)` and the editor the same. **S2**: `highlighter`'s gallery holds 26 blocks, each with at least 2 distinct `text-code-*` classes (diff: 2 of `inserted`, `deleted`, `comment`). `axe.spec.ts`: the new page at 360, 768 and 1280; the `pluto-theme` page at 1280 with the surface's popover open and again with its dialog open, in both themes. `theme.spec.ts`: the new page. `keyboard.spec.ts`: the two fixtures. `primitives.spec.ts`: heights and loops on the new page.
- **Smoke.** `code-add.test.ts` grows: `add code-languages` in both scratch apps; `bun.lock` holds one `@lezer/highlight`; `app.css` holds `.surface-ink {` once and `.dark .surface-ink {` once; the `.dark` rule holds 21 `--code-` lines; the `@theme inline` by-product is 21 lines; the index of `.dark {` is less than the index of `.surface-ink {`; a second `add pluto-theme` leaves the file byte-identical (this is the CLI order question of ink memo §7, settled by running it); `add code-languages` lands `@replit/codemirror-lang-svelte` and `@codemirror/language-data` in the scratch app's `package.json`. No chunk count: Vite emits a chunk for every dynamic import whatever the page loads, all named `index-<hash>.js`, and the smoke runs no browser (review finding 7).

### 11. The version: 0.7.0, and the changelog

`package.json` `0.7.0`. The entry names the palette (21 slots, five families, every value text-safe on every ground), the 26 languages, `code-languages`, the surface contract, the `code-block` ground class, and the correction to `004`'s emission. Not an interface change: no prop, export or class name changes; `code-block`'s ground is the same colour outside a surface; `codeHighlight` and `codeTheme` keep their names.

### 12. What a consuming app takes

- **An app upgrading to 0.7.0:** `add pluto-theme code-block code-editor highlighter use-highlighted-code` from the `v0.7.0` tag rewrites its `--code-*` block (21 lines in `:root` and in `.dark`) and the two surface rules; an ink panel is `class="dark surface-ink"` with `BitsConfig` around its content and `portalProps={{ to: "body" }}` on any modal.
- **A chat message's code block** (`006`) is an inset in a message, not a surface: nothing changes there.
- **No `ansi` slot:** the map holds none (`004` decision 21).

### 13. Build order

1. Tokens: primitives, pairs, the map; `build-tokens` emitting both blocks and the two rules; `src/app.css`; the unit tests of decision 10; the lint rule and its samples.
2. `highlighter.ts`: the theme, the classes, the languages, the strict engine; `code-samples.ts`; the `highlighter` page's gallery and `+page.server.ts`; S2.
3. `code-block`'s root class; the `pluto-theme` page's surface section; S1 and its axe scans. **Checkpoint**: stop and report with screenshots of the gallery (light and dark, 1280, native size and 2×) and the surface in both page themes with the popover and the dialog open. The design lead judges teal against cyan and blue against cyan (decision 3's pair) and the surface's reading.
4. The editor: the highlight, the configured Python, the roles plugin, the dependencies; the `code-editor` page's class sample; E3.
5. `code-languages`: the item, its page, L1; `registry.json`; the catalogue.
6. Full suites; smoke; the changelog; the development walk over every page in both themes.

### 14. What this release does not cover

- **Firefox and Safari are not checked.** This release checks the surface and the new colours in Chromium only (decisions.md, "After the public-readiness review").
- **No screen reader has been run** over the surface; the tests prove the DOM contract.
- **The roles plugin's built-ins list** follows Python 3.13; the comment in the file names the version.
- **Keyword arguments, `parameter` and `docstring` are not slots.** Keyword arguments and parameters take the body colour on both engines; a docstring takes the `comment` colour, through `string.quoted.docstring` in Shiki and the roles plugin in the editor (decisions 2, 5 and 6).
- **Perceptual spacing in OKLCH** is not used: the values are set by relative luminance to one target (memo §8), and the checkpoint kept them without decision 3's swap (Landing notes, note 1).

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

**In** (the work to _built_):

- The token file (9 primitives, 5 pairs, 21 slots); `build-tokens.ts`; `src/app.css`; the L19 rule and 2 samples.
- `highlighter.ts`, `code-editor-theme.ts`, `code-editor-python.ts`, `code-block.svelte`; the new `code-languages.ts`; `registry.json` (1 new entry; `pluto-theme`'s `cssVars.dark` and `css`).
- `src/lib/preview/code-samples.ts`; 1 new item page; 4 pages grown; 1 new `+page.server.ts`.
- Tests: 7 unit files updated; `code.spec.ts`, `axe`, `theme`, `keyboard`, `primitives`, `pages.ts` updated; `code-add.test.ts` grown.
- `package.json` 0.7.0 and 2 packages; `bun.lock`; the changelog.

**The step to _done_** is the release (constitution §2 and §4.2): the criteria met here, the change reviewed, and the tag `v0.7.0`.

**Out:** the "Not here" list; the design book's text; any `005` or `006` item; Firefox, Safari, a screen reader.

## Acceptance criteria

Each is a count, checked by the command named. Criteria 1 to 19 make `007` _built_; criterion 20 makes it _done_. Every count that cites `006` was written on `006`'s predicted landing numbers (items, item files, pages, scans, theme checks, stops, lint samples, dependency names, packages); the Landing notes give the combined landed numbers. The counts derived here alone (the token file's, the contrast rows, the 26 languages, the fixtures) are not affected.

1. **Install.** `bun install --frozen-lockfile` exits 0 on a clean clone. `deps.test.ts`: 34 packages; `@codemirror/language-data` and `@replit/codemirror-lang-svelte` pinned.
2. **Checks.** `bun run check` 0 errors, 0 warnings; `bun run lint` exit 0.
3. **Tokens.** `build:tokens` twice changes 0 files the second time. `tokens.test.ts`: 53 names per theme, the same 53; 9 new primitives; the `code` map 21 of 21 in decision 2's order. `tokens.test.ts`: 34 primitives. `contrast.test.ts`: 114 of 114 rows at 4.5 or more; 10 families. `generated.test.ts`: 21 `code-*` in `light`, 21 in `dark`, 21 `color-code-*`, 5 `syntax-*` per theme block, `.surface-ink` and `.dark .surface-ink` once each, `.surface-ink {` after `.dark {`.
4. **The lint.** `literals.test.ts`: 74 of 74 bad flagged, 0 of 49 good; 0 violations over the item files (`006`'s 300 + 1). L19 flags `text-syntax-orange`, `text-(--syntax-orange)` and the `.ts` string.
5. **Registry source.** `registry.test.ts`: 63 items; `code-languages` with decision 7's 3 dependencies; `code-editor` with its 7 ranges; 44 dependency names resolve; `since` `0.7.0` on 1; `highlighter.json` with `forgiving: false` once and `forgiving: true` never.
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
17. **Smoke.** `code-add.test.ts` passes its grown checks in 2 of 2 scratch apps: `code-languages` lands with its 2 new packages in the scratch app's `package.json`; 1 `@lezer/highlight` in the lock; the two rules once each, `.surface-ink {` after `.dark {`; 21 `.dark` lines; 21 by-product lines; second `add pluto-theme` byte-identical.
18. **Test files.** `bun run test` exits 0 on a clean clone.
19. **Release and the walk.** `package.json` `0.7.0`; the changelog entry names the six things of decision 11; the Landing notes record the checkpoint's judgement of decision 3's pair and the development walk with 0 page or console errors.
20. **Released.** The change is tagged `v0.7.0` and the Landing notes cite its review.

## Landing notes

- **Built:** 2026-11-01, first over `616b8a0` (`v0.5.0`) in parallel with `006` (decisions.md, "`007` builds in parallel with `006`"), then rebased onto `ab3a400` (`v0.6.0`) and re-run at the combined counts; released as `v0.7.0` (`011fd75`). The change review is [`../reviews/007-the-full-highlight-palette-and-the-ink-surface-pr-2026-11-01.md`](../reviews/007-the-full-highlight-palette-and-the-ink-surface-pr-2026-11-01.md): "Does not land yet" on 3 Medium and 6 Low findings; all 9 dispositioned, 8 fixed and 1 closed by these Landing notes. The design calls are in `decisions.md` ("The design calls for `007`", "After the `007` spec review", "After the `007` build's checkpoint", "After the `007` change review").

**Results at landing, under Bun 1.3.14, 2026-11-01** (EXECUTED by the builder after the rebase; the reviewer re-ran the suites before the fixes, over `v0.5.0`, at the same counts less `006`'s and the tests the fixes added):

| Check                                          | Result                                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `bun run check`                                | 1663 files, 0 errors, 0 warnings                                                                            |
| `bun run lint`, `bun scripts/lint-literals.ts` | exit 0; 0 literals in 301 item files                                                                        |
| `bun run build:tokens`, twice                  | the second run changes 0 files                                                                              |
| `bun run build:registry`, `bun run build`      | 64 + 64 byte-identical registry files; 92 prerendered pages                                                 |
| `bun install --frozen-lockfile`                | no changes (`006`'s lock plus `@codemirror/language-data@6.5.2` and `@replit/codemirror-lang-svelte@6.0.0`) |
| `bun run test`                                 | unit 624 pass (10 files); browser 1298 passed, 0 failed (11 files × 2 projects); smoke 94 pass (6 files)    |

**Criteria, as counted at landing** (the spec's counts were written on `006`'s predictions; these are the combined landed numbers):

| #   | Count                                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | frozen install no changes; 34 packages; both new packages pinned                                                                                                                                                                                                                                                                            |
| 2   | 0 errors, 0 warnings; lint exit 0                                                                                                                                                                                                                                                                                                           |
| 3   | second `build:tokens` changes 0 files; 53 names per theme, the same 53; 34 primitives; the `code` map 21 of 21 in decision 2's order; 114 of 114 rows at 4.5 or more (minimum 4.52, `property` on dark `muted`); 10 families; 21 / 21 / 21; 5 `syntax-*` per theme block; the two surface rules once each, `.surface-ink {` after `.dark {` |
| 4   | 74 of 74 bad, 0 of 49 good; 0 violations over 301 files; L19 flags the three forms                                                                                                                                                                                                                                                          |
| 5   | 63 items (1, 3, 3, 2, 47, 7); `code-languages` with its 3 dependencies; `code-editor`'s 7 ranges; 44 dependency names; `since` `0.7.0` on 1; `highlighter.json` with `forgiving: false` once, `true` never                                                                                                                                  |
| 6   | 64 + 64 byte-identical; `highlighter.json` names 26 languages; `pluto-theme.json`'s `cssVars.dark` holds 21 `code-` keys and its `css` the two rules                                                                                                                                                                                        |
| 7   | 92 pages; the highlighter page's HTML holds 26 blocks with `text-code-` spans, 0 `style` attributes in the gallery, 0 Shiki chunks                                                                                                                                                                                                          |
| 8   | 63 of 63                                                                                                                                                                                                                                                                                                                                    |
| 9   | 450 scans, 0 violations (`006`'s 440 + 6 for the new page + 4 for the surface's two open overlays in two themes)                                                                                                                                                                                                                            |
| 10  | 192 (`006`'s 190 + 2)                                                                                                                                                                                                                                                                                                                       |
| 11  | 66 catalogue stops; 34 fixtures / 73 stops (the surface's 7, `code-languages`' 2), rings unclipped                                                                                                                                                                                                                                          |
| 12  | C1 to C4 in 2 of 2 themes; C2's 6 slots on the sudoku, `=` with no class, `font-medium` on `ok` and `solve` and on no call                                                                                                                                                                                                                  |
| 13  | E1 to E5 in 2 of 2 themes; E3's 5 role readings and the mechanism check; E5 on the 7,240-character file and the edge cases; 0 literals                                                                                                                                                                                                      |
| 14  | L1 26 of 26; S2 26 of 26                                                                                                                                                                                                                                                                                                                    |
| 15  | S1 in 2 of 2 page themes: 8 light-page readings, the popover inside and the dialog under `body`, the 2 dark-page readings                                                                                                                                                                                                                   |
| 16  | criterion 5's check; the gallery's 26 at prerender                                                                                                                                                                                                                                                                                          |
| 17  | `code-add` 20 of 20 in 2 of 2 scratch apps (48 files; the 2 packages in the scratch app's `package.json`; 1 `@lezer/highlight`; the two rules once each after `.dark`; 21 `.dark` lines; 21 by-product lines; second `add pluto-theme` byte-identical)                                                                                      |
| 18  | 10, 11 and 6 files; exit 0                                                                                                                                                                                                                                                                                                                  |
| 19  | `0.7.0`; the changelog's entry names the palette, the `cssVars.dark` correction, the surface, the 26 languages and the strict engine, `code-editor` with `pythonRoles`, `code-languages`, `code-block`'s ground class, L19, and the upgrade line; notes 1 and 3                                                                             |
| 20  | met: tagged `v0.7.0` (`011fd75`); the change review cited above                                                                                                                                                                                                                                                                             |

**Notes:**

1. **The checkpoint after build step 3.** The builder stopped with the tokens, the Shiki theme, the gallery, the code block's ground and the surface section built, 597 unit and the touched browser suites green, with the gallery at 1× and 2× and the surface in both page themes. The design lead's reading: on the Python class sample teal type names and cyan attributes read as two colours, with teal the greener, and cyan sits well apart from the keywords' blue; **cyan stays for `property`**, and decision 3's magenta fallback is not taken. The surface is ink on paper with the editor and the block flush, the pill strip and the meter's track on the wash inset, the popover dark inside the panel, the dialog white over the page's scrim. The calls are in `decisions.md`.
2. **The change review's findings applied.** The roles plugin follows the parse tree (E5 reads line 30 of a long file with no scroll or edit); a docstring after a shebang or a same-line comment is a docstring; a keyword argument named like a built-in stays in the body; the shell's `$*`, `$@` and `$?` are keys; nine captions are clauses; the token file keeps its formatting; the changelog names `pythonRoles` and the upgrade path; `bash` is the shell's one id.
3. **The development walk.** 92 pages on `vite dev` in both themes, every page warmed first, a fresh page per load: 0 of 184 loads with a page error or a console error or warning.
4. **Provenance.** No stock file: every file here is ours or a rewrite of `004`'s own files. The two new packages are pinned exactly in `bun.lock`.
5. **The rebase.** The work moved from `616b8a0` onto `ab3a400`; twelve conflicts were resolved keeping both sides, `006`'s first: the version, the changelog's order, `build-tokens.ts` (the surface rules after `groove-b` and `mark-entrance`, still after `.dark`), the generated `app.css` and `pluto-theme.json` (regenerated, not merged), the page lists and the width loops in three browser suites, and the counts in three unit files. `bun.lock` merged clean.
6. **Where the build deviates from the specification, and who allowed it.** Each the least that works; all seen by the review and judged sound. The design calls are in `decisions.md`; the rest, by the builder:
   1. _C2 was rewritten with the theme in step 2_, since `004`'s assertions broke at once; _the keyboard ring helper reads `--ring` where the element sits_, so the dark ring inside a surface on a light page passes.
   2. _The surface's two tab panels carry `tabindex={-1}`_ (bits-ui's panel is a stop; the fixture counts 7); _the gallery's blocks keep their `pre` stop_; _the samples are 10 to 15 lines_.
   3. _`@property` tokenises as a decorator mark plus a teal `property`_ in Shiki and as one purple decorator in the editor; _`int(c)` and `str(d)` are types to Shiki_, so C2 reads `builtin` on `divmod`, `all`, `range` and `print`; _Shiki's TOML grammar marks a same-line comment after a value `invalid`_, so the sample's comment is on its own line.
   4. _`code-languages` declares its three packages as `devDependencies` in `registry.json`_: the CLI's import detection reads static imports only, and the Svelte grammar is a dynamic `import()` so it is not bundled everywhere; the CLI installs declared `devDependencies` with `add -D` (the reviewer READ `index.mjs`).
   5. _`pythonLanguageConfigured` and `pythonRoles` are exported from `code-editor`'s index_; the lib file imports the module directly, since a built file may not import an `/index.js`.
   6. _The plugin marks `self` and `cls` anywhere, the parameter included_ (as Shiki and PyCharm do), and _skips built-in names under `ParamList`, `TypeDef` and `Decorator`_, which the `styleTags` rules own.
   7. _The `code-languages` page's keyboard fixture is its main specimen_; _L1 waits for the status and the first line, then polls the colours_ (the grammar parses on a timer after `reset()`); _the editor page gains an "Example" select_ so E5 sets a document through the page rather than CodeMirror's private DOM.
   8. _The smoke reads the surface rules through a CSS block helper_ (the CLI indents an appended plain rule); _it does not read a loaded language from the prerendered page_ (the `{#await}` is pending at prerender) and proves the item through the scratch app's build and check instead.
   9. _Cyan stays; the plugin runs at `Prec.highest` and follows the tree; a docstring after comments; keyword arguments in the body; shell specials as keys; one shell id; the token file's formatting kept._ The design lead.
7. **For a consuming app.**
   - An app upgrading to 0.7.0: `add pluto-theme code-block code-editor highlighter use-highlighted-code` from `v0.7.0` rewrites its `--code-*` block (21 lines in `:root` and in `.dark`) and the two surface rules; an ink panel is `class="dark surface-ink"` with `BitsConfig defaultPortalTo` around its content and `portalProps={{ to: "body" }}` on any modal.
   - A 0.7.0 code item needs the 0.7.0 `pluto-theme`: `add` pulls it; a hand-copied file without it shows the old twelve slots with the new roles in the body colour.
   - `code-languages` installs about two megabytes of language packages; an app that edits one language keeps `pythonSetup()` alone. Eighteen languages have a Lezer grammar and Svelte a third-party one from 2022; the eight legacy-mode languages colour keywords, strings, numbers and comments.
   - The editor and the block differ on two tokens by design: `@property` and a built-in type used as a call (`str(d)`), which Shiki scopes as a type.
