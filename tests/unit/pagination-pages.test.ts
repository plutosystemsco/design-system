/**
 * 027b tests 8 to 12: pagination's page range, `paginationPages`, pure.
 * Above `2 × siblings + 5` pages the list always holds that many slots, so
 * the row keeps its width as the page moves; an ellipsis never stands for
 * one page.
 */
import { describe, expect, test } from "bun:test";
import {
  paginationPages,
  type PaginationItem,
} from "../../src/lib/registry/ui/pagination/pagination-pages.ts";

/** A range as the row reads: page numbers, and "…" for an ellipsis. */
const row = (items: PaginationItem[]) =>
  items.map((i) => (i.type === "page" ? String(i.page) : "…")).join(" ");

describe("027b tests 8 to 12: paginationPages", () => {
  test("8. every page when they fit: (3, 7, 1) gives 1 to 7, with no ellipsis", () => {
    expect(row(paginationPages(3, 7, 1))).toBe("1 2 3 4 5 6 7");
    // At the limit, 2 × siblings + 5, still every page.
    expect(row(paginationPages(1, 9, 2))).toBe("1 2 3 4 5 6 7 8 9");
    expect(row(paginationPages(3, 5, 0))).toBe("1 2 3 4 5");
  });

  test("9. a fixed seven slots above that: every page of 12 gives 7 items", () => {
    for (let page = 1; page <= 12; page++)
      expect(paginationPages(page, 12, 1), `page ${page}`).toHaveLength(7);
    expect(row(paginationPages(1, 12, 1))).toBe("1 2 3 4 5 … 12");
    expect(row(paginationPages(5, 12, 1))).toBe("1 … 4 5 6 … 12");
    expect(row(paginationPages(12, 12, 1))).toBe("1 … 8 9 10 11 12");
  });

  test("10. an ellipsis never hides one page: (4, 8, 1) shows page 2", () => {
    expect(row(paginationPages(4, 8, 1))).toBe("1 2 3 4 5 … 8");
    // Over every case up to 30 pages, an ellipsis stands for 2 or more.
    for (const siblings of [0, 1, 2] as const)
      for (let pages = 1; pages <= 30; pages++)
        for (let page = 1; page <= pages; page++) {
          const items = paginationPages(page, pages, siblings);
          items.forEach((it, i) => {
            if (it.type !== "ellipsis") return;
            const before = items[i - 1] as { page: number };
            const after = items[i + 1] as { page: number };
            expect(
              after.page - before.page - 1,
              `${page} of ${pages}, siblings ${siblings}`,
            ).toBeGreaterThanOrEqual(2);
          });
          // The current page, the first and the last always show.
          const shown = items.flatMap((it) =>
            it.type === "page" ? [it.page] : [],
          );
          expect(shown).toContain(page);
          expect(shown[0]).toBe(1);
          expect(shown[shown.length - 1]).toBe(pages);
          if (pages > 2 * siblings + 5)
            expect(items).toHaveLength(2 * siblings + 5);
        }
  });

  test("11. siblings change it: (10, 20, 2) gives 9 items, (10, 20, 0) gives 5", () => {
    expect(row(paginationPages(10, 20, 2))).toBe("1 … 8 9 10 11 12 … 20");
    expect(paginationPages(10, 20, 2)).toHaveLength(9);
    expect(row(paginationPages(10, 20, 0))).toBe("1 … 10 … 20");
    expect(paginationPages(10, 20, 0)).toHaveLength(5);
  });

  test("12. out of range is clamped; 1 or 0 pages give one page", () => {
    expect(paginationPages(0, 5, 1)).toEqual(paginationPages(1, 5, 1));
    expect(paginationPages(9, 5, 1)).toEqual(paginationPages(5, 5, 1));
    expect(paginationPages(0, 12, 1)).toEqual(paginationPages(1, 12, 1));
    expect(paginationPages(99, 12, 1)).toEqual(paginationPages(12, 12, 1));
    expect(paginationPages(1, 1, 1)).toEqual([{ type: "page", page: 1 }]);
    expect(paginationPages(1, 0, 1)).toEqual([{ type: "page", page: 1 }]);
  });

  // The review's finding 9: a keyed `each` moves no surviving node when the
  // keys two rows share come in the same order. So a pressed page keeps its
  // node, and its focus, across every range change; the item restores none.
  test("the keys two rows share keep one order, for every pair of pages", () => {
    const key = (i: PaginationItem) =>
      i.type === "page" ? String(i.page) : i.key;
    for (const siblings of [0, 1, 2] as const)
      for (let pages = 1; pages <= 30; pages++) {
        const rows = Array.from({ length: pages }, (_, p) =>
          paginationPages(p + 1, pages, siblings).map(key),
        );
        for (const a of rows)
          for (const b of rows) {
            const shared = a.filter((k) => b.includes(k));
            expect(
              b.filter((k) => shared.includes(k)),
              `${pages} pages, siblings ${siblings}: ${a.join(" ")} / ${b.join(" ")}`,
            ).toEqual(shared);
          }
      }
  });

  test("each ellipsis has a key of its own, so a keyed each never repeats one", () => {
    const keys = paginationPages(5, 12, 1).flatMap((i) =>
      i.type === "ellipsis" ? [i.key] : [],
    );
    expect(keys).toEqual(["start", "end"]);
  });
});
