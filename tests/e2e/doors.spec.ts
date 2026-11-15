/**
 * 015 decisions 6 to 9: the doors against the Google echo, the red door
 * against the error reading, the landings and the mark, and motion.
 */
import { expect, test, type Page } from "@playwright/test";
import { contrastRatio } from "../../scripts/contrast.ts";
import { DOORS } from "../../src/lib/site/doors.ts";
import { COMPONENT_PAGES, hexToRgb, open, settled, SITEMAP } from "./pages.ts";

/**
 * 015's own pages. A later specification's pages (017's Brand pages hold
 * fields by design) are checked by its own blocks, so these loops hold as
 * the page list grows.
 */
const PAGES = SITEMAP.filter((p) => p.spec === "015").map((p) => p.path);

const FIELDS = ".field-1, .field-2, .field-3, .field-4";

/** An `rgb(…)` computed colour as `#rrggbb`. */
function rgbToHex(rgb: string): string {
  const [r, g, b] = (rgb.match(/[\d.]+/g) ?? []).map(Number);
  return (
    "#" +
    [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")
  );
}

async function cssVarAt(
  page: Page,
  selector: string,
  name: string,
): Promise<string> {
  return page
    .locator(selector)
    .first()
    .evaluate((el, n) => getComputedStyle(el).getPropertyValue(n).trim(), name);
}

test.describe("015 criterion 10: the doors, against the Google echo", () => {
  test("4 door links in N1's order, each named by its visible door name", async ({
    page,
  }) => {
    await open(page, "/");
    const doors = page.locator('[data-slot="door"]');
    await expect(doors).toHaveCount(4);
    for (const [i, d] of DOORS.entries()) {
      await expect(doors.nth(i)).toHaveAttribute("href", d.path);
      await expect(doors.nth(i).locator('[data-slot="door-name"]')).toHaveText(
        d.name,
      );
      await expect(doors.nth(i)).toHaveAccessibleName(
        new RegExp(`^${d.name}\\b`),
      );
    }
  });

  test("round elements carrying a field appear on 1 page, the home page", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const round: string[] = [];
    for (const p of PAGES) {
      await open(page, p);
      const n = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].filter((el) => {
          const r = el.getBoundingClientRect();
          const raw = getComputedStyle(el).borderTopLeftRadius;
          const radius = raw.endsWith("%")
            ? (parseFloat(raw) / 100) * r.width
            : parseFloat(raw);
          return r.width > 0 && Math.abs(radius - r.width / 2) < 1;
        }).length;
      }, FIELDS);
      if (n) round.push(p);
    }
    expect(round).toEqual(["/"]);
  });

  for (const width of [1024, 1440]) {
    test(`at ${width}: the doors are no taller than the headline, their top at its first cap height`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/");
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const h1 = document.querySelector("h1")!;
        const map = document.querySelector('[data-slot="door-map"]')!;
        const style = getComputedStyle(h1);
        const size = parseFloat(style.fontSize);
        const ctx = document.createElement("canvas").getContext("2d")!;
        ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
        const t = ctx.measureText(h1.textContent!.trim()[0]);
        const lead = parseFloat(style.lineHeight);
        const half =
          (lead - (t.fontBoundingBoxAscent + t.fontBoundingBoxDescent)) / 2;
        const cap =
          h1.getBoundingClientRect().top +
          t.fontBoundingBoxAscent +
          half -
          t.actualBoundingBoxAscent;
        const a = h1.getBoundingClientRect();
        const b = map.getBoundingClientRect();
        return {
          headline: a.height,
          doors: b.height,
          offsetEm: (b.top - cap) / size,
        };
      });
      expect(m.doors).toBeLessThanOrEqual(m.headline + 0.5);
      expect(Math.abs(m.offsetEm)).toBeLessThanOrEqual(0.1);
    });
  }

  for (const width of [360, 390, 768, 1023]) {
    test(`at ${width}: each disc is at most 40% of the width and 160 px, below the headline`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/");
      // The discs enter on a spring that overshoots; under load `open` can
      // return mid-entrance, so the box would include the overshoot. The
      // sizes are read at rest (019 change review, finding 5).
      await settled(page);
      const discs = await page.evaluate(() => {
        const h1 = document.querySelector("h1")!.getBoundingClientRect();
        return [...document.querySelectorAll('[data-slot="door"]')].map((d) => {
          const r = d.getBoundingClientRect();
          return { size: r.width, below: r.top >= h1.bottom };
        });
      });
      expect(discs).toHaveLength(4);
      for (const d of discs) {
        expect(d.size).toBeLessThanOrEqual(width * 0.4 + 0.5);
        expect(d.size).toBeLessThanOrEqual(160.5);
        expect(d.below).toBe(true);
      }
    });
  }

  for (const width of [360, 390, 768, 1024, 1280, 1440]) {
    test(`at ${width}: every corner of each door's words lies inside its disc, 4 px or more from the edge`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/");
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() =>
        Promise.all(
          document.getAnimations().map((a) => a.finished.catch(() => null)),
        ),
      );
      const least = await page.evaluate(() =>
        [...document.querySelectorAll('[data-slot="door"]')].map((d) => {
          const r = d.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          let room = Infinity;
          for (const part of d.querySelectorAll(
            '[data-slot="door-name"], [data-slot="door-line"]',
          )) {
            const range = document.createRange();
            range.selectNodeContents(part);
            for (const b of range.getClientRects())
              for (const [x, y] of [
                [b.left, b.top],
                [b.right, b.top],
                [b.left, b.bottom],
                [b.right, b.bottom],
              ])
                room = Math.min(room, r.width / 2 - Math.hypot(x - cx, y - cy));
          }
          return room;
        }),
      );
      for (const room of least) expect(room).toBeGreaterThanOrEqual(4);
    });
  }

  test("a focused disc's outline is the theme's --surface-ring, 3:1 or more on the canvas", async ({
    page,
  }) => {
    await open(page, "/");
    const disc = page.locator('[data-slot="door"]').first();
    await disc.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const outline = await disc.evaluate(
      (el) => getComputedStyle(el).outlineColor,
    );
    const ring = await cssVarAt(page, "html", "--surface-ring");
    const canvas = await cssVarAt(page, "html", "--background");
    expect(outline).toBe(hexToRgb(ring));
    expect(
      contrastRatio(rgbToHex(outline), canvas.slice(0, 7)),
    ).toBeGreaterThanOrEqual(3);
  });

  test("2 s after load, with no input, 0 animations are running", async ({
    page,
  }) => {
    await open(page, "/");
    await page.waitForTimeout(2000);
    const running = await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    );
    expect(running).toBe(0);
  });
});

test.describe("015 criterion 11: the red door, against the error reading", () => {
  test("outside the home page, field-2 is on 1 page, the Components landing; component pages, the changelog and the 404 carry no field outside an example frame", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const red: string[] = [];
    const fielded: string[] = [];
    const framed: string[] = [];
    const quiet = new Set([...COMPONENT_PAGES, "/changelog/"]);
    for (const p of PAGES.filter((p) => p !== "/")) {
      await open(page, p);
      const counts = await page.evaluate((sel) => {
        const all = [...document.querySelectorAll(sel)];
        const inFrame = (el: Element) => !!el.closest('[data-slot="frame"]');
        return {
          red: all.filter((el) => el.matches(".field-2") && !inFrame(el))
            .length,
          framed: all.filter(inFrame).length,
        };
      }, FIELDS);
      if (counts.red > 0) red.push(p);
      if (counts.framed > 0) framed.push(p);
      if (quiet.has(p)) {
        const outside = await page.evaluate(
          (sel) =>
            [...document.querySelectorAll(sel)].filter(
              (el) => !el.closest('[data-slot="frame"]'),
            ).length,
          FIELDS,
        );
        if (outside) fielded.push(p);
      }
    }
    expect(red).toEqual(["/components/"]);
    expect(fielded).toEqual([]);
    // Inside example frames, fields appear only where the item is fields.
    expect(
      framed.every((p) =>
        ["/components/pluto-theme/", "/components/liquid-glass/"].includes(p),
      ),
    ).toBe(true);
  });

  test("the Components band: 0 svg outside its glass, 0 example frames, 1 control, inside the glass", async ({
    page,
  }) => {
    await open(page, "/components/");
    const band = page.locator('[data-slot="band"]');
    const counts = await band.evaluate((el) => ({
      svg: [...el.querySelectorAll("svg")].filter((s) => !s.closest(".glass"))
        .length,
      frames: el.querySelectorAll('[data-slot="frame"]').length,
      controls: [...el.querySelectorAll("a[href], button")].map(
        (c) => !!c.closest(".glass"),
      ),
    }));
    expect(counts.svg).toBe(0);
    expect(counts.frames).toBe(0);
    expect(counts.controls).toEqual([true]);
  });

  test("the bar's current door computes its text and its underline to --foreground", async ({
    page,
  }) => {
    for (const p of ["/components/", COMPONENT_PAGES[0]]) {
      await open(page, p);
      const link = page.locator('[data-slot="site-bar"] [aria-current]');
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute(
        "aria-current",
        p === "/components/" ? "page" : "true",
      );
      const [colour, underline, fg] = await link.evaluate((el) => {
        const s = getComputedStyle(el);
        return [
          s.color,
          s.textDecorationColor,
          getComputedStyle(el).getPropertyValue("--foreground").trim(),
        ];
      });
      expect(colour).toBe(hexToRgb(fg));
      expect(underline).toBe(hexToRgb(fg));
    }
  });

  test('the "Do" and "Don\'t" headings compute to --foreground on 75 of 75 component pages', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const wrong: string[] = [];
    for (const p of COMPONENT_PAGES) {
      await open(page, p);
      const heads = page.locator('[data-slot="usage-heading"]');
      if ((await heads.count()) !== 2) {
        wrong.push(`${p}: ${await heads.count()} headings`);
        continue;
      }
      for (const h of await heads.all()) {
        const [c, fg] = await h.evaluate((el) => [
          getComputedStyle(el).color,
          getComputedStyle(el).getPropertyValue("--foreground").trim(),
        ]);
        if (c !== hexToRgb(fg)) wrong.push(`${p}: ${c}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});

/** Each landing's band: what it holds (decision 5's table). */
const BANDS = [
  { path: "/start/", n: 1, controls: 2, stops: 4, glass: true },
  { path: "/components/", n: 2, controls: 1, stops: 2, glass: true },
  { path: "/brand/", n: 3, controls: 0, stops: 0, glass: false },
  { path: "/foundations/", n: 4, controls: 0, stops: 0, glass: true },
];

test.describe("015 criterion 12: the landings and the mark", () => {
  for (const b of BANDS) {
    test(`${b.path}: the band carries field-${b.n}, its text the legend, its glass the theme's roles; ${b.controls} controls and ${b.stops} tab stops, all in the glass; 0 svg outside it`, async ({
      page,
    }) => {
      await open(page, b.path);
      const band = page.locator('[data-slot="band"]');
      await expect(band).toHaveClass(new RegExp(`\\bfield-${b.n}\\b`));
      const legend = await cssVarAt(page, "html", `--field-${b.n}-foreground`);
      const title = band.locator("h1");
      await expect(title).toHaveCSS("color", hexToRgb(legend));
      const r = await band.evaluate((el) => {
        const tabbable =
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const all = [...el.querySelectorAll(tabbable)];
        return {
          glass: el.querySelectorAll(".glass").length,
          controls: [...el.querySelectorAll("a[href], button")].map(
            (c) => !!c.closest(".glass"),
          ),
          stops: all.map((c) => !!c.closest(".glass")),
          svg: [...el.querySelectorAll("svg")].filter(
            (s) => !s.closest(".glass"),
          ).length,
          glassText: [
            ...el.querySelectorAll(".glass p, .glass dt, .glass dd"),
          ].map((t) => [
            getComputedStyle(t).color,
            getComputedStyle(document.documentElement)
              .getPropertyValue("--foreground")
              .trim(),
            getComputedStyle(document.documentElement)
              .getPropertyValue("--muted-foreground")
              .trim(),
          ]),
        };
      });
      expect(r.glass > 0).toBe(b.glass);
      expect(r.controls).toEqual(Array(b.controls).fill(true));
      expect(r.stops).toEqual(Array(b.stops).fill(true));
      expect(r.svg).toBe(0);
      for (const [colour, fg, muted] of r.glassText)
        expect([hexToRgb(fg), hexToRgb(muted)]).toContain(colour);
    });
  }

  test("the Brand band's lockup computes all four dots and its word to --field-3-foreground", async ({
    page,
  }) => {
    await open(page, "/brand/");
    const lockup = page.locator('[data-slot="band"] [data-slot="lockup"]');
    await expect(lockup).toHaveCount(1);
    const legend = hexToRgb(
      await cssVarAt(page, "html", "--field-3-foreground"),
    );
    await expect(lockup).toHaveCSS("color", legend);
    const dots = await lockup
      .locator('[data-slot="four-dot-dot"]')
      .evaluateAll((ds) => ds.map((d) => getComputedStyle(d).backgroundColor));
    expect(dots).toEqual([legend, legend, legend, legend]);
  });

  test("on every page, every four-colour mark sits on the canvas, a card or glass, never on a field", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const wrong: string[] = [];
    for (const p of PAGES) {
      await open(page, p);
      const found = await page.evaluate((fields) => {
        const bad: string[] = [];
        for (const mark of document.querySelectorAll(
          '[data-slot="four-dot"]',
        )) {
          const colours = new Set(
            [...mark.querySelectorAll('[data-slot="four-dot-dot"]')].map(
              (d) => getComputedStyle(d).backgroundColor,
            ),
          );
          if (colours.size !== 4) continue;
          // Over a band, the bar's glass is what the mark is painted on.
          let el = mark.parentElement;
          while (
            el &&
            ["rgba(0, 0, 0, 0)", "transparent"].includes(
              getComputedStyle(el).backgroundColor,
            )
          )
            el = el.parentElement;
          if (el?.matches(fields))
            bad.push(
              mark.closest("[data-slot]")?.getAttribute("data-slot") ?? "mark",
            );
        }
        return bad;
      }, FIELDS);
      if (found.length) wrong.push(`${p}: ${found.join(", ")}`);
    }
    expect(wrong).toEqual([]);
  });
});

test.describe("015 criterion 27: reduced motion and the door transition", () => {
  async function countTransitions(page: Page): Promise<void> {
    await page.addInitScript(() => {
      const w = window as unknown as { transitions: number };
      w.transitions = 0;
      const start = document.startViewTransition?.bind(document);
      if (start)
        document.startViewTransition = ((arg: unknown) => {
          w.transitions++;
          return start(arg as never);
        }) as typeof document.startViewTransition;
    });
  }
  const transitions = (page: Page) =>
    page.evaluate(
      () => (window as unknown as { transitions: number }).transitions,
    );

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    for (const p of ["/", "/components/dialog/"]) {
      test(`${p}: 0 animations run, at load or after`, async ({ page }) => {
        // A keyframe animation counts whatever its length; a transition
        // counts when it lasts 1 ms or more. Under reduced motion the theme
        // sets every duration to 0.01 ms, so a font swap's change of a `ch`
        // width is a transition of 0.01 ms: no motion.
        const MOVING = `() => document.getAnimations().filter((a) => a.playState === "running" && (a.constructor.name === "CSSAnimation" || Number(a.effect?.getComputedTiming().duration) >= 1)).length`;
        await page.addInitScript((src) => {
          const moving = eval(src) as () => number;
          window.addEventListener("load", () => {
            (window as unknown as { atLoad: number }).atLoad = moving();
          });
        }, MOVING);
        await open(page, p);
        expect(
          await page.evaluate(
            () => (window as unknown as { atLoad: number }).atLoad,
          ),
        ).toBe(0);
        expect(await page.evaluate(`(${MOVING})()`)).toBe(0);
      });
    }
    test("following the Start disc starts 0 view transitions", async ({
      page,
    }) => {
      await countTransitions(page);
      await open(page, "/");
      await page.locator('[data-slot="door"]').first().click();
      await expect(page).toHaveURL(/\/start\/$/);
      expect(await transitions(page)).toBe(0);
    });
  });

  test("following the Start disc starts 1 view transition; following a bar link starts 0", async ({
    page,
  }) => {
    await countTransitions(page);
    await open(page, "/");
    await page.locator('[data-slot="door"]').first().click();
    await expect(page).toHaveURL(/\/start\/$/);
    expect(await transitions(page)).toBe(1);
    await page
      .locator('[data-slot="site-bar"]')
      .getByRole("link", { name: "Brand", exact: true })
      .click();
    await expect(page).toHaveURL(/\/brand\/$/);
    expect(await transitions(page)).toBe(1);
  });
});

test.describe("017: the Colour page's bands", () => {
  test("criterion 8: the 4 bands hold 0 marks, 0 controls and 0 svg, and every text element in their glass computes --foreground", async ({
    page,
  }) => {
    await open(page, "/brand/colour/");
    const bands = page.locator('[data-slot="colour-band"]');
    await expect(bands).toHaveCount(4);
    const found = await bands.evaluateAll((els) =>
      els.map((b) => ({
        marks: b.querySelectorAll('[data-slot="four-dot"]').length,
        controls: b.querySelectorAll(
          'a, button, input, select, textarea, [role="button"], [tabindex]',
        ).length,
        svg: b.querySelectorAll("svg").length,
        off: [...b.querySelectorAll(".glass *")]
          .filter((e) =>
            [...e.childNodes].some(
              (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
            ),
          )
          .filter((e) => {
            const probe = document.createElement("span");
            probe.style.color = "var(--foreground)";
            e.appendChild(probe);
            const want = getComputedStyle(probe).color;
            probe.remove();
            return getComputedStyle(e).color !== want;
          })
          .map((e) => e.tagName),
      })),
    );
    expect(found).toEqual(
      Array(4).fill({ marks: 0, controls: 0, svg: 0, off: [] }),
    );
  });

  test("017: the foreground on the yellow band's glass, as painted, passes 4.5:1", async ({
    page,
  }, info) => {
    await open(page, "/brand/colour/");
    const glass = page
      .locator('[data-slot="colour-band"]')
      .nth(2)
      .locator(".glass");
    await glass.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const shot = (await glass.screenshot()).toString("base64");
    const text = await glass
      .locator("p")
      .evaluate((e) => getComputedStyle(e).color);
    const ground = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const [r, g, b] = ctx.getImageData(
        8,
        Math.floor(img.height / 2),
        1,
        1,
      ).data;
      return [r, g, b];
    }, shot);
    const hex = (rgb: number[]) =>
      "#" + rgb.map((n) => n.toString(16).padStart(2, "0")).join("");
    const ratio = contrastRatio(rgbToHex(text), hex(ground));
    info.annotations.push({
      type: "ratio",
      description: `${info.project.name}: ${ratio.toFixed(2)}:1, ${rgbToHex(text)} on ${hex(ground)}`,
    });
    console.log(
      `yellow glass, ${info.project.name}: ${ratio.toFixed(2)}:1 (${rgbToHex(text)} on ${hex(ground)})`,
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("017: the motion page", () => {
  /** The animations running inside the page's specimens. */
  async function running(page: Page): Promise<number> {
    return page.evaluate(
      () =>
        document.getAnimations().filter((a) => {
          const t = (a.effect as KeyframeEffect | null)?.target;
          return (
            t instanceof Element &&
            t.closest("[data-specimen]") &&
            a.playState === "running"
          );
        }).length,
    );
  }

  test("criterion 13: 0 specimen animations run before a Replay, and each Replay plays its specimen once", async ({
    page,
  }) => {
    await open(page, "/brand/motion/");
    for (let i = 0; i < 6; i++) {
      expect(await running(page)).toBe(0);
      await page.waitForTimeout(250);
    }
    for (const name of ["Replay the entrance", "Replay the reveal"]) {
      await page.getByRole("button", { name }).click();
      await expect.poll(() => running(page)).toBeGreaterThan(0);
      await expect.poll(() => running(page), { timeout: 3000 }).toBe(0);
      await page.waitForTimeout(500);
      expect(await running(page)).toBe(0);
    }
  });

  test("criterion 13: under reduced motion, Replay plays nothing and the dots are in place", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, "/brand/motion/");
    for (const name of ["Replay the entrance", "Replay the reveal"]) {
      await page.getByRole("button", { name }).click();
      await page.waitForTimeout(100);
      expect(await running(page)).toBe(0);
    }
    const dots = await page
      .locator('[data-specimen] [data-slot="four-dot-dot"]')
      .evaluateAll((els) =>
        els.map((e) => {
          const s = getComputedStyle(e);
          return `${s.opacity} ${s.transform}`;
        }),
      );
    expect(dots).toEqual(Array(8).fill("1 none"));
  });
});

test.describe("017 criterion 8: no four-colour mark on a field, on 017's pages", () => {
  const PAGES_017 = SITEMAP.filter((p) => p.spec === "017").map((p) => p.path);

  test("on every 017 page, every four-colour mark sits on the canvas, a card or glass, never on a field", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(PAGES_017).toHaveLength(21);
    const wrong: string[] = [];
    for (const p of PAGES_017) {
      await open(page, p);
      const found = await page.evaluate((fields) => {
        const bad: string[] = [];
        for (const mark of document.querySelectorAll(
          '[data-slot="four-dot"]',
        )) {
          const colours = new Set(
            [...mark.querySelectorAll('[data-slot="four-dot-dot"]')].map(
              (d) => getComputedStyle(d).backgroundColor,
            ),
          );
          if (colours.size !== 4) continue;
          // The nearest ancestor that paints a ground.
          let el = mark.parentElement;
          while (
            el &&
            ["rgba(0, 0, 0, 0)", "transparent"].includes(
              getComputedStyle(el).backgroundColor,
            )
          )
            el = el.parentElement;
          if (el?.matches(fields))
            bad.push(
              mark.closest("[data-slot]")?.getAttribute("data-slot") ?? "mark",
            );
        }
        return bad;
      }, FIELDS);
      if (found.length) wrong.push(`${p}: ${found.join(", ")}`);
    }
    expect(wrong).toEqual([]);
  });
});
