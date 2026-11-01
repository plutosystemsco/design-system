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
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // Last week's visitors, by day.
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

  const visitorsConfig = {
    visitors: { label: "Visitors", swatch: "bg-chart-1" },
  } satisfies Chart.ChartConfig;
  const twoConfig = {
    views: { label: "Page views", swatch: "bg-chart-1" },
    visitors: { label: "Visitors", swatch: "bg-chart-2" },
  } satisfies Chart.ChartConfig;
</script>

<ItemHeader name="chart" />

{#snippet visitorsChart()}
  <Card.Root class="w-full" data-testid="chart-bars">
    <Card.Header>
      <Card.Title level={3}>Visitors</Card.Title>
      <Card.Description>Last week, by day.</Card.Description>
    </Card.Header>
    <Card.Content>
      <Chart.Container
        label="Visitors per weekday, last week"
        config={visitorsConfig}
      >
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
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A figure named by its caption, with its data behind “Show as table”. The marks take their colour from a token class on the mark, or a var() prop; nothing is painted by a style attribute or an injected stylesheet. Two series are told apart by their marks, bars against a line, because no two chart colours differ by 3:1."
>
  <div class="grid gap-8">
    <Specimen
      caption="one series · bars · fill-chart-1 · tooltip · table · the keyboard fixture"
      class="w-full"
    >
      <div class="w-full" data-testid="keyboard-fixture">
        {@render visitorsChart()}
      </div>
    </Specimen>
    <Specimen
      caption="two series · bars and a spline · stroke-chart-2 · labelled"
      class="w-full"
    >
      <Card.Root class="w-full" data-testid="chart-two-series">
        <Card.Header>
          <Card.Title level={3}>Page views and visitors</Card.Title>
          <Card.Description
            >Last week, by day. Bars are page views; the line is visitors.</Card.Description
          >
        </Card.Header>
        <Card.Content>
          <Chart.Container
            label="Page views (bars) and visitors (line) per weekday, last week"
            config={twoConfig}
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
                    <Table.Head scope="col" class="text-right"
                      >Page views</Table.Head
                    >
                    <Table.Head scope="col" class="text-right"
                      >Visitors</Table.Head
                    >
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
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="A figure has two states: before its script runs and after."
>
  <dl class="grid max-w-prose gap-4 text-sm">
    <div class="grid gap-1">
      <dt class="font-medium">Prerendered</dt>
      <dd class="text-muted-foreground">
        layerchart draws nothing on the server. The HTML holds the figure, its
        caption and its table behind “Show as table”; the chart box is empty
        until the page hydrates, and then the figure appears complete, with no
        motion.
      </dd>
    </div>
    <div class="grid gap-1">
      <dt class="font-medium"><code>captionHidden</code></dt>
      <dd class="text-muted-foreground">
        When the card around the figure already says what it shows, the caption
        can be kept for assistive technology only. The figure is still named by
        it.
      </dd>
    </div>
  </dl>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <strong>Every figure has a name and a table.</strong> layerchart exposes a
      chart's tick labels and nothing else: its marks are invisible to assistive
      technology and its tooltip opens only for a pointer. The required
      <code>label</code> is the figure's visible caption and its accessible
      name; the <code>table</code> snippet is the data for keyboard and screen-reader
      users, and the only content a prerender holds.
    </li>
    <li>
      <strong>Series are told by mark or label, never by colour alone.</strong>
      No two chart colours differ from each other by 3:1. One series per figure where
      the data allows; otherwise bars against a line, or labels on the marks. A legend
      alone is not enough. A light figure that uses
      <code>chart-3</code>
      (amber) labels that series directly.
    </li>
    <li>
      <strong>Colour by token class or <code>var()</code> prop.</strong>
      <code>class="fill-chart-1"</code> on a mark, or
      <code>fill="var(--chart-1)"</code>; the simplified charts take
      <code>series: [&#123; color: "var(--chart-1)" &#125;]</code>. The
      tooltip's indicator is the series' <code>swatch</code> class, such as
      <code>bg-chart-1</code>. Nothing here writes a <code>style</code>
      attribute. The hover band behind the marks is the opaque
      <code>muted</code> inset, not layerchart's tint, so render
      <code>Highlight area</code> before the marks.
    </li>
    <li>
      <strong>No motion.</strong> These components pass no <code>motion</code>;
      a figure appears complete. An app that tweens on a data change reads
      <code>prefers-reduced-motion</code> itself and stays within 200 ms.
    </li>
    <li>
      The tooltip sits on the elevation shadow, as a popover does. It is the
      pointer's affordance; "Show as table" is the keyboard's.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the bar chart's “Show as table” summary, in the first figure above. Enter shows the table. The tooltip has no keyboard path; the table is it."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    The fixture is the first figure under Variants, so this page holds two
    figures and two tables.
  </p>
</PreviewSection>
