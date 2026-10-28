<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { getFieldSetContext } from "./field-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    variant = "legend",
    id,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
    variant?: "legend" | "label";
  } = $props();

  // Record this legend's id in the set, before the group control renders, so
  // the control can name itself by it (server and browser alike).
  const set = getFieldSetContext();
  const legendId = $derived(id ?? set?.legendId);
  set?.registerLegend(() => legendId);
</script>

<legend
  bind:this={ref}
  data-slot="field-legend"
  data-variant={variant}
  id={legendId}
  class={cn("mb-3 text-base font-medium", className)}
  {...restProps}
>
  {@render children?.()}
</legend>
