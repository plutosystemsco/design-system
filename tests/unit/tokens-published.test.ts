/**
 * 021 tests T9 to T11: the published token files. `kuiper.css` is the
 * tokens as plain custom properties, the theme's values byte for byte; the
 * DTCG source, the two flattened schemes and the record are copied to
 * `static/r/tokens/` and this release's `static/v<version>/r/tokens/`; and
 * every token records the CSS name an app reads.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { generateTokenOutputs } from "../../scripts/build-tokens.ts";

const VERSION = JSON.parse(readFileSync("package.json", "utf8")).version;
const VENDOR = "co.plutosystems.kuiper";
const CURRENT = "static/r/tokens";
const RELEASE = `static/v${VERSION}/r/tokens`;
const PUBLISHED = [
  "kuiper.css",
  "kuiper.dark.tokens.json",
  "kuiper.flat-dark.tokens.json",
  "kuiper.flat-light.tokens.json",
  "kuiper.light.tokens.json",
  "kuiper.removed.json",
  "kuiper.resolver.json",
  "kuiper.tokens.json",
];
const SOURCES = [
  "kuiper.resolver.json",
  "kuiper.tokens.json",
  "kuiper.light.tokens.json",
  "kuiper.dark.tokens.json",
  "kuiper.removed.json",
];

const readOr = (file: string) =>
  existsSync(file) ? readFileSync(file, "utf8") : "";

type Block = { prelude: string; body: string };

/** The top-level blocks of a stylesheet, comments dropped. */
function blocks(css: string): Block[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Block[] = [];
  let depth = 0;
  let start = 0;
  let prelude = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{") {
      if (depth === 0) {
        prelude = text.slice(start, i).trim();
        start = i + 1;
      }
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        out.push({ prelude, body: text.slice(start, i) });
        start = i + 1;
      }
    } else if (c === ";" && depth === 0) {
      start = i + 1;
    }
  }
  return out;
}

/** A block's own declarations, `[property, value]`, nested blocks skipped. */
function declarations(body: string): [string, string][] {
  const out: [string, string][] = [];
  let depth = 0;
  let paren = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === "(") paren++;
    else if (c === ")") paren--;
    else if (c === "{") {
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) start = i + 1;
    } else if (c === ";" && depth === 0 && paren === 0) {
      const decl = body.slice(start, i).trim();
      start = i + 1;
      const colon = decl.indexOf(":");
      if (colon > 0)
        out.push([
          decl.slice(0, colon).trim(),
          decl
            .slice(colon + 1)
            .trim()
            .replace(/\s+/g, " "),
        ]);
    }
  }
  return out;
}

const block = (css: string, prelude: string) =>
  blocks(css).find((b) => b.prelude === prelude);
const decls = (css: string, prelude: string) =>
  declarations(block(css, prelude)?.body ?? "");

const app = readFileSync("src/app.css", "utf8");
const kuiper = readOr(path.join(CURRENT, "kuiper.css"));

describe("021 T9: kuiper.css is the tokens", () => {
  test("it equals a fresh build", async () => {
    const out = (await generateTokenOutputs()) as unknown as {
      published?: Record<string, string>;
    };
    expect(out.published?.["kuiper.css"]).toBeDefined();
    expect(kuiper).toBe(out.published!["kuiper.css"]);
  });

  test("its top level is exactly :root, .dark and one reduced-motion query", () => {
    expect(blocks(kuiper).map((b) => b.prelude)).toEqual([
      ":root",
      ".dark",
      "@media (prefers-reduced-motion: reduce)",
    ]);
    const media = block(kuiper, "@media (prefers-reduced-motion: reduce)")!;
    expect(blocks(media.body).map((b) => b.prelude)).toEqual(["html:root"]);
    expect(declarations(blocks(media.body)[0].body)).toEqual(
      declarations(
        blocks(block(app, "@media (prefers-reduced-motion: reduce)")!.body)[0]
          .body,
      ),
    );
  });

  test("every declaration is a custom property or color-scheme", () => {
    const all = [
      ...decls(kuiper, ":root"),
      ...decls(kuiper, ".dark"),
      ...declarations(
        blocks(
          block(kuiper, "@media (prefers-reduced-motion: reduce)")!.body,
        )[0].body,
      ),
    ];
    expect(all.length).toBeGreaterThan(100);
    for (const [property] of all)
      expect(
        property.startsWith("--") || property === "color-scheme",
        property,
      ).toBe(true);
    expect(decls(kuiper, ":root").at(-1)).toEqual(["color-scheme", "light"]);
    expect(decls(kuiper, ".dark").at(-1)).toEqual(["color-scheme", "dark"]);
  });

  test("its :root and .dark are the theme's, in order, then the token-made @theme values", () => {
    const appRoot = decls(app, ":root");
    const appDark = decls(app, ".dark");
    const appTheme = new Map(decls(app, "@theme inline"));
    const root = decls(kuiper, ":root");
    const dark = decls(kuiper, ".dark");
    // The theme's own :root, less its closing color-scheme, comes first.
    expect(root.slice(0, appRoot.length - 1)).toEqual(appRoot.slice(0, -1));
    expect(dark.slice(0, appDark.length - 1)).toEqual(appDark.slice(0, -1));
    // 021 decision 11: 24 @theme-made values join :root; --radius is
    // already there. .dark repeats --shadow-elevation.
    expect(root).toHaveLength(appRoot.length + 24);
    expect(dark).toHaveLength(appDark.length + 1);
    const added = root.slice(appRoot.length - 1, -1);
    expect(added.map(([p]) => p)).toEqual([
      "--spacing",
      "--text-xs",
      "--text-xs--line-height",
      "--text-sm",
      "--text-sm--line-height",
      "--text-base",
      "--text-base--line-height",
      "--text-2xl",
      "--text-2xl--line-height",
      "--text-5xl",
      "--text-5xl--line-height",
      "--tracking-display",
      "--tracking-section",
      "--tracking-eyebrow",
      "--tracking-mark",
      "--font-weight-normal",
      "--font-weight-medium",
      "--font-weight-bold",
      "--leading-none",
      "--ease-entrance",
      "--shadow-elevation",
      "--font-sans",
      "--font-heading",
      "--font-mono",
    ]);
    for (const [p, v] of added) expect(v, p).toBe(appTheme.get(p)!);
    expect(dark.at(-2)).toEqual([
      "--shadow-elevation",
      appTheme.get("--shadow-elevation")!,
    ]);
  });

  test("every property it shares with src/app.css's :root, .dark or @theme inline has the same value", () => {
    const appValues = new Map<string, Set<string>>();
    for (const prelude of [":root", ".dark", "@theme inline"])
      for (const [p, v] of decls(app, prelude)) {
        if (!appValues.has(p)) appValues.set(p, new Set());
        appValues.get(p)!.add(v);
      }
    let shared = 0;
    for (const prelude of [":root", ".dark"])
      for (const [p, v] of decls(kuiper, prelude)) {
        if (!appValues.has(p)) continue;
        shared++;
        expect(appValues.get(p)!.has(v), `${prelude} ${p}: ${v}`).toBe(true);
      }
    expect(shared).toBeGreaterThan(200);
  });

  test("it holds no Tailwind, no rule but its three blocks, and no Tailwind variable", () => {
    expect(kuiper.length).toBeGreaterThan(0);
    for (const word of [
      "@import",
      "@theme",
      "@utility",
      "@layer",
      "@apply",
      "@keyframes",
      "--color-",
      "--animate-",
      "--radius-xs",
      "--default-transition-duration",
    ])
      expect(kuiper.includes(word), word).toBe(false);
  });

  test("its header says what it is, that it is generated, and that it loads no font", () => {
    const header = /^\/\*[\s\S]*?\*\//.exec(kuiper)?.[0] ?? "";
    expect(header).toContain("Generated");
    expect(header).toContain(VERSION);
    expect(header).toContain("kuiper-theme");
    expect(header).toContain("@fontsource-variable/geist");
    expect(header).toContain("@fontsource-variable/ibm-plex-sans");
    expect(header).toContain("@fontsource-variable/jetbrains-mono");
  });
});

describe("021 T10: the DTCG copies", () => {
  test("both folders hold the 8 files, and are identical", () => {
    for (const dir of [CURRENT, RELEASE]) {
      expect(existsSync(dir), dir).toBe(true);
      expect(readdirSync(dir).sort(), dir).toEqual(PUBLISHED);
    }
    for (const file of PUBLISHED)
      expect(readOr(path.join(RELEASE, file)), file).toBe(
        readOr(path.join(CURRENT, file)),
      );
  });

  test("the source copies equal tokens/ byte for byte", () => {
    for (const file of SOURCES)
      expect(readOr(path.join(CURRENT, file)), file).toBe(
        readFileSync(path.join("tokens", file), "utf8"),
      );
  });

  test("each flattened file equals a fresh flatten, and every alias in it resolves inside it", async () => {
    const out = (await generateTokenOutputs()) as unknown as {
      published?: Record<string, string>;
    };
    for (const scheme of ["light", "dark"]) {
      const file = `kuiper.flat-${scheme}.tokens.json`;
      const text = readOr(path.join(CURRENT, file));
      expect(text, file).toBe(out.published?.[file] ?? "missing");
      const tree = JSON.parse(text);
      expect(tree.$schema).toBe(
        "https://www.designtokens.org/schemas/2025.10/format.json",
      );
      expect(tree.$extensions?.[VENDOR]).toEqual({
        scheme,
        colorScheme: scheme,
      });
      const lookup = (p: string) =>
        p.split(".").reduce((at, k) => at?.[k], tree);
      let aliases = 0;
      const visit = (node: Record<string, unknown>, at: string) => {
        for (const [k, v] of Object.entries(node)) {
          if (k.startsWith("$") || typeof v !== "object" || v === null)
            continue;
          const child = v as Record<string, unknown>;
          if ("$value" in child) {
            const m = /^\{(.+)\}$/.exec(String(child.$value));
            if (typeof child.$value === "string" && m) {
              aliases++;
              const target = lookup(m[1]);
              expect(target?.$value, `${at}${k} → ${m[1]}`).toBeDefined();
              expect(target?.$type, `${at}${k}`).toBe(child.$type);
            }
          } else visit(child, `${at}${k}.`);
        }
      };
      visit(tree, "");
      // 61 roles, 16 code slots, 8 field colours, the expressive mark,
      // the elevation and the display family at least.
      expect(aliases, file).toBeGreaterThanOrEqual(61 + 16 + 8 + 4 + 2 + 1);
      for (const group of ["primitive", "role", "code", "field", "glass"])
        expect(group in tree, `${file}: ${group}`).toBe(true);
    }
  });
});

describe("021 T11: CSS names are recorded", () => {
  /** Every cssVariable in the base file and the schemes' files, token or group. */
  function cssVariables(
    files = [
      "kuiper.tokens.json",
      "kuiper.light.tokens.json",
      "kuiper.dark.tokens.json",
    ],
  ): string[] {
    const out: string[] = [];
    const visit = (node: unknown) => {
      if (typeof node !== "object" || node === null) return;
      const n = node as Record<string, unknown>;
      const own = (n.$extensions as Record<string, Record<string, unknown>>)?.[
        VENDOR
      ]?.cssVariable;
      if (typeof own === "string") out.push(own);
      for (const [k, v] of Object.entries(n)) if (!k.startsWith("$")) visit(v);
    };
    for (const file of files)
      visit(JSON.parse(readFileSync(path.join("tokens", file), "utf8")));
    return out;
  }

  /** 021 decision 4: the custom properties that are formulas of others. */
  const DERIVED = [
    "--mark-lockup-size",
    "--mark-lift",
    "--radius-action",
    "--size-hero-fill",
    "--surface-foreground",
    "--surface-muted-foreground",
    "--surface-card-foreground",
    "--surface-primary",
    "--surface-ring",
    "--surface-primary-foreground",
    "--surface-border",
    "--shadow-elevation",
  ];

  test("every cssVariable is unique in a scheme, the same in both, and declared in kuiper.css", () => {
    const scheme = (s: string) =>
      cssVariables(["kuiper.tokens.json", `kuiper.${s}.tokens.json`]);
    const names = scheme("light");
    expect(names.length).toBeGreaterThan(100);
    expect(new Set(names).size).toBe(names.length);
    expect(scheme("dark")).toEqual(names);
    const declared = new Set(
      [...decls(kuiper, ":root"), ...decls(kuiper, ".dark")].map(([p]) => p),
    );
    for (const name of names) expect(declared.has(name), name).toBe(true);
  });

  test("every custom property in kuiper.css is named by one cssVariable, or is derived", () => {
    const names = new Set(cssVariables());
    const properties = new Set(
      [...decls(kuiper, ":root"), ...decls(kuiper, ".dark")]
        .map(([p]) => p)
        .filter((p) => p.startsWith("--")),
    );
    expect(properties.size).toBeGreaterThan(100);
    for (const p of properties)
      expect(names.has(p) !== DERIVED.includes(p), p).toBe(true);
    for (const p of DERIVED) expect(properties.has(p), p).toBe(true);
  });
});
