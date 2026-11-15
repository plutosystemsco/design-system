<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A static block on the muted inset, shaped like what will load: a card or a row. It does not shimmer: nothing moves while a person reads.",
  };
</script>

<script lang="ts">
  import { Skeleton } from "#lib/registry/ui/skeleton";
</script>

<div class="grid max-w-md gap-12">
  <div class="grid w-full gap-3 rounded border border-border bg-card p-6">
    <Skeleton class="h-6 w-1/2" />
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-4 w-3/4" />
  </div>
  <div class="flex w-full items-center gap-4">
    <Skeleton class="size-12" />
    <div class="grid flex-1 gap-2">
      <Skeleton class="h-4 w-2/3" />
      <Skeleton class="h-4 w-1/3" />
    </div>
  </div>
</div>
