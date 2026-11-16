/**
 * 020 test 17, decision 12: the "Upgrade to 0.13.0" guide. And test 2's half
 * that reads the prerendered page: every rename row is on it, in code.
 */
import { expect, test } from "../test.ts";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { inlines } from "../../src/lib/site/changelog.ts";
import { RENAMES } from "../../src/lib/site/upgrade/renames.ts";
import { PAGES, SITEMAP } from "./pages.ts";

const GUIDE = "/changelog/0.13.0/upgrade/";

test.describe("020 test 17: the guide", () => {
  // 026 decision 26 adds its section after 020's: six parts.
  test('it is titled "Upgrade to 0.13.0", in six parts, in decision 12\'s order', async ({
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
      "026: a toast of Kuiper's own",
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

// 020 test 5's half that reads a page: the components index lists the 82
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
    // 020b: the list the reader sees, not the table only the twin keeps.
    const code = new Set(
      (
        await page.locator('[data-section="020"] dl dt code').allTextContents()
      ).map((t) => t.trim()),
    );
    for (const r of RENAMES) {
      expect(code.has(r.old), r.old).toBe(true);
      expect(code.has(r.new), r.new).toBe(true);
    }
  });
});

// 020b: the renames are read in the text column, not scrolled to. A code
// block keeps its own focusable, named scroller (015 criterion 26), so what
// is inside one is not counted.
test.describe("020b: the guide fits its column", () => {
  const plain = (s: string) =>
    inlines(s)
      .map((x) => x.text)
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  for (const width of [1440, 390, 320]) {
    test(`at ${width}, nothing in the column scrolls sideways, and every rename reads in it`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(GUIDE);
      // 020c: measured in the page's own fonts, as the reader sees it, not
      // in the fallback the first paint may use.
      await page.evaluate(() => document.fonts.ready);
      const found = await page.evaluate(
        ({ renames }) => {
          const column = document.querySelector("main h1")!.parentElement!;
          const box = column.getBoundingClientRect();
          const root = document.documentElement;
          const name = (el: Element) =>
            el.tagName.toLowerCase() +
            (el.getAttribute("data-slot")
              ? `[data-slot=${el.getAttribute("data-slot")}]`
              : "") +
            ` "${(el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 32)}…"`;
          // An element that clips or scrolls holds no more than its width;
          // anything else stays inside the column. (A span may overhang its
          // paragraph's measure and still be read whole: 020b's notes.)
          const clips = (el: Element) =>
            getComputedStyle(el).overflowX !== "visible";
          const wide: string[] = [];
          for (const el of column.querySelectorAll<HTMLElement>("*")) {
            if (el.closest('[data-slot="code-block"]')) continue;
            if (!el.getClientRects().length) continue;
            if (clips(el) && el.scrollWidth > el.clientWidth + 1)
              wide.push(`${name(el)}: ${el.scrollWidth} > ${el.clientWidth}`);
            let up = el.parentElement;
            while (up && up !== column && !clips(up)) up = up.parentElement;
            if (up !== column) continue;
            // 020c: each line's fragment, so the message names the piece
            // past the column, not a wrapped element's whole outer box.
            for (const r of el.getClientRects())
              if (r.left < box.left - 1 || r.right > box.right + 1) {
                wide.push(
                  `${name(el)}: ${Math.round(r.width)} wide, past the column`,
                );
                break;
              }
          }
          const sideways =
            root.scrollWidth > root.clientWidth
              ? `${root.scrollWidth} > ${root.clientWidth}`
              : null;
          const section = document.querySelector('[data-section="020"]')!;
          const norm = (s: string | null) => (s ?? "").replace(/\s+/g, " ");
          // Seen, and whole inside the column.
          const reads = (el: Element) => {
            const r = el.getBoundingClientRect();
            return (
              el.checkVisibility() &&
              r.width > 0 &&
              r.left >= box.left - 1 &&
              r.right <= box.right + 1
            );
          };
          // The deepest elements whose text holds the needle.
          const holders = (needle: string) =>
            [...section.querySelectorAll("*")].filter(
              (el) =>
                norm(el.textContent).includes(needle) &&
                ![...el.children].some((c) =>
                  norm(c.textContent).includes(needle),
                ),
            );
          const unread: string[] = [];
          for (const r of renames) {
            for (const n of [r.old, r.new])
              if (
                ![...section.querySelectorAll("code")].some(
                  (c) => c.textContent?.trim() === n && reads(c),
                )
              )
                unread.push(`${r.kind} ${r.old}: the name ${n}`);
            for (const [part, needle] of [
              ["who sees it", r.seenBy],
              ["what to do", r.todo],
            ] as const)
              if (!holders(needle).some(reads))
                unread.push(`${r.kind} ${r.old}: ${part}`);
          }
          return { column: Math.round(box.width), wide, sideways, unread };
        },
        {
          renames: RENAMES.map((r) => ({
            kind: r.kind,
            old: r.old,
            new: r.new,
            seenBy: plain(r.seenBy),
            todo: plain(r.todo),
          })),
        },
      );
      expect.soft(found.wide, `in the ${found.column} px column`).toEqual([]);
      expect.soft(found.sideways, "the page scrolls sideways").toBeNull();
      expect(found.unread).toEqual([]);
    });
  }

  // 020c review, finding 5: an inline-block chip's border would count toward
  // its line's height; its negative block margin keeps every paragraph that
  // holds code at whole lines of its own line height.
  test("a paragraph that holds code keeps its line height", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(GUIDE);
    await page.evaluate(() => document.fonts.ready);
    const off = await page.evaluate(() =>
      [...document.querySelectorAll("main p")]
        .filter((p) => p.querySelector("code") && !p.closest("table"))
        .map((p) => {
          const line = parseFloat(getComputedStyle(p).lineHeight);
          const lines = p.getBoundingClientRect().height / line;
          return Math.abs(lines - Math.round(lines)) < 0.02
            ? null
            : `${(p.textContent ?? "").trim().slice(0, 32)}…: ${lines.toFixed(2)} lines`;
        })
        .filter(Boolean),
    );
    expect(off).toEqual([]);
  });

  // 020c review, finding 6: the hidden twin table stays plain markup.
  test("the hidden table's code carries no class", async ({ page }) => {
    await page.goto(GUIDE);
    const classed = await page
      .locator("main table[hidden] code[class]")
      .count();
    expect(classed).toBe(0);
    expect(
      await page.locator("main table[hidden] code").count(),
    ).toBeGreaterThan(0);
  });

  test("the Markdown twin keeps the table, and only the table", () => {
    const twin = readFileSync(path.join("build", GUIDE, "index.md"), "utf8");
    expect(twin).toContain(
      "| Old name | New name | Who sees it | What to do | Old name works until |",
    );
    for (const r of RENAMES)
      expect(twin, r.old).toContain(`| \`${r.old}\` | \`${r.new}\` |`);
    expect(twin).not.toContain("Who sees it.");
  });
});
