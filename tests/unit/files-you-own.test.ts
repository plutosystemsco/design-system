/**
 * 015 decision 15 and criterion 16: the files an item writes into an app,
 * and what it brings, generated from registry.json.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { withListedItems } from "../../src/lib/site/items.ts";
import { appPath, filesYouOwn, related } from "../../src/lib/site/files.ts";

type Item = {
  name: string;
  files: { path: string; type: string; target?: string }[];
  registryDependencies?: string[];
};
const registry = withListedItems(
  JSON.parse(readFileSync("registry.json", "utf8")),
) as {
  items: Item[];
};

describe("015: files you own, and what an item brings", () => {
  test("for 78 of 78 items, the list is registry.json's files through the alias map", () => {
    let n = 0;
    for (const item of registry.items) {
      const list = filesYouOwn(item);
      expect(list).toEqual(item.files.map((f) => appPath(f)));
      for (const p of list) {
        expect(p.startsWith("src/lib/") || p.startsWith("src/routes/")).toBe(
          true,
        );
        expect(p).not.toContain("/registry/");
      }
      n++;
    }
    expect(n).toBe(78);
  });

  test("the alias map: ui, components, hooks and lib", () => {
    expect(
      appPath({
        path: "src/lib/registry/ui/button/button.svelte",
        type: "registry:ui",
      }),
    ).toBe("src/lib/components/ui/button/button.svelte");
    expect(
      appPath({
        path: "src/lib/registry/hooks/is-mobile.svelte.ts",
        type: "registry:hook",
      }),
    ).toBe("src/lib/hooks/is-mobile.svelte.ts");
    expect(
      appPath({
        path: "src/lib/registry/lib/highlighter.ts",
        type: "registry:lib",
      }),
    ).toBe("src/lib/highlighter.ts");
    expect(appPath({ path: "src/lib/utils.ts", type: "registry:lib" })).toBe(
      "src/lib/utils.ts",
    );
  });

  test('"It brings" and "Brought by" agree with registryDependencies, both ways', () => {
    for (const item of registry.items) {
      const r = related(item.name, registry.items);
      expect(r.brings).toEqual(item.registryDependencies ?? []);
      for (const other of r.broughtBy) {
        const o = registry.items.find((i) => i.name === other)!;
        expect(o.registryDependencies ?? []).toContain(item.name);
      }
      const expected = registry.items
        .filter((i) => (i.registryDependencies ?? []).includes(item.name))
        .map((i) => i.name);
      expect(r.broughtBy).toEqual(expected);
    }
  });
});
