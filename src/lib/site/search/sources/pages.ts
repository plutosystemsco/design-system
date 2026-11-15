/**
 * The page entries: one per page in the page list. A component page takes
 * its title and description from registry.json, and its group as its
 * summary's lead; every other page its title and summary from the list.
 */
import { GROUPS, SITEMAP } from "../../sitemap.ts";
import type { SearchEntry } from "../types.ts";

export function entries(): SearchEntry[] {
  return SITEMAP.map((p) => ({
    path: p.path,
    title: p.title,
    door: p.door,
    summary: p.group
      ? `${GROUPS.find((g) => g.id === p.group)?.title}. ${p.summary}`
      : p.summary,
  }));
}
