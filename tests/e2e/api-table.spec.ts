/**
 * 023a: the API table's Type cell breaks a type only between words, at
 * its punctuation, and no API table scrolls sideways for it, at 1440 or 390.
 */
import { expect, test, type Page } from "@playwright/test";
import { COMPONENT_PAGES, componentPath, open } from "./pages.ts";

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

  /**
   * The tables that still scroll sideways at 1440, accepted by the second
   * ruling at landing: in each, the columns' minimum widths (each its
   * longest unbreakable piece: a name, a type piece, a code span in "What
   * it does") plus the cells' padding add up to more than the 606 px
   * column. No type name causes it. The table's own scroller is the
   * designed fallback (015 criterion 26); `023` re-plans the layout. Each is
   * named; a new one fails.
   */
  const WIDE_AT_1440: Record<string, string> = {
    "/components/button-group/ ButtonGroup":
      "HTMLDivElement and DropdownMenu.Trigger",
    "/components/popover/ PopoverContent": "WithoutChildrenOrChild<",
    "/components/highlighter/ Languages":
      "findHighlightLanguage, HighlightLanguage[] and highlight/queries/",
    "/components/highlighter/ Shiki":
      "loadShikiLanguage, ThemeRegistrationRaw and GrammarState",
    "/components/code-languages/ CodeLanguages":
      "CodeLanguageKind, LanguageSupport and its description's code",
    "/components/chart/ ChartUtils":
      "getPayloadConfigFromPayload and ChartContextValue)",
    "/components/sidebar/ SidebarMenuButton":
      'tooltipContentProps, WithoutChildrenOrChild< and "default"',
  };

  // The landing's ruling: every component page's tables, at both widths.
  for (const width of [1440, 390])
    test.describe(`at ${width}`, () => {
      test.use({ viewport: { width, height: 900 } });
      test("on every component page, no API table scrolls sideways", async ({
        page,
      }) => {
        test.setTimeout(600_000);
        const wide: string[] = [];
        let tables = 0;
        for (const path of COMPONENT_PAGES) {
          await open(page, path);
          const scrollers = page.locator(
            'section[aria-labelledby="api"] [data-slot="site-scroll"]',
          );
          tables += await scrollers.count();
          wide.push(
            ...(await scrollers.evaluateAll(
              (els, path) =>
                els
                  .filter((e) => e.scrollWidth > e.clientWidth + 1)
                  .map(
                    (e) =>
                      `${path} ${e.getAttribute("aria-label")?.replace(/, API$/, "")}: ${e.scrollWidth} > ${e.clientWidth}`,
                  ),
              path,
            )),
          );
        }
        expect(tables).toBeGreaterThan(0);
        const known = width === 1440 ? WIDE_AT_1440 : {};
        expect(wide.filter((w) => !(w.split(":")[0] in known))).toEqual([]);
      });
    });
});
