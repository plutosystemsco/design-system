/**
 * 012: the compositions, on brand, in the browser. Both projects run every
 * test, so each holds in the light and the dark theme. Criteria 2, 3, 4 and
 * 6: the stage on its ground, the hero's glass and field, the floating glass
 * bar, and the ground check.
 */
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { scheme } from "./scheme.ts";
import {
  COMPOSITION_VIEW_LIST,
  hexToRgb,
  openView,
  TABBABLE,
  componentPath,
} from "./pages.ts";

const HOME = "/view/product-home/";
const GROUNDS = "/view/compositions/stage/grounds/";
const HERO = "/view/compositions/stage-hero/";
const POSTER = "/view/compositions/stage-hero/poster/";

/** A custom property of <html>, as Chromium computes a colour from it. */
const rootColour = (page: Page, name: string) =>
  page.evaluate(
    (n) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  );

type Box = { x: number; y: number; width: number; height: number };
const box = async (page: Page, selector: string): Promise<Box> =>
  (await page.locator(selector).first().boundingBox())!;
/** True when two boxes share any area. Touching edges do not intersect. */
const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height;

// Criterion 2: a stage on each of its five grounds follows the page's theme.
test.describe("2. the stage's grounds", () => {
  const ORDER = ["canvas", "field-1", "field-2", "field-3", "field-4"];

  test("five stages, one per ground, each expressive, painted by its ground, its muted text in the ground's role", async ({
    page,
  }) => {
    await openView(page, GROUNDS);
    const stages = page.locator('[data-slot="stage"]');
    await expect(stages).toHaveCount(5);
    for (let i = 0; i < ORDER.length; i++) {
      const ground = ORDER[i]!;
      const stage = stages.nth(i);
      await expect(stage).toHaveAttribute("data-mode", "expressive");
      await expect(stage).toHaveAttribute("data-ground", ground);
      const [fill, muted] =
        ground === "canvas"
          ? ["--background", "--muted-foreground"]
          : [`--${ground}`, `--${ground}-foreground`];
      await expect(stage).toHaveCSS(
        "background-color",
        hexToRgb(await rootColour(page, fill)),
      );
      const text = stage.locator(".text-muted-foreground").first();
      await expect(text).toHaveCSS(
        "color",
        hexToRgb(await rootColour(page, muted)),
      );
    }
  });

  test("a stage never carries .dark, and has no .dark ancestor but html", async ({
    page,
  }) => {
    await openView(page, GROUNDS);
    const found = await page.locator('[data-slot="stage"]').evaluateAll((els) =>
      els.filter((el) => {
        const dark = el.closest(".dark");
        return dark !== null && dark !== document.documentElement;
      }),
    );
    expect(found).toHaveLength(0);
  });
});

// Criterion 3: the words on glass over columns 1 to 7, the object on a field
// over columns 5 to 12, clear of the glass by the column gap.
test.describe("3. the hero's glass and field", () => {
  for (const path of [HOME, HERO]) {
    for (const width of [1024, 1280, 1440]) {
      test(`${path} at ${width}: the glass overlaps the field by at least 20% of its width, and the object stays clear of the glass`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await openView(page, path);
        const panel = await box(page, '[data-slot="stage-hero-panel"]');
        const field = await box(page, '[data-slot="stage-hero-field"]');
        const object = await box(page, '[data-slot="stage-hero-object"]');
        const overlap =
          Math.min(panel.x + panel.width, field.x + field.width) -
          Math.max(panel.x, field.x);
        expect(overlap).toBeGreaterThanOrEqual(0.2 * field.width);
        expect(intersects(object, panel)).toBe(false);
        // The object lies on the field.
        expect(object.x).toBeGreaterThanOrEqual(field.x);
        expect(object.x + object.width).toBeLessThanOrEqual(
          field.x + field.width + 0.5,
        );
      });
    }

    test(`${path} at 390: the glass comes first in the DOM and overlaps the field's top`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await openView(page, path);
      const order = await page.evaluate(() => {
        const panel = document.querySelector('[data-slot="stage-hero-panel"]')!;
        const field = document.querySelector('[data-slot="stage-hero-field"]')!;
        return panel.compareDocumentPosition(field) &
          Node.DOCUMENT_POSITION_FOLLOWING
          ? "panel first"
          : "field first";
      });
      expect(order).toBe("panel first");
      const panel = await box(page, '[data-slot="stage-hero-panel"]');
      const field = await box(page, '[data-slot="stage-hero-field"]');
      expect(panel.y).toBeLessThan(field.y);
      expect(panel.y + panel.height).toBeGreaterThan(field.y);
      // The object itself starts below the glass.
      const object = await box(page, '[data-slot="stage-hero-object"]');
      expect(intersects(object, panel)).toBe(false);
    });
  }

  test("the words are on glass, which carries the pointer light; the object is on the field the prop names", async ({
    page,
  }) => {
    await openView(page, HOME);
    const panel = page.locator('[data-slot="stage-hero-panel"]');
    await expect(panel).toHaveClass(/\bglass\b/);
    await expect(panel.locator("h1")).toHaveText("Work runs on data.");
    await expect(page.locator('[data-slot="stage-hero-field"]')).toHaveClass(
      /\bfield-1\b/,
    );
    // The glass is never inside the field (R25).
    expect(
      await panel.evaluate((el) => el.closest('[class*="field-"]') === null),
    ).toBe(true);
    const box = (await panel.boundingBox())!;
    await page.mouse.move(box.x + box.width / 4, box.y + box.height / 2);
    await expect
      .poll(() =>
        panel.evaluate((el) => el.style.getPropertyValue("--glass-lit")),
      )
      .toBe("1");
  });

  test("without an object there is neither field nor glass", async ({
    page,
  }) => {
    await openView(page, POSTER);
    const hero = page.locator('[data-slot="stage-hero"]');
    await expect(hero).toHaveCount(1);
    await expect(hero.locator('[data-slot="stage-hero-panel"]')).toHaveCount(0);
    await expect(hero.locator('[data-slot="stage-hero-field"]')).toHaveCount(0);
    await expect(hero.locator(".glass")).toHaveCount(0);
    await expect(
      hero.locator(".field-1, .field-2, .field-3, .field-4"),
    ).toHaveCount(0);
  });

  for (const [width, size] of [
    [1440, "160px"],
    [390, "56px"],
  ] as const) {
    test(`with poster at ${width}, the title computes type-poster's ${size}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await openView(page, POSTER);
      const title = page.locator('[data-slot="stage-hero"] h1');
      await expect(title).toHaveClass(/\btype-poster\b/);
      await expect(title).toHaveCSS("font-size", size);
    });
  }

  test("with poster at 320, the title does not overflow its box", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await openView(page, POSTER);
    const [scroll, client] = await page
      .locator('[data-slot="stage-hero"] h1')
      .evaluate((el) => [el.scrollWidth, el.clientWidth]);
    expect(scroll).toBeLessThanOrEqual(client!);
  });
});

/** The lifted four in dark, the four in light: the mark's colours on an expressive page. */
const MARKS = {
  // 016 decision 1: the brand yellow, lifted in dark.
  light: ["#2D48D4", "#C92035", "#E2B000", "#008058"],
  dark: ["#93B0FF", "#FF9491", "#F8D874", "#60C498"],
};

// Criterion 4: the floating glass bar, and the expressive marks.
test.describe("4. the bar", () => {
  test("in the bar and the footer the mark's dots are the four colours, lifted in dark", async ({
    page,
  }, info) => {
    await openView(page, HOME);
    const want = MARKS[scheme(info)].map(hexToRgb);
    for (const place of ['[data-slot="marketing-bar"]', "footer"]) {
      const dots = await page
        .locator(`${place} [data-slot="four-dot-dot"]`)
        .evaluateAll((els) =>
          els.map((el) => getComputedStyle(el).backgroundColor),
        );
      expect(dots, place).toEqual(want);
    }
  });

  test("its glass panel: a 16 px blur in its backdrop filter, the 8 px case radius, and at most 1280 px wide at 1920", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 900 });
    await openView(page, HOME);
    const panel = page.locator('[data-slot="marketing-bar-panel"]');
    await expect(panel).toHaveClass(/\bglass\b/);
    const [filter, radius] = await panel.evaluate((el) => [
      getComputedStyle(el).backdropFilter,
      getComputedStyle(el).borderTopLeftRadius,
    ]);
    expect(filter).toContain("blur(16px)");
    expect(radius).toBe("8px");
    expect((await panel.boundingBox())!.width).toBeLessThanOrEqual(1280);
    // No border of its own under the floating panel.
    await expect(page.locator('[data-slot="marketing-bar"]')).toHaveCSS(
      "border-bottom-width",
      "0px",
    );
  });

  // At 1280×800 the product home scrolls less than 2000 px; on a short
  // phone screen it scrolls more.
  test("it stays at the top after a scroll of 2000 px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await openView(page, HOME);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight,
      ),
    ).toBeGreaterThanOrEqual(2000);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(2000);
    expect(
      (await page.locator('[data-slot="marketing-bar"]').boundingBox())!.y,
    ).toBe(0);
  });

  test("a link focused below it is not hidden under it (WCAG 2.4.11)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openView(page, HOME);
    const cta = page.locator('[data-slot="cta-band"] a').first();
    const before = page
      .locator('[data-slot="live-console"]')
      .getByRole("button", { name: "Run" });
    await before.focus();
    // Put the call to action's link just under the bar, then Tab to it.
    await cta.evaluate((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - 20);
    });
    await page.keyboard.press("Tab");
    await expect(cta).toBeFocused();
    const bar = (await page
      .locator('[data-slot="marketing-bar"]')
      .boundingBox())!;
    const link = (await cta.boundingBox())!;
    expect(link.y).toBeGreaterThanOrEqual(bar.y + bar.height);
  });

  test("it follows the page's theme: neither it nor any ancestor but html carries .dark", async ({
    page,
  }) => {
    for (const path of [HOME, "/view/compositions/marketing-bar/"]) {
      await openView(page, path);
      const dark = await page
        .locator('[data-slot="marketing-bar"]')
        .evaluate((el) => {
          const found = el.closest(".dark");
          return found === null || found === document.documentElement;
        });
      expect(dark, path).toBe(true);
    }
  });

  test("its text is foreground: its links compute --foreground", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openView(page, HOME);
    const foreground = hexToRgb(await rootColour(page, "--foreground"));
    const colours = await page
      .locator('[data-slot="marketing-bar"] nav a')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).color));
    expect(colours.length).toBeGreaterThan(0);
    expect(colours.filter((c) => c !== foreground)).toEqual([]);
  });
});

/**
 * Criterion 6, the ground check: no control sits directly on a field. For
 * every focusable element, the nearest ancestor (or itself) that is a field,
 * a `surface-plain` surface with an opaque ground of its own, or a glass is
 * not a field.
 */
async function onAField(page: Page): Promise<string[]> {
  return page.evaluate((tabbable) => {
    const FIELD = /^field-[1-4]$/;
    const GROUND =
      ".field-1, .field-2, .field-3, .field-4, .surface-plain, .glass";
    // A colour paints when its alpha is 1. The 012 change review's finding
    // 1: surface-plain resets roles but paints nothing of its own, so it is
    // a ground only with an opaque background; glass always paints its tint.
    const opaque = (colour: string) => {
      const alpha = /^rgba\(.*,\s*([\d.]+)\)$/.exec(colour);
      return alpha ? Number(alpha[1]) === 1 : colour !== "transparent";
    };
    const groundOf = (el: Element): Element | null => {
      for (
        let at = el.closest(GROUND);
        at;
        at = at.parentElement?.closest(GROUND) ?? null
      ) {
        if ([...at.classList].some((c) => FIELD.test(c))) return at;
        if (at.classList.contains("glass")) return at;
        if (opaque(getComputedStyle(at).backgroundColor)) return at;
      }
      return null;
    };
    return [...document.querySelectorAll<HTMLElement>(tabbable)]
      .filter((el) => {
        const ground = groundOf(el);
        return (
          ground !== null && [...ground.classList].some((c) => FIELD.test(c))
        );
      })
      .map(
        (el) =>
          `${el.tagName.toLowerCase()}:${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}`,
      );
  }, TABBABLE);
}

test.describe("6. the ground check", () => {
  const PATHS = [HOME, ...COMPOSITION_VIEW_LIST.map((v) => v.path)];
  for (const width of [1440, 390]) {
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 900 } });
      for (const path of PATHS) {
        test(`${path}: no focusable element sits directly on a field`, async ({
          page,
        }) => {
          await openView(page, path);
          expect(await onAField(page)).toEqual([]);
        });
      }
    });
  }

  test("the check finds a control planted directly on a field", async ({
    page,
  }) => {
    await openView(page, GROUNDS);
    await page.evaluate(() => {
      const field = document.querySelector('[data-ground="field-1"]')!;
      const button = document.createElement("button");
      button.textContent = "Planted";
      field.append(button);
    });
    expect(await onAField(page)).toEqual(["button:Planted"]);
  });

  // The 012 change review's finding 1: surface-plain only resets roles; a
  // wrapper that paints no ground of its own leaves its control on the field.
  test("the check finds a control in a transparent surface-plain wrapper on a field, and passes one on an opaque card", async ({
    page,
  }) => {
    await openView(page, GROUNDS);
    await page.evaluate(() => {
      const field = document.querySelector('[data-ground="field-1"]')!;
      field.insertAdjacentHTML(
        "beforeend",
        '<div class="surface-plain"><button class="bg-primary text-primary-foreground">Wrapped</button></div>' +
          '<div class="surface-plain bg-card"><button class="bg-primary text-primary-foreground">On a card</button></div>',
      );
    });
    expect(await onAField(page)).toEqual(["button:Wrapped"]);
  });
});

/** Holds every scripted run: a `setTimeout` of 900 ms is never scheduled. */
async function holdRuns(page: Page): Promise<void> {
  await page.evaluate(() => {
    const real = window.setTimeout.bind(window);
    (window as unknown as { setTimeout: unknown }).setTimeout = ((
      fn: TimerHandler,
      ms?: number,
      ...rest: unknown[]
    ) => (ms === 900 ? 0 : real(fn, ms, ...rest))) as typeof setTimeout;
  });
}

const shadow = (root: Locator) =>
  root.evaluate((el) => getComputedStyle(el).boxShadow);

// Criterion 5: flat surfaces; a run answers with an inset primary edge.
test.describe("5. the busy edge", () => {
  // The hero's second card holds Run; the first, the shell line, does not.
  const ROOTS = [
    [
      "stage-card",
      (page: Page) => page.locator('[data-slot="stage-card"]').nth(1),
    ],
    [
      "live-console",
      (page: Page) => page.locator('[data-slot="live-console"]'),
    ],
  ] as const;
  for (const [name, find] of ROOTS) {
    test(`${name}: no box-shadow at rest; an inset primary edge of 2 px while a run is pending`, async ({
      page,
    }) => {
      await openView(page, HOME);
      const root = find(page);
      await root.scrollIntoViewIfNeeded();
      await expect(root).toHaveClass(/\bsurface-plain\b/);
      await expect(root).toHaveClass(/\bbusy-edge\b/);
      expect(await shadow(root)).toBe("none");
      const edge = `${hexToRgb(await rootColour(page, "--primary"))} 0px 0px 0px 2px inset`;

      await holdRuns(page);
      await root.getByRole("button", { name: "Run" }).click();
      await expect(root).toHaveAttribute("data-busy", "");
      await expect.poll(() => shadow(root)).toBe(edge);
    });

    test(`${name}: after a run resolves the edge is gone`, async ({ page }) => {
      await openView(page, HOME);
      const root = find(page);
      await root.scrollIntoViewIfNeeded();
      await root.getByRole("button", { name: "Run" }).click();
      await expect(root).toHaveAttribute("data-busy", "");
      await expect(root).not.toHaveAttribute("data-busy", /.*/);
      await expect.poll(() => shadow(root)).toBe("none");
    });
  }
});

// Criterion 7: the block's order and grounds; frost only, no lens.
test.describe("7. the product home", () => {
  test("the bar, then main's four stages (the hero on the canvas, the proof on field-3, the console in a field-4 panel on the canvas, the call to action on the canvas), then the footer", async ({
    page,
  }) => {
    await openView(page, HOME);
    const order = await page.evaluate(() => {
      const top = [
        ...document.body.querySelectorAll(
          ':scope > [data-slot="marketing-bar"], :scope > main, :scope > footer, :scope > * > [data-slot="marketing-bar"], :scope > * > main, :scope > * > footer',
        ),
      ].map((el) => el.getAttribute("data-slot") ?? el.tagName.toLowerCase());
      const stages = [
        ...document.querySelectorAll('main > [data-slot="stage"]'),
      ].map((stage) => {
        const holds = [
          "stage-hero",
          "proof-band",
          "live-console",
          "cta-band",
        ].filter((slot) => stage.querySelector(`[data-slot="${slot}"]`));
        return `${stage.getAttribute("data-ground")}:${holds.join(",")}`;
      });
      return { top, stages };
    });
    expect(order.top).toEqual(["marketing-bar", "main", "marketing-footer"]);
    expect(order.stages).toEqual([
      "canvas:stage-hero",
      "field-3:proof-band",
      "canvas:live-console",
      "canvas:cta-band",
    ]);
    // The console sits in a field-4 panel with the case radius.
    const panel = page.locator('[data-slot="live-console"]').locator("..");
    await expect(panel).toHaveClass(/\bfield-4\b/);
    await expect(panel).toHaveCSS("border-top-left-radius", "8px");
  });

  test("its fields are field-1, field-3 and field-4: blue, yellow and green", async ({
    page,
  }) => {
    await openView(page, HOME);
    const fields = await page.evaluate(() =>
      [
        ...document.querySelectorAll(".field-1, .field-2, .field-3, .field-4"),
      ].map((el) => [...el.classList].find((c) => /^field-[1-4]$/.test(c))),
    );
    expect(fields).toEqual(["field-1", "field-3", "field-4"]);
  });

  // The owner: "Frost only, no lens" (decisions.md, 2026-11-07).
  test("frost only: no lens attribute or filter on the page, and every glass's backdrop is exactly blur(16px)", async ({
    page,
  }) => {
    await openView(page, HOME);
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-glass-lens",
      /.*/,
    );
    await expect(page.locator("filter, [data-slot='glass-lens']")).toHaveCount(
      0,
    );
    const filters = await page
      .locator(".glass")
      .evaluateAll((els) =>
        els.map((el) => getComputedStyle(el).backdropFilter),
      );
    // The bar's panel and the hero's panel.
    expect(filters).toEqual(["blur(16px)", "blur(16px)"]);
  });
});

/**
 * 016 criterion 8: the brand yellow, #E2B000 in light and #F8D874 in dark,
 * where the brand puts it: field-3, the caution badge and alert, chart 3.
 */
test.describe("016: the brand yellow", () => {
  const YELLOW = { light: "rgb(226, 176, 0)", dark: "rgb(248, 216, 116)" };
  const LEGEND = { light: "rgb(11, 15, 23)", dark: "rgb(22, 20, 15)" };
  const style = (locator: Locator, property: string) =>
    locator.evaluate(
      (el, p) => getComputedStyle(el).getPropertyValue(p),
      property,
    );

  test("the field-3 stage is the yellow, and its heading the legend", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await openView(page, GROUNDS);
    const stage = page.locator('[data-ground="field-3"]');
    await expect(stage).toHaveCount(1);
    expect(await style(stage, "background-color")).toBe(YELLOW[theme]);
    expect(await style(stage.locator("h2"), "color")).toBe(LEGEND[theme]);
  });

  test("the caution badge is the --caution fill with ink text; the caution alert's bar is --caution", async ({
    page,
  }, info) => {
    const theme = scheme(info);
    await page.goto(componentPath("badge"));
    const badge = page
      .locator('[data-slot="badge"]', { hasText: "Flaky" })
      .first();
    expect(await style(badge, "background-color")).toBe(YELLOW[theme]);
    expect(await style(badge, "background-color")).toBe(
      hexToRgb(await rootColour(page, "--caution")),
    );
    expect(await style(badge, "color")).toBe("rgb(11, 15, 23)");
    await page.goto(componentPath("alert"));
    const alert = page
      .locator('[data-slot="alert"][data-variant="caution"]')
      .first();
    expect(await style(alert, "border-left-color")).toBe(YELLOW[theme]);
    expect(await style(alert, "border-left-color")).toBe(
      hexToRgb(await rootColour(page, "--caution")),
    );
  });

  test("the chart page's series 3 is --chart-3", async ({ page }, info) => {
    const theme = scheme(info);
    await page.goto(componentPath("chart"));
    const swatch = page.getByTestId("series-3");
    expect(await style(swatch, "background-color")).toBe(YELLOW[theme]);
    expect(await style(swatch, "background-color")).toBe(
      hexToRgb(await rootColour(page, "--chart-3")),
    );
  });
});
