// 031, revised: the swatch exhibit for the owner, from palette.json.
// Run: bun exhibit.ts <out dir> < /dev/null
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const d = JSON.parse(readFileSync(path.join(import.meta.dir, "palette.json"), "utf8"));
const T = JSON.parse(readFileSync("/Users/claygendron/Git/Repos/design-system/tokens/kuiper.tokens.json", "utf8"));
const P: Record<string, string> = { ...T.primitives, ...Object.fromEntries(Object.entries(d.tree).map(([k, v]) => [k, (v as string).toUpperCase()])) };
const S = Object.fromEntries(d.swatches.map((s: any) => [s.name, s]));
const hx = (n: string) => S[n]?.hex ?? P[d.alias[n] ?? n] ?? P[n];

const GROUND: Record<string, [string, string, string][]> = {
  light: [["paper", P.paper, "background"], ["raised", P.raised, "card"], ["wash", P.wash, "muted"], ["paper-sunken", P["paper-sunken"], "sunken"]],
  dark: [["graphite", P.graphite, "background"], ["ink-raised", P["ink-raised"], "card"], ["ink-wash", P["ink-wash"], "muted"], ["ink-sunken", P["ink-sunken"], "sunken"]],
};
const CODEGROUND: Record<string, [string, string, string][]> = {
  light: [["raised", P.raised, "code ground"], ["paper", P.paper, "active line"]],
  dark: [["ink-wash", P["ink-wash"], "code ground"], ["ink-raised", P["ink-raised"], "active line"], ["graphite", P.graphite, "page"]],
};
const lin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h: string) => { const n = parseInt(h.slice(1, 7), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const cr = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.floor(((x + 0.05) / (y + 0.05)) * 100 + 1e-9) / 100; };
const isLine = (n: string) => /line/.test(n);
const isTint = (n: string) => !!S[n]?.composite;

function row(s: any, grounds: [string, string, string][]) {
  const min = isLine(s.name) ? 4.5 : 7;
  const cells = grounds.map(([g, gh]) => {
    if (isTint(s.name)) return `<td class="num">—</td>`;
    const r = cr(s.hex, gh), r0 = s.fromHex ? cr(s.fromHex, gh) : null;
    // 031a restricts the status text, the input edge, the status fills and the charts on sunken, in every context.
    const restricted = g === "paper-sunken" && ["red-more", "green-more", "yellow-more"].includes(s.name);
    return `<td class="num ${r >= min || restricted ? "" : "low"}">${r0 !== null ? `<s>${r0.toFixed(2)}</s> ` : ""}<b>${r.toFixed(2)}</b>${restricted ? `<div class="sub">restricted on sunken</div>` : ""}</td>`;
  }).join("");
  const bind = s.binding ? `<div class="sub">binding: ${s.binding.label}, <s>${s.binding.before.toFixed(2)}</s> <b>${s.binding.ratio.toFixed(2)}</b></div>` : "";
  const hue = s.hue ? `<div class="sub">hue moved ${s.hue.rounded}° (tolerance ${s.hue.tolerance}°)</div>` : "";
  return `<tr>
    <td><div class="pair">${s.fromHex ? `<span class="chip" style="background:${s.fromHex}"></span><span class="arrow">→</span>` : `<span class="arrow"></span>`}<span class="chip big" style="background:${s.hex}"></span></div></td>
    <td><code>${s.name}</code><div class="sub">${s.fromHex ? `from <code>${s.from}</code> ${s.fromHex}` : s.from}</div></td>
    <td><code class="hex">${s.hex}</code><div class="sub">L ${s.oklch.L.toFixed(3)} C ${s.oklch.C.toFixed(3)} h ${s.oklch.h.toFixed(1)}${s.fromOklch ? ` (was L ${s.fromOklch.L.toFixed(3)})` : ""}</div>${hue}</td>
    ${cells}
    <td class="why"><b>Takes:</b> ${s.jobs.join(", ")}${bind}</td>
  </tr>`;
}
function table(names: string[], grounds: [string, string, string][]) {
  return `<table><thead><tr><th>Swatch</th><th>Name</th><th>Hex</th>${grounds.map(([g, gh, r]) => `<th class="num">on ${g}<div class="sub">${r} ${gh}</div></th>`).join("")}<th>What takes it</th></tr></thead><tbody>${names.map((n) => row(S[n], grounds)).join("")}</tbody></table>`;
}
const brand = (sc: string) => d.swatches.filter((s: any) => s.scheme === sc && !s.name.startsWith("code-")).map((s: any) => s.name);
const code = (sc: string) => d.swatches.filter((s: any) => s.scheme === sc && s.name.startsWith("code-")).map((s: any) => s.name);

function sample(scheme: "light" | "dark", hc: boolean) {
  const L = scheme === "light";
  const R = (role: string) => {
    if (hc && d.roles[scheme][role]) return hx(d.roles[scheme][role]);
    if (hc && d.chosen[scheme][role]) return hx(d.chosen[scheme][role]);
    const std: Record<string, string> = L
      ? { "muted-foreground": P["ink-soft"], primary: P.blue, destructive: P["red-text"], "destructive-tint": P["red-tint"], success: P["green-text"], "success-tint": P["green-tint"], "caution-text": P["yellow-text"], input: P["line-input"], border: P.line, "syntax-violet": P["code-violet"], "syntax-green": P["code-green"], "syntax-grey": P["code-grey"], "chart-1": P.blue, "chart-2": P.red, "chart-3": P.yellow, "chart-4": P.green, "chart-5": P["ink-soft"], "sunken-line": P["paper-sunken-line"] }
      : { "muted-foreground": P["paper-soft"], primary: P["blue-lifted"], destructive: P["red-lifted"], "destructive-tint": P["red-tint-lifted"], success: P["green-lifted"], "success-tint": P["green-tint-lifted"], "caution-text": P["yellow-lifted"], input: P["paper-line-input"], border: P["paper-line"], "syntax-violet": P["code-violet-lifted"], "syntax-green": P["code-green-lifted"], "syntax-grey": P["code-grey-lifted"], "chart-1": P["blue-lifted"], "chart-2": P["red-lifted"], "chart-3": P["yellow-lifted"], "chart-4": P["green-lifted"], "chart-5": P["paper-soft"], "sunken-line": P["ink-sunken-line"] };
    return std[role];
  };
  const bg = L ? P.paper : P.graphite, card = L ? P.raised : P["ink-raised"], fg = L ? P.ink : P.paper, prf = L ? P.raised : P.ink, cg = L ? P.raised : P["ink-wash"];
  const dis = L ? { f: P.wash, t: P["ink-half"], e: P["line-input-half"] } : { f: P["ink-wash"], t: P["paper-half"], e: P["paper-line-input-half"] };
  return `<div class="sample" style="background:${bg};color:${fg}">
    <div class="tag" style="color:${R("muted-foreground")}">${scheme} · ${hc ? "more contrast" : "standard"}</div>
    <div class="card" style="background:${card};border:1px solid ${R("border")}">
      <div class="h">Deploy settings</div>
      <p style="color:${R("muted-foreground")}">Muted help text explains the field below.</p>
      <div class="input" style="border:1px solid ${R("input")};color:${R("muted-foreground")}">us-east-1</div>
      <p>Read the <a style="color:${R("primary")}">region guide</a> first. <span style="color:${R("caution-text")}">Caution: billing changes.</span></p>
      <div class="row"><span class="btn" style="background:${R("primary")};color:${prf}">Deploy</span><span class="btn ghost" style="border:1px solid ${R("input")};color:${fg}">Cancel</span><span class="btn" style="background:${dis.f};color:${dis.t};border:1px solid ${dis.e}">Disabled</span></div>
      <div class="alert" style="background:${R("destructive-tint")};border:1px solid ${R("destructive")};color:${R("destructive")}">The build failed at step 3.</div>
      <div class="alert" style="background:${R("success-tint")};border:1px solid ${R("success")};color:${R("success")}">Saved two minutes ago.</div>
      <pre style="background:${cg};border:1px solid ${R("border")}"><span style="color:${R("syntax-violet")}">def</span> deploy(region=<span style="color:${R("syntax-green")}">"us-east-1"</span>):  <span style="color:${R("syntax-grey")}"># the default</span></pre>
      <div class="well" style="background:${L ? P["paper-sunken"] : P["ink-sunken"]}"><div style="color:${R("muted-foreground")}">In a well: muted text, and a <a style="color:${R("primary")}">link</a>.</div><div style="border-top:1px solid ${R("sunken-line")};margin-top:6px;padding-top:6px;color:${fg}">A divider on the well</div></div>
      <div class="bars">${[1, 2, 3, 4, 5].map((i) => `<span style="background:${R(`chart-${i}`)};height:${[40, 28, 34, 22, 16][i - 1]}px"></span>`).join("")}</div>
    </div>
  </div>`;
}
const ch = (sc: string, c: string, v: string) => d.charts.find((x: any) => x.scheme === sc && x.contrast === c && x.vision === v);
const BEFORE: Record<string, string> = { "ink-soft-more": "#444A55", "blue-more": "#2236C3", "line-more": "#6D6659" };
const CH = d.swatches.filter((x: any) => BEFORE[x.name] && BEFORE[x.name] !== x.hex).map((x: any) => ({ ...x, old: BEFORE[x.name] }));
const chartRows = ["light", "dark"].flatMap((sc) => ["typical", "deuteranopia", "protanopia"].map((v) => `<tr><td>${sc}</td><td>${v}</td><td class="num">${ch(sc, "standard", v).deltaE} <span class="sub">${ch(sc, "standard", v).closest}</span></td><td class="num ${ch(sc, "more", v).deltaE < ch(sc, "standard", v).deltaE ? "low" : ""}">${ch(sc, "more", v).deltaE} <span class="sub">${ch(sc, "more", v).closest}</span></td></tr>`)).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kuiper high contrast: the swatches</title>
<style>
  body { margin: 0; font: 14px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; background: #F3F0E8; color: #0B0F17; }
  main { max-width: 1400px; margin: 0 auto; padding: 32px 24px 48px; }
  h1 { font-size: 26px; margin: 0 0 4px; } h2 { font-size: 19px; margin: 34px 0 8px; }
  p.lede { margin: 0 0 8px; max-width: 80ch; }
  .notice { background: #FFFFFF; border: 1px solid #6D6659; border-radius: 8px; padding: 12px 16px; max-width: 90ch; margin: 12px 0; }
  .notice li { margin: 4px 0; }
  table { width: 100%; border-collapse: collapse; background: #FFFFFF; border: 1px solid #DCDAD3; }
  th, td { text-align: left; padding: 7px 9px; border-bottom: 1px solid #E9E5DB; vertical-align: middle; }
  th { font-weight: 600; font-size: 12px; background: #E9E5DB; }
  .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .num s, .sub s { color: #6D6659; } .low { background: #F5E6E9; }
  .sub { font-size: 11px; color: #444A55; } .why { font-size: 12px; max-width: 34ch; }
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
  .well { border-radius: 6px; padding: 8px; margin: 6px 0; font-size: 13px; }
  .legend { font-size: 12px; color: #444A55; margin-top: 6px; max-width: 110ch; }
  table.small { width: auto; } table.small td, table.small th { padding: 5px 12px; }
</style></head><body><main>
<h1>Kuiper high contrast: the swatches</h1>
<p class="lede">For the owner's approval (spec <code>031</code>, Q1), re-derived on the tree <code>031a</code>, <code>029</code> and <code>031b</code> leave, with <code>sunken</code> a public ground. Each new primitive keeps its source's hue and moves in lightness alone, the least that reaches the target on every ground and line the contrast rules put it on. Text: <b>7:1</b>. Non-text (inputs, every border and divider, focus, the glass edge, an overlay's edge under the scrim): <b>4.5:1</b>. Grounds, the marks, the disabled roles and every colour that already passes do not change. Ratios as <code>scripts/contrast.ts</code> computes them (WCAG 2.2, truncated to two decimals). <s>Struck</s> figures are the source colour's.</p>
<div class="notice"><b>What changed since the last exhibit</b>
<ul>
<li><b><code>sunken</code> is now a public ground</b> (<code>031a</code>), so every pair allowed on it is measured under high contrast too. Three swatches darken to reach their targets on it: ${CH.map((c: any) => `<code>${c.name}</code> <code>${c.old}</code> → <code>${c.hex}</code> (${c.binding.label}, ${c.binding.ratio.toFixed(2)})`).join("; ")}. Each also reads higher on every other ground.</li>
<li><b>What <code>031a</code> restricts on <code>sunken</code> stays restricted under high contrast,</b> in every context: the status text (<code>destructive</code>, <code>success</code>, <code>caution-text</code>), the <code>input</code> edge, the status fills and the five chart colours. No row is made for them. So on a well, the rows are only <code>foreground</code>, <code>muted-foreground</code> and <code>primary</code> text, the <code>ring</code>, and the lines.</li>
</ul>
<b>What you will notice</b>
<ul>
<li><b>Light yellow text turns olive-brown, as before.</b> <code>caution-text</code> becomes <code>yellow-more</code> <code>${hx("yellow-more")}</code>, and the third chart series the existing <code>yellow-text</code> <code>${P["yellow-text"]}</code>. Their hue is the brand's yellow, within 0.4°, but at this darkness a yellow hue no longer reads as yellow. The brand's yellow fills (caution, field-3, the third dot) do not change.</li>
<li><b>Light charts get closer together for one reader.</b> Under deuteranopia the closest pair of the five series falls from <b>${ch("light", "standard", "deuteranopia").deltaE}</b> to <b>${ch("light", "more", "deuteranopia").deltaE}</b> ΔE (${ch("light", "more", "deuteranopia").closest}), unchanged by <code>sunken</code>: charts are restricted there. Series are labelled directly, so no meaning rests on colour alone, and the figure is a floor.</li>
<li><b>The light primary blue is darker:</b> <code>${hx("blue-more")}</code>, the link, the primary button and the focus ring.</li>
<li><b>Every line becomes a 4.5:1 line,</b> on the well too.</li>
<li><b>The dark set barely changes.</b></li>
</ul></div>
<p class="legend">Measured ${d.date} by <code>palette.ts</code>, which reads every ground and line from the token file's contrast rows, <code>029</code>'s tints and <code>031b</code>'s draft roles (solid hairline <code>${d.tree.line}</code> / <code>${d.tree["paper-line"]}</code>, provisional; disabled roles), and <code>031</code>'s proposed <code>more</code> section: <b>${d.total} pairs, ${d.fails} below target</b>; every role is in a row or exempt with its reason. When <code>031b</code> lands, this re-runs from the token file; no swatch depends on the hairline's standard value.</p>

<h2>In use</h2>
<div class="samples">${sample("light", false)}${sample("light", true)}${sample("dark", false)}${sample("dark", true)}</div>
<p class="legend">The disabled button uses <code>031b</code>'s draft disabled roles, which high contrast keeps as they are: a disabled control is exempt from WCAG's contrast rules, and <code>031b</code>'s own check (its own targets, outside the contrast file) runs under high contrast too. Its values are provisional until <code>031b</code> lands.</p>

<h2>Light: the brand's hues and neutrals</h2>
${table(brand("light"), GROUND.light)}
<h2>Dark: the brand's hues and neutrals</h2>
${table(brand("dark"), GROUND.dark)}
<p class="legend">Dark needs no new yellow: <code>yellow-lifted</code> ${P["yellow-lifted"]} is already ${cr(P["yellow-lifted"], P["ink-wash"]).toFixed(2)} on ink-wash. Dark <code>syntax-blue</code> takes <code>blue-lifted-more</code> (one hex, one primitive).</p>
<h2>Code: Meridian, at 7:1</h2>
${table(code("light"), CODEGROUND.light)}
${table(code("dark"), CODEGROUND.dark)}
<p class="legend">Unchanged because they already pass: light <code>code-navy</code>, <code>code-ink</code>; dark violet, navy, green, yellow, orange, plum and ink.</p>
<h2>Chart distinctness</h2>
<table class="small"><thead><tr><th>Scheme</th><th>Vision</th><th class="num">Standard: closest pair, ΔE</th><th class="num">More contrast</th></tr></thead><tbody>${chartRows}</tbody></table>
</main></body></html>`;
writeFileSync(path.join(out, "swatches.html"), html);
console.log("wrote", path.join(out, "swatches.html"));
