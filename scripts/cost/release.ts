/**
 * 025 decision 16: the release check's cost step. Every item's runtime
 * figures must come from one run that is full, not noisy, on the release
 * machine, at the commit being tagged or with hashes equal to the report's,
 * made with this Bun and this zlib.
 */
import { execFileSync } from "node:child_process";
import { readBudgets } from "./budgets.ts";
import { hashContext, runtimeHash, sizeHash } from "./hash.ts";
import { readReport } from "./report.ts";

/** The reasons the tag must wait; empty when the cost step passes. */
export function costReleaseProblems(): string[] {
  const report = readReport();
  const budgets = readBudgets();
  const out: string[] = [];
  const entries = Object.entries(report.items).flatMap(([name, e]) => [
    [name, e] as const,
    ...Object.entries(e.cases).map(([k, c]) => [`${name}.${k}`, c] as const),
  ]);
  const runs = new Set(entries.map(([, e]) => e.run));
  if (runs.size !== 1)
    out.push(
      `the runtime figures come from ${runs.size} runs; run \`bun run cost --full\` on the release machine`,
    );
  const id = [...runs][0]!;
  const run = report.runs[id];
  if (!run) return [...out, `run ${id} is not in the report`];
  if (!run.full) out.push(`run ${id} is not --full`);
  if (run.noisy) out.push(`run ${id} is noisy`);
  if (run.machine.model !== budgets.machine)
    out.push(
      `run ${id} is on ${run.machine.model}, not the release machine, ${budgets.machine}`,
    );
  if (run.tools.bun !== Bun.version)
    out.push(`run ${id} used Bun ${run.tools.bun}; this is ${Bun.version}`);
  if (run.tools.zlib !== process.versions.zlib)
    out.push(
      `run ${id} used zlib ${run.tools.zlib}; this is ${process.versions.zlib}`,
    );
  const head = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
  if (run.commit !== head) {
    const ctx = hashContext(run.tools.zlib);
    const stale = entries
      .filter(
        ([key, e]) =>
          sizeHash(key, ctx) !== e.hash ||
          runtimeHash(key, ctx) !== e.runtimeHash,
      )
      .map(([key]) => key);
    if (stale.length)
      out.push(
        `run ${id} was at ${run.commit}, and ${stale.length} item(s) have changed since: ${stale.slice(0, 8).join(", ")}`,
      );
  }
  return out;
}

/** Prints the step's result; false when the tag must wait. */
export function costReleaseOk(): boolean {
  // Q3 (the owner): `bun run test` holds only the report's hashes and
  // budgets (`tests/unit/cost.test.ts`); one full run gates the tag. The
  // unit suite runs this script (`headers.test.ts`), so under the test
  // runner the step says so and steps aside.
  if (process.env.NODE_ENV === "test") {
    console.log(
      "release-check: cost: not checked under the test runner; tests/unit/cost.test.ts holds the report fresh and within budget.",
    );
    return true;
  }
  const problems = costReleaseProblems();
  for (const p of problems) console.error(`release-check: cost: ${p}.`);
  if (!problems.length)
    console.log(
      "release-check: cost: one full, quiet run on the release machine.",
    );
  return problems.length === 0;
}

if (import.meta.main) process.exit(costReleaseOk() ? 0 : 1);
