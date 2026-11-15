/**
 * 019a decision 1 (the owner, 2026-11-15): no
 * text on any site page sets a letter spacing of its own. Every page of the
 * sitemap, at 1440: every element that holds text of its own computes
 * `letter-spacing` as `normal` or `0px`. Spacing does not depend on the
 * scheme, so the dark project skips it.
 */
import { expect, test } from "@playwright/test";
import { open, SITEMAP } from "./pages.ts";

test.describe("the font's own letter spacing", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const { path } of SITEMAP)
    test(`${path}: no text sets a letter spacing`, async ({ page }, info) => {
      test.skip(
        info.project.name === "dark",
        "letter spacing is the same in both schemes",
      );
      await open(page, path);
      const found = await page.evaluate(() => {
        const out: string[] = [];
        const seen = new Set<Element>();
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
        );
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!el || seen.has(el) || !n.textContent?.trim()) continue;
          seen.add(el);
          const ls = getComputedStyle(el).letterSpacing;
          if (ls !== "normal" && ls !== "0px")
            out.push(
              `${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").slice(0, 60)} "${n.textContent.trim().slice(0, 24)}": ${ls}`,
            );
        }
        return out;
      });
      expect(found).toEqual([]);
    });
});
