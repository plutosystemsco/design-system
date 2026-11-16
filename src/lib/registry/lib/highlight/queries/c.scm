; C, for tree-sitter-c 0.24.1 (node types read from its
; src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.

[(comment)] @comment

; Words the language reserves. The type words (`long`, `unsigned`) are left
; to the type rules below, and `NULL` to the constants.
[
  "break" "case" "continue" "default" "do" "else" "for" "goto" "if"
  "return" "switch" "while"
  "struct" "union" "enum" "typedef" "extern" "static" "register" "auto"
  "inline" "__inline" "__inline__" "__forceinline" "thread_local" "__thread"
  "const" "volatile" "restrict" "__restrict__" "_Atomic" "_Noreturn" "noreturn"
  "_Nonnull" "constexpr" "__extension__" "__volatile__"
  "sizeof" "alignof" "_Alignof" "__alignof" "__alignof__" "_alignof"
  "alignas" "_Alignas" "offsetof" "_Generic" "defined"
  "asm" "__asm" "__asm__"
  "__try" "__except" "__finally" "__leave"
  "__based" "__cdecl" "__clrcall" "__fastcall" "__stdcall" "__thiscall"
  "__vectorcall" "__declspec" "__unaligned" "_unaligned"
] @keyword

; The preprocessor: every directive, and a directive the grammar does not
; name (`#pragma`), is meta.
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

; Types: built-in, sized, and every name the grammar reads as a type.
[(primitive_type) (sized_type_specifier) (type_identifier)] @type

; Literals.
[(number_literal)] @number
[(string_literal) (char_literal) (concatenated_string)] @string
[(escape_sequence)] @special
[(true) (false) (null)] @constant

; An ALL_CAPS name read or assigned is a constant. Callees, definitions and
; macro names are claimed again below, so their own roles win.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; A function's name where it is declared or defined, through any pointers.
(function_declarator
  declarator: (identifier) @function
  parameters: (parameter_list))

; A call. A function-like macro (`MAX(a, b)`) parses as a call and is one.
(call_expression
  function: [
    (identifier) @function
    (field_expression field: (field_identifier) @function)
    (parenthesized_expression (identifier) @function)
  ])

; The name a `#define` gives, object-like or function-like.
[
  (preproc_def name: (identifier) @meta)
  (preproc_function_def name: (identifier) @meta)
]

; Enumerators are constants wherever they are named.
(enumerator name: (identifier) @constant)

; Attributes: `[[nodiscard]]`, `__attribute__((packed))`. The name is meta,
; its brackets stay in the body.
(attribute_declaration
  (attribute [name: (identifier) prefix: (identifier)] @meta))
(attribute_specifier "__attribute__" @meta)
(attribute_specifier (argument_list (identifier) @meta))
