<script lang="ts">
  let {
    d,
    unit,
    markX,
    markY,
    side,
    wordWidth,
    viewBox,
    dot,
    gap,
    scale,
    lockupGap,
    rise,
  }: {
    /** The word's outline, from the downloads' generator. */
    d: string;
    unit: number;
    markX: number;
    markY: number;
    side: number;
    wordWidth: number;
    viewBox: [number, number, number, number];
    dot: number;
    gap: number;
    scale: number;
    lockupGap: number;
    rise: number;
  } = $props();

  const fills = ["fill-mark-1", "fill-mark-2", "fill-mark-3", "fill-mark-4"];
  const f = (v: number) => v.toFixed(2);
  const top = $derived(-markY / 100);
  const [x0, y0, w, h] = $derived(viewBox);
</script>

<!--
  The lockup, drawn to measure: the word at 100 units to its em, the mark at
  its scale (D), its distance from the word (E), its rise above the baseline
  (F) and its top (G). Below sm the letters hide; the list carries them.
-->
<svg
  data-slot="brand-figure"
  role="img"
  aria-label="The lockup drawn to measure: the mark at {f(
    scale,
  )} of the word's size, {f(lockupGap)} em from the word, its top {f(
    top,
  )} em above the baseline."
  viewBox="{x0 - 20} {y0 - 34} {w + 110} {h + 70}"
  class="block w-full max-w-2xl"
>
  <path {d} class="fill-foreground" />
  {#each fills as fill, k (fill)}
    <circle
      cx={markX + (dot / 2 + (k % 2) * (dot + gap)) * unit}
      cy={markY + (dot / 2 + Math.floor(k / 2) * (dot + gap)) * unit}
      r={(dot / 2) * unit}
      class={fill}
    />
  {/each}
  <g class="fill-none stroke-muted-foreground" stroke-width="0.8">
    <path d="M{x0 - 10} 0 H{markX + side + 70}" stroke-dasharray="3 3" />
    <path
      d="M{wordWidth} {markY - 10} H{markX} M{wordWidth} {markY - 14} V{markY -
        6} M{markX} {markY - 14} V{markY - 6}"
    />
    <path
      d="M{markX + side + 10} {markY} V{markY + side} M{markX +
        side +
        6} {markY} H{markX + side + 14} M{markX + side + 6} {markY +
        side} H{markX + side + 14}"
    />
    <path
      d="M{markX + side / 2} 0 V{markY + side} M{markX + side / 2 - 4} {markY +
        side} H{markX + side / 2 + 4}"
    />
    <path
      d="M{markX + side + 40} 0 V{markY} M{markX + side + 36} {markY} H{markX +
        side +
        44}"
    />
  </g>
  <g class="fill-foreground max-sm:hidden" font-size="11">
    <text x={markX + side + 16} y={markY + side / 2 + 4}>D</text>
    <text x={(wordWidth + markX) / 2} y={markY - 20} text-anchor="middle"
      >E</text
    >
    <text x={markX + side / 2 + 6} y={(markY + side) / 2 + 4}>F</text>
    <text x={markX + side + 48} y={markY / 2 + 4}>G</text>
  </g>
</svg>
