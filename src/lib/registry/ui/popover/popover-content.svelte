<script lang="ts" module>
  import { getContext, setContext } from "svelte";

  /**
   * The popover's name (004 decision 11). The content provides this context;
   * a title inside it registers its id, and the content is then labelled by
   * the title. Without a title, the content's `label` prop names it.
   */
  export type PopoverContext = {
    /** The id a title takes unless it has its own. */
    readonly titleId: string;
    /** The id of the rendered title, or undefined when there is none. */
    labelledBy: string | undefined;
  };

  const KEY = "pluto:popover";

  export function setPopoverContext(context: PopoverContext): PopoverContext {
    return setContext(KEY, context);
  }

  export function getPopoverContext(): PopoverContext | undefined {
    return getContext<PopoverContext | undefined>(KEY);
  }
</script>

<script lang="ts">
  import { Popover as PopoverPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";
  import PopoverPortal from "./popover-portal.svelte";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 4,
    align = "center",
    label,
    portalProps,
    ...restProps
  }: PopoverPrimitive.ContentProps & {
    /** The dialog's name when it holds no `PopoverTitle`. One of the two is required. */
    label?: string;
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
  } = $props();

  const uid = $props.id();
  let labelledBy = $state<string | undefined>();
  setPopoverContext({
    titleId: `${uid}-title`,
    get labelledBy() {
      return labelledBy;
    },
    set labelledBy(id) {
      labelledBy = id;
    },
  });
</script>

<!--
  A small dialog raised by elevation alone, which already draws the hairline
  as a spread layer, so no border. 256 px wide by default. The
  trigger promises a dialog (aria-haspopup); the content keeps the promise
  with role="dialog" and a name: its title, else the label prop. Focus inside
  is the global ring. It fades in and out over the micro budget.
-->
<PopoverPortal {...portalProps}>
  <PopoverPrimitive.Content
    bind:ref
    data-slot="popover-content"
    role="dialog"
    aria-labelledby={labelledBy}
    aria-label={labelledBy ? undefined : label}
    {sideOffset}
    {align}
    class={cn(
      "z-50 grid w-3xs origin-(--bits-popover-content-transform-origin) gap-4 rounded bg-popover p-4 text-sm text-popover-foreground shadow-elevation data-open:animate-enter data-closed:animate-exit",
      className,
    )}
    {...restProps}
  />
</PopoverPortal>
