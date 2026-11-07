<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import { look, type Behaviour } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("colour-behaviour");
  const BEHAVIOUR: Record<string, Behaviour> = {
    C1: "paper",
    C2: "moments",
    C3: "fields",
    C4: "stage",
  };
  const LIGHT = { C1: "flat", C2: "four", C3: "flat", C4: "bloom" } as const;
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    <Option {option} bleed>
      {#snippet specimen()}
        <StageHero
          label="{option.id}: {option.name}"
          compact
          look={look({
            behaviour: BEHAVIOUR[option.id],
            light: LIGHT[option.id as keyof typeof LIGHT],
          })}
        />
      {/snippet}
    </Option>
  {/each}
</Board>
