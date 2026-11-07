<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import Ground from "./ground.svelte";
  import {
    clamp01,
    easeInOut,
    seeded,
    watchReducedMotion,
    watchVisible,
  } from "./device-motion.ts";

  // F4, streams: scattered dots, left to right, stream into a table and
  // settle in rows by kind. Plays once when it comes on screen, pauses when
  // it leaves, and replays on request.
  const p = TODAY;
  const H = 340;
  const PITCH = 22;
  const LABEL_W = 108;
  const PAD = 20;
  const TOP = 64;
  const ROW_GAP = 64;
  const DURATION = 3.6;
  const KINDS = [
    { name: "contracts", c: p.blueLifted },
    { name: "invoices", c: p.redLifted },
    { name: "notes", c: p.yellowLifted },
    { name: "mail", c: p.greenLifted },
  ];

  let width = $state(0);
  let progress = $state(0);
  let reduced = $state(false);
  let visible = $state(false);
  let playing = $state(false);
  let node: HTMLDivElement;

  const avail = $derived(Math.max(60, width - LABEL_W - PAD * 2 - 6));
  const cols = $derived(
    Math.max(4, Math.min(32, Math.floor(avail / PITCH) + 1)),
  );
  const pitch = $derived(avail / (cols - 1));

  type Dot = {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    c: string;
    delay: number;
  };
  const dots = $derived.by<Dot[]>(() => {
    const rnd = seeded(23);
    const list: Dot[] = [];
    KINDS.forEach((k, r) => {
      for (let i = 0; i < cols; i++) {
        const sx = PAD + rnd() * (width - PAD * 2);
        const sy = 24 + rnd() * (H - 48);
        list.push({
          sx,
          sy,
          tx: LABEL_W + PAD + i * pitch,
          ty: TOP + r * ROW_GAP,
          c: k.c,
          delay: (sx / Math.max(1, width)) * 0.9 + rnd() * 0.1,
        });
      }
    });
    return list;
  });

  function at(d: Dot, P: number) {
    const k = easeInOut(clamp01((P * 1.6 - d.delay) / 0.6));
    // A quadratic path: leave level, then turn into the row.
    const mx = d.sx + (d.tx - d.sx) * 0.7;
    const my = d.sy;
    const u = 1 - k;
    return {
      x: u * u * d.sx + 2 * u * k * mx + k * k * d.tx,
      y: u * u * d.sy + 2 * u * k * my + k * k * d.ty,
      k,
    };
  }

  const shown = $derived(reduced ? 1 : progress);
  const placed = $derived(dots.map((d) => at(d, shown)));
  const settled = $derived(placed.filter((d) => d.k >= 1).length);
  const finished = $derived(shown >= 1);

  $effect(() => watchReducedMotion((r) => (reduced = r)));
  $effect(() =>
    watchVisible(node, (v) => {
      visible = v;
      if (v && progress === 0) playing = true;
    }),
  );

  $effect(() => {
    if (reduced || !visible || !playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      progress = Math.min(1, progress + (now - last) / 1000 / DURATION);
      last = now;
      if (progress < 1) raf = requestAnimationFrame(tick);
      else playing = false;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  function replay() {
    progress = reduced ? 1 : 0;
    playing = !reduced;
  }
</script>

<Ground ground="stage" caption="f4 · streams · content becoming data">
  <div
    class="f4"
    bind:this={node}
    style="--mono:{TYPE.D5.mono};--body:{TYPE.D5
      .body};--t:{p.stageText};--m:{p.stageMuted};--a:{p.blueLifted};--ink:{p.ink}"
  >
    <div class="top">
      <p class="count">
        <span class="num">{settled}</span> of {dots.length} files indexed
      </p>
      <button type="button" class="replay" onclick={replay}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M3 8a5 5 0 1 0 1.6-3.7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M3 2.5v3h3"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Replay
      </button>
    </div>

    <div class="field" bind:clientWidth={width}>
      {#if width > 0}
        <svg
          {width}
          height={H}
          viewBox="0 0 {width} {H}"
          role="img"
          aria-label="Scattered coloured dots stream from left to right and settle into four rows: contracts, invoices, notes and mail."
        >
          {#each KINDS as k, r (k.name)}
            {@const y = TOP + r * ROW_GAP}
            <line
              x1={PAD}
              x2={width - PAD}
              y1={y + ROW_GAP / 2}
              y2={y + ROW_GAP / 2}
              stroke="#F7F7F4"
              stroke-opacity={r < KINDS.length - 1 ? 0.07 * shown : 0}
            />
            <text x={PAD} y={y + 4} class="row" opacity={0.25 + 0.75 * shown}
              >{k.name}</text
            >
          {/each}
          <text x={PAD} y="26" class="head" opacity={shown}>kind</text>
          <text x={LABEL_W + PAD} y="26" class="head" opacity={shown}
            >files →</text
          >
          {#each placed as d, i (i)}
            <circle
              cx={d.x}
              cy={d.y}
              r={3.4 + d.k * 1.6}
              fill={dots[i].c}
              opacity={0.55 + 0.45 * d.k}
            />
          {/each}
        </svg>
      {/if}
    </div>

    <p class="status" aria-live="polite">
      {finished
        ? `Sorted: ${dots.length} files into ${KINDS.length} kinds, ready to search.`
        : "Streaming…"}
    </p>
  </div>
</Ground>

<style>
  .f4 {
    display: flex;
    flex-direction: column;
    color: var(--t);
    font-family: var(--body);
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px 0;
  }
  .count {
    margin: 0;
    font-family: var(--mono);
    font-size: 13px;
    color: var(--m);
  }
  .num {
    display: inline-block;
    min-width: 2ch;
    text-align: right;
    color: var(--t);
    font-variant-numeric: tabular-nums;
  }
  .replay {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid #f7f7f433;
    border-radius: 999px;
    background: transparent;
    color: var(--t);
    font: 500 14px/1.2 var(--body);
    cursor: pointer;
  }
  .replay:hover {
    background: #f7f7f414;
  }
  .replay:focus-visible {
    outline: 2px solid var(--a);
    outline-offset: 3px;
  }
  .field {
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  svg {
    display: block;
  }
  .row,
  .head {
    font-family: var(--mono);
    font-size: 12px;
    fill: #9aa0ad;
  }
  .head {
    font-size: 11px;
    letter-spacing: 0.08em;
  }
  .status {
    margin: 0;
    padding: 0 20px 18px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--m);
  }
</style>
