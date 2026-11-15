<script lang="ts">
  import * as keyboard from "#lib/site/examples/radio-group/keyboard.svelte";
  import * as states from "#lib/site/examples/radio-group/states.svelte";
  import * as variants from "#lib/site/examples/radio-group/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="radio-group" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a radio group to choose one of a few options, all shown at once. For a
      long list, use a native select. For choices that can be combined, use
      checkboxes.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Put the group in a set, named by its legend.</li>
    <li>Choose a sensible default where there is one.</li>
    <li>Keep the options short, and in a clear order.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a single radio on its own. Use a checkbox.</li>
    <li>Use a radio group for more than about seven options.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>radiogroup</code> of <code>radio</code> items with one stop; the arrow
      keys move focus and choose.
    </li>
    <li>
      Inside a <code>FieldSet</code>, the legend names the group, and the group
      is wired to its description and error.
    </li>
    <li>The checked radio holds a blue dot and a blue ring.</li>
  {/snippet}
</Component>
