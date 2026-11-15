; Ruby locals, for tree-sitter-ruby 0.23.1 (node types read from its
; src/node-types.json at that version). Captures are locals roles.
; written for the Pluto design system; not derived from the grammar's own queries.
;
; A bare identifier is a method call unless it was assigned, or bound as a
; parameter, earlier in its scope. `def`, `class` and `module` bodies see no
; outer locals; blocks and lambdas see the locals around them.

; ── Scopes ────────────────────────────────────────────────────────────────

([(method) (singleton_method) (class) (module) (singleton_class)] @local.scope
  (#set! local.scope-inherits false))

[(block) (do_block) (lambda)] @local.scope

; ── Definitions ───────────────────────────────────────────────────────────

; Assignment: plain, compound, multiple and destructured.
[
  (assignment left: (identifier) @local.definition)
  (operator_assignment left: (identifier) @local.definition)
  (left_assignment_list (identifier) @local.definition)
  (rest_assignment (identifier) @local.definition)
  (destructured_left_assignment (identifier) @local.definition)
]

; Parameters of methods, blocks and lambdas, bare or destructured.
[
  (method_parameters (identifier) @local.definition)
  (lambda_parameters (identifier) @local.definition)
  (block_parameters (identifier) @local.definition)
  (destructured_parameter (identifier) @local.definition)
]

; Parameters with a default, a keyword, a splat or a block marker.
[
  (optional_parameter name: (identifier) @local.definition)
  (keyword_parameter name: (identifier) @local.definition)
  (splat_parameter name: (identifier) @local.definition)
  (hash_splat_parameter name: (identifier) @local.definition)
  (block_parameter name: (identifier) @local.definition)
]

; Names bound by a loop, a rescue or a pattern.
[
  (for pattern: (identifier) @local.definition)
  (exception_variable (identifier) @local.definition)
  (as_pattern name: (identifier) @local.definition)
  (in_clause pattern: (identifier) @local.definition)
  (array_pattern (identifier) @local.definition)
  (find_pattern (identifier) @local.definition)
  (keyword_pattern key: (hash_key_symbol) value: (identifier) @local.definition)
]

; ── References ────────────────────────────────────────────────────────────

; Every identifier is a reference; it is local when a definition above it,
; in its scope or one it inherits, carries the same name.
(_ (identifier) @local.reference)
