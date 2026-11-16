/**
 * 020: the Kuiper rename. Test 1, "no stray pluto": every `/pluto/i` in the
 * tree is allowed by one counted entry of `tests/fixtures/pluto-allowed.json`.
 * Test 2, "the rename table". And the one source check of test 8: the
 * popover's context, set inside a portal that the server render skips.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { RENAMES } from "../../src/lib/site/upgrade/renames.ts";

const ALLOWLIST = "tests/fixtures/pluto-allowed.json";
const CLASSES = ["brand", "history", "alias", "record"] as const;

type Entry = {
  /** A glob over the path, from the repository's root. */
  files: string;
  /** A regular expression; a `pluto` it spans is allowed. */
  pattern: string;
  /** `path`: matched against the file's path; else against its lines. */
  in?: "path" | "text";
  /**
   * Only the lines from the first that starts with `from` (inclusive) to the
   * first after it that starts with `to` (exclusive): one changelog entry.
   */
  section?: { from: string; to?: string };
  count: number;
  /**
   * Each file's count, where an entry spans many files (020 review, finding
   * 7): "Pluto Systems" is counted per file, so system prose cannot hide in
   * a blanket total.
   */
  byFile?: Record<string, number>;
  class: (typeof CLASSES)[number];
  reason: string;
};

const allowlist = JSON.parse(readFileSync(ALLOWLIST, "utf8")) as {
  note: string;
  entries: Entry[];
};

/** The tree as git sees it, tracked and untracked, minus what test 1 skips. */
function treeFiles(): string[] {
  return execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { encoding: "utf8", maxBuffer: 1 << 26 },
  )
    .split("\n")
    .filter(Boolean)
    .filter((f) => existsSync(f))
    .filter(
      (f) =>
        !f.startsWith("static/v0.") &&
        !f.startsWith("context/") &&
        f !== ALLOWLIST,
    );
}

/** Each `/pluto/i` in `text`, and the first entry that allows it, else null. */
function* matches(
  file: string,
  text: string,
  where: "path" | "text",
  entries: { entry: Entry; index: number; glob: Bun.Glob; re: RegExp }[],
): Generator<{ line: string; at: number; by: number | null }> {
  const lines = where === "path" ? [text] : text.split("\n");
  const mine = entries.filter(
    (e) => (e.entry.in ?? "text") === where && e.glob.match(file),
  );
  // Each entry's span of lines: all of them, or its section's.
  const spans = new Map(
    mine.map((e) => {
      const s = e.entry.section;
      if (!s) return [e.index, [0, lines.length]] as const;
      const start = lines.findIndex((l) => l.startsWith(s.from));
      if (start === -1) return [e.index, [0, 0]] as const;
      const rest = s.to
        ? lines.slice(start + 1).findIndex((l) => l.startsWith(s.to!))
        : -1;
      return [
        e.index,
        [start, rest === -1 ? lines.length : start + 1 + rest],
      ] as const;
    }),
  );
  for (const [n, line] of lines.entries()) {
    for (const m of line.matchAll(/pluto/gi)) {
      const at = m.index!;
      let by: number | null = null;
      for (const e of mine) {
        const [from, to] = spans.get(e.index)!;
        if (n < from || n >= to) continue;
        e.re.lastIndex = 0;
        for (const hit of line.matchAll(e.re)) {
          if (hit.index! <= at && at + 5 <= hit.index! + hit[0].length) {
            by = e.index;
            break;
          }
        }
        if (by !== null) break;
      }
      yield { line, at, by };
    }
  }
}

/**
 * A glob whose outer `{a,b,…}` is split into one glob per alternative.
 * 022 (build step 1): Bun 1.3.14, the version CI pinned until 025's QB, matches no `**`
 * inside braces (`{src/lib/registry/ui/**,…}`); Bun 1.4.4 does.
 */
function braced(pattern: string): Bun.Glob {
  const outer = pattern.match(/^\{(.*)\}$/);
  if (!outer) return new Bun.Glob(pattern);
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  const body = outer[1]!;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "{") depth++;
    else if (body[i] === "}") depth--;
    else if (body[i] === "," && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  const globs = parts.map((p) => new Bun.Glob(p));
  return { match: (f: string) => globs.some((g) => g.match(f)) } as Bun.Glob;
}

describe("020 test 1: no stray pluto", () => {
  const entries = allowlist.entries.map((entry, index) => ({
    entry,
    index,
    glob: braced(entry.files),
    re: new RegExp(entry.pattern, "g"),
  }));

  test("each entry has a class of the four, a reason, and a count", () => {
    for (const { entry } of entries) {
      expect(CLASSES, entry.pattern).toContain(entry.class);
      expect(entry.reason.length, entry.pattern).toBeGreaterThan(0);
      expect(Number.isInteger(entry.count), entry.pattern).toBe(true);
      expect(entry.count, entry.pattern).toBeGreaterThan(0);
      if (entry.class === "alias")
        expect(entry.reason, entry.pattern).toContain("0.14.0");
      if (entry.byFile)
        expect(
          Object.values(entry.byFile).reduce((a, b) => a + b, 0),
          entry.pattern,
        ).toBe(entry.count);
    }
    // 020 review, finding 7: the company's name is counted file by file.
    expect(
      entries.find((e) => e.entry.pattern === "Pluto Systems")?.entry.byFile,
    ).toBeDefined();
  });

  test("every pluto in the tree is allowed, and every entry is used at exactly its count", () => {
    const used = new Array<number>(entries.length).fill(0);
    const usedByFile = entries.map(() => new Map<string, number>());
    const stray: string[] = [];
    for (const file of treeFiles()) {
      for (const where of ["path", "text"] as const) {
        let text = file;
        if (where === "text") {
          const buf = readFileSync(file);
          if (buf.includes(0)) continue;
          text = buf.toString("utf8");
          if (!/pluto/i.test(text)) continue;
        } else if (!/pluto/i.test(file)) continue;
        for (const m of matches(file, text, where, entries)) {
          if (m.by === null)
            stray.push(
              `${where === "path" ? "path " : ""}${file}: ${m.line.trim().slice(0, 160)}`,
            );
          else {
            used[m.by]!++;
            const byFile = usedByFile[m.by]!;
            byFile.set(file, (byFile.get(file) ?? 0) + 1);
          }
        }
      }
    }
    expect(stray).toEqual([]);
    for (const { entry, index } of entries) {
      if (!entry.byFile) continue;
      expect(
        Object.fromEntries([...usedByFile[index]!].sort()),
        entry.pattern,
      ).toEqual(entry.byFile);
    }
    expect(
      entries
        .filter(({ entry, index }) => used[index] !== entry.count)
        .map(
          ({ entry, index }) =>
            `${entry.files} /${entry.pattern}/: ${used[index]} of ${entry.count}`,
        ),
    ).toEqual([]);
  });

  // Criterion 16: the internal names moved.
  test("the token file, the package and the bench carry the new name", () => {
    expect(existsSync("tokens/kuiper.tokens.json")).toBe(true);
    expect(existsSync("tokens/pluto.tokens.json")).toBe(false);
    expect(JSON.parse(readFileSync("package.json", "utf8")).name).toBe(
      "kuiper-design-system",
    );
    expect(existsSync("scripts/bench/kuiper.ts")).toBe(true);
    expect(existsSync("scripts/bench/pluto.ts")).toBe(false);
  });
});

describe("020 test 2: the rename table", () => {
  const KINDS = [
    "theme item",
    "storage key",
    "context key, across items",
    "context key, inside an item",
    "keyframes",
    "Shiki theme",
    "site page",
    "token file",
    "registry name",
    "package name",
  ];

  test("every row has a kind from the list, old ≠ new, an alias of 0.14.0 or none, and a todo; no new name holds pluto", () => {
    expect(RENAMES.length).toBeGreaterThan(0);
    for (const r of RENAMES) {
      expect(KINDS, r.old).toContain(r.kind);
      expect(r.old).not.toBe(r.new);
      expect(["0.14.0", "none"], r.old).toContain(r.alias);
      expect(r.todo.length, r.old).toBeGreaterThan(0);
      expect(r.seenBy.length, r.old).toBeGreaterThan(0);
      expect(r.new.toLowerCase(), r.old).not.toContain("pluto");
    }
  });

  // Criterion 2: decision 1's rows, no more and no fewer, one per name.
  test("RENAMES holds decision 1's names, one row each", () => {
    expect(
      RENAMES.map((r) => [r.kind, r.old, r.new, r.alias].join(" | ")),
    ).toEqual([
      "theme item | pluto-theme | kuiper-theme | 0.14.0",
      "storage key | pluto-theme | kuiper-theme | 0.14.0",
      "context key, across items | pluto:field | kuiper:field | 0.14.0",
      "context key, across items | pluto:field-set | kuiper:field-set | 0.14.0",
      "context key, inside an item | pluto:field-label | kuiper:field-label | 0.14.0",
      "context key, inside an item | pluto:tooltip | kuiper:tooltip | 0.14.0",
      "context key, inside an item | pluto:item-group | kuiper:item-group | 0.14.0",
      "context key, inside an item | pluto:popover | kuiper:popover | 0.14.0",
      "context key, inside an item | pluto:accordion-item | kuiper:accordion-item | 0.14.0",
      "keyframes | pluto-enter | kuiper-enter | none",
      "keyframes | pluto-exit | kuiper-exit | none",
      "keyframes | pluto-mark-dock | kuiper-mark-dock | none",
      "keyframes | pluto-mark-fade | kuiper-mark-fade | none",
      "Shiki theme | pluto-code | kuiper-code | none",
      "site page | /components/pluto-theme/ | /components/kuiper-theme/ | none",
      "site page | /example/pluto-theme/ | /example/kuiper-theme/ | none",
      "token file | tokens/pluto.tokens.json | tokens/kuiper.tokens.json | none",
      "registry name | pluto | kuiper | none",
      "package name | pluto-design-system | kuiper-design-system | none",
    ]);
  });
});

// Test 8's one source check: the popover sets its context inside a portal,
// which the server render skips, so the view cannot see it.
describe("020 test 8: the popover sets its key under both names", () => {
  test("popover-content.svelte holds one setContext under the new constant and one under the old", () => {
    const src = readFileSync(
      "src/lib/registry/ui/popover/popover-content.svelte",
      "utf8",
    );
    expect(src).toContain('const KEY = "kuiper:popover";');
    expect(src).toContain('const OLD_KEY = "pluto:popover";');
    expect(src.match(/setContext\(KEY,/g)).toHaveLength(1);
    expect(src.match(/setContext\(OLD_KEY,/g)).toHaveLength(1);
  });
});
