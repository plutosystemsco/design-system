import {
  contrastTable,
  fieldRows,
  forbiddenRows,
  glassFallbackRows,
  glassRingRows,
  glassRows,
  scrimRows,
} from "../../../../../scripts/contrast.ts";
import { readTokens, resolveColor } from "../../../../../scripts/tokens.ts";
import { highlightCode } from "#lib/registry/lib/highlighter";
import { SURFACE_CODE } from "./surface-code";

/** The theme's tokens and their measurements, read from the token file. */
export async function load() {
  const tokens = readTokens();
  return {
    // The ink surface's code block, highlighted at prerender.
    surface: await highlightCode(SURFACE_CODE, "python"),
    swatches: Object.keys(tokens.themes.light).map((name) => ({
      name,
      light: resolveColor(tokens, "light", name),
      dark: resolveColor(tokens, "dark", name),
    })),
    contrast: {
      light: contrastTable(tokens, "light"),
      dark: contrastTable(tokens, "dark"),
    },
    forbidden: forbiddenRows(tokens),
    scrim: scrimRows(tokens),
    elevation: tokens.elevation,
    scale: Object.entries(tokens.type.scale).map(([step, value]) => ({
      step,
      ...value,
    })),
    tracking: tokens.type.tracking,
    spacing: tokens.spacing,
    radius: tokens.radius.case,
    motion: tokens.motion,
    // The expressive mode's display steps and motion, and the fields and
    // the glass, measured.
    expressive: {
      steps: tokens.expressive.display.steps,
      motion: tokens.expressive.motion,
      brand: (["light", "dark"] as const).map((theme) => {
        const own = <T extends { theme: string }>(rows: T[]) =>
          rows.filter((r) => r.theme === theme);
        return {
          theme,
          fields: own(fieldRows(tokens)),
          glass: own([
            ...glassRows(tokens),
            ...glassFallbackRows(tokens),
            ...glassRingRows(tokens),
          ]).map((row, i) => ({ ...row, n: i + 1 })),
        };
      }),
      field: tokens.expressive.field,
    },
  };
}

/** What the page's examples read. */
export type ThemeData = Awaited<ReturnType<typeof load>>;
