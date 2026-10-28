<script lang="ts">
  import { Separator } from "#lib/registry/ui/separator";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children?: Snippet;
  } = $props();

  const hasContent = $derived(!!children);
</script>

<div
  bind:this={ref}
  data-slot="field-separator"
  data-content={hasContent}
  class={cn("flex items-center gap-3 text-sm text-muted-foreground", className)}
  {...restProps}
>
  <Separator class="flex-1" />
  {#if children}
    <span data-slot="field-separator-content">
      {@render children()}
    </span>
    <Separator class="flex-1" />
  {/if}
</div>
