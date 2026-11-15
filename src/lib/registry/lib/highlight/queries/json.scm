; JSON, for tree-sitter-json 0.24.8 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

(comment) @comment

; A key is a function, quotes included, after Meridian: JSON keys are the
; one kind of property that takes a colour. Every other string is a string.
(pair key: (string) @function)
(pair value: (string) @string)
(array (string) @string)
(document (string) @string)

(escape_sequence) @special

; Values: a number is a number; true, false and null are constants.
[(number)] @number
[(true) (false) (null)] @constant
