<!--
  027 decision 15: a group of three removable tags. Removing the first, by
  its remove button, is the main interaction: the app removes it, and the
  group moves focus to the next.
-->
<script lang="ts">
  import { Tag, TagGroup } from "#lib/components/ui/tag";

  let tags = $state(["Design", "Research", "Writing"]);
</script>

<TagGroup aria-label="Filters">
  {#each tags as tag (tag)}
    <Tag label={tag} onremove={() => (tags = tags.filter((t) => t !== tag))} />
  {/each}
</TagGroup>
