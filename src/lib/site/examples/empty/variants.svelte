<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "An empty state: an icon tile on the muted inset, a heading, one sentence and the next action.",
  };
</script>

<script lang="ts">
  import FolderOpen from "phosphor-svelte/lib/FolderOpen";
  import { Button } from "#lib/registry/ui/button";
  import * as Empty from "#lib/registry/ui/empty";
</script>

<Empty.Root class="border border-border">
  <Empty.Header>
    <Empty.Media variant="icon"><FolderOpen aria-hidden="true" /></Empty.Media>
    <Empty.Title>No projects yet</Empty.Title>
    <Empty.Description>
      Create a project to run your first build, or <a
        href="/components/empty/#accessibility">read how runs work</a
      >.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>New project</Button>
  </Empty.Content>
</Empty.Root>
