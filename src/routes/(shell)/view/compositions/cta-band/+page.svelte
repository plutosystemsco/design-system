<script lang="ts">
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { CtaBand } from "#lib/registry/ui/cta-band";
</script>

<CompositionView title="Call to action band" padded>
  <h1 class="sr-only">Call to action band</h1>
  <CtaBand
    title="Start with the data you already have."
    description="Mount the database you run today; people and agents search it under the same permissions."
    actions={[
      { label: "Read the docs", href: "/" },
      { label: "See the source", href: "/" },
    ]}
  />
</CompositionView>
