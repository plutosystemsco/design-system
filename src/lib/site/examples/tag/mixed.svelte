<script lang="ts" module>
  export const meta = {
    title: "Mixed",
    intro:
      "A fixed filter, Owner: me, between two removable ones. The static tag is not a Tab stop and holds no place in the order focus moves through.",
  };
</script>

<script lang="ts">
  import { Tag, TagGroup } from "#lib/registry/ui/tag";

  let design = $state(true);
  let research = $state(true);
</script>

<TagGroup aria-label="Filters">
  {#if design}
    <Tag label="Design" onremove={() => (design = false)} />
  {/if}
  <Tag label="Owner: me" />
  {#if research}
    <Tag label="Research" onremove={() => (research = false)} />
  {/if}
</TagGroup>
