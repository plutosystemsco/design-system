<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    id,
    title,
    children,
  }: { id: string; title: string; children: Snippet } = $props();
</script>

<!-- A measure slot on a Brand page: its heading, then its text and figures. -->
<section
  aria-labelledby={id}
  class="mx-auto max-w-7xl px-(--gutter-stage) pt-16"
>
  <h2 {id} class="text-2xl font-semibold tracking-section">{title}</h2>
  <div class="mt-6 grid max-w-prose gap-4">{@render children()}</div>
</section>
