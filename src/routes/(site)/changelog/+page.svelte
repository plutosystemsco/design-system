<script lang="ts">
  import { Badge } from "#lib/registry/ui/badge";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import type { PageInline } from "#lib/site/changelog";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const entry = sitePage("/changelog/")!;
  const sections = $derived(
    data.releases.map((r) => ({ id: r.id, title: r.version })),
  );
</script>

<!-- 018 decision 11: an item's name links to its page, still set as code;
     a bullet's "interface change." is the badge, its words in the page. -->
{#snippet text(inlines: PageInline[])}
  {#each inlines as x, i (i)}{#if x.kind === "code"}<code>{x.text}</code
      >{:else if x.kind === "link"}<a
        href={x.href}
        class="text-primary underline underline-offset-4"
        ><code>{x.text}</code></a
      >{:else if x.kind === "mark"}<Badge variant="default">{x.text}</Badge
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
          {release.version}
        </h2>
        <p data-slot="release-date" class="mt-1 text-sm text-muted-foreground">
          {#if release.date.datetime}<time datetime={release.date.datetime}
              >{release.date.text}</time
            >{:else}{release.date.text}{/if}
        </p>
        {@render blocks(release.blocks)}
      </section>
    {/each}
  </div>
</Leaf>
