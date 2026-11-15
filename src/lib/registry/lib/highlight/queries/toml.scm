; TOML, for @tree-sitter-grammars/tree-sitter-toml 0.7.0 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

; A comment, wherever it stands.
(_ (comment) @comment)

; Keys are the body, bare, quoted or dotted, so a pair's key is not captured.

; Values. A value stands in a pair or in an array (an inline table holds pairs).
[(pair (string) @string) (array (string) @string)]
(string (escape_sequence) @special)
[(pair (boolean) @constant) (array (boolean) @constant)]
; A number, whole (sign, prefix, separators, exponent, `inf` and `nan`), and a
; date or time, which reads as a figure.
[(integer) (float) (local_time) (local_date) (local_date_time) (offset_date_time)] @number

; A table header names a structure, as a CSS selector does: the whole header,
; brackets and dots included (`[server]`, `[[bin]]`, `[profile.release]`).
; A header's key is the table's own child; its pairs hold every other key.
[(table ["[" "]" (bare_key) (quoted_key) (dotted_key)] @type)
 (table_array_element ["[[" "]]" (bare_key) (quoted_key) (dotted_key)] @type)]
