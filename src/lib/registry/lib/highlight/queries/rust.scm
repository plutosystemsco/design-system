; Rust, for tree-sitter-rust 0.24.0 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

; Comments, doc comments with their markers, and a shebang line.
[(line_comment) (block_comment) (shebang)] @comment

; Literals. A negative literal in a pattern keeps its sign.
[(string_literal) (raw_string_literal) (char_literal)] @string
(escape_sequence) @special
[(integer_literal) (float_literal) (negative_literal)] @number
(boolean_literal) @constant

; Keywords, storage words and modifiers.
[
  "fn" "let" "const" "static" "struct" "enum" "union" "trait" "type" "impl"
  "mod" "use" "extern" "pub" "where" "dyn" "unsafe" "async" "await" "move"
  "ref" "default" "gen"
] @keyword
[
  "if" "else" "match" "loop" "while" "for" "in" "break" "continue" "return"
  "yield" "as" "try"
] @keyword
"macro_rules!" @keyword
[(mutable_specifier) (self) (super) (crate)] @keyword

; Types: every name the grammar puts in a type position, and the built-ins.
[(primitive_type) (type_identifier)] @type
(scoped_type_identifier
  path: (identifier) @type
  (#match? @type "^[A-Z]"))
(fragment_specifier) @type

; A name in capitals is a constant where it is read or assigned. The
; definitions, callees and types below come later and keep their own roles.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; Definitions.
(function_item name: (identifier) @function)
(function_signature_item name: (identifier) @function)
(enum_variant name: (identifier) @constant)
[
  (const_item name: (identifier) @constant)
  (static_item name: (identifier) @constant)
]

; Calls, plain, through a field and through a path, with or without a
; turbofish.
(call_expression
  function: [
    (identifier) @function
    (field_expression field: (field_identifier) @function)
    (scoped_identifier name: (identifier) @function)
  ])
(generic_function
  function: [
    (identifier) @function
    (field_expression field: (field_identifier) @function)
    (scoped_identifier name: (identifier) @function)
  ])

; Paths. A module is the body; a capitalised segment, or a built-in type
; used as a path (`f64::from`), is a type. A lowercase name after a type is
; an associated function, called or passed as a value.
(scoped_identifier
  path: (identifier) @type
  (#match? @type "^[A-Z]"))
(scoped_identifier
  path: (identifier) @type
  (#any-of? @type
    "bool" "char" "str" "f32" "f64" "i8" "i16" "i32" "i64" "i128" "isize"
    "u8" "u16" "u32" "u64" "u128" "usize"))
(scoped_identifier
  name: (identifier) @type
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))
(scoped_identifier
  path: (identifier) @type
  name: (identifier) @function
  (#match? @type "^[A-Z]")
  (#match? @function "^[a-z_]"))
(use_list
  (identifier) @type
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))
(use_as_clause
  path: (identifier) @type
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))

; A capitalised callee or tuple-struct pattern is a type (`Point(1, 2)`).
(call_expression
  function: (identifier) @type
  (#match? @type "^[A-Z]"))
(tuple_struct_pattern
  type: (identifier) @type
  (#match? @type "^[A-Z]"))

; `Type::Variant`, both segments capitalised: the variant is a constant,
; called, matched or built with fields.
(scoped_identifier
  path: (identifier) @type
  name: (identifier) @constant
  (#match? @type "^[A-Z]")
  (#match? @constant "^[A-Z]"))
(struct_expression
  name: (scoped_type_identifier
    path: (identifier) @type
    name: (type_identifier) @constant
    (#match? @type "^[A-Z]")))
(struct_pattern
  type: (scoped_type_identifier
    path: (identifier) @type
    name: (type_identifier) @constant
    (#match? @type "^[A-Z]")))

; Macros, with the `!`: the token tree inside is re-parsed as code.
(macro_invocation
  macro: [
    (identifier) @meta
    (scoped_identifier name: (identifier) @meta)
  ]
  "!" @meta)
(macro_definition name: (identifier) @meta)

; Attributes: the `#` (and `!`) and the name are meta, the brackets the
; body, and a capitalised word in the arguments a type (`Debug`).
(attribute_item "#" @meta)
(inner_attribute_item ["#" "!"] @meta)
(attribute [(identifier) (scoped_identifier)] @meta)
(attribute
  arguments: (token_tree
    (identifier) @type
    (#match? @type "^[A-Z]")))

; Lifetimes and loop labels, with their quote.
[(lifetime) (label)] @meta

; The four variants of the prelude, wherever they stand.
((identifier) @constant
  (#any-of? @constant "Some" "None" "Ok" "Err"))
