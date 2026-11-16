; TypeScript and TSX, for tree-sitter-typescript 0.23.2 (node types read from
; its typescript/src/node-types.json and tsx/src/node-types.json at that
; version). Captures are Kuiper code roles. Compiles against both grammars, so
; it names no JSX node and no type assertion (those live in jsx.scm and
; typescript-assertion.scm).
; written for the Kuiper Design System; not derived from the grammar's own queries.

; ── Words of the language ───────────────────────────────────────────────

; Storage, control flow, modifiers and word operators. The type words
; (`number`, `string`, `void` …) are absent: inside a predefined_type they
; are types, below.
[
  "abstract" "accessor" "as" "assert" "asserts" "async" "await" "break"
  "case" "catch" "class" "const" "continue" "debugger" "declare" "default"
  "delete" "do" "else" "enum" "export" "extends" "finally" "for" "from"
  "function" "get" "global" "if" "implements" "import" "in" "infer"
  "instanceof" "interface" "is" "keyof" "let" "module" "namespace" "new"
  "of" "override" "private" "protected" "public" "readonly" "require"
  "return" "satisfies" "set" "static" "switch" "throw" "try" "type"
  "typeof" "using" "var" "while" "with" "yield"
] @keyword

; `void` is an operator before a value and a type after a colon.
(unary_expression operator: "void" @keyword)

; `this` and `super`, as values, as a `this:` parameter and as a type.
[(this) (super) (this_type)] @keyword

; `import.meta` and `new.target` read as one word each.
(meta_property) @keyword

; ── Literals ────────────────────────────────────────────────────────────

[(comment) (hash_bang_line) (html_comment)] @comment

; Strings, a template literal type (`\`row-${string}\``) among them.
[(string) (template_string) (template_literal_type)] @string

; A template literal's substitution returns to the body; its `${` and `}`
; are interpolation marks.
(template_string (template_substitution) @text)
[
  (template_substitution ["${" "}"] @special)
  (template_type ["${" "}"] @special)
]

(string (escape_sequence) @special)
(template_string (escape_sequence) @special)

; A regular expression is one span, slashes and flags included.
(regex) @special

(number) @number

; The two empties, then the two booleans.
[(null) (undefined) (true) (false)] @constant

; ── Names in expressions ────────────────────────────────────────────────

; A capitalised name read as a value is a class or a namespace-like type
; (`extends EventEmitter`, `Number.parseInt`), unless locals saw it bound
; here as a variable or a parameter.
((identifier) @type
  (#match? @type "^[A-Z]")
  (#is-not? local))

; An ALL_CAPS name, read or bound by `const X =`, is a constant.
((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; The global objects that are not classes stay in the body, as namespaces.
((identifier) @text
  (#any-of? @text "Math" "JSON" "Reflect" "Atomics" "Intl" "WebAssembly"))

; Built-in global functions, also when passed as a value (`.map(parseFloat)`).
((identifier) @function
  (#any-of? @function
    "parseInt" "parseFloat" "isNaN" "isFinite" "encodeURI"
    "encodeURIComponent" "decodeURI" "decodeURIComponent" "setTimeout"
    "setInterval" "clearTimeout" "clearInterval" "queueMicrotask"
    "structuredClone" "requestAnimationFrame" "cancelAnimationFrame" "fetch"
    "atob" "btoa")
  (#is-not? local))

; Calls: the callee is a function; through a member, its last name is.
(call_expression
  function: [
    (identifier) @function
    (member_expression
      property: [(property_identifier) (private_property_identifier)] @function)
  ])

; A capitalised callee without `new` constructs or converts: a type.
(call_expression
  function: (identifier) @type
  (#match? @type "^[A-Z]"))

; The class in `new X()` or `new ns.X()`.
(new_expression
  constructor: [
    (identifier) @type
    (member_expression property: (property_identifier) @type)
  ])

; ── Definitions ─────────────────────────────────────────────────────────

; A named function, declared, a generator, an expression or an overload.
[
  (function_declaration name: (identifier) @function)
  (generator_function_declaration name: (identifier) @function)
  (function_expression name: (identifier) @function)
  (function_signature name: (identifier) @function)
]

; Methods, getters and setters at their definition, in a class, an object
; or a signature.
(method_definition
  name: [(property_identifier) (private_property_identifier)] @function)
(method_signature name: (property_identifier) @function)
(abstract_method_signature name: (property_identifier) @function)

; A class's `constructor` is a word of the language.
(method_definition
  name: (property_identifier) @keyword
  (#eq? @keyword "constructor"))

; A function bound to a name with `const f = () => …` is a function.
(variable_declarator
  name: (identifier) @function
  value: [(arrow_function) (function_expression)])

; Classes, enums and their members.
[
  (class_declaration name: (type_identifier) @type)
  (abstract_class_declaration name: (type_identifier) @type)
  (class name: (type_identifier) @type)
  (enum_declaration name: (identifier) @type)
]

(enum_body
  [
    (property_identifier) @constant
    (enum_assignment name: (property_identifier) @constant)
  ])


; ── Imports ─────────────────────────────────────────────────────────────

; An imported name is most often a function or a class: capitalised is a
; type, ALL_CAPS a constant, anything else a function. A namespace import
; (`* as path`) is a module, in the body.
; Both the imported name and its `as` alias are matched.
(import_specifier (identifier) @function)
(import_specifier
  (identifier) @type
  (#match? @type "^[A-Z]"))
(import_specifier
  (identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))
(import_clause (identifier) @type (#match? @type "^[A-Z]"))
(namespace_import (identifier) @text)

; ── Types ───────────────────────────────────────────────────────────────

[(type_identifier) (predefined_type)] @type

; Modules stay in the body: a namespace's name (`namespace App.Core`) and the
; qualifier of a type (`React.` of `React.ReactNode`), at any of its first
; three segments.
(internal_module name: (identifier) @text)
(nested_type_identifier module: (identifier) @text)
(nested_identifier
  object: [
    (identifier) @text
    (member_expression object: (identifier) @text)
    (member_expression
      object: (member_expression object: (identifier) @text))
  ])

; `typeof x` in a type names a value's type.
(type_query [(identifier) (member_expression)] @type)

; A type predicate's subject (`x is Frame`) is the parameter, in the body.
(type_predicate name: (identifier) @text)

; ── Decorators ──────────────────────────────────────────────────────────

; Marker and name are meta; a decorator's arguments are code.
(decorator "@" @meta)
(decorator
  [
    (identifier) @meta
    (member_expression) @meta
    (call_expression
      function: [(identifier) (member_expression)] @meta)
  ])
(decorator (member_expression [(identifier) (property_identifier)] @meta))
(decorator
  (call_expression
    function: (member_expression [(identifier) (property_identifier)] @meta)))
