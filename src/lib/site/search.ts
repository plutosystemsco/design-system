/**
 * Matching and ranking, case-insensitive: a title that starts with the
 * query, then a word in the title that starts with it, then the summary.
 * Ties keep the index's order.
 */
import type { SearchEntry } from "./search/types.ts";

export function search(entries: SearchEntry[], query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const rank = (e: SearchEntry): number => {
    const title = e.title.toLowerCase();
    if (title.startsWith(q)) return 0;
    if (title.split(/[\s,.:;()/-]+/).some((w) => w.startsWith(q))) return 1;
    if (e.summary.toLowerCase().includes(q)) return 2;
    return -1;
  };
  return entries
    .map((e, i) => ({ e, i, r: rank(e) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.e);
}
