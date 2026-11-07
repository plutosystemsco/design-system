<script lang="ts">
  // The four-dot mark at the design book's geometry (dot .30 em, gap .08 em),
  // painted with candidate colours. Sized by font-size, like the registry's.
  let {
    colours,
    dot = 0.3,
    gap = 0.08,
    class: className = "",
    style = "",
  }: {
    colours: [string, string, string, string];
    dot?: number;
    gap?: number;
    class?: string;
    style?: string;
  } = $props();
</script>

<span
  aria-hidden="true"
  class="mark {className}"
  style="--dot:{dot}em;--gap:{gap}em;{style}"
>
  {#each colours as c, i (i)}<i style="background:{c}"></i>{/each}
</span>

<style>
  .mark {
    display: inline-grid;
    grid-template-columns: auto auto;
    gap: var(--gap);
    flex: none;
  }
  .mark i {
    display: block;
    width: var(--dot);
    height: var(--dot);
    border-radius: 50%;
  }
</style>
