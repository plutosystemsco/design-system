import { json } from "@sveltejs/kit";
import { buildIndex } from "#lib/site/search/build-index";
import type { SearchSource } from "#lib/site/search/types";

export const prerender = true;

/** Every module in search/sources/ gives entries; a later specification adds one. */
const SOURCES = import.meta.glob<SearchSource>(
  "/src/lib/site/search/sources/*.ts",
  {
    eager: true,
  },
);

export const GET = () => json(buildIndex(Object.values(SOURCES)));
export const trailingSlash = "never";
