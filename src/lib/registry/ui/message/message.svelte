<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    align = "start",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** `end` reverses the row: a user turn sits at the end, its avatar outside. */
    align?: "start" | "end";
  } = $props();
</script>

<!-- One turn: a row of an avatar slot and a group (header, content, footer). -->
<div
  bind:this={ref}
  data-slot="message"
  data-align={align}
  class={cn(
    "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
