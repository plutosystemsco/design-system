<script lang="ts">
  import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
  import { toggleVariants, type ToggleVariants } from "#lib/registry/ui/toggle";
  import { cn } from "#lib/utils";
  import { getToggleGroupCtx } from "./toggle-group.svelte";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    size,
    variant,
    ...restProps
  }: ToggleGroupPrimitive.ItemProps & ToggleVariants = $props();

  const ctx = getToggleGroupCtx();
</script>

<!--
  Items join: the inner radii go and only the row's ends are rounded; in the
  bordered variant, neighbours share one hairline. A selected item is
  inverted, as a pressed toggle is.
-->
<ToggleGroupPrimitive.Item
  bind:ref
  data-slot="toggle-group-item"
  data-variant={ctx.variant || variant}
  data-size={ctx.size || size}
  class={cn(
    toggleVariants({
      variant: ctx.variant || variant,
      size: ctx.size || size,
    }),
    "shrink-0 rounded-none focus-visible:z-10 group-data-horizontal/toggle-group:first:rounded-s group-data-horizontal/toggle-group:last:rounded-e group-data-vertical/toggle-group:first:rounded-t group-data-vertical/toggle-group:last:rounded-b group-data-horizontal/toggle-group:not-first:data-[variant=outline]:border-s-0 group-data-vertical/toggle-group:not-first:data-[variant=outline]:border-t-0",
    className,
  )}
  {value}
  {...restProps}
/>
