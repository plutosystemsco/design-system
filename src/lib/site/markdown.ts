/**
 * A built page's `<main>` as Markdown: its twin, made from the page itself,
 * so the two never disagree. It reads the HTML with Bun's `HTMLRewriter`
 * into a small tree, then writes headings, paragraphs, lists, pipe tables,
 * absolute links, code spans and fenced code. Anything marked
 * `data-md="skip"`, and everything outside `<main>`, is left out.
 */

type Node =
  | { kind: "text"; text: string }
  | {
      kind: "el";
      tag: string;
      attrs: Record<string, string>;
      children: Node[];
    };

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

/** Named and numeric character references, as a browser reads them. */
export function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    mdash: "—",
    ndash: "–",
    hellip: "…",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    times: "×",
    minus: "−",
  };
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, ref: string) => {
    if (ref[0] === "#")
      return String.fromCodePoint(
        ref[1].toLowerCase() === "x"
          ? parseInt(ref.slice(2), 16)
          : parseInt(ref.slice(1), 10),
      );
    return named[ref.toLowerCase()] ?? all;
  });
}

/** The page's HTML as a tree of elements and text. */
async function parseTree(html: string): Promise<Node> {
  const root: Node = { kind: "el", tag: "#root", attrs: {}, children: [] };
  const stack: Node[] = [root];
  const top = () => stack[stack.length - 1] as Extract<Node, { kind: "el" }>;
  const rewriter = new HTMLRewriter().on("*", {
    element(el) {
      const attrs: Record<string, string> = {};
      for (const [k, v] of el.attributes) attrs[k] = v;
      const node: Node = {
        kind: "el",
        tag: el.tagName.toLowerCase(),
        attrs,
        children: [],
      };
      top().children.push(node);
      if (VOID.has(node.tag) || el.selfClosing) return;
      stack.push(node);
      el.onEndTag(() => {
        stack.pop();
      });
    },
    text(t) {
      if (t.text) top().children.push({ kind: "text", text: t.text });
    },
  });
  await rewriter.transform(new Response(html)).text();
  return root;
}

function find(
  node: Node,
  test: (n: Extract<Node, { kind: "el" }>) => boolean,
): Extract<Node, { kind: "el" }> | null {
  if (node.kind !== "el") return null;
  if (test(node)) return node;
  for (const c of node.children) {
    const hit = find(c, test);
    if (hit) return hit;
  }
  return null;
}

const SKIP_TAGS = new Set([
  "script",
  "style",
  "svg",
  "template",
  "noscript",
  "iframe",
  "button",
  "select",
  "input",
  "textarea",
]);

function skipped(n: Node): boolean {
  return (
    n.kind === "el" &&
    (n.attrs["data-md"] === "skip" ||
      SKIP_TAGS.has(n.tag) ||
      n.attrs["aria-hidden"] === "true")
  );
}

/** All the text inside a node, as a reader sees it, for code. */
function rawText(n: Node): string {
  if (n.kind === "text") return decodeEntities(n.text);
  if (skipped(n)) return "";
  let out = n.children.map(rawText).join("");
  if (n.attrs["data-slot"] === "code-block-line" && !out.endsWith("\n"))
    out += "\n";
  if (n.tag === "br") out += "\n";
  return out;
}

type Ctx = { origin: string; page: string };

function absolute(href: string, ctx: Ctx): string {
  if (/^[a-z]+:/i.test(href)) return href;
  if (href.startsWith("#")) return `${ctx.origin}${ctx.page}${href}`;
  if (href.startsWith("/")) return `${ctx.origin}${href}`;
  return href;
}

function codeSpan(text: string): string {
  const t = text.replace(/\s+/g, " ");
  if (!t.trim()) return "";
  const fence = t.includes("`") ? "``" : "`";
  const pad = fence === "``" ? " " : "";
  return `${fence}${pad}${t}${pad}${fence}`;
}

/** A node's inline Markdown: text, links, code spans, emphasis. */
function inline(n: Node, ctx: Ctx): string {
  if (n.kind === "text") return decodeEntities(n.text).replace(/\s+/g, " ");
  if (skipped(n)) return "";
  if (n.attrs.class?.split(/\s+/).includes("sr-only") && n.tag === "span") {
    const inner = n.children.map((c) => inline(c, ctx)).join("");
    return inner;
  }
  const inner = () => n.children.map((c) => inline(c, ctx)).join("");
  switch (n.tag) {
    case "code":
    case "kbd":
    case "samp":
      return codeSpan(rawText(n));
    case "a": {
      const text = inner().trim();
      const href = n.attrs.href;
      return href && text ? `[${text}](${absolute(href, ctx)})` : text;
    }
    case "strong":
    case "b": {
      const t = inner().trim();
      return t ? `**${t}**` : "";
    }
    case "em":
    case "i": {
      const t = inner().trim();
      return t ? `*${t}*` : "";
    }
    case "br":
      return "\n";
    default:
      return inner();
  }
}

const BLOCK = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "table",
  "pre",
  "div",
  "section",
  "article",
  "header",
  "footer",
  "nav",
  "aside",
  "figure",
  "figcaption",
  "details",
  "summary",
  "dl",
  "dt",
  "dd",
  "blockquote",
  "main",
  "form",
  "fieldset",
  "legend",
  "caption",
]);

function hasBlock(n: Node): boolean {
  return (
    n.kind === "el" &&
    n.children.some(
      (c) =>
        c.kind === "el" &&
        (BLOCK.has(c.tag) ||
          c.attrs["data-slot"] === "code-block" ||
          hasBlock(c)),
    )
  );
}

function fence(n: Extract<Node, { kind: "el" }>, lang: string): string {
  const code = rawText(n).replace(/\n+$/, "");
  const ticks = code.includes("```") ? "````" : "```";
  return `${ticks}${lang}\n${code}\n${ticks}`;
}

function cell(n: Node, ctx: Ctx): string {
  return inline(n, ctx).replace(/\s+/g, " ").trim().replace(/\|/g, "\\|");
}

function table(n: Extract<Node, { kind: "el" }>, ctx: Ctx): string[] {
  const out: string[] = [];
  const caption = find(n, (e) => e.tag === "caption");
  if (caption) out.push(cell(caption, ctx));
  const rows: string[][] = [];
  const walk = (e: Node) => {
    if (e.kind !== "el" || skipped(e)) return;
    if (e.tag === "tr") {
      rows.push(
        e.children
          .filter(
            (c): c is Extract<Node, { kind: "el" }> =>
              c.kind === "el" && (c.tag === "td" || c.tag === "th"),
          )
          .map((c) => cell(c, ctx)),
      );
      return;
    }
    if (e.tag === "caption") return;
    e.children.forEach(walk);
  };
  walk(n);
  if (!rows.length) return out;
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) => [...r, ...Array(width - r.length).fill("")];
  const lines = [
    `| ${pad(rows[0]).join(" | ")} |`,
    `| ${Array(width).fill("---").join(" | ")} |`,
    ...rows.slice(1).map((r) => `| ${pad(r).join(" | ")} |`),
  ];
  out.push(lines.join("\n"));
  return out;
}

/** A node's blocks, each a Markdown paragraph. */
function blocks(n: Node, ctx: Ctx, depth = 0): string[] {
  if (n.kind === "text") {
    const t = decodeEntities(n.text).replace(/\s+/g, " ").trim();
    return t ? [t] : [];
  }
  if (skipped(n)) return [];
  const tag = n.tag;
  const h = /^h([1-6])$/.exec(tag);
  if (h) {
    const t = inline(n, ctx).replace(/\s+/g, " ").trim();
    return t ? [`${"#".repeat(Number(h[1]))} ${t}`] : [];
  }
  if (n.attrs["data-slot"] === "code-block") {
    const pre = find(n, (e) => e.tag === "pre");
    if (!pre) return [];
    const label = n.attrs["data-md-label"];
    return [
      ...(label ? [label] : []),
      fence(pre, pre.attrs["data-language"] ?? ""),
    ];
  }
  if (tag === "pre") return [fence(n, n.attrs["data-language"] ?? "")];
  if (tag === "table") return table(n, ctx);
  if (tag === "ul" || tag === "ol") {
    let i = 0;
    const items: string[] = [];
    for (const c of n.children) {
      if (c.kind !== "el" || c.tag !== "li" || skipped(c)) continue;
      i++;
      const bullet = tag === "ol" ? `${i}. ` : "- ";
      const parts = hasBlock(c)
        ? blocks(c, ctx, depth + 1)
        : [inline(c, ctx).replace(/\s+/g, " ").trim()];
      const body = parts
        .filter(Boolean)
        .join("\n\n")
        .split("\n")
        .join(`\n${"  ".repeat(1)}`);
      if (body.trim()) items.push(`${"  ".repeat(depth)}${bullet}${body}`);
    }
    return items.length ? [items.join("\n")] : [];
  }
  if (tag === "dl") {
    const out: string[] = [];
    let term = "";
    const walk = (e: Node) => {
      if (e.kind !== "el" || skipped(e)) return;
      if (e.tag === "dt") term = inline(e, ctx).replace(/\s+/g, " ").trim();
      else if (e.tag === "dd")
        out.push(`**${term}**: ${inline(e, ctx).replace(/\s+/g, " ").trim()}`);
      else e.children.forEach(walk);
    };
    walk(n);
    return out.length ? [out.join("\n")] : [];
  }
  if (
    tag === "p" ||
    tag === "figcaption" ||
    tag === "caption" ||
    tag === "summary" ||
    tag === "legend" ||
    !hasBlock(n)
  ) {
    if (
      BLOCK.has(tag) ||
      tag === "#root" ||
      tag === "span" ||
      tag === "a" ||
      tag === "label" ||
      tag === "output" ||
      tag === "time" ||
      tag === "small"
    ) {
      const t = inline(n, ctx)
        .replace(/[ \t]+/g, " ")
        .replace(/ ?\n ?/g, "\n")
        .trim();
      return t ? [t] : [];
    }
  }
  if (tag === "blockquote")
    return blocks({ ...n, tag: "div" }, ctx, depth).map((b) =>
      b
        .split("\n")
        .map((l) => `> ${l}`)
        .join("\n"),
    );
  // A container: its children's blocks, with loose inline runs as paragraphs.
  const out: string[] = [];
  let run = "";
  const flush = () => {
    const t = run.replace(/\s+/g, " ").trim();
    if (t) out.push(t);
    run = "";
  };
  for (const c of n.children) {
    const isBlock =
      c.kind === "el" &&
      (BLOCK.has(c.tag) ||
        c.attrs["data-slot"] === "code-block" ||
        hasBlock(c));
    if (isBlock) {
      flush();
      out.push(...blocks(c, ctx, depth));
    } else run += inline(c, ctx);
  }
  flush();
  return out;
}

/** The Markdown twin of a built page: its `<main>`, as Markdown. */
export async function htmlToMarkdown(
  html: string,
  ctx: { origin: string; page: string },
): Promise<string> {
  const tree = await parseTree(html);
  const main = find(tree, (e) => e.tag === "main") ?? tree;
  const body = blocks(main, ctx).filter(Boolean).join("\n\n");
  return body.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
