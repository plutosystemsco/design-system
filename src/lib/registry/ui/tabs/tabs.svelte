<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    ...restProps
  }: TabsPrimitive.RootProps & {
    /** The value of the open tab. Bind it to read or set which tab shows. */
    value?: TabsPrimitive.RootProps["value"];
  } = $props();
</script>

<TabsPrimitive.Root
  bind:ref
  bind:value
  data-slot="tabs"
  class={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
  {...restProps}
/>
