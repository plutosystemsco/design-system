/**
 * 022 test 5a, decision 13a: annotations on screen-reader tests are static.
 * `item`, `rules` and `hears` are declared in each test's details (through
 * `declared()`), never added at run time, so `030` reads them from
 * `playwright test --list` without running a reader.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { declaredTests, testCalls } from "../sr/declared.ts";

/** The run-time writes to annotations in a source, by line. */
export function annotationWrites(source: string): number[] {
  const lines: number[] = [];
  source.split("\n").forEach((line, i) => {
    if (
      /\bannotations\s*\.\s*(push|unshift|splice)\s*\(/.test(line) ||
      /\bannotations\s*(\[[^\]]*\])?\s*=(?!=)/.test(line) ||
      /\.annotations\s*\.\s*length\s*=(?!=)/.test(line)
    )
      lines.push(i + 1);
  });
  return lines;
}

const DIR = "tests/sr";
const FILES = readdirSync(DIR, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith(".ts") && !f.startsWith("mutations"));

describe("022 test 5a: no annotation is added at run time", () => {
  test("no file in tests/sr/ writes to annotations", () => {
    const writes = FILES.flatMap((f) =>
      annotationWrites(readFileSync(path.join(DIR, f), "utf8")).map(
        (l) => `${f}:${l}`,
      ),
    );
    expect(writes).toEqual([]);
  });

  test("the check sees a write (fixture)", () => {
    expect(
      annotationWrites(
        `testInfo.annotations.push({ type: "item", description: "x" });`,
      ),
    ).toEqual([1]);
    expect(
      annotationWrites(`\n test.info().annotations.push({ type: "rules" })`),
    ).toEqual([2]);
    expect(annotationWrites(`info.annotations = [];`)).toEqual([1]);
    expect(
      annotationWrites(`const n = info.annotations.length === 0;`),
    ).toEqual([]);
  });

  test("every test in a .sr.ts file declares item, rules and hears in its details", () => {
    const calls = FILES.filter((f) => f.endsWith(".sr.ts")).flatMap((f) =>
      testCalls(readFileSync(path.join(DIR, f), "utf8")).map((c) => ({
        ...c,
        file: f,
      })),
    );
    const declared = new Set(
      declaredTests().map((t) => `${t.file} › ${t.title}`),
    );
    const bare = calls
      .filter((c) => !declared.has(`${c.file} › ${c.title}`))
      .map((c) => `${c.file} › ${c.title}`);
    expect(calls.length).toBeGreaterThan(0);
    expect(bare).toEqual([]);
  });
});
