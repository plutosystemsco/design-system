/**
 * The colour page's contrast rows: `contrastTable` in both themes (017
 * decision 6). Server-only: `scripts/contrast.ts` stays out of the browser.
 */
import {
  contrastTable,
  type ContrastRow,
} from "../../../../scripts/contrast.ts";
import type { Tokens } from "../../../../scripts/tokens.ts";

export function colourRows(tokens: Tokens): ContrastRow[] {
  return [...contrastTable(tokens, "light"), ...contrastTable(tokens, "dark")];
}
