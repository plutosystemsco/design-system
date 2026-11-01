import {
  contrastTable,
  forbiddenRows,
  scrimRows,
} from "../../../../../scripts/contrast.ts";
import { readTokens, resolveColor } from "../../../../../scripts/tokens.ts";
import { highlightCode } from "#lib/registry/lib/highlighter";
import { SURFACE_CODE } from "./surface";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const tokens = readTokens();
  return {
    // 007 decision 9: the surface's code block, highlighted at prerender.
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
  };
};
