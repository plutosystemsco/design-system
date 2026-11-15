<script lang="ts">
  import { version } from "$app/env";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import {
    MarketingFooter,
    type MarketingFooterGroup,
  } from "#lib/registry/ui/marketing-footer";
  import { DOORS } from "../doors.ts";
  import { SITEMAP } from "../sitemap.ts";
  import { SOURCE, VERSION } from "../site.ts";

  // The build's facts, as the shell's footer reads them: this repository's
  // commit (vite.config.ts names the version from git; its default would be
  // a timestamp) and the commit's date.
  const commit = /^\d+$/.test(version) ? undefined : version;
  const builtAt = import.meta.env.VITE_BUILT_AT as string | undefined;

  // One group per door: its landing, then its pages. The Components door's
  // 75 pages are on its landing, so its group holds the landing alone.
  const groups: MarketingFooterGroup[] = [
    ...DOORS.map((door) => ({
      title: door.name,
      links: [
        { label: door.name, href: door.path },
        ...(door.id === "components"
          ? []
          : SITEMAP.filter(
              (p) => p.door === door.id && p.path !== door.path,
            ).map((p) => ({ label: p.title, href: p.path }))),
      ],
    })),
    {
      title: "Registry",
      links: [
        { label: "Latest registry", href: "/r/styles/maia/index.json" },
        {
          label: "This release's registry",
          href: `/v${VERSION}/r/styles/maia/index.json`,
        },
        { label: "Changelog", href: "/changelog/" },
        { label: "llms.txt", href: "/llms.txt" },
      ],
    },
  ];
</script>

{#snippet logo()}
  <Lockup class="text-2xl" />
{/snippet}

<MarketingFooter
  {logo}
  appName="Pluto Systems"
  tagline="Work runs on data."
  {groups}
  {commit}
  {builtAt}
  sourceHref={SOURCE}
  statement="Licensed under Apache-2.0."
/>
