/**
 * 022 decision 19: `gate`, the run's one status. It reads the jobs' results
 * and the mode from `env`, never from expressions pasted into the shell.
 * Its decisions are pure (`decide`, `mirror` over an injected API); the
 * `gh api` calls are a thin shell at the bottom.
 *
 * - full run: passes only if every job succeeded. A skipped job fails it.
 * - mutation run (`MUTATE` is "true"): passes only if build, voiceover, nvda
 *   and report succeeded, and browsers, checks and perf were skipped.
 * - a pull request from this repository (`SAME_REPO_PR` is "true"): every
 *   other job was skipped by design; gate mirrors the newest push run of the
 *   pull request's head commit, waiting for it up to 95 minutes, the most
 *   its 100-minute job allows. A first full push run can take longer (30
 *   jobs against 20 slots, macOS queueing); then this gate fails while the
 *   push run is fine, and re-running it reads the finished run.
 * - `MUTATE` empty (every push) means false.
 */

export type Result = "success" | "failure" | "cancelled" | "skipped";
export type Needs = Record<string, { result: Result; outputs?: object }>;

export type Decision = {
  mode: "full" | "mutation" | "mirror";
  ok: boolean;
  reasons: string[];
};

const MUTATION_RAN = ["build", "voiceover", "nvda", "report"];
const MUTATION_SKIPPED = ["browsers", "checks", "perf"];

export function decide(env: {
  needs: Needs;
  mutate?: string;
  sameRepoPr?: string;
}): Decision {
  if (env.sameRepoPr === "true")
    return { mode: "mirror", ok: false, reasons: ["mirrors the push run"] };
  const jobs = Object.entries(env.needs);
  if (env.mutate === "true") {
    const reasons: string[] = [];
    for (const j of MUTATION_RAN)
      if (env.needs[j]?.result !== "success")
        reasons.push(
          `${j} is ${env.needs[j]?.result ?? "missing"}; a mutation run needs it to succeed`,
        );
    for (const j of MUTATION_SKIPPED)
      if (env.needs[j]?.result !== "skipped")
        reasons.push(
          `${j} is ${env.needs[j]?.result ?? "missing"}; a mutation run skips it`,
        );
    return { mode: "mutation", ok: reasons.length === 0, reasons };
  }
  const reasons = jobs
    .filter(([, n]) => n.result !== "success")
    .map(([j, n]) => `${j} is ${n.result}`);
  if (!jobs.length) reasons.push("no jobs reached gate");
  return { mode: "full", ok: reasons.length === 0, reasons };
}

export type ApiRun = {
  id: number;
  status: string;
  conclusion: string | null;
  head_sha: string;
  event: string;
  run_attempt?: number;
  created_at: string;
};

export type Api = {
  runs(
    headSha: string,
  ): Promise<{ total_count: number; workflow_runs: ApiRun[] }>;
  jobs(id: number): Promise<{
    jobs: { name: string; status: string; conclusion: string | null }[];
  }>;
};

/** A same-repository pull request's verdict: its head commit's newest push run's gate. */
export async function mirror(
  headSha: string,
  api: Api,
  opts: { sleep: (ms: number) => Promise<void>; polls: number },
): Promise<{ ok: boolean; reasons: string[] }> {
  for (let i = 0; i < opts.polls; i++) {
    const { workflow_runs } = await api.runs(headSha);
    const push = workflow_runs
      .filter((r) => r.event === "push" && r.head_sha === headSha)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    const run = push[0];
    if (!run)
      return {
        ok: false,
        reasons: [
          "no push run for this commit; push it to `release/**` or `main`, or open the pull request from a fork",
        ],
      };
    if (run.status !== "completed") {
      await opts.sleep(60_000);
      continue;
    }
    const { jobs } = await api.jobs(run.id);
    const gate = jobs.find((j) => j.name === "gate");
    const ok = run.conclusion === "success" && gate?.conclusion === "success";
    return {
      ok,
      reasons: [
        `push run ${run.id} (attempt ${run.run_attempt ?? 1}) ${run.conclusion}; its gate ${gate?.conclusion ?? "is missing"}`,
      ],
    };
  }
  return {
    ok: false,
    reasons: [
      `the push run for ${headSha} did not complete within ${opts.polls} minutes`,
    ],
  };
}

async function gh(path: string): Promise<unknown> {
  const p = Bun.spawn(["gh", "api", path], {
    stdout: "pipe",
    stderr: "inherit",
  });
  const out = await new Response(p.stdout).text();
  if ((await p.exited) !== 0) throw new Error(`gh api ${path} failed`);
  return JSON.parse(out);
}

if (import.meta.main) {
  const e = process.env;
  const d = decide({
    needs: JSON.parse(e.NEEDS ?? "{}"),
    mutate: e.MUTATE,
    sameRepoPr: e.SAME_REPO_PR,
  });
  let ok = d.ok;
  let reasons = d.reasons;
  if (d.mode === "mirror") {
    const repo = e.GH_REPO!;
    const api: Api = {
      runs: (sha) =>
        gh(
          `repos/${repo}/actions/workflows/matrix.yml/runs?head_sha=${sha}&event=push`,
        ) as never,
      jobs: (id) =>
        gh(`repos/${repo}/actions/runs/${id}/jobs?per_page=100`) as never,
    };
    const m = await mirror(e.HEAD_SHA!, api, {
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      polls: 95,
    });
    ok = m.ok;
    reasons = m.reasons;
  }
  console.log(`gate (${d.mode}): ${ok ? "pass" : "fail"}`);
  for (const r of reasons) console.log(`  - ${r}`);
  process.exit(ok ? 0 : 1);
}
