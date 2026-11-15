import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  dropShadowedDevDependencies,
  packageName,
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
    const dir = mkdtempSync(path.join(tmpdir(), "pluto-shadowed-"));
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
