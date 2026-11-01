<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  /**
   * `plain`: the assistant's prose, full width, no ground. `bubble`: a user
   * turn on the muted inset, 80% wide at most, at the end of its column. One
   * inset and no other ground: a tint fails the token rule, a primary fill
   * spends the accent the send button owns, and red is the alert's.
   */
  export const messageContentVariants = tv({
    base: "min-w-0 wrap-break-word",
    variants: {
      variant: {
        plain: "flex w-full flex-col gap-2",
        bubble: "w-fit max-w-4/5 self-end rounded bg-muted px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "plain",
    },
  });

  export type MessageContentVariant = VariantProps<
    typeof messageContentVariants
  >["variant"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    variant = "plain",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: MessageContentVariant;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="message-content"
  data-variant={variant}
  class={cn(messageContentVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</div>
