import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** The scale steps this face is set at (decision 11). */
const STEPS = ["xs", "sm"] as const;

export const load: PageServerLoad = () => {
  const tokens = readTokens();
  const family = tokens.type.families.mono;
  return {
    variable: family.variable,
    family: family.family,
    specimens: STEPS.map((step) => ({ step, ...tokens.type.scale[step] })),
  };
};
