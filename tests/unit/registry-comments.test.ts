/**
 * No published item file cites an internal document (015 decisions 14 and
 * 26). Both checks parse each `static/r/**\/*.json` file and work on its
 * decoded `files[].content`, line by line: an item file is one physical JSON
 * line with its quotes escaped, so nothing is matched in the raw JSON.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { citationsIn, commentBlocks } from "../../src/lib/site/citations.ts";

const ROOT = path.resolve(import.meta.dir, "../..");
const STATIC_R = path.join(ROOT, "static/r");
const FIXTURE = JSON.parse(
  readFileSync(
    path.join(ROOT, "tests/fixtures/reworded-comments.json"),
    "utf8",
  ),
) as {
  base: string;
  reworded: { item: string; path: string; before: string; after: string }[];
  kept: { item: string; path: string; line: string; reason: string }[];
};
/** Changes the owner decided after 015, applied to the base before comparing. */
const AMENDMENTS = JSON.parse(
  readFileSync(
    path.join(ROOT, "tests/fixtures/static-r-amendments.json"),
    "utf8",
  ),
) as {
  amended: { item: string; before: string; after: string; why: string }[];
};

const VERSION = JSON.parse(
  readFileSync(path.join(ROOT, "package.json"), "utf8"),
).version;

type ItemJson = {
  name: string;
  files?: { content: string; target?: string; type: string }[];
};

function jsonFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...jsonFiles(full));
    else if (entry.endsWith(".json")) out.push(full);
  }
  return out.sort();
}

const FILES = jsonFiles(STATIC_R);

function items(raw: unknown): ItemJson | null {
  return raw && typeof raw === "object" && !Array.isArray(raw) && "files" in raw
    ? (raw as ItemJson)
    : null;
}

describe("published item files cite no internal document", () => {
  test("static/r holds the 75 items' JSON", () => {
    const named = FILES.map((f) =>
      items(JSON.parse(readFileSync(f, "utf8"))),
    ).filter(Boolean);
    expect(named.length).toBe(75);
  });

  test("0 decoded lines and 0 joined comment blocks match a citation pattern, but the fixture's kept lines", () => {
    const found: string[] = [];
    for (const file of FILES) {
      const item = items(JSON.parse(readFileSync(file, "utf8")));
      if (!item?.files) continue;
      for (const f of item.files) {
        const name = f.target ?? f.type;
        const kept = new Set(
          FIXTURE.kept.filter((k) => k.item === item.name).map((k) => k.line),
        );
        const lines = f.content.split("\n");
        lines.forEach((line, i) => {
          if (kept.has(line)) return;
          const hits = citationsIn(line);
          if (hits.length)
            found.push(
              `${item.name} ${name}:${i + 1} [${hits.join(", ")}] ${line.trim()}`,
            );
        });
        for (const block of commentBlocks(f.content, name)) {
          const hits = citationsIn(block.joined);
          if (hits.length)
            found.push(
              `${item.name} ${name}:${block.startLine}-${block.endLine} [${hits.join(", ")}] ${block.joined}`,
            );
        }
      }
    }
    expect(found).toEqual([]);
  });

  test("each kept line is code, present once in its item", () => {
    for (const k of FIXTURE.kept) {
      const item = items(
        JSON.parse(
          readFileSync(
            path.join(STATIC_R, "styles/maia", `${k.item}.json`),
            "utf8",
          ),
        ),
      );
      const count = (item?.files ?? [])
        .flatMap((f) => f.content.split("\n"))
        .filter((l) => l === k.line).length;
      expect(count).toBe(1);
      expect(k.reason.length).toBeGreaterThan(0);
    }
  });
});

describe("nothing else in static/r moved since the base (0.12.0 only)", () => {
  const shallow = (() => {
    try {
      return (
        execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
          cwd: ROOT,
        })
          .toString()
          .trim() === "true"
      );
    } catch {
      return true;
    }
  })();
  const skip = VERSION !== "0.12.0" || shallow;
  if (skip)
    console.log(
      VERSION !== "0.12.0"
        ? `registry-comments: the release check guards 0.12.0 only; package.json reads ${VERSION}, so it skips.`
        : "registry-comments: a shallow clone holds no base commit, so the release check skips.",
    );

  test.skipIf(skip)("the base commit is present", () => {
    let ok = true;
    try {
      execFileSync("git", ["cat-file", "-e", `${FIXTURE.base}^{commit}`], {
        cwd: ROOT,
        stdio: "ignore",
      });
    } catch {
      ok = false;
    }
    if (!ok)
      throw new Error(
        `the fixture's base ${FIXTURE.base} is not in this clone`,
      );
    expect(FIXTURE.base).toMatch(/^[0-9a-f]{40}$/);
  });

  test.skipIf(skip)(
    "each file, with the fixture's rewordings applied to the base, deep-equals the file now",
    () => {
      const used = new Set<number>();
      const amendedUsed = new Set<number>();
      const moved: string[] = [];
      for (const file of FILES) {
        const rel = path.relative(ROOT, file);
        const now = JSON.parse(readFileSync(file, "utf8"));
        let before: unknown;
        try {
          before = JSON.parse(
            execFileSync("git", ["show", `${FIXTURE.base}:${rel}`], {
              cwd: ROOT,
              maxBuffer: 1 << 28,
            }).toString(),
          );
        } catch {
          moved.push(`${rel}: not in the base`);
          continue;
        }
        const item = items(before);
        if (item?.files) {
          for (const f of item.files) {
            FIXTURE.reworded.forEach((r, i) => {
              if (r.item !== item.name) return;
              const lines = f.content.split("\n");
              const want = r.before.split("\n");
              for (let at = 0; at + want.length <= lines.length; at++) {
                if (want.every((w, j) => lines[at + j] === w)) {
                  lines.splice(at, want.length, ...r.after.split("\n"));
                  f.content = lines.join("\n");
                  used.add(i);
                  return;
                }
              }
            });
          }
        }
        // The later amendments, as text over the base's JSON.
        if (item) {
          let text = JSON.stringify(before);
          AMENDMENTS.amended.forEach((a, i) => {
            if (a.item !== item.name) return;
            const from = JSON.stringify(a.before).slice(1, -1);
            const to = JSON.stringify(a.after).slice(1, -1);
            const raw = text.includes(from) ? [from, to] : [a.before, a.after];
            if (!text.includes(raw[0])) return;
            text = text.split(raw[0]).join(raw[1]);
            amendedUsed.add(i);
          });
          before = JSON.parse(text);
        }
        if (!Bun.deepEquals(before, now)) moved.push(rel);
      }
      expect(moved).toEqual([]);
      expect(
        AMENDMENTS.amended
          .filter((_, i) => !amendedUsed.has(i))
          .map((a) => `${a.item}: ${a.why}`),
      ).toEqual([]);
      expect(
        FIXTURE.reworded
          .filter((_, i) => !used.has(i))
          .map((r) => `${r.item}: ${r.before}`),
      ).toEqual([]);
    },
  );
});

/** 015 decision 26, criterion 30: the 0.12.0 entry names the reworded items. */
describe("the 0.12.0 changelog entry", () => {
  const text = readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf8");
  const entry = text.slice(
    text.indexOf("## 0.12.0"),
    text.indexOf("\n## 0.11.0"),
  );

  test("its lines for reworded comments name exactly the items in reworded-comments.json", () => {
    const named = entry
      .split("\n")
      .filter((l) => /comments reworded to drop internal references/i.test(l))
      .map((l) => /^- `([a-z0-9-]+)`: /.exec(l)?.[1])
      .sort();
    expect(named).toEqual(
      [...new Set(FIXTURE.reworded.map((r) => r.item))].sort(),
    );
  });

  test("it holds the site's paragraph: its name, its /r/ path or GitHub, and the Markdown twins", () => {
    const para =
      entry.split("\n\n").find((p) => p.includes("Pluto Systems design")) ?? "";
    for (const words of ["/v0.12.0/r", "GitHub", "Markdown twin", "llms.txt"])
      expect(para, words).toContain(words);
  });
});
