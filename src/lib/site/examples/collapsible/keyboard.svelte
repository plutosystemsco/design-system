<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "One stop; Enter opens it.",
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Collapsible from "#lib/registry/ui/collapsible";
</script>

<div data-testid="keyboard-fixture">
  <Collapsible.Root class="grid max-w-md gap-3">
    <Collapsible.Trigger
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Environment variables</Collapsible.Trigger
    >
    <Collapsible.Content class="rounded border border-border p-4 text-sm">
      <code>PYTHONPATH</code>, <code>SANDBOX_FUEL</code> and two secrets.
    </Collapsible.Content>
  </Collapsible.Root>
</div>
