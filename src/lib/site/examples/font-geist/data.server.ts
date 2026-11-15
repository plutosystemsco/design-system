import { readTokens } from "../../../../../scripts/tokens.ts";

/** The scale steps this face is set at. */
const STEPS = ["base"] as const;

export function load() {
  const tokens = readTokens();
  const family = tokens.type.families.sans;
  return {
    variable: family.variable,
    family: family.family,
    specimens: STEPS.map((step) => ({ step, ...tokens.type.scale[step] })),
  };
}
