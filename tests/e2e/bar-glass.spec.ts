/**
 * 019a decision 2 (the owner, 2026-11-15): the bar is
 * frosted glass on every page at all times, and its text stays legible over
 * the busiest content behind it.
 *
 * The legibility check scrolls dense content under the bar, hides the bar's
 * own text and icons, photographs the panel, and measures each text's colour
 * against every pixel of the rendered glass inside that text's box. The
 * worst pixel must reach 4.5:1.
 */
import type { Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { onlyIn } from "./engines.ts";
import { contrastRatio } from "../../scripts/contrast.ts";
import { open, settled } from "./pages.ts";

const PANEL = '[data-slot="site-bar"] .glass';

const alpha = (c: string) => {
  const m = c
    .match(/rgba?\(([^)]+)\)/)![1]!
    .split(",")
    .map((x) => x.trim());
  return m.length === 4 ? Number(m[3]) : 1;
};

const hex = (rgb: string) =>
  "#" +
  rgb
    .match(/\d+(\.\d+)?/g)!
    .slice(0, 3)
    .map((n) => Math.round(Number(n)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

test.describe("the bar is glass everywhere", () => {
  for (const path of [
    "/",
    "/components/",
    "/components/button/",
    "/start/",
    "/brand/colour/",
    "/foundations/",
    "/changelog/",
  ])
    test(`${path}: glass at the top and after scrolling, never opaque`, async ({
      page,
    }) => {
      await open(page, path);
      const panel = page.locator(PANEL).first();
      const read = () =>
        panel.evaluate((e) => getComputedStyle(e).backgroundColor);
      expect(alpha(await read())).toBeLessThan(1);
      for (const y of [400, 1200, 4000]) {
        await page.evaluate((y) => scrollTo(0, y), y);
        await page.waitForTimeout(250);
        expect(await panel.getAttribute("data-scrolled")).toBeNull();
        expect(alpha(await read()), `${path} at ${y}`).toBeLessThan(1);
      }
    });
});

/**
 * Every text and icon in the panel: the line boxes of each text run (from a
 * Range, so a link's dot or underline beside its words is not counted) and
 * each icon's box, with its colour.
 */
async function targets(page: Page) {
  return page.evaluate((sel) => {
    const panel = document.querySelector(sel)!;
    const p = panel.getBoundingClientRect();
    const out: { name: string; colour: string; box: number[] }[] = [];
    const walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement!;
      if (!n.textContent?.trim()) continue;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || el.closest(".sr-only")) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects())
        if (r.width >= 1 && r.height >= 1)
          out.push({
            name: n.textContent.trim().slice(0, 24),
            colour: s.color,
            box: [r.left - p.left, r.top - p.top, r.width, r.height],
          });
    }
    // Icons, but not the lockup's dots, which are the logo and exempt.
    for (const svg of panel.querySelectorAll("svg")) {
      if (svg.closest('[data-slot="four-dot"]')) continue;
      const r = svg.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const host = svg.closest("button, a");
      out.push({
        name: `icon in ${(host?.getAttribute("aria-label") ?? host?.textContent ?? "").trim().slice(0, 20)}`,
        colour: getComputedStyle(svg).color,
        box: [r.left - p.left, r.top - p.top, r.width, r.height],
      });
    }
    return out;
  }, PANEL);
}

/** Decodes a PNG in a blank page and returns its pixels. */
async function pixels(page: Page, png: Buffer) {
  const scratch = await page.context().newPage();
  const data = await scratch.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d")!;
    g.drawImage(img, 0, 0);
    return {
      w: c.width,
      h: c.height,
      d: Array.from(g.getImageData(0, 0, c.width, c.height).data),
    };
  }, png.toString("base64"));
  await scratch.close();
  return data;
}

const DENSE: { path: string; at: number[] }[] = [
  { path: "/components/button/", at: [300, 700, 1100, 1600] },
  { path: "/components/", at: [500, 1000, 1800, 2600] },
  { path: "/brand/colour/", at: [300, 900, 1500, 2100] },
  { path: "/components/code-block/", at: [400, 900, 1400] },
];

test.describe("the bar's text over the busiest content", () => {
  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ])
    for (const { path, at } of DENSE)
      test(`${path} at ${size.width}: every text and icon in the bar reaches 4.5:1 on the rendered glass behind it`, async ({
        page,
      }) => {
        await page.setViewportSize(size);
        await open(page, path);
        // The pointer's light is the rim's, off the bar.
        await page.mouse.move(size.width / 2, size.height - 10);
        const worst: string[] = [];
        let measured = 0;
        let lowest = Infinity;
        for (const y of at) {
          await page.evaluate((y) => scrollTo(0, y), y);
          await page.waitForTimeout(300);
          const list = await targets(page);
          const hide = await page.addStyleTag({
            content: `${PANEL} * { color: transparent !important; } ${PANEL} svg, ${PANEL} [data-slot="four-dot"] { visibility: hidden !important; }`,
          });
          // 022o: one pixel per CSS pixel, as the boxes are measured. At
          // WebKit's scale factor of 2 the default is twice as large each
          // way, so a box would index the wrong pixels.
          const png = await page.locator(PANEL).first().screenshot({
            animations: "disabled",
            scale: "css",
          });
          await hide.evaluate((s) => (s as Element).remove());
          const img = await pixels(page, png);
          for (const t of list) {
            const fg = hex(t.colour);
            const [x0, y0, w, h] = t.box.map((v) => Math.round(v)) as [
              number,
              number,
              number,
              number,
            ];
            let low = Infinity;
            for (let y1 = Math.max(0, y0); y1 < Math.min(img.h, y0 + h); y1++)
              for (
                let x1 = Math.max(0, x0);
                x1 < Math.min(img.w, x0 + w);
                x1++
              ) {
                const i = (y1 * img.w + x1) * 4;
                const bg =
                  "#" +
                  [img.d[i]!, img.d[i + 1]!, img.d[i + 2]!]
                    .map((v) => v.toString(16).padStart(2, "0"))
                    .join("")
                    .toUpperCase();
                low = Math.min(low, contrastRatio(fg, bg));
              }
            if (low === Infinity) continue;
            measured++;
            lowest = Math.min(lowest, low);
            if (low < 4.5) worst.push(`at ${y}: ${t.name} ${fg} reads ${low}`);
          }
        }
        console.log(
          `bar ${path} at ${size.width}: ${measured} readings, lowest ${lowest}`,
        );
        expect(measured).toBeGreaterThan(0);
        expect(worst).toEqual([]);
      });
});

/**
 * Every translucent thing inside the bar's panel: a background or border
 * colour whose alpha is strictly between 0 and 1, in any colour syntax
 * (`rgba(…)`, `rgb(… / a)`, `oklab(… / a)`, `oklch(… / a)`,
 * `color(srgb … / a)`, as Tailwind's `/NN` modifiers compute), a backdrop
 * filter, or opacity below 1.
 */
function translucent(page: Page) {
  return page.evaluate((sel) => {
    const alpha = (c: string) => {
      if (c === "transparent") return 0;
      const inner = /\(([^)]*)\)\s*$/.exec(c)?.[1];
      if (!inner) return 1;
      const slash = inner.split("/");
      if (slash.length === 2) {
        const a = slash[1]!.trim();
        return a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a);
      }
      const parts = inner.split(",").map((p) => p.trim());
      return /^rgba?\(/.test(c) && parts.length === 4
        ? parseFloat(parts[3]!)
        : 1;
    };
    const out: string[] = [];
    const panel = document.querySelector(sel)!;
    for (const el of panel.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const name = `${el.tagName.toLowerCase()}[${el.getAttribute("data-slot") ?? (el.getAttribute("class") ?? "").slice(0, 40)}]`;
      const bg = alpha(s.backgroundColor);
      if (bg > 0 && bg < 1) out.push(`${name} background ${s.backgroundColor}`);
      for (const side of ["top", "right", "bottom", "left"]) {
        const w = parseFloat(s.getPropertyValue(`border-${side}-width`));
        const c = s.getPropertyValue(`border-${side}-color`);
        const ca = alpha(c);
        if (w > 0 && ca > 0 && ca < 1) out.push(`${name} border-${side} ${c}`);
      }
      if (s.backdropFilter && s.backdropFilter !== "none")
        out.push(`${name} backdrop-filter ${s.backdropFilter}`);
      if (Number(s.opacity) < 1) out.push(`${name} opacity ${s.opacity}`);
    }
    return [...new Set(out)];
  }, PANEL);
}

/**
 * 022x (c): every finite animation on what `translucent` reads, the
 * panel's descendants, has finished: a hover's colour fade (the toggle's is
 * 200 ms) and the fade of the control it left. 250 ms after a hover is
 * enough on an idle machine; on a loaded runner the toggle's background was
 * read mid-fade, at an alpha of 0.173 (the fifth matrix run, §2).
 * Animations that start while it waits are waited for too. The panel's own
 * hover sheen, on its `::after` (600 ms), is not read, so not waited for.
 */
function transitionsDone(page: Page) {
  return page
    .locator(PANEL)
    .first()
    .evaluate(async (panel) => {
      for (;;) {
        const running = panel.getAnimations({ subtree: true }).filter((a) => {
          const effect = a.effect as KeyframeEffect | null;
          return (
            a.playState === "running" &&
            !!effect?.target &&
            effect.target !== panel &&
            !effect.pseudoElement &&
            effect.getComputedTiming().iterations !== Infinity
          );
        });
        if (running.length === 0) return;
        await Promise.all(running.map((a) => a.finished.catch(() => null)));
      }
    });
}

/**
 * 019a decision 3 (the owner, 2026-11-15): only a layer above other content
 * is translucent. Everything inside the bar sits on the bar's level, so no
 * descendant lets the colour behind it show through, at rest or on hover.
 */
test.describe("nothing inside the bar is translucent", () => {
  test("the check finds a child given bg-foreground/50, which computes to oklab with an alpha", async ({
    page,
  }) => {
    await open(page, "/components/button/");
    await settled(page);
    expect(await translucent(page)).toEqual([]);
    await page
      .locator(PANEL)
      .first()
      .evaluate((panel) => {
        const probe = document.createElement("span");
        probe.setAttribute("data-slot", "probe");
        // What Tailwind compiles `bg-foreground/50` to.
        probe.style.backgroundColor =
          "color-mix(in oklab, var(--foreground) 50%, transparent)";
        probe.textContent = "x";
        panel.append(probe);
      });
    const found = await translucent(page);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(/^span\[probe\] background oklab\(.* \/ 0\.5\)$/);
  });

  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ])
    for (const path of ["/", "/components/button/", "/brand/colour/"])
      test(`${path} at ${size.width}: every descendant of the bar's panel is solid or clear, at rest and on hover`, async ({
        page,
      }) => {
        await page.setViewportSize(size);
        await open(page, path);
        await page.mouse.move(size.width / 2, size.height - 10);
        // The lockup's dots fade in with the page's one entrance: read the
        // bar at rest.
        await settled(page);
        expect(await translucent(page), "at rest").toEqual([]);
        const controls = page.locator(`${PANEL} a, ${PANEL} button`);
        for (const control of await controls.all()) {
          if (!(await control.isVisible())) continue;
          await control.hover();
          await page.waitForTimeout(250);
          await transitionsDone(page);
          const label =
            (await control.getAttribute("aria-label")) ??
            (await control.innerText()).trim();
          expect(await translucent(page), `hovering ${label}`).toEqual([]);
        }
      });
});

/**
 * 019a follow-up: the bar's blur must render. An ancestor that is a backdrop
 * root (a view-transition name, a filter, opacity below 1, a mask, a clip
 * path, a blend mode, or will-change on those) stops the glass blurring
 * anything outside it, so only its tint shows. The contrast test passed while
 * that was so; these two catch it.
 */
test.describe("the bar's glass blurs what lies under it", () => {
  test("no ancestor of the glass panel, up to <html>, is a backdrop root", async ({
    page,
  }) => {
    await open(page, "/components/button/");
    const roots = await page.evaluate((sel) => {
      const out: string[] = [];
      const panel = document.querySelector(sel)!;
      for (
        let el = panel.parentElement;
        el && el !== document.documentElement;
        el = el.parentElement
      ) {
        const s = getComputedStyle(el);
        const name = `${el.tagName.toLowerCase()}[${el.getAttribute("data-slot") ?? ""}]`;
        const vt = s.getPropertyValue("view-transition-name");
        if (vt && vt !== "none") out.push(`${name} view-transition-name ${vt}`);
        if (s.filter !== "none") out.push(`${name} filter ${s.filter}`);
        if (Number(s.opacity) < 1) out.push(`${name} opacity ${s.opacity}`);
        const mask = s.getPropertyValue("mask-image") || "none";
        if (mask !== "none") out.push(`${name} mask ${mask}`);
        if (s.clipPath !== "none") out.push(`${name} clip-path ${s.clipPath}`);
        if (s.mixBlendMode !== "normal")
          out.push(`${name} mix-blend-mode ${s.mixBlendMode}`);
        if (s.backdropFilter && s.backdropFilter !== "none")
          out.push(`${name} backdrop-filter ${s.backdropFilter}`);
        if (
          /filter|opacity|mask|clip-path|view-transition-name/.test(
            s.willChange,
          )
        )
          out.push(`${name} will-change ${s.willChange}`);
      }
      return out;
    }, PANEL);
    expect(roots).toEqual([]);
  });

  /** Sum of absolute luminance differences between neighbouring pixels. */
  function energy(img: { w: number; h: number; d: number[] }): number {
    const lum = (i: number) =>
      0.2126 * img.d[i]! + 0.7152 * img.d[i + 1]! + 0.0722 * img.d[i + 2]!;
    let e = 0;
    for (let y = 0; y < img.h - 1; y++)
      for (let x = 0; x < img.w - 1; x++) {
        const i = (y * img.w + x) * 4;
        e += Math.abs(lum(i) - lum(i + 4));
        e += Math.abs(lum(i) - lum(i + img.w * 4));
      }
    return e;
  }

  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ])
    for (const { path, at } of DENSE)
      test(`${path} at ${size.width}: the content under the bar is blurred, not only tinted`, async ({
        page,
      }) => {
        // 022 decision 3: a screenshot is the only measure of the blur, and
        // only Chromium's composites a backdrop filter into it. A plain
        // `backdrop-filter: blur(16px)` over stripes keeps every edge in
        // Playwright's Firefox and WebKit captures (the builder's probe,
        // 2026-11-15). The filter itself computes blur(16px) in all three,
        // and brand.spec.ts checks that in every engine.
        onlyIn(
          "chromium",
          "screenshots: Playwright's Firefox and WebKit capture a page without compositing its backdrop filters",
        );
        await page.setViewportSize(size);
        await open(page, path);
        await page.mouse.move(size.width / 2, size.height - 10);
        let best: { y: number; under: number; through: number } | null = null;
        for (const y of at) {
          await page.evaluate((y) => scrollTo(0, y), y);
          await page.waitForTimeout(300);
          // The panel's interior, inset from its rim and edge.
          const box = await page.locator(PANEL).first().boundingBox();
          const clip = {
            x: box!.x + 8,
            y: box!.y + 8,
            width: box!.width - 16,
            height: box!.height - 16,
          };
          // The bar's own text and icons hidden, so only the glass shows.
          const hideText = await page.addStyleTag({
            content: `${PANEL} * { visibility: hidden !important; }`,
          });
          const through = energy(
            await pixels(
              page,
              await page.screenshot({ clip, animations: "disabled" }),
            ),
          );
          const hideBar = await page.addStyleTag({
            content: `[data-slot="site-bar"] { visibility: hidden !important; }`,
          });
          const under = energy(
            await pixels(
              page,
              await page.screenshot({ clip, animations: "disabled" }),
            ),
          );
          await hideBar.evaluate((s) => (s as Element).remove());
          await hideText.evaluate((s) => (s as Element).remove());
          if (!best || under > best.under) best = { y, under, through };
        }
        // The busiest depth must hold real edges under the bar.
        expect(best!.under, "content under the bar").toBeGreaterThan(5000);
        const ratio = best!.through / best!.under;
        console.log(
          `blur ${path} at ${size.width}, depth ${best!.y}: ${(ratio * 100).toFixed(1)}% of the edges show through`,
        );
        // A tint alone (about 14% of the colour behind in light, 16% in
        // dark) lets that share of the edges through; a 16 px blur keeps
        // almost none.
        expect(ratio).toBeLessThan(0.05);
      });
});
