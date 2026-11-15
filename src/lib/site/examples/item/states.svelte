<script lang="ts" module>
  export const meta = {
    title: "A group",
    intro: "Items in a group form a list; a separator can sit between them.",
  };
</script>

<script lang="ts">
  import * as Item from "#lib/registry/ui/item";
</script>

<Item.Group class="max-w-xl">
  <Item.Root variant="outline">
    <Item.Content><Item.Title>First</Item.Title></Item.Content>
  </Item.Root>
  <Item.Separator />
  <Item.Root variant="outline">
    <Item.Content><Item.Title>Second</Item.Title></Item.Content>
  </Item.Root>
</Item.Group>
