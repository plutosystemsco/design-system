<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  /**
   * A line in a conversation that is not a turn. `separator` draws the
   * hairline either side (R22: a border, not a 1 px box); `border` underlines
   * it. No role by default: a marker inserted with its text is the silent
   * live-region case, the log announces it as an added node, and the state is
   * told by the status item. An app passes a role when it means one.
   */
  export const markerVariants = tv({
    base: "group/marker relative flex min-h-4 w-full items-center gap-2 text-start text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground [&_svg:not([class*='size-'])]:size-4",
    variants: {
      variant: {
        default: "",
        separator:
          "before:min-w-0 before:flex-1 before:border-t before:border-border after:min-w-0 after:flex-1 after:border-t after:border-border",
        border: "border-b border-border pb-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export type MarkerVariant = VariantProps<typeof markerVariants>["variant"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    variant = "default",
    child,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: MarkerVariant;
    child?: Snippet<[{ props: Record<string, unknown> }]>;
  } = $props();

  const mergedProps = $derived({
    class: cn(markerVariants({ variant }), className),
    "data-slot": "marker",
    "data-variant": variant,
    ...restProps,
  });
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <div bind:this={ref} {...mergedProps}>
    {@render mergedProps.children?.()}
  </div>
{/if}
