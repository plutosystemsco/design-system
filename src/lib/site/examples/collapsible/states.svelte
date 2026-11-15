<script lang="ts" module>
  export const meta = {
    title: "Open",
    intro: "Pass open to show the content from the start.",
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Collapsible from "#lib/registry/ui/collapsible";
</script>

<Collapsible.Root open class="grid max-w-md gap-3">
  <Collapsible.Trigger
    class={buttonVariants({ variant: "secondary", size: "sm" })}
    >Environment variables</Collapsible.Trigger
  >
  <Collapsible.Content class="rounded border border-border p-4 text-sm">
    <code>PYTHONPATH</code>, <code>SANDBOX_FUEL</code> and two secrets.
  </Collapsible.Content>
</Collapsible.Root>
