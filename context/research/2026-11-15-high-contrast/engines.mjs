// 031: the contrast axis on <html>, composed with 029's pairs, in three engines.
// Run: node engines.mjs   (uses the repository's Playwright 1.64.1)
import { createRequire } from "node:module";
const require = createRequire("/Users/claygendron/Git/Repos/design-system/package.json");
const { chromium, firefox, webkit } = require("playwright");

// Standard pair and HC pair for one text role, one muted role and the glass tint.
// std light #505661 / dark #a39d90 ; hc light #444a55 / dark #b9b3a5
const HC = `--muted-foreground: light-dark(#444a55, #b9b3a5); --glass-tint: light-dark(#fbfaf6, #221f19);`;
const CSS = (lowered) => {
  const css = `
:root { --muted-foreground: light-dark(#505661, #a39d90); --glass-tint: light-dark(#f3f0e8db, #16140fd6);
  --surface-muted-foreground: var(--muted-foreground); color-scheme: light dark; }
.dark { --muted-foreground: light-dark(#505661, #a39d90); --glass-tint: light-dark(#f3f0e8db, #16140fd6);
  --surface-muted-foreground: var(--muted-foreground); color-scheme: dark; }
html[data-scheme="light"], html [data-scheme="light"] { color-scheme: light; }
html[data-scheme="dark"], html [data-scheme="dark"] { color-scheme: dark; }
@supports (color: light-dark(#000, #fff)) {
  html[data-contrast="more"], html[data-contrast="more"] .dark { ${HC} }
  @media (prefers-contrast: more) {
    html:not([data-contrast="standard"]), html:not([data-contrast="standard"]) .dark { ${HC} }
  }
}
@supports not (color: light-dark(#000, #fff)) {
  html:root:is(.dark, [data-scheme="dark"]), html :is(.dark, [data-scheme="dark"]) { --muted-foreground: #a39d90; --glass-tint: #16140fd6; --surface-muted-foreground: var(--muted-foreground); }
  html:root, html [data-scheme="light"] { --muted-foreground: #505661; --glass-tint: #f3f0e8db; --surface-muted-foreground: var(--muted-foreground); }
  html:root:not([data-scheme], .dark) { color-scheme: light; }
  html:root[data-contrast="more"]:is(.dark, [data-scheme="dark"]), html[data-contrast="more"] :is(.dark, [data-scheme="dark"]) { --muted-foreground: #b9b3a5; --glass-tint: #221f19; --surface-muted-foreground: var(--muted-foreground); }
  html:root[data-contrast="more"], html[data-contrast="more"] [data-scheme="light"] { --muted-foreground: #444a55; --glass-tint: #fbfaf6; --surface-muted-foreground: var(--muted-foreground); }
}
@layer base { :where([data-scheme="light"], [data-scheme="dark"], .dark) { --muted-foreground: var(--surface-muted-foreground); } }
.t { color: var(--muted-foreground); background-color: var(--glass-tint); }
.field { --muted-foreground: #ffffff; }
`;
  return lowered ? css.replaceAll("light-dark(", "light-dark-x(") : css;
};
const BODY = `
<p id="root" class="t">root</p>
<section data-scheme="dark"><p id="dscope" class="t">d</p>
  <section data-scheme="light"><p id="lind" class="t">l in d</p></section></section>
<section class="dark"><p id="alias" class="t">alias</p>
  <section data-scheme="light"><p id="lalias" class="t">l in alias</p></section></section>
<div class="field"><section data-scheme="dark"><p id="fieldd" class="t">d in field</p></section></div>`;

const cases = [
  { name: "no attr, no preference", html: `data-scheme="light"`, contrast: "no-preference" },
  { name: "no attr, system more (scripts off)", html: ``, contrast: "more", scheme: "light" },
  { name: "standard beats system more", html: `data-scheme="light" data-contrast="standard"`, contrast: "more" },
  { name: "more by hand, no preference", html: `data-scheme="light" data-contrast="more"`, contrast: "no-preference" },
  { name: "more by hand, dark root", html: `data-scheme="dark" class="dark" data-contrast="more"`, contrast: "no-preference" },
  { name: "system more, forced colours", html: `data-scheme="light" data-contrast="more"`, contrast: "more", forced: "active" },
];
const want = {
  std: { L: "rgb(80, 86, 97)", D: "rgb(163, 157, 144)" },
  hc: { L: "rgb(68, 74, 85)", D: "rgb(185, 179, 165)" },
};

let mismatches = 0, runs = 0;
for (const [ename, engine] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]]) {
  const browser = await engine.launch();
  for (const lowered of [false, true]) for (const c of cases) {
    if (lowered && c.name.includes("scripts off")) continue; // 029 decision 6.3: the fallback reads light with scripts off
    const page = await browser.newPage();
    await page.emulateMedia({ contrast: c.contrast, colorScheme: c.scheme ?? "light", forcedColors: c.forced ?? "none" });
    await page.setContent(`<!doctype html><html ${c.html}><head><style>${CSS(lowered)}</style></head><body>${BODY}</body></html>`);
    const read = await page.evaluate(() => {
      const g = (id) => getComputedStyle(document.getElementById(id)).color;
      return { root: g("root"), dscope: g("dscope"), lind: g("lind"), alias: g("alias"), lalias: g("lalias"), fieldd: g("fieldd"),
        mqMore: matchMedia("(prefers-contrast: more)").matches, forced: matchMedia("(forced-colors: active)").matches,
        rootBg: getComputedStyle(document.getElementById("root")).backgroundColor };
    });
    runs++;
    const isHC = c.html.includes('data-contrast="more"') || (c.contrast === "more" && !c.html.includes("standard"));
    const set = isHC ? want.hc : want.std;
    const rootDark = c.html.includes('"dark"');
    const exp = { root: rootDark ? set.D : set.L, dscope: set.D, lind: set.L, alias: set.D, lalias: set.L, fieldd: set.D };
    if (c.forced) { console.log(ename, lowered ? "fallback" : "modern", c.name, JSON.stringify(read)); await page.close(); continue; }
    const bad = Object.entries(exp).filter(([k, v]) => read[k] !== v);
    if (bad.length) mismatches++;
    console.log(ename, lowered ? "fallback" : "modern", "|", c.name, "|", bad.length ? "MISMATCH " + JSON.stringify(bad.map(([k, v]) => [k, read[k], "want", v])) : "ok", "| mq more:", read.mqMore, "| root bg", read.rootBg);
    await page.close();
  }
  await browser.close();
}
console.log(`\n${runs} runs, ${mismatches} with a mismatch`);
