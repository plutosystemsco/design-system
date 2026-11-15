/**
 * `bun scripts/site/markdown.ts`: after `vite build`, writes the Markdown
 * twin of every page in the page list: `build/<page>/index.md`, made from
 * the built page's `<main>`, with links made absolute at `SITE_ORIGIN`.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { htmlToMarkdown } from "../../src/lib/site/markdown.ts";
import { SITE_ORIGIN } from "../../src/lib/site/site.ts";
import { SITEMAP } from "../../src/lib/site/sitemap.ts";

const BUILD = path.resolve(import.meta.dir, "../../build");
const started = performance.now();
let written = 0;
for (const page of SITEMAP) {
  const html = path.join(BUILD, page.path, "index.html");
  if (!existsSync(html)) throw new Error(`no built page for ${page.path}`);
  const md = await htmlToMarkdown(readFileSync(html, "utf8"), {
    origin: SITE_ORIGIN,
    page: page.path,
  });
  writeFileSync(path.join(BUILD, page.path, "index.md"), md);
  written++;
}
console.log(
  `markdown: ${written} twins in ${Math.round(performance.now() - started)} ms`,
);
