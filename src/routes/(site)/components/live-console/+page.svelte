<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="live-console">
  {#snippet when()}
    <p>
      Use a live console to let a reader try a product on its home page. It
      holds tabs of commands, a Run button, meters and output lines.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Pass a <code>title</code>, one to four <code>examples</code> (a tab's
        label and its command) and <code>run</code>, a function that resolves to
        the meters and the lines.
      </li>
      <li>
        The run functions in these views are samples that wait 900 ms; an app
        replaces them with a call to its own server. A tab change clears the
        output.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Give one to four examples, each a short label and its command.</li>
    <li>Replace the sample run function with a call to your own server.</li>
    <li>
      Set it on a colour field panel, as the flat card it is, for a coloured
      moment.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Rely on output surviving a tab change. A tab change clears it.</li>
    <li>Show meters your server did not measure.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      It is productive inside the stage: its tabs and buttons keep 8 px corners
      and their productive sizes. A flat card (<code>surface-plain</code>), so
      it may sit on a colour field panel and keep the theme's roles; while a run
      works an edge in the primary shows inside it.
    </li>
    <li>
      Each meter is named by its label and writes its numbers beside it; it
      fills from 0 to its result over 700 ms, at once under reduced motion.
    </li>
    <li>
      The tabs move by the arrow keys; each command is a stop that scrolls. The
      outcome is said in a polite status, as the stage card says it.
    </li>
  {/snippet}
</CompositionPage>
