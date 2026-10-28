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
    size?: InputGroupButtonSize;
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
