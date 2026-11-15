/**
 * What the Brand pages draw, read from the token file at prerender: the
 * mark's geometry, the lockup laid out, the display steps and the four
 * fields with their legends' measured ratios.
 */
import { fieldRows } from "../../../../scripts/contrast.ts";
import { readTokens, FIELDS } from "../../../../scripts/tokens.ts";
import { DOWNLOADS, lockupDrawing } from "./downloads.ts";

export const FIELD_NAMES = ["Blue", "Red", "Yellow", "Green"] as const;

export async function brandFacts() {
  const tokens = readTokens();
  const rows = fieldRows(tokens).filter((r) => r.kind === "text");
  const ratio = (theme: string, field: string) =>
    rows.find(
      (r) => r.theme === theme && r.label === `${field}-foreground on ${field}`,
    )!.ratio;
  return {
    mark: tokens.mark,
    tracking: tokens.type.tracking.mark,
    lockup: await lockupDrawing(tokens),
    steps: Object.entries(tokens.expressive.display.steps),
    families: tokens.type.families,
    radius: tokens.radius.case,
    micro: tokens.motion.microMs,
    entrance: tokens.motion.entranceMs,
    fields: FIELDS.map((field, i) => {
      const [lf, ll] = tokens.expressive.field.light[field];
      const [df, dl] = tokens.expressive.field.dark[field];
      return {
        n: i + 1,
        field,
        name: FIELD_NAMES[i],
        light: {
          fill: tokens.primitives[lf],
          legend: tokens.primitives[ll],
          ratio: ratio("light", field),
        },
        dark: {
          fill: tokens.primitives[df],
          legend: tokens.primitives[dl],
          ratio: ratio("dark", field),
        },
      };
    }),
    canvas: tokens.primitives.paper,
    graphite: tokens.primitives.graphite,
    white: tokens.primitives.raised,
    downloads: DOWNLOADS,
  };
}
