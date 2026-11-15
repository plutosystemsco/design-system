/**
 * 018 decision 12, criterion 17: the Foundations Type and Colour pages as
 * specimens, read from the token file. Both projects. `017`'s token-page
 * checks (`tokens-pages.test.ts`, `build-output.spec.ts`) stay as they are.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { contrastTable } from "../../scripts/contrast.ts";
import { readTokens, resolveColor } from "../../scripts/tokens.ts";
import { open } from "./pages.ts";

const tokens = readTokens();

/** A token file colour (#RGB, #RRGGBB or #RRGGBBAA) as channels and alpha. */
function channels(hex: string): [number, number, number, number] {
  let d = hex.trim().replace("#", "");
  if (d.length === 3 || d.length === 4) d = [...d].map((c) => c + c).join("");
  const n = (i: number) => parseInt(d.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), d.length === 8 ? n(6) / 255 : 1];
}

/** A computed `rgb()` or `rgba()` as channels and alpha. */
function computed(css: string): [number, number, number, number] {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(css);
  if (!m) throw new Error(`not an rgb colour: "${css}"`);
  return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
}

function sameColour(css: string, hex: string, what: string) {
  const [a, b] = [computed(css), channels(hex)];
  expect(a.slice(0, 3), what).toEqual(b.slice(0, 3));
  expect(Math.abs(a[3] - b[3]), what).toBeLessThan(0.01);
}

const px = (v: string) => parseFloat(v);

const style = (l: Locator) =>
  l.evaluate((e) => {
    const s = getComputedStyle(e);
    return {
      family: s.fontFamily,
      size: s.fontSize,
      leading: s.lineHeight,
      colour: s.color,
      ground: s.backgroundColor,
      adjust: s.forcedColorAdjust,
      border: s.borderTopWidth,
    };
  });

/** The first face a `font-family` names, without quotes. */
const firstFace = (family: string) =>
  family.split(",")[0].replaceAll(/['"]/g, "").trim();

test.describe("018 criterion 17: Type", () => {
  test("each family's sample computes its own face, at the text-2xl step", async ({
    page,
  }) => {
    await open(page, "/foundations/type/");
    // 24 px is asked; the scale has no 24 px step, so the sample takes the
    // nearest, text-2xl.
    const step = tokens.type.scale["2xl"];
    for (const [id, f] of Object.entries(tokens.type.families)) {
      const sample = page.locator(
        `[data-family-row="${id}"] [data-slot="specimen"]`,
      );
      await expect(sample, id).toHaveCount(1);
      await expect(sample, id).not.toBeEmpty();
      const s = await style(sample);
      expect(firstFace(s.family), id).toBe(firstFace(f.family));
      expect(px(s.size), id).toBe(step.px);
    }
  });

  test("each text-scale step's sample computes that step's size and leading", async ({
    page,
  }) => {
    await open(page, "/foundations/type/");
    for (const [id, step] of Object.entries(tokens.type.scale)) {
      const sample = page.locator(
        `[data-scale-row="${id}"] [data-slot="specimen"]`,
      );
      await expect(sample, id).toHaveCount(1);
      const s = await style(sample);
      expect(px(s.size), id).toBeCloseTo(step.px, 2);
      expect(px(s.leading), id).toBeCloseTo(step.px * step.lineHeight, 1);
    }
  });

  for (const width of [390, 1440]) {
    test(`at ${width}, each display step's "Pluto" computes a size within its clamp, at its leading`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/foundations/type/");
      const heading = firstFace(tokens.type.families.heading.family);
      for (const [id, step] of Object.entries(
        tokens.expressive.display.steps,
      )) {
        const sample = page.locator(
          `[data-step-row="${id}"] [data-slot="specimen"]`,
        );
        await expect(sample, id).toHaveText("Pluto");
        const s = await style(sample);
        const size = px(s.size);
        expect(size, id).toBeGreaterThanOrEqual(step.minPx);
        expect(size, id).toBeLessThanOrEqual(step.maxPx);
        const want = Math.min(
          step.maxPx,
          Math.max(step.minPx, (step.vw * width) / 100),
        );
        expect(Math.abs(size - want), id).toBeLessThan(1);
        expect(px(s.leading), id).toBeCloseTo(size * step.lineHeight, 0);
        expect(firstFace(s.family), id).toBe(heading);
      }
    });
  }
});

test.describe("018 criterion 17: Colour", () => {
  const roles = Object.keys(tokens.themes.light).filter(
    (r) => !r.startsWith("syntax-"),
  );
  const surfaceOf = (role: string) =>
    role === "foreground"
      ? "background"
      : role.endsWith("-foreground")
        ? role.slice(0, -"-foreground".length)
        : null;

  async function rowSwatches(page: Page, role: string) {
    const row = page.locator(`[data-role-row="${role}"]`);
    await expect(row, role).toHaveCount(1);
    const sw = row.locator('[data-slot="swatch"]');
    await expect(sw, role).toHaveCount(2);
    return { row, sw };
  }

  test("each role row shows 2 swatches of at least 56 px, in the token file's light and dark values, each with its value", async ({
    page,
  }) => {
    await open(page, "/foundations/colour/");
    for (const role of roles) {
      const { row, sw } = await rowSwatches(page, role);
      const surface = surfaceOf(role);
      for (const [i, theme] of (["light", "dark"] as const).entries()) {
        const one = sw.nth(i);
        const box = (await one.boundingBox())!;
        expect(box.width, `${role} ${theme}`).toBeGreaterThanOrEqual(56);
        expect(box.height, `${role} ${theme}`).toBeGreaterThanOrEqual(56);
        const s = await style(one);
        const value = resolveColor(tokens, theme, role);
        if (surface) {
          sameColour(s.colour, value, `${role} ${theme} text`);
          sameColour(
            s.ground,
            resolveColor(tokens, theme, surface),
            `${role} ${theme} on ${surface}`,
          );
          await expect(one, `${role} ${theme}`).toHaveText("Aa");
        } else sameColour(s.ground, value, `${role} ${theme}`);
        expect(s.adjust, `${role} ${theme}`).toBe("none");
        expect(s.border, `${role} ${theme}`).toBe("1px");
        await expect(row, `${role} ${theme}`).toContainText(value);
      }
    }
  });

  test("each -foreground swatch shows its pair's measured ratio from contrastTable", async ({
    page,
  }) => {
    await open(page, "/foundations/colour/");
    const foregrounds = roles.filter(surfaceOf);
    expect(foregrounds.length).toBeGreaterThan(10);
    for (const role of foregrounds) {
      const { row } = await rowSwatches(page, role);
      const ratios = row.locator("[data-ratio]");
      await expect(ratios, role).toHaveCount(2);
      for (const [i, theme] of (["light", "dark"] as const).entries()) {
        const want = contrastTable(tokens, theme).find(
          (r) => r.label === `${role} on ${surfaceOf(role)}`,
        );
        expect(want, `${role} ${theme} in contrastTable`).toBeDefined();
        await expect(ratios.nth(i), `${role} ${theme}`).toContainText(
          `${want!.ratio.toFixed(2)}:1`,
        );
      }
    }
    // A role that is not a foreground shows no ratio.
    await expect(
      page.locator('[data-role-row="border"] [data-ratio]'),
    ).toHaveCount(0);
  });

  test("the 16 px chips on Tokens are swatches too: forced-color-adjust none and a 1 px border", async ({
    page,
  }) => {
    await open(page, "/foundations/tokens/");
    const chips = await page
      .locator('[data-slot="swatch"]')
      .evaluateAll((els) =>
        els.map((e) => [
          getComputedStyle(e).forcedColorAdjust,
          getComputedStyle(e).borderTopWidth,
        ]),
      );
    expect(chips.length).toBeGreaterThan(100);
    for (const [adjust, border] of chips) {
      expect(adjust).toBe("none");
      expect(border).toBe("1px");
    }
  });
});
