<script lang="ts" module>
  export const meta = {
    title: "Inside a busy button",
    intro:
      "A busy button shows the spinner itself. The button's name says what is happening.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
</script>

<div class="flex flex-wrap items-end gap-6">
  <Button busy>Signing in…</Button>
</div>
