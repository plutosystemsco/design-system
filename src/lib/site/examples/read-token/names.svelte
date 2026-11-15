<script lang="ts" module>
  export const meta = {
    title: "The names it reads",
    intro:
      "A name is a variable's name without its two dashes. Only runtime variables read back: the theme's colours and the values on :root.",
  };
</script>

<script lang="ts">
  let { data }: { data: { colours: string[]; root: string[] } } = $props();
</script>

<div class="grid gap-8 md:grid-cols-2">
  <div>
    <h4 class="text-base font-bold">
      Colours, in each theme: {data.colours.length}
    </h4>
    <ul class="mt-2 grid gap-1 text-sm">
      {#each data.colours as name (name)}
        <li><code>{name}</code></li>
      {/each}
    </ul>
  </div>
  <div>
    <h4 class="text-base font-bold">On :root: {data.root.length}</h4>
    <ul class="mt-2 grid gap-1 text-sm">
      {#each data.root as name (name)}
        <li><code>{name}</code></li>
      {/each}
    </ul>
  </div>
</div>
