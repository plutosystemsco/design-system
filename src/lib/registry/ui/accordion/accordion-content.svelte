<script lang="ts">
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import { cn, type WithoutChild } from "#lib/utils";
  import { getAccordionItemContext } from "./accordion-item.svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithoutChild<AccordionPrimitive.ContentProps> = $props();

  const context = getAccordionItemContext();
</script>

<!--
  A region named by its trigger, so a reader can jump from panel to panel
  (six panels or fewer). No animation: the content appears at once. Its
  height variables are bits-ui's inline style, not ours.
-->
<AccordionPrimitive.Content
  bind:ref
  data-slot="accordion-content"
  id={context?.contentId}
  role="region"
  aria-labelledby={context?.triggerId}
  class="text-sm"
  {...restProps}
>
  <div
    class={cn(
      "pb-4 [&_a]:underline [&_a]:underline-offset-4 [&_p:not(:last-child)]:mb-4",
      className,
    )}
  >
    {@render children?.()}
  </div>
</AccordionPrimitive.Content>
