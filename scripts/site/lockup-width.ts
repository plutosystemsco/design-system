/**
 * Measures the lockup's word as Chromium lays it out, at 100 px, and writes
 * `tests/fixtures/lockup-word-width.json` (017 decision 4). The unit test
 * compares the downloads' outlined word with this committed value, and
 * `site.spec.ts` checks that the live lockup still measures the same.
 *
 * The page it measures sets the word as the lockup sets it: IBM Plex Sans
 * from the theme's own file, weight 700, the token file's mark tracking.
 *
 *   bun scripts/site/lockup-width.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { readTokens } from "../tokens.ts";

const FONT =
  "node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2";
const OUT = "tests/fixtures/lockup-word-width.json";
const PX = 100;

const tokens = readTokens();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route("http://measure.test/**", (route) =>
    route.request().url().endsWith(".woff2")
      ? route.fulfill({ body: readFileSync(FONT), contentType: "font/woff2" })
      : route.fulfill({
          contentType: "text/html",
          body: `<!doctype html><style>
@font-face { font-family: "Plex"; src: url(/plex.woff2) format("woff2"); font-weight: 100 700; }
body { margin: 0; }
span { font: 700 ${PX}px "Plex"; letter-spacing: ${tokens.type.tracking.mark}em; white-space: pre; }
</style><span>pluto</span>`,
        }),
  );
  await page.goto("http://measure.test/");
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('700 100px "Plex"', "pluto");
  });
  if (!loaded) throw new Error("lockup-width: IBM Plex Sans did not load");
  const width = await page.evaluate(
    () => document.querySelector("span")!.getBoundingClientRect().width,
  );
  const value = { px: PX, width: Math.round(width * 1000) / 1000 };
  writeFileSync(OUT, JSON.stringify(value, null, 2) + "\n");
  console.log(`${OUT}: ${value.width} px at ${PX} px`);
} finally {
  await browser.close();
}
