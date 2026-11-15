/**
 * The site's name, its address and its version: one place each.
 *
 * `SITE_ORIGIN` is the address the site is served from. Every install
 * command, `llms.txt`, `sitemap.xml` and every link in a Markdown twin read
 * it, because a prerendered page has no request to read an origin from, and
 * a command copied from a page must hold a full address. It is the worker's
 * workers.dev address until the owner sets `design.<domain>`;
 * `scripts/site/release-check.ts` keeps a placeholder from reaching a tag.
 */
import pkg from "../../../package.json";

export const SITE_NAME = "Pluto Systems design";
export const SITE_ORIGIN =
  "https://pluto-systems-design.claygendron.workers.dev";
export const VERSION: string = pkg.version;
export const SOURCE = "https://github.com/plutosystemsco/design-system";
export const CLI = "bunx --bun shadcn-svelte@1.7.1";

/** The registry this site serves, at this release's version. */
export const SITE_REGISTRY = `${SITE_ORIGIN}/v${VERSION}/r`;
/** The same release, from GitHub's raw files, as apps have used since 0.4.0. */
export const GITHUB_REGISTRY = `https://raw.githubusercontent.com/plutosystemsco/design-system/v${VERSION}/static/r`;

/** The command that adds an item (or several) from a registry. */
export function addCommand(
  names: string,
  registry: string = SITE_REGISTRY,
): string {
  return `REGISTRY_URL=${registry} ${CLI} add ${names} -y`;
}

/** A page's `<title>`: the page's own title, then the site's name; the home page's is the name alone. */
export function pageTitle(title?: string): string {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}
