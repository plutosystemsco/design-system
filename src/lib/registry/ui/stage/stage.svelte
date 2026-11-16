<script lang="ts" module>
  /** The ground a stage is painted on: the page's canvas or one of the four colour fields. */
  export type StageGround =
    "canvas" | "field-1" | "field-2" | "field-3" | "field-4";

  // Each class written out in full, so Tailwind finds it in this file and an
  // installed app emits it.
  const GROUNDS: Record<StageGround, string> = {
    canvas: "bg-background text-foreground",
    "field-1": "field-1",
    "field-2": "field-2",
    "field-3": "field-3",
    "field-4": "field-4",
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    children,
    labelledby,
    label,
    element = "section",
    ground = "canvas",
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    children?: Snippet;
    /** The id of a heading that names the section, which makes it a region. */
    labelledby?: string;
    /** The section's name when no heading names it. */
    label?: string;
    /** A `section` by default; a `div` where the stage is not a section of its own. */
    element?: "section" | "div";
    /**
     * The canvas, or a colour field. On a field, text takes the field's
     * roles; a control sits on a `surface-plain` surface or on glass, never
     * on the field itself.
     */
    ground?: StageGround;
    /**
     * The rendered `<section>` or `<div>`, as `element` sets. Bind it with
     * `bind:ref`.
     */
    ref?: WithElementRef<HTMLAttributes<HTMLElement>>["ref"];
    /** Classes for the `<section>` or `<div>`, added after Kuiper's by `cn`. */
    class?: HTMLAttributes<HTMLElement>["class"];
  } = $props();
</script>

<!--
  An expressive section on a ground. It follows the page's
  theme: it never carries `.dark`, and is never placed under a `.dark`
  ancestor other than html. `clip`, not `hidden`, keeps sideways overflow
  from widening the page while sticky still works inside. The inner column
  holds the content to the wide measure, with the stage's fluid gutter.
-->
<svelte:element
  this={element}
  bind:this={ref}
  data-slot="stage"
  data-mode="expressive"
  data-ground={ground}
  aria-labelledby={labelledby}
  aria-label={label}
  class={cn("overflow-x-clip", GROUNDS[ground], className)}
  {...restProps}
>
  <div class="mx-auto max-w-7xl px-(--gutter-stage)">
    {@render children?.()}
  </div>
</svelte:element>
