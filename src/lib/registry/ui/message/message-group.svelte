<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<!-- The column of a turn: header, content, footer. In an end-aligned turn it lines them up at the end. -->
<div
  bind:this={ref}
  data-slot="message-group"
  class={cn(
    "flex min-w-0 flex-1 flex-col gap-2 group-data-[align=end]/message:items-end",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
