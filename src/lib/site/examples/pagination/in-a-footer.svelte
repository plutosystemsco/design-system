<script lang="ts" module>
  export const meta = {
    title: "In a footer",
    intro:
      "A table footer's row: the count at the start, the pager at the end. The pager takes the remaining width with flex-1, so it has a width to measure.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";

  const PER_PAGE = 10;
  const TOTAL = 120;
  let page = $state(5);
  const first = $derived((page - 1) * PER_PAGE + 1);
  const last = $derived(Math.min(page * PER_PAGE, TOTAL));
</script>

<div
  class="flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
>
  <p class="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
    Showing {first}–{last} of {TOTAL}
  </p>
  <Pagination
    bind:page
    pages={TOTAL / PER_PAGE}
    strings={{ label: "Order pages" }}
    class="sm:flex-1 sm:justify-end"
  />
</div>
