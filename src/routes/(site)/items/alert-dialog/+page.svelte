<script lang="ts">
  import Trash from "phosphor-svelte/lib/Trash";
  import * as AlertDialog from "#lib/registry/ui/alert-dialog";
  import { buttonVariants } from "#lib/registry/ui/button";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="alert-dialog" />

{#snippet confirm(media: boolean, testid: string)}
  <AlertDialog.Root>
    <AlertDialog.Trigger
      data-testid={testid}
      class={buttonVariants({ variant: "destructive" })}
      >Delete project</AlertDialog.Trigger
    >
    <AlertDialog.Content>
      <AlertDialog.Header>
        {#if media}
          <AlertDialog.Media><Trash aria-hidden="true" /></AlertDialog.Media>
        {/if}
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
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A modal confirm on the scrim, with a hairline edge in dark and a shadow in light. It fades in and out over 200 ms and starts on Cancel."
>
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="title, description, actions">
      {@render confirm(false, "dialog-trigger")}
    </Specimen>
    <Specimen caption="with media">
      {@render confirm(true, "dialog-trigger-media")}
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Closed until its trigger is pressed; open, it traps focus until Cancel, the action or Escape closes it."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    A surface with a destructive action spends red, not blue.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>role="alertdialog"</code>, named by its title and described by its
      description.
    </li>
    <li>
      Focus starts on Cancel, the safe choice, and is trapped inside; Escape
      closes it and focus returns to the trigger.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop while closed: the trigger. Enter opens it on Cancel."
>
  <div data-testid="keyboard-fixture">
    {@render confirm(false, "dialog-trigger")}
  </div>
</PreviewSection>
