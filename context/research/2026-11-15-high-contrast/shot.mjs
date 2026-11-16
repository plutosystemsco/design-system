import { createRequire } from "node:module";
const require = createRequire("/Users/claygendron/Git/Repos/design-system/package.json");
const { chromium } = require("playwright");
const dir = process.argv[2];
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto("file://" + dir + "/swatches.html");
await p.screenshot({ path: dir + "/swatches.png", fullPage: true });
const s = await p.$(".samples"); await s.screenshot({ path: dir + "/in-use.png" });
await b.close();
