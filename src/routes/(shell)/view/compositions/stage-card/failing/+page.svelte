<script lang="ts">
  import { fail, SEARCH } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Stage } from "#lib/registry/ui/stage";
  import { StageCard } from "#lib/registry/ui/stage-card";
</script>

<!-- 010 decision 3: a run that rejects, its message shown and "Run failed." said. -->
<CompositionView title="Stage card whose run fails">
  <h1 class="sr-only">Stage card whose run fails</h1>
  <Stage label="Stage card whose run fails">
    <div class="mx-auto grid max-w-2xl gap-6 py-16">
      <StageCard
        title="search.py"
        code={SEARCH}
        language="python"
        run={() => fail<string[]>()}
      />
    </div>
  </Stage>
</CompositionView>
