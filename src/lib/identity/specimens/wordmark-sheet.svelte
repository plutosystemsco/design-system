<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import Ground from "./ground.svelte";
  import Mark from "./mark.svelte";
  import Wordmark, { RISEN, type WordmarkVariant } from "./wordmark.svelte";

  // One wordmark option, as the owner would meet it: the lockup at three
  // sizes on paper and on the stage, and the mark alone at app-icon and
  // favicon sizes, cut to that option's geometry.
  let { variant }: { variant: WordmarkVariant } = $props();

  const p = TODAY;
  const font = TYPE.D1.display;
  const paper: [string, string, string, string] = [
    p.blue,
    p.red,
    p.yellow,
    p.green,
  ];
  const lifted: [string, string, string, string] = [
    p.blueLifted,
    p.redLifted,
    p.yellowLifted,
    p.greenLifted,
  ];
  const SIZES = [96, 48, 24];
  /** The mark alone, in this option's geometry. */
  const GEOMETRY: Record<WordmarkVariant, { dot: number; gap: number }> = {
    ...RISEN,
    E2: { dot: 0.36, gap: 0.09 },
    E3: { dot: 0.22, gap: 0.06 },
    E4: { dot: 0.5, gap: 0.13 },
  };
  const g = $derived(GEOMETRY[variant]);
  /** Font size that makes the mark's box `px` wide, at this geometry. */
  const fit = (px: number, inset = 1) => (px * inset) / (2 * g.dot + g.gap);
</script>

<div class="sheet">
  {#each ["paper", "stage"] as const as ground (ground)}
    <Ground {ground} caption="{variant} · lockup on {ground}">
      <div class="sizes">
        {#each SIZES as size (size)}
          <div class="row">
            <span class="px"
              >{size} px{#if size === 96}<span class="scaled"
                  >&nbsp;· scaled to fit</span
                >{/if}</span
            >
            <div class="lockup" style="font-size:min({size}px, 100cqi / 3.7)">
              <Wordmark
                {variant}
                {font}
                colours={ground === "paper" ? paper : lifted}
                ink={ground === "paper" ? p.ink : p.stageText}
              />
            </div>
          </div>
        {/each}
      </div>
    </Ground>
  {/each}

  <Ground
    caption="{variant} · the mark alone: app icon 64, favicon 32 and 16"
    class="icons"
  >
    <div class="icon-row">
      {#each ["paper", "stage"] as const as ground (ground)}
        <div class="icon-set icon-set-{ground}">
          <div class="icon-cell">
            <span class="tile">
              <Mark
                colours={ground === "paper" ? paper : lifted}
                dot={g.dot}
                gap={g.gap}
                style="font-size:{fit(64, 0.6)}px"
              />
            </span>
            <span class="px">64</span>
          </div>
          {#each [32, 16] as size (size)}
            <div class="icon-cell">
              <span class="bare" style="width:{size}px;height:{size}px">
                <Mark
                  colours={ground === "paper" ? paper : lifted}
                  dot={g.dot}
                  gap={g.gap}
                  style="font-size:{fit(size)}px"
                />
              </span>
              <span class="px">{size}</span>
            </div>
          {/each}
          <span class="set-name"
            >on {ground === "paper" ? "white" : "stage"}</span
          >
        </div>
      {/each}
      <div class="browser" aria-hidden="true">
        <div class="tabs">
          <span class="tab active">
            <Mark
              colours={paper}
              dot={g.dot}
              gap={g.gap}
              style="font-size:{fit(16)}px"
            />
            <span class="tab-title">Pluto Docs</span>
          </span>
          <span class="tab">
            <Mark
              colours={paper}
              dot={g.dot}
              gap={g.gap}
              style="font-size:{fit(16)}px"
            />
            <span class="tab-title">Inbox · Pluto Mail</span>
          </span>
        </div>
        <div class="address"><span>docs.pluto.systems</span></div>
      </div>
    </div>
  </Ground>
</div>

<style>
  .sheet {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1fr);
  }
  @media (min-width: 1024px) {
    .sheet {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .sheet :global(.icons) {
      grid-column: 1 / -1;
    }
  }
  .sizes {
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding: 40px 32px 44px;
  }
  .row {
    /* the lockup shrinks only when a phone is narrower than it */
    container-type: inline-size;
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
  }
  .lockup {
    min-width: 0;
  }
  .scaled {
    display: none;
  }
  @media (max-width: 560px) {
    .sizes {
      gap: 28px;
      padding: 28px 20px 32px;
    }
    .row {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }
    .scaled {
      display: inline;
    }
  }
  .px {
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--g-muted);
  }
  .icon-row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 24px;
    padding: 32px;
  }
  .icon-set {
    display: grid;
    grid-template-columns: repeat(3, auto);
    align-items: end;
    justify-items: center;
    gap: 12px 28px;
    padding: 24px 28px 18px;
    border-radius: 8px;
  }
  .icon-set-paper {
    background: #e9ebe6;
    --tile: #ffffff;
    --tile-edge: #14161c1f;
  }
  .icon-set-stage {
    background: #050608;
    --g-muted: #9aa0ad;
    --tile: #0e1014;
    --tile-edge: #f7f7f424;
  }
  .set-name {
    grid-column: 1 / -1;
    justify-self: start;
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--g-muted);
  }
  .icon-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .tile {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 15px;
    background: var(--tile);
    box-shadow: inset 0 0 0 1px var(--tile-edge);
  }
  .bare {
    display: grid;
    place-items: center;
  }
  .browser {
    flex: 1 1 280px;
    max-width: 420px;
    min-width: 0;
    align-self: center;
    border-radius: 10px;
    overflow: hidden;
    background: #e3e5e0;
    box-shadow: inset 0 0 0 1px #14161c1f;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    color: #14161c;
  }
  .tabs {
    display: flex;
    gap: 2px;
    padding: 8px 8px 0;
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 0 1 170px;
    height: 32px;
    padding: 0 12px;
    border-radius: 8px 8px 0 0;
    color: #4a4f5c;
  }
  .tab.active {
    background: #ffffff;
    color: #14161c;
  }
  .tab-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .address {
    background: #ffffff;
    padding: 8px;
  }
  .address span {
    display: block;
    padding: 6px 12px;
    border-radius: 999px;
    background: #f1f2ef;
    color: #4a4f5c;
  }
</style>
