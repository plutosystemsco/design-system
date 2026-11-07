<script lang="ts">
  import { FACES, FOUR, LIFTED, LIGHT, ORDER, SCREEN } from "../round-two.ts";
  import Ground from "./ground.svelte";
  import {
    clamp01,
    seeded,
    watchReducedMotion,
    watchVisible,
  } from "./device-motion.ts";

  // F6, the blink (memo §6.1). Two records of one field: everything stays put
  // but the dot that moved. Loud form on the stage: four blinks, one every
  // 750 ms, then the found dots spring into the mark. Quiet form on the
  // canvas: the ghost ring and the found dot, ○●, in one accent.

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

  // The hero plate: every found dot moved about 3% of the plate's width.
  const PLATE = { x: 24, y: 24, w: 552, h: 300 };
  const FOUND = [
    { px: 152, py: 104, gx: 136, gy: 110 },
    { px: 424, py: 86, gx: 408, gy: 91 },
    { px: 258, py: 246, gx: 243, gy: 253 },
    { px: 486, py: 232, gx: 471, gy: 237 },
  ];
  // The mark beside the line, at dot .30 em and gap .08 em.
  const MR = 9;
  const PITCH = 2 * MR * (1 + 0.08 / 0.3);
  const MX = 24 + MR;
  const MY = 382;
  const DOCK = [
    [MX, MY],
    [MX + PITCH, MY],
    [MX, MY + PITCH],
    [MX + PITCH, MY + PITCH],
  ];

  function specks(
    n: number,
    seed: number,
    box: { x: number; y: number; w: number; h: number },
    avoid: number[][],
    gap: number,
    scale = 1,
  ) {
    const rnd = seeded(seed);
    const out: { x: number; y: number; r: number; o: number }[] = [];
    while (out.length < n) {
      const x = box.x + rnd() * box.w;
      const y = box.y + rnd() * box.h;
      if (avoid.some(([ax, ay]) => Math.hypot(ax - x, ay - y) < gap)) continue;
      const k = rnd();
      out.push({ x, y, r: (0.8 + 1.9 * k * k) * scale, o: 0.3 + 0.5 * rnd() });
    }
    return out;
  }
  const HERO_SPECKS = specks(
    46,
    1930,
    { x: 40, y: 40, w: 520, h: 268 },
    FOUND.flatMap((f) => [
      [f.px, f.py],
      [f.gx, f.gy],
    ]),
    28,
  );

  // The figure: three files changed between two snapshots (360 × 240).
  const FIG = [
    { px: 92, py: 74, gx: 81, gy: 79 },
    { px: 246, py: 58, gx: 235, gy: 63 },
    { px: 196, py: 176, gx: 185, gy: 181 },
  ];
  const FIG_SPECKS = specks(
    40,
    1978,
    { x: 14, y: 14, w: 332, h: 212 },
    FIG.flatMap((f) => [
      [f.px, f.py],
      [f.gx, f.gy],
      [f.px + 18, f.py],
      [f.px, f.py - 18],
    ]),
    16,
  );
  const LOADER_SPECKS = specks(
    6,
    18,
    { x: 6, y: 6, w: 36, h: 20 },
    [
      [20, 18],
      [28, 14],
    ],
    7,
    0.55,
  );

  const STEP = 0.75;
  const FIND0 = 1;
  const DOCK_AT = FIND0 + 4 * STEP;
  const RETURN_AT = DOCK_AT + 3.2;
  const CYCLE = RETURN_AT + 1.2;
  const SPECK_R = 2.2;
  const R = 8;

  let reduced = $state(false);
  let visible = $state(false);
  let paused = $state(false);
  let t = $state(0);
  let node: HTMLDivElement;

  const dots = $derived(
    FOUND.map((f, i) => {
      if (reduced) return { x: f.px, y: f.py, r: R, k: 1, ring: 1 };
      const c = t % CYCLE;
      const sf = c - (FIND0 + i * STEP);
      const sd = c - DOCK_AT;
      const sr = c - RETURN_AT;
      let x = f.gx;
      let y = f.gy;
      let r = SPECK_R;
      let k = 0;
      let ring = 0;
      if (sf > 0) {
        const e = spring(sf);
        x = mix(f.gx, f.px, e);
        y = mix(f.gy, f.py, e);
        r = mix(SPECK_R, R, e);
        k = clamp01(sf / 0.18);
        ring = clamp01(sf / 0.25);
      }
      if (sd > 0) {
        const e = spring(sd - i * 0.06);
        x = mix(f.px, DOCK[i][0], e);
        y = mix(f.py, DOCK[i][1], e);
        r = mix(R, MR, e);
      }
      if (sr > 0) {
        const e = spring(sr);
        x = mix(DOCK[i][0], f.gx, e);
        y = mix(DOCK[i][1], f.gy, e);
        r = mix(MR, SPECK_R, e);
        k = 1 - clamp01(sr / 0.3);
        ring = 1 - clamp01(sr / 0.3);
      }
      return { x, y, r, k, ring };
    }),
  );

  // The loader: the found dot springs between its ghost and its place.
  const loader = $derived.by(() => {
    if (reduced) return 28;
    const n = Math.floor(t / 0.7);
    const e = spring(t - n * 0.7);
    return n % 2 ? mix(28, 20, e) : mix(20, 28, e);
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

<Ground
  caption="f6 · the blink · two records of one field, and the dot that moved"
  style="--g-bg:{LIGHT.canvas};--g-text:{LIGHT.ink};--g-muted:{LIGHT.inkSoft};--g-line:{LIGHT.hairline}"
>
  <div
    class="f6"
    bind:this={node}
    style="--display:{FACES.display};--body:{FACES.body};--mono:{FACES.mono};--stage:{SCREEN.ground};--st:{SCREEN.text};--sm:{SCREEN.muted};--canvas:{LIGHT.canvas};--ink:{LIGHT.ink};--soft:{LIGHT.inkSoft};--hair:{LIGHT.hairline};--raised:{LIGHT.raised};--accent:{FOUR.blue}"
  >
    <div class="pane stage">
      <p class="label">loud form · an owned moment, on the stage</p>
      <svg
        viewBox="0 0 600 440"
        role="img"
        aria-label="A dark glass plate scattered with faint specks. Four specks blink: each springs a short way from its old place, takes a colour, blue, red, yellow and green, and leaves a hollow ring where it was. The four found dots then spring into the four-dot mark beside the line Work runs on data."
      >
        <rect
          x={PLATE.x + 0.5}
          y={PLATE.y + 0.5}
          width={PLATE.w - 1}
          height={PLATE.h - 1}
          rx="8"
          fill={SCREEN.raised}
          stroke={SCREEN.text}
          stroke-opacity="0.16"
        />
        {#each HERO_SPECKS as s, i (i)}
          <circle cx={s.x} cy={s.y} r={s.r} fill={SCREEN.text} opacity={s.o} />
        {/each}
        {#each FOUND as f, i (i)}
          {@const c = LIFTED[ORDER[i]]}
          {@const d = dots[i]}
          <circle
            cx={f.gx}
            cy={f.gy}
            r={R - 0.5}
            fill="none"
            stroke={c}
            stroke-width="1"
            opacity={d.ring}
          />
          {#if reduced}
            <path
              d="M{f.px + 14} {f.py}H{f.px + 26}M{f.px} {f.py - 26}V{f.py - 14}"
              stroke={SCREEN.text}
              stroke-opacity="0.7"
              stroke-width="1"
            />
          {/if}
          <circle
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={SCREEN.text}
            opacity={(1 - d.k) * 0.6}
          />
          <circle cx={d.x} cy={d.y} r={d.r} fill={c} opacity={d.k} />
        {/each}
        <text x={reduced ? 24 : 24 + 2 * MR + PITCH + 14} y="408" class="line"
          >Work runs on data.</text
        >
      </svg>
      <p class="note">
        {reduced
          ? "Composed end: every found dot in place, every ring where it was."
          : "Four blinks, one every 750 ms; then the found dots spring into the mark."}
      </p>
    </div>

    <div class="pane canvas">
      <p class="label">quiet form · one accent, on the canvas</p>
      <ul class="files" aria-label="Files in a workspace, two marked changed">
        {#each [["contracts/renewal-2026.pdf", true], ["contracts/msa-northwind.pdf", false], ["policies/retention.md", true]] as [name, changed] (name)}
          <li>
            <span class="name">{name}</span>
            {#if changed}
              <span class="changed">
                <svg
                  viewBox="0 0 21 10"
                  width="21"
                  height="10"
                  aria-hidden="true"
                >
                  <circle
                    cx="4.5"
                    cy="5"
                    r="3"
                    fill="none"
                    stroke={FOUR.blue}
                    stroke-width="1"
                  />
                  <circle cx="15.5" cy="5" r="3.5" fill={FOUR.blue} />
                </svg>
                changed
              </span>
            {:else}
              <span class="same">unchanged</span>
            {/if}
          </li>
        {/each}
      </ul>

      <figure class="fig">
        <svg
          viewBox="0 0 360 240"
          role="img"
          aria-label="Figure 3. A plate of grey specks, one per file. Three blue dots are marked with two short ticks each, and a hollow blue ring beside each shows where it was in the earlier snapshot."
        >
          <rect
            x="0.5"
            y="0.5"
            width="359"
            height="239"
            rx="8"
            fill={LIGHT.raisedWarm}
            stroke={LIGHT.hairline}
          />
          {#each FIG_SPECKS as s, i (i)}
            <circle
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={LIGHT.inkSoft}
              opacity={s.o}
            />
          {/each}
          {#each FIG as f, i (i)}
            <circle
              cx={f.gx}
              cy={f.gy}
              r="5.5"
              fill="none"
              stroke={FOUR.blue}
              stroke-width="1"
            />
            <path
              d="M{f.px + 11} {f.py}H{f.px + 22}M{f.px} {f.py - 22}V{f.py - 11}"
              stroke={LIGHT.ink}
              stroke-width="1"
            />
            <circle cx={f.px} cy={f.py} r="6" fill={FOUR.blue} />
          {/each}
        </svg>
        <figcaption>
          <b>Fig. 3.</b> Two snapshots of one workspace. Three files changed.
        </figcaption>
      </figure>

      <div class="loader">
        <svg
          viewBox="0 0 48 32"
          width="48"
          height="32"
          role="img"
          aria-label="Loading: a small plate where one blue dot springs between its ring and its place."
        >
          <rect
            x="0.5"
            y="0.5"
            width="47"
            height="31"
            rx="8"
            fill={LIGHT.raisedWarm}
            stroke={LIGHT.hairline}
          />
          {#each LOADER_SPECKS as s, i (i)}
            <circle
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={LIGHT.inkSoft}
              opacity={s.o}
            />
          {/each}
          <circle
            cx="20"
            cy="17"
            r="2.6"
            fill="none"
            stroke={FOUR.blue}
            stroke-width="1"
          />
          <circle
            cx={loader}
            cy={17 - (loader - 20) * 0.25}
            r="3"
            fill={FOUR.blue}
          />
        </svg>
        <span>loader, 48 × 32 · comparing two snapshots…</span>
      </div>
    </div>

    <div class="foot">
      <p>
        One dot moves at most every 750 ms; nothing flashes. Pauses off-screen.
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
  .f6 {
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
  .files {
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--raised);
    border: 1px solid var(--hair);
    border-radius: 8px;
    font-size: 14px;
  }
  .files li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 9px 14px;
  }
  .files li + li {
    border-top: 1px solid var(--hair);
  }
  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--mono);
    font-size: 13px;
  }
  .changed,
  .same {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
    font-size: 13px;
  }
  .changed {
    color: var(--accent);
    font-weight: 500;
  }
  .same {
    color: var(--soft);
  }
  .fig {
    margin: 0;
    max-width: 380px;
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
    .f6 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
