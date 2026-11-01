<script lang="ts" module>
  import { getContext, setContext } from "svelte";

  /**
   * The wiring bits-ui leaves out (004 decision 12): one id per item, made
   * here and shared, so the trigger says `aria-controls` and the content is a
   * `region` labelled by the trigger.
   */
  export type AccordionItemContext = {
    readonly triggerId: string;
    readonly contentId: string;
  };

  const KEY = "pluto:accordion-item";

  export function setAccordionItemContext(
    context: AccordionItemContext,
  ): AccordionItemContext {
    return setContext(KEY, context);
  }

  export function getAccordionItemContext(): AccordionItemContext | undefined {
    return getContext<AccordionItemContext | undefined>(KEY);
  }
</script>

<script lang="ts">
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: AccordionPrimitive.ItemProps = $props();

  const uid = $props.id();
  setAccordionItemContext({
    triggerId: `${uid}-trigger`,
    contentId: `${uid}-content`,
  });
</script>

<!-- Every item after the first carries the groove. No tint on the open item. -->
<AccordionPrimitive.Item
  bind:ref
  data-slot="accordion-item"
  class={cn("not-first:groove", className)}
  {...restProps}
/>
