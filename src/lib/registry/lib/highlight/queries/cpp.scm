; C++, for tree-sitter-cpp 0.23.4 (node types read from its
; src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.
;
; This file stands alone: it does not load c.scm, so C's rules are stated
; again here in the C++ grammar's terms.

[(comment)] @comment

; Words the language reserves. The type words (`long`, `unsigned`) are left
; to the type rules below, and `NULL` and `nullptr` to the constants.
[
  "break" "case" "continue" "default" "do" "else" "for" "goto" "if"
  "return" "switch" "while" "try" "catch" "throw"
  "co_await" "co_return" "co_yield"
  "struct" "union" "enum" "class" "typedef" "namespace" "using" "template"
  "typename" "concept" "requires" "operator" "friend"
  "extern" "static" "register" "inline" "__inline" "__inline__"
  "__forceinline" "thread_local" "__thread" "mutable" "virtual" "explicit"
  "const" "volatile" "restrict" "__restrict__" "_Atomic" "_Noreturn"
  "noreturn" "_Nonnull" "constexpr" "consteval" "constinit" "noexcept"
  "final" "override" "public" "private" "protected" "__extension__"
  "__volatile__"
  "new" "delete" "sizeof" "alignof" "_Alignof" "__alignof" "__alignof__"
  "_alignof" "alignas" "_Alignas" "offsetof" "_Generic" "decltype"
  "static_assert" "defined"
  "and" "and_eq" "bitand" "bitor" "compl" "not" "not_eq" "or" "or_eq"
  "xor" "xor_eq"
  "asm" "__asm" "__asm__"
  "__try" "__except" "__finally" "__leave"
  "__based" "__cdecl" "__clrcall" "__fastcall" "__stdcall" "__thiscall"
  "__vectorcall" "__declspec" "__unaligned" "_unaligned"
] @keyword

; `auto` as a placeholder type is a storage word; `this` is a keyword.
[(auto) (this)] @keyword

; The preprocessor: every directive, and one the grammar does not name
; (`#pragma`), is meta.
[
  "#include" "#define" "#if" "#ifdef" "#ifndef" "#elif" "#elifdef"
  "#elifndef" "#else" "#endif"
] @meta
(preproc_call directive: (preproc_directive) @meta)

; An include path, in angle brackets or quotes, is a string.
(preproc_include path: [(system_lib_string) (string_literal)] @string)

; A macro's body is raw text to the grammar; when the whole of it is one
; number or one string literal, it takes that literal's role.
(preproc_def
  value: (preproc_arg) @number
  (#match? @number "^[0-9][0-9A-Za-z_.']*$"))
(preproc_def
  value: (preproc_arg) @string
  (#match? @string "^(L|u8|u|U)?\"([^\"\\\\]|\\\\.)*\"$"))

; Types: built-in, sized, and every name the grammar reads as a type. A
; namespace qualifier (`std::`) stays in the body; the type at the end of
; the path is a type.
[(primitive_type) (sized_type_specifier) (type_identifier)] @type

; Literals. A user-defined literal is one number with its suffix (`10ms`),
; or one string with its suffix (`"x"s`).
[(number_literal) (user_defined_literal (number_literal))] @number
[
  (string_literal) (raw_string_literal) (char_literal) (concatenated_string)
] @string
(user_defined_literal (string_literal) (literal_suffix) @string)
(user_defined_literal (raw_string_literal) (literal_suffix) @string)
[(escape_sequence)] @special
[(true) (false) (null)] @constant

; An ALL_CAPS name read or assigned is a constant (`x = MAX_LINES`,
; `Config::LIMIT`). Callees, definitions and macro names are claimed again
; below, so their own roles win.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; A function's name where it is declared or defined: free, a member, a
; constructor, a destructor, one defined out of its class (`Box::get`).
(function_declarator
  declarator: [
    (identifier) @function
    (field_identifier) @function
    (destructor_name) @function
    (qualified_identifier name: (identifier) @function)
    (qualified_identifier name: (destructor_name) @function)
    (qualified_identifier
      name: (qualified_identifier name: (identifier) @function))
    (template_function name: (identifier) @function)
  ]
  parameters: (parameter_list))

; An operator's definition (`operator==`): the symbol is the name, and
; `operator` keeps its keyword role from the list above.
(function_declarator declarator: (operator_name) @function)

; A call, through any qualifier, member access or template arguments. A
; function-like macro (`MAX(a, b)`) parses as a call and is one.
(call_expression
  function: [
    (identifier) @function
    (parenthesized_expression (identifier) @function)
    (field_expression field: (field_identifier) @function)
    (field_expression field: (template_method name: (field_identifier) @function))
    (template_function name: (identifier) @function)
    (qualified_identifier name: (identifier) @function)
    (qualified_identifier name: (template_function name: (identifier) @function))
    (qualified_identifier
      name: (qualified_identifier name: (identifier) @function))
    (qualified_identifier
      name: (qualified_identifier
        name: (qualified_identifier name: (identifier) @function)))
    (qualified_identifier
      name: (qualified_identifier
        name: (template_function name: (identifier) @function)))
  ])

; The four casts are words of the language, though the grammar reads them
; as template calls.
(template_function
  name: (identifier) @keyword
  (#any-of? @keyword "static_cast" "dynamic_cast" "const_cast" "reinterpret_cast"))

; A concept names a constraint on types: a type.
(concept_definition name: (identifier) @type)

; The name a `#define` gives, object-like or function-like.
[
  (preproc_def name: (identifier) @meta)
  (preproc_function_def name: (identifier) @meta)
]

; Enumerators are constants where they are named.
(enumerator name: (identifier) @constant)

; Attributes: `[[nodiscard]]`, `[[gnu::unused]]`, `__attribute__((packed))`.
; The name is meta, its brackets stay in the body.
(attribute_declaration
  (attribute [name: (identifier) prefix: (identifier)] @meta))
(attribute_specifier "__attribute__" @meta)
(attribute_specifier (argument_list (identifier) @meta))
