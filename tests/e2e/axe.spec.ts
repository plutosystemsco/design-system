import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES, open, settled } from "./pages.ts";

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

// 002 decision 23: the alert-dialog page again, with its dialog open.
test("axe finds 0 violations with the alert dialog open", async ({ page }) => {
  await open(page, "/items/alert-dialog/");
  await page.getByTestId("dialog-trigger").first().click();
  await page.locator('[data-slot="alert-dialog-content"]').waitFor();
  await settled(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const violations = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
  );
  expect(violations).toEqual([]);
  expect(results.passes.length).toBeGreaterThan(0);
});
