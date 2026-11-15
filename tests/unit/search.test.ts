/**
 * 015 decision 18, criterion 21: the index builder and the ranking, from
 * source. The source modules are found with node:fs, as the endpoint's glob
 * would find them.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import path from "node:path";
import { search } from "../../src/lib/site/search.ts";
import { buildIndex } from "../../src/lib/site/search/build-index.ts";
import type { SearchSource } from "../../src/lib/site/search/types.ts";
import { SITEMAP } from "../../src/lib/site/sitemap.ts";

const DIR = "src/lib/site/search/sources";
const SOURCES: SearchSource[] = await Promise.all(
  readdirSync(DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => import(path.resolve(DIR, f))),
);

describe("015: the search index", () => {
  const index = buildIndex(SOURCES);

  test("every module in search/sources/ loads under Bun", () => {
    expect(SOURCES.length).toBeGreaterThanOrEqual(1);
    for (const s of SOURCES) expect(typeof s.entries).toBe("function");
  });

  test("its page entries equal the page list, each path once", () => {
    const pages = index.filter((e) => !e.path.includes("#")).map((e) => e.path);
    expect(pages).toEqual(SITEMAP.map((p) => p.path));
    expect(new Set(index.map((e) => e.path)).size).toBe(index.length);
    expect(SITEMAP.filter((p) => p.spec === "015")).toHaveLength(81);
  });

  test('"dial" ranks Dialog first, and "but" ranks Button first', () => {
    expect(search(index, "dial")[0]?.title).toBe("Dialog");
    expect(search(index, "but")[0]?.title).toBe("Button");
  });

  test("matching is case-insensitive; a title's start, then a word's, then the summary", () => {
    expect(search(index, "DIAL")[0]?.title).toBe("Dialog");
    const r = search(index, "menu");
    expect(
      r[0]?.title.toLowerCase().startsWith("menu") ||
        r[0]?.title.toLowerCase().includes(" menu"),
    ).toBe(true);
    expect(search(index, "zzzz")).toEqual([]);
  });
});

describe("017 decision 10: the token entries", () => {
  const index = buildIndex(SOURCES);
  const anchors = index.filter((e) =>
    e.path.startsWith("/foundations/tokens/#"),
  );

  test("search/sources/ holds 2 modules, pages and tokens", () => {
    expect(
      readdirSync(DIR)
        .filter((f) => f.endsWith(".ts"))
        .sort(),
    ).toEqual(["pages.ts", "tokens.ts"]);
  });

  test("1 anchor entry for every theme role and every primitive, each once", async () => {
    const { readTokens } = await import("../../scripts/tokens.ts");
    const tokens = readTokens();
    const names = [
      ...Object.keys(tokens.primitives).map((n) => `primitive-${n}`),
      ...Object.keys(tokens.themes.light),
    ];
    expect(anchors.map((e) => e.path.split("#")[1]).sort()).toEqual(
      names.sort(),
    );
    for (const e of anchors) {
      expect(e.door).toBe("foundations");
      expect(e.summary).toMatch(/^[A-Z].*\.$/);
    }
  });
});
