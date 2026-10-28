import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const names: string[] = registry.items.map((i: { name: string }) => i.name);
const page = (name: string) => `src/routes/(site)/items/${name}/+page.svelte`;

test("the registry has 39 items", () => {
  expect(names).toHaveLength(39);
});

test("39 of 39 items have a preview page under (site)/items/", () => {
  expect(names.filter((name) => existsSync(page(name)))).toHaveLength(39);
});

test.each(names)("%s has a preview page", (name) => {
  expect(existsSync(page(name))).toBe(true);
});
