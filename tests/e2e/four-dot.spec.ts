import { expect, test, type Page } from "@playwright/test";
import { open, type ThemeName } from "./pages.ts";

type Rect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

async function geometry(page: Page) {
  return page.evaluate(() => {
    const box = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    };
    const lockup = document.querySelector('[data-testid="geometry-lockup"]')!;
    const dots = [...lockup.querySelectorAll('[data-slot="four-dot-dot"]')];
    return {
      dots: dots.map(box),
      colours: dots.map((d) => getComputedStyle(d).backgroundColor),
      mark: box(lockup.querySelector('[data-slot="four-dot"]')!),
      probe: box(document.querySelector('[data-testid="baseline-probe"]')!),
    };
  });
}

const BRAND = [
  "rgb(36, 86, 230)",
  "rgb(226, 58, 46)",
  "rgb(240, 174, 18)",
  "rgb(30, 158, 86)",
];
const PAPER = "rgb(247, 247, 244)";

test.describe("the mark at 100 px", () => {
  let g: Awaited<ReturnType<typeof geometry>>;

  test.beforeEach(async ({ page }) => {
    await open(page, "/items/four-dot/");
    await page.evaluate(() => document.fonts.ready);
    g = await geometry(page);
  });

  for (const i of [0, 1, 2, 3]) {
    test(`dot ${i + 1} is 30 px wide and tall`, () => {
      const dot: Rect = g.dots[i];
      expect(dot.width).toBeGreaterThanOrEqual(29.5);
      expect(dot.width).toBeLessThanOrEqual(30.5);
      expect(dot.height).toBeGreaterThanOrEqual(29.5);
      expect(dot.height).toBeLessThanOrEqual(30.5);
    });
  }

  test("the column gap is 8 px", () => {
    expect(Math.abs(g.dots[1].left - g.dots[0].right - 8)).toBeLessThanOrEqual(
      0.5,
    );
  });

  test("the row gap is 8 px", () => {
    expect(Math.abs(g.dots[2].top - g.dots[0].bottom - 8)).toBeLessThanOrEqual(
      0.5,
    );
  });

  test("the mark is 68 px wide", () => {
    expect(Math.abs(g.mark.width - 68)).toBeLessThanOrEqual(1);
  });

  test("the lower dots sit 38 px above the baseline", () => {
    const rise = g.probe.bottom - g.dots[2].bottom;
    expect(Math.abs(rise - 38)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(g.probe.bottom - g.dots[3].bottom - 38),
    ).toBeLessThanOrEqual(1);
  });

  test("the dots keep their order and colours", ({}, info) => {
    const theme = info.project.name as ThemeName;
    expect(g.colours).toEqual(
      theme === "dark" ? [PAPER, PAPER, PAPER, PAPER] : BRAND,
    );
  });

  test("the mono mark's dots take its colour", async ({ page }) => {
    const { colour, dots } = await page.evaluate(() => {
      const mono = document.querySelector('[data-testid="mono"]')!;
      return {
        colour: getComputedStyle(mono).color,
        dots: [...mono.querySelectorAll('[data-slot="four-dot-dot"]')].map(
          (d) => getComputedStyle(d).backgroundColor,
        ),
      };
    });
    expect(dots).toEqual([colour, colour, colour, colour]);
    // The fixture's colour (primary) is no mark colour in dark, where every
    // brand dot is paper, so a broken mono tone fails here in both themes.
    expect(colour).not.toBe(PAPER);
  });
});

test.describe("accessible names", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/items/four-dot/");
  });

  test("the decorative mark is hidden from assistive technology", async ({
    page,
  }) => {
    await expect(page.getByTestId("decorative")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test('the labelled mark is an img named "Pluto Systems"', async ({
    page,
  }) => {
    const mark = page.getByTestId("labelled");
    await expect(mark).toHaveRole("img");
    await expect(mark).toHaveAccessibleName("Pluto Systems");
  });

  test('the lockup example is a link named "Pluto Systems"', async ({
    page,
  }) => {
    const link = page.getByTestId("lockup-link");
    await expect(link).toHaveRole("link");
    await expect(link).toHaveAccessibleName("Pluto Systems");
  });

  test('the header lockup is a link named "Pluto Systems design system"', async ({
    page,
  }) => {
    const link = page.getByRole("banner").getByRole("link");
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAccessibleName("Pluto Systems design system");
  });
});
