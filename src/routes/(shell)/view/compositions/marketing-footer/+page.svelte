<script lang="ts">
  import { version } from "$app/env";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { MarketingFooter } from "#lib/registry/ui/marketing-footer";

  // This build's own facts, as the block takes them (change review finding
  // 8): the commit when vite.config.ts names one, else no row; the commit's
  // date, else no row.
  const commit = /^\d+$/.test(version) ? undefined : version;
  const builtAt = import.meta.env.VITE_BUILT_AT as string | undefined;
</script>

<!-- The item page's frame: the lockup without its entrance (010 decision 10). -->
{#snippet logo()}
  <Lockup class="text-2xl" />
{/snippet}

<CompositionView title="Marketing footer" padded>
  {#snippet after()}
    <MarketingFooter
      {logo}
      appName="Pluto Systems"
      tagline="Work runs on data."
      groups={[
        {
          title: "Product",
          links: [
            { label: "Docs", href: "/" },
            { label: "Source", href: "/" },
          ],
        },
        { title: "Company", links: [{ label: "About", href: "/" }] },
      ]}
      {commit}
      {builtAt}
      sourceHref="https://github.com/plutosystemsco/design-system"
    />
  {/snippet}
  <h1 class="text-5xl font-bold tracking-display">Marketing footer</h1>
  <p class="mt-4 max-w-prose text-muted-foreground">
    The footer below shows this build's commit, its date and its source; a row
    whose value is absent is left out.
  </p>
</CompositionView>
