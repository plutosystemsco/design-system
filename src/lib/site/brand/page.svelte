<script lang="ts">
  import type { Snippet } from "svelte";
  import Brand from "../page/brand.svelte";
  import { sitePage } from "../sitemap.ts";

  let { path, children }: { path: string; children: Snippet } = $props();
  const page = $derived(sitePage(path)!);
</script>

<!--
  One of the nine Brand pages: 015's Brand template with the page's title,
  then its summary, marked as copy about the page itself. Every p, li, td and
  figcaption on a Brand page carries data-claim (017 decision 2).
-->
<Brand title={page.title}>
  <div class="mx-auto max-w-7xl px-(--gutter-stage)">
    <p data-claim="none" class="mt-6 max-w-prose text-xl text-muted-foreground">
      {page.summary}
    </p>
  </div>
  {@render children()}
</Brand>
