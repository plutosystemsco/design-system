import { DOORS } from "#lib/site/doors";
import { addCommand, SITE_NAME, SITE_ORIGIN, VERSION } from "#lib/site/site";
import { SITEMAP, sitePage, type SitePage } from "#lib/site/sitemap";

export const prerender = true;
export const trailingSlash = "never";

const twin = (p: SitePage) => `${SITE_ORIGIN}${p.path}index.md`;
const line = (p: SitePage) => `- [${p.title}](${twin(p)}): ${p.summary}`;

/** The index of every page's Markdown twin, in llmstxt.org's shape. */
export function GET() {
  const home = sitePage("/")!;
  const changelog = sitePage("/changelog/")!;
  const parts = [
    `# ${SITE_NAME}`,
    `> The tokens, components and brand behind every Pluto Systems product, delivered as a shadcn-svelte registry: an app copies the source in and owns it. Install with \`${addCommand("kuiper-theme")}\`. Start at [the home page](${twin(home)}).`,
    ...DOORS.map(
      (d) =>
        `## ${d.name}\n\n` +
        SITEMAP.filter((p) => p.door === d.id)
          .map(line)
          .join("\n"),
    ),
    [
      "## Registry\n",
      `- [This release's registry](${SITE_ORIGIN}/v${VERSION}/r/styles/maia/index.json): every item at ${VERSION}, the path an app installs from.`,
      `- [The latest registry](${SITE_ORIGIN}/r/styles/maia/index.json): the newest build of every item.`,
    ].join("\n"),
    [
      "## Optional",
      [changelog, ...SITEMAP.filter((p) => p.parent === "/changelog/")]
        .map(line)
        .join("\n"),
    ].join("\n\n"),
  ];
  return new Response(parts.join("\n\n") + "\n", {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
