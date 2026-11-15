import { highlightCode } from "#lib/registry/lib/highlighter";
import { ADD_BUTTON, ADD_THEME } from "#lib/site/start/install";
import type { PageServerLoad } from "./$types";

/** The band's two commands, in order, highlighted at prerender. */
export const load: PageServerLoad = async () => {
  // 017: the install guide's own two commands, so the band and the guide
  // never drift.
  const theme = ADD_THEME;
  const button = ADD_BUTTON;
  return {
    theme: { code: theme, lines: await highlightCode(theme, "bash") },
    button: { code: button, lines: await highlightCode(button, "bash") },
  };
};
