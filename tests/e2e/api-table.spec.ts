/**
 * 023a: the API table's Type cell breaks a type name only between words,
 * and no API table scrolls sideways on a phone for it.
 */
import { expect, test, type Page } from "@playwright/test";
import { componentPath, open } from "./pages.ts";

/** The three pages that showed the defect, and two that did not yet. */
const PAGES = ["button-group", "link", "progress", "button", "meter"].map(
  componentPath,
);

/**
 * Every place a Type cell's code breaks a line between two letters or
 * digits. Each character's box is read with Range.getClientRects(); a line
 * starts where a character's box sits lower than the one before it.
 */
async function midWordBreaks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const word = /[A-Za-z0-9]/;
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

  test.describe("at 390", () => {
    test.use({ viewport: { width: 390, height: 900 } });
    for (const path of PAGES)
      test(`on ${path}, no API table scrolls sideways`, async ({ page }) => {
        await open(page, path);
        const wide = await page
          .locator('section[aria-labelledby="api"] [data-slot="site-scroll"]')
          .evaluateAll((els) =>
            els
              .filter((e) => e.scrollWidth > e.clientWidth + 1)
              .map(
                (e) =>
                  `${e.getAttribute("aria-label")}: ${e.scrollWidth} > ${e.clientWidth}`,
              ),
          );
        expect(wide).toEqual([]);
      });
  });
});
