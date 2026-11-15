<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A modal confirm on the scrim, with a hairline edge in dark and a shadow in light, with or without media. It fades in and out over 200 ms and starts on Cancel.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import Trash from "phosphor-svelte/lib/Trash";
  import * as AlertDialog from "#lib/registry/ui/alert-dialog";
  import { buttonVariants } from "#lib/registry/ui/button";
</script>

<div class="flex flex-wrap items-end gap-8">
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
  <AlertDialog.Root>
    <AlertDialog.Trigger
      data-testid="dialog-trigger-media"
      class={buttonVariants({ variant: "destructive" })}
      >Delete project</AlertDialog.Trigger
    >
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Media><Trash aria-hidden="true" /></AlertDialog.Media>
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
