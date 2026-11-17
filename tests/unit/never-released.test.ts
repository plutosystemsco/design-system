/**
 * 020d: 0.12.0 was never released (the owner, 2026-11-17). Test 11, the
 * guard: no line names 0.12.0 but those `tests/fixtures/0-12-0-allowed.json`
 * allows, and no test slices the changelog open-endedly but the helper. Both
 * are counted per file, so an allowed line that moves within its file
 * changes nothing; only a new match does. Then tests 7, 8, 10 and 15.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  bulletsOf,
  foldedParts,
  headOf,
  releaseEntry,
} from "../helpers/changelog.ts";
import { SECTIONS, UNCHANGED, WHO } from "../../src/lib/site/upgrade/0.13.0.ts";

const ALLOWLIST = "tests/fixtures/0-12-0-allowed.json";

type Entry = {
  /** A glob over the path, from the repository's root. */
  files: string;
  /** The check's pattern, which names the check the entry belongs to. */
  pattern: string;
  /** Each matching file's count of matching lines. */
  count: number;
  reason: string;
};

const allowlist = JSON.parse(readFileSync(ALLOWLIST, "utf8")) as {
  note: string;
  entries: Entry[];
};

/** Decision 11's two checks. */
const CHECKS = [
  {
    name: "no 0.12.0",
    pattern: "0\\.12\\.0|v0\\.12\\.0|v0-12-0",
    /** Tracked files, less the history decision 11 excludes. */
    scans: (f: string) => {
      if (f.startsWith("context/")) return false;
      if (f === "scripts/rename-kuiper.ts" || f.endsWith("bun.lock"))
        return false;
      // `static/v0.4.0/` to `static/v0.11.0/`: released snapshots, frozen.
      const v = /^static\/v(\d+)\.(\d+)\.(\d+)\//.exec(f);
      if (v && Number(v[1]) === 0 && Number(v[2]) < 12) return false;
      return true;
    },
  },
  {
    name: "no open-ended changelog slice",
    pattern: "indexOf\\(\\s*[\"'`](\\\\n)?## ",
    scans: (f: string) => f.startsWith("tests/"),
  },
] as const;

/** The tree as git sees it, tracked and untracked: the rename guard's list. */
function treeFiles(): string[] {
  return execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { encoding: "utf8", maxBuffer: 1 << 26 },
  )
    .split("\n")
    .filter(Boolean)
    .filter((f) => {
      try {
        return statSync(f).isFile();
      } catch {
        return false;
      }
    });
}

describe("020d test 11: the guard", () => {
  const files = treeFiles();

  test("each entry belongs to a check, and has a glob, a count and a reason", () => {
    for (const e of allowlist.entries) {
      expect(
        CHECKS.some((c) => c.pattern === e.pattern),
        e.files,
      ).toBe(true);
      expect(Number.isInteger(e.count) && e.count > 0, e.files).toBe(true);
      expect(e.reason.length, e.files).toBeGreaterThan(0);
    }
  });

  for (const check of CHECKS)
    test(`${check.name}: every matching file is allowed, at exactly its count`, () => {
      const re = new RegExp(check.pattern);
      const mine = allowlist.entries
        .filter((e) => e.pattern === check.pattern)
        .map((e) => ({ e, glob: new Bun.Glob(e.files), used: 0 }));
      const wrong: string[] = [];
      for (const f of files.filter(check.scans)) {
        const n = readFileSync(f, "utf8")
          .split("\n")
          .filter((l) => re.test(l)).length;
        const by = mine.find((m) => m.glob.match(f));
        if (by) by.used++;
        if (n === 0) {
          if (by) wrong.push(`${f}: allowed ${by.e.count}, found 0`);
          continue;
        }
        if (!by) wrong.push(`${f}: ${n} lines, none allowed`);
        else if (n !== by.e.count)
          wrong.push(`${f}: allowed ${by.e.count}, found ${n}`);
      }
      for (const m of mine)
        if (m.used === 0) wrong.push(`${m.e.files}: an entry no file matches`);
      expect(wrong).toEqual([]);
    });
});

describe("020d test 8: the changelog helper throws, never runs to the file's end", () => {
  const log = [
    "# Changelog",
    "",
    "## 0.13.0 — unreleased",
    "",
    "- `a`: one.",
    "",
    "Also since 0.11.0: more.",
    "",
    "- `b`: two.",
    "",
    "## 0.11.0 — 2026-11-07",
    "",
    "- `c`: three.",
    "",
    "## 0.8.0 — 2026-11-01",
    "",
  ].join("\n");

  test("releaseEntry returns the text from its heading to the next", () => {
    expect(releaseEntry(log, "0.11.0")).toBe(
      "## 0.11.0 — 2026-11-07\n\n- `c`: three.\n",
    );
    expect(releaseEntry(log, "0.13.0")).toStartWith("## 0.13.0 — unreleased");
    expect(releaseEntry(log, "0.13.0")).not.toContain("## 0.11.0");
  });

  test("releaseEntry throws, naming the heading, if it or the next is missing", () => {
    expect(() => releaseEntry(log, "0.12.0")).toThrow('"## 0.12.0"');
    expect(() => releaseEntry(log, "0.1.0")).toThrow('"## 0.1.0"');
    expect(() => releaseEntry("## 0.13.0 — x\n\n- last", "0.13.0")).toThrow(
      'no heading after "## 0.13.0"',
    );
  });

  test("foldedParts splits at the line, which neither part holds", () => {
    const { first, second } = foldedParts(log);
    expect(bulletsOf(first)).toEqual(["- `a`: one."]);
    expect(bulletsOf(second)).toEqual(["- `b`: two."]);
    expect(first + second).not.toContain("Also since 0.11.0");
  });

  test("foldedParts throws when the line is missing, or there are two", () => {
    expect(() => foldedParts(log.replace("Also since", "Also"))).toThrow("no");
    expect(() =>
      foldedParts(
        log.replace("- `b`: two.", "- `b`: two.\n\nAlso since 0.11.0: again."),
      ),
    ).toThrow("2");
  });
});

describe("020d test 15: the fold keeps every bullet", () => {
  const fixture = JSON.parse(
    readFileSync("tests/fixtures/020d-fold-heads.json", "utf8"),
  ) as { base: string; first: string[]; second: string[] };
  const parts = foldedParts(readFileSync("CHANGELOG.md", "utf8"));

  /** The fixture's heads not found, in order, among the part's. */
  const lost = (want: string[], part: string) => {
    const have = bulletsOf(part).map(headOf);
    let at = 0;
    return want.filter((h) => {
      const i = have.indexOf(h, at);
      if (i === -1) return true;
      at = i + 1;
      return false;
    });
  };

  test("the fixture holds the base's 26 and 18 heads", () => {
    expect(fixture.base).toMatch(/^[0-9a-f]{40}$/);
    expect(fixture.first).toHaveLength(26);
    expect(fixture.second).toHaveLength(18);
  });

  test("the first part holds the base's 0.13.0 heads, in order", () => {
    expect(lost(fixture.first, parts.first)).toEqual([]);
  });

  test("the second part holds the base's 0.12.0 heads, in order", () => {
    expect(lost(fixture.second, parts.second)).toEqual([]);
  });
});

describe("020d test 7: no token says 0.12.0", () => {
  const dirs = ["tokens", "static/r/tokens", "static/v0.13.0/r/tokens"];
  test.each(dirs)("%s", (dir) => {
    const hits = readdirSync(dir)
      .map((f) => path.join(dir, f))
      .filter((f) => statSync(f).isFile())
      .flatMap((f) =>
        readFileSync(f, "utf8")
          .split("\n")
          .filter((l) => l.includes('"0.12.0"'))
          .map((l) => `${f}: ${l.trim()}`),
      );
    expect(hits).toEqual([]);
  });
});

describe("020d test 10: the guide is the path from 0.11.0", () => {
  const section = (id: string) => SECTIONS.find((s) => s.id === id)!;

  test("WHO points at no 0.12.0 notes, and says 0.12.0 was never released", () => {
    for (const p of WHO) {
      expect(p).not.toContain("0.12.0's notes");
      expect(p).not.toContain("#v0-12-0");
    }
    expect(WHO[1]).toContain("0.12.0 was never released");
    expect(WHO[1]).toContain("#v0-13-0");
  });

  test("the sections are 020's, from-0-11-0, then 026's", () => {
    expect(SECTIONS.map((s) => s.id)).toEqual(["020", "from-0-11-0", "026"]);
    expect(section("from-0-11-0").spec).toBe("013");
    expect(section("from-0-11-0").title).toBe(
      "From 0.11.0: code, the yellow and the sticky bar",
    );
    expect(section("from-0-11-0").renames).toEqual([]);
  });

  // The change review, finding 8: step 1's grep finds the class it asks
  // an app to rename. Finding 1: the example second line stays `field
  // input` (decision 8), so pasting it installs nothing an app lacks.
  test("020's step 1 renames scrollbar-code and its grep finds it; step 2 names the code items for the second line, whose example is field input", () => {
    const [one, two] = section("020").steps;
    expect(one!.text).toContain("`scrollbar-code`");
    expect(one!.command).toContain("-e scrollbar-code");
    for (const words of ["`code-block`", "`error-summary`", "second line"])
      expect(two!.text, words).toContain(words);
    const [line1, line2] = two!.command!.split("\n");
    expect(line1).not.toContain("code-block");
    expect(line1).toContain("add kuiper-theme -y -o");
    expect(line2).toEndWith(" add field input -y");
    expect(line2).not.toContain("-o");
  });

  test("the new section's steps name each change, and the grep comes before the deletion", () => {
    const steps = section("from-0-11-0").steps;
    const all = steps.map((s) => `${s.text} ${s.command ?? ""}`).join("\n");
    for (const words of [
      "bun install",
      "--code-text",
      "data-sticky-bar",
      "shikiTheme",
      "error-summary-content",
      "wasm-unsafe-eval",
    ])
      expect(all, words).toContain(words);
    const grep = steps.findIndex(
      (s) =>
        s.command?.startsWith("grep") && s.command.includes("code-foreground"),
    );
    const del = steps.findIndex((s) => /^Delete the stale lines/.test(s.text));
    expect(grep).toBeGreaterThan(-1);
    expect(del).toBeGreaterThan(grep);
    expect(steps[0]!.command).toBe("bun install");
  });

  test("what did not change is scoped to what the sections do not name; shikiTheme.name names codeTheme", () => {
    expect(UNCHANGED.names).toContain("do not name");
    const row = UNCHANGED.values.find(([name]) => name === "shikiTheme.name")!;
    expect(row[1]).toContain("`codeTheme`");
  });
});
