<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  /**
   * A two-state button (004 decision 13). Pressed is inverted, the recipe the
   * viewer's presets and the tooltip use, so the state is told at a glance
   * and never by a faint tint. `data-state`, not `aria-pressed`: a toggle
   * group's single mode marks its items `aria-checked`, and bits-ui sets
   * `data-state="on"` in both modes.
   */
  export const toggleVariants = tv({
    base: "group/toggle inline-flex items-center justify-center gap-2 rounded font-medium whitespace-nowrap transition-[color,background-color,border-color] hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-foreground data-[state=on]:text-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent",
      },
      size: {
        default: "h-12 min-w-12 px-4 text-base",
        sm: "h-8 min-w-8 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
  export type ToggleSize = VariantProps<typeof toggleVariants>["size"];
  export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
  import { Toggle as TogglePrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    pressed = $bindable(false),
    class: className,
    size = "default",
    variant = "default",
    ...restProps
  }: TogglePrimitive.RootProps & {
    variant?: ToggleVariant;
    size?: ToggleSize;
  } = $props();
</script>

<!-- A native button with aria-pressed; an icon-only toggle needs an aria-label. -->
<TogglePrimitive.Root
  bind:ref
  bind:pressed
  data-slot="toggle"
  class={cn(toggleVariants({ variant, size }), className)}
  {...restProps}
/>
