<script lang="ts">
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Button } from "#lib/registry/ui/button";
  import { Stage } from "#lib/registry/ui/stage";
</script>

<CompositionView title="A stage">
  <Stage labelledby="stage-title">
    <div class="grid min-h-svh content-center gap-6 py-16">
      <h1 id="stage-title" class="text-5xl font-bold tracking-display">
        A stage
      </h1>
      <p class="max-w-prose text-muted-foreground">
        A full-bleed expressive section on the page's canvas, in the page's
        theme. Its ground may be a colour field instead; the Grounds view shows
        all five. The mode is expressive: this button keeps the 8 px case
        radius.
      </p>
      <div><Button href="/">Go to the home page</Button></div>
    </div>
  </Stage>
</CompositionView>
