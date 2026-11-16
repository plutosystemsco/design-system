// 031: writes the swatch exhibit for the owner, from palette.json.
// Run: bun exhibit.ts <out dir>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const d = JSON.parse(readFileSync(path.join(import.meta.dir, "palette.json"), "utf8"));
const P = JSON.parse(readFileSync("/Users/claygendron/Git/Repos/design-system/tokens/pluto.tokens.json", "utf8")).primitives;
const S = Object.fromEntries(d.swatches.map((s: any) => [s.name, s]));
const hx = (n: string) => (S[n]?.hex ?? P[n]);

const GROUND = {
  light: [["paper", P.paper, "background"], ["raised", P.raised, "card"], ["wash", P.wash, "muted"]],
  dark: [["graphite", P.graphite, "background"], ["ink-raised", P["ink-raised"], "card"], ["ink-wash", P["ink-wash"], "muted"]],
};
const CODEGROUND = {
  light: [["raised", P.raised, "code ground"], ["paper", P.paper, "active line"]],
  dark: [["ink-wash", P["ink-wash"], "code ground"], ["ink-raised", P["ink-raised"], "active line"], ["graphite", P.graphite, "page"]],
};
// contrast as scripts/contrast.ts computes it, for display only
const lin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h: string) => { const n = parseInt(h.slice(1, 7), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const cr = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.floor(((x + 0.05) / (y + 0.05)) * 100 + 1e-9) / 100; };

const brand = {
  light: ["ink-soft-more", "blue-more", "red-more", "green-more", "yellow-more", "line-more", "red-tint-more", "green-tint-more"],
  dark: ["paper-soft-more", "blue-lifted-more", "red-lifted-more", "green-lifted-more", "paper-line-more", "red-tint-lifted-more", "green-tint-lifted-more"],
};
const code = {
  light: d.swatches.filter((s: any) => s.name.startsWith("code-") && s.scheme === "light").map((s: any) => s.name),
  dark: d.swatches.filter((s: any) => s.name.startsWith("code-") && s.scheme === "dark").map((s: any) => s.name),
};
const isTint = (n: string) => n.includes("tint");
const textOf: Record<string, string> = { "red-tint-more": "red-more", "green-tint-more": "green-more", "red-tint-lifted-more": "red-lifted-more", "green-tint-lifted-more": "green-lifted-more" };
const min = (n: string) => (/line/.test(n) ? 4.5 : 7);

function row(n: string, scheme: "light" | "dark", grounds: any[]) {
  const s = S[n];
  const from = s.fromHex;
  const cells = grounds.map(([g, gh]: any) => {
    if (isTint(n)) return `<td class="num">—</td>`;
    const r = cr(s.hex, gh), r0 = from ? cr(from, gh) : null;
    return `<td class="num ${r >= min(n) ? "" : "low"}">${r0 !== null ? `<s>${r0.toFixed(2)}</s> ` : ""}<b>${r.toFixed(2)}</b></td>`;
  }).join("");
  const tintCell = isTint(n) ? `<span class="note">${textOf[n]} on it: <b>${cr(hx(textOf[n]), s.hex).toFixed(2)}</b></span>` : "";
  return `<tr>
    <td><div class="pair">${from ? `<span class="chip" style="background:${from}"></span>` : ""}<span class="arrow">${from ? "→" : ""}</span><span class="chip big" style="background:${s.hex}"></span></div></td>
    <td><code>${n}</code><div class="sub">${from ? `from <code>${s.from}</code> ${from}` : s.from}</div></td>
    <td><code class="hex">${s.hex}</code><div class="sub">L ${s.oklch.L} C ${s.oklch.C} h ${Number(s.oklch.h).toFixed(1)}${s.fromOklch ? ` (was L ${s.fromOklch.L})` : ""}</div></td>
    ${cells}
    <td class="why">${s.why}${tintCell}</td>
  </tr>`;
}
function table(title: string, names: string[], scheme: "light" | "dark", grounds: any[]) {
  return `<h3>${title}</h3><table><thead><tr><th>Swatch</th><th>Name</th><th>Hex</th>${grounds.map(([g, gh, role]: any) => `<th class="num">on ${g}<div class="sub">${role} ${gh}</div></th>`).join("")}<th>Job</th></tr></thead><tbody>${names.map((n) => row(n, scheme, grounds)).join("")}</tbody></table>`;
}

// "In use": the same small screen, standard and high contrast, per scheme.
function sample(scheme: "light" | "dark", hc: boolean) {
  const t = scheme === "light"
    ? { bg: P.paper, card: P.raised, muted: P.wash, fg: P.ink, mf: hc ? hx("ink-soft-more") : P["ink-soft"], pr: hc ? hx("blue-more") : P.blue, prf: P.raised, de: hc ? hx("red-more") : P["red-text"], det: hc ? hx("red-tint-more") : "#F9E9EA", su: hc ? hx("green-more") : P["green-text"], sut: hc ? hx("green-tint-more") : "#E6F1EE", ca: hc ? hx("yellow-more") : P["yellow-text"], inp: hc ? hx("line-more") : P["line-input"], bd: hc ? hx("line-more") : "#0B0F171A", ch: hc ? [P.blue, P.red, P["yellow-text"], P["green-text"], P["ink-soft"]] : [P.blue, P.red, P.yellow, P.green, P["ink-soft"]], kw: hc ? hx("code-violet-more") : P["code-violet"], str: hc ? hx("code-green-more") : P["code-green"], com: hc ? hx("code-grey-more") : P["code-grey"], cg: P.raised }
    : { bg: P.graphite, card: P["ink-raised"], muted: P["ink-wash"], fg: P.paper, mf: hc ? hx("paper-soft-more") : P["paper-soft"], pr: hc ? hx("blue-lifted-more") : P["blue-lifted"], prf: P.ink, de: hc ? hx("red-lifted-more") : P["red-lifted"], det: hc ? hx("red-tint-lifted-more") : "#4E3631", su: hc ? hx("green-lifted-more") : P["green-lifted"], sut: hc ? hx("green-tint-lifted-more") : "#2E4032", ca: P["yellow-lifted"], inp: hc ? hx("paper-line-more") : P["paper-line-input"], bd: hc ? hx("paper-line-more") : "#F3F0E81A", ch: [P["blue-lifted"], P["red-lifted"], P["yellow-lifted"], P["green-lifted"], P["paper-soft"]], kw: P["code-violet-lifted"], str: P["code-green-lifted"], com: hc ? hx("code-grey-lifted-more") : P["code-grey-lifted"], cg: P["ink-wash"] };
  return `<div class="sample" style="background:${t.bg};color:${t.fg}">
    <div class="tag" style="color:${t.mf}">${scheme} · ${hc ? "more contrast" : "standard"}</div>
    <div class="card" style="background:${t.card};border:1px solid ${t.bd}">
      <div class="h">Deploy settings</div>
      <p style="color:${t.mf}">Muted help text explains the field below.</p>
      <div class="input" style="border:1px solid ${t.inp};color:${t.mf}">us-east-1</div>
      <p>Read the <a style="color:${t.pr}">region guide</a> first. <span style="color:${t.ca}">Caution: billing changes.</span></p>
      <div class="row"><span class="btn" style="background:${t.pr};color:${t.prf}">Deploy</span><span class="btn ghost" style="border:1px solid ${t.inp};color:${t.fg}">Cancel</span></div>
      <div class="alert" style="background:${t.det};border:1px solid ${t.de};color:${t.de}">The build failed at step 3.</div>
      <div class="alert" style="background:${t.sut};border:1px solid ${t.su};color:${t.su}">Saved two minutes ago.</div>
      <pre style="background:${t.cg};border:1px solid ${t.bd}"><span style="color:${t.kw}">def</span> deploy(region=<span style="color:${t.str}">"us-east-1"</span>):  <span style="color:${t.com}"># the default</span></pre>
      <div class="bars">${t.ch.map((c: string, i: number) => `<span style="background:${c};height:${[40, 28, 34, 22, 16][i]}px"></span>`).join("")}</div>
    </div>
  </div>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kuiper high contrast: the swatches</title>
<style>
  body { margin: 0; font: 14px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; background: #F3F0E8; color: #0B0F17; }
  main { max-width: 1400px; margin: 0 auto; padding: 32px 24px 48px; }
  h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 19px; margin: 36px 0 6px; } h3 { font-size: 15px; margin: 22px 0 8px; }
  p.lede { margin: 0 0 8px; max-width: 72ch; }
  table { width: 100%; border-collapse: collapse; background: #FFFFFF; border: 1px solid #0B0F171A; }
  th, td { text-align: left; padding: 7px 9px; border-bottom: 1px solid #0B0F1714; vertical-align: middle; }
  th { font-weight: 600; font-size: 12px; background: #E9E5DB; }
  .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .num s { color: #6D6659; } .low { background: #F5E6E9; }
  .sub { font-size: 11px; color: #444A55; } .why { font-size: 12px; max-width: 30ch; } .note { display: block; margin-top: 2px; }
  code { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; } .hex { font-weight: 600; }
  .pair { display: flex; align-items: center; gap: 4px; } .arrow { color: #6D6659; width: 10px; }
  .chip { width: 22px; height: 22px; border-radius: 4px; display: inline-block; box-shadow: inset 0 0 0 1px #0B0F1726; }
  .chip.big { width: 40px; height: 30px; }
  .samples { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 10px; }
  .sample { padding: 12px; border-radius: 8px; box-shadow: inset 0 0 0 1px #0B0F1726; }
  .sample .tag { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
  .card { border-radius: 8px; padding: 12px; } .card .h { font-weight: 600; font-size: 15px; } .card p { margin: 6px 0; font-size: 13px; }
  .input { border-radius: 6px; padding: 6px 8px; font-size: 13px; margin: 6px 0; }
  .row { display: flex; gap: 6px; margin: 8px 0; } .btn { padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 13px; } .btn.ghost { background: transparent; }
  .alert { border-radius: 6px; padding: 6px 8px; font-size: 13px; margin: 6px 0; }
  pre { font: 12px ui-monospace, Menlo, monospace; padding: 6px 8px; border-radius: 6px; margin: 6px 0; overflow: hidden; white-space: pre; }
  .bars { display: flex; align-items: flex-end; gap: 6px; height: 44px; margin-top: 6px; } .bars span { width: 22px; border-radius: 3px 3px 0 0; }
  .legend { font-size: 12px; color: #444A55; margin-top: 6px; }
</style></head><body><main>
<h1>Kuiper high contrast: the swatches</h1>
<p class="lede">For the owner's approval (spec <code>031</code>, Q1). Each new primitive keeps its source's hue and moves in lightness alone, the least that reaches the target. Text: <b>7:1</b> on every ground it sits on. Non-text (inputs, borders, focus, the glass edge): <b>4.5:1</b>. Grounds, the marks and the brand fills that already pass do not change. Ratios as <code>scripts/contrast.ts</code> computes them: WCAG 2.2, truncated to two decimals. <s>Struck</s> figures are the source colour's.</p>
<p class="legend">Measured 2026-11-15 by <code>palette.ts</code> over <code>tokens/pluto.tokens.json</code> and 029's tints: ${d.total} pairs across both schemes, ${d.fails} below target.</p>

<h2>In use</h2>
<div class="samples">${sample("light", false)}${sample("light", true)}${sample("dark", false)}${sample("dark", true)}</div>

<h2>Light: the brand's hues and neutrals</h2>
${table("Text, fills and edges", brand.light, "light", GROUND.light)}
<h2>Dark: the brand's hues and neutrals</h2>
${table("Text, fills and edges", brand.dark, "dark", GROUND.dark)}
<p class="legend">Dark needs no new yellow: <code>yellow-lifted</code> ${P["yellow-lifted"]} is already ${cr(P["yellow-lifted"], P["ink-wash"]).toFixed(2)} on ink-wash.</p>
<h2>Code: Meridian, at 7:1</h2>
${table("Light code", code.light, "light", CODEGROUND.light)}
${table("Dark code", code.dark, "dark", CODEGROUND.dark)}
<p class="legend">Unchanged because they already pass: light <code>code-navy</code>, <code>code-ink</code>; dark <code>code-violet-lifted</code>, <code>-navy-</code>, <code>-green-</code>, <code>-yellow-</code>, <code>-orange-</code>, <code>-plum-</code>, <code>-ink-</code>. Dark <code>syntax-blue</code> takes <code>blue-lifted-more</code> (one hex, one primitive).</p>
</main></body></html>`;
writeFileSync(path.join(out, "swatches.html"), html);
console.log("wrote", path.join(out, "swatches.html"));
