<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<!--
  Key names in words ("Shift Cmd P"), in mono, hidden from the item's name:
  symbols read as part of the name are noise. It binds nothing: an app that
  shows a shortcut binds it and sets aria-keyshortcuts on the item.
-->
<span
  bind:this={ref}
  data-slot="dropdown-menu-shortcut"
  aria-hidden="true"
  class={cn(
    "ms-auto font-mono text-xs tracking-mark text-muted-foreground",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</span>
