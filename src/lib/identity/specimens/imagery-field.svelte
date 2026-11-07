<script lang="ts">
  import type { Look } from "../look.ts";

  // M4, abstract data: the device as art. The mark is set as a halftone of
  // dots, each dot one colour, with its four discs sending rings outward.
  // Where two rings meet, each dot takes the stronger one, so the colours
  // touch at edges and never blend.
  let { look, label }: { look: Look; label: string } = $props();
  const p = $derived(look.palette);

  const W = 1200;
  const H = 560;
  const STEP = 16;
  const R = 92;
  const GAP = 28;
  const CX = 860;
  const CY = 280;
  const off = R + GAP / 2;
  const SOURCES = [
    { x: CX - off, y: CY - off },
    { x: CX + off, y: CY - off },
    { x: CX - off, y: CY + off },
    { x: CX + off, y: CY + off },
  ];

  type Dot = { x: number; y: number; r: number; s: number; o: number };
  const DOTS: Dot[] = [];
  for (let y = STEP / 2; y < H; y += STEP) {
    for (let x = STEP / 2; x < W; x += STEP) {
      // The rings fade toward the left, where the campaign line sits.
      const q = Math.min(1, Math.max(0, (x - 120) / 520));
      const quiet = q * q * (3 - 2 * q);
      let best = 0;
      let which = 0;
      SOURCES.forEach((src, i) => {
        const d = Math.hypot(x - src.x, y - src.y);
        const out = d - R;
        const v =
          out <= 0
            ? 1
            : Math.exp(-out / 300) *
              Math.pow(0.5 + 0.5 * Math.cos((2 * Math.PI * out) / 80), 2) *
              0.85 *
              quiet;
        if (v > best) {
          best = v;
          which = i;
        }
      });
      const r = 0.9 + 6 * best;
      DOTS.push({
        x,
        y,
        r: Math.min(r, STEP / 2 - 0.8),
        s: best > 0.1 ? which : -1,
        o: best > 0.1 ? 0.35 + 0.65 * best : 1,
      });
    }
  }

  const colours = $derived([
    p.blueLifted,
    p.redLifted,
    p.yellowLifted,
    p.greenLifted,
  ]);
</script>

<figure
  class="m4"
  aria-label={label}
  style="--g:{p.stage};--t:{p.stageText};--m:{p.stageMuted};--fd:{look.type
    .display};--fm:{look.type.mono};--dw:{look.type.displayWeight}"
>
  <svg
    viewBox="0 0 {W} {H}"
    aria-hidden="true"
    preserveAspectRatio="xMaxYMid slice"
  >
    {#each DOTS as d (d.x + "," + d.y)}
      <circle
        cx={d.x}
        cy={d.y}
        r={d.r.toFixed(2)}
        fill={d.s < 0 ? "#F7F7F4" : colours[d.s]}
        fill-opacity={d.s < 0 ? 0.09 : d.o.toFixed(2)}
      />
    {/each}
  </svg>
  <figcaption class="overlay">
    <p class="line">Work runs on data.</p>
    <p class="credit">
      Campaign artwork, rendered from the four-dot device. 2,625 dots, one
      colour each.
    </p>
  </figcaption>
</figure>

<style>
  .m4 {
    position: relative;
    margin: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--g);
    color: var(--t);
    width: 100%;
    height: clamp(420px, 46.6vw, 600px);
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .overlay {
    position: absolute;
    left: clamp(20px, 4vw, 56px);
    bottom: clamp(20px, 4vw, 48px);
    max-width: 30rem;
    padding-right: 16px;
  }
  .line {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: clamp(36px, 5vw, 72px);
    line-height: 0.95;
    letter-spacing: -0.045em;
  }
  @media (max-width: 640px) {
    .m4 {
      height: auto;
      display: flex;
      flex-direction: column-reverse;
    }
    svg {
      position: relative;
      height: 300px;
    }
    .overlay {
      position: static;
      padding: 24px 20px 4px;
      max-width: none;
    }
  }
  .credit {
    margin-top: 16px;
    font-family: var(--fm);
    font-size: 12px;
    line-height: 1.5;
    color: var(--m);
  }
</style>
