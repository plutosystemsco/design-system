; PHP, for tree-sitter-php 0.24.2, its `php` grammar with the HTML host
; (node types read from its php/src/node-types.json at that version).
; Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.
;
; This file paints PHP alone. The text outside `<?php … ?>` is the engine's
; to inject as HTML (013 decision 14); here it stays in the body.

[(comment)] @comment

; Words the language reserves, and the tags that open and close PHP code
; (`<?php`, `<?=`, `?>`). The type words (`int`, `string`, `array`) are
; left to the type rules below.
[
  (php_tag) (php_end_tag) (var_modifier)
  "abstract" "and" "as" "break" "case" "catch" "class" "clone" "const"
  "continue" "declare" "default" "do" "echo" "else" "elseif" "enddeclare"
  "endfor" "endforeach" "endif" "endswitch" "endwhile" "enum" "exit"
  "extends" "final" "finally" "fn" "for" "foreach" "function" "global"
  "goto" "if" "implements" "include" "include_once" "instanceof"
  "insteadof" "interface" "match" "namespace" "new" "or" "print"
  "private" "protected" "public" "readonly" "require" "require_once"
  "return" "static" "switch" "throw" "trait" "try" "unset" "use" "while"
  "xor" "yield" "yield from" "self" "parent"
] @keyword
; `array(…)` and `list(…)` build values: there the word is a keyword.
[
  (array_creation_expression "array" @keyword)
  (list_literal "list" @keyword)
]

; Literals.
[(float) (integer)] @number
[(boolean) (null)] @constant
[
  (string) (encapsed_string) (heredoc) (nowdoc) (shell_command_expression)
] @string

; Inside a double-quoted string, a heredoc or backticks, what is
; interpolated is code: it returns to the body, and the braces around it are
; special. The literal runs between stay strings.
(encapsed_string (_) @text)
(heredoc_body (_) @text)
(shell_command_expression (_) @text)
(string_content) @string
[
  (encapsed_string ["{" "}"] @special)
  (heredoc_body ["{" "}"] @special)
  (dynamic_variable_name ["$" "{" "}"] @special)
]
[(escape_sequence)] @special

; An ALL_CAPS name read or assigned is a constant (`PHP_EOL`,
; `const BUDGET = 1`). The positions below that make a name a function or a
; type are written after it, so they win.
((name) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

; `$this` is a keyword; every other `$variable` stays in the body.
((variable_name) @keyword
  (#eq? @keyword "$this"))

; Types: built-in, cast, and a name in a type position. Of a qualified name
; (`\App\User`), the namespace stays in the body and the last name is a type.
[(primitive_type) (cast_type)] @type
(named_type [(name) @type (qualified_name (name) @type)])
((named_type (name) @keyword)
  (#any-of? @keyword "self" "static" "parent"))

; A declaration's name.
(class_declaration name: (name) @type)
(interface_declaration name: (name) @type)
(trait_declaration name: (name) @type)
(enum_declaration name: (name) @type)

; A class named where only a class can stand: its bases and interfaces,
; a trait it uses, `new X`, `X::`, `instanceof X`, an imported name.
(base_clause [(name) @type (qualified_name (name) @type)])
(class_interface_clause [(name) @type (qualified_name (name) @type)])
(use_declaration [(name) @type (qualified_name (name) @type)])
(object_creation_expression [(name) @type (qualified_name (name) @type)])
(scoped_call_expression scope: [(name) @type (qualified_name (name) @type)])
(scoped_property_access_expression
  scope: [(name) @type (qualified_name (name) @type)])
(class_constant_access_expression
  . [(name) @type (qualified_name (name) @type)])
(binary_expression
  operator: "instanceof"
  right: [(name) @type (qualified_name (name) @type)])
(namespace_use_clause [(name) @type (qualified_name (name) @type)])

; What follows `X::` is a class constant or an enum case; `X::class` is
; the keyword.
(class_constant_access_expression (name) @constant .)
((class_constant_access_expression (name) @keyword .)
  (#eq? @keyword "class"))
(enum_case name: (name) @constant)

; Functions and methods, where they are defined and where they are called.
[
  (function_definition name: (name) @function)
  (method_declaration name: (name) @function)
]
(function_call_expression
  function: [(name) @function (qualified_name (name) @function)])
[
  (member_call_expression name: (name) @function)
  (nullsafe_member_call_expression name: (name) @function)
  (scoped_call_expression name: (name) @function)
]

; Attributes: `#[` and the attribute's name are meta; the closing bracket
; stays in the body, and the arguments are code.
(attribute_group "#[" @meta)
(attribute [(name) (qualified_name)] @meta)
