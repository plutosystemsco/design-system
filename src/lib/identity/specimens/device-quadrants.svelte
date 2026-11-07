<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import Ground from "./ground.svelte";

  // F3, quadrants: the 2×2 as a layout. A poster cut into four, a feature
  // grid whose cards each own one quadrant, and icon tiles cut the same way.
  // Colours in Pluto's order (N3): blue, green / yellow, red.
  const p = TODAY;
  const ORDER = [
    { c: p.blue, on: "#FFFFFF", lifted: p.blueLifted },
    { c: p.green, on: p.stage, lifted: p.greenLifted },
    { c: p.yellow, on: p.ink, lifted: p.yellowLifted },
    { c: p.red, on: p.stage, lifted: p.redLifted },
  ];
  const FEATURES = [
    { title: "Write", line: "Docs and Sheets on one data layer." },
    { title: "Find", line: "Search every file you may read." },
    { title: "Send", line: "Mail that knows the document." },
    { title: "Govern", line: "One kernel checks every read." },
  ];
  const ICONS = ["Docs", "Sheets", "Search", "Mail"];
</script>

<Ground
  ground="stage"
  caption="f3 · quadrants · poster, feature grid, icon tiles"
>
  <div
    class="f3"
    style="--display:{TYPE.D5.display};--body:{TYPE.D5.body};--mono:{TYPE.D5
      .mono};--t:{p.stageText};--m:{p.stageMuted};--raised:{p.stageRaised}"
  >
    <div class="poster" aria-label="A poster cut into four panels">
      <div class="q" style="background:{ORDER[0].c};color:{ORDER[0].on}">
        <span class="q-eyebrow">pluto workspace</span>
        <span class="q-head">Work runs on data.</span>
      </div>
      <div class="q" style="background:{ORDER[1].c};color:{ORDER[1].on}">
        <span class="q-eyebrow">02</span>
        <span class="q-word">Docs</span>
      </div>
      <div class="q" style="background:{ORDER[2].c};color:{ORDER[2].on}">
        <span class="q-eyebrow">03</span>
        <span class="q-word">Search</span>
      </div>
      <div class="q" style="background:{ORDER[3].c};color:{ORDER[3].on}">
        <span class="q-eyebrow">04</span>
        <span class="q-word">Kernel</span>
      </div>
    </div>

    <div class="side">
      <p class="label">feature grid · each card owns a quadrant</p>
      <ul class="features">
        {#each FEATURES as f, i (f.title)}
          <li class="card">
            <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
              {#each [0, 1, 2, 3] as k (k)}
                <rect
                  x={(k % 2) * 12}
                  y={Math.floor(k / 2) * 12}
                  width="10"
                  height="10"
                  rx="2.5"
                  fill={k === i ? ORDER[i].lifted : "#F7F7F4"}
                  opacity={k === i ? 1 : 0.14}
                />
              {/each}
            </svg>
            <span class="card-title">{f.title}</span>
            <span class="card-line">{f.line}</span>
          </li>
        {/each}
      </ul>

      <p class="label">icon tiles · the app's quadrant lit</p>
      <ul class="icons">
        {#each ICONS as name, i (name)}
          <li>
            <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">
              <rect
                width="56"
                height="56"
                rx="14"
                fill={p.stageRaised}
                stroke="#F7F7F4"
                stroke-opacity="0.12"
              />
              {#each [0, 1, 2, 3] as k (k)}
                <rect
                  x={10 + (k % 2) * 19}
                  y={10 + Math.floor(k / 2) * 19}
                  width="17"
                  height="17"
                  rx="4"
                  fill={k === i ? ORDER[i].lifted : "#F7F7F4"}
                  opacity={k === i ? 1 : 0.12}
                />
              {/each}
            </svg>
            <span>{name}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</Ground>

<style>
  .f3 {
    display: grid;
    grid-template-columns: minmax(0, 400px) minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    min-height: 440px;
    padding: 24px;
    color: var(--t);
    font-family: var(--body);
  }
  .poster {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    aspect-ratio: 1;
    width: 100%;
  }
  .q {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    padding: 16px;
    border-radius: 14px;
  }
  .q-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
  }
  .q-head {
    font-family: var(--display);
    font-size: clamp(22px, 3.4vw, 30px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.035em;
  }
  .q-word {
    font-family: var(--display);
    font-size: clamp(24px, 3.4vw, 34px);
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1;
  }
  .side {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }
  .label {
    margin: 0;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--m);
  }
  .features {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 0 0 12px;
    padding: 0;
    list-style: none;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border: 1px solid #f7f7f41a;
    border-radius: 14px;
    background: var(--raised);
  }
  .card svg {
    margin-bottom: 6px;
  }
  .card-title {
    font-family: var(--display);
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .card-line {
    font-size: 14px;
    line-height: 1.4;
    color: var(--m);
  }
  .icons {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .icons li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--m);
  }
  @media (max-width: 860px) {
    .f3 {
      grid-template-columns: minmax(0, 1fr);
      padding: 16px;
    }
    .poster {
      max-width: 400px;
    }
  }
</style>
