import { highlightCode } from "#lib/registry/lib/highlighter";
import { DIFF, INSTALL, LONG, SUDOKU } from "./snippets";

/**
 * The snippets are highlighted here, at prerender, with `highlightCode`, so
 * the page ships the token data and no Shiki. The install snippet is
 * `terminal`, not `install`: the components layout's `install` holds the
 * page's own install commands.
 */
export async function load() {
  return {
    terminal: await highlightCode(INSTALL, "bash"),
    python: await highlightCode(SUDOKU, "python"),
    diff: await highlightCode(DIFF, "python"),
    long: await highlightCode(LONG, "python"),
    code: { terminal: INSTALL, python: SUDOKU },
  };
}
