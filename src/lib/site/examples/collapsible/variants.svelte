<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A button that shows and hides a region. It has no look of its own: style the trigger and the content.",
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Collapsible from "#lib/registry/ui/collapsible";
</script>

<Collapsible.Root class="grid max-w-md gap-3">
  <Collapsible.Trigger
    class={buttonVariants({ variant: "secondary", size: "sm" })}
    >Environment variables</Collapsible.Trigger
  >
  <Collapsible.Content class="rounded border border-border p-4 text-sm">
    <code>PYTHONPATH</code>, <code>SANDBOX_FUEL</code> and two secrets.
  </Collapsible.Content>
</Collapsible.Root>
