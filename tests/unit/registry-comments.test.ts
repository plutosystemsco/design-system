/**
 * No published item file cites an internal document (015 decisions 14 and
 * 26). Both checks parse each `static/r/**\/*.json` file and work on its
 * decoded `files[].content`, line by line: an item file is one physical JSON
 * line with its quotes escaped, so nothing is matched in the raw JSON.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { citationsIn, commentBlocks } from "../../src/lib/site/citations.ts";
import { foldedParts } from "../helpers/changelog.ts";

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
  // 020 decision 3: the 82 items (027a's three, 026's toast and 027b's three among them) and the one alias entry.
  test("static/r holds the 83 entries' JSON", () => {
    const named = FILES.map((f) =>
      items(JSON.parse(readFileSync(f, "utf8"))),
    ).filter(Boolean);
    expect(named.length).toBe(83);
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

/**
 * 015 decision 26, criterion 30: the entry names the reworded items. 020d:
 * that entry is the 0.13.0 entry's folded part, below "Also since 0.11.0".
 */
describe("the folded changelog part", () => {
  const entry = foldedParts(
    readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf8"),
  ).second;

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
      entry.split("\n\n").find((p) => p.includes("The design site")) ?? "";
    for (const words of ["/v0.13.0/r", "GitHub", "Markdown twin", "llms.txt"])
      expect(para, words).toContain(words);
  });
});

// 018 decision 17: the system's name. 020d: 0.13.0's entry now tells a
// 0.11.0 app the name, and that the code names say it too (020).
describe("018: the Kuiper Design System", () => {
  test("the 0.13.0 entry's intro names the system, and says its code names now say Kuiper", () => {
    const { first } = foldedParts(
      readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf8"),
    );
    const intro =
      first.split("\n\n").find((p) => p.includes("Kuiper Design System")) ?? "";
    expect(intro).toStartWith(
      "The design system is named the Kuiper Design System, and its code names now say Kuiper.",
    );
  });
});

/**
 * 027a test 3: batch A has 0 empty API rows. `023`'s described-list test
 * does not exist at this build, so the check lives here, and `023` absorbs
 * it. Every prop of `Link`, `ButtonGroup` and `Progress` has a doc comment,
 * and so does every member of `LinkStrings`.
 */
describe("027a test 3: batch A has 0 empty API rows", () => {
  type Item = { name: string; files: { path: string; type: string }[] };
  const registry = JSON.parse(
    readFileSync(path.join(ROOT, "registry.json"), "utf8"),
  ) as { items: Item[] };

  test.each([
    ["link", "Link"],
    ["button-group", "ButtonGroup"],
    ["progress", "Progress"],
  ])("%s: every row of %s has a doc comment", async (name, part) => {
    const { apiTables } = await import("../../src/lib/site/api.server.ts");
    const item = registry.items.find((i) => i.name === name);
    expect(item, name).toBeDefined();
    const table = apiTables(item!).find((t) => t.part === part);
    expect(table, part).toBeDefined();
    expect(table!.rows.length).toBeGreaterThan(0);
    expect(table!.rows.filter((r) => !r.doc).map((r) => r.name)).toEqual([]);
  });

  // The design lead's ruling at the landing: the table names the element,
  // not a TypeScript type; each variant prop shows its values.
  test.each([
    [
      "link",
      "Link",
      "every attribute of `<a>`",
      { variant: '"default" | "inherit"' },
    ],
    [
      "button-group",
      "ButtonGroup",
      "every attribute of `<div>`",
      {
        variant: '"attached" | "spaced"',
        orientation: '"horizontal" | "vertical"',
      },
    ],
    [
      "progress",
      "Progress",
      "every attribute of `<progress>`",
      { variant: '"default" | "destructive"' },
    ],
  ] as const)(
    "%s: %s inherits %s, and its variants read as their values",
    async (name, part, inherits, types) => {
      const { apiTables } = await import("../../src/lib/site/api.server.ts");
      const item = registry.items.find((i) => i.name === name)!;
      const table = apiTables(item).find((t) => t.part === part)!;
      expect(table.inherits).toBe(`and ${inherits}`);
      for (const [prop, type] of Object.entries(types))
        expect(table.rows.find((r) => r.name === prop)?.type, prop).toBe(type);
    },
  );

  test("every member of LinkStrings has a doc comment", async () => {
    const ts = (await import("typescript")).default;
    const file = path.join(ROOT, "src/lib/registry/ui/link/link.svelte");
    const text = readFileSync(file, "utf8");
    const module =
      /<script[^>]*\bmodule\b[^>]*>([\s\S]*?)<\/script>/.exec(text)?.[1] ?? "";
    const source = ts.createSourceFile(
      "link.ts",
      module,
      ts.ScriptTarget.Latest,
      true,
    );
    const alias = source.statements.find(
      (s): s is import("typescript").TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(s) && s.name.text === "LinkStrings",
    );
    expect(alias).toBeDefined();
    const literal = alias!.type as import("typescript").TypeLiteralNode;
    expect(ts.isTypeLiteralNode(literal)).toBe(true);
    const members = literal.members.map((m) => ({
      name: m.name?.getText(source) ?? "",
      doc: ((m as unknown as { jsDoc?: unknown[] }).jsDoc ?? []).length,
    }));
    expect(members.map((m) => m.name)).toEqual(["newTab"]);
    expect(members.filter((m) => m.doc === 0)).toEqual([]);
  });
});

/**
 * 027b test 3: what each part inherits. `023`'s suite holds every prop and
 * every `Strings` member to one doc comment, and the variant unions to
 * their values; this keeps the one fact it does not check, each table's
 * closing row.
 */
describe("027b test 3: what batch A's interactive parts inherit", () => {
  type Item = { name: string; files: { path: string; type: string }[] };
  const registry = JSON.parse(
    readFileSync(path.join(ROOT, "registry.json"), "utf8"),
  ) as { items: Item[] };

  test.each([
    ["pagination", "Pagination", "every attribute of an element"],
    ["search-field", "SearchField", "every attribute of `<input>`"],
    ["tag", "TagGroup", "every attribute of `<ul>`"],
    ["tag", "Tag", "every attribute of an element"],
  ] as const)("%s: %s inherits %s", async (name, part, inherits) => {
    const { apiTables } = await import("../../src/lib/site/api.server.ts");
    const item = registry.items.find((i) => i.name === name);
    expect(item, name).toBeDefined();
    const table = apiTables(item!).find((t) => t.part === part);
    expect(table, part).toBeDefined();
    expect(table!.inherits).toBe(`and ${inherits}`);
  });
});
