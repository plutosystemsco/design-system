<script lang="ts">
  import * as states from "#lib/site/examples/marker/states.svelte";
  import * as variants from "#lib/site/examples/marker/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="marker" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a marker for a line in a conversation that is not a turn: a note that
      a run stopped, a divider between days, a sign that a reply is being
      written.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Keep a marker to one short line.</li>
    <li>Pair the spinner with a status item that says the words.</li>
    <li>Pass a role when the marker means one.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a marker for an error a reader must act on. Use an alert.</li>
    <li>Add a shimmer or other looping motion.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      No role by default. A marker inserted with its text is a region created
      with its words, which is not announced; inside a message log it is
      announced as an added node, and the state is told by the status item. Pass
      a role when the marker means one.
    </li>
    <li>The icon is hidden from assistive technology; the text is the line.</li>
    <li>
      No shimmer: a looping gradient is motion with no information. The one
      spinner is the busy sign.
    </li>
  {/snippet}
</Component>
