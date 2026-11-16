import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
const pal = JSON.parse(readFileSync("palette.json", "utf8"));
const P = JSON.parse(readFileSync("/Users/claygendron/Git/Repos/design-system/tokens/pluto.tokens.json", "utf8")).primitives;
const hex = (n: string) => (pal.swatches.find((s: any) => s.name === n)?.hex ?? P[n] ?? n).toLowerCase();
const L = pal.roles.light, D = pal.roles.dark;
const names = [...new Set([...Object.keys(L), ...Object.keys(D)])];
const std = JSON.parse(readFileSync("/Users/claygendron/Git/Repos/design-system/tokens/pluto.tokens.json", "utf8")).themes;
const stdTint: any = { light: { "destructive-tint": "#f9e9ea", "success-tint": "#e6f1ee" }, dark: { "destructive-tint": "#4e3631", "success-tint": "#2e4032" } };
const val = (t: "light" | "dark", n: string, hc: boolean) => {
  const m = t === "light" ? L : D;
  if (hc && m[n]) return hex(m[n]);
  return (stdTint[t][n] ?? P[std[t][n]]).toLowerCase();
};
// Only roles whose HC pair differs from the standard pair.
const changed = names.filter((n) => val("light", n, true) !== val("light", n, false) || val("dark", n, true) !== val("dark", n, false));
const extra: [string, string, string][] = [
  ["field-1", hex("blue-more"), hex("blue-lifted-more")],
  ["field-2", hex("red-more"), hex("red-lifted-more")],
  ["field-4", hex("green-more"), hex("green-lifted-more")],
  ["glass-tint", "#fbfaf6", "#221f19"],
  ["glass-edge", hex("line-more"), hex("paper-line-more")],
];
const pair = (a: string, b: string) => (a === b ? a : `light-dark(${a}, ${b})`);
const decls = [
  ...changed.map((n) => `  --${n}: ${pair(val("light", n, true), val("dark", n, true))};`),
  ...extra.map(([n, a, b]) => `  --${n}: ${pair(a, b)};`),
].join("\n");
const modern = `@supports (color: light-dark(#000, #fff)) {
html[data-contrast="more"],
html[data-contrast="more"] .dark {
${decls}
}
@media (prefers-contrast: more) {
html:not([data-contrast="standard"]),
html:not([data-contrast="standard"]) .dark {
${decls}
}
}
}`;
const SURF = ["foreground", "muted-foreground", "card-foreground", "primary", "ring", "primary-foreground", "border", "background"];
const CODE = readFileSync("/Users/claygendron/Git/Repos/design-system/src/app.css", "utf8").match(/^\s*--code-[a-z-]+: var\(--syntax-[a-z-]+\);$/gm)!.slice(0, 16).join("\n");
const set = (t: "light" | "dark") => [
  ...changed.map((n) => `  --${n}: ${val(t, n, true)};`),
  ...extra.map(([n, a, b]) => `  --${n}: ${t === "light" ? a : b};`),
  ...SURF.map((r) => `  --surface-${r}: var(--${r});`),
  CODE,
].join("\n");
const fallback = `@supports not (color: light-dark(#000, #fff)) {
html:root[data-contrast="more"]:is(.dark, [data-scheme="dark"]),
html[data-contrast="more"] :is(.dark, [data-scheme="dark"], .surface-ink) {
${set("dark")}
}
html:root[data-contrast="more"],
html[data-contrast="more"] [data-scheme="light"] {
${set("light")}
}
}`;
const glassRule = `html[data-contrast="more"] .glass { -webkit-backdrop-filter: none; backdrop-filter: none; }
@media (prefers-contrast: more) { html:not([data-contrast="standard"]) .glass { -webkit-backdrop-filter: none; backdrop-filter: none; } }`;
const base = readFileSync("/Users/claygendron/Git/Repos/design-system/src/app.css", "utf8");
const gz = (s: string) => gzipSync(s, { level: 9 }).length;
const b0 = gz(base);
for (const [label, add] of [["modern blocks", modern], ["modern + fallback", modern + "\n" + fallback], ["modern + fallback + glass rule", modern + "\n" + fallback + "\n" + glassRule]] as const) {
  console.log(label, "raw", add.length, "B; alone gz", gz(add), "B; marginal gz over app.css", gz(base + "\n" + add) - b0, "B");
}
console.log("changed roles", changed.length, changed.join(", "));
console.log("declarations per block", changed.length + extra.length);
require("node:fs").writeFileSync("hc-block.css", modern + "\n" + fallback + "\n" + glassRule);
