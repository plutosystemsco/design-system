<script lang="ts" module>
  export const meta = {
    title: "Busy and disabled",
    intro:
      "Busy keeps the button enabled and focused and ignores clicks; disabled leaves the tab order.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
</script>

<div class="flex flex-wrap items-center gap-4">
  <Button disabled>Save changes</Button>
  <Button variant="secondary" disabled>Cancel</Button>
  <Button busy>Signing in…</Button>
  <Button variant="secondary" size="sm" busy>Saving</Button>
</div>
