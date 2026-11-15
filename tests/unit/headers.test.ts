/**
 * 015 decision 21: the worker's settings. `static/_headers` holds five
 * rules; `wrangler.jsonc` names the worker and its assets; `vite.config.ts`
 * writes absolute asset paths.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/** Cloudflare's `_headers` format: a URL pattern, then indented `Name: value` lines. */
function parseHeaders(
  text: string,
): { pattern: string; headers: [string, string][] }[] {
  const rules: { pattern: string; headers: [string, string][] }[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^\s/.test(line)) {
      const [name, ...value] = line.trim().split(":");
      rules.at(-1)!.headers.push([name.trim(), value.join(":").trim()]);
    } else rules.push({ pattern: line.trim(), headers: [] });
  }
  return rules;
}

describe("015 criterion 24: worker, headers and paths", () => {
  const text = readFileSync("static/_headers", "utf8");
  const rules = parseHeaders(text);

  test("static/_headers parses into decision 21's 5 rules", () => {
    expect(rules).toEqual([
      {
        pattern: "/*",
        headers: [
          ["X-Content-Type-Options", "nosniff"],
          ["Referrer-Policy", "strict-origin-when-cross-origin"],
        ],
      },
      {
        pattern: "/_app/immutable/*",
        headers: [["Cache-Control", "public, max-age=31536000, immutable"]],
      },
      { pattern: "/view/*", headers: [["X-Robots-Tag", "noindex"]] },
      { pattern: "/example/*", headers: [["X-Robots-Tag", "noindex"]] },
      {
        pattern: "https://pluto-systems-design.:account.workers.dev/*",
        headers: [["X-Robots-Tag", "noindex"]],
      },
    ]);
  });

  test("fewer than 100 rules, and at most 2,000 characters a line", () => {
    expect(rules.length).toBeLessThan(100);
    for (const line of text.split("\n"))
      expect(line.length).toBeLessThanOrEqual(2000);
  });

  test('wrangler.jsonc names the worker "pluto-systems-design" and states its assets', () => {
    const raw = readFileSync("wrangler.jsonc", "utf8").replace(
      /^\s*\/\/.*$/gm,
      "",
    );
    const config = JSON.parse(raw);
    expect(config.name).toBe("pluto-systems-design");
    expect(config.assets).toEqual({
      directory: "./build",
      html_handling: "auto-trailing-slash",
      not_found_handling: "404-page",
    });
  });

  test("vite.config.ts sets paths.relative to false", () => {
    expect(readFileSync("vite.config.ts", "utf8")).toMatch(
      /paths:\s*\{\s*relative:\s*false\s*\}/,
    );
  });
});
