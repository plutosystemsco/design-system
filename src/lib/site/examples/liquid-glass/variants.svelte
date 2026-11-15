<script lang="ts" module>
  export const meta = {
    title: "On the canvas and on a field",
    intro:
      "The glass utility on any element: a frosted tint, a lit edge and the 8 px case radius. The pointerLight attachment lights the edge where the pointer moves, and the light goes out 600 ms after the last move. Inside, the text takes the theme's own roles, even on a field.",
  };
</script>

<script lang="ts">
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
</script>

<div data-mode="expressive" class="grid gap-8 lg:grid-cols-2">
  <div class="grid content-start gap-2">
    <div
      data-testid="glass"
      class="glass grid w-full gap-1 p-6"
      {@attach pointerLight}
    >
      <p class="font-heading font-bold">Work runs on data.</p>
      <p class="text-sm text-muted-foreground">
        Move the pointer over this panel: its edge lights where you are.
      </p>
      <a
        href="/components/pluto-theme/"
        class="w-fit text-sm text-primary underline">The theme's tokens</a
      >
    </div>
    <p class="text-xs text-muted-foreground">Glass on the canvas</p>
  </div>
  <div class="grid content-start gap-2">
    <section
      aria-labelledby="glass-field-heading"
      class="field-1 grid w-full gap-4 rounded p-6"
    >
      <h4
        id="glass-field-heading"
        class="font-heading text-2xl font-bold text-foreground"
      >
        One governed layer
      </h4>
      <div
        data-testid="glass-over-field"
        class="glass grid gap-1 p-4"
        {@attach pointerLight}
      >
        <p class="font-heading font-bold">Glass on the blue field</p>
        <p class="text-sm text-muted-foreground">
          The field's legend stops at the glass: its text is the theme's.
        </p>
        <a
          href="/components/pluto-theme/#fields"
          class="w-fit text-sm text-primary underline">The colour fields</a
        >
      </div>
    </section>
    <p class="text-xs text-muted-foreground">Glass on field-1</p>
  </div>
</div>
