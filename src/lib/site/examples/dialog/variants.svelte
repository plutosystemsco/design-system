<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A modal window named by its title, centred, 16 px from each edge on a phone and 448 px wide at most, behind the scrim, on the elevation shadow alone. Rename project has a title, a description, a field, Cancel and Save; Read the terms is named by label, with a long body that scrolls.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Dialog from "#lib/registry/ui/dialog";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";

  const terms = Array.from(
    { length: 24 },
    (_, i) =>
      `${i + 1}. Every run is given a fuel budget. A program that spends it is stopped, and the output so far is kept. Nothing a run does outlives it: the sandbox is created for the run and thrown away after it.`,
  );
</script>

<div class="flex flex-wrap items-start gap-8">
  <Dialog.Root>
    <Dialog.Trigger
      data-testid="dialog-rename"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
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
  <Dialog.Root>
    <Dialog.Trigger
      data-testid="dialog-terms"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Read the terms</Dialog.Trigger
    >
    <Dialog.Content label="Terms of use">
      <div class="grid gap-4 text-sm">
        {#each terms as paragraph, i (i)}
          <p>{paragraph}</p>
        {/each}
      </div>
      <Dialog.Footer showCloseButton />
    </Dialog.Content>
  </Dialog.Root>
</div>
