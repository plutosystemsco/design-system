/**
 * 025 decision 16: the release check's cost step, in `022`'s `Check` shape.
 * It is the gate for runtime freshness (the change review's finding 2(b)):
 * every item's runtime figures must come from one run that is full, not
 * noisy, on the release machine, made with this Bun and this zlib; every
 * size hash and runtime key must equal the report's; and every figure must
 * be within its budget (finding 7). `release-check.ts --before-ci` skips it
 * by name; nothing skips it silently (finding 3).
 */
import {
  budgetWarnings,
  missingBudgets,
  overBudget,
  readBudgets,
} from "./budgets.ts";
import { hashContext, runtimeKeyOf, sizeHash } from "./hash.ts";
import { readReport } from "./report.ts";

export type Check = { ok: boolean; lines: string[] };

/** What `--before-ci` says when it leaves this step out. */
export const SKIPPED_COST =
  "release-check: skipped (--before-ci): the cost run, which the tag's full run on the release machine gives (025 Q3).";

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
  const ctx = hashContext(run.tools.zlib);
  const stale = entries
    .filter(
      ([key, e]) =>
        sizeHash(key, ctx) !== e.hash ||
        runtimeKeyOf(key, report, ctx) !== e.runtimeHash,
    )
    .map(([key]) => key);
  if (stale.length)
    out.push(
      `${stale.length} item(s) have changed since their figures: ${stale.slice(0, 8).join(", ")}; run \`bun run cost --full\``,
    );
  for (const line of [
    ...overBudget(report, budgets),
    ...budgetWarnings(report, budgets),
  ])
    out.push(`over budget: ${line}`);
  for (const line of missingBudgets(report, budgets)) out.push(line);
  return out;
}

/** The cost step as a `Check`. */
export function costCheck(): Check {
  const problems = costReleaseProblems();
  return problems.length
    ? { ok: false, lines: problems.map((p) => `release-check: cost: ${p}.`) }
    : {
        ok: true,
        lines: [
          "release-check: cost: one full, quiet run on the release machine, fresh and within budget.",
        ],
      };
}

if (import.meta.main) {
  const c = costCheck();
  (c.ok ? console.log : console.error)(c.lines.join("\n"));
  process.exit(c.ok ? 0 : 1);
}
