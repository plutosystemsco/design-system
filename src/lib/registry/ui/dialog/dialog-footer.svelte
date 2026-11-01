<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { Button } from "#lib/registry/ui/button";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    showCloseButton = false,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** Adds a secondary "Close" button after the children. */
    showCloseButton?: boolean;
  } = $props();
</script>

<!-- Stacked on a phone, the primary action last; a row from sm, actions at the end. -->
<div
  bind:this={ref}
  data-slot="dialog-footer"
  class={cn(
    "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  {#if showCloseButton}
    <DialogPrimitive.Close>
      {#snippet child({ props })}
        <Button variant="secondary" {...props}>Close</Button>
      {/snippet}
    </DialogPrimitive.Close>
  {/if}
</div>
