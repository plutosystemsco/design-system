/**
 * 015: the site as a whole. Names and titles (criterion 5), no sideways
 * scroll (criterion 9), the sentences 013 and 016 require (criterion 13),
 * the 404 page at any depth (criterion 23) and the overflow regions
 * (criterion 26).
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { DOORS } from "../../src/lib/site/doors.ts";
import {
  COMPONENT_PAGES,
  GROUND,
  open,
  PAGES,
  SITEMAP,
  type ThemeName,
} from "./pages.ts";

const NAME = "Pluto Systems design";

test.describe("015 criterion 5: the name", () => {
  test("every page's <title> ends with the site's name; the home page's is the name alone; the bar's lockup link is named for the site", async ({
    request,
  }) => {
    const wrong: string[] = [];
    for (const p of PAGES) {
      const html = await (await request.get(p)).text();
      const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
      const want = p === "/" ? title === NAME : title.endsWith(` | ${NAME}`);
      if (!want) wrong.push(`${p}: title "${title}"`);
      const header = /<header[\s\S]*?<\/header>/.exec(html)?.[0] ?? "";
      if (!header.includes(`aria-label="${NAME}"`))
        wrong.push(`${p}: no lockup named "${NAME}"`);
    }
    expect(wrong).toEqual([]);
  });

  test("the lockup link's accessible name, on the home page and a component page", async ({
    page,
  }) => {
    for (const p of ["/", COMPONENT_PAGES[0]]) {
      await open(page, p);
      await expect(
        page.getByRole("banner").getByRole("link"),
      ).toHaveAccessibleName(NAME);
    }
  });

  test('0 occurrences of "Pluto Systems design system" in src/routes/ and src/lib/site/', () => {
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const full = path.join(dir, e);
        return statSync(full).isDirectory() ? files(full) : [full];
      });
    const hits = [...files("src/routes"), ...files("src/lib/site")].filter(
      (f) => readFileSync(f, "utf8").includes("Pluto Systems design system"),
    );
    expect(hits).toEqual([]);
  });
});

test.describe("015 criterion 9: no page scrolls sideways", () => {
  for (const width of [360, 390]) {
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 800 } });
      test(`every page's scrollWidth is ${width}`, async ({ page }) => {
        test.setTimeout(300_000);
        const wide: string[] = [];
        for (const p of PAGES) {
          await open(page, p);
          const w = await page.evaluate(
            () => document.documentElement.scrollWidth,
          );
          if (w !== width) wide.push(`${p}: ${w}`);
        }
        expect(wide).toEqual([]);
      });
    });
  }
});

test.describe("015 criterion 13: nothing required is lost", () => {
  const fixture = JSON.parse(
    readFileSync("tests/e2e/fixtures/item-page-sentences.json", "utf8"),
  ) as { sentences: { page: string; sentence: string; requiredBy: string }[] };

  test(`every sentence of item-page-sentences.json (${fixture.sentences.length}) is on its page`, async ({
    page,
  }) => {
    const missing: string[] = [];
    for (const s of fixture.sentences) {
      await open(page, s.page);
      const text = await page
        .locator("main")
        .first()
        .evaluate((m) => (m.textContent ?? "").replace(/\s+/g, " "));
      if (!text.includes(s.sentence)) missing.push(`${s.page}: ${s.sentence}`);
    }
    expect(missing).toEqual([]);
  });

  test("58 of 58 item pages render at least 1 frame, the first with its code open; the 17 blocks and compositions render their viewer", async ({
    request,
  }) => {
    const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
      items: { name: string; type: string; meta: { group: string } }[];
    };
    const framed: string[] = [];
    const viewers: string[] = [];
    const wrong: string[] = [];
    for (const item of registry.items) {
      const html = await (
        await request.get(`/components/${item.name}/`)
      ).text();
      const viewer = html.includes('data-testid="viewer"');
      if (
        item.type === "registry:block" ||
        item.meta.group === "compositions"
      ) {
        if (viewer) viewers.push(item.name);
        else wrong.push(`${item.name}: no viewer`);
        continue;
      }
      const frames = html.split('data-slot="frame"').length - 1;
      if (!frames) {
        wrong.push(`${item.name}: no frame`);
        continue;
      }
      const first = html.slice(html.indexOf('data-slot="frame"'));
      const code = first.slice(
        first.indexOf('data-slot="frame-code"'),
        first.indexOf("</section>"),
      );
      if (/<details/.test(code))
        wrong.push(`${item.name}: the first frame's code is closed`);
      else framed.push(item.name);
    }
    expect(wrong).toEqual([]);
    expect(framed).toHaveLength(58);
    expect(viewers).toHaveLength(17);
  });

  test('"amber" is on 0 component pages', async ({ request }) => {
    const pages: string[] = [];
    for (const p of COMPONENT_PAGES) {
      const html = await (await request.get(p)).text();
      const main = /<main[\s\S]*?<\/main>/.exec(html)?.[0] ?? "";
      if (/amber/i.test(main.replace(/<[^>]+>/g, " "))) pages.push(p);
    }
    expect(pages).toEqual([]);
  });
});

/**
 * 015 criterion 26: on the 7 pages that scrolled sideways at v0.11.0, every
 * element that scrolls sideways is focusable and has an accessible name.
 */
test.describe("015 criterion 26: overflow regions", () => {
  const PAGES_7 = [
    "pluto-theme",
    "theme",
    "code-block",
    "code-editor",
    "use-highlighted-code",
    "code-languages",
    "toggle-group",
  ];
  for (const width of [360, 390]) {
    test(`at ${width}: every sideways scroller on the 7 pages is focusable and named`, async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: 800 });
      const wrong: string[] = [];
      for (const name of PAGES_7) {
        await open(page, `/components/${name}/`);
        const found = await page.evaluate(() => {
          const out: string[] = [];
          for (const el of document.querySelectorAll<HTMLElement>("main *")) {
            const s = getComputedStyle(el);
            if (!["auto", "scroll"].includes(s.overflowX)) continue;
            if (el.scrollWidth <= el.clientWidth + 1) continue;
            const focusable = el.tabIndex >= 0;
            const labelled = el.getAttribute("aria-labelledby");
            const named =
              !!el.getAttribute("aria-label")?.trim() ||
              (!!labelled &&
                !!document.getElementById(labelled)?.textContent?.trim());
            if (!focusable || !named)
              out.push(
                `${el.tagName.toLowerCase()}[data-slot=${el.getAttribute("data-slot")}] ${focusable ? "" : "not focusable"} ${named ? "" : "unnamed"}`,
              );
          }
          return out;
        });
        for (const f of found) wrong.push(`${name}: ${f}`);
      }
      expect(wrong).toEqual([]);
    });
  }
});

/**
 * 015 criterion 23: `build/` served as the worker serves it, with
 * `404-page`: an unknown path answers build/404.html with status 404.
 */
test.describe("015 criterion 23: the 404 page at any depth", () => {
  let server: ReturnType<typeof Bun.serve>;
  let origin = "";
  test.beforeAll(() => {
    const root = path.resolve("build");
    server = Bun.serve({
      port: 0,
      fetch(req) {
        let p = decodeURIComponent(new URL(req.url).pathname);
        if (p.includes("..")) return new Response("", { status: 400 });
        if (p.endsWith("/")) p += "index.html";
        const file = path.join(root, p);
        if (existsSync(file) && statSync(file).isFile())
          return new Response(Bun.file(file));
        return new Response(Bun.file(path.join(root, "404.html")), {
          status: 404,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    });
    origin = `http://localhost:${server.port}`;
  });
  test.afterAll(() => server?.stop(true));

  for (const p of ["/nope/", "/nope/deep/", "/components/nope/", "/a/b/c/"]) {
    test(`${p} answers 404 with the canvas, the four doors and, once hydrated, search`, async ({
      page,
    }, info) => {
      const response = await page.goto(origin + p);
      expect(response?.status()).toBe(404);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        GROUND[info.project.name as ThemeName],
      );
      // The whole frame, at any depth: the bar with its lockup, the footer,
      // and the theme script's choice (the canvas above, in either theme).
      await expect(
        page
          .locator('[data-slot="site-bar"]')
          .getByRole("link", { name: NAME }),
      ).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
      const main = page.locator("main");
      for (const d of DOORS)
        await expect(
          main.getByRole("link", { name: d.name, exact: true }),
        ).toHaveCount(1);
      await expect(main.getByRole("button", { name: "Search" })).toBeVisible();
      await expect(
        page.locator(".field-1, .field-2, .field-3, .field-4"),
      ).toHaveCount(0);
    });
  }

  test("axe finds 0 violations on /components/nope/", async ({ page }) => {
    await page.goto(origin + "/components/nope/");
    await page
      .locator("main")
      .getByRole("button", { name: "Search" })
      .waitFor();
    const results = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test("the page list names every page once", () => {
  expect(new Set(SITEMAP.map((p) => p.path)).size).toBe(SITEMAP.length);
});

test.describe("017: the downloads, the figures and the lockup's width", () => {
  test("criterion 5: each download link answers 200, as image/svg+xml", async ({
    page,
    request,
  }) => {
    await open(page, "/brand/downloads/");
    const links = page.locator('[data-slot="download-link"]');
    await expect(links).toHaveCount(6);
    for (const href of await links.evaluateAll((els) =>
      els.map((e) => e.getAttribute("href")!),
    )) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
      expect(res.headers()["content-type"], href).toContain("image/svg+xml");
    }
  });

  for (const [path, dims] of [
    ["/brand/mark/", ["mark", "lockup"]],
    ["/brand/type/", ["ladder"]],
  ] as const) {
    test(`criterion 9: ${path}'s figures are named images, and their lists equal the token file`, async ({
      page,
    }) => {
      const { readTokens } = await import("../../scripts/tokens.ts");
      const t = readTokens();
      const m = t.mark;
      const want: Record<string, Record<string, string>> = {
        mark: {
          dot: String(m.dot),
          gap: String(m.gap),
          side: String(2 * m.dot + m.gap),
        },
        lockup: {
          lockupScale: String(m.lockupScale),
          lockupGap: String(m.lockupGap),
          rise: String(m.rise),
          top: String((m.rise + 2 * m.dot + m.gap) * m.lockupScale),
        },
        ladder: Object.fromEntries(
          Object.entries(t.expressive.display.steps).map(([id, s]) => [
            id,
            `${s.minPx} ${s.maxPx} ${s.lineHeight}`,
          ]),
        ),
      };
      await open(page, path);
      const figures = page.locator('[data-slot="brand-figure"]');
      await expect(figures).toHaveCount(dims.length);
      for (const f of await figures.all()) {
        await expect(f).toHaveAttribute("role", "img");
        expect((await f.getAttribute("aria-label"))?.length).toBeGreaterThan(
          10,
        );
      }
      for (const d of dims) {
        const got = await page
          .locator(`[data-figure-dims="${d}"] [data-dim]`)
          .evaluateAll((els) =>
            Object.fromEntries(
              els.map((e) => [
                e.getAttribute("data-dim"),
                e.getAttribute("data-value"),
              ]),
            ),
          );
        expect(got).toEqual(want[d]);
      }
    });

    test(`criterion 9: at 390 px, ${path}'s figures render 0 text elements, and the lists carry every dimension`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(page, path);
      const rendered = await page
        .locator('[data-slot="brand-figure"] text')
        .evaluateAll(
          (els) => els.filter((e) => e.getClientRects().length > 0).length,
        );
      expect(rendered).toBe(0);
      for (const d of dims)
        await expect(
          page.locator(`[data-figure-dims="${d}"] [data-dim]`).first(),
        ).toBeVisible();
    });
  }

  test("criterion 7: Chromium's width of the lockup's word at 100 px equals the committed fixture, to 0.1 px", async ({
    page,
  }) => {
    const fixture = JSON.parse(
      readFileSync("tests/fixtures/lockup-word-width.json", "utf8"),
    ) as { px: number; width: number };
    await open(page, "/brand/mark/");
    const width = await page.evaluate((px) => {
      const lockup = document.querySelector<HTMLElement>(
        '[data-slot="lockup"]',
      )!;
      lockup.style.fontSize = `${px}px`;
      const word = [...lockup.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
      )!;
      const range = document.createRange();
      range.selectNodeContents(word);
      return range.getBoundingClientRect().width;
    }, fixture.px);
    expect(
      Math.abs(width - fixture.width),
      "run `bun scripts/site/lockup-width.ts`",
    ).toBeLessThanOrEqual(0.1);
  });
});

test.describe("017: the install guide's copy buttons", () => {
  for (const width of [1440, 390, 360]) {
    test(`at ${width} px, no copy button's box meets its code's text`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/start/install/");
      const hits = await page.evaluate(() => {
        const out: string[] = [];
        const meets = (a: DOMRect, b: DOMRect) =>
          a.left < b.right &&
          b.left < a.right &&
          a.top < b.bottom &&
          b.top < a.bottom;
        const blocks = [
          ...document.querySelectorAll('main [data-slot="code-block"]'),
        ];
        for (const [i, block] of blocks.entries()) {
          const button = block
            .querySelector('[data-slot="code-block-copy-button"]')!
            .getBoundingClientRect();
          for (const line of block.querySelectorAll(
            '[data-slot="code-block-line"]',
          )) {
            const range = document.createRange();
            range.selectNodeContents(line);
            for (const r of range.getClientRects())
              if (r.width > 0 && meets(button, r))
                out.push(`block ${i + 1}: ${line.textContent!.slice(0, 40)}`);
          }
        }
        return { blocks: blocks.length, out };
      });
      expect(hits.blocks).toBe(6);
      expect(hits.out).toEqual([]);
    });
  }
});
