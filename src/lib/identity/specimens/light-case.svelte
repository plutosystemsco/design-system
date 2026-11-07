<script lang="ts">
  import {
    DARK,
    FACES,
    FOUR,
    LEGEND,
    LIFTED,
    LIGHT,
    ORDER,
    SCREEN,
    SKIRT,
  } from "../round-two.ts";
  import Mark from "./mark.svelte";
  import { watchReducedMotion } from "./device-motion.ts";

  // Question I, round two: one composition per option, in one theme. Every
  // value is a measured recipe from
  // research/2026-11-06-from-beige-computing-to-liquid-glass.md (§5, §6, §7).
  // Glass carries ink, inkSoft and blue text only (§6.4), and turns opaque
  // under reduced transparency, forced colours, or no backdrop-filter.
  let {
    variant,
    theme,
  }: { variant: "I5" | "I6" | "I7" | "I8" | "I9"; theme: "light" | "dark" } =
    $props();

  /** `b` laid over `a` at `t` (0..1), in sRGB: the memo's skirt recipe. */
  function mix(a: string, b: string, t: number): string {
    const p = (h: string) =>
      [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const [x, y] = [p(a), p(b)];
    return (
      "#" +
      x
        .map((v, i) =>
          Math.round(v + (y[i] - v) * t)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  }

  const dark = $derived(theme === "dark");
  const fill = $derived(dark ? LIFTED : FOUR);
  // Dark keys: lifted fill, graphite legend, skirt ink 35% over fill (§6.2, I6).
  type Hue = (typeof ORDER)[number];
  const skirt: Record<Hue, string> = $derived(
    dark
      ? (Object.fromEntries(
          ORDER.map((k) => [k, mix(LIFTED[k], "#0B0F17", 0.35)]),
        ) as Record<Hue, string>)
      : SKIRT,
  );
  const legend: Record<Hue, string> = $derived(
    dark
      ? (Object.fromEntries(ORDER.map((k) => [k, DARK.canvas])) as Record<
          Hue,
          string
        >)
      : LEGEND,
  );

  const vars = $derived(
    dark
      ? {
          canvas: DARK.canvas,
          raised: DARK.raised,
          sunk: DARK.sunk,
          hairline: DARK.hairline,
          text: DARK.text,
          muted: DARK.muted,
          accent: LIFTED.blue,
          "key-face": DARK.key,
          "key-skirt": DARK.skirt,
          "key-inset": "inset 0 1px 0 rgb(255 255 255 / 0.10)",
          "input-edge": DARK.inputEdge,
          "glass-tint": "rgb(22 20 15 / 0.84)",
          "glass-rim": "inset 0 1px 0 rgb(255 255 255 / 0.12)",
          "glass-edge": "rgb(255 255 255 / 0.08)",
          "glass-shadow": "0 16px 40px -16px rgb(0 0 0 / 0.7)",
          "glass-fallback": DARK.raised,
          "cta-fill": LIFTED.blue,
          "cta-text": DARK.canvas,
          "cta-skirt": skirt.blue,
          spec: "rgb(255 255 255 / 0.10)",
        }
      : {
          canvas: LIGHT.canvas,
          raised: LIGHT.raised,
          sunk: LIGHT.sunk,
          hairline: LIGHT.hairline,
          text: LIGHT.ink,
          muted: LIGHT.inkSoft,
          accent: FOUR.blue,
          "key-face": LIGHT.raisedWarm,
          "key-skirt": LIGHT.skirt,
          "key-inset": "inset 0 1px 0 #FFFFFF",
          "input-edge": LIGHT.inputEdge,
          "glass-tint": "rgb(243 240 232 / 0.86)",
          "glass-rim": "inset 0 1px 0 rgb(255 255 255 / 0.8)",
          "glass-edge": "rgb(11 15 23 / 0.08)",
          "glass-shadow":
            "0 1px 0 rgb(11 15 23 / 0.06), 0 16px 32px -16px rgb(11 15 23 / 0.28)",
          "glass-fallback": LIGHT.raisedWarm,
          "cta-fill": FOUR.blue,
          "cta-text": "#FFFFFF",
          "cta-skirt": SKIRT.blue,
          spec: "rgb(255 255 255 / 0.55)",
        },
  );
  const style = $derived(
    Object.entries(vars)
      .map(([k, v]) => `--${k}:${v}`)
      .join(";") +
      `;--display:${FACES.display};--body:${FACES.body};--mono:${FACES.mono}`,
  );

  const STEPS = ["Find", "Read", "Check", "Run"];
  const NAMES: Record<string, string> = {
    blue: "blue",
    red: "red",
    yellow: "yellow",
    green: "green",
  };

  // The keys light in order when the visitor runs something (J2), one every
  // 260 ms; under reduced motion they light at once, by colour, not travel.
  let lit = $state(-1);
  let running = $state(false);
  let reduced = $state(false);
  $effect(() => watchReducedMotion((r) => (reduced = r)));

  function run() {
    if (running) return;
    running = true;
    if (reduced) {
      lit = 3;
      setTimeout(() => {
        lit = -1;
        running = false;
      }, 1200);
      return;
    }
    let i = 0;
    lit = 0;
    const id = setInterval(() => {
      i += 1;
      if (i <= 3) lit = i;
      else {
        clearInterval(id);
        setTimeout(() => {
          lit = -1;
          running = false;
        }, 700);
      }
    }, 260);
  }

  // I9: a rim highlight that follows the pointer only while it moves (J2).
  let mx = $state(50);
  let my = $state(0);
  let moving = $state(false);
  let still: ReturnType<typeof setTimeout> | undefined;
  function track(e: PointerEvent) {
    if (variant !== "I9" || reduced) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 100;
    my = ((e.clientY - r.top) / r.height) * 100;
    moving = true;
    clearTimeout(still);
    still = setTimeout(() => (moving = false), 600);
  }

  // I9's lens: an SVG displacement as a backdrop filter, Chromium only, over
  // the frosted fallback that already passes (§7, I9).
  let lens = $state(false);
  $effect(() => {
    lens =
      variant === "I9" &&
      !reduced &&
      "userAgentData" in navigator &&
      !matchMedia("(prefers-reduced-transparency: reduce)").matches;
  });
  const lensId = $derived(`pluto-lens-${theme}`);

  const caption = $derived(
    {
      I5: "flat: hairlines and fields, no shadow, no glass",
      I6: "keys: a hard 3 px skirt; pressed, 1 px and 2 px lower",
      I7: "the stage as a screen, set into the case",
      I8: "one frosted pane over a row of coloured keys",
      I9: "glass on every expressive surface, lens and moving rim",
    }[variant],
  );
</script>

<figure
  class="case v-{variant} {theme}"
  class:lens
  class:moving
  {style}
  onpointermove={track}
  style:--mx="{mx}%"
  style:--my="{my}%"
  style:--lens="url(#{lensId})"
>
  <figcaption class="cap">
    {variant} · {theme === "light"
      ? "light: canvas #F3F0E8"
      : "dark: graphite #16140F"} · {caption}
  </figcaption>

  {#if variant === "I9"}
    <svg class="defs" aria-hidden="true" width="0" height="0">
      <filter id={lensId} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.012"
          numOctaves="1"
          seed="7"
          result="n"
        />
        <feGaussianBlur in="n" stdDeviation="6" result="s" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="s"
          scale="28"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  {/if}

  <div class="stage">
    <header class="bar" class:glass={variant === "I9"}>
      <span class="wm" aria-label="Pluto" role="img"
        ><span>pluto</span><Mark
          colours={[fill.blue, fill.red, fill.yellow, fill.green]}
          dot={0.26}
          gap={0.07}
          class="rise"
        /></span
      >
      <nav aria-label="Example navigation" class="links">
        <span>Docs</span><span>Sheets</span><span>Mail</span>
      </nav>
    </header>

    {#if variant === "I5"}
      <div class="copy">
        <h3 class="h">Work runs on data.</h3>
        <p class="sub">
          Every document, sheet and message in one place you govern.
        </p>
        <div class="actions">
          <button class="btn flat-cta" type="button">Start a workspace</button>
          <button class="btn flat-ghost" type="button">See how it works</button>
        </div>
      </div>
      <ul class="fields" aria-label="The four colours as flat fields">
        {#each ORDER as k, i (k)}
          <li class="field" style="background:{fill[k]};color:{legend[k]}">
            <span class="n">{i + 1}</span><span>{STEPS[i]}</span>
          </li>
        {/each}
      </ul>
    {:else if variant === "I6"}
      <div class="copy">
        <h3 class="h">Work runs on data.</h3>
        <p class="sub">Press a key. Watch your work run.</p>
        <div class="actions">
          <button class="btn key cta" type="button" onclick={run}
            >Run a search</button
          >
          <button class="btn key" type="button">See how it works</button>
        </div>
      </div>
      <div class="keyrow" aria-label="Four coloured keys" role="group">
        {#each ORDER as k, i (k)}
          <button
            type="button"
            class="ckey"
            class:down={lit === i || (reduced && lit >= i)}
            style="--f:{fill[k]};--s:{skirt[k]};--l:{legend[k]}"
            onclick={run}
            aria-label="{STEPS[i]}, the {NAMES[k]} key">{STEPS[i]}</button
          >
        {/each}
      </div>
    {:else if variant === "I7"}
      <div class="split">
        <div class="copy">
          <h3 class="h">Work runs on data.</h3>
          <p class="sub">The answer appears on the screen, where it belongs.</p>
          <div class="actions">
            <button class="btn key cta" type="button" onclick={run}
              >Run it</button
            >
          </div>
        </div>
        <div class="bezel">
          <div class="screen" aria-label="A run console" role="group">
            <p class="line">
              <span class="pr">$</span> pluto search "q3 plan" --in docs
            </p>
            {#each ORDER as k, i (k)}
              <p class="line out" class:on={lit >= i}>
                <i style="background:{LIFTED[k]}"></i>{[
                  "found 12 files",
                  "read 3 matches",
                  "checked: you may open all 3",
                  "ran in 41 ms",
                ][i]}
              </p>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="layer">
        <div class="keyrow big" aria-hidden="true">
          {#each ORDER as k, i (k)}
            <span
              class="ckey"
              class:down={lit === i || (reduced && lit >= i)}
              class:glow={lit >= i}
              style="--f:{fill[k]};--s:{skirt[k]};--l:{legend[k]}"
              >{STEPS[i]}</span
            >
          {/each}
        </div>
        <div class="pane glass">
          <h3 class="h">Work runs on data.</h3>
          <p class="sub">
            Your documents, sheets and mail, on one layer you govern.
          </p>
          <div class="actions">
            <button class="btn key cta" type="button" onclick={run}
              >Run a search</button
            >
            <span class="hint">{running ? "Running…" : "The keys answer."}</span
            >
          </div>
        </div>
      </div>
      {#if variant === "I9"}
        <div class="cards">
          <div class="card glass">
            <span class="k">Pluto Docs</span><span class="v">3 open</span>
          </div>
          <div class="card glass">
            <span class="k">Pluto Search</span><span class="v">12 found</span>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</figure>

<style>
  .case {
    margin: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    background: var(--canvas);
    color: var(--text);
    border: 1px solid var(--hairline);
    font-family: var(--body);
    container-type: inline-size;
  }
  .cap {
    padding: 10px 16px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.02em;
    color: var(--muted);
    border-bottom: 1px solid var(--hairline);
  }
  .defs {
    position: absolute;
  }
  .stage {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 20px 24px 32px;
    min-height: 420px;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 12px;
    margin: 0 -12px;
    border-radius: 8px;
  }
  .wm {
    display: inline-flex;
    align-items: baseline;
    font-family: var(--display);
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.04em;
  }
  .wm :global(.rise) {
    margin-left: 0.1em;
    transform: translateY(-0.64em);
  }
  .links {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: var(--muted);
  }
  .h {
    margin: 0;
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(34px, 9cqi, 64px);
    line-height: 0.95;
    letter-spacing: -0.045em;
  }
  .sub {
    margin: 14px 0 0;
    max-width: 34ch;
    font-size: 16px;
    color: var(--muted);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-top: 22px;
  }
  .btn {
    font: 500 15px/1 var(--body);
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text);
  }
  .btn:focus-visible,
  .ckey:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
  .hint {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
  }

  /* I5: flat */
  .flat-cta {
    background: var(--cta-fill);
    color: var(--cta-text);
    border: 0;
  }
  .flat-ghost {
    background: var(--raised);
    border: 1px solid var(--input-edge);
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin: auto 0 0;
    padding: 0;
    list-style: none;
  }
  .field {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    min-height: 88px;
    padding: 12px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
  }
  .field .n {
    font-family: var(--display);
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  /* I6, I7, I8, I9: keys (§6.1, §6.2) */
  .key {
    background: var(--key-face);
    border: 1px solid var(--hairline);
    box-shadow:
      0 3px 0 0 var(--key-skirt),
      var(--key-inset);
    transition:
      transform 80ms ease-out,
      box-shadow 80ms ease-out;
  }
  .key.cta {
    background: var(--cta-fill);
    color: var(--cta-text);
    border-color: transparent;
    box-shadow: 0 3px 0 0 var(--cta-skirt);
  }
  .key:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 0 var(--key-skirt);
  }
  .key.cta:active {
    box-shadow: 0 1px 0 0 var(--cta-skirt);
  }
  .keyrow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: auto;
  }
  .ckey {
    display: flex;
    align-items: flex-end;
    min-height: 72px;
    padding: 10px 12px;
    border: 0;
    border-radius: 8px;
    background: var(--f);
    color: var(--l);
    font: 600 14px/1 var(--body);
    text-align: left;
    box-shadow: 0 4px 0 0 var(--s);
    transition:
      transform 80ms ease-out,
      box-shadow 80ms ease-out,
      filter 160ms ease-out;
    cursor: pointer;
  }
  .ckey.down,
  button.ckey:active {
    transform: translateY(3px);
    box-shadow: 0 1px 0 0 var(--s);
  }
  @media (prefers-reduced-motion: reduce) {
    .key,
    .ckey {
      transition: none;
    }
    .key:active,
    .ckey.down,
    button.ckey:active {
      transform: none;
    }
    .ckey.down {
      filter: brightness(1.15) saturate(1.1);
    }
  }

  /* I7: case and screen */
  .split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    align-items: center;
    gap: 24px;
    flex: 1;
  }
  .bezel {
    padding: 8px;
    border-radius: 8px;
    background: var(--sunk);
    border: 1px solid var(--hairline);
  }
  .screen {
    min-height: 220px;
    padding: 16px;
    border-radius: 8px;
    background: #030407;
    box-shadow:
      inset 0 2px 6px rgb(0 0 0 / 0.5),
      inset 0 1px 0 rgb(255 255 255 / 0.14);
    font-family: var(--mono);
    font-size: 13px;
    color: #f4f6f8;
  }
  .line {
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pr {
    color: #969ba4;
  }
  .out {
    color: #969ba4;
    opacity: 0.35;
    transition: opacity 200ms ease-out;
  }
  .out.on {
    color: #f4f6f8;
    opacity: 1;
  }
  .out i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
  }

  /* I8, I9: glass (§6.4) */
  .layer {
    position: relative;
    flex: 1;
    display: grid;
    min-height: 300px;
  }
  .keyrow.big {
    position: absolute;
    inset: auto 0 18px 22%;
    margin: 0;
    gap: 22px;
  }
  .keyrow.big .ckey {
    min-height: 150px;
    cursor: default;
    font-size: 16px;
  }
  .ckey.glow {
    filter: brightness(1.12);
  }
  .glass {
    background: var(--glass-tint);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-edge);
    box-shadow: var(--glass-rim), var(--glass-shadow);
  }
  .pane {
    position: relative;
    z-index: 1;
    align-self: start;
    width: min(100%, 440px);
    padding: 24px;
    border-radius: 8px;
  }
  .pane .sub,
  .pane .hint {
    color: var(--muted);
  }
  @supports not (
    (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))
  ) {
    .glass {
      background: var(--glass-fallback);
    }
  }
  @media (prefers-reduced-transparency: reduce) {
    .glass {
      background: var(--glass-fallback);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }
  @media (forced-colors: active) {
    .glass {
      background: Canvas;
      backdrop-filter: none;
      border-color: CanvasText;
    }
  }

  /* I9: liquid */
  .v-I9 .bar.glass {
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .v-I9.lens .glass {
    backdrop-filter: var(--lens) blur(16px);
  }
  .v-I9 .glass {
    position: relative;
    overflow: hidden;
  }
  .v-I9 .glass::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: radial-gradient(
      220px circle at var(--mx) var(--my),
      var(--spec),
      transparent 60%
    );
    opacity: 0;
    transition: opacity 400ms ease-out;
  }
  .v-I9.moving .glass::after {
    opacity: 1;
  }
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: -6px;
    z-index: 1;
  }
  .card {
    display: flex;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 8px;
    font-size: 14px;
  }
  .card .v {
    color: var(--accent);
    font-weight: 600;
  }

  @container (max-width: 520px) {
    .stage {
      padding: 16px 16px 24px;
    }
    .links {
      display: none;
    }
    /* Four in one row at every width: a 2×2 of coloured squares is
       Microsoft's structure (memo §6.2). */
    .fields,
    .keyrow,
    .keyrow.big {
      gap: 8px;
    }
    .field,
    .ckey {
      padding: 8px;
      font-size: 12px;
    }
    .field .n {
      font-size: 22px;
    }
    .split {
      grid-template-columns: minmax(0, 1fr);
    }
    .keyrow.big {
      position: static;
      order: 2;
      margin-top: -44px;
    }
    .keyrow.big .ckey {
      min-height: 72px;
    }
    .layer {
      display: flex;
      flex-direction: column;
    }
    .pane {
      order: 1;
    }
    .cards {
      grid-template-columns: 1fr;
    }
  }
</style>
