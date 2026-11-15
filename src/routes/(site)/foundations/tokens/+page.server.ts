import { readTokens } from "../../../../../scripts/tokens.ts";
import { tokenRows } from "#lib/site/foundations/tables";
import type { PageServerLoad } from "./$types";

/** Every primitive and theme role, generated from the token file at prerender. */
export const load: PageServerLoad = () => ({ rows: tokenRows(readTokens()) });
