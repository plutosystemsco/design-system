<script lang="ts">
  import { DARK, FACES, FOUR, LIFTED, LIGHT, ORDER } from "../round-two.ts";
  import Ground from "./ground.svelte";
  import {
    clamp01,
    watchReducedMotion,
    watchVisible,
  } from "./device-motion.ts";

  // F9, first light (memo §6.4). A dot resolves into a world: one dot, the
  // 2×2 mark, 4×4, 8×8. Each step halves the radius and doubles the count
  // per side, so every step fills the same square and the 2×2 is the mark at
  // its own proportion. Loud form on the canvas: the ladder, with the four
  // colours at the 2×2 step only. Quiet form on graphite: one colour.

  /** A damped spring from 0 to 1, settled in about 0.6 s (J4). */
  function spring(s: number): number {
    if (s <= 0) return 0;
    const w = 17;
    const z = 0.48;
    const wd = w * Math.sqrt(1 - z * z);
    return (
      1 -
      Math.exp(-z * w * s) *
        (Math.cos(wd * s) + ((z * w) / wd) * Math.sin(wd * s))
    );
  }
  const mix = (a: number, b: number, k: number) => a + (b - a) * k;

  // The subject that emerges at 4×4 and 8×8: a search lens, as a halftone.
  function inside(u: number, v: number): boolean {
    const d = Math.hypot(u - 0.4375, v - 0.4375);
    if (d > 0.13 && d < 0.29) return true;
    const along = clamp01((u + v - 1.3) / 2 / 0.22);
    const px = 0.65 + along * 0.22;
    return Math.hypot(u - px, v - px) < 0.08;
  }
  function coverage(i: number, j: number, n: number): number {
    let hit = 0;
    for (let a = 0; a < 6; a++)
      for (let b = 0; b < 6; b++)
        if (inside((i + (a + 0.5) / 6) / n, (j + (b + 0.5) / 6) / n)) hit++;
    return hit / 36;
  }

  type Dot = { x: number; y: number; r: number; c: string; p: number };
  /** The four levels of the ladder in a square of side s at (x0, y0). */
  function ladder(
    x0: number,
    y0: number,
    s: number,
    tint: string[],
    ink: string,
  ) {
    return [0, 1, 2, 3].map((level) => {
      const n = 2 ** level;
      const pitch = s / n;
      const rmax = pitch / (2 * (1 + 0.08 / 0.3));
      const dots: Dot[] = [];
      for (let j = 0; j < n; j++)
        for (let i = 0; i < n; i++) {
          const cov = level < 2 ? 1 : coverage(i, j, n);
          dots.push({
            x: x0 + (i + 0.5) * pitch,
            y: y0 + (j + 0.5) * pitch,
            r: cov < 0.15 ? 0 : rmax * Math.sqrt(cov),
            c: level === 1 ? tint[j * 2 + i] : ink,
            p: level ? (j >> 1) * (n / 2) + (i >> 1) : 0,
          });
        }
      return dots;
    });
  }

  const FOUR_LIGHT = ORDER.map((k) => FOUR[k]);
  const BIG = ladder(32, 32, 232, FOUR_LIGHT, LIGHT.ink);
  const STEP_DOTS = ladder(8, 8, 120, FOUR_LIGHT, LIGHT.ink);
  const STAGES = ["query", "permission check", "results", "detail"];
  const LOADER = ladder(
    2,
    2,
    28,
    ORDER.map(() => LIFTED.blue),
    LIFTED.blue,
  );

  const AT = [1.2, 2, 2.8];
  const COLLAPSE = 5.8;
  const CYCLE = 6.8;

  // Small multiples: one day of requests at 1, 4 and 16 bins.
  const DAY = [3, 2, 2, 1, 2, 5, 9, 14, 16, 15, 13, 14, 12, 9, 6, 4];
  const BINS = [1, 4, 16].map((n) => {
    const per = 16 / n;
    const v = Array.from({ length: n }, (_, i) =>
      DAY.slice(i * per, (i + 1) * per).reduce((a, b) => a + b, 0),
    );
    const max = Math.max(...v);
    return { n, v: v.map((x) => x / max) };
  });

  let reduced = $state(false);
  let visible = $state(false);
  let paused = $state(false);
  let t = $state(0);
  let node: HTMLDivElement;

  /** The dots of a ladder at cycle time c, each with its fading parent tint. */
  function frame(L: Dot[][], c: number, at: number[], collapse: number) {
    const centre = L[0][0];
    if (c >= collapse) {
      const e = spring(c - collapse);
      return [
        ...L[3].map((d) => ({
          ...d,
          x: mix(d.x, centre.x, e),
          y: mix(d.y, centre.y, e),
          r: Math.max(0, mix(d.r, 0, e)),
          o: 0,
          pc: d.c,
        })),
        { ...centre, r: Math.max(0, mix(0, centre.r, e)), o: 0, pc: centre.c },
      ];
    }
    const k = at.filter((a) => c >= a).length;
    if (!k) return [{ ...centre, o: 0, pc: centre.c }];
    const s = c - at[k - 1];
    const e = spring(s);
    return L[k].map((d) => {
      const p = L[k - 1][d.p];
      return {
        ...d,
        x: mix(p.x, d.x, e),
        y: mix(p.y, d.y, e),
        r: Math.max(0, mix(p.r * 0.9, d.r, e)),
        o: 1 - clamp01(s / 0.3),
        pc: p.c,
      };
    });
  }

  const big = $derived(
    reduced
      ? BIG[3].map((d) => ({ ...d, o: 0, pc: d.c }))
      : frame(BIG, t % CYCLE, AT, COLLAPSE),
  );
  const small = $derived(
    reduced
      ? LOADER[3].map((d) => ({ ...d, o: 0, pc: d.c }))
      : frame(LOADER, t % 3.4, [0.5, 1.1, 1.7], 2.8),
  );
  const stage = $derived(
    reduced
      ? 3
      : AT.filter((a) => t % CYCLE >= a && t % CYCLE < COLLAPSE).length,
  );

  $effect(() => watchReducedMotion((r) => (reduced = r)));
  $effect(() => watchVisible(node, (v) => (visible = v)));
  $effect(() => {
    if (reduced || !visible || paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      t += Math.min(0.05, (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
</script>

{#snippet dots(list: (Dot & { o: number; pc: string })[])}
  {#each list as d, i (i)}
    {#if d.r > 0.05}
      <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} />
      {#if d.o > 0}
        <circle cx={d.x} cy={d.y} r={d.r} fill={d.pc} opacity={d.o} />
      {/if}
    {/if}
  {/each}
{/snippet}

<Ground
  caption="f9 · first light · a dot resolves into a world"
  style="--g-bg:{LIGHT.canvas};--g-text:{LIGHT.ink};--g-muted:{LIGHT.inkSoft};--g-line:{LIGHT.hairline}"
>
  <div
    class="f9"
    bind:this={node}
    style="--display:{FACES.display};--body:{FACES.body};--mono:{FACES.mono};--canvas:{LIGHT.canvas};--ink:{LIGHT.ink};--soft:{LIGHT.inkSoft};--hair:{LIGHT.hairline};--raised:{LIGHT.raised};--gr:{DARK.canvas};--gr-raised:{DARK.raised};--gr-line:{DARK.hairline};--gt:{DARK.text};--gm:{DARK.muted};--lift:{LIFTED.blue};--accent:{FOUR.blue}"
  >
    <div class="pane canvas">
      <p class="label">loud form · an owned moment, on the canvas</p>
      <svg
        viewBox="16 16 568 264"
        role="img"
        aria-label="One large ink dot splits into the four-dot mark in blue, red, yellow and green, then into a 4 by 4 and an 8 by 8 of ink dots whose sizes draw a search lens, beside the line Work runs on data."
      >
        <rect
          x="16.5"
          y="16.5"
          width="263"
          height="263"
          rx="8"
          fill={LIGHT.raised}
          stroke={LIGHT.hairline}
        />
        {@render dots(big)}
        <text x="312" y="66" class="line">Work runs</text>
        <text x="312" y="116" class="line">on data.</text>
        <text x="312" y="272" class="step">
          {4 ** stage} dot{stage ? "s" : ""} · {STAGES[stage]}
        </text>
      </svg>
      <ol
        class="ladder"
        aria-label="The ladder as a still: 1 dot, query; the 4-dot mark, permission check; 16 dots, results; 64 dots, detail."
      >
        {#each STEP_DOTS as level, k (k)}
          <li>
            <svg viewBox="0 0 136 136" aria-hidden="true">
              <rect
                x="0.5"
                y="0.5"
                width="135"
                height="135"
                rx="8"
                fill={LIGHT.raised}
                stroke={LIGHT.hairline}
              />
              {@render dots(level.map((d) => ({ ...d, o: 0, pc: d.c })))}
            </svg>
            <span>{4 ** k} · {STAGES[k]}</span>
          </li>
        {/each}
      </ol>
      <p class="note">
        {reduced
          ? "Composed end: the last frame, beside the ladder as a still."
          : "Each step a spring, every 800 ms: 1, 4, 16, 64. Colour only at the mark."}
      </p>
    </div>

    <div class="pane graphite">
      <p class="label">quiet form · one colour, on warm graphite</p>
      <div class="card">
        <svg viewBox="0 0 40 18" width="40" height="18" aria-hidden="true">
          <circle cx="8" cy="9" r="7" fill={LIFTED.blue} />
          <circle cx="24.5" cy="5.5" r="3.5" fill={LIFTED.blue} />
          <circle cx="33.5" cy="5.5" r="3.5" fill={LIFTED.blue} />
          <circle cx="24.5" cy="14.5" r="3.5" fill={LIFTED.blue} />
          <circle cx="33.5" cy="14.5" r="3.5" fill={LIFTED.blue} />
        </svg>
        <div>
          <p class="c-title">Summary first</p>
          <p class="c-meta">12 contracts renew in March · detail follows</p>
        </div>
      </div>

      <figure class="fig">
        <svg
          viewBox="0 0 360 120"
          role="img"
          aria-label="Figure 5. One day of requests at three levels of detail: one dot for the whole day, four dots for its quarters, sixteen for its hours. Dot area is the count; the busiest hours fall in the afternoon."
        >
          {#each BINS as b, k (b.n)}
            {@const x0 = k === 0 ? 0 : k === 1 ? 60 : 168}
            {@const w = k === 0 ? 44 : k === 1 ? 92 : 192}
            {#each b.v as v, i (i)}
              {@const pitch = w / b.n}
              <circle
                cx={x0 + (i + 0.5) * pitch}
                cy="50"
                r={Math.max(0.6, (Math.min(pitch, 44) / 2.533) * Math.sqrt(v))}
                fill={LIFTED.blue}
              />
            {/each}
            <text x={x0} y="104" class="tick g"
              >{b.n} bin{b.n > 1 ? "s" : ""}</text
            >
          {/each}
        </svg>
        <figcaption>
          <b>Fig. 5.</b> One day of requests at three levels of detail. Dot area is
          the count.
        </figcaption>
      </figure>

      <div class="loader">
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          role="img"
          aria-label="Loading: one dot doubles its detail, 1, 4, 16, 64."
        >
          {@render dots(small)}
        </svg>
        <span>loader, 32 px · determinate by doubling</span>
      </div>
    </div>

    <div class="foot">
      <p>One step at most every 600 ms. Pauses off-screen.</p>
      {#if !reduced}
        <button
          type="button"
          class="pause"
          aria-pressed={paused}
          onclick={() => (paused = !paused)}
        >
          <span class="glyph" class:play={paused} aria-hidden="true"></span>
          {paused ? "Play" : "Pause"} motion
        </button>
      {/if}
    </div>
  </div>
</Ground>

<style>
  .f9 {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    font-family: var(--body);
  }
  .pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 16px 20px 18px;
  }
  .canvas {
    background: var(--canvas);
    color: var(--ink);
    justify-content: center;
  }
  .graphite {
    background: var(--gr);
    color: var(--gt);
    gap: 16px;
  }
  .label,
  .note,
  .loader span,
  .foot p,
  .c-meta {
    margin: 0;
    font-family: var(--mono);
    font-size: 12px;
  }
  .canvas .label,
  .canvas .note,
  .foot p {
    color: var(--soft);
  }
  .graphite .label,
  .loader span,
  .c-meta {
    color: var(--gm);
  }
  .canvas .label {
    margin-bottom: 10px;
  }
  .note {
    margin-top: 8px;
  }
  svg {
    display: block;
    flex: none;
  }
  .canvas svg,
  .fig svg {
    width: 100%;
    height: auto;
  }
  .line {
    font-family: var(--display);
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.03em;
    fill: var(--ink);
  }
  .step {
    font-family: var(--mono);
    font-size: 14px;
    fill: var(--soft);
  }
  .tick {
    font-family: var(--mono);
    font-size: 12px;
    fill: var(--soft);
  }
  .ladder {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
  }
  .ladder li {
    min-width: 0;
  }
  .ladder svg {
    width: 100%;
    height: auto;
  }
  .ladder span {
    display: block;
    margin-top: 6px;
    font-family: var(--mono);
    font-size: 11px;
    line-height: 1.35;
    color: var(--soft);
  }
  .tick.g {
    fill: var(--gm);
  }
  .card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    background: var(--gr-raised);
    border: 1px solid var(--gr-line);
    border-radius: 8px;
  }
  .c-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  .fig {
    margin: 0;
  }
  figcaption {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.45;
  }
  .loader {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .foot {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 16px;
    padding: 10px 20px;
    border-top: 1px solid var(--hair);
  }
  .pause {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: 1px solid var(--ink);
    border-radius: 8px;
    background: var(--raised);
    color: var(--ink);
    font: 500 13px/1.2 var(--body);
    cursor: pointer;
  }
  .pause:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .glyph {
    width: 8px;
    height: 10px;
    border-left: 3px solid currentColor;
    border-right: 3px solid currentColor;
  }
  .glyph.play {
    width: 0;
    height: 0;
    border-right: 0;
    border-left: 9px solid currentColor;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
  @media (max-width: 760px) {
    .f9 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
