/**
 * 022 decisions 12, 13a and 15: what each screen-reader test declares, read
 * statically from its source, as `030` reads it from the listing.
 *
 * Each test is written `test("title", declared("item", ["L1", …], ["hears", …]), body)`.
 * The title and the arguments are literals, so this parser, the unit tests
 * and `mutations.test.ts`'s derivation all see what Playwright lists. A file
 * may declare its item's parts, `export const PARTS = ["assertive", …]`, for
 * `hears` entries of the form `item:part`.
 *
 * This file imports only Node's `fs` and `path`.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type Declared = {
  file: string;
  title: string;
  item: string;
  rules: string[];
  hears: string[];
  /** The parts this test's file declares for its item. */
  parts: string[];
};

const strings = (list: string | undefined): string[] =>
  [...(list ?? "").matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) => m[1]!);

/** Every `test(…)` call's title in a source; `test.describe` and the like aside. */
export function testCalls(source: string): { title: string }[] {
  return [
    ...source.matchAll(/(?<![.\w])test\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g),
  ].map((m) => ({ title: m[2]! }));
}

/** Every declared test in one source. */
export function declaredIn(file: string, source: string): Declared[] {
  const parts = strings(
    source.match(/export const PARTS(?:\s*:[^=]+)?\s*=\s*\[([^\]]*)\]/)?.[1],
  );
  const re =
    /(?<![.\w])test\(\s*"((?:\\.|[^"\\])*)"\s*,\s*declared\(\s*"([^"]+)"\s*,\s*\[([^\]]*)\]\s*(?:,\s*\[([^\]]*)\]\s*)?,?\s*\)/g;
  return [...source.matchAll(re)].map((m) => {
    const item = m[2]!;
    const hears = m[4] === undefined ? [item] : strings(m[4]);
    return { file, title: m[1]!, item, rules: strings(m[3]), hears, parts };
  });
}

/** Every declared test in `tests/sr/`. */
export function declaredTests(dir = "tests/sr"): Declared[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".sr.ts"))
    .sort()
    .flatMap((f) => declaredIn(f, readFileSync(path.join(dir, f), "utf8")));
}

/** The kinds a test's rules check: L* a live region, F1 a focus move, the rest an overlay. */
export function kindsOf(rules: string[]): ("live" | "focus" | "overlay")[] {
  const out = new Set<"live" | "focus" | "overlay">();
  for (const r of rules) {
    if (r.startsWith("L")) out.add("live");
    else if (r === "F1") out.add("focus");
    else if (/^(O|T|C)/.test(r)) out.add("overlay");
  }
  return [...out];
}
