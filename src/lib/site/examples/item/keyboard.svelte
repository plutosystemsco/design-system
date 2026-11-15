<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "One stop: a link item. The whole row is the link.",
  };
</script>

<script lang="ts">
  import * as Item from "#lib/registry/ui/item";
</script>

<div data-testid="keyboard-fixture" class="max-w-xl">
  <Item.Root variant="outline">
    {#snippet child({ props })}
      <a href="/components/item/#variants" {...props}>
        <Item.Content>
          <Item.Title>Read the variants</Item.Title>
          <Item.Description>The whole row is one link.</Item.Description>
        </Item.Content>
      </a>
    {/snippet}
  </Item.Root>
</div>
