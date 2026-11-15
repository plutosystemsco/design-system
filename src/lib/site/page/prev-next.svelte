<script lang="ts">
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import { navOrder, sitePage } from "../sitemap.ts";

  let { path }: { /** The page's path. */ path: string } = $props();

  const page = $derived(sitePage(path)!);
  const order = $derived(navOrder(page.door));
  const at = $derived(order.findIndex((p) => p.path === path));
  const prev = $derived(at > 0 ? order[at - 1] : undefined);
  const next = $derived(at >= 0 ? order[at + 1] : undefined);
</script>

<!-- Previous and next, in the door's nav order (018 decision 6). Not in the twin. -->
<nav
  aria-label="Pages before and after"
  data-md="skip"
  class="mt-16 grid gap-3 text-sm sm:grid-cols-2"
>
  {#if prev}
    <a
      href={prev.path}
      class="flex items-center gap-2 rounded border border-border p-4 hover:bg-muted"
      ><ArrowLeft aria-hidden="true" class="size-4 shrink-0" /><span
        ><span class="text-muted-foreground">Previous:</span>
        <span class="font-medium">{prev.title}</span></span
      ></a
    >
  {/if}
  {#if next}
    <a
      href={next.path}
      class="flex items-center justify-end gap-2 rounded border border-border p-4 text-end hover:bg-muted sm:col-start-2"
      ><span
        ><span class="text-muted-foreground">Next:</span>
        <span class="font-medium">{next.title}</span></span
      ><ArrowRight aria-hidden="true" class="size-4 shrink-0" /></a
    >
  {/if}
</nav>
