<script lang="ts">
  import { Collapsible as CollapsiblePrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    open = $bindable(false),
    ...restProps
  }: CollapsiblePrimitive.RootProps & {
    /**
     * Whether the content shows. Bind it to open or close it from your own
     * code.
     */
    open?: CollapsiblePrimitive.RootProps["open"];
  } = $props();
</script>

<CollapsiblePrimitive.Root
  bind:ref
  bind:open
  data-slot="collapsible"
  {...restProps}
/>
