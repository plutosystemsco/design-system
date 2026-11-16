/**
 * 020 test 17, decision 12: the "Upgrade to 0.13.0" guide. And test 2's half
 * that reads the prerendered page: every rename row is on it, in code.
 */
import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { RENAMES } from "../../src/lib/site/upgrade/renames.ts";
import { PAGES, SITEMAP } from "./pages.ts";

const GUIDE = "/changelog/0.13.0/upgrade/";

test.describe("020 test 17: the guide", () => {
  test('it is titled "Upgrade to 0.13.0", in five parts, in decision 12\'s order', async ({
    page,
  }) => {
    await page.goto(GUIDE);
    await expect(page.locator("h1")).toHaveText("Upgrade to 0.13.0");
    await expect(page).toHaveTitle(/^Upgrade to 0\.13\.0 \| /);
    // The page's own parts: its sections' headings, not the rail's.
    const parts = await page
      .locator("main section[aria-labelledby] > h2")
      .allTextContents();
    expect(parts.map((t) => t.trim())).toEqual([
      "Who this is for",
      "Before you start",
      "020: Pluto is now Kuiper in code",
      "What keeps working until 0.14.0",
      "What did not change",
    ]);
  });

  test("it names the five exported constants whose values change", async ({
    page,
  }) => {
    await page.goto(GUIDE);
    const code = await page.locator("main code").allTextContents();
    for (const c of [
      "THEME_KEY",
      "THEME_SCRIPT",
      "FIELD_CONTEXT_KEY",
      "FIELD_SET_CONTEXT_KEY",
      "shikiTheme.name",
    ])
      expect(code, c).toContain(c);
  });

  test("step 1, renaming the four keyframe uses, comes before the first add; the two greps name what they find", async ({
    page,
  }) => {
    await page.goto(GUIDE);
    const steps = page.locator('[data-section="020"] [data-step]');
    const texts = (await steps.allTextContents()).map((t) =>
      t.replace(/\s+/g, " "),
    );
    expect(texts.length).toBeGreaterThanOrEqual(6);
    const first = texts[0]!;
    for (const name of [
      "pluto-enter",
      "pluto-exit",
      "pluto-mark-dock",
      "pluto-mark-fade",
    ])
      expect(first, name).toContain(name);
    const firstAdd = texts.findIndex((t) => / add /.test(t));
    expect(firstAdd).toBeGreaterThan(0);
    const grep1 = await steps.nth(0).locator("[data-command]").textContent();
    for (const name of ["pluto-enter", "pluto-exit", "pluto-mark-"])
      expect(grep1, name).toContain(name);
    const grep3 = await steps.nth(2).locator("[data-command]").textContent();
    for (const name of ["pluto-theme", "pluto:", "pluto-code"])
      expect(grep3, name).toContain(name);
  });

  // 020 review, finding 1: in the whole page, in document order, no command
  // that adds comes before step 1, the rename of the keyframe uses. The
  // Markdown twin holds the same order.
  test("over the whole page and its twin, no add command comes before step 1", async ({
    page,
  }) => {
    await page.goto(GUIDE);
    const order = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const step1 = main.querySelector('[data-section="020"] [data-step="1"]');
      const adds = [...main.querySelectorAll("code, pre")].filter((el) =>
        /(^|\s)add\s/.test(el.textContent ?? ""),
      );
      return {
        step1: Boolean(step1),
        adds: adds.length,
        before: adds
          .filter(
            (el) =>
              step1 &&
              step1.compareDocumentPosition(el) &
                Node.DOCUMENT_POSITION_PRECEDING,
          )
          .map((el) => (el.textContent ?? "").trim().slice(0, 80)),
      };
    });
    expect(order.step1).toBe(true);
    expect(order.adds).toBeGreaterThan(0);
    expect(order.before).toEqual([]);

    const twin = readFileSync(path.join("build", GUIDE, "index.md"), "utf8");
    const rename = twin.indexOf("rename your own uses of the four keyframes");
    const firstAdd = twin.search(/(^|[\s`])add [a-z]/m);
    expect(rename).toBeGreaterThan(-1);
    expect(firstAdd).toBeGreaterThan(rename);
  });

  test("it opens with and without the trailing slash", async ({ request }) => {
    expect((await request.get(GUIDE)).status()).toBe(200);
    expect((await request.get(GUIDE.slice(0, -1))).status()).toBe(200);
  });

  test("it is in SITEMAP under the changelog, so every page suite covers it", () => {
    const entry = SITEMAP.find((p) => p.path === GUIDE);
    expect(entry?.title).toBe("Upgrade to 0.13.0");
    expect(entry?.parent).toBe("/changelog/");
    expect(PAGES).toContain(GUIDE);
  });

  test("the changelog's 0.13.0 entry and /start/install/ link to it", async ({
    page,
  }) => {
    await page.goto("/changelog/");
    await expect(
      page.locator(`section:has(#v0-13-0) a[href="${GUIDE}"]`),
    ).not.toHaveCount(0);
    await page.goto("/start/install/");
    await expect(page.locator(`main a[href="${GUIDE}"]`)).not.toHaveCount(0);
  });

  // The twin is written into build/ after vite build; the preview serves
  // pages only, so it is read on disk, as build-output.spec.ts reads twins.
  test("its Markdown twin exists", () => {
    const twin = path.join("build", GUIDE, "index.md");
    expect(existsSync(twin)).toBe(true);
    expect(readFileSync(twin, "utf8")).toContain("# Upgrade to 0.13.0");
  });
});

// 020 test 5's half that reads a page: the components index lists the 78
// items, the Kuiper theme among them, and no alias.
test("the components index links to /components/kuiper-theme/ and to no pluto-theme page", async ({
  page,
}) => {
  await page.goto("/components/");
  await expect(
    page.locator('main a[href="/components/kuiper-theme/"]'),
  ).not.toHaveCount(0);
  await expect(page.locator('main a[href*="pluto-theme"]')).toHaveCount(0);
});

test.describe("020 test 2: every rename row is on the guide, in code", () => {
  test("each row's old and new names are in a code element", async ({
    page,
  }) => {
    await page.goto(GUIDE);
    const code = new Set(
      (
        await page.locator('[data-section="020"] table code').allTextContents()
      ).map((t) => t.trim()),
    );
    for (const r of RENAMES) {
      expect(code.has(r.old), r.old).toBe(true);
      expect(code.has(r.new), r.new).toBe(true);
    }
  });
});
