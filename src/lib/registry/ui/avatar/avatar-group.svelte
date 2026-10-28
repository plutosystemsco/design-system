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

<div
  bind:this={ref}
  data-slot="avatar-group"
  class={cn(
    "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:border-(length:--focus-width) *:data-[slot=avatar]:border-background",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
