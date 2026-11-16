/**
 * 022 test 3, criteria 6 and 7: `matrix.yml` and its bootstrap, parsed with
 * `Bun.YAML` (present in Bun 1.3.14, checked in build step 1) through
 * `scripts/ci/workflow.ts`, the parser the release check also uses.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  jobNames,
  readWorkflow,
  readerPairs,
  type Job,
  type Workflow,
} from "../../scripts/ci/workflow.ts";

const wf = readWorkflow(".github/workflows/matrix.yml");
const boot = readWorkflow("scripts/ci/bootstrap-matrix.yml");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const LABELS = ["ubuntu-24.04", "macos-26", "windows-2025"];
const TEST_JOBS = ["browsers", "perf", "voiceover", "nvda"];

const steps = (j: Job) => j.steps ?? [];
const runs = (j: Job) =>
  steps(j)
    .map((s) => s.run ?? "")
    .filter(Boolean);
const all = (w: Workflow) => Object.entries(w.jobs);

describe("022 test 3: matrix.yml", () => {
  test("every uses: is a 40-hex SHA with a # v comment", () => {
    const text = readFileSync(".github/workflows/matrix.yml", "utf8");
    const uses = [...text.matchAll(/uses:\s*(\S+)(.*)$/gm)];
    expect(uses.length).toBeGreaterThan(0);
    for (const [, ref, rest] of uses) {
      expect(ref).toMatch(/^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/);
      expect(rest).toMatch(/^\s+# v\d/);
    }
  });

  test("every install is frozen and runs no dependency's install script", () => {
    // The Linux rehearsal (022 Q9): a grammar's node-gyp build fails where
    // no prebuild fits. No script is needed; the grammars load as WebAssembly.
    const installs = all(wf).flatMap(([, j]) =>
      runs(j).filter((r) => r.startsWith("bun install")),
    );
    expect(installs.length).toBeGreaterThan(0);
    for (const r of installs)
      expect(r).toBe("bun install --frozen-lockfile --ignore-scripts");
  });

  test("every runs-on is one of the three exact labels", () => {
    for (const [, j] of all(wf)) expect(LABELS).toContain(j["runs-on"]);
  });

  test("bun-version equals packageManager's", () => {
    const want = pkg.packageManager.replace(/^bun@/, "");
    const versions = all(wf).flatMap(([, j]) =>
      steps(j)
        .filter((s) => s.uses?.startsWith("oven-sh/setup-bun@"))
        .map((s) => s.with?.["bun-version"]),
    );
    expect(versions.length).toBe(Object.keys(wf.jobs).length);
    for (const v of versions) expect(String(v)).toBe(want);
  });

  test("the triggers: push and pull_request on main and release/**; workflow_dispatch with mutate and set", () => {
    expect(wf.on.push.branches).toEqual(["main", "release/**"]);
    expect(wf.on.pull_request.branches).toEqual(["main", "release/**"]);
    const inputs = wf.on.workflow_dispatch.inputs;
    expect(inputs.mutate.type).toBe("boolean");
    expect(inputs.mutate.default).toBe(false);
    expect(inputs.set.type).toBe("choice");
    expect(inputs.set.options).toEqual(["main", "double-read"]);
    expect(inputs.set.default).toBe("main");
  });

  test("permissions are exactly contents: read and actions: read", () => {
    expect(wf.permissions).toEqual({ contents: "read", actions: "read" });
  });

  test("the run name marks a mutation run", () => {
    expect(wf["run-name"]).toBe(
      "${{ inputs.mutate && format('matrix (mutation {0})', inputs.set) || 'matrix' }}",
    );
  });

  test("the concurrency group is decision 5's expression; only pull requests cancel", () => {
    const group = String(wf.concurrency!.group).replace(/\s+/g, " ").trim();
    expect(group).toBe(
      "matrix-${{ github.event_name == 'pull_request' && format('pr-{0}', github.ref) || format('{0}-{1}', github.sha, inputs.mutate && format('mutation-{0}', inputs.set) || 'full') }}",
    );
    expect(wf.concurrency!["cancel-in-progress"]).toBe(
      "${{ github.event_name == 'pull_request' }}",
    );
  });

  test("build and checks skip same-repository pull requests; checks skips a mutation run", () => {
    const skip =
      "github.event_name != 'pull_request' || github.event.pull_request.head.repo.fork";
    expect(wf.jobs.build!.if).toContain(skip);
    expect(wf.jobs.checks!.if).toContain(skip);
    expect(wf.jobs.checks!.if).toContain("!inputs.mutate");
    for (const j of ["browsers", "perf"])
      expect(wf.jobs[j]!.if).toContain("!inputs.mutate");
  });

  test("site is site.tar, from build and .svelte-kit/output, with if-no-files-found: error", () => {
    const b = wf.jobs.build!;
    expect(runs(b)).toContain("tar -cf site.tar build .svelte-kit/output");
    const up = steps(b).find((s) =>
      s.uses?.startsWith("actions/upload-artifact@"),
    )!;
    expect(up.with).toMatchObject({
      name: "site",
      path: "site.tar",
      "if-no-files-found": "error",
    });
  });

  test("every test job extracts the site and checks both trees before testing; none builds", () => {
    for (const name of TEST_JOBS) {
      const j = wf.jobs[name]!;
      expect(j.needs).toBe("build");
      const r = runs(j);
      const check = r.findIndex(
        (x) =>
          x.includes("tar -xf site.tar") &&
          x.includes("test -f build/index.html") &&
          x.includes("test -f .svelte-kit/output/server/manifest.js"),
      );
      expect(check).toBeGreaterThanOrEqual(0);
      const testStep = r.findIndex((x) => /playwright test|test:sr/.test(x));
      expect(testStep).toBeGreaterThan(check);
      expect(r.some((x) => x.includes("bun run build"))).toBe(false);
      const env = steps(j).find((s) =>
        /playwright test|test:sr/.test(s.run ?? ""),
      )!.env;
      expect(env?.E2E_PREBUILT).toBe("1");
    }
  });

  test("eight shards per engine; browsers has timeout-minutes: 45", () => {
    const b = wf.jobs.browsers!;
    expect(b.strategy!.matrix.shard).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(b.strategy!.matrix.engine).toEqual([
      "chromium",
      "firefox",
      "webkit",
    ]);
    expect(runs(b).find((r) => r.includes("--shard="))).toContain("/8");
    expect(b["timeout-minutes"]).toBe(45);
  });

  test("no run: step pastes ${{ toJSON( or ${{ inputs.; no step runs bun x or npx", () => {
    for (const [, j] of all(wf))
      for (const r of runs(j)) {
        expect(r).not.toContain("${{ toJSON(");
        expect(r).not.toContain("${{ inputs.");
        expect(r).not.toMatch(/\bbun x\b|\bbunx\b|\bnpx\b/);
      }
  });

  test("each reader job sets its own SR_READER on its test step", () => {
    for (const [job, reader] of [
      ["voiceover", "voiceover"],
      ["nvda", "nvda"],
    ] as const) {
      const s = steps(wf.jobs[job]!).filter((x) =>
        (x.run ?? "").includes("test:sr"),
      );
      expect(s).toHaveLength(1);
      expect(s[0]!.env?.SR_READER).toBe(reader);
    }
    expect(readerPairs(wf)).toEqual([
      { reader: "voiceover", browser: "webkit" },
      { reader: "voiceover", browser: "chromium" },
      { reader: "nvda", browser: "chromium" },
      { reader: "nvda", browser: "firefox" },
    ]);
  });

  test("gate needs every other job and runs if: always()", () => {
    const g = wf.jobs.gate!;
    expect(g.if).toBe("${{ always() }}");
    expect([g.needs].flat().sort()).toEqual(
      Object.keys(wf.jobs)
        .filter((j) => j !== "gate")
        .sort(),
    );
  });

  test("the expanded job names: 5 plain jobs, 24 browsers, 2 voiceover, 2 nvda", () => {
    const names = jobNames(wf);
    expect(names).toHaveLength(33);
    expect(names).toContain("browsers (firefox, 3)");
    expect(names).toContain("voiceover (webkit)");
    expect(names).toContain("nvda (firefox)");
    expect(names.filter((n) => !n.includes("("))).toEqual([
      "build",
      "checks",
      "perf",
      "report",
      "gate",
    ]);
  });
});

describe("022 test 3: the bootstrap for main", () => {
  test("only workflow_dispatch, the same inputs, no push; one job that prints a line", () => {
    expect(Object.keys(boot.on)).toEqual(["workflow_dispatch"]);
    expect(boot.on.workflow_dispatch.inputs).toEqual(
      wf.on.workflow_dispatch.inputs,
    );
    expect(boot.name).toBe("matrix");
    expect(boot["run-name"]).toBe(wf["run-name"]);
    expect(boot.permissions).toEqual({ contents: "read" });
    expect(Object.keys(boot.jobs)).toEqual(["bootstrap"]);
    expect(runs(boot.jobs.bootstrap!)).toEqual([
      'echo "The full matrix lives on the release branch. Dispatch on that ref."',
    ]);
  });
});
