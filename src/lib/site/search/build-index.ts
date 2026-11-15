/**
 * The search index, built from every source module. Pure: the endpoint
 * passes the modules its glob finds, and the unit test the modules it reads
 * from the folder. Page entries keep the page list's order; anchor entries
 * follow, in the order their sources give them. A path appears once.
 */
import type { SearchEntry, SearchSource } from "./types.ts";

export function buildIndex(sources: SearchSource[]): SearchEntry[] {
  const all = sources.flatMap((s) => s.entries());
  const seen = new Set<string>();
  const out: SearchEntry[] = [];
  for (const e of [
    ...all.filter((e) => !e.path.includes("#")),
    ...all.filter((e) => e.path.includes("#")),
  ]) {
    if (seen.has(e.path)) continue;
    seen.add(e.path);
    out.push(e);
  }
  return out;
}
