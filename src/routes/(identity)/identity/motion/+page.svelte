<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import MotionDemo from "#lib/identity/specimens/motion-demo.svelte";
  import { look } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("motion");
  const recommended = look({});
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    <Option {option}>
      {#snippet specimen()}
        <MotionDemo
          kind={option.id as "J1" | "J2" | "J3" | "J4"}
          look={recommended}
          label="{option.id}: {option.name}, live"
        />
      {/snippet}
    </Option>
  {/each}
</Board>
