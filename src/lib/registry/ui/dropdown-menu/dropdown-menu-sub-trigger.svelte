<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    children,
    ...restProps
  }: DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean;
  } = $props();
</script>

<!-- A row that opens a submenu on Right; its caret turns under rtl. -->
<DropdownMenuPrimitive.SubTrigger
  bind:ref
  data-slot="dropdown-menu-sub-trigger"
  data-inset={inset ? "" : undefined}
  class={cn(
    "flex h-8 cursor-default items-center gap-2 rounded px-2 text-sm select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  <CaretRight aria-hidden="true" class="ms-auto size-4 rtl:rotate-180" />
</DropdownMenuPrimitive.SubTrigger>
