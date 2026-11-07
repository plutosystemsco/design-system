<script lang="ts">
  import { DARK, FACES, FOUR, LIFTED, LIGHT, ORDER } from "../round-two.ts";
  import Ground from "./ground.svelte";
  import {
    clamp01,
    watchReducedMotion,
    watchVisible,
  } from "./device-motion.ts";

  // F10, the thin blue line (memo §6.5). Pluto's haze: about twenty blue
  // layers, seen backlit at its edge. Loud form on the canvas: a vast horizon
  // layered in Charon Blue, the mark set on it; the visitor's scroll lifts it
  // (J2). Quiet form on graphite: a dot with blue arcs over 120° of its upper
  // edge, square-ended, each fainter outward.

  /** An arc over 120° of a circle's upper edge. */
  function arc(cx: number, cy: number, r: number, span = 120): string {
    const a0 = ((-90 - span / 2) * Math.PI) / 180;
    const a1 = ((-90 + span / 2) * Math.PI) / 180;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  /** The still: a dot of radius r with n arcs 0.15 r apart, fainter outward. */
  const haze = (r: number, n: number) =>
    Array.from({ length: n }, (_, i) => ({
      r: r * (1 + 0.15 * (i + 1)),
      o: 1 - i / n,
    }));

  // The hero: a world far larger than the frame; seven layers of haze.
  const W = 1100;
  const LAYERS = Array.from({ length: 7 }, (_, i) => ({
    d: 7 * (i + 1),
    o: Math.max(0.14, 1 - i * 0.15),
  }));
  // The mark at dot .30 em, gap .08 em, sitting on the limb.
  const MR = 11;
  const PITCH = 2 * MR * (1 + 0.08 / 0.3);
  const MX = 132;

  // The figure: layers over one world, inside out.
  const STACK = ["storage", "index", "kernel", "apps"];

  let reduced = $state(false);
  let visible = $state(false);
  let paused = $state(false);
  let lift = $state(1);
  let t = $state(0);
  let node: HTMLDivElement;
  let hero: SVGSVGElement;

  const hy = $derived(250 - 100 * lift);
  const cy = $derived(hy + W);
  const limb = (x: number) => cy - Math.sqrt(W * W - (x - 300) ** 2);
  const markBase = $derived(limb(MX + PITCH / 2) - LAYERS.length * 7 - 8);

  // The loader: arcs appear outward one at a time, hold, then fade.
  const LOADER = [8, 10.5, 13];
  const shown = $derived(
    LOADER.map((_, i) => {
      if (reduced) return 1 - i * 0.25;
      const c = t % 2.2;
      const on = clamp01((c - i * 0.4) / 0.15);
      return on * (1 - clamp01((c - 1.6) / 0.4)) * (1 - i * 0.25);
    }),
  );

  $effect(() => watchReducedMotion((r) => (reduced = r)));
  $effect(() => watchVisible(node, (v) => (visible = v)));

  // The horizon answers the visitor's scroll and nothing else (J2).
  $effect(() => {
    if (reduced) {
      lift = 1;
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      lift = clamp01(((vh - r.top) / (vh + r.height) - 0.2) / 0.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  });

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

<Ground
  caption="f10 · the thin blue line · every world wears an atmosphere"
  style="--g-bg:{LIGHT.canvas};--g-text:{LIGHT.ink};--g-muted:{LIGHT.inkSoft};--g-line:{LIGHT.hairline}"
>
  <div
    class="f10"
    bind:this={node}
    style="--display:{FACES.display};--body:{FACES.body};--mono:{FACES.mono};--canvas:{LIGHT.canvas};--ink:{LIGHT.ink};--soft:{LIGHT.inkSoft};--hair:{LIGHT.hairline};--raised:{LIGHT.raised};--gr:{DARK.canvas};--gr-raised:{DARK.raised};--gr-line:{DARK.hairline};--gt:{DARK.text};--gm:{DARK.muted};--lift:{LIFTED.blue};--accent:{FOUR.blue}"
  >
    <div class="pane canvas">
      <p class="label">loud form · an owned moment, on the canvas</p>
      <svg
        bind:this={hero}
        viewBox="0 0 600 420"
        role="img"
        aria-label="A vast world's horizon curves gently across the frame, wrapped in seven thin blue lines of haze, each fainter than the one below. The four-dot mark sits on the horizon. Beneath it, on the world, the line Work runs on data."
      >
        <circle cx="300" {cy} r={W} fill={LIGHT.sunk} />
        {#each LAYERS as l, i (i)}
          <circle
            cx="300"
            {cy}
            r={W + l.d}
            fill="none"
            stroke={FOUR.blue}
            stroke-opacity={l.o}
            stroke-width="1"
          />
        {/each}
        {#each ORDER as name, i (name)}
          <circle
            cx={MX + (i % 2) * PITCH}
            cy={markBase - MR - (i < 2 ? PITCH : 0)}
            r={MR}
            fill={FOUR[name]}
          />
        {/each}
        <text x="28" y={hy + 112} class="line">Work runs on data.</text>
        <text x="28" y={hy + 152} class="sub"
          >One governed layer, over every app.</text
        >
      </svg>
      <p class="note">
        {reduced
          ? "Still: the horizon at rest."
          : "The horizon lifts as you scroll, and only then."}
      </p>
    </div>

    <div class="pane graphite">
      <p class="label">quiet form · one accent, on warm graphite</p>
      <div class="row">
        <span class="file">contracts/renewal-2026.pdf</span>
        <span class="badge">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <circle cx="8" cy="10" r="4" fill={DARK.muted} />
            <path d={arc(8, 10, 6.5)} stroke={LIFTED.blue} fill="none" />
          </svg>
          governed
        </span>
      </div>

      <div class="stills">
        {#each [[44, 5], [22, 3]] as [r, n] (r)}
          <svg
            viewBox="0 0 {3.1 * r} {2.8 * r}"
            width={3.1 * r}
            height={2.8 * r}
            aria-hidden="true"
          >
            <circle cx={1.55 * r} cy={1.78 * r} {r} fill={DARK.muted} />
            {#each haze(r, n) as h, i (i)}
              <path
                d={arc(1.55 * r, 1.78 * r, h.r)}
                stroke={LIFTED.blue}
                stroke-opacity={h.o}
                fill="none"
              />
            {/each}
          </svg>
        {/each}
      </div>

      <figure class="fig">
        <svg
          viewBox="0 0 360 150"
          role="img"
          aria-label="Figure 6. A world seen at its edge, with four arcs over it, inside out: storage, index, the kernel in blue, and apps."
        >
          <circle cx="150" cy="232" r="120" fill={DARK.raised} />
          {#each STACK as name, i (name)}
            {@const r = 136 + i * 20}
            <path
              d={arc(150, 232, r, 96)}
              fill="none"
              stroke={name === "kernel" ? LIFTED.blue : DARK.muted}
              stroke-opacity={name === "kernel" ? 1 : 0.55}
              stroke-width={name === "kernel" ? 1.5 : 1}
            />
            <text
              x={150 + r * Math.sin((48 * Math.PI) / 180) + 8}
              y={232 - r * Math.cos((48 * Math.PI) / 180) + 4}
              class="tick"
              class:k={name === "kernel"}>{name}</text
            >
          {/each}
        </svg>
        <figcaption>
          <b>Fig. 6.</b> One governed layer over one world, not a wall around each
          app.
        </figcaption>
      </figure>

      <div class="loader">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          role="img"
          aria-label="Loading: blue arcs appear one by one above a dot, then fade."
        >
          <circle cx="12" cy="18" r="5" fill={DARK.muted} />
          {#each LOADER as r, i (i)}
            <path
              d={arc(12, 18, r)}
              stroke={LIFTED.blue}
              stroke-opacity={shown[i]}
              fill="none"
            />
          {/each}
        </svg>
        <span>loader, 24 px · arcs outward, then fade</span>
      </div>
    </div>

    <div class="foot">
      <p>
        The horizon moves only with your scroll. The loader pauses off-screen.
      </p>
      {#if !reduced}
        <button
          type="button"
          class="pause"
          aria-pressed={paused}
          onclick={() => (paused = !paused)}
        >
          <span class="glyph" class:play={paused} aria-hidden="true"></span>
          {paused ? "Play" : "Pause"} loader
        </button>
      {/if}
    </div>
  </div>
</Ground>

<style>
  .f10 {
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
  .foot p {
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
  .loader span {
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
  .canvas svg {
    border-radius: 8px;
  }
  .line {
    font-family: var(--display);
    font-size: 48px;
    font-weight: 600;
    letter-spacing: -0.03em;
    fill: var(--ink);
  }
  .sub {
    font-family: var(--body);
    font-size: 20px;
    fill: var(--soft);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 12px;
    padding: 10px 14px;
    background: var(--gr-raised);
    border: 1px solid var(--gr-line);
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
    color: var(--lift);
  }
  .stills {
    display: flex;
    align-items: flex-end;
    gap: 24px;
  }
  .fig {
    margin: 0;
    max-width: 420px;
  }
  .tick {
    font-family: var(--mono);
    font-size: 11px;
    fill: var(--gm);
  }
  .tick.k {
    fill: var(--lift);
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
    .f10 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
