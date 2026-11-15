import { expect, test, type Page } from "@playwright/test";
import { open, openView, type ThemeName, componentPath } from "./pages.ts";

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
    const box = (el: Element | Range) => {
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
    // 011 criterion 5: the word's own text, read through a Range.
    const word = [...lockup.childNodes].find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
    )!;
    const range = document.createRange();
    range.selectNodeContents(word);
    return {
      dots: dots.map(box),
      colours: dots.map((d) => getComputedStyle(d).backgroundColor),
      mark: box(lockup.querySelector('[data-slot="four-dot"]')!),
      word: box(range),
      probe: box(document.querySelector('[data-testid="baseline-probe"]')!),
    };
  });
}

/** 011 decision 2: Deep Field's four, and the warm canvas's paper; 016 decision 1's yellow third. */
const BRAND = [
  "rgb(45, 72, 212)",
  "rgb(201, 32, 53)",
  "rgb(226, 176, 0)",
  "rgb(0, 128, 88)",
];
const PAPER = "rgb(243, 240, 232)";
/** The lifted four, the mark's colours on dark expressive grounds. */
const LIFTED = [
  "rgb(147, 176, 255)",
  "rgb(255, 148, 145)",
  "rgb(248, 216, 116)",
  "rgb(96, 196, 152)",
];

/**
 * 011 decision 7, criterion 5 (E6): the lockup at 100 px sets its mark at
 * 0.87 of the word. Its dots are 0.30 × 87 = 26.1 px and its gap 0.08 × 87 =
 * 6.96 px (N1's proportion); its lift is 0.74 of the mark's em, so the lower
 * dots sit 0.36 × 87 = 31.3 px above the baseline and the mark's top 90.5 px;
 * the flex gap between the word and the mark is 0.10 of the word, 10 px.
 */
test.describe("the lockup at 100 px", () => {
  let g: Awaited<ReturnType<typeof geometry>>;

  test.beforeEach(async ({ page }) => {
    await open(page, componentPath("four-dot"));
    await page.evaluate(() => document.fonts.ready);
    g = await geometry(page);
  });

  for (const i of [0, 1, 2, 3]) {
    test(`dot ${i + 1} is 26.1 px wide and tall`, () => {
      const dot: Rect = g.dots[i];
      expect(Math.abs(dot.width - 26.1)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(dot.height - 26.1)).toBeLessThanOrEqual(0.5);
    });
  }

  test("the column gap is 6.96 px", () => {
    expect(
      Math.abs(g.dots[1].left - g.dots[0].right - 6.96),
    ).toBeLessThanOrEqual(0.5);
  });

  test("the row gap is 6.96 px", () => {
    expect(
      Math.abs(g.dots[2].top - g.dots[0].bottom - 6.96),
    ).toBeLessThanOrEqual(0.5);
  });

  test("the mark is 59.2 px wide", () => {
    expect(Math.abs(g.mark.width - 59.16)).toBeLessThanOrEqual(1);
  });

  test("the lower dots sit 31.3 px above the baseline", () => {
    const rise = g.probe.bottom - g.dots[2].bottom;
    expect(Math.abs(rise - 31.32)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(g.probe.bottom - g.dots[3].bottom - 31.32),
    ).toBeLessThanOrEqual(1);
  });

  test("the mark's top sits 90.5 px above the baseline", () => {
    expect(Math.abs(g.probe.bottom - g.dots[0].top - 90.5)).toBeLessThanOrEqual(
      1,
    );
  });

  test("from the word's text to the mark is 10 px", () => {
    expect(Math.abs(g.mark.left - g.word.right - 10)).toBeLessThanOrEqual(0.5);
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

/** 011 criterion 5: the standalone mark is unchanged (N1); the endorsement follows the lockup. */
test.describe("the standalone mark and the footer endorsement", () => {
  test("the standalone mark's dots measure 0.30 em of its own size", async ({
    page,
  }) => {
    await open(page, componentPath("four-dot"));
    const { size, dots } = await page.evaluate(() => {
      const mark = document.querySelector('[data-testid="decorative"]')!;
      return {
        size: parseFloat(getComputedStyle(mark).fontSize),
        dots: [...mark.querySelectorAll('[data-slot="four-dot-dot"]')].map(
          (d) => d.getBoundingClientRect().width,
        ),
      };
    });
    expect(dots).toHaveLength(4);
    for (const width of dots)
      expect(Math.abs(width / size - 0.3)).toBeLessThanOrEqual(0.01);
  });

  test("the footer endorsement's gap is 0.10 em of its text, and the mark's top 1.04 em above the baseline", async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/endorsed/");
    const g = await page.evaluate(() => {
      const line = document.querySelector('[data-shell="endorsement"]')!;
      const text = [...line.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
      )!;
      const range = document.createRange();
      range.selectNodeContents(text);
      // The mark's own box: its dots rest off their places until hovered.
      const mark = line.querySelector('[data-slot="four-dot"]')!;
      const markBox = mark.getBoundingClientRect();
      const gap = markBox.left - range.getBoundingClientRect().right;
      // A zero-size item on the line's baseline, measured, then removed.
      const probe = document.createElement("span");
      probe.className = "inline-block";
      line.append(probe);
      const baseline = probe.getBoundingClientRect().bottom;
      probe.remove();
      return {
        size: parseFloat(getComputedStyle(line).fontSize),
        gap,
        baseline,
        top: markBox.top,
      };
    });
    expect(Math.abs(g.gap - 0.1 * g.size)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(g.baseline - g.top - 1.04 * g.size)).toBeLessThanOrEqual(1);
  });
});

/**
 * 011 decision 3, criterion 12: the dark theme's mark is paper on product
 * screens (008); under data-mode="expressive" it takes the lifted four, on a
 * descendant of .dark and on the element that carries both; a productive
 * island inside goes back to paper. A copy of the page's brand mark is planted
 * in each case, so the test runs in both projects.
 */
test.describe("criterion 12: the mark's colours by theme and mode", () => {
  test("paper in .dark; the lifted four under data-mode=expressive within .dark or on it; paper again in a productive island; the four in light", async ({
    page,
  }) => {
    await open(page, componentPath("four-dot"));
    const colours = await page.evaluate(() => {
      const mark = document.querySelector(
        '[data-testid="geometry-lockup"] [data-slot="four-dot"]',
      )!;
      const cases: Record<string, string> = {
        dark: '<div class="dark"><i data-plant></i></div>',
        "expressive in dark":
          '<div class="dark"><div data-mode="expressive"><i data-plant></i></div></div>',
        "expressive on dark":
          '<div class="dark" data-mode="expressive"><i data-plant></i></div>',
        "productive island":
          '<div class="dark"><div data-mode="expressive"><div data-mode="productive"><i data-plant></i></div></div></div>',
        "productive on dark":
          '<div data-mode="expressive"><div class="dark" data-mode="productive"><i data-plant></i></div></div>',
      };
      const host = document.createElement("div");
      document.querySelector("main")!.append(host);
      const out: Record<string, string[]> = {};
      for (const [name, html] of Object.entries(cases)) {
        const wrap = document.createElement("div");
        wrap.innerHTML = html;
        wrap.querySelector("[data-plant]")!.replaceWith(mark.cloneNode(true));
        host.append(wrap);
        out[name] = [
          ...wrap.querySelectorAll('[data-slot="four-dot-dot"]'),
        ].map((d) => getComputedStyle(d).backgroundColor);
      }
      return out;
    });
    const paper = [PAPER, PAPER, PAPER, PAPER];
    expect(colours.dark).toEqual(paper);
    expect(colours["expressive in dark"]).toEqual(LIFTED);
    expect(colours["expressive on dark"]).toEqual(LIFTED);
    expect(colours["productive island"]).toEqual(paper);
    expect(colours["productive on dark"]).toEqual(paper);
  });

  test("the page's own marks are paper in the dark project and the four in light", async ({
    page,
  }, info) => {
    await open(page, componentPath("four-dot"));
    await page.evaluate(() => {
      const mark = document.querySelector(
        '[data-testid="geometry-lockup"] [data-slot="four-dot"]',
      )!;
      const wrap = document.createElement("div");
      wrap.dataset.mode = "expressive";
      wrap.dataset.testid = "planted-expressive";
      wrap.append(mark.cloneNode(true));
      document.querySelector("main")!.append(wrap);
    });
    const dots = await page
      .getByTestId("planted-expressive")
      .locator('[data-slot="four-dot-dot"]')
      .evaluateAll((els) =>
        els.map((d) => getComputedStyle(d).backgroundColor),
      );
    // On the page itself: the dark project's html carries .dark, so an
    // expressive subtree takes the lifted four; the light project shows the
    // brand four, expressive or not.
    expect(dots).toEqual(info.project.name === "dark" ? LIFTED : BRAND);
  });
});

test.describe("accessible names", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, componentPath("four-dot"));
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

  test('the header lockup is a link named "Pluto Systems design"', async ({
    page,
  }) => {
    const link = page.getByRole("banner").getByRole("link");
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAccessibleName("Pluto Systems design");
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
type Timing = {
  name: string;
  duration: number;
  delay: number;
  end: number;
  easing: string;
  dot: number;
};

/**
 * 011 decision 10: each dot runs two animations, the dock (the transform, on
 * the spring) and the fade (the opacity, on the entrance curve).
 */
const ANIMATIONS = `document.getAnimations()
  .filter((a) => "animationName" in a && ["pluto-mark-dock", "pluto-mark-fade"].includes(a.animationName))
  .map((a) => {
    const t = a.effect.getComputedTiming();
    const dot = a.effect.target;
    return {
      name: a.animationName,
      duration: t.duration,
      delay: t.delay,
      end: t.endTime,
      // A CSS animation carries its timing function on its keyframes.
      easing: a.effect.getKeyframes()[0].easing,
      dot: [...dot.parentElement.children].indexOf(dot),
    };
  })`;
const ENTRANCE_CURVE = "cubic-bezier(0.2, 0.7, 0.3, 1)";

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

  test("4 of 4 dots run pluto-mark-dock on the spring and pluto-mark-fade on the entrance curve, each 495 ms, delayed 135 to 405 ms, ending by 900 ms, and land composed", async ({
    page,
  }) => {
    await openView(page, "/view/app-shell/lockup/");
    const timings = (await page.evaluate(ANIMATIONS)) as Timing[];
    expect(timings).toHaveLength(8);
    for (const t of timings) {
      expect(t.duration).toBeCloseTo(495, 6);
      expect(t.end).toBeLessThanOrEqual(900.001);
    }
    for (const name of ["pluto-mark-dock", "pluto-mark-fade"]) {
      const own = timings.filter((t) => t.name === name);
      expect(own.map((t) => t.dot).sort()).toEqual([0, 1, 2, 3]);
      expect(
        own.sort((a, b) => a.dot - b.dot).map((t) => Math.round(t.delay)),
      ).toEqual([135, 225, 315, 405]);
    }
    // 011 criterion 6: the dock on linear(…), the fade on the entrance curve.
    for (const t of timings.filter((t) => t.name === "pluto-mark-dock"))
      expect(t.easing).toMatch(/^linear\(/);
    for (const t of timings.filter((t) => t.name === "pluto-mark-fade"))
      expect(t.easing).toBe(ENTRANCE_CURVE);
    expect(Math.round(Math.max(...timings.map((t) => t.end)))).toBe(900);
    // 008 criterion 5: all four in the banner, none in the footer's lockup.
    expect(
      await page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) =>
            ["pluto-mark-dock", "pluto-mark-fade"].includes(
              (a as CSSAnimation).animationName,
            ),
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
    test("0 animations named pluto-mark-dock or pluto-mark-fade, and 4 of 4 dots at opacity 1 at load", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        window.addEventListener("load", () => {
          (window as unknown as { atLoad: unknown }).atLoad = {
            animations: document
              .getAnimations()
              .filter((a) =>
                ["pluto-mark-dock", "pluto-mark-fade"].includes(
                  (a as CSSAnimation).animationName,
                ),
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

  test("on the site, a client-side navigation from /components/ to /components/four-dot/ starts 0 new entrances and keeps the lockup node", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { starts: number };
      w.starts = 0;
      document.addEventListener(
        "animationstart",
        (e) => {
          if (
            ["pluto-mark-dock", "pluto-mark-fade"].includes(
              (e as AnimationEvent).animationName,
            )
          )
            w.starts++;
        },
        true,
      );
    });
    await open(page, "/components/");
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((a) => a.finished.catch(() => null)),
      ),
    );
    const starts = () =>
      page.evaluate(() => (window as unknown as { starts: number }).starts);
    // 011 decision 10: two animations per dot, eight per entrance.
    expect(await starts()).toBe(8);
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
    await expect(page).toHaveURL(/\/components\/four-dot\/$/);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await starts()).toBe(8);
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

/** 011 decision 10, criterion 6: the reveal fades on the entrance curve and docks on the spring. */
test("the hover reveal's dots list the entrance curve for opacity, then linear(…) for the transform", async ({
  page,
}) => {
  await openView(page, "/view/app-shell/endorsed/");
  const dots = await page
    .locator('[data-shell="endorsement"] [data-slot="four-dot-dot"]')
    .evaluateAll((els) =>
      els.map((d) => [
        getComputedStyle(d).transitionProperty,
        getComputedStyle(d).transitionTimingFunction,
      ]),
    );
  expect(dots).toHaveLength(4);
  for (const [property, timing] of dots) {
    expect(property).toBe("opacity, transform");
    expect(timing).toMatch(/^cubic-bezier\(0\.2, 0\.7, 0\.3, 1\), linear\(/);
  }
});
