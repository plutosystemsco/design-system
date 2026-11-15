/**
 * Colour helpers the tests need beyond `scripts/contrast.ts` (013 decision
 * 18): OKLCH both ways, and full-severity colour-vision deficiency. ΔE, `mix`
 * and the WCAG ratio live in `scripts/contrast.ts` alone; import them from
 * there.
 */
import { deltaE, parseHex, toHex } from "../../scripts/contrast.ts";

type Rgb = [number, number, number];

const linear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const gamma = (v: number) =>
  Math.round(
    255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055),
  );

function linearRgb(hex: string): Rgb {
  const { r, g, b } = parseHex(hex);
  return [linear(r), linear(g), linear(b)];
}

function fromLinear([r, g, b]: Rgb): string {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return toHex({ r: gamma(clamp(r)), g: gamma(clamp(g)), b: gamma(clamp(b)) });
}

/** sRGB to OKLab (Björn Ottosson's published matrices). */
function oklab(hex: string): Rgb {
  const [r, g, b] = linearRgb(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** OKLab to linear sRGB, unclamped. */
function linearFromOklab(L: number, a: number, b: number): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export type Oklch = { l: number; c: number; h: number };

/** A colour's OKLCH: lightness 0 to 1, chroma from 0, hue in degrees (0 for a grey). */
export function oklch(hex: string): Oklch {
  const [L, a, b] = oklab(hex);
  const c = Math.hypot(a, b);
  const h = c < 1e-4 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

/** An OKLCH colour as `#RRGGBB`; outside sRGB, chroma gives way until it fits. */
export function fromOklch(l: number, c: number, h: number): string {
  const L = Math.min(1, Math.max(0, l));
  const rad = (h * Math.PI) / 180;
  const at = (chroma: number) =>
    linearFromOklab(L, chroma * Math.cos(rad), chroma * Math.sin(rad));
  const fits = (rgb: Rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);
  let chroma = Math.max(0, c);
  if (!fits(at(chroma))) {
    let lo = 0;
    let hi = chroma;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(at(mid))) lo = mid;
      else hi = mid;
    }
    chroma = lo;
  }
  return fromLinear(at(chroma));
}

/**
 * Full-severity colour-vision deficiency (Machado, Oliveira and Fernandes,
 * 2009), applied in linear RGB: the matrices the workbench showed.
 */
export const VISIONS = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
} as const;

export type Vision = keyof typeof VISIONS;

/** The colour as a reader with the deficiency sees it. */
export function simulate(hex: string, vision: Vision): string {
  const rgb = linearRgb(hex);
  const m = VISIONS[vision];
  return fromLinear(
    m.map((row) => row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]) as Rgb,
  );
}

/** ΔE of two colours as a reader with the deficiency sees them. */
export function deltaEUnder(a: string, b: string, vision: Vision): number {
  return deltaE(simulate(a, vision), simulate(b, vision));
}
