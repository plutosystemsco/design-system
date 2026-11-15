<script lang="ts" module>
  export const meta = {
    title: "Open",
    intro:
      "Held open at load through a bound open prop, and drawn in place, not in a portal. It closes as any tooltip does.",
    frameMinHeight: 160,
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as Tooltip from "#lib/registry/ui/tooltip";

  let open = $state(true);
</script>

<div class="pt-12">
  <Tooltip.Provider>
    <Tooltip.Root bind:open>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="secondary" size="sm">Deploy</Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content portalProps={{ disabled: true }}
        >Deploys main to production</Tooltip.Content
      >
    </Tooltip.Root>
  </Tooltip.Provider>
</div>
