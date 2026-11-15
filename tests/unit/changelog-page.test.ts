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

/**
 * 018 decision 11, criterion 16: the page scans. Each release's heading is
 * its version alone, with its date on a line of its own; an item named in a
 * bullet's head links to its page; "interface change." is a badge reading
 * "Interface change". Otherwise the text is the file's.
 */
import * as changelog from "../../src/lib/site/changelog.ts";
import { componentPath, sitePage } from "../../src/lib/site/sitemap.ts";

describe("018: a changelog to scan", () => {
  const { headNames, INTERFACE_CHANGE } = changelog;
  const isItem = (name: string) => Boolean(sitePage(componentPath(name)));
  const empty = { intro: [], releases: [] } as unknown as ReturnType<
    typeof changelog.changelogPage
  >;
  const view =
    typeof changelog.changelogPage === "function"
      ? changelog.changelogPage(page, (name) =>
          isItem(name) ? componentPath(name) : null,
        )
      : empty;
  const SVELTE = readFileSync(
    "src/routes/(site)/changelog/+page.svelte",
    "utf8",
  );
  const SERVER = readFileSync(
    "src/routes/(site)/changelog/+page.server.ts",
    "utf8",
  );
  type Item = { kind: string; text: string; href?: string }[];
  type AnyBlock = { kind: "p" } | { kind: "ul" | "ol"; items: Item[] };
  const lists = (blocks: readonly AnyBlock[]) =>
    blocks.flatMap((b) => (b.kind === "p" ? [] : [b]));

  test("every release is a heading holding its version alone, then its date line", () => {
    expect(view.releases.map((r) => r.id)).toEqual(
      page.releases.map((r) => r.id),
    );
    for (const [i, r] of view.releases.entries()) {
      const title = page.releases[i].title;
      expect(r.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(title.startsWith(r.version)).toBe(true);
      const written = title.slice(r.version.length).replace(/^\s*—\s*/, "");
      if (/^\d{4}-\d{2}-\d{2}$/.test(written))
        expect(r.date).toEqual({ text: written, datetime: written });
      else {
        expect(written).toBe("unreleased");
        expect(r.date).toEqual({ text: "Unreleased", datetime: null });
      }
    }
    expect(view.releases[0].date.text).toBe("Unreleased");
    expect(view.releases[1].date).toEqual({
      text: "2026-11-07",
      datetime: "2026-11-07",
    });
    // The page sets the version in the heading and the date in a <time>.
    expect(SVELTE).toMatch(/<h2[^>]*>\s*\{release\.version\}\s*<\/h2>/);
    expect(SVELTE).not.toContain("release.title");
    expect(SVELTE).toMatch(/<time datetime=\{release\.date\.datetime\}/);
    expect(SERVER).toContain("changelogPage(");
  });

  test("every item code span in a bullet's head is a link to its page, still set as code", () => {
    let links = 0;
    for (const [i, r] of view.releases.entries()) {
      const before = lists(page.releases[i].blocks);
      const after = lists(r.blocks);
      for (const [b, list] of before.entries())
        for (const [j, item] of list.items.entries()) {
          const want = headNames(item as never).filter(isItem);
          const got = (
            after[b].items[j] as { kind: string; text: string; href?: string }[]
          ).filter((x) => x.kind === "link");
          expect(got.map((x) => x.text)).toEqual(want);
          for (const x of got) expect(x.href).toBe(componentPath(x.text));
          links += got.length;
        }
    }
    expect(links).toBeGreaterThan(100);
    expect(SVELTE).toMatch(
      /<a\s[^>]*href=\{x\.href\}[^>]*>\s*<code>\{x\.text\}<\/code>/,
    );
  });

  test('every "interface change." is a badge of variant="default" reading "Interface change"', () => {
    const inFile =
      FILE.split("\n")
        .filter((l) => /^(- |\d+\. |\s+\S)/.test(l))
        .join("\n")
        .split("**interface change.**").length - 1;
    const marks = view.releases.flatMap((r) =>
      lists(r.blocks).flatMap((l) =>
        l.items.flatMap((i) =>
          (i as { kind: string; text: string }[]).filter(
            (x) => x.kind === "mark",
          ),
        ),
      ),
    );
    expect(inFile).toBeGreaterThan(5);
    expect(marks.length).toBe(inFile);
    for (const m of marks) expect(m.text).toBe("Interface change");
    expect(INTERFACE_CHANGE).toBe("Interface change");
    const strong = view.releases.flatMap((r) =>
      lists(r.blocks).flatMap((l) =>
        l.items.flatMap((i) =>
          (i as { kind: string; text: string }[]).filter(
            (x) => x.kind === "strong" && /interface change/i.test(x.text),
          ),
        ),
      ),
    );
    expect(strong).toEqual([]);
    expect(SVELTE).toContain('import { Badge } from "#lib/registry/ui/badge"');
    expect(SVELTE).toMatch(/<Badge variant="default">\{x\.text\}<\/Badge\s*>/);
  });

  test("the text otherwise equals the file's, by the two named rewrites", () => {
    const fromFile = FILE.split("\n")
      .filter((l) => !/^# /.test(l))
      .map((l) => {
        // Rewrite 1: a heading's " — <date>" becomes the date line.
        const h = /^## (\d+\.\d+\.\d+) — (.+)$/.exec(l);
        if (h) return `${h[1]} ${h[2] === "unreleased" ? "Unreleased" : h[2]}`;
        // Rewrite 2: a bullet's "interface change." becomes "Interface change".
        if (/^(- |\d+\. |\s+\S)/.test(l))
          l = l.replaceAll("**interface change.**", "Interface change");
        return l
          .replace(/^- /, "")
          .replace(/^\d+\. /, "")
          .replace(/`([^`]*)`/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1");
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const text = (xs: { text: string }[]) => xs.map((x) => x.text).join("");
    const blocks = (bs: (typeof view.intro)[number][]) =>
      bs
        .map((b) =>
          b.kind === "p" ? text(b.inlines) : b.items.map(text).join("\n"),
        )
        .join(" ");
    const fromPage = [
      blocks(view.intro),
      ...view.releases.map(
        (r) => `${r.version} ${r.date.text} ${blocks(r.blocks)}`,
      ),
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    expect(fromPage).toBe(fromFile);
  });
});
