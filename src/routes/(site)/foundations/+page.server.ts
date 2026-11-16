import { readTokens } from "../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** Three facts generated from the token files (021 decision 14: through the lowering). */
export const load: PageServerLoad = () => {
  const tokens = readTokens();
  return {
    roles: Object.keys(tokens.themes.light).length,
    primitives: Object.keys(tokens.primitives).length,
    radius: tokens.radius.case,
  };
};
