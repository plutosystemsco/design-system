; JSX, for tree-sitter-javascript 0.25.0 and tree-sitter-typescript 0.23.2's
; TSX (node types read from tree-sitter-javascript's src/node-types.json and
; tree-sitter-typescript's tsx/src/node-types.json at those versions).
; Captures are Kuiper code roles. Loaded after javascript.scm or
; typescript.scm, so these rules win over theirs for the same node.
; written for the Kuiper Design System; not derived from the grammar's own queries.

; ── Tags ────────────────────────────────────────────────────────────────

; An element's name is a keyword at its opening, closing and self-closing
; tag; its angle brackets stay punctuation.
[
  (jsx_opening_element name: [(identifier) (jsx_namespace_name)] @keyword)
  (jsx_closing_element name: [(identifier) (jsx_namespace_name)] @keyword)
  (jsx_self_closing_element name: [(identifier) (jsx_namespace_name)] @keyword)
]

; A capitalised name is a component: a type.
([
  (jsx_opening_element name: (identifier) @type)
  (jsx_closing_element name: (identifier) @type)
  (jsx_self_closing_element name: (identifier) @type)
] (#match? @type "^[A-Z]"))

; A dotted component (`<Menu.Item>`): its last name is the type.
[
  (jsx_opening_element name: (member_expression property: (property_identifier) @type))
  (jsx_closing_element name: (member_expression property: (property_identifier) @type))
  (jsx_self_closing_element name: (member_expression property: (property_identifier) @type))
]

; ── Attributes ──────────────────────────────────────────────────────────

; Names are meta, a namespaced one (`xlink:href`) whole; a quoted value is a
; string. A value in braces is code, its braces punctuation.
(jsx_attribute [(property_identifier) (jsx_namespace_name)] @meta)
(jsx_attribute (string) @string)

; ── Children ────────────────────────────────────────────────────────────

; Text between tags is the body; an entity (`&mdash;`) is special.
(jsx_text) @text
(html_character_reference) @special
