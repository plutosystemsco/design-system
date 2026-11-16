; Java, for tree-sitter-java 0.23.5 (node types read from its
; src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.

; ALL_CAPS names read as constants where they stand as a value or the name
; being assigned (`static final double DELTA_V_LIMIT`, `x = MAX_N`). This
; comes first, so the declaration, call and annotation patterns below take
; those positions back under last-wins.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; A Javadoc block, a block and a line comment alike.
[(block_comment) (line_comment)] @comment

; The language's words. The primitive type words are left out: they are
; types, coloured through their parent below.
[
  "abstract" "assert" "break" "case" "catch" "class" "continue" "default"
  "do" "else" "enum" "exports" "extends" "final" "finally" "for" "if"
  "implements" "import" "instanceof" "interface" "@interface" "module"
  "native" "new" "non-sealed" "open" "opens" "package" "permits" "private"
  "protected" "provides" "public" "record" "requires" "return" "sealed"
  "static" "strictfp" "switch" "synchronized" "throw" "throws" "to"
  "transient" "transitive" "try" "uses" "volatile" "when" "while" "with"
  "yield"
] @keyword

[(this) (super)] @keyword

; Literals, each whole: `30_000L` and `0x2A` are one span.
[
  (decimal_integer_literal) (hex_integer_literal) (octal_integer_literal)
  (binary_integer_literal) (decimal_floating_point_literal)
  (hex_floating_point_literal)
] @number

; The literal constants, and enum constants at their declaration.
[
  (true) @constant
  (false) @constant
  (null_literal) @constant
  (enum_constant name: (identifier) @constant)
]

[(string_literal) (character_literal)] @string
(escape_sequence) @special

; A string template's `\{ … }`: the code inside returns to the body, the
; delimiters are interpolation marks.
(string_interpolation) @text
(string_interpolation "\\{" @special)
(string_interpolation "}" @special .)

; Types: every type name, the primitive words and `void`.
(type_identifier) @type
[(integral_type) (floating_point_type) (boolean_type) (void_type)] @type

; A qualified type keeps its package plain (`java.util.Map.Entry`).
(scoped_type_identifier
  (type_identifier) @text
  (#match? @text "^[a-z]"))

; `var` is a word of the language, not a type someone named.
((type_identifier) @keyword
  (#eq? @keyword "var"))

; Declared types.
[
  (class_declaration name: (identifier) @type)
  (interface_declaration name: (identifier) @type)
  (enum_declaration name: (identifier) @type)
  (record_declaration name: (identifier) @type)
  (annotation_type_declaration name: (identifier) @type)
]

; Methods and constructors, where they are declared and where they are called.
[
  (method_declaration name: (identifier) @function)
  (annotation_type_element_declaration name: (identifier) @function)
  (constructor_declaration name: (identifier) @function)
  (compact_constructor_declaration name: (identifier) @function)
]
[
  (method_invocation name: (identifier) @function)
  (method_reference (identifier) @function .)
]

; A capitalised receiver is a class: methods and fields are lowerCamel, so
; `String.join`'s `String` and `Kind.DWARF`'s `Kind` read as types. An
; ALL_CAPS receiver stays a constant.
(method_invocation
  object: (identifier) @type
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))
(field_access
  object: (identifier) @type
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))
(method_reference
  . (identifier) @type
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))
; A nested class reached through its outer one (`Outer.Inner.make()`).
([
  (method_invocation object: (field_access field: (identifier) @type))
  (field_access object: (field_access field: (identifier) @type))
]
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))

; Packages and imports stay plain; a capitalised name in an import is the
; class it brings in (`import java.util.List`).
(import_declaration
  (scoped_identifier
    name: (identifier) @type
    (#match? @type "^[A-Z]")
    (#not-match? @type "^[A-Z][A-Z0-9_]+$")))
(scoped_identifier
  scope: (scoped_identifier name: (identifier) @type)
  (#match? @type "^[A-Z]")
  (#not-match? @type "^[A-Z][A-Z0-9_]+$"))

; Annotations: the `@` and the name. Arguments are labelled as code.
(marker_annotation "@" @meta name: (_) @meta)
(annotation "@" @meta name: (_) @meta)
