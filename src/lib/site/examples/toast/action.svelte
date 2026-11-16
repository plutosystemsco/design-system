<script lang="ts" module>
  export const meta = {
    title: "Action",
    intro:
      "Delete a message: its toast offers Undo and waits. The delete is committed when the toast closes any other way.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";

  let inbox = $state(["Launch window moved", "Fuel report", "Crew roster"]);
  let trash = $state<string[]>([]);
  let deleted = $state(0);

  function remove() {
    const message = inbox[0];
    if (!message) return;
    inbox = inbox.slice(1);
    trash = [...trash, message];
    toast("Message deleted", {
      description: `"${message}" is in Trash.`,
      action: {
        label: "Undo",
        onclick: () => {
          trash = trash.filter((m) => m !== message);
          inbox = [message, ...inbox];
        },
      },
      // Undo restores it; any other close commits the delete.
      onclose: (reason) => {
        if (reason === "action") return;
        trash = trash.filter((m) => m !== message);
        deleted++;
      },
    });
  }
</script>

<div class="grid gap-4">
  <div class="flex flex-wrap items-center gap-3">
    <Button variant="destructive" onclick={remove} disabled={!inbox.length}
      >Delete message</Button
    >
    <p class="text-sm text-muted-foreground">
      Inbox {inbox.length} · Trash {trash.length} · Deleted {deleted}
    </p>
  </div>
  <ul class="grid gap-1 text-sm">
    {#each inbox as message (message)}
      <li>{message}</li>
    {/each}
  </ul>
</div>
