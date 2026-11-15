<script lang="ts">
  import * as clearspace from "#lib/site/examples/four-dot/clearspace.svelte";
  import * as geometry from "#lib/site/examples/four-dot/geometry.svelte";
  import * as lockup from "#lib/site/examples/four-dot/lockup.svelte";
  import * as mark from "#lib/site/examples/four-dot/mark.svelte";
  import * as mono from "#lib/site/examples/four-dot/mono.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="four-dot"
  examples={{ mark, lockup, mono, clearspace, geometry }}
>
  {#snippet when()}
    <p>
      Use the lockup, the mark beside the wordmark, to sign a page or a product:
      in a header, a footer, a title. Use the mark alone where the lockup would
      fall below 20 px. Both take their size from the text around them. In the
      dark theme the dots turn paper-white on product screens. An expressive
      page keeps the four colours, lifted for the dark.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Size the mark and the lockup with a text size class.</li>
    <li>Keep clear space of one dot-pair height on every side.</li>
    <li>Give a mark that stands alone in a link a label.</li>
    <li>Use mono tone to set the mark in the colour of the text around it.</li>
  {/snippet}
  {#snippet donts()}
    <li>Change the dots' order or colours.</li>
    <li>Set a lockup below 20 px. Use the mark alone.</li>
    <li>Put the four-colour mark directly on a colour field.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Without a label the mark is decoration: it carries
      <code>aria-hidden="true"</code>.
    </li>
    <li>
      With a label the mark is <code>role="img"</code>, named by the label. Use
      it when the mark stands alone, as in a link.
    </li>
    <li>
      With an <code>href</code>, the lockup is a link named "Pluto Systems". Its
      <code>label</code> sets another name, which must contain the visible word.
    </li>
    <li>
      Set <code>entrance</code> on one mark per page. Under reduced motion the mark
      shows composed from the first frame.
    </li>
  {/snippet}
</Component>
