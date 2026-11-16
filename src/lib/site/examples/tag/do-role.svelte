<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "role",
    title: "Do: a filter tag",
    caption: "Filters a person applied, each to remove where it stands.",
  };
</script>

<script lang="ts">
  import { Tag, TagGroup } from "#lib/registry/ui/tag";

  let filters = $state(["Open", "Assigned to me"]);
</script>

<TagGroup aria-label="Issue filters">
  {#each filters as filter (filter)}
    <Tag
      label={filter}
      onremove={() => (filters = filters.filter((f) => f !== filter))}
    />
  {/each}
</TagGroup>
