<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    ...restProps
  }: DropdownMenuPrimitive.GroupProps = $props();
</script>

<!-- role="group", named by its heading when one is rendered inside it. -->
<DropdownMenuPrimitive.Group
  bind:ref
  data-slot="dropdown-menu-group"
  {...restProps}
/>
