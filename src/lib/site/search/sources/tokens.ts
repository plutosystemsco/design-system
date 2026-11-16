/**
 * The token entries (017 decision 10): one anchor entry for each primitive
 * and each theme role, at its row on `/foundations/tokens/`, titled with its
 * name and summarised with its job.
 */
import type { Tokens } from "../../../../../scripts/tokens.ts";
import raw from "../../../../../tokens/kuiper.tokens.json";
import { tokenRows } from "../../foundations/tables.ts";
import type { SearchEntry } from "../types.ts";

export function entries(): SearchEntry[] {
  return tokenRows(raw as unknown as Tokens).map((r) => ({
    path: `/foundations/tokens/#${r.id}`,
    title: r.kind === "role" ? `--${r.name}` : r.name,
    door: "foundations",
    summary: r.words.replaceAll("`", ""),
  }));
}
