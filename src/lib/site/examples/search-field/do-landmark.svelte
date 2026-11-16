<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "landmark",
    title: "Do: one search landmark",
    caption:
      "The site's search in a search landmark; a filter beside a list stays plain.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";
</script>

<div class="grid max-w-sm gap-6">
  <search class="grid gap-2">
    <Label for="do-landmark-site">Search the site</Label>
    <SearchField id="do-landmark-site" autocomplete="off" />
  </search>
  <div class="grid gap-2">
    <Label for="do-landmark-filter">Filter members</Label>
    <SearchField id="do-landmark-filter" autocomplete="off" />
  </div>
</div>
