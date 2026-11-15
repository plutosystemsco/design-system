; JavaScript, for tree-sitter-javascript 0.25.0 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles. JSX
; tags and attributes are painted by jsx.scm, which loads after this file.
; written for the Pluto design system; not derived from the grammar's own queries.

; Order matters: for one node the last pattern that captures it wins, so the
; broad rules for a bare name come first and the rules for a position follow.

; ── Comments, literals, punctuation of strings ──────────────────────────

[(html_comment) (hash_bang_line) (comment)] @comment

; Quoted strings and template literals, delimiters included; a template's
; `${ … }` returns to code, its marks special.
[(template_string) (string)] @string
(template_substitution) @text
(template_substitution ["${" "}"] @special)
[
  (string (escape_sequence) @special)
  (template_string (escape_sequence) @special)
]

; Numbers whole, separators and prefixes included; regular expressions
; whole, slashes and flags included.
[(number)] @number
(regex
  pattern: (regex_pattern)) @special

; ── Keywords ────────────────────────────────────────────────────────────

[
  "import" "export" "from" "as" "default"
  "var" "let" "const" "using" "function" "class" "extends" "static"
  "get" "set" "async" "await" "yield"
  "if" "else" "switch" "case" "for" "of" "while" "do" "break" "continue"
  "return" "throw" "try" "catch" "finally" "with" "debugger"
  "new" "delete" "typeof" "instanceof" "in" "void"
] @keyword

[(super) (this) (meta_property)] @keyword

; ── A bare name ─────────────────────────────────────────────────────────

; Capitalised and not a local variable: a class (`extends Base`,
; `Date.now()`, `x instanceof Error`).
((identifier) @type
  (#is-not? local)
  (#match? @type "^[A-Z]"))

; ALL_CAPS where it is read or assigned (`const LIMIT = 3` included).
((identifier) @constant (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; Global objects that are not classes read as namespaces, in the body.
((identifier) @text
  (#any-of? @text "WebAssembly" "Intl" "Atomics" "Reflect" "JSON" "Math"))

; The language's global functions, called or passed.
((identifier) @function
  (#is-not? local)
  (#any-of? @function
    "parseFloat" "parseInt" "isFinite" "isNaN" "decodeURI"
    "decodeURIComponent" "encodeURI" "encodeURIComponent" "setInterval"
    "setTimeout" "clearInterval" "clearTimeout" "queueMicrotask" "fetch"
    "structuredClone" "requestAnimationFrame" "cancelAnimationFrame" "atob"
    "btoa"))

[(null) (undefined) (true) (false)] @constant

; ── Calls ───────────────────────────────────────────────────────────────

; What is called is a function, a method by its property's name.
[
  (call_expression function: (identifier) @function)
  (call_expression
    function: (member_expression
      property: [(private_property_identifier) (property_identifier)] @function))
]

; A capitalised callee without `new` (`Number(x)`, `Error("x")`) is a type,
; and so is the class `new` builds.
((call_expression function: (identifier) @type)
  (#match? @type "^[A-Z]"))
(new_expression constructor: (identifier) @type)
(new_expression
  constructor: (member_expression property: (property_identifier) @type))

; ── Definitions ─────────────────────────────────────────────────────────

[
  (generator_function_declaration name: (identifier) @function)
  (function_declaration name: (identifier) @function)
  (function_expression name: (identifier) @function)
]

; A name bound to a function value is the function's name.
(variable_declarator
  name: (identifier) @function
  value: [(arrow_function) (function_expression) (generator_function)])

; Methods, getters and setters where they are defined.
(method_definition
  name: [(private_property_identifier) (property_identifier)] @function)
((method_definition name: (property_identifier) @keyword)
  (#eq? @keyword "constructor"))

[
  (class_declaration name: (identifier) @type)
  (class name: (identifier) @type)
]

; ── Imports ─────────────────────────────────────────────────────────────

; What an import names: a class when capitalised, a constant in ALL_CAPS,
; otherwise a function. `* as ns` names a module, in the body.
[
  (import_specifier name: (identifier) @function)
  (import_specifier alias: (identifier) @function)
]
([
  (import_specifier name: (identifier) @type)
  (import_specifier alias: (identifier) @type)
] (#match? @type "^[A-Z]"))
([
  (import_specifier name: (identifier) @constant)
  (import_specifier alias: (identifier) @constant)
] (#match? @constant "^[A-Z][A-Z0-9_]+$"))
((import_clause (identifier) @type) (#match? @type "^[A-Z]"))
(namespace_import (identifier) @text)

; ── Decorators ──────────────────────────────────────────────────────────

; `@name`, `@ns.name` and `@name(…)`: the mark and the name are meta, the
; arguments code.
(decorator
  "@" @meta
  [
    (identifier) @meta
    (member_expression
      object: (identifier) @meta
      property: (property_identifier) @meta) @meta
    (call_expression
      function: (identifier) @meta)
    (call_expression
      function: (member_expression
        object: (identifier) @meta
        property: (property_identifier) @meta) @meta)
  ])
