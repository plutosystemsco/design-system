<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="cta-band">
  {#snippet usage()}
    <li>
      A <code>title</code>, an optional <code>description</code> and one or two
      <code>actions</code>. It has no ground of its own: place it on the canvas,
      never on a colour field, since its actions are controls.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A section named by its heading, an <code>h2</code> by default (<code
        >headingLevel={3}</code
      > beneath another section's).
    </li>
    <li>
      Its actions are links, 52 px tall, with the 8 px case radius on any
      ground.
    </li>
  {/snippet}
</CompositionPage>
