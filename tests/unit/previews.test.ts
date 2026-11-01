import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const names: string[] = registry.items.map((i: { name: string }) => i.name);
const page = (name: string) => `src/routes/(site)/items/${name}/+page.svelte`;

// 005 decision 17: 60 items.
const COUNT = 60;

test(`the registry has ${COUNT} items`, () => {
  expect(names).toHaveLength(COUNT);
});

test(`${COUNT} of ${COUNT} items have a preview page under (site)/items/`, () => {
  expect(names.filter((name) => existsSync(page(name)))).toHaveLength(COUNT);
});

test.each(names)("%s has a preview page", (name) => {
  expect(existsSync(page(name))).toBe(true);
});
