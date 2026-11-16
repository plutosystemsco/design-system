<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";
  import DropdownMenuPortal from "./dropdown-menu-portal.svelte";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    align = "start",
    // The panel's 4 px of padding, so the first item lines up with its trigger.
    alignOffset = -4,
    portalProps,
    ...restProps
  }: DropdownMenuPrimitive.SubContentProps & {
    /**
     * Props for the `DropdownMenuPortal` that holds the submenu, which always
     * renders in a portal.
     */
    portalProps?: WithoutChildrenOrChild<
      ComponentProps<typeof DropdownMenuPortal>
    >;
    /** Kuiper lines the submenu up with the start of its trigger row. */
    align?: DropdownMenuPrimitive.SubContentProps["align"];
    /**
     * Kuiper's default offsets the panel's padding, so the submenu's first item
     * lines up with its trigger.
     */
    alignOffset?: DropdownMenuPrimitive.SubContentProps["alignOffset"];
  } = $props();
</script>

<!--
  The same chrome as the menu's content. A submenu stays in the portal: its
  parent menu is a scroll box that contains layout, so a child fixed inside
  it would be clipped.
-->
<DropdownMenuPortal {...portalProps}>
  <DropdownMenuPrimitive.SubContent
    bind:ref
    data-slot="dropdown-menu-sub-content"
    {align}
    {alignOffset}
    class={cn(
      "z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-3xs origin-(--bits-dropdown-menu-content-transform-origin) overflow-y-auto rounded bg-popover p-1 text-popover-foreground shadow-elevation scrollbar data-open:animate-enter data-closed:animate-exit",
      className,
    )}
    {...restProps}
  />
</DropdownMenuPortal>
