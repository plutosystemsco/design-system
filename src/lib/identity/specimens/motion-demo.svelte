<script lang="ts">
  import { onMount } from "svelte";
  import type { Look } from "../look.ts";

  // One motion candidate, live. Every panel holds the same two objects, the
  // mark and a run card, so only the motion differs from one option to the
  // next. Under reduced motion every panel shows its composed end state.
  let {
    kind,
    look,
    label,
  }: { kind: "J1" | "J2" | "J3" | "J4"; look: Look; label: string } = $props();

  const p = $derived(look.palette);
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

  /** A damped spring sampled into a CSS linear() curve, and how long it takes to settle. */
  function spring(stiffness: number, damping: number) {
    const w = Math.sqrt(stiffness);
    const wd = w * Math.sqrt(1 - damping * damping);
    const x = (t: number) =>
      1 -
      Math.exp(-damping * w * t) *
        (Math.cos(wd * t) + ((damping * w) / wd) * Math.sin(wd * t));
    let end = 0.05;
    for (let t = 0.05; t < 3; t += 0.005) {
      let settled = true;
      for (let u = t; u < t + 0.3; u += 0.01)
        if (Math.abs(1 - x(u)) > 0.002) settled = false;
      if (settled) {
        end = t;
        break;
      }
    }
    const steps = 48;
    const points = Array.from({ length: steps + 1 }, (_, i) =>
      x((end * i) / steps).toFixed(4),
    );
    points[steps] = "1";
    return {
      curve: `linear(${points.join(", ")})`,
      ms: Math.round(end * 1000),
    };
  }

  // Material 3 Expressive's spatial springs (stiffness / damping), studied:
  // fast 800 / 0.6 for a press, default 380 / 0.8 would barely show, so the
  // dock and the meter use a softer 260 / 0.55 to make the overshoot legible.
  const PRESS = spring(800, 0.6);
  const DOCK = spring(260, 0.55);

  const springs = $derived(kind === "J4");
  const responds = $derived(kind !== "J1");
  const enters = $derived(kind === "J1" || kind === "J4");
  const breathes = $derived(kind === "J3");

  let reduced = $state(false);
  /** The entrance: false scatters the dots, true docks them. */
  // svelte-ignore state_referenced_locally
  let docked = $state(kind !== "J1" && kind !== "J4");
  let pressed = $state(false);
  let ran = $state(false);
  let count = $state(0);
  let visible = $state(false);
  let panel: HTMLElement;
  let raf = 0;
  const TOTAL = 1284;
  const timers: ReturnType<typeof setTimeout>[] = [];

  function later(fn: () => void, ms: number) {
    timers.push(setTimeout(fn, ms));
  }
  function clear() {
    timers.splice(0).forEach(clearTimeout);
    cancelAnimationFrame(raf);
  }
  function frame(fn: () => void) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  function countUp() {
    if (reduced) {
      count = TOTAL;
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      count = Math.round(TOTAL * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  function enter() {
    if (reduced) {
      docked = true;
      return;
    }
    docked = false;
    frame(() => (docked = true));
  }

  function run() {
    clear();
    if (reduced) {
      ran = true;
      count = TOTAL;
      return;
    }
    ran = false;
    count = 0;
    pressed = true;
    later(() => {
      pressed = false;
      frame(() => {
        ran = true;
        if (responds) countUp();
        else count = TOTAL;
      });
    }, 160);
  }

  function play() {
    if (enters) enter();
    if (kind === "J1") {
      clear();
      ran = false;
      count = 0;
      return;
    }
    later(run, enters && !reduced ? 500 : 0);
  }

  onMount(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced = mq.matches;
    if (reduced) docked = true;
    const onChange = () => (reduced = mq.matches);
    mq.addEventListener("change", onChange);
    let entered = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        // The one hello plays the first time the panel is seen.
        if (visible && !entered && enters) {
          entered = true;
          enter();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(panel);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onChange);
      clear();
    };
  });

  const MOVES: Record<string, string[]> = {
    J1: [
      "entrance · 4 dots dock · 840 ms",
      "then stillness",
      "a response · 200 ms fade",
    ],
    J2: [
      "press · scale .98 · 160 ms",
      "meter · 700 ms",
      "count · once",
      "light · 600 ms",
    ],
    J3: ["the J2 responses", "field breathes · 8 s · pauses off-screen"],
    J4: [
      `press · spring 800/0.6 · ${PRESS.ms} ms`,
      `dock and meter · spring 260/0.55 · ${DOCK.ms} ms`,
      "light and count never bounce",
    ],
  };

  const FIELD = Array.from({ length: 22 * 9 }, (_, i) => ({
    x: i % 22,
    y: Math.floor(i / 22),
  }));
  const DOTS = [
    { c: "blueLifted", from: "-180%, -160%" },
    { c: "redLifted", from: "200%, -120%" },
    { c: "yellowLifted", from: "-220%, 140%" },
    { c: "greenLifted", from: "160%, 190%" },
  ] as const;
</script>

<figure
  bind:this={panel}
  class="demo"
  class:springs
  class:hello={kind === "J1"}
  class:reduced
  class:docked
  class:pressed
  class:ran
  class:paused={!visible}
  aria-label={label}
  style="
    --g:{p.stage};--c:{p.stageRaised};--t:{p.stageText};--m:{p.stageMuted};--l:{p.stageLine};--ls:{p.stageLineStrong};
    --a:{p.blueLifted};--at:{p.ink};--done:{p.greenLifted};
    --fd:{look.type.display};--fb:{look.type.body};--fm:{look.type
    .mono};--dw:{look.type.displayWeight};
    --ra:{look.shape.action};--rc:{look.shape.card};
    --ease:{EASE};--press:{PRESS.curve};--press-ms:{PRESS.ms}ms;--dock:{DOCK.curve};--dock-ms:{DOCK.ms}ms;
  "
>
  <header class="head">
    <ul class="moves" aria-label="Moves in this option">
      {#each MOVES[kind] as move (move)}<li>{move}</li>{/each}
      {#if reduced}<li class="note">
          reduced motion is on: end states only
        </li>{/if}
    </ul>
    <button type="button" class="play" onclick={play}>
      <svg viewBox="0 0 12 12" aria-hidden="true"
        ><path d="M3 1.8v8.4L10 6z" /></svg
      >
      Play
    </button>
  </header>

  <div class="floor">
    {#if breathes}
      <div class="field" aria-hidden="true">
        {#each FIELD as d (d.x + "," + d.y)}<i style="--d:{(d.x + d.y) * 0.18}s"
          ></i>{/each}
      </div>
    {/if}

    <div class="mark-wrap" aria-hidden="true">
      <span class="mark">
        {#each DOTS as d, i (d.c)}
          <i style="background:{p[d.c]};--from:{d.from};--delay:{i * 80}ms"></i>
        {/each}
      </span>
      <span class="word">pluto</span>
    </div>

    <div class="card-wrap">
      <span class="bloom" aria-hidden="true"></span>
      <div class="card">
        <div class="card-head">
          <span>agent.py · renewals</span>
          <button type="button" class="run" onclick={run}>Run</button>
        </div>
        <div class="card-body">
          <p class="meter-label">
            <span>Searching /contracts</span><span
              >{ran ? "done" : "ready"}</span
            >
          </p>
          <span class="meter" aria-hidden="true"
            ><span class="fill"></span></span
          >
          <p class="count" aria-live="polite">
            <span class="num">{count.toLocaleString("en-US")}</span>
            <span class="unit">files checked against policy</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</figure>

<style>
  .demo {
    margin: 0;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background: var(--g);
    color: var(--t);
    border-radius: 12px;
    font-family: var(--fb);
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
    padding: 14px 14px 14px 24px;
    border-bottom: 1px solid var(--l);
  }
  .moves {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
    font-family: var(--fm);
    font-size: 12px;
    color: var(--m);
  }
  .moves .note {
    color: var(--t);
  }
  .play {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 18px 0 14px;
    border-radius: var(--ra);
    border: 1px solid var(--ls);
    color: var(--t);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .play:hover {
    background: var(--l);
  }
  .play svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
  .play:focus-visible,
  .run:focus-visible {
    outline: 2px solid var(--a);
    outline-offset: 2px;
  }

  .floor {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    align-items: center;
    gap: 32px;
    min-height: 340px;
    padding: 40px clamp(20px, 4vw, 56px);
  }
  @media (max-width: 760px) {
    .floor {
      grid-template-columns: 1fr;
      justify-items: center;
    }
  }

  /* The mark: four dots that dock into a 2×2. */
  .mark-wrap {
    display: flex;
    align-items: center;
    gap: 0.28em;
    font-size: clamp(56px, 8vw, 96px);
  }
  .mark {
    display: inline-grid;
    grid-template-columns: auto auto;
    gap: 0.08em;
  }
  .mark i {
    display: block;
    width: 0.3em;
    height: 0.3em;
    border-radius: 50%;
    transform: translate(var(--from));
    opacity: 0;
  }
  .docked .mark i {
    transform: none;
    opacity: 1;
    transition:
      transform 600ms var(--ease) var(--delay),
      opacity 300ms linear var(--delay);
  }
  .springs.docked .mark i {
    transition:
      transform var(--dock-ms) var(--dock) var(--delay),
      opacity 300ms linear var(--delay);
  }
  .word {
    font-family: var(--fd);
    font-weight: var(--dw);
    letter-spacing: -0.04em;
    line-height: 1;
    padding-bottom: 0.08em;
  }

  /* The run card. */
  .card-wrap {
    position: relative;
    width: 100%;
    max-width: 460px;
    justify-self: end;
  }
  @media (max-width: 760px) {
    .card-wrap {
      justify-self: stretch;
      max-width: none;
    }
  }
  .bloom {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 170%;
    aspect-ratio: 1.6;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      closest-side,
      rgb(200 212 255 / 0.26),
      rgb(130 150 225 / 0.08) 55%,
      transparent
    );
    opacity: 0.3;
    z-index: -1;
    pointer-events: none;
  }
  .ran .bloom {
    opacity: 1;
    transition: opacity 600ms var(--ease);
  }
  /*
   * The theme's former bloom utility, which this class also received while
   * pluto-theme had one; 012 decision 1 removed it. The rules above win
   * wherever both set a property, as they did over the layered utility
   * (its position among them); these are the rest, so the record renders
   * as before.
   */
  .bloom {
    isolation: isolate;
  }
  .bloom::before {
    content: "";
    position: absolute;
    inset: -25%;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(
      closest-side,
      #c8d4ff38,
      #6e82d212 60%,
      transparent
    );
    opacity: 0.6;
    transition: opacity var(--motion-reveal) var(--ease-standard);
  }
  .card {
    background: var(--c);
    border: 1px solid rgb(225 233 255 / 0.2);
    border-radius: var(--rc);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06);
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px 8px 16px;
    border-bottom: 1px solid var(--l);
    font-family: var(--fm);
    font-size: 12px;
    color: var(--m);
  }
  .run {
    height: 30px;
    padding: 0 16px;
    border-radius: var(--ra);
    background: var(--a);
    color: var(--at);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 160ms var(--ease);
  }
  .pressed .run {
    transform: scale(0.98);
  }
  .springs .run {
    transition: transform var(--press-ms) var(--press);
  }
  .springs.pressed .run {
    transform: scale(0.94);
    transition: transform 100ms var(--ease);
  }
  .card-body {
    padding: 20px 16px 18px;
  }
  .meter-label {
    display: flex;
    justify-content: space-between;
    font-family: var(--fm);
    font-size: 12px;
    color: var(--m);
  }
  .ran .meter-label span:last-child {
    color: var(--done);
  }
  .meter {
    position: relative;
    display: block;
    height: 6px;
    margin-top: 10px;
    border-radius: 999px;
    background: var(--l);
    overflow: hidden;
  }
  .springs .meter {
    overflow: visible;
  }
  .fill {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, #2456e6, var(--a));
    transform: scaleX(0);
    transform-origin: left;
  }
  .ran .fill {
    transform: scaleX(1);
    transition: transform 700ms var(--ease);
  }
  .springs.ran .fill {
    transition: transform var(--dock-ms) var(--dock);
  }
  /* One hello: after the entrance, a response is a 200 ms change, no more. */
  .hello.ran .fill,
  .hello.ran .bloom {
    transition-duration: 200ms;
  }
  .count {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 20px;
  }
  .num {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 44px;
    letter-spacing: -0.035em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .unit {
    font-size: 14px;
    color: var(--m);
  }

  /* J3: the field breathes, one slow wave, paused off-screen. */
  .field {
    position: absolute;
    inset: 0;
    z-index: -2;
    display: grid;
    grid-template-columns: repeat(22, 1fr);
    grid-template-rows: repeat(9, 1fr);
    place-items: center;
    padding: 12px;
    mask-image: radial-gradient(
      farthest-side at 50% 50%,
      black 55%,
      transparent
    );
  }
  .field i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--a);
    opacity: 0.14;
    animation: breathe 8s ease-in-out var(--d) infinite;
  }
  .paused .field i {
    animation-play-state: paused;
  }
  @keyframes breathe {
    0%,
    100% {
      opacity: 0.12;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.55;
      transform: scale(1.3);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .demo *,
    .demo *::after {
      transition: none !important;
      animation: none !important;
    }
    .mark i {
      transform: none;
      opacity: 1;
    }
  }
</style>
