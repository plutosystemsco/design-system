// 031a probe: photograph first examples on candidate stage grounds, encode as
// the thumbnail script does (480x300, WebP q0.8, content centred, 24px pad),
// and record bytes. Not the real pipeline: relative bytes only.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const OUT = `${import.meta.dir}/probe-out`; // gitignored; img/ holds the pictures the exhibit uses
// Serve the 0.12.0 build/ on :5311 first (any static server that maps / to index.html).
mkdirSync(OUT, { recursive: true });
const ITEMS = (process.argv[2] ?? "card,tabs,skeleton,input,button,table,avatar,message,utils,alert,empty,item,badge,switch,accordion,code-block").split(",");
const GROUNDS: Record<string, Record<string, string>> = {
  light: { background: "#f3f0e8", muted: "#e9e5db", sunken: "#dcd7ca", alpha: "transparent" },
  dark: { background: "#16140f", muted: "#2c2821", sunken: "#0b0a07", alpha: "transparent" },
};
const b = await chromium.launch();
const enc = await (await b.newContext()).newPage();
const rows: any[] = [];
for (const scheme of ["light", "dark"] as const) {
  const ctx = await b.newContext({ colorScheme: scheme, viewport: { width: 1000, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  for (const name of ITEMS) {
    await p.goto(`http://localhost:5311/components/${name}/`, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const sel = '[data-slot="frame"] [data-slot="frame-stage"]';
    await p.locator(sel).first().scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    for (const [g, colour] of Object.entries(GROUNDS[scheme])) {
      await p.evaluate(([sel, colour]) => {
        const st = document.querySelector(sel) as HTMLElement;
        st.style.backgroundColor = colour;
        if (colour === "transparent") { document.documentElement.style.background = "transparent"; document.body.style.background = "transparent"; for (let e = st.parentElement; e; e = e.parentElement) e.style.background = "transparent"; }
      }, [sel, colour] as const);
      const box = await p.evaluate((sel) => {
        const root = document.querySelector(sel)!; const lim = root.getBoundingClientRect();
        let [l, t, r, bt] = [Infinity, Infinity, -Infinity, -Infinity];
        for (const e of root.querySelectorAll("*")) {
          const cs = getComputedStyle(e); const rc = e.getBoundingClientRect();
          if (rc.width <= 1 || rc.height <= 1 || cs.visibility === "hidden" || e.closest(".sr-only")) continue;
          const text = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
          const painted = text || /^(IMG|svg|SVG|CANVAS|INPUT|TEXTAREA|SELECT|HR)$/.test(e.tagName) || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0;
          if (!painted) continue;
          l = Math.min(l, Math.max(rc.left, lim.left)); t = Math.min(t, Math.max(rc.top, lim.top));
          r = Math.max(r, Math.min(rc.right, lim.right)); bt = Math.max(bt, Math.min(rc.bottom, lim.bottom, lim.top + 500));
        }
        return { x: l + scrollX, y: t + scrollY, width: Math.min(800, r - l), height: bt - t };
      }, sel);
      const png = (await p.screenshot({ clip: box, fullPage: true, omitBackground: colour === "transparent" })).toString("base64");
      const webp = await enc.evaluate(async ([b64, fill, w, h]) => {
        const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
        const c = document.createElement("canvas"); c.width = 480; c.height = 300; const g = c.getContext("2d")!;
        g.imageSmoothingQuality = "high"; if (fill !== "transparent") { g.fillStyle = fill; g.fillRect(0, 0, 480, 300); }
        const s = Math.min(2, (480 - 48) / Number(w), (300 - 48) / Number(h));
        const dw = Number(w) * s, dh = Number(h) * s;
        g.drawImage(img, (480 - dw) / 2, (300 - dh) / 2, dw, dh);
        const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/webp", 0.8));
        const buf = new Uint8Array(await blob.arrayBuffer()); let str = ""; for (const x of buf) str += String.fromCharCode(x); return btoa(str);
      }, [png, colour, String(box.width), String(box.height)] as const);
      const out = Buffer.from(webp, "base64");
      writeFileSync(`${OUT}/${name}-${scheme}-${g}.webp`, out);
      rows.push({ name, scheme, ground: g, bytes: out.length });
    }
  }
  await ctx.close();
}
await b.close();
writeFileSync(`${OUT}/bytes.json`, JSON.stringify(rows, null, 1));
const sum: Record<string, number> = {};
for (const r of rows) sum[`${r.scheme}-${r.ground}`] = (sum[`${r.scheme}-${r.ground}`] ?? 0) + r.bytes;
console.log(sum);
