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

<!-- A line under the turn (a time, a cost), in the same mono eyebrow, not a heading. -->
<div
  bind:this={ref}
  data-slot="message-footer"
  class={cn(
    "flex min-w-0 max-w-full items-center gap-2 font-mono text-xs tracking-eyebrow text-muted-foreground lowercase",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
