<script lang="ts">
  type Step = { minPx: number; maxPx: number; lineHeight: number };
  let { steps }: { steps: [string, Step][] } = $props();

  // One unit to the CSS pixel. Each row holds the step's em box at its
  // smallest and at its largest, and its line at the largest leading.
  const GAP = 28;
  const LABEL = 96;
  const rows = $derived.by(() => {
    let y = 0;
    return steps.map(([name, s]) => {
      const row = { name, s, y };
      y += s.maxPx * Math.max(1, s.lineHeight) + GAP;
      return row;
    });
  });
  const height = $derived(
    rows.reduce((h, r) => h + r.s.maxPx * Math.max(1, r.s.lineHeight) + GAP, 0),
  );
  // The largest boxes line up, past the widest of the smallest.
  const smallest = $derived(Math.max(...steps.map(([, s]) => s.minPx)));
  const widest = $derived(Math.max(...steps.map(([, s]) => s.minPx + s.maxPx)));
</script>

<!--
  The display ladder, drawn to measure: each step's em box at its smallest
  and largest size, and its line height at the largest. Below sm the labels
  hide; the list carries every step.
-->
<svg
  data-slot="brand-figure"
  role="img"
  aria-label="The display ladder drawn to measure: {steps
    .map(
      ([n, s]) =>
        `${n}, ${s.minPx} to ${s.maxPx} pixels, leading ${s.lineHeight}`,
    )
    .join('; ')}."
  viewBox="0 -8 {LABEL + widest + 3 * GAP + 80} {height + 8}"
  class="block w-full max-w-3xl"
>
  {#each rows as r (r.name)}
    <g transform="translate(0 {r.y})">
      <rect
        x={LABEL}
        y={r.s.maxPx - r.s.minPx}
        width={r.s.minPx}
        height={r.s.minPx}
        class="fill-muted stroke-border"
      />
      <rect
        x={LABEL + smallest + GAP}
        y="0"
        width={r.s.maxPx}
        height={r.s.maxPx}
        class="fill-mark-1"
      />
      <path
        d="M{LABEL + smallest + r.s.maxPx + 2 * GAP} 0 V{r.s.maxPx *
          r.s.lineHeight}"
        class="fill-none stroke-foreground"
        stroke-width="2"
      />
      <g class="fill-foreground max-sm:hidden" font-size="14">
        <text x="0" y={r.s.maxPx / 2 + 5} font-weight="600">{r.name}</text>
        <text x={LABEL} y={r.s.maxPx + 18}>{r.s.minPx} px</text>
        <text x={LABEL + smallest + GAP} y={r.s.maxPx + 18}>{r.s.maxPx} px</text
        >
        <text
          x={LABEL + smallest + r.s.maxPx + 2 * GAP + 8}
          y={(r.s.maxPx * r.s.lineHeight) / 2 + 5}>{r.s.lineHeight}</text
        >
      </g>
    </g>
  {/each}
</svg>
