/**
 * 018 decision 13: a picture of every component, for the Components index.
 *
 *   bun scripts/site/thumbnails.ts            builds the site first
 *   bun scripts/site/thumbnails.ts --no-build uses build/ as it is
 *   bun scripts/site/thumbnails.ts --hash-only rewrites the manifest alone
 *
 * For each item it opens what the item's page shows first, its first
 * example's view or its block's or composition's first view, in light and
 * in dark, photographs the first 800 × 500 CSS px, scales the picture to
 * 480 × 300 and encodes it as WebP at quality 0.8 in Chromium. It writes
 * src/lib/site/thumbnails/<item>-light.webp and -dark.webp, and the
 * manifest of each item's source hash, which tests/unit/thumbnails.test.ts
 * checks.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { firstStage, THUMB_STATE } from "../../src/lib/site/example-order.ts";
import { isListed } from "../../src/lib/site/items.ts";
import { MANIFEST, THUMBNAILS, thumbnailHash } from "./thumbnail-hash.ts";

const ROOT = path.resolve(import.meta.dir, "../..");
const BUILD = path.join(ROOT, "build");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));

// `--hash-only`: the pictures stand, and only what the hash reads changed
// (as when an input joins it): write the manifest again, and nothing else.
if (process.argv.includes("--hash-only")) {
  const reg = JSON.parse(
    readFileSync(path.join(ROOT, "registry.json"), "utf8"),
  ) as { items: { name: string; meta?: { deprecated?: unknown } }[] };
  const m = Object.fromEntries(
    reg.items
      .filter(isListed)
      .map((i) => [i.name, thumbnailHash(ROOT, i.name)])
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(path.join(ROOT, MANIFEST), JSON.stringify(m, null, 2) + "\n");
  console.log(`thumbnails: manifest rewritten for ${reg.items.length} items`);
  process.exit(0);
}

if (!process.argv.includes("--no-build")) {
  const b = Bun.spawnSync(["bun", "run", "build"], {
    cwd: ROOT,
    stdout: "inherit",
    stderr: "inherit",
  });
  if (b.exitCode !== 0) process.exit(b.exitCode ?? 1);
}

const server = Bun.serve({
  port: 0,
  fetch(req) {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p.includes("..")) return new Response("", { status: 400 });
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(BUILD, p);
    return existsSync(f) && statSync(f).isFile()
      ? new Response(Bun.file(f))
      : new Response("not found", { status: 404 });
  },
});
const origin = `http://localhost:${server.port}`;

const registry = JSON.parse(
  readFileSync(path.join(ROOT, "registry.json"), "utf8"),
) as {
  items: { name: string }[];
};
const names = registry.items
  .filter(isListed)
  .map((i) => i.name)
  .filter((n) => !only.length || only.includes(n));
mkdirSync(path.join(ROOT, THUMBNAILS), { recursive: true });
const manifestPath = path.join(ROOT, MANIFEST);
const manifest: Record<string, string> = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : {};

const browser = await chromium.launch();
const encoder = await (await browser.newContext()).newPage();
const started = Date.now();
/** The smallest text in each picture, in px as the tile shows it. */
const sizesPath = path.join(ROOT, THUMBNAILS, "text-sizes.json");
const sizes: Record<string, number | null> = existsSync(sizesPath)
  ? JSON.parse(readFileSync(sizesPath, "utf8"))
  : {};
let bytes = 0;
try {
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      viewport: { width: 1000, height: 900 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    for (const name of names) {
      const stage = firstStage(name);
      if (!stage) throw new Error(`${name}: no first stage`);
      const state = THUMB_STATE[name];
      // An example item: its page's first example stage, in the page at a
      // width where the stage is wider than 800 px. A block or a
      // composition: its first view, alone, at 800 × 500.
      const url =
        stage.kind === "example"
          ? `${origin}/components/${name}/`
          : `${origin}${stage.url}`;
      await page.setViewportSize(
        stage.kind === "example"
          ? { width: 1000, height: 900 }
          : { width: 800, height: 500 },
      );
      const res = await page.goto(url, { waitUntil: "networkidle" });
      if (!res || res.status() !== 200)
        throw new Error(`${name}: ${url} answered ${res?.status()}`);
      if (stage.kind === "view")
        await page
          .locator("main[data-view-ready], body[data-view-ready]")
          .first()
          .waitFor({ timeout: 15_000 })
          .catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      const stageSel =
        stage.kind === "example"
          ? `[data-slot="frame"][data-example="${stage.id}"] [data-slot="frame-stage"]`
          : "body";
      const el = page.locator(stageSel).first();
      await el.scrollIntoViewIfNeeded();
      let capture = stageSel;
      if (state && "face" in state)
        // A font: a large "Aa" and a short line in its own face.
        await el.evaluate((e, face) => {
          // One box for every face: the cap height trimmed to the top, the
          // baseline to the bottom, so "Aa" and the line sit alike in each.
          e.innerHTML = `<div data-thumb-box style="box-sizing: content-box; width: 360px; height: 200px; padding: 0; font-family: var(${face}); color: var(--foreground); display: grid; align-content: start; gap: 28px"><div style="font-size: 112px; line-height: 1; text-box: trim-both cap alphabetic">Aa</div><div style="font-size: 22px; line-height: 1; text-box: trim-both cap alphabetic">Work runs on data.</div></div>`;
        }, state.face);
      if (state && "open" in state) {
        const t = el.locator(state.open.trigger).first();
        if (state.open.hover) await t.hover();
        else await t.click();
        await page.locator(state.open.capture).first().waitFor();
        capture = state.open.capture;
      }
      await page.waitForTimeout(400);
      // The content's box: every painted descendant, clipped to the stage
      // (or the open overlay), and its smallest text.
      const box = await page.evaluate((sel) => {
        // The first match that is on screen: a tooltip leaves a hidden copy.
        const root =
          [...document.querySelectorAll(sel)].find((e) => {
            const rc = e.getBoundingClientRect();
            return (
              rc.width > 0 &&
              rc.bottom > 0 &&
              getComputedStyle(e).visibility !== "hidden"
            );
          }) ?? document.querySelector(sel)!;
        const limit = root.getBoundingClientRect();
        let [l, t, r, b] = [Infinity, Infinity, -Infinity, -Infinity];
        let minFont = Infinity;
        const painted = (e: Element) => {
          const cs = getComputedStyle(e);
          if (cs.visibility === "hidden" || cs.opacity === "0") return false;
          if (cs.clip !== "auto" || e.closest(".sr-only")) return false;
          const text = [...e.childNodes].some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim(),
          );
          if (text) minFont = Math.min(minFont, parseFloat(cs.fontSize));
          return (
            text ||
            /^(IMG|SVG|CANVAS|INPUT|TEXTAREA|SELECT|HR|METER|PROGRESS|svg)$/.test(
              e.tagName,
            ) ||
            !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) ||
            parseFloat(cs.borderTopWidth) > 0 ||
            parseFloat(cs.borderLeftWidth) > 0
          );
        };
        const all =
          sel === "body"
            ? [...root.querySelectorAll("*")]
            : [root, ...root.querySelectorAll("*")];
        for (const e of all) {
          if (
            e === root &&
            sel !== "body" &&
            !root.matches(
              '[role="dialog"], [role="alertdialog"], [role="menu"], [role="tooltip"], [data-slot="popover-content"]',
            )
          )
            continue;
          const rc = e.getBoundingClientRect();
          // Past what a reader sees: hidden copies, and one-pixel live regions.
          if (rc.width <= 1 || rc.height <= 1 || !painted(e)) continue;
          const cs = getComputedStyle(e);
          if (
            cs.clip !== "auto" ||
            cs.clipPath !== "none" ||
            e.closest(".sr-only")
          )
            continue;
          l = Math.min(l, Math.max(rc.left, limit.left));
          t = Math.min(t, Math.max(rc.top, limit.top));
          r = Math.max(r, Math.min(rc.right, limit.right));
          b = Math.max(b, Math.min(rc.bottom, limit.bottom));
        }
        // A specimen the script set: its own box.
        const fixed = document.querySelector("[data-thumb-box]");
        if (fixed) {
          const rc = fixed.getBoundingClientRect();
          [l, t, r, b] = [rc.left, rc.top, rc.right, rc.bottom];
        }
        if (!isFinite(l))
          [l, t, r, b] = [
            limit.left,
            limit.top,
            limit.left + 400,
            limit.top + 250,
          ];
        const ground =
          sel === "body"
            ? getComputedStyle(document.body).backgroundColor
            : getComputedStyle(
                root.matches('[data-slot="frame-stage"]')
                  ? root
                  : document.body,
              ).backgroundColor;
        return {
          l: l + scrollX,
          t: t + scrollY,
          w: r - l,
          h: b - t,
          minFont: isFinite(minFont) ? minFont : null,
          ground,
        };
      }, capture);
      // Fill the tile with even padding, at most 2×; and never set text
      // below 9 px as the tile shows it (about 300 px wide for 480).
      // An open overlay shows its actions: fit it whole where the 9 px floor
      // allows, with a narrower margin; where it cannot, keep its foot (the
      // actions) and lose the top of its description.
      const overlay = !!state && "open" in state;
      const PAD = overlay ? 12 : 24;
      const SHOWN = 300 / 480;
      let s = Math.min(2, (480 - 2 * PAD) / box.w, (300 - 2 * PAD) / box.h);
      if (box.minFont) s = Math.max(s, Math.min(2, 9 / (box.minFont * SHOWN)));
      const cw = Math.min(box.w, (480 - 2 * PAD) / s);
      const ch = Math.min(box.h, (300 - 2 * PAD) / s);
      const clip = {
        x: overlay ? box.l + box.w - cw : box.l,
        y:
          overlay && !(state as { open: { top?: boolean } }).open.top
            ? box.t + box.h - ch
            : box.t,
        width: Math.max(1, cw),
        height: Math.max(1, ch),
      };
      sizes[`${name}-${scheme}`] = box.minFont
        ? +(box.minFont * s * SHOWN).toFixed(2)
        : null;
      let png: string;
      try {
        png = (await page.screenshot({ clip, fullPage: true })).toString(
          "base64",
        );
      } catch (e) {
        throw new Error(
          `${name} ${scheme}: clip ${JSON.stringify(clip)} of ${JSON.stringify(box)}: ${(e as Error).message}`,
        );
      }
      const webp = await encoder.evaluate(
        async ([b64, fill, w, h]) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = 480;
          c.height = 300;
          const g = c.getContext("2d")!;
          g.imageSmoothingQuality = "high";
          g.fillStyle = fill;
          g.fillRect(0, 0, 480, 300);
          const dw = Number(w);
          const dh = Number(h);
          // Centre what is painted, not the crop: trim the ground's colour
          // from the edges of the scaled picture, then centre the rest.
          const t = document.createElement("canvas");
          t.width = Math.max(1, Math.round(dw));
          t.height = Math.max(1, Math.round(dh));
          const tg = t.getContext("2d")!;
          tg.fillStyle = fill;
          tg.fillRect(0, 0, t.width, t.height);
          tg.drawImage(img, 0, 0, t.width, t.height);
          const px = tg.getImageData(0, 0, t.width, t.height).data;
          const ref = tg.getImageData(0, 0, 1, 1).data;
          tg.fillStyle = fill;
          const probe = document.createElement("canvas").getContext("2d")!;
          probe.fillStyle = fill;
          probe.fillRect(0, 0, 1, 1);
          const gr = probe.getImageData(0, 0, 1, 1).data;
          void ref;
          let [x0, y0, x1, y1] = [t.width, t.height, -1, -1];
          for (let y = 0; y < t.height; y++)
            for (let x = 0; x < t.width; x++) {
              const k = (y * t.width + x) * 4;
              if (
                Math.abs(px[k] - gr[0]) +
                  Math.abs(px[k + 1] - gr[1]) +
                  Math.abs(px[k + 2] - gr[2]) >
                24
              ) {
                if (x < x0) x0 = x;
                if (y < y0) y0 = y;
                if (x > x1) x1 = x;
                if (y > y1) y1 = y;
              }
            }
          if (x1 < 0) [x0, y0, x1, y1] = [0, 0, t.width - 1, t.height - 1];
          const cw2 = x1 - x0 + 1;
          const ch2 = y1 - y0 + 1;
          g.drawImage(
            t,
            x0,
            y0,
            cw2,
            ch2,
            (480 - cw2) / 2,
            (300 - ch2) / 2,
            cw2,
            ch2,
          );
          const blob: Blob = await new Promise((r) =>
            c.toBlob((b) => r(b!), "image/webp", 0.8),
          );
          const buf = new Uint8Array(await blob.arrayBuffer());
          let str = "";
          for (const x of buf) str += String.fromCharCode(x);
          return btoa(str);
        },
        [png, box.ground, String(cw * s), String(ch * s)] as const,
      );
      const out = Buffer.from(webp, "base64");
      bytes += out.length;
      writeFileSync(path.join(ROOT, THUMBNAILS, `${name}-${scheme}.webp`), out);
    }
    await ctx.close();
  }
  for (const name of names) manifest[name] = thumbnailHash(ROOT, name);
  writeFileSync(
    sizesPath,
    JSON.stringify(
      Object.fromEntries(
        Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)),
      ),
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    manifestPath,
    JSON.stringify(
      Object.fromEntries(
        Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
      ),
      null,
      2,
    ) + "\n",
  );
  console.log(
    `thumbnails: ${names.length * 2} images, ${(bytes / 1024).toFixed(0)} kB, in ${((Date.now() - started) / 1000).toFixed(0)} s`,
  );
} finally {
  await browser.close();
  server.stop(true);
}
