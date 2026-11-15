<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop while closed: the trigger. Enter opens it on Cancel; open, it traps focus until Cancel, the action or Escape closes it.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import * as AlertDialog from "#lib/registry/ui/alert-dialog";
  import { buttonVariants } from "#lib/registry/ui/button";
</script>

<div data-testid="keyboard-fixture">
  <AlertDialog.Root>
    <AlertDialog.Trigger
      data-testid="dialog-trigger"
      class={buttonVariants({ variant: "destructive" })}
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
        <AlertDialog.Action variant="destructive"
          >Delete project</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
