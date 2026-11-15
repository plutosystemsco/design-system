; HTML, for tree-sitter-html 0.23.2 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

[(comment)] @comment

; The doctype is one meta span; its `<!` and `>` return to the body.
[(doctype)] @meta
(doctype ["<!" ">"] @text)

; Tags: the name is a keyword, a capitalised name a component (a type).
; The brackets stay in the body, uncaptured.
[(start_tag (tag_name) @keyword)
 (end_tag (tag_name) @keyword)
 (self_closing_tag (tag_name) @keyword)
 (erroneous_end_tag (erroneous_end_tag_name) @keyword)]
((_ (tag_name) @type) (#match? @type "^[A-Z]"))

; Attributes: the name is meta, the value a string with its quotes.
(attribute (attribute_name) @meta)
(attribute [(attribute_value) (quoted_attribute_value)] @string)

; Character references in text.
(entity) @special

; A bare `<`: HTML reads `<` as text unless a letter follows it, and this
; grammar opens a tag there anyway (or, at the end of an element, an ERROR).
; The `<` is special; what the grammar took for a tag's name and attributes
; returns to the body.
(ERROR "<" @special)
([(start_tag "<" @special) (self_closing_tag "<" @special)] @text
 (#match? @text "^<[^A-Za-z]"))
([(start_tag [(tag_name) @text (attribute (attribute_name) @text)])
  (self_closing_tag [(tag_name) @text (attribute (attribute_name) @text)])] @text
 (#match? @text "^([^<]|<[^A-Za-z])"))
