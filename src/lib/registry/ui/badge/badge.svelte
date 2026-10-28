<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  // No tint: a badge sits in rows whose hover and selected ground is the
  // accent inset, so a state is a border and text in its colour. Caution is
  // a solid amber fill with ink text, because amber is never text.
  export const badgeVariants = tv({
    base: "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded border px-2 py-0 font-mono text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3",
    variants: {
      variant: {
        default: "border-border text-foreground",
        destructive: "border-destructive text-destructive",
        success: "border-success text-success",
        caution: "border-caution bg-caution text-caution-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    variant = "default",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    variant?: BadgeVariant;
  } = $props();
</script>

<!-- A label, not an action: its text says the state. -->
<span
  bind:this={ref}
  data-slot="badge"
  class={cn(badgeVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</span>
