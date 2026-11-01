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
import { codeHighlight } from "./code-editor-theme";

/**
 * The Python preset (004 decision 9): line numbers, history, the default
 * keys, the language, bracket closing and matching, indent on input, the
 * active line and the highlight from the code tokens. About 130 KB gzipped
 * with the component.
 *
 * `pythonLanguage`, not `python()`: completion is off, so its two completion
 * sources would be inert weight. Tab is not bound, so Tab leaves the editor
 * and there is no keyboard trap; `Mod-]` and `Mod-[` indent. An app for
 * another language writes its own preset beside this one.
 */
export function pythonSetup(): Extension[] {
  return [
    lineNumbers(),
    history(),
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
    pythonLanguage,
    closeBrackets(),
    bracketMatching(),
    indentOnInput(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    codeHighlight,
  ];
}
