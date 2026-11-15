# How to highlight code accurately: Shiki, tree-sitter, Lezer and the semantic level, measured against a hand-labelled reference

- **Status:** complete
- **Date:** 2026-11-14
- **Author:** a researcher
- **Question:** The owner, at the code-palette workbench, found colours that are plainly wrong: `0x2A` in two colours, a Python docstring in the comment colour, `install plutosystems` coloured as a string, and `Body` left plain in `-> Body | None` while the types beside it are coloured. The owner asked: "how do we properly syntax highlight this code to 100% accuracy? … is Shiki the right pick?" Which highlighting approach labels code most accurately, and at what cost?
- **What it blocks:** the specification that decides the code block's highlighting engine, which today is `007`'s Shiki theme with the workbench's proposed rules waiting beside it; and, through it, any specification that aligns the editor (`code-editor`, `code-languages`) with the block.
- **Data:** [`2026-11-14-highlighting-reference.json`](2026-11-14-highlighting-reference.json), the hand-labelled reference for the 18 workbench specimens and for 10 held-out gallery samples.

## How to read this memo

Every claim carries a label.

- **EXECUTED:** we ran it and saw the result, on 2026-11-14, on macOS (Darwin 25.5.0, arm64) with Bun 1.4.4. The project pins Bun 1.3.14; the machine has 1.4.4.
- **READ:** a source says so. Each was read on 2026-11-14. Web sources are in "Sources". Package files were read in the scratch installs.
- **INFERRED:** our reasoning from the two.

All experiments ran in a scratch folder outside this repository and were not kept. Nothing was installed into the repository. Repository modules were imported by absolute path: the specimens, `palette.ts`, `highlighter.ts`, `rules.server.ts`, `code-languages.ts`, `code-editor-theme.ts` and the gallery's `code-samples.ts`. This memo and its data file are the only files written here.

Terms used throughout.

- A **slot** is one of the workbench's 19 text roles, `TEXT_SLOTS` in `src/lib/workbench/palette.ts`. The **body colour** is the `foreground` slot.
- **Highlighting levels.** **Lexical** highlighting matches regular expressions against the text, line by line, as TextMate grammars do. **Syntactic** highlighting parses the code into a tree and colours its nodes. **Semantic** highlighting asks the language's own analyser (a compiler or a **language server**) what each name refers to.
- A **TextMate grammar** is a set of regular expressions that gives each piece of text a **scope**, a dotted name such as `string.unquoted.argument.shell`. A **theme rule** maps scopes to colours. **Shiki** runs TextMate grammars.
- **tree-sitter** is a parser generator. A **grammar** is compiled to a parser; in the browser it is a **WASM** (WebAssembly) file. A **query** (a `.scm` file) matches patterns of tree nodes and **captures** them under names such as `@keyword`. **`highlights.scm`** holds the highlighting query. An **injection** parses part of a file with another grammar (a `<script>` in HTML). **Locals** (`locals.scm`) mark which names are local variables.
- **Lezer** is CodeMirror 6's parser system. Its **tags** (`tags.keyword`) are its scopes; **`styleTags`** attaches tags to tree nodes. A **legacy mode** is a CodeMirror 5 tokenizer run through `StreamLanguage`: lexical, with no real tree.
- The **reference** (or **golden** labels) is the right slot for every character, written by hand. **Accuracy** is the share of non-whitespace characters whose slot equals the reference. **Visible accuracy** compares colours instead of slots, under the owner's picks (`2026-11-14-the-owners-code-palette.json`), where for example `property` and `self` take the body colour and `function`, `builtin` and `decorator` share navy. **Recall** of a slot is the share of its reference characters a candidate gets; **precision** is the share of a candidate's characters in that slot that are right.
- A **held-out set** is code labelled before any candidate ran on it and never used to tune anything. It tests whether a tuned candidate generalises.

## In short

- **The most accurate approach measured is tree-sitter with queries we wrote: 96.6% on the 18 workbench specimens, 95.5% on 10 held-out samples** (EXECUTED, section 5). Shiki as shipped scores 83.1% and 82.5%. Shiki with the workbench's proposed rules scores 85.2% and 86.0%. Shiki with a further 15 rules of ours scores 88.4% and 87.7%. tree-sitter with its grammars' own queries scores 78.7% and 82.3%. The editor scores 73.5% and 73.4%.
- **In visible colour, under the owner's picks, the order holds:** 97.5% for tree-sitter with our queries, against 87.6% for Shiki as shipped and 92.5% for Shiki with all our rules (EXECUTED).
- **The three levels are real, but three of the owner's four faults were not lexical limits.** Shiki's grammars scoped `0x2A`, the docstring and `install plutosystems` correctly; the theme mapped those scopes to the wrong slots, and the proposed rules fix all three (EXECUTED, section 5.4). Only `Body` is a lexical limit. The Python grammar colours `str` because `str` is on a list of built-in names. `Body` gets only `meta.function.python`, the same scope as the `->` beside it, so no theme rule can colour it alone (EXECUTED). Every tree-sitter variant colours it as a type.
- **The theme-rule treadmill is real, and it stops near 88%.** 26% of the errors left after all our Shiki rules fall on characters that carry no token scope at all: Python 177 of 229, SQL 124 of 176 (EXECUTED). Most of the rest share one scope with text of another slot: `entity.name.function.ts` covers `setInterval` and `onDestroy` alike (EXECUTED, INFERRED).
- **tree-sitter out of the box is worse than Shiki.** Its stock queries are thin. Some are written for the opposite precedence rule from the one tree-sitter-highlight applies, so JSON keys come out as strings and TOML keys as types. Svelte's are written for Neovim (EXECUTED, READ, section 4.3). The accuracy comes from owning the queries, about 190 patterns over 18 languages.
- **The semantic level adds little once the queries are good.** TypeScript's own classifier, laid over Shiki, lifts TypeScript from 82.1% to 93.7%; laid over our queries, it moves TypeScript from 99.3% to 98.8% and TSX from 95.4% to 97.4% (EXECUTED). What our queries still miss (3.4%) is mostly semantic: imported names, module qualifiers such as `fmt.` and `asyncio.`, members used without `this`, constants used by reference, and `printf` verbs.
- **The editor does not colour code as the block does today.** It agrees with the shipped block on 74.2% of characters (EXECUTED). Its Lezer languages score 78.3% and its legacy modes 57.9%. `007`'s aim, "Shiki and CodeMirror then colour the same code the same way", does not hold now, whatever the block uses.
- **Costs.** In the browser, tree-sitter costs 112 KB gzipped for its runtime, plus 2 to 305 KB gzipped per grammar (TypeScript 130, C# 305). Shiki costs 52 KB for its core and 0 to 175 KB per language (TypeScript 15). At build time tree-sitter is faster: 0.39 s for all 18 specimens from a cold start against Shiki's 2.0 s, and 10 ms against 15 ms warm (EXECUTED). 23 of the 26 languages have a tree-sitter WASM file from the grammar's own project. SQL has one only from a third-party build. Swift and Dockerfile have none (EXECUTED, READ).
- **It can ship as source.** shadcn-svelte writes every registry file as UTF-8 text (READ), so a WASM grammar cannot travel as a registry file. It travels as a named npm dependency instead: the app installs it, pins it in its own lockfile, and its server or bundler loads it from its own `node_modules`. Nothing reaches back to this repository (INFERRED). The queries are text, and ours would ship as registry files.
- **Recommended:** highlight code blocks with tree-sitter and queries we write ourselves, with captures named for our slots, for the languages that have a grammar. Keep Shiki as the fallback for the rest. Keep the editor on Lezer for now, and align it in a specification of its own. The owner has one choice to make: where tree-sitter runs (section 8).

## 1. What was tested

The main session's view was put to the test, not assumed. It held that highlighting has three levels, that every fault the owner saw is a lexical limit, and that patching faults with theme rules (`src/lib/workbench/rules.server.ts`) is a treadmill.

Seven candidates were scored, each against the same reference.

| Id | Candidate | Level |
|---|---|---|
| a | Shiki 4.5.0 as shipped: `highlightCode` in `highlighter.ts`, read through `slotOfClass` | lexical |
| b | Shiki with the workbench's proposed rules: `highlightProposed` in `rules.server.ts` | lexical |
| b2 | b plus 15 theme rules of ours (37 selectors), written to fix what scopes allow | lexical |
| c1 | tree-sitter (`web-tree-sitter` 0.27.2), each grammar with its own queries | syntactic |
| c2 | c1 plus query patterns of ours, appended so they win | syntactic |
| d | The editor: CodeMirror's Lezer grammars and legacy modes, through `code-languages.ts` and the editor's own `HighlightStyle` | syntactic and lexical |
| e | TypeScript 6.0.3's semantic classification laid over b, and over c2, for TypeScript-family code | semantic |

## 2. The labelling guide

The reference is only as good as its rules. These rules decide every character, so another person can reproduce the labels. Where the owner has ruled, the ruling is the rule. Where specification `007` mapped a construct to a slot on purpose, its mapping is the slot's definition (EXECUTED in the theme files; READ in `007`).

### 2.1 General

1. **Only non-whitespace characters are scored.** A character no span covers is `foreground`.
2. **`foreground` unless a slot claims it.** Operators, punctuation, brackets, plain variables, parameters, keyword arguments (`frozen=True`, Ruby's `chomp: true` in a call) and prose in markup take the body colour.
3. **A label says what the code is, not what a highlighter can see.** Labels may need semantic knowledge, such as whether a name is imported or a field. That is deliberate: the reference measures accuracy, not reachability.

### 2.2 The owner's rulings

4. **Shell: a command's bare arguments and flags are `foreground`; quoted strings are `string`** (decisions.md, 2026-11-14). `pip` is a command; `install plutosystems` is the body. A bare `0` in `exit 0` or a `case` pattern is an argument, so it is the body too.
5. **A whole numeric literal is `number`**: prefix, suffix, separators, sign where the grammar includes it, exponent and unit. `0x2A`, `3j`, `2_500`, `30_000_000_000L`, `-35.4014` in JSON, `0.75rem`, `4%`, `#c4581b` and the TOML date-time are each one `number`.
6. **A docstring is `string`**, quotes included.
7. **A name in a type position is `type`**: annotations, return types, generic arguments, `extends` and `implements`, casts (`as Channel`), the class in `new X()` or a Python call `Body(...)`, and a class used as a static receiver (`Kind.DWARF`, `String.join`, `Number.parseInt`). Namespaces count as types: module and package names in imports and as qualifiers (`std::`, `fmt.`, `asyncio.`, `java.util`). `None` and `null` in a type position stay `constant`.

### 2.3 Names

8. **Definitions and calls of functions and methods are `function`,** including macros (`write!`) and a method passed as a value (`Body.parse`). A constructor declaration (`public Burn {`) is `function`. TypeScript's `constructor` is `keyword`.
9. **`builtin` is what the language or its runtime defines and the code does not import:** Python's built-in functions and built-in types used as values (`float(...)`, `default_factory=tuple`); JavaScript's global objects that are not classes (`console`, `Math`, `document`) and global functions (`parseInt`, `setInterval`); Go's `make` and `len`; SQL's functions (`COUNT`, `now()`, `CURRENT_DATE`); CSS functions (`var`, `calc`, `oklch`, `url`); shell builtins (`set`, `readonly`, `local`, `printf`, `echo`, `cd`, `exit`); Ruby's Kernel and Module methods (`require`, `puts`, `raise`, `attr_reader`, `Float()`); Svelte's runes (`$state`, `$props`). A global class (`Date`, `Map`, `Error`) is a `type`. A shell command that is not a builtin (`curl`, `date`) is a `function`.
10. **`self` is the receiver:** `self`, `cls`, `this` (a TypeScript `this:` parameter included) and `super`. Rust's `Self` is a `type`.
11. **`constant` holds language constants, enum members and named constants.** `true`, `nil`, `None`, `undefined`, `iota`, Ruby symbols, `...`; enum members and Rust variants (`Some`, `Reading::Missing`); real constants (Rust `const`, Go `const`, Java `static final`, C# `const`, Ruby constants that are not classes) whatever their case; and, in JavaScript, TypeScript and Python, SCREAMING_CASE names. A lowercase `const` binding in JavaScript is the body.
12. **`property` holds keys, attributes and fields:** JSON, YAML and TOML keys (JSON's quotes included); object-literal and hash keys; field declarations (interface members, struct fields, Python dataclass fields, class fields, `#private`); field reads (`frame.seq`, `self.name`), and fields read without `this` (Java `plan`, C# `_passes`); getters and attribute readers (`get size()`, Ruby `rows`); markup attribute names; CSS properties and custom properties (`--board-gap`, also inside `var()`); CSS media features; SQL columns, declared or referenced, and output aliases; YAML anchors and aliases with their `&` and `*`; shell parameter expansions (`$HOME`, `${#failed[@]}`, `$?`), whole, as `007` maps shell variables. A shell assignment's name (`DEST=`) is the body.
13. **Decorators:** the marker and the name are `decorator` (`@logged`, `@dataclass`, Rust's `#` and `derive`); brackets and parentheses are the body; arguments are labelled as code. In C#, `[` and `]` are the body and the attribute name is `decorator`.
14. **Markup:** tag names are `tag` and their angle brackets the body. CSS selectors are `tag` with their `.`, `#` and `:`; so are the keyframe selectors `from` and `to`. TOML table names are `tag`, as `007` maps them. A bare `<` that HTML parses as an error is `invalid`.

### 2.4 Literals, escapes and interpolation

15. **A string includes its quotes and prefix** (`r"`, `f"`, `$"`, backticks). A regular expression is `string` throughout: its groups, classes and `\d` are part of the pattern, not string escapes.
16. **`escape`** holds a string's escape sequences as the language reads them (`\n`, `–`, CSS's `\25CF`) and HTML entities (`&amp;`). It also holds interpolation marks: `${` and `}`, Python's and C#'s braces with their format specifications (`:<8`, `!r`, `:HH:mm`), Ruby's `#{` and `}`, the shell's `$(` and `)` and `$((` and `))`. JSX and Svelte braces count as interpolation marks. So do printf-style verbs in a string passed to a formatter (`%q`, `%.1f`, `%s`), with the escapes the formatter reads (`printf '…\n'`, `echo -e`). The code inside an interpolation is labelled as code.
17. **Comments include their markers.** Shebangs, Ruby's magic comment and C#'s XML doc comment (tags included) are `comment`.

### 2.5 Documents and diffs

18. **Markdown:** the marks that open a construct (`#`, `1.`, `-`, a fence with its info string) and emphasis marks (`**`, `_`, `~~`) are `keyword`. Heading and emphasised text is the body. Inline code is `string` with its backticks. Link text and the URL are `link`; brackets and angle brackets are the body. A block quote is `comment`, as `007` maps it. Table pipes and the delimiter row are the body. A fenced block is labelled in its own language.
19. **YAML:** a plain scalar is a `string`, unless it is a number, a boolean or `null`. The merge key `<<` is `keyword`. A block scalar's text is `string`; its `|` is the body. YAML is labelled as YAML: GitHub Actions' `${{ }}` stays inside the string.
20. **Diff:** headers (`diff --git`, `index`, `---`, `+++`, a context diff's `***` file line) are `comment`. Hunk ranges (`@@ … @@`, `***************`, `*** 1,3 ****`) are `keyword`; the function context after `@@` is the body. Added, removed and changed lines are `inserted`, `deleted` and `changed`, marker included. Context lines are the body: a diff block does not colour the language inside it.

## 3. The reference

**How it was made.** Each specimen was copied by hand into a marked-up file, one span per run of characters with its slot (EXECUTED). A script stripped the marks and checked, line by line, that the remaining non-whitespace characters equal the specimen's, so a typing slip cannot misplace a span. No highlighter's output was used as a start. Spans were typed from the guide alone.

**Bias checks.**

- The ten held-out samples were labelled before any candidate ran on them (EXECUTED).
- After scoring, every character where all five main candidates agree with each other but not with the reference was listed and reviewed (EXECUTED). There were 32 runs on the workbench set and 15 on the held-out set. Each is a label the guide makes on purpose: an imported function (`useMemo`, `dataclass`), a module qualifier (`fmt.`, `re.`), a member used without `this` (C# `Start`), a constant by reference (Go `Critical`), a printf verb (`%.1f`), Svelte's block braces, the `$` of `$1`, `[[` and `]]` as shell keywords, and a Rust struct-variant pattern (`Reading::Voltage { millivolts }`) as an enum member. **No span was corrected.**
- One author wrote both the guide and the labels. A second labeller would measure how reproducible the guide is; that was not done (INFERRED: a threat to validity, section 9).

**What it holds.** The workbench set has 13,244 scored characters in 1,553 spans; the held-out set 3,040 characters in 469 spans (EXECUTED). Across the workbench set, 25% of characters are `foreground`, then `property` 12%, `string` 12%, `type` 11%, `keyword` 10%, `comment` 9%, `function` 6%, `constant` 4%, `tag` 3%, `builtin` 2%, `number` 2%, `escape` 1%, `self` 1% and `decorator` 1%. The diff and link slots and `invalid` hold the rest.

**Format.** Each specimen lists `[line, startColumn, endColumn, slot]`: lines from 1, columns as 0-based UTF-16 offsets within the line, the end exclusive. Each also carries the SHA-256 of its code, so a changed specimen is caught. The file round-trips: grids rebuilt from it equal the grids scored here (EXECUTED).

## 4. How each candidate was run

### 4.1 Scoring

Each candidate's output was turned into a grid of one slot per character, then compared with the reference character by character (EXECUTED). Whitespace is not scored. A candidate that cannot highlight a language would score that language as all body; none needed to (every candidate covered all 18).

### 4.2 Shiki (a, b, b2)

- **a** is `highlightCode`, with each token's class read by `slotOfClass`. **b** is `highlightProposed`. Both are the repository's own code, unchanged (EXECUTED).
- **b2** appends 15 rules (37 selectors) to b's theme, under the same strict JavaScript engine and `tokenClass`. Each targets a scope that the inspection showed to be mis-mapped. For example: Java's import and package segments to `type`; `constant.other.caps` to `constant`; Python's `@property` and C#'s `[Serializable]` to `decorator`; `variable.other.object` to the body; diff ranges to `keyword` and headers to `comment`; tags inside doc comments to `comment`; Markdown link text to `link`; shell arguments inside a Markdown fence to the body; JSON key quotes to `property`; YAML anchors and aliases to `property`; Ruby's `attr_reader` and `raise` to `builtin`; Go's `type` keyword to `keyword`; regular-expression parts to `string`.

### 4.3 tree-sitter (c1, c2)

**The engine.** `web-tree-sitter` parses and runs queries, but has no highlighter. We wrote one (about 170 lines) that follows tree-sitter-highlight, the Rust crate the tree-sitter CLI uses:

- **The last pattern that matches a node wins.** READ, in `crates/highlight/src/highlight.rs` at v0.27.2, lines 1107 to 1130: "keep iterating over any later highlighting patterns that also match this node and set the match to it."
- The innermost highlighted node wins for each character.
- An injected language paints over its host. Characters it leaves unpainted keep the host's colour.
- Locals: a pattern marked `(#is-not? local)` is skipped for a name that resolves to a local definition. We implemented this for the three grammars that ship `locals.scm` (Ruby, JavaScript, TypeScript). Without it, Ruby colours every variable as a method call. With it, Ruby rose from 80.9% to 86.9% (EXECUTED).
- **Simplifications.** A name's highlight is not copied from its definition to its references. Neovim's `#set! priority` is ignored. A last capture whose name the map ignores (`@spell`) leaves the earlier capture in place; tree-sitter-highlight would leave the node uncoloured (READ, line 1132). The tagged-template injection is skipped. The `regex` and `jsdoc` injections are skipped, because those grammars were not loaded.

**The grammars.**

| Language | Grammar, version | Maintained by | Licence | WASM came from | ABI |
|---|---|---|---|---|---|
| TypeScript, TSX | `tree-sitter-typescript` 0.23.2 (with its `tree-sitter-javascript` 0.23.1 queries) | tree-sitter org | MIT | npm package | 14 |
| JavaScript (injected) | `tree-sitter-javascript` 0.25.0 | tree-sitter org | MIT | npm package | – |
| Python | `tree-sitter-python` 0.25.0 | tree-sitter org | MIT | npm package | 15 |
| Rust | `tree-sitter-rust` 0.24.0 | tree-sitter org | MIT | npm package | 14 |
| Go | `tree-sitter-go` 0.25.0 | tree-sitter org | MIT | npm package | 15 |
| Java | `tree-sitter-java` 0.23.5 | tree-sitter org | MIT | npm package | 14 |
| C# | `tree-sitter-c-sharp` 0.23.5 | tree-sitter org | MIT | npm package | 15 |
| Ruby | `tree-sitter-ruby` 0.23.1 | tree-sitter org | MIT | npm package | 14 |
| HTML | `tree-sitter-html` 0.23.2 | tree-sitter org | MIT | npm package | 14 |
| CSS | `tree-sitter-css` 0.25.0 | tree-sitter org | MIT | npm package | 15 |
| Bash | `tree-sitter-bash` 0.25.1 | tree-sitter org | MIT | npm package | 15 |
| JSON | `tree-sitter-json` 0.24.8 | tree-sitter org | MIT | npm package | 14 |
| YAML | `@tree-sitter-grammars/tree-sitter-yaml` 0.7.1 | tree-sitter-grammars (community) | MIT | npm package | 14 |
| TOML | `@tree-sitter-grammars/tree-sitter-toml` 0.7.0 | tree-sitter-grammars (community) | MIT | npm package | 14 |
| Svelte | `@tree-sitter-grammars/tree-sitter-svelte` 1.0.2 | tree-sitter-grammars (community) | MIT | npm package | 14 |
| Markdown (block and inline) | `tree-sitter-markdown` 0.5.4 | tree-sitter-grammars (community) | MIT | GitHub release (npm 0.3.2 has no WASM) | 15 |
| Diff | `tree-sitter-diff` 0.2.0 | tree-sitter-grammars (community) | MIT | GitHub release (not on npm) | 15 |
| SQL | `@derekstride/tree-sitter-sql` (queries 0.3.13 read; an older revision run) | Derek Stride (community) | MIT | a third-party build, `tree-sitter-wasm` 2.0.4 (MIT, with a Sigstore attestation) | 15 |

`web-tree-sitter` 0.27.2 loaded every grammar, ABI 14 and 15 alike (EXECUTED). The SQL WASM predates the 0.3.13 queries: they name a node, `pivot`, that it lacks. So SQL ran with the query file shipped beside that WASM, which is Derek Stride's own query at the matching revision (EXECUTED, READ).

**Which query files run.** Each grammar's `tree-sitter.json` names its query files and their order (READ). TypeScript runs its own `highlights.scm` and then JavaScript's. TSX runs TypeScript's, then JavaScript's JSX file, then JavaScript's. Svelte's query begins `; inherits: html`, a Neovim convention, so the HTML query was put first. Its injections say `; inherits: html_tags`, a Neovim file that does not exist outside Neovim, so HTML's own injections were used instead.

**The capture-to-slot map** (used by c1 and c2 alike; the longest matching dotted prefix wins):

| Captures | Slot |
|---|---|
| `comment`, `comment.documentation` | comment |
| `string`, `string.special`, `string.special.regex`, `string.special.path`, `string.documentation`, `character`, `text.literal` | string |
| `string.escape`, `escape`, `punctuation.special` (outside Markdown) | escape |
| `number`, `float` | number |
| `boolean`, `constant`, `constant.builtin`, `string.special.symbol` | constant |
| `keyword.*`, `conditional`, `repeat`, `include`, `exception`, `storageclass`, `type.qualifier`; CSS's `import`, `media`, `keyframes`, `supports`, `charset`, `namespace`; `punctuation.special` in Markdown | keyword |
| `function`, `function.method`, `function.call`, `function.macro`, `method` | function |
| `function.builtin`, `function.method.builtin` | builtin |
| `variable.builtin` | self for `self`, `cls`, `this`, `super`; builtin otherwise |
| `type`, `type.builtin`, `constructor`, `module` | type |
| `tag` | tag |
| `tag.error` | invalid |
| `attribute` | property in HTML, Svelte and JSX; decorator elsewhere |
| `property`, `property.definition`, `field`, `variable.member`, `string.special.key`, `label` | property |
| `string.special.url`, `text.uri`, `text.reference` | link |
| `diff.plus`, `diff.minus`, `diff.delta` | inserted, deleted, changed |
| `variable`, `variable.parameter`, `parameter`, `operator`, `punctuation.*`, `tag.delimiter`, `embedded`, `none`, `text.title`, `text.emphasis`, `text.strong` | foreground |
| `spell`, `nospell` | not a highlight |

**c2, our query changes.** About 190 distinct patterns were appended across 18 languages, so under the last-wins rule they override the grammar's own (EXECUTED). Python has 27 patterns, TypeScript 20, Rust 19, CSS 14, Java 13, C# 12, Bash 11 and Go 10. The scratch copy was frozen before the held-out run. They name node types and naming conventions, never a specimen's names. Some repair the order of the grammar's own patterns: for example, Python's `(attribute) @property` comes after its method-call pattern and overrides it; JSON's `(string) @string` overrides its key pattern; TSX's JavaScript file overrides the JSX tag patterns. Some add what the stock queries never had: types inside `generic_type` and `binary_operator` annotations, enum members, module paths, decorators as one role, the shell's builtins, its bare arguments as the body, whole parameter expansions, CSS selectors with their marks, and units as numbers. Five keep word lists of built-in names (JavaScript, Python, Go, Ruby, Bash), as the stock queries already do for Python and Go. Two injection changes were made: Svelte's style block goes to CSS, and the diff grammar no longer injects the file's language into hunks.

### 4.4 The editor (d)

Each specimen's language came from `loadLanguage` in `code-languages.ts`: Lezer for 12 of the 18 languages, legacy modes for C#, Ruby, Bash, TOML and diff, and `@replit/codemirror-lang-svelte` 6.0.0 for Svelte (EXECUTED). An `EditorState` was parsed in full with `ensureSyntaxTree`. It was coloured by `@lezer/highlight` 1.2.5's `highlightTree` with the editor's own `HighlightStyle`, taken from `codeHighlight` in `code-editor-theme.ts`. Each class's slot was read from its spec's `var(--code-*)`. Where two classes set a colour, the later spec wins, as CSS order would. The Python roles plugin needs a live view, so its three rules were re-run over the same tree: `self` and `cls`, built-ins, and docstrings to `comment`. That is the editor's real behaviour, recreated without a DOM (EXECUTED).

### 4.5 The semantic level (e)

TypeScript 6.0.3's language service classified each TypeScript, TSX and JavaScript specimen, in the 2020 token format (`getEncodedSemanticClassifications`, `TwentyTwenty`) that VS Code reads (EXECUTED). Classes, interfaces, enums, type parameters and namespaces went to `type`; enum members to `constant`; properties to `property`; functions and methods to `function`, or to `builtin` when defined by the standard library; standard-library variables to `builtin`; read-only SCREAMING_CASE names to `constant`; parameters and other variables to the body. Those labels replaced the base candidate's on the identifiers the service classified, as VS Code lays semantic tokens over TextMate scopes.

## 5. Results

### 5.1 Overall

| Candidate | Workbench, 18 specimens | Visible, owner's picks | Held-out, 10 samples | Visible, owner's picks |
|---|---|---|---|---|
| a. Shiki as shipped | 83.1% | 87.6% | 82.5% | 86.7% |
| b. Shiki + proposed rules | 85.2% | 89.7% | 86.0% | 90.2% |
| b2. Shiki + proposed + our 15 rules | 88.4% | 92.5% | 87.7% | 92.8% |
| c1. tree-sitter, stock queries | 78.7% | 83.8% | 82.3% | 89.5% |
| **c2. tree-sitter, our queries** | **96.6%** | **97.5%** | **95.5%** | **96.5%** |
| d. The editor (Lezer and legacy) | 73.5% | 78.4% | 73.4% | 79.0% |
| e. TypeScript semantic over b | 86.5% | 90.3% | 87.1% | 91.1% |
| e. TypeScript semantic over c2 | 96.6% | 97.6% | 95.7% | 96.7% |

All EXECUTED. Every candidate covered every specimen.

### 5.2 By language (workbench set)

| Language | Characters | a | b | b2 | c1 | c2 | d | e over b | e over c2 |
|---|---|---|---|---|---|---|---|---|---|
| TypeScript | 1,206 | 82.1 | 82.1 | 87.3 | 91.6 | 99.3 | 86.3 | 93.7 | 98.8 |
| TSX | 583 | 92.1 | 92.1 | 93.1 | 88.5 | 95.4 | 93.5 | 95.9 | 97.4 |
| Python | 1,080 | 66.7 | 73.2 | 78.8 | 78.9 | 97.0 | 71.2 | 73.2 | 97.0 |
| Rust | 1,058 | 81.9 | 82.0 | 84.3 | 84.6 | 99.0 | 80.4 | 82.0 | 99.0 |
| Go | 824 | 90.7 | 90.7 | 92.1 | 84.3 | 95.9 | 83.9 | 90.7 | 95.9 |
| Java | 1,151 | 82.4 | 82.4 | 90.0 | 88.8 | 97.3 | 74.8 | 82.4 | 97.3 |
| C# | 833 | 86.4 | 86.4 | 83.8 | 81.3 | 94.2 | 63.0 | 86.4 | 94.2 |
| Ruby | 807 | 78.7 | 78.7 | 83.0 | 86.9 | 98.5 | 57.7 | 78.7 | 98.5 |
| Svelte | 782 | 84.4 | 84.4 | 85.3 | 79.0 | 96.3 | 83.4 | 84.4 | 96.3 |
| HTML | 827 | 96.0 | 96.0 | 96.0 | 85.6 | 93.0 | 93.1 | 96.0 | 93.0 |
| CSS | 560 | 89.3 | 89.3 | 93.0 | 68.6 | 94.3 | 63.6 | 89.3 | 94.3 |
| SQL | 537 | 67.2 | 67.2 | 67.2 | 69.5 | 96.3 | 61.5 | 67.2 | 96.3 |
| Bash | 736 | 61.5 | 87.4 | 87.4 | 70.8 | 96.9 | 53.0 | 87.4 | 96.9 |
| YAML | 501 | 93.2 | 93.2 | 98.6 | 98.6 | 98.6 | 58.9 | 93.2 | 98.6 |
| JSON | 346 | 91.3 | 91.3 | 100.0 | 54.3 | 98.8 | 97.1 | 91.3 | 98.8 |
| TOML | 391 | 100.0 | 100.0 | 100.0 | 50.4 | 96.2 | 72.1 | 100.0 | 96.2 |
| Markdown | 466 | 83.9 | 89.7 | 95.1 | 79.0 | 99.6 | 67.4 | 89.7 | 99.6 |
| Diff | 556 | 90.6 | 90.6 | 98.0 | 20.7 | 88.8 | 47.1 | 90.6 | 88.8 |

The held-out set, by language (a / b / b2 / c1 / c2 / d): Python 71.1 / 85.5 / 87.5 / 76.7 / 96.1 / 73.3; JavaScript 94.1 / 94.1 / 94.1 / 89.8 / 97.4 / 83.6; TypeScript 93.4 / 93.4 / 90.2 / 94.3 / 96.3 / 93.4; Bash 71.6 / 86.7 / 86.7 / 74.5 / 93.5 / 51.8; SQL 78.2 / 78.2 / 78.2 / 75.6 / 100.0 / 76.3; Go 89.5 / 91.8 / 93.4 / 80.9 / 94.9 / 81.3; Rust 86.3 / 86.3 / 90.8 / 79.7 / 98.5 / 74.2; Java 78.5 / 78.5 / 84.4 / 82.3 / 92.0 / 69.4; C# 77.7 / 77.7 / 80.7 / 78.8 / 89.1 / 62.6; Ruby 88.0 / 88.0 / 92.1 / 90.6 / 98.5 / 65.8 (EXECUTED).

**Worst languages** (workbench set). Shiki as shipped: Bash 61.5, Python 66.7, SQL 67.2. With the proposed rules: SQL 67.2, Python 73.2, Ruby 78.7. tree-sitter stock: diff 20.7, TOML 50.4, JSON 54.3. Our queries: diff 88.8, HTML 93.0, C# 94.2. The editor: diff 47.1, Bash 53.0, Ruby 57.7.

Shiki leads on HTML (96.0 against 93.0) and TOML (100 against 96.2), and our rules bring its JSON and diff to 100 and 98. Lexical grammars do well on data and markup, where position is all there is to know (INFERRED).

### 5.3 By slot (workbench set), recall / precision

| Slot | Characters | a | b2 | c1 | c2 | d |
|---|---|---|---|---|---|---|
| foreground | 3,341 | 86.6 / 74.5 | 96.7 / 77.5 | 90.2 / 70.7 | 96.6 / 94.0 | 88.6 / 58.6 |
| property | 1,619 | 71.3 / 84.0 | 68.8 / 95.5 | 60.0 / 79.6 | 93.9 / 95.3 | 67.8 / 80.0 |
| string | 1,525 | 87.1 / 83.7 | 95.0 / 98.9 | 93.5 / 80.7 | 99.3 / 96.8 | 81.2 / 87.9 |
| type | 1,432 | 73.8 / 89.9 | 80.7 / 93.5 | 80.2 / 78.3 | 98.2 / 97.6 | 58.3 / 90.5 |
| keyword | 1,349 | 92.6 / 85.1 | 95.6 / 93.8 | 91.5 / 96.3 | 99.5 / 95.7 | 91.5 / 85.9 |
| comment | 1,129 | 97.2 / 94.2 | 99.9 / 100 | 80.8 / 100 | 99.6 / 100 | 84.3 / 89.0 |
| function | 807 | 90.6 / 82.8 | 90.6 / 82.8 | 84.3 / 73.0 | 91.7 / 97.8 | 50.6 / 81.9 |
| constant | 472 | 56.6 / 66.6 | 69.1 / 70.9 | 63.1 / 64.4 | 92.6 / 100 | 30.9 / 41.5 |
| tag | 391 | 94.1 / 91.5 | 94.1 / 94.8 | 52.4 / 99.0 | 96.2 / 99.5 | 59.1 / 76.7 |
| builtin | 299 | 38.1 / 83.2 | 45.8 / 81.1 | 21.4 / 100 | 94.3 / 100 | 17.7 / 60.9 |
| number | 237 | 95.8 / 99.6 | 97.5 / 99.6 | 71.3 / 87.6 | 94.9 / 100 | 88.6 / 99.1 |
| escape | 177 | 74.0 / 87.9 | 74.0 / 87.9 | 25.4 / 55.6 | 71.8 / 92.0 | 14.1 / 100 |
| self | 119 | 91.6 / 93.2 | 91.6 / 93.2 | 71.4 / 100 | 100 / 100 | 79.0 / 100 |
| inserted | 107 | 97.2 / 100 | 97.2 / 100 | 18.7 / 100 | 100 / 100 | 100 / 83.6 |
| decorator | 93 | 45.2 / 100 | 65.6 / 100 | 57.0 / 30.8 | 100 / 100 | 35.5 / 27.7 |
| link | 65 | 81.5 / 100 | 100 / 100 | 100 / 97.0 | 100 / 97.0 | 100 / 94.2 |
| deleted | 48 | 95.8 / 100 | 95.8 / 100 | 14.6 / 46.7 | 100 / 100 | 100 / 47.5 |
| changed | 33 | 93.9 / 100 | 93.9 / 100 | 93.9 / 100 | 100 / 100 | 0 / – |
| invalid | 1 | 100 / 100 | 100 / 100 | 0 / – | 0 / – | 0 / – |

All EXECUTED. b's slot figures equal a's except foreground (93.1 / 75.9), string (91.5 / 97.1), comment (97.2 / 100) and number (97.5 / 99.6).

**Worst slots.** Shiki as shipped: `builtin` 38.1, `decorator` 45.2, `constant` 56.6. tree-sitter stock: `deleted` 14.6, `inserted` 18.7, `builtin` 21.4, `escape` 25.4. Our queries: `escape` 71.8 (printf verbs, Rust's `{}`, CSS escapes the grammar does not split), `function` 91.7 (imported names), `constant` 92.6 (constants by reference). The editor: `escape` 14.1, `builtin` 17.7, `constant` 30.9.

### 5.4 The owner's four faults

| Fault | Reference | a | b | b2 | c1 | c2 | d |
|---|---|---|---|---|---|---|---|
| `0x2A` | number | keyword + number | number | number | number | number | number |
| The docstring | string | comment | string | string | string | string | comment |
| `install plutosystems` | foreground | string | foreground | foreground | foreground | foreground | foreground |
| `Body` in `-> Body \| None` | type | foreground | foreground | foreground | type | type | foreground |

EXECUTED. The first three were the theme's choices: the grammar scoped `0x` as `storage.type.number`, the docstring as `string.quoted.docstring` and the argument as `string.unquoted.argument.shell`, and the shipped theme mapped each to the wrong slot. The fourth is the grammar's limit. In `def parse(cls, line: str) -> Body | None:`, Shiki's Python grammar scopes `str` as `support.type.python` and `Body` as `meta.function.python` alone (EXECUTED). In `registry: ClassVar[dict[str, Body]]` it gives `ClassVar` and `Body` no token scope at all. `str` is coloured because it is on the grammar's list of built-in names, not because it stands in a type position.

### 5.5 The most common mistakes

- **Shiki as shipped:** `property` read as the body, 385 characters (SQL 104, Rust 84); the body read as `string`, 234 (Bash 190, Markdown 40); `type` read as the body, 176 (Python 116); the body read as `property`, 117 (TypeScript 68: `variable.other.object` sends `match.` and `descriptor.` to `property`); `constant` read as the body, 111; `type` read as `keyword`, 98 (Java's import paths, scoped `storage.modifier.import`).
- **Shiki with the proposed rules:** the same, without the Bash and Markdown string error and the docstring error.
- **Shiki with all our rules:** `property` read as the body, 433 (SQL 104, C# 85); `type` read as the body, 208 (Python 116); the body read as `constant`, 91 (Ruby's keyword arguments and TypeScript's lowercase `const`s, which share scopes with true constants); `builtin` read as `function`, 73 (Svelte's runes and `setInterval` share `entity.name.function`).
- **tree-sitter, stock queries:** `property` read as the body, 335 (C# 92, SQL 57); `type` read as the body, 271 (Java 89, Python 62); `builtin` read as `function`, 166; `property` read as `string`, 157 (every JSON key); `property` read as `type`, 116 (every TOML key).
- **tree-sitter, our queries:** `property` read as the body, 79 (C#'s members used without `this`, 47); the body read as `keyword`, 60 (the diff's function context, 54); `function` read as the body, 50 (imported functions); `escape` read as `string`, 43 (printf verbs and CSS escapes).
- **The editor:** `type` read as the body, 490 (Java 128, Python 113, C# 99); `property` read as the body, 489 (SQL 139, Bash 106); `constant` read as the body, 242; `function` read as the body, 235 (C# 60 and Java 46, legacy and Lezer alike); `string` read as the body, 212 (YAML's plain scalars, 182: Lezer's YAML leaves them untagged, as `007` recorded).

### 5.6 What is left, by level

The 3.4% our queries still miss falls into three groups (EXECUTED for the list, INFERRED for the level).

- **Semantic: needs name resolution.** Imported names (`useMemo`, `dataclass`, `onDestroy`); module qualifiers in expressions (`re.compile`, `fmt.Errorf`, `time.Now`); members used without `this` (Java `plan`, C# `_passes`, `Start`); constants used by reference (Go `Critical`); Ruby's attribute readers; a component that is a function (`SubsystemRow`). Only a language server knows these. TypeScript's own classifier fixes the TypeScript cases (section 5.1).
- **Beyond the parser's view.** Printf verbs (`%q`, `%.1f`) are plain string text to every grammar; knowing them needs the callee. Rust's `{}` sits in a macro's token tree.
- **Grammar limits.** HTML's grammar recovers from the bare `<` by reading it as a tag; CSS's grammar has no node for an escape inside a string; JSON's grammar splits `–` into two tokens.

## 6. Costs

### 6.1 Install, build time and the browser

| | Shiki 4.5.0 | tree-sitter (web-tree-sitter 0.27.2 + grammars) | The editor (CodeMirror, Lezer) |
|---|---|---|---|
| On disk, as installed | 17.7 MB (`shiki` and `@shikijs/*`) | 274 MB for the 17 grammar packages and the runtime: npm packages carry C sources and native prebuilds besides the WASM | about 11 MB (`@codemirror`, `@lezer`, `@replit`) |
| WASM or grammar files alone | 26 language modules | 17.2 MB raw, 1.7 MB gzipped, for the 20 grammars run here | – |
| 18 specimens, fresh process, first pass | 2.0 s (TypeScript alone 950 ms: core start and grammar compile) | 0.39 s | 25 ms to parse and colour, languages loaded |
| 18 specimens, warm | 15 ms | 10 ms | – |
| Runs in the browser | yes: core and JavaScript engine 52 KB gzipped | yes: runtime 81 KB WASM + 31 KB JavaScript, gzipped | yes, as today |

All EXECUTED. Timings are the median of five fresh runs each. Shiki's five first passes spread under 2%; one of tree-sitter's took 460 ms against a median of 386 ms.

**Per language, gzipped, as the browser would fetch it** (EXECUTED; Shiki's figure includes the languages it embeds):

| Language | Shiki | tree-sitter WASM |
|---|---|---|
| TypeScript / TSX | 15 / 15 KB | 130 / 133 KB |
| JavaScript | 15 KB | 48 KB |
| Python | 8 KB | 63 KB |
| Rust | 2 KB | 111 KB |
| Go | 4 KB | 37 KB |
| Java | 4 KB | 49 KB |
| C# | 10 KB | 305 KB |
| Ruby | 175 KB | 157 KB |
| HTML | 38 KB | 7 KB |
| CSS | 12 KB | 21 KB |
| SQL | 7 KB | 298 KB |
| Bash | 5 KB | 173 KB |
| YAML / JSON / TOML | 2 / 0 / 1 KB | 33 / 2 / 7 KB |
| Markdown | 5 KB | 60 + 61 KB (block and inline) |
| Svelte | 45 KB | 13 KB (plus the TypeScript and CSS it injects) |
| Diff | under 1 KB | 10 KB |

INFERRED: a page that streams one language through tree-sitter fetches 112 KB of runtime plus that grammar, once, and caches both. A prerendered page fetches nothing, as today.

### 6.2 Coverage of the 26 languages `highlighter.ts` lists

| WASM from the grammar's own project on npm (21) | bash, c, cpp, csharp, css, go, html, java, javascript, json, jsx (the JavaScript grammar), kotlin, php, python, ruby, rust, svelte, toml, tsx, typescript, yaml |
|---|---|
| WASM only in a GitHub release (2) | markdown (tree-sitter-grammars 0.5.4; npm's 0.3.2 has none), diff (tree-sitter-grammars 0.2.0) |
| No first-party WASM (3) | sql (a third-party build only), swift (alex-pinkus 0.7.1 builds at install), docker (camdencheek's grammar has no npm package and no release asset) |

EXECUTED by installing each package and listing its files; READ for the GitHub releases. C, C++ and PHP are from the tree-sitter org; Kotlin, YAML, TOML, Svelte, Markdown and diff from the community org tree-sitter-grammars. `@tree-sitter-grammars/tree-sitter-kotlin` 1.1.0 ships no queries at all, so its queries would be ours anyway. We did not build any WASM ourselves; doing so needs the tree-sitter CLI and a WebAssembly toolchain, which were not run here.

### 6.3 Embedded languages

- **Shiki** embeds by grammar: HTML carries JavaScript and CSS, Svelte carries TypeScript and CSS, and Markdown fences carry many languages. That is why its Ruby module is 175 KB: it imports twelve others, from HTML and SQL to Lua and YAML (EXECUTED for sizes; READ in `@shikijs/langs/dist/ruby.mjs`).
- **tree-sitter** leaves injections to the host. Ours handled HTML's script and style, Svelte's script (`lang="ts"`), style and expressions, Markdown's fences and inline text, and Rust's macros, in about 30 lines (EXECUTED). Each injected language is one more grammar to load. Svelte's stock injection rules send its style block to JavaScript, because their generic `(raw_text)` rule outranks HTML's style rule under last-wins (EXECUTED); c2 corrects it with one rule.
- **The editor** nests JavaScript in HTML (EXECUTED). Its Markdown, loaded through `language-data` without `codeLanguages`, leaves a fenced block as one string (EXECUTED: the Bash fence came out all `string`).

### 6.4 Licences

Shiki, `@shikijs/*`, `web-tree-sitter`, every grammar above, CodeMirror and Lezer are MIT (READ in each package's licence file). TypeScript is Apache-2.0, as this repository is. The third-party SQL build is MIT. No GPL or other copyleft code was found in the candidates.

### 6.5 Shipping it through the registry as source

- **WASM cannot be a registry file.** shadcn-svelte 1.7.1's `add` writes each file's `content` with `writeFile(…, "utf8")` (READ, `dist/index.mjs`). A binary file would arrive corrupted. Inlining a grammar as base64 text would turn TypeScript's 1.4 MB WASM into about 1.8 MB of source (INFERRED from the raw size).
- **WASM travels as a dependency.** The item names `web-tree-sitter` and each grammar package in its `dependencies`, as `004` and `007` name `shiki`. The app installs them, and its `bun.lock` pins them (INFERRED from constitution §4.6). At prerender, the app's server reads each `.wasm` from its own `node_modules`. In the browser, the app's bundler emits it as an asset of the app, for example through Vite's `?url` import (INFERRED). Nothing the app installs reaches back to this repository at run time, which keeps §4.1.
- **Two languages have WASM only in a GitHub release.** Markdown's npm package (0.3.2) has no WASM, and diff's grammar is not on npm at all. An app could not install either as a pinned dependency today. They would stay on Shiki, or wait for those projects to publish (INFERRED). SQL's only WASM is in the third-party `tree-sitter-wasm` package (MIT, Sigstore-attested, 121 MB unpacked); whether to depend on it is a judgment for the specification.
- **Queries are text.** Ours would ship as registry files beside the highlighter, as `.scm` files or as TypeScript strings. An app owns and edits them like any other source (INFERRED).
- **Ours, or the grammars'?** Depending on a package's own `highlights.scm` is using a dependency as meant, not copying it. But c2 shows those files are a poor base. Several fight the precedence rule; some are written for Neovim; and their patterns' order changes between versions (EXECUTED, READ). **We would write our own queries,** with capture names that are our slot names (`@type`, `@property`), so no capture-to-slot map is needed (INFERRED). The stock queries are prior art: read and measured, never copied.

### 6.6 Would the editor colour code as the blocks do?

No, not today, and not after a change of block engine alone (EXECUTED). The editor agrees with the shipped block on 74.2% of characters, and with tree-sitter and our queries on 74.4%. Under the owner's picks the figures are 78.8% and 79.2%. Its Lezer languages score 78.3%; its legacy modes 57.9%.

INFERRED: two routes would align it.

- **Lezer `styleTags` of our own,** language by language, the editor's version of c2's queries. Lezer is syntactic, so this can close much of the gap for the 18 Lezer languages, but not for the eight legacy modes, which have no tree. Python already works this way in `pythonLanguageConfigured`.
- **Colour the editor with tree-sitter,** through a view plugin that parses with `web-tree-sitter` and paints decorations from the same queries. Lezer would keep indentation, folding and bracket matching. The editor and the block would then colour code identically by construction, at the cost of a second parser in the editor.

Neither was measured here.

## 7. Recommendation

- **Engine.** Code blocks highlight with tree-sitter (`web-tree-sitter`, pinned) and the grammars of section 4.3, each a named, pinned npm dependency of the highlighter item.
- **Queries.** We write our own `highlights.scm` per language, from this memo's guide, with captures named for our slots. c2's measured patterns are the starting knowledge, not the text. Injections are our own small rule set: script and style in HTML and Svelte, Svelte expressions, Markdown fences and inline text.
- **Which languages.** The 21 with a first-party WASM on npm: Bash, C, C++, C#, CSS, Go, HTML, Java, JavaScript, JSON, JSX, Kotlin, PHP, Python, Ruby, Rust, Svelte, TOML, TSX, TypeScript and YAML.
- **What falls back.** Markdown, diff, SQL, Swift and Dockerfile stay on Shiki with the proposed rules and ours (b2), until a first-party WASM is on npm. On these specimens Shiki b2 scored 95.1% on Markdown and 98.0% on diff; on SQL it stays at 67.2%, because Shiki gives SQL's columns no scope (EXECUTED).
- **The editor.** It stays on Lezer for now. A specification of its own aligns it, by our own `styleTags` first, measured against this reference.
- **What an app gives up.** An app that highlights in the browser fetches about 112 KB gzipped of runtime once, plus 2 to 305 KB per language it shows, against Shiki's 0 to 175 KB. A prerendered page costs nothing extra. Development installs grow by about 270 MB, because grammar packages carry their C sources. Two engines stay in the item until the fallback languages have WASM. The editor's colours keep differing from the block's until its own specification lands.

## 8. A question for the owner

**Where should the tree-sitter highlighter run?**

1. **(Recommended) At prerender and in the browser.** One engine colours every code block, static or streamed. A page that highlights in the browser, such as the chat pane streaming code, fetches the 112 KB runtime and each grammar it shows, once (TypeScript 130 KB, Python 63 KB, Bash 173 KB, gzipped). Accuracy as measured: 96.6%.
2. **At prerender only.** Blocks rendered on the server use tree-sitter. Code highlighted in the browser keeps Shiki with all our rules. No new browser weight. The same code would colour differently streamed and static: the two engines agree on 88.3% of characters, 92.4% under the owner's picks (EXECUTED).
3. **Stay on Shiki.** Adopt the proposed rules and ours (88.4%). No new dependency, and `Body` stays plain.

## 9. What this memo does not settle

- **One labeller.** The guide and both sets were written by one author. A second labeller's agreement with the reference would measure how reproducible the guide is.
- **Guide choices move the numbers.** Labelling members, SQL columns and shell expansions as `property` costs every lexical candidate. Visible accuracy under the owner's picks, where `property` is the body, is the check on that. The ranking does not change under it.
- **Tuning.** c2 and b2 were tuned on the workbench set. The held-out set comes from the same author and the same code base, so it tests generalisation within one style, not across code in the wild.
- **Our engine is not tree-sitter-highlight itself.** It follows the crate's rules as read (section 4.3), with the stated simplifications. A specification would test the chosen engine against this reference again.
- **One machine** produced every timing.

## Sources

- tree-sitter-highlight, `crates/highlight/src/highlight.rs` at tag v0.27.2, lines 1107 to 1132: https://github.com/tree-sitter/tree-sitter/blob/v0.27.2/crates/highlight/src/highlight.rs. Read 2026-11-14.
- GitHub releases of `tree-sitter-grammars/tree-sitter-markdown` (v0.5.4), `tree-sitter-grammars/tree-sitter-diff` (v0.2.0), `DerekStride/tree-sitter-sql` (v0.3.13, source only) and `camdencheek/tree-sitter-dockerfile` (v0.2.0, no assets), through the GitHub API. Read 2026-11-14.
- The npm registry's metadata for every package named here, through `bun pm view` and the registry's search API. Read 2026-11-14.
- `tree-sitter-wasm` 2.0.4 on unpkg: its file listing, `manifest.json`, `README.md` and `LICENSE`. Read 2026-11-14.
- Package files read in the scratch installs: each grammar's `tree-sitter.json`, `queries/*.scm` and licence file; shadcn-svelte 1.7.1's `dist/index.mjs`.
- This repository: `src/lib/registry/lib/highlighter.ts`, `src/lib/workbench/rules.server.ts`, `src/lib/workbench/palette.ts`, `src/lib/workbench/specimens.ts`, `src/lib/preview/code-samples.ts`, `src/lib/registry/lib/code-languages.ts`, `src/lib/registry/ui/code-editor/code-editor-theme.ts`, `src/lib/registry/ui/code-editor/code-editor-python.ts`, `src/lib/registry/hooks/use-highlighted-code.svelte.ts`, [`../specifications/004-code-and-data.md`](../specifications/004-code-and-data.md), [`../specifications/007-the-full-highlight-palette-and-the-ink-surface.md`](../specifications/007-the-full-highlight-palette-and-the-ink-surface.md), [`../decisions.md`](../decisions.md) (2026-11-14), [`2026-10-31-shiki-and-a-token-highlight-palette.md`](2026-10-31-shiki-and-a-token-highlight-palette.md), [`2026-11-14-syntax-colours-without-amber-or-cyan.md`](2026-11-14-syntax-colours-without-amber-or-cyan.md).
