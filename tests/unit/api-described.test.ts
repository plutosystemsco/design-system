/**
 * 023 tests 1 to 4 and 8: every API row and every exported type member of
 * every item has a description, the descriptions keep the countable voice
 * rules, and every re-declared pass-through keeps its source's own type.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { parse } from "svelte/compiler";
import ts from "typescript";
import {
  apiTables,
  propsType,
  type ApiTable,
} from "../../src/lib/site/api.server.ts";
import { citationsIn } from "../../src/lib/site/citations.ts";

type Item = { name: string; files: { path: string; type: string }[] };
const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: Item[];
};
const ITEMS = registry.items;
const TABLES = new Map<string, ApiTable[]>(
  ITEMS.map((i) => [i.name, apiTables(i, { marks: true })]),
);

/** Decision 8: the items with no table. A new item with none joins this set. */
const NO_TABLE = [
  "kuiper-theme",
  "pluto-theme",
  "font-geist",
  "font-heading-ibm-plex-sans",
  "font-jetbrains-mono",
  "product-home",
];

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/** A doc comment's text, as the API parser reads it: tags dropped. */
function docOf(node: ts.Node): string {
  const docs = (node as unknown as { jsDoc?: ts.JSDoc[] }).jsDoc;
  if (!docs?.length) return "";
  const c = docs[docs.length - 1].comment;
  return squash(
    typeof c === "string" ? c : (c ?? []).map((p) => p.text).join(""),
  );
}

/** A file's TypeScript: a .ts file whole, a .svelte file's module script. */
function moduleSources(file: string): ts.SourceFile[] {
  const text = readFileSync(file, "utf8");
  if (file.endsWith(".ts"))
    return [ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)];
  if (!file.endsWith(".svelte")) return [];
  const ast = parse(text, { modern: true }) as unknown as {
    module?: { content: { start: number; end: number } };
  };
  if (!ast.module) return [];
  return [
    ts.createSourceFile(
      file + ".ts",
      text.slice(ast.module.content.start, ast.module.content.end),
      ts.ScriptTarget.Latest,
      true,
    ),
  ];
}

type Member = { item: string; type: string; name: string; doc: string };

/**
 * Decision 1's type members: each member of an exported interface or
 * object-literal alias, and of an object literal inside an exported
 * alias's unions and intersections, through parentheses. A member of a
 * `…Props` alias whose name is a row of the same item is test 1's.
 */
function typeMembers(item: Item): Member[] {
  const rows = new Set(
    (TABLES.get(item.name) ?? []).flatMap((t) => t.rows.map((r) => r.name)),
  );
  const out: Member[] = [];
  for (const f of item.files)
    for (const source of moduleSources(f.path)) {
      const named = new Set<string>();
      for (const st of source.statements)
        if (
          ts.isExportDeclaration(st) &&
          st.exportClause &&
          ts.isNamedExports(st.exportClause) &&
          !st.moduleSpecifier
        )
          for (const e of st.exportClause.elements)
            named.add((e.propertyName ?? e.name).text);
      const exported = (st: ts.Statement & { name: ts.Identifier }) =>
        (ts.getCombinedModifierFlags(st as unknown as ts.Declaration) &
          ts.ModifierFlags.Export) !==
          0 || named.has(st.name.text);
      const push = (type: string, members: readonly ts.TypeElement[]) => {
        for (const m of members) {
          if (!m.name) continue;
          const name = m.name.getText(source).replace(/["']/g, "");
          if (type.endsWith("Props") && rows.has(name)) continue;
          out.push({ item: item.name, type, name, doc: docOf(m) });
        }
      };
      const walk = (type: string, node: ts.TypeNode) => {
        if (ts.isParenthesizedTypeNode(node)) walk(type, node.type);
        else if (ts.isTypeLiteralNode(node)) push(type, node.members);
        else if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node))
          for (const t of node.types) walk(type, t);
      };
      for (const st of source.statements) {
        if (ts.isInterfaceDeclaration(st) && exported(st))
          push(st.name.text, st.members);
        else if (ts.isTypeAliasDeclaration(st) && exported(st))
          walk(st.name.text, st.type);
      }
    }
  return out;
}

const MEMBERS = new Map<string, Member[]>(
  ITEMS.map((i) => [i.name, typeMembers(i)]),
);

/** Decision 5's countable rules. `kind` sets V4's limit. */
function voiceFaults(
  name: string,
  doc: string,
  kind: "component" | "module" | "member",
): string[] {
  const d = squash(doc);
  const out: string[] = [];
  if (!d) return ["V1"];
  if (!/^[A-Z0-9"'`“‘]/.test(d)) out.push("V2");
  if (!/\.[`)\]]?$/.test(d)) out.push("V3");
  if (kind !== "module" && d.split(" ").length > 40) out.push("V4");
  const bare = name.replace(/["']/g, "");
  if (d.toLowerCase().startsWith(`${bare.toLowerCase()}:`)) out.push("V5");
  if (citationsIn(d).length) out.push("V6");
  if (/\byours?\b[^.]*\b(wins?|replaces?|overrides?)\b/i.test(d))
    out.push("V7");
  return out;
}

describe("023 test 1: every API row is described", () => {
  for (const item of ITEMS) {
    const tables = TABLES.get(item.name)!;
    if (!tables.length) continue;
    test(`${item.name} has 0 empty API rows`, () => {
      const empty = tables.flatMap((t) =>
        t.rows.filter((r) => !squash(r.doc)).map((r) => `${t.part}.${r.name}`),
      );
      expect(empty).toEqual([]);
    });
  }
});

describe("023 test 2: no item loses its tables silently", () => {
  const noTable = (items: Item[]) =>
    items.filter((i) => apiTables(i).length === 0).map((i) => i.name);

  test("the items with no table are exactly the theme, its alias, the fonts and product-home", () => {
    expect(noTable(ITEMS).sort()).toEqual([...NO_TABLE].sort());
  });

  test("a component whose $props() is renamed joins the set, so the test above would fail", () => {
    const fixture: Item = {
      name: "renamed-props",
      files: [
        {
          path: "tests/unit/fixtures/api/renamed-props.svelte",
          type: "registry:ui",
        },
      ],
    };
    expect(noTable([...ITEMS, fixture]).sort()).not.toEqual(
      [...NO_TABLE].sort(),
    );
    expect(noTable([fixture])).toEqual(["renamed-props"]);
  });
});

describe("023 test 3: every exported type member is described", () => {
  for (const item of ITEMS) {
    const members = MEMBERS.get(item.name)!;
    if (!members.length) continue;
    test(`${item.name} has 0 bare type members`, () => {
      expect(
        members.filter((m) => !m.doc).map((m) => `${m.type}.${m.name}`),
      ).toEqual([]);
    });
  }
});

describe("023 test 4: every description keeps the countable rules", () => {
  const all = [
    ...ITEMS.flatMap((i) =>
      TABLES.get(i.name)!.flatMap((t) =>
        t.rows.map((r) => ({
          at: `${i.name} ${t.part}.${r.name}`,
          name: r.name,
          doc: r.doc,
          kind: t.kind as "component" | "module",
        })),
      ),
    ),
    ...ITEMS.flatMap((i) =>
      MEMBERS.get(i.name)!.map((m) => ({
        at: `${i.name} ${m.type}.${m.name}`,
        name: m.name,
        doc: m.doc,
        kind: "member" as const,
      })),
    ),
  ];
  const described = all.filter((r) => squash(r.doc));
  for (const rule of ["V1", "V2", "V3", "V4", "V5", "V6", "V7"])
    test(`${rule}: 0 descriptions break it`, () => {
      const pool = rule === "V1" ? all : described;
      expect(
        pool
          .filter((r) => voiceFaults(r.name, r.doc, r.kind).includes(rule))
          .map((r) => r.at),
      ).toEqual([]);
    });

  test("each rule fails its mutation", () => {
    const words = (n: number) =>
      "A " + Array.from({ length: n - 2 }, () => "word").join(" ") + " end.";
    expect(voiceFaults("x", "", "component")).toEqual(["V1"]);
    expect(voiceFaults("x", "shows a spinner.", "component")).toEqual(["V2"]);
    expect(voiceFaults("x", "Shows a spinner", "component")).toEqual(["V3"]);
    expect(voiceFaults("x", words(41), "component")).toEqual(["V4"]);
    expect(voiceFaults("x", words(41), "member")).toEqual(["V4"]);
    expect(voiceFaults("x", words(41), "module")).toEqual([]);
    expect(voiceFaults("x", words(40), "component")).toEqual([]);
    expect(voiceFaults("busy", "Busy: shows a spinner.", "component")).toEqual([
      "V5",
    ]);
    expect(
      voiceFaults("x", "Shows a spinner, by 001 decision 7.", "component"),
    ).toEqual(["V6"]);
    expect(
      voiceFaults(
        "class",
        "Classes for the `<div>`, merged with Kuiper's by `cn`. Yours win a conflict.",
        "component",
      ),
    ).toEqual(["V7"]);
    expect(voiceFaults("x", "Ends with code: `a.b()`.", "component")).toEqual(
      [],
    );
    expect(voiceFaults("x", "Ends in a bracket (`x`.)", "component")).toEqual(
      [],
    );
  });
});

/** Every script of a file: a .ts file whole, a .svelte file's two scripts. */
function allSources(file: string, text = readFileSync(file, "utf8")) {
  if (file.endsWith(".ts"))
    return [ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)];
  if (!file.endsWith(".svelte")) return [];
  const ast = parse(text, { modern: true }) as unknown as {
    module?: { content: { start: number; end: number } };
    instance?: { content: { start: number; end: number } };
  };
  return [ast.module, ast.instance]
    .filter((s) => !!s)
    .map((s) =>
      ts.createSourceFile(
        file + ".ts",
        text.slice(s!.content.start, s!.content.end),
        ts.ScriptTarget.Latest,
        true,
      ),
    );
}

/**
 * V8, the change review's finding 1: a member has one doc comment block.
 * An editor shows only the last of two stacked blocks, so the first is lost
 * and the second may belong to another member.
 */
function stackedBlocks(sources: ts.SourceFile[]): string[] {
  const out: string[] = [];
  for (const sf of sources) {
    const visit = (n: ts.Node) => {
      if (
        (ts.isPropertySignature(n) || ts.isMethodSignature(n)) &&
        ((n as unknown as { jsDoc?: ts.JSDoc[] }).jsDoc?.length ?? 0) > 1
      )
        out.push(n.name.getText(sf));
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return out;
}

describe("023 test 4, V8: one doc comment block per member", () => {
  test("0 members in any item file carry two blocks", () => {
    const wrong: string[] = [];
    for (const f of new Set(ITEMS.flatMap((i) => i.files.map((x) => x.path))))
      for (const name of stackedBlocks(allSources(f)))
        wrong.push(`${f} ${name}`);
    expect(wrong).toEqual([]);
  });

  test("two stacked blocks fail it", () => {
    const text =
      "type T = {\n  /** One. */\n  /** Two. */\n  label: string;\n};";
    expect(stackedBlocks(allSources("x.ts", text))).toEqual(["label"]);
    expect(
      stackedBlocks(
        allSources("x.ts", "type T = {\n  /** One. */\n  a: 1;\n};"),
      ),
    ).toEqual([]);
  });
});

type PassThrough = {
  item: string;
  file: string;
  part: string;
  name: string;
  base: string;
};
const PASS = JSON.parse(
  readFileSync("tests/fixtures/023-pass-throughs.json", "utf8"),
) as {
  passThroughs: PassThrough[];
  declaredInUnion: Omit<PassThrough, "base">[];
};

describe('023 test 8: every re-declared pass-through is exactly Base["name"]', () => {
  const text = (n: ts.Node) => n.getText().replace(/\s+/g, " ");
  /** A member's fault, or "" when it is `Base["name"]` over one of the bases. */
  const fault = (
    name: string,
    m: ts.TypeElement | undefined,
    bases: string[],
    base?: string,
  ): string => {
    if (!m) return "not declared";
    if (!ts.isPropertySignature(m) || !m.type) return "not a property";
    if (!ts.isIndexedAccessTypeNode(m.type)) return `typed ${text(m.type)}`;
    const object = text(m.type.objectType);
    if (base !== undefined && object !== base) return `indexes ${object}`;
    if (!bases.includes(object)) return `${object} is not a base`;
    const index = m.type.indexType;
    if (
      !ts.isLiteralTypeNode(index) ||
      !ts.isStringLiteral(index.literal) ||
      index.literal.text !== name
    )
      return `index ${text(index)}`;
    return "";
  };

  test(`the fixture lists 105 pass-throughs, and 4 declared in a union`, () => {
    expect(PASS.passThroughs).toHaveLength(105);
    expect(PASS.declaredInUnion).toHaveLength(4);
  });

  test("each listed pass-through is declared in its item's own type, typed exactly its base's", () => {
    const wrong: string[] = [];
    for (const p of PASS.passThroughs) {
      const { bases, members } = propsType(p.file);
      const f = fault(p.name, members.get(p.name), bases, p.base);
      if (f) wrong.push(`${p.item} ${p.part}.${p.name}: ${f}`);
    }
    expect(wrong).toEqual([]);
  });

  test("any member typed as an indexed access to a base indexes its own name", () => {
    const wrong: string[] = [];
    for (const item of ITEMS)
      for (const f of item.files) {
        if (!f.path.endsWith(".svelte")) continue;
        const { bases, members } = propsType(f.path);
        for (const [name, m] of members) {
          if (
            !ts.isPropertySignature(m) ||
            !m.type ||
            !ts.isIndexedAccessTypeNode(m.type) ||
            !bases.includes(text(m.type.objectType))
          )
            continue;
          const why = fault(name, m, bases);
          if (why) wrong.push(`${item.name} ${f.path} ${name}: ${why}`);
        }
      }
    expect(wrong).toEqual([]);
  });

  test("a written-out type in place of the base's fails, naming button Button.href", () => {
    const source = ts.createSourceFile(
      "x.ts",
      "type P = { href?: string };",
      ts.ScriptTarget.Latest,
      true,
    );
    const lit = (source.statements[0] as ts.TypeAliasDeclaration)
      .type as ts.TypeLiteralNode;
    const { bases } = propsType("src/lib/registry/ui/button/button.svelte");
    expect(bases).toContain("HTMLAnchorAttributes");
    expect(
      `button Button.href: ${fault("href", lit.members[0], bases, "HTMLAnchorAttributes")}`,
    ).toBe("button Button.href: typed string");
  });
});
