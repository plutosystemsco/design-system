; Kotlin, for @tree-sitter-grammars/tree-sitter-kotlin 1.1.0 (node types read
; from its src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

; ALL_CAPS names read as constants where they stand as a value or the name
; being assigned (`const val BUDGET`). This comes first, so the declaration,
; call and annotation patterns below take those positions back.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

[(line_comment) (block_comment) (shebang)] @comment

; The language's words, the soft and modifier ones included where the
; grammar marks them, and the word operators.
[
  "abstract" "actual" "annotation" "as" "as?" "by" "catch" "class"
  "companion" "const" "constructor" "crossinline" "data" "delegate" "do"
  "dynamic" "else" "enum" "expect" "external" "field" "file" "final"
  "finally" "for" "fun" "get" "if" "import" "in" "!in" "infix" "init"
  "inline" "inner" "interface" "internal" "is" "!is" "lateinit" "noinline"
  "object" "open" "operator" "out" "override" "package" "param" "private"
  "property" "protected" "public" "receiver" "return" "return@" "sealed"
  "set" "setparam" "super" "super@" "suspend" "tailrec" "this" "this@"
  "throw" "try" "typealias" "val" "value" "var" "vararg" "when" "where"
  "while"
] @keyword
(reification_modifier) @keyword

; The grammar reads `true`, `false` and `null` as names; the language fixes them.
((identifier) @constant
  (#any-of? @constant "true" "false" "null"))

[(number_literal) (float_literal)] @number

[(string_literal) (multiline_string_literal) (character_literal)] @string
(escape_sequence) @special

; `${ … }`: the code inside returns to the body, the marks are interpolation.
(interpolation) @text
(interpolation "${" @special)
(interpolation "}" @special .)
; A bare `$name`: the grammar splits off the `$`; it is marked, the name
; after it stays in the string.
((string_content) @special
  .
  (string_content) @string
  (#eq? @special "$")
  (#match? @string "^[A-Za-z_]"))

; Types: every name a type holds, its package plain (`kotlin.collections.List`).
(user_type (identifier) @type)
(user_type (identifier) @text (#match? @text "^[a-z]"))
[
  (class_declaration name: (identifier) @type)
  (object_declaration name: (identifier) @type)
  (type_alias (identifier) @type)
  (type_parameter (identifier) @type)
]

; Functions: declared and called. A capitalised callee is a constructor
; (`Run("darts")`): functions are lowerCamel by convention.
[
  (function_declaration name: (identifier) @function)
  (call_expression . (identifier) @function)
]
(call_expression
  . (navigation_expression "." (identifier) @function .))
((call_expression . (identifier) @type)
  (#match? @type "^[A-Z]"))
(navigation_expression "::" (identifier) @function .)

; A capitalised receiver is a class or object (`Math.max`, `Kind.DWARF`'s
; `Kind`); an ALL_CAPS one stays a constant.
((navigation_expression . (identifier) @type)
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))
((navigation_expression "::" (identifier) @keyword .)
  (#eq? @keyword "class"))

; Packages and imports stay plain; a capitalised name in an import is the
; class it brings in.
((import (qualified_identifier (identifier) @type))
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))

; Enum entries.
(enum_entry . (identifier) @constant)

; Annotations: the `@`, any use-site target and the name. Arguments are code.
(annotation "@" @meta)
(use_site_target) @meta
(annotation (user_type (identifier) @meta))
(annotation (constructor_invocation (user_type (identifier) @meta)))
(file_annotation "@" @meta)
(file_annotation (user_type (identifier) @meta))
(file_annotation (constructor_invocation (user_type (identifier) @meta)))
