<script lang="ts">
  import * as states from "#lib/site/examples/spinner/states.svelte";
  import * as variants from "#lib/site/examples/spinner/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="spinner" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a spinner on the one control whose action is running, such as a button
      that is signing in. For content that is loading, use a skeleton in its
      shape.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Put it inside the busy control, next to words that say what is happening.
    </li>
    <li>Pass <code>label</code> when the spinner stands alone.</li>
  {/snippet}
  {#snippet donts()}
    <li>Show more than one spinner at a time.</li>
    <li>Cover a whole page with a spinner.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Decorative by default: <code>aria-hidden="true"</code>, because the busy
      control around it has its own name.
    </li>
    <li>
      With <code>label</code>, it renders a <code>role="status"</code> region holding
      the label as visually hidden text, announced when the spinner is inserted.
    </li>
    <li>It colours itself with the text around it.</li>
  {/snippet}
</Component>
