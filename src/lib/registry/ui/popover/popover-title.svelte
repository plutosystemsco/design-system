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
