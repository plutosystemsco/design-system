<script lang="ts">
  import * as keyboard from "#lib/site/examples/checkbox/keyboard.svelte";
  import * as states from "#lib/site/examples/checkbox/states.svelte";
  import * as variants from "#lib/site/examples/checkbox/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="checkbox" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a checkbox for a yes or no choice that takes effect when the form is
      sent, such as accepting terms. Use several for choices that can be
      combined. For a setting that takes effect at once, use a switch.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Put the label after the checkbox, in a horizontal field.</li>
    <li>Use indeterminate for a parent whose children are partly checked.</li>
    <li>Group related checkboxes in a set with a legend.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a checkbox for one of many. Use a radio group.</li>
    <li>Use a switch for a required consent. Use a checkbox.</li>
    <li>Write a label in the negative, such as "Do not email me".</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>&lt;button role="checkbox"&gt;</code> with
      <code>aria-checked</code> true, false or mixed. Space toggles it.
    </li>
    <li>A check or a dash tells the state by shape, not colour alone.</li>
    <li>
      Named by its label; inside a <code>Field</code>, wired to its description
      and error.
    </li>
  {/snippet}
</Component>
