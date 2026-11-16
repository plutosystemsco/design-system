<script lang="ts" module>
  export const meta = {
    title: "Static",
    intro:
      "Tags with neither onremove nor pressed are text in a tag's shape: filters a person cannot change here. A status to read is a badge instead.",
  };
</script>

<script lang="ts">
  import { Tag } from "#lib/registry/ui/tag";
</script>

<p class="flex flex-wrap items-center gap-2 text-sm">
  <span class="text-muted-foreground">Showing runs for</span>
  <Tag label="Owner: me" />
  <Tag label="Branch: main" />
</p>
