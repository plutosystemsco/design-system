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

  // 023: its doc-comment bullets name name-strip and cta-band, the two
  // that took their since; a name no bullet holds still does.
  test("82 are named at a bullet's head; a name no bullet holds takes its since", () => {
    const named = registry.items.filter((i) => updatedIn(i.name, null, log));
    expect(named).toHaveLength(82);
    expect(updatedIn("no-such-item", "0.11.0", log)).toBe("0.11.0");
    expect(updatedIn("no-such-item", null, log)).toBeNull();
  });

  // 020: kuiper-theme is named in the 0.13.0 entry, as renamed. 023 names
  // button too (its doc comments). 020d test 9: the 0.13.0 entry holds every
  // change since 0.11.0, so kbd, error-summary and product-home read 0.13.0, and meter,
  // which arrived in 0.4.0 and never changed after, stands for an older release.
  test("a changed item reads its newest release: kuiper-theme, kbd, error-summary and product-home 0.13.0; meter 0.4.0", () => {
    expect(updated["kuiper-theme"]).toBe("0.13.0");
    for (const name of ["kbd", "error-summary", "product-home"])
      expect(updated[name], name).toBe("0.13.0");
    expect(updated.meter).toBe("0.4.0");
  });

  // 020: tooltip changed in 0.13.0 (its context key). 023 changed card's
  // source, so label stands for an item that never changed.
  test("a never-changed item reads the release it arrived in: label 0.2.0; tooltip, changed in 0.13.0, reads 0.13.0", () => {
    expect(updated.label).toBe("0.2.0");
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
