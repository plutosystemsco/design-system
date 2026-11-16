<script lang="ts" module>
  export const meta = {
    title: "Pressable",
    intro:
      "Four filters to turn on and off. Each is a toggle button: pressed, it fills with the primary colour and shows a check, so its state is a shape too.",
  };
</script>

<script lang="ts">
  import { Tag, TagGroup } from "#lib/registry/ui/tag";
  // site:hide
  // 027b test 40: onpressedchange, once per press, with the new state.
  let hook = $state(false);
  let hookLog = $state<boolean[]>([]);
  // site:show

  const shown = $state({
    Archived: false,
    Starred: false,
    Shared: false,
    Drafts: false,
  });
</script>

<TagGroup aria-label="Show">
  <Tag label="Archived" bind:pressed={shown.Archived} />
  <Tag label="Starred" bind:pressed={shown.Starred} />
  <Tag label="Shared" bind:pressed={shown.Shared} />
  <Tag label="Drafts" bind:pressed={shown.Drafts} />
</TagGroup>
<!-- site:hide -->
<div hidden data-testid="tag-hooks">
  <TagGroup aria-label="Hooks">
    <Tag
      label="Hook"
      bind:pressed={hook}
      onpressedchange={(p) => hookLog.push(p)}
    />
  </TagGroup>
  <output data-testid="tag-hooks-log">{hookLog.join(",")}</output>
</div>
<!-- site:show -->
