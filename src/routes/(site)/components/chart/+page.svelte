<script lang="ts">
  import * as colours from "#lib/site/examples/chart/colours.svelte";
  import * as twoSeries from "#lib/site/examples/chart/two-series.svelte";
  import * as variants from "#lib/site/examples/chart/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="chart"
  examples={{ variants, "two-series": twoSeries, colours }}
>
  {#snippet when()}
    <p>
      Use a chart when the shape of the data matters: a trend, a peak, a
      comparison. When the reader needs the exact numbers, a table is enough.
      Every chart here carries its table too.
    </p>
    <p>Two things shape what a figure shows.</p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        <strong>Prerendered.</strong> layerchart draws nothing on the server. The
        HTML holds the figure, its caption and its table behind “Show as table”. The
        chart box stays empty until the page's script runs. Then the figure appears
        complete, with no motion.
      </li>
      <li>
        <strong><code>captionHidden</code>.</strong> When the card around the figure
        already says what it shows, keep the caption for assistive technology only.
        It still names the figure.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Give every figure a <code>label</code> and a <code>table</code>.</li>
    <li>Show one series per figure where the data allows.</li>
    <li>
      Colour a mark with a token class, such as <code>fill-chart-1</code>.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Tell two series apart by colour alone. Use bars against a line, or labels.
    </li>
    <li>Rely on a legend alone.</li>
    <li>Paint a mark with a <code>style</code> attribute.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>Every figure has a name and a table.</strong> layerchart exposes a
      chart's tick labels and nothing else. Its marks are invisible to assistive
      technology, and its tooltip opens only for a pointer. The required
      <code>label</code>
      is the figure's visible caption and its accessible name. The
      <code>table</code> snippet is the data for keyboard and screen-reader users,
      and the only content a prerender holds.
    </li>
    <li>
      <strong>Series are told by mark or label, never by colour alone.</strong>
      No two chart colours reach 3:1 against each other. Show one series per figure
      where the data allows. Otherwise use bars against a line, or labels on the marks.
      A legend alone is not enough. A light figure that uses
      <code>chart-3</code>
      (yellow) labels that series directly.
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
    <li>
      Each figure has one keyboard stop, its “Show as table” summary. Enter or
      Space opens the table. The tooltip has no keyboard path; the table takes
      its place.
    </li>
  {/snippet}
</Component>
