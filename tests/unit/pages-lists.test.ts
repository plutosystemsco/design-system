/**
 * 023a's change review, found at 022's merge: `tests/e2e/pages.ts`'s hand
 * list of items lacked `toast`, so every spec that walks the component pages
 * missed one. The browser suites' lists must agree with the sitemap.
 */
import { describe, expect, test } from "bun:test";
import { componentPath, doorPages } from "../../src/lib/site/sitemap.ts";
import { COMPONENT_PAGES, ITEMS, PAGES_002 } from "../e2e/pages.ts";

const SITEMAP_PAGES = doorPages("components").map((p) => p.path);

describe("the browser suites' item lists agree with the sitemap", () => {
  test("ITEMS names every component page of the sitemap, once, and no other", () => {
    expect(new Set(ITEMS).size).toBe(ITEMS.length);
    expect(ITEMS.map(componentPath).sort()).toEqual([...SITEMAP_PAGES].sort());
  });

  test("COMPONENT_PAGES is the sitemap's component pages", () => {
    expect(COMPONENT_PAGES).toEqual(SITEMAP_PAGES);
    expect(COMPONENT_PAGES).toContain("/components/toast/");
  });

  test("toast is 026's, not 002's", () => {
    expect(PAGES_002).not.toContain("/components/toast/");
  });
});
