/**
 * Matching and ranking (018 decision 8), case-insensitive. A field matches
 * only where one of its words starts with the query, never inside a word.
 * The ranks:
 *
 * 1. a title that starts with the query;
 * 2. a word in the title that starts with it;
 * 3. an alias that starts with it;
 * 4. a word in the summary that starts with it.
 *
 * Ties keep the index's order. The palette groups the results by door, and
 * marks the matched text.
 */
import { DOORS, type DoorId } from "./doors.ts";
import type { SearchEntry } from "./search/types.ts";

export type SearchRank = 1 | 2 | 3 | 4;

/** An entry that matched: its rank, and the alias that matched it, if rank 3. */
export type SearchHit = SearchEntry & { rank: SearchRank; alias?: string };

const WORD = /[\p{L}\p{N}]/u;

/** Each index in `text` (lower-cased) where `q` starts a word. */
function wordStarts(text: string, q: string): number[] {
  const out: number[] = [];
  for (let i = text.indexOf(q); i >= 0; i = text.indexOf(q, i + 1))
    if (i === 0 || !WORD.test(text[i - 1]!)) out.push(i);
  return out;
}

function rankOf(
  e: SearchEntry,
  q: string,
): Omit<SearchHit, keyof SearchEntry> | null {
  const title = e.title.toLowerCase();
  if (title.startsWith(q)) return { rank: 1 };
  if (wordStarts(title, q).length) return { rank: 2 };
  const alias = e.aliases?.find((a) => wordStarts(a.toLowerCase(), q).length);
  if (alias) return { rank: 3, alias };
  if (wordStarts(e.summary.toLowerCase(), q).length) return { rank: 4 };
  return null;
}

export function search(entries: SearchEntry[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries
    .map((e, i) => ({ e, i, r: rankOf(e, q) }))
    .filter((x) => x.r !== null)
    .sort((a, b) => a.r!.rank - b.r!.rank || a.i - b.i)
    .map((x) => ({ ...x.e, ...x.r! }));
}

/** `text` in runs, each word-start match of `query` a marked run. */
export function marks(
  text: string,
  query: string,
): { text: string; mark: boolean }[] {
  const q = query.trim().toLowerCase();
  const at = q ? wordStarts(text.toLowerCase(), q) : [];
  const out: { text: string; mark: boolean }[] = [];
  let from = 0;
  for (const i of at) {
    if (i < from) continue;
    if (i > from) out.push({ text: text.slice(from, i), mark: false });
    out.push({ text: text.slice(i, i + q.length), mark: true });
    from = i + q.length;
  }
  if (from < text.length || !out.length)
    out.push({ text: text.slice(from), mark: false });
  return out;
}

export type SearchGroup = {
  /** The door, or null for the pages that have none ("Site"). */
  door: DoorId | null;
  name: string;
  hits: SearchHit[];
};

/** The hits under their doors, in the doors' order; "Site" last. Each keeps its rank order. */
export function groupHits(hits: SearchHit[]): SearchGroup[] {
  return (
    [
      ...DOORS.map((d) => ({ door: d.id, name: d.name })),
      { door: null, name: "Site" },
    ]
      .map((g, order) => ({
        ...g,
        order,
        hits: hits.filter((h) => h.door === g.door),
      }))
      .filter((g) => g.hits.length)
      // 018 change review: a group comes in the order of its best match, then
      // the doors' order, so the first option, the active one, is the best.
      .sort(
        (a, b) =>
          Math.min(...a.hits.map((h) => h.rank)) -
            Math.min(...b.hits.map((h) => h.rank)) || a.order - b.order,
      )
      .map(({ order: _order, ...g }) => g)
  );
}

/** A component page's item name; null for every other entry. */
export function componentName(e: SearchEntry): string | null {
  return /^\/components\/([^/#]+)\/$/.exec(e.path)?.[1] ?? null;
}

/** One key in the palette's legend: what it shows, what is said, and what it does. */
export type LegendKey = { keys: string[]; spoken: string; does: string };

/** The legend: 3 keys, and the copy key on a component result. */
export function keyLegend(component: boolean, mac: boolean): LegendKey[] {
  return [
    { keys: ["↑", "↓"], spoken: "Up and down arrows", does: "move" },
    { keys: ["↵"], spoken: "Enter", does: "open" },
    { keys: ["Esc"], spoken: "Escape", does: "close" },
    ...(component
      ? [
          {
            keys: mac ? ["⌘", "C"] : ["Ctrl", "C"],
            spoken: mac ? "Command C" : "Control C",
            does: "copy the add command",
          },
        ]
      : []),
  ];
}
