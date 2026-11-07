<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="live-console">
  {#snippet usage()}
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
