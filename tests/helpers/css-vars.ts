/**
 * 023 decision 10: every `var(--x)` in an item file names a variable that
 * something the app will have defines. A misspelt name computes to nothing,
 * and the browser says nothing; this finds it.
 *
 * Pure but for `definedSources()`, which reads the registry, Tailwind's
 * default theme and bits-ui's dist, all pinned by bun.lock.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/** One reference: the line it is on, its name, and whether it is dynamic. */
export type VarRef = { line: number; name: string; dynamic: boolean };

/** A declared dynamic prefix: `"var(--code-" + role + ")"` over a list. */
export type Prefix = { file: string; prefix: string; names: readonly string[] };

/** Where a name may be defined, in decision 10's order (2 to 5; 1 is the file). */
export type Sources = {
  theme: Set<string>;
  fonts: Set<string>;
  tailwind: Set<string>;
  bits: Set<string>;
  prefixes: readonly Prefix[];
};

const lineAt = (text: string, at: number) =>
  text.slice(0, at).split("\n").length;

/**
 * Every reference in a file, comments included: `var(--x` anywhere, and
 * Tailwind's shorthand `-(--x)` or `-(length:--x)` in a class.
 */
export function varRefs(text: string): VarRef[] {
  const out: VarRef[] = [];
  for (const m of text.matchAll(/var\(\s*(--[\w-]*)(.?)/g))
    out.push({
      line: lineAt(text, m.index!),
      name: m[1],
      dynamic: /["'`+$<]/.test(m[2]),
    });
  for (const m of text.matchAll(/-\((?:[a-z-]+:)?(--[\w-]+)\)/g))
    out.push({ line: lineAt(text, m.index!), name: m[1], dynamic: false });
  return out;
}

/** Source 1: the names a file declares itself. */
export function localNames(text: string): Set<string> {
  const out = new Set<string>();
  const forms = [
    /(?:^|[\s;{["'`])(--[\w-]+)\s*:/gm, // `--x:` in a style, `[--x:…]`, `"--x": …`
    /style:(--[\w-]+)/g, // style:--x=
    /setProperty\(\s*["'`](--[\w-]+)/g, // setProperty("--x", …)
  ];
  for (const re of forms) for (const m of text.matchAll(re)) out.add(m[1]);
  return out;
}

/** The first source that defines a name: 1 to 4 and 5; 0 when none does. */
export function sourceOf(name: string, local: Set<string>, s: Sources): number {
  if (local.has(name)) return 1;
  if (s.theme.has(name)) return 2;
  if (s.fonts.has(name)) return 3;
  if (s.tailwind.has(name)) return 4;
  if (s.bits.has(name)) return 5;
  return 0;
}

export type Census = { refs: number; bySource: Record<number, number> };

/**
 * Each reference no source defines, as `file:line --x`. A dynamic one
 * passes only through a declared prefix whose every expansion is defined
 * by sources 2 to 4. `census`, when given, counts each reference's source,
 * 6 for a prefix.
 */
export function undefinedVars(
  files: readonly { path: string; text: string }[],
  sources: Sources,
  census?: Census,
): string[] {
  const out: string[] = [];
  for (const f of files) {
    const local = localNames(f.text);
    for (const r of varRefs(f.text)) {
      if (census) census.refs++;
      let source = 0;
      if (r.dynamic) {
        const p = sources.prefixes.find(
          (x) => x.file === f.path && x.prefix === r.name,
        );
        if (
          p &&
          p.names.length &&
          p.names.every((n) => {
            const s = sourceOf(p.prefix + n, new Set(), sources);
            return s >= 2 && s <= 4;
          })
        )
          source = 6;
      } else source = sourceOf(r.name, local, sources);
      if (census) census.bySource[source] = (census.bySource[source] ?? 0) + 1;
      if (!source)
        out.push(
          `${path.basename(f.path)}:${r.line} ${r.name}${r.dynamic ? " (an undeclared prefix)" : ""}`,
        );
    }
  }
  return out;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(js|svelte|ts)$/.test(e)) out.push(full);
  }
  return out;
}

/** Sources 2 to 5, read from the registry and the pinned packages. */
export function definedSources(
  root: string,
  prefixes: readonly Prefix[],
): Sources {
  const registry = JSON.parse(
    readFileSync(path.join(root, "registry.json"), "utf8"),
  ) as {
    items: {
      cssVars?: Record<string, Record<string, string>>;
      css?: unknown;
      font?: { variable?: string };
    }[];
  };
  const theme = new Set<string>();
  const fonts = new Set<string>();
  for (const item of registry.items) {
    for (const group of Object.values(item.cssVars ?? {}))
      for (const k of Object.keys(group)) theme.add(`--${k}`);
    if (item.css)
      for (const m of JSON.stringify(item.css).matchAll(/(--[\w-]+)"?\s*:/g))
        theme.add(m[1]);
    if (item.font?.variable) fonts.add(item.font.variable);
  }

  const tailwind = new Set<string>();
  const css = readFileSync(
    path.join(root, "node_modules/tailwindcss/theme.css"),
    "utf8",
  );
  for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) tailwind.add(m[1]);

  const bits = new Set<string>();
  const dist = path.join(root, "node_modules/bits-ui/dist");
  const templates: string[] = [];
  const names = new Set<string>();
  for (const file of walk(dist)) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/--bits-[a-z0-9-]+/g))
      if (!m[0].endsWith("-")) bits.add(m[0]);
    if (/function getFloatingContentCSSVars\(/.test(text))
      for (const m of text.matchAll(/`--bits-\$\{name\}(-[a-z-]+)`/g))
        templates.push(m[1]);
    for (const m of text.matchAll(/getFloatingContentCSSVars\("([a-z-]+)"\)/g))
      names.add(m[1]);
  }
  for (const n of names) for (const t of templates) bits.add(`--bits-${n}${t}`);

  return { theme, fonts, tailwind, bits, prefixes };
}
