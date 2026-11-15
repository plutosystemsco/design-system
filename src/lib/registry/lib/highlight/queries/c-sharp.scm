; C#, for tree-sitter-c-sharp 0.23.5 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.
;
; No capitalisation rules: C# capitalises methods, properties and classes
; alike, so syntax alone decides. A class used as a static receiver
; (`Console.` in `Console.WriteLine`) is a known loss and reads as text.

; ALL_CAPS names read as constants where they stand as a value or the name
; being assigned. This comes first, so the type, call and attribute patterns
; below take their positions back under last-wins.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; Comments, an XML doc comment's tags included, and a shebang.
[(comment) (shebang_directive)] @comment

; The language's words, contextual ones included where the grammar marks
; them. `true` and `false` are constants, through their literal below.
[
  "abstract" "add" "alias" "and" "annotations" "as" "ascending" "assembly"
  "async" "await" "base" "break" "by" "case" "catch" "checked" "checksum"
  "class" "const" "continue" "default" "delegate" "descending" "disable" "do"
  "else" "enable" "enum" "equals" "event" "explicit" "extern" "field" "file"
  "finally" "fixed" "for" "foreach" "from" "get" "global" "goto" "group"
  "hidden" "if" "implicit" "in" "init" "interface" "internal" "into" "is"
  "join" "let" "lock" "managed" "method" "module" "namespace" "new" "not"
  "notnull" "on" "operator" "or" "orderby" "out" "override" "param" "params"
  "partial" "private" "property" "protected" "public" "readonly" "record"
  "ref" "remove" "required" "restore" "return" "scoped" "sealed" "select"
  "set" "sizeof" "stackalloc" "static" "struct" "switch" "this" "throw" "try"
  "type" "typeof" "typevar" "unchecked" "unmanaged" "unsafe" "using" "var"
  "virtual" "volatile" "warning" "warnings" "when" "where" "while" "with"
  "yield" "__makeref" "__reftype" "__refvalue"
  "Cdecl" "Fastcall" "Stdcall" "Thiscall"
] @keyword

; Preprocessor directives.
[
  "#define" "#elif" "#else" "#endif" "#endregion" "#error" "#if" "#line"
  "#nullable" "#pragma" "#region" "#undef" "#warning"
] @meta
(preproc_arg) @meta

; Literals.
[(integer_literal) (real_literal)] @number
; The literal constants, and enum members at their declaration.
[
  (boolean_literal) @constant
  (null_literal) @constant
  (enum_member_declaration name: (identifier) @constant)
]
[
  (string_literal) (verbatim_string_literal) (raw_string_literal)
  (character_literal) (interpolated_string_expression)
] @string
(escape_sequence) @special

; `$"…{x,8:N0}…"`: the code inside the braces returns to the body; the
; braces, the alignment and the format spec are interpolation marks.
(interpolation) @text
[
  (interpolation_brace)
  (interpolation_alignment_clause)
  (interpolation_format_clause)
] @special
; The alignment's width (`,8`, `,-8`) belongs to the format, not the numbers.
(interpolation_alignment_clause
  [
    (integer_literal) @special
    (prefix_unary_expression (integer_literal) @special)
  ])

; Types. Built-in names, and every name a type field holds.
(predefined_type) @type
[
  (_ type: (identifier) @type)
  (method_declaration returns: (identifier) @type)
  (as_expression right: (identifier) @type)
  (type_argument_list (identifier) @type)
  (generic_name (identifier) @type)
  (base_list (identifier) @type)
  (type_parameter name: (identifier) @type)
  (type_parameter_constraints_clause (identifier) @type)
]

; A qualified name keeps its namespace plain; only the last name is a type
; (`System.Text.StringBuilder`).
(qualified_name name: (identifier) @type)
(qualified_name qualifier: (identifier) @text)
(qualified_name qualifier: (qualified_name name: (identifier) @text))
(alias_qualified_name name: (identifier) @text)
; A namespace in the middle of a member chain (`System.IO.File`) is plain.
(member_access_expression
  expression: (member_access_expression name: (identifier) @text))

; Declared types.
[
  (class_declaration name: (identifier) @type)
  (struct_declaration name: (identifier) @type)
  (interface_declaration name: (identifier) @type)
  (enum_declaration name: (identifier) @type)
  (record_declaration name: (identifier) @type)
  (delegate_declaration name: (identifier) @type)
]

; Methods: declared, and every invocation.
[
  (method_declaration name: (identifier) @function)
  (local_function_statement name: (identifier) @function)
  (constructor_declaration name: (identifier) @function)
  (destructor_declaration name: (identifier) @function)
]
(invocation_expression
  function: [(identifier) @function (generic_name . (identifier) @function)])
(invocation_expression
  function: (member_access_expression
    name: [(identifier) @function (generic_name . (identifier) @function)]))
(invocation_expression
  function: (conditional_access_expression
    (member_binding_expression name: (identifier) @function)))

; `using` and `namespace` names stay plain throughout.
(using_directive (identifier) @text)
(using_directive (qualified_name name: (identifier) @text))
[
  (namespace_declaration name: (identifier) @text)
  (file_scoped_namespace_declaration name: (identifier) @text)
  (namespace_declaration name: (qualified_name name: (identifier) @text))
  (file_scoped_namespace_declaration
    name: (qualified_name name: (identifier) @text))
]

; Attributes: the name is meta, the brackets plain, the arguments code.
(attribute
  name: [
    (identifier) @meta
    (qualified_name name: (identifier) @meta)
    (generic_name . (identifier) @meta)
  ])
