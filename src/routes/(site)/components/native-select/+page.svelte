<script lang="ts">
  import * as keyboard from "#lib/site/examples/native-select/keyboard.svelte";
  import * as states from "#lib/site/examples/native-select/states.svelte";
  import * as variants from "#lib/site/examples/native-select/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="native-select" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a native select to choose one option from a list in a form. The
      browser draws the open list, so it works the same way as every other
      select on the platform. Put it in a field, so its label, description and
      error are wired to it.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Start with an empty option that says what to choose.</li>
    <li>Group long lists with <code>OptGroup</code>.</li>
    <li>Give it a visible label.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use it for two or three options. Use radios, so all of them show.</li>
    <li>Use it for actions. Use a dropdown menu.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A native <code>&lt;select&gt;</code>: the arrow keys, typing and the
      platform's own list all work.
    </li>
    <li>
      Inside a <code>Field</code>, it takes its <code>id</code>,
      <code>aria-describedby</code> and <code>aria-invalid</code> from the field.
    </li>
    <li>The caret is decorative.</li>
  {/snippet}
</Component>
