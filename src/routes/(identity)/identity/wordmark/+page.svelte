<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import type { WordmarkVariant } from "#lib/identity/specimens/wordmark.svelte";
  import WordmarkSheet from "#lib/identity/specimens/wordmark-sheet.svelte";
  import { ordered, question } from "#lib/identity/questions";

  const q = question("wordmark");
</script>

<Board question={q}>
  {#each ordered(q) as option (option.id)}
    <Option {option}>
      {#snippet specimen()}
        <WordmarkSheet variant={option.id as WordmarkVariant} />
      {/snippet}
    </Option>
  {/each}
</Board>
