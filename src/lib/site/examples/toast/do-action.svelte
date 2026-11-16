<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "action",
    title: "Do: the action is on the page too",
    caption:
      "Undo in the toast, and the message in Trash, where it can be restored too.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<div inert class="grid gap-3">
  <ol class="grid max-w-sm gap-2">
    <Toast
      kind="info"
      title="Message deleted"
      action={{ label: "Undo", onclick: () => {} }}
    />
  </ol>
  <p class="text-sm text-muted-foreground">Trash: Launch window moved</p>
</div>
