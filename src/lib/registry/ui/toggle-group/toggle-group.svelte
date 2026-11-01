<script lang="ts" module>
  import { getContext, setContext } from "svelte";
  import type { VariantProps } from "tailwind-variants/lite";
  import type { toggleVariants } from "#lib/registry/ui/toggle";

  type ToggleVariants = VariantProps<typeof toggleVariants>;

  interface ToggleGroupContext extends ToggleVariants {
    orientation?: "horizontal" | "vertical";
  }

  export function setToggleGroupCtx(props: ToggleGroupContext) {
    setContext("toggleGroup", props);
  }

  export function getToggleGroupCtx() {
    return getContext<Required<ToggleGroupContext>>("toggleGroup");
  }
</script>

<script lang="ts">
  import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    size = "default",
    orientation = "horizontal",
    variant = "default",
    ...restProps
  }: ToggleGroupPrimitive.RootProps &
    ToggleVariants & {
      orientation?: "horizontal" | "vertical";
    } = $props();

  setToggleGroupCtx({
    get variant() {
      return variant;
    },
    get size() {
      return size;
    },
    get orientation() {
      return orientation;
    },
  });
</script>

<!--
  A row of joined toggles (004 decision 13): one stop for the row, the arrow
  keys browse, Space or Enter selects. bits-ui renders role="group" with
  role="radio" items in single mode, and that stays: a preset strip that
  selected on arrow would fire a query per key press. Separate toggles are
  Toggle components in a flex row; there is no spacing prop.

  Discriminated unions and destructuring (required for bindable) do not get
  along, so `value` is cast to `never`.
-->
<ToggleGroupPrimitive.Root
  bind:value={value as never}
  bind:ref
  {orientation}
  data-slot="toggle-group"
  data-variant={variant}
  data-size={size}
  class={cn(
    "group/toggle-group inline-flex w-fit items-center rounded data-vertical:flex-col data-vertical:items-stretch",
    className,
  )}
  {...restProps}
/>
