<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    open = $bindable(false),
    ...restProps
  }: DropdownMenuPrimitive.SubProps & {
    /**
     * Whether the submenu shows. Bind it to open or close it from your own
     * code.
     */
    open?: DropdownMenuPrimitive.SubProps["open"];
  } = $props();
</script>

<DropdownMenuPrimitive.Sub bind:open {...restProps} />
