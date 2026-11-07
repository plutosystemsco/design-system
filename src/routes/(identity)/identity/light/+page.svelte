<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import LightCase from "#lib/identity/specimens/light-case.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import { look, type Light } from "#lib/identity/look";
  import { ordered, question } from "#lib/identity/questions";

  const q = question("light");
  // The stage keeps its four-colour moments (C2) on every option, so only the
  // light changes from one specimen to the next.
  const LIGHT: Record<string, Light> = {
    I1: "flat",
    I2: "bloom",
    I3: "four",
    I4: "glass",
  };
</script>

<Board question={q}>
  {#each ordered(q) as option (option.id)}
    <Option {option} bleed={!option.round}>
      {#snippet specimen()}
        {#if option.round}
          <div class="pair">
            {#each ["light", "dark"] as const as theme (theme)}
              <LightCase
                variant={option.id as "I5" | "I6" | "I7" | "I8" | "I9"}
                {theme}
              />
            {/each}
          </div>
        {:else}
          <StageHero
            label="{option.id}: {option.name}"
            compact
            invite
            look={look({ light: LIGHT[option.id] })}
          />
        {/if}
      {/snippet}
    </Option>
  {/each}
</Board>

<style>
  .pair {
    display: grid;
    gap: 16px;
  }
  @media (min-width: 1024px) {
    .pair {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
