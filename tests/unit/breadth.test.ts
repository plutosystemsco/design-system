/**
 * 027 test 6: batch A's names meet the scorecard's reference parts. The
 * breadth script (`scripts/bench/breadth.ts`) matches the registry's
 * `registry:ui` and `registry:block` names against `REFERENCE_PARTS`; this
 * reads the same list and the working tree's `registry.json`, with no
 * browser and no network.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { REFERENCE_PARTS } from "../../scripts/bench/targets.ts";

type Item = { name: string; type: string };
const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: Item[];
};
const SLUGS = registry.items
  .filter((i) => i.type === "registry:ui" || i.type === "registry:block")
  .map((i) => i.name);

/** The reference parts a list of slugs covers. */
const covered = (slugs: string[]) =>
  REFERENCE_PARTS.filter(([, re]) => slugs.some((s) => re.test(s))).map(
    ([part]) => part,
  );
const partsOf = (slug: string) =>
  REFERENCE_PARTS.filter(([, re]) => re.test(slug)).map(([part]) => part);

/** 027a's three names. */
const PART_A = ["link", "button-group", "progress"];

describe("027 test 6: batch A's names meet REFERENCE_PARTS", () => {
  test("the list holds 40 parts", () => {
    expect(REFERENCE_PARTS).toHaveLength(40);
  });

  test("link and button-group each match exactly one part; progress matches progress / meter, which meter holds", () => {
    expect(partsOf("link")).toEqual(["link"]);
    expect(partsOf("button-group")).toEqual(["button group"]);
    expect(partsOf("progress")).toEqual(["progress / meter"]);
    expect(partsOf("meter")).toEqual(["progress / meter"]);
  });

  test("part a's items are registry:ui items in the working tree", () => {
    for (const name of PART_A) expect(SLUGS, name).toContain(name);
  });

  test("part a adds 2 hits: 31 of 40 without toast, 32 with it", () => {
    const without = SLUGS.filter((s) => !PART_A.includes(s));
    expect(covered(SLUGS).length - covered(without).length).toBe(2);
    const toast = SLUGS.includes("toast") ? 1 : 0;
    // 027b's three names add 3 more once they land.
    const partB = ["pagination", "search-field", "tag"].filter((n) =>
      SLUGS.includes(n),
    ).length;
    expect(covered(SLUGS).length).toBe(31 + toast + partB);
  });
});
