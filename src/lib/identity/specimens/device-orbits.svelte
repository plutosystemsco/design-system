<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import Ground from "./ground.svelte";
  import {
    clamp01,
    easeInOut,
    watchReducedMotion,
    watchVisible,
  } from "./device-motion.ts";

  // F2, orbits: each dot travels its own ring, then the four dock into the
  // mark, hold, and leave again. On the right, the same rings frame a figure.
  const p = TODAY;
  const colours = [p.blueLifted, p.redLifted, p.yellowLifted, p.greenLifted];

  const CX = 280;
  const CY = 220;
  const RINGS = [
    { rx: 238, ry: 82, rot: -14, speed: 0.36, phase: 0.4 },
    { rx: 176, ry: 128, rot: 31, speed: -0.5, phase: 2.2 },
    { rx: 128, ry: 52, rot: 9, speed: 0.72, phase: 4.1 },
    { rx: 212, ry: 150, rot: -38, speed: -0.28, phase: 5.3 },
  ];
  // The mark at the design book's proportion: dot .30, gap .08.
  const DOT = 16;
  const OFF = DOT + (DOT * 0.08) / 0.3 / 2;
  const DOCK = [
    [-OFF, -OFF],
    [OFF, -OFF],
    [-OFF, OFF],
    [OFF, OFF],
  ];
  const CYCLE = 9;

  let reduced = $state(false);
  let visible = $state(false);
  let t = $state(0);
  let node: HTMLDivElement;

  function dockAt(time: number): number {
    const c = time % CYCLE;
    if (c < 4.4) return 0;
    if (c < 5.8) return easeInOut(clamp01((c - 4.4) / 1.4));
    if (c < 7.8) return 1;
    return 1 - easeInOut(clamp01((c - 7.8) / 1.2));
  }

  function onRing(i: number, time: number): [number, number] {
    const r = RINGS[i];
    const a = r.phase + r.speed * time * 1.6;
    const phi = (r.rot * Math.PI) / 180;
    const x = r.rx * Math.cos(a);
    const y = r.ry * Math.sin(a);
    return [
      CX + x * Math.cos(phi) - y * Math.sin(phi),
      CY + x * Math.sin(phi) + y * Math.cos(phi),
    ];
  }

  function ellipsePoint(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    rot: number,
    a: number,
  ): [number, number] {
    const phi = (rot * Math.PI) / 180;
    const x = rx * Math.cos(a);
    const y = ry * Math.sin(a);
    return [
      cx + x * Math.cos(phi) - y * Math.sin(phi),
      cy + x * Math.sin(phi) + y * Math.cos(phi),
    ];
  }
  const FRAME_DOTS = [
    { rx: 226, ry: 92, rot: -12, a: 2.75, c: p.blueLifted },
    { rx: 226, ry: 92, rot: -12, a: -0.55, c: p.greenLifted },
    { rx: 172, ry: 176, rot: 20, a: -1.25, c: p.yellowLifted },
  ];

  const d = $derived(reduced ? 1 : dockAt(t));
  const dots = $derived(
    RINGS.map((_, i) => {
      const [ox, oy] = onRing(i, t);
      const k = d;
      return {
        x: ox + (CX + DOCK[i][0] - ox) * k,
        y: oy + (CY + DOCK[i][1] - oy) * k,
        r: 6 + (DOT - 6) * k,
      };
    }),
  );

  $effect(() => watchReducedMotion((r) => (reduced = r)));
  $effect(() => watchVisible(node, (v) => (visible = v)));

  $effect(() => {
    if (reduced || !visible) return;
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

<Ground
  ground="stage"
  caption="f2 · orbits · the dots fly their rings, then dock"
>
  <div
    class="f2"
    bind:this={node}
    style="--display:{TYPE.D5.display};--mono:{TYPE.D5
      .mono};--t:{p.stageText};--m:{p.stageMuted}"
  >
    <div class="pane">
      <svg
        viewBox="0 0 560 440"
        role="img"
        aria-label="Four rings around a centre. A blue, red, yellow and green dot each travel a ring, then dock together into the four-dot mark."
      >
        {#each RINGS as r, i (i)}
          <ellipse
            cx={CX}
            cy={CY}
            rx={r.rx}
            ry={r.ry}
            transform="rotate({r.rot} {CX} {CY})"
            fill="none"
            stroke="#F7F7F4"
            stroke-opacity={0.1 + 0.06 * (1 - d)}
            stroke-width="1"
          />
        {/each}
        {#each dots as dot, i (i)}
          <circle cx={dot.x} cy={dot.y} r={dot.r} fill={colours[i]} />
        {/each}
      </svg>
      <p class="note">
        {reduced
          ? "Docked: the composed mark (reduced motion)."
          : "Loop: orbit · dock · hold · release."}
      </p>
    </div>

    <div class="pane frame">
      <svg
        viewBox="0 0 480 400"
        role="img"
        aria-label="A figure card, 1 kernel checks every read, framed by two thin rings with a coloured dot resting on each."
      >
        <ellipse
          cx="240"
          cy="200"
          rx="226"
          ry="92"
          transform="rotate(-12 240 200)"
          fill="none"
          stroke="#F7F7F4"
          stroke-opacity="0.14"
        />
        <ellipse
          cx="240"
          cy="200"
          rx="172"
          ry="176"
          transform="rotate(20 240 200)"
          fill="none"
          stroke="#F7F7F4"
          stroke-opacity="0.09"
        />
        <rect
          x="110"
          y="112"
          width="260"
          height="176"
          rx="14"
          fill={p.stageRaised}
          stroke="#F7F7F4"
          stroke-opacity="0.14"
        />
        <text x="136" y="160" class="eyebrow">the kernel</text>
        <text x="133" y="222" class="figure">1</text>
        <text x="176" y="222" class="unit">kernel</text>
        <text x="136" y="250" class="label">checks every read,</text>
        <text x="136" y="267" class="label">in every app</text>
        {#each FRAME_DOTS as f (f.c)}
          {@const [x, y] = ellipsePoint(240, 200, f.rx, f.ry, f.rot, f.a)}
          <circle cx={x} cy={y} r="6" fill={f.c} />
        {/each}
      </svg>
      <p class="note">Rings frame a product figure; a dot rests on each.</p>
    </div>
  </div>
</Ground>

<style>
  .f2 {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    min-height: 440px;
    color: var(--t);
  }
  .pane {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    padding: 16px 20px 18px;
  }
  .frame {
    border-left: 1px solid #f7f7f41a;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: 400px;
  }
  .note {
    margin: 8px 0 0;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--m);
  }
  .eyebrow,
  .label {
    font-family: var(--mono);
    font-size: 11px;
    fill: #9aa0ad;
    letter-spacing: 0.04em;
  }
  .figure {
    font-family: var(--display);
    font-size: 64px;
    font-weight: 600;
    letter-spacing: -0.04em;
    fill: #f7f7f4;
  }
  .unit {
    font-family: var(--display);
    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.02em;
    fill: #f7f7f4;
  }
  @media (max-width: 760px) {
    .f2 {
      grid-template-columns: minmax(0, 1fr);
    }
    .frame {
      border-left: 0;
      border-top: 1px solid #f7f7f41a;
    }
  }
</style>
