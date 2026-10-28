/**
 * A small reader for the top-level blocks of a stylesheet, enough to compare
 * the custom properties of `:root`, `.dark` and `@theme inline` between two
 * files. It is not a general CSS parser: it skips comments and strings, and it
 * reads declarations only from blocks that hold no nested blocks.
 */

export type Block = { prelude: string; body: string; children: Block[] };

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Splits a stylesheet, or a block body, into its blocks, recursively. */
export function blocks(css: string): Block[] {
  const source = stripComments(css);
  const out: Block[] = [];
  let depth = 0;
  let start = 0;
  let preludeStart = 0;
  let quote: string | null = null;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ";" && depth === 0) {
      preludeStart = i + 1;
    } else if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const prelude = source
          .slice(preludeStart, start)
          .trim()
          .replace(/\s+/g, " ");
        const body = source.slice(start + 1, i);
        out.push({ prelude, body, children: blocks(body) });
        preludeStart = i + 1;
      }
    }
  }
  return out;
}

/**
 * Normalises a value as a CSS parser reads it: collapses whitespace, writes
 * every quote as `"`, and lowercases hex colours (prettier lowercases them in
 * a formatted file; the CLI writes them as the registry holds them).
 */
export function normaliseValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/'/g, '"')
    .replace(/#[0-9a-fA-F]{3,8}\b/g, (hex) => hex.toLowerCase());
}

/** A block body with its nested blocks (such as `@keyframes` inside `@theme inline`) removed. */
function withoutNestedBlocks(body: string): string {
  let out = "";
  let depth = 0;
  let quote: string | null = null;
  let segment = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (depth === 0) segment += ch;
      if (ch === "\\") {
        if (depth === 0) segment += body[i + 1] ?? "";
        i++;
      } else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      if (depth === 0) segment += ch;
    } else if (ch === "{") {
      // The text since the last ";" was the nested block's prelude: drop it.
      if (depth === 0) segment = "";
      depth++;
    } else if (ch === "}") {
      depth--;
    } else if (depth === 0) {
      segment += ch;
      if (ch === ";") {
        out += segment;
        segment = "";
      }
    }
  }
  return out + segment;
}

/** The declarations of a block body; nested blocks are skipped. */
export function declarations(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of withoutNestedBlocks(stripComments(body)).split(";")) {
    const index = part.indexOf(":");
    if (index === -1) continue;
    const prop = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!prop || prop.startsWith("@")) continue;
    map.set(prop, normaliseValue(value));
  }
  return map;
}

/** The declarations of the first top-level block whose prelude equals `prelude`. */
export function topLevelMap(css: string, prelude: string): Map<string, string> {
  const block = blocks(css).find((b) => b.prelude === prelude);
  if (!block) throw new Error(`no top-level block "${prelude}"`);
  return declarations(block.body);
}

/** The selectors of the rules directly inside the first top-level at-rule with this prelude. */
export function childPreludes(css: string, prelude: string): string[] {
  const block = blocks(css).find((b) => b.prelude === prelude);
  if (!block) throw new Error(`no top-level block "${prelude}"`);
  return block.children.map((c) => c.prelude);
}
