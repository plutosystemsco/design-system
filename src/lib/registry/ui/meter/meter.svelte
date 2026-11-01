<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from "#lib/utils";
  import type { HTMLMeterAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    value,
    min = 0,
    max = 100,
    valuetext,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLMeterAttributes, HTMLMeterElement>> & {
    /** The measurement. */
    value: number;
    /** The range's floor. Default 0. */
    min?: number;
    /** The range's ceiling. Default 100. */
    max?: number;
    /** What a reader hears instead of a percentage, such as "48 of 100". */
    valuetext?: string;
  } = $props();
</script>

<!--
  The native meter: a measurement within a known range, not
  progress. Its track is muted and its fill primary through pluto-theme's
  rules, with square ends. The app names it with a <label for> or aria-label
  and writes its numbers beside it; the fill is never the only sign.
-->
<meter
  bind:this={ref}
  data-slot="meter"
  {value}
  {min}
  {max}
  aria-valuetext={valuetext}
  class={cn("block h-2 w-full rounded-none", className)}
  {...restProps}
></meter>
