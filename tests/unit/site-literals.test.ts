/**
 * 015 criterion 28: tokens are the one source, on the site too. The site's
 * own files hold no colour literal and no arbitrary pixel value; no site
 * component has a `<style>` block; every rule of `site.css` sits inside
 * `@layer components`, so a field's layered legend is never beaten by an
 * unlayered site rule.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const DIRS = ["src/lib/site", "src/routes/(site)", "src/routes/(example)"];

function files(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((e) => {
    const full = path.join(dir, e);
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

const SOURCES = DIRS.flatMap(files).filter((f) => /\.(svelte|ts|css)$/.test(f));

describe("015: the site's literals", () => {
  test("the site has source files", () => {
    expect(SOURCES.length).toBeGreaterThan(10);
  });

  test("0 hex, rgb(, hsl( or oklch( colour literals", () => {
    const hits = SOURCES.flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .map((l, i) => [f, i + 1, l] as const)
        .filter(([, , l]) =>
          /(?<!&)#[0-9a-fA-F]{3,8}\b(?![\w-])|\b(?:rgba?|hsla?|oklch)\(/.test(
            l,
          ),
        )
        .filter(([, , l]) => !/href="#|"#[a-z]|`#[a-z]|#main\b/.test(l))
        .map(([f, i, l]) => `${f}:${i}: ${l.trim()}`),
    );
    expect(hits).toEqual([]);
  });

  test("0 arbitrary pixel values", () => {
    const hits = SOURCES.flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .map((l, i) => [i + 1, l] as const)
        .filter(([, l]) => /-\[-?[\d.]+px\]/.test(l))
        .map(([i, l]) => `${f}:${i}: ${l.trim()}`),
    );
    expect(hits).toEqual([]);
  });

  test("0 <style> blocks in any .svelte file", () => {
    expect(
      SOURCES.filter((f) => f.endsWith(".svelte")).filter((f) =>
        /<style[\s>]/.test(readFileSync(f, "utf8")),
      ),
    ).toEqual([]);
  });

  test("every rule in site.css sits inside @layer components", () => {
    const css = readFileSync("src/lib/site/site.css", "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();
    // Top-level statements: each must be an @layer components block.
    let depth = 0;
    let start = 0;
    const top: string[] = [];
    for (let i = 0; i < css.length; i++) {
      if (css[i] === "{") depth++;
      if (css[i] === "}") {
        depth--;
        if (depth === 0) {
          top.push(css.slice(start, i + 1).trim());
          start = i + 1;
        }
      }
    }
    expect(css.slice(start).trim()).toBe("");
    expect(top.length).toBeGreaterThan(0);
    for (const block of top) expect(block).toMatch(/^@layer components\s*\{/);
  });
});
