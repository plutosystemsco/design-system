<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="name-strip">
  {#snippet usage()}
    <li>
      A <code>label</code> that says what the names are, and the
      <code>names</code>. Every name must be true where it is shown.
    </li>
    <li>
      It holds no control, so it may sit on a colour field, in the field's
      roles.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A list named by <code>label</code>, so a reader hears what the names are
      and how many.
    </li>
    <li>Mono, muted; the row wraps on a phone.</li>
  {/snippet}
</CompositionPage>
