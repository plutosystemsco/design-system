import { LanguageDescription, LanguageSupport } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { pythonLanguageConfigured } from "#lib/registry/ui/code-editor/code-editor-python";

/**
 * Any of the twenty-six languages the highlighter lists, for the editor, on
 * demand. `codeLanguages` is the table; `loadLanguage` opens one. Each language is loaded the first time it is asked for and cached;
 * installing this item installs every `@codemirror/lang-*` package and the
 * legacy modes through `@codemirror/language-data`, about two megabytes on
 * disk, so an app that edits one language keeps `pythonSetup()` alone.
 */

/** How a language is parsed: a Lezer grammar, the Svelte grammar, or a CodeMirror 5 mode. */
export type CodeLanguageKind = "lezer" | "svelte" | "legacy";

export type CodeLanguage = {
  /** The id the highlighter knows. */
  id: string;
  /** The names a block or an app may also pass. */
  aliases: string[];
  kind: CodeLanguageKind;
  /** The name `@codemirror/language-data` gives it. */
  dataName: string;
};

/** The twenty-six, in the highlighter's order. */
export const codeLanguages: CodeLanguage[] = [
  { id: "python", aliases: ["py"], kind: "lezer", dataName: "Python" },
  {
    id: "javascript",
    aliases: ["js", "cjs", "mjs"],
    kind: "lezer",
    dataName: "JavaScript",
  },
  {
    id: "typescript",
    aliases: ["ts", "cts", "mts"],
    kind: "lezer",
    dataName: "TypeScript",
  },
  { id: "tsx", aliases: [], kind: "lezer", dataName: "TSX" },
  { id: "jsx", aliases: [], kind: "lezer", dataName: "JSX" },
  { id: "html", aliases: [], kind: "lezer", dataName: "HTML" },
  { id: "css", aliases: [], kind: "lezer", dataName: "CSS" },
  { id: "json", aliases: [], kind: "lezer", dataName: "JSON" },
  { id: "yaml", aliases: ["yml"], kind: "lezer", dataName: "YAML" },
  { id: "toml", aliases: [], kind: "legacy", dataName: "TOML" },
  { id: "markdown", aliases: ["md"], kind: "lezer", dataName: "Markdown" },
  {
    id: "bash",
    aliases: ["shellscript", "sh", "shell", "zsh"],
    kind: "legacy",
    dataName: "Shell",
  },
  { id: "sql", aliases: [], kind: "lezer", dataName: "SQL" },
  { id: "go", aliases: [], kind: "lezer", dataName: "Go" },
  { id: "rust", aliases: ["rs"], kind: "lezer", dataName: "Rust" },
  { id: "java", aliases: [], kind: "lezer", dataName: "Java" },
  { id: "c", aliases: [], kind: "lezer", dataName: "C" },
  { id: "cpp", aliases: ["c++"], kind: "lezer", dataName: "C++" },
  { id: "csharp", aliases: ["c#", "cs"], kind: "legacy", dataName: "C#" },
  { id: "ruby", aliases: ["rb"], kind: "legacy", dataName: "Ruby" },
  { id: "php", aliases: [], kind: "lezer", dataName: "PHP" },
  { id: "kotlin", aliases: ["kt", "kts"], kind: "legacy", dataName: "Kotlin" },
  { id: "swift", aliases: [], kind: "legacy", dataName: "Swift" },
  { id: "svelte", aliases: [], kind: "svelte", dataName: "Svelte" },
  { id: "diff", aliases: [], kind: "legacy", dataName: "diff" },
  {
    id: "docker",
    aliases: ["dockerfile"],
    kind: "legacy",
    dataName: "Dockerfile",
  },
];

/** The table entry for an id or an alias, or null for a name it does not know. */
export function findLanguage(name: string): CodeLanguage | null {
  const wanted = name.toLowerCase();
  return (
    codeLanguages.find(
      (language) => language.id === wanted || language.aliases.includes(wanted),
    ) ?? null
  );
}

/**
 * Loads a language's support for the editor, or null for a name the table
 * does not hold. Three routes: Python is the configured grammar the preset
 * uses, so the editor's Python is one language everywhere; Svelte comes from
 * `@replit/codemirror-lang-svelte`, since `language-data` has no Svelte;
 * every other language goes to `language-data`'s description by its name
 * (a strict match, never a fuzzy one, which would map an unknown name by
 * substring), whose `load()` is one dynamic import, cached by the
 * description. Pass the result as an extension beside a base setup.
 */
export async function loadLanguage(
  name: string,
): Promise<LanguageSupport | null> {
  const language = findLanguage(name);
  if (!language) return null;
  if (language.id === "python")
    return new LanguageSupport(pythonLanguageConfigured);
  if (language.id === "svelte") {
    const { svelte } = await import("@replit/codemirror-lang-svelte");
    return svelte();
  }
  const description = LanguageDescription.matchLanguageName(
    languages,
    language.dataName,
    false,
  );
  if (!description) return null;
  return description.load();
}
