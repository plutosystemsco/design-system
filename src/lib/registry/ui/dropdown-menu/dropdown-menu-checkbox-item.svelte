<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import Minus from "phosphor-svelte/lib/Minus";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    children: childrenProp,
    closeOnSelect = false,
    ...restProps
  }: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
    children?: Snippet;
  } = $props();
</script>

<!-- A 32 px row with its check at the start; aria-checked is bits-ui's. -->
<DropdownMenuPrimitive.CheckboxItem
  bind:ref
  {closeOnSelect}
  bind:checked
  bind:indeterminate
  data-slot="dropdown-menu-checkbox-item"
  class={cn(
    "relative flex h-8 cursor-default items-center gap-2 rounded pe-2 ps-8 text-sm select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
>
  {#snippet children({ checked, indeterminate })}
    <span
      class="pointer-events-none absolute start-2 flex items-center justify-center"
      data-slot="dropdown-menu-checkbox-item-indicator"
    >
      {#if indeterminate}
        <Minus aria-hidden="true" class="size-4" />
      {:else if checked}
        <Check aria-hidden="true" class="size-4" />
      {/if}
    </span>
    {@render childrenProp?.()}
  {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
