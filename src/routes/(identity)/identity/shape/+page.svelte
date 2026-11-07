<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import ShapeSet from "#lib/identity/specimens/shape-set.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import { look, SHAPE } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("shape");
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    <Option {option} bleed>
      {#snippet specimen()}
        <div class="mx-auto max-w-7xl px-6">
          <ShapeSet
            label="{option.id}: components on paper"
            look={look({ shape: SHAPE[option.id] })}
          />
        </div>
        <div class="mt-8">
          <StageHero
            label="{option.id}: hero in this shape"
            compact
            look={look({ shape: SHAPE[option.id] })}
          />
        </div>
      {/snippet}
    </Option>
  {/each}
</Board>
