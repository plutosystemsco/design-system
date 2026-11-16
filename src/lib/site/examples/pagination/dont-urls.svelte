<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "urls",
    title: "Don't: buttons for pages with URLs",
    caption:
      "Search results paged by buttons, though each page has an address.",
    breaks: "No page to share, bookmark or open in a new tab.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";

  let page = $state(2);
</script>

<Pagination bind:page pages={8} strings={{ label: "Pages of results" }} />
