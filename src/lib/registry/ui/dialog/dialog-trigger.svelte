<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";

  let { ref = $bindable(null), ...restProps }: DialogPrimitive.TriggerProps =
    $props();
</script>

<!-- bits-ui names it: aria-haspopup="dialog", aria-expanded, aria-controls. -->
<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...restProps} />
