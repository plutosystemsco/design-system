/**
 * 020 test 14, decision 10: one list of redirects, in `static/_redirects`
 * for the host and in `REDIRECTS` for the preview's plugin and the tests.
 * The half that reads `build/` is in `tests/e2e/redirects.spec.ts`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  matchRedirect,
  parseRedirects,
  REDIRECTS,
} from "../../src/lib/site/redirects.ts";
import { SITEMAP } from "../../src/lib/site/sitemap.ts";

const FILE = readFileSync("static/_redirects", "utf8");

describe("020 test 14: the redirects", () => {
  test("static/_redirects parses into exactly REDIRECTS, in decision 10's order", () => {
    expect(parseRedirects(FILE)).toEqual([...REDIRECTS]);
    expect(REDIRECTS.map((r) => `${r.from} ${r.to} ${r.status}`)).toEqual([
      "/components/pluto-theme /components/kuiper-theme/ 301",
      "/components/pluto-theme/ /components/kuiper-theme/ 301",
      "/components/pluto-theme/* /components/kuiper-theme/:splat 301",
      "/example/pluto-theme /components/kuiper-theme/ 301",
      "/example/pluto-theme/ /components/kuiper-theme/ 301",
      "/example/pluto-theme/* /example/kuiper-theme/:splat 301",
    ]);
  });

  test("each rule is 301, and of one of the three shapes", () => {
    for (const r of REDIRECTS) {
      expect(r.status).toBe(301);
      const splat = r.from.endsWith("/*");
      expect(r.from.slice(0, -2).includes("*")).toBe(false);
      expect(r.from).not.toContain(":");
      if (splat) expect(r.to.endsWith(":splat")).toBe(true);
      else expect(r.to).not.toContain(":");
    }
  });

  test("the parser rejects every other shape", () => {
    for (const line of [
      "/a/:id /b/:id 301",
      "/a*/b /c 301",
      "/a /b",
      "/a /b 200",
      "/a/* /b 301",
      "/a /b/:splat 301",
      "/a /b 301 extra",
    ])
      expect(() => parseRedirects(line), line).toThrow();
    expect(parseRedirects("# a comment\n\n/a /b 301\n")).toHaveLength(1);
  });

  test("each destination is a page in SITEMAP, or a folder of example pages", () => {
    const paths = new Set(SITEMAP.map((p) => p.path));
    for (const r of REDIRECTS) {
      if (!r.to.endsWith(":splat")) {
        expect(paths.has(r.to), r.to).toBe(true);
        continue;
      }
      const folder = r.to.slice(0, -":splat".length);
      if (folder.startsWith("/components/"))
        expect(paths.has(folder), folder).toBe(true);
      else {
        const item = folder.split("/")[2]!;
        const dir = `src/lib/site/examples/${item}`;
        expect(existsSync(dir), dir).toBe(true);
        expect(
          readdirSync(dir).filter((f) => f.endsWith(".svelte")).length,
        ).toBeGreaterThan(0);
      }
    }
  });

  test("no source path is a page in SITEMAP", () => {
    const paths = new Set(SITEMAP.map((p) => p.path));
    for (const r of REDIRECTS) {
      expect(paths.has(r.from), r.from).toBe(false);
      expect(paths.has(r.from.replace(/\*$/, "")), r.from).toBe(false);
    }
  });

  test("matchRedirect answers each form with its rule's destination, and nothing else", () => {
    expect(matchRedirect("/components/pluto-theme")).toBe(
      "/components/kuiper-theme/",
    );
    expect(matchRedirect("/components/pluto-theme/")).toBe(
      "/components/kuiper-theme/",
    );
    expect(matchRedirect("/components/pluto-theme/index.md")).toBe(
      "/components/kuiper-theme/index.md",
    );
    expect(matchRedirect("/example/pluto-theme")).toBe(
      "/components/kuiper-theme/",
    );
    expect(matchRedirect("/example/pluto-theme/colours/")).toBe(
      "/example/kuiper-theme/colours/",
    );
    expect(matchRedirect("/components/kuiper-theme/")).toBeNull();
    expect(matchRedirect("/components/pluto-themes/")).toBeNull();
  });
});
