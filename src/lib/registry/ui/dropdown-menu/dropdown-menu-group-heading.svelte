<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    ...restProps
  }: ComponentProps<typeof DropdownMenuPrimitive.GroupHeading> & {
    inset?: boolean;
  } = $props();
</script>

<!--
  The one way to title a menu or a section of one: bits-ui names the group by
  it. Sentence case, a label to a reader, not mono furniture.
-->
<DropdownMenuPrimitive.GroupHeading
  bind:ref
  data-slot="dropdown-menu-group-heading"
  data-inset={inset ? "" : undefined}
  class={cn(
    "flex h-8 items-center px-2 text-xs font-medium text-muted-foreground data-inset:ps-8",
    className,
  )}
  {...restProps}
/>
