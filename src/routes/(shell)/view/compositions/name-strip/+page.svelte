<script lang="ts">
  import { NAMES } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { NameStrip } from "#lib/registry/ui/name-strip";
  import { Stage } from "#lib/registry/ui/stage";
</script>

<CompositionView title="Name strip">
  <h1 class="sr-only">Name strip</h1>
  <Stage label="On a stage">
    <div class="py-16">
      <NameStrip label="The apps on the layer" names={NAMES} />
    </div>
  </Stage>
  <div class="mx-auto max-w-7xl px-6 py-16">
    <NameStrip label="The apps on the layer, on the page" names={NAMES} />
  </div>
</CompositionView>
