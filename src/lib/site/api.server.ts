/**
 * An item's API, read from its own source at build time: for a Svelte
 * component, the props it takes, their types, defaults and doc comments,
 * and what it inherits; for a TypeScript file, what it exports. A
 * hand-written table would drift from the code the visitor installs.
 *
 * `svelte/compiler`'s `parse` reaches a component's scripts; TypeScript's
 * parser reads them. Pure but for reading files, so the unit test calls it.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "svelte/compiler";
import ts from "typescript";

export type ApiRow = {
  name: string;
  type: string;
  default: string;
  /** The member's doc comment; empty when it has none. */
  doc: string;
};

export type ApiTable = {
  /** The part's name, as the item's index.ts exports it, or the file's. */
  part: string;
  file: string;
  kind: "component" | "module";
  rows: ApiRow[];
  /** The closing row: "every attribute of `<button>`", or bits-ui's props. */
  inherits?: string;
};

type Item = { name: string; files: { path: string; type: string }[] };

/** A file's text, for a source path or a `#lib/…` import. */
function read(file: string): string {
  return readFileSync(file, "utf8");
}

function resolveImport(spec: string, from: string): string | null {
  let base: string;
  if (spec.startsWith("#lib/")) base = path.join("src/lib", spec.slice(5));
  else if (spec.startsWith(".")) base = path.join(path.dirname(from), spec);
  else return null;
  for (const c of [base, `${base}.ts`, path.join(base, "index.ts")])
    if (existsSync(c) && /\.(ts|svelte)$/.test(c)) return c;
  return null;
}

type Script = { source: ts.SourceFile; file: string };

/** A Svelte file's two scripts, or a TypeScript file, as TypeScript sources. */
function scripts(file: string): Script[] {
  const text = read(file);
  if (file.endsWith(".ts"))
    return [
      {
        source: ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true),
        file,
      },
    ];
  const ast = parse(text, { modern: true }) as unknown as {
    module?: { content: { start: number; end: number } };
    instance?: { content: { start: number; end: number } };
  };
  const out: Script[] = [];
  for (const s of [ast.module, ast.instance])
    if (s)
      out.push({
        source: ts.createSourceFile(
          file + ".ts",
          text.slice(s.content.start, s.content.end),
          ts.ScriptTarget.Latest,
          true,
        ),
        file,
      });
  return out;
}

const JSDOC = (node: ts.Node): string => {
  const docs = (node as unknown as { jsDoc?: ts.JSDoc[] }).jsDoc;
  if (!docs?.length) return "";
  const c = docs[docs.length - 1].comment;
  const text =
    typeof c === "string" ? c : (c ?? []).map((p) => p.text).join("");
  return text.replace(/\s+/g, " ").trim();
};

/** Finds a type alias or interface by name in the scripts, or in a file they import it from. */
function findType(
  name: string,
  where: Script[],
  depth = 0,
): { node: ts.TypeNode | ts.InterfaceDeclaration; where: Script[] } | null {
  for (const s of where)
    for (const st of s.source.statements) {
      if (ts.isTypeAliasDeclaration(st) && st.name.text === name)
        return { node: st.type, where };
      if (ts.isInterfaceDeclaration(st) && st.name.text === name)
        return { node: st, where };
    }
  if (depth > 3) return null;
  for (const s of where)
    for (const st of s.source.statements) {
      if (!ts.isImportDeclaration(st) || !st.importClause?.namedBindings)
        continue;
      const bindings = st.importClause.namedBindings;
      if (!ts.isNamedImports(bindings)) continue;
      const hit = bindings.elements.find((e) => e.name.text === name);
      if (!hit) continue;
      const spec = (st.moduleSpecifier as ts.StringLiteral).text;
      const file = resolveImport(spec, s.file);
      if (!file) continue;
      const original = hit.propertyName?.text ?? name;
      const found = findType(original, scripts(file), depth + 1);
      if (found) return found;
      // An index.ts that re-exports from a component's module script.
      if (file.endsWith("index.ts")) {
        for (const st2 of scripts(file)[0].source.statements) {
          if (!ts.isImportDeclaration(st2)) continue;
          const f2 = resolveImport(
            (st2.moduleSpecifier as ts.StringLiteral).text,
            file,
          );
          if (f2?.endsWith(".svelte")) {
            const deep = findType(original, scripts(f2), depth + 1);
            if (deep) return deep;
          }
        }
      }
    }
  return null;
}

/** `tv({ variants: { key: { a, b } } })` bound to `name`, as `"a" | "b"` for each key. */
function variantKeys(
  name: string,
  where: Script[],
): Record<string, string> | null {
  for (const s of where)
    for (const st of s.source.statements) {
      if (!ts.isVariableStatement(st)) continue;
      for (const d of st.declarationList.declarations) {
        if (d.name.getText(s.source) !== name || !d.initializer) continue;
        if (!ts.isCallExpression(d.initializer)) continue;
        const arg = d.initializer.arguments[0];
        if (!arg || !ts.isObjectLiteralExpression(arg)) continue;
        const variants = arg.properties.find(
          (p) =>
            ts.isPropertyAssignment(p) &&
            p.name.getText(s.source) === "variants",
        ) as ts.PropertyAssignment | undefined;
        if (!variants || !ts.isObjectLiteralExpression(variants.initializer))
          return {};
        const out: Record<string, string> = {};
        for (const v of variants.initializer.properties) {
          if (
            !ts.isPropertyAssignment(v) ||
            !ts.isObjectLiteralExpression(v.initializer)
          )
            continue;
          out[v.name.getText(s.source).replace(/["']/g, "")] =
            v.initializer.properties
              .map(
                (k) =>
                  `"${(k.name as ts.PropertyName).getText(s.source).replace(/["']/g, "")}"`,
              )
              .join(" | ");
        }
        return out;
      }
    }
  return null;
}

/** A type as a reader can use it: `VariantProps<typeof x>["k"]`, directly or by alias, as its keys. */
function showType(node: ts.TypeNode, where: Script[], depth = 0): string {
  const text = node.getText().replace(/\s+/g, " ");
  const vp = /^VariantProps<\s*typeof (\w+)\s*>\["(\w+)"\]$/.exec(text);
  if (vp) {
    const keys = variantKeys(vp[1], where);
    if (keys?.[vp[2]]) return keys[vp[2]];
  }
  if (depth < 3 && ts.isTypeReferenceNode(node) && !node.typeArguments) {
    const found = findType(node.typeName.getText(), where);
    if (found && !ts.isInterfaceDeclaration(found.node)) {
      const shown = showType(found.node, found.where, depth + 1);
      if (shown !== found.node.getText().replace(/\s+/g, " ")) return shown;
    }
  }
  return text;
}

const ELEMENTS: Record<string, string> = {
  HTMLButtonAttributes: "button",
  HTMLAnchorAttributes: "a",
  HTMLInputAttributes: "input",
  HTMLTextareaAttributes: "textarea",
  HTMLSelectAttributes: "select",
  HTMLImgAttributes: "img",
  HTMLLabelAttributes: "label",
  HTMLTableAttributes: "table",
  HTMLTdAttributes: "td",
  HTMLThAttributes: "th",
  HTMLOlAttributes: "ol",
  HTMLLiAttributes: "li",
  HTMLFormAttributes: "form",
  HTMLMeterAttributes: "meter",
  HTMLProgressAttributes: "progress",
  HTMLDetailsAttributes: "details",
};

const TAGS: Record<string, string> = {
  HTMLDivElement: "div",
  HTMLSpanElement: "span",
  HTMLParagraphElement: "p",
  HTMLHeadingElement: "h2",
  HTMLUListElement: "ul",
  HTMLOListElement: "ol",
  HTMLLIElement: "li",
  HTMLElement: "an element",
  HTMLTableElement: "table",
  HTMLTableSectionElement: "tbody",
  HTMLTableRowElement: "tr",
  HTMLTableCellElement: "td",
  HTMLTableCaptionElement: "caption",
  HTMLPreElement: "pre",
  HTMLAnchorElement: "a",
  HTMLButtonElement: "button",
  HTMLImageElement: "img",
  HTMLFormElement: "form",
  HTMLElementTagNameMap: "an element",
  SVGSVGElement: "svg",
  HTMLHRElement: "hr",
  HTMLLabelElement: "label",
};

const WRAPPERS = new Set([
  "WithElementRef",
  "WithoutChildrenOrChild",
  "WithoutChildren",
  "WithoutChild",
  "Omit",
  "Pick",
  "Partial",
  "Readonly",
]);

type Shape = { members: ts.TypeElement[]; inherits: string[]; where: Script[] };

/** The item's own files: a props type found outside them is inherited, by name. */
let OWN = new Set<string>();

/** A props type's own members, and the names of what it inherits. */
function shape(
  node: ts.TypeNode | ts.InterfaceDeclaration,
  where: Script[],
  depth = 0,
): Shape {
  const out: Shape = { members: [], inherits: [], where };
  const add = (s: Shape) => {
    out.members.push(...s.members);
    out.inherits.push(...s.inherits);
  };
  if (ts.isInterfaceDeclaration(node)) {
    out.members.push(...node.members);
    for (const h of node.heritageClauses ?? [])
      for (const t of h.types) out.inherits.push(t.expression.getText());
    return out;
  }
  if (ts.isParenthesizedTypeNode(node)) return shape(node.type, where, depth);
  if (ts.isTypeLiteralNode(node)) {
    out.members.push(...node.members);
    return out;
  }
  if (ts.isIntersectionTypeNode(node)) {
    for (const t of node.types) add(shape(t, where, depth));
    return out;
  }
  if (ts.isTypeReferenceNode(node)) {
    const name = node.typeName.getText();
    const bare = name.split(".").pop()!;
    if (WRAPPERS.has(bare) && node.typeArguments?.[0])
      return shape(node.typeArguments[0], where, depth);
    if (bare === "HTMLAttributes" || bare === "SVGAttributes") {
      const tag = node.typeArguments?.[0]?.getText() ?? "HTMLElement";
      out.inherits.push(`<${TAGS[tag] ?? "an element"}>`);
      return out;
    }
    if (ELEMENTS[bare]) {
      out.inherits.push(`<${ELEMENTS[bare]}>`);
      return out;
    }
    if (name.includes(".")) {
      out.inherits.push(name);
      return out;
    }
    if (depth < 4) {
      const found = findType(name, where);
      if (found && !found.where.some((w) => OWN.has(w.file))) {
        out.inherits.push(name);
        return out;
      }
      if (found) {
        const inner = shape(found.node, found.where, depth + 1);
        inner.where = found.where;
        add(inner);
        return out;
      }
    }
    out.inherits.push(name);
    return out;
  }
  return out;
}

/** "every attribute of `<button>`", "the props of bits-ui's `Dialog.Content`". */
function inheritsText(names: string[], where: Script[]): string | undefined {
  const parts: string[] = [];
  for (const n of [...new Set(names)]) {
    if (n.startsWith("<")) {
      parts.push(
        n === "<an element>"
          ? "every attribute of an element"
          : `every attribute of \`${n}\``,
      );
      continue;
    }
    const [ns, member] = n.split(".");
    if (member) {
      // `Dialog as DialogPrimitive` from bits-ui: the primitive's own name.
      let lib = "";
      let original = ns;
      for (const s of where)
        for (const st of s.source.statements) {
          if (!ts.isImportDeclaration(st) || !st.importClause?.namedBindings)
            continue;
          const b = st.importClause.namedBindings;
          if (!ts.isNamedImports(b)) continue;
          const hit = b.elements.find((e) => e.name.text === ns);
          if (hit) {
            lib = (st.moduleSpecifier as ts.StringLiteral).text;
            original = hit.propertyName?.text ?? ns;
          }
        }
      const part = member.replace(/Props$/, "");
      parts.push(
        `the props of ${lib ? `${lib}'s ` : ""}\`${original}${part && part !== "" ? "." + part : ""}\``,
      );
      continue;
    }
    parts.push(`the props of \`${n.replace(/Props$/, "")}\``);
  }
  return parts.length ? `and ${parts.join(", and ")}` : undefined;
}

const WELL_KNOWN: Record<string, string> = {
  class: "string",
  ref: "HTMLElement | null",
  children: "Snippet",
  child: "Snippet",
};

/** One Svelte component's props table. */
function componentTable(file: string, part: string): ApiTable {
  const ss = scripts(file);
  const instance = ss[ss.length - 1];
  const table: ApiTable = { part, file, kind: "component", rows: [] };
  if (!instance) return table;
  let binding: ts.ObjectBindingPattern | null = null;
  let typeNode: ts.TypeNode | undefined;
  const visit = (n: ts.Node) => {
    if (
      ts.isVariableDeclaration(n) &&
      n.initializer &&
      ts.isCallExpression(n.initializer) &&
      n.initializer.expression.getText() === "$props" &&
      ts.isObjectBindingPattern(n.name)
    ) {
      binding = n.name;
      typeNode = n.type;
    }
    ts.forEachChild(n, visit);
  };
  visit(instance.source);
  if (!binding) return table;
  const s: Shape = typeNode
    ? shape(typeNode, ss)
    : { members: [], inherits: [], where: ss };
  const own = new Map<string, ts.TypeElement>();
  for (const m of s.members)
    if (m.name) own.set(m.name.getText().replace(/["']/g, ""), m);

  const listed = new Set<string>();
  for (const el of (binding as ts.ObjectBindingPattern).elements) {
    if (el.dotDotDotToken) continue;
    const name = (el.propertyName ?? el.name).getText();
    listed.add(name);
    let def = el.initializer?.getText() ?? "";
    const bindable = /^\$bindable\((.*)\)$/s.exec(def);
    if (bindable) def = bindable[1];
    const m = own.get(name);
    const type =
      m && ts.isPropertySignature(m) && m.type
        ? showType(m.type, s.where)
        : m && ts.isMethodSignature(m)
          ? m.getText().replace(/\s+/g, " ")
          : (WELL_KNOWN[name] ?? "");
    table.rows.push({
      name,
      type,
      default: def.replace(/\s+/g, " "),
      doc: m ? JSDOC(m) : "",
    });
  }
  // Members the component declares but passes on without naming.
  for (const [name, m] of own) {
    if (listed.has(name)) continue;
    const type =
      ts.isPropertySignature(m) && m.type ? showType(m.type, s.where) : "";
    table.rows.push({ name, type, default: "", doc: JSDOC(m) });
  }
  table.inherits = inheritsText(s.inherits, ss);
  return table;
}

/** A TypeScript file's exports, one row each. */
function moduleTable(file: string, part: string): ApiTable {
  const [{ source }] = scripts(file);
  const rows: ApiRow[] = [];
  const exported = (n: ts.Node) =>
    (ts.getCombinedModifierFlags(n as ts.Declaration) &
      ts.ModifierFlags.Export) !==
    0;
  for (const st of source.statements) {
    if (ts.isFunctionDeclaration(st) && st.name && exported(st)) {
      const params = st.parameters.map((p) => p.getText()).join(", ");
      const ret = st.type ? `: ${st.type.getText()}` : "";
      rows.push({
        name: st.name.text,
        type: `(${params})${ret}`.replace(/\s+/g, " "),
        default: "",
        doc: JSDOC(st),
      });
    } else if (ts.isVariableStatement(st) && exported(st)) {
      for (const d of st.declarationList.declarations) {
        let type = d.type?.getText() ?? "";
        const init = d.initializer;
        if (!type && init) {
          if (ts.isStringLiteralLike(init)) type = "string";
          else if (ts.isNumericLiteral(init)) type = "number";
          else if (
            init.kind === ts.SyntaxKind.TrueKeyword ||
            init.kind === ts.SyntaxKind.FalseKeyword
          )
            type = "boolean";
          else if (ts.isNewExpression(init)) type = init.expression.getText();
        }
        if (
          !type &&
          d.initializer &&
          (ts.isArrowFunction(d.initializer) ||
            ts.isFunctionExpression(d.initializer))
        ) {
          const f = d.initializer;
          type = `(${f.parameters.map((p) => p.getText()).join(", ")})${f.type ? `: ${f.type.getText()}` : ""}`;
        }
        rows.push({
          name: d.name.getText(),
          type: type.replace(/\s+/g, " "),
          default: "",
          doc: JSDOC(st),
        });
      }
    } else if (ts.isClassDeclaration(st) && st.name && exported(st)) {
      rows.push({
        name: st.name.text,
        type: "class",
        default: "",
        doc: JSDOC(st),
      });
    } else if (
      (ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st)) &&
      exported(st)
    ) {
      rows.push({
        name: st.name.text,
        type: "type",
        default: "",
        doc: JSDOC(st),
      });
    }
  }
  return { part, file, kind: "module", rows };
}

/** The order and names of an item's parts, from its index.ts: file path to exported name. */
function indexOrder(files: string[]): Map<string, string> {
  const order = new Map<string, string>();
  const index = files.find((f) => f.endsWith("/index.ts"));
  if (!index) return order;
  const [{ source }] = scripts(index);
  const local = new Map<string, string>(); // local import name → file
  for (const st of source.statements) {
    if (ts.isImportDeclaration(st) && st.importClause?.name) {
      const file = resolveImport(
        (st.moduleSpecifier as ts.StringLiteral).text,
        index,
      );
      if (file) local.set(st.importClause.name.text, file);
    }
  }
  const pretty = new Map<string, string>(); // local name → its public alias
  for (const st of source.statements) {
    if (
      !ts.isExportDeclaration(st) ||
      !st.exportClause ||
      !ts.isNamedExports(st.exportClause)
    )
      continue;
    for (const e of st.exportClause.elements) {
      const from = e.propertyName?.text ?? e.name.text;
      if (e.propertyName && local.has(from)) pretty.set(from, e.name.text);
    }
    for (const e of st.exportClause.elements) {
      const from = e.propertyName?.text ?? e.name.text;
      const file = local.get(from);
      if (file && !order.has(file))
        order.set(file, pretty.get(from) ?? e.name.text);
    }
  }
  return order;
}

const pascal = (file: string) =>
  path
    .basename(file)
    .replace(/\.(svelte|ts)$/, "")
    .replace(/\.svelte$/, "")
    .split(/[-+]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

/** One table per exported part, in the order of the item's index.ts; then its other files. */
export function apiTables(item: Item): ApiTable[] {
  const files = item.files
    .map((f) => f.path)
    .filter((f) => /\.(svelte|ts)$/.test(f));
  OWN = new Set(files);
  const order = indexOrder(files);
  const ordered = [
    ...[...order.keys()].filter((f) => files.includes(f)),
    ...files.filter((f) => !order.has(f) && !f.endsWith("/index.ts")),
  ];
  const tables: ApiTable[] = [];
  for (const file of ordered) {
    const part = order.get(file) ?? pascal(file);
    const t = file.endsWith(".svelte")
      ? componentTable(file, part)
      : moduleTable(file, part);
    if (t.rows.length || t.inherits) tables.push(t);
  }
  return tables;
}
