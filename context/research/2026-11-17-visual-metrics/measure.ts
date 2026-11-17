/**
 * Throwaway research script for `2026-11-17-visual-metrics.md`.
 * Measures candidate "visual polish" metrics on Kuiper's built site and on
 * reference design-system sites. Our own code; nothing is copied.
 *
 *   bun context/research/2026-11-17-visual-metrics/measure.ts [--only kuiper,primer] [--runs 2]
 *
 * Chromium, 1440 x 900, deviceScaleFactor 1, light scheme, reduced motion.
 * Each page: load, wait for the network to settle, scroll to the bottom and
 * back (to wake lazy content), hide consent banners (never accept them),
 * then read DOM metrics over the whole page and pixel metrics over the first
 * screen (a viewport screenshot). Output: results.json (or
 * results-<ids>.json with --only) and shots/<site>-<home|button>.png
 * beside this file.
 */
import { chromium, type Page } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { serveBuild } from "../../../scripts/bench/serve.ts";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SHOTS = path.join(HERE, "shots");
mkdirSync(SHOTS, { recursive: true });

const argv = process.argv.slice(2);
const flag = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const only = flag("only")?.split(",") ?? null;
const runs = Number(flag("runs") ?? 1);

type Site = { id: string; home: string; button: string; template: string[] };
const K = "kuiper:";
const SITES: Site[] = [
  {
    id: "kuiper",
    home: K + "/",
    button: K + "/components/button/",
    template: ["checkbox", "tabs", "tooltip", "dialog"].map(
      (s) => `${K}/components/${s}/`,
    ),
  },
  {
    id: "carbon",
    home: "https://carbondesignsystem.com/",
    button:
      "https://carbondesignsystem.com/building-blocks/core/components/button/guidelines",
    template: ["checkbox", "tabs", "tooltip", "modal"].map(
      (s) =>
        `https://carbondesignsystem.com/building-blocks/core/components/${s}/guidelines`,
    ),
  },
  {
    id: "primer",
    home: "https://primer.style/",
    button: "https://primer.style/product/components/button/",
    template: ["checkbox", "underline-nav", "tooltip", "dialog"].map(
      (s) => `https://primer.style/product/components/${s}/`,
    ),
  },
  {
    id: "material",
    home: "https://m3.material.io/",
    button: "https://m3.material.io/components/buttons/overview",
    template: ["checkbox", "tabs", "tooltips", "dialogs"].map(
      (s) => `https://m3.material.io/components/${s}/overview`,
    ),
  },
  {
    id: "radix",
    home: "https://www.radix-ui.com/themes",
    button: "https://www.radix-ui.com/themes/docs/components/button",
    template: ["checkbox", "tabs", "tooltip", "dialog"].map(
      (s) => `https://www.radix-ui.com/themes/docs/components/${s}`,
    ),
  },
  {
    id: "govuk",
    home: "https://design-system.service.gov.uk/",
    button: "https://design-system.service.gov.uk/components/button/",
    template: ["checkboxes", "tabs", "details", "error-summary"].map(
      (s) => `https://design-system.service.gov.uk/components/${s}/`,
    ),
  },
];

/* ------------------------------------------------------------------ */
/* In-page DOM metrics. Runs in the browser; must be self-contained.  */
/* ------------------------------------------------------------------ */
function domMetrics() {
  const VH = innerHeight;
  const W = innerWidth;
  const visible = (el: Element) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    if (Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Opacity and visibility are inherited visually, not by computed style:
  // walk up for opacity 0 and for clip-hidden (sr-only) boxes.
  const reallyVisible = (el: Element) => {
    for (let e: Element | null = el; e && e !== document.body; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0)
        return false;
      const r = e.getBoundingClientRect();
      if (
        (s.position === "absolute" || s.position === "fixed") &&
        r.width <= 1 &&
        r.height <= 1
      )
        return false;
      if (s.clip === "rect(0px, 0px, 0px, 0px)" || s.clipPath === "inset(50%)")
        return false;
    }
    return true;
  };

  // --- text runs -----------------------------------------------------
  type Run = {
    chars: number;
    size: number;
    weight: string;
    lh: string;
    family: string;
    color: string;
    el: Element;
    top: number;
    left: number;
  };
  const runs: Run[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const visCache = new Map<Element, boolean>();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = (n.textContent || "").replace(/\s+/g, " ").trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || el.closest("script,style,noscript,template,svg")) continue;
    let v = visCache.get(el);
    if (v === undefined) {
      v = visible(el) && reallyVisible(el);
      visCache.set(el, v);
    }
    if (!v) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0);
    if (!rects.length) continue;
    const s = getComputedStyle(el);
    const size = Math.round(parseFloat(s.fontSize) * 2) / 2;
    const lh =
      s.lineHeight === "normal"
        ? "normal"
        : String(Math.round(parseFloat(s.lineHeight)));
    runs.push({
      chars: t.length,
      size,
      weight: s.fontWeight,
      lh,
      family: s.fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase(),
      color: s.color,
      el,
      top: rects[0].top + scrollY,
      left: rects[0].left,
    });
  }
  const totalChars = runs.reduce((a, r) => a + r.chars, 0);
  const tally = (key: (r: Run) => string) => {
    const m = new Map<string, number>();
    for (const r of runs) m.set(key(r), (m.get(key(r)) ?? 0) + r.chars);
    const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]);
    let acc = 0;
    let n95 = 0;
    for (const [, c] of sorted) {
      if (acc >= 0.95 * totalChars) break;
      acc += c;
      n95++;
    }
    return {
      distinct: m.size,
      cover95: n95,
      top: sorted.slice(0, 8).map(([k, c]) => [k, Math.round((1000 * c) / totalChars) / 10]),
    };
  };
  const type = {
    totalChars,
    sizes: tally((r) => String(r.size)),
    weights: tally((r) => r.weight),
    lineHeights: tally((r) => r.lh),
    families: tally((r) => r.family),
    colors: tally((r) => r.color),
    styles: tally((r) => `${r.size}|${r.weight}|${r.family}|${r.color}`),
  };
  // Prose only: text outside code, tables, navigation, page chrome and controls.
  const prose = runs.filter(
    (r) => !r.el.closest("pre,code,table,nav,header,footer,aside,[role=navigation],button,label,kbd,h1,h2,h3,h4,h5,h6"),
  );
  const proseChars = prose.reduce((a, r) => a + r.chars, 0);
  const proseSizes = new Map<number, number>();
  for (const r of prose) proseSizes.set(r.size, (proseSizes.get(r.size) ?? 0) + r.chars);
  const proseTop = [...proseSizes.entries()].sort((a, b) => b[1] - a[1]);
  const proseSize = proseTop.length ? proseTop[0][0] : null;
  const h1el = document.querySelector("h1");
  const h1size = h1el ? parseFloat(getComputedStyle(h1el).fontSize) : null;
  const proseInfo = {
    chars: proseChars,
    size: proseSize,
    sizeShare: proseTop.length ? Math.round((1000 * proseTop[0][1]) / proseChars) / 10 : null,
    top: proseTop.slice(0, 5).map(([k, c]) => [k, Math.round((1000 * c) / proseChars) / 10]),
    h1ToProse: h1size && proseSize ? Math.round((100 * h1size) / proseSize) / 100 : null,
  };
  const styleSet = (() => {
    const t = type.styles;
    // Recompute the full set covering 95% of characters, for consistency.
    const m = new Map<string, number>();
    for (const r of runs) {
      const k = `${r.size}|${r.weight}|${r.family}|${r.color}`;
      m.set(k, (m.get(k) ?? 0) + r.chars);
    }
    const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]);
    let acc = 0;
    const out: string[] = [];
    for (const [k, c] of sorted) {
      if (acc >= 0.95 * totalChars) break;
      acc += c;
      out.push(k);
    }
    void t;
    return out;
  })();

  // --- spacing -------------------------------------------------------
  const props = [
    "marginTop", "marginRight", "marginBottom", "marginLeft",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "rowGap", "columnGap",
  ] as const;
  let spacingN = 0;
  let on4 = 0;
  let on8 = 0;
  const spacingValues = new Map<number, number>();
  const all = Array.from(document.body.querySelectorAll("*")).slice(0, 8000);
  for (const el of all) {
    if (el.closest("svg")) continue;
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    for (const p of props) {
      const raw = s[p as keyof CSSStyleDeclaration] as string;
      if (!raw || raw === "normal" || raw === "auto") continue;
      const v = Math.abs(parseFloat(raw));
      if (!v || !isFinite(v)) continue;
      spacingN++;
      const rv = Math.round(v * 100) / 100;
      spacingValues.set(rv, (spacingValues.get(rv) ?? 0) + 1);
      if (Math.abs(rv / 4 - Math.round(rv / 4)) < 0.01) on4++;
      if (Math.abs(rv / 8 - Math.round(rv / 8)) < 0.01) on8++;
    }
  }
  const spacing = {
    values: spacingN,
    distinct: spacingValues.size,
    on4px: Math.round((1000 * on4) / Math.max(1, spacingN)) / 10,
    on8px: Math.round((1000 * on8) / Math.max(1, spacingN)) / 10,
    offGrid: [...spacingValues.entries()]
      .filter(([v]) => Math.abs(v / 4 - Math.round(v / 4)) >= 0.01)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
  };

  // --- left edges, first screen ---------------------------------------
  // One x per block that starts text, plus media and controls; first screen only.
  const blockOf = (el: Element) => {
    for (let e: Element | null = el; e; e = e.parentElement) {
      const d = getComputedStyle(e).display;
      if (!d.startsWith("inline") || d === "inline-block" || d === "inline-flex" || d === "inline-grid")
        return e;
    }
    return el;
  };
  const starts = new Map<Element, number>();
  for (const r of runs) {
    if (r.top - scrollY > VH || r.top - scrollY < 0) continue;
    const b = blockOf(r.el);
    if (!starts.has(b)) starts.set(b, r.left);
  }
  for (const el of Array.from(document.querySelectorAll("img,video,canvas,svg,input,select,textarea,picture"))) {
    if (el.parentElement?.closest("svg")) continue;
    const r = el.getBoundingClientRect();
    if (r.top > VH || r.bottom < 0 || r.width < 12 || !visible(el)) continue;
    if (!starts.has(el)) starts.set(el, r.left);
  }
  const xs = [...starts.values()].filter((x) => x >= 0 && x < W).map((x) => Math.round(x)).sort((a, b) => a - b);
  // Cluster within 2 px.
  const clusters: number[][] = [];
  for (const x of xs) {
    const c = clusters[clusters.length - 1];
    if (c && x - c[c.length - 1] <= 2) c.push(x);
    else clusters.push([x]);
  }
  const singles = clusters.filter((c) => c.length === 1).length;
  const leftEdges = {
    items: xs.length,
    distinct: clusters.length,
    perItem: Math.round((100 * clusters.length) / Math.max(1, xs.length)) / 100,
    singletonShare: Math.round((1000 * singles) / Math.max(1, xs.length)) / 10,
    shared3: clusters.filter((c) => c.length >= 3).length,
  };

  // --- overflow and wrap defects, whole page --------------------------
  let spills = 0;
  let truncated = 0;
  const spillEx: string[] = [];
  for (const el of all) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.closest("svg,pre,code,[role=tablist]")) continue;
    if (!el.childNodes.length) continue;
    const hasText = Array.from(el.childNodes).some(
      (c) => c.nodeType === 3 && (c.textContent || "").trim(),
    );
    if (!hasText || !visible(el)) continue;
    const s = getComputedStyle(el);
    if (s.display.startsWith("inline") && s.display !== "inline-block") continue;
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      if (s.textOverflow === "ellipsis") truncated++;
      else if (s.overflowX === "visible") {
        spills++;
        if (spillEx.length < 5)
          spillEx.push(`${el.tagName.toLowerCase()}: ${(el.textContent || "").trim().slice(0, 40)}`);
      }
    }
  }
  const lastLineWords = (el: Element) => {
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const words: { top: number }[] = [];
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const text = n.textContent || "";
      const re = /\S+/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        const r = document.createRange();
        r.setStart(n, m.index);
        r.setEnd(n, m.index + m[0].length);
        const rect = r.getClientRects()[0];
        if (rect && rect.width > 0) words.push({ top: Math.round(rect.top) });
      }
    }
    if (words.length < 2) return { lines: words.length ? 1 : 0, last: words.length };
    const tops: number[] = [];
    for (const w of words) if (!tops.some((t) => Math.abs(t - w.top) < 4)) tops.push(w.top);
    const lastTop = tops[tops.length - 1];
    return { lines: tops.length, last: words.filter((w) => Math.abs(w.top - lastTop) < 4).length };
  };
  let headings = 0;
  let headingsWrapped = 0;
  let headingWidows = 0;
  for (const h of Array.from(document.querySelectorAll("h1,h2,h3,h4"))) {
    if (!visible(h) || !reallyVisible(h)) continue;
    headings++;
    const { lines, last } = lastLineWords(h);
    if (lines >= 2) {
      headingsWrapped++;
      if (last === 1) headingWidows++;
    }
  }
  let paras = 0;
  let parasMulti = 0;
  let paraWidows = 0;
  for (const p of Array.from(document.querySelectorAll("p,li,dd")).slice(0, 300)) {
    if (!visible(p) || !reallyVisible(p)) continue;
    paras++;
    const { lines, last } = lastLineWords(p);
    if (lines >= 2) {
      parasMulti++;
      if (last === 1) paraWidows++;
    }
  }
  // Short labels that wrap: controls, links, keys and table heads whose
  // text is 24 characters or fewer but renders on two or more lines.
  let labels = 0;
  let labelWraps = 0;
  const labelWrapEx: string[] = [];
  for (const el of Array.from(document.querySelectorAll("a,button,kbd,label,th,dt,[role=tab],[role=button],summary,code"))) {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (!t || t.length > 24 || !visible(el) || !reallyVisible(el)) continue;
    labels++;
    if (lastLineWords(el).lines >= 2) {
      labelWraps++;
      if (labelWrapEx.length < 6) labelWrapEx.push(`${el.tagName.toLowerCase()}: ${t}`);
    }
  }
  // Measure (line length) of body paragraphs: characters per line.
  const cpl: number[] = [];
  for (const p of Array.from(document.querySelectorAll("p")).slice(0, 200)) {
    if (!visible(p)) continue;
    const t = (p.textContent || "").trim();
    const { lines } = lastLineWords(p);
    if (lines >= 3) cpl.push(t.length / lines);
  }
  cpl.sort((a, b) => a - b);
  const defects = {
    horizontalScroll: document.documentElement.scrollWidth > innerWidth + 1,
    spills,
    spillEx,
    truncated,
    headings,
    headingsWrapped,
    headingWidows,
    paras,
    parasMulti,
    labels,
    labelWraps,
    labelWrapEx,
    paraWidowShare: Math.round((1000 * paraWidows) / Math.max(1, parasMulti)) / 10,
    medianCharsPerLine: cpl.length ? Math.round(cpl[Math.floor(cpl.length / 2)]) : null,
  };

  // --- media coverage --------------------------------------------------
  const area = (r: DOMRect, y0: number, y1: number) => {
    const top = Math.max(r.top + scrollY, y0);
    const bottom = Math.min(r.bottom + scrollY, y1);
    const left = Math.max(r.left, 0);
    const right = Math.min(r.right, W);
    return Math.max(0, bottom - top) * Math.max(0, right - left);
  };
  const docH = document.documentElement.scrollHeight;
  let mediaFold = 0;
  let mediaPage = 0;
  let mediaCount = 0;
  const media = Array.from(document.querySelectorAll("img,video,canvas,picture>img,iframe,svg"));
  for (const el of media) {
    if (el.parentElement?.closest("svg")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 64 || r.height < 64 || !visible(el)) continue;
    mediaCount++;
    mediaFold += area(r, scrollY, scrollY + VH);
    mediaPage += area(r, 0, docH);
  }
  for (const el of all) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none" || !/url\(/.test(bg)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 64 || r.height < 64) continue;
    mediaCount++;
    mediaFold += area(r, scrollY, scrollY + VH);
    mediaPage += area(r, 0, docH);
  }
  const mediaCov = {
    count: mediaCount,
    foldShare: Math.min(100, Math.round((1000 * mediaFold) / (W * VH)) / 10),
    pageShare: Math.min(100, Math.round((1000 * mediaPage) / (W * docH)) / 10),
  };

  const h1 = document.querySelector("h1");
  const h1r = h1?.getBoundingClientRect();
  return {
    docHeight: docH,
    type,
    prose: proseInfo,
    styleSet,
    spacing,
    leftEdges,
    defects,
    media: mediaCov,
    h1: h1r ? { top: Math.round(h1r.top + scrollY), left: Math.round(h1r.left), size: parseFloat(getComputedStyle(h1!).fontSize) } : null,
  };
}

/* ------------------------------------------------------------------ */
/* In-page pixel metrics on a screenshot (passed as a data URL).       */
/* ------------------------------------------------------------------ */
async function pixelMetrics(dataUrl: string) {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, W, H).data;
  const N = W * H;
  const L = new Float32Array(N);
  // Hasler-Süsstrunk colourfulness, opponent axes rg and yb.
  let srg = 0, syb = 0, srg2 = 0, syb2 = 0;
  const hist = new Map<number, number>();
  for (let i = 0; i < N; i++) {
    const r = d[4 * i], g = d[4 * i + 1], b = d[4 * i + 2];
    const rg = r - g;
    const yb = 0.5 * (r + g) - b;
    srg += rg; syb += yb; srg2 += rg * rg; syb2 += yb * yb;
    L[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const q = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    hist.set(q, (hist.get(q) ?? 0) + 1);
  }
  const mrg = srg / N, myb = syb / N;
  const sdrg = Math.sqrt(Math.max(0, srg2 / N - mrg * mrg));
  const sdyb = Math.sqrt(Math.max(0, syb2 / N - myb * myb));
  const colourfulness = Math.sqrt(sdrg ** 2 + sdyb ** 2) + 0.3 * Math.sqrt(mrg ** 2 + myb ** 2);
  // Colours: 15-bit bins covering 95% of pixels; dominant colour share.
  const bins = [...hist.values()].sort((a, b) => b - a);
  let acc = 0, colours95 = 0;
  for (const v of bins) { if (acc >= 0.95 * N) break; acc += v; colours95++; }
  const dominantShare = bins[0] / N;
  // Edge density: Sobel on luminance, magnitude > 48.
  const edge = new Uint8Array(N);
  let edges = 0;
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = -L[i - W - 1] - 2 * L[i - 1] - L[i + W - 1] + L[i - W + 1] + 2 * L[i + 1] + L[i + W + 1];
      const gy = -L[i - W - 1] - 2 * L[i - W] - L[i - W + 1] + L[i + W - 1] + 2 * L[i + W] + L[i + W + 1];
      if (gx * gx + gy * gy > 48 * 48) { edge[i] = 1; edges++; }
    }
  // White space: share of 8x8 cells that are flat (luminance range < 6).
  const CS = 8;
  const cw = Math.floor(W / CS), ch = Math.floor(H / CS);
  const occupied = new Uint8Array(cw * ch);
  let flat = 0;
  for (let cy = 0; cy < ch; cy++)
    for (let cx = 0; cx < cw; cx++) {
      let lo = 255, hi = 0;
      for (let y = cy * CS; y < cy * CS + CS; y++)
        for (let x = cx * CS; x < cx * CS + CS; x++) {
          const v = L[y * W + x];
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
      if (hi - lo < 6) flat++;
      else occupied[cy * cw + cx] = 1;
    }
  // Quadtree leaves (Reinecke-style decomposition): split while the block's
  // luminance standard deviation exceeds 10 and the block is over 8 px.
  const stdOf = (x0: number, y0: number, w: number, h: number) => {
    let s = 0, s2 = 0, n = 0;
    const step = w * h > 4096 ? 2 : 1;
    for (let y = y0; y < y0 + h; y += step)
      for (let x = x0; x < x0 + w; x += step) { const v = L[y * W + x]; s += v; s2 += v * v; n++; }
    const m = s / n;
    return Math.sqrt(Math.max(0, s2 / n - m * m));
  };
  let leaves = 0;
  const split = (x: number, y: number, w: number, h: number) => {
    if (w <= 8 || h <= 8 || stdOf(x, y, w, h) < 10) { leaves++; return; }
    const w2 = Math.floor(w / 2), h2 = Math.floor(h / 2);
    split(x, y, w2, h2); split(x + w2, y, w - w2, h2);
    split(x, y + h2, w2, h - h2); split(x + w2, y + h2, w - w2, h - h2);
  };
  split(0, 0, W, H);
  // Balance (after Ngo et al.): moments of occupied cells about the centre.
  let wl = 0, wr = 0, wt = 0, wb = 0;
  const mx = cw / 2, my = ch / 2;
  for (let cy = 0; cy < ch; cy++)
    for (let cx = 0; cx < cw; cx++) {
      if (!occupied[cy * cw + cx]) continue;
      const dx = cx + 0.5 - mx, dy = cy + 0.5 - my;
      if (dx < 0) wl += -dx; else wr += dx;
      if (dy < 0) wt += -dy; else wb += dy;
    }
  const bmv = Math.abs(wl - wr) / Math.max(wl, wr, 1);
  const bmh = Math.abs(wt - wb) / Math.max(wt, wb, 1);
  const balance = 1 - (bmv + bmh) / 2;
  // Left-right symmetry: occupied cells whose mirror cell is occupied too.
  let occ = 0, mirrored = 0;
  for (let cy = 0; cy < ch; cy++)
    for (let cx = 0; cx < cw; cx++) {
      if (!occupied[cy * cw + cx]) continue;
      occ++;
      if (occupied[cy * cw + (cw - 1 - cx)]) mirrored++;
    }
  const r1 = (v: number) => Math.round(v * 10) / 10;
  const r3 = (v: number) => Math.round(v * 1000) / 1000;
  return {
    colourfulness: r1(colourfulness),
    colours95,
    dominantShare: r3(dominantShare),
    edgeDensity: r3(edges / N),
    whitespace: r3(flat / (cw * ch)),
    quadtreeLeaves: leaves,
    balance: r3(balance),
    balanceLR: r3(1 - bmv),
    balanceTB: r3(1 - bmh),
    leftHeavy: wl > wr,
    topHeavy: wt > wb,
    symmetry: r3(mirrored / Math.max(1, occ)),
  };
}

/* ------------------------------------------------------------------ */

async function settle(page: Page, cap = 15_000) {
  let inflight = 0;
  let last = Date.now();
  const on = () => ((inflight += 1), (last = Date.now()));
  const off = () => ((inflight = Math.max(0, inflight - 1)), (last = Date.now()));
  page.on("request", on);
  page.on("requestfinished", off);
  page.on("requestfailed", off);
  const start = Date.now();
  while (Date.now() - start < cap) {
    if (inflight === 0 && Date.now() - last > 1000) break;
    await page.waitForTimeout(250);
  }
  page.off("request", on);
  page.off("requestfinished", off);
  page.off("requestfailed", off);
}

async function hideConsent(page: Page) {
  await page.evaluate(() => {
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const s = `${el.id} ${el.getAttribute("class") ?? ""} ${el.getAttribute("aria-label") ?? ""}`;
      if (/cookie|consent|onetrust|truste|gdpr/i.test(s) && !el.closest("main"))
        (el as HTMLElement).style.setProperty("display", "none", "important");
    }
  });
}

const server = serveBuild(path.resolve(HERE, "../../../build"));
const resolve = (u: string) => (u.startsWith(K) ? server.origin + u.slice(K.length) : u);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "reduce",
});
const scratch = await ctx.newPage();
await scratch.setContent("<!doctype html><body></body>");

async function measure(site: string, kind: string, url: string, run: number) {
  const page = await ctx.newPage();
  // Carbon cannot be measured from this session: its CSS, scripts and fonts
  // sit on cdn.carbondesignsystem.com and 1.www.s81c.com, and its examples on
  // react.carbondesignsystem.com, none of which the network allows. Its pages
  // render unstyled, so its rows are dropped from the memo's tables.
  try {
    await page.goto(resolve(url), { waitUntil: "load", timeout: 90_000 });
    await settle(page);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(h, 30_000); y += 800) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page, 8_000);
    await page.waitForTimeout(1200);
    await hideConsent(page);
    const dom = await page.evaluate(domMetrics);
    const shot = await page.screenshot({ type: "png" });
    if (run === 0 && !kind.startsWith("t"))
      writeFileSync(path.join(SHOTS, `${site}-${kind}.png`), shot);
    const px = await scratch.evaluate(pixelMetrics, `data:image/png;base64,${shot.toString("base64")}`);
    return { site, kind, url: page.url(), run, dom, px };
  } catch (e) {
    console.error(site, kind, "failed:", String(e).slice(0, 200));
    return { site, kind, url, run, error: String(e).slice(0, 200) };
  } finally {
    await page.close();
  }
}

const rows: unknown[] = [];
for (const s of SITES) {
  if (only && !only.includes(s.id)) continue;
  const pages: [string, string][] = [
    ["home", s.home],
    ["button", s.button],
    ...s.template.map((u, i) => [`t${i + 1}`, u] as [string, string]),
  ];
  for (let run = 0; run < runs; run++)
    for (const [kind, url] of pages) {
      if (run > 0 && kind.startsWith("t")) continue; // repeat only home and button
      const r = await measure(s.id, kind, url, run);
      rows.push(r);
      const x = r as { dom?: ReturnType<typeof domMetrics>; px?: Record<string, number> };
      console.error(
        s.id, kind, run,
        x.dom ? `sizes ${x.dom.type.sizes.distinct}/${x.dom.type.sizes.cover95} colours ${x.dom.type.colors.distinct}/${x.dom.type.colors.cover95} on4 ${x.dom.spacing.on4px} edges ${x.dom.leftEdges.distinct}` : "",
        x.px ? `M ${x.px.colourfulness} ws ${x.px.whitespace} qt ${x.px.quadtreeLeaves}` : "",
      );
    }
}
await browser.close();
server.stop();
writeFileSync(
  path.join(HERE, only ? `results-${only.join("-")}.json` : "results.json"),
  JSON.stringify({ at: new Date().toISOString(), kuiperBuild: server.built, rows }, null, 2),
);
