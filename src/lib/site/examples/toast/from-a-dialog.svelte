<script lang="ts" module>
  export const meta = {
    title: "From a dialog",
    intro:
      "Confirm the delete: the toast waits while the dialog is open, shows when it closes, and is spoken a second later.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import * as AlertDialog from "#lib/registry/ui/alert-dialog";
  import { buttonVariants } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";

  let open = $state(false);

  function remove() {
    open = false;
    toast.success("Project deleted");
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}
    >Delete project</AlertDialog.Trigger
  >
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete pluto-sandbox?</AlertDialog.Title>
      <AlertDialog.Description>
        Its 412 runs and their logs are deleted. This cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action variant="destructive" onclick={remove}
        >Delete project</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
