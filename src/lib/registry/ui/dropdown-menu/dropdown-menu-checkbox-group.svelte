<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    value = $bindable([]),
    ...restProps
  }: DropdownMenuPrimitive.CheckboxGroupProps & {
    /**
     * The values of the checked items in the group. Bind it to read or set
     * them.
     */
    value?: DropdownMenuPrimitive.CheckboxGroupProps["value"];
  } = $props();
</script>

<DropdownMenuPrimitive.CheckboxGroup
  bind:ref
  bind:value
  data-slot="dropdown-menu-checkbox-group"
  {...restProps}
/>
