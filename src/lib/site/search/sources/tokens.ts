/**
 * The token entries (017 decision 10): one anchor entry for each primitive
 * and each theme role, at its row on `/foundations/tokens/`, titled with its
 * name and summarised with its job. 021 decision 14: the five token files
 * are imported and lowered, as the build reads them.
 */
import { lowerTokens } from "../../../../../scripts/tokens.ts";
import contrast from "../../../../../tokens/kuiper.contrast.json";
import dark from "../../../../../tokens/kuiper.dark.tokens.json";
import light from "../../../../../tokens/kuiper.light.tokens.json";
import resolver from "../../../../../tokens/kuiper.resolver.json";
import base from "../../../../../tokens/kuiper.tokens.json";
import { tokenRows } from "../../foundations/tables.ts";
import type { SearchEntry } from "../types.ts";

export function entries(): SearchEntry[] {
  const tokens = lowerTokens({
    "kuiper.resolver.json": resolver,
    "kuiper.tokens.json": base,
    "kuiper.light.tokens.json": light,
    "kuiper.dark.tokens.json": dark,
    "kuiper.contrast.json": contrast,
  });
  return tokenRows(tokens).map((r) => ({
    path: `/foundations/tokens/#${r.id}`,
    title: r.kind === "role" ? `--${r.name}` : r.name,
    door: "foundations",
    summary: r.words.replaceAll("`", ""),
  }));
}
