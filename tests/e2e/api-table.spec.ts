/**
 * 023a: the API table's Type cell breaks a type only between words, at
 * its punctuation, and no API table scrolls sideways for it, at 1440 or 390.
 */
import type { Page } from "@playwright/test";
import { expect, test } from "../test.ts";
import { componentPath, open, SITEMAP } from "./pages.ts";

/** The three pages that showed the defect, and two that did not yet. */
const PAGES = ["button-group", "link", "progress", "button", "meter"].map(
  componentPath,
);

/** Every component page, from the sitemap, so a check cannot drift from the site. */
const COMPONENT_PAGES = SITEMAP.map((p) => p.path).filter((p) =>
  /^\/components\/[^/]+\/$/.test(p),
);

/**
 * Every place a Type cell's code breaks a line between two characters of
 * a name (`[\w$]`). Each character's box is read with Range.getClientRects(); a line
 * starts where a character's box sits lower than the one before it.
 */
async function midWordBreaks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const word = /[\w$]/;
    const cells = document.querySelectorAll(
      'section[aria-labelledby="api"] tbody td:nth-child(2) code',
    );
    for (const code of cells) {
      // Each drawn character, with its place in the cell's text.
      const chars: { at: number; c: string; top: number; h: number }[] = [];
      let text = "";
      const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n.textContent ?? "";
        for (let k = 0; k < t.length; k++) {
          const range = document.createRange();
          range.setStart(n, k);
          range.setEnd(n, k + 1);
          const r = [...range.getClientRects()].find((b) => b.width > 0);
          if (r)
            chars.push({
              at: text.length + k,
              c: t[k],
              top: r.top,
              h: r.height,
            });
        }
        text += t;
      }
      for (let k = 1; k < chars.length; k++) {
        const a = chars[k - 1];
        const b = chars[k];
        // Two neighbours in the text: a space that hangs at a line's end
        // draws nothing, so the letters either side of it are not neighbours.
        if (
          b.at === a.at + 1 &&
          b.top - a.top > a.h / 2 &&
          word.test(a.c) &&
          word.test(b.c)
        )
          out.push(`${text.slice(0, b.at)}/${text.slice(b.at)}`);
      }
    }
    return out;
  });
}

test.describe("023a: type names break only between words", () => {
  for (const width of [1440, 390])
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 900 } });
      for (const path of PAGES)
        test(`on ${path}, every Type cell's line starts at a word boundary`, async ({
          page,
        }) => {
          await open(page, path);
          expect(
            await page
              .locator('section[aria-labelledby="api"] tbody td:nth-child(2)')
              .count(),
          ).toBeGreaterThan(0);
          expect(await midWordBreaks(page)).toEqual([]);
        });
    });

  // The review's finding 3: a <wbr> is hidden, so Chromium's computed name
  // of a cell gains no space at it. Read through CDP, as Chromium computes
  // it; Playwright's own snapshot computes names its own way.
  test.describe("at 1440", () => {
    test.use({ viewport: { width: 1440, height: 900 } });
    test("in Chromium, every Type and What-it-does cell's accessible name is its text", async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium", "Chromium's name, through CDP");
      test.setTimeout(600_000);
      const cdp = await page.context().newCDPSession(page);
      const selector =
        'section[aria-labelledby="api"] tbody td:nth-child(2), section[aria-labelledby="api"] tbody td:nth-child(3)';
      const squash = (s: string) => s.replace(/\s+/g, " ").trim();
      // Chromium drops the space between `@internal` and the code after it
      // in one Highlighter description. It did so before 023a, with no
      // <wbr> in the cell (seen on 1238f18's build), so it is not this.
      const before023a = (name: string) =>
        name.includes("the @internalgetInternalStack()");
      const wrong: string[] = [];
      let cells = 0;
      for (const path of COMPONENT_PAGES) {
        await open(page, path);
        const texts = await page
          .locator(selector)
          .evaluateAll((tds) => tds.map((td) => td.textContent ?? ""));
        await cdp.send("DOM.enable");
        await cdp.send("Accessibility.enable");
        const { root } = await cdp.send("DOM.getDocument", { depth: 0 });
        const { nodeIds } = await cdp.send("DOM.querySelectorAll", {
          nodeId: root.nodeId,
          selector,
        });
        expect(nodeIds.length).toBe(texts.length);
        for (const [k, nodeId] of nodeIds.entries()) {
          const { nodes } = await cdp.send("Accessibility.getPartialAXTree", {
            nodeId,
            fetchRelatives: false,
          });
          const name = squash(String(nodes[0]?.name?.value ?? ""));
          cells++;
          if (name !== squash(texts[k]) && !before023a(name))
            wrong.push(`${path}: "${name}" for "${squash(texts[k])}"`);
        }
      }
      expect(cells).toBeGreaterThan(1000);
      expect(wrong).toEqual([]);
    });
  });

  /**
   * The tables that still scroll sideways at 1440, each with its measured
   * scrollWidth. 023 emptied the list: a row's default moved under its
   * description, so every table has three columns and fits the 606 px text
   * column. A table that scrolls now fails; one added here must say why,
   * and fails once it no longer overflows or grows by more than 8 px.
   */
  const WIDE_AT_1440: Record<string, { width: number; why: string }> = {
    "/components/dropdown-menu/ DropdownMenuSubContent": {
      width: 628,
      why: "022a re-declares escapeKeydownBehavior, a 21-character name in a cell that never breaks; 023b lets a name break between its words",
    },
  };

  // The landing's ruling: every component page's tables, at both widths.
  // 023 adds 1024, where the text column is widest but the page's chrome
  // leaves the table least room beside a description.
  for (const width of [1440, 1024, 390])
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 900 } });
      test("on every component page, no API table scrolls sideways", async ({
        page,
      }) => {
        test.setTimeout(600_000);
        const seen = new Map<string, number>();
        let tables = 0;
        for (const path of COMPONENT_PAGES) {
          await open(page, path);
          const scrollers = page.locator(
            'section[aria-labelledby="api"] [data-slot="site-scroll"]',
          );
          tables += await scrollers.count();
          const wide = await scrollers.evaluateAll((els) =>
            els
              .filter((e) => e.scrollWidth > e.clientWidth + 1)
              .map((e) => ({
                // A component's table is "{part}, API"; a module's,
                // "{part}, exports".
                part: (e.getAttribute("aria-label") ?? "").replace(
                  /, (API|exports)$/,
                  "",
                ),
                width: e.scrollWidth,
              })),
          );
          for (const w of wide) seen.set(`${path} ${w.part}`, w.width);
        }
        expect(COMPONENT_PAGES.length).toBeGreaterThan(70);
        expect(tables).toBeGreaterThan(0);
        const known = width === 1440 ? WIDE_AT_1440 : {};
        const unlisted = [...seen].filter(([key]) => !(key in known));
        expect(unlisted.map(([key, w]) => `${key}: ${w}`)).toEqual([]);
        for (const [key, { width: w }] of Object.entries(known)) {
          const got = seen.get(key);
          expect(got, `${key} no longer overflows: remove it`).toBeDefined();
          expect(got, `${key} grew`).toBeLessThanOrEqual(w + 8);
        }
      });
    });
});

/**
 * 023 test 7: the two pages the scorecard reads describe every row. Each
 * API table has a "What it does" column, and each body row's cell in it
 * holds a description, not only its default, but the closing row, which
 * spans the table. The default's line is marked `data-slot="api-default"`.
 */
test.describe("023: Button and Dialog: every API table is described", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  for (const name of ["button", "dialog"])
    test(`on ${componentPath(name)}, every row says what it does`, async ({
      page,
    }) => {
      await open(page, componentPath(name));
      const tables = await page
        .locator('section[aria-labelledby="api"] table')
        .evaluateAll((ts) =>
          ts.map((t) => {
            const head = [...t.querySelectorAll("thead th")].map(
              (th) => th.textContent?.trim() ?? "",
            );
            const at = head.indexOf("What it does");
            // The closing row spans the table; it is the only one-cell row.
            const rows = [...t.querySelectorAll("tbody tr")].filter(
              (tr) => tr.children.length > 1,
            );
            // The default sits in the same cell, marked; it is not a
            // description, so a row with only a default fails (the change
            // review, finding 3).
            const described = (td: Element | undefined) => {
              if (!td) return "";
              const copy = td.cloneNode(true) as Element;
              for (const d of copy.querySelectorAll(
                '[data-slot="api-default"]',
              ))
                d.remove();
              return (copy.textContent ?? "").trim();
            };
            const empty = rows
              .filter((tr) => !described(tr.children[at]))
              .map((tr) => tr.children[0]?.textContent?.trim() ?? "");
            return {
              part: t.querySelector("caption")?.textContent?.trim() ?? "",
              rows: rows.length,
              at,
              empty,
            };
          }),
        );
      expect(tables.length).toBeGreaterThan(0);
      // A part that only passes its source's props on (DialogPortal) has
      // no row of its own, so nothing to describe: only its closing row.
      expect(
        tables.filter((t) => t.rows > 0 && t.at < 0).map((t) => t.part),
      ).toEqual([]);
      expect(
        tables.flatMap((t) => t.empty.map((r) => `${t.part}.${r}`)),
      ).toEqual([]);
    });
});
