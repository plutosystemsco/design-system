<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    level = 3,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHeadingElement>> & {
    /** The heading level, so a reader can walk the turns. Default 3. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  } = $props();
</script>

<!--
  Who spoke, as a heading in mono, lowercase, as every eyebrow is. tabindex="-1"
  so a "Latest reply" control can focus it, and Tab does not stop on it.
-->
<svelte:element
  this={`h${level}`}
  bind:this={ref}
  data-slot="message-header"
  tabindex="-1"
  class={cn(
    "font-mono text-xs tracking-eyebrow text-muted-foreground lowercase",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
