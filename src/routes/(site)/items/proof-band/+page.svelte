<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="proof-band">
  {#snippet usage()}
    <li>
      Two to four <code>items</code>, each a <code>value</code> with an optional
      <code>prefix</code> and <code>suffix</code>, and the
      <code>label</code> that says what it counts. Every number must be true where
      it is shown.
    </li>
    <li>
      A <code>title</code> names it; without one, pass <code>label</code>.
    </li>
    <li>
      It has no ground of its own and holds no control, so it may sit on a
      colour field, where its numbers and labels take the field's roles.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The prerendered page shows the final values. Out of sight at load, the
      digits wait at 0 and count up once, over 700 ms, when the band first comes
      into view; in view at load, nothing moves. Under reduced motion the values
      land at once.
    </li>
    <li>
      The moving digits are hidden from assistive technology; a visually hidden
      copy holds each final value from the first render.
    </li>
  {/snippet}
</CompositionPage>
