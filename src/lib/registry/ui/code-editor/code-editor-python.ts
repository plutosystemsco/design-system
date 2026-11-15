import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { pythonLanguage } from "@codemirror/lang-python";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import {
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { codeHighlighting } from "./code-editor-highlighting";

/**
 * The Python preset: line numbers, history, the default keys, Python's
 * grammar for structure (indentation, brackets), its colour from the
 * highlighter, bracket closing and matching, indent on input and the active
 * line. Python's own queries tell decorators, annotations, `self`, built-ins
 * and docstrings, so the editor colours Python exactly as a code block does.
 *
 * `pythonLanguage`, not `python()`: completion is off, so its two completion
 * sources would be inert weight. Tab is not bound, so Tab leaves the editor
 * and there is no keyboard trap; `Mod-]` and `Mod-[` indent. An app for
 * another language writes its own preset beside this one, or opens one
 * through `code-languages`.
 */
export function pythonSetup(): Extension[] {
  return [
    lineNumbers(),
    history(),
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
    pythonLanguage,
    codeHighlighting("python"),
    closeBrackets(),
    bracketMatching(),
    indentOnInput(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
  ];
}
