<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="stage-card">
  {#snippet when()}
    <p>
      Use a stage card to show a short piece of real code on an expressive page,
      and to run it when you give it a run function. It is a flat card, so it
      may sit on a colour field.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Give it a <code>title</code> (a file name; not a heading), its
        <code>code</code> and <code>language</code>. With <code>run</code>, a
        function that resolves to the output's lines, it shows a Run button.
      </li>
      <li>
        <code>onstate</code> is told <code>"busy"</code>, <code>"done"</code> or
        <code>"error"</code>, so a parent can answer it.
      </li>
      <li>
        A flat card: it carries <code>surface-plain</code>, so on a colour field
        its text keeps the theme's own roles.
      </li>
      <li>
        The run functions in these views are samples that wait 900 ms; an app
        replaces them with a call to its own server.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Title it with a file name.</li>
    <li>Replace the sample run functions with a call to your own server.</li>
    <li>Pass <code>onstate</code> when a parent should answer a run.</li>
  {/snippet}
  {#snippet donts()}
    <li>Treat the title as a heading. It is not one.</li>
    <li>Show output that the code would not produce.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      While a run works the Run button shows its busy state and keeps focus, the
      card sets <code>data-busy</code> and the output list
      <code>aria-busy="true"</code>. The card answers with an edge in the
      primary drawn inside it, against its own ground, so it shows on any field;
      the button and the status carry the state too.
    </li>
    <li>
      The outcome is said in a polite status: "Ran. 2 lines." or "Run failed."
      It is cleared and set again on the next frame, so a second run is
      announced too. A rejection's message is shown as the one output line.
    </li>
    <li>
      The code is a stop of its own that scrolls by keyboard; the copy button is
      named "Copy code".
    </li>
  {/snippet}
</CompositionPage>
