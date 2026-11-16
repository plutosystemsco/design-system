<script lang="ts" module>
  export const meta = {
    title: "Filter",
    intro:
      "A filter over a list of projects. The count comes from what is typed, and the field speaks it once typing pauses.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";
  import { countOf, matching } from "./projects";

  let value = $state("");
  const shown = $derived(matching(value));
</script>

<div class="grid max-w-md gap-2">
  <Label for="filter-projects">Search projects</Label>
  <SearchField
    id="filter-projects"
    bind:value
    results={countOf(shown.length)}
    autocomplete="off"
  />
  <ul data-testid="search-results" class="mt-2 grid gap-1 text-sm">
    {#each shown as project (project)}
      <li>{project}</li>
    {/each}
  </ul>
</div>
