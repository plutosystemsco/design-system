<script lang="ts">
  import { FACES, FOUR, LIFTED, LIGHT, SCREEN } from "../round-two.ts";
  import Ground from "./ground.svelte";
  import { watchReducedMotion, watchVisible } from "./device-motion.ts";

  // F8, the barycentre (memo §6.3). A large dot and a half-size one turn
  // around a small cross that belongs to neither: 1.8 R from the large dot,
  // so it sits outside it. Loud form on the stage: the mark's two rows as two
  // pairs, blue with red and yellow with green, turning a quarter at a time
  // around one cross. Quiet form on the canvas: one pair, one accent.

  /** A damped spring from 0 to 1, settled in about 0.6 s (J4). */
  function spring(s: number): number {
    if (s <= 0) return 0;
    const w = 15;
    const z = 0.42;
    const wd = w * Math.sqrt(1 - z * z);
    return (
      1 -
      Math.exp(-z * w * s) *
        (Math.cos(wd * s) + ((z * w) / wd) * Math.sin(wd * s))
    );
  }

  /** A pair at angle a: the large dot 1.8 R out, the small one 4 R the other way. */
  function pair(cx: number, cy: number, r: number, a: number) {
    return {
      big: { x: cx + 1.8 * r * Math.cos(a), y: cy + 1.8 * r * Math.sin(a), r },
      small: {
        x: cx - 4 * r * Math.cos(a),
        y: cy - 4 * r * Math.sin(a),
        r: r / 2,
      },
    };
  }

  const CX = 300;
  const CY = 168;
  const R = 30;
  // Four quarter turns, one every second, then a rest.
  const STEPS = [0.6, 1.6, 2.6, 3.6];
  const CYCLE = 6.4;

  // The figure: weighted pairs; the cross falls where the weights balance.
  const PAIRS = [
    { a: "search", b: "index", wa: 3, wb: 1 },
    { a: "mail", b: "calendar", wa: 2, wb: 1 },
    { a: "docs", b: "sheets", wa: 1, wb: 1 },
  ];
  const FX1 = 40;
  const FX2 = 220;

  let reduced = $state(false);
  let visible = $state(false);
  let paused = $state(false);
  let t = $state(0);
  let node: HTMLDivElement;

  const turn = $derived.by(() => {
    if (reduced) return 0;
    const c = t % CYCLE;
    return (Math.PI / 2) * STEPS.reduce((sum, at) => sum + spring(c - at), 0);
  });
  const a = $derived(pair(CX, CY, R, turn));
  const b = $derived(pair(CX, CY, R, turn + Math.PI / 2));

  // The loader: a quarter turn every 650 ms, without rest.
  const spin = $derived.by(() => {
    if (reduced) return -Math.PI / 6;
    const n = Math.floor(t / 0.65);
    return -Math.PI / 6 + (Math.PI / 2) * (n + spring(t - n * 0.65));
  });
  const ld = $derived(pair(16, 16, 3.5, spin));
  const BADGE = pair(21, 12, 4.5, 0);

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

{#snippet cross(x: number, y: number, len: number, colour: string)}
  <path
    d="M{x - len / 2} {y}H{x + len / 2}M{x} {y - len / 2}V{y + len / 2}"
    stroke={colour}
    stroke-width="1"
  />
{/snippet}

<Ground
  caption="f8 · the barycentre · two bodies turn around a point that belongs to neither"
  style="--g-bg:{LIGHT.canvas};--g-text:{LIGHT.ink};--g-muted:{LIGHT.inkSoft};--g-line:{LIGHT.hairline}"
>
  <div
    class="f8"
    bind:this={node}
    style="--display:{FACES.display};--body:{FACES.body};--mono:{FACES.mono};--stage:{SCREEN.ground};--st:{SCREEN.text};--sm:{SCREEN.muted};--canvas:{LIGHT.canvas};--ink:{LIGHT.ink};--soft:{LIGHT.inkSoft};--hair:{LIGHT.hairline};--raised:{LIGHT.raised};--accent:{FOUR.blue}"
  >
    <div class="pane stage">
      <p class="label">loud form · an owned moment, on the stage</p>
      <svg
        viewBox="0 0 600 410"
        role="img"
        aria-label="A small cross labelled the kernel. Around it turn two pairs of dots: a large blue dot with a small red one, and a large yellow dot with a small green one. Each large dot sits just off the cross, each small dot far out on the other side. They turn a quarter at a time, above the line Work runs on data."
      >
        <path
          d="M{CX - 8} {CY - 8}L{CX - 104} {CY - 104}H{CX - 116}"
          stroke={SCREEN.text}
          stroke-opacity="0.35"
          stroke-width="1"
        />
        <text x={CX - 122} y={CY - 100} class="tag" text-anchor="end"
          >the kernel</text
        >
        {@render cross(CX, CY, 0.6 * R, SCREEN.text)}
        <circle cx={a.small.x} cy={a.small.y} r={a.small.r} fill={LIFTED.red} />
        <circle
          cx={b.small.x}
          cy={b.small.y}
          r={b.small.r}
          fill={LIFTED.green}
        />
        <circle cx={a.big.x} cy={a.big.y} r={a.big.r} fill={LIFTED.blue} />
        <circle cx={b.big.x} cy={b.big.y} r={b.big.r} fill={LIFTED.yellow} />
        <text x="24" y="392" class="line">Work runs on data.</text>
      </svg>
      <p class="note">
        {reduced
          ? "Still: the two pairs at rest, the cross between them."
          : "Four quarter turns, each a spring, then a rest. Only dots move."}
      </p>
    </div>

    <div class="pane canvas">
      <p class="label">quiet form · one accent, on the canvas</p>
      <div class="badge-row">
        <span class="file">contracts/renewal-2026.pdf</span>
        <span class="badge">
          <svg viewBox="0 0 38 24" width="38" height="24" aria-hidden="true">
            {@render cross(21, 12, 5, LIGHT.ink)}
            <circle
              cx={BADGE.big.x}
              cy={BADGE.big.y}
              r="3.6"
              fill={FOUR.blue}
            />
            <circle
              cx={BADGE.small.x}
              cy={BADGE.small.y}
              r="2.25"
              fill={LIGHT.inkSoft}
            />
          </svg>
          checked by the kernel
        </span>
      </div>

      <figure class="fig">
        <svg
          viewBox="0 0 320 168"
          role="img"
          aria-label="Figure 4. Three pairs of dots, sized by weight, with a cross at the point where each pair balances. search and index, 3 to 1: the cross sits close to search. mail and calendar, 2 to 1. docs and sheets, 1 to 1: the cross sits halfway."
        >
          {#each PAIRS as p, i (p.a)}
            {@const y = 30 + i * 52}
            {@const ra = 7 * Math.sqrt(p.wa)}
            {@const rb = 7 * Math.sqrt(p.wb)}
            {@const xb = FX1 + ((FX2 - FX1) * p.wb) / (p.wa + p.wb)}
            <path
              d="M{FX1 + ra + 4} {y}H{FX2 - rb - 4}"
              stroke={LIGHT.hairline}
              stroke-width="1"
            />
            {@render cross(xb, y, 10, LIGHT.ink)}
            <circle cx={FX1} cy={y} r={ra} fill={FOUR.blue} />
            <circle cx={FX2} cy={y} r={rb} fill={LIGHT.inkSoft} />
            <text x={FX1} y={y + 26} class="tick" text-anchor="middle"
              >{p.a}</text
            >
            <text x={FX2} y={y + 26} class="tick" text-anchor="middle"
              >{p.b}</text
            >
            <text x="316" y={y + 4} class="tick" text-anchor="end"
              >{p.wa} : {p.wb}</text
            >
          {/each}
        </svg>
        <figcaption>
          <b>Fig. 4.</b> Where two workloads balance. Dot area is the weight; the
          cross is the shared centre.
        </figcaption>
      </figure>

      <div class="loader">
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          role="img"
          aria-label="Loading: a blue dot and a small grey dot turn around a cross."
        >
          {@render cross(16, 16, 5, LIGHT.ink)}
          <circle
            cx={ld.small.x}
            cy={ld.small.y}
            r={ld.small.r}
            fill={LIGHT.inkSoft}
          />
          <circle cx={ld.big.x} cy={ld.big.y} r={ld.big.r} fill={FOUR.blue} />
        </svg>
        <span>loader, 32 px · the wobble</span>
      </div>
    </div>

    <div class="foot">
      <p>A quarter turn at most every 650 ms. Pauses off-screen.</p>
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
  .f8 {
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
  .loader span,
  .foot p {
    margin: 0;
    font-family: var(--mono);
    font-size: 12px;
  }
  .stage .label,
  .stage .note {
    color: var(--sm);
  }
  .canvas .label,
  .loader span,
  .foot p {
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
  .tag {
    font-family: var(--mono);
    font-size: 15px;
    fill: var(--sm);
  }
  .badge-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 12px;
    padding: 10px 14px;
    background: var(--raised);
    border: 1px solid var(--hair);
    border-radius: 8px;
  }
  .file {
    min-width: 0;
    font-family: var(--mono);
    font-size: 13px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
  }
  .fig {
    margin: 0;
    max-width: 400px;
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
    .f8 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
