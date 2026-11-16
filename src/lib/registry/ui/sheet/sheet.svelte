<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";

  let {
    open = $bindable(false),
    ...restProps
  }: SheetPrimitive.RootProps & {
    /**
     * Whether the sheet shows. Bind it to open or close it from your own code.
     */
    open?: SheetPrimitive.RootProps["open"];
  } = $props();
</script>

<SheetPrimitive.Root bind:open {...restProps} />
