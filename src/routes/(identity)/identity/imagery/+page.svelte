<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import ImageryField from "#lib/identity/specimens/imagery-field.svelte";
  import ImageryFigure from "#lib/identity/specimens/imagery-figure.svelte";
  import ImageryPhoto from "#lib/identity/specimens/imagery-photo.svelte";
  import ImageryProduct from "#lib/identity/specimens/imagery-product.svelte";
  import { look } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("imagery");
  const l = look({});
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    {@const label = `${option.id}: ${option.name}, a layout sample`}
    <Option {option}>
      {#snippet specimen()}
        {#if option.id === "M1"}
          <ImageryProduct look={l} {label} />
        {:else if option.id === "M2"}
          <ImageryFigure look={l} {label} />
        {:else if option.id === "M3"}
          <ImageryPhoto look={l} {label} />
        {:else}
          <ImageryField look={l} {label} />
        {/if}
      {/snippet}
    </Option>
  {/each}
</Board>
