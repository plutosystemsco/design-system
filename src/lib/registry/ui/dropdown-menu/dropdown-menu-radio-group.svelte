<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    value = $bindable(),
    ...restProps
  }: DropdownMenuPrimitive.RadioGroupProps & {
    /**
     * The value of the checked item in the group. Bind it to read or set it.
     */
    value?: DropdownMenuPrimitive.RadioGroupProps["value"];
  } = $props();
</script>

<DropdownMenuPrimitive.RadioGroup
  bind:ref
  bind:value
  data-slot="dropdown-menu-radio-group"
  {...restProps}
/>
