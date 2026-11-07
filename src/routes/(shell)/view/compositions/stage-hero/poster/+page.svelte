<script lang="ts">
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { NameStrip } from "#lib/registry/ui/name-strip";
  import { Stage } from "#lib/registry/ui/stage";
  import { StageHero } from "#lib/registry/ui/stage-hero";
</script>

<!--
  The poster title, for launches only (K3). Without an object there is no
  field and no glass: the words sit on the canvas stage (012 decision 3).
-->
<CompositionView title="Work runs on data.">
  <Stage>
    <StageHero
      poster
      eyebrow="pluto workspace"
      title="Work runs on data."
      description="Docs, sheets, mail and search on one governed data layer. People and agents search the same files, under the same permissions."
      actions={[
        { label: "Read the docs", href: "/" },
        { label: "See the source", href: "/" },
      ]}
    >
      {#snippet strip()}
        <NameStrip
          label="The apps on the layer"
          names={["docs", "sheets", "mail", "search"]}
        />
      {/snippet}
    </StageHero>
  </Stage>
</CompositionView>
