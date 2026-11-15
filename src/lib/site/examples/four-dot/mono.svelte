<script lang="ts" module>
  export const meta = {
    title: "Mono tone",
    intro:
      "In mono tone every dot takes the current text colour. Beside it, the brand tone, which is decoration unless it has a label.",
  };
</script>

<script lang="ts">
  import { FourDot } from "#lib/registry/ui/four-dot";
</script>

<div class="flex flex-wrap items-end gap-12">
  <div class="flex flex-col items-start gap-2">
    <p class="text-5xl text-primary">
      <FourDot tone="mono" data-testid="mono" />
    </p>
    <span class="text-xs text-muted-foreground">Mono, in primary</span>
  </div>
  <div class="flex flex-col items-start gap-2">
    <p class="text-5xl" data-testid="decorative-wrap">
      <FourDot data-testid="decorative" />
    </p>
    <span class="text-xs text-muted-foreground">Brand, decorative</span>
  </div>
</div>
