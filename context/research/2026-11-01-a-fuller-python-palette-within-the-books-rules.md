# A fuller Python palette within the design book's rules

- **Status:** complete
- **Date:** 2026-11-01
- **Author:** the design lead
- **Question, as first asked:** a consuming app finds that `004`'s palette colours three things (keywords, strings, comments) and leaves most of a Python file in the body colour. Could more of the code get its own token within the design book §03 ("no new hues")? Three options were drafted: text-safe tokens plus typography; code as a data figure; a code palette with new hues.
- **The question, widened twice by the owner, the same day.** First: "we should have full syntax highlighting as a dev would expect from something like PyCharm or VS Code. This in no way impacts how colors and accents are used, this is a functional feature" (`decisions.md`, "Syntax highlighting is a function, outside the colour budget"). The three options fell away. Then: "we should have full coverage of all major coding languages." So the palette is not Python's. It is the language-agnostic set of roles an editor theme colours, and both engines must cover the major languages. This memo answers the widened question; the facts gathered for the first one (the amber arithmetic, the candidate hues) are folded into §3.
- **What it blocks:** specification `007` (the full palette, the two engines' mappings, the contrast table, the languages served), released as `v0.7.0`.

## How to read this memo

Every claim carries a label.

- **EXECUTED**: we ran it and saw the result, on 2026-11-01, macOS (Darwin 25.5.0, arm64), Bun 1.3.14, from a scratch folder that links this repository's `node_modules` (shiki 4.5.0, `@shikijs/core` 4.5.0, `@codemirror/lang-python` 6.2.1, `@lezer/python` 1.1.19, `@lezer/highlight` 1.2.5, `@codemirror/language` 6.13.1, `@fontsource-variable/jetbrains-mono` 5.3.0, Playwright 1.64.1 with Chromium 1248). The other CodeMirror language packages were installed into the scratch folder only (`cm/`). Nothing was installed into this repository. The Python corpus is 29 short example scripts written for a code-running product's editor; they are not kept in this repository.
- **READ**: a source says so. Each was read on 2026-11-01. VS Code's theme files were fetched from `microsoft/vscode` at `main`; PyCharm's from `JetBrains/intellij-community` at `master`, the same day.
- **INFERRED**: our reasoning.

Scratch work was done in a throwaway folder outside this repository, not kept: `dump.ts` (every scope path and tag set the 29 files produce), `classify.ts` (the category counts), `contrast.ts` and `propose.ts` (the arithmetic), `vscode.ts` (the theme chains flattened), `lezer-configure.ts`, `theme.ts` (the draft theme for both engines), `langs.ts` (the cross-language run; its output `langs-out.md`), `samples/` (27 files), `render.ts` with `render-proposal.html`, `render-today.html` and four screenshots `shot-{proposal,today}-{light,dark}.png`, and `downloads/` (the VS Code and PyCharm sources).

Terms of art.

- **Slot.** One `--code-<name>` custom property: a role a theme colours, such as `keyword`. `004` defined twelve.
- **Scope.** The dotted name a TextMate grammar gives a piece of text (`entity.name.function.python`). Shiki colours by scope.
- **Tag.** `@lezer/highlight`'s equivalent (`tags.function(tags.variableName)`). CodeMirror colours by tag through a `HighlightStyle`.
- **Scope family / tag family.** A theme rule written on a prefix (`entity.name.type`) or a parent tag (`keyword`), so it covers every grammar that uses the convention.
- **Role.** What a slot means in any language: "a type name", "a key".
- **Ground.** The surface code sits on. The six code grounds are light and dark `muted`, `card` and `background`.
- **Text-safe.** 4.5:1 or better on its ground (WCAG 2.2 SC 1.4.3).
- **Legacy mode.** A CodeMirror 5 style tokenizer run through `StreamLanguage`; no syntax tree, coarser tags.

## In short

- **A "full" palette is about twenty roles and eight hue families.** VS Code's Dark Modern colours its tokens with 18 distinct foregrounds and Light Modern with 19, in about eight hue families; PyCharm's Darcula uses 13 foregrounds for Python and its classic Default 10 (READ, §1). The roles both colour, beyond `004`'s three: numbers, language constants, functions, types, built-ins, decorators, `self`, properties and keys, tags, escapes, invalid text.
- **The 29 examples are scripts, not classes.** Across them Shiki emits 4,133 non-blank grammar tokens and Lezer 3,521 spans. Under `004`'s theme 56.6% (Shiki) and 64.4% (Lezer) are the body colour. Numbers are 5.3% / 6.2%, built-in calls 2.8% / 2.0%, keyword arguments 1.0% / 0, f-string parts 4.6% / 6.6%. There is no docstring, no `self`, one decorator, one class and two `def`s in the set (EXECUTED, §2). A class-heavy sample was added for those roles.
- **The proposal is 21 slots, 9 new primitives, 5 new hue families** (orange, purple, teal, cyan, and the brand's amber as text), each with a light and a dark value that passes 4.5:1 on all six grounds, derived by the same relative-luminance arithmetic the tokens use (EXECUTED, §3). The tightest pair is cyan on dark `muted`, 4.52; every other new value sits at 4.70 or better.
- **Both engines map every slot, with four fixes on the Lezer side.** Python's Lezer grammar has no tag for decorator names, annotations, parameters or f-string braces; `LRLanguage.configure({ props: [styleTags(...)] })` adds them after the fact (EXECUTED, §4.2). It has no way to tell `self` (a plain `VariableName`), a built-in from any other call, or a keyword argument; Shiki tells all three. Shiki's JavaScript grammar crashes `includeExplanation` in 4.5.0; tokenising without it works (EXECUTED).
- **A `HighlightStyle` must share one `@lezer/highlight` instance with the grammars.** Two copies number their modified tags differently, and `function(variableName)` from one copy reads as `special(brace)` in the other. Seen, then fixed, in the scratch install (EXECUTED, §4.3). An app that installs language packages must deduplicate that package.
- **Weight and underline carry.** The installed JetBrains Mono is a variable face, weights 100 to 800, upright only; Shiki's `fontStyle` is a bit field with bold, italic, underline and strikethrough; `tokenClass` already renders bold as `font-medium` and underline as `underline`; a `TagStyle` takes any CSS property (READ, §5).
- **Shiki bundles 242 languages; the 26 "major" grammars weigh 245 KB gzipped together, from 0.6 KB (Dockerfile) to 33 KB (C++); 14 are already in the stock lazy list; all 26 compile under the strict JavaScript engine (EXECUTED, §6).** CodeMirror has first-class `@codemirror/lang-*` packages for 18 of them (JS, JSX, TS and TSX share one; C and C++ share one), Svelte only from `@replit`, and eight only as legacy modes: Shell, TOML, diff, Dockerfile, Ruby, Swift, Kotlin and C# (EXECUTED). `@codemirror/language-data` loads any of 143 descriptions on demand (READ). Under the draft theme every sample of the 26 languages lands its roles in the right slots in both engines, with the gaps listed per language (EXECUTED, §6.4).

## 1. What a full palette is, in practice

### 1.1 VS Code: Dark Modern and Light Modern

READ: `extensions/theme-defaults/themes/{dark_modern,dark_plus,dark_vs,light_modern,light_plus,light_vs}.json` at `main`, 2026-11-01. Dark Modern includes Dark+, which includes Dark VS; the chain holds 65 rules. Light Modern's chain holds 64. The colours below are the rule that wins for a Python or general token; a role with no rule of its own is marked *inherits*.

| Role | Dark Modern | Light Modern | Scope the rule names |
|---|---|---|---|
| editor text / ground | `#CCCCCC` on `#1F1F1F` | `#3B3B3B` on `#FFFFFF` | `editor.foreground`, `editor.background` |
| keyword, storage (`def`, `class`, `import`) | `#569CD6` blue | `#0000FF` blue | `keyword`, `storage`, `storage.type`, `storage.modifier` |
| control keyword (`for`, `return`, `if`) | `#C586C0` purple | `#AF00DB` purple | `keyword.control` (Dark+ and Light+ override) |
| operator (symbol) | `#D4D4D4` (body) | `#000000` (body) | `keyword.operator` |
| word operator (`new`, `typeof`, `instanceof`) | `#569CD6` | `#0000FF` | `keyword.operator.new`, `.expression`, `.cast`, `.sizeof` … |
| string | `#CE9178` orange | `#A31515` dark red | `string` |
| regexp | `#D16969` red | `#811F3F` wine | `string.regexp` |
| template `${`, embedded `#{` | `#569CD6` | `#0000FF` | `punctuation.definition.template-expression`, `punctuation.section.embedded` |
| escape | `#D7BA7D` tan | `#EE0000` red | `constant.character.escape` |
| f-string placeholder | `#9CDCFE` light blue | `#001080` navy | `constant.other.placeholder` (with `variable`) |
| number, unit | `#B5CEA8` pale green | `#098658` green | `constant.numeric`, `keyword.other.unit` |
| language constant (`None`, `true`), `this`/`self` | `#569CD6` | `#0000FF` | `constant.language`, `variable.language` |
| named constant, enum member | `#4FC1FF` sky | `#0070C1` | `variable.other.constant`, `variable.other.enummember` |
| function: definition, call, built-in, macro, decorator | `#DCDCAA` yellow | `#795E26` brown | `entity.name.function`, `support.function` (decorators are `entity.name.function.decorator`, so *inherits*) |
| type, class, namespace, inherited class | `#4EC9B0` teal | `#267F99` teal | `support.class`, `support.type`, `entity.name.type`, `entity.name.namespace`, `entity.other.inherited-class` |
| variable, parameter, property, object key | `#9CDCFE` light blue | `#001080` navy | `variable`, `meta.object-literal.key`, `support.variable` |
| HTML attribute name | `#9CDCFE` | `#E50000` red | `entity.other.attribute-name` |
| CSS property name | `#9CDCFE` | `#E50000` | `support.type.property-name` |
| JSON key | `#9CDCFE` | `#0451A5` | `support.type.property-name.json` (Light only) |
| tag | `#569CD6` | `#800000` maroon | `entity.name.tag`; `punctuation.definition.tag` is `#808080` / `#800000` |
| CSS selector (class, id, pseudo) | `#D7BA7D` | `#800000` | `entity.other.attribute-name.class.css` … |
| comment | `#6A9955` green | `#008000` green | `comment` |
| docstring | *inherits* string | *inherits* string | none |
| invalid | `#F44747` | `#CD3131` | `invalid` |
| heading, bold | `#569CD6` bold | `#800000` / `#000080` bold | `markup.heading`, `markup.bold` |
| diff inserted / deleted / changed | `#B5CEA8` / `#CE9178` / `#569CD6` | `#098658` / `#A31515` / `#0451A5` | `markup.inserted`, `.deleted`, `.changed` |

Distinct foregrounds: Dark Modern 18; Light Modern 20 as written, 19 once `#000000` and `#000000FF` are read as one (EXECUTED: `vscode.ts`). INFERRED, the hue families of Dark Modern: blue (`569CD6`), light blue (`9CDCFE`, `4FC1FF`), teal (`4EC9B0`), yellow (`DCDCAA`), tan (`D7BA7D`), orange (`CE9178`), green (`B5CEA8`, `6A9955`), purple (`C586C0`), red (`D16969`, `F44747`), and greys: eight hues. Italic appears once (`markup.italic`); bold on headings and `markup.bold`.

### 1.2 PyCharm: the classic Default scheme and Darcula

READ: `python/python-syntax-core/src/com/jetbrains/python/highlighting/PyHighlighter.java` (the keys and their fallbacks), `python/python-code-insight/resources/colorSchemes/PythonDefault.xml` and `PythonDarcula.xml` (the Python overrides, six each), and `platform/platform-resources/src/DefaultColorSchemesManager.xml` (the `Default` and `Darcula` base schemes; Darcula's parent is Default). PyCharm's attribute keys are per role, not per scope: a lexer assigns a key to each token and an annotator adds the semantic ones (`PY.FUNCTION_CALL`, `PY.SELF_PARAMETER`, `PY.ANNOTATION` and so on). Each key falls back to a language-neutral key (`DefaultLanguageHighlighterColors.KEYWORD` and so on), which is what makes the scheme cover every language the IDE knows.

| Role (PyCharm key) | Default (light) | Darcula | Fallback key |
|---|---|---|---|
| text / ground | black on white | `#A9B7C6` on `#2B2B2B` | `TEXT` |
| keyword (`PY.KEYWORD`; `True`, `None` are keywords) | `#000080` bold | `#CC7832` orange | `KEYWORD` |
| string (`PY.STRING.U`) | `#008000` bold | `#6A8759` green | `STRING` |
| byte string (`PY.STRING.B`) | `#8A822D` | `#A5C261` | own |
| number (`PY.NUMBER`), format-spec number | `#0000FF` | `#6897BB` blue | `NUMBER` |
| line comment | `#808080` italic | `#808080` | `LINE_COMMENT` |
| docstring (`PY.DOC_COMMENT`) | `#808080` italic | `#629755` green italic | `DOC_COMMENT` |
| decorator (`PY.DECORATOR`) | `#808000` olive | `#BBB529` olive | `METADATA` |
| class definition | plain | plain | `CLASS_NAME` (no colour in either scheme) |
| function definition | plain | `#FFC66D` yellow | `FUNCTION_DECLARATION` |
| function call, method call | plain | plain | `FUNCTION_CALL` (none) |
| built-in name (`PY.BUILTIN_NAME`) | `#000080` navy | `#8888C6` periwinkle | `PREDEFINED_SYMBOL` |
| dunder names (`PY.PREDEFINED_*`) | `#B200B2` magenta | `#B200B2` | own |
| `self` (`PY.SELF_PARAMETER`) | `#94558D` mauve | `#94558D` | own |
| parameter | plain | plain | `PARAMETER` (none) |
| keyword argument (`PY.KEYWORD_ARGUMENT`) | `#660099` purple | `#AA4926` rust | own |
| type annotation (`PY.ANNOTATION`) | plain | plain | `IDENTIFIER` |
| valid escape; f-string braces, `:`, `!r` | `#000080` bold | `#CC7832` | `VALID_STRING_ESCAPE` |
| invalid escape | green on `#FFCCCC` | red wavy underline | `INVALID_STRING_ESCAPE` |
| operators, brackets, comma, dot | plain | plain (Darcula: comma and semicolon `#CC7832`) | `OPERATION_SIGN` … |
| bad character | on `#FFCCCC` | red wavy underline | `BAD_CHARACTER` |

Distinct Python foregrounds: Default 10, Darcula 13 (EXECUTED: counted from the tables). INFERRED, Darcula's families: orange, green, blue, olive, yellow, periwinkle, magenta, mauve, rust, grey: eight hues again. Default (light) is bold-heavy and colour-light: keywords and strings are bold, calls and definitions plain. PyCharm's current light scheme, "IntelliJ Light", was not found by a code search of the repository (`XmlIntelliJLight.xml` is the only hit); it is listed in §8.

### 1.3 What the two have in common (INFERRED)

Both colour, beyond `004`'s three: numbers, language constants, function names (VS Code all of them; PyCharm definitions in Darcula and built-ins in both), types (VS Code), decorators, `self` (PyCharm), escapes and f-string parts, keys and attributes (VS Code), invalid text. Both leave operators and brackets in the body colour. Both use about eight hue families and under twenty foregrounds. "Full syntax highlighting as a dev would expect" is therefore about twenty roles, not a colour per scope.

## 2. What the 29 examples contain

EXECUTED (`dump.ts`, `classify.ts`): the 29 files of the corpus, 4 in a `tabs/` folder and 25 in a `shuffle/` folder, 398 lines in all (an earlier revision held 524). Four probe scripts beside them are not editor examples and were left out. Shiki 4.5.0 (`shiki/core`, the JavaScript engine, the Python grammar, `codeToTokens` with `includeExplanation: true`, counting each explanation entry, so a token is a grammar token, not a style run) and `@lezer/python` through `@codemirror/lang-python` 6.2.1 with `highlightTree` (counting each span that carries a tag). Blank tokens are dropped.

### 2.1 The categories, counted

| Category | Shiki | share | Lezer | share | What landed there |
|---|---|---|---|---|---|
| keyword | 188 | 4.5% | 153 | 4.3% | `import`, `as`, `for`, `def` |
| word operator (`and`, `or`, `in`, `not`, `is`) | 4 | 0.1% | 40 | 1.1% | Shiki marks `in` as `keyword.control.flow`; Lezer as `operatorKeyword` |
| string | 671 | 16.2% | 205 | 5.8% | Shiki counts each quote mark (406 of the 671) and each line of a multi-line string; Lezer one span per literal |
| docstring | 0 | 0 | 0 | 0 | none in the set; the triple-quoted strings are SQL and XML literals |
| f-string parts (`f`, `{`, `}`, `:.2f`, `!r`) | 192 | 4.6% | 233 | 6.6% | Lezer's count includes the 83 f-string bodies as `special(string)` |
| escape (`\n`, regexp classes) | 20 | 0.5% | 7 | 0.2% | Shiki tokenises inside regexp strings; Lezer does not |
| comment | 74 | 1.8% | 37 | 1.1% | Shiki splits `#` from its text |
| number | 218 | 5.3% | 217 | 6.2% | agree |
| constant (`True`, `False`, `None`, `...`) | 12 | 0.3% | 12 | 0.3% | agree |
| built-in function (`print`, `range`, `len`) | 114 | 2.8% | 71 | 2.0% | Lezer tags only `print` (as `keyword`); the other 43 are plain calls to it |
| built-in type (`int`, `str`, `float`) | 10 | 0.2% | 0 | 0 | Lezer: `variableName` |
| exception type | 1 | 0 | 0 | 0 | `BaseException` |
| call (`load_iris(`) | 38 | 0.9% | 89 | 2.5% | Lezer's 89 include the 43 built-ins and 8 class instantiations |
| method call (`df.groupby(`) | 144 | 3.5% | 142 | 4.0% | agree |
| definition (`def total`) | 2 | 0 | 2 | 0.1% | agree |
| class name (`class Item`) | 1 | 0 | 1 | 0 | agree |
| decorator | 2 | 0 | 2 | 0.1% | `@` and `dataclass`; Lezer tags only the `@` (`meta`) |
| `self` / `cls` | 0 | 0 | 0 | 0 | none in the set |
| parameter | 8 | 0.2% | 8 | 0.2% | agree |
| keyword argument (`test_size=`) | 42 | 1.0% | 0 | 0 | Lezer: a `VariableName` beside an `AssignOp`, no tag |
| attribute (`df.shape`) | 38 | 0.9% | 43 | 1.2% | agree within the f-string difference |
| type annotation | 0 | 0 | 4 | 0.1% | Shiki marks `float` in `price: float` as `support.type`, which the builtin-type row holds; Lezer's `TypeDef` node tells the position but not the tag |
| plain name | 697 | 16.9% | 664 | 18.9% | |
| operator (symbol) | 228 | 5.5% | 421 | 12.0% | Lezer counts `.` as `derefOperator` (194); Shiki as punctuation |
| punctuation (`,`, `:`, `.`, `;`) | 589 | 14.3% | 340 | 9.7% | |
| bracket | 840 | 20.3% | 830 | 23.6% | agree |
| **total** | **4,133** | | **3,521** | | |

INFERRED from the table: under `004`'s theme the body colour holds 56.6% of Shiki's tokens and 64.4% of Lezer's; of the rest, strings take most. What reads as "plain" and wants a colour, in order of weight: numbers (5.3%), built-in calls (2.8%), keyword arguments (1.0%), attributes (0.9%), constants (0.3%), built-in types (0.2%); `self`, decorators, class names and docstrings barely occur in these files but do in any class-based program, which is why the class sample of §2.3 exists.

### 2.2 The disagreements that matter

EXECUTED on the 29 files and the class sample; the first three are the largest.

1. **Built-ins.** Shiki: `support.function.builtin.python` on 114 tokens. Lezer: no tag; `print` alone is a `keyword`; `range`, `len`, `sorted` are `function(variableName)` like any call. The editor cannot colour built-ins by tag.
2. **The dot and the operators.** Lezer tags `.` as `derefOperator` and every operator by family; Shiki calls `.` punctuation and every operator a keyword (`keyword.operator.*`), which `004` sends to the body. Harmless while both land on `foreground`; a theme that colours operators must name the families on both sides.
3. **Keyword arguments.** Shiki: `variable.parameter.function-call.python`, 42 tokens. Lezer: `ArgList/VariableName` followed by `AssignOp`, not expressible in `styleTags` (a path matches ancestry, not siblings).
4. **`self`.** Shiki: `variable.parameter.function.language.special.self.python` in a parameter list and `variable.language.special.self.python` in a body. Lezer: a `VariableName` like any other (`self node chain: VariableName / MemberExpression / …`, `lezer-configure.ts`).
5. **Decorator names, annotations, parameters.** Shiki names each (`entity.name.function.decorator`, `support.type` inside `meta.function.parameters`, `variable.parameter.function.language`). Lezer tags only the `@` (`meta`); the name is a `VariableName` inside a `Decorator` node, the annotation inside `TypeDef`, the parameter inside `ParamList`. §4.2 shows the fix.
6. **Docstrings.** Shiki: `string.quoted.docstring.multi.python`. Lezer: `string`, in an `ExpressionStatement`. The editor can tell a docstring only by position (a bare string statement), which `styleTags` cannot express.
7. **Shiki's `includeExplanation` fails on the JavaScript grammar** in 4.5.0: `TypeError: undefined is not an object (evaluating 'tokenWithScopes.startIndex')` in `@shikijs/primitive` `_tokenizeWithTheme`. The same code tokenises without explanations. No other of the 26 grammars failed. Counts for JavaScript in §6.4 come from style runs, not grammar tokens.

### 2.3 The class sample

EXECUTED (`samples/python-class.py`, 20 lines: a module docstring, a decorated dataclass with annotated fields, a `@property`, two methods with `self`, an f-string with `!r` and `:.2f`, a `print` with `None` and `True`). Under the draft theme of §4, Shiki lands 129 tokens: 60 body, string 10, comment 8 (both docstrings), keyword 7, type 7, number 7, `self` 6, escape 6, function 4, property 4, builtin 4, decorator 3, constant 3. Lezer, with the configured parser, lands 111 spans: 58 body, keyword 9, function 8, string 7, number 7, type 6, decorator 4, property 4, escape 4, constant 3, comment 1 (the line comment; both docstrings are `string`). The two differences are §2.2's items 4 and 6.

## 3. The proposed slot set and its values

### 3.1 The slots (INFERRED, from §1 and §2)

The `code` map grows from 12 to 21. Every slot is a role, so one theme colours every grammar. Text slots must pass 4.5:1; `background` and `active-line` are grounds and need no ratio of their own (`004` decision 5 already pairs `active-line` with a marker).

| Slot | Role | New? |
|---|---|---|
| `foreground` | the body: names, parameters, operators, punctuation, brackets | |
| `background` | the code ground | |
| `comment` | comments, docstrings, diff headers, Markdown quotes | |
| `keyword` | keywords, storage words, word operators, Markdown marks, preprocessor directives | |
| `constant` | `True`, `None`, `null`, `undefined`, symbols, enum members, `UPPER_CASE` constants | |
| `string` | strings, regexps, inline code, YAML scalars | |
| `number` | numbers, units, colours, dates | new |
| `escape` | escapes, f-string braces and specs, `${` `}`, `#{`, HTML entities | new |
| `function` | definitions (bold), calls, methods, macros, preprocessor functions | |
| `builtin` | built-in functions, kernel functions, magic names, CSS functions | new |
| `type` | classes, interfaces, namespaces, primitives, lifetimes | new |
| `tag` | HTML tags, CSS selectors, components, TOML tables | new |
| `property` | keys, attributes, fields, object members, `$variables` | new |
| `decorator` | decorators, annotations, attributes (`#[derive]`, `[Obsolete]`, `@Override`) | new |
| `self` | `self`, `cls`, `this`, `super`, `$0` | new |
| `link` | links, underlined | |
| `invalid` | invalid text | new (the editor read `--destructive` directly) |
| `inserted`, `deleted`, `changed` | diff lines | |
| `active-line` | the editor's active line and the block's emphasised line | |

Not slots, by choice: `operator` and `punctuation` (both editors leave them in the body; a slot whose colour equals the body would still put a class on every bracket, since Shiki merges runs by style string, and brackets are 20% of tokens); `docstring` (reads as `comment`, as now; PyCharm agrees, VS Code does not); `regexp` (reads as `string`); `parameter` (Lezer cannot tell one in most grammars; VS Code colours it as a variable); `heading` (bold `foreground`, no colour, so no slot). Each would cost one row everywhere.

### 3.2 The families, and where the values come from

EXECUTED (`contrast.ts`, `propose.ts`): `contrastRatio` from `scripts/contrast.ts`, truncated, never rounded up. A new value is derived like the tokens were: a hue and saturation are fixed (HSL), and the lightness is searched in steps of 0.001 to the lightest value (light theme) or darkest (dark theme) that passes the target on the hardest ground. The hardest light ground is `muted` `#EAEAE7` (relative luminance 0.8211); the hardest dark ground is `muted` `#2B2D32` (0.0262). A value that passes on `muted` passes on `card` and `background` in the same theme, since those are lighter (light) or darker (dark). The new values target 4.7, not 4.5, so each keeps 0.2 of headroom.

The families: the five text colours the tokens already hold (ink, ink-soft, blue, green, red), the brand's amber made text-safe, and four new hues. Hue positions on the HSL wheel: red 4°, orange 25°, amber 42°, green 148°, teal 185°, cyan 200°, blue 225°, purple 275°. The nearest pair is cyan and blue (25° apart) and then teal and cyan (15°); the between-colour ratios in §3.4 say how far apart they read.

### 3.3 The one contrast table

EXECUTED. Bold is 4.5 or better. Every text slot passes on every ground in both themes.

| Slot | Family | Light value | light `muted` | light `card` | light `background` | Dark value | dark `muted` | dark `card` | dark `background` |
|---|---|---|---|---|---|---|---|---|---|
| `foreground` | ink | `#14161C` ink | **15.00** | **18.08** | **16.84** | `#F7F7F4` paper | **12.83** | **14.99** | **16.84** |
| `comment` | ink-soft | `#4A4F5C` ink-soft | **6.79** | **8.18** | **7.63** | `#A9ADB8` paper-soft | **6.13** | **7.17** | **8.05** |
| `keyword`, `constant`, `link`, `changed` | blue | `#2456E6` blue | **4.90** | **5.91** | **5.51** | `#7A9BFF` blue-lifted | **5.22** | **6.10** | **6.85** |
| `string`, `inserted` | green | `#136E3E` green-text | **5.23** | **6.31** | **5.87** | `#4CC982` green-lifted | **6.55** | **7.65** | **8.59** |
| `invalid`, `deleted` | red | `#C42A1F` red-text | **4.71** | **5.67** | **5.29** | `#FF7D73` red-lifted | **5.53** | **6.46** | **7.26** |
| `number`, `escape` | orange (new) | `#A44F12` orange-text | **4.70** | **5.66** | **5.27** | `#E7792A` orange-lifted | **4.70** | **5.49** | **6.17** |
| `function` | amber | `#85600B` amber-text (new) | **4.74** | **5.71** | **5.32** | `#F0AE12` amber | **7.06** | **8.25** | **9.27** |
| `builtin`, `decorator`, `self` | purple (new) | `#903ACE` purple-text | **4.73** | **5.70** | **5.31** | `#B780DF` purple-lifted | **4.70** | **5.49** | **6.17** |
| `type`, `tag` | teal (new) | `#15717A` teal-text | **4.74** | **5.71** | **5.32** | `#20A6B3` teal-lifted | **4.70** | **5.49** | **6.17** |
| `property` | cyan (new) | `#1B709B` cyan-text | **4.53** | **5.47** | **5.09** | `#269DD8` cyan-lifted | **4.52** | **5.28** | **5.93** |

Nine new primitives: `amber-text`, `orange-text`, `orange-lifted`, `purple-text`, `purple-lifted`, `teal-text`, `teal-lifted`, `cyan-text`, `cyan-lifted`. The dark `function` colour is the brand's own `amber` primitive, which already passes 7.06 on dark `muted` (the Shiki memo §4.1 measured it); nothing new is needed there. The cyan pair was derived at 4.5 and sits at 4.52 / 4.53; the others at 4.7.

*Why these assignments* (INFERRED, each from §1): the function family is VS Code's yellow / brown family, which in our palette is amber; built-ins, decorators and `self` are PyCharm's purple-and-periwinkle group, the names a language predefines; numbers and escapes share a family in VS Code (`B5CEA8` and `D7BA7D` are both warm pales) and PyCharm sends f-string parts to the escape colour; types and tags share teal in VS Code (`4EC9B0` for types, blue for tags, teal for CSS selectors in neither, so this is the one place the proposal picks); keys, attributes and fields are VS Code's light-blue family, here cyan; language constants are keyword-coloured in both editors.

### 3.4 Between the colours

EXECUTED, light / dark. Ink against each new family: amber 3.16 / 1.81, orange 3.19 / 2.73, purple 3.17 / 2.73, teal 3.16 / 2.73, cyan 3.30 / 2.83. Between families: blue and cyan 1.08 / 1.15, blue and purple 1.03 / 1.11, teal and cyan 1.04 / 1.03, teal and green 1.10 / 1.39, amber and orange 1.00 / 1.50, green and orange 1.11 / 1.39, ink-soft and teal 1.43 / 1.30. INFERRED: WCAG sets no minimum between two text colours, and these are luminance ratios, not hue distances; every new family was set to the same lightness target, so they differ by hue, not by lightness. The pairs to watch by eye are teal against cyan (15° apart, both dull blue-greens) and blue against cyan. The screenshots of §5.1 are where that is judged. `007`'s build checkpoint judged both pairs at native size and at 2× and kept cyan for `property` (`decisions.md`, "After the `007` build's checkpoint").

### 3.5 The amber arithmetic, kept from the first question

EXECUTED. The brand amber `#F0AE12` (HSL 42°, 88%, 51%) measures 1.61, 1.95 and 1.81 on the light grounds and 7.06, 8.25 and 9.27 on the dark ones. The lightest colour of the same hue and saturation that passes 4.5 on light `muted` is `#8A6309` (lightness 29%), 4.50 / 5.42 / 5.05; at 4.7 it is `#85600B`. Both are a brown: ochre, not yellow. On light `card` alone, `#9A6F0A` passes at 4.51. A lifted amber for dark grounds at the threshold is `#C08A0C` (4.51), but the brand amber itself passes, so no lifted value is needed. Of the four mark fills on the six grounds: blue passes as text on the three light grounds only; red `#E23A2E` is non-text (3.20 to 4.30) everywhere; green `#1E9E56` fails light `muted` (2.86), is non-text on the other light grounds and on dark `muted`, and passes as text only on dark `card` and `background` (4.66, 5.23). So the mark's colours as they stand are not a text palette; their text-safe forms (`red-text`, `green-text`, `amber-text`) are.

The candidate hues computed for the old option C, at their 4.5 thresholds, for the spec's reference: purple 275° at 60% `#933FCF` / `#B57CDE`; magenta 320° `#BA2E8B` / `#DB6DB6`; orange 25° at 85% `#AB4F0E` / `#EC7017`; teal 185° `#1F747C` / `#2BA2AD`; cyan 200° `#1B709B` / `#269DD8`; olive 70° `#62701C` / `#899D27`; brown 30° `#8F5F30` / `#C3874A`.

## 4. The two engines' mappings

### 4.1 By role: scope families and tag families

EXECUTED (`theme.ts`; proven over §6.4's samples). The Shiki column is the theme's scope selectors; a deeper selector beats a shallower one, which is how `storage.type.string.python` (the `f` prefix) escapes the `storage.type` rule. The Lezer column is the `HighlightStyle` tags; a rule on a parent catches its children and a child's rule wins.

| Slot | Shiki scope families | Lezer tags |
|---|---|---|
| `comment` | `comment`, `punctuation.definition.comment`, `string.quoted.docstring` (and its quotes), `comment entity.name.tag`, `markup.quote`, `meta.diff.header`, `meta.diff.index` | `comment` (covers line, block, doc), `docString`, `quote`, `contentSeparator`, `documentMeta` |
| `string` | `string` (and `string punctuation.definition.string`), `string.regexp`, `markup.inline.raw`, `string.other.link.title`, `storage.type.string.python`, `entity.name.tag.doctype` | `string`, `special(string)`, `regexp`, `character`, `attributeValue`, `monospace` |
| `escape` | `constant.character.escape`, `constant.character.format.placeholder`, `constant.other.placeholder`, `storage.type.format`, `punctuation.section.embedded`, `punctuation.definition.template-expression`, `punctuation.definition.interpolation`, `constant.character.entity` | `escape`, `special(brace)` (JS `${`; Python braces after §4.2) |
| `number` | `constant.numeric`, `keyword.other.unit`, `constant.other.color`, `constant.other.time`, `constant.other.date` | `number` (covers `integer`, `float`), `unit`, `color` |
| `constant` | `constant.language`, `variable.other.constant`, `variable.other.enummember`, `constant.other.symbol`, `support.constant` (but `support.constant.property-value` and `.font-name` back to the body) | `bool`, `null`, `atom`, `constant(variableName)`, `literal` |
| `keyword` | `keyword`, `storage`, `keyword.control`, `keyword.other`, the word operators (`keyword.operator.expression`, `.new`, `.delete`, `.logical.python`, `.sizeof`, `.cast`), `punctuation.section.embedded.begin.php`, `meta.diff.range`, `punctuation.definition.heading`, `punctuation.definition.list.begin.markdown`, `keyword.control.directive`; symbol operators (`keyword.operator`, `storage.type.function.arrow`) back to the body | `keyword` (covers control, definition, module, operator keywords), `modifier`, `processingInstruction` (Markdown marks, `<?php`, `#include`), `list` |
| `function` | `entity.name.function`, `meta.function-call.generic` (Python), `support.function.macro`, `entity.name.function.macro`, `entity.name.function.preprocessor`; **bold** when under `meta.function`, `meta.function.definition`, `meta.method.declaration` or `entity.name.function.definition` | `function(variableName)`, `function(propertyName)`, `macroName`; **bold** on `function(definition(variableName))`, `function(definition(propertyName))` |
| `builtin` | `support.function` (covers `.builtin`, `.kernel`, `.construct`, `.misc`), `support.variable.magic`, `support.variable` | `standard(variableName)`, `standard(propertyName)` (legacy modes' `builtin`); Lezer's Python grammar emits none |
| `type` | `entity.name.type`, `entity.name.class`, `entity.name.namespace`, `entity.name.scope-resolution`, `entity.other.inherited-class`, `support.type`, `support.class`, `entity.name.package`, primitives (`storage.type.primitive`, `storage.type.built-in`, `support.type.primitive`, `keyword.type`, Go's `storage.type.numeric` family, `storage.type.sql`, `storage.type.java`/`.cs`/`.kotlin`/`.swift`/`.php`), Rust lifetimes (`entity.name.lifetime`, `storage.modifier.lifetime`) | `typeName`, `standard(typeName)`, `className`, `definition(className)`, `namespace` |
| `tag` | `entity.name.tag` (HTML, JSX, Svelte, CSS element selectors), CSS class, id and pseudo selectors, `support.class.component`, `entity.name.section.toml`; `punctuation.definition.tag` back to the body | `tagName` and its `standard`, `special`, `definition` forms |
| `property` | `entity.other.attribute-name`, `support.type.property-name` (CSS, JSON, TOML), `meta.object-literal.key`, `meta.attribute.python`, `variable.other.property`, `variable.object.property`, `variable.other.object`, `variable.other.member`, `variable.other.readwrite.instance`, `entity.name.variable.field`, `entity.name.tag.yaml` (YAML keys), `variable.other.key.toml`, shell variables (`variable.other.normal`, `.positional`, `.special`, `.for`), `variable.other.php`, `variable.css` | `propertyName`, `definition(propertyName)`, `attributeName`, `special(variableName)`, `labelName` |
| `decorator` | `meta.decorator`, `entity.name.function.decorator`, `punctuation.definition.decorator`, `meta.attribute.rust`, `storage.type.annotation`, `meta.attribute.cs`, `meta.attribute.php`, `storage.modifier.attribute` (Swift), `meta.annotation` (Kotlin) | `annotation`, `meta` (Python's `@`, Rust's `#[…]`, C's `#define` argument, Kotlin's `@JvmInline` in the legacy mode) |
| `self` | `variable.language` (covers Python's `.special.self`, `this`, `super`, Swift's `$0`), `variable.parameter.function.language.special.self` | `self` (emitted by the JS, Rust, Java, PHP and C++ grammars; not by Python's) |
| `link` | `markup.underline.link`, `string.other.link.destination`; underlined | `link`, `url`; underlined |
| `invalid` | `invalid`, `invalid.illegal`, `invalid.deprecated` | `invalid` |
| `inserted`, `deleted`, `changed` | `markup.inserted`, `.deleted`, `.changed` | `inserted`, `deleted`, `changed` |
| bold, no colour | `markup.heading`, `entity.name.section.markdown`, `markup.bold` | `heading`, `strong` |
| the body | `variable`, `variable.parameter`, `variable.other.readwrite`, `punctuation`, `meta.brace`, the symbol operators | `variableName`, `definition(variableName)`, `local(variableName)`, `operator`, `punctuation`, `separator`, `bracket`, `content`, `name` |

The draft theme object is 28 rules (Shiki) and 21 (Lezer). Shiki's rule list is long because grammars spell the same role many ways; the Lezer list is short because `@lezer/highlight` fixes the vocabulary and the grammars obey it.

### 4.2 Teaching Python's Lezer grammar the roles it lacks

EXECUTED (`lezer-configure.ts`): `pythonLanguage.configure({ props: [styleTags({...})] })` (the `LRLanguage.configure` form; `parser.configure` for the bare parser) adds node props without touching the package. Four rules, each proven on the class sample:

| Rule | Before | After |
|---|---|---|
| `"Decorator/VariableName": tags.annotation` (and `Decorator/MemberExpression/PropertyName`) | `dataclass` after `@` is `variableName` | `annotation`; the imported `dataclass` on line 2 stays `variableName` |
| `"TypeDef/VariableName": tags.typeName` (and the member form, for `tuple[str, ...]`) | `str`, `float`, `int` in `name: str` are `variableName` | `typeName` |
| `"ParamList/VariableName": tags.local(tags.variableName)` | parameters are `variableName` | `local(variableName)`; the body colour, but now addressable |
| `"FormatReplacement/{ FormatReplacement/}": tags.special(tags.brace)` | f-string braces are `brace` | `special(brace)`, the tag JS already uses for `${` |

Not teachable this way (INFERRED from the node chain): `self` (no node of its own), built-ins (no node), keyword arguments (a sibling relation), docstrings (a position). A `ViewPlugin` with `Decoration.mark` over `VariableName` nodes whose text is `self` or `cls`, or whose text is in a set of built-in names, would do it; that is editor code, a few dozen lines. `007` decision 6 builds it as the roles plugin, `pythonRoles`, for `self`, `cls`, the built-ins and docstrings; keyword arguments stay in the body. Shiki needs none of this: the Python grammar names all four.

### 4.3 One `@lezer/highlight`, or nothing matches

EXECUTED. The scratch install of the CodeMirror language packages brought its own copy of `@lezer/highlight`, while `theme.ts` first imported the repository's. The `HighlightStyle` then put `range` and `print` in the `escape` slot and C's `int` in the `tag` slot, although `cmStyle.style([tags.function(tags.variableName)])` answered `slot-function` when asked directly. The reason: a tag is matched by id, base tags are numbered in one fixed order in every copy, and modified tags (`function(variableName)`, `special(brace)`) are numbered in the order they are first created, which differs between copies. Importing the style's `tags` and `HighlightStyle` from the same copy the grammars use fixed every count. INFERRED for the item page and a consuming app: the `code-editor` item must name `@lezer/highlight` as a dependency it shares with every `@codemirror/lang-*` package, and an app that installs one must see one copy in `bun.lock` (the repository's lock already pins 1.2.5 once).

## 5. Weight and underline, the second channel

- **The face.** READ: `@fontsource-variable/jetbrains-mono` 5.3.0, `metadata.json`: `weights: [100 … 800]`, `styles: ["italic", "normal"]`, variable axes `wght` 100 to 800 and `ital` 0 to 1. `index.css` declares `font-weight: 100 800` for the upright files only; `wght-italic.css` exists and is not imported (`001`; `004` decision 6 says why). So 500 and 700 are real instances of the installed face; italic would be synthesised. The renders of §5.1 show medium on definitions holding column alignment, as a monospaced face must (EXECUTED, by eye at 2× in the screenshots; not measured in pixels).
- **Shiki.** READ: `@shikijs/vscode-textmate` `FontStyle`: `NotSet = -1, None = 0, Italic = 1, Bold = 2, Underline = 4, Strikethrough = 8`; `@shikijs/core` maps a theme's `fontStyle: "bold" | "italic" | "underline" | "strikethrough"` to those bits and emits `font-weight:bold`, `font-style:italic`, `text-decoration:underline` or `line-through` in HTML. `tokenClass()` in `highlighter.ts` at `v0.4.0` reads bits 2 and 4 and emits `font-medium` and `underline`; it ignores 1 and 8. EXECUTED: the draft theme's bold definitions came through as `fontStyle: 2` (2 bold tokens in the 29 files, the two `def`s; 9 in the Rust sample, its `fn` names).
- **CodeMirror.** READ: `@codemirror/language` `TagStyle` is `{ tag, class?, [styleProperty: string]: any }`; "any further properties will be interpreted as in style objects given to style-mod", so `fontWeight: "var(--font-weight-medium)"` and `textDecoration: "underline"` are accepted, and `v0.4.0`'s `code-editor-theme.ts` already uses both. A `class` rule bypasses the generated stylesheet, which is how `langs.ts` counted slots.
- **What weight can carry** (INFERRED): definitions bold within `function` (both engines name them); headings and `markup.bold`; nothing else, since `004`'s reading of the design book ("honest pixels") already rules out synthesised italic, and underline is spent on links. VS Code bolds only headings; PyCharm's light scheme bolds keywords and strings. The proposal keeps weight for definitions and headings only.

### 5.1 The renders

EXECUTED (`render.ts`): one static page per palette (the proposal; `004`'s today), six blocks rendered by Shiki under the draft theme (the class sample, TypeScript, JSON, Rust, HTML, CSS) with the proposal's values as `:root` and `.dark` variables, JetBrains Mono from the installed package, 13.5 px at 1.6, ligatures off, Shiki's `font-weight:bold` shown as 500. Screenshots at 1280 px, 2×: `shot-proposal-light.png`, `shot-proposal-dark.png`, `shot-today-light.png`, `shot-today-dark.png`. What the proposal shows, read from the images: decorators, `self`, `print`, `len`, `sorted`, `var(` and `calc(` in purple; numbers, `\n`, `&amp;`, f-string braces and `${}` in orange; `str`, `float`, `Item`, `Queue<T>`, `Vec<T>`, `u32` and HTML tags in teal; JSON keys, HTML attributes and CSS property names in cyan; `total`, `push`, `main` bold in amber, calls in amber; `None`, `True`, `null`, `undefined` in blue with the keywords. The dark render keeps the same reading with the lifted values; amber functions are the brightest token there, as yellow is in Dark Modern.

## 6. Languages

### 6.1 What Shiki bundles

EXECUTED: `bundledLanguagesInfo` from `shiki` 4.5.0 lists **242 languages** with 104 aliases among them (`@shikijs/langs/dist` holds 361 `.mjs` files, aliases included). The 26 asked for, each present, with the grammar file's size (`@shikijs/langs/dist/<id>.mjs`, raw and `gzip -9`) and whether `v0.4.0`'s `highlighter.ts` already lists it lazily:

| Language (Shiki id) | Aliases | Raw bytes | Gzipped | In the stock list of 14 |
|---|---|---|---|---|
| Python `python` | `py` | 77,130 | 9,218 | yes |
| JavaScript `javascript` | `js`, `cjs`, `mjs` | 184,866 | 16,449 | yes |
| TypeScript `typescript` | `ts`, `cts`, `mts` | 190,678 | 16,127 | yes |
| TSX `tsx` | | 185,567 | 16,446 | yes |
| JSX `jsx` | | 187,823 | 16,578 | yes |
| HTML `html` | | 61,930 | 11,768 | yes |
| CSS `css` | | 56,933 | 12,508 | yes |
| JSON `json` | | 3,193 | 803 | yes |
| YAML `yaml` | `yml` | 11,581 | 2,287 | yes |
| TOML `toml` | | 7,192 | 1,300 | no |
| Markdown `markdown` | `md` | 65,304 | 5,634 | yes |
| Shell `shellscript` | `bash`, `sh`, `shell`, `zsh` | 45,421 | 6,145 | yes (as `bash`) |
| SQL `sql` | | 24,794 | 7,522 | yes |
| Go `go` | | 51,828 | 5,131 | no |
| Rust `rust` | `rs` | 17,019 | 2,745 | no |
| Java `java` | | 30,385 | 4,313 | no |
| C `c` | | 78,119 | 10,526 | no |
| C++ `cpp` | `c++` | 533,914 | 33,101 | no |
| C# `csharp` | `c#`, `cs` | 101,349 | 11,005 | no |
| Ruby `ruby` | `rb` | 51,978 | 5,715 | no |
| PHP `php` | | 120,400 | 28,632 | no |
| Kotlin `kotlin` | `kt`, `kts` | 9,815 | 2,168 | no |
| Swift `swift` | | 94,538 | 14,753 | no |
| Svelte `svelte` | | 20,473 | 3,167 | yes |
| diff `diff` | | 2,861 | 706 | yes |
| Dockerfile `docker` | `dockerfile` | 1,925 | 615 | no |

Sum of the 26, gzipped: **245,362 bytes**; the stock 14 are 65 KB of it for Python alone (Shiki memo §3.5). Each is loaded only when used, so the list's length costs nothing until a block names the language (`004` decision 6). The JSX, TSX and JavaScript grammars embed nothing further; Svelte, HTML and Markdown pull their embedded grammars (CSS, JavaScript) lazily when Shiki meets them. **All 26 compile under the strict JavaScript engine** (`forgiving: false`; EXECUTED, `strict.ts`), which closes the Shiki memo's §9 question for this set: `forgiving: true` is no longer needed for them.

### 6.2 What CodeMirror has

EXECUTED: `bun pm view <package> --json` and `… time --json`, 2026-11-01. All MIT. "Unpacked" is the registry's `dist.unpackedSize`.

| Package | Version | Released | Unpacked | Covers |
|---|---|---|---|---|
| `@codemirror/lang-python` | 6.2.1 | 2025-05-14 | 36,987 | Python |
| `@codemirror/lang-javascript` | 6.2.5 | 2026-03-02 | 64,094 | JavaScript, JSX, TypeScript, TSX (`javascriptLanguage`, `jsxLanguage`, `typescriptLanguage`, `tsxLanguage`) |
| `@codemirror/lang-html` | 6.4.12 | 2026-08-04 | 78,820 | HTML (depends on `lang-css` and `lang-javascript`) |
| `@codemirror/lang-css` | 6.3.1 | 2024-11-26 | 41,188 | CSS |
| `@codemirror/lang-json` | 6.0.2 | 2025-06-19 | 10,751 | JSON |
| `@codemirror/lang-yaml` | 6.1.3 | 2026-03-24 | 15,718 | YAML |
| `@codemirror/lang-markdown` | 6.5.2 | 2026-08-04 | 72,594 | Markdown (depends on `lang-html`) |
| `@codemirror/lang-sql` | 6.10.0 | 2025-09-16 | 146,145 | SQL, nine dialects |
| `@codemirror/lang-go` | 6.0.1 | 2024-05-29 | 22,934 | Go |
| `@codemirror/lang-rust` | 6.0.2 | 2025-06-19 | 8,860 | Rust |
| `@codemirror/lang-java` | 6.0.2 | 2025-06-19 | 9,620 | Java |
| `@codemirror/lang-cpp` | 6.0.3 | 2025-06-19 | 9,331 | C and C++ (`cppLanguage` for both) |
| `@codemirror/lang-php` | 6.0.2 | 2025-06-19 | 13,284 | PHP (depends on `lang-html`) |
| `@replit/codemirror-lang-svelte` | 6.0.0 | 2022-11-29 | 190,445 | Svelte; not a `@codemirror` package; four years old |
| `@codemirror/legacy-modes` | 6.5.5 | 2026-10-07 | 1,959,189 | 155 CodeMirror 5 modes as `StreamParser`s (`mode/` holds 310 files, a `.js` and a `.d.ts` each) |
| `@codemirror/language-data` | 6.5.2 | 2025-10-23 | 71,718 | 143 `LanguageDescription`s |

No `@codemirror/lang-ruby`, `lang-swift`, `lang-kotlin`, `lang-csharp`, `lang-shell`, `lang-bash`, `lang-toml`, `lang-diff`, `lang-dockerfile`, `lang-svelte` or `lang-c` exists (EXECUTED: each `bun pm view` returns nothing). For those eight languages the only CodeMirror 6 route is a legacy mode: `shell`, `toml`, `diff`, `dockerFile`, `ruby`, `swift`, and `kotlin` and `csharp` from `mode/clike`. A legacy mode has no tree, so no bracket matching by syntax, no indentation by syntax, and its tags come from CodeMirror 5 token names through `@codemirror/language`'s `defaultTable` (READ, `dist/index.js` line 2321): `def` → `definition(variableName)`, `variable-2` → `special(variableName)`, `builtin` → `standard(variableName)`, `qualifier` → `modifier`, `error` → `invalid`, `header` → `heading`, `property` → `propertyName`, `tag`, `attribute`, `meta`, `keyword`, `atom`, `number`, `string`, `comment` and so on.

READ, `@codemirror/language-data` 6.5.2 `dist/index.js` and `@codemirror/language`'s `LanguageDescription`: `languages` is an array of 143 `LanguageDescription.of({ name, alias, extensions, filename, load })` entries; `load()` is a dynamic `import()` of the package (26 entries import a `@codemirror/lang-*` package, 111 import a legacy mode and wrap it with `StreamLanguage.define`), returning a `LanguageSupport`; `LanguageDescription.matchLanguageName(languages, "python", true)` and `matchFilename(languages, "x.py")` pick one; a description caches its `support` after the first load. The package depends on every `lang-*` package and `legacy-modes`, so installing it installs them all (that is the install cost; the bundle cost is one chunk per language, since each `load` is a separate `import()`). INFERRED: for a code block that only displays, Shiki is the engine; `language-data` matters only to an editor that must open any language, and an app that edits Python alone needs `lang-python` and nothing else (`004` decision 9's preset).

### 6.3 The samples

EXECUTED: 26 samples of nine to fifteen lines written for this memo, one per language, each exercising the roles its grammar has (a definition, a call, a type, a decorator or attribute where the language has one, a string with an escape or an interpolation, a number, a constant, a comment, keys or attributes where the language is data or markup); `samples/` in the scratch. The 29 Python files and the class sample stand for Python.

### 6.4 Both engines over the 26 languages

EXECUTED (`langs.ts`): each sample tokenised by Shiki under the draft theme (slot counted from the token's `var(--code-…)` colour) and by CodeMirror under the draft `HighlightStyle` (slot counted from the class), with the tokens that fell to the body listed by innermost scope or tag. The table gives the slots each language used, with counts, and the gaps.

| Language | Shiki: slots used (tokens) | CodeMirror parser | CodeMirror: slots used (spans) | Gaps and notes |
|---|---|---|---|---|
| Python, 29 files | 4,133: string 771, number 217, keyword 193, function 184, escape 172, builtin 119, comment 74, property 38, constant 12, type 12, decorator 2; 2 bold | Lezer (configured) | 3,521: function 304, string 288, keyword 225, number 217, escape 125, property 43, comment 37, constant 11, type 3, decorator 2; 2 bold | Lezer's `function` holds the built-ins; its `keyword` holds the 32 format specs (`modifier`) and 40 word operators |
| Python, class sample | 129: string 10, comment 8, keyword 7, type 7, number 7, self 6, escape 6, function 4, property 4, builtin 4, decorator 3, constant 3 | Lezer (configured) | 111: keyword 9, function 8, string 7, number 7, type 6, decorator 4, property 4, escape 4, constant 3, comment 1 | no `self`, no `builtin`, docstrings as `string` (§2.2) |
| JavaScript | 89 runs: keyword 14, string 9, property 8, escape 6, constant 5, function 5, number 3, self 2, comment 1, type 1; 5 bold | Lezer | 113: keyword 13, string 7, property 7, escape 6, number 3, function 3, type 2, self 2, comment 1, constant 1 | Shiki's explanation crash (§2.2 item 7); Lezer tags `#base` as `propertyName` |
| TypeScript | 170: type 17, property 17, keyword 16, function 7, string 6, number 4, self 4, constant 3, comment 2, escape 2, decorator 1; 5 bold | Lezer | 157: keyword 16, type 16, property 16, self 5, number 4, string 3, function 3, escape 2, comment 1, decorator 1, constant 1 | agree; `@sealed` is `decorator` in both |
| TSX | 96: escape 8, keyword 7, string 6, type 5, property 5, function 3, number 3, constant 2, tag 2 | Lezer | 89: keyword 7, type 5, property 5, number 3, string 2, function 2, tag 2 | JSX braces are `escape` in Shiki (`punctuation.section.embedded`), body in Lezer |
| JSX | 109: property 13, escape 12, keyword 7, string 6, function 4, tag 4, comment 3, number 2, constant 1 | Lezer | 103: keyword 7, property 7, function 4, tag 4, string 2, number 2, comment 1 | as TSX |
| HTML | 112: string 21, tag 16, property 11, number 4, comment 3, escape 1 | Lezer | 88: tag 15, property 9, string 8, number 3, comment 2, type 1 | `&amp;` is `escape` in Shiki, body in Lezer; Lezer's `type 1` is the `<style>` block's `.card` (`className`) |
| CSS | 115: number 18, property 12, tag 7, string 6, builtin 5, comment 3, keyword 2 | Lezer | 103: number 13, property 9, keyword 7, type 6, constant 3, string 2, comment 1, tag 1 | Lezer's CSS grammar tags `.card` as `className` and `:hover` as `constant(className)` (READ, `@lezer/css`), so selectors land in `type`; Shiki puts them in `tag`; a `HighlightStyle` scoped to `cssLanguage` with `className` → `tag` would align them. `var(`, `calc(`, `rgb(` are `builtin` in Shiki and `keyword` in Lezer; `grid`, `monospace` are `atom` in Lezer (→ `constant`) and the body in Shiki |
| JSON | 116: string 21, property 14, number 5, constant 3, escape 3 | Lezer | 70: property 14, string 6, number 5, constant 3 | agree; Lezer does not split escapes |
| YAML | 71: property 26, string 21, comment 2, constant 1, number 1 | Lezer | 46: property 14, comment 1, string 1 | **Lezer's YAML grammar leaves plain scalars untagged** (`build`, `ubuntu-latest`, `3`), so values are the body; Shiki colours them as strings. The `code-languages` page states the gap (`007` decision 7) |
| TOML | 46: string 12, property 8, number 4, tag 3, comment 2, constant 1 | legacy `toml` | 23: property 8, string 4, constant 4, number 4, comment 1 | the legacy mode tags `[server]` as `atom` → `constant`; Shiki as `tag` |
| Markdown | 42: keyword 5, string 5, comment 3, link 1, builtin 1; 7 bold, 1 underlined | Lezer | 37: keyword 11, link 6, string 2, comment 2, property 1; 7 bold, 6 underlined | marks (`#`, `-`, `>`, `**`) are `keyword` in both; `_italic_` has no channel (no italic face); the fenced Python is highlighted by the embedded grammar in both |
| Shell | 80: string 28, property 17, keyword 8, comment 4, builtin 4, function 2, number 1 | legacy `shell` | 40: string 12, keyword 10, property 3, builtin 2, decorator 1, comment 1, number 1 | `$NAME` is `property` in both; `set`, `export` are `builtin`; the legacy mode tags the shebang `meta` |
| SQL | 89: keyword 21, string 6, builtin 4, type 3, number 3, comment 2, function 1 | Lezer | 80: keyword 26, type 2, string 2, constant 2, number 2, comment 1 | `SUM`, `COUNT` are `builtin` in Shiki, `keyword` in Lezer; table and column names are the body in both |
| Go | 116: type 11, string 11, keyword 10, function 7, property 5, escape 4, number 3, comment 2, constant 1 | Lezer | 101: keyword 12, type 9, property 7, string 4, function 2, comment 1, constant 1, number 1 | Go's `storage.type.numeric` family is `type` by the rule; `len`, `make` are `builtin` in Shiki only |
| Rust | 158: type 24, keyword 17, function 10, self 6, number 4, escape 4, decorator 3, string 3, comment 2; 9 bold | Lezer | 121: type 17, keyword 13, decorator 9, property 8, function 7, self 5, number 3, comment 1, string 1; 3 bold | `#[derive(Debug, Default)]`: Shiki colours the brackets `decorator` and the names `type`; Lezer tags the whole attribute `meta`; lifetimes `'a` are `type` in Shiki, body in Lezer |
| Java | 95: keyword 19, type 9, string 7, comment 3, function 3, property 3, number 2, decorator 2, self 1, constant 1 | Lezer | 83: keyword 15, type 7, string 3, number 2, comment 1, self 1, function 1, constant 1 | `@Override` is `decorator` in Shiki (`storage.type.annotation`), untagged in Lezer |
| C | 130: keyword 12, string 12, type 12, number 8, property 8, function 5, escape 4, comment 3; 2 bold | Lezer (`cpp`) | 90: type 12, keyword 9, property 6, string 5, function 4, number 4, comment 1, decorator 1, escape 1; 2 bold | `#define MAX 10`: Lezer tags the argument `meta`; `printf` is `builtin` in Shiki only; `c->n` is `property` in both |
| C++ | 141: type 16, keyword 15, string 8, function 8, property 6, number 5, comment 4, decorator 1, constant 1, escape 1; 3 bold | Lezer | 106: keyword 15, type 15, function 6, string 4, property 3, number 3, comment 2, constant 1, escape 1; 1 bold | `[[nodiscard]]` is `decorator` in Shiki, body in Lezer; `std::` scope names are `type` in both |
| C# | 114: keyword 15, type 15, escape 8, property 6, string 6, comment 4, function 4, number 4, constant 2 | legacy `clike.csharp` | 53: keyword 16, type 3, string 2, comment 1 | the legacy mode sees keywords, three types and the strings; no numbers, no `$"{…}"` parts, no attribute, no `this` |
| Ruby | 82: string 14, keyword 10, constant 5, escape 5, type 4, property 4, function 3, comment 2, number 2, builtin 1; 2 bold | legacy `ruby` | 47: keyword 10, string 6, property 6, constant 4, tag 2, number 2, comment 1 | `@name` is `property` in both; `:sym` is `constant` in both; the legacy mode tags `Shop::Item` as `tag` |
| PHP | 102: keyword 16, number 8, property 7, string 6, type 3, decorator 3, constant 3, builtin 2, function 2, self 1, escape 1 | Lezer | 85: keyword 14, number 6, type 5, function 3, property 3, string 3, constant 2 | `#[Attribute]` is `decorator` in Shiki only; `$this` is `self` in Shiki only |
| Kotlin | 106: string 15, keyword 12, function 11, type 10, escape 10, number 6, constant 2, comment 2 | legacy `clike.kotlin` | 57: keyword 11, type 4, number 3, string 3, decorator 1, comment 1 | the legacy mode sees `@JvmInline` (`meta`) but no calls, no `${}` parts |
| Swift | 107: type 10, function 9, keyword 8, number 6, string 6, builtin 3, comment 2, constant 2, decorator 1, self 1 | legacy `swift` | 96: keyword 7, type 6, number 6, property 5, comment 2, string 2, constant 2 | `@available` is `decorator` in Shiki only; argument labels are the body in both |
| Svelte | 163: string 12, tag 11, property 9, escape 8, keyword 7, number 7, function 3, comment 3, type 2, builtin 1 | `@replit` Lezer | 152: tag 10, property 8, string 8, keyword 8, number 6, type 3, function 3, comment 1 | `{#if}` blocks are `keyword` in both; the `<script lang="ts">` body is TypeScript in both; `$props()`, `$state()` are `function` |
| diff | 18: comment 4, inserted 2, keyword 1, deleted 1 | legacy `diff` | 6: inserted 3, deleted 2, decorator 1 | the legacy mode tags `@@` as `meta` → `decorator`; headers go untagged |
| Dockerfile | 34: keyword 10, string 9, comment 2 | legacy `dockerfile` | 15: keyword 10, string 3, comment 1, number 1 | agree |

INFERRED from the table. Every role-based rule held across the languages: no sample needed a slot the set lacks, and no language's grammar sent a role to a wrong slot except where noted (CSS selectors, TOML tables, the diff `@@`), each a one-line rule. The engines differ in depth, not in vocabulary: Shiki names built-ins, decorators, `self`, escapes and interpolation marks in every grammar that has them; Lezer names them where its grammar does (JS, TS, Rust, Java, PHP) and not in Python, and the eight legacy modes see keywords, strings, numbers, comments and little more. For the code block (Shiki) the palette is full in all 26. For the editor, it is full in the Lezer languages after §4.2's configuration and partial in the legacy eight.

## 7. What it costs (INFERRED)

- **The token file.** `code` grows from 12 to 21 entries. The nine new primitives land in `primitives`. `004` decision 5 requires a `code` value to be a semantic name, so the new hues need semantic names in `themes.light` and `themes.dark` (for instance `syntax-orange: orange-text` / `orange-lifted`, five such pairs), or the spec relaxes the rule to let a `code` entry name a light and a dark primitive directly. Either way `tokens.test.ts`'s "48 semantic names per theme" becomes 53 or the `code` check changes; `contrast.test.ts`'s `SLOT_ROWS` grows from 10 to 36 (18 text slots × 2 themes) and its "five text colours" check becomes ten; `generated.test.ts`'s 12 `code-*` and 12 `color-code-*` become 21.
- **The Shiki theme** (`highlighter.ts`): 14 rules become about 28 (§4.1), and `tokenClasses` 11 entries become 20. `tokenClass` itself is unchanged. An install snippet and the `code-block` page prerender with the new classes, and the HTML barely moves: over the 29 files Shiki emits 2,304 style runs under `004`'s theme, 1,145 of them with a class (49.7%), and 2,369 runs under the draft, 1,265 with a class (53.4%); the rendered HTML is 141,219 characters against 144,111, since Shiki merges adjacent runs of one style and the draft drops `004`'s bold on every call (EXECUTED, `classed.ts`).
- **The editor** (`code-editor-theme.ts`, `code-editor-python.ts`): 7 `HighlightStyle` rules become about 21; `pythonSetup()` uses `pythonLanguage.configure({ props: [styleTags(...)] })` with §4.2's four rules; `invalid` reads `--code-invalid`. A `ViewPlugin` for `self` and built-ins is optional and extra.
- **Tests.** `code.spec.ts` C2 checks four slot colours, the function weight and "no class on `=`"; the first grows to the new slots (a number, a built-in, a type on the preview's Python block), the `=` check still holds (operators stay in the body), and the function weight check moves to a definition. E3 checks `print` at weight 500; under the proposal `print` is `builtin` at normal weight and the `def`'s name is the bold one, so that assertion changes; its "12 rules of ours" counts `codeTheme`'s chrome rules, not the highlight's, and is unchanged. The lint sees no new literal: every value is a `var()`.
- **The registry.** `highlighter`'s lazy list grows from 14 to 26 languages (no cost until used); `code-editor` names `@lezer/highlight` beside `@codemirror/lang-python` (§4.3). Other `lang-*` packages are an app's to add; the item page lists §6.2.
- **A consuming app**: `add pluto-theme` rewrites the `--code-*` block (21 lines, by the CLI's theme updater; `004` decision 5 describes the by-product) and re-installs `highlighter.ts`, `code-block` and `code-editor`.
- **The design book.** The ruling asks for one line in §03: syntax colour is functional, like state colour, and sits outside the surface budget; the four brand colours' rule for figures is untouched.

## 8. What this memo does not settle

- **PyCharm's current light scheme.** "IntelliJ Light" (the default since 2019.3) was not found by a code search of the repository; the classic `Default` was read instead. This memo does not compare IntelliJ Light's Python values.
- **Perceptual spacing of the new hues.** The values are set by relative luminance to one target, so they match in lightness and differ in hue. OKLCH was not used, to keep the tokens' arithmetic. Whether teal, cyan and blue read apart is a judgement by eye: `007`'s build checkpoint made it at native size and at 2× and kept cyan (`decisions.md`, "After the `007` build's checkpoint").
- **Shiki's `includeExplanation` on the JavaScript grammar** fails in 4.5.0 (§2.2). It affects research counts, not rendering: the highlighter tokenises without explanations.
- **Medium weight and column alignment** were judged by eye in the 2× screenshots, not measured in pixels.
- **`@replit/codemirror-lang-svelte`** is four years old at 190 KB unpacked. Its handling of Svelte 5 runes beyond the sample (`$props`, `$state` parsed as calls) was not tested. `007` decision 7 serves it pinned, and the item page states its age.
- **The legacy modes' depth.** The editor's legacy-mode languages colour keywords, strings, numbers and comments (§6.4). The `code-languages` page states which languages are legacy (`007` decision 7).
- **Bundle cost of the CodeMirror language packages** was not measured; only unpacked sizes were read. Each language loads as its own chunk on first use (`007` decision 7).
- **A `ViewPlugin` for `self` and built-ins** (§4.2): built in `007` as `pythonRoles`, which also tells docstrings (`007` decision 6).

## 9. Sources

- `context/decisions.md`, "Syntax highlighting is a function, outside the colour budget" (2026-11-01) and "The design calls for `004`" (2026-10-31).
- `context/research/2026-10-31-shiki-and-a-token-highlight-palette.md` §3, §4, §5; `2026-10-31-codemirror-6-under-svelte-5.md` §5; `context/specifications/004-code-and-data.md` decisions 5, 6, 7, 9.
- `git show v0.4.0:src/lib/registry/lib/highlighter.ts`; `git show v0.4.0:src/lib/registry/ui/code-editor/code-editor-theme.ts`; `scripts/contrast.ts`; `tokens/pluto.tokens.json`; `tests/unit/contrast.test.ts`; `tests/e2e/code.spec.ts`.
- The Pluto Systems design book §03 and §04.
- The corpus of 29 Python example scripts (not in this repository).
- VS Code, `microsoft/vscode` `main`, `extensions/theme-defaults/themes/`: `dark_modern.json`, `dark_plus.json`, `dark_vs.json`, `light_modern.json`, `light_plus.json`, `light_vs.json` (fetched 2026-11-01).
- PyCharm, `JetBrains/intellij-community` `master`: `python/python-syntax-core/src/com/jetbrains/python/highlighting/PyHighlighter.java`, `python/python-code-insight/resources/colorSchemes/PythonDefault.xml`, `PythonDarcula.xml`, `platform/platform-resources/src/DefaultColorSchemesManager.xml` (fetched 2026-11-01).
- `node_modules/@shikijs/vscode-textmate/dist/index.d.ts` (`FontStyle`); `@shikijs/core/dist/index.mjs` (font-style mapping); `@shikijs/types/dist/index.d.mts` (`includeExplanation`); `shiki` `bundledLanguagesInfo`.
- `node_modules/@codemirror/language/dist/index.d.ts` (`TagStyle`, `HighlightStyle`, `LanguageDescription`) and `dist/index.js` (`defaultTable`, line 2321); `@lezer/python/dist/index.js` (node names, `styleTags`); `@lezer/highlight` 1.2.5.
- `@codemirror/language-data` 6.5.2 `dist/index.js`; `@codemirror/legacy-modes` 6.5.5 `mode/`; `bun pm view` for the packages of §6.2.
- `node_modules/@fontsource-variable/jetbrains-mono/{index.css,metadata.json}`.

**In one line:** a full palette is about twenty roles in eight hue families; the proposal is 21 slots on five text families the tokens hold plus orange, purple, teal, cyan and a text-safe amber, nine new primitives, every value at 4.5:1 or better on all six code grounds; Shiki names every role in all 26 languages and Lezer names them in its first-class grammars once Python's is configured, with `self`, built-ins and the eight legacy-only languages the editor's known gaps.
