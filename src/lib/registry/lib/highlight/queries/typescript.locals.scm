; TypeScript and TSX locals, for tree-sitter-typescript 0.23.2 (node types
; read from its typescript/src/node-types.json and tsx/src/node-types.json at
; that version). Captures are local.* only.
; written for the Pluto design system; not derived from the grammar's own queries.
;
; A local is a value bound here: a variable, a destructured name, a
; parameter or a caught error. Functions, classes and imports are not
; locals, so a capitalised class keeps its type wherever it is read.

; ── Where names live ────────────────────────────────────────────────────

[
  (statement_block)
  (function_declaration)
  (generator_function_declaration)
  (function_expression)
  (arrow_function)
  (method_definition)
  (for_statement)
  (for_in_statement)
  (catch_clause)
  (class_body)
] @local.scope

; ── Bindings ────────────────────────────────────────────────────────────

; A declared name, and every name a destructuring pattern binds, at any
; depth of an array or object pattern.
[
  (variable_declarator name: (identifier) @local.definition)
  (array_pattern (identifier) @local.definition)
  (rest_pattern (identifier) @local.definition)
  (pair_pattern value: (identifier) @local.definition)
  (object_pattern (shorthand_property_identifier_pattern) @local.definition)
  (assignment_pattern left: (identifier) @local.definition)
  (object_assignment_pattern
    left: (shorthand_property_identifier_pattern) @local.definition)
]

; Parameters, typed or not, and an arrow's lone parameter.
(required_parameter pattern: (identifier) @local.definition)
(optional_parameter pattern: (identifier) @local.definition)
(arrow_function parameter: (identifier) @local.definition)

; A caught error and a `for (const x of …)` binding.
(catch_clause parameter: (identifier) @local.definition)
(for_in_statement kind: _ left: (identifier) @local.definition)

; ── Uses ────────────────────────────────────────────────────────────────

; A name read, and the shorthand `{ name }` of an object literal, which reads one.
[(identifier) (shorthand_property_identifier)] @local.reference
