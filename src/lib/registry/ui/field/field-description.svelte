<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
  bind:this={ref}
  data-slot="field-description"
  class={cn(
    "text-left text-sm font-normal text-muted-foreground group-has-data-horizontal/field:text-balance",
    "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</p>
