/**
 * The tree-sitter engine. `web-tree-sitter`
 * parses; our queries name each node's role; this file paints them.
 *
 * - **The last pattern that matches a node wins**, and the innermost painted
 *   node wins each character. A pattern marked `(#is-not? local)` is skipped
 *   for a name that resolves to a local definition. An `ERROR` node paints
 *   nothing of its own.
 * - **Injections** are the table below: an injected language paints over its
 *   host and leaves what it does not paint to the host.
 * - **Every failure falls back.** A runtime, grammar or query that cannot be
 *   resolved, fetched, compiled or instantiated logs one warning, and that
 *   language highlights with Shiki for the life of the page or process.
 *
 * `web-tree-sitter` and the Node modules are imported only inside the
 * branches that use them, so a page that renders prerendered lines loads none
 * of this, and the browser build carries no `node:` import.
 */
import type {
  Language,
  Node,
  Parser,
  Query,
  QueryCapture,
  Tree,
} from "web-tree-sitter";
import {
  queryFiles,
  runtime,
  treeSitterLanguages,
  type QueryFile,
  type TreeSitterGrammar,
} from "./languages";
import {
  isRole,
  lineStarts,
  lineTokens,
  paintRanges,
  ROLE_INDEX,
  type HighlightChange,
  type HighlightedLine,
  type HighlightRange,
  type HighlightSession,
  type Paint,
} from "./roles";
import { shikiPaintSync, loadShikiLanguage } from "./shiki";

type Runtime = typeof import("web-tree-sitter");

/** Overrides for the fallback tests; never set by an app. */
export const testing: { browser?: boolean } = {};

/** True on the server or under `bun test`, where grammars are read from `node_modules`. */
function onServer(): boolean {
  if (testing.browser) return false;
  const ssr = (import.meta as { env?: { SSR?: unknown } }).env?.SSR;
  if (typeof ssr === "boolean") return ssr;
  return typeof globalThis.document === "undefined";
}

/** A Node built-in, imported only on the server; the specifier is hidden from the browser bundler. */
function nodeModule<T>(name: string): Promise<T> {
  return import(/* @vite-ignore */ name) as Promise<T>;
}

/** The two Node functions the server branch uses, typed here so an app needs no Node types. */
type NodeModuleApi = {
  createRequire(url: string): { resolve(id: string): string };
};
type NodeFsApi = { readFile(path: string): Promise<Uint8Array> };

/** A package file in the app's own `node_modules`, read into bytes. */
async function readPackageFile(packagePath: string): Promise<Uint8Array> {
  const [{ createRequire }, { readFile }] = await Promise.all([
    nodeModule<NodeModuleApi>("node:module"),
    nodeModule<NodeFsApi>("node:fs/promises"),
  ]);
  const file = createRequire(import.meta.url).resolve(packagePath);
  return new Uint8Array(await readFile(file));
}

/** Warns once per language: what fell back, and why. */
const warned = new Set<string>();
export function warnFallback(language: string, cause: unknown): void {
  if (warned.has(language)) return;
  warned.add(language);
  const reason = cause instanceof Error ? cause.message : String(cause);
  console.warn(
    "highlighter: " +
      language +
      " falls back to Shiki (tree-sitter: " +
      reason +
      ")",
  );
}

// ── The runtime ───────────────────────────────────────────────────────────

let runtimePromise: Promise<Runtime> | undefined;

/** Loads and starts `web-tree-sitter` once. */
function loadRuntime(): Promise<Runtime> {
  runtimePromise ??= (async () => {
    const ts = await import("web-tree-sitter");
    if (onServer()) {
      const wasmBinary = await readPackageFile(runtime.path);
      await ts.Parser.init({ wasmBinary } as never);
    } else {
      const url = (await runtime.wasm()).default;
      await ts.Parser.init({ locateFile: () => url });
    }
    return ts;
  })();
  return runtimePromise;
}

/** Loads one grammar file, once per file. */
const grammarCache = new Map<string, Promise<Language>>();
function loadGrammar(
  ts: Runtime,
  grammar: TreeSitterGrammar,
): Promise<Language> {
  let pending = grammarCache.get(grammar.path);
  if (!pending) {
    pending = (async () => {
      const input = onServer()
        ? await readPackageFile(grammar.path)
        : (await grammar.wasm()).default;
      return ts.Language.load(input);
    })();
    grammarCache.set(grammar.path, pending);
  }
  return pending;
}

// ── A compiled language ───────────────────────────────────────────────────

/** A language ready to paint: its parser, its highlight query and its locals query. */
export type Compiled = {
  id: string;
  ts: Runtime;
  language: Language;
  parser: Parser;
  highlights: Query;
  locals: Query | null;
  injections: Injection[];
  /**
   * True when no highlight pattern names the grammar's root node or `ERROR`,
   * so a root that turns to `ERROR` and back (a streamed chunk that ends in
   * an open bracket) changes no capture of the nodes under it.
   */
  rootBlind: boolean;
};

/** The predicates `web-tree-sitter` evaluates itself, and the two properties this engine reads. */
const PROPERTIES = new Set(["local", "local.scope-inherits"]);

/** Compiles a language's query files in order; throws on anything this engine cannot honour. */
export function compileQueries(
  ts: Runtime,
  language: Language,
  texts: { name: string; text: string }[],
): { highlights: Query; locals: Query | null } {
  const highlightText = texts
    .filter((t) => !t.name.endsWith(".locals"))
    .map((t) => t.text)
    .join("\n");
  const localsText = texts
    .filter((t) => t.name.endsWith(".locals"))
    .map((t) => t.text)
    .join("\n");
  const highlights = new ts.Query(language, highlightText);
  const locals = localsText ? new ts.Query(language, localsText) : null;
  for (const [query, kind] of [
    [highlights, "highlight"],
    [locals, "locals"],
  ] as const) {
    if (!query) continue;
    for (const name of query.captureNames) {
      const ok =
        kind === "highlight"
          ? isRole(name)
          : name === "local.scope" ||
            name === "local.definition" ||
            name === "local.reference";
      if (!ok) throw new Error("unknown " + kind + " capture @" + name);
    }
    for (let i = 0; i < query.patternCount(); i++) {
      const unknown = query.predicatesForPattern(i);
      if (unknown.length)
        throw new Error(
          "unimplemented predicate #" +
            unknown[0]!.operator +
            " in pattern " +
            i,
        );
      for (const props of [
        query.setProperties[i],
        query.assertedProperties[i],
        query.refutedProperties[i],
      ])
        for (const key of Object.keys(props ?? {}))
          if (!PROPERTIES.has(key))
            throw new Error(
              "unimplemented property " + key + " in pattern " + i,
            );
    }
  }
  return { highlights, locals };
}

/** Each language's compiled form, once; null once it has failed. */
const compiledCache = new Map<string, Promise<Compiled | null>>();
const ready = new Map<string, Compiled>();
const failed = new Set<string>();

/** The ids this engine holds a row for. */
export function hasTreeSitterRow(id: string): boolean {
  return id in treeSitterLanguages;
}

/** True once a language has fallen back for good. */
export function treeSitterFailed(id: string): boolean {
  return failed.has(id);
}

/** A loaded language, synchronously, or undefined. */
export function compiledNow(id: string): Compiled | undefined {
  return ready.get(id);
}

/**
 * Loads a language: the runtime, its grammar and its queries. Resolves to
 * null, after one warning, when any of them fails; never rejects.
 */
export function loadTreeSitter(id: string): Promise<Compiled | null> {
  let pending = compiledCache.get(id);
  if (pending) return pending;
  pending = (async () => {
    const row = treeSitterLanguages[id];
    if (!row) throw new Error("no tree-sitter row for " + id);
    const ts = await loadRuntime();
    const [language, texts] = await Promise.all([
      loadGrammar(ts, row.grammar),
      Promise.all(
        row.files.map(async (name: QueryFile) => ({
          name,
          text: (await queryFiles[name]()).default,
        })),
      ),
    ]);
    const { highlights, locals } = compileQueries(ts, language, texts);
    const parser = new ts.Parser();
    parser.setLanguage(language);
    const rootType = parser.parse("")?.rootNode.type ?? "";
    const source = texts
      .filter((t) => !t.name.endsWith(".locals"))
      .map((t) => t.text.replace(/;.*$/gm, ""))
      .join("\n");
    const compiled: Compiled = {
      id,
      ts,
      language,
      parser,
      highlights,
      locals,
      injections: compileInjections(ts, language, id),
      rootBlind: !new RegExp("\\((?:" + rootType + "|ERROR)\\b").test(source),
    };
    ready.set(id, compiled);
    return compiled;
  })().catch((cause: unknown) => {
    failed.add(id);
    warnFallback(id, cause);
    return null;
  });
  compiledCache.set(id, pending);
  return pending;
}

// ── Injections (decision 14) ──────────────────────────────────────────────

/** How an injected region is parsed: whole, as an expression, a binding pattern or a statement. */
type Mode = "whole" | "expression" | "pattern" | "statement" | "arguments";

/** One injected region of a host document. */
type Region = {
  start: number;
  end: number;
  language: string;
  mode: Mode;
};

/** A region painted by the host engine itself: a word inside raw text (`then` in an await head). */
type Word = { start: number; end: number; role: "keyword" };

type Injection = {
  query: Query;
  regions(
    match: Record<string, Node>,
    text: string,
    host: Tree,
  ): (Region | Word)[];
};

/** The language a `<script>` start tag names: TypeScript for `lang="ts"`. */
function scriptLanguage(start: Node | undefined): string {
  if (!start) return "javascript";
  const text = start.text;
  return /\blang\s*=\s*["']?(ts|typescript)["'\s>]/.test(text)
    ? "typescript"
    : "javascript";
}

/** Svelte's script language: the first `<script>`'s, for every expression and pattern. */
function svelteScriptLanguage(tree: Tree): string {
  const root = tree.rootNode;
  for (let i = 0; i < root.namedChildCount; i++) {
    const child = root.namedChild(i)!;
    if (child.type === "script_element")
      return scriptLanguage(child.namedChild(0) ?? undefined);
  }
  return "javascript";
}

/** The index just past a balanced bracket run that opens at `open`, or -1. */
function closing(text: string, open: number): number {
  const pairs: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
  const stack: string[] = [];
  for (let i = open; i < text.length; i++) {
    const c = text[i]!;
    if (c === '"' || c === "'" || c === "`") {
      const end = text.indexOf(c, i + 1);
      if (end === -1) return -1;
      i = end;
    } else if (c in pairs) stack.push(pairs[c]!);
    else if (c === ")" || c === "]" || c === "}") {
      if (stack.pop() !== c) return -1;
      if (stack.length === 0) return i + 1;
    }
  }
  return -1;
}

/** The first `then` or `catch` standing as a word outside brackets and strings, or -1. */
function awaitSplit(text: string): { at: number; word: string } | null {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (c === '"' || c === "'" || c === "`") {
      const end = text.indexOf(c, i + 1);
      if (end === -1) return null;
      i = end;
    } else if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth--;
    else if (depth === 0)
      for (const word of ["then", "catch"])
        if (
          text.startsWith(word, i) &&
          !/[\w$]/.test(text[i - 1] ?? " ") &&
          !/[\w$]/.test(text[i + word.length] ?? " ")
        )
          return { at: i, word };
  }
  return null;
}

/** A region of raw text, trimmed of surrounding whitespace; null when empty. */
function trimmed(
  text: string,
  start: number,
  end: number,
  language: string,
  mode: Mode,
): Region | null {
  while (start < end && /\s/.test(text[start]!)) start++;
  while (end > start && /\s/.test(text[end - 1]!)) end--;
  return start < end ? { start, end, language, mode } : null;
}

/** The injection table, written as small queries of the host grammar. */
function compileInjections(
  ts: Runtime,
  language: Language,
  id: string,
): Injection[] {
  const q = (source: string) => new ts.Query(language, source);
  const one = (r: Region | null) => (r ? [r] : []);
  if (id === "html")
    return [
      {
        query: q("(script_element (start_tag) @start (raw_text) @content)"),
        regions: (m, text) =>
          one(
            trimmed(
              text,
              m.content!.startIndex,
              m.content!.endIndex,
              scriptLanguage(m.start),
              "whole",
            ),
          ),
      },
      {
        query: q("(style_element (raw_text) @content)"),
        regions: (m, text) =>
          one(
            trimmed(
              text,
              m.content!.startIndex,
              m.content!.endIndex,
              "css",
              "whole",
            ),
          ),
      },
    ];
  if (id === "svelte") {
    const raw = (node: Node, text: string, host: Tree, mode: Mode) =>
      trimmed(
        text,
        node.startIndex,
        node.endIndex,
        svelteScriptLanguage(host),
        mode,
      );
    return [
      {
        query: q("(script_element (start_tag) @start (raw_text) @content)"),
        regions: (m, text) =>
          one(
            trimmed(
              text,
              m.content!.startIndex,
              m.content!.endIndex,
              scriptLanguage(m.start),
              "whole",
            ),
          ),
      },
      {
        query: q("(style_element (raw_text) @content)"),
        regions: (m, text) =>
          one(
            trimmed(
              text,
              m.content!.startIndex,
              m.content!.endIndex,
              "css",
              "whole",
            ),
          ),
      },
      // Expressions: `{…}`, attribute values in braces, conditions, an
      // each's list, `{#key …}`, `{@html …}`, `{@render …}`, `{@debug …}`.
      {
        query: q(
          `[
            (expression (svelte_raw_text) @content)
            (if_start (svelte_raw_text) @content)
            (else_if_start (svelte_raw_text) @content)
            (each_start identifier: (svelte_raw_text) @content)
            (key_start (svelte_raw_text) @content)
            (html_tag (svelte_raw_text) @content)
            (render_tag (svelte_raw_text) @content)
            (debug_tag (svelte_raw_text) @content)
          ]`,
        ),
        regions: (m, text, host) =>
          one(raw(m.content!, text, host, "expression")),
      },
      // `{@const x = y}`: a declaration.
      {
        query: q("(const_tag (svelte_raw_text) @content)"),
        regions: (m, text, host) =>
          one(raw(m.content!, text, host, "statement")),
      },
      // An each's item and index, with a trailing `( … )` key.
      {
        query: q("(each_start parameter: (svelte_raw_text) @content)"),
        regions: (m, text, host) => {
          const node = m.content!;
          const lang = svelteScriptLanguage(host);
          const slice = text.slice(node.startIndex, node.endIndex);
          const trimmedEnd = slice.trimEnd().length;
          let keyOpen = -1;
          if (slice[trimmedEnd - 1] === ")") {
            for (
              let i = slice.lastIndexOf("(", trimmedEnd - 1);
              i >= 0;
              i = slice.lastIndexOf("(", i - 1)
            )
              if (closing(slice, i) === trimmedEnd) {
                keyOpen = i;
                break;
              }
          }
          if (keyOpen <= 0)
            return one(
              trimmed(text, node.startIndex, node.endIndex, lang, "pattern"),
            );
          return [
            ...one(
              trimmed(
                text,
                node.startIndex,
                node.startIndex + keyOpen,
                lang,
                "pattern",
              ),
            ),
            ...one(
              trimmed(
                text,
                node.startIndex + keyOpen,
                node.startIndex + trimmedEnd,
                lang,
                "expression",
              ),
            ),
          ];
        },
      },
      // `{#await p then value}`: an expression, the word, a binding pattern.
      {
        query: q("(await_start (svelte_raw_text) @content)"),
        regions: (m, text, host) => {
          const node = m.content!;
          const lang = svelteScriptLanguage(host);
          const slice = text.slice(node.startIndex, node.endIndex);
          const split = awaitSplit(slice);
          if (!split)
            return one(
              trimmed(text, node.startIndex, node.endIndex, lang, "expression"),
            );
          const at = node.startIndex + split.at;
          return [
            ...one(trimmed(text, node.startIndex, at, lang, "expression")),
            { start: at, end: at + split.word.length, role: "keyword" } as Word,
            ...one(
              trimmed(
                text,
                at + split.word.length,
                node.endIndex,
                lang,
                "pattern",
              ),
            ),
          ];
        },
      },
      // `{:then value}`, `{:catch error}` and a snippet's parameters.
      {
        query: q(
          `[
            (then_start (svelte_raw_text) @content)
            (catch_start (svelte_raw_text) @content)
            (snippet_start (svelte_raw_text) @content)
          ]`,
        ),
        regions: (m, text, host) => one(raw(m.content!, text, host, "pattern")),
      },
    ];
  }
  if (id === "rust")
    return [
      {
        query: q("(macro_invocation (token_tree) @content)"),
        regions: (m, text) => {
          const node = m.content!;
          if (node.endIndex - node.startIndex < 2) return [];
          return [
            {
              start: node.startIndex + 1,
              end: node.endIndex - 1,
              language: "rust",
              mode: "arguments",
            },
          ];
        },
      },
    ];
  return [];
}

/** The text an injected region is parsed as, and where the region starts in it. */
function wrap(
  language: string,
  mode: Mode,
  body: string,
): { text: string; at: number } {
  const js = language === "javascript" || language === "typescript";
  if (js && mode === "expression") return { text: "(" + body + ")", at: 1 };
  if (js && mode === "pattern") return { text: "let " + body + " = 0", at: 4 };
  if (js && mode === "statement") return { text: "const " + body, at: 6 };
  if (language === "rust" && mode === "arguments")
    return { text: "fn __() { __(" + body + "); }", at: 13 };
  return { text: body, at: 0 };
}

// ── Locals ────────────────────────────────────────────────────────────────

/** The ids of the nodes that are local: every definition, and every reference that resolves to one before it. */
const localsCache = new WeakMap<Tree, Set<number>>();
function localNodes(c: Compiled, tree: Tree): Set<number> {
  if (!c.locals) return new Set();
  const cached = localsCache.get(tree);
  if (cached) return cached;
  const captures = c.locals
    .captures(tree.rootNode)
    .sort(
      (a, b) =>
        a.node.startIndex - b.node.startIndex ||
        b.node.endIndex - a.node.endIndex ||
        order(a.name) - order(b.name),
    );
  type Scope = { end: number; names: Set<string>; inherits: boolean };
  const root: Scope = { end: Infinity, names: new Set(), inherits: false };
  const stack: Scope[] = [root];
  const local = new Set<number>();
  for (const capture of captures) {
    const node = capture.node;
    while (stack.length > 1 && stack[stack.length - 1]!.end <= node.startIndex)
      stack.pop();
    if (capture.name === "local.scope") {
      const inherits =
        capture.setProperties?.["local.scope-inherits"] !== "false";
      stack.push({ end: node.endIndex, names: new Set(), inherits });
    } else if (capture.name === "local.definition") {
      stack[stack.length - 1]!.names.add(node.text);
      local.add(node.id);
    } else if (capture.name === "local.reference") {
      const name = node.text;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i]!.names.has(name)) {
          local.add(node.id);
          break;
        }
        if (!stack[i]!.inherits) break;
      }
    }
  }
  localsCache.set(tree, local);
  return local;
}
/** A scope opens before a definition on the same node, and a definition before a reference. */
function order(name: string): number {
  return name === "local.scope" ? 0 : name === "local.definition" ? 1 : 2;
}

// ── Painting ──────────────────────────────────────────────────────────────

/** What a paint found it could not paint yet: languages still loading. */
export type Needs = Set<string>;

/** The trees of injected regions, kept across paints by a session. */
export type RegionTrees = Map<string, { tree: Tree; used: number }>;

/** The node's depth, for ordering two painted nodes over the same range. */
function depth(node: Node): number {
  let d = 0;
  for (let n = node.parent; n; n = n.parent) d++;
  return d;
}

/**
 * Paints `[from, to)` of `text` (parsed as `tree` in `c`) into `out`, where
 * `out[i - base]` is offset `i`. Injected languages that are not loaded yet
 * are added to `needs` and left to the host.
 */
export function paintTree(
  c: Compiled,
  tree: Tree,
  text: string,
  from: number,
  to: number,
  out: Paint,
  base: number,
  needs: Needs,
  regions: RegionTrees | null,
  generation = 0,
  nesting = 0,
): void {
  if (from >= to) return;
  const locals = localNodes(c, tree);
  const captures = c.highlights.captures(tree.rootNode, {
    startIndex: from,
    endIndex: to,
  });
  const best = new Map<number, QueryCapture>();
  for (const capture of captures) {
    if (
      capture.refutedProperties &&
      "local" in capture.refutedProperties &&
      locals.has(capture.node.id)
    )
      continue;
    if (
      capture.assertedProperties &&
      "local" in capture.assertedProperties &&
      !locals.has(capture.node.id)
    )
      continue;
    const id = capture.node.id;
    const seen = best.get(id);
    if (!seen || capture.patternIndex >= seen.patternIndex)
      best.set(id, capture);
  }
  const painted = [...best.values()].map((capture) => ({
    capture,
    start: capture.node.startIndex,
    end: capture.node.endIndex,
    depth: -1,
  }));
  painted.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return b.end - a.end;
    if (a.depth < 0) a.depth = depth(a.capture.node);
    if (b.depth < 0) b.depth = depth(b.capture.node);
    return a.depth - b.depth;
  });
  // Outer nodes first, so an inner node paints over them.
  for (const { capture, start, end } of painted) {
    const role = ROLE_INDEX[capture.name as keyof typeof ROLE_INDEX];
    const lo = Math.max(start, from);
    const hi = Math.min(end, to);
    if (lo < hi) out.fill(role, lo - base, hi - base);
  }
  if (nesting > 4) return;
  for (const injection of c.injections) {
    for (const match of injection.query.matches(tree.rootNode, {
      startIndex: from,
      endIndex: to,
    })) {
      const nodes: Record<string, Node> = {};
      for (const capture of match.captures) nodes[capture.name] = capture.node;
      for (const region of injection.regions(nodes, text, tree)) {
        if (region.end <= from || region.start >= to) continue;
        if ("role" in region) {
          out.fill(
            ROLE_INDEX[region.role],
            Math.max(region.start, from) - base,
            Math.min(region.end, to) - base,
          );
          continue;
        }
        paintRegion(
          region,
          text,
          from,
          to,
          out,
          base,
          needs,
          regions,
          generation,
          nesting,
        );
      }
    }
  }
  if (c.id === "php")
    paintCombinedHtml(
      tree,
      text,
      from,
      to,
      out,
      base,
      needs,
      regions,
      generation,
      nesting,
    );
}

/**
 * PHP's text outside `<?php … ?>` is one HTML document: every `text` node is
 * parsed together, by HTML, over those ranges alone, and painted over them.
 */
function paintCombinedHtml(
  tree: Tree,
  text: string,
  from: number,
  to: number,
  out: Paint,
  base: number,
  needs: Needs,
  regions: RegionTrees | null,
  generation: number,
  nesting: number,
): void {
  const pieces = tree.rootNode
    .descendantsOfType("text")
    .filter((n): n is Node => !!n);
  if (!pieces.some((n) => n.endIndex > from && n.startIndex < to)) return;
  const html = ready.get("html");
  if (!html) {
    if (hasTreeSitterRow("html") && !failed.has("html")) needs.add("html");
    return;
  }
  const key = "html|combined|" + text;
  let kept = regions?.get(key);
  let htmlTree: Tree | null = kept?.tree ?? null;
  if (!htmlTree) {
    const includedRanges = pieces.map((n) => ({
      startIndex: n.startIndex,
      endIndex: n.endIndex,
      startPosition: n.startPosition,
      endPosition: n.endPosition,
    }));
    htmlTree = html.parser.parse(text, null, { includedRanges });
    if (!htmlTree) return;
    kept = { tree: htmlTree, used: generation };
    regions?.set(key, kept);
  } else kept!.used = generation;
  const lo = Math.max(from, 0);
  const hi = Math.min(to, text.length);
  const paint = new Uint8Array(hi - lo);
  paintTree(
    html,
    htmlTree,
    text,
    lo,
    hi,
    paint,
    lo,
    needs,
    regions,
    generation,
    nesting + 1,
  );
  for (const n of pieces)
    for (let i = Math.max(n.startIndex, lo); i < Math.min(n.endIndex, hi); i++)
      if (paint[i - lo]) out[i - base] = paint[i - lo]!;
  if (!regions) htmlTree.delete();
}

/** Paints an injected region over its host, where the injected language paints. */
function paintRegion(
  region: Region,
  text: string,
  from: number,
  to: number,
  out: Paint,
  base: number,
  needs: Needs,
  regions: RegionTrees | null,
  generation: number,
  nesting: number,
): void {
  const body = text.slice(region.start, region.end);
  const child = embeddedPaint(
    region.language,
    region.mode,
    body,
    needs,
    regions,
    generation,
    nesting + 1,
  );
  if (!child) return;
  const lo = Math.max(region.start, from);
  const hi = Math.min(region.end, to);
  for (let i = lo; i < hi; i++) {
    const role = child[i - region.start]!;
    if (role) out[i - base] = role;
  }
}

/**
 * Paints `body` in a language, as a region of a host: by tree-sitter when
 * the language is loaded, by Shiki when it has fallen back and Shiki has it.
 * Returns null, and adds the language to `needs`, when it is not loaded yet.
 */
export function embeddedPaint(
  language: string,
  mode: Mode | "whole",
  body: string,
  needs: Needs,
  regions: RegionTrees | null,
  generation = 0,
  nesting = 1,
): Paint | null {
  const c = ready.get(language);
  if (c) {
    const { text, at } = wrap(language, mode, body);
    const key = [language, mode, text].join("|");
    let tree: Tree | null = null;
    const kept = regions?.get(key);
    if (kept) {
      kept.used = generation;
      tree = kept.tree;
    } else {
      tree = c.parser.parse(text);
      if (!tree) return null;
      regions?.set(key, { tree, used: generation });
    }
    // A wrapped region that does not parse is left to the host, never red.
    if (mode === "arguments" && tree.rootNode.hasError) return null;
    const paint = new Uint8Array(text.length);
    paintTree(
      c,
      tree,
      text,
      0,
      text.length,
      paint,
      0,
      needs,
      regions,
      generation,
      nesting,
    );
    if (!regions) tree.delete();
    return paint.subarray(at, at + body.length);
  }
  if (hasTreeSitterRow(language) && !failed.has(language)) {
    needs.add(language);
    return null;
  }
  const shiki = shikiPaintSync(language, body);
  if (shiki) return shiki;
  needs.add(language);
  return null;
}

/** Loads what a paint said it needs, each by its engine; never rejects. */
export async function loadNeeds(needs: Needs): Promise<void> {
  await Promise.all(
    [...needs].map(async (language) => {
      if (hasTreeSitterRow(language) && !failed.has(language)) {
        const c = await loadTreeSitter(language);
        if (c) return;
      }
      await loadShikiLanguage(language);
    }),
  );
}

/** Paints a whole text once, awaiting every language it embeds. */
export async function paintWhole(c: Compiled, code: string): Promise<Paint> {
  const tree = c.parser.parse(code)!;
  try {
    for (let round = 0; round < 6; round++) {
      const needs: Needs = new Set();
      const paint = new Uint8Array(code.length);
      paintTree(c, tree, code, 0, code.length, paint, 0, needs, null);
      if (needs.size === 0) return paint;
      await loadNeeds(needs);
    }
    const paint = new Uint8Array(code.length);
    paintTree(c, tree, code, 0, code.length, paint, 0, new Set(), null);
    return paint;
  } finally {
    tree.delete();
  }
}

// ── Sessions (decision 15) ────────────────────────────────────────────────

/** The row and column of an offset, from a text's line starts. */
function pointAt(
  starts: number[],
  index: number,
): { row: number; column: number } {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid]! <= index) lo = mid;
    else hi = mid - 1;
  }
  return { row: lo, column: index - starts[lo]! };
}

/** A point advanced over a text. */
function advance(
  point: { row: number; column: number },
  text: string,
): { row: number; column: number } {
  const last = text.lastIndexOf("\n");
  if (last === -1)
    return { row: point.row, column: point.column + text.length };
  let rows = 0;
  for (let i = text.indexOf("\n"); i !== -1; i = text.indexOf("\n", i + 1))
    rows++;
  return { row: point.row + rows, column: text.length - last - 1 };
}

/** The line index of an offset. */
function lineOf(starts: number[], index: number): number {
  return pointAt(starts, index).row;
}

/**
 * The end of the run of top-level nodes, before the first change, that the
 * re-parse left as they were. tree-sitter reports a range as changed when it
 * built new nodes there, which it does for the whole document after an edit
 * that undoes a parse error at the end (a streamed chunk that closed a
 * string). A top-level node of the same type, range and size, with no error,
 * over the same text and after the same text, paints the same. The last
 * matching node is left out, for a pattern that reads its next sibling.
 */
function stablePrefix(
  old: Tree,
  next: Tree,
  firstChange: number,
  rootBlind: boolean,
): number {
  const a = old.rootNode;
  const b = next.rootNode;
  if (a.type !== b.type && !rootBlind) return 0;
  const count = Math.min(a.childCount, b.childCount);
  let end = 0;
  let previous = 0;
  for (let i = 0; i < count; i++) {
    const x = a.child(i)!;
    const y = b.child(i)!;
    if (y.endIndex >= firstChange) break;
    const same =
      x.id === y.id ||
      (x.type === y.type &&
        x.startIndex === y.startIndex &&
        x.endIndex === y.endIndex &&
        !x.hasError &&
        !y.hasError &&
        x.descendantCount === y.descendantCount);
    if (!same) break;
    end = previous;
    previous = y.endIndex;
  }
  return end;
}

/** A session over tree-sitter: one tree, edited and re-parsed incrementally. */
export class TreeSitterSession implements HighlightSession {
  #c: Compiled;
  #text: string;
  #starts: number[];
  #tree: Tree;
  #cache: (HighlightedLine | null)[];
  #regions: RegionTrees = new Map();
  #generation = 0;
  #loading = new Set<string>();
  #listeners = new Set<() => void>();
  #disposed = false;
  #scriptLanguage: string | null;
  /** Set once `lines()` is read: only then is the line cache kept across updates. */
  #linesRead = false;

  constructor(c: Compiled, code: string) {
    this.#c = c;
    this.#text = code;
    this.#starts = lineStarts(code);
    this.#tree = c.parser.parse(code)!;
    this.#cache = this.#starts.map(() => null);
    this.#scriptLanguage =
      c.id === "svelte" ? svelteScriptLanguage(this.#tree) : null;
  }

  get settled(): boolean {
    return this.#loading.size === 0;
  }

  onChange(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  dispose(): void {
    this.#disposed = true;
    this.#listeners.clear();
    this.#tree.delete();
    for (const { tree } of this.#regions.values()) tree.delete();
    this.#regions.clear();
  }

  update(code: string, changes: HighlightChange[]): void {
    if (this.#disposed) return;
    const old = this.#text;
    const oldStarts = this.#starts;
    const starts = lineStarts(code);
    const sorted = [...changes].sort((a, b) => a.fromB - b.fromB);
    for (const change of sorted) {
      const startPosition = pointAt(starts, change.fromB);
      this.#tree.edit(
        new this.#c.ts.Edit({
          startIndex: change.fromB,
          oldEndIndex: change.fromB + (change.toA - change.fromA),
          newEndIndex: change.toB,
          startPosition,
          oldEndPosition: advance(
            startPosition,
            old.slice(change.fromA, change.toA),
          ),
          newEndPosition: pointAt(starts, change.toB),
        }),
      );
    }
    const oldTree = this.#tree;
    // A chunked input: tree-sitter reads only what it needs, 8 kB at a time.
    const tree = this.#c.parser.parse(
      (index: number) => code.slice(index, index + 8192),
      oldTree,
    )!;
    const firstChange = Math.min(...sorted.map((c) => c.fromB), code.length);
    // Only a reader of `lines()` keeps a line cache; the editor reads
    // `ranges()` alone, so its keystrokes skip this bookkeeping.
    const keep = this.#linesRead;
    const moved = keep ? oldTree.getChangedRanges(tree) : [];
    const stable =
      keep && moved.some((r) => r.startIndex < firstChange)
        ? stablePrefix(oldTree, tree, firstChange, this.#c.rootBlind)
        : 0;
    oldTree.delete();
    this.#tree = tree;
    this.#text = code;
    this.#starts = starts;

    if (!keep) {
      if (this.#c.id === "svelte")
        this.#scriptLanguage = svelteScriptLanguage(tree);
      return;
    }
    // What must be re-queried, in new offsets.
    const dirty: [number, number][] = [];
    for (const change of sorted) dirty.push([change.fromB, change.toB]);
    for (const range of moved)
      if (range.endIndex > stable)
        dirty.push([Math.max(range.startIndex, stable), range.endIndex]);
    // A locals language: a change can turn a later name local or not, up to
    // the end of the document (a reference resolves only to a definition
    // before it, so nothing before the change can move).
    if (this.#c.locals)
      for (const change of sorted) dirty.push([change.fromB, code.length]);
    // An injected region whose text, host node or language selector a change
    // touches is re-queried whole.
    for (const change of sorted)
      for (const injection of this.#c.injections)
        for (const match of injection.query.matches(tree.rootNode, {
          startIndex: Math.max(0, change.fromB - 1),
          endIndex: Math.min(code.length, change.toB + 1),
        })) {
          const nodes: Record<string, Node> = {};
          for (const capture of match.captures)
            nodes[capture.name] = capture.node;
          let lo = Infinity;
          let hi = -Infinity;
          for (const capture of match.captures) {
            lo = Math.min(lo, capture.node.startIndex);
            hi = Math.max(hi, capture.node.endIndex);
          }
          if (lo <= hi) dirty.push([lo, hi]);
          for (const region of injection.regions(nodes, code, tree))
            dirty.push([region.start, region.end]);
        }
    let all = false;
    if (this.#c.id === "svelte") {
      const lang = svelteScriptLanguage(tree);
      if (lang !== this.#scriptLanguage) all = true;
      this.#scriptLanguage = lang;
    }

    const next: (HighlightedLine | null)[] = starts.map(() => null);
    if (!all && sorted.length) {
      const isDirty = new Uint8Array(starts.length);
      for (const [a, b] of dirty) {
        const first = lineOf(starts, Math.min(a, code.length));
        const last = lineOf(starts, Math.min(Math.max(a, b), code.length));
        isDirty.fill(1, first, last + 1);
      }
      // A clean new line maps to the old line holding the same text.
      let k = 0;
      let delta = 0;
      for (let line = 0; line < starts.length; line++) {
        if (isDirty[line]) continue;
        const at = starts[line]!;
        while (k < sorted.length && sorted[k]!.toB <= at) {
          delta +=
            sorted[k]!.toB -
            sorted[k]!.fromB -
            (sorted[k]!.toA - sorted[k]!.fromA);
          k++;
        }
        const oldLine = lineOf(oldStarts, at - delta);
        if (oldStarts[oldLine] === at - delta)
          next[line] = this.#cache[oldLine] ?? null;
      }
    } else if (!all) {
      for (let line = 0; line < starts.length; line++)
        next[line] = this.#cache[line] ?? null;
    }
    this.#cache = next;
  }

  /** Paints `[from, to)` and starts loading anything it needs. */
  #paint(from: number, to: number): Paint {
    const out = new Uint8Array(Math.max(0, to - from));
    const needs: Needs = new Set();
    this.#generation++;
    paintTree(
      this.#c,
      this.#tree,
      this.#text,
      from,
      to,
      out,
      from,
      needs,
      this.#regions,
      this.#generation,
    );
    for (const language of needs) this.#load(language);
    // Drop region trees no paint has used for a while.
    if (this.#regions.size > 64)
      for (const [key, kept] of this.#regions)
        if (kept.used < this.#generation - 8) {
          kept.tree.delete();
          this.#regions.delete(key);
        }
    return out;
  }

  #load(language: string): void {
    if (this.#loading.has(language)) return;
    this.#loading.add(language);
    void loadNeeds(new Set([language])).then(() => {
      this.#loading.delete(language);
      if (this.#disposed) return;
      this.#cache = this.#cache.map(() => null);
      for (const listener of [...this.#listeners]) listener();
    });
  }

  lines(): HighlightedLine[] {
    if (!this.#linesRead) {
      this.#linesRead = true;
      this.#cache = this.#starts.map(() => null);
    }
    const starts = this.#starts;
    const text = this.#text;
    const end = (line: number) =>
      line + 1 < starts.length ? starts[line + 1]! - 1 : text.length;
    let line = 0;
    while (line < starts.length) {
      if (this.#cache[line]) {
        line++;
        continue;
      }
      let last = line;
      while (last + 1 < starts.length && !this.#cache[last + 1]) last++;
      const from = starts[line]!;
      const to = end(last);
      const paint = this.#paint(from, to);
      for (let l = line; l <= last; l++)
        this.#cache[l] = lineTokens(text, starts[l]!, end(l), paint, from);
      line = last + 1;
    }
    return this.#cache as HighlightedLine[];
  }

  ranges(from: number, to: number): HighlightRange[] {
    const lo = Math.max(0, Math.min(from, this.#text.length));
    const hi = Math.max(lo, Math.min(to, this.#text.length));
    return paintRanges(this.#paint(lo, hi), lo, lo, hi);
  }
}
