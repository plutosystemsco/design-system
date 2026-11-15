<script lang="ts">
  import { onMount } from "svelte";
  import { version } from "$app/env";
  import { page } from "$app/state";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import {
    MarketingFooter,
    type MarketingFooterGroup,
  } from "#lib/registry/ui/marketing-footer";
  import { DOORS } from "../doors.ts";
  import { SITEMAP, sitePage } from "../sitemap.ts";
  import { SITE_NAME, SITE_ORIGIN, SOURCE, VERSION } from "../site.ts";

  // The build's facts, as the shell's footer reads them: this repository's
  // commit (vite.config.ts names the version from git; its default would be
  // a timestamp) and the commit's date.
  const commit = /^\d+$/.test(version) ? undefined : version;
  const builtAt = import.meta.env.VITE_BUILT_AT as string | undefined;

  // One group per door: its landing, then its pages. The Components door's
  // 75 pages are on its landing, so its group holds the landing alone.
  // 018 decision 5: one link on every page, to a new issue prefilled with
  // the page's title and address. The 404 is served at any address, so it
  // reads its own in the browser.
  const route = $derived(
    (page.route.id ?? "").replace(/^\/\(site\)/, "").replace(/\/?$/, "/"),
  );
  // An address no route matches (the 404, served anywhere) has no entry.
  const entry = $derived(page.route.id ? sitePage(route) : undefined);
  let here = $state("");
  onMount(() => {
    if (!entry) here = location.pathname;
  });
  const suggest = $derived.by(() => {
    const path = entry?.path ?? here;
    const title = entry
      ? entry.path === "/"
        ? SITE_NAME
        : entry.title
      : "Page not found";
    const q = new URLSearchParams({
      title: `Suggestion: ${title}`,
      body: `Page: ${SITE_ORIGIN}${path}\n\n`,
    });
    return `${SOURCE}/issues/new?${q}`;
  });

  const groups: MarketingFooterGroup[] = $derived([
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
        { label: "Suggest a change on GitHub", href: suggest },
      ],
    },
  ]);
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
