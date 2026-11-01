<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.SeparatorProps = $props();
</script>

<!-- The hairline (R22), across the panel's padding. -->
<DropdownMenuPrimitive.Separator
  bind:ref
  data-slot="dropdown-menu-separator"
  class={cn("-mx-1 my-1 border-t border-border", className)}
  {...restProps}
/>
