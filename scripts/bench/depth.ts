/**
 * Benchmark, guidance depth: what each system writes about two components,
 * Button and one overlay (Dialog; GOV.UK's error summary), across every tab.
 * Feeds the scorecard's "guidance depth" row.
 *
 *   bun scripts/bench/depth.ts [--only kuiper,primer] [--build build] [--json <file>]
 *
 * For each page it reads the headings, the tab labels, the tables and the
 * main text, and marks ten elements present or absent:
 *   usage, do/don't, anatomy, keyboard, content, accessibility,
 *   props (described: a props table whose description column is ≥ 80% full),
 *   states, changes, evidence (research, known issues, or what is not checked).
 * A heuristic over text, so check a surprising mark by eye before scoring.
 * Unthrottled. Not part of `bun run test`.
 */
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { args, serveBuild } from "./serve.ts";
import { TARGETS } from "./targets.ts";

const opt = args();
const only = typeof opt.only === "string" ? opt.only.split(",") : null;

type PageRead = {
  url: string;
  status: number;
  headings: string[];
  lines: string[];
  words: number;
  tables: { head: string[]; filled: number | null }[];
  figures: number;
  /** Elements whose class names a do or don't figure. */
  doDontFigures: number;
};

const RULES: [string, (p: PageRead[]) => boolean][] = [
  [
    "usage",
    (ps) =>
      has(
        ps,
        /when to use|usage|best practices|guidelines|how it works|when not to use/i,
      ),
  ],
  [
    "do/don't",
    (ps) =>
      ps.reduce(
        (n, p) =>
          n +
          p.lines.filter((l) =>
            /^(do|don['’]t|do not|correct|incorrect|avoid)\.?$/i.test(l),
          ).length +
          p.doDontFigures,
        0,
      ) >= 2,
  ],
  ["anatomy", (ps) => has(ps, /anatomy/i)],
  [
    "keyboard",
    (ps) =>
      // A heading about keys, not an example named "Keyboard".
      has(
        ps,
        /keyboard (interaction|navigation|support|shortcut|and)|key bindings|^keys?\b|keyboard accessib/i,
      ) ||
      ps.some((p) =>
        p.tables.some((t) =>
          /^keys?$|^key(board)? ?(command|shortcut)?s?$/i.test(t.head[0] ?? ""),
        ),
      ),
  ],
  [
    "content",
    (ps) =>
      has(
        ps,
        /content|writing|wording|copy\b|error messages?|language|labels? and/i,
      ),
  ],
  ["accessibility", (ps) => has(ps, /accessib/i)],
  [
    "props described",
    (ps) =>
      ps.some((p) =>
        p.tables.some(
          (t) => isProps(t.head) && t.filled !== null && t.filled >= 0.8,
        ),
      ),
  ],
  ["states", (ps) => has(ps, /\bstates?\b/i)],
  [
    "changes",
    (ps) =>
      has(
        ps,
        /changelog|change log|recent changes|what['’]s new|version history|^updated|changed in/i,
      ) ||
      // A dated or versioned fact line: "Updated: 0.11.0", "Last updated …".
      ps.some((p) =>
        p.lines.some((l) => /^(last )?updated\b|^changed in\b/i.test(l)),
      ),
  ],
  [
    "evidence",
    (ps) =>
      has(ps, /research|known (issues|gaps)|limitations/i) ||
      ps.some((p) =>
        p.lines.some((l) =>
          /\b(are|is) not (yet )?(checked|tested|supported)\b|known (issues|gaps)/i.test(
            l,
          ),
        ),
      ),
  ],
];

function has(ps: PageRead[], re: RegExp) {
  return ps.some((p) => p.headings.some((h) => re.test(h)));
}
function isProps(head: string[]) {
  return /^(prop|props|property|properties|name|attribute|argument|parameter)s?$/i.test(
    head[0] ?? "",
  );
}

async function read(
  page: import("@playwright/test").Page,
  url: string,
): Promise<PageRead> {
  const res = await page.goto(url, { waitUntil: "load", timeout: 90_000 });
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => {
    const root =
      document.querySelector("main") ??
      document.querySelector("[role=main]") ??
      document.body;
    const headings = Array.from(
      document.querySelectorAll(
        "h1, h2, h3, h4, [role=tab], [role=tablist] a, nav[aria-label*=ab] a",
      ),
    )
      .map((h) => (h.textContent || "").replace(/\s+/g, " ").trim())
      .filter((s) => s && s.length < 90);
    const text = (root as HTMLElement).innerText || "";
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const tables = Array.from(root.querySelectorAll("table")).map((t) => {
      const head = Array.from(
        t.querySelectorAll("thead th, tr:first-child th"),
      ).map((th) => (th.textContent || "").trim());
      const di = head.findIndex((h) =>
        /description|what it does|details|usage/i.test(h),
      );
      let filled: number | null = null;
      if (di >= 0) {
        const rows = Array.from(t.querySelectorAll("tbody tr"));
        // Kuiper's default shares the description's cell since 023, marked
        // data-slot="api-default"; it is not a description, so it is left out.
        const said = (td: Element | undefined) => {
          if (!td) return "";
          const copy = td.cloneNode(true) as HTMLElement;
          for (const d of copy.querySelectorAll('[data-slot="api-default"]'))
            d.remove();
          return (copy.textContent || "").trim();
        };
        const full = rows.filter(
          (tr) => said(tr.children[di]).length > 0,
        ).length;
        filled = rows.length ? full / rows.length : null;
      }
      return { head, filled };
    });
    const figures = root.querySelectorAll(
      "img, svg[role=img], figure, video, picture",
    ).length;
    return {
      headings,
      lines,
      words: text.split(/\s+/).filter(Boolean).length,
      tables,
      figures,
      doDontFigures: root.querySelectorAll(
        "[class*='--correct'], [class*='--incorrect'], [class*='do-dont' i], [class*='dodont' i]",
      ).length,
    };
  });
  return { url, status: res?.status() ?? 0, ...r };
}

const server = serveBuild(typeof opt.build === "string" ? opt.build : "build");
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await ctx.newPage();
const rows: Record<string, unknown>[] = [];
for (const t of TARGETS) {
  if (only && !only.includes(t.id)) continue;
  for (const [which, urls] of Object.entries(t.depth)) {
    const pages: PageRead[] = [];
    for (const u of urls) {
      try {
        pages.push(await read(page, server.resolve(u)));
      } catch (e) {
        console.error(t.id, u, String(e).slice(0, 120));
      }
    }
    const marks = Object.fromEntries(RULES.map(([k, f]) => [k, f(pages)]));
    const row = {
      id: t.id,
      component: which,
      pages: pages.map((p) => `${p.status} ${p.url}`),
      words: pages.reduce((n, p) => n + p.words, 0),
      figures: pages.reduce((n, p) => n + p.figures, 0),
      present: Object.values(marks).filter(Boolean).length,
      ...marks,
    };
    rows.push(row);
    console.error(JSON.stringify(row));
  }
}
await browser.close();
server.stop();
if (typeof opt.json === "string")
  writeFileSync(
    opt.json,
    JSON.stringify(
      {
        script: "scripts/bench/depth.ts",
        at: new Date().toISOString(),
        kuiperBuild: server.built,
        rows,
      },
      null,
      2,
    ),
  );
console.table(
  rows.map((r) => {
    const o: Record<string, unknown> = {
      id: r.id,
      part: r.component,
      words: r.words,
      "of 10": r.present,
    };
    for (const [k] of RULES) o[k] = r[k] ? "y" : "";
    return o;
  }),
);
