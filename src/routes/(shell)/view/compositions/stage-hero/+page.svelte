<script lang="ts">
  import { after, PATHS, SEARCH } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { NameStrip } from "#lib/registry/ui/name-strip";
  import { Stage } from "#lib/registry/ui/stage";
  import { StageCard } from "#lib/registry/ui/stage-card";
  import { StageHero } from "#lib/registry/ui/stage-hero";
</script>

<!--
  Alone in its view, so its title is the page's h1. The words on glass, the
  card on the blue field (012 decision 3).
-->
<CompositionView title="Work runs on data.">
  <Stage>
    <StageHero
      eyebrow="pluto workspace"
      title="Work runs on data."
      description="Docs, sheets, mail and search on one governed data layer. People and agents search the same files, under the same permissions."
      actions={[
        { label: "Read the docs", href: "/" },
        { label: "See the source", href: "/" },
      ]}
    >
      {#snippet object()}
        <StageCard
          title="search.py"
          code={SEARCH}
          language="python"
          run={() => after(PATHS)}
        />
      {/snippet}
      {#snippet strip()}
        <NameStrip
          label="The apps on the layer"
          names={["docs", "sheets", "mail", "search"]}
        />
      {/snippet}
    </StageHero>
  </Stage>
</CompositionView>
