import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** The scale steps this face is set at (001 decision 11). */
const STEPS = ["base"] as const;

export const load: PageServerLoad = () => {
  const tokens = readTokens();
  const family = tokens.type.families.sans;
  return {
    variable: family.variable,
    family: family.family,
    specimens: STEPS.map((step) => ({ step, ...tokens.type.scale[step] })),
  };
};
