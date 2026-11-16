<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "name",
    title: "Do: the tag's own remove button",
    caption:
      "Named for its tag, “Remove Design”; Delete and Backspace remove it too.",
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
