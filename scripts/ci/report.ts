/**
 * 022 decision 14: the `report` job's work, after `merge-reports` wrote
 * `matrix-report/report.json`:
 *
 * - the job summary: totals per configuration, every flaky test, every
 *   ledgered test and whether it failed as its line says, and the time each
 *   configuration's tests took;
 * - `matrix-report/sr-logs/<reader>-<browser>/<item>.json`: every
 *   screen-reader test's phrases, windows and faults;
 * - exit 1 if any test carries a `ledger-mismatch` annotation;
 * - on a mutation run, the comparison of every screen-reader test's faults
 *   with the set's `expected.json` (decision 15), exit 1 on any difference.
 *
 * The record functions are pure; the file reading is at the bottom.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
} from "node:fs";
import path from "node:path";
import { verdict, type Expected } from "../../tests/sr/mutations/derive.ts";

type Attachment = {
  name: string;
  contentType?: string;
  path?: string;
  body?: string;
};
type Result = {
  status: string;
  duration: number;
  retry: number;
  attachments?: Attachment[];
};
type JsonTest = {
  projectName: string;
  status: "expected" | "unexpected" | "flaky" | "skipped";
  annotations?: { type: string; description?: string }[];
  results: Result[];
};
type JsonSpec = {
  title: string;
  file: string;
  tags?: string[];
  tests: JsonTest[];
};
type JsonSuite = {
  title: string;
  file?: string;
  specs?: JsonSpec[];
  suites?: JsonSuite[];
};

/** One test in one configuration: a browser project, or a reader and browser. */
export type Record_ = {
  file: string;
  title: string;
  project: string;
  reader?: string;
  status: JsonTest["status"];
  annotations: { type: string; description?: string }[];
  duration: number;
  last?: Result;
};

/** Flatten the merged report into records, title paths below the file. */
export function records(report: { suites?: JsonSuite[] }): Record_[] {
  const out: Record_[] = [];
  const walk = (s: JsonSuite, trail: string[]) => {
    for (const sp of s.specs ?? [])
      for (const t of sp.tests) {
        const tags = sp.tags ?? [];
        const reader = tags
          .map((x) => x.replace(/^@/, ""))
          .find((x) => x.startsWith("reader-"))
          ?.slice("reader-".length);
        out.push({
          file: path.basename(sp.file),
          title: [...trail, sp.title].join(" › "),
          project: t.projectName,
          reader,
          status: t.status,
          annotations: t.annotations ?? [],
          duration: t.results.reduce((n, r) => n + r.duration, 0),
          last: t.results[t.results.length - 1],
        });
      }
    for (const x of s.suites ?? []) walk(x, [...trail, x.title]);
  };
  // The top suites are files; their titles are not part of the title path.
  for (const s of report.suites ?? []) walk(s, []);
  return out;
}

const config = (r: Record_) =>
  r.reader ? `${r.reader}-${r.project}` : r.project;
const at = (r: Record_) => `[${config(r)}] ${r.file} › ${r.title}`;

/** The job summary, as Markdown. */
export function summary(rs: Record_[]): string {
  const by = new Map<string, Record_[]>();
  for (const r of rs) by.set(config(r), [...(by.get(config(r)) ?? []), r]);
  const lines = [
    "## matrix",
    "",
    "| Configuration | Passed | Failed | Flaky | Skipped | Ledgered | Test time |",
    "|---|---|---|---|---|---|---|",
  ];
  for (const [c, list] of [...by].sort()) {
    const n = (s: string) => list.filter((r) => r.status === s).length;
    // A ledgered test that failed as its line says is "expected"; one that
    // did not is "unexpected" and counts as failed (the review's write-in 5).
    const ledgered = list.filter(
      (r) =>
        r.status === "expected" &&
        r.annotations.some((a) => a.type === "ledger"),
    ).length;
    const minutes = (list.reduce((m, r) => m + r.duration, 0) / 60_000).toFixed(
      1,
    );
    lines.push(
      `| ${c} | ${n("expected") - ledgered} | ${n("unexpected")} | ${n("flaky")} | ${n("skipped")} | ${ledgered} | ${minutes} min |`,
    );
  }
  const flaky = rs.filter((r) => r.status === "flaky");
  lines.push(
    "",
    `### Flaky (${flaky.length})`,
    "",
    ...flaky.map((r) => `- ${at(r)}`),
  );
  const ledgered = rs.filter((r) =>
    r.annotations.some((a) => a.type === "ledger"),
  );
  lines.push("", `### Ledgered (${ledgered.length})`, "");
  for (const r of ledgered) {
    const ok =
      r.status === "expected" &&
      !r.annotations.some((a) => a.type === "ledger-mismatch");
    lines.push(
      `- ${ok ? "failed as its line says" : "**did not fail as its line says**"}: ${at(r)}`,
    );
  }
  return lines.join("\n") + "\n";
}

/** Every test that failed for a reason the ledger does not name. */
export function mismatches(rs: Record_[]): string[] {
  return rs
    .filter((r) => r.annotations.some((a) => a.type === "ledger-mismatch"))
    .map(
      (r) =>
        `${at(r)}: ${r.annotations.find((a) => a.type === "ledger-mismatch")!.description}`,
    );
}

function attachment(r: Result | undefined, name: string): unknown {
  const a = r?.attachments?.find((x) => x.name === name);
  if (!a) return undefined;
  try {
    if (a.body)
      return JSON.parse(Buffer.from(a.body, "base64").toString("utf8"));
    if (a.path && existsSync(a.path))
      return JSON.parse(readFileSync(a.path, "utf8"));
  } catch {
    return undefined;
  }
  return undefined;
}

/** The screen-reader records, each with its item, phrases and faults. */
export function srLogs(rs: Record_[]) {
  return rs
    .filter((r) => r.reader)
    .map((r) => ({
      reader: r.reader!,
      browser: r.project,
      item:
        r.annotations.find((a) => a.type === "item")?.description ?? "unknown",
      file: r.file,
      title: r.title,
      status: r.status,
      // The last attempt's own result: on a mutation run an expected
      // failure is ledgered, so its status reads "expected" (finding 1).
      result: r.last?.status ?? "",
      phrases: attachment(r.last, "phrases.json") ?? null,
      faults:
        (attachment(r.last, "faults.json") as { rule: string }[] | undefined) ??
        [],
    }));
}

if (import.meta.main) {
  const report = JSON.parse(readFileSync("matrix-report/report.json", "utf8"));
  const rs = records(report);
  let ok = true;

  const md = summary(rs);
  console.log(md);
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);

  const logs = srLogs(rs);
  const grouped = new Map<string, typeof logs>();
  for (const l of logs) {
    const k = `${l.reader}-${l.browser}/${l.item}.json`;
    grouped.set(k, [...(grouped.get(k) ?? []), l]);
  }
  for (const [k, list] of grouped) {
    const file = path.join("matrix-report/sr-logs", k);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(list, null, 2) + "\n");
  }
  console.log(`sr-logs: ${grouped.size} files`);

  const bad = mismatches(rs);
  if (bad.length) {
    ok = false;
    console.error(
      `ledger-mismatch (${bad.length}):\n${bad.map((b) => `  - ${b}`).join("\n")}`,
    );
  }

  if (process.env.MUTATE === "true") {
    const set = process.env.MUTATION_SET || "main";
    const expected = JSON.parse(
      readFileSync(`tests/sr/mutations/${set}/expected.json`, "utf8"),
    ) as Expected;
    const results = logs.map((l) => ({
      reader: l.reader as "voiceover" | "nvda",
      browser: l.browser,
      file: l.file,
      title: l.title,
      ok: l.result === "passed",
      faults: l.faults.map((f) => f.rule).filter((f) => f !== "X0"),
    }));
    const diff = verdict(expected, results);
    if (diff.length) {
      ok = false;
      console.error(
        `mutation ${set}: ${diff.length} differences from expected.json:\n${diff.map((d) => `  - ${d}`).join("\n")}`,
      );
    } else
      console.log(
        `mutation ${set}: exactly the expected tests failed, each with its fault.`,
      );
  }
  process.exit(ok ? 0 : 1);
}
