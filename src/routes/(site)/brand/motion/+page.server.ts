import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** The two durations the page names, from the token file. */
export const load: PageServerLoad = () => {
  const t = readTokens();
  return { micro: t.motion.microMs, entrance: t.motion.entranceMs };
};
