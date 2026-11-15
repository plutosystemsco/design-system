<script lang="ts">
  let {
    dot,
    gap,
  }: {
    /** The token file's `mark.dot`, in em. */
    dot: number;
    /** The token file's `mark.gap`, in em. */
    gap: number;
  } = $props();

  // The drawing's units: 100 to the em.
  const U = 100;
  const side = $derived((2 * dot + gap) * U);
  const fills = ["fill-mark-1", "fill-mark-2", "fill-mark-3", "fill-mark-4"];
  const f = (v: number) => v.toFixed(2);
</script>

<!--
  The mark, drawn to measure from the token file: its dot (A), its gap (B)
  and its side (C). Below sm the letters hide and the list under the figure
  carries every dimension.
-->
<svg
  data-slot="brand-figure"
  role="img"
  aria-label="The mark drawn to measure: dots {f(dot)} em across, {f(
    gap,
  )} em apart, {f(2 * dot + gap)} em on a side."
  viewBox="-36 -32 {side + 72} {side + 72}"
  class="block w-full max-w-md"
>
  {#each fills as fill, k (fill)}
    <circle
      cx={(dot / 2 + (k % 2) * (dot + gap)) * U}
      cy={(dot / 2 + Math.floor(k / 2) * (dot + gap)) * U}
      r={(dot / 2) * U}
      class={fill}
    />
  {/each}
  <g class="fill-none stroke-muted-foreground" stroke-width="0.6">
    <path d="M0 -12 H{dot * U} M0 -16 V-8 M{dot * U} -16 V-8" />
    <path
      d="M{dot * U} {side + 12} H{(dot + gap) * U} M{dot * U} {side +
        8} V{side + 16} M{(dot + gap) * U} {side + 8} V{side + 16}"
    />
    <path d="M-12 0 V{side} M-16 0 H-8 M-16 {side} H-8" />
  </g>
  <g class="fill-foreground max-sm:hidden" font-size="9" text-anchor="middle">
    <text x={(dot / 2) * U} y="-20">A {f(dot)} em</text>
    <text x={(dot + gap / 2) * U} y={side + 28}>B {f(gap)} em</text>
    <text x="-22" y={side / 2} transform="rotate(-90 -22 {side / 2})"
      >C {f(2 * dot + gap)} em</text
    >
  </g>
</svg>
