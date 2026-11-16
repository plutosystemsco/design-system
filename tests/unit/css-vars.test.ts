/**
 * 023 test 6: every `var()` in an item file names a variable that the item
 * itself, the theme item, a font item, Tailwind's default theme or bits-ui
 * defines, or that a declared dynamic prefix expands to.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { itemFiles } from "../../scripts/lint-literals.ts";
import { CODE_ROLES } from "../../src/lib/registry/lib/highlight/roles.ts";
import {
  definedSources,
  undefinedVars,
  type Census,
  type Prefix,
} from "../helpers/css-vars.ts";

/** Decision 10's one dynamic prefix: Shiki's theme reads a variable per role. */
const PREFIXES: Prefix[] = [
  {
    file: "src/lib/registry/lib/highlight/shiki.ts",
    prefix: "--code-",
    names: CODE_ROLES,
  },
];

const SOURCES = definedSources(process.cwd(), PREFIXES);
const read = (p: string) => ({ path: p, text: readFileSync(p, "utf8") });
const fixture = (name: string) => [
  read(`tests/unit/fixtures/css-vars/${name}`),
];

describe("023 test 6: every var() in an item file names a defined variable", () => {
  const files = [...new Set(itemFiles())].map(read);
  const census: Census = { refs: 0, bySource: {} };
  const faults = undefinedVars(files, SOURCES, census);

  test("0 item files read an undefined variable", () => {
    expect(faults).toEqual([]);
  });

  test("it reads at least 80 references, and each of sources 2 to 6 defines one", () => {
    expect(census.refs).toBeGreaterThanOrEqual(80);
    for (const s of [2, 3, 4, 5, 6])
      expect(census.bySource[s] ?? 0, `source ${s}`).toBeGreaterThan(0);
  });

  test("a misspelt name is reported with its file and line", () => {
    expect(undefinedVars(fixture("misspelled.svelte"), SOURCES)).toEqual([
      "misspelled.svelte:5 --radius-actoin",
    ]);
  });

  test("the typed shorthand is read", () => {
    expect(undefinedVars(fixture("typed.svelte"), SOURCES)).toEqual([
      "typed.svelte:5 --focus-widht",
    ]);
  });

  test("a variable the file sets itself is defined (source 1)", () => {
    const census: Census = { refs: 0, bySource: {} };
    expect(undefinedVars(fixture("local.svelte"), SOURCES, census)).toEqual([]);
    expect(census.bySource[1]).toBe(1);
  });

  test("bits-ui's names match whole", () => {
    expect(undefinedVars(fixture("bits.svelte"), SOURCES)).toEqual([
      "bits.svelte:7 --bits-popover-content-wobble",
      "bits.svelte:8 --bits-popovr-content-transform-origin",
      "bits.svelte:9 --bits-dropdown-menu-content-transform-origi",
    ]);
  });

  test("an undeclared dynamic prefix fails", () => {
    expect(undefinedVars(fixture("dynamic.ts"), SOURCES)).toEqual([
      "dynamic.ts:2 --nope- (an undeclared prefix)",
    ]);
  });
});
