import { describe, expect, test } from "bun:test";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  dropShadowedDevDependencies,
  packageName,
  writeSiteItems,
} from "../../scripts/build-registry.ts";

/** 013 decision 5: the rule that keeps a dependency out of devDependencies. */
describe("packageName", () => {
  test.each([
    ["shiki", "shiki"],
    ["shiki@^4.5.0", "shiki"],
    ["name@^1.2.3", "name"],
    [
      "@tree-sitter-grammars/tree-sitter-svelte",
      "@tree-sitter-grammars/tree-sitter-svelte",
    ],
    [
      "@tree-sitter-grammars/tree-sitter-svelte@~1.0.2",
      "@tree-sitter-grammars/tree-sitter-svelte",
    ],
  ])("%s is %s", (spec, name) => {
    expect(packageName(spec)).toBe(name);
  });
});

describe("dropShadowedDevDependencies", () => {
  test("drops a devDependency the item names as a dependency, bare or versioned, and keeps the rest and the file's form", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "kuiper-shadowed-"));
    try {
      const item = {
        name: "x",
        dependencies: ["shiki", "@scope/a@^1.0.0"],
        devDependencies: ["shiki@^4.5.0", "@scope/a", "other@^2.0.0"],
      };
      writeFileSync(path.join(dir, "x.json"), JSON.stringify(item, null, "\t"));
      dropShadowedDevDependencies(dir);
      const text = readFileSync(path.join(dir, "x.json"), "utf8");
      expect(JSON.parse(text).devDependencies).toEqual(["other@^2.0.0"]);
      expect(text.endsWith("\n")).toBe(false);
      expect(text).toContain('\n\t"name"');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("024b: writeSiteItems", () => {
  test("writes the listed entries with exactly name, title, description and meta.group, and leaves an unchanged file alone", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "kuiper-site-items-"));
    try {
      const entry = (name: string, meta: object) => ({
        name,
        type: "registry:ui",
        title: `The ${name}`,
        description: `What ${name} is.`,
        author: "An author",
        registryDependencies: ["utils"],
        dependencies: ["bits-ui"],
        files: [{ path: `src/lib/registry/ui/${name}/${name}.svelte` }],
        meta,
      });
      writeFileSync(
        path.join(root, "registry.json"),
        JSON.stringify({
          name: "kuiper",
          items: [
            entry("kept", {
              group: "actions",
              since: "0.1.0",
              stock: { sha256: "0".repeat(64) },
            }),
            entry("alias", {
              group: "foundation",
              deprecated: { replacement: "kept", removedIn: "0.14.0" },
            }),
          ],
        }),
      );
      mkdirSync(path.join(root, "src", "lib", "site"), { recursive: true });
      const file = path.join(root, "src", "lib", "site", "listed-items.ts");

      expect(await writeSiteItems(root)).toBe(true);
      const { LISTED_ITEMS } = await import(file);
      expect(LISTED_ITEMS).toStrictEqual([
        {
          name: "kept",
          title: "The kept",
          description: "What kept is.",
          meta: { group: "actions" },
        },
      ]);

      const past = new Date("2026-01-01T00:00:00Z");
      utimesSync(file, past, past);
      expect(await writeSiteItems(root)).toBe(false);
      expect(statSync(file).mtimeMs).toBe(past.getTime());
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
