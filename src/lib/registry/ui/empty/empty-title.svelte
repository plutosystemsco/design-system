<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    level = 2,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHeadingElement>> & {
    /** The heading level, so a page state's title can be its h1. Default 2. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * The rendered heading, of the tag `level` sets. Bind it with `bind:ref`.
     */
    ref?: WithElementRef<HTMLAttributes<HTMLHeadingElement>>["ref"];
    /** Classes for the heading, added after Kuiper's by `cn`. */
    class?: HTMLAttributes<HTMLHeadingElement>["class"];
    /** The title's text. */
    children?: HTMLAttributes<HTMLHeadingElement>["children"];
  } = $props();
</script>

<svelte:element
  this={`h${level}`}
  bind:this={ref}
  data-slot="empty-title"
  class={cn("font-heading text-2xl font-bold tracking-section", className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
