import { expect, test, type Page } from "@playwright/test";
import { GROUND, open, type ThemeName } from "./pages.ts";

const PAGE = "/items/pluto-theme/";
const token = (name: string) => `[data-token="${name}"]`;

/**
 * True when a computed CSS value holds a token's colour: the same channels,
 * and an alpha within 0.01 (Chromium writes alpha to two decimals). The
 * production minifier may shorten the token's hex.
 */
function holdsColour(computed: string, hex: string): boolean {
  let d = hex.replace("#", "");
  if (d.length <= 4) d = [...d].map((c) => c + c).join("");
  const n = parseInt(d.slice(0, 6), 16);
  const want = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const alpha = d.length === 8 ? parseInt(d.slice(6), 16) / 255 : 1;
  return [...computed.matchAll(/rgba?\(([^)]*)\)/g)].some((m) => {
    const parts = m[1].split(",").map((x) => parseFloat(x));
    const a = parts.length === 4 ? parts[3] : 1;
    return (
      parts[0] === want[0] &&
      parts[1] === want[1] &&
      parts[2] === want[2] &&
      Math.abs(a - alpha) < 0.01
    );
  });
}

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

  test("shadow-elevation holds --elevation-line's colour", async ({ page }) => {
    const [shadow, line] = await page
      .locator(token("shadow-elevation"))
      .evaluate((el) => [
        getComputedStyle(el).boxShadow,
        getComputedStyle(document.documentElement)
          .getPropertyValue("--elevation-line")
          .trim(),
      ]);
    expect(holdsColour(shadow, line), `${shadow} holds ${line}`).toBe(true);
  });

  test("bg-scrim computes --scrim's colour with its alpha", async ({
    page,
  }) => {
    const [background, scrim] = await page
      .locator(token("bg-scrim"))
      .evaluate((el) => [
        getComputedStyle(el).backgroundColor,
        getComputedStyle(document.documentElement)
          .getPropertyValue("--scrim")
          .trim(),
      ]);
    expect(holdsColour(background, scrim), `${background} is ${scrim}`).toBe(
      true,
    );
  });

  // 004 decision 17: the code tokens and the scrollbar utility, in each theme.
  test("text-code-keyword computes --primary's colour", async ({ page }) => {
    const [colour, primary] = await page
      .locator(token("text-code-keyword"))
      .evaluate((el) => [
        getComputedStyle(el).color,
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim(),
      ]);
    expect(holdsColour(colour, primary), `${colour} is ${primary}`).toBe(true);
  });

  test("bg-code-active-line computes --card's colour", async ({ page }) => {
    const [colour, card] = await page
      .locator(token("bg-code-active-line"))
      .evaluate((el) => [
        getComputedStyle(el).backgroundColor,
        getComputedStyle(document.documentElement)
          .getPropertyValue("--card")
          .trim(),
      ]);
    expect(holdsColour(colour, card), `${colour} is ${card}`).toBe(true);
  });

  test("scrollbar computes scrollbar-color holding --input and --muted, thin", async ({
    page,
  }) => {
    const [colour, width, input, muted] = await page
      .locator(token("scrollbar"))
      .evaluate((el) => {
        const root = getComputedStyle(document.documentElement);
        const s = getComputedStyle(el);
        return [
          s.getPropertyValue("scrollbar-color"),
          s.getPropertyValue("scrollbar-width"),
          root.getPropertyValue("--input").trim(),
          root.getPropertyValue("--muted").trim(),
        ];
      });
    expect(width).toBe("thin");
    expect(holdsColour(colour, input), `${colour} holds ${input}`).toBe(true);
    expect(holdsColour(colour, muted), `${colour} holds ${muted}`).toBe(true);
  });

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
