<script lang="ts">
  import * as keyboard from "#lib/site/examples/input/keyboard.svelte";
  import * as states from "#lib/site/examples/input/states.svelte";
  import * as variants from "#lib/site/examples/input/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="input" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use an input for one line of text: a name, an email address, a search. For
      more than one line, use a textarea. Put it in a field, so its label,
      description and error are wired to it.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give every input a visible label.</li>
    <li>
      Set <code>type</code> and <code>autocomplete</code> to fit the data.
    </li>
    <li>Say what went wrong in the error, and how to fix it.</li>
  {/snippet}
  {#snippet donts()}
    <li>Put the only instruction in the placeholder.</li>
    <li>
      Make the text smaller than 16 px. A phone zooms in on smaller text when it
      takes focus.
    </li>
    <li>Block paste. People paste passwords and codes from elsewhere.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>A native <code>&lt;input&gt;</code> with a visible label.</li>
    <li>
      Inside a <code>Field</code>, it takes its <code>id</code>,
      <code>aria-describedby</code> and <code>aria-invalid</code> from the field.
    </li>
    <li>Invalid shows a red border and the error in words.</li>
    <li>
      The app sets <code>autocomplete</code>; the input passes it through.
    </li>
  {/snippet}
</Component>
