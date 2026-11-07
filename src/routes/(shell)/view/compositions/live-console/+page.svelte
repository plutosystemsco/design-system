<script lang="ts">
  import { after, EXAMPLES, RESULT } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { LiveConsole } from "#lib/registry/ui/live-console";
  import { Stage } from "#lib/registry/ui/stage";
</script>

<CompositionView title="Live console">
  <h1 class="sr-only">Live console</h1>
  <Stage>
    <div class="mx-auto max-w-3xl py-16">
      <LiveConsole
        title="Try the layer"
        examples={EXAMPLES}
        language="python"
        run={() => after(RESULT)}
      />
    </div>
  </Stage>
</CompositionView>
