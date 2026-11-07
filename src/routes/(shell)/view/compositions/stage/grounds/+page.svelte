<script lang="ts">
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Stage, type StageGround } from "#lib/registry/ui/stage";

  // 012 decision 2: one stage per ground. On a field the text takes the
  // field's roles; nothing here is a control, since a control never sits on
  // a field directly.
  const GROUNDS: { ground: StageGround; name: string }[] = [
    { ground: "canvas", name: "The canvas" },
    { ground: "field-1", name: "Blue, field-1" },
    { ground: "field-2", name: "Red, field-2" },
    { ground: "field-3", name: "Yellow, field-3" },
    { ground: "field-4", name: "Green, field-4" },
  ];
</script>

<CompositionView title="A stage on each ground">
  <h1 class="sr-only">A stage on each ground</h1>
  {#each GROUNDS as { ground, name } (ground)}
    <Stage {ground} labelledby="ground-{ground}">
      <div class="grid gap-4 py-16">
        <h2 id="ground-{ground}" class="type-section">{name}</h2>
        <p class="max-w-prose text-muted-foreground">
          A stage follows the page's theme. Its ground is the canvas or one of
          the four colour fields; on a field, headings, prose and figures take
          the field's own roles.
        </p>
      </div>
    </Stage>
  {/each}
</CompositionView>
