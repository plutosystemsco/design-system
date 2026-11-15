/**
 * The citation patterns, and the comment blocks they also run over.
 *
 * No published item file names an internal document: a specification by
 * number, a decision, a review code or a lint rule. A file ships into every
 * app that installs its item, and a reference to a document the reader
 * cannot see helps nobody. The patterns below find such references; the
 * unit test `registry-comments.test.ts` holds `static/r/` to them, and the
 * site's public check holds its own words to them.
 *
 * Comment blocks are found with a tokenizer, never a regular expression, so
 * a comment marker inside a string is not read as a comment: TypeScript's
 * parser for script and `.ts` text, and `svelte/compiler`'s `parse` for
 * markup comments.
 */
import ts from "typescript";
import { parse } from "svelte/compiler";

export type CitationPattern = { name: string; re: RegExp };

export const CITATION_PATTERNS: readonly CitationPattern[] = [
  {
    name: "number then decision",
    re: /`?\b\d{3}`?(?:'s)?\s+(?:decisions?|criteri(?:on|a)|build|checkpoint|review)\b/i,
  },
  { name: "bracketed number", re: /\(`?\d{3}`?\)/ },
  { name: "bracketed code", re: /\([A-Z]\d{1,2}\)/ },
  { name: "bare rule", re: /\b[RL]\d{2}\b/ },
  { name: "spec number", re: /\bspec(?:ification)?s?\s+`?\d{3}/i },
];

/** The names of the patterns a text matches, in the list's order. */
export function citationsIn(
  text: string,
  patterns: readonly CitationPattern[] = CITATION_PATTERNS,
): string[] {
  return patterns.filter((p) => p.re.test(text)).map((p) => p.name);
}

/** One comment block: its lines (1-based, inclusive) and its text joined into one line. */
export type CommentBlock = {
  startLine: number;
  endLine: number;
  joined: string;
};

type Range = { pos: number; end: number; kind: "line" | "block" | "markup" };

function lineAt(text: string, pos: number): number {
  let line = 1;
  for (let i = 0; i < pos && i < text.length; i++) if (text[i] === "\n") line++;
  return line;
}

/** Every comment in TypeScript text, by parsing it and reading each token's trivia. */
function scriptComments(text: string, offset: number): Range[] {
  const source = ts.createSourceFile(
    "x.ts",
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const seen = new Map<number, Range>();
  const add = (ranges: ts.CommentRange[] | undefined) => {
    for (const r of ranges ?? []) {
      if (seen.has(r.pos)) continue;
      seen.set(r.pos, {
        pos: r.pos + offset,
        end: r.end + offset,
        kind:
          r.kind === ts.SyntaxKind.SingleLineCommentTrivia ? "line" : "block",
      });
    }
  };
  const visit = (node: ts.Node) => {
    const children = node.getChildren(source);
    if (children.length === 0) {
      add(ts.getLeadingCommentRanges(text, node.getFullStart()));
      add(ts.getTrailingCommentRanges(text, node.getEnd()));
      return;
    }
    for (const child of children) visit(child);
  };
  visit(source);
  add(ts.getLeadingCommentRanges(text, 0));
  return [...seen.values()];
}

/** Markup comments (`<!-- … -->`) in a Svelte component's template. */
function markupComments(ast: unknown): Range[] {
  const out: Range[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const n of node) walk(n);
      return;
    }
    const n = node as Record<string, unknown>;
    if (
      n.type === "Comment" &&
      typeof n.start === "number" &&
      typeof n.end === "number"
    ) {
      out.push({ pos: n.start, end: n.end as number, kind: "markup" });
    }
    for (const [key, value] of Object.entries(n)) {
      if (key === "instance" || key === "module" || key === "css") continue;
      if (value && typeof value === "object") walk(value);
    }
  };
  walk((ast as { fragment: unknown }).fragment);
  return out;
}

/** `;` comment lines in a tree-sitter query file. */
function queryComments(text: string): Range[] {
  const out: Range[] = [];
  let pos = 0;
  for (const line of text.split("\n")) {
    const at = line.search(/\S/);
    if (at >= 0 && line[at] === ";") {
      out.push({ pos: pos + at, end: pos + line.length, kind: "line" });
    }
    pos += line.length + 1;
  }
  return out;
}

function strip(raw: string, kind: Range["kind"]): string {
  let body = raw;
  if (kind === "markup") body = body.replace(/^<!--/, "").replace(/-->$/, "");
  else if (kind === "line") body = body.replace(/^(\/\/+|;+)/, "");
  else
    body = body
      .replace(/^\/\*+/, "")
      .replace(/\*+\/$/, "")
      .split("\n")
      .map((l) => l.replace(/^\s*\*(?!\/)/, ""))
      .join("\n");
  return body.replace(/\s+/g, " ").trim();
}

/**
 * The comment blocks of an item file: a run of consecutive `//` (or `;`)
 * lines, one `/* … *\/`, or one `<!-- … -->`, each joined into one line with
 * its markers and line breaks turned into single spaces.
 */
export function commentBlocks(text: string, path: string): CommentBlock[] {
  let ranges: Range[];
  if (path.endsWith(".svelte")) {
    const ast = parse(text, { modern: true }) as unknown as {
      instance?: { content: { start: number; end: number } };
      module?: { content: { start: number; end: number } };
    };
    ranges = markupComments(ast);
    for (const script of [ast.instance, ast.module]) {
      if (!script) continue;
      const { start, end } = script.content;
      ranges.push(...scriptComments(text.slice(start, end), start));
    }
  } else if (path.endsWith(".ts") || path.endsWith(".js")) {
    ranges = scriptComments(text, 0);
  } else if (path.endsWith(".scm")) {
    ranges = queryComments(text);
  } else {
    ranges = [];
  }
  ranges.sort((a, b) => a.pos - b.pos);

  const blocks: CommentBlock[] = [];
  let run: { startLine: number; endLine: number; parts: string[] } | null =
    null;
  const flush = () => {
    if (run)
      blocks.push({
        startLine: run.startLine,
        endLine: run.endLine,
        joined: run.parts.join(" ").trim(),
      });
    run = null;
  };
  for (const r of ranges) {
    const startLine = lineAt(text, r.pos);
    const endLine = lineAt(text, r.end - 1);
    const body = strip(text.slice(r.pos, r.end), r.kind);
    if (r.kind === "line") {
      if (run && run.endLine === startLine - 1) {
        run.endLine = endLine;
        run.parts.push(body);
        continue;
      }
      flush();
      run = { startLine, endLine, parts: [body] };
      continue;
    }
    flush();
    blocks.push({ startLine, endLine, joined: body });
  }
  flush();
  return blocks;
}

/** One finding: a line, or a comment block, that matches a pattern. */
export type Citation = {
  startLine: number;
  endLine: number;
  text: string;
  patterns: string[];
  via: "line" | "block";
};

/**
 * Every line, and every comment block, of an item file that matches a
 * citation pattern. A block is reported only when none of its own lines is
 * already reported: it is the citation split across lines.
 */
export function findCitations(text: string, path: string): Citation[] {
  const out: Citation[] = [];
  const lines = text.split("\n");
  const hitLines = new Set<number>();
  lines.forEach((line, i) => {
    const patterns = citationsIn(line);
    if (patterns.length) {
      hitLines.add(i + 1);
      out.push({
        startLine: i + 1,
        endLine: i + 1,
        text: line,
        patterns,
        via: "line",
      });
    }
  });
  for (const block of commentBlocks(text, path)) {
    const patterns = citationsIn(block.joined);
    if (!patterns.length) continue;
    let covered = false;
    for (let l = block.startLine; l <= block.endLine; l++)
      if (hitLines.has(l)) covered = true;
    if (covered) continue;
    out.push({
      startLine: block.startLine,
      endLine: block.endLine,
      text: lines.slice(block.startLine - 1, block.endLine).join("\n"),
      patterns,
      via: "block",
    });
  }
  return out.sort((a, b) => a.startLine - b.startLine);
}
