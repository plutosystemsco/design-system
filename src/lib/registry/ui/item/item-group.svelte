<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import { setContext } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

  // The group is a list, so each Item inside it renders role="listitem".
  setContext("kuiper:item-group", true);
  // Its key before 0.13.0 too, for an app's own code that reads it, until 0.14.0.
  setContext("pluto:item-group", true);
</script>

<div
  bind:this={ref}
  role="list"
  data-slot="item-group"
  class={cn(
    "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-3",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
