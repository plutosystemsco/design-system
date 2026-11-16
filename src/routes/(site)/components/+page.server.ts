import { highlightCode } from "#lib/registry/lib/highlighter";
import { addCommand } from "#lib/site/site";
import type { PageServerLoad } from "./$types";

/** The band's one command, highlighted at prerender. */
export const load: PageServerLoad = async () => {
  const code = addCommand("kuiper-theme");
  return { theme: { code, lines: await highlightCode(code, "bash") } };
};
