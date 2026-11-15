import { readTokens } from "../../../../../scripts/tokens.ts";

/** The scale steps this face is set at. */
const STEPS = ["2xl", "5xl"] as const;

export function load() {
  const tokens = readTokens();
  const family = tokens.type.families.heading;
  return {
    variable: family.variable,
    family: family.family,
    specimens: STEPS.map((step) => ({ step, ...tokens.type.scale[step] })),
  };
}
