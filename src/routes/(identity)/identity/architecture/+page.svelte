<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import ArchitectureSheet from "#lib/identity/specimens/architecture-sheet.svelte";
  import { question } from "#lib/identity/questions";

  const q = question("architecture");
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    <Option {option}>
      {#snippet specimen()}
        <ArchitectureSheet id={option.id as "A1" | "A2" | "A3" | "A4"} />
      {/snippet}
    </Option>
  {/each}
</Board>
