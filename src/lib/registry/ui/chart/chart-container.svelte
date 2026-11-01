<script lang="ts">
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import { cn, type WithElementRef } from "#lib/utils";
  import { setChartContext, type ChartConfig } from "./chart-utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const uid = $props.id();

  let {
    ref = $bindable(null),
    id = uid,
    class: className,
    children,
    config = {},
    label,
    captionHidden = false,
    table,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    /** What the tooltip says about each series. */
    config?: ChartConfig;
    /** The figure's name, shown as its caption. Required: a chart's marks are invisible to assistive technology. */
    label: string;
    /** Keeps the caption for assistive technology only. */
    captionHidden?: boolean;
    /** The chart's data as a table, shown behind "Show as table": the keyboard and screen-reader path, and the only content a prerender holds. */
    table?: Snippet;
  } = $props();

  const chartId = $derived(`chart-${(id ?? uid).replace(/:/g, "")}`);
  const captionId = $derived(`${chartId}-caption`);

  setChartContext({
    get config() {
      return config;
    },
  });
</script>

<!--
  A figure named by its visible caption, which comes first:
  a figcaption must be the figure's first or last child, and the table's
  disclosure follows the chart. layerchart draws nothing on the server and
  exposes only its tick labels, so the name and the table are what every
  reader gets; the tooltip is the pointer's affordance.
  Series take their colour from a token class or a var() prop on the mark;
  the overrides below are the only styling this component does to layerchart.
  Nothing animates: no mark here carries `motion`.
-->
<figure
  bind:this={ref}
  data-slot="chart"
  data-chart={chartId}
  aria-labelledby={captionId}
  class={cn(
    "grid w-full gap-2 text-xs",
    // Tick labels in the secondary ink; rules and grid lines as the hairline;
    // no stroke on bars (layerchart's own default is a black 1 px line); the
    // hover band (Highlight area) as the opaque muted inset, not layerchart's
    // 5% tint of the foreground. Render the band before the marks.
    "[&_.lc-axis-tick-label]:fill-muted-foreground [&_.lc-axis-tick]:stroke-border [&_.lc-rule]:stroke-border [&_.lc-rule-x-line]:stroke-border [&_.lc-rule-y-line]:stroke-border [&_.lc-grid-x-line]:stroke-border [&_.lc-grid-y-line]:stroke-border [&_.lc-rect]:stroke-0 [&_.lc-highlight-area]:fill-muted [&_.lc-text]:text-xs [&_.lc-root-container]:w-full",
    className,
  )}
  {...restProps}
>
  <figcaption
    id={captionId}
    data-slot="chart-caption"
    class={cn("text-sm text-muted-foreground", captionHidden && "sr-only")}
  >
    {label}
  </figcaption>
  <div data-slot="chart-box" class="aspect-video w-full">
    {@render children?.()}
  </div>
  {#if table}
    <details data-slot="chart-table" class="group text-sm">
      <summary
        class="inline-flex min-h-6 cursor-pointer items-center gap-2 text-muted-foreground"
      >
        <!-- One caret, turned a quarter when open, as the accordion's is. -->
        <CaretRight
          aria-hidden="true"
          class="size-4 shrink-0 transition group-open:rotate-90"
        />
        <span class="underline underline-offset-4">Show as table</span>
      </summary>
      <div class="mt-2">
        {@render table()}
      </div>
    </details>
  {/if}
</figure>
