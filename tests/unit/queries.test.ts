import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { Language, Parser, Query } from "web-tree-sitter";
import {
  queryFiles,
  treeSitterLanguages,
  type QueryFile,
} from "../../src/lib/registry/lib/highlight/languages.ts";
import { CODE_ROLES } from "../../src/lib/registry/lib/highlight/roles.ts";
import { compileQueries } from "../../src/lib/registry/lib/highlight/tree-sitter.ts";

/**
 * 013 decision 6 and criterion 11: the queries are this system's own. They
 * compile against every grammar that loads them, name only roles, use only
 * predicates the engine implements, and share no run of lines and no
 * pattern beyond the trivial with any grammar's own query files.
 */

const QUERIES = "src/lib/registry/lib/highlight/queries";
const LOCK = "tests/fixtures/highlight/query-lock.json";

await Parser.init({
  locateFile: () => "node_modules/web-tree-sitter/web-tree-sitter.wasm",
});
const ts = await import("web-tree-sitter");

/** The (file, grammar) pairs the table loads, each once. */
const pairs = new Map<string, { file: QueryFile; grammar: string }>();
for (const row of Object.values(treeSitterLanguages))
  for (const file of row.files)
    pairs.set(`${file} ${row.grammar.path}`, {
      file,
      grammar: row.grammar.path,
    });
const languages = new Map<string, Language>();
for (const { grammar } of pairs.values())
  if (!languages.has(grammar))
    languages.set(
      grammar,
      await Language.load(readFileSync(path.join("node_modules", grammar))),
    );
const text = (file: QueryFile) =>
  readFileSync(path.join(QUERIES, `${file}.scm`), "utf8");

// ── Normalisation (decision 6, rules 3 and 4) ─────────────────────────────

/** A query's text with comments removed, outside strings. */
function stripComments(source: string): string {
  let out = "";
  let inString = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i]!;
    if (inString) {
      out += c;
      if (c === "\\") out += source[++i] ?? "";
      else if (c === '"') inString = false;
    } else if (c === '"') {
      inString = true;
      out += c;
    } else if (c === ";") {
      while (i < source.length && source[i] !== "\n") i++;
      out += "\n";
    } else out += c;
  }
  return out;
}

/** Capture names replaced by `@_`, whitespace collapsed. */
function normaliseLine(line: string): string {
  return line
    .replace(/@[\w.-]+/g, "@_")
    .replace(/\s+/g, " ")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")")
    .replace(/\[ /g, "[")
    .replace(/ \]/g, "]")
    .trim();
}

/** The non-empty normalised lines of a query. */
export function normalisedLines(source: string): string[] {
  return stripComments(source)
    .split("\n")
    .map(normaliseLine)
    .filter((l) => l.length > 0);
}

/** A query split into its top-level patterns, each normalised. */
export function topLevelPatterns(source: string): string[] {
  const body = stripComments(source);
  const patterns: string[] = [];
  let i = 0;
  const skipSpace = () => {
    while (i < body.length && /\s/.test(body[i]!)) i++;
  };
  const readString = () => {
    const start = i++;
    while (i < body.length && body[i] !== '"') i += body[i] === "\\" ? 2 : 1;
    i++;
    return body.slice(start, i);
  };
  const readGroup = () => {
    const start = i;
    let depth = 0;
    while (i < body.length) {
      const c = body[i]!;
      if (c === '"') {
        readString();
        continue;
      }
      if (c === "(" || c === "[") depth++;
      if (c === ")" || c === "]") depth--;
      i++;
      if (depth === 0) break;
    }
    return body.slice(start, i);
  };
  for (skipSpace(); i < body.length; skipSpace()) {
    const start = i;
    const c = body[i]!;
    if (c === "(" || c === "[") readGroup();
    else if (c === '"') readString();
    else i++;
    // Trailing quantifiers and captures belong to the pattern.
    for (;;) {
      const at = i;
      skipSpace();
      if (/[*+?]/.test(body[i] ?? "")) i++;
      else if (body[i] === "@") {
        while (i < body.length && /[@\w.-]/.test(body[i]!)) i++;
      } else {
        i = at;
        break;
      }
    }
    patterns.push(normaliseLine(body.slice(start, i)));
  }
  return patterns.filter((p) => p.length > 0);
}

/** One node or a list of fixed words, one capture, at most one #eq? or #any-of? of words. */
export function isTrivial(pattern: string): boolean {
  // Count the captures, not a predicate's references to them.
  const captures = pattern.replace(/\(#[^()]*\)/g, "");
  if ((captures.match(/@_/g) ?? []).length !== 1) return false;
  const words = /^\[(?:"(?:[^"\\]|\\.)*"\s*)+\] @_$/;
  const word = /^"(?:[^"\\]|\\.)*" @_$/;
  const node = /^\([\w.]+\) @_$/;
  const wrapped =
    /^\(\(([\w.]+)\) @_ \(#(?:eq|any-of)\? @_(?: "(?:[^"\\]|\\.)*")+\)\)$/;
  return (
    words.test(pattern) ||
    word.test(pattern) ||
    node.test(pattern) ||
    wrapped.test(pattern)
  );
}

/** Every `queries/*.scm` in every installed grammar package, nested copies included. */
function stockFiles(): string[] {
  const found: string[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > 6 || !existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      let stat;
      try {
        stat = statSync(file);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        if (name === "queries")
          for (const q of readdirSync(file))
            if (q.endsWith(".scm")) found.push(path.join(file, q));
        if (name === "node_modules" || /tree-sitter/.test(name) || depth === 0)
          walk(file, depth + 1);
      }
    }
  };
  walk("node_modules", 0);
  walk("node_modules/@tree-sitter-grammars", 1);
  return [...new Set(found)].sort();
}

const OURS = Object.keys(queryFiles) as QueryFile[];
const STOCK = stockFiles();

describe("the queries (013 decision 6)", () => {
  test("24 files: 21 highlights and 3 locals", () => {
    expect(OURS).toHaveLength(24);
    expect(OURS.filter((f) => f.endsWith(".locals"))).toHaveLength(3);
    for (const file of OURS)
      expect(existsSync(path.join(QUERIES, `${file}.scm`))).toBe(true);
  });

  test("each opens with a comment naming its grammar, the version read and that it is ours", () => {
    for (const file of OURS) {
      const head = text(file).split("\n").slice(0, 6).join("\n");
      expect(head, file).toMatch(/^;/);
      expect(head, file).toMatch(/\d+\.\d+\.\d+/);
      expect(head, file).toContain(
        "written for the Pluto design system; not derived from the grammar's own queries",
      );
    }
  });

  test("27 of 27 (file, grammar) pairs compile", () => {
    expect(pairs.size).toBe(27);
    const failures: string[] = [];
    for (const [key, { file, grammar }] of pairs) {
      try {
        new Query(languages.get(grammar)!, text(file));
      } catch (error) {
        failures.push(`${key}: ${(error as Error).message}`);
      }
    }
    expect(failures).toEqual([]);
  });

  test("every capture is a role (or local.* in a locals file), and every predicate is one the engine implements", () => {
    const roles = new Set<string>(CODE_ROLES);
    const failures: string[] = [];
    for (const [key, { file, grammar }] of pairs) {
      try {
        compileQueries(ts, languages.get(grammar)!, [
          { name: file, text: text(file) },
        ]);
      } catch (error) {
        failures.push(`${key}: ${(error as Error).message}`);
      }
      for (const name of new Query(languages.get(grammar)!, text(file))
        .captureNames)
        if (
          file.endsWith(".locals")
            ? !name.startsWith("local.")
            : !roles.has(name)
        )
          failures.push(`${key}: @${name}`);
    }
    expect(failures).toEqual([]);
  });

  test(`no copied run: 0 runs of 6 normalised lines shared with any of the stock query files`, () => {
    expect(STOCK.length).toBeGreaterThan(20);
    const stock = STOCK.map((file) =>
      normalisedLines(readFileSync(file, "utf8")).join("\n"),
    );
    const runs: string[] = [];
    for (const file of OURS) {
      const lines = normalisedLines(text(file));
      for (let i = 0; i + 6 <= lines.length; i++) {
        const run = lines.slice(i, i + 6).join("\n");
        stock.forEach((s, k) => {
          if (`\n${s}\n`.includes(`\n${run}\n`))
            runs.push(`${file}:${i + 1} in ${STOCK[k]}`);
        });
      }
    }
    expect(runs).toEqual([]);
  });

  test("no copied pattern: at most 15% of our patterns equal a stock pattern, and every one is trivial; the counts printed", () => {
    const stock = new Set(
      STOCK.flatMap((file) => topLevelPatterns(readFileSync(file, "utf8"))),
    );
    let total = 0;
    let equal = 0;
    const nonTrivial: string[] = [];
    const counts: string[] = [];
    for (const file of OURS) {
      const patterns = topLevelPatterns(text(file));
      const same = patterns.filter((p) => stock.has(p));
      total += patterns.length;
      equal += same.length;
      for (const p of same) if (!isTrivial(p)) nonTrivial.push(`${file}: ${p}`);
      counts.push(
        `${file} ${patterns.length} (${same.length} equal a stock pattern)`,
      );
    }
    console.log(
      `queries: ${total} patterns in ${OURS.length} files; ${equal} equal a stock pattern (${((100 * equal) / Math.max(1, total)).toFixed(1)}%), all trivial; ${STOCK.length} stock files compared\n  ${counts.join("\n  ")}`,
    );
    expect(nonTrivial).toEqual([]);
    expect(equal / Math.max(1, total)).toBeLessThanOrEqual(0.15);
  });

  test("the normaliser: comments go, captures become @_, and a trivial pattern is told from one that is not", () => {
    expect(
      topLevelPatterns(
        '; x\n(comment) @comment\n["if" "else"] @keyword\n((identifier) @constant (#match? @constant "^[A-Z]"))',
      ),
    ).toEqual([
      "(comment) @_",
      '["if" "else"] @_',
      '((identifier) @_ (#match? @_ "^[A-Z]"))',
    ]);
    expect(isTrivial("(comment) @_")).toBe(true);
    expect(isTrivial('["if" "else"] @_')).toBe(true);
    expect(isTrivial('((identifier) @_ (#eq? @_ "self"))')).toBe(true);
    expect(isTrivial("(call function: (identifier) @_)")).toBe(false);
    expect(isTrivial('((identifier) @_ (#match? @_ "^[A-Z]"))')).toBe(false);
  });

  // Decision 19: from checkpoint 1 on, every query file is locked.
  test("every query file's SHA-256 equals the lock's, or the lock lists the change with its reason and both sets' figures", () => {
    expect(existsSync(LOCK)).toBe(true);
    const lock = JSON.parse(readFileSync(LOCK, "utf8")) as {
      files: Record<string, string>;
      changes: {
        file: string;
        sha256: string;
        reason: string;
        workbench: number;
        heldout: number;
      }[];
    };
    const sha = (s: string) =>
      new Bun.CryptoHasher("sha256").update(s).digest("hex");
    expect(Object.keys(lock.files).sort()).toEqual(
      OURS.map((f) => `${f}.scm`).sort(),
    );
    const unlisted: string[] = [];
    for (const file of OURS) {
      const now = sha(text(file));
      if (now === lock.files[`${file}.scm`]) continue;
      const change = [...lock.changes]
        .reverse()
        .find((c) => c.file === `${file}.scm`);
      if (
        !change ||
        change.sha256 !== now ||
        !change.reason ||
        typeof change.workbench !== "number" ||
        typeof change.heldout !== "number"
      )
        unlisted.push(file);
    }
    expect(unlisted).toEqual([]);
  });
});
