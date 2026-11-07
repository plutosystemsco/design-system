<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import ProofBand from "#lib/identity/specimens/proof-band.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import { look, SCALE } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("scale");
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    {@const l = look({ scale: SCALE[option.id] })}
    <Option {option} bleed>
      {#snippet specimen()}
        <StageHero label="{option.id}: hero at this ceiling" look={l} />
        <ProofBand
          label="{option.id}: proof numbers at {l.scale.proofMax} px"
          look={l}
        />
      {/snippet}
    </Option>
  {/each}
</Board>
