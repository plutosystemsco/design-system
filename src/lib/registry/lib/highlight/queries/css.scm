; CSS, for tree-sitter-css 0.25.0 (node types read from its
; src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.

[(comment) (js_comment)] @comment

; At-rules and the words of their queries.
[(at_keyword) "@import" "@media" "@keyframes" "@charset" "@namespace"
 "@supports" "@scope"] @keyword
[(keyword_query) (feature_name) (important) "and" "or" "not" "only" "of"] @keyword

; Selectors are types: an element, a class or an id with its `.` or `#`,
; the universal and nesting selectors, and a keyframe's `from` and `to`.
[(tag_name) (class_selector) (id_selector) (universal_selector)
 (nesting_selector)] @type
(keyframe_block [(from) (to)] @type)
(attribute_selector (attribute_name) @meta)

; A pseudo-class or pseudo-element is meta with its colons; a selector it
; takes as an argument keeps its own role, a bare word is the body.
(pseudo_class_selector ":" @meta (class_name) @meta)
(pseudo_element_selector "::" @meta (tag_name) @meta)

; Declarations: the property is a keyword, a value word a constant;
; `!important` is a keyword with the query words above.
(declaration (property_name) @keyword)
(plain_value) @constant
(pseudo_class_selector (arguments (plain_value) @text))

; Numbers with their units, and colour literals, are one number span.
[(integer_value) (float_value) (color_value)] @number
; The grammar reads `0.875rem/1.6` as a number and a value word `rem/1.6`;
; that word is the rest of the number.
(declaration
  [(integer_value) (float_value)] . (plain_value) @number
  (#match? @number "^[A-Za-z%]+/[-+.0-9]"))

[(string_value)] @string
[(escape_sequence)] @special

; Functions, and a function this grammar does not know in `@import`
; (`layer(base)`), which it reads as a word and an error.
(call_expression (function_name) @function)
(import_statement (keyword_query) @function . (ERROR))

; Custom properties, declared or read, are meta.
([(property_name) (plain_value)] @meta (#match? @meta "^--"))
