import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

/** Space, radius, line and focus, read from the token file at prerender. */
export const load: PageServerLoad = () => {
  const t = readTokens();
  return {
    spacing: t.spacing,
    radius: t.radius,
    line: t.line,
    focus: t.focus,
  };
};
