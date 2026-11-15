<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A figure named by its caption, with its data behind “Show as table”. The marks take their colour from a token class on the mark, or a var() prop; nothing is painted by a style attribute or an injected stylesheet.",
  };
</script>

<script lang="ts">
  import { Axis, Bars, Chart as LayerChart, Highlight, Svg } from "layerchart";
  import * as Card from "#lib/registry/ui/card";
  import * as Chart from "#lib/registry/ui/chart";
  import * as Table from "#lib/registry/ui/table";

  // Last week's visitors, by day.
  const week = [
    { day: "Mon", visitors: 412 },
    { day: "Tue", visitors: 538 },
    { day: "Wed", visitors: 497 },
    { day: "Thu", visitors: 561 },
    { day: "Fri", visitors: 433 },
    { day: "Sat", visitors: 188 },
    { day: "Sun", visitors: 164 },
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
    visitors: { label: "Visitors", swatch: "bg-chart-1" },
  } satisfies Chart.ChartConfig;
</script>

<div class="w-full" data-testid="keyboard-fixture">
  <Card.Root class="w-full" data-testid="chart-bars">
    <Card.Header>
      <Card.Title level={4}>Visitors</Card.Title>
      <Card.Description>Last week, by day.</Card.Description>
    </Card.Header>
    <Card.Content>
      <Chart.Container label="Visitors per weekday, last week" {config}>
        <LayerChart
          data={week}
          x="day"
          y="visitors"
          yDomain={[0, null]}
          yNice
          bandPadding={0.3}
          series={[{ key: "visitors", label: "Visitors", value: "visitors" }]}
          padding={{ left: 40, bottom: 24 }}
          tooltipContext={{ mode: "band" }}
        >
          {#snippet children()}
            <Svg>
              <Axis placement="left" grid rule ticks={6} />
              <Axis placement="bottom" rule />
              <!-- The hover band goes before the marks. -->
              <Highlight area />
              <Bars class="fill-chart-1" strokeWidth={0} />
            </Svg>
            <Chart.Tooltip />
          {/snippet}
        </LayerChart>
        {#snippet table()}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head scope="col">Day</Table.Head>
                <Table.Head scope="col" class="text-right">Visitors</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each week as row (row.day)}
                <Table.Row>
                  <Table.Cell>{days[row.day]}</Table.Cell>
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
</div>
