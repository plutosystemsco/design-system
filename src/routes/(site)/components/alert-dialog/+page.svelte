<script lang="ts">
  import * as keyboard from "#lib/site/examples/alert-dialog/keyboard.svelte";
  import * as variants from "#lib/site/examples/alert-dialog/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="alert-dialog" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use an alert dialog to confirm an action that cannot be undone, such as
      deleting a project. It stops the task until the person chooses.
    </p>
    <p>
      It is closed until its trigger is pressed; open, it traps focus until
      Cancel, the action or Escape closes it. A surface with a destructive
      action spends red, not blue.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Ask a question in the title: "Delete pluto-sandbox?"</li>
    <li>Say what is lost in the description.</li>
    <li>Name the action with the same verb as its trigger.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use an alert dialog for an action that can be undone.</li>
    <li>Label the buttons "Yes" and "No".</li>
    <li>Make the destructive action blue.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>role="alertdialog"</code>, named by its title and described by its
      description.
    </li>
    <li>
      Focus starts on Cancel, the safe choice, and is trapped inside; Escape
      closes it and focus returns to the trigger.
    </li>
  {/snippet}
</Component>
