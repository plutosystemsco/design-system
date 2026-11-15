import { brandFacts } from "#lib/site/brand/facts.server";
import type { PageServerLoad } from "./$types";

/** What the page draws, from the token file at prerender. */
export const load: PageServerLoad = () => brandFacts();
