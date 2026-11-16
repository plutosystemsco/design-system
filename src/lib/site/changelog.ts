/**
 * `CHANGELOG.md` as the changelog page shows it: a section per release,
 * newest first, each with an anchor (`#v0-12-0`), holding the file's
 * paragraphs and lists. It reads the small Markdown the file uses: `#` and
 * `##` headings, paragraphs, `-` and `1.` lists, `**bold**` and `` `code` ``.
 * Pure, so the unit test calls it on the file directly.
 */
import { SITE_ORIGIN } from "./site.ts";

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string }
  | { kind: "strong"; text: string }
  /** 020 decision 16: a link in prose, `[text](href)`, as to the upgrade guide. */
  | { kind: "href"; text: string; href: string };

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

/**
 * A prose link's target, or null: a site path, an anchor, or an https URL
 * (020 review, finding 6). The site's own absolute address, which the file
 * uses so its links work on GitHub, renders site-relative.
 */
function safeHref(href: string): string | null {
  if (href.startsWith(`${SITE_ORIGIN}/`)) return href.slice(SITE_ORIGIN.length);
  if (/^\/(?!\/)/.test(href) || href.startsWith("#")) return href;
  if (href.startsWith("https://")) return href;
  return null;
}

/** A line's inline Markdown: code spans first (nothing inside them is read), then links, then bold. */
export function inlines(text: string): Inline[] {
  const out: Inline[] = [];
  const parts = text.split(/(`[^`]*`)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      out.push({ kind: "code", text: part.slice(1, -1) });
      continue;
    }
    for (const piece of part.split(/(\[[^\]]+\]\([^)\s]+\))/)) {
      if (!piece) continue;
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(piece);
      const href = link ? safeHref(link[2]!) : null;
      if (link && href) {
        out.push({ kind: "href", text: link[1]!, href });
        continue;
      }
      const bold = piece.split(/(\*\*[^*]+\*\*)/);
      for (const b of bold) {
        if (!b) continue;
        if (b.startsWith("**") && b.endsWith("**"))
          out.push({ kind: "strong", text: b.slice(2, -2) });
        else out.push({ kind: "text", text: b });
      }
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

/** A list item's head: its inlines before the first colon in its text. */
function head(item: Inline[]): Inline[] {
  const out: Inline[] = [];
  for (const i of item) {
    if (i.kind === "code") {
      out.push(i);
      continue;
    }
    const at = i.text.indexOf(":");
    if (at < 0) {
      out.push(i);
      continue;
    }
    if (at > 0) out.push({ ...i, text: i.text.slice(0, at) });
    return out;
  }
  return [];
}

/** The item names a bullet's head holds, as code spans. */
export function headNames(item: Inline[]): string[] {
  return head(item)
    .filter((i) => i.kind === "code")
    .map((i) => i.text);
}

/**
 * 018 decision 4: the newest release whose entry has a bullet whose head
 * names the item, else `since` (null when no bullet names it and no since
 * is given).
 */
export function updatedIn(
  name: string,
  since: string | null,
  log: Changelog,
): string | null {
  for (const r of log.releases)
    for (const b of r.blocks)
      if (b.kind !== "p" && b.items.some((i) => headNames(i).includes(name)))
        return r.version;
  return since;
}

/** 018 decision 11: the badge's words for a bullet's "**interface change.**". */
export const INTERFACE_CHANGE = "Interface change";

/** An inline as the page sets it: an item's name may link, the mark is a badge. */
export type PageInline =
  | Inline
  | { kind: "link"; text: string; href: string }
  | { kind: "mark"; text: typeof INTERFACE_CHANGE };

export type PageBlock =
  | { kind: "p"; inlines: PageInline[] }
  | { kind: "ul" | "ol"; items: PageInline[][] };

export type PageRelease = {
  /** The heading: the version alone, "0.12.0". */
  version: string;
  id: string;
  /** The date line: the date as written, in a `<time>`, or "Unreleased". */
  date: { text: string; datetime: string | null };
  blocks: PageBlock[];
};

export type ChangelogPage = { intro: PageBlock[]; releases: PageRelease[] };

/** A heading's date line: "2026-11-07" as written, or "Unreleased". */
function dateLine(release: Release): PageRelease["date"] {
  const written = release.title
    .slice(release.version.length)
    .replace(/^\s*—\s*/, "")
    .trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(written))
    return { text: written, datetime: written };
  if (written === "" || written.toLowerCase() === "unreleased")
    return { text: "Unreleased", datetime: null };
  return { text: written, datetime: null };
}

/** How many of an item's inlines its head holds whole: those before the colon. */
function headLength(item: Inline[]): number {
  for (const [i, x] of item.entries())
    if (x.kind !== "code" && x.text.includes(":")) return i;
  return 0;
}

function pageItem(
  item: Inline[],
  href: (name: string) => string | null,
): PageInline[] {
  const n = headLength(item);
  return item.map((x, i): PageInline => {
    if (x.kind === "code" && i < n) {
      const to = href(x.text);
      if (to) return { kind: "link", text: x.text, href: to };
    }
    if (x.kind === "strong" && x.text === "interface change.")
      return { kind: "mark", text: INTERFACE_CHANGE };
    return x;
  });
}

function pageBlocks(
  blocks: Block[],
  href: (name: string) => string | null,
): PageBlock[] {
  return blocks.map((b) =>
    b.kind === "p"
      ? b
      : { kind: b.kind, items: b.items.map((i) => pageItem(i, href)) },
  );
}

/**
 * 018 decision 11: the changelog as the page sets it, so it scans. Each
 * release's heading is its version, with its date on a line of its own; in
 * a bullet's head, a code span naming an item links to its page (`href`
 * returns the page, or null for a name that is not an item); a bullet's
 * "**interface change.**" is the badge's "Interface change". The text is
 * otherwise `parseChangelog`'s.
 */
export function changelogPage(
  log: Changelog,
  href: (name: string) => string | null,
): ChangelogPage {
  return {
    intro: log.intro,
    releases: log.releases.map((r) => ({
      version: r.version,
      id: r.id,
      date: dateLine(r),
      blocks: pageBlocks(r.blocks, href),
    })),
  };
}
