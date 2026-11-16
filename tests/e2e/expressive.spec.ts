/**
 * 009: expressive mode and the brand slots, in the browser. Both projects run
 * every test, so each holds in the light and the dark theme.
 */
import { expect, test, type Page } from "@playwright/test";
import { hexToRgb, ITEMS, open, componentPath } from "./pages.ts";

/**
 * Criterion 3: `v0.8.0`'s computed faces and button radius, read from its
 * preview before 009 changed anything (6fbdf99, Chromium, both themes).
 */
const V080 = {
  heading: '"IBM Plex Sans Variable", system-ui, sans-serif',
  paragraph: '"Geist Variable", system-ui, sans-serif',
  code: '"JetBrains Mono Variable", ui-monospace, monospace',
  button: "8px",
};

/** `button`'s own radius class: the action radius, 8 px when it is unset. */
const BUTTON_RADIUS = "rounded-[var(--radius-action,var(--radius))]";

/**
 * The page's first heading, body paragraph and code line, as computed, and
 * the radius of every element `buttonVariants` styles (its base class starts
 * `group/button`) outside an expressive subtree, but for one that passes its
 * own `rounded-*`. Every page has one: the site's theme toggle.
 */
async function productiveFaces(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate((own) => {
    const family = (selector: string) => {
      const el = document.querySelector(selector);
      return el ? getComputedStyle(el).fontFamily : null;
    };
    const buttons = [...document.querySelectorAll('[class*="group/button"]')]
      .filter((el) => !el.closest('[data-mode="expressive"]'))
      // 027a decision 5: an attached button group squares its children's
      // inner corners, as a button that sets its own radius does.
      .filter(
        (el) =>
          !el.parentElement?.matches(
            '[data-slot="button-group"][data-variant="attached"]',
          ),
      )
      .filter(
        (el) =>
          ![...el.classList].some((c) => /^rounded(-|$)/.test(c) && c !== own),
      );
    return {
      heading: family("main h1"),
      paragraph: family("main h1 ~ p"),
      code: family("main code"),
      buttons: buttons.map((el) => getComputedStyle(el).borderTopLeftRadius),
    };
  }, BUTTON_RADIUS);
}

test.describe("criterion 3: a productive page looks as it did in v0.8.0", () => {
  for (const name of ITEMS) {
    test(`/components/${name}/ keeps v0.8.0's faces and button radius`, async ({
      page,
    }) => {
      await open(page, componentPath(name));
      const faces = await productiveFaces(page);
      expect(faces.heading).toBe(V080.heading);
      expect(faces.paragraph).toBe(V080.paragraph);
      expect(faces.code).toBe(V080.code);
      expect(faces.buttons.length).toBeGreaterThan(0);
      expect(faces.buttons.filter((r) => r !== V080.button)).toEqual([]);
    });
  }
});

/** Nested mode subtrees, each holding an element with the given class. */
async function plantModes(page: Page, cls: string) {
  await page.evaluate((cls) => {
    const host = document.createElement("div");
    host.dataset.testid = "modes";
    host.innerHTML = `
      <span data-probe="root" class="${cls}"></span>
      <div data-mode="expressive">
        <span data-probe="expressive" class="${cls}"></span>
        <div data-mode="productive">
          <span data-probe="island" class="${cls}"></span>
        </div>
      </div>`;
    document.querySelector("main")!.append(host);
  }, cls);
}

const radius = (page: Page, probe: string) =>
  page
    .locator(`[data-probe="${probe}"]`)
    .evaluate((el) => getComputedStyle(el).borderTopLeftRadius);

/**
 * 011 decision 5 (H1, "one 8 px case radius; round only for dot shapes"):
 * the expressive mode's action radius is the case radius. The mode rule
 * stays, so a later decision can move a value into it.
 */
test.describe("criterion 7: the action radius follows the nearest mode", () => {
  test("rounded-action is 8 px productive, 8 px expressive, 8 px in a nested productive island", async ({
    page,
  }) => {
    await open(page, componentPath("button"));
    await plantModes(page, "rounded-action");
    expect(await radius(page, "root")).toBe("8px");
    expect(await radius(page, "expressive")).toBe("8px");
    expect(await radius(page, "island")).toBe("8px");
  });

  test("a default button is 8 px under data-mode=expressive and outside it", async ({
    page,
  }) => {
    await open(page, componentPath("button"));
    const button = page.locator('main [data-slot="button"]').first();
    expect(
      await button.evaluate((el) => getComputedStyle(el).borderTopLeftRadius),
    ).toBe("8px");
    await button.evaluate((el) =>
      el.parentElement!.setAttribute("data-mode", "expressive"),
    );
    expect(
      await button.evaluate((el) => getComputedStyle(el).borderTopLeftRadius),
    ).toBe("8px");
  });
});

const THEME = componentPath("kuiper-theme");
const READ_TOKEN = componentPath("read-token");

const computed = (page: Page, testid: string, property: string) =>
  page
    .getByTestId(testid)
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property);

/** A time as Chromium writes a custom property: the minifier may write 0ms as 0s. */
function toMs(value: string): number {
  const match = /^(-?[\d.]+)(ms|s)$/.exec(value.trim());
  if (!match) throw new Error(`not a time: "${value}"`);
  return parseFloat(match[1]) * (match[2] === "s" ? 1000 : 1);
}

// 012 decision 1: 009's criterion 8, the stage, is retired with the stage.

test.describe("criterion 9: reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the seven durations read 0ms and --press-scale reads 1", async ({
    page,
  }) => {
    await open(page, THEME);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return [
        "--motion-entrance",
        "--motion-micro",
        "--motion-press",
        "--motion-slide",
        "--motion-busy",
        "--motion-reveal",
        "--motion-fill",
        "--press-scale",
      ].map((n) => root.getPropertyValue(n).trim());
    });
    expect(values.slice(0, 7).map(toMs)).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(values[7]).toBe("1");
  });
});

test.describe("criterion 10: the display steps are fluid", () => {
  for (const [width, sizes] of [
    [1440, ["86.4px", "56px", "86.4px"]],
    [390, ["48px", "36px", "56px"]],
  ] as const) {
    test(`at ${width} px: type-display, type-section, type-proof are ${sizes.join(", ")}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, THEME);
      const measured = [];
      for (const step of ["display", "section", "proof"])
        measured.push(await computed(page, `type-${step}`, "font-size"));
      expect(measured).toEqual([...sizes]);
    });
  }

  test("each step is 600, and type-proof has tabular figures", async ({
    page,
  }) => {
    await open(page, THEME);
    for (const step of ["display", "section", "proof"])
      expect(await computed(page, `type-${step}`, "font-weight")).toBe("600");
    expect(await computed(page, "type-proof", "font-variant-numeric")).toBe(
      "tabular-nums",
    );
  });
});

// 012 decision 1: 009's criterion 11 keeps the press; the bloom, the rim,
// energized and the veil are retired with the stage.
test.describe("criterion 11: the press", () => {
  test("action-press carries a transform transition of --motion-press", async ({
    page,
  }) => {
    await open(page, THEME);
    expect(await computed(page, "press", "transition-property")).toBe(
      "transform",
    );
    expect(toMs(await computed(page, "press", "transition-duration"))).toBe(
      160,
    );
  });

  test("a button in an expressive subtree is 8 px, as its productive twin is (011 decision 5)", async ({
    page,
  }) => {
    await open(page, THEME);
    const radius = (id: string) =>
      page
        .getByTestId(id)
        .locator('[data-slot="button"]')
        .evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
    expect(await radius("mode-productive")).toBe("8px");
    expect(await radius("mode-expressive")).toBe("8px");
    expect(await radius("mode-island")).toBe("8px");
  });
});

test.describe("criterion 12: read-token in the browser", () => {
  /** Chromium's rgb() for a hex, whatever case or length the minifier wrote. */
  const rgb = (hex: string) => hexToRgb(hex);

  // 012 decision 8: the second canvas sits in a .dark subtree, not a stage,
  // so it reads the dark theme's paper marks in both page themes.
  test('readToken("mark-1") reads the page\'s mark-1, and paper inside a .dark subtree', async ({
    page,
  }, info) => {
    await open(page, READ_TOKEN);
    const onPage = await page.getByTestId("read-page-mark-1").textContent();
    const inDark = await page.getByTestId("read-dark-mark-1").textContent();
    // The light theme's mark-1 is blue; the dark theme's marks are paper.
    expect(rgb(onPage!)).toBe(
      info.project.name === "light" ? "rgb(45, 72, 212)" : "rgb(243, 240, 232)",
    );
    expect(rgb(inDark!)).toBe("rgb(243, 240, 232)");
  });

  test("the canvases are images named by the four colours they paint, and repaint when the theme changes", async ({
    page,
  }, info) => {
    await open(page, READ_TOKEN);
    const canvas = page.getByTestId("dots-page");
    await expect(canvas).toHaveAttribute("role", "img");
    await expect(page.getByTestId("dots-dark")).toHaveAttribute(
      "aria-label",
      /^Four dots painted from mark-1 to mark-4: #f3f0e8, #f3f0e8, #f3f0e8, #f3f0e8$/i,
    );
    const pixel = () =>
      canvas.evaluate((el: HTMLCanvasElement) => {
        const ctx = el.getContext("2d")!;
        const [x, y] = (el.dataset.firstDot ?? "0,0").split(",").map(Number);
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        return `rgb(${r}, ${g}, ${b})`;
      });
    const light = info.project.name === "light";
    expect(await pixel()).toBe(
      light ? "rgb(45, 72, 212)" : "rgb(243, 240, 232)",
    );
    await page.locator("button[aria-pressed][data-ready]").first().click();
    await expect
      .poll(pixel)
      .toBe(light ? "rgb(243, 240, 232)" : "rgb(45, 72, 212)");
  });
});

test.describe("criterion 13: the display slot", () => {
  test("setting --font-face-display on a wrapper changes a type-display line inside it", async ({
    page,
  }) => {
    await open(page, THEME);
    const line = page.getByTestId("type-display");
    expect(await line.evaluate((el) => getComputedStyle(el).fontFamily)).toBe(
      '"IBM Plex Sans Variable", system-ui, sans-serif',
    );
    await line.evaluate((el) =>
      el.parentElement!.style.setProperty("--font-face-display", "serif"),
    );
    expect(await line.evaluate((el) => getComputedStyle(el).fontFamily)).toBe(
      "serif",
    );
  });
});
