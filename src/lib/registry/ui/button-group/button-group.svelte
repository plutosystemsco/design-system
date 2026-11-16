<script lang="ts" module>
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  /** The group's look: joined edge to edge, or spaced in a row. */
  export type ButtonGroupVariant = "attached" | "spaced";
  /** The direction the buttons run. */
  export type ButtonGroupOrientation = "horizontal" | "vertical";

  export type ButtonGroupProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "class" | "children"
  > & {
    /** Attached joins the buttons edge to edge, for a few related actions of equal weight; give it secondary buttons. Spaced sets them in a row with a gap that wraps, and stacks them below 640 px, for a form's actions. */
    variant?: "attached" | "spaced";
    /** The direction the buttons run. */
    orientation?: "horizontal" | "vertical";
    /** What the buttons are for, such as "Clipboard". Or name the group with `aria-labelledby`. Without a name, the grouping is only visual. */
    "aria-label"?: string;
    /** Classes for the group. */
    class?: string;
    /** The group, bound. */
    ref?: HTMLDivElement | null;
    /** The buttons: `Button`s, or a `DropdownMenu.Trigger` drawn with `buttonVariants`, each a direct child. */
    children?: Snippet;
  };

  // Attached: the group styles its direct children, whatever their slot.
  // Each child after the first drops its start border, so neighbours share
  // one solid edge, and each loses its inner corners. A child with keyboard
  // focus is lifted above its neighbours, so the next button never covers
  // what marks the focus.
  const LOOK: Record<
    ButtonGroupVariant,
    Record<ButtonGroupOrientation, string>
  > = {
    attached: {
      horizontal:
        "w-fit *:not-first:rounded-s-none *:not-first:border-s-0 *:not-last:rounded-e-none *:focus-visible:relative *:focus-visible:z-10",
      vertical:
        "w-fit flex-col *:not-first:rounded-t-none *:not-first:border-t-0 *:not-last:rounded-b-none *:focus-visible:relative *:focus-visible:z-10",
    },
    spaced: {
      horizontal: "flex-col gap-2 sm:flex-row sm:flex-wrap",
      vertical: "flex-col gap-2",
    },
  };
</script>

<script lang="ts">
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    variant = "attached",
    orientation = "horizontal",
    children,
    ...restProps
  }: ButtonGroupProps = $props();
</script>

<!--
  A named group of related buttons. Each button is its own Tab stop: no
  arrow keys move between them, as a toolbar's would. Attached, for a few
  secondary buttons and a menu trigger; spaced, for a form's actions, at
  most one of them primary and first.
-->
<div
  bind:this={ref}
  data-slot="button-group"
  data-variant={variant}
  data-orientation={orientation}
  role="group"
  class={cn("flex", LOOK[variant][orientation], className)}
  {...restProps}
>
  {@render children?.()}
</div>
