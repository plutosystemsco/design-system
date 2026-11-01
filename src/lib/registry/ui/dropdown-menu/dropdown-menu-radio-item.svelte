<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import { cn, type WithoutChild } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    children: childrenProp,
    closeOnSelect = false,
    ...restProps
  }: WithoutChild<DropdownMenuPrimitive.RadioItemProps> = $props();
</script>

<!-- As the checkbox item, with the same check: a dot would be round. -->
<DropdownMenuPrimitive.RadioItem
  bind:ref
  {closeOnSelect}
  data-slot="dropdown-menu-radio-item"
  class={cn(
    "relative flex h-8 cursor-default items-center gap-2 rounded pe-2 ps-8 text-sm select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
>
  {#snippet children({ checked })}
    <span
      class="pointer-events-none absolute start-2 flex items-center justify-center"
      data-slot="dropdown-menu-radio-item-indicator"
    >
      {#if checked}
        <Check aria-hidden="true" class="size-4" />
      {/if}
    </span>
    {@render childrenProp?.({ checked })}
  {/snippet}
</DropdownMenuPrimitive.RadioItem>
