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
    escapeKeydownBehavior = "close",
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
    /**
     * Kuiper's default, `"close"`, has Escape close this submenu alone and
     * return focus to the item that opened it, as the WAI-ARIA menu pattern
     * asks. bits-ui's own default closes the whole menu.
     */
    escapeKeydownBehavior?: DropdownMenuPrimitive.SubContentProps["escapeKeydownBehavior"];
  } = $props();

  // Escape closes the submenu; focus goes back to its parent item, as
  // ArrowLeft's does. The app's handler runs first and may prevent both.
  function escape(e: KeyboardEvent) {
    restProps.onEscapeKeydown?.(e);
    if (e.defaultPrevented || !ref?.id) return;
    document
      .querySelector<HTMLElement>(`[aria-controls="${CSS.escape(ref.id)}"]`)
      ?.focus();
  }
</script>

<!--
  The same chrome as the menu's content. A submenu stays in the portal: its
  parent menu is a scroll box that contains layout, so a child fixed inside
  it would be clipped. Escape closes it alone: its layer, not the outermost
  menu's, takes the key.
-->
<DropdownMenuPortal {...portalProps}>
  <DropdownMenuPrimitive.SubContent
    bind:ref
    data-slot="dropdown-menu-sub-content"
    {align}
    {alignOffset}
    {escapeKeydownBehavior}
    class={cn(
      "z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-3xs origin-(--bits-dropdown-menu-content-transform-origin) overflow-y-auto rounded bg-popover p-1 text-popover-foreground shadow-elevation scrollbar data-open:animate-enter data-closed:animate-exit",
      className,
    )}
    {...restProps}
    onEscapeKeydown={escape}
  />
</DropdownMenuPortal>
