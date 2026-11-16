/**
 * 031: derive and measure Kuiper's high-contrast primitives.
 * Read-only: imports the repository's own contrast arithmetic and token reader.
 * Run: bun palette.ts <repo root>   (writes palette.json beside this file)
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

const root = process.argv[2] ?? "/Users/claygendron/Git/Repos/design-system";
const { contrastRatio, compositeTenths, compositeAlphaByte, parseHex } =
  await import(path.join(root, "scripts/contrast.ts"));
const { readTokens } = await import(path.join(root, "scripts/tokens.ts"));
const tokens = readTokens(path.join(root, "tokens/pluto.tokens.json"));
const P: Record<string, string> = tokens.primitives;

// ---------- OKLCH (Björn Ottosson's OKLab), sRGB D65 ----------
const lin = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const gam = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
function toOklch(hex: string) {
  const { r, g, b } = parseHex(hex);
  const [R, G, B] = [r, g, b].map((x) => lin(x / 255));
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), h: Math.atan2(bb, a) };
}
function fromOklch(L: number, C: number, h: number) {
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb: number[]) => rgb.every((c) => c >= -1e-6 && c <= 1 + 1e-6);
/** The hex at lightness L and hue h, with the most chroma up to C that fits sRGB. */
function hexAt(L: number, C: number, h: number): string {
  let c = C;
  let rgb = fromOklch(L, c, h);
  while (!inGamut(rgb) && c > 0) {
    c -= 0.001;
    rgb = fromOklch(L, Math.max(c, 0), h);
  }
  const ch = rgb.map((x) =>
    Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, x))))) * 255),
  );
  return `#${ch.map((x) => x.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/**
 * Moves `base` in OKLCH lightness alone (hue kept, chroma kept where sRGB
 * allows) until its truncated ratio against every ground reaches `target`.
 * The smallest move that passes, so the swatch stays as near its source as it can.
 */
function derive(
  base: string,
  grounds: () => string[],
  target: number,
  dir: "darker" | "lighter",
): string {
  const { L, C, h } = toOklch(base);
  const meets = (hex: string) =>
    grounds().every((g) => contrastRatio(hex, g) >= target);
  if (meets(base)) return base;
  for (let step = 1; step <= 1000; step++) {
    const l = dir === "darker" ? L - step * 0.001 : L + step * 0.001;
    if (l <= 0 || l >= 1) break;
    const hex = hexAt(l, C, h);
    if (meets(hex)) return hex;
  }
  throw new Error(`no ${dir} swatch from ${base} reaches ${target}`);
}

// ---------- the grounds, unchanged in high contrast ----------
const G = {
  light: { background: P.paper, card: P.raised, muted: P.wash },
  dark: { background: P.graphite, card: P["ink-raised"], muted: P["ink-wash"] },
};
const lightGrounds = [P.paper, P.raised, P.wash];
const darkGrounds = [P.graphite, P["ink-raised"], P["ink-wash"]];

const TEXT = 7.0;
const NON_TEXT = 4.5;

// ---------- the new primitives ----------
const hc: Record<string, { hex: string; from: string; why: string }> = {};
function add(name: string, from: string, hex: string, why: string) {
  hc[name] = { hex, from, why };
  return hex;
}

// Light: text roles darken to 7:1 on the darkest light ground (wash), and on their tint.
const tintOf = (hex: string, over: string, alpha: number) =>
  compositeTenths(hex, over, alpha);
function deriveWithTint(base: string, dir: "darker" | "lighter", over: string, alpha: number, grounds: string[]) {
  // Iterate: the tint follows the text colour, and the text must clear its own tint.
  let hex = derive(base, () => grounds, TEXT, dir);
  for (let i = 0; i < 20; i++) {
    const t = tintOf(hex, over, alpha);
    const next = derive(hex, () => [...grounds, t], TEXT, dir);
    if (next === hex) return hex;
    hex = next;
  }
  return hex;
}

add("ink-soft-more", "ink-soft", derive(P["ink-soft"], () => lightGrounds, TEXT, "darker"), "muted text, 7:1 on wash");
add("blue-more", "blue", derive(P.blue, () => lightGrounds, TEXT, "darker"), "primary, link, ring, chart-1, field-1: 7:1 on wash");
add("red-more", "red-text", deriveWithTint(P["red-text"], "darker", P.raised, 0.1, lightGrounds), "destructive text and fill, chart-2, field-2: 7:1 on wash and on its tint");
add("green-more", "green-text", deriveWithTint(P["green-text"], "darker", P.raised, 0.1, lightGrounds), "success text and fill, chart-4, field-4: 7:1 on wash and on its tint");
add("yellow-more", "yellow-text", derive(P["yellow-text"], () => lightGrounds, TEXT, "darker"), "caution text, chart-3: 7:1 on wash");
add("line-more", "line-input", derive(P["line-input"], () => lightGrounds, NON_TEXT, "darker"), "input, border, groove, elevation line, glass edge: 4.5:1 on wash");
add("red-tint-more", "red-more over raised, 10%", tintOf(hc["red-more"].hex, P.raised, 0.1), "destructive alert ground");
add("green-tint-more", "green-more over raised, 10%", tintOf(hc["green-more"].hex, P.raised, 0.1), "success alert ground");

// Dark: text roles lighten to 7:1 on the lightest dark ground (ink-wash), and on their tint.
add("paper-soft-more", "paper-soft", derive(P["paper-soft"], () => darkGrounds, TEXT, "lighter"), "muted text, 7:1 on ink-wash");
add("blue-lifted-more", "blue-lifted", derive(P["blue-lifted"], () => darkGrounds, TEXT, "lighter"), "primary, link, ring, chart-1, field-1: 7:1 on ink-wash");
add("red-lifted-more", "red-lifted", deriveWithTint(P["red-lifted"], "lighter", P["ink-raised"], 0.1, darkGrounds), "destructive: 7:1 on ink-wash and on its tint");
add("green-lifted-more", "green-lifted", deriveWithTint(P["green-lifted"], "lighter", P["ink-raised"], 0.1, darkGrounds), "success: 7:1 on ink-wash and on its tint");
const yl = derive(P["yellow-lifted"], () => darkGrounds, TEXT, "lighter");
if (yl !== P["yellow-lifted"]) add("yellow-lifted-more", "yellow-lifted", yl, "caution text: 7:1 on ink-wash");
add("paper-line-more", "paper-line-input", derive(P["paper-line-input"], () => darkGrounds, NON_TEXT, "lighter"), "input, border, groove, elevation line, glass edge: 4.5:1 on ink-wash");
add("red-tint-lifted-more", "red-lifted-more over ink-raised, 10%", tintOf(hc["red-lifted-more"].hex, P["ink-raised"], 0.1), "destructive alert ground");
add("green-tint-lifted-more", "green-lifted-more over ink-raised, 10%", tintOf(hc["green-lifted-more"].hex, P["ink-raised"], 0.1), "success alert ground");

// The code palette: each Meridian hue moved in lightness alone to 7:1 on both code grounds.
const alias: Record<string, string> = {};
const CODE = ["violet", "blue", "navy", "green", "yellow", "orange", "plum", "red", "grey", "ink"];
const codeLight = [P.raised, P.paper]; // syntax-ground, syntax-active-line
const codeDark = [P["ink-wash"], P["ink-raised"], P.graphite]; // syntax-ground, active line, background
for (const c of CODE) {
  const l = derive(P[`code-${c}`], () => codeLight, TEXT, "darker");
  if (l !== P[`code-${c}`]) add(`code-${c}-more`, `code-${c}`, l, "code text: 7:1 on raised and paper");
  const d = derive(P[`code-${c}-lifted`], () => codeDark, TEXT, "lighter");
  const same = Object.entries(hc).find(([, v]) => v.hex === d);
  if (same) alias[`code-${c}-lifted-more`] = same[0];
  else if (d !== P[`code-${c}-lifted`]) add(`code-${c}-lifted-more`, `code-${c}-lifted`, d, "code text: 7:1 on ink-wash, ink-raised and graphite");
}

const X = (n: string) => hc[n]?.hex ?? hc[alias[n]]?.hex ?? P[n];

// ---------- the roles that change, per scheme ----------
const roles = {
  light: {
    "muted-foreground": "ink-soft-more",
    primary: "blue-more",
    ring: "blue-more",
    "sidebar-primary": "blue-more",
    "sidebar-ring": "blue-more",
    "chart-1": "blue",
    destructive: "red-more",
    "destructive-fill": "red",
    "chart-2": "red",
    success: "green-more",
    "success-fill": "green-text",
    "chart-4": "green-text",
    "caution-text": "yellow-more",
    "chart-3": "yellow-text",
    "chart-5": "ink-soft",
    input: "line-more",
    border: "line-more",
    "sidebar-border": "line-more",
    "groove-line": "line-more",
    "elevation-line": "line-more",
    "destructive-tint": "red-tint-more",
    "success-tint": "green-tint-more",
    scrim: "ink-scrim-deep",
    ...Object.fromEntries(CODE.map((c) => [`syntax-${c}`, hc[`code-${c}-more`] ? `code-${c}-more` : `code-${c}`])),
  } as Record<string, string>,
  dark: {
    "muted-foreground": "paper-soft-more",
    primary: "blue-lifted-more",
    ring: "blue-lifted-more",
    "sidebar-primary": "blue-lifted-more",
    "sidebar-ring": "blue-lifted-more",
    "chart-1": "blue-lifted",
    destructive: "red-lifted-more",
    "destructive-fill": "red-lifted",
    "chart-2": "red-lifted",
    success: "green-lifted-more",
    "success-fill": "green-lifted",
    "chart-4": "green-lifted",
    "caution-text": hc["yellow-lifted-more"] ? "yellow-lifted-more" : "yellow-lifted",
    "chart-3": "yellow-lifted",
    "chart-5": "paper-soft",
    input: "paper-line-more",
    border: "paper-line-more",
    "sidebar-border": "paper-line-more",
    "groove-line": "paper-line-more",
    "elevation-line": "paper-line-more",
    "destructive-tint": "red-tint-lifted-more",
    "success-tint": "green-tint-lifted-more",
    ...Object.fromEntries(CODE.map((c) => [`syntax-${c}`, hc[`code-${c}-lifted-more`] ? `code-${c}-lifted-more` : alias[`code-${c}-lifted-more`] ? alias[`code-${c}-lifted-more`] : `code-${c}-lifted`])),
  } as Record<string, string>,
};
// Drop entries equal to the standard role (no override needed).
const STD_TINT = { light: { "destructive-tint": "#F9E9EA", "success-tint": "#E6F1EE" }, dark: { "destructive-tint": "#4E3631", "success-tint": "#2E4032" } };
function roleHex(theme: "light" | "dark", name: string, hcOn: boolean): string {
  if (hcOn && roles[theme][name]) return X(roles[theme][name]);
  if (name in STD_TINT[theme]) return (STD_TINT[theme] as any)[name];
  return P[tokens.themes[theme][name]];
}
function opaque(theme: "light" | "dark", name: string, ground: string, hcOn: boolean) {
  const hex = roleHex(theme, name, hcOn);
  return parseHex(hex).a === 255 ? hex.toUpperCase() : compositeAlphaByte(hex, ground);
}

// ---------- measure every pair, standard and high contrast ----------
type Row = { set: string; kind: string; label: string; fg: string; bg: string; std: number; hc: number; min: number; pass: boolean };
const rows: Row[] = [];
const text = [
  ...tokens.contrast.text,
  ["destructive", "destructive-tint"],
  ["success", "success-tint"],
];
const nonText = [
  ...tokens.contrast.nonText,
  ["border", "background"], ["border", "card"], ["border", "muted"],
];
for (const theme of ["light", "dark"] as const) {
  for (const [kind, list, min] of [["text", text, TEXT], ["non-text", nonText, NON_TEXT]] as const) {
    for (const [f, b] of list) {
      const bgS = opaque(theme, b, roleHex(theme, "background", false), false);
      const bgH = opaque(theme, b, roleHex(theme, "background", true), true);
      const fgS = opaque(theme, f, bgS, false);
      const fgH = opaque(theme, f, bgH, true);
      const r = contrastRatio(fgH, bgH);
      rows.push({ set: theme, kind, label: `${f} on ${b}`, fg: fgH, bg: bgH, std: contrastRatio(fgS, bgS), hc: r, min, pass: r >= min });
    }
  }
  // Fields: legend on fill, as text, high-contrast fills.
  const fields = tokens.expressive.field[theme];
  for (const [field, [fill, legend]] of Object.entries(fields) as [string, [string, string]][]) {
    const fillHc = theme === "light"
      ? { "field-1": X("blue-more"), "field-2": X("red-more"), "field-3": P.yellow, "field-4": X("green-more") }[field]!
      : { "field-1": X("blue-lifted-more"), "field-2": X("red-lifted-more"), "field-3": P["yellow-lifted"], "field-4": X("green-lifted-more") }[field]!;
    const r = contrastRatio(P[legend], fillHc);
    rows.push({ set: theme, kind: "field", label: `${field} legend on fill`, fg: P[legend], bg: fillHc, std: contrastRatio(P[legend], P[fill]), hc: r, min: TEXT, pass: r >= TEXT });
  }
  // Glass, solid under high contrast: text on the fallback.
  const fb = theme === "light" ? tokens.expressive.glass.light.fallback : P[tokens.expressive.glass.dark.fallback];
  for (const t of ["foreground", "muted-foreground", "primary"]) {
    const r = contrastRatio(roleHex(theme, t, true), fb);
    rows.push({ set: theme, kind: "glass", label: `${t} on solid glass`, fg: roleHex(theme, t, true), bg: fb, std: NaN, hc: r, min: TEXT, pass: r >= TEXT });
  }
  const edge = roleHex(theme, "elevation-line", true);
  for (const g of Object.values(G[theme])) {
    const r = contrastRatio(edge, g);
    rows.push({ set: theme, kind: "non-text", label: `glass edge (${theme === "light" ? "line-more" : "paper-line-more"}) on ${g}`, fg: edge, bg: g, std: NaN, hc: r, min: NON_TEXT, pass: r >= NON_TEXT });
  }
  // Scrim: an overlay's edge on a scrimmed ground.
  for (const over of ["background", "card", "muted"]) {
    const ground = roleHex(theme, over, true);
    const scrimS = compositeAlphaByte(roleHex(theme, "scrim", false), ground);
    const scrimH = compositeAlphaByte(roleHex(theme, "scrim", true), ground);
    const edgeName = theme === "light" ? "popover" : "elevation-line";
    const eS = opaque(theme, edgeName, scrimS, false);
    const eH = opaque(theme, edgeName, scrimH, true);
    const r = contrastRatio(eH, scrimH);
    rows.push({ set: theme, kind: "scrim", label: `${edgeName} edge over ${over} under the scrim`, fg: eH, bg: scrimH, std: contrastRatio(eS, scrimS), hc: r, min: NON_TEXT, pass: r >= NON_TEXT });
  }
  // Code: every syntax role on the code grounds.
  const cg = theme === "light" ? { "syntax-ground": P.raised, "syntax-active-line": P.paper } : { "syntax-ground": P["ink-wash"], "syntax-active-line": P["ink-raised"], background: P.graphite };
  for (const c of CODE) for (const [gn, g] of Object.entries(cg)) {
    const fS = roleHex(theme, `syntax-${c}`, false);
    const fH = roleHex(theme, `syntax-${c}`, true);
    const r = contrastRatio(fH, g);
    rows.push({ set: theme, kind: "code", label: `syntax-${c} on ${gn}`, fg: fH, bg: g, std: contrastRatio(fS, g), hc: r, min: TEXT, pass: r >= TEXT });
  }
  // The caution fill and the four marks (logotype, exempt; reported, not gated).
  rows.push({ set: theme, kind: "text", label: "caution-foreground on caution", fg: P.ink, bg: P[tokens.themes[theme].caution], std: contrastRatio(P.ink, P[tokens.themes[theme].caution]), hc: contrastRatio(P.ink, P[tokens.themes[theme].caution]), min: TEXT, pass: contrastRatio(P.ink, P[tokens.themes[theme].caution]) >= TEXT });
}

// Each swatch's own figures, for the exhibit.
const swatches = Object.entries(hc).map(([name, s]) => {
  const scheme = /lifted|paper/.test(name) ? "dark" : "light";
  const grounds = scheme === "light" ? G.light : G.dark;
  return {
    name, scheme, from: s.from, fromHex: P[s.from] ?? null, hex: s.hex, why: s.why,
    on: Object.fromEntries(Object.entries(grounds).map(([k, g]) => [k, contrastRatio(s.hex, g)])),
    fromOn: P[s.from] ? Object.fromEntries(Object.entries(grounds).map(([k, g]) => [k, contrastRatio(P[s.from], g)])) : null,
    oklch: (() => { const o = toOklch(s.hex); return { L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +((o.h * 180) / Math.PI + 360).toFixed(1) % 360 }; })(),
    fromOklch: P[s.from] ? (() => { const o = toOklch(P[s.from]); return { L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +((o.h * 180) / Math.PI + 360).toFixed(1) % 360 }; })() : null,
  };
});

const fails = rows.filter((r) => !r.pass);
const out = { date: "2026-11-15", targets: { text: TEXT, nonText: NON_TEXT }, swatches, roles, rows, fails: fails.length, total: rows.length };
writeFileSync(path.join(import.meta.dir, "palette.json"), JSON.stringify(out, null, 2));

console.log("SWATCHES");
for (const s of swatches) console.log(`${s.scheme.padEnd(5)} ${s.name.padEnd(24)} ${String(s.fromHex ?? "").padEnd(9)} -> ${s.hex}  ${JSON.stringify(s.on)}  from ${JSON.stringify(s.fromOn)}`);
console.log(`\nROWS ${rows.length}, failing ${fails.length}`);
for (const r of fails) console.log("FAIL", r);
const byKind: Record<string, { n: number; min: number; low: string }> = {};
for (const r of rows) {
  const k = `${r.set} ${r.kind}`;
  if (!byKind[k] || r.hc < byKind[k].min) byKind[k] = { n: (byKind[k]?.n ?? 0), min: r.hc, low: r.label };
  byKind[k].n++;
}
console.log(byKind);

// Chart series distinctness, standard and high contrast (reported, not gated).
const { deltaEUnder } = await import(path.join(root, "tests/helpers/colour.ts"));
const { deltaE } = await import(path.join(root, "scripts/contrast.ts"));
for (const theme of ["light", "dark"] as const) for (const hcOn of [false, true]) {
  const cs = [1, 2, 3, 4, 5].map((i) => roleHex(theme, `chart-${i}`, hcOn));
  let low = { d: 1e9, v: "", p: "" };
  for (const v of ["typical", "deuteranopia", "protanopia"]) for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
    const d = v === "typical" ? deltaE(cs[i], cs[j]) : deltaEUnder(cs[i], cs[j], v);
    if (d < low.d) low = { d, v, p: `chart-${i + 1}/chart-${j + 1}` };
  }
  console.log("charts", theme, hcOn ? "HC" : "std", cs.join(" "), "closest", low.p, low.v, low.d.toFixed(1));
}
for (const r of rows.filter((r) => r.kind === "scrim")) console.log("scrim", r.set, r.label, "std", r.std, "hc", r.hc);
