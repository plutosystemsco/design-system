<script lang="ts" module>
  export const meta = {
    title: "Setting",
    intro:
      "Bind the toaster's timers to a setting the person can reach first: switched on, no toast leaves on its own.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Label } from "#lib/registry/ui/label";
  import { Switch } from "#lib/registry/ui/switch";
  import { toast } from "#lib/registry/ui/toast";
  import { notifications } from "./notifications.svelte.js";
</script>

<div class="grid gap-4">
  <div class="flex items-center gap-3">
    <Switch id="keep-notifications" bind:checked={notifications.keep} />
    <Label for="keep-notifications"
      >Keep notifications until I dismiss them</Label
    >
  </div>
  <div>
    <Button variant="secondary" onclick={() => toast.success("Settings saved")}
      >Save settings</Button
    >
  </div>
</div>
