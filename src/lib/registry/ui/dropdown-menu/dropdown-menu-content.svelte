<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";
  import DropdownMenuPortal from "./dropdown-menu-portal.svelte";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    sideOffset = 4,
    align = "start",
    label,
    portalProps,
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.ContentProps & {
    /** The menu's name when no group heading names it; the trigger's text otherwise names it to a reader. */
    label?: string;
    portalProps?: WithoutChildrenOrChild<
      ComponentProps<typeof DropdownMenuPortal>
    >;
  } = $props();
</script>

<!--
  The popover's chrome: raised by elevation alone, so no
  border and no halo; 256 px wide at least; 4 px of padding, so an item's 8 px
  radius sits inside the panel's. It fades in and out over the micro budget
  and scrolls past the height Floating UI leaves it. bits-ui renders
  role="menu" and moves focus by the arrow keys; this item adds no key handling.

  The menu renders in place, beside its trigger, not in a portal at the end
  of body: a menu is no dialog, and content portalled out of every landmark
  fails axe's region rule, which exempts dialogs alone; in place it reads in
  order after its trigger. Floating UI positions it fixed either way. Pass
  portalProps to portal it, where an ancestor would clip or transform it.
-->
<DropdownMenuPortal disabled {...portalProps}>
  <DropdownMenuPrimitive.Content
    bind:ref
    data-slot="dropdown-menu-content"
    aria-label={label}
    {sideOffset}
    {align}
    class={cn(
      "z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-3xs origin-(--bits-dropdown-menu-content-transform-origin) overflow-y-auto rounded bg-popover p-1 text-popover-foreground shadow-elevation scrollbar data-open:animate-enter data-closed:animate-exit",
      className,
    )}
    {...restProps}
  />
</DropdownMenuPortal>
