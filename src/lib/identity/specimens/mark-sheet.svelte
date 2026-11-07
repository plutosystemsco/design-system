<script lang="ts">
  import { TODAY } from "../look.ts";
  import Ground from "./ground.svelte";
  import Mark from "./mark.svelte";

  // One option for the mark's order and spacing: the mark large on paper and
  // on the stage, then at favicon sizes, then blurred, which is how a
  // fragment is first seen: does it read as one tile, or as two colons?
  let {
    id,
    order = "kept",
    gap = 0.08,
  }: {
    id: string;
    /** "kept": blue, red / yellow, green. "pluto": blue, green / yellow, red. */
    order?: "kept" | "pluto";
    /** The gap between dots, in em, on a .30 em dot. */
    gap?: number;
  } = $props();

  const p = TODAY;
  const DOT = 0.3;
  const colours = $derived<[string, string, string, string]>(
    order === "kept"
      ? [p.blue, p.red, p.yellow, p.green]
      : [p.blue, p.green, p.yellow, p.red],
  );
  const lifted = $derived<[string, string, string, string]>(
    order === "kept"
      ? [p.blueLifted, p.redLifted, p.yellowLifted, p.greenLifted]
      : [p.blueLifted, p.greenLifted, p.yellowLifted, p.redLifted],
  );
  const orderText = $derived(
    order === "kept"
      ? "blue, red / yellow, green"
      : "blue, green / yellow, red",
  );
  /** Font size that makes the mark's box `px` wide. */
  const fit = (px: number) => px / (2 * DOT + gap);
  const spec = $derived(
    `dot .30 em · gap ${gap.toFixed(2).slice(1)} em · ${orderText}`,
  );
</script>

<div class="sheet">
  {#each ["paper", "stage"] as const as ground (ground)}
    <Ground {ground} caption="{id} · 160 px on {ground}">
      <div class="hero">
        <span role="img" aria-label="The mark, {orderText}, gap {gap} em">
          <Mark
            colours={ground === "paper" ? colours : lifted}
            {gap}
            style="font-size:{fit(160)}px"
          />
        </span>
        <p class="spec">{spec}</p>
      </div>
    </Ground>
  {/each}

  <Ground caption="{id} · favicon sizes, and the squint test" class="wide">
    <div class="strip">
      {#each ["paper", "stage"] as const as ground (ground)}
        <div class="set set-{ground}">
          {#each [64, 32, 16] as size (size)}
            <div class="cell">
              <span class="box" style="width:{size}px;height:{size}px">
                <Mark
                  colours={ground === "paper" ? colours : lifted}
                  {gap}
                  style="font-size:{fit(size)}px"
                />
              </span>
              <span class="px">{size}</span>
            </div>
          {/each}
          <div class="cell">
            <span class="box squint" style="width:64px;height:64px">
              <Mark
                colours={ground === "paper" ? colours : lifted}
                {gap}
                style="font-size:{fit(64)}px"
              />
            </span>
            <span class="px">blurred</span>
          </div>
        </div>
      {/each}
      <div
        class="set set-lockup"
        role="img"
        aria-label="The lockup pluto with this mark, at 40 and 20 px"
      >
        {#each [40, 20] as size (size)}
          <span class="lockup" style="font-size:{size}px">
            pluto<Mark
              {colours}
              {gap}
              style="transform:translateY(calc(-1 * (0.38em + {DOT}em + {gap}em)))"
            />
          </span>
        {/each}
        <span class="px">in the lockup</span>
      </div>
      <p class="note">
        Blurred, the mark is seen the way a glance across a room sees it. A
        tight gap starts to merge into one tile; an open gap keeps four separate
        dots.
      </p>
    </div>
  </Ground>
</div>

<style>
  .sheet {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1fr);
  }
  @media (min-width: 768px) {
    .sheet {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .sheet :global(.wide) {
      grid-column: 1 / -1;
    }
  }
  .hero {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 340px;
    padding: 48px 24px 64px;
  }
  .spec {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 14px;
    margin: 0;
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--g-muted);
  }
  .strip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
    padding: 28px;
  }
  .set {
    display: flex;
    align-items: flex-end;
    gap: 28px;
    padding: 24px 28px 18px;
    border-radius: 8px;
  }
  .set-paper {
    background: #ffffff;
    box-shadow: inset 0 0 0 1px #14161c1a;
    --px: #4a4f5c;
  }
  .set-stage {
    background: #050608;
    box-shadow: inset 0 0 0 1px #f7f7f424;
    --px: #9aa0ad;
  }
  .set-lockup {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
    align-self: stretch;
    background: #ffffff;
    box-shadow: inset 0 0 0 1px #14161c1a;
    padding: 24px 28px;
  }
  .lockup {
    display: inline-flex;
    align-items: baseline;
    gap: 0.16em;
    font-family: "IBM Plex Sans Variable", system-ui, sans-serif;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    color: #14161c;
  }
  .cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .box {
    display: grid;
    place-items: center;
  }
  .squint {
    filter: blur(5px);
  }
  .px {
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--px);
  }
  .note {
    flex: 1 1 240px;
    max-width: 36ch;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--g-muted);
  }
  @media (max-width: 480px) {
    .set {
      gap: 18px;
      padding: 20px 18px 14px;
    }
  }
</style>
