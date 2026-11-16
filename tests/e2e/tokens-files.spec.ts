/**
 * 021 tests T16 and T17: the site shows the published token files, each
 * link serves its file, and an app with no Tailwind takes the colours from
 * `kuiper.css` alone, in Chromium, Firefox and WebKit.
 */
import { expect, test } from "../test.ts";
import { onlyProjects } from "./engines.ts";
import { readFileSync } from "node:fs";
import { SITE_REGISTRY } from "../../src/lib/site/site.ts";
import { open } from "./pages.ts";

const FILES = [
  "kuiper.css",
  "kuiper.resolver.json",
  "kuiper.flat-light.tokens.json",
  "kuiper.flat-dark.tokens.json",
];

test.describe("021 T16: the site shows the files", () => {
  test("Use the tokens anywhere links each file at this release, and each serves", async ({
    page,
    request,
  }) => {
    await open(page, "/foundations/tokens/");
    const section = page.locator("section", {
      has: page.getByRole("heading", { name: "Use the tokens anywhere" }),
    });
    await expect(section).toHaveCount(1);
    for (const file of FILES) {
      const link = section.locator(`a[href$="/tokens/${file}"]`).first();
      await expect(link, file).toBeVisible();
      const href = (await link.getAttribute("href"))!;
      expect(href.startsWith(`${SITE_REGISTRY}/tokens/`), href).toBe(true);
      // Nothing is deployed while the release is built: fetch the path
      // from the test server, never the absolute address.
      const { pathname } = new URL(href);
      expect(pathname).toMatch(/^\/v\d+\.\d+\.\d+\/r\/tokens\//);
      const response = await request.get(pathname);
      expect(response.status(), pathname).toBe(200);
      expect(response.headers()["content-type"], pathname).toMatch(
        file.endsWith(".css") ? /^text\/css/ : /^application\/json/,
      );
    }
  });

  test("each role row's job is its $description", async ({ page }) => {
    await open(page, "/foundations/tokens/");
    const light = JSON.parse(
      readFileSync("tokens/kuiper.light.tokens.json", "utf8"),
    ) as { role: Record<string, { $description?: string }> };
    const roles = Object.entries(light.role).filter(
      ([name]) => !name.startsWith("$"),
    );
    expect(roles).toHaveLength(61);
    const jobs = await page
      .locator("tr[data-token-row]")
      .evaluateAll((rows) =>
        Object.fromEntries(
          rows.map((r) => [
            r.getAttribute("data-token-row"),
            r.querySelector("td:last-child")?.textContent?.trim(),
          ]),
        ),
      );
    for (const [name, role] of roles)
      expect(jobs[name], name).toBe(role.$description);
  });
});

/** A blank page that loads only kuiper.css, from the test server. */
const BLANK = (base: string) => `<!doctype html>
<html>
  <head><link rel="stylesheet" href="${base}/r/tokens/kuiper.css"></head>
  <body>
    <div id="light-box" style="box-shadow: var(--shadow-elevation)">light</div>
    <div class="dark" id="dark">
      <div id="nested" style="box-shadow: var(--shadow-elevation)">nested</div>
    </div>
  </body>
</html>`;

test.describe("021 T17: an app without Tailwind gets the colours", () => {
  // 022's merge: the engine projects run it, so it uses the project's
  // browser rather than launching its own. The page sets its scheme itself
  // (its contexts ask for light), so each engine's light project covers it.
  onlyProjects(
    ["chromium-light", "firefox-light", "webkit-light"],
    "the page sets its own scheme, so each engine's light project covers it",
  );
  test("--background, the nested dark hairline, and reduced motion", async ({
    baseURL,
    browser,
  }) => {
    {
      const context = await browser.newContext({
        reducedMotion: "reduce",
        colorScheme: "light",
      });
      const page = await context.newPage();
      const still = await browser.newContext({ colorScheme: "light" });
      const moving = await still.newPage();
      for (const p of [page, moving]) {
        await p.setContent(BLANK(baseURL!), { waitUntil: "load" });
        await p.waitForFunction(
          () =>
            getComputedStyle(document.documentElement)
              .getPropertyValue("--background")
              .trim() !== "",
        );
      }
      const read = (selector: string, property: string) =>
        moving.evaluate(
          ([s, p]) =>
            getComputedStyle(document.querySelector(s)!)
              .getPropertyValue(p)
              .trim(),
          [selector, property],
        );
      expect(await read("html", "--background")).toBe("#f3f0e8");
      expect(await read("#dark", "--background")).toBe("#16140f");
      expect(await read("html", "color-scheme")).toBe("light");
      expect(await read("#dark", "color-scheme")).toBe("dark");
      // 021 decision 11: --shadow-elevation is repeated in .dark, so a dark
      // subtree in a light page draws the dark hairline.
      const shadow = (selector: string) => read(selector, "box-shadow");
      expect(await shadow("#nested")).toContain("rgb(122, 115, 102)");
      expect(await shadow("#nested")).not.toContain("rgb(133, 126, 112)");
      expect(await shadow("#light-box")).toContain("rgb(133, 126, 112)");
      expect(await read("html", "--motion-micro")).toBe("200ms");
      expect(
        await page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--motion-micro")
            .trim(),
        ),
      ).toBe("0ms");
      await still.close();
      await context.close();
    }
  });
});
