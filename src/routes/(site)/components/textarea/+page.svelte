<script lang="ts">
  import * as keyboard from "#lib/site/examples/textarea/keyboard.svelte";
  import * as states from "#lib/site/examples/textarea/states.svelte";
  import * as variants from "#lib/site/examples/textarea/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="textarea" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a textarea for text that may run to more than one line: a note, a
      message, a description. For one line, use an input. Put it in a field, so
      its label, description and error are wired to it.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give every textarea a visible label.</li>
    <li>
      Say in the description what the text is for, or what format it takes.
    </li>
    <li>Let it grow with its text.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a textarea for a single word or a number.</li>
    <li>Fix its height so the text hides behind a scroll.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>A native <code>&lt;textarea&gt;</code> with a visible label.</li>
    <li>
      Inside a <code>Field</code>, it takes its <code>id</code>,
      <code>aria-describedby</code> and <code>aria-invalid</code> from the field.
    </li>
    <li>Invalid is a solid red border and the error in words.</li>
  {/snippet}
</Component>
