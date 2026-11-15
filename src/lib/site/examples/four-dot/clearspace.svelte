<script lang="ts" module>
  export const meta = {
    title: "Clearspace and minimum size",
    intro:
      "Keep one dot-pair height clear on every side. Below 20 px of lockup height, use the mark alone.",
  };
</script>

<script lang="ts">
  import { FourDot, Lockup } from "#lib/registry/ui/four-dot";
</script>

<div class="flex flex-wrap items-end gap-12">
  <div class="flex flex-col items-start gap-2">
    <span
      class="inline-block text-5xl outline-1 outline-input outline-dashed"
      style="padding: calc(var(--mark-dot) * 2 + var(--mark-gap))"
    >
      <Lockup />
    </span>
    <span class="text-xs text-muted-foreground"
      >Clearspace: one dot-pair height</span
    >
  </div>
  <div class="flex flex-col items-start gap-2">
    <span style="font-size: 20px"><Lockup /></span>
    <span class="text-xs text-muted-foreground">20 px: the smallest lockup</span
    >
  </div>
  <div class="flex flex-col items-start gap-2">
    <span class="text-base"><FourDot /></span>
    <span class="text-xs text-muted-foreground">Below it: the mark alone</span>
  </div>
</div>
