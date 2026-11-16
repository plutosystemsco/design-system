; Python, for tree-sitter-python 0.25.0 (node types read from its
; src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.
;
; Later patterns win, so the file runs from the general to the particular:
; names by convention first, then the positions that overrule a convention.

(comment) @comment

; ── Literals ──────────────────────────────────────────────────────────────

; A string is whole, prefix and quotes included; a docstring is one too.
(string) @string
[(escape_sequence) (escape_interpolation)] @special

; An f-string's interpolation is code again: its body returns to the text,
; and its braces, conversion and format spec are the interpolation's marks.
(interpolation) @text
(interpolation ["{" "}"] @special)
(interpolation [(type_conversion) (format_specifier)] @special)

; A field nested in a format spec (`{x:>{width}}`) is code again, the same way.
(format_expression) @text
(format_expression ["{" "}"] @special)

; A number is one span: prefix, separators, exponent and `j` included.
[(float) (integer)] @number
[(true) (false) (none) (ellipsis)] @constant

; ── Words ─────────────────────────────────────────────────────────────────

[
  "and" "or" "not" "in" "is" "as" "if" "elif" "else" "for" "while" "break"
  "continue" "return" "yield" "pass" "raise" "try" "except" "finally" "with"
  "def" "class" "lambda" "import" "from" "global" "nonlocal" "del" "assert"
  "async" "await" "match" "case" "type" "print" "exec"
] @keyword

; ── Imports ───────────────────────────────────────────────────────────────

; A lowercase name brought in by `from … import` is read as a function; the
; capitalised one turns type below, by the CapWords convention.
(import_from_statement
  name: [
    (dotted_name (identifier) @function)
    (aliased_import [name: (dotted_name (identifier) @function) alias: (identifier) @function])
  ])

; ── Names by convention ───────────────────────────────────────────────────

; PEP 8 names classes in CapWords: a capitalised name is a type.
((identifier) @type
  (#match? @type "^_*[A-Z]"))

; An ALL_CAPS name is a constant where it is read or assigned. The positions
; that keep their own role (a definition, a callee, a type) follow and win.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; The built-in types are types wherever they stand.
((identifier) @type
  (#any-of? @type
    "str" "int" "float" "bool" "bytes" "bytearray" "complex" "dict" "list"
    "set" "frozenset" "tuple" "object" "type" "memoryview"))

; A field read off an object is the body, even when it shares a type's name.
(attribute
  attribute: (identifier) @text
  (#any-of? @text
    "str" "int" "float" "bool" "bytes" "bytearray" "complex" "dict" "list"
    "set" "frozenset" "tuple" "object" "type" "memoryview"))

; A built-in function handed over by keyword (`key=len`) is still a function.
(keyword_argument
  value: (identifier) @function
  (#any-of? @function
    "abs" "aiter" "all" "anext" "any" "ascii" "bin" "breakpoint" "callable"
    "chr" "classmethod" "compile" "delattr" "dir" "divmod" "enumerate" "eval"
    "exec" "filter" "format" "getattr" "globals" "hasattr" "hash" "help" "hex"
    "id" "input" "isinstance" "issubclass" "iter" "len" "locals" "map" "max"
    "min" "next" "oct" "open" "ord" "pow" "print" "property" "range" "repr"
    "reversed" "round" "setattr" "slice" "sorted" "staticmethod" "sum" "vars"
    "zip" "__import__"))

; ── Modules ───────────────────────────────────────────────────────────────

(import_statement
  name: [
    (dotted_name (identifier) @text)
    (aliased_import [name: (dotted_name (identifier) @text) alias: (identifier) @text])
  ])
(import_from_statement module_name: (dotted_name (identifier) @text))
(relative_import (dotted_name (identifier) @text))
(future_import_statement name: (dotted_name (identifier) @text))

; ── Calls and definitions ─────────────────────────────────────────────────

(call function: [
  (identifier) @function
  (attribute attribute: (identifier) @function)
])

; A method passed as a value: a lowercase name read off a CapWords class.
(attribute
  object: (identifier) @type
  attribute: (identifier) @function
  (#match? @type "^_*[A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*$")
  (#match? @function "^_*[a-z]"))

; A capitalised callee constructs: `Body(...)`, `models.Body(...)`, `API()`.
(call function: (identifier) @type (#match? @type "^_*[A-Z]"))
(call function: (attribute attribute: (identifier) @type (#match? @type "^_*[A-Z]")))

; A built-in type called is still the type: `float(x)`.
(call
  function: (identifier) @type
  (#any-of? @type
    "str" "int" "float" "bool" "bytes" "bytearray" "complex" "dict" "list"
    "set" "frozenset" "tuple" "object" "type" "memoryview"))

[
  (function_definition name: (identifier) @function)
  (class_definition name: (identifier) @type)
]
(class_definition superclasses: (argument_list [(identifier) @type (attribute attribute: (identifier) @type)]))

; ── Type positions ────────────────────────────────────────────────────────

(type [(identifier) @type (attribute attribute: (identifier) @type)])
(generic_type (identifier) @type)
(type (binary_operator [left: (identifier) @type right: (identifier) @type]))
(type (binary_operator left: (binary_operator [left: (identifier) @type right: (identifier) @type])))

; ── Parameters ──────────────────────────────────────────────────────────

; A parameter is a variable at its definition, whatever word it borrows.
(parameters [
  (identifier) @text
  (typed_parameter . (identifier) @text)
  (default_parameter name: (identifier) @text)
  (typed_default_parameter name: (identifier) @text)
])
(lambda parameters: (lambda_parameters [(identifier) (default_parameter name: (identifier))] @text))

; ── The receiver words ────────────────────────────────────────────────────

((identifier) @keyword
  (#any-of? @keyword "self" "cls" "super"))

; ── Positions that return a name to the body ──────────────────────────────

(keyword_argument name: (identifier) @text)

; ── Decorators, marker and name ───────────────────────────────────────────

(decorator "@" @meta)
(decorator [
  (identifier) @meta
  (attribute) @meta
  (call function: [(identifier) (attribute)] @meta)
])
(decorator [
  (attribute [object: (identifier) @meta attribute: (identifier) @meta])
  (call function: (attribute [object: (identifier) @meta attribute: (identifier) @meta]))
])
