/**
 * 022 test 6, decision 15, criterion 16: the mutation patches stay
 * applicable, and each set's `expected.json` is what the patch table, the
 * tests' declarations and the reader pairs derive. It writes nothing.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { declaredTests, type Declared } from "../sr/declared.ts";
import {
  derive,
  mutationLines,
  patchFiles,
  PAIRS,
  witnessFaults,
  type Expected,
  type Patch,
} from "../sr/mutations/derive.ts";
import { PATCHES, SETS } from "../sr/mutations/table.ts";

const DIR = "tests/sr/mutations";
const TESTS = declaredTests();

const apply = (args: string[]) =>
  Bun.spawnSync(["git", "apply", "--check", ...args], { stderr: "pipe" });

describe("022 test 6: the patches apply", () => {
  for (const set of SETS) {
    const patches = PATCHES.filter((p) => p.set === set);
    for (const p of patches)
      test(`${set}/${p.patch}: git apply --check`, () => {
        const r = apply([path.join(DIR, set, p.patch)]);
        expect(r.stderr.toString()).toBe("");
        expect(r.exitCode).toBe(0);
      });
    test(`${set}: the whole set applies together`, () => {
      const r = apply(patches.map((p) => path.join(DIR, set, p.patch)));
      expect(r.stderr.toString()).toBe("");
      expect(r.exitCode).toBe(0);
    });
  }

  test("every patch file is in the table, and every table row has its file", () => {
    const files = SETS.flatMap((s) =>
      readdirSync(path.join(DIR, s))
        .filter((f) => f.endsWith(".patch"))
        .map((f) => `${s}/${f}`),
    ).sort();
    expect(files).toEqual(PATCHES.map((p) => `${p.set}/${p.patch}`).sort());
  });

  test("the main set has eight patches (022's seven and 026's); no two patches in a set touch the same file", () => {
    expect(PATCHES.filter((p) => p.set === "main")).toHaveLength(8); // 022's seven, and 026's toast-alert
    for (const set of SETS) {
      const seen = new Map<string, string>();
      for (const p of PATCHES.filter((x) => x.set === set))
        for (const f of patchFiles(
          readFileSync(path.join(DIR, set, p.patch), "utf8"),
        )) {
          expect(seen.get(f) ?? p.patch).toBe(p.patch);
          seen.set(f, p.patch);
        }
    }
  });

  test("each patch touches only its item's source, under src/lib/registry/", () => {
    for (const p of PATCHES) {
      const files = patchFiles(
        readFileSync(path.join(DIR, p.set, p.patch), "utf8"),
      );
      expect(files.length).toBeGreaterThan(0);
      for (const f of files)
        expect(f.startsWith("src/lib/registry/")).toBe(true);
    }
  });
});

describe("022 test 6: expected.json is derived", () => {
  for (const set of SETS)
    test(`${set}: expected.json equals its derivation; every patch has its witness under every pair`, () => {
      const file = JSON.parse(
        readFileSync(path.join(DIR, set, "expected.json"), "utf8"),
      ) as Expected;
      const derived = derive(set, PATCHES, TESTS, file.notProvable);
      expect(file).toEqual(derived);
      expect(witnessFaults(set, PATCHES, TESTS, file.notProvable)).toEqual([]);
      expect(derived.expected.length).toBeGreaterThan(0);
    });

  test("notProvable entries carry a pair and a run id", () => {
    for (const set of SETS) {
      const file = JSON.parse(
        readFileSync(path.join(DIR, set, "expected.json"), "utf8"),
      ) as Expected;
      for (const n of file.notProvable) {
        expect(
          PAIRS.some((p) => p.reader === n.reader && p.browser === n.browser),
        ).toBe(true);
        expect(n.run).toMatch(/^\d+$/);
      }
    }
  });
});

describe("the review's finding 1: a mutation run's expected failures are ledger lines", () => {
  for (const set of SETS)
    test(`${set}: one line per expected test and pair, each naming its fault`, () => {
      const file = JSON.parse(
        readFileSync(path.join(DIR, set, "expected.json"), "utf8"),
      ) as Expected;
      const lines = PAIRS.flatMap((p) =>
        mutationLines(file, p.reader, p.browser),
      );
      expect(lines).toHaveLength(file.expected.length);
      for (const l of lines) {
        expect(l.expect.fault).toMatch(/^(L|F|O|T|C)/);
        expect(file.expected).toContainEqual(
          expect.objectContaining({
            file: l.file,
            title: l.title,
            reader: l.where.reader,
            browser: l.where.browser,
            fault: l.expect.fault,
          }),
        );
      }
    });

  test("fixtures.ts hands them to the ledger fixture under MUTATE=true", () => {
    const src = readFileSync("tests/sr/fixtures.ts", "utf8");
    expect(src).toContain('process.env.MUTATE === "true"');
    expect(src).toContain("[...LEDGER, ...MUTATION_LINES]");
  });
});

describe("022 test 6: the derivation itself (fixture tables)", () => {
  const t = (
    file: string,
    item: string,
    rules: string[],
    hears: string[],
    title = "t",
    parts: string[] = [],
  ): Declared => ({
    file,
    title,
    item,
    rules,
    hears,
    parts,
  });

  test("patches 1 and 4 with only the form blocks in common: the witness rule fails", () => {
    const patches: Patch[] = [
      {
        set: "main",
        patch: "1.patch",
        target: "alert",
        fault: "L1",
        witness: { file: "sign-in.sr.ts", title: "t" },
      },
      {
        set: "main",
        patch: "4.patch",
        target: "error-summary",
        fault: "L1",
        witness: { file: "sign-in.sr.ts", title: "t" },
      },
    ];
    const tests = [
      t("sign-in.sr.ts", "sign-in", ["L1"], ["alert", "error-summary"]),
    ];
    const faults = witnessFaults("main", patches, tests, []);
    expect(faults.length).toBeGreaterThan(0);
    expect(faults.join("\n")).toContain("another patch");
  });

  test("a part-qualified patch, toast:assertive with L1, reaches the assertive and the whole-item tests only", () => {
    const patches: Patch[] = [
      {
        set: "main",
        patch: "toast-alert.patch",
        target: "toast:assertive",
        fault: "L1",
        witness: { file: "toast.sr.ts", title: "S2" },
      },
    ];
    const parts = ["assertive", "polite", "focus"];
    const tests = [
      t("toast.sr.ts", "toast", ["L1"], ["toast:assertive"], "S2", parts),
      t("toast.sr.ts", "toast", ["L1"], ["toast:polite"], "S1", parts),
      t("toast.sr.ts", "toast", ["L1"], ["toast"], "S0", parts),
    ];
    const titles = [
      ...new Set(
        derive("main", patches, tests, []).expected.map((e) => e.title),
      ),
    ].sort();
    expect(titles).toEqual(["S0", "S2"]);
  });

  test("a patch that names only an item reaches every hears entry of that item, whole or part", () => {
    const patches: Patch[] = [
      {
        set: "main",
        patch: "x.patch",
        target: "toast",
        fault: "L1",
        witness: { file: "toast.sr.ts", title: "S1" },
      },
    ];
    const tests = [
      t("toast.sr.ts", "toast", ["L1"], ["toast:polite"], "S1", ["polite"]),
    ];
    expect(derive("main", patches, tests, []).expected).toHaveLength(
      PAIRS.length,
    );
  });

  test("a hears part not declared for its item fails", () => {
    const patches: Patch[] = [];
    const tests = [
      t("toast.sr.ts", "toast", ["L1"], ["toast:loud"], "S9", ["polite"]),
    ];
    expect(() => derive("main", patches, tests, [])).toThrow(/not declared/);
  });

  test("a test whose rules lack the patch's fault is not expected to fail", () => {
    const patches: Patch[] = [
      {
        set: "main",
        patch: "x.patch",
        target: "sheet",
        fault: "O2",
        witness: { file: "sheet.sr.ts", title: "a" },
      },
    ];
    const tests = [t("sheet.sr.ts", "sheet", ["O1"], ["sheet"], "a")];
    expect(derive("main", patches, tests, []).expected).toEqual([]);
    expect(witnessFaults("main", patches, tests, []).join("\n")).toContain(
      "no expected entry",
    );
  });
});
