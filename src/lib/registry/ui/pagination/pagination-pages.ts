/**
 * One slot of pagination's row: a page, or an ellipsis that stands for two
 * or more pages. Each ellipsis has a key of its own, so a keyed `each` keeps
 * the two apart.
 */
export type PaginationItem =
  { type: "page"; page: number } | { type: "ellipsis"; key: "start" | "end" };

const pageItem = (page: number): PaginationItem => ({ type: "page", page });

/** Pages `from` to `to`, each a slot. */
const run = (from: number, to: number): PaginationItem[] =>
  Array.from({ length: to - from + 1 }, (_, i) => pageItem(from + i));

/**
 * The slots of the page row: the first page, the last, the current one and
 * `siblings` either side of it. With `2 × siblings + 5` pages or fewer,
 * every page shows. Above that, the row always holds exactly that many
 * slots, so its width does not change as the page moves, and an ellipsis
 * never stands for a single page: that page shows instead. `page` is
 * clamped to 1 to `pages`; 1 or fewer pages give one page.
 */
export function paginationPages(
  page: number,
  pages: number,
  siblings: 0 | 1 | 2 = 1,
): PaginationItem[] {
  const total = Number.isFinite(pages) ? Math.max(1, Math.floor(pages)) : 1;
  const wanted = Number.isFinite(page) ? Math.round(page) : 1;
  const current = Math.min(Math.max(1, wanted), total);
  const slots = 2 * siblings + 5;
  if (total <= slots) return run(1, total);
  // Near the start: the first slots - 2 pages, an ellipsis and the last.
  if (current <= siblings + 3)
    return [
      ...run(1, slots - 2),
      { type: "ellipsis", key: "end" },
      pageItem(total),
    ];
  // Near the end: the first page, an ellipsis and the last slots - 2.
  if (current >= total - siblings - 2)
    return [
      pageItem(1),
      { type: "ellipsis", key: "start" },
      ...run(total - slots + 3, total),
    ];
  return [
    pageItem(1),
    { type: "ellipsis", key: "start" },
    ...run(current - siblings, current + siblings),
    { type: "ellipsis", key: "end" },
    pageItem(total),
  ];
}
