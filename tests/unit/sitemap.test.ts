/**
 * 015 decision 1: one list of pages. Counts read the list, filtered by
 * `spec` where a check is 015's alone, never a literal page count.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { DOORS } from "../../src/lib/site/doors.ts";
import { componentPath, GROUPS, SITEMAP } from "../../src/lib/site/sitemap.ts";

const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: { name: string; title: string; meta: { group: string } }[];
};

describe("015: the page list", () => {
  const own = SITEMAP.filter((p) => p.spec === "015");

  test("015's entries are 81: home, 4 landings, 75 components and the changelog", () => {
    expect(own).toHaveLength(1 + DOORS.length + registry.items.length + 1);
    expect(own).toHaveLength(81);
  });

  test("0 paths are duplicated", () => {
    const paths = SITEMAP.map((p) => p.path);
    expect(paths.filter((p, i) => paths.indexOf(p) !== i)).toEqual([]);
  });

  test("every path starts and ends with a slash, and every parent is an entry", () => {
    const paths = new Set(SITEMAP.map((p) => p.path));
    for (const p of SITEMAP) {
      expect(p.path).toMatch(/^\/(.*\/)?$/);
      if (p.parent !== null) expect(paths.has(p.parent)).toBe(true);
    }
  });

  test("each door's landing is an entry, in the door's name", () => {
    for (const d of DOORS) {
      const entry = SITEMAP.find((p) => p.path === d.path);
      expect(entry?.title).toBe(d.name);
      expect(entry?.door).toBe(d.id);
    }
  });

  test("75 component entries, in the registry's order, each titled and grouped as the registry says", () => {
    const components = SITEMAP.filter((p) => p.parent === "/components/");
    expect(components.map((p) => p.path)).toEqual(
      registry.items.map((i) => componentPath(i.name)),
    );
    for (const [i, item] of registry.items.entries()) {
      expect(components[i].title).toBe(item.title);
      expect(components[i].group).toBe(item.meta.group);
    }
    expect(GROUPS.map((g) => g.id)).toEqual([
      ...new Set(registry.items.map((i) => i.meta.group)),
    ]);
  });

  test("every entry has a one-sentence summary", () => {
    for (const p of SITEMAP) expect(p.summary.length).toBeGreaterThan(0);
  });
});

describe("015 criterion 4: no old address", () => {
  const OLD = "/" + "items/";
  test(`0 occurrences of "${OLD}" in src/, tests/ and scripts/`, () => {
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const full = path.join(dir, e);
        if (e === "node_modules" || e.startsWith(".")) return [];
        return statSync(full).isDirectory() ? files(full) : [full];
      });
    const hits = ["src", "tests", "scripts"]
      .flatMap(files)
      .filter((f) => !/\.(png|wasm|woff2?)$/.test(f))
      .filter((f) => readFileSync(f, "utf8").includes(OLD));
    expect(hits).toEqual([]);
  });
});

describe("017: the page list", () => {
  const added = SITEMAP.filter((p) => p.spec === "017");
  const under = (door: string) =>
    added.filter((p) => p.door === door).map((p) => p.path);

  test("7 Foundations pages", () => {
    expect(under("foundations")).toEqual([
      "/foundations/tokens/",
      "/foundations/colour/",
      "/foundations/type/",
      "/foundations/space-and-shape/",
      "/foundations/motion/",
      "/foundations/accessibility/",
      "/foundations/code/",
    ]);
  });

  test("9 Brand pages", () => {
    expect(under("brand")).toEqual([
      "/brand/mark/",
      "/brand/colour/",
      "/brand/type/",
      "/brand/surfaces/",
      "/brand/motion/",
      "/brand/imagery/",
      "/brand/voice/",
      "/brand/products/",
      "/brand/downloads/",
    ]);
  });

  test("5 Start pages", () => {
    expect(under("start")).toEqual([
      "/start/install/",
      "/start/theme/",
      "/start/light-and-dark/",
      "/start/modes/",
      "/start/your-product/",
    ]);
  });

  test("21 entries tagged 017, 102 in all, each under its door's landing", () => {
    expect(added).toHaveLength(21);
    expect(SITEMAP).toHaveLength(102);
    for (const p of added) expect(p.parent).toBe(`/${p.door}/`);
  });
});
