/**
 * 022 test 9, decision 19, criterion 20: the release check's two new checks,
 * as pure functions, over `gh` JSON in the shape `gh run list --json` and
 * `gh run view --json jobs` print (fixtures in `tests/fixtures/ci/`). The
 * expected job names come from `scripts/ci/workflow.ts`'s parse of
 * `matrix.yml`, and in one case of a fixture workflow with another shard
 * count, to show the list follows the file.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { matrixCheck, qualify, type GhRun } from "../../scripts/ci/qualify.ts";
import { ledgerCheck } from "../../scripts/site/release-check.ts";
import {
  jobNames,
  parseWorkflow,
  readWorkflow,
} from "../../scripts/ci/workflow.ts";
import type { LedgerLine } from "../ledger.ts";

const HEAD = "0123456789abcdef0123456789abcdef01234567";
const OTHER = "fedcba9876543210fedcba9876543210fedcba98";
const NAMES = jobNames(readWorkflow(".github/workflows/matrix.yml"));
const view = (f: string) =>
  JSON.parse(readFileSync(`tests/fixtures/ci/${f}`, "utf8")).jobs;

const run = (o: Partial<GhRun> = {}): GhRun => ({
  databaseId: 101,
  event: "push",
  headSha: HEAD,
  headBranch: "release/0.13.0",
  status: "completed",
  conclusion: "success",
  displayTitle: "matrix",
  attempt: 1,
  ...o,
});

describe("022 test 9: a run qualifies for HEAD", () => {
  test("no run: refused", () => {
    const q = qualify([], {}, HEAD, NAMES);
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("no matrix push run");
  });
  test("a failed run: refused", () => {
    const q = qualify(
      [run({ conclusion: "failure" })],
      { 101: view("gh-run-view-red.json") },
      HEAD,
      NAMES,
    );
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("conclusion is failure");
  });
  test("a pull-request run on the same commit: refused", () => {
    const q = qualify(
      [run({ event: "pull_request" })],
      { 101: view("gh-run-view-green.json") },
      HEAD,
      NAMES,
    );
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("event is pull_request");
  });
  test("a mutation run whose gate succeeded: refused", () => {
    const q = qualify(
      [
        run({
          displayTitle: "matrix (mutation main)",
          event: "workflow_dispatch",
        }),
      ],
      { 101: view("gh-run-view-mutation.json") },
      HEAD,
      NAMES,
    );
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("matrix (mutation main)");
  });
  test("a run for another commit: refused", () => {
    const q = qualify(
      [run({ headSha: OTHER })],
      { 101: view("gh-run-view-green.json") },
      HEAD,
      NAMES,
    );
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("headSha");
  });
  test("a run with a skipped job: refused", () => {
    const q = qualify(
      [run()],
      { 101: view("gh-run-view-skipped.json") },
      HEAD,
      NAMES,
    );
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("browsers (chromium, 1) is skipped");
  });
  test("a green run on attempt 2 qualifies, and its attempt is printed", () => {
    const q = qualify(
      [run({ attempt: 2 })],
      { 101: view("gh-run-view-green.json") },
      HEAD,
      NAMES,
    );
    expect(q.run?.databaseId).toBe(101);
    expect(q.reasons.join("\n")).toContain("attempt 2");
  });
  test("a green run qualifies", () => {
    const q = qualify(
      [run()],
      { 101: view("gh-run-view-green.json") },
      HEAD,
      NAMES,
    );
    expect(q.run?.databaseId).toBe(101);
  });
  test("the expected job names follow the workflow file: six shards make another list", () => {
    const text = readFileSync(".github/workflows/matrix.yml", "utf8")
      .replace("shard: [1, 2, 3, 4, 5, 6, 7, 8]", "shard: [1, 2, 3, 4, 5, 6]")
      .replace(
        "--shard=${{ matrix.shard }}/8",
        "--shard=${{ matrix.shard }}/6",
      );
    const six = jobNames(parseWorkflow(text));
    expect(six).toHaveLength(NAMES.length - 6);
    // The eight-shard run's jobs no longer match the file's list.
    const q = qualify(
      [run()],
      { 101: view("gh-run-view-green.json") },
      HEAD,
      six,
    );
    expect(q.run).toBeUndefined();
    expect(q.reasons.join("\n")).toContain("browsers (chromium, 7)");
  });
});

describe("022 test 9: the ledger and gh", () => {
  const line: LedgerLine = {
    file: "axe.spec.ts",
    title: "x",
    where: { project: "webkit-light" },
    expect: { axeRule: "color-contrast" },
    finding: "f",
    change: "022a",
  };
  test("a non-empty ledger: refused", () => {
    expect(ledgerCheck([line]).ok).toBe(false);
    expect(ledgerCheck([line]).lines.join("\n")).toContain("022a");
    expect(ledgerCheck([]).ok).toBe(true);
  });
  test("gh missing: refused, and says so", async () => {
    const r = await matrixCheck(HEAD, NAMES, async () => {
      throw Object.assign(new Error("spawn gh ENOENT"), { code: "ENOENT" });
    });
    expect(r.ok).toBe(false);
    expect(r.lines.join("\n")).toContain(
      "gh is not installed or not signed in",
    );
  });
  test("gh signed out: refused, and says so", async () => {
    const r = await matrixCheck(HEAD, NAMES, async () => ({
      code: 1,
      stdout: "",
      stderr: "To get started with GitHub CLI, please run:  gh auth login",
    }));
    expect(r.ok).toBe(false);
    expect(r.lines.join("\n")).toContain(
      "gh is not installed or not signed in",
    );
  });
  test("a green run through gh: passes, printing its id and attempt", async () => {
    const r = await matrixCheck(HEAD, NAMES, async (args) =>
      args[1] === "list"
        ? { code: 0, stdout: JSON.stringify([run({ attempt: 2 })]), stderr: "" }
        : {
            code: 0,
            stdout: JSON.stringify({ jobs: view("gh-run-view-green.json") }),
            stderr: "",
          },
    );
    expect(r.ok).toBe(true);
    expect(r.lines.join("\n")).toContain("101");
    expect(r.lines.join("\n")).toContain("attempt 2");
  });
});
