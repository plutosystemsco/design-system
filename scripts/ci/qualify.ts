/**
 * 022 decision 19: whether a `matrix` run qualifies for a commit, as a pure
 * function, with the `gh` calls in a thin shell (`matrixCheck`). `030`'s
 * status imports the same test.
 *
 * A run qualifies only if all of these hold: `event` is `push` (a
 * pull-request run tested a merge commit); `headSha` is the commit; it is
 * completed with success; `displayTitle` is exactly `matrix`, never
 * `matrix (mutation …)`; and every job succeeded, none skipped, with the
 * job names exactly those `matrix.yml` declares at the commit
 * (`scripts/ci/workflow.ts`).
 */

export type GhRun = {
  databaseId: number;
  event: string;
  headSha: string;
  headBranch: string;
  status: string;
  conclusion: string;
  displayTitle: string;
  attempt: number;
};

export type GhJob = { name: string; status?: string; conclusion: string };

/** Why one run does not qualify, or nothing if it does. */
export function disqualify(
  run: GhRun,
  jobs: GhJob[] | undefined,
  head: string,
  expected: string[],
): string[] {
  const out: string[] = [];
  if (run.event !== "push") out.push(`event is ${run.event}, not push`);
  if (run.headSha !== head)
    out.push(`headSha is ${run.headSha}, not HEAD ${head}`);
  if (run.status !== "completed") out.push(`status is ${run.status}`);
  if (run.conclusion !== "success") out.push(`conclusion is ${run.conclusion}`);
  if (run.displayTitle !== "matrix")
    out.push(`displayTitle is "${run.displayTitle}", not "matrix"`);
  if (!jobs) {
    out.push("its jobs could not be read");
    return out;
  }
  for (const j of jobs)
    if (j.conclusion !== "success")
      out.push(`job ${j.name} is ${j.conclusion}`);
  const names = new Set(jobs.map((j) => j.name));
  for (const n of expected) if (!names.has(n)) out.push(`job ${n} is missing`);
  for (const n of names)
    if (!expected.includes(n)) out.push(`job ${n} is not in matrix.yml`);
  // A skipped job, said in the words a reader looks for.
  return out.map((r) => r.replace(/^job (.+) is skipped$/, "$1 is skipped"));
}

/** The first qualifying run among the candidates, and why each other failed. */
export function qualify(
  runs: GhRun[],
  jobs: Record<number, GhJob[]>,
  head: string,
  expected: string[],
): { run?: GhRun; reasons: string[] } {
  if (!runs.length)
    return { reasons: [`no matrix push run exists for ${head}`] };
  const reasons: string[] = [];
  for (const r of runs) {
    const why = disqualify(r, jobs[r.databaseId], head, expected);
    if (!why.length) {
      reasons.push(
        `run ${r.databaseId}, attempt ${r.attempt}, qualifies (${r.headBranch})`,
      );
      return { run: r, reasons };
    }
    reasons.push(
      `run ${r.databaseId} (attempt ${r.attempt}): ${why.join("; ")}`,
    );
  }
  return { reasons };
}

export type Gh = (
  args: string[],
) => Promise<{ code: number; stdout: string; stderr: string }>;

export const realGh: Gh = async (args) => {
  const p = Bun.spawn(["gh", ...args], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr] = await Promise.all([
    new Response(p.stdout).text(),
    new Response(p.stderr).text(),
  ]);
  return { code: await p.exited, stdout, stderr };
};

/** The release check's matrix step: a qualifying push run of `head`, through `gh`. */
export async function matrixCheck(
  head: string,
  expected: string[],
  gh: Gh = realGh,
): Promise<{ ok: boolean; lines: string[] }> {
  const missing = {
    ok: false,
    lines: [
      "release-check: gh is not installed or not signed in, so no green matrix run can be shown. It never passes on missing evidence.",
    ],
  };
  let list;
  try {
    list = await gh([
      "run",
      "list",
      "--workflow",
      "matrix.yml",
      "--commit",
      head,
      "--event",
      "push",
      "--json",
      "databaseId,event,headSha,headBranch,status,conclusion,displayTitle,attempt",
    ]);
  } catch {
    return missing;
  }
  if (list.code !== 0) {
    if (/auth login|not logged|authenticat/i.test(list.stderr)) return missing;
    if (/workflow matrix\.yml not found/i.test(list.stderr))
      return {
        ok: false,
        lines: [
          `release-check: no matrix run qualifies for HEAD: GitHub has no matrix.yml run yet (${list.stderr.trim()}).`,
        ],
      };
    return {
      ok: false,
      lines: [`release-check: gh run list failed: ${list.stderr.trim()}`],
    };
  }
  const runs = JSON.parse(list.stdout || "[]") as GhRun[];
  const jobs: Record<number, GhJob[]> = {};
  for (const r of runs) {
    const v = await gh(["run", "view", String(r.databaseId), "--json", "jobs"]);
    if (v.code === 0) jobs[r.databaseId] = JSON.parse(v.stdout).jobs;
  }
  const q = qualify(runs, jobs, head, expected);
  return {
    ok: !!q.run,
    lines: q.run
      ? [
          `release-check: matrix run ${q.run.databaseId}, attempt ${q.run.attempt}, is green for HEAD.`,
          ...q.reasons.slice(0, -1).map((r) => `  passed over: ${r}`),
        ]
      : [
          "release-check: no matrix run qualifies for HEAD:",
          ...q.reasons.map((r) => `  - ${r}`),
        ],
  };
}
