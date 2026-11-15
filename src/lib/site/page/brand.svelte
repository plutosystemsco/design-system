<script lang="ts">
  import type { Snippet } from "svelte";
  import Breadcrumb from "../chrome/breadcrumb.svelte";
  import { door } from "../doors.ts";
  import { pageTitle } from "../site.ts";

  let {
    title,
    summary,
    children,
  }: {
    /** The page's title. Without it (the Brand landing, below its band) the quiet header is left out. */
    title?: string;
    summary?: string;
    /** Full-bleed slots, which may hold a field, and measure slots. */
    children: Snippet;
  } = $props();
</script>

<svelte:head>
  {#if title}<title>{pageTitle(title)}</title>{/if}
</svelte:head>

<!--
  A Brand page: an owned moment, expressive. A quiet header, then slots: a
  full-bleed slot spans the page and may hold a field; a measure slot keeps
  the wide measure.
-->
<div data-mode="expressive" data-slot="brand-page">
  {#if title}
    <header
      class="mx-auto max-w-7xl px-(--gutter-stage) pt-[calc(var(--site-bar-room)+var(--spacing)*10)]"
    >
      <Breadcrumb door={door("brand")} />
      <h1 class="mt-4 type-display">{title}</h1>
      {#if summary}
        <p class="mt-6 max-w-(--site-measure) text-xl text-muted-foreground">
          {summary}
        </p>
      {/if}
    </header>
  {/if}
  {@render children()}
</div>
