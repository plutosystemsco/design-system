/**
 * 022 test 8, decision 19, criterion 20a: `gate.ts`'s table, over the
 * `needs` context GitHub passes and, for a same-repository pull request,
 * over `gh api` JSON in the shape GitHub returns (fixtures written to the
 * documented schema, `tests/fixtures/ci/`).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { decide, mirror, type Api, type Needs } from "../../scripts/ci/gate.ts";

const JOBS = [
  "build",
  "checks",
  "browsers",
  "perf",
  "voiceover",
  "nvda",
  "report",
];
const needs = (result: string, over: Record<string, string> = {}): Needs =>
  Object.fromEntries(
    JOBS.map((j) => [j, { result: (over[j] ?? result) as never, outputs: {} }]),
  );
const fixture = (f: string) =>
  JSON.parse(readFileSync(`tests/fixtures/ci/${f}`, "utf8"));

describe("022 test 8: a full run", () => {
  test("all success passes", () => {
    expect(
      decide({ needs: needs("success"), mutate: "", sameRepoPr: "false" }).ok,
    ).toBe(true);
  });
  for (const r of ["failure", "cancelled", "skipped"])
    test(`a ${r} job fails it`, () => {
      const d = decide({
        needs: needs("success", { perf: r }),
        mutate: "false",
        sameRepoPr: "false",
      });
      expect(d.ok).toBe(false);
      expect(d.reasons.join("\n")).toContain("perf");
    });
  test("an empty MUTATE is a full run", () => {
    const d = decide({
      needs: needs("success", { browsers: "skipped" }),
      mutate: "",
      sameRepoPr: "",
    });
    expect(d.mode).toBe("full");
    expect(d.ok).toBe(false);
  });
});

describe("022 test 8: a mutation run", () => {
  const skipped = { browsers: "skipped", checks: "skipped", perf: "skipped" };
  test("passes only with report successful and browsers, checks and perf skipped", () => {
    expect(
      decide({
        needs: needs("success", skipped),
        mutate: "true",
        sameRepoPr: "false",
      }).ok,
    ).toBe(true);
  });
  test("a failed report fails it", () => {
    expect(
      decide({
        needs: needs("success", { ...skipped, report: "failure" }),
        mutate: "true",
        sameRepoPr: "false",
      }).ok,
    ).toBe(false);
  });
  test("browsers run on a mutation run fails it", () => {
    expect(
      decide({
        needs: needs("success", { checks: "skipped", perf: "skipped" }),
        mutate: "true",
        sameRepoPr: "false",
      }).ok,
    ).toBe(false);
  });
  test("a failed voiceover job fails it", () => {
    expect(
      decide({
        needs: needs("success", { ...skipped, voiceover: "failure" }),
        mutate: "true",
        sameRepoPr: "false",
      }).ok,
    ).toBe(false);
  });
});

describe("022 test 8, criterion 20a: a same-repository pull request mirrors its push run", () => {
  const SHA = "0123456789abcdef0123456789abcdef01234567";
  const run = (id: number, status: string, conclusion: string | null) => ({
    id,
    status,
    conclusion,
    head_sha: SHA,
    event: "push",
    run_attempt: 1,
    created_at: "2026-11-16T10:00:00Z",
  });
  const api = (
    runs: unknown[][],
    jobs: Record<number, unknown>,
  ): Api & { calls: number } => {
    let i = 0;
    return {
      calls: 0,
      async runs() {
        this.calls++;
        return {
          total_count: 1,
          workflow_runs: runs[Math.min(i++, runs.length - 1)],
        } as never;
      },
      async jobs(id: number) {
        return jobs[id] as never;
      },
    };
  };
  const fast = { sleep: async () => {}, polls: 90 };

  test("its mode is mirror, and every other job was skipped by design", () => {
    const d = decide({
      needs: needs("skipped"),
      mutate: "",
      sameRepoPr: "true",
    });
    expect(d.mode).toBe("mirror");
  });
  test("a green push run passes", async () => {
    const r = await mirror(
      SHA,
      api([[run(7, "completed", "success")]], {
        7: fixture("api-run-jobs-green.json"),
      }),
      fast,
    );
    expect(r.ok).toBe(true);
    expect(r.reasons.join("\n")).toContain("7");
  });
  test("a red push run fails", async () => {
    const r = await mirror(
      SHA,
      api([[run(7, "completed", "failure")]], {
        7: fixture("api-run-jobs-red.json"),
      }),
      fast,
    );
    expect(r.ok).toBe(false);
  });
  test("no push run fails with its message", async () => {
    const r = await mirror(SHA, api([[]], {}), fast);
    expect(r.ok).toBe(false);
    expect(r.reasons.join("\n")).toContain(
      "no push run for this commit; push it to `release/**` or `main`, or open the pull request from a fork",
    );
  });
  test("a push run still in progress is waited for", async () => {
    const a = api(
      [
        [run(7, "in_progress", null)],
        [run(7, "in_progress", null)],
        [run(7, "completed", "success")],
      ],
      { 7: fixture("api-run-jobs-green.json") },
    );
    const r = await mirror(SHA, a, fast);
    expect(r.ok).toBe(true);
    expect(a.calls).toBe(3);
  });
  test("one that never completes within the limit fails", async () => {
    const r = await mirror(SHA, api([[run(7, "in_progress", null)]], {}), {
      sleep: async () => {},
      polls: 5,
    });
    expect(r.ok).toBe(false);
    expect(r.reasons.join("\n")).toContain("did not complete");
  });
  test("the newest push run is the one read", async () => {
    const older = {
      ...run(6, "completed", "success"),
      created_at: "2026-11-16T09:00:00Z",
    };
    const r = await mirror(
      SHA,
      api([[older, run(7, "completed", "failure")]], {
        6: fixture("api-run-jobs-green.json"),
        7: fixture("api-run-jobs-red.json"),
      }),
      fast,
    );
    expect(r.ok).toBe(false);
  });
});
