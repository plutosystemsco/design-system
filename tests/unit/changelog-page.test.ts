/**
 * 015 criterion 22: the changelog page is CHANGELOG.md, a section per
 * release with an anchor, and its text is the file's with the Markdown
 * syntax removed.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { blockText, parseChangelog } from "../../src/lib/site/changelog.ts";

const FILE = readFileSync("CHANGELOG.md", "utf8");
const page = parseChangelog(FILE);

describe("015: the changelog page", () => {
  test("every ## release heading is one section with an id", () => {
    const headings = [...FILE.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    expect(page.releases.map((r) => r.title)).toEqual(headings);
    for (const r of page.releases) expect(r.id).toMatch(/^v\d+-\d+-\d+$/);
    expect(page.releases[0].id).toBe("v0-12-0");
    expect(new Set(page.releases.map((r) => r.id)).size).toBe(
      page.releases.length,
    );
  });

  test("the page's text equals the file's, with the Markdown syntax removed", () => {
    const fromFile = FILE.split("\n")
      .filter((l) => !/^#{1,2} /.test(l))
      .map((l) =>
        l
          .replace(/^- /, "")
          .replace(/^\d+\. /, "")
          .replace(/`([^`]*)`/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1"),
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const fromPage = [...page.intro, ...page.releases.flatMap((r) => r.blocks)]
      .map(blockText)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    expect(fromPage).toBe(fromFile);
  });
});
