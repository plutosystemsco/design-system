<script lang="ts">
  import Eyebrow from "#lib/preview/eyebrow.svelte";
  import InstallCommand from "#lib/preview/install-command.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head><title>Pluto Systems design system</title></svelte:head>

<Eyebrow>registry · {data.name} · {data.count} items</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">The design system</h1>
<p class="mt-4 max-w-prose text-muted-foreground">
  Tokens, styles and Svelte components for Pluto Systems applications, served as
  a shadcn-svelte registry. An app installs an item and owns its source.
</p>

{#each data.groups as group (group.key)}
  <section class="mt-16" aria-labelledby="group-{group.key}">
    <h2 id="group-{group.key}" class="text-2xl font-bold tracking-section">
      {group.heading}
    </h2>
    <ul class="mt-6 grid gap-6 md:grid-cols-2">
      {#each group.items as item (item.name)}
        <li class="rounded border border-border bg-card p-6">
          <p class="font-mono text-xs text-muted-foreground">{item.type}</p>
          <h3 class="mt-2 text-2xl font-bold tracking-section">
            <a
              href="/items/{item.name}/"
              class="text-primary underline underline-offset-4">{item.title}</a
            >
          </h3>
          <p class="mt-2">{item.description}</p>
          <div class="mt-4"><InstallCommand name={item.name} /></div>
        </li>
      {/each}
    </ul>
  </section>
{/each}
