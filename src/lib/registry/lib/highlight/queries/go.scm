; Go, for tree-sitter-go 0.25.0 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

(comment) @comment

; Literals. A struct tag is a raw string and stays one; escapes live only
; in the interpreted kind. The language's own values are constants.
[(raw_string_literal) (interpreted_string_literal) (rune_literal)] @string
(interpreted_string_literal (escape_sequence) @special)
[(imaginary_literal) (float_literal) (int_literal)] @number
[(nil) (iota) (true) (false)] @constant

; Keywords: declarations, then control flow, then the type words.
[
  "package" "import" "func" "var" "const" "type" "struct" "interface"
] @keyword
[
  "if" "else" "for" "range" "switch" "case" "default" "select" "break"
  "continue" "return" "goto" "fallthrough" "defer" "go"
] @keyword
["map" "chan"] @keyword

; Types: every name in a type position, a type parameter where it is
; declared, and the type after the package in `time.Duration`. A package,
; as a qualifier or in its clause, is the body.
[
  (type_identifier) @type
  (type_parameter_declaration name: (identifier) @type)
]

; A name in capitals is a constant where it is read or assigned.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; An enumeration: a const block counted with iota. Its first spec holds
; iota (alone or in an expression), and every spec of the block names a
; member, the blank `_` aside. A plain constant (`const budget = 3`) stays
; in the body.
(const_declaration
  (const_spec
    name: (identifier) @constant
    value: (expression_list [(iota) (binary_expression (iota))]))
  (#not-eq? @constant "_"))
(const_declaration
  (const_spec
    value: (expression_list [(iota) (binary_expression (iota))]))
  (const_spec name: (identifier) @constant)
  (#not-eq? @constant "_"))

; Functions and methods where they are declared, in an interface included.
[
  (function_declaration name: (identifier) @function)
  (method_declaration name: (field_identifier) @function)
  (method_elem name: (field_identifier) @function)
]

; Every call is a function, capitalised or not, a built-in included
; (`make`, `len`, `append`). Syntax cannot tell a conversion from a call.
(call_expression
  function: [
    (identifier) @function
    (selector_expression field: (field_identifier) @function)
    (parenthesized_expression (identifier) @function)
  ])

; A conversion to one of the language's own types reads as the type.
(call_expression
  function: (identifier) @type
  (#any-of? @type
    "bool" "byte" "rune" "string" "error" "any" "int" "int8" "int16" "int32"
    "int64" "uint" "uint8" "uint16" "uint32" "uint64" "uintptr" "float32"
    "float64" "complex64" "complex128"))
