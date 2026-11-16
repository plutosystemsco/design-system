<script lang="ts" module>
  import { getContext, setContext } from "svelte";

  /**
   * The wiring bits-ui leaves out: one id per item, made
   * here and shared, so the trigger says `aria-controls` and the content is a
   * `region` labelled by the trigger.
   */
  export type AccordionItemContext = {
    /** The id of the item's trigger, which labels its content. */
    readonly triggerId: string;
    /** The id of the item's content, which its trigger controls. */
    readonly contentId: string;
  };

  const KEY = "kuiper:accordion-item";
  /** Its key before 0.13.0, set too for an app's own code that reads it, until 0.14.0. */
  const OLD_KEY = "pluto:accordion-item";

  export function setAccordionItemContext(
    context: AccordionItemContext,
  ): AccordionItemContext {
    setContext(OLD_KEY, context);
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
