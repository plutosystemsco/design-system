<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import Ground from "./ground.svelte";
  import { seeded, watchReducedMotion } from "./device-motion.ts";

  // F1, the field: a quiet grid of dots; a search walks it and lights a path.
  // Blue is the query travelling, yellow a permission check, green a file
  // found, red a file withheld. Plays only when the visitor asks.
  const p = TODAY;
  const PITCH = 22;
  const PAD = 18;
  const H = 320;
  const STEP_MS = 42;

  type Kind = "trail" | "check" | "result" | "withheld";
  type Cell = { x: number; y: number; kind: Kind };

  let width = $state(0);
  let step = $state(0);
  let running = $state(false);
  let reduced = $state(false);

  const cols = $derived(Math.max(8, Math.floor((width - PAD * 2) / PITCH) + 1));
  const rows = $derived(Math.floor((H - PAD * 2) / PITCH) + 1);
  const ox = $derived((width - (cols - 1) * PITCH) / 2);
  const oy = $derived((H - (rows - 1) * PITCH) / 2);

  function buildPath(cols: number, rows: number): Cell[] {
    const rnd = seeded(11);
    const seen = new Set<string>();
    let x = 0;
    let y = Math.floor(rows / 2);
    const path: Cell[] = [];
    let lastV = 0;
    let lastDir = 0;
    while (x < cols && path.length < cols * 3) {
      const key = `${x},${y}`;
      if (!seen.has(key)) {
        seen.add(key);
        path.push({ x, y, kind: "trail" });
      }
      const r = rnd();
      // Mostly forward; sometimes a short vertical run, never doubling back.
      if (r < 0.62 || lastV > 1) {
        x += 1;
        lastV = 0;
      } else {
        const dir = lastV > 0 ? lastDir : r < 0.81 ? -1 : 1;
        const ny = y + dir;
        if (ny >= 1 && ny <= rows - 2) {
          y = ny;
          lastV += 1;
          lastDir = dir;
        } else {
          x += 1;
          lastV = 0;
        }
      }
    }
    // The work along the way, in order: check, find, check, withhold, check, find, find.
    const plan: Kind[] =
      path.length < 34
        ? ["check", "result", "withheld", "result"]
        : ["check", "result", "check", "withheld", "check", "result", "result"];
    plan.forEach((kind, i) => {
      const at = Math.round(
        ((i + 1) / (plan.length + 0.6)) * (path.length - 1),
      );
      if (path[at]) path[at] = { ...path[at], kind };
    });
    return path;
  }

  const path = $derived(buildPath(cols, rows));
  const done = $derived(step >= path.length && step > 0);

  const colour: Record<Kind, string> = {
    trail: p.blueLifted,
    check: p.yellowLifted,
    result: p.greenLifted,
    withheld: p.redLifted,
  };

  const status = $derived(
    running
      ? "Searching /contracts…"
      : done
        ? `${path.length} of ${cols * rows} files read · ${path.filter((c) => c.kind === "result").length} found · 1 withheld by permission`
        : "At rest: every dot is a file in /contracts.",
  );

  $effect(() => watchReducedMotion((r) => (reduced = r)));

  let raf = 0;
  function run() {
    cancelAnimationFrame(raf);
    if (reduced) {
      step = path.length;
      running = false;
      return;
    }
    step = 0;
    running = true;
    const start = performance.now();
    const tick = (now: number) => {
      step = Math.min(path.length, Math.floor((now - start) / STEP_MS) + 1);
      if (step < path.length) raf = requestAnimationFrame(tick);
      else running = false;
    };
    raf = requestAnimationFrame(tick);
  }

  $effect(() => () => cancelAnimationFrame(raf));

  const cx = (c: { x: number }) => ox + c.x * PITCH;
  const cy = (c: { y: number }) => oy + c.y * PITCH;
  const lit = $derived(path.slice(0, step));
  const line = $derived(lit.map((c) => `${cx(c)},${cy(c)}`).join(" "));
</script>

<Ground ground="stage" caption="f1 · the field · a search, drawn live">
  <div
    class="f1"
    style="--mono:{TYPE.D5.mono};--body:{TYPE.D5
      .body};--t:{p.stageText};--m:{p.stageMuted};--l:{p.stageLine};--ls:{p.stageLineStrong};--raised:{p.stageRaised};--a:{p.blueLifted};--ink:{p.ink}"
  >
    <div class="top">
      <div class="query" aria-label="The search">
        <span class="verb">search</span>
        <span class="term">"renewal terms"</span>
        <span class="scope">in /contracts</span>
      </div>
      <button type="button" class="run" onclick={run}>
        <span class="run-dot" aria-hidden="true"></span>Run a search
      </button>
    </div>

    <div class="field" bind:clientWidth={width}>
      {#if width > 0}
        <svg
          {width}
          height={H}
          viewBox="0 0 {width} {H}"
          role="img"
          aria-label="A field of {cols * rows} dots, one per file. {done
            ? 'A search has lit a path across it: blue where it travelled, yellow at permission checks, green at files found, red at a file withheld.'
            : 'Quiet until a search runs.'}"
        >
          {#each { length: rows } as _, y (y)}
            {#each { length: cols } as _, x (x)}
              <circle
                cx={ox + x * PITCH}
                cy={oy + y * PITCH}
                r="1.6"
                class="rest"
              />
            {/each}
          {/each}

          <circle
            cx={ox}
            cy={cy(path[0] ?? { y: 0 })}
            r="3"
            fill={p.blueLifted}
            opacity={step ? 0 : 0.9}
          />

          {#if lit.length > 1}
            <polyline
              points={line}
              fill="none"
              stroke={p.blueLifted}
              stroke-width="1.25"
              stroke-opacity="0.35"
              stroke-linejoin="round"
            />
          {/if}

          {#each lit as c, i (`${c.x},${c.y}`)}
            {#if c.kind === "trail"}
              <circle
                class="pop"
                cx={cx(c)}
                cy={cy(c)}
                r={i === step - 1 && running ? 4.5 : 2.8}
                fill={colour.trail}
                opacity={i === step - 1 && running ? 1 : 0.7}
              />
            {:else}
              <g class="pop">
                <circle
                  cx={cx(c)}
                  cy={cy(c)}
                  r="11"
                  fill={colour[c.kind]}
                  opacity="0.16"
                />
                <circle cx={cx(c)} cy={cy(c)} r="5.5" fill={colour[c.kind]} />
              </g>
            {/if}
          {/each}
        </svg>
      {/if}
    </div>

    <div class="foot">
      <ul class="legend" aria-label="What the colours mean">
        <li><i style="background:{colour.trail}"></i>query</li>
        <li><i style="background:{colour.check}"></i>permission check</li>
        <li><i style="background:{colour.result}"></i>found</li>
        <li><i style="background:{colour.withheld}"></i>withheld</li>
      </ul>
      <p class="status" aria-live="polite">{status}</p>
    </div>
  </div>
</Ground>

<style>
  .f1 {
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
    padding: 16px 20px 4px;
  }
  .query {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0 10px;
    min-width: 0;
    padding: 9px 14px;
    border: 1px solid var(--ls);
    border-radius: 8px;
    background: var(--raised);
    font-family: var(--mono);
    font-size: 13px;
  }
  .verb {
    color: var(--a);
  }
  .scope {
    color: var(--m);
  }
  .run {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border: 0;
    border-radius: 999px;
    background: var(--a);
    color: var(--ink);
    font: 600 14px/1.2 var(--body);
    cursor: pointer;
    transition: filter 160ms ease;
  }
  .run:hover {
    filter: brightness(1.08);
  }
  .run:focus-visible {
    outline: 2px solid var(--t);
    outline-offset: 3px;
  }
  .run-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ink);
  }
  .field {
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  svg {
    display: block;
  }
  .rest {
    fill: #f7f7f4;
    opacity: 0.17;
  }
  .pop {
    transform-box: fill-box;
    transform-origin: center;
    animation: pop 260ms cubic-bezier(0.2, 0.8, 0.2, 1.2) both;
  }
  @keyframes pop {
    from {
      transform: scale(0.2);
      opacity: 0;
    }
  }
  .foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 24px;
    padding: 4px 20px 18px;
    font-family: var(--mono);
    font-size: 12px;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--m);
  }
  .legend li {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .legend i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .status {
    margin: 0;
    color: var(--t);
  }
  @media (prefers-reduced-motion: reduce) {
    .pop {
      animation: none;
    }
    .run {
      transition: none;
    }
  }
</style>
