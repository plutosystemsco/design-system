<script lang="ts">
  import * as states from "#lib/site/examples/label/states.svelte";
  import * as variants from "#lib/site/examples/label/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="label" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a label to name a form control in words. Every input, textarea,
      select, checkbox and switch has one. Inside a field, use the field's own
      label, which is wired for you.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Write it in sentence case: "Email address".</li>
    <li>Link it to its control with <code>for</code>.</li>
    <li>Keep it visible, above an input or beside a checkbox.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a placeholder in place of a label.</li>
    <li>End it with a colon.</li>
    <li>Leave a control with no visible name.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A native <code>&lt;label&gt;</code>, linked to its control by
      <code>for</code>.
    </li>
    <li>A placeholder is not a label: every control keeps a visible one.</li>
    <li>A disabled peer dims the label.</li>
  {/snippet}
</Component>
