<script lang="ts">
  import FolderOpen from "phosphor-svelte/lib/FolderOpen";
  import { Badge } from "#lib/registry/ui/badge";
  import { Button } from "#lib/registry/ui/button";
  import * as Item from "#lib/registry/ui/item";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="item" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A row of media, content and actions, plain or outlined, at two sizes."
>
  <div class="grid max-w-xl gap-8">
    {#each ["default", "outline"] as const as variant (variant)}
      {#each ["default", "sm"] as const as size (size)}
        <Specimen caption="{variant} · {size}" class="w-full">
          <Item.Root {variant} {size}>
            <Item.Media variant="icon">
              <FolderOpen aria-hidden="true" />
            </Item.Media>
            <Item.Content>
              <Item.Title>wasi-python-dev</Item.Title>
              <Item.Description
                >Last run 2 minutes ago on main.</Item.Description
              >
            </Item.Content>
            <Item.Actions>
              <Button size="sm" variant="secondary">Open</Button>
            </Item.Actions>
          </Item.Root>
        </Specimen>
      {/each}
    {/each}
    <Specimen caption="with header and footer" class="w-full">
      <Item.Root variant="outline">
        <Item.Header>
          <Item.Title>Run 4127</Item.Title>
          <Badge variant="success">Passed</Badge>
        </Item.Header>
        <Item.Content>
          <Item.Description>212 tests in 48 seconds.</Item.Description>
        </Item.Content>
        <Item.Footer>
          <span class="text-sm text-muted-foreground">main · a3f9c21</span>
        </Item.Footer>
      </Item.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="a group with a separator" class="w-full max-w-xl">
    <Item.Group>
      <Item.Root variant="outline">
        <Item.Content><Item.Title>First</Item.Title></Item.Content>
      </Item.Root>
      <Item.Separator />
      <Item.Root variant="outline">
        <Item.Content><Item.Title>Second</Item.Title></Item.Content>
      </Item.Root>
    </Item.Group>
  </Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A link item, made with the <code>child</code> snippet, is one stop with the
      focus ring; its hover is the accent inset.
    </li>
    <li>A state badge in an item names the state in words.</li>
    <li>
      <code>ItemGroup</code> is a <code>list</code>, and each item in it renders
      <code>role="listitem"</code> itself.
    </li>
  </ul>
</PreviewSection>

<PreviewSection id="keyboard" title="Keyboard" intro="One stop: a link item.">
  <div data-testid="keyboard-fixture" class="max-w-xl">
    <Item.Root variant="outline">
      {#snippet child({ props })}
        <a href="/items/item/#variants" {...props}>
          <Item.Content>
            <Item.Title>Read the variants</Item.Title>
            <Item.Description>The whole row is one link.</Item.Description>
          </Item.Content>
        </a>
      {/snippet}
    </Item.Root>
  </div>
</PreviewSection>
