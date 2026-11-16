/**
 * 018 decision 4, criterion 7: "Updated", on every component page. The
 * newest release whose CHANGELOG.md bullet names the item at its head (the
 * text before the bullet's first colon, as a code span), else its since.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { withListedItems } from "../../src/lib/site/items.ts";
import { parseChangelog, updatedIn } from "../../src/lib/site/changelog.ts";

const registry = withListedItems(
  JSON.parse(readFileSync("registry.json", "utf8")),
) as {
  items: { name: string; meta: { since: string } }[];
};
const log = parseChangelog(readFileSync("CHANGELOG.md", "utf8"));
const updated = Object.fromEntries(
  registry.items.map((i) => [i.name, updatedIn(i.name, i.meta.since, log)]),
);

describe("018 decision 4: Updated", () => {
  test("82 of 82 items have a version", () => {
    expect(registry.items).toHaveLength(82);
    for (const i of registry.items)
      expect(updated[i.name], i.name).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("80 are named at a bullet's head; name-strip and cta-band take their since, 0.11.0", () => {
    const named = registry.items.filter((i) => updatedIn(i.name, null, log));
    expect(named).toHaveLength(80);
    expect(
      registry.items
        .filter((i) => !named.includes(i))
        .map((i) => i.name)
        .sort(),
    ).toEqual(["cta-band", "name-strip"]);
    expect(updated["name-strip"]).toBe("0.11.0");
    expect(updated["cta-band"]).toBe("0.11.0");
  });

  // 020: kuiper-theme is named in the 0.13.0 entry, as renamed.
  test("a changed item reads its newest release: kuiper-theme 0.13.0, button 0.11.0", () => {
    expect(updated["kuiper-theme"]).toBe("0.13.0");
    expect(updated.button).toBe("0.11.0");
  });

  // 020: tooltip changed in 0.13.0 (its context key), so card stands for an
  // item that never changed.
  test("a never-changed item reads the release it arrived in: card 0.2.0; tooltip, changed in 0.13.0, reads 0.13.0", () => {
    expect(updated.card).toBe("0.2.0");
    expect(updated.tooltip).toBe("0.13.0");
  });

  test("it is never older than since", () => {
    const n = (v: string) => v.split(".").map(Number);
    for (const i of registry.items) {
      const [a, b] = [n(updated[i.name]!), n(i.meta.since)];
      expect(
        a[0] * 1e6 + a[1] * 1e3 + a[2] >= b[0] * 1e6 + b[1] * 1e3 + b[2],
        i.name,
      ).toBe(true);
    }
  });
});
