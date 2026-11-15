<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One inverted chip, 4 px from its trigger. It opens on hover and on focus, stays while the pointer moves onto it, and closes on Escape.",
    frameMinHeight: 160,
  };
</script>

<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import { Button } from "#lib/registry/ui/button";
  import * as Kbd from "#lib/registry/ui/kbd";
  import * as Tooltip from "#lib/registry/ui/tooltip";
</script>

<Tooltip.Provider>
  <div class="flex flex-wrap items-center gap-8">
    <!-- It repeats an icon button's name. -->
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button {...props} size="icon" variant="secondary" aria-label="Copy">
            <Copy aria-hidden="true" />
          </Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>Copy</Tooltip.Content>
    </Tooltip.Root>
    <!-- It shows a shortcut. -->
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="secondary">Run</Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        Run <Kbd.Group
          ><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>Enter</Kbd.Root></Kbd.Group
        >
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</Tooltip.Provider>
