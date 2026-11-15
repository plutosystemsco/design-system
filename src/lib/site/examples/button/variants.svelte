<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One blue default per surface. Secondary carries a visible border; ghost sits in toolbars; destructive is solid red; link is always underlined.",
  };
</script>

<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import Plus from "phosphor-svelte/lib/Plus";
  import { Button } from "#lib/registry/ui/button";
  import * as Tooltip from "#lib/registry/ui/tooltip";

  const variants = [
    "default",
    "secondary",
    "ghost",
    "destructive",
    "link",
  ] as const;
</script>

<div class="grid gap-6">
  {#each variants as variant (variant)}
    <div class="flex flex-wrap items-center gap-4">
      <Button {variant}>Save changes</Button>
      <Button {variant} size="sm">Save changes</Button>
      <Button {variant} size="icon" aria-label="Add"
        ><Plus aria-hidden="true" /></Button
      >
      <Button {variant} size="icon-sm" aria-label="Add"
        ><Plus aria-hidden="true" /></Button
      >
    </div>
  {/each}
  <div class="flex flex-wrap items-center gap-4">
    <Button variant="link" href="/components/button/#states"
      >Read the states</Button
    >
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              size="icon"
              variant="secondary"
              aria-label="Copy"
            >
              <Copy aria-hidden="true" />
            </Button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>Copy</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
    <Button><Plus aria-hidden="true" />New project</Button>
  </div>
</div>
