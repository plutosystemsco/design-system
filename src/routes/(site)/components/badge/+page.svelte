<script lang="ts">
  import * as states from "#lib/site/examples/badge/states.svelte";
  import * as variants from "#lib/site/examples/badge/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="badge" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a badge to label the state of a thing in one or two words: a run that
      passed, failed or is queued. It is a label, not an action.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Say the state in the badge's text.</li>
    <li>Keep the text to one or two words.</li>
    <li>Use the same word for the same state everywhere.</li>
  {/snippet}
  {#snippet donts()}
    <li>Make a badge a link or a button.</li>
    <li>Tell the state by colour alone.</li>
    <li>Use a badge for a removable filter. Use a small secondary button.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>&lt;span&gt;</code>: its text says the state, never its colour
      alone.
    </li>
    <li>It is never a link: a removable filter is a small secondary button.</li>
  {/snippet}
</Component>
