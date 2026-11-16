import { readFileSync } from "node:fs";
/**
 * 015 decision 18, criterion 21: the search palette, in both projects.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../test.ts";
import { DOORS } from "../../src/lib/site/doors.ts";
import { addCommand } from "../../src/lib/site/site.ts";
import { clipboard, readClipboard, open, writeClipboard } from "./pages.ts";

test.describe("015: search", () => {
  test("no request for /search.json before the palette opens; Control-K opens it with focus in the input", async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/search.json")) requests.push(r.url());
    });
    await open(page, "/components/");
    await page.locator('[data-slot="site-search"]').first().waitFor();
    await page.waitForTimeout(300);
    expect(requests).toEqual([]);
    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox", { name: "Search the site" });
    await expect(input).toBeFocused();
    await expect.poll(() => requests.length).toBe(1);
  });

  test("keys typed straight after Control-K reach the input", async ({
    page,
  }) => {
    await open(page, "/components/");
    await page.locator('[data-slot="site-search"]').first().waitFor();
    // Hold every script fetched from here on, so the palette's code is late
    // for certain and the keys land before its input exists.
    await page.route("**/_app/immutable/**/*.js", async (route) => {
      await new Promise((r) => setTimeout(r, 600));
      await route.continue();
    });
    await page.keyboard.press("Control+k");
    await page.keyboard.type("butt");
    const input = page.getByRole("combobox", { name: "Search the site" });
    await expect(input).toHaveValue("butt");
    await expect(page.getByRole("option").first()).toContainText("Button");
  });

  test("Command-K opens it too", async ({ page }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().waitFor();
    await page.keyboard.press("Meta+k");
    await expect(
      page.getByRole("combobox", { name: "Search the site" }),
    ).toBeFocused();
  });

  test("ArrowDown then Enter opens a result; the live region reads the count", async ({
    page,
  }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    const input = page.getByRole("combobox", { name: "Search the site" });
    await input.fill("dial");
    const status = page.getByRole("dialog").getByRole("status");
    await expect(status).toHaveText(/^\d+ results?$/);
    await expect(page.getByRole("option").first()).toContainText("Dialog");
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute(
      "aria-activedescendant",
      "site-search-1",
    );
    await input.press("ArrowUp");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/components\/dialog\/$/);
  });

  test('"zzzz" gives the empty message', async ({ page }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    await page.getByRole("combobox", { name: "Search the site" }).fill("zzzz");
    await expect(page.getByRole("dialog").getByRole("status")).toHaveText(
      'No results for "zzzz". Try a component\'s name, or browse the four sections.',
    );
  });

  test("Escape closes it and returns focus to the button that opened it", async ({
    page,
  }) => {
    await open(page, "/components/button/");
    const button = page.locator(
      '[data-slot="site-bar"] [data-slot="site-search"]',
    );
    await button.click();
    await expect(
      page.getByRole("combobox", { name: "Search the site" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(button).toBeFocused();
  });

  test("axe finds 0 violations with it open", async ({ page }) => {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    await page.getByRole("combobox", { name: "Search the site" }).fill("but");
    await expect(page.getByRole("option").first()).toBeVisible();
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((a) => a.finished.catch(() => null)),
      ),
    );
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
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  });
});

test.describe("018 decision 8, criterion 11: search that finds what was meant", () => {
  async function palette(page: import("@playwright/test").Page, q: string) {
    await open(page, "/");
    await page.locator('[data-slot="site-search"]').first().click();
    const input = page.getByRole("combobox", { name: "Search the site" });
    await input.fill(q);
    await expect(page.getByRole("option").first()).toBeVisible();
    return input;
  }

  test("results sit under door groups, in the order of their best match, then the doors'; the arrows cross the groups", async ({
    page,
  }) => {
    const input = await palette(page, "a");
    const listbox = page.getByRole("listbox", { name: "Results" });
    const groups = listbox.getByRole("group");
    const names = await groups.evaluateAll((gs) =>
      gs.map(
        (g) =>
          document
            .getElementById(g.getAttribute("aria-labelledby") ?? "")
            ?.textContent?.trim() ?? "",
      ),
    );
    const { groupHits, search } = await import("../../src/lib/site/search.ts");
    const index = JSON.parse(readFileSync("build/search.json", "utf8"));
    expect(names.length).toBeGreaterThanOrEqual(3);
    expect(names).toEqual(groupHits(search(index, "a")).map((g) => g.name));
    for (const n of names)
      await expect(listbox.getByRole("group", { name: n })).toHaveCount(1);
    // A door's group shows its dot; Site has none.
    for (const d of DOORS.filter((d) => names.includes(d.name)))
      await expect(
        listbox
          .getByRole("group", { name: d.name })
          .locator(`.site-dot[data-door="${d.n}"]`),
      ).toHaveCount(1);
    // Every option sits in a group.
    expect(await listbox.getByRole("option").count()).toBe(
      await groups.getByRole("option").count(),
    );
    // ArrowDown past the first group's last option lands on the second's first.
    const first = await groups.nth(0).getByRole("option").count();
    for (let i = 0; i < first; i++) await input.press("ArrowDown");
    const id = await input.getAttribute("aria-activedescendant");
    await expect(groups.nth(1).getByRole("option").first()).toHaveAttribute(
      "id",
      id!,
    );
    await expect(page.locator(`#${id}`)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("every match is in a <mark> of weight 600, in the title, the alias line and the summary", async ({
    page,
  }) => {
    for (const q of ["dia", "modal"]) {
      await palette(page, q);
      const parts = page.locator(
        '[role="option"] :is([data-slot="search-title"], [data-slot="search-alias"], [data-slot="search-summary"])',
      );
      const found = await parts.evaluateAll((els, q) => {
        const starts = (t: string) =>
          [...t.toLowerCase().matchAll(new RegExp(q, "g"))].filter(
            (m) => m.index === 0 || !/[\p{L}\p{N}]/u.test(t[m.index! - 1]!),
          ).length;
        return els.map((el) => ({
          slot: el.getAttribute("data-slot"),
          starts: starts(el.textContent ?? ""),
          marks: [...el.querySelectorAll("mark")].map((m) => ({
            text: m.textContent?.toLowerCase(),
            weight: getComputedStyle(m).fontWeight,
          })),
        }));
      }, q);
      expect(found.some((f) => f.marks.length)).toBe(true);
      for (const f of found) {
        expect(f.marks).toHaveLength(f.starts);
        for (const m of f.marks) expect(m).toEqual({ text: q, weight: "600" });
      }
      if (q === "modal") {
        const dialog = page.getByRole("option").first();
        await expect(dialog.locator('[data-slot="search-title"]')).toHaveText(
          "Dialog",
        );
        await expect(dialog.locator('[data-slot="search-alias"]')).toHaveText(
          "Also called modal",
        );
        await expect(page.locator('[data-slot="search-alias"]')).toHaveCount(1);
      }
    }
  });

  test("the input's description is the legend: 3 spoken keys, or 4 on a component result", async ({
    page,
  }) => {
    const input = await palette(page, "change");
    await expect(input).toHaveAttribute("aria-describedby", "site-search-keys");
    const keys = page.locator('#site-search-keys [data-slot="search-key"]');
    // The first result of "change" is not a component: it sits in no
    // Components group.
    await expect(
      page
        .getByRole("group", { name: "Components" })
        .getByRole("option", { selected: true }),
    ).toHaveCount(0);
    await expect(page.getByRole("option", { selected: true })).toHaveCount(1);
    await expect(keys).toHaveCount(3);
    await expect(input).toHaveAccessibleDescription(
      /^Up and down arrows: move\s*Enter: open\s*Escape: close$/,
    );
    await input.fill("butt");
    await expect(
      page
        .getByRole("option", { selected: true })
        .locator('[data-slot="search-title"]'),
    ).toHaveText("Button");
    await expect(keys).toHaveCount(4);
    const mac = await page.evaluate(() =>
      /Mac|iPhone|iPad/.test(navigator.platform),
    );
    await expect(input).toHaveAccessibleDescription(
      new RegExp(
        `^Up and down arrows: move\\s*Enter: open\\s*Escape: close\\s*${mac ? "Command" : "Control"} C: copy the add command$`,
      ),
    );
    // Each key's glyphs are kbd items, hidden from the reader; the name is said.
    for (const k of await keys.all())
      await expect(k.locator('[aria-hidden="true"] kbd').first()).toBeVisible();
  });

  test.describe("with the clipboard granted", () => {
    test.use({ permissions: clipboard });

    test("with Button active and nothing selected, Command-C (Control-C) copies its add command and says so", async ({
      page,
    }) => {
      const input = await palette(page, "butt");
      await writeClipboard(page, "");
      await expect(
        page
          .getByRole("option", { selected: true })
          .locator('[data-slot="search-title"]'),
      ).toHaveText("Button");
      await input.press("ControlOrMeta+c");
      await expect(page.getByRole("dialog").getByRole("status")).toHaveText(
        "Copied the command for Button",
      );
      expect(await readClipboard(page)).toBe(addCommand("button"));
      await expect(input).toHaveValue("butt");
    });

    test("with text selected, it copies the text", async ({ page }) => {
      const input = await palette(page, "butt");
      await writeClipboard(page, "");
      await input.selectText();
      await input.press("ControlOrMeta+c");
      await expect.poll(() => readClipboard(page)).toBe("butt");
      await expect(page.getByRole("dialog").getByRole("status")).toHaveText(
        /^\d+ results?$/,
      );
    });
  });

  test("axe finds 0 violations with grouped, marked results showing", async ({
    page,
  }) => {
    for (const q of ["a", "modal"]) {
      await palette(page, q);
      await page.evaluate(() =>
        Promise.all(
          document.getAnimations().map((a) => a.finished.catch(() => null)),
        ),
      );
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
      expect(
        results.violations.map(
          (v) =>
            `${q}: ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
        ),
      ).toEqual([]);
    }
  });
});

// 018 change review, finding 1: Enter opens the best match.
test.describe("018 review: Enter opens the best match", () => {
  for (const [q, want] of [
    ["colour", /\/(brand|foundations)\/colour\/$/],
    ["type", /\/(brand|foundations)\/type\/$/],
    ["motion", /\/(brand|foundations)\/motion\/$/],
    ["token", /\/foundations\/tokens\/$/],
    ["theme", /\/(components\/(kuiper-)?theme|start\/theme)\/$/],
  ] as const)
    test(`"${q}": Enter opens a best match`, async ({ page }) => {
      await open(page, "/components/");
      await page.keyboard.press("Control+k");
      const input = page.getByRole("combobox", { name: "Search the site" });
      await input.fill(q);
      await expect(page.getByRole("option").first()).toBeVisible();
      await input.press("Enter");
      await expect(page).toHaveURL(want);
    });
});
