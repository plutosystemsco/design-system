<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import MarkSheet from "#lib/identity/specimens/mark-sheet.svelte";
  import { question } from "#lib/identity/questions";

  const q = question("mark");
  /** Each option's order and gap, as its text states them. */
  const CUT = {
    N1: { order: "kept", gap: 0.08 },
    N2: { order: "kept", gap: 0.16 },
    N3: { order: "pluto", gap: 0.08 },
    N4: { order: "pluto", gap: 0.16 },
  } as const;
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    {@const cut = CUT[option.id as keyof typeof CUT]}
    <Option {option}>
      {#snippet specimen()}
        <MarkSheet id={option.id} order={cut.order} gap={cut.gap} />
      {/snippet}
    </Option>
  {/each}
</Board>
