/**
 * WCAG 2.2 contrast arithmetic (001 decision 12). Pure: no file access.
 *
 * Each sRGB channel is linearised; L = 0.2126 R + 0.7152 G + 0.0722 B; the
 * ratio is (L1 + 0.05) / (L2 + 0.05), truncated to two decimals, never
 * rounded up. A colour with alpha is composited over its ground in sRGB, each
 * channel rounded to the nearest integer, halves up.
 */
import type { Theme, Tokens } from "./tokens.ts";
import { FIELDS, resolveColor, resolveExpressive } from "./tokens.ts";

export type Rgba = { r: number; g: number; b: number; a: number };

export function parseHex(hex: string): Rgba {
  const match = /^#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/.exec(hex);
  if (!match) throw new Error(`not a #RRGGBB or #RRGGBBAA colour: ${hex}`);
  const n = parseInt(match[1], 16);
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
    a: match[2] === undefined ? 255 : parseInt(match[2], 16),
  };
}

export function toHex({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function linear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Truncates to two decimals. The epsilon keeps an exact value such as 4.5 from reading 4.49. */
export function truncate2(value: number): number {
  return Math.floor(value * 100 + 1e-9) / 100;
}

/** The contrast ratio of two opaque colours, truncated to two decimals. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return truncate2((hi + 0.05) / (lo + 0.05));
}

/** Composites an eight-digit colour over an opaque ground at its own alpha byte ÷ 255. */
export function compositeAlphaByte(colour: string, ground: string): string {
  const c = parseHex(colour);
  const g = parseHex(ground);
  const a = c.a / 255;
  const mix = (x: number, y: number) => Math.floor(x * a + y * (1 - a) + 0.5);
  return toHex({ r: mix(c.r, g.r), g: mix(c.g, g.g), b: mix(c.b, g.b) });
}

/**
 * Composites a colour over an opaque ground at a decimal alpha that is a whole
 * number of tenths (0.1, 0.2, …), in integers so that halves are exact:
 * k = alpha × 10, channel = floor((c × k + g × (10 − k)) / 10 + 0.5).
 */
export function compositeTenths(
  colour: string,
  ground: string,
  alpha: number,
): string {
  const k = Math.round(alpha * 10);
  if (Math.abs(alpha * 10 - k) > 1e-9 || k < 0 || k > 10) {
    throw new Error(`alpha must be a whole number of tenths: ${alpha}`);
  }
  const c = parseHex(colour);
  const g = parseHex(ground);
  // floor(x / 10 + 0.5) === floor((2x + 10) / 20), computed in integers.
  const mix = (x: number, y: number) =>
    Math.floor((2 * (x * k + y * (10 - k)) + 10) / 20);
  return toHex({ r: mix(c.r, g.r), g: mix(c.g, g.g), b: mix(c.b, g.b) });
}

/** The opaque hex of a semantic token in a theme, composited over `ground` if it has alpha. */
function opaque(
  tokens: Tokens,
  theme: Theme,
  name: string,
  ground?: string,
): string {
  const hex = resolveColor(tokens, theme, name);
  if (parseHex(hex).a === 255) return hex.toUpperCase();
  const under = ground ?? opaque(tokens, theme, "background");
  return compositeAlphaByte(hex, under);
}

export type ContrastRow = {
  theme: Theme;
  n: number;
  kind: "text" | "non-text";
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  minimum: number;
  result: "pass" | "exception" | "fail";
};

/** Every pair of the token file's contrast list in one theme: text, then tints, then non-text. */
export function contrastTable(tokens: Tokens, theme: Theme): ContrastRow[] {
  const { text, tints, nonText, exceptions } = tokens.contrast;
  const isException = (fg: string, bg: string) =>
    exceptions.some(
      (e) => e.theme === theme && e.pair[0] === fg && e.pair[1] === bg,
    );

  type Pending = Omit<ContrastRow, "n" | "ratio" | "result" | "theme"> & {
    names: [string, string];
  };
  const pending: Pending[] = [];

  for (const [fgName, bgName] of text) {
    const bg = opaque(tokens, theme, bgName);
    pending.push({
      kind: "text",
      label: `${fgName} on ${bgName}`,
      fg: opaque(tokens, theme, fgName, bg),
      bg,
      minimum: 4.5,
      names: [fgName, bgName],
    });
  }
  for (const tint of tints) {
    const alpha = tint.alpha[theme];
    const over = opaque(tokens, theme, tint.over);
    const bg = compositeTenths(
      opaque(tokens, theme, tint.tint, over),
      over,
      alpha,
    );
    pending.push({
      kind: "text",
      label: `${tint.text} on ${tint.tint}/${Math.round(alpha * 100)} over ${tint.over}`,
      fg: opaque(tokens, theme, tint.text, bg),
      bg,
      minimum: 4.5,
      names: [tint.text, `${tint.tint}/${tint.over}`],
    });
  }
  for (const [fgName, bgName] of nonText) {
    const bg = opaque(tokens, theme, bgName);
    pending.push({
      kind: "non-text",
      label: `${fgName} on ${bgName}`,
      fg: opaque(tokens, theme, fgName, bg),
      bg,
      minimum: 3,
      names: [fgName, bgName],
    });
  }

  return pending.map(({ names, ...row }, i) => {
    const ratio = contrastRatio(row.fg, row.bg);
    const result: ContrastRow["result"] =
      ratio >= row.minimum
        ? "pass"
        : isException(names[0], names[1])
          ? "exception"
          : "fail";
    return { theme, n: i + 1, ...row, ratio, result };
  });
}

export type ForbiddenRow = {
  theme: Theme;
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  /** The token file's ratio for a measured row; none for a rule-only pair. */
  stated?: number;
  /** 011 decision 11: forbidden by rule, whatever it measures. */
  ruleOnly: boolean;
};

/**
 * The forbidden state tints on `muted`, recomputed: the measured rows first,
 * each of which must still fail, then the rule-only pairs.
 */
export function forbiddenRows(tokens: Tokens): ForbiddenRow[] {
  const { measured, ruleOnly } = tokens.contrast.forbidden;
  return [
    ...measured.map((f) => ({ f, stated: f.ratio as number | undefined })),
    ...ruleOnly.map((f) => ({ f, stated: undefined })),
  ].map(({ f, stated }) => {
    const over = opaque(tokens, f.theme, f.over);
    const bg = compositeTenths(
      opaque(tokens, f.theme, f.tint, over),
      over,
      f.alpha,
    );
    const fg = opaque(tokens, f.theme, f.text, bg);
    return {
      theme: f.theme,
      label: `${f.text} on ${f.tint}/${Math.round(f.alpha * 100)} over ${f.over}`,
      fg,
      bg,
      ratio: contrastRatio(fg, bg),
      ...(stated === undefined ? {} : { stated }),
      ruleOnly: stated === undefined,
    };
  });
}

export type ScrimContrastRow = {
  theme: Theme;
  edge: string;
  edgeHex: string;
  over: string;
  scrimmed: string;
  ratio: number;
  min: number;
};

/**
 * 002 decision 7: each elevated surface's edge against a ground with the
 * scrim composited over it, by the eight-digit rule (alpha byte ÷ 255).
 */
export function scrimRows(tokens: Tokens): ScrimContrastRow[] {
  return tokens.contrast.scrim.map((row) => {
    const over = opaque(tokens, row.theme, row.over);
    const scrimmed = compositeAlphaByte(
      resolveColor(tokens, row.theme, row.scrim),
      over,
    );
    const edgeHex = opaque(tokens, row.theme, row.edge, scrimmed);
    return {
      theme: row.theme,
      edge: row.edge,
      edgeHex,
      over: row.over,
      scrimmed,
      ratio: contrastRatio(edgeHex, scrimmed),
      min: row.min,
    };
  });
}

/** Numbers rows and marks each against its own minimum. */
function measured(
  rows: Omit<ContrastRow, "n" | "ratio" | "result">[],
): ContrastRow[] {
  return rows.map((row, i) => {
    const ratio = contrastRatio(row.fg, row.bg);
    return {
      n: i + 1,
      ...row,
      ratio,
      result: ratio >= row.minimum ? ("pass" as const) : ("fail" as const),
    };
  });
}

/** 011 decision 6: a field's fill and legend hexes in a theme. */
function fieldHexes(
  tokens: Tokens,
  theme: Theme,
  field: string,
): { fill: string; legend: string } {
  const [fill, legend] =
    tokens.expressive.field[theme][field as (typeof FIELDS)[number]];
  return {
    fill: tokens.primitives[fill].toUpperCase(),
    legend: tokens.primitives[legend].toUpperCase(),
  };
}

/**
 * 011 decision 11: each field's legend on its fill, as text (4.5) and as the
 * focus ring drawn on the field (3). The text row also measures a primary
 * fill on the field, which inverts the pair (the legend as fill, the field's
 * colour as text): the ratio is symmetric.
 */
export function fieldRows(tokens: Tokens): ContrastRow[] {
  return measured(
    tokens.contrast.field.flatMap(({ theme, field }) => {
      const { fill, legend } = fieldHexes(tokens, theme, field);
      return [
        {
          theme,
          kind: "text" as const,
          label: `${field}-foreground on ${field}`,
          fg: legend,
          bg: fill,
          minimum: 4.5,
        },
        {
          theme,
          kind: "non-text" as const,
          label: `${field}-foreground ring on ${field}`,
          fg: legend,
          bg: fill,
          minimum: 3,
        },
      ];
    }),
  );
}

/** The opaque ground a glass row names: the canvas, a field's fill, or the foreground. */
function glassGround(tokens: Tokens, theme: Theme, over: string): string {
  return (FIELDS as readonly string[]).includes(over)
    ? fieldHexes(tokens, theme, over).fill
    : resolveColor(tokens, theme, over).toUpperCase();
}

/** The glass's tint composited over a ground, by the eight-digit rule. */
function glassOver(tokens: Tokens, theme: Theme, over: string): string {
  return compositeAlphaByte(
    resolveExpressive(tokens, tokens.expressive.glass[theme].tint),
    glassGround(tokens, theme, over),
  );
}

/**
 * 011 decision 11: text in the theme's own roles (the `--surface-*` copies
 * that `glass` restores) on the glass's tint over each ground it may lie on.
 */
export function glassRows(tokens: Tokens): ContrastRow[] {
  return measured(
    tokens.contrast.glass.map(({ theme, text, over }) => ({
      theme,
      kind: "text" as const,
      label: `${text} on glass over ${over}`,
      fg: resolveColor(tokens, theme, text).toUpperCase(),
      bg: glassOver(tokens, theme, over),
      minimum: 4.5,
    })),
  );
}

/**
 * 012 decision 4: the sticky bar's text, `foreground` and `primary`, on its
 * glass passing over the hero's glass, which lies on the canvas or a field:
 * the theme's tint composited over the ground, then again over that.
 */
export function glassOverGlassRows(tokens: Tokens): ContrastRow[] {
  return measured(
    tokens.contrast.glassOverGlass.map(({ theme, text, over }) => {
      const tint = resolveExpressive(
        tokens,
        tokens.expressive.glass[theme].tint,
      );
      return {
        theme,
        kind: "text" as const,
        label: `${text} on glass over glass over ${over}`,
        fg: resolveColor(tokens, theme, text).toUpperCase(),
        bg: compositeAlphaByte(tint, glassOver(tokens, theme, over)),
        minimum: 4.5,
      };
    }),
  );
}

/** 011 decision 11: the three glass roles on the opaque fallback, in each theme. */
export function glassFallbackRows(tokens: Tokens): ContrastRow[] {
  return measured(
    (["light", "dark"] as const).flatMap((theme) =>
      ["foreground", "muted-foreground", "primary"].map((text) => ({
        theme,
        kind: "text" as const,
        label: `${text} on glass-fallback`,
        fg: resolveColor(tokens, theme, text).toUpperCase(),
        bg: resolveExpressive(
          tokens,
          tokens.expressive.glass[theme].fallback,
        ).toUpperCase(),
        minimum: 4.5,
      })),
    ),
  );
}

/** 011 decision 11: the theme's ring on the glass over each ground the glass set names. */
export function glassRingRows(tokens: Tokens): ContrastRow[] {
  const grounds = [
    ...new Set(tokens.contrast.glass.map((r) => `${r.theme} ${r.over}`)),
  ].map((key) => key.split(" ") as [Theme, string]);
  return measured(
    grounds.map(([theme, over]) => ({
      theme,
      kind: "non-text" as const,
      label: `ring on glass over ${over}`,
      fg: resolveColor(tokens, theme, "ring").toUpperCase(),
      bg: glassOver(tokens, theme, over),
      minimum: 3,
    })),
  );
}
