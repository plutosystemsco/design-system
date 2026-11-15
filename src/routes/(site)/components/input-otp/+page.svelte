<script lang="ts">
  import * as keyboard from "#lib/site/examples/input-otp/keyboard.svelte";
  import * as states from "#lib/site/examples/input-otp/states.svelte";
  import * as variants from "#lib/site/examples/input-otp/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="input-otp" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a code input for a short code sent by email, text message or an
      authenticator app. It takes digits only, six by default. For any other
      text, use an input.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Say in the label where the code comes from.</li>
    <li>Let people paste the whole code.</li>
    <li>Say in the error what to do next: "We sent a new one."</li>
  {/snippet}
  {#snippet donts()}
    <li>Use it for a password or a PIN that must stay hidden.</li>
    <li>Submit the form before the last digit is in.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      One real <code>&lt;input&gt;</code> with
      <code>autocomplete="one-time-code"</code>,
      <code>inputmode="numeric"</code> and a digits-only pattern.
    </li>
    <li>
      A pasted code loses every non-digit first, so "123 456" or "123-456" fills
      all six cells.
    </li>
    <li>
      Inside a <code>Field</code>, its label names the real input, which carries
      the field's description, error and invalid state.
    </li>
    <li>Invalid turns every cell's border red; the error says why in words.</li>
    <li>The caret does not blink.</li>
  {/snippet}
</Component>
