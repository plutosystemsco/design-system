<script lang="ts" module>
  import type { HTMLProgressAttributes } from "svelte/elements";

  /** The fill: primary, or destructive when the task stopped on an error. */
  export type ProgressVariant = "default" | "destructive";

  export type ProgressProps = Omit<
    HTMLProgressAttributes,
    "value" | "max" | "class" | "children"
  > & {
    /** How much is done, from 0 to `max`. Clamped to that range. `null` or `undefined` from untyped code renders as 0: this bar has no indeterminate form. */
    value: number;
    /** How much there is to do. */
    max?: number;
    /** What a reader hears instead of a percentage, such as "3 of 12 files". */
    valuetext?: string;
    /** Destructive when the task stopped on an error. Say so in words beside it; the colour is not the only sign. */
    variant?: "default" | "destructive";
    /** Classes for the bar. */
    class?: string;
    /** The bar, bound. */
    ref?: HTMLProgressElement | null;
  };

  // The track is the element (Firefox) and its ::-webkit-progress-bar
  // (Chromium, WebKit); the fill is ::-webkit-progress-value and
  // ::-moz-progress-bar. Each vendor's pseudo-element is its own class, so
  // an engine never drops another's rule.
  const FILL: Record<ProgressVariant, string> = {
    default:
      "[&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary",
    destructive:
      "[&::-webkit-progress-value]:bg-destructive [&::-moz-progress-bar]:bg-destructive",
  };

  /** The value as drawn: a number from 0 to `max`, never missing. */
  function clamp(value: number | null | undefined, max: number): number {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
  }
</script>

<script lang="ts">
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    value,
    max = 100,
    valuetext,
    variant = "default",
    ...restProps
  }: ProgressProps = $props();
</script>

<!--
  The native progress bar: a task's progress towards done, the partner of
  meter. An 8 px bar with square ends on the muted track, filled in primary,
  or destructive when the task failed. It always has a value, so no engine
  draws its own indeterminate bar. It keeps its colours under forced colours,
  so the fill stays drawn. It is not a live region: the app announces the
  start and the end with a status. The app names it with a <label for> or
  aria-label, and writes its numbers beside it.
-->
<progress
  bind:this={ref}
  data-slot="progress"
  value={clamp(value, max)}
  {max}
  aria-valuetext={valuetext}
  class={cn(
    "block h-2 w-full appearance-none rounded-none border-0 bg-muted forced-color-adjust-none [&::-webkit-progress-bar]:bg-muted",
    FILL[variant],
    className,
  )}
  {...restProps}
></progress>
