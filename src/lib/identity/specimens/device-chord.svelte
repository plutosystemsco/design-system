<script lang="ts">
  import { FACES, FOUR, LIFTED, LIGHT, ORDER, SCREEN } from "../round-two.ts";
  import Ground from "./ground.svelte";
  import {
    clamp01,
    watchReducedMotion,
    watchVisible,
  } from "./device-motion.ts";

  // F7, the chord (memo §6.2). A dot drawn as seven hairline chords, each
  // ending in two small dots: the dots are measured, the line between them is
  // inferred. Loud form on the stage: the four mark dots side by side, built
  // one row at a time. Quiet form on the canvas: one dot, one accent, and the
  // range chart it grows into.

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

  const ROWS = 7;
  /** The seven chords of a dot of radius r: offset from centre and half-length. */
  function chords(r: number) {
    const pitch = (2 * r) / ROWS;
    return Array.from({ length: ROWS }, (_, j) => {
      const dy = -r + (j + 0.5) * pitch;
      return { dy, half: Math.sqrt(r * r - dy * dy) };
    });
  }

  // The hero: four dots at the mark's spacing (dot .30 em, gap .08 em).
  const R = 52;
  const PITCH = 2 * R * (1 + 0.08 / 0.3);
  const X0 = (600 - (PITCH * 3 + 2 * R)) / 2 + R;
  const CY = 168;
  const HERO = chords(R);
  const ROW = (2 * R) / ROWS;
  const FENCE = [-2, -1, ROWS, ROWS + 1].map((j) => ({
    y: CY - R + (j + 0.5) * ROW,
    o: j === -2 || j === ROWS + 1 ? 0.1 : 0.2,
  }));

  const STEP = 0.7;
  const START = 0.6;
  const HOLD_END = START + ROWS * STEP + 3.2;
  const CYCLE = HOLD_END + 1;

  // The figure: when each source answered, in ms after the query.
  const SOURCES: { name: string; from?: number; to?: number }[] = [
    { name: "grep", from: 40, to: 180 },
    { name: "glob", from: 20, to: 90 },
    { name: "index", from: 60, to: 310 },
    { name: "docs" },
    { name: "mail", from: 120, to: 420 },
  ];
  const AX0 = 64;
  const AX1 = 384;
  const ax = (ms: number) => AX0 + ((AX1 - AX0) * ms) / 500;

  const SMALL = chords(14);

  let reduced = $state(false);
  let visible = $state(false);
  let paused = $state(false);
  let t = $state(0);
  let node: HTMLDivElement;

  // How far each hero row has opened, 0 to 1, and the drawing's opacity.
  const rows = $derived(
    HERO.map((_, j) =>
      reduced ? 1 : spring((t % CYCLE) - (START + j * STEP)),
    ),
  );
  const fade = $derived(
    reduced ? 1 : 1 - clamp01(((t % CYCLE) - HOLD_END) / 0.5),
  );

  // The small loader: rows every 0.35 s, then the solid dot fades in.
  const small = $derived.by(() => {
    const L = 4;
    const c = reduced ? 3.4 : t % L;
    return {
      rows: SMALL.map((_, j) => (reduced ? 1 : spring(c - j * 0.35))),
      solid: clamp01((c - ROWS * 0.35) / 0.4),
      fade: reduced ? 1 : 1 - clamp01((c - 3.6) / 0.3),
    };
  });
  // The indeterminate loader: a flat light curve with a dip that travels.
  const curve = $derived.by(() => {
    const at = reduced ? 48 : ((t * 40) % 128) - 16;
    const pts: string[] = [];
    for (let x = 0; x <= 96; x += 1) {
      const d = Math.abs(x - at);
      const k = d < 3 ? 1 : d < 6 ? 1 - (d - 3) / 3 : 0;
      pts.push(`${x},${(5 + 6 * k).toFixed(2)}`);
    }
    return pts.join(" ");
  });

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

{#snippet chordDot(
  cx: number,
  cy: number,
  set: { dy: number; half: number }[],
  open: number[],
  colour: string,
  end: number,
  width: number,
)}
  {#each set as c, j (j)}
    {@const h = c.half * open[j]}
    {#if open[j] > 0.001}
      <path
        d="M{cx - h} {cy + c.dy}H{cx + h}"
        stroke={colour}
        stroke-width={width}
      />
      <circle cx={cx - h} cy={cy + c.dy} r={end} fill={colour} />
      <circle cx={cx + h} cy={cy + c.dy} r={end} fill={colour} />
    {/if}
  {/each}
{/snippet}

<Ground
  caption="f7 · the chord · each observer sees one line; the ends draw the shape"
  style="--g-bg:{LIGHT.canvas};--g-text:{LIGHT.ink};--g-muted:{LIGHT.inkSoft};--g-line:{LIGHT.hairline}"
>
  <div
    class="f7"
    bind:this={node}
    style="--display:{FACES.display};--body:{FACES.body};--mono:{FACES.mono};--stage:{SCREEN.ground};--st:{SCREEN.text};--sm:{SCREEN.muted};--canvas:{LIGHT.canvas};--ink:{LIGHT.ink};--soft:{LIGHT.inkSoft};--hair:{LIGHT.hairline};--raised:{LIGHT.raised};--accent:{FOUR.blue}"
  >
    <div class="pane stage">
      <p class="label">loud form · an owned moment, on the stage</p>
      <svg
        viewBox="0 0 600 400"
        role="img"
        aria-label="Four dots side by side, blue, red, yellow and green, each drawn as seven horizontal chords that end in two small dots. Faint full-width lines above and below are observers who saw nothing. The chords build one row at a time, top to bottom, above the line Work runs on data."
      >
        {#each FENCE as f, i (i)}
          <path
            d="M24 {f.y}H576"
            stroke={SCREEN.text}
            stroke-opacity={f.o}
            stroke-width="1"
          />
        {/each}
        <g opacity={fade}>
          {#each ORDER as name, i (name)}
            {@render chordDot(
              X0 + i * PITCH,
              CY,
              HERO,
              rows,
              LIFTED[name],
              R / 12,
              1.25,
            )}
          {/each}
        </g>
        <text x="24" y="336" class="line">Work runs on data.</text>
      </svg>
      <p class="note">
        {reduced
          ? "Composed end: every chord drawn, its two ends measured."
          : "One row every 700 ms; the end dots spring apart, the chord follows."}
      </p>
    </div>

    <div class="pane canvas">
      <p class="label">quiet form · one accent, on the canvas</p>
      <div class="result">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          {@render chordDot(
            16,
            16,
            SMALL,
            SMALL.map(() => 1),
            FOUR.blue,
            1.3,
            1,
          )}
        </svg>
        <div>
          <p class="r-title">Partial result</p>
          <p class="r-meta">3 of 5 sources answered · docs and mail pending</p>
        </div>
      </div>

      <figure class="fig">
        <svg
          viewBox="0 0 400 196"
          role="img"
          aria-label="Figure 2, a range chart. Each source is a row: a blue dot where its answer began and one where it ended, joined by a line. grep 40 to 180 ms, glob 20 to 90, index 60 to 310, mail 120 to 420. docs gave no answer and shows only a faint line."
        >
          {#each [0, 100, 200, 300, 400, 500] as ms (ms)}
            <path
              d="M{ax(ms)} 8V160"
              stroke={LIGHT.hairline}
              stroke-width="1"
            />
            <text x={ax(ms)} y="178" class="tick" text-anchor="middle"
              >{ms}</text
            >
          {/each}
          {#each SOURCES as s, i (s.name)}
            {@const y = 22 + i * 30}
            <text x="0" y={y + 4} class="tick">{s.name}</text>
            {#if s.from !== undefined && s.to !== undefined}
              <path
                d="M{ax(s.from)} {y}H{ax(s.to)}"
                stroke={FOUR.blue}
                stroke-width="1"
              />
              <circle cx={ax(s.from)} cy={y} r="3.5" fill={FOUR.blue} />
              <circle cx={ax(s.to)} cy={y} r="3.5" fill={FOUR.blue} />
            {:else}
              <path
                d="M{AX0} {y}H{AX1}"
                stroke={LIGHT.inkSoft}
                stroke-opacity="0.45"
                stroke-width="1"
              />
            {/if}
          {/each}
          <text x={AX1} y="194" class="tick" text-anchor="end">ms</text>
        </svg>
        <figcaption>
          <b>Fig. 2.</b> When each source answered. Dots are measured; lines are inferred.
          Docs saw nothing.
        </figcaption>
      </figure>

      <div class="loaders">
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          role="img"
          aria-label="Loading: a dot built chord by chord, top to bottom."
        >
          <g opacity={small.fade}>
            <circle
              cx="16"
              cy="16"
              r="14"
              fill={FOUR.blue}
              opacity={small.solid}
            />
            {@render chordDot(16, 16, SMALL, small.rows, FOUR.blue, 1.3, 1)}
          </g>
        </svg>
        <span>determinate, 32 px</span>
        <svg
          viewBox="0 0 96 16"
          width="96"
          height="16"
          role="img"
          aria-label="Loading: a flat light curve with a short dip that travels along it."
        >
          <polyline
            points={curve}
            fill="none"
            stroke={FOUR.blue}
            stroke-width="1"
          />
        </svg>
        <span>indeterminate, 96 × 16</span>
      </div>
    </div>

    <div class="foot">
      <p>
        Only the end dots spring; each chord follows them. Pauses off-screen.
      </p>
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
  .f7 {
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
  .stage {
    background: var(--stage);
    color: var(--st);
    justify-content: center;
  }
  .canvas {
    background: var(--canvas);
    color: var(--ink);
    gap: 16px;
  }
  .label,
  .note,
  .loaders span,
  .foot p,
  .r-meta {
    margin: 0;
    font-family: var(--mono);
    font-size: 12px;
  }
  .stage .label,
  .stage .note {
    color: var(--sm);
  }
  .canvas .label,
  .loaders span,
  .foot p,
  .r-meta {
    color: var(--soft);
  }
  .stage .label {
    margin-bottom: 10px;
  }
  .note {
    margin-top: 8px;
  }
  svg {
    display: block;
    flex: none;
  }
  .stage svg,
  .fig svg {
    width: 100%;
    height: auto;
  }
  .line {
    font-family: var(--display);
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.03em;
    fill: var(--st);
  }
  .result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: var(--raised);
    border: 1px solid var(--hair);
    border-radius: 8px;
  }
  .r-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  .fig {
    margin: 0;
    max-width: 440px;
  }
  .tick {
    font-family: var(--mono);
    font-size: 11px;
    fill: var(--soft);
  }
  figcaption {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.45;
  }
  .loaders {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 12px;
  }
  .loaders span + svg {
    margin-left: 12px;
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
    .f7 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
