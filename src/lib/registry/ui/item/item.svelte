<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  export const itemVariants = tv({
    base: "group/item flex w-full flex-wrap items-center rounded border text-sm transition-[background-color] [a]:hover:bg-accent",
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
      },
      size: {
        default: "gap-4 p-4",
        sm: "gap-3 p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ItemSize = VariantProps<typeof itemVariants>["size"];
  export type ItemVariant = VariantProps<typeof itemVariants>["variant"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import { getContext, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    child,
    variant,
    size,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    child?: Snippet<[{ props: Record<string, unknown> }]>;
    variant?: ItemVariant;
    size?: ItemSize;
  } = $props();

  const inGroup = getContext<boolean | undefined>("pluto:item-group") ?? false;

  const mergedProps = $derived({
    role: inGroup ? "listitem" : undefined,
    class: cn(itemVariants({ variant, size }), className),
    "data-slot": "item",
    "data-variant": variant,
    "data-size": size,
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
