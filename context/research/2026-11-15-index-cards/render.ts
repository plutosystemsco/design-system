/**
 * 031a exhibit: renders png/<view>-<w>-<scheme>.png from index.html.
 *   bun context/research/2026-11-15-index-cards/render.ts
 * Uses the repository's Playwright Chromium. Writes nothing else.
 */
import path from "node:path";
import { chromium } from "@playwright/test";

const DIR = import.meta.dir;
const b = await chromium.launch();
const shots: [string, string, number][] = [];
for (const s of ["light", "dark"]) {
  for (const v of ["today", "a", "b", "c", "grounds"]) shots.push([v, s, 1440]);
  for (const v of ["today", "a"]) shots.push([v, s, 390]);
}
for (const [v, s, w] of shots) {
  const p = await b.newPage({
    viewport: { width: w === 390 ? 390 : 1000, height: 600 },
    deviceScaleFactor: 2,
    colorScheme: s as "light" | "dark",
  });
  await p.goto(
    `file://${path.join(DIR, "index.html")}?view=${v}&scheme=${s}&w=${w}`,
  );
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({
    path: path.join(DIR, "png", `${v}-${w}-${s}.png`),
    fullPage: true,
  });
  await p.close();
}
await b.close();
console.log(`rendered ${shots.length} PNGs`);
