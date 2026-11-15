<script lang="ts">
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import type { Inline } from "#lib/site/changelog";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const entry = sitePage("/changelog/")!;
  const sections = $derived(
    data.releases.map((r) => ({ id: r.id, title: r.version })),
  );
</script>

{#snippet text(inlines: Inline[])}
  {#each inlines as x, i (i)}{#if x.kind === "code"}<code>{x.text}</code
      >{:else if x.kind === "strong"}<strong>{x.text}</strong
      >{:else}{x.text}{/if}{/each}
{/snippet}

{#snippet blocks(list: typeof data.intro)}
  {#each list as block, i (i)}
    {#if block.kind === "p"}
      <p class="mt-4">{@render text(block.inlines)}</p>
    {:else if block.kind === "ul"}
      <ul class="mt-4 grid list-disc gap-3 ps-6">
        {#each block.items as item, j (j)}<li>{@render text(item)}</li>{/each}
      </ul>
    {:else}
      <ol class="mt-4 grid list-decimal gap-3 ps-6">
        {#each block.items as item, j (j)}<li>{@render text(item)}</li>{/each}
      </ol>
    {/if}
  {/each}
{/snippet}

<Leaf door={null} title={entry.title} summary={entry.summary} {sections}>
  <div class="wrap-break-word">
    {@render blocks(data.intro)}
    {#each data.releases as release (release.id)}
      <section aria-labelledby={release.id} class="mt-16">
        <h2 id={release.id} class="text-2xl font-semibold tracking-section">
          {release.title}
        </h2>
        {@render blocks(release.blocks)}
      </section>
    {/each}
  </div>
</Leaf>
