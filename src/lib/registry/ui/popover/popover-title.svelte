<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { getPopoverContext } from "./popover-content.svelte";

  let {
    ref = $bindable(null),
    class: className,
    level = 2,
    id,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHeadingElement>> & {
    /** The heading level: a title that looks like a heading is one. Default 2. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * The rendered heading, of the tag `level` sets. Bind it with `bind:ref`.
     */
    ref?: WithElementRef<HTMLAttributes<HTMLHeadingElement>>["ref"];
    /** Classes for the heading, added after Kuiper's by `cn`. */
    class?: HTMLAttributes<HTMLHeadingElement>["class"];
    /**
     * The heading's id. Without it, the title takes the one the popover names
     * itself by.
     */
    id?: HTMLAttributes<HTMLHeadingElement>["id"];
    /** The title's text, which names the popover. */
    children?: HTMLAttributes<HTMLHeadingElement>["children"];
  } = $props();

  const context = getPopoverContext();
  const titleId = $derived(id ?? context?.titleId);

  // The content is labelled by this title while it is rendered.
  $effect(() => {
    if (!context) return;
    context.labelledBy = titleId;
    return () => {
      context.labelledBy = undefined;
    };
  });
</script>

<svelte:element
  this={`h${level}`}
  bind:this={ref}
  id={titleId}
  data-slot="popover-title"
  class={cn("font-heading text-base font-bold", className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
