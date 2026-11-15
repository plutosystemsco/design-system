/**
 * 015 decision 18, criterion 21: the search palette, in both projects.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { open } from "./pages.ts";

test.describe("015: search", () => {
  test("no request for /search.json before the palette opens; Control-K opens it with focus in the input", async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/search.json")) requests.push(r.url());
    });
    await open(page, "/components/");
    await page.locator('[data-slot="site-search"]').first().waitFor();
    await page.waitForTimeout(300);
    expect(requests).toEqual([]);
    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox", { name: "Search the site" });
    await expect(input).toBeFocused();
    await expect.poll(() => requests.length).toBe(1);
  });

  test("keys typed straight after Control-K reach the input", async ({
    page,
  }) => {
    await open(page, "/components/");
    await page.locator('[data-slot="site-search"]').first().waitFor();
    // Hold every script fetched from here on, so the palette's code is late
    // for certain and the keys land before its input exists.
    await page.route("**/_app/immutable/**/*.js", async (route) => {
      await new Promise((r) => setTimeout(r, 600));
      await route.continue();
    });
    await page.keyboard.press("Control+k");
    await page.keyboard.type("butt");
    const input = page.getByRole("combobox", { name: "Search the site" });
    await expect(input).toHaveValue("butt");
    await expect(page.getByRole("option").first()).toContainText("Button");
  });

  test("Command-K opens it too", async ({ page }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().waitFor();
    await page.keyboard.press("Meta+k");
    await expect(
      page.getByRole("combobox", { name: "Search the site" }),
    ).toBeFocused();
  });

  test("ArrowDown then Enter opens a result; the live region reads the count", async ({
    page,
  }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    const input = page.getByRole("combobox", { name: "Search the site" });
    await input.fill("dial");
    const status = page.getByRole("dialog").getByRole("status");
    await expect(status).toHaveText(/^\d+ results?$/);
    await expect(page.getByRole("option").first()).toContainText("Dialog");
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute(
      "aria-activedescendant",
      "site-search-1",
    );
    await input.press("ArrowUp");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/components\/dialog\/$/);
  });

  test('"zzzz" gives the empty message', async ({ page }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    await page.getByRole("combobox", { name: "Search the site" }).fill("zzzz");
    await expect(page.getByRole("dialog").getByRole("status")).toHaveText(
      'No results for "zzzz". Try a component\'s name, or browse the four sections.',
    );
  });

  test("Escape closes it and returns focus to the button that opened it", async ({
    page,
  }) => {
    await open(page, "/components/button/");
    const button = page.locator(
      '[data-slot="site-bar"] [data-slot="site-search"]',
    );
    await button.click();
    await expect(
      page.getByRole("combobox", { name: "Search the site" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(button).toBeFocused();
  });

  test("axe finds 0 violations with it open", async ({ page }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    await page.getByRole("combobox", { name: "Search the site" }).fill("but");
    await expect(page.getByRole("option").first()).toBeVisible();
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((a) => a.finished.catch(() => null)),
      ),
    );
    const results = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  });
});
