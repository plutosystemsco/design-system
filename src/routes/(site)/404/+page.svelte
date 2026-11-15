<script lang="ts">
  import Search from "#lib/site/chrome/search.svelte";
  import DoorLink from "#lib/site/chrome/door-link.svelte";
  import { DOORS } from "#lib/site/doors";
  import { pageTitle } from "#lib/site/site";
</script>

<svelte:head>
  <title>{pageTitle("Not found")}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- Quiet, on the canvas: what happened, search, and the four doors. -->
<div
  data-mode="productive"
  class="mx-auto max-w-7xl px-(--gutter-stage) pt-[calc(var(--site-bar-room)+var(--spacing)*16)] pb-24"
>
  <h1 class="type-section">No page here.</h1>
  <p class="mt-4 max-w-(--site-measure) text-lg text-muted-foreground">
    This address doesn't match a page. Search for it, or start from one of the
    four sections.
  </p>
  <div class="mt-8"><Search /></div>
  <nav aria-label="Sections" class="mt-8">
    <ul class="flex flex-wrap gap-2">
      {#each DOORS as door (door.id)}
        <li><DoorLink {door} class="min-h-12 text-base" /></li>
      {/each}
    </ul>
  </nav>
</div>
