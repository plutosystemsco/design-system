<script lang="ts">
  import * as names from "#lib/site/examples/read-token/names.svelte";
  import * as tween from "#lib/site/examples/read-token/tween.svelte";
  import * as variants from "#lib/site/examples/read-token/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="read-token" examples={{ variants, tween, names }}>
  {#snippet when()}
    <p>
      Use it when script needs a token: a canvas's colours, a count-up's timing,
      a meter drawn by hand. It reads the same variables the stylesheet uses, so
      script and styles agree in every theme.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Tailwind's theme values, such as <code>text-xs</code>, are inlined into
        utilities and read empty.
      </li>
      <li>A misspelled name reads empty, with a warning in development.</li>
      <li>Call it in the browser. On the server it returns an empty string.</li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>
      Pass the element you paint for, so a <code>.dark</code> subtree reads its own
      values.
    </li>
    <li>Read again when the theme changes, and repaint.</li>
    <li>Cancel a running tween when its component goes.</li>
  {/snippet}
  {#snippet donts()}
    <li>Copy a token's value into script as a literal.</li>
    <li>Call it during server rendering and keep the empty result.</li>
    <li>Read a Tailwind theme value: it reads empty.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A canvas painted from the tokens is a drawing: give it
      <code>role="img"</code> and a label that names what it shows, as the example's
      do.
    </li>
    <li>
      Under reduced motion the duration tokens read 0, so a tween calls
      <code>onFrame</code> once with the final value and nothing moves.
    </li>
    <li>
      It adds no element, role or keyboard stop of its own; it is a function.
    </li>
  {/snippet}
</Component>
