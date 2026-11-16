/**
 * 022 decision 19: the one parser of `matrix.yml`, shared by
 * `tests/unit/workflow.test.ts`, the release check and `030`'s status. It
 * expands each job's matrix into the job names GitHub shows, so a change to
 * the shard count changes the release check's expected list with it.
 */
import { readFileSync } from "node:fs";

export type Step = {
  name?: string;
  uses?: string;
  run?: string;
  if?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
};

export type Job = {
  name?: string;
  if?: string;
  needs?: string | string[];
  "runs-on": string;
  "timeout-minutes"?: number;
  strategy?: { "fail-fast"?: boolean; matrix: Record<string, unknown[]> };
  steps?: Step[];
  env?: Record<string, string>;
};

export type Workflow = {
  name: string;
  "run-name"?: string;
  // `on` holds the triggers; YAML 1.2 keeps it a string key.
  on: Record<string, any>;
  permissions?: Record<string, string>;
  concurrency?: Record<string, any>;
  jobs: Record<string, Job>;
};

export function parseWorkflow(text: string): Workflow {
  return Bun.YAML.parse(text) as Workflow;
}

export function readWorkflow(path: string): Workflow {
  return parseWorkflow(readFileSync(path, "utf8"));
}

/** A matrix's combinations, in GitHub's order: the first key varies slowest. */
function combinations(matrix: Record<string, unknown[]>): unknown[][] {
  const keys = Object.keys(matrix).filter(
    (k) => k !== "include" && k !== "exclude",
  );
  let out: unknown[][] = [[]];
  for (const k of keys)
    out = out.flatMap((c) => (matrix[k] ?? []).map((v) => [...c, v]));
  return out;
}

/** Every job name a run of this workflow has, matrices expanded: `browsers (chromium, 1)`. */
export function jobNames(wf: Workflow): string[] {
  return Object.entries(wf.jobs).flatMap(([id, job]) => {
    const name = job.name ?? id;
    const m = job.strategy?.matrix;
    if (!m) return [name];
    return combinations(m).map((c) => `${name} (${c.join(", ")})`);
  });
}

/** The screen-reader jobs' reader and browser pairs, from their matrices. */
export function readerPairs(
  wf: Workflow,
): { reader: string; browser: string }[] {
  return ["voiceover", "nvda"].flatMap((reader) =>
    ((wf.jobs[reader]?.strategy?.matrix.browser ?? []) as string[]).map(
      (browser) => ({ reader, browser }),
    ),
  );
}
