; Svelte, for @tree-sitter-grammars/tree-sitter-svelte 1.0.2 (node types read
; from its src/node-types.json at that version). Captures are Kuiper code roles.
; written for the Kuiper Design System; not derived from the grammar's own queries.

[(comment)] @comment

[(doctype)] @meta
(doctype ["<!" ">"] @text)

; Markup, as in HTML: the tag name is a keyword, a capitalised name a
; component (a type); the angle brackets stay in the body.
[(start_tag (tag_name) @keyword)
 (end_tag (tag_name) @keyword)
 (self_closing_tag (tag_name) @keyword)
 (erroneous_end_tag (erroneous_end_tag_name) @keyword)]
((_ (tag_name) @type) (#match? @type "^[A-Z]"))

; Attributes: the name is meta, a quoted or bare value a string. A value in
; braces is an expression, painted by the script's language.
(attribute (attribute_name) @meta)
(attribute [(attribute_value) (quoted_attribute_value)] @string)
(attribute_value (expression) @text)
; A spread, `{...rest}`, stands where a name would.
((attribute_name) @text (#match? @text "^\\{"))

(entity) @special

; Blocks and tags: their braces are the body; the mark and its word
; (`#if`, `:else`, `/if`, `@html`) a keyword, and so is an each's `as`.
[(block_start_tag) (block_tag) (block_end_tag) (expression_tag)] @keyword
(each_start "as" @keyword)

; A snippet is a function, named at its definition.
(snippet_start (snippet_name) @function)
