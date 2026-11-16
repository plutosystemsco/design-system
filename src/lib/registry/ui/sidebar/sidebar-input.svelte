<script lang="ts">
  import { Input } from "#lib/registry/ui/input";
  import { cn } from "#lib/utils";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    ...restProps
  }: ComponentProps<typeof Input> & {
    /** The text in the input. Bind it to read or set it. */
    value?: ComponentProps<typeof Input>["value"];
  } = $props();
</script>

<!-- The registry's input as it is: 48 px on the card ground. Gone as icons. -->
<Input
  bind:ref
  bind:value
  data-slot="sidebar-input"
  data-sidebar="input"
  class={cn("w-full group-data-[collapsible=icon]:hidden", className)}
  {...restProps}
/>
