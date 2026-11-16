/**
 * An example file as the site shows it, and what the site reads from it.
 * Pure, so the unit test calls it on the files directly; `examples.ts`
 * wraps it for the pages.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { ALIAS_MAP } from "./files.ts";

export type ExampleMeta = {
  title: string;
  /** One sentence, shown under the title. */
  intro: string;
  /** A height the other-theme frame keeps, so an overlay fits inside it. */
  frameMinHeight?: number;
  /** `false` for an example that is code only. */
  live?: boolean;
};

/**
 * 026 decision 22: a do or don't pair file, `do-<pair>.svelte` or
 * `dont-<pair>.svelte`, beside an item's examples (the page standard's
 * names). It is drawn in the page's Usage lists, never as an example frame.
 */
export const PAIR_FILE = /^(?:do|dont)-[^/]*\.svelte$/;

/** True when `file`, a name or a path, is a pair file: the one test of `PAIR_FILE`. */
export function isPairFile(file: string): boolean {
  return PAIR_FILE.test(path.basename(file));
}

/** The `meta` an example's module script exports. */
export function exampleMeta(text: string): ExampleMeta {
  const module =
    /<script[^>]*\bmodule\b[^>]*>([\s\S]*?)<\/script>/.exec(text)?.[1] ?? "";
  const source = ts.createSourceFile(
    "m.ts",
    module,
    ts.ScriptTarget.Latest,
    true,
  );
  const meta: Record<string, unknown> = {};
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const d of statement.declarationList.declarations) {
      if (d.name.getText(source) !== "meta" || !d.initializer) continue;
      let init = d.initializer;
      while (ts.isSatisfiesExpression(init) || ts.isAsExpression(init))
        init = init.expression;
      if (!ts.isObjectLiteralExpression(init)) continue;
      for (const p of init.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = p.name.getText(source);
        const v = p.initializer;
        if (ts.isStringLiteralLike(v)) meta[key] = v.text;
        else if (ts.isNumericLiteral(v)) meta[key] = Number(v.text);
        else if (v.kind === ts.SyntaxKind.TrueKeyword) meta[key] = true;
        else if (v.kind === ts.SyntaxKind.FalseKeyword) meta[key] = false;
      }
    }
  }
  return {
    title: String(meta.title ?? ""),
    intro: String(meta.intro ?? ""),
    ...(typeof meta.frameMinHeight === "number"
      ? { frameMinHeight: meta.frameMinHeight }
      : {}),
    ...(meta.live === false ? { live: false } : {}),
  };
}

/**
 * The file as an app writes it: the import paths `shadcn-svelte init`
 * writes in a SvelteKit 3 app, no `data-testid`, no `meta` export, and no
 * lines between `<!-- site:hide -->` and `<!-- site:show -->` (in a script,
 * `// site:hide` and `// site:show`).
 */
export function shownSource(text: string): string {
  let out = text;
  // The module script that holds only `meta` goes whole; otherwise the
  // `meta` export alone goes.
  out = out.replace(
    /<script([^>]*)\bmodule\b([^>]*)>([\s\S]*?)<\/script>\n*/,
    (_all, a: string, b: string, body: string) => {
      const source = ts.createSourceFile(
        "m.ts",
        body,
        ts.ScriptTarget.Latest,
        true,
      );
      let rest = body;
      for (const st of [...source.statements].reverse())
        if (
          ts.isVariableStatement(st) &&
          st.declarationList.declarations.some(
            (d) => d.name.getText(source) === "meta",
          )
        )
          rest = rest.slice(0, st.getFullStart()) + rest.slice(st.getEnd());
      return rest.trim()
        ? `<script${a}module${b}>\n${rest.replace(/^\n+/, "").replace(/\s+$/, "")}\n</script>\n\n`
        : "";
    },
  );
  out = out.replace(
    /[ \t]*<!-- site:hide -->[\s\S]*?<!-- site:show -->[ \t]*\n?/g,
    "",
  );
  out = out.replace(
    /[ \t]*\/\/ site:hide\n[\s\S]*?\/\/ site:show[ \t]*\n?/g,
    "",
  );
  out = out.replace(/\s+data-testid=("[^"]*"|\{[^}]*\})/g, "");
  for (const [from, to] of ALIAS_MAP) out = out.split(from).join(to);
  return out.replace(/^\n+/, "");
}

type Item = { name: string; registryDependencies?: string[] };

/** The item brings `theme`, directly or through anything it brings. */
export function bringsTheme(name: string, items: Item[]): boolean {
  const seen = new Set<string>();
  const walk = (n: string): boolean => {
    if (n === "theme") return true;
    if (seen.has(n)) return false;
    seen.add(n);
    const item = items.find((i) => i.name === n);
    return (item?.registryDependencies ?? []).some(walk);
  };
  return (
    (items.find((i) => i.name === name)?.registryDependencies ?? []).some(
      walk,
    ) || name === "theme"
  );
}

/**
 * Whether an example's frame has a Light | Dark switch: not when its item
 * brings `theme` (its own toggle changes the page's theme), and not for a
 * code-only example.
 */
export function hasSwitch(
  name: string,
  meta: ExampleMeta,
  items: Item[],
): boolean {
  return meta.live !== false && !bringsTheme(name, items);
}

/** `#lib/…` resolved as this repository's `package.json` `imports` map resolves it. */
function resolve(spec: string, from: string): string | null {
  let base: string;
  if (spec.startsWith("#lib/")) base = path.join("src/lib", spec.slice(5));
  else if (spec === "#lib") base = "src/lib";
  else if (spec.startsWith(".")) base = path.join(path.dirname(from), spec);
  else return null;
  for (const candidate of [
    base,
    `${base}.ts`,
    path.join(base, "index.ts"),
    `${base}.js`,
  ])
    if (existsSync(candidate) && !candidate.endsWith("/")) {
      try {
        readFileSync(candidate);
        return candidate;
      } catch {
        /* a folder */
      }
    }
  return null;
}

/** Every file an example imports, directly or through the files it imports, in this repository. */
export function importGraph(file: string): string[] {
  const seen = new Set<string>();
  const walk = (f: string) => {
    if (seen.has(f)) return;
    seen.add(f);
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(
      /(?:import|export)\s[^"';]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g,
    )) {
      const next = resolve(m[1] ?? m[2], f);
      if (next) walk(next);
    }
  };
  walk(file);
  seen.delete(file);
  return [...seen];
}
