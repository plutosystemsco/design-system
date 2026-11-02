import { expect, test, type Page } from "@playwright/test";
import { open, openView } from "./pages.ts";

/**
 * 008, product identity: the shell shows the product's name or logo, never
 * Pluto Systems' by default, and the footer's optional endorsement reveals the
 * four dots on hover as a 200 ms response. Both themes run every test.
 */
const SHELL = "/view/app-shell/";
const LOCKUP = "/view/app-shell/lockup/";
const ENDORSED = "/view/app-shell/endorsed/";
const DOTS = '[data-shell="endorsement"] [data-slot="four-dot-dot"]';

type DotStyle = {
  opacity: string;
  transform: string;
  duration: string;
  delay: string;
};

function dotStyles(page: Page): Promise<DotStyle[]> {
  return page.locator(DOTS).evaluateAll((dots) =>
    dots.map((d) => {
      const s = getComputedStyle(d);
      return {
        opacity: s.opacity,
        transform: s.transform,
        duration: s.transitionDuration,
        delay: s.transitionDelay,
      };
    }),
  );
}

/** Waits until every transition on the page has finished. */
async function settle(page: Page): Promise<void> {
  await page.waitForTimeout(50);
  await page.evaluate(() =>
    Promise.all(
      document.getAnimations().map((a) => a.finished.catch(() => null)),
    ),
  );
}

test.describe("the wordmark", () => {
  test("1. the shipped header's home link reads Sandbox, has no aria-label, is the heading face in bold, at least 48 by 24 px, with no lockup and no mark", async ({
    page,
  }) => {
    await openView(page, SHELL);
    const banner = page.getByRole("banner");
    const home = banner.locator('a[href="/"]');
    await expect(home).toHaveCount(1);
    await expect(home).toHaveText("Sandbox");
    expect(await home.getAttribute("aria-label")).toBeNull();
    await expect(home).toHaveAccessibleName("Sandbox");
    const style = await home.evaluate((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        family: s.fontFamily,
        weight: s.fontWeight,
        w: r.width,
        h: r.height,
      };
    });
    expect(style.family).toContain("IBM Plex Sans");
    expect(style.weight).toBe("700");
    expect(style.h).toBeGreaterThanOrEqual(48);
    expect(style.w).toBeGreaterThanOrEqual(24);
    await expect(banner.locator('[data-slot="lockup"]')).toHaveCount(0);
    await expect(banner.locator('[data-slot="four-dot"]')).toHaveCount(0);
  });

  test("3. the shipped footer holds the wordmark Sandbox, no link, no endorsement and no brand line", async ({
    page,
  }) => {
    await openView(page, SHELL);
    const footer = page.getByRole("contentinfo");
    await expect(footer.locator('[data-shell="wordmark"]')).toHaveText(
      "Sandbox",
    );
    await expect(footer.getByRole("link")).toHaveCount(0);
    await expect(footer.locator('[data-shell="endorsement"]')).toHaveCount(0);
    expect(await footer.textContent()).not.toContain("Work runs on data.");
  });

  test("11. at 320 px a long name keeps the header's row at 64 px, the page has no horizontal scroll, and the link's text is the whole name", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await openView(page, ENDORSED);
    const row = page.locator('[data-slot="app-shell-header"] > div');
    expect((await row.boundingBox())!.height).toBe(64);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const home = page.getByRole("banner").locator('a[href="/"]');
    await expect(home).toHaveText("Sandbox Analytics Workbench");
  });
});

test.describe("a logo", () => {
  test("4. with the lockup as its logo, the home link is named Pluto Systems and the footer's logo is an img of the same name holding a lockup without an entrance", async ({
    page,
  }) => {
    await openView(page, LOCKUP);
    const home = page.getByRole("banner").locator('a[href="/"]');
    await expect(home).toHaveAttribute("aria-label", "Pluto Systems");
    await expect(home.locator('[data-slot="lockup"]')).toHaveCount(1);
    const logo = page.getByRole("contentinfo").locator('[data-shell="logo"]');
    await expect(logo).toHaveCount(1);
    await expect(logo).toHaveAttribute("role", "img");
    await expect(logo).toHaveAccessibleName("Pluto Systems");
    await expect(logo.locator('[data-slot="lockup"]')).toHaveCount(1);
    await expect(logo.locator(".mark-entrance")).toHaveCount(0);
  });

  test("12. the preview site's footer holds a lockup logo, the brand line once, and the source link as its only link", async ({
    page,
  }) => {
    await open(page, "/");
    const footer = page.getByRole("contentinfo");
    const logo = footer.locator('[data-shell="logo"]');
    await expect(logo).toHaveCount(1);
    await expect(logo.locator('[data-slot="lockup"]')).toHaveCount(1);
    const text = (await footer.textContent()) ?? "";
    expect(text.match(/Work runs on data\./g)).toHaveLength(1);
    await expect(footer.getByRole("link")).toHaveCount(1);
    await expect(footer.getByRole("link")).toHaveAttribute(
      "href",
      "https://github.com/plutosystemsco/design-system",
    );
  });
});

test.describe("the endorsement", () => {
  test("6. at rest: one line reading A Pluto Systems product, its mark hidden from assistive technology, four dots at opacity 0", async ({
    page,
  }) => {
    await openView(page, ENDORSED);
    const line = page
      .getByRole("contentinfo")
      .locator('[data-shell="endorsement"]');
    await expect(line).toHaveCount(1);
    await expect(line).toHaveText("A Pluto Systems product");
    const mark = line.locator('[data-slot="four-dot"]');
    await expect(mark).toHaveCount(1);
    await expect(mark).toHaveAttribute("aria-hidden", "true");
    const dots = await dotStyles(page);
    expect(dots.map((d) => d.opacity)).toEqual(["0", "0", "0", "0"]);
  });

  test("7 and 8. hover docks the dots in 110 ms each, delayed 30 to 90 ms, to opacity 1 and no transform, at the same width; leaving fades them in 110 ms with no delay", async ({
    page,
  }) => {
    await openView(page, ENDORSED);
    const line = page.locator('[data-shell="endorsement"]');
    const before = (await line.boundingBox())!.width;
    await line.hover();
    const during = await dotStyles(page);
    expect(during.map((d) => d.duration)).toEqual([
      "0.11s",
      "0.11s",
      "0.11s",
      "0.11s",
    ]);
    expect(during.map((d) => d.delay)).toEqual([
      "0.03s",
      "0.05s",
      "0.07s",
      "0.09s",
    ]);
    await settle(page);
    const shown = await dotStyles(page);
    expect(shown.map((d) => [d.opacity, d.transform])).toEqual(
      Array(4).fill(["1", "none"]),
    );
    expect((await line.boundingBox())!.width).toBe(before);

    await page.mouse.move(0, 0);
    const leaving = await dotStyles(page);
    expect(leaving.map((d) => [d.duration, d.delay])).toEqual(
      Array(4).fill(["0.11s", "0s"]),
    );
    await settle(page);
    expect((await dotStyles(page)).map((d) => d.opacity)).toEqual([
      "0",
      "0",
      "0",
      "0",
    ]);
  });

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("9. hovering shows the four dots with no delay and no duration to speak of", async ({
      page,
    }) => {
      await openView(page, ENDORSED);
      await page.locator('[data-shell="endorsement"]').hover();
      const dots = await dotStyles(page);
      for (const d of dots) {
        expect(d.delay).toBe("0s");
        expect(parseFloat(d.duration)).toBeLessThanOrEqual(0.00001);
      }
      await settle(page);
      expect((await dotStyles(page)).map((d) => d.opacity)).toEqual([
        "1",
        "1",
        "1",
        "1",
      ]);
    });
  });

  test.describe("on a touch screen", () => {
    test.use({ hasTouch: true, isMobile: true });
    test("10. a tap on the line leaves the four dots at opacity 0", async ({
      page,
    }) => {
      await openView(page, ENDORSED);
      await page.locator('[data-shell="endorsement"]').tap();
      await settle(page);
      expect((await dotStyles(page)).map((d) => d.opacity)).toEqual([
        "0",
        "0",
        "0",
        "0",
      ]);
    });
  });
});

test("14. the hero's h1 reads Say what your product does in one line, and the page names neither Pluto Systems nor a design system", async ({
  page,
}) => {
  await openView(page, "/view/hero/");
  await expect(page.locator("h1")).toHaveText(
    "Say what your product does in one line",
  );
  const text = (await page.locator("body").textContent()) ?? "";
  expect(text).not.toContain("Pluto Systems");
  expect(text.toLowerCase()).not.toContain("design system");
});
