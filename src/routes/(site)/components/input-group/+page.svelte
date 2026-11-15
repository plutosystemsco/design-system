<script lang="ts">
  import * as keyboard from "#lib/site/examples/input-group/keyboard.svelte";
  import * as states from "#lib/site/examples/input-group/states.svelte";
  import * as variants from "#lib/site/examples/input-group/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="input-group" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use an input group when an input or a textarea needs something attached:
      an icon, a fixed suffix such as a domain, or a button that acts on the
      text. Use its password input for any password, so it can be shown.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Keep addons short: an icon, a word or one button.</li>
    <li>Give an icon-only button an <code>aria-label</code>.</li>
    <li>Pass <code>autocomplete</code> to a password input.</li>
  {/snippet}
  {#snippet donts()}
    <li>Put the only label in an addon. Keep a visible label.</li>
    <li>Put help text in an addon. Use the field's description.</li>
    <li>Block paste into a password.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The text control drops its own focus ring; the group draws it, around the
      addons too. A button inside keeps its own ring.
    </li>
    <li>
      Invalid turns the group's border red; the error is wired by the
      <code>Field</code>.
    </li>
    <li>
      The password toggle's visible word, Show or Hide, is in its name ("Show
      password"); it names the input with <code>aria-controls</code>. The input
      never blocks paste; <code>autocomplete</code> is the consuming app's.
    </li>
    <li>
      An icon you pass into an addon or a button is decoration: give it
      <code>aria-hidden="true"</code>, because phosphor icons render
      <code>role="img"</code> with no name.
    </li>
  {/snippet}
</Component>
