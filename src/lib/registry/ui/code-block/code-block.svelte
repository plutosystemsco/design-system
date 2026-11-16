<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  export const codeBlockVariants = tv({
    // The root draws the focus indicator for its pre, so overflow-hidden
    // cannot clip it. The ground is the code ground, white in light mode,
    // edged by the hairline on every surface, so a white block keeps its edge
    // on a white card. Inside an ink surface the code ground is the surface
    // itself, and the hairline tells the block from it.
    base: "group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded border border-border bg-code-background text-sm has-[[data-slot=code-block-content]:focus-visible]:focus-ring data-[size=sm]:text-xs",
    variants: {
      variant: {
        // The body is the code's own ink, not the page's foreground.
        default: "text-code-text",
        // State told by colour: the app gives a destructive block a visible
        // label, such as "Error output", in its header or beside it.
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export type CodeBlockVariant = VariantProps<
    typeof codeBlockVariants
  >["variant"];
  export type CodeBlockSize = "default" | "sm";
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    variant = "default",
    size = "default",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /**
     * `destructive` sets the code in the error colour, for error output. Name
     * it in a visible label too, such as the block's header.
     */
    variant?: CodeBlockVariant;
    /**
     * `sm` sets smaller text and padding, for a block inside a dense surface
     * such as a chat message.
     */
    size?: CodeBlockSize;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="code-block"
  data-variant={variant}
  data-size={size}
  class={cn(codeBlockVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</div>
