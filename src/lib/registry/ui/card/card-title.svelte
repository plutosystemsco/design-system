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
    /** The heading level: a title that looks like a heading is one. Default 2. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  } = $props();
</script>

<svelte:element
  this={`h${level}`}
  bind:this={ref}
  data-slot="card-title"
  class={cn("font-heading text-base font-bold", className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
