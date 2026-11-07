/**
 * 011: the brand's expressive tools in the browser. The poster step (8), the
 * glass and its fallbacks (9), the pointer light (10) and the fields (11).
 * Both projects run every test, so each holds in the light and dark theme.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { hexToRgb, open } from "./pages.ts";

const THEME = "/items/pluto-theme/";
const GLASS = "/items/liquid-glass/";

const style = (locator: Locator, property: string, pseudo?: string) =>
  locator.evaluate(
    (el, [p, ps]) => getComputedStyle(el, ps ?? null).getPropertyValue(p),
    [property, pseudo] as const,
  );

/** A custom property as the element computes it, as Chromium's rgb(). */
const varRgb = async (locator: Locator, name: string) =>
  hexToRgb(await style(locator, name));

/** A root role's value, as rgb(): the theme's own value of the role. */
const rootRgb = (page: Page, name: string) =>
  page
    .evaluate(
      (n) => getComputedStyle(document.documentElement).getPropertyValue(n),
      name,
    )
    .then(hexToRgb);

test.describe("criterion 8: the poster step", () => {
  for (const [width, size] of [
    [1440, "160px"],
    [390, "56px"],
  ] as const) {
    test(`type-poster computes to ${size} at ${width} px wide`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, THEME);
      const line = page.getByTestId("type-poster");
      expect(await style(line, "font-size")).toBe(size);
      expect(await style(line, "font-weight")).toBe("600");
    });
  }
});

// 011 criterion 9, as the owner's "Frost only, no lens" leaves it
// (decisions.md, 2026-11-07): the glass is frosted everywhere and nothing
// bends its backdrop.
test.describe("criterion 9: the glass and its opaque fallbacks", () => {
  const glass = (page: Page) => page.getByTestId("glass");

  test("the backdrop is exactly blur(16px), with no url(; no lens attribute or filter is on the page", async ({
    page,
  }) => {
    await open(page, GLASS);
    const filter = await style(glass(page), "backdrop-filter");
    expect(filter).toBe("blur(16px)");
    expect(filter).not.toContain("url(");
    expect(await style(glass(page), "border-top-left-radius")).toBe("8px");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-glass-lens",
      /.*/,
    );
    await expect(page.locator("filter, [data-slot='glass-lens']")).toHaveCount(
      0,
    );
  });

  test("under reduced transparency (emulated through CDP) the backdrop is none and the ground is the fallback", async ({
    page,
  }) => {
    await open(page, GLASS);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    });
    expect(await style(glass(page), "backdrop-filter")).toBe("none");
    expect(await style(glass(page), "background-color")).toBe(
      await varRgb(glass(page), "--glass-fallback"),
    );
  });

  // Under forced colours Chromium forces every border to a system colour, so
  // a border assertion here would pass without the fallback's rule (the
  // change review's finding 7). The `border-color: CanvasText` declaration is
  // pinned in generated.test.ts ("the opaque fallbacks"); this test checks
  // what only the rule can do: drop the backdrop filter.
  test("under forced colours the backdrop is none", async ({ page }) => {
    await open(page, GLASS);
    expect(await style(glass(page), "backdrop-filter")).toBe("blur(16px)");
    await page.emulateMedia({ forcedColors: "active" });
    expect(await style(glass(page), "backdrop-filter")).toBe("none");
  });
});

test.describe("criterion 10: the pointer light", () => {
  const read = (locator: Locator) =>
    locator.evaluate((el) => {
      const s = (el as HTMLElement).style;
      return {
        lit: s.getPropertyValue("--glass-lit"),
        x: s.getPropertyValue("--glass-x"),
        y: s.getPropertyValue("--glass-y"),
      };
    });

  test("a move lights the rim at the pointer; the rim goes dark --motion-light after the last move; the light is masked to the rim", async ({
    page,
  }) => {
    await open(page, GLASS);
    const glass = page.getByTestId("glass");
    await glass.scrollIntoViewIfNeeded();
    const box = (await glass.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
    const lit = await read(glass);
    expect(lit.lit).toBe("1");
    expect(parseFloat(lit.x)).toBeCloseTo(25, 0);
    expect(lit.x.trim()).toMatch(/%$/);
    expect(parseFloat(lit.y)).toBeCloseTo(50, 0);
    // The rim fades in over --motion-reveal.
    await expect
      .poll(async () => Number(await style(glass, "opacity", "::after")))
      .toBeGreaterThan(0);
    await expect.poll(async () => (await read(glass)).lit).toBe("0");
    const masks = await glass.evaluate((el) => {
      const after = getComputedStyle(el, "::after");
      return [after.maskImage, after.webkitMaskImage];
    });
    expect(masks.some((m) => m && m !== "none")).toBe(true);
  });

  test("the rim stays lit for --motion-light after the last move, not less", async ({
    page,
  }) => {
    await open(page, GLASS);
    const glass = page.getByTestId("glass");
    await glass.scrollIntoViewIfNeeded();
    const box = (await glass.boundingBox())!;
    await page.mouse.move(box.x + 10, box.y + 10);
    // The production minifier may write 600ms as .6s.
    const light = await page.evaluate(() => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-light")
        .trim();
      return parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
    });
    expect(light).toBe(600);
    await page.waitForTimeout(300);
    expect((await read(glass)).lit).toBe("1");
  });

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("a move sets nothing", async ({ page }) => {
      await open(page, GLASS);
      const glass = page.getByTestId("glass");
      await glass.scrollIntoViewIfNeeded();
      const box = (await glass.boundingBox())!;
      await page.mouse.move(box.x + 20, box.y + 20);
      await page.mouse.move(box.x + 40, box.y + 30);
      expect(await read(glass)).toEqual({ lit: "", x: "", y: "" });
    });
  });
});

test.describe("criterion 11: the fields", () => {
  for (const n of [1, 2, 3, 4]) {
    test(`field-${n}: its roles and ring are the legend; a surface-plain card and a glass inside it read the theme's own roles`, async ({
      page,
    }) => {
      await open(page, THEME);
      const field = page.getByTestId(`field-${n}`);
      await expect(field).toHaveClass(new RegExp(`\\bfield-${n}\\b`));
      const legend = await varRgb(field, `--field-${n}-foreground`);
      expect(await style(field, "background-color")).toBe(
        await varRgb(field, `--field-${n}`),
      );
      const probe = (name: string) => field.locator(`[data-probe="${name}"]`);
      for (const name of ["heading", "text", "link"])
        expect(await style(probe(name), "color"), name).toBe(legend);
      // The focus ring on the field is the legend.
      await probe("link").focus();
      expect(await style(probe("link"), "outline-style")).toBe("solid");
      expect(await style(probe("link"), "outline-color")).toBe(legend);

      const foreground = await rootRgb(page, "--foreground");
      const muted = await rootRgb(page, "--muted-foreground");
      const primary = await rootRgb(page, "--primary");
      const card = await rootRgb(page, "--card-foreground");
      await expect(probe("card")).toHaveClass(/\bsurface-plain\b/);
      expect(await style(probe("card-title"), "color")).toBe(card);
      expect(await style(probe("card-description"), "color")).toBe(muted);
      expect(await style(probe("card-link"), "color")).toBe(primary);
      await expect(probe("glass")).toHaveClass(/\bglass\b/);
      expect(await style(probe("glass-title"), "color")).toBe(foreground);
      expect(await style(probe("glass-description"), "color")).toBe(muted);
      expect(await style(probe("glass-link"), "color")).toBe(primary);
      // The ring inside the glass is the theme's own ring.
      await probe("glass-link").focus();
      expect(await style(probe("glass-link"), "outline-color")).toBe(
        await rootRgb(page, "--ring"),
      );

      // The change review's finding 3: a primary fill on the field inverts to
      // the one measured pair, the legend as fill and the field's colour as
      // text; inside a surface-plain card it is the theme's own again. A
      // default button is planted by the test, since R25 keeps a control off
      // the field in the preview.
      await page.evaluate((n) => {
        // 012 decision 1: the stage's sample is gone; the expressive
        // figure's default button is the same component.
        const button = document.querySelector(
          '[data-testid="mode-expressive"] [data-slot="button"]',
        )!;
        const field = document.querySelector(`[data-testid="field-${n}"]`)!;
        const onField = button.cloneNode(true) as HTMLElement;
        onField.dataset.probe = "planted-on-field";
        field.append(onField);
        const inCard = button.cloneNode(true) as HTMLElement;
        inCard.dataset.probe = "planted-in-card";
        field.querySelector('[data-probe="card"]')!.append(inCard);
      }, n);
      expect(await style(probe("planted-on-field"), "color")).toBe(
        await varRgb(field, `--field-${n}`),
      );
      expect(await style(probe("planted-on-field"), "background-color")).toBe(
        legend,
      );
      expect(await style(probe("planted-in-card"), "color")).toBe(
        await rootRgb(page, "--primary-foreground"),
      );
      expect(await style(probe("planted-in-card"), "background-color")).toBe(
        await rootRgb(page, "--primary"),
      );
    });
  }

  test("a field never shares an element with .dark, and every field sits in an expressive subtree", async ({
    page,
  }) => {
    for (const path of [THEME, GLASS]) {
      await open(page, path);
      const fields = page.locator(
        '[class~="field-1"], [class~="field-2"], [class~="field-3"], [class~="field-4"]',
      );
      expect(await fields.count(), path).toBeGreaterThan(0);
      for (const field of await fields.all()) {
        await expect(field).not.toHaveClass(/\bdark\b/);
        expect(
          await field.evaluate((el) =>
            el.closest("[data-mode]")?.getAttribute("data-mode"),
          ),
        ).toBe("expressive");
      }
    }
  });

  test("no glass has a glass ancestor", async ({ page }) => {
    for (const path of [THEME, GLASS]) {
      await open(page, path);
      expect(
        await page.evaluate(
          () =>
            [...document.querySelectorAll(".glass")].filter((g) =>
              g.parentElement?.closest(".glass"),
            ).length,
        ),
        path,
      ).toBe(0);
    }
  });
});
