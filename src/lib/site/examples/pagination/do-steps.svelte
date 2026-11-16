<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "steps",
    title: "Do: pages of results",
    caption: "A person can jump to any page of them, or go page by page.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";
</script>

<div class="grid gap-3 text-sm">
  <p class="text-muted-foreground">84 results for “invoice”</p>
  <Pagination
    page={1}
    pages={9}
    href={(page) => `?page=${page}`}
    aria-label="Search result pages"
  />
</div>
