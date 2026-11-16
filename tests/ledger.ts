/**
 * 022 decision 16: the fault ledger's fixture, shared by the browser suite
 * (`tests/test.ts`) and the screen-reader suite (`tests/sr/fixtures.ts`).
 *
 * For a test with a line in `tests/fault-ledger.ts`, in that line's `where`:
 *
 * - before the test, it is marked `test.fail()`. A ledgered test that now
 *   passes turns the run red: its line must go.
 * - after the test, every error must match the line's `expect`. If one does
 *   not, the test's expected status is set back to "passed" and it carries a
 *   `ledger-mismatch` annotation: "a ledgered test failed for a reason the
 *   ledger does not name". The test is then red, and `report` also fails the
 *   run on the annotation (decision 14).
 *
 * Setting `testInfo.expectedStatus` after `use()` is undocumented. It works
 * in Playwright 1.64.1 by its source: test-scoped fixtures are torn down
 * before the worker sends the expected status to the runner. Criterion 19's
 * third case is re-run whenever Playwright is bumped.
 */
import type { TestInfo } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LEDGER } from "./fault-ledger.ts";

export type Where =
  { project: string } | { reader: "voiceover" | "nvda"; browser: string };

/** The failure a line accepts: one of the three. */
export type Expect =
  /** A substring of every error's message. */
  | { error: string }
  /** The one axe rule id the reported violations name. */
  | { axeRule: string }
  /** The one rule fault id (`tests/sr/rules.ts`) the test's faults hold. */
  | { fault: string };

export type LedgerLine = {
  /** The spec file, relative to its suite's folder. */
  file: string;
  /** The title path below the file: describes and title, joined by " › ". */
  title: string;
  where: Where;
  expect: Expect;
  finding: string;
  /** The small change that fixes it, such as "022a". */
  change: string;
};

/** Where a running test is: its project, or its reader and browser. */
export type Context = { project: string } | { reader: string; browser: string };

export const ANNOTATION_LEDGER = "ledger";
export const ANNOTATION_MISMATCH = "ledger-mismatch";

const strip = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, "");

/** The line for a test, if the ledger holds one for it here. */
export function lineFor(
  lines: LedgerLine[],
  file: string,
  title: string,
  ctx: Context,
): LedgerLine | undefined {
  return lines.find((l) => {
    if (l.file !== file || l.title !== title) return false;
    if ("project" in l.where)
      return "project" in ctx && ctx.project === l.where.project;
    return (
      "reader" in ctx &&
      ctx.reader === l.where.reader &&
      ctx.browser === l.where.browser
    );
  });
}

/** The axe rule ids a failure's message reports, as `axe.spec.ts` words them. */
export function axeRules(message: string): string[] {
  const ids = new Set<string>();
  for (const m of strip(message).matchAll(
    /"([a-z][a-z0-9-]*) \((?:minor|moderate|serious|critical|null)\):/g,
  ))
    ids.add(m[1]!);
  return [...ids];
}

/**
 * Why a ledgered test's failure does not match its line, or null when it
 * does. `faults` are a screen-reader test's rule faults (`faults.json`).
 */
export function mismatch(
  line: LedgerLine,
  errors: { message?: string }[],
  faults: { rule: string }[] = [],
): string | null {
  if (!errors.length) return null; // a pass: test.fail() already turns it red
  const ex = line.expect;
  if ("error" in ex) {
    const bad = errors.find((e) => !strip(e.message ?? "").includes(ex.error));
    if (bad)
      return `an error does not contain ${JSON.stringify(ex.error)}: ${strip(bad.message ?? "").split("\n")[0]}`;
    // The review's finding 3: a list compared with toEqual holds the named
    // failure and maybe a new one. Every received entry must be the named one.
    for (const e of errors) {
      const extra = receivedEntries(e.message ?? "").filter(
        (r) => !r.includes(ex.error),
      );
      if (extra.length)
        return `the failure also holds ${extra.map((r) => JSON.stringify(r)).join(", ")}`;
    }
    return null;
  }
  if ("axeRule" in ex) {
    const ids = errors.flatMap((e) => axeRules(e.message ?? ""));
    if (!ids.includes(ex.axeRule))
      return `axe did not report ${ex.axeRule}${ids.length ? `; it reported ${ids.join(", ")}` : ""}`;
    const other = ids.filter((i) => i !== ex.axeRule);
    return other.length ? `axe also reported ${other.join(", ")}` : null;
  }
  const rules = [...new Set(faults.map((f) => f.rule))];
  if (!rules.includes(ex.fault))
    return `no ${ex.fault} fault${rules.length ? `; the faults were ${rules.join(", ")}` : "; the test failed before its rules ran"}`;
  // X0 beside the named fault is its consequence (L3 has nothing to judge
  // once L1 fails); alone it is a set-up failure, caught above.
  const other = rules.filter((r) => r !== ex.fault && r !== "X0");
  return other.length ? `other faults too: ${other.join(", ")}` : null;
}

/**
 * The entries of a string list a failed `toEqual` received, read from its
 * diff (`+   "…",`) or its `Received: [...]` line. Empty for any other
 * failure.
 */
export function receivedEntries(message: string): string[] {
  const m = strip(message);
  const diff = [...m.matchAll(/^\+\s+"((?:\\.|[^"\\])*)",?\s*$/gm)].map((x) =>
    JSON.parse(`"${x[1]}"`),
  );
  if (diff.length) return diff;
  const line = m.match(/^Received:\s+(\[.*\])\s*$/m);
  if (!line) return [];
  try {
    const list = JSON.parse(line[1]!);
    return Array.isArray(list) ? list.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** A screen-reader test's faults, from its `faults.json` attachment. */
function faultsOf(info: TestInfo): { rule: string }[] {
  const a = info.attachments.find((x) => x.name === "faults.json");
  if (!a) return [];
  try {
    const text = a.body
      ? a.body.toString()
      : a.path
        ? readFileSync(a.path, "utf8")
        : "[]";
    return JSON.parse(text);
  } catch {
    return [];
  }
}

/** The test's file relative to its suite's folder, and its title path. */
export function identify(info: TestInfo): { file: string; title: string } {
  const file = path
    .relative(info.project.testDir, info.file)
    .split(path.sep)
    .join("/");
  return { file, title: info.titlePath.slice(1).join(" › ") };
}

/**
 * The ledger fixture, automatic, for `test.extend()`. `where` says which
 * project, or which reader and browser, the running test is in.
 */
export function ledgerFixture(
  where: (info: TestInfo) => Context,
  lines: LedgerLine[] = LEDGER,
) {
  const run = async (
    {}: object,
    use: (r: void) => Promise<void>,
    info: TestInfo,
  ): Promise<void> => {
    const { file, title } = identify(info);
    const line = lineFor(lines, file, title, where(info));
    if (!line) return use();
    info.annotations.push({
      type: ANNOTATION_LEDGER,
      description: `${line.change}: ${line.finding}`,
    });
    info.fail();
    await use();
    const why = mismatch(line, info.errors, faultsOf(info));
    if (why) {
      info.expectedStatus = "passed";
      info.annotations.push({
        type: ANNOTATION_MISMATCH,
        description: `a ledgered test failed for a reason the ledger does not name (${line.change}): ${why}`,
      });
    }
  };
  return [run, { auto: true }] as [typeof run, { auto: true }];
}
