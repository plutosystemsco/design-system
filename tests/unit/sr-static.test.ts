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

/**
 * 022aa: the waits in a source that have no bound, as `file:line`. A wait is
 * a Playwright call that waits for the page (`waitFor`, `waitForSelector`,
 * `waitForFunction`, `waitForURL`, `waitForEvent`, `waitForLoadState`,
 * `waitForResponse`, `waitForRequest`), an `expect.poll` or a `toPass`. It
 * is bounded when its arguments name a `timeout` that is not 0. A
 * `waitForTimeout` is a bound in itself. A web-first assertion
 * (`toBeVisible()` and the rest) is bounded by the config's `expect.timeout`
 * (`matrix.test.ts`).
 */
export function unboundedWaits(source: string, file = ""): string[] {
  const call =
    /\.\s*(?:waitFor(?:Selector|Function|URL|Event|LoadState|Response|Request)?|toPass)\s*\(|\bexpect\s*\.\s*poll\s*\(/g;
  const found: string[] = [];
  for (const m of source.matchAll(call)) {
    // The call's arguments: to the parenthesis that closes it, past strings.
    let depth = 1;
    let i = m.index + m[0].length;
    const from = i;
    for (let quote = ""; i < source.length && depth > 0; i++) {
      const c = source[i]!;
      if (quote) {
        if (c === "\\") i++;
        else if (c === quote) quote = "";
      } else if (c === '"' || c === "'" || c === "`") quote = c;
      else if (c === "(") depth++;
      else if (c === ")") depth--;
    }
    const args = source.slice(from, i - 1);
    if (!/\btimeout\b/.test(args) || /\btimeout\s*:\s*0\b/.test(args))
      found.push(`${file}:${source.slice(0, m.index).split("\n").length}`);
  }
  return found;
}

describe("022aa: no screen-reader wait without a bound", () => {
  test("every wait in tests/sr/ has a timeout", () => {
    const found = FILES.flatMap((f) =>
      unboundedWaits(readFileSync(path.join(DIR, f), "utf8"), f),
    );
    expect(found).toEqual([]);
  });

  test("the check sees each form (fixture)", () => {
    expect(unboundedWaits(`await page.getByRole("dialog").waitFor();`)).toEqual(
      [":1"],
    );
    expect(
      unboundedWaits(
        `await menu(page)\n  .first()\n  .waitFor({ state: "attached" });`,
      ),
    ).toEqual([":3"]);
    expect(unboundedWaits(`await x.waitFor({ timeout: 0 });`)).toEqual([":1"]);
    expect(unboundedWaits(`await page.waitForSelector("main");`)).toEqual([
      ":1",
    ]);
    expect(unboundedWaits(`await page.waitForFunction(() => ok());`)).toEqual([
      ":1",
    ]);
    expect(unboundedWaits(`await expect.poll(() => n()).toBe(1);`)).toEqual([
      ":1",
    ]);
    expect(unboundedWaits(`await expect(async () => f()).toPass();`)).toEqual([
      ":1",
    ]);
    expect(
      unboundedWaits(
        `await x.waitFor({ state: "detached", timeout: 2000 });\nawait page.waitForTimeout(900);\nawait expect.poll(() => n(), { timeout: 5_000 }).toBe(1);\nawait x.filter({ hasText: "a (b" }).waitFor({ timeout: WAIT_MS });`,
      ),
    ).toEqual([]);
  });
});
