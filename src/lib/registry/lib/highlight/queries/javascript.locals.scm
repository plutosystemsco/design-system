; JavaScript locals, for tree-sitter-javascript 0.25.0 (node types read from
; its src/node-types.json at that version). Captures are local.* only.
; written for the Pluto design system; not derived from the grammar's own queries.
;
; Only values are locals: variables, parameters, destructured names and a
; caught error. A function or class name is not, so `Base` stays a class
; wherever it is read and a bound `const Row = …` returns to the body.

; Every function, block and loop opens a scope; an arrow's or a method's
; parameters belong to it.
[
  (program)
  (class_body)
  (method_definition)
  (function_declaration)
  (generator_function_declaration)
  (function_expression)
  (arrow_function)
  (statement_block)
  (for_statement)
  (for_in_statement)
  (catch_clause)
] @local.scope

; A name bound by let, const or var; a plain parameter; an arrow's one
; parameter without parentheses.
[
  (variable_declarator name: (identifier) @local.definition)
  (formal_parameters (identifier) @local.definition)
  (arrow_function parameter: (identifier) @local.definition)
]

; Names a pattern binds: `[a, ...rest]`, `{ a, b: c, d = 1 }`, `x = 0`.
(array_pattern (identifier) @local.definition)
(object_pattern
  [
    (shorthand_property_identifier_pattern) @local.definition
    (pair_pattern value: (identifier) @local.definition)
    (object_assignment_pattern
      left: (shorthand_property_identifier_pattern) @local.definition)
  ])
(rest_pattern (identifier) @local.definition)
(assignment_pattern left: (identifier) @local.definition)

; `catch (error)` and `for (const item of list)`.
(catch_clause parameter: (identifier) @local.definition)
(for_in_statement
  kind: ["const" "let" "var" "using"]
  left: (identifier) @local.definition)

; Every name read, the shorthand `{ name }` of an object literal included.
[(shorthand_property_identifier) (identifier)] @local.reference
