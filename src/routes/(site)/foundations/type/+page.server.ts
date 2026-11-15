import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** The type tokens, read from the token file at prerender. */
export const load: PageServerLoad = () => {
  const t = readTokens();
  return {
    families: t.type.families,
    scale: t.type.scale,
    tracking: t.type.tracking,
    weight: t.type.weight,
    steps: t.expressive.display.steps,
  };
};
