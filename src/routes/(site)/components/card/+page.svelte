<script lang="ts">
  import * as states from "#lib/site/examples/card/states.svelte";
  import * as variants from "#lib/site/examples/card/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="card" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a card to group one thing's facts and actions on a raised surface: a
      run, a project, a plan. Use the small size where cards sit in a dense
      grid.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give every card a title that names its one subject.</li>
    <li>Set the title's level to fit the page's outline.</li>
    <li>Put the card's main action in its footer.</li>
  {/snippet}
  {#snippet donts()}
    <li>Put a card inside a card.</li>
    <li>Use a card only to draw a border around unrelated content.</li>
    <li>Make the whole card a link and also put buttons in it.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>CardTitle</code> renders a heading, <code>h2</code> by default, with
      a <code>level</code> prop from 1 to 6.
    </li>
    <li>The card is a plain container; its actions are ordinary buttons.</li>
  {/snippet}
</Component>
