/**
 * Code highlighted in Meridian's roles (013). tree-sitter parses the 21
 * languages with a grammar, with queries this system writes; Shiki highlights
 * the other five and is the fallback of every one. A token renders as a
 * class, never a `style`: `tokenClass` gives a role's `text-code-<role>`.
 *
 * `highlightCode` is the one-shot form for a server `load`, so a prerendered
 * page ships no engine. `loadHighlighter` gives a highlighter whose sessions
 * the `useHighlightedCode` hook and the editor stream through. Both engines
 * are imported lazily, so a page that only renders the lines it was given
 * loads neither.
 *
 * Resolution: the table gives a name's id; a tree-sitter row whose runtime,
 * grammar and queries load gives tree-sitter; else Shiki; else null (plain).
 * No failure throws: it warns once and falls back.
 */
import {
  findHighlightLanguage,
  highlightLanguages,
  treeSitterLanguages,
  type HighlightLanguage,
} from "./highlight/languages";
import {
  CODE_ROLES,
  paintLines,
  roleClasses,
  tokenClass,
  type CodeRole,
  type HighlightChange,
  type HighlightedLine,
  type HighlightedToken,
  type HighlightRange,
  type HighlightSession,
} from "./highlight/roles";
import { openShiki, shikiTheme } from "./highlight/shiki";
import {
  loadTreeSitter,
  paintWhole,
  TreeSitterSession,
  warnFallback,
} from "./highlight/tree-sitter";

export {
  CODE_ROLES,
  findHighlightLanguage,
  highlightLanguages,
  roleClasses,
  shikiTheme,
  tokenClass,
};
export type {
  CodeRole,
  HighlightChange,
  HighlightedLine,
  HighlightedToken,
  HighlightLanguage,
  HighlightRange,
  HighlightSession,
};

/** A loaded language: its engine, a one-shot highlight and an incremental session. */
export type Highlighter = {
  id: string;
  engine: "tree-sitter" | "shiki";
  /** Every line's tokens, once every grammar the code embeds has loaded. */
  highlight(code: string): Promise<HighlightedLine[]>;
  /** A session over a changing document. */
  session(code: string): HighlightSession;
};

/** The id a fence's info names, for Markdown. */
function fenceLanguage(name: string): string | null {
  return findHighlightLanguage(name)?.id ?? null;
}

/** Waits until a session has nothing left to load. */
function settle(session: HighlightSession): Promise<void> {
  if (session.settled) return Promise.resolve();
  return new Promise((resolve) => {
    const stop = session.onChange(() => {
      // Repaint, so anything the new grammar embeds starts loading too.
      session.lines();
      if (session.settled) {
        stop();
        resolve();
      }
    });
  });
}

const highlighters = new Map<string, Promise<Highlighter | null>>();

/**
 * Loads a language and returns a highlighter for it, or null for a language
 * the table does not hold. A null highlighter costs nothing: no engine is
 * loaded.
 */
export function loadHighlighter(language: string): Promise<Highlighter | null> {
  const row = findHighlightLanguage(language);
  if (!row) return Promise.resolve(null);
  let pending = highlighters.get(row.id);
  if (!pending) {
    pending = open(row);
    highlighters.set(row.id, pending);
  }
  return pending;
}

async function open(row: HighlightLanguage): Promise<Highlighter | null> {
  if (row.engine === "tree-sitter" && !(row.id in treeSitterLanguages))
    warnFallback(row.id, new Error("no tree-sitter row for " + row.id));
  const compiled =
    row.id in treeSitterLanguages ? await loadTreeSitter(row.id) : null;
  if (compiled) {
    return {
      id: row.id,
      engine: "tree-sitter",
      async highlight(code) {
        return paintLines(code, await paintWhole(compiled, code));
      },
      session: (code) => new TreeSitterSession(compiled, code),
    };
  }
  const start = await openShiki(row.id, fenceLanguage).catch((cause) => {
    console.warn(
      "highlighter: " +
        row.id +
        " cannot load in Shiki (" +
        String(cause) +
        ")",
    );
    return null;
  });
  if (!start) return null;
  return {
    id: row.id,
    engine: "shiki",
    async highlight(code) {
      const session = start(code);
      session.lines();
      await settle(session);
      const lines = session.lines();
      session.dispose();
      return lines;
    },
    session: start,
  };
}

/**
 * Returns the tokens of each line, or null for a language the table does not
 * hold. It waits for every grammar the code embeds (an HTML block's script,
 * a Markdown fence), so a prerendered block is complete. For a server `load`.
 */
export async function highlightCode(
  code: string,
  language: string,
): Promise<HighlightedLine[] | null> {
  const highlighter = await loadHighlighter(language);
  return highlighter ? highlighter.highlight(code) : null;
}
