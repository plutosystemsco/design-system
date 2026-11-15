<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="cta-band">
  {#snippet when()}
    <p>
      Use a call to action band to close an expressive page. It holds a heading,
      an optional sentence, and one or two actions.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        A <code>title</code>, an optional <code>description</code> and one or
        two
        <code>actions</code>. It has no ground of its own: place it on the
        canvas, never on a colour field, since its actions are controls.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Place it on the canvas.</li>
    <li>Name each action by where it goes.</li>
    <li>
      Pass <code>headingLevel={3}</code> beneath another section's heading.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Place it on a colour field. Its actions are controls.</li>
    <li>Use it for an action that runs code. Its actions are links.</li>
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
