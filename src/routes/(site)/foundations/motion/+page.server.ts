import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** The motion tokens, read from the token file at prerender. */
export const load: PageServerLoad = () => {
  const t = readTokens();
  return { motion: t.motion, expressive: t.expressive.motion };
};
