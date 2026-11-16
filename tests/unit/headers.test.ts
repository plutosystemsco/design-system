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

// decisions.md, "Dark type is #A8C0D8, and the site's temporary address"
// (2026-11-15): the owner's account, and the release check that waited on it.
describe("the site's address", () => {
  test("SITE_ORIGIN is https://pluto-systems-design.claygendron.workers.dev", async () => {
    const { SITE_ORIGIN } = await import("../../src/lib/site/site.ts");
    expect(SITE_ORIGIN).toBe(
      "https://pluto-systems-design.claygendron.workers.dev",
    );
  });

  test("the noindex rule's host pattern matches that address", async () => {
    const { SITE_ORIGIN } = await import("../../src/lib/site/site.ts");
    const rules = parseHeaders(readFileSync("static/_headers", "utf8"));
    const rule = rules.find((r) => r.pattern.startsWith("https://"))!;
    expect(rule.headers).toEqual([["X-Robots-Tag", "noindex"]]);
    const host = rule.pattern;
    const re = new RegExp(
      "^" +
        host
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/:[a-z]+/g, "[^.]+")
          .replace("/\\*", "/.*") +
        "$",
    );
    expect(re.test(`${SITE_ORIGIN}/components/button/`)).toBe(true);
  });

  // 025's change review, finding 3: the tag's own checks (the cost run) are
  // left out by name with `--before-ci`, never by an ambient variable. The
  // address check is pure and is called directly.
  test("addressCheck passes on SITE_ORIGIN and fails on the placeholder", async () => {
    const { addressCheck } =
      await import("../../scripts/site/release-check.ts");
    const { SITE_ORIGIN } = await import("../../src/lib/site/site.ts");
    expect(addressCheck(SITE_ORIGIN).ok).toBe(true);
    expect(addressCheck("https://<account>.workers.dev").ok).toBe(false);
  });

  test("scripts/site/release-check.ts --before-ci exits 0 and names what it skipped", () => {
    const r = Bun.spawnSync([
      process.execPath,
      "scripts/site/release-check.ts",
      "--before-ci",
    ]);
    const out = r.stdout.toString();
    expect(r.exitCode).toBe(0);
    expect(out).toContain("release-check: SITE_ORIGIN is https://");
    expect(out).toContain("skipped (--before-ci): the cost run");
  });
});
