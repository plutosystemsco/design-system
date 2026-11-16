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
    variant = "default",
    size = "default",
    ...restProps
  }: AlertDialogPrimitive.ActionProps & {
    /**
     * The button's look, as `Button`'s. Use `destructive` when the action
     * deletes.
     */
    variant?: ButtonVariant;
    /** The button's size, as `Button`'s. */
    size?: ButtonSize;
  } = $props();
</script>

<AlertDialogPrimitive.Action
  bind:ref
  data-slot="alert-dialog-action"
  class={cn(buttonVariants({ variant, size }), className)}
  {...restProps}
/>
