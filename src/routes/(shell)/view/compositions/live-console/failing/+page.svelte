<script lang="ts">
  import { EXAMPLES, fail } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import type { LiveConsoleResult } from "#lib/registry/ui/live-console";
  import { LiveConsole } from "#lib/registry/ui/live-console";
  import { Stage } from "#lib/registry/ui/stage";
</script>

<!-- 010 decision 7: a run that rejects, an error line and "Run failed.". -->
<CompositionView title="Live console whose run fails">
  <h1 class="sr-only">Live console whose run fails</h1>
  <Stage>
    <div class="mx-auto max-w-3xl py-16">
      <LiveConsole
        title="Try the layer"
        examples={EXAMPLES}
        language="python"
        run={() => fail<LiveConsoleResult>()}
      />
    </div>
  </Stage>
</CompositionView>
