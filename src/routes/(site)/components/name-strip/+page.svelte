<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="name-strip">
  {#snippet when()}
    <p>
      Use a name strip to list a few short names in one row, such as the apps on
      a platform, under a label that says what they are.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        A <code>label</code> that says what the names are, and the
        <code>names</code>. Every name must be true where it is shown.
      </li>
      <li>
        It holds no control, so it may sit on a colour field, in the field's
        roles.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Give it a <code>label</code> that says what the names are.</li>
    <li>Keep every name true where it is shown.</li>
    <li>
      Place it in a stage hero's <code>strip</code>, or on a colour field.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Make the names links. It holds no control.</li>
    <li>Use it for long text. The names are short, in mono.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A list named by <code>label</code>, so a reader hears what the names are
      and how many.
    </li>
    <li>Mono, muted; the row wraps on a phone.</li>
  {/snippet}
</CompositionPage>
