<script lang="ts" module>
  export const meta = {
    title: "Glass on the canvas",
    intro:
      "The glass utility with pointerLight: the same panel on the page's own ground. It carries foreground, muted-foreground and primary text only.",
  };
</script>

<script lang="ts">
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
</script>

<div data-mode="expressive">
  <div
    data-testid="glass-canvas"
    class="glass grid max-w-prose gap-1 p-6"
    {@attach pointerLight}
  >
    <p class="font-heading font-bold">Work runs on data.</p>
    <p class="text-sm text-muted-foreground">
      One governed layer under every product.
    </p>
    <a
      href="/components/liquid-glass/"
      class="w-fit text-sm text-primary underline">How the glass is drawn</a
    >
  </div>
</div>
