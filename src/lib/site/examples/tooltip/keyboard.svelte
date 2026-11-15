<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "One stop; focus opens the tooltip and Escape closes it.",
    frameMinHeight: 160,
  };
</script>

<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import { Button } from "#lib/registry/ui/button";
  import * as Tooltip from "#lib/registry/ui/tooltip";
</script>

<Tooltip.Provider>
  <div data-testid="keyboard-fixture">
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
  </div>
</Tooltip.Provider>
