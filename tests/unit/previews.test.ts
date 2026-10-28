import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const names: string[] = registry.items.map((i: { name: string }) => i.name);

test("the registry has 6 items", () => {
  expect(names).toHaveLength(6);
});

test.each(names)("%s has a preview page", (name) => {
  expect(existsSync(`src/routes/items/${name}/+page.svelte`)).toBe(true);
});
