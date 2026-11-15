import { readTokens } from "../../../../../scripts/tokens.ts";
import { colourRows } from "#lib/site/foundations/contrast-rows.server";
import { tokenRows } from "#lib/site/foundations/tables";
import type { PageServerLoad } from "./$types";

/** The roles and the contrast rows, generated from the token file at prerender. */
export const load: PageServerLoad = () => {
  const tokens = readTokens();
  return {
    roles: tokenRows(tokens).filter(
      (r) => r.kind === "role" && !r.name.startsWith("syntax-"),
    ),
    contrast: colourRows(tokens),
    exceptions: tokens.contrast.exceptions,
  };
};
