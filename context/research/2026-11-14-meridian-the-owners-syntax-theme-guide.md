# Meridian, the owner's syntax theme guide

- **Status:** a source. The owner's own document, given on 2026-11-14 at the code-palette workbench, kept here so a specification can cite it. Its rules, its reasons for each colour, its palette, its role map, its highlight.js and Prism table and its testing checklist are as written. Its per-platform code (the generator scripts, the full VS Code, Neovim and Helix files, the terminal code) is summarised, since this system ships none of those targets. It is not a research memo, and its claims carry no EXECUTED, READ or INFERRED labels; a specification that relies on a figure here measures it again.
- **Date:** 2026-11-14
- **Author:** the owner
- **Why it is here:** the owner, giving it: "I want to use this for our syntax highlighting colors. You may adjust the colors slightly to better match the pluto 4 colors, but use the same color role organization" (`decisions.md`, "Code takes Meridian's roles", 2026-11-14).
- **What it informs:** specification `013`.

---

## Meridian syntax theme: implementation guide

Nov 14, 2026.

### Overview

Meridian is a seven-role syntax palette with matched light and dark modes. Every token color reaches at least 4.6:1 contrast on the light background and 7.2–8.6:1 on the dark one. To build it you need three things: one tokens file that defines every color, a role map that turns each highlighter's token names into Meridian's roles, and per-platform outputs generated from those two.

These six rules keep any implementation looking like Meridian:

1. **Color carries meaning, not syntax.** Only the seven roles get color. Variables, operators, punctuation and plain identifiers stay in the text color.
2. **One lightness per mode.** Hue changes between roles; perceived lightness stays even. The colors were solved in OKLCH for a target contrast, so don't hand-tweak a hex without re-running the contrast check.
3. **Red is rare.** It marks escapes, regex, string interpolation and errors only. It never marks anything you see on every line.
4. **Comments recede.** Use gray italic at about 4:1, deliberately below the token colors.
5. **No pure white or black.** Use the warm off-white and blue-charcoal backgrounds below.
6. **Regular weight everywhere.** No bold tokens. Comments are the only styled role (italic).

### Why these colors

The palette is split by temperature. Cool colors (violet, blue, navy) mark the structure of the code. Warm colors (yellow, plum, red) mark values and the places where something unusual happens. Green, in between, marks content that comes from outside the program. You can sense the shape of a file before you read a single word.

- **Keyword · Violet.** Keywords are the skeleton: `if`, `return`, `fn`, `class`. Violet carries authority without sounding an alarm, and it sits apart from the blues and greens of the names and data around it. Control flow reads down the left edge of a file without competing with what it controls. It is also the most familiar keyword color in modern editors, so Meridian feels at home on the first day.
- **Function · Blue.** Functions are the verbs, the places where something happens. Blue is the color of links and actions in nearly every interface, so a call reads as something you can follow. It is bright enough to find at a glance and calm enough to appear on every line.
- **Type · Navy.** Types are the nouns that hold the program up. Navy is blue's heavier, quieter sibling. It sits close to the ink color, so types feel structural and permanent, yet stays distinct enough to tell `HashMap` from `map`. Keeping types and functions in one blue family shows they are related: both are names you define.
- **String · Green.** Strings are content: messages, paths, keys and text from the world outside the program. Green says "this is data, not code," and it stays easy on the eyes through long runs of JSON, SQL and HTML.
- **Constant · Yellow.** Numbers, booleans and fixed values are small and exact. A warm gold gives them the glint of figures on a ruler, easy to spot in a dense line. It deepens to ochre in light mode so it stays legible, and warms to honey in dark mode.
- **Meta · Plum.** Decorators, macros, attributes and lifetimes talk about the code instead of being the code. They are instructions to the compiler. Plum sits between violet and red: related to keywords because it works at the language level, but warmer, signaling that something special is attached here.
- **Special · Red.** Red means look closer. Escapes, regex and interpolation are where a string stops being literal. Red is kept rare on purpose, so it never becomes background noise and real errors keep their urgency.
- **Comment · Gray italic.** Comments are a human voice beside the code. Gray lets the code lead, and italic marks a different speaker, like notes in a margin.
- **Text · Ink.** Variables, operators and punctuation stay in the plain text color. That restraint is what lets the seven colors mean something: when most of the screen is quiet, every colored word is telling you what it is.

### Palette

These are the final values, in hex for shipping and in OKLCH for regenerating. Contrast is the WCAG 2 ratio against that mode's background.

| Role | Color | Light hex | Light OKLCH | Light contrast | Dark hex | Dark OKLCH | Dark contrast |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Keyword | Violet | `#793CC3` | 0.506 0.199 300 | 6.2:1 | `#BE9EF7` | 0.761 0.129 300 | 7.8:1 |
| Function | Blue | `#0166C7` | 0.518 0.171 255 | 5.4:1 | `#76AEF5` | 0.741 0.119 255 | 7.6:1 |
| Type | Navy | `#2B4383` | 0.400 0.111 266 | 9.0:1 | `#99ABD6` | 0.743 0.066 267 | 7.6:1 |
| String | Green | `#087D39` | 0.516 0.139 150 | 5.0:1 | `#69C17E` | 0.738 0.129 150 | 7.9:1 |
| Constant | Yellow | `#956901` | 0.552 0.114 80 | 4.7:1 | `#E0AE56` | 0.780 0.121 80 | 8.6:1 |
| Meta | Plum | `#9C3877` | 0.502 0.150 345 | 6.2:1 | `#E495C2` | 0.762 0.110 345 | 7.8:1 |
| Special | Red | `#C0312D` | 0.536 0.181 27 | 5.4:1 | `#F7867B` | 0.742 0.140 27 | 7.2:1 |
| Comment | Gray, italic | `#757B84` | 0.581 0.016 258 | 4.1:1 | `#818690` | 0.619 0.016 264 | 4.8:1 |
| Text | Ink | `#25292F` | 0.279 0.012 258 | 14.0:1 | `#D9DFE8` | 0.902 0.014 258 | 13.0:1 |

The editor surfaces around the code use the same neutrals:

| Surface | Use | Light | Dark |
| --- | --- | --- | --- |
| Background | Code area | `#FBFAF7` | `#161A1F` |
| Panel | Gutter, tab bar, sidebar | `#F1F0ED` | `#1E2228` |
| Line | Borders, indent guides | `#E0E0DD` | `#2C2F35` |
| Selection | Selection, current line | `#DFEBFA` | `#1D2837` |
| Line numbers | Gutter numbers | Comment color at 55% opacity | Comment color at 55% opacity |

Navy is the one intentional outlier. In light mode it sits darker (9:1) so types read as structure close to the text color. In dark mode it is lifted to the same lightness as the other hues, with lower chroma, so it doesn't turn into a dim blue.

### Role mapping

Every highlighter names its tokens differently, so the role map is what makes Meridian look the same everywhere. When a token matches more than one row, the most specific name wins. LSP semantic tokens beat tree-sitter captures, and tree-sitter captures beat TextMate scopes.

| Role | What gets it | Tree-sitter captures | TextMate scopes | LSP semantic tokens |
| --- | --- | --- | --- | --- |
| Keyword (violet) | Control flow, declarations, modifiers, word operators (`and`, `in`, `is`), `self` and `this`, HTML tag names, CSS property names and at-rules | `@keyword` and all `@keyword.*`, `@variable.builtin`, `@tag`, `@property` (CSS only) | `keyword`, `storage.type`, `storage.modifier`, `keyword.operator.word`, `variable.language`, `entity.name.tag`, `support.type.property-name.css` | `keyword`, `modifier`, `selfKeyword` |
| Function (blue) | Function and method definitions and calls, built-in functions, JSON object keys | `@function`, `@function.call`, `@function.method`, `@function.method.call`, `@function.builtin`, `@property` (JSON only) | `entity.name.function`, `support.function`, `meta.function-call entity.name.function`, `support.type.property-name.json` | `function`, `method` |
| Type (navy) | Classes, structs, enums, interfaces, traits, generics, built-in types, constructor calls, CSS class and id selectors | `@type`, `@type.builtin`, `@type.definition`, `@constructor` | `entity.name.type`, `entity.name.class`, `support.type`, `support.class`, `storage.type.primitive`, `storage.type.built-in`, `entity.other.attribute-name.class.css` | `type`, `class`, `struct`, `enum`, `interface`, `typeParameter`, `builtinType` |
| String (green) | String and character literals, include paths | `@string`, `@character`, `@string.special.path` | `string`, `string.quoted` | `string` |
| Constant (yellow) | Numbers, booleans, `null`/`None`/`nil`, ALL_CAPS constants, enum members, Ruby symbols, CSS values and units | `@number`, `@number.float`, `@boolean`, `@constant`, `@constant.builtin`, `@constant.macro`, `@string.special.symbol` | `constant.numeric`, `constant.language`, `constant.other`, `variable.other.constant`, `support.constant`, `keyword.other.unit` | `number`, `enumMember`, `boolean` |
| Meta (plum) | Decorators, annotations, attributes, macros, preprocessor directives, lifetimes, HTML attributes, CSS pseudo-classes and custom properties, shell variables | `@attribute`, `@function.macro`, `@keyword.directive`, `@label` (Rust lifetimes), `@tag.attribute`, `@variable` inside shell expansions | `meta.decorator`, `meta.attribute`, `entity.name.function.macro`, `meta.preprocessor`, `keyword.control.directive`, `entity.other.attribute-name`, `entity.name.type.lifetime`, `variable.other.normal.shell` | `decorator`, `macro`, `attribute`, `lifetime` |
| Special (red) | Escape sequences, regex literals, string interpolation delimiters, HTML entities, invalid code | `@string.escape`, `@string.regexp`, `@string.special`, `@punctuation.special`, `@character.special` | `constant.character.escape`, `string.regexp`, `punctuation.definition.template-expression`, `punctuation.section.embedded`, `constant.character.entity`, `invalid` | `regexp`, `escapeSequence`, `formatSpecifier` |
| Comment (gray italic) | Line, block and doc comments, shebangs | `@comment`, `@comment.documentation` | `comment`, `punctuation.definition.comment` | `comment` |
| Text (ink) | Variables, parameters, fields, properties, modules and namespaces, operators, punctuation | `@variable`, `@variable.parameter`, `@variable.member`, `@property`, `@module`, `@operator`, `@punctuation.*` | `variable`, `meta.property`, `entity.name.namespace`, `keyword.operator`, `punctuation` | `variable`, `parameter`, `property`, `namespace`, `operator` |

Three rules need semantic information that a plain grammar doesn't have:

- **Calls vs. constructors.** `parse(tag)` is a Function; `Release(...)` and `new Error(...)` are Types. Grammars usually tell these apart by capitalization, which is right for most languages but wrong for Go and C#, where methods are capitalized too. Use LSP semantic tokens for those two.
- **ALL_CAPS constants.** `MAX_LINES` is a Constant even though the grammar sees a variable. Add a capture or regex rule for `^[A-Z][A-Z0-9_]+$` identifiers. Don't color every `const` declaration yellow, or TypeScript files turn yellow.
- **Modules stay plain.** `std::collections`, `java.util` and `fs` are Text. Only the type at the end of a path (`HashMap`) gets Navy.

### Single source of truth

Keep every color in one `meridian.tokens.json` and generate the CSS, editor themes and terminal mappings from it. Then a color change is a one-line edit plus a rebuild, and the platforms can't drift apart.

1. **Create the tokens file.** It holds roles, not syntax names. The role map from the previous section lives in each generator, not here.

   ```json
   {
     "name": "Meridian",
     "version": "1.0.0",
     "roles": {
       "keyword":  { "light": "#793CC3", "dark": "#BE9EF7" },
       "function": { "light": "#0166C7", "dark": "#76AEF5" },
       "type":     { "light": "#2B4383", "dark": "#99ABD6" },
       "string":   { "light": "#087D39", "dark": "#69C17E" },
       "constant": { "light": "#956901", "dark": "#E0AE56" },
       "meta":     { "light": "#9C3877", "dark": "#E495C2" },
       "special":  { "light": "#C0312D", "dark": "#F7867B" },
       "comment":  { "light": "#757B84", "dark": "#818690", "italic": true },
       "text":     { "light": "#25292F", "dark": "#D9DFE8" }
     },
     "surfaces": {
       "background": { "light": "#FBFAF7", "dark": "#161A1F" },
       "panel":      { "light": "#F1F0ED", "dark": "#1E2228" },
       "line":       { "light": "#E0E0DD", "dark": "#2C2F35" },
       "selection":  { "light": "#DFEBFA", "dark": "#1D2837" }
     }
   }
   ```

2. **Write one generator per target.** Each reads the tokens and writes into `dist/` (CSS, VS Code, Neovim, Helix, ANSI), run by one build script.
3. **Gate the build on contrast.** A script computes each role's WCAG ratio against that mode's background and fails the build outside the limits: tokens 4.5–15:1 in light and 6.5–9.5:1 in dark, comments at least 3.8:1 (at most 6:1). This check is what stops a hand-tweaked hex from breaking the system.
4. **Version it.** Bump the minor version when a color shifts and the major version when a role assignment changes. Editor users notice role changes much more than small shifts in a color's shade.

### Web

On the web, ship Meridian as CSS custom properties and point any highlighter at them. Light mode is the default; dark mode follows the visitor's system setting unless the page sets `data-theme`. The generated stylesheet sets `--code-bg`, `--code-panel`, `--code-line`, `--code-selection`, `--code-text`, `--code-comment`, `--code-keyword`, `--code-function`, `--code-type`, `--code-string`, `--code-constant`, `--code-meta` and `--code-special` on `:root`, and writes the dark block twice: under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and under `:root[data-theme="dark"]`, so a manual theme toggle and the system setting both work. `pre code` takes the background and text color, `font-variant-ligatures: none` and `tab-size: 4`.

- **Shiki (build time).** It takes the VS Code theme files built for the editor, with `defaultColor: false`, so it writes only CSS variables and the stylesheet decides which mode wins.
- **highlight.js or Prism (runtime).** Map their classes to the variables. Two classes are shared between languages and need a language-specific override: in highlight.js, `hljs-attr` marks both HTML attributes (Meta) and JSON keys (Function); in Prism, `token.property` marks both CSS properties (Keyword) and JSON keys (Function). CSS selectors are all Type, whether they name an element (`h1`), a class or an id, so a selector reads as one unit.

| Role | highlight.js classes | Prism classes |
| --- | --- | --- |
| Keyword | `hljs-keyword`, `hljs-name`, `hljs-attribute` | `keyword`, `tag`, `atrule`, `property` in CSS |
| Function | `hljs-title.function_`, `hljs-built_in`, `hljs-attr` in JSON | `function`, `property` in JSON |
| Type | `hljs-type`, `hljs-title.class_`, `hljs-selector-tag`, `hljs-selector-class`, `hljs-selector-id` | `class-name`, `builtin`, `selector` |
| String | `hljs-string` | `string`, `char`, `attr-value` |
| Constant | `hljs-number`, `hljs-literal`, `hljs-symbol` | `number`, `boolean`, `constant`, `symbol` |
| Meta | `hljs-meta`, `hljs-attr`, `hljs-selector-pseudo`, `hljs-variable` in Bash | `annotation`, `decorator`, `attr-name`, `macro`, `directive`, `lifetime-annotation`, `variable` in Bash |
| Special | `hljs-regexp`, `hljs-char.escape_` | `regex`, `entity`, `escape`, `interpolation-punctuation` |
| Comment | `hljs-comment`, `hljs-quote` | `comment`, `prolog`, `cdata` |
| Text | `hljs-subst`, `hljs-params`, `hljs-property`, `hljs-variable` | `punctuation`, `operator`, `variable` |

### Editors

Build the VS Code theme first: Shiki, Cursor and most other VS Code-based editors read the same file. Each has `colors` for the editor UI (background, foreground, selection `#DFEBFA`, line highlight `#F1F0ED`, line numbers `#757B848C`, indent guides `#E0E0DD`, panels `#F1F0ED`, focus border `#0166C7` in light), `tokenColors` for TextMate scopes following the role map, and `semanticTokenColors` for language-server tokens, which take priority. Neovim, Helix, Zed and JetBrains each get a small generated file of their own from the same palette and role map; Neovim links its LSP groups to the tree-sitter groups; Helix's dark theme inherits the light one and repeats only its palette; Zed maps its capture names (`keyword`, `function`, `type`, `constructor`, `string`, `string.escape`, `string.regex`, `number`, `boolean`, `constant`, `attribute`, `label`, `preproc`, `tag`, `comment` italic, and `variable`, `property`, `punctuation`, `operator` in the text color).

### Terminal and CLI output

Respect `NO_COLOR` and non-TTY output; pick light or dark from a flag, OSC 11 or `COLORFGBG` (falling back to dark); pick a depth (truecolor, 256 or 16 colors). In 16-color mode: Keyword 35 magenta, Function 34 blue, Type 36 cyan, String 32 green, Constant 33 yellow, Meta 95 bright magenta, Special 31 red, Comment 90 plus italic, Text 39. The terminal palette adds a cyan, solved at the same lightness, because terminals need one; it has no role in code. Dark set: background `#161A1F`, foreground `#D9DFE8`, cursor `#76AEF5`, selection `#1D2837`.

### Testing checklist

- `contrast.ts` passes for both modes: tokens at 4.5:1 or more in light and 6.5–9.5:1 in dark, comments at 3.8:1 or more.
- Open a real file in at least eight languages (Python, TypeScript, Rust, Go, Java, C#, SQL, HTML or CSS, JSON). Most of each screen should stay in the text color, and no single role should dominate.
- Compare a call and a constructor (`parse()` and `Release()`) in Go and C#. Both need semantic tokens to come out right.
- Confirm red appears only on escapes, regex, interpolation and errors. If red shows up on most screens, a scope is mapped too broadly.
- Check JSON keys are blue and HTML attributes plum in every target.
- Run screenshots through a color-blindness simulator (deuteranopia and protanopia). Strings and red specials should still separate by lightness, and comments by italic.
- View both modes on a low-contrast laptop panel and on a high-brightness display. Dark yellow and green are the first to look too bright.
- Test the CLI in a light and a dark terminal, with `NO_COLOR=1`, and piped to a file.
- Diff the generated files in `dist/` before publishing, so a generator change can't ship unnoticed.

Source the guide cites: Shiki's dual themes guide, for the `defaultColor: false` setup and its CSS variables.
