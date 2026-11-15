<script lang="ts">
  import * as keyboard from "#lib/site/examples/toggle/keyboard.svelte";
  import * as states from "#lib/site/examples/toggle/states.svelte";
  import * as variants from "#lib/site/examples/toggle/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="toggle" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a toggle for a setting that is on or off and takes effect at once,
      such as bold in an editor. For a row of them, use a toggle group. For a
      setting saved with a form, use a checkbox or a switch.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Keep the label the same in both states: "Bold", pressed or not.</li>
    <li>Give an icon-only toggle an <code>aria-label</code>.</li>
  {/snippet}
  {#snippet donts()}
    <li>Change the label to say the state. The pressed state says it.</li>
    <li>Use a toggle to start an action. Use a button.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A native button with <code>aria-pressed</code>; Space and Enter flip it.
    </li>
    <li>
      Pressed is inverted, not a tint: 16.84:1 against the page in light and
      16.16:1 in dark, where a muted fill would be 1.1:1 and 1.25:1. The icon or
      the text carries the meaning; colour only confirms the state.
    </li>
    <li>
      An icon-only toggle needs an <code>aria-label</code>; its icon is
      <code>aria-hidden</code>. 48 px tall by default, 32 px at <code>sm</code>,
      never under the 24 px target.
    </li>
    <li>A toggle is never invalid, so it has no invalid style.</li>
  {/snippet}
</Component>
