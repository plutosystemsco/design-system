/**
 * 022 decision 3: the check that holds `ENGINE_ONLY` and the calls of the
 * three skip helpers in step. Used by `engine-only.test.ts`.
 */
import { existsSync } from "node:fs";
import type { EngineOnly } from "../e2e/engine-only.ts";

export const E2E = "tests/e2e";
export const ENGINES = ["chromium", "firefox", "webkit"];
const PROJECTS = [
  "chromium-light",
  "chromium-dark",
  "firefox-light",
  "firefox-dark",
  "webkit-light",
  "webkit-dark",
  "perf",
];
const HELPERS = ["onlyIn", "notIn", "onlyProjects"] as const;

/** One call found in source, its arguments read where they are literals. */
type Call = {
  file: string;
  helper: (typeof HELPERS)[number];
  /** The arguments, when every one is a literal; otherwise undefined. */
  args?: unknown[];
};

/** The text between a call's parentheses, from `open` (just past "("). */
function argText(src: string, open: number): string {
  let depth = 1;
  let i = open;
  let quote: string | null = null;
  for (; i < src.length && depth > 0; i++) {
    const c = src[i]!;
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
  }
  return src.slice(open, i - 1);
}

/** Literal arguments only: strings, and arrays of strings. */
function literals(text: string): unknown[] | undefined {
  if (/\$\{/.test(text)) return undefined;
  if (
    !/^[\s,]*(?:("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\[[^\]]*\])[\s,]*)+$/s.test(
      text,
    )
  )
    return undefined;
  try {
    return JSON.parse(
      `[${text
        .replace(/'/g, '"')
        .replace(/,\s*([\]}])/g, "$1")
        .replace(/,\s*$/, "")}]`,
    );
  } catch {
    return undefined;
  }
}

/** Every call of the three helpers in `sources`, by file. */
export function findCalls(sources: Record<string, string>): Call[] {
  const calls: Call[] = [];
  for (const [file, raw] of Object.entries(sources)) {
    // Comments name the helpers too; only code calls them.
    const src = raw
      .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
      .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
    const re = /\b(onlyIn|notIn|onlyProjects)\s*\(/g;
    for (const m of src.matchAll(re)) {
      // Skip the declarations and the imports.
      const before = src.slice(Math.max(0, m.index! - 20), m.index!);
      if (/function\s+$|[.\w]$/.test(before)) continue;
      const text = argText(src, m.index! + m[0].length);
      calls.push({
        file,
        helper: m[1] as Call["helper"],
        args: literals(text),
      });
    }
  }
  return calls;
}

/** The faults in a listing: entries without calls, calls without entries, bad names. */
export function check(
  sources: Record<string, string>,
  entries: EngineOnly[],
  dataSource: string,
): string[] {
  const faults: string[] = [];
  if (/^\s*import\b|\brequire\s*\(/m.test(dataSource))
    faults.push("engine-only.ts imports something; it must hold data alone");
  for (const e of entries) {
    const at = `${e.file} › ${e.title || "(the file)"}`;
    if (!HELPERS.includes(e.helper))
      faults.push(`${at}: unknown helper ${e.helper}`);
    if (!e.reason?.trim()) faults.push(`${at}: no reason`);
    if (e.helper === "onlyProjects") {
      if (!e.projects?.length)
        faults.push(`${at}: onlyProjects names no project`);
      for (const p of e.projects ?? [])
        if (!PROJECTS.includes(p))
          faults.push(`${at}: ${p} is not a declared project`);
      if (e.engine)
        faults.push(`${at}: onlyProjects takes projects, not an engine`);
    } else {
      if (!e.engine || !ENGINES.includes(e.engine))
        faults.push(
          `${at}: ${e.helper} must name one of ${ENGINES.join(", ")}`,
        );
      if (e.projects)
        faults.push(`${at}: ${e.helper} takes an engine, not projects`);
    }
    if (e.ruling && !existsSync(e.ruling))
      faults.push(`${at}: its ruling ${e.ruling} does not exist`);
  }
  // Calls and entries, matched one to one by file and helper, and by
  // arguments wherever the call's arguments are literals.
  const calls = findCalls(sources);
  const left = [...entries];
  const argsOf = (e: EngineOnly) =>
    JSON.stringify([
      e.helper === "onlyProjects" ? e.projects : e.engine,
      e.reason,
    ]);
  const literal = calls.filter((c) => c.args);
  const other = calls.filter((c) => !c.args);
  for (const c of [...literal, ...other]) {
    const i = left.findIndex(
      (e) =>
        e.file === c.file &&
        e.helper === c.helper &&
        (!c.args || argsOf(e) === JSON.stringify(c.args.slice(0, 2))),
    );
    if (i < 0)
      faults.push(
        `${c.file}: a ${c.helper}(${c.args ? JSON.stringify(c.args).slice(1, -1) : "…"}) call has no ENGINE_ONLY entry`,
      );
    else left.splice(i, 1);
  }
  for (const e of left)
    faults.push(
      `${e.file} › ${e.title || "(the file)"}: an ENGINE_ONLY entry with no ${e.helper} call`,
    );
  return faults;
}
