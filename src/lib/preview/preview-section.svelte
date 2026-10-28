<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    id,
    title,
    intro,
    children,
  }: { id: string; title: string; intro?: string; children: Snippet } =
    $props();
</script>

<section class="mt-16" aria-labelledby={id}>
  <h2 {id} class="text-2xl font-bold tracking-section">{title}</h2>
  {#if intro}
    <p class="mt-2 max-w-prose text-muted-foreground">{intro}</p>
  {/if}
  <div class="mt-6">
    {@render children()}
  </div>
</section>
