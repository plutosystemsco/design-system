<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Press F8 to reach them, Tab between their buttons, Escape to dismiss one. F8 again goes back.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";

  function raiseTwo() {
    toast.success("Project saved");
    toast("Message deleted", {
      action: { label: "Undo", onclick: () => {} },
    });
  }
</script>

<div data-testid="keyboard-fixture">
  <Button onclick={raiseTwo}>Raise two</Button>
</div>
