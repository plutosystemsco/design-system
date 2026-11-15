<script lang="ts" module>
  export const meta = {
    title: "Title and sentence only",
    intro:
      "A search with no results needs no icon and no action: a heading and one sentence say what to try.",
  };
</script>

<script lang="ts">
  import * as Empty from "#lib/registry/ui/empty";
</script>

<Empty.Root>
  <Empty.Header>
    <Empty.Title level={4}>Nothing matches</Empty.Title>
    <Empty.Description>Try a shorter search.</Empty.Description>
  </Empty.Header>
</Empty.Root>
