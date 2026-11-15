<script lang="ts">
  import * as keyboard from "#lib/site/examples/switch/keyboard.svelte";
  import * as states from "#lib/site/examples/switch/states.svelte";
  import * as variants from "#lib/site/examples/switch/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="switch" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a switch for a setting that is on or off and takes effect at once,
      such as notifications. For a choice that waits for a form to be sent, or a
      required consent, use a checkbox.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give it a visible label that names the setting.</li>
    <li>Apply the change as soon as it is flipped.</li>
    <li>Put the switch before its label, in a horizontal field.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a switch for a required consent.</li>
    <li>Change the label's words when the state changes.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>&lt;button role="switch"&gt;</code> with
      <code>aria-checked</code>. Space and Enter toggle it.
    </li>
    <li>On is told by the thumb's position as well as by colour.</li>
    <li>A switch always has a visible label; a <code>Field</code> wires it.</li>
    <li>
      Invalid is said in words only: the track has no border to turn red. A
      required consent is a checkbox, not a switch.
    </li>
  {/snippet}
</Component>
