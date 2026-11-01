<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    ...restProps
  }: DropdownMenuPrimitive.TriggerProps = $props();
</script>

<!-- bits-ui names it: aria-haspopup="menu", aria-expanded, aria-controls while open. -->
<DropdownMenuPrimitive.Trigger
  bind:ref
  data-slot="dropdown-menu-trigger"
  {...restProps}
/>
