<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    variant = "default",
    ...restProps
  }: DropdownMenuPrimitive.ItemProps & {
    /** Starts the text where a checked item's does, 32 px in, so a mixed menu lines up. */
    inset?: boolean;
    /** A destructive item is red text on the same accent, with an icon or a telling word beside it: colour is never the only sign. */
    variant?: "default" | "destructive";
  } = $props();
</script>

<!--
  A 32 px row (the sm control height). Hover and focus are one state, on the
  accent inset: bits-ui focuses an item under the pointer and marks it
  highlighted. The global focus mark stays on the focused item above the
  accent, so keyboard focus is told from pointer hover.
-->
<DropdownMenuPrimitive.Item
  bind:ref
  data-slot="dropdown-menu-item"
  data-inset={inset ? "" : undefined}
  data-variant={variant}
  class={cn(
    "group/dropdown-menu-item relative flex h-8 cursor-default items-center gap-2 rounded px-2 text-sm select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 data-disabled:pointer-events-none data-disabled:opacity-50 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
/>
