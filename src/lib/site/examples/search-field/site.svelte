<script lang="ts" module>
  export const meta = {
    title: "Site search",
    intro:
      "The site's search, wrapped in a search landmark with its submit button. Enter submits the form, as a search input does.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";

  let value = $state("");
</script>

<search class="max-w-lg">
  <form class="grid gap-2" onsubmit={(e) => e.preventDefault()}>
    <Label for="site-search">Search the site</Label>
    <div class="flex gap-2">
      <SearchField
        id="site-search"
        name="q"
        bind:value
        class="flex-1"
        autocomplete="off"
      />
      <Button type="submit" variant="secondary">Search</Button>
    </div>
  </form>
</search>
