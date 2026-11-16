<script lang="ts">
  import { Popover as PopoverPrimitive } from "bits-ui";

  let {
    open = $bindable(false),
    ...restProps
  }: PopoverPrimitive.RootProps & {
    /**
     * Whether the popover shows. Bind it to open or close it from your own
     * code.
     */
    open?: PopoverPrimitive.RootProps["open"];
  } = $props();
</script>

<PopoverPrimitive.Root bind:open {...restProps} />
