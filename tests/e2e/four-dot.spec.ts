import { expect, test, type Page } from "@playwright/test";
import { open, openView, type ThemeName } from "./pages.ts";

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

/**
 * 006 decision 5: the entrance. Four animations named pluto-mark-dock on the
 * shell's lockup (008: on the lockup view, whose logo is the lockup; the
 * document's count of four proves the footer's copy plays none), 495 ms each, delayed 135 to 405 ms, the last ending at
 * 900 ms, every dot composed after `finished`; none under reduce, with the
 * dots composed at `load`; and one per full load: a client-side navigation
 * on the site keeps the lockup node and starts nothing.
 */
type Timing = { name: string; duration: number; delay: number; end: number };

const ANIMATIONS = `document.getAnimations()
  .filter((a) => "animationName" in a && a.animationName === "pluto-mark-dock")
  .map((a) => {
    const t = a.effect.getComputedTiming();
    return { name: a.animationName, duration: t.duration, delay: t.delay, end: t.endTime };
  })`;

const DOTS = `[...document.querySelectorAll('header [data-slot="four-dot-dot"]')]
  .map((d) => [getComputedStyle(d).opacity, getComputedStyle(d).transform])`;

test.describe("the entrance", () => {
  // 008 criterion 2: the shipped shell shows a wordmark, so nothing docks.
  test("the shipped shell runs 0 pluto-mark-dock animations", async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/");
    expect(await page.evaluate(ANIMATIONS)).toEqual([]);
  });

  test("4 of 4 dots run pluto-mark-dock for 495 ms, delayed 135 to 405 ms, ending by 900 ms, and land composed", async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/lockup/");
    const timings = (await page.evaluate(ANIMATIONS)) as Timing[];
    expect(timings).toHaveLength(4);
    for (const t of timings) {
      expect(t.name).toBe("pluto-mark-dock");
      expect(t.duration).toBeCloseTo(495, 6);
      expect(t.end).toBeLessThanOrEqual(900.001);
    }
    expect(timings.map((t) => Math.round(t.delay))).toEqual([
      135, 225, 315, 405,
    ]);
    expect(Math.round(Math.max(...timings.map((t) => t.end)))).toBe(900);
    // 008 criterion 5: all four in the banner, none in the footer's lockup.
    expect(
      await page.evaluate(() =>
        document
          .getAnimations()
          .filter(
            (a) => (a as CSSAnimation).animationName === "pluto-mark-dock",
          )
          .every((a) =>
            ((a.effect as KeyframeEffect).target as Element).closest("header"),
          ),
      ),
    ).toBe(true);
    await page.evaluate(() =>
      Promise.all(document.getAnimations().map((a) => a.finished)),
    );
    const dots = (await page.evaluate(DOTS)) as [string, string][];
    expect(dots).toHaveLength(4);
    for (const [opacity, transform] of dots) {
      expect(opacity).toBe("1");
      expect(transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
    }
  });

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("0 animations named pluto-mark-dock, and 4 of 4 dots at opacity 1 at load", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        window.addEventListener("load", () => {
          (window as unknown as { atLoad: unknown }).atLoad = {
            animations: document
              .getAnimations()
              .filter(
                (a) => (a as CSSAnimation).animationName === "pluto-mark-dock",
              ).length,
            dots: [
              ...document.querySelectorAll('header [data-slot="four-dot-dot"]'),
            ].map((d) => [
              getComputedStyle(d).opacity,
              getComputedStyle(d).animationName,
            ]),
          };
        });
      });
      await openView(page, "/view/app-shell/lockup/");
      const atLoad = (await page.evaluate(
        () => (window as unknown as { atLoad: unknown }).atLoad,
      )) as { animations: number; dots: [string, string][] };
      expect(atLoad.animations).toBe(0);
      expect(atLoad.dots).toEqual([
        ["1", "none"],
        ["1", "none"],
        ["1", "none"],
        ["1", "none"],
      ]);
      expect(await page.evaluate(ANIMATIONS)).toEqual([]);
    });
  });

  test("on the site, a client-side navigation from / to /items/four-dot/ starts 0 new entrances and keeps the lockup node", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { starts: number };
      w.starts = 0;
      document.addEventListener(
        "animationstart",
        (e) => {
          if ((e as AnimationEvent).animationName === "pluto-mark-dock")
            w.starts++;
        },
        true,
      );
    });
    await open(page, "/");
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((a) => a.finished.catch(() => null)),
      ),
    );
    const starts = () =>
      page.evaluate(() => (window as unknown as { starts: number }).starts);
    expect(await starts()).toBe(4);
    await page.evaluate(() => {
      (
        document.querySelector('header [data-slot="lockup"]') as unknown as {
          tag: string;
        }
      ).tag = "first-load";
    });
    await page
      .getByRole("link", { name: "four-dot", exact: false })
      .first()
      .click();
    await expect(page).toHaveURL(/\/items\/four-dot\/$/);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await starts()).toBe(4);
    expect(
      await page.evaluate(
        () =>
          (
            document.querySelector(
              'header [data-slot="lockup"]',
            ) as unknown as {
              tag?: string;
            }
          ).tag,
      ),
    ).toBe("first-load");
  });
});
