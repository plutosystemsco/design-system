<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    open = $bindable(false),
    ...restProps
  }: DropdownMenuPrimitive.RootProps & {
    /**
     * Whether the menu shows. Bind it to open or close the menu from your own
     * code.
     */
    open?: DropdownMenuPrimitive.RootProps["open"];
  } = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {...restProps} />
