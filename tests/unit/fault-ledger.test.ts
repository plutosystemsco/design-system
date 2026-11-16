/**
 * 022 test 7, decision 16: each line of the fault ledger names a small-change
 * specification under `context/specifications/`, a test that exists, exactly
 * one `where`, and a non-empty `expect`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { LEDGER } from "../fault-ledger.ts";
import { mismatch, receivedEntries, type LedgerLine } from "../ledger.ts";

describe("the ledger's matcher (the review's finding 3)", () => {
  const line = (expect: LedgerLine["expect"]): LedgerLine => ({
    file: "x.spec.ts",
    title: "t",
    where: { project: "firefox-light" },
    expect,
    finding: "f",
    change: "022b",
  });
  // The diff Playwright prints for a failed toEqual of a string list.
  const diff = (...received: string[]) =>
    [
      "expect(received).toEqual(expected) // deep equality",
      "",
      "- Expected  - 1",
      `+ Received  + ${received.length + 2}`,
      "",
      "- Array []",
      "+ Array [",
      ...received.map((r) => `+   ${JSON.stringify(r)},`),
      "+ ]",
    ].join("\n");

  test("a list holding only the named failure matches", () => {
    const l = line({ error: "/components/button/: color-contrast" });
    expect(
      receivedEntries(diff("/components/button/: color-contrast")),
    ).toEqual(["/components/button/: color-contrast"]);
    expect(
      mismatch(l, [{ message: diff("/components/button/: color-contrast") }]),
    ).toBeNull();
  });

  test("a list holding the named failure and a new one does not", () => {
    const l = line({ error: "/components/button/: color-contrast" });
    const why = mismatch(l, [
      {
        message: diff(
          "/components/button/: color-contrast",
          "/components/button/: link-name",
        ),
      },
    ]);
    expect(why).toContain("link-name");
  });

  test("a fault line accepts X0 beside its fault, and not alone", () => {
    const l = line({ fault: "L1" });
    expect(
      mismatch(l, [{ message: "e" }], [{ rule: "L1" }, { rule: "X0" }]),
    ).toBeNull();
    expect(mismatch(l, [{ message: "e" }], [{ rule: "X0" }])).toContain(
      "no L1",
    );
    expect(
      mismatch(l, [{ message: "e" }], [{ rule: "L1" }, { rule: "O2" }]),
    ).toContain("O2");
  });
});

const SPECS = "context/specifications";
const BROWSER_PROJECTS = [
  "chromium-light",
  "chromium-dark",
  "firefox-light",
  "firefox-dark",
  "webkit-light",
  "webkit-dark",
  "perf",
];
/** 022 decision 10: the four reader and browser pairs. */
const PAIRS: Record<string, string[]> = {
  voiceover: ["webkit", "chromium"],
  nvda: ["chromium", "firefox"],
};

/** The small-change specification a ledger line names, or why it does not. */
function changeFault(change: string): string | null {
  if (!/^\d{3}[a-z]+$/.test(change))
    return `change ${JSON.stringify(change)} is not a small change's number, such as 022a`;
  const file = readdirSync(SPECS).find((f) => f.startsWith(`${change}-`));
  if (!file) return `no specification ${change}-*.md under ${SPECS}`;
  const text = readFileSync(path.join(SPECS, file), "utf8");
  if (!/^- \*\*Kind:\*\* small change\b/im.test(text))
    return `${file} is not of kind "small change"`;
  return null;
}

/** The shape faults of one line, all but whether its test exists. */
export function lineFaults(line: LedgerLine): string[] {
  const faults: string[] = [];
  const at = `${line.file} › ${line.title}`;
  const where = line.where as Record<string, unknown>;
  const keys = Object.keys(where).sort().join(",");
  if (keys === "project") {
    if (!BROWSER_PROJECTS.includes(where.project as string))
      faults.push(`${at}: ${where.project} is not a browser project`);
  } else if (keys === "browser,reader") {
    const ok = PAIRS[where.reader as string]?.includes(where.browser as string);
    if (!ok)
      faults.push(
        `${at}: ${where.reader} with ${where.browser} is not a pair the matrix runs`,
      );
  } else
    faults.push(
      `${at}: where must name exactly one project, or one reader and browser pair`,
    );
  const ex = Object.entries(line.expect as Record<string, unknown>);
  if (ex.length !== 1 || !["error", "axeRule", "fault"].includes(ex[0]![0]))
    faults.push(`${at}: expect must be exactly one of error, axeRule or fault`);
  else if (typeof ex[0]![1] !== "string" || !(ex[0]![1] as string).trim())
    faults.push(`${at}: expect is empty`);
  if (!line.finding?.trim()) faults.push(`${at}: no finding`);
  const c = changeFault(line.change);
  if (c) faults.push(`${at}: ${c}`);
  const dir = line.file.endsWith(".sr.ts") ? "tests/sr" : "tests/e2e";
  if (!existsSync(path.join(dir, line.file)))
    faults.push(`${at}: no file ${dir}/${line.file}`);
  return faults;
}

/** Every test title path the listing holds, as `file › describe › title`. */
function listed(config: string, project: string): Set<string> {
  const r = Bun.spawnSync(
    [
      "bun",
      "--bun",
      "playwright",
      "test",
      "-c",
      config,
      "--list",
      "--reporter=json",
      `--project=${project}`,
    ],
    { env: { ...process.env, CI: "" } },
  );
  const out = new Set<string>();
  const json = JSON.parse(r.stdout.toString());
  const walk = (
    s: {
      title: string;
      specs?: { title: string; tests: unknown[] }[];
      suites?: unknown[];
    },
    trail: string[],
  ) => {
    for (const sp of s.specs ?? []) out.add([...trail, sp.title].join(" › "));
    for (const x of (s.suites ?? []) as (typeof s)[])
      walk(x, [...trail, x.title]);
  };
  for (const s of json.suites ?? []) walk(s, [s.title]);
  return out;
}

describe("022 test 7: the fault ledger", () => {
  test("every line has a small change, one where, a non-empty expect, a finding and a file", () => {
    expect(LEDGER.flatMap(lineFaults)).toEqual([]);
  });

  test("no two lines name one test in one place (the review's write-in 7)", () => {
    const keys = LEDGER.map(
      (l) => `${l.file} › ${l.title} @ ${JSON.stringify(l.where)}`,
    );
    expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
  });

  test("every line's test exists in the listing of its project or browser", () => {
    if (!LEDGER.length) return;
    const lists = new Map<string, Set<string>>();
    const missing: string[] = [];
    for (const line of LEDGER) {
      const sr = "reader" in line.where;
      const config = sr ? "playwright.sr.config.ts" : "playwright.config.ts";
      // build-output.spec.ts reads build/ to list its tests; the other
      // browser projects list the same titles without it.
      const named = sr
        ? (line.where as { browser: string }).browser
        : (line.where as { project: string }).project;
      const project =
        named === "chromium-light" && line.file !== "build-output.spec.ts"
          ? "chromium-dark"
          : named;
      const key = `${config} ${project}`;
      if (!lists.has(key)) lists.set(key, listed(config, project));
      if (!lists.get(key)!.has(`${line.file} › ${line.title}`))
        missing.push(`${line.file} › ${line.title} (${project})`);
    }
    expect(missing).toEqual([]);
  }, 120_000);
});

describe("022 test 7: the line check fails where it should (fixtures)", () => {
  const good: LedgerLine = {
    file: "axe.spec.ts",
    title: "at 1280 › axe finds 0 violations on /",
    where: { project: "webkit-light" },
    expect: { axeRule: "color-contrast" },
    finding: "fixture",
    change: "022a",
  };
  test("two wheres fail", () => {
    const f = lineFaults({
      ...good,
      where: {
        project: "webkit-light",
        reader: "nvda",
        browser: "firefox",
      } as never,
    });
    expect(f.join("\n")).toContain("exactly one project");
  });
  test("an empty expect fails", () => {
    expect(
      lineFaults({ ...good, expect: { error: " " } }).join("\n"),
    ).toContain("expect is empty");
    expect(lineFaults({ ...good, expect: {} as never }).join("\n")).toContain(
      "exactly one of",
    );
  });
  test("a change that is not a small change's number fails", () => {
    expect(lineFaults({ ...good, change: "022" }).join("\n")).toContain(
      "not a small change",
    );
    expect(lineFaults({ ...good, change: "999z" }).join("\n")).toContain(
      "no specification",
    );
  });
  test("a pair the matrix does not run fails", () => {
    const f = lineFaults({
      ...good,
      where: { reader: "voiceover", browser: "firefox" },
    });
    expect(f.join("\n")).toContain("not a pair");
  });
});
