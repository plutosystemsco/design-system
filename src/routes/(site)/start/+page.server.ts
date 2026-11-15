import { highlightCode } from "#lib/registry/lib/highlighter";
import { addCommand } from "#lib/site/site";
import type { PageServerLoad } from "./$types";

/** The band's two commands, in order, highlighted at prerender. */
export const load: PageServerLoad = async () => {
  const theme = addCommand("pluto-theme");
  const button = addCommand("button");
  return {
    theme: { code: theme, lines: await highlightCode(theme, "bash") },
    button: { code: button, lines: await highlightCode(button, "bash") },
  };
};
