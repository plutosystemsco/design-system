/**
 * Benchmark, breadth: how many components each system documents, and how
 * many of the 40 reference parts (`REFERENCE_PARTS` in targets.ts) it covers.
 * Feeds the scorecard's "component breadth" row.
 *
 *   bun scripts/bench/breadth.ts [--only carbon,primer] [--rev HEAD] [--json <file>]
 *
 * References: the component links on each system's index page, rendered.
 * Kuiper: the registry items of type `registry:ui` and `registry:block` in
 * `registry.json` at `--rev` (default: the working tree).
 * Slug matching is by pattern, so read the "missing" list before scoring.
 * Not part of `bun run test`.
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { args } from "./serve.ts";
import { REFERENCE_PARTS, TARGETS } from "./targets.ts";

const opt = args();
const only = typeof opt.only === "string" ? opt.only.split(",") : null;

function registryAt(rev: string | true | undefined) {
  if (typeof rev === "string")
    return JSON.parse(
      Bun.spawnSync(["git", "show", `${rev}:registry.json`]).stdout.toString(),
    );
  return JSON.parse(readFileSync("registry.json", "utf8"));
}

function cover(slugs: string[]) {
  const hit: string[] = [];
  const miss: string[] = [];
  for (const [name, re] of REFERENCE_PARTS)
    (slugs.some((s) => re.test(s)) ? hit : miss).push(name);
  return { hit, miss };
}

const rows: Record<string, unknown>[] = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const t of TARGETS) {
  if (only && !only.includes(t.id)) continue;
  let slugs: string[] = [];
  if (t.id === "kuiper") {
    const reg = registryAt(opt.rev);
    slugs = reg.items
      .filter(
        (i: { type: string }) =>
          i.type === "registry:ui" || i.type === "registry:block",
      )
      .map((i: { name: string }) => i.name);
  } else if (t.index) {
    await page.goto(t.index.url, { waitUntil: "load", timeout: 90_000 });
    await page.waitForTimeout(3500);
    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]")).map(
        (a) => (a as HTMLAnchorElement).href,
      ),
    );
    const set = new Set<string>();
    for (const h of hrefs) {
      const m = new URL(h).pathname.match(t.index.slug);
      if (m && !(t.index.drop && t.index.drop.test(m[1]))) set.add(m[1]);
    }
    slugs = [...set].sort();
  }
  const { hit, miss } = cover(slugs);
  const row = {
    id: t.id,
    documented: slugs.length,
    covered: hit.length,
    of: REFERENCE_PARTS.length,
    miss,
    slugs,
  };
  rows.push(row);
  console.error(JSON.stringify({ ...row, slugs: undefined }));
}
await browser.close();
if (typeof opt.json === "string")
  writeFileSync(
    opt.json,
    JSON.stringify(
      {
        script: "scripts/bench/breadth.ts",
        at: new Date().toISOString(),
        rows,
      },
      null,
      2,
    ),
  );
console.table(
  rows.map((r) => ({
    id: r.id,
    documented: r.documented,
    covered: `${r.covered}/${r.of}`,
  })),
);
