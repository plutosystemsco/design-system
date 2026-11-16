/**
 * 018 decision 15, criterion 21: the site's new surfaces keep their meaning
 * when the system repaints the page. Each engine's light project only
 * (022 decision 2).
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../test.ts";
import { onlyProjects } from "./engines.ts";
import { open } from "./pages.ts";

test.use({ forcedColors: "active" });
onlyProjects(
  ["chromium-light", "firefox-light", "webkit-light"],
  "light schemes only",
);

const canvas = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const p = document.createElement("div");
    p.style.backgroundColor = "Canvas";
    document.body.append(p);
    const c = getComputedStyle(p).backgroundColor;
    p.remove();
    return c;
  });

test("the nav's current link: a start border unlike the canvas, at 1440; the sheet's too, at 390", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, "/components/button/");
  const bg = await canvas(page);
  const mark = (sel: string) =>
    page.locator(sel).evaluate((a) => {
      const s = getComputedStyle(a);
      return {
        w: s.borderInlineStartWidth,
        c: s.borderInlineStartColor,
        weight: s.fontWeight,
      };
    });
  const nav = await mark(
    'nav[aria-label="Components pages"] a[aria-current="page"]',
  );
  expect(nav.w).not.toBe("0px");
  expect(nav.c).not.toBe(bg);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu" }).click();
  const sheet = await mark(
    'nav[aria-label="All pages"] a[aria-current="page"]',
  );
  expect(sheet.w).not.toBe("0px");
  expect(sheet.c).not.toBe(bg);
});

test("the page tools have text unlike their ground", async ({ page }) => {
  await open(page, "/components/button/");
  for (const el of [
    page.getByRole("button", { name: "Copy page" }),
    page.getByRole("link", { name: "View as Markdown" }),
  ]) {
    const [fg, bg] = await el.evaluate((e) => {
      let g = e as Element | null;
      let ground = "rgba(0, 0, 0, 0)";
      while (
        g &&
        ["rgba(0, 0, 0, 0)", "transparent"].includes(
          (ground = getComputedStyle(g).backgroundColor),
        )
      )
        g = g.parentElement;
      return [getComputedStyle(e).color, ground];
    });
    expect(fg).not.toBe(bg);
  }
});

test("the bar's panel is opaque", async ({ page }) => {
  await open(page, "/components/button/");
  const bg = await page
    .locator('[data-slot="site-bar"] .glass')
    .first()
    .evaluate((e) => getComputedStyle(e).backgroundColor);
  expect(bg).not.toMatch(/rgba\(.*, 0(\.\d+)?\)$/);
});

test("search marks: a ground unlike the canvas, or weight 600", async ({
  page,
}) => {
  await open(page, "/components/");
  const bg = await canvas(page);
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search the site" }).fill("dia");
  const marks = page.locator("mark");
  await expect(marks.first()).toBeVisible();
  for (const m of await marks.all()) {
    const s = await m.evaluate((e) => [
      getComputedStyle(e).backgroundColor,
      getComputedStyle(e).fontWeight,
    ]);
    expect(s[0] !== bg || s[1] === "600").toBe(true);
  }
});

// 018 change review, finding 8: each swatch against its own token value,
// and visibly painted: a ground with alpha above 0 (but for the clear
// primitive, which the token file defines transparent), and a border that
// shows.
test("on Colour, every swatch keeps its own token value, painted, with a visible 1 px border", async ({
  page,
}) => {
  await open(page, "/foundations/colour/");
  const sw = await page.locator('[data-slot="swatch"]').evaluateAll((els) =>
    els.map((e) => {
      const cs = getComputedStyle(e);
      return {
        value: e.getAttribute("data-value") ?? "",
        bg: cs.backgroundColor,
        width: cs.borderTopWidth,
        border: cs.borderTopColor,
      };
    }),
  );
  const rgba = (c: string) => {
    const n = (c.match(/[\d.]+/g) ?? []).map(Number);
    return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
  };
  const fromHex = (hex: string) => {
    const d = hex.replace("#", "");
    const v = (k: number) => parseInt(d.slice(k, k + 2), 16);
    return [v(0), v(2), v(4), d.length === 8 ? v(6) / 255 : 1];
  };
  expect(sw.length).toBeGreaterThan(50);
  const wrong: string[] = [];
  for (const s of sw) {
    const got = rgba(s.bg);
    const want = fromHex(s.value);
    const same =
      got.slice(0, 3).every((x, k) => x === want[k]) &&
      Math.abs(got[3] - want[3]) < 0.01;
    if (
      !same ||
      (got[3] <= 0 && want[3] > 0) ||
      s.width !== "1px" ||
      rgba(s.border)[3] <= 0
    )
      wrong.push(`${s.value}: ${s.bg}, border ${s.width} ${s.border}`);
  }
  expect(wrong).toEqual([]);
});

test("the changelog's badge has a visible border", async ({ page }) => {
  await open(page, "/changelog/");
  const b = await page
    .locator('[data-slot="badge"]', { hasText: "Interface change" })
    .first()
    .evaluate((e) => getComputedStyle(e).borderTopWidth);
  expect(b).not.toBe("0px");
});

// 022b's review, finding 1: what is painted, not what is computed. Chromium
// draws a Canvas backplate behind forced text, so a label whose colour is
// Canvas vanishes while its computed pair reads 21:1, and axe passes it.
// Each scheme's forced palette, from this light project.
for (const colorScheme of ["light", "dark"] as const)
  test(`the pressed theme segment's label is drawn, ${colorScheme} palette`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme, forcedColors: "active" });
    await open(page, "/components/button/");
    const pressed = page
      .getByRole("group", { name: /: theme$/ })
      .first()
      .locator('button[aria-pressed="true"]');
    await pressed.waitFor();
    // The label's own text box, once the colour transition has ended, cut
    // to whole pixels inside it, so no edge of the fill around it counts.
    const box = await pressed.evaluate(async (el) => {
      await Promise.all(el.getAnimations().map((a) => a.finished));
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      const x = Math.ceil(r.left) + 1;
      const y = Math.ceil(r.top) + 1;
      const right = Math.floor(r.right) - 1;
      const bottom = Math.floor(r.bottom) - 1;
      return { x, y, width: right - x, height: bottom - y };
    });
    expect(box.width * box.height).toBeGreaterThan(0);
    const png = await page.screenshot({ clip: box });
    const scratch = await page.context().newPage();
    const share = await scratch.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const counts = new Map<string, number>();
      for (let i = 0; i < d.length; i += 4) {
        const k = `${d[i]},${d[i + 1]},${d[i + 2]}`;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return Math.max(...counts.values()) / (d.length / 4);
    }, png.toString("base64"));
    await scratch.close();
    // Glyphs on a fill: no one colour covers the whole box.
    expect(
      share,
      "the most common colour's share of the label's box",
    ).toBeLessThanOrEqual(0.95);
  });

// 022's review, finding 3: one test per page, so a ledger line names one
// page and the others are still scanned.
for (const p of ["/components/button/", "/foundations/colour/", "/changelog/"])
  test(`axe finds 0 violations on ${p}`, async ({ page }) => {
    await open(page, p);
    const r = await new AxeBuilder({ page }).analyze();
    expect(r.violations.map((v) => `${p}: ${v.id}`)).toEqual([]);
  });
