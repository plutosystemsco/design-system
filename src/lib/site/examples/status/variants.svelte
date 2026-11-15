<script lang="ts" module>
  export const meta = {
    title: "Hidden and visible",
    intro:
      "Hidden by default, so only a screen reader hears it; visible when the words also belong on screen. Both are empty until Announce sets their text, and Clear empties them.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Status } from "#lib/registry/ui/status";

  let text = $state("");
</script>

<div class="grid gap-8">
  <div class="flex flex-wrap items-start gap-8" data-testid="status-specimens">
    <div>
      <Status {text} data-testid="status-hidden" />
      <p class="text-sm text-muted-foreground">Nothing to see: it is heard.</p>
    </div>
    <Status
      {text}
      visible
      class="min-h-6 min-w-48 text-sm"
      data-testid="status-visible"
    />
  </div>
  <div class="flex flex-wrap gap-3" data-testid="keyboard-fixture">
    <Button
      variant="secondary"
      onclick={() => (text = "Copied to the clipboard")}>Announce</Button
    >
    <Button variant="secondary" onclick={() => (text = "")}>Clear</Button>
  </div>
</div>
