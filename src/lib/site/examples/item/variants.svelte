<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A row of media, content and actions, plain or outlined, at two sizes. An item can also take a header and a footer.",
  };
</script>

<script lang="ts">
  import FolderOpen from "phosphor-svelte/lib/FolderOpen";
  import { Badge } from "#lib/registry/ui/badge";
  import { Button } from "#lib/registry/ui/button";
  import * as Item from "#lib/registry/ui/item";
</script>

<div class="grid max-w-xl gap-8">
  {#each ["default", "outline"] as const as variant (variant)}
    {#each ["default", "sm"] as const as size (size)}
      <Item.Root {variant} {size}>
        <Item.Media variant="icon">
          <FolderOpen aria-hidden="true" />
        </Item.Media>
        <Item.Content>
          <Item.Title>pluto-sandbox</Item.Title>
          <Item.Description>Last run 2 minutes ago on main.</Item.Description>
        </Item.Content>
        <Item.Actions>
          <Button size="sm" variant="secondary">Open</Button>
        </Item.Actions>
      </Item.Root>
    {/each}
  {/each}
  <Item.Root variant="outline">
    <Item.Header>
      <Item.Title>Run 4127</Item.Title>
      <Badge variant="success">Passed</Badge>
    </Item.Header>
    <Item.Content>
      <Item.Description>212 tests in 48 seconds.</Item.Description>
    </Item.Content>
    <Item.Footer>
      <span class="text-sm text-muted-foreground">main at a3f9c21</span>
    </Item.Footer>
  </Item.Root>
</div>
