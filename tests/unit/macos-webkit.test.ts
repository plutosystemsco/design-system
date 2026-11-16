/**
 * 022's review, finding 4: the record of macOS WebKit's platform failures
 * stays in step with the suite. Each entry names a test that exists, once,
 * with one of the three causes. The harness carries the answer to the first
 * two; `key-after-focus` has none, and Linux WebKit decides it.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { MACOS_WEBKIT } from "../e2e/macos-webkit.ts";

function listed(): Set<string> {
  const r = Bun.spawnSync(
    [
      "bun",
      "--bun",
      "playwright",
      "test",
      "--list",
      "--reporter=json",
      "--project=webkit-dark",
    ],
    { env: { ...process.env, CI: "" } },
  );
  const out = new Set<string>();
  type Suite = {
    title: string;
    specs?: { title: string }[];
    suites?: Suite[];
  };
  const walk = (s: Suite, trail: string[], file: string) => {
    for (const sp of s.specs ?? [])
      out.add(`${file} › ${[...trail, sp.title].join(" › ")}`);
    for (const x of s.suites ?? []) walk(x, [...trail, x.title], file);
  };
  for (const s of JSON.parse(r.stdout.toString()).suites ?? [])
    walk(s, [], s.title);
  return out;
}

describe("the macOS WebKit record", () => {
  test("every entry is a test in the listing, once, with a known cause", () => {
    const tests = listed();
    const keys = MACOS_WEBKIT.map((e) => `${e.file} › ${e.title}`);
    expect(keys.filter((k) => !tests.has(k))).toEqual([]);
    expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
    for (const e of MACOS_WEBKIT)
      expect(["tab-to-links", "click-focus", "key-after-focus"]).toContain(
        e.cause,
      );
    expect(MACOS_WEBKIT.length).toBeGreaterThan(0);
  }, 120_000);

  test("the harness answers both causes: Alt+Tab on macOS WebKit, and activate()", () => {
    const fixture = readFileSync("tests/test.ts", "utf8");
    expect(fixture).toContain('"Alt+Tab"');
    expect(fixture).toContain('browserName === "webkit"');
    const pages = readFileSync("tests/e2e/pages.ts", "utf8");
    expect(pages).toContain("export async function activate(");
  });
});
