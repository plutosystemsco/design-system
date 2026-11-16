<script lang="ts" module>
  export const meta = {
    title: "The ends",
    intro:
      "Page 1 has no Previous, and page 12 no Next: there is nothing to do there. Each end's slot keeps its width, so the pages do not move.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";
  // site:hide
  import { onMount } from "svelte";

  // 027b tests 16 and 20a: pagers beside the ends, and the width sweep,
  // drawn only for a test that asks with ?hooks.
  let hooks = $state(false);
  onMount(() => {
    hooks = new URLSearchParams(location.search).has("hooks");
  });
  const LONG = { previous: "PreviousPrevious", next: "NextNext" };
  const SIZES = ["default", "sm"] as const;
  const SIBLINGS = [0, 1, 2] as const;
  // site:show

  const href = (page: number) => `?page=${page}`;
</script>

<div class="grid gap-6">
  <Pagination
    page={1}
    pages={12}
    {href}
    strings={{ label: "Pagination at the start" }}
  />
  <Pagination
    page={12}
    pages={12}
    {href}
    strings={{ label: "Pagination at the end" }}
  />
</div>
<!-- site:hide -->
<div hidden data-testid="pagination-one-page">
  <Pagination pages={1} {href} />
</div>
{#if hooks}
  <div data-testid="pagination-hooks" class="mt-8 grid gap-4">
    {#each [1, 2, 11, 12] as page (page)}
      {#each ["plain", "long"] as words (words)}
        <div data-testid="pagination-ends-{page}-{words}">
          <Pagination
            {page}
            pages={12}
            {href}
            strings={words === "long" ? LONG : undefined}
          />
        </div>
      {/each}
    {/each}
    {#each SIZES as size (size)}
      {#each SIBLINGS as siblings (siblings)}
        {#each [1, 5, 12] as page (page)}
          <div data-testid="pagination-sweep-{size}-{siblings}-{page}">
            <Pagination {page} pages={12} {size} {siblings} {href} />
          </div>
        {/each}
      {/each}
    {/each}
  </div>
{/if}
<!-- site:show -->
