<script lang="ts">
  import { getChartContext, Tooltip as TooltipPrimitive } from "layerchart";
  import { cn, type WithElementRef, type WithoutChildren } from "#lib/utils";
  import {
    getPayloadConfigFromPayload,
    useChart,
    type TooltipPayload,
  } from "./chart-utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function defaultFormatter(value: any, _payload: TooltipPayload[]) {
    return `${value}`;
  }

  let {
    ref = $bindable(null),
    class: className,
    hideLabel = false,
    hideIndicator = false,
    labelKey,
    label,
    labelFormatter = defaultFormatter,
    labelClassName,
    formatter,
    nameKey,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> & {
    hideLabel?: boolean;
    label?: string;
    nameKey?: string;
    labelKey?: string;
    hideIndicator?: boolean;
    labelClassName?: string;
    labelFormatter?:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | ((value: any, payload: TooltipPayload[]) => string | number | Snippet)
      | null;
    formatter?: Snippet<
      [
        {
          value: unknown;
          name: string;
          item: TooltipPayload;
          index: number;
          payload: TooltipPayload[];
        },
      ]
    >;
  } = $props();

  const chart = useChart();
  const chartCtx = getChartContext();

  // Only series with a value: an item chart gives the hovered item one.
  const visibleSeries = $derived(
    chartCtx.tooltip.series.filter(
      (s: TooltipPayload) => s.value !== undefined,
    ),
  );

  const formattedLabel = $derived.by(() => {
    if (hideLabel || !visibleSeries?.length) return null;

    const [item] = visibleSeries;
    const tooltipData = chartCtx.tooltip.data;

    // The x value of the hovered datum, such as a day or a date.
    const dataLabel = tooltipData != null ? chartCtx.x(tooltipData) : undefined;

    const key = labelKey ?? item?.label ?? item?.key ?? "value";
    const itemConfig = getPayloadConfigFromPayload(
      chart.config,
      item,
      key,
      tooltipData as Record<string, unknown> | null,
    );

    let value: unknown;
    if (!labelKey && typeof label === "string") {
      value = chart.config[label as keyof typeof chart.config]?.label ?? label;
    } else if (labelKey) {
      value = itemConfig?.label ?? dataLabel;
    } else {
      value = dataLabel;
    }

    if (value === undefined) return null;
    if (!labelFormatter) return value;
    return labelFormatter(value, visibleSeries);
  });
</script>

<!--
  The pointer's affordance: a small panel raised by
  elevation, as a popover is. Its indicator is a token class the series' config
  names as `swatch`, rendered only when there is one, so no empty square and
  no style attribute. The table under the figure is the keyboard path.
-->
<TooltipPrimitive.Root variant="none">
  <div
    bind:this={ref}
    data-slot="chart-tooltip"
    class={cn(
      "grid min-w-24 gap-2 rounded bg-popover px-3 py-2 text-xs text-popover-foreground shadow-elevation",
      className,
    )}
    {...restProps}
  >
    {#if formattedLabel}
      <div class={cn("font-medium", labelClassName)}>
        {#if typeof formattedLabel === "function"}
          {@render formattedLabel()}
        {:else}
          {formattedLabel}
        {/if}
      </div>
    {/if}
    <div class="grid gap-2">
      {#each visibleSeries as item, i (item.key + i)}
        {@const key = `${nameKey || item.key || item.label || "value"}`}
        {@const itemConfig = getPayloadConfigFromPayload(
          chart.config,
          item,
          key,
          chartCtx.tooltip.data,
        )}
        <div
          class="flex w-full flex-wrap items-center gap-2 [&>svg]:size-4 [&>svg]:text-muted-foreground"
        >
          {#if formatter && item.value !== undefined && item.label}
            {@render formatter({
              value: item.value,
              name: item.label,
              item,
              index: i,
              payload: visibleSeries,
            })}
          {:else}
            {#if itemConfig?.icon}
              <itemConfig.icon aria-hidden="true" />
            {:else if !hideIndicator && itemConfig?.swatch}
              <div
                aria-hidden="true"
                class={cn("size-2 shrink-0 rounded", itemConfig.swatch)}
              ></div>
            {/if}
            <div class="flex flex-1 items-center justify-between gap-4">
              <span class="text-muted-foreground">
                {itemConfig?.label || item.label}
              </span>
              {#if item.value !== undefined}
                <span class="font-mono font-medium tabular-nums">
                  {item.value.toLocaleString()}
                </span>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</TooltipPrimitive.Root>
