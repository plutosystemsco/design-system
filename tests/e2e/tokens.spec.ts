import { expect, test, type Page } from "@playwright/test";
import { GROUND, open, type ThemeName } from "./pages.ts";

const PAGE = "/items/pluto-theme/";
const token = (name: string) => `[data-token="${name}"]`;

/** The two motion tokens, in milliseconds. The production CSS minifier writes 900ms as .9s. */
async function motionMs(page: Page): Promise<number[]> {
  const values = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return [
      root.getPropertyValue("--motion-entrance"),
      root.getPropertyValue("--motion-micro"),
    ];
  });
  return values.map((value) => {
    const match = /^(-?[\d.]+)(ms|s)$/.exec(value.trim());
    if (!match) throw new Error(`not a time: "${value}"`);
    return Math.round(parseFloat(match[1]) * (match[2] === "s" ? 1000 : 1));
  });
}

test.describe("tokens in the browser", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, PAGE);
  });

  for (const cls of [
    "rounded",
    "rounded-xs",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "rounded-4xl",
  ]) {
    test(`${cls} draws 8 px`, async ({ page }) => {
      await expect(page.locator(token(cls))).toHaveCSS(
        "border-top-left-radius",
        "8px",
      );
    });
  }

  test("rounded-full draws at least 9999 px", async ({ page }) => {
    const radius = await page
      .locator(token("rounded-full"))
      .evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
    expect(radius).toBeGreaterThanOrEqual(9999);
  });

  for (const [step, px] of [
    ["xs", "12px"],
    ["sm", "13.5px"],
    ["base", "16px"],
    ["2xl", "28px"],
    ["5xl", "44px"],
  ]) {
    test(`text-${step} is ${px}`, async ({ page }) => {
      await expect(page.locator(token(`text-${step}`))).toHaveCSS(
        "font-size",
        px,
      );
    });
  }

  for (const [cls, px] of [
    ["p-1", 4],
    ["p-2", 8],
    ["p-3", 12],
    ["p-4", 16],
    ["p-6", 24],
    ["p-8", 32],
    ["p-12", 48],
    ["p-16", 64],
    ["p-24", 96],
  ] as const) {
    test(`${cls} is ${px} px`, async ({ page }) => {
      await expect(page.locator(token(cls))).toHaveCSS(
        "padding-top",
        `${px}px`,
      );
    });
  }

  for (const [selector, family] of [
    ["body", "Geist Variable"],
    ["h1", "IBM Plex Sans Variable"],
    ["code", "JetBrains Mono Variable"],
  ]) {
    test(`${selector} is set in ${family}`, async ({ page }) => {
      await page.evaluate(() => document.fonts.ready);
      const computed = await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).fontFamily);
      expect(computed.replace(/["']/g, "").startsWith(family)).toBe(true);
    });

    test(`${family} has loaded`, async ({ page }) => {
      // document.fonts.check() is true even for a family that does not exist,
      // so look for a face of this family that the browser actually loaded.
      const loaded = (name: string) =>
        page.evaluate(async (f) => {
          await document.fonts.ready;
          return [...document.fonts].some(
            (face) =>
              face.family.replace(/["']/g, "") === f &&
              face.status === "loaded",
          );
        }, name);
      expect(await loaded(family)).toBe(true);
      // The check can fail: a family no stylesheet declares has no loaded face.
      expect(await loaded("No Such Font")).toBe(false);
    });
  }

  test("motion reads its budgets by default", async ({ page }) => {
    expect(await motionMs(page)).toEqual([900, 200]);
    await expect(page.locator(token("transition"))).toHaveCSS(
      "transition-duration",
      "0.2s",
    );
  });
});

test.describe("under reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await open(page, PAGE);
  });

  test("motion reads 0 ms", async ({ page }) => {
    expect(await motionMs(page)).toEqual([0, 0]);
    const duration = await page
      .locator(token("transition"))
      .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    expect(duration).toBeLessThanOrEqual(0.00001);
  });

  test("the ground is unchanged", async ({ page }, info) => {
    const theme = info.project.name as ThemeName;
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      GROUND[theme],
    );
  });
});
