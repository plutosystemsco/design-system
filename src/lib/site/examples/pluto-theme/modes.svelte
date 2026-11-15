<script lang="ts" module>
  export const meta = {
    title: "One button, two volumes",
    intro:
      "A button's corner reads --radius-action: one 8 px case radius in productive mode, in expressive mode and in a productive island inside it. Other surfaces take the same radius with rounded-action.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
</script>

<div class="flex flex-wrap items-start gap-12">
  <figure data-testid="mode-productive" data-mode="productive">
    <Button>Save changes</Button>
    <figcaption class="mt-2 text-xs text-muted-foreground">
      Productive
    </figcaption>
  </figure>
  <figure data-testid="mode-expressive" data-mode="expressive">
    <Button>Save changes</Button>
    <figcaption class="mt-2 text-xs text-muted-foreground">
      Expressive
    </figcaption>
  </figure>
  <div data-mode="expressive">
    <figure data-testid="mode-island" data-mode="productive">
      <Button>Save changes</Button>
      <figcaption class="mt-2 text-xs text-muted-foreground">
        Productive inside expressive
      </figcaption>
    </figure>
  </div>
</div>
