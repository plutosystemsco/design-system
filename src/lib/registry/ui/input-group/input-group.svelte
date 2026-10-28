<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...props
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<!--
  The group takes the input recipe and draws the focus indicator when its text
  control has focus; the control inside drops its own (decision 8).
-->
<div
  bind:this={ref}
  data-slot="input-group"
  role="group"
  class={cn(
    "group/input-group relative flex h-12 w-full min-w-0 items-center rounded border border-input bg-card transition-[color,background-color,border-color]",
    "has-[[data-slot=input-group-control]:focus-visible]:focus-ring has-[[aria-invalid=true]]:border-destructive",
    "has-[>textarea]:h-auto has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
    "has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-2 has-[>[data-align=inline-start]]:[&>input]:pl-2",
    className,
  )}
  {...props}
>
  {@render children?.()}
</div>
