/**
 * The six downloads: the mark and the lockup, each in three colourways
 * (017 decision 4). Drawn from the token file's `mark` group and the light
 * theme's colours; the lockup's word is outlined from IBM Plex Sans at
 * weight 700, the lockup's own face and weight, with its tracking.
 *
 * Server-only: it reads the font from node_modules. The endpoint under
 * `/brand/downloads/` and the unit test both call `downloadSvg`.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import * as fontkit from "fontkit";
import wawoff2 from "wawoff2";
import { resolveColor, type Tokens } from "../../../../scripts/tokens.ts";

export type Colourway = "colour" | "paper" | "ink";
export type Download = {
  file: string;
  kind: "mark" | "lockup";
  colourway: Colourway;
  /** The grounds it is for, in words. */
  for: string;
};

const FOR: Record<Colourway, string> = {
  colour: "Paper, white and other light grounds.",
  paper: "The blue, red and green fields, and dark grounds.",
  ink: "The yellow field, and one-colour print.",
};

export const DOWNLOADS: Download[] = (["mark", "lockup"] as const).flatMap(
  (kind) =>
    (["colour", "paper", "ink"] as const).map((colourway) => ({
      file: `pluto-${kind}-${colourway}.svg`,
      kind,
      colourway,
      for: FOR[colourway],
    })),
);

/** The units to an em the files draw at. */
const EM = 100;

const FONT =
  "node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2";

type Instance = {
  unitsPerEm: number;
  layout(text: string): {
    glyphs: {
      path: { toSVG(): string; commands: unknown[] };
      advanceWidth: number;
    }[];
    positions: { xAdvance: number; xOffset: number; yOffset: number }[];
  };
};

let instance: Promise<Instance> | undefined;

/** IBM Plex Sans at weight 700: the WOFF2 file decompressed, then its instance. */
function font(): Promise<Instance> {
  instance ??= (async () => {
    const ttf = await wawoff2.decompress(readFileSync(path.resolve(FONT)));
    const variable = fontkit.create(Buffer.from(ttf)) as unknown as {
      getVariation(axes: Record<string, number>): Instance;
    };
    return variable.getVariation({ wght: 700 });
  })();
  return instance;
}

/** Two decimals, with no trailing zeros. */
function n(v: number): string {
  return String(Math.round(v * 100) / 100);
}

/** The word's advance at `px`, its tracking included after each letter, as the browser lays it out. */
export async function wordWidth(tokens: Tokens, px: number): Promise<number> {
  const f = await font();
  const run = f.layout("pluto");
  const scale = px / f.unitsPerEm;
  const tracking = tokens.type.tracking.mark * px;
  return run.positions.reduce((w, p) => w + p.xAdvance * scale + tracking, 0);
}

/** The word as one path, its origin at x 0 and its baseline at y 0, at `EM` units to the em. */
async function wordPath(
  tokens: Tokens,
): Promise<{ d: string; minY: number; maxY: number; minX: number }> {
  const f = await font();
  const run = f.layout("pluto");
  const scale = EM / f.unitsPerEm;
  const tracking = tokens.type.tracking.mark * EM;
  let x = 0;
  let d = "";
  let minY = 0;
  let maxY = 0;
  let minX = Infinity;
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    const ox = x + p.xOffset * scale;
    // fontkit's path is y-up in font units; the file is y-down in em units.
    d += g.path
      .toSVG()
      .replace(/([MLQCZ])([^MLQCZ]*)/g, (_, cmd: string, args: string) => {
        const nums = args.trim()
          ? args
              .trim()
              .split(/[\s,]+/)
              .map(Number)
          : [];
        const out: string[] = [];
        for (let k = 0; k < nums.length; k += 2) {
          const px = ox + nums[k] * scale;
          const py = -(nums[k + 1] + p.yOffset) * scale;
          minX = Math.min(minX, px);
          minY = Math.min(minY, py);
          maxY = Math.max(maxY, py);
          out.push(`${n(px)} ${n(py)}`);
        }
        return cmd + out.join(" ");
      });
    x += p.xAdvance * scale + tracking;
  });
  return { d, minY, maxY, minX };
}

export function dots(
  tokens: Tokens,
  unit: number,
  x0: number,
  y0: number,
  fills: string[],
): string {
  const { dot, gap } = tokens.mark;
  return [0, 1, 2, 3]
    .map((k) => {
      const i = k % 2;
      const j = Math.floor(k / 2);
      const cx = x0 + (dot / 2 + i * (dot + gap)) * unit;
      const cy = y0 + (dot / 2 + j * (dot + gap)) * unit;
      return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n((dot / 2) * unit)}" fill="${fills[k]}"/>`;
    })
    .join("");
}

function svg(viewBox: number[], body: string): string {
  const [x, y, w, h] = viewBox.map(n);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" role="img"><title>Pluto Systems</title>${body}</svg>\n`;
}

/** The lockup, laid out: the word's path, origin at x 0 and baseline at y 0; where the mark sits; the box around both. */
export async function lockupDrawing(tokens: Tokens): Promise<{
  d: string;
  unit: number;
  markX: number;
  markY: number;
  side: number;
  wordWidth: number;
  viewBox: [number, number, number, number];
}> {
  const { dot, gap, rise, lockupGap, lockupScale } = tokens.mark;
  const w = await wordPath(tokens);
  const unit = EM * lockupScale;
  const width = await wordWidth(tokens, EM);
  const markX = width + lockupGap * EM;
  const markY = -(rise + 2 * dot + gap) * unit;
  const side = (2 * dot + gap) * unit;
  const minX = w.minX;
  const minY = Math.min(markY, w.minY);
  const maxX = markX + side;
  const maxY = Math.max(w.maxY, markY + side);
  return {
    d: w.d,
    unit,
    markX,
    markY,
    side,
    wordWidth: width,
    viewBox: [minX, minY, maxX - minX, maxY - minY],
  };
}

/** One download's SVG text, drawn from `tokens`. */
export async function downloadSvg(
  tokens: Tokens,
  file: string,
): Promise<string> {
  const d = DOWNLOADS.find((x) => x.file === file);
  if (!d) throw new Error(`no download named ${file}`);
  const ink = tokens.primitives.ink;
  const paper = tokens.primitives.paper;
  const fills =
    d.colourway === "colour"
      ? ["mark-1", "mark-2", "mark-3", "mark-4"].map((m) =>
          resolveColor(tokens, "light", m),
        )
      : Array(4).fill(d.colourway === "paper" ? paper : ink);
  const word = d.colourway === "paper" ? paper : ink;
  const { dot, gap } = tokens.mark;
  const side = (2 * dot + gap) * EM;

  if (d.kind === "mark")
    return svg([0, 0, side, side], dots(tokens, EM, 0, 0, fills));

  const l = await lockupDrawing(tokens);
  return svg(
    l.viewBox,
    `<path d="${l.d}" fill="${word}"/>` +
      dots(tokens, l.unit, l.markX, l.markY, fills),
  );
}
