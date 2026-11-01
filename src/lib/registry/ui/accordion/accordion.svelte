<script lang="ts">
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: AccordionPrimitive.RootProps = $props();
</script>

<!--
  Headings that each open a section, divided by grooves. No border and no
  clip: an app that wants a card puts the accordion in one, and nothing may
  clip a trigger's focus ring.
-->
<AccordionPrimitive.Root
  bind:ref
  bind:value={value as never}
  data-slot="accordion"
  class={cn("flex w-full flex-col", className)}
  {...restProps}
/>
