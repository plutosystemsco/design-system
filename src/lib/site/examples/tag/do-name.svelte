<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "name",
    title: "Do: the tag's own remove button",
    caption: "Its remove button is named for its tag: Remove Design.",
  };
</script>

<script lang="ts">
  import { Tag, TagGroup } from "#lib/registry/ui/tag";

  let shown = $state(true);
</script>

<TagGroup aria-label="Applied filters">
  {#if shown}
    <Tag label="Design" onremove={() => (shown = false)} />
  {/if}
</TagGroup>
