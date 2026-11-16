/**
 * 026 tests 37, 38, 39, 41 and 43: the toast's registry entry, its changelog
 * bullet, its described API, its examples and pairs, and its section of the
 * 0.13.0 upgrade guide. Kept in one file of their own, so the wave's other
 * builds, which edit `registry.test.ts`, do not collide with them.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { apiTables } from "../../src/lib/site/api.server.ts";
import { EXAMPLE_ORDER } from "../../src/lib/site/example-order.ts";

type Item = {
  name: string;
  type: string;
  registryDependencies?: string[];
  files: { path: string; type: string }[];
  meta: { since: string; group: string; modes: string[] };
};
const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  items: Item[];
};
const item = registry.items.find((i) => i.name === "toast");
const DIR = "src/lib/registry/ui/toast";
const SIX = [
  "toast-queue.ts",
  "toast-words.ts",
  "toast.ts",
  "toaster.svelte",
  "toast.svelte",
  "index.ts",
];

describe("026: the registry entry", () => {
  test("37. toast is a registry:ui of five dependencies and one package", () => {
    expect(item).toBeDefined();
    expect(item!.type).toBe("registry:ui");
    expect(item!.registryDependencies).toEqual([
      "utils",
      "kuiper-theme",
      "status",
      "button",
      "spinner",
    ]);
    expect(item!.files.map((f) => path.basename(f.path)).sort()).toEqual(
      [...SIX].sort(),
    );
    for (const f of item!.files)
      expect(f.path.startsWith(`${DIR}/`)).toBe(true);
    expect(item!.meta).toMatchObject({
      since: "0.13.0",
      group: "feedback",
      modes: ["productive"],
    });
    // The built entry names one package, derived from the icon imports.
    const built = JSON.parse(
      readFileSync("static/r/styles/maia/toast.json", "utf8"),
    ) as { dependencies?: string[]; devDependencies?: string[] };
    expect([
      ...(built.dependencies ?? []),
      ...(built.devDependencies ?? []),
    ]).toEqual(["phosphor-svelte@^3.1.1"]);
    // The registry sits the toast with the feedback items, after the error
    // summary.
    const names = registry.items.map((i) => i.name);
    expect(names.indexOf("toast")).toBe(names.indexOf("error-summary") + 1);
  });

  test("the six files of decision 1, and index.ts exports decision 3's names and no others", () => {
    for (const f of SIX) expect(existsSync(path.join(DIR, f)), f).toBe(true);
    const index = readFileSync(path.join(DIR, "index.ts"), "utf8");
    const source = ts.createSourceFile(
      "index.ts",
      index,
      ts.ScriptTarget.Latest,
    );
    const exported: string[] = [];
    for (const st of source.statements)
      if (
        ts.isExportDeclaration(st) &&
        st.exportClause &&
        ts.isNamedExports(st.exportClause)
      )
        for (const e of st.exportClause.elements) exported.push(e.name.text);
    expect(exported.sort()).toEqual(
      [
        "toast",
        "Toaster",
        "Toast",
        "ToastKind",
        "ToastOptions",
        "ToastAction",
        "ToastCloseReason",
        "ToasterStrings",
        "TOAST_MIN_MS",
        "TOAST_MS_PER_WORD",
        "TOAST_PROMISE_GRACE_MS",
        "TOAST_ROUTE_HOLD_MS",
        "TOAST_MODAL_HOLD_MS",
      ].sort(),
    );
  });
});

describe("026: the changelog", () => {
  const log = readFileSync("CHANGELOG.md", "utf8");
  const entry = log.slice(log.indexOf("## 0.13.0"), log.indexOf("\n## 0.12.0"));
  const bullets = entry.split("\n").filter((l) => l.startsWith("- `toast`"));

  test("38. the 0.13.0 entry has one toast bullet, naming what an app must know", () => {
    expect(bullets).toHaveLength(1);
    const b = bullets[0]!;
    expect(b).toStartWith("- `toast`: new, a `registry:ui`.");
    for (const phrase of [
      "<Toaster />",
      "F8",
      "steps aside",
      "6 s",
      "`duration: Infinity`",
      '`timers="off"`',
      "2.2.1",
      "`toast.navigating()`",
      "`phosphor-svelte`",
    ])
      expect(b, phrase).toContain(phrase);
  });
});

describe("026: every prop and export described", () => {
  test("39. toast has 0 empty API rows", () => {
    const tables = apiTables(item!);
    const parts = tables.map((t) => t.part);
    for (const p of ["Toaster", "Toast", "toast"])
      expect(parts, p).toContain(p);
    const empty = tables.flatMap((t) =>
      t.rows
        .filter((r) => r.doc.trim() === "")
        .map((r) => `${t.part}.${r.name}`),
    );
    expect(empty).toEqual([]);
    const rows = (part: string) =>
      tables.find((t) => t.part === part)!.rows.map((r) => r.name);
    expect(rows("Toaster").sort()).toEqual(
      ["class", "hotkey", "max", "strings", "timers"].sort(),
    );
    expect(rows("Toast").sort()).toEqual(
      [
        "action",
        "as",
        "description",
        "kind",
        "ondismiss",
        "strings",
        "title",
        "titleId",
      ].sort(),
    );

    // Every member of ToastOptions carries a doc comment.
    const file = path.join(DIR, "toast-queue.ts");
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const options = source.statements.find(
      (s): s is ts.TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(s) && s.name.text === "ToastOptions",
    );
    expect(options).toBeDefined();
    const literal = options!.type as ts.TypeLiteralNode;
    const members = literal.members.map((m) => ({
      name: m.name!.getText(source),
      doc: ts.getJSDocCommentsAndTags(m).length > 0,
    }));
    expect(members.map((m) => m.name).sort()).toEqual(
      ["action", "description", "duration", "id", "onclose"].sort(),
    );
    expect(members.filter((m) => !m.doc)).toEqual([]);
  });
});

/** A pair file's `meta`, read as `exampleMeta` reads an example's. */
function pairMeta(text: string): Record<string, string> {
  const module =
    /<script[^>]*\bmodule\b[^>]*>([\s\S]*?)<\/script>/.exec(text)?.[1] ?? "";
  const source = ts.createSourceFile(
    "m.ts",
    module,
    ts.ScriptTarget.Latest,
    true,
  );
  const meta: Record<string, string> = {};
  for (const st of source.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      if (d.name.getText(source) !== "meta" || !d.initializer) continue;
      let init = d.initializer;
      while (ts.isSatisfiesExpression(init) || ts.isAsExpression(init))
        init = init.expression;
      if (!ts.isObjectLiteralExpression(init)) continue;
      for (const p of init.properties)
        if (ts.isPropertyAssignment(p) && ts.isStringLiteralLike(p.initializer))
          meta[p.name.getText(source)] = p.initializer.text;
    }
  }
  return meta;
}

describe("026: the page's examples and pairs", () => {
  const EXAMPLES = "src/lib/site/examples/toast";
  const ORDER = [
    "kinds",
    "raise",
    "action",
    "promise",
    "from-a-dialog",
    "setting",
    "keyboard",
    "route",
  ];

  test("41a. the eight examples, in order, each a file", () => {
    expect(EXAMPLE_ORDER.toast).toEqual(ORDER);
    for (const id of ORDER)
      expect(existsSync(path.join(EXAMPLES, `${id}.svelte`)), id).toBe(true);
    const files = readdirSync(EXAMPLES).filter((f) => f.endsWith(".svelte"));
    expect(
      files
        .filter((f) => !/^(do|dont)-/.test(f))
        .map((f) => f.replace(".svelte", ""))
        .sort(),
    ).toEqual([...ORDER].sort());
  });

  test("41b. three pairs: each file has kind, pair and a caption of 20 words or fewer; each don't has breaks", () => {
    const pairs = readdirSync(EXAMPLES)
      .filter((f) => /^(do|dont)-.*\.svelte$/.test(f))
      .sort();
    expect(pairs).toEqual(
      [
        "do-action.svelte",
        "do-result.svelte",
        "do-words.svelte",
        "dont-action.svelte",
        "dont-result.svelte",
        "dont-words.svelte",
      ].sort(),
    );
    for (const f of pairs) {
      const meta = pairMeta(readFileSync(path.join(EXAMPLES, f), "utf8"));
      const kind = f.startsWith("dont-") ? "dont" : "do";
      expect(meta.kind, f).toBe(kind);
      expect(meta.pair, f).toBe(
        f.replace(/^(do|dont)-/, "").replace(".svelte", ""),
      );
      expect(meta.caption?.length ?? 0, f).toBeGreaterThan(0);
      expect(meta.caption!.split(/\s+/).length, f).toBeLessThanOrEqual(20);
      if (kind === "dont")
        expect(meta.breaks?.length ?? 0, f).toBeGreaterThan(0);
      else expect(meta.breaks, f).toBeUndefined();
    }
  });

  test("41c. every specimen renders in an ol inside inert", () => {
    const specimens = readdirSync(EXAMPLES).filter(
      (f) => /^(do|dont)-.*\.svelte$/.test(f) || f === "kinds.svelte",
    );
    expect(specimens).toHaveLength(7);
    for (const f of specimens) {
      const text = readFileSync(path.join(EXAMPLES, f), "utf8");
      const markup = text.replace(/<script[\s\S]*?<\/script>/g, "");
      // Each <Toast> sits inside an <ol>, and each <ol> inside an inert element.
      const inert = /<(\w+)[^>]*\binert\b[^>]*>([\s\S]*)<\/\1>/.exec(markup);
      expect(inert, f).not.toBeNull();
      const inside = inert![2]!;
      const toasts = (markup.match(/<Toast\b/g) ?? []).length;
      expect(toasts, f).toBeGreaterThan(0);
      expect((inside.match(/<Toast\b/g) ?? []).length, f).toBe(toasts);
      const lists = inside.split(/<ol\b/).slice(1);
      const inLists = lists
        .map((l) => l.split("</ol>")[0]!)
        .reduce((n, l) => n + (l.match(/<Toast\b/g) ?? []).length, 0);
      expect(inLists, f).toBe(toasts);
    }
  });

  test("the page renders the eight examples in order, the pairs, and mounts one Toaster", () => {
    const page = readFileSync(
      "src/routes/(site)/components/toast/+page.svelte",
      "utf8",
    );
    expect(page.match(/<Toaster\b/g) ?? []).toHaveLength(1);
    for (const f of [
      "do-result",
      "dont-result",
      "do-words",
      "dont-words",
      "do-action",
      "dont-action",
    ])
      expect(page, f).toContain(`examples/toast/${f}.svelte`);
  });
});

describe("026: the upgrade guide", () => {
  test("43. the 0.13.0 guide has a 026 section naming toast.caution, duration: Infinity, sonner and svelte-sonner", async () => {
    const { SECTIONS } = await import("../../src/lib/site/upgrade/0.13.0.ts");
    const section = SECTIONS.find((s) => s.spec === "026");
    expect(section).toBeDefined();
    expect(section!.title).toBe("026: a toast of Kuiper's own");
    const text = [section!.summary, ...section!.steps.map((s) => s.text)].join(
      "\n",
    );
    for (const phrase of [
      "`toast.caution`",
      "`duration: Infinity`",
      "`sonner`",
      "`svelte-sonner`",
    ])
      expect(text, phrase).toContain(phrase);
  });
});
