<script lang="ts">
  import { onMount } from "svelte";
  import { Bars, Chart as LayerChart, Svg } from "layerchart";
  import * as Chart from "#lib/components/ui/chart";

  const week = [
    { day: "Mon", visitors: 412 },
    { day: "Tue", visitors: 538 },
    { day: "Wed", visitors: 497 },
  ];
  const config = { visitors: { label: "Visitors", swatch: "bg-chart-1" } };

  // 025 decision 5: work begun at mount; the mark says when it is done.
  onMount(() => {
    const check = () => {
      if (document.querySelector("[data-slot=chart] svg rect"))
        performance.mark("cost:settled");
      else requestAnimationFrame(check);
    };
    check();
  });
</script>

<Chart.Container label="Visitors per day" {config}>
  <LayerChart
    data={week}
    x="day"
    y="visitors"
    yDomain={[0, null]}
    series={[{ key: "visitors", label: "Visitors", value: "visitors" }]}
    tooltipContext={{ mode: "band" }}
  >
    {#snippet children()}
      <Svg>
        <Bars class="fill-chart-1" strokeWidth={0} />
      </Svg>
      <Chart.Tooltip />
    {/snippet}
  </LayerChart>
</Chart.Container>
