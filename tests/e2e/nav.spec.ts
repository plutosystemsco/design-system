/**
 * 018 decisions 1, 2 and 6: the left nav, the phone sheet, the page tools,
 * previous and next, and the Brand bands beside the nav (criteria 3, 4, 5,
 * 10 and 22).
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DOORS } from "../../src/lib/site/doors.ts";
import { navOrder, type SitePage } from "../../src/lib/site/sitemap.ts";
import { cssVar, hexToRgb, open, SITEMAP } from "./pages.ts";

const NOT_HOME = SITEMAP.filter((p) => p.path !== "/");
const label = (p: SitePage) =>
  p.door ? `${DOORS.find((d) => d.id === p.door)!.name} pages` : "Site pages";

test.describe("018 criterion 3: the left nav, from lg", () => {
  for (const width of [1024, 1440]) {
    test(`at ${width}: on every page but home, one nav of navOrder's links, after the bar and before main, the current link marked`, async ({
      page,
    }) => {
      test.setTimeout(600_000);
      await page.setViewportSize({ width, height: 900 });
      const wrong: string[] = [];
      for (const p of NOT_HOME) {
        await open(page, p.path);
        const nav = page.getByRole("navigation", {
          name: label(p),
          exact: true,
        });
        const got = await nav.evaluate((n) => {
          const links = [...n.querySelectorAll("a")].map((a) =>
            a.getAttribute("href"),
          );
          const main = document.querySelector("main")!;
          const bar = document.querySelector('[data-slot="site-bar"]')!;
          const current = [...n.querySelectorAll('a[aria-current="page"]')];
          const cs = current[0] && getComputedStyle(current[0]);
          return {
            links,
            afterBar: !!(
              bar.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING
            ),
            beforeMain: !!(
              n.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING
            ),
            current: current.map((a) => a.getAttribute("href")),
            weight: cs?.fontWeight,
            border: cs?.borderInlineStartWidth,
            colour: cs?.borderInlineStartColor,
            visible: n.getBoundingClientRect().width > 0,
          };
        });
        const fg = hexToRgb(await cssVar(page, "--foreground"));
        const want = navOrder(p.door).map((q) => q.path);
        const ok =
          JSON.stringify(got.links) === JSON.stringify(want) &&
          got.afterBar &&
          got.beforeMain &&
          got.current.length === 1 &&
          got.current[0] === p.path &&
          got.weight === "600" &&
          got.border === "2px" &&
          got.colour === fg &&
          got.visible;
        if (!ok)
          wrong.push(
            `${p.path}: ${JSON.stringify({ ...got, links: got.links.length })}`,
          );
      }
      expect(wrong).toEqual([]);
    });
  }

  test("its own scroll, not the window's: on /components/settings/ at 1024 × 700, scrollY is 0 and the current link is inside the nav", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await open(page, "/components/settings/");
    expect(await page.evaluate(() => scrollY)).toBe(0);
    const nav = page.getByRole("navigation", { name: "Components pages" });
    const inside = await nav.evaluate((n) => {
      const a = n
        .querySelector('a[aria-current="page"]')!
        .getBoundingClientRect();
      const b = n.getBoundingClientRect();
      return a.top >= b.top && a.bottom <= b.bottom;
    });
    expect(inside).toBe(true);
  });

  test('on Button, "dia" in the nav filter leaves Dialog and Alert dialog, hides empty groups, and says "2 components"', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/components/button/");
    const nav = page.getByRole("navigation", { name: "Components pages" });
    await nav.getByLabel("Filter components").fill("dia");
    const shown = await nav.locator("a:visible").allTextContents();
    expect(shown.map((t) => t.trim()).sort()).toEqual([
      "Alert dialog",
      "Components",
      "Dialog",
    ]);
    await expect(nav.locator('[data-slot="nav-group"]:visible')).toHaveCount(2);
    await expect(nav.getByRole("status")).toHaveText("2 components");
  });

  test("on /components/ the nav has no filter, and the page has exactly one", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/components/");
    const nav = page.getByRole("navigation", { name: "Components pages" });
    await expect(nav.getByLabel("Filter components")).toHaveCount(0);
    await expect(page.getByLabel("Filter components")).toHaveCount(1);
  });

  test("below 1024 the nav is not visible", async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 900 });
    await open(page, "/components/button/");
    await expect(
      page.getByRole("navigation", { name: "Components pages" }),
    ).toBeHidden();
  });

  test("axe's landmark-unique passes on a page of each kind", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const p of [
      "/components/button/",
      "/start/install/",
      "/brand/colour/",
      "/changelog/",
      "/foundations/",
    ]) {
      await open(page, p);
      const r = await new AxeBuilder({ page })
        .withRules(["landmark-unique"])
        .analyze();
      expect(r.violations.map((v) => `${p}: ${v.id}`)).toEqual([]);
    }
  });
});

test.describe("018 criterion 4: the rail", () => {
  for (const width of [1280, 1440])
    test(`at ${width}: the rail holds "On this page" only`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/components/button/");
      const rail = page.getByRole("complementary", { name: "On this page" });
      await expect(rail).toBeVisible();
      await expect(rail.locator("h2")).toHaveText(["On this page"]);
    });

  test("at 1024 there is no rail, and the disclosure shows", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await open(page, "/components/button/");
    await expect(
      page.getByRole("complementary", { name: "On this page" }),
    ).toBeHidden();
    await expect(
      page.locator("main details summary", { hasText: "On this page" }),
    ).toBeVisible();
  });
});

test.describe("018 criterion 5: the phone sheet", () => {
  test("at 390, on Button: All pages, door disclosures, Components and Actions open, Button current; Tooltip closes it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, "/components/button/");
    await page.getByRole("button", { name: "Menu" }).click();
    const nav = page.getByRole("navigation", { name: "All pages" });
    await expect(nav).toBeVisible();
    const doors = nav.locator('[data-slot="door-disclosure"]');
    await expect(doors).toHaveCount(4);
    for (const d of await doors.all()) {
      expect(await d.evaluate((e) => e.tagName)).toBe("BUTTON");
      await expect(d).toHaveAttribute("aria-expanded", /true|false/);
    }
    await expect(nav.getByRole("link", { name: "Changelog" })).toBeVisible();
    const components = nav.getByRole("button", { name: "Components" });
    await expect(components).toHaveAttribute("aria-expanded", "true");
    const list = page.locator(
      `#${await components.getAttribute("aria-controls")}`,
    );
    await expect(list.locator("a").first()).toHaveAttribute(
      "href",
      "/components/",
    );
    await expect(nav.locator('[data-slot="group-disclosure"]')).toHaveCount(11);
    await expect(nav.getByRole("button", { name: "Actions" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute(
      "href",
      "/components/button/",
    );
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
    await nav.getByRole("link", { name: "Tooltip" }).click();
    await expect(page).toHaveURL(/\/components\/tooltip\/$/);
    await expect(nav).toBeHidden();
  });

  test("at 768, on Button: the 4 door links in the bar; the menu button is Components pages, opening that nav alone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await open(page, "/components/button/");
    const bar = page.getByRole("navigation", { name: "Site", exact: true });
    for (const d of DOORS)
      await expect(
        bar.getByRole("link", { name: d.name, exact: true }),
      ).toBeVisible();
    await page.getByRole("button", { name: "Components pages" }).click();
    const nav = page
      .getByRole("dialog")
      .getByRole("navigation", { name: "Components pages" });
    await expect(nav).toBeVisible();
    await expect(nav.locator("a")).toHaveCount(79);
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
  });

  test("at 768, on the home page: no menu button", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await open(page, "/");
    await expect(
      page.getByRole("button", { name: /pages$|^Menu$/ }),
    ).toHaveCount(0);
  });
});

test.describe("018 criterion 10: page tools, previous and next", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  // The twins are written into build/ after vite's build, which the
  // preview server does not serve: each request is answered from build/.
  const BUILD = path.resolve("build");
  async function serveTwins(page: Page, delay = 0) {
    await page.route("**/*index.md", async (route) => {
      if (delay) await new Promise((r) => setTimeout(r, delay));
      await route.fulfill({
        path: path.join(BUILD, new URL(route.request().url()).pathname),
        contentType: "text/markdown; charset=utf-8",
      });
    });
  }
  async function twin(_page: Page, p: string): Promise<string> {
    return readFileSync(path.join(BUILD, p, "index.md"), "utf8");
  }

  test("on Button, Copy page puts the twin's text on the clipboard and says Copied", async ({
    page,
  }) => {
    await serveTwins(page);
    await open(page, "/components/button/");
    const button = page.getByRole("button", { name: "Copy page" });
    await button.click();
    await expect(
      page.locator('[data-slot="page-tools"] [role="status"]'),
    ).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      await twin(page, "/components/button/"),
    );
  });

  // 018 change review, finding 3: the write is a ClipboardItem handed over
  // inside the click, before the twin arrives; writeText would be the
  // fallback, so here it throws, and the test fails if that path ran.
  test("with the twin's request delayed by 1 s, it copies through one ClipboardItem written inside the click", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const w = window as unknown as {
        writes: { items: number; at: number }[];
        texts: number;
      };
      w.writes = [];
      w.texts = 0;
      const clip = navigator.clipboard;
      const write = clip.write.bind(clip);
      clip.write = (items: ClipboardItem[]) => {
        w.writes.push({ items: items.length, at: performance.now() });
        return write(items);
      };
      clip.writeText = () => {
        w.texts++;
        return Promise.reject(new Error("the fallback ran"));
      };
    });
    await serveTwins(page, 1000);
    await open(page, "/components/button/");
    const clicked = await page.evaluate(() => performance.now());
    await page.getByRole("button", { name: "Copy page" }).click();
    await expect(
      page.locator('[data-slot="page-tools"] [role="status"]'),
    ).toHaveText("Copied", {
      timeout: 5000,
    });
    const spied = await page.evaluate(() => {
      const w = window as unknown as {
        writes: { items: number; at: number }[];
        texts: number;
      };
      return { writes: w.writes, texts: w.texts };
    });
    expect(spied.texts).toBe(0);
    expect(spied.writes).toHaveLength(1);
    expect(spied.writes[0].items).toBe(1);
    // Called before the delayed twin could have arrived.
    expect(spied.writes[0].at - clicked).toBeLessThan(900);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      await twin(page, "/components/button/"),
    );
  });

  test("View as Markdown resolves to the twin", async ({ page }) => {
    await open(page, "/components/button/");
    const href = await page
      .getByRole("link", { name: "View as Markdown" })
      .getAttribute("href");
    expect(href).toBe("/components/button/index.md");
    expect(existsSync(path.join(BUILD, href!))).toBe(true);
  });

  test("on every leaf, component and Brand page, previous and next follow navOrder", async ({
    page,
  }) => {
    test.setTimeout(600_000);
    const wrong: string[] = [];
    const landings = new Set(DOORS.map((d) => d.path));
    for (const p of SITEMAP.filter((q) => q.door && !landings.has(q.path))) {
      await open(page, p.path);
      const order = navOrder(p.door);
      const at = order.findIndex((q) => q.path === p.path);
      const nav = page.getByRole("navigation", {
        name: "Pages before and after",
      });
      const links = await nav
        .locator("a")
        .evaluateAll((as) =>
          as.map((a) => [
            a.textContent!.replace(/\s+/g, " ").trim(),
            a.getAttribute("href"),
          ]),
        );
      const want = [
        [`Previous: ${order[at - 1].title}`, order[at - 1].path],
        ...(order[at + 1]
          ? [[`Next: ${order[at + 1].title}`, order[at + 1].path]]
          : []),
      ];
      if (JSON.stringify(links) !== JSON.stringify(want))
        wrong.push(`${p.path}: ${JSON.stringify(links)}`);
    }
    expect(wrong).toEqual([]);
  });
});

test.describe("018 criterion 22: the Brand bands beside the nav", () => {
  for (const width of [1024, 1280, 1440])
    test(`at ${width}: each band starts at or after the nav's end, ends at the viewport's, and none paints under the nav`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/brand/colour/");
      const nav = await page
        .getByRole("navigation", { name: "Brand pages" })
        .boundingBox();
      const vw = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      const bands = await page
        .locator('[data-slot="colour-band"]')
        .evaluateAll((bs) =>
          bs.map((b) => {
            const r = b.getBoundingClientRect();
            return [r.left, r.right];
          }),
        );
      expect(bands).toHaveLength(4);
      for (const [l, r] of bands) {
        expect(l).toBeGreaterThanOrEqual(nav!.x + nav!.width - 0.5);
        expect(Math.abs(r - vw)).toBeLessThanOrEqual(0.5);
      }
    });

  for (const width of [390, 768])
    test(`at ${width}: each band spans the viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page, "/brand/colour/");
      const vw = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      const bands = await page
        .locator('[data-slot="colour-band"]')
        .evaluateAll((bs) =>
          bs.map((b) => [
            b.getBoundingClientRect().left,
            b.getBoundingClientRect().right,
          ]),
        );
      for (const [l, r] of bands) {
        expect(l).toBe(0);
        expect(Math.abs(r - vw)).toBeLessThanOrEqual(0.5);
      }
    });
});
