<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<!-- A slot with no ground and no radius: the avatar item inside it has both. -->
<div
  bind:this={ref}
  data-slot="message-avatar"
  class={cn("flex shrink-0 self-end", className)}
  {...restProps}
>
  {@render children?.()}
</div>
