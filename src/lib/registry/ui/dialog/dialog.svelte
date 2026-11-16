<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";

  let {
    open = $bindable(false),
    ...restProps
  }: DialogPrimitive.RootProps & {
    /**
     * Whether the dialog shows. Bind it to open and close the dialog from your
     * own code.
     */
    open?: DialogPrimitive.RootProps["open"];
  } = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps} />
