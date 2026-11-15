import { readFileSync } from "node:fs";
import path from "node:path";
import { parseChangelog } from "#lib/site/changelog";
import type { PageServerLoad } from "./$types";

/** CHANGELOG.md, read at prerender: the page cannot drift from the file. */
export const load: PageServerLoad = () =>
  parseChangelog(readFileSync(path.resolve("CHANGELOG.md"), "utf8"));
