; Shell, for tree-sitter-bash 0.25.1 (node types read from its
; src/node-types.json at that version). Captures are Pluto code roles.
; written for the Pluto design system; not derived from the grammar's own queries.

; Comments, the shebang among them (the grammar reads `#!` as a comment).
(comment) @comment

; Quoted text of every kind, and a heredoc with its delimiter words.
[(raw_string) (ansi_c_string) (string) (translated_string)] @string
(heredoc_redirect [(heredoc_start) (heredoc_body) (heredoc_end)] @string)

; A command's name is a function: an external program and a builtin alike
; (`curl`, `pip`, `echo`, `cd`, `exit`, `set`), and so is the name a function
; definition gives. A command's arguments and flags stay in the body, the
; owner's ruling, so nothing else in a command is captured.
[(command name: (command_name (word) @function))
 (function_definition name: (word) @function)]

; Builtins the grammar parses as declarations rather than as commands.
(declaration_command ["local" "export" "declare" "typeset" "readonly"] @function)
(unset_command ["unsetenv" "unset"] @function)

; Control words and the test brackets.
["if" "then" "elif" "else" "fi"
 "while" "until" "for" "select" "in" "do" "done"
 "case" "esac" "function"] @keyword
(test_command ["[[" "]]" "[" "]"] @keyword)

; A parameter expansion is meta, whole: `$HOME`, `$1`, `$?`, `${#failed[@]}`.
[(simple_expansion) (expansion)] @meta

; In `${name:-word}`, `${name#prefix}` or `${name:1:2}` an operator after the
; name, and the operand it takes, return to the body; inside a quoted string
; that operand is part of the string. `${#name}`, `${!name}` and `${name^^}`
; stay meta, whole.
(expansion [(variable_name) (subscript)]
  operator: _ @text
  [(word) (regex) (number) (concatenation) (string) (raw_string)
   (simple_expansion) (expansion) (command_substitution)])
(expansion [(word) (regex) (number) (concatenation)] @text)
(string (expansion [(word) (regex) (number) (concatenation)] @string))

; A substitution's body is code again, even inside a string; its delimiters
; are interpolation marks. A delimiter is painted only when the substitution
; is closed, so a half-typed `$(` stays in the body.
(command_substitution) @text
((command_substitution ["$(" ")"] @special) @text
  (#match? @text "\\)$"))
((command_substitution "`" @special) @text
  (#match? @text "^`(.|\\n)*`$"))
(arithmetic_expansion) @text
((arithmetic_expansion ["$((" "))"] @special) @text
  (#match? @text "\\)\\)$"))

; Arithmetic is the one place a shell number reads as a number; `exit 0`, a
; case pattern `0)` and an operand of `[[ $n -eq 0 ]]` are bare words.
(arithmetic_expansion (number) @number)
(binary_expression [left: (number) right: (number)] @number)
(unary_expression (number) @number)
(binary_expression operator: (test_operator) [left: (number) right: (number)] @text)
(test_command (binary_expression [left: (number) right: (number)] @text))
(test_command (binary_expression (binary_expression [left: (number) right: (number)] @text)))

; A regular expression after `=~`, whole.
(binary_expression right: (regex) @special)
