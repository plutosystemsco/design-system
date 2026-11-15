<script lang="ts">
  import * as states from "#lib/site/examples/empty/states.svelte";
  import * as variants from "#lib/site/examples/empty/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="empty" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use an empty state where a list, a table or a search has nothing to show.
      It says what is empty and what to do next.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Say in the heading what is empty.</li>
    <li>Offer the one action that fills it.</li>
    <li>Keep the description to one sentence.</li>
  {/snippet}
  {#snippet donts()}
    <li>Blame the reader: "You have no projects".</li>
    <li>Offer several competing actions.</li>
    <li>Use an empty state for an error. Use an alert.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>EmptyTitle</code> renders a heading, <code>h2</code> by default,
      with a <code>level</code> prop, so a page state's title can be its
      <code>h1</code>.
    </li>
    <li>The icon is decorative; the heading says what is empty.</li>
  {/snippet}
</Component>
