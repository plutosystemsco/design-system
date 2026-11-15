<script lang="ts" module>
  export const meta = {
    title: "Two series",
    intro:
      "Two series are told apart by their marks, bars against a line, because no two chart colours differ by 3:1. The caption and the description say which is which.",
  };
</script>

<script lang="ts">
  import {
    Axis,
    Bars,
    Chart as LayerChart,
    Highlight,
    Spline,
    Svg,
  } from "layerchart";
  import * as Card from "#lib/registry/ui/card";
  import * as Chart from "#lib/registry/ui/chart";
  import * as Table from "#lib/registry/ui/table";

  // Last week's page views and visitors, by day.
  const week = [
    { day: "Mon", visitors: 412, views: 1240 },
    { day: "Tue", visitors: 538, views: 1612 },
    { day: "Wed", visitors: 497, views: 1498 },
    { day: "Thu", visitors: 561, views: 1687 },
    { day: "Fri", visitors: 433, views: 1301 },
    { day: "Sat", visitors: 188, views: 566 },
    { day: "Sun", visitors: 164, views: 492 },
  ];
  const days: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  const config = {
    views: { label: "Page views", swatch: "bg-chart-1" },
    visitors: { label: "Visitors", swatch: "bg-chart-2" },
  } satisfies Chart.ChartConfig;
</script>

<Card.Root class="w-full" data-testid="chart-two-series">
  <Card.Header>
    <Card.Title level={4}>Page views and visitors</Card.Title>
    <Card.Description
      >Last week, by day. Bars are page views; the line is visitors.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <Chart.Container
      label="Page views (bars) and visitors (line) per weekday, last week"
      {config}
    >
      <LayerChart
        data={week}
        x="day"
        y={["views", "visitors"]}
        yDomain={[0, null]}
        yNice
        bandPadding={0.3}
        series={[
          { key: "views", label: "Page views", value: "views" },
          { key: "visitors", label: "Visitors", value: "visitors" },
        ]}
        padding={{ left: 48, bottom: 24 }}
        tooltipContext={{ mode: "band" }}
      >
        {#snippet children()}
          <Svg>
            <Axis placement="left" grid rule ticks={6} />
            <Axis placement="bottom" rule />
            <Highlight area />
            <Bars y="views" class="fill-chart-1" strokeWidth={0} />
            <Spline y="visitors" class="stroke-chart-2" strokeWidth={2} />
          </Svg>
          <Chart.Tooltip />
        {/snippet}
      </LayerChart>
      {#snippet table()}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head scope="col">Day</Table.Head>
              <Table.Head scope="col" class="text-right">Page views</Table.Head>
              <Table.Head scope="col" class="text-right">Visitors</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each week as row (row.day)}
              <Table.Row>
                <Table.Cell>{days[row.day]}</Table.Cell>
                <Table.Cell class="text-right font-mono tabular-nums"
                  >{row.views}</Table.Cell
                >
                <Table.Cell class="text-right font-mono tabular-nums"
                  >{row.visitors}</Table.Cell
                >
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {/snippet}
    </Chart.Container>
  </Card.Content>
</Card.Root>
