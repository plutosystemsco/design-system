<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import Mark from "#lib/identity/specimens/mark.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import { look } from "#lib/identity/look";
  import { candidate } from "#lib/identity/palettes";
  import { question } from "#lib/identity/questions";

  const q = question("palette");
  const HUES = ["blue", "red", "yellow", "green"] as const;
  const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  // The references the distances are measured against; named, never drawn.
  const REF = { google: "Google", microsoft: "Microsoft" } as const;
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    {@const c = candidate(option.id)}
    {@const p = c.palette}
    <Option {option} bleed>
      {#snippet specimen()}
        <div class="mx-auto max-w-7xl px-6">
          <div
            class="pal"
            style="--paper:{p.paper};--ink:{p.ink};--soft:{p.inkSoft};--stage:{p.stage};--muted:{p.stageMuted};--line:{p.stageLine}"
          >
            <!-- The mark on paper and on the stage. -->
            <div class="marks">
              <div class="ground paper">
                <Mark
                  colours={[p.blue, p.red, p.yellow, p.green]}
                  class="big"
                />
                <span class="cap">on paper</span>
              </div>
              <div class="ground stage">
                <Mark
                  colours={[
                    p.blueLifted,
                    p.redLifted,
                    p.yellowLifted,
                    p.greenLifted,
                  ]}
                  class="big"
                />
                <span class="cap">on the stage</span>
              </div>
            </div>

            <!-- The four, named, with their roles. -->
            <div class="swatches">
              {#each HUES as hue (hue)}
                <div class="sw">
                  <div
                    class="chip"
                    style="background:{c.ramps[hue][5] && p[hue]}"
                  ></div>
                  <p class="nm">{c.names[hue]}</p>
                  <dl>
                    <div>
                      <dt>mark</dt>
                      <dd><i style="background:{p[hue]}"></i>{p[hue]}</dd>
                    </div>
                    <div>
                      <dt>text</dt>
                      <dd>
                        <i style="background:{p[`${hue}Text`]}"></i>{p[
                          `${hue}Text`
                        ]}
                      </dd>
                    </div>
                    <div>
                      <dt>lifted</dt>
                      <dd>
                        <i style="background:{p[`${hue}Lifted`]}"></i>{p[
                          `${hue}Lifted`
                        ]}
                      </dd>
                    </div>
                  </dl>
                  <p class="dist">
                    ΔE {c.distance.google[hue]} from {REF.google} · {c.distance
                      .microsoft[hue]} from {REF.microsoft}
                  </p>
                </div>
              {/each}
            </div>

            <!-- The ramps. -->
            <div
              class="ramps"
              role="table"
              aria-label="{option.name}: tonal ramps, steps 50 to 950"
            >
              <div role="row" class="rrow head">
                <span role="columnheader" class="rlabel"></span>
                {#each STEPS as s (s)}<span role="columnheader">{s}</span
                  >{/each}
              </div>
              {#each HUES as hue (hue)}
                <div role="row" class="rrow">
                  <span role="rowheader" class="rlabel">{hue}</span>
                  {#each c.ramps[hue] as hex, i (i)}
                    <span
                      role="cell"
                      class="step"
                      style="background:{hex}"
                      title="{hue} {STEPS[i]} {hex}"
                      ><span class="sr-only">{hex}</span></span
                    >
                  {/each}
                </div>
              {/each}
              <div role="row" class="rrow">
                <span role="rowheader" class="rlabel">neutrals</span>
                {#each ["paper", "raised", "wash", "paperSoft", "lineInput", "inkSoft", "inkWash", "inkRaised", "ink", "stageRaised", "stage"] as n (n)}
                  <span
                    role="cell"
                    class="step"
                    style="background:{c.neutrals[n]}"
                    title="{n} {c.neutrals[n]}"
                    ><span class="sr-only">{n} {c.neutrals[n]}</span></span
                  >
                {/each}
              </div>
            </div>

            <div class="facts">
              <p>
                <strong>{c.verdict.pass} of {c.verdict.required}</strong>
                counted contrast pairs pass (lowest text pair {c.verdict
                  .lowestText}:1).
                <strong>{c.verdict.graphicPass} of {c.verdict.graphics}</strong>
                graphic checks pass{c.verdict.graphicFail.length
                  ? `; fails: ${c.verdict.graphicFail.join(", ")}`
                  : ""}.
              </p>
              {#if c.drops.length}
                <p>Drops from the design book: {c.drops.join("; ")}.</p>
              {:else}
                <p>Keeps every colour law of the design book.</p>
              {/if}
            </div>
          </div>
        </div>
        <div class="mt-8">
          <StageHero
            label="{option.id}: {option.name}, on the reference hero"
            compact
            look={look({ palette: p })}
          />
        </div>
      {/snippet}
    </Option>
  {/each}
</Board>

<style>
  .pal {
    display: grid;
    gap: 32px;
  }
  .marks {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .ground {
    position: relative;
    display: grid;
    place-items: center;
    height: 280px;
    border-radius: 12px;
    border: 1px solid #14161c1a;
  }
  .ground.paper {
    background: var(--paper);
  }
  .ground.stage {
    background: var(--stage);
  }
  .ground :global(.big) {
    font-size: 220px;
  }
  .cap {
    position: absolute;
    left: 16px;
    bottom: 12px;
    font:
      500 12px/1 "JetBrains Mono Variable",
      monospace;
    letter-spacing: 0.08em;
    color: var(--soft);
  }
  .stage .cap {
    color: var(--muted);
  }
  .swatches {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .chip {
    height: 96px;
    border-radius: 8px;
  }
  .nm {
    margin-top: 12px;
    font-weight: 600;
  }
  dl {
    margin-top: 8px;
    display: grid;
    gap: 4px;
    font:
      13px/1.4 "JetBrains Mono Variable",
      monospace;
  }
  dl div {
    display: flex;
    gap: 8px;
  }
  dt {
    width: 48px;
    opacity: 0.7;
  }
  dd {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  dd i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  .dist {
    margin-top: 8px;
    font:
      12px/1.4 "JetBrains Mono Variable",
      monospace;
    opacity: 0.75;
  }
  .ramps {
    display: grid;
    gap: 4px;
  }
  .rrow {
    display: grid;
    grid-template-columns: 88px repeat(11, minmax(0, 1fr));
    gap: 4px;
    align-items: center;
  }
  .rrow.head span {
    font:
      11px/1 "JetBrains Mono Variable",
      monospace;
    opacity: 0.7;
    text-align: center;
  }
  .rlabel {
    font:
      12px/1 "JetBrains Mono Variable",
      monospace;
    opacity: 0.8;
  }
  .step {
    height: 36px;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px #14161c14;
  }
  .facts {
    display: grid;
    gap: 8px;
    max-width: 72ch;
  }
  @media (max-width: 760px) {
    .marks,
    .swatches {
      grid-template-columns: 1fr 1fr;
    }
    .ground {
      height: 180px;
    }
    .ground :global(.big) {
      font-size: 130px;
    }
    .rrow {
      grid-template-columns: 56px repeat(11, minmax(0, 1fr));
      gap: 2px;
    }
    .rrow.head span {
      font-size: 8px;
    }
    .step {
      height: 24px;
    }
  }
</style>
