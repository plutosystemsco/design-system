import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { open, PAGES } from "./pages.ts";

const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

for (const path of PAGES) {
  test(`axe finds 0 violations on ${path}`, async ({ page }) => {
    await open(page, path);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const violations = results.violations.map(
      (v) =>
        `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
    );
    expect(violations).toEqual([]);
    expect(results.passes.length).toBeGreaterThan(0);
  });
}
