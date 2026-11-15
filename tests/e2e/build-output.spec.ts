/**
 * 015 decision 24: every check that reads `build/`. Playwright's webServer
 * has run `bun run build` before any e2e file, so the output exists here; no
 * unit test reads it. This file opens no page, and runs in the light project
 * only (`playwright.config.ts`).
 */
import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { apiTables } from "../../src/lib/site/api.server.ts";
import { CITATION_PATTERNS } from "../../src/lib/site/citations.ts";
import { DOORS } from "../../src/lib/site/doors.ts";
import { filesYouOwn } from "../../src/lib/site/files.ts";
import { shownSource } from "../../src/lib/site/shown-source.ts";
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import { SITEMAP } from "../../src/lib/site/sitemap.ts";

const BUILD = path.resolve("build");

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

/** A built HTML file's page path: `components/button/index.html` is `/components/button/`. */
function pagePath(file: string): string {
  const rel = path.relative(BUILD, file).split(path.sep).join("/");
  return "/" + rel.replace(/index\.html$/, "");
}

test.describe("015: the pages in build/", () => {
  const html = walkFiles(BUILD).filter((f) => f.endsWith(".html"));
  const pages = html
    .map(pagePath)
    .filter(
      (p) => !/^\/(view|example|r|v\d[^/]*)\//.test(p) && p !== "/404.html",
    );

  test("criterion 2: every built page outside the machine paths is an entry of the page list", () => {
    const listed = new Set(SITEMAP.map((p) => p.path));
    expect(pages.filter((p) => !listed.has(p))).toEqual([]);
  });

  test("criterion 2: every entry of the page list has a built page", () => {
    const built = new Set(pages);
    expect(SITEMAP.map((p) => p.path).filter((p) => !built.has(p))).toEqual([]);
  });

  test("criterion 3: 75 of 75 components/<name>/index.html; nothing under items/, identity/ or workbench/; no _redirects", () => {
    const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
      items: { name: string }[];
    };
    expect(
      registry.items.filter((i) =>
        existsSync(path.join(BUILD, "components", i.name, "index.html")),
      ),
    ).toHaveLength(75);
    for (const gone of ["items", "identity", "workbench"])
      expect(existsSync(path.join(BUILD, gone)), gone).toBe(false);
    expect(existsSync(path.join(BUILD, "_redirects"))).toBe(false);
  });
});

test.describe("015: the 404 page", () => {
  test("criterion 23: build/404.html loads every asset from /_app/, holds the four door links and no field, and says noindex", () => {
    const file = path.join(BUILD, "404.html");
    expect(existsSync(file)).toBe(true);
    const text = readFileSync(file, "utf8");
    const refs = [...text.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(
      (m) => m[1],
    );
    const assets = refs.filter((r) => r.includes("_app/"));
    expect(assets.length).toBeGreaterThan(0);
    expect(assets.filter((r) => !r.startsWith("/_app/"))).toEqual([]);
    const main = /<main[\s\S]*?<\/main>/.exec(text)?.[0] ?? "";
    for (const d of DOORS) expect(main).toContain(`href="${d.path}"`);
    expect(text).not.toMatch(/\bfield-[1-4]\b/);
    expect(text).toContain('<meta name="robots" content="noindex"');
  });
});

test.describe("015: the worker's files", () => {
  test("criterion 24: build/_headers equals static/_headers", () => {
    expect(readFileSync(path.join(BUILD, "_headers"), "utf8")).toBe(
      readFileSync("static/_headers", "utf8"),
    );
  });
});

/** A built page's `<main>`, and the part a reader of the twin reads. */
function mainOf(html: string): string {
  return /<main[\s\S]*<\/main>/.exec(html)?.[0] ?? "";
}

/** Removes every element marked data-md="skip" from HTML, nesting counted. */
function withoutSkipped(html: string): string {
  let out = html;
  for (;;) {
    const at = out.search(/<([a-z0-9]+)\b[^>]*\bdata-md="skip"/i);
    if (at < 0) return out;
    const tag = /^<([a-z0-9]+)/i.exec(out.slice(at))![1];
    const re = new RegExp(`<${tag}\\b|</${tag}>`, "gi");
    re.lastIndex = at;
    let depth = 0;
    let end = out.length;
    for (let m = re.exec(out); m; m = re.exec(out)) {
      depth += m[0].startsWith("</") ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    out = out.slice(0, at) + out.slice(end);
  }
}

function text(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const twinOf = (p: string) => path.join(BUILD, p, "index.md");
const pageOf = (p: string) => path.join(BUILD, p, "index.html");
/** A link at the site's address, or a root path, as a file in build/. */
function builtFile(href: string): string | null {
  const local = href.startsWith(SITE_ORIGIN)
    ? href.slice(SITE_ORIGIN.length)
    : href;
  if (!local.startsWith("/")) return null;
  const clean = local.split("#")[0];
  return path.join(BUILD, clean.endsWith("/") ? `${clean}index.html` : clean);
}

test.describe("015: the Markdown twins", () => {
  test("criterion 19: every page has index.md", () => {
    expect(
      SITEMAP.filter((p) => !existsSync(twinOf(p.path))).map((p) => p.path),
    ).toEqual([]);
  });

  test("criterion 19: each twin holds its page's headings outside data-md=skip, with the same text", () => {
    const wrong: string[] = [];
    for (const p of SITEMAP) {
      const main = withoutSkipped(mainOf(readFileSync(pageOf(p.path), "utf8")));
      const headings = [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)]
        .map((m) =>
          text(
            withoutSkipped(
              m[2].replace(/<span[^>]*aria-hidden="true"[\s\S]*?<\/span>/g, ""),
            ),
          ),
        )
        .filter(Boolean);
      const twin = readFileSync(twinOf(p.path), "utf8");
      const outside = twin.replace(/^(`{3,})[\s\S]*?^\1/gm, "");
      const md = [...outside.matchAll(/^#{1,6} (.+)$/gm)].map((m) =>
        m[1]
          .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
          .replace(/`/g, "")
          .replace(/\*\*/g, ""),
      );
      const plain = headings.map((h) => h.replace(/`/g, ""));
      if (JSON.stringify(plain) !== JSON.stringify(md))
        wrong.push(
          `${p.path}: ${JSON.stringify(plain)} != ${JSON.stringify(md)}`,
        );
    }
    expect(wrong).toEqual([]);
  });

  test("criterion 19: each twin holds 0 HTML tags outside code spans and fences", () => {
    const wrong: string[] = [];
    for (const p of SITEMAP) {
      // The site's address holds the `<account>` placeholder until the
      // owner sets it: a known string, not a tag.
      const twin = readFileSync(twinOf(p.path), "utf8")
        .split(SITE_ORIGIN)
        .join("")
        .replace(/^(`{3,})[\s\S]*?^\1/gm, "")
        .replace(/(`+)[\s\S]*?\1/g, "");
      const tags = twin.match(/<\/?[a-z][a-z0-9-]*\b[^>]*>/gi);
      if (tags) wrong.push(`${p.path}: ${tags.slice(0, 3).join(" ")}`);
    }
    expect(wrong).toEqual([]);
  });

  test("criterion 19: 75 of 75 component twins hold the shown source of each of their examples, fenced as svelte", () => {
    const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
      items: { name: string; type: string; meta: { group: string } }[];
    };
    let checked = 0;
    const wrong: string[] = [];
    for (const item of registry.items) {
      const twin = readFileSync(twinOf(`/components/${item.name}/`), "utf8");
      const dir = path.join("src/lib/site/examples", item.name);
      if (existsSync(dir))
        for (const f of readdirSync(dir).filter((f) => f.endsWith(".svelte"))) {
          const shown = shownSource(
            readFileSync(path.join(dir, f), "utf8"),
          ).replace(/\n+$/, "");
          if (!twin.includes("```svelte\n" + shown + "\n```"))
            wrong.push(`${item.name}/${f}`);
        }
      checked++;
    }
    expect(checked).toBe(75);
    expect(wrong).toEqual([]);
  });

  test("criterion 19: every page links its twin and llms.txt, and both resolve", () => {
    const wrong: string[] = [];
    for (const p of SITEMAP) {
      const head = readFileSync(pageOf(p.path), "utf8").split("</head>")[0];
      const alt =
        /<link rel="alternate" type="text\/markdown" href="([^"]+)"/.exec(
          head,
        )?.[1];
      const by = /<link rel="describedby" href="([^"]+)"/.exec(head)?.[1];
      if (!alt || !existsSync(builtFile(alt)!))
        wrong.push(`${p.path}: alternate ${alt}`);
      if (!by || !existsSync(builtFile(by)!))
        wrong.push(`${p.path}: describedby ${by}`);
    }
    expect(wrong).toEqual([]);
  });
});

test.describe("015: llms.txt", () => {
  const llms = () => readFileSync(path.join(BUILD, "llms.txt"), "utf8");

  test("criterion 20: an H1, a blockquote, 4 door sections, Registry and Optional", () => {
    const t = llms();
    expect(t.startsWith("# Pluto Systems design\n\n> ")).toBe(true);
    const h2 = [...t.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(h2).toEqual([...DOORS.map((d) => d.name), "Registry", "Optional"]);
  });

  test("criterion 20: it links every page's twin exactly once, and every link resolves", () => {
    const links = [...llms().matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    for (const p of SITEMAP)
      expect(
        links.filter((l) => l === `${SITE_ORIGIN}${p.path}index.md`),
        p.path,
      ).toHaveLength(1);
    const broken = links.filter((l) => {
      const f = builtFile(l);
      return !f || !existsSync(f);
    });
    expect(broken).toEqual([]);
  });
});

test.describe("015: the search index", () => {
  const index = () =>
    JSON.parse(readFileSync(path.join(BUILD, "search.json"), "utf8")) as {
      path: string;
    }[];

  test("criterion 21: its page entries equal the page list, each path once", () => {
    const pages = index()
      .filter((e) => !e.path.includes("#"))
      .map((e) => e.path);
    expect(pages).toEqual(SITEMAP.map((p) => p.path));
    expect(new Set(index().map((e) => e.path)).size).toBe(index().length);
  });

  test("criterion 21: every anchor entry points at an element with its id on its built page", () => {
    const wrong = index()
      .filter((e) => e.path.includes("#"))
      .filter((e) => {
        const [p, id] = e.path.split("#");
        return !readFileSync(pageOf(p), "utf8").includes(`id="${id}"`);
      })
      .map((e) => e.path);
    expect(wrong).toEqual([]);
  });

  test("criterion 21: at most 30 kB gzipped", () => {
    const gz = Bun.gzipSync(
      new Uint8Array(readFileSync(path.join(BUILD, "search.json"))),
    );
    console.log(`search.json: ${(gz.length / 1024).toFixed(1)} kB gzipped`);
    expect(gz.length).toBeLessThanOrEqual(30 * 1024);
  });
});

test.describe("015: crawlers", () => {
  test("criterion 24: sitemap.xml lists every page at SITE_ORIGIN, none under /view/ or /example/; robots.txt names it", () => {
    const xml = readFileSync(path.join(BUILD, "sitemap.xml"), "utf8");
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
    );
    expect(locs).toEqual(SITEMAP.map((p) => `${SITE_ORIGIN}${p.path}`));
    expect(locs.filter((l) => /\/(view|example)\//.test(l))).toEqual([]);
    expect(readFileSync(path.join(BUILD, "robots.txt"), "utf8")).toContain(
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    );
  });
});

/**
 * 015 criterion 29: the site's own words cite no internal document. Read:
 * every built page's <main> text (code removed), every twin (fences
 * removed), every API row and every file list. On /changelog/ and its twin,
 * the bare R/L rule pattern and the literal `context/` are not read.
 */
test.describe("015: public", () => {
  const WORDS = [
    "decisions.md",
    "context/",
    "reviews/",
    "spec review",
    "change review",
    "specification",
  ];
  const authors = [
    ...new Set(
      execFileSync("git", ["log", "--format=%an"], { encoding: "utf8" })
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean),
    ),
  ];

  function hits(text: string, changelog: boolean): string[] {
    const out: string[] = [];
    for (const w of WORDS) {
      if (changelog && w === "context/") continue;
      if (text.toLowerCase().includes(w.toLowerCase())) out.push(w);
    }
    for (const p of CITATION_PATTERNS) {
      if (changelog && p.name === "bare rule") continue;
      if (p.re.test(text)) out.push(p.name);
    }
    for (const a of authors) if (text.includes(a)) out.push(`author ${a}`);
    return out;
  }

  test("criterion 29: 0 matches in every page's main text, twin, API row and file list", () => {
    const wrong: string[] = [];
    for (const p of SITEMAP) {
      const changelog = p.path === "/changelog/";
      const main = mainOf(readFileSync(pageOf(p.path), "utf8"))
        .replace(/<pre[\s\S]*?<\/pre>/g, " ")
        .replace(
          /<div[^>]*data-slot="code-block"[\s\S]*?<\/pre>\s*<\/div>/g,
          " ",
        );
      for (const h of hits(text(main), changelog))
        wrong.push(`${p.path} page: ${h}`);
      const twin = readFileSync(twinOf(p.path), "utf8").replace(
        /^(`{3,})[\s\S]*?^\1/gm,
        " ",
      );
      for (const h of hits(twin, changelog)) wrong.push(`${p.path} twin: ${h}`);
    }
    const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
      items: { name: string; files: { path: string; type: string }[] }[];
    };
    for (const item of registry.items) {
      for (const t of apiTables(item))
        for (const r of t.rows)
          for (const h of hits(
            [r.name, r.type, r.default, r.doc].join(" "),
            false,
          ))
            wrong.push(`${item.name} API ${t.part}.${r.name}: ${h}`);
      for (const f of filesYouOwn(item))
        for (const h of hits(f, false))
          wrong.push(`${item.name} file ${f}: ${h}`);
    }
    expect(wrong).toEqual([]);
  });
});

test.describe("017: the Foundations pages in build/", () => {
  const built = (p: string) =>
    readFileSync(path.join(BUILD, p, "index.html"), "utf8");

  test("criterion 10: /foundations/tokens/, /colour/ and /code/ each hold every row of their table", async () => {
    const { readTokens } = await import("../../scripts/tokens.ts");
    const { tokenRows, codeRows } =
      await import("../../src/lib/site/foundations/tables.ts");
    const { colourRows } =
      await import("../../src/lib/site/foundations/contrast-rows.server.ts");
    const tokens = readTokens();
    const attrs = (html: string, name: string) =>
      [...html.matchAll(new RegExp(`${name}="([^"]+)"`, "g"))].map((m) => m[1]);

    expect(attrs(built("foundations/tokens"), "data-token-row")).toEqual(
      [
        ...tokenRows(tokens).filter((r) => r.kind === "role"),
        ...tokenRows(tokens).filter((r) => r.kind === "primitive"),
      ].map((r) => r.id),
    );
    expect(attrs(built("foundations/colour"), "data-contrast-row")).toEqual(
      colourRows(tokens).map((r) => `${r.theme}:${r.label}`),
    );
    expect(attrs(built("foundations/code"), "data-code-row")).toEqual(
      codeRows(tokens).map((r) => r.role),
    );
  });

  test("criterion 3: each token anchor resolves on the built /foundations/tokens/, and search.json is at most 30 kB gzipped", () => {
    const index = JSON.parse(
      readFileSync(path.join(BUILD, "search.json"), "utf8"),
    ) as { path: string }[];
    const anchors = index.filter((e) =>
      e.path.startsWith("/foundations/tokens/#"),
    );
    expect(anchors.length).toBeGreaterThan(100);
    const html = built("foundations/tokens");
    for (const a of anchors)
      expect(html).toContain(`id="${a.path.split("#")[1]}"`);
    const gz = Bun.gzipSync(readFileSync(path.join(BUILD, "search.json")));
    expect(gz.length).toBeLessThanOrEqual(30 * 1024);
  });
});

test.describe("017: the Brand pages and downloads in build/", () => {
  const BRAND = SITEMAP.filter((p) => p.spec === "017" && p.door === "brand");
  const main = (p: string) => {
    const html = readFileSync(path.join(BUILD, p, "index.html"), "utf8");
    return html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  };

  test("criterion 5: the 6 files are in build/brand/downloads/, each equal to downloadSvg's output", async () => {
    const { readTokens } = await import("../../scripts/tokens.ts");
    const { DOWNLOADS, downloadSvg } =
      await import("../../src/lib/site/brand/downloads.ts");
    const tokens = readTokens();
    expect(
      readdirSync(path.join(BUILD, "brand/downloads"))
        .filter((f) => f.endsWith(".svg"))
        .sort(),
    ).toEqual(DOWNLOADS.map((d) => d.file).sort());
    for (const d of DOWNLOADS)
      expect(
        readFileSync(path.join(BUILD, "brand/downloads", d.file), "utf8"),
      ).toBe(await downloadSvg(tokens, d.file));
  });

  test("criterion 11: in the 9 Brand pages' main, 0 p, li, td or figcaption lack data-claim, outside the breadcrumb's nav", () => {
    expect(BRAND).toHaveLength(9);
    const missing = BRAND.flatMap((p) =>
      [
        ...main(p.path)
          .replace(/<nav\b[\s\S]*?<\/nav>/g, "")
          .matchAll(/<(p|li|td|figcaption)\b([^>]*)>/g),
      ]
        .filter((m) => !/\bdata-claim=/.test(m[2]))
        .map((m) => `${p.path}: <${m[1]}${m[2]}>`),
    );
    expect(missing).toEqual([]);
  });

  test("criterion 11: the products page says the icons are not drawn; 0 pages mention a signature device", () => {
    expect(main("/brand/products/")).toContain(
      "The icons themselves are not drawn yet.",
    );
    for (const p of BRAND) expect(main(p.path)).not.toMatch(/signature/i);
  });
});
