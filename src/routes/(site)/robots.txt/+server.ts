import { SITE_ORIGIN } from "#lib/site/site";

export const prerender = true;
export const trailingSlash = "never";

/** Everything may be crawled; the sitemap names every page. */
export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
    {
      headers: { "content-type": "text/plain" },
    },
  );
}
