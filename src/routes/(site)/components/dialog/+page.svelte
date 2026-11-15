<script lang="ts">
  import * as keyboard from "#lib/site/examples/dialog/keyboard.svelte";
  import * as variants from "#lib/site/examples/dialog/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="dialog" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use a dialog for a short task that must finish before the page goes on: a
      rename, or a confirm that can be undone. To confirm something that cannot
      be undone, use an alert dialog. For a panel beside the page, use a sheet.
    </p>
    <p>
      Its trigger opens it and reports <code>aria-expanded</code>. While it is
      open, the scrim, a dimmed layer, blocks the page behind. Escape, a click
      on the scrim or the close button closes it. It fades out before it leaves.
    </p>
    <p>
      Write the primary action last in the footer. On a phone the footer stacks
      its buttons with the primary on top. From the sm breakpoint they sit in a
      row, the primary at the end. <code>showCloseButton</code> on the footer adds
      a secondary Close button.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Give every dialog a title, or a <code>label</code> when it has none.
    </li>
    <li>Keep it to one task, with one primary action.</li>
    <li>Name the action with a verb: "Save", not "OK".</li>
  {/snippet}
  {#snippet donts()}
    <li>Open a dialog from inside another dialog.</li>
    <li>Use a dialog to confirm a destructive action. Use an alert dialog.</li>
    <li>Open a dialog the person did not ask for.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>role="dialog"</code> with <code>aria-modal="true"</code>, named by
      its title and described by its description.
    </li>
    <li>
      <strong>A name is required.</strong> A <code>Dialog.Title</code> inside
      the content names it. Without one, pass <code>label</code>. The type
      checker cannot tell when both are missing, so open each dialog under axe
      to check.
    </li>
    <li>
      On open, focus moves to the first tabbable element inside, here the input.
      Tab loops inside the dialog, and the 32 px close button is the last stop.
      Escape closes it and returns focus to the trigger.
    </li>
    <li>
      <code>aria-modal</code> and a scroll lock block the page behind. Nothing
      is made <code>inert</code>.
    </li>
  {/snippet}
</Component>
