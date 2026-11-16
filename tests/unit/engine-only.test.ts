/**
 * 022 test 7a, criterion 5: every engine-only skip is counted.
 *
 * `tests/e2e/engines.ts` declares the only three ways a browser test may skip
 * by engine or project: `onlyIn`, `notIn` and `onlyProjects`. Each call has
 * exactly one entry in `ENGINE_ONLY` (`tests/e2e/engine-only.ts`), with the
 * same helper and arguments, and each entry has one call. The data file
 * imports nothing, so `030`'s report code can read it without Playwright.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ENGINE_ONLY, type EngineOnly } from "../e2e/engine-only.ts";
import { check } from "./engine-only-check.ts";

const E2E = "tests/e2e";
const HELPERS = ["onlyIn", "notIn", "onlyProjects", "adaptsIn"] as const;

function e2eSources(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of readdirSync(E2E, { recursive: true }).map(String)) {
    if (!f.endsWith(".ts")) continue;
    if (f === "engines.ts" || f === "engine-only.ts") continue;
    out[f] = readFileSync(path.join(E2E, f), "utf8");
  }
  return out;
}

const DATA = readFileSync(path.join(E2E, "engine-only.ts"), "utf8");

describe("022 test 7a: ENGINE_ONLY and the calls in step", () => {
  test("every call of onlyIn, notIn and onlyProjects has one entry, and every entry one call", () => {
    expect(check(e2eSources(), ENGINE_ONLY, DATA)).toEqual([]);
  });

  test("engine-only.ts imports nothing", () => {
    expect(DATA).not.toMatch(/^\s*import\b/m);
  });

  test("the count per helper (the landing notes cite it)", () => {
    const count = Object.fromEntries(
      HELPERS.map((h) => [h, ENGINE_ONLY.filter((e) => e.helper === h).length]),
    );
    console.log(`ENGINE_ONLY: ${JSON.stringify(count)}`);
    expect(Object.values(count).reduce((a, b) => a + b, 0)).toBe(
      ENGINE_ONLY.length,
    );
  });

  test("018's forced-colours skip is onlyProjects over the three light projects", () => {
    const fc = ENGINE_ONLY.filter((e) => e.file === "forced-colors.spec.ts");
    expect(fc).toHaveLength(1);
    expect(fc[0]!.helper).toBe("onlyProjects");
    expect(fc[0]!.projects).toEqual([
      "chromium-light",
      "firefox-light",
      "webkit-light",
    ]);
    expect(fc[0]!.reason).toBe("light schemes only");
  });
});

describe("022 test 7a: the check fails where it should (fixtures)", () => {
  const entry: EngineOnly = {
    file: "x.spec.ts",
    title: "a test",
    helper: "onlyIn",
    engine: "chromium",
    reason: "CDP: Emulation.setEmulatedMedia",
  };
  const src = `onlyIn("chromium", "CDP: Emulation.setEmulatedMedia");`;

  test("a listed call passes", () => {
    expect(check({ "x.spec.ts": src }, [entry], "export const A = 1;")).toEqual(
      [],
    );
  });

  test("an unlisted notIn call fails", () => {
    const faults = check(
      {
        "x.spec.ts": `${src}\nnotIn("webkit", "no clipboard-read permission");`,
      },
      [entry],
      "",
    );
    expect(faults.join("\n")).toContain("notIn");
    expect(faults).toHaveLength(1);
  });

  test("an onlyProjects naming an unknown project fails", () => {
    const faults = check(
      { "y.spec.ts": `onlyProjects(["light"], "light only");` },
      [
        {
          file: "y.spec.ts",
          title: "",
          helper: "onlyProjects",
          projects: ["light"],
          reason: "light only",
        },
      ],
      "",
    );
    expect(faults.join("\n")).toContain("light is not a declared project");
  });

  test("an import added to engine-only.ts fails", () => {
    const faults = check(
      {},
      [],
      `import { test } from "@playwright/test";\nexport const ENGINE_ONLY = [];`,
    );
    expect(faults.join("\n")).toContain("imports something");
  });

  test("an entry with no call fails, and a ruling path must exist", () => {
    const faults = check(
      {},
      [{ ...entry, ruling: "context/specifications/none.md" }],
      "",
    );
    expect(faults.join("\n")).toContain("no onlyIn call");
    expect(faults.join("\n")).toContain("does not exist");
  });

  test("notIn and onlyIn must name one of the three engines", () => {
    const faults = check(
      { "x.spec.ts": `notIn("safari", "r");` },
      [
        {
          file: "x.spec.ts",
          title: "t",
          helper: "notIn",
          engine: "safari" as never,
          reason: "r",
        },
      ],
      "",
    );
    expect(faults.join("\n")).toContain("must name one of");
  });
});
