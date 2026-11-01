import Root from "./code-editor.svelte";
import {
  pythonLanguageConfigured,
  pythonRoles,
  pythonSetup,
} from "./code-editor-python";
import { codeHighlight, codeTheme } from "./code-editor-theme";

export {
  Root,
  pythonSetup,
  pythonLanguageConfigured,
  pythonRoles,
  codeTheme,
  codeHighlight,
  //
  Root as CodeEditor,
};
