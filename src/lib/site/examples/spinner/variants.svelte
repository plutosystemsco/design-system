<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One spinner, sized by the text around it: two decorative ones, then one with a label. It turns only on the one control that is busy, and stops after one turn under reduced motion.",
  };
</script>

<script lang="ts">
  import { Spinner } from "#lib/registry/ui/spinner";
</script>

<div class="flex flex-wrap items-end gap-8">
  <span class="text-base"><Spinner /></span>
  <span class="text-2xl"><Spinner class="size-6" /></span>
  <span class="flex items-center gap-2 text-sm text-muted-foreground">
    <Spinner label="Loading runs" />
  </span>
</div>
