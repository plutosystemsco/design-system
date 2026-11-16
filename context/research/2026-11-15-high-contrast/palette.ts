/**
 * 031, revised after its spec review: derive and measure Kuiper's high-contrast
 * primitives. Read-only. Every ground and line comes from the token file's
 * contrast rows, `tree.draft.json` (029's tints, 031b's draft roles) and
 * `more.draft.json` (031's proposed `more` section). No ground is typed here.
 * The design choices typed here are only: which source each swatch starts
 * from, which roles take it, and the candidate list for roles that may reuse
 * an existing primitive.
 *
 * Run: bun palette.ts [repo root] < /dev/null   (writes palette.json beside this file)
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.argv[2] ?? "/Users/claygendron/Git/Repos/design-system";
const here = import.meta.dir;
const { contrastRatio, compositeTenths, compositeAlphaByte, parseHex, deltaE } =
  await import(path.join(root, "scripts/contrast.ts"));
const { readTokens } = await import(path.join(root, "scripts/tokens.ts"));
const { deltaEUnder } = await import(path.join(root, "tests/helpers/colour.ts"));
const tokens = readTokens(path.join(root, "tokens/kuiper.tokens.json"));
const tree = JSON.parse(readFileSync(path.join(here, "tree.draft.json"), "utf8"));
const more = JSON.parse(readFileSync(path.join(here, "more.draft.json"), "utf8"));
type Scheme = "light" | "dark";
const SCHEMES: Scheme[] = ["light", "dark"];

// ---------- the primitives: today's, plus the tree's composites ----------
const P: Record<string, string> = { ...tokens.primitives, ...(tree.primitives ?? {}) };
for (const [name, c] of Object.entries(tree.composites) as [string, any][])
  P[name] = compositeTenths(P[c.of], P[c.over], c.alpha);

// ---------- the standard roles ----------
const STD: Record<Scheme, Record<string, string>> = {
  light: { ...tokens.themes.light, ...tree.roles.light },
  dark: { ...tokens.themes.dark, ...tree.roles.dark },
};

// ---------- OKLCH; the derivation's named rules (spec 031 decision 5) ----------
// 1. Lightness moves from the source's L in steps of exactly 0.001.
// 2. At each L, chroma starts at the source's C and falls in steps of 0.001
//    until every linear channel is within [-1e-6, 1 + 1e-6].
// 3. Channels are gamma-encoded, clamped to [0, 1], and rounded half up (Math.round) to bytes.
// 4. The first L whose hex meets every constraint is the swatch.
// 5. Swatches are derived in the order listed; then the whole list again,
//    until a pass changes nothing (a tint moves with its text).
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
export function toOklch(hex: string) {
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
  const a = C * Math.cos(h), b = C * Math.sin(h);
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
function hexAt(L: number, C: number, h: number) {
  let c = C, rgb = fromOklch(L, c, h);
  while (!inGamut(rgb) && c > 0) { c = Math.max(0, c - 0.001); rgb = fromOklch(L, c, h); }
  const hex = `#${rgb.map((x) => Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, x))))) * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  return { hex, C: c };
}
const deg = (r: number) => ((r * 180) / Math.PI + 360) % 360;
const hueDiff = (a: number, b: number) => { const d = Math.abs(deg(a) - deg(b)) % 360; return d > 180 ? 360 - d : d; };
/** The hue tolerance for an 8-bit hex at chroma C: 1°, or the angle one rounding step subtends. */
// 0.0025: 8-bit rounding moves a colour at most 0.0021 in OKLab a-b (the review's quant.py, 120,871 samples).
const hueTolerance = (C: number) => Math.max(1, (Math.atan(0.0025 / Math.max(C, 1e-9)) * 180) / Math.PI);

// ---------- the swatches: source and direction (design), roles that take them (design) ----------
type Swatch = { name: string; scheme: Scheme; from: string; dir: "darker" | "lighter" };
const SWATCHES: Swatch[] = [
  { name: "ink-soft-more", scheme: "light", from: "ink-soft", dir: "darker" },
  { name: "blue-more", scheme: "light", from: "blue", dir: "darker" },
  { name: "red-more", scheme: "light", from: "red-text", dir: "darker" },
  { name: "green-more", scheme: "light", from: "green-text", dir: "darker" },
  { name: "yellow-more", scheme: "light", from: "yellow-text", dir: "darker" },
  { name: "line-more", scheme: "light", from: "line-input", dir: "darker" },
  { name: "paper-soft-more", scheme: "dark", from: "paper-soft", dir: "lighter" },
  { name: "blue-lifted-more", scheme: "dark", from: "blue-lifted", dir: "lighter" },
  { name: "red-lifted-more", scheme: "dark", from: "red-lifted", dir: "lighter" },
  { name: "green-lifted-more", scheme: "dark", from: "green-lifted", dir: "lighter" },
  { name: "yellow-lifted-more", scheme: "dark", from: "yellow-lifted", dir: "lighter" },
  { name: "paper-line-more", scheme: "dark", from: "paper-line-input", dir: "lighter" },
  ...["violet", "blue", "navy", "green", "yellow", "orange", "plum", "red", "grey", "ink"].flatMap((c) => [
    { name: `code-${c}-more`, scheme: "light" as Scheme, from: `code-${c}`, dir: "darker" as const },
    { name: `code-${c}-lifted-more`, scheme: "dark" as Scheme, from: `code-${c}-lifted`, dir: "lighter" as const },
  ]),
];
const TINTS: Record<string, { of: string; over: string; alpha: number; scheme: Scheme }> = {
  "red-tint-more": { of: "red-more", over: "raised", alpha: 0.1, scheme: "light" },
  "green-tint-more": { of: "green-more", over: "raised", alpha: 0.1, scheme: "light" },
  "red-tint-lifted-more": { of: "red-lifted-more", over: "ink-raised", alpha: 0.1, scheme: "dark" },
  "green-tint-lifted-more": { of: "green-lifted-more", over: "ink-raised", alpha: 0.1, scheme: "dark" },
};
const lineRoles = ["input", "elevation-line", "border", "sidebar-border", "groove-line", "sunken-line", "glass-edge"];
const TAKES: Record<Scheme, Record<string, string>> = {
  light: {
    "muted-foreground": "ink-soft-more",
    primary: "blue-more", ring: "blue-more", "sidebar-primary": "blue-more", "sidebar-ring": "blue-more",
    destructive: "red-more", success: "green-more", "caution-text": "yellow-more",
    ...Object.fromEntries(lineRoles.map((r) => [r, "line-more"])),
    "destructive-tint": "red-tint-more", "success-tint": "green-tint-more",
    ...Object.fromEntries(more.code.roles.map((r: string) => [r, `code-${r.slice(7)}-more`])),
  },
  dark: {
    "muted-foreground": "paper-soft-more",
    primary: "blue-lifted-more", ring: "blue-lifted-more", "sidebar-primary": "blue-lifted-more", "sidebar-ring": "blue-lifted-more",
    destructive: "red-lifted-more", success: "green-lifted-more", "caution-text": "yellow-lifted-more",
    ...Object.fromEntries(lineRoles.map((r) => [r, "paper-line-more"])),
    "destructive-tint": "red-tint-lifted-more", "success-tint": "green-tint-lifted-more",
    ...Object.fromEntries(more.code.roles.map((r: string) => [r, `code-${r.slice(7)}-lifted-more`])),
  },
};
// Roles that may keep or reuse an existing primitive: the first candidate that passes its rows wins.
const CANDIDATES: Record<Scheme, Record<string, string[]>> = {
  light: {
    "chart-1": ["blue", "blue-more"], "chart-2": ["red", "red-text", "red-more"], "chart-3": ["yellow", "yellow-text", "yellow-more"],
    "chart-4": ["green", "green-text", "green-more"], "chart-5": ["ink-soft", "ink-soft-more"],
    "destructive-fill": ["red", "red-text", "red-more"], "success-fill": ["green", "green-text", "green-more"],
    scrim: ["ink-scrim", "ink-scrim-deep"],
  },
  dark: {
    "chart-1": ["blue-lifted", "blue-lifted-more"], "chart-2": ["red-lifted", "red-lifted-more"], "chart-3": ["yellow-lifted", "yellow-lifted-more"],
    "chart-4": ["green-lifted", "green-lifted-more"], "chart-5": ["paper-soft", "paper-soft-more"],
    "destructive-fill": ["red-lifted", "red-lifted-more"], "success-fill": ["green-lifted", "green-lifted-more"],
    scrim: ["ink-scrim-deep"],
  },
};
// A field keeps its fill if its legend passes; else it takes its hue's swatch.
const FIELD_MORE: Record<string, string> = { blue: "blue-more", red: "red-more", yellow: "yellow-more", green: "green-more", "blue-lifted": "blue-lifted-more", "red-lifted": "red-lifted-more", "yellow-lifted": "yellow-lifted-more", "green-lifted": "green-lifted-more" };

// ---------- state ----------
const S: Record<string, string> = Object.fromEntries(SWATCHES.map((s) => [s.name, P[s.from]]));
const unrounded: Record<string, { L: number; C: number; h: number }> = {};
const chosen: Record<Scheme, Record<string, string>> = { light: {}, dark: {} };
const fieldFill: Record<Scheme, Record<string, string>> = { light: {}, dark: {} };
const hexOf = (n: string): string => {
  if (n in TINTS) { const t = TINTS[n]; return compositeTenths(hexOf(t.of), P[t.over], t.alpha); }
  return S[n] ?? P[n];
};
const glassFallback = (s: Scheme) => { const f = tokens.expressive.glass[s].fallback; return P[f] ?? f; };

/** A role's hex at standard or high contrast. Pseudo-roles: glass (solid under HC), field-N and field-N-legend. */
function role(s: Scheme, name: string, hc: boolean): string {
  if (name === "glass") return glassFallback(s);
  const fm = /^(field-\d)(-legend)?$/.exec(name);
  if (fm) {
    const [fill, legend] = tokens.expressive.field[s][fm[1]];
    if (fm[2]) return P[legend];
    return hc ? hexOf(fieldFill[s][fm[1]] ?? fill) : P[fill];
  }
  if (hc && TAKES[s][name]) return hexOf(TAKES[s][name]);
  if (hc && chosen[s][name]) return hexOf(chosen[s][name]);
  if (name === "glass-edge") return P[tokens.expressive.glass[s].edge] ?? tokens.expressive.glass[s].edge;
  const prim = STD[s][name];
  if (prim === undefined) throw new Error(`${s}: no role ${name}`);
  return P[prim];
}

// ---------- the rows, read from the token file and the drafts ----------
type Row = { scheme: Scheme; kind: string; fg: string; bg: string; scrim?: string; min: number; source: string };
function rowsFor(s: Scheme): Row[] {
  const c = tokens.contrast;
  const r: Row[] = [];
  const restricted = (tree.contrast?.restricted ?? []).filter((x: any) => x.themes.includes(s)).map((x: any) => x.pair.join("|"));
  const allowed = ([fg, bg]: string[]) => !restricted.includes(`${fg}|${bg}`);
  for (const [fg, bg] of [...c.text, ...tree.text, ...(tree.contrast?.text ?? [])].filter(allowed)) r.push({ scheme: s, kind: "text", fg, bg, min: more.text, source: "contrast.text" });
  for (const [fg, bg] of [...c.nonText, ...(tree.contrast?.nonText ?? []), ...more.nonTextAdded].filter(allowed)) r.push({ scheme: s, kind: "non-text", fg, bg, min: more.nonText, source: "contrast.nonText" });
  for (const f of c.field.filter((f: any) => f.theme === s)) r.push({ scheme: s, kind: "field", fg: `${f.field}-legend`, bg: f.field, min: more.text, source: "contrast.field" });
  for (const g of [...c.glass, ...c.glassOverGlass].filter((g: any) => g.theme === s)) r.push({ scheme: s, kind: "glass", fg: g.text, bg: "glass", min: more.text, source: "contrast.glass (solid under HC)" });
  for (const g of more.glassEdge) r.push({ scheme: s, kind: "non-text", fg: "glass-edge", bg: g, min: more.nonText, source: "more.glassEdge" });
  for (const sc of c.scrim.filter((x: any) => x.theme === s)) r.push({ scheme: s, kind: "scrim", fg: sc.edge, bg: sc.over, scrim: sc.scrim, min: more.scrim, source: "contrast.scrim" });
  for (const role of more.code.roles) for (const g of more.code.grounds[s]) r.push({ scheme: s, kind: "code", fg: role, bg: g, min: more.text, source: "more.code" });
  for (const f of tree.floors ?? []) r.push({ scheme: s, kind: "floor", fg: f.fg, bg: f.bg, min: f.min, source: f.why });
  // dedupe identical rows (a glass row repeats once glass is solid)
  const seen = new Set<string>();
  return r.filter((x) => { const k = `${x.kind}|${x.fg}|${x.bg}|${x.scrim ?? ""}`; if (seen.has(k)) return false; seen.add(k); return true; });
}
function measure(row: Row, hc: boolean) {
  const s = row.scheme;
  let bg = role(s, row.bg, hc);
  if (parseHex(bg).a !== 255) bg = compositeAlphaByte(bg, role(s, "background", hc));
  if (row.scrim) bg = compositeAlphaByte(role(s, row.scrim, hc), bg);
  let fg = role(s, row.fg, hc);
  if (parseHex(fg).a !== 255) fg = compositeAlphaByte(fg, bg);
  return { fg: fg.toUpperCase(), bg: bg.toUpperCase(), ratio: contrastRatio(fg, bg) };
}
const ROWS = Object.fromEntries(SCHEMES.map((s) => [s, rowsFor(s)])) as Record<Scheme, Row[]>;

// ---------- which rows a swatch is in ----------
const swatchOfRole = (s: Scheme, r: string) => {
  const t = TAKES[s][r];
  return t && TINTS[t] ? [t, TINTS[t].of] : t ? [t] : [];
};
function rowsOf(sw: Swatch) {
  return ROWS[sw.scheme].filter((row) => [row.fg, row.bg].some((r) => swatchOfRole(sw.scheme, r).includes(sw.name)));
}

// ---------- derive ----------
function derive(sw: Swatch): boolean {
  const rows = rowsOf(sw);
  const src = toOklch(P[sw.from]);
  const ok = () => rows.every((r) => measure(r, true).ratio >= r.min);
  for (let step = 0; step <= 1000; step++) {
    const L = sw.dir === "darker" ? src.L - step * 0.001 : src.L + step * 0.001;
    const { hex, C } = step === 0 ? { hex: P[sw.from], C: src.C } : hexAt(L, src.C, src.h);
    const before = S[sw.name];
    S[sw.name] = hex;
    if (ok()) { unrounded[sw.name] = { L, C, h: src.h }; return before !== hex; }
  }
  throw new Error(`${sw.name}: no swatch reaches its rows`);
}
for (let pass = 1; pass <= 20; pass++) {
  let changed = false;
  for (const sw of SWATCHES) changed = derive(sw) || changed;
  if (!changed) break;
}
for (const s of SCHEMES) {
  for (const [r, cands] of Object.entries(CANDIDATES[s])) {
    const rows = ROWS[s].filter((x) => x.fg === r || x.bg === r || x.scrim === r);
    chosen[s][r] = cands.find((c) => { chosen[s][r] = c; return rows.every((x) => measure(x, true).ratio >= x.min); }) ?? cands.at(-1)!;
  }
  for (const [f, [fill, legend]] of Object.entries(tokens.expressive.field[s]) as [string, [string, string]][]) {
    fieldFill[s][f] = contrastRatio(P[legend], P[fill]) >= more.text ? fill : FIELD_MORE[fill];
  }
}

// ---------- results ----------
// A swatch is new only if it differs from its source and from every other primitive's hex.
const allHex = new Map<string, string>(Object.entries(P).map(([n, h]) => [h.toUpperCase(), n]));
const finals: any[] = [];
const alias: Record<string, string> = {};
for (const sw of SWATCHES) {
  const hex = S[sw.name];
  if (hex === P[sw.from]) { alias[sw.name] = sw.from; continue; }
  const dup = finals.find((f) => f.hex === hex) ?? (allHex.has(hex) ? { name: allHex.get(hex) } : null);
  if (dup) { alias[sw.name] = dup.name; continue; }
  finals.push({ ...sw, hex });
}
for (const [name, t] of Object.entries(TINTS)) finals.push({ name, scheme: t.scheme, from: `${t.of} at ${t.alpha * 10}0% over ${t.over}`, composite: t, hex: hexOf(name) });
const realName = (n: string) => alias[n] ?? n;

const jobs: Record<string, string[]> = {};
for (const s of SCHEMES) {
  for (const [r, sw] of Object.entries(TAKES[s])) {
    const n = realName(sw);
    if (role(s, r, false).toUpperCase() !== hexOf(sw).toUpperCase()) (jobs[n] ??= []).push(r);
  }
  for (const [r, c] of Object.entries(chosen[s])) if (finals.some((f) => f.name === c)) (jobs[c] ??= []).push(r);
  for (const [f, fill] of Object.entries(fieldFill[s])) if (finals.some((x) => x.name === fill)) (jobs[fill] ??= []).push(`${f} fill`);
}
const GROUNDS: Record<Scheme, string[]> = {
  light: [...new Set(ROWS.light.filter((r) => r.kind === "text").map((r) => r.bg))],
  dark: [...new Set(ROWS.dark.filter((r) => r.kind === "text").map((r) => r.bg))],
};
const swatches = finals.map((f) => {
  const o = toOklch(f.hex);
  const src = P[f.from] ? toOklch(P[f.from]) : null;
  const rows = ROWS[f.scheme as Scheme].filter((r) => (jobs[f.name] ?? []).some((j) => r.fg === j || r.bg === j || r.fg === j.replace(" fill", "") || r.bg === j.replace(" fill", ""))).map((r) => ({ label: `${r.fg} on ${r.bg}${r.scrim ? " under the scrim" : ""}`, min: r.min, ratio: measure(r, true).ratio, before: measure(r, false).ratio }));
  const binding = rows.length ? rows.reduce((a, b) => (b.ratio - b.min < a.ratio - a.min ? b : a)) : null;
  return {
    name: f.name, scheme: f.scheme, from: f.from, fromHex: P[f.from] ?? null, hex: f.hex, composite: f.composite ?? null,
    jobs: jobs[f.name] ?? [], binding,
    oklch: { L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +deg(o.h).toFixed(1) },
    fromOklch: src ? { L: +src.L.toFixed(3), C: +src.C.toFixed(3), h: +deg(src.h).toFixed(1) } : null,
    hue: src && !f.composite ? { rounded: +hueDiff(o.h, src.h).toFixed(2), unrounded: +hueDiff(unrounded[f.name].h, src.h).toFixed(2), tolerance: +hueTolerance(o.C).toFixed(2) } : null,
  };
});

const all: any[] = [];
for (const s of SCHEMES) for (const r of ROWS[s]) {
  const h = measure(r, true), d = measure(r, false);
  all.push({ scheme: s, kind: r.kind, source: r.source, label: `${r.fg} on ${r.bg}${r.scrim ? ` under ${r.scrim}` : ""}`, fg: h.fg, bg: h.bg, hc: h.ratio, std: d.ratio, min: r.min, pass: h.ratio >= r.min });
}

// Every role is classified: in a row, or exempt with its reason.
const unclassified: Record<Scheme, string[]> = { light: [], dark: [] };
for (const s of SCHEMES) for (const r of Object.keys(STD[s])) {
  const inRow = ROWS[s].some((x) => x.fg === r || x.bg === r || x.scrim === r);
  if (!inRow && !(r in more.exempt) && r !== "radius") unclassified[s].push(r);
}

// The 31b roles and hairline under HC: unchanged, floors held.
// Chart distinctness, both visions, both contrasts.
const charts: any[] = [];
for (const s of SCHEMES) for (const hc of [false, true]) for (const v of ["typical", "deuteranopia", "protanopia"]) {
  const cs = [1, 2, 3, 4, 5].map((i) => role(s, `chart-${i}`, hc));
  let low = { d: 1e9, p: "" };
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
    const d = v === "typical" ? deltaE(cs[i], cs[j]) : deltaEUnder(cs[i], cs[j], v);
    if (d < low.d) low = { d, p: `chart-${i + 1}/chart-${j + 1}` };
  }
  charts.push({ scheme: s, contrast: hc ? "more" : "standard", vision: v, closest: low.p, deltaE: +low.d.toFixed(1), colours: cs });
}

// The variables the block declares: every one whose HC pair differs from its standard pair.
const varNames = new Set<string>();
for (const s of SCHEMES) for (const r of [...Object.keys(TAKES[s]), ...Object.keys(chosen[s])]) {
  if (r === "glass-edge") continue;
  if (role(s, r, true).toUpperCase() !== role(s, r, false).toUpperCase()) varNames.add(r);
}
const fieldsChanged = SCHEMES.flatMap((s) => Object.entries(fieldFill[s]).filter(([f, fill]) => fill !== tokens.expressive.field[s][f][0]).map(([f]) => `${s} ${f}`));

const restrictedReport: any[] = [];
for (const s of SCHEMES) for (const x of (tree.contrast?.restricted ?? []).filter((x: any) => x.themes.includes(s))) {
  const row = { scheme: s, kind: x.kind, fg: x.pair[0], bg: x.pair[1], min: 0, source: "restricted" } as Row;
  const inRows = ROWS[s].some((r) => r.fg === row.fg && r.bg === row.bg);
  restrictedReport.push({ scheme: s, pair: x.pair.join(" on "), std: measure(row, false).ratio, hc: measure(row, true).ratio, rule: x[s], inMoreRows: inRows });
}
const fails = all.filter((r) => !r.pass);
const out = {
  date: "2026-11-15", revised: "after the spec review", reads: ["tokens/kuiper.tokens.json (contrast rows, primitives, roles, fields, glass)", "tree.draft.json (029 tints; 031b draft: solid line, disabled roles)", "more.draft.json (031's proposed `more` section)"],
  rules: "lightness only, steps of 0.001; chroma from the source's down in steps of 0.001 until in gamut (±1e-6, linear); channels rounded half up; first passing step; passes repeat until stable",
  targets: { text: more.text, nonText: more.nonText, scrim: more.scrim },
  swatches, alias, chosen, fieldFill, fieldsChanged, roles: TAKES, variables: [...varNames].sort(), variableCount: varNames.size + fieldsChanged.length + 2,
  unclassified, charts, restricted: restrictedReport, rows: all, total: all.length, fails: fails.length,
  tree: Object.fromEntries([...Object.keys(tree.primitives ?? {}), ...Object.keys(tree.composites)].map((k) => [k, P[k]])),
};
writeFileSync(path.join(here, "palette.json"), JSON.stringify(out, null, 2));

console.log("SWATCHES", swatches.length);
for (const s of swatches) console.log(`${s.scheme.padEnd(5)} ${s.name.padEnd(24)} ${String(s.fromHex ?? "").padEnd(8)} -> ${s.hex}  ${s.binding ? `${s.binding.label} ${s.binding.before} -> ${s.binding.ratio}` : ""}  hue ${JSON.stringify(s.hue)}  jobs ${s.jobs.join(", ")}`);
console.log("alias", alias);
console.log("chosen", chosen, "fields changed", fieldsChanged);
console.log(`ROWS ${all.length}, failing ${fails.length}`);
for (const f of fails) console.log("FAIL", f);
console.log("unclassified", unclassified);
console.log("restricted", restrictedReport);
console.log("variables", varNames.size, [...varNames].sort().join(" "), "+ fields", fieldsChanged, "+ glass-tint, glass-edge");
for (const c of charts) console.log("chart", c.scheme, c.contrast, c.vision, c.closest, c.deltaE);
const kinds: Record<string, any> = {};
for (const r of all) { const k = `${r.scheme} ${r.kind}`; kinds[k] ??= { n: 0, low: 99, label: "", belowStd: 0 }; kinds[k].n++; if (r.std < r.min) kinds[k].belowStd++; if (r.hc < kinds[k].low) { kinds[k].low = r.hc; kinds[k].label = r.label; } }
console.log(kinds);
