<script lang="ts">
  import {
    after,
    INSTALL,
    PATHS,
    SEARCH,
  } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Stage } from "#lib/registry/ui/stage";
  import { StageCard } from "#lib/registry/ui/stage-card";
</script>

<CompositionView title="Stage cards">
  <h1 class="sr-only">Stage cards</h1>
  <Stage label="Stage cards">
    <div class="mx-auto grid max-w-2xl gap-6 py-16">
      <StageCard title="shell" code={INSTALL} language="bash" />
      <StageCard
        title="search.py"
        code={SEARCH}
        language="python"
        run={() => after(PATHS)}
      />
    </div>
  </Stage>
</CompositionView>
