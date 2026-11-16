<script lang="ts" module>
  export const meta = {
    title: "Links",
    intro:
      "Link mode: give each page its URL and every page is a link, page 5 of 12 marked as current. Previous and Next are links too.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";
</script>

<Pagination page={5} pages={12} href={(page) => `?page=${page}`} />
