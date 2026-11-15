<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the trigger. Enter opens the dialog with focus on the input; Tab reaches the close button last and loops; Escape closes it and focus returns to the trigger.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Dialog from "#lib/registry/ui/dialog";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
</script>

<div data-testid="keyboard-fixture">
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Rename project</Dialog.Trigger
    >
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Rename project</Dialog.Title>
        <Dialog.Description
          >The new name shows everywhere the project is listed.</Dialog.Description
        >
      </Dialog.Header>
      <form class="grid gap-6" onsubmit={(e) => e.preventDefault()}>
        <Field.Field>
          <Field.Label>Name</Field.Label>
          <Input value="Dart throws" autocomplete="off" />
        </Field.Field>
        <Dialog.Footer>
          <Dialog.Close class={buttonVariants({ variant: "secondary" })}
            >Cancel</Dialog.Close
          >
          <Button type="submit">Save</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>
