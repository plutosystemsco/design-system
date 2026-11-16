<script lang="ts" module>
  export const meta = {
    title: "From a server",
    intro:
      "The count comes from a server, 400 ms after the pause. Meanwhile results is undefined, and resultsFor names the query each answer belongs to.",
  };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";
  import { countOf, matching } from "./projects";

  let value = $state("");
  let results = $state<string | undefined>(undefined);
  let resultsFor = $state<string | undefined>(undefined);
  let shown = $state<string[]>([]);
  let wait: ReturnType<typeof setTimeout> | undefined;

  /** A stand-in for a search request: its answer comes 400 ms later. */
  function ask(query: string) {
    setTimeout(() => {
      results = countOf(matching(query).length);
      resultsFor = query;
      shown = matching(query);
    }, 400);
  }

  // A new query: the old count no longer answers it. Ask once typing pauses.
  function oninput() {
    results = undefined;
    clearTimeout(wait);
    const query = value;
    if (query) wait = setTimeout(() => ask(query), 750);
  }

  onDestroy(() => clearTimeout(wait));
</script>

<div class="grid max-w-md gap-2">
  <Label for="server-projects">Search projects</Label>
  <SearchField
    id="server-projects"
    bind:value
    {results}
    {resultsFor}
    {oninput}
    autocomplete="off"
  />
  <ul class="mt-2 grid gap-1 text-sm">
    {#each shown as project (project)}
      <li>{project}</li>
    {/each}
  </ul>
</div>
