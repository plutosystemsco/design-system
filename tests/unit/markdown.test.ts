/**
 * 015 decision 19, criterion 19: the converter, on fixture HTML. Each
 * fixture is a page's HTML and the Markdown its twin must hold.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { htmlToMarkdown } from "../../src/lib/site/markdown.ts";

const DIR = "tests/fixtures/markdown";
const PAGES = readdirSync(DIR)
  .filter((f) => f.endsWith(".html"))
  .sort();

describe("015: the Markdown converter", () => {
  test("12 fixture pages", () => {
    expect(PAGES).toHaveLength(12);
  });

  for (const page of PAGES) {
    test(`${page} converts to its expected Markdown`, async () => {
      const html = readFileSync(path.join(DIR, page), "utf8");
      const md = await htmlToMarkdown(html, {
        origin: "https://site.test",
        page: "/components/button/",
      });
      expect(md).toBe(
        readFileSync(path.join(DIR, page.replace(/\.html$/, ".md")), "utf8"),
      );
    });
  }
});
