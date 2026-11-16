<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "urls",
    title: "Do: a URL per page",
    caption:
      "Each page is a link, so it can be shared, bookmarked and opened in a new tab.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";
</script>

<Pagination
  page={2}
  pages={8}
  href={(page) => `?page=${page}`}
  strings={{ label: "Pages of articles" }}
/>
