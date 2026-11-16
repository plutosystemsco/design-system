<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
  import {
    buttonVariants,
    type ButtonVariant,
    type ButtonSize,
  } from "#lib/registry/ui/button";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    variant = "secondary",
    size = "default",
    ...restProps
  }: AlertDialogPrimitive.CancelProps & {
    /**
     * The button's look, as `Button`'s. Kuiper's default is quieter than the
     * action's.
     */
    variant?: ButtonVariant;
    /** The button's size, as `Button`'s. */
    size?: ButtonSize;
  } = $props();
</script>

<AlertDialogPrimitive.Cancel
  bind:ref
  data-slot="alert-dialog-cancel"
  class={cn(buttonVariants({ variant, size }), className)}
  {...restProps}
/>
