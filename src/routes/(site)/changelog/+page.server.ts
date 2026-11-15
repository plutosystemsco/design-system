import { readFileSync } from "node:fs";
import path from "node:path";
import { changelogPage, parseChangelog } from "#lib/site/changelog";
import { componentPath, sitePage } from "#lib/site/sitemap";
import type { PageServerLoad } from "./$types";

/**
 * CHANGELOG.md, read at prerender: the page cannot drift from the file. An
 * item named in a bullet's head links to its page (018 decision 11).
 */
export const load: PageServerLoad = () =>
  changelogPage(
    parseChangelog(readFileSync(path.resolve("CHANGELOG.md"), "utf8")),
    (name) => (sitePage(componentPath(name)) ? componentPath(name) : null),
  );
