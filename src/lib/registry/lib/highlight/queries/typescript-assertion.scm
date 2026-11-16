; TypeScript's angle-bracket assertion, for tree-sitter-typescript 0.23.2
; (node types read from its typescript/src/node-types.json at that version).
; Captures are Kuiper code roles. TSX has no type_assertion node, so this one
; construct lives apart and only the typescript grammar loads it.
; written for the Kuiper Design System; not derived from the grammar's own queries.

; `<Frame>value`: the brackets are punctuation and the names inside them
; types, as a cast's target is a type (a qualified name's module stays in the
; body, by typescript.scm).
(type_assertion
  (type_arguments
    ["<" ">"] @text
    [(type_identifier) (predefined_type) (nested_type_identifier)] @type))
