; YAML, for @tree-sitter-grammars/tree-sitter-yaml 0.7.1 (node types read from its
; src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.

(comment) @comment

; Scalars. A plain scalar is a string unless the core schema reads it as a
; number, a boolean or null; a GitHub Actions `${{ }}` stays in the string.
[(double_quote_scalar) (single_quote_scalar) (string_scalar)] @string
[(float_scalar) (integer_scalar) (timestamp_scalar)] @number
[(null_scalar) (boolean_scalar)] @constant
[(double_quote_scalar (escape_sequence) @special)
 (single_quote_scalar (escape_sequence) @special)]

; A block scalar's text is a string; its `|` or `>` header stays in the body.
(block_scalar) @string
(block_scalar ["|" ">"] @text)

; Keys, plain or quoted, are the body: Meridian gives a key a colour in JSON alone.
[(block_mapping_pair key: (flow_node (plain_scalar (_) @text)))
 (flow_pair key: (flow_node (plain_scalar (_) @text)))]
[(block_mapping_pair key: (flow_node [(double_quote_scalar) (single_quote_scalar)] @text))
 (flow_pair key: (flow_node [(double_quote_scalar) (single_quote_scalar)] @text))]

; The merge key `<<` is a keyword.
([(block_mapping_pair key: (flow_node (plain_scalar (string_scalar) @keyword)))
  (flow_pair key: (flow_node (plain_scalar (string_scalar) @keyword)))]
  (#eq? @keyword "<<"))

; Anchors and aliases, with their `&` and `*`; tags and directives annotate.
[(alias) (anchor)] @meta
(flow_node (tag) @meta)
(block_node (tag) @meta)
(document [(yaml_directive) (tag_directive) (reserved_directive)] @meta)
