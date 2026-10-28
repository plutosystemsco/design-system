import { expect, test, type Page } from "@playwright/test";
import { hexToRgb, ITEMS, open } from "./pages.ts";

type Stop = { tag: string; href: string | null; name: string };

async function focused(page: Page): Promise<Stop | null> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    return {
      tag: el.tagName.toLowerCase(),
      href: el.getAttribute("href"),
      name: el.getAttribute("aria-label") ?? el.textContent?.trim() ?? "",
    };
  });
}

/**
 * The focused element shows a solid 2 px outline in the ring colour, read
 * once. Only the theme toggle animates: its Tailwind `transition` class fades
 * `outline-color` in over the micro budget, so for it alone the check first
 * waits for its running transitions to finish.
 */
async function expectRingOutline(page: Page, colour: string): Promise<void> {
  const outline = await page.evaluate(async () => {
    const el = document.activeElement as HTMLElement;
    if (el.matches("button[aria-pressed]")) {
      await Promise.all(el.getAnimations().map((a) => a.finished));
    }
    const style = getComputedStyle(el);
    return [style.outlineStyle, style.outlineWidth, style.outlineColor];
  });
  expect(outline).toEqual(["solid", "2px", colour]);
}

async function ring(page: Page): Promise<string> {
  const hex = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--ring"),
  );
  return hexToRgb(hex);
}

test.describe("the catalogue", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/");
  });

  test("Tab visits the 8 stops in order, each with the solid ring outline", async ({
    page,
  }) => {
    const colour = await ring(page);
    const stops: Stop[] = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const stop = await focused(page);
      expect(stop).not.toBeNull();
      stops.push(stop!);
      await expectRingOutline(page, colour);
    }
    expect(stops.map((s) => [s.tag, s.href])).toEqual([
      ["a", "/"],
      ["button", null],
      ...ITEMS.map((name) => ["a", `/items/${name}/`]),
    ]);
    expect(stops[0].name).toBe("Pluto Systems design system");
    expect(stops[1].name).toBe("Dark theme");

    // No ninth stop: the catalogue has no other focusable element.
    await page.keyboard.press("Tab");
    expect(await focused(page)).toBeNull();
  });

  test("Enter on the first item link opens /items/pluto-theme/", async ({
    page,
  }) => {
    for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
    expect((await focused(page))?.href).toBe("/items/pluto-theme/");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/items\/pluto-theme\/$/);
  });

  test("Space flips the theme toggle and Enter flips it back", async ({
    page,
  }) => {
    const toggle = page.getByRole("button", { name: "Dark theme" });
    const html = page.locator("html");
    const before = await toggle.getAttribute("aria-pressed");
    const wasDark = ((await html.getAttribute("class")) ?? "")
      .split(/\s+/)
      .includes("dark");
    expect(before).toBe(String(wasDark));

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", String(!wasDark));
    if (wasDark) await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-pressed", String(wasDark));
    if (wasDark) await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
    else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
  });
});

test("on the four-dot page, Tab reaches the lockup link, with the same outline", async ({
  page,
}) => {
  await open(page, "/items/four-dot/");
  const colour = await ring(page);
  let reached = false;
  for (let i = 0; i < 20 && !reached; i++) {
    await page.keyboard.press("Tab");
    reached = await page.evaluate(
      () =>
        document.activeElement?.getAttribute("data-testid") === "lockup-link",
    );
  }
  expect(reached).toBe(true);
  await expectRingOutline(page, colour);
});
