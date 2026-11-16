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
  /** Only with `{ marks: true }`: the site wrote `doc` from the markup. */
  generated?: boolean;
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

/** A node of `svelte/compiler`'s modern AST, as far as this file reads it. */
type SvelteNode = {
  type: string;
  name?: string;
  [key: string]: unknown;
};

type SvelteAst = {
  module?: { content: { start: number; end: number } };
  instance?: { content: { start: number; end: number } };
  fragment: SvelteNode;
};

/** A component's modern AST. */
function svelteAst(file: string): SvelteAst {
  return parse(read(file), { modern: true }) as unknown as SvelteAst;
}

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
  const ast = svelteAst(file);
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

/**
 * A type as a reader can use it: `VariantProps<typeof x>["k"]`, directly or
 * by alias, as its keys. A member re-declared as `Base["name"]`, where
 * `Base` is one of the props type's bases and `name` its own name, shows
 * as inherited (`""`), as it did before it was re-declared.
 */
function showType(
  node: ts.TypeNode,
  where: Script[],
  depth = 0,
  own?: { name: string; bases: string[] },
): string {
  const text = node.getText().replace(/\s+/g, " ");
  const vp = /^VariantProps<\s*typeof (\w+)\s*>\["(\w+)"\]$/.exec(text);
  if (vp) {
    const keys = variantKeys(vp[1], where);
    if (keys?.[vp[2]]) return keys[vp[2]];
  }
  if (own && ts.isIndexedAccessTypeNode(node)) {
    const index = node.indexType;
    if (
      ts.isLiteralTypeNode(index) &&
      ts.isStringLiteral(index.literal) &&
      index.literal.text === own.name &&
      own.bases.includes(node.objectType.getText().replace(/\s+/g, " "))
    )
      return "";
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

type Shape = {
  members: ts.TypeElement[];
  inherits: string[];
  where: Script[];
  /** Members declared in a branch of a union: their comments, not their types. */
  branches: ts.TypeElement[];
};

/** The item's own files: a props type found outside them is inherited, by name. */
let OWN = new Set<string>();

/** A props type's own members, and the names of what it inherits. */
function shape(
  node: ts.TypeNode | ts.InterfaceDeclaration,
  where: Script[],
  depth = 0,
): Shape {
  const out: Shape = { members: [], inherits: [], where, branches: [] };
  const add = (s: Shape) => {
    out.members.push(...s.members);
    out.inherits.push(...s.inherits);
    out.branches.push(...s.branches);
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
  if (ts.isUnionTypeNode(node)) {
    for (const t of node.types) {
      const b = shape(t, where, depth);
      out.branches.push(...b.members, ...b.branches);
    }
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

/**
 * The types a props annotation joins, once `WRAPPERS` are removed and the
 * item's own aliases are followed: Button's are `HTMLButtonAttributes` and
 * `HTMLAnchorAttributes`. An own alias that names one other type, such as
 * `ToggleVariants`, is a base by its own name.
 */
function bases(node: ts.TypeNode, where: Script[], depth = 0): string[] {
  if (ts.isParenthesizedTypeNode(node)) return bases(node.type, where, depth);
  if (ts.isIntersectionTypeNode(node))
    return node.types.flatMap((t) => bases(t, where, depth));
  if (ts.isTypeLiteralNode(node) || ts.isUnionTypeNode(node)) return [];
  const text = node.getText().replace(/\s+/g, " ");
  if (!ts.isTypeReferenceNode(node)) return [text];
  const name = node.typeName.getText();
  // `WithElementRef<X>` adds `ref`, so it is a base itself, beside X's.
  const bare = name.split(".").pop()!;
  if (WRAPPERS.has(bare) && node.typeArguments?.[0])
    return [
      ...(bare === "WithElementRef" ? [text] : []),
      ...bases(node.typeArguments[0], where, depth),
    ];
  if (name.includes(".") || node.typeArguments || depth > 3) return [text];
  const found = findType(name, where);
  if (
    !found ||
    ts.isInterfaceDeclaration(found.node) ||
    !found.where.some((w) => OWN.has(w.file))
  )
    return [text];
  const t = found.node;
  const structural =
    ts.isIntersectionTypeNode(t) ||
    ts.isParenthesizedTypeNode(t) ||
    ts.isTypeLiteralNode(t) ||
    (ts.isTypeReferenceNode(t) &&
      WRAPPERS.has(t.typeName.getText().split(".").pop()!));
  return structural ? bases(t, found.where, depth + 1) : [text];
}

/** A component's `$props()` destructuring and its annotation. */
function propsBinding(instance: Script): {
  binding: ts.ObjectBindingPattern | null;
  typeNode?: ts.TypeNode;
} {
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
  return { binding, typeNode };
}

/**
 * A component's own props type: its bases, and the members its own files
 * declare, by name. Pure but for reading files; the unit tests read it.
 */
export function propsType(file: string): {
  bases: string[];
  members: Map<string, ts.TypeElement>;
} {
  const members = new Map<string, ts.TypeElement>();
  if (!file.endsWith(".svelte")) return { bases: [], members };
  const ss = scripts(file);
  const instance = ss[ss.length - 1];
  if (!instance) return { bases: [], members };
  const { typeNode } = propsBinding(instance);
  if (!typeNode) return { bases: [], members };
  const before = OWN;
  OWN = new Set([...OWN, file]);
  try {
    for (const m of shape(typeNode, ss).members)
      if (m.name) members.set(m.name.getText().replace(/["']/g, ""), m);
    return { bases: bases(typeNode, ss), members };
  } finally {
    OWN = before;
  }
}

/** Where a universal prop lands: an element, a bits-ui part, a Kuiper part. */
type Target = { kind: "element" | "bits" | "kuiper"; name: string } | null;

const TARGETS = ["RegularElement", "Component", "SvelteElement"];

/**
 * The universal three, `class`, `ref` and `children`, described from the
 * component's markup: the element or component each reaches, by name. A
 * target with no name (`<svelte:element>`, a third-party component), a
 * render inside a snippet, or more than two names leaves the row empty,
 * for the item's own comment.
 */
function universalDocs(
  file: string,
  locals: { ref?: string; class?: string; children?: string },
  ss: Script[],
): Partial<Record<"ref" | "class" | "children", string>> {
  // Each import's local name: where it is from, and its original name.
  const imports = new Map<string, { from: string; original: string }>();
  for (const s of ss)
    for (const st of s.source.statements) {
      if (!ts.isImportDeclaration(st) || !st.importClause) continue;
      const from = (st.moduleSpecifier as ts.StringLiteral).text;
      const c = st.importClause;
      if (c.name) imports.set(c.name.text, { from, original: c.name.text });
      const b = c.namedBindings;
      if (b && ts.isNamespaceImport(b))
        imports.set(b.name.text, { from, original: b.name.text });
      if (b && ts.isNamedImports(b))
        for (const e of b.elements)
          imports.set(e.name.text, {
            from,
            original: e.propertyName?.text ?? e.name.text,
          });
    }

  const nameOf = (node: SvelteNode): Target => {
    if (node.type === "RegularElement")
      return { kind: "element", name: node.name! };
    if (node.type !== "Component") return null;
    const [head, ...rest] = node.name!.split(".");
    const imp = imports.get(head);
    if (!imp) return null;
    if (imp.from === "bits-ui")
      return { kind: "bits", name: [imp.original, ...rest].join(".") };
    if (imp.from.startsWith("#lib/registry/") || imp.from.startsWith("."))
      return { kind: "kuiper", name: head };
    return null;
  };

  const isIdent = (e: unknown, name?: string): boolean =>
    !!name &&
    !!e &&
    (e as SvelteNode).type === "Identifier" &&
    (e as SvelteNode).name === name;

  const found = {
    ref: [] as Target[],
    class: [] as Target[],
    children: [] as Target[],
  };
  const forms = new Set<"merged" | "plain">();

  const classForm = (a: SvelteNode): "merged" | "plain" | null => {
    const v = a.value as SvelteNode | SvelteNode[] | true;
    const tag = Array.isArray(v) ? (v.length === 1 ? v[0] : null) : v;
    if (!tag || tag === true || tag.type !== "ExpressionTag") return null;
    const e = tag.expression as SvelteNode;
    if (isIdent(e, locals.class)) return "plain";
    if (e.type !== "CallExpression" || !isIdent(e.callee, "cn")) return null;
    const args = e.arguments as SvelteNode[];
    if (!isIdent(args[args.length - 1], locals.class)) return null;
    return args.length === 1 ? "plain" : "merged";
  };

  const visit = (node: SvelteNode, stack: SvelteNode[]) => {
    if (TARGETS.includes(node.type))
      for (const a of (node.attributes as SvelteNode[]) ?? []) {
        if (
          a.type === "BindDirective" &&
          (a.name === "this" || a.name === "ref") &&
          isIdent(a.expression, locals.ref)
        )
          found.ref.push(nameOf(node));
        if (a.type === "Attribute" && a.name === "class" && locals.class) {
          const form = classForm(a);
          if (!form) continue;
          found.class.push(nameOf(node));
          forms.add(form);
        }
      }
    if (node.type === "RenderTag" && locals.children) {
      let e = node.expression as SvelteNode;
      if (e.type === "ChainExpression") e = e.expression as SvelteNode;
      if (e.type === "CallExpression" && isIdent(e.callee, locals.children)) {
        // The nearest element or component around it; a snippet stops the walk.
        let t: Target = null;
        for (let k = stack.length - 1; k >= 0; k--) {
          if (stack[k].type === "SnippetBlock") break;
          if (TARGETS.includes(stack[k].type)) {
            t = nameOf(stack[k]);
            break;
          }
        }
        found.children.push(t);
      }
    }
    const next = [...stack, node];
    for (const [k, v] of Object.entries(node))
      if (
        k !== "attributes" &&
        v &&
        typeof v === "object" &&
        (v as SvelteNode).type === "Fragment"
      )
        for (const n of ((v as SvelteNode).nodes as SvelteNode[]) ?? [])
          visit(n, next);
  };
  for (const n of (svelteAst(file).fragment.nodes as SvelteNode[]) ?? [])
    visit(n, []);

  /** "`<a>` or `<button>`" for elements; else "bits-ui's `Dialog.Content`", "the `Button`". */
  const named = (
    targets: Target[],
  ): { text: string; elements: boolean } | null => {
    if (!targets.length || targets.some((t) => !t)) return null;
    const distinct = [
      ...new Map(targets.map((t) => [`${t!.kind} ${t!.name}`, t!])).values(),
    ];
    if (distinct.length > 2) return null;
    const elements = distinct.every((t) => t.kind === "element");
    const one = (t: NonNullable<Target>) =>
      t.kind === "element"
        ? elements
          ? `\`<${t.name}>\``
          : `the \`<${t.name}>\``
        : t.kind === "bits"
          ? `bits-ui's \`${t.name}\``
          : `the \`${t.name}\``;
    return { text: distinct.map(one).join(" or "), elements };
  };

  const out: Partial<Record<"ref" | "class" | "children", string>> = {};
  const ref = named(found.ref);
  if (ref)
    out.ref = ref.elements
      ? `The rendered ${ref.text}. Bind it with \`bind:ref\`.`
      : `The element ${ref.text} renders. Bind it with \`bind:ref\`.`;
  const cls = named(found.class);
  if (cls && forms.size === 1) {
    const what = cls.elements ? `the ${cls.text}` : cls.text;
    out.class = forms.has("merged")
      ? `Classes for ${what}, added after Kuiper's by \`cn\`.`
      : `Classes for ${what}.`;
  }
  const ch = named(found.children);
  if (ch)
    out.children = `The content of ${ch.elements ? `the ${ch.text}` : ch.text}.`;
  return out;
}

const WELL_KNOWN: Record<string, string> = {
  class: "string",
  ref: "HTMLElement | null",
  children: "Snippet",
  child: "Snippet",
};

/** One Svelte component's props table. */
function componentTable(file: string, part: string, marks: boolean): ApiTable {
  const ss = scripts(file);
  const instance = ss[ss.length - 1];
  const table: ApiTable = { part, file, kind: "component", rows: [] };
  if (!instance) return table;
  const { binding, typeNode } = propsBinding(instance);
  if (!binding) return table;
  const s: Shape = typeNode
    ? shape(typeNode, ss)
    : { members: [], inherits: [], where: ss, branches: [] };
  const own = new Map<string, ts.TypeElement>();
  for (const m of s.members)
    if (m.name) own.set(m.name.getText().replace(/["']/g, ""), m);
  // A member declared only in a union's branches: the first comment found.
  const branch = new Map<string, string>();
  for (const m of s.branches) {
    const name = m.name?.getText().replace(/["']/g, "");
    if (name && !branch.get(name)) branch.set(name, JSDOC(m));
  }
  const base = typeNode ? bases(typeNode, ss) : [];
  const typed = (name: string, m: ts.TypeElement) =>
    ts.isPropertySignature(m) && m.type
      ? showType(m.type, s.where, 0, { name, bases: base })
      : ts.isMethodSignature(m)
        ? m.getText().replace(/\s+/g, " ")
        : "";
  const locals: { ref?: string; class?: string; children?: string } = {};

  const listed = new Set<string>();
  for (const el of (binding as ts.ObjectBindingPattern).elements) {
    if (el.dotDotDotToken) continue;
    const name = (el.propertyName ?? el.name).getText();
    listed.add(name);
    if (name === "ref" || name === "class" || name === "children")
      locals[name] = el.name.getText();
    let def = el.initializer?.getText() ?? "";
    const bindable = /^\$bindable\((.*)\)$/s.exec(def);
    if (bindable) def = bindable[1];
    const bare = name.replace(/["']/g, "");
    const m = own.get(bare) ?? own.get(name);
    // A re-declared `class`, `ref` or `children` keeps the type it showed.
    const type = (m && typed(bare, m)) || (WELL_KNOWN[name] ?? "");
    table.rows.push({
      name,
      type,
      default: def.replace(/\s+/g, " "),
      doc: m ? JSDOC(m) : (branch.get(bare) ?? ""),
    });
  }
  // Members the component declares but passes on without naming.
  for (const [name, m] of own) {
    if (listed.has(name) || listed.has(`"${name}"`)) continue;
    table.rows.push({ name, type: typed(name, m), default: "", doc: JSDOC(m) });
  }
  // The universal three, where the item wrote nothing.
  const universal = universalDocs(file, locals, ss);
  for (const r of table.rows) {
    const fill = !r.doc && universal[r.name as keyof typeof universal];
    if (fill) r.doc = fill;
    if (marks) r.generated = !!fill;
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
export function apiTables(
  item: Item,
  options: { marks?: boolean } = {},
): ApiTable[] {
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
      ? componentTable(file, part, !!options.marks)
      : moduleTable(file, part);
    if (options.marks && t.kind === "module")
      for (const r of t.rows) r.generated = false;
    if (t.rows.length || t.inherits) tables.push(t);
  }
  return tables;
}
