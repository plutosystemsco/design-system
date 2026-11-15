<script lang="ts">
  import { componentPath } from "../sitemap.ts";

  type Link = { name: string; title: string };
  let {
    brings,
    broughtBy,
    packages,
  }: { brings: Link[]; broughtBy: Link[]; packages: string[] } = $props();
</script>

<div class="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
  <div class="min-w-0">
    <h3 class="font-sans text-base font-semibold">It brings</h3>
    {#if brings.length || packages.length}
      <ul class="groove-b mt-3">
        {#each brings as b (b.name)}
          <li class="groove py-3">
            <a
              href={componentPath(b.name)}
              class="text-foreground hover:underline">{b.title}</a
            >
          </li>
        {/each}
        {#each packages as p (p)}
          <li class="groove py-3 font-mono text-sm wrap-anywhere">{p}</li>
        {/each}
      </ul>
    {:else}
      <p class="mt-3 text-muted-foreground">Nothing: it stands alone.</p>
    {/if}
  </div>
  <div class="min-w-0">
    <h3 class="font-sans text-base font-semibold">Brought by</h3>
    {#if broughtBy.length}
      <ul
        class="groove-b mt-3 grid grid-cols-[repeat(auto-fill,minmax(min(100%,var(--container-3xs)),1fr))] gap-x-6"
      >
        {#each broughtBy as b (b.name)}
          <li class="groove py-3">
            <a
              href={componentPath(b.name)}
              class="text-foreground hover:underline">{b.title}</a
            >
          </li>
        {/each}
      </ul>
    {:else}
      <p class="mt-3 text-muted-foreground">No other item brings it.</p>
    {/if}
  </div>
</div>
