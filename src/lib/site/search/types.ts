/**
 * One entry of the site's search index. A page entry's path has no `#`; an
 * anchor entry's path ends in `#<id>`, an element on that built page.
 */
import type { DoorId } from "../doors.ts";

export type SearchEntry = {
  path: string;
  title: string;
  /** The door the entry belongs to; none for the home page and the changelog. */
  door: DoorId | null;
  /** One sentence. */
  summary: string;
};

/** A module in `search/sources/`: it gives entries, and imports no `$app/*`. */
export type SearchSource = { entries(): SearchEntry[] };
