import { highlightCode } from "#lib/registry/lib/highlighter";
import type { PageServerLoad } from "./$types";
import { DIFF, INSTALL, LONG, SUDOKU } from "./snippets";

/**
 * The snippets are highlighted here, at prerender, with `highlightCode`, so
 * the page ships the token data and no Shiki (004 decision 16).
 */
export const load: PageServerLoad = async () => ({
  install: await highlightCode(INSTALL, "bash"),
  python: await highlightCode(SUDOKU, "python"),
  diff: await highlightCode(DIFF, "python"),
  long: await highlightCode(LONG, "python"),
  code: { install: INSTALL, python: SUDOKU },
});
