<script lang="ts" module>
  export type InputGroupButtonSize = "sm" | "icon-sm";
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { cn } from "#lib/utils";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    type = "button",
    variant = "ghost",
    size = "sm",
    ...restProps
  }: Omit<ComponentProps<typeof Button>, "href" | "size"> & {
    /**
     * `sm` for a button with text, `icon-sm` for one with only an icon, named
     * by `aria-label`. Both fit inside the group's frame.
     */
    size?: InputGroupButtonSize;
    /**
     * Kuiper's default is `"button"`, so the button does not submit the form
     * the group is in.
     */
    type?: ComponentProps<typeof Button>["type"];
    /**
     * The button's look, as `Button`'s. Kuiper's default is quiet, so the
     * control stays the focus.
     */
    variant?: ComponentProps<typeof Button>["variant"];
  } = $props();
</script>

<!-- A button inside the group keeps its own focus indicator. -->
<Button
  bind:ref
  {type}
  data-size={size}
  {variant}
  {size}
  class={cn("text-sm", className)}
  {...restProps}
>
  {@render children?.()}
</Button>
