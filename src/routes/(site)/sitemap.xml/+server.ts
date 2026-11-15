import { SITE_ORIGIN } from "#lib/site/site";
import { SITEMAP } from "#lib/site/sitemap";

export const prerender = true;
export const trailingSlash = "never";

/** Every page of the list at the site's address; no view, no example view. */
export function GET() {
  const xml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const urls = SITEMAP.map(
    (p) => `  <url><loc>${xml(`${SITE_ORIGIN}${p.path}`)}</loc></url>`,
  ).join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "content-type": "application/xml" } },
  );
}
