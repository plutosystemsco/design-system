import { createRequire } from "node:module";
const require = createRequire("/Users/claygendron/Git/Repos/design-system/package.json");
const { chromium, firefox, webkit } = require("playwright");
for (const [n,e] of [["chromium",chromium],["firefox",firefox],["webkit",webkit]]) {
  const b = await e.launch(); const p = await b.newPage();
  for (const forced of ["none","active"]) {
    await p.emulateMedia({ forcedColors: forced, contrast: "no-preference" });
    const r = await p.evaluate(() => Object.fromEntries(["more","less","custom","no-preference"].map(v=>[v, matchMedia(`(prefers-contrast: ${v})`).matches])));
    console.log(n, "forced", forced, "contrast emulated no-preference ->", JSON.stringify(r));
  }
  await b.close();
}
