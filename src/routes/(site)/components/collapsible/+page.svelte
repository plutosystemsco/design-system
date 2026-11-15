<script lang="ts">
  import * as keyboard from "#lib/site/examples/collapsible/keyboard.svelte";
  import * as states from "#lib/site/examples/collapsible/states.svelte";
  import * as variants from "#lib/site/examples/collapsible/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="collapsible" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a collapsible to tuck away one piece of detail that most readers can
      skip, such as advanced settings. For a list of sections that each open,
      use an accordion.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Name the trigger after what it shows.</li>
    <li>Style the trigger as a button, so it reads as one.</li>
  {/snippet}
  {#snippet donts()}
    <li>Hide something a reader needs to finish the task.</li>
    <li>Stack several collapsibles in a row. Use an accordion.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The trigger is a button with <code>aria-expanded</code> and
      <code>aria-controls</code>; Enter and Space toggle it.
    </li>
    <li>It opens and closes without animation.</li>
  {/snippet}
</Component>
