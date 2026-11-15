<script lang="ts">
  import * as states from "#lib/site/examples/use-highlighted-code/states.svelte";
  import * as variants from "#lib/site/examples/use-highlighted-code/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="use-highlighted-code" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use the hook to highlight code that arrives in the browser, such as a
      reply that streams into a chat. Most of the time you do not call it: a
      code block given <code>code</code> and a <code>language</code> calls it
      for you. Code known when the page is built is better highlighted then,
      with <code>highlightCode</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Pass functions, so the hook follows the code as it grows.</li>
    <li>Render each line with <code>CodeBlock.Line</code>.</li>
    <li>Cap the height of a block that streams.</li>
  {/snippet}
  {#snippet donts()}
    <li>Wait for the highlighter before showing the code.</li>
    <li>Use the hook for code a load function could highlight.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The hook changes nothing a screen reader hears: tokens are
      <code>span</code>s with a class, and a line's text is the code. Line
      numbers, when shown, are a counter that is not read.
    </li>
    <li>
      Colour arrives after the first paint, so code is readable before the
      highlighter loads and if it never does. The highlight is never the only
      sign of anything.
    </li>
    <li>
      Streaming code should sit in a block whose height is capped by the
      consuming app, so the page does not grow under the reader; a chat pane is
      the case this hook serves.
    </li>
  {/snippet}
</Component>
