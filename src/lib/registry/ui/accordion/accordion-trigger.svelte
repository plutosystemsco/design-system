<script lang="ts">
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import { cn, type WithoutChild } from "#lib/utils";
  import { getAccordionItemContext } from "./accordion-item.svelte";

  let {
    ref = $bindable(null),
    class: className,
    level = 3,
    children,
    ...restProps
  }: WithoutChild<AccordionPrimitive.TriggerProps> & {
    /** The heading level bits-ui renders as role="heading" aria-level. Default 3. */
    level?: AccordionPrimitive.HeaderProps["level"];
  } = $props();

  const context = getAccordionItemContext();
</script>

<!--
  A heading holding a 48 px button in the heading face. One caret shows the
  state by shape: it points right when closed and down when open.
-->
<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    data-slot="accordion-trigger"
    bind:ref
    id={context?.triggerId}
    aria-controls={context?.contentId}
    class={cn(
      "group/accordion-trigger flex h-12 flex-1 items-center justify-between gap-4 py-0 text-start font-heading text-base font-bold underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...restProps}
  >
    {@render children?.()}
    <CaretRight
      aria-hidden="true"
      class="size-4 shrink-0 text-muted-foreground transition group-aria-expanded/accordion-trigger:rotate-90"
    />
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
