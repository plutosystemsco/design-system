import type {
  GrammarState,
  HighlighterCore,
  ThemeRegistrationRaw,
  ThemedToken,
} from "shiki/core";

/**
 * Shiki with the JavaScript engine and one hand-made theme whose every colour
 * is a code token, `var(--code-<slot>)`. A token renders as a class, never a
 * `style`: `tokenClass` maps the slot to its `text-code-<slot>` utility.
 *
 * `highlightCode` is the one-shot form for a server `load`, so a prerendered
 * page ships no Shiki. `loadHighlighter` is the incremental form the
 * `useHighlightedCode` hook streams through. Shiki itself is imported lazily,
 * so a page that only renders highlighted lines it was given loads none of it.
 */

/** The theme's name, as Shiki registers it. */
const THEME = "pluto-code";

const slot = (name: string) => `var(--code-${name})`;

/**
 * The palette as a theme (004 decision 6). Every colour is a code slot. Scopes
 * are grouped so that Shiki and CodeMirror colour the same Python the same
 * way: operators are the body's colour, a docstring reads as a comment, and a
 * function or type name is told by weight, not colour.
 */
export const codeTheme: ThemeRegistrationRaw = {
  name: THEME,
  type: "light",
  colors: {
    "editor.foreground": slot("foreground"),
    "editor.background": slot("background"),
  },
  settings: [
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: slot("keyword") },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: slot("foreground") },
    },
    {
      scope: ["string", "string.quoted", "string.interpolated"],
      settings: { foreground: slot("string") },
    },
    {
      scope: ["string.quoted.docstring"],
      settings: { foreground: slot("comment") },
    },
    {
      // The checkpoint's call: a string's own quotes take the string colour,
      // so a literal reads as one thing. This deeper scope wins over the
      // `punctuation` rule below; a docstring's quotes stay with its body.
      scope: ["string punctuation.definition.string"],
      settings: { foreground: slot("string") },
    },
    {
      scope: ["string.quoted.docstring punctuation.definition.string"],
      settings: { foreground: slot("comment") },
    },
    {
      scope: ["constant.numeric", "constant.language", "support.type"],
      settings: { foreground: slot("constant") },
    },
    {
      scope: [
        "entity.name.function",
        "entity.name.type",
        "support.function",
        // The called name alone: `meta.function-call` would take the whole
        // call, arguments included, in the Python grammar.
        "meta.function-call.generic",
      ],
      settings: { foreground: slot("function"), fontStyle: "bold" },
    },
    { scope: ["comment"], settings: { foreground: slot("comment") } },
    {
      scope: ["variable", "variable.parameter", "punctuation"],
      settings: { foreground: slot("foreground") },
    },
    {
      scope: ["markup.underline.link"],
      settings: { foreground: slot("link"), fontStyle: "underline" },
    },
    { scope: ["markup.inserted"], settings: { foreground: slot("inserted") } },
    { scope: ["markup.deleted"], settings: { foreground: slot("deleted") } },
    { scope: ["markup.changed"], settings: { foreground: slot("changed") } },
  ],
};

/**
 * The slot-to-class table (004 decision 7): every slot but `foreground`,
 * written out so Tailwind's scanner sees each class. A token in the
 * `foreground` slot carries no class: the `pre` is already `text-foreground`.
 */
export const tokenClasses: Record<string, string> = {
  [slot("background")]: "text-code-background",
  [slot("keyword")]: "text-code-keyword",
  [slot("string")]: "text-code-string",
  [slot("constant")]: "text-code-constant",
  [slot("function")]: "text-code-function",
  [slot("comment")]: "text-code-comment",
  [slot("link")]: "text-code-link",
  [slot("inserted")]: "text-code-inserted",
  [slot("deleted")]: "text-code-deleted",
  [slot("changed")]: "text-code-changed",
  [slot("active-line")]: "text-code-active-line",
};

/** Shiki's `fontStyle` is a bit field: italic 1, bold 2, underline 4. */
const BOLD = 2;
const UNDERLINE = 4;

/** The class a token renders with: its slot's utility, `font-medium` for bold, `underline` for underline. Empty for a foreground token. */
export function tokenClass(
  token: Pick<ThemedToken, "color" | "fontStyle">,
): string {
  const classes: string[] = [];
  const colour = token.color ? tokenClasses[token.color] : undefined;
  if (colour) classes.push(colour);
  const bits = token.fontStyle ?? 0;
  if (bits > 0 && (bits & BOLD) !== 0) classes.push("font-medium");
  if (bits > 0 && (bits & UNDERLINE) !== 0) classes.push("underline");
  return classes.join(" ");
}

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  svelte: () => import("shiki/langs/svelte.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
};

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
};

let highlighter: Promise<HighlighterCore> | undefined;

/** Core and the JavaScript engine, loaded once, on first use. */
async function getHighlighter() {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
      await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
      ]);
    return createHighlighterCore({
      themes: [codeTheme],
      langs: [],
      // Forgiving: only the Python grammar was proven strict-clean.
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    });
  })();
  return highlighter;
}

function getLanguage(language: string) {
  const name = language.toLowerCase();
  if (name in languages) return name as keyof typeof languages;
  return aliases[name] ?? null;
}

/** One highlighted token. Render it as a `<span>` with this class. */
export type HighlightedToken = {
  content: string;
  /** The token's classes, or "" for a token in the foreground slot. */
  class: string;
};

/** A line of plain text, or the highlighted tokens of a line. */
export type HighlightedLine = string | HighlightedToken[];

function toHighlightedLine(tokens: ThemedToken[]): HighlightedToken[] {
  return tokens.map((token) => ({
    content: token.content,
    class: tokenClass(token),
  }));
}

export type Highlighter = NonNullable<
  Awaited<ReturnType<typeof loadHighlighter>>
>;

/**
 * Loads a language and returns a highlighter for it, or null for a language
 * that is not listed. A null highlighter costs nothing: Shiki is not loaded.
 */
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language);
  if (!lang) return null;

  const shiki = await getHighlighter();
  if (!shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang]);
  }

  return {
    /**
     * Returns the tokens of each line, and the grammar state after the last
     * line. Pass that state back to continue where the code left off.
     */
    highlight(code: string, state?: GrammarState) {
      const result = shiki.codeToTokens(code, {
        lang,
        theme: THEME,
        grammarState: state,
      });
      return {
        lines: result.tokens.map((line) => toHighlightedLine(line)),
        state: shiki.getLastGrammarState(result.tokens),
      };
    },
  };
}

/** Returns the tokens of each line, or null for a language that is not listed. For a server `load`. */
export async function highlightCode(code: string, language: string) {
  const loaded = await loadHighlighter(language);
  return loaded ? loaded.highlight(code).lines : null;
}
