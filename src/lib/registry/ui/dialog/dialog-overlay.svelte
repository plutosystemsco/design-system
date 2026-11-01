<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.OverlayProps = $props();
</script>

<!-- The scrim, unblurred, fading with the content. -->
<DialogPrimitive.Overlay
  bind:ref
  data-slot="dialog-overlay"
  class={cn(
    "fixed inset-0 z-50 bg-scrim data-open:animate-enter data-closed:animate-exit",
    className,
  )}
  {...restProps}
/>
