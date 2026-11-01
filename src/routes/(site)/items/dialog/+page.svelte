<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Dialog from "#lib/registry/ui/dialog";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const terms = Array.from(
    { length: 24 },
    (_, i) =>
      `${i + 1}. Every run is given a fuel budget. A program that spends it is stopped, and the output so far is kept. Nothing a run does outlives it: the sandbox is created for the run and thrown away after it.`,
  );
</script>

<ItemHeader name="dialog" />

{#snippet rename(testid: string | undefined)}
  <Dialog.Root>
    <Dialog.Trigger
      data-testid={testid}
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
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A modal window named by its title, centred, 16 px from each edge on a phone and 448 px wide at most, behind the scrim, on the elevation shadow alone. For a task that must finish before the page goes on: a rename, a non-destructive confirm. A confirm that needs an answer is alert-dialog."
>
  <div class="flex flex-wrap items-start gap-8">
    <Specimen caption="a rename: title, description, a field, Cancel and Save">
      {@render rename("dialog-rename")}
    </Specimen>
    <Specimen caption="named by label, with a long body that scrolls">
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
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Closed until its trigger is pressed, which says aria-expanded. Open, the page behind is dimmed by the scrim and blocked; Escape, a click on the scrim or the close button closes it, and the window holds for the fade before it leaves."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    The footer stacks its buttons on a phone, the primary action last, and lays
    them in a row from the sm breakpoint. <code>showCloseButton</code> on the footer
    adds a secondary Close.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>role="dialog"</code> with <code>aria-modal="true"</code>, named by
      its title and described by its description.
    </li>
    <li>
      <strong>A name is required.</strong> A <code>Dialog.Title</code> inside
      the content names it; without one, pass <code>label</code>. One of the two
      is mandatory, and the type checker cannot enforce it, so the tests open
      each dialog under axe.
    </li>
    <li>
      Focus moves to the first tabbable element inside on open (here, the input)
      and loops; the close button, 32 px, is the last stop; Escape closes it and
      returns focus to the trigger.
    </li>
    <li>
      Behind the dialog the page is blocked by <code>aria-modal</code> and a
      scroll lock; nothing is made <code>inert</code>.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the trigger. Enter opens the dialog with focus on the input; Tab reaches the close button last and loops; Escape closes it and focus returns to the trigger."
>
  <div data-testid="keyboard-fixture">{@render rename(undefined)}</div>
</PreviewSection>
