<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";
  export const inputGroupAddonVariants = tv({
    base: "flex h-auto cursor-text items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4",
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:-ml-1",
        "inline-end": "order-last pr-3 has-[>button]:-mr-1",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  });

  export type InputGroupAddonAlign = VariantProps<
    typeof inputGroupAddonVariants
  >["align"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    align = "inline-start",
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    align?: InputGroupAddonAlign;
  } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  bind:this={ref}
  role="group"
  data-slot="input-group-addon"
  data-align={align}
  class={cn(inputGroupAddonVariants({ align }), className)}
  onclick={(e) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    e.currentTarget.parentElement
      ?.querySelector<HTMLElement>("input, textarea")
      ?.focus();
  }}
  {...restProps}
>
  {@render children?.()}
</div>
