<script lang="ts" module>
  export const meta = {
    title: "Disabled and read-only",
    intro:
      "A disabled field and a read-only one, each holding text. Neither shows Clear, and Escape passes on.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";
</script>

<div class="grid max-w-md gap-6">
  <div class="grid gap-2">
    <Label for="search-archive">Search the archive</Label>
    <SearchField id="search-archive" value="design" disabled />
  </div>
  <div class="grid gap-2">
    <Label for="search-history">Search your history</Label>
    <SearchField id="search-history" value="design" readonly />
  </div>
</div>
