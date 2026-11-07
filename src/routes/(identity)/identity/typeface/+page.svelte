<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import TypeSpecimen from "#lib/identity/specimens/type-specimen.svelte";
  import { look, TODAY, TYPE } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("typeface");
  const BRIEF = [
    "Circular dots on i, j and the punctuation, drawn at the mark's proportion: dot .30 em to gap .08 em.",
    "A mono sibling for code and labels, from the same skeleton.",
    "Variable weight and optical size, so one family runs from a 12 px label to a 160 px poster.",
    "Licensed under the OFL, or owned outright by Pluto Systems.",
  ];
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    <Option {option} bleed>
      {#snippet specimen()}
        <div class="mx-auto max-w-7xl px-6">
          <TypeSpecimen
            label="{option.id}: type specimen"
            type={TYPE[option.id]}
            palette={TODAY}
            standIn={option.id === "D5"
              ? "Instrument Sans: stand-in for a commissioned face"
              : undefined}
            brief={option.id === "D5" ? BRIEF : undefined}
          />
        </div>
        <div class="mt-8">
          <StageHero
            label="{option.id}: hero in this type"
            compact
            look={look({ type: TYPE[option.id] })}
          />
        </div>
      {/snippet}
    </Option>
  {/each}
</Board>
