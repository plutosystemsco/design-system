<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    caption,
    children,
    class: className = "",
  }: { caption: string; children: Snippet; class?: string } = $props();
</script>

<figure class="flex flex-col items-start gap-2 {className}">
  {@render children()}
  <figcaption><code class="text-xs">{caption}</code></figcaption>
</figure>
