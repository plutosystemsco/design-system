<script lang="ts">
  import { Tooltip as TooltipPrimitive } from "bits-ui";

  let {
    delayDuration = 0,
    ...restProps
  }: TooltipPrimitive.ProviderProps & {
    /**
     * How long the pointer rests on a trigger before its tooltip opens. Kuiper
     * opens it at once, as focus does.
     */
    delayDuration?: TooltipPrimitive.ProviderProps["delayDuration"];
  } = $props();
</script>

<TooltipPrimitive.Provider {delayDuration} {...restProps} />
