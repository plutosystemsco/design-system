<script lang="ts" module>
  export const meta = {
    title: "Removable",
    intro:
      "Three filters in a group named Filters. Remove one by its button, or by Delete or Backspace on it; focus goes to the next tag, then the previous, then the list.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Tag, TagGroup } from "#lib/registry/ui/tag";

  const ALL = ["Design", "Research", "Writing"];
  let filters = $state([...ALL]);
</script>

<div class="grid max-w-md justify-items-start gap-4">
  <TagGroup aria-label="Filters">
    {#each filters as filter (filter)}
      <Tag
        label={filter}
        onremove={() => (filters = filters.filter((f) => f !== filter))}
      />
    {/each}
  </TagGroup>
  {#if filters.length === 0}
    <Button variant="secondary" size="sm" onclick={() => (filters = [...ALL])}
      >Reset filters</Button
    >
  {/if}
</div>
