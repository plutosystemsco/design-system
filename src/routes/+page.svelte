<script lang="ts">
  import Eyebrow from "#lib/preview/eyebrow.svelte";
  import InstallCommand from "#lib/preview/install-command.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head><title>Pluto Systems design system</title></svelte:head>

<Eyebrow>registry · {data.name} · {data.items.length} items</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">The design system</h1>
<p class="mt-4 max-w-prose text-muted-foreground">
  Tokens, styles and Svelte components for Pluto Systems applications, served as
  a shadcn-svelte registry. An app installs an item and owns its source.
</p>

<ul class="mt-12 grid gap-6 md:grid-cols-2">
  {#each data.items as item (item.name)}
    <li class="rounded border border-border bg-card p-6">
      <p class="font-mono text-xs text-muted-foreground">{item.type}</p>
      <h2 class="mt-2 text-2xl font-bold tracking-section">
        <a
          href="/items/{item.name}/"
          class="text-primary underline underline-offset-4">{item.title}</a
        >
      </h2>
      <p class="mt-2">{item.description}</p>
      <div class="mt-4"><InstallCommand name={item.name} /></div>
    </li>
  {/each}
</ul>
