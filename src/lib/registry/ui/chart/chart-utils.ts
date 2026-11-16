import { getContext, setContext, type Component } from "svelte";
import type { Tooltip } from "layerchart";

/**
 * What a chart says about each of its series: a label, an
 * optional icon, and an optional `swatch`, a token class such as `bg-chart-1`
 * that the tooltip's indicator takes. A series' colour lives on its mark, as a
 * class or a `var()` prop, never in this config and never in a stylesheet.
 */
export type ChartConfig = {
  [k in string]: {
    label?: string;
    icon?: Component;
    /** A token class for the tooltip's indicator, such as `bg-chart-1`. */
    swatch?: string;
  };
};

/** One series' row in the tooltip, as layerchart gives it. */
export type TooltipPayload = Tooltip.TooltipSeries;

/** The config entry for a tooltip row: by its key, its label, or a string field of the datum. */
export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: TooltipPayload,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any> | null,
) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const payloadConfig =
    "config" in payload &&
    typeof payload.config === "object" &&
    payload.config !== null
      ? payload.config
      : undefined;

  let configLabelKey: string = key;

  if (payload.key === key) {
    configLabelKey = payload.key;
  } else if (payload.label === key) {
    configLabelKey = payload.label;
  } else if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadConfig !== undefined &&
    key in payloadConfig &&
    typeof payloadConfig[key as keyof typeof payloadConfig] === "string"
  ) {
    configLabelKey = payloadConfig[key as keyof typeof payloadConfig] as string;
  } else if (data != null && key in data && typeof data[key] === "string") {
    configLabelKey = data[key] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

type ChartContextValue = {
  config: ChartConfig;
};

const chartContextKey = Symbol("chart-context");

/**
 * Shares the chart's config with the parts inside it. `ChartContainer` calls
 * it.
 */
export function setChartContext(value: ChartContextValue) {
  return setContext(chartContextKey, value);
}

/**
 * The nearest chart's config, for a part of your own inside a `ChartContainer`.
 */
export function useChart() {
  return getContext<ChartContextValue>(chartContextKey);
}
