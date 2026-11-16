import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { withListedItems } from "../../src/lib/site/items.ts";

const registry = withListedItems(
  JSON.parse(readFileSync("registry.json", "utf8")),
);
const names: string[] = registry.items.map((i: { name: string }) => i.name);
const page = (name: string) =>
  `src/routes/(site)/components/${name}/+page.svelte`;

// 006 decision 3, 007 decision 7, 009 decision 10, 010 decision 1, 011 decision 8 027a decision 1 and 026: 79 items.
const COUNT = 79;

test(`the registry has ${COUNT} items`, () => {
  expect(names).toHaveLength(COUNT);
});

test(`${COUNT} of ${COUNT} items have a page under (site)/components/`, () => {
  expect(names.filter((name) => existsSync(page(name)))).toHaveLength(COUNT);
});

test.each(names)("%s has a page under (site)/components/", (name) => {
  expect(existsSync(page(name))).toBe(true);
});
