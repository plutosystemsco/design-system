/**
 * `CHANGELOG.md` as the changelog page shows it: a section per release,
 * newest first, each with an anchor (`#v0-12-0`), holding the file's
 * paragraphs and lists. It reads the small Markdown the file uses: `#` and
 * `##` headings, paragraphs, `-` and `1.` lists, `**bold**` and `` `code` ``.
 * Pure, so the unit test calls it on the file directly.
 */
export type Inline =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "strong"; text: string };

export type Block =
  { kind: "p"; inlines: Inline[] } | { kind: "ul" | "ol"; items: Inline[][] };

export type Release = {
  /** The heading's text, as written: "0.12.0 — unreleased". */
  title: string;
  /** The version: "0.12.0". */
  version: string;
  /** The anchor: "v0-12-0". */
  id: string;
  blocks: Block[];
};

export type Changelog = { intro: Block[]; releases: Release[] };

/** A line's inline Markdown: code spans first (nothing inside them is read), then bold. */
export function inlines(text: string): Inline[] {
  const out: Inline[] = [];
  const parts = text.split(/(`[^`]*`)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      out.push({ kind: "code", text: part.slice(1, -1) });
      continue;
    }
    const bold = part.split(/(\*\*[^*]+\*\*)/);
    for (const b of bold) {
      if (!b) continue;
      if (b.startsWith("**") && b.endsWith("**"))
        out.push({ kind: "strong", text: b.slice(2, -2) });
      else out.push({ kind: "text", text: b });
    }
  }
  return out;
}

export function parseChangelog(markdown: string): Changelog {
  const intro: Block[] = [];
  const releases: Release[] = [];
  let blocks = intro;
  let paragraph: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ kind: "p", inlines: inlines(paragraph.join(" ")) });
      paragraph = [];
    }
    if (list) {
      blocks.push({ kind: list.kind, items: list.items.map(inlines) });
      list = null;
    }
  };

  for (const raw of markdown.split("\n")) {
    const line = raw.trimEnd();
    if (/^# /.test(line)) {
      flush();
      continue;
    }
    const h2 = /^## (.+)$/.exec(line);
    if (h2) {
      flush();
      const title = h2[1].trim();
      const version = /^(\d+\.\d+\.\d+)/.exec(title)?.[1] ?? title;
      const release: Release = {
        title,
        version,
        id: "v" + version.replace(/\./g, "-"),
        blocks: [],
      };
      releases.push(release);
      blocks = release.blocks;
      continue;
    }
    if (line === "") {
      flush();
      continue;
    }
    const bullet = /^- (.*)$/.exec(line);
    const numbered = /^\d+\. (.*)$/.exec(line);
    if (bullet || numbered) {
      const kind = bullet ? "ul" : "ol";
      if (paragraph.length || (list && list.kind !== kind)) flush();
      list ??= { kind, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    if (list && /^\s+\S/.test(raw)) {
      list.items[list.items.length - 1] += " " + line.trim();
      continue;
    }
    if (list) flush();
    paragraph.push(line.trim());
  }
  flush();
  return { intro, releases };
}

/** A block's text, as a reader sees it. */
export function blockText(block: Block): string {
  const join = (xs: Inline[]) => xs.map((x) => x.text).join("");
  return block.kind === "p"
    ? join(block.inlines)
    : block.items.map(join).join("\n");
}
