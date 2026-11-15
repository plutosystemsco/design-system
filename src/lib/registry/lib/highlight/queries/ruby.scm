; Ruby, for tree-sitter-ruby 0.23.1 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.
;
; Later patterns win, so the file runs from the general to the particular.
; `ruby.locals.scm` tells a local variable from a bare method call.

(comment) @comment

; ── Literals ──────────────────────────────────────────────────────────────

; Strings whole, quotes and sigils included: plain, %w arrays, heredocs,
; backtick commands and `?a` characters.
[(string) (string_array) (heredoc_beginning) (heredoc_body) (subshell) (character)] @string
; An escape is special, and a regular expression is special whole.
[(regex) (escape_sequence)] @special

; Interpolation is code again: its body returns to the text, its `#{` and
; `}` are the interpolation's marks.
(interpolation) @text
(interpolation ["#{" "}"] @special)

[(integer) (float) (rational) (complex)] @number

; A symbol is a constant, colon included; so is every word of a %i array.
[(simple_symbol) (delimited_symbol) (symbol_array)] @constant
(block_argument (simple_symbol) @constant)

[(true) (false) (nil)] @constant

; ── Words ─────────────────────────────────────────────────────────────────

[
  "alias" "and" "begin" "break" "case" "class" "def" "defined?" "do" "else"
  "elsif" "end" "ensure" "for" "if" "in" "module" "next" "not" "or" "redo"
  "rescue" "retry" "return" "then" "undef" "unless" "until" "when" "while"
  "yield" "BEGIN" "END"
] @keyword
[(self) (super) (file) (line) (encoding)] @keyword

; ── Names ─────────────────────────────────────────────────────────────────

; A bare name that no assignment or parameter made local is a method call.
(_ (identifier) @function (#is-not? local))

; A bare receiver reads as the body: `rows.size`, `source.each_line`.
(call receiver: (identifier) @text)

; The words that name where the code stands are keywords, bare as they are.
((identifier) @keyword
  (#any-of? @keyword "__FILE__" "__LINE__" "__ENCODING__" "__method__" "__dir__"))

; A capitalised constant names a class or a module.
((constant) @type (#match? @type "^[A-Z]"))

; An ALL_CAPS constant is a constant where it is read or assigned. The
; positions that name a class or module follow and win.
((constant) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; ── Calls and definitions ─────────────────────────────────────────────────

; Every method called is a function: `puts`, `attr_reader`, `require`,
; `raise`, `.new`, `.each_line`.
(call method: [(identifier) (operator)] @function)

; A constant called like a method (`Float(x)`) names its class.
(call method: (constant) @type)

[
  (method name: (_) @function)
  (singleton_method name: (_) @function)
]

; A class or module at its definition, or as a namespace qualifier, is a type.
[
  (class name: [(constant) @type (scope_resolution name: (constant) @type)])
  (module name: [(constant) @type (scope_resolution name: (constant) @type)])
]
(superclass (constant) @type)
(scope_resolution scope: (constant) @type)
